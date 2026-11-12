# IP pools for Source IP Anchoring and Extranet (zia.dns-control.ip-pools)
Also called: IP pool; fallback IP pool; extranet IP pool

IP pools are used by Source IP Anchoring for transparent traffic. When a DNS request hits a rule preconfigured to forward traffic to Private Access (ZPA), Zscaler assigns the request an ephemeral IP address from the rule's IP pool before forwarding it to Private Access. [zia.dns-control.ip-pools:purpose] IP pools take custom address ranges for location traffic and remote user traffic, extend Source IP Anchoring support to non-web traffic through forwarding rules, and include fallback pools that keep source IP-anchored traffic redirecting to Private Access during ZIA control plane maintenance. [zia.dns-control.ip-pools:uses]

**Predefined pools.** Zscaler provides predefined IP pools associated with four preconfigured DNS rules: Private Access Resolver for Locations, Private Access Resolver for Road Warrior, Fallback Private Access Resolver for Locations and Fallback Private Access Resolver for Road Warrior. Any change in a pool is reflected in the Action column of the associated DNS rule when the rule is enabled. [zia.dns-control.ip-pools:predefined-pools] Whether predefined pools can be edited is disputed [divergence:zia.dns-control.ip-pools:predefined-editable]. The help names the rules differently from the graph [gap:zia.dns-control.ip-pools:rule-names].

**Writing one.** An IP pool holds at most one IP address range, entered as a subnet or a range of addresses. [zia.dns-control.ip-pools:one-range] Custom IP pools can be configured for Zscaler Extranet Application Support and only extranet-type pools can be created; access to Extranet Application Support is through the Zscaler Account team. [zia.dns-control.ip-pools:extranet-only] The pool Type field displays Extranet if the pool was created manually or automatically for Extranet Application Support, and is left blank for pools created automatically for Private Access. [zia.dns-control.ip-pools:pool-type] The IP Pools page lets an admin edit or delete custom IP pools. [zia.dns-control.ip-pools:custom-editable] Configuring an IP pool with public IP addresses is not recommended, because it can conflict with normal DNS resolution when a domain other than a Source IP Anchoring application resolves to a public address matching the pool. [zia.dns-control.ip-pools:public-ip-warning] An IP pool has an optional description. [zia.dns-control.ip-pools:description-field] Range sizes, default ranges and the API form are open [gap:zia.dns-control.ip-pools:pool-api-and-sizes].

Sources disagree (name both sides):
- The About IP Pool page says predefined IP pools can be edited and also lists them as read-only. [divergence:zia.dns-control.ip-pools:predefined-editable]
  - zscaler-help: Predefined pools can be viewed or edited, including their default name and range.
  - zscaler-help: The page lists viewing details for read-only, predefined IP pools.
  Impact: An answer about changing a predefined pool's range cannot rely on this page alone; a lab test of the console would settle it.

Not known (open gaps):
- Which names the four predefined DNS rules currently carry [gap:zia.dns-control.ip-pools:rule-names]: settled by tenant-data or source-read
- IP pool range sizes, default ranges and API representation [gap:zia.dns-control.ip-pools:pool-api-and-sizes]: settled by tenant-data or source-read

Area: zia.dns-control, its subjects in references/_meta/spine/zia/zia.dns-control.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.dns-control.criteria.md (What a DNS Control rule can match on), from zia.dns-control: Rule conditions are grouped into categories (Who/Where/When, Source IP, Destination/Resolved IPs, DNS Application); categories combine with AND, and each category has its own AND/OR operators inside. [zia.dns-control.criteria:condition-logic]
- decided-by references/_meta/text/zia/zia.dns-control.predefined-rules.md (Predefined DNS Control rules and the ZPA resolvers), from zia.dns-control: The DNS Control policy has default rules that allow all DNS traffic. They always hold the lowest precedence; their actions can be modified but they cannot be deleted. [zia.dns-control:default-rules]
- depends-on references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control), from zia.dns-control: DNS Control requires the firewall to be configured for locations, and a Firewall Filtering rule that allows DNS traffic (Network Services condition matches DNS). [zia.dns-control:firewall-prereq]
- logged-in references/_meta/text/zia/zia.logs.dns-outcome.md (What happened to a DNS query: rules, actions, response values and errors), from zia.dns-control: The DNS NSS feed gives separate rule and action fields for the request (reqrulelabel, reqaction) and for the response (resrulelabel, resaction), mapped in DNS Insights Logs to Request Rule Name, Request Action, Response Rule Name and Response Action. [zia.logs.dns-outcome:request-response-pairs]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many), from zia.dns-control: These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.methods.md (Forwarding methods Zscaler supports and how to choose), from zia.dns-control: The Zscaler service directs users' DNS requests that are forwarded via GRE tunnels, IPSec tunnels, or Zscaler Client Connector using Z-Tunnel 2.0. [zia.dns-control:dns-via-forwarding]
- logged-in references/_meta/text/types/zia/dns-log.md (ZIA DNS log (NSS DNS feed)), from zia.dns-control: The DNS NSS feed gives separate rule and action fields for the request (reqrulelabel, reqaction) and for the response (resrulelabel, resaction), mapped in DNS Insights Logs to Request Rule Name, Request Action, Response Rule Name and Response Action. [zia.logs.dns-outcome:request-response-pairs]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.dns-control.md (ZIA DNS Control)
- see-also references/_meta/text/zia/zia.dns-control.actions.md (DNS Control actions and what each API action requires)
