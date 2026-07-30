---
product: zia
topic: "zia-dlp"
title: "ZIA Data Loss Prevention — dictionaries, engines, policy rules"
content-type: reasoning
last-verified: "2026-07-22"
confidence: high
source-tier: mixed
sources:
  - "https://help.zscaler.com/zia/about-dlp-engines"
  - "vendor/zscaler-help/about-dlp-engines.md"
  - "https://help.zscaler.com/zia/about-dlp-dictionaries"
  - "vendor/zscaler-help/about-dlp-dictionaries.md"
  - "https://help.zscaler.com/zia/configuring-dlp-policy-rules-content-inspection"
  - "vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md"
  - "https://help.zscaler.com/zia/understanding-predefined-dlp-dictionaries"
  - "vendor/zscaler-help/understanding-predefined-dlp-dictionaries.md"
  - "vendor/zscaler-help/Understanding_Policy_Enforcement.txt"
  - "vendor/zscaler-api-specs/automate-zscaler/observed-contract-overlays.md"
  - "vendor/zscaler-api-specs/automate-zscaler/observed-contract-overlays.json"
  - "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json"
  - "vendor/zscaler-sdk-go/CHANGELOG.md"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlp_web_rules/dlp_web_rules.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/common/common.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_applications/endpoint_applications.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_custom_apps/endpoint_custom_apps.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_application_groups/endpoint_application_groups.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_resource/endpoint_resource.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_resource_channel/endpoint_resource_channel.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_resource_group/endpoint_resource_group.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_dlp_rules/endpoint_dlp_rules.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_dlp_sub_rules/endpoint_dlp_sub_rules.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/outbound_email_dlp/outbound_email_dlp.go"
  - "vendor/terraform-provider-zia/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/dlp_web_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/dlp_web_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/dlp_dictionary.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/dlp_engine.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/dlp_resources.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/dlp_templates.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/cloud_to_cloud_ir.py"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/dlp_endpoint_resource.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/endpoint_dlp_resource_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/endpoint_dlp_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/endpoint_dlp_sub_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/endpoint_applications.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/endpoint_custom_apps.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/endpoint_application_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/outbound_email_dlp_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/web_dlp_global_options.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/zia_service.py"
author-status: draft
---

# ZIA Data Loss Prevention (DLP)

Detects sensitive data in user traffic and decides whether to allow, block, or forward the event for downstream handling. The detection engine for Data Protection across ZIA — consumed by URL Filtering / Cloud App Control (as a pipeline gate) and by Workflow Automation (as the incident source).

## Summary

Source: `vendor/zscaler-help/about-dlp-dictionaries.md`; `vendor/zscaler-help/about-dlp-engines.md`; `vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md`; `vendor/zscaler-help/Understanding_Policy_Enforcement.txt`.

Three-layer object model:

1. **DLP Dictionaries** — detection primitives. Predefined (credit card numbers, SSNs, HIPAA, etc.) or custom (operator-defined patterns, phrases, Microsoft Information Protection labels, exact data matching).
2. **DLP Engines** — collections of one or more dictionaries with Boolean operators (AND / OR / NOT). The reusable detection units.
3. **DLP Policy Rules** — reference **engines**, not dictionaries directly. Rules define who, when, what action when an engine triggers.

**Critical constraint**: DLP policy rules reference engines, never dictionaries directly. An operator asking "can I write a DLP rule that matches my custom dictionary X?" — they have to wrap X in an engine first. Creates a one-level indirection that's easy to forget.

**SSL decrypt dependency** (recurring theme — see [`./ssl-inspection.md § SSL bypass is a cross-policy gate`](./ssl-inspection.md)): DLP engines need decrypted content to inspect. Without SSL Inspection decrypting the traffic, DLP sees nothing. The single most common "DLP didn't fire" cause is an SSL Inspection bypass upstream.

**Downstream: ZWA.** DLP incidents flow into Workflow Automation for triage + automated remediation. See [`../zwa/overview.md`](../zwa/overview.md) for the incident lifecycle.

## Mechanics

### DLP Dictionaries

Source: `vendor/zscaler-help/about-dlp-dictionaries.md`; `vendor/zscaler-help/understanding-predefined-dlp-dictionaries.md`.

From *About DLP Dictionaries*:

> A DLP dictionary contains a set of patented algorithms that are designed to detect specific kinds of information in your users' traffic and activities.

Three categories:

**Predefined dictionaries** — Zscaler ships hundreds of these covering: credit cards, SSNs, passport numbers, bank account numbers, HIPAA data, GDPR categories, financial terms, medical terms, source code signatures, API keys, and MANY more. The *Understanding Predefined DLP Dictionaries* article enumerates all of them; as of capture the list is large (~170K char article). Can be **edited** (some) or **cloned** (most).

**Custom dictionaries** — operator-defined for tenant-specific data. Four composition methods:

- **Patterns** — regex-style patterns matching format-specific strings (account numbers, internal ID formats, etc.).
- **Phrases** — literal string matches for tenant-specific terminology, project code names, legal document markers.
- **MIP (Microsoft Information Protection) labels** — match files with specific MIP classification labels applied. Cross-product with Microsoft 365 classification.
- **Exact Data Matching (EDM)** — matches against a specific data set (an uploaded list of customer records, employee PII, etc.). Stronger than pattern matching because false-positive rate is near-zero.

**Confidence Score Threshold** — each dictionary has a threshold that governs what counts as a violation vs noise. Tunable per-dictionary; conservative for high-signal patterns (credit cards → low threshold = many matches), strict for fuzzy patterns (medical terms → high threshold = only confident matches).

### DLP Engines

Source: `vendor/zscaler-help/about-dlp-engines.md`; `vendor/zscaler-help/about-dlp-dictionaries.md`.

From *About DLP Engines*:

> A DLP engine is a collection of one or more DLP dictionaries. When you define your DLP policy rules and Endpoint DLP policy rules, you must reference DLP engines, rather than DLP dictionaries.

**Compose with Boolean operators.** An engine can say "(CreditCards OR SSNs) AND Healthcare" to detect a record that contains financial-OR-identity data in a medical context. Composite engines give operators policy-rule-level detection logic without bloating the rule set.

Zscaler ships predefined engines (HIPAA, PCI, GDPR, etc.) that already combine multiple dictionaries per regulation. Custom engines let operators compose their own.

**Channels** (*About DLP Engines*): an engine can be scoped to specific channels — Network Share, Personal Cloud Storage, Printing, Removable Storage. These are the **Endpoint DLP** channels; engines scoped to them only trigger on that traffic type. Inline (web) DLP engines don't need channel scoping.

### DLP Policy Rules with Content Inspection

Source: `vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md`; `vendor/zscaler-help/Understanding_Policy_Enforcement.txt`.

From *Configuring DLP Policy Rules with Content Inspection*:

Location: `Policy > Data Loss Prevention`.

Rule attributes:

- **Rule Order** — ascending numerical, first-match-wins. Same pattern as URL Filter (see [`./url-filtering.md`](./url-filtering.md)).
- **Admin Rank** — 0 (highest) to 7. Rules with higher admin rank always precede lower; rank gates which Rule Order values an admin can select.
- **Rule Status** — Enabled / Disabled. Disabled rules retain their order slot (same pattern as URL Filter).
- **Rule Label** — freeform categorization tag.

Rule criteria:

- **Content Matching** — select DLP engines (up to 4 per rule). "Any" applies to all engines.
- **Match Only mode** — for both Allow and Block actions, controls how engines must trigger together. See *DLP Policy Configuration Example: Match Only* in Zscaler docs.
- **Inspect HTTP GET Query Parameters** — enables DLP inspection on URL query strings for specific URL categories: Generative AI and ML Applications, Safe Search Engines, Translation Tools, Web Search, and User-Defined Custom URL Categories. **Particularly relevant for GenAI-prompt data exfil detection** (pairs with the LLM-vendor prompt-tracking flags in Advanced URL Settings — see [`./url-filtering.md § GenAI prompt-tracking flags`](./url-filtering.md)).

### Content inspection limits

Source: `vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md`; `vendor/zscaler-help/about-dlp-engines.md`.

**File size limits** (*Configuring DLP Policy Rules with Content Inspection* + *About DLP Engines*):

- **400 MB max file size** — files larger than this aren't inspected (`configuring-dlp-policy-rules-content-inspection.md:22`; `about-dlp-engines.md:27`). **Caveat: the source contradicts itself** — the File Type subsection of the same content-inspection article states "Zscaler DLP engines can scan files of up to 100 MB" (`configuring-dlp-policy-rules-content-inspection.md:113`). See Open questions before treating 400 MB as authoritative.
- **100 MB max per decompressed archive entry** — for archived files, each individual file's decompressed size can be at most 100 MB (`configuring-dlp-policy-rules-content-inspection.md:113`; `about-dlp-engines.md:27`). Note this is the *per-entry* decompressed cap, distinct from the 400 MB whole-file cap. (The content-inspection article's line 22 says "the maximum size also applies to files extracted from archive files," which reads as the 400 MB cap; line 113 and about-dlp-engines:27 give 100 MB for decompressed entries — see Open questions.)
- **100 MB max extracted text** — DLP scans only the first 100 MB of extracted text from a file (`configuring-dlp-policy-rules-content-inspection.md:22`). A 400 MB DOCX with 200 MB of extracted text has its last 100 MB un-inspected.
- **5 levels of compression** — nested archives beyond 5 levels deep aren't scanned (`about-dlp-engines.md:27`). An attacker wrapping payload in 6-level-nested ZIPs silently evades DLP.

These limits affect real operational questions — "why didn't DLP catch this 500 MB PDF?" lands on the first limit.

### "Evaluate All Rules" mode

Source: `vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md`.

> This article does not apply to organizations with Evaluate All Rules mode enabled.

Default DLP evaluation is first-match-wins (the usual pattern). **Evaluate All Rules** is an alternative mode that runs every DLP rule against every request. Why: when you want to log ALL DLP violations for audit purposes, not just the first match. Covered in a separate help article (*Configuring DLP Policy Rules with Evaluate All Rules Mode Enabled*, not captured here).

Tenants in Evaluate All Rules mode have a fundamentally different DLP-rule mental model. Skill answers about DLP evaluation order must branch on this mode. If uncertain, check the tenant config or ask.

### Forwarding paths — what happens when a rule fires

Source: `vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md`.

Five destinations for DLP events (from *Configuring DLP Policy Rules with Content Inspection*):

1. **ZIA native action** — Allow or Block the transaction. The rule's default behavior.
2. **DLP notification templates** — email the organization's auditor when a rule fires. Admin-configured templates.
3. **ICAP receivers (third-party DLP)** — forward DLP-relevant transaction data to a third-party DLP solution (RSA, Symantec, etc.) via secure ICAP. **Zscaler does not accept ICAP responses** — ICAP is one-way forwarding, not a decision-making handoff. Zscaler decides based on its own policy; the third-party solution gets a copy for analysis.
4. **Zscaler Incident Receiver** — Zscaler-native destination for outbound email policy rule content. Same ICAP transport; still one-way.
5. **Cloud-to-Cloud Incident Forwarding (C2C)** — forward metadata + evidence directly to the customer's public cloud storage (AWS S3, Azure Blob, etc.). No appliance to deploy. This is where **ZWA ingests its incidents** (see [`../zwa/overview.md`](../zwa/overview.md)) — ZWA reads from the C2C incident stream. C2C is a first-class configurable surface, not just a back-end pipe: the SDK exposes a dedicated `client.zia.cloud_to_cloud_ir` namespace driving `/cloudToCloudIR` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_to_cloud_ir.py:78,123,187`, registered at `vendor/zscaler-sdk-python/zscaler/zia/zia_service.py:715`) — the configuration handle behind the ZWA-ingest claim.

### Pipeline position

Source: `vendor/zscaler-help/Understanding_Policy_Enforcement.txt`; `vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md`.

DLP evaluates in the **full-URL pass** post-decrypt (per [`./ssl-inspection.md § Pipeline position`](./ssl-inspection.md)). Specifically:

```
Firewall module  (pass?)
      ↓
Web module — SNI/CONNECT pass  (domain-only: URL Filter, CAC, known-bad ATP, Bandwidth)
      ↓
SSL Inspection decision  (decrypt? bypass?)
      ↓
Web module — Full-URL pass  (URL Filter, CAC, ATP content, DLP, Sandbox, Malware, File Type, IPS)
```

DLP is in the terminal tier of the full-URL pass alongside Sandbox, Malware, File Type Control, and IPS content checks. All of these **share the SSL-decrypt dependency** — bypass SSL for a URL and all of them silently stop working for that URL.

## API/SDK surface

Source: `vendor/zscaler-sdk-python/zscaler/zia/dlp_web_rules.py`; `vendor/zscaler-sdk-python/zscaler/zia/models/dlp_web_rules.py`; `vendor/zscaler-sdk-python/zscaler/zia/dlp_dictionary.py`; `vendor/zscaler-sdk-python/zscaler/zia/dlp_engine.py`; `vendor/zscaler-sdk-python/zscaler/zia/dlp_resources.py`; `vendor/zscaler-sdk-python/zscaler/zia/dlp_templates.py`; `vendor/zscaler-sdk-python/zscaler/zia/cloud_to_cloud_ir.py`; `vendor/zscaler-sdk-python/zscaler/zia/zia_service.py`.

The three-layer object model and the forwarding surfaces above are help-doc-backed behavior; this section pins the *wire shape* and the *separate configuration namespaces* to SDK source so the skill can reason about what is actually addressable via the API.

### Namespaces

The SDK splits DLP into distinct namespaces, each its own REST surface (`vendor/zscaler-sdk-python/zscaler/zia/zia_service.py`):

| Namespace | Endpoint base | What it configures |
|---|---|---|
| `client.zia.dlp_web_rules` | `/webDlpRules` (`dlp_web_rules.py:64,118,184,278`) | The inline (web) DLP policy rules. |
| `client.zia.dlp_dictionary` | `/dlpDictionaries` (`dlp_dictionary.py:78,189`; registered `zia_service.py:253`) | Detection primitives; `/dlpDictionaries/validateDlpPattern` (`dlp_dictionary.py:449`) validates a custom pattern. |
| `client.zia.dlp_engine` | `/dlpEngines` (`dlp_engine.py:78,194`; registered `zia_service.py:261`) | Reusable detection units; `/dlpEngines/validateDlpExpr` (`dlp_engine.py:383`) validates an engine's Boolean expression. |
| `client.zia.dlp_resources` | `/icapServers`, `/incidentReceiverServers`, `/idmprofile`, `/dlpExactDataMatchSchemas` (`dlp_resources.py:78,265,436,528`; registered `zia_service.py:285`) | The downstream forwarding/matching infrastructure: ICAP servers, Zscaler Incident Receivers, IDM profiles, EDM schemas. |
| `client.zia.dlp_templates` | DLP notification templates (registered `zia_service.py:277`) | The email-notification templates referenced by a rule. |
| `client.zia.cloud_to_cloud_ir` | `/cloudToCloudIR` (`cloud_to_cloud_ir.py:78,123,187`; registered `zia_service.py:715`) | Cloud-to-Cloud Incident Forwarding receivers (the C2C surface ZWA ingests from). |
| `client.zia.web_dlp_global_options` | GET/PUT `/webDlpGlobalOptions` (`vendor/zscaler-sdk-python/zscaler/zia/web_dlp_global_options.py:37-112`; registered `vendor/zscaler-sdk-python/zscaler/zia/zia_service.py:865-871`) | Tenant-wide Web DLP advanced settings. |

The split is the API-level expression of the doc's core indirection: **a rule references engines, never dictionaries** — the rule model carries a `dlp_engines` list (`models/dlp_web_rules.py:117-119`) and there is no dictionary field on the rule. Wrapping a custom dictionary in an engine first is a literal API requirement, not just a UI convention.

The `validateDlpExpr` example expression `((D63.S > 1) AND (D38.S > 0))` (`dlp_engine.py:378`) shows the on-the-wire form of engine composition: dictionary IDs (`D63`, `D38`) combined with Boolean operators, each gated by a per-dictionary score threshold (`.S > N`) — the SDK-level confirmation of both the Boolean-operator composition and the confidence-score-threshold mechanics the help docs describe in prose.

### Rule wire shape

The web-rule model (`vendor/zscaler-sdk-python/zscaler/zia/models/dlp_web_rules.py`) carries far more than the prose above covers. Fields confirmed in source:

- **`action`** (`:49`) and **`severity`** (`:61`) — the rule's outcome and an event-severity tag. The SDK types both as free strings (no enum is declared in the model), so the *allowed values* are not pinned here — see Open questions.
- **`parent_rule` / `sub_rules`** (`:62-63`) — a rule hierarchy: a parent rule with nested sub-rules. The help-doc prose treats DLP rules as a flat first-match list; the wire model supports a parent/child structure.
- **`ocr_enabled`** (`add_rule` keyword `dlp_web_rules.py:250`; model field absent — request-only) — OCR scan of image files, so text embedded in images is inspected.
- **`without_content_inspection`** (`models/dlp_web_rules.py:53-55`; `dlp_web_rules.py:251`) — the **EXTERNALDLP / no-content-inspection** rule variant: a rule that forwards/acts without ZIA itself inspecting payload content (e.g. hand-off to a third party). A distinct mode from the normal content-inspection rule.
- **`inspect_http_get_enabled`** (`models/dlp_web_rules.py:56`) — the wire field behind the doc's "Inspect HTTP GET Query Parameters" prose.
- **`dlp_download_scan_enabled`** (`:57`) — enable DLP on the download direction (the `Inspect Downloads` toggle; see the EDM/IDM exclusion footgun below).
- **`match_only`** (`:51`) and **`min_size`** (`:48`, KB) — file-size gating: `match_only` controls whether a minimum file size is used to qualify a transaction for evaluation.
- **`user_risk_score_levels`** (`:76-78`) — risk-based DLP: scope a rule to user risk-score bands.
- **`dlp_content_locations_scopes`** (`dlpContentLocationsScopes`) — content-location match scopes. This field is documented in Automate for Web DLP create/read/update operations (`vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:81631-81638`, `:97694-97700`, `:121756-121762`) and modeled by both Go and Python SDKs (`vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlp_web_rules/dlp_web_rules.go:163-164`; `vendor/zscaler-sdk-python/zscaler/zia/models/dlp_web_rules.py:79-80`, `:237`), but the 2026-06-21 overlay records it as absent from the Terraform provider (`vendor/zscaler-api-specs/automate-zscaler/observed-contract-overlays.md:40-42`).
- **`included_domain_profiles` / `excluded_domain_profiles`** (`:102-109`) and **`source_ip_groups`** (`:110-112`) — additional scoping dimensions (domain profiles, source IP groups) beyond the users/groups/departments/locations the prose lists.
- **`zscaler_incident_receiver`** (`:66`), **`icap_server`** (`:137`), **`auditor`** (`:131`), **`external_auditor_email`** (`:67`, `dlp_web_rules.py:246`), **`notification_template`** (`:133-135`) — the per-rule handles wiring a rule to the forwarding surfaces in the `dlp_resources` / `dlp_templates` namespaces above.

### Observed live-read overlays

Source: `vendor/zscaler-api-specs/automate-zscaler/observed-contract-overlays.md`; `vendor/zscaler-api-specs/automate-zscaler/observed-contract-overlays.json`.

The clean-room overlay records two Web DLP rule fields that appeared in live read responses but are absent from the checked-in Automate contract, the same-day 2026-06-21 Playwright recapture, the vendored Go SDK, the vendored Python SDK, and the Terraform provider: `deeplyNestedContentEnabled` / `deeply_nested_content_enabled` and `timeoutFailClosedEnabled` / `timeout_fail_closed_enabled` (`observed-contract-overlays.md:18-25`; `observed-contract-overlays.json:9-53`). The overlay retains no tenant identifiers, object IDs, object names, field values, or payload excerpts, and explicitly treats both fields as read-side observations with unknown write status (`observed-contract-overlays.md:11-16`, `:22-25`).

The 2026-06-21 Automate recapture is a negative-control check rather than a stale-doc assumption: all six Web DLP operation pages recaptured with the Automate Playwright scraper had raw hashes matching the checked-in `zia-api-reference.json`, and the fields were still absent (`observed-contract-overlays.md:27-38`; `observed-contract-overlays.json:55-91`). Treat both as known read-side holds until Zscaler documents them or a lab write-test proves they are accepted on create/update.

## Cross-product hooks

Source: `vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md`; `vendor/zscaler-help/Understanding_Policy_Enforcement.txt`.

| Direction | Hook | Failure mode |
|---|---|---|
| Upstream ← SSL Inspection | DLP needs decrypted content | SSL bypass silently disables DLP for matching traffic |
| Upstream ← URL Filter / CAC | If URL/CAC blocks first, DLP never evaluates | "DLP didn't catch this" may be because the user was URL-blocked upstream before DLP saw the payload |
| Downstream → ZWA | DLP incidents flow to Workflow Automation via C2C Incident Forwarding | If C2C isn't configured, ZWA never sees incidents even if DLP is firing |
| Downstream → ICAP third-party | Forwarded transaction data | One-way — third-party can analyze but can't change Zscaler's decision |
| Downstream → Notification templates | Email to auditor | Template must be configured separately; rule-level enablement alone doesn't produce email |

## Endpoint DLP

Go v3.8.41 introduced Endpoint DLP as several distinct management families, not only as fields on an inline DLP rule; Python v1.9.39 now registers matching unified-client families (`vendor/zscaler-sdk-go/CHANGELOG.md:12-13,23-73`; `vendor/zscaler-sdk-python/pyproject.toml:1-4`; `vendor/zscaler-sdk-python/zscaler/zia/zia_service.py:849-919`):

| Object family | Management surface |
|---|---|
| Application catalog | `GET /zia/api/v1/endPointApplications`, `/lite`, `/count`, `/cloudApps/count`, `/policies`, and `/getCategoriesWithNonEmptyApps` (`vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_applications/endpoint_applications.go:13-14,37-93,124-177`; `vendor/zscaler-sdk-python/zscaler/zia/endpoint_applications.py:39-381`). |
| Custom applications | List/get/create/update/delete through `/zia/api/v1/endPointApplications/customApps` and `/customApp[/{id}]` (`vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_custom_apps/endpoint_custom_apps.go:15-16,67-89,93-133`; `vendor/zscaler-sdk-python/zscaler/zia/endpoint_custom_apps.py:38-299`). |
| Application groups | List/create/update/delete, policy-association read, and resource-association update through `/zia/api/v1/endPointApplicationGroups` (`vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_application_groups/endpoint_application_groups.go:18-19,46-84,92-101,133-145`; `vendor/zscaler-sdk-python/zscaler/zia/endpoint_application_groups.py:38-320`). |
| Endpoint resources | CRUD at `/zia/api/v1/dlpEndpointResource`; channel-scoped reads accept `PRINTING`, `REMOVABLE_DRIVE_TRANSFER`, `NETWORK_DRIVE_TRANSFER`, and `PERSONAL_CLOUD_STORAGE` (`vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_resource/endpoint_resource.go:12-29,55-80`; `vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_resource_channel/endpoint_resource_channel.go:13-27,41-75`; `vendor/zscaler-sdk-python/zscaler/zia/dlp_endpoint_resource.py:37-287`). |
| Resource groups | CRUD at `/zia/api/v1/endPointDlpResourceGroups`, channel-scoped list reads, resource-to-group reads, and group-resource association reads/updates (`vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_resource_group/endpoint_resource_group.go:17-38,57-98,102-145`; `vendor/zscaler-sdk-python/zscaler/zia/endpoint_dlp_resource_groups.py:38-392`). |
| Rules and exceptions | Rule CRUD/list/get plus file-category reads at `/zia/api/v1/endPointDlpRules`; exception/sub-rule create/update/delete at `/zia/api/v1/endPointDlpRules/{id}/subRule[/{subRuleId}]` (`vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_dlp_rules/endpoint_dlp_rules.go:17-18,67-128`; `vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_dlp_sub_rules/endpoint_dlp_sub_rules.go:14-15,57-84`; `vendor/zscaler-sdk-python/zscaler/zia/endpoint_dlp_rules.py:37-389`; `vendor/zscaler-sdk-python/zscaler/zia/endpoint_dlp_sub_rules.py:35-235`). |

The Python list implementations issue one request and return that response's
current page; they do not reproduce Go's list/category page aggregation
(`vendor/zscaler-sdk-python/zscaler/zia/endpoint_applications.py:79-106,150-177,377-381`;
`vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_applications/endpoint_applications.go:37-93,124-177`). These Endpoint DLP accessors are registered on unified `ZIAService`, not the legacy client (`vendor/zscaler-sdk-python/zscaler/zia/zia_service.py:849-919`; `vendor/zscaler-sdk-python/zscaler/zia/legacy.py:786-792`).

One Python wrapper defect is not product behavior: custom-app list/get decode
`EndpointApplicationsCustomApps`, but create/update declare and decode
`DlpEndpointResource` instead
(`vendor/zscaler-sdk-python/zscaler/zia/endpoint_custom_apps.py:38-147,149-274`). Treat the create/update result model as an SDK divergence rather than evidence for the endpoint's wire schema.

Endpoint-application responses expose descriptive, OS, file, signature, type, and version data (`vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_custom_apps/endpoint_custom_apps.go:19-55`), but the shared request serializer emits only non-empty `resourceId` and `zappId` (`vendor/zscaler-sdk-go/zscaler/zia/services/common/common.go:131-161`). The shared model also types `versions` as one `Versions` struct, while the custom-application response model types the same wire key as `[]Versions`; callers must not assume those two response shapes are interchangeable (`vendor/zscaler-sdk-go/zscaler/zia/services/common/common.go:132-146`; `vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/endpoint_custom_apps/endpoint_custom_apps.go:19-35`).

Terraform provider v4.8.0 adds resources for custom applications, application groups, endpoint resources, resource groups, rules, and sub-rules, plus data sources for application, custom-app, rule, channel, and resource-group-tag reads (`vendor/terraform-provider-zia/CHANGELOG.md:3-27`). This is SDK/provider surface evidence only: the generated reconciliation boundary confirms that these endpoint families remain outside the current Automate capture, and client presence does not establish tenant entitlement or live rollout (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.md:32-46`; `vendor/zscaler-sdk-go/CHANGELOG.md:12-19`).

## Outbound Email DLP

Go v3.8.41 and Python v1.9.39 both provide list, lite-list, get, create, update, and delete operations for `/zia/api/v1/emailDlpRules`, plus `GET /zia/api/v1/emailDlpRules/actions`, whose response is returned as raw CSV bytes (`vendor/zscaler-sdk-go/zscaler/zia/services/endpoint_dlp/outbound_email_dlp/outbound_email_dlp.go:17-18,57-70,87-138,141-160`; `vendor/zscaler-sdk-python/zscaler/zia/outbound_email_dlp_rules.py:37-456`). Both release notes mention only the actions CSV endpoint, omitting the list/lite/get/CRUD methods present in code (`vendor/zscaler-sdk-go/CHANGELOG.md:75-76`; `vendor/zscaler-sdk-python/CHANGELOG.md:69-70`). Terraform provider v4.8.0 adds the `zia_outbound_email_dlp` resource and data source (`vendor/terraform-provider-zia/CHANGELOG.md:16-18`).

## Edge cases

Source: `vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md`; `vendor/zscaler-help/about-dlp-engines.md`; `vendor/zscaler-help/Understanding_Policy_Enforcement.txt`.

- **Archive inspection has a 5-level recursion limit.** Nested ZIPs beyond 5 levels aren't scanned (`about-dlp-engines.md:27`). Separate from the whole-file size cap; individual decompressed archive entries are themselves capped at 100 MB (`configuring-dlp-policy-rules-content-inspection.md:113`; `about-dlp-engines.md:27`).
- **Content beyond 100 MB of extracted text isn't scanned.** An operator reporting "DLP didn't catch content in a big document" — the content may have been past the 100 MB inspection window.
- **`Any` engine selection in a rule** — selects all engines. Risky in broad allowing/blocking rules; can cascade-trigger on unrelated dictionaries.
- **ICAP receivers are one-way.** Third-party DLP can see the traffic but can't veto Zscaler's decision. Operators coming from Symantec DLP / Forcepoint DLP where third-party is decisive sometimes expect different semantics.
- **Evaluate All Rules mode changes evaluation fundamentally.** A tenant migrating between modes needs to re-verify rule behavior — rules that were dormant under first-match-wins may all start firing.
- **DLP rule scope depends on SSL Inspection rule scope.** DLP can't scope tighter than SSL Inspection decrypts. If SSL Inspection decrypts only a subset of traffic, DLP's effective scope is that subset regardless of what the DLP rule's criteria say.
- **Large file uploads time out before DLP completes.** For files close to the whole-file size cap, DLP may take long enough that the HTTP connection's underlying timeout intervenes. Investigate with Web Insights — look for "DLP pending" or timeout states in log records. (Note the source disagrees on whether that cap is 400 MB or 100 MB — see Open questions.)

## Surprises worth flagging

Source: `vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md`; `vendor/zscaler-help/ranges-limitations-zia.md`.

These are configuration combinations and behaviors that silently fail or behave non-obviously. Each is a real operator footgun.

1. **`Inspect Downloads` does NOT apply to EDM or IDM engines.** When `Inspect Downloads` is enabled, the rule scope is silently restricted — Exact Data Match and Indexed Data Matching engines are excluded from the download direction. An operator enabling download-DLP for EDM (e.g., to catch exfiltration of exact employee records) gets no coverage. Additionally, when `Inspect Downloads` is on, you must set `Any` for URL Categories AND select at least one Cloud Application — otherwise the rule won't save.

2. **Unauthenticated traffic + group/department scope is mutually exclusive.** Any DLP rule that applies to unauthenticated traffic must set `Any` for **both** Groups AND Departments. You cannot scope an unauthenticated-DLP rule to a specific group subset — the constraint surfaces only at rule save time, not during design.

3. **`Confirm` action auto-blocks on dialog timeout.** If the user-confirmation message times out without the end user taking action, the Zscaler service automatically cancels (blocks) the transaction. Operators treating Confirm as a "soft gate where the user can always justify and proceed" don't realize the fallback is hard-cancel — relevant for flaky / slow / tab-buried sessions where the dialog never gets attention.

4. **Evidence files >100 MB are silently replaced with `.txt` placeholder.** DLP Incident Evidence files cap at 100 MB; larger files don't fail — they get replaced with a `.txt` placeholder containing minimal metadata. A forensics workflow expecting the actual document content for large-file violations gets nothing scrutable.

5. **WebSocket DLP inspection is Microsoft-Copilot-only.** The WebSocket protocol option for DLP inspection works exclusively for Microsoft Copilot. Adding WebSocket as a protocol expecting it to cover other WebSocket-heavy apps (Slack, Figma, Linear, Notion) yields zero coverage for those apps. WebSocket SSL/TLS DLP is similarly Copilot-only.

6. **Zscaler-defined file types win over custom file types in evaluation order.** If both a custom file type and a Zscaler predefined type match the same file, the predefined type's rule fires. Custom file types embedded inside archive files are NOT detected at all — archive extraction surfaces only Zscaler-recognized types.

7. **DLP rule count cap: 1,024 (→ 2,048 via support).** Higher than several other ZIA policies. Mostly relevant to large multi-team enterprises where rule consolidation strategies hit the cap.

## Open questions

Source: `vendor/zscaler-sdk-python/zscaler/zia/models/dlp_web_rules.py`; `vendor/zscaler-api-specs/automate-zscaler/observed-contract-overlays.md`; `vendor/zscaler-api-specs/automate-zscaler/observed-contract-overlays.json`.

- **Max file-size cap: 400 MB vs 100 MB — the source contradicts itself.** Two figures appear in the captured help docs:
  - **400 MB** at `configuring-dlp-policy-rules-content-inspection.md:22` ("The Zscaler DLP engines support files up to 400 MB…") and `about-dlp-engines.md:27` ("Zscaler DLP engines can scan files with a maximum size of 400 MB.").
  - **100 MB** at `configuring-dlp-policy-rules-content-inspection.md:113`, in the File Type subsection ("Zscaler DLP engines can scan files of up to 100 MB.").
  The 100 MB figure at line 113 looks section-scoped or stale within the source itself, but it sits in the same article as the 400 MB claim at line 22, so this is an unresolved vendor contradiction, not a writer error. Treat 400 MB as the likely whole-file cap (it's the figure carried by two separate articles and the one the extracted-text/archive-entry 100 MB caps are framed against) but verify against a live tenant or a fresher capture before stating it as fact. Note the archive-entry decompressed cap (100 MB) is independently and consistently stated and is not part of this contradiction.
- **Exact confidence-score threshold semantics** for predefined dictionaries — the thresholds are tunable but the score-to-confidence mapping isn't numeric in the help docs. Needs tenant tuning based on false-positive rates.
- **Whether MIP label matching requires Microsoft 365 integration config** on the Zscaler side, or works purely from document-metadata inspection.
- **Evaluate All Rules mode — specific semantics** for conflicting rule actions. If Rule 1 Blocks and Rule 3 Allows the same event, and both fire under Evaluate All Rules, what's the terminal action? Not captured here; help article exists (not yet vendored).
- **EDM (Exact Data Matching) operational mechanics** — how the matching works without the source data leaving the tenant, hashing approach, update cadence. Likely covered in separate help articles.
- **Allowed values for the rule `action` and `severity` fields** — the SDK model (`vendor/zscaler-sdk-python/zscaler/zia/models/dlp_web_rules.py:49,61`) carries both as free strings with no enum declared, so the concrete set (e.g. ALLOW / BLOCK / CONFIRM for action; the severity bands) is not pinned by SDK source. The help-doc prose names ALLOW / BLOCK / CONFIRM behaviorally but the wire enum is unconfirmed here.
- **`parent_rule` / `sub_rules` semantics** — the rule model exposes a parent/child rule hierarchy (`models/dlp_web_rules.py:62-63`) but the SDK does not document how sub-rule evaluation composes with the flat first-match-wins / Evaluate-All-Rules order described from the help docs. How a parent rule's match interacts with its sub-rules' actions is unconfirmed.
- **`without_content_inspection` (EXTERNALDLP) exact behavior** — the field is SDK-confirmed (`models/dlp_web_rules.py:53-55`) as a distinct no-content-inspection rule variant, but what the rule keys on instead of payload content, and which forwarding surfaces it pairs with, is not pinned by SDK source.
- **Live-read-only fields `deeplyNestedContentEnabled` and `timeoutFailClosedEnabled`** — observed in downstream clean-room live reads, but absent from the Automate contract, same-day recapture, SDKs, and Terraform provider; write status unknown (`vendor/zscaler-api-specs/automate-zscaler/observed-contract-overlays.md:18-29`). Treat as known holds until documented or write-tested.

These open DLP items are tracked together as `zia-58` in [`../_meta/clarifications.md`](../_meta/clarifications.md#zia-58-dlp-web-rule-actionseverity-enums-parentsub-rule-composition-externaldlp-behavior).

## Cross-links

- SSL Inspection (upstream decrypt dependency) — [`./ssl-inspection.md`](./ssl-inspection.md)
- URL Filtering (upstream gate; may block before DLP sees traffic) — [`./url-filtering.md`](./url-filtering.md)
- Cloud App Control (parallel decryption dependency) — [`./cloud-app-control.md`](./cloud-app-control.md)
- Malware Protection / ATP (adjacent cybersecurity-policy family sharing pipeline position) — [`./malware-and-atp.md`](./malware-and-atp.md)
- Sandbox (another SSL-decrypt-dependent detection engine) — [`./sandbox.md`](./sandbox.md)
- ZWA Workflow Automation (downstream incident lifecycle) — [`../zwa/overview.md`](../zwa/overview.md)
- Cross-product integration catalog (SSL-decrypt gate + ZWA hook) — [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
