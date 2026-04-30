---
product: shared
topic: "agent-patterns"
title: "Executable patterns for AI agents"
content-type: reference
last-verified: "2026-04-25"
confidence: high
source-tier: code
sources:
  - "scripts/agent_patterns.py"
  - "scripts/diagnose-tenant.py"
  - "references/shared/oneapi.md"
  - "references/runbooks.md"
author-status: reviewed
---

# Executable patterns for AI agents

The rest of the skill is **descriptive** (how Zscaler behaves) and **procedural** (what steps a human operator takes). This doc is **executable**: typed Python functions an AI agent can lift verbatim into a tool environment, or import from `scripts/agent_patterns.py`.

The runbook (`runbooks.md`) is the human-shaped layer; this is the agent-shaped layer. They cover the same ground from different angles.

## How to consume this

Two paths:

1. **Import the module** — `scripts/agent_patterns.py` is dependency-free except for the Zscaler SDK (and the SDK is only needed for `smoke_test_creds` / `enumerate_endpoints`):
   ```python
   import sys; sys.path.insert(0, "scripts")
   import agent_patterns as ap
   cls, _ = ap.detect_cloud(env={"ZSCALER_CLOUD": "zscalergov"})
   # cls == "gov"
   ```

2. **Copy-paste a function** — every pattern below is self-contained in the doc and in the module. Paste into your runtime if the import path isn't available.

The runnable CLI `scripts/diagnose-tenant.py` is a worked-example consumer that calls every pattern in one pass.

## Pattern 1 — `detect_cloud` (cloud class detection)

**What it answers:** "Is this tenant on a commercial cloud, a gov cloud, or unknown?"

**Why agents need this:** gov clouds force-require legacy auth. OneAPI is unsupported. Pick the wrong path → 401 on every call.

```python
GOV_CLOUDS = frozenset({"zscalergov", "zscalerten", "GOV", "GOVUS"})
COMMERCIAL_CLOUDS = frozenset({
    "zscaler.net", "zscalertwo.net", "zscalerthree.net",
    "zscloud.net", "zscalerbeta.net", "zscalerone.net",
})
GOV_DOMAIN_PATTERNS = [
    re.compile(r"\.zscalergov\.net$", re.IGNORECASE),
    re.compile(r"\.zscalerten\.net$", re.IGNORECASE),
    re.compile(r"\.zpagov\.net$", re.IGNORECASE),
    re.compile(r"\.zpagov-us\.net$", re.IGNORECASE),
]

def detect_cloud(env=None, admin_url=None):
    """Returns (cloud_class, details) — cloud_class ∈ {'commercial', 'gov', 'unknown'}."""
    env = env or {}
    cloud_value = env.get("ZSCALER_CLOUD") or env.get("ZIA_CLOUD")
    if cloud_value:
        if cloud_value in GOV_CLOUDS:
            return ("gov", {"cloud": cloud_value, "source": "env"})
        if cloud_value in COMMERCIAL_CLOUDS:
            return ("commercial", {"cloud": cloud_value, "source": "env"})
    if admin_url:
        for pattern in GOV_DOMAIN_PATTERNS:
            if pattern.search(admin_url):
                return ("gov", {"admin_url": admin_url, "source": "url"})
        if "admin." in admin_url and "zscaler" in admin_url:
            return ("commercial", {"admin_url": admin_url, "source": "url"})
    if not cloud_value and not admin_url:
        return ("commercial", {"source": "default", "note": "ZSCALER_CLOUD unset = default commercial"})
    return ("unknown", {"hints": {"env_cloud": cloud_value, "admin_url": admin_url}})
```

**Usage:**
```python
detect_cloud(env={"ZSCALER_CLOUD": "zscalergov"})
# → ('gov', {'cloud': 'zscalergov', 'source': 'env'})

detect_cloud(admin_url="admin.zscalerten.net")
# → ('gov', {'admin_url': 'admin.zscalerten.net', 'source': 'url'})

detect_cloud(env={})
# → ('commercial', {'source': 'default', 'note': 'ZSCALER_CLOUD unset = default commercial'})
```

## Pattern 2 — `is_gov_cloud` (gov-cloud boolean check)

**What it answers:** "Should this tenant be using legacy auth?" (true if gov cloud)

**Why agents need this:** the most-frequently-needed binary signal. Wraps `detect_cloud` for the common case.

```python
def is_gov_cloud(env=None, admin_url=None):
    cloud_class, _ = detect_cloud(env=env, admin_url=admin_url)
    return cloud_class == "gov"
```

**Usage:**
```python
if is_gov_cloud(env=os.environ):
    client = LegacyZIAClient(...)  # Forced legacy
else:
    client = ZscalerClient(...)    # OneAPI eligible
```

## Pattern 3 — `detect_auth_framework` (which auth is configured)

**What it answers:** "Given these env vars, what auth path is the script set up for?"

**Returns:** `'oneapi' | 'zia-legacy' | 'zpa-legacy' | 'zcc-legacy' | 'zdx-legacy' | 'unknown'`

**Why agents need this:** before instantiating a client, confirm the env has what's needed. Avoids silent failures from missing env vars.

```python
def detect_auth_framework(env=None):
    env = env or {}
    if env.get("ZSCALER_USE_LEGACY", "").lower() == "true":
        # Operator explicit; resolve to most-specific legacy path
        for prefix, fw in [
            ("ZIA_", "zia-legacy"), ("ZPA_", "zpa-legacy"),
            ("ZCC_", "zcc-legacy"), ("ZDX_", "zdx-legacy"),
        ]:
            if any(k.startswith(prefix) for k in env):
                return fw
        return "unknown"
    has_oneapi = (
        env.get("ZSCALER_CLIENT_ID")
        and env.get("ZSCALER_VANITY_DOMAIN")
        and (env.get("ZSCALER_CLIENT_SECRET") or env.get("ZSCALER_PRIVATE_KEY"))
    )
    if has_oneapi:
        return "oneapi"
    if env.get("ZIA_USERNAME") and env.get("ZIA_API_KEY"):
        return "zia-legacy"
    if env.get("ZPA_CLIENT_ID") and env.get("ZPA_CUSTOMER_ID"):
        return "zpa-legacy"
    if env.get("ZCC_CLIENT_ID") or env.get("ZCC_API_KEY"):
        return "zcc-legacy"
    if env.get("ZDX_CLIENT_ID") and env.get("ZDX_CLIENT_SECRET"):
        return "zdx-legacy"
    return "unknown"
```

## Pattern 4 — `smoke_test_creds` (verify creds work)

**What it answers:** "Do my credentials actually work?" Runs one low-cost API call per product.

**Why agents need this:** fail fast on auth misconfiguration. Most operations against a misconfigured client return cryptic 401s on every call; smoke-testing once at startup surfaces the failure with a clear cause.

```python
SMOKE_CALLS = {
    "zia": ("zia.activation", "get_status"),
    "zpa": ("zpa.connector_groups", "list_groups"),
    "zcc": ("zcc.devices", "list_devices"),
    "zdx": ("zdx.apps", "list_apps"),
    "ztw": ("ztw.activation", "get_status"),
    "zwa": ("zwa.dlp_incidents", "search"),
}

def smoke_test_creds(client, product="zia"):
    """Returns SmokeResult(ok, product, note, detail). Does NOT raise."""
    if product not in SMOKE_CALLS:
        return SmokeResult(False, product, f"unknown product '{product}'")
    path, method_name = SMOKE_CALLS[product]
    target = client
    try:
        for attr in path.split("."):
            target = getattr(target, attr)
        method = getattr(target, method_name)
    except AttributeError as e:
        return SmokeResult(False, product, f"SDK doesn't expose {path}.{method_name}: {e}")
    try:
        result = method()
        if isinstance(result, tuple) and len(result) == 3:
            _, _, err = result
            if err:
                err_str = str(err).lower()
                if "401" in err_str or "unauthor" in err_str:
                    return SmokeResult(False, product, "credentials rejected (401)", {"err": str(err)})
                if "429" in err_str or "rate" in err_str:
                    return SmokeResult(False, product, "rate-limited (429) — creds likely OK")
                return SmokeResult(False, product, f"API error: {err}")
        return SmokeResult(True, product, "OK", {"call": f"{path}.{method_name}"})
    except Exception as e:
        return SmokeResult(False, product, f"exception: {type(e).__name__}: {e}")
```

**Usage:**
```python
result = smoke_test_creds(client, product="zia")
if not result.ok:
    raise RuntimeError(f"ZIA creds failed smoke test: {result.note}")
```

## Pattern 5 — `enumerate_endpoints` (list available services per product)

**What it answers:** "What can I call on this client?" (without grepping SDK source)

**Why agents need this:** dynamic discovery beats hardcoded endpoint lists. Especially useful when the SDK version bumps and surfaces change.

```python
def enumerate_endpoints(client):
    """Returns {'zia': [services...], 'zpa': [...], ...}."""
    out = {}
    for product in ("zia", "zpa", "zcc", "zdx", "ztw", "zwa"):
        product_client = getattr(client, product, None)
        if product_client is None:
            continue
        services = [
            name for name in dir(product_client)
            if not name.startswith("_")
        ]
        out[product] = sorted(set(services))
    return out
```

**For the official endpoint surface** (not just SDK-exposed methods), see the Postman collection at `vendor/zscaler-api-specs/oneapi-postman-collection.json` — 597 endpoints across all products. The Postman collection is the authoritative endpoint enumeration; the SDK exposes a subset.

## Pattern 6 — `interpret_error` (error → recovery action)

**What it answers:** "What should I do about this HTTP error?"

**Returns:** `ErrorInterpretation(code, label, action, note)` where `action ∈ {'retry', 'retry-after-header', 'fix-config', 'fix-creds', 'wait', 'escalate', 'no-recovery'}`.

**Why agents need this:** map status code + body to a recovery action without re-implementing Zscaler-specific error semantics in every script.

```python
def interpret_error(status_code, body=None):
    """Map a Zscaler API error to a recovery action. See runbooks.md § Troubleshooting flows for context."""
    body_dict = {}
    if isinstance(body, dict):
        body_dict = body
    elif isinstance(body, str) and body.strip():
        try:
            body_dict = json.loads(body)
        except Exception:
            body_dict = {"raw": body[:500]}
    label = str(body_dict.get("code") or body_dict.get("message") or "")

    if status_code == 400:
        if "DUPLICATE_ITEM" in label.upper():
            return ErrorInterpretation(400, "DUPLICATE_ITEM", "fix-config", "Name/ID exists; reuse or rename.")
        if "INVALID_INPUT_ARGUMENT" in label.upper():
            return ErrorInterpretation(400, "INVALID_INPUT_ARGUMENT", "fix-config", "Body has invalid field; check api.md.")
        return ErrorInterpretation(400, label or "Bad Request", "fix-config", "Check field types/enums.")
    if status_code == 401:
        return ErrorInterpretation(401, "Unauthorized", "fix-creds",
            "Common: missing audience param on OneAPI, expired secret, OneAPI on gov cloud (use legacy).")
    if status_code == 403:
        return ErrorInterpretation(403, "Forbidden", "fix-creds", "Auth OK, RBAC denies. Check API client scopes.")
    if status_code == 404:
        return ErrorInterpretation(404, "Not Found", "fix-config", "Verify ID, customer ID (ZPA), path.")
    if status_code == 409:
        if "EDIT_LOCK" in label.upper():
            return ErrorInterpretation(409, "EDIT_LOCK_NOT_AVAILABLE", "retry",
                "Concurrent writer holds the lock. Backoff + retry.")
        if "QUEUE_DEPTH" in label.upper() or "PROCESSING" in label.upper():
            return ErrorInterpretation(409, "Activation in progress", "wait", "Poll status ~30s. Don't stack.")
        if "STATE_INVALID" in label.upper():
            return ErrorInterpretation(409, "STATE_INVALID", "fix-config",
                "Pending change has bad config blocking activation; revert via console.")
        return ErrorInterpretation(409, label or "Conflict", "retry", "Retry with backoff; reconcile state.")
    if status_code == 429:
        return ErrorInterpretation(429, "Rate Limit exceeded", "retry-after-header",
            "Honor Retry-After header. Reduce concurrency. See oneapi.md § Rate limits for product variations.")
    if status_code == 503:
        if "READONLY" in label.upper():
            return ErrorInterpretation(503, "STATE_READONLY", "wait",
                "Tenant in scheduled-maintenance read-only mode.")
        return ErrorInterpretation(503, "Service Unavailable", "retry-after-header", "Service degradation.")
    if 500 <= status_code < 600:
        return ErrorInterpretation(status_code, "Server error", "retry-after-header",
            "Server-side. Honor Retry-After or backoff; escalate if persistent.")
    return ErrorInterpretation(status_code, label or f"HTTP {status_code}", "escalate", "Unrecognized; capture + escalate.")
```

**Usage in retry logic:**
```python
def call_with_recovery(method, max_retries=3):
    for attempt in range(max_retries):
        try:
            data, resp, err = method()
            if err is None:
                return data
            interp = interpret_error(resp.status_code if resp else 500, body=str(err))
            if interp.action == "retry-after-header":
                time.sleep(int(resp.headers.get("Retry-After", 5)))
                continue
            if interp.action == "retry":
                time.sleep(2 ** attempt)
                continue
            if interp.action in ("fix-config", "fix-creds", "no-recovery"):
                raise RuntimeError(f"{interp.label}: {interp.note}")
            if interp.action == "wait":
                time.sleep(30)
                continue
            raise RuntimeError(f"Unrecognized action {interp.action}: {interp.note}")
        except Exception as e:
            if attempt == max_retries - 1:
                raise
    raise RuntimeError(f"Exhausted {max_retries} retries")
```

## Composite — `diagnose_tenant`

One call to run all five patterns. Returns a structured `TenantDiagnosis` with cloud class, auth framework, smoke-test result (if client provided), endpoint enumeration, and advisory notes for common misconfigurations.

```python
def diagnose_tenant(env=None, admin_url=None, client=None, smoke_test_product="zia"):
    if env is None:
        env = dict(os.environ)
    cloud_class, cloud_details = detect_cloud(env=env, admin_url=admin_url)
    auth_framework = detect_auth_framework(env=env)
    forced_legacy = cloud_class == "gov"
    advisories = []
    if forced_legacy and auth_framework == "oneapi":
        advisories.append("Gov-cloud + OneAPI env vars: switch to legacy auth.")
    if auth_framework == "unknown":
        advisories.append("No recognizable auth env vars. Set OneAPI or legacy vars.")
    smoke = endpoints = None
    if client is not None:
        smoke = smoke_test_creds(client, product=smoke_test_product)
        if not smoke.ok:
            advisories.append(f"Smoke test {smoke_test_product} failed: {smoke.note}")
        try:
            endpoints = enumerate_endpoints(client)
        except Exception as e:
            advisories.append(f"Endpoint enumeration raised {type(e).__name__}")
    return TenantDiagnosis(cloud_class, cloud_details, auth_framework, forced_legacy, smoke, endpoints, advisories)
```

The runnable CLI `scripts/diagnose-tenant.py` is the consumer reference — it pretty-prints (text or JSON) the result of `diagnose_tenant()`.

## Cross-links

- Module source: `scripts/agent_patterns.py` (canonical implementation)
- Runnable CLI: `scripts/diagnose-tenant.py`
- Human-readable runbooks: [`runbooks.md`](runbooks.md)
- Auth framework reference: [`../shared/oneapi.md`](../shared/oneapi.md)
- Verification protocol (when adding new patterns): [`verification-protocol.md`](verification-protocol.md)
