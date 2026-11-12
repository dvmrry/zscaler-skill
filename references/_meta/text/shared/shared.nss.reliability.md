# What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery (shared.nss.reliability)
Also called: nss one-hour recovery; nss duplicate logs; siem missing logs after outage; nss buffer; nss replay; cloud nss retry; nss log gap

Two legs can fail, and each has its own mechanism. The VM memory buffer covers the NSS-to-SIEM connection and the one-hour recovery covers the Zscaler cloud-to-NSS connection, so a recovery setting does not restore logs lost on the SIEM side, and the VM buffer does not help when the NSS loses the Nanolog. [shared.nss.reliability:legs-differ]

## NSS to SIEM (VM-based)

The NSS buffers logs in VM memory to increase its resiliency to transient network issues between the SIEM and NSS; if the connection drops, it replays logs from the buffer according to the Duplicate Logs setting. [shared.nss.reliability:vm-buffer] Because the NSS can detect a lost SIEM connection some time after the SIEM became unavailable, a feed's Duplicate Logs setting specifies when the NSS starts replaying logs from the buffer, for example 5 minutes before the lost connection is detected. [shared.nss.reliability:duplicate-logs] In the vendor example the SIEM goes offline at 6:29:00 PM, the NSS detects it at 6:30:00 PM and the connection returns at 6:40:00 PM. With Duplicate Logs at 5 minutes the NSS sends from 6:25:00 PM, duplicating 6:25:00 PM to 6:28:59 PM and recovering 6:29:00 PM to 6:30:00 PM; disabled, it sends from 6:30:00 PM and does not recover 6:29:00 PM to 6:30:00 PM; at 60 minutes it sends from 5:30:00 PM, which is not recommended because of the duplicates the SIEM must process. [shared.nss.reliability:duplicate-logs-example] Across a SIEM outage, VM-based NSS either loses the logs between the SIEM going down and the NSS detecting it (Duplicate Logs disabled) or resends logs the SIEM already holds (Duplicate Logs enabled). [shared.nss.reliability:no-clean-replay] The Cloud & Branch Connector article on adding NSS servers says the NSS buffers logs for at least one hour and sends them after the SIEM connection is re-established; the buffer memory is part of the VM specification and grows in proportion to the RAM allocated. [shared.nss.reliability:cbc-buffer] The article on deploying NSS virtual appliances says the NSS buffers the logs for at least one hour, and that if a SIEM goes offline for maintenance or the connection between the NSS and the SIEM is disrupted, the NSS buffers the logs and sends them when the connection is re-established. [shared.nss.reliability:buffer-one-hour-zia] On a TCP web feed, Duplicate Logs sets the number of minutes the NSS sends duplicate logs so that no logs are skipped during downtime. Zscaler recommends 5 minutes, or more if required, which allows the NSS to send up to 60 minutes (one hour) of logs to the SIEM after the connection is restored. [shared.nss.reliability:duplicate-logs-recommendation] What an outage longer than the buffer loses is open [gap:shared.nss.reliability:buffer-bound].

## Zscaler cloud to NSS

If connectivity between the Zscaler cloud and the NSS is interrupted, the NSS misses logs that arrived at the Nanolog cluster during the interruption and they are not delivered to the SIEM; when the connection is restored, the NSS one-hour recovery allows the Nanolog to replay logs up to one hour back. [shared.nss.reliability:nanolog-interruption] The NSS one-hour recovery is enabled for an organization by contacting Zscaler Support. [shared.nss.reliability:vm-recovery-support] The troubleshooting article states the retransmission with no enablement condition [divergence:shared.nss.reliability:recovery-enablement]. The AWS deployment guide says to contact Zscaler Support to learn more about NSS for Web, NSS for Firewall, and NSS Log Recovery subscriptions. [shared.nss.reliability:log-recovery-named] What that subscription covers, and whether it is the one-hour recovery, is open [gap:shared.nss.reliability:log-recovery-subscription]. In the event of a connection loss between the NSS server and the cloud Nanolog, the cloud retransmits the logs to the NSS up to a maximum of one hour, and if the NSS is down for more than an hour, the logs falling out of the one-hour window are not retrieved by the NSS. [shared.nss.reliability:nss-down-one-hour] Without the one-hour recovery, logs that reach the Nanolog during a cloud-to-NSS interruption are not delivered to the SIEM at all; with it, the replay reaches at most one hour back from restoration, so of a longer interruption only the last hour can be replayed. [shared.nss.reliability:recovery-bound] The reference point of "up to one hour back" is not stated [gap:shared.nss.reliability:recovery-reference-point].

## Cloud NSS

Cloud NSS recovery: [Cloud NSS delivery reads from the Nanolog: after an interruption, the Cloud NSS one-hour recovery lets the Nanolog replay logs up to one hour back.](kb:zia.logs.nss-feed-format:cloud-from-nanolog) Whether it also needs a Support request is open [gap:shared.nss.reliability:cloud-recovery-enablement]. Batch handling by HTTP status: A Cloud NSS feed treats HTTP 200 or 204 from the SIEM as a successful batch, treats 400 as a parsing error and drops the batch, and retries the same batch on any other code for up to one hour before dropping it. [shared.nss.reliability:cloud-nss-http-codes] The NSS Feeds article, under the SIEM connectivity test that is populated only for HTTP NSS feeds, says a feed treats HTTP/S status 200 or 204 from the SIEM as a successful upload and 400 as a parsing error that drops the batch, and retries the same batch on any other code for up to one hour, after which the batch is dropped. [shared.nss.reliability:http-feed-codes]

## Two VMs

Zscaler recommends two NSS servers per NSS type, deployed as an active-active pair created in the Admin Console with separate SSL certificates, optionally streaming to two separate SIEMs. Zscaler does not recommend two NSS VMs of the same type streaming to a single SIEM, because each sends copies of the same logs, which the SIEM might not be able to deduplicate. [shared.nss.reliability:ha-active-active] In the active-passive configuration one NSS server is created and its SSL certificate deploys one active VM, with the second VM as a cold standby. Both use the same certificate but should not connect to the Nanolog at the same time, which results in connection flapping, and if the active VM fails, failover should happen ideally within one hour of the failure to prevent data loss. [shared.nss.reliability:ha-active-passive] Standby VM nodes are not configured for automatic ZSOS upgrades, and Zscaler recommends redeploying a standby VM at least once a year to prevent outdated ZSOS settings. [shared.nss.reliability:standby-not-upgraded] The VM commands and certificate handling are in [Operating and troubleshooting a deployed NSS VM: the nss command set, error codes and connection checks](kb:shared.nss.vm-operations).

## After the window

ZIA logs stay in the Nanolog for 180 days and can be read on the Insights Logs pages: [The ZIA Insights Logs article says logs are stored for 180 days in the Zscaler Nanolog servers, and that NSS, a virtual machine, can stream web traffic logs in real time from the Nanolog to a SIEM, enabling real-time alerting, correlation with the logs of firewalls and other devices, and long-term local log archival.](kb:shared.log-correlation.streams:zia-retention). Whether they can be streamed again after the recovery window is open [gap:shared.nss.reliability:re-export].

ZPA's log stream behaves differently: [After a connection loss between Private Access and the App Connectors, LSS does not send the log data generated during the loss; after the connection is restored it can retransmit the last 15 minutes of log data, with delivery not guaranteed. During a loss between the App Connector and the SIEM, LSS sends nothing for that period except audit logs.](kb:zpa.app-connectors.health:lss-retransmit-limits).

What to check:
1. Which leg failed: the SIEM being unreachable from the NSS, or the NSS losing its connection to the Zscaler cloud.
2. For a SIEM outage on VM-based NSS, the feed's Duplicate Logs setting, which decides whether the minutes before detection are resent.
3. For a cloud-to-NSS outage, whether the one-hour recovery was enabled through Zscaler Support and whether the outage outlasted the hour.
4. For Cloud NSS or an HTTP feed, the HTTP status the SIEM returned: a 400 drops the batch at once.

Inferred, not quoted (say so when an answer rests on one):
- [shared.nss.reliability:no-clean-replay] Tier B: Generalizes the vendor's single worked example; the help does not describe delivery as at-least-once or exactly-once.
- [shared.nss.reliability:recovery-bound] Tier B: Reads "up to one hour back" as measured from the time the connection is restored; the help does not state the reference point.
- [shared.nss.reliability:legs-differ] Tier B: The help lists the two as separate reliability mechanisms for separate connections; it does not state that neither covers the other leg.

Sources disagree (name both sides):
- The vendor docs differ on whether the one-hour recovery needs enabling through Zscaler Support. [divergence:shared.nss.reliability:recovery-enablement]
  - zscaler-help: The one-hour recovery is enabled for an organization by contacting Zscaler Support.
  - zscaler-help: The troubleshooting article states the one-hour retransmission with no enablement condition.
  Impact: Whether the one-hour retransmission is on by default or needs a Support request cannot be settled from the vendor text; the AWS guide also names an NSS Log Recovery subscription without describing it.

Not known (open gaps):
- What the NSS Log Recovery subscription covers [gap:shared.nss.reliability:log-recovery-subscription]: settled by support-ticket
- Loss beyond the ZIA NSS buffer [gap:shared.nss.reliability:buffer-bound]: settled by source-read or lab-test. Blocks: saying how long a SIEM can be down before a VM-based NSS loses logs
- Whether the Cloud NSS one-hour recovery needs a Support request [gap:shared.nss.reliability:cloud-recovery-enablement]: settled by support-ticket. Blocks: telling a Cloud NSS tenant whether replay after an outage is on
- Re-streaming logs the SIEM never received [gap:shared.nss.reliability:re-export]: settled by support-ticket or source-read. Blocks: answering whether a SIEM gap from a long outage can be backfilled
- What the one-hour recovery is measured from [gap:shared.nss.reliability:recovery-reference-point]: settled by support-ticket or lab-test. Blocks: saying which part of an outage longer than an hour can be replayed

Area: shared.nss, its subjects in references/_meta/spine/shared/shared.nss.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields): Because the NSS can detect a lost SIEM connection some time after the SIEM became unavailable, a feed's Duplicate Logs setting specifies when the NSS starts replaying logs from the buffer, for example 5 minutes before the lost connection is detected. [shared.nss.reliability:duplicate-logs]
- links-to references/_meta/text/shared/shared.log-correlation.streams.md (Where ZIA, ZPA and Client Connector logs can be read, and for how long)
- links-to references/_meta/text/shared/shared.nss.vm-operations.md (Operating and troubleshooting a deployed NSS VM: the nss command set, error codes and connection checks)
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.nss.md (Nanolog Streaming Service (NSS): how ZIA logs leave the Zscaler cloud)
- see-also references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs)
- see-also references/_meta/text/zpa/zpa.log-receivers.delivery.md (Retention and delivery guarantees for ZPA logs)
