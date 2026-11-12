# AEM asset compliance policies: permissions, creation, preview, save and run, management actions (aem.policies)
Also called: aem policy; asset compliance policy; policy rule; save and run policy

Asset compliance policy rules generate policy violations on assets that are out of compliance with a security standard; violations can be assigned to an owner, tracked against an SLA deadline and prioritized with a severity score. [aem.policies:purpose]

**Access.** Access to Policies requires a role with Read, Create and Edit permissions under the Assets App > Policy Rule resource. [aem.policies:permission] The policy creation page says the Asset Admin can create and manage policies but can't delete them; the policy management page says the same of users assigned the Assets Admin role. [aem.policies:admin-cannot-delete]

**Creating.** Creating a policy involves selecting the policy category, defining the asset population the policy applies to, and setting the policy scenario (the conditions that generate a policy violation). [aem.policies:creation-elements] On the Create New Policy page, Preview tests the policy configuration and displays the top 50 policy violations it generates. [aem.policies:preview-top-50] Save applies a policy the next time data is ingested into the account, while Save & Run from the Save drop-down saves it and runs it immediately. [aem.policies:save-run] The creation form sections are open [gap:aem.policies:creation-sections].

**Result.** After a policy is created and saved, assets that violate it automatically generate policy violations, which are aggregated into violation tickets. [aem.policies:policy-violation-flow] The violations are in [AEM policy violations: the Policy Violations page, views, charts, columns and drawer](kb:aem.policy-violations) and the tickets in [AEM violation tickets: the Violation Tickets page, drawer, split and merge, comments and activity log](kb:aem.violation-tickets).

**Managing.** In the Policies table a policy can be edited, deleted, duplicated, processed immediately, and its runs can be viewed. [aem.policies:manage-actions] Scenario setup for the Tool Coverage, CMDB Hygiene and OS End of Life policies is in [AEM Tool Coverage, CMDB Hygiene and OS End of Life policies, and updating CMDB asset records](kb:aem.policy-templates).

Not known (open gaps):
- What the policy creation sections contain and which policy categories exist [gap:aem.policies:creation-sections]: settled by source-read or lab-test

Area: aem.policies, its subjects in references/_meta/spine/aem/aem.policies.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/aem/aem.policy-templates.md (AEM Tool Coverage, CMDB Hygiene and OS End of Life policies, and updating CMDB asset records)
- links-to references/_meta/text/aem/aem.policy-violations.md (AEM policy violations: the Policy Violations page, views, charts, columns and drawer)
- links-to references/_meta/text/aem/aem.violation-tickets.md (AEM violation tickets: the Violation Tickets page, drawer, split and merge, comments and activity log)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/aem/aem.overview.md (Asset Exposure Management (AEM): the asset inventory, coverage gaps and policies, and what can be automated)
