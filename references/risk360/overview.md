---
product: risk360
topic: "risk360-overview"
title: "Risk360 — cyber risk quantification framework"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/what-risk360.md"
  - "vendor/zscaler-help/risk360-about-dashboard.md"
  - "vendor/zscaler-help/risk360-about-factors.md"
  - "vendor/zscaler-help/risk360-about-asset-level-risk.md"
  - "vendor/zscaler-help/risk360-monte-carlo.md"
  - "vendor/zscaler-help/risk360-logs-retention.md"
  - "vendor/zscaler-help/risk360-product-marketing.md"
author-status: draft
---

# Risk360 — cyber risk quantification framework

Risk360 is a separate Zscaler SKU (paid add-on) that **quantifies organizational cyber risk in financial terms** — dollar-denominated expected loss — by analyzing Zscaler telemetry plus external sources against 115-140 predefined risk factors and running 1000 daily Monte Carlo simulations to produce loss-exceedance curves and yearly average loss figures.

Distinct from every other Zscaler product in **mode**: operational products (ZIA / ZPA / ZDX / etc.) tell you what's happening with your traffic; Risk360 tells you what your *cyber risk exposure is worth in dollars* and whether your security investments are actually reducing it. Audience is CISO / board / audit-committee first; operator-level drill-down available but secondary.

## Architecture

```
                    ┌─────────────────────────────┐
                    │ Risk360 Service             │
                    │ (Experience Center portal)  │
                    │                             │
                    │ - Risk score computation    │
                    │ - Monte Carlo simulation    │
                    │ - Factor weighting          │
                    │ - Dashboard rendering       │
                    │ - PowerPoint export         │
                    └──────────────┬──────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
        Zscaler                External           Third-party
        Telemetry            Attack Surface       Integrations
        (duplicate logs)        (Zscaler-          (CrowdStrike,
                                managed)            others)
        ZIA + ZPA + DLP
        + ThreatLabz
```

- **No additional hardware / agents** — Risk360 ingests data already flowing through your existing Zscaler deployment.
- **Logs are duplicates of ZIA / ZPA / DLP configuration + transaction logs.** Retained up to 1 year, stored in US or EU.
- **Real-time** — risk score and insights update continuously as new telemetry arrives.
- **Lives in the "Experience Center" portal** — Zscaler's modern unified admin surface, not the legacy ZIA / ZPA admin consoles.

## The four-stages-of-attack model

Risk360 organizes everything around the **four stages of a cyberattack**:

| Stage | What Risk360 measures |
|---|---|
| **External Attack Surface** | Publicly discoverable variables — exposed servers, ASNs, unmonitored domains. "What can attackers see?" |
| **Compromise** | Indicators of compromise — malicious behavior, pre-infection activities, suspicious traffic patterns. "How likely is initial breach?" |
| **Lateral Propagation** | Private access settings + segmentation posture. "If breached, how far can the attacker move?" |
| **Data Loss** | Sensitive data attributes + DLP-relevant signals. "What's at risk of exfiltration?" |

The org-level risk score is an **average across these four categories**, with the Dashboard exposing per-category scores so you can see where your weakness lies.

## The risk score (0-100)

| Range | Severity |
|---|---|
| 0–25 | Low |
| 26–50 | Medium |
| 51–75 | High |
| 76–100 | Critical |

Score weighting: factors carry different weights based on severity + frequency. Per the Dashboard doc: "an active infection is more severe than a blocked access attempt to a blocked destination" — so Risk360 weights actual breaches higher than hypothetical risks.

## Predefined risk factors (115-140+)

The factor count is **a moving target**:

- 110+ at June 2023 launch
- 115 in current FAQ
- 140+ in current marketing

Treat as "growing over time as Zscaler adds factors." Don't quote a specific number with high confidence.

Factors are organized in **two views**:

- **Attack-Based** — grouped by which of the 4 attack stages they contribute to
- **Entity-Based** — grouped by which of the 4 entity types they apply to

### The four entities

Risk360 visualizes risk across:

- **Workforce** (your users)
- **3rd Parties** (contractors, partners, vendors)
- **Applications** (the apps you operate / consume)
- **Assets** (devices, servers, infrastructure)

### Factor framework mapping

Factors map to:

- **MITRE ATT&CK** — adversary tactic / technique alignment
- **NIST CSF** — Cybersecurity Framework function alignment
- **SEC S-K 106(b)** — public-company cybersecurity disclosure compliance

This is critical for compliance reporting — Risk360's outputs are designed to feed into existing risk-reporting frameworks rather than create a new one.

## Asset-level risk (sub-org drill-down)

Beyond org-level scoring, Risk360 provides **per-asset risk** scoring using **65+ indicators** in three categories:

- **Pre-infection Behavior**
- **Post-infection Behavior**
- **Suspicious Behavior**

Asset-level scoring lets operators drill from "the org has a Critical risk score" → "this is driven by 5 risky assets" → "here's what's wrong with each one."

## Monte Carlo simulation — the financial-loss math

Risk360's defining feature. The mechanics:

- **1000 simulations per organization per day**
- Each simulation iteration: randomize a breach event + randomize financial loss within a confidence interval (lower bound + upper bound of typical breach loss)
- **Output 1**: yearly average loss (a dollar figure)
- **Output 2**: loss exceedance curve (probability that loss exceeds X)

### Four scenarios per simulation cycle

Each iteration runs four times under different premises:

| Scenario | Risk score input |
|---|---|
| **Inherent risk** | Current org risk score (status quo) |
| **Residual risk** | Score after mitigating top 10 factors (the "if you remediated" projection) |
| **Last 30-day average** | Rolling 30-day average score (historical baseline) |
| **Industry peer** | Peer-organization average score (benchmark) |

The Residual Risk scenario is the operationally important one — it shows the financial value of remediation work.

## Data sources

| Source | Type | Coverage |
|---|---|---|
| **ZIA** (Internet & SaaS) | Zscaler-native | Web traffic, URL filtering, DLP, sandbox, ATP, IPS events |
| **ZPA** (Private Access) | Zscaler-native | App-segment access, lateral movement signals |
| **DLP policies** | Zscaler-native | Data-loss exposure |
| **ThreatLabz** | Zscaler-native research | Known-bad indicators, threat intelligence |
| **External attack surface** | Zscaler-managed scan | Internet-facing asset discovery |
| **CrowdStrike** | Third-party integration | EDR / threat-intel signals; UEBA risk factors |
| **Other vendors** | Third-party | Configurable per-tenant; Risk360 supports multiple integrations |

The single Zscaler vantage point is the differentiator — Zscaler's inline position across user / network / cloud / app layers means it sees real traffic, not just configurations.

## Outputs / surfaces

### Dashboard page

- Single org-level risk score + industry-peer benchmark
- 90-day score trend graph
- Risk Event by Location (geolocation map)
- Contributing Factors by Entity (Workforce / 3rd Parties / Applications / Assets)
- **Top 10 Factors** with `Licensed?` column showing whether you're entitled to the recommended remediation
- Hover-for-financial-impact on the score

### Insights page

- Real-time problems detected in your Zscaler environment
- Per-problem: title, category, date generated, problem statement, recommendation, trend, drill-down link
- Action-oriented — designed for direct workflow

### Financial Risk page

- Monte Carlo output detail
- Yearly average loss + loss exceedance curves under 4 scenarios

### Factors page

- All 115-140 contributing factors
- Per-factor: weight, framework mapping, current value, drill-down

### Asset-Level Risk page

- Per-asset risk scores with 65-indicator drill-down
- Filter / sort / drill into individual assets

### CISO Board Slides

PowerPoint export of risk findings in board-ready format. Includes financial figures, top risks, remediation priorities, peer comparisons. Designed for direct presentation to Board / Audit / IT Risk committees without further authoring.

## RBAC

Risk360 has **its own admin role surface** — separate from ZIA / ZPA / ZIdentity admin RBAC. Path: **Administration > Admin Management > Role Based Access Control > Risk360**.

Per-role configurable:

- Full Access vs View-Only Access per feature area
- **User Device Name Access** — visible vs obfuscated (PII hiding for read-only roles)
- **Device Information visibility** — granular toggle
- Functional Scope (which feature areas the role applies to)
- Type (system role vs custom)

The PII-obfuscation toggle is unusual — most Zscaler RBAC surfaces don't have this. Reflects Risk360's executive audience who often need risk numbers without seeing identified individual users.

## Licensing

Listed on Zscaler's pricing-and-plans page under **Security Operations** with a `$` marker (paid add-on). Two tiers visible:

- **Security Operations Standard** — base Risk360 with Zscaler data
- **Security Operations Advanced** — possibly extended capabilities (not detailed in captures)

Not bundled with ZIA / ZPA platform tiers (Essentials Platform / Zscaler Platform). Requires separate purchase.

Logs retained for **up to 1 year** during subscription term.

## What Risk360 is NOT

Useful negative space:

- **Not a SIEM.** It quantifies risk; it doesn't capture / store / search raw security events. Use NSS / LSS / your SIEM for those.
- **Not a vulnerability scanner.** It receives signals from existing vuln-management products; Zscaler's separate **Unified Vulnerability Management (UVM)** is the scanner-style product.
- **Not a real-time IR tool.** Insights are real-time; remediation recommendations are not auto-applied. Operators read recommendations and act through other Zscaler / third-party admin surfaces.
- **Not free.** Despite ingesting from existing Zscaler deployments, Risk360 is paid separately.
- **Not a replacement for compliance documentation.** It provides framework-mapped data + SEC disclosure samples, but doesn't generate full compliance documentation autonomously.

## Surprises worth flagging

1. **Factor count is officially uncertain.** Different Zscaler sources cite 110+, 115, and 140+ in the same product. Treat as growing-over-time. Don't anchor a specific number.

2. **Logs are explicit duplicates of ZIA / ZPA logs.** This means Risk360 doesn't introduce new telemetry — it's a *reinterpretation layer* on existing data. Tenants worried about "what data does Risk360 have?" should know it's the same data ZIA / ZPA already capture.

3. **Monte Carlo runs 1000 times daily.** Counterintuitive — most people imagine simulations as one-off computations. Risk360 runs the financial model continuously to track day-over-day risk movement.

4. **Residual Risk is the operationally valuable scenario.** "After mitigating top 10 factors" is the actionable projection — it tells operators "if we did the work, here's what we'd save in expected annual loss." Use this for remediation prioritization, not the bare Inherent Risk score.

5. **Industry peer benchmark is real, not hypothetical.** Zscaler computes actual peer-org averages for comparison. Specific comparison group / methodology not publicly detailed; ask TAM if needed.

6. **CISO Board Slides export is a real feature.** Most security tools require analyst hand-authoring of executive presentations. Risk360 produces the deck directly. Operationally meaningful for under-resourced security teams.

7. **PII obfuscation in RBAC.** Risk360's role config can hide user device names + device info from view-only admins. Reflects the audience — board members see risk levels and dollar figures, not identified individual users.

8. **Risk360 logs are stored in US OR EU only.** No third option. Tenants in other regions still get Risk360 service but log data is in one of these two locations.

9. **CrowdStrike integration is built-in.** Risk360 is one of the few Zscaler products with first-class third-party EDR integration. Tenants on CrowdStrike automatically get UEBA factors flowing into the score.

10. **The "Legacy UI: Risk360 Advanced" entry exists in the help nav.** Suggests there was an earlier Risk360 generation, now superseded. Tenants on long-term contracts may still see legacy UI; current docs target the new portal. Confirm version with TAM if questions arise.

## Common questions this unlocks

- **"What is Risk360?"** → Cyber risk quantification framework. Financial-loss estimation via Monte Carlo on top of Zscaler telemetry. Audience: CISO / board.
- **"How much does Risk360 cost?"** → Paid add-on under Security Operations tier. Specific pricing requires sales conversation; not publicly disclosed.
- **"Does Risk360 require new agents?"** → No — ingests from existing ZIA / ZPA deployment.
- **"Where do the financial-loss estimates come from?"** → Monte Carlo simulation, 1000x/day, randomizing breach events + loss within confidence intervals.
- **"How does Risk360 help with SEC compliance?"** → SEC S-K 106(b) disclosure samples are built in; framework-mapped factors generate reportable cybersecurity-process descriptions.
- **"Can Risk360 produce a board-ready deck?"** → Yes — CISO Board Slides PowerPoint export.
- **"How does Risk360 compare us to peers?"** → Industry peer benchmarks computed by Zscaler. Methodology not publicly detailed.
- **"How long does Risk360 keep our data?"** → Up to 1 year, US or EU storage.

## Cross-links

- Underlying data sources: [`../zia/index.md`](../zia/index.md), [`../zpa/index.md`](../zpa/index.md), [`../zia/dlp.md`](../zia/dlp.md)
- Risk360 admin RBAC vs other Zscaler admin systems: [`../shared/admin-rbac.md`](../shared/admin-rbac.md)
- Portfolio positioning: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
- Cross-product integrations (where Risk360 sits): [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
