# ZPA segment groups (zpa.segment-groups)
Also called: segment group; app group; APP_GROUP; zpa_segment_group; policy scoping group for application segments

"What is a segment group, and what does it do for application segments and policy?" splits into the questions below.

1. **Which segments does a group hold and what happens on delete?** [Which application segments belong to a segment group](kb:zpa.segment-groups.membership).
2. **How does a policy rule use a group?** [How access policy rules use segment groups](kb:zpa.segment-groups.policy-use).
3. **What do the API, SDK and Terraform expose?** [The segment group API, model fields and Terraform resource](kb:zpa.segment-groups.api-surface).
4. **What are the limits, microtenant scope and managed groups?** [Segment group limits, microtenant scope and managed groups](kb:zpa.segment-groups.scope).

Segments themselves and their matching are in [ZPA application segments](kb:zpa.app-segments). Terraform's cleanup of policy rules on group delete is in [What the ZPA Terraform provider does when deleting objects with dependents](kb:zpa.terraform.delete-paths). Server groups are a different object, covered in [ZPA server groups](kb:zpa.server-groups).

Area: zpa.segment-groups, its subjects in references/_meta/spine/zpa/zpa.segment-groups.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.policy.access-rule-order.md (Access policy rule order): An allow rule for all applications for Marketing, listed above a rule denying Marketing the Operations Apps segment group, leaves Marketing with access to that group, because Private Access stops at the first matching rule. [zpa.policy.access-rule-order:segment-group-allow-shadows-deny]
- links-to references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments)
- links-to references/_meta/text/zpa/zpa.segment-groups.api-surface.md (The segment group API, model fields and Terraform resource)
- links-to references/_meta/text/zpa/zpa.segment-groups.membership.md (Which application segments belong to a segment group)
- links-to references/_meta/text/zpa/zpa.segment-groups.policy-use.md (How access policy rules use segment groups)
- links-to references/_meta/text/zpa/zpa.segment-groups.scope.md (Segment group limits, microtenant scope and managed groups)
- links-to references/_meta/text/zpa/zpa.server-groups.md (ZPA server groups)
- links-to references/_meta/text/zpa/zpa.terraform.delete-paths.md (What the ZPA Terraform provider does when deleting objects with dependents)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/segment-groups.md (config type)
