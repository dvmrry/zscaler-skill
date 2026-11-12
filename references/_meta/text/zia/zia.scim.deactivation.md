# What SCIM does when a user is disabled or deleted (zia.scim.deactivation)
Also called: active=false; scim deprovisioning; disable user scim; scim delete user; terminated employee access; scim session kill; revoke token after scim
Former IDs: zia-40

"We disabled the user in the IdP, why can they still browse?" starts with which SCIM action the IdP really sends. When active=false is sent for a user, Zscaler disables the user; when active=true, Zscaler enables the user. [zia.scim.deactivation:active-flag] SCIM is documented for deprovisioning users from the Zscaler database when they are deleted from the user directory, and the Zscaler SCIM servers support Delete User (DELETE /Users/{UserID}); active=false, which disables the user, is a separate path. [zia.scim.deactivation:delete-removes] Okta's Deactivate Users feature deactivates the user in the Zscaler service if the Okta account is deleted or deactivated or has Internet & SaaS unassigned. The PingOne guide lists Delete Users among its supported SCIM features. In the Google Workspace guide's Deprovisioning page the administrator specifies an action and time for when an app is turned off for a user, when a user is suspended from Google and when a user is deleted from Google. The Entra ID mapping sets active from the expression Switch([IsSoftDeleted], , "False", "True", "True", "False"). [zia.scim.deactivation:idp-deactivation-actions] Which request an IdP sends when a user is deleted from the directory is open [gap:zia.scim.deactivation:deletion-request].

In ZPA, active=false deletes the user, so the same IdP action is reversible in ZIA and destructive in ZPA. [zia.scim.deactivation:zpa-deletes] Directory synchronization behaves differently again: users removed from the directory are deactivated and have their cookies invalidated, see [Directory (LDAP/AD) synchronization behavior](kb:zia.ad-integration.directory-sync).

Whether a live session survives a disable is open [gap:zia.scim.deactivation:session-kill], and whether tokens or SAML sessions already issued are revoked is open [gap:zia.scim.deactivation:token-revocation].

The verbs and endpoints are in [ZIA SCIM server operations, paging and rate limit](kb:zia.scim.operations); how soon the IdP's change arrives at all is in [How fast SCIM changes reach ZIA](kb:zia.scim.propagation).

What to check:
1. Whether the IdP sent active=false or a DELETE for the user.
2. For urgent revocation, use the session and token controls rather than SCIM alone, and do not describe a SCIM disable as an immediate access kill.

Not known (open gaps):
- Which SCIM request an IdP sends when a user is deleted from the directory [gap:zia.scim.deactivation:deletion-request]: settled by source-read or lab-test. Blocks: saying what a directory deletion does to a Zscaler user
- Whether active=false ends a live ZIA session [gap:zia.scim.deactivation:session-kill]: settled by lab-test or support-ticket. Blocks: advice on revoking access for terminated users
- Whether SCIM disable or delete revokes tokens the user already holds [gap:zia.scim.deactivation:token-revocation]: settled by lab-test or source-read. Blocks: advice on hard revocation after offboarding

Area: zia.scim, its subjects in references/_meta/spine/zia/zia.scim.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ad-integration.directory-sync.md (Directory (LDAP/AD) synchronization behavior), from zia.scim: SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory]
- interacts-with references/_meta/text/zia/zia.ad-integration.saml-auto-provisioning.md (SAML auto-provisioning: what login creates and overwrites), from zia.scim: SAML auto-provisioning is to be disabled when SCIM provisioning is enabled for an IdP. [zia.ad-integration.saml-auto-provisioning:scim-excludes]
- depends-on references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work), from zia.scim: Zscaler supports only SCIM version 2.0, and SAML must be the authentication method to use SCIM for provisioning. [zia.scim.setup:scim2-and-saml]
- links-to references/_meta/text/zia/zia.scim.operations.md (ZIA SCIM server operations, paging and rate limit)
- links-to references/_meta/text/zia/zia.scim.propagation.md (How fast SCIM changes reach ZIA)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/users.md (config type)
- see-also references/_meta/text/zia/zia.scim.md (ZIA SCIM provisioning)
