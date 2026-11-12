# Microtenant admin permissions (zpa.microtenants.admin-permissions)
Also called: microtenant admin read only; microtenant admin cannot see; configuration permissions for microtenants; default microtenant admin; microtenant permission matrix

Permissions differ by where the resource is defined.

**Levels.** The permission matrix defines four levels: Full is read or write access, Read only is read-only access, Read only* is read-only access that can still perform actions on resources in specific scenarios, and Not visible means the configuration is not visible to the admin or Microtenant. [zpa.microtenants.admin-permissions:permission-levels]

**Default Microtenant resources.** The permission matrix gives the Default Microtenant (global administrator) level and the Microtenant level for resources defined in the Default Microtenant. [zpa.microtenants.admin-permissions:matrix-scope] For resources defined in the Default Microtenant, a Microtenant admin has Read only access to App Connectors, App Connector Groups, Private Service Edges, Private Service Edge Groups, IdP Configuration and Machine Groups, where the Default Microtenant admin has Full. [zpa.microtenants.admin-permissions:default-resources-read-only] For resources defined in the Default Microtenant, Access Policy, Administrators, Servers, App Connector Provisioning Keys, Audit Logs, Timeout Policy, Client Forwarding Policy and Privileged Approvals are Not visible to a Microtenant admin. [zpa.microtenants.admin-permissions:default-resources-not-visible] A Microtenant admin can still perform actions on Default Microtenant application segments for policies within the Microtenant, on segment groups in policies and Log Streaming Service configurations, and on server groups in application segments, although those three are Read only*. [zpa.microtenants.admin-permissions:default-resources-usable] What a Microtenant admin can do with resources the Microtenant owns is open [gap:zpa.microtenants.admin-permissions:own-resource-permissions].

**Across Microtenants.** What one Microtenant admin sees of another, and what the Default admin manages, is open [gap:zpa.microtenants.admin-permissions:cross-microtenant-admin-visibility]. The broader scope list is in [What a Microtenant isolates](kb:zpa.microtenants.isolation).

What to check:
1. Which permission level the configuration has for a Microtenant admin when the resource is defined in the Default Microtenant.
2. Whether the question is about a resource the Microtenant owns, since the matrix covers only Default Microtenant resources.
3. Whether a claim that the Default admin can manage every Microtenant's resources or that Microtenant admins cannot see each other's resources came from a source.

Not known (open gaps):
- Whether the Default admin can manage every Microtenant's resources and Microtenant admins cannot see each other's [gap:zpa.microtenants.admin-permissions:cross-microtenant-admin-visibility]: settled by lab-test or support-ticket. Blocks: answering whether one Microtenant admin can see another Microtenant's configuration
- Permission levels for resources a Microtenant owns [gap:zpa.microtenants.admin-permissions:own-resource-permissions]: settled by support-ticket or lab-test. Blocks: answering whether a Microtenant admin has Full access to a specific resource type it owns

Area: zpa.microtenants, its subjects in references/_meta/spine/zpa/zpa.microtenants.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.microtenants.user-mapping.md (How users are mapped to a Microtenant), from zpa.microtenants: Private Access applies Microtenants in the order they are listed, top to bottom, and assigns the first match as the most relevant Microtenant; a newly created Microtenant is prioritized last by default. [zpa.microtenants.user-mapping:list-order-first-match]
- depends-on references/_meta/text/zpa/zpa.microtenants.isolation.md (What a Microtenant isolates), from zpa.microtenants: Zscaler Support enables the Microtenants feature for an organization. [zpa.microtenants.isolation:enablement]
- scoped-by references/_meta/text/shared/shared.admin-rbac.zpa.md (ZPA admin roles: feature permissions, effective access and propagation delay): The permission matrix gives the Default Microtenant (global administrator) level and the Microtenant level for resources defined in the Default Microtenant. [zpa.microtenants.admin-permissions:matrix-scope]
- depends-on references/_meta/text/zpa/zpa.microtenants.limits.md (Microtenant limits and unsupported features), from zpa.microtenants: To configure a Microtenant, App Connectors and Private Service Edges for Private Access must be running version 24.63.1 or later. [zpa.microtenants.limits:connector-versions]
- decided-by references/_meta/text/zpa/zpa.microtenants.policy-evaluation.md (Policy evaluation between Default and custom Microtenants), from zpa.microtenants: A user in a custom Microtenant accessing a Default Microtenant segment is evaluated against the Default Microtenant first, and only if there is no match does Private Access evaluate access, timeout and client forwarding policy within the custom Microtenant. [zpa.microtenants.policy-evaluation:default-first-for-custom-user]
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.disaster-recovery.md (Disaster recovery mode and Private Service Edge groups), from zpa.microtenants: In disaster recovery mode, Private Service Edges and App Connectors mapped within a default or custom Microtenant provide traffic only to applications designated for disaster recovery. [zpa.private-service-edges.disaster-recovery:dr-microtenants]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.microtenants.share-and-move.md (Sharing and moving between Microtenants)
