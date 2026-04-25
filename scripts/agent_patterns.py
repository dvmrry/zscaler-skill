"""agent_patterns.py — executable patterns for AI agents and operators.

A small, dependency-free (stdlib + zscaler SDK) module with typed functions
covering the five most-asked diagnostic patterns:

  - detect_cloud()              — cloud class (commercial / gov / unknown)
  - is_gov_cloud()              — boolean check for gov-cloud forced-legacy
  - detect_auth_framework()     — OneAPI vs legacy from env vars
  - smoke_test_creds()          — verify a credential set actually works
  - enumerate_endpoints()       — list available SDK endpoints by product
  - interpret_error()           — map a Zscaler API error to a recovery action

Plus a composite:

  - diagnose_tenant()           — runs all of the above in one call

The companion markdown doc at references/_agent-patterns.md mirrors these
functions for in-context reference. The companion CLI at
scripts/diagnose-tenant.py pretty-prints diagnose_tenant() output.

These are pure functions over their inputs (no global state, no side effects
beyond what the names suggest). An AI agent can lift any function as-is.
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from typing import Any, Callable, Literal


# ----- cloud + auth detection ---------------------------------------------

GOV_CLOUDS = frozenset({"zscalergov", "zscalerten", "GOV", "GOVUS"})
COMMERCIAL_CLOUDS = frozenset(
    {
        "zscaler.net",
        "zscalertwo.net",
        "zscalerthree.net",
        "zscloud.net",
        "zscalerbeta.net",
        "zscalerone.net",
    }
)
GOV_DOMAIN_PATTERNS = [
    re.compile(r"\.zscalergov\.net$", re.IGNORECASE),
    re.compile(r"\.zscalerten\.net$", re.IGNORECASE),
    re.compile(r"\.zpagov\.net$", re.IGNORECASE),
    re.compile(r"\.zpagov-us\.net$", re.IGNORECASE),
]

CloudClass = Literal["commercial", "gov", "unknown"]
AuthFramework = Literal["oneapi", "zia-legacy", "zpa-legacy", "zcc-legacy", "zdx-legacy", "unknown"]


def detect_cloud(
    env: dict[str, str] | None = None,
    admin_url: str | None = None,
) -> tuple[CloudClass, dict[str, Any]]:
    """Identify the Zscaler cloud class a tenant is on.

    Inputs (any one is sufficient):
      env        : dict of env vars (e.g. os.environ). Checked: ZSCALER_CLOUD,
                   ZIA_CLOUD. If both unset, defaults to 'commercial' per the
                   ZSCALER_CLOUD-unset-for-production convention.
      admin_url  : a tenant admin URL like 'admin.zscalergov.net' or
                   'admin.zscalertwo.net'. Used as a secondary signal.

    Returns:
      (cloud_class, details_dict) where cloud_class is 'commercial' | 'gov' |
      'unknown', and details captures which signal fired and what was matched.

    Examples:
      >>> detect_cloud(env={"ZSCALER_CLOUD": "zscalergov"})
      ('gov', {'cloud': 'zscalergov', 'source': 'env'})
      >>> detect_cloud(env={})
      ('commercial', {'source': 'default', 'note': 'ZSCALER_CLOUD unset = default commercial'})
      >>> detect_cloud(admin_url="admin.zscalerten.net")
      ('gov', {'admin_url': 'admin.zscalerten.net', 'source': 'url'})
    """
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
        return (
            "commercial",
            {"source": "default", "note": "ZSCALER_CLOUD unset = default commercial"},
        )

    return (
        "unknown",
        {"hints": {"env_cloud": cloud_value, "admin_url": admin_url}},
    )


def is_gov_cloud(
    env: dict[str, str] | None = None, admin_url: str | None = None
) -> bool:
    """True iff the tenant is on a gov cloud (zscalergov, zscalerten, GOV, GOVUS).

    Gov clouds force-require legacy auth; OneAPI is unsupported.

    >>> is_gov_cloud(env={"ZSCALER_CLOUD": "zscalergov"})
    True
    >>> is_gov_cloud(env={"ZSCALER_CLOUD": "zscalertwo.net"})
    False
    >>> is_gov_cloud(env={})
    False
    """
    cloud_class, _ = detect_cloud(env=env, admin_url=admin_url)
    return cloud_class == "gov"


def detect_auth_framework(env: dict[str, str] | None = None) -> AuthFramework:
    """Identify which auth framework the env vars suggest.

    OneAPI: ZSCALER_CLIENT_ID + ZSCALER_VANITY_DOMAIN (and ZSCALER_CLIENT_SECRET
            or ZSCALER_PRIVATE_KEY).
    ZIA legacy: ZIA_USERNAME + ZIA_PASSWORD + ZIA_API_KEY (+ optional ZIA_CLOUD).
    ZPA legacy: ZPA_CLIENT_ID + ZPA_CLIENT_SECRET + ZPA_CUSTOMER_ID.
    ZCC legacy: ZCC_CLIENT_ID (apiKey) + ZCC_CLIENT_SECRET (secretKey) — naming
                varies; presence of ZCC_* + absence of ZSCALER_VANITY_DOMAIN signals legacy.
    ZDX legacy: ZDX_CLIENT_ID + ZDX_CLIENT_SECRET. ZDX never migrated to OneAPI.

    Returns the strongest match. If multiple frameworks have credentials present
    (common during migration), returns 'oneapi' — operators should be explicit
    in that case via ZSCALER_USE_LEGACY=true to pick legacy.

    >>> detect_auth_framework({"ZSCALER_CLIENT_ID": "x", "ZSCALER_VANITY_DOMAIN": "y", "ZSCALER_CLIENT_SECRET": "z"})
    'oneapi'
    >>> detect_auth_framework({"ZIA_USERNAME": "a", "ZIA_PASSWORD": "b", "ZIA_API_KEY": "c"})
    'zia-legacy'
    >>> detect_auth_framework({})
    'unknown'
    """
    env = env or {}
    if env.get("ZSCALER_USE_LEGACY", "").lower() == "true":
        # Operator explicitly chose legacy; resolve to the most-specific legacy path
        for prefix, fw in [
            ("ZIA_", "zia-legacy"),
            ("ZPA_", "zpa-legacy"),
            ("ZCC_", "zcc-legacy"),
            ("ZDX_", "zdx-legacy"),
        ]:
            if any(k.startswith(prefix) for k in env):
                return fw  # type: ignore[return-value]
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


# ----- credential smoke test ----------------------------------------------


@dataclass
class SmokeResult:
    ok: bool
    product: str
    note: str
    detail: dict[str, Any] = field(default_factory=dict)


# Map product → (sdk-attribute-path, low-cost call). The chosen calls are
# read-only and either return a small object or 0-page list. Adjust if a
# product changes its low-cost endpoint.
SMOKE_CALLS: dict[str, tuple[str, str]] = {
    "zia": ("zia.activation", "get_status"),
    "zpa": ("zpa.connector_groups", "list_groups"),
    "zcc": ("zcc.devices", "list_devices"),
    "zdx": ("zdx.apps", "list_apps"),
    "ztw": ("ztw.activation", "get_status"),
    "zwa": ("zwa.dlp_incidents", "search"),
}


def smoke_test_creds(client: Any, product: str = "zia") -> SmokeResult:
    """Verify a Zscaler client's credentials work by making one low-cost API call.

    Args:
      client : an instantiated zscaler client (ZscalerClient, LegacyZIAClient, etc.)
      product: which product to test against. Defaults to ZIA. See SMOKE_CALLS for the
               available products + the specific endpoint each one tests.

    Returns SmokeResult(ok, product, note, detail). On failure, `note` describes
    the failure mode in caller-actionable language ('credentials rejected',
    'rate-limited', etc.).

    Does NOT raise on auth failure; returns ok=False and a structured note.
    """
    if product not in SMOKE_CALLS:
        return SmokeResult(
            ok=False,
            product=product,
            note=f"unknown product '{product}' (known: {sorted(SMOKE_CALLS)})",
        )

    path, method_name = SMOKE_CALLS[product]
    target: Any = client
    try:
        for attr in path.split("."):
            target = getattr(target, attr)
        method = getattr(target, method_name)
    except AttributeError as e:
        return SmokeResult(
            ok=False,
            product=product,
            note=f"SDK doesn't expose {path}.{method_name}: {e}",
            detail={"path": path, "method": method_name},
        )

    try:
        result = method()
        # SDK returns (data, response, error) for most methods
        if isinstance(result, tuple) and len(result) == 3:
            _, _, err = result
            if err:
                err_str = str(err).lower()
                if "401" in err_str or "unauthor" in err_str:
                    return SmokeResult(False, product, "credentials rejected (401)", {"err": str(err)})
                if "429" in err_str or "rate" in err_str:
                    return SmokeResult(False, product, "rate-limited (429) — creds likely OK", {"err": str(err)})
                return SmokeResult(False, product, f"API error: {err}", {"err": str(err)})
        return SmokeResult(True, product, "OK", {"call": f"{path}.{method_name}"})
    except Exception as e:
        return SmokeResult(False, product, f"exception during call: {type(e).__name__}: {e}", {"exception": type(e).__name__})


# ----- endpoint enumeration -----------------------------------------------


def enumerate_endpoints(client: Any) -> dict[str, list[str]]:
    """Walk the SDK client's products and enumerate the public service attributes.

    For each product attribute (zia, zpa, zcc, zdx, ztw, zwa), lists the
    service modules / methods present. Useful for an agent that wants to
    know "what's available?" without grepping SDK source.

    Returns: dict like {'zia': ['activation', 'url_filtering_rules', ...], 'zpa': [...]}
    """
    out: dict[str, list[str]] = {}
    for product in ("zia", "zpa", "zcc", "zdx", "ztw", "zwa"):
        product_client = getattr(client, product, None)
        if product_client is None:
            continue
        services = [
            name
            for name in dir(product_client)
            if not name.startswith("_") and not callable(getattr(product_client, name, None))
        ]
        # Also capture top-level callables (some products expose direct methods)
        services.extend(
            name
            for name in dir(product_client)
            if not name.startswith("_") and callable(getattr(product_client, name, None))
        )
        out[product] = sorted(set(services))
    return out


# ----- error code interpretation ------------------------------------------

# Recovery action vocabulary
ErrorAction = Literal[
    "retry",  # transient failure; backoff + retry
    "retry-after-header",  # honor Retry-After
    "fix-config",  # caller's config is wrong; needs human fix
    "fix-creds",  # auth issue; rotate or re-config
    "wait",  # eventual-consistency / activation in progress
    "escalate",  # contact support / TAM
    "no-recovery",  # operation isn't possible (e.g., read-only mode)
]


@dataclass
class ErrorInterpretation:
    code: int
    label: str
    action: ErrorAction
    note: str


def interpret_error(status_code: int, body: str | dict | None = None) -> ErrorInterpretation:
    """Map a Zscaler API error response to a recovery action.

    Combines HTTP status with the body's `code` / `message` fields where
    present. Used by retry/recovery logic in callers.

    Common Zscaler error codes documented inline:

      400 INVALID_INPUT_ARGUMENT        — caller's body is malformed; fix-config
      400 DUPLICATE_ITEM                — name/ID already exists; fix-config
      401 (auth failure)                — fix-creds
      403 (forbidden)                   — RBAC / scope; fix-creds
      404 (not found)                   — resource doesn't exist; fix-config
      409 EDIT_LOCK_NOT_AVAILABLE       — concurrent writer; retry with backoff
      409 STATE_PROCESSING_QUEUE_*      — activation in progress; wait
      409 STATE_INVALID                 — pending change has bad config; fix-config
      429 Rate Limit ... exceeded       — retry-after-header
      503 STATE_READONLY                — scheduled maintenance; wait
      5xx (other)                       — retry-after-header / escalate

    Returns ErrorInterpretation with code, label, recovery action, and note.

    >>> r = interpret_error(401)
    >>> r.action
    'fix-creds'
    >>> r = interpret_error(429)
    >>> r.action
    'retry-after-header'
    """
    body_dict: dict[str, Any] = {}
    if isinstance(body, dict):
        body_dict = body
    elif isinstance(body, str) and body.strip():
        try:
            import json
            body_dict = json.loads(body)
        except Exception:
            body_dict = {"raw": body[:500]}

    label = str(body_dict.get("code") or body_dict.get("message") or "")

    if status_code == 400:
        if "DUPLICATE_ITEM" in label.upper():
            return ErrorInterpretation(400, "DUPLICATE_ITEM", "fix-config",
                "Name or ID already exists. Either reuse the existing resource or pick a different identifier.")
        if "INVALID_INPUT_ARGUMENT" in label.upper():
            return ErrorInterpretation(400, "INVALID_INPUT_ARGUMENT", "fix-config",
                "Request body has an invalid field value. Read the message for the offending field; check enum values against api.md.")
        return ErrorInterpretation(400, label or "Bad Request", "fix-config",
            "Request rejected by API. Check field types, enum values, required fields against the relevant api.md.")

    if status_code == 401:
        return ErrorInterpretation(401, "Unauthorized", "fix-creds",
            "Auth rejected. Common causes: missing audience parameter on OneAPI, expired/rotated secret, OneAPI on a gov cloud (use legacy).")

    if status_code == 403:
        return ErrorInterpretation(403, "Forbidden", "fix-creds",
            "Auth succeeded but RBAC denies. Check the API client's scopes in ZIdentity (or admin role for legacy auth).")

    if status_code == 404:
        return ErrorInterpretation(404, "Not Found", "fix-config",
            "Resource doesn't exist. Verify the ID, customer ID (ZPA), or path. May be a stale reference.")

    if status_code == 409:
        if "EDIT_LOCK" in label.upper():
            return ErrorInterpretation(409, "EDIT_LOCK_NOT_AVAILABLE", "retry",
                "Concurrent writer holds the activation lock. Retry with exponential backoff; if persistent, identify and coordinate with the other writer.")
        if "QUEUE_DEPTH" in label.upper() or "PROCESSING" in label.upper():
            return ErrorInterpretation(409, "Activation in progress", "wait",
                "Another activation is in flight. Poll status with ~30s interval; do not stack activations.")
        if "STATE_INVALID" in label.upper():
            return ErrorInterpretation(409, "STATE_INVALID", "fix-config",
                "A pending change has a config error blocking activation. Use admin console to find the offending change and revert/fix.")
        return ErrorInterpretation(409, label or "Conflict", "retry",
            "Conflict with current state. Retry with backoff; if persistent, reconcile state.")

    if status_code == 429:
        return ErrorInterpretation(429, "Rate Limit exceeded", "retry-after-header",
            "Honor the Retry-After header. Reduce concurrency. ZIA uses weight-based, ZPA per-IP, ZDX tier-based — see oneapi.md § Rate limits.")

    if status_code == 503:
        if "READONLY" in label.upper() or body_dict.get("x-zscaler-mode") == "read-only":
            return ErrorInterpretation(503, "STATE_READONLY", "wait",
                "Tenant is in scheduled-maintenance read-only mode. Writes refused; retry after maintenance window.")
        return ErrorInterpretation(503, "Service Unavailable", "retry-after-header",
            "Service degradation. Honor Retry-After if present, otherwise exponential backoff.")

    if 500 <= status_code < 600:
        return ErrorInterpretation(status_code, "Server error", "retry-after-header",
            "Server-side issue. Honor Retry-After; if persistent, escalate to support.")

    return ErrorInterpretation(status_code, label or f"HTTP {status_code}", "escalate",
        "Unrecognized error shape. Capture full response and escalate.")


# ----- composite diagnose -------------------------------------------------


@dataclass
class TenantDiagnosis:
    cloud_class: CloudClass
    cloud_details: dict[str, Any]
    auth_framework: AuthFramework
    forced_legacy: bool
    smoke_test: SmokeResult | None
    endpoints: dict[str, list[str]] | None
    advisories: list[str]


def diagnose_tenant(
    env: dict[str, str] | None = None,
    admin_url: str | None = None,
    client: Any | None = None,
    smoke_test_product: str = "zia",
) -> TenantDiagnosis:
    """One-call diagnostic combining the patterns above.

    Args:
      env                : env var dict (default: os.environ)
      admin_url          : optional admin URL for cloud detection
      client             : optional instantiated SDK client for smoke test + endpoint enumeration
      smoke_test_product : which product to smoke-test against if client given

    Returns a TenantDiagnosis with cloud class, auth framework, smoke test
    result, endpoint enumeration, and advisory notes (e.g., "OneAPI configured
    but tenant is gov-cloud — use legacy instead").
    """
    if env is None:
        env = dict(os.environ)

    cloud_class, cloud_details = detect_cloud(env=env, admin_url=admin_url)
    auth_framework = detect_auth_framework(env=env)
    forced_legacy = cloud_class == "gov"

    advisories: list[str] = []
    if forced_legacy and auth_framework == "oneapi":
        advisories.append(
            "Gov-cloud tenant + OneAPI env vars: OneAPI is not supported on gov clouds. "
            "Switch to the relevant legacy auth path."
        )
    if auth_framework == "unknown":
        advisories.append(
            "No recognizable auth env vars found. Set OneAPI vars (ZSCALER_CLIENT_ID + "
            "_SECRET + _VANITY_DOMAIN) or product-specific legacy vars."
        )

    smoke = None
    endpoints = None
    if client is not None:
        smoke = smoke_test_creds(client, product=smoke_test_product)
        if not smoke.ok:
            advisories.append(
                f"Smoke test against {smoke_test_product} failed: {smoke.note}"
            )
        try:
            endpoints = enumerate_endpoints(client)
        except Exception as e:
            advisories.append(f"Endpoint enumeration raised {type(e).__name__}: {e}")

    return TenantDiagnosis(
        cloud_class=cloud_class,
        cloud_details=cloud_details,
        auth_framework=auth_framework,
        forced_legacy=forced_legacy,
        smoke_test=smoke,
        endpoints=endpoints,
        advisories=advisories,
    )


__all__ = [
    "GOV_CLOUDS",
    "COMMERCIAL_CLOUDS",
    "CloudClass",
    "AuthFramework",
    "ErrorAction",
    "SmokeResult",
    "ErrorInterpretation",
    "TenantDiagnosis",
    "detect_cloud",
    "is_gov_cloud",
    "detect_auth_framework",
    "smoke_test_creds",
    "enumerate_endpoints",
    "interpret_error",
    "diagnose_tenant",
    "SMOKE_CALLS",
]
