# External IdPs in Authentication Service: OIDC and SAML, primary and secondary, limits and retention (zidentity.overview.external-idps)
Also called: ZIdentity external IdP; Authentication Service IdP; primary IdP; secondary IdP; OIDC or SAML for ZIdentity; 64 IdPs; SAML certificate expiring ZIdentity; Entra ID with ZIdentity; Okta with ZIdentity

Authentication Service can authenticate users against external IdPs and take users from them. Authentication Service supports OIDC and SAML external IdP configurations and can support any IdP that follows a standard SAML, OIDC or SCIM implementation; it redirects users to different IdPs according to the configured IdP criteria. [zidentity.overview.external-idps:protocols]

**Primary and secondary.** IdPs are configured as a primary IdP and secondary IdPs, a primary IdP must be configured before any secondary IdP, and the About External Identity Providers page says an organization can configure a maximum of 64 IdPs. [zidentity.overview.external-idps:primary-secondary] Whether the 64 counts all IdPs or only secondary ones differs between two help pages [divergence:zidentity.overview.external-idps:idp-count]. IdPs can be configured for different user domains; each secondary IdP shows the domains assigned to it. [zidentity.overview.external-idps:domains] The Domains field and the rest of an IdP's form are in [Configuring an external IdP in Authentication Service: domains, login ID attribute, OIDC and SAML fields, admin MFA enforcement, signing certificates and IdP-initiated sign-in](kb:zidentity.overview.external-idps.configuration). Users and groups from the primary IdP are kept in Authentication Service if the primary IdP is removed, to ease moving the primary IdP to another provider; users and groups from a secondary IdP are not kept when that IdP is removed. [zidentity.overview.external-idps:idp-removal-retention]

**Which IdPs.** The help's table of example IdPs lists Microsoft Entra ID (OIDC via Gallery App), Okta (OIDC via OIN App and Custom App), Microsoft AD FS, PingOne, Auth0, OneLogin and PingFederate, each supported over both OIDC, which the table marks as recommended, and SAML. [zidentity.overview.external-idps:example-idps] What each vendor's guide says differently is in [Per-IdP integration specifics for Authentication Service: Okta, Microsoft Entra ID, AD FS, PingOne, PingFederate, Auth0 and OneLogin](kb:zidentity.overview.external-idps.integrations).

**OIDC and step-up.** How strictly step-up authentication depends on OIDC, on which two help pages differ, is in [Step-up authentication: when Authentication Service asks for a stronger login, and why a prompt may not appear](kb:zidentity.step-up).

**Provisioning.** Which provisioning to use, and what SCIM removals of admins do in each product: [Getting users into and out of Authentication Service: JIT, SCIM, and what IdP removals do to admins](kb:zidentity.users.provisioning).

**Admin MFA and certificates.** The External Identities page shows, for the primary IdP and for each secondary IdP, whether Authentication Service MFA is enabled or disabled for admins. [zidentity.overview.external-idps:admin-mfa-per-idp] The console shows a banner when an IdP certificate or SAML request signing and decryption certificate expires within 90 days or has expired, and marks enabled SAML certificates with a caution icon when expiry is within 90 days and a red exclamation mark once expired. [zidentity.overview.external-idps:cert-warnings] The option that enforces it and the certificates' lifecycle are in [Configuring an external IdP in Authentication Service: domains, login ID attribute, OIDC and SAML fields, admin MFA enforcement, signing certificates and IdP-initiated sign-in](kb:zidentity.overview.external-idps.configuration).

What to check:
1. Whether the IdP in question is the primary or a secondary one before removing it, since only the primary's users and groups are kept.
2. Whether Authentication Service MFA for admins is enabled on each IdP.
3. Whether an enabled SAML certificate is expired or within 90 days of expiry.

Sources disagree (name both sides):
- Whether 64 is the maximum number of IdPs per organization or the maximum number of secondary IdPs. [divergence:zidentity.overview.external-idps:idp-count]
  - zscaler-help: Authentication Service allows a maximum of 64 IdPs per organization.
  - zscaler-help: Up to 64 secondary IdPs can be added, which with one primary IdP would make 65.
  Impact: Trusting the first page, an agent says a tenant with a primary and 64 secondary IdPs is over the limit; trusting the second, it says the 65th IdP is allowed. Neither page says which count the console enforces.

Area: zidentity.overview, its subjects in references/_meta/spine/zidentity/zidentity.overview.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zidentity/zidentity.step-up.md (Step-up authentication: when Authentication Service asks for a stronger login, and why a prompt may not appear), from zidentity.overview: The help names three uses: access to critical applications as defined by ZIA and ZPA access policies, which integrate with Authentication Service to enforce them; increased risk, where unusual behavior or a changed environment such as an unrecognized device or location might trigger a request for a higher level; and compliance, where certain data must be protected with MFA. [zidentity.step-up:use-cases]
- links-to references/_meta/text/zidentity/zidentity.overview.external-idps.configuration.md (Configuring an external IdP in Authentication Service: domains, login ID attribute, OIDC and SAML fields, admin MFA enforcement, signing certificates and IdP-initiated sign-in)
- scoped-by references/_meta/text/zidentity/zidentity.entitlements.md (Administrative and service entitlements: who administers and who may use each Zscaler service), from zidentity.overview: A user can be given admin entitlements, which make them an administrator of a Zscaler service such as ZIA or ZPA, or service entitlements, which let them authenticate to a Zscaler service as an end user. [zidentity.entitlements:two-kinds]
- links-to references/_meta/text/zidentity/zidentity.overview.external-idps.integrations.md (Per-IdP integration specifics for Authentication Service: Okta, Microsoft Entra ID, AD FS, PingOne, PingFederate, Auth0 and OneLogin)
- links-to references/_meta/text/zidentity/zidentity.users.provisioning.md (Getting users into and out of Authentication Service: JIT, SCIM, and what IdP removals do to admins)
