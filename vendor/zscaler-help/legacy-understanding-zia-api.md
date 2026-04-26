# Understanding ZIA APIs

**Source:** https://help.zscaler.com/legacy-apis/understanding-zia-api
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Zscaler Internet Access (ZIA) provides three APIs: the cloud service API, Sandbox Submission API, and 3rd-Party App Governance API. To learn more about authentication, making API calls, and activating configuration changes, see Getting Started (`/zia/api-getting-started`). For detailed information on all available API calls, endpoints, and parameters, see the Reference Guide (`/zia/about-api`). For a table summarizing all available API calls, endpoints, and rate limits, see the API Rate Limit Summary (`/zia/api-rate-limit-summary`). To try out requests and responses for API calls using the Postman app, see Configuring the Postman REST API Client (`/zia/configuring-postman-rest-api-client`).

## Cloud Service API

Availability of the cloud service API is limited. To enable this API for your organization, contact Zscaler Support.

The cloud service API gives you programmatic access to the following ZIA features:

- Activation
- Admin Audit Logs
- Admin & Role Management
- Advanced Settings
- Advanced Threat Protection Policy
- Alerts
- API Authentication
- Authentication Settings
- Bandwidth Control & Classes
- Browser Control Policy
- Browser Isolation
- Cloud Applications
- Cloud App Control Policy
- Cloud Nanolog Streaming Service (NSS)
- Data Loss Prevention (DLP)
- Device Groups
- DNS Control Policy
- End User Notifications
- Event Logs
- File Type Control Policy
- Firewall Policies
- Forwarding Control Policy
- FTP Control Policy
- Intermediate CA Certificates
- IoT Report
- IPS Control Policy
- Location Management and Traffic Forwarding
- Malware Protection Policy
- Mobile Malware Protection Policy
- NAT Control Policy
- Organization Details
- PAC Files
- Policy Export
- Remote Assistance Support
- Rule Labels
- SaaS Security API
- Sandbox Policy & Settings
- Sandbox Report
- Security Policy Settings
- Service Edges
- Shadow IT Report
- SSL Inspection Policy
- System Audit Report
- Time Intervals
- Traffic Capture Policy
- URL Categories
- URL Filtering Policy
- URL & Cloud App Control Policy Settings
- User Authentication Settings
- User Management
- Workload Groups

## Sandbox Submission API

To obtain access to the Sandbox Submission API, contact your Zscaler Account team.

The Sandbox Submission API gives you programmatic access to Zscaler Sandbox, which allows you to submit files to perform behavioral analysis. By default, files are directly submitted to the Sandbox to obtain a verdict. If a verdict already exists for the file, you can optionally force the Sandbox to reanalyze the file. You can submit up to 100 raw and archive files (e.g., ZIP) per day for Sandbox analysis.

The Sandbox Submission API also allows you to perform out-of-band file inspection to generate real-time verdicts. Zscaler leverages capabilities such as Malware Prevention, Advanced Threat Prevention, Sandbox cloud effect, AI/ML-driven file analysis, and integrated third-party threat intelligence feeds to inspect files and classify them as benign or malicious instantaneously. You can submit raw and archive files (e.g., ZIP), and each file is limited to a maximum size of 400 MB.

Dynamic file analysis is not included in out-of-band file inspection.

- Reference Guide > Sandbox Submission (`/zia/cloud-sandbox-submission`)
- Configuring the Sandbox Policy (`/zia/configuring-sandbox-policy`)
- Configuring the Default Sandbox Rule (`/zia/configuring-default-sandbox-rule`)

## 3rd-Party App Governance API

To access the 3rd-Party App Governance API, you must have a 3rd-Party App Governance trial or license. To obtain a trial or license, contact your Zscaler Account team.

The 3rd-Party App Governance API gives you programmatic access to Zscaler 3rd-Party App Governance, which allows you to search the 3rd-Party App Governance Catalog for an application by name, app ID, or a valid URL (i.e., consent or marketplace link). If the application is not found in the catalog, it is automatically submitted to the 3rd-Party App Governance Sandbox for analysis.

The 3rd-Party App Governance API also allows you to retrieve the list of custom views (`/zia/custom-views/`) that you have configured in the 3rd-Party App Governance Admin Portal and includes all configurations that define the custom view.

See Reference Guide > 3rd-Party App Governance (`/zia/apptotal-api`).

## Navigation note

The `legacy-apis` namespace on help.zscaler.com contains only ZIA API documentation. The sidebar shows:
- Legacy Zscaler APIs Help (`/legacy-apis`)
- ZIA API (`/legacy-apis/zia-api`)
- Understanding ZIA APIs (`/legacy-apis/understanding-zia-api`)

The "Getting Started," "Reference Guide," and "Rate Limit Summary" links within this section point to `/zia/` paths (separate namespace), not `/legacy-apis/` paths.
