# Joining ZIA logs to ZPA User Activity logs (shared.log-correlation.zia-zpa-join)
Also called: correlate zia and zpa logs; zia to zpa join; zpa_app_seg_name; same user in zia and zpa logs; trace a request across zia and zpa; user activity join key; cross-product log correlation; user session timeline across products
Former IDs: shared-22

A request that passes through both ZIA and ZPA leaves a ZIA NSS record and a ZPA User Activity record. Nothing in either record points at the other.

**No shared key.** The ZIA feeds identify a record by recordid, a unique identifier for each log, while User Activity carries SessionID, the TLS session ID, and ConnectionID, the application connection ID; no field on either side is described as carrying the other product's identifier, so a ZIA-to-ZPA join rests on user, device, application and time fields. [shared.log-correlation.zia-zpa-join:no-shared-key]

**Application segment.** The web and firewall feeds carry zpa_app_seg_name, the name of the Private Access (ZPA) application segment, and fwd_type, the type of forwarding method used, with Direct, Drop, Proxy Chaining and ZPA as examples. [shared.log-correlation.zia-zpa-join:segment-name] User Activity describes Application as the application name, AppGroup as the application group name and Policy as the access policy rule name. [shared.log-correlation.zia-zpa-join:ua-application] ZIA forwards traffic to a Private Access application segment through a ZPA gateway in a forwarding rule: [The Private Access gateway object in ZIA](kb:zia.forwarding-control.zpa-gateway). When zpa_app_seg_name is filled, and whether it equals the User Activity Application value for the same request, is open [gap:shared.log-correlation.zia-zpa-join:segment-name-match].

**User.** ZIA's login is in email address format in every feed: [The web, firewall and DNS NSS field tables each list time, epochtime, login, dept, location, datacenter, datacentercity, devicehostname, deviceowner, deviceostype, recordid and eedone; login is the user's login name in email address format in each.](kb:shared.log-correlation.zia-feeds:common-fields). User Activity's Username is the username as entered into Client Connector: [The User Activity Username is the username as entered into Zscaler Client Connector, and the User Status log has a Username field described only as the user name.](kb:zpa.logs.user-activity:username-in-both-logs). Whether the two hold the same string for one user is open [gap:shared.log-correlation.zia-zpa-join:identity-match].

**Device.** User Activity's Hostname is valid only for Client Connector and machine tunnel clients: [Hostname is the device name as reported by Zscaler Client Connector and only provides valid values for Zscaler Client Connector and machine tunnel client types.](kb:zpa.logs.user-activity:hostname-client-types). User Activity's Platform is the platform on the device as reported by Client Connector (for example Windows) and ClientPublicIP the public IP address of Client Connector; the ZIA web feed's cpubip is the client public IP address. [shared.log-correlation.zia-zpa-join:client-fields] Whether the ZIA device fields and the ZPA Hostname carry the same value for one device is open [gap:shared.log-correlation.zia-zpa-join:device-match].

**Time.** ZIA's epochtime is the epoch time of the transaction, while User Activity's LogTimestamp is the timestamp when the log was generated. [shared.log-correlation.zia-zpa-join:time-fields] ZIA consolidates logs with a latency of seconds to minutes: [The ZIA Insights Logs article says the Zscaler service performs global time-ordered log consolidation, with a potential latency of several seconds to a few minutes.](kb:shared.log-correlation.streams:zia-consolidation-latency). What window to allow between the two timestamps is open [gap:shared.log-correlation.zia-zpa-join:time-skew].

**Sessions across data centers.** Reconstructing one user's session when it spans several Service Edges or data centers, and whether recordid is unique across them, is open [gap:shared.log-correlation.zia-zpa-join:cross-dc-sessions].

**Status values.** The User Activity ConnectionStatus values are listed and shown differently: [zpa.logs.user-activity:status-case](kb:zpa.logs.user-activity:status-case). What triggers Active records on a long connection is open: [What triggers a ConnectionStatus Active record on a long-lived connection](kb:zpa.logs.user-activity:active-cadence).

What to check:
1. Start from the user's ZIA web records in the window (login and action) and note url, zpa_app_seg_name, fwd_type and epochtime.
2. Where zpa_app_seg_name is filled, look for User Activity records for the same user whose Application matches, near that time, and read ConnectionStatus and InternalReason.
3. Where zpa_app_seg_name is empty, treat any ZPA record as a separate connection matched only by user and time.
4. To reconstruct a user's activity, put the web, firewall and DNS records for login and the User Activity records for Username in one timeline ordered by time, adding User Status records for session events; narrow the window first.
5. When a session may have moved between data centers, do not deduplicate on recordid or assume one datacenter value per session.

Inferred, not quoted (say so when an answer rests on one):
- [shared.log-correlation.zia-zpa-join:no-shared-key] Tier B: Rests on a search of the ZIA web, firewall and DNS field tables and the User Activity field table for a field described as the other product's record, session or connection identifier; none was found.

Not known (open gaps):
- When zpa_app_seg_name is filled, and whether it equals User Activity Application [gap:shared.log-correlation.zia-zpa-join:segment-name-match]: settled by lab-test or tenant-data. Blocks: Matching a ZIA record to the ZPA connection it was forwarded to
- Whether ZIA login and ZPA Username hold the same string for one user [gap:shared.log-correlation.zia-zpa-join:identity-match]: settled by tenant-data. Blocks: Joining ZIA and ZPA records on the user name
- Whether ZIA device fields and ZPA Hostname carry the same value for one device [gap:shared.log-correlation.zia-zpa-join:device-match]: settled by tenant-data. Blocks: Joining ZIA and ZPA records on the device
- What time window to allow between ZIA and ZPA records of one request [gap:shared.log-correlation.zia-zpa-join:time-skew]: settled by tenant-data or lab-test. Blocks: Choosing a join window that neither drops nor over-matches records
- Correlating one session across several Service Edges or data centers [gap:shared.log-correlation.zia-zpa-join:cross-dc-sessions]: settled by lab-test or support-ticket. Blocks: Reconstructing a user's activity across a Service Edge or data center change

Area: shared.log-correlation, its subjects in references/_meta/spine/shared/shared.log-correlation.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say): The ZIA feeds identify a record by recordid, a unique identifier for each log, while User Activity carries SessionID, the TLS session ID, and ConnectionID, the application connection ID; no field on either side is described as carrying the other product's identifier, so a ZIA-to-ZPA join rests on user, device, application and time fields. [shared.log-correlation.zia-zpa-join:no-shared-key]
- depends-on references/_meta/text/shared/shared.log-correlation.zia-feeds.md (Correlating ZIA web, firewall and DNS records for one user or event): The ZIA feeds identify a record by recordid, a unique identifier for each log, while User Activity carries SessionID, the TLS session ID, and ConnectionID, the application connection ID; no field on either side is described as carrying the other product's identifier, so a ZIA-to-ZPA join rests on user, device, application and time fields. [shared.log-correlation.zia-zpa-join:no-shared-key]
- links-to references/_meta/text/shared/shared.log-correlation.streams.md (Where ZIA, ZPA and Client Connector logs can be read, and for how long)
- links-to references/_meta/text/zia/zia.forwarding-control.zpa-gateway.md (The Private Access gateway object in ZIA)
