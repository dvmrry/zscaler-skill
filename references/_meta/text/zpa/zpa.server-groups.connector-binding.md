# How a server group binds App Connector groups (zpa.server-groups.connector-binding)
Also called: server group app connector groups; appConnectorGroups; server group has no connector group; connector group server group; no app connector available; closest app connector

A server group's connector binding decides which App Connectors can carry traffic for the segments that use it.

**What the list means.** A server group's App Connector groups are the groups that have access to the data center or VPC containing the servers in that server group. [zpa.server-groups.connector-binding:connector-groups-reach-servers] Only servers capable of hosting the same applications should be grouped in one server group. [zpa.server-groups.connector-binding:only-group-capable-servers] A server group's connector type is App Connector, for applications reached through App Connectors, or Extranet, which connects to an application at a partner site through Extranet Application Support. For Extranet the group takes an extranet resource configured in Internet & SaaS, with one partner per server group. The location group represents all the IPSec tunnels that can reach the application at partner locations, and Extranet Locations select a subset of them. [zpa.server-groups.connector-binding:connector-type-extranet] The groups' own association with server groups is in [Every App Connector belongs to exactly one App Connector group, and a group should always be associated with at least one OAuth 2.0 enrollment token or provisioning key and one server group to serve any application.](kb:zpa.app-connectors.connector-groups:every-connector-one-group).

**How a connector is picked.** The closest connector by location and latency is chosen: [Private Access selects the closest App Connector given the location of the user and the App Connector-to-application latency.](kb:zpa.app-connectors.selection:closest-by-location-and-latency).

**How the clients treat the list.** The Python SDK lists `app_connector_group_ids` as a named argument of `add_group` without saying it is required, and the code does not enforce it; it sends the value as `appConnectorGroups: [{id}]`. The segment docstring, by contrast, marks `server_group_ids` as **Required**. [zpa.server-groups.connector-binding:python-requires-connector-group-ids] In the Terraform provider `app_connector_groups` is an optional block on a server group, not a required one. [zpa.server-groups.connector-binding:tf-connector-groups-optional] Whether the API rejects an empty list is open [gap:zpa.server-groups.connector-binding:empty-connector-group-rejected]. What happens when the last group is removed is open [gap:zpa.server-groups.connector-binding:removing-last-connector-group].

**When no connector is available.** For an application that is not accessible because no App Connector is available, the help's checks are that the access policies define the correct App Connectors, that general network connectivity works, and that the App Connector is connected to the Public or Private Service Edge. [zpa.server-groups.connector-binding:no-connector-available] The symptoms of a mis-assigned group are not established [gap:zpa.server-groups.connector-binding:misassigned-symptoms].

Deleting a server group also detaches it from connector groups: [What the ZPA Terraform provider does when deleting objects with dependents](kb:zpa.terraform.delete-paths).

What to check:
1. Whether the server group lists at least one App Connector group, since a group with none has no connector path.
2. Whether the listed App Connector groups can reach the servers, which is what the group is declared to mean.
3. Whether an empty or removed connector list was rejected by the API or accepted, because the legacy statement is unverified.

Not known (open gaps):
- Whether the ZPA API rejects a server group with no App Connector groups [gap:zpa.server-groups.connector-binding:empty-connector-group-rejected]: settled by lab-test. Blocks: saying a server group with an empty connector list cannot exist
- What happens to traffic when the last App Connector group is removed from a server group [gap:zpa.server-groups.connector-binding:removing-last-connector-group]: settled by lab-test
- Observable symptoms of a segment whose server group has no connector that reaches the backend [gap:zpa.server-groups.connector-binding:misassigned-symptoms]: settled by lab-test or tenant-data

Area: zpa.server-groups, its subjects in references/_meta/spine/zpa/zpa.server-groups.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups): A server group's App Connector groups are the groups that have access to the data center or VPC containing the servers in that server group. [zpa.server-groups.connector-binding:connector-groups-reach-servers]
- scoped-by references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments), from zpa.server-groups: When an application segment is configured, the server group that contains the servers hosting its applications must be identified. [zpa.server-groups.role:segment-names-server-group]
- interacts-with references/_meta/text/zpa/zpa.policy.md (ZPA policy evaluation), from zpa.server-groups: An access policy rule can be set to specific App Connector groups, server groups, or a mixture of both, instead of all App Connector groups for the application. [zpa.server-groups.role:rule-can-name-connector-or-server-groups]
- links-to references/_meta/text/zpa/zpa.app-connectors.selection.md (How a session is assigned to an App Connector)
- links-to references/_meta/text/zpa/zpa.terraform.delete-paths.md (What the ZPA Terraform provider does when deleting objects with dependents)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/server-groups.md (config type)
- configured-via references/_meta/text/types/zpa/app-connector-groups.md (config type)
- see-also references/_meta/text/zpa/zpa.server-groups.role.md (What a server group is and what selects it)
- see-also references/_meta/text/zpa/zpa.server-groups.chain-check.md (Checking the segment to server group to connector chain)
- see-also references/_meta/text/zia/zia.traffic-forwarding.extranet.md (Extranet Application Support: extranets, traffic selectors, extranet locations and traffic flow)
