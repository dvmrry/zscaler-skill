# ZPA admin roles: feature permissions, effective access and propagation delay (shared.admin-rbac.zpa)
Also called: zpa admin role; private access role permissions; zpa custom role; zpa role change delay; zpa admin scope

A ZPA role is a set of feature permissions. The two predefined roles are in [Private Access has two predefined admin roles: ZPA Administrator, with read, add, edit and delete privileges, and ZPA Read Only Administrator, with read privileges only.](kb:zpa.audit-logs.access:predefined-roles), and the rule that a custom role cannot exceed its creator's privileges is in [An admin with ZPA Administrator privileges can create custom admin roles for specific Private Access features, and can manage and add only custom roles with equal or lower privileges than their own.](kb:zpa.audit-logs.access:custom-roles).

**Features.** A Private Access admin role enables access per feature, chosen from these features: Administration Control, API Key Management, App Connector Management, Authentication, Business Continuity Management, B2B Exchange, Certificate Management, Client Connector Portal, Client Sessions, Cloud Connector Management, Company Information, Configuration, Dashboard, Diagnostics, Log Streaming, Machine Management, Notification Management, Policies, Private Service Edge Management, Privileged Remote Access, Privileged Sessions, Security Management, SCIM Management and VPN (For Legacy Apps). Each grants Full or Read Only access, except Client Connector Portal (Full) and Dashboard (Read Only). [shared.admin-rbac.zpa:feature-list] If a role does not have access to a feature, that feature's functionality does not appear in the Admin Console for any admin with the role, and a page an admin cannot access is still listed in the navigation menu but cannot be opened. [shared.admin-rbac.zpa:feature-hidden] A user is always granted the highest level of access the role defines: if the role permits Full access to Configuration - Policy and Read Only access to Policies - Policy, the user has Full access to Policies. [shared.admin-rbac.zpa:highest-access] An admin with Read Only access can still attempt to add or edit, and gets an error message on save. [shared.admin-rbac.zpa:read-only-save-error]

**Propagation.** Updates to the permissions of an existing role can take up to two minutes to take effect. [shared.admin-rbac.zpa:two-minute-delay] When a custom role is missing permissions, a warning icon appears next to the permission group (and next to the missing permissions when the group is expanded), and the role must be edited and saved with the new permissions. [shared.admin-rbac.zpa:missing-permissions-warning]

**Scope.** A ZPA role carries no admin rank and no organizational scope like ZIA's: the role form has a name, a description and feature access, and what an admin can see and change otherwise depends on whether the admin works in the Default Microtenant or a Microtenant. [shared.admin-rbac.zpa:microtenant-as-scope] The Microtenant permission matrix is in [Microtenant admin permissions](kb:zpa.microtenants.admin-permissions).

What to check:
1. Which feature permissions the admin's role enables, and whether any feature is Read Only rather than Full.
2. Whether the role was edited in the last two minutes, which can explain an admin still seeing old permissions.
3. Whether a warning icon marks missing permissions on the custom role, which then needs to be edited and saved.
4. Whether the admin works in the Default Microtenant or a Microtenant.

Inferred, not quoted (say so when an answer rests on one):
- [shared.admin-rbac.zpa:microtenant-as-scope] Tier B: The Add Role steps list Name, Description and Access Control only, and neither ZPA role article mentions a rank; the reading of Microtenants as ZPA's scope dimension is an inference from the Microtenant permission matrix.

Area: shared.admin-rbac, its subjects in references/_meta/spine/shared/shared.admin-rbac.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zpa/zpa.microtenants.admin-permissions.md (Microtenant admin permissions): A ZPA role carries no admin rank and no organizational scope like ZIA's: the role form has a name, a description and feature access, and what an admin can see and change otherwise depends on whether the admin works in the Default Microtenant or a Microtenant. [shared.admin-rbac.zpa:microtenant-as-scope]
- links-to references/_meta/text/zpa/zpa.audit-logs.access.md (Who can read and download ZPA audit logs)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.admin-rbac.md (Admin roles across ZIA, ZPA and Authentication Service, and how admins are entitled)
