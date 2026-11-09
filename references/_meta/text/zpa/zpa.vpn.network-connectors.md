# Network Connectors and Network Connector groups (VPN for Legacy Apps) (zpa.vpn.network-connectors)

Network Connectors build a secure VPN tunnel that connects applications to VPN Service Edges, as part of a Network Connector group. [zpa.vpn.network-connectors:what-it-is] The About Network Connector Groups page says each Network Connector is mapped to one Network Connector group. [zpa.vpn.network-connectors:group-membership] How many Network Connectors a group can hold differs between the help pages [divergence:zpa.vpn.network-connectors:connectors-per-group]. The prerequisites article says it is critical that the Network Connector is always available and running or there will not be any traffic, and that a Network Connector fronts the subnets configured in Network segments. Subnets can be mapped to the same Network Connector, but they must be reachable to each other. The About Network Connector Groups page says the Network Connector must be up and running for its group to be active. [zpa.vpn.network-connectors:availability-critical] The About Network Connectors page says Network Connectors can only be deployed with RHEL 9 in the RPM format for Linux. [zpa.vpn.network-connectors:linux-only] The platforms the other pages list do not all fit that statement [divergence:zpa.vpn.network-connectors:linux-only-platforms].

**The Network Connectors table.** The Network Connectors table does not list Network Connectors that were added but not deployed. OAuth-enabled Network Connectors are added with a name format of GroupName-UserCode-TimeStamp. [zpa.vpn.network-connectors:table] A Network Connector's details include Host OS (the run-time OS), Package OS (the compile-time OS on which the RPM binary is packaged), the Public Service Edge it connects to, Connection Health (Connected or Disconnected), and whether the default OS Secure Shell setting is overridden and enabled or disabled. Disconnected Network Connectors show the last known public and private IP addresses, and uptime is shown as Not Available. [zpa.vpn.network-connectors:details] The Network Connectors table shows each connector's Manager Version, Software Version and Version Profile. [zpa.vpn.network-connectors:versions] Automated OS security updates are only available for prebuilt Network Connector images on RHEL 9.x; Network Connectors installed manually with an RPM file on a custom RHEL 9.x build are not supported. An OS update's status is Scheduled, Not Scheduled, In Progress, Success or Failure. [zpa.vpn.network-connectors:os-updates]

**Editing a connector.** On a deployed Network Connector the name can be edited, and it cannot contain special characters except periods, hyphens and underscores. The status can also be edited, to enable or disable the Network Connector. [zpa.vpn.network-connectors:edit]

**Network Connector groups.** A Network Connector group takes a Signing Certificate, which Private Access uses to sign certificates it issues to the Network Connector and which authenticates the connector to the Private Access cloud. It also takes a Network Connector Location (where the group's connectors are physically deployed), Persist Local Version Profile (disabled by default), a Version Profile (inherited from customer-level configuration) and a Network Connector Software Update Schedule set by selecting the day of the week and start time, which Zscaler recommends scheduling during off-peak hours. The Edit page allows any field to be edited. [zpa.vpn.network-connectors:group-fields] A Network Connector group's details show Redundant Mode, which the About Network Connector Groups page describes as indicating if additional Network Connectors operate on standby to handle traffic. The same page lists Network Settings, to view the network settings for the group. [zpa.vpn.network-connectors:group-redundant-mode] What Redundant Mode means differs between the help pages [divergence:zpa.vpn.network-connectors:redundant-mode-meaning]. The ZPA release summary for October 13, 2026 has an entry, Network Settings Configuration for Private Service Edges, Private Cloud Controllers, and Network Connectors, which says admins can configure settings to perform remote commands that enable SSH on the OS and update software settings across Private Access virtual machines such as AWS, Azure and GCP. [zpa.vpn.network-connectors:network-settings-release] Which fields the Network Settings view holds is not listed on one page [gap:zpa.vpn.network-connectors:group-network-settings].

**Limits.** The per-tenant limits on connectors and groups are tracked in [ZPA VPN (for Legacy Apps): what it is, its components and where each question goes](kb:zpa.vpn).

What to check:
1. Before saying how many Network Connectors a group can have, give both positions rather than one: a single connector per group, or redundant connectors within a group.
2. Before describing what a group's Redundant Mode does, give both the standby description and the ECMP load balancing description.

Sources disagree (name both sides):
- The About Network Connectors page says Network Connectors can only be deployed with RHEL 9 in RPM format, while the platform and deployment pages list a VMware OVA and cloud marketplace images. [divergence:zpa.vpn.network-connectors:linux-only-platforms]
  - zscaler-help: About Network Connectors: only RHEL 9 in the RPM format for Linux.
  - zscaler-help: Network Connector Software by Platform: a VMware OVA and AWS and Azure marketplace entries (GCP is listed too).
  - zscaler-help: VMware deployment guide: how to deploy a Network Connector on a VMware platform.
  - zscaler-help: AWS deployment guide: Network Connectors are deployed in the customer's VPCs.
  Impact: The pages do not say whether the RPM-only sentence means the RPM is the only package format on top of the images, or is outdated; an answer about supported packaging should give both.
- The help pages disagree on whether a Network Connector group holds a single Network Connector or several. [divergence:zpa.vpn.network-connectors:connectors-per-group]
  - zscaler-help: About Network Connectors: a single Network Connector per Network Connector group.
  - zscaler-help: Replacing or Migrating Network Connectors: redundant Network Connectors are supported within a Network Connector group.
  - zscaler-help: Configuring BGP for VPN Service Edges: on a Network Connector failure, traffic is rerouted to another Network Connector within the same Network Connector group.
  Impact: A design with more than one Network Connector in a group is allowed by two pages and ruled out by the first. None of the pages says whether they describe the design before and after redundancy support, so the pages do not say which governs.
- The help pages describe Redundant Mode, and the redundancy that Network Connectors provide, in two different ways: standby connectors, or ECMP load balancing. [divergence:zpa.vpn.network-connectors:redundant-mode-meaning]
  - zscaler-help: About Network Connector Groups: Redundant Mode indicates if additional Network Connectors operate on standby to handle traffic.
  - zscaler-help: VPN Redundancy Deployment Guide: with BGP, the network scales with ECMP to load balance traffic to the Network Connectors from the VPN Service Edges.
  Impact: Standby connectors and load-balanced connectors behave differently under normal traffic. The pages do not say whether the group's Redundant Mode field refers to the standby description, the ECMP load balancing, or both.

Not known (open gaps):
- Network Settings fields of a Network Connector group [gap:zpa.vpn.network-connectors:group-network-settings]: settled by source-read or lab-test

Area: zpa.vpn, its subjects in references/_meta/spine/zpa/zpa.vpn.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.vpn.md (ZPA VPN (for Legacy Apps): what it is, its components and where each question goes)
