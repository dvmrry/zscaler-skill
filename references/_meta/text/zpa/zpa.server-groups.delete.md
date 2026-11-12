# Deleting a server group through Terraform (zpa.server-groups.delete)
Also called: delete server group; server group destroy; detachServerGroupFromAllAppSegments; terraform-provider-zpa 658; server group destroy updates unrelated segments

The provider cleans up references to a server group before it deletes it, and the application segment part of that cleanup changed between versions.

**Application segments.** At v4.4.4 the provider's cleanup before a server group delete rewrote the server group list of every application segment that `applicationsegment.GetAll` returned and updated each one, whether or not it referenced the deleted group. [zpa.server-groups.delete:segment-cleanup-updated-every-segment-at-v4-4-4] The same cleanup now updates only application segments that referenced the deleted server group. [zpa.server-groups.delete:segment-cleanup-updates-only-referencing]

The rest of the cleanup, including that its failures are logged and ignored, is in [What the ZPA Terraform provider does when deleting objects with dependents](kb:zpa.terraform.delete-paths).

What to check:
1. Which provider version applied the destroy, since the application segment cleanup differs between v4.4.4 and the pin.
2. Whether application segments still reference the deleted group afterwards; the shared cleanup behavior is in the delete-paths subject.

Area: zpa.server-groups, its subjects in references/_meta/spine/zpa/zpa.server-groups.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups), from zpa.server-groups: A server group's App Connector groups are the groups that have access to the data center or VPC containing the servers in that server group. [zpa.server-groups.connector-binding:connector-groups-reach-servers]
- scoped-by references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments), from zpa.server-groups: When an application segment is configured, the server group that contains the servers hosting its applications must be identified. [zpa.server-groups.role:segment-names-server-group]
- interacts-with references/_meta/text/zpa/zpa.policy.md (ZPA policy evaluation), from zpa.server-groups: An access policy rule can be set to specific App Connector groups, server groups, or a mixture of both, instead of all App Connector groups for the application. [zpa.server-groups.role:rule-can-name-connector-or-server-groups]
- links-to references/_meta/text/zpa/zpa.terraform.delete-paths.md (What the ZPA Terraform provider does when deleting objects with dependents)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/server-groups.md (config type)
- see-also references/_meta/text/zpa/zpa.server-groups.role.md (What a server group is and what selects it)
