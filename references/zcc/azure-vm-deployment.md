---
product: zcc
topic: "azure-vm-deployment"
title: "ZCC inside Azure VMs — AVD, Windows 365 Cloud PCs, single-session limits"
content-type: reasoning
last-verified: "2026-04-25"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zscaler-client-connector/configuring-zscaler-client-connector-microsoft-365-cloud-pcs"
  - "https://help.zscaler.com/downloads/zscaler-technology-partners/cloud/zscaler-and-azure-traffic-forwarding-deployment-guide/Zscaler-Azure-Traffic-Forwarding-Deployment-Guide-FINAL.pdf"
  - "https://learn.microsoft.com/en-us/azure/virtual-desktop/azurecommunicationips"
  - "vendor/zscaler-help/about-z-tunnel-1.0-z-tunnel-2.0.md"
author-status: draft
---

# ZCC inside Azure VMs — AVD, Windows 365 Cloud PCs, single-session limits

This is the **endpoint agent inside an Azure VM** scenario — typically Azure Virtual Desktop session hosts or Windows 365 Cloud PCs. Different from the [Cloud Connector on Azure](../cloud-connector/azure-deployment.md) deployment shape (which is the workload-traffic-forwarding VM appliance).

## Disambiguation upfront

There is **no Azure Marketplace VM image for ZCC**. The Marketplace lists Cloud Connector + ZPA App Connector + ZIA Service Edge VMs plus a "Zscaler for Users" entry that's a SaaS billing entitlement, not a deployable VM image. ZCC is always installed *into* an existing VM via Intune, baked into a custom image, or via MSI silent install. When operators say "ZCC on Azure VM," they mean ZCC inside an AVD session host or a Windows 365 Cloud PC.

If your question is about **forwarding cloud-workload traffic** (servers, containers, no end-user session) the answer is Cloud Connector, not ZCC — see [`../cloud-connector/azure-deployment.md`](../cloud-connector/azure-deployment.md).

## Single-session is a hard product limit

ZCC does not support multiple simultaneous user sessions from one host OS. (*Zscaler & Azure Traffic Forwarding Deployment Guide v1.2*, Jan 2022: "only single session is supported for the Zscaler Client Connector. Multisession is not supported.")

| AVD / Windows 365 mode | ZCC supported? |
|---|---|
| Windows 365 Cloud PC (one user per Cloud PC) | ✅ Yes — has dedicated Zscaler help article |
| AVD personal / dedicated host pools (single-session) | ✅ Yes |
| AVD pooled (Windows Enterprise multi-session) | ❌ No — explicit product limit |

**Workarounds for multi-session pooled AVD** (per the same deployment guide):
- PAC file
- Site-to-Site IPsec via Azure VPN Gateway
- SD-WAN NVA in the Azure routing VNet → Zscaler

## Required Azure Fabric IP bypasses

Azure VMs depend on link-local Fabric IPs for platform health, DHCP, DNS resolution, and instance metadata. ZCC tunnel mode (especially Z-Tunnel 2.0) intercepts everything by default — these MUST be excluded:

| IP | What it serves | Where to bypass |
|---|---|---|
| `168.63.129.16` | Azure Fabric — DHCP, DNS, health probes, Guest Agent | **VPN Gateway Bypass** in ZCC App Profile |
| `169.254.169.254` | Azure Instance Metadata Service (IMDS) | **VPN Gateway Bypass** |

**IMDS migration (Microsoft-side change)**: after **July 1, 2025**, `168.63.129.16` no longer serves IMDS — `169.254.169.254` becomes the canonical IMDS-only endpoint. Existing bypass rules that listed only `168.63.129.16` will need updating for IMDS purposes. (`168.63.129.16` still serves health probes + DHCP, so don't remove it — just ensure `169.254.169.254` is also present.) Source: [Microsoft Learn — Azure Virtual Desktop required URLs](https://learn.microsoft.com/en-us/azure/virtual-desktop/azurecommunicationips).

Without these bypasses, Cloud PC health monitoring breaks, IMDS queries fail (which breaks Managed Identity-dependent workloads on the same VM), and Azure Guest Agent communications stall.

## Z-Tunnel 1.0 vs 2.0 for AVD/Windows 365 RDP

The two tunnel modes have very different bypass mechanics for the AVD RDP traffic:

| Mode | RDP bypass approach | Why |
|---|---|---|
| **Z-Tunnel 1.0** (HTTP CONNECT) | PAC file entry: `*.wvd.microsoft.com` | Z-Tunnel 1.0 doesn't tunnel UDP; PAC + URL bypass works |
| **Z-Tunnel 2.0** (DTLS packet tunnel) | IP-based bypass in App Profile Destination Exclusions or VPN Gateway Bypass | Z-Tunnel 2.0 captures UDP 3478 (RDP TURN) and non-443 TCP; PAC bypasses don't apply to UDP |

For a Z-Tunnel 2.0 deployment without bypass, RDP fails — UDP 3478 gets tunneled, host can't reach the AVD gateway over the optimized media path, and the session degrades to TCP fallback (slower).

## Predefined Windows 365 + AVD bypass (ZCC 4.3.2+)

ZCC 4.3.2 (released February 2025) added a **predefined "Windows 365 & Azure Virtual Desktop" application bypass** — a single-click configuration covering the relevant RDP TCP 443 ranges, UDP 3478 TURN, and KMS TCP 1688 endpoints. This replaces the pre-4.3.2 reality of manually managing roughly 385 gateway IPs.

**The Azure Fabric IPs (`168.63.129.16`, `169.254.169.254`) are NOT included in the predefined bypass** — they still need manual addition. The predefined bypass covers RDP traffic; Fabric IPs are platform-level and out of scope for it.

## Common failure modes (Tier A)

- **Multi-session AVD ZCC install** — looks like it works during install, fails at runtime when the second user signs in. Hard product limit, not a config bug.
- **No Fabric IP bypass** — Cloud PC health monitoring fails or flaps; Managed Identity tokens unobtainable; Guest Agent extension provisioning fails.
- **Z-Tunnel 2.0 without IP-based RDP bypass** — RDP session establishes via TCP fallback but media degrades; UDP 3478 traffic gets tunneled and dropped.
- **Pre-4.3.2 manual bypass list drift** — Azure rotates RDP gateway IPs roughly monthly; manually maintained App Profile lists go stale unless automated.
- **Forgetting IMDS migration** — bypass rules listing only `168.63.129.16` for IMDS purposes will break Managed Identity workloads on the same VM after July 1, 2025.

## What this doc does NOT cover (Tier D — verify before claiming)

- **Trusted network detection in Azure VMs** — Azure VMs have no SSID, fixed Azure-DHCP IP, no predictable corporate DNS server. The viable TrustedNetwork criteria reduce to `trusted_egress_ips` (if a stable NAT IP exists) or `trusted_subnets` (if VNet address space is known). **No Zscaler doc covers Azure-VM TrustedNetwork construction.** See [`./trusted-networks.md`](./trusted-networks.md) for the cross-cutting TrustedNetwork model.
- **Boot / startup ordering** — ZCC vs Azure Guest Agent vs Network Watcher Extension. No documented dependency configuration.
- **Azure NAT Gateway with multiple public IPs + Z-Tunnel 2.0 single-IP NAT requirement** — structural risk if NAT GW selects egress IP per-flow rather than per-device. Not addressed in any Zscaler doc.
- **Accelerated Networking + DTLS MTU interaction** — no source. Lab data needed.
- **Ephemeral AVD personal host ZCC enrollment lifecycle** — likely accumulates orphaned device records similar to the Cloud Connector VMSS orphan pattern, but not documented for ZCC.
- **Azure VPN Gateway coexistence on the session host** — Zscaler's VPN-Trusted Network detection looks for a VPN adapter on the host; an Azure VPN Gateway is a network-level construct without a host-side adapter, so VPN-Trust criteria don't fire that way.

## Cross-links

- ZCC Z-Tunnel mode reference: [`./z-tunnel.md`](./z-tunnel.md)
- ZCC Trusted Networks model: [`./trusted-networks.md`](./trusted-networks.md)
- ZCC Forwarding Profile (where bypasses are configured): [`./forwarding-profile.md`](./forwarding-profile.md)
- The other "Zscaler in Azure" deployment shape (Cloud Connector): [`../cloud-connector/azure-deployment.md`](../cloud-connector/azure-deployment.md)
