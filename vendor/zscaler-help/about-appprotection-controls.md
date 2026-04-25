# About AppProtection Controls

**Source:** https://help.zscaler.com/zpa/about-appprotection-controls
**Captured:** 2026-04-24 via Playwright MCP.

---

All AppProtection profiles have a set of AppProtection controls that you can use to define how AppProtections are managed. AppProtection controls are grouped by predefined controls that come from **ThreatLabZ**, **Open Web Application Security Project (OWASP)**, and **WebSocket**, or **custom WebSocket or HTTP controls**.

## Benefits

- Protect internal applications from all types of attacks in the OWASP predefined controls — SQL injection, cross-site scripting (XSS), and more.
- Understand the severity, description, and recommended default action for each type of attack related to OWASP predefined controls.

## OWASP control categories

Each OWASP predefined control is identified with a unique number, defined with how the control operates, and is associated with the level of concern. Categories:

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

## OWASP Predefined Controls Page

(Policies > Cybersecurity > Configuration & Control > Inline Security > Protection Controls > OWASP Predefined Controls)

- By default, the version is set to **OWASP_CRS/4.8.0**. Some predefined controls are unavailable in older versions. You can select the **Unsupported** filter to list all of the outdated versions. With this filter, you can select **Migrate** to migrate all of the outdated versions to the latest version.
- For each predefined control type, expand to view:
  - **Control Number** — number identifying the predefined control.
  - **Description** — explanation of how the control works.
  - **Paranoia Level** — corresponds to the levels available in an AppProtection profile.
  - **Used in AppProtection Profiles** — the AppProtection profiles using the predefined control.
  - **Control Name**
  - **Severity** — Low / Medium / High / Critical.
  - **Control Action** — what action occurs when the predefined control is in use.
- Cross-links to: ThreatLabZ Controls, Custom Controls, WebSocket Controls, API Controls, Active Directory.
