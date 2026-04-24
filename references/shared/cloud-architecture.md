---
product: shared
topic: "zscaler-cloud-architecture"
title: "Zscaler cloud architecture — Central Authority, Service Edges, BC Cloud, tunnel model"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "https://help.zscaler.com/zia/understanding-zscaler-cloud-architecture"
  - "vendor/zscaler-help/understanding-zscaler-cloud-architecture.md"
  - "https://help.zscaler.com/zpa/understanding-private-access-architecture"
  - "vendor/zscaler-help/understanding-private-access-architecture.md"
  - "https://help.zscaler.com/zia/understanding-business-continuity-cloud-components"
  - "vendor/zscaler-help/understanding-business-continuity-cloud-components.md"
  - "https://help.zscaler.com/legacy-apis/activation"
  - "vendor/zscaler-help/zia-activation.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/activate.py"
author-status: draft
---

# Zscaler cloud architecture

Component-level picture of how a Zscaler cloud is put together — Central Authority, Service Edges, Nanolog, Feed Central, Business Continuity Cloud, and the tunnel model — from a customer's perspective. Answers questions about policy propagation, activation, failure domains, and "what does Zscaler actually run on our behalf."

## Summary

Each Zscaler cloud is a self-contained deployment (`zscaler.net`, `zscalertwo.net`, `zscalerthree.net`, etc.) consisting of:

- **Central Authority (CA)** — the control plane. Holds configuration, policy, threat-intel, and software-update state.
- **Service Edges** — the data plane. Public (Zscaler-operated), Private (customer-premise hardware), and Virtual (customer-operated VMs) variants. Process traffic, enforce policy.
- **Nanolog clusters** — log storage and export.
- **Feed Central** — a separate Zscaler cloud that distributes threat-intel and URL-classification feeds to all Zscaler clouds' Central Authorities.
- **Business Continuity Cloud** — Zscaler-managed fallback infrastructure (Private Policy Cache + Private PAC Servers) that keeps traffic inspected with last-known-good policy when the main cloud is unreachable.
- **Support systems** — Sandbox servers, PAC file servers, Admin Console, Log Routers.

ZIA and ZPA are separate services running on **separate multi-tenant infrastructure** (ZPA was built "from the ground up" to be isolated from ZIA per the ZPA architecture doc). A tenant using both services has separate CA, Service Edge, and LSS/Nanolog instances per product, linked via the shared Zscaler PKI and Zscaler Identity layer.

## Mechanics

### Central Authority

The CA is described as **"the brain and nervous system"** of the Zero Trust Exchange in both the ZIA and ZPA architecture docs.

**ZIA CA topology** (from *Understanding the Zscaler Cloud Architecture for Internet & SaaS*):

- **One active + two passive standby servers** per CA — active-passive replication.
- Active CA replicates data to both standbys in real time; any standby can promote to active.
- Servers are hosted in **separate locations** for fault tolerance.

**ZPA CA topology** (from *Understanding the Private Access Architecture*):

- **Geographically distributed system of in-sync nodes that all actively service requests** — active-active.
- Policy distributed across all CA components.
- Dispatchers track real-time application states.

**The two CAs run different clustering models** — ZIA is active-passive, ZPA is active-active. An agent answering "what happens during a CA failover?" should give different mechanics depending on product. This difference is likely an artifact of the products being built independently; watch for Zscaler to converge them in future.

**What the CA does**:

- Holds the authoritative copy of the tenant's configuration and policy.
- Distributes policy and software updates to Service Edges.
- Pushes threat-intel and URL feeds (sourced from Feed Central) down to Service Edges.
- Accepts admin API traffic (config writes, activation calls).
- Monitors health of the entire Zero Trust Exchange.

**What the CA does NOT do**: process customer traffic. Customer traffic stays at the Service Edge. The CA only holds control-plane state.

### Service Edges (data plane)

Three form factors, same software stack:

| Form factor | Operator | Placement | Typical use |
|---|---|---|---|
| Public Service Edge (PSE) | Zscaler | Zscaler-hosted, multi-tenant | Default for user traffic |
| Private Service Edge (PSEN instance-level) | Zscaler-managed hardware, customer-hosted | On-premises, single-tenant | On-prem traffic inspection (compliance, latency) |
| Virtual Service Edge (VSE/VSEN instance-level) | Customer-operated VM, Zscaler-supported | Customer infrastructure, single-tenant | Same as Private but software-based |

**Data-plane properties** (from ZIA architecture doc):

- TCP stack runs in **user mode**, hardened for multitenancy.
- **Customer traffic never leaves the Service Edge** — it's not forwarded to other Zscaler components.
- **No data written to disk** on the Service Edge.
- Logs are compressed, tokenized, and exported over TLS to Log Routers, which write to the Nanolog cluster for that tenant's geography.
- **Active-active load balancing** worldwide; CA monitors health.

**ZPA-specific function**: Service Edges create and manage M-Tunnels (Microtunnels) end-to-end between ZCC and App Connectors (see [Z-Tunnel vs M-Tunnel](#z-tunnel-vs-m-tunnel) below).

See [`./terminology.md`](./terminology.md) for the ZEN↔Service Edge rename history and the various broker/PSEN/VSEN aliases that still appear in logs.

### Nanolog

Log storage and export. One active + two passive standbys per cluster, mirroring the ZIA CA topology. Each cluster processes 1.2+ billion logs per day.

- Receives compressed/tokenized logs from Service Edges worldwide.
- Correlates to tenant, writes to disk, serves retrieval for reporting.
- Streams to customer SIEMs via **Nanolog Streaming Service (NSS)** for ZIA; ZPA has **Log Streaming Service (LSS)** that reports events primarily from Service Edges.

See [`../zia/logs/web-log-schema.md`](../zia/logs/web-log-schema.md), [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md) for per-product log field references.

### Feed Central

A **separate Zscaler cloud** — not one of the numbered clouds a tenant provisions on. Distributes:

- Threat intelligence (malware, C2, phishing)
- URL classification updates
- Anti-virus definitions
- IP reputation

**Distribution path**: Feed Central → each cloud's CA → each Service Edge. Ensures every Service Edge has the latest classification data regardless of which cloud handles the tenant.

Zscaler has partner feeds from Microsoft, Google, RSA, Verisign, and others.

### Business Continuity Cloud

From *Understanding the Business Continuity Cloud Components*, a **Zscaler-managed fallback infrastructure** that kicks in when the main Zscaler cloud is unreachable for a tenant. Two components:

1. **Private Policy Cache** — integrated into ZIA Private Service Edges. Continuously syncs tenant config from the public cloud during normal operations. During BC mode, serves as the primary control path, applying the last-known-good policy.
2. **Private PAC Servers** — host tenant PAC files. Redirect client traffic to the BC cloud via geo-aware PAC files during failover.

Both are deployed in **redundant pairs per BC Cloud site**.

**Key constraints worth knowing:**

- **BC Cloud only supports Z-Tunnel 1.0, PAC files, and GRE tunnels.** **Z-Tunnel 2.0 is NOT supported in BC mode.** A tenant that has migrated to Z-Tunnel 2.0 falls back to 1.0 during BC operations. Worth calling out in any "what happens during an outage" answer.
- **BC Cloud upgrades are deliberately delayed behind public cloud upgrades** — fault isolation. If a public cloud upgrade introduces a bug, BC Cloud still runs the previous (presumably working) version as a safety net.

This is the product-grade BCP story. **Distinct from ZCC's fail-open behavior**, which is the client-side last-resort (see [`../zcc/forwarding-profile.md § Fail-open policy`](../zcc/forwarding-profile.md)). Layering:

1. Public cloud unreachable → ZCC detects via fail-open policy.
2. Fail-open can either allow direct (fail-open) or block (strict).
3. **BC Cloud sits between** — when both are configured, PAC redirects to BC Cloud before the fail-open decision kicks in. Traffic still inspected, just against cached policy at the BC site.

### Activation mechanism

ZIA config changes are **staged pending** until activation. Full mechanics in [`./activation.md`](./activation.md); recapping the API surface here:

| Method | Path | Purpose |
|---|---|---|
| `GET /eusaStatus/latest` | EUSA acceptance status (End User Subscription Agreement) | — |
| `PUT /eusaStatus/{id}` | Update EUSA acceptance | — |
| `GET /status` | Current activation status (3-value enum) | Check before activating |
| `POST /status/activate` | Apply pending config changes | Moves from PENDING → ACTIVE |

Status enum from the legacy API docs shows 3 values — likely `ACTIVE` / `PENDING` / `INPROGRESS` or similar. Exact enum not fully captured; confirm via live tenant first-fetch (tracked informally until it matters).

**ZPA has no activation step.** Changes propagate on write — this is an architectural difference between the two products' control planes, parallel to the active-passive vs active-active CA topology difference.

### Z-Tunnel vs M-Tunnel

Two distinct tunnel concepts in Zscaler's data plane:

- **Z-Tunnel** — point-to-point TLS-encrypted tunnel between ZCC and a Public Service Edge, OR between an App Connector and a Private Service Edge. Mutually authenticated via pinned certificates. Can carry multiple Microtunnels (M-Tunnels). See [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md) for the ZCC-side client tunnel (1.0 vs 2.0).
- **M-Tunnel (Microtunnel)** — ZPA-specific: end-to-end channel between ZCC and an internal application, threaded through a Service Edge and an App Connector. Uses tags similar to MPLS label-switched paths; no actual IP identification data is passed along the way.

M-Tunnel's MPLS-like architecture is the reason ZPA can claim "true zero-trust" — the client never learns the internal application's real IP. ZCC presents **synthetic IPs** to local applications, which ZCC intercepts via DNS hijack and routes through the Z-Tunnel/M-Tunnel stack.

### Certificate and PKI model

From *Understanding the Private Access Architecture* § Communication Between Components:

- All component-to-component communication uses **mutually-pinned TLS connections**. Cryptographic MITM protection.
- **Client certs** on ZCC and App Connectors are signed by each tenant's own CA — scoped to the tenant.
- **Server certs** on Service Edges are signed by Zscaler's CA — organization-level.
- Zscaler certificates are signed via **offline, air-gapped signing ceremonies** (no online CA for root signing).
- **Private keys never leave the device where generated.** Tenant CA private keys are stored AES256-GCM encrypted.

Operational implications:

- **Cert expiry is real**: App Connector and ZCC certs have finite validity. `scripts/connector-health.py` surfaces this as a common operational failure mode.
- **Trust-chain failures** on a Service Edge rejecting a connection are almost always cert-chain issues (missing intermediate, expired leaf, bad system clock) — not policy.
- **Cross-tenant leakage is structurally prevented** by the per-tenant CA signing scope. A compromised tenant cert cannot authenticate against another tenant's infrastructure.

## Admin console and support systems

From the ZIA cloud architecture doc:

- **Sandbox servers** — hold Sandbox reports and host the behavioral analysis sandbox itself. See [`../zia/sandbox.md`](../zia/sandbox.md).
- **PAC file servers** — host Zscaler-provided and customer-uploaded PAC files.
- **Zscaler Admin Console** — multi-tenant config UI, shared across all tenants on a cloud.
- **Log Routers** — direct logs from Service Edges to the correct regional Nanolog cluster per tenant.

All inter-component communication uses **encrypted SSL tunnels**; no cleartext cross-component traffic.

## Failure domains and blast radii

Worth understanding when answering "what happens when X fails":

- **Single Service Edge down**: traffic re-routed by the CA's health monitoring to the next-closest active Service Edge. Sub-minute-scale impact.
- **Single CA node down**:
  - ZIA: one of two passive standbys promotes; traffic unaffected (CA is control plane, not data plane).
  - ZPA: requests load-balance to other active CA nodes; traffic unaffected.
- **Whole cloud unreachable for a tenant**: BC Cloud kicks in if provisioned; otherwise ZCC fail-open policy applies.
- **Feed Central failure**: classifications go stale across all clouds. Service Edges keep running on last-fetched feeds. Operator-visible only if a new threat campaign launches during the outage.
- **Nanolog cluster down**: traffic unaffected (Service Edge keeps processing); logs buffer or drop depending on configured behavior. NSS/LSS streams may gap.

The platform is built so that **data plane (Service Edges) can run on cached state** even when control plane (CA) is temporarily unreachable. BC Cloud extends this property with a Zscaler-operated fallback for extended outages.

## Open questions

- **ZIA CA active-passive vs ZPA CA active-active**: is this an intentional architectural split (different workloads need different topologies) or a convergence-in-progress? Not documented.
- **Activation status enum exact values**: the API docs show "3 Items" but don't enumerate. First tenant API call reveals them.
- **Per-cloud CA or per-tenant CA**: the docs describe CAs as a property of a cloud, but policy is "distributed across all components of the CA" — implying per-tenant partitioning within a shared CA infrastructure. Not explicit.
- **BC Cloud geo coverage**: how many BC Cloud sites exist worldwide, and how Zscaler decides which one a tenant fails over to. Not documented customer-facing.

## Cross-links

- Activation mechanics (already-existing doc; this doc recaps the architectural layer) — [`./activation.md`](./activation.md)
- Terminology (ZEN↔Service Edge renames, Z-App↔ZCC, etc.) — [`./terminology.md`](./terminology.md)
- Z-Tunnel 1.0 vs 2.0 (customer-facing tunnel mechanics) — [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md)
- ZCC fail-open (the client-side last-resort when cloud is unreachable) — [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)
- Sandbox servers (one of the support systems mentioned here) — [`../zia/sandbox.md`](../zia/sandbox.md)
- Nanolog / NSS log streaming — `vendor/zscaler-help/understanding-nanolog-streaming-service.md`
