# ZIA Virtual Service Edge (zia.virtual-service-edge)
Also called: virtual service edge; vse; vzen; virtual zen; zia vse; vse cluster; software service edge

A Virtual Service Edge (VSE) is the software form factor of an on-premises Service Edge. Questions about it split cleanly, and the answers differ by platform, so establish the platform first.

1. **Where can it run, and what version?** The platform list, which platforms can cluster, and the image requirements: [Where a Virtual Service Edge runs and which platforms can cluster](kb:zia.virtual-service-edge.platforms). Per-cloud deployment on Azure, AWS and GCP: [Deploying a Virtual Service Edge on Azure, AWS (with or without GWLB) and GCP](kb:zia.virtual-service-edge.cloud-deployment). The install sequence on the VM: [The Virtual Service Edge install sequence on the VM: image, certificate, network, build and verification](kb:zia.virtual-service-edge.bring-up).
2. **How much can one VM do?** Throughput, SSL connections per second, memory and the SSL card: [How much a Virtual Service Edge VM can do](kb:zia.virtual-service-edge.sizing).
3. **What is a cluster, and what does one need?** Size limits, licensing, the cluster object, binding to a Location: [The Virtual Service Edge cluster: limits, object, build order and Location binding](kb:zia.virtual-service-edge.clusters). How traffic is spread and how the cluster fails over: [How a Virtual Service Edge cluster spreads and returns traffic](kb:zia.virtual-service-edge.load-balancing).
4. **What does the network have to provide?** [Addresses, interfaces, outbound connectivity and ports for a Virtual Service Edge](kb:zia.virtual-service-edge.network-requirements). Sending traffic to it: [Sending traffic to a Virtual Service Edge: GRE, PAC, L2 redirect, home users and Kerberos host names](kb:zia.virtual-service-edge.forwarding).
5. **Who runs it day to day?** Upgrades, who can see it, logging and hardening: [How Virtual Service Edges and their clusters upgrade](kb:zia.virtual-service-edge.upgrades), [Who runs a Virtual Service Edge: access, logging, hardening and monitoring](kb:zia.virtual-service-edge.operations). The vzen command line: [The vzen command line for configuring and troubleshooting a Virtual Service Edge](kb:zia.virtual-service-edge.troubleshooting).
6. **What does it not do, and how is it automated?** [What a Virtual Service Edge does not support](kb:zia.virtual-service-edge.limits), [The vZEN API: Virtual Service Edge clusters and nodes](kb:zia.virtual-service-edge.api-surface).

The hardware form factor is a different operating model with different limits: [ZIA Private Service Edge](kb:zia.private-service-edge). A Virtual Service Edge is sized as a single VM of up to 600 Mbps total throughput, while the hardware Private Service Edge is sized per cluster design (Private Service Edge 3 for 1 Gbps download, Private Service Edge 5 for 2 Gbps download), so the hardware sizing figures do not carry over to a Virtual Service Edge. [zia.virtual-service-edge:hardware-sizing-differs]

Inferred, not quoted (say so when an answer rests on one):
- [zia.virtual-service-edge:hardware-sizing-differs] Tier B: Compares the two sizing bases as the pages state them. Covers sizing only; whether the operating assumptions also differ is not claimed here.

Area: zia.virtual-service-edge, its subjects in references/_meta/spine/zia/zia.virtual-service-edge.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding): For production, a Virtual Service Edge is deployed in a cluster. A cluster requires at least two Virtual Service Edges for active-active redundancy and load balancing, which provides N+1 redundancy for production. [zia.virtual-service-edge.clusters:production-needs-cluster]
- depends-on references/_meta/text/zia/zia.virtual-service-edge.platforms.md (Where a Virtual Service Edge runs and which platforms can cluster): Virtual Service Edges are supported on VMware ESX/ESXi, Microsoft Azure, AWS EC2, Microsoft Hyper-V and Google Cloud Platform. [zia.virtual-service-edge.platforms:supported-platforms]
- interacts-with references/_meta/text/zia/zia.forwarding-control.sipa.md (Source IP Anchoring: what it needs on each side): The Source IP Anchoring feature is not supported with Virtual Service Edges. [zia.virtual-service-edge.limits:no-sipa]
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it): A Virtual Service Edge cluster, or a standalone Virtual Service Edge, is bound to a Location so the organization can enable authentication, firewall, SSL/TLS inspection and location-level policies; the service associates the traffic the Virtual Service Edge receives with that Location and applies its policies. [zia.virtual-service-edge.clusters:bind-to-location]
- links-to references/_meta/text/zia/zia.private-service-edge.md (ZIA Private Service Edge)
- links-to references/_meta/text/zia/zia.virtual-service-edge.api-surface.md (The vZEN API: Virtual Service Edge clusters and nodes)
- links-to references/_meta/text/zia/zia.virtual-service-edge.bring-up.md (The Virtual Service Edge install sequence on the VM: image, certificate, network, build and verification)
- links-to references/_meta/text/zia/zia.virtual-service-edge.cloud-deployment.md (Deploying a Virtual Service Edge on Azure, AWS (with or without GWLB) and GCP)
- links-to references/_meta/text/zia/zia.virtual-service-edge.forwarding.md (Sending traffic to a Virtual Service Edge: GRE, PAC, L2 redirect, home users and Kerberos host names)
- links-to references/_meta/text/zia/zia.virtual-service-edge.limits.md (What a Virtual Service Edge does not support)
- links-to references/_meta/text/zia/zia.virtual-service-edge.load-balancing.md (How a Virtual Service Edge cluster spreads and returns traffic)
- links-to references/_meta/text/zia/zia.virtual-service-edge.network-requirements.md (Addresses, interfaces, outbound connectivity and ports for a Virtual Service Edge)
- links-to references/_meta/text/zia/zia.virtual-service-edge.operations.md (Who runs a Virtual Service Edge: access, logging, hardening and monitoring)
- links-to references/_meta/text/zia/zia.virtual-service-edge.sizing.md (How much a Virtual Service Edge VM can do)
- links-to references/_meta/text/zia/zia.virtual-service-edge.troubleshooting.md (The vzen command line for configuring and troubleshooting a Virtual Service Edge)
- links-to references/_meta/text/zia/zia.virtual-service-edge.upgrades.md (How Virtual Service Edges and their clusters upgrade)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/vzen-clusters.md (config type)
- configured-via references/_meta/text/types/zia/vzen-nodes.md (config type)
