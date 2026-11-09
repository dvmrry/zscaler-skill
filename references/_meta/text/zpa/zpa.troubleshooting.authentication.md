# Authentication failures and step-up prompt loops in ZPA (zpa.troubleshooting.authentication)
Also called: zpa auth loop; zpa reauthentication fails; zpa step-up prompt appears unexpectedly; verify now prompt; zpa scim group blocked; idp domain in app segment

Authentication symptoms come from the IdP session, step-up rules, SCIM timing or an IdP domain inside an application segment.

**Step-up.** When an application requires additional authentication, Zscaler Client Connector shows a pop-up notification prompting the user to verify access with a Verify Now button; for Private Access this needs Client Connector 4.6 or later on Windows or 4.7 or later on macOS (and Client Connector 4.2 on Android and Android on ChromeOS, also for Internet & SaaS), and the requirement is set up in the Admin Console and available only with a subscription to Authentication Service. [zpa.troubleshooting.authentication:verify-now-prompt] Conditional Access and its subscription are in [Conditional Access applies step-up authentication, is available only with an Authentication Service subscription, and prompts the user to reinforce their authentication if they are not at the defined level.](kb:zpa.policy.actions:conditional-access-step-up) and OIDC support in [Step-up authentication is supported only with OIDC-based external IdP integrations.](kb:zpa.policy.actions:step-up-oidc-only).

**SCIM.** The timing rules are in [Zscaler recommends waiting a minimum of 48 hours, sometimes up to a week, after SCIM sync is enabled before enabling SCIM policies.](kb:zpa.policy.scim-sync:scim-wait-48-hours), and what a mid-sync user gets is open [What an unrecognized mid-sync user gets under a SCIM-scoped rule](kb:zpa.policy.scim-sync:mid-sync-result).

**IdP inside a segment.** The IdP domain rule is in [If the IdP is defined as an application within a segment, its Authentication Timeout must be Never, and an IdP domain that overlaps a domain configured for application discovery must be bypassed in Private Access to avoid user reauthentication failure.](kb:zpa.app-segments.definition:idp-overlap).

**Configuration.** How the IdP, its certificates and the authentication settings are configured is in [ZPA authentication: IdP configuration, authentication settings and user risk scores](kb:zpa.authentication).

**Session refresh.** What the client does when the assertion or IdP session is stale is not sourced [gap:zpa.troubleshooting.authentication:stale-assertion].

What to check:
1. Whether an access rule with the Conditional Access action matched the user, and whether the user should be subject to it.
2. Whether the IdP integration is OIDC when step-up is expected, and whether the tenant has the subscription.
3. Whether the user was added to the IdP group recently, and whether the initial SCIM cycle and the recommended wait are complete.
4. Whether the IdP domain overlaps a domain in an application segment, and whether the IdP application's Authentication Timeout is Never.
5. What the client does when the assertion is stale, which is not sourced.

Not known (open gaps):
- Stale SAML assertion or expired IdP session [gap:zpa.troubleshooting.authentication:stale-assertion]: settled by operator-experience or lab-test

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.policy.actions.md (Rule actions on ZPA policy types): Conditional Access applies step-up authentication, is available only with an Authentication Service subscription, and prompts the user to reinforce their authentication if they are not at the defined level. [zpa.policy.actions:conditional-access-step-up]
- depends-on references/_meta/text/zpa/zpa.policy.scim-sync.md (SCIM sync timing before SCIM criteria are used): After SCIM is enabled, Zscaler checks whether a user is present in the SCIM database to decide whether the user is allowed or blocked access to ZPA, and if sync is incomplete the ZPA service evaluates policies on the users it does not recognize. [zpa.policy.scim-sync:scim-user-presence-decides]
- links-to references/_meta/text/zpa/zpa.app-segments.definition.md (What an application segment can contain: entries, wildcards and ports)
- links-to references/_meta/text/zpa/zpa.authentication.md (ZPA authentication: IdP configuration, authentication settings and user risk scores)
