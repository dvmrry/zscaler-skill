---
product: zero-trust-branch
topic: overview
title: "Zero Trust Branch — SD-WAN with zero trust device segmentation for branch/factory"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/ztb-what-zero-trust-branch.md"
author-status: draft
---

# Zero Trust Branch — SD-WAN with zero trust device segmentation for branch/factory

## What it is

Zero Trust Branch (ZTB) combines SD-WAN (Software-Defined Wide Area Networking) with agentless device segmentation, designed for branch offices, factory floors, and data centers. It replaces traditional site-to-site VPNs and east-west firewall infrastructure while applying ZIA/ZPA policies to all branch traffic forwarded to the Zscaler Zero Trust Exchange (ZTE) (Tier A — vendor/zscaler-help/ztb-what-zero-trust-branch.md).

The key differentiator is the **"network-of-one"** device segmentation model: every device on the branch network is automatically isolated with its own /32 subnet, eliminating lateral movement between devices without requiring NAC or east-west firewall hardware.

## Core components

| Component | Role |
|---|---|
| **Zero Trust Branch appliance** | Physical or virtual device deployed at the branch site. Terminates ISP connections, manages multi-link forwarding, enforces device segmentation. |
| **Zscaler Admin Console (SaaS)** | Centralized cloud management portal for all ZTB appliances. No on-premises management infrastructure required. |

## Appliance form factors

- **Physical appliances**: ZT800 series. Wall and rack mount options. Zero Touch Provisioning (ZTP) supported.
- **Virtual machine**: VMware ESXi deployment.

The help portal documents hardware usage guidelines, physical port mapping, and a wall/rack mount instruction manual — ZTB is a hardware product with physical deployment considerations.

## Traffic model

All branch traffic flows to ZTE via the ZTB appliance:

```
Branch devices
    → Zero Trust Branch appliance (default gateway, /32 per device)
    → ZTE cloud (ZIA policies for internet traffic, ZPA policies for private app traffic)
    → Internet / Private apps
```

Traffic never traverses the LAN between devices without going through the ZTB appliance first. This is the architectural basis for lateral movement prevention — there is no direct device-to-device path.

## Device segmentation — "network-of-one"

- ZTB automatically discovers and classifies devices on the network (based on traffic profiles)
- Each device is provisioned with a /32 subnet mask via DHCP proxy or static IP automation
- Devices within the same VLAN must communicate via the ZTB gateway — not directly with each other
- Applies to IoT, OT, IoMT, headless devices, and legacy systems — no agent required on endpoints

This enables segmentation of shadow IoT devices that cannot run security agents.

## OT/IoT specific capabilities

- Clientless browser-based access to OT assets via SSH, RDP, and VNC
- Automatic device classification based on traffic profile
- SD-WAN with direct-to-cloud for IoT/OT telemetry
- Applicable to: manufacturing, utilities, healthcare, retail (POS/kiosks), logistics

## Deployment modes

- **Zero Touch Provisioning (ZTP)**: Appliance ships pre-configured; plug in and it self-provisions by calling back to Admin Console.
- **Manual deployment**: ZT800 without ZTP (older firmware or specific scenarios).
- **Virtual machine**: VMware ESXi for software-only deployments.

## Zero Trust Provisioning (ZTP) process

Appliance deployed → connects to internet via ISP → calls back to Zscaler → downloads configuration from Admin Console → operational. Minimizes on-site IT involvement for branch deployments.

## Advanced networking features

- **Bonding Interfaces (Ebond)**: Multi-WAN link aggregation for redundancy and load balancing
- **Micro-Subnets**: Sub-VLAN segmentation constructs for fine-grained isolation beyond per-device /32
- **VLAN default gateway takeover**: ZTB assumes DHCP proxy role and default gateway role for each configured VLAN

## Policy enforcement

Traffic is subject to:
- **ZIA policies**: For internet-bound and SaaS-bound traffic
- **ZPA policies**: For private application access
- **Forwarding policies**: Granular rules for internet vs. non-internet traffic at the ZTB level

## What it is not

- Not a standalone SD-WAN product. ZTB requires ZTE (ZIA/ZPA) subscription — the cloud security enforcement layer is not optional.
- Not a campus LAN solution. Designed for branch/factory/data-center edge, not large enterprise LAN environments.
- Not a traditional firewall. Replaces the need for east-west firewalls at the branch, but relies on ZTE for internet egress inspection rather than a local firewall.

## API surface

ZTB is managed via the Zscaler Admin Console (SaaS portal). A separate ZTB API was not documented in available sources. Configuration, monitoring, and provisioning appear to be portal-driven. The SaaS-based management console is the primary operational surface.

## Common questions

- **"What is Zero Trust Branch?"** → An SD-WAN and device segmentation product for branch offices, factories, and data centers. It routes branch traffic through the Zscaler ZTE for ZIA/ZPA policy enforcement while providing agentless per-device isolation on the LAN.
- **"Does Zero Trust Branch replace SD-WAN?"** → It replaces traditional site-to-site VPNs and overlay routing. It provides SD-WAN capabilities (multi-link management, direct-to-cloud forwarding) but is not a general-purpose enterprise SD-WAN. It is designed for simplicity and zero trust, not full network feature parity with enterprise SD-WAN products.
- **"Does Zero Trust Branch require ZIA/ZPA?"** → Yes. ZTB forwards traffic to the ZTE; without ZIA/ZPA, there is no cloud-based policy enforcement point. ZTB is not a standalone product.
- **"How does device segmentation work without NAC?"** → ZTB assigns every device a /32 subnet and acts as the default gateway for all VLANs. All inter-device traffic must pass through the ZTB appliance, which enforces policy. No separate NAC system required.
- **"Can Zero Trust Branch handle OT/IoT devices?"** → Yes — this is a primary use case. Device classification is automatic based on traffic profiles. Clientless browser-based access to SSH/RDP/VNC is available for OT assets. No agent required on OT/IoT devices.
- **"What is Zero Touch Provisioning (ZTP)?"** → A deployment method where the appliance self-provisions by contacting the Zscaler Admin Console. No on-site IT technician needed to configure the device — plug it in, it connects to internet, downloads its configuration.

## Typical deployment scenario

A manufacturing site with 50 IoT sensors, 10 OT machines, 20 employee workstations, and one ZTB appliance:

1. ZTB appliance deployed as the default gateway for all VLANs
2. All devices (sensors, OT, workstations) get /32 subnet masks via DHCP proxy
3. Devices communicate with the internet → traffic goes: device → ZTB → ZTE (ZIA) → internet
4. Devices access private apps → traffic goes: device → ZTB → ZTE (ZPA) → private app
5. Sensor A tries to talk directly to Sensor B on the same VLAN → blocked; traffic must traverse ZTB first
6. IoT device classification happens automatically based on traffic profile (no agent)
7. Admin manages all sites via the central Zscaler Admin Console (SaaS)

## Cross-links

- ZIA (applies internet and SaaS policies to ZTB-forwarded traffic): [`../zia/index.md`](../zia/index.md)
- ZPA (applies private access policies to ZTB-forwarded traffic): [`../zpa/index.md`](../zpa/index.md)
- Cloud Connector (alternative for cloud workload connectivity; different use case): [`../cloud-connector/index.md`](../cloud-connector/index.md)
- Portfolio map: [`../_portfolio-map.md`](../_portfolio-map.md)
