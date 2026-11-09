# Which application segments belong to a segment group (zpa.segment-groups.membership)
Also called: segment_group_id; application segment without a segment group; move segment between groups; empty segment group; delete segment group with members; one segment group per application segment
Former IDs: sg-02

This subject covers how application segments belong to segment groups and what changes when a group is deleted.

**Why groups exist.** Every application segment you configure must be placed in a segment group, which is what allows access policies to be configured on segment groups. [zpa.segment-groups.membership:required-for-every-segment] Segment groups logically group application segments for easier management and give access policy configuration a layer of abstraction, and a group can be added or modified while configuring an application segment or manually at any time. [zpa.segment-groups.membership:group-purpose]

**One group per segment.** An application segment cannot be assigned to more than one segment group: an application placed in one group cannot be added to another. [zpa.segment-groups.membership:one-group-per-segment] The membership is recorded on both objects: an application segment holds `segmentGroupId` and a segment group holds an `applications` list. [zpa.segment-groups.membership:reference-fields] The v2 segment group update body carries `addedApps` and `deletedApps` lists of IDs. [zpa.segment-groups.membership:v2-delta-fields] How the service reflects a change on both sides is open [gap:zpa.segment-groups.membership:membership-write-semantics].

**Creating segments and empty groups.** The Python `add_segment` documents `segment_group_id` as required, while the Terraform `zpa_application_segment` schema declares it optional and computed. [zpa.segment-groups.membership:segment-group-id-requirements] What the service does with the omission is open [gap:zpa.segment-groups.membership:omitted-segment-group-id]. The Terraform `zpa_segment_group` resource needs only a `name`, so a group with no application segments is a valid configuration. [zpa.segment-groups.membership:tf-create-needs-name-only] A rule whose only application criterion is a segment group with no application segments has nothing to match through that criterion. [zpa.segment-groups.membership:empty-group-rule-noop]

**Deleting a group.** The Terraform segment group resource detaches the group from policy rules before it deletes the group, while the Go and Python SDK delete functions issue only the DELETE request. [zpa.segment-groups.membership:tf-delete-detaches-sdk-does-not] A segment group deleted through the SDK or the API directly can leave `APP_GROUP` operands for its ID in policy rules, because the cleanup that removes them exists only in the Terraform delete path. [zpa.segment-groups.membership:sdk-delete-leaves-operands] What a rule does with a stale operand is open [gap:zpa.segment-groups.membership:stale-operand-behavior], and so is what happens to former members [gap:zpa.segment-groups.membership:delete-group-with-members]. The provider's cleanup order and failure handling are in [What the ZPA Terraform provider does when deleting objects with dependents](kb:zpa.terraform.delete-paths) and [When a segment group is deleted, the provider reads the v2 rules of the ACCESS, TIMEOUT, SIEM, CLIENT_FORWARDING and INSPECTION policy types, removes the segment group operand, converts the whole rule with ConvertV1ResponseToV2Request and PUTs the converted rule.](kb:zpa.terraform.policy-rule-writes:cleanup-rewrites-rule-from-converter).

Rule semantics for groups: [How access policy rules use segment groups](kb:zpa.segment-groups.policy-use).

What to check:
1. Whether the application segment has a segmentGroupId and the group holds it, since a rule can only reach a segment through its group.
2. Whether another group already holds the segment, since a segment cannot be in two groups.
3. Whether a group deleted outside Terraform still has APP_GROUP operands in policy rules.
4. Whether a rule's only application criterion is an empty group.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.segment-groups.membership:sdk-delete-leaves-operands] Tier B: Chain of evidence: the cleanup is in the provider, not the SDK delete. Assumes the service does not remove the operands itself, which no source states (see stale-operand-behavior).
- [zpa.segment-groups.membership:empty-group-rule-noop] Tier B: Chain of evidence: the criterion is evaluated by checking whether the requested segment or its segment group is present; a group with no members is the group of no segment. The evaluation of an empty group is not stated by any source.

Not known (open gaps):
- How a membership change on one side is reflected on the other [gap:zpa.segment-groups.membership:membership-write-semantics]: settled by lab-test. Blocks: saying whether reassigning segment_group_id on a segment updates both groups' applications lists
- What happens to application segments when their segment group is deleted [gap:zpa.segment-groups.membership:delete-group-with-members]: settled by lab-test. Blocks: saying whether the segments are rejected, orphaned or reassigned
- What a policy rule does when an APP_GROUP operand names a deleted segment group [gap:zpa.segment-groups.membership:stale-operand-behavior]: settled by lab-test. Blocks: saying whether such a rule errors on read, never matches, or has the operand dropped
- What the service does with a segment created without a segment group [gap:zpa.segment-groups.membership:omitted-segment-group-id]: settled by lab-test. Blocks: saying a Terraform segment without segment_group_id is created and silently unreachable

Area: zpa.segment-groups, its subjects in references/_meta/spine/zpa/zpa.segment-groups.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.segment-groups.policy-use.md (How access policy rules use segment groups): A segment group deleted through the SDK or the API directly can leave `APP_GROUP` operands for its ID in policy rules, because the cleanup that removes them exists only in the Terraform delete path. [zpa.segment-groups.membership:sdk-delete-leaves-operands]
- interacts-with references/_meta/text/zpa/zpa.policy.access-rule-order.md (Access policy rule order), from zpa.segment-groups: An allow rule for all applications for Marketing, listed above a rule denying Marketing the Operations Apps segment group, leaves Marketing with access to that group, because Private Access stops at the first matching rule. [zpa.policy.access-rule-order:segment-group-allow-shadows-deny]
- links-to references/_meta/text/zpa/zpa.terraform.delete-paths.md (What the ZPA Terraform provider does when deleting objects with dependents)
- links-to references/_meta/text/zpa/zpa.terraform.policy-rule-writes.md (What the ZPA Terraform provider sends and loses when writing policy rules)
