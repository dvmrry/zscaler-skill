---
product: zcc
topic: "zcc-api"
title: "ZCC API surface — endpoints, wire format, SDK methods"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/"
  - "vendor/zscaler-sdk-python/docsrc/zs/zcc/"
author-status: draft
---

# ZCC API surface

Endpoint prefixes, authentication notes, and SDK method summary for the ZCC (Zscaler Client Connector) portal API.

## Base endpoint

All ZCC API paths live under:

```
/zcc/papi/public/v1
```

Full base URL: `https://api.zsapi.net/zcc/papi/public/v1`. Accessed via the same `ZscalerClient` used for ZIA/ZPA (OneAPI / ZIdentity auth). The ZCC portal API requires a tenant admin session; API client credentials need ZCC scopes (`zcc.*`).

## Authentication paths — OneAPI vs ZCC legacy

ZCC has **two coexisting auth flows**. Modern tenants use OneAPI; older tenants use ZCC's dedicated login endpoint.

### OneAPI path (modern tenants)

`ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` (or `ZSCALER_PRIVATE_KEY`), `ZSCALER_VANITY_DOMAIN`. SDK handles token exchange via ZIdentity at `https://<vanity>.zslogin.net/oauth2/v1/token` with `audience=https://api.zscaler.com`. See [`../shared/oneapi.md`](../shared/oneapi.md).

### ZCC legacy login

```http
POST https://api.zsapi.net/zcc/papi/auth/v1/login
Content-Type: application/json

{ "apiKey": "<key>", "secretKey": "<secret>" }
```

Response:

```json
{ "jwtToken": "<token>", "message": "..." }
```

The returned `jwtToken` goes in `Authorization: Bearer <jwtToken>` on subsequent calls. Path lives under `/zcc/papi/auth/v1` (not `public/v1`). The endpoint catalog notes both `/zcc/papi/public/v1/auth/token` (the modernized variant in some captures) and the legacy `/zcc/papi/auth/v1/login` form — confirm which your tenant accepts.

### Cross-product admin sync (operational behavior worth knowing)

ZCC maintains its **own copy** of admin user lists from ZIA, ZDX, and ZPA. The sync surface:

- `POST /zcc/papi/public/v1/sync/admins` — synchronizes the local copy of admin users (general).
- `POST /zcc/papi/public/v1/sync/ziaZdxAdmins` — pulls ZIA + ZDX admins into ZCC.
- `POST /zcc/papi/public/v1/sync/zpaAdmins` — pulls ZPA admins into ZCC.

Implication: when a ZIA admin is added, they don't automatically appear in ZCC's admin view until a sync runs. Periodic / on-demand sync is the operator's responsibility (or scripted via these endpoints). Explains "I'm a ZIA admin but can't see myself in the ZCC portal" — you weren't synced yet.

## SDK services under `client.zcc.*`

| Service | Purpose | Notes |
|---|---|---|
| `client.zcc.forwarding_profile` | CRUD on forwarding profiles | See [`./forwarding-profile.md`](./forwarding-profile.md) for semantics. |
| `client.zcc.trusted_networks` | CRUD on TrustedNetwork entities | See [`./trusted-networks.md`](./trusted-networks.md). List endpoint wraps results under `trustedNetworkContracts`. |
| `client.zcc.fail_open_policy` | Get / update the per-tenant fail-open policy | See `./forwarding-profile.md § Fail-open policy`. |
| `client.zcc.web_policy` | On-device web policy (URL filtering, SSL intercept, etc.) | Distinct from ZIA URL Filtering. Per-platform schema (Windows/Linux/iOS/Android) — see the `WebPolicy.SNAKE_CASE_KEYS` set in the SDK model for which fields stay snake_case on the wire. |
| `client.zcc.web_privacy` | Telemetry collection policy (log upload, packet capture, etc.) | |
| `client.zcc.devices` | Device inventory and lifecycle | Includes force-remove and query by user. |
| `client.zcc.entitlements` | ZPA and ZDX group entitlements | Which user/group is entitled to which service. |
| `client.zcc.company` | Tenant company info | Read-only tenant metadata. |
| `client.zcc.admin_user` | ZCC portal admin RBAC | Portal admins distinct from ZIA/ZPA admins. |
| `client.zcc.secrets` | OTP + uninstall/logout passwords | Used to block end-users from removing ZCC. |

## Wire format quirks

- **camelCase on the wire.** All JSON keys are camelCase (`dnsSearchDomains`, `trustedDhcpServers`, etc.). The SDK exposes snake_case Python names and translates; any tooling hitting the JSON directly (e.g., `jq` on snapshot files) must use the camelCase keys.
- **`WebPolicy` mixes cases.** Uniquely among ZCC models, `WebPolicy` keeps certain keys as snake_case on the wire — `device_type`, `pac_url`, `reauth_period`, `install_ssl_certs`, `bypass_mms_apps`, `quota_in_roaming`, `wifi_ssid`, `limit`, `billing_day`, `allowed_apps`, `custom_text`, `bypass_android_apps`, and per-platform password fields. The SDK's `SNAKE_CASE_KEYS` set (`zscaler/zcc/models/webpolicy.py`) is the authoritative list. When writing WebPolicy payloads by hand, do not camelCase these fields.
- **CSV strings for multi-value fields.** TrustedNetwork criteria (`dnsServers`, `trustedSubnets`, etc.) are comma-separated strings, not JSON arrays. Tooling splits on `,` and trims whitespace.
- **Endpoint paths are verb-suffixed.** `.../listByCompany`, `.../create`, `.../edit`, `.../{id}/delete` — not RESTful resource patterns. Scripts that build URLs manually need to follow the suffix convention per method.
- **`/edit` takes POST on some endpoints and PUT on others.** `webForwardingProfile/edit` uses POST; `webFailOpenPolicy/edit` and `webTrustedNetwork/edit` use PUT. The SDK handles this, but hand-crafted HTTP calls need to match each endpoint's convention.
- **List responses for `trusted_networks` are wrapped.** `/webTrustedNetwork/listByCompany` returns a body with `trustedNetworkContracts: [...]`, not a bare array.
- **`/getOtp` is cache-prone.** End-user OTP retrieval (`GET /zcc/papi/public/v1/getOtp?udid={udid}`) can be cached by intermediate proxies / CDNs, returning a stale OTP. Workaround documented by Zscaler: append a dummy random query parameter, e.g. `?udid=...&_=<random>`. The SDK does this internally; hand-crafted HTTP calls need to apply it.

## Rate limits

ZCC has the **tightest rate limits in the OneAPI suite**: 100 calls/hour at the tenant level, with **3 calls/day** for the three CSV-export endpoints (`/downloadDevices`, `/downloadServiceStatus`, `/downloadDisableReasons`). Headers: `X-Rate-Limit-Remaining`, `X-Rate-Limit-Retry-After-Seconds` — note the `X-Rate-Limit-*` form (different from ZIA's `x-ratelimit-*` and ZDX's `RateLimit-*`). See [`../shared/oneapi.md § ZCC — flat tenant-wide`](../shared/oneapi.md).

## Method summary by service

### `client.zcc.forwarding_profile`

- `list_by_company(query_params={...})` — `GET /webForwardingProfile/listByCompany`. Paginated; query params `page`, `page_size`, `search`.
- `update_forwarding_profile(**kwargs)` — `POST /webForwardingProfile/edit` (yes, POST despite "edit"). Takes full profile payload including `forwardingProfileActions` and `forwardingProfileZpaActions` sub-lists.
- `delete_forwarding_profile(profile_id)` — `DELETE /webForwardingProfile/{id}/delete`.

No `add_forwarding_profile` in the current SDK — profiles are created via a different mechanism, likely the ZCC admin portal wizard; API-only creation is not exposed.

### `client.zcc.trusted_networks`

- `list_by_company(query_params={...})` — `GET /webTrustedNetwork/listByCompany`. Results wrapped in `trustedNetworkContracts`.
- `add_trusted_network(**kwargs)` — `POST /webTrustedNetwork/create`.
- `update_trusted_network(**kwargs)` — `PUT /webTrustedNetwork/edit`.
- `delete_trusted_network(network_id)` — `DELETE /webTrustedNetwork/{id}/delete`.

### `client.zcc.fail_open_policy`

- `list_by_company(query_params={...})` — `GET /webFailOpenPolicy/listByCompany`. Typically returns a single policy per tenant — the "list" is a historical artifact of the endpoint design.
- `update_failopen_policy(**kwargs)` — `PUT /webFailOpenPolicy/edit`. Takes `id`, `active`, `enable_fail_open`, `enable_captive_portal_detection`, `captive_portal_web_sec_disable_minutes`, `tunnel_failure_retry_count`, and the other FailOpenPolicy fields.

## Common SDK patterns

The most-used call patterns inline. For full method signatures see `vendor/zscaler-sdk-python/zscaler/zcc/`. For auth-selection decision tree, see [`../_meta/runbooks.md § Authentication selection`](../_meta/runbooks.md).

```python
from zscaler import ZscalerClient

client = ZscalerClient({...})  # OneAPI; for legacy use LegacyZCCClient (apiKey + secretKey)

# Pattern 1: list-and-paginate
def list_all(method, **kwargs):
    items, resp, err = method(**kwargs)
    if err: raise RuntimeError(f"{method.__qualname__}: {err}")
    out = list(items)
    while resp.has_next():
        more, resp, err = resp.next()
        if err: raise RuntimeError(f"pagination: {err}")
        out.extend(more)
    return out

profiles = list_all(client.zcc.forwarding_profile.list_profiles)
devices = list_all(client.zcc.devices.list_devices)
web_policies = list_all(client.zcc.web_policy.list_by_company,
                        query_params={"device_type": "windows"})

# Pattern 2: force-remove a device
# (regular remove leaves a tombstone; force-remove deletes the record outright)
_, _, err = client.zcc.devices.force_remove_devices(udid=["abc123", "def456"])
if err: raise RuntimeError(f"force_remove: {err}")

# Pattern 3: WARNING — web_policy_edit() is broken on v1.9.13–v1.9.14 (status v2.0.0 unconfirmed)
# Per upstream issue zscaler/zscaler-sdk-python#458, every web_policy_edit() call returns 400
# regardless of body. If you hit this, work around via direct HTTP or upgrade-and-retest.
# See ./web-policy.md for the workaround status.

# Pattern 4: error-handling wrapper
def call(method, *args, **kwargs):
    data, resp, err = method(*args, **kwargs)
    if err: raise RuntimeError(f"{method.__qualname__} failed: {err}")
    return data
```

For troubleshooting these patterns, see [`../_meta/runbooks.md § Troubleshooting flows`](../_meta/runbooks.md).

## Snapshotting ZCC configuration

`scripts/snapshot-refresh.py` currently does not dump ZCC resources. Adding them means extending `refresh_zia(...)` (misleadingly named — it's a full-tenant refresh orchestrator) with entries for:

```python
("zcc-forwarding-profiles", "forwarding_profile.list_by_company", "zcc"),
("zcc-trusted-networks",    "trusted_networks.list_by_company", "zcc"),
("zcc-fail-open-policy",    "fail_open_policy.list_by_company", "zcc"),
```

…then extending the service-resolution from `getattr(client.zia, svc)` to handle a `zcc` namespace. Not done yet; follow-up for a fork admin that wants ZCC-aware tenant-specific answers. See `PLAN.md § 4. Snapshot schema docs` for the general rationale.

## Open questions

See also `../_meta/clarifications.md` entries `zcc-01` through `zcc-06` — enum values on key fields are all inferred from field names and not validated by the SDK.

- How are forwarding profiles assigned to users/devices? The SDK has `list_by_company` but no assignment API surface. Likely handled via ZCC App Profiles (not exposed under `client.zcc` at all). Track as [`clarification zcc-07`](../_meta/clarifications.md#zcc-07-forwarding-profile-assignment-to-usersdevices).
