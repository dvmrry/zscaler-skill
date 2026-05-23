# Managing Role-Based Access Control in AI Guard

**Source:** https://help.zscaler.com/ai-guard/managing-role-based-access-control-ai-guard
**Captured:** 2026-05-22 via Codex Browser.

---

AI Guard Help
Configuration
Managing Role-Based Access Control in AI Guard
AI Guard
Managing Role-Based Access Control in AI Guard
Ask Zscaler

Role-Based Access Controls (RBAC) for AI Guard system users enables organizations to provide more granular control of administrative functions. Previously, AI Guard supported 3 roles: Administrator, Editor, Viewer. Now we have the ability to create custom permissions to assign to system users.

RBAC applies to:

System users provisioned/managed through Zscaler Authentication (ZIdentity).
Local hosted system users in AI Guard.

Administrators managed through ZIdentity can leverage the new RBAC within AI Guard to assign these roles to other system users in ZIdentity.

Role Permissions

AI Guard roles are created using a combination of permissions and scopes across the various sections of the admin console and object configurations. Please refer to the following table for a list of permissions and scopes for modules:

List of Role Permissions

In addition to the individual standard permission options on a per module basis, there are several

A majority of the permissions allow a role to be configured with a combination of one or multiple scopes per permission. For example:

Customer Service Role:
Dashboard: View
Detections Policy: View
Events (View Prompts): None (unchecked)
Insights: View
All other permissions: None (unchecked)
Auditor:
Audit Log: View
Event (View Prompts): None (unchecked)
All other permissions: None (unchecked)
Creating a Role

This section describes how to create roles for managing system user permissions.

In the AI Guard left-side navigation under Admin, click RBAC Management.

Click Add Role. The Add Role window appears.

See image.

In the Add Role window, fill out the following sections:

Role Name: Provide a role name, such as Auditor.
Start from a template: (Optional) Click the drop-down menu to select from the following role templates:
Viewer: Read-only access to all modules.
Editor: Read, create, and update access. No delete access.
Administrator: Full access to all modules.
Permissions: Select the permissions for the role.
Selecting a module checkbox enables all permissions for that module.
Selecting an individual permission checkbox will enable that specific permission for that module.
Click Save.

See image.

To edit a role, click the Edit button under the Action column of the role. In the Edit Role window, make any necessary changes and click Save.
To delete a role, click the Delete button under the Action column of the role. In the Delete Role window, click Delete.
Assign a Role to a System User

This section will go into detail on how to assign a role to a system user in AI Guard.

In the AI Guard left-side navigation under Admin, click System User Management.

Select the Edit button under the Action column to add or edit a role for an existing system user, or you can click Add More to create a new system user.

See image.

In the Edit System User or Add System User window, click the Role drop-down menu and select the role you want to assign.
Click Update or Submit.

To learn more about AI Guard System Users, see Viewing AI Guard System Users.
