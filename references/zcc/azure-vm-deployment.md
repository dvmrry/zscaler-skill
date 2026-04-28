---
product: zcc
topic: "azure-vm-deployment"
title: "ZCC inside Azure VMs — AVD, Windows 365 Cloud PCs, single-session limits, and machine tunnels"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: mixed
sources:
  - "https://help.zscaler.com/zscaler-client-connector/configuring-zscaler-client-connector-microsoft-365-cloud-pcs"
  - "https://help.zscaler.com/downloads/zscaler-technology-partners/cloud/zscaler-and-azure-traffic-forwarding-deployment-guide/Zscaler-Azure-Traffic-Forwarding-Deployment-Guide-FINAL.pdf"
  - "https://learn.microsoft.com/en-us/azure/virtual-desktop/azurecommunicationips"
  - "vendor/zscaler-help/about-z-tunnel-1.0-z-tunnel-2.0.md"
  - "vendor/zscaler-help/about-machine-tunnels.md"
  - "vendor/zscaler-help/about-machine-groups.md"
author-status: draft
---

# ZCC inside Azure VMs — AVD, Windows 365 Cloud PCs, single-session limits, and machine tunnels

This document covers two related but distinct scenarios:

1. **ZCC as an endpoint agent inside Azure VMs** — typically Azure Virtual Desktop (AVD) session hosts or Windows 365 Cloud PCs, where an end user is the session owner.
2. **ZCC machine tunnel for headless/server Azure VMs** — where no user is logged in but the VM needs ZIA/ZPA connectivity before or independent of user login.

Both are distinct from [Cloud Connector on Azure](../cloud-connector/azure-deployment.md), which is the workload-traffic-forwarding VM appliance for server/container traffic. That is a completely different product.

---

## Disambiguation upfront

**No Azure Marketplace VM image for ZCC exists.** The Marketplace lists Cloud Connector, ZPA App Connector, ZIA Service Edge VMs, and a "Zscaler for Users" billing entitlement — none of these is a deployable ZCC VM. ZCC is always installed *into* an existing VM via Intune, baked into a custom image, or via MSI silent install. When operators say "ZCC on Azure VM," they mean ZCC inside an AVD session host or a Windows 365 Cloud PC.

**For forwarding cloud-workload traffic** (servers, containers, no end-user session): the answer is Cloud Connector, not ZCC. See [`../cloud-connector/azure-deployment.md`](../cloud-connector/azure-deployment.md).

---

## Single-session is a hard product limit

ZCC does not support multiple simultaneous user sessions from one host OS. (*Zscaler & Azure Traffic Forwarding Deployment Guide v1.2*, Jan 2022: "only single session is supported for the Zscaler Client Connector. Multisession is not supported.")

| AVD / Windows 365 mode | ZCC supported? |
|---|---|
| Windows 365 Cloud PC (one user per Cloud PC) | Yes — has dedicated Zscaler help article |
| AVD personal / dedicated host pools (single-session) | Yes |
| AVD pooled (Windows Enterprise multi-session) | No — explicit product limit |

**Workarounds for multi-session pooled AVD** (per the same deployment guide):
- PAC file
- Site-to-Site IPsec via Azure VPN Gateway
- SD-WAN NVA in the Azure routing VNet → Zscaler

---

## Required Azure Fabric IP bypasses

Azure VMs depend on link-local Fabric IPs for platform health, DHCP, DNS resolution, and instance metadata. ZCC tunnel mode (especially Z-Tunnel 2.0) intercepts everything by default — these MUST be excluded:

| IP | What it serves | Where to bypass |
|---|---|---|
| `168.63.129.16` | Azure Fabric — DHCP, DNS, health probes, Guest Agent | VPN Gateway Bypass in ZCC App Profile |
| `169.254.169.254` | Azure Instance Metadata Service (IMDS) | VPN Gateway Bypass |

**IMDS migration (Microsoft-side change)**: after **July 1, 2025**, `168.63.129.16` no longer serves IMDS — `169.254.169.254` becomes the canonical IMDS-only endpoint. Existing bypass rules that listed only `168.63.129.16` will need updating for IMDS purposes. (`168.63.129.16` still serves health probes and DHCP, so do not remove it — ensure `169.254.169.254` is also present.) Source: [Microsoft Learn — Azure Virtual Desktop required URLs](https://learn.microsoft.com/en-us/azure/virtual-desktop/azurecommunicationips).

Without these bypasses: Cloud PC health monitoring breaks, IMDS queries fail (which breaks Managed Identity-dependent workloads on the same VM), and Azure Guest Agent communications stall.

---

## Z-Tunnel 1.0 vs 2.0 for AVD/Windows 365 RDP

| Mode | RDP bypass approach | Why |
|---|---|---|
| **Z-Tunnel 1.0** (HTTP CONNECT) | PAC file entry: `*.wvd.microsoft.com` | Z-Tunnel 1.0 doesn't tunnel UDP; PAC + URL bypass works |
| **Z-Tunnel 2.0** (DTLS packet tunnel) | IP-based bypass in App Profile Destination Exclusions or VPN Gateway Bypass | Z-Tunnel 2.0 captures UDP 3478 (RDP TURN) and non-443 TCP; PAC bypasses don't apply to UDP |

For a Z-Tunnel 2.0 deployment without bypass, RDP fails — UDP 3478 gets tunneled, the host can't reach the AVD gateway over the optimized media path, and the session degrades to TCP fallback (slower).

---

## Predefined Windows 365 + AVD bypass (ZCC 4.3.2+)

ZCC 4.3.2 (released February 2025) added a predefined "Windows 365 & Azure Virtual Desktop" application bypass — a single-click configuration covering the relevant RDP TCP 443 ranges, UDP 3478 TURN, and KMS TCP 1688 endpoints. This replaces the pre-4.3.2 reality of manually managing roughly 385 gateway IPs.

**The Azure Fabric IPs (`168.63.129.16`, `169.254.169.254`) are NOT included in the predefined bypass** — they still need manual addition. The predefined bypass covers RDP traffic; Fabric IPs are platform-level and out of scope for it.

---

## Machine tunnels — the pre-login ZPA tunnel for Azure VMs

### What machine tunnels are

A machine tunnel allows a Windows or macOS device to establish a ZPA connection **before the user logs in to Zscaler Client Connector**. The tunnel authenticates using the device's identity (certificate-based machine authentication), not the user's credentials. This matters for Azure VMs that need access to:

- Active Directory / domain controllers (for Group Policy and login scripts to work)
- Internal DNS servers
- Internal management endpoints

Without machine tunnel, a VM joining an Azure AD-joined or hybrid-joined environment may not be able to reach domain controllers during the Windows boot/login phase because ZPA is not yet up (no user is logged in yet) (Tier A — vendor/zscaler-help/about-machine-tunnels.md).

### Platform support

Machine tunnels support **Windows and macOS only**. They are not supported on iOS, Linux, Android, or Android on ChromeOS (Tier A — vendor/zscaler-help/about-machine-tunnels.md).

### Machine tunnel authentication

Machine tunnels use device-level authentication — the machine authenticates to ZPA using a machine provisioning key and device certificate, independently of any user identity. Key points:

- No user credential is required or used.
- ZPA Machine Authentication (IdP-based) can optionally be enabled in App Profiles to require users to authenticate against their IdP before the machine tunnel starts. WebView2 authentication is not supported for Machine Tunnels.
- macOS machine tunnel support requires contacting Zscaler Support to enable the feature (Tier A — vendor/zscaler-help/about-machine-tunnels.md).

### Machine tunnel states

The Machine Tunnel page (ZCC Portal > Enrolled Devices > Machine Tunnel) shows machines with the following statuses (Tier A — vendor/zscaler-help/about-machine-tunnels.md):

| Status | Meaning |
|---|---|
| Active | Machine tunnel is connected to ZPA before user login. Default/healthy state. |
| Inactive | Not connected. Causes: admin disabled it; device is off or disconnected; connection failed; authentication failed; feature not enabled via Zscaler Service Entitlement. |
| Removed | Machine tunnel config was deleted or deactivated from the ZCC portal. |
| Unregistered | Machine tunnel is no longer connected to Zscaler services or policies. |

---

## Machine groups — scoping machine tunnel policy in ZPA

### What machine groups are

A machine group is a named set of an organization's internal machines (local/Azure VM devices) that need to connect to ZPA Private Access. Machine groups are managed in the ZPA Admin Portal at Administration > Identity > Private Access > Machine Groups (Tier A — vendor/zscaler-help/about-machine-groups.md).

Machine groups provide two key capabilities:

1. **Associate ZCC with a machine group** — the machine provisioning key (generated per machine group) is embedded in the ZCC App Profile rule, enrolling devices into that group.
2. **Enable Machine Tunnels for Pre-Windows Login** — devices in a machine group can use machine tunnels to reach internal applications even when ZCC's user tunnel is not connected (Tier A — vendor/zscaler-help/about-machine-groups.md).

### Machine group design principles

Zscaler recommends deploying a **new machine group for every machine provisioning key**. This scoping allows:

- Different ZPA access policies for different machine populations (e.g., production servers vs. developer VMs vs. AVD session hosts).
- Key rotation without affecting all machines (rotate the key for one group without disrupting others).
- Audit separation in ZPA logs.

### Machine group → machine provisioning key → App Profile chain

```
ZPA Admin Portal: Machine Group
    └── generates Machine Provisioning Key
            └── embedded in ZCC App Profile rule (Windows or macOS platform sub-policy)
                    └── ZCC uses key to enroll device into the machine group
                            └── Machine tunnel authenticates using device identity for this group
```

The machine provisioning key must be present in the ZCC App Profile rule for successful Machine Tunnel enrollment. A machine tunnel that was once active may go Inactive after an App Profile update removes or changes the key.

---

## Entitlement gating for machine tunnels

Machine Tunnel is separately gated via `ZpaGroupEntitlements.machine_tun_enabled_for_all`. This is an all-or-nothing tenant-wide toggle at the entitlement layer:

- If `machine_tun_enabled_for_all = false`, no machine tunnels can activate regardless of App Profile keys or machine group configuration.
- If `machine_tun_enabled_for_all = true`, machine tunnels activate for devices with the correct App Profile key and machine group enrollment.

Per-group machine-tunnel entitlement gating is not surfaced in the `ZpaGroupEntitlements` model — only the tenant-wide toggle exists there. Fine-grained policy is enforced at the ZPA Access Policy level (machine group membership as a condition), not at the entitlement layer. See [`./entitlements.md`](./entitlements.md).

---

## SDK and Terraform objects

### ZCC Python SDK — device-side machine tunnel removal

From `vendor/zscaler-sdk-python/zscaler/zcc/devices.py` (Tier B — SDK/TF):

- `remove_machine_tunnel(query_params, **kwargs)` — removes the machine-tunnel component from a device record, leaving the user tunnel / ZCC install otherwise intact. Used to clean up stale or conflicting machine tunnel registrations without full device deregistration.

### ZCC entitlements SDK — machine tunnel toggle

From `vendor/zscaler-sdk-python/zscaler/zcc/entitlements.py` (Tier B — SDK/TF):

- `update_zpa_group_entitlement()` — sets `machineTunEnabledForAll` as part of the ZPA entitlement payload.

### ZPA Admin Portal — machine group management

Machine groups are managed in the ZPA portal, not the ZCC portal. There is no ZPA machine group resource in the available ZPA Python SDK (`vendor/zscaler-sdk-python/zscaler/zpa/`) based on available vendor sources. Machine group configuration is console-only or via the ZPA API. (Verify in your tenant before asserting — a ZPA machine groups API endpoint likely exists.)

---

## Common failure modes

- **Multi-session AVD ZCC install** — looks like it works during install, fails at runtime when the second user signs in. Hard product limit, not a config bug.
- **No Fabric IP bypass** — Cloud PC health monitoring fails or flaps; Managed Identity tokens unobtainable; Guest Agent extension provisioning fails.
- **Z-Tunnel 2.0 without IP-based RDP bypass** — RDP session establishes via TCP fallback but media degrades; UDP 3478 traffic gets tunneled and dropped.
- **Pre-4.3.2 manual bypass list drift** — Azure rotates RDP gateway IPs roughly monthly; manually maintained App Profile lists go stale unless automated.
- **IMDS migration gap** — bypass rules listing only `168.63.129.16` for IMDS purposes will break Managed Identity workloads on the same VM after July 1, 2025.
- **Machine provisioning key missing from App Profile** — machine tunnel never enrolls; device status stays Inactive. Check the App Profile rule for the Windows platform sub-policy and confirm the key is present.
- **`machine_tun_enabled_for_all = false`** — machine tunnels cannot activate tenant-wide. If machine tunnels were recently disabled (entitlement toggle turned off), all machine tunnels go Inactive until re-enabled.
- **macOS machine tunnel not enabled** — feature requires explicit enablement by Zscaler Support for macOS. Not self-service.
- **WebView2 not supported for machine tunnel auth** — if ZPA Machine Authentication is enabled in App Profiles, the IdP authentication flow must not rely on WebView2 (not supported for machine tunnel context).

---

## What this doc does NOT cover (Tier D — verify before claiming)

- **Trusted network detection in Azure VMs** — Azure VMs have no SSID, fixed Azure-DHCP IP, no predictable corporate DNS server. The viable TrustedNetwork criteria reduce to `trusted_egress_ips` (if a stable NAT IP exists) or `trusted_subnets` (if VNet address space is known). No Zscaler doc covers Azure-VM TrustedNetwork construction. See [`./trusted-networks.md`](./trusted-networks.md).
- **Boot / startup ordering** — ZCC vs Azure Guest Agent vs Network Watcher Extension. No documented dependency configuration.
- **Azure NAT Gateway with multiple public IPs + Z-Tunnel 2.0** — structural risk if NAT GW selects egress IP per-flow rather than per-device. Not addressed in any Zscaler doc.
- **Accelerated Networking + DTLS MTU interaction** — no source. Lab data needed.
- **Ephemeral AVD personal host ZCC enrollment lifecycle** — likely accumulates orphaned device records similar to the Cloud Connector VMSS orphan pattern, but not documented for ZCC.
- **Azure VPN Gateway coexistence on the session host** — Zscaler's VPN-Trusted Network detection looks for a VPN adapter on the host; an Azure VPN Gateway is a network-level construct without a host-side adapter, so VPN-Trust criteria don't fire that way.

---

## Cross-links

- ZCC Z-Tunnel mode reference — [`./z-tunnel.md`](./z-tunnel.md)
- ZCC Trusted Networks model — [`./trusted-networks.md`](./trusted-networks.md)
- ZCC Forwarding Profile (where bypasses are configured) — [`./forwarding-profile.md`](./forwarding-profile.md)
- Entitlements (machine tunnel entitlement toggle) — [`./entitlements.md`](./entitlements.md)
- Devices (machine tunnel removal API) — [`./devices.md`](./devices.md)
- The other "Zscaler in Azure" deployment shape (Cloud Connector) — [`../cloud-connector/azure-deployment.md`](../cloud-connector/azure-deployment.md)
