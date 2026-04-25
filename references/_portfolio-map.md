---
product: shared
topic: "portfolio-map"
title: "Zscaler product portfolio map"
content-type: reference
last-verified: "2026-04-24"
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
| **Zero Trust Exchange (ZTE)** | The unified policy + enforcement plane underlying all products. The marketing umbrella for Zscaler's cloud. | Awareness — concepts implicit in `references/shared/cloud-architecture.md`; not named explicitly anywhere |
| **Data Fabric for Security** | Aggregation + unification layer powered by the Avalor acquisition. Foundation for Risk360, Asset Exposure Mgmt, UVM, CTEM. | Awareness only |
| **Agentic SecOps** | Newer pillar combining inline controls + telemetry + third-party data + AI agents. Reinforced by the Red Canary acquisition (May 2025). | Awareness only |
| **Zero Trust for Users / Workloads / Branch / B2B** | The four customer-segment pillars. Maps to product groupings rather than discrete SKUs. | Implicit in product docs |

## Tier 1 — Deep-dive coverage (8 products)

The eight core products operators interact with daily. Each has a dedicated `references/<product>/` directory with multiple reasoning docs.

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

These were initially marked Tier 3 ("out of scope") under a "do we use it?" frame. The second-brain framing requires articulateness about everything Zscaler markets, regardless of operational use. Promoted to awareness with one-paragraph treatment.

#### ZMS — Zscaler Microsegmentation
**East-west / workload-to-workload policy.** Distinct from ZPA's north-south user-to-app model. Used to enforce per-flow policy between servers, containers, and cloud workloads — typically inside a single VPC or across a multi-cloud environment. Mental model: ZPA segments user→app traffic; ZMS segments app→app traffic. Real product, vendored in `vendor/zscaler-sdk-python/zscaler/zms/` and `vendor/zscaler-sdk-go/zscaler/zms/`. No deep-dive in this skill — operational scenarios for ZMS rarely come up in user-traffic / policy-precedence reasoning, but customers absolutely buy + run it for workload-protection use cases. If a question lands here, acknowledge the product, give this paragraph, recommend Zscaler docs / TAM for depth.

#### ZINS — Shadow IT / IoT / SaaS Reporting
Reporting product covering three adjacent surfaces: Shadow IT discovery (unsanctioned cloud apps users access), IoT device visibility, and SaaS-app risk reporting. Powered by traffic flowing through ZIA — extracts visibility signals from existing ZIA telemetry. Not a policy-enforcement product; pure observability. Distinct from but related to Risk360 (Risk360 quantifies; ZINS reports). Vendored in SDK as `zscaler/zins/`. The GraphQL Analytics API at `https://api.zsapi.net/zins/graphql` (mentioned in `references/shared/oneapi.md`) is ZINS's API surface — covers SaaS Security, Cyber Security, Zero Trust Firewall, IoT, Shadow IT, Web Traffic domains.

#### EASM — External Attack Surface Management
Discovery and analysis of an organization's internet-exposed assets — domains, IPs, services, certificates — to surface unknown / shadow / forgotten infrastructure that attackers can find before defenders do. Adjacent to but distinct from **Asset Exposure Management** (which is internal CAASM). EASM is outside-in attacker-perspective; AEM is inside-out infrastructure-team-perspective. Audience: security researchers and proactive defense teams. Vendored in SDK as `zscaler/zeasm/`.

#### ZAI Guard and the broader AI Security platform
Zscaler's AI Security family covers AI/LLM traffic protection at multiple layers:
- **ZAI Guard** — inline policy and inspection for LLM / generative AI traffic (prompts, responses, attachments). Adjacent to ZIA's GenAI URL flags and DLP's prompt scanning but as a dedicated product.
- **AI Asset Management** — discovery of AI tools and agents in use across the org.
- **AI Access Security** — access control for AI services (OpenAI, Anthropic, etc.).
- **AI Red Teaming** — adversarial testing of customer AI deployments.
- **AI Guardrails** — runtime policy enforcement on AI agent behavior.
A cohesive product family; ZAI Guard is the most operationally relevant for traffic-and-policy reasoning. Vendored in SDK as `zscaler/zaiguard/`. Partial coverage in this skill via the 12 GenAI prompt-tracking flags in URL Filtering and the prompt-scanning patterns in DLP. Worth a focused capture pass if AI traffic becomes material.

#### Federal Cloud variants (`zscalergov`, `zscalerten`, ZPA GOV / GOVUS)
Not strictly products — these are **regulated-cloud editions** of the existing product line for US government and gov-adjacent tenants. ZIA / ZPA / ZCC etc. all have gov-cloud variants. Most behavior inherits from the commercial cloud; differences are:
- **Auth paths** — gov-cloud tenants have separate ZIdentity instances and OAuth endpoints.
- **Feature availability** — newer features may launch in commercial cloud first, gov second; some commercial features are restricted in gov.
- **Compliance posture** — FedRAMP / IL5 / etc. authorizations differ.
- **Data residency** — gov-cloud data stays in-region (US); commercial may not.
Mentioning gov-cloud awareness matters because many enterprises have both commercial and gov tenants for different business units. Skill should recognize gov-cloud questions and route to Zscaler's federal-cloud documentation rather than confidently extrapolating from commercial behavior.

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

## Coverage statistics (as of 2026-04-24)

- **Deep-dive products:** 11 (after Deception, AppProtection, Risk360 promoted from awareness)
- **Awareness products:** 14 (Tier 2 — after ZMS, ZINS, EASM, AI Security, Federal Cloud re-promoted from former Tier 3)
- **Truly out-of-scope products:** 0 (Tier 3 currently empty; reserved for deprecated / internal / unshipped)
- **Architectural pillars named:** 4 (ZTE, Data Fabric, Agentic SecOps, plus the customer-segment "Zero Trust for X" framing)

Total Zscaler portfolio: roughly 25 distinct products + 4 architectural pillars at this date. We deep-dive 11 (half), are at-minimum aware of all the rest, deliberately ignore none.

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
