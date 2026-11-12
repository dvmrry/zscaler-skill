# NSS runbook: duplicate logs, missing log fields and SIEM-side checks (zia.logs.nss-runbook.log-integrity)
Also called: Duplicate Logs; Log Column/Field Missing; SIEM Side Checks

**Duplicate logs.** For duplicate logs on the SIEM, the runbook says to include the %d{recordid} field in the NSS feed format, a unique record identifier for each log, to identify duplication. [zia.logs.nss-runbook.log-integrity:duplicate-recordid] To find where duplicates come from, the SIEM Log Source field shows which NSS server sent them, and for duplicates from two different NSS servers the runbook says to verify the NSS feeds and look for redundant feeds. [zia.logs.nss-runbook.log-integrity:duplicate-source-checks] For duplicates from the same NSS server the runbook checks the Duplicate Logs feed setting; set to a value of 1-60 minutes, it makes the NSS replay buffered logs after a lost SIEM connection is restored. [zia.logs.nss-runbook.log-integrity:duplicate-logs-setting] Duplicates can also come from data engines such as Cribl or Datadog in front of the SIEM, or from multiple active NSS servers mapped to the same Nanolog cluster in a multi-cluster setup. [zia.logs.nss-runbook.log-integrity:duplicate-other-causes]

**Missing field.** For a missing log column or field, the runbook has the admin confirm the field is configured with the right case (field names are case-sensitive) and string format (%s, %d, %x), and that the feed escape character is set when the delimiter commonly appears in values. [zia.logs.nss-runbook.log-integrity:missing-field-format] String fields such as URL and user agent need hex-encoded fields in the feed format; Zscaler uses hex-encoded fields for all non-printable ASCII characters in field values, for example %s{eurl} and %s{ereferer}. [zia.logs.nss-runbook.log-integrity:missing-field-hex] To verify a missing field from the NSS server, the runbook checks sudo /sc/bin/smmgr -s getsminfo=nss_feed_info_all and simulates a sample log while capturing on the NSS service interface. [zia.logs.nss-runbook.log-integrity:missing-field-verify] Which smmgr flag the getsminfo check takes [gap:zia.logs.nss-runbook.log-integrity:getsminfo-flag] is open.

**SIEM side.** The runbook's SIEM-side checks cover event ingestion, parsing and normalization, correlation rules, data pipeline health and recent changes, with exact commands varying by SIEM vendor. [zia.logs.nss-runbook.log-integrity:siem-side-checks]

Not known (open gaps):
- Whether getsminfo=nss_feed_info_all takes smmgr -s or -ys [gap:zia.logs.nss-runbook.log-integrity:getsminfo-flag]: settled by lab-test or source-read

Area: zia.logs, its subjects in references/_meta/spine/zia/zia.logs.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.logs.nss-runbook.md (How the Internet & SaaS NSS support troubleshooting runbook triages a case and routes it to its pages)
- see-also references/_meta/text/zia/zia.logs.nss-runbook.log-loss.md (NSS runbook: missing and delayed logs on VM-based NSS, smstat counters and where the loss occurs)
- see-also references/_meta/text/zia/zia.logs.nss-runbook.cloud-nss.md (NSS runbook: Cloud NSS new, stopped, missing and delayed logs, parsing errors and the SIEM connectivity test errors)
- see-also references/_meta/text/zia/zia.logs.nss-runbook.corner-cases.md (NSS runbook corner cases: private and multi-cluster Nanolog, SIEM rate, explicit proxy, log replay, password reset and third-party software)
- see-also references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields)
- see-also references/_meta/text/shared/shared.nss.reliability.md (What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery)
- see-also references/_meta/text/shared/shared.nss.feed-settings.md (NSS feed destination and delivery settings by feed kind: TCP, HTTP, Cloud NSS and MCAS)
