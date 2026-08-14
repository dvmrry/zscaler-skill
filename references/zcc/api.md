---
product: zcc
topic: "zcc-api"
title: "ZCC API surface — endpoints, wire format, SDK methods"
content-type: reference
last-verified: "2026-06-18"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/terraform-provider-zcc: 37aaa1f69786ee5263b358c5248a5b4ce014ebb8
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/"
  - "vendor/zscaler-sdk-python/docsrc/zs/zcc/"
  - "vendor/terraform-provider-zcc/docs/index.md"
  - "vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend.go"
  - "vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend_test.go"
  - "vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md"
author-status: draft
---

# ZCC API surface

Endpoint prefixes, authentication notes, and SDK method summary for the ZCC (Zscaler Client Connector) portal API. For Terraform resource and data-source coverage, see [`./terraform.md`](./terraform.md).

## Base endpoint

Most ZCC API paths live under:

```
/zcc/papi/public/v1
```

Full base URL: `https://api.zsapi.net/zcc/papi/public/v1`. Accessed via the same `ZscalerClient` used for ZIA/ZPA (OneAPI / ZIdentity auth). The ZCC portal API requires a tenant admin session; API client credentials need ZCC scopes (`zcc.*`).

A newer **v2 family** lives under `/zcc/papi/public/v2` for three resource groups — notification templates, ZIA posture profiles, and trusted networks. See [v2 endpoints](#v2-endpoints) below; these are RESTful and paginate differently from v1.

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
| `client.zcc.application_profiles` | App Profiles CRUD | `/application-profiles`; get (list), get-by-id, and PATCH update. This is the assignment surface that scopes policies to users/device-groups (see Open questions `zcc-07`). |
| `client.zcc.custom_ip_base_apps` | Custom IP-based apps (read) | `/custom-ip-based-apps`; list + get-by-id. |
| `client.zcc.predefined_ip_based_apps` | Predefined IP-based apps (read) | `/predefined-ip-based-apps`; list + get-by-id. |
| `client.zcc.process_based_apps` | Process-based apps (read) | `/process-based-apps`; list + get-by-id. |
| `client.zcc.web_app_service` | Web app service (read) | `GET /webAppService/listByCompany`. |

## Wire format quirks

- **camelCase on the wire.** All JSON keys are camelCase (`dnsSearchDomains`, `trustedDhcpServers`, etc.). The SDK exposes snake_case Python names and translates; any tooling hitting the JSON directly (e.g., `jq` on snapshot files) must use the camelCase keys.
- **`WebPolicy` mixes cases.** Uniquely among ZCC models, `WebPolicy` keeps certain keys as snake_case on the wire — `device_type`, `pac_url`, `reauth_period`, `install_ssl_certs`, `bypass_mms_apps`, `quota_in_roaming`, `wifi_ssid`, `limit`, `billing_day`, `allowed_apps`, `custom_text`, `bypass_android_apps`, and per-platform password fields. The SDK's `SNAKE_CASE_KEYS` set (`zscaler/zcc/models/webpolicy.py`) is the authoritative list. When writing WebPolicy payloads by hand, do not camelCase these fields.
- **CSV strings for multi-value fields.** TrustedNetwork criteria (`dnsServers`, `trustedSubnets`, etc.) are comma-separated strings, not JSON arrays. Tooling splits on `,` and trims whitespace.
- **v1 endpoint paths are verb-suffixed.** `.../listByCompany`, `.../create`, `.../edit`, `.../{id}/delete` — not RESTful resource patterns. Scripts that build URLs manually need to follow the suffix convention per method. This applies to the `/zcc/papi/public/v1` surface; the [v2 family](#v2-endpoints) is RESTful instead.
- **`/edit` takes POST on some endpoints and PUT on others.** `webForwardingProfile/edit` uses POST; `webFailOpenPolicy/edit`, `webTrustedNetwork/edit`, and `web/policy/edit` use PUT. The SDK handles this, but hand-crafted HTTP calls need to match each endpoint's convention.
- **List responses for `trusted_networks` are wrapped.** `/webTrustedNetwork/listByCompany` returns a body with `trustedNetworkContracts: [...]`, not a bare array.
- **`/getOtp` is cache-prone.** End-user OTP retrieval (`GET /zcc/papi/public/v1/getOtp?udid={udid}`) can be cached by intermediate proxies / CDNs, returning a stale OTP. Workaround documented by Zscaler: append a dummy random query parameter, e.g. `?udid=...&_=<random>`. The SDK does this internally; hand-crafted HTTP calls need to apply it.
- **`getOtp` and `getPasswords` vend secrets on GET — scope accordingly.** Both return plaintext device secrets (uninstall/logout/disable passwords and OTPs) by design, so read access to `client.zcc.secrets` is functionally the ability to disable the endpoint agent on any device. Exclude this family from least-privilege read scopes — see [`../shared/secret-bearing-api-surfaces.md`](../shared/secret-bearing-api-surfaces.md).

## v2 endpoints

Three ZCC resource groups have a newer surface under `/zcc/papi/public/v2`. Unlike the verb-suffixed v1 paths, these are **RESTful** — `GET /…` (list), `GET /…/{id}` (read), `POST /…` (create), `PUT /…/{id}` (full update), `PATCH /…/{id}` (partial update), `DELETE /…/{id}` (delete):

| Resource group | Base path |
|---|---|
| Notification templates | `/zcc/papi/public/v2/notification-templates` |
| ZIA posture profiles | `/zcc/papi/public/v2/zia-posture-profiles` |
| Trusted networks (v2) | `/zcc/papi/public/v2/trusted-networks` |

**Pagination differs from v1.** v2 list endpoints are offset-based: `skip` + `perPage` query params (not v1's `page` / `page_size`), and the keyword search param is named `keyword` (not `search`). Per-group filters layer on top — e.g. `type` for trusted-networks, `platformType` for zia-posture-profiles. Note the v2 trusted-networks surface is distinct from the v1 `client.zcc.trusted_networks` service (`/webTrustedNetwork/listByCompany`), which is still present.

These v2 families are currently surfaced in the Go SDK (`zscaler-sdk-go/zscaler/zcc/services/{notification_template,zia_posture,trusted_network_v2}/`); the Python SDK's `client.zcc.trusted_networks` still targets the v1 path.

The Automate contract currently does **not** reconcile the v2 trusted-network resource: the generated ZCC divergence report notes that the captured Automate contract exposes only older v1 `webTrustedNetwork` operations (`vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md:34`). The refreshed Terraform provider probes `/zcc/papi/public/v2/trusted-networks` and uses its v1 adapter when the probe returns a status it classifies as endpoint-unavailable; that classification includes 400, 403, 404, 405, 501, and `resource.not.found` (`vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend.go:155-199`; `vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend_test.go:258-292`). This is provider behavior and a documented contract boundary, not proof that v2 supersedes v1 or that the two families share state.

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

### `client.zcc.web_policy`

Base path `/zcc/papi/public/v1/web/policy`.

- `list_by_company(query_params={...})` — `GET /web/policy/listByCompany`. Query params `page`, `page_size`, `device_type` (`ios`/`android`/`windows`/`macos`/`linux`), `search`, `search_type`.
- `web_policy_edit(**kwargs)` — `PUT /web/policy/edit` (PUT, **not** POST — unlike `webForwardingProfile/edit`). The SDK method forwards all kwargs unchanged through `zcc_to_wire(body, WebPolicy)` so the snake_case/camelCase mix lands correctly (`vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py:455-457`); it does not itself branch on create vs. update — the docstring describes it as "Adds or updates" (`:154`). The single endpoint serves both create and update **API-side**: per the CHANGELOG, the create path "silently rejects duplicate names with `success=false, id=0`" (`vendor/zscaler-sdk-python/CHANGELOG.md:477`), and a successful edit returns `{"success":"true","id":<int>}`.
- `activate_web_policy(**kwargs)` — `PUT /web/policy/activate`. Enables/disables a policy or app profile per platform; takes `device_type` and `policy_id`.
- `delete_web_policy(policy_id)` — `DELETE /web/policy/{id}/delete`.

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

profiles = list_all(client.zcc.forwarding_profile.list_by_company)
devices = list_all(client.zcc.devices.list_devices)
web_policies = list_all(client.zcc.web_policy.list_by_company,
                        query_params={"device_type": "windows"})

# Pattern 2: force-remove a device
# (regular remove leaves a tombstone; force-remove deletes the record outright)
_, _, err = client.zcc.devices.force_remove_devices(udid=["abc123", "def456"])
if err: raise RuntimeError(f"force_remove: {err}")

# Pattern 3: edit a web policy (create or update via the same endpoint)
# web_policy_edit() is functional as of SDK v1.9.31. It issues PUT /web/policy/edit
# and runs the body through zcc_to_wire(body, WebPolicy) so the snake_case/camelCase
# mix (WebPolicy.SNAKE_CASE_KEYS) lands correctly on the wire. The method forwards all
# kwargs unchanged (web_policy.py:455-457) — it does NOT branch on create vs. update.
# Create-vs-update is decided API-side: the create path silently rejects a duplicate
# name with success=false, id=0 (CHANGELOG.md:477). A successful /edit returns
# {"success":"true","id":<int>} — refetch via list_by_company(device_type=...) to read it back.
# History: early Python SDK builds v1.9.13–v1.9.14 had a regression where every call
# returned 400 (upstream issue zscaler/zscaler-sdk-python#458) — resolved by v1.9.25
# (PR #501; vendor/zscaler-sdk-python/CHANGELOG.md:469).
_, _, err = client.zcc.web_policy.web_policy_edit(
    name="corp-windows", device_type=3, active="1", rule_order=1,
    group_ids=[62718389], user_ids=["5807211"])  # no id => create
if err: raise RuntimeError(f"web_policy_edit: {err}")

# Pattern 4: error-handling wrapper
def call(method, *args, **kwargs):
    data, resp, err = method(*args, **kwargs)
    if err: raise RuntimeError(f"{method.__qualname__} failed: {err}")
    return data
```

For troubleshooting these patterns, see [`../_meta/runbooks.md § Troubleshooting flows`](../_meta/runbooks.md).

## Open questions

See also `../_meta/clarifications.md` entries `zcc-01` through `zcc-06` — enum values on key fields are all inferred from field names and not validated by the SDK.

- How are forwarding profiles assigned to users/devices? Partly answered: App Profiles **are** now exposed as `client.zcc.application_profiles` (`/application-profiles`, list + get-by-id + PATCH update), so the earlier "not exposed under `client.zcc` at all" framing is wrong. What remains unconfirmed: the exact field on an application profile that binds it to a forwarding profile vs. to users/device-groups, and whether the forwarding-profile-to-app-profile link is set on the app profile side or elsewhere. Track as [`clarification zcc-07`](../_meta/clarifications.md#zcc-07-forwarding-profile-assignment-to-usersdevices).
- v2 surface depth. The `/zcc/papi/public/v2` families (notification-templates, zia-posture-profiles, trusted-networks) are confirmed in the Go SDK but their request/response field schemas are not yet documented here, and the Python SDK does not expose them. The captured Automate contract still exposes the older v1 trusted-network operations rather than the Terraform/Go v2 path (`vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md:34`). Whether these v2 endpoints supersede or coexist with their v1 equivalents long-term is still not stated by source. Track as [clarification `zcc-80`](../_meta/clarifications.md#zcc-80-zcc-v1-vs-v2-endpoint-coexistence).
