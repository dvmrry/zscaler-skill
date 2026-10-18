# Ranges & Limitations

**Source:** https://help.zscaler.com/deception/ranges-and-limitations
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1542389, revision 3221723

---

This article lists the ranges and limitations for Zscaler Deception features. All values are per organization unless noted otherwise.
- If you need to increase maximum limits or upgrade the plan from Deception Standard to Deception Advanced, contact your Zscaler Account team or send a request to Zscaler Support.
- If you switch plans, then you can use only the features that are available in the active plan. Any additional features that are not a part of the active plan are disabled.
- If you subscribed to a Internet & SaaS (ZIA) or Private Access (ZPA) edition that includes a Deception Standard or Deception Advanced plan, you must have a minimum of 1,000 users in your subscription to be eligible to claim your Deception entitlement.
# Decoy Connectors
The total number of Decoy Connectors is equal to the number of decoys included in your Deception license. For example, if your license has 50 decoys, you get 50 Decoy Connectors. System limitations are applicable.
# Decoys
The following table shows the ranges and limitations for the decoy settings.
| Feature | Standard Plan | Advanced Plan |
|---|---|---|
| Decoys | 20 | 300 |
| Zscaler Client Connector - Integrated Landmine Decoys | The number of unique Zscaler Client Connector users across all landmines in the active state. |  |
| Standalone Landmine Decoys | The number of unique hostnames across all landmines in the active state. |  |
| Agentless Landmine Decoys | The number of unique hostnames across all landmines in the active state. |  |
| Windows High-Interaction Virtual Machine Decoys | Not supported | Supported |
| High-Interaction Container Decoys | Not supported | Supported |
| Gen AI Decoys | Not supported | Supported |
- For licensing purposes, the total number of active landmine decoys is computed every day and is equal to the sum of Zscaler Client Connector landmine decoys, standalone landmine decoys, and agentless landmine decoys.
- The number of decoys included in your Zscaler Deception plan is the sum of Threat Intelligence (TI) Decoys, Network Decoys, Cloud Decoys (Azure Decoys and AWS Decoys), and Active Directory Decoys.
- The number of network decoys with custom services enabled is limited to 10.
- You can deploy a high-interaction container as a Threat Intelligence (TI) decoy or network decoy (web service or custom dockers). A maximum of 5 high-interaction containers is allowed per license.
# Landmine Policies
The following table shows the ranges and limitations for the Landmine Policies settings.
| Deception Module | Feature | Standard Plan | Advanced Plan |
|---|---|---|---|
| Defense Evasion | Fake Security Process | Not supported | Supported |
| Privilege Escalation | MITM Detection | Not supported | Supported |
| Brute Force Detection | Not supported | Supported |  |
| Kerberoast Detection | Not supported | Supported |  |
| Man-in-the-Middle (MITM) Attack Decoys | Not supported | Supported |  |
| In Memory Credential Detection | Not supported | Supported |  |
| Cloud Lures | Amazon Web Services (AWS) Identity Access Management (IAM) | Supported | Supported |
| Browser Lures | Chrome | Supported | Supported |
| Firefox | Supported | Supported |  |
| Internet Explorer | Supported | Supported |  |
| Session Lures | Windows Credentials | Supported | Supported |
| WinSCP Session | Supported | Supported |  |
| Bash History | Supported | Supported |  |
| SSH Config | Supported | Supported |  |
| DbVisualizer | Supported | Supported |  |
| Network Drives | Supported | Supported |  |
| FileZilla | Supported | Supported |  |
| PuTTY | Supported | Supported |  |
| Remote Desktop Protocol (RDP) | Supported | Supported |  |
| Squirrel DB | Supported | Supported |  |
| File Decoys | Custom File Decoys | Supported | Supported |
| Credential File Decoys | Supported | Supported |  |
| Preconfigured File Dataset Decoys | Supported | Supported |  |
| Advanced Deception Capabilities | PsExec Detection | Not supported | Supported |
| Ransomware Detection | Not supported | Supported |  |
| Triage | Not supported | Supported |  |
# Orchestrate
The following table shows the ranges and limitations for the Orchestrate settings.
| Feature | Standard Plan | Advanced Plan |
|---|---|---|
| Orchestration Rules | Built-in rules supported | Built-in and custom rules supported |
| Enrichment Integration | Not supported | Supported |
| SIEM Forwarding | Not supported | Supported |
| Containment Integration | Not supported | Supported |
| Customizing Event Notification Templates | Not supported | Supported |
| Zscaler Sandbox Integration | Not supported | Supported |
| Managed Threat Hunting Integration | Not supported | Supported |
| Private Access Containment | Not supported | Supported |
| Fair Usage Policy (FUP) for Email Notifications | Deception limits the number of email notifications triggered to 500 emails per day. |  |
# Miragemaker
The following table shows the ranges and limitations for the Miragemaker settings.
| Feature | Standard Plan | Advanced Plan |
|---|---|---|
| Static Application Datasets | Built-in datasets supported | Built-in and custom datasets supported |
| Vulnerable Application Datasets | Built-in datasets supported | Built-in and custom datasets supported |
| Dynamic Application Datasets | Built-in datasets supported | Built-in and custom datasets supported |
| High-Interaction Containers | Built-in datasets supported | Built-in and custom datasets supported |
| SCADA/IoT Datasets | Built-in datasets supported | Built-in and custom datasets supported |
| Keyword Datasets | Built-in and custom datasets supported | Built-in and custom datasets supported |
| ThreatParse Rules | Built-in rules supported | Built-in and custom rules supported |
| Custom Service Datasets | Built-in datasets supported | Built-in and custom datasets supported |
| File Datasets | Built-in datasets supported | Built-in and custom datasets supported |
| File Templates | Built-in templates supported | Built-in and custom templates supported |
| Network Decoy Personality Builder | Built-in personalities supported | Built-in and custom personalities supported |
| AD Personality Builder | Built-in personalities supported | Built-in and custom personalities supported |
| Threat Intelligence (TI) Personality Builder | Built-in personalities supported | Built-in and custom personalities supported |
| Landmine Personality Builder | Built-in personalities supported | Built-in and custom personalities supported |
| Datalist Personality Builder | Built-in personalities supported | Built-in and custom personalities supported |
| FTP Banners | Built-in banners supported | Built-in and custom banners supported |
| Web Server Banners | Built-in banners supported | Built-in and custom banners supported |
| Tags | Built-in tags supported | Built-in and custom tags supported |
# Enterprise
The following table shows the ranges and limitations for the Enterprise settings.
| Feature | Standard Plan | Advanced Plan |
|---|---|---|
| Single Sign-On | Supported | Supported |
| Roles | Predefined rules supported | Predefined and custom roles supported |
| API Access | Not supported | Supported |
| Audit Logs | Supported | Supported |
