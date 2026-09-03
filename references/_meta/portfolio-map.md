---
product: shared
topic: "portfolio-map"
title: "Zscaler product portfolio map"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
confidence: medium
source-tier: mixed
sources:
  - "https://www.zscaler.com/products-and-solutions"
  - "vendor/zscaler-help/automate-zscaler/getting-started.md (documented OneAPI baseline)"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-help/zero-trust-exchange-zte-marketing.md"
  - "vendor/zscaler-help/data-fabric-for-security-marketing.md"
  - "vendor/zscaler-help/security-operations-suite-marketing.md"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/zid_service.py"
  - "vendor/zscaler-sdk-go/zscaler/ziam/services/resource_servers/resource_servers.go"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/pyproject.toml"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policies.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/custom_apps.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/report_configs.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/reports.py"
  - "vendor/zscaler-help/bi-what-zscaler-business-insights.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-help/ai-guard-users-help-index.md"
  - "vendor/zscaler-help/ai-access-security-marketing.md"
  - "vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md"
  - "vendor/zscaler-help/zscaler-cellular-help-index.md"
  - "vendor/zscaler-help/cbc-about-amazon-web-services-zero-trust-gateways.md"
  - "vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md"
  - "vendor/zscaler-help/zero-trust-gateway-marketing.md"
  - "vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/aiguard/detection-policies/detections-policy-resource-disable-detections-policy"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/ai-security/aisecurity/v1-assets-agents/agents-list-agents"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zcell/sim-management/sim-resource-get-tower-location-history"
  - "vendor/zguard-ai-integrations/README.md"
author-status: draft
---

# Zscaler product portfolio map

Single-page index of **every product Zscaler markets**, with depth-of-coverage in this skill marked per entry. Goal: the skill should be **articulate about everything Zscaler ships**, even where deep-dive content doesn't exist. Customers, prospects, and team members ask about the breadth; this map ensures we don't draw blanks.

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-help/zero-trust-exchange-zte-marketing.md`; `vendor/zscaler-help/security-operations-suite-marketing.md`.

Five coverage tiers. API/IaC surface is the primary axis; content depth is the secondary axis:

- **Tier 1 — Core products.** Have SDK/TF/OneAPI surface AND substantive multi-component coverage in `references/<product>/`. Where the skill earns its depth claim. Answer with full operational depth.
- **Tier 2 — Programmable but shallow.** Have an SDK/TF surface — programmable, or read-only/query-only — but reference coverage is thin (may not match a single Tier 1 sub-component's depth). Answer with full confidence on what's documented; explicitly note the coverage gap when relevant.
- **Tier 3 — Reasoning content, no verified SDK/TF management surface.** Reasoning docs exist under `references/<product>/`, but no supported management client is captured. A product may still have a narrow raw endpoint or integration surface; state that exact boundary instead of applying a blanket "no API" claim. Do NOT fabricate API specifics.
- **Tier 4 — Paragraph-only awareness.** No SDK, no dedicated reasoning content. One-paragraph treatment in this map. Skill recognizes + describes briefly; redirects to TAM / help.
- **Tier 5 — Out of scope.** Deprecated / historical / unreleased. Currently empty. Reserved for products not currently worth investment; watched for promotion-worthy changes.

**Architectural pillars** (Zero Trust Exchange, Data Fabric for Security, Agentic SecOps) are not products — they are marketing umbrellas / capability layers across products. They stay outside the tier system and are documented separately near the top of this map.

**CASB** is also outside the tier system — it is a federation of ZIA features + DSPM, not a standalone Zscaler SKU. Documented as a disambiguation entry.

## Architectural pillars (the platform-level naming)

These aren't products — they're how Zscaler markets the platform layer that ties products together. Customers reference them in conversation; the skill needs to recognize them.

Source: `vendor/zscaler-help/zero-trust-exchange-zte-marketing.md`; `vendor/zscaler-help/data-fabric-for-security-marketing.md`; `vendor/zscaler-help/agentic-secops-security-operations-marketing.md`.

| Pillar | What it names | Coverage |
|---|---|---|
| **Zero Trust Exchange (ZTE)** | The unified policy + enforcement plane underlying all products. Zscaler's marketing umbrella — "500 trillion daily signals," four-stage model (Verify Identity / Determine Destination / Assess Risk / Enforce Policy), ~45% Fortune 500 adoption, 2025 Gartner SSE Leader. Capture: `vendor/zscaler-help/zero-trust-exchange-zte-marketing.md`. | Awareness with capture |
| **Data Fabric for Security** | Aggregation + unification layer powered by the Avalor acquisition. **150 pre-built integrations**, AnySource connector. Backbone of CTEM / Risk360 / UVM / Asset Exposure Mgmt — all the Exposure Management stack uses Data Fabric as the underlying data layer. Capture: `vendor/zscaler-help/data-fabric-for-security-marketing.md`. | Awareness with capture |
| **Agentic SecOps** | **No dedicated product URL** — capability layer within the broader **Security Operations** marketing page. AI agents trained on 11+ years of telemetry; "99.7% threat accuracy" claimed; Red Canary MDR integration is core. Bigger than the name implies: encompasses **EASM, Asset Exposure Mgmt, UVM, Risk360, CTEM, Deception, Red Canary MDR** as one suite, with Agentic SecOps as the AI automation layer across all of them. Projected $400M+ ARR FY26. Capture: `vendor/zscaler-help/agentic-secops-security-operations-marketing.md`. | Awareness with capture |
| **Zero Trust for Users / Workloads / Branch / B2B** | The four customer-segment pillars. Maps to product groupings rather than discrete SKUs. | Implicit in product docs |

## Tier 1 — Core products (6 products)

Each has SDK / TF / OneAPI exposure AND a dedicated `references/<product>/` directory with multiple reasoning docs. Where the skill earns its depth claim.

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`.

| Product | What it does | Deep-dive entry | API exposure |
|---|---|---|---|
| **ZIA — Internet & SaaS** | Cloud-delivered secure web gateway. URL filtering, SSL inspection, CAC, DLP, sandbox, malware/ATP, firewall, IPS, bandwidth, FTP/file-type. The "secure forward proxy" of the suite. | [`zia/index.md`](../zia/index.md) | Python `zscaler/zia/` + Go `zscaler/zia/` + TF `terraform-provider-zia` |
| **ZPA — Private Access** | Zero-trust application access for private apps without VPN. App segments, policy precedence, App Connectors, Browser Access, PRA. Includes **AppProtection** (inline WAF/IPS — OWASP CRS, ThreatLabz, AD protocol controls for Kerberos/SMB/LDAP, API, WebSocket; Browser Protection tier-gated; was previously called "Inspection") as a sub-component bundled into the ZPA SDKs and TF provider. | [`zpa/index.md`](../zpa/index.md) | Python `zscaler/zpa/` (incl `app_protection.py`) + Go `zscaler/zpa/` (incl `app_protection/`) + TF `terraform-provider-zpa` (incl `zpa_inspection_*` resources) |
| **ZCC — Client Connector** | The endpoint agent that forwards user traffic into the cloud. Forwarding profiles, trusted networks, web policy, devices, entitlements, Z-Tunnel. | [`zcc/index.md`](../zcc/index.md) | Python `zscaler/zcc/` + Go `zscaler/zcc/` + TF `terraform-provider-zcc` |
| **ZDX — Digital Experience** *(T1 borderline — see note below)* | User experience monitoring across apps, networks, endpoints. Probes, ZDX Score, diagnostics sessions (deeptraces), alerts. | [`zdx/index.md`](../zdx/index.md) | Python `zscaler/zdx/` + Go `zscaler/zdx/` |
| **ZIdentity** | Unified identity + auth platform for the Zscaler ecosystem. OneAPI OAuth, API Clients, step-up auth, admin RBAC. | [`zidentity/index.md`](../zidentity/index.md) | Python `client.zid.*` (including full API-client/secret CRUD at singular `client.zid.api_client`) + Go `zscaler/ziam/services/`; resource servers are read-only in both SDKs, and the refreshed Go SDK also has typed API-client/secret operations (client-side coverage only) |
| **Cloud & Branch Connector / Zero Trust Gateway (ZTW / ZTC / CBC / ZTG)** | Product family spanning customer-deployed Cloud/Branch Connector infrastructure and the distinct Zscaler-managed Zero Trust Gateway service. Current cloud-specific Help establishes AWS and GCP ZTG as Limited Availability and Support-enabled; exact Azure ZTG deployment availability remains unresolved (`vendor/zscaler-help/cbc-about-amazon-web-services-zero-trust-gateways.md:8-21`; `vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:8-17`; see [`cloud-connector/overview.md`](../cloud-connector/overview.md)). | [`cloud-connector/index.md`](../cloud-connector/index.md) | Python v1.x GA `client.ztw.*` remains present in current v1.9.44 (`vendor/zscaler-sdk-python/pyproject.toml:3`; ZTW is absent from the `2.0.0bN` beta) + Go `zscaler/ztw/` + TF `terraform-provider-ztc` cover the product-family management surface; do not infer full managed-ZTG API parity from those clients. |

Lifecycle corrections in those two rows are pinned by the Python ZIdentity service/accessors (`vendor/zscaler-sdk-python/zscaler/zid/zid_service.py:18-68`), the refreshed Go read-only Resource Server methods and API-client package (`vendor/zscaler-sdk-go/zscaler/ziam/services/resource_servers/resource_servers.go:60-74`; `vendor/zscaler-sdk-go/zscaler/ziam/services/api_clients/api_clients.go:181-201,249-385`), the Python ZTW accessor (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:303-310`), and the v2 beta coverage boundary (`vendor/zscaler-sdk-python/CHANGELOG.md:491-512`). SDK declarations establish client-side coverage only; they do not prove backend availability or tenant entitlement.

> **ZDX classification note.** ZDX is flagged T1 borderline — it sits at the observability layer (probes, ZDX Score, deeptraces) without verified operational coupling to ZIA / ZPA / ZCC policy enforcement. The SDK + reasoning content meet the T1 bar; the open question is whether ZDX's role as a passive monitor rather than a policy plane warrants reclassification. Re-evaluate when cross-product policy hooks are documented or when their absence is confirmed. Review note: 2026-05-04 portfolio-map tier cleanup verification gate.

### Marketing-name aliases (Tier 1)

The skill uses SDK namespace names (ZIA, ZPA, etc.) as canonical reference paths under `references/<product>/`. Marketing names that map to the same Tier 1 product:

- **"Internet & SaaS"** = **ZIA**. SDK namespace is `zia`.
- **"Private Access"** = **ZPA**. SDK namespace is `zpa`. **AppProtection** (formerly "Inspection") lives inside the ZPA SDKs / TF provider — not a separate product.
- **"Digital Experience"** = **ZDX**. SDK namespace is `zdx`.
- **"Client Connector"** = **ZCC**. SDK namespace is `zcc`.
- **"Cloud / Branch Connector" / "ZTW" / "ZTC" / "CBC"** all map to the same product family — canonical reference is `references/cloud-connector/`. SDK namespace is `ztw`.

(ZBI and ZWA marketing aliases live in the Tier 2 section now that those products are classified T2.)

## Tier 2 — Programmable but shallow (7 products)

Have an SDK / TF surface — programmable, or read-only/query-only — but reference coverage is thin compared to Tier 1 (may not match a single Tier 1 sub-component's depth). Answer with full confidence on what's documented; explicitly note the coverage gap when relevant. Promotion to T1 is appropriate when reference coverage broadens to multi-component depth.

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`.

| Product | What it does | Deep-dive entry | API exposure |
|---|---|---|---|
| **ZBI — Cloud Browser Isolation** | Remote-browser rendering for risky / unmanaged-device scenarios. Isolation profiles, Smart Browser Isolation, ZPA Isolation Policy. Marketed as "Zero Trust Browser." | [`zbi/index.md`](../zbi/index.md) | Python `zscaler/zia/cloud_browser_isolation.py` + Go `zscaler/zpa/services/cloudbrowserisolation/*` |
| **ZWA — Workflow Automation** | DLP incident lifecycle management. Incident triage, workflows, ticketing/notification integrations. Downstream of ZIA DLP. | [`zwa/index.md`](../zwa/index.md) | Python `zscaler/zwa/` + Go `zscaler/zwa/` |
| **AI Guard** | Runtime prompt/response policy detection for AI and LLM applications. The current 25-article Help tree also covers User-mode architecture, quick starts, prompt allowlisting, topology, token usage, audit, and troubleshooting; current custom-block-message and user/group-sync bodies are captured, though several others remain uncaptured (`vendor/zscaler-help/ai-guard-users-help-index.md:8-48`). | [`ai-security/index.md`](../ai-security/index.md) | Python `zscaler/aiguard/` exposes 39 callable methods across six OneAPI configuration resources; `LegacyAIGuardClient` separately routes policy detection (`vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:671-712`; resource inventories in `vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357`, `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338`, `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457`, `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362`, `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363`, `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412`). The current public Automate operation pages publish 47 operations across 29 paths, so Python lacks eight callable operations; representative current pages include [disable detection policy](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/aiguard/detection-policies/detections-policy-resource-disable-detections-policy) and [regenerate application credential](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/aiguard/llm-application-credentials/llm-application-credentials-resource-regenerate-llm-application-credentials). The durable 2026-08-12 route table recorded no AI Guard operations, but that historical publication absence does not establish endpoint retirement or backend unavailability (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10`, `:156-160`; `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:19-23`). No verified Go SDK, Terraform, MCP, Postman, or Automation Hub wrapper covers that admin plane. |
| **ZMS — Zscaler Microsegmentation** | East-west / workload-to-workload policy via host agents (Win/Linux); AI policy recommendations (14-day rolling telemetry); local OS enforcement (WFP / nftables). Positioned as a ZPA add-on. | [`zms/overview.md`](../zms/overview.md) · [`zms/api.md`](../zms/api.md) | Python `zscaler/zms/` **read-only** GraphQL (`client.zms.*`, `POST /zms/graphql`); no Go SDK, no Terraform. Write config portal-only. |
| **EASM — External Attack Surface Management** | Outside-in discovery of internet-exposed assets (domains/IPs/services/certs); CISA-KEV + EPSS risk prioritization. Exposure Management suite; distinct from AEM (inside-out CAASM). | [`easm/overview.md`](../easm/overview.md) | Python `zscaler/zeasm/` **read-only** (organizations, findings, lookalike domains); no Go SDK. |
| **ZCell — Zscaler Cellular** | SIM / Cellular Edge management surface for IoT/OT cellular connectivity: anomaly policies, SIM inventory/actions, SIM analytics, SIM location groups, tags, customer regions, audit, tower-location history, and network-event search. The current Help index exposes 21 articles; seven bodies are captured and 14 remain uncaptured (`vendor/zscaler-help/zscaler-cellular-help-index.md:8-47`; body inventory in [`zscaler-cellular/index.md`](../zscaler-cellular/index.md)). | [`zscaler-cellular/index.md`](../zscaler-cellular/index.md) · [`zscaler-cellular/api.md`](../zscaler-cellular/api.md) | Current Automate publication remains at 36 operations and adds [tower-location history](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zcell/sim-management/sim-resource-get-tower-location-history); it does not list the former audit-metadata route, which remains in SDK/MCP source. Python `client.zcell.*` and 20 read-only MCP tools with three guided prompts remain captured; no Go SDK, Terraform, or Ansible surface found. |
| **Business Insights** | SaaS application usage/spend analytics and workplace utilization. Read-only with respect to ZIA policy, but its own custom-app and report-configuration objects are writable. | [`business-insights/overview.md`](../business-insights/overview.md) | Python `client.zbi` CRUD for custom apps/report configs plus report list/download; OneAPI Postman coverage under `/bi/api/v1`; no product-specific Go or Terraform surface found. (`client.zbi` here is Business Insights, not Zero Trust Browser.) |

### Marketing-name aliases (Tier 2)

- **"Workflow Automation"** is the marketing name for **ZWA**. Both refer to the same product; canonical reference is `references/zwa/`. (Help portal URL path also still uses `workflow-automation/`, and Zscaler help nav surfaces "Workflow Automation" as the product label — but the SDK / TF / OneAPI scope name is `zwa`, which is what this skill uses.)
- **"Zero Trust Browser" / "ZTB" / "Zscaler Isolation" (legacy) / "Cloud Browser Isolation"** are all marketing names for **ZBI**. Canonical reference is `references/zbi/`. The captured SDK services live under Python `zscaler/zia/cloud_browser_isolation.py` and Go `zscaler/zpa/services/cloudbrowserisolation/*`; Python `client.zbi` is not this product. ZTB is the current marketing abbreviation.
- **"Zscaler Cellular" / "ZCell"** refer to the same product family. Canonical reference is `references/zscaler-cellular/`; Automate uses product key `zcell`, and the Python SDK accessor is `client.zcell`.
- **Business Insights** uses the Python accessor `client.zbi`. Do not expand that accessor as Zero Trust Browser: the latter is the ZBI marketing abbreviation but its captured SDK paths live under ZIA/ZPA Cloud Browser Isolation services.

#### Zscaler Cellular

ZCell is Tier 2 because the captured Automate contract and Python `client.zcell` surface expose SIM, anomaly-policy, analytics, location-group, tag, customer-region, audit, and network-event operations. The MCP surface is narrower and read-only. See [`../zscaler-cellular/index.md`](../zscaler-cellular/index.md) and the product capture at `vendor/zscaler-help/zscaler-cellular-marketing.md`.

#### Business Insights

**Not a security product** — a Zscaler analytics product that uses ZIA's network visibility for two business-leadership use cases: **SaaS Application Management** (license right-sizing, shadow IT discovery, spend optimization, and portfolio-overlap detection) and **Workplace and Workforce Management** (office-utilization trends for hybrid-work, RTO, and capacity planning). ZIA is required for SaaS analytics; ZIA plus ZCC supplies workplace-presence signals. Business Insights is read-only with respect to ZIA policy, but Python `client.zbi` exposes CRUD for its own custom applications and report configurations plus report listing/download. See [`../business-insights/overview.md`](../business-insights/overview.md) and `vendor/zscaler-help/bi-what-zscaler-business-insights.md`.

## Tier 3 — Reasoning content, no verified SDK/TF management surface

No verified SDK / TF management surface. Help-portal + marketing material has been synthesized into reasoning docs under `references/<product>/`. Skill answers conceptual questions with confidence: medium and names the captured programmatic boundary precisely. A narrow raw API or integration endpoint does not by itself establish a supported management client. **Promote to Tier 1 if Zscaler ships an SDK module** and reference coverage is multi-component; promote to Tier 2 if an SDK lands but reference coverage stays thin.

Source: `vendor/zscaler-help/what-is-zscaler-deception.md`; `vendor/zscaler-help/what-risk360.md`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/zsdk-what-zscaler-sdk-mobile-apps.md`; `vendor/zscaler-help/itdr-what-identity-protection.md`; `vendor/zscaler-help/dspm-what-data-security-posture-management.md`; `vendor/zscaler-help/asset-exposure-management-caasm-marketing.md`.
Source: `vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md`; `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md`; `vendor/zscaler-help/bp-what-zscaler-breach-predictor.md`; `vendor/zscaler-help/ztb-what-zero-trust-branch.md`; `vendor/zscaler-help/unified-what-zscaler-experience-center.md`.

#### Zscaler Deception
Active-defense threat detection via decoys (fake servers, AD objects, endpoints, cloud assets); detects post-breach lateral movement / APTs / ransomware; integrates with ZPA via Zero Trust Network decoys. Reasoning doc: [`../deception/overview.md`](../deception/overview.md). The only "SDK presence" is a `ZscalerDeception` permission-flag string in ZCC admin RBAC and a `deceptionSettingsOtp` settings field — neither constitutes a configuration surface. Three help-portal captures synthesized in the overview.

#### Risk360
Cyber risk quantification framework. Monte Carlo financial-loss simulation 1000x/day across 4 scenarios (inherent / residual / 30-day / peer). 115-140+ factors across 4 attack stages × 4 entities, mapped to MITRE ATT&CK / NIST CSF / SEC S-K 106(b). Paid add-on under Security Operations tier. CISO/board audience. Reasoning doc: [`../risk360/overview.md`](../risk360/overview.md). No SDK / TF presence.

#### AI Security family surfaces beyond AI Guard
AI Guard itself is classified Tier 2 because the Python SDK exposes OneAPI configuration resources plus a separately routed legacy runtime policy-detection client. The broader AI Security family includes AI Access Security (current product positioning across public GenAI, embedded SaaS AI, agents, and developer tools), AI Guardrails (marketing umbrella), AI Red Teaming (offline vulnerability assessment with 97 structured Automate operations), and the four-pillar governance framework. The current public operation pages enumerate **114 `ai-security` operations**: 17 read-only AI Security asset/findings operations and 97 AI Red Teaming operations. The 17-operation inventory covers agents, code repositories, data stores, guardrails, identities, issues, MCP servers/tools, and workloads; the durable 2026-08-12 source records the earlier 11+97/108 baseline. Publication is schema evidence, not proof of entitlement, live acceptance, or GA availability (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:7-20`; current [agent inventory page](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/ai-security/aisecurity/v1-assets-agents/agents-list-agents); `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:49`, `:69-165`). Reasoning doc: [`../ai-security/overview.md`](../ai-security/overview.md). Captures include `vendor/zscaler-help/ai-security-marketing.md`, `vendor/zscaler-help/ai-access-security-marketing.md`, `vendor/zscaler-help/ai-guardrails-marketing.md`, `vendor/zscaler-help/ai-guard-what-is.md`, `vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json`, `vendor/zscaler-api-specs/oneapi-postman-collection.json`, and the AI Guard Help subpage captures listed in the AI Security reference frontmatter. The AI Access marketing page proves current positioning and named capabilities, not GA stage, tenant entitlement, API parity, or cloud availability (`vendor/zscaler-help/ai-access-security-marketing.md:8-31`).

#### ZSDK — Zscaler SDK for Mobile Apps
**Different product than ZCC.** ZSDK is a **mobile SDK (iOS/Android) for consumer-facing apps** — app developers embed it into their own mobile app's source code so end users get zero-trust connectivity to back-end services without installing any separate Zscaler agent. Access tokens (JWTs) validate user identity; mTLS microtunnels route traffic to back-end APIs and services hidden behind App Connectors. Shares App Connector + Private Service Edge infrastructure with ZPA but runs on a **dedicated multi-tenant cloud at `admin.zsdkone.net`**. Browser Access (limited availability) extends ZPA-style clientless web-app access to ZSDK-protected apps without requiring SDK integration — auth via IdP JWT in any browser. Configuration is portal-based; no first-party Zscaler API SDK for managing ZSDK config (the SDK *is* the product). Tier 3 not because it lacks substance — 30 pages of help-portal content captured — but because it doesn't fit the "zscaler-sdk-* / terraform-provider-*" management surface this skill primarily targets. Captures under `vendor/zscaler-help/zsdk-*.md`.

#### ITDR — Identity Threat Detection & Response
Marketed as **Zscaler Identity Protection**. Real-time detection and response for identity-based attacks: DCSync, DCShadow, kerberoasting, LDAP enumeration, credential theft, privilege escalation, lateral movement. Built into the ZCC agent (no separate VM); integrates natively with ZPA for real-time threat containment, plus SIEM and EDR for SOC workflows. Provides unified identity risk scoring with MITRE ATT&CK mapping; surfaces risky configurations (shared/stale passwords, unconstrained delegation) and exposed endpoint credentials. Distinct from **ZIdentity** (which is the IdP / authentication layer); ITDR sits on top to detect compromise in flight. **Fill priority** because identity attacks are central to modern zero-trust threat models — 75% of 2023 access attacks were malware-free per CrowdStrike (cited by Zscaler). Reasoning doc: [`../identity-protection/overview.md`](../identity-protection/overview.md). Capture: `vendor/zscaler-help/itdr-zscaler-identity-protection-marketing.md`. No public SDK / TF surface — portal + ZCC agent.

#### DSPM — Data Security Posture Management
AI-powered **at-rest** data security: discovery, LLM-based classification, posture management, access governance, compliance, AI security. Covers IaaS (AWS / Azure / GCP), SaaS, on-prem databases, endpoints, and AI/GenAI services (cloud-hosted models, LLM platforms). **Distinct from ZIA DLP** — DSPM answers "what sensitive data exists and who can access it?" against stored data, while ZIA DLP answers "where is data moving?" inline at the network layer. Together they form full data protection. Notable: AI model discovery (eliminate shadow AI), OWASP-Top-10-for-LLMs assessment, GDPR/HIPAA/PCI/NIST-AI-RMF compliance mapping. Integrates with ZIA / ZPA / DLP / CASB and external ITSM. Reasoning doc: [`../dspm/overview.md`](../dspm/overview.md). Capture: `vendor/zscaler-help/dspm-marketing.md`. Portal-only configuration; no SDK surfaced.

#### AEM — Asset Exposure Management (CAASM)
"Golden record" asset inventory across the enterprise. Aggregates from 150+ data-source connectors (via the Data Fabric for Security from the Avalor acquisition), deduplicates, surfaces coverage gaps (missing EDR, missing controls), maintains CMDB hygiene (auto-discovery of unregistered assets visible in network traffic), runs automated remediation (CMDB enrichment, ticket creation, policy initiation). Marketing claim: typical orgs are missing 20-30% of their assets from inventory. Cluster member of the **Exposure Management suite**: AEM (asset side) + UVM (vulnerability side) + Risk360 (quantification) + EASM (outside-in) + CTEM (continuous program). Reasoning doc: [`../aem/overview.md`](../aem/overview.md). Capture: `vendor/zscaler-help/asset-exposure-management-caasm-marketing.md`. Data-Fabric-powered; integration via 150+ connectors. No customer-facing SDK surfaced.

#### UVM — Unified Vulnerability Management
Risk-based vulnerability prioritization powered by the Data Fabric (Avalor acquisition, March 2025). Out-of-the-box multifactor scoring that considers BOTH risk factors AND mitigating controls (unlike traditional CVSS-only tools); customizable factors and weights; 150+ prebuilt integrations spanning CVE feeds, threat intel, identity, cloud services, user behavior. Distinguishing primitives: **AnySource connector** (integrate flat files / webhooks; new connectors in weeks) and **AnyTarget connector** (push to any downstream). Two-way ticketing integration with auto reconciliation. Marketed metrics: 80% of "critical" issues downgraded to "medium" after context-aware prioritization, 10× triage capacity. Positioned as a CTEM accelerator. Reasoning doc: [`../uvm/overview.md`](../uvm/overview.md). Capture: `vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md`. No customer SDK; integration is via connector framework.

#### SOC Workbench
SecOps-suite product that consolidates alerts from Zscaler and third-party tools into prioritized, context-enriched **incidents** — distinct from raw alerts — using AI-driven correlation against historical attack patterns and business context (user role, asset criticality, vulnerability state). Ingests Zscaler telemetry (ZCC, ZIA, ThreatLabz) plus third-party connectors (CrowdStrike, Microsoft Defender, SentinelOne, Wiz, Snyk, Entra ID, Azure Blob/Cloud Assets) and a generic AnySource connector (S3, GCP, webhook, file upload). Outbound workflow integrations Zscaler calls **"outegrations"** (intentional branding, not a typo) cover Jira and ServiceNow with webhook support. Built on the Data Fabric for Security (shared with AEM / UVM / Identity Protection); ZTE integration provides automatic inline ZIA/ZPA controls when threats are identified. Positioned as an alert-fatigue solution, not a SIEM replacement — raw event retention still belongs in NSS/LSS or your SIEM. One documented API endpoint ("Triggering Report Export Through an API") plus the AnySource webhook / Upload File ingestion path; no comprehensive public API reference for the product itself. Reasoning doc: [`../soc-workbench/overview.md`](../soc-workbench/overview.md). Capture: `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md`. No SDK / TF surface — portal-managed.

#### Breach Predictor
SecOps-suite product that uses generative AI to **predict where threats will move next** rather than triage alerts after the fact — a distinct slot from SOC Workbench (alert unification + triage), Risk360 (financial-loss quantification for CISO/board), and AEM/UVM (asset/vuln posture). Surfaces an **Overall Breach Probability score** on the Dashboard, plus **Findings** mapped to MITRE ATT&CK and tied to the specific policies that enabled the observed activity. **Sankey charts** visualize threat propagation paths from initial compromise through lateral movement to exfiltration; the **AI Assist Dashboard** generates natural-language analyst guidance. Vendor framing is explicit that Breach Predictor **supplements, does not replace** reactive tools (SIEM, EDR) — it provides forward-looking context for proactive policy remediation, not retrospective event review. The help portal references "Integrating Applications with Zscaler Breach Predictor" and "Requesting Updates" pages that imply some integration surface exists but no public API reference or SDK has been documented; data inputs are described only as "vast amounts of data from multiple sources" without enumeration. Reasoning doc: [`../breach-predictor/overview.md`](../breach-predictor/overview.md). Capture: `vendor/zscaler-help/bp-what-zscaler-breach-predictor.md`. No SDK / TF surface — portal-managed.

#### Zero Trust Branch (ZTB)
SD-WAN combined with **agentless device segmentation** for branch offices, factory floors, and data centers. Replaces traditional site-to-site VPNs and east-west firewall hardware while routing all branch traffic to ZTE for ZIA / ZPA policy enforcement. The architectural primitive is **"network-of-one"** — every device on the branch LAN is automatically discovered, classified, and provisioned with a /32 subnet via DHCP proxy, with the ZTB appliance acting as default gateway for all VLANs. Inter-device traffic must traverse the appliance, eliminating lateral movement without requiring NAC, east-west firewalls, or endpoint agents — making it applicable to IoT, OT, IoMT, and headless / legacy systems that can't run agents. Components: **Zero Trust Branch appliance** (ZT800 physical series with rack/wall mount, or VMware ESXi VM; Zero Touch Provisioning supported) + **Zscaler Admin Console** (SaaS, no on-prem management infrastructure). Advanced networking: Bonding Interfaces (Ebond) for multi-WAN aggregation, Micro-Subnets for sub-VLAN isolation. OT/IoT specifics: clientless browser-based SSH/RDP/VNC access to OT assets; automatic device classification by traffic profile. **Not a standalone product** — requires ZTE (ZIA/ZPA) subscription; not a campus LAN solution; not a traditional firewall. Sits adjacent to Cloud Connector (which targets cloud workloads, not branches) in the customer-segment pillar layout. Reasoning doc: [`../zero-trust-branch/overview.md`](../zero-trust-branch/overview.md). Capture: `vendor/zscaler-help/ztb-what-zero-trust-branch.md`. Configuration, monitoring, and provisioning all flow through the SaaS Admin Console — no separate ZTB API documented; no SDK / TF surface.

> **Naming note.** "ZTB" is overloaded — Zscaler also uses it as a marketing abbreviation for "Zero Trust Browser" (which is the current name for the **ZBI / Cloud Browser Isolation** Tier 2 product). The two products are unrelated. The Tier 2 § "Marketing-name aliases" lists ZTB → ZBI; the entry above is the Zero Trust **Branch** product. When a customer says "ZTB," disambiguate by context (branch hardware / SD-WAN → this entry; isolation profiles / browser rendering → ZBI).

#### Experience Center / `unified` (admin console layer)
Zscaler **Experience Center** is the unified, AI-powered administrative console that consolidates management, configuration, and monitoring of the Zero Trust Exchange platform into a single interface. The help portal path `help.zscaler.com/unified` maps to the "Getting Started with Zscaler" section. Consolidates admin surfaces for ZIA, ZPA, ZDX, ZCC, and other Zscaler services into one console — eliminating per-product dashboards. Treated as a Tier 3 awareness entry rather than a product (it's a management-plane consolidation, not an independent SKU); the reasoning doc captures architecture, scope, and how it interacts with the underlying products. Reasoning doc: [`../unified/overview.md`](../unified/overview.md). Capture: `vendor/zscaler-help/unified-what-zscaler-experience-center.md`. No SDK / TF surface — portal-only by definition.

#### CASB — disambiguation, not a separate product

CASB sits outside the tier system because Zscaler markets CASB capabilities as part of two existing products rather than as a standalone CASB SKU:
- **Inline CASB** is delivered through ZIA — Cloud App Control (CAC), Tenant Profiles, SaaS application visibility, in-line DLP for cloud apps. Configuration lives in the ZIA admin surfaces; SDK / TF coverage falls under ZIA.
- **Out-of-band CASB** (also called API CASB / SaaS Security Posture) is delivered through DSPM / SaaS Security Report — discovery, classification, posture management against stored data and SaaS configuration.

Source: `vendor/zscaler-help/dspm-marketing.md`; `vendor/zscaler-help/shadow-it-saas-security-report-zia.md`; `vendor/zscaler-help/automate-zscaler/getting-started.md`.

Customers will use the term "CASB" expecting one product; the skill should recognize it and disambiguate to whichever surface they actually need (inline-policy → ZIA; data-at-rest / posture → DSPM; shadow-IT discovery → SaaS Security Report / ZINS). No dedicated `casb` namespace in any SDK — this is intentional; Zscaler's CASB story is the federation of those product surfaces.

## Tier 4 — Paragraph-only awareness

No SDK, no dedicated reasoning content under `references/<product>/`. Skill recognizes and describes briefly from the paragraphs below; redirects to Zscaler help-site / TAM consultation for depth. Promote to Tier 3 by adding a reasoning doc; promote to Tier 1 / 2 if Zscaler ships an SDK module.

Source: `vendor/zscaler-help/zscaler-resilience-marketing.md`; `vendor/zscaler-help/understanding-business-continuity-cloud-components.md`; `vendor/zscaler-help/security-operations-suite-marketing.md`; `vendor/zscaler-help/microsoft-copilot-security-marketing.md`; `vendor/zscaler-help/zscaler-b2b-marketing.md`.
Source: `vendor/zscaler-help/shadow-it-saas-security-report-zia.md`; `vendor/zscaler-help/easm-what-is-zscaler-easm.md`; `vendor/zscaler-help/zscaler-government-public-sector-marketing.md`; `vendor/zscaler-help/agentic-secops-security-operations-marketing.md`.

#### Resilience
Comprehensive cloud-resilience capability set spanning four failure tiers: minor failures (auto-remediated node/software issues), blackouts (autonomous + manual failover for localized outages), brownouts (dynamic service-edge selection + customer-controlled DC exclusion), and catastrophic events (Business Continuity Cloud — private service edges with critical-app-only restrictions during full cloud outages). Distinct from but related to **Business Continuity Cloud** (separate product, the catastrophic-tier deployment surface — adds private control plane + private service edges; covered in `references/shared/cloud-architecture.md`). Resilience as a product is the umbrella across all four tiers. Capture: `vendor/zscaler-help/zscaler-resilience-marketing.md`. No SDK / programmatic surface — operational configuration only.

#### Business Continuity Cloud
The catastrophic-tier deployment surface inside the Resilience umbrella — the dedicated infrastructure that takes over when the Zscaler public cloud is unreachable. Two Zscaler-managed components on top of customer-deployed ZIA Private Service Edges: **Private Policy Cache** (last-known-good policy repository, syncs from public cloud during normal ops, serves enforcement during outages) and **Private PAC Servers** (host customer PAC files, geo-aware traffic redirection to the nearest BC site). Both deployed in redundant pairs per BC site. Important constraint: **only Z-Tunnel 1.0, PAC files, and GRE tunnels are supported** in BC mode — Z-Tunnel 2.0 is not. Public-cloud upgrades are intentionally delayed at the BC tier for fault isolation. Capture: `vendor/zscaler-help/understanding-business-continuity-cloud-components.md`. No SDK / TF surface — Zscaler-managed; customer side is just the Private Service Edge deployment.

#### CTEM — Continuous Threat Exposure Management
Program / discipline offering rather than a single SKU — Zscaler markets CTEM as the continuous-improvement framework that the Exposure Management suite operationalizes. The suite components feed it: **AEM** (asset coverage), **UVM** (vulnerability prioritization), **EASM** (outside-in attack surface), **Risk360** (quantification), **Deception** (post-breach detection). UVM is positioned explicitly as a "CTEM accelerator." Distinct from individual product SKUs in that customers buy the program (typically as a multi-product bundle within Security Operations) rather than a single discrete offering. The five-stage CTEM model (scoping → discovery → prioritization → validation → mobilization) maps onto Zscaler's suite roughly as: AEM scopes/discovers, UVM prioritizes, Deception validates, Risk360 reports up. Captures: `vendor/zscaler-help/security-operations-suite-marketing.md`, `agentic-secops-security-operations-marketing.md`. No SDK — program-level offering; the SDK surfaces of the underlying products are what's accessible.

#### Cloud Protection / Zero Trust Cloud
Pillar offering combining CSPM (cloud security posture management), microsegmentation, and secure east-west / ingress-egress traffic for workloads in AWS / Azure / on-prem. Marketed as a platform pillar rather than a discrete product. Adjacent to Cloud Connector but different scope: **Cloud Connector forwards workload traffic; Cloud Protection scans cloud configuration**. Awareness only — no dedicated capture beyond the marketing-page references.

#### Posture Control — CNAPP
The standalone **Cloud Native Application Protection Platform (CNAPP)** under Cloud Protection. Converges CSPM + CIEM (Cloud Infrastructure Entitlement Management) + CWPP (Cloud Workload Protection Platform) + DLP + IaC security + vulnerability management + compliance into one unified platform. **Agentless** — API-based scan of container images in registries and VMs in production. Multi-cloud (AWS, Azure, GCP, Oracle Cloud Infrastructure). Distinguishing capability: correlates seemingly-low-risk individual misconfigurations into composite high-risk attack paths to reduce alert fatigue. Note: marketing page redirects to the broader DSPM / CNAPP messaging — Posture Control's standalone identity has narrowed; the CSPM+CIEM-converged messaging is the canonical reference. No SDK surfaced; agentless API scanning is the integration model.

#### Microsoft Copilot Data Protection
Marketed as **Zscaler Copilot Security for Microsoft**. Targets Copilot's overconsumption / oversharing risk — Copilot indexes data from OneDrive / SharePoint / Teams and can surface it to underprivileged users via prompts. Four capabilities: (1) Prompt visibility + DLP on Copilot inputs, (2) Permission remediation (remove excessive sharing), (3) Sensitivity-label enforcement (add missing Purview labels), (4) Configuration hardening (Microsoft 365 misconfig closure). Both **API-based** (data classification, permissions) and **inline** (prompt DLP) integration paths. Sits within the broader Zscaler Data Security pillar alongside DLP / CASB / DSPM. Vendored deployment guide is the canonical operational reference. Capture: `vendor/zscaler-help/microsoft-copilot-security-marketing.md`. No SDK surface specific to this product.

#### Red Canary MDR (post-acquisition)
Acquisition completed; Red Canary operates initially as a separate business unit within Zscaler. Combines Zscaler's data scale + ThreatLabz intelligence with Red Canary's MDR expertise to deliver an "agentic SOC" — AI-driven workflows + human expertise. Marketing claims: 10× faster threat identification, 99.7% threat accuracy. Sits within the **Security Operations** suite (alongside Risk360, Deception, AEM, UVM, EASM, CTEM, Managed Threat Hunting); Agentic SecOps is the AI-automation layer that ties them together. Integration semantics with the rest of the SecOps suite are still emerging at capture date — Red Canary's standalone product surfaces remain operational. Captures: `vendor/zscaler-help/security-operations-suite-marketing.md` (Red Canary positioned within), plus `agentic-secops-security-operations-marketing.md` (architectural pillar treatment). No customer SDK surfaced specifically for Red Canary — managed-service-shaped delivery.

#### Managed Threat Hunting
Expert-led 24×7 threat hunting service inside the Security Operations suite — proactive search for sophisticated threats, anomalies, and TTPs that automated detection misses. Distinct from but complementary to Red Canary MDR (Red Canary is the broader managed-detection-and-response layer; Managed Threat Hunting is the specialized human-expertise component within it). Sits alongside Risk360, Deception, AEM, UVM, EASM, CTEM in the SecOps marketing cluster. Pure managed-service delivery — no portal configuration surface, no SDK; customer engagement is via the Zscaler account team. Captures: `vendor/zscaler-help/security-operations-suite-marketing.md`, `agentic-secops-security-operations-marketing.md`.

#### Zero Trust Exchange for B2B
Marketed as **Zscaler B2B**. Site-to-site connectivity for B2B applications via ZTNA — extends ZPA's user-to-app model to **partner-to-app and site-to-site** scenarios (third-party contractors, supplier organizations, B2C customers). Eliminates inbound DMZ / open ports / site-to-site VPN. Three primary deployment shapes: site-to-site (location ↔ location over ZTNA), partner portals (browser-based app delivery to external users), B2C mobile (consumer-facing application access). Distinguishing detail vs base ZPA: B2B handles cross-organization identity and trust, not just cross-segment-within-one-org. Full TLS/SSL inspection at scale. Capture: `vendor/zscaler-help/zscaler-b2b-marketing.md`. No SDK distinct from ZPA's; configured via the broader ZPA admin surfaces.

#### Shadow IT / SaaS Security Report — formerly "ZINS"
**Renamed.** Originally "Shadow IT Report" (ZINS naming), now marketed as "**SaaS Security Report**" in current help docs. Reporting product covering Shadow IT discovery (unsanctioned cloud apps users access), IoT device visibility, and SaaS-app risk reporting. Powered by traffic flowing through ZIA — extracts visibility signals from existing ZIA telemetry. Not a policy-enforcement product; pure observability. Risk Index 1-5 per app; sanctioned/unsanctioned breakdown; supports up to **50,000 cloud apps** in the catalog (some marketing material still cites the older 8,500+ figure — outdated). The GraphQL Analytics API at `https://api.zsapi.net/zins/graphql` is its API surface — the `zins` namespace persists even though the marketing name changed. **No dedicated SDK module** — neither Python nor Go SDK has a `zins` namespace; access is direct GraphQL via OneAPI auth. Captures: `vendor/zscaler-help/shadow-it-saas-security-report-zia.md`, `shadow-it-marketing.md`.

#### Federal Cloud variants (`zscalergov`, `zscalerten`, ZPA GOV / GOVUS)
**Regulated-cloud editions** of the existing product line for US government and gov-adjacent tenants — not strictly separate products. ZIA / ZPA / ZCC etc. all have gov-cloud variants. Concrete differentiators captured:
- **ZIA** is the only SASE / TIC 3.0 solution with **FedRAMP High** authorization.
- **ZPA** is at **DoD IL5**.
- Additional certifications: CMMC L2, GovRAMP, CJIS.
- **GovCloud has dedicated infrastructure separate from commercial** — not just a logical partition.
- **Auth paths** — gov-cloud tenants have separate ZIdentity instances and OAuth endpoints.
- **Feature availability** — newer features may launch in commercial cloud first, gov second; some commercial features are restricted in gov.
- **Data residency** — gov-cloud data stays in-region (US).
Adoption: 1M+ federal users; 13 of 15 cabinet agencies. Recognizing gov-cloud awareness matters because many enterprises have hybrid commercial+gov tenants for different business units (defense contractors, federal-adjacent firms). Skill should recognize gov-cloud questions and route to Zscaler's federal-cloud documentation rather than confidently extrapolating from commercial behavior. Captures: `vendor/zscaler-help/zscaler-government-public-sector-marketing.md`, `zscaler-govcloud-innovations.md`.

## Tier 5 — Out of scope (deprecated / historical / unreleased)

Currently empty. Reserved for products that are deliberately not worth investment at this date — deprecated, internal-only / pre-GA, vaporware (announced-but-not-shipped), or renamed-and-redirected legacy SKUs. Watched for promotion-worthy changes (a deprecated product re-released, an internal product hitting GA).

Add entries here only when a product genuinely doesn't merit awareness today but might in future. Renamed products where the legacy name should redirect are handled in `references/shared/terminology.md` rather than here.

## How the skill should use this map

When a question lands:

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`.

1. **If Tier 1** (core product, SDK / TF / API + multi-component reference coverage), route to its `references/<product>/` deep-dive and answer at full operational depth.
2. **If Tier 2** (programmable but shallow), answer with full confidence on what's documented; explicitly flag the coverage gap when the question goes deeper than the reference content.
3. **If Tier 3** (reasoning content, no verified SDK/TF management surface), route to the reasoning doc but answer at confidence: medium; name any captured narrow endpoint or integration separately and do NOT fabricate API shapes, rule field names, or programmatic config patterns.
4. **If Tier 4** (paragraph here only), give the one-paragraph answer from this map and recommend the Zscaler help-site path / TAM consultation for depth.
5. **If Tier 5** (currently empty), redirect outright — the product is deprecated, internal-only, unshipped, or otherwise not worth the skill's investment today.

The Tier 3 vs Tier 4 distinction matters: Tier 3 products have substantial reasoning content but no captured supported SDK/TF management client, so answers must stay descriptive and not drift from a narrow endpoint into invented API parity. Tier 4 products only have the paragraph above — no synthesized reasoning content — so answers should stay at paragraph depth and route outward.

Never pretend deep-dive coverage exists where it doesn't. Confidence drop is honest signal — but **always be articulate about every Zscaler-marketed product**. The chatbot-foundation goal requires breadth of awareness, not just operational depth on the products we use.

## Coverage statistics (as of 2026-08-12)

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-help/zero-trust-exchange-zte-marketing.md`; `vendor/zscaler-help/security-operations-suite-marketing.md`.

- **Tier 1 — Core products:** 6 (ZIA, ZPA [incl AppProtection], ZCC, ZDX, ZIdentity, Cloud Connector)
- **Tier 2 — Programmable but shallow:** 7 (ZBI, ZWA, AI Guard, ZMS, EASM, Zscaler Cellular / ZCell, Business Insights)
- **Tier 3 — Reasoning content, no verified SDK/TF management surface:** 12 (Deception, Risk360, AI Security family surfaces beyond AI Guard, ZSDK, ITDR, DSPM, AEM, UVM, SOC Workbench, Breach Predictor, Zero Trust Branch, Experience Center / unified) plus a CASB disambiguation entry (CASB is delivered via ZIA + DSPM/SaaS Security, not a standalone product)
- **Tier 4 — Paragraph-only:** 11 (Resilience, Business Continuity Cloud, CTEM, Cloud Protection / ZTC, Posture Control, Microsoft Copilot Data Protection, Red Canary MDR, Managed Threat Hunting, ZTE for B2B, Shadow IT / SaaS Security Report / ZINS, Federal Cloud variants)
- **Tier 5 — Out of scope:** 0 (currently empty; reserved for deprecated / internal / unshipped)
- **Architectural pillars named:** 4 (ZTE, Data Fabric, Agentic SecOps, plus the customer-segment "Zero Trust for X" framing)

Total Zscaler portfolio: roughly 36 distinct products + 4 architectural pillars at this date. Full operational depth on 6 (Tier 1), programmable coverage on 7 more (Tier 2), reasoning-content awareness on 12 more (Tier 3), paragraph-level awareness on 11 more (Tier 4) — at-minimum aware of all the rest, deliberately ignore none.

## Maintenance

Zscaler ships rapidly — products are added, renamed, deprecated, acquired. Re-validate this map quarterly:

1. Visit `https://www.zscaler.com/products-and-solutions`
2. Walk the product menus / categories
3. For each product Zscaler markets that's NOT on this map, add it as Tier 4 awareness by default. The bar for Tier 1 promotion is "we have or want operational depth on it AND multi-component reference coverage exists"; the bar for Tier 2 is "an SDK exists but reference depth is thin"; the bar for Tier 3 is "a reasoning doc has been synthesized"; the bar for staying out of Tier 5 is just "Zscaler markets it as a product."
4. For each product on this map that's NOT on Zscaler's site, mark deprecated (don't delete — institutional memory matters; consider moving to Tier 5 if Zscaler has formally sunset it).
5. Bump `last-verified` to today's date.

Acquisitions typically take 6-12 months to fully integrate; track them as Tier 4 awareness even before integration completes.

## Cross-links

- Cross-product hooks between deep-dive products: [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
- Cloud architecture (the platform layer underlying all products): [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
- OneAPI gateway and the current Postman collection's nine top-level product/service surfaces: [`../shared/oneapi.md`](../shared/oneapi.md)
- Terminology disambiguation across products and legacy names: [`../shared/terminology.md`](../shared/terminology.md)
