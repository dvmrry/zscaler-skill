# Authentication Service user groups: predefined and custom groups, dynamic groups, membership and limits (zidentity.groups)
Also called: ZIdentity groups; Authentication Service groups; user groups; dynamic group; isDynamicGroup; dynamicGroup; Zscaler Global Administrators; Zscaler Emergency Access group; Dynamic Group Guest Domains; 1000 groups per user; replace group members

Groups are how users are handed entitlements and roles in bulk. A group is a logical entity of several users, created to assign many users to Zscaler services quickly; groups can be assigned to administrative entitlements, service entitlements and admin roles, and there are custom and predefined groups. [zidentity.groups:what-groups-are]

**Predefined groups.** The predefined groups are Dynamic Group Administrators (administrative entitlements), Zscaler Global Administrators (the initial group, with global administrative entitlements), Zscaler Emergency Access (the Private Access emergency access entitlement), Dynamic Group Guest Domains (users from guest domains) and Dynamic Group Registered Domains (users from registered domains). Predefined groups cannot be edited or deleted. [zidentity.groups:predefined-groups] The Zscaler Emergency Access and Dynamic Group Guest Domains groups are prerequisites for ZPA emergency access users: [For Authentication Service users, Arbitrary Guest Domains must be enabled, and the user must be in the Dynamic Group Guest Domains and Zscaler Emergency Access groups and assigned the Zscaler Private Access service entitlement.](kb:zpa.emergency-access.identity:auth-service-prerequisites).

**Super admin.** To give users super admin privileges for Authentication Service and all the services linked to it, the help says to add them to the Zscaler Global Administrators group. [zidentity.groups:global-admins-super-admin]

**How many groups a user can be in.** The About User Groups page says a user can be in up to 1,000 groups. Each service needs a matching limit; where a service's per-user limit is lower, it counts the user's group assignments only up to that limit (the help's example: a user in 500 groups on a Private Access subscription for 128 groups per user has only the first 128 assignments considered there). [zidentity.groups:membership-limit] The Adding Users and CSV import pages give other numbers [divergence:zidentity.groups:group-count-per-user].

**Where a group comes from.** A group record's source is one of UI (created or managed in a user interface), API (through API calls), SCIM (provisioned by SCIM) or JIT (created or updated by just-in-time provisioning). [zidentity.groups:source-values] Whether a SCIM-provisioned group can be changed through the console or API is open [gap:zidentity.groups:scim-group-mutation].

**Dynamic groups.** A group record carries `isDynamicGroup`, which says whether the group is dynamic, and the group list can exclude dynamic groups. [zidentity.groups:dynamic-flag] Creating a group through the API takes a name (required, at most 128 characters) and a description (at most 256 characters in the contract); the request has no source, dynamic flag, entitlement flags or IdP. [zidentity.groups:create-fields] So the published API creates only static groups and neither reads nor writes the rules that decide a dynamic group's members. [zidentity.groups:dynamic-not-creatable] Why the SDKs also carry a second dynamic flag, and what happens when the two disagree, is open [gap:zidentity.groups:dual-flag], as is a manual add to a dynamic group [gap:zidentity.groups:dynamic-manual-add].

**Entitlement flags.** A group record says whether the group supports admin entitlements (`adminEntitlementEnabled`) and whether it supports service entitlements (`serviceEntitlementEnabled`). [zidentity.groups:entitlement-flags] The group record in the API reference has no group status or enabled flag (no `status`, `enabled`, `disabled` or `isEnabled`); its only `...Enabled` booleans, `adminEntitlementEnabled` and `serviceEntitlementEnabled`, say whether the group supports admin or service entitlements. [zidentity.groups:no-status-flag] A user record does carry a status: [A user is Active or Inactive and is activated or deactivated from the console; in the API the status is a boolean, true for active and false for disabled.](kb:zidentity.users:status).

**Membership.** Membership is changed by adding one user, adding a list of users, replacing the group's user list (which completely replaces all existing users in the group) or removing one user, and the group's users can be listed. [zidentity.groups:membership-ops] In the console, the User Groups page imports new groups or modifies existing ones from a CSV file and bulk-deletes several selected groups. [zidentity.groups:console-ops] What a bulk add does with a repeated user ID is open [gap:zidentity.groups:bulk-add-duplicates].

**Adding groups in the console.** In the console a group name can have up to 128 characters and the optional description up to 10,240 characters. [zidentity.groups:console-name-description] The API contract gives a different description limit [divergence:zidentity.groups:description-length]. The users to include are added before the group is created, or a group can be assigned to a user when the user is configured. [zidentity.groups:console-users-first]

**Group CSV import.** Up to 1,000 user groups can be imported at once by CSV; the template's header row has Action, Name, Description and Disabled columns, + adds a group (Name filled in, Description optional) and - deletes one (Name filled in), one group per line. [zidentity.groups:group-csv] Override Existing Entries is selected to update existing user group details, delete users (the page's wording) or add new user groups, and left off to only add new groups; without it, importing a group that already exists shows an error that an identical group cannot be imported. [zidentity.groups:group-csv-override] What the Disabled column does is open [gap:zidentity.groups:csv-disabled-column].

**In product policy.** How a change in Authentication Service group membership reaches ZIA and ZPA policy, and how fast, is open [gap:zidentity.groups:policy-effect]; the provisioning side is in [Getting users into and out of Authentication Service: JIT, SCIM, and what IdP removals do to admins](kb:zidentity.users.provisioning).

**Not stated anywhere.** Several group behaviors the legacy reference listed have no source [gap:zidentity.groups:unstated-behaviors].

What to check:
1. Whether the user is in more groups than the target service's per-user limit, in which case only the first assignments up to that limit count there.
2. Before a replace, whether the new list is the complete membership, since the replace removes every user not in it.
3. Whether the group is predefined (not editable or deletable) or dynamic (not created through the API) before planning a change to it.
4. Whether the group came from SCIM, in which case the IdP may own its membership.

Inferred, not quoted (say so when an answer rests on one):
- [zidentity.groups:dynamic-not-creatable] Tier B: Follows from the create request having only a name and a description, and from the group schemas in the API reference carrying no membership-rule field. The console's handling of dynamic groups is not captured.

Sources disagree (name both sides):
- The longest group description: 10,240 characters in the console, 256 in the API contract's create request. [divergence:zidentity.groups:description-length]
  - zscaler-help: The Adding User Groups page says the description cannot exceed 10,240 characters; both sources give 128 for the name.
  - api-specs: The group create request's description has maxLength 256.
  Impact: A description between 257 and 10,240 characters may be accepted in the console and rejected through the API, or the contract may understate the limit; no source says which.
- How many groups a user can belong to: 1,000 on the About User Groups page, 1,024 on the Adding Users page, 128 on the CSV import page. [divergence:zidentity.groups:group-count-per-user]
  - zscaler-help: A user can be part of up to 1,000 groups, and the services need similar limits.
  - zscaler-help: A user account can belong to up to 1,024 groups.
  - zscaler-help: In the CSV page's line for adding a user, a user can belong to up to 128 groups; the page does not say what this 128 applies to, and the About User Groups page uses 128 only as an example of a Private Access per-user limit.
  Impact: An agent that quotes one number gives a limit two other pages contradict. The 128 may be a CSV-only or service-side limit, but no page says so; none of the three says which the console enforces.

Not known (open gaps):
- What the group CSV's Disabled column does [gap:zidentity.groups:csv-disabled-column]: settled by lab-test or source-read. Blocks: building a group import file
- What the SDKs' second dynamic-group flag is [gap:zidentity.groups:dual-flag]: settled by tenant-data. Blocks: deciding which flag to trust when classifying a group as dynamic
- What a manual membership change does to a dynamic group [gap:zidentity.groups:dynamic-manual-add]: settled by lab-test. Blocks: predicting the result of scripted membership changes on dynamic groups
- How a bulk add treats a repeated user ID [gap:zidentity.groups:bulk-add-duplicates]: settled by lab-test. Blocks: predicting a bulk membership call built from unsanitized input
- Whether SCIM-provisioned groups can be changed in Authentication Service [gap:zidentity.groups:scim-group-mutation]: settled by lab-test or source-read. Blocks: deciding whether to change a SCIM group in Authentication Service or in the IdP
- How Authentication Service group changes reach ZIA and ZPA policy [gap:zidentity.groups:policy-effect]: settled by lab-test or source-read. Blocks: predicting when a group membership change starts or stops matching a ZIA or ZPA rule
- Group behaviors no source states [gap:zidentity.groups:unstated-behaviors]: settled by lab-test or source-read. Blocks: planning bulk membership changes and cleanup after user deletion

Area: zidentity.groups, its subjects in references/_meta/spine/zidentity/zidentity.groups.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zidentity/zidentity.entitlements.md (Administrative and service entitlements: who administers and who may use each Zscaler service): A group record says whether the group supports admin entitlements (`adminEntitlementEnabled`) and whether it supports service entitlements (`serviceEntitlementEnabled`). [zidentity.groups:entitlement-flags]
- links-to references/_meta/text/zidentity/zidentity.users.md (Authentication Service users: where they come from, status, bulk actions and admin-side actions)
- links-to references/_meta/text/zidentity/zidentity.users.provisioning.md (Getting users into and out of Authentication Service: JIT, SCIM, and what IdP removals do to admins)
- links-to references/_meta/text/zpa/zpa.emergency-access.identity.md (Emergency Access identity: where users live, which IdPs, and how they sign in)
