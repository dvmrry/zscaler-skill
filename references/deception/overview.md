---
product: deception
topic: "deception-overview"
title: "Zscaler Deception — architecture, decoys, ZPA integration"
content-type: reasoning
last-verified: "2026-04-24"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/what-is-zscaler-deception.md"
  - "vendor/zscaler-help/about-deception-strategy.md"
  - "vendor/zscaler-help/about-zpa-app-connectors-deception.md"
author-status: draft
---

# Zscaler Deception — architecture, decoys, ZPA integration

Zscaler Deception is a **separate Zscaler product** for active-defense threat detection. It deploys realistic decoys (fake IT assets — servers, applications, AD objects, endpoints, cloud resources) across an environment. Because no legitimate business traffic should ever touch a decoy, **any interaction is a high-confidence signal of an ongoing breach**. Designed to catch threats that bypass perimeter defenses — APTs, ransomware, lateral movement, reconnaissance, supply-chain attacks, SCADA / ICS attacks.

This doc is the operational summary. It's the answer to "what is Deception, how does it work, and where does it fit?"

## What problem it solves

Per the Zscaler positioning:

> Advanced attacks bypass existing defenses. Detecting and containing them is challenging because:
> - Advanced attacks are stealthy and **91% of attacks do not generate a security alert**.
> - Advanced attacks are human-operated and **68% of attacks do not use malware**.
> - Security teams have too many events to investigate because **45% of alerts are false positives**.

Decoys flip the false-positive economy. There is **no reason a human or process should touch a decoy** — so any interaction is a true positive by construction. This eliminates the alert-triage problem for the post-perimeter-breach phase.

## Decoy types — the catalog

Five categories of decoy, each addressing a different stage of the kill chain:

| Decoy type | What it impersonates | Detects |
|---|---|---|
| **Network decoys** | Fake servers / services on internal VLANs | Lateral movement, network reconnaissance |
| **Threat Intelligence (TI) decoys** | Fake credentials / data injected to lure attackers | Credential theft, attacker tooling |
| **Active Directory (AD) decoys** | Fake AD objects (users, groups, computers) | AD enumeration, Kerberoasting, DCSync |
| **Endpoint decoys** | Files / processes / artifacts on real endpoints (Landmine policies) | Endpoint-resident malware, ransomware staging |
| **Cloud decoys** | Fake cloud resources (S3 buckets, IAM users, etc.) | Cloud-tenant compromise, IAM-token theft |

The **Miragemaker** module is Zscaler's dataset library used to make decoys realistic — populating fake servers with believable hostnames / FQDNs / services, fake AD users with believable names + group memberships, etc.

## Architecture

```
                   ┌─────────────────────────────────┐
                   │ Deception Admin Portal          │
                   │ (Strategy Builder, Analytics,   │
                   │  ThreatParse, Orchestration)    │
                   └────────────────┬────────────────┘
                                    │
                  ┌─────────────────┼──────────────────┐
                  │                 │                  │
                  ▼                 ▼                  ▼
          ┌──────────────┐  ┌──────────────┐   ┌──────────────┐
          │ Decoy        │  │ ZPA App      │   │ Endpoint     │
          │ Connector    │  │ Connector    │   │ Agent        │
          │ (VM in your  │  │ (for ZTN     │   │ (Landmine    │
          │  network)    │  │  decoys)     │   │  policies)   │
          └──────────────┘  └──────────────┘   └──────────────┘
                  │                 │                  │
                  ▼                 ▼                  ▼
            VLANs / network    ZPA-protected      Real endpoints
            decoys             decoys             (decoy artifacts)
```

### Components

- **Decoy Connector** — VM deployed in the customer's network. Hosts network decoys + connects to the Deception Admin Portal. Required for traditional network-segment decoy deployment.
- **ZPA App Connector (Deception-integrated)** — Special ZPA App Connector configured to route attacker traffic to **Zero Trust Network (ZTN) decoys** without requiring additional network components or topology changes. See [`./index.md § Why this product matters`](./index.md).
- **Deception Admin Portal** — Separate from the ZIA / ZPA / ZIdentity admin portals. Where decoy strategies are configured, alerts are reviewed, ThreatParse renders attack narratives.
- **ThreatParse** — Natural-language attack reconstruction. Captures threat-intel + reconnaissance activity in real time, summarizes log information into plain English so SOC analysts understand what an attacker is trying to accomplish without parsing raw logs.

## ZPA integration — Zero Trust Network decoys

The most cleanly-integrated deployment path. Instead of deploying VMs into customer VLANs (which requires network changes), Deception uses ZPA App Connectors to expose decoys.

How it works:
1. Customer enables Deception integration with ZPA.
2. Deception Admin Portal creates ZPA Application Segments + Access Policy rules that route specific decoy FQDNs / IPs to a Deception-managed App Connector.
3. Attacker traffic destined for the decoy hits the App Connector, which routes to the Deception cloud infrastructure.
4. Deception captures the interaction, generates a high-fidelity alert.

**Key access-policy property:** Deception-configured access rules must have **lower rule order numbers than regular ZPA access rules** (i.e., evaluate first). This is because ZPA is first-match-wins — if a regular rule matched attacker traffic first, the decoy would never get the connection. See [`../zpa/policy-precedence.md § Order and editing constraints`](../zpa/policy-precedence.md) and [`zpa-07`](../_clarifications.md#zpa-07-deception-policy-order-interaction).

These rules are also **read-only from the ZPA console** (cannot be copied, edited, or deleted via ZPA UI / API). They're managed by the Deception Admin Portal as a separate product surface; editing them out-of-band would desynchronize Deception's view of decoys and let attacker activity show up as a normal admin audit event instead of triggering a Deception alert.

## Strategy and personalities

Decoy deployment is parameterized via **Strategies** — bundles of pre-configured decoys for specific business / threat scenarios. Built-in strategies cover common use cases (databases, AD, web apps, etc.); custom strategies can be created.

Within a strategy, **Personalities** are the decoy templates — sets of configurations that represent specific service / app / user types. Personalities can be tagged (e.g., "OS Linux", "Engineering", "Databases") so a strategy can pull "any Database personality" rather than picking one specific.

Configuration locations: **Miragemaker > Strategy Builder > Deception Strategy** in the admin portal.

Strategies are deployable via either:
- **Internal decoys** — via Decoy Connector on customer VLANs
- **Zero Trust Network (ZTN) decoys** — via ZPA App Connectors (no network changes required)

## Roles and RBAC

Per-tenant license-level + account-level roles:

| Role | Permissions |
|---|---|
| **Administrator** | Configure Decoy Connectors, deploy decoys, view + analyze events, orchestrate actions |
| **Analyst** | Investigate events, block attackers, export logs |
| **Responder** | Analyze events, orchestrate response actions |
| **Super Admin** | All features + configurations including user roles, APIs, decoys, audit logs |

Custom roles supported with specific read/write permissions per requirement. Distinct from ZIA / ZPA / ZIdentity admin RBAC; Deception has its own admin surface.

## Workflow — five phases

1. **Administration** — Licenses, user roles, API access.
2. **Configure Network Components** — Decoy Connectors, VLANs, ZPA App Connectors for ZTN decoys.
3. **Configure and Deploy Decoys** — Strategy + Personality selection, deployment to internal or ZTN paths.
4. **Detect Threats** — When attackers interact with decoys, real-time alerts fire.
5. **Investigate** — ThreatParse renders attack reconstruction; SOC + analysts correlate threat intel.
6. **Orchestrate** — Automated response rules trigger on high-fidelity events.
7. **Remediate** — Additional decoys deploy to validate remediation.

## Key features and benefits

From the captured help docs:

- **Ease of deployment.** Cloud-delivered, scalable, minimal on-premises computing. No additional hardware upgrades.
- **Comprehensive coverage.** Perimeter, applications, endpoints, AD, cloud, OT/IoT environments.
- **Extensive built-in decoys.** Easy to customize and manage decoys that engage savvy adversaries.
- **Disrupt advanced threats.** Detects + stops attackers across security infrastructure including low-visibility paths (DC-to-DC, internal-to-DC).
- **Low false positives.** No legitimate business traffic to decoys → any interaction is high-confidence signal.
- **Business risk awareness.** Aligns security controls tightly to areas with current business risks.
- **Orchestrated response.** High-fidelity alerts trigger precise action to shut down active attacks.
- **MITRE ATT&CK / MITRE Engage.** Per Zscaler claim, delivers 99% of capabilities covered in MITRE Engage.

## Threat model — what Deception is FOR vs what it's NOT for

**FOR**: detecting threats that have **already bypassed** perimeter defenses. The attacker is inside the environment; the question is "how do we know?"

- Lateral movement (post-foothold)
- Privilege escalation (post-credential-theft)
- Reconnaissance (mapping the network or AD)
- Data staging (pre-exfil)
- Ransomware (pre-encrypt)

**NOT FOR**: perimeter detection. Deception doesn't help catch attackers at the edge — that's URL Filtering, Sandbox, ATP, IPS. Deception is the **inside-the-network detection layer**, complementary to the perimeter stack.

## Operational implications for ZPA admins

If your tenant has Deception licensed and integrated with ZPA:

1. **Don't manage Deception-configured ZPA access rules via the ZPA console / API / Terraform.** They're managed by the Deception Admin Portal. Editing them out-of-band breaks the integration.
2. **Expect access rules at the top of the ZPA policy order that you didn't create.** These are Deception's. They look like regular access rules but with `copy / edit / delete` disabled.
3. **Treat them as read-only markers** showing "Deception is running in front of my policy chain."
4. **If Deception isn't licensed**, these rules don't exist — no operational change required.

## Surprises worth flagging

1. **Deception ≠ Honeypots-the-vague-concept.** Honeypots have existed in security for decades; Deception is the productized, integrated, low-overhead version with cloud-managed decoy lifecycles + threat intelligence + ZTN integration.

2. **No legitimate traffic to decoys means low false positives.** Counterintuitive vs traditional security tooling where false positives are the norm. The flip side: any false-positive interaction (e.g., a vulnerability scanner that touches a decoy) generates a high-confidence-but-actually-false alert. Tenants must whitelist legitimate scanning tools.

3. **ZTN decoys require ZPA — Network/AD/Endpoint decoys don't.** Deception can deploy without ZPA via Decoy Connectors. ZTN decoys are an integration option, not a requirement. Tenants without ZPA can still use Deception meaningfully.

4. **ThreatParse is NLP-derived.** The attack reconstruction quality depends on Zscaler's NLP layer. As of capture, this is a marketed differentiator but not directly evaluable from public docs — operator experience would tell.

5. **Roles are separate from ZIdentity.** Deception's RBAC (Administrator / Analyst / Responder / Super Admin) is its own surface. Doesn't federate via ZIdentity Administrative Entitlements (or hadn't at capture time). Adds operational overhead for centralized RBAC.

6. **Endpoint decoys (Landmines) put artifacts on real endpoints.** Operationally meaningful — endpoint security tools (EDR / antivirus) may flag them as suspicious. Deployment requires coordination with endpoint security stack.

7. **The "low false positives" claim assumes correctly-deployed decoys.** A decoy whose hostname matches a real production server, or whose IP is in active use, will generate false positives. Strategy + Personality configuration matters more than the marketing suggests.

## Common questions this unlocks

- **"What is Zscaler Deception?"** → active defense via decoys; lateral-movement detection; low FP rate.
- **"Is Deception part of ZPA?"** → No, it's a separate product. It integrates with ZPA via ZTN decoys but is standalone.
- **"Why are there ZPA access rules I can't edit?"** → Deception is licensed and integrated; those rules are managed by the Deception Admin Portal. See [`zpa-07`](../_clarifications.md#zpa-07-deception-policy-order-interaction).
- **"Does Deception work without ZPA?"** → Yes. Network / AD / Endpoint / Cloud decoys deploy via Decoy Connector or endpoint agents. ZTN decoys specifically require ZPA.
- **"What's the difference between Deception and Sandbox?"** → Sandbox detonates suspicious files at the perimeter. Deception detects post-breach activity inside the network. Complementary, not overlapping.
- **"How does Deception integrate with our SIEM?"** → Via the Deception Admin Portal's log export. Specifics not in current captures; refer to TAM.

## Cross-links

- ZPA policy-precedence interaction (Deception rules ordered first): [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- Clarification on Deception access-rule constraints: [`zpa-07`](../_clarifications.md#zpa-07-deception-policy-order-interaction)
- Cross-product integration catalog: [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
- Portfolio map (where Deception sits in the product family): [`../_portfolio-map.md`](../_portfolio-map.md)
- Source captures: [`../../vendor/zscaler-help/what-is-zscaler-deception.md`](../../vendor/zscaler-help/what-is-zscaler-deception.md), [`../../vendor/zscaler-help/about-deception-strategy.md`](../../vendor/zscaler-help/about-deception-strategy.md), [`../../vendor/zscaler-help/about-zpa-app-connectors-deception.md`](../../vendor/zscaler-help/about-zpa-app-connectors-deception.md)
