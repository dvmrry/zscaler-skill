# AppProtection controls: kinds, OWASP groups and versions (zpa.appprotection.controls)
Also called: appprotection controls; owasp predefined controls; threatlabz controls; owasp_crs version migrate; websocket controls appprotection; api controls appprotection; custom controls appprotection

Controls are the detection rules that a profile selects. AppProtection controls are grouped as predefined controls from ThreatLabZ, OWASP and WebSocket, or as custom WebSocket or HTTP controls. [zpa.appprotection.controls:control-groups] The console also has separate API Controls and Active Directory Controls pages, and profiles can use both. [zpa.appprotection.controls:api-and-ad-pages]

**OWASP.** The OWASP predefined controls are organized into thirteen categories: Preprocessors, Environment and Port Scanners, Protocol Issues, Request Smuggling or Response Split or Header Injection, Local File Inclusion, Remote File Inclusion, Remote Code Execution, PHP Injection, Cross-Site Scripting (XSS), SQL Injection, Session Fixation, Deserialization, and Issues Anomalies. [zpa.appprotection.controls:owasp-categories] Each OWASP predefined control shows a control number, name, description, paranoia level, severity of Low, Medium, High or Critical, and a control action. [zpa.appprotection.controls:control-fields]

**Versions.** The OWASP predefined controls table is on version OWASP_CRS/4.8.0 by default, and some predefined controls are unavailable in older versions. [zpa.appprotection.controls:owasp-version-default] The Unsupported filter lists the outdated versions, and its Migrate action migrates all of them to the latest version. [zpa.appprotection.controls:unsupported-migrate] Whether outdated controls are ever migrated without that action is open [gap:zpa.appprotection.controls:no-auto-upgrade]. How many controls the OWASP groups hold is open [gap:zpa.appprotection.controls:owasp-control-count].

**ThreatLabZ.** ThreatLabZ predefined controls are up-to-date controls written and maintained by the Zscaler Security team for emerging attack vectors and vulnerabilities, and are created to address confirmed CVEs. [zpa.appprotection.controls:threatlabz-cves]

**API.** API controls inspect API traffic by flagging transactions that include security violations such as social security numbers and credit card numbers, in the categories Security Misconfiguration, Server Side Request Forgery and Info Disclosure Controls. [zpa.appprotection.controls:api-controls]

**WebSocket.** WebSocket predefined controls are populated automatically in the portal and are organized into WebSocket Handshake Headers Check, WebSocket Framing Errors, Frame Type Verification, Client Mask Bit Verification and Server Unmask Bit Verification. [zpa.appprotection.controls:websocket-predefined]

**Custom.** Custom controls define specific request and response elements and the action to handle them, and several can be used in one profile. [zpa.appprotection.controls:custom-controls] A custom control, or a WebSocket control, that is in use by an AppProtection profile cannot be deleted. [zpa.appprotection.controls:custom-in-use-undeletable]

Parameters, operators, limits and regular expressions of custom HTTP and WebSocket controls: [AppProtection custom HTTP and WebSocket controls: parameters, operators, limits and regular expressions](kb:zpa.appprotection.custom-controls).

How controls are chosen, given a paranoia level and an action: [AppProtection profiles: control selection, paranoia level, actions and the default profile](kb:zpa.appprotection.profiles). The Active Directory controls: [Active Directory controls: Kerberos, SMB and LDAP inspection](kb:zpa.appprotection.active-directory).

What to check:
1. Which kind of control the finding or rule belongs to, and whether it is predefined or custom.
2. Which OWASP_CRS version the profile and the controls table are on, and whether outdated controls remain.
3. Whether a custom control is still used by a profile before deleting it.

Not known (open gaps):
- Whether outdated OWASP controls are ever upgraded without the Migrate action [gap:zpa.appprotection.controls:no-auto-upgrade]: settled by tenant-data or support-ticket
- How many controls the OWASP groups hold [gap:zpa.appprotection.controls:owasp-control-count] (data gap): filled by operator; settled by tenant-data or source-read

Area: zpa.appprotection, its subjects in references/_meta/spine/zpa/zpa.appprotection.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.appprotection.profiles.md (AppProtection profiles: control selection, paranoia level, actions and the default profile): A profile's override options are Override None, Override All Controls and Override Specific Controls; Override None is the default, and Specific can set a different action on each selected control. [zpa.appprotection.profiles:override-modes]
- depends-on references/_meta/text/zpa/zpa.appprotection.entitlement.md (Which AppProtection capabilities depend on the subscription), from zpa.appprotection: Depending on the AppProtection subscription, the AppProtection Policy page shows a Browser Protection security policy option. [zpa.appprotection.entitlement:browser-protection-option]
- logged-in references/_meta/text/zpa/zpa.appprotection.logging.md (Where AppProtection events go: the LSS log type and its fields), from zpa.appprotection: A Log Streaming Service log receiver can capture an AppProtection log type: information related to AppProtection policy activity. [zpa.appprotection.logging:lss-log-type]
- decided-by references/_meta/text/zpa/zpa.appprotection.policy.md (AppProtection policy rules: actions, criteria and operators), from zpa.appprotection: Private Access policy rules, a set that includes AppProtection policy, are evaluated top-down and the first matching rule is enforced. [zpa.appprotection.policy:first-match]
- scoped-by references/_meta/text/zpa/zpa.appprotection.segment-opt-in.md (Enabling AppProtection on an application segment), from zpa.appprotection: The segment's Auto AppProtection setting lets the segment's traffic be inspected by AppProtection; enabling it requires an Enrollment (CA) Certificate. [zpa.appprotection.segment-opt-in:auto-appprotection]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.appprotection: Private Access has separate policy types, including access, client forwarding, isolation, timeout, redirection, AppProtection and Browser Protection policy. [zpa.policy.evaluation-order:policy-types]
- links-to references/_meta/text/zpa/zpa.appprotection.active-directory.md (Active Directory controls: Kerberos, SMB and LDAP inspection)
- links-to references/_meta/text/zpa/zpa.appprotection.custom-controls.md (AppProtection custom HTTP and WebSocket controls: parameters, operators, limits and regular expressions)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.appprotection.api-surface.md (AppProtection through the API and the Python SDK: versions, Active Directory controls, attach and detach)
