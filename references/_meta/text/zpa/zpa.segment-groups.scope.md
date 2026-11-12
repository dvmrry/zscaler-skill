# Segment group limits, microtenant scope and managed groups (zpa.segment-groups.scope)
Also called: segment group limit; segment groups microtenant; deception segment group; policyMigrated meaning; segment group sharing; segment group read only microtenant
Former IDs: sg-05

This subject covers segment group limits, microtenant scope and groups that Deception manages.

**Limit.** The Ranges & Limitations article lists a limit of 200 segment groups, and the Configuring Segment Groups article says up to 200 segment groups can be added. [zpa.segment-groups.scope:group-limit] A segment group name cannot contain any form of the word "and" (And, AND, &) or special characters, except for periods, hyphens and underscores. [zpa.segment-groups.scope:name-rule] Whether the API enforces the name rule is open [gap:zpa.segment-groups.scope:name-rule-api]. If more than 500 application segments are attached to a segment group, the Clear All option is hidden in the edit window. [zpa.segment-groups.scope:clear-all-over-500]

**Microtenants.** Microtenant admins manage segment groups, and a custom microtenant can still use Default Microtenant groups in policies: [A Microtenant admin can manage the configuration of shared application segments, segment groups, servers, server groups, App Connectors, App Connector groups and policies exclusive to users within their country, department and operating company, and can view the dashboard and logs exclusive to those users.](kb:zpa.microtenants.isolation:managed-config), [A Microtenant admin can still perform actions on Default Microtenant application segments for policies within the Microtenant, on segment groups in policies and Log Streaming Service configurations, and on server groups in application segments, although those three are Read only*.](kb:zpa.microtenants.admin-permissions:default-resources-usable). A segment group carries `microtenantId` and `microtenantName`, and the Terraform doc says `microtenant_id` is optional and requires the microtenant license and feature flag enabled for the tenant, and that the provider also accepts the microtenant ID from the `ZPA_MICROTENANT_ID` environment variable, the recommended method. [zpa.segment-groups.scope:microtenant-field] The v1 segment group body in the API spec carries a `sharedMicrotenantIds` list. [zpa.segment-groups.scope:shared-microtenant-ids-field] Visibility and sharing are open [gap:zpa.segment-groups.scope:microtenant-visibility]. Application segment sharing is in [Sharing and moving between Microtenants](kb:zpa.microtenants.share-and-move).

**Managed groups.** If a segment group is configured using Zscaler Deception, the console's edit and delete options are unavailable. [zpa.segment-groups.scope:deception-locked] What the API does is open [gap:zpa.segment-groups.scope:deception-api-effect].

**policyMigrated.** A segment group carries a `policyMigrated` boolean in the API spec, the Go model and the Python model. [zpa.segment-groups.scope:policy-migrated-field] Its meaning is open [gap:zpa.segment-groups.scope:policy-migrated-meaning].

What to check:
1. How many segment groups the tenant holds against the limit before proposing a restructuring that adds groups.
2. Whether the group is managed by Deception, which removes the console edit and delete options.
3. Which microtenant the group is defined in, and what permission a custom microtenant has on groups defined in the Default Microtenant.

Not known (open gaps):
- Whether the API enforces the segment group name rule that bans "and" [gap:zpa.segment-groups.scope:name-rule-api]: settled by lab-test
- Visibility and sharing of segment groups across microtenants [gap:zpa.segment-groups.scope:microtenant-visibility]: settled by lab-test or tenant-data. Blocks: saying whether a group in one microtenant can be referenced from another microtenant's policies or shared like an application segment
- What the API does when a Deception-managed segment group is changed [gap:zpa.segment-groups.scope:deception-api-effect]: settled by lab-test. Blocks: saying Terraform or SDK changes to such a group fail
- What policyMigrated records [gap:zpa.segment-groups.scope:policy-migrated-meaning]: settled by support-ticket or tenant-data. Blocks: setting or relying on the flag

Area: zpa.segment-groups, its subjects in references/_meta/spine/zpa/zpa.segment-groups.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zpa/zpa.microtenants.isolation.md (What a Microtenant isolates): A segment group carries `microtenantId` and `microtenantName`, and the Terraform doc says `microtenant_id` is optional and requires the microtenant license and feature flag enabled for the tenant, and that the provider also accepts the microtenant ID from the `ZPA_MICROTENANT_ID` environment variable, the recommended method. [zpa.segment-groups.scope:microtenant-field]
- interacts-with references/_meta/text/zpa/zpa.policy.access-rule-order.md (Access policy rule order), from zpa.segment-groups: An allow rule for all applications for Marketing, listed above a rule denying Marketing the Operations Apps segment group, leaves Marketing with access to that group, because Private Access stops at the first matching rule. [zpa.policy.access-rule-order:segment-group-allow-shadows-deny]
- links-to references/_meta/text/zpa/zpa.microtenants.admin-permissions.md (Microtenant admin permissions)
- links-to references/_meta/text/zpa/zpa.microtenants.share-and-move.md (Sharing and moving between Microtenants)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/segment-groups.md (config type)
- see-also references/_meta/text/zpa/zpa.segment-groups.membership.md (Which application segments belong to a segment group)
