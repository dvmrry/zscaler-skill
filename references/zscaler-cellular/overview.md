---
product: zscaler-cellular
topic: overview
title: "Zscaler Cellular — zero trust security for cellular IoT and mobile devices"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/zscaler-cellular-marketing.md"
  - "vendor/zscaler-help/cellular-what-zscaler-cellular.md"
author-status: draft
---

# Zscaler Cellular — zero trust security for cellular IoT and mobile devices

## What it is

Zscaler Cellular extends Zscaler's Zero Trust Exchange (ZTE) to cellular-connected IoT and mobile endpoints — devices that use 4G/5G SIM cards for connectivity and cannot or do not run traditional software agents. It secures cellular traffic by routing it through the ZTE via Zscaler-managed SIM cards and a cellular edge infrastructure (Tier A — vendor/zscaler-help/cellular-what-zscaler-cellular.md).

GA as of August 2025. Positioned under "Zscaler Connectors" in the help portal nav, alongside Client Connector, Cloud & Branch Connector, and Zero Trust Branch.

## Two product components

| Component | What it is |
|---|---|
| **Zscaler SIM** | A data-only SIM card. When inserted into an IoT/mobile device, it routes cellular traffic to the nearest Cellular Edge rather than to the carrier's standard internet path. No software agent required on the device. |
| **Zscaler Cellular Edge** | An egress point in the Zscaler infrastructure that aggregates cellular traffic from Zscaler SIMs and forwards it to the ZTE for inspection and policy enforcement. |

## How traffic flows

```
IoT/Mobile device + Zscaler SIM
    → 4G/5G carrier network
    → Nearest Zscaler Cellular Edge
    → Zscaler Zero Trust Exchange (ZTE)
    → ZIA policies (internet traffic) or ZPA policies (private app traffic)
    → Internet / Private applications
```

Traffic is bidirectional — the Cellular Edge handles both outbound device-initiated and inbound server-initiated traffic.

## Policy constructs

Policies can be applied based on three cellular-specific identifiers:
- **IP address** — standard network-level identifier
- **IMEI** — hardware identifier for the device (tied to the physical device)
- **IMSI** — SIM identifier (tied to the SIM card, not the device)

IMSI and IMEI-based policy is a cellular-native capability not available in traditional Zscaler deployments (which are user/device certificate-based).

## Deployment models

Two deployment options per vendor sources (Tier B — vendor/zscaler-help/zscaler-cellular-marketing.md):

1. **Zscaler Cellular Service** — Plug-and-play, agentless security for cellular IoT devices (vending machines, EV chargers, kiosks). Zscaler manages the SIM and edge infrastructure.
2. **Zscaler Cellular Partner Service** — Partner-managed solution for SIM infrastructure integration, with high availability and failover. For carriers or managed service providers integrating Zscaler into their network.

## Supported use cases by industry

| Industry | Use cases |
|---|---|
| Critical infrastructure | Railway systems, power grids, OT connectivity |
| Industrial IoT | Asset tracking, energy sensors, connected machinery |
| Retail | POS systems, kiosks, inventory handheld scanners |
| Logistics/Transportation | Vehicle telemetry, track-and-trace, connected cabins |
| Automotive | Connected vehicles, EV charger networks |
| Government | Foreign deployments, secure communications |
| Healthcare | Connected medical devices (IoMT) |

## Admin capabilities

Administered via the Zscaler Cellular Admin Portal. Key operational surfaces:

| Feature | Description |
|---|---|
| SIM management | View SIM details, change status (active/inactive), change IMEI association, manage tags |
| eSIM management | Assign and activate eSIMs |
| Cellular Edge monitoring | View and monitor edge deployments, deploy new cellular edges |
| Network Events | View and analyze network events per SIM |
| Anomaly Detection | Built-in anomaly detection with configurable policies |
| Geofence policies | Geofence-based anomaly detection (e.g., SIM operating outside expected geography) |
| SIM Location Groups | Group SIMs by physical location for policy management |
| Dashboard | Centralized view of telemetry metrics, SIM activity, anomaly alerts |

## Global coverage

Marketing sources cite 520+ global carriers. The Zscaler Cellular solution is designed for global deployments with regional egress and multi-operator support.

## Relationship to ZIA and ZPA

Zscaler Cellular **integrates with existing ZIA and ZPA policies**. Traffic forwarded through the ZTE by Cellular Edge is subjected to the same ZIA URL filtering, threat protection, DLP, and ZPA access policies as any other Zscaler-forwarded traffic. Zscaler Cellular is not a standalone security product — it is a traffic forwarding mechanism that feeds into the existing ZTE policy engine.

This means organizations that already have ZIA/ZPA deployed can extend their existing policy framework to cellular-connected devices without re-defining policies.

## Key differentiators vs. traditional ZCC deployment

| Aspect | ZCC (traditional) | Zscaler Cellular |
|---|---|---|
| Agent required | Yes (ZCC app must run on device) | No — agentless |
| Device types | Managed endpoints (laptops, phones) | IoT, OT, headless, legacy devices |
| Connectivity | Wi-Fi, wired, or carrier | Cellular (4G/5G) only |
| Policy identifier | User identity + device certificate | IP, IMEI, or IMSI |
| Provisioning | MDM/app deployment | SIM provisioning (physical or eSIM) |

## API surface

No dedicated Zscaler Cellular API reference was found in available help portal sources. Configuration and monitoring via the Zscaler Cellular Admin Portal. Treat as portal-managed.

## Licensing and availability

GA August 2025. Listed under "Zscaler Connectors" in the help portal product navigation. Separate SKU from ZIA/ZPA. Specific pricing not publicly disclosed.

## Key operational notes

- Zscaler SIM is data-only — voice and SMS services are not provided.
- IMEI vs. IMSI policy: IMEI ties policy to the physical device hardware; IMSI ties policy to the SIM card. If a SIM is moved to a different device, IMSI-based policies follow the SIM; IMEI-based policies stay with the original device.
- Anomaly detection is built in and configurable — including geofence-based detection for SIMs operating in unexpected locations.

## What Zscaler Cellular is not

- Not a carrier (MVNO in the traditional sense). Zscaler partners with carriers; it manages the zero trust policy enforcement layer, not the cellular infrastructure.
- Not applicable to Wi-Fi-connected IoT. For Wi-Fi IoT, Cloud Connector or Zero Trust Branch are more appropriate.
- Not a replacement for ZCC on managed devices. ZCC provides richer user-identity-based policies and broader feature coverage for managed endpoints.

## Cross-links

- ZIA (policy enforcement for Cellular-forwarded internet traffic): [`../zia/index.md`](../zia/index.md)
- ZPA (private app access for Cellular-connected devices): [`../zpa/index.md`](../zpa/index.md)
- Zero Trust Branch (alternative for branch/factory IoT via appliance, not SIM): [`../zero-trust-branch/overview.md`](../zero-trust-branch/overview.md)
- Portfolio map: [`../_portfolio-map.md`](../_portfolio-map.md)
