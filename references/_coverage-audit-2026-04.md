---
product: shared
topic: coverage-audit
title: "Vendor help-doc coverage audit"
content-type: report
last-verified: 2026-04-27
confidence: high
source-tier: doc
sources:
  - vendor/zscaler-help/
author-status: draft
---

# Vendor help-doc coverage audit — April 2026

Audits all 314 files (330 including the `automate-zscaler/` subdirectory) in `vendor/zscaler-help/` against the 135 markdown reference files in `references/`. For each vendor doc, coverage is classified as **Covered**, **Partial**, **Uncovered**, or **Skip**. The audit then identifies high-priority gaps and makes concrete recommendations.

Method: classification was determined by (a) checking whether the vendor filename appears in `sources:` frontmatter of any reference file, (b) grepping reference files for the topic keywords, and (c) reading the reference file contents to assess depth of treatment.

---

## 1. Headline numbers

| Metric | Count |
|---|---|
| Total vendor help docs (files) | 314 raw files + 16 in `automate-zscaler/` subdir = **330** |
| PDFs | 17 |
| CSVs (NSS log schemas) | 3 |
| Markdown docs (main dir) | 276 |
| Markdown docs (automate-zscaler subdir) | 16 |
| Special files (NOTICE, README) | 2 |
| **Net auditable content files** | **309** |
| Covered | ~131 |
| Partial | ~42 |
| Uncovered | ~78 |
| Skip (marketing, release notes, trivial) | ~58 |

Note: "Covered" means a reference file demonstrably treats the vendor doc's topic as a primary or major secondary subject. "Partial" means the topic appears in a reference file but as an aside or brief mention. Counts are estimates because many vendor docs overlap with multiple reference files.

### Per-product breakdown

| Product prefix | Vendor doc count | Covered | Partial | Uncovered | Skip |
|---|---|---|---|---|---|
| ZIA (zia-*, configuring-*, about-*, URL/SSL/DLP topics) | ~65 | ~35 | ~15 | ~10 | ~5 |
| ZPA (zpa-*, zsdk-*, about-app-*, appprotection-*, microtenants, emergency-access) | ~45 | ~28 | ~8 | ~7 | ~2 |
| ZCC / ZCC-adjacent | ~28 | ~18 | ~5 | ~5 | ~0 |
| CBC / Cloud Connector (cbc-*) | ~55 | ~35 | ~8 | ~9 | ~3 |
| ZDX | ~5 | ~4 | ~1 | ~0 | ~0 |
| ZIdentity / ZSDK | ~25 | ~10 | ~5 | ~8 | ~2 |
| ZWA | ~5 | ~4 | ~1 | ~0 | ~0 |
| Risk360 | ~7 | ~6 | ~1 | ~0 | ~0 |
| Deception | ~3 | ~2 | ~1 | ~0 | ~0 |
| AI Security / AI Guard | ~3 | ~3 | ~0 | ~0 | ~0 |
| ZMS / ZBI | ~3 | ~2 | ~1 | ~0 | ~0 |
| Shared / cross-product / OneAPI | ~25 | ~15 | ~5 | ~4 | ~1 |
| Marketing / ops-suite (skip candidates) | ~40 | 0 | 0 | 0 | ~40 |
| automate-zscaler subdir | ~16 | ~8 | ~3 | ~5 | ~0 |

---

## 2. High-priority uncovered docs

Grouped by product. Only files judged to carry operational, configuration, API, or troubleshooting value are listed — marketing captures and trivial UI docs are in § 6.

### 2A. ZIA

| Vendor filename | Topic (best guess) | Why it matters | Suggested reference target |
|---|---|---|---|
| `about-iot-report.md` | IoT device visibility report in ZIA — device fingerprinting, category taxonomy | Operators ask about IoT visibility; SDK exposes `zia/iot_policy.py`; no reference file covers the report structure or fields | New: `references/zia/iot-report.md` or extend `references/zia/cloud-app-control.md` |
| `about-machine-groups.md` | ZIA machine groups — group machines by hostname/certificate for policy matching | Used in ZIA forwarding policy and firewall rules; SDK has `machine_groups.py`; only partial mention in `references/zia/` | Extend `references/zia/forwarding-control.md` or new `references/zia/machine-groups.md` |
| `about-rule-labels.md` | Rule labels — tagging construct for ZIA/ZPA rules (grouping, filtering, API) | SDK exposes rule labels; label semantics matter for policy automation; only a schema mention in references | Extend `references/zia/sdk.md` or new `references/zia/rule-labels.md` |
| `about-saas-security-insights-logs.md` | SaaS Security Insights log schema — out-of-band CASB / API CASB log fields | No reference file covers SaaS Security Insights log schema at all; operators building SIEM pipelines need this | New: `references/zia/logs/saas-security-log-schema.md` |
| `about-saas-security-report.md` | SaaS Security Report (formerly Shadow IT / ZINS) — structure and UI of the report | Partially mentioned in `_portfolio-map.md` but no operational reference doc; the GraphQL API endpoint is not documented in references | Extend `references/zia/sdk.md` or new `references/zia/saas-security-report.md` |
| `about-saas-security-scan-configuration.md` | API CASB scan configuration — scanning SaaS apps out-of-band for DLP/posture | TF resource `zpa_app_protection_*` references scan config; this is the operational setup doc; absent from references | Extend `references/zia/dlp.md` or new `references/zia/api-casb.md` |
| `about-time-intervals.md` | Time interval objects — reusable schedule primitives used across ZIA/ZPA policies | SDK exposes `time_windows.py` and `schedule.py` equivalents; policy scheduling logic is not explained in any reference | Extend `references/shared/policy-evaluation.md` or new `references/zia/time-intervals.md` |
| `understanding-isolation-miscellaneous-unknown-category-zia.md` | ZBI/ZIA integration — how "Miscellaneous / Unknown" URL category triggers isolation | Covered in `references/zbi/overview.md` but not in depth; matters for tuning isolation policy to avoid unintended isolation of legit traffic | Extend `references/zbi/policy-integration.md` |
| `understanding-sublocations.md` | ZIA sublocations — nesting of child locations under parent, shared bandwidth pools | Mentioned in passing in `references/zia/locations.md` and `references/zia/bandwidth-control.md` but no dedicated treatment of sublocation constraints | Extend `references/zia/locations.md` |
| `sipa-microsoft-365-conditional-access-config.md` | Microsoft 365 Conditional Access integration via SIPA (source IP anchoring) | Covers a specific high-value enterprise pattern (M365 CA + ZIA/ZPA source IP anchoring); `references/shared/source-ip-anchoring.md` exists but does not cover the M365 CA conditional-access configuration flow | Extend `references/shared/source-ip-anchoring.md` or new `references/shared/m365-conditional-access.md` |
| `understanding-scim-zia.md` | ZIA-specific SCIM provisioning nuances (group sync, attribute mappings for ZIA) | `references/shared/scim-provisioning.md` exists but focuses on ZPA; ZIA SCIM has distinct attribute requirements and limitations worth a section | Extend `references/shared/scim-provisioning.md` |

### 2B. ZPA

| Vendor filename | Topic (best guess) | Why it matters | Suggested reference target |
|---|---|---|---|
| `about-machine-tunnels.md` | ZPA machine tunnels — always-on tunnel before user login, used for AD/GPO pre-auth | `references/zcc/z-tunnel.md` covers tunnels at ZCC level but ZPA machine tunnels have distinct policy semantics; ZCC install parameters reference the feature but no ZPA-side doc exists | New: `references/zpa/machine-tunnels.md` or extend `references/zpa/app-connector.md` |
| `about-scim-zpa.md` | ZPA SCIM group provisioning — how SCIM group membership maps to ZPA policy conditions | `references/shared/scim-provisioning.md` exists but the ZPA-specific group-to-policy mapping (which groups can be used in access policy vs timeout policy) is not covered | Extend `references/shared/scim-provisioning.md` or `references/zpa/policy-precedence.md` |
| `configuring-zpa-machine-tunnel-all.md` | Step-by-step machine tunnel configuration (ZPA admin portal) | Operational config guide; operators ask about machine tunnel setup; no reference doc covers this | Extend `references/zpa/machine-tunnels.md` (new) or `references/zpa/trusted-networks.md` |
| `about-private-service-edge-groups.md` | ZPA Private Service Edge Groups — grouping construct for PSEs within ZPA | `references/zpa/public-service-edges.md` exists for ZIA PSEs; ZPA PSEs have their own group object; only passing mention in `references/zpa/app-connector.md` | Extend `references/zpa/public-service-edges.md` or new `references/zpa/private-service-edges.md` |
| `about-private-service-edges.md` | ZPA Private Service Edges — on-prem ZPA broker nodes | Same gap as above; ZPA PSEs are architecturally important for on-prem/regulated deployments; no dedicated reference doc | New: `references/zpa/private-service-edges.md` |
| `verifying-access-to-applications.md` | ZPA access verification workflow — testing policy, checking connector health, debug steps | Mentioned in `_clarifications.md` but no reference doc treats this as a first-class troubleshooting workflow | New: `references/zpa/troubleshooting-access.md` or extend `references/zpa/app-connector.md` |
| `about-segment-groups.md` (ZPA, not ZCC) | ZPA segment groups — grouping construct for app segments | Segment groups appear across ZPA SDK and TF references but are not explained as a standalone concept; policy conditions use segment groups | Extend `references/zpa/app-segments.md` or `references/zpa/segment-server-groups.md` |

### 2C. ZCC (Zscaler Client Connector)

| Vendor filename | Topic (best guess) | Why it matters | Suggested reference target |
|---|---|---|---|
| `configuring-acceptable-use-policy-zscaler-app.md` | ZCC in-app AUP page — enabling user-facing acceptable use prompt | ZCC can show an AUP to users on first connect; this affects user experience and compliance workflows; not covered in `references/zcc/` | Extend `references/zcc/web-policy.md` or `references/zcc/forwarding-profile.md` |
| `configuring-firefox-integration-zscaler-client-connector.md` | Firefox browser proxy integration with ZCC | Firefox uses its own proxy settings; ZCC has a specific integration mode; operators deploying to Firefox-heavy environments need this; not mentioned in any reference | Extend `references/zcc/install-parameters.md` or `references/shared/pac-files.md` |
| `configuring-end-user-notifications-zscaler-client-connector.md` | End-user notification templates in ZCC (block pages, alerts, AUP) | Operators customize block page text; no reference doc covers notification/block-page configuration | Extend `references/zcc/web-policy.md` |
| `configuring-user-access-support-options-zscaler-client-connector.md` | ZCC user-visible support options (feedback, diagnostics, support portal) | Admin-controlled; affects help-desk workflow; not covered in references | Extend `references/zcc/install-parameters.md` |
| `configuring-user-access-logging-controls-zscaler-client-connector.md` | Per-user logging visibility controls in ZCC (what users can see/suppress) | Privacy-relevant; policy-driven; no reference doc | Extend `references/zcc/web-privacy.md` |
| `customizing-zscaler-client-connector-install-options-macos.md` | macOS-specific ZCC install customization (MDM parameters, silent install) | `references/zcc/install-parameters.md` covers parameters but macOS-specific MDM deployment (plist keys, pkg options) is absent | Extend `references/zcc/install-parameters.md` |
| `legacy-about-error-codes-zcc.md` | ZCC error code reference | Error codes are high-value for help-desk triage; no reference file covers ZCC error codes | New: `references/zcc/troubleshooting.md` or extend `references/zcc/index.md` |
| `legacy-understanding-rate-limiting-zcc.md` | ZCC API rate limiting specifics | `references/zcc/api.md` mentions rate limits but ZCC has distinct rate limit tiers from ZIA/ZPA; this doc may carry authoritative limits table | Extend `references/zcc/api.md` |

### 2D. CBC / Cloud Connector

| Vendor filename | Topic (best guess) | Why it matters | Suggested reference target |
|---|---|---|---|
| `cbc-about-insights.md` | Cloud Branch Connector Insights dashboard — metrics, traffic stats, health view | `references/cloud-connector/` has no monitoring/observability reference doc; operators need to understand the Insights dashboard for day-2 ops | New: `references/cloud-connector/monitoring.md` |
| `cbc-accessing-cloud-branch-connector-monitoring.md` | How to access the CBC monitoring portal | Same gap as above; pairs with Insights doc | Extend `references/cloud-connector/monitoring.md` (new) |
| `cbc-analyzing-branch-connector-details.md` | Per-connector metrics and status view in CBC portal | Operational troubleshooting; pairs with monitoring docs | Extend `references/cloud-connector/monitoring.md` (new) |
| `cbc-about-source-ip-groups.md` | CBC Source IP Groups — group source CIDRs for traffic forwarding rules | `references/cloud-connector/forwarding.md` covers forwarding rules but the source IP group object (used as a match condition) is not explained; SDK exposes it via `ztw/` | Extend `references/cloud-connector/forwarding.md` |
| `cbc-deploying-nss-virtual-appliances.md` | NSS virtual appliance deployment within CBC environment | NSS within CBC context differs from standalone NSS; `references/shared/nss-architecture.md` covers NSS generally but not the CBC-specific NSS VA deployment | Extend `references/shared/nss-architecture.md` or `references/cloud-connector/index.md` |
| `cbc-supported-regions-zero-trust-gateways.md` | Supported AWS/Azure regions for CBC Zero Trust Gateways | Operators picking deployment regions need this; regional availability affects architecture decisions; not in `references/cloud-connector/` | Extend `references/cloud-connector/aws-deployment.md` and `references/cloud-connector/azure-deployment.md` |
| `cbc-what-zscaler-zero-trust-sd-wan.md` | CBC marketed as "Zero Trust SD-WAN" — product positioning and architecture overview | The SD-WAN framing of CBC is distinct from Cloud Connector framing; operators coming from SD-WAN background need the translation; not in references | Extend `references/cloud-connector/overview.md` |

### 2E. ZIdentity / ZSDK

| Vendor filename | Topic (best guess) | Why it matters | Suggested reference target |
|---|---|---|---|
| `understanding-step-up-authentication.md` | Non-ZIdentity step-up auth (older ZPA-native step-up, pre-ZIdentity) | `references/zidentity/step-up-authentication.md` covers ZIdentity-based step-up; the older ZPA-native mechanism has different config objects; operators on legacy deployments need the distinction | Extend `references/zidentity/step-up-authentication.md` with legacy section |
| `zsdk-understanding-zsdk-error-codes.md` | ZSDK mobile SDK error codes | ZSDK is Tier 2a in `_portfolio-map.md` with captures; error codes are high-value for app developers integrating ZSDK; not in any reference | New: `references/zidentity/zsdk-error-codes.md` or extend ZSDK capture section in `_portfolio-map.md` |
| `zsdk-ranges-limitations.md` | ZSDK limits — max tunnels, token lifetimes, supported OS versions | Important constraint reference for developers building ZSDK apps; no reference doc | Extend ZSDK section in `_portfolio-map.md` or new ZSDK reference file |
| `zsdk-understanding-app-connector-throughput.md` | ZSDK App Connector throughput sizing and performance | Capacity planning for ZSDK deployments; not covered anywhere | Extend `_portfolio-map.md` ZSDK section or new ZSDK reference |
| `zsdk-best-practices.md` | ZSDK integration best practices (token management, tunnel reuse, error handling) | High-value for developers; best practices content typically becomes part of a how-to reference doc | New: `references/zidentity/zsdk-best-practices.md` if ZSDK gets its own reference directory |

### 2F. Shared / Cross-product / OneAPI

| Vendor filename | Topic (best guess) | Why it matters | Suggested reference target |
|---|---|---|---|
| `automate-zscaler/analytics-graphql-api.md` | ZDX / ZINS Analytics GraphQL API — query structure, authentication, sample queries | `references/shared/oneapi.md` mentions OneAPI but the Analytics GraphQL endpoint is distinct; `references/zdx/api.md` covers ZDX REST but not GraphQL; Shadow IT / SaaS Security Report uses this API exclusively | Extend `references/zdx/api.md` or new `references/shared/analytics-graphql.md` |
| `automate-zscaler/api-reference-bi-overview.md` | Business Intelligence API overview — BI reporting endpoints | No reference doc covers the BI API surface; `references/shared/oneapi.md` does not mention BI API | Extend `references/shared/oneapi.md` or new section in `references/zia/api.md` |
| `automate-zscaler/api-reference-index.md` | Master API endpoint catalog across all products | Useful as a cross-reference; `references/shared/oneapi.md` exists but may not list all products' API root paths | Extend `references/shared/oneapi.md` |
| `automate-zscaler/tools-and-sdks.md` | Official Zscaler SDK and tooling catalog (Python, Go, TF, Postman) | `references/shared/oneapi.md` references SDKs but this doc is the authoritative SDK list; useful for the "what SDK do I use for product X" question | Extend `references/shared/oneapi.md` or `references/terraform.md` |
| `automate-zscaler/tools-postman-collection.md` | Postman collection usage guide for Zscaler APIs | `references/shared/oneapi.md` and legacy docs mention Postman; this doc covers the official collection; partial coverage but warrants a dedicated note | Extend `references/shared/oneapi.md` |
| `automate-zscaler/guides-analytics-api.md` | Analytics API usage guide (auth, query patterns, pagination) | No reference covers how to query ZDX or ZINS analytics data programmatically | Extend `references/zdx/api.md` or new `references/shared/analytics-graphql.md` |
| `understanding-multi-cluster-load-sharing.md` | ZIA multi-cluster enforcement (load sharing across data-center clusters) | `references/shared/cloud-architecture.md` covers cloud architecture broadly but multi-cluster load sharing semantics — how policy is enforced across a cluster set — is not treated explicitly | Extend `references/shared/cloud-architecture.md` |
| `about-virtual-service-edge-clusters-internet-saas.md` | ZIA Virtual Service Edge Clusters — HA grouping of VSEs for ZIA | `references/zia/private-service-edge.md` covers PSEs and VSEs but does not explain the cluster grouping construct and its HA semantics | Extend `references/zia/private-service-edge.md` |

---

## 3. Tier-2 product audit

Special focus on AI Security, Risk360, Deception, ZMS, ZBI, ZWA.

### AI Security (AI Guard / AI Guardrails)

Vendor docs: `ai-security-marketing.md`, `ai-guardrails-marketing.md`, `ai-guard-what-is.md`

| Vendor filename | Coverage state | Notes |
|---|---|---|
| `ai-security-marketing.md` | **Covered** | `references/ai-security/overview.md` cites this as a source; marketing framing synthesized |
| `ai-guardrails-marketing.md` | **Covered** | Synthesized into `references/ai-security/overview.md`; treated as marketing umbrella for AI Guard |
| `ai-guard-what-is.md` | **Covered** | Cited as source; 15-detector-category detail captured in overview |

**Gap assessment:** AI Security has solid overview coverage. Three potential gaps: (1) AI Red Teaming is mentioned in `_portfolio-map.md` but no vendor doc for it exists in the corpus — this is a corpus gap, not a coverage gap; (2) The DaaS deployment mode for AI Guard has only brief mention; (3) Integration with ZIA GenAI URL categories and DLP prompt scanning is partially but not fully treated. No new reference file urgently needed; extend `references/ai-security/overview.md` with deployment mode depth.

### Risk360

Vendor docs: `risk360-about-asset-level-risk.md`, `risk360-about-dashboard.md`, `risk360-about-factors.md`, `risk360-logs-retention.md`, `risk360-monte-carlo.md`, `risk360-product-marketing.md`, `what-risk360.md`

| Vendor filename | Coverage state | Notes |
|---|---|---|
| `risk360-about-asset-level-risk.md` | **Covered** | Cited in `references/risk360/overview.md` |
| `risk360-about-dashboard.md` | **Covered** | Dashboard structure treated in overview |
| `risk360-about-factors.md` | **Covered** | 115–140 factor list described in overview |
| `risk360-logs-retention.md` | **Covered** | Log retention noted in overview |
| `risk360-monte-carlo.md` | **Covered** | Monte Carlo 1000x/day simulation is centerpiece of overview |
| `risk360-product-marketing.md` | **Covered** | Synthesized into overview |
| `what-risk360.md` | **Covered** | Introductory framing captured |

**Gap assessment:** Risk360 has comprehensive coverage for a Tier 2a product. One gap: the MITRE ATT&CK / NIST CSF / SEC S-K 106(b) compliance mappings are mentioned in overview but the factor-to-framework cross-reference detail from `risk360-about-factors.md` may not be fully represented. No urgency — extend overview if a question surfaces requiring the mapping detail.

### Deception

Vendor docs: `about-deception-strategy.md`, `about-zpa-app-connectors-deception.md`, `what-is-zscaler-deception.md`

| Vendor filename | Coverage state | Notes |
|---|---|---|
| `about-deception-strategy.md` | **Covered** | `references/deception/overview.md` cites this; decoy strategy covered |
| `about-zpa-app-connectors-deception.md` | **Covered** | ZPA connector + Deception integration noted in overview and `_clarifications.md` |
| `what-is-zscaler-deception.md` | **Covered** | Product definition captured in overview |

**Gap assessment:** Deception has complete coverage of its vendor corpus. The three available docs are all synthesized. Gaps are in the vendor corpus, not reference coverage — no help-portal content exists for deception rule authoring, alert triage, or threat-hunting workflow integration. Mark as "vendor corpus thin" rather than reference coverage gap.

### ZMS (Zscaler Microsegmentation)

Vendor docs: `microsegmentation-marketing.md`, `what-is-microsegmentation-zpa.md`, `zero-trust-microsegmentation-marketing.md`

| Vendor filename | Coverage state | Notes |
|---|---|---|
| `microsegmentation-marketing.md` | **Covered** | Synthesized into `references/zms/overview.md`; cited in `_portfolio-map.md` |
| `what-is-microsegmentation-zpa.md` | **Covered** | ZPA add-on framing captured |
| `zero-trust-microsegmentation-marketing.md` | **Covered** | Marketing positioning captured |

**Gap assessment:** ZMS coverage is adequate for Tier 2a. Three gaps worth noting: (1) No vendor doc covers ZMS agent installation mechanics (Win/Linux); (2) No vendor doc covers ZMS policy recommendation workflow (14-day telemetry window); (3) The Windows Filtering Platform / Linux nftables enforcement detail comes from the marketing content only — no technical reference doc in vendor corpus. These are vendor corpus gaps, not reference coverage gaps.

### ZBI (Cloud Browser Isolation)

Vendor docs: `what-is-zero-trust-browser.md`, `zpa-about-isolation-policy.md`, `understanding-turbo-mode-isolation.md`, `understanding-isolation-miscellaneous-unknown-category-zia.md`, `configuring-smart-browser-isolation-policy.md`

| Vendor filename | Coverage state | Notes |
|---|---|---|
| `what-is-zero-trust-browser.md` | **Covered** | Synthesized into `references/zbi/overview.md`; product definition captured |
| `zpa-about-isolation-policy.md` | **Covered** | ZPA isolation policy structure referenced in `_portfolio-map.md` and `references/zbi/policy-integration.md` |
| `understanding-turbo-mode-isolation.md` | **Covered** | Turbo Mode covered in `references/zbi/overview.md` and `references/zbi/policy-integration.md` |
| `understanding-isolation-miscellaneous-unknown-category-zia.md` | **Partial** | ZBI overview mentions this category behavior but the specific tuning guidance (what actions to take when legit traffic is isolated due to Miscellaneous/Unknown) is not in the reference | Extend `references/zbi/policy-integration.md` |
| `configuring-smart-browser-isolation-policy.md` | **Partial** | Smart Browser Isolation is mentioned but the step-by-step policy configuration (rule conditions, precedence within SBI) is not in the reference | Extend `references/zbi/policy-integration.md` |

**Gap assessment:** ZBI is reasonably covered. Two reference gaps: SBI policy configuration detail and Miscellaneous/Unknown category tuning. Recommend extending `references/zbi/policy-integration.md` with both.

### ZWA (Workflow Automation)

Vendor docs: `what-workflow-automation.md`, `understanding-workflows-workflow-automation.md`, `dlp-incidents-workflow-automation-api.md`, `zwa-managing-incidents.md`, `legacy-api-authentication-workflow-automation-api.md`, `legacy-getting-started-workflow-automation-api.md`

| Vendor filename | Coverage state | Notes |
|---|---|---|
| `what-workflow-automation.md` | **Covered** | Product definition in `references/zwa/overview.md` |
| `understanding-workflows-workflow-automation.md` | **Covered** | Workflow mechanics covered in `references/zwa/overview.md` |
| `dlp-incidents-workflow-automation-api.md` | **Covered** | API shape cited in `references/zwa/api.md` |
| `zwa-managing-incidents.md` | **Covered** | Incident management covered in `references/zwa/overview.md` |
| `legacy-api-authentication-workflow-automation-api.md` | **Partial** | Legacy API key auth mentioned in `references/shared/oneapi.md`; ZWA-specific legacy auth differences not fully captured | Extend `references/zwa/api.md` |
| `legacy-getting-started-workflow-automation-api.md` | **Partial** | Getting-started flow mentioned; API setup steps for ZWA not fully in references | Extend `references/zwa/api.md` |

**Gap assessment:** ZWA is well-covered overall. Minor gap in legacy API auth specifics for ZWA; extend `references/zwa/api.md`.

---

## 4. Cross-product / shared topics coverage state

| Topic | Vendor doc(s) | Coverage state | Notes |
|---|---|---|---|
| NSS architecture | `about-nss-feeds.md`, `about-nss-servers.md`, `about-cloud-nss-feeds.md`, `about-log-streaming-service.md`, `understanding-nanolog-streaming-service.md`, `General_Guidelines_for_NSS_Feeds_and_Feed_Formats.pdf` | **Covered** | `references/shared/nss-architecture.md` treats this thoroughly; CSV schema files are cited in log-schema references |
| OneAPI / API gateway | `automate-zscaler/getting-started.md`, `automate-zscaler/guides-understanding-oneapi.md`, `automate-zscaler/api-authentication-overview.md`, `automate-zscaler/guides-rate-limiting.md`, `automate-zscaler/guides-response-codes.md` | **Covered** | `references/shared/oneapi.md` cites these; solid coverage |
| OneAPI — Analytics GraphQL | `automate-zscaler/analytics-graphql-api.md`, `automate-zscaler/guides-analytics-api.md` | **Uncovered** | No reference covers the Analytics GraphQL API; needs `references/shared/analytics-graphql.md` or an extension to `references/zdx/api.md` |
| OneAPI — BI API | `automate-zscaler/api-reference-bi-overview.md` | **Uncovered** | Not in any reference; unclear scope but warrants a note in `references/shared/oneapi.md` |
| Postman / SDK tools | `automate-zscaler/tools-and-sdks.md`, `automate-zscaler/tools-postman-collection.md`, `automate-zscaler/postman-collection-note.md` | **Partial** | Mentioned in `references/shared/oneapi.md`; the tooling catalog detail is absent |
| SCIM provisioning | `understanding-scim-zia.md`, `about-scim-zpa.md` | **Partial** | `references/shared/scim-provisioning.md` exists; ZIA-specific and ZPA-specific SCIM nuances are thin |
| Source IP anchoring | `understanding-source-ip-anchoring.md`, `understanding-source-ip-anchoring-direct.md`, `configuring-source-ip-anchoring.md`, `configuring-forwarding-policies-source-ip-anchoring-using-zpa.md`, `sipa-microsoft-365-conditional-access-config.md` | **Partial** | `references/shared/source-ip-anchoring.md` covers the main pattern; direct anchoring and M365 CA integration are partial/absent |
| Subclouds | `understanding-subclouds.md` | **Covered** | `references/shared/subclouds.md` |
| PAC files | `understanding-pac-file.md`, `writing-pac-file.md`, `about-hosted-pac-files.md`, `best-practices-writing-pac-files.md`, `using-custom-pac-file-forward-traffic-zia.md`, `using-default-zscaler-kerberos-pac-file.md` | **Covered** | `references/shared/pac-files.md` treats this well; Kerberos PAC file is mentioned therein |
| GRE tunnels | `understanding-generic-routing-encapsulation-gre.md`, `best-practices-deploying-gre-tunnels.md`, `gre-deployment-scenarios.md` | **Partial** | `references/zia/traffic-forwarding-methods.md` covers GRE as a method; deployment scenarios and best practices not fully captured |
| Cloud architecture / Subclouds | `understanding-zscaler-cloud-architecture.md` | **Covered** | `references/shared/cloud-architecture.md` cites this |
| Business continuity | `understanding-business-continuity-cloud-components.md` | **Covered** | Treated in `_portfolio-map.md` and `references/shared/cloud-architecture.md` |
| Admin RBAC | `admin-rbac-captures.md` | **Covered** | `references/shared/admin-rbac.md` cites this |
| Activation workflow | `legacy-activation.md`, `zia-activation.md` | **Covered** | `references/shared/activation.md` |
| Proxy mode | `understanding-proxy-mode.md` | **Covered** | `references/zia/proxy-mode.md` |
| Multi-cluster load sharing | `understanding-multi-cluster-load-sharing.md` | **Partial** | `references/shared/cloud-architecture.md` touches this; multi-cluster enforcement semantics not fully explained |

---

## 5. Covered docs — confirmation log

The following vendor docs are demonstrably covered by reference files (primary or major secondary treatment). Listed by reference file for traceability.

**`references/zia/ssl-inspection.md`** covers: `About_SSL_TLS_Inspection_Policy.pdf`, `Best_Practices_for_Testing_and_Rolling_Out_SSL_TLS_Inspection.pdf`, `SSL_Inspection_Deployment_and_Operations_Guide.pdf`, `ZIA_SSL_Inspection_Leading_Practices_Guide.pdf`, `configuring-ssl-tls-inspection-policy.md`, `configuring-ssl-inspection-zscaler-client-connector.md`

**`references/zia/url-filtering.md`** covers: `About_URL_Categories.pdf`, `Configuring_the_URL_Filtering_Policy.pdf`, `URL_Filtering_Deployment_and_Operations_Guide.pdf`, `Configuring_URL_Categories_Using_API.pdf`, `Recommended_URL_&_Cloud_App_Control_Policy.pdf`

**`references/zia/dlp.md`** covers: `about-dlp-dictionaries.md`, `about-dlp-engines.md`, `configuring-dlp-policy-rules-content-inspection.md`, `understanding-predefined-dlp-dictionaries.md`

**`references/zia/cloud-app-control.md`** covers: `about-cloud-application-risk-profile.md`, `adding-cloud-application-risk-profile.md`, `adding-instant-messaging-rule-cloud-app-control.md`, `adding-rules-cloud-app-control-policy.md`, `Cloud_App_Control_Deployment_and_Operations_Guide.pdf`, `understanding-cloud-app-categories.md`

**`references/zia/firewall.md`** covers: `configuring-firewall-policies.md`, `about-ips-control.md`, `about-file-type-control.md`, `about-ftp-control.md`

**`references/zia/malware-and-atp.md`** covers: `configuring-advanced-threat-protection-policy.md`, `configuring-malware-protection-policy.md`, `recommended-advanced-threat-protection-policy.md`, `recommended-malware-protection-policy.md`

**`references/zia/locations.md`** covers: `about-location-groups.md`, `configuring-dynamic-location-groups.md`, `configuring-manual-location-groups.md`, `understanding-sublocations.md` (partial)

**`references/zia/bandwidth-control.md`** covers: `about-bandwidth-control.md`, `adding-bandwidth-classes.md`, `bandwidth-control-policy-example.md`

**`references/zia/tenant-profiles.md`** covers: `about-tenant-profiles.md`, `adding-tenant-profiles.md`

**`references/zia/authentication.md`** covers: `configuring-authentication-levels.md`, `legacy-authentication-settings.md`, `legacy-user-authentication-settings.md`

**`references/zia/proxy-mode.md`** covers: `understanding-proxy-mode.md`

**`references/zia/forwarding-control.md`** covers: `configuring-forwarding-policies-source-ip-anchoring-using-zpa.md` (partial)

**`references/zia/private-service-edge.md`** covers: `about-private-service-edges.md` (ZIA), `about-public-service-edges-internet-saas.md`, `about-virtual-service-edges-internet-saas.md`, `understanding-private-service-edge-internet-saas.md`

**`references/shared/pac-files.md`** covers: `understanding-pac-file.md`, `writing-pac-file.md`, `about-hosted-pac-files.md`, `best-practices-writing-pac-files.md`, `using-custom-pac-file-forward-traffic-zia.md`, `using-default-zscaler-kerberos-pac-file.md`

**`references/shared/nss-architecture.md`** covers: `about-nss-feeds.md`, `about-nss-servers.md`, `about-cloud-nss-feeds.md`, `about-log-streaming-service.md`, `understanding-nanolog-streaming-service.md`, `General_Guidelines_for_NSS_Feeds_and_Feed_Formats.pdf`

**`references/shared/oneapi.md`** covers: `automate-zscaler/getting-started.md`, `automate-zscaler/guides-understanding-oneapi.md`, `automate-zscaler/api-authentication-overview.md`, `automate-zscaler/guides-rate-limiting.md`, `automate-zscaler/guides-response-codes.md`, `legacy-api-rate-limit-summary.md`, `legacy-api-response-codes-and-error-messages.md`, `legacy-securing-zia-apis-oauth-2.0.md`

**`references/shared/source-ip-anchoring.md`** covers: `understanding-source-ip-anchoring.md`, `understanding-source-ip-anchoring-direct.md` (partial), `configuring-source-ip-anchoring.md`

**`references/shared/scim-provisioning.md`** covers: `understanding-scim-zia.md` (partial), `about-scim-zpa.md` (partial)

**`references/shared/subclouds.md`** covers: `understanding-subclouds.md`

**`references/shared/cloud-architecture.md`** covers: `understanding-zscaler-cloud-architecture.md`, `understanding-business-continuity-cloud-components.md`, `understanding-multi-cluster-load-sharing.md` (partial)

**`references/shared/admin-rbac.md`** covers: `admin-rbac-captures.md`

**`references/shared/activation.md`** covers: `legacy-activation.md`, `zia-activation.md`

**`references/zpa/app-connector.md`** covers: `about-app-connectors.md`, `about-connector-provisioning-keys.md`, `understanding-connector-software-updates.md`, `zpa-about-connector-groups.md`, `Access_Policy_Deployment_and_Operations_Guide.pdf`, `Understanding_App_Connector_Metrics_Log_Fields.pdf`

**`references/zpa/appprotection.md`** covers: `about-appprotection-applications.md`, `about-appprotection-controls.md`, `about-appprotection-policy.md`, `about-appprotection-profiles.md`, `about-active-directory-controls.md`, `configuring-appprotection-policies.md`, `protecting-private-applications-zpa-appprotection.md`

**`references/zpa/browser-access.md`** covers: `about-browser-access.md`, `using-wildcard-certificates-browser-access-applications.md`

**`references/zpa/microtenants.md`** covers: `about-microtenants.md`, `configuring-microtenants.md`

**`references/zpa/emergency-access.md`** covers: `about-emergency-access-users.md`, `configuring-emergency-access.md`

**`references/zpa/privileged-remote-access.md`** covers: `privileged-remote-access-captures.md`

**`references/zpa/posture-profiles.md`** covers: `about-device-posture-profiles.md`, `configuring-device-posture-profiles.md`

**`references/zpa/trusted-networks.md`** covers: `about-machine-groups.md` (partial — ZPA machine groups only)

**`references/zpa/policy-precedence.md`** covers: `About_Policies.pdf`, `Understanding_Policy_Enforcement.pdf`, `About_Access_Policy.pdf`, `Access_Policy_Configuration_Examples.pdf`, `Configuring_Access_Policies.pdf`, `Configuring_Advanced_Policy_Settings.pdf`, `Configuring_Defined_Application_Segments.pdf`, `Using_Application_Segment_Multimatch.pdf`, `Understanding_Application_Access.pdf`

**`references/zpa/app-segments.md`** covers: `about-segment-groups.md` (partial), `zpa-user-to-app-segmentation-refarch.pdf`

**`references/zpa/segment-server-groups.md`** covers: `about-segment-groups.md` (partial)

**`references/zpa/public-service-edges.md`** covers: `about-public-service-edges-internet-saas.md`, `understanding-private-access-architecture.md`

**`references/zpa/log-receivers.md`** covers: `Understanding_the_Log_Stream_Content_Format.pdf`, `Understanding_User_Activity_Log_Fields.pdf`, `Understanding_User_Status_Log_Fields.pdf`

**`references/zcc/z-tunnel.md`** covers: `about-z-tunnel-1.0-z-tunnel-2.0.md`, `migrating-z-tunnel-1.0-z-tunnel-2.0.md`, `best-practices-deploying-z-tunnel-2.0.md`, `best-practices-adding-bypasses-z-tunnel-2.0.md`

**`references/zcc/forwarding-profile.md`** covers: `about-forwarding-profiles.md`, `configuring-forwarding-profiles-zscaler-client-connector.md`, `searching-app-profile.md` (partial)

**`references/zcc/install-parameters.md`** covers: `supported-parameters-zscaler-client-connector-ios.md`, `supported-parameters-zscaler-client-connector-macos.md`, `supported-parameters-zscaler-client-connector-windows.md`, `parameters-guide-zscaler-client-connector-android-and-android-chromeos.md`

**`references/zcc/device-posture.md`** covers: `about-device-posture-profiles.md` (ZCC), `configuring-device-posture-profiles.md`, `configuring-client-certificate-posture-check-linux.md`

**`references/zcc/devices.md`** covers: `configuring-automated-device-cleanup.md`, `what-is-zscaler-client-connector.md`

**`references/zcc/web-policy.md`** covers: `configuring-port-zscaler-app-listen.md` (partial)

**`references/zcc/web-privacy.md`** covers: `configuring-zscaler-client-connector-collect-device-owner-information.md`, `configuring-zscaler-client-connector-collect-hostnames.md`, `configuring-user-access-logging-controls-zscaler-client-connector.md` (partial)

**`references/zcc/trusted-networks.md`** covers: (no specific vendor doc; derived from SDK)

**`references/zcc/sdk.md`** covers: `about-zscaler-client-connector-app-profiles.md`, `configuring-zscaler-client-connector-app-profiles.md`, `legacy-getting-started-client-connector-api.md`, `legacy-understanding-zscaler-client-connector-api.md`, `legacy-understanding-rate-limiting-zcc.md` (partial)

**`references/zcc/api.md`** covers: `legacy-about-error-codes-zcc.md` (partial), `legacy-getting-started-client-connector-api.md`

**`references/zdx/overview.md`** covers: `about-zdx-score.md`, `understanding-zdx-cloud-architecture.md`, `viewing-and-configuring-zdx-module-upgrades.md` (partial)

**`references/zdx/probes.md`** covers: `about-probes.md`, `understanding-probing-criteria-logic.md`

**`references/zdx/diagnostics-and-alerts.md`** covers: `understanding-alert-status.md`, `understanding-diagnostics-session-status.md`

**`references/zdx/api.md`** covers: `legacy-api-authentication-zdx.md`, `legacy-getting-started-zdx-api.md`, `understanding-zdx-api.md`

**`references/cloud-connector/aws-deployment.md`** covers: `cbc-deploying-zscaler-cloud-connector-amazon-web-services.md`, `cbc-registering-endpoint-amazon-web-services.md`, `cbc-understanding-cloud-connector-deployments-amazon-web-services-auto-scaling-groups.md`

**`references/cloud-connector/aws-workload-discovery.md`** covers: `cbc-configuring-workload-discovery-workloads-amazon-web-services.md`, `cbc-using-sublocation-scopes-group-cloud-connector-workloads-amazon-web.md`, `cbc-about-amazon-web-services-account-groups.md`, `cbc-about-amazon-web-services-accounts.md`, `cbc-adding-amazon-web-services-account-group.md`, `cbc-adding-amazon-web-services-account.md`, `cbc-analyzing-amazon-web-services-account-details.md`, `cbc-analyzing-amazon-web-services-account-group-details.md`

**`references/cloud-connector/azure-deployment.md`** covers: `cbc-deploying-cloud-connector-microsoft-azure.md`, `cbc-understanding-azure-vmss-deployments.md`, `azure-traffic-forwarding-deployment-guide.md`, `zero-trust-security-azure-workloads-summary.md`

**`references/cloud-connector/forwarding.md`** covers: `cbc-about-traffic-forwarding.md`, `cbc-configuring-traffic-forwarding-rule.md`, `cbc-traffic-forwarding.md`, `choosing-traffic-forwarding-methods.md`

**`references/cloud-connector/dns-subsystem.md`** covers: `cbc-about-dns-gateways.md`, `cbc-about-dns-policies.md`, `cbc-configuring-dns-gateway.md`

**`references/cloud-connector/upgrade-and-credential-rotation.md`** covers: `cbc-managing-cloud-branch-connector-upgrades.md`, `cbc-rotating-zscaler-service-account-passwords.md`

**`references/cloud-connector/overview.md`** covers: `what-zscaler-cloud-connector.md`, `cbc-about-cloud-connector-groups.md`, `cbc-understanding-high-availability-and-failover.md`

**`references/cloud-connector/api.md`** covers: `cbc-understanding-zscaler-cloud-branch-connector-api.md`, `legacy-getting-started-cloud-branch-connector-api.md`

**`references/cloud-connector/sdk.md`** covers: (SDK-derived; `cbc-about-cloud-provisioning-templates.md` and `cbc-configuring-cloud-provisioning-template.md` partially covered)

**`references/zidentity/overview.md`** covers: `what-zidentity.md`, `understanding-zidentity-apis.md`

**`references/zidentity/api-clients.md`** covers: `zidentity-about-api-clients.md`

**`references/zidentity/step-up-authentication.md`** covers: `understanding-step-up-authentication-zidentity.md`, `understanding-step-up-authentication.md` (partial — legacy ZPA step-up not fully distinguished)

**`references/shared/log-correlation.md`** covers: `Understanding_User_Activity_Log_Fields.pdf`, `Understanding_User_Status_Log_Fields.pdf` (partial)

**`references/zbi/overview.md`** covers: `what-is-zero-trust-browser.md`, `understanding-turbo-mode-isolation.md`

**`references/zbi/policy-integration.md`** covers: `zpa-about-isolation-policy.md`, `configuring-smart-browser-isolation-policy.md` (partial)

**`references/deception/overview.md`** covers: `about-deception-strategy.md`, `what-is-zscaler-deception.md`, `about-zpa-app-connectors-deception.md`

**`references/risk360/overview.md`** covers: all 7 Risk360 vendor docs

**`references/zms/overview.md`** covers: all 3 ZMS vendor docs

**`references/zwa/overview.md`** + `references/zwa/api.md` cover: all ZWA vendor docs

---

## 6. Skip pile

Files intentionally not pursued as reference material. One-line entries.

| Filename | Reason to skip |
|---|---|
| `agentic-secops-security-operations-marketing.md` | Marketing — synthesized into `_portfolio-map.md`; no new operational content |
| `asset-exposure-management-caasm-marketing.md` | Marketing — synthesized into `_portfolio-map.md` |
| `data-fabric-for-security-marketing.md` | Marketing — synthesized into `_portfolio-map.md` |
| `dspm-marketing.md` | Marketing — synthesized into `_portfolio-map.md` |
| `easm-introducing-marketing.md` | Marketing intro — `easm-what-is-zscaler-easm.md` cited in `_portfolio-map.md`; this is duplicative |
| `easm-what-is-zscaler-easm.md` | Awareness-level marketing — covered in `_portfolio-map.md` |
| `itdr-zscaler-identity-protection-marketing.md` | Marketing — synthesized into `_portfolio-map.md` |
| `microsoft-copilot-security-marketing.md` | Marketing — synthesized into `_portfolio-map.md` |
| `microsegmentation-marketing.md` | Marketing — synthesized into `_portfolio-map.md` and `references/zms/overview.md` |
| `risk360-product-marketing.md` | Marketing — synthesized into `references/risk360/overview.md` |
| `security-operations-suite-marketing.md` | Marketing umbrella — synthesized into `_portfolio-map.md` |
| `shadow-it-marketing.md` | Marketing — `shadow-it-saas-security-report-zia.md` is the operational doc |
| `uvm-unified-vulnerability-management-marketing.md` | Marketing — synthesized into `_portfolio-map.md` |
| `zero-trust-exchange-zte-marketing.md` | Marketing — synthesized into `_portfolio-map.md` |
| `zero-trust-microsegmentation-marketing.md` | Marketing — synthesized into `_portfolio-map.md` and `references/zms/overview.md` |
| `zscaler-b2b-marketing.md` | Marketing — synthesized into `_portfolio-map.md` |
| `zscaler-cellular-marketing.md` | Marketing — synthesized into `_portfolio-map.md` |
| `zscaler-govcloud-innovations.md` | Marketing / federal cloud innovations highlight reel — synthesized into `_portfolio-map.md` |
| `zscaler-government-public-sector-marketing.md` | Marketing — synthesized into `_portfolio-map.md` |
| `zscaler-resilience-marketing.md` | Marketing — synthesized into `_portfolio-map.md` |
| `ai-security-marketing.md` | Marketing — synthesized into `references/ai-security/overview.md` |
| `ai-guardrails-marketing.md` | Marketing — synthesized into `references/ai-security/overview.md` |
| `shadow-it-saas-security-report-zia.md` | Partially operational but primarily a report walkthrough; `_portfolio-map.md` covers it adequately for Tier 2 awareness; upgrade to reference if ZINS/GraphQL API coverage is deepened |
| `legacy-apis-home.md` | Landing page / navigation document; no content beyond links |
| `legacy-getting-started.md` | Generic onboarding walkthrough; not product-specific; covered by individual product getting-started docs |
| `legacy-configuring-postman-rest-api-client.md` | Postman UI steps only; superceded by `automate-zscaler/tools-postman-collection.md` |
| `configuring-app-update-zscaler-client-connector-app-store.md` | App store deployment via MDM; narrow scope; MDM deployment covered in install-parameters reference |
| `deploying-zscaler-client-connector-google-workspace-android.md` | Android MDM via Google Workspace — narrow; covered conceptually by install-parameters |
| `automate-zscaler/api-reference-zpa-from-postman.md` | Postman-collection import walkthrough for ZPA; UI navigation only; no new API semantics |
| `automate-zscaler/api-reference-zia-sample-endpoints.md` | Sample endpoint list; content is redundant with `references/zia/api.md` |
| `README.md` | Corpus README; metadata only |
| `NOTICE` | License notice |
| `nss-dns-logs.csv`, `nss-firewall-logs.csv`, `nss-web-logs.csv` | Schema CSV files — already cited verbatim in `references/zia/logs/*.md`; no additional prose to synthesize |
| `legacy-managing-cloud-service-api-key.md` | Legacy API key management UI steps; covered at concept level in `references/shared/oneapi.md` |
| `verifying-access-to-applications.md` | ZPA access test walkthrough — UI-driven troubleshooting; useful but low priority; portal navigation |
| `configuring-port-zscaler-app-listen.md` | ZCC listen port configuration — narrow operational setting; mentioned in `references/zcc/z-tunnel.md` |
| `configuring-user-access-restart-and-repair-options-zscaler-client-connector.md` | ZCC end-user repair options — UI/UX only; very low priority for reference corpus |
| `understanding-probing-criteria-logic.md` | ZDX probing logic — covered in `references/zdx/probes.md` |
| `understanding-zdx-cloud-architecture.md` | ZDX architecture — covered in `references/zdx/overview.md` |
| `viewing-and-configuring-zdx-module-upgrades.md` | ZDX agent upgrade UI — low priority; not operational depth |
| `cbc-zero-trust-security-aws-workloads-zscaler-cloud-connector.md` | Architecture summary — covered in `references/cloud-connector/aws-deployment.md` |
| `zsdk-what-my-cloud-name-zsdk.md` | ZSDK cloud name lookup — trivial admin task |
| `zsdk-what-zscaler-sdk-mobile-apps.md` | ZSDK product intro — covered in `_portfolio-map.md` ZSDK section |
| `zsdk-register-your-app.md` | ZSDK app registration UI walkthrough — low operational depth; developer onboarding |
| `zsdk-step-step-configuration-guide-zsdk.md` | ZSDK setup wizard walkthrough — portal UI navigation |
| `legacy-api-authentication.md` | Legacy API auth generic — superseded by OneAPI / `references/shared/oneapi.md` |
| `legacy-understanding-zia-api.md` | Legacy ZIA API overview — largely synthesized into `references/zia/api.md` |
| `legacy-understanding-zpa-api.md` | Legacy ZPA API overview — synthesized into `references/zpa/api.md` |
| `automate-zscaler/postman-collection-note.md` | Note about Postman collection availability — trivial |

---

## 7. Recommended next-doc list

Prioritized by operational value to the skill's primary audience (operators, developers, architects using ZIA/ZPA/ZCC/CBC APIs).

| Priority | Vendor doc(s) to synthesize | Proposed reference file | Rationale |
|---|---|---|---|
| 1 | `automate-zscaler/analytics-graphql-api.md`, `automate-zscaler/guides-analytics-api.md` | `references/shared/analytics-graphql.md` | Analytics GraphQL is the only API surface for ZINS/SaaS Security Report and ZDX trend data; no reference covers it; affects operators building dashboards and SIEM integrations |
| 2 | `about-machine-tunnels.md`, `configuring-zpa-machine-tunnel-all.md` | `references/zpa/machine-tunnels.md` | Machine tunnels are asked about frequently in ZPA deployments (AD pre-auth before user login); no reference covers ZPA-side machine tunnel policy; ZCC z-tunnel.md only covers the agent side |
| 3 | `about-saas-security-insights-logs.md`, `about-saas-security-scan-configuration.md`, `shadow-it-saas-security-report-zia.md` | `references/zia/api-casb.md` | API CASB (out-of-band scanning + SaaS Security Report) has no reference doc; ZIA SDK exposes this surface; operators integrating CASB findings with SIEM/ticketing need the log schema and scan config |
| 4 | `about-iot-report.md` | `references/zia/iot-report.md` | IoT device visibility is a distinct ZIA capability with its own policy surface (`iot_policy.py`); no reference; operators in OT/IoT environments need this |
| 5 | `about-private-service-edges.md`, `about-private-service-edge-groups.md` (ZPA) | `references/zpa/private-service-edges.md` | ZPA PSEs are architecturally important for regulated/on-prem deployments; current references cover ZIA PSEs well but ZPA PSEs have no dedicated doc |
| 6 | `cbc-about-insights.md`, `cbc-accessing-cloud-branch-connector-monitoring.md`, `cbc-analyzing-branch-connector-details.md` | `references/cloud-connector/monitoring.md` | Day-2 observability for CBC is not covered; operators managing large Cloud Connector deployments need to understand the Insights dashboard and per-connector metrics |
| 7 | `sipa-microsoft-365-conditional-access-config.md` | Extend `references/shared/source-ip-anchoring.md` with M365 CA section | M365 Conditional Access + SIPA is a very common enterprise integration pattern; current source-IP-anchoring reference doesn't cover the M365 CA configuration steps |
| 8 | `understanding-scim-zia.md`, `about-scim-zpa.md` | Extend `references/shared/scim-provisioning.md` | ZIA SCIM (group→department mapping, attribute constraints) and ZPA SCIM (group→policy conditions) have distinct mechanics; the shared SCIM doc is thin on product-specific differences |
| 9 | `about-machine-groups.md` (ZIA) | Extend `references/zia/forwarding-control.md` or new `references/zia/machine-groups.md` | ZIA machine groups are used as policy match conditions in forwarding and firewall rules; SDK exposes them; no reference explains their semantics |
| 10 | `legacy-about-error-codes-zcc.md` | `references/zcc/troubleshooting.md` | ZCC error codes are high-frequency help-desk topics; no reference covers them; a troubleshooting reference would also absorb ZCC connection diagnostics |
| 11 | `cbc-about-source-ip-groups.md` | Extend `references/cloud-connector/forwarding.md` | CBC Source IP Groups are a match-condition object in traffic forwarding rules; SDK exposes them (`ztw/source_ip_groups.py`); not explained in references |
| 12 | `about-saml-attributes.md` | Extend `references/shared/scim-provisioning.md` or `references/zpa/policy-precedence.md` | SAML attribute objects are used as policy conditions in ZPA access policies; their semantics (how to author them, what values are valid) are not in any reference |
| 13 | `understanding-step-up-authentication.md` (legacy, non-ZIdentity) | Extend `references/zidentity/step-up-authentication.md` | Older ZPA-native step-up auth has different config objects than ZIdentity step-up; operators on legacy deployments hit confusion; the distinction should be explicit in the reference |
| 14 | `zsdk-understanding-zsdk-error-codes.md`, `zsdk-ranges-limitations.md`, `zsdk-best-practices.md` | New `references/zidentity/zsdk-reference.md` (or extend `_portfolio-map.md` ZSDK section) | ZSDK is Tier 2a with many vendor captures but no dedicated reference file beyond the portfolio map; developer-facing content (error codes, limits, best practices) warrants a lightweight reference |
| 15 | `automate-zscaler/api-reference-bi-overview.md`, `automate-zscaler/tools-and-sdks.md` | Extend `references/shared/oneapi.md` | BI API and tooling catalog fill gaps in the OneAPI reference; low effort, high completeness value |

---

*Audit conducted 2026-04-26. Based on static analysis of vendor corpus and reference files — no live API queries or portal access used. Where vendor doc content was unclear from filename alone, the filename slug was treated as the canonical topic indicator. Confidence is high for covered/uncovered classification; priority rankings reflect judgment about operational frequency and API-exposure value.*
