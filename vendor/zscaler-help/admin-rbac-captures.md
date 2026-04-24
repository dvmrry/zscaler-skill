# Admin RBAC — consolidated capture notes

**Captured:** 2026-04-24 via Playwright MCP. Content below is structured summary of 8 help articles across ZIA, ZPA, and ZIdentity admin-role surfaces. Verbatim innerText excerpts preserved where the source language is critical; operational details summarized where original is procedural.

## Sources

### ZIA

- [About Role Management](https://help.zscaler.com/zia/about-role-management)
- [About Administrators](https://help.zscaler.com/zia/about-administrators)
- [Understanding Admin Scope](https://help.zscaler.com/zia/about-admin-scope)
- [About Audit Logs](https://help.zscaler.com/zia/about-audit-logs)

### ZPA

- [About Private Access Roles](https://help.zscaler.com/zpa/about-private-access-roles)
- [Configuring Administrator Roles](https://help.zscaler.com/zpa/configuring-administrator-roles)

### ZIdentity

- [About ZIdentity Admin Roles](https://help.zscaler.com/zidentity/about-zidentity-admin-roles)
- [Admin Roles and Permissions](https://help.zscaler.com/zidentity/admin-roles-and-permissions)

---

## ZIA: About Role Management

> The admin roles that are assigned to admins dictate the level of access they have to the ZIA Admin Portal. Zscaler provides a default super admin role which has full access to the ZIA Admin Portal and Executive Insights App. For each additional role you create, you must define the role's access by specifying:
> - Admin rank
> - Permissions
> - Functional scope

> Admins who have permission to manage roles can only add, edit, or delete roles with **less scope and lower rank** than their own.

Role management enables: configure admins based on role + functional scope, assign rank-based roles to maintain hierarchy, view all configured admins and their access levels.

## ZIA: About Administrators

Each admin account comprises a **role** and **scope**:

- **Role** (or SD-WAN partner API role) — specifies which features admins can access in the ZIA Admin Portal.
- **Scope** — specifies which areas of the organization (which departments, which locations) admins can configure policies or settings for.

Zscaler provides a default admin account with full access. The new default admin login format is:

```
admin@<Organization ID>.<Zscaler Cloud>.net
```

On the Administrators page, per-admin columns include: **Login ID, Name, Role, Status, Scope, Login Type, Comments, Password Expired, Type** (Standard Admin / SD-WAN partner API / Executive App Admin / Standard & Executive App Admin).

## ZIA: Understanding Admin Scope

An admin's scope specifies which areas of the organization they can manage. Default admin = scope over entire organization. Each additional admin selects one of:

- Organization
- Department
- Location
- Location Group

**You can assign scope over the entire organization OR either location, location group, or department** — you **can't combine** location, location group, and department.

Admin scope affects: Rule Criteria, Editing Rules or Settings, Assigning Scope for New Admins, Access to Organizational Resources, and Access to ZIA Admin Portal Features.

## ZIA: About Audit Logs

Zscaler records the actions of every admin in the ZIA Admin Portal and through the Cloud Service APIs. Audit logs provide:

- View alterations made (PAC file modifications, URL filtering policy changes).
- View details on changes made by admins during login sessions.
- Demonstrate compliance with security policies.
- Detect and investigate suspicious activity.

**Lockout behavior:** If an admin account makes **5 unsuccessful login attempts within 1 minute**, the account is locked for **5 minutes** and failed attempts are recorded.

**Retention:** **Audit logs stored for up to 6 months.**

Per-log columns: Timestamp, Action, Category, Sub-Category, Resource, Admin ID, Client IP, Interface (Admin UI or API), Trace ID, Result (success/failure).

## ZPA: About Private Access Roles

For each admin, choose from predefined roles:

- **ZPA Administrator** — read, add, edit, and delete privileges in the Zscaler Admin Console (default).
- **ZPA Read Only Administrator** — only read privileges.

**ZPA Administrator privileges** enable creating custom admin roles. You can only manage custom roles with **equal or lower privileges than your own**.

Predefined-role columns: Name, # of Admins with This Role, # of API Keys with This Role, Description.

**Permission changes take up to 2 minutes to take effect.**

## ZPA: Configuring Administrator Roles

Add a new admin role:

1. Go to **Administration > Admin Management > Role Based Access Control > Private Access**.
2. Click **Add Role**.
3. Define: **Name**, **Description** (optional), **Access Control features**.

### Available features for role configuration

Administration Control, API Key Management, App Connector Management, Authentication, Business Continuity Management, Certificate Management, Client Connector Portal, Client Sessions, Cloud Connector Management, Company Information, Configuration, Dashboard, Diagnostics, Log Streaming, Machine Management, Notification Management, Policies, Private Service Edge Management, Privileged Remote Access, Privileged Sessions, Security Management, SCIM Management, VPN (For Legacy Apps).

Role changes take up to **2 minutes** to take effect. Missing permissions show a warning icon next to the permission group.

## ZIdentity: About ZIdentity Admin Roles

ZIdentity provides **4 predefined admin roles**:

1. **Super Admin** — system role, full permissions.
2. **View Only Admin** — system role, view-only.
3. **User Admin** — system role, user-management permission.
4. **CXO Insight User** — system role, CXO insight permission.

Users and user groups must be added to ZIdentity before admin roles can be assigned.

**For ZIdentity-enabled tenants, admin roles must be assigned in the Zscaler Admin Console.**

For ZIdentity tenants migrated to the Zscaler Admin Console, at least **View Only permission** is required on Users and User Groups modules to submit a Zscaler Support ticket.

## ZIdentity: Admin Roles and Permissions (permission matrix)

The full matrix covers 25+ modules with Full / View Only / Restricted / None permission levels. Modules include:

Admin Sign on Policy · Authentication Methods · Users and Groups · User Credentials · Roles · External Identities · IP Locations & Groups · Authentication Session · Administrative Entitlements · Service Entitlements · Audit Logs · Guest Domain · Remote Assistance · Branding · API Clients & Resources · Executive Insights · Token Validators · Log Streaming

(Full matrix is verbose; re-capture the live article for the authoritative version when drafting detailed permission-based policy.)
