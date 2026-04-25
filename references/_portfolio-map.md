---
product: shared
topic: "portfolio-map"
title: "Zscaler product portfolio map"
content-type: reference
last-verified: "2026-04-25"
confidence: medium
source-tier: mixed
sources:
  - "https://www.zscaler.com/products-and-solutions"
  - "vendor/zscaler-help/automate-zscaler/getting-started.md (OneAPI 7-product list)"
  - "PLAN.md § Discovery 2 (portfolio audit)"
author-status: draft
---

# Zscaler product portfolio map

Single-page index of **every product Zscaler markets**, with depth-of-coverage in this skill marked per entry. Goal: the skill should be **articulate about everything Zscaler ships**, even where deep-dive content doesn't exist. Customers, prospects, and team members ask about the breadth; this map ensures we don't draw blanks.

Three coverage tiers, with the Tier 1 boundary set by **API exposure**:

- **Tier 1 — Deep-dive** — product is configurable via Python or Go SDK / Terraform provider / OneAPI surface. Skill answers detailed operational questions including API shape, rule semantics, and policy evaluation order.
- **Tier 2 — Awareness** — product is documented in Zscaler help / marketing but has **no programmable surface** in the SDKs or TF providers (portal-only configuration). Some Tier 2 products have **expanded reasoning docs under `references/<product>/`** (Deception, Risk360, AI Security, ZMS); the rest get a one-paragraph treatment in this map. Skill can describe what these products do and why they matter, but does NOT claim API-level operational depth.
- **Tier 3 — Out-of-scope** — exists in the Zscaler portfolio, recognized, deliberately not covered. Currently empty.

The "0 API exposure → Tier 2" rule was set 2026-04-25 after auditing SDK presence — Deception, Risk360, AI Security, and ZMS all have substantial reasoning docs but none are configurable via SDK/TF, so they belong in T2 by the operational-depth criterion.

## Architectural pillars (the platform-level naming)

These aren't products — they're how Zscaler markets the platform layer that ties products together. Customers reference them in conversation; the skill needs to recognize them.

| Pillar | What it names | Coverage |
|---|---|---|
| **Zero Trust Exchange (ZTE)** | The unified policy + enforcement plane underlying all products. Zscaler's marketing umbrella — "500 trillion daily signals," four-stage model (Verify Identity / Determine Destination / Assess Risk / Enforce Policy), ~45% Fortune 500 adoption, 2025 Gartner SSE Leader. Capture: `vendor/zscaler-help/zero-trust-exchange-zte-marketing.md`. | Awareness with capture |
| **Data Fabric for Security** | Aggregation + unification layer powered by the Avalor acquisition. **150 pre-built integrations**, AnySource connector. Backbone of CTEM / Risk360 / UVM / Asset Exposure Mgmt — all the Exposure Management stack uses Data Fabric as the underlying data layer. Capture: `vendor/zscaler-help/data-fabric-for-security-marketing.md`. | Awareness with capture |
| **Agentic SecOps** | **No dedicated product URL** — capability layer within the broader **Security Operations** marketing page. AI agents trained on 11+ years of telemetry; "99.7% threat accuracy" claimed; Red Canary MDR integration is core. Bigger than the name implies: encompasses **EASM, Asset Exposure Mgmt, UVM, Risk360, CTEM, Deception, Red Canary MDR** as one suite, with Agentic SecOps as the AI automation layer across all of them. Projected $400M+ ARR FY26. Capture: `vendor/zscaler-help/agentic-secops-security-operations-marketing.md`. | Awareness with capture |
| **Zero Trust for Users / Workloads / Branch / B2B** | The four customer-segment pillars. Maps to product groupings rather than discrete SKUs. | Implicit in product docs |

## Tier 1 — Deep-dive coverage (9 products)

Each has SDK / TF / OneAPI exposure and a dedicated `references/<product>/` directory with multiple reasoning docs (or a focused single-doc deep-dive).

| Product | What it does | Deep-dive entry | API exposure |
|---|---|---|---|
| **ZIA — Internet & SaaS** | Cloud-delivered secure web gateway. URL filtering, SSL inspection, CAC, DLP, sandbox, malware/ATP, firewall, IPS, bandwidth, FTP/file-type. The "secure forward proxy" of the suite. | [`zia/index.md`](./zia/index.md) | Python `zscaler/zia/` + Go `zscaler/zia/` + TF `terraform-provider-zia` |
| **ZPA — Private Access** | Zero-trust application access for private apps without VPN. App segments, policy precedence, App Connectors, Browser Access, PRA, AppProtection (inline WAF/IPS). | [`zpa/index.md`](./zpa/index.md) | Python `zscaler/zpa/` (incl `app_protection.py`) + Go `zscaler/zpa/` (incl `app_protection/`) + TF `terraform-provider-zpa` |
| **ZCC — Client Connector** | The endpoint agent that forwards user traffic into the cloud. Forwarding profiles, trusted networks, web policy, devices, entitlements, Z-Tunnel. | [`zcc/index.md`](./zcc/index.md) | Python `zscaler/zcc/` + Go `zscaler/zcc/` |
| **ZDX — Digital Experience** | User experience monitoring across apps, networks, endpoints. Probes, ZDX Score, diagnostics sessions (deeptraces), alerts. | [`zdx/index.md`](./zdx/index.md) | Python `zscaler/zdx/` + Go `zscaler/zdx/` |
| **ZBI — Cloud Browser Isolation** | Remote-browser rendering for risky / unmanaged-device scenarios. Isolation profiles, Smart Browser Isolation, ZPA Isolation Policy. Marketed as "Zero Trust Browser." | [`zbi/index.md`](./zbi/index.md) | Python `zscaler/zia/cloud_browser_isolation.py` + Go `zscaler/zpa/services/cloudbrowserisolation/*` |
| **ZIdentity** | Unified identity + auth platform for the Zscaler ecosystem. OneAPI OAuth, API Clients, step-up auth, admin RBAC. | [`zidentity/index.md`](./zidentity/index.md) | Go `zscaler/zid/` (Python SDK has no `zid` module — read-only via OneAPI for Python users) |
| **Cloud & Branch Connector (ZTW / ZTC / CBC)** | VM-based traffic forwarding for cloud workloads (AWS / Azure / GCP) and branch offices. Cloud Connector Groups, traffic forwarding, gateway failover. **Five marketing names for the same product family.** | [`cloud-connector/index.md`](./cloud-connector/index.md) | Python `zscaler/ztw/` (added v2.0.0) + Go `zscaler/ztw/` + TF `terraform-provider-ztc` |
| **ZWA — Workflow Automation** | DLP incident lifecycle management. Incident triage, workflows, ticketing/notification integrations. Downstream of ZIA DLP. | [`zwa/index.md`](./zwa/index.md) | Python `zscaler/zwa/` + Go `zscaler/zwa/` |
| **AppProtection** (ZPA) | Inline WAF/IPS for ZPA-protected applications. OWASP CRS, ThreatLabZ, Active Directory protocol controls (Kerberos/SMB/LDAP), API, WebSocket. Bundled into ZPA (mostly); Browser Protection tier-gated. Was previously called "Inspection" in ZPA. | [`zpa/appprotection.md`](./zpa/appprotection.md) | Lives inside ZPA SDKs — `zpa/app_protection.py` (Python) + `zpa/services/app_protection/` (Go) + `zpa_inspection_*` TF resources |

## Tier 2 — Awareness (no SDK / TF / API exposure)

Products Zscaler markets that have **no programmable surface** in the SDKs or TF providers (portal-only configuration). Skill recognizes and describes them but does not claim API-level operational depth.

Tier 2 splits into two shapes by how much depth we've captured:

### Tier 2a — Extended awareness (reasoning doc exists)

Help-portal + marketing material has been synthesized into reasoning docs under `references/<product>/`. Skill answers conceptual questions with confidence: medium and a clear "no SDK / portal-only" caveat. **Promote to Tier 1 if Zscaler ships an SDK module.**

#### Zscaler Deception
Active-defense threat detection via decoys (fake servers, AD objects, endpoints, cloud assets); detects post-breach lateral movement / APTs / ransomware; integrates with ZPA via Zero Trust Network decoys. Reasoning doc: [`./deception/overview.md`](./deception/overview.md). The only "SDK presence" is a `ZscalerDeception` permission-flag string in ZCC admin RBAC and a `deceptionSettingsOtp` settings field — neither constitutes a configuration surface. Three help-portal captures synthesized in the overview.

#### Risk360
Cyber risk quantification framework. Monte Carlo financial-loss simulation 1000x/day across 4 scenarios (inherent / residual / 30-day / peer). 115-140+ factors across 4 attack stages × 4 entities, mapped to MITRE ATT&CK / NIST CSF / SEC S-K 106(b). Paid add-on under Security Operations tier. CISO/board audience. Reasoning doc: [`./risk360/overview.md`](./risk360/overview.md). No SDK / TF presence.

#### AI Security family (AI Guard / AI Guardrails / AI Red Teaming)
Family includes AI Guard (15 detector categories: prompt injection, jailbreak, toxicity, sensitive data, off-topic responses, malicious URLs, language enforcement, code injection, gibberish, refusal-as-DoS, finance advice, prompt tagging, competitor discussion, URL reachability, legal advice), AI Guardrails (marketing umbrella — same product), AI Red Teaming (offline vulnerability assessment for customer LLM apps), and the four-pillar governance framework. Three deployment modes: Proxy (inline), DaaS (application-layer sidecar), OnPrem hybrid. Layers on top of existing ZIA GenAI URL Filter categories + DLP prompt scanning. Reasoning doc: [`./ai-security/overview.md`](./ai-security/overview.md). No SDK module in Python or Go SDK; portal-only configuration. Captures: `vendor/zscaler-help/ai-security-marketing.md`, `ai-guardrails-marketing.md`, `ai-guard-what-is.md`.

#### ZMS — Zscaler Microsegmentation
East-west / workload-to-workload policy via host-installed agents (Win/Linux), AI-powered policy recommendations on a 14-day rolling telemetry window, local OS enforcement (Windows Filtering Platform / Linux nftables). Positioned as a ZPA add-on. Reasoning doc: [`./zms/overview.md`](./zms/overview.md). No SDK module; portal-only configuration. Captures: `vendor/zscaler-help/microsegmentation-marketing.md`, `zero-trust-microsegmentation-marketing.md`, `what-is-microsegmentation-zpa.md`.

### Tier 2b — Awareness only (one-paragraph treatment)

Products described conceptually here. Customers asking get the paragraph; deep technical questions redirect to Zscaler docs / TAM / Support.

#### ITDR — Identity Threat Detection & Response
Marketed as **Zscaler Identity Protection**. Real-time detection and response for identity-based attacks: DCSync, DCShadow, kerberoasting, LDAP enumeration, credential theft, privilege escalation, lateral movement. Built into the ZCC agent (no separate VM); integrates natively with ZPA for real-time threat containment, plus SIEM and EDR for SOC workflows. Provides unified identity risk scoring with MITRE ATT&CK mapping; surfaces risky configurations (shared/stale passwords, unconstrained delegation) and exposed endpoint credentials. Distinct from **ZIdentity** (which is the IdP / authentication layer); ITDR sits on top to detect compromise in flight. **Fill priority** because identity attacks are central to modern zero-trust threat models — 75% of 2023 access attacks were malware-free per CrowdStrike (cited by Zscaler). Capture: `vendor/zscaler-help/itdr-zscaler-identity-protection-marketing.md`. No public SDK / TF surface — portal + ZCC agent.

#### Resilience
Comprehensive cloud-resilience capability set spanning four failure tiers: minor failures (auto-remediated node/software issues), blackouts (autonomous + manual failover for localized outages), brownouts (dynamic service-edge selection + customer-controlled DC exclusion), and catastrophic events (Business Continuity Cloud — private service edges with critical-app-only restrictions during full cloud outages). Distinct from but related to **Business Continuity Cloud** (separate product, the catastrophic-tier deployment surface — adds private control plane + private service edges; covered in `references/shared/cloud-architecture.md`). Resilience as a product is the umbrella across all four tiers. Capture: `vendor/zscaler-help/zscaler-resilience-marketing.md`. No SDK / programmatic surface — operational configuration only.

### Adjacent / newer (medium relevance)

#### DSPM — Data Security Posture Management
AI-powered **at-rest** data security: discovery, LLM-based classification, posture management, access governance, compliance, AI security. Covers IaaS (AWS / Azure / GCP), SaaS, on-prem databases, endpoints, and AI/GenAI services (cloud-hosted models, LLM platforms). **Distinct from ZIA DLP** — DSPM answers "what sensitive data exists and who can access it?" against stored data, while ZIA DLP answers "where is data moving?" inline at the network layer. Together they form full data protection. Notable: AI model discovery (eliminate shadow AI), OWASP-Top-10-for-LLMs assessment, GDPR/HIPAA/PCI/NIST-AI-RMF compliance mapping. Integrates with ZIA / ZPA / DLP / CASB and external ITSM. Capture: `vendor/zscaler-help/dspm-marketing.md`. Portal-only configuration; no SDK surfaced.

#### Asset Exposure Management — CAASM
"Golden record" asset inventory across the enterprise. Aggregates from 150+ data-source connectors (via the Data Fabric for Security from the Avalor acquisition), deduplicates, surfaces coverage gaps (missing EDR, missing controls), maintains CMDB hygiene (auto-discovery of unregistered assets visible in network traffic), runs automated remediation (CMDB enrichment, ticket creation, policy initiation). Marketing claim: typical orgs are missing 20-30% of their assets from inventory. Cluster member of the **Exposure Management suite**: AEM (asset side) + UVM (vulnerability side) + Risk360 (quantification) + EASM (outside-in) + CTEM (continuous program). Capture: `vendor/zscaler-help/asset-exposure-management-caasm-marketing.md`. Data-Fabric-powered; integration via 150+ connectors. No customer-facing SDK surfaced.

#### UVM — Unified Vulnerability Management
Risk-based vulnerability prioritization powered by the Data Fabric (Avalor acquisition, March 2025). Out-of-the-box multifactor scoring that considers BOTH risk factors AND mitigating controls (unlike traditional CVSS-only tools); customizable factors and weights; 150+ prebuilt integrations spanning CVE feeds, threat intel, identity, cloud services, user behavior. Distinguishing primitives: **AnySource connector** (integrate flat files / webhooks; new connectors in weeks) and **AnyTarget connector** (push to any downstream). Two-way ticketing integration with auto reconciliation. Marketed metrics: 80% of "critical" issues downgraded to "medium" after context-aware prioritization, 10× triage capacity. Positioned as a CTEM accelerator. Capture: `vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md`. No customer SDK; integration is via connector framework.

#### Cloud Protection / Zero Trust Cloud
Pillar offering combining CSPM (cloud security posture management), microsegmentation, and secure east-west / ingress-egress traffic for workloads in AWS / Azure / on-prem. Marketed as a platform pillar rather than a discrete product. Adjacent to Cloud Connector but different scope: **Cloud Connector forwards workload traffic; Cloud Protection scans cloud configuration**. Awareness only — no dedicated capture beyond the marketing-page references.

#### Posture Control — CNAPP
The standalone **Cloud Native Application Protection Platform (CNAPP)** under Cloud Protection. Converges CSPM + CIEM (Cloud Infrastructure Entitlement Management) + CWPP (Cloud Workload Protection Platform) + DLP + IaC security + vulnerability management + compliance into one unified platform. **Agentless** — API-based scan of container images in registries and VMs in production. Multi-cloud (AWS, Azure, GCP, Oracle Cloud Infrastructure). Distinguishing capability: correlates seemingly-low-risk individual misconfigurations into composite high-risk attack paths to reduce alert fatigue. Note: marketing page redirects to the broader DSPM / CNAPP messaging — Posture Control's standalone identity has narrowed; the CSPM+CIEM-converged messaging is the canonical reference. No SDK surfaced; agentless API scanning is the integration model.

#### Zscaler Cellular
Zero-Trust SIM card for IoT / OT cellular connectivity. No software / VPN required on-device. Includes a cellular edge routing layer. New (Aug 2025). Awareness only — niche but growing.

#### Microsoft Copilot Data Protection
Specific data-protection controls for enterprise Copilot use. Overrides permissions / labels at the Copilot interaction layer. Sub-capability of the broader Data Security module. Awareness only.

#### Red Canary MDR (post-acquisition)
Zscaler announced acquisition of Red Canary in May 2025 to build out Agentic SecOps. Endpoint + cloud detection fusion. Awareness only — integration semantics still emerging.

#### Zero Trust Exchange for B2B
Newer pillar for secure app-sharing across partner organizations (Feb 2025, limited GA at capture date). Awareness only.

### Adjacent products previously classified out-of-scope (re-promoted 2026-04-24)

These were initially marked Tier 3 ("out of scope") under a "do we use it?" frame. The second-brain framing requires articulateness about everything Zscaler markets, regardless of operational use. Promoted to awareness with one-paragraph treatment + 15 vendored marketing/help-portal captures landed 2026-04-24. (ZMS and AI Security were originally re-promoted here, then briefly elevated to Tier 1 deep-dive on 2026-04-25, then settled into Tier 2a "Extended awareness" once the "0 API exposure → Tier 2" rule was set — see § "Tier 2a" above.)

#### Shadow IT / SaaS Security Report — formerly "ZINS"
**Renamed.** Originally "Shadow IT Report" (ZINS naming), now marketed as "**SaaS Security Report**" in current help docs. Reporting product covering Shadow IT discovery (unsanctioned cloud apps users access), IoT device visibility, and SaaS-app risk reporting. Powered by traffic flowing through ZIA — extracts visibility signals from existing ZIA telemetry. Not a policy-enforcement product; pure observability. Risk Index 1-5 per app; sanctioned/unsanctioned breakdown; supports up to **50,000 cloud apps** in the catalog (some marketing material still cites the older 8,500+ figure — outdated). The GraphQL Analytics API at `https://api.zsapi.net/zins/graphql` is its API surface — the `zins` namespace persists even though the marketing name changed. **No dedicated SDK module** — neither Python nor Go SDK has a `zins` namespace; access is direct GraphQL via OneAPI auth. Captures: `vendor/zscaler-help/shadow-it-saas-security-report-zia.md`, `shadow-it-marketing.md`.

#### EASM — External Attack Surface Management
Discovery and analysis of an organization's internet-exposed assets — domains, IPs, services, certificates — to surface unknown / shadow / forgotten infrastructure that attackers can find before defenders do. **Repositioning note**: EASM no longer has a standalone product URL on zscaler.com — it's now positioned as a component of the broader **Exposure Management** suite (alongside Asset Exposure Management, Unified Vulnerability Management, Risk360, CTEM, Deception). Help portal does have dedicated `/easm/` content. Capabilities: passive + active scanning; CISA KEV-based risk prioritization; M&A diligence use cases; risk scores Critical (90-100) → Low (1-39). Adjacent to but distinct from Asset Exposure Management (internal CAASM). EASM is outside-in attacker-perspective; AEM is inside-out infrastructure-team-perspective. **No SDK module** in Python or Go SDK; portal + help-portal docs only. Captures: `vendor/zscaler-help/easm-what-is-zscaler-easm.md`, `easm-introducing-marketing.md`.

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

## Tier 3 — Truly out of scope (deprecated / superseded / vaporware)

Currently empty. Earlier classifications under this tier (ZMS, ZINS, EASM, AI Security, Federal Cloud) were re-promoted to Tier 2 awareness on 2026-04-24. ZMS and AI Security have since landed at Tier 2a (extended awareness with reasoning doc) — see §"Tier 2a" above.

This tier is reserved for:
- **Deprecated products** Zscaler has officially sunset
- **Internal-only / pre-GA products** without public documentation
- **Vaporware / announced-but-not-shipped** products
- **Renamed products** where the legacy name should redirect (handled in `references/shared/terminology.md` rather than here)

Add entries here only when a product genuinely doesn't merit awareness.

## How the skill should use this map

When a question lands:

1. **If Tier 1** (SDK / TF / API exposure), route to its `references/<product>/` deep-dive and answer at full operational depth.
2. **If Tier 2a** (extended awareness, reasoning doc exists), route to the doc but answer at confidence: medium; explicitly note "no SDK / portal-only" — do NOT fabricate API shapes, rule field names, or programmatic config patterns.
3. **If Tier 2b** (paragraph here only), give the one-paragraph answer from this map and recommend the Zscaler help-site path / TAM consultation for depth.
4. **If Tier 3** (currently empty), redirect outright — the product is deprecated, internal-only, or unshipped.

The Tier 2a vs Tier 2b distinction matters: Tier 2a products have substantial reasoning content but can't be configured programmatically, so answers must stay descriptive and not drift into fabricated API specifics.

Never pretend deep-dive coverage exists where it doesn't. Confidence drop is honest signal — but **always be articulate about every Zscaler-marketed product**. The chatbot-foundation goal requires breadth of awareness, not just operational depth on the products we use.

## Coverage statistics (as of 2026-04-25)

- **Tier 1 — Deep-dive products (with API/SDK):** 9 (ZIA, ZPA, ZCC, ZDX, ZBI, ZIdentity, Cloud Connector, ZWA, AppProtection)
- **Tier 2a — Extended awareness (reasoning doc exists, no API):** 4 (Deception, Risk360, AI Security family, ZMS)
- **Tier 2b — Awareness only (paragraph here):** ~16 (ITDR, Resilience, DSPM, Asset Exposure Mgmt, UVM, Cloud Protection / ZTC, Posture Control, Zscaler Cellular, Microsoft Copilot Data Protection, Red Canary MDR, ZTE for B2B, ZINS, EASM, Federal Cloud variants, etc.)
- **Tier 3 — Truly out-of-scope:** 0 (currently empty; reserved for deprecated / internal / unshipped)
- **Architectural pillars named:** 4 (ZTE, Data Fabric, Agentic SecOps, plus the customer-segment "Zero Trust for X" framing)

Total Zscaler portfolio: roughly 29 distinct products + 4 architectural pillars at this date. We have full operational depth on 9, expanded reasoning on 4 more (13 with reasoning content total), are at-minimum aware of all the rest, deliberately ignore none.

## Maintenance

Zscaler ships rapidly — products are added, renamed, deprecated, acquired. Re-validate this map quarterly:

1. Visit `https://www.zscaler.com/products-and-solutions`
2. Walk the product menus / categories
3. For each product Zscaler markets that's NOT on this map, add it as Tier 2 awareness by default. The bar for Tier 1 promotion is "we have or want operational depth on it"; the bar for staying out of Tier 3 is just "Zscaler markets it as a product."
4. For each product on this map that's NOT on Zscaler's site, mark deprecated (don't delete — institutional memory matters; consider moving to Tier 3 if Zscaler has formally sunset it).
5. Bump `last-verified` to today's date.

Acquisitions typically take 6-12 months to fully integrate; track them as Tier 2 awareness even before integration completes.

## Cross-links

- Cross-product hooks between deep-dive products: [`./shared/cross-product-integrations.md`](./shared/cross-product-integrations.md)
- Cloud architecture (the platform layer underlying all products): [`./shared/cloud-architecture.md`](./shared/cloud-architecture.md)
- OneAPI gateway (the API entrypoint for the 7 products with REST APIs): [`./shared/oneapi.md`](./shared/oneapi.md)
- Terminology disambiguation across products and legacy names: [`./shared/terminology.md`](./shared/terminology.md)
