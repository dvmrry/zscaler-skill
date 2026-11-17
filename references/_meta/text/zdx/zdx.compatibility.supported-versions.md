# Minimum Client Connector and ZDX Module versions per OS and ZDX feature (zdx.compatibility.supported-versions)
Also called: zdx supported versions; zdx feature compatibility; zdx module minimum version; zdx minimum client connector version; supported versions feature compatibility

The ZDX compatibility page says Zscaler supports the latest Client Connector software version and the two previous versions. [zdx.compatibility.supported-versions:version-policy] Whether the current LTS version and other designated versions are also supported is stated on one page and not the other [divergence:zdx.compatibility.supported-versions:supported-version-policy].

**Base versions per OS.** The minimum Client Connector and base ZDX Module versions per OS are: Windows 2.2.1 and 1.0.0, macOS 2.2.1 and 1.0.0, Android 1.12 and 1.0.0, Android on ChromeOS 1.12 and 1.0.0, iOS 3.8 and 3.6. [zdx.compatibility.supported-versions:minimum-os-versions] With the base ZDX Module and the matching Client Connector version per OS, the Admin Console monitoring features available are Overviews (Digital Experience Overview, Users Overview, Applications Overview, Map View), Alerts, and Settings & Configuration > Probes; specific features for monitoring such as Software Inventory are limited by later versions, OS availability, ZDX Subscription Level, and ZDX Role (Software and Device Inventory is unavailable for Android). [zdx.compatibility.supported-versions:base-version-console-access] Feature version requirements apply to the stated version and later (example: Software and Device Inventory needs Client Connector 3.7.1.56 or later for Windows); a tenant below the requirement must upgrade Client Connector or ZDX Module. [zdx.compatibility.supported-versions:feature-versions-apply-to-later]

**Cloud Path probe protocols.** Cloud Path probe protocol minimums (Client Connector / ZDX Module): on Windows, Adaptive Mode 3.4 / 2.3, ICMP 2.2.1 / 1.0.0, TCP - Conventional 3.4 / 2.3, TCP - Resilent and TCP- Strict 4.9 / 4.8.1.67, UDP 3.0 / 2.0; on macOS, Adaptive Mode 3.4 / 2.3. The macOS table lists no ICMP, TCP or UDP row. [zdx.compatibility.supported-versions:cloud-path-protocols] The probes themselves are in [Reading the Cloud Path: the Hop View and Command Line View, tunnels, protocols, edges, and the error messages](kb:zdx.probes.cloud-path).

**Diagnostics.** Windows diagnostics minimums (Client Connector / ZDX Module): Deep Tracing 3.1.0.103 / 2.0.0.21; Hi-Fi Cloud Path 4.2 / 4.1; Bandwidth Test 3.9 / 3.8; Bandwidth Test with DNAT Details N/A / 4.4; Packet Capture Probing 3.9 / 3.5. [zdx.compatibility.supported-versions:diagnostics-windows] macOS diagnostics minimums (Client Connector / ZDX Module): Deep Tracing 3.0.0.144 / 2.0.0.15; Hi-Fi Cloud Path 4.5.1 / 4.4; Bandwidth Test 4.3.1 / 3.9; Packet Capture Probing 3.6 / 3.5. [zdx.compatibility.supported-versions:diagnostics-macos] The diagnostics session types are in [The four Diagnostics session types in the console: Deep Tracing, Hi-Fi Cloud Path, Bandwidth Test and Packet Capture Probing](kb:zdx.diagnostics.session-types), whose open question about minimum versions this answers in part. What a feature's absence from an OS's table means is open [gap:zdx.compatibility.supported-versions:header-and-absent-rows].

**Device data.** Device Events Reports on Windows need Client Connector 4.5.1 and ZDX Module 4.4 for System Crashes, and Client Connector 4.5 and ZDX Module 4.5 for Software Crashes. [zdx.compatibility.supported-versions:device-events-windows] Device Events Reports on macOS list Software Crashes at Client Connector 4.5 and ZDX Module 4.5. [zdx.compatibility.supported-versions:device-events-macos] Software Inventory and Software Inventory Data Collection minimums (Client Connector / ZDX Module): Windows 3.7.1.56 / 3.3.0.50, macOS 3.6 / 3.3.2. [zdx.compatibility.supported-versions:software-inventory] Process Inventory (and Process Inventory CPU Incidents) minimums (Client Connector / ZDX Module): Windows 3.9.0.189 / 3.8.0.37, macOS 3.6 / 3.5. [zdx.compatibility.supported-versions:process-inventory] Software Patch Inventory (and its data collection) needs Client Connector 3.9 and ZDX Module 4.0 on Windows; the macOS table has no Software Patch Inventory row. [zdx.compatibility.supported-versions:software-patch-inventory] Wi-Fi Dashboard and Wi-Fi Data Collection need Client Connector 4.5.0.1 and ZDX Module 4.5.0.1 on Windows; the macOS, iOS and Android tables list no Wi-Fi row. [zdx.compatibility.supported-versions:wifi-collection]

**Monitoring and remediation.** Real User Monitoring (RUM) needs Client Connector 4.8 with ZDX Module 4.6 on both Windows and macOS. [zdx.compatibility.supported-versions:rum-versions] Self Service (the Self Service Dashboard and Self Service Settings) needs Client Connector 4.4 with ZDX Module 4.0.1 on Windows and Client Connector 4.3.1 with ZDX Module 3.9 on macOS. [zdx.compatibility.supported-versions:self-service-versions] Autosense Cloud Path on Windows is listed for Microsoft Teams, Webex and Zoom, at (Client Connector / ZDX Module) Teams 4.3 / 3.8, Webex 4.3.0.121 / 3.8.0.80 and Zoom 4.3 / 3.8; the macOS table has no Autosense Cloud Path row. [zdx.compatibility.supported-versions:autosense-versions]

**Remediation.** Remediation needs Client Connector 4.8.0.151 with ZDX Module 4.7.0.48 on Windows and Client Connector 5.0 with ZDX Module 4.7 on macOS. [zdx.compatibility.supported-versions:remediation-versions] The Windows ZDX Module minimum for Remediation is given two ways [divergence:zdx.compatibility.supported-versions:remediation-module-version]. The feature itself is in [ZDX Remediation: remote PowerShell scripts, jobs, signing, prerequisites and troubleshooting](kb:zdx.remediation).

**iOS and Android.** The iOS feature table lists Cloud Path Probe and Web Probe, each at Client Connector 3.8 and ZDX Module 3.6, with Cloud Path Probe marked as having some limitations. [zdx.compatibility.supported-versions:ios-features] On iOS, Call Quality retrieves call data with API to show metrics, and Cloud Path probe configuration is supported but Autosense for Call Quality monitoring is not available. [zdx.compatibility.supported-versions:ios-limitations] The Android and Android on ChromeOS feature table lists Cloud Path Probe and Web Probe, each at Client Connector 1.12 and ZDX Module 1.0, with Cloud Path Probe marked as having some limitations. [zdx.compatibility.supported-versions:android-features] On Android and Android on ChromeOS, Call Quality retrieves call data with API to show metrics, and Cloud Path probe configuration is supported but Autosense for Call Quality monitoring is not available. [zdx.compatibility.supported-versions:android-limitations]

**Open.** Whether Software Inventory and Software and Device Inventory are one feature is open [gap:zdx.compatibility.supported-versions:inventory-names].

What to check:
1. The Client Connector and ZDX Module version for the OS and feature, as the stated version or later.
2. The Remediation minimum ZDX Module version, which the two sources give differently.

Sources disagree (name both sides):
- The ZDX compatibility page describes the supported Client Connector versions as the latest and the two previous; the Supported Versions page adds the current Long-Term Support (LTS) version and any other version Zscaler designates. [divergence:zdx.compatibility.supported-versions:supported-version-policy]
  - zscaler-help: Zscaler supports the latest Client Connector version and the two previous versions.
  - zscaler-help: For Client Connector Zscaler also supports the current LTS version, and may designate another version as supported.
  Impact: Reading the ZDX page alone would treat an LTS version older than the two previous releases as unsupported.
- The Supported Versions article gives ZDX Module 4.7.0.48 as the Windows minimum for Remediation, while the Remediation troubleshooting article names a ZDX Module older than 4.6.0. [divergence:zdx.compatibility.supported-versions:remediation-module-version]
  - zscaler-help: Remediation needs Client Connector 4.8.0.151 and ZDX Module 4.7.0.48 on Windows.
  - zscaler-help: The Remediation troubleshooting article lists a selected device running a Client Connector older than 4.8.0.151 or a ZDX Module older than 4.6.0.
  Impact: The Client Connector minimum (4.8.0.151) agrees, but the ZDX Module figure is 4.7.0.48 on one page and 4.6.0 on the other.

Not known (open gaps):
- What a feature's absence from an OS's table means [gap:zdx.compatibility.supported-versions:header-and-absent-rows]: settled by source-read or support-ticket
- Whether Software Inventory and Software and Device Inventory are the same feature [gap:zdx.compatibility.supported-versions:inventory-names]: settled by source-read

Area: zdx.compatibility, its subjects in references/_meta/spine/zdx/zdx.compatibility.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zdx/zdx.diagnostics.session-types.md (The four Diagnostics session types in the console: Deep Tracing, Hi-Fi Cloud Path, Bandwidth Test and Packet Capture Probing)
- links-to references/_meta/text/zdx/zdx.probes.cloud-path.md (Reading the Cloud Path: the Hop View and Command Line View, tunnels, protocols, edges, and the error messages)
- links-to references/_meta/text/zdx/zdx.remediation.md (ZDX Remediation: remote PowerShell scripts, jobs, signing, prerequisites and troubleshooting)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zdx/zdx.overview.md (ZDX at a glance: what it measures and which subject answers each question)
- see-also references/_meta/text/zdx/zdx.cloud-architecture.module-upgrades.md (ZDX Module upgrades: automatic, delayed, frozen and manual rollout)
- see-also references/_meta/text/zdx/zdx.applications.rum.md (Real User Monitoring in ZDX: prerequisites, the Real User Score and the RUM views)
- see-also references/_meta/text/zdx/zdx.devices.inventory.md (Hardware, process, software and software patch inventory in the ZDX console)
- see-also references/_meta/text/zdx/zdx.devices.health-and-events.md (ZDX device health metrics and device events)
- see-also references/_meta/text/zdx/zdx.dashboards.wifi.md (The Wi-Fi Dashboard: access points, SSIDs and their metrics)
- see-also references/_meta/text/zcc/zcc.install.system-requirements.md (Client Connector system requirements, resource usage, update intervals and deployment prerequisites)
