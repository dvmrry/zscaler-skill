# Autonomous Application Shield: scans, recommended controls and scan reports (zpa.appprotection.autonomous-application-shield)
Also called: auto application shield; app scanner; ai scan private applications

Autonomous Application Shield uses AI to identify risks in private applications: they are scanned at a specific scanning intensity and time, the scan reports are forwarded to the Zscaler cloud AI system, and existing AppProtection controls are then assigned to application segments to monitor or block vulnerabilities. [zpa.appprotection.autonomous-application-shield:overview] Before using Autonomous Application Shield, App Connectors must be designated as App Scanners, a scan profile created and a scan created. [zpa.appprotection.autonomous-application-shield:prerequisites]

**Protection page.** The Protection page shows the threat severity levels found while scanning the applications, the number of recommended AppProtection controls and the number deployed for the scan; clicking an application segment shows its AppProtection controls, each with a Control Type (Predefined or ThreatLabZ), a Status (for example Deployed), an Applications Count and a CVEs Count. [zpa.appprotection.autonomous-application-shield:protection-page] A control's assessment findings include the CVE ID, the detected date and the CVSS score. [zpa.appprotection.autonomous-application-shield:assessment-findings] Auto Application Shield is enabled by default and can be disabled from the application segment. Each control's action is Monitor, which monitors the applications associated with that threat, or Block, which blocks them. [zpa.appprotection.autonomous-application-shield:configure-protection]

**Scan status and reports.** On the Scan Status page the list of application segments shows, for each, a Scan ID, Status, Start Time, End Time, Applications and CVEs Count; clicking an application segment shows its App Scanners, each with the associated App Scanner for the scan and a Scan Interval. [zpa.appprotection.autonomous-application-shield:scan-status] A scan report is downloaded with Download Report in CSV or PDF format, and the scan information details are downloaded into a JSON file with the Download icon. [zpa.appprotection.autonomous-application-shield:report-downloads]

The AppProtection controls it assigns are in [AppProtection controls: kinds, OWASP groups and versions](kb:zpa.appprotection.controls). The scan settings, control statuses, licence and interaction with a profile are open [gap:zpa.appprotection.autonomous-application-shield:scan-settings] [gap:zpa.appprotection.autonomous-application-shield:profile-interaction].

What to check:
1. Whether App Connectors are designated as App Scanners and a scan profile and scan exist before expecting recommended controls.
2. Whether Auto Application Shield is still enabled on the application segment, since it is enabled by default and can be disabled.

Not known (open gaps):
- Scan settings, statuses and licence [gap:zpa.appprotection.autonomous-application-shield:scan-settings]: settled by source-read or support-ticket
- How Auto Application Shield's control assignment interacts with an AppProtection profile [gap:zpa.appprotection.autonomous-application-shield:profile-interaction]: settled by lab-test or support-ticket

Area: zpa.appprotection, its subjects in references/_meta/spine/zpa/zpa.appprotection.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.appprotection.entitlement.md (Which AppProtection capabilities depend on the subscription), from zpa.appprotection: Depending on the AppProtection subscription, the AppProtection Policy page shows a Browser Protection security policy option. [zpa.appprotection.entitlement:browser-protection-option]
- logged-in references/_meta/text/zpa/zpa.appprotection.logging.md (Where AppProtection events go: the LSS log type and its fields), from zpa.appprotection: A Log Streaming Service log receiver can capture an AppProtection log type: information related to AppProtection policy activity. [zpa.appprotection.logging:lss-log-type]
- decided-by references/_meta/text/zpa/zpa.appprotection.policy.md (AppProtection policy rules: actions, criteria and operators), from zpa.appprotection: Private Access policy rules, a set that includes AppProtection policy, are evaluated top-down and the first matching rule is enforced. [zpa.appprotection.policy:first-match]
- decided-by references/_meta/text/zpa/zpa.appprotection.profiles.md (AppProtection profiles: control selection, paranoia level, actions and the default profile), from zpa.appprotection: A profile's override options are Override None, Override All Controls and Override Specific Controls; Override None is the default, and Specific can set a different action on each selected control. [zpa.appprotection.profiles:override-modes]
- scoped-by references/_meta/text/zpa/zpa.appprotection.segment-opt-in.md (Enabling AppProtection on an application segment), from zpa.appprotection: The segment's Auto AppProtection setting lets the segment's traffic be inspected by AppProtection; enabling it requires an Enrollment (CA) Certificate. [zpa.appprotection.segment-opt-in:auto-appprotection]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.appprotection: Private Access has separate policy types, including access, client forwarding, isolation, timeout, redirection, AppProtection and Browser Protection policy. [zpa.policy.evaluation-order:policy-types]
- links-to references/_meta/text/zpa/zpa.appprotection.controls.md (AppProtection controls: kinds, OWASP groups and versions)
