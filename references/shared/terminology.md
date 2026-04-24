---
product: shared
topic: "terminology"
title: "Zscaler terminology — marketing names, legacy names, log field names"
content-type: reference
last-verified: "2026-04-24"
confidence: high
sources:
  - "vendor/zscaler-help/Understanding_User_Activity_Log_Fields.pdf (ClientZEN/ConnectorZEN field names)"
  - "vendor/zscaler-help/understanding-zscaler-cloud-architecture.md"
  - "vendor/zscaler-help/understanding-private-service-edge-internet-saas.md"
  - "vendor/zscaler-help/about-virtual-service-edges-internet-saas.md"
  - "vendor/zscaler-help/about-app-connectors.md"
  - "vendor/zscaler-help/what-is-zscaler-client-connector.md"
author-status: reviewed
---

# Terminology — marketing, legacy, and log-field names

Zscaler has renamed several core components over time without fully purging the older names from logs, operator vocabulary, or internal docs. A tenant's admins, support tickets, Zenith community posts, log schemas, and runbooks can all use different names for the **same component**. This reference is the skill's canonical lookup.

## The renaming you'll hit most

| Current (help-site / marketing) | Legacy | Log-field / hostname form | What it is |
|---|---|---|---|
| Public Service Edge for Internet & SaaS | Public ZEN, Public Zscaler Enforcement Node, **PZEN** | `ClientZEN`, `ConnectorZEN` fields; values like `broker1b.pdx2`, `zs2-fra1a` | Zscaler-cloud gateway that inspects ZIA traffic |
| Private Service Edge for Internet & SaaS | Private ZEN, **PZEN** (same abbrev as Public!), **PSEN** (Private Service Edge Node, instance-level) | Same `*ZEN` fields; per-instance hostname | Zscaler-managed hardware/VM on customer premises |
| Virtual Service Edge for Internet & SaaS | Virtual ZEN, **VZEN**, **VSEN** (Virtual Service Edge Node, per-VM instance) | Same `*ZEN` fields | Customer-operated VM form of Private Service Edge |
| Zscaler Private Access (ZPA) Public Service Edge | ZPA broker | "broker" is the canonical on-wire term | ZPA side's equivalent of a ZIA Public Service Edge |
| Zscaler Private Access (ZPA) Private Service Edge | Private broker, ZPA PSE | n/a | Single-tenant ZPA broker at customer premise |
| App Connector | ZPA connector, **ZAC** (Zscaler App Connector) | `Connector`, `ConnectorZEN`, `ConnectorIP`, `ConnectorPort` fields | Outbound-only bridge between customer apps and ZPA cloud |
| Zscaler Client Connector (ZCC) | Zscaler App, **Z-App** | User-Agent strings may still reference Z-App | Endpoint agent for ZIA + ZPA + ZDX + Endpoint DLP |
| Z-Tunnel | (same) | `Z-Tunnel 1.0` / `Z-Tunnel 2.0` in forwarding-profile settings | Point-to-point TLS tunnel between ZCC↔Service Edge or App Connector↔Service Edge |
| Microtunnel (M-Tunnel) | Microtunnel | — | **ZPA-specific**: end-to-end tunnel ZCC↔App Connector via a Service Edge, MPLS-like label-switched, carries application traffic without exposing real IPs. Runs *inside* a Z-Tunnel. |
| Business Continuity Cloud | BC Cloud, BCP Cloud | — | Zscaler-managed fallback infrastructure (Private Policy Cache + Private PAC Servers) that keeps traffic inspected during main-cloud unreachability. Distinct from ZCC fail-open. |
| Zscaler Digital Experience (ZDX) | Zscaler Digital Experience Monitoring, Digital Experience | — | User-experience monitoring product (probes, scores, diagnostics). Distinct from ZIA/ZPA (policy) and ZCC (client agent). |
| Diagnostics Session | **deeptrace** (in SDK / MCP) | — | On-demand 1-minute-resolution probing of a specific device. The admin portal says "Diagnostics Session"; the SDK says "deeptrace". Same thing. |
| Cloud Path | (same) | — | ZDX feature: hop-by-hop network-path visualization from endpoint to destination, distinct from generic "cloud path" as a phrase. |
| Page Fetch Time | (same) | — | ZDX probe metric — top-level document fetch duration. The primary input to the ZDX Score for Web applications. |
| Telemetry and Policy Gateway (TPG) | — | — | ZDX control-plane component — multi-tenant RESTful gateway routing metrics between ZCC and Microsoft ADX. |
| Forwarding Profile | ZCC Forwarding Profile, Web Forwarding Profile (in `webForwardingProfile` API path) | `forwardingProfileActions` / `forwardingProfileZpaActions` in snapshot JSON | ZCC policy object: per-network-type rules for where to send traffic (ZIA/ZPA/direct) |
| Trusted Network | (same) | `trustedNetworkContracts` wrapper in ZCC list responses | Named set of criteria ZCC uses to classify the current network as "trusted" |
| App Profile (ZCC) | Device Profile, ZCC App Profile | — | **Not in API.** Admin-portal-only object that selects a Forwarding Profile for a device/user. See `clarification zcc-07`. |
| ZIdentity | — | `ZSCALER_VANITY_DOMAIN` env var points here | Unified identity service; OneAPI OAuth flows run here |
| LWF Driver | (same) | `enableLWFDriver` flag on Forwarding Profile | Windows Lightweight Filter — low-level packet interception driver |
| Zscaler Internet Access (ZIA) | Internet & SaaS (ZIA) is the newer rename; legacy was just "ZIA" | — | Internet security product line |
| Zscaler Private Access (ZPA) | (same) | — | Private app access product line |
| Zero Trust Exchange (ZTE) | — | — | Umbrella platform concept spanning ZIA/ZPA/ZDX |
| Central Authority (CA) | — | — | Policy/config/threat-intel brain of each Zscaler cloud |
| Nanolog cluster | — | — | Log storage cluster; receives compressed/tokenized logs from Service Edges |
| Zscaler Feed Central | — | — | Separate Zscaler cloud that distributes threat/URL/AV feeds to per-region CAs |
| SaaS Application Control | **Cloud App Control (CAC)** | UI paths still say `SaaS Application Control > Policies`; docs and field conventions still say "Cloud App Control" | Policy module for controlling cloud-app access + granular in-app actions |
| Zero Trust Browser | **Cloud Browser Isolation** / CBI, **Zscaler Isolation** (legacy) | `Cloud Browser Isolation` appears as a Device Group value; SDK module named `zbi` | Browser-based isolation of web traffic. Renders pages in ephemeral cloud container, streams result to native browser. See `references/zbi/`. |
| Turbo Mode | (same) | Per-isolation-profile flag | ZBI rendering optimization — sends browser instructions instead of pixels; requires WebGL/WebGL2; not available on IE11. |
| Isolation profile | Browser Isolation Profile | — | ZBI config object specifying how an isolated session behaves (Turbo Mode, copy/paste/print/file-transfer allows, region, watermarking, etc.). Separate objects for ZIA and ZPA use. |
| Smart Browser Isolation | Smart Isolate | UI path: Policy > Secure Browsing > Smart Isolate | ZIA policy that auto-isolates suspicious sites via AI/ML. Requires Malware Protection inspection toggles enabled; auto-creates an SSL Inspection rule. |
| Zscaler Admin Console | ZIA Admin Portal, ZPA Admin Portal (per product) | — | UI for policy config and reporting |

## Why the confusion matters for the skill

When an operator says *"the PSEN in Frankfurt"*, they mean a specific **instance** of a Private Service Edge cluster — not a separate product. When a log shows `ClientZEN: broker1b.pdx2`, that's the current marketing-named **Public Service Edge** the user connected to, with the internal broker hostname. When Zscaler support talks about *"your PZEN"*, context decides whether it's a Public or Private edge.

**Rule for skill answers:**

- Translate legacy terms to current in user-facing explanations.
- Preserve original terms in quotes when citing logs, support tickets, or tenant-specific runbooks — don't "correct" them.
- When an operator uses a legacy term in a question, answer using the current term but acknowledge the alias parenthetically so they trust the translation.

## Field-name conventions worth knowing

- **ZIA Web/Firewall logs (NSS/Nanolog):** use current product field names (many match CSV headers). No `ZEN` in field names; the concept surfaces via e.g. `proxyip` / `proxyport` / `clusterName`.
- **ZPA User Activity logs (LSS):** `ClientZEN`, `ConnectorZEN` explicitly — legacy names preserved in the schema. See `references/zpa/logs/access-log-schema.md` and the source PDF.
- **Broker hostnames** (`broker1b.pdx2`, etc.): instance-level identifier, useful for support correlation. The suffix (`pdx2`, `fra1a`) is the data-center code.

## Cross-links

- Components and cloud architecture — `vendor/zscaler-help/understanding-zscaler-cloud-architecture.md`
- Service Edge form factors (Public / Private / Virtual) — `vendor/zscaler-help/about-public-service-edges-internet-saas.md`, `understanding-private-service-edge-internet-saas.md`, `about-virtual-service-edges-internet-saas.md`
- ZPA App Connector — `vendor/zscaler-help/about-app-connectors.md`
- Z-Tunnel (passing mention only, no standalone doc) — `vendor/zscaler-help/what-is-zscaler-client-connector.md`

## Open questions (terminology-adjacent)

- **Z-Tunnel 1.0 vs 2.0** — **resolved at the customer-facing level 2026-04-24**. Dedicated help articles exist at `help.zscaler.com/zscaler-client-connector/about-z-tunnel-1.0-z-tunnel-2.0` (and the Best-Practices / Bypasses / Migration sibling articles). Codified in [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md). 1.0 = HTTP CONNECT proxy, web traffic only. 2.0 = DTLS/TLS packet tunnel, all ports and protocols, requires single-IP NAT. Wire-format protocol internals remain undocumented customer-facing (Zscaler Support territory).
- **"Broker" vs "Service Edge"** on the ZPA side — ZPA Admin Console UI uses "Public Service Edge" for the cloud-side component; LSS log field names and some older docs use "broker". Treat them as synonyms.
