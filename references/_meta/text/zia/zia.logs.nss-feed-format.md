# How NSS feeds encode and deliver ZIA log fields (zia.logs.nss-feed-format)
Also called: nss feed format; feed escape character; nss hex encoding; cloud nss json; nss field limit; nss time zone; eedone
Former IDs: log-01, log-02, log-03

**Feed shape.** Zscaler recommends no more than 50 fields in an NSS feed, to fit syslog message size limits; a SIEM that can ingest larger messages can take more. [zia.logs.nss-feed-format:field-limit] NSS field names are case-sensitive. [zia.logs.nss-feed-format:case-sensitive] The tz field is the time zone specified when the NSS feed was configured, and the time field excludes the time zone. [zia.logs.nss-feed-format:tz-config] What differs between formats is open [gap:zia.logs.nss-feed-format:format-field-presence].

**Encoding.** The service hex encodes URL characters at or below 0x20 or at or above 0x7F as %HH when it sends logs to NSS, so a space in a URL arrives as %20 and a newline as %0A. [zia.logs.nss-feed-format:url-hex-encoding] Characters entered in a feed's Feed Escape Character field are encoded by the service, so a comma entered there appears as %2C. [zia.logs.nss-feed-format:escape-character] The TCP web feed article says the service encodes characters in URLs, hostnames, and referrer URLs only, and that if custom encoding was done for a record, the %s{eedone} field is YES for that record. [zia.logs.nss-feed-format:escape-scope] The two statements of what the field encodes differ in breadth [divergence:zia.logs.nss-feed-format:escape-field-scope]. The eedone field, specific to NSS, indicates whether the characters in the feed's Feed Escape Character field were hex encoded. [zia.logs.nss-feed-format:eedone-flag] For a Cloud NSS feed with JSON output, special characters such as a backslash in string fields can break the SIEM's parsing; Zscaler's workaround is a comma, backslash and quotation marks as the Feed Escape Character and the hex-encoded field variants such as elogin in place of login. [zia.logs.nss-feed-format:cloud-json-escaping] The HTTP Firewall, HTTP Sandbox Verdict, Cloud DNS and Cloud Posture Management feed articles each say that if JSON is selected as the Feed Output Type, special characters such as a backslash in string fields might cause a parsing issue for the SIEM, and that the fix is a comma, backslash and quotation marks as the Feed Escape Character together with hex encoded fields such as %s{elogin} in place of %s{login} in the Feed Output Format. [zia.logs.nss-feed-format:json-escaping-http-and-cloud]

**VM NSS and Cloud NSS.** Web and Firewall logs are stored in the Nanolog in the Zscaler cloud; each NSS receives copies from the Nanolog, then decompresses, detokenizes, filters and converts them to the configured output format. [zia.logs.nss-feed-format:one-store] Cloud NSS delivery reads from the Nanolog: after an interruption, the Cloud NSS one-hour recovery lets the Nanolog replay logs up to one hour back. [zia.logs.nss-feed-format:cloud-from-nanolog] A Cloud NSS instance supports one feed per Internet and SaaS log type, and the feed format is customizable, with JSON recommended. [zia.logs.nss-feed-format:cloud-feed-limit] Because VM-based NSS and Cloud NSS read the same Nanolog store, field content is expected to match between them; the realistic differences are transport and output format. [zia.logs.nss-feed-format:field-content-same] Whether conversion ever drops a field is open [gap:zia.logs.nss-feed-format:vm-conversion-omits].

**Time zones.** A TCP web feed's Time Zone is by default the organization's time zone and applies to the time field in the output file; the list of time zones is derived from the IANA Time Zone database, and direct GMT offsets can also be specified. [zia.logs.nss-feed-format:time-zone-setting] The HTTP Firewall and Cloud DNS feed articles say the feed's time zone automatically adjusts to changes in daylight savings in that time zone, and the HTTP Sandbox Verdict and Cloud Posture Management articles say the same with the wording "daylight saving"; all four say the configured time zone can be output to the logs as a separate field. [zia.logs.nss-feed-format:time-zone-dst] Behavior with several feeds or regions is open [gap:zia.logs.nss-feed-format:multi-feed-timezone].

Field inventories: [What a ZIA web log record is and how its fields are named](kb:zia.logs.web-records), [What a ZIA firewall log record is: aggregates, action and field names](kb:zia.logs.firewall-records). Cloud and HTTP feeds for Email DLP, Endpoint DLP and Sandbox Verdict logs: [Cloud and HTTP NSS feeds for Email DLP, Endpoint DLP and Sandbox Verdict logs: settings, certificates and filters](kb:zia.logs.nss-dlp-sandbox-feeds).

Zscaler recommends tabs as field delimiters and avoiding commas and spaces, which can occur in output values such as department names or URLs. [zia.logs.nss-feed-format:tab-delimiters] Zscaler supports many syslog formats, including industry standard formats and custom log strings; CEF and LEEF are two primary standards used by SIEMs, and LEEF is a customized event format created by IBM QRadar. [zia.logs.nss-feed-format:syslog-formats]

What to check:
1. Which output format the SIEM receives and whether URL and string fields need the hex-encoded variants before parsing.
2. How many fields the feed asks for against the syslog size recommendation.
3. Which time zone each feed was configured with before comparing event times across feeds.

Inferred, not quoted (say so when an answer rests on one):
- [zia.logs.nss-feed-format:field-content-same] Tier B: Inference from the shared store; the vendor sources do not state that field content is identical.

Sources disagree (name both sides):
- The general guidelines and the TCP web feed article differ in which fields the Feed Escape Character encodes. [divergence:zia.logs.nss-feed-format:escape-field-scope]
  - zscaler-help: The service encodes the characters entered in the Feed Escape Character field, with no limit on the fields stated.
  - zscaler-help: The service encodes characters in URLs, hostnames, and referrer URLs only.
  Impact: Whether a custom escape character is encoded in fields other than URLs, hostnames and referrer URLs depends on which article is read; the TCP feed article is the narrower one.

Not known (open gaps):
- Field presence across output formats [gap:zia.logs.nss-feed-format:format-field-presence] (data gap): filled by operator; settled by tenant-data. Blocks: Assuming a field exists, under the same name, in every output format.
- Whether VM-side format conversion drops a field [gap:zia.logs.nss-feed-format:vm-conversion-omits] (data gap): filled by operator; settled by tenant-data. Blocks: Treating Cloud NSS and VM NSS records as field-identical.
- Time zone with several feeds or regions [gap:zia.logs.nss-feed-format:multi-feed-timezone] (data gap): filled by operator; settled by tenant-data. Blocks: Normalizing event times across feeds that carry different tz values.

Area: zia.logs, its subjects in references/_meta/spine/zia/zia.logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs): Web and Firewall logs are stored in the Nanolog in the Zscaler cloud; each NSS receives copies from the Nanolog, then decompresses, detokenizes, filters and converts them to the configured output format. [zia.logs.nss-feed-format:one-store]
- links-to references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names)
- links-to references/_meta/text/zia/zia.logs.nss-dlp-sandbox-feeds.md (Cloud and HTTP NSS feeds for Email DLP, Endpoint DLP and Sandbox Verdict logs: settings, certificates and filters)
- links-to references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/nss-feeds.md (config type)
- configured-via references/_meta/text/zia/zia.api.cloud-nss-feeds.md (Cloud NSS feed settings: HTTPS-only URLs and OAuth fields)
- see-also references/_meta/text/shared/shared.nss.feeds.md (NSS feeds: limits, log types, filters and the output format string)
- see-also references/_meta/text/zia/zia.logs.nss-runbook.md (How the Internet & SaaS NSS support troubleshooting runbook triages a case and routes it to its pages)
