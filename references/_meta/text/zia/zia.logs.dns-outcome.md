# What happened to a DNS query: rules, actions, response values and errors (zia.logs.dns-outcome)
Also called: dns reqaction resaction; dns log blocked query; dns log res field; EMPTY_RESP; dns log error code; request rule name response rule name; dns log domcat vs respipcat
Former IDs: log-14, log-15

Each query can carry a request-stage and a response-stage rule and action. The DNS NSS feed gives separate rule and action fields for the request (reqrulelabel, reqaction) and for the response (resrulelabel, resaction), mapped in DNS Insights Logs to Request Rule Name, Request Action, Response Rule Name and Response Action. [zia.logs.dns-outcome:request-response-pairs] The DNS field table lists REQ_ALLOW and RES_BLOC as the example values of reqaction, and gives no example for resaction. [zia.logs.dns-outcome:reqaction-examples] The DNS Insights Logs Request Action and Response Action show a Block value for block rules configured with either the Block or the Block with Response Code action. [zia.logs.dns-outcome:block-value] The value sets and whether both fire together are open [gap:zia.logs.dns-outcome:action-enum-open].

**Response value.** The res field is the resolved IP or name in the DNS response, with IPv4 and IPv6 addresses and EMPTY_RESP as examples, and restype is the means or format of the response, for example IPv4 or IPv6. [zia.logs.dns-outcome:res-ip-or-name] How to tell an address from a sentinel is open [gap:zia.logs.dns-outcome:res-sentinels-open].

**Errors.** The error field is the DNS error code, usually an incomplete or failed transaction, shown in Insights as DNS Error Code. [zia.logs.dns-outcome:error-meaning] EMPTY_RESP is one of the example values of the res field and the example value of the error field. [zia.logs.dns-outcome:empty-resp-both] The mapping to standard response codes is open [gap:zia.logs.dns-outcome:error-rcode-open]. The DNS Error Code values are UNSUPPORTED (the parser cannot decode but the DNS header has no error), BYPASS (bypassed by the cloud domain or bypass list), INT_ERROR (the parser failed on supported types), SRV_TIMEOUT (the server did not respond), EMPTY_RESP (no error but an empty answer section), REQ_BLOCKED (request blocked by the firewall, so no response), ADMIN_DROP (session force-dropped by CLI command), WCDN_TIMEOUT (timed out waiting for the Message Transport System to sync a wildcard domain resolution), IPS_BLOCK (blocked by IPS signature match) and FQDN_RESOLV_FAIL (the DNS Gateway server FQDN could not be resolved). [zia.logs.dns-outcome:error-codes] The DNS Error Code column carries the response code of a DNS Control rule with the Block with Response Code action and, when DNS Gateways forward queries to an external DNS service over DoH and an HTTP response arrives without a DNS response, the service's translation of the HTTP status code into an equivalent DNS response; the page says all error codes derive from the standard set by the Internet Engineering Task Force Organization. [zia.logs.dns-outcome:error-sources] Empty_Resp, Bypass, Int_Error and Srv_TimeOut are Zscaler internal error codes that might appear in the DNS Error Code column but are not listed under the DNS Error Code filter; Zscaler uses them for diagnostic purposes. [zia.logs.dns-outcome:internal-codes] DNS policy control and action enforcement are supported for all available DNS request types, but DNS logs might not display the specific request type values for all of them; the A6 type, for example, is logged as DNS type not mapped by ZS firewall. [zia.logs.dns-outcome:request-type-logging]

**Rule name and gateway column.** The DNS Insights Logs Rule Name column is displayed only when the traffic is blocked; the article lists the reasons the Zscaler Bypass Traffic rule populates in the logs: the queried domain matches a Zscaler cloud domain, the query matches a Microsoft 365 endpoint in the Office 365 One Click predefined Firewall Filtering rules if enabled, the response has no resolved IP or CNAME, or the response is not completely analyzed because of its record type, DNS Control analyzing A, AAAA, CNAME and PTR responses in detail. [zia.logs.dns-outcome:rule-name-and-bypass] The DNS Insights Logs article describes Resolver Gateway as the name of the DNS resolver (primary or secondary, within the configured DNS Gateway of the triggered rule) that was successfully used to resolve the DNS request, or the error resolution, if any. [zia.logs.dns-outcome:resolver-gateway-column] The NSS page describes the same field differently: [zia.logs.dns-gateway-fields:resolver-gateway-meaning](kb:zia.logs.dns-gateway-fields:resolver-gateway-meaning).

**Categories.** The domcat field categorizes the DNS request and respipcat categorizes the DNS response, and each has its own Insights column. [zia.logs.dns-outcome:request-vs-response-category] Which one decides when they disagree is open [gap:zia.logs.dns-outcome:category-precedence-open].

Field naming and encodings are in [Reading a ZIA DNS log record: naming, encodings and field caveats](kb:zia.logs.dns-record-fields); the gateway outcome fields are in [DNS Gateway fields in the DNS log: slot, server protocol and flags](kb:zia.logs.dns-gateway-fields); the policy that produces these actions is in [DNS Control actions and what each API action requires](kb:zia.dns-control.actions).

What to check:
1. Whether a blocked-DNS filter reads reqaction, resaction or both, since which field carries a response-stage block is unsettled.
2. Whether a res value is an address or a sentinel before parsing it as an IP.
3. Whether the error field maps to a standard DNS response code.

Not known (open gaps):
- The reqaction and resaction value sets and whether both fire together [gap:zia.logs.dns-outcome:action-enum-open]: settled by lab-test or support-ticket. Blocks: a SIEM rule that detects blocked DNS
- The sentinel values of res and how to tell them from addresses [gap:zia.logs.dns-outcome:res-sentinels-open]: settled by lab-test or tenant-data. Blocks: parsing res programmatically
- How error relates to standard DNS response codes [gap:zia.logs.dns-outcome:error-rcode-open]: settled by lab-test or tenant-data. Blocks: mapping DNS errors to NXDOMAIN, SERVFAIL or REFUSED
- Which of domcat and respipcat drives policy when they disagree [gap:zia.logs.dns-outcome:category-precedence-open]: settled by lab-test or support-ticket. Blocks: explaining a DNS block when the request and resolved IP categories differ

Area: zia.logs, its subjects in references/_meta/spine/zia/zia.logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.logs.dns-gateway-fields.md (DNS Gateway fields in the DNS log: slot, server protocol and flags)
- links-to references/_meta/text/zia/zia.dns-control.actions.md (DNS Control actions and what each API action requires)
- links-to references/_meta/text/zia/zia.logs.dns-record-fields.md (Reading a ZIA DNS log record: naming, encodings and field caveats)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.dns-control.md (ZIA DNS Control)
