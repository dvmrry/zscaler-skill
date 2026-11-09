# Who can do what in DSPM: predefined and custom access roles, their permissions, and business units (dspm.roles)
Also called: dspm access roles; dspm predefined roles; dspm custom roles; dspm permissions; dspm business units; dspm rbac

The About Access Roles page lists these predefined roles: Administrator, View-Only Administrator, Security Officer, IT Administrator, Data Analyst, ZIA Viewer and DLP Policy Manager; the last two are assigned to Internet & SaaS users who reach the dashboard or policy via SSO. [dspm.roles:predefined-roles] Predefined roles cannot be edited or deleted, while custom roles can be created, edited and deleted; the roles list shows role type (Predefined or Custom) and permission count. [dspm.roles:predefined-immutable] A View-Only Administrator cannot perform create, update or delete operations, and the Actions column in Admin Console tables is hidden for the role. [dspm.roles:view-only-admin]

**Custom roles.** A custom role has a unique name of letters, numbers, hyphens or underscores, and each module's permission is Access, View Only or None; for the Scan Settings module, Access or View Only on Cloud Accounts must also be assigned. [dspm.roles:custom-role-fields]

**Business units.** Business units are logical containers for cloud accounts that govern DSPM from an RBAC perspective, users or user groups must be assigned to them, and the default business unit cannot be edited or deleted. [dspm.roles:business-unit-definition]

**Permissions in the predefined roles.** In the permissions list, the ZIA Viewer role's alerts module (spelled Alerts Views) carries Export Alerts, Resolve Alerts, Snooze Alerts and View Alerts. [dspm.roles:zia-viewer-alerts] In the permissions list, the View-Only Administrator role's Alert Views module carries Export Alerts and View Alerts. [dspm.roles:view-only-alerts] The Administrator role's Single Sign-On module has Add IdP, Delete IdP, Edit IdP and View SSO, and the View-Only Administrator role's has View SSO. [dspm.roles:sso-permissions] The Data Analyst role has an Evidence module with View Evidence Triggers, and the View-Only Administrator role has View Evidence Settings. [dspm.roles:evidence-permissions] The IT Administrator role's Cloud Accounts permissions are Delete Account, Add Account, Configure Monitoring Scope, Business Unit Mapping, Change Application Details, Manage Cloud Trail, Update GCP Service Account Key, Acknowledge Template Notification, Configure New Orchestrator, Update GCP Service Account and View Cloud Accounts. [dspm.roles:it-admin-cloud-accounts] The full permission matrix is open [gap:dspm.roles:permission-matrix].

**Modules and global modules.** DSPM classifies its features as modules and global modules, and users can view and access data in these modules depending on their roles and permissions. The page describes the global modules as modules whose data is not segregated by cloud accounts and that are not associated with any business unit. [dspm.roles:global-modules-list] The global modules include Cloud Accounts, Unmanaged Databases, Business Unit Management, Scan Settings, Alerts Settings / Notifications, Alerts Settings / Alert Ignore Rules, Label Rule, Sensitive Data Settings, Data Posture Policies, Evidence Settings, Data Center Management, Integrations, Roles Management, SaaS Applications, On-Premises Scanners and Report Management. [dspm.roles:global-modules-members] In DSPM, modules are segregated by cloud accounts that are associated with business units; they are Compliance, Data Duplications, Investigation, Identity Inventory, Evidence, Analytics Reports, Data Inventory, Dashboard and Alerts Views. [dspm.roles:modules-members]

What to check:
1. Whether the admin's role is predefined or custom, since predefined roles cannot be edited or deleted.
2. Whether a missing Actions column or a failed create, update or delete is the View-Only Administrator role.
3. The module permission (Access, View Only or None) and, for Scan Settings, the Cloud Accounts permission on a custom role.

Not known (open gaps):
- The full per-role permission matrix and its inconsistencies [gap:dspm.roles:permission-matrix]: settled by source-read or tenant-data

Area: dspm.roles, its subjects in references/_meta/spine/dspm/dspm.roles.json
