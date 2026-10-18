"Why did a user rule not match?" and "why is this traffic attributed to the wrong user?" both come down to whether the request carried an identity, and how. Walk it in order.

1. **Is authentication required where the traffic arrives?** It is a per-location, per-sublocation switch, with the per-location methods hanging off it: [[zia.authentication.location-enforcement]].
2. **How does the request prove who it is?** Cookie after a SAML login, a Kerberos ticket, or a mapping from the source IP: [[zia.authentication.methods]], [[zia.authentication.surrogate-ip]].
3. **How long does that proof last?** [[zia.authentication.frequency]], with the organization-wide object that holds it in [[zia.authentication.settings]].
4. **What happens to traffic with no identity?** It is judged as the location, and some traffic can never carry a cookie: [[zia.authentication.unauthenticated-traffic]]. Destinations that skip the challenge entirely are in [[zia.authentication.exemptions]].
5. **Does a resource need a stronger login than the session has?** That is step-up authentication, owned by ZIdentity: [[zia.authentication.step-up]].

Policy rules scoped by user, group or department are evaluated against whatever identity the steps above produced, so a rule that "should" match but does not is usually an identity problem upstream of the rule: see [[zia.url-filtering]] for how rules are then evaluated. Location and sublocation definitions themselves are in [[zia.locations]]; where the authentication gate sits relative to other modules is in `references/shared/policy-evaluation.md`.

Writing these settings through Terraform has traps of its own, including the exempted-URL list and user enrollment: [[zia.terraform.multi-step-writes]].
