---
product: shared
topic: "portfolio-map"
title: "Zscaler product portfolio map"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
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

## Tier 2 — Awareness only (no deep-dive yet)

Products Zscaler actively markets that we recognize and can describe but haven't deep-dived. Customers asking about these get a one-paragraph answer; deep technical questions get redirected to Zscaler docs / TAM / Support.

### Inside the existing scope (high relevance — fill priority)

#### AppProtection
ZPA-bundled web application firewall + identity-based attack defense. Inspects traffic to ZPA-protected applications for OWASP Top 10 vulnerabilities, LDAP / Kerberos enumeration, Active Directory attack patterns, insider-threat behaviors. **Bundled into ZPA, not a separate license** — operators with ZPA Business or Transformation tiers may already have it. Not deep-dived; surprising omission given our ZPA depth. **Top fill priority.**

#### Risk360
Cyber risk quantification dashboard. Aggregates data from ZIA, ZPA, DLP, ThreatLabz, plus 115+ external risk factors. Uses Monte Carlo financial modeling to produce business-risk scores. Separate license. CISOs and risk executives ask about it directly. Not deep-dived; **high fill priority** for chatbot articulateness with executive audiences.

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

## Tier 3 — Explicitly out of scope (recognized, deliberately not covered)

Products in the Zscaler portfolio we deliberately don't cover. Skill should redirect to Zscaler docs / TAM if these come up.

| Product | What it is | Why out of scope |
|---|---|---|
| **ZMS — Workload Microsegmentation** | East-west (server-to-server) policy. Distinct mental model from ZPA's north-south access. | Vendored in SDKs; awaiting fork-team signal |
| **ZINS** | Shadow IT / IoT / SaaS security reporting. | Reporting-flavored, not policy-precedence-flavored. Lower skill ROI. |
| **EASM — External Attack Surface Management** | Discovery of internet-exposed assets. | Different audience (security researchers) than the operator-and-traffic-policy focus of this skill |
| **ZAI Guard / broader AI Security platform** | AI / LLM traffic policy (ZAI Guard), plus AI Asset Management, AI Access Security, AI Red Teaming, AI Guardrails as a cohesive platform. | Newer product family; partial awareness via GenAI flags in URL Filtering and DLP, but no synthesis. Awareness-fill candidate when fork-team signals AI traffic is material. |
| **Federal Cloud variants** (`zscalergov`, `zscalerten`, ZPA GOV / GOVUS) | Government-cloud editions. Most behavior inherits from commercial; auth paths and feature availability differ. | User-scoped out — fork team is not gov-cloud |

## How the skill should use this map

When a question lands:

1. **If the product has a Tier 1 entry**, route to its `references/<product>/` deep-dive.
2. **If Tier 2**, give the one-paragraph answer from this map, identify what specifically the user wants, and either (a) provide the conceptual framing without claiming deep authority, or (b) recommend the relevant Zscaler help-site path / TAM consultation.
3. **If Tier 3**, acknowledge it exists, briefly state what it does, and explicitly note it's out of scope of this skill — redirect to Zscaler resources.

Never pretend deep-dive coverage exists where it doesn't. Confidence drop is honest signal.

## Coverage statistics (as of 2026-04-24)

- **Deep-dive products:** 9 (after Deception promoted from awareness)
- **Awareness-only products:** 11 (Tier 2)
- **Out-of-scope products:** 5+ (Tier 3 — exact count drifts as Zscaler rebrands and acquires)
- **Architectural pillars named:** 4 (ZTE, Data Fabric, Agentic SecOps, plus the customer-segment "Zero Trust for X" framing)

Total Zscaler portfolio: roughly 25 distinct products + 4 architectural pillars at this date. We deep-dive about a third, are aware of half, deliberately ignore the remainder.

## Maintenance

Zscaler ships rapidly — products are added, renamed, deprecated, acquired. Re-validate this map quarterly:

1. Visit `https://www.zscaler.com/products-and-solutions`
2. Walk the product menus / categories
3. For each product Zscaler markets that's NOT on this map, add it (Tier 2 by default; promote to Tier 3 if explicitly out of scope).
4. For each product on this map that's NOT on Zscaler's site, mark deprecated (don't delete — institutional memory matters).
5. Bump `last-verified` to today's date.

Acquisitions typically take 6-12 months to fully integrate; track them as Tier 2 awareness even before integration completes.

## Cross-links

- Cross-product hooks between deep-dive products: [`./shared/cross-product-integrations.md`](./shared/cross-product-integrations.md)
- Cloud architecture (the platform layer underlying all products): [`./shared/cloud-architecture.md`](./shared/cloud-architecture.md)
- OneAPI gateway (the API entrypoint for the 7 products with REST APIs): [`./shared/oneapi.md`](./shared/oneapi.md)
- Terminology disambiguation across products and legacy names: [`./shared/terminology.md`](./shared/terminology.md)
