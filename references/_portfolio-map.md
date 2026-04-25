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

Three coverage tiers:

- **Deep-dive** — full reasoning doc(s) under `references/<product>/`. Skill answers detailed questions.
- **Awareness** — identified, summarized, cross-linked, but no detailed reasoning yet. Skill can describe the product and its purpose; deep technical questions need external sourcing.
- **Out-of-scope** — exists in the Zscaler portfolio, recognized, deliberately not covered. Skill should redirect.

## Architectural pillars (the platform-level naming)

These aren't products — they're how Zscaler markets the platform layer that ties products together. Customers reference them in conversation; the skill needs to recognize them.

| Pillar | What it names | Coverage |
|---|---|---|
| **Zero Trust Exchange (ZTE)** | The unified policy + enforcement plane underlying all products. Zscaler's marketing umbrella — "500 trillion daily signals," four-stage model (Verify Identity / Determine Destination / Assess Risk / Enforce Policy), ~45% Fortune 500 adoption, 2025 Gartner SSE Leader. Capture: `vendor/zscaler-help/zero-trust-exchange-zte-marketing.md`. | Awareness with capture |
| **Data Fabric for Security** | Aggregation + unification layer powered by the Avalor acquisition. **150 pre-built integrations**, AnySource connector. Backbone of CTEM / Risk360 / UVM / Asset Exposure Mgmt — all the Exposure Management stack uses Data Fabric as the underlying data layer. Capture: `vendor/zscaler-help/data-fabric-for-security-marketing.md`. | Awareness with capture |
| **Agentic SecOps** | **No dedicated product URL** — capability layer within the broader **Security Operations** marketing page. AI agents trained on 11+ years of telemetry; "99.7% threat accuracy" claimed; Red Canary MDR integration is core. Bigger than the name implies: encompasses **EASM, Asset Exposure Mgmt, UVM, Risk360, CTEM, Deception, Red Canary MDR** as one suite, with Agentic SecOps as the AI automation layer across all of them. Projected $400M+ ARR FY26. Capture: `vendor/zscaler-help/agentic-secops-security-operations-marketing.md`. | Awareness with capture |
| **Zero Trust for Users / Workloads / Branch / B2B** | The four customer-segment pillars. Maps to product groupings rather than discrete SKUs. | Implicit in product docs |

## Tier 1 — Deep-dive coverage (13 products)

Each has a dedicated `references/<product>/` directory with multiple reasoning docs (or a focused single-doc deep-dive).

| Product | What it does | Deep-dive entry |
|---|---|---|
| **ZIA — Internet & SaaS** | Cloud-delivered secure web gateway. URL filtering, SSL inspection, CAC, DLP, sandbox, malware/ATP, firewall, IPS, bandwidth, FTP/file-type. The "secure forward proxy" of the suite. | [`zia/index.md`](./zia/index.md) |
| **ZPA — Private Access** | Zero-trust application access for private apps without VPN. App segments, policy precedence, App Connectors, Browser Access, PRA. | [`zpa/index.md`](./zpa/index.md) |
| **ZCC — Client Connector** | The endpoint agent that forwards user traffic into the cloud. Forwarding profiles, trusted networks, web policy, devices, entitlements, Z-Tunnel. | [`zcc/index.md`](./zcc/index.md) |
| **ZDX — Digital Experience** | User experience monitoring across apps, networks, endpoints. Probes, ZDX Score, diagnostics sessions (deeptraces), alerts. | [`zdx/index.md`](./zdx/index.md) |
| **ZBI — Cloud Browser Isolation** | Remote-browser rendering for risky / unmanaged-device scenarios. Isolation profiles, Smart Browser Isolation, ZPA Isolation Policy. Marketed as "Zero Trust Browser." | [`zbi/index.md`](./zbi/index.md) |
| **ZIdentity** | Unified identity + auth platform for the Zscaler ecosystem. OneAPI OAuth, API Clients, step-up auth, admin RBAC. | [`zidentity/index.md`](./zidentity/index.md) |
| **Cloud & Branch Connector (ZTW / ZTC / CBC)** | VM-based traffic forwarding for cloud workloads (AWS / Azure / GCP) and branch offices. Cloud Connector Groups, traffic forwarding, gateway failover. **Five marketing names for the same product family.** | [`cloud-connector/index.md`](./cloud-connector/index.md) |
| **ZWA — Workflow Automation** | DLP incident lifecycle management. Incident triage, workflows, ticketing/notification integrations. Downstream of ZIA DLP. | [`zwa/index.md`](./zwa/index.md) |
| **Zscaler Deception** | Active-defense threat detection via decoys (fake servers, AD objects, endpoints, cloud assets). Detects post-breach lateral movement / APTs / ransomware. Integrates with ZPA via Zero Trust Network decoys. | [`deception/index.md`](./deception/index.md) |
| **AppProtection** (ZPA) | Inline WAF/IPS for ZPA-protected applications. OWASP CRS, ThreatLabZ, Active Directory protocol controls (Kerberos/SMB/LDAP), API, WebSocket. Bundled into ZPA (mostly); Browser Protection tier-gated. Was previously called "Inspection" in ZPA. | [`zpa/appprotection.md`](./zpa/appprotection.md) |
| **Risk360** | Cyber risk quantification framework. Monte Carlo financial-loss estimation. 115-140+ factors across 4 attack stages, 4 entities, MITRE/NIST/SEC framework mapping. CISO/board audience. Paid add-on under Security Operations tier. | [`risk360/index.md`](./risk360/index.md) |
| **AI Security family** | AI Guard runtime guardrails (15 detector categories, Proxy / DaaS / OnPrem deployment), AI Guardrails (marketing umbrella for AI Guard), AI Red Teaming (vulnerability assessment for customer LLM apps), and the four-pillar governance framework. Layers on top of ZIA URL Filter + DLP + SSL inspection in proxy mode; decoupled from the Zscaler stack in DaaS mode. **No SDK module — portal-only configuration.** Confidence: medium (marketing-grounded). | [`ai-security/index.md`](./ai-security/index.md) |
| **ZMS — Microsegmentation** | East-west / workload-to-workload policy enforcement via host-installed agents (Win/Linux). AI-powered policy recommendations on a 14-day rolling telemetry window. Local OS enforcement (Windows Filtering Platform / Linux nftables). Positioned as a ZPA add-on; **no SDK module — portal-only configuration.** Confidence: medium (marketing-grounded). | [`zms/index.md`](./zms/index.md) |

## Tier 2 — Awareness only (no deep-dive yet)

Products Zscaler actively markets that we recognize and can describe but haven't deep-dived. Customers asking about these get a one-paragraph answer; deep technical questions get redirected to Zscaler docs / TAM / Support.

### Inside the existing scope (high relevance — fill priority)

#### ~~AppProtection~~ — promoted to deep-dive 2026-04-24
Now in Tier 1 — see [`./zpa/appprotection.md`](./zpa/appprotection.md). Inline WAF/IPS engine inside the ZPA data path. 6 control categories (OWASP CRS 4.8, ThreatLabZ, Active Directory Kerberos+SMB+LDAP, API, WebSocket, custom HTTP/WebSocket). Three-tier policy model. Bundled with ZPA; Browser Protection appears tier-gated. Was previously called "Inspection" — historical references to `zpn_inspection_profile_id` etc. point at AppProtection.

#### ~~Risk360~~ — promoted to deep-dive 2026-04-24
Now in Tier 1 — see [`./risk360/index.md`](./risk360/index.md). Cyber risk quantification framework. Monte Carlo financial-loss simulation 1000x/day across 4 scenarios (inherent / residual / 30-day / peer). 115-140+ factors across 4 attack stages × 4 entities, mapped to MITRE ATT&CK / NIST CSF / SEC S-K 106(b). Paid add-on under Security Operations tier. CISO/board audience.

#### ITDR (Identity Threat Detection & Response)
Marketed as **Zscaler Identity Protection**. Detects credential theft, privilege escalation, DCSync, Kerberoasting, and risky identity configurations on the endpoint. Integrated into the ZCC agent. Distinct from ZIdentity (which is the IdP layer); ITDR sits on top to detect identity attacks in flight. Not deep-dived; **fill priority** because identity attacks are a core zero-trust concern.

#### Resilience
Automatic carrier / datacenter failover for ZIA, ZPA, ZCC. Bundled into Business+ editions. Adjacent to but distinct from BC Cloud (which we cover in `cloud-architecture.md`). Not deep-dived; **fill priority** for enterprises with uptime guarantees.

#### ~~Zscaler Deception~~ — promoted to deep-dive 2026-04-24
Now in Tier 1 — see [`./deception/index.md`](./deception/index.md). Active-defense threat detection via decoys (fake servers, AD objects, endpoints, cloud assets); detects post-breach lateral movement / APTs / ransomware; integrates with ZPA via Zero Trust Network decoys. Three captures in `vendor/zscaler-help/` synthesized into `references/deception/overview.md`.

### Adjacent / newer (medium relevance)

#### DSPM (Data Security Posture Management)
AI-powered data discovery, classification, and risk scoring across IaaS / SaaS / on-prem (BYOM, Copilot, endpoints, GenAI flows). **Distinct from ZIA DLP** — ZIA DLP is in-flight inspection; DSPM is at-rest discovery + classification. Bundled with broader Data Security module but marketed separately. Awareness only.

#### Asset Exposure Management
Cyber Asset Attack Surface Management (CAASM). Unified asset inventory with CMDB auto-sync, coverage gap detection, automated remediation workflows. Powered by the Data Fabric (Avalor acquisition). Newer offering (Feb 2025). Awareness only.

#### Unified Vulnerability Management (UVM)
Contextual vulnerability + exploitability scoring with remediation prioritization. Data Fabric-powered, 150+ third-party connectors. Separate product. Awareness only.

#### Cloud Protection / Zero Trust Cloud
Pillar offering combining CSPM (cloud security posture management), microsegmentation, and secure east-west / ingress-egress traffic for workloads in AWS / Azure / on-prem. Marketed as a platform pillar. Awareness only — adjacent to Cloud Connector but a different scope (config scan, not traffic forwarding).

#### Posture Control
The standalone CSPM + CIEM (cloud infrastructure entitlement management) + cloud-DLP product within Cloud Protection. Workload posture and access-permission hygiene. Awareness only.

#### Zscaler Cellular
Zero-Trust SIM card for IoT / OT cellular connectivity. No software / VPN required on-device. Includes a cellular edge routing layer. New (Aug 2025). Awareness only — niche but growing.

#### Microsoft Copilot Data Protection
Specific data-protection controls for enterprise Copilot use. Overrides permissions / labels at the Copilot interaction layer. Sub-capability of the broader Data Security module. Awareness only.

#### Red Canary MDR (post-acquisition)
Zscaler announced acquisition of Red Canary in May 2025 to build out Agentic SecOps. Endpoint + cloud detection fusion. Awareness only — integration semantics still emerging.

#### Zero Trust Exchange for B2B
Newer pillar for secure app-sharing across partner organizations (Feb 2025, limited GA at capture date). Awareness only.

### Adjacent products previously classified out-of-scope (re-promoted 2026-04-24)

These were initially marked Tier 3 ("out of scope") under a "do we use it?" frame. The second-brain framing requires articulateness about everything Zscaler markets, regardless of operational use. Promoted to awareness with one-paragraph treatment + 15 vendored marketing/help-portal captures landed 2026-04-24.

#### ~~ZMS — Zscaler Microsegmentation~~ — promoted to deep-dive 2026-04-25
Now in Tier 1 — see [`./zms/index.md`](./zms/index.md). East-west / workload-to-workload policy via host-installed agents (Win/Linux), AI-powered policy recommendations on a 14-day rolling telemetry window, local OS enforcement (Windows Filtering Platform / Linux nftables). Positioned as a ZPA add-on. **No SDK presence** — neither Python nor Go SDK has a ZMS module as of v2.0.0 / current Go HEAD; configuration is portal-only.

#### Shadow IT / SaaS Security Report — formerly "ZINS"
**Renamed.** Originally "Shadow IT Report" (ZINS naming), now marketed as "**SaaS Security Report**" in current help docs. Reporting product covering Shadow IT discovery (unsanctioned cloud apps users access), IoT device visibility, and SaaS-app risk reporting. Powered by traffic flowing through ZIA — extracts visibility signals from existing ZIA telemetry. Not a policy-enforcement product; pure observability. Risk Index 1-5 per app; sanctioned/unsanctioned breakdown; supports up to **50,000 cloud apps** in the catalog (some marketing material still cites the older 8,500+ figure — outdated). The GraphQL Analytics API at `https://api.zsapi.net/zins/graphql` is its API surface — the `zins` namespace persists even though the marketing name changed. **No dedicated SDK module** — neither Python nor Go SDK has a `zins` namespace; access is direct GraphQL via OneAPI auth. Captures: `vendor/zscaler-help/shadow-it-saas-security-report-zia.md`, `shadow-it-marketing.md`.

#### EASM — External Attack Surface Management
Discovery and analysis of an organization's internet-exposed assets — domains, IPs, services, certificates — to surface unknown / shadow / forgotten infrastructure that attackers can find before defenders do. **Repositioning note**: EASM no longer has a standalone product URL on zscaler.com — it's now positioned as a component of the broader **Exposure Management** suite (alongside Asset Exposure Management, Unified Vulnerability Management, Risk360, CTEM, Deception). Help portal does have dedicated `/easm/` content. Capabilities: passive + active scanning; CISA KEV-based risk prioritization; M&A diligence use cases; risk scores Critical (90-100) → Low (1-39). Adjacent to but distinct from Asset Exposure Management (internal CAASM). EASM is outside-in attacker-perspective; AEM is inside-out infrastructure-team-perspective. **No SDK module** in Python or Go SDK; portal + help-portal docs only. Captures: `vendor/zscaler-help/easm-what-is-zscaler-easm.md`, `easm-introducing-marketing.md`.

#### ~~AI Guard / AI Security family~~ — promoted to deep-dive 2026-04-25
Now in Tier 1 — see [`./ai-security/index.md`](./ai-security/index.md). Family includes AI Guard (15 detector categories: prompt injection, jailbreak, toxicity, sensitive data, off-topic responses, malicious URLs, language enforcement, code injection, gibberish, refusal-as-DoS, finance advice, prompt tagging, competitor discussion, URL reachability, legal advice), AI Guardrails (marketing umbrella — same product), AI Red Teaming (offline vulnerability assessment for customer LLM apps), and the four-pillar governance framework (AI Asset Management / Secure Access / Secure AI Apps & Infra / AI Governance). Three deployment modes: Proxy (inline), DaaS (application-layer sidecar), OnPrem hybrid. **No SDK module** in Python or Go SDK; portal + help-portal docs only. Layers on top of existing ZIA GenAI URL Filter categories + DLP prompt scanning. Captures: `vendor/zscaler-help/ai-security-marketing.md`, `ai-guardrails-marketing.md`, `ai-guard-what-is.md`.

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

Currently empty. Earlier classifications under this tier (ZMS, ZINS, EASM, AI Security, Federal Cloud) were re-promoted to Tier 2 awareness on 2026-04-24 — see § "Adjacent products previously classified out-of-scope" above.

This tier is reserved for:
- **Deprecated products** Zscaler has officially sunset
- **Internal-only / pre-GA products** without public documentation
- **Vaporware / announced-but-not-shipped** products
- **Renamed products** where the legacy name should redirect (handled in `references/shared/terminology.md` rather than here)

Add entries here only when a product genuinely doesn't merit awareness.

## How the skill should use this map

When a question lands:

1. **If the product has a Tier 1 entry**, route to its `references/<product>/` deep-dive.
2. **If Tier 2**, give the one-paragraph answer from this map, identify what specifically the user wants, and either (a) provide the conceptual framing without claiming deep authority, or (b) recommend the relevant Zscaler help-site path / TAM consultation.
3. **If Tier 3** (currently empty), redirect outright — the product is deprecated, internal-only, or unshipped.

Never pretend deep-dive coverage exists where it doesn't. Confidence drop is honest signal — but **always be articulate about every Zscaler-marketed product**. The chatbot-foundation goal requires breadth of awareness, not just operational depth on the products we use.

## Coverage statistics (as of 2026-04-25)

- **Deep-dive products:** 13 (after AI Security family + ZMS promoted from awareness 2026-04-25, on top of Deception / AppProtection / Risk360 promoted 2026-04-24)
- **Awareness products:** 12 (Tier 2 — after AI Security and ZMS promoted out)
- **Truly out-of-scope products:** 0 (Tier 3 currently empty; reserved for deprecated / internal / unshipped)
- **Architectural pillars named:** 4 (ZTE, Data Fabric, Agentic SecOps, plus the customer-segment "Zero Trust for X" framing)

Total Zscaler portfolio: roughly 25 distinct products + 4 architectural pillars at this date. We deep-dive 13 (just over half), are at-minimum aware of all the rest, deliberately ignore none.

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
