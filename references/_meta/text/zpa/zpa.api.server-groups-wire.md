# Server group and application server wire details: write responses, always-sent keys, nested fields and the extranet object (zpa.api.server-groups-wire)
Also called: server group PUT returns 204; update_server drops fields; server group weight passive missing; extranetDTO python; configSpace SIEM server group; servergroup package unused structs

These are the wire details of the server group and application server calls that the SDKs and the API document disagree on or hide. The group's purpose and its connector and discovery rules are in [What the Python SDK sends when it updates a server group](kb:zpa.server-groups.update-payload) and [Dynamic discovery versus explicit servers on a server group](kb:zpa.server-groups.discovery-mode).

## Writes

**Update returns nothing.** The API answers a PUT on a server group and on an application server with 204 No Content. The Go server group update passes no response target and returns only the HTTP response, and the Python update_server returns a stub holding only the id, so neither call returns the updated object. [zpa.api.server-groups-wire:put-returns-no-content]

**Keys always sent.** The Go ServerGroup request type tags ipAnchored and the three lists appConnectorGroups, servers and applications without omitempty, so those keys are on every create and update, while readOnly and zscalerManaged are tagged omitempty and are left out when false. [zpa.api.server-groups-wire:server-group-always-sent-fields] The canonical Go application server type (the one a server group's servers list uses) tags address, appServerGroupIds, creationTime, description, modifiedBy and modifiedTime without omitempty, so an empty address or description string is sent on a write. [zpa.api.server-groups-wire:application-server-always-sent-fields] Zero-value handling for the other flags is in [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes).

**Python update paths.** Python update_server builds its PUT body from the caller's keyword arguments alone, without first reading the server, so any field the caller leaves out is not sent. This differs from update_group, which reads the group first. [zpa.api.server-groups-wire:python-update-server-sends-only-kwargs] The API document and the Go ApplicationServer type carry microtenantId on an application server, but the Python AppServers model has no microtenant member, so a server read through Python does not show its microtenant. Both SDKs scope application server writes with the microtenantId query parameter: Go from the service's microtenant, Python from the caller's microtenant_id. [zpa.api.server-groups-wire:python-app-server-model-no-microtenant]

## Fields and shapes

The API document gives configSpace on a server group and on an application server the values DEFAULT and SIEM. The Go ServerGroup type sends it only when non-empty, the Python AppServers model reads a missing configSpace as DEFAULT, and the Python ServerGroup model reads it as None. [zpa.api.server-groups-wire:config-space-values] What the API does when configSpace is left out is open [gap:zpa.api.server-groups-wire:config-space-default].

In a server group's GET response each entry of appConnectorGroups[].serverGroups carries passive and weight. The Go appconnectorgroup AppServerGroup type has neither member, so both are dropped when a Go caller decodes that response, and the Python ServerGroup model reads and writes weight but has no passive member. [zpa.api.server-groups-wire:nested-server-group-passive-weight]

The Go servergroup package defines its own ApplicationServer (address tagged omitempty), AppConnectorGroups (latitude and longitude as strings) and Connectors (latitude and longitude as float64) types, but the ServerGroup type does not use them: its servers list is the appservercontroller type and its connector groups are the appconnectorgroup type. A ZIA test file and the examples README refer to the servergroup AppConnectorGroups copy, and both assign it to ServerGroup.AppConnectorGroups, which no longer has that type. [zpa.api.server-groups-wire:server-group-package-unused-copies]

The contract's inconsistentConfigDetails object on a server group is described in [The OpenAPI server group schemas carry an inconsistentConfigDetails object on the create request and on the read response, whose members are arrays of name and reason entries, one array for each related object type such as serverGroup, appConnectorGroup and idp, and the request schema does not mark it read-only.](kb:zpa.server-groups:inconsistent-config-details-contract); neither SDK model carries it [divergence:zpa.api.server-groups-wire:inconsistent-config-details-sdk-models].

## Extranet object

The Go ExtranetDTO has locationDTO, locationGroupDTO, ziaErName and zpnErId, all tagged omitempty, and no id, ziaErId or timestamp members. [zpa.api.server-groups-wire:extranet-dto-go-fields] The Python ExtranetDTO model reads id, modifiedTime, creationTime, modifiedBy, ziaErName, ziaErId, locationDTO and locationGroupDTO. [zpa.api.server-groups-wire:extranet-dto-python-fields] The Python ExtranetDTO model has no zpnErId. [zpa.api.server-groups-wire:extranet-dto-python-no-zpn-er] The three shapes disagree [divergence:zpa.api.server-groups-wire:extranet-dto-shape]. The Python ExtranetDTO request_format emits locationDTO but no locationGroupDTO, so a location group read from a response is not written back, and an ExtranetDTO built without a config does not set a location_group_dto attribute at all. [zpa.api.server-groups-wire:extranet-dto-python-location-group-not-sent]

Both SDKs call the server summary path: Both SDKs read a server summary with GET `/server/summary`: the Go `GetServerSummary` and the Python `list_servers_summary`. [zpa.api.server-groups-wire:server-summary-sdk-calls]

The contract does not list the server summary path: The OpenAPI document lists GET and POST on the server collection and GET, PUT and DELETE by ID, and no `/server/summary` path. [zpa.api.server-groups-wire:server-summary-not-in-contract]

Which fields a write needs on the extranet object is open [gap:zpa.api.server-groups-wire:extranet-dto-write-shape].

What to check:
1. Whether a write response was expected to carry the updated object; the PUT returns 204, so read the group or server back.
2. Whether a Go write could carry a false, empty string or empty list the caller did not intend, given the always-sent keys.
3. Whether a Python update that touches a server supplied every field to keep, since update_server does not read first.
4. Whether a missing passive or weight on a decoded server group came from the SDK type rather than the tenant.
5. Whether extranet data written through Python lost its location groups or its ZPA extranet id.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.api.server-groups-wire:extranet-dto-python-no-zpn-er] Tier B: Rests on reading the whole ExtranetDTO class at the pin: no zpnErId appears in its config reads or request_format; the separate ZPNERID model elsewhere in the file is not part of it. A quote cannot pin the absence.
- [zpa.api.server-groups-wire:server-summary-not-in-contract] Tier B: Absence claim: the server path item lists only get and post, and no path ending in server/summary exists in the document.

Sources disagree (name both sides):
- The OpenAPI server group schemas define inconsistentConfigDetails, but the Go ServerGroup struct and the Python ServerGroup model do not carry it. [divergence:zpa.api.server-groups-wire:inconsistent-config-details-sdk-models]
  - api-specs: The create request and read response schemas define inconsistentConfigDetails.
  - sdk-go: The Go ServerGroup struct ends at extranetDTO and has no inconsistentConfigDetails member, so the field is dropped on read and never sent; `git grep -i inconsistent` over zscaler/zpa/services/servergroup at HEAD finds nothing.
  - sdk-python: The Python ServerGroup model reads each field by an explicit key and none of them is inconsistentConfigDetails: `git grep -i inconsistent` over zscaler/zpa/models/server_group.py at HEAD finds nothing (the Python models carry it only in application_segment.py, policy_group.py and policy_rule.py).
  Impact: A client that depends on the SDK models cannot read the drift report the API returns for a server group, and cannot send it; read it with a raw API call. The absence in both SDKs was read by searching for the field name at HEAD; the quoted lines mark where each model is defined.
- The extranet object on a server group is shaped differently by the API document, the Go SDK and the Python SDK [divergence:zpa.api.server-groups-wire:extranet-dto-shape]
  - api-specs: The API document's extranetDTO has id, creationTime, modifiedBy, modifiedTime, locationDTO, locationGroupDTO, ziaErName and zpnErId.
  - sdk-go: The Go SDK carries zpnErId and ziaErName with the two location lists and has no id, timestamps or ziaErId.
  - sdk-python: The Python SDK carries ziaErId, id and timestamps and has no zpnErId.
  Impact: A Python client cannot set or read the ZPA extranet resource id through extranetDTO, and a Go client drops id and timestamps from a response. Neither SDK round-trips the whole object the API document describes.

Not known (open gaps):
- Whether the API defaults a missing configSpace on a server group or application server to DEFAULT [gap:zpa.api.server-groups-wire:config-space-default]: settled by lab-test. Blocks: telling whether leaving configSpace out of a create is safe
- What a write-ready extranet object on a server group contains [gap:zpa.api.server-groups-wire:extranet-dto-write-shape]: settled by lab-test. Blocks: writing extranet settings on a server group through either SDK

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
- links-to references/_meta/text/zpa/zpa.server-groups.md (ZPA server groups)
- links-to references/_meta/text/zpa/zpa.server-groups.discovery-mode.md (Dynamic discovery versus explicit servers on a server group)
- links-to references/_meta/text/zpa/zpa.server-groups.update-payload.md (What the Python SDK sends when it updates a server group)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.server-groups.multiple-on-segment.md (Several server groups on one application segment)
