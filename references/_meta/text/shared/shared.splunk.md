# Searching Zscaler logs in Splunk: field names, placeholders and validation searches (shared.splunk)
Also called: splunk queries; spl patterns; splunk field names for zscaler logs; zscaler splunk add-on; splunk index for zscaler; search zscaler logs in splunk

A search can only filter on the names a record carries once it is indexed, and those come from how the feed was written and parsed. Index and source type names are tenant plumbing and are not held here.

## Field names in the SIEM

An NSS feed replaces each field specifier with its value, in the order written: [In the Feed Output Format each field name is replaced by its value: `%s{<fieldname>}` prints a string, `%d{<fieldname>}` a decimal number and `%x{<fieldname>}` a hexadecimal number; static text and padding for constant width are allowed, and % is escaped with another %.](kb:shared.nss.feeds:format-specifiers), [Fields must be entered in the Feed Output Format in the order they are to appear in the output.](kb:shared.nss.feeds:field-order). Both the NSS feed guidelines and the LSS log stream content guidelines suggest name-value pairs where the SIEM supports them, and say some SIEMs, such as Splunk, can parse name-value formats and auto-detect field names regardless of order. [shared.splunk:name-value-pairs] The names a SIEM search can use therefore come from the feed format and its parsing, not from the specifiers themselves: a positional feed carries only values, and a name such as url exists in the index only if the format writes it as a name-value pair or the SIEM's parsing assigns it, so a search written with NSS or LSS field names works only where the feed or its parsing uses those names. [shared.splunk:search-names]

NSS and LSS field names are case-sensitive: [NSS field names are case-sensitive.](kb:zia.logs.nss-feed-format:case-sensitive), [Field names in a format string are case sensitive, and the default content adds a newline after the last field, so modified content must append at least one newline character after the last field.](kb:zpa.log-receivers.formats:field-names-newline). The default LSS templates and their keys are in the log types, for example [ZPA User Activity Log (LSS zpn_trans_log)](kb:zpa/user-activity-log); custom content changes them: [The log stream content can be edited in the text field to capture specific fields, which creates a Custom log template; a Restore Default Content option appears once it is changed.](kb:zpa.log-receivers.formats:custom-content).

What the Zscaler add-on for Splunk renames is open [gap:shared.splunk:add-on-mapping]. Source type names per log type are open in [Splunk sourcetypes and indexes for each Zscaler log type](kb:shared.siem-mapping:splunk-landing); a vendor example shows two of them: [The Terraform provider's Cloud NSS feed examples wrap each record in a JSON envelope that names a Splunk sourcetype: the example headed NSS Splunk Feed is a `WEBLOG` feed with siem_type `SPLUNK` and sourcetype `zscalernss-web`, and the example headed NSS Splunk Feed - Google Chronicle is an `FWLOG` feed with siem_type `SPLUNK`, a Google Chronicle connection URL and sourcetype `zscalernss-fw`.](kb:shared.siem-mapping:splunk-example).

## Validation searches

- **ZIA policy answers.** Which rule and category a URL hit, SSL inspection outcome, configured versus observed action: [Checking a ZIA policy answer against web logs](kb:shared.splunk.zia-policy-validation).
- **ZPA answers.** Segment and connector that served a host, connector load, user status, posture: [Checking a ZPA answer against LSS logs: segments, connectors, user status and posture](kb:shared.splunk.zpa-validation).
- **Firewall or web block.** Which ZIA module denied a request: [Correlating ZIA web, firewall and DNS records for one user or event](kb:shared.log-correlation.zia-feeds).
- **Client Connector devices and bypasses.** Device activity, traffic that did not come through Client Connector, tunnel versions and gaps: [Client Connector traffic, devices and bypasses as seen in ZIA logs](kb:shared.log-correlation.zcc-in-zia).
- **One user across products.** A timeline across ZIA and ZPA records: [Joining ZIA logs to ZPA User Activity logs](kb:shared.log-correlation.zia-zpa-join).

**ZDX data.** How ZDX data reaches a SIEM is open: [Whether ZDX data can be streamed to a SIEM](kb:shared.log-export.zdx:streaming-path). The ZDX API's time windows and reporting delay are in [Getting ZDX data out: the ZDX API, its windows and delays](kb:shared.log-export.zdx).

What to check:
1. Confirm the field names the tenant's feed actually carries (the feed's output format or the receiver's log stream content, and any add-on aliases) before running a search written with NSS or LSS names.
2. If a search's result depends on an open field question, keep the search and say which question it depends on.

Inferred, not quoted (say so when an answer rests on one):
- [shared.splunk:search-names] Tier B: Follows from the feed-format guidance; how a given add-on or parser names positional values is not in any registered source.

Not known (open gaps):
- What the Zscaler add-on for Splunk renames [gap:shared.splunk:add-on-mapping]: settled by source-read. Blocks: Writing searches that use CIM names or add-on source types

Area: shared.splunk, its subjects in references/_meta/spine/shared/shared.splunk.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.log-export.zdx.md (Getting ZDX data out: the ZDX API, its windows and delays)
- links-to references/_meta/text/shared/shared.nss.feeds.md (NSS feeds: limits, log types, filters and the output format string)
- links-to references/_meta/text/shared/shared.siem-mapping.md (Zscaler log types and where they land in a SIEM)
- links-to references/_meta/text/zpa/zpa.log-receivers.formats.md (Log stream format and content templates for a ZPA log receiver)
- links-to references/_meta/text/shared/shared.log-correlation.zcc-in-zia.md (Client Connector traffic, devices and bypasses as seen in ZIA logs)
- links-to references/_meta/text/shared/shared.log-correlation.zia-feeds.md (Correlating ZIA web, firewall and DNS records for one user or event)
- links-to references/_meta/text/shared/shared.log-correlation.zia-zpa-join.md (Joining ZIA logs to ZPA User Activity logs)
- links-to references/_meta/text/shared/shared.splunk.zia-policy-validation.md (Checking a ZIA policy answer against web logs)
- links-to references/_meta/text/shared/shared.splunk.zpa-validation.md (Checking a ZPA answer against LSS logs: segments, connectors, user status and posture)
- links-to references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.log-correlation.md (Correlating ZIA, ZPA and Client Connector logs)
