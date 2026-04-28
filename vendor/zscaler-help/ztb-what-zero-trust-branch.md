# What Is Zero Trust Branch?

**Source:** https://help.zscaler.com/zero-trust-branch/what-zero-trust-branch
**Captured:** 2026-04-28 via Playwright MCP

---

Zscaler's Zero Trust Branch revolutionizes how you connect, and it protects your branches, factories, and data centers by combining high-performance Software-Defined Wide Area Network (SD-WAN) capabilities with advanced device segmentation. This unified solution eliminates the complexity and overhead of traditional virtual private networks (VPNs) and overlay routing, enabling secure, direct-to-cloud access and robust east-west security through a single, integrated platform.

Zero Trust Branch leverages the power of the Zscaler Zero Trust Exchange (ZTE) and integrated Zero Trust Branch appliances deployed at your sites, establishing secure inbound and outbound networking without the need for additional firewall appliances. It directly terminates ISP connections and manages traffic forwarding across multiple links for maximum availability and resiliency. Cloud and branch traffic is securely forwarded directly to the ZTE, where Internet & SaaS (ZIA) and Private Access (ZPA) policies are applied based on traffic destination and user identity, ensuring comprehensive security inspection and granular access control for all communications, and eliminating lateral threat movement between branches and to the internet and cloud applications.

Zero Trust Branch extends the principles of zero trust into your internal network with agentless device segmentation. The "network-of-one" technology automatically discovers, classifies, and isolates each device, including Internet of Things (IoT), Operational Technology (OT), Internet of Medical Things (IoMT), headless devices, and legacy systems connected to your branch or factory network. This architecture eliminates lateral threat movement within the site without the cost and complexity associated with legacy segmentation approaches like east-west firewalls and network access control (NAC).

## Key Features and Benefits

- Enables zero trust everywhere for all users, devices, servers, and IoT/OT, regardless of location or cloud.
- Improves application performance by replacing complex site-to-site VPNs with a simple, direct-to-cloud architecture.
- Minimizes the internet attack surface by placing private applications behind the ZTE.
- Prevents lateral threat movement by connecting directly to applications, not the network.
- Enables organizations to discover and classify shadow IoT devices with automatic device classification based on traffic profiles.
- Simplifies secure access to OT resources with clientless, browser-based access to SSH, RDP, and VNC ports on OT assets.
- Enforces finely grained forwarding policies for internet and non-internet traffic using ZIA or ZPA.
- Introduces plug-and-play deployment with Zero Touch Provisioning (ZTP).
- When enabled, the Zero Trust Branch gateway assumes the role of default gateway for VLANs and auto-provisions every endpoint with a /32 subnet mask.

# Deployment Overview

**Source:** https://help.zscaler.com/zero-trust-branch/deployment-overview
**Captured:** 2026-04-28 via Playwright MCP

---

## Two Components

1. **Zero Trust Branch appliances**: Provide forwarding and network enforcement points deployed in the customer environments. Physical and virtual options available depending on throughput and scale requirements.
2. **Zscaler Admin Console**: Centralized SaaS management portal used to manage Zero Trust Branch appliances.

## Deployment Options

- **Zero Trust Provisioning (ZTP)**: Zero-touch provisioning method
- **VMware ESXi**: Virtual machine deployment
- **Zscaler ZT800**: Physical appliance (specific version for non-ZTP deployment)

## Appliance Models Referenced

- ZT800 series (physical)
- Virtual machine form factor (VMware ESXi)

## Key Concepts

- **Micro-Subnets**: Network segmentation construct
- **Bonding Interfaces (Ebond)**: Link aggregation/multi-WAN
- **SaaS-based management**: Admin console is cloud-hosted
- **East-west control**: Intra- and inter-VLAN traffic visibility and control
- **Autonomous grouping**: Automatic device classification
- **Adaptive policy constructs**: Automated incident response policies
