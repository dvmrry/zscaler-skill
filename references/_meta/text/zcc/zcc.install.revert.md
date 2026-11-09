# Reverting Client Connector to the previous version: availability, enabling it, the commands and what a revert keeps (zcc.install.revert)
Also called: revert zcc; revertzcc; RevertZcc folder; revertPasswordCommandLine; revert app; zcc rollback

If a recent upgrade was not successful for some users, they can revert to the previous Client Connector version. The feature applies to Client Connector 3.9 and later for Windows and 4.1 and later for macOS, only admins can enable the option, and the revert option is not supported for non-persistent VDI. [zcc.install.revert:scope] The install parameters for non-persistent VDI are in [Client Connector on non-persistent Citrix VDIs: the single-user model, the VDI install parameters and the master VM](kb:zcc.install.citrix-vdi).

**Enabling it.** The page says to enable the option before installing Client Connector 3.9 or later for Windows or 4.1 or later for macOS: verify that auto-update to the latest version is not enabled, then under Advanced click Enable Zscaler Client Connector Revert; a password added in the Revert Password field makes users enter it to revert. To run the revert in unattended mode and require a password, a revert password must be configured in platform settings. [zcc.install.revert:enable] The revert password is described in [With Enable Zscaler Client Connector Revert (3.9 and later on Windows, 4.1 and later on macOS), users can revert to the previous Client Connector version after entering the Revert Password.](kb:zcc.passwords-and-otp.app-profile-passwords:revert-password) and the unattended-mode passwords in [Platform Settings: the per-OS console settings for sign-in, IPv6, ZDX upgrades, default UI and unattended-mode passwords](kb:zcc.platform-settings).

**Windows.** On Windows, users can revert with Revert App in the Troubleshoot menu of Client Connector's More window, or by running the previous version's installer from the RevertZcc folder (%ProgramFiles(x86)%\Zscaler\RevertZcc on a 32-bit system, %ProgramFiles(x64)%\Zscaler\RevertZcc on a 64-bit system) with --revertzcc 1 --exportLogs 1 --mode unattended. If a revert password was configured for access in unattended mode, --revertPasswordCommandLine <revert password> is added with the revert password generated in platform settings. [zcc.install.revert:how-windows] The password option is spelled differently in the install parameters page [divergence:zcc.install.revert:revert-password-option]. On devices that are upgraded, the \Zscaler\RevertZcc folder holds two installers, the upgraded version and the version before the upgrade, and the <previous version installer> in the command must use the path of the version before the upgrade. [zcc.install.revert:two-installers]

**macOS.** On macOS, the revert command is sudo sh /Applications/Zscaler/RevertZcc/<previous version installer>/Contents/MacOS/installbuilder.sh --revertzcc 1 --exportLogs 1 --mode unattended. [zcc.install.revert:how-macos]

**What a revert keeps.** When users revert to a previous version, Client Connector retains configuration files for users and partner tenants added since the most recent upgrade, retains changes to service entitlements, retains the Private Access certificate if an updated one has been uploaded, and retains certificates and keys set up for authenticating machine tunnel access; it removes configuration files for deleted or logged-out users and deleted partner tenants. [zcc.install.revert:what-is-kept] Whether this holds on macOS is open [gap:zcc.install.revert:kept-on-macos].

**Force Revert.** The App Store's Revert Version column restores a previous version when Force Revert is clicked; it applies to Client Connector 4.2 and later for Windows and is not supported for non-persistent virtual desktop infrastructure (VDI). [zcc.install.revert:force-revert] What it does on the device, and whether it needs the revert option or a password, is open [gap:zcc.install.revert:force-revert-device].

**Other revert coverage.** The EXE revert option in the install parameters is in [Silent install, upgrade, revert and uninstall parameters, and launch behavior](kb:zcc.install.windows-unattended), and the user-facing Revert App button in [What users get to troubleshoot: the Troubleshoot section, Report an Issue and Zscaler Diagnostics at the login screen](kb:zcc.end-user.troubleshooting). How long the previous installer is kept is open [gap:zcc.install.revert:installer-retention].

Sources disagree (name both sides):
- The revert page spells the option that passes the unattended revert password --revertPasswordCommandLine; the Windows install parameters page spells the EXE option revertPasswordCmdLine (MSI REVERTPASSWORDCMDLINE). [divergence:zcc.install.revert:revert-password-option]
  - zscaler-help: Add --revertPasswordCommandLine <revert password> to the revert command.
  - zscaler-help: The EXE option is revertPasswordCmdLine (MSI REVERTPASSWORDCMDLINE).
  Impact: A revert command written from one page may use the wrong option name for the other; the pages do not say whether both spellings are accepted.

Not known (open gaps):
- What Force Revert does on the device [gap:zcc.install.revert:force-revert-device]: settled by source-read or lab-test
- Whether the revert retention list holds on macOS [gap:zcc.install.revert:kept-on-macos]: settled by source-read or lab-test
- How long the previous installer stays in the RevertZcc folder [gap:zcc.install.revert:installer-retention]: settled by source-read or lab-test

Area: zcc.install, its subjects in references/_meta/spine/zcc/zcc.install.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.end-user.troubleshooting.md (What users get to troubleshoot: the Troubleshoot section, Report an Issue and Zscaler Diagnostics at the login screen)
- links-to references/_meta/text/zcc/zcc.install.citrix-vdi.md (Client Connector on non-persistent Citrix VDIs: the single-user model, the VDI install parameters and the master VM)
- links-to references/_meta/text/zcc/zcc.install.windows-unattended.md (Silent install, upgrade, revert and uninstall parameters, and launch behavior)
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.app-profile-passwords.md (App profile passwords: logout, disable, exit and uninstall, per platform)
- links-to references/_meta/text/zcc/zcc.platform-settings.md (Platform Settings: the per-OS console settings for sign-in, IPv6, ZDX upgrades, default UI and unattended-mode passwords)
