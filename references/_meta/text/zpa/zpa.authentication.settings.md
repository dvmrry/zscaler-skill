# Private Access authentication settings (admin SSO enforcement, CORS, SameSite, session timeout, authentication domains) (zpa.authentication.settings)
Also called: Enforce SSO Login for Admins; CORS Request; SameSite Cookie Attribute; Admin Portal Session Timeout; Primary Authentication Domain; Max Age for Authentication with Private Service Edge

The Private Access authentication Settings page holds a handful of tenant-wide authentication options. Enforce SSO Login for Admins forces Private Access admins to log in to the Admin Console using SSO only, and requires admin SSO to be enabled in an IdP configuration; admins cannot then log in locally. The default admin account Zscaler created for the organization (zpaadmin@<domain>.com or admin@<domain>.com) can still log in locally. [zpa.authentication.settings:enforce-sso]

**Browser behavior.** CORS Request, when enabled, allows cross-origin resource sharing to request access to selected resources from a different origin; the setting defaults to Disabled. [zpa.authentication.settings:cors] SameSite Cookie Attribute, when enabled, sets the SameSite attribute of application domain cookies and authentication domain cookies to None for all Browser Access applications; it defaults to Disabled. [zpa.authentication.settings:samesite] What SameSite None and the CORS Request switch change for Browser Access in practice is open [gap:zpa.authentication.settings:cors-samesite-effect].

**Admin session.** Admin Portal Session Timeout (In Minutes) specifies how long admins can be inactive on the Admin Console before logout; the default is 30 minutes and any interval from 5 to 600 minutes can be entered. A confirmation window appears 5 minutes before logout asking whether to extend the session. [zpa.authentication.settings:session-timeout]

**Authentication domains.** Zscaler Support updates the Primary Authentication Domain. During authentication the domain suffix in the NameID must match that domain or a Secondary Authentication Domain, the other domains owned by the organization. The authentication domains have no relationship to application domains, but they can overlap. [zpa.authentication.settings:authentication-domains]

**Private Service Edge outage.** Max Age for Authentication with Private Service Edge specifies how long a user's authentication is extended when the Private Service Edge cannot communicate with the Private Access cloud during a customer's network outage, measured since the last authentication. The maximum is 7 days and the default is 0 Days; the page says this feature and its procedures are in limited availability. [zpa.authentication.settings:max-age-pse] This is a different field from the Disaster Recovery Mode max age in [The maximum age for authentication is entered in days, weeks or months and is how long current end user authentication is valid during Disaster Recovery Mode; the default is 14 days. It is extended starting from the time the user authenticated, not added to the end of the authentication period or after the SAML token has expired, and Zscaler recommends it be greater than or equal to the Authentication Timeout value of the timeout policy.](kb:zpa.private-service-edges.disaster-recovery:max-age-for-authentication). Which feature the limited-availability note covers, and how the setting interacts with timeout policy, is open [gap:zpa.authentication.settings:max-age-open].

Admin SSO is configured on an IdP configuration in [Configuring an IdP for Private Access single sign-on](kb:zpa.authentication.idp-configuration).

What to check:
1. Whether Enforce SSO Login for Admins is on, which stops local admin login except for the default admin account Zscaler created.
2. Whether the NameID's domain suffix matches the primary or a secondary authentication domain, which only Zscaler Support can change for the primary.
3. Which max-age field a question is about, this page's Private Service Edge setting or the Disaster Recovery Mode one, since the defaults differ.

Not known (open gaps):
- What SameSite None and the CORS Request switch change for Browser Access in practice [gap:zpa.authentication.settings:cors-samesite-effect]: settled by lab-test or support-ticket
- Scope of the limited-availability note and the interaction of Max Age with timeout policy [gap:zpa.authentication.settings:max-age-open]: settled by support-ticket

Area: zpa.authentication, its subjects in references/_meta/spine/zpa/zpa.authentication.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.authentication.idp-configuration.md (Configuring an IdP for Private Access single sign-on)
- links-to references/_meta/text/zpa/zpa.private-service-edges.disaster-recovery.md (Disaster recovery mode and Private Service Edge groups)
