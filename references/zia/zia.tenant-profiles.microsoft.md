Microsoft Login Services is the profile with the most settings, and the one where a wrong choice gives a quiet failure.

**Two versions.** {{two-versions}} {{version-lock}} How the two differ on the wire is unknown (gap `v1-v2-semantics`); the Help limits table only shows that the identifiers have different lengths, see [[zia.tenant-profiles.limits]]. A claim from the old guide that a Version 1 profile on a Version 2 tenant fails open is unverified (gap `v1-for-v2-tenant-fails-open`).

**Finding the IDs.** {{v2-policy-id-source}}

**Personal accounts.** {{personal-domains-default}} The headers that result are in [[zia.tenant-profiles.wire-mechanic]]. The API carries the settings as booleans: {{api-flags}} {{ui-to-api-inversion}} Note the Go SDK drops a false flag; see [[zia.tenant-profiles.api-surface]].

**Rules to follow.** {{caveats}} The authentication caveat for Version 1 and the Office 365 inspection rule order are in [[zia.tenant-profiles.ssl-prerequisite]].

**In code.** {{sdk-example-tokens}}

What to check when sign-ins to other tenants are not blocked: the profile version, whether the login services are decrypted, and that every profile on the rule shares one directory ID.
