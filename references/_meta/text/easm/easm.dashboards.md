# EASM Insights Overview and Assets Overview dashboards: widgets, time frames and bucket definitions (easm.dashboards)

EASM has two dashboards: Assets Overview and Insights Overview, the latter covering the vulnerabilities and risks associated with the assets. [easm.dashboards:two-dashboards]

## Insights Overview

The Insights Overview dashboard shows data for the organization selected in the top-right corner and shows the timestamp when the displayed data was last updated. [easm.dashboards:org-selector-timestamp] The Insights Overview dashboard has widgets for Top 5 Findings by ROI, risk-level distribution, findings over time, category percentage, top lookalike domains, top exposed VPN appliances, top locations, top findings by risk level, exposed sensitive services, SSL/TLS certificate expiration and domain registration expiration. [easm.dashboards:insights-widgets]

**Time frames.** The Findings Over Time by Risk Level trend can be set to the last 7, 30, 90 or 180 days, with multiple risk levels selectable together. [easm.dashboards:trend-time-frames] On the Findings Over Time by Risk Level graph, hovering shows the findings count for specific days when the time frame is greater than the last 7 days. [easm.dashboards:trend-daily-hover]

**Widgets.** The Top 5 Findings by ROI widget lists the top 5 findings by ROI score with Finding Name, ROI on a scale of 1 to 10, and Impacted Assets. [easm.dashboards:top5-roi-widget] The Distribution of Findings by Risk Level widget covers the levels low, medium, high and critical. [easm.dashboards:risk-level-widget] The Top 5 Lookalike Domains by Exposure widget ranks by exposure score and shows Original Domain, Lookalike Domain, Risk Category and Exposure Score. [easm.dashboards:lookalike-widget] The Top 5 Exposed VPN Appliances widget shows the top 5 by risk score, with Known Exploits as a Boolean for the CISA KEV catalog and the CVE IDs identified in the appliance. [easm.dashboards:vpn-widget] The Insights Overview widget Exposed Sensitive Services gives examples of SSH, FTP, Telnet, VNC, TFTP (UDP), SNMP (UDP), databases such as MySQL, MongoDB and Redis, and Elasticsearch. [easm.dashboards:sensitive-services-widget]

**Expiration buckets.** The SSL/TLS Certificate Expiration widget counts certificates that are already expired, expiring in the next 30 days, and with validity longer than the next 30 days. [easm.dashboards:cert-expiration-buckets] The Domain Registration Expiration widget counts domains that are already expired, expiring in the next 30 days, with validity longer than the next 30 days, and with unknown validity. [easm.dashboards:domain-expiration-buckets]

## Assets Overview

The Assets Overview dashboard widgets are Asset Count by Type, Assets by Risk Level, Assets Over Time by Risk Level, Top Locations by Assets, Top 5 Assets by Revealing Hostnames, Top 5 Assets by Risk Level and Distribution of SSL/TLS Versions. [easm.dashboards:assets-widgets] The Assets Over Time by Risk Level trend can be set to the last 7, 30, 90 or 180 days, with multiple risk levels selectable together. [easm.dashboards:trend-assets-time-frames] The Assets by Risk Level widget uses minimal, low, medium, high and critical levels. [easm.dashboards:assets-risk-levels-widget] The Top 5 Assets by Revealing Hostnames widget shows an Impact Level and ranks by highest impact level in decreasing order. [easm.dashboards:revealing-hostnames-widget] The Top 5 Assets by Risk Level widget shows a risk score computed for the asset based on the findings associated with it. [easm.dashboards:top-assets-risk-score] The Assets Overview widget Distribution of SSL/TLS Versions only tests connections for SSL 2.0 and 3.0 and TLS 1.0, 1.1, 1.2 and 1.3. [easm.dashboards:tls-versions-tested]

The findings behind the Insights widgets are in [EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages](kb:easm.findings), the lookalike alert is in [EASM lookalike domains: the raw-domain key, deception methods, risk categories and missing signals](kb:easm.lookalike-domains) and the assets are in [EASM asset inventory: types, risk levels, Approved, Candidate and Archived status, detail fields and the Assets page](kb:easm.assets).

What to check:
1. Which dashboard the question is about and which organization is selected in the top-right corner.
2. Which SSL and TLS versions the Distribution of SSL/TLS Versions widget tests before reading a version as absent.

Area: easm.dashboards, its subjects in references/_meta/spine/easm/easm.dashboards.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/easm/easm.assets.md (EASM asset inventory: types, risk levels, Approved, Candidate and Archived status, detail fields and the Assets page)
- links-to references/_meta/text/easm/easm.findings.md (EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages)
- links-to references/_meta/text/easm/easm.lookalike-domains.md (EASM lookalike domains: the raw-domain key, deception methods, risk categories and missing signals)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/easm/easm.overview.md (Zscaler EASM: what it is, how it is set up, and where each part is documented)
