# How the Public tier appears in the management API (zpa.public-service-edges.api-visibility)
Also called: serviceEdge api public; upgradePriority; upgrade_priority; public service edge api; zscaler managed service edge api; service edge group fields public
Former IDs: zpa-60

The Public tier is visible to the API only indirectly.

**Instances.** The /serviceEdge API object is documented as a ZPA Private Service Edge and carries provisioning key members, so the API surface for instances is the organization's enrolled Private Service Edges; no operation enrolls or configures a Public Service Edge. [zpa.public-service-edges.api-visibility:instance-records-are-private] The endpoints are in [Management API endpoints for Private Service Edges, groups and schedules](kb:zpa.private-service-edges.api-surface); the Terraform data source is [The provider has a zpa_service_edge_controller data source that looks up a service edge controller by name, and a service_edge_group resource; the documentation lists no resource for individual Private Service Edge instances.](kb:zpa.private-service-edges.terraform:controller-data-source).

**Group fields.** One group field is undocumented [gap:zpa.public-service-edges.api-visibility:upgrade-priority].

What to check:
1. Whether the object is an organization instance: /serviceEdge records are described as Private Service Edges, with provisioning key and enrollment certificate members.
2. Whether upgrade_priority is set, whose values and effect are not documented.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.public-service-edges.api-visibility:instance-records-are-private] Tier B: Absence: no operation under the serviceEdge paths of the OpenAPI document creates an instance or targets a Public Service Edge.

Not known (open gaps):
- Allowed values and effect of upgradePriority on service edge groups [gap:zpa.public-service-edges.api-visibility:upgrade-priority]: settled by lab-test or source-read. Blocks: setting or interpreting upgrade_priority

Area: zpa.public-service-edges, its subjects in references/_meta/spine/zpa/zpa.public-service-edges.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service), from zpa.public-service-edges: Log data for Public Service Edges is exported to log routers, which direct it to the Log Streaming Service hosted in the geographic region for each organization; the Log Streaming Service analyzes events reported primarily by Public or Private Service Edges. [zpa.public-service-edges.what-it-is:log-routing]
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.md (ZPA Private Service Edges), from zpa.public-service-edges: A tenant's Private Service Edge groups sit alongside Public Service Edges: a group can be configured to be prioritized over a closer Public Service Edge. [zpa.private-service-edges.what-it-is:coexists-with-public]
- links-to references/_meta/text/zpa/zpa.private-service-edges.api-surface.md (Management API endpoints for Private Service Edges, groups and schedules)
- links-to references/_meta/text/zpa/zpa.private-service-edges.terraform.md (The zpa_service_edge_group resource for Private Service Edge groups)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/service-edges.md (config type)
- see-also references/_meta/text/zpa/zpa.public-service-edges.md (ZPA Public Service Edges)
