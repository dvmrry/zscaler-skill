# Emergency Access identity: where users live, which IdPs, and how they sign in (zpa.emergency-access.identity)
Also called: emergency access okta; emergency access authentication service; emergency access idp api token; emergency access arbitrary domains; emergency access email otp; emergency access plus sign email; emergency access users not stored

Emergency access users live in the identity provider, not in Private Access. Emergency access users are not stored in Private Access: the Emergency Access Users page lists users directly from Okta via the Okta API, or from Authentication Service when that is the IdP. [zpa.emergency-access.identity:users-not-stored]

**Which IdP.** For end users who have not migrated to Authentication Service the IdP is an Okta IdP, and only Okta is supported; for end users who have migrated, Authentication Service is the IdP and only Authentication Service IdPs are supported. [zpa.emergency-access.identity:idp-by-migration] The IdP shown on the Emergency Access page is the IdP that has Use with Arbitrary Domains enabled, and the field is read-only. [zpa.emergency-access.identity:idp-arbitrary-domains] Whether any other IdP type works is not documented [gap:zpa.emergency-access.identity:other-idps].

**Okta prerequisites.** In Okta, the third-party user needs group administrator privileges, the email authenticator, and authentication policies. [zpa.emergency-access.identity:okta-prerequisites] If the authentication policy uses Email One Time Pins, the invited user authenticates without a password by providing the OTP sent to the registered email address. [zpa.emergency-access.identity:email-otp]

**Authentication Service prerequisites.** For Authentication Service users, Arbitrary Guest Domains must be enabled, and the user must be in the Dynamic Group Guest Domains and Zscaler Emergency Access groups and assigned the Zscaler Private Access service entitlement. [zpa.emergency-access.identity:auth-service-prerequisites] With Authentication Service for users and User Single Sign-On enabled, the IdP API Token and Emergency Authentication Domains fields are hidden and the User Group Name field is disabled. [zpa.emergency-access.identity:auth-service-hidden-fields]

**Sign-in email.** Email-based authentication is required for the user provisioned in Okta or Authentication Service, and the email that activates the account comes from the IdP or Authentication Service. [zpa.emergency-access.identity:email-auth-required] Customization, branding, emails and reply-to addresses are the organization's responsibility, and Zscaler handles only lifecycle management in the Admin Console. [zpa.emergency-access.identity:branding-responsibility]

**Token scope.** Private Access uses the Okta IdP API token to fetch the members of the designated group; a more permissive token might show additional users, and every user visible on the page can be activated, deactivated or updated even if outside the designated group. [zpa.emergency-access.identity:token-permissive] If the designated group is deleted, users outside it are still shown while the settings stay configured, and if the credentials cover several groups, users of those groups continue to show. [zpa.emergency-access.identity:deleted-group]

**Email addresses.** A plus sign in the email address appears as a blank space in the username field on the Okta login page when a login hint is used, and login may fail depending on Okta login rules. [zpa.emergency-access.identity:plus-sign]

The settings these feed: [Configuring Emergency Access: availability, settings, authentication domains, Microtenants](kb:zpa.emergency-access.configuration). What the page shows for each user: [Emergency Access Users page: statuses, dates and actions](kb:zpa.emergency-access.users).

What to check:
1. Whether the tenant has migrated to Authentication Service, which decides the IdP, the prerequisites and which settings are hidden.
2. The IdP API token's scope, since users from any group it can manage appear and can be activated, deactivated or updated.
3. The email address for a plus sign, which can break a login hint.

Not known (open gaps):
- Whether IdPs other than Okta and Authentication Service can be used [gap:zpa.emergency-access.identity:other-idps]: settled by support-ticket

Area: zpa.emergency-access, its subjects in references/_meta/spine/zpa/zpa.emergency-access.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.emergency-access.configuration.md (Configuring Emergency Access: availability, settings, authentication domains, Microtenants), from zpa.emergency-access: Emergency Access is in limited availability, and Zscaler Support enables it for an organization. [zpa.emergency-access.configuration:limited-availability]
- logged-in references/_meta/text/zpa/zpa.audit-logs.what-is-recorded.md (What the ZPA admin audit log records, how long it is kept, and whether it can be pulled), from zpa.emergency-access: The admin audit log lists Emergency Access and Emergency Access User as resource types. [zpa.emergency-access.scope:audit-resource-types]
- scoped-by references/_meta/text/zpa/zpa.pra.approvals.md (PRA approvals: requesting, reviewing and expiry), from zpa.emergency-access: Emergency access users have permissions limited to privileged approvals in the IdP enabled for emergency access. [zpa.emergency-access.scope:scoped-to-approvals]
- links-to references/_meta/text/zpa/zpa.emergency-access.users.md (Emergency Access Users page: statuses, dates and actions)
