# ZIA SCIM attribute mapping (zia.scim.attribute-mapping)
Also called: scim attributes; scim department attribute; enterprise user extension; scim externalId; name.givenName; scim custom attributes; scim required attributes; scim userName login

"The user is in ZIA but the department rule misses them" is an attribute-mapping question. ZIA maps these SCIM user attributes: id to a Zscaler-generated unique ID; externalId to scim_externalid; userName to the user ID (login_name) in user@domain form; displayName to the display name (user_name); groups to Groups; active to enabled or disabled; department to Department; name.givenName and name.familyName to first and last name; emails.value to scim_emails. [zia.scim.attribute-mapping:user-fields] ZIA maps these SCIM group attributes: id to a Zscaler-generated unique ID, externalId to scim_externalid (kept in the Zscaler database), and displayName to the group Name. [zia.scim.attribute-mapping:group-fields]

**Which attribute is the identity.** The user ID rules are in [ZIA users, groups and departments: shape and limits](kb:zia.ad-integration.identity-objects), and the domain in the login must be registered as described in [Enabling ZIA SCIM: prerequisites, base URL and token](kb:zia.scim.setup). Only the SCIM userName attribute maps to the ZIA login name; externalId and emails.value map to the reference fields scim_externalid and scim_emails. [zia.scim.attribute-mapping:login-from-username-only]

**Name attributes.** ZIA's SCIM name attributes use the singular prefix name. (name.givenName, name.familyName); the ZPA mapping uses names.givenName. [zia.scim.attribute-mapping:name-prefix]

**Department.** In Zscaler's create and update examples the department is sent inside the enterprise user extension (urn:ietf:params:scim:schemas:extension:enterprise:2.0:User), and the Go SDK models it as the `Department` field of an `EnterpriseUser` struct held in the SCIM user's enterprise extension field. [zia.scim.attribute-mapping:enterprise-department] A SCIM connector that sends only the core user schema, without the enterprise extension, sends no department, so the ZIA user has an empty department and department-scoped rules do not match that user. [zia.scim.attribute-mapping:connector-omits-department] In the PingOne guide's SCIM attribute table Department maps to department. In the Entra ID guide the table maps the enterprise-extension department attribute to department. [zia.scim.attribute-mapping:department-per-idp] The Entra ID and Google Workspace guides write the department attribute path differently [divergence:zia.scim.attribute-mapping:department-attribute-path]. Whether the string must match an existing department is a separate question: [How SCIM groups and departments land in ZIA](kb:zia.scim.groups-and-departments).

**Per-IdP mappings.** The Entra ID guide's mapping tables send, for users, userPrincipalName to userName, objectId to externalId, the expression Switch([IsSoftDeleted], , "False", "True", "True", "False") to active, surname to name.familyName, givenName to name.givenName and displayName to displayName; for groups, displayName to displayName, members to members and objectId to externalId. [zia.scim.attribute-mapping:entra-scim-mappings] The PingOne guide maps Enabled to active, Family Name to familyName, Given Name to givenName, Username to userName and Email Address to workEmail, and builds displayName from the expression user.name.given + " " + user.name.family. The Google Workspace guide maps Formatted name to displayName, Last name to name.familyName, First name to name.givenName and Username to userName. [zia.scim.attribute-mapping:pingone-google-scim-mappings] Where the Workflow Automation Admin Portal is used, the Entra ID and Okta guides add user attributes beyond the core mapping, for example the enterprise-extension manager.value, employeeNumber and mobile phoneNumbers in Entra ID, and manager and employeeNumber in Okta. The guides add them for Workflow Automation; whether ZIA itself stores them is not stated. [zia.scim.attribute-mapping:workflow-automation-attributes]

Three points are open: which attributes are required [gap:zia.scim.attribute-mapping:required-attributes], whether custom attributes are persisted [gap:zia.scim.attribute-mapping:custom-attributes], and how the remaining IdPs handle department by default [gap:zia.scim.attribute-mapping:per-idp-department-mapping].

What to check:
1. Whether the connector sends the department inside the enterprise user extension, or omits it.
2. Whether userName, in user@domain form, is mapped to the login rather than externalId or emails.value.
3. Whether a mapping copied from a ZPA connector still uses names.givenName and names.familyName.
4. Whether the ZIA user record's department field is set after a push.

Inferred, not quoted (say so when an answer rests on one):
- [zia.scim.attribute-mapping:connector-omits-department] Tier B: Derived from the department being carried in the extension; whether a given connector emits the extension by default is not captured, and the consequence for rules follows from the user record lacking the value.
- [zia.scim.attribute-mapping:login-from-username-only] Tier B: Reads the mapping list as complete: no other attribute is mapped to login_name.

Sources disagree (name both sides):
- The Entra ID and Google Workspace guides write the enterprise-extension department attribute with a colon and with a dot before department. [divergence:zia.scim.attribute-mapping:department-attribute-path]
  - zscaler-help: The Entra ID table maps urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department (a colon before department) to department.
  - zscaler-help: The Google Workspace table maps Department to urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.department (a dot before department).
  Impact: The enterprise-department claim's create and update examples put department inside the enterprise extension object, which matches neither notation literally. The dot may be the Google console's notation for the same target; the guides do not say, so do not tell an operator which path string to type for a custom connector.

Not known (open gaps):
- Which SCIM attributes ZIA requires [gap:zia.scim.attribute-mapping:required-attributes]: settled by tenant-data or support-ticket. Blocks: telling an IdP admin which attributes are mandatory
- Whether ZIA persists attributes outside the documented mapping [gap:zia.scim.attribute-mapping:custom-attributes]: settled by lab-test or support-ticket. Blocks: answering whether a custom IdP attribute can drive ZIA policy
- How each IdP maps or omits the department attribute by default [gap:zia.scim.attribute-mapping:per-idp-department-mapping]: settled by source-read or operator-experience. Blocks: telling operators whether their connector sends department out of the box

Area: zia.scim, its subjects in references/_meta/spine/zia/zia.scim.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ad-integration.directory-sync.md (Directory (LDAP/AD) synchronization behavior), from zia.scim: SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory]
- interacts-with references/_meta/text/zia/zia.ad-integration.saml-auto-provisioning.md (SAML auto-provisioning: what login creates and overwrites), from zia.scim: SAML auto-provisioning is to be disabled when SCIM provisioning is enabled for an IdP. [zia.ad-integration.saml-auto-provisioning:scim-excludes]
- depends-on references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work), from zia.scim: Zscaler supports only SCIM version 2.0, and SAML must be the authentication method to use SCIM for provisioning. [zia.scim.setup:scim2-and-saml]
- links-to references/_meta/text/zia/zia.ad-integration.identity-objects.md (ZIA users, groups and departments: shape and limits)
- links-to references/_meta/text/zia/zia.scim.groups-and-departments.md (How SCIM groups and departments land in ZIA)
- links-to references/_meta/text/zia/zia.scim.setup.md (Enabling ZIA SCIM: prerequisites, base URL and token)
