# The Microsegmentation portal: Application Catalog, ML tag recommendations, tags and AppZones (zms.portal)
Also called: microsegmentation application catalog; ml tag recommendations; zms tag management; zms namespaces keys values; zms appzones; app zones microsegmentation; zms ignored recommendations

The Microsegmentation pages of the Zscaler Admin Console manage the application catalog, tag recommendations, tags and AppZones. Provisioning keys are in [Microsegmentation agent provisioning keys (nonces): portal, fields and API](kb:zms.provisioning-keys).

**Application Catalog.** The Application Catalog lists the applications and application categories that machine learning uses to recommend resource tags, which can be applied to resource groups. [zms.portal:catalog-purpose] The Application Catalog page filters by Application Name, Application Category, Process, Protocol and Port, and lists for each application its name, category, process name, protocol, and port start and end. [zms.portal:catalog-filters] The GraphQL catalog filter is narrower: [`AppCatalogQueryFilter` filters only on id, name and category; the portal's Application Catalog page also filters by Process, Protocol and Port, which it lacks.](kb:zms.api.enums-and-filters:app-catalog-filter).

**ML tag recommendations.** The ML Tag Recommendations page shows which Application Catalog applications were detected running on managed resources; a recommendation can be reviewed and accepted, edited, ignored or deleted, and resources left unselected when accepting are treated as ignored. [zms.portal:ml-recommendations] Previously ignored recommendations are reviewed from a separate ignored list. [zms.portal:ml-ignored-list] The page shows when a recommendations check last ran and when the next is scheduled, and Zscaler Support enables or disables ML tag recommendations for an organization. [zms.portal:ml-schedule]

**Tags.** Tags are configured as namespaces, keys and values; a fully configured tag can be assigned to resource groups, and the Tag Management page adds namespaces and tags and edits and deletes tags. [zms.portal:tag-model] How the API walks the same hierarchy is in [Tags are walked top-down: `tagNamespaces` lists namespaces (id, name, description, origin), `tagKeys` needs a `namespaceId`, and `tagValues` needs both a `tagId` and a `namespaceOrigin` of type `NamespaceOrigin!`.](kb:zms.api.queries:tag-hierarchy).

**AppZones.** AppZones group applications into zones based on the applications' topology and their network connectivity with each other; the AppZones page adds, edits and deletes AppZones and lists each one's name, member count (resources connected to it) and description. [zms.portal:app-zones] AppZone definition is affected by the NAT boundary (workloads in one AppZone are assumed to share it) and by policy blast radius (applications that interact and inherit common policies must be in the same AppZone). [zms.portal:appzone-nat-blast] An AppZone requires at least one region, and all resources in the selected regions become members. [zms.portal:appzone-region] The "Include all VPCs/VNETs for selected regions" option is selected by default and applies all VPCs or VNETs in the region; deselecting it allows choosing specific VPCs or VNETs. [zms.portal:appzone-vpc-default] A resource must belong to only one AppZone, but overlapping region, VPC/VNET or subnet definitions map the resource to all related AppZones. [zms.portal:appzone-overlap] Deleting an AppZone removes its matched flow from Flow Logs and leaves its related resources unmapped. [zms.portal:appzone-delete]

**Programmatic writes.** The portal's write actions (accepting, editing, ignoring or deleting recommendations; adding, editing and deleting namespaces, tags and AppZones) have no published programmatic operation: the captured pages describe only the UI, and the Python SDK and MCP clients implement reads only. [zms.portal:portal-no-contract]

What to check:
1. Whether the recommendation was accepted with every resource selected, since unselected resources become ignored.
2. Whether ML tag recommendations are enabled for the organization (Zscaler Support toggles it) and when the next check runs.

Inferred, not quoted (say so when an answer rests on one):
- [zms.portal:portal-no-contract] Tier B: Rests on reading the five captured portal pages, which describe UI actions with no API operation, enum or payload, and on zms.api:clients-read-only.

Area: zms.portal, its subjects in references/_meta/spine/zms/zms.portal.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zms/zms.api.enums-and-filters.md (ZMS enum values and GraphQL filter inputs from the Python SDK)
- links-to references/_meta/text/zms/zms.api.queries.md (What each ZMS GraphQL query takes and returns: agents, resources, groups, rules, zones, catalog, tags)
- links-to references/_meta/text/zms/zms.provisioning-keys.md (Microsegmentation agent provisioning keys (nonces): portal, fields and API)
