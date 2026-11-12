# What the Multi-Tenant Portal Tenants page lists and filters, and how tenant groups are created and assigned a policy template (shared.multi-tenant-portal.tenants)

**Tenant list.** The Tenants page lists, for each tenant, an Organization ID, a Customer ID, a Policy Template column (described as "the policy templates the tenant is provisioned") and the group the tenant belongs to. [shared.multi-tenant-portal.tenants:tenants-columns] Whether the column shows one template or several for a tenant that has both a direct and a group template is not stated [gap:shared.multi-tenant-portal.tenants:template-column-multiple]. The Tenants page can filter tenants by the cloud they are provisioned on, show tenants with disabled accounts, and filter and search by customer name, customer ID, tenant name or domain, or organization ID. [shared.multi-tenant-portal.tenants:tenants-filters]

**Tenant groups.** Tenant groups group tenants across clouds and industries to ease tenant management and can be assigned to admin users. [shared.multi-tenant-portal.tenants:groups-purpose] Only an admin with permission to manage tenants can create, view or modify tenant groups. [shared.multi-tenant-portal.tenants:groups-permission] A tenant group is created with a Name, a Cloud, Tenants selected from the cloud, and an optional Description. [shared.multi-tenant-portal.tenants:group-create-fields] The tenant group details page shows each tenant's status as Active or Disabled. [shared.multi-tenant-portal.tenants:group-status]

**Policy templates.** A tenant group can only be provisioned in one policy template. [shared.multi-tenant-portal.tenants:group-one-template] A policy template is assigned to a tenant group by adding the group under Tenant Groups in the Edit Policy Template window, then clicking Save and Sync. [shared.multi-tenant-portal.tenants:group-assign-template]

**Neighbours.** [What the Zscaler Multi-Tenant Portal for partners is, how a partner signs in, and where its settings, admins, audit logs, policy templates and tenants are covered](kb:shared.multi-tenant-portal) [What the Multi-Tenant Portal Tenant Details page shows for a tenant: subscriptions, limits, defaults, API keys, clusters, contacts and Executive Insights](kb:shared.multi-tenant-portal.tenant-details) [How Multi-Tenant Portal policy templates are created, assigned to tenants and tenant groups, reordered, edited in ZIA and deleted](kb:shared.multi-tenant-portal.policy-templates) [How Multi-Tenant Portal partner admins, RBAC role templates and scopes work, and the Edit and Delete steps for portal items](kb:shared.multi-tenant-portal.administration)

Not known (open gaps):
- How the Tenants page Policy Template column shows a tenant with more than one template [gap:shared.multi-tenant-portal.tenants:template-column-multiple]: settled by source-read or lab-test

Area: shared.multi-tenant-portal, its subjects in references/_meta/spine/shared/shared.multi-tenant-portal.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.multi-tenant-portal.md (What the Zscaler Multi-Tenant Portal for partners is, how a partner signs in, and where its settings, admins, audit logs, policy templates and tenants are covered)
- links-to references/_meta/text/shared/shared.multi-tenant-portal.administration.md (How Multi-Tenant Portal partner admins, RBAC role templates and scopes work, and the Edit and Delete steps for portal items)
- links-to references/_meta/text/shared/shared.multi-tenant-portal.policy-templates.md (How Multi-Tenant Portal policy templates are created, assigned to tenants and tenant groups, reordered, edited in ZIA and deleted)
- links-to references/_meta/text/shared/shared.multi-tenant-portal.tenant-details.md (What the Multi-Tenant Portal Tenant Details page shows for a tenant: subscriptions, limits, defaults, API keys, clusters, contacts and Executive Insights)
