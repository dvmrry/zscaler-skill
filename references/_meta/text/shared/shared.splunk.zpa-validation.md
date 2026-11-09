# Checking a ZPA answer against LSS logs: segments, connectors, user status and posture (shared.splunk.zpa-validation)
Also called: segment-match-observed; segment-match-multimatch; connector-failure-direct-bypass; connector-throughput-utilization; connector-top-by-connection-count; connector-cpu-mem-alert; user-status-persistent-disconnects; zcc-version-distribution; posture-compliance-by-user; which zpa segment handled this host

ZPA answers about segment matching, connector choice and user sessions can be checked against User Activity, App Connector Metrics and User Status records. Each check below rests on what those logs say and leave open.

## Which segment and connector served a host

User Activity names the application, application group and access policy rule for each connection: [User Activity describes Application as the application name, AppGroup as the application group name and Policy as the access policy rule name.](kb:shared.log-correlation.zia-zpa-join:ua-application). The destination is Host and the connector is Connector: [zpa/user-activity-log#Host](kb:zpa/user-activity-log#Host), [A field named Connector, described as the App Connector name, appears in the User Activity, App Connector Status and App Connector Metrics logs.](kb:zpa.logs.user-activity:connector-name-three-logs). How a connection that tried several segments in sequence appears is open: [How a multi-segment sequence is represented in LSS](kb:zpa.logs.user-activity:multi-segment-lss).

A request whose port the more specific segment does not list is bypassed by Client Connector, not sent to Private Access: [If there is no match in the more granular application segment for the destination port, Zscaler Client Connector bypasses Private Access and sends the traffic directly.](kb:zpa.app-segments.matching:port-mismatch-bypass). What happens to that traffic next is open: [What happens to traffic after Zscaler Client Connector bypasses Private Access on a port mismatch](kb:zpa.app-segments.matching:post-bypass-outcome). Logs show the App Connector ID as zero when no connector could be resolved: [Logs and diagnostics show the App Connector ID as zero when the Central Authority cannot determine the application or resolve the connection to a connector; this occurs for the session status codes APP_NOT_REACHABLE, INVALID_DOMAIN and NO_CONNECTOR_AVAILABLE.](kb:zpa.app-connectors.selection:connector-id-zero).

## Connector load and headroom

CPUUtilization is the peak over the past 5 minutes: [App Connector Metrics CPUUtilization is the maximum CPU usage in the past 5 minutes, so it reports a peak; SystemMemoryUtilization is the memory use of the entire VM and ProcessMemoryUtilization that of the App Connector process.](kb:zpa.logs.app-connector-metrics:cpu-peak-window). The throughput fields state no interval: [The four throughput fields are described as the number of bytes transmitted to, or received from, the Public or Private Service Edge, with no interval stated.](kb:zpa.logs.app-connector-metrics:throughput-bytes), and whether they are per-interval deltas is open: [Emission interval of App Connector Metrics and whether the counters are deltas](kb:zpa.logs.app-connector-metrics:interval-and-delta). Connection counts and headroom fields: [AppConnectionsCreated, AppConnectionsCleared and AppConnectionsActive are described as the numbers of created, cleared and active application Microtunnel connections, with no interval or since-start qualifier; the example shows 300 created, 300 cleared and 0 active.](kb:zpa.logs.app-connector-metrics:app-connection-counts), [AvailablePorts is the number of usable ports; the file descriptor fields give the total and used counts for the App Connector system and for the App Connector process separately; AvailableDiskBytes is the number of free bytes available for an App Connector.](kb:zpa.logs.app-connector-metrics:headroom-fields).

Load is not always split evenly within a group, and a user stays on one connector for a while: [Load (interface statistics) is not always split equally between connectors in a group; the Health Dashboard shows how applications are split between them over a period.](kb:zpa.app-connectors.selection:uneven-load-expected), [Private Access keeps an active user on the same App Connector for 15 minutes after the user's last request to the application; the timer starts at selection and refreshes on each request.](kb:zpa.app-connectors.selection:affinity-15-minutes). Reading the metrics as overload or exhaustion is open: [Reading CPU, connection count and target counts as overload or load imbalance](kb:zpa.logs.app-connector-metrics:overload-reading), [What happens as ports, file descriptors or disk run out](kb:zpa.logs.app-connector-metrics:exhaustion-effects), and so are alert thresholds [gap:shared.splunk.zpa-validation:alert-thresholds].

## User sessions, versions and posture

SessionStatus values, and the wording of the DISCONNECTED value: [SessionStatus is ZPN_STATUS_AUTHENTICATED when the user successfully authenticated in Private Access and ZPN_STATUS_AUTH_FAILED when the user failed to authenticate; the third value, ZPN_STATUS_DISCONNECTED, is described as 'The user connected from a Public Service Edge for Private Access or a Private Service Edge for Private Access'.](kb:zpa.logs.user-status:session-status-values). How many records one session produces is open: [User Status record cardinality per session and when the byte counters are populated](kb:zpa.logs.user-status:record-granularity), and what a disconnect pattern means is open [gap:shared.splunk.zpa-validation:disconnect-pattern].

Version is the Client Connector version except through a Private Service Edge, where it is the Service Edge's: [The Version field is the Zscaler Client Connector version. When a connection is established through a Private Service Edge, an additional log is sent with the Version field updated to the Private Service Edge version.](kb:zpa.logs.user-status:version-via-pse).

PosturesMiss and PosturesHit arrive as a delimited string in the example but as a list in the User Status JSON format of the LSS API article's example response: [In the example record SAMLAttributes is one string of name:value pairs separated by commas, and PosturesHit is a comma-separated string; the field table describes SAMLAttributes only as 'The list of SAML attributes reported by the IdP', with no format. The User Status (zpn_auth_log) JSON format in the LSS API article's example response for all log formats instead writes PosturesHit, PosturesMiss, TrustedNetworks and TrustedNetworksNames as JSON arrays and SAMLAttributes as a single value.](kb:zpa.logs.user-status:list-fields-delimited), [zpa.logs.user-status:posture-miss-name](kb:zpa.logs.user-status:posture-miss-name). What a posture miss implies for access is open: [What a User Status record pattern implies about the user's problem](kb:zpa.logs.user-status:status-reading-guide).

Whether User Status and User Activity land in the same receiver or index is open: [Whether User Status and User Activity logs land in separate receivers or indexes](kb:zpa.logs.user-status:receiver-per-type).

What to check:
1. To see which segment handled a host, count User Activity records for Host by Application, AppGroup, Connector and Policy over the window.
2. With Multimatch on, list the Application values per user for the host to see which segments were used.
3. If the host never appears in User Activity, suspect a port mismatch bypass and check the segment ports and the device; if it appears, read ConnectionStatus and InternalReason for records that are not Active.
4. For connector load, compare AppConnectionsActive, CPUUtilization and the memory fields across the connectors of one group over the last half hour, allowing for affinity before calling it an imbalance.
5. For throughput per connector, sum the four transmitted and received byte fields per Connector, without treating them as per-interval deltas until that is confirmed.
6. For connector alerting, take the latest CPUUtilization, SystemMemoryUtilization, ProcessMemoryUtilization and AvailablePorts per Connector and compare with thresholds the operator sets.
7. For unstable users, count ZPN_STATUS_DISCONNECTED User Status records and distinct SessionID values per Username over several days, with Platform, Version and Hostname.
8. For a Client Connector version census, take each Username's latest User Status record and group by Version, remembering that sessions through a Private Service Edge report its version.
9. For posture compliance, take each Username's latest User Status record and list PosturesMiss and PosturesHit, splitting them first if the feed delivers one delimited string.
10. To set ZIA activity beside Client Connector version, join per-user web record counts to the latest User Status Version on login and Username.

Not known (open gaps):
- Alert thresholds for App Connector CPU, memory and ports [gap:shared.splunk.zpa-validation:alert-thresholds]: settled by operator-experience or support-ticket. Blocks: Setting connector health alerts from Metrics logs
- What a pattern of User Status disconnects says about the user [gap:shared.splunk.zpa-validation:disconnect-pattern]: settled by tenant-data or lab-test. Blocks: Telling unstable users from roaming users in User Status logs

Area: shared.splunk, its subjects in references/_meta/spine/shared/shared.splunk.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.logs.app-connector-metrics.md (What the ZPA App Connector Metrics log reports and what it leaves open)
- links-to references/_meta/text/zpa/zpa.logs.user-status.md (What a ZPA User Status log record says and does not say)
- links-to references/_meta/text/zpa/zpa.app-connectors.selection.md (How a session is assigned to an App Connector)
- links-to references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap)
- links-to references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say)
- links-to references/_meta/text/shared/shared.log-correlation.zia-zpa-join.md (Joining ZIA logs to ZPA User Activity logs)
