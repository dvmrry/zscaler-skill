# SAML auto-provisioning: what login creates and overwrites (zia.ad-integration.saml-auto-provisioning)
Also called: saml auto provisioning; autoProvision; JIT provisioning; saml attributes zia; saml group department; saml response size; SCIM vs SAML attributes

SAML auto-provisioning also writes the user database. With SAML auto-provisioning a user missing from the database is added, with the group and department values from the SAML response, activated, and policies are enforced. For an existing user the display name, group and department in the response update the database, and values absent from the response are removed from the database. [zia.ad-integration.saml-auto-provisioning:create-update] SAML auto-provisioning is to be disabled when SCIM provisioning is enabled for an IdP. [zia.ad-integration.saml-auto-provisioning:scim-excludes]

The service obtains the login name and optionally the group, department and username from the SAML response. The response must be at most 4 MB and, for IdP-initiated login, digitally signed by the IdP. [zia.ad-integration.saml-auto-provisioning:response-limits] In Internet and SaaS (ZIA) SAML assertions are restricted to user identity, group and department attributes, unlike Private Access, where the IdP can provide various authorization attributes. [zia.ad-integration.saml-auto-provisioning:attribute-scope] A requirement for an attribute other than user identity, group or department cannot be met from the ZIA SAML assertion, because ZIA restricts the assertion to those attributes. [zia.ad-integration.saml-auto-provisioning:no-other-assertion-attributes]

**IdP attribute fields.** On the IdP form, the User Display Name Attribute (typically displayName), Group Name Attribute (typically memberOf) and Department Name Attribute (typically department) name the SAML attributes that map to the username, group name and department name, and are case-sensitive. With Active Directory or OpenLDAP user repositories, SAML auto-provisioning is supported for only one IdP, and Zscaler recommends SCIM to provision users: disable this option and select Enable SCIM Provisioning. [zia.ad-integration.saml-auto-provisioning:idp-attribute-fields]

**Login errors for a missing user.** SAML errors 0xB0040 (the user was not found and SAML auto-provisioning is disabled) and 0xE5616 (an unknown user was sent in the SAML response) have the documented action to add the user and then enable SAML auto-provisioning in the Admin Console, because the user does not exist and auto-provisioning is not enabled. [zia.ad-integration.saml-auto-provisioning:missing-user-login-errors]

The org-level switch is [autoProvision enables SAML auto-provisioning.](kb:zia.authentication.settings:auto-provision), and the SAML service-provider and IdP reachability points are in [SAML and Kerberos: what each needs to work](kb:zia.authentication.methods).

Which source wins when SCIM and SAML disagree is open [gap:zia.ad-integration.saml-auto-provisioning:scim-vs-saml-precedence], whether the SCIM userName must equal the SAML nameID is open [gap:zia.ad-integration.saml-auto-provisioning:username-nameid-link], and whether SAML ever removes a user is open [gap:zia.ad-integration.saml-auto-provisioning:saml-deprovisioning].

What to check:
1. Whether auto-provisioning is on for the IdP.
2. What the IdP actually puts in the SAML response, against the login name, group and department the service reads.
3. Whether SCIM is also enabled on the same IdP.

Inferred, not quoted (say so when an answer rests on one):
- [zia.ad-integration.saml-auto-provisioning:no-other-assertion-attributes] Tier B: Reads 'restricted to' as meaning ZIA ignores other attributes in the assertion; no source states what happens to extra attributes.

Not known (open gaps):
- Whose group and department values win when both SCIM and SAML carry them [gap:zia.ad-integration.saml-auto-provisioning:scim-vs-saml-precedence]: settled by lab-test or support-ticket. Blocks: diagnosing 'changed in the IdP but ZIA policy is still wrong'
- Whether userName must equal the SAML nameID to link a session to a SCIM-provisioned user [gap:zia.ad-integration.saml-auto-provisioning:username-nameid-link]: settled by lab-test. Blocks: explaining duplicate or unlinked users after an IdP email change
- Whether SAML ever removes or disables a user [gap:zia.ad-integration.saml-auto-provisioning:saml-deprovisioning]: settled by support-ticket or lab-test. Blocks: advice on deprovisioning in SAML-only tenants

Area: zia.ad-integration, its subjects in references/_meta/spine/zia/zia.ad-integration.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.scim.setup.md (Enabling ZIA SCIM: prerequisites, base URL and token): SAML auto-provisioning is to be disabled when SCIM provisioning is enabled for an IdP. [zia.ad-integration.saml-auto-provisioning:scim-excludes]
- depends-on references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work): With SAML single sign-on the Zscaler service is the service provider, and SAML SSO is used for provisioning and authenticating users. Before configuring it, the SAML SSL certificate must be obtained from the IdP and the XML metadata exported from it. [zia.authentication.methods:saml-sp]
- depends-on references/_meta/text/zia/zia.authentication.md (ZIA authentication: how a request gets a user identity), from zia.ad-integration: Enforcing policy by department, group and user, and reporting by user, requires users, groups and departments to be provisioned into the Zscaler database first and authentication to be enabled. With authentication disabled at a known location the service does not know who the users are and applies the location's policies. [zia.ad-integration:identity-needed]
- interacts-with references/_meta/text/zia/zia.authentication.unauthenticated-traffic.md (What happens to traffic with no user identity), from zia.ad-integration: Enforcing policy by department, group and user, and reporting by user, requires users, groups and departments to be provisioned into the Zscaler database first and authentication to be enabled. With authentication disabled at a known location the service does not know who the users are and applies the location's policies. [zia.ad-integration:identity-needed]
- links-to references/_meta/text/zia/zia.authentication.settings.md (The organization-wide authentication settings object)
