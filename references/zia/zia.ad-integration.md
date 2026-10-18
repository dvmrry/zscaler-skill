"Why can policy not see this user, group or department?" has two separate halves, and tenants mix them freely: how the identity reaches the ZIA user database (provisioning), and how traffic proves who it is (authentication). {{identity-needed}} A rule scoped by user, group or department is therefore judged against whatever the two halves produced; for the authentication half see [[zia.authentication]] and [[zia.authentication.unauthenticated-traffic]].

1. **Which provisioning method is in use, and which authentication methods can it pair with?** [[zia.ad-integration.provisioning-methods]]. SCIM is its own area: [[zia.scim]].
2. **If it is directory synchronization,** how it syncs, how often, and what it does to users removed from the directory: [[zia.ad-integration.directory-sync]].
3. **If it is SAML,** what auto-provisioning creates and overwrites at login: [[zia.ad-integration.saml-auto-provisioning]].
4. **What do the resulting objects look like, and what limits apply?** [[zia.ad-integration.identity-objects]].
5. **Is it managed as code?** [[zia.ad-integration.terraform]].

The organization-wide switches that tie these together (auto-provision, the directory-sync migration flag, SAML) are one settings object, documented in [[zia.authentication.settings]] and [[zia.authentication.methods]]; they are not restated here. Per-location Kerberos and Surrogate IP behavior is in [[zia.authentication.methods]] and [[zia.authentication.surrogate-ip]].

What reporting and cross-product policy show for users that were never provisioned is open {{gap:web-insights-attribution}}.

Traffic without authentication is covered in [[zia.authentication.unauthenticated-traffic]]. The ZPA Active Directory controls (AppProtection inspection of Kerberos, SMB and LDAP) are a different feature; see the [vendor help article](../../vendor/zscaler-help/about-active-directory-controls.md). The user and department log fields are documented in the [web log schema](logs/web-log-schema.md).
