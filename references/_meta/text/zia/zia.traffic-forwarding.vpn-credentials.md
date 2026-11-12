# VPN credentials for IPSec: types, immutability and keys (zia.traffic-forwarding.vpn-credentials)
Also called: vpn credentials; ufqdn; xauth; pre-shared key; vpncredentials api; ipsec credential type
Former IDs: shared-38

IPSec identity is a credential object with its own /vpnCredentials endpoint ([What a ZIA location is and what the console enforces for it](kb:zia.locations.model) lists it among the things a location holds). Tunnel behavior is in [IPSec tunnels to ZIA: limits, IKE and device settings](kb:zia.traffic-forwarding.ipsec).

**Types.** The API identifies a site-to-site IPSec peer by one of four credential types: CN (certificate common name), UFQDN (VPN user FQDN), IP (VPN IP address) or XAUTH. UFQDN and IP need a VPN_SITE_TO_SITE subscription, the CN type is created automatically when Zscaler provisions a CN, UFQDN is the most common, and the type cannot be changed after creation. [zia.traffic-forwarding.vpn-credentials:types] Zscaler no longer supports adding a new XAUTH VPN credential; existing ones can be edited or deleted. The console's Authentication Type choices for adding are FQDN and IP; each takes a pre-shared key. [zia.traffic-forwarding.vpn-credentials:xauth-legacy] The Python SDK accepts only IP and UFQDN when creating a credential and requires a pre-shared key; the four-value list (CN, IP, UFQDN, XAUTH) is the filter accepted when listing. [zia.traffic-forwarding.vpn-credentials:create-types]

What CN authentication involves is open [gap:zia.traffic-forwarding.vpn-credentials:cn-certificate-specifics].

**Addresses and keys.** An IP-type credential's address must already exist as a static IP; the console's drop-down lists only the static IPs provisioned for the organization, and Zscaler provisions them on request. [zia.traffic-forwarding.vpn-credentials:ip-from-static-ip] Neither the credential type nor, once set, its FQDN (UFQDN) or IP address (IP) can be changed on update: the Python SDK rejects the attempt, and the Terraform resource marks `type`, `fqdn` and `ip_address` ForceNew, so a change deletes and recreates the credential. [zia.traffic-forwarding.vpn-credentials:immutable] A pre-shared key is required for UFQDN and IP credentials; the Terraform resource marks it sensitive and forces replacement when it changes, and the data source's read-back is commented out. [zia.traffic-forwarding.vpn-credentials:psk-required] Whether the key can be read back from a live tenant is open [gap:zia.traffic-forwarding.vpn-credentials:psk-live-read].

**Scale.** Bulk delete takes at most 100 credentials per request; the Python SDK rejects a larger list before sending. [zia.traffic-forwarding.vpn-credentials:bulk-delete-100] A tenant can hold up to 16,000 VPN credentials, and the console can import or delete many at once from a CSV. [zia.traffic-forwarding.vpn-credentials:tenant-limit]

**CSV import.** A VPN credential CSV import takes up to 3,000 entries per file and can add and delete credentials of different authentication types in one file. VPN user IDs are converted to lowercase on import. Import Results should show nothing under Failed Records; if a credential was not properly added or deleted, the file must be re-imported. [zia.traffic-forwarding.vpn-credentials:csv-import] By CSV, an existing XAUTH VPN credential can be deleted (-) but a new one cannot be added (+). [zia.traffic-forwarding.vpn-credentials:csv-xauth] Each CSV row has Action (+ or -), PSK Type, VPN User Name (for FQDN, a valid user ID that does not end in a period, and whose special-character rule, including "@", is the divergence ufqdn-at-sign; for IP, the local gateway address sent to Zscaler beforehand), Comment (at most 10,240 characters) and Pre-Shared Key (or XAuth password, depending on the PSK Type). [zia.traffic-forwarding.vpn-credentials:csv-fields] Whether a UFQDN user ID may contain "@" differs between the CSV rule and its own example [divergence:zia.traffic-forwarding.vpn-credentials:ufqdn-at-sign]. Managed_By names the SD-WAN partner managing the credential, or is a comma when none manages it; the valid partner names listed include Cisco Viptela, Citrix SD-WAN, CloudGenix, HPE Aruba, Riverbed SteelConnect, Silver Peak and VMware VeloCloud. [zia.traffic-forwarding.vpn-credentials:csv-managed-by]

What to check:
1. Whether an IP credential's address is a provisioned static IP.
2. Whether the credential type and address are right at creation, since neither can be changed afterwards.

Sources disagree (name both sides):
- The CSV import rule says an FQDN user ID cannot include special characters such as "@", but the same page's example row and the Juniper SSG 20 guide use a user@domain form. [divergence:zia.traffic-forwarding.vpn-credentials:ufqdn-at-sign]
  - zscaler-help: An FQDN user ID must be valid and cannot include special characters such as <, @ or [] or end in a period.
  - zscaler-help: The example UFQDN row uses jane.doe@example.com as the user ID.
  - zscaler-help: The SSG 20 guide's example FQDN for the VPN credentials is example@safemarch.com.
  Impact: An import following the rule could not carry the user@domain form the examples use. The rule may mean the part before the "@", but the page does not say so.

Not known (open gaps):
- Whether a live tenant returns preSharedKey on GET /vpnCredentials [gap:zia.traffic-forwarding.vpn-credentials:psk-live-read] (data gap): filled by operator; settled by lab-test or tenant-data
- Certificate-based IPSec authentication through the CN credential [gap:zia.traffic-forwarding.vpn-credentials:cn-certificate-specifics]: settled by support-ticket

Area: zia.traffic-forwarding, its subjects in references/_meta/spine/zia/zia.traffic-forwarding.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it): A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- interacts-with references/_meta/text/zia/zia.authentication.surrogate-ip.md (Surrogate IP: mapping a private IP to an authenticated user), from zia.traffic-forwarding: Surrogate IP requires one IP per user as the service sees it, so NAT cannot be used: all users behind it look like one address. Supported forwarding is a GRE or IPSec tunnel without NAT, forward proxy chaining with XFF forwarding turned on for the location or sublocation, or a dedicated proxy port, and Enforce Authentication must be on for the location or sublocation. [zia.authentication.surrogate-ip:no-nat]
- interacts-with references/_meta/text/zia/zia.firewall.traffic-path.md (Where the firewall sits in the traffic path), from zia.traffic-forwarding: For Z-Tunnel 1.0 and PAC traffic, the firewall must be enabled in Advanced Settings for this type of traffic: the option is Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors. [zia.firewall.traffic-path:ztunnel-pac-opt-in]
- interacts-with references/_meta/text/zia/zia.forwarding-control.md (ZIA Forwarding Control and Source IP Anchoring), from zia.traffic-forwarding: Forwarding Control policy forwards selected Zscaler traffic to specific endpoints: directly, through a third-party proxy service, through a Zscaler-assigned dedicated IP address or GeoIP address, or to a Private Access App Connector through a Private Access gateway. [zia.forwarding-control:overview]
- interacts-with references/_meta/text/zia/zia.proxy-mode.md (ZIA proxy modes: explicit and transparent), from zia.traffic-forwarding: Proxy mode is not a setting an admin turns on: it follows from how the traffic arrives (a configured browser versus a redirected flow), and one forwarding method can carry either mode. [zia.proxy-mode.forwarding-map:not-a-setting]
- links-to references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zia/zia.terraform.traffic-forwarding-resources.md (Terraform GRE tunnel, static IP, VPN credential and location resources)
- see-also references/_meta/text/zia/zia.traffic-forwarding.md (How traffic reaches ZIA)
- see-also references/_meta/text/shared/shared.terraform.credential-handling.md (How the Zscaler Terraform providers store, log, and send secrets)
