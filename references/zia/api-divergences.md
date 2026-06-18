---
product: zia
topic: "api-divergences"
title: "ZIA API source divergences"
content-type: reference
confidence: medium
last-verified: "2026-06-18"
sources:
  - "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/zia-divergences.md"
  - "vendor/zscaler-api-specs/automate-zscaler/rosetta.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/cloudappcontrol.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol_test.go"
  - "vendor/zscaler-sdk-python/zscaler/zia/url_filtering.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/url_filtering_rules.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go"
  - "vendor/zscaler-sdk-python/zscaler/utils.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/common/zia_helpers.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/cloud_app_control.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/ssl_inspection_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/authentication_settings.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/auth_settings/auth_settings.go"
  - "vendor/zscaler-help/legacy-authentication-settings.md"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/time_intervals.py"
  - "vendor/zscaler-mcp-server/skills/zia/create-ssl-inspection-rule/SKILL.md"
  - "vendor/zscaler-mcp-server/skills/zia/look-up-rule-targets/SKILL.md"
author-status: draft
---

# ZIA API source divergences

The captured Automate operation contract, Go SDK, Python SDK, Terraform provider, Ansible collection, and MCP tools are independent views of the same ZIA management API, produced separately and updated at different cadences. Where they agree, confidence is high. Where they diverge, an engineer needs to know which source to trust before writing code — and the answer changes by field, endpoint, and resource type.

A third signal here is the Zscaler MCP server's ZIA tools. The MCP layer carries operator-observation notes (API error strings, behavioral quirks) in its docstrings and enforces some constraints client-side. Those notes can describe real API behavior, but they are not reproducible from SDK source and are flagged accordingly. Where a claim about how ZIA behaves exists ONLY in MCP docstrings — not in either SDK — it is called out as an observation, not source-backed product behavior.

This historical prose pass began with Cloud App Control (CAC), URL Filtering, SSL Inspection, and Authentication Settings. DAV-21/DAV-23 added the generated contract reconciliation and rosetta table across the Terraform-managed ZIA surface; use that generated layer for field-level required/readonly/enum coverage and use the narrative sections below for the human-readable explanations of high-value divergences.

**Quick trust hierarchy (applies unless an entry below overrides it):**

- For wire shape: trust the SDK source you're actually calling. Where the two SDKs disagree on a request body, check the Go SDK's json struct tags: fields carry `,omitempty` (e.g. the CAC `WebApplicationRules` struct, `vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:18-32`), so a zero-valued field is dropped from the serialized body — meaning the field one SDK omits is optional on the wire, and the other SDK proves the call round-trips without it.
- The CAC `availableActions` endpoint returns a flat `List[str]` of category-level actions; neither SDK exposes per-app action validity.
- MCP docstring claims about API error codes and behavioral quirks are observations pending live-tenant confirmation, not SDK-backed facts.

**Contract reconciliation now feeds this doc.** For documented method/path and field metadata (`required`, `readonly`, `enum`), the verification protocol prefers the captured Automate contract when it exists; Terraform validators remain authoritative only for what the provider accepts, SDKs for wrapper behavior, and Postman for examples/fallback evidence (`references/_meta/verification-protocol.md:114-118`). The generated ZIA reconciliation diffs `vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json` against Go, Python, Terraform, Ansible, and MCP surfaces (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.md:7-11`). Its current totals are 0 contract-vs-Go numeric/string type drifts, 48 contract-vs-Terraform required-flag drifts, 11 enum value conflicts, 37 one-sided enum constraints, and 1 readonly field with no Terraform disagreement (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.md:13-18`).

Use the rosetta table as the field-level index when a section below summarizes a resource rather than spelling out every field. It defines the `req`, `enum≠`, `enum1`, `ro`, `ro!`, and `type` markers (`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:11-20`) and begins the ZIA resource table at `admin_role` (`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:506-515`). The generated ZIA report also records captured contract groups that are outside Terraform's managed-resource scope, such as `api-authentication`, `event-logs`, `pac-files`, `service-edges`, `time`, and `time-intervals`; those are coverage boundaries, not missing Terraform mappings (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.md:30-47`).

---

## Cloud App Control (CAC)

### CAC endpoints — both SDKs agree; `rule_type` is mandatory on every call

**What each source says:**

- **Python SDK:** all CAC ops are category-scoped under the `webApplicationRules` base. `availableActions` is `POST /{rule_type}/availableActions` (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:67-70`); list is `GET /{rule_type}` (`cloudappcontrol.py:119-122`); get is `GET /{rule_type}/{rule_id}` (`cloudappcontrol.py:166-169`); `ruleTypeMapping` is `GET /ruleTypeMapping` (`cloudappcontrol.py:207-210`); create is `POST /{rule_type}` (`cloudappcontrol.py:396-399`); update is `PUT /{rule_type}/{rule_id}` — full replacement (`cloudappcontrol.py:594-598`); delete is `DELETE /{rule_type}/{rule_id}` (`cloudappcontrol.py:645-648`); duplicate is `POST /{rule_type}/duplicate/{rule_id}` (`cloudappcontrol.py:728-731`).
- **Go SDK:** the endpoint constant is at `vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:15`, with the matching op paths at `:149`, `:159`, `:169`, `:184` (UpdateWithPut), `:195`, `:205`, `:229`.

**Significance / which to trust:** Both SDKs agree. There is no fetch-by-`rule_id`-alone path — `rule_type` (the category) is mandatory on every call. Update is a PUT (full replacement), so any field omitted from an update body is dropped, not preserved.

---

### `availableActions` request body — Python sends `{cloudApps}` only; Go adds a `type` field

**What each source says:**

- **Python SDK:** POSTs body `{'cloudApps': cloud_apps}` to `.../availableActions` — no `type` key. (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:72`) The result must be a list. (`cloudappcontrol.py:84-91`)
- **Go SDK:** `AvailableActionsRequest` struct has both `CloudApps` AND a `Type` field tagged `json:"type,omitempty"`. (`vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:142-145`)
- **Go SDK test:** populates `Type:"ANY"` alongside `CloudApps:["DROPBOX"]`. (`vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol_test.go:175-177`)

**Significance / which to trust:** Trust the source you're calling. The endpoint accepts the call without `type` — the Python path proves it round-trips — and `type` is `omitempty`, so it appears optional. Go callers can send a `type` discriminator that the Python path never sends.

---

### `availableActions` response shape — flat `List[str]`, category-level only

**What each source says:**

- **Python SDK:** the signature returns `List[str]` (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:34`); the discovery POST goes to `.../availableActions` with body `{cloudApps: [...]}` (`cloudappcontrol.py:66-72`), and the result is validated as a list (`cloudappcontrol.py:84-91`).

**Significance / which to trust:** Action vocabulary is surfaced at the CATEGORY level (the path segment `rule_type`), not per-app. The apps in the body act only as a filter. The endpoint does not return per-app action validity — there is no read path that enumerates which actions are valid for a single given app.

---

### Rule-state field — wire field is always `state` (ENABLED/DISABLED); `enabled` is a Python-only kwarg

**What each source says:**

- **Python SDK:** on CREATE it pops `enabled` and rewrites it to `body['state'] = 'ENABLED'/'DISABLED'` before sending (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:404-405`); same transform on UPDATE (`cloudappcontrol.py:603-604`). The read model exposes the field as `state` (no `enabled` on the way back). (`vendor/zscaler-sdk-python/zscaler/zia/models/cloudappcontrol.py:51`)
- **Go SDK:** has no `enabled` concept. The struct field is `State string json:"state,omitempty"` (`vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:24`); the Go test sets `State:"ENABLED"` directly (`cloudappcontrol_test.go:60`).

**Significance / which to trust:** The wire field is always `state` with the string enum `ENABLED`/`DISABLED`. `enabled` is a Python-SDK convenience kwarg only; Go callers set `State` directly.

---

### Apps-list kwarg — wire/SDK name is `applications` (raw enum strings, not `{id}` objects)

**What each source says:**

- **Python SDK:** `add_rule`/`update_rule` document the apps list as `applications` (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:244`) and pass kwargs straight through as the body (`cloudappcontrol.py:401`).
- **Go SDK:** the struct field is `Applications []string json:"applications,omitempty"`. (`vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:31`)
- **Shared Python id-transform list:** `reformat_params` carries only `('application_ids','applications')`, with no plain `'applications'` entry. (`vendor/zscaler-sdk-python/zscaler/utils.py:96`)
- **MCP layer:** surfaces the field as `cloud_applications` and maps it to `applications` internally. (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/cloud_app_control.py:618-621`)

**Significance / which to trust:** The wire/SDK kwarg is `applications`, NOT `cloud_applications` — the `cloud_applications` name is an MCP-layer rename, not product behavior. Because plain `applications` is not in the `reformat_params` id-transform list, the apps list is sent as raw enum strings, not coerced into `{id}` objects.

---

### CAC model fields — Go-only `numberOfApplications`; Python-only `sharingDomainProfiles`/`formSharingDomainProfiles`

**What each source says:**

- **Go-only field:** the Go `WebApplicationRules` struct carries `numberOfApplications` (`vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:32`), which the Python read-model does not parse. (`vendor/zscaler-sdk-python/zscaler/zia/models/cloudappcontrol.py:43-120`)
- **Python-only live fields:** the Python read-model parses `sharing_domain_profiles` (json `sharingDomainProfiles`) and `form_sharing_domain_profiles` (json `formSharingDomainProfiles`) (`vendor/zscaler-sdk-python/zscaler/zia/models/cloudappcontrol.py:107-114`) and emits them in `request_format` (`models/cloudappcontrol.py:218-219`). In the Go struct these two fields appear only as commented-out lines, so Go neither parses nor sends them. (`vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:94-95`)
- **Fields that agree:** Python parses `tenancy_profile_ids`, which Go has live as `TenancyProfileIDs`. Both also carry `CascadingEnabled`, `AccessControl`, `Predefined`, `EunEnabled`/`EunTemplateId`/`BrowserEunTemplateId`, and `UserRiskScoreLevels`.

**Significance / which to trust:** A Python read of a CAC rule silently drops `numberOfApplications`; a Go read silently drops the sharing-domain-profile fields and does not send them on write.

---

### `cloudAppRiskProfile` — single object (Go) vs list-decode (Python), with a latent Python inconsistency

**What each source says:**

- **Go SDK:** declares `CloudAppRiskProfile *common.IDCustom` — a single pointer object. (`vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:97`)
- **Python SDK:** decodes the same `cloudAppRiskProfile` key as a LIST via `ZscalerCollection.form_list(... ResourceReference)` (`vendor/zscaler-sdk-python/zscaler/zia/models/cloudappcontrol.py:115-117`), but then `request_format` calls `self.cloud_app_risk_profile.request_format()` as if it were a single object. (`models/cloudappcontrol.py:220`)

**Significance / which to trust:** A single-object-vs-list type mismatch between SDKs. The Python side is internally inconsistent (a list has no `.request_format()`) — flagged as a latent Python-SDK bug surface, not a product contract. The runtime behavior was not executed to confirm it raises (see Open questions).

---

### Duplicate-rule request shape — Python sends a mutable body; Go sends a nil body

**What each source says:**

- **Python SDK:** `add_duplicate_rule` sends `name` as a QUERY PARAM (`params={'name': name}`) AND a kwargs body (`body=kwargs`), with the `enabled`->`state` transform and id-field reformatting applied to that body. (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:726-746`; `enabled`->`state` at `:736-737`, `transform_common_id_fields` at `:739`)
- **Go SDK:** `CreateDuplicate` puts `name` in the URL query string (`?name=%s`) and sends a NIL body. (`vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:204-206`)

**Significance / which to trust:** Materially different behavior for the same `/duplicate/{rule_id}` endpoint. A Go duplicate copies the source rule as-is server-side; a Python duplicate can simultaneously mutate fields via its body.

---

### Application / CloudApp catalog model — defined in both SDKs but NOT the `availableActions` response shape

**What each source says:**

- **Python SDK:** defines a rich `Application` catalog model with `val`/`webApplicationClass`/`backendName`/`originalName`/`deprecated`/`misc`/`appNotReady`/`underMigration`/`appCatModified`, prefixed by a comment `# USED IN /webApplicationRules/{rule_type}/availableActions`. (`vendor/zscaler-sdk-python/zscaler/zia/models/cloudappcontrol.py:227-254`, comment at `:227`) But `availableActions` actually returns a flat `List[str]`. (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:34`, `:84-91`)
- **Go SDK:** defines the equivalent `CloudApp` struct with the same fields. (`vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:129-140`)

**Significance / which to trust:** The Python comment is misleading — the catalog model is NOT the response shape for `availableActions` (which returns `List[str]`). The `deprecated`/`underMigration`/`appNotReady` flags are real catalog attributes, but they surface through a different path, not `availableActions`.

---

## URL Filtering

### ISOLATE `cbiProfile` on GET-by-ID — Go works around a live ZIA bug; Python has neither the workaround nor the field

**What each source says:**

- **Go SDK:** documents and works around a live ZIA bug — GET-by-ID does NOT return the `cbiProfile` object for ISOLATE rules even though GET-all does. `Get()` falls back to `GetAll()` to repopulate it when `Action=='ISOLATE' && CBIProfile==nil && CBIProfileID!=0`. (`vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go:240-254`) Go carries dual fields `CBIProfile` + `CBIProfileID json:"cbiProfileId"`, with a comment noting `cbiProfile` is required for ISOLATE and not applicable to other actions. (`urlfilteringpolicies.go:137-140`)
- **Python SDK:** `get_rule` does a plain GET with no such fallback. (`vendor/zscaler-sdk-python/zscaler/zia/url_filtering.py:114-148`) The Python `URLFilteringRule` model has no `cbi_profile_id` field at all — only `cbi_profile`. (`vendor/zscaler-sdk-python/zscaler/zia/models/url_filtering_rules.py:119-125`, `:222`)

**Significance / which to trust:** High impact for ISOLATE rules. Python ISOLATE-rule reads via GET-by-ID can silently come back with an empty `cbiProfile`. Use the Go SDK's GET-all-fallback pattern (or read from GET-all directly) when you need the `cbiProfile` populated for an ISOLATE rule.

---

## SSL Inspection

### `timeWindows` — SDK model exposes the field, but the API does NOT support time-of-day scheduling for SSL Inspection

**What each source says:**

- **Python SDK model:** the `SSLInspectionRules` model both deserializes and serializes a `timeWindows` field — `self.time_windows` is populated from `config["timeWindows"]` (`vendor/zscaler-sdk-python/zscaler/zia/models/ssl_inspection_rules.py:121-122`) and emitted back as `"timeWindows": self.time_windows` in the request body (`vendor/zscaler-sdk-python/zscaler/zia/models/ssl_inspection_rules.py:207`). A caller can therefore set the field and the request will round-trip without error.
- **MCP server (API behavior):** the ZIA Time Intervals tool docstring states plainly "SSL Inspection rules do **not** support `time_windows`" (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/time_intervals.py:8`). The create-ssl-inspection-rule skill states the rule type "does not support a recurring time-of-day schedule. SSL Inspection rules have no `time_windows` attribute on the API" (`vendor/zscaler-mcp-server/skills/zia/create-ssl-inspection-rule/SKILL.md:23`), "There is no `time_windows` field on this API" (`:64`), and "SSL Inspection has no `time_windows` attribute" (`:198`). The look-up-rule-targets skill marks `time_windows` as applying to "every rule type **except SSL Inspection**" because "SSL Inspection has no `time_windows` field on the API" (`vendor/zscaler-mcp-server/skills/zia/look-up-rule-targets/SKILL.md:57`).

**Significance / which to trust:** This is an SDK-model-exposes-field-but-API-ignores-it divergence — the opposite failure mode from the usual SDK-vs-SDK shape disagreement. The Python model's presence of `timeWindows` is misleading: setting it on an SSL Inspection rule does **not** produce a time-scheduled rule, because the API ignores it for this rule type. Do not rely on the SDK model surface as evidence the feature works. For time-of-day enforcement on encrypted traffic, attach the schedule to a **Cloud Firewall Filtering** rule or a **URL Filtering** rule instead (both honor `timeWindows`), letting the SSL Inspection rule govern only what is decrypted when the scheduled layer permits the traffic (`vendor/zscaler-mcp-server/skills/zia/create-ssl-inspection-rule/SKILL.md:64`). Cross-reference: `references/zia/time-intervals.md` (rule-types table caveat). The API-behavior side of this entry is sourced from MCP skill/tool documentation, not a second SDK; treat the "API ignores it" claim as documented vendor behavior pending live-tenant confirmation.

---

## Authentication Settings

### `passwordStrength` / `passwordExpiry` enums — Python SDK docstring tokens disagree with the API

**What each source says:**

- **API (help capture):** the `AuthSettings` model defines `passwordStrength` as enum `NONE` / `LOW` / `HIGH` and `passwordExpiry` as enum `NEVER` / `MONTHLY` / `QUARTERLY` / `SEMIANNUALLY` (`vendor/zscaler-help/legacy-authentication-settings.md:23-24`). The GET example value echoes `"passwordStrength": "NONE"` / `"passwordExpiry": "NEVER"` (`:36`).
- **Python SDK docstring:** the `update_authentication_settings` method documents *different* tokens — `password_strength` "Supported values: NONE, MEDIUM, STRONG" and `password_expiry` "Supported values: NEVER, ONE_MONTH, THREE_MONTHS, SIX_MONTHS" (`vendor/zscaler-sdk-python/zscaler/zia/authentication_settings.py:242-245`). The Python model itself stores the value as an opaque string and does not validate against any enum (`vendor/zscaler-sdk-python/zscaler/zia/models/authentication_settings.py:44-45`), so the docstring is the only place these tokens appear.
- **Go SDK:** the `AuthenticationSettings` struct types both fields as plain `string` with no enum constants, so it does not arbitrate the token set (`vendor/zscaler-sdk-go/zscaler/zia/services/auth_settings/auth_settings.go:39-42`).

**Significance / which to trust:** Trust the API enums (`NONE`/`LOW`/`HIGH`, `NEVER`/`MONTHLY`/`QUARTERLY`/`SEMIANNUALLY`). The Python docstring tokens appear to be wrong — they are not produced by the model, are not echoed in the API example value, and have no corroborating source. A caller who copies `MEDIUM`/`STRONG` or `ONE_MONTH` from the SDK docstring into a `PUT /authSettings` body risks a rejected or silently-ignored value. This is a docstring-vs-API divergence (the SDK's *runtime* behavior is fine, since neither SDK validates the string); only the human-facing docstring is misleading. Cross-reference: `references/zia/ad-integration.md` (AuthSettings field table enum caveat).

---

## MCP-documented observations (not SDK-backed)

The following describe how ZIA reportedly behaves but are asserted ONLY in MCP tool docstrings or MCP client-side enforcement — not in either SDK. Treat as operator-observation / docs claims pending live-tenant confirmation, not source-backed product behavior. They are recorded here because they document real ZIA API quirks the SDKs do not surface.

### CAC atomic per-tuple validation (the headline observation — NOT in SDK source)

The Cloud App Control atomic-validation contract — each `(rule_type, application, action)` tuple validated individually, multi-app rules failing with code `INVALID_INPUT_ARGUMENT` / message `Invalid action provided for selected applications`, the whole create rejected (not per-app), with no read-only per-app validity enumerator and a safe pattern of one rule per app — is asserted only in the MCP tool docstrings. (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/cloud_app_control.py:12-30` module docstring, `:294-309` list_actions caveat, `:930-948` "one rule per app") It is confirmed ABSENT from the Cloud App Control SDK source: no `INVALID_INPUT_ARGUMENT` or `Invalid action provided` string exists in `vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py`, `vendor/zscaler-sdk-python/zscaler/zia/models/cloudappcontrol.py`, or `vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/`. (The `INVALID_INPUT_ARGUMENT` token does appear elsewhere in the Python ZIA SDK — `vendor/zscaler-sdk-python/zscaler/zia/pac_files.py:331` — but not in CAC code.) Confidence: medium / observation. The create call itself is the only authoritative validator exposed by the vendored sources.

### `availableActions` representative-app quirk

The `availableActions` endpoint reportedly only returns the action list when `cloud_apps` contains a "representative" app for the category; not every app qualifies. The documented example: `rule_type=SYSTEM_AND_DEVELOPMENT` with `cloud_apps=[AZURE_DEVOPS]` returns `[]` even though the category has 11 actions, but `cloud_apps=[GITHUB]` returns the full set. (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/cloud_app_control.py:311-318`) The MCP tool papers over this by probing other candidate apps (`cloud_app_control.py:202-222`) and falling back to a category probe (`:463-483`). The SDK has no such note. (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:34-91`) The specific count "11 actions" and the AZURE_DEVOPS/GITHUB example are unverified against source.

### `rule_type` vocabulary translation — catalog tokens rejected by the endpoint

The CAC/SSL-Inspection endpoints accept the canonical category enums (e.g. `WEBMAIL`, `STREAMING_MEDIA`), but the cloud-app catalog's own `parent` field uses different tokens (`WEB_MAIL`, `STREAMING`), and the endpoints reject the catalog-form tokens. Only two categories differ; all others map to themselves. `CUSTOM_CAPP` is also a valid category enum. (`vendor/zscaler-mcp-server/zscaler_mcp/common/zia_helpers.py:671-676` — `_PARENT_TO_APP_CLASS = {'STREAMING':'STREAMING_MEDIA','WEB_MAIL':'WEBMAIL'}`; `:761-778` — `canonical_app_class_for_parent` docstring: "the SSL Inspection / Cloud App Control APIs reject rule_type=STREAMING and only accept STREAMING_MEDIA"; category enum list incl `CUSTOM_CAPP` at `:681-699`) This is an MCP-helper concern, but it documents a real ZIA quirk: `rule_type=STREAMING` is rejected, `rule_type=STREAMING_MEDIA` is accepted.

### 31-char CAC rule-name limit — Python docstring + MCP enforcement only; absent from Go

The 31-character max on the CAC rule name is documented in the Python SDK docstrings ("Name of the rule, max 31 chars") (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:237`, `:436`, `:669`) and enforced client-side by the MCP tool, which cites the API error `Name exceeds the max length 31 characters` / `INVALID_INPUT_ARGUMENT`. (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/cloud_app_control.py:173` — `_CAC_NAME_MAX_LENGTH=31`; `:176-199` — raises with the API error message) The Go SDK does not mention the limit anywhere. The error-string form is a Python-docstring / MCP claim, not present in Go source.

### Per-category CAC action enum tables — Python docstring only, with likely copy-paste errors

The per-category action vocabulary (AI_ML, WEBMAIL, FILE_SHARE, STREAMING_MEDIA, etc.) is enumerated only in the Python SDK `add_rule`/`update_rule` docstrings (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:291-394`); the Go SDK has no equivalent list (it treats `Actions` as `[]string`). The Python list contains internal inconsistencies that look like copy-paste errors: `IT_SERVICES` lists `CAUTION_LEGAL_USE` (a LEGAL action under IT_SERVICES) (`cloudappcontrol.py:351-355`) and `LEGAL` lists `DENY_DNS_OVER_HTTPS_USE` (a DNS_OVER_HTTPS action under LEGAL) (`cloudappcontrol.py:356-360`). Treat the docstring tables as an unverified superset; the create call is the only authoritative validator.

### CAC rule order semantics — first-match-wins / shadowing (MCP docstring); `order` field corroborated by SDKs

The CAC policy table per `rule_type` is reportedly evaluated top-to-bottom, first-match-wins, with 1-based order (order=1 = top), so a more general rule above a specific rule shadows it. (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/cloud_app_control.py:76-84`) The SDKs corroborate that `order` exists as an int on the rule and "defaults to adding rule to bottom of list" when omitted (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:240`; Go `Order int json:"order"` at `vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:26`), but the first-match-wins / shadowing semantics themselves are MCP-docstring claims, not stated in SDK source.

---

## Open questions

- **No source enumerates per-app action validity.** The whole point of the CAC seed — which actions are individually valid for a given app — is genuinely not exposed by any read path in the vendored sources; `availableActions` returns a flat category-level `List[str]` only. (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:34`, `:84-91`) Needs live-tenant probing to resolve. (Tracked as `zia-49` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zia-49-cac-per-app-action-validity).)
- **CAC atomic-validation contract is observation-only.** The `INVALID_INPUT_ARGUMENT` / "Invalid action provided for selected applications" whole-create-rejection behavior and the one-rule-per-app safe pattern are in MCP docstrings only, confirmed absent from both SDKs. Confirm against a live tenant before treating as product behavior. (Tracked as `zia-53` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zia-53-cac-atomic-validation-contract-and-representative-app-action-quirk).)
- **Representative-app quirk specifics unverified.** The "11 actions" count and the AZURE_DEVOPS->[] vs GITHUB->full-set example are MCP-docstring claims (`cloud_app_control.py:311-318`), not in any SDK; unverified against source. (Tracked as `zia-53` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zia-53-cac-atomic-validation-contract-and-representative-app-action-quirk).)
- **Postman / oneapi-specs not consulted for ZIA in this pass.** A Postman cross-check would raise confidence on two divergences in particular: the `availableActions` `type` field and the 31-char CAC name limit. The ZPA divergences doc uses Postman as a third source; ZIA has no such cross-check yet. *(Methodology/coverage note, not a ZIA-behavior question — not registered.)*
- **Python `cloudAppRiskProfile` list-vs-single inconsistency not executed.** The model decodes a list (`models/cloudappcontrol.py:115-117`) but `request_format` calls `.request_format()` as a single object (`:220`). This is a code-shape observation; it was not run to confirm it actually raises at runtime. (Tracked as `zia-54` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zia-54-python-cloudappriskprofile-list-vs-single-shape).)
