# Understanding Subclouds

**Source:** https://help.zscaler.com/zia/understanding-subclouds
**Captured:** 2026-04-23 via Playwright MCP.

---

Internet & SaaS (ZIA) Help — Traffic Forwarding — Understanding Subclouds

A **subcloud is a subset of ZIA Public Service Edges** (and/or Private Service Edges). ZIA Public Service Edges are deployed in Zscaler data centers worldwide; subclouds let you restrict which subset of those edges handle your traffic.

## Subcloud Types

A subcloud can be:

1. **Subset of ZIA Public Service Edges only** — e.g., "Europe-only" for GDPR compliance.
2. **Subset of Private Service Edges only** — e.g., ensure traffic never leaves on-prem.
3. **Mix of Public + Private Service Edges** — preferred set of both.

**Constraint:** a subcloud cannot be a subset of ZIA Public Service Edges in only one data center (i.e., at least two data centers, presumably for availability).

## Why Subclouds Exist

Default behavior: Zscaler uses geolocation to forward traffic to the **nearest Public Service Edge**. This can be wrong for some organizations:

- Regulatory / compliance: must stay in a specific region (e.g., EU only).
- Privately hosted data centers: traffic should stay on Private Service Edges.
- Surcharge data centers: special-region Public Service Edges that require explicit subcloud membership.

Subclouds override the geolocation default.

## Setup

- Submit a ticket to Zscaler Support. They only set up subclouds for orgs with access to limited, restricted, or private data centers.
- Subcloud name: ≤32 chars; alphanumeric + hyphen; first/last char must be alphanumeric.

## PAC File Variables for Subcloud Targeting

Default PAC file variables (`gateway.<cloud>` / `${GATEWAY}`) send traffic to the **nearest public** Public Service Edge — which may not be in your subcloud.

To force subcloud routing in PAC files:

```
${GATEWAY.<Subcloud>.<Zscaler cloud>}
${SECONDARY.GATEWAY.<Subcloud>.<Zscaler cloud>}
```

For non-PAC applications:

```
gateway.<Subcloud>.<Zscaler cloud>
secondary.gateway.<Subcloud>.<Zscaler cloud>
```

For Kerberos:

```
${GATEWAY.<Subcloud>.<Zscaler cloud>_HOST}
${SECONDARY.GATEWAY.<Subcloud>.<Zscaler cloud>_HOST}
```

Each subcloud has an associated DNS name (used as `<Subcloud>` above). `<Zscaler cloud>` is the customer's cloud name (zscaler.net, zscalertwo.net, zscalerthree.net, etc.).

**Zscaler-managed subcloud `CONUS`** exists for US-only traffic forwarding. Example PAC:

```
${GATEWAY.CONUS.zscaler.net}
${SECONDARY.GATEWAY.CONUS.zscaler.net}
```

## Subcloud Failover / Propagation Timing

When you edit a subcloud's data center list:

- **~5 minutes** for changes to reflect in Zscaler Hosted PAC files.
- **15 minutes** — Zscaler Client Connector refreshes the Application Profile PAC on this cadence.
- **10–20 minutes** — users are typically redirected after changes are activated.

To force an immediate sync on a client: open Zscaler Client Connector → More → **Update Policy** next to App Policy.

Ensure the Application Profile PAC has been updated before requesting an app policy update, otherwise the client pulls a stale config.

## Admin UI

Administration > Resources > Subclouds. Shows per-subcloud: Name, Number of Data Centers, Number of Disabled Data Centers. Edits trigger the propagation delays above.
