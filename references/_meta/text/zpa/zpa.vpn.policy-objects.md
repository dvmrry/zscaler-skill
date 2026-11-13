# VPN access policy objects: IP address objects and IdP attribute objects (zpa.vpn.policy-objects)
Also called: ip address object; ip address objects; idp attribute object; idp attribute objects; address book; vpn address book

IP address objects are reusable components that organize network resources and, according to the About page, can contain IP addresses, CIDRs and FQDNs. A single-named object can be the source or destination criteria when configuring VPN access policies, and if an IP address changes only the object needs updating, so all policies that reference it are updated automatically. [zpa.vpn.policy-objects:ip-object] IdP attribute objects are reusable components that use SAML attributes and SCIM data sourced from the identity provider to define specific user populations. A named object can define the user identity criteria when configuring VPN access policies, and if the attributes defining a user group change only the object needs updating, so all policies that reference it are updated automatically. [zpa.vpn.policy-objects:idp-object]

**IP address objects.** The Configuring page says an IP address object groups and manages static IP addresses and subnets under a single name. It takes IP addresses, at most 64 IP addresses or IP subnets, which can be imported with Import LAN/Client Subnets, and a Name. [zpa.vpn.policy-objects:ip-object-fields] Whether an IP address object can hold FQDNs differs between the two pages [divergence:zpa.vpn.policy-objects:ip-object-fqdn].

**IdP attribute objects.** An IdP attribute object takes a Name and an optional Description. Creating an object for identity rules lets those rules be applied across multiple policies. [zpa.vpn.policy-objects:idp-object-fields]

The rules that use these objects are in [VPN access policy rules: source, destination, default block, rule order and limits](kb:zpa.vpn.access-policy) and the hub is [ZPA VPN (for Legacy Apps): what it is, its components and where each question goes](kb:zpa.vpn).

What to check:
1. Whether an answer that puts FQDNs in an IP address object rests on the pages that disagree.

Sources disagree (name both sides):
- The About page says IP address objects can contain FQDNs; the Configuring page describes them as grouping static IP addresses and subnets. [divergence:zpa.vpn.policy-objects:ip-object-fqdn]
  - zscaler-help: IP address objects can contain IP addresses, CIDRs and FQDNs.
  - zscaler-help: An IP address object groups static IP addresses and subnets under a single name; the sentence does not name FQDNs.
  Impact: Whether an FQDN can be entered in an IP address object is unconfirmed; the pages do not say which governs.

Area: zpa.vpn, its subjects in references/_meta/spine/zpa/zpa.vpn.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.vpn.md (ZPA VPN (for Legacy Apps): what it is, its components and where each question goes)
- links-to references/_meta/text/zpa/zpa.vpn.access-policy.md (VPN access policy rules: source, destination, default block, rule order and limits)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.vpn.user-enablement.md (VPN user enablement rules: who may open a VPN tunnel)
