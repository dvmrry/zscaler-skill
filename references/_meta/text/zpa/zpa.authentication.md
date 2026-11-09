# ZPA authentication: IdP configuration, authentication settings and user risk scores (zpa.authentication)
Also called: ZPA authentication; Private Access single sign-on; ZPA SSO; Private Access Authentication menu

"How does a user or admin authenticate to Private Access, and what is configured for it?" takes six questions.

1. **How is the IdP set up?** Fields, User and Admin SSO, arbitrary domains and the policy settings: [Configuring an IdP for Private Access single sign-on](kb:zpa.authentication.idp-configuration).
2. **Is a certificate expiring or being rotated?** IdP certificate expiry and service provider certificate rotation: [IdP certificates and service provider certificate rotation in Private Access](kb:zpa.authentication.idp-certificates).
3. **Is the tenant moving to a new IdP?** The two methods, prerequisites and fallback: [Migrating Private Access to a new IdP](kb:zpa.authentication.idp-migration).
4. **What does the IdP side need?** Per-IdP guides for Okta, OneLogin, PingOne, Azure AD, ADFS and SafeNet: [Per-IdP setup guides for Private Access SSO (Okta, OneLogin, PingOne, Azure AD, ADFS, SafeNet)](kb:zpa.authentication.idp-guides).
5. **What are the tenant-wide options?** Admin SSO enforcement, CORS, SameSite, session timeout and authentication domains: [Private Access authentication settings (admin SSO enforcement, CORS, SameSite, session timeout, authentication domains)](kb:zpa.authentication.settings).
6. **How are user risk scores shown and overridden?** Levels, page columns and overrides: [User risk scores in Private Access](kb:zpa.authentication.user-risk-scores).

SAML attributes are in [ZPA SAML attributes](kb:zpa.saml-attributes) and SCIM in [ZPA SCIM groups and attributes in policy](kb:zpa.scim). Authentication failures are in [Authentication failures and step-up prompt loops in ZPA](kb:zpa.troubleshooting.authentication), and the Client Connector error codes in [Private Access authentication errors Client Connector users might see during enrollment: 2008 and the 42xxx codes the vendor lists](kb:zcc.troubleshooting.private-access-auth-errors).

Area: zpa.authentication, its subjects in references/_meta/spine/zpa/zpa.authentication.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.troubleshooting.private-access-auth-errors.md (Private Access authentication errors Client Connector users might see during enrollment: 2008 and the 42xxx codes the vendor lists)
- links-to references/_meta/text/zpa/zpa.authentication.idp-certificates.md (IdP certificates and service provider certificate rotation in Private Access)
- links-to references/_meta/text/zpa/zpa.authentication.idp-configuration.md (Configuring an IdP for Private Access single sign-on)
- links-to references/_meta/text/zpa/zpa.authentication.idp-guides.md (Per-IdP setup guides for Private Access SSO (Okta, OneLogin, PingOne, Azure AD, ADFS, SafeNet))
- links-to references/_meta/text/zpa/zpa.authentication.idp-migration.md (Migrating Private Access to a new IdP)
- links-to references/_meta/text/zpa/zpa.authentication.settings.md (Private Access authentication settings (admin SSO enforcement, CORS, SameSite, session timeout, authentication domains))
- links-to references/_meta/text/zpa/zpa.authentication.user-risk-scores.md (User risk scores in Private Access)
- links-to references/_meta/text/zpa/zpa.saml-attributes.md (ZPA SAML attributes)
- links-to references/_meta/text/zpa/zpa.scim.md (ZPA SCIM groups and attributes in policy)
- links-to references/_meta/text/zpa/zpa.troubleshooting.authentication.md (Authentication failures and step-up prompt loops in ZPA)
