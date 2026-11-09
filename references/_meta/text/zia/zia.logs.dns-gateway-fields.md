# DNS Gateway fields in the DNS log: slot, server protocol and flags (zia.logs.dns-gateway-fields)
Also called: dnsgw_flags; dns gateway flags; FO_DEST_DROP; FO_DEST_ERR; dnsgw_slot; dns gateway log failover; resolver gateway column
Former IDs: log-16

Three fields carry the DNS Gateway outcome. The dnsgw_slot field is the name of the DNS Gateway rule, shown in Insights as Resolver Gateway, and dnsgw_srv_proto is the DNS Gateway server protocol, with TCP, UDP and HTTP as examples. [zia.logs.dns-gateway-fields:dnsgw-slot-proto] The DNS Insights Logs article describes the Resolver Gateway column differently [divergence:zia.logs.dns-gateway-fields:resolver-gateway-meaning]. The column text is in [The DNS Insights Logs article describes Resolver Gateway as the name of the DNS resolver (primary or secondary, within the configured DNS Gateway of the triggered rule) that was successfully used to resolve the DNS request, or the error resolution, if any.](kb:zia.logs.dns-outcome:resolver-gateway-column).

**Flags.** The NSS DNS log output format page glosses the dnsgw_flags values as PRIMARY_SERVER_RESPONSE_PASS for Primary Server Attempted, SECONDARY_SERVER_RESPONSE_PASS for Secondary Server Attempted, FO_DEST_PASS for Query Forwarded to Destination, FO_DEST_ERR for Error Response Returned to Client and FO_DEST_DROP for Query Dropped, with None also listed. [zia.logs.dns-gateway-fields:dnsgw-flag-glosses] The Cloud & Branch Connector help gives a DNS gateway's failure behavior as either Return error response or Forward to Original DNS Server. [zia.logs.dns-gateway-fields:failure-behavior-options] [The Failure Behavior of a ZIA DNS gateway is an action for when the configured DNS service is unavailable or unhealthy, with three choices. Return Error Response returns SERVFAIL to the client (with both services configured, only when both are unavailable); Allow and Ignore DNAT Rules sends the request to the originally requested resolver over the original protocol without the configured DNAT rules; Forward to Zscaler Trusted Resolver sends it to the Zscaler Trusted DNS Resolver, usable as failover for DNS over UDP, TCP and DoH.](kb:zia.dns-control.gateways:failure-behaviors) Whether the flags are exclusive, their order and how they map to the failure behavior are open [gap:zia.logs.dns-gateway-fields:dnsgw-flags-semantics-open].

The general outcome fields are in [What happened to a DNS query: rules, actions, response values and errors](kb:zia.logs.dns-outcome) and naming in [Reading a ZIA DNS log record: naming, encodings and field caveats](kb:zia.logs.dns-record-fields).

What to check:
1. Which glossed meaning the dnsgw_flags value carries, and whether failover behavior is configured on the gateway.
2. Whether one record can show several flags, before filtering on equality.

Sources disagree (name both sides):
- The NSS DNS output format describes dnsgw_slot as the name of the DNS Gateway rule, mapped to the Resolver Gateway column, while the DNS Insights Logs article describes Resolver Gateway as the resolver used and a separate DNS Gateway Flags column as the request status at the gateway level. [divergence:zia.logs.dns-gateway-fields:resolver-gateway-meaning]
  - zscaler-help: dnsgw_slot is the name of the DNS Gateway rule and maps to the Resolver Gateway column.
  - zscaler-help: Resolver Gateway is the name of the primary or secondary resolver that resolved the request, or the error resolution, and the gateway-level status is the separate DNS Gateway Flags column.
  Impact: Whether the Resolver Gateway value is a rule name or a resolver name depends on which page is read; dnsgw-slot-proto states the NSS side.

Not known (open gaps):
- Whether dnsgw_flags values are exclusive and how they map to gateway failure behavior [gap:zia.logs.dns-gateway-fields:dnsgw-flags-semantics-open]: settled by source-read or lab-test or support-ticket. Blocks: diagnosing why a gateway DNS query failed

Area: zia.logs, its subjects in references/_meta/spine/zia/zia.logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.logs.dns-outcome.md (What happened to a DNS query: rules, actions, response values and errors)
- links-to references/_meta/text/zia/zia.dns-control.gateways.md (ZIA DNS gateways: protocol translation, primary/secondary failover, failure behavior, DoH path)
- links-to references/_meta/text/zia/zia.logs.dns-record-fields.md (Reading a ZIA DNS log record: naming, encodings and field caveats)
