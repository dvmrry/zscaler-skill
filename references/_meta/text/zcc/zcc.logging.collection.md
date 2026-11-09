# Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures (zcc.logging.collection)
Also called: report an issue; fetch logs; fetch lightweight logs; zcc log location; where are zcc logs; zcc packet capture; client connector app logs; zcc support bundle

Logs reach support three ways: the user sends them, an admin fetches them, or the user exports them.

**Report an Issue.** A Report an Issue form sends the form data with encrypted logs attached by email to the organization's support admin and anyone in the CC field, and can also open a ticket with Zscaler Support carrying the same encrypted logs. [zcc.logging.collection:report-an-issue] Enable Support Access in Zscaler Client Connector gives users the Report an Issue form; with support access enabled, Admin Email Address to Send Logs takes one or more comma-separated addresses, and Enable End User Ticket Submission to Zscaler also sends a ticket to Zscaler Support automatically when the user chooses Report an Issue. [zcc.logging.collection:support-settings] Only Zscaler can decrypt the encrypted logs. [zcc.logging.collection:only-zscaler-decrypts]

**Fetch Logs.** An admin can pull logs from an enrolled device with Fetch Logs or Fetch Lightweight Logs on its device details, once Client Connector App Logs is enabled and an email address is configured on the App Supportability tab. [zcc.logging.collection:fetch-prereq] After a fetch is requested, Client Connector uploads the logs at its next keepalive, usually once an hour while the device is active. [zcc.logging.collection:fetch-keepalive] Another vendor page gives a different keepalive interval [zcc.devices.lifecycle:keepalive-interval](kb:zcc.devices.lifecycle:keepalive-interval). Update Policy sends a keepalive at once [Clicking Update Policy in Client Connector sends a keepalive immediately instead of waiting for the next one.](kb:zcc.devices.lifecycle:update-policy-sends-keepalive). Fetch Logs applies to all OSs and all supported versions, covers the previous 14 days and includes PCAP and crash files; Fetch Lightweight Logs is for Windows 4.7 and later, covers the previous 24 hours and includes crash files but no PCAP files. [zcc.logging.collection:fetch-scope] Fetch Log Status moves from Waiting for KeepAlive to Extraction in progress to Completion, or Error while fetching logs; on completion the device details show a Log URL for the uploaded logs. [zcc.logging.collection:fetch-status] Which admin role permission Fetch Logs needs is open [gap:zcc.logging.collection:fetch-logs-permission].

**Zscaler-initiated collection.** Zscaler can also fetch log bundles itself when User Privacy allows it: [Enable Auto System Info and Log Fetch, off by default, lets Zscaler retrieve the app's log bundles into cloud storage that only Zscaler Support can access; the data includes personally identifiable information.](kb:zcc.web-privacy.collection:auto-log-fetch).

**Where the files are.** Client Connector logs are stored in `%ProgramData%\Zscaler\log-<random numbers>` on Windows, `/Library/Application Support/com.zscaler.Zscaler` on macOS (`/Library/Application Support/Zscaler` on ARM-based Macs), and `/var/log/zscaler/.Zscaler/Logs` on Linux. [zcc.logging.collection:log-locations]

**Packet captures.** A user packet capture records all packets on all network adapters, installs Npcap if it is missing (on Windows 5.0 and later the app profile can select Packet Monitor (Pktmon) or Npcap), and stops on its own when the session time limit expires. [zcc.logging.collection:packet-capture] Packet capture files go into the archive from Export Logs but not into the one from Report an Issue; they must be sent to Zscaler Support separately. [zcc.logging.collection:export-vs-report-pcap] The User Privacy switch that offers capture to users is [Enable Local Packet Capture adds a Start Packet Capture option to the app, installing Npcap if needed (on Windows 5.0 and later the app profile can select Packet Monitor (Pktmon) or Npcap); capture files are stored with the app's logs and included in Export Logs, not in Report an Issue. The option can take up to two hours to appear, or appears after Update Policy, and on Windows 4.8 and later an app profile setting overrides it.](kb:zcc.web-privacy.collection:packet-capture).

**Traceroute collection.** On the Network Performance page (Infrastructure > Advanced Settings > Network Performance), Client Connector can collect traceroute information on the connection between devices and the Zscaler cloud and store the results to check or troubleshoot network performance: Collect Route Information Every (In Minutes) takes a value from 10 to 1440 minutes to enable traceroute and 0 to disable it, and two options also allow collection when the device changes network state (for example from Wi-Fi to cellular data) and when a user reports an issue or exports logs. [zcc.logging.collection:traceroute-settings] When Client Connector collects traceroute information it is stored locally in a log file directory, and the traceroute log files are included when a user reports an issue or exports logs. [zcc.logging.collection:traceroute-in-logs] The destinations and protocol, whether 0 also stops the other two collections, and the file names and sizes are not stated [gap:zcc.logging.collection:traceroute-details].

**Operating-system logs.** What Client Connector writes to the operating system's own logs is not sourced [gap:zcc.logging.collection:os-log-integration].

What to check:
1. Whether Client Connector App Logs is on and a support email is set before expecting Fetch Logs to work.
2. Whether the device has sent a keepalive since the fetch was requested, from Fetch Log Status.
3. Whether the case needs packet captures, which travel with Export Logs and Fetch Logs but not with Report an Issue or Fetch Lightweight Logs.
4. Whether the period of interest is still inside what will be collected: 14 days for Fetch Logs, 24 hours for the lightweight fetch.

Not known (open gaps):
- Traceroute destinations, protocol, the effect of 0 and file details [gap:zcc.logging.collection:traceroute-details]: settled by lab-test or source-read
- What Client Connector writes to operating-system logs [gap:zcc.logging.collection:os-log-integration]: settled by lab-test or operator-experience
- Admin permission needed for Fetch Logs [gap:zcc.logging.collection:fetch-logs-permission]: settled by lab-test or source-read

Area: zcc.logging, its subjects in references/_meta/spine/zcc/zcc.logging.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.devices.lifecycle.md (Enrolled device states and what moves a device between them)
- links-to references/_meta/text/zcc/zcc.web-privacy.collection.md (What each User Privacy setting collects or allows)
