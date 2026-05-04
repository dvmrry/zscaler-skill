---
product: shared
topic: "portfolio-map"
title: "Zscaler product portfolio map"
content-type: reference
last-verified: "2026-05-04"
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
| **ZIA — Internet & SaaS** | Cloud-delivered secure web gateway. URL filtering, SSL inspection, CAC, DLP, sandbox, malware/ATP, firewall, IPS, bandwidth, FTP/file-type. The "secure forward proxy" of the suite. | [`zia/index.md`](../zia/index.md) | Python `zscaler/zia/` + Go `zscaler/zia/` + TF `terraform-provider-zia` |
| **ZPA — Private Access** | Zero-trust application access for private apps without VPN. App segments, policy precedence, App Connectors, Browser Access, PRA, AppProtection (inline WAF/IPS). | [`zpa/index.md`](../zpa/index.md) | Python `zscaler/zpa/` (incl `app_protection.py`) + Go `zscaler/zpa/` (incl `app_protection/`) + TF `terraform-provider-zpa` |
| **ZCC — Client Connector** | The endpoint agent that forwards user traffic into the cloud. Forwarding profiles, trusted networks, web policy, devices, entitlements, Z-Tunnel. | [`zcc/index.md`](../zcc/index.md) | Python `zscaler/zcc/` + Go `zscaler/zcc/` |
| **ZDX — Digital Experience** | User experience monitoring across apps, networks, endpoints. Probes, ZDX Score, diagnostics sessions (deeptraces), alerts. | [`zdx/index.md`](../zdx/index.md) | Python `zscaler/zdx/` + Go `zscaler/zdx/` |
| **ZBI — Cloud Browser Isolation** | Remote-browser rendering for risky / unmanaged-device scenarios. Isolation profiles, Smart Browser Isolation, ZPA Isolation Policy. Marketed as "Zero Trust Browser." | [`zbi/index.md`](../zbi/index.md) | Python `zscaler/zia/cloud_browser_isolation.py` + Go `zscaler/zpa/services/cloudbrowserisolation/*` |
| **ZIdentity** | Unified identity + auth platform for the Zscaler ecosystem. OneAPI OAuth, API Clients, step-up auth, admin RBAC. | [`zidentity/index.md`](../zidentity/index.md) | Go `zscaler/zid/` (Python SDK has no `zid` module — read-only via OneAPI for Python users) |
| **Cloud & Branch Connector (ZTW / ZTC / CBC)** | VM-based traffic forwarding for cloud workloads (AWS / Azure / GCP) and branch offices. Cloud Connector Groups, traffic forwarding, gateway failover. **Five marketing names for the same product family.** | [`cloud-connector/index.md`](../cloud-connector/index.md) | Python `zscaler/ztw/` (added v2.0.0) + Go `zscaler/ztw/` + TF `terraform-provider-ztc` |
| **ZWA — Workflow Automation** | DLP incident lifecycle management. Incident triage, workflows, ticketing/notification integrations. Downstream of ZIA DLP. | [`zwa/index.md`](../zwa/index.md) | Python `zscaler/zwa/` + Go `zscaler/zwa/` |
| **AppProtection** (ZPA) | Inline WAF/IPS for ZPA-protected applications. OWASP CRS, ThreatLabZ, Active Directory protocol controls (Kerberos/SMB/LDAP), API, WebSocket. Bundled into ZPA (mostly); Browser Protection tier-gated. Was previously called "Inspection" in ZPA. | [`zpa/appprotection.md`](../zpa/appprotection.md) | Lives inside ZPA SDKs — `zpa/app_protection.py` (Python) + `zpa/services/app_protection/` (Go) + `zpa_inspection_*` TF resources |

### Marketing-name aliases (Tier 1)

The skill uses SDK namespace names (ZIA, ZPA, ZWA, etc.) as canonical reference paths under `references/<product>/`. Marketing names that map to the same product:

- **"Workflow Automation"** is the marketing name for **ZWA**. Both refer to the same product; canonical reference is `references/zwa/`. (Help portal URL path also still uses `workflow-automation/`, and Zscaler help nav surfaces "Workflow Automation" as the product label — but the SDK / TF / OneAPI scope name is `zwa`, which is what this skill uses.)
- **"Internet & SaaS"** = **ZIA**. SDK namespace is `zia`.
- **"Private Access"** = **ZPA**. SDK namespace is `zpa`.
- **"Digital Experience"** = **ZDX**. SDK namespace is `zdx`.
- **"Client Connector"** = **ZCC**. SDK namespace is `zcc`.
- **"Cloud / Branch Connector" / "ZTW" / "ZTC" / "CBC"** all map to the same product family — canonical reference is `references/cloud-connector/`. SDK namespace is `ztw`.

## Tier 2 — Awareness (no SDK / TF / API exposure)

Products Zscaler markets that have **no programmable surface** in the SDKs or TF providers (portal-only configuration). Skill recognizes and describes them but does not claim API-level operational depth.

Tier 2 splits into two shapes by how much depth we've captured:

### Tier 2a — Extended awareness (reasoning doc exists)

Help-portal + marketing material has been synthesized into reasoning docs under `references/<product>/`. Skill answers conceptual questions with confidence: medium and a clear "no SDK / portal-only" caveat. **Promote to Tier 1 if Zscaler ships an SDK module.**

#### Zscaler Deception
Active-defense threat detection via decoys (fake servers, AD objects, endpoints, cloud assets); detects post-breach lateral movement / APTs / ransomware; integrates with ZPA via Zero Trust Network decoys. Reasoning doc: [`../deception/overview.md`](../deception/overview.md). The only "SDK presence" is a `ZscalerDeception` permission-flag string in ZCC admin RBAC and a `deceptionSettingsOtp` settings field — neither constitutes a configuration surface. Three help-portal captures synthesized in the overview.

#### Risk360
Cyber risk quantification framework. Monte Carlo financial-loss simulation 1000x/day across 4 scenarios (inherent / residual / 30-day / peer). 115-140+ factors across 4 attack stages × 4 entities, mapped to MITRE ATT&CK / NIST CSF / SEC S-K 106(b). Paid add-on under Security Operations tier. CISO/board audience. Reasoning doc: [`../risk360/overview.md`](../risk360/overview.md). No SDK / TF presence.

#### AI Security family (AI Guard / AI Guardrails / AI Red Teaming)
Family includes AI Guard (15 detector categories: prompt injection, jailbreak, toxicity, sensitive data, off-topic responses, malicious URLs, language enforcement, code injection, gibberish, refusal-as-DoS, finance advice, prompt tagging, competitor discussion, URL reachability, legal advice), AI Guardrails (marketing umbrella — same product), AI Red Teaming (offline vulnerability assessment for customer LLM apps), and the four-pillar governance framework. Three deployment modes: Proxy (inline), DaaS (application-layer sidecar), OnPrem hybrid. Layers on top of existing ZIA GenAI URL Filter categories + DLP prompt scanning. Reasoning doc: [`../ai-security/overview.md`](../ai-security/overview.md). No SDK module in Python or Go SDK; portal-only configuration. Captures: `vendor/zscaler-help/ai-security-marketing.md`, `ai-guardrails-marketing.md`, `ai-guard-what-is.md`.

#### ZMS — Zscaler Microsegmentation
East-west / workload-to-workload policy via host-installed agents (Win/Linux), AI-powered policy recommendations on a 14-day rolling telemetry window, local OS enforcement (Windows Filtering Platform / Linux nftables). Positioned as a ZPA add-on. Reasoning doc: [`../zms/overview.md`](../zms/overview.md). No SDK module; portal-only configuration. Captures: `vendor/zscaler-help/microsegmentation-marketing.md`, `zero-trust-microsegmentation-marketing.md`, `what-is-microsegmentation-zpa.md`.

#### ZSDK — Zscaler SDK for Mobile Apps
**Different product than ZCC.** ZSDK is a **mobile SDK (iOS/Android) for consumer-facing apps** — app developers embed it into their own mobile app's source code so end users get zero-trust connectivity to back-end services without installing any separate Zscaler agent. Access tokens (JWTs) validate user identity; mTLS microtunnels route traffic to back-end APIs and services hidden behind App Connectors. Shares App Connector + Private Service Edge infrastructure with ZPA but runs on a **dedicated multi-tenant cloud at `admin.zsdkone.net`**. Browser Access (limited availability) extends ZPA-style clientless web-app access to ZSDK-protected apps without requiring SDK integration — auth via IdP JWT in any browser. Configuration is portal-based; no first-party Zscaler API SDK for managing ZSDK config (the SDK *is* the product). Tier 2a not because it lacks substance — 30 pages of help-portal content captured — but because it doesn't fit the "zscaler-sdk-* / terraform-provider-*" management surface this skill primarily targets. Captures under `vendor/zscaler-help/zsdk-*.md`.

### Tier 2b — Awareness only (one-paragraph treatment)

Products described conceptually here. Operators asking get the paragraph; deep technical questions redirect to Zscaler docs / TAM / Support.

#### ITDR — Identity Threat Detection & Response
Marketed as **Zscaler Identity Protection**. Real-time detection and response for identity-based attacks: DCSync, DCShadow, kerberoasting, LDAP enumeration, credential theft, privilege escalation, lateral movement. Built into the ZCC agent (no separate VM); integrates natively with ZPA for real-time threat containment, plus SIEM and EDR for SOC workflows. Provides unified identity risk scoring with MITRE ATT&CK mapping; surfaces risky configurations (shared/stale passwords, unconstrained delegation) and exposed endpoint credentials. Distinct from **ZIdentity** (which is the IdP / authentication layer); ITDR sits on top to detect compromise in flight. **Fill priority** because identity attacks are central to modern zero-trust threat models — 75% of 2023 access attacks were malware-free per CrowdStrike (cited by Zscaler). Capture: `vendor/zscaler-help/itdr-zscaler-identity-protection-marketing.md`. No public SDK / TF surface — portal + ZCC agent.

#### Resilience
Comprehensive cloud-resilience capability set spanning four failure tiers: minor failures (auto-remediated node/software issues), blackouts (autonomous + manual failover for localized outages), brownouts (dynamic service-edge selection + customer-controlled DC exclusion), and catastrophic events (Business Continuity Cloud — private service edges with critical-app-only restrictions during full cloud outages). Distinct from but related to **Business Continuity Cloud** (separate product, the catastrophic-tier deployment surface — adds private control plane + private service edges; covered in `references/shared/cloud-architecture.md`). Resilience as a product is the umbrella across all four tiers. Capture: `vendor/zscaler-help/zscaler-resilience-marketing.md`. No SDK / programmatic surface — operational configuration only.

#### Business Continuity Cloud
The catastrophic-tier deployment surface inside the Resilience umbrella — the dedicated infrastructure that takes over when the Zscaler public cloud is unreachable. Two Zscaler-managed components on top of customer-deployed ZIA Private Service Edges: **Private Policy Cache** (last-known-good policy repository, syncs from public cloud during normal ops, serves enforcement during outages) and **Private PAC Servers** (host customer PAC files, geo-aware traffic redirection to the nearest BC site). Both deployed in redundant pairs per BC site. Important constraint: **only Z-Tunnel 1.0, PAC files, and GRE tunnels are supported** in BC mode — Z-Tunnel 2.0 is not. Public-cloud upgrades are intentionally delayed at the BC tier for fault isolation. Capture: `vendor/zscaler-help/understanding-business-continuity-cloud-components.md`. No SDK / TF surface — Zscaler-managed; customer side is just the Private Service Edge deployment.

### Adjacent / newer (medium relevance)

#### DSPM — Data Security Posture Management
AI-powered **at-rest** data security: discovery, LLM-based classification, posture management, access governance, compliance, AI security. Covers IaaS (AWS / Azure / GCP), SaaS, on-prem databases, endpoints, and AI/GenAI services (cloud-hosted models, LLM platforms). **Distinct from ZIA DLP** — DSPM answers "what sensitive data exists and who can access it?" against stored data, while ZIA DLP answers "where is data moving?" inline at the network layer. Together they form full data protection. Notable: AI model discovery (eliminate shadow AI), OWASP-Top-10-for-LLMs assessment, GDPR/HIPAA/PCI/NIST-AI-RMF compliance mapping. Integrates with ZIA / ZPA / DLP / CASB and external ITSM. Capture: `vendor/zscaler-help/dspm-marketing.md`. Portal-only configuration; no SDK surfaced.

#### Asset Exposure Management — CAASM
"Golden record" asset inventory across the enterprise. Aggregates from 150+ data-source connectors (via the Data Fabric for Security from the Avalor acquisition), deduplicates, surfaces coverage gaps (missing EDR, missing controls), maintains CMDB hygiene (auto-discovery of unregistered assets visible in network traffic), runs automated remediation (CMDB enrichment, ticket creation, policy initiation). Marketing claim: typical orgs are missing 20-30% of their assets from inventory. Cluster member of the **Exposure Management suite**: AEM (asset side) + UVM (vulnerability side) + Risk360 (quantification) + EASM (outside-in) + CTEM (continuous program). Capture: `vendor/zscaler-help/asset-exposure-management-caasm-marketing.md`. Data-Fabric-powered; integration via 150+ connectors. No customer-facing SDK surfaced.

#### UVM — Unified Vulnerability Management
Risk-based vulnerability prioritization powered by the Data Fabric (Avalor acquisition, March 2025). Out-of-the-box multifactor scoring that considers BOTH risk factors AND mitigating controls (unlike traditional CVSS-only tools); customizable factors and weights; 150+ prebuilt integrations spanning CVE feeds, threat intel, identity, cloud services, user behavior. Distinguishing primitives: **AnySource connector** (integrate flat files / webhooks; new connectors in weeks) and **AnyTarget connector** (push to any downstream). Two-way ticketing integration with auto reconciliation. Marketed metrics: 80% of "critical" issues downgraded to "medium" after context-aware prioritization, 10× triage capacity. Positioned as a CTEM accelerator. Capture: `vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md`. No customer SDK; integration is via connector framework.

#### CTEM — Continuous Threat Exposure Management
Program / discipline offering rather than a single SKU — Zscaler markets CTEM as the continuous-improvement framework that the Exposure Management suite operationalizes. The suite components feed it: **AEM** (asset coverage), **UVM** (vulnerability prioritization), **EASM** (outside-in attack surface), **Risk360** (quantification), **Deception** (post-breach detection). UVM is positioned explicitly as a "CTEM accelerator." Distinct from individual product SKUs in that customers buy the program (typically as a multi-product bundle within Security Operations) rather than a single discrete offering. The five-stage CTEM model (scoping → discovery → prioritization → validation → mobilization) maps onto Zscaler's suite roughly as: AEM scopes/discovers, UVM prioritizes, Deception validates, Risk360 reports up. Captures: `vendor/zscaler-help/security-operations-suite-marketing.md`, `agentic-secops-security-operations-marketing.md`. No SDK — program-level offering; the SDK surfaces of the underlying products are what's accessible.

#### Cloud Protection / Zero Trust Cloud
Pillar offering combining CSPM (cloud security posture management), microsegmentation, and secure east-west / ingress-egress traffic for workloads in AWS / Azure / on-prem. Marketed as a platform pillar rather than a discrete product. Adjacent to Cloud Connector but different scope: **Cloud Connector forwards workload traffic; Cloud Protection scans cloud configuration**. Awareness only — no dedicated capture beyond the marketing-page references.

#### Posture Control — CNAPP
The standalone **Cloud Native Application Protection Platform (CNAPP)** under Cloud Protection. Converges CSPM + CIEM (Cloud Infrastructure Entitlement Management) + CWPP (Cloud Workload Protection Platform) + DLP + IaC security + vulnerability management + compliance into one unified platform. **Agentless** — API-based scan of container images in registries and VMs in production. Multi-cloud (AWS, Azure, GCP, Oracle Cloud Infrastructure). Distinguishing capability: correlates seemingly-low-risk individual misconfigurations into composite high-risk attack paths to reduce alert fatigue. Note: marketing page redirects to the broader DSPM / CNAPP messaging — Posture Control's standalone identity has narrowed; the CSPM+CIEM-converged messaging is the canonical reference. No SDK surfaced; agentless API scanning is the integration model.

#### Zscaler Cellular
**Zero-Trust SIM card for IoT/OT cellular connectivity** (GA August 2025). Two deployment modes: (1) Zscaler Cellular Service — plug-and-play agentless security for cellular IoT; (2) Zscaler Cellular Partner Service — partner-managed SIM infrastructure with HA/failover. Multi-operator coverage (520+ global carriers per company press releases). The SIM steers all device traffic to the Zero Trust Exchange — no on-device software, no VPN client, no infrastructure changes. Use cases: POS systems, EV chargers, vending machines, vehicle telemetry, industrial IoT, government deployments. **No customer-facing API/SDK** — provisioning is via Zscaler-issued SIMs through Zscaler Account team or partner channel. Capture: `vendor/zscaler-help/zscaler-cellular-marketing.md`.

#### Microsoft Copilot Data Protection
Marketed as **Zscaler Copilot Security for Microsoft**. Targets Copilot's overconsumption / oversharing risk — Copilot indexes data from OneDrive / SharePoint / Teams and can surface it to underprivileged users via prompts. Four capabilities: (1) Prompt visibility + DLP on Copilot inputs, (2) Permission remediation (remove excessive sharing), (3) Sensitivity-label enforcement (add missing Purview labels), (4) Configuration hardening (Microsoft 365 misconfig closure). Both **API-based** (data classification, permissions) and **inline** (prompt DLP) integration paths. Sits within the broader Zscaler Data Security pillar alongside DLP / CASB / DSPM. Vendored deployment guide is the canonical operational reference. Capture: `vendor/zscaler-help/microsoft-copilot-security-marketing.md`. No SDK surface specific to this product.

#### Red Canary MDR (post-acquisition)
Acquisition completed; Red Canary operates initially as a separate business unit within Zscaler. Combines Zscaler's data scale + ThreatLabz intelligence with Red Canary's MDR expertise to deliver an "agentic SOC" — AI-driven workflows + human expertise. Marketing claims: 10× faster threat identification, 99.7% threat accuracy. Sits within the **Security Operations** suite (alongside Risk360, Deception, AEM, UVM, EASM, CTEM, Managed Threat Hunting); Agentic SecOps is the AI-automation layer that ties them together. Integration semantics with the rest of the SecOps suite are still emerging at capture date — Red Canary's standalone product surfaces remain operational. Captures: `vendor/zscaler-help/security-operations-suite-marketing.md` (Red Canary positioned within), plus `agentic-secops-security-operations-marketing.md` (architectural pillar treatment). No customer SDK surfaced specifically for Red Canary — managed-service-shaped delivery.

#### Managed Threat Hunting
Expert-led 24×7 threat hunting service inside the Security Operations suite — proactive search for sophisticated threats, anomalies, and TTPs that automated detection misses. Distinct from but complementary to Red Canary MDR (Red Canary is the broader managed-detection-and-response layer; Managed Threat Hunting is the specialized human-expertise component within it). Sits alongside Risk360, Deception, AEM, UVM, EASM, CTEM in the SecOps marketing cluster. Pure managed-service delivery — no portal configuration surface, no SDK; customer engagement is via the Zscaler account team. Captures: `vendor/zscaler-help/security-operations-suite-marketing.md`, `agentic-secops-security-operations-marketing.md`.

#### CASB — disambiguation, not a separate product
Zscaler markets CASB capabilities as part of two existing products rather than as a standalone CASB SKU:
- **Inline CASB** is delivered through ZIA — Cloud App Control (CAC), Tenant Profiles, SaaS application visibility, in-line DLP for cloud apps. Configuration lives in the ZIA admin surfaces; SDK / TF coverage falls under ZIA.
- **Out-of-band CASB** (also called API CASB / SaaS Security Posture) is delivered through DSPM / SaaS Security Report — discovery, classification, posture management against stored data and SaaS configuration.
Customers will use the term "CASB" expecting one product; the skill should recognize it and disambiguate to whichever surface they actually need (inline-policy → ZIA; data-at-rest / posture → DSPM; shadow-IT discovery → SaaS Security Report / ZINS). No dedicated `casb` namespace in any SDK — this is intentional; Zscaler's CASB story is the federation of those product surfaces.

#### Zero Trust Exchange for B2B
Marketed as **Zscaler B2B**. Site-to-site connectivity for B2B applications via ZTNA — extends ZPA's user-to-app model to **partner-to-app and site-to-site** scenarios (third-party contractors, supplier organizations, B2C customers). Eliminates inbound DMZ / open ports / site-to-site VPN. Three primary deployment shapes: site-to-site (location ↔ location over ZTNA), partner portals (browser-based app delivery to external users), B2C mobile (consumer-facing application access). Distinguishing detail vs base ZPA: B2B handles cross-organization identity and trust, not just cross-segment-within-one-org. Full TLS/SSL inspection at scale. Capture: `vendor/zscaler-help/zscaler-b2b-marketing.md`. No SDK distinct from ZPA's; configured via the broader ZPA admin surfaces.

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

## Coverage statistics (as of 2026-04-26)

- **Tier 1 — Deep-dive products (with API/SDK):** 9 (ZIA, ZPA, ZCC, ZDX, ZBI, ZIdentity, Cloud Connector, ZWA, AppProtection)
- **Tier 2a — Extended awareness (substantial captures, no managed-API surface):** 5 (Deception, Risk360, AI Security family, ZMS, ZSDK)
- **Tier 2b — Awareness only (paragraph here):** ~19 (ITDR, Resilience, Business Continuity Cloud, DSPM, Asset Exposure Mgmt, UVM, CTEM, Cloud Protection / ZTC, Posture Control, Zscaler Cellular, Microsoft Copilot Data Protection, Red Canary MDR, Managed Threat Hunting, ZTE for B2B, ZINS, EASM, Federal Cloud variants, etc.) plus a CASB disambiguation entry (CASB is delivered via ZIA + DSPM/SaaS Security, not a standalone product)
- **Tier 3 — Truly out-of-scope:** 0 (currently empty; reserved for deprecated / internal / unshipped)
- **Architectural pillars named:** 4 (ZTE, Data Fabric, Agentic SecOps, plus the customer-segment "Zero Trust for X" framing)

Total Zscaler portfolio: roughly 33 distinct products + 4 architectural pillars at this date. We have full operational depth on 9, expanded captures + awareness on 5 more (14 with substantial content total), are at-minimum aware of all the rest, deliberately ignore none.

## Maintenance

Zscaler ships rapidly — products are added, renamed, deprecated, acquired. Re-validate this map quarterly:

1. Visit `https://www.zscaler.com/products-and-solutions`
2. Walk the product menus / categories
3. For each product Zscaler markets that's NOT on this map, add it as Tier 2 awareness by default. The bar for Tier 1 promotion is "we have or want operational depth on it"; the bar for staying out of Tier 3 is just "Zscaler markets it as a product."
4. For each product on this map that's NOT on Zscaler's site, mark deprecated (don't delete — institutional memory matters; consider moving to Tier 3 if Zscaler has formally sunset it).
5. Bump `last-verified` to today's date.

Acquisitions typically take 6-12 months to fully integrate; track them as Tier 2 awareness even before integration completes.

## Cross-links

- Cross-product hooks between deep-dive products: [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
- Cloud architecture (the platform layer underlying all products): [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
- OneAPI gateway (the API entrypoint for the 7 products with REST APIs): [`../shared/oneapi.md`](../shared/oneapi.md)
- Terminology disambiguation across products and legacy names: [`../shared/terminology.md`](../shared/terminology.md)
