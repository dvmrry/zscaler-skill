# DLP reports: Email Security (Email DLP), Endpoint DLP and Data Discovery (zia.reports.data-protection)
Also called: email security report; email dlp report; endpoint dlp report; data discovery report

These are the console reports that summarize DLP activity for email and endpoints, and the content found by DLP policies and dictionaries. The report hub is [ZIA reports: which subject describes each report family](kb:zia.reports); endpoint data scan, investigation and operational reporting are in [Endpoint Data Scan reports: the daily data-at-rest report, User and Device Investigation, DLP Operational and the End User Report](kb:zia.dlp.endpoint-data-scan).

**Email Security Report.** The Email Security Report, which the same page also calls the Email Data Loss Prevention (DLP) Report, gives visibility into emails with sensitive data and users with incidents, in an Overview tab and an Incidents tab, and can be filtered for the last 1 day, 7 days or month. [zia.reports.data-protection:email-report-what] The Email Security Report's Incidents page shows incidents for the overall recipients by severity (High, Medium, Low or Information) and by action (Allow, Custom Header Insertion or Block). [zia.reports.data-protection:email-severity-action] The Email Security Report's detailed view has three columns, Domain, Content Type (DLP Dictionaries, DLP Engines or ML Categories) and Users, and once an item in a column is selected the CSV export is no longer available for that column. [zia.reports.data-protection:email-detailed-view] Values on the Email Security Report page and the Insights Logs page might vary, because the Email Security Report Details values are tracked per recipient while the Insights Logs are tracked per mail and each email can contain multiple recipients. [zia.reports.data-protection:email-per-recipient]

**Endpoint DLP Report.** The Endpoint DLP Report gives visibility into activities end users take with sensitive data on endpoints, including printing, saving to removable storage, uploading to personal cloud accounts and network shares, in an Overview tab and an Incidents tab, and can be filtered for the last 7 days, 15 days or month. Activities with Sensitive Data counts the activities where sensitive data is involved in the transaction, and Incidents counts the incidents matching Endpoint DLP rules. [zia.reports.data-protection:edlp-report-what] The Endpoint DLP Incidents page's detailed view has three columns, Channel, Content Type (DLP Dictionaries, DLP Engines or ML Categories) and Users, and can be filtered for the last 7 days, 15 days or month. [zia.reports.data-protection:edlp-detailed-view] The severity and action values for Endpoint DLP incidents, and whether its incidents equal Endpoint DLP log records, are open [gap:zia.reports.data-protection:edlp-values].

**Data Discovery Report.** The Data Discovery Report gives information based on the organization's DLP policies and dictionaries and on machine-learning data from Zscaler's analysis of the organization's content. It shows the last 7 days by default with 1-day, 30-day and 90-day time frames also offered, and its widgets are not editable and cannot be moved. [zia.reports.data-protection:data-discovery-what] The Data Discovery Report filters on policy action (All, Allow or Block), application status (All, Sanctioned or Unsanctioned) and traffic direction (All, Download or Upload); the ML Categories content type filters on Zscaler's machine-learning analysis, divided into Document Type categories, and the Sankey chart shows up to 10 content categories at a time. [zia.reports.data-protection:data-discovery-filters] On Data Discovery Details, Content Type is always the first column and the Applications and Users columns can be reordered, which resets the data on the page; setting Content Type to ML Categories adds a Subcategory column with the specific subdocument classification of the detected sensitive file. [zia.reports.data-protection:data-discovery-details]

Time zone and retention for the three reports are open [gap:zia.reports.data-protection:report-time-and-retention].

What to check:
1. Whether a count is per recipient (the Email Security Report) or per mail (the Insights Logs) before comparing the report with the logs.
2. Which time range the report was set to before comparing figures, since the three reports offer different ranges.

Not known (open gaps):
- What severity and action values Endpoint DLP incidents carry, and whether report incidents equal Endpoint DLP log records [gap:zia.reports.data-protection:edlp-values]: settled by source-read or tenant-data
- Which time zone and retention apply to the Email Security, Endpoint DLP and Data Discovery reports [gap:zia.reports.data-protection:report-time-and-retention]: settled by source-read or support-ticket

Area: zia.reports, its subjects in references/_meta/spine/zia/zia.reports.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.dlp.endpoint-data-scan.md (Endpoint Data Scan reports: the daily data-at-rest report, User and Device Investigation, DLP Operational and the End User Report)
- links-to references/_meta/text/zia/zia.reports.md (ZIA reports: which subject describes each report family)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.dlp.outbound-email-policy.md (Outbound Email DLP policy: smart host flow, per-recipient evaluation, criteria and header actions)
- see-also references/_meta/text/zia/zia.dlp.engines.md (DLP engines: the unit a rule references)
- see-also references/_meta/text/zia/zia.dlp.dictionaries.md (DLP dictionaries: predefined, cloned and custom)
