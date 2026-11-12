# Static IPs: when one is needed, provisioning, region mapping, CSV import and limits (zia.traffic-forwarding.static-ips)
Also called: static ip; static ip address; self-provision static ip; static ip csv import; static ip region; staticIP

A static IP is the address a site registers with the service before it can build a GRE tunnel or an IP-based VPN credential. Static IP addresses must be provisioned for the organization to create a GRE tunnel or to add a VPN credential (only for IP-based PSK); IP-based PSK is required for devices that do not support an FQDN-based PSK. A static IP can be self-provisioned in the Admin Console or provisioned by Zscaler Support. [zia.traffic-forwarding.static-ips:when-required]

**What the page shows.** The Static IP page shows, for each address, its City, Managed By (whether the address is managed by self or a specific Zscaler partner) and Last Modified By (the username of the admin who last modified it). [zia.traffic-forwarding.static-ips:page-fields]

**Region.** When self-provisioning a static IP, the Region tab offers Automatic, which auto-discovers the region and coordinates from the IP address, or Manual, which takes the coordinates or the region; selecting a city autofills the latitude and longitude. The Static IP Address field cannot be modified when editing an existing configuration. [zia.traffic-forwarding.static-ips:region-mapping]

**Bulk import.** A CSV file can add, edit or delete multiple static IP addresses. Its columns include Action (+ or - to add or delete), Publicly Routable (true or false), IP Region (the region or city to map the address to) and Managed By (self or a specific Zscaler partner). Override Existing Entries is selected to update existing static IP addresses, including deleting existing ones or adding new ones; adding an address that already exists without it makes the service display an error message. [zia.traffic-forwarding.static-ips:csv-import] What Publicly Routable false changes and which partner values Managed By takes are open [gap:zia.traffic-forwarding.static-ips:routable-and-partner].

**Limits.** The limits table gives Static IP Address Entries per Organization as 100 IP address entries by default, with Zscaler Support able to raise the limit, and Imported Static IPs per CSV file as 3,000 entries. [zia.traffic-forwarding.static-ips:limits] The import article states the count differently [divergence:zia.traffic-forwarding.static-ips:import-count]. The tunnel that uses the address is [GRE tunnels to ZIA: requirements, bandwidth and deployment](kb:zia.traffic-forwarding.gre) and the credential is [VPN credentials for IPSec: types, immutability and keys](kb:zia.traffic-forwarding.vpn-credentials).

Sources disagree (name both sides):
- The CSV import article says an import can add up to 3,000 static IP addresses; the limits table gives 100 entries per organization by default and 3,000 only as the per-CSV-file figure. [divergence:zia.traffic-forwarding.static-ips:import-count]
  - zscaler-help: You can add up to 3,000 static IP addresses.
  - zscaler-help: Static IP Address Entries per Organization are 100 IP address entries by default, and Support can increase the limit.
  Impact: An import of more than 100 addresses fits one reading and exceeds the other; the pages do not say whether the 3,000 figure is a per-file ceiling that still sits under the per-organization limit.

Not known (open gaps):
- What Publicly Routable false changes, and which Managed By partner values exist [gap:zia.traffic-forwarding.static-ips:routable-and-partner]: settled by source-read or support-ticket

Area: zia.traffic-forwarding, its subjects in references/_meta/spine/zia/zia.traffic-forwarding.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.authentication.surrogate-ip.md (Surrogate IP: mapping a private IP to an authenticated user), from zia.traffic-forwarding: Surrogate IP requires one IP per user as the service sees it, so NAT cannot be used: all users behind it look like one address. Supported forwarding is a GRE or IPSec tunnel without NAT, forward proxy chaining with XFF forwarding turned on for the location or sublocation, or a dedicated proxy port, and Enforce Authentication must be on for the location or sublocation. [zia.authentication.surrogate-ip:no-nat]
- interacts-with references/_meta/text/zia/zia.firewall.traffic-path.md (Where the firewall sits in the traffic path), from zia.traffic-forwarding: For Z-Tunnel 1.0 and PAC traffic, the firewall must be enabled in Advanced Settings for this type of traffic: the option is Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors. [zia.firewall.traffic-path:ztunnel-pac-opt-in]
- interacts-with references/_meta/text/zia/zia.forwarding-control.md (ZIA Forwarding Control and Source IP Anchoring), from zia.traffic-forwarding: Forwarding Control policy forwards selected Zscaler traffic to specific endpoints: directly, through a third-party proxy service, through a Zscaler-assigned dedicated IP address or GeoIP address, or to a Private Access App Connector through a Private Access gateway. [zia.forwarding-control:overview]
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.traffic-forwarding: A location identifies a network from which the organization sends internet traffic; the service checks whether arriving traffic comes from a configured (known) location or an unknown one (remote user traffic), and processes known-location traffic by the location's settings. [zia.locations.model:identifies-networks]
- interacts-with references/_meta/text/zia/zia.proxy-mode.md (ZIA proxy modes: explicit and transparent), from zia.traffic-forwarding: Proxy mode is not a setting an admin turns on: it follows from how the traffic arrives (a configured browser versus a redirected flow), and one forwarding method can carry either mode. [zia.proxy-mode.forwarding-map:not-a-setting]
- links-to references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment)
- links-to references/_meta/text/zia/zia.traffic-forwarding.vpn-credentials.md (VPN credentials for IPSec: types, immutability and keys)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/static-ips.md (config type)
- see-also references/_meta/text/zia/zia.traffic-forwarding.md (How traffic reaches ZIA)
- see-also references/_meta/text/zia/zia.terraform.traffic-forwarding-resources.md (Terraform GRE tunnel, static IP, VPN credential and location resources)
