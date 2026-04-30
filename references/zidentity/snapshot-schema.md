---
product: zidentity
topic: "snapshot-schema"
title: "ZIdentity _data/snapshot/ schema — what's in the JSON, how to read it"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-sdk-python/zscaler/zidentity/"
author-status: draft
---

# ZIdentity _data/snapshot/ schema

Operational reference for ZIdentity resource shapes. ZIdentity is **not currently in `scripts/snapshot-refresh.py`** — this doc describes the resource shapes you'd get if extended to dump them, drawn from the Postman collection (which has rich ZIdentity response samples — 26 of them).

When extending `snapshot-refresh.py` for ZIdentity, anticipated outputs:

```
_data/snapshot/zidentity/users.json
_data/snapshot/zidentity/groups.json
_data/snapshot/zidentity/api-clients.json
_data/snapshot/zidentity/resource-servers.json
```

## Wire-format conventions for ZIdentity

- **Base URL prefix**: `/ziam/admin/api/v1` under `https://api.zsapi.net/`. Postman uses `{{ZIAMBase}}` as the variable.
- **camelCase JSON keys** (consistent with ZIA / ZPA).
- **String IDs** — `id: "..."`, not integers. Same as ZPA, different from ZIA.
- **List endpoints return wrapped paginated response** with this shape:
  ```json
  [
    {
      "results_total": -17257431,
      "pageOffset": 0,
      "pageSize": 100,
      "next_link": "...",
      "prev_link": "...",
      "records": [ ... ]
    }
  ]
  ```
  Note the array-of-one-page wrap. The actual records are at `[0].records[]`.
- **Snake_case wrapper fields** (`results_total`, `next_link`, `prev_link`) inside the otherwise-camelCase response. Distinct quirk.
- **Embedded sub-objects** for cross-resource references (groups, departments, IdPs, etc.) — full `{ id, name, displayName }` objects, not just IDs.
- **Pagination**: `?offset=X&limit=Y` query parameters. Default limit varies by endpoint.

## `users.json`

API: `GET /ziam/admin/api/v1/users`

```json
[
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

        "idp": {                                  // identity-provider context
          "id": "...",
          "name": "Okta-Production",
          "description": "..."
        },

        "source": {                                // how the user was created
          "type": "SCIM_PROVISIONING",            // or SAML_JIT, MANUAL, etc.
          "description": "..."
        },

        "department": {
          "id": "...",
          "name": "engineering",
          "displayName": "Engineering"
        },

        "customAttrsInfo": {                      // extension attributes from IdP
          "employeeId": "...",
          "costCenter": "..."
        }
      }
    ]
  }
]
```

### Common jq queries

```bash
# All users (records flattened from page wrapper)
jq '.[0].records[] | {displayName, loginName, status, idp: .idp.name}' _data/snapshot/zidentity/users.json

# Disabled users
jq '.[0].records[] | select(.status == false) | .loginName' _data/snapshot/zidentity/users.json

# Users by IdP
jq '.[0].records | group_by(.idp.name) | map({idp: .[0].idp.name, count: length})' _data/snapshot/zidentity/users.json

# Users with a specific custom attribute
jq '.[0].records[] | select(.customAttrsInfo.costCenter == "ENG-1") | .loginName' _data/snapshot/zidentity/users.json
```

## `groups.json`

API: `GET /ziam/admin/api/v1/groups`

Same outer wrapper shape. Each group record:

```json
{
  "id": "...",
  "name": "engineering-all",
  "displayName": "Engineering — All",
  "description": "...",
  "source": "SCIM_PROVISIONING",                // or MANUAL etc.
  "memberCount": 142,
  "idp": { "id": "...", "name": "..." }
}
```

Group memberships are accessed via `GET /groups/{id}/members` — separate endpoint, not embedded in the list response.

### Common jq queries

```bash
# All groups by membership count
jq '.[0].records | sort_by(.memberCount) | reverse | .[] | {name: .displayName, count: .memberCount}' _data/snapshot/zidentity/groups.json

# Groups from a specific IdP
jq '.[0].records[] | select(.idp.name == "Okta-Production") | .displayName' _data/snapshot/zidentity/groups.json

# Empty groups (no members — possible orphans)
jq '.[0].records[] | select(.memberCount == 0) | .name' _data/snapshot/zidentity/groups.json
```

## `api-clients.json`

API: `GET /ziam/admin/api/v1/api-clients`

```json
[
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
        "createdAt": 1735689600,
        "lastUsedAt": 1735689700,

        "clientAuthentication": {
          "authType": "SECRET",                  // or PRIVATE_KEY_JWT, JWKS_URL
          "clientJWKsUrl": null,
          "publicKeys": [],                      // for cert-based auth
          "secrets": [                           // historical — count, not values
            {
              "id": "...",
              "createdAt": 1735689600,
              "expiresAt": 1798761600
            }
          ]
        },

        // Roles / scopes / entitlements
        "roles": [
          { "id": "...", "name": "ZIA Read Only" }
        ],
        "scopes": [
          "zia.url_categories:read",
          "zia.url_filtering:read"
        ],
        "audience": "https://api.zscaler.com",

        // Constraints
        "ipRestrictions": [],
        "timeRestrictions": []
      }
    ]
  }
]
```

**Note**: client secret values are NEVER returned via API after creation — only metadata about secrets (`id`, `createdAt`, `expiresAt`). Snapshot can show "this client has 2 active secrets, oldest is 6 months old" but never the secret material itself. See [`./api-clients.md § The client-secret-shown-once pattern`](./api-clients.md).

### Common jq queries

```bash
# API clients with their secret metadata
jq '.[0].records[] | {name, status, secrets: ([.clientAuthentication.secrets[] | {id, age_days: ((now - .createdAt) / 86400 | round)}])}' _data/snapshot/zidentity/api-clients.json

# Inactive clients
jq '.[0].records[] | select(.status == false) | .name' _data/snapshot/zidentity/api-clients.json

# Clients with old secrets (>180 days) — rotation candidates
jq --argjson cutoff "$(date -v-180d +%s)" '.[0].records[] | select(.clientAuthentication.secrets[]?.createdAt < $cutoff) | .name' _data/snapshot/zidentity/api-clients.json

# Clients using JWT auth (better security than client_secret)
jq '.[0].records[] | select(.clientAuthentication.authType != "SECRET") | {name, auth: .clientAuthentication.authType}' _data/snapshot/zidentity/api-clients.json
```

## `resource-servers.json`

API: `GET /ziam/admin/api/v1/resource-servers`

Resource Servers are the OAuth-defined services that API Clients can be scoped to (each Zscaler product is a Resource Server in OAuth terms).

```json
[
  {
    "results_total": 7,
    "pageOffset": 0,
    "pageSize": 100,
    "records": [
      {
        "id": "...",
        "name": "Zscaler Internet Access (ZIA)",
        "description": "...",
        "audience": "https://api.zscaler.com",
        "scopes": [
          { "name": "zia.url_categories:read", "description": "..." },
          { "name": "zia.url_categories:write", "description": "..." },
          ...
        ],
        "roles": [
          { "id": "...", "name": "ZIA SuperAdmin", "scopes": [...] },
          { "id": "...", "name": "ZIA Read Only", "scopes": [...] }
        ]
      }
    ]
  }
]
```

**Note**: in the Python SDK, `resource_servers` is **read-only** (Go SDK has full CRUD). Documented in `references/shared/scim-provisioning.md` and the cross-SDK sweep.

### Common jq queries

```bash
# All resource servers + scope counts
jq '.[0].records[] | {name, scope_count: (.scopes | length), role_count: (.roles | length)}' _data/snapshot/zidentity/resource-servers.json

# All scopes for a specific product
jq '.[0].records[] | select(.name | test("ZIA")) | .scopes[] | .name' _data/snapshot/zidentity/resource-servers.json

# Roles available across products
jq '.[0].records[] | {product: .name, roles: [.roles[].name]}' _data/snapshot/zidentity/resource-servers.json
```

## What's NOT in the snapshot (resources to consider adding)

| Resource | API path | Why useful |
|---|---|---|
| Authentication Sessions | `/sessions` | Active session inventory (rare to need) |
| Admin Sign-on Policies | `/admin-signon-policies` | MFA / IP-restriction rules for admins |
| MFA Methods | `/mfa-methods` | Per-user MFA enrollment status |
| Authentication Methods | `/authentication-methods` | Configured IdP / auth method list |
| External Identities | `/external-identities` | IdP-federated user inventory |
| IP Locations & Groups | `/ip-locations`, `/ip-location-groups` | IP-based admin policy resources |
| Audit Logs | `/audit-logs` | Admin action log |
| Branding | `/branding` | Tenant branding config |
| Token Validators | `/token-validators` | OAuth token validation rules |

The full ZIdentity API surface is in Postman's `ZIdentity` folder (4 sub-folders, 31 leaf items).

## Wire-format gotchas (ZIdentity-specific)

1. **List response is array-of-one-page** with `records` inside. Use `.[0].records[]` to flatten, not `.[]`.

2. **`results_total` and `next_link` are snake_case**, despite all other fields being camelCase. Quirk of the pagination wrapper.

3. **Secret material is never returned via API**. `clientAuthentication.secrets[]` shows metadata only. To recover a lost secret, rotate it.

4. **String IDs** — same as ZPA. `id: "..."` not integers.

5. **`authType` enum**: `SECRET` (client secret), `PRIVATE_KEY_JWT` (JWKS-based), `PUBLIC_KEY` (cert-uploaded). Reflects the three auth methods documented in [`./api-clients.md`](./api-clients.md).

6. **`source.type` enum on users**: includes `SCIM_PROVISIONING`, `SAML_JIT`, `MANUAL`, possibly others. Tracks how the user entered ZIdentity.

7. **Python SDK is read-only on `resource-servers`**. Go SDK has full CRUD. Snapshotting via Python is fine; modifying via Python is not — use Go or Terraform.

## Cross-links

- [`./api.md`](./api.md) — endpoint catalog
- [`./overview.md`](./overview.md) — ZIdentity architecture overview
- [`./api-clients.md`](./api-clients.md) — API Client object model
- [`../shared/scim-provisioning.md`](../shared/scim-provisioning.md) — cross-product user/group lifecycle
- [`../shared/admin-rbac.md`](../shared/admin-rbac.md) — federated admin model
- [`../_meta/layering-model.md`](../_meta/layering-model.md) — how snapshot data layers onto general docs
