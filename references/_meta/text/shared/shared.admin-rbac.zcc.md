# Client Connector admin roles: the Administration Management page, Full, View Only, None and Customize, the permission sections and token obfuscation (shared.admin-rbac.zcc)
Also called: client connector admin roles; zcc admin roles; zcc role management; client connector role management; zcc admin permissions; obfuscate passwords and tokens

Client Connector roles control access to Admin Console settings and are assigned to Internet & SaaS, Private Access and Digital Experience (ZDX) administrators. [shared.admin-rbac.zcc:what-roles-control] Roles are listed on the Administration Management page (Administration > Role Management > Client Connector), which shows each role's Role Name (a role created by the super admin), Full Access (settings the role can configure) and View-Only Access (settings it can only view), and where roles are added, edited, deleted and viewed. [shared.admin-rbac.zcc:role-page]

**Where roles are assigned.** Admin roles must be assigned in Authentication Service. [shared.admin-rbac.zcc:auth-service] A role name cannot contain special characters other than periods, hyphens and underscores. [shared.admin-rbac.zcc:role-name]

**Permission levels.** A role's permission for a setting is Full (view and configure settings), View Only (view settings), None (the setting is hidden) or Customize; for some settings only View Only or None is available. Full, View Only or None applies to the setting's entire section, and Customize mixes permissions per setting. [shared.admin-rbac.zcc:permission-levels]

**What each section covers.** On the Dashboard, admins can view data for all or specific users, device states and operating systems; View Only is the Dashboard's default permission and cannot be changed. [shared.admin-rbac.zcc:dashboard] The Enrolled Devices section covers Device Overview (enrolled and removed devices), Machine Tunnel (list, details and removal of machine tunnels) and Partner Devices. Full allows all settings on the Device Overview and Machine Tunnel pages, and removing devices and machine tunnels needs full access; View Only allows viewing, filtering, sorting, exporting and searching on those pages; None gives no access to them. [shared.admin-rbac.zcc:enrolled-devices] The App Profiles section lets admins view a platform's app profile rules, all configured rules, a rule's policy token and the default policy, and configure, edit or delete rules; the permission is chosen per platform. Full allows all App Profiles settings for all platforms, and configuring, editing and deleting rules needs full access, except for the default policy. [shared.admin-rbac.zcc:app-profiles] The Administration section's settings, each given a permission, are Client Connector App Store, Client Connector Notifications, Audit Logs, Forwarding Profile, Trusted Networks, Client Connector Support, Zscaler Service Entitlement, User Agent, Client Connector IdP, Device Posture, Business Continuity, Application Bypass Info, Dedicated Proxy Port, Public API, Platform Settings (formerly Authentication Settings), Device Groups, Private Access Partner Logins, Location-Based Policies and Administration Management. Admins must have full access to configure settings. [shared.admin-rbac.zcc:administration-settings]

**Sensitive data.** The Sensitive Data section includes Obfuscate Passwords and Tokens: when enabled, all passwords, OTP, policy tokens, device tokens and machine tokens in the Admin Console are obfuscated, and the page says the feature is applicable to admins who have read-only access. [shared.admin-rbac.zcc:obfuscation] Whether obfuscation affects admins with full access is open [gap:shared.admin-rbac.zcc:obfuscation-scope].

**Open.** Which settings offer only View Only or None [gap:shared.admin-rbac.zcc:view-only-settings], how Partner Devices follows the Enrolled Devices levels [gap:shared.admin-rbac.zcc:partner-devices-levels] and what the default policy exception leaves admins on App Profiles [gap:shared.admin-rbac.zcc:default-policy-exception] are not stated. Whether a predefined super admin role exists (the page names a super admin who creates roles) and whether Unified RBAC applies are not described [gap:shared.admin-rbac.zcc:super-admin-and-unified-rbac]. What admins did is in [Client Connector audit logs in the Admin Console: what is recorded, retention, columns, actions, categories and filters](kb:zcc.audit-logs); the admin copy the API keeps is in [ZCC admin users on the wire: the admin sync operations and the serviceType field](kb:zcc.api.admin-users-wire).

What to check:
1. For an admin who cannot open or change a Client Connector page, the role's permission for the section or setting that covers it, and whether Full is needed for the action (removing devices or machine tunnels, configuring app profile rules, configuring Administration settings).
2. For an admin who sees obfuscated passwords or tokens, the Obfuscate Passwords and Tokens option in the role's Sensitive Data section.
3. That admin roles are assigned in Authentication Service.

Not known (open gaps):
- Whether obfuscation affects Client Connector admins with full access [gap:shared.admin-rbac.zcc:obfuscation-scope]: settled by lab-test or support-ticket
- Which Client Connector settings offer only View Only or None [gap:shared.admin-rbac.zcc:view-only-settings]: settled by lab-test or source-read
- How Partner Devices follows the Enrolled Devices permission levels [gap:shared.admin-rbac.zcc:partner-devices-levels]: settled by lab-test or source-read
- What admins can do with the default policy on App Profiles [gap:shared.admin-rbac.zcc:default-policy-exception]: settled by lab-test or source-read
- A predefined Client Connector super admin role and Unified RBAC [gap:shared.admin-rbac.zcc:super-admin-and-unified-rbac]: settled by source-read or support-ticket

Area: shared.admin-rbac, its subjects in references/_meta/spine/shared/shared.admin-rbac.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.api.admin-users-wire.md (ZCC admin users on the wire: the admin sync operations and the serviceType field)
- links-to references/_meta/text/zcc/zcc.audit-logs.md (Client Connector audit logs in the Admin Console: what is recorded, retention, columns, actions, categories and filters)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.admin-rbac.md (Admin roles across ZIA, ZPA and Authentication Service, and how admins are entitled)
- see-also references/_meta/text/shared/shared.admin-rbac.cloud-connector.md (Cloud & Branch Connector admin roles: super admin, the eleven permission categories and Unified RBAC)
- see-also references/_meta/text/shared/shared.admin-rbac.zia.md (ZIA admin roles and scope: rank, permissions, functional scope and the one-scope rule)
- see-also references/_meta/text/zcc/zcc.api.authentication.md (Reaching and signing in to the ZCC API: OneAPI gateway and legacy login)
