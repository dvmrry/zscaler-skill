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
  "currentCount": "<long>",               // items in this page
  "totalCount": "<long>",                 // total items across all pages
  "totalPages": "<integer>",
  "list": [
    {
      "id": "216196257331358000",         // string
      "name": "wiki.internal",
      "description": "...",
      "enabled": true,
      "creationTime": "1707000000",        // string of epoch
      "modifiedTime": "...",
      "modifiedBy": "...",

      // Segment-group binding
      "segmentGroupId": "216196257331358001",
      "segmentGroupName": "Engineering",

      // Domain matching
      "domainNames": ["wiki.internal", "*.wiki.internal"],
      "fqdnDnsCheck": true,

      // Port ranges — DUAL FORMAT (both present simultaneously)
      "tcpPortRanges": ["443", "443"],     // flat pairs: [from, to, from, to, ...]
      "tcpPortRange": [                    // object format
        { "from": "443", "to": "443" }
      ],
      "udpPortRanges": [],
      "udpPortRange": [],

      // Protocol filters (layer-4 protocol allowlist within port range)
      "tcpProtocols": [],                  // e.g. ["LDAP", "SMB"] — empty = all TCP
      "udpProtocols": [],

      // Cross-product hooks
      "inspectTrafficWithZia": false,      // ZIA inline inspection of ZPA traffic
      "useInDrMode": false,                // SIPA Direct / DR mode

      // Match and bypass modes
      "bypassType": "NEVER",               // NEVER, ALWAYS, ON_NET
      "bypassOnReauth": false,
      "matchStyle": "EXCLUSIVE",           // EXCLUSIVE (default) or INCLUSIVE (Multimatch)
      "icmpAccessType": "PING",            // PING, PING_TRACEROUTING, NONE
      "tcpKeepAlive": "0",                 // ⚠️ SEE DISCREPANCY NOTE — string-as-bool per TF, integer per Postman
      "selectConnectorCloseToApp": false,  // ForceNew in TF — destroy-recreate on change
      "isCnameEnabled": true,
      "doubleEncrypt": false,

      // AppProtection / ADP flags
      "adpEnabled": false,                 // Application Data Protection
      "apiProtectionEnabled": false,       // API protection (AppProtection inline WAF)
      "autoAppProtectEnabled": false,      // auto-enroll in AppProtection

      // DR / completeness
      "isIncompleteDRConfig": false,       // true if DR config references are missing
      "weightedLoadBalancing": false,      // weighted connector selection instead of default strategy

      // Access type variants — shapes documented in sub-type section below
      "clientlessApps": [],                // Browser Access apps; see sub-type schema
      "praApps": [],                       // PRA consoles; see sub-type schema
      "inspectionApps": [],                // AppProtection apps; see sub-type schema

      // Unified app config object (write path for BA/PRA/Inspect in one call)
      "commonAppsDto": {
        "appsConfig": [],                  // see sub-type schema
        "deletedBaApps": [],               // IDs of BA apps removed in this update
        "deletedInspectApps": [],
        "deletedPraApps": []
      },

      // Server / connector binding
      "serverGroups": [
        {
          "id": "...",
          "name": "...",
          "configSpace": "DEFAULT",        // DEFAULT or SIEM
          "enabled": true,
          "dynamicDiscovery": false,
          "weight": 0                      // for weighted load balancing
        }
      ],

      // Config scope
      "configSpace": "DEFAULT",            // DEFAULT, MICROTENANT, or SIEM
      "ipAnchored": false,                 // SIPA flag — confirmed wire name (NOT sourceIpAnchored)

      // Microtenant
      "microtenantId": null,
      "microtenantName": null,
      "sharedMicrotenantDetails": {
        "sharedFromMicrotenant": { "id": null, "name": null },
        "sharedToMicrotenants": []         // [{id, name}] list
      },

      // Health
      "healthCheckType": "DEFAULT",        // DEFAULT, NONE
      "healthReporting": "ON_ACCESS",      // ON_ACCESS, CONTINUOUS, NONE
      "passiveHealthEnabled": true,
      "appRecommendationId": null,
      "defaultIdleTimeout": null,
      "defaultMaxAge": null,

      // Inconsistency tracking — populated when referenced resources are missing/deleted
      "inconsistentConfigDetails": {
        "application": [],                 // [{name, reason}] — broken app references
        "segmentGroup": [],
        "appConnectorGroup": [],
        "baCertificate": [],
        "branchConnectorGroup": [],
        "cloudConnectorGroup": [],
        "idp": [],
        "location": [],
        "machineGroup": [],
        "postureProfile": [],
        "samlAttributes": [],
        "scimAttributes": [],
        "serverGroup": [],
        "sraApplication": [],
        "trustedNetwork": [],
        "userPortal": [],
        "workloadTagGroup": []
      }
    }
  ]
}
```

Key fields with rule-evaluation impact:
- `domainNames` — controls FQDN match (specificity-wins per `app-segments.md`)
- `bypassType` — `NEVER` / `ALWAYS` / `ON_NET`. Cross-evaluation with Multimatch.
- `matchStyle` — `EXCLUSIVE` (default) or `INCLUSIVE` (Multimatch). Must be consistent across overlapping segments.
- `inspectTrafficWithZia` — opts segment into ZIA-content-inspection of ZPA traffic.
- `ipAnchored` — SIPA flag (confirmed wire field name; SDK/TF uses `source_ip_anchored` which maps to `ipAnchored` on the wire).
- `clientlessApps` — Browser Access apps; mutually exclusive with SIPA/Double-Encrypt/Multimatch.
- `praApps` — PRA consoles; mutually exclusive with Multimatch.
- `inspectionApps` — AppProtection apps; mutually exclusive with Multimatch.
- `inconsistentConfigDetails` — non-empty arrays indicate orphaned references (deleted IdP, missing cert, etc.). A segment with non-empty entries here may behave unexpectedly.

### ⚠️ Discrepancies — needs tenant verification

These fields have conflicting type or name information across sources. Flag these for the verifying agent:

| Field | Postman says | TF provider / snapshot-schema says | Verify |
|---|---|---|---|
| `tcpKeepAlive` | `<integer>` (type hint only — Postman doesn't show real value) | `"0"` / `"1"` string-as-bool (TF `:228-230`) | Is the wire value a quoted string or a bare integer? |
| `configSpace` | `DEFAULT` / `SIEM` seen in sub-objects | `DEFAULT` / `MICROTENANT` at segment top level | Is `SIEM` valid at segment top level, or only in serverGroups/appResource embeds? |

⚠️ ZPA verification deferred — ZPA OAuth keys unavailable at time of ZIA verification pass (2026-04-26). Run the queries below when keys are available.

#### Verification commands

If you have a populated `snapshot/zpa/app-segments.json`, run these jq queries and record the output:

```bash
# 1. tcpKeepAlive type — quoted string ("0") or bare integer (0)?
jq '.list[0].tcpKeepAlive' snapshot/zpa/app-segments.json

# 2. configSpace at segment top level — what values appear?
jq '[.list[].configSpace] | unique' snapshot/zpa/app-segments.json

# 3. configSpace in embedded serverGroups — what values appear there?
jq '[.list[].serverGroups[]?.configSpace] | unique' snapshot/zpa/app-segments.json
```

If running live against the API instead:

```bash
# Fetch one page (requires TOKEN and CUSTOMER_ID env vars)
curl -s "https://api.zsapi.net/zpa/mgmtconfig/v1/admin/customers/${CUSTOMER_ID}/application?pagesize=5" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.list[] | {name, tcpKeepAlive, configSpace, sgConfigSpace: [.serverGroups[]?.configSpace] | unique}'
```

Expected answers to record:
- `tcpKeepAlive` output should be either `"0"` (string) or `0` (integer) — the quotes matter.
- `configSpace` at top level should enumerate all observed values (likely just `"DEFAULT"`, or possibly `"MICROTENANT"` for microtenant-scoped segments, or `"SIEM"` if that appears).
- Once confirmed, update the JSON example above and remove the discrepancy row.

Resolved discrepancies (confirmed from Postman GET response body):
- **`ipAnchored`** is the correct wire field name for SIPA. `sourceIpAnchored` does NOT appear in GET responses. SDK/TF uses snake_case `source_ip_anchored` which maps to `ipAnchored` on the wire, not `sourceIpAnchored`.
- **Pagination wrapper** has all four fields: `currentCount`, `totalCount`, `totalPages`, `list`.

### Sub-type schemas

#### `clientlessApps[]` — Browser Access apps

Each entry in a Browser Access segment:

```json
{
  "id": "<long>",
  "name": "...",
  "domain": "portal.example.com",          // the BA FQDN
  "applicationPort": 443,
  "applicationProtocol": "HTTPS",          // HTTPS, HTTP, RDP, SSH
  "certificateId": "<long>",
  "certificateName": "...",
  "cname": "...",
  "path": "/",
  "localDomain": "...",
  "description": "...",
  "enabled": true,
  "hidden": false,
  "portal": false,
  "trustUntrustedCert": false,
  "allowOptions": false,
  "microtenantId": null,
  "microtenantName": null,
  "appId": "<long>",                       // back-reference to parent segment
  "appResource": { /* full segment object — same shape as top-level */ },
  "inconsistentConfigDetails": { /* same 17-array shape as top-level */ }
}
```

#### `inspectionApps[]` — AppProtection apps

```json
{
  "id": "<long>",
  "name": "...",
  "domain": "api.example.com",
  "applicationPort": 443,
  "applicationProtocol": "AUTO",           // AUTO, HTTPS, HTTP
  "protocols": ["LDAP", "KERBEROS"],       // layer-7 protocol hints for inspection
  "certificateId": "<long>",
  "certificateName": "...",
  "description": "...",
  "enabled": true,
  "trustUntrustedCert": false,
  "microtenantId": null,
  "microtenantName": null,
  "appId": "<long>",
  "appResource": { /* full segment object */ },
  "inconsistentConfigDetails": { /* 17-array shape */ }
}
```

#### `praApps[]` — Privileged Remote Access consoles

```json
{
  "id": "<long>",
  "name": "...",
  "domain": "rdp-target.example.com",
  "applicationPort": 3389,
  "applicationProtocol": "RDP",            // RDP, SSH, HTTPS, VNC
  "connectionSecurity": "VM_CONNECT",      // VM_CONNECT, TLS
  "certificateId": "<long>",
  "certificateName": "...",
  "description": "...",
  "enabled": true,
  "hidden": false,
  "microtenantId": null,
  "microtenantName": null,
  "appId": "<long>",
  "appResource": { /* full segment object */ },
  "inconsistentConfigDetails": { /* 17-array shape */ }
}
```

#### `commonAppsDto.appsConfig[]` — unified write-path for all app types

Used when creating/updating BA, PRA, and AppProtection apps in a single API call. `appTypes[]` discriminates which variant each entry configures:

```json
{
  "name": "...",
  "domain": "...",
  "applicationPort": 443,
  "applicationProtocol": "HTTPS",
  "connectionSecurity": "TLS",             // PRA only
  "protocols": [],                         // AppProtection only
  "appTypes": ["SECURE_REMOTE_ACCESS"],    // BA: "BROWSER_ACCESS", PRA: "SECURE_REMOTE_ACCESS", Inspect: "INSPECT"
  "baAppId": null,                         // set if updating existing BA app
  "praAppId": null,                        // set if updating existing PRA app
  "inspectAppId": null,                    // set if updating existing Inspect app
  "certificateId": null,
  "certificateName": null,
  "cname": null,
  "path": "/",
  "localDomain": null,
  "description": null,
  "enabled": true,
  "hidden": false,
  "portal": false,
  "allowOptions": false,
  "trustUntrustedCert": false,
  "adpEnabled": false,
  "appId": null                            // parent segment ID
}
```

### Common jq queries

```bash
# All app segments by name
jq '.list[] | {name, domains: .domainNames, bypass: .bypassType}' snapshot/zpa/app-segments.json

# Segments with Browser Access enabled
jq '.list[] | select((.clientlessApps | length) > 0) | {name, ba_apps: [.clientlessApps[].name]}' snapshot/zpa/app-segments.json

# Segments with SIPA enabled (confirmed wire field name: ipAnchored)
jq '.list[] | select(.ipAnchored == true) | .name' snapshot/zpa/app-segments.json

# Segments with PRA consoles
jq '.list[] | select((.praApps | length) > 0) | {name, pra_consoles: [.praApps[].name]}' snapshot/zpa/app-segments.json

# Segments with AppProtection enabled
jq '.list[] | select((.inspectionApps | length) > 0) | {name, inspection_apps: [.inspectionApps[].name]}' snapshot/zpa/app-segments.json

# Segments with inconsistency warnings (orphaned references)
jq '.list[] | select(.inconsistentConfigDetails | to_entries | any(.value | length > 0)) | {name, issues: [.inconsistentConfigDetails | to_entries[] | select(.value | length > 0) | .key]}' snapshot/zpa/app-segments.json

# Segments using weighted load balancing
jq '.list[] | select(.weightedLoadBalancing == true) | .name' snapshot/zpa/app-segments.json

# Segments in Multimatch (INCLUSIVE) mode
jq '.list[] | select(.matchStyle == "INCLUSIVE") | .name' snapshot/zpa/app-segments.json

# Find segments matching an FQDN
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
