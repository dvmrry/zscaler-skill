# Which ZIA log fields are not logged until enabled (zia.logs.field-enablement)
Also called: clt_sport empty; srv_dport empty; dlprulename empty; fields not logged by default; enable logging contact support; df_hostname empty

Some web log fields are empty unless something is enabled first.

**Needs Zscaler Support.** Logging of the web log client source port, clt_sport, is enabled by contacting Zscaler Support. [zia.logs.field-enablement:clt-sport] Logging of the web log server destination port, srv_dport, is enabled by contacting Zscaler Support. [zia.logs.field-enablement:srv-dport] Logging of the DLP Allowed Rule Name, dlprulename, is enabled by contacting Zscaler Support. [zia.logs.field-enablement:dlprulename] The Web Insights Logs columns page says the Client Source Port filter is disabled by default and enabled by contacting Zscaler Support, and says the same of a column; the filters page says the same of a filter. [zia.logs.field-enablement:console-ports-disabled]

**Needs a DLP setting.** The other DLP rules field is populated only when Evaluate All Rules Mode is enabled for inline DLP rule evaluation on the DLP Advanced Settings page. [zia.logs.field-enablement:other-dlp-rules]

**Needs TLS Inspection.** df_hostname is populated only when TLS Inspection is enabled. [zia.logs.field-enablement:df-tls] The mismatch-only behavior is in [Value encodings and caveats of ZIA web log fields](kb:zia.logs.web-field-semantics).

**Firewall log.** The firewall log lists csport and sdport with no enablement note in its field CSV, while the web log lists the client source port and server destination port as needing Support to enable. [zia.logs.field-enablement:firewall-ports]

What to check:
1. Whether an empty client port, server port or allowed DLP rule name is a field that was never enabled rather than missing traffic.
2. Whether TLS Inspection applies to the traffic before expecting df_hostname.

Inferred, not quoted (say so when an answer rests on one):
- [zia.logs.field-enablement:firewall-ports] Tier B: Compares two vendor CSVs; the absence of a note in the firewall CSV does not show the ports are on by default.

Area: zia.logs, its subjects in references/_meta/spine/zia/zia.logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)): df_hostname is populated only when TLS Inspection is enabled. [zia.logs.field-enablement:df-tls]
- links-to references/_meta/text/zia/zia.logs.web-field-semantics.md (Value encodings and caveats of ZIA web log fields)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named)
