---
product: shared
topic: "primer-platform-shape"
title: "Primer — the Zscaler platform on one page"
content-type: primer
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: draft
audience: "non-networking professional who needs to orient on Zscaler quickly"
---

# Primer — the Zscaler platform on one page

A "you are here" map of the Zscaler product family. After reading this, you should be able to recognize the major products by name, know what problem each solves, and understand how they fit together.

This is a primer — high-level only. For depth, see [`../portfolio-map.md`](../portfolio-map.md) (single-page index of every Zscaler product) and individual product directories.

## The big picture

Zscaler is a **cloud-delivered security platform** that replaces three traditional things:

1. **Web gateways and firewalls** for outbound user-to-internet traffic.
2. **VPN concentrators** for users-to-private-app access.
3. **Inline appliances** for inspection / filtering / DLP.

It does this by sitting in the cloud (the **Zero Trust Exchange / ZTE**) — every connection from a Zscaler-protected user / device / workload flows through Zscaler's cloud first, gets inspected and policy-applied, then forwarded to the actual destination.

```
                      Zscaler Cloud (Zero Trust Exchange)
                      ┌───────────────────────────────────┐
                      │  Public Service Edges             │
                      │  (PSEs — proxy + inspection)      │
                      │                                   │
   User devices ─────►│  ZIA: outbound web/SaaS security  │────► Internet / SaaS
   Branch offices     │  ZPA: inbound private-app access  │
   Cloud workloads ──►│  ZDX: experience monitoring       │────► Private apps
                      │  Plus: DLP, sandbox, ATP, etc.    │      (via App Connectors)
                      └───────────────────────────────────┘
```

## The "Zero Trust Exchange" architectural pillar

ZTE is Zscaler's marketing name for the unified platform. Not a product itself — it's the platform layer all products live on.

Three observations about ZTE:

1. **It's globally distributed.** PSEs in dozens of data centers worldwide. Users connect to the nearest one.
2. **It's policy-unified across products.** A single policy can reference identity (ZIdentity), device (ZCC), location, app — regardless of which product is enforcing it.
3. **It's the thing customers buy.** When someone says "we use Zscaler," they typically mean "we route traffic through ZTE."

## The eight core products (Tier 1 in the portfolio map)

These are the products with deep skill coverage. In rough order of "what touches them first":

### Identity and endpoint layer

#### **ZIdentity** — identity hub
Unified identity / SSO / API-client / step-up auth platform. Federates upstream IdPs (Okta, Entra) and issues identity to all downstream Zscaler products. **Underneath everything else** — every other product authenticates users via ZIdentity (or a legacy variant).

#### **ZCC (Zscaler Client Connector)** — endpoint agent
The software on user devices that decides where their traffic goes. Forwards web traffic to ZIA (via Z-Tunnel), private-app traffic to ZPA (via Microtunnel), or direct (bypass list). Handles device posture evaluation, trusted-network detection, captive-portal handling.

### Outbound (user → internet) layer

#### **ZIA (Internet & SaaS)** — secure web gateway
Cloud proxy for outbound web traffic. Inspects every HTTP/HTTPS request for: URL filtering, cloud-app control, SSL inspection (decrypt-and-rescan), DLP (data leakage prevention), Sandbox (file detonation), Malware/ATP, firewall, IPS, bandwidth control. The "what users can see on the internet" product.

### Inbound (user → private app) layer

#### **ZPA (Zscaler Private Access)** — zero-trust app access
Replaces VPN. Users authenticate per-app (not per-network), each app has its own policy, traffic flows through ZPA's cloud to App Connectors deployed in customer environments. **AppProtection** adds inline WAF/IPS for ZPA-protected apps. **PRA** (Privileged Remote Access) extends this to RDP/SSH/VNC with session recording. **Browser Access** lets unmanaged devices reach apps through a browser without ZCC.

### Workload / branch traffic layer

#### **Cloud & Branch Connector (CBC / ZTW / ZTC)** — workload-side traffic forwarding
VM-based gateway for cloud workloads (AWS / Azure / GCP) and branch offices. Routes their traffic into the Zscaler cloud the way ZCC routes user traffic. Five marketing names for the same product family.

### Observability layer

#### **ZDX (Digital Experience)** — UX monitoring
Monitors user experience across apps, networks, devices. Probes (Web + Cloud Path), ZDX Score, diagnostics sessions ("deeptraces"), alerts. The "is the user experience healthy?" product. Read-only API; configuration is portal-only.

### Specialized layers

#### **ZBI (Cloud Browser Isolation / Zero Trust Browser)** — remote browsing
Renders web pages on Zscaler's infrastructure and streams pixels (or DOM-mirror) to the user's browser. For risky URLs, unmanaged devices, browser-based attacks. Triggered by ZIA's URL Filter `Isolate` action or Smart Browser Isolation policy.

#### **ZWA (Workflow Automation)** — DLP incident lifecycle
Downstream of ZIA DLP. When DLP detects sensitive data in flight, ZWA manages the resulting incident — triage, workflows (auto-close / auto-notify / auto-escalate), notification channels (Slack/Teams/email), ticketing integrations (ServiceNow, Jira).

## Three more products with deep coverage (Tier 1 also)

#### **AppProtection** — WAF/IPS for ZPA
Inline application-layer security inside the ZPA data path. OWASP Top 10, ThreatLabZ controls, Active Directory protocol attacks (Kerberos/SMB/LDAP), API protection, WebSocket. Bundled with ZPA mostly; was previously called "Inspection."

#### **Risk360** — cyber risk quantification
Dashboard that turns Zscaler telemetry into dollar-denominated cyber-risk scores via Monte Carlo simulation. CISO/board audience. Paid add-on. Not an enforcement product — purely measurement and reporting.

#### **Zscaler Deception** — active-defense via decoys
Deploys fake assets (decoys) across the environment. Any interaction with a decoy = high-confidence breach signal (no legitimate traffic should touch them). For post-perimeter detection — lateral movement, APTs, ransomware.

## How a typical request flows

A user on a corporate-managed laptop opens Salesforce:

```
1. Laptop has ZCC installed
2. ZCC's forwarding profile decides: this is web traffic on an Untrusted Network → forward via Z-Tunnel
3. Z-Tunnel carries the traffic to the nearest PSE (ZIA's data plane)
4. PSE applies ZIA policies:
   - SSL Inspection (decrypts HTTPS)
   - URL Filter (allow Salesforce category)
   - Cloud App Control (specific Salesforce policies)
   - DLP (any sensitive data being exfiltrated?)
5. PSE re-encrypts and forwards to Salesforce
6. Response flows back the reverse path
7. Every event logs to LSS / NSS streams → SIEM
```

A user opens an internal HR app via ZPA:

```
1. Laptop has ZCC
2. User opens https://hr.internal.example.com
3. DNS returns a ZPA Synthetic IP (not the real internal IP)
4. ZCC routes the connection through Z-Tunnel + ZPA Microtunnel
5. ZPA Access Policy evaluates: identity (via ZIdentity SAML/OIDC), device posture, location, time
6. If allowed, AppProtection inspects the application traffic
7. Traffic arrives at App Connector running in customer's HR-app network
8. App Connector connects to actual hr.internal.example.com
9. Response flows back the reverse path
10. LSS log records the access event
```

## How the products feed each other

```
ZCC ──► provides device posture to ──► ZPA Access Policy
ZIA ──► forwards SSL-decrypted to ──► ZPA (SIPA / ZPA-after-ZIA)
ZIA DLP ──► creates incidents in ──► ZWA
ZPA ──► triggers isolation in ──► ZBI (Smart Browser Isolation)
All products ──► emit telemetry to ──► ZDX (experience), Risk360 (risk), Splunk (raw logs)
ZIdentity ──► authenticates users to ──► every other product
Deception ──► creates rules in ──► ZPA (ZTN decoys)
```

This is why "single product" answers often miss the point — most operationally interesting questions span multiple products.

## What lives at the platform layer

Some concerns aren't tied to one product but cut across all of them:

- **Locations and sub-locations** — the forwarding-grouping primitive every ZIA rule scopes by.
- **PAC files** — proxy auto-config used by ZIA forwarding, ZCC, Browser Access, Kerberos auth.
- **Subclouds** — restricting which Service Edges handle a tenant's traffic (GDPR scenarios).
- **Activation gate** — ZIA + CBC have a staged-vs-live policy gate; others propagate on write.
- **NSS / Cloud NSS** — log streaming to SIEMs.
- **Admin RBAC** — three separate systems (ZIA / ZPA / ZIdentity) federated via Administrative Entitlements.
- **OneAPI** — unified API gateway with three auth flows (OneAPI OAuth / ZDX legacy / ZCC legacy).
- **Source IP Anchoring (SIPA)** — keeps customer-controlled IPs visible to destinations through Zscaler.
- **Device Posture** — cross-product (ZCC evaluates, ZPA + ZIA consume).

Each has a doc under `references/shared/` or `references/_meta/primer/`.

## Out-of-scope products to recognize but not deep-dive

These exist; the skill recognizes them but doesn't go deep. Recognize the names so you don't draw a blank:

- **ZMS** — Workload Microsegmentation (east-west server-to-server policy)
- **ZINS** — Shadow IT / IoT / SaaS reporting
- **EASM** — External Attack Surface Management
- **ZAI Guard** — AI/LLM traffic policy
- **DSPM** — Data Security Posture Management (at-rest data discovery)
- **Asset Exposure Management** — CAASM (cyber asset attack-surface management)
- **UVM** — Unified Vulnerability Management
- **Cloud Protection / Posture Control** — workload posture (CSPM/CWPP)
- **Zscaler Cellular** — IoT/OT zero-trust SIM
- **ITDR** — Identity Threat Detection and Response
- **Resilience** — auto failover (Business+ tiers)
- **Federal Cloud variants** — `zscalergov`, `zscalerten`, ZPA GOV/GOVUS

For each: check [`../portfolio-map.md`](../portfolio-map.md) before assuming.

## What you should be able to do after this primer

1. Recognize all the major Zscaler product names.
2. Know which products handle outbound traffic (ZIA), inbound app access (ZPA), forwarding (ZCC), workloads (CBC), monitoring (ZDX), isolation (ZBI), DLP incidents (ZWA), identity (ZIdentity).
3. Identify which product is relevant for a given operator question.
4. Know that "Zero Trust Exchange" is the platform, not a product.
5. Understand that real Zscaler operations span multiple products simultaneously.

For depth on any single product, descend into its `references/<product>/` directory.

## Cross-links

- Single-page portfolio index: [`../portfolio-map.md`](../portfolio-map.md)
- Routing for any question: [`../../../SKILL.md`](../../../SKILL.md)
- Cross-product integration catalog: [`../../shared/cross-product-integrations.md`](../../shared/cross-product-integrations.md)
- Cloud architecture detail: [`../../shared/cloud-architecture.md`](../../shared/cloud-architecture.md)
- Other primers in this directory:
  - [`./networking-basics.md`](./networking-basics.md)
  - [`./proxy-vs-gateway-vs-tunnel.md`](./proxy-vs-gateway-vs-tunnel.md)
  - [`./zero-trust.md`](./zero-trust.md)
  - [`./identity-saml-oidc.md`](./identity-saml-oidc.md)
