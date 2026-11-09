# Active Directory controls: Kerberos, SMB and LDAP inspection (zpa.appprotection.active-directory)
Also called: active directory protection zpa; kerberos smb ldap inspection zpa; ad controls appprotection; active directory inspection segment; ad protection dashboard

Active Directory inspection is a separate protocol path from web inspection. Active Directory controls are predefined controls enforced by enabling Active Directory in an application segment, for the protocols Kerberos, SMB and LDAP. [zpa.appprotection.active-directory:ad-definition]

**On the segment.** An application segment has an Active Directory Inspection setting, off by default, and its data is on the AD Protection Diagnostics page. [zpa.appprotection.active-directory:ad-segment-setting] With Active Directory Inspection enabled, each port range offers Inspect None, Inspect LDAP, Inspect SMB and Inspect Kerberos. [zpa.appprotection.active-directory:ad-protocol-choice] An application segment with Active Directory Inspection enabled that contains a domain or port range different from the set protocol traffic cannot be inspected. [zpa.appprotection.active-directory:ad-mismatched-traffic] It cannot be enabled together with AppProtection on the same segment: [Enabling AppProtection on an application segment](kb:zpa.appprotection.segment-opt-in).

**In profiles and results.** Active Directory controls can be added to an AppProtection profile, which defines how they and the other AppProtection controls are managed. [zpa.appprotection.active-directory:ad-in-profile] Active Directory control inspection results are shown on the Active Directory Protection dashboard. [zpa.appprotection.active-directory:ad-dashboard] The log types for the results are in [Where AppProtection events go: the LSS log type and its fields](kb:zpa.appprotection.logging).

**On the dashboard.** The Active Directory Protection dashboard shows data over 1 Hour to 14 Days or a Custom Range, with a minimum of 4 and a maximum of 8 charts selectable. Widgets list the top 10 LDAP suspicious queries, SMB suspicious activity and Kerberos TGT suspicious activity by user. [zpa.appprotection.active-directory:ad-dashboard-widgets] The Kerberos TGT errors widget error counts do not include these common errors: KDC_ERR_PREAUTH_REQUIRED (25), KRB_AP_ERR_TKT_EXPIRED (32), KRB_ERR_RESPONSE_TOO_BIG (52), KDC_ERR_BADOPTION (13), KDC_ERR_NEVER_VALID (11), KRB_AP_ERR_SKEW (37), KDC_ERR_ETYPE_NOSUPP (14), KDC_ERR_S_PRINCIPAL_UNKNOWN (7) and KRB_AP_ERR_MODIFIED (41). The Kerberos TGS errors widget carries its own statement that its counts exclude common errors. [zpa.appprotection.active-directory:ad-tgt-excluded-errors]

**What the dashboard counts.** For a selected user the dashboard counts Account Harvesting Indications as Active Directory login failures, Kerberoasting Requests as ticket requests with weak encryption such as RC4 and DES, and KRB TGS Activity as TGS requests for various services in the Active Directory domain. The Top Users by SMB Suspicious Activity widget lists the top 10 SMB suspicious activity by user, and that activity data consists of session and user enumeration. [zpa.appprotection.active-directory:ad-indicators] Which attacks the Active Directory controls detect is open [gap:zpa.appprotection.active-directory:attack-coverage].

How the API and the Python SDK expose these controls: [AppProtection through the API and the Python SDK: versions, Active Directory controls, attach and detach](kb:zpa.appprotection.api-surface).

What to check:
1. Whether Active Directory Inspection, not AppProtection, is enabled on the application segment.
2. Which protocol the port range inspects: LDAP, SMB, Kerberos or none.
3. The Active Directory Protection dashboard and the three inspection log types for the results.

Not known (open gaps):
- Which attacks the Active Directory controls detect [gap:zpa.appprotection.active-directory:attack-coverage] (data gap): filled by operator; settled by tenant-data or source-read

Area: zpa.appprotection, its subjects in references/_meta/spine/zpa/zpa.appprotection.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zpa/zpa.appprotection.logging.md (Where AppProtection events go: the LSS log type and its fields): Kerberos, LDAP and SMB inspection each have their own LSS log type: KRB Inspection Logs, LDAP Inspection Logs and SMB Inspection Logs. [zpa.appprotection.logging:ad-log-types]
- scoped-by references/_meta/text/zpa/zpa.appprotection.segment-opt-in.md (Enabling AppProtection on an application segment): An application segment has an Active Directory Inspection setting, off by default, and its data is on the AD Protection Diagnostics page. [zpa.appprotection.active-directory:ad-segment-setting]
- decided-by references/_meta/text/zpa/zpa.appprotection.profiles.md (AppProtection profiles: control selection, paranoia level, actions and the default profile): Active Directory controls can be added to an AppProtection profile, which defines how they and the other AppProtection controls are managed. [zpa.appprotection.active-directory:ad-in-profile]
- depends-on references/_meta/text/zpa/zpa.appprotection.entitlement.md (Which AppProtection capabilities depend on the subscription), from zpa.appprotection: Depending on the AppProtection subscription, the AppProtection Policy page shows a Browser Protection security policy option. [zpa.appprotection.entitlement:browser-protection-option]
- decided-by references/_meta/text/zpa/zpa.appprotection.policy.md (AppProtection policy rules: actions, criteria and operators), from zpa.appprotection: Private Access policy rules, a set that includes AppProtection policy, are evaluated top-down and the first matching rule is enforced. [zpa.appprotection.policy:first-match]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.appprotection: Private Access has separate policy types, including access, client forwarding, isolation, timeout, redirection, AppProtection and Browser Protection policy. [zpa.policy.evaluation-order:policy-types]
- links-to references/_meta/text/zpa/zpa.appprotection.api-surface.md (AppProtection through the API and the Python SDK: versions, Active Directory controls, attach and detach)
