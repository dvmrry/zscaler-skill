# Per-IdP setup guides for Private Access SSO (Okta, OneLogin, PingOne, Azure AD, ADFS, SafeNet) (zpa.authentication.idp-guides)
Also called: Okta SSO guide; Azure AD SSO guide; ADFS 2.0 and 3.0; OneLogin; PingOne; Gemalto SafeNet Authentication Manager; Zscaler Private Access 2.0 app

Six per-IdP guides describe the IdP side of single sign-on for Private Access; the Admin Console side is in [Configuring an IdP for Private Access single sign-on](kb:zpa.authentication.idp-configuration). Each of the Okta, OneLogin, PingOne, Microsoft Azure AD, Microsoft ADFS, and Gemalto SafeNet Authentication Manager guides lists the same prerequisite: a Private Access account with an administrator role that allows adding an IdP Configuration. [zpa.authentication.idp-guides:admin-role-prerequisite]

**Catalog applications.** The catalog application differs by IdP: Okta uses Zscaler Private Access 2.0 for user and admin SSO; OneLogin and PingOne use Zscaler Private Access 2.0 for user SSO and Zscaler Private Access Administrator 2.0 for admin SSO; Azure AD uses Zscaler Private Access (ZPA) for user SSO and Zscaler Private Access Administrator for admin SSO. ADFS and SafeNet are not covered by this statement. [zpa.authentication.idp-guides:gallery-apps] For OneLogin and for PingOne, the IdP metadata file uploaded to the Admin Console populates the Name, Single Sign-On URL and IdP Entity ID fields, sets ZPA (SP) SAML Request to Signed and uploads the IdP Certificate automatically. [zpa.authentication.idp-guides:metadata-sets-signed]

**Okta.** The Okta application must use the SAML 2.0 sign-on option. Passing Okta group information in the SAML response is optional; the guide's example of selecting Matches Regex and entering .* sends information for all Okta groups. For user SSO with SCIM the guide points to the SCIM Configuration Guide for Okta. [zpa.authentication.idp-guides:okta]

**OneLogin.** In OneLogin the identifier within the Service Provider URL string from the Admin Console is copied and pasted into the Unique identifier field in the OneLogin portal; the guide's example URL is https://adminsamlsp.private.zscaler.com/auth/144118148382065352/sso. [zpa.authentication.idp-guides:onelogin-identifier]

**PingOne.** In PingOne the ACS URL and Entity ID fields are populated automatically with the Service Provider URL and Service Provider Entity ID, and the guide instructs to map the identity bridge attributes to the attributes required by Private Access and then continue. [zpa.authentication.idp-guides:pingone]

**ADFS 2.0 and 3.0.** In the ADFS guide the relying party trust's Federation metadata address is the service provider (Zscaler) entity ID for user or admin SSO, with Permit all users and the SHA-256 security hash algorithm. A Send LDAP Attributes as Claims rule is added; the guide's example maps email addresses to Name ID where the email address is the same as the Private Access username. The IdP metadata is at https://<ADFS Server Name>/FederationMetadata/2007-06/FederationMetadata.xml. [zpa.authentication.idp-guides:adfs]

**Azure AD.** Azure AD SSO needs a premium Azure AD subscription, or one that has used less than 10 gallery SSO applications with the license. Identifier (Entity ID) is the Service Provider Entity ID and Reply URL is the Service Provider URL; for user SSO the Sign on URL repeats the Reply URL, and for admin SSO it is left blank. Azure AD users must be assigned to the Private Access application to authenticate. [zpa.authentication.idp-guides:azure-ad-setup] The Azure AD group mapping procedure applies to Private Access user SSO only, and customizes the role claim type in the SAML response token to push groups, each group paired with its own role (1:1). Group mapping is not required if user-friendly group names are only sent to Azure AD using Azure AD Connect and AD Connect is version 1.2.7.0 or greater. The memberOf attribute must be imported to Private Access, and the authentication service imports it automatically. [zpa.authentication.idp-guides:azure-ad-groups]

**Gemalto SafeNet Authentication Manager.** In Gemalto SafeNet Authentication Manager (SAM) the SAM issuer can be any string and must be entered as the IdP Entity ID in the Admin Console, Audience URI is the service provider (Zscaler) entity ID for user or admin SSO, and OTP authentication must be Enabled if users use one-time passwords. Export Certificate downloads the certificate SAM uses for signing SAML assertions. The procedure uses SAM version 8.2 as its example. [zpa.authentication.idp-guides:safenet]

SCIM for Azure AD and Okta is in [Enabling SCIM for Private Access: endpoint, token, policy setting and IdP guides](kb:zpa.scim.setup). Which IdP console versions the guides describe is open [gap:zpa.authentication.idp-guides:console-versions].

What to check:
1. Which catalog application the IdP offers for user SSO and for admin SSO, since the names differ by IdP.
2. For Azure AD, whether the subscription qualifies, the users are assigned to the application and, for user SSO with groups, the group mapping criteria are met.
3. For SafeNet, whether the SAM issuer entered in the IdP guide is the IdP Entity ID entered in the Admin Console.

Not known (open gaps):
- Which IdP console versions the guides describe [gap:zpa.authentication.idp-guides:console-versions]: settled by source-read or lab-test

Area: zpa.authentication, its subjects in references/_meta/spine/zpa/zpa.authentication.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.authentication.idp-configuration.md (Configuring an IdP for Private Access single sign-on)
- links-to references/_meta/text/zpa/zpa.scim.setup.md (Enabling SCIM for Private Access: endpoint, token, policy setting and IdP guides)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.authentication.md (ZPA authentication: IdP configuration, authentication settings and user risk scores)
