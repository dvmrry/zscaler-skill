# About SaaS Security Insights Logs

**Source:** https://help.zscaler.com/zia/about-saas-security-insights-logs
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

The Zscaler service provides real-time log consolidation across the globe, so you can view every scan performed by the Zscaler SaaS Connector of data based on your SaaS application tenant.

Logs are stored for 180 days in the Zscaler Nanolog servers. Zscaler also offers the Nanolog Streaming Service (NSS), a virtual machine (VM) that can stream web traffic logs in real time from the Zscaler Nanolog to your security information and event management (SIEM) system, such as Splunk, enabling real-time alerting, correlation with the logs of your firewall and other devices, and long-term local log archival. Contact your Zscaler representative or Zscaler Support for more information on subscribing to NSS.

You can view the logs for files that triggered the real-time Data at Rest Scanning DLP rules in the SaaS Security Insights Logs page for Webex.

The SaaS Security Insights Logs page provides the following benefits and enables you to:

- View logs for each transaction for your SaaS applications processed by Zscaler.
- Quickly access the desired logs with the help of multiple filters and operators when troubleshooting.

Interactive reports support UTF-8 characters enabling the display of special characters.

## About the SaaS Security Insights Logs Page

On the SaaS Security Insights Logs page (Analytics > SaaS Security Insights > Logs), you can do the following:

- Clear all filters. You are redirected to the default Insights page.
- Click to show or hide the left pane.
- Choose a predefined time frame or select Custom to use the calendar and time menus to define your own time frame. In Custom, the end date can be up to 92 days after start date.
- View the records in a log table. You can search for specific entries wherever you see a magnifying glass on a column field name. You can also sort certain columns by ascending or descending order. To customize the column fields:
  - Click the icon on the top right of the logs to list the available fields for display. Tick a box to add a column or clear it to remove a column. Alternatively, click Select all or Deselect all to display or remove all columns.
  - Drag a column to another location.
  - Resize a column by positioning the cursor on its border and dragging it to the desired width.
  - Customize your log view by selecting or deselecting which column fields you want to see.

Each application category has its own set of columns:

- Collaboration Columns
- CRM Columns
- Email Columns
- File Columns
- Gen AI Columns
- ITSM Columns
- Public Cloud Storage Columns
- Repository Columns

- Filter the data by application category. You can filter by Collaboration, CRM, Email, File, Gen AI, ITSM, or Repository. Depending on the application category you select, certain filters change accordingly.
- Define filters to narrow down the list or to find records, such as those associated with a specific URL. Certain filters, like Users, Departments, Locations, and others, support the selection of multiple values. For these, you can select up to 200 values in a single filter. You can also choose to include or exclude the selected values. Also, certain filters support additional operators (i.e., Does Not Contain, Does Not Start With, Does Not End With, Is Null, Is Not Null) for filters that perform string match, like Threat Super Category and others.

Each application category has its own set of log filters:

- Collaboration Log Filters
- CRM Log Filters
- Email Log Filters
- File Log Filters
- Gen AI Log Filters
- ITSM Log Filters
- Public Cloud Storage Log Filters
- Repository Log Filters

- You can either download the list of transactions as a CSV file or keep it displayed on your screen. When you download the list, the Zscaler service only exports visible columns. It exports up to 100K lines of data at a time. You can continue to use the service while the export is in progress. The limit for the number of times you can export is 20 requests/hour. For a complete list of ranges and limits per feature, see Ranges & Limitations.
- Choose the number of records that you want displayed on the page.
- Always click Apply Filters to activate your changes.
- View the weblog time, which appears at the bottom of every window. The Nanolog servers collect the logs of all users worldwide, and then consolidates and correlates them. The weblog time displays the date and time of the logs that are being processed by the Nanolog servers.
- Go to the Insights page.
