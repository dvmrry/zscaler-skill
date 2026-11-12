# ZPA legacy endpoint wiring: shared paths, schedules, user codes and step-up levels (zpa.api.legacy-endpoints)
Also called: usercodes path; associationType usercodes; connectorSchedule; assistantSchedule; stepupauthlevel; application endpoint shared by segment types; zpa-37; zpa-38; zpa-39
Former IDs: zpa-37, zpa-39

The ZPA endpoint inventory is generated; this subject keeps only the places where a route is shared, renamed or wired differently by the sources. The base paths are in [ZPA API base paths: hosts, the /zpa prefix, v1 and v2 versions, userconfig and cbiconfig](kb:zpa.api.base-paths).

**One application route.** The Go SDK's standard, Browser Access, Inspection and PRA application segment services, and its by-type service, all use the same /application endpoint, with getAppsByType as a sub-route. [zpa.api.legacy-endpoints:application-shared-path] Ansible collection issue #85 reported that `zpa_application_segment_by_type_info` on collection 2.1.0 failed permanently with a `read.message.failed` error from the by-type application request; it was closed as completed on 2026-05-30 with a reply from a member of the repository's organization, signed Zscaler DevRel, to upgrade to v2.2.0, whose changelog lists a fix for the module's failure when retrieving application segments by type. [zpa.api.legacy-endpoints:ansible-by-type-400-fixed-2-2-0]

**Schedules.** The Go App Connector schedule service builds its path from /connectorSchedule, and the Python module uses /connectorSchedule too; the appconnectorcontroller package declares an /assistantSchedule constant that the schedule service does not use. [zpa.api.legacy-endpoints:connector-schedule-wired] The OpenAPI document has GET and POST on /connectorSchedule and on /serviceEdgeSchedule, and a PUT only on /serviceEdgeSchedule/{id}. [zpa.api.legacy-endpoints:schedule-openapi] The retired-alias question is open [gap:zpa.api.legacy-endpoints:assistant-schedule-served].

**User codes.** The Go SDK posts user codes to {customerId}/{associationType}/usercodes and {customerId}/{associationType}/usercodes/status with the association type as a bare path segment. [zpa.api.legacy-endpoints:usercodes-go-path] The two SDKs build the path differently [divergence:zpa.api.legacy-endpoints:usercodes-path].

**Step-up levels.** The response shape differs by SDK [zpa.api.policy-wire:step-up-auth-shape](kb:zpa.api.policy-wire:step-up-auth-shape). The Go step_up_auth service's `GetStepupAuthLevel` and the Python stepup_auth_level module's `get_step_up_auth_levels` read the /stepupauthlevel path, and the OpenAPI document has no route at that path. [zpa.api.legacy-endpoints:stepup-no-writes] Neither SDK has a create, update or delete call for step-up auth levels. [zpa.api.legacy-endpoints:stepup-sdk-read-only] Whether the API has write verbs is open [gap:zpa.api.legacy-endpoints:stepup-write-verbs].

**Provisioning key types.** The key association types are broader than the two the old inventory listed: [The provider's `zpa_provisioning_key` schema accepts five `association_type` values, including SITE_CONTROLLER_GRP and EXPORTER_GRP, and its importer resolves the association type with the all-associations helpers whenever the import is by name or by numeric ID without `association_type` set. So the provider offers types the importer cannot find. Create, read, update and delete pass the configured association type directly and do not use the helpers.](kb:zpa.sdk-go.service-defects:provider-provisioning-key-schema-and-importer) and [The Python SDK's provisioning key module accepts only the key types connector and service_edge, mapping them to CONNECTOR_GRP and SERVICE_EDGE_GRP, and raises ValueError for anything else; the module has no provisioning key path for NP_ASSISTANT_GRP, which the Go SDK lists.](kb:zpa.app-connectors.provisioning-key-tooling:python-key-types).

What to check:
1. Which SDK built a user-code request, since the Go and Python paths differ by an associationType segment.
2. Whether a schedule call used /connectorSchedule, the only path the Go service wires and the one the OpenAPI document shows.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.api.legacy-endpoints:stepup-sdk-read-only] Tier B: Rests on reading the whole of each at the pin: step_up_auth.go is the Go package's only file and GetStepupAuthLevel its only func; the Python module defines only __init__ and get_step_up_auth_levels. A quote cannot pin the absence.

Sources disagree (name both sides):
- The Go SDK and the Python SDK build the user-code verification path differently. [divergence:zpa.api.legacy-endpoints:usercodes-path]
  - sdk-go: Go puts the association type directly after the customer ID.
  - sdk-python: Python puts a literal associationType segment before the type.
  Impact: One of the two paths is wrong or the API accepts both; the OpenAPI document has neither route, so user-code enrollment through a raw call needs a tenant test.

Not known (open gaps):
- Whether the legacy API still serves /assistantSchedule [gap:zpa.api.legacy-endpoints:assistant-schedule-served]: settled by lab-test or support-ticket. Blocks: choosing the connector schedule path in raw calls
- Whether the step-up authentication levels route accepts writes [gap:zpa.api.legacy-endpoints:stepup-write-verbs]: settled by lab-test or support-ticket. Blocks: managing step-up levels programmatically

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.api.base-paths.md (ZPA API base paths: hosts, the /zpa prefix, v1 and v2 versions, userconfig and cbiconfig)
- links-to references/_meta/text/zpa/zpa.api.policy-wire.md (ZPA policy rule wire behavior: routes, request fields and ordering)
- links-to references/_meta/text/zpa/zpa.app-connectors.provisioning-key-tooling.md (Provisioning key fields and tool behavior across SDKs, provider and MCP)
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.app-connectors.enrollment.md (App Connector enrollment, certificates and re-enrollment)
