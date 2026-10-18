DLP has three layers, and a question about "why did or didn't DLP act" has to be asked in order.

1. **What is detected?** Dictionaries are the detection primitives ([[zia.dlp.dictionaries]]). They are grouped into engines with Boolean expressions ([[zia.dlp.engines]]), and a rule references engines, not dictionaries ([[zia.dlp.engines:rules-reference-engines]]).
2. **Which rule applies and what does it do?** Order, criteria, Match Only, Confirm and the save-time constraints are in [[zia.dlp.rules]]; the API names and enums are in [[zia.dlp.rule-wire-shape]].
3. **Was DLP reached, and in which mode?** Upstream blocks, the decrypt dependency, Evaluate All Rules mode, exception rules and exemptions are in [[zia.dlp.evaluation]], with the SSL side in [[zia.ssl-inspection.pipeline]] and the URL side in [[zia.url-filtering]]. If DLP was reached but a large file was not inspected, see [[zia.dlp.inspection-limits]].

After a match, notification, ICAP, Incident Receiver and Cloud-to-Cloud forwarding are in [[zia.dlp.incident-forwarding]]. Endpoint DLP and Outbound Email DLP are separate API families: [[zia.dlp.endpoint-dlp]], [[zia.dlp.outbound-email]].

Paging pitfalls for ZIA lists are in [[shared.sdk-go.list-pagination]].
