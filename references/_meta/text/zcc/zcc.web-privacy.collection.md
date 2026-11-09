# What each User Privacy setting collects or allows (zcc.web-privacy.collection)
Also called: collect machine hostname; collectMachineHostname; collect device owner information; collectUserInfo; disable automatic crash reporting; disableCrashlytics; restrict remote packet capture; enable local packet capture; collect location info for zdx; collectZdxLocation; enforce secure pac urls; allow access to client connector logs folder; auto system info and log fetch; override z-tunnel 2.0 protocol settings; overrideT2ProtocolSetting
Former IDs: zcc-59

**Identity on the device record.** With Collect Machine Hostname Information on, the app collects the hostname of supported devices into the Admin Console database, where it shows as the device's Machine Hostname and is included in the device fingerprint CSV export; on iOS 16 and later the full hostname is no longer collected. [zcc.web-privacy.collection:hostname] With Collect Device Owner Information on, the default, the app collects the device owner name into the Admin Console database, shown as the Owner in the device fingerprint. [zcc.web-privacy.collection:device-owner] Whether these switches also change what appears in Internet & SaaS or Private Access logs is open [gap:zcc.web-privacy.collection:cloud-log-effect].

**Packet capture.** Enable Local Packet Capture adds a Start Packet Capture option to the app, installing Npcap if needed (on Windows 5.0 and later the app profile can select Packet Monitor (Pktmon) or Npcap); capture files are stored with the app's logs and included in Export Logs, not in Report an Issue. The option can take up to two hours to appear, or appears after Update Policy, and on Windows 4.8 and later an app profile setting overrides it. [zcc.web-privacy.collection:packet-capture] Restrict Remote Packet Capture limits packet capture to administrators: with Npcap installed (by packet capture or by ZDX), non-administrators could otherwise use capture tools from user space, which can elevate their access. [zcc.web-privacy.collection:restrict-remote-capture]

**Crash reports.** The Android app uploads crash reports automatically, and they might contain user-identifiable information; Disable Automatic Crash Reporting stops the uploads, though Zscaler recommends leaving reporting on. [zcc.web-privacy.collection:crash-reports] Which platforms upload, and where reports go, is open [gap:zcc.web-privacy.collection:crash-report-scope].

**ZDX location.** Collect Location Info for ZDX lets the app collect geolocation from ZDX-enabled devices; it works in conjunction with the ZDX service entitlement, is on by default, and is available only when ZDX is enabled for the company or selected groups. [zcc.web-privacy.collection:zdx-location] How it combines with the entitlement's own location flag is open in [Digital Experience (ZDX) entitlement](kb:zcc.entitlements.zdx).

**Logs and support data.** Allow access to Client Connector logs folder for non administrators, on the User Privacy page, lets users without administrator privileges open the Zscaler program data folder and send individual log files instead of the whole folder as a ZIP. [zcc.web-privacy.collection:non-admin-log-folder] Enable Auto System Info and Log Fetch, off by default, lets Zscaler retrieve the app's log bundles into cloud storage that only Zscaler Support can access; the data includes personally identifiable information. [zcc.web-privacy.collection:auto-log-fetch]

**Protocol override.** Allow end user to override Z-Tunnel 2.0 or ZPA protocol settings, off by default, lets users change PAC, protocol (DTLS or TLS), MTU, debug logging and related settings at a local page, `http://localhost:9000/zconfig`; overrides last until the next keepalive or until the user logs out and back in. [zcc.web-privacy.collection:protocol-override]

**PAC and VPN bypass.** Enforce Secure PAC URLs, enabled through Zscaler Support, allows only https:// custom PAC URLs on app profiles and forwarding profiles; on Windows 4.8 and later it also stops the app falling back to HTTP when downloading the default PAC file over HTTPS fails. [zcc.web-privacy.collection:secure-pac] By default the app bypasses subdomains of FQDNs listed in VPN Gateway Bypass, for Z-Tunnel 1.0 and Tunnel with Local Proxy; a User Privacy option, enabled through Zscaler Support on specific versions, turns that off. [zcc.web-privacy.collection:fqdn-subdomains]

**API names.** The API keys that match these settings by name are `collectMachineHostname`, `collectZdxLocation`, `disableCrashlytics` (Disable Automatic Crash Reporting), `enablePacketCapture`, `restrictRemotePacketCapture`, `grantAccessToZscalerLogFolder`, `overrideT2ProtocolSetting` and `enforceSecurePacUrls`, which is absent from the API document and the Python model and present in the Go SDK and the Terraform provider. [zcc.web-privacy.collection:api-key-map] The keys without a clear console counterpart are open [gap:zcc.web-privacy.collection:unmapped-keys], and so are the legacy roles given to `exportLogsForNonAdmin` and the other log and capture keys [gap:zcc.web-privacy.collection:privacy-field-meanings].

What to check:
1. For a missing hostname or owner on a device record, whether the matching User Privacy switch is on, and for iOS 16 or later that the full hostname is no longer collected.
2. For a packet capture option that does not appear, whether it was enabled less than two hours ago and whether the user clicked Update Policy, and whether an app profile setting overrides it.
3. For a privacy review, the User Privacy settings for non-admin log-folder access and packet capture, and the unsourced exportLogsForNonAdmin.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.web-privacy.collection:api-key-map] Tier B: The mapping of API keys to console settings is by name; no source states it. The Terraform provider exposes enforceSecurePacUrls as well as the Go SDK; its absence from the API document is pinned, and the Python zcc package was searched for it.

Not known (open gaps):
- Whether the hostname and owner switches change cloud log content [gap:zcc.web-privacy.collection:cloud-log-effect]: settled by lab-test or tenant-data. Blocks: answers to why user names or hostnames are missing from logs
- Which platforms upload crash reports, and to where [gap:zcc.web-privacy.collection:crash-report-scope]: settled by source-read or support-ticket
- Console counterparts of collectUserInfo, enableAutoLogSnippet and enableFQDNMatchForVpnBypasses [gap:zcc.web-privacy.collection:unmapped-keys]: settled by source-read or tenant-data
- What exportLogsForNonAdmin does [gap:zcc.web-privacy.collection:privacy-field-meanings]: settled by source-read

Area: zcc.web-privacy, its subjects in references/_meta/spine/zcc/zcc.web-privacy.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.entitlements.zdx.md (Digital Experience (ZDX) entitlement): Collect Location Info for ZDX lets the app collect geolocation from ZDX-enabled devices; it works in conjunction with the ZDX service entitlement, is on by default, and is available only when ZDX is enabled for the company or selected groups. [zcc.web-privacy.collection:zdx-location]
