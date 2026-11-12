# A user's security settings in Authentication Service: initial password option, skipping second-factor authentication and MFA authenticators (zidentity.users.security-settings)
Also called: Security Settings tab; Skip Second Factor Authentication; Skip Until; Multi-Factor Bypass; skip 2FA; MFA Authenticator; Set By User password; Auto-generated password

The Security Settings tab of a user is where an admin sets the initial password option, lets the user skip second-factor authentication for a while and removes configured MFA authenticators; the user's record and status are in [Authentication Service users: where they come from, status, bulk actions and admin-side actions](kb:zidentity.users).

**Password.** A user must be added before security settings are configured; Change Password Settings must be enabled to modify the password configuration. Set By User makes the user set their own password and sends a password reset email, and the user can choose and configure the required authentication method; Set by Administrator has the admin set the password; Auto-generated generates one for the user, and the Copy and View icons copy or view the password. [zidentity.users.security-settings:password-options] With Set by Administrator and with Auto-generated, Prompt for Password Change After the Initial Login is selected by default; for Set by Administrator the user then changes the password following the guidelines in the password policy. [zidentity.users.security-settings:prompt-change-default]

**Skipping second-factor authentication.** An admin can enable Skip Second-Factor Authentication for a user and, with Skip Until, select the date and time up to when the user can skip second-factor authentication, after which the user must configure it; the Add User page offers Skip Until, and on the Edit User page's Security Settings section the option is enabled under Multi-Factor Bypass as Skip Second Factor Authentication. [zidentity.users.security-settings:skip-second-factor] The Skip Until field displays the current date and time; by default MFA can be skipped for 8 hours, and the maximum limit is 5 days. [zidentity.users.security-settings:skip-duration] Skipping two-factor authentication lets Authentication Service administrators log in to the subscribed Zscaler service with only a password for a short duration (the help's example: a user without the device that receives their one-time passcode); the Skip Second Factor Authentication option is only available for hosted admins and not for admins authenticating via the external IdP. [zidentity.users.security-settings:skip-hosted-admins-only] Whether the API's skip action follows the same limits is open [gap:zidentity.users.security-settings:skip-api-scope].

**Authenticators.** Security settings show each MFA method configured for a user with the date and time it was last used to log in to the Zscaler Admin Console; an admin can delete authenticators except the email authenticator, and the user is then prompted to reconfigure MFA the next time they log in to the Zscaler Admin Console. [zidentity.users.security-settings:authenticators]

**Open.** The password policy rules and the MFA factors are not given [gap:zidentity.users.security-settings:password-policy-and-factors].

What to check:
1. Before letting a user skip second-factor authentication, whether the user is a hosted admin and not an admin authenticating through an external IdP.
2. When a user is asked to reconfigure MFA at next login, whether an admin deleted their authenticator.

Not known (open gaps):
- Whether the API's skip-MFA action follows the console's duration, maximum and hosted-admin limits [gap:zidentity.users.security-settings:skip-api-scope]: settled by lab-test or source-read. Blocks: scripting MFA skips through the API
- The password policy rules and the MFA factors [gap:zidentity.users.security-settings:password-policy-and-factors]: settled by source-read or tenant-data. Blocks: telling a user which password rules and factors apply

Area: zidentity.users, its subjects in references/_meta/spine/zidentity/zidentity.users.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zidentity/zidentity.users.md (Authentication Service users: where they come from, status, bulk actions and admin-side actions)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zidentity/zidentity.admin-rbac.permissions.md (Authentication Service permission modules and levels, and the cross-module dependencies)
