# ZPA AppProtection (zpa.appprotection)
Also called: appprotection; zpa waf; zpa ips; zpa inspection; inline inspection private applications; zpa appprotection overview

AppProtection inspects traffic to private applications for attacks, as a question separate from who may reach them. AppProtection does inline inspection of application flows in real time for malicious content, including HTTPS traffic through real-time inspection of encrypted traffic. [zpa.appprotection:inline-inspection] AppProtection has built-in controls for the most common attack types, including the OWASP Top 10 such as SQL injection and cross-site scripting, and it watches for network discovery tools such as port scanners. [zpa.appprotection:builtin-controls]

1. **Which name is in front of you?** The console says AppProtection while the SDK, API and Terraform say Inspection: [AppProtection and the older Inspection names](kb:zpa.appprotection.naming).
2. **Is the application set up for it?** A profile is added to an AppProtection policy for Private Access to use, and the web applications that require AppProtection before users can access them are identified when the application segment is created. [zpa.appprotection:profile-into-policy] The segment switch and its exclusions: [Enabling AppProtection on an application segment](kb:zpa.appprotection.segment-opt-in); the Active Directory path: [Active Directory controls: Kerberos, SMB and LDAP inspection](kb:zpa.appprotection.active-directory).
3. **Which rule applies?** Actions, criteria and operators: [AppProtection policy rules: actions, criteria and operators](kb:zpa.appprotection.policy).
4. **What does the profile do?** Paranoia level, actions and the default profile: [AppProtection profiles: control selection, paranoia level, actions and the default profile](kb:zpa.appprotection.profiles); the controls themselves: [AppProtection controls: kinds, OWASP groups and versions](kb:zpa.appprotection.controls); custom HTTP and WebSocket controls: [AppProtection custom HTTP and WebSocket controls: parameters, operators, limits and regular expressions](kb:zpa.appprotection.custom-controls).
5. **Where do events go?** [Where AppProtection events go: the LSS log type and its fields](kb:zpa.appprotection.logging); the console dashboards and diagnostics: [AppProtection dashboards and diagnostics: violations, API protection, Protocol Discovery and MITRE ATT&CK](kb:zpa.appprotection.monitoring).
6. **What depends on the subscription?** [Which AppProtection capabilities depend on the subscription](kb:zpa.appprotection.entitlement); monitoring Browser Protection: [Browser Protection: monitored users, browser fingerprints and Clientless Access diagnostics](kb:zpa.appprotection.browser-protection); Browser Protection rules and profiles: [Browser Protection policy rules and profiles: actions, criteria and fingerprint settings](kb:zpa.appprotection.browser-protection-policy).

Scans and recommended controls for private applications: [Autonomous Application Shield: scans, recommended controls and scan reports](kb:zpa.appprotection.autonomous-application-shield). Calls and SDK behavior: [AppProtection through the API and the Python SDK: versions, Active Directory controls, attach and detach](kb:zpa.appprotection.api-surface).

What to check:
1. Walk the questions in order: the name, the segment switch, the rule, the profile, the controls, the log.

Area: zpa.appprotection, its subjects in references/_meta/spine/zpa/zpa.appprotection.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.appprotection.entitlement.md (Which AppProtection capabilities depend on the subscription): Depending on the AppProtection subscription, the AppProtection Policy page shows a Browser Protection security policy option. [zpa.appprotection.entitlement:browser-protection-option]
- logged-in references/_meta/text/zpa/zpa.appprotection.logging.md (Where AppProtection events go: the LSS log type and its fields): A Log Streaming Service log receiver can capture an AppProtection log type: information related to AppProtection policy activity. [zpa.appprotection.logging:lss-log-type]
- decided-by references/_meta/text/zpa/zpa.appprotection.policy.md (AppProtection policy rules: actions, criteria and operators): Private Access policy rules, a set that includes AppProtection policy, are evaluated top-down and the first matching rule is enforced. [zpa.appprotection.policy:first-match]
- decided-by references/_meta/text/zpa/zpa.appprotection.profiles.md (AppProtection profiles: control selection, paranoia level, actions and the default profile): A profile's override options are Override None, Override All Controls and Override Specific Controls; Override None is the default, and Specific can set a different action on each selected control. [zpa.appprotection.profiles:override-modes]
- scoped-by references/_meta/text/zpa/zpa.appprotection.segment-opt-in.md (Enabling AppProtection on an application segment): The segment's Auto AppProtection setting lets the segment's traffic be inspected by AppProtection; enabling it requires an Enrollment (CA) Certificate. [zpa.appprotection.segment-opt-in:auto-appprotection]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types): Private Access has separate policy types, including access, client forwarding, isolation, timeout, redirection, AppProtection and Browser Protection policy. [zpa.policy.evaluation-order:policy-types]
- links-to references/_meta/text/zpa/zpa.appprotection.active-directory.md (Active Directory controls: Kerberos, SMB and LDAP inspection)
- links-to references/_meta/text/zpa/zpa.appprotection.api-surface.md (AppProtection through the API and the Python SDK: versions, Active Directory controls, attach and detach)
- links-to references/_meta/text/zpa/zpa.appprotection.autonomous-application-shield.md (Autonomous Application Shield: scans, recommended controls and scan reports)
- links-to references/_meta/text/zpa/zpa.appprotection.browser-protection.md (Browser Protection: monitored users, browser fingerprints and Clientless Access diagnostics)
- links-to references/_meta/text/zpa/zpa.appprotection.browser-protection-policy.md (Browser Protection policy rules and profiles: actions, criteria and fingerprint settings)
- links-to references/_meta/text/zpa/zpa.appprotection.controls.md (AppProtection controls: kinds, OWASP groups and versions)
- links-to references/_meta/text/zpa/zpa.appprotection.custom-controls.md (AppProtection custom HTTP and WebSocket controls: parameters, operators, limits and regular expressions)
- links-to references/_meta/text/zpa/zpa.appprotection.monitoring.md (AppProtection dashboards and diagnostics: violations, API protection, Protocol Discovery and MITRE ATT&CK)
- links-to references/_meta/text/zpa/zpa.appprotection.naming.md (AppProtection and the older Inspection names)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zpa/zpa.api.cbi-appprotection-wire.md (Cloud Browser Isolation and AppProtection API: paths, writes and version handling)
