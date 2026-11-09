# Step-up authentication and ZIdentity authentication levels (zia.authentication.step-up)
Also called: step-up authentication; step up; authentication levels; ZIdentity authentication level; AL1; acr values; MFA for sensitive resources; re-authenticate with stronger method

Step-up authentication is a ZIdentity feature that ZIA policy can consume; the full ZIdentity treatment is in the legacy document [Step-up authentication: when Authentication Service asks for a stronger login, and why a prompt may not appear](kb:zidentity.step-up). "Authentication levels" in older ZIA screens and notes is the same feature under an older name.

**The idea.** Step-up authentication prompts a user to reauthenticate with a higher assurance level (for example, using MFA) when accessing specific resources. It is configured with authentication levels that are hierarchical: higher levels are stronger, and a user authenticated at a higher level satisfies policies requiring a sub-level. The levels are mapped to access policies in supported Zscaler services. [zia.authentication.step-up:what-it-is]

**The flow.** The flow is: the user logs in with standard credentials; on reaching a sensitive resource defined by Internet & SaaS (ZIA) or Private Access (ZPA) policy, the Authentication Service checks the required level; if the current level is insufficient it prompts re-authentication, typically MFA through Zscaler Client Connector; on success access is granted. [zia.authentication.step-up:flow]

**What it requires.** Step-up authentication is supported only with OIDC-based external IdP integrations; when an external IdP is used via OIDC, each authentication level must be mapped to its acr value in the IdP. [zia.authentication.step-up:oidc-only] A tenant authenticating with Hosted DB or with SAML alone, without an OIDC external IdP, cannot use step-up authentication. [zia.authentication.step-up:not-for-hosted-saml]

**Limits when defining levels.** Each level has a validity period in minutes, hours or days, and a parent level's validity must be less than that of any of its sub-levels. A tree of levels can hold at most 32 levels and no branch can be deeper than 4. [zia.authentication.step-up:level-limits]

How this layers on ZIA's own identity mechanisms (cookie, Kerberos, surrogate IP, covered from [ZIA authentication: how a request gets a user identity](kb:zia.authentication)) is open [gap:zia.authentication.step-up:zia-layering].

What to check:
1. Whether the tenant uses an OIDC external IdP, since step-up is not available with Hosted DB or SAML alone.
2. Whether each authentication level is mapped to its acr value in the IdP.
3. Whether the failing rule sits in a policy that the step-up flow applies to.

Inferred, not quoted (say so when an answer rests on one):
- [zia.authentication.step-up:not-for-hosted-saml] Tier B: Follows from the OIDC-only statement; no source names Hosted DB or SAML-only tenants.

Not known (open gaps):
- How ZIA's cookie and surrogate model combines with a ZIdentity level requirement [gap:zia.authentication.step-up:zia-layering]: settled by lab-test or support-ticket. Blocks: predicting what a cookie-less or surrogate-attributed request does when a rule requires a stronger level

Area: zia.authentication, its subjects in references/_meta/spine/zia/zia.authentication.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.ad-integration.provisioning-methods.md (ZIA provisioning methods and which authentication each allows), from zia.authentication: Each provisioning method allows only some authentication methods. SCIM: SAML only. Hosted User Database: passwords (default), Kerberos, one-time link, one-time token. Directory server synchronization: LDAP BIND, one-time link, one-time token. ZAB: Hosted User Database, SAML, LDAP BIND, one-time link, one-time token. [zia.ad-integration.provisioning-methods:auth-pairing]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group), from zia.authentication: Authentication is enforced by the location's own setting (`authRequired`, Enforce Authentication), which the service checks when traffic arrives from a known location. [zia.locations.rule-scoping:authentication-is-a-location-setting]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.authentication: A user who is logged in can still have a transaction judged as the location rather than as the user, when the transaction is one that cannot carry the authentication cookie; a user rule does not match that transaction. [zia.authentication.unauthenticated-traffic:logged-in-user-misses-user-rule]
- depends-on references/_meta/text/zidentity/zidentity.overview.external-idps.md (External IdPs in Authentication Service: OIDC and SAML, primary and secondary, limits and retention): Step-up authentication is supported only with OIDC-based external IdP integrations; when an external IdP is used via OIDC, each authentication level must be mapped to its acr value in the IdP. [zia.authentication.step-up:oidc-only]
- depends-on references/_meta/text/zidentity/zidentity.step-up.levels.md (Authentication levels: the level tree, validity periods, acr mapping and the message to users): Step-up authentication prompts a user to reauthenticate with a higher assurance level (for example, using MFA) when accessing specific resources. It is configured with authentication levels that are hierarchical: higher levels are stronger, and a user authenticated at a higher level satisfies policies requiring a sub-level. The levels are mapped to access policies in supported Zscaler services. [zia.authentication.step-up:what-it-is]
- links-to references/_meta/text/zia/zia.authentication.md (ZIA authentication: how a request gets a user identity)
- links-to references/_meta/text/zidentity/zidentity.step-up.md (Step-up authentication: when Authentication Service asks for a stronger login, and why a prompt may not appear)
