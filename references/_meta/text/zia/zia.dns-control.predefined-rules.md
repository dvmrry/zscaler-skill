# Predefined DNS Control rules and the ZPA resolvers (zia.dns-control.predefined-rules)
Also called: ucaas one click rule; zpa resolver for locations; zpa resolver for road warrior; zpa resolver for extranet locations; predefined dns rules; sipa dns rule; road warrior dns rule order

Zscaler lists three predefined DNS rules: UCaaS One Click Rule (allows firewall traffic when any UCaaS application is enabled in Advanced Settings), ZPA Resolver for Locations (forwards location users' source-IP-anchored traffic to ZPA), and ZPA Resolver for the Road Warrior (does the same for remote users). With Extranet Application Support enabled, ZPA Resolver for Extranet Locations is added as a default rule. [zia.dns-control.predefined-rules:shipped-rules] The rule resource marks predefined rules with a boolean `predefined`. [zia.dns-control.predefined-rules:predefined-flag] Which set applies to a tenant is open [divergence:zia.dns-control.predefined-rules:rule-set]. The current console lists these predefined DNS rules: Unknown DNS Traffic, Default Firewall DNS Rule, Fallback ZPA Resolver for Locations, Fallback ZPA Resolver for Road Warrior, Critical Risk DNS Categories, Critical Risk DNS Tunnels, High-Risk DNS Categories, High-Risk DNS Tunnels, Risky DNS Categories and Risky DNS Tunnels. [zia.dns-control.predefined-rules:current-list] With Extranet Application Support enabled, a ZPA Resolver for Extranet Locations rule is added as a default rule, with a default IP pool for extranet traffic; Extranet Application Support is obtained through the Zscaler account team. [zia.dns-control.predefined-rules:extranet-rule]

The predefined rules can be disabled or modified, and Zscaler recommends keeping them at a high rule order (Rule 1 and Rule 2). [zia.dns-control.predefined-rules:modifiable-keep-high] Predefined DNS rules can be enabled or disabled but not deleted unless specified otherwise; rules with a system-defined default rule order cannot be reordered and always have the lowest precedence; for false positives, create higher-ranked custom rules or disable the rule. [zia.dns-control.predefined-rules:predefined-editing]

The two ZPA resolvers are the DNS half of Source IP Anchoring; the forwarding half is covered in the [Source IP Anchoring across ZIA and Private Access: path, pieces and interactions](kb:shared.source-ip-anchoring).

**The resolver rules.** For Source IP Anchoring, enable ZPA Resolver for Road Warrior for remote users and ZPA Resolver for Locations for location users. [zia.dns-control.predefined-rules:enable-each] The Road Warrior resolver rule should be a higher rule (lower number) than the Locations resolver rule; for example Road Warrior at rule 4 and Locations at rule 5 or later. [zia.dns-control.predefined-rules:road-warrior-above-locations] Zscaler does not recommend disabling ZPA Resolver for Road Warrior: road warrior traffic then falls under the Locations resolver rule instead of being blocked, is resolved from the Locations IP pools, and is not routed as intended. [zia.dns-control.predefined-rules:dont-disable-road-warrior] Client DNS requests for domain-based non-web traffic should be forwarded to the Zscaler service for the predefined ZPA DNS resolver policies to take effect. [zia.dns-control.predefined-rules:dns-must-reach-zscaler] Remote-user traffic is targeted by selecting the Road Warrior location in a rule; the Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors option in Advanced Settings must be enabled for policies configured for remote users to take effect, and rules for other locations also apply to remote users from those locations. [zia.dns-control.predefined-rules:road-warrior-location] The Fallback ZPA Resolver rules redirect source-IP-anchored traffic to the preconfigured IP pools during control plane maintenance; they are disabled by default, cannot be deleted, and are enabled only during that maintenance. [zia.dns-control.predefined-rules:fallback-resolvers]

What the resolver rules change in the DNS answer is open [gap:zia.dns-control.predefined-rules:resolver-mechanism]. Reordering rules through Terraform is in [How the ZIA Terraform provider applies rule order](kb:zia.terraform.rule-order). General DNS Control prerequisites are in [ZIA DNS Control](kb:zia.dns-control).

What to check:
1. Which predefined DNS rules the tenant's records hold, rather than assuming either published list.
2. Whether a predefined rule was changed, since predefined rules can be disabled or modified.
3. Whether both ZPA resolvers are enabled for the populations that use them.
4. Whether the Road Warrior resolver rule sits above the Locations resolver rule.
5. Whether Road Warrior is disabled, since its traffic then falls under the Locations resolver rule.
6. Whether client DNS for domain-based non-web traffic reaches Zscaler.
7. For remote users, whether the rule targets the Road Warrior location.
8. Whether the fallback resolver rules are enabled, which they are only during control-plane maintenance.

Sources disagree (name both sides):
- Which predefined DNS rules exist: three or ten [divergence:zia.dns-control.predefined-rules:rule-set]
  - zscaler-help: Three predefined rules: UCaaS One Click, ZPA Resolver for Locations, ZPA Resolver for the Road Warrior (page captured 2026-04-26; the Source IP Anchoring page, captured 2026-04-24, also names the non-fallback resolvers).
  - zscaler-help: A table of ten, including Unknown DNS Traffic, Default Firewall DNS Rule, Fallback ZPA Resolver rules and risk rules; it omits UCaaS One Click and the non-fallback resolvers (page captured 2026-10-18).
  Impact: Do not assume UCaaS One Click or the non-fallback ZPA resolvers exist on a tenant, or that the newer ten do. Read the tenant's rules with predefined true.

Not known (open gaps):
- What the ZPA resolver rules change in the DNS answer, and what happens without them [gap:zia.dns-control.predefined-rules:resolver-mechanism]: settled by lab-test or source-read. Blocks: explaining a wrong-source-IP symptom in SIPA to the DNS answer level

Area: zia.dns-control, its subjects in references/_meta/spine/zia/zia.dns-control.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.traffic-forwarding.methods.md (Forwarding methods Zscaler supports and how to choose): Client DNS requests for domain-based non-web traffic should be forwarded to the Zscaler service for the predefined ZPA DNS resolver policies to take effect. [zia.dns-control.predefined-rules:dns-must-reach-zscaler]
- depends-on references/_meta/text/shared/shared.source-ip-anchoring.md (Source IP Anchoring across ZIA and Private Access: path, pieces and interactions): For Source IP Anchoring, enable ZPA Resolver for Road Warrior for remote users and ZPA Resolver for Locations for location users. [zia.dns-control.predefined-rules:enable-each]
- decided-by references/_meta/text/zia/zia.dns-control.criteria.md (What a DNS Control rule can match on), from zia.dns-control: Rule conditions are grouped into categories (Who/Where/When, Source IP, Destination/Resolved IPs, DNS Application); categories combine with AND, and each category has its own AND/OR operators inside. [zia.dns-control.criteria:condition-logic]
- depends-on references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control), from zia.dns-control: DNS Control requires the firewall to be configured for locations, and a Firewall Filtering rule that allows DNS traffic (Network Services condition matches DNS). [zia.dns-control:firewall-prereq]
- logged-in references/_meta/text/zia/zia.logs.dns-outcome.md (What happened to a DNS query: rules, actions, response values and errors), from zia.dns-control: The DNS NSS feed gives separate rule and action fields for the request (reqrulelabel, reqaction) and for the response (resrulelabel, resaction), mapped in DNS Insights Logs to Request Rule Name, Request Action, Response Rule Name and Response Action. [zia.logs.dns-outcome:request-response-pairs]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many), from zia.dns-control: These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- logged-in references/_meta/text/types/zia/dns-log.md (ZIA DNS log (NSS DNS feed)), from zia.dns-control: The DNS NSS feed gives separate rule and action fields for the request (reqrulelabel, reqaction) and for the response (resrulelabel, resaction), mapped in DNS Insights Logs to Request Rule Name, Request Action, Response Rule Name and Response Action. [zia.logs.dns-outcome:request-response-pairs]
- links-to references/_meta/text/zia/zia.dns-control.md (ZIA DNS Control)
- links-to references/_meta/text/zia/zia.terraform.rule-order.md (How the ZIA Terraform provider applies rule order)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/firewall-dns-rules.md (config type)
- see-also references/_meta/text/zia/zia.dns-control.api-rules.md (DNS Control rule resource over the API)
