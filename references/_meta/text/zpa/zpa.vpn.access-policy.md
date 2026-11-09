# VPN access policy rules: source, destination, default block, rule order and limits (zpa.vpn.access-policy)
Also called: vpn access policy; vpn policy rules; vpn for legacy apps access policy; specific-match principle

VPN access policy rules enable allowing or blocking network traffic on VPN Service Edges. For the source, rules can be based on user identity by configuring client IP pools that are mapped to identity provider (IdP) attributes; for the destination, IP address objects can group CIDR blocks, IP addresses and FQDNs for use in multiple policy rules. [zpa.vpn.access-policy:what-it-is] The application access policy is a different rule set: [ZPA policy evaluation](kb:zpa.policy).

**Evaluation.** VPN (for Legacy Apps) evaluates access policy rules using a top-down, specific-match principle. Traffic that doesn't match any access policy rule is blocked by default, so a new deployment must create a policy rule to allow traffic through the VPN tunnel. [zpa.vpn.access-policy:evaluation-and-default] The first-match rule order of the application access policy is in [Access policy rule order](kb:zpa.policy.access-rule-order); the VPN page's term is open [gap:zpa.vpn.access-policy:specific-match-undefined]. Rule Order is the policy evaluation order number for the rule, and it can be changed by clicking the number and manually entering a new value. [zpa.vpn.access-policy:rule-order]

**Limits.** VPN (for Legacy Apps) supports a maximum of 1,000 policy rules. [zpa.vpn.access-policy:rule-limit]

**Writing a rule.** For Source Networks, a rule takes either up to 64 IP addresses or IP subnets, which can be imported with Import LAN/Client Subnets or Address Book, or IdP attributes: a single attribute or multiple attributes from the same IdP, or a combination spanning different IdPs, which can be imported with Import IdP Attribute Object. For Destination Networks, the page lists IP addresses, where up to 64 IP addresses or IP subnets can be entered and Import LAN/Client Subnets or Address Book defines destinations from a predefined list, and it also lists IdP Attributes under Destination Networks (see the divergence idp-as-destination). [zpa.vpn.access-policy:source-destination] Whether IdP attributes can also be a destination differs between the pages [divergence:zpa.vpn.access-policy:idp-as-destination]. A rule takes an IP protocol (Protocols), an action of Allow, which allows access to the network, or Block, which blocks access to it, a name that cannot contain special characters except periods, hyphens and underscores, and a Rule Status of Enabled or Disabled. The rule table shows Source Ports and Destination Ports. [zpa.vpn.access-policy:rule-fields] The protocol choices are open [gap:zpa.vpn.access-policy:protocol-choices].

The reusable objects are in [VPN access policy objects: IP address objects and IdP attribute objects](kb:zpa.vpn.policy-objects), the users in [VPN user enablement rules: who may open a VPN tunnel](kb:zpa.vpn.user-enablement), the segments in [VPN network segments: LAN subnets or FQDNs assigned to Network Connector groups](kb:zpa.vpn.network-segments), the traffic counted per rule in [VPN Connected Users and the VPN Diagnostics pages: user logs, traffic flow logs and access policy data](kb:zpa.vpn.diagnostics) and the hub is [ZPA VPN (for Legacy Apps): what it is, its components and where each question goes](kb:zpa.vpn).

What to check:
1. Whether a new deployment has a rule that allows traffic through the VPN tunnel, since traffic that matches no rule is blocked by default.
2. Whether an answer that puts IdP attributes in a destination rests on the pages that disagree.

Sources disagree (name both sides):
- The About page gives IdP attributes for the source and IP address objects for the destination; the Configuring page lists IdP Attributes under both Source Networks and Destination Networks. [divergence:zpa.vpn.access-policy:idp-as-destination]
  - zscaler-help: User identity through IdP attributes is given for the source; the destination text names IP address objects.
  - zscaler-help: The Configuring page repeats the IdP attribute text under Destination Networks.
  Impact: Whether IdP attributes can be a destination is unconfirmed; the About page's destination guidance does not mention them.

Not known (open gaps):
- What the top-down, specific-match principle means for VPN access policy [gap:zpa.vpn.access-policy:specific-match-undefined]: settled by lab-test or support-ticket
- Which IP protocols a VPN access policy rule can select [gap:zpa.vpn.access-policy:protocol-choices]: settled by tenant-data or lab-test

Area: zpa.vpn, its subjects in references/_meta/spine/zpa/zpa.vpn.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.policy.md (ZPA policy evaluation)
- links-to references/_meta/text/zpa/zpa.policy.access-rule-order.md (Access policy rule order)
- links-to references/_meta/text/zpa/zpa.vpn.md (ZPA VPN (for Legacy Apps): what it is, its components and where each question goes)
- links-to references/_meta/text/zpa/zpa.vpn.diagnostics.md (VPN Connected Users and the VPN Diagnostics pages: user logs, traffic flow logs and access policy data)
- links-to references/_meta/text/zpa/zpa.vpn.network-segments.md (VPN network segments: LAN subnets or FQDNs assigned to Network Connector groups)
- links-to references/_meta/text/zpa/zpa.vpn.policy-objects.md (VPN access policy objects: IP address objects and IdP attribute objects)
- links-to references/_meta/text/zpa/zpa.vpn.user-enablement.md (VPN user enablement rules: who may open a VPN tunnel)
