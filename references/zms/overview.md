---
product: zms
topic: "zms-overview"
title: "ZMS — Zscaler Microsegmentation (workload east-west)"
content-type: reasoning
last-verified: "2026-06-14"
confidence: medium
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/what-is-microsegmentation"
  - "vendor/zscaler-help/what-is-microsegmentation-zpa.md"
  - "https://www.zscaler.com/products-and-solutions/microsegmentation"
  - "vendor/zscaler-help/microsegmentation-marketing.md"
  - "https://www.zscaler.com/products/zero-trust-microsegmentation"
  - "vendor/zscaler-help/zero-trust-microsegmentation-marketing.md"
  - "vendor/zscaler-help/about-application-catalog-microsegmentation.md"
  - "vendor/zscaler-help/about-ml-tag-recommendations-page.md"
  - "vendor/zscaler-help/about-tags.md"
  - "vendor/zscaler-help/about-agent-provisioning-keys.md"
  - "vendor/zscaler-help/editing-agent-provisioning-keys.md"
  - "vendor/zscaler-sdk-python/zscaler/zms/zms_service.py"
  - "vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc"
author-status: draft
---

# ZMS — Zscaler Microsegmentation

**East-west / workload-to-workload policy** for servers, containers, and cloud workloads inside a VPC or across multi-cloud. Mental model: **ZPA segments user→app traffic; ZMS segments app→app traffic.** Both products live under the help-portal `/zpa/` namespace because ZMS is positioned as a ZPA add-on, but the enforcement model is fundamentally different.

**Confidence is medium.** Current Help documents several operational portal
surfaces, while the implemented Python SDK and MCP surfaces expose read-only ZMS
GraphQL queries (`vendor/zscaler-sdk-python/zscaler/zms/zms_service.py:36-105`;
`vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc:8`). Portal write
workflows are documented, but their GraphQL mutation names and payloads are not;
that implemented-client boundary is not proof that the service has no
server-side write API.

## Why ZMS exists alongside ZPA

Source: `vendor/zscaler-help/what-is-microsegmentation-zpa.md`; `vendor/zscaler-help/microsegmentation-marketing.md`; `vendor/zscaler-help/zero-trust-microsegmentation-marketing.md`.

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

Source: `vendor/zscaler-help/what-is-microsegmentation-zpa.md`.

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

Source: `vendor/zscaler-help/what-is-microsegmentation-zpa.md`; `vendor/zscaler-help/microsegmentation-marketing.md`; `vendor/zscaler-help/zero-trust-microsegmentation-marketing.md`.

The selling point. From the marketing captures:

- **Real-time traffic + workload telemetry** feeds the recommendation engine.
- **Policy suggestions** are auto-generated based on observed flows — start in monitor-only, observe what real workloads actually communicate, and the cloud surfaces "this workload talks to these N services; here's a least-privilege policy that allows just those."
- **14-day rolling data-retention period** — Help states that collected data is
  retained on a 14-day rolling cycle, but it does not state that the
  recommendation engine uses exactly that lookback or define how low-frequency
  flows affect a generated policy
  (`vendor/zscaler-help/what-is-microsegmentation-zpa.md:12`).

Whether monthly or quarterly flows fall outside recommendation inputs is an
open operational question, not a documented consequence of the retention
period. Validate the recommendation basis before enforcing generated policy in
an environment with long-period workflows.

## Current Segmentation portal surfaces

Source: `vendor/zscaler-help/about-application-catalog-microsegmentation.md`; `vendor/zscaler-help/about-ml-tag-recommendations-page.md`; `vendor/zscaler-help/about-tags.md`; `vendor/zscaler-help/about-agent-provisioning-keys.md`; `vendor/zscaler-help/editing-agent-provisioning-keys.md`.

### Application Catalog and ML tag recommendations

The Application Catalog is under **Policies > Access Control > Segmentation**.
It exposes applications and categories used for ML resource-tag recommendations,
with portal filters for application name, category, process, protocol, and port;
the result shape includes process name, protocol, and port start/end
(`vendor/zscaler-help/about-application-catalog-microsegmentation.md:12-38`).
Those portal filters do not establish equivalent GraphQL or SDK filter fields
(`vendor/zscaler-help/about-application-catalog-microsegmentation.md:40-46`).

The ML Tag Recommendations page shows Application Catalog detections on managed
resources. Administrators can accept, edit, ignore, or delete a recommendation,
revisit ignored recommendations, and see the previous and next recommendation
runs. Zscaler Support is the documented path for enabling or disabling the
feature for an organization
(`vendor/zscaler-help/about-ml-tag-recommendations-page.md:10-37`). When a
recommendation is accepted, resources left unselected are treated as ignored
(`vendor/zscaler-help/about-ml-tag-recommendations-page.md:35-37`). The article
does not publish the operations, enums, or payloads behind those actions
(`vendor/zscaler-help/about-ml-tag-recommendations-page.md:39-43`).

### Tags

The portal's tag model is namespace → key → value, and a complete tag can be
assigned to resource groups. The current page exposes namespace creation, tag
search, add, detail, edit, and delete actions
(`vendor/zscaler-help/about-tags.md:10-27`). Help does not define the GraphQL
types or enforcement semantics behind those actions
(`vendor/zscaler-help/about-tags.md:29-33`).

## Provisioning + deployment

Source: `vendor/zscaler-help/what-is-microsegmentation-zpa.md`.

From the help-portal capture:

- **Contact your Zscaler Account team to provision** — ZMS is not self-serve. Like Auto-Scaling provisioning for Cloud Connector, this requires a Support / TAM ticket.
- **Available in US region** for the backend framework (the cloud control plane). Data collection can be localized to the customer's region of choice.
- **Data retention: 14-day rolling**. The source does not enumerate the retained
  data classes or equate this period with the recommendation-engine lookback
  (`vendor/zscaler-help/what-is-microsegmentation-zpa.md:12`).
- **Managed resources** can deploy to any region (the agents — they run in the customer's environment regardless of where the control plane is).
- **ZPA prerequisite** — the help-portal capture says "You can enable Microsegmentation for organizations that have Zscaler Private Access (ZPA)." ZMS is not sold standalone.

### Agent provisioning keys

Provisioning keys are managed from the selected agent group's **Provisioning
Keys** tab. The portal can list and filter keys, show the associated signing
certificate, copy/edit/delete a key, and route operators to Agent Manager
installation for VM groups or a Helm chart for Kubernetes Cluster groups
(`vendor/zscaler-help/about-agent-provisioning-keys.md:10-29`). The current edit
drawer supports **Name**, **Maximum Reuse of Key** from 1 through 1,000, and
**Signing Certificate**
(`vendor/zscaler-help/editing-agent-provisioning-keys.md:10-22`). The capture
does not establish that Agent Group is editable or immutable, and it does not
publish the underlying GraphQL operation
(`vendor/zscaler-help/editing-agent-provisioning-keys.md:24-29`).

## Deployment flexibility (marketing claim)

Source: `vendor/zscaler-help/microsegmentation-marketing.md`; `vendor/zscaler-help/zero-trust-microsegmentation-marketing.md`.

The marketing page distinguishes between "full infrastructure control" and "consume capabilities as a gateway service" deployment options. The captured material doesn't expand on what these mean concretely. Likely interpretation:

- **Full infrastructure control** = customer deploys agents on their hosts, manages identity/grouping, owns enforcement.
- **Gateway service** = some aggregated / API-driven model where the customer doesn't deploy agents per-host but consumes east-west enforcement as a service.

The captured material does not confirm this interpretation. Treat the second mode as unclear until docs clarify.

## Edge cases / gotchas

Source: `vendor/zscaler-help/what-is-microsegmentation-zpa.md`; `vendor/zscaler-help/microsegmentation-marketing.md`; `vendor/zscaler-help/zero-trust-microsegmentation-marketing.md`.

1. **The implemented ZMS clients are read-only.** Operators looking for
   `client.zms.*` will find GraphQL queries, but no implemented Python SDK or MCP
   mutations (see [`./api.md`](./api.md)). Current Help documents portal writes
   without publishing their programmatic contract; do not describe the entire
   service as read-only.
2. **Recommendation lookback is unresolved.** The documented 14-day data
   retention period does not establish that infrequent flows are excluded from
   recommendations. Treat long-period workflow coverage as something to verify,
   not as a known failure mode
   (`vendor/zscaler-help/what-is-microsegmentation-zpa.md:12`).
3. **Agents enforce locally, not via tunnel.** A host that loses cloud connectivity continues to enforce its last-known policy via WFP / nftables — failure mode is fail-closed against unknown flows but allow-known. Different mental model from ZPA's App Connector dial-out (which fails closed entirely if Connectors lose cloud).
4. **WFP / nftables = native OS firewall.** Conflicts with other firewall management tools (Windows Defender Firewall policies via GPO, host-based firewalls like Carbon Black, custom nftables rules) are real concerns. Captured docs don't cover conflict resolution; treat as unanswered.
5. **US-region-only control plane** at the captured date. Customers with EU / APAC data residency requirements should validate this hasn't changed and whether it's a blocker.
6. **Agent updates are continuous-mode** — the agent runs always, presumably auto-updates. Update cadence and rollback options not in captures.
7. **Kubernetes deployment is confirmed; enforcement granularity is not.** The
   provisioning-key page distinguishes Kubernetes Cluster agent groups and
   directs them to Helm installation, but it does not establish whether policy
   enforcement is per pod, node, workload, or another boundary
   (`vendor/zscaler-help/about-agent-provisioning-keys.md:24-27`).
8. **ZMS appears in help.zscaler.com/zpa/, not its own namespace.** Customers searching for "Zscaler microsegmentation" hit ZPA help docs. Skill should normalize this — recognize "Zscaler microsegmentation", "ZMS", "Zero Trust Microsegmentation" all as the same product.

## Where ZMS fits relative to existing skill content

Source: `vendor/zscaler-help/what-is-microsegmentation-zpa.md`; `vendor/zscaler-help/microsegmentation-marketing.md`; `vendor/zscaler-help/zero-trust-microsegmentation-marketing.md`.

| Existing reference | ZMS touchpoint |
|---|---|
| [`../zpa/app-segments.md`](../zpa/app-segments.md) | ZPA app-segments are the user→app primitive; ZMS AppZones are the workload→workload primitive. Different abstractions; both are policy targets. |
| [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md) | ZPA's policy precedence rules don't apply to ZMS — ZMS enforcement is local OS firewall, not ZPA cloud policy. |
| [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md) | ZMS as a ZPA add-on belongs here — should be added as a cross-product hook (currently absent). |
| [`../cloud-connector/forwarding.md`](../cloud-connector/forwarding.md) | Cloud Connector handles **north-south workload traffic** (workload → internet via Zscaler). ZMS handles **east-west workload traffic** (workload → workload). Operators conflating the two is a routing-question hazard. |

## Open questions

Source: `vendor/zscaler-help/what-is-microsegmentation-zpa.md`; `vendor/zscaler-help/microsegmentation-marketing.md`; `vendor/zscaler-help/zero-trust-microsegmentation-marketing.md`.

- **Kubernetes enforcement granularity** — the Helm deployment path is
  documented, but is enforcement per pod, node, workload, or host agent?
- **Cloud-native workload integration** — does ZMS hook into AWS Security Groups / Azure NSGs / GCP firewall rules, or does it pure-OS-level the enforcement and ignore cloud-native firewalls?
- **Conflict resolution with other host firewalls** — what happens if Windows Defender Firewall via GPO and ZMS via WFP both have rules for the same flow?
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
