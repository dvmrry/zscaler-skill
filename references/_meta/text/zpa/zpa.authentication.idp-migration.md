# Migrating Private Access to a new IdP (zpa.authentication.idp-migration)
Also called: IdP migration; migrate to a new IdP; dummy domain migration; switch IdP

Migrating to a new IdP has two methods, and Zscaler prefers editing the existing IdP. Zscaler recommends migrating by editing the existing IdP: adding a new IdP can duplicate groups and departments and existing policies might no longer apply, and editing avoids recreating policies that reference SAML or SCIM attributes. The best-practices page also recommends editing the existing IdP. [zpa.authentication.idp-migration:edit-recommended]

**Prerequisites.** The same user data (groups, users and departments) must be present in both IdPs, their SAML and SCIM mapping attributes must match, and the NameID (SAML) and userName (SCIM) mappings must be defined the same way in both. [zpa.authentication.idp-migration:prerequisites]

**Editing the existing IdP.** In the edit method the admin copies the SCIM Service Provider Endpoint and the token (generating a new token with Generate New Token if it was not saved), updates the configuration with the new IdP's metadata or, if it cannot be downloaded, its Single Sign-On URL, IdP Entity ID and IdP Certificate, and enables SCIM Sync. Zscaler recommends updating all SAML attribute names from the new IdP, including those used in policies, unless the names are the same in both IdPs. [zpa.authentication.idp-migration:edit-method] After the migration, reauthentication does not happen automatically until Client Connector reconnects to the Public Service Edge for Private Access or the user triggers a timeout policy that requires reauthentication. Two triggers the page lists are turning Private Access off and on in the Client Connector Private Access tab, and exiting and relaunching Client Connector. [zpa.authentication.idp-migration:reauth-not-automatic] Whether the stated reauthentication behavior holds outside a migration is open in [Authentication failures and step-up prompt loops in ZPA](kb:zpa.troubleshooting.authentication).

**Two additional IdP configurations.** The second method needs two IdP configurations created first and is recommended when editing the existing IdP and migrating does not work, for example when an existing IdP is used for both admins and users. It enables SCIM Sync and SCIM Attributes for policy on the new configuration, adds the same SCIM and SAML attributes from IdP 2 to the access, timeout and client forwarding policies (an error appears in Client Connector if an admin accesses the application during that step), then removes the domain from IdP 1 and adds it to IdP 2. The existing IdP stays enabled and unmodified for a few days, and can be decommissioned after validating there are no observable issues. [zpa.authentication.idp-migration:dummy-domain-method] How many days a few days is before the old IdP can be decommissioned is open [gap:zpa.authentication.idp-migration:decommission-wait].

**Falling back.** To fall back from the edit method the admin adds the IdP configuration from the previous IdP used before migration and enables SCIM Sync for it. To fall back from the second method the admin removes the domain2.com dummy domain from IdP 2, adds it to IdP 1 and reauthenticates to authenticate against IdP 1. The second-method fallback then enables SCIM Sync for the previous IdP configuration. [zpa.authentication.idp-migration:fallback]

**Caveats.** Users logged in to Private Access during the migration see an authentication error in Client Connector and must reauthenticate, which is required to apply the new SAML attributes. If SCIM Attributes for Policy is enabled and users are not provisioned to the Admin Console through SCIM, they cannot log in to Private Access with Client Connector. Privileged Remote Access and browser-based authenticated sessions still require reauthentication. [zpa.authentication.idp-migration:caveats]

The IdP fields are in [Configuring an IdP for Private Access single sign-on](kb:zpa.authentication.idp-configuration), and the SAML attributes the migration replaces and the SCIM setup it enables are in [Registering SAML attributes in Private Access](kb:zpa.saml-attributes.registration) and [Enabling SCIM for Private Access: endpoint, token, policy setting and IdP guides](kb:zpa.scim.setup).

What to check:
1. Whether the existing IdP can be edited or serves both admins and users, which decides the method.
2. Whether the two IdPs hold the same user data and the same NameID and userName mappings.
3. Whether users have reauthenticated since the migration, since reauthentication does not happen automatically and SCIM-based policy needs provisioned users.

Not known (open gaps):
- How long the old IdP is kept before decommissioning [gap:zpa.authentication.idp-migration:decommission-wait]: settled by support-ticket

Area: zpa.authentication, its subjects in references/_meta/spine/zpa/zpa.authentication.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.authentication.idp-configuration.md (Configuring an IdP for Private Access single sign-on)
- links-to references/_meta/text/zpa/zpa.saml-attributes.registration.md (Registering SAML attributes in Private Access)
- links-to references/_meta/text/zpa/zpa.scim.setup.md (Enabling SCIM for Private Access: endpoint, token, policy setting and IdP guides)
- links-to references/_meta/text/zpa/zpa.troubleshooting.authentication.md (Authentication failures and step-up prompt loops in ZPA)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.authentication.md (ZPA authentication: IdP configuration, authentication settings and user risk scores)
