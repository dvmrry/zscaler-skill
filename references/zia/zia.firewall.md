When traffic is blocked and no URL Filtering rule explains it, Firewall Control is one place to look. It handles flows at the IP and port level, ahead of the web policies: see [[zia.firewall.traffic-path]]. Malware Protection and Advanced Threat Protection are covered in [[zia.malware-protection]] and [[zia.atp]].

{{four-policies}}
- **Which firewall policy touched this flow, and in what order?** [[zia.firewall.traffic-path]] covers where the firewall module sits relative to the web module and what the logs show. [[zia.firewall.rule-order]] covers order and admin rank.
- **What can a rule match and what can it do?** [[zia.firewall.criteria]] and [[zia.firewall.actions]]. Building blocks that rules reference are in [[zia.firewall.destination-groups]] and [[zia.firewall.network-services]].
- **Is this feature even available, and how many can I have?** [[zia.firewall.licensing]] and [[zia.firewall.limits]].
- **NAT Control and IPS Control.** [[zia.firewall.nat]] and [[zia.firewall.ips]].
- **DNS Control.** It has its own subjects: [[zia.dns-control]], with DNS over HTTPS in [[zia.dns-control.doh]].
- **How Terraform and the SDKs treat these rules.** Provider behavior is not repeated here: see [[zia.terraform.rule-order]], [[zia.terraform.delete-detach]] and [[zia.terraform.field-fidelity]].

{{per-location}} {{default-ports}} Treatment of traffic on a non-default port is open {{gap:custom-port-handling}}.

**FTP Control.** {{ftp-sits-in-firewall}} {{ftp-default}} {{ftp-passive-only}} {{ftp-url-filtering-precedence}} The settings are described in [[zia.ftp-control]].
