# DNS over HTTPS in DNS Control (zia.dns-control.doh)
Also called: doh; dns over https; doh blocking; does dns control inspect doh; DOHTTPS_RULE; REDIR_REQ_DOH

Zscaler states DNS Control monitors and applies policy to all DNS requests and responses irrespective of protocol and encryption, including UDP, TCP and DNS over HTTPS. [zia.dns-control.doh:doh-covered] Whether a DoH query is matched without SSL inspection of the DoH provider is open [gap:zia.dns-control.doh:doh-needs-decryption]. SSL inspection coverage of a destination is in [Where SSL inspection sits in ZIA web policy evaluation (the two passes)](kb:zia.ssl-inspection.pipeline).

The rule `protocols` field has a DNS-over-HTTPS value `DOHTTPS_RULE`, alongside `ANY_RULE`, `SMRULEF_CASCADING_ALLOWED`, `TCP_RULE` and `UDP_RULE`. [zia.dns-control.doh:doh-protocol-value] A rule's Protocols condition offers DNS Over HTTPS, TCP and UDP; the options shown narrow with the chosen action (for example, only DoH and TCP for Redirect Request Using TCP). [zia.dns-control.doh:doh-protocol-choice] The console's Redirect Request Using DoH action is in [DNS Control actions and what each API action requires](kb:zia.dns-control.actions).

What to check:
1. Whether the DoH provider's domain is inside an SSL inspection rule, before saying DoH traffic is inspected.
2. Whether the tenant's DNS rules have a protocols value of DOHTTPS_RULE.
3. Whether a Redirect Request Using DoH action is read as applying to DoH traffic, since the options narrow with the action.

Not known (open gaps):
- Whether DoH queries are matched by DNS Control without SSL inspection of the DoH provider [gap:zia.dns-control.doh:doh-needs-decryption]: settled by lab-test or support-ticket. Blocks: saying whether a DoH-blocking DNS rule works for uninspected DoH providers

Area: zia.dns-control, its subjects in references/_meta/spine/zia/zia.dns-control.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.dns-control.criteria.md (What a DNS Control rule can match on), from zia.dns-control: Rule conditions are grouped into categories (Who/Where/When, Source IP, Destination/Resolved IPs, DNS Application); categories combine with AND, and each category has its own AND/OR operators inside. [zia.dns-control.criteria:condition-logic]
- decided-by references/_meta/text/zia/zia.dns-control.predefined-rules.md (Predefined DNS Control rules and the ZPA resolvers), from zia.dns-control: The DNS Control policy has default rules that allow all DNS traffic. They always hold the lowest precedence; their actions can be modified but they cannot be deleted. [zia.dns-control:default-rules]
- depends-on references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control), from zia.dns-control: DNS Control requires the firewall to be configured for locations, and a Firewall Filtering rule that allows DNS traffic (Network Services condition matches DNS). [zia.dns-control:firewall-prereq]
- logged-in references/_meta/text/zia/zia.logs.dns-outcome.md (What happened to a DNS query: rules, actions, response values and errors), from zia.dns-control: The DNS NSS feed gives separate rule and action fields for the request (reqrulelabel, reqaction) and for the response (resrulelabel, resaction), mapped in DNS Insights Logs to Request Rule Name, Request Action, Response Rule Name and Response Action. [zia.logs.dns-outcome:request-response-pairs]
- logged-in references/_meta/text/zia/zia.logs.dns-record-fields.md (Reading a ZIA DNS log record: naming, encodings and field caveats): The protocol field lists TCP, UDP and DoH (DNS over HTTP) as values, istcp is 1 for TCP and 0 otherwise, and http_code is the HTTP return code used in DNS over HTTPS sessions. [zia.logs.dns-record-fields:protocol-values]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many), from zia.dns-control: These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.methods.md (Forwarding methods Zscaler supports and how to choose), from zia.dns-control: The Zscaler service directs users' DNS requests that are forwarded via GRE tunnels, IPSec tunnels, or Zscaler Client Connector using Z-Tunnel 2.0. [zia.dns-control:dns-via-forwarding]
- logged-in references/_meta/text/types/zia/dns-log.md (ZIA DNS log (NSS DNS feed)), from zia.dns-control: The DNS NSS feed gives separate rule and action fields for the request (reqrulelabel, reqaction) and for the response (resrulelabel, resaction), mapped in DNS Insights Logs to Request Rule Name, Request Action, Response Rule Name and Response Action. [zia.logs.dns-outcome:request-response-pairs]
- links-to references/_meta/text/zia/zia.dns-control.actions.md (DNS Control actions and what each API action requires)
- links-to references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes))

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/firewall-dns-rules.md (config type)
- see-also references/_meta/text/zia/zia.dns-control.md (ZIA DNS Control)
