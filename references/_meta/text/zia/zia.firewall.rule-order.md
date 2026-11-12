# Firewall rule order, admin rank and predefined rules (zia.firewall.rule-order)
Also called: firewall rule precedence; ips rule order; nat rule order; default firewall rule; admin rank firewall; rule label view

Order and rank are described per policy. IPS and NAT Control state their order; how Firewall Filtering orders and ranks rules is open [gap:zia.firewall.rule-order:filtering-first-match].

**IPS Control.** IPS Control rules are evaluated in ascending numerical order of their rule order (Rule 1 before Rule 2). [zia.firewall.rule-order:ips-ascending-order] Admin rank determines the rule order that can be specified for an IPS rule. Rank can be configured if admin ranking is enabled in Advanced Settings, and the IPS Control page shows the Admin Rank column only then. [zia.firewall.rule-order:rank-bounds-order] To allow specific traffic past the default IPS rule, create rules of higher precedence, meaning a higher admin rank, than the default rule. [zia.firewall.rule-order:ips-allow-rules-need-precedence] The default rule is in [IPS Control](kb:zia.firewall.ips). The IPS Control page lists rules either by rule order or by rule label. [zia.firewall.rule-order:ips-views]

**NAT Control.** A NAT Control rule's order N means it is the N-th NAT Control rule of the same kind to be evaluated. [zia.firewall.rule-order:nat-order-nth] The NAT Control page lists each rule's Rule Order and, when admin ranking is enabled in Advanced Settings, its Admin Rank. [zia.firewall.rule-order:nat-page-rank-column] A NAT Control rule's order sets its position in the ascending order of evaluation used for all rules within the policy. If Admin Rank is enabled, the admin's assigned rank determines the rule order values that can be selected, rank runs 0 to 7 with 0 the highest, and a rule with a higher admin rank always precedes a rule with a lower one. [zia.firewall.rule-order:nat-order-and-rank] A new NAT Control rule's status is Disabled by default; a disabled rule is not actively enforced but does not lose its place in the rule order, and the service skips it and moves to the next rule. [zia.firewall.rule-order:nat-disabled-keeps-place] Rule details are in [NAT Control (destination NAT)](kb:zia.firewall.nat).

**Firewall Filtering.** Firewall Filtering policy rules are evaluated in ascending numerical order, and the Admin Rank column is visible only if admin ranking is enabled in Advanced Settings. [zia.firewall.rule-order:filtering-ascending-order] Whether Filtering stops at the first match and whether a disabled Filtering rule holds its slot are still open [gap:zia.firewall.rule-order:filtering-first-match]. URL Filtering's documented behavior is in [URL Filtering rule order and first match](kb:zia.url-filtering.rule-order).

**Predefined rules.** The Terraform provider refuses to delete five firewall filtering rules by name (Office 365 One Click Rule, UCaaS One Click Rule, Block All IPv6, Block malicious IPs and domains, Default Firewall Filtering Rule), and refuses any rule whose `predefined` flag is true. [zia.firewall.rule-order:predefined-rules-protected] Other Terraform ordering and delete behavior is in [How the ZIA Terraform provider applies rule order](kb:zia.terraform.rule-order) and [How the ZIA Terraform provider detaches references before deleting objects](kb:zia.terraform.delete-detach).

What to check:
1. Which order and rank the IPS rule holds, and whether admin ranking is enabled in Advanced Settings.
2. Whether the rule expected to win is a predefined rule, which the Terraform provider refuses to delete.
3. Whether URL Filtering's first-match behavior is being assumed for a Firewall Filtering rule, where it is not established.

Not known (open gaps):
- First-match and rank semantics for Firewall Filtering and NAT rules [gap:zia.firewall.rule-order:filtering-first-match]: settled by lab-test or support-ticket. Blocks: deterministic precedence answers for overlapping Filtering rules

Area: zia.firewall, its subjects in references/_meta/spine/zia/zia.firewall.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies), from zia.firewall: If a web policy allows a transaction but a conflicting firewall policy blocks it, the firewall policy applies: for example, Cloud App Control allowing Box.com does not help when the firewall blocks it. [zia.firewall.traffic-path:firewall-beats-web-allow]
- decided-by references/_meta/text/zia/zia.firewall.actions.md (Firewall rule actions), from zia.firewall: A Firewall Filtering rule's action is one of ALLOW, BLOCK_DROP, BLOCK_RESET, BLOCK_ICMP or EVAL_NWAPP. [zia.firewall.actions:filtering-action-values]
- decided-by references/_meta/text/zia/zia.firewall.criteria.md (Firewall Filtering rule criteria), from zia.firewall: An unset source IP list means the rule is not restricted to a specific source address, and unset destination countries mean it is not restricted to specific destination countries. [zia.firewall.criteria:unset-unrestricted]
- depends-on references/_meta/text/zia/zia.firewall.licensing.md (Which firewall features need Advanced Firewall), from zia.firewall: Configuring and applying firewall policies based on users, groups, departments or network applications requires Advanced Firewall. [zia.firewall.licensing:identity-and-apps-need-advanced]
- interacts-with references/_meta/text/zia/zia.firewall.traffic-path.md (Where the firewall sits in the traffic path), from zia.firewall: All web traffic is evaluated in the firewall module first, and only traffic that does not violate a firewall policy is forwarded to the web module. [zia.firewall.traffic-path:firewall-first]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group), from zia.firewall: URL Filtering, SSL Inspection, Cloud App Control, Firewall Filtering, Web DLP and Bandwidth Control rules each carry both a `locations` array and a `locationGroups` array, so a rule can name individual locations as well as groups. [zia.locations.rule-scoping:rules-take-both]
- logged-in references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names), from zia.firewall: The firewall action field is described as the action the service took on the transaction: Allowed or Blocked. [zia.logs.firewall-records:action-two-values]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many), from zia.firewall: These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover), from zia.firewall: For Z-Tunnel 1.0 and PAC traffic, the firewall must be enabled in Advanced Settings for this type of traffic: the option is Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors. [zia.firewall.traffic-path:ztunnel-pac-opt-in]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.firewall: If a web policy allows a transaction but a conflicting firewall policy blocks it, the firewall policy applies: for example, Cloud App Control allowing Box.com does not help when the firewall blocks it. [zia.firewall.traffic-path:firewall-beats-web-allow]
- logged-in references/_meta/text/types/zia/firewall-log.md (ZIA firewall log (NSS firewall feed)), from zia.firewall: The firewall action field is described as the action the service took on the transaction: Allowed or Blocked. [zia.logs.firewall-records:action-two-values]
- links-to references/_meta/text/zia/zia.firewall.ips.md (IPS Control)
- links-to references/_meta/text/zia/zia.firewall.nat.md (NAT Control (destination NAT))
- links-to references/_meta/text/zia/zia.terraform.delete-detach.md (How the ZIA Terraform provider detaches references before deleting objects)
- links-to references/_meta/text/zia/zia.terraform.rule-order.md (How the ZIA Terraform provider applies rule order)
- links-to references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/firewall-filtering-rules.md (config type)
- configured-via references/_meta/text/types/zia/ips-policies.md (config type)
- configured-via references/_meta/text/types/zia/nat-control-rules.md (config type)
- see-also references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control)
