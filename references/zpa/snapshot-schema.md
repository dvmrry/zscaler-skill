---
product: zpa
topic: "snapshot-schema"
title: "ZPA snapshot/ schema — what's in the JSON, how to read it"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-sdk-python/zscaler/zpa/"
  - "vendor/terraform-provider-zpa/zpa/"
  - "scripts/snapshot-refresh.py"
author-status: draft
---

# ZPA snapshot/ schema

Operational reference for the JSON files `scripts/snapshot-refresh.py` writes under `snapshot/zpa/`. Pre-written from the Postman collection (which has rich response samples for ZPA) + SDK source + Terraform provider schema. Once a fork-admin run produces tenant data, validate this doc against actual JSON and bump confidence to `high`.

## Files written by `--zpa-only`

```
snapshot/zpa/app-segments.json
snapshot/zpa/segment-groups.json
snapshot/zpa/server-groups.json
snapshot/zpa/access-policy-rules.json
```

Plus `snapshot/_manifest.json` with timestamps and per-resource counts.

## Wire-format conventions for ZPA

- **camelCase JSON keys** (same as ZIA).
- **IDs are STRINGS** in ZPA, not integers. `id: "12345"` (string), not `id: 12345`. Different from ZIA. Tooling that parses both products needs to handle the type difference.
- **List endpoints return paginated, wrapped responses**:
  ```json
  {
    "totalCount": "long",
    "totalPages": "string",
    "list": [...]
  }
  ```
  Single-resource endpoints return the bare object.
- **`customerId` in URL path** — ZPA endpoints live under `/zpa/mgmtconfig/v1/admin/customers/{customerId}/...`. The `customerId` is the ZPA tenant ID, retrievable from ZIdentity Admin Portal > Integration > API Resources > ZPA OneAPI, or ZPA Admin Portal > Configuration & Control > Public API > API Keys.
- **Multiple API versions**: `/mgmtconfig/v1`, `/mgmtconfig/v2` (newer policy endpoints), `/userconfig/v1` (SCIM Group Controller specifically).
- **Pagination defaults**: `pagesize=100`, `page=1` if not specified. Max `pagesize=500`. Tooling iterating large tenants must paginate explicitly.
- **Embedded ID-references**: ZPA frequently embeds full sub-objects rather than just IDs. An app segment's `serverGroups` is `[{ id, name, ...minimal-fields }]`, not just `["sg_id_1"]`.
- **`enabled` defaults to `true`** on resource creation if omitted (per `app-segments.md`).

## `app-segments.json`

API: `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/application`

**Shape:** wrapped paginated response with `list` containing app segment objects.

```json
{
  "totalCount": "350",
  "totalPages": "4",
  "list": [
    {
      "id": "216196257331358000",         // string
      "name": "wiki.internal",
      "description": "...",
      "enabled": true,
      "creationTime": "1707000000",        // string of epoch
      "modifiedTime": "...",
      "modifiedBy": "...",

      // The segment-group binding
      "segmentGroupId": "216196257331358001",
      "segmentGroupName": "Engineering",

      // Domain matching
      "domainNames": ["wiki.internal", "*.wiki.internal"],
      "fqdnDnsCheck": true,

      // Port ranges — DUAL FORMAT
      "tcpPortRanges": ["443", "443"],     // pairs format: [from, to, from, to, ...]
      "tcpPortRange": [                    // OR object format
        { "from": "443", "to": "443" }
      ],
      "udpPortRanges": [],
      "udpPortRange": [],

      // Cross-product hooks
      "inspectTrafficWithZia": false,      // ZIA→ZPA forwarding
      "useInDrMode": false,                // SIPA Direct (DR)

      // Match modes
      "bypassType": "NEVER",               // NEVER, ALWAYS, ON_NET
      "bypassOnReauth": false,
      "icmpAccessType": "PING",            // PING / NONE
      "tcpKeepAlive": "0",                 // string-as-bool: "0" or "1"
      "selectConnectorCloseToApp": false,  // ForceNew in TF
      "isCnameEnabled": true,
      "doubleEncrypt": false,              // mutually-exclusive with Browser Access / SIPA

      // Access type variants — Browser Access / PRA / AppProtection
      "clientlessApps": [],                // Browser Access apps in this segment
      "praApps": [],                       // Privileged Remote Access consoles
      "inspectionApps": [],                // AppProtection-enabled apps

      // Server / connector binding
      "serverGroups": [
        { "id": "...", "name": "...", "configSpace": "DEFAULT" }
      ],

      // SAML / SCIM / posture cross-criteria
      "configSpace": "DEFAULT",            // or MICROTENANT
      "sourceIpAnchored": false,           // SIPA flag — see references/shared/source-ip-anchoring.md

      // Microtenant
      "microtenantId": null,
      "microtenantName": null,

      // Health
      "healthCheckType": "DEFAULT",
      "healthReporting": "ON_ACCESS",
      "passiveHealthEnabled": true
    }
  ]
}
```

Key fields with rule-evaluation impact:
- `domainNames` — controls FQDN match (specificity-wins per `app-segments.md`)
- `bypassType` — `NEVER` / `ALWAYS` / `ON_NET`. Cross-evaluation with Multimatch.
- `inspectTrafficWithZia` — opts segment into ZIA-content-inspection of ZPA traffic.
- `sourceIpAnchored` — opts segment into SIPA flow.
- `clientlessApps` — Browser Access apps; mutually exclusive with SIPA/Double-Encrypt/Multimatch.
- `praApps` — PRA consoles; mutually exclusive with Multimatch.
- `inspectionApps` — AppProtection apps; mutually exclusive with Multimatch.

### Common jq queries

```bash
# All app segments by name
jq '.list[] | {name, domains: .domainNames, bypass: .bypassType}' snapshot/zpa/app-segments.json

# Segments with Browser Access enabled
jq '.list[] | select((.clientlessApps | length) > 0) | {name, ba_apps: .clientlessApps[].name}' snapshot/zpa/app-segments.json

# Segments with SIPA enabled
jq '.list[] | select(.sourceIpAnchored == true) | .name' snapshot/zpa/app-segments.json

# Segments with PRA consoles
jq '.list[] | select((.praApps | length) > 0) | {name, pra_consoles: .praApps[].name}' snapshot/zpa/app-segments.json

# Segments with AppProtection enabled
jq '.list[] | select((.inspectionApps | length) > 0) | {name, app_protection: .inspectionApps[].name}' snapshot/zpa/app-segments.json

# Find segments matching an FQDN (specificity check)
jq --arg fqdn "wiki.internal" '.list[] | select(.domainNames | any(test($fqdn))) | {name, domains: .domainNames, bypass: .bypassType}' snapshot/zpa/app-segments.json
```

Cross-links: [`./app-segments.md`](./app-segments.md), [`./browser-access.md`](./browser-access.md), [`./privileged-remote-access.md`](./privileged-remote-access.md), [`./appprotection.md`](./appprotection.md), [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md).

## `segment-groups.json`

API: `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/segmentGroup`

**Shape:** wrapped paginated response with `list` containing segment-group objects.

```json
{
  "totalCount": "12",
  "totalPages": "1",
  "list": [
    {
      "id": "216196257331358001",
      "name": "Engineering",
      "description": "...",
      "enabled": true,
      "configSpace": "DEFAULT",
      "creationTime": "1707000000",
      "modifiedTime": "...",
      "modifiedBy": "...",
      "policyMigrated": false,
      "tcpKeepAliveEnabled": "0",          // string

      // Embedded list of applications in this segment group
      "applications": [
        {
          "id": "...",
          "name": "...",
          "domainNames": [...],
          "enabled": true,
          ...
        }
      ]
    }
  ]
}
```

Each segment group **embeds full application objects**, not just IDs — so `app-segments.json` and `segment-groups.json` have overlapping data. Operationally this means snapshot diff'ing must account for the duplication.

### Common jq queries

```bash
# Segment groups by app count
jq '.list | sort_by(.applications | length) | reverse | .[] | {name, app_count: (.applications | length)}' snapshot/zpa/segment-groups.json

# Find which segment group an app lives in
jq --arg app "wiki.internal" '.list[] | select(.applications | any(.name == $app)) | {sg: .name, app: .applications[] | select(.name == $app) | .id}' snapshot/zpa/segment-groups.json

# Disabled segment groups (entire group disabled)
jq '.list[] | select(.enabled == false) | .name' snapshot/zpa/segment-groups.json
```

## `server-groups.json`

API: `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/serverGroup`

**Shape:** wrapped paginated response.

```json
{
  "totalCount": "8",
  "totalPages": "1",
  "list": [
    {
      "id": "216196257331358010",
      "name": "engineering-servers",
      "description": "...",
      "enabled": true,
      "configSpace": "DEFAULT",
      "creationTime": "...",
      "modifiedTime": "...",
      "modifiedBy": "...",

      // Match mode
      "dynamicDiscovery": false,           // discover servers via DNS at runtime?
      "ipAnchored": false,                 // SIPA-related

      // App connector binding
      "appConnectorGroups": [
        {
          "id": "...",
          "name": "engineering-connectors",
          "country_code": "...",
          ...
        }
      ],

      // Servers (only present if dynamicDiscovery=false)
      "servers": [
        { "id": "...", "name": "wiki1.internal", "address": "10.0.0.10" }
      ],

      // Embedded applications using this server group
      "applications": [
        { "id": "...", "name": "wiki" }
      ]
    }
  ]
}
```

**Constraint** (per `terraform.md` § Schema patterns): if `dynamicDiscovery == false`, then `servers` MUST be non-empty. Programmatically enforced — `apply` will fail otherwise.

### Common jq queries

```bash
# Server groups by mode
jq '.list | group_by(.dynamicDiscovery) | map({mode: .[0].dynamicDiscovery, count: length})' snapshot/zpa/server-groups.json

# Static server groups + their server count
jq '.list[] | select(.dynamicDiscovery == false) | {name, server_count: (.servers | length)}' snapshot/zpa/server-groups.json

# Server groups not bound to any connector (orphaned)
jq '.list[] | select((.appConnectorGroups | length) == 0) | .name' snapshot/zpa/server-groups.json
```

## `access-policy-rules.json`

API: `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/policySet/policyType/ACCESS_POLICY/policy`

**Shape:** wrapped paginated response. (Note: ZPA has multiple policy types — ACCESS_POLICY, TIMEOUT_POLICY, CLIENT_FORWARDING_POLICY, INSPECTION_POLICY, etc. The snapshot only dumps ACCESS_POLICY currently; extend to cover others by adding to `snapshot-refresh.py`.)

```json
{
  "totalCount": "45",
  "totalPages": "1",
  "list": [
    {
      "id": "216196257331358100",
      "name": "Allow Engineering to wiki",
      "description": "...",
      "ruleOrder": "1",                    // string of integer
      "rank": 7,                           // admin rank
      "action": "ALLOW",                   // ALLOW, DENY, REQUIRE_APPROVAL
      "operator": "AND",                   // top-level operator across condition groups
      "policyType": "1",                   // string enum: 1=ACCESS, 2=TIMEOUT, 3=CLIENT_FWD, 4=INSPECTION
      "policySetId": "...",
      "modifiedTime": "...",
      "modifiedBy": "...",
      "creationTime": "...",
      "lhsObjectType": null,

      // Conditional zip — present for action=ALLOW with PRA segments
      "credential": null,                  // PRA: { id, name }
      "credentialPool": null,              // PRA: { id, name }
      "privilegedCapabilities": null,

      // Inspection-policy fields
      "zpnInspectionProfileId": null,      // AppProtection profile reference (legacy field name)
      "zpnIsolationProfileId": null,       // ZBI isolation profile

      // Reauth fields (timeout policy only — included for completeness)
      "reauthTimeout": null,               // ForceNew at TF level — see policy-precedence.md
      "reauthIdleTimeout": null,
      "reauthDefaultRule": null,
      "devicePostureFailureNotificationEnabled": null,

      // Conditions — the operand tree
      "conditions": [
        {
          "id": "...",
          "operator": "OR",                // operator within this condition group
          "negated": false,
          "operands": [
            {
              "id": "...",
              "objectType": "APP",         // 19-value enum: APP, APP_GROUP, SAML, SCIM, SCIM_GROUP, POSTURE, TRUSTED_NETWORK, COUNTRY_CODE, PLATFORM, CLIENT_TYPE, BRANCH_CONNECTOR_GROUP_GROUP, MACHINE_GRP, EDGE_CONNECTOR_GROUP, RISK_FACTOR_TYPE, CHROME_ENTERPRISE, USER_PORTAL, CONSOLE, ZPN_INTERNAL_INTERNET_PROTOCOL, USER
              "lhs": "...",                // attribute name (for SAML/SCIM)
              "rhs": "...",                // matched value
              "name": "...",
              "values": [],                // for App / App Group operands — list of IDs
              "entryValues": []            // for SAML/SCIM_GROUP — list of {lhs, rhs} pairs
              // values + entryValues are mutually exclusive per operand
            }
          ]
        }
      ],

      "isolationDefaultRule": false,
      "predefined": false,
      "default": false,                    // catch-all rule
      "deceptionPolicy": false              // Deception-managed flag — see clarification zpa-07
    }
  ]
}
```

Key evaluation properties:
- **`ruleOrder`** is a string, not an integer. Sort numerically with `tonumber`.
- **First-match-wins** in ascending `ruleOrder`.
- **`operator: AND`** at rule level (across condition groups).
- **`operator: OR` or `AND`** within each condition's operand list.
- **Default action when no rule matches: BLOCK** (ZPA's opposite-of-ZIA default — see [`./policy-precedence.md`](./policy-precedence.md)).
- **`deceptionPolicy: true`** marks rules managed by Zscaler Deception (see [clarification `zpa-07`](../_clarifications.md#zpa-07-deception-policy-order-interaction)).
- **`predefined: true`** rules can't be edited normally (read-only).

### Common jq queries

```bash
# Rules in evaluation order (numeric sort)
jq '.list | sort_by(.ruleOrder | tonumber) | .[] | {order: .ruleOrder, name, action}' snapshot/zpa/access-policy-rules.json

# Find rules referencing a specific app segment
jq --arg appid "216196257331358000" '.list[] | select(.conditions[]?.operands[]? | select(.objectType == "APP" and (.values | index($appid)))) | .name' snapshot/zpa/access-policy-rules.json

# Deception-managed rules (read-only by ZPA admins)
jq '.list[] | select(.deceptionPolicy == true) | {order: .ruleOrder, name}' snapshot/zpa/access-policy-rules.json

# Rules using device posture criteria
jq '.list[] | select(.conditions[]?.operands[]? | .objectType == "POSTURE") | {name, posture_count: ([.conditions[].operands[] | select(.objectType == "POSTURE")] | length)}' snapshot/zpa/access-policy-rules.json

# Step-up auth rules (Conditional Access via REQUIRE_APPROVAL)
jq '.list[] | select(.action == "REQUIRE_APPROVAL") | .name' snapshot/zpa/access-policy-rules.json
```

Cross-links: [`./policy-precedence.md`](./policy-precedence.md), [`./app-segments.md`](./app-segments.md), [`./privileged-remote-access.md`](./privileged-remote-access.md), [`./appprotection.md`](./appprotection.md).

## What's NOT yet in the snapshot

Resources to consider extending `snapshot-refresh.py` to dump:

| Resource | API path | Why useful |
|---|---|---|
| Servers | `/serverGroup/server` | Inventory; cross-reference with server-groups |
| App Connectors | `/connector` | Health / version / enrollment status |
| App Connector Groups | `/appConnectorGroup` | Forwarding-mesh inventory |
| Service Edges | `/serviceEdge` | Private Service Edge inventory |
| Timeout policies | `/policySet/policyType/TIMEOUT_POLICY/policy` | Reauth / idle-timeout rules |
| Forwarding policies | `/policySet/policyType/CLIENT_FORWARDING_POLICY/policy` | Client-side forwarding decisions |
| Inspection policies | `/policySet/policyType/INSPECTION_POLICY/policy` | AppProtection rule placements |
| Isolation policies | `/policySet/policyType/ISOLATION_POLICY/policy` | ZBI rule placements |
| Posture profiles | `/posture` | Device-posture inventory |
| Trusted networks | `/trustedNetwork` | TrustedNetwork inventory |
| Microtenants | `/microtenants` | Microtenant inventory |
| IdP configs | `/idp` | IdP federation list |
| SAML attributes | `/samlAttribute` | Attribute mappings used in policy |
| SCIM attributes | `/scimAttribute` | SCIM attribute mappings |
| SCIM groups | `/userconfig/v1/scimGroup` | Note: userconfig path, not mgmtconfig |
| LSS configs | `/lssConfig` | Log Streaming Service inventory |
| Provisioning keys | `/associationType/CONNECTOR_GRP/provisioningKey` | Connector enrollment keys |
| Inspection profiles | `/inspectionProfile` | AppProtection profile inventory |
| PRA portals | `/praPortal` | PRA portal inventory |
| PRA consoles | `/praConsole` | PRA console (target) inventory |

The Postman collection has 36 ZPA controllers. Extending `snapshot-refresh.py` to dump everything would be substantive but mechanical.

## Wire-format gotchas

1. **String IDs.** Don't compare with integers. Always `==` against a string.

2. **Wrapped responses with `list`**. Most ZPA list endpoints wrap. Always do `.list[]` not `.[]`.

3. **`ruleOrder` is a string.** Numeric ordering needs `tonumber`. `sort_by(.ruleOrder)` lexically sorts and gives wrong results above 10 rules.

4. **Embedded objects, not just IDs.** Server groups embed full app objects in `applications`; segment groups embed app objects too. Snapshots are partially redundant.

5. **`bypassType: "ON_NET"`** is valid (added per `terraform.md`); not just `NEVER` / `ALWAYS`.

6. **`tcpPortRange` vs `tcpPortRanges`**: dual format. Object array (`[{from, to}]`) vs flat pairs (`["443", "443"]`). Tooling must handle both.

7. **`tcpKeepAlive: "0"` is a string-as-bool**. `"0"` = false, `"1"` = true. Same for `tcpKeepAliveEnabled` on segment groups.

8. **`selectConnectorCloseToApp` is `ForceNew`** at the Terraform layer — toggling destroys-and-recreates the segment.

9. **`reauthTimeout` / `reauthIdleTimeout` are `ForceNew`** too. Changes require destroy-recreate.

10. **`PLATFORM` operands' `rhs` are strings, not booleans.** `rhs: "true"` / `"false"` for platform-criteria operands.

11. **`predefined: true` rules can't be deleted**, similar to ZIA.

## Cross-links

- [`./api.md`](./api.md) — endpoint catalog
- [`./app-segments.md`](./app-segments.md) — segment matching reasoning
- [`./policy-precedence.md`](./policy-precedence.md) — policy evaluation
- [`./browser-access.md`](./browser-access.md), [`./privileged-remote-access.md`](./privileged-remote-access.md), [`./appprotection.md`](./appprotection.md) — segment variants
- [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md) — SIPA flag interpretation
- [`../_layering-model.md`](../_layering-model.md) — how snapshot data layers onto general docs
