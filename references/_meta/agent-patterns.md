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
  - "references/shared/oneapi.md"
  - "references/_meta/runbooks.md"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/constants.py"
  - "vendor/zscaler-sdk-go/zscaler/oneapiclient.go"
  - "vendor/terraform-provider-zia/docs/index.md"
  - "vendor/terraform-provider-zpa/docs/index.md"
author-status: reviewed
---

# Executable patterns for AI agents

The rest of the skill is **descriptive** (how Zscaler behaves) and
**procedural** (what steps a human operator takes). This doc is **executable**:
typed, pure Python functions an AI agent can lift verbatim into a tool
environment, or import from `scripts/agent_patterns.py`.

The runbook (`runbooks.md`) is the human-shaped layer; this is the agent-shaped layer. They cover the same ground from different angles.

## How to consume this

Two paths:

1. **Import the module** — `scripts/agent_patterns.py` is dependency-free and
   performs no network or SDK calls:
   ```python
   import sys; sys.path.insert(0, "scripts")
   import agent_patterns as ap
   cls, _ = ap.detect_cloud(env={"ZSCALER_CLOUD": "zscalergov"})
   # cls == "gov"
   ```

2. **Copy-paste a function** — every pattern below is self-contained in the doc and in the module. Paste into your runtime if the import path isn't available.

Credentialed observation is a separate boundary. When tenant facts are needed,
use supplied snapshots or command output, or request a bounded read-only
`zscalerctl --format json` call when the companion is available. Do not add SDK
clients, credential smoke tests, endpoint reflection, or raw API calls to this
module. See [`tooling.md`](tooling.md).

## Pattern 1 — `detect_cloud` (cloud class detection)

**What it answers:** "Is this tenant on a commercial cloud, a gov cloud, or unknown?"

**Why agents need this:** gov clouds no longer imply a single auth answer. Current Go/Python SDK releases model FedRAMP OneAPI routing for `cloud=gov` / `cloud=govus`, ZIA Terraform v4.7.25+ documents the same path, and ZPA Terraform `GOV` / `GOVUS` still requires legacy auth (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:404-438`; `vendor/zscaler-sdk-python/CHANGELOG.md:21`; `vendor/zscaler-sdk-python/zscaler/constants.py:21-28`; `vendor/terraform-provider-zia/docs/index.md:140-149`; `vendor/terraform-provider-zpa/docs/index.md:34`). Pick the wrong path → 401 on every call.

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

**What it answers:** "Is this tenant in a gov cloud family?" (true means auth must be chosen by client/provider support, not by cloud alone)

**Why agents need this:** the most-frequently-needed binary signal. Wraps `detect_cloud` for the common case.

```python
def is_gov_cloud(env=None, admin_url=None):
    cloud_class, _ = detect_cloud(env=env, admin_url=admin_url)
    return cloud_class == "gov"
```

**Usage:**
```python
if is_gov_cloud(env=provided_env):
    # Select the matching gov-cloud reference and verify client/provider support;
    # gov alone does not force one universal auth path.
    auth_family = detect_auth_framework(provided_env)
```

## Pattern 3 — `detect_auth_framework` (which auth is configured)

**What it answers:** "Given these env vars, what auth path is the script set up for?"

**Returns:** `'oneapi' | 'zia-legacy' | 'zpa-legacy' | 'zcc-legacy' | 'zdx-legacy' | 'unknown'`

**Why agents need this:** interpret a caller-provided, sanitized map of which
auth variables are present. The function checks presence only; callers should
use placeholders rather than pass credential values into an agent context.

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

## Pattern 4 — `interpret_error` (error → recovery action)

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
            "Common: missing audience param on OneAPI, expired secret, or wrong gov-cloud auth path for this client/provider.")
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

**Usage with a supplied error:**
```python
result = interpret_error(
    supplied_status_code,
    body=supplied_sanitized_error_body,
)
# result.action describes the recovery class; this function performs no retry
# and makes no tenant call.
```

## Cross-links

- Module source: `scripts/agent_patterns.py` (canonical implementation)
- Tenant-observation boundary: [`tooling.md`](tooling.md)
- Human-readable runbooks: [`runbooks.md`](runbooks.md)
- Auth framework reference: [`../shared/oneapi.md`](../shared/oneapi.md)
- Verification protocol (when adding new patterns): [`verification-protocol.md`](verification-protocol.md)
