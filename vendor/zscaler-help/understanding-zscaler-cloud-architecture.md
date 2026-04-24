# Understanding the Zscaler Cloud Architecture for Internet & SaaS

**Source:** https://help.zscaler.com/zia/understanding-zscaler-cloud-architecture
**Captured:** 2026-04-23 via Playwright MCP.

---

Internet & SaaS (ZIA) Help — Understanding the Zscaler Cloud Architecture for Internet & SaaS

Zscaler operates a global multi-cloud SECaaS platform. The infrastructure has **three key components**: the Zscaler **Central Authority (CA)**, **Public Service Edges** for Internet & SaaS (ZIA), and **Nanolog clusters**.

## Zscaler Central Authority

The Internet & SaaS Central Authority (CA) is the "brain and nervous system" of a Zscaler cloud. It monitors the cloud and provides a central location for software and database updates, policy and configuration settings, and threat intelligence.

**Topology:**
- One active server + two passive standby servers per CA.
- Active CA replicates data in real time to the two standby CAs; any can become active.
- Each server is hosted in a **separate location** for fault tolerance.

## Public Service Edges for Internet & SaaS

Full-featured inline internet security gateways that inspect all internet traffic bi-directionally for malware and enforce security/compliance policies.

**Traffic routing:**
- An organization can forward its traffic to any Public Service Edge globally or use **Zscaler's advanced geo-IP resolution** to direct traffic to the nearest edge.
- When a user moves locations, the policy follows — the new Public Service Edge downloads the appropriate policy.

**Key architecture facts:**
- Customer traffic is **not passed to any other component within Zscaler infrastructure** beyond the Public Service Edge itself.
- TCP stack runs in **user mode** — specially crafted for multitenancy and data security.
- Public Service Edges **never store any data to disk**.
- Log data is **compressed, tokenized, and exported over secure TLS connections** to Log Routers, which direct logs to the Nanolog cluster hosted in the appropriate geographical region for each organization.
- **Active-active load balancing mode** worldwide; CA monitors health.

## Nanolog Clusters

Nanolog clusters store transaction logs and provide reports.

**Topology:**
- One active + two passive standby servers per cluster.
- Active Nanolog replicates to the two standbys in real time; any can become active with no data loss.
- Each Nanolog server hosted in a **separate location** for fault tolerance.

**Characteristics:**
- Receives logs from all over the world every second, correlates them to a specific customer org, and writes to disk for high-speed retrieval.
- Processes up to **1.2+ billion logs per day** per cluster.
- Zscaler offers **Nanolog Streaming Service (NSS)** to stream logs from the Nanolog to customer SIEMs. See `understanding-nanolog-streaming-service.md`.

## Support Systems (also part of each cloud)

- **Sandbox servers** — files selected for behavioral analysis are sent for analysis; reports stored here.
- **PAC file servers** — host Zscaler PAC files and custom PAC files uploaded to Zscaler.
- **Zscaler Admin Console** — multi-tenant interface for policy management and reporting.
- **Log Routers** — ensure logs for each organization are stored in the appropriate Nanolog cluster.

All components communicate with each other over **encrypted SSL tunnels**.

## Zscaler Feed Central

A **separate Zscaler cloud** dedicated to centralized distribution of threat intelligence, URL filtering updates, anti-virus definitions, IP reputation, and other feeds.

**Distribution path:** Zscaler Feed Central → Central Authorities (of each cloud) → Public Service Edges. This ensures every Public Service Edge has the latest URL database and threat information.

Zscaler has partnerships with Microsoft, Google, RSA, Verisign, and others for these feeds.

## Provisioning Scope

An organization is provisioned on **one cloud** and its traffic is processed by that cloud only. To identify which cloud hosts an org, see Understanding Zscaler Cloud Names.
