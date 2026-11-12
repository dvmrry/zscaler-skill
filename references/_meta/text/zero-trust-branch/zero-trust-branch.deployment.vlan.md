# How Zero Trust Branch VLANs are configured: zones, DHCP granularity, management interfaces and IP reservation (zero-trust-branch.deployment.vlan)
Also called: ztb vlan; ztb ip address reservation

A VLAN is assigned to a LAN Zone (LAN-side interface with endpoints), Management Zone (management-side interface) or WAN Zone (WAN-side interface). [zero-trust-branch.deployment.vlan:vlan-zones] By default VLANs are created in the staged state and each must be enabled to be configured into the branch appliances or VMs. [zero-trust-branch.deployment.vlan:vlan-staged-default] The deployment hub is [How a Zero Trust Branch appliance is deployed: activation, ZTP, virtual machines, mainland China, upgrades and admin roles](kb:zero-trust-branch.deployment).

**VLAN settings.** With Use DHCP, Granularity Device (/32) assigns /32 masks so each device is in a network of one (for full isolation), while Network assigns the original subnet mask to all endpoints on the VLAN. [zero-trust-branch.deployment.vlan:vlan-granularity] Use Micro-subnets allocates an additional range for statically configured devices; the Micro-subnet Prefix can be /30, /29, /28 or /27. [zero-trust-branch.deployment.vlan:vlan-micro-subnets] IGMP querier (IGMPv2 or IGMPv3) lets the appliance send periodic IGMP Query messages to maintain multicast group membership in the VLAN, and is supported only on appliances running version 8.1.2 or later; per-VLAN DHCP profiles are likewise supported only on 8.1.2 or later. [zero-trust-branch.deployment.vlan:vlan-igmp-8-1-2] Only one VLAN per site can be designated for DNS proxy use, which is needed when an upstream DNS server requires a fixed internal source IP and is reached via a Routed Tunnel; selecting another VLAN clears the previous one. [zero-trust-branch.deployment.vlan:vlan-dns-proxy]

**Management and WAN zones.** The VLAN page's Interface for Appliance options for a management-zone VLAN are lo0 (in-band management within the main routing domain) and ge3 (out-of-band management through a separate management VRF); a gateway must be configured on the management interface to reach Zero Trust Branch through it from any network, and SNMP monitoring over Private Access reaches only active appliances. [zero-trust-branch.deployment.vlan:vlan-management-interfaces] The port that ge3 names differs by model [divergence:zero-trust-branch.deployment.vlan:management-port-ge3]. For a WAN-zone VLAN, an optional Virtual IP can be set if the upstream router requires a consistent return address for reverse routing. [zero-trust-branch.deployment.vlan:vlan-wan-virtual-ip] The VLAN configuration procedure tells you to shut down the SVI/VLAN interface on the existing L2/L3 switch, router or firewall and add a return route for the VLAN with the Zero Trust Branch WAN Virtual IP address as nexthop; the activation-issues page says devices that get an IP address and ping the default gateway cannot reach the internet when the upstream firewall or router has no return route to the VLAN with the appliance WAN virtual IP as nexthop. [zero-trust-branch.deployment.vlan:vlan-svi-return-route]

**IP reservation.** IP address reservation is supported only when the VLAN has Zero Trust Branch as its DHCP server, so a reserved asset receives the same IP address on lease renewals. [zero-trust-branch.deployment.vlan:ip-reservation-scope] Reservations are loaded by Import Endpoint CSV mapping MAC addresses to IP addresses; upon discovery the asset's MAC address is matched against the CSV to assign the reserved IP. [zero-trust-branch.deployment.vlan:ip-reservation-csv] To reserve the IP of an already discovered asset, the asset must be in a VLAN with DHCP enabled and the reserved-IP CSV must have been uploaded; setting Assignment Type to Reserved adds its current IP and MAC to the DHCP reserved list. [zero-trust-branch.deployment.vlan:ip-reservation-discovered]

What to check:
1. Whether the VLAN is still in the staged state and has been enabled, since VLANs are created staged by default.
2. Whether Zero Trust Branch is the DHCP server for the VLAN before expecting an IP reservation to apply.

Sources disagree (name both sides):
- The VLAN page offers ge3 as the dedicated physical management interface without naming models, while the port mapping puts Management on GE1 for the ZT400, ZT600 and ZT8010 and on GE3 for the ZT800. [divergence:zero-trust-branch.deployment.vlan:management-port-ge3]
  - zscaler-help: ge3 (Management) is a dedicated physical interface for out-of-band management through a separate management VRF.
  - zscaler-help: On the ZT400 the Management port is GE1 and GE3 is a WAN port.
  Impact: Choosing ge3 (Management) on a ZT400, ZT600 or ZT8010 does not match the physical management port in the port mapping.

Area: zero-trust-branch.deployment, its subjects in references/_meta/spine/zero-trust-branch/zero-trust-branch.deployment.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zero-trust-branch/zero-trust-branch.deployment.md (How a Zero Trust Branch appliance is deployed: activation, ZTP, virtual machines, mainland China, upgrades and admin roles)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zero-trust-branch/zero-trust-branch.deployment.templates-and-sites.md (How Zero Trust Branch templates and sites are configured: deployment types, DNS, DHCP, routing and App Connectors)
- see-also references/_meta/text/zero-trust-branch/zero-trust-branch.deployment.high-availability.md (How Zero Trust Branch high availability works: standard HA, Enhanced WAN Edge HA, VRRP and ebond bonding interfaces)
