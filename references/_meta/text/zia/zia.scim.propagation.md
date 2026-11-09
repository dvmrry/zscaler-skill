# How fast SCIM changes reach ZIA (zia.scim.propagation)
Also called: scim sync delay; scim push model; force scim sync; group change not reflected; scim sync logs; scim first sync; idp provisioning cadence
Former IDs: zia-44, zia-45

"The group changed in the IdP, how long until ZIA policy sees it?" With SCIM, users and groups are provisioned through APIs. There is no wait for synchronization intervals or for the user to log in, a group or department change updates the Zscaler user database in near real time, and no inbound connection from Zscaler to the customer's directory or network is required. [zia.scim.propagation:push-near-real-time] ZIA does not poll the IdP: every change is made by a client calling Zscaler's SCIM server, so a delay or a missing change is on the IdP connector's schedule or scope, and the captured articles describe no ZIA-side way to force a resync. [zia.scim.propagation:no-zia-side-pull]

In the Okta guide, after assignment Okta takes several minutes to sync the user database with the Zscaler service; the service accepts provisioning requests at 5 requests per second, and the guide estimates the sync time in seconds as the number of users divided by 5 plus 4% of the users to accommodate network drops and errors, giving 720 seconds or 12 minutes for its example. The same rate limit applies to resynchronization of failed tasks. [zia.scim.propagation:okta-first-sync-time] The Okta guide says many errors during the first sync happen because users and groups are still queued to be synced and are resolved when provisioning is complete; it says not to move to the next step, syncing groups from the Push Groups tab with Push group memberships immediately selected, until the entire database is synced, or unrecoverable errors might result. [zia.scim.propagation:okta-first-sync-ordering] SAML error 0xE5621 means the user was added via the Hosted User Database, LDAP sync or SCIM provisioning but the activation was not performed (for SCIM it might be pending); the documented action is to activate unactivated changes in the Admin Console, and to contact Zscaler Support if the error persists. [zia.scim.propagation:activation-pending-login-error]

Directory synchronization, by contrast, waits for the next synchronization, see [Directory (LDAP/AD) synchronization behavior](kb:zia.ad-integration.directory-sync). How often each IdP pushes group and membership changes is open [gap:zia.scim.propagation:per-idp-cadence], and whether ZIA shows SCIM sync errors is open [gap:zia.scim.propagation:sync-log-visibility].

A large first push is limited by the server's request rate, see [ZIA SCIM server operations, paging and rate limit](kb:zia.scim.operations). If SAML auto-provisioning also writes the same users, which source wins is open [Whose group and department values win when both SCIM and SAML carry them](kb:zia.ad-integration.saml-auto-provisioning:scim-vs-saml-precedence).

What to check:
1. When the IdP last pushed that user or group, and whether the change was in the connector's scope.
2. The IdP's own provisioning log for rejected requests, since ZIA-side error visibility is open.

Inferred, not quoted (say so when an answer rests on one):
- [zia.scim.propagation:no-zia-side-pull] Tier B: Derived from the SCIM articles describing only client calls to the Zscaler server and no Zscaler-initiated sync; no source describes a force-resync control.

Not known (open gaps):
- How often each IdP pushes group and membership changes [gap:zia.scim.propagation:per-idp-cadence] (data gap): filled by operator; settled by source-read or operator-experience. Blocks: quoting an expected delay for a given IdP
- Whether the ZIA console shows SCIM sync errors [gap:zia.scim.propagation:sync-log-visibility]: settled by tenant-data or source-read. Blocks: knowing where to see rejected pushes

Area: zia.scim, its subjects in references/_meta/spine/zia/zia.scim.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ad-integration.directory-sync.md (Directory (LDAP/AD) synchronization behavior), from zia.scim: SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory]
- interacts-with references/_meta/text/zia/zia.ad-integration.saml-auto-provisioning.md (SAML auto-provisioning: what login creates and overwrites), from zia.scim: SAML auto-provisioning is to be disabled when SCIM provisioning is enabled for an IdP. [zia.ad-integration.saml-auto-provisioning:scim-excludes]
- depends-on references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work), from zia.scim: Zscaler supports only SCIM version 2.0, and SAML must be the authentication method to use SCIM for provisioning. [zia.scim.setup:scim2-and-saml]
- links-to references/_meta/text/zia/zia.scim.operations.md (ZIA SCIM server operations, paging and rate limit)
