# What the Multi-Tenant Portal for partners audit logs record, how to filter and export them, and what their columns hold (shared.multi-tenant-portal.audit-logs)

Zscaler records the login name and IP address of every admin who logs in to the Multi-Tenant Portal and changes configuration settings, including login and logout records and configuration changes. [shared.multi-tenant-portal.audit-logs:what-recorded] Audit logs show changes such as policy template modifications and alterations to admins or tenant groups, and support detecting and investigating suspicious activity and tracking unauthorized access to the Multi-Tenant Portal. [shared.multi-tenant-portal.audit-logs:purpose]

**Filtering and export.** The Audit Logs page can filter logs by time range, action, category, sub-category or result, and search by resource, login ID or client IP. [shared.multi-tenant-portal.audit-logs:filter-search] The Audit Logs page can download a CSV file, in which times are in PDT. [shared.multi-tenant-portal.audit-logs:csv-export] Retention is not stated [gap:shared.multi-tenant-portal.audit-logs:retention].

**Columns.** Each audit log entry also has Client IP (the admin's source IP), Interface, Result (success or failure) and Cloud columns. [shared.multi-tenant-portal.audit-logs:fields] The Action column is the action performed by the admin in the Multi-Tenant Portal and can be one of a listed set of values that includes Sign Out. [shared.multi-tenant-portal.audit-logs:action-values] The Category column is the location within the Multi-Tenant Portal where the action is performed and can be one of a listed set of values that includes Tenant Group, Policy Template, Admin Management and Partner Settings. The Sub-Category column is the subject under the selected category and can be one of a listed set that includes Tenant Group, Policy Template and Partner Settings. The Resource column is the item within the selected sub-category, and the page lists Resource, Login ID and Client IP under it. [shared.multi-tenant-portal.audit-logs:category-values]

**Neighbours.** [What the Zscaler Multi-Tenant Portal for partners is, how a partner signs in, and where its settings, admins, audit logs, policy templates and tenants are covered](kb:shared.multi-tenant-portal) [How Multi-Tenant Portal partner admins, RBAC role templates and scopes work, and the Edit and Delete steps for portal items](kb:shared.multi-tenant-portal.administration) [Admin audit logs across Zscaler products: what exists and how to get it](kb:shared.audit-logs)

Not known (open gaps):
- How long Multi-Tenant Portal audit logs are retained [gap:shared.multi-tenant-portal.audit-logs:retention]: settled by source-read or support-ticket

Area: shared.multi-tenant-portal, its subjects in references/_meta/spine/shared/shared.multi-tenant-portal.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.audit-logs.md (Admin audit logs across Zscaler products: what exists and how to get it)
- links-to references/_meta/text/shared/shared.multi-tenant-portal.md (What the Zscaler Multi-Tenant Portal for partners is, how a partner signs in, and where its settings, admins, audit logs, policy templates and tenants are covered)
- links-to references/_meta/text/shared/shared.multi-tenant-portal.administration.md (How Multi-Tenant Portal partner admins, RBAC role templates and scopes work, and the Edit and Delete steps for portal items)
