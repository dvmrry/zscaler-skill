---
product: zms
topic: "zms-overview"
title: "ZMS — Zscaler Microsegmentation (workload east-west)"
content-type: reasoning
last-verified: "2026-04-25"
confidence: medium
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/what-is-microsegmentation"
  - "vendor/zscaler-help/what-is-microsegmentation-zpa.md"
  - "https://www.zscaler.com/products-and-solutions/microsegmentation"
  - "vendor/zscaler-help/microsegmentation-marketing.md"
  - "https://www.zscaler.com/products/zero-trust-microsegmentation"
  - "vendor/zscaler-help/zero-trust-microsegmentation-marketing.md"
author-status: draft
---

# ZMS — Zscaler Microsegmentation

**East-west / workload-to-workload policy** for servers, containers, and cloud workloads inside a VPC or across multi-cloud. Mental model: **ZPA segments user→app traffic; ZMS segments app→app traffic.** Both products live under the help-portal `/zpa/` namespace because ZMS is positioned as a ZPA add-on, but the enforcement model is fundamentally different.

**Confidence is medium** — all coverage from marketing pages + one help-portal article. **No SDK module** (`zms` does not exist in Python or Go SDK as of the current pinned versions); configuration is portal-only. No Terraform provider resources for ZMS surfaced in the vendored providers.

## Why ZMS exists alongside ZPA

ZPA and ZMS solve different segmentation problems:

| Dimension | ZPA | ZMS |
|---|---|---|
| Traffic shape | North-south (user → private app) | East-west (workload → workload) |
| Where enforcement runs | App Connector + ZPA cloud | Local OS enforcement points (Windows Filtering Platform, Linux nftables) on each host |
| Who/what is the principal | Authenticated user | Workload identity (server / container) |
| Connectivity model | Inside-out tunnel (App Connector dials out) | Host-local agent translates cloud policy to OS rules |
| Inspection | Inline at App Connector | None — pure allow/deny enforcement |

The clean separation: ZPA controls who can reach your apps from outside; ZMS controls which of your servers can talk to which other servers. A single environment commonly uses both — ZPA for users hitting an internal wiki, ZMS to ensure the wiki app server can only talk to its own database, not arbitrary internal services.

## Architecture

From `what-is-microsegmentation-zpa.md`:

```
Zscaler cloud (control plane)              ┐
     ↓ policies + telemetry                │
agent on host (Win or Linux)               │ continuous mode
     ↓ translates policy to OS-local rules │
Windows Filtering Platform / Linux nftables┘
```

**Key components**:

- **Zscaler cloud control plane** — multi-tenant SaaS, hosted in the US region (US-region-only as of the captured doc).
- **Deployed agents** — Windows or Linux hosts; physical, virtual, on-prem, or cloud. Operate in **continuous mode** (always running, always evaluating).
- **Local OS enforcement points** — the agent translates cloud policy into native OS rules:
  - **Windows**: Windows Filtering Platform (WFP)
  - **Linux**: nftables
- **Agent groups + AppZones** — logical grouping of hosts and the applications they run, used to define which flows to monitor and which policies to apply.

The agent does **two jobs**:
1. **Policy enforcement** — pulls latest policies from cloud, configures local OS firewall, blocks/allows flows.
2. **Telemetry collection** — observes actual app activity, sends back to cloud for AI-powered policy recommendations.

## AI-powered policy recommendations

The selling point. From the marketing captures:

- **Real-time traffic + workload telemetry** feeds the recommendation engine.
- **Policy suggestions** are auto-generated based on observed flows — start in monitor-only, observe what real workloads actually communicate, and the cloud surfaces "this workload talks to these N services; here's a least-privilege policy that allows just those."
- **14-day rolling telemetry window** — observed flows older than 14 days drop out of the recommendation basis. Implications: a workload that talks to a service every 30 days won't be in the policy recommendations; the operator has to whitelist it manually or it'll get blocked when policy goes enforce-mode.

This last point is the **single biggest operational gotcha** with ZMS: low-frequency legitimate flows are invisible to the recommendation engine. Don't enforce a policy generated from 14 days of observation if your environment has known monthly / quarterly batch jobs.

## Provisioning + deployment

From the help-portal capture:

- **Contact your Zscaler Account team to provision** — ZMS is not self-serve. Like Auto-Scaling provisioning for Cloud Connector, this requires a Support / TAM ticket.
- **Available in US region** for the backend framework (the cloud control plane). Data collection can be localized to the customer's region of choice.
- **Data retention: 14-day rolling**. Telemetry older than 14 days is dropped.
- **Managed resources** can deploy to any region (the agents — they run in the customer's environment regardless of where the control plane is).
- **ZPA prerequisite** — the help-portal capture says "You can enable Microsegmentation for organizations that have Zscaler Private Access (ZPA)." ZMS is not sold standalone.

## Deployment flexibility (marketing claim)

The marketing page distinguishes between "full infrastructure control" and "consume capabilities as a gateway service" deployment options. The captured material doesn't expand on what these mean concretely. Likely interpretation:

- **Full infrastructure control** = customer deploys agents on their hosts, manages identity/grouping, owns enforcement.
- **Gateway service** = some aggregated / API-driven model where the customer doesn't deploy agents per-host but consumes east-west enforcement as a service.

The captured material does not confirm this interpretation. Treat the second mode as unclear until docs clarify.

## Edge cases / gotchas

1. **ZMS is not in the SDK.** Operators looking for `client.zms.*` won't find it; configuration is portal-only. This is the same pattern as AI Guard.
2. **The 14-day telemetry window silently drops infrequent flows.** Don't mass-enforce policies generated from observation alone if your environment has known long-period workflows. Spot-check the recommendation against documented expected traffic patterns.
3. **Agents enforce locally, not via tunnel.** A host that loses cloud connectivity continues to enforce its last-known policy via WFP / nftables — failure mode is fail-closed against unknown flows but allow-known. Different mental model from ZPA's App Connector dial-out (which fails closed entirely if Connectors lose cloud).
4. **WFP / nftables = native OS firewall.** Conflicts with other firewall management tools (Windows Defender Firewall policies via GPO, host-based firewalls like Carbon Black, custom nftables rules) are real concerns. Captured docs don't cover conflict resolution; treat as unanswered.
5. **US-region-only control plane** at the captured date. Customers with EU / APAC data residency requirements should validate this hasn't changed and whether it's a blocker.
6. **Agent updates are continuous-mode** — the agent runs always, presumably auto-updates. Update cadence and rollback options not in captures.
7. **Containers**: marketing claims container support, but the help-portal capture mentions only Windows and Linux *hosts*. Container coverage might be via host agent observing container traffic rather than per-container agent. Not confirmed.
8. **ZMS appears in help.zscaler.com/zpa/, not its own namespace.** Customers searching for "Zscaler microsegmentation" hit ZPA help docs. Skill should normalize this — recognize "Zscaler microsegmentation", "ZMS", "Zero Trust Microsegmentation" all as the same product.

## Where ZMS fits relative to existing skill content

| Existing reference | ZMS touchpoint |
|---|---|
| [`../zpa/app-segments.md`](../zpa/app-segments.md) | ZPA app-segments are the user→app primitive; ZMS AppZones are the workload→workload primitive. Different abstractions; both are policy targets. |
| [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md) | ZPA's policy precedence rules don't apply to ZMS — ZMS enforcement is local OS firewall, not ZPA cloud policy. |
| [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md) | ZMS as a ZPA add-on belongs here — should be added as a cross-product hook (currently absent). |
| [`../cloud-connector/forwarding.md`](../cloud-connector/forwarding.md) | Cloud Connector handles **north-south workload traffic** (workload → internet via Zscaler). ZMS handles **east-west workload traffic** (workload → workload). Operators conflating the two is a routing-question hazard. |

## Open questions

- **Container support** — agent-per-container vs host-agent-observing-containers?
- **Cloud-native workload integration** — does ZMS hook into AWS Security Groups / Azure NSGs / GCP firewall rules, or does it pure-OS-level the enforcement and ignore cloud-native firewalls?
- **Conflict resolution with other host firewalls** — what happens if Windows Defender Firewall via GPO and ZMS via WFP both have rules for the same flow?
- **API surface** — captured docs don't reveal an API beyond "configure in admin portal." If ZPA admin portal hosts ZMS UI, is there a `client.zpa.*` extension we missed? (Spot-check of the Python SDK didn't find one.)
- **Container orchestrator integration** — does ZMS integrate with Kubernetes admission control, service-mesh sidecars, or is it purely host-level?
- **Observation-mode → enforce-mode transition** — what's the recommended cutover process? Captures don't cover this.
- **Multi-cloud identity** — how does an AWS workload's identity (IAM role / instance profile) get represented in ZMS policy? Same for Azure / GCP.
- **Pricing / packaging** — bundled with ZPA tier? Separately priced add-on? Not captured.

## Cross-links

- Skill index: [`./index.md`](./index.md)
- Portfolio map (where ZMS sits): [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
- ZPA app-segments (the north-south analog): [`../zpa/app-segments.md`](../zpa/app-segments.md)
- Cloud Connector (workload north-south traffic — distinct from ZMS east-west): [`../cloud-connector/overview.md`](../cloud-connector/overview.md)
- Cross-product integrations (where ZMS↔ZPA hook should live): [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
