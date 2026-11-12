# Client Connector's command line: ZSACli on Windows and zscli on macOS, enabling it, disable passwords, commands and rate limits (zcc.support-options.cli)
Also called: zsacli; zscli; zcc command line interface; zcc cli; interacting with client connector remotely; disable zpa from command line; update installation parameters without reinstalling

Client Connector has a command line for interacting with its services on a device. Client Connector's command line interface is available only on Client Connector 4.4 and later for Windows and 4.3 and later for macOS, and some options require later versions of Client Connector for Windows. [zcc.support-options.cli:availability]

**What it can do.** The page's introduction says the CLI views the status of services and enables or disables Private Access; it scopes enabling or disabling Internet & SaaS and ZDX to 4.8 and later for Windows only, updating installation parameters without reinstalling to 4.9 and later for Windows only, and upgrading the ZDX Module to 4.7 and later for Windows only. Its example use is an outage that requires disabling Private Access for all users. [zcc.support-options.cli:capabilities] The page limits enabling or disabling Internet & SaaS and ZDX to Windows, while its own macOS section offers them [divergence:zcc.support-options.cli:cli-zia-zdx-platforms].

**Enabling it.** The CLI is enabled in the app profile: in the Command Line Interface Access section of the Add Windows Policy or Add macOS Policy window, enable the Command Line Interface. If a message says the CLI is disabled from the policy, the Command Line Interface option in the app profile must be enabled. [zcc.support-options.cli:enable-in-app-profile] In the page's Windows steps, the app profile can require a password for disabling Private Access, Internet & SaaS or ZDX through the CLI (Disable ZPA Password, Disable ZIA Password, Disable ZDX Password); its macOS steps offer the same three. A new policy, or changes to an existing one, must be saved before a password is generated, and the generated password expires after two hours. [zcc.support-options.cli:disable-passwords] The app profile's own description of those passwords is in [App profile passwords: logout, disable, exit and uninstall, per platform](kb:zcc.passwords-and-otp.app-profile-passwords).

**Where it is.** On Windows the CLI is ZSACli.exe, run from a command prompt started as an administrator: C:\Program Files\Zscaler\ZSACli\ZSACli.exe for 64-bit and C:\Program Files (x86)\Zscaler\ZSACli\ZSACli.exe for 32-bit. [zcc.support-options.cli:windows-path] On macOS the CLI is /Applications/Zscaler/Zscaler.app/Contents/PlugIns/zscli. [zcc.support-options.cli:macos-path]

**Commands.** In the Windows command table, enable -s <service> turns a service on and disable -s <service> turns it off, with zia (Internet & SaaS), zpa (Private Access) or zdx (Digital Experience) as the service. Enabling Private Access for a partner tenant adds -u <partner username> after zpa; a disable password generated in the app profile is added with -p after the service. enable can be run five or fewer times per minute and disable three or fewer. [zcc.support-options.cli:enable-disable] status -s <service> displays the status of a service in JSON format, or of all services with all. In the Windows table the services are zia, zpa, zdx, deception (Zscaler Deception) and zep (Anti-Tampering); in the macOS table they are zia, zpa, zdx and zdp, which that table describes as Endpoint Data Loss Prevention. [zcc.support-options.cli:status] What zdp names is disputed [divergence:zcc.support-options.cli:zdp-meaning]. On Windows, params -u <parameter name>=<new value> updates an installation parameter (cloudName, deviceToken, externalDeviceId, policyToken, strictEnforcement, userDomain or bcpConfigFilePath); params -list shows the parameters available for updating and their current values, params -get <parameter name> shows one of them, and the command can be run five or fewer times per minute. [zcc.support-options.cli:params] On Windows, update -s zdx upgrades the ZDX Module with a package from a path (-f) or a URL (-u), each with its checksum (-c); ZDX Module upgrades from the CLI must be enabled first, and the package and checksum can be downloaded and copied from the Client Connector App Store page. [zcc.support-options.cli:zdx-update] On macOS, diagnose -r runs diagnostics for Client Connector and outputs a file location for the diagnostics. [zcc.support-options.cli:macos-diagnose]

**Open.** Whether the Windows-only commands exist on macOS and the reverse, whether Linux has a CLI, the status and help rate limits, and the JSON schema of the status output are not stated [gap:zcc.support-options.cli:coverage].

What to check:
1. For a CLI that reports it is disabled from the policy, the Command Line Interface option in the user's app profile, and for a disable that asks for a password, the password generated in that app profile.
2. Before telling an admin that the CLI can or cannot control Internet & SaaS and ZDX on macOS, the divergence between the page's introduction and its macOS section.
3. Before reading a zdp status value as Endpoint DLP or Deception, the divergence between the CLI page and the managePass contract.

Sources disagree (name both sides):
- Whether the CLI can control Internet & SaaS and ZDX on macOS: the CLI page's introduction scopes it to Windows only, while its own macOS section and the app profile page offer the ZIA and ZDX disable passwords on macOS. [divergence:zcc.support-options.cli:cli-zia-zdx-platforms]
  - zscaler-help: The CLI page's introduction: enabling or disabling Internet & SaaS and ZDX is 4.8 and later for Windows only.
  - zscaler-help: The same page's macOS steps: the macOS app profile can require a password to disable Internet & SaaS and Digital Experience through the CLI.
  - zscaler-help: The app profile page: the ZIA disable password for the CLI applies to Client Connector 5.0 or later for macOS.
  Impact: The pages do not settle whether, and from which version, the macOS CLI can disable Internet & SaaS and ZDX; the macOS service values in the status table (zia, zdx) fit the macOS section rather than the introduction.
- What zdp names: the CLI page's macOS table describes it as Endpoint Data Loss Prevention, while the managePass contract describes zdpDisablePass as the password to disable Zscaler Deception. [divergence:zcc.support-options.cli:zdp-meaning]
  - zscaler-help: The CLI page's macOS status table: zdp indicates Endpoint Data Loss Prevention (the Windows table lists Deception separately as deception).
  - api-specs: The managePass contract: zdpDisablePass is the password to disable Zscaler Deception.
  Impact: Whether zdp, zdpDisableOtp and zdpDisablePass name Endpoint DLP or Deception is not settled; this is further vendor evidence for the open gaps in zcc.devices.record-fields (zd-vs-zdp) and zcc.passwords-and-otp.otp (zdp-otp-meaning).

Not known (open gaps):
- Commands the CLI page does not cover per platform [gap:zcc.support-options.cli:coverage]: settled by lab-test or source-read

Area: zcc.support-options, its subjects in references/_meta/spine/zcc/zcc.support-options.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.app-profile-passwords.md (App profile passwords: logout, disable, exit and uninstall, per platform)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.support-options.md (ZCC end-user support options (App Supportability))
- see-also references/_meta/text/zcc/zcc.platform-settings.md (Platform Settings: the per-OS console settings for sign-in, IPv6, ZDX upgrades, default UI and unattended-mode passwords)
- see-also references/_meta/text/zcc/zcc.install.precedence.md (Install parameters versus console settings: which wins, and what survives an update)
- see-also references/_meta/text/zcc/zcc.app-profiles.advanced-settings.md (What the less common app profile settings do)
- see-also references/_meta/text/zdx/zdx.cloud-architecture.module-upgrades.md (ZDX Module upgrades: automatic, delayed, frozen and manual rollout)
