# Network settings for ZPA software component groups (zpa.software-components.network-settings)
Also called: edit network settings; split dns zone; network settings icon; operating system ssh setting; static routing connector group; tcp keepalive connector

Network settings are options a group applies to its software components.

**Where they are edited.** Network settings are edited per group by finding the group and clicking its Network Settings icon: App Connector groups under Private Access > Private Infrastructure > App Connector Groups, Private Service Edge groups under Private Access > Private Infrastructure > Private Service Edge Groups, Private Cloud Controller groups under Infrastructure > Business Continuity > Private Cloud Controller Groups, and Network Connector groups under Private Access > VPN (for Legacy Apps) > Network Connector Groups. [zpa.software-components.network-settings:per-group] Operating System SSH Setting enables or disables SSH on the host OS, and a following setting on the page only appears if Operating System SSH Setting is enabled. [zpa.software-components.network-settings:ssh]

**What can be added.** Add Settings offers one or more of these options: Domain Name System (DNS) Resolver (a Server IP address), Network Time Protocol (NTP) Servers, Static Routing (a destination CIDR, a Gateway and an Interface, which the page describes as the outgoing network interface for the Network Connector), Explicit Proxy (a Proxy Port and a Proxy Bypass list of destinations accessed directly), TCP Keepalive (Time, Interval and Probes) and Split DNS Zone. [zpa.software-components.network-settings:options] A Split DNS Zone has the fields Access Control IP Netblock (a DNS query from an IP address outside the block is not subject to the zone's rules), Interface, Snooping, DNSSEC Support, Forward Zone Name and Forward Address or Host Name. [zpa.software-components.network-settings:split-dns-fields]

**DNS.** Software components use DNS to discover applications and enumerate each IP address an application DNS name resolves to as a separately tracked and load-balanced server. During dynamic application discovery DNS is the initial reachability check from each component in a group; it is possible for components to function in partitioned environments where a subset of App Connectors can resolve a given DNS name without additional configuration, and components must also resolve external DNS names such as those of the Private Access cloud infrastructure. [zpa.software-components.network-settings:dns-role]

**On the component itself.** The Networking Deployed Software Components article scopes its console procedures: Configure DHCP IP Addressing applies to App Connector, Private Service Edge or Private Cloud Controller, Configure Static IP Addressing applies to all software components, Configure Additional Interfaces to App Connector or Private Service Edge, Configure a Proxy Bypass to App Connector, and Configure yum to Use an HTTP Proxy Server to App Connector or Private Service Edge. [zpa.software-components.network-settings:console-procedure-scope] The DHCP default and the proxy-bypass file are in [The App Connector Linux guide says that by default VM-based App Connectors, Private Service Edges and Private Cloud Controllers use DHCP networking on their primary interface; if DHCP is not available a static IP address can be configured on a VM-based App Connector, Private Service Edge, Private Cloud Controller or Network Connector, and a DNS resolver, NTP servers and static routing can be configured from the Admin Console.](kb:zpa.app-connectors.platforms:networking-defaults) and [The App Connector Linux guide says an App Connector configured to send traffic to a proxy can have a proxy bypass for traffic exempted from the proxy (traffic between the App Connector and the Public or Private Service Edges): entries in /opt/zscaler/var/proxy-bypass are IP addresses, subnets, domains or domains with a prefix wildcard, and zpa-connector is restarted with systemctl.](kb:zpa.app-connectors.platforms:proxy-bypass). Which options each component type supports is open [gap:zpa.software-components.network-settings:options-per-component].

The release that added remote network commands is in [The July 13, 2026 release summary lists network settings for App Connectors that can run remote commands to enable SSH on the OS and update software interface settings across Private Access virtual machines such as AWS, Azure, and GCP.](kb:zpa.app-connectors.deployment:network-settings-july13); the hub is [ZPA software components: Manager software, OAuth enrollment, network settings and STIG images](kb:zpa.software-components).

What to check:
1. Which group type the setting was edited on, since each of the four group types has its own page.
2. Whether the components can resolve the application names and the external Private Access cloud names.
3. Whether the console procedure used matches the component type, and which options a component type supports, which no source settles.

Not known (open gaps):
- Which network settings each component type supports, and their API or Terraform form [gap:zpa.software-components.network-settings:options-per-component]: settled by lab-test or source-read

Area: zpa.software-components, its subjects in references/_meta/spine/zpa/zpa.software-components.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.app-connectors.platforms.md (App Connector deployment by VM and cloud platform)
- links-to references/_meta/text/zpa/zpa.app-connectors.deployment.md (App Connector deployment, redundancy and limits)
- links-to references/_meta/text/zpa/zpa.software-components.md (ZPA software components: Manager software, OAuth enrollment, network settings and STIG images)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups)
