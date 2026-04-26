---
product: zia
topic: "snapshot-schema"
title: "ZIA snapshot/ schema — what's in the JSON, how to read it"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zia/models/"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/terraform-provider-zia/zia/"
  - "scripts/snapshot-refresh.py"
author-status: draft
---

# ZIA snapshot/ schema

Operational reference for the JSON files `scripts/snapshot-refresh.py` writes under `snapshot/zia/`. Pre-written from SDK model classes (`vendor/zscaler-sdk-python/zscaler/zia/models/`) + Postman API surface + Terraform provider schema + existing reasoning docs. Once a real fork-admin run produces tenant data, validate this doc against actual JSON and bump confidence to `high`.

## Files written by `--zia-only`

```
snapshot/zia/url-categories.json
snapshot/zia/url-filtering-rules.json
snapshot/zia/cloud-app-control-rules.json
snapshot/zia/ssl-inspection-rules.json
snapshot/zia/advanced-settings.json
```

Plus `snapshot/_manifest.json` with timestamps and per-resource counts (manifest format documented in `scripts/snapshot-refresh.py` itself).

## Wire-format conventions for ZIA

- **camelCase JSON keys.** All ZIA API responses use camelCase (`urlFilterRulesCount`, not `url_filter_rules_count`).
- **The Python SDK exposes snake_case** Python attribute names and translates internally. Tooling reading JSON directly (e.g., `jq` queries) must use the **camelCase** wire keys, not snake_case.
- **Rule IDs are integers** (`id: 12345`) in url-filtering-rules and ssl-inspection-rules. Different from ZPA where all IDs are strings.
- **URL category IDs are strings** — predefined categories use a code like `"OTHER_ADULT_MATERIAL"`; custom categories use `"CUSTOM_89"` (string, not integer). Do not assume numeric.
- **`urlCategories` in rules is an array of strings**, not objects. `["OTHER_ADULT_MATERIAL", "CUSTOM_89"]`, not `[{id, name}]`. Confirmed from tenant data.
- **Flat arrays, not paginated wrappers.** Both url-categories and url-filtering-rules return bare arrays (`type: "array"`), not the `{list, totalCount, totalPages}` wrapper ZPA uses.
- **Nested arrays of objects** are common. Don't expect flat structures.
- **`null` vs missing fields.** SDK's `if "key" in config` patterns mean an absent key gets a Python `None`. JSON snapshots usually have all fields with `null` rather than omitting — but verify.
- **Read-only metadata fields** like `lastModifiedTime` (epoch seconds) and `lastModifiedBy: { id, name }` accompany most resources.

## `url-categories.json`

API: `GET /zia/api/v1/urlCategories`

**Shape:** array of URLCategory objects. Not paginated; whole list returned.

```json
[
  {
    "id": "OTHER_ADULT_MATERIAL",     // always a STRING — predefined = category code, custom = "CUSTOM_89"
    "configuredName": "Other Adult Material",
    "superCategory": "ADULT_MATERIAL",
    "customCategory": false,
    "description": "...",
    "type": "URL_CATEGORY",           // or TLD_CATEGORY / ALL
    "urlType": "EXACT",               // EXACT, REGEX
    "urls": [],
    "keywords": [],
    "ipRanges": [],
    "regexPatterns": [],
    "dbCategorizedUrls": [],          // urls inherited from Zscaler's URL DB

    // Retain Parent Category lists — key to zia-01 clarification
    "keywordsRetainingParentCategory": [],
    "regexPatternsRetainingParentCategory": [],
    "ipRangesRetainingParentCategory": [],

    "scopes": [                       // for custom categories: who can see/edit
      {
        "Type": "ORGANIZATION",       // or DEPARTMENT, LOCATION, LOCATION_GROUP
        "ScopeEntities": [],
        "scopeGroupMemberEntities": []
      }
    ],

    // urlKeywordCounts does NOT exist in actual API responses — SDK-only artifact
    "editable": true,
    "lastModifiedTime": 1735689600,   // epoch seconds
    "lastModifiedBy": { "id": 1, "name": "admin@example.zscalertwo.net" }
  }
]
```

Full SDK model: `vendor/zscaler-sdk-python/zscaler/zia/models/urlcategory.py`.

### Common jq queries

```bash
# All custom categories
jq '[.[] | select(.customCategory == true)] | .[].configuredName' snapshot/zia/url-categories.json

# Categories using regex matching
jq '[.[] | select(.urlType == "REGEX")] | .[] | {name: .configuredName, patterns: .regexPatterns}' snapshot/zia/url-categories.json

# All entries that retain parent category (zia-01 mechanic)
jq '.[] | select((.keywordsRetainingParentCategory | length) > 0 or (.regexPatternsRetainingParentCategory | length) > 0) | .configuredName' snapshot/zia/url-categories.json

# Find which custom category contains a specific URL
jq --arg url "example.com" '.[] | select(.urls | index($url) or .dbCategorizedUrls | index($url)) | .configuredName' snapshot/zia/url-categories.json
```

Cross-links: [`./url-filtering.md`](./url-filtering.md), [`./wildcard-semantics.md`](./wildcard-semantics.md), [clarification `zia-01`](../_clarifications.md#zia-01-predefined-vs-custom-category-specificity).

## `url-filtering-rules.json`

API: `GET /zia/api/v1/urlFilteringRules`

**Shape:** array of URL Filtering rule objects, ordered by `order` field (rule evaluation order).

```json
[
  {
    "id": 1234,
    "name": "Block Social Media for Engineering",
    "order": 5,                       // rule evaluation order — first-match-wins
    "rank": 7,                        // admin rank — higher rank required to edit
    "state": "ENABLED",               // or DISABLED — disabled rules retain order slot
    "action": "BLOCK",                // ALLOW, CAUTION, BLOCK, ISOLATE, ICAP_RESPONSE_MODE
                                      // CIPA: BLOCK, ALLOW, CAUTION (3-way)
                                      // see references/zia/url-filtering.md for full enum

    "description": "...",

    // Rule-applicability criteria (all are arrays of objects with id+name)
    "locations": [],
    "groups": [],
    "departments": [],
    "users": [],
    "deviceGroups": [],
    "devices": [],
    "labels": [],
    "timeWindows": [],
    "locationGroups": [],

    // Match criteria — urlCategories is an array of STRINGS, not objects
    "urlCategories": ["OTHER_ADULT_MATERIAL", "CUSTOM_89"],  // string category IDs (confirmed)
    // urlCategories2 does NOT appear in real responses (count: 0) — likely write-only or deprecated
    "requestMethods": [],
    "userAgentTypes": [],
    "userRiskScoreLevels": [],
    "deviceTrustLevels": [],          // LOW, MEDIUM, HIGH

    "protocols": [],                  // HTTPS_RULE, HTTP_RULE, FTP_RULE, etc.
    "ciparule": false,                // CIPA mode flag

    // Action-specific fields
    "blockOverride": false,           // allow override on block? (conditional)
    "overrideUsers": [],              // who can override? (conditional)
    "overrideGroups": [],
    "endUserNotificationUrl": "...",  // custom block page URL

    // Quota fields
    "timeQuota": 0,                   // 15-600 minutes per CIPA range
    "sizeQuota": 0,                   // 10-100000 KB

    // Time-based validity
    "validityStartTime": 0,
    "validityEndTime": 0,
    "validityTimeZoneId": "UTC",
    "enforceTimeValidity": false,

    "predefined": false,              // shipped predefined rule (some can't be deleted)
    "lastModifiedTime": 1735689600,
    "lastModifiedBy": { "id": 1, "name": "..." }
  }
]
```

Full SDK model: `vendor/zscaler-sdk-python/zscaler/zia/models/url_filtering_rules.py`.

### Common jq queries

```bash
# Rules in evaluation order
jq 'sort_by(.order) | .[] | {order, name, action, state}' snapshot/zia/url-filtering-rules.json

# Disabled rules (still hold their order slot — see url-filtering.md)
jq '[.[] | select(.state == "DISABLED")] | .[] | .name' snapshot/zia/url-filtering-rules.json

# Rules referencing a specific URL category
jq --arg cat "Custom_Engineering" '.[] | select(.urlCategories | index($cat) or .urlCategories2 | index($cat)) | .name' snapshot/zia/url-filtering-rules.json

# Rules with block-override allowed (and who)
jq '.[] | select(.blockOverride == true) | {name, overrideUsers: [.overrideUsers[].name], overrideGroups: [.overrideGroups[].name]}' snapshot/zia/url-filtering-rules.json

# Rules scoped by location group
jq '[.[] | select((.locationGroups | length) > 0)] | .[] | {name, groups: [.locationGroups[].name]}' snapshot/zia/url-filtering-rules.json
```

Cross-links: [`./url-filtering.md`](./url-filtering.md), [`./locations.md`](./locations.md).

## `cloud-app-control-rules.json`

API: `GET /zia/api/v1/webApplicationRules` (Postman: 23 ZIA folders / Cloud App Control Policy)

**Shape:** Cloud App Control rules, organized by **rule type**. Multiple rule types exist (one per cloud-app category — Webmail, Streaming, Social, etc.).

```json
[
  {
    "id": 5001,
    "name": "Block Webmail Sends",
    "order": 1,
    "rank": 7,
    "state": "ENABLED",

    "type": "WEBMAIL",                // rule-type discriminator — controls which actions are valid
    "actions": ["BLOCK_WEBMAIL_SEND"],// list (slice) — multiple actions per rule possible

    "applications": [                 // which cloud apps this rule scopes to
      { "id": 12, "name": "Gmail" },
      { "id": 13, "name": "Yahoo Mail" }
    ],
    "cloudAppRiskProfile": null,      // see references/zia/cloud-app-control.md
    "cloudAppInstances": [],          // tenant-instance scoping

    "cascadingEnabled": true,         // see cloud-app-control.md cascading semantics
    "tenancyProfileIds": [],          // Tenant Restriction profiles

    // Standard ZIA criteria (same shape as URL Filtering)
    "locations": [],
    "groups": [],
    "departments": [],
    "users": [],
    "deviceGroups": [],
    "labels": [],
    "timeWindows": [],
    "locationGroups": [],

    "predefined": false,
    "lastModifiedTime": 1735689600,
    "lastModifiedBy": { "id": 1, "name": "..." }
  }
]
```

**`type` enum** controls per-rule action validity. The full `type` set is enumerated by `GET /zia/api/v1/webApplicationRules/ruleTypeMapping`. Per-type valid actions queryable via `GET /zia/api/v1/webApplicationRules/availableActions`.

Full SDK model: `vendor/zscaler-sdk-python/zscaler/zia/models/cloud_app_policy.py`.

### Common jq queries

```bash
# Group rules by type — see what cloud-app categories you're filtering
jq 'group_by(.type) | map({type: .[0].type, rule_count: length})' snapshot/zia/cloud-app-control-rules.json

# Find rules with cascading off (cascading-disabled rules cause CAC-vs-URL-Filter conflicts)
jq '.[] | select(.cascadingEnabled == false) | {name, type, actions}' snapshot/zia/cloud-app-control-rules.json

# Rules with multiple actions
jq '.[] | select((.actions | length) > 1) | {name, actions}' snapshot/zia/cloud-app-control-rules.json
```

Cross-links: [`./cloud-app-control.md`](./cloud-app-control.md).

## `ssl-inspection-rules.json`

API: `GET /zia/api/v1/sslInspectionRules` (Postman: 23 ZIA folders / Security Policy Settings)

**Shape:** array of SSL Inspection rule objects.

```json
[
  {
    "id": 8001,
    "name": "Decrypt all but financial",
    "order": 1,
    "rank": 7,
    "state": "ENABLED",
    "accessControl": "READ_WRITE",
    "predefined": false,
    "defaultRule": false,             // marker: cannot be deleted via API

    // The action object — top-level wrapper around decrypt-or-not decision
    "action": {
      "type": "DECRYPT",              // DECRYPT, DO_NOT_DECRYPT, BLOCK
      "showEunForUntrustedCerts": true,
      "overrideDefaultCertificate": false,

      // Conditional sub-objects depending on type
      "decryptSubActions": {          // present when type=DECRYPT
        "serverCertificates": "ALLOW", // BLOCK or ALLOW
        "ocspCheck": true,
        "blockSslTrafficWithNoSniEnabled": false,
        "minClientTlsVersion": "...",
        "minServerTlsVersion": "...",
        "blockUndecryptTraffic": false,
        "http2Enabled": false         // wire is camelCase — http2Enabled, NOT http2_enabled
      },

      "doNotDecryptSubActions": {     // confirmed present for all DO_NOT_DECRYPT rules
        "bypassOtherPolicies": false,
        "serverCertificates": "ALLOW",
        "minTlsVersion": "..."
      },

      "sslInterceptionCert": { "id": 1, "name": "Default Zscaler CA" }
    },

    "platforms": [                    // SCAN_IOS, SCAN_ANDROID, SCAN_MACOS, SCAN_WINDOWS, SCAN_LINUX, NO_CLIENT_CONNECTOR
      "SCAN_WINDOWS",
      "SCAN_MACOS"
    ],
    "roadWarriorForKerberos": false,

    // Standard scoping criteria
    "locations": [],
    "locationGroups": [],
    "departments": [],
    "groups": [],
    "users": [],
    "deviceGroups": [],

    // Match criteria
    "urlCategories": [],
    "cloudApplications": [],
    "userAgentTypes": [],
    "deviceTrustLevels": [],
    "destIpGroups": [],
    "sourceIpGroups": [],
    "zpaAppSegments": [],             // ZIA→ZPA cross-product hook

    "description": "...",
    "lastModifiedTime": 1735689600,
    "lastModifiedBy": { "id": 1, "name": "..." }
  }
]
```

Full SDK model: `vendor/zscaler-sdk-python/zscaler/zia/models/ssl_inspection_rules.py`.

### Common jq queries

```bash
# All Do-Not-Decrypt rules — the bypass set
jq '.[] | select(.action.type == "DO_NOT_DECRYPT") | {name, urlCategories: [.urlCategories[].id]}' snapshot/zia/ssl-inspection-rules.json

# Predefined rules (cannot be deleted via API)
jq '.[] | select(.predefined == true) | {name, action: .action.type}' snapshot/zia/ssl-inspection-rules.json

# Rules referencing ZPA app segments (cross-product SIPA hook)
jq '.[] | select((.zpaAppSegments | length) > 0) | {name, zpa: [.zpaAppSegments[].name]}' snapshot/zia/ssl-inspection-rules.json

# Rules with bypassOtherPolicies (skip downstream content inspection)
jq '.[] | select(.action.doNotDecryptSubActions.bypassOtherPolicies == true) | .name' snapshot/zia/ssl-inspection-rules.json
```

Cross-links: [`./ssl-inspection.md`](./ssl-inspection.md), [`./url-filtering.md § Rule order`](./url-filtering.md), [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md) (for `zpaAppSegments`).

## `advanced-settings.json`

API: `GET /zia/api/v1/advancedSettings`

**Shape:** single object (NOT an array). Tenant-wide settings. ⚠️ Not yet verified against real tenant data — `snapshot-refresh.py` may not dump this in all configurations.

```json
{
  "logInternalIp": false,
  "cascadeUrlFiltering": true,        // toggle for URL Filter cascading default
  "enableAdminRankAccess": false,     // admin-rank-as-gate enabled?
  "uiSessionTimeout": 1800,
  "ecsForAllEnabled": false,
  "dynamicUserRiskEnabled": false,
  "preferSniOverConnHost": false,
  "sipaXffHeaderEnabled": false,      // see references/shared/source-ip-anchoring.md

  // Many more boolean toggles — see SDK model
  "enableEvaluatePolicyOnGlobalSslBypass": false,  // url-filtering.md security toggle
  "enableOffice365": false,           // M365 One-Click — disables SSL bypass
  "enableMsftO365": false,
  "enableZoom": false,                // UCaaS One-Click toggles
  "enableLogmein": false,
  "enableRingcentral": false,
  "enableWebex": false,
  "enableTalkdesk": false,

  "blockSkype": false,
  "blockUdpAndIcmpForBypassUrl": false
  // ... 20+ additional boolean settings
}
```

Full SDK model: `vendor/zscaler-sdk-python/zscaler/zia/models/advanced_settings.py`. ~50+ tenant-wide flags.

### Common jq queries

```bash
# Show all enabled (true) advanced settings
jq 'to_entries | map(select(.value == true)) | from_entries' snapshot/zia/advanced-settings.json

# Check One-Click bypass states
jq '{office365: .enableOffice365, m365: .enableMsftO365, zoom: .enableZoom, webex: .enableWebex}' snapshot/zia/advanced-settings.json

# Cascading-URL-filtering toggle (affects rule semantics)
jq '.cascadeUrlFiltering' snapshot/zia/advanced-settings.json
```

Cross-links: [`./url-filtering.md § cascading`](./url-filtering.md), [`./cloud-app-control.md § Microsoft 365 One-Click`](./cloud-app-control.md).

## What's NOT yet in the snapshot

Resources `snapshot-refresh.py` doesn't currently dump that you might want to extend it to cover:

| Resource | API path | Why useful |
|---|---|---|
| Firewall rules | `/firewallFilteringRules` | "Why was this blocked at L4?" debugging |
| NAT rules | `/firewallNatControlRules` | NAT rewrite affects FW criteria |
| DNS Control rules | `/firewallDnsRules` | DNS-layer policy distinct from URL Filter |
| IPS rules | `/firewallIpsRules` | Signature-based threat coverage |
| DLP rules | `/webDlpRules` | DLP coverage; references engines |
| DLP engines / dictionaries | `/dlpEngines`, `/dlpDictionaries` | DLP rule's referenced objects |
| Sandbox rules | `/sandboxRules` | Sandbox per-MD5-hash policy |
| Bandwidth rules | `/bandwidthControlRules` | Traffic-shaping policy |
| Locations + sublocations | `/locations`, `/locations/sublocations` | Forwarding endpoint inventory |
| Location groups | `/locationGroups` | Policy-scoping containers |
| Auth settings | `/authSettings` | Auth flow / SAML / Kerberos config |
| Admin users | `/adminUsers` | Admin RBAC inventory |
| Admin roles | `/adminRoles` | Role definitions |
| NSS feeds | `/nssFeeds` | Log-streaming config |

Adding any of these requires updating `scripts/snapshot-refresh.py`'s ZIA resource list. SDK methods are documented in `vendor/zscaler-sdk-python/zscaler/zia/`.

## ⚠️ Verification needed — ZIA schema written from SDK only

Unlike ZPA (where the Postman collection has 76KB+ request/response bodies), the ZIA Postman collection has no detailed schemas (all request bodies under 2KB). This entire document was derived from SDK model classes and the TF provider — no wire-format cross-reference exists. A real tenant run is the only way to validate.

### Priority verification queries

Run these against a populated `snapshot/zia/` or live API and record what diverges from the examples above:

```bash
# 1. url-categories.json — is id a string code ("MUSIC") for predefined, or always numeric?
jq '[.[] | {id: .id, idType: (.id | type), custom: .customCategory}] | group_by(.idType) | map({type: .[0].idType, count: length, example: .[0].id})' snapshot/zia/url-categories.json

# 2. url-categories.json — does urlKeywordCounts appear, and what is its shape?
jq '.[0] | {hasUrlKeywordCounts: has("urlKeywordCounts"), val: .urlKeywordCounts}' snapshot/zia/url-categories.json

# 3. url-filtering-rules.json — what does a populated urlCategories entry look like?
# (doc shows [] — does it contain id+name objects or just IDs or just names?)
jq '.[] | select((.urlCategories | length) > 0) | {name, urlCategoriesSample: .urlCategories[:2]}' snapshot/zia/url-filtering-rules.json | head -30

# 4. url-filtering-rules.json — does urlCategories2 actually appear in real rules?
jq '[.[] | select(has("urlCategories2"))] | length' snapshot/zia/url-filtering-rules.json

# 5. ssl-inspection-rules.json — does the nested action.decryptSubActions shape exist?
jq '.[] | select(.action.type == "DECRYPT") | {name, hasDecryptSubActions: (.action | has("decryptSubActions")), subActions: .action.decryptSubActions}' snapshot/zia/ssl-inspection-rules.json | head -20

# 6. ssl-inspection-rules.json — does doNotDecryptSubActions appear for DO_NOT_DECRYPT rules?
jq '.[] | select(.action.type == "DO_NOT_DECRYPT") | {name, hasDoNotDecrypt: (.action | has("doNotDecryptSubActions"))}' snapshot/zia/ssl-inspection-rules.json

# 7. advanced-settings.json — how many fields are there actually? (doc says 50+)
jq 'keys | length' snapshot/zia/advanced-settings.json

# 8. Are all ZIA IDs integers (not strings)?
jq '[.[] | .id | type] | unique' snapshot/zia/url-filtering-rules.json
jq '[.[] | .id | type] | unique' snapshot/zia/ssl-inspection-rules.json

# 9. Does url-categories return unpaginated (one flat array) or wrapped?
jq 'type' snapshot/zia/url-categories.json   # expect "array", not "object"
jq 'type' snapshot/zia/url-filtering-rules.json  # expect "array"
```

**Resolved from tenant verification (2026-04-26):**
- ✅ url-categories `id` is always a **string** — predefined = category code (`"OTHER_ADULT_MATERIAL"`), custom = `"CUSTOM_89"`. Not integer.
- ✅ `urlCategories` in rules is an **array of strings**, not `{id, name}` objects.
- ✅ `urlCategories2` does **not** appear in real responses — write-only or deprecated. Removed from schema.
- ✅ `urlKeywordCounts` does **not** exist in real responses — SDK artifact. Removed from schema.
- ✅ `decryptSubActions` structure confirmed correct.
- ✅ `doNotDecryptSubActions` confirmed present for all DO_NOT_DECRYPT rules.
- ✅ Pagination: both url-categories and url-filtering-rules return flat arrays, not ZPA-style wrapped responses.
- ✅ Rule IDs (url-filtering, ssl-inspection) are integers. url-category IDs are strings.

**Still open:**
- `advanced-settings.json` — not in the Z2 tenant dump, couldn't verify field list.

## Wire-format gotchas

1. **camelCase, always.** ZIA's wire format is camelCase. The SDK exposes snake_case Python; tooling reading JSON directly must use camelCase.

2. **Booleans default to `false` in SDK construction.** A field absent from the API response gets `false` from the SDK. Don't trust SDK-derived structures to faithfully represent "unset" — verify against actual JSON.

3. **Embedded objects are common.** `urlCategories` is an array of `{id, name, ...}` objects, not just an array of names or IDs. Most cross-references follow this pattern.

4. **`order` and `rank` differ.** `order` is rule evaluation position (first-match-wins). `rank` is admin-rank gate (which admins can edit). Don't conflate.

5. **`state: "DISABLED"` rules retain their order slot** — they aren't skipped in numbering. See [`./url-filtering.md`](./url-filtering.md) for evaluation semantics.

6. **`predefined: true` rules can't be deleted via API.** Editing requires admin rank ≥ predefined-rule rank. Most are admin-rank 7.

7. **`defaultRule: true` (SSL Inspection) is the catch-all rule.** Always present, always last. Modify via update; can't be deleted.

## Cross-links

- [`./api.md`](./api.md) — endpoint catalog
- [`./url-filtering.md`](./url-filtering.md) — URL filtering reasoning
- [`./cloud-app-control.md`](./cloud-app-control.md) — CAC reasoning
- [`./ssl-inspection.md`](./ssl-inspection.md) — SSL inspection reasoning
- [`./locations.md`](./locations.md) — Location / Location Group container types referenced in rules
- [`../_layering-model.md`](../_layering-model.md) — how snapshot data layers onto general docs
