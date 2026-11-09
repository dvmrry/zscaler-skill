# ZCC uninstall, disable and logout passwords and one-time passwords (zcc.passwords-and-otp)
Also called: zcc passwords; how do I uninstall zcc without the password; user needs password to disable zcc; zcc otp; anti-tampering otp

"What password does this user need?" has three possible answers. Check them in this order.

1. **Does the app profile set one?** Which passwords each platform's app profile offers, and when a change reaches the device: [App profile passwords: logout, disable, exit and uninstall, per platform](kb:zcc.passwords-and-otp.app-profile-passwords).
2. **Can a one-time password stand in?** Per-device OTPs for logout, exit, uninstall, revert, service disable and anti-tampering: [One-time passwords for an enrolled device](kb:zcc.passwords-and-otp.otp).
3. **Was it set or read through the API?** `getPasswords`, `managePass`, and the open question of which surface wins: [Reading and setting app profile passwords through the API](kb:zcc.passwords-and-otp.password-api).

Anti-tampering, which stops users killing the app rather than asking for a password: [Anti-tampering prevents users from stopping or modifying Zscaler endpoint products; a timer of 0 to 1440 minutes re-enables the app after a user disables it with a one-time password, and on Windows 4.5 and later the profile setting can override the install-time anti-tampering option.](kb:zcc.app-profiles.advanced-settings:anti-tampering). The other support-side controls: [ZCC end-user support options (App Supportability)](kb:zcc.support-options).

Area: zcc.passwords-and-otp, its subjects in references/_meta/spine/zcc/zcc.passwords-and-otp.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.app-profiles.advanced-settings.md (What the less common app profile settings do)
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.app-profile-passwords.md (App profile passwords: logout, disable, exit and uninstall, per platform)
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.otp.md (One-time passwords for an enrolled device)
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.password-api.md (Reading and setting app profile passwords through the API)
- links-to references/_meta/text/zcc/zcc.support-options.md (ZCC end-user support options (App Supportability))
