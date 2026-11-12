# How access policy rules use segment groups (zpa.segment-groups.policy-use)
Also called: APP_GROUP operand; segment group in access policy rule; segment group OR application segment; disabled segment group policy effect; rename segment group policy
Former IDs: sg-01

This subject covers how access policy rules refer to segment groups.

**Operand shape.** A policy rule refers to a segment group by ID: a v1 operand is `APP_GROUP` with `lhs` `id` and the group ID as `rhs`, and a v2 operand is `APP_GROUP` with the group ID in `values`. [zpa.segment-groups.policy-use:operand-holds-id]

**Choosing a group or a segment.** Rules use segments for individual applications and groups for shared access: [A rule can include individual application segments as well as segment groups: segments are used to apply different policies to individual applications, and segment groups to give a set of users similar access across many applications.](kb:zpa.policy.criteria:application-segments-criterion). A segment added to a group named in a rule falls under that rule through its group, without the rule being edited. [zpa.segment-groups.policy-use:new-member-extends-rule]

**Boolean logic.** Groups are joined by an implicit OR, and segments and groups by an explicit OR: [Private Access uses an implicit OR between multiple application segments, and between multiple segment groups, in one rule.](kb:zpa.policy.conditions:segments-or), [Private Access uses an explicit OR between the application segment criteria and the segment group criteria, so a request matches the application scope if its segment or its segment group is present.](kb:zpa.policy.conditions:segment-or-group-or). A rule's application criterion is satisfied when the requested application segment, or the segment group that holds it, is one the rule names. [zpa.segment-groups.policy-use:criterion-checks-segment-or-group] Other criteria are joined by AND: [Where a rule has additional criteria, Private Access uses an explicit AND between them.](kb:zpa.policy.conditions:criteria-and).

**Rename and disable.** Renaming a segment group leaves policy rules unchanged because they hold its ID, while a lookup by name, such as the SDK `GetByName` or a Terraform data source by name, must use the new name. [zpa.segment-groups.policy-use:rename-effects] The effect of disabling a group is open [gap:zpa.segment-groups.policy-use:enabled-false-effect].

**Segment group policies.** Segment group policies are being phased out, and a segment group policy can no longer be added using the Group Policy tab; to control application access based on segment group, an access policy rule that includes the group within its Criteria must be used. [zpa.segment-groups.policy-use:segment-group-policies-phased-out] To retain or modify an existing segment group policy it must be migrated; migration converts all segment group policy rules formerly under the Group Policy tab into an access policy rule on the Access Policy page, after which the migrated segment group policy rule is deleted automatically. An existing segment group policy can also be deleted without migrating its rules, and the Segment Groups page only displays the migration icon for groups that contain a segment group policy that has not been migrated or deleted. [zpa.segment-groups.policy-use:migration-converts-rules] Private Access evaluates access policy rules prior to any segment group policy rules that have not been migrated, and Diagnostics can be used to verify that migrated rules are taking effect in the access policy. [zpa.segment-groups.policy-use:access-before-unmigrated] Where migrated rules land and how many access rules result is not stated [gap:zpa.segment-groups.policy-use:migration-result-shape].

Rule order and first-match evaluation are in [Evaluation order across ZPA policy types](kb:zpa.policy.evaluation-order). The policy types the provider scans on group delete are in [When a segment group is deleted, the provider reads the v2 rules of the ACCESS, TIMEOUT, SIEM, CLIENT_FORWARDING and INSPECTION policy types, removes the segment group operand, converts the whole rule with ConvertV1ResponseToV2Request and PUTs the converted rule.](kb:zpa.terraform.policy-rule-writes:cleanup-rewrites-rule-from-converter). Membership is in [Which application segments belong to a segment group](kb:zpa.segment-groups.membership).

What to check:
1. Whether a rule names the segment group, the application segment or both, and whether other criteria in the rule are joined by AND.
2. Whether the group's enabled flag is false when a rule that names it appears not to match.
3. Whether a lookup by group name still resolves after a rename, since rules hold the ID.
4. If a segment group still has a segment group policy, check whether it was migrated or deleted, since unmigrated segment group policy rules are evaluated after access policy rules.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.segment-groups.policy-use:criterion-checks-segment-or-group] Tier B: Chain of evidence: the help describes the check as 'an application segment OR its segment group are present'; this restates it as the match condition.
- [zpa.segment-groups.policy-use:new-member-extends-rule] Tier B: Chain of evidence: the criterion checks the segment's group, so a new member satisfies it. The service's handling of the new membership is not stated.
- [zpa.segment-groups.policy-use:rename-effects] Tier B: Chain of evidence: operands hold the ID (operand-holds-id) and the SDK name lookup compares the name. Rule behavior after a rename was not exercised.

Not known (open gaps):
- Whether migrating several segment group policy rules yields one access rule or one per rule, and where they land in the rule order [gap:zpa.segment-groups.policy-use:migration-result-shape]: settled by lab-test
- The policy-evaluation effect of enabled = false on a segment group [gap:zpa.segment-groups.policy-use:enabled-false-effect]: settled by lab-test. Blocks: using the enabled flag on a group as an access-control switch

Area: zpa.segment-groups, its subjects in references/_meta/spine/zpa/zpa.segment-groups.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.policy.conditions.md (Boolean logic and operand forms of ZPA policy conditions)
- decided-by references/_meta/text/zpa/zpa.policy.criteria.md (Criteria available on ZPA access policy rules): A rule can include individual application segments as well as segment groups: segments are used to apply different policies to individual applications, and segment groups to give a set of users similar access across many applications. [zpa.policy.criteria:application-segments-criterion]
- depends-on references/_meta/text/zpa/zpa.segment-groups.membership.md (Which application segments belong to a segment group): A segment added to a group named in a rule falls under that rule through its group, without the rule being edited. [zpa.segment-groups.policy-use:new-member-extends-rule]
- interacts-with references/_meta/text/zpa/zpa.policy.access-rule-order.md (Access policy rule order), from zpa.segment-groups: An allow rule for all applications for Marketing, listed above a rule denying Marketing the Operations Apps segment group, leaves Marketing with access to that group, because Private Access stops at the first matching rule. [zpa.policy.access-rule-order:segment-group-allow-shadows-deny]
- links-to references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types)
- links-to references/_meta/text/zpa/zpa.terraform.policy-rule-writes.md (What the ZPA Terraform provider sends and loses when writing policy rules)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.terraform.delete-paths.md (What the ZPA Terraform provider does when deleting objects with dependents)
