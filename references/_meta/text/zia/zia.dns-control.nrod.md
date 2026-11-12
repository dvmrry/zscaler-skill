# Newly registered domains and classification delay in DNS Control (zia.dns-control.nrod)
Also called: nrod; newly registered and observed domains; newly registered domain dns; nrod latency; new domain not blocked

Zscaler categorizes domains newly registered within the last 30 days, or observed for the first time, as Newly Registered and Observed Domains (NROD) until a proper classification is available. [zia.dns-control.nrod:definition] The NROD database updates periodically, so a domain takes about 2 to 36 hours to be classified as NROD (depending on whether it is newly registered, observed or newly revived), and the first-ever DNS request for such a domain may have no URL classification. [zia.dns-control.nrod:latency]

DNS Control rules select NROD through Request Categories and Response Categories; the predefined High-Risk DNS Categories rule uses Newly Registered and Observed Domains, Newly Revived Domains and Other Security in both, and Zscaler especially recommends blocking the NROD category. [zia.dns-control.nrod:dns-criterion] Enable Suspicious New Domains Lookup (Advanced Policy Settings) is a prerequisite for using the Newly Registered and Observed Domains and Newly Revived Domains categories in a policy rule. [zia.dns-control.nrod:suspicious-lookup-prereq] Newly Revived Domains are sites reactivated after a brief period of inactivity of about 10 days. [zia.dns-control.nrod:revived] Zscaler says NRODs are often part of attack chains, such as termination points for DNS exfiltration through tunneling or hosts for drive-by malware before the domain is classified. [zia.dns-control.nrod:nrod-attack-chains]

Whether the NROD classification latency applies equally to URL Filtering is open [gap:zia.dns-control.nrod:nrod-latency-url-filtering]. The web side is in [ZIA URL Filtering](kb:zia.url-filtering).

What to check:
1. Whether the domain's age falls inside the classification latency window before reading rule order.
2. Whether the Suspicious New Domains Lookup setting is enabled, since the NROD categories need it.

Not known (open gaps):
- Whether the NROD classification latency applies equally to URL Filtering [gap:zia.dns-control.nrod:nrod-latency-url-filtering]: settled by lab-test or support-ticket. Blocks: promising how fast a new domain is blockable in web policy

Area: zia.dns-control, its subjects in references/_meta/spine/zia/zia.dns-control.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.dns-control.criteria.md (What a DNS Control rule can match on), from zia.dns-control: Rule conditions are grouped into categories (Who/Where/When, Source IP, Destination/Resolved IPs, DNS Application); categories combine with AND, and each category has its own AND/OR operators inside. [zia.dns-control.criteria:condition-logic]
- decided-by references/_meta/text/zia/zia.dns-control.predefined-rules.md (Predefined DNS Control rules and the ZPA resolvers), from zia.dns-control: The DNS Control policy has default rules that allow all DNS traffic. They always hold the lowest precedence; their actions can be modified but they cannot be deleted. [zia.dns-control:default-rules]
- depends-on references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control), from zia.dns-control: DNS Control requires the firewall to be configured for locations, and a Firewall Filtering rule that allows DNS traffic (Network Services condition matches DNS). [zia.dns-control:firewall-prereq]
- logged-in references/_meta/text/zia/zia.logs.dns-outcome.md (What happened to a DNS query: rules, actions, response values and errors), from zia.dns-control: The DNS NSS feed gives separate rule and action fields for the request (reqrulelabel, reqaction) and for the response (resrulelabel, resaction), mapped in DNS Insights Logs to Request Rule Name, Request Action, Response Rule Name and Response Action. [zia.logs.dns-outcome:request-response-pairs]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many), from zia.dns-control: These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.methods.md (Forwarding methods Zscaler supports and how to choose), from zia.dns-control: The Zscaler service directs users' DNS requests that are forwarded via GRE tunnels, IPSec tunnels, or Zscaler Client Connector using Z-Tunnel 2.0. [zia.dns-control:dns-via-forwarding]
- depends-on references/_meta/text/zia/zia.url-filtering.advanced-settings.md (Advanced URL Filtering settings that change outcomes): Enable Suspicious New Domains Lookup (Advanced Policy Settings) is a prerequisite for using the Newly Registered and Observed Domains and Newly Revived Domains categories in a policy rule. [zia.dns-control.nrod:suspicious-lookup-prereq]
- logged-in references/_meta/text/types/zia/dns-log.md (ZIA DNS log (NSS DNS feed)), from zia.dns-control: The DNS NSS feed gives separate rule and action fields for the request (reqrulelabel, reqaction) and for the response (resrulelabel, resaction), mapped in DNS Insights Logs to Request Rule Name, Request Action, Response Rule Name and Response Action. [zia.logs.dns-outcome:request-response-pairs]
- links-to references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/firewall-dns-rules.md (config type)
- see-also references/_meta/text/zia/zia.dns-control.md (ZIA DNS Control)
