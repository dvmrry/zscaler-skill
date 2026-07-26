---
product: zpa
topic: "snapshot-schema"
title: "ZPA _data/snapshot/ schema — what's in the JSON, how to read it"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-sdk-python/zscaler/zpa/"
  - "vendor/terraform-provider-zpa/zpa/"
author-status: draft
---

# ZPA _data/snapshot/ schema

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/`; `vendor/terraform-provider-zpa/zpa/`.

Operational reference for the ZPA config JSON under `_data/snapshot/<cloud>/zpa/`. Pre-written from the Postman collection (which has rich response samples for ZPA) + SDK source + Terraform provider schema. Once a fork-admin run produces tenant data, validate this doc against actual JSON and bump confidence to `high`.

## Files written by `--zpa-only`

```
_data/snapshot/<cloud>/zpa/app-segments.json
_data/snapshot/<cloud>/zpa/segment-groups.json
_data/snapshot/<cloud>/zpa/server-groups.json
_data/snapshot/<cloud>/zpa/access-policy-rules.json
```

Plus `_data/snapshot/_manifest.json` with timestamps and per-resource counts.

## Wire-format conventions for ZPA

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/`.

- **camelCase JSON keys** (same as ZIA).

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/`.

- **IDs are STRINGS** in ZPA, not integers. `id: "12345"` (string), not `id: 12345`. Different from ZIA. Tooling that parses both products needs to handle the type difference.
- **List endpoints return paginated, wrapped responses**:
  ```json
  {
    "totalCount": "long",
    "totalPages": "string",
    "list": [...]
  }
  ```

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

  Single-resource endpoints return the bare object.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/`.

- **`customerId` in URL path** — ZPA endpoints live under `/zpa/mgmtconfig/v1/admin/customers/{customerId}/...`. The `customerId` is the ZPA tenant ID, retrievable from ZIdentity Admin Portal > Integration > API Resources > ZPA OneAPI, or ZPA Admin Portal > Configuration & Control > Public API > API Keys.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

- **Multiple API versions**: `/mgmtconfig/v1`, `/mgmtconfig/v2` (newer policy endpoints), `/userconfig/v1` (SCIM Group Controller specifically).

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/`.

- **Pagination defaults**: `pagesize=100`, `page=1` if not specified. Max `pagesize=500`. Tooling iterating large tenants must paginate explicitly.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/`.

- **Embedded ID-references**: ZPA frequently embeds full sub-objects rather than just IDs. An app segment's `serverGroups` is `[{ id, name, ...minimal-fields }]`, not just `["sg_id_1"]`.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/terraform-provider-zpa/zpa/`.

- **`enabled` defaults to `true`** on resource creation if omitted. See [`./app-segments.md`](./app-segments.md) for behavior context.

## `app-segments.json`

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py`.

API: `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/application`

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py`.

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

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/terraform-provider-zpa/zpa/`.

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

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/terraform-provider-zpa/zpa/`.

These fields have conflicting type or name information across sources. Flag these for the verifying agent:

| Field | Postman says | TF provider / SDK says | Verify |
|---|---|---|---|
| `tcpKeepAlive` | `<integer>` (type hint only — Postman doesn't show real value) | string-as-bool `"0"` / `"1"` — SDK and TF agree (see below) | Literal wire token on a real GET: quoted string `"0"` or bare integer `0`? |
| `configSpace` | `DEFAULT` / `SIEM` seen in sub-objects | `DEFAULT` / `MICROTENANT` at segment top level | Is `SIEM` valid at segment top level, or only in serverGroups/appResource embeds? |

`tcpKeepAlive` is resolved as string-as-bool from code alone: the Python model serializes it verbatim from a string field (`vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py:234` — `"tcpKeepAlive": self.tcp_keep_alive`), and the TF schema declares it `Type: schema.TypeString` with a `StringInSlice` validator of `"0"`/`"1"` (`vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment.go:225,228-230`) and reads it as a string (`:511` — `d.Get("tcp_keep_alive").(string)`). This matches gotcha #7 below. The Postman `<integer>` type hint is the only conflicting signal, so the open item is narrowed to confirming the literal wire token on a real GET — not "string vs integer" broadly. `configSpace` still needs a live capture.

⚠️ ZPA `configSpace` verification deferred — ZPA OAuth keys unavailable at time of ZIA verification pass (2026-04-26). Run the queries below when keys are available. The `configSpace` / `tcpKeepAlive` claims above are cited inline (`vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py:234`; `vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment.go:225`).

#### Verification commands

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/terraform-provider-zpa/zpa/`.

If you have a populated `_data/snapshot/<cloud>/zpa/app-segments.json`, run these jq queries and record the output.

```bash
# 1. tcpKeepAlive type — quoted string ("0") or bare integer (0)?
jq '.list[0].tcpKeepAlive' _data/snapshot/<cloud>/zpa/app-segments.json

# 2. configSpace at segment top level — what values appear?
jq '[.list[].configSpace] | unique' _data/snapshot/<cloud>/zpa/app-segments.json

# 3. configSpace in embedded serverGroups — what values appear there?
jq '[.list[].serverGroups[]?.configSpace] | unique' _data/snapshot/<cloud>/zpa/app-segments.json
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

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/terraform-provider-zpa/zpa/`.

- **`ipAnchored`** is the correct wire field name for SIPA. `sourceIpAnchored` does NOT appear in GET responses. SDK/TF uses snake_case `source_ip_anchored` which maps to `ipAnchored` on the wire, not `sourceIpAnchored`.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

- **Pagination wrapper** has all four fields: `currentCount`, `totalCount`, `totalPages`, `list`.

### Sub-type schemas

#### `clientlessApps[]` — Browser Access apps

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/`.

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

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/`.

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
jq '.list[] | {name, domains: .domainNames, bypass: .bypassType}' _data/snapshot/<cloud>/zpa/app-segments.json

# Segments with Browser Access enabled
jq '.list[] | select((.clientlessApps | length) > 0) | {name, ba_apps: [.clientlessApps[].name]}' _data/snapshot/<cloud>/zpa/app-segments.json

# Segments with SIPA enabled (confirmed wire field name: ipAnchored)
jq '.list[] | select(.ipAnchored == true) | .name' _data/snapshot/<cloud>/zpa/app-segments.json

# Segments with PRA consoles
jq '.list[] | select((.praApps | length) > 0) | {name, pra_consoles: [.praApps[].name]}' _data/snapshot/<cloud>/zpa/app-segments.json

# Segments with AppProtection enabled
jq '.list[] | select((.inspectionApps | length) > 0) | {name, inspection_apps: [.inspectionApps[].name]}' _data/snapshot/<cloud>/zpa/app-segments.json

# Segments with inconsistency warnings (orphaned references)
jq '.list[] | select(.inconsistentConfigDetails | to_entries | any(.value | length > 0)) | {name, issues: [.inconsistentConfigDetails | to_entries[] | select(.value | length > 0) | .key]}' _data/snapshot/<cloud>/zpa/app-segments.json

# Segments using weighted load balancing
jq '.list[] | select(.weightedLoadBalancing == true) | .name' _data/snapshot/<cloud>/zpa/app-segments.json

# Segments in Multimatch (INCLUSIVE) mode
jq '.list[] | select(.matchStyle == "INCLUSIVE") | .name' _data/snapshot/<cloud>/zpa/app-segments.json

# Find segments matching an FQDN
jq --arg fqdn "wiki.internal" '.list[] | select(.domainNames | any(test($fqdn))) | {name, domains: .domainNames, bypass: .bypassType}' _data/snapshot/<cloud>/zpa/app-segments.json
```

Cross-links: [`./app-segments.md`](./app-segments.md), [`./browser-access.md`](./browser-access.md), [`./privileged-remote-access.md`](./privileged-remote-access.md), [`./appprotection.md`](./appprotection.md), [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md).

## `segment-groups.json`

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/segment_groups.py`.

API: `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/segmentGroup`

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/segment_groups.py`.

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

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/segment_groups.py`.

Each segment group **embeds full application objects**, not just IDs — so `app-segments.json` and `segment-groups.json` have overlapping data. Operationally this means snapshot diff'ing must account for the duplication.

### Common jq queries

```bash
# Segment groups by app count
jq '.list | sort_by(.applications | length) | reverse | .[] | {name, app_count: (.applications | length)}' _data/snapshot/<cloud>/zpa/segment-groups.json

# Find which segment group an app lives in
jq --arg app "wiki.internal" '.list[] | select(.applications | any(.name == $app)) | {sg: .name, app: .applications[] | select(.name == $app) | .id}' _data/snapshot/<cloud>/zpa/segment-groups.json

# Disabled segment groups (entire group disabled)
jq '.list[] | select(.enabled == false) | .name' _data/snapshot/<cloud>/zpa/segment-groups.json
```

## `server-groups.json`

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/server_groups.py`.

API: `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/serverGroup`

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/server_groups.py`.

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

Source: `vendor/terraform-provider-zpa/zpa/`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

**Constraint**: if `dynamicDiscovery == false`, then `servers` MUST be non-empty. Programmatically enforced — `apply` will fail otherwise.

### Common jq queries

```bash
# Server groups by mode
jq '.list | group_by(.dynamicDiscovery) | map({mode: .[0].dynamicDiscovery, count: length})' _data/snapshot/<cloud>/zpa/server-groups.json

# Static server groups + their server count
jq '.list[] | select(.dynamicDiscovery == false) | {name, server_count: (.servers | length)}' _data/snapshot/<cloud>/zpa/server-groups.json

# Server groups not bound to any connector (orphaned)
jq '.list[] | select((.appConnectorGroups | length) == 0) | .name' _data/snapshot/<cloud>/zpa/server-groups.json
```

## `access-policy-rules.json`

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/policies.py`.

API: `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/policySet/policyType/ACCESS_POLICY/policy`

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/policies.py`.

**Shape:** wrapped paginated response. ZPA has multiple policy types — ACCESS_POLICY, TIMEOUT_POLICY, CLIENT_FORWARDING_POLICY, INSPECTION_POLICY, etc. The snapshot only dumps ACCESS_POLICY currently; extend to cover others by adding to the ZPA resource list.

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
              "objectType": "APP",         // operand type — see enum table below for the TF-validated set
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

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/policies.py`; `vendor/terraform-provider-zpa/zpa/`.

Key evaluation properties:
- **`ruleOrder`** is a string, not an integer. Sort numerically with `tonumber`.
- **First-match-wins** in ascending `ruleOrder`.
- **`operator: AND`** at rule level (across condition groups).
- **`operator: OR` or `AND`** within each condition's operand list.
- **Default action when no rule matches: BLOCK** (ZPA's opposite-of-ZIA default — see [`./policy-precedence.md`](./policy-precedence.md)).
- **`deceptionPolicy: true`** marks rules managed by Zscaler Deception (see [clarification `zpa-07`](../_meta/clarifications.md#zpa-07-deception-policy-order-interaction)).
- **`predefined: true`** rules can't be edited normally (read-only).

#### `objectType` enum (operand type)

The Terraform provider's operand validators recognize the following `object_type` values. The primary per-operand validator (`vendor/terraform-provider-zpa/zpa/common.go:89-272`) covers `APP`, `APP_GROUP`, `IDP` (`:102`), `EDGE_CONNECTOR_GROUP`, `CLIENT_TYPE`, `MACHINE_GRP`, `POSTURE`, `TRUSTED_NETWORK`, `PLATFORM`, `SAML`, `SCIM`, `SCIM_GROUP`, `COUNTRY_CODE`, `RISK_FACTOR_TYPE`, and `CHROME_ENTERPRISE`. The resource-level operand validator (`vendor/terraform-provider-zpa/zpa/common.go:1024-1238`) additionally recognizes `LOCATION` (`:1037`), `BRANCH_CONNECTOR_GROUP` (`:1045`), `USER_PORTAL` (`:1049`), and `CHROME_POSTURE_PROFILE` (`:1217`). The v1→v2 aggregation switch (`vendor/terraform-provider-zpa/zpa/common.go:1339`) also handles `CONSOLE` and `PRIVILEGE_PORTAL`.

So the full TF-validated set is: `APP`, `APP_GROUP`, `IDP`, `SAML`, `SCIM`, `SCIM_GROUP`, `POSTURE`, `TRUSTED_NETWORK`, `COUNTRY_CODE`, `PLATFORM`, `CLIENT_TYPE`, `MACHINE_GRP`, `EDGE_CONNECTOR_GROUP`, `BRANCH_CONNECTOR_GROUP`, `RISK_FACTOR_TYPE`, `CHROME_ENTERPRISE`, `CHROME_POSTURE_PROFILE`, `LOCATION`, `USER_PORTAL`, `CONSOLE`, `PRIVILEGE_PORTAL`. Note that `BRANCH_CONNECTOR_GROUP` is recognized only by the resource-level validator (`vendor/terraform-provider-zpa/zpa/common.go:1045`) and the v1→v2 aggregation switch (`vendor/terraform-provider-zpa/zpa/common.go:1339`); the primary per-operand validator (`vendor/terraform-provider-zpa/zpa/common.go:89-272`) does not handle it. The [`./terraform.md`](./terraform.md) `object_type` table is the more complete annotated cross-reference (it also lists `EXTRANET`, which the validators above don't gate but the table records). `BRANCH_CONNECTOR_GROUP` and `EDGE_CONNECTOR_GROUP` are distinct object types handled by separate `case` branches (e.g. `vendor/terraform-provider-zpa/zpa/common.go:1041` for `EDGE_CONNECTOR_GROUP` and `:1045` for `BRANCH_CONNECTOR_GROUP` in the resource-level validator, each emitting its own validation error) — the code does not treat them as aliases.

Note: the earlier wire-format draft of this doc listed `ZPN_INTERNAL_INTERNET_PROTOCOL` and a bare `USER` as operand types. Neither appears in the current TF validators (`vendor/terraform-provider-zpa/zpa/common.go`), SDK (Python/Go) source, or the Postman collection — see [Open questions](#open-questions).

### Common jq queries

```bash
# Rules in evaluation order (numeric sort)
jq '.list | sort_by(.ruleOrder | tonumber) | .[] | {order: .ruleOrder, name, action}' _data/snapshot/<cloud>/zpa/access-policy-rules.json

# Find rules referencing a specific app segment
jq --arg appid "216196257331358000" '.list[] | select(.conditions[]?.operands[]? | select(.objectType == "APP" and (.values | index($appid)))) | .name' _data/snapshot/<cloud>/zpa/access-policy-rules.json

# Deception-managed rules (read-only by ZPA admins)
jq '.list[] | select(.deceptionPolicy == true) | {order: .ruleOrder, name}' _data/snapshot/<cloud>/zpa/access-policy-rules.json

# Rules using device posture criteria
jq '.list[] | select(.conditions[]?.operands[]? | .objectType == "POSTURE") | {name, posture_count: ([.conditions[].operands[] | select(.objectType == "POSTURE")] | length)}' _data/snapshot/<cloud>/zpa/access-policy-rules.json

# Step-up auth rules (Conditional Access via REQUIRE_APPROVAL)
jq '.list[] | select(.action == "REQUIRE_APPROVAL") | .name' _data/snapshot/<cloud>/zpa/access-policy-rules.json
```

Cross-links: [`./policy-precedence.md`](./policy-precedence.md), [`./app-segments.md`](./app-segments.md), [`./privileged-remote-access.md`](./privileged-remote-access.md), [`./appprotection.md`](./appprotection.md).

## What's NOT yet in the snapshot

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/`.

Resources to consider extending the snapshot collector to dump:

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

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

The Postman collection has 36 ZPA controllers. Extending the snapshot collector to dump everything would be substantive but mechanical.

## Wire-format gotchas

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/`.

1. **String IDs.** Don't compare with integers. Always `==` against a string.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

2. **Wrapped responses with `list`**. Most ZPA list endpoints wrap. Always do `.list[]` not `.[]`.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/policies.py`.

3. **`ruleOrder` is a string.** Numeric ordering needs `tonumber`. `sort_by(.ruleOrder)` lexically sorts and gives wrong results above 10 rules.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

4. **Embedded objects, not just IDs.** Server groups embed full app objects in `applications`; segment groups embed app objects too. Snapshots are partially redundant.

Source: `vendor/terraform-provider-zpa/zpa/`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

5. **`bypassType: "ON_NET"`** is valid; not just `NEVER` / `ALWAYS`.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/terraform-provider-zpa/zpa/`.

6. **`tcpPortRange` vs `tcpPortRanges`**: dual format. Object array (`[{from, to}]`) vs flat pairs (`["443", "443"]`). Tooling must handle both.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/terraform-provider-zpa/zpa/`.

7. **`tcpKeepAlive: "0"` is a string-as-bool**. `"0"` = false, `"1"` = true. Same for `tcpKeepAliveEnabled` on segment groups.

Source: `vendor/terraform-provider-zpa/zpa/`.

8. **`selectConnectorCloseToApp` is `ForceNew`** at the Terraform layer — toggling destroys-and-recreates the segment.

Source: `vendor/terraform-provider-zpa/zpa/`.

9. **`reauthTimeout` / `reauthIdleTimeout` are `ForceNew`** too. Changes require destroy-recreate.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/policies.py`.

10. **`PLATFORM` operands' `rhs` are strings, not booleans.** `rhs: "true"` / `"false"` for platform-criteria operands.

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-sdk-python/zscaler/zpa/policies.py`.

11. **`predefined: true` rules can't be deleted**, similar to ZIA.

## Cross-links

- [`./api.md`](./api.md) — endpoint catalog
- [`./app-segments.md`](./app-segments.md) — segment matching reasoning
- [`./policy-precedence.md`](./policy-precedence.md) — policy evaluation
- [`./browser-access.md`](./browser-access.md), [`./privileged-remote-access.md`](./privileged-remote-access.md), [`./appprotection.md`](./appprotection.md) — segment variants
- [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md) — SIPA flag interpretation
- [`../_meta/layering-model.md`](../_meta/layering-model.md) — how snapshot data layers onto general docs

## Open questions

- **`objectType: ZPN_INTERNAL_INTERNET_PROTOCOL` and `objectType: USER`** — an earlier draft of the operand enum listed these two values. Neither is recognized by the current Terraform provider operand validators (`vendor/terraform-provider-zpa/zpa/common.go`), nor found in the SDK Python (`vendor/zscaler-sdk-python/`) or Go (`vendor/zscaler-sdk-go/`) policy/operand source, nor in the Postman collection (`vendor/zscaler-api-specs/oneapi-postman-collection.json`). They may be wire-only API enums the TF provider and SDK don't model, or they may be stale. Needs a real GET on `access-policy-rules` (or a Postman/API enum citation) to confirm whether either appears on the wire; otherwise treat them as unverified. (Tracked as [`zpa-73`](../_meta/clarifications.md#zpa-73-objecttype-zpn_internal_internet_protocol-and-user-wire-validity).)
- **`tcpKeepAlive` literal wire token** — SDK and TF both treat it as string-as-bool `"0"`/`"1"` (resolved above), but the Postman `<integer>` type hint leaves open whether the GET response returns the quoted string `"0"` or a bare integer `0`. Needs a live capture: `jq '.list[0].tcpKeepAlive' _data/snapshot/<cloud>/zpa/app-segments.json`. (Tracked as [`zpa-74`](../_meta/clarifications.md#zpa-74-tcpkeepalive-literal-wire-token-quoted-string-vs-bare-integer).)
- **`configSpace` at segment top level** — confirm whether `SIEM` is valid at the segment top level or only in embedded serverGroups/appResource objects. Needs a live capture (verification command #2 above). (Tracked as [`zpa-75`](../_meta/clarifications.md#zpa-75-configspace-at-the-segment-top-level).)
