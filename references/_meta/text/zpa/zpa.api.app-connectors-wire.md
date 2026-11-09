# ZPA App Connector, group, schedule and version profile calls: what is sent and where the sources differ (zpa.api.app-connectors-wire)
Also called: connector schedule put; version profile update path; app connector group omitempty; version_profile_gid; connector no create; connector list sortBy

This is the wire behavior of the App Connector schedule, group, connector and version profile calls that field listings do not show: which tags drop or force values, where the SDKs disagree, and what the OpenAPI document does not list. Field names and types come from the surface layer (`node scripts/kb.mjs surface`) and the group's behavior from [App Connector groups](kb:zpa.app-connectors.connector-groups).

## Auto-delete schedule

The Go SDK decodes GET on the App Connector schedule endpoint into a single schedule object, not a list, and creates it with POST; the OpenAPI document describes the same two operations on connectorSchedule, with POST answering 204 No Content. [zpa.api.app-connectors-wire:schedule-singleton] The Terraform provider's App Connector assistant schedule resource accepts only `days` for `frequency`. [zpa.api.app-connectors-wire:schedule-frequency-days] The interval check and the refusal to update a disabled schedule are in [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects) and [ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps](kb:zpa.terraform.resource-fidelity).

The Go SDK updates the App Connector schedule with PUT to the connectorSchedule endpoint followed by the schedule ID and expects no response body. [zpa.api.app-connectors-wire:schedule-update-path] Whether the API accepts that update is open [gap:zpa.api.app-connectors-wire:schedule-put-undocumented].

The Go SDK schedule integration test treats a CreateSchedule error containing `resource.already.exist` as the schedule already being enabled rather than as a failure, and accepts status 200 or 204 on success. [zpa.api.app-connectors-wire:schedule-create-already-exists] [The Go App Connector schedule service builds its path from /connectorSchedule, and the Python module uses /connectorSchedule too; the appconnectorcontroller package declares an /assistantSchedule constant that the schedule service does not use.](kb:zpa.api.legacy-endpoints:connector-schedule-wired)

## Groups and connectors

The Go App Connector group request tags `enabled`, `overrideVersionProfile`, `praEnabled`, `wafDisabled`, `tcpQuickAckApp`, `tcpQuickAckAssistant`, `useInDrMode`, `tcpQuickAckReadAssistant` and `lssAppConnectorGroup` without omitempty, and so are `cityCountry` and `dcHostingInfo`, so false and empty values are sent on every write. [zpa.api.app-connectors-wire:group-booleans-always-sent] On the Go App Connector group the field `AppServerGroup` is sent under the key `serverGroups`, and the Python App Connector controller maps `server_group_ids` to `serverGroups`. [zpa.api.app-connectors-wire:group-server-groups-key]

The Go appconnectorcontroller package exposes Get, GetByName, GetAll, Update, Delete and BulkDelete and no Create function. [zpa.api.app-connectors-wire:connector-no-create] The Go App Connector request tags `enabled` omitempty, so false is not sent, but tags `provisioningKeyId` and `provisioningKeyName` without omitempty, so both are always sent; the group's `enabled` is the opposite. [zpa.api.app-connectors-wire:connector-write-tags] The Go App Connector maps its `ZPNSubModuleUpgrade` field to the JSON key `zpnSubModuleUpgradeList`, and holds `enrollmentCert` as an unstructured map. [zpa.api.app-connectors-wire:connector-sub-module-key]

The Go SDK reads the App Connector group summary from `appConnectorGroup/summary`, decoded as id, name and enabled only, and reads one group with its server groups from `appConnectorGroup/{id}/sg` as a full group. [zpa.api.app-connectors-wire:group-sub-resources] The OpenAPI connector list takes search, page, pagesize, sortBy, sortDir and microtenantId, with a default page size of 20 and a maximum of 500; the App Connector group list takes the same paging parameters but scopeId instead of sort parameters. [zpa.api.app-connectors-wire:list-params]

## Version profiles

The Go SDK lists version profiles from `/visible/versionProfiles` and finds one by name with a case-insensitive match; the Python SDK reads the profile associated with the customer from `/versionProfile`; the OpenAPI document has GET operations on both paths. [zpa.api.app-connectors-wire:version-profile-reads] The Go version profile integration test requires the names `New Release`, `Default`, `Previous Default` and `Default - el8` to be present, and the App Connector group test pairs `Default` with version profile ID `0`. [zpa.api.app-connectors-wire:version-profile-names] Inside a version profile's `versions` entries the Go SDK tags the profile reference `version_profile_gid`, in snake case, while its sibling `restartAfterUptimeInDays` is camel case. The Python ComponentLevelVersion model (which the AppConnectorController and App Connector group models build from their `version` key) looks up and emits the same `version_profile_gid` key, but the Python client camel-cases every response key before a model reads it. [zpa.api.app-connectors-wire:version-profile-gid-key] A Python connector or connector group read never finds a `version_profile_gid` key, because the response key arrives as `versionProfileGid`, so the model's `version_profile_gid` is always None; and a `version_profile_gid` key in a Python request body is sent as `versionProfileGid`, the key Go does not use. [zpa.api.app-connectors-wire:python-version-profile-gid-unread] The two SDKs use different wire keys for it [divergence:zpa.api.app-connectors-wire:version-profile-gid-wire-key].

The Go SDK `Update` for version profiles sends a PUT to `/visible/versionProfiles/{id}` carrying the whole profile object. [zpa.api.app-connectors-wire:version-profile-put] The Python SDK `update_version_profile` sends a PUT to `/versionProfiles/{id}` with a body of only `removeOverrideFlag`, and expects 204 No Content. [zpa.api.app-connectors-wire:python-version-profile-put] The two update paths disagree [divergence:zpa.api.app-connectors-wire:version-profile-put-path].

The Python helper `pick_version_profile` converts the slugs `default`, `previous_default` and `new_release` to version profile IDs 0, 1 and 2 and sets `overrideVersionProfile`, but the App Connector group add and update methods pass their keyword arguments as the request body, and the group module's imports do not include it. [zpa.api.app-connectors-wire:python-version-profile-slugs] So the group add and update methods never convert a `version_profile` slug: nothing in the SDK calls `pick_version_profile`. [zpa.api.app-connectors-wire:python-version-profile-slugs-unused] The key reaches the wire camel-cased as `versionProfile`; what the server does with it is open [gap:zpa.api.app-connectors-wire:python-version-profile-wire].

The type of the interval differs between the contract and the Go SDK [divergence:zpa.api.app-connectors-wire:schedule-frequency-interval-type].

The id type of the bulk-delete body differs between contract and SDKs [divergence:zpa.api.app-connectors-wire:bulk-delete-id-type].

The upgrade attempt counter has different types in the contract and the Go structs [divergence:zpa.api.app-connectors-wire:upgrade-attempt-type].

The Python model defaults a missing enabled to true: The Python App Connector model reads `enabled` as True when the response carries no `enabled` key. [zpa.api.app-connectors-wire:python-connector-enabled-default]

Whether frequencies other than days are accepted is open [gap:zpa.api.app-connectors-wire:frequency-values].

What to check:
1. Whether a schedule update failed before any request (a disabled or invalid-interval schedule) or at the API, and whether the PUT path is documented.
2. Whether a group's boolean is false in the tenant because it was sent that way on a write.
3. Which version profile an override group is using, and which SDK wrote it, before trusting a slug passed to the Python group methods.
4. Whether a connector list used sort parameters that only the connector endpoint accepts.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.api.app-connectors-wire:python-version-profile-gid-unread] Tier B: Follows from form_response_body camel-casing every key with to_lower_camel_case, which has no exception for version_profile_gid, and from the executor converting request bodies the same way. Which key the server sends and accepts is not shown: the OpenAPI document has no version_profile_gid or versionProfileGid.
- [zpa.api.app-connectors-wire:python-version-profile-slugs-unused] Tier B: Rests on the group module's import list and a search of zscaler/ at the pin finding no caller of pick_version_profile; a quote cannot pin an absent call.

Sources disagree (name both sides):
- The wire key of the version profile reference: the Go SDK uses snake-case `version_profile_gid`, while the Python client renames every key to camel case, so it sends `versionProfileGid` and cannot read `version_profile_gid`. [divergence:zpa.api.app-connectors-wire:version-profile-gid-wire-key]
  - sdk-go: The Go version profile `versions` entry tags the reference `version_profile_gid`.
  - sdk-python: The Python client camel-cases every response key before a model reads it, so the model's `version_profile_gid` lookup finds nothing.
  - sdk-python: The Python executor camel-cases request-body keys, so a `version_profile_gid` key is sent as `versionProfileGid`.
  Impact: If the server uses the Go spelling, Python callers never see a connector's or group's version profile GID and cannot send it under that key. The OpenAPI document names neither key, so which spelling the server uses is not shown; read a raw response to check.
- Which path a version profile update goes to [divergence:zpa.api.app-connectors-wire:version-profile-put-path]
  - sdk-go: The Go SDK updates a version profile with PUT on /visible/versionProfiles/{id}.
  - sdk-python: The Python SDK updates it with PUT on /versionProfiles/{id}, sending only removeOverrideFlag.
  Impact: The two SDKs write to different paths with different bodies, and the OpenAPI document lists no PUT for either path. A version profile update through one SDK says nothing about the other; confirm the effect by reading the group's version profile back.
- The OpenAPI document types a schedule's `frequencyInterval` as an int32 integer, while the Go SDK types it as a string and validates it against string keys. [divergence:zpa.api.app-connectors-wire:schedule-frequency-interval-type]
  - api-specs: The contract request body for POST connectorSchedule has frequencyInterval as an int32 integer.
  - sdk-go: The Go schedule struct declares FrequencyInterval as a string.
  - sdk-go: The Go update check accepts only the string keys 5, 7, 14, 30, 60 and 90; create sends the value unchecked.
  - sdk-python: The Python SDK passes frequency_interval through as supplied.
  Impact: A caller following the contract sends a number and one following the Go SDK sends a numeric string. The Go integration test sends the string form; no captured run shows whether the API accepts the string, the number, or both.
- The OpenAPI document types the connector bulk-delete `ids` as int64 integers, while the Go request holds them as strings and the Python SDK examples pass strings. [divergence:zpa.api.app-connectors-wire:bulk-delete-id-type]
  - api-specs: The contract request body for connector/bulkDelete has ids as an array of int64 integers.
  - sdk-go: The Go BulkDeleteRequest holds IDs as a list of strings.
  - sdk-python: The Python bulk_delete_connectors sends the caller's list under ids and documents string IDs.
  Impact: Raw-HTTP callers follow the contract and send numbers; both SDKs send numeric strings. Whether the API accepts both forms is not shown.
- The OpenAPI document types a connector's read-only `upgradeAttempt` as an int32 integer, while the Go SDK types it as a string in its connector structs. [divergence:zpa.api.app-connectors-wire:upgrade-attempt-type]
  - api-specs: The contract connector item in an App Connector Group response has upgradeAttempt as a read-only int32.
  - sdk-go: The Go AppConnector type (used for an App Connector Group's connectors) declares UpgradeAttempt as a string.
  - sdk-go: The Go servergroup Connectors type (a server group's connector groups' connectors) also declares UpgradeAttempt as a string.
  Impact: A Go caller decoding a bare JSON integer into a string field gets a decode error rather than a value; the live response is not captured.

Not known (open gaps):
- Whether the API accepts PUT on the App Connector schedule with an ID [gap:zpa.api.app-connectors-wire:schedule-put-undocumented]: settled by lab-test or support-ticket. Blocks: telling whether the SDK update path calls a real endpoint
- What the API does with the versionProfile key the Python group methods send [gap:zpa.api.app-connectors-wire:python-version-profile-wire]: settled by lab-test or code-read. Blocks: telling whether Python callers can set a group's version profile by slug
- Which frequency values the schedule endpoints accept besides days [gap:zpa.api.app-connectors-wire:frequency-values]: settled by lab-test. Blocks: telling whether hours or weeks are valid schedule frequencies

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.api.legacy-endpoints.md (ZPA legacy endpoint wiring: shared paths, schedules, user codes and step-up levels)
- links-to references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups)
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- links-to references/_meta/text/zpa/zpa.terraform.resource-fidelity.md (ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps)
