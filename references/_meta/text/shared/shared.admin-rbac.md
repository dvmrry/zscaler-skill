# Admin roles across ZIA, ZPA and Authentication Service, and how admins are entitled (shared.admin-rbac)
Also called: admin rbac; cross-product admin; why can this admin do X here but not there; administrative entitlements; unified rbac; zidentity admin federation; admin vs api client

Each product keeps its own role model, and Authentication Service (formerly ZIdentity) decides who is an admin of which product. Questions of the form "why can this admin do X here but not there" need both halves.

**Who is an admin.** ZIA admins are created in Authentication Service by adding users and giving them an entitlement for the Internet & SaaS service, and the ZIA admin role is chosen when the entitlement is assigned. [shared.admin-rbac:zia-admins-via-entitlement] The Administrative Entitlements page lists the subscribed Zscaler services; Authentication Service users or user groups are assigned there as service admins of a service with a role created in the Admin Console, and admins see only their assigned services in the Admin Console. [shared.admin-rbac:entitlement-assigns-service-admins] For Authentication Service-enabled tenants, ZPA admin roles must be assigned in the Zscaler Admin Console; the help points to About Administrative Entitlements for this. [shared.admin-rbac:zpa-roles-in-console] So on an Authentication Service tenant the admin identity and the product assignment are made centrally, while what the admin can do inside a product is still that product's role (and, for ZIA, the scope, which is edited on the ZIA Administrators page). [shared.admin-rbac:identity-central-role-in-product] How tenants that do not use Authentication Service provision admins is open [gap:shared.admin-rbac:pre-auth-service-separation].

**Unified RBAC.** Where an organization uses Unified Role-Based Access Control, a feature in limited availability obtained through the Zscaler Account team, admin roles for ZIA, ZPA and Authentication Service are managed on a different Role Management page. [shared.admin-rbac:unified-rbac] Its roles, access levels, scopes, assignments and obfuscation are in [Unified RBAC: Admin Console roles, access levels, permission categories, scopes, assignments and obfuscation](kb:shared.admin-rbac.unified).

## The per-product role models

| Product | Role model | Where |
| --- | --- | --- |
| ZIA | Admin rank, permissions and functional scope, plus one scope of Organization, Department, Location or Location Group | [ZIA admin roles and scope: rank, permissions, functional scope and the one-scope rule](kb:shared.admin-rbac.zia), [ZIA admin role permissions: logs limit, dashboard, reporting, insights and alerts access, and the feature categories](kb:shared.admin-rbac.zia-permissions), [Who sees real user names, device information and Gen AI prompts in ZIA: role obfuscation and auditors](kb:shared.admin-rbac.zia-obfuscation), [ZIA API roles, SD-WAN partner API roles and SD-WAN partner API clients](kb:shared.admin-rbac.zia-api-roles) |
| ZPA | Feature permissions (Full or Read Only), no rank, Microtenants instead of scope | [ZPA admin roles: feature permissions, effective access and propagation delay](kb:shared.admin-rbac.zpa), [A ZPA role carries no admin rank and no organizational scope like ZIA's: the role form has a name, a description and feature access, and what an admin can see and change otherwise depends on whether the admin works in the Default Microtenant or a Microtenant.](kb:shared.admin-rbac.zpa:microtenant-as-scope) |
| ZDX | Predefined and custom roles over per-page permissions, Visible or Obfuscated user and device information, and a scope of Organization, Location, Applications or Department | [ZDX admin roles: predefined and custom roles, permissions, obfuscation and admin scope](kb:shared.admin-rbac.zdx) |
| Cloud & Branch Connector | A default super admin and roles that set a permission in each of eleven categories | [Cloud & Branch Connector admin roles: super admin, the eleven permission categories and Unified RBAC](kb:shared.admin-rbac.cloud-connector) |
| Authentication Service | Predefined and custom roles over per-module permissions | [Authentication Service admin roles: predefined and custom roles, and how they relate to product roles](kb:zidentity.admin-rbac) |
| ZCC | A local copy of ZIA, ZDX and ZPA admins, refreshed by sync operations | [`POST /syncZiaZdxAdminUsers` synchronizes ZCC's local copy of all ZIA and ZDX admin users and `POST /syncZpaAdminUsers` that of the ZPA admin users; `GET /getAdminUsersSyncInfo` is described as synchronizing the local copy of admin users.](kb:zcc.api.admin-users-wire:sync-operations) |
| ZCC (roles) | Roles that set Full, View Only, None or Customize per section or setting of the Administration Management page | [Client Connector admin roles: the Administration Management page, Full, View Only, None and Customize, the permission sections and token obfuscation](kb:shared.admin-rbac.zcc) |
| Unified RBAC (Admin Console) | Roles that grant No Access, View Only or Full Access per permission category, with an optional scope and assignments to users, user groups or API clients | [Unified RBAC: Admin Console roles, access levels, permission categories, scopes, assignments and obfuscation](kb:shared.admin-rbac.unified) |

**Automation.** An API client's access comes from the API resources it holds, one per product, not from an admin role: [API resources pair a Zscaler service with an RBAC role. An API client can be assigned one resource per product, which defines what it can do (read, write or restricted access), and can hold resources of several different products.](kb:shared.oneapi.authentication:one-resource-per-product). API clients themselves are covered in [ZIdentity API clients: what one is, how it authenticates, its resources and scopes, and its token lifetime](kb:zidentity.api-clients).

**Auditing admins.** What each product records about admin actions, and which session types ZIA distinguishes, is in [Admin audit logs across Zscaler products: what exists and how to get it](kb:shared.audit-logs).

What to check:
1. Whether the admin holds an administrative entitlement for the product at all, since admins see only the services assigned to them.
2. Within the product, the role and (for ZIA) the scope the entitlement carries.
3. Whether the tenant uses Unified RBAC, in which case roles are managed on a different Role Management page.
4. For an admin missing from the Client Connector Portal, whether the ZCC admin sync has run.
5. For automation, which API resource (role) the API client holds for each product rather than an admin user's role.

Inferred, not quoted (say so when an answer rests on one):
- [shared.admin-rbac:identity-central-role-in-product] Tier B: Combines the entitlement and Administrators-page descriptions; no source states the division of responsibilities in one place.

Not known (open gaps):
- Admin provisioning on tenants without Authentication Service [gap:shared.admin-rbac:pre-auth-service-separation]: settled by support-ticket or operator-experience. Blocks: explaining an admin who exists in one product and not in another on an older tenant

Area: shared.admin-rbac, its subjects in references/_meta/spine/shared/shared.admin-rbac.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.admin-rbac.unified.md (Unified RBAC: Admin Console roles, access levels, permission categories, scopes, assignments and obfuscation)
- links-to references/_meta/text/shared/shared.admin-rbac.zpa.md (ZPA admin roles: feature permissions, effective access and propagation delay)
- links-to references/_meta/text/shared/shared.admin-rbac.cloud-connector.md (Cloud & Branch Connector admin roles: super admin, the eleven permission categories and Unified RBAC)
- links-to references/_meta/text/shared/shared.admin-rbac.zcc.md (Client Connector admin roles: the Administration Management page, Full, View Only, None and Customize, the permission sections and token obfuscation)
- links-to references/_meta/text/shared/shared.admin-rbac.zdx.md (ZDX admin roles: predefined and custom roles, permissions, obfuscation and admin scope)
- links-to references/_meta/text/shared/shared.admin-rbac.zia.md (ZIA admin roles and scope: rank, permissions, functional scope and the one-scope rule)
- links-to references/_meta/text/shared/shared.admin-rbac.zia-api-roles.md (ZIA API roles, SD-WAN partner API roles and SD-WAN partner API clients)
- links-to references/_meta/text/shared/shared.admin-rbac.zia-obfuscation.md (Who sees real user names, device information and Gen AI prompts in ZIA: role obfuscation and auditors)
- links-to references/_meta/text/shared/shared.admin-rbac.zia-permissions.md (ZIA admin role permissions: logs limit, dashboard, reporting, insights and alerts access, and the feature categories)
- links-to references/_meta/text/shared/shared.audit-logs.md (Admin audit logs across Zscaler products: what exists and how to get it)
- links-to references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token)
- links-to references/_meta/text/zcc/zcc.api.admin-users-wire.md (ZCC admin users on the wire: the admin sync operations and the serviceType field)
- links-to references/_meta/text/zidentity/zidentity.admin-rbac.md (Authentication Service admin roles: predefined and custom roles, and how they relate to product roles)
- links-to references/_meta/text/zidentity/zidentity.api-clients.md (ZIdentity API clients: what one is, how it authenticates, its resources and scopes, and its token lifetime)
