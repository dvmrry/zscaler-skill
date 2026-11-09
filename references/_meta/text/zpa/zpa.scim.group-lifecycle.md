# What happens when SCIM users and groups are deleted or renamed (zpa.scim.group-lifecycle)
Also called: scim delete user zpa; scim group deleted rule; dangling scim group; scim group renamed; okta deactivate zpa; browser access scim removal; all_entries scim groups
Former IDs: zpa-63

This subject covers what happens to users and groups after they leave the IdP.

**Users.** Deleting a user in the IdP and then a SCIM update from the IdP to Private Access removes the user from Private Access, which can be checked on the SCIM Users page. [zpa.scim.group-lifecycle:removal-flow] SCIM user deletion applies to users connected through Zscaler Client Connector; users accessing applications through Browser Access cannot be removed from Private Access using SCIM. [zpa.scim.group-lifecycle:browser-access-excluded] With Okta as the IdP, users are not deleted but deactivated, and deactivated users can no longer access private applications. [zpa.scim.group-lifecycle:okta-deactivates] The active flag itself is in [In ZPA, active=false deletes the user, so the same IdP action is reversible in ZIA and destructive in ZPA.](kb:zia.scim.deactivation:zpa-deletes).

**Groups.** The SCIM group list and get calls take an allEntries parameter that returns all SCIM groups including the deleted ones when set to true, and the Python SDK exposes it as all_entries. [zpa.scim.group-lifecycle:deleted-groups-retrievable] What a rule does with a deleted group is open [gap:zpa.scim.group-lifecycle:zpa-63-deleted-group-in-rule], as is how ZPA handles the IdP's delete [gap:zpa.scim.group-lifecycle:group-delete-handling].

**Renames and lookups.** The Go SDK looks a SCIM group up by name within one IdP's listing and matches case-insensitively, and fails with 'no SCIM group named ... was found' when no group has that name. [zpa.scim.group-lifecycle:lookup-by-current-name] What a rename changes is open [gap:zpa.scim.group-lifecycle:rename-behavior].

Operand forms are in [SCIM groups and attributes as ZPA policy criteria](kb:zpa.scim.policy-criteria).

What to check:
1. Whether the user is connected through Zscaler Client Connector or Browser Access, since SCIM removal does not reach Browser Access users.
2. Whether the IdP is Okta, which deactivates rather than deletes, and how ZPA treats the active flag.
3. Whether a rule's SCIM group still exists, by listing groups with allEntries set.
4. Whether a lookup by name uses the group's current IdP name, within the right IdP.

Not known (open gaps):
- What a rule does when its SCIM_GROUP operand points at a deleted group [gap:zpa.scim.group-lifecycle:zpa-63-deleted-group-in-rule]: settled by lab-test. Blocks: saying a stale group reference fails silently rather than loudly, or which way it fails
- How ZPA handles an IdP's group delete [gap:zpa.scim.group-lifecycle:group-delete-handling]: settled by support-ticket or lab-test. Blocks: the dangling-reference question
- What a group rename in the IdP changes in ZPA [gap:zpa.scim.group-lifecycle:rename-behavior]: settled by lab-test. Blocks: whether rules and Terraform lookups survive a rename

Area: zpa.scim, its subjects in references/_meta/spine/zpa/zpa.scim.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.scim.provisioning-timing.md (When SCIM data is ready for ZPA policy), from zpa.scim: It can take several days for the IdP to sync all user information to ZPA completely. [zpa.scim.provisioning-timing:several-days]
- links-to references/_meta/text/zia/zia.scim.deactivation.md (What SCIM does when a user is disabled or deleted)
- links-to references/_meta/text/zpa/zpa.scim.policy-criteria.md (SCIM groups and attributes as ZPA policy criteria)
