# Minimum Client Connector and ZDX Module versions per OS and ZDX feature (zdx.compatibility.supported-versions)
Also called: zdx supported versions; zdx feature compatibility; zdx module minimum version; zdx minimum client connector version; supported versions feature compatibility

The ZDX compatibility page says Zscaler supports the latest Client Connector software version and the two previous versions; ZDX features may also need a subscription level (Ranges & Limitations) and a ZDX role. [zdx.compatibility.supported-versions:version-policy] Whether the current LTS version and other designated versions are also supported is stated on one page and not the other [divergence:zdx.compatibility.supported-versions:supported-version-policy].

**Base versions per OS.** The minimum Client Connector and base ZDX Module versions per OS are: Windows 2.2.1 and 1.0.0, macOS 2.2.1 and 1.0.0, Android 1.12 and 1.0.0, Android on ChromeOS 1.12 and 1.0.0, iOS 3.8 and 3.6. [zdx.compatibility.supported-versions:minimum-os-versions] With the base ZDX Module and the matching Client Connector version per OS, the Admin Console areas available are Dashboard, Analytics, Applications, Users, Configuration, Administration, Alerts, Search, Activation and Profile; specific features such as Software Inventory need later versions or are unavailable on an OS (Software and Device Inventory is unavailable for Android). [zdx.compatibility.supported-versions:base-version-console-access] Feature version requirements apply to the stated version and later (example: Software and Device Inventory needs Client Connector 3.7.1.56 or later for Windows); a tenant below the requirement must upgrade Client Connector or ZDX Module. [zdx.compatibility.supported-versions:feature-versions-apply-to-later]

**Cloud Path probe protocols.** Cloud Path probe protocol minimums (Client Connector / ZDX Module): Adaptive Mode Windows 3.4 / 2.3 and macOS 3.2 / 2.3.1; ICMP Windows 2.2.1 / 1.0.0; TCP Conventional Windows 3.4 / 2.3; TCP Resilent and TCP Strict Windows 4.9 / 4.8.1.67; UDP Windows 3.0 / 2.0. The table lists no macOS row for ICMP, TCP or UDP. [zdx.compatibility.supported-versions:cloud-path-protocols] The probes themselves are in [Reading the Cloud Path: the Hop View and Command Line View, tunnels, protocols, edges, and the error messages](kb:zdx.probes.cloud-path).

**Diagnostics.** Windows diagnostics minimums (Client Connector / ZDX Module): Deep Tracing 3.1.0.103 / 2.0.0.21; Hi-Fi Cloud Path 4.2 / 4.1; Bandwidth Test 3.9 / 3.8; Bandwidth Test with DNAT Details N/A / 4.4; Packet Capture Probing 3.9 / 3.5. [zdx.compatibility.supported-versions:diagnostics-windows] macOS diagnostics minimums (Client Connector / ZDX Module): Deep Tracing 3.0.0.144 / 2.0.0.15; Hi-Fi Cloud Path 4.5.1 / 4.4; Bandwidth Test 4.3.1 / 3.9; Packet Capture Probing 3.6 / 3.5. [zdx.compatibility.supported-versions:diagnostics-macos] Under the Android and Android on ChromeOS diagnostics heading, Deep Tracing is listed at Client Connector 3.7 and a ZDX Module version of 3.2 (the column header reads 'ZDX Module Version for Windows'). [zdx.compatibility.supported-versions:diagnostics-android] The diagnostics session types are in [The four Diagnostics session types in the console: Deep Tracing, Hi-Fi Cloud Path, Bandwidth Test and Packet Capture Probing](kb:zdx.diagnostics.session-types), whose open question about minimum versions this answers in part. What the table's absent OS rows and Android header mean is open [gap:zdx.compatibility.supported-versions:header-and-absent-rows].

**Device data.** Device Events reports on Windows need Client Connector 4.5 and ZDX Module 4.5 for System Crashes, and Client Connector 4.5 and ZDX Module 4.2 for Software Crashes. [zdx.compatibility.supported-versions:device-events-windows] Software Inventory minimums (Client Connector / ZDX Module): Windows 3.7.1.56 / 3.3.0.50, macOS 3.6 / 3.3.2. [zdx.compatibility.supported-versions:software-inventory] Process Inventory (and Process Inventory CPU Incidents) minimums (Client Connector / ZDX Module): Windows 3.9.0.189 / 3.8.0.37, macOS 3.6 / 3.5. [zdx.compatibility.supported-versions:process-inventory] Software Patch Inventory needs Client Connector 3.9 and ZDX Module 4.0 on Windows; the table has no other OS row. [zdx.compatibility.supported-versions:software-patch-inventory] Wi-Fi data collection for the Wi-Fi Dashboard needs Client Connector 4.5.0.1 and ZDX Module 4.5.0.1 on Windows; the table has no other OS row. [zdx.compatibility.supported-versions:wifi-collection]

**Monitoring and remediation.** Real User Monitoring needs Client Connector 4.8 with ZDX Module 4.7 on Windows and Client Connector 4.8 with ZDX Module 4.6 on macOS. [zdx.compatibility.supported-versions:rum-versions] Self Service (and its settings) needs Client Connector 4.4 with ZDX Module 4.0.1 on Windows and Client Connector 4.3.1 with ZDX Module 3.9 on macOS. [zdx.compatibility.supported-versions:self-service-versions] ZDX Autosense is available for Microsoft Teams, Webex and Zoom; Windows minimums (Client Connector / ZDX Module) are Teams 4.3 / 3.8, Webex 4.3.0.121 / 3.8.0.80 and Zoom 4.3 / 3.8. [zdx.compatibility.supported-versions:autosense-versions]

**Remediation.** Remediation needs Client Connector 4.8.0.151 and ZDX Module 4.7.0.48 on Windows; the table has no other OS row. [zdx.compatibility.supported-versions:remediation-versions] The ZDX Module minimum for Remediation is given two ways [divergence:zdx.compatibility.supported-versions:remediation-module-version]. The feature itself is in [ZDX Remediation: remote PowerShell scripts, jobs, signing, prerequisites and troubleshooting](kb:zdx.remediation).

**Open.** Whether Software Inventory and Software and Device Inventory are one feature is open [gap:zdx.compatibility.supported-versions:inventory-names], and the Device Events table's macOS row is not claimed [gap:zdx.compatibility.supported-versions:device-events-macos].

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
- What the missing OS rows and the Android table's 'ZDX Module Version for Windows' header mean [gap:zdx.compatibility.supported-versions:header-and-absent-rows]: settled by source-read or support-ticket
- Whether Software Inventory and Software and Device Inventory are the same feature [gap:zdx.compatibility.supported-versions:inventory-names]: settled by source-read
- The Device Events table's macOS row [gap:zdx.compatibility.supported-versions:device-events-macos]: settled by source-read

Area: zdx.compatibility, its subjects in references/_meta/spine/zdx/zdx.compatibility.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zdx/zdx.diagnostics.session-types.md (The four Diagnostics session types in the console: Deep Tracing, Hi-Fi Cloud Path, Bandwidth Test and Packet Capture Probing)
- links-to references/_meta/text/zdx/zdx.probes.cloud-path.md (Reading the Cloud Path: the Hop View and Command Line View, tunnels, protocols, edges, and the error messages)
- links-to references/_meta/text/zdx/zdx.remediation.md (ZDX Remediation: remote PowerShell scripts, jobs, signing, prerequisites and troubleshooting)
