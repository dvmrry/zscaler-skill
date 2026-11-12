# Authentication Service sessions: admin inactivity timeout, the service-enrollment session and forced Private Access reauthentication (zidentity.authentication-session)
Also called: Authentication Session page; Administrator Inactivity Timeout Duration; Service Enrollment Session Timeout; Authentication Session for Service Entitlement; Force Authentication for Private Access Reauthentication; forceauth=true; prompt=login

Authentication Service tracks who is signed in with sessions, set on its Authentication Session page. Authentication Service uses session-based authentication to keep track of authenticated users or enrolled services. [zidentity.authentication-session:session-based]

**Admin inactivity.** Administrator Inactivity Timeout Duration is the period, in minutes, after which the user is logged out of the Authentication Service session, settable from 5 to 600 minutes (10 hours). [zidentity.authentication-session:admin-inactivity-timeout]

**Service enrollment.** Authentication Session for Service Entitlement applies the Authentication Service session to Zscaler services during user enrollment. It is disabled by default, since Authentication Service sends users to the organization's IdP; enabled, Authentication Service can verify active sessions locally based on the Service Enrollment Session Timeout instead of always redirecting users to the IdP. [zidentity.authentication-session:service-entitlement-session] The page gives these examples beside the Authentication Session for Service Entitlement option: for Private Access reauthentication through Client Connector, and for browser-based access through Internet & SaaS or Private Access, a still-valid session is authenticated locally by Authentication Service and an expired one is redirected to the external IdP. [zidentity.authentication-session:local-session-examples] Service Enrollment Session Timeout is the period, in minutes, after which the user's service session expires and the user must reauthenticate, settable from 5 to 600 minutes (10 hours). [zidentity.authentication-session:service-enrollment-timeout] Neither timeout's default is open [gap:zidentity.authentication-session:timeout-defaults].

**Private Access reauthentication.** Force Authentication for Private Access Reauthentication decides whether users are prompted when Private Access requests reauthentication: disabled, the IdP decides; enabled, Authentication Service tells the IdP to ignore existing sessions and force reauthentication each time, by sending forceauth=true (SAML) or prompt=login (OIDC). The option is shown only when User Single Sign-On is enabled for the tenant. [zidentity.authentication-session:force-zpa-reauth]

**IdP options.** By default only the Hosted option is shown for all tenants; options for third-party IdPs are also listed, depending on the external IdPs configured for the tenant. [zidentity.authentication-session:hosted-option-default] Which setting those options belong to is open [gap:zidentity.authentication-session:idp-options-setting].

**Token lifetime.** Where an API client token lifetime is set is open [gap:zidentity.authentication-session:token-lifetime].

**Permission.** Changing these is the Authentication Session module: [The Authentication Session module covers the session timeout duration, the authentication session for service enrollment, and forced authentication for Private Access reauthentication.](kb:zidentity.admin-rbac.permissions:authentication-session).

What to check:
1. Whether a user is asked to reauthenticate because the session timeout expired or because Force Authentication for Private Access Reauthentication is enabled, and whether Authentication Session for Service Entitlement is enabled.
2. Whether User Single Sign-On is enabled for the tenant, since the force reauthentication option is shown only then.

Not known (open gaps):
- The default of the admin inactivity and service enrollment timeouts [gap:zidentity.authentication-session:timeout-defaults]: settled by tenant-data or source-read. Blocks: stating how long an idle admin or enrolled service stays signed in on an unconfigured tenant
- Which Authentication Session setting the Hosted and third-party IdP options belong to [gap:zidentity.authentication-session:idp-options-setting]: settled by tenant-data or source-read. Blocks: reading the Authentication Session page for a tenant with external IdPs
- Where an API client access token lifetime is set [gap:zidentity.authentication-session:token-lifetime]: settled by source-read or support-ticket. Blocks: answering how long an API client token lives

Area: zidentity.authentication-session, its subjects in references/_meta/spine/zidentity/zidentity.authentication-session.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zidentity/zidentity.admin-rbac.permissions.md (Authentication Service permission modules and levels, and the cross-module dependencies)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zidentity/zidentity.overview.md (What ZIdentity (Authentication Service) is, and where each part of it is covered)
- see-also references/_meta/text/zidentity/zidentity.api-clients.md (ZIdentity API clients: what one is, how it authenticates, its resources and scopes, and its token lifetime)
