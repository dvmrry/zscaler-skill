# Enabling ZIA SCIM: prerequisites, base URL and token (zia.scim.setup)
Also called: enable scim; scim base url; scim bearer token; generate token; scim domain registration; scim prerequisites; scim saml required; scim idp guides; migrate directory sync to scim

This page covers switching SCIM on for an identity provider, the endpoint and token it uses, and which accounts it can create. Zscaler supports only SCIM version 2.0, and SAML must be the authentication method to use SCIM for provisioning. [zia.scim.setup:scim2-and-saml]

**Where it is switched on.** SCIM is enabled per identity provider: an IdP must first be added in the Admin Console, which creates the identifier used in the SCIM base URL, then Enable SCIM Provisioning is turned on in the Edit IdP window, after which the base URL and bearer token appear. [zia.scim.setup:enable-per-idp] SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory] The org-wide migration switch behind that last step is [directorySyncMigrateToScimEnabled disables directory synchronization for the user repository type so that SCIM provisioning or SAML auto-provisioning can be enabled; it is the setting for migrating from directory synchronization to SCIM.](kb:zia.authentication.settings:scim-migration-flag), and whether it can be undone is open in [The organization-wide authentication settings object](kb:zia.authentication.settings). The SAML side that must be disabled for the same IdP is in [SAML auto-provisioning: what login creates and overwrites](kb:zia.ad-integration.saml-auto-provisioning).

**How the client reaches it.** The SCIM base URL has the form https://scim.<Zscaler Cloud>/<Organization ID>/<IdP ID>/scim; the old base URL marked Deprecated will be removed. Okta needs only the /<Organization ID>/<IdP ID>/ parts. [zia.scim.setup:base-url] SCIM clients authenticate with a unique alphanumeric bearer token, copied from the identity provider's Edit IdP window in the Zscaler Admin Console and needed when configuring the IdP for SCIM provisioning. Generate Token issues a new one, and the IdP must then be updated with it. The informational calls /Schemas, /ServiceProviderConfig and /ResourceTypes need no authentication. [zia.scim.setup:bearer-token] The Go SDK takes its own SCIM token, see [What the Go and Python SDKs do for ZIA SCIM](kb:zia.scim.sdk-coverage).

**Which accounts can be created.** When creating users, the domain in the username must be preregistered with Zscaler; for test@safemarch.com, safemarch.com must be registered to the tenant, and Zscaler Support can assist. [zia.scim.setup:domain-preregistered] What a push for an unregistered domain returns is open [gap:zia.scim.setup:unregistered-domain-error].

**Which IdPs.** Zscaler publishes SAML and SCIM configuration guides for Microsoft Entra ID, Okta and PingFederate; custom SCIM clients can call the REST API directly. [zia.scim.setup:idp-guides] The configuration guides captured separately cover more IdPs than that article lists: Zscaler's configuration guides cover SAML and SCIM together for Microsoft Entra ID, Okta and PingOne; the Google Workspace guide gives SAML settings (an ACS URL) and lists the SCIM features supported; and the PingFederate guide defers SAML and SCIM configuration to the PingFederate documentation. [zia.scim.setup:guides-configuring-scim] An IdP outside the three guides is not ruled out: the provisioning overview says to check that a cloud IdP supports SCIM 2.0 and to obtain and implement a SCIM client. [zia.scim.setup:other-idps] Whether SCIM works with the IdPs whose captured guides cover SAML only is open [gap:zia.scim.setup:legacy-idp-list]. How each IdP maps the department attribute is in [ZIA SCIM attribute mapping](kb:zia.scim.attribute-mapping).

**Migrating from directory sync.** The AD-to-SCIM migration guide's prerequisites are the repository type set to Active Directory in the Admin Console, SAML for authentication with AD for provisioning, and AD syncing the database to Zscaler and the IdP. During the migration the database type must not be changed from Active Directory to Hosted DB: doing so can cause all existing user and group mappings to be deleted and creates duplicate users with SCIM provisioning. [zia.scim.setup:migration-prerequisites] In the migration guide, Sync Now performs a manual sync with the AD so the service has the latest database, then Disable Directory Sync & Enable SCIM Provisioning is enabled; Zscaler recommends disabling Enable SAML Auto-Provisioning when using SCIM provisioning. After the IdP is configured, users syncing from the IdP should match those on the Users page, which stays read-only because the User Repository Type is Active Directory. If a ZAB is used, the guide says it is safe to disable the ZAB VM when no provisioning issues are observed after a few days. [zia.scim.setup:migration-steps]

What to check:
1. Whether a migration from directory sync keeps the repository type Active Directory rather than changing it to Hosted DB.
2. Whether SCIM is enabled on the IdP and the base URL in the client matches the one shown after enabling.
3. Whether the bearer token was regenerated without updating the IdP.
4. Whether SAML auto-provisioning is off for the same IdP.
5. Whether the user's domain is registered with Zscaler.

Inferred, not quoted (say so when an answer rests on one):
- [zia.scim.setup:other-idps] Tier B: Inferred from the overview's wording; the ZIA articles do not state that any SCIM 2.0 IdP works. The ZPA article does say so for ZPA.

Not known (open gaps):
- Whether SCIM works with AD FS, OneLogin and CA SSO [gap:zia.scim.setup:legacy-idp-list]: settled by source-read or support-ticket. Blocks: telling an operator whether AD FS, OneLogin or CA SSO can provision by SCIM
- What a push for an unregistered domain returns [gap:zia.scim.setup:unregistered-domain-error]: settled by lab-test or support-ticket. Blocks: diagnosing a user that never appears after the IdP reports a push

Area: zia.scim, its subjects in references/_meta/spine/zia/zia.scim.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ad-integration.saml-auto-provisioning.md (SAML auto-provisioning: what login creates and overwrites): SAML auto-provisioning is to be disabled when SCIM provisioning is enabled for an IdP. [zia.ad-integration.saml-auto-provisioning:scim-excludes]
- interacts-with references/_meta/text/zia/zia.ad-integration.directory-sync.md (Directory (LDAP/AD) synchronization behavior): SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory]
- depends-on references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work): Zscaler supports only SCIM version 2.0, and SAML must be the authentication method to use SCIM for provisioning. [zia.scim.setup:scim2-and-saml]
- links-to references/_meta/text/zia/zia.authentication.settings.md (The organization-wide authentication settings object)
- links-to references/_meta/text/zia/zia.scim.attribute-mapping.md (ZIA SCIM attribute mapping)
- links-to references/_meta/text/zia/zia.scim.sdk-coverage.md (What the Go and Python SDKs do for ZIA SCIM)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/auth-settings.md (config type)
- see-also references/_meta/text/zia/zia.scim.md (ZIA SCIM provisioning)
