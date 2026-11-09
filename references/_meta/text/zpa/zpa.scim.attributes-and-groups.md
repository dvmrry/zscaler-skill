# SCIM attributes and groups in Private Access (zpa.scim.attributes-and-groups)
Also called: scim attributes page; scim groups page; supported scim attributes; scim username nameid; scim custom attributes; internal group id; scim group read only

This subject covers what SCIM provides to Private Access. Enabling SCIM lets the Zero Trust Exchange quickly remove users from Private Access when a user is disabled or deleted in the user directory, and enforce policies based on SCIM attributes and SCIM groups. [zpa.scim.attributes-and-groups:purpose]

**Groups.** SCIM groups are configured in the IdP and pulled into Private Access when SCIM is enabled (the help page calls them attributes configured in the IdP), and the SCIM Groups page lists the groups synced to Private Access over SCIM by the IdP. [zpa.scim.attributes-and-groups:groups-from-idp] For each SCIM group the console shows the time of its last action (Last Updated), an Internal Group ID, the SCIM Group Name as identified by the IdP, the IdP SCIM Group ID, and the total and active user counts. [zpa.scim.attributes-and-groups:group-page-fields]

**Users.** The SCIM Users page lists the users synced to Private Access over SCIM by the IdP, once a SCIM-enabled IdP is selected. It can be filtered by SCIM Group Name or SCIM User Name and over a period between 7 Days and 6 Months or a Custom Range within the last 6 months (default None); each user shows Last Updated, Internal User ID (ZPA's internal ID), SCIM User Name and IdP SCIM User ID, and the View icon opens the Attribute Values drawer. [zpa.scim.attributes-and-groups:users-page] The log of operations that changed users and groups is in [SCIM Sync Logs in Private Access](kb:zpa.scim.sync-logs).

**Attributes.** The supported SCIM attributes are active, costCenter, department, displayName, division, emails.value, names.givenName, name.formatted, name.familyName, a Zscaler-generated id, organization, title, userName and userType. [zpa.scim.attributes-and-groups:supported-attributes] Currently only the username is a required attribute and the only unique attribute, and the SCIM username attribute must match nameID in the SAML attribute. [zpa.scim.attributes-and-groups:required-unique] The first-name path is spelled differently in two places [divergence:zpa.scim.attributes-and-groups:given-name-path]. ZIA's own name-attribute prefix is in [ZIA SCIM attribute mapping](kb:zia.scim.attribute-mapping).

**What cannot be authored.** The SCIM group and SCIM attribute API resources are described as allowing you to read them, the SCIM Attributes page is a read-only table, and Private Access does not support custom SCIM attributes; SCIM groups are pulled in from the IdP when SCIM is enabled. [zpa.scim.attributes-and-groups:read-only-objects] So SCIM groups and attributes are read in Private Access rather than authored there. [zpa.scim.attributes-and-groups:read-not-authored]

**IdPs.** Private Access works with any IdP that supports the SCIM standard, SailPoint being one example, and the IdP set up for SAML authentication is most often the one used for SCIM. [zpa.scim.attributes-and-groups:any-idp]

How a flag in the user record, or a deletion, takes effect is in [What SCIM does when a user is disabled or deleted](kb:zia.scim.deactivation) and [What happens when SCIM users and groups are deleted or renamed](kb:zpa.scim.group-lifecycle); the shared lifecycle is in the general [SCIM provisioning across ZIA and ZPA: where the two differ](kb:shared.scim) reference.

What to check:
1. Whether the attribute or group in question is a supported SCIM attribute or a synced group, rather than a custom attribute, which Private Access does not support.
2. Whether the SCIM username attribute matches nameID in the SAML assertion, since it is the required and unique attribute.
3. Which spelling of a name attribute the IdP's header list uses before writing a lookup by name.
4. Whether the group is listed on the SCIM Groups page for the IdP, with its Last Updated time.
5. How an active flag or a deletion reaches Private Access, which is covered for ZIA and ZPA together.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.scim.attributes-and-groups:read-not-authored] Tier B: Follows from read-only-objects: the legacy API page describes the SCIM group and SCIM attribute API resources only as letting you read them, the SCIM Attributes page is a read-only table with no custom attributes, and SCIM groups are pulled in from the IdP. No source states that Private Access offers no way to create or change them.

Sources disagree (name both sides):
- The SCIM attribute path for a user's first name. [divergence:zpa.scim.attributes-and-groups:given-name-path]
  - zscaler-help: The supported attribute for first name is names.givenName.
  - tf-zpa: The data source example looks up the attribute header called name.givenName.
  Impact: A lookup by header name fails if the header's name is not the one written in the configuration; which spelling the tenant's header list carries is shown only by listing the headers.

Area: zpa.scim, its subjects in references/_meta/spine/zpa/zpa.scim.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.scim.provisioning-timing.md (When SCIM data is ready for ZPA policy), from zpa.scim: It can take several days for the IdP to sync all user information to ZPA completely. [zpa.scim.provisioning-timing:several-days]
- links-to references/_meta/text/shared/shared.scim.md (SCIM provisioning across ZIA and ZPA: where the two differ)
- links-to references/_meta/text/zia/zia.scim.attribute-mapping.md (ZIA SCIM attribute mapping)
- links-to references/_meta/text/zia/zia.scim.deactivation.md (What SCIM does when a user is disabled or deleted)
- links-to references/_meta/text/zpa/zpa.scim.group-lifecycle.md (What happens when SCIM users and groups are deleted or renamed)
- links-to references/_meta/text/zpa/zpa.scim.sync-logs.md (SCIM Sync Logs in Private Access)
