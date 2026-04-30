---
product: breach-predictor
topic: overview
title: "Breach Predictor — predictive threat intelligence and breach risk scoring"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/bp-what-zscaler-breach-predictor.md"
author-status: draft
---

# Breach Predictor — predictive threat intelligence and breach risk scoring

## What it is

Breach Predictor is a Zscaler Security Operations (SecOps) product that shifts security posture from reactive to predictive. Rather than responding to alerts after an event has occurred, Breach Predictor consumes and analyzes data from multiple sources using generative AI to surface how threats are likely to propagate, enabling SOC teams to close policy gaps before attackers move to the next stage (Tier A — vendor/zscaler-help/bp-what-zscaler-breach-predictor.md).

It is distinct from Risk360 (which quantifies risk in financial terms) and from SOC Workbench (which unifies and triages alerts). Breach Predictor's specific value is **predicting where threats will move** and telling analysts which policies enabled the observed activity.

## Platform placement

Breach Predictor is listed under "Security Operations Platform" in the Zscaler help portal nav, alongside UVM, AEM, EASM, SOC Workbench, Deception, and Identity Protection. It is a paid add-on; specific licensing SKU details are not publicly documented on the help portal.

## Key concepts

### Overall Breach Probability score

A single score representing the immediate assessment of your organization's threat landscape. Displayed prominently on the Dashboard (Tier A — vendor/zscaler-help/bp-what-zscaler-breach-predictor.md).

### Findings

Specific security issues surfaced by Breach Predictor's analysis. Each finding is mapped to MITRE ATT&CK and tied to specific policies. The Findings page shows the active issues in your environment.

### MITRE ATT&CK integration

Findings tables display MITRE ATT&CK tactics and techniques. This allows analysts to understand which adversary behaviors are represented by the current threat landscape.

### Sankey charts

Visual representation of threat propagation paths. Sankey diagrams show how threats flow from initial compromise through lateral movement toward data exfiltration, letting analysts see which user populations are most vulnerable and which malware families are present.

### AI Assist Dashboard

A generative AI surface within Breach Predictor. Uses AI to analyze the data and draw conclusions that support visibility and guidance. This is the primary differentiator from rule-based SIEM approaches (Tier A — vendor/zscaler-help/bp-what-zscaler-breach-predictor.md).

### Threat Landscape

A dedicated page/view within Breach Predictor showing the malware families and threat actor behaviors currently present in the organization's traffic.

### Events, Tickets, Profiles, Users

Additional data views within the product. Events provides the underlying signal feed. Tickets tracks remediation work. Profiles applies to asset or user risk profiles. Users enables drill-down into individual user risk.

## How it works

1. Tracks substantial amounts of data from multiple sources (Zscaler telemetry plus external threat data).
2. Uses generative AI to analyze data.
3. Draws conclusions to provide visibility and guidance.

Breach Predictor is designed to **supplement, not replace**, reactive security tools. Reactive tools (SIEM, EDR, etc.) provide urgency for imminent threats; Breach Predictor provides context to make proactive decisions before the next attack stage materializes (Tier A — vendor/zscaler-help/bp-what-zscaler-breach-predictor.md).

## Data inputs

The vendor source describes consumption of "vast amounts of data from multiple sources" without enumerating them precisely. Given Breach Predictor's placement in the Zscaler SecOps platform, likely inputs include ZIA and ZPA telemetry, ThreatLabz threat intelligence, and third-party integrations (consistent with other SecOps products). Specific source list not confirmed.

## UI surfaces

| Page | Purpose |
|---|---|
| Dashboard | Breach probability score, overall risk picture |
| Findings | Security issues with MITRE ATT&CK mapping and policy context |
| Users | Per-user risk drill-down |
| Events | Underlying signal/event feed |
| Threat Landscape | Malware families and adversary behaviors present |
| Tickets | Remediation tracking |
| Profiles | Risk profiles for assets or users |
| AI Assist Dashboard | Generative AI analysis surface |

## Relationship to other Zscaler products

- **vs. SOC Workbench**: SOC Workbench unifies alerts and incidents from many sources, focuses on triage and response workflow. Breach Predictor focuses on predictive intelligence — where will the threat go next?
- **vs. Risk360**: Risk360 quantifies risk in dollar-denominated financial loss via Monte Carlo simulation, audience is CISO/board. Breach Predictor is SOC-team-focused with operational remediation guidance.
- **vs. AEM/UVM**: AEM tracks asset inventory and posture; UVM manages vulnerabilities. Breach Predictor uses threat signals to predict breach progression.

## API surface

The help portal lists an "Integrating Applications with Zscaler Breach Predictor" page and a "Requesting Updates in Zscaler Breach Predictor" page, suggesting some integration/API capability exists. However, no public API reference or SDK documentation was found for Breach Predictor specifically. Treat as primarily portal-managed with integration surface not yet confirmed. See open question below.

## Key limits and constraints

- The product is primarily designed for SOC teams, not self-serve end users.
- The "supplement, not replace" framing is explicit in vendor docs — Breach Predictor is not positioned as a SIEM replacement.
- Generative AI-based analysis means outputs are probabilistic; the overall breach probability score is an assessment, not a deterministic calculation.

## Open questions

- What specific data sources does Breach Predictor ingest? (not enumerated in vendor docs)
- What is the API surface? (referenced but not detailed in available sources)
- What SKU / pricing tier does Breach Predictor fall under?
- How does it relate to the "AI Assist" features appearing in other Zscaler products?

## Common questions

- **"What is Breach Predictor?"** → A Zscaler SecOps product that uses generative AI to predict how threats will propagate through your organization, and which policies need to be fixed now to prevent future breach.
- **"How is Breach Predictor different from a SIEM?"** → A SIEM collects and stores security events for retrospective investigation. Breach Predictor predicts future threat movement based on current signals, focusing on proactive policy remediation rather than retrospective event review.
- **"Does Breach Predictor replace my SIEM?"** → No — vendor docs explicitly position it as a supplement to reactive security tools, not a replacement.
- **"What does the Breach Probability score mean?"** → An AI-computed assessment of how likely your organization is to experience a data breach given current threat landscape and policy gaps. A higher score indicates more risk.
- **"What is MITRE ATT&CK used for in Breach Predictor?"** → Findings are mapped to MITRE ATT&CK tactics/techniques so analysts understand which adversary behaviors are currently represented in their environment.
- **"What is the AI Assist Dashboard?"** → A generative AI surface within Breach Predictor that analyzes threat data and produces natural-language guidance for analysts.

## Relationship to other SecOps platform products

The Zscaler SecOps platform is a collection of related but distinct products sharing the Data Fabric for Security infrastructure:

| Product | Primary focus |
|---|---|
| **Breach Predictor** | Predictive threat intelligence; breach probability; policy gap identification |
| **SOC Workbench** | Alert unification, correlation, and incident triage/response |
| **AEM** | Asset inventory, attack surface tracking, policy compliance |
| **UVM** | Vulnerability ingestion, prioritization, and remediation tracking |
| **Identity Protection** | Identity threat detection, posture scanning, credential exposure |
| **EASM** | Internet-facing asset discovery and risk |

These products are licensed separately and can be combined. Their shared data fabric means signals from one product can enrich another's views.

## Cross-links

- SecOps platform overview (AEM, UVM, Identity Protection, SOC Workbench share a platform): [`../aem/overview.md`](../aem/overview.md), [`../uvm/overview.md`](../uvm/overview.md)
- Identity Protection (related detection surface): [`../identity-protection/overview.md`](../identity-protection/overview.md)
- Risk360 (financial risk quantification; different audience): [`../risk360/overview.md`](../risk360/overview.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
