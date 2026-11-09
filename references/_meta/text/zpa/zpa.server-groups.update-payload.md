# What the Python SDK sends when it updates a server group (zpa.server-groups.update-payload)
Also called: update_group server group; server group update clears servers; dynamicDiscovery forced true; server group applications dropped; server group payload size cap; explicit servers lost on update

The Python SDK builds a server group update body from the group it reads, which drops some fields and omits others.

**Body construction.** Python `update_group` first fetches the existing group, starts the request body from its `request_format()`, and then merges the caller's keyword arguments over it. [zpa.server-groups.update-payload:update-reads-then-merges] Python `update_group` removes `applications` from the body unless the caller passes it, because, per a code comment, sending it back can exceed the API's payload-size cap for a group tied to many application segments. [zpa.server-groups.update-payload:update-drops-applications]

**Servers.** The Python `ServerGroup` model has no `servers` attribute and its `request_format()` emits no `servers` key, so a body built from it never contains the group's servers. [zpa.server-groups.update-payload:model-has-no-servers-member] In Python `update_group`, `server_ids` is translated to `servers`, and a `servers` keyword is merged as given. [zpa.server-groups.update-payload:servers-sent-only-with-server-ids] What ZPA does with a PUT that omits servers is open [gap:zpa.server-groups.update-payload:servers-omitted-update-effect].

**Dynamic discovery.** The default that forces `dynamicDiscovery` to true when the key is missing from the body cannot fire on this path, because `request_format()` always sets the key. [zpa.server-groups.update-payload:dynamic-discovery-guard-never-fires] If a GET response omits `dynamicDiscovery`, the model reads it as true and `request_format()` writes true back, so an update can switch a group to dynamic discovery without the caller asking. [zpa.server-groups.update-payload:absent-dynamic-discovery-written-as-true]

The mode defaults across sources are in [Dynamic discovery versus explicit servers on a server group](kb:zpa.server-groups.discovery-mode). The Terraform update omits the name unless it changed: [The server group expander sets `Name` only when `d.HasChange("name")`, and the SDK tags `name` `omitempty`. An update that changes anything else sends the PUT without a name.](kb:zpa.terraform.resource-fidelity:server-group-update-name-only-on-change).

What to check:
1. Whether an update was made through the Python SDK's update_group without server_ids, because the body it builds has no servers member.
2. Whether the group's servers and dynamicDiscovery are the same after the update as before, by re-reading the group.
3. Whether the group is attached to many application segments, in which case applications is deliberately left out of the body.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.server-groups.update-payload:model-has-no-servers-member] Tier B: Absence claim. Searched with `grep -n -i servers zscaler/zpa/models/server_group.py` at the pin: no hits.
- [zpa.server-groups.update-payload:dynamic-discovery-guard-never-fires] Tier B: Derived from the two files together. It holds while the body starts from `request_format()` and the caller passes no key that deletes `dynamicDiscovery`; keyword arguments can only add or replace keys.
- [zpa.server-groups.update-payload:absent-dynamic-discovery-written-as-true] Tier B: Applies only when the API response lacks the field. Whether it ever does is unknown. The contract's GET response lists dynamicDiscovery ("Defaults to false.") but does not require it (required: configSpace, name), and that documented default is the opposite of the Python model's; the defaults across sources are the divergence zpa.server-groups.discovery-mode:dynamic-discovery-default.

Not known (open gaps):
- Whether a PUT that omits servers clears an explicit server list [gap:zpa.server-groups.update-payload:servers-omitted-update-effect]: settled by lab-test. Blocks: saying a Python SDK update loses a static group's servers

Area: zpa.server-groups, its subjects in references/_meta/spine/zpa/zpa.server-groups.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups), from zpa.server-groups: A server group's App Connector groups are the groups that have access to the data center or VPC containing the servers in that server group. [zpa.server-groups.connector-binding:connector-groups-reach-servers]
- scoped-by references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments), from zpa.server-groups: When an application segment is configured, the server group that contains the servers hosting its applications must be identified. [zpa.server-groups.role:segment-names-server-group]
- interacts-with references/_meta/text/zpa/zpa.policy.md (ZPA policy evaluation), from zpa.server-groups: An access policy rule can be set to specific App Connector groups, server groups, or a mixture of both, instead of all App Connector groups for the application. [zpa.server-groups.role:rule-can-name-connector-or-server-groups]
- links-to references/_meta/text/zpa/zpa.server-groups.discovery-mode.md (Dynamic discovery versus explicit servers on a server group)
- links-to references/_meta/text/zpa/zpa.terraform.resource-fidelity.md (ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps)
