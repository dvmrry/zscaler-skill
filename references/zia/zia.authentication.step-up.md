Step-up authentication is a ZIdentity feature that ZIA policy can consume; the full ZIdentity treatment is in the legacy document `references/zidentity/step-up-authentication.md`. "Authentication levels" in older ZIA screens and notes is the same feature under an older name.

**The idea.** {{what-it-is}}

**The flow.** {{flow}}

**What it requires.** {{oidc-only}} {{not-for-hosted-saml}}

**Limits when defining levels.** {{level-limits}} Note this is a per-tree limit; do not read 32 as a tenant total.

How this layers on ZIA's own identity mechanisms (cookie, Kerberos, surrogate IP, covered from [[zia.authentication]]) is not documented; the gap below records the old assumption. What to check: that the tenant uses an OIDC external IdP, that levels are mapped to acr values, and that the failing rule sits in a policy that supports levels.
