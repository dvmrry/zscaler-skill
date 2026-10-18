# About AppProtection Controls

**Source:** https://help.zscaler.com/zpa/about-appprotection-controls
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1484976, revision 3240242

---

All AppProtection profiles have a set of AppProtection controls that you can use to help you define how AppProtections are managed. AppProtection controls are grouped by predefined controls that come from ThreatLabZ, Open Web Application Security Project (OWASP), and WebSocket, or custom WebSocket or HTTP controls. To learn more, see About ThreatLabZ Controls, About Custom Controls, and About WebSocket Controls.
AppProtection controls provide the following benefits and enable you to:
- Protect internal applications from all types of attacks in the OWASP predefined controls with SQL injection, cross-site scripting (XSS), and more.
- Understand the severity, description, and recommended default action for each type of attack related to OWASP predefined controls.
Each OWASP predefined control is identified with a unique number, defined with how the control operates, and associated with the level of concern. The predefined controls are organized into the following categories:
- Preprocessors
- Environment and Port Scanners
- Protocol Issues
- Request Smuggling or Response Split or Header Injection
- Local File Inclusion
- Remote File Inclusion
- Remote Code Execution
- PHP Injection
- Cross-Site Scripting (XSS)
- SQL Injection
- Session Fixation
- Deserialization
- Issues Anomalies
# About the OWASP Predefined Controls Page
On the OWASP Predefined Controls page (Private Access > Private App Protection > Protection Controls > OWASP Predefined Controls), you can do the following:
- View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view. To learn more, see Using Tables.
- Hide the filters on the page by clicking Hide Filters. Click Show Filters to display the filters.
- Refresh the OWASP Predefined Controls page to reflect the most current information.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions. To learn more, see Using Tables.
- Filter the version of information that appears in the table. By default, the version is set to OWASP_CRS/4.8.0. Some predefined controls are unavailable in older versions. You can select the Unsupported filter to list all of the outdated versions. With this filter, you can select Migrate to migrate all of the outdated versions to the latest version. If you are using Anomalies or Web Shells OWASP predefined control groups, you can experience download latency.
- Expand all the rows in the table to see more information about each OWASP predefined control.
- View a list of OWASP predefined controls. For each OWASP predefined control, you can view:
  - Control Number: A number identifying the OWASP predefined control. When expanded, the following information is displayed:
    - Description: An explanation of how the control works.
    - Paranoia Level: The associated level, which corresponds to the levels available in an AppProtection profile.
    - Used in AppProtection Profiles: The AppProtection profiles using the predefined control. Click an AppProtection profile if you want to edit it.
  - Control Name: The name of the OWASP predefined control.
  - Severity: The level of severity for the control number. The severity levels are Low, Medium, High, and Critical.
  - Control Action: What action occurs when the OWASP predefined control is in use.
- Modify the columns displayed in the table.
- Go to the ThreatLabZ Controls page to view and manage the available ThreatLabZ controls.
- Go to the Custom Controls page to view and manage your custom controls.
- Go to the WebSocket Controls page to view and manage the available WebSocket predefined and custom controls.
- Go to the API Controls page to view and manage the available API controls.
- Go to the Active Directory Controls page to view and manage the available Active Directory controls.
