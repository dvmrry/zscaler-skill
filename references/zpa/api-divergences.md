---
product: zpa
topic: "api-divergences"
title: "ZPA API source divergences"
content-type: reference
confidence: medium
last-verified: "2026-06-12"
verified-against:
  vendor/zscaler-sdk-go: fe52adcee3dc10bbad12ea8e9f8e17a4583c655a
  vendor/zscaler-sdk-python: b3c3645fd530b668c463ce5f1331cfcfc7cb4c00
sources:
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/**"
  - "vendor/zscaler-sdk-python/zscaler/zpa/**"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "Field observations relayed from the maintainer's zscaler-as-code IaC repo (tools/MINING.md; not vendored here)"
author-status: draft
---

# ZPA API source divergences

The Go SDK, the Python SDK, and the Postman collection are three independent views of the same ZPA management API, each produced separately and updated at different cadences. Where they agree, confidence is high. Where they diverge, an engineer needs to know which source to trust before writing code — and the answer changes by field, endpoint, and resource type.

Field observations relayed from the maintainer's live-tenant IaC repo (`MINING.md` and associated test files) add a fourth signal: actual API behavior encountered in production. Those observations can corroborate or contradict the SDK and collection claims, but cannot be reproduced from these sources alone and are flagged accordingly.

**Quick trust hierarchy (applies unless an entry below overrides it):**

- Live cassette / IaC field observation > Go SDK source > Python SDK docstring > Postman schema annotation
- Postman example response bodies beat Postman schema annotations when the two differ
- Both SDKs use string for all ZPA IDs; Postman's `<long>` annotations are a Java/schema artifact — treat them as strings


---

## Application Segments (all variants)

### `AppSegmentInspection.SegmentGroupID` — `omitempty` presence

**What each source says:**

- **Go SDK (Inspection):** `json:"segmentGroupId,omitempty"` — field is omitted when empty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:22`)
- **Go SDK (BrowserAccess):** also has `omitempty`.
- **Go SDK (core `ApplicationSegmentResource` and `AppSegmentPRA`):** no `omitempty` — empty string is always sent on the wire. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:47`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:43`)

**Significance / which to trust:** Trust the source file. An engineer omitting `segmentGroupId` on a PRA or core segment will send an empty string; for Inspection or BrowserAccess segments the field is omitted safely.

---

### `icmpAccessType` enum — `PING_TRACEROUTING` absent from Python SDK

**What each source says:**

- **Postman:** response bodies confirm `PING_TRACEROUTING` as a live API value. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:11008`)
- **Python SDK:** docstring lists only `PING` and `NONE`. (`vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:687`)
- **Go SDK:** treats the field as a free string with no enum validation.

**Significance / which to trust:** Trust Postman. Python docstring is incomplete. `PING_TRACEROUTING` is a valid value; Python SDK callers can pass it as a raw string.

---

### `connectionSecurity` enum — Python SDK adds `NLA` not in Postman or Go SDK

**What each source says:**

- **Python SDK (PRA):** lists `ANY`, `NLA`, `NLA_EXT`, `TLS`, `VM_CONNECT`, `RDP`. (`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_pra.py:188`)
- **Postman:** raw body examples show `ANY`, `TLS`, `RDP`, `NLA_EXT`, `VM_CONNECT` — `NLA` is absent from all examples. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:11008`)
- **Go SDK:** no enum validation.

**Significance / which to trust:** `NLA` may be legacy or undocumented. Postman is the stronger evidence source; do not depend on `NLA` without live-tenant verification.

---

### Sub-app ID matching strategy on Update — Go SDK matches by Name; Python SDK matches by domain

**What each source says:**

- **Go SDK (Inspection Update):** builds a map of existing `inspectionApps` keyed by sub-app Name (case-sensitive), injects `InspectAppID` by name match. PRA Update is identical. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:178-188`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:206-217`)
- **Python SDK (Inspection and PRA Updates):** fetches via `getAppsByType` and maps by domain. (`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_inspection.py:417-427`, `vendor/zscaler-sdk-python/zscaler/zpa/app_segments_pra.py:378-388`)

**Significance / which to trust:** Engineers using the Go SDK must ensure sub-app names match exactly; Python SDK engineers must ensure domains match. A sub-app whose name differs from its domain is a silent ID-injection failure in the Go SDK.

---

### `AppSegmentInspection.deletedInspectApps` — Go SDK (Inspection) requires manual population; Python and Go SDK (PRA) auto-compute

**What each source says:**

- **Go SDK Inspection Update:** does not automatically populate `DeletedInspectApps` when sub-apps are removed — callers must set it manually. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:168-202`)
- **Go SDK PRA Update:** auto-computes `DeletedPraApps`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:220-234`)
- **Python SDK:** auto-computes deleted apps for both Inspection and PRA. (`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_inspection.py:429-433`)

**Significance / which to trust:** Go SDK Inspection callers who remove sub-apps without manually setting `DeletedInspectApps` will leave orphaned sub-app records server-side. There is no fallback.

---

### Move request body — Go SDK includes `applicationId` and `microtenantId`; Postman and Python omit them

**What each source says:**

- **Go SDK:** `AppSegmentMicrotenantMoveRequest` has 5 fields including `applicationId` and `microtenantId` (both `omitempty`). (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment_move/applicationsegment_move.go:17-42`)
- **Postman / Python SDK:** send only 3 body fields (`targetSegmentGroupId`, `targetMicrotenantId`, `targetServerGroupId`); `applicationId` is in the URL path, `microtenantId` is an optional query parameter. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:15068`, `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:566-569`)

**Significance / which to trust:** Trust Postman/Python for wire format. The Go SDK `applicationId` and `microtenantId` body fields are harmless extras with `omitempty` — they are not sent if empty, and even if sent, the path-param and query-param values take precedence.

---

### `ApplicationMappings` response shape — Go SDK returns `{name, type}`; Python docstring implies `{type, names[]}`

**What each source says:**

- **Go SDK:** `ApplicationMappings` struct has `Name string` and `Type string`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:275-278`)
- **Python SDK:** docstring example uses `mapping.get('names')` implying a list field. (`vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:1162-1163`)

**Significance / which to trust:** Do not assume the mappings response has a `names` array. The Go SDK models it as a flat `{name, type}` record. Python docstring appears illustrative, not authoritative.

---

### `provision` endpoint — Python SDK only

**What each source says:**

- **Python SDK:** exposes `POST /application/provision`. (`vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:663,759-762`)
- **Go SDK / Postman:** no equivalent.

**Significance / which to trust:** Go SDK users cannot call the provision endpoint without crafting a raw HTTP request. Validate the provision endpoint contract against live-tenant behavior since Postman corroboration is absent.

---

### `shareToMicrotenants` wire type — `[]string` (Go SDK) vs `<long>` (Postman)

**What each source says:**

- **Go SDK:** `ShareToMicrotenants` is `[]string`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment_share/applicationsegment_share.go:17-20`)
- **Postman:** `shareToMicrotenants` is an array of `<long>` values. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:14320`)

**Significance / which to trust:** The API likely accepts both representations. Use the Postman type (long/integer) in raw requests; the Go SDK string representation works in practice because ZPA IDs are numeric strings.

---

### Field observations (Application Segments)

**`policy_style` — string returned by API; Terraform maps to bool (corroborated)**
All three Go SDK structs (`ApplicationSegmentResource`, `AppSegmentPRA`, `AppSegmentInspection`) carry `PolicyStyle string json:"policyStyle,omitempty"`. The API returns a string enum (`DUAL_POLICY_EVAL` or `NONE`). Any Terraform schema that exposes this as `bool` is performing a non-obvious conversion. Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:76`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:67`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:67`. (Corroborating field observation recorded in the maintainer's IaC repo mining notes.)

**`server_groups` — API returns N separate objects; provider collapses to one merged block (corroborated)**
Both SDKs confirm the API accepts and returns N separate server group objects. The merge-flatten behavior is Terraform-provider-specific; the SDK surface is a proper list. Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:67`, `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:273-274`. (Corroborating field observation recorded in the maintainer's IaC repo mining notes.)

**`segment_group.applications` — server-computed back-reference (corroborated)**
The Python SDK confirms segment group membership is managed from the application segment side (via `SegmentGroupID`). The Go SDK `ApplicationSegmentResource.Applications` is `string json:"applications,omitempty"` — a summary field, not a list of objects. This supports the IaC claim that carrying the applications list in Terraform config causes phantom drift. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:36`) (Corroborating field observation recorded in the maintainer's IaC repo transform tests.)

---

## Access, Timeout, Forwarding and Inspection Policy

### `v2 UpdateRule` URL path — v2 package uses v2 path (not v1 as claimed)

**What each source says:**

- **Go SDK (v2):** `path = fmt.Sprintf(mgmtConfigV2+...)` at line 281. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:281`)
- **Postman:** documents `PUT /mgmtconfig/v2/.../rule/:ruleId`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:77032`)

**Significance / which to trust:** The v2 package UpdateRule correctly uses the v2 URL. Any cached claim to the contrary is wrong. Callers constructing URLs manually must use the v2 path for update.

---

### `PrivilegedCapabilities` enum — Go SDK tests 5 values; Python SDK supports 9

**What each source says:**

- **Go SDK tests:** exercise only `INSPECT_FILE_UPLOAD`, `FILE_UPLOAD`, `FILE_DOWNLOAD`, `CLIPBOARD_COPY`, `CLIPBOARD_PASTE`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/zpa_policy_access_capability_rule_test.go:64`)
- **Python SDK:** additionally supports `INSPECT_FILE_DOWNLOAD`, `MONITOR_SESSION`, `RECORD_SESSION`, `SHARE_SESSION`. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:3207-3230`)

**Significance / which to trust:** The Go SDK struct does not constrain enum values, so the additional Python values likely work at the API level. Treat Python SDK as the broader authoritative list.

---

### `REDIRECTION_POLICY` actions — Python adds `REDIRECT_DEFAULT`; Go tests do not include it

**What each source says:**

- **Python SDK:** supports `REDIRECT_DEFAULT` with validation that `service_edge_group_ids` must be empty. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:3419-3423`)
- **Go SDK tests:** only show `REDIRECT_PREFERRED`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/zpa_policy_access_redirection_rule_test.go:74`)
- **Postman:** confirms `REDIRECT_DEFAULT` as a real wire value. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:77929`)

**Significance / which to trust:** Trust Python SDK and Postman. `REDIRECT_DEFAULT` is valid at the API level; its absence from Go test coverage is a gap in the tests, not an API restriction.

---

### `policyType` enum — Python SDK adds `PRIVILEGED_PORTAL_POLICY`, `VPN_TUNNEL_POLICY`, `USER_PORTAL`

**What each source says:**

- **Go SDK edge-case tests:** iterate exactly 10 `policyType` values (`ACCESS_POLICY` through `SIEM_POLICY`). (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/edge_cases_test.go:11-14`)
- **Python SDK:** adds `portal_policy → PRIVILEGED_PORTAL_POLICY`, `vpn_policy → VPN_TUNNEL_POLICY`, `user_portal → USER_PORTAL`. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:59-73`)

**Significance / which to trust:** These three policy families are real per the Python SDK. Engineers using only the Go SDK will not discover them from Go code alone.

---

### `BulkReorder` Default_Rule pinning — Go SDK pins automatically; Python SDK does not

**What each source says:**

- **Go SDK:** `BulkReorder` (v1 and v2) detects any rule named exactly `Default_Rule` and appends its ID last regardless of caller input. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:377-395`)
- **Python SDK:** `bulk_reorder_rules` sends the caller-supplied list without modification. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:4132-4147`)

**Significance / which to trust:** High impact. Omitting `Default_Rule` from the end of a bulk reorder in the Python SDK can break policy evaluation. Python SDK callers must manually place the `Default_Rule` ID last.

---

### `GetStepupAuthLevel` return type — `[]string` (Go) vs `[]StepUpAuthLevel` objects (Python)

**What each source says:**

- **Go SDK:** unmarshals into `[]string`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/step_up_auth/step_up_auth.go:30-38`)
- **Python SDK:** unmarshals into `[]StepUpAuthLevel` objects with all 12 fields. (`vendor/zscaler-sdk-python/zscaler/zpa/stepup_auth_level.py:91-101`)

**Significance / which to trust:** Callers switching between SDKs receive different data shapes from the same API endpoint. Verify the actual wire response before committing to either shape.

---

### `disabled` field type — `string` (Go SDK) vs `<integer>` (Postman) vs untyped (Python)

**What each source says:**

- **Go SDK (both v1 and v2):** `disabled` as `string` with `omitempty`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:51,130`)
- **Postman:** explicitly types `disabled` as `<integer>`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:73629`)

**Significance / which to trust:** Postman is likely authoritative on wire type. The field's zero-value (0/false/empty string) is the common case; mismatch only affects explicit enable/disable operations.

---

### `ALLOW` action for `ACCESS_POLICY` — confirmed in both SDKs; absent from Postman ZPA policy bodies

**What each source says:**

- **Go SDK:** access rule test uses `Action: 'ALLOW'`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/zpa_policy_access_rule_test.go:64`)
- **Python SDK:** accepts `'allow'` and uppercases it. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:546-550`)
- **Postman:** `ALLOW` does not appear in any ZPA policy rule body — only in ZIA firewall rule bodies. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:73629`)

**Significance / which to trust:** `ALLOW` is a real and valid access policy action. The Postman omission is a documentation gap, not an API restriction.

---

### `v1 Conditions` struct — has `microtenantId`; `v2 PolicyRuleResourceConditions` does not

**What each source says:**

- **Go v1:** `Conditions` struct (line 101) has `MicroTenantID string` with `omitempty`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/policysetcontroller.go:93-102`)
- **Go v2:** `PolicyRuleResourceConditions` struct (lines 161-169) has no `MicroTenantID` field. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:161-169`)
- **Postman:** consistent with Go — v1 conditions include `microtenantId`; v2 conditions include `setIds` instead. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:73629`)

**Significance / which to trust:** Serializing a v1 condition object with `microtenantId` to a v2 endpoint sends an unrecognized field.

---

### Field observations (Policy)

**`operands.name` rewritten by API (corroborated):** Go SDK v1 UpdateRule explicitly clears `operand.Name` before PUT (`policysetcontroller.go:198-202`). This confirms the IaC observation that the API always rewrites operand name to the referenced object's display name. The SDK strips it silently to prevent 400 errors.

**`priority` and `rule_order` — server-computed (partially corroborated):** Both fields are present in Go v2 `PolicyRule` request struct (lines 138, 141) but sending them on creates/updates is likely ignored or causes drift. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:138,141`) (Corroborating field observation recorded in the maintainer's IaC repo policy-rule pulls.)

**`capabilities.file_upload=False` maps to `INSPECT_FILE_UPLOAD` — Python SDK bug confirmed:** `policies.py:3216-3217` maps `priv_caps_map.get('file_upload') is False` to `'INSPECT_FILE_UPLOAD'`. Setting `file_upload=False` to mean inspect-uploads is counter-intuitive. `inspect_file_upload=True` independently also maps to `INSPECT_FILE_UPLOAD` (line 3222). (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:3214-3222`)

**`reformat_params` `app_connector_group_ids` → `'PolicySetControllers'` — dead-code SDK bug:** Python SDK `reformat_params` maps `app_connector_group_ids` to the key `'PolicySetControllers'` (copy-paste error). All access rule methods manually build the `appConnectorGroups` key before the helper runs, so this is never exercised in practice. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:75-79`)

---

## App Connectors, Groups and Schedules

### `AssistantSchedule.frequencyInterval` wire type — `string` (SDKs) vs `<integer>` (Postman)

**What each source says:**

- **Go SDK:** `FrequencyInterval` as Go `string`; valid-values map uses string keys (`"5"`, `"7"`, etc.). (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorschedule/appconnectorschedule.go:33`)
- **Python SDK:** passes `frequency_interval` as a string kwarg. (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_schedule.py:120`)
- **Postman:** types the field as integer in every `connectorSchedule` example. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:31272`)

**Significance / which to trust:** Trust the SDKs. Send `frequencyInterval` as a string-encoded integer, not a bare JSON integer.

---

### `AppConnectorGroup.dnsQueryType` — `IPV4_IPV6` absent from Postman `appConnectorGroup` examples

**What each source says:**

- **Python SDK:** documents `IPV4_IPV6`, `IPV4`, `IPV6` as accepted values. (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py:276-278`)
- **Go SDK test:** uses `'IPV4_IPV6'`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group_test.go:45`)
- **Postman:** `appConnectorGroup` response body shows only `'IPV4'`; `IPV4_IPV6` appears only in LSS config contexts. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:33311`)

**Significance / which to trust:** Trust both SDKs — `IPV4_IPV6` is accepted. The Postman example showing only `IPV4` is a sample value, not an exhaustive enum.

---

### `bulkDelete` ids array element type — `string` (SDKs) vs `<long>` (Postman)

**What each source says:**

- **Go SDK:** `BulkDeleteRequest.IDs` is `[]string`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go:100-102`)
- **Python SDK:** sends a plain list of string IDs. (`vendor/zscaler-sdk-python/zscaler/zpa/app_connectors.py:264-268`)
- **Postman:** documents `ids` as an array of long integers. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:27774`)

**Significance / which to trust:** Both SDKs use string arrays. Send string-encoded IDs consistent with the ZPA ID contract.

---

### `CustomerVersionProfile` Update endpoint path — Go SDK uses `/visible/versionProfiles/{id}`; Python uses `/versionProfiles/{id}`

**What each source says:**

- **Go SDK:** reuses the list endpoint constant (`/visible/versionProfiles`), producing `PUT /visible/versionProfiles/{id}`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/customerversionprofile/zpa_customer_version_profile.go:88-90`)
- **Python SDK:** uses `/versionProfiles/{id}`. (`vendor/zscaler-sdk-python/zscaler/zpa/customer_version_profile.py:169-172`)
- **Postman:** no PUT on either path — only GET `/visible/versionProfiles`.

**Significance / which to trust:** High impact. The Go SDK Update almost certainly calls the wrong URL. Trust Python SDK's `/versionProfiles/{id}` path. Verify against a live tenant before using the Go SDK Update.

---

### `update_connector_schedule` sends raw snake_case body instead of camelCase payload — Python SDK bug

**What each source says:**

- **Python SDK `add_connector_schedule` (POST):** builds camelCase payload dict, passes it to `create_request` correctly. (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_schedule.py:132`)
- **Python SDK `update_connector_schedule` (PUT):** builds camelCase payload but then passes the original snake_case body dict to `create_request`. (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_schedule.py:200`)
- **Go SDK:** unaffected — serializes via struct tags.

**Significance / which to trust:** High impact. This is a bug in the Python SDK's `update_connector_schedule`; the PUT payload will contain snake_case keys that the API will likely ignore or reject.

---

### `AppConnector.Enabled` — `omitempty` in Go SDK (false is omitted); default True in Python

**What each source says:**

- **Go SDK:** `Enabled` with `omitempty` — `false` is never sent on writes. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go:29`)
- **Python SDK:** model defaults `enabled` to `True` when the config key is absent. (`vendor/zscaler-sdk-python/zscaler/zpa/models/app_connectors.py:39`)

**Significance / which to trust:** Disabling a connector via Go SDK PUT will silently omit the `enabled=false` field. Verify API behavior when the field is absent.

---

### `AppConnectorSchedule` microtenant_id source — env var only for GET (Python); kwarg for POST/PUT (Python); service context (Go)

**What each source says:**

- **Python SDK:** `get_connector_schedule` reads `microtenant_id` exclusively from `ZPA_MICROTENANT_ID` env var. `add_connector_schedule` and `update_connector_schedule` accept it as a kwarg. (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_schedule.py:61-62,128-129,196-197`)
- **Go SDK:** always uses `service.MicroTenantID()` from the service context for all operations. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorschedule/appconnectorschedule.go:39`)

**Significance / which to trust:** Python GET schedule is microtenant-inflexible at runtime; callers in multi-microtenant contexts must rely on the env var for GET.

---

### `connectorSchedule` POST response code — Postman says 204 with body (contradictory); Go SDK tests accept 200 or 204

**What each source says:**

- **Postman:** documents `POST /connectorSchedule` as returning 204 No Content but echoes the full schedule object in the response example body — contradictory. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:32542,32622`)
- **Go SDK test:** accepts both 200 and 204 as valid. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorschedule/appconnectorschedule_test.go:32-33`)

**Significance / which to trust:** Handle both 200 and 204. Do not assume a parseable body on `POST /connectorSchedule`.

---

### Field observations (App Connectors)

**`latitude`/`longitude` — string fields, range-validated (corroborated):** The IaC claim that ZPA `app_connector_group` latitude and longitude are schema-typed as strings but validated with range bounds is confirmed. Go SDK types both as `string` (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go:30-32`). Postman types group-level lat/lon as `string` but connector-level as `double` — the group-level string contract stands. (Corroborating field observation recorded in the maintainer's IaC repo mining notes.)

**`update_connector_schedule` snake_case bug — not in IaC observations but confirmed in source:** See entry above. (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_schedule.py:185-200`)

**Go SDK `CustomerVersionProfile` Update wrong path:** See entry above. No IaC observation covers this endpoint. (`vendor/zscaler-sdk-go/zscaler/zpa/services/customerversionprofile/zpa_customer_version_profile.go:88-90`)

---

## Server Groups and Application Servers

### `ExtranetDTO` — `zpnErId` (Go) vs `ziaErId` (Python); neither SDK is complete

**What each source says:**

- **Go SDK:** `ExtranetDTO` has `zpnErId` (ZPA-side); no `ziaErId`. Separate `ZPNERID` helper struct carries `ziaErId`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:125-130,143-153`)
- **Python SDK:** `ExtranetDTO` has `ziaErId` (ZIA-side); no `zpnErId`. (`vendor/zscaler-sdk-python/zscaler/zpa/models/common.py:114-115`)
- **Postman:** does not document `extranetDTO` at all.

**Significance / which to trust:** Trust neither SDK alone for extranet configuration. The complete `ExtranetDTO` likely requires both `zpnErId` and `ziaErId`. Verify against a live tenant before writing.

---

### `AppServerGroups` join-table — `passive` and `weight` fields dropped by both SDKs

**What each source says:**

- **Postman:** `serverGroups` array inside `AppConnectorGroup` carries `passive` (boolean) and `weight` (integer) fields. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:119576`)
- **Go SDK / Python SDK:** `AppServerGroups` struct has neither field. (`vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:105-115`)

**Significance / which to trust:** Both SDKs silently drop `passive` and `weight`. If weighted load balancing or passive assignments at the join level are needed, read from the raw API response.

---

### `ApplicationServer.MicroTenantID` — in canonical Go struct; absent from shadow struct and Python model

**What each source says:**

- **Go SDK canonical struct:** has `MicroTenantID` and `MicroTenantName` with `omitempty`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appservercontroller/zpa_app_server_controller.go:29-30`)
- **Go SDK shadow struct** (in `servergroup` package) and **Python `AppServers` model:** both omit these fields. (`vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:117-128`, `vendor/zscaler-sdk-python/zscaler/zpa/models/application_servers.py:30-48`)

**Significance / which to trust:** Multi-tenant deployments managing `ApplicationServer` objects must use the canonical Go struct (`appservercontroller.ApplicationServer`) for microtenant-scoped writes.

---

### `Connector.upgradeAttempt` — `string` (Go SDK) vs `<integer>` (Postman)

**What each source says:**

- **Go SDK:** `upgradeAttempt` as `string`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:101`)
- **Postman:** types it as `<integer>`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:119576`)

**Significance / which to trust:** Go SDK will receive an empty string if the API sends a bare integer. JSON unmarshaling fails silently in that case.

---

### `server/summary` endpoint — absent from Postman collection

**What each source says:**

- **Go SDK:** `GetServerSummary` calls `GET /server/summary`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appservercontroller/zpa_app_server_controller.go:93-100`)
- **Python SDK:** `list_servers_summary` uses the same path. (`vendor/zscaler-sdk-python/zscaler/zpa/servers.py:142-146`)
- **Postman:** no entry for this endpoint.

**Significance / which to trust:** Both SDKs agree on the path and behavior. Treat it as a supported but undocumented convenience endpoint.

---

### `ServerGroup.dynamicDiscovery` — Go SDK sends false explicitly; Python SDK defaults to `True` on update

**What each source says:**

- **Python SDK `update_group`:** sets `dynamicDiscovery` to `True` if the field is absent from the merged body. `add_group` has no equivalent guard. (`vendor/zscaler-sdk-python/zscaler/zpa/server_groups.py:284-285`)
- **Go SDK:** no default-injection; whatever the struct holds (including `false`) is serialized. (`vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:27`)

**Significance / which to trust:** A Python-based update that omits `dynamic_discovery` silently sends `True`, potentially enabling dynamic discovery on a previously static group. Pass `dynamic_discovery=False` explicitly in Python to preserve a `false` value.

---

### `ServerGroup.Applications` — always serialized (Go, no `omitempty`); stripped by default on update (Python)

**What each source says:**

- **Go SDK:** always serializes `Applications` (no `omitempty`). (`vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:39`)
- **Python SDK `update_group`:** drops `'applications'` from the PUT body unless the caller explicitly passes `applications=` in kwargs — specifically to avoid 413 errors on large tenants. `add_group` does not strip it. (`vendor/zscaler-sdk-python/zscaler/zpa/server_groups.py:278-280`)

**Significance / which to trust:** Go SDK callers should ensure `Applications` is not populated before PUT unless intentional. Python SDK callers who need to manage the applications association via `update_group` must explicitly pass it.

---

### Field observations (Server Groups)

**`server_groups` merge-flatten drift (corroborated):** The IaC claim that the Terraform provider's `flattenCommonAppServerGroupSimple` collapses all N ServerGroup API elements into one merged block is corroborated. The SDK correctly returns all N objects; flattening is a provider-layer behavior on the read path. Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:181-188`. IaC source: `MINING.md:29,125`.

**IP-anchoring blocks referential deletes (consistent, not directly corroborated):** `ServerGroup.IpAnchored` has no `omitempty` — always serialized. The SDK does not implement any pre-delete anchoring check; the block is server-side. Callers should set `IpAnchored` to `false` before attempting deletion. (`vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:25`) (Corroborating field observation recorded in the maintainer's IaC repo mining notes.)

---

## Posture Profiles and Trusted Networks

### `PostureProfile.platform` — `string` scalar (Go SDK) vs array (Python SDK and Postman)

**What each source says:**

- **Go SDK:** `platform` as `string` (scalar). (`vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go:26`)
- **Python SDK:** `List[str]` / array. (`vendor/zscaler-sdk-python/zscaler/zpa/models/posture_profiles.py:63`)
- **Postman:** array of strings. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:81220`)

**Significance / which to trust:** Trust Python and Postman. The Go scalar is a schema defect; `platform` is multi-valued on the wire.

---

### `ClientSettings.microtenantId` — present in Python SDK; absent from Go SDK

**What each source says:**

- **Python SDK:** `ClientSettings` model includes `microtenant_id` mapped to wire key `microtenantId`. (`vendor/zscaler-sdk-python/zscaler/zpa/models/client_settings.py:41`)
- **Go SDK:** `ClientSettings` struct has no such field. (`vendor/zscaler-sdk-go/zscaler/zpa/services/client_settings/client_settings.go:24-33`)

**Significance / which to trust:** Python is likely correct — `microtenantId` is a standard ZPA field. Go SDK client settings calls cannot be scoped to a microtenant.

---

### `GetAllClientSettings` return shape — single object (Go) vs list (Python)

**What each source says:**

- **Go SDK:** returns `*ClientSettings` (single object). (`vendor/zscaler-sdk-go/zscaler/zpa/services/client_settings/client_settings.go:55-63`)
- **Python SDK:** iterates `response.get_results()` and returns a list. (`vendor/zscaler-sdk-python/zscaler/zpa/client_settings.py:120-130`)

**Significance / which to trust:** Neither SDK definitively settles whether the `/all` endpoint returns a list or a single object. Verify against a live tenant.

---

### `GetClientSettings` (Go SDK) — response body is never decoded

**What each source says:**

- **Go SDK:** `GetClientSettings` passes `&settings` as the body argument (5th param) to `NewRequestDo` for a GET request; the response-decode target (6th param) is `nil`. The HTTP response body is never unmarshalled. (`vendor/zscaler-sdk-go/zscaler/zpa/services/client_settings/client_settings.go:47`)
- **Python SDK:** `get_client_settings` correctly iterates `response.get_results()`. (`vendor/zscaler-sdk-python/zscaler/zpa/client_settings.py:82-92`)

**Significance / which to trust:** Go SDK `GetClientSettings` is functionally broken — always returns an empty slice. Use `GetAllClientSettings` in the Go SDK or the Python SDK's `get_client_settings` as the working reference.

---

### `PostureProfile.domain` — in Go SDK and Postman; absent from Python model

**What each source says:**

- **Go SDK:** `Domain string json:"domain,omitempty"`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go:28`)
- **Postman:** `domain` present as string in GET response. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:81220`)
- **Python SDK:** no `domain` attribute in model. (`vendor/zscaler-sdk-python/zscaler/zpa/models/posture_profiles.py`)

**Significance / which to trust:** Go and Postman agree `domain` is present. Python silently drops it.

---

### Field observations (Posture/Trusted Networks)

**`posture_udid` and `networkId` are stable references — API name-rewrite does not apply here:** The IaC observation that `operands[].name` is always rewritten by the API applies to app connector and app segment references, not to `postureUdid` or `networkId`. Those fields are opaque identifiers, not display names, and are stable across plan-apply cycles. Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go:33`, `vendor/zscaler-sdk-go/zscaler/zpa/services/trustednetwork/zpa_trusted_network.go:27`. (Corroborating field observation recorded in the maintainer's IaC repo mining notes.)

---

## Service Edges (Private and Public)

### `PrivateCloudController` restart URL path — Go vs Python

**What each source says:**

- **Go SDK:** `/privateCloudController/restart/{id}` (action before ID). (`vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_controller/private_cloud_controller.go:128-135`)
- **Python SDK:** `/privateCloudController/{id}/restart` (ID before action). (`vendor/zscaler-sdk-python/zscaler/zpa/private_cloud_controller.py:265-268`)
- **Postman:** no `PrivateCloudController` entries.

**Significance / which to trust:** One path will produce a 404 or 405 at runtime. The Python `/{id}/restart` pattern follows conventional REST resource-action ordering; trust it until verified against a live tenant.

---

### `PrivateCloudGroup` summary endpoint return shape — full objects (Go) vs `CommonIDName` (Python)

**What each source says:**

- **Go SDK:** `GetGroupSummary` deserializes into `[]PrivateCloudGroup` (full objects). (`vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_group/private_cloud_group.go:112-119`)
- **Python SDK:** `list_private_cloud_group_summary` uses `CommonIDName` model (id+name only). (`vendor/zscaler-sdk-python/zscaler/zpa/private_cloud_group.py:376-436`)

**Significance / which to trust:** Python is correct for a summary endpoint. Do not rely on group-level fields from the summary endpoint in Go — most will be empty.

---

### `ServiceEdge` bulk delete — 200 OK (Postman); single DELETE is 204

**What each source says:**

- **Postman:** `bulkDelete` returns 200 OK; single DELETE returns 204 No Content. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:114763`)
- **Python SDK:** `bulk_delete` returns the status code integer.

**Significance / which to trust:** Code that checks `response.status_code == 204` for bulk delete will incorrectly flag success as failure. The correct expected code is 200 for bulk, 204 for single.

---

### `PrivateCloudController.ZpnSubModuleUpgradeList` — untyped `[]interface{}` (Go) vs typed class (Python)

**What each source says:**

- **Go SDK:** `[]interface{}` — no schema. (`vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_controller/private_cloud_controller.go:76`)
- **Python SDK:** typed `ZPNSubmoduleUpgradeList` class with 12 fields including `upgrade_status`, `upgrade_time`, `entity_type`. (`vendor/zscaler-sdk-python/zscaler/zpa/models/private_cloud_controller.py:260-321`)

**Significance / which to trust:** Python has richer typing. Go callers must type-assert `[]interface{}` elements manually. Use the Python typed shape as the authoritative field enumeration.

---

### Field observations (Service Edges)

**`latitude`/`longitude` typed as strings (corroborated):** `ServiceEdgeGroup.Latitude` is `string json:"latitude,omitempty"` in Go. Postman describes lat/lon as `string` for `ServiceEdgeGroup`. (Corroborating field observation recorded in the maintainer's IaC repo mining notes.)

**`ServiceEdgeSchedule` POST returns 204 (confirmed):** Python `add_service_edge_schedule` handles 204 by returning `ServiceEdgeSchedule({"id": scheduler_id})` as synthetic success. There is no Location header. (`vendor/zscaler-sdk-python/zscaler/zpa/service_edge_schedule.py:143-147`) Postman: `vendor/zscaler-api-specs/oneapi-postman-collection.json:111265,111317`.

---

## LSS (Log Streaming Service)

### `lssPort` wire type — `string` (Go SDK / Terraform) vs `<integer>` (Postman)

**What each source says:**

- **Go SDK:** `LSSPort` as Go `string` with `json:"lssPort,omitempty"`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go:39`)
- **Terraform provider:** `TypeString`, cast as string on assignment. (`vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go:207-211`)
- **Postman:** documents `lssPort` as `<integer>`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:62088`)

**Significance / which to trust:** High impact. Trust the Go SDK and Terraform provider — sending a quoted port string (e.g. `"9200"`) is the established behavior. The Postman documentation is incorrect or reflects a different API version.

---

### `policyRuleResource.action` — `LOG` (SDKs / Terraform) vs `INTERCEPT` (Postman example)

**What each source says:**

- **Go SDK integration test + Terraform provider:** enforce `LOG` as the only valid action value for LSS policy rules. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller_test.go:206`, `vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go:18-25`)
- **Postman:** example bodies show `INTERCEPT` — a generic template placeholder carried over from access policy examples. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:62088`)

**Significance / which to trust:** High impact. Using `INTERCEPT` as the action value will be rejected. `LOG` is the correct and only valid value.

---

### `GetClientTypes` endpoint path — deprecated global (Go SDK) vs recommended customer-scoped (Python SDK)

**What each source says:**

- **Go SDK:** `GET /zpa/mgmtconfig/v2/admin/lssConfig/clientTypes` (no customerID, uses `mgmtConfigTypesAndFormats` constant). (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_client_types.go:11-25`)
- **Python SDK:** `GET /zpa/mgmtconfig/v2/admin/lssConfig/customers/{customerId}/clientTypes` (customer-scoped). (`vendor/zscaler-sdk-python/zscaler/zpa/lss.py:544-548`)
- **Postman:** documents both; the global path is marked deprecated-in-future-release; the customer-scoped path is the recommended replacement. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:64139,66790`)

**Significance / which to trust:** Medium impact. Go SDK callers are using the deprecated endpoint. When the deprecation takes effect, `GetClientTypes` calls will break. Prefer the Python SDK path.

---

### `zpn_trans_log` filter code count — actual count is 110

**What each source says:**

- **Go SDK integration test:** 110 string literals at lines 85-194. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller_test.go:85-195`)
- **Terraform validator `supportedLSSUserActivity`:** 110 entries at lines 38-148. (`vendor/terraform-provider-zpa/zpa/validator.go:37-148`)

**Significance / which to trust:** The Terraform validator is the enforcement surface and ground truth for which codes are valid. Treat both lists as identical and authoritative.

---

### `zpn_client_type_browser_isolation` — excluded in Go SDK test; included in Terraform validator

**What each source says:**

- **Go SDK integration test:** comments out `zpn_client_type_browser_isolation` without explanation. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller_test.go:242-245`)
- **Terraform validator:** includes it as valid. (`vendor/terraform-provider-zpa/zpa/validator.go:178`)

**Significance / which to trust:** Medium impact. The Terraform validator accepts it but the Go SDK test suggests the API may not honor it. Treat as suspect and test against the tenant.

---

### Field observations (LSS)

**Policy conditions ordering — unordered backend (confirmed for LSS):** The LSS resource's `policyRuleResource.Conditions` is a Go slice. The Terraform validator accepts `AND` or `OR` as condition operators. Do not rely on positional ordering of conditions or operands across round-trips. Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go:81`, `vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go:39-43`. (Corroborating field observation recorded in the maintainer's IaC repo mining notes.)

---

## Privileged Remote Access (PRA)

### `CredentialPool` Create — POST response may not include the new ID

**What each source says:**

- **Go SDK:** sends POST then calls `GetAll` and matches by name to find the ID, asserting the POST response body does not include the created ID. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredentialpool/pracredentialpool.go:77-96`)
- **Python SDK:** `add_credential_pool` decodes `response.get_body()` directly and returns the object — either the API returns an ID in the response on the Python auth path, or the Python implementation returns an incomplete object with `id=None`. (`vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py:239-247`)

**Significance / which to trust:** Trust the Go SDK pattern as the safer assumption. Any caller that needs the new pool's ID immediately after creation should use post-create list+match or an explicit `GetByName` call.

---

### `Credential.credentialType` — `SSH_KEY` in Python/Go; absent from Postman

**What each source says:**

- **Python SDK:** validates three types: `USERNAME_PASSWORD`, `SSH_KEY`, `PASSWORD`. (`vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py:146`)
- **Go SDK:** struct comment lists SSH, RDP, VNC as protocol options. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredential/credential_controller.go:31-33`)
- **Postman:** shows only `PASSWORD` (list response) and `USERNAME_PASSWORD` (POST body); `SSH_KEY` is absent as a `credentialType` value. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:37381`)

**Significance / which to trust:** Trust the Python SDK's three-way validation as ground truth. The Postman examples are illustrative, not exhaustive. `SSH_KEY` is the type for SSH private-key credentials.

---

### `PRAPortal.cName` — writable in Go SDK; read-only (`getcName`) in Postman and Python

**What each source says:**

- **Go SDK:** `CName json:"cName,omitempty"` — a writable field. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praportal/praportal.go:32`)
- **Postman / Python:** expose only `getcName` (the computed read-only CNAME). (`vendor/zscaler-sdk-python/zscaler/zpa/models/pra_portal.py:42-43`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:91373`)

**Significance / which to trust:** Do not write to `cName` on create/update; use `getcName` for read purposes only. The Go SDK field is likely a stale mapping.

---

### `PRAApplication.applicationProtocol` — Postman enum is larger than the originally cited list

**What each source says:**

- **Postman (full observed set):** `AUTO`, `DYNAMIC`, `FTP`, `HTTP`, `HTTPS`, `NONE`, `RDP`, `SSH`, `VNC`, `WEBSOCKET`. `DYNAMIC`, `FTP`, `VNC`, and `WEBSOCKET` are missing from some cited claims. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:86512`)

**Significance / which to trust:** Use the full ten-value set. `VNC` is particularly relevant — it is a valid PRA protocol and any allowlist based on the shorter set would incorrectly reject VNC consoles.

---

### Credential `move` — source `microtenantId` query param documented in Postman; absent from Go SDK

**What each source says:**

- **Postman:** documents two query params for the move endpoint: `microtenantId` (source) and `targetMicrotenantId`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:36600-36610`)
- **Go SDK:** `CredentialMove` accepts only `targetMicrotenantId`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredential/credential_controller.go:127-143`)
- **Python SDK:** accepts both as query params. (`vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py:360-375`)

**Significance / which to trust:** When moving a credential out of a non-Default microtenant, the Go SDK may fail silently if the source `microtenantId` is required. Use the Python SDK or construct the URL manually with both params.

---

### Field observations (PRA)

**`CredentialMappingCount` has `omitempty` — always-sent claim is wrong:** The Go struct tag is `json:"credentialMappingCount,omitempty"` — the field is omitted when empty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredentialpool/pracredentialpool.go:32`)

**Python `target_microtenant_id=0` raises `ValueError`, not success:** The guard at `pra_credential.py:369` is `if not target_microtenant_id: raise ValueError(...)`. Integer `0` is falsy and raises. Must pass string `'0'`. (`vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py:368-370`)

---

## Microtenants

### `MicroTenant.Priority` type — `string` (Go SDK) vs `<integer>` (Postman); absent from Python

**What each source says:**

- **Go SDK:** `Priority` as `string`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:27`)
- **Postman:** types `priority` as `<integer>`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:71406`)
- **Python SDK:** `Microtenant` model does not include a `priority` field.

**Significance / which to trust:** Trust Postman for wire type (integer). The Go SDK will send a JSON string where the API expects a number. The Python SDK omits the field entirely.

---

### POST search `filterBy` structure — nested `filterGroups` (Go SDK) vs flat array (Postman and Python)

**What each source says:**

- **Go SDK:** `SearchRequest.FilterBy` produces `{filterBy: {filterGroups: [{filters: [], operator}], operator}}`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:532-545`)
- **Postman:** `filterBy` as a top-level flat array `[{filterName, operator, values, commaSepValues}]` with no `filterGroups` wrapper. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:72018`)
- **Python SDK:** flat `filter_by` list inside `filter_and_sort_dto`. (`vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py:179-225`)

**Significance / which to trust:** The Go SDK is the executable reference — it produces working calls against the live API. Do not use the Postman schema as a guide for constructing POST search bodies.

---

### `SearchFilterItem.Operator` enum — `'EQ'` (Go SDK) vs `'EQUALS'`/`'LIKE'` (Python docstring)

**What each source says:**

- **Go SDK:** hardcodes `Operator: 'EQ'` in `GetMicrotenantByName`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:130`)
- **Python SDK docstring:** documents `'EQUALS'` and `'LIKE'`. (`vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py:184-185`)

**Significance / which to trust:** Trust `'EQ'` from the Go SDK as the proven live value. `'EQUALS'` may be aspirational. Using `'EQUALS'` against the POST search endpoint may silently match nothing.

---

### Python `Microtenant` model — omits `roles`, `user`, and `priority` fields entirely

**What each source says:**

- **Go SDK:** models `Roles []Roles`, `UserResource *UserResource`, and `Priority` as response/writable fields. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:18-33`)
- **Python SDK model:** contains none of these. (`vendor/zscaler-sdk-python/zscaler/zpa/models/microtenants.py:34-63`)

**Significance / which to trust:** Significant gap for Python SDK users. Roles and user sub-objects must be accessed via raw response body. Priority must be passed as a raw kwargs key.

---

### `enabled` default — `'True'` (Python docstring) vs `None` (Python model) vs always-`false` (Go SDK, no `omitempty`)

**What each source says:**

- **Python docstring:** states `enabled` defaults to `True`.
- **Python model:** `self.enabled = None` when key is absent — delegates to API server default. (`vendor/zscaler-sdk-python/zscaler/zpa/models/microtenants.py:40,56`)
- **Go SDK:** no `omitempty` on `Enabled` — always serialized including `false` when zero-valued. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:22`)

**Significance / which to trust:** Go SDK callers must explicitly set `Enabled: true` or the microtenant will be created disabled. The Python docstring claim of `'defaults to True'` holds only as the server-side default, not the SDK default.

---

### GET list query param for page size — `'page_size'` (Python) vs `'pagesize'` (Postman)

**What each source says:**

- **Python SDK:** accepts `page_size` as a `query_params` dict key. (`vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py:46-49`)
- **Postman:** documents the query param key as `'pagesize'` (all lowercase). (`vendor/zscaler-api-specs/oneapi-postman-collection.json:70743`)

**Significance / which to trust:** Python callers sending `page_size` may have it silently ignored by the server (which expects `pagesize`), defaulting to the server-side default of 20 rather than the intended page size.

---

## Certificates and Enrollment

### `getcName` vs `cName` wire key — silent deserialization bug in Go SDK and Python BaCert model

**What each source says:**

- **Postman:** CNAME field wire key is `'getcName'` in every certificate response body. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:46169,25489`)
- **Python SDK `EnrollmentCertificate` model:** correctly uses `'getcName'`. (`vendor/zscaler-sdk-python/zscaler/zpa/models/enrollment_certificates.py:36,97`)
- **Go SDK (`BaCertificate` and `EnrollmentCert`):** both tagged `json:"cName"`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:21`, `vendor/zscaler-sdk-go/zscaler/zpa/services/bacertificate/zpa_ba_certificate.go:23`)
- **Python SDK `Certificate` model (BaCert):** also incorrectly uses `'cName'`. (`vendor/zscaler-sdk-python/zscaler/zpa/models/certificates.py:38,81`)

**Significance / which to trust:** High impact. Go SDK will silently marshal/unmarshal the cname field under the wrong key. Any code reading `CName`/`cName` from Go SDK responses will get empty string; writes will produce JSON the server ignores. Both SDKs have this wrong for BaCert.

---

### `clientCertType` enum — `ISOLATION_CLIENT` (Python) vs `APP_PROTECTION` (Postman); set differs between sources

**What each source says:**

- **Python SDK:** documents `ZAPP_CLIENT` and `ISOLATION_CLIENT`. (`vendor/zscaler-sdk-python/zscaler/zpa/enrollment_certificates.py:153`)
- **Postman:** list response example shows `ZAPP_CLIENT` and `APP_PROTECTION`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:46169`)

**Significance / which to trust:** Treat the full set as at least `{ZAPP_CLIENT, ISOLATION_CLIENT, APP_PROTECTION}`; validate against live tenant response rather than either source.

---

### `BaCertificate` Update (PUT) — Python SDK only; no Go SDK or Postman equivalent

**What each source says:**

- **Python SDK:** exposes `update_certificate` calling `PUT /mgmtconfig/v1/.../certificate/{id}`. (`vendor/zscaler-sdk-python/zscaler/zpa/certificates.py:266-321`)
- **Go SDK / Postman:** no PUT for this path.

**Significance / which to trust:** Do not rely on `update_certificate` without live-tenant verification; Go SDK and Postman are the more conservative references.

---

### `validFromInEpochSec` / `validToInEpochSec` type — `string` (SDKs) vs `<long>` (Postman)

**What each source says:**

- **Go SDK:** both as `string`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:38-39`)
- **Python SDK:** calls `str(from_epoch)` before sending. (`vendor/zscaler-sdk-python/zscaler/zpa/enrollment_certificates.py:192-193`)
- **Postman:** both fields as `<long>`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:46169`)

**Significance / which to trust:** For reads, any code that type-asserts the value to `int64` from a Go response will panic. Trust Go SDK string type for Go code; trust Postman long for raw API consumers.

---

### Issued certificate list — deprecated `/clientlessCertificate/issued` path used by both SDKs

**What each source says:**

- **Postman:** marks `/clientlessCertificate/issued` as deprecated; `/certificate/issued` is the replacement. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:22434,24646`)
- **Go SDK and Python SDK:** both still call the deprecated path. (`vendor/zscaler-sdk-go/zscaler/zpa/services/bacertificate/zpa_ba_certificate.go:16-17`, `vendor/zscaler-sdk-python/zscaler/zpa/certificates.py:145`)

**Significance / which to trust:** Once the old path is decommissioned, both SDKs will break silently on the list/GetAll path. Track the deprecation timeline.

---

### Field observations (Certificates)

**No IaC field observations cover ZPA Certificates or Enrollment:** All IaC observations from the maintainer's live-tenant repo concern ZIA (url_filtering, cloud_app_control, location management), ZCC, and cross-cutting ZPA issues (server_groups, policy_access_rule, segment_group). No corroboration or contradiction of any certificate-area claim is possible from those sources. IaC sources: `MINING.md`, `RUNBOOK.md`.

---

## Machine Groups and Tunnels

### Certificate field name — `signingCert` (Go SDK) vs `enrollmentCert` (Postman)

**What each source says:**

- **Go SDK:** `Machines` struct uses JSON tag `signingCert`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go:45`)
- **Postman:** uses `enrollmentCert`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:67353`)

**Significance / which to trust:** Trust Postman as closer-to-API. The live field name is `enrollmentCert`. Go SDK callers may receive an empty `SigningCert` map until the Go SDK tag is corrected.

---

### `machines` sub-list — present in Go SDK and Postman; absent from Python SDK model

**What each source says:**

- **Go SDK:** `MachineGroup` struct includes `Machines []Machines` with all machine-identity fields. (`vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go:24,31-46`)
- **Postman:** response body includes `machines[]`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:67353`)
- **Python SDK:** `MachineGroup` model has no `machines` field. (`vendor/zscaler-sdk-python/zscaler/zpa/models/machine_groups.py:33-42`)

**Significance / which to trust:** Go SDK is the only SDK surface for the machines sub-list. If machine-level fields (fingerprint, machineTokenId, issuedCertId) are needed, use Go SDK or raw API.

---

### Multi-word search fallback — Go SDK retries with partial name; Python SDK does not

**What each source says:**

- **Go SDK:** `GetAllPagesGenericWithCustomFilters` retries with the first two words of a multi-word search value when the full search fails. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:339-378`)
- **Python SDK:** no such retry; a multi-word search failure returns an error immediately. (`vendor/zscaler-sdk-python/zscaler/zpa/machine_groups.py:73-98`)

**Significance / which to trust:** Machine group names with spaces may resolve via Go SDK but fail via Python SDK if the server-side search does not support the full multi-word name+EQ+value filter.

---

### Field observations (Machine Groups)

**No MAC address or OS fields exist in any source:** The Go SDK `Machines` struct, the Postman collection, and the Python SDK contain no MAC address, OS type, or OS version fields for machine group members. These fields do not exist in the current SDK or API spec. Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go:31-46`.

---

## IdP, SAML and SCIM

### `ScimGroup.IdpName` — in Go struct; absent from API responses and Python model

**What each source says:**

- **Go SDK:** `ScimGroup` struct includes `IdpName` (string, `json:"idpName,omitempty"`). (`vendor/zscaler-sdk-go/zscaler/zpa/services/scimgroup/zpa_scim_group.go:24`)
- **Live cassette:** API does not return `idpName` in scimgroup GET or list responses. (`vendor/zscaler-sdk-python/tests/integration/zpa/cassettes/TestScimGroups.yaml`)
- **Postman / Python SDK:** both omit `idpName`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:102020`, `vendor/zscaler-sdk-python/zscaler/zpa/models/scim_groups.py:32-46`)

**Significance / which to trust:** Trust the cassette and Postman. `idpName` is not returned by the API. The Go SDK struct field is vestigial; code that depends on it will always see an empty string.

---

### `IdpController` — `delta` and `certificates` — in API and Python; absent from Go SDK struct

**What each source says:**

- **Python SDK:** captures `delta` (line 43) and `certificates` (lines 79-81). (`vendor/zscaler-sdk-python/zscaler/zpa/models/idp.py:43,79-81`)
- **Go SDK:** `IdpController` struct has neither field. (`vendor/zscaler-sdk-go/zscaler/zpa/services/idpcontroller/zpa_idp_controller.go:18-48`)
- **Live cassette:** API returns `delta` as a hex string and `certificates` as a full array on every IdP object. (`vendor/zscaler-sdk-python/tests/integration/zpa/cassettes/TestScimGroups.yaml:23`)

**Significance / which to trust:** Go SDK consumers silently drop `delta` and `certificates` on read. Python callers get full certificate data. Go-based tools that round-trip IdP objects will lose these fields.

---

### SCIM pagination envelope — `{Resources, totalResults}` (SCIM protocol) vs `{list, totalPages}` (management API)

**What each source says:**

- **SCIM protocol endpoints:** `{Resources: []T, totalResults: int}`, max 100 per page, default 10.
- **Management/userconfig list endpoints:** `{list: [], totalPages: int, totalCount: int}`, max 500 per page, default 20. The `mgmtconfig` scimgroup list also omits `currentCount` (present in mgmtconfig SAML/SCIM attribute header lists).
- Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:408-456`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:102565`.

**Significance / which to trust:** The two API surfaces are not interchangeable. Code that reads `currentCount` from the list envelope will break on userconfig endpoints. Code that reads `Resources` will break on mgmtconfig endpoints.

---

### `IdpController.autoProvision` and `signSamlRequest` — string-encoded integers, not JSON booleans

**What each source says:**

- **Live cassette:** `autoProvision='0'`, `signSamlRequest='1'`. (`vendor/zscaler-sdk-python/tests/integration/zpa/cassettes/TestScimGroups.yaml:23`)
- **Go SDK:** both as `string`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/idpcontroller/zpa_idp_controller.go:20,42`)
- Contrast with genuinely boolean fields (`scimEnabled`, `disableSamlBasedPolicy`) which are JSON booleans.

**Significance / which to trust:** Treat `autoProvision` and `signSamlRequest` as string-encoded integers (`"0"` / `"1"`), not JSON booleans.

---

### `ScimGroup.GetAllByIdpId` — `Search` field NOT included in Filter (contradicting an earlier claim)

**What each source says:**

- **Go SDK:** `GetAllByIdpId` passes only `SortBy` and `SortOrder` in its Filter. `Search` is only included by `GetByName`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/scimgroup/zpa_scim_group.go:44-49,66-68`)

**Significance / which to trust:** `GetAllByIdpId` returns all groups without server-side name filtering. Callers must filter client-side or use `GetByName`.

---

## Provisioning Keys

### `NP_ASSISTANT_GRP` enum value — Go SDK only; unreachable from Python and Postman

**What each source says:**

- **Go SDK:** three `associationType` values: `CONNECTOR_GRP`, `SERVICE_EDGE_GRP`, `NP_ASSISTANT_GRP`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:18-22`)
- **Python SDK:** `simplify_key_type()` raises `ValueError` for anything other than `'connector'` (→ `CONNECTOR_GRP`) and `'service_edge'` (→ `SERVICE_EDGE_GRP`). (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:36-41`)
- **Postman:** documents only `CONNECTOR_GRP` and `SERVICE_EDGE_GRP`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:94652`)

**Significance / which to trust:** Trust the Go SDK as the more complete source. `NP_ASSISTANT_GRP` appears real but unlaunched/internal; do not advertise it via Python SDK until it appears in Postman or official docs.

---

### `MaxUsage` and `UsageCount` field types — `string` (SDKs) vs `integer` (Postman)

**What each source says:**

- **Go SDK:** both as `string`; integration test sets `MaxUsage` to string literal `'10'`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:32,40`, `vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key_connector_test.go:89`)
- **Python SDK:** stores them as-received.
- **Postman:** describes both as integer. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:94720`)

**Significance / which to trust:** Trust the Go SDK behavior — send quoted string form. Integration tests confirm it works.

---

### `get_provisioning_key_by_zcomponent` URL path — missing slash in Python SDK (bug)

**What each source says:**

- **Go SDK:** `.../{associationType}/zcomponent/{zcomponentId}/provisioningKey`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:151`)
- **Python SDK:** `.../{key_type}zcomponent/{zcomponent_id}/provisioningKey` — missing slash, producing malformed paths like `...CONNECTOR_GRPzcomponent/...`. (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:242-244`)

**Significance / which to trust:** The Python SDK's `get_provisioning_key_by_zcomponent` will produce 404s in production. Trust the Go SDK URL form.

---

### `add_provisioning_key` vs `update_provisioning_key` calling convention — inconsistent Python SDK

**What each source says:**

- **Python SDK `add_provisioning_key`:** accepts snake_case kwargs (`component_id`, `max_usage`, `enrollment_cert_id`, `name`) and remaps to wire-case keys. (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:312-319`)
- **Python SDK `update_provisioning_key`:** passes kwargs body through unchanged — callers must supply wire-cased keys directly. (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:380-384`)

**Significance / which to trust:** Callers who pattern-match `add_provisioning_key` for update kwargs will silently send unconverted snake_case field names that the API will ignore or reject.

---

### Python model field coverage vs Go SDK struct

**What each source says:**

- **Python `ProvisioningKey` model:** 13 fields. (`vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py:27-56`)
- **Go SDK struct:** 24 fields. Missing from Python: `AssociationType`, `AppConnectorGroupID`, `AppConnectorGroupName`, `IPACL`, `ReadOnly`, `RestrictionType`, `ZscalerManaged`, `MicroTenantID`, `MicroTenantName`, `UIConfig`, `ExpirationInEpochSec`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:24-49`)

**Significance / which to trust:** Python callers cannot access read-only metadata fields. `MicroTenantID` and `MicroTenantName` absence is especially relevant for microtenant-scoped deployments.

---

## Cloud Browser Isolation (CBI) and AppProtection/Inspection

### `SecurityControls.cameraAndMic` — Python SDK only; absent from Go SDK

**What each source says:**

- **Python SDK:** `SecurityControls` model includes `camera_and_mic` (wire key `cameraAndMic`). (`vendor/zscaler-sdk-python/zscaler/zpa/models/cbi_profile.py:289,336`)
- **Go SDK:** `SecurityControls` struct has no such field. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:75-85`)

**Significance / which to trust:** Trust Python — likely a newer API addition the Go SDK hasn't caught up to. Any Terraform provider using the Go SDK will silently drop `cameraAndMic`.

---

### `ThreatLabzControls` — Go SDK has `ruleMetadata`, `ruleProcessor`, and `associatedCustomers`; Python omits all three

**What each source says:**

- **Go SDK:** `ThreatLabzControls` struct includes `ruleMetadata` (string), `ruleProcessor` (string), and `associatedCustomers []AssociatedCustomers`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_profile/zpa_inspection_profile.go:104-109`)
- **Python SDK:** `ThreatLabzControls` model contains none of these. (`vendor/zscaler-sdk-python/zscaler/zpa/models/app_protection_profile.py:575-628`)

**Significance / which to trust:** Trust Go for `ruleMetadata`, `ruleProcessor`, and `associatedCustomers` — confirmed in the Go struct. Python callers silently lose these on read.

---

### `WebSocketControls` — Python adds `controlException`; Go adds `zsDefinedControlChoice`

**What each source says:**

- **Python SDK:** `WebSocketControls` model includes `controlException` sub-object. (`vendor/zscaler-sdk-python/zscaler/zpa/models/app_protection_profile.py:675-703`)
- **Go SDK:** `WebSocketControls` struct includes `zsDefinedControlChoice` (string). (`vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_profile/zpa_inspection_profile.go:113-131`)

**Significance / which to trust:** Neither SDK is the single ground truth for `WebSocketControls`. Verify both fields against a live tenant; both appear to be real fields the other SDK simply hasn't added.

---

### CBI `IsolationProfile.Enabled` — `omitempty` in `cbiconfig` (Go) vs no `omitempty` in `mgmtconfig` (Go) vs nullable (Python)

**What each source says:**

- **Go SDK (`cbiprofilecontroller`):** `Enabled` is `json:"enabled,omitempty"` — `false` will not be serialized. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:21`)
- **Go SDK (`isolationprofile` / mgmtconfig):** `Enabled` is `json:"enabled"` without `omitempty`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go:22`)
- **Python SDK:** `CBIProfile.enabled` defaults to `None`, omitted when unset. (`vendor/zscaler-sdk-python/zscaler/zpa/models/cbi_zpa_profile.py:88`)

**Significance / which to trust:** For the `cbiconfig` `IsolationProfile`, `omitempty` on `Enabled` means disabling a profile via Go SDK requires a workaround. Python is more correct here for explicit `false` writes.

---

### `CBIProfile` `add` vs `update` — different field names for regions and certificates

**What each source says:**

- **Python SDK `add_cbi_profile`:** accepts `region_ids` and `certificate_ids` as flat ID lists; `banner` is a bare string `banner_id`. (`vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py:227`)
- **Python SDK `update_cbi_profile`:** expects full object lists under `regions` and `certificates` (`{id, name}` objects); `banner` is a dict `{'id': uuid}`. (`vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py:322-329`)
- **Go SDK:** uses the same `IsolationProfile` struct for both Create and Update. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:137-153`)

**Significance / which to trust:** Python's asymmetric add/update contract is a real gotcha. Engineers writing wrappers should validate that read-back objects are not naively re-submitted.

---

### Field observations (CBI/AppProtection)

**`cbi_profile` `{id:'0', name:'', ...}` stub — treated as absent by provider (corroborated):** Consistent with the CBI profile struct having `omitempty` on ID — a zero-value ID would serialize as absent. Engineers importing resources with no CBI profile must handle the stub object explicitly. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:18`) (Corroborating field observation recorded in the maintainer's IaC repo transform tooling.)

**`InspectionProfile.ControlInfoResource.Count` — server-computed (parallel to operands.name rewrite):** The `controlsInfo[].count` field (string) is computed server-side. Storing it in Terraform config will cause perpetual drift as the API overwrites the value. (`vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_profile/zpa_inspection_profile.go:47-50`) (Corroborating field observation recorded in the maintainer's IaC repo mining notes.)

---

## Open Questions

The following are unresolved after cross-referencing all available sources. Each requires live-tenant verification.

1. **`CredentialPool` POST response ID:** Does the ZPA PRA Credential Pool POST always omit the new resource ID from the response body? The Go SDK asserts it does and works around it via list+match; the Python SDK decodes the body directly. A live tenant POST response would settle this definitively.

2. **`GetAllClientSettings` return shape:** Does the `/clientSettings/all` endpoint return a single `ClientSettings` object or a list? Go SDK models a single object; Python SDK iterates results as a list. Neither is verified against a live tenant response.

3. **`PrivateCloudController` restart URL path:** Is the correct path `/privateCloudController/restart/{id}` (Go SDK) or `/privateCloudController/{id}/restart` (Python SDK)? No Postman entry exists. One will produce 404 or 405 in production.

4. **`clientCertType` complete enum:** The current observed set is `{ZAPP_CLIENT, ISOLATION_CLIENT, APP_PROTECTION}` drawn from Python SDK and Postman separately. Whether these are exhaustive or overlapping (ISOLATION_CLIENT and APP_PROTECTION may be synonyms) requires a live-tenant enumeration.

5. **`BaCertificate` Update (PUT):** Does `PUT /mgmtconfig/v1/.../certificate/{id}` exist as a live API endpoint? Only the Python SDK exposes it; Go SDK and Postman are silent on this path.

6. **`ExtranetDTO` complete schema:** Neither SDK models both `zpnErId` and `ziaErId`; Postman has no entry. The full shape of a write-ready `ExtranetDTO` is unverified.

7. **`MicroTenant.Priority` integer vs string:** The Go SDK sends a JSON string; Postman expects an integer. Whether the API silently coerces or rejects the Go SDK's string representation is unresolved.

8. **`NP_ASSISTANT_GRP` provisioning key type:** The Go SDK declares this as a valid `associationType` value; Python and Postman do not document it. Whether it is a real, live API value or a reserved/future type requires tenant verification.

9. **`AppConnectorGroup.Version.version_profile_gid` write key:** Python `Version` model reads from config key `'version_profile_gid'` but `request_format()` serializes it as `'versionProfileGid'`. If the API only accepts the snake_case key, writes via this model silently send the wrong key. Unresolved without a live write test.

10. **`AssistantSchedule.Frequency` enum completeness:** The only documented value across all sources is `'days'` (from Go SDK test). No other frequency strings are enumerated in any source. Whether additional values (e.g. `'hours'`, `'weeks'`) are valid at the API level is unknown.

11. **`policyType` enum — Postman corroboration of `PRIVILEGED_PORTAL_POLICY`:** The body of the divergence entry cites only the Go SDK edge-case test and the Python SDK POLICY_MAP as sources. A claim that Postman independently confirms `PRIVILEGED_PORTAL_POLICY` (alias `PORTAL_POLICY`) was present in the input's narrative text with no line citation. *Unverified — no Postman line reference was provided in the structured input citations.*

12. **`IdpController.autoProvision` / `signSamlRequest` — Postman integer typing:** A claim that Postman types these fields as `<integer>` was in the input narrative for this divergence, but the structured input citations cover only `zpa_idp_controller.go:20,42` and `TestScimGroups.yaml:23`. The cassette confirms the wire format is a quoted string; whether Postman independently annotates the type as integer is *unverified — no Postman line reference was provided in the structured input citations.*

13. **`ThreatLabzControls` — Postman corroboration of `ruleMetadata`/`ruleProcessor`/`associatedCustomers`:** The body of the divergence entry cites only `zpa_inspection_profile.go:104-109` and the Python model. A claim that the Postman collection additionally confirms these fields was present in the input narrative but no Postman line number was provided in the structured citations. *Unverified — no Postman line reference was provided in the structured input citations.*
