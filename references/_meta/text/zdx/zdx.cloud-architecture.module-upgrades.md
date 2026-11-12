# ZDX Module upgrades: automatic, delayed, frozen and manual rollout (zdx.cloud-architecture.module-upgrades)
Also called: zdx module; zdx module upgrade; zdx module version; delay zdx rollout; freeze zdx rollout; zdx module mdm; zdx module app store

ZDX runs on the device as a ZDX Module inside Client Connector, with its own release and rollout controls. Zscaler regularly releases new versions of the base ZDX Module, compatible with Client Connector for Windows and for macOS, and Client Connector automatically rolls out the latest version. [zdx.cloud-architecture.module-upgrades:auto-rollout]

**What the App Store shows.** For each platform (Windows or macOS) the App Store shows the rolled-out ZDX Module version, the earliest and latest Client Connector versions it is compatible with, and the number of devices using it. [zdx.cloud-architecture.module-upgrades:version-fields]

**Delaying a version.** A delayed rollout applies a version to selected user groups, for testing, for up to 180 days; Zscaler Support enables the feature. [zdx.cloud-architecture.module-upgrades:delayed-rollout] A delayed version shows Status Pending and an Auto Rollout In count of days; when the 180-day maximum from the version's release is reached, Client Connector rolls it out to all users unless the rollout is frozen. [zdx.cloud-architecture.module-upgrades:auto-at-180]

**Holding it longer.** Freezing a delayed rollout holds it beyond the 180-day maximum: the request takes a case number, if known, and a reason, and the version's Status changes to Frozen with the Auto Rollout In field cleared. [zdx.cloud-architecture.module-upgrades:freeze] Unfreezing returns the rollout to Pending if fewer than 180 days have passed since the version's release, and rolls it out immediately at 180 days or more. [zdx.cloud-architecture.module-upgrades:unfreeze]

**Deploying it yourself.** An upgrade package can be downloaded (32-bit or 64-bit ZIP, Windows) and deployed with the organization's MDM, a Group Policy Object or the CLI; this is available only with Client Connector 4.7 and later for Windows. [zdx.cloud-architecture.module-upgrades:manual-package]

**Processes to allowlist.** The ZDX Module process-usage table lists ZSAUpm (runs the ZDX service), ZSAUpmInstaller (runs the ZDX service installer for ZDX Module upgrades), ZSAScript (runs remote scripts on the device) and ZUpmApplication (gathers RUM metrics). [zdx.cloud-architecture.module-upgrades:module-process-usage] The page says ZSUpmInstaller must be allowlisted to allow the ZDX Module to upgrade to the latest version; its process-usage table spells the name ZSAUpmInstaller. [zdx.cloud-architecture.module-upgrades:module-upgrade-allowlist] Whether ZSUpmInstaller and ZSAUpmInstaller are one process is open [gap:zdx.cloud-architecture.module-upgrades:installer-name]. On macOS, the allowlist entry for Real User Monitoring is the entire path /Library/Application Support/Zscaler/UPM/ZUpmApplication. [zdx.cloud-architecture.module-upgrades:macos-rum-allowlist] %ProgramFiles(x86)% and %ProgramFiles% represent the drive where Windows program files are located, typically the C drive, with exceptions such as Amazon WorkSpaces, where program files are on the D drive; the ZDX Module allowlist paths depend on the ZDX Module version. [zdx.cloud-architecture.module-upgrades:windows-env-vars] The minimum Client Connector and ZDX Module versions per feature are in [Minimum Client Connector and ZDX Module versions per OS and ZDX feature](kb:zdx.compatibility.supported-versions).

**Open.** Which ZDX cloud component targets a delayed version to its user groups is not documented [gap:zdx.cloud-architecture.module-upgrades:rollout-orchestration].

What to check:
1. Whether the device's ZDX Module version is held back by a delayed or frozen rollout, from the module version's Status and Auto Rollout In values.
2. Whether the device can take a manual package at all: Windows with Client Connector 4.7 or later.

Not known (open gaps):
- Whether ZSUpmInstaller and ZSAUpmInstaller name the same process [gap:zdx.cloud-architecture.module-upgrades:installer-name]: settled by lab-test
- Which ZDX cloud component targets delayed module versions [gap:zdx.cloud-architecture.module-upgrades:rollout-orchestration]: settled by support-ticket. Blocks: answers about how quickly a rollout change reaches devices

Area: zdx.cloud-architecture, its subjects in references/_meta/spine/zdx/zdx.cloud-architecture.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zdx/zdx.compatibility.supported-versions.md (Minimum Client Connector and ZDX Module versions per OS and ZDX feature)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zdx/zdx.cloud-architecture.md (ZDX cloud architecture: components, the telemetry path and what is undocumented)
- see-also references/_meta/text/zcc/zcc.interoperability.security-software.md (Allowlisting Client Connector in antivirus and host firewalls: paths, processes, firewall directions and the 100.64 range)
