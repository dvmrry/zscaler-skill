# What the ZIA disaster recovery deployment and operations guide requires and how clients behave (shared.deployments.zia.disaster-recovery)
Also called: zia disaster recovery; zia dr safe mode

ZIA disaster recovery needs Client Connector 4.0 or later for Windows or 3.71.38 or later for macOS, enablement for the organization via the Zscaler Account team, and a modifiable, customer-owned public DNS record; it might require an additional license. [shared.deployments.zia.disaster-recovery:prereqs] The macOS minimum version is written two ways: [divergence:shared.deployments.zia.disaster-recovery:macos-version]. ZIA Virtual Service Edges or Private Service Edges cannot be used with disaster recovery, and no traffic forwarding decisions other than allowing direct access or blocking access to destinations can be used with it. [shared.deployments.zia.disaster-recovery:restrictions] The ZPA side is in [What the ZPA disaster recovery deployment and operations guide requires, leaves unsupported and how activation is detected](kb:shared.deployments.zpa.disaster-recovery) and [Disaster recovery mode and Private Service Edge groups](kb:zpa.private-service-edges.disaster-recovery).

**Forwarding actions.** The App Profile disaster recovery traffic forwarding action is Send Traffic Direct (all traffic bypasses Client Connector), Disable Internet Access (all traffic dropped at the endpoint) or Pre-selected Destinations (block or allow specific URLs via a custom PAC file). [shared.deployments.zia.disaster-recovery:forwarding-actions] Zscaler pre-selected destinations and custom destinations can be combined; custom destination URLs take precedence, so a pre-selected destination can be blocked by placing it in the custom destinations PAC file with the Block destination. [shared.deployments.zia.disaster-recovery:destinations-precedence]

**DNS record.** To enable ZIA disaster recovery the DNS TXT record needs at minimum v=1, b=on and k=zia (k=all adds ZPA); for testing the record uses b=test and k=zia (or k=all for ZIA and ZPA). A TTL as low as possible is chosen, with 30 seconds recommended. [shared.deployments.zia.disaster-recovery:txt-record-tags] Client Connector checks the DNS TXT record every 200 seconds, and the guide says to account for DNS propagation before Safe Mode triggers; during a catastrophic failure the ZIA Admin Portal should be assumed inaccessible. [shared.deployments.zia.disaster-recovery:poll-interval] The maximum TTL is open [gap:shared.deployments.zia.disaster-recovery:ttl-maximum].

**Client behavior.** With disaster recovery on, blocked pages return HTTP 403 and Client Connector shows Service Status Safe Mode; a triggered client keeps limited access until disaster recovery is disabled and does not reconnect automatically even after ZIA services are restored. [shared.deployments.zia.disaster-recovery:client-behaviour] Whether ZIA has a reauthentication setting is open [gap:shared.deployments.zia.disaster-recovery:reauth-setting].

Sources disagree (name both sides):
- The minimum Client Connector version for macOS disaster recovery is 3.71.38 in the ZIA guide and 3.7.1.38 in the ZPA guide; the first is probably a vendor typo, but neither page says so. [divergence:shared.deployments.zia.disaster-recovery:macos-version]
  - zscaler-help: Zscaler Client Connector version 3.71.38 or later for macOS.
  - zscaler-help: Zscaler Client Connector version 3.7.1.38 or later for macOS.
  Impact: An admin checking macOS clients against the ZIA figure and the ZPA figure gets different cutoffs; confirm the build in the Client Connector release notes.

Not known (open gaps):
- What maximum TTL the ZIA disaster recovery TXT record tolerates [gap:shared.deployments.zia.disaster-recovery:ttl-maximum]: settled by source-read
- Whether ZIA disaster recovery has a reauthentication setting [gap:shared.deployments.zia.disaster-recovery:reauth-setting]: settled by source-read or support-ticket

Area: shared.deployments, its subjects in references/_meta/spine/shared/shared.deployments.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.deployments.zpa.disaster-recovery.md (What the ZPA disaster recovery deployment and operations guide requires, leaves unsupported and how activation is detected)
- links-to references/_meta/text/zpa/zpa.private-service-edges.disaster-recovery.md (Disaster recovery mode and Private Service Edge groups)
