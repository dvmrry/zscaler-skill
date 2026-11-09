# ZPA server groups (zpa.server-groups)
Also called: server group; zpa server group; serverGroup; app server group; server group vs segment group; segment group vs server group; dynamic server discovery; dynamicDiscovery; segment server groups

"Which connectors serve this application, and why does traffic fail?" needs the server group questions answered in order.

1. **What is a server group, and what selects it?** The segment names it, and a policy rule can override it: [What a server group is and what selects it](kb:zpa.server-groups.role).
2. **Does it hold servers or discover them?** Dynamic Server Discovery against explicit servers, and the defaults that differ between sources: [Dynamic discovery versus explicit servers on a server group](kb:zpa.server-groups.discovery-mode).
3. **Which App Connector groups does it bind?** The connector list, how a connector is picked, and what is not known about an empty list: [How a server group binds App Connector groups](kb:zpa.server-groups.connector-binding).
4. **Is there more than one server group on the segment?** Weights, passive flags and the Multimatch rules: [Several server groups on one application segment](kb:zpa.server-groups.multiple-on-segment).
5. **Is the chain from segment to connected connector intact?** The hop-by-hop check: [Checking the segment to server group to connector chain](kb:zpa.server-groups.chain-check).

The Python SDK's update body is in [What the Python SDK sends when it updates a server group](kb:zpa.server-groups.update-payload). The Terraform delete cleanup is in [Deleting a server group through Terraform](kb:zpa.server-groups.delete) and, for failure handling shared with other objects, in [What the ZPA Terraform provider does when deleting objects with dependents](kb:zpa.terraform.delete-paths).

Policy rules that scope on segment groups, rather than on server groups, are covered in [How access policy rules use segment groups](kb:zpa.segment-groups.policy-use) and [Criteria available on ZPA access policy rules](kb:zpa.policy.criteria). The segments that carry server groups are in [ZPA application segments](kb:zpa.app-segments). The App Connector side is in [App Connector groups](kb:zpa.app-connectors.connector-groups).

The OpenAPI server group schemas carry an inconsistentConfigDetails object on the create request and on the read response, whose members are arrays of name and reason entries, one array for each related object type such as serverGroup, appConnectorGroup and idp, and the request schema does not mark it read-only. [zpa.server-groups:inconsistent-config-details-contract]

Neither SDK model carries the field: [zpa.api.server-groups-wire:inconsistent-config-details-sdk-models](kb:zpa.api.server-groups-wire:inconsistent-config-details-sdk-models).

Area: zpa.server-groups, its subjects in references/_meta/spine/zpa/zpa.server-groups.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups): A server group's App Connector groups are the groups that have access to the data center or VPC containing the servers in that server group. [zpa.server-groups.connector-binding:connector-groups-reach-servers]
- scoped-by references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments): When an application segment is configured, the server group that contains the servers hosting its applications must be identified. [zpa.server-groups.role:segment-names-server-group]
- interacts-with references/_meta/text/zpa/zpa.policy.md (ZPA policy evaluation): An access policy rule can be set to specific App Connector groups, server groups, or a mixture of both, instead of all App Connector groups for the application. [zpa.server-groups.role:rule-can-name-connector-or-server-groups]
- links-to references/_meta/text/zpa/zpa.api.server-groups-wire.md (Server group and application server wire details: write responses, always-sent keys, nested fields and the extranet object)
- links-to references/_meta/text/zpa/zpa.policy.criteria.md (Criteria available on ZPA access policy rules)
- links-to references/_meta/text/zpa/zpa.segment-groups.policy-use.md (How access policy rules use segment groups)
- links-to references/_meta/text/zpa/zpa.server-groups.chain-check.md (Checking the segment to server group to connector chain)
- links-to references/_meta/text/zpa/zpa.server-groups.connector-binding.md (How a server group binds App Connector groups)
- links-to references/_meta/text/zpa/zpa.server-groups.delete.md (Deleting a server group through Terraform)
- links-to references/_meta/text/zpa/zpa.server-groups.discovery-mode.md (Dynamic discovery versus explicit servers on a server group)
- links-to references/_meta/text/zpa/zpa.server-groups.multiple-on-segment.md (Several server groups on one application segment)
- links-to references/_meta/text/zpa/zpa.server-groups.role.md (What a server group is and what selects it)
- links-to references/_meta/text/zpa/zpa.server-groups.update-payload.md (What the Python SDK sends when it updates a server group)
- links-to references/_meta/text/zpa/zpa.terraform.delete-paths.md (What the ZPA Terraform provider does when deleting objects with dependents)
