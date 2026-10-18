When traffic is blocked and no URL Filtering rule explains it, the cause is often Firewall Control. It handles flows at the IP and port level and signature-based intrusion prevention, ahead of the web policies that read decoded web content. Malware Protection and Advanced Threat Protection are the third place to look; they are not covered here.

{{four-policies}} They are not one rule list. Each is a separate surface, and the questions an agent asks about them are split the same way:

- **Which firewall policy touched this flow, and in what order?** [[zia.firewall.traffic-path]] covers where the firewall module sits relative to the web module and what the logs show. [[zia.firewall.rule-order]] covers order and admin rank.
- **What can a rule match and what can it do?** [[zia.firewall.criteria]] and [[zia.firewall.actions]]. Building blocks that rules reference are in [[zia.firewall.destination-groups]] and [[zia.firewall.network-services]].
- **Is this feature even available, and how many can I have?** [[zia.firewall.licensing]] and [[zia.firewall.limits]].
- **NAT Control and IPS Control.** [[zia.firewall.nat]] and [[zia.firewall.ips]].
- **DNS Control.** It is one of the policies but has its own subjects. Start at [[zia.dns-control]]; DNS over HTTPS is in [[zia.dns-control.doh]]. This area keeps nothing of DNS Control beyond the fact that it is a separate policy.
- **How Terraform and the SDKs treat these rules.** Provider behavior is not repeated here: see [[zia.terraform.rule-order]], [[zia.terraform.delete-detach]] and [[zia.terraform.field-fidelity]].

Two settings gate everything else. {{per-location}} And the ports matter: {{default-ports}} What the service does with traffic on a non-default port is not stated by the sources; see the gap below.

**FTP Control** is the fifth surface in the firewall section. {{ftp-sits-in-firewall}} {{ftp-default}} {{ftp-passive-only}} {{ftp-url-filtering-precedence}} The actions and scoping of FTP Control rules are not in the captures; see the gap.

What to check: whether the location has the firewall enabled at all, whether the tenant is licensed for the criterion the rule needs, and whether the traffic is on a port the service treats as HTTP, DNS or FTP.
