---
product: zpa
topic: "api-divergences"
title: "ZPA API source divergences"
content-type: reference
confidence: medium
last-verified: "2026-08-12"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
  vendor/zscaler-sdk-go: 4b7101202cde25e1e60552f1cb215d2c70cdc3bd
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
sources:
  - "vendor/zscaler-sdk-go/CHANGELOG.md"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/**"
  - "vendor/zscaler-sdk-go/zscaler/oneapiclient.go"
  - "vendor/zscaler-sdk-go/zscaler/zparequests.go"
  - "vendor/zscaler-sdk-python/pyproject.toml"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/**"
  - "vendor/zscaler-sdk-python/zscaler/request_executor.py"
  - "vendor/zscaler-sdk-python/zscaler/helpers.py"
  - "vendor/terraform-provider-zpa/zpa/**"
  - "vendor/terraform-provider-zpa/CHANGELOG.md"
  - "vendor/terraform-provider-zpa/go.mod"
  - "vendor/zpacloud-ansible/CHANGELOG.md"
  - "vendor/zpacloud-ansible/plugins/modules/**"
  - "vendor/zpacloud-ansible/tests/unit/plugins/modules/test_zpa_application_segment_pra.py"
  - "vendor/zpacloud-ansible/tests/unit/plugins/modules/test_zpa_pra_approval.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/**"
  - "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/zpa-divergences.md"
  - "vendor/zscaler-api-specs/automate-zscaler/rosetta.md"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-help/zpa-create-operation-drift-capture.md"
  - "Operator field observations from production ZPA-via-Terraform usage (not reproducible from the vendored sources)"
author-status: draft
---

# ZPA API source divergences

The captured Automate operation contract, Go SDK, Python SDK, Terraform provider, Ansible collection, MCP tools, and Postman collection are independent views of the same ZPA management API, each produced separately and updated at different cadences. Where they agree, confidence is high. Where they diverge, an engineer needs to know which source to trust before writing code — and the answer changes by field, endpoint, and resource type.

Operator field observations from production ZPA-via-Terraform usage add a fourth signal: actual API behavior encountered in practice. Those observations can corroborate or contradict the SDK and collection claims, but cannot be reproduced from these sources alone and are flagged accordingly.

**Quick trust hierarchy (applies unless an entry below overrides it):**

- Live cassette / operator field observation > Go SDK source > Python SDK docstring > Postman schema annotation
- Postman example response bodies beat Postman schema annotations when the two differ
- Both SDKs use string for all ZPA IDs; Postman's `<long>` annotations are a Java/schema artifact — treat them as strings

**Contract reconciliation now feeds this doc.** For documented method/path and field metadata (`required`, `readonly`, `enum`), the verification protocol prefers the captured Automate contract when it exists; Terraform validators remain authoritative only for what the provider accepts, SDKs for wrapper behavior, and Postman for examples/fallback evidence (`references/_meta/verification-protocol.md:114-118`). The generated ZPA reconciliation diffs `vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json` against Go, Python, Terraform, Ansible, and MCP surfaces (`vendor/zscaler-api-specs/automate-zscaler/zpa-divergences.md:7-11`). Its current totals are 84 contract-vs-Go primitive type drifts, 20 contract-vs-Terraform required-flag drifts, 3 enum value conflicts, 4 one-sided enum constraints, and 5 readonly fields with no Terraform disagreement (`vendor/zscaler-api-specs/automate-zscaler/zpa-divergences.md:13-18`).

Use the rosetta table as the field-level index when a section below summarizes a resource rather than spelling out every field. It defines the `req`, `enum≠`, `enum1`, `ro`, `ro!`, and `type` markers (`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:11-20`), treats Postman as reference-only rather than a constraint-bearing reconciliation leg (`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:181-183`), and begins the ZPA resource table at `app_connector_group` (`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:2198-2206`).

---

## Automate operation-inventory drift

### Three create operations are absent from Automate; runtime evidence differs

The 2026-07-20 compiled Automate inventory omits the POST operations for App
Connector Groups, LSS configurations, and Private Service Edge Groups. Legacy
Help pages and current first-party clients retain the same methods and paths.
Current authenticated Terraform acceptance tests confirm App Connector Group
and Private Service Edge Group create on a OneAPI beta tenant. LSS create lacks
equivalent current public runtime evidence because the provider test is disabled
and the latest public Go integration run stopped before the LSS package
(`vendor/zscaler-help/zpa-create-operation-drift-capture.md`).

Unauthenticated `401 auth.header.missing` responses are not evidence for any of
the routes. Both tested ZPA gateways returned the same response for documented
and deliberately nonexistent paths across several methods, showing that the
gateway authenticates before exposing route resolution. Classify the missing
POSTs as Automate **publication** gaps; track runtime confirmation separately
(`vendor/zscaler-help/zpa-create-operation-drift-capture.md`).

The reconciler therefore records these three exact missing operation keys and
continues presence, type, enum, readonly, SDK, provider, Ansible, and MCP
comparison from the remaining read/update operations. It does **not** compare
required fields for the affected resources because the current Automate capture
no longer supplies their create request bodies
(`vendor/zscaler-api-specs/automate-zscaler/zpa-divergences.md`). Any other
missing registered operation remains a hard reconciliation failure.

### Documentation groups moved without API method/path changes

Provisioning Key operations moved from the Automate
`provisioning-key-management` group to `nonce`. Several list operations also
moved to new groups: App Connector Groups to `app-connector-group`, LSS to
`siem-config`, Private Service Edge Groups to `service-edge-group`, enrollment
certificates to `signing-certificate`, and version profiles to
`version-profile`. Their method/path signatures did not change
(`vendor/zscaler-help/zpa-create-operation-drift-capture.md`). Treat these as
documentation-routing changes, not endpoint migrations.

---

## Application Segments (all variants)

### `AppSegmentInspection.SegmentGroupID` — `omitempty` presence

**What each source says:**

- **Go SDK (Inspection):** `json:"segmentGroupId,omitempty"` — field is omitted when empty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:22`)
- **Go SDK (BrowserAccess):** also has `omitempty`.
- **Go SDK (core `ApplicationSegmentResource` and `AppSegmentPRA`):** no `omitempty` — empty string is always sent on the wire. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:47`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:43`)

**Significance / which to trust:** Trust the source file. An engineer omitting `segmentGroupId` on a PRA or core segment will send an empty string; for Inspection or BrowserAccess segments the field is omitted safely.

---

### `bypassOnReauth` explicit `false` is still dropped for Inspection and PRA in Go

The wire field is the boolean `bypassOnReauth`. Go v3.8.42 now serializes it
without `omitempty` for the base and Browser Access segment structs
(`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:38`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentbrowseraccess/application_segment_browser_access.go:27`).
Inspection and PRA still declare `json:"bypassOnReauth,omitempty"`, so Go
omits an explicit `false` for those two segment types
(`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:25`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:34`).

Python has no separate Inspection or PRA request model: both services import
the shared `ApplicationSegments` model
(`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_inspection.py:23-24`;
`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_pra.py:23-24`). Their create
and update paths build the request body from `kwargs` for `POST /application`
and `PUT /application/{segment_id}`
(`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_inspection.py:228-234,273`,
`:380-386,459`;
`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_pra.py:232-238,280`,
`:339-345,420`). The common request executor converts keys to camelCase, and
the recursive converter returns scalar values unchanged
(`vendor/zscaler-sdk-python/zscaler/request_executor.py:363-412`;
`vendor/zscaler-sdk-python/zscaler/helpers.py:347-364`). Python therefore sends
`bypass_on_reauth=False` as `bypassOnReauth: false`, while Go Inspection and
PRA omit it. This is a live divergence for two of the four segment types, not a
fully resolved SDK difference.

The Rosetta field table currently records only cross-surface presence for
`bypassOnReauth`; its marker vocabulary does not encode serializer-presence
behavior such as Go `omitempty`
(`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:11-20`, `vendor/zscaler-api-specs/automate-zscaler/rosetta.md:2269`). Keep
this prose-level divergence until the reconciliation schema can represent
omission semantics.

---

### New segment federation/stickiness fields are cross-SDK, but not yet contract-reconciled

Go v3.8.45 and Python v1.9.41 both add `hbrEnabled`, `stickyEntity`,
`stickyGroup`, and `guestDetails` to application segments
(`vendor/zscaler-sdk-go/CHANGELOG.md:16,23-27`;
`vendor/zscaler-sdk-python/CHANGELOG.md:3-19`). Go exposes the four fields on
the base, Browser Access, Inspection, and PRA structs and types each guest as a
`federationId` plus nested partner approval/federation metadata
(`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:61-73`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentbrowseraccess/application_segment_browser_access.go:57-62`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:57-61`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:51-59`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:161-172`). Python's
base, Browser Access, Inspection, PRA, and Browser Access v2 services all decode
through the same `ApplicationSegments` model, which now reads and emits those
keys (`vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py:74-90,266-269`;
service imports at `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:25`,
`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba.py:25`,
`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_inspection.py:24`,
`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_pra.py:24`, and
`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba_v2.py:24`).

This establishes cross-SDK wire-field coverage, not behavioral semantics. The
current Automate/Rosetta capture has no rows for these field names (audit-scoped
search on 2026-08-09), so its presence comparison cannot catch an omission or
serializer regression yet. The accepted `hbrEnabled` states, the entity/group
vocabularies and selection rules for stickiness, and the lifecycle of
`guestDetails` remain [clarification `zpa-83`](../_meta/clarifications.md#zpa-83-application-segment-hbr-sticky-and-guestdetails-semantics).

### Python v1.9.41 cannot decode populated `guestDetails.partnerInfo`

The new Python `GuestDetails` constructor checks `partnerInfo` against
`common.PrivilegedCapabilitiesResource`, an unrelated policy-capabilities
model, then attempts to construct `common.PartnerInfo`
(`vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py:20-23,1164-1189`).
The `PartnerInfo` class introduced by the same release is instead defined
locally later in `application_segment.py`
(`vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py:1208-1251`).
As a result, a non-null dictionary at `guestDetails[].partnerInfo` raises during
model construction rather than returning the segment. A second defect affects
direct writes: `PartnerInfo.request_format()` reads `self.partner_info`, but a
non-empty constructor never initializes that attribute
(`vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py:1222-1249`).

**Significance / which to trust:** This is a Python-wrapper defect, not evidence
that the ZPA API rejects partner data. The Go nested model is internally
consistent. Until Python fixes the namespace/type check, use the raw HTTP
response or Go SDK when a federated segment can return populated partner
metadata; do not let a Python decode failure masquerade as a missing segment.

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
- **Postman:** a 2026-08-04 full-collection audit of `connectionSecurity`
  example values found `ANY`, `TLS`, `RDP`, `NLA_EXT`, and `VM_CONNECT`, but no
  `NLA`; the cited body is representative
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:11008`). This is an
  audit-scoped absence from the current collection, not a server-side rejection
  rule.
- **Go SDK:** no enum validation.

**Significance / which to trust:** `NLA` may be legacy or undocumented. Postman is the stronger evidence source; do not depend on `NLA` without live-tenant verification.

---

### Sub-app ID matching strategy on Update — Go SDK matches by Name; Python SDK matches by domain

**What each source says:**

- **Go SDK (Inspection Update):** builds a map of existing `inspectionApps` keyed by sub-app Name (case-sensitive), injects `InspectAppID` by name match. PRA Update is identical. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:182-192`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:210-221`)
- **Python SDK (Inspection and PRA Updates):** fetches via `getAppsByType` and maps by domain. (`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_inspection.py:417-427`, `vendor/zscaler-sdk-python/zscaler/zpa/app_segments_pra.py:378-388`)

**Significance / which to trust:** Engineers using the Go SDK must ensure sub-app names match exactly; Python SDK engineers must ensure domains match. A sub-app whose name differs from its domain is a silent ID-injection failure in the Go SDK.

---

### Ansible 2.2.11 — PRA child ownership fixed; Inspection repair remains unproven

**What each source says:**

- **PRA module:** resolves child IDs exclusively from the parent segment's own
  `pra_apps`, leaves IDs empty on create, and builds `deleted_pra_apps` only from
  that parent-scoped map
  (`vendor/zpacloud-ansible/plugins/modules/zpa_application_segment_pra.py:502-546`).
- **PRA tests:** prove that create does not adopt a foreign `pra_app_id`, update
  resolves the owned ID, an orphaned child triggers recreation, and a live child
  stays idempotent
  (`vendor/zpacloud-ansible/tests/unit/plugins/modules/test_zpa_application_segment_pra.py:97-159`,
  `:161-238`, `:302-325`).
- **Inspection module:** detects a missing declared-domain child, but writes
  deletion IDs as `deleted_pra_apps` and invokes
  `app_segments_pra.update_segment_pra` followed by `get_segment_pra`
  (`vendor/zpacloud-ansible/plugins/modules/zpa_application_segment_inspection.py:418-430`,
  `:532-538`, `:591-605`).

**Significance / which to trust:** Treat the PRA ownership and orphan repair as
regression-covered. The changelog also labels Inspection orphan repair as fixed
(`vendor/zpacloud-ansible/CHANGELOG.md:12-16`), but the detector can enter an
update path whose subtype-specific payload and client calls do not match
Inspection. Do not report that repair as resolved; the server-side result—
rejection, an incorrect subtype operation, or another failure—remains
unverified.

---

### `AppSegmentInspection.deletedInspectApps` — Go SDK (Inspection) requires manual population; Python and Go SDK (PRA) auto-compute

**What each source says:**

- **Go SDK Inspection Update:** does not automatically populate `DeletedInspectApps` when sub-apps are removed — callers must set it manually. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:172-206`)
- **Go SDK PRA Update:** auto-computes `DeletedPraApps`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:224-238`)
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

- **Go SDK:** `ApplicationMappings` struct has `Name string` and `Type string`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:278-281`)
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
All three Go SDK structs (`ApplicationSegmentResource`, `AppSegmentPRA`, `AppSegmentInspection`) carry `PolicyStyle string json:"policyStyle,omitempty"`. The API returns a string enum (`DUAL_POLICY_EVAL` or `NONE`). Any Terraform schema that exposes this as `bool` is performing a non-obvious conversion. Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:79`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:71`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:71`. (Corroborating operator field observation from production Terraform usage.)

**`server_groups` — API returns N separate objects; provider collapses to one merged block (corroborated)**
Both SDKs confirm the API accepts and returns N separate server group objects. The merge-flatten behavior is Terraform-provider-specific; the SDK surface is a proper list. Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:70`, `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:273-274`. (Corroborating operator field observation from production Terraform usage.)

**`segment_group.applications` — server-computed back-reference (corroborated)**
The Python SDK confirms segment group membership is managed from the application segment side (via `SegmentGroupID`). The Go SDK `ApplicationSegmentResource.Applications` is `string json:"applications,omitempty"` — a summary field, not a list of objects. This matches the operator observation that carrying the applications list in Terraform config causes phantom drift. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:36`) (Corroborating operator field observation from production Terraform usage.)

---

## Access, Timeout, Forwarding and Inspection Policy

### `v2 UpdateRule` URL path — v2 package uses v2 path (not v1 as claimed)

**What each source says:**

- **Go SDK (v2):** `path = fmt.Sprintf(mgmtConfigV2+...)` at line 278. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:278`)
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

- **Go SDK:** `BulkReorder` (v1 and v2) detects any rule named exactly `Default_Rule` and appends its ID last regardless of caller input. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/policysetcontroller.go:300-317`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:374-391`)
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

- **Go SDK (both v1 and v2):** `disabled` as `string` with `omitempty`; the v1 request, v2 response, and v2 request declarations are in `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/policysetcontroller.go:46` and `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:51,132`.
- **Postman:** explicitly types `disabled` as `<integer>`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:73629`)

**Significance / which to trust:** Postman is likely authoritative on wire type. The field's zero-value (0/false/empty string) is the common case; mismatch only affects explicit enable/disable operations.

---

### `ALLOW` action for `ACCESS_POLICY` — confirmed in both SDKs; absent from Postman ZPA policy bodies

**What each source says:**

- **Go SDK:** access rule test uses `Action: 'ALLOW'`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/zpa_policy_access_rule_test.go:64`)
- **Python SDK:** accepts `'allow'` and uppercases it. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:546-550`)
- **Postman:** a 2026-08-04 full-collection audit found no `ALLOW` action in the
  current ZPA policy-rule example bodies; the cited response is representative
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:73629`). This is an
  audit-scoped documentation absence, not an API restriction.

**Significance / which to trust:** `ALLOW` is a real and valid access policy action. The Postman omission is a documentation gap, not an API restriction.

---

### `v1 Conditions` struct — has `microtenantId`; `v2 PolicyRuleResourceConditions` does not

**What each source says:**

- **Go v1:** `Conditions` struct (line 101) has `MicroTenantID string` with `omitempty`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/policysetcontroller.go:93-102`)
- **Go v2:** `PolicyRuleResourceConditions` struct (lines 168-176) has no `MicroTenantID` field. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:168-176`)
- **Postman:** consistent with Go — v1 conditions include `microtenantId`; v2 conditions include `setIds` instead. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:73629`)

**Significance / which to trust:** Serializing a v1 condition object with `microtenantId` to a v2 endpoint sends an unrecognized field.

---

### Policy Group changelog HTTP methods disagree with executable code

Python v1.9.39's changelog labels policy-group create as
`GET /policyGroupSet/{groupSetId}/group`, but `add_group` sends POST
(`vendor/zscaler-sdk-python/CHANGELOG.md:117-124`;
`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:38-77`). It also labels
group reorder as POST, while `reorder_group` sends PUT
(`vendor/zscaler-sdk-python/CHANGELOG.md:122`;
`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:364-388`). Trust the
executable service code for both wrapper methods; the changelog method labels
are documentation defects.

### `search_groups` example omits its mandatory `group_set_id`

The method signature requires `group_set_id: str` and places it in
`/policyGroupSet/{group_set_id}/group/search`, but the embedded example calls
`search_groups` with only `filter_and_sort_dto`
(`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:167-184`). Copying that
example raises a Python argument error before any API request. Supply the policy
group-set ID as the first argument.

### Policy Group controllers are unified-client only

Unified `ZPAService` registers `policy_group`, `policy_group_rule`, and
`policy_group_set` (`vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py:504-517`).
The corresponding legacy properties are present only as commented code
(`vendor/zscaler-sdk-python/zscaler/zpa/legacy.py:1070-1098`). This is a Python
client-surface divergence.

---

### PR #456 ZPA additions — executable Go surface versus Python and changelog

The refreshed Go pin adds the B2B policy, Browser Access Groups, customer-domain,
federated-application, One Identity, policy-group, policy-group-rule,
policy-group-set, and shared-policy packages. These are client-side wrappers:
their presence in the SDK does **not** prove that a tenant exposes the route or
that a product entitlement is active. The executable source is separated below
from changelog wording, which is release metadata rather than an API contract.

**B2B policy controller.** Go builds an admin-customer URL and sends the guest
ID to `/policySet/rules/policyType/GLOBAL_POLICY/guest/{guestID}` through the
shared all-pages `GET` helper, returning typed `[]PolicyRule`
(`vendor/zscaler-sdk-go/zscaler/zpa/services/b2b_policy_controller/b2b_policy_controller.go:13-35`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:231-260,325-411`).
Python uses the non-admin `/zpa/mgmtconfig/v1/customers/{customerId}` base and a
`GET` for the same guest suffix, but returns the raw response and duplicates it
in both result slots (`vendor/zscaler-sdk-python/zscaler/zpa/b2b_policy.py:23-59`).
The Go changelog labels that operation `PUT`
(`vendor/zscaler-sdk-go/CHANGELOG.md:83-87`), so the method disagreement is
between release prose and both executable clients; the admin-versus-non-admin
base and typed-versus-raw response differences remain unresolved.

**Federated application.** Go exposes a typed host listing that pages
`GET /application/host/{hostID}` and a separate `PUT /application/federate`
request carrying `applicationGid` and `guestGids`
(`vendor/zscaler-sdk-go/zscaler/zpa/services/federated_application/federated_application.go:28-66`).
Python instead lists `GET /application/host` without a host ID and updates
`PUT /application/{application_id}`
(`vendor/zscaler-sdk-python/zscaler/zpa/application_federation.py:26-68,70-104`).
The Go changelog agrees with the Go paths for this pair
(`vendor/zscaler-sdk-go/CHANGELOG.md:83-86`), but the two SDKs do not expose
the same operation/path model. Treat the two forms as an open contract
question, not as evidence that either route is available to a particular
tenant.

**Customer-domain controller.** Go declares only a read method: an admin-
customer `GET /v2/associationtype/{type}/domains` decoded as a bare
`[]CustomerDomainController`
(`vendor/zscaler-sdk-go/zscaler/zpa/services/customer_domain_controller/customer_domain_controller.go:12-40`).
Python lists the same path but also exposes `POST` `add_update_domain` on that
path, including the empty-list removal behavior in its docstring
(`vendor/zscaler-sdk-python/zscaler/zpa/customer_domain.py:26-90,92-171`).
The Go changelog advertises both `GET` and `POST`
(`vendor/zscaler-sdk-go/CHANGELOG.md:88-90`), so the POST is a changelog/Python
surface with no executable Go method at this pin. Whether the POST is a
supported service operation, and whether Go intentionally omitted it, remains
unverified.

**Browser Access Groups.** The new Go package declares an admin-customer
`/browserAccessGroups` endpoint, a large typed `BrowserAccessGroups` model, and
only `GetAll` and `Get` readers with a microtenant filter
(`vendor/zscaler-sdk-go/zscaler/zpa/services/browser_access_groups/browser_access_groups.go:28-67,179-195`).
The captured Python ZPA tree has no corresponding `browser_access_groups.py`
service; its Browser Access modules concern application-segment variants
instead (`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba.py:19-31`).
The Go changelog's PR #456 list does not name this package
(`vendor/zscaler-sdk-go/CHANGELOG.md:57-90`). This is a Go-only captured client
surface and a release-documentation gap, not proof of backend availability or
Browser Access entitlement.

**One Identity controller.** Go exposes one typed `GET /iamidpmapping` object
under the admin-customer base, with `deliveryTag`, `orgId`, and typed mapping
records (`vendor/zscaler-sdk-go/zscaler/zpa/services/one_identity_controller/one_identity_controller.go:11-42`).
Python calls the same path as `list_iamidpmappings` and iterates response
results, while its nested model additionally carries `syncVersion`
(`vendor/zscaler-sdk-python/zscaler/zpa/one_identity.py:26-68`;
`vendor/zscaler-sdk-python/zscaler/zpa/models/one_identity.py:59-89`).
Thus Go's single-object return, Python's list return, and the Python-only
captured `syncVersion` field are model/response-shape divergences. The changelog
does not mention this package, so the live response envelope and the intended
parity are open.

**Policy Group, Rule, and Set controllers.** Go adds separate admin-customer
packages. The executable Go policy-group package has read, update, delete,
all-groups, and reorder methods, but its exported `CreateRule` sends `POST
/policyGroupSet/{groupSetId}/rule` and accepts a `PolicyGroupResource`; it has
no `CreateGroup` method (`vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group/policy_group.go:37-45,102-159`).
Its `ReorderGroup` sends `PUT /policyGroupSet/{groupSetId}/rule/{groupID}/reorder/{order}`
(`vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group/policy_group.go:140-150`).
The Go rule package separately provides typed list/create/get/delete/reorder
under `/group/{groupId}/rule`, with no update method
(`vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group_rule/policy_group_rule.go:31-133`),
and the set package is read-only for set, policy-type, rule, summary, and
summary-stats reads (`vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group_set/policy_group_set.go:29-166`).
The shared policy package supplies `DesktopPolicyMappings`, and the v2 policy
model carries `groupId`, `linkText`, and `url`
(`vendor/zscaler-sdk-go/zscaler/zpa/services/policycommon/policycommon.go:1-22`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:124-166`).

This does not line up with either the Python executable surface or the Go
changelog: Python `add_group` is `POST .../group` and Python group reorder is
`PUT .../group/{groupId}/reorder`, while the changelog describes `GET .../group`
as "Add a new Policy Group" and lists reorder as `POST
.../group/{groupId}/reorder`
(`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:38-77,364-388`;
`vendor/zscaler-sdk-go/CHANGELOG.md:57-73`). The source-level Go path and
method mismatch is a potential wrapper defect; without a live response or an
upstream test, do not promote it to a backend claim.

**Release metadata is internally inconsistent.** At this Go pin,
`oneapiclient.VERSION` still says `3.8.48`, while the changelog begins with
`3.8.49` and its PR #460 entry
(`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:45-51`;
`vendor/zscaler-sdk-go/CHANGELOG.md:3-16`). Record this as tooling/open
metadata. It must not be used to infer product behavior, route availability, or
tenant entitlement.

**Open questions / gaps introduced by the new Go surface.**

1. **B2B method and base:** Does the live B2B guest-policy operation accept the
   Go/Python `GET`, and which `/customers` versus `/admin/customers` base is
   canonical? Neither SDK's wrapper alone settles this.
2. **Customer-domain write:** Is `POST /v2/associationtype/{type}/domains`
   supported, despite the Go omission, or is it a Python/changelog-only
   declaration? A captured response is required.
3. **Federated-application paths:** Are host listing and federation represented
   by both SDK path forms, or is one SDK using a stale/alternate route? Confirm
   host-ID semantics and the update target with a contract or live call.
4. **Browser Access Groups:** Is the Go-only read surface intentionally
   unsupported in Python, or merely not yet ported? The source tree does not
   answer whether the service is enabled for a tenant.
5. **One Identity envelope:** Does `/iamidpmapping` return one object or a
   list, and is `syncVersion` part of the current wire payload? The SDKs model
   different answers.
6. **Policy Group operations:** Is Go `CreateRule` intentionally a policy-group
   set rule operation, and should `ReorderGroup` use `/rule/` or `/group/`? The
   executable Go code, Python code, and changelog disagree on both operation
   names and HTTP paths.

These gaps are deliberately phrased as client-contract questions. No SDK
declaration above is an entitlement or backend-availability assertion.

---

### Field observations (Policy)

**`operands.name` rewritten by API (corroborated):** Go SDK v1 UpdateRule explicitly clears `operand.Name` before PUT (`policysetcontroller.go:198-202`). This confirms the operator observation that the API always rewrites operand name to the referenced object's display name. The SDK strips it silently to prevent 400 errors.

**`priority` and `rule_order` — server-computed (partially corroborated):** Both fields are present in Go v2 `PolicyRule` request struct (lines 141, 144) but sending them on creates/updates is likely ignored or causes drift. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:141,144`) (Corroborating operator field observation from production Terraform usage.)

**`capabilities.file_upload=False` maps to `INSPECT_FILE_UPLOAD` — Python SDK bug confirmed:** `policies.py:3216-3217` maps `priv_caps_map.get('file_upload') is False` to `'INSPECT_FILE_UPLOAD'`. Setting `file_upload=False` to mean inspect-uploads is counter-intuitive. `inspect_file_upload=True` independently also maps to `INSPECT_FILE_UPLOAD` (line 3222). (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:3214-3222`)

**`reformat_params` `app_connector_group_ids` → `'PolicySetControllers'` — dead-code SDK bug:** Python SDK `reformat_params` maps `app_connector_group_ids` to the key `'PolicySetControllers'` (copy-paste error). All access rule methods manually build the `appConnectorGroups` key before the helper runs, so this is never exercised in practice. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:75-79`)

---

## App Connectors, Groups and Schedules

### `enrollmentCertId` — observed App Connector create requirement vs Terraform create/update resolution

**What each source says:**

- **Legacy Help:** the create article resolves under Legacy Zscaler APIs and its
  advertised field table does not include `signingCertId` or an equivalent
  enrollment-certificate field
  (`vendor/zscaler-help/zpa-create-operation-drift-capture.md`).
- **Authenticated Go SDK integration run:** the production tenant rejected an
  App Connector Group POST with `400 missing.mandatory.params` because
  the API's `signingCertId` was empty. The Go client serializes the corresponding
  field as `enrollmentCertId`, and its current test now looks up the `Connector`
  enrollment certificate and sends its ID
  (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go:60`,
  `vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group_test.go:21-53`).
- **Terraform provider v4.4.10:** `enrollment_cert_id` is Optional+Computed on
  `zpa_app_connector_group`, `zpa_service_edge_group`, and
  `zpa_private_cloud_group`. The provider invokes the shared resolver before
  both create and update, using certificate name `Connector` for App Connector
  and Private Cloud groups and `Service Edge` for Service Edge groups
  (`vendor/terraform-provider-zpa/CHANGELOG.md:3-12`;
  `vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:203-208,233-245,342-347`;
  `vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:251-256,281-289,385-390`;
  `vendor/terraform-provider-zpa/zpa/resource_zpa_private_cloud_group.go:154-159,184-192,270-275`).
- **Resolver lifecycle:** a nonempty value in Terraform `ResourceData` is
  preserved; a missing/empty value causes a microtenant-scoped name lookup, and lookup
  errors or empty returned IDs fail the operation. Reads hydrate the backend
  ID and expansion sends the state value, so refresh alone does not invoke the
  resolver; empty legacy state is repaired when an update runs. An explicit
  empty string therefore selects lookup/defaulting rather than clearing the
  field, while removing an explicit ID may retain the computed current value
  (`vendor/terraform-provider-zpa/zpa/utils.go:378-398`;
  `vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:74-85`;
  `vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:278-365,423-440`;
  `vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:315-404,453-470`;
  `vendor/terraform-provider-zpa/zpa/resource_zpa_private_cloud_group.go:216-290,333-347`).
- **`user_codes` is independent:** certificate resolution runs on every
  create/update; user-code verification runs only for nonempty codes on create
  or changed, nonempty codes on update
  (`vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:233-266,342-382`;
  `vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:281-310,385-421`;
  `vendor/terraform-provider-zpa/zpa/resource_zpa_private_cloud_group.go:184-213,270-306`).
- **Raw Go SDK:** each Update method serializes the group object supplied by
  the caller and performs no certificate lookup. `enrollmentCertId` has
  `omitempty`, so an empty string is omitted when the shared request path
  marshals the object
  (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go:60,145-152`;
  `vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgegroup/zpa_service_edge_group.go:61,98-105`;
  `vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_group/private_cloud_group.go:46,84-91`;
  `vendor/zscaler-sdk-go/zscaler/zparequests.go:77-85`).
- **Provider SDK baseline:** provider v4.4.10 still compiles
  `zscaler-sdk-go/v3` v3.8.42; do not attribute later SDK behavior to this
  Terraform release (`vendor/terraform-provider-zpa/go.mod:5-15`).
- **Python SDK:** accepts arbitrary create keywords and POSTs them, but the
  method's documented keyword list and example omit `enrollment_cert_id`
  (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py:254-332`).
- **Ansible and MCP:** both resolve the enrollment certificate before delegating
  to the Python SDK
  (`vendor/zpacloud-ansible/plugins/modules/zpa_app_connector_groups.py:575-615`,
  `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/app_connector_groups.py:242-284`).

**Significance / which to trust:** Treat `enrollmentCertId` as required for App
Connector Group create on the observed OneAPI production tenant, despite the
server error's older `signingCertId` terminology. Prefer a client that resolves
it automatically, or fetch the `Connector` enrollment certificate and send its
ID explicitly. Direct Python SDK callers must add the undocumented
`enrollment_cert_id` keyword. Do not generate a current create payload from the
legacy Help field table alone.

**Terraform scope:** v4.4.10's create/update resolver is the documented
provider remedy for the reported `missing.mandatory.params` symptom. The provider release note and raw SDK
serialization path do not independently prove that every backend PUT
universally requires the field, so keep that conclusion scoped to provider
behavior and the reported failure
(`vendor/terraform-provider-zpa/CHANGELOG.md:3-12`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go:145-152`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgegroup/zpa_service_edge_group.go:98-105`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_group/private_cloud_group.go:84-91`).

---

### `AssistantSchedule.frequencyInterval` wire type — `string` (SDKs) vs `<integer>` (Postman)

**What each source says:**

- **Go SDK:** `FrequencyInterval` as Go `string`; valid-values map uses string keys (`"5"`, `"7"`, etc.). (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorschedule/appconnectorschedule.go:33`)
- **Python SDK:** passes `frequency_interval` as a string kwarg. (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_schedule.py:120`)
- **Postman:** a 2026-08-04 audit of all current `connectorSchedule` request and
  response examples found `frequencyInterval` represented as an integer; the
  cited body is representative
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:31272`).

**Significance / which to trust:** Trust the SDKs. Send `frequencyInterval` as a string-encoded integer, not a bare JSON integer.

---

### `AppConnectorGroup.dnsQueryType` — `IPV4_IPV6` corroborated across clients and Postman

**What each source says:**

- **Python SDK:** documents `IPV4_IPV6`, `IPV4`, `IPV6` as accepted values. (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py:276-278`)
- **Go SDK test:** uses `'IPV4_IPV6'`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group_test.go:45`)
- **Postman:** a direct App Connector Group GET response shows `IPV4`, while
  App Connector Groups nested in a Server Group GET response show
  `IPV4_IPV6`; both appear directly on `dnsQueryType`, not only in an LSS
  context
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:33311,118941`).

**Significance / which to trust:** All three sources corroborate
`IPV4_IPV6`. Individual Postman response bodies remain illustrative rather than
exhaustive enum definitions.

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

- **Postman:** documents `POST /connectorSchedule` as returning 204 No Content
  but echoes the full schedule object in the response example body —
  contradictory
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:32515-32542,32622-32632`).
- **Go SDK test:** accepts both 200 and 204 as valid. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorschedule/appconnectorschedule_test.go:32-33`)

**Significance / which to trust:** Handle both 200 and 204. Do not assume a parseable body on `POST /connectorSchedule`.

---

### Field observations (App Connectors)

**`latitude`/`longitude` — string fields, range-validated (corroborated):** The operator observation that ZPA `app_connector_group` latitude and longitude are schema-typed as strings but validated with range bounds is confirmed. Go SDK types both as `string` (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go:30-32`). Postman types group-level lat/lon as `string` but connector-level as `double` — the group-level string contract stands. (Corroborating operator field observation from production Terraform usage.)

**`update_connector_schedule` snake_case bug — not in operator field observations but confirmed in source:** See entry above. (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_schedule.py:185-200`)

**Go SDK `CustomerVersionProfile` Update wrong path:** See entry above. No operator field observation covers this endpoint. (`vendor/zscaler-sdk-go/zscaler/zpa/services/customerversionprofile/zpa_customer_version_profile.go:88-90`)

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

- **Postman:** `serverGroups` inside an `AppConnectorGroup` GET response carries
  `passive` (boolean) and `weight` (integer) fields
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:33311`).
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

**`server_groups` merge-flatten drift (corroborated):** The operator observation that the Terraform provider's `flattenCommonAppServerGroupSimple` collapses all N ServerGroup API elements into one merged block is corroborated. The SDK correctly returns all N objects; flattening is a provider-layer behavior on the read path. Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:181-188`. (Corroborating operator field observation.)

**IP-anchoring blocks referential deletes (consistent, not directly corroborated):** `ServerGroup.IpAnchored` has no `omitempty` — always serialized. The SDK does not implement any pre-delete anchoring check; the block is server-side. Callers should set `IpAnchored` to `false` before attempting deletion. (`vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:25`) (Corroborating operator field observation from production Terraform usage.)

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

**`posture_udid` and `networkId` are stable references — API name-rewrite does not apply here:** The operator observation that `operands[].name` is always rewritten by the API applies to app connector and app segment references, not to `postureUdid` or `networkId`. Those fields are opaque identifiers, not display names, and are stable across plan-apply cycles. Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go:33`, `vendor/zscaler-sdk-go/zscaler/zpa/services/trustednetwork/zpa_trusted_network.go:27`. (Corroborating operator field observation from production Terraform usage.)

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

- **Postman:** `bulkDelete` returns 200 OK, while single DELETE returns 204 No
  Content
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:114736-114763,114847-114848,113278-113291,113364-113365`).
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

**`latitude`/`longitude` typed as strings (corroborated):** `ServiceEdgeGroup.Latitude` is `string json:"latitude,omitempty"` in Go. Postman describes lat/lon as `string` for `ServiceEdgeGroup`. (Corroborating operator field observation from production Terraform usage.)

**`ServiceEdgeSchedule` POST uses 204 status but Postman also supplies a body:**
Python `add_service_edge_schedule` handles 204 by returning
`ServiceEdgeSchedule({"id": scheduler_id})` as synthetic success
(`vendor/zscaler-sdk-python/zscaler/zpa/service_edge_schedule.py:143-147`). The
Postman response records 204 and no Location header, but contradictorily embeds
a complete schedule object in `body`
(`vendor/zscaler-api-specs/oneapi-postman-collection.json:111260-111287,111367-111377`).

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

**Policy conditions ordering — unordered backend (confirmed for LSS):** The LSS resource's `policyRuleResource.Conditions` is a Go slice. The Terraform validator accepts `AND` or `OR` as condition operators. Do not rely on positional ordering of conditions or operands across round-trips. Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go:81`, `vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go:39-43`. (Corroborating operator field observation from production Terraform usage.)

---

## Privileged Remote Access (PRA)

### Ansible approval matching — email set plus requested application set

**What each source says:**

- **Ansible 2.2.11:** when no approval ID is supplied, the module compares the
  email set and, when `application_ids` is supplied, the IDs of the approval's
  current applications. A same-email approval for another application set is
  skipped (`vendor/zpacloud-ansible/plugins/modules/zpa_pra_approval.py:250-275`).
- **Regression test:** a same-email SSH approval is not updated when the desired
  approval targets a different RDP segment; the module creates a new approval
  instead
  (`vendor/zpacloud-ansible/tests/unit/plugins/modules/test_zpa_pra_approval.py:148-191`).

**Significance / which to trust:** The natural key is no longer email-only. It
is email set plus the requested application set when that set is supplied.

---

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
- **Postman:** a 2026-08-04 full-collection audit found `PASSWORD` and
  `USERNAME_PASSWORD` examples but no `SSH_KEY` `credentialType`; the cited body
  is representative
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:37381`). This is an
  audit-scoped documentation absence.

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

- **Postman (full observed set across response examples):** `AUTO`, `DYNAMIC`,
  `FTP`, `HTTP`, `HTTPS`, `NONE`, `RDP`, `SSH`, `VNC`, `WEBSOCKET`. Nine values
  occur together in one application-segment response body; `RDP` is present in
  another PRA application response (`vendor/zscaler-api-specs/oneapi-postman-collection.json:11008,11744`).

**Significance / which to trust:** Parsers should tolerate all ten values
observed in the current examples, including `VNC`. Do not convert that observed
set into an exclusive write allowlist or a claim about the server's
future-exhaustive enum; formal acceptance constraints still require a contract
or live validation.

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

- **Go SDK:** `SearchRequest.FilterBy` produces `{filterBy: {filterGroups: [{filters: [], operator}], operator}}`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:545-558`)
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

### Go `MicroTenantName` filter resolution returns early on success

**What the source says:** `GetAllPagesGenericWithCustomFilters` attempts to resolve a supplied `MicroTenantName` through `GET /microtenants` when `MicroTenantID` is empty. The next guard is `if err == nil { return nil, resp, err }`, so a successful lookup returns an empty result and nil error before assigning `filters.MicroTenantID` or requesting the caller's resource. The assignment is reachable only after a lookup error and only when that failed lookup also returned a non-nil object. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:311-351`)

**Significance / which to trust:** Treat name-based microtenant resolution in this Go helper as broken. Resolve the microtenant separately and pass `MicroTenantID` until the inverted guard is fixed; a nil error from the name-based call does not mean the requested resource list was fetched.

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

- **Postman:** a 2026-08-04 audit of the current certificate response examples
  found `getcName` consistently and no `cName`; the cited enrollment and BA
  certificate bodies are representative
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:46169,25489`).
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

**No operator field observations cover ZPA Certificates or Enrollment:** the available production field observations do not touch the certificate or enrollment area, so no corroboration or contradiction of any certificate-area claim is possible from that signal. The SDK/Postman source citations above stand on their own.

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

- **Go SDK:** `GetAllPagesGenericWithCustomFilters` retries with the first two words of a multi-word search value when the full search fails. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:352-391`)
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
- **Postman / Python SDK:** the current successful Postman example omits
  `idpName`, and the Python model has no such field
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:102064-102074`,
  `vendor/zscaler-sdk-python/zscaler/zpa/models/scim_groups.py:32-46`). The live
  cassette above is the stronger evidence that this is not merely one sparse
  example.

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
- Sources: `vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:421-469`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:102565`.

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

### `NP_ASSISTANT_GRP` enum value — Go SDK only; undocumented by Python and Postman

**What each source says:**

- **Go SDK:** three `associationType` values: `CONNECTOR_GRP`, `SERVICE_EDGE_GRP`, `NP_ASSISTANT_GRP`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:18-22`)
- **Python SDK:** `simplify_key_type()` raises `ValueError` for anything other than `'connector'` (→ `CONNECTOR_GRP`) and `'service_edge'` (→ `SERVICE_EDGE_GRP`). (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:36-41`)
- **Postman:** a 2026-08-04 full-collection search found no
  `NP_ASSISTANT_GRP`; the cited parameter documents only `CONNECTOR_GRP` and
  `SERVICE_EDGE_GRP`. This is an audit-scoped absence, not proof that the
  server rejects the third value.
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:94650-94652`)

**Significance / which to trust:** Treat `NP_ASSISTANT_GRP` as a Go-only
candidate, not as an established public API value. Its live acceptance and
intended object type remain unverified; do not expose it through Python-backed
automation without tenant or public-contract confirmation.

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

**`cbi_profile` `{id:'0', name:'', ...}` stub — treated as absent by provider (corroborated):** Consistent with the CBI profile struct having `omitempty` on ID — a zero-value ID would serialize as absent. Engineers importing resources with no CBI profile must handle the stub object explicitly. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:18`) (Corroborating operator field observation from production Terraform usage.)

**`InspectionProfile.ControlInfoResource.Count` — server-computed (parallel to operands.name rewrite):** The `controlsInfo[].count` field (string) is computed server-side. Storing it in Terraform config will cause perpetual drift as the API overwrites the value. (`vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_profile/zpa_inspection_profile.go:47-50`) (Corroborating operator field observation from production Terraform usage.)

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

14. **Enrollment-certificate name uniqueness and result order:** `GetByName`
    sends a search plus the active microtenant, walks the returned list, and
    returns the first case-insensitive exact-name match without detecting a
    second match. Whether enrollment-certificate names are tenant-unique and
    whether duplicate-match ordering is stable is *unverified — requires API
    contract confirmation or a tenant-side duplicate-name test*
    (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:74-85`).

15. **PRA approval identity when email and application sets are equal:** Ansible
    2.2.11 now distinguishes approval candidates by email set plus the requested
    application set, but its lookup does not compare start/end windows
    (`vendor/zpacloud-ansible/plugins/modules/zpa_pra_approval.py:250-275`).
    Whether two approvals may legitimately share those sets while carrying
    different windows—and how automation should select between them—requires an
    API contract or live-tenant test. Tracked as
    [clarification `zpa-82`](../_meta/clarifications.md#zpa-82-pra-approval-identity-when-email-and-application-sets-match-but-time-windows-differ).

16. **Application-segment HBR/sticky/guest semantics:** Go v3.8.45 and Python
    v1.9.41 establish `hbrEnabled`, `stickyEntity`, `stickyGroup`, and
    `guestDetails` as wire fields, but not their accepted values, readonly
    status, selection behavior, or lifecycle. The current Automate/Rosetta
    capture has no rows for them. Tracked as
    [clarification `zpa-83`](../_meta/clarifications.md#zpa-83-application-segment-hbr-sticky-and-guestdetails-semantics).
