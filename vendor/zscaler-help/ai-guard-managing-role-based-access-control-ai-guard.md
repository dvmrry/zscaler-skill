# Managing Role-Based Access Control in AI Guard

**Source:** https://help.zscaler.com/secure-ai-users/managing-role-based-access-control-ai-guard
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540877, revision 3226316

---

Role-Based Access Controls (RBAC) for AI Guard system users enables organizations to provide more granular control of administrative functions, such as the ability to create custom permissions to assign to system users.
RBAC applies to:
- System users provisioned/managed through Zscaler Authentication (Authentication Service).
- Local hosted system users in AI Guard.
Administrators managed through Authentication Service can leverage the new RBAC within AI Guard to assign these roles to other system users in Authentication Service.
# Role Permissions
AI Guard roles are created using a combination of permissions and scopes across the various sections of the admin console and object configurations. Please refer to the following table for a list of permissions and scopes for modules:
- List of Role Permissions
| Modules | Scope (Multiselect) |
|---|---|
| Default Access (applies permissions to all modules) | None \| View \| Create \| Edit \| Delete |
| Overview |  |
| Dashboard | None \| View |
| Insights | None \| View |
| Topology | None \| View |
| Security |  |
| Policies | None \| View \| Create \| Edit \| Delete |
| LLMs | None \| View \| Create \| Edit \| Delete |
| Private AI Apps | None \| View \| Create \| Edit \| Delete |
| Operations |  |
| Policy Testing | None \| View \| Create |
| Log Exports | None \| View \| Create \| Edit \| Delete |
| Admin |  |
| User Management | None \| View \| Create \| Edit \| Delete |
| RBAC Management | None \| View \| Create \| Edit \| Delete |
| Audit Log | None \| View |
| Tenant Settings | None \| View \| Edit |
| Other |  |
| API Clients | None \| View \| Delete |
A majority of the permissions allow a role to be configured with a combination of one or multiple scopes per permission. For example:
- Customer Service Role:
  - Dashboard: View
  - Detections Policy: View
  - Events (View Prompts): None (unchecked)
  - Insights: View
  - All other permissions: None (unchecked)
- Auditor:
  - Audit Log: View
  - Event (View Prompts): None (unchecked)
  - All other permissions: None (unchecked)
# Creating a Role
This section describes how to create roles for managing system user permissions.
- In the AI Security Admin Portal left-side navigation, go to AI Guard > RBAC Management.
- Click Add Role. The Add Role window appears.
- See image.
- In the Add Role window, fill out the following sections:
  - Role Name: Provide a role name, such as Auditor.
  - Start from a template: (Optional) Click the drop-down menu to select from the following role templates:
    - Viewer: Read-only access to all modules.
    - Editor: Read, create, and update access. No delete access.
    - Administrator: Full access to all modules.
  - Permissions: Select the permissions for the role.
    - Selecting a module checkbox enables all permissions for that module.
    - Selecting an individual permission checkbox will enable that specific permission for that module.
  - Click Save.
- See image.
- To edit a role, click the Edit button under the Action column of the role. In the Edit Role window, make any necessary changes and click Save.
- To delete a role, click the Delete button under the Action column of the role. In the Delete Role window, click Delete.
# Assign a Role to a System User
This section will go into detail on how to assign a role to a system user in AI Guard.
- In the AI Security Admin Portal left-side navigation, go to AI Guard > System User Management.
- Select the Edit button under the Action column to add or edit a role for an existing system user, or you can click Add More to create a new system user.
- See image.
- In the Edit System User or Add System User window, click the Role drop-down menu and select the role you want to assign.
- Click Update or Submit.
To learn more about AI Guard System Users, see Viewing AI Guard System Users.
