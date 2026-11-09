# How SCIM groups and departments land in ZIA (zia.scim.groups-and-departments)
Also called: scim group; scim department name match; scim_group operand zia; group not in policy dropdown; scim group members; department auto-create

Groups and departments are two different ZIA objects, and SCIM fills both, in different ways. A SCIM group becomes a Zscaler group: its displayName is the group Name, its externalId is kept as scim_externalid, and Zscaler generates its ID. Members are added by user ID in the members list. [zia.scim.groups-and-departments:group-object] The department is a user attribute, mapped in [ZIA SCIM attribute mapping](kb:zia.scim.attribute-mapping); what the department string must resolve to is open [gap:zia.scim.groups-and-departments:department-no-match].

**How rules see them.** Groups are used in policies, and a SCIM-sourced group is the same kind of object, so a rule reaches it through the ordinary Groups criterion. No captured ZIA article describes a separate SCIM-group operand like the one ZPA uses. [zia.scim.groups-and-departments:policy-uses-groups] ZPA enforces policy on SCIM attributes and SCIM groups, while the ZIA SCIM page describes SCIM as updating a user's group and department on the Zscaler user database. [zia.scim.groups-and-departments:zpa-contrast] Where identity criteria are accepted, and what each rule type needs for them, is owned by the rule areas: [How URL Filtering rule criteria combine](kb:zia.url-filtering.criteria), [SSL/TLS inspection rule criteria and the ones that silently don't match](kb:zia.ssl-inspection.criteria), [Forwarding Control rule criteria, limits and ordering](kb:zia.forwarding-control.rules), [Web DLP policy rules: order, criteria and actions](kb:zia.dlp.rules) (including the rule for unauthenticated traffic) and [Which firewall features need Advanced Firewall](kb:zia.firewall.licensing) (identity criteria need Advanced Firewall). Per-rule caps are in [Firewall rule, criteria and group limits](kb:zia.firewall.limits).

**Missing group.** A group the IdP connector does not push is not created by SCIM, and groups can also be created in the console, by CSV import or in a policy, so a group missing from ZIA is a question of connector scope or of where the group was meant to come from. [zia.scim.groups-and-departments:unpushed-group] How a rule scoped to a never-created group behaves is open [gap:zia.scim.groups-and-departments:missing-group-in-rules]. The objects and limits are in [ZIA users, groups and departments: shape and limits](kb:zia.ad-integration.identity-objects).

The total number of groups associated with a single ZIA user cannot exceed 128. [zia.scim.groups-and-departments:user-group-cap] ZPA's limit is 1,000 groups per user: [Private Access syncs at most 1,000 groups per user, leaving the rest unsynced until some are removed for that user in the IdP, with no limit on the number of SCIM groups synced, and lists a limit of 50 SCIM updates per second.](kb:zpa.scim.provisioning-timing:group-limits).

What to check:
1. Whether the connector's group scope covers the group, and whether the group exists in ZIA at all.
2. Whether the department string exactly equals an existing department name.

Inferred, not quoted (say so when an answer rests on one):
- [zia.scim.groups-and-departments:policy-uses-groups] Tier B: Absence in the captured ZIA SCIM and group articles; not checked against every rule type's criteria list.
- [zia.scim.groups-and-departments:unpushed-group] Tier B: Derived from SCIM creating groups only from pushes and from groups having other creation paths; how a rule referencing a never-created group behaves is not captured.

Not known (open gaps):
- What happens to a department string with no matching ZIA department [gap:zia.scim.groups-and-departments:department-no-match]: settled by lab-test. Blocks: advice on pre-creating departments before enabling SCIM
- How a rule scoped to a group that was never created behaves [gap:zia.scim.groups-and-departments:missing-group-in-rules]: settled by lab-test or tenant-data. Blocks: diagnosing a rule that matches nobody after a connector scope change

Area: zia.scim, its subjects in references/_meta/spine/zia/zia.scim.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ad-integration.directory-sync.md (Directory (LDAP/AD) synchronization behavior), from zia.scim: SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory]
- interacts-with references/_meta/text/zia/zia.ad-integration.saml-auto-provisioning.md (SAML auto-provisioning: what login creates and overwrites), from zia.scim: SAML auto-provisioning is to be disabled when SCIM provisioning is enabled for an IdP. [zia.ad-integration.saml-auto-provisioning:scim-excludes]
- depends-on references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work), from zia.scim: Zscaler supports only SCIM version 2.0, and SAML must be the authentication method to use SCIM for provisioning. [zia.scim.setup:scim2-and-saml]
- links-to references/_meta/text/zia/zia.ad-integration.identity-objects.md (ZIA users, groups and departments: shape and limits)
- links-to references/_meta/text/zia/zia.dlp.rules.md (Web DLP policy rules: order, criteria and actions)
- links-to references/_meta/text/zia/zia.firewall.licensing.md (Which firewall features need Advanced Firewall)
- links-to references/_meta/text/zia/zia.firewall.limits.md (Firewall rule, criteria and group limits)
- links-to references/_meta/text/zia/zia.forwarding-control.rules.md (Forwarding Control rule criteria, limits and ordering)
- links-to references/_meta/text/zia/zia.scim.attribute-mapping.md (ZIA SCIM attribute mapping)
- links-to references/_meta/text/zia/zia.ssl-inspection.criteria.md (SSL/TLS inspection rule criteria and the ones that silently don't match)
- links-to references/_meta/text/zia/zia.url-filtering.criteria.md (How URL Filtering rule criteria combine)
- links-to references/_meta/text/zpa/zpa.scim.provisioning-timing.md (When SCIM data is ready for ZPA policy)
