# SAML SSO for Cloud & Branch Connector admins: IdP-initiated sign-in, the break-glass super admin and the Okta, Azure AD and AD FS settings (cloud-connector.admin-sso)
Also called: cloud connector admin saml; branch connector admin sso; bac-adminsso.do; cloud connector admin okta; cloud connector admin azure ad saml; cloud connector admin ad fs; admin sp entity id connector

Cloud & Branch Connector admins can sign in with SAML initiated by an identity provider. The Zscaler service supports authenticating administrators using SAML initiated by an identity provider; an admin can log in to the Admin Console by single sign-on by clicking the Zscaler application icon in the provider's portal, and the service supports SAML 2.0 and later. [cloud-connector.admin-sso:idp-initiated] Admins are not added through auto-provisioning: an admin must be added in the Admin Console first and can then use SAML authentication to log in. [cloud-connector.admin-sso:no-auto-provisioning] Zscaler recommends at least one super admin with password authentication enabled, so that an admin can still reach the Admin Console even if SAML servers external to the Zscaler service become unreachable. [cloud-connector.admin-sso:break-glass]

**Before configuring.** The prerequisites are admin accounts for the organization's admins, a configured IdP (such as AD FS, Okta or Azure Active Directory) and the IdP's SAML certificate, which is uploaded to the Admin Console when configuring the service to use SAML. [cloud-connector.admin-sso:prerequisites] The configuration steps go to Administration > Legacy Admin Management > Branch and Cloud Connector > Administrators Management and say to click ZIdentity Administration to configure administrators. [cloud-connector.admin-sso:zidentity-administration] The Okta, AD FS 3.0 and Azure AD admin SAML guides each say that if the organization is subscribed to Authentication Service, some of the options are configurable only within the Authentication Service Admin Portal. [cloud-connector.admin-sso:auth-service-note]

**Okta.** In the Okta guide the Single sign on URL for the SAML settings is https://connector.<Zscaler Cloud>.net/bac-adminsso.do. [cloud-connector.admin-sso:okta-acs] Okta downloads the certificate as a .cert, but the Admin Console supports only .cer or .pem files, so the file must be converted before uploading it. [cloud-connector.admin-sso:okta-cert-format]

**Azure AD.** In the Azure AD guide the Reply URL takes the form of the example https://connector.Zscalerbeta.net/bac-adminsso.do, with the Index field set to 1, and the optional Sign on URL is left blank. [cloud-connector.admin-sso:azure-reply] For Azure AD admins to authenticate through the Zscaler service, they must be assigned to the Zscaler Cloud and Branch Connector Administrator Application, which by default is visible to admins in their My Apps portal. [cloud-connector.admin-sso:azure-assignment]

**AD FS 3.0.** The AD FS guide is for a Windows Server 2012 R2 running AD FS 3.0 as the IdP; in it the LDAP attribute User-Principal-Name is mapped to the outgoing claim type Name ID, the certificate is exported as Base-64 encoded X.509 (.CER), and the IdP-initiated sign-in page is at https://<AD FS Server>/adfs/ls/idpinitiatedSignOn.aspx. [cloud-connector.admin-sso:adfs]

**The entity ID.** The two guides name different service provider entity IDs for the same sign-in URL [divergence:cloud-connector.admin-sso:sp-entity-id].

**Open.** The console configuration step of each guide has no body in the capture [gap:cloud-connector.admin-sso:console-step], and whether the guides still apply on Authentication Service tenants is not stated [gap:cloud-connector.admin-sso:guides-current]. Who may add admins is a role matter: [Administrator Management lets admins add other admins, search for configured admins and view a list of all admins configured for the organization.](kb:shared.admin-rbac.cloud-connector:admin-mgmt).

What to check:
1. Keep at least one super admin with password authentication so the console stays reachable if the SAML servers are unreachable.
2. For an admin whose SAML sign-in fails, that the admin was added in the Admin Console first, and which service provider entity ID the identity provider is sending, since the Okta and Azure AD guides differ.
3. For an Okta admin whose certificate upload is rejected, whether the .cert file was converted to .cer or .pem.

Sources disagree (name both sides):
- The Okta guide gives admin.<Zscaler Cloud>.net as the service provider entity ID for Cloud & Branch Connector admin SAML; the Azure AD guide gives connector.<Zscaler Cloud>.net. Neither guide explains the difference. [divergence:cloud-connector.admin-sso:sp-entity-id]
  - zscaler-help: Okta guide: the Audience URI (SP Entity ID) is admin.<Zscaler Cloud>.net.
  - zscaler-help: Azure AD guide: the Identifier (Entity ID) is connector.<Zscaler Cloud>.net.
  Impact: An IdP configured from the wrong guide may send an entity ID the Admin Console does not expect; the pages do not say which value is accepted, whether both are, or whether it depends on the IdP, so confirm against the tenant.

Not known (open gaps):
- The Admin Console SAML configuration step of the IdP guides [gap:cloud-connector.admin-sso:console-step]: settled by source-read or lab-test
- Whether the Okta, Azure AD and AD FS guides still apply on Authentication Service tenants [gap:cloud-connector.admin-sso:guides-current]: settled by support-ticket or lab-test

Area: cloud-connector.admin-sso, its subjects in references/_meta/spine/cloud-connector/cloud-connector.admin-sso.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.admin-rbac.cloud-connector.md (Cloud & Branch Connector admin roles: super admin, the eleven permission categories and Unified RBAC)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.overview.md (Cloud & Branch Connector: what Cloud Connector is and where each area is described)
- see-also references/_meta/text/zidentity/zidentity.overview.external-idps.md (External IdPs in Authentication Service: OIDC and SAML, primary and secondary, limits and retention)
- see-also references/_meta/text/cloud-connector/cloud-connector.audit-logs.md (Cloud & Branch Connector audit logs in the console: what is recorded, retention, lockout, filters and CSV)
