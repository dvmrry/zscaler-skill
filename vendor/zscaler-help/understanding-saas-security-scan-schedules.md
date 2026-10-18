# Understanding SaaS Security Scan Schedules

**Source:** https://help.zscaler.com/zia/understanding-saas-security-scan-schedules
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401631, revision 3233239

---

This article provides information about SaaS Security Scan Schedules, including how to configure and use them.
# About Active and Historical Data
When a SaaS Security scan inspects content, it uses a specific date to determine how much data is considered active or historical. The date that a scan uses depends on if you're starting the scan or if you're modifying the policy for a running scan.
- Starting a Stopped Scan
- When you start a scan, the scan uses its start date to determine how much data is considered active or historic. Active content is any content created, modified, sent, or received after the scan’s start date. Only inactive content created, modified, sent, or received before this date is historical content.
- For example, you create a Data Loss Prevention (DLP) policy rule for a file sharing tenant on May 1, 2021, and then start the scan for the rule on the same day. All files created or modified after May 1, 2021 are active data files. All files created or modified before this date are historic data files. If a historic data file is modified after this date, it’s considered active.
- If you start a scan on a date later than a policy rule’s creation date, the scan still uses its start date. For example, instead of May 1, 2021, you start the scan on July 1, 2021. The scan uses July 1, 2021 to determine which data files are active or historic.
- Modifying the Policy for a Running Scan
- When a scan is running, you can still add a new policy rule, edit an existing rule, or delete an existing rule. If you add a new policy rule or edit an existing policy rule while the scan is on, the scan uses this new date to determine how much data is considered active or historic.
- Deleting a policy rule does not change the date the scan uses for active and historical data.
- Active content is any content created, modified, sent, or received after the new date. Only inactive content created, modified, sent, or received before this date is historical content. The new or edited rule does not apply to the content that the scan already processed, and therefore this content is considered historical data.
- For example, you create and start a scan for a file sharing tenant on April 1, 2021. On July 1, 2021, you add a new rule to the scan. All files created or modified after July 1, 2021 are active data files. Any files created or modified before July 1, 2021 are historic data files. Any content the scan processed between April 1, 2021 and July 1, 2021 is considered historical content. If a historic data file is modified after this date, it's considered active.
# Configuring a Scan to Inspect Historical Data
When you start a configured scan, it automatically inspects active content continuously. To inspect historical content, you must configure the amount of content the scan inspects. You can inspect historical data from up to 6 years ago. For example, if you start the historical scan for data from May 1, 2024, the retro scan date that you can set would be from May 1, 2018.
You can add a scan with the following configurations:
- Inspect All Historical Content
- To inspect all historical content, select the **All Data** option when configuring a scan.
- For example, you create and start a scan for a file sharing tenant on May 1, 2021. The scan inspects any historic data files created or modified before May 1, 2021. When the scan processes historic data files, the scan continuously inspects active data files at the same time. All the SaaS application tenants support inspecting the historical data and support both DLP and Malware scanning. The DLP and Malware scan actions depend on the selected application. Report action for DLP and malware remain same across all tenants, but other actions such as remove, quarantine, remove collaborators, etc. change based on the selected tenant for each application.
- Inspect Historical Content Within a Specific Time Frame
- To inspect historical content within a specific time frame, select the **Data Created or Modified After** option and select the starting date of the time frame when configuring a scan. This allows you to narrow down the amount of historical content the scan inspects. All the SaaS application tenants support inspecting the historical data within a specific time frame and support both DLP and Malware scanning. The DLP and Malware scan actions depend on the selected application. Report action for DLP and malware remain same across all tenants, but other actions such as remove, quarantine, remove collaborators, etc. change based on the selected tenant for each application.
- For example, you create and start a scan for a file sharing tenant on May 1, 2021. For the scan, you select February 1, 2021 as the starting date of the time frame. The scan inspects any historic data files created or modified between February 1, 2021 to May 1, 2021. When the scan processes historic data files, the scan continuously inspects active data files at the same time. Another example includes, when you select January 1, 2024 as the date to start scanning from that date until today, any data present before January 1, 2024 is not scanned.
- Ignore All Historical Content
- To ignore all historical content, select the **New Data Only** option when configuring a scan. When you start the scan, the scan only inspects active data.
- For example, you create and start a scan for a file sharing tenant on May 1, 2021. The scan ignores all historic data files created or modified before May 1, 2021. The scan continuously inspects active data files.
To learn more, see Configuring SaaS Security Scan Schedules.
# Stopping a SaaS Security Scan
From the SaaS Security Scan Configuration page, you can start and stop the scan. Stopping a scan causes it to flush its processing queue. If you stop the scan, you must use one of the following options to start it again:
- Configure the scan to inspect all historical data and the scan processes all data from the beginning. This might result in duplicate results for data that the scan has already inspected.
- First, analyze your SaaS Security Insights logs to find when the scan stopped processing your historical data. Next, configure the scan to inspect data starting from that date, so it ignores already processed data.
