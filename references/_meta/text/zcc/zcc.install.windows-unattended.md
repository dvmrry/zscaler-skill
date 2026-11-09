# Silent install, upgrade, revert and uninstall parameters, and launch behavior (zcc.install.windows-unattended)
Also called: silent install zcc; unattended install zcc; unattendedmodeui; upgradePasswordCmdLine; UPGRADEPASSWORDCMDLINE; uninstallPasswordCmdLine; UNINSTALLPASSWORDCMDLINE; revertPasswordCmdLine; revertzcc; installer-language; launchTray; LAUNCHTRAY; hideAppUIOnLaunch; HIDEAPPUIONLAUNCH; kioskMode; KIOSKMODE; configTimeout; VDI install parameter

These parameters cover installing, upgrading, reverting and removing Client Connector without user interaction, and what the user sees right after installation.

## Silent operations (Windows)

- **Install.** The EXE installer installs silently with mode=unattended (the default is win32), and unattendedmodeui sets what an unattended installation shows: none (the default, nothing shown), minimal (a progress bar) or minimalWithDialogs (dialogs that need interaction). unattendedmodeui requires mode=unattended, and neither exists for the MSI. [zcc.install.windows-unattended:silent-mode]
- **Upgrade.** upgradePasswordCmdLine (MSI `UPGRADEPASSWORDCMDLINE`) upgrades Client Connector silently; its value must match the Upgrade Password configured for access in unattended mode. [zcc.install.windows-unattended:upgrade-password] Upgrading with a password applies only to Client Connector 4.2.1 for Windows or later. An upgrade password can be required when updating in unattended mode (for example with GPO, SCCM or other device management methods), it provides additional security if auto-update is disabled, and it must be configured before the password can be used to upgrade. [zcc.install.windows-unattended:upgrade-password-scope] The upgrade page gives these ways to pass the upgrade password: an MST file created with Orca that adds UPGRADEPASSWORDCMDLINE as a property whose value is the generated upgrade password from the platform settings, deployed with GPO or a compatible device management tool; msiexec /i <complete path> /quiet UPGRADEPASSWORDCMDLINE=<upgrade password>; and --upgradePasswordCmdLine <upgrade password> with the EXE. [zcc.install.windows-unattended:upgrade-methods]
- **Uninstall.** uninstallPasswordCmdLine (MSI `UNINSTALLPASSWORDCMDLINE`) uninstalls the app silently through device management such as GPO, by removing the MST file from the GPO; it works only with the MSI or EXE, not the MST. Its value must match the Uninstall Password configured for access in unattended mode. Users must have enrolled, an Uninstall Password must be enabled with an unexpired password generated, and it needs Client Connector 4.2.1 or later; earlier versions, or the app profile's password, use UNINSTALLPASSWORD. [zcc.install.windows-unattended:uninstall-password]
- **Revert.** revertzcc (EXE only) silently reverts Client Connector to the previous version and must be run from the installer path of the version before the upgrade; revertPasswordCmdLine (MSI `REVERTPASSWORDCMDLINE`, from 4.2.1) must match the Revert Password configured for access in unattended mode. [zcc.install.windows-unattended:revert] The password option is spelled differently on the revert page, a divergence recorded with the prerequisites, commands and what a revert keeps in [Reverting Client Connector to the previous version: availability, enabling it, the commands and what a revert keeps](kb:zcc.install.revert).
- **Installer language.** installer-language (EXE only, from 4.5) sets the installer's language, English (the default) or French; it does not change the language of the app. [zcc.install.windows-unattended:installer-language]

## Launch and window behavior

- **Start after install.** launchTray (Windows and macOS) controls whether Client Connector starts its services and user interface after installation, which it does by default. Disabled, users must open Client Connector manually, or it runs after the next reboot. [zcc.install.windows-unattended:launch-tray] On Windows its MSI name is LAUNCHTRAY. [zcc.install.windows-unattended:launch-tray-msi-name] The macOS table contradicts itself on the default [divergence:zcc.install.windows-unattended:macos-launchtray-default].
- **Hidden window.** hideAppUIOnLaunch (Windows and macOS; MSI `HIDEAPPUIONLAUNCH` on Windows) keeps the app window hidden before users enroll; users can still open it from the system tray icon. On Windows, if Client Connector is installed with cloudName and userDomain, it attempts SSO automatically. [zcc.install.windows-unattended:hide-ui] Under strict enforcement on non-persistent Citrix VDIs it must stay 0: [With non-persistent Citrix VDIs on Windows, strict enforcement needs hideAppUIOnLaunch set to 0 so Client Connector can remind users to enroll before they reach the internet.](kb:zcc.install.strict-enforcement:citrix-hide-ui).
- **Kiosk mode.** On Windows from 4.10.0.463, kioskMode (MSI `KIOSKMODE`) lets Client Connector launch without waiting for the Windows desktop; by default it waits for a full-screen app such as Windows Autopilot to finish and the desktop to be visible before enrolling a new user. [zcc.install.windows-unattended:kiosk-mode]
- **Configuration wait.** configTimeout (MSI `CONFIGTIMEOUT`) sets how many seconds Client Connector waits for the configuration file if it is not already present; the default is 0. [zcc.install.windows-unattended:config-timeout]
- **VDI.** vdi (MSI `VDI`) indicates that Client Connector is being installed on virtual desktop infrastructure; it defaults to disabled. [zcc.install.windows-unattended:vdi] It moves the configuration store to the user profile: [VDI=1 (EXE --vdi 1) makes Client Connector store its configuration data in the %USERPROFILE%\AppData\Roaming\Zscaler user profile store instead of the default %ProgramData%\Zscaler, so a profile management tool such as Citrix UPM can roam and restore it.](kb:zcc.install.citrix-vdi:vdi-flag). Whether it changes anything else is open [gap:zcc.install.windows-unattended:vdi-effect]. Client Connector for VDI is a separate product whose MSI parameters are named differently: [Installing Client Connector for VDI: download, MSI options, golden images, OnboardOnStart, Intune and processes to allowlist](kb:cloud-connector.vdi.install).

What to check:
1. For a silent uninstall by command-line password, whether the user has enrolled, an Uninstall Password is enabled with an unexpired password, and the device runs 4.2.1 or later.
2. Whether launchTray was set to 0, when Client Connector did not start after installation.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.install.windows-unattended:launch-tray-msi-name] Tier B: The help capture joins the row's MSI and EXE labels into 'MSI: LAUNCHTRAYEXE: launchTray'; this reads it as MSI name plus EXE name, as the page's prose confirms for other rows (HIDEAPPUIONLAUNCH or hideAppUIOnLaunch, ENABLESSO or enableSSO) and its note that MSI and EXE names differ. No source writes this MSI name on its own.

Sources disagree (name both sides):
- The macOS parameter table marks 0 (Disable) as launchTray's default, while the same row's description, and the Windows table, say Client Connector starts after installation by default. [divergence:zcc.install.windows-unattended:macos-launchtray-default]
  - zscaler-help: The value column lists Disable as the default.
  - zscaler-help: Client Connector starts its services and user interface after installation by default.
  Impact: An admin reading the value column may set launchTray to 1 needlessly, or assume macOS installs stay idle until reboot when the key is omitted. The vendor's own Jamf and Intune sample plists set launchTray to 1 explicitly.

Not known (open gaps):
- What the VDI install flag changes [gap:zcc.install.windows-unattended:vdi-effect]: settled by source-read or support-ticket. Blocks: deciding whether a virtual desktop install needs the flag

Area: zcc.install, its subjects in references/_meta/spine/zcc/zcc.install.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.vdi.install.md (Installing Client Connector for VDI: download, MSI options, golden images, OnboardOnStart, Intune and processes to allowlist)
- links-to references/_meta/text/zcc/zcc.install.citrix-vdi.md (Client Connector on non-persistent Citrix VDIs: the single-user model, the VDI install parameters and the master VM)
- links-to references/_meta/text/zcc/zcc.install.revert.md (Reverting Client Connector to the previous version: availability, enabling it, the commands and what a revert keeps)
- links-to references/_meta/text/zcc/zcc.install.strict-enforcement.md (Strict enforcement, the policy token, and the fail-close configuration)
