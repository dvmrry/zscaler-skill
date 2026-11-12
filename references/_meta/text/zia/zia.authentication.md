# ZIA authentication: how a request gets a user identity (zia.authentication)
Also called: authentication policy; zia authentication; authentication settings; who is this user; unauthenticated user; login flow; authentication gate

"Why did a user rule not match?" and "why is this traffic attributed to the wrong user?" both come down to whether the request carried an identity, and how. Walk it in order.

1. **Is authentication required where the traffic arrives?** It is a per-location, per-sublocation switch, with the per-location methods hanging off it: [Requiring authentication per location and sublocation](kb:zia.authentication.location-enforcement).
2. **How does the request prove who it is?** Cookie after a SAML login, a Kerberos ticket, or a mapping from the source IP: [SAML and Kerberos: what each needs to work](kb:zia.authentication.methods), [Surrogate IP: mapping a private IP to an authenticated user](kb:zia.authentication.surrogate-ip). Kerberos deployment and trust: [Deploying and troubleshooting Kerberos authentication: ports, location behavior, trust, GPO and ticket checks](kb:zia.authentication.kerberos). The SAML IdP object and per-vendor guides: [The ZIA SAML identity provider object: limits, default IdP, criteria, fields, migration and Client Connector Portal as IdP](kb:zia.authentication.identity-providers), [Per-IdP configuration specifics: SAML and SCIM for Entra ID, Okta, Ping and Google Workspace; SAML only for AD FS, OneLogin and CA SSO](kb:zia.authentication.idp-integrations); SAML login failures: [SAML login failures: browser symptoms, Microsoft Edge security zones and the SAML error codes](kb:zia.authentication.saml-troubleshooting); the Identity Proxy: [Zscaler Identity Proxy: Zscaler as the SAML IdP for cloud apps, unmanaged-device actions and its error codes](kb:zia.authentication.identity-proxy).
3. **How long does that proof last?** [Authentication frequency and cookie lifetime](kb:zia.authentication.frequency), with the organization-wide object that holds it in [The organization-wide authentication settings object](kb:zia.authentication.settings).
4. **What happens to traffic with no identity?** It is judged as the location, and some traffic can never carry a cookie: [What happens to traffic with no user identity](kb:zia.authentication.unauthenticated-traffic). Destinations that skip the challenge entirely are in [Destinations that skip authentication](kb:zia.authentication.exemptions).
5. **Does a resource need a stronger login than the session has?** That is step-up authentication, owned by ZIdentity: [Step-up authentication and ZIdentity authentication levels](kb:zia.authentication.step-up).

Policy rules scoped by user, group or department are evaluated against whatever identity the steps above produced, so a rule that "should" match but does not is usually an identity problem upstream of the rule: see [ZIA URL Filtering](kb:zia.url-filtering) for how rules are then evaluated. Location and sublocation definitions themselves are in [ZIA locations, sublocations and location groups](kb:zia.locations); where the authentication gate sits relative to other modules is in [How ZIA and ZPA evaluate policy, side by side](kb:shared.policy-evaluation).

A code shown on a failed login is looked up by kind: generic, directory and Kerberos codes in [ZIA authentication error codes: generic, directory, Kerberos and Identity Proxy](kb:zia.authentication.error-codes), SAML codes in [SAML login failures: browser symptoms, Microsoft Edge security zones and the SAML error codes](kb:zia.authentication.saml-troubleshooting), and Identity Proxy codes in [Zscaler Identity Proxy: Zscaler as the SAML IdP for cloud apps, unmanaged-device actions and its error codes](kb:zia.authentication.identity-proxy). Writing these settings through Terraform has traps of its own, including the exempted-URL list and user enrollment: [ZIA Terraform operations that take several API writes with no rollback](kb:zia.terraform.multi-step-writes).

Area: zia.authentication, its subjects in references/_meta/spine/zia/zia.authentication.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering): A user who is logged in can still have a transaction judged as the location rather than as the user, when the transaction is one that cannot carry the authentication cookie; a user rule does not match that transaction. [zia.authentication.unauthenticated-traffic:logged-in-user-misses-user-rule]
- links-to references/_meta/text/zia/zia.authentication.identity-proxy.md (Zscaler Identity Proxy: Zscaler as the SAML IdP for cloud apps, unmanaged-device actions and its error codes)
- links-to references/_meta/text/zia/zia.authentication.saml-troubleshooting.md (SAML login failures: browser symptoms, Microsoft Edge security zones and the SAML error codes)
- depends-on references/_meta/text/zia/zia.ad-integration.provisioning-methods.md (ZIA provisioning methods and which authentication each allows): Each provisioning method allows only some authentication methods. SCIM: SAML only. Hosted User Database: passwords (default), Kerberos, one-time link, one-time token. Directory server synchronization: LDAP BIND, one-time link, one-time token. ZAB: Hosted User Database, SAML, LDAP BIND, one-time link, one-time token. [zia.ad-integration.provisioning-methods:auth-pairing]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group): Authentication is enforced by the location's own setting (`authRequired`, Enforce Authentication), which the service checks when traffic arrives from a known location. [zia.locations.rule-scoping:authentication-is-a-location-setting]
- links-to references/_meta/text/shared/shared.policy-evaluation.md (How ZIA and ZPA evaluate policy, side by side)
- links-to references/_meta/text/zia/zia.authentication.error-codes.md (ZIA authentication error codes: generic, directory, Kerberos and Identity Proxy)
- links-to references/_meta/text/zia/zia.authentication.exemptions.md (Destinations that skip authentication)
- links-to references/_meta/text/zia/zia.authentication.frequency.md (Authentication frequency and cookie lifetime)
- links-to references/_meta/text/zia/zia.authentication.identity-providers.md (The ZIA SAML identity provider object: limits, default IdP, criteria, fields, migration and Client Connector Portal as IdP)
- links-to references/_meta/text/zia/zia.authentication.idp-integrations.md (Per-IdP configuration specifics: SAML and SCIM for Entra ID, Okta, Ping and Google Workspace; SAML only for AD FS, OneLogin and CA SSO)
- links-to references/_meta/text/zia/zia.authentication.kerberos.md (Deploying and troubleshooting Kerberos authentication: ports, location behavior, trust, GPO and ticket checks)
- links-to references/_meta/text/zia/zia.authentication.location-enforcement.md (Requiring authentication per location and sublocation)
- links-to references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work)
- links-to references/_meta/text/zia/zia.authentication.settings.md (The organization-wide authentication settings object)
- links-to references/_meta/text/zia/zia.authentication.step-up.md (Step-up authentication and ZIdentity authentication levels)
- links-to references/_meta/text/zia/zia.authentication.surrogate-ip.md (Surrogate IP: mapping a private IP to an authenticated user)
- links-to references/_meta/text/zia/zia.authentication.unauthenticated-traffic.md (What happens to traffic with no user identity)
- links-to references/_meta/text/zia/zia.locations.md (ZIA locations, sublocations and location groups)
- links-to references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/auth-settings.md (config type)
- configured-via references/_meta/text/zia/zia.ad-integration.terraform.md (What Terraform manages for ZIA users and authentication settings)
