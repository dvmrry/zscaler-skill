# Checking the segment to server group to connector chain (zpa.server-groups.chain-check)
Also called: verify server group chain; segment has no connector; server group connector group connected; connectionStatus connected; controlChannelStatus; ctrlChannelStatus; connector group has no connected connectors; app segment server group app connector group chain

The chain runs from the application segment to its server groups, to their App Connector groups, to connected App Connectors.

**Hops one and two.** An application segment carries its server groups in a `serverGroups` list. [zpa.server-groups.chain-check:segment-lists-server-groups] A server group carries its App Connector groups in an `appConnectorGroups` list. [zpa.server-groups.chain-check:server-group-lists-connector-groups] Whether an empty connector list can exist is open [Whether the ZPA API rejects a server group with no App Connector groups](kb:zpa.server-groups.connector-binding:empty-connector-group-rejected).

**Hop three and the status field.** An App Connector carries the id of its group in `appConnectorGroupId`. [zpa.server-groups.chain-check:connector-group-id-field] An App Connector's control channel state is read from `controlChannelStatus` in the Python model; the OpenAPI connector object has `controlChannelStatus` with the values UNKNOWN, ZPN_STATUS_AUTHENTICATED and ZPN_STATUS_DISCONNECTED, and its nested `assistantVersion` object names the control channel status `ctrlChannelStatus` with the same values. [zpa.server-groups.chain-check:connector-status-field] [The MCP troubleshooting skill's connector status table gives ZPN_STATUS_AUTHENTICATED as healthy, ZPN_STATUS_DISCONNECTED as lost connection, ZPN_STATUS_NOT_ENROLLED as never enrolled or enrollment failed, and ZPN_STATUS_PENDING as enrollment in progress; the command document lists only the first three.](kb:zpa.app-connectors.health:mcp-status-table) No `connectionStatus` member is defined for an App Connector in the Python SDK, the Go SDK or the OpenAPI document; the status members are the control channel ones. [zpa.server-groups.chain-check:no-connection-status-member]

**Beyond the chain.** [For an application that is not accessible because no App Connector is available, the help's checks are that the access policies define the correct App Connectors, that general network connectivity works, and that the App Connector is connected to the Public or Private Service Edge.](kb:zpa.server-groups.connector-binding:no-connector-available) A segment in one microtenant using a server group from another is unconfirmed [gap:zpa.server-groups.chain-check:cross-microtenant-server-group].

Why a group may have no connector list is in [How a server group binds App Connector groups](kb:zpa.server-groups.connector-binding); the segment-to-server-group relationship is in [What a server group is and what selects it](kb:zpa.server-groups.role).

What to check:
1. Find the application segment for the destination and port and read its serverGroups list; an empty list ends the chain at the segment.
2. For each server group id on the segment, read the server group's appConnectorGroups list; an empty list ends the chain at the server group.
3. For each connector group id, list the App Connectors whose appConnectorGroupId matches it and read their controlChannelStatus; ZPN_STATUS_AUTHENTICATED is the healthy value. Do not filter on connectionStatus, which no source defines.
4. Treat connector status as live state: it comes from a live read, and an IaC export taken earlier may not carry it.
5. If every hop passes, move on to reachability of the backend and to the policy side rather than to the server group.
6. If the tenant uses microtenants, read each object within its own microtenant and flag a segment whose server group is in another one.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.server-groups.chain-check:no-connection-status-member] Tier B: Absence claim. Searched with `grep -rn connectionStatus` over zscaler/zpa in the Python SDK and in the Go SDK's zscaler/zpa at the pins and `grep -c connectionStatus` over the captured zpa.openapi.json: no hits in any of them.

Not known (open gaps):
- Whether a segment in one microtenant can use a server group in another [gap:zpa.server-groups.chain-check:cross-microtenant-server-group]: settled by lab-test

Area: zpa.server-groups, its subjects in references/_meta/spine/zpa/zpa.server-groups.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.server-groups.connector-binding.md (How a server group binds App Connector groups)
- reached-via references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups), from zpa.server-groups: A server group's App Connector groups are the groups that have access to the data center or VPC containing the servers in that server group. [zpa.server-groups.connector-binding:connector-groups-reach-servers]
- scoped-by references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments), from zpa.server-groups: When an application segment is configured, the server group that contains the servers hosting its applications must be identified. [zpa.server-groups.role:segment-names-server-group]
- interacts-with references/_meta/text/zpa/zpa.policy.md (ZPA policy evaluation), from zpa.server-groups: An access policy rule can be set to specific App Connector groups, server groups, or a mixture of both, instead of all App Connector groups for the application. [zpa.server-groups.role:rule-can-name-connector-or-server-groups]
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)
- links-to references/_meta/text/zpa/zpa.server-groups.role.md (What a server group is and what selects it)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/application-segments.md (config type)
- configured-via references/_meta/text/types/zpa/server-groups.md (config type)
- configured-via references/_meta/text/types/zpa/app-connectors.md (config type)
- see-also references/_meta/text/zpa/zpa.server-groups.multiple-on-segment.md (Several server groups on one application segment)
