---
product: zia
topic: "api-divergences"
title: "ZIA API source divergences"
content-type: reference
confidence: medium
last-verified: "2026-07-22"
verified-against:
  vendor/zscaler-sdk-go: 8a73a5fcf0bbb8507a47c09e9a6f379447ce3807
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
sources:
  - "vendor/zscaler-sdk-go/CHANGELOG.md"
  - "vendor/zscaler-sdk-go/zscaler/errorx/errors.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/v2_client.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/v2_config.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/common/common.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_custom_apps/endpoint_custom_apps.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/outbound_email_dlp/outbound_email_dlp.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/end_user_notification/end_user_notification.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/ips_control_policies/ips_signature_rules/ips_signature_rules.go"
  - "vendor/zscaler-sdk-python/pyproject.toml"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/end_user_notification.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/end_user_notification_templates.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/endpoint_applications.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/endpoint_custom_apps.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/outbound_email_dlp_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/ips_categories.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/nss_collectors.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_dns_rules.py"
  - "vendor/zscaler-sdk-python/tests/integration/zia/cassettes/TestCloudFirewallDNSRules.yaml"
  - "vendor/zscaler-sdk-python/zscaler/zia/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/zia_service.py"
  - "vendor/terraform-provider-zia/CHANGELOG.md"
  - "vendor/terraform-provider-zia/zia/data_source_zia_ips_categories.go"
  - "vendor/terraform-provider-zia/zia/data_source_zia_ueba_alert_definitions.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_firewall_dns_rules.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_ueba_alert_definitions.go"
  - "vendor/ziacloud-ansible/plugins/modules/zia_cloud_firewall_dns_rules.py"
  - "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/zia-divergences.md"
  - "vendor/zscaler-api-specs/automate-zscaler/zia-divergences.json"
  - "vendor/zscaler-api-specs/automate-zscaler/rosetta.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/cloudappcontrol.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol_test.go"
  - "vendor/zscaler-sdk-python/zscaler/zia/url_filtering.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/url_categories.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/url_filter_cloud_app_settings.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/url_filtering_rules.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go"
  - "vendor/zscaler-sdk-python/zscaler/helpers.py"
  - "vendor/zscaler-sdk-python/zscaler/utils.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/common/zia_helpers.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_app_control.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/url_categories.py"
  - "vendor/zscaler-mcp-server/skills/zia/create-cloud-app-control-rule/SKILL.md"
  - "vendor/zscaler-mcp-server/tests/test_url_categories_tools.py"
  - "vendor/zscaler-help/Configuring_Advanced_Policy_Settings.txt"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/ssl_inspection_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/authentication_settings.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/auth_settings/auth_settings.go"
  - "vendor/zscaler-help/legacy-authentication-settings.md"
  - "vendor/zscaler-mcp-server/skills/zia/create-ssl-inspection-rule/SKILL.md"
  - "vendor/zscaler-mcp-server/skills/zia/look-up-rule-targets/SKILL.md"
author-status: draft
---

# ZIA API source divergences

The captured Automate operation contract, Go SDK, Python SDK, Terraform provider, Ansible collection, and MCP tools are independent views of the same ZIA management API, produced separately and updated at different cadences. Where they agree, confidence is high. Where they diverge, an engineer needs to know which source to trust before writing code — and the answer changes by field, endpoint, and resource type.

A third signal here is the Zscaler MCP server's ZIA tools and workflow skills. Workflow notes can carry API error strings and behavioral observations that are not reproducible from SDK source; executable tools separately show which constraints are actually enforced client-side. Claims found only in the MCP workflow layer are flagged as observations pending live-tenant confirmation.

This historical prose pass began with Cloud App Control (CAC), URL Filtering, SSL Inspection, and Authentication Settings. DAV-21/DAV-23 added the generated contract reconciliation and rosetta table across the Terraform-managed ZIA surface; use that generated layer for field-level required/readonly/enum coverage and use the narrative sections below for the human-readable explanations of high-value divergences.

**Quick trust hierarchy (applies unless an entry below overrides it):**

- For wire shape: trust the SDK source you're actually calling. Where the two SDKs disagree on a request body, check the Go SDK's json struct tags: fields carry `,omitempty` (e.g. the CAC `WebApplicationRules` struct, `vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:18-32`), so a zero-valued field is dropped from the serialized body — meaning the field one SDK omits is optional on the wire, and the other SDK proves the call round-trips without it.
- The CAC `availableActions` endpoint returns a flat `List[str]` of category-level actions; neither SDK exposes per-app action validity.
- MCP docstring claims about API error codes and behavioral quirks are observations pending live-tenant confirmation, not SDK-backed facts.

**Contract reconciliation now feeds this doc.** For documented method/path and field metadata (`required`, `readonly`, `enum`), the verification protocol prefers the captured Automate contract when it exists; Terraform validators remain authoritative only for what the provider accepts, SDKs for wrapper behavior, and Postman for examples/fallback evidence (`references/_meta/verification-protocol.md:114-118`). The generated ZIA reconciliation diffs `vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json` against Go, Python, Terraform, Ansible, and MCP surfaces (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.md:7-11`). Its current totals are 0 contract-vs-Go primitive type drifts, 47 contract-vs-Terraform required-flag drifts, 11 enum value conflicts, 37 one-sided enum constraints, and 9 readonly fields with no Terraform disagreement (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.md:13-18`).

Use the rosetta table as the field-level index when a section below summarizes a resource rather than spelling out every field. It defines the `req`, `enum≠`, `enum1`, `ro`, `ro!`, and `type` markers (`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:11-20`) and begins the ZIA resource table at `admin_role` (`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:509-518`). The generated ZIA report also records captured contract groups that are outside Terraform's managed-resource scope, such as `api-authentication`, `event-logs`, `pac-files`, `service-edges`, `time`, and `time-intervals`; those are coverage boundaries, not missing Terraform mappings (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.md:30-47`).

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

**Significance / which to trust:** Action vocabulary is surfaced at the CATEGORY level (the path segment `rule_type`), not per-app. The apps in the body act only as a filter. The endpoint does not return per-app action validity — there is no read path that enumerates which actions are valid for a single given app. The Automate contract now supplies the captured category-level action vocabulary for the rule body: `actions` is a contract-only enum on `POST /zia/api/v1/webApplicationRules/:rule_type`, with examples spanning AI/ML actions through webmail actions (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.json:2134-2137`, `:2174-2186`, `:2356-2362`).

---

### Rule-state field — wire field is always `state` (ENABLED/DISABLED); `enabled` is a Python-only kwarg

**What each source says:**

- **Python SDK:** on CREATE it pops `enabled` and rewrites it to `body['state'] = 'ENABLED'/'DISABLED'` before sending (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:404-405`); same transform on UPDATE (`cloudappcontrol.py:603-604`). The read model exposes the field as `state` (no `enabled` on the way back). (`vendor/zscaler-sdk-python/zscaler/zia/models/cloudappcontrol.py:51`)
- **Go SDK:** has no `enabled` concept. The struct field is `State string json:"state,omitempty"` (`vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:24`); the Go test sets `State:"ENABLED"` directly (`cloudappcontrol_test.go:60`).

**Significance / which to trust:** The wire field is always `state` with the string enum `ENABLED`/`DISABLED`. `enabled` is a Python-SDK convenience kwarg only; Go callers set `State` directly.

---

### Apps-list kwarg — wire/SDK name is `applications`; MCP v0.15.0 does not map `cloud_applications`

**What each source says:**

- **Python SDK:** `add_rule`/`update_rule` document the apps list as `applications` (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:244`) and pass kwargs straight through as the body (`cloudappcontrol.py:401`).
- **Go SDK:** the struct field is `Applications []string json:"applications,omitempty"`. (`vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go:31`)
- **Shared Python id-transform list:** `reformat_params` carries only `('application_ids','applications')`, with no plain `'applications'` entry. (`vendor/zscaler-sdk-python/zscaler/utils.py:96`)
- **MCP v0.15.0 implementation:** the create/update models expose an `advanced` passthrough whose description names both `applications` and `cloud_apps`; the create path passes that dictionary to the common rule-payload builder without a `cloud_applications` rename (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_app_control.py:36-40`, `:66-100`, `:175-192`). The workflow skill still says `cloud_applications` maps internally to the SDK's `applications` kwarg (`vendor/zscaler-mcp-server/skills/zia/create-cloud-app-control-rule/SKILL.md:256`), so the skill and executable tool are out of sync.

**Significance / which to trust:** The wire/SDK kwarg is `applications`. In MCP v0.15.0, use the executable tool's current `advanced` surface rather than relying on the workflow skill's stale `cloud_applications` mapping claim. Because plain `applications` is not in the `reformat_params` id-transform list, the apps list is sent as raw enum strings, not coerced into `{id}` objects.

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

- **Go SDK:** documents and works around a live ZIA bug — GET-by-ID does NOT return the `cbiProfile` object for ISOLATE rules even though GET-all does. `Get()` falls back to `GetAll()` to repopulate it when `Action=='ISOLATE' && CBIProfile==nil && CBIProfileID!=0`. (`vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go:259-273`) Go carries dual fields `CBIProfile` + `CBIProfileID json:"cbiProfileId"`, with a comment noting `cbiProfile` is required for ISOLATE and not applicable to other actions. (`urlfilteringpolicies.go:137-140`)
- **Python SDK:** `get_rule` does a plain GET with no such fallback. (`vendor/zscaler-sdk-python/zscaler/zia/url_filtering.py:114-148`) The Python `URLFilteringRule` model has no `cbi_profile_id` field at all — only `cbi_profile`. (`vendor/zscaler-sdk-python/zscaler/zia/models/url_filtering_rules.py:119-125`, `:222`)

**Significance / which to trust:** High impact for ISOLATE rules. Python ISOLATE-rule reads via GET-by-ID can silently come back with an empty `cbiProfile`. Use the Go SDK's GET-all-fallback pattern (or read from GET-all directly) when you need the `cbiProfile` populated for an ISOLATE rule.

### HTTP-header profile bindings — Python and Go now converge

The current Python and Go SDKs both expose `httpHeaderProfiles` and `httpHeaderActionProfiles` on URL Filtering rules. Python accepts the convenience arguments `http_header_profile_ids` and `http_header_action_profile_ids` on create/update, reshapes their ID lists to the wire fields, and round-trips the resulting name/ID objects in its rule model (`vendor/zscaler-sdk-python/zscaler/zia/url_filtering.py:205-215`, `:325-334`; `vendor/zscaler-sdk-python/zscaler/utils.py:92-93`; `vendor/zscaler-sdk-python/zscaler/zia/models/url_filtering_rules.py:111-116`, `:230-231`). Go exposes the same two wire fields as optional `IDNameExtensions` lists (`vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go:131-138`).

**Significance / which to trust:** This is a resolved coverage gap, not a live divergence. New automation can bind HTTP-header match and action profiles through either SDK; callers should still use each SDK's native input shape (Python ID-list kwargs versus Go struct fields).

### Advanced URL/cloud-app settings have asymmetric SDK models and update semantics

Go v3.8.45 deliberately removed `omitempty` from the booleans in
`URLAdvancedPolicySettings` so an explicit `false` reaches the service. The only
exceptions are deprecated `blockSkype`, which the service rejects when present,
and the `safeSearchApps` list, which the service locks while SafeSearch is
disabled (`vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go:149-255`).
`UpdateUrlAndAppSettings` passes that entire struct directly to PUT
(`vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go:351-376`).
This makes the Go operation a full-state update in practice: a sparse
zero-valued struct explicitly disables every other modeled boolean. Use a
GET-modify-PUT pattern.

Python v1.9.41 takes the opposite request-shape approach. Its update method
passes caller kwargs through the common request executor, whose normal path
camel-cases dictionary keys (`vendor/zscaler-sdk-python/zscaler/zia/url_filtering.py:471-549`;
`vendor/zscaler-sdk-python/zscaler/request_executor.py:370-415`). That permits a
sparse body and accepts exact camel-cased wire keys beyond the typed response
model. Do not assume every inferred snake-case spelling is equivalent: the
generic converter maps `enable_mistral_ai_prompt` to `enableMistralAiPrompt`,
not the service field `enableMistralAIPrompt`; the exact wire-case key passes
through unchanged (`vendor/zscaler-sdk-python/zscaler/helpers.py:326-342`). The
response model itself reads and emits only eight of the 14 current prompt flags:
ChatGPT, Microsoft Copilot, Gemini, Poe, Meta AI, Perplexity, Google AI, and
QuillBot (`vendor/zscaler-sdk-python/zscaler/zia/models/url_filter_cloud_app_settings.py:36-66,92-120`).
It omits DeepSeek, WRITER, Grok, Mistral, Claude, and Grammarly even though the
current Help and Go model enumerate all 14
(`vendor/zscaler-help/Configuring_Advanced_Policy_Settings.txt:238-269`;
`vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go:187-221,251-255`).

**Significance / which to trust:** Go gives the more complete typed read model
but requires full-state care on update. Python can send additional fields via
exact wire keys, but not every snake-case inference is safe, and a subsequent
typed read silently lacks six prompt flags. Do not use the Python model alone
to inventory prompt-capture posture.

### MCP v0.15 URL-category listing fixes false pagination but exposes a contract conflict

MCP v0.15.0 replaces the former `page` / `page_size` inputs with `custom_only`,
`type`, and `search`. It forwards `custom_only` and `type` for upstream
filtering and passes `search` for the Python SDK's local name filtering; an
unfiltered call still returns the entire matching collection
(`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/url_categories.py:44-97`;
`:220-277`). This aligns with the captured Automate operation in one important
respect: `/urlCategories` has no pagination parameters, so page-shaped inputs
were false affordances rather than a way to cap the response
(`vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:426535-426566`).

Python v1.9.40 also adds a dedicated `list_categories_lite()` wrapper for
`GET /urlCategories/lite` (`vendor/zscaler-sdk-python/CHANGELOG.md:21-30`;
`vendor/zscaler-sdk-python/zscaler/zia/url_categories.py:107-162`). MCP v0.15
still calls the full `list_categories()` method rather than that lightweight
route (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/url_categories.py:274`).
That is a payload-efficiency gap, not an operation or entitlement claim.

The sources still disagree on response trimming. Automate advertises
`includeOnlyUrlKeywordCounts=true` and says it replaces custom-category URL and
keyword lists with counts, while MCP deliberately omits the parameter after a
vendor-reported tenant capture returned equivalent populated lists with it on
and off. Conversely, MCP sends a `type` filter that the captured Automate
operation does not enumerate
(`vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:426550-426566`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/url_categories.py:44-64`;
`vendor/zscaler-mcp-server/tests/test_url_categories_tools.py:58-81`). Treat the
count-only failure as the scope of that observation, not proof that every ZIA
tenant ignores the documented parameter.

**Operational consequence:** use `custom_only` or `type` before the request and
a JMESPath projection after it; neither mechanism imposes a row limit. Use
`zia_url_lookup` for “which category contains this URL?” and
`zia_get_url_category` for one category rather than downloading the inventory
(`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/url_categories.py:228-277`).

---

## SSL Inspection

### `timeWindows` — SDK model exposes the field, but the API does NOT support time-of-day scheduling for SSL Inspection

**What each source says:**

- **Python SDK model:** the `SSLInspectionRules` model both deserializes and serializes a `timeWindows` field — `self.time_windows` is populated from `config["timeWindows"]` (`vendor/zscaler-sdk-python/zscaler/zia/models/ssl_inspection_rules.py:121-122`) and emitted back as `"timeWindows": self.time_windows` in the request body (`vendor/zscaler-sdk-python/zscaler/zia/models/ssl_inspection_rules.py:207`). A caller can therefore set the field and the request will round-trip without error.
- **MCP workflow skills (API-behavior claim):** the create-ssl-inspection-rule skill says the rule type does not support a recurring schedule and has no `time_windows` API field (`vendor/zscaler-mcp-server/skills/zia/create-ssl-inspection-rule/SKILL.md:23,62-70,198`). The look-up-rule-targets skill likewise excludes SSL Inspection from `time_windows` coverage (`vendor/zscaler-mcp-server/skills/zia/look-up-rule-targets/SKILL.md:45-57,109-125`).

**Significance / which to trust:** This is an SDK-model-vs-workflow divergence. The Python model proves only that `timeWindows` can be serialized; the MCP workflow skills say SSL Inspection does not support the field and direct scheduled enforcement to Cloud Firewall Filtering or URL Filtering (`vendor/zscaler-mcp-server/skills/zia/create-ssl-inspection-rule/SKILL.md:62-70`). Do not treat the SDK model surface alone as proof that scheduling works. The API-behavior side is a workflow-skill observation, not a second SDK or an executable-tool validator, so live-tenant confirmation remains appropriate. Cross-reference: `references/zia/time-intervals.md`.

---

## Authentication Settings

### `passwordStrength` / `passwordExpiry` enums — Python SDK docstring tokens disagree with the API

**What each source says:**

- **API (help capture):** the `AuthSettings` model defines `passwordStrength` as enum `NONE` / `LOW` / `HIGH` and `passwordExpiry` as enum `NEVER` / `MONTHLY` / `QUARTERLY` / `SEMIANNUALLY` (`vendor/zscaler-help/legacy-authentication-settings.md:23-24`). The GET example value echoes `"passwordStrength": "NONE"` / `"passwordExpiry": "NEVER"` (`:36`).
- **Python SDK docstring:** the `update_authentication_settings` method documents *different* tokens — `password_strength` "Supported values: NONE, MEDIUM, STRONG" and `password_expiry` "Supported values: NEVER, ONE_MONTH, THREE_MONTHS, SIX_MONTHS" (`vendor/zscaler-sdk-python/zscaler/zia/authentication_settings.py:242-245`). The Python model itself stores the value as an opaque string and does not validate against any enum (`vendor/zscaler-sdk-python/zscaler/zia/models/authentication_settings.py:44-45`), so the docstring is the only place these tokens appear.
- **Go SDK:** the `AuthenticationSettings` struct types both fields as plain `string` with no enum constants, so it does not arbitrate the token set (`vendor/zscaler-sdk-go/zscaler/zia/services/auth_settings/auth_settings.go:39-42`).

**Significance / which to trust:** Trust the API enums (`NONE`/`LOW`/`HIGH`, `NEVER`/`MONTHLY`/`QUARTERLY`/`SEMIANNUALLY`). The Python docstring tokens appear to be wrong — they are not produced by the model, are not echoed in the API example value, and have no corroborating source. A caller who copies `MEDIUM`/`STRONG` or `ONE_MONTH` from the SDK docstring into a `PUT /authSettings` body risks a rejected or silently-ignored value. This is a docstring-vs-API divergence (the SDK's *runtime* behavior is fine, since neither SDK validates the string); only the human-facing docstring is misleading. Cross-reference: `references/zia/ad-integration.md` (AuthSettings field table enum caveat).

---

## July 2026 Endpoint DLP and adjacent surface drift

### Python v1.9.39 closes the former service-coverage gap

Python v1.9.39 introduced unified-client services for DNS application groups,
Endpoint DLP applications/custom apps/application groups/resources/resource
groups/rules/sub-rules, Outbound Email DLP, the five EUN/user-confirmation
template or status reads, Web DLP globals, IPS categories, and NSS collectors;
the current unified service still registers them
(`vendor/zscaler-sdk-python/CHANGELOG.md:32-113`;
`vendor/zscaler-sdk-python/zscaler/zia/zia_service.py:841-943`;
`vendor/zscaler-sdk-python/zscaler/zia/end_user_notification_templates.py:39-291`). The former
Python-v1.9.38-versus-Go coverage divergence is therefore resolved at the SDK
surface level. Python's new endpoint-application list methods still return only
the current response page rather than reproducing Go's automatic aggregation
(`vendor/zscaler-sdk-python/zscaler/zia/endpoint_applications.py:79-106,150-177`;
`vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_applications/endpoint_applications.go:145-178`). SDK presence remains a code-surface observation, not proof that an endpoint is entitled or rolled out in a tenant (`vendor/zscaler-sdk-go/CHANGELOG.md:77-84`).

### Python custom-app create/update decode the wrong model

Python custom-app list/get return `EndpointApplicationsCustomApps`, but
`add_custom_app` and `update_custom_app` declare and construct
`DlpEndpointResource` for their responses
(`vendor/zscaler-sdk-python/zscaler/zia/endpoint_custom_apps.py:38-147,149-274`).
This is an SDK response-model divergence: it must not be interpreted as product
behavior or as evidence that the custom-application endpoint returns the
Endpoint DLP resource wire schema.

### Unified and legacy Python clients expose different portions of the batch

All of the new services are live properties on unified `ZIAService`
(`vendor/zscaler-sdk-python/zscaler/zia/zia_service.py:841-943`). Of this batch,
the legacy helper exposes only `web_dlp_global_options`
(`vendor/zscaler-sdk-python/zscaler/zia/legacy.py:786-792`). Code using the
legacy client therefore cannot infer service availability from the unified
client's catalog.

### Release-note inventories remain incomplete

The Go changelog labels `GET`/`PUT /webDlpGlobalOptions` as new, lists only the Outbound Email actions CSV operation even though code includes list/lite/get/CRUD, and does not list `/ipsCategories` (`vendor/zscaler-sdk-go/CHANGELOG.md:82-86,123-138`; `vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/outbound_email_dlp/outbound_email_dlp.go:57-160`; `vendor/zscaler-sdk-go/zscaler/zia/services/ips_control_policies/ips_signature_rules/ips_signature_rules.go:307-313`). Python 1.9.39 likewise lists only `/emailDlpRules/actions` for Outbound Email DLP and omits the IPS-category and NSS-collector reads even though the service code exposes the full surfaces (`vendor/zscaler-sdk-python/CHANGELOG.md:32-113`; `vendor/zscaler-sdk-python/zscaler/zia/outbound_email_dlp_rules.py:37-456`; `vendor/zscaler-sdk-python/zscaler/zia/ips_categories.py:37-103`; `vendor/zscaler-sdk-python/zscaler/zia/nss_collectors.py:37-92`). Release-note enumeration is therefore not a complete endpoint inventory for either pin.

The shared Go `EndPointApplications` model serializes requests as only `resourceId` and `zappId`, although its response model exposes descriptive/version fields (`vendor/zscaler-sdk-go/zscaler/zia/services/common/common.go:131-163`). It also models `versions` as one `Versions` struct, whereas the custom-app response uses `[]Versions` for the same wire key (`vendor/zscaler-sdk-go/zscaler/zia/services/common/common.go:132-146`; `vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_custom_apps/endpoint_custom_apps.go:19-35`).

The generated reconciliation boundary confirms that the current Automate capture does not enumerate the new Endpoint DLP, Outbound Email DLP, DNS application-group, or EUN-template endpoint families, so these remain SDK/provider-surface observations; SDK presence must not be promoted into an entitlement or rollout claim (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.md:32-46`; `vendor/zscaler-sdk-go/CHANGELOG.md:77-84`).

---

## Firewall DNS and Terraform ZIA 4.8.1-4.8.3

### Web-EUN wire spelling is still client-dependent

Go v3.8.44 corrected the firewall-DNS field to `IsWebEUNEnabled` with wire key
`isWebEUNEnabled`, but `omitempty` still removes an explicit `false` from the
serialized request (`vendor/zscaler-sdk-go/CHANGELOG.md:20-27`;
`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:151-160`).
Current Python v1.9.41 still parses and emits `isWebEunEnabled`; its request formatter
uses that exact spelling even though recorded integration responses contain the
uppercase-`EUN` form (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_dns_rules.py:57-58,240-264`;
`vendor/zscaler-sdk-python/tests/integration/zia/cassettes/TestCloudFirewallDNSRules.yaml:26,104,186`).
ZIA Ansible passes `is_web_eun_enabled` into the Python SDK's create/update
methods and therefore inherits Python's wire spelling
(`vendor/ziacloud-ansible/plugins/modules/zia_cloud_firewall_dns_rules.py:620-663,670-710`).

Terraform provider v4.8.2 upgraded to Go v3.8.44 specifically for the corrected
key, and its `is_web_eun_enabled` attribute expands into the corrected Go model
field (`vendor/terraform-provider-zia/CHANGELOG.md:14-24`;
`vendor/terraform-provider-zia/zia/resource_zia_firewall_dns_rules.go:169-177,713-729`).
This closes the provider misspelling, not the cross-client divergence. Whether
Go's omitted `false` preserves or clears a prior true value remains unverified.

### DNS category equality is no longer a provider-side precondition

Provider v4.8.2 removed the local rule that forced `dest_ip_categories` and
`res_categories` to contain equal sets. The old create/update calls are now
commented out and expansion sends the collections independently
(`vendor/terraform-provider-zia/CHANGELOG.md:21-24`;
`vendor/terraform-provider-zia/zia/resource_zia_firewall_dns_rules.go:298-309,559-577,713-735`).
The schema description still says the sets must match
(`vendor/terraform-provider-zia/zia/resource_zia_firewall_dns_rules.go:155-157`),
so this proves only that the provider stopped rejecting unequal values; it does
not establish universal backend or tenant acceptance.

### New provider coverage is not an entitlement claim

Provider v4.8.3 adds `zia_ips_categories`. It fetches the built-in collection,
selects one entry by integer ID or case-insensitive name, or returns the full
collection when neither selector is supplied
(`vendor/terraform-provider-zia/CHANGELOG.md:3-12`;
`vendor/terraform-provider-zia/zia/data_source_zia_ips_categories.go:14-93,96-180`).
Provider v4.8.1 adds a UEBA alert-definition resource and data source. The
resource validates supported alert names and enums and imports by numeric ID or
name; the data source requires an ID or an exact, case-sensitive alert name
(`vendor/terraform-provider-zia/CHANGELOG.md:26-37`;
`vendor/terraform-provider-zia/zia/resource_zia_ueba_alert_definitions.go:17-32,34-118`;
`vendor/terraform-provider-zia/zia/data_source_zia_ueba_alert_definitions.go:14-93,95-155`).
These additions establish provider surface, not entitlement or rollout in every
tenant.

---

## Go v3.8.43 transport behavior is SDK-local

The legacy Go ZIA client's default retry count is now 10 rather than 100
(`vendor/zscaler-sdk-go/zscaler/zia/v2_config.go:28-34`). For 5xx responses,
its retry callback delegates to the shared SDK heuristic
(`vendor/zscaler-sdk-go/zscaler/zia/v2_client.go:527-560`): 501 is not retried,
502/503/504 are always retried, and another 5xx is stopped only when its raw
body contains none of the four exact transient strings and parses to a JSON
object with a top-level nonempty string `code`
(`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:279-364`). That rule describes
the Go wrapper's retry choice; it must not be presented as a ZIA server error
taxonomy.

The client also returns the last HTTP response when its retry budget is
exhausted without a transport error, then routes normal non-success responses
through `CheckErrorInResponse`
(`vendor/zscaler-sdk-go/zscaler/zia/v2_client.go:398-420,785-799`). The resulting
`ErrorResponse` retains the HTTP response and parsed status/code/message/ID/
reason/exception plus raw body text, but the parser consumes and closes the
original body (`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:13-28,57-110`).
This structured path is not a promise that transport, timeout, authentication,
or every other client failure has the same shape.

---

## MCP workflow observations (not SDK-backed)

The following describe how ZIA reportedly behaves but are asserted in MCP workflow skills rather than either SDK. Treat them as workflow/API observations pending live-tenant confirmation. Where the v0.15.0 executable tool no longer enforces or implements the workflow claim, that drift is called out explicitly.

### CAC atomic per-tuple validation (the headline observation — NOT in SDK source)

The Cloud App Control create workflow says each `(rule_type, application, action)` tuple is validated individually, a mixed-validity multi-app create fails as a whole with `INVALID_INPUT_ARGUMENT` / `Invalid action provided for selected applications`, and one rule per app is the safe pattern (`vendor/zscaler-mcp-server/skills/zia/create-cloud-app-control-rule/SKILL.md:44-73,163,268-274`). This contract is a workflow-skill observation, not validation implemented by the v0.15.0 tool: the executable create path builds the supplied payload and calls the SDK directly (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_app_control.py:175-192`). It is also absent from the Cloud App Control SDK source. Confidence: medium / observation; the create call remains the authoritative validator.

### `availableActions` representative-app quirk

The create workflow says action discovery may be surfaced through a category "representative" app and that `actions_surfaced_via` can differ from the originally resolved app (`vendor/zscaler-mcp-server/skills/zia/create-cloud-app-control-rule/SKILL.md:150-163`). MCP v0.15.0's executable tool does not implement probing; it forwards `rule_type` and the optional `cloud_apps` list directly to the SDK (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_app_control.py:120-133`). The former AZURE_DEVOPS/GITHUB example, "11 actions" count, and probing algorithm have no current equivalent and are not retained as current behavior.

### 31-char CAC rule-name limit — Python docstring + MCP enforcement only; absent from Go

The 31-character max on the CAC rule name is documented in the Python SDK docstrings ("Name of the rule, max 31 chars") (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:237`, `:436`, `:669`) and repeated by the MCP create workflow with the API error `Name exceeds the max length 31 characters` / `INVALID_INPUT_ARGUMENT` (`vendor/zscaler-mcp-server/skills/zia/create-cloud-app-control-rule/SKILL.md:33,108,257-265`). MCP v0.15.0 does **not** enforce the limit client-side: `name` is an unconstrained string and the create path forwards it (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_app_control.py:66-68`, `:175-192`). The Go SDK does not mention the limit. Treat the error string as a workflow/API observation, not as behavior guaranteed by the current MCP client.

### Per-category CAC action enum tables — Python docstring only, with likely copy-paste errors

The per-category action vocabulary (AI_ML, WEBMAIL, FILE_SHARE, STREAMING_MEDIA, etc.) is enumerated only in the Python SDK `add_rule`/`update_rule` docstrings (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:291-394`); the Go SDK has no equivalent list (it treats `Actions` as `[]string`). The Python list contains internal inconsistencies that look like copy-paste errors: `IT_SERVICES` lists `CAUTION_LEGAL_USE` (a LEGAL action under IT_SERVICES) (`cloudappcontrol.py:351-355`) and `LEGAL` lists `DENY_DNS_OVER_HTTPS_USE` (a DNS_OVER_HTTPS action under LEGAL) (`cloudappcontrol.py:356-360`). Treat the docstring tables as an unverified superset; the create call is the only authoritative validator.

### CAC rule order semantics — first-match-wins / shadowing (MCP docstring); `order` field corroborated by SDKs

The CAC workflow says the table is evaluated top-to-bottom, first-match-wins, and that a general rule above a specific rule shadows it (`vendor/zscaler-mcp-server/skills/zia/create-cloud-app-control-rule/SKILL.md:185-213`). MCP v0.15.0 corroborates only the numeric ordering surface: the create input describes lower values as earlier (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_app_control.py:78-80`), and the common helper defines 1-based order with lower values evaluated first and defaults create to 1 (`vendor/zscaler-mcp-server/src/zscaler_mcp/common/zia_helpers.py:70-94`). The SDKs also carry the `order` field, but first-match and shadowing remain workflow-skill claims rather than executable validation.

---

## Open questions

- **No source enumerates per-app action validity.** The CAC action vocabulary is now captured at the contract/category level (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.json:2174-2186`, `:2356-2362`), but which actions are individually valid for a given app is genuinely not exposed by any read path in the vendored sources; `availableActions` returns a flat category-level `List[str]` only (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:34`, `:84-91`). Needs live-tenant probing to resolve. (Tracked as `zia-49` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zia-49-cac-per-app-action-validity).)
- **CAC atomic-validation contract is observation-only.** The `INVALID_INPUT_ARGUMENT` / "Invalid action provided for selected applications" whole-create-rejection behavior and the one-rule-per-app pattern are in the MCP workflow skill, not the v0.15.0 executable validator, and are absent from both SDKs. Confirm against a live tenant before treating them as product behavior. (Tracked as `zia-53` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zia-53-cac-atomic-validation-contract-and-representative-app-action-quirk).)
- **Representative-app behavior is generic and workflow-only.** The current workflow skill mentions representative-app surfacing generically, while the executable tool forwards the requested apps without probing. Specific app examples and action counts have no current MCP equivalent. (Tracked as `zia-53` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zia-53-cac-atomic-validation-contract-and-representative-app-action-quirk).)
- **Postman / oneapi-specs not consulted for ZIA in this pass.** A Postman cross-check would raise confidence on two divergences in particular: the `availableActions` `type` field and the 31-char CAC name limit. The ZPA divergences doc uses Postman as a third source; ZIA has no such cross-check yet. *(Methodology/coverage note, not a ZIA-behavior question — not registered.)*
- **Python `cloudAppRiskProfile` list-vs-single inconsistency not executed.** The model decodes a list (`models/cloudappcontrol.py:115-117`) but `request_format` calls `.request_format()` as a single object (`:220`). This is a code-shape observation; it was not run to confirm it actually raises at runtime. (Tracked as `zia-54` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zia-54-python-cloudappriskprofile-list-vs-single-shape).)
