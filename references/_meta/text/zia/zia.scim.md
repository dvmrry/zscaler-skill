# ZIA SCIM provisioning (zia.scim)
Also called: scim; scim provisioning zia; scim user not appearing; scim group not in policy; scim troubleshooting; idp push zia

"The user is in the IdP but not in ZIA policy" or "the group is missing from the rule" has a short list of places to look. SCIM provisions users and groups onto Zscaler, automatically updates a user's group and department in the Zscaler user database to follow the directory, and deprovisions users deleted from the directory. It can be driven by a custom SCIM client calling the REST API, or by an IdP partnered with Zscaler. [zia.scim:purpose]

1. **Is SCIM actually enabled for this IdP, with the right prerequisites?** [Enabling ZIA SCIM: prerequisites, base URL and token](kb:zia.scim.setup).
2. **Did the attribute the rule needs get sent and mapped?** [ZIA SCIM attribute mapping](kb:zia.scim.attribute-mapping).
3. **Did the group or department land as the object the rule references?** [How SCIM groups and departments land in ZIA](kb:zia.scim.groups-and-departments).
4. **Is the client within the server's operations and limits?** Endpoints, filters, paging and the rate limit: [ZIA SCIM server operations, paging and rate limit](kb:zia.scim.operations).
5. **What does disabling or deleting do?** [What SCIM does when a user is disabled or deleted](kb:zia.scim.deactivation).
6. **How quickly does a change show up?** [How fast SCIM changes reach ZIA](kb:zia.scim.propagation).
7. **Is the problem the Go or Python client rather than the service?** [What the Go and Python SDKs do for ZIA SCIM](kb:zia.scim.sdk-coverage).

The shared SCIM protocol mechanics are in [SCIM provisioning across ZIA and ZPA: where the two differ](kb:shared.scim), and the ZPA side is in [ZPA SCIM groups and attributes in policy](kb:zpa.scim). Provisioning choices around SCIM (the alternatives, the directory-sync migration) are in [ZIA provisioning methods and which authentication each allows](kb:zia.ad-integration.provisioning-methods). What SAML does to the same users is in [SAML auto-provisioning: what login creates and overwrites](kb:zia.ad-integration.saml-auto-provisioning). The migration flag is in [directorySyncMigrateToScimEnabled disables directory synchronization for the user repository type so that SCIM provisioning or SAML auto-provisioning can be enabled; it is the setting for migrating from directory synchronization to SCIM.](kb:zia.authentication.settings:scim-migration-flag).

Area: zia.scim, its subjects in references/_meta/spine/zia/zia.scim.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ad-integration.saml-auto-provisioning.md (SAML auto-provisioning: what login creates and overwrites): SAML auto-provisioning is to be disabled when SCIM provisioning is enabled for an IdP. [zia.ad-integration.saml-auto-provisioning:scim-excludes]
- interacts-with references/_meta/text/zia/zia.ad-integration.directory-sync.md (Directory (LDAP/AD) synchronization behavior): SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory]
- depends-on references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work): Zscaler supports only SCIM version 2.0, and SAML must be the authentication method to use SCIM for provisioning. [zia.scim.setup:scim2-and-saml]
- links-to references/_meta/text/shared/shared.scim.md (SCIM provisioning across ZIA and ZPA: where the two differ)
- links-to references/_meta/text/zia/zia.ad-integration.provisioning-methods.md (ZIA provisioning methods and which authentication each allows)
- links-to references/_meta/text/zia/zia.authentication.settings.md (The organization-wide authentication settings object)
- links-to references/_meta/text/zia/zia.scim.attribute-mapping.md (ZIA SCIM attribute mapping)
- links-to references/_meta/text/zia/zia.scim.deactivation.md (What SCIM does when a user is disabled or deleted)
- links-to references/_meta/text/zia/zia.scim.groups-and-departments.md (How SCIM groups and departments land in ZIA)
- links-to references/_meta/text/zia/zia.scim.operations.md (ZIA SCIM server operations, paging and rate limit)
- links-to references/_meta/text/zia/zia.scim.propagation.md (How fast SCIM changes reach ZIA)
- links-to references/_meta/text/zia/zia.scim.sdk-coverage.md (What the Go and Python SDKs do for ZIA SCIM)
- links-to references/_meta/text/zia/zia.scim.setup.md (Enabling ZIA SCIM: prerequisites, base URL and token)
- links-to references/_meta/text/zpa/zpa.scim.md (ZPA SCIM groups and attributes in policy)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/users.md (config type)
- configured-via references/_meta/text/types/zia/groups.md (config type)
- configured-via references/_meta/text/types/zia/departments.md (config type)
