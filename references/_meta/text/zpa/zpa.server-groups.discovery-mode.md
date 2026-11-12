# Dynamic discovery versus explicit servers on a server group (zpa.server-groups.discovery-mode)
Also called: dynamic server discovery; dynamicDiscovery; DSD; explicit servers; server group with servers; empty server group; dynamic_discovery terraform; servers must not be empty

Whether a server group lists its servers or discovers them decides which fields it must carry.

**The two kinds.** There are two kinds of server group: one with explicitly defined servers added by hand, and one with Dynamic Server Discovery enabled so that Private Access discovers the servers as users request applications. [zpa.server-groups.discovery-mode:two-kinds] For Dynamic Server Discovery only an empty server group with the setting enabled is needed. [zpa.server-groups.discovery-mode:dsd-needs-only-empty-group] Dynamic Server Discovery discovers applications through DNS when an empty server group is defined. [zpa.server-groups.discovery-mode:dsd-discovers-through-dns]

**Explicit servers.** An explicitly defined server must be added to a server group after it is saved, and the server form lists only server groups that have Dynamic Server Discovery disabled. [zpa.server-groups.discovery-mode:explicit-servers-attach-to-non-dsd-groups] If Dynamic Server Discovery is disabled on a server group, the Servers drop-down menu appears for servers to be selected manually, and the servers in the group can only be modified while Dynamic Server Discovery is disabled. [zpa.server-groups.discovery-mode:dsd-off-manual-servers] The Python SDK writes an explicit server list through the `server_ids` argument of `add_group`, which it sends as `servers: [{id}]`. [zpa.server-groups.discovery-mode:python-writes-explicit-servers]

**Defaults.** In the Admin Console the Dynamic Server Discovery setting is enabled by default on a new server group. [zpa.server-groups.discovery-mode:ui-default-on] The other sources disagree [divergence:zpa.server-groups.discovery-mode:dynamic-discovery-default]. The Terraform `dynamic_discovery` argument has no default, so leaving it out sends `dynamicDiscovery` as false, and a group without servers then fails the provider's own check. [zpa.server-groups.discovery-mode:tf-dsd-unset-is-false]

**What the provider refuses.** The Terraform provider rejects a server group that has servers while dynamic discovery is on, on create and on update when servers or dynamic_discovery change. [zpa.server-groups.discovery-mode:tf-servers-only-without-dsd] The Terraform provider rejects a server group with dynamic discovery off and no servers, on create and on update when servers or dynamic_discovery change. [zpa.server-groups.discovery-mode:tf-dsd-off-needs-servers] Whether the API refuses the same combinations is open [gap:zpa.server-groups.discovery-mode:api-dsd-with-servers].

How the Python SDK treats these fields on update is in [What the Python SDK sends when it updates a server group](kb:zpa.server-groups.update-payload).

What to check:
1. Which mode the group is in by reading dynamicDiscovery, remembering that an absent value is read differently by the API documentation, the help and the Python SDK.
2. Whether a group with dynamicDiscovery false has servers, since the Terraform provider refuses that combination.
3. Whether a group with servers has dynamicDiscovery true, which the provider also refuses.
4. Which servers are attached to a non-discovery group, by looking at the Servers page or the group's servers list.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.server-groups.discovery-mode:tf-dsd-unset-is-false] Tier B: Absence claim: the schema block for `dynamic_discovery` carries Type, Optional and Description only, with no Default, read at the pin. The create path then runs the empty-servers check quoted in tf-dsd-off-needs-servers.

Sources disagree (name both sides):
- The OpenAPI document, the help and the Python SDK give different defaults for dynamicDiscovery. [divergence:zpa.server-groups.discovery-mode:dynamic-discovery-default]
  - api-specs: The request field defaults to false.
  - zscaler-help: The Admin Console form has the setting on by default.
  - sdk-python: The Python model treats an absent value as true.
  Impact: A client that omits the field, or a read that does not return it, does not get one consistent mode: the API document says false, the console says true, and the Python SDK rewrites an absent value as true when it builds an update body.

Not known (open gaps):
- Whether the ZPA API itself enforces the dynamic discovery and servers rule [gap:zpa.server-groups.discovery-mode:api-dsd-with-servers]: settled by lab-test

Area: zpa.server-groups, its subjects in references/_meta/spine/zpa/zpa.server-groups.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups), from zpa.server-groups: A server group's App Connector groups are the groups that have access to the data center or VPC containing the servers in that server group. [zpa.server-groups.connector-binding:connector-groups-reach-servers]
- scoped-by references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments), from zpa.server-groups: When an application segment is configured, the server group that contains the servers hosting its applications must be identified. [zpa.server-groups.role:segment-names-server-group]
- interacts-with references/_meta/text/zpa/zpa.policy.md (ZPA policy evaluation), from zpa.server-groups: An access policy rule can be set to specific App Connector groups, server groups, or a mixture of both, instead of all App Connector groups for the application. [zpa.server-groups.role:rule-can-name-connector-or-server-groups]
- links-to references/_meta/text/zpa/zpa.server-groups.update-payload.md (What the Python SDK sends when it updates a server group)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/server-groups.md (config type)
- see-also references/_meta/text/zpa/zpa.server-groups.role.md (What a server group is and what selects it)
