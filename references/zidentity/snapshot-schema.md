---
product: zidentity
topic: "snapshot-schema"
title: "ZIdentity _data/snapshot/ schema — what's in the JSON, how to read it"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zid/models/users.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/api_client.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/resource_servers.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/common.py"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups.go"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go"
  - "vendor/zscaler-sdk-go/zscaler/oneapiconfig.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZIdentity _data/snapshot/ schema

Operational reference for ZIdentity resource shapes. ZIdentity config is **not currently snapshotted** — this doc describes the resource shapes you'd get if extended to dump them. Field sets are drawn from the Python and Go SDK models (the source of truth) and confirmed against the Postman collection's response samples; where the three disagree, the divergence is called out inline.

Anticipated ZIdentity snapshot outputs:

```
_data/snapshot/<cloud>/zidentity/users.json
_data/snapshot/<cloud>/zidentity/groups.json
_data/snapshot/<cloud>/zidentity/api-clients.json
_data/snapshot/<cloud>/zidentity/resource-servers.json
```

## Wire-format conventions for ZIdentity

- **Base URL + path prefix depend on which SDK made the call** — the same logical API has two hostnames and two prefixes:
  - **Python SDK** → host `https://api.zsapi.net` (non-prod: `https://api.{cloud}.zsapi.net`), prefix `/ziam/admin/api/v1` (vendor/zscaler-sdk-python/zscaler/request_executor.py:175-177; vendor/zscaler-sdk-python/zscaler/zid/users.py:31). Postman uses `{{ZIAMBase}}` for this.
  - **Go SDK** → host `https://{vanity}-admin.zslogin.net` (non-prod: `https://{vanity}-admin.zslogin{cloud}.net`), prefix `/admin/api/v1` — no `/ziam` (vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:402-414; the Go zid endpoint constants carry no `/ziam`, e.g. vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go:16). So a raw-HTTP caller's URL differs by language; the JSON body shape is the same either way.
- **camelCase JSON keys** (consistent with ZIA / ZPA).
- **String IDs** — `id: "..."`, not integers. Same as ZPA, different from ZIA.
- **List endpoints return a single paginated object** (not an array of pages) with this shape:
  ```json
  {
    "results_total": 1234,
    "pageOffset": 0,
    "pageSize": 100,
    "next_link": "...",
    "prev_link": null,
    "records": [ ... ]
  }
  ```
  The records are at `.records[]` (the Python list models deserialize a single object — `vendor/zscaler-sdk-python/zscaler/zid/models/users.py:36-67`). Some captured Postman fixtures wrap the body in a one-element array (`[ { ... } ]`); that wrap is a capture artifact, not the live list contract. The snapshot writer's own output shape governs whether you need `.records[]` or `.[0].records[]` — confirm against the writer once ZIdentity is actually snapshotted (see Open questions).
- **Snake_case wrapper fields** (`results_total`, `next_link`, `prev_link`) inside the otherwise-camelCase response. Distinct quirk (vendor/zscaler-sdk-python/zscaler/zid/models/users.py:39-43).
- **Embedded sub-objects** for cross-resource references (idp, department) — full `{ id, name, displayName }` objects (`CommonIDNameDisplayName`, vendor/zscaler-sdk-python/zscaler/zid/models/common.py:22,37-39), not just IDs.
- **Pagination**: `?offset=X&limit=Y` query parameters. Default limit varies by endpoint.

## `users.json`

API: `GET {prefix}/users` (Python `/ziam/admin/api/v1/users` // Go `/admin/api/v1/users`)

Field set verified against the Go struct (vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go:19-32), the Python `UserRecord` model (vendor/zscaler-sdk-python/zscaler/zid/models/users.py:84-122), and the Postman `ZIdentity > users > list` sample.

```json
{
  "results_total": 1234,
  "pageOffset": 0,
  "pageSize": 100,
  "next_link": "...",
  "prev_link": null,
  "records": [
    {
      "id": "...",
      "displayName": "Alice Engineer",
      "loginName": "alice@company.example.com",
      "primaryEmail": "alice@company.example.com",
      "secondaryEmail": null,
      "firstName": "Alice",
      "lastName": "Engineer",
      "status": true,                           // active vs disabled

      "source": "SCIM",                          // flat STRING: UI | API | SCIM | JIT
                                                 // (users.py docstring:187; Go users.go:21)

      "idp": {                                   // identity-provider context — CommonIDNameDisplayName
        "id": "...",
        "name": "Okta-Production",
        "displayName": "Okta Production"
      },

      "department": {
        "id": "...",
        "name": "engineering",
        "displayName": "Engineering"
      },

      "customAttrsInfo": {                       // ARBITRARY key-value map of IdP extension attrs,
        "employeeId": "...",                     // NOT a fixed schema. Postman sample keys are
        "costCenter": "..."                      // opaque (e.g. "sita2", "ea_9_"). Typed as
      }                                          // map[string]interface{} in Go (users.go:31).
    }
  ]
}
```

> **SDK shape divergence**: the Python `UserRecord` model (users.py:94-99) spuriously copies the group-only fields `isDynamicGroup`, `dynamicGroup`, `adminEntitlementEnabled`, `serviceEntitlementEnabled` onto the user record — these belong on groups, not users. The Go user struct and the Postman user sample do NOT carry them. A users.json built from the Python model will therefore emit four extra always-null fields per user; one built from the Go struct or raw wire body will not. Don't write jq that depends on those fields existing on users.

### Common jq queries

```bash
# All users (records from the paginated object)
jq '.records[] | {displayName, loginName, status, source, idp: .idp.name}' _data/snapshot/<cloud>/zidentity/users.json

# Disabled users
jq '.records[] | select(.status == false) | .loginName' _data/snapshot/<cloud>/zidentity/users.json

# Users by source (UI / API / SCIM / JIT)
jq '.records | group_by(.source) | map({source: .[0].source, count: length})' _data/snapshot/<cloud>/zidentity/users.json

# Users by IdP
jq '.records | group_by(.idp.name) | map({idp: .[0].idp.name, count: length})' _data/snapshot/<cloud>/zidentity/users.json

# Users with a specific custom attribute (customAttrsInfo is an open map — key name is tenant-specific)
jq '.records[] | select(.customAttrsInfo.costCenter == "ENG-1") | .loginName' _data/snapshot/<cloud>/zidentity/users.json
```

## `groups.json`

API: `GET {prefix}/groups`

Same outer wrapper shape. Field set verified against the Go struct (vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups.go:21-31), the Python `Groups` model (vendor/zscaler-sdk-python/zscaler/zid/models/groups.py:84-94), and the Postman `ZIdentity > groups > list` record. There is **no `displayName`** and **no `memberCount`** on a group record:

```json
{
  "id": "...",
  "name": "engineering-all",
  "description": "...",
  "source": "...",                              // string
  "idp": { "id": "...", "name": "...", "displayName": "..." },
  "isDynamicGroup": false,                       // dual flags — see index.md
  "dynamicGroup": false,
  "adminEntitlementEnabled": true,               // group confers admin entitlement
  "serviceEntitlementEnabled": true              // group confers service entitlement
}
```

The entitlement flags let you find admin-bearing or service-bearing groups without a second call. Dynamic-group *criteria* are not in the record (portal-only); only the `isDynamicGroup`/`dynamicGroup` flags surface here.

Group memberships are accessed via `GET /groups/{id}/users` — a separate endpoint, not embedded in the list response (vendor/zscaler-sdk-python/zscaler/zid/groups.py membership ops; vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups.go:92-93; Postman `Groups Ops get Group Members` → `{{ZIAMBase}}/groups/:id/users`). The response is the standard paginated wrapper of **full user records**, so the same `users.json` field set and jq apply.

### Common jq queries

```bash
# Groups conferring admin entitlement (admin-bearing groups)
jq '.records[] | select(.adminEntitlementEnabled == true) | .name' _data/snapshot/<cloud>/zidentity/groups.json

# Dynamic groups
jq '.records[] | select(.isDynamicGroup == true) | .name' _data/snapshot/<cloud>/zidentity/groups.json

# Groups from a specific IdP
jq '.records[] | select(.idp.name == "Okta-Production") | .name' _data/snapshot/<cloud>/zidentity/groups.json
```

> There is no membership count on the group record. To rank groups by size, fetch each group's members via `/groups/{id}/users` and count `.records | length` per group.

## `api-clients.json`

API: `GET {prefix}/api-clients` — **Python SDK only.** The Go SDK has no api-client service at all (vendor/zscaler-sdk-go/zscaler/zid/services/ holds only common, groups, resource_servers, user_entitlement, users), so client/secret automation requires the **Python SDK or raw API** — not Terraform (the vendored TF providers expose no ZIdentity api-client resource, and Terraform itself needs an API client to authenticate first).

The record carries only the fields below (vendor/zscaler-sdk-python/zscaler/zid/models/api_client.py:86-114; Postman `Apiclient Ops list`). There are **no** top-level `roles`, `scopes`, `audience`, `ipRestrictions`, `timeRestrictions`, `createdAt`, or `lastUsedAt` fields — scope grants live under `clientResources`, and secrets are a separate sub-resource (below).

```json
{
  "results_total": 12,
  "pageOffset": 0,
  "pageSize": 100,
  "records": [
    {
      "id": "...",
      "name": "Terraform-CICD",
      "description": "...",
      "status": true,
      "accessTokenLifeTime": 3600,

      "clientAuthentication": {                  // auth config — NO secrets nested here
        "authType": "SECRET",                    // SECRET | PUBKEYCERT | JWKS (api_client.py:167)
        "clientJWKsUrl": null,                   // JWKS → set this + publicKeys[]
        "publicKeys": [                          // JWKS → { keyName, keyValue }
          { "keyName": "...", "keyValue": "..." }
        ],
        "clientCertificates": [                  // PUBKEYCERT → { certContent }
          { "certContent": "..." }
        ]
      },

      "clientResources": [                       // where scope grants live (api_client.py:210-236)
        {
          "id": "...",
          "name": "Zscaler Internet Access (ZIA)",
          "defaultApi": true,
          "selectedScopes": [                    // { id, name } pairs
            { "id": "...", "name": "zia.url_categories:read" }
          ]
        }
      ]
    }
  ]
}
```

`authType` → auth artifact mapping: `SECRET` → secret material at `/api-clients/{id}/secrets` (below); `PUBKEYCERT` → `clientAuthentication.clientCertificates[].certContent`; `JWKS` → `clientAuthentication.clientJWKsUrl` + `publicKeys[]`.

**Secrets are a separate sub-resource** at `GET {prefix}/api-clients/{id}/secrets` (vendor/zscaler-sdk-python/zscaler/zid/api_client.py:414-415; model `APIClientSecrets`, api_client.py:287-318). The response **shape** is `{ id, createdAt, expiresAt, value }` — the SDK model maps a `value` field (`api_client.py:305`) and the Postman GET sample includes one. **But** the portal documents the client secret as shown-once / not retrievable after creation (see [`./api-clients.md`](./api-clients.md)), and the Postman sample value is a synthetic placeholder — so whether a live post-creation GET actually returns the **real** secret (vs `null`/masked) is **unverified from source** (see Open questions). Either way, **treat the secrets sub-resource as sensitive and do not snapshot `value`.** A snapshot would fetch this per client; it is not embedded in the api-client record.

```json
[
  { "id": "...", "createdAt": 1735689600, "expiresAt": 1798761600, "value": "..." }
]
```

**Note on secrets and snapshots**: the api-client RECORD never contains secret material — there is no `secrets[]` on the record. Secrets live only at `/api-clients/{id}/secrets`, which carries `id`/`createdAt`/`expiresAt` and a `value` field. A snapshot of the record alone shows no secrets; snapshotting the secrets sub-resource exposes `value`, so treat that output as sensitive. See [`./api-clients.md`](./api-clients.md).

### Common jq queries

```bash
# Clients with their scope grants (scopes live under clientResources, not top-level)
jq '.records[] | {name, status, resources: [.clientResources[] | {name, scopes: [.selectedScopes[].name]}]}' _data/snapshot/<cloud>/zidentity/api-clients.json

# Inactive clients
jq '.records[] | select(.status == false) | .name' _data/snapshot/<cloud>/zidentity/api-clients.json

# Clients using JWT-based auth (PUBKEYCERT / JWKS) rather than a shared secret
jq '.records[] | select(.clientAuthentication.authType != "SECRET") | {name, auth: .clientAuthentication.authType}' _data/snapshot/<cloud>/zidentity/api-clients.json
```

If the snapshot writer also dumps the secrets sub-resource per client (e.g. to `api-client-secrets.json` keyed by client id), rotation analysis runs against that file's `createdAt`/`expiresAt`, not the api-clients record.

## `resource-servers.json`

API: `GET {prefix}/resource-servers`

Resource Servers are the OAuth-defined services that API Clients can be scoped to (each Zscaler product is a Resource Server in OAuth terms). Field set verified against the Go struct (vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go:16-42) and the Python model (vendor/zscaler-sdk-python/zscaler/zid/models/resource_servers.py:84-101). The aud field is `primaryAud` (not `audience`); scopes are **grouped under `serviceScopes[].service`**, not flat; and there are **no `roles`** on a resource server (roles live on the Entitlement object — see user-entitlements.md):

```json
{
  "results_total": 7,
  "pageOffset": 0,
  "pageSize": 100,
  "records": [
    {
      "id": "...",
      "name": "Zscaler Internet Access (ZIA)",
      "displayName": "...",
      "description": "...",
      "primaryAud": "...",
      "defaultApi": true,
      "serviceScopes": [
        {
          "service": {                           // which underlying product these scopes belong to
            "id": "...",
            "name": "...",
            "displayName": "...",
            "cloudName": "...",
            "orgName": "..."
          },
          "scopes": [
            { "id": "...", "name": "zia.url_categories:read" },
            { "id": "...", "name": "zia.url_categories:write" }
          ]
        }
      ]
    }
  ]
}
```

The `serviceScopes[].service` grouping is the useful insight: scopes are partitioned by the underlying service (ZIA/ZPA/etc.) with `cloudName`/`orgName` context.

**Note**: resource-servers is **read-only in Python, Go, AND the API** — Python exposes only list/get (vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py), Go exposes only Get/GetAll/GetByName (vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go:46-96, no Create/Update/Delete), and Postman exposes only list+get. There is no SDK or API path to modify a resource server. (See gotcha #7 for the api-clients counterpart asymmetry.)

### Common jq queries

```bash
# All resource servers + scope counts (scopes are nested under serviceScopes)
jq '.records[] | {name, scope_count: ([.serviceScopes[].scopes[]] | length)}' _data/snapshot/<cloud>/zidentity/resource-servers.json

# All scopes for a specific product
jq '.records[] | select(.name | test("ZIA")) | .serviceScopes[].scopes[].name' _data/snapshot/<cloud>/zidentity/resource-servers.json

# Scopes grouped by underlying service
jq '.records[] | {product: .name, services: [.serviceScopes[] | {service: .service.name, scopes: [.scopes[].name]}]}' _data/snapshot/<cloud>/zidentity/resource-servers.json
```

## Adjacent surfaces NOT in the four-file snapshot above

These are real, source-confirmed ZIdentity surfaces that a snapshot could add — the strongest candidates for "who is admin where" answer the entitlement question that the user/group records only hint at via flags.

| Resource | API path | Backing | Why useful |
|---|---|---|---|
| Per-user admin entitlements | `/users/{id}/admin-entitlements` | Python+Go SDK (read-only) | Which admin roles a user holds — answers "who is admin where" (vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:57-58) |
| Per-user service entitlements | `/users/{id}/service-entitlements` | Python+Go SDK (read-only) | Which products a user is entitled to (user_entitlement.py:101-102) |
| Per-user group membership | `/users/{id}/groups` | Python+Go SDK | User→group resolution without scanning every group (vendor/zscaler-sdk-python/zscaler/zid/users.py:378) |

**ZIdentity colon-suffix verb endpoints** — a wire quirk distinct from REST sub-paths: user actions use a `:verb` suffix rather than a sub-resource path — `/users/{id}:resetpassword`, `/users/{id}:setskipmfa`, `/users/{id}:updatepassword` (Postman `ZIdentity > users`; commented-out Go stubs at vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go:134-150). These are mutation actions, not snapshot reads, and are unimplemented in both active SDKs — listed here only to document the URL convention.

## Wire-format gotchas (ZIdentity-specific)

1. **The list response is a single paginated object**, not an array of pages. Use `.records[]`. The `[ { ... } ]` one-element-array wrap appears only in some captured Postman fixtures; the live `GET .../users` body is the bare paginated object (vendor/zscaler-sdk-python/zscaler/zid/models/users.py:36-67). Only use `.[0].records[]` if the snapshot writer itself wraps pages in an array.

2. **`results_total`, `next_link`, `prev_link` are snake_case**, despite all other fields being camelCase. Quirk of the pagination wrapper.

3. **The api-client record never contains secret material** — there is no `secrets[]` on the record. Secrets live only at `/api-clients/{id}/secrets`, whose response shape carries `{ id, createdAt, expiresAt, value }` (`api_client.py:287-318`). Whether that `value` holds the real secret on a post-creation GET is **unverified** — the portal calls the secret not-retrievable after creation and the Postman sample value is synthetic. Regardless, treat the secrets sub-resource as sensitive; do not snapshot `value`.

4. **String IDs** — same as ZPA. `id: "..."` not integers.

5. **`authType` enum**: `SECRET` (shared secret), `PUBKEYCERT` (uploaded certificate → `clientCertificates[].certContent`), `JWKS` (`clientJWKsUrl` + `publicKeys[]`) (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:167`). Earlier `PRIVATE_KEY_JWT`/`JWKS_URL`/`PUBLIC_KEY` values were invented — they do not appear in the SDK or Postman.

6. **`source` on users is a flat string**, not a nested object. Values: `UI`, `API`, `SCIM`, `JIT` (vendor/zscaler-sdk-python/zscaler/zid/users.py:187; Go users.go:21). Tracks how the user entered ZIdentity.

7. **Cross-SDK CRUD asymmetry** (high-value): (a) **resource-servers is read-only everywhere** — Python, Go, and the API all expose only list/get; no SDK can modify a resource server. (b) **api-clients is Python-SDK-only** — the Go SDK has no api-client service at all, so client and secret automation requires the Python SDK or raw API (no ZIdentity api-client Terraform resource exists).

8. **Wire host + path differ by SDK** — same logical API: Python → `api.zsapi.net` + `/ziam/admin/api/v1`; Go → `{vanity}-admin.zslogin.net` + `/admin/api/v1` (vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:402-414; vendor/zscaler-sdk-python/zscaler/request_executor.py:175-177). The JSON body is identical; only the URL the snapshot writer hits changes.

## Open questions

- **Snapshot writer output shape** — whether a future ZIdentity snapshot stores the raw list body (so jq uses `.records[]`) or wraps pages in an array (so jq uses `.[0].records[]`) is a writer decision not yet made; ZIdentity is not currently snapshotted. The jq examples here assume the raw single-object body (matching the SDK list models). Confirm and re-document once the writer exists. This work should land alongside the in-flight `linear/dav-19-zidentity-refresh` branch. — see [clarification `zid-26`](../_meta/clarifications.md#zid-26-zidentity-snapshot-writer-output-shape)
- **Secrets snapshot file layout — and whether the secret is even retrievable.** If api-client secrets are dumped, the per-client file/key naming is undefined; more fundamentally, whether a live `GET /api-clients/{id}/secrets` returns the real `value` is unconfirmed — the response *shape* carries a `value` field but the portal calls the secret not-retrievable after creation and the only evidence it appears on GET is a synthetic Postman sample. Treat `value` as sensitive and consider excluding it entirely. — see [clarification `zid-27`](../_meta/clarifications.md#zid-27-secrets-snapshot-file-layout)
- **`status` field type on groups** — the user/group records expose `status` as a boolean (active/disabled) for users, but the group model does not carry a `status` field in either SDK; whether groups have an equivalent enabled/disabled flag on the wire is not confirmed from the captured sources. — see [clarification `zid-22`](../_meta/clarifications.md#zid-22-group-enableddisabled-flag-on-the-wire)

## Cross-links

- [`./api.md`](./api.md) — endpoint catalog
- [`./overview.md`](./overview.md) — ZIdentity architecture overview
- [`./api-clients.md`](./api-clients.md) — API Client object model
- [`../shared/scim-provisioning.md`](../shared/scim-provisioning.md) — cross-product user/group lifecycle
- [`../shared/admin-rbac.md`](../shared/admin-rbac.md) — federated admin model
- [`../_meta/layering-model.md`](../_meta/layering-model.md) — how snapshot data layers onto general docs
