# Correlating ZIA, ZPA and Client Connector logs (shared.log-correlation)
Also called: log correlation; cross-product log correlation; correlate zscaler logs; multi-product incident logs; which log has this event; validate config with logs

Following one user or one request across ZIA, ZPA and Client Connector means knowing where each product's logs are, which fields line up, and which field meanings are still open.

1. **Where are the logs, and how far back?** ZIA's Nanolog and NSS, ZPA's LSS, and Client Connector's device-side logs: [Where ZIA, ZPA and Client Connector logs can be read, and for how long](kb:shared.log-correlation.streams).
2. **Same user or event across the ZIA feeds?** Fields shared by web, firewall and DNS records, and which time field to join on: [Correlating ZIA web, firewall and DNS records for one user or event](kb:shared.log-correlation.zia-feeds).
3. **Was it Client Connector traffic?** Forwarding method, tunnel version, device fields and bypass flags in ZIA records: [Client Connector traffic, devices and bypasses as seen in ZIA logs](kb:shared.log-correlation.zcc-in-zia).
4. **Same request in ZIA and ZPA?** No shared key exists; user, device, application segment and time fields, and what is open about each: [Joining ZIA logs to ZPA User Activity logs](kb:shared.log-correlation.zia-zpa-join).
5. **Writing the query.** Field naming in the SIEM and the validation searches: [Searching Zscaler logs in Splunk: field names, placeholders and validation searches](kb:shared.splunk).

**Field meanings that are still open.**
- Web action values and which subsystem fills action: [Full set of action values and which subsystem fills action](kb:zia.logs.web-rule-attribution:action-values-precedence).
- Firewall aggregation triggers and counters, and action precedence across firewall, IPS and DNAT: [How byte and duration counters behave on an aggregated record](kb:zia.logs.firewall-records:aggregate-counters), [Which subsystem fills action when firewall, IPS and DNAT disagree](kb:zia.logs.firewall-records:action-precedence).
- DNS reqaction and resaction value sets, and the sentinel values of res: [The reqaction and resaction value sets and whether both fire together](kb:zia.logs.dns-outcome:action-enum-open), [The sentinel values of res and how to tell them from addresses](kb:zia.logs.dns-outcome:res-sentinels-open).
- Web reason, URL category, riskscore and byte-counter semantics: [Value encodings and caveats of ZIA web log fields](kb:zia.logs.web-field-semantics).
- NSS field presence by output format, VM-side conversion, and time zones across feeds: [Field presence across output formats](kb:zia.logs.nss-feed-format:format-field-presence), [Whether VM-side format conversion drops a field](kb:zia.logs.nss-feed-format:vm-conversion-omits), [Time zone with several feeds or regions](kb:zia.logs.nss-feed-format:multi-feed-timezone).
- User Activity Active records on long connections and byte-counter resets: [What triggers a ConnectionStatus Active record on a long-lived connection](kb:zpa.logs.user-activity:active-cadence), [Delta and total byte counter reset semantics](kb:zpa.logs.user-activity:byte-counter-reset).
- User Status records per session: [User Status record cardinality per session and when the byte counters are populated](kb:zpa.logs.user-status:record-granularity).
- Microsegmentation enforcement reason, action and disposition combinations: [What combinations of EnforcementReason, EnforcementAction and EnforcementDisposition mean](kb:zpa.logs.microsegmentation-flow:enforcement-triple).

What to check:
1. Before filtering on a field whose value looks self-explanatory, check its open questions in the list above.

Area: shared.log-correlation, its subjects in references/_meta/spine/shared/shared.log-correlation.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields)
- links-to references/_meta/text/zia/zia.logs.dns-outcome.md (What happened to a DNS query: rules, actions, response values and errors)
- links-to references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names)
- links-to references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say)
- links-to references/_meta/text/shared/shared.log-correlation.streams.md (Where ZIA, ZPA and Client Connector logs can be read, and for how long)
- links-to references/_meta/text/shared/shared.log-correlation.zcc-in-zia.md (Client Connector traffic, devices and bypasses as seen in ZIA logs)
- links-to references/_meta/text/shared/shared.log-correlation.zia-feeds.md (Correlating ZIA web, firewall and DNS records for one user or event)
- links-to references/_meta/text/shared/shared.log-correlation.zia-zpa-join.md (Joining ZIA logs to ZPA User Activity logs)
- links-to references/_meta/text/shared/shared.splunk.md (Searching Zscaler logs in Splunk: field names, placeholders and validation searches)
- links-to references/_meta/text/zia/zia.logs.web-field-semantics.md (Value encodings and caveats of ZIA web log fields)
- links-to references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs)
- links-to references/_meta/text/zpa/zpa.logs.microsegmentation-flow.md (What a ZPA Microsegmentation Flow log record says and does not say)
- links-to references/_meta/text/zpa/zpa.logs.user-status.md (What a ZPA User Status log record says and does not say)
