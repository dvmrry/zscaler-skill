# What the Client Connector log on the device records (zcc.logs.client-log)
Also called: zcc log contents; zsatunnel log; zsafw; zcc log format; does the zcc log show blocks; zcc log rotation
Former IDs: zcc-66, zcc-67

No captured vendor article describes the client log's records or fields; what is known comes from the log modes and from a few features that name a log.

**How much it holds.** What each mode adds is in [The modes are cumulative: Error logs only errors that affect functionality, Warn adds potential issues, Info adds general activity, and Debug logs all activity that could help Zscaler Support.](kb:zcc.app-profiles.logging:log-mode-ladder), and the file-size limit with oldest-first truncation in [Log file size is 50 to 1000 MB (50 to 500 on Android), 100 MB per log type by default; at the limit the oldest logs are truncated.](kb:zcc.app-profiles.logging:log-file-size). What a bundle includes besides the log, such as crash and PCAP files, is in [Fetch Logs applies to all OSs and all supported versions, covers the previous 14 days and includes PCAP and crash files; Fetch Lightweight Logs is for Windows 4.7 and later, covers the previous 24 hours and includes crash files but no PCAP files.](kb:zcc.logging.collection:fetch-scope).

**Named logs.** On Windows, the host firewall rules that Endpoint Firewall Management creates are not visible in Windows Defender but are listed in the ZSATunnel log under the `[ZSAFW]` string; the feature needs Client Connector 4.8 or later for Windows. [zcc.logs.client-log:zsafw]

**What it does not show.** That the client log has no per-transaction URL, response code or rule action is not sourced [gap:zcc.logs.client-log:transaction-records]; the deciding ZIA rule is read from [Which rule decided a web transaction, from the logs](kb:zia.logs.web-rule-attribution). Which event categories appear at which mode is not sourced [gap:zcc.logs.client-log:event-categories]. The file format is not sourced [gap:zcc.logs.client-log:file-format]. Whether Debug entries outlive a return to a quieter mode is open [gap:zcc.logs.client-log:debug-residue].

What to check:
1. For a site the user says the client blocked, read the ZIA web log for the action and rule rather than the client log.
2. For Endpoint Firewall Management on Windows, the `[ZSAFW]` entries in the ZSATunnel log.

Not known (open gaps):
- Absence of transaction records in the client log [gap:zcc.logs.client-log:transaction-records]: settled by lab-test or support-ticket. Blocks: telling a user whether the client log can explain a block
- Event categories by log mode [gap:zcc.logs.client-log:event-categories]: settled by lab-test
- Client log file format [gap:zcc.logs.client-log:file-format]: settled by lab-test
- Debug entries after returning to a quieter mode [gap:zcc.logs.client-log:debug-residue]: settled by lab-test

Area: zcc.logs, its subjects in references/_meta/spine/zcc/zcc.logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.app-profiles.logging.md (App profile log mode and log file size)
- depends-on references/_meta/text/zcc/zcc.logging.log-modes.md (Client Connector log modes as users and the API see them: Verbose, user choice, logMode and logLevel): `logMode` in the API is the console's Log Mode: the API reference describes it as the scope of the logs, the console's own words for that setting. `logLevel`, which the API reference describes as a three-step severity (Low 0, Normal 1, High 2), has no counterpart in the captured console articles; `logFileSize` is the maximum log file size. [zcc.logging.log-modes:log-mode-is-console-mode]
- links-to references/_meta/text/zcc/zcc.logging.collection.md (Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures)
- links-to references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.logging.md (Client Connector logs: verbosity, user access and collection)
- see-also references/_meta/text/zcc/zcc.logs.flow-logging.md (Client Connector flow logging on Windows)
