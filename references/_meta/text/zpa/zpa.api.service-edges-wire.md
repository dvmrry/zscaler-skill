# ZPA Private Service Edge and private cloud controller calls: what is sent and where the sources differ (zpa.api.service-edges-wire)
Also called: private cloud controller restart path; service edge ipAcl; service edge schedule python bug; upgradeNowOnce; zpnSubModuleUpgradeList; service edge provisioningKeyId

This is the wire behavior of the Private Service Edge, private cloud controller and schedule calls that field listings do not show. Field names and types come from the surface layer (`node scripts/kb.mjs surface`) and the deployment behavior from [Private Service Edge groups: membership, software updates and version profiles](kb:zpa.private-service-edges.groups).

## Auto-delete schedule

The schedule is a tenant singleton read with GET and written with POST and PUT in [Management API endpoints for Private Service Edges, groups and schedules](kb:zpa.private-service-edges.api-surface). The Go SDK defines an `AssistantSchedule` struct with the same fields and JSON tags (`id`, `customerId`, `deleteDisabled`, `enabled`, `frequency`, `frequencyInterval`) and a `/serviceEdgeSchedule` endpoint constant in both the serviceedgecontroller and serviceedgeschedule packages; the serviceedgeschedule package defines GetSchedule, CreateSchedule and UpdateSchedule. [zpa.api.service-edges-wire:schedule-duplicate-packages]

The Python `update_service_edge_schedule` builds a camel-case `payload` but passes the original `body` to `create_request`, whereas `add_service_edge_schedule` passes `payload`. [zpa.api.service-edges-wire:python-schedule-update-sends-raw-body]

## Always-sent and dropped values

The Go service edge request tags `provisioningKeyId` and `provisioningKeyName` without omitempty, so both are always sent, while the Go private cloud controller tags `provisioningKeyId` omitempty. [zpa.api.service-edges-wire:service-edge-provisioning-key-sent] The Go service edge holds `PrivateBrokerVersion` as a struct value (not a pointer) tagged omitempty, and every member of `PrivateBrokerVersion` is itself tagged omitempty. [zpa.api.service-edges-wire:private-broker-version-value-struct] A Go service edge write that leaves `PrivateBrokerVersion` at its zero value therefore carries an empty `privateBrokerVersion` object instead of omitting the member. [zpa.api.service-edges-wire:private-broker-version-empty-object] The Go `upgradeNowOnce` is a bool tagged omitempty, so it is sent only when true; the OpenAPI document says that when true the service edge upgrades once and then resets the field to false. [zpa.api.service-edges-wire:upgrade-now-once]

The Go service edge group tags `enabled` without omitempty so false is sent, while the Go private cloud group tags it omitempty. [zpa.api.service-edges-wire:service-edge-group-enabled-sent] The Go `isPublic` string is in [How clients are steered to a Private Service Edge and which country policy applies](kb:zpa.private-service-edges.client-selection).

## Keys and types that differ between sources

The Go private cloud controller holds `ipAcl` as a list of strings. [zpa.api.service-edges-wire:ip-acl-private-cloud-array] The Go service edge disagrees with the specification [divergence:zpa.api.service-edges-wire:ip-acl-type].

The Go private cloud controller maps its `Runtime` field to the key `runtimeOS`; the Python model accepts `runtime_os`, `runtimeOs` or `runtimeOS` on input, in that order, and always emits `runtimeOS`. [zpa.api.service-edges-wire:runtime-os-key] The Python private cloud controller model reads the list from the response key `zpnSubModuleUpgrade` but writes it as `zpnSubModuleUpgradeList`, which is the key the Go SDK uses for both. [zpa.api.service-edges-wire:sub-module-upgrade-key] The Go service edge holds `enrollmentCert` as an unstructured map, while the Python service edge model keeps only its `name` and writes back `{name: ...}`, dropping every other member. [zpa.api.service-edges-wire:enrollment-cert-shape]

## Restart and listing

The Go SDK's `ControllerRestart` restarts a private cloud controller with a PUT to `/privateCloudController/restart/{id}`. [zpa.api.service-edges-wire:restart-go-path] The Python SDK restarts a private cloud controller with a request to `/privateCloudController/{controller_id}/restart`. [zpa.api.service-edges-wire:restart-python-path] The two shapes disagree [divergence:zpa.api.service-edges-wire:restart-path], and which is accepted is open [gap:zpa.api.service-edges-wire:restart-path-canonical].

The OpenAPI service edge list takes search, page, pagesize, sortBy, sortDir and microtenantId, with a default page size of 20 and a maximum of 500, and the Python private cloud controller list documents `sort_dir` defaulting to `dsc`. [zpa.api.service-edges-wire:list-params]

The summary decode differs between Go and Python [divergence:zpa.api.service-edges-wire:private-cloud-group-summary-shape].

The Go private cloud controller holds `zpnSubModuleUpgradeList` as `[]interface{}`; the Python PrivateCloudController model builds its `zpn_sub_module_upgrade_list` as ZPNSubmoduleUpgradeList objects read from the response key `zpnSubModuleUpgrade`, and its request_format emits that list as `zpnSubModuleUpgradeList`. [zpa.api.service-edges-wire:sub-module-upgrade-list-typing]

A success check written for the single delete (204) fails on the bulk call, which answers 200: The OpenAPI document gives Service Edge bulkDelete a 200 response with an object body, while a single Service Edge DELETE returns 204 No Content. Up to v1.10.0 the Python `bulk_delete_service_edges` returned the bare HTTP status code; v1.11.1 returns the `(None, response, error)` tuple instead (#578). [zpa.api.service-edges-wire:bulk-delete-returns-200]

The create answer is documented as empty with a schema, and the update stand-in lives in the Python PUT path: The OpenAPI document gives POST on `/serviceEdgeSchedule` a 204 No Content response while also declaring a body schema for it (ScheduledConfigDTO), and the Python `update_service_edge_schedule` returns a stand-in object holding only the schedule ID when the response has no body. [zpa.api.service-edges-wire:schedule-post-204-with-body-schema]

A Service Edge group's `latitude` and `longitude` are strings in the OpenAPI document and in the Go struct. [zpa.api.service-edges-wire:service-edge-group-coordinates-string] So is a connector group's latitude: [An App Connector Group's `latitude` is a string in the OpenAPI document, the Go struct and the Terraform schema. The provider's ValidateLatitude checks the parsed value is in -90..90; a value that does not parse is rejected. The connector-level latitude in the same response is a read-only double.](kb:zpa.app-connectors.connector-groups:latitude-longitude-string).

What to check:
1. Whether a service edge's ipAcl was written through the Go SDK, which holds it as one string, before trusting its contents.
2. Whether a restart call matches the path the API accepts before concluding the controller ignored it.
3. Whether a Python schedule update sent the caller's own keys (no customerId from the env fallback, an extra microtenantId) rather than the built payload.
4. Whether a service edge or group that looks enabled was written with a false that the tag dropped.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.api.service-edges-wire:private-broker-version-empty-object] Tier B: Follows from Go's encoding/json not treating a struct value as empty for omitempty (the shared claim) and from every member of PrivateBrokerVersion being omitempty; not quoted from the SDK. Split out of private-broker-version-value-struct, whose evidence states only the tags.

Sources disagree (name both sides):
- Whether a service edge's ipAcl is a string or a list [divergence:zpa.api.service-edges-wire:ip-acl-type]
  - sdk-go: The Go service edge holds ipAcl as a single string.
  - api-specs: The OpenAPI service edge update documents ipAcl as an array of strings.
  Impact: A response that carries ipAcl as an array (any length) fails to decode into the Go string field, and a Go write sends a string where the contract documents an array.
- Which path restarts a private cloud controller [divergence:zpa.api.service-edges-wire:restart-path]
  - sdk-go: The Go SDK uses /privateCloudController/restart/{id}.
  - sdk-python: The Python SDK uses /privateCloudController/{id}/restart.
  Impact: The two SDKs send different paths and the OpenAPI document lists neither (its privateCloudController paths are the collection GET and the by-ID GET/PUT/DELETE), so a restart through one SDK may fail. See gap restart-path-canonical.
- The Go `GetGroupSummary` for private cloud groups decodes the summary into full PrivateCloudGroup objects, while the Python summary call decodes it into id-and-name CommonIDName objects. [divergence:zpa.api.service-edges-wire:private-cloud-group-summary-shape]
  - sdk-go: Go GetGroupSummary returns a list of PrivateCloudGroup read from the /summary path.
  - sdk-python: Python list_private_cloud_group_summary builds CommonIDName objects.
  Impact: Group fields read from a Go summary call are mostly empty if the endpoint returns only identifiers; the live response is not captured.

Not known (open gaps):
- Which private cloud controller restart path the API accepts [gap:zpa.api.service-edges-wire:restart-path-canonical]: settled by lab-test or support-ticket. Blocks: telling which SDK's restart call works

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups)
- links-to references/_meta/text/zpa/zpa.private-service-edges.api-surface.md (Management API endpoints for Private Service Edges, groups and schedules)
- links-to references/_meta/text/zpa/zpa.private-service-edges.client-selection.md (How clients are steered to a Private Service Edge and which country policy applies)
- links-to references/_meta/text/zpa/zpa.private-service-edges.groups.md (Private Service Edge groups: membership, software updates and version profiles)
