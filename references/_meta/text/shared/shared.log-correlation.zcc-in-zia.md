# Client Connector traffic, devices and bypasses as seen in ZIA logs (shared.log-correlation.zcc-in-zia)
Also called: zcc traffic in zia logs; which device made this request; deviceowner devicehostname; traffic not going through zcc; zcc bypass in logs; bypassed_traffic; z-tunnel version in logs; trafficredirectmethod values

Client Connector's own log is collected from the device: [Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures](kb:zcc.logging.collection). Whether any of it reaches a SIEM directly is open: [Whether any Client Connector log reaches a SIEM directly](kb:shared.log-correlation.streams:zcc-siem-stream). What the ZIA records of the traffic it forwards show is below.

**How the traffic arrived.** [The trafficredirectmethod field records the traffic forwarding method used to reach ZIA Public Service Edges.](kb:zia.logs.web-records:psedge-field) The web feed gives DNAT, GRE, IPSEC, PBF, PAC, PAC_GRE, PAC_IPSEC and Zscaler Client Connector as example trafficredirectmethod values, and lists devicetype, the type of device, with Zscaler Client Connector as the example. [shared.log-correlation.zcc-in-zia:zcc-markers] The firewall feed calls its counterpart ttype: [Similar fields are named differently in the firewall and web logs: ttype and trafficredirectmethod, external_deviceid and external_devid, bypass_etime and bypassed_etime, bypassed_session and bypassed_traffic, and threat_severity and threatseverity.](kb:zia.logs.firewall-records:names-differ).

**Which tunnel and flow.** The web and firewall feeds list ztunnelversion, the Z-Tunnel version, with ZTUNNEL_1_0 as the example, and flow_type, the flow type of the transaction, with Direct, Loopback, VPN, VPN Tunnel, ZIA and ZPA as examples. [shared.log-correlation.zcc-in-zia:ztunnel-flow] The DNS field table lists neither ztunnelversion nor flow_type, so DNS records cannot be split by tunnel version or flow type. [shared.log-correlation.zcc-in-zia:dns-no-ztunnel] The version values and what each implies are open [gap:shared.log-correlation.zcc-in-zia:ztunnel-values]; a profile set to Z-Tunnel 2.0 can still carry web traffic over 1.0: [A profile set to Z-Tunnel 2.0 still sends web traffic over Z-Tunnel 1.0 when 2.0 cannot be set up and the setup failure behavior falls back to 1.0, when Redirect Web Traffic is on without Use Z-Tunnel 2.0 for Proxied Web Traffic, and when a request arriving on the Client Connector listening proxy matches an app profile PAC statement that sends it to a specific Public Service Edge.](kb:zcc.z-tunnel.versions:web-on-1-under-2).

**Which device and owner.** The device fields devicehostname, deviceowner and deviceostype are in all three feeds: [The web, firewall and DNS NSS field tables each list time, epochtime, login, dept, location, datacenter, datacentercity, devicehostname, deviceowner, deviceostype, recordid and eedone; login is the user's login name in email address format in each.](kb:shared.log-correlation.zia-feeds:common-fields). When they are filled, and what deviceowner holds relative to login, is open [gap:shared.log-correlation.zcc-in-zia:device-fields-population].

**Bypassed traffic.** The web and firewall feeds flag traffic that bypassed Client Connector: [bypassed_traffic is a numeric flag where 1 means the traffic bypassed Zscaler Client Connector.](kb:zia.logs.web-field-semantics:bypass-flag), [ips_custom_signature and bypassed_session are numeric flags with values 1 or 0; 1 means a custom IPS signature rule was applied, or that traffic bypassed Zscaler Client Connector.](kb:zia.logs.firewall-records:flags-1-0). Flow Logging reports to Internet & SaaS direct traffic that neither Zscaler nor a VPN handles: [Client Connector logs and reports traffic flows to Internet & SaaS for the areas enabled: traffic through the Private Access tunnel, direct traffic that neither Zscaler nor a VPN handles, and traffic Client Connector itself blocks (Unclassified Flow).](kb:zcc.logs.flow-logging:flow-areas). Where Flow Logging records appear is open: [Where flow-logging records appear and their fields](kb:zcc.logs.flow-logging:flow-record-fields). Whether bypasses on a trusted network or by explicit bypass configuration produce records is open [gap:shared.log-correlation.zcc-in-zia:bypass-record-source].

**Gaps in a user's traffic.** When a Client Connector tunnel fails the app can fail open to direct internet access: [For ZIA Cloud Not Reachable and for Z-Tunnel Failover the choice is Direct Internet Access (users bypass the app) or Disable Internet Access, which blocks HTTP and HTTPS and allows all other traffic.](kb:zcc.forwarding-profiles.fail-open:failover-options). What a gap in a user's web records says about the tunnel is open [gap:shared.log-correlation.zcc-in-zia:traffic-gap-reading].

What to check:
1. Separate Client Connector traffic from site and PAC traffic by grouping web records on trafficredirectmethod; for records with no device fields, read the method rather than assuming a bypass.
2. For a device question, search web records by deviceowner or devicehostname and compare deviceowner with login on the same records.
3. Count records with bypassed_traffic (web) or bypassed_session (firewall) set to 1 per user and compare with the user's forwarding profile and trusted-network detection.
4. To see which users are on which Z-Tunnel version, group web or firewall records by ztunnelversion per login; DNS records do not carry it.
5. For a suspected tunnel drop, look for gaps in the user's web records over the window and check the user's ZPA User Status records at the same time.

Inferred, not quoted (say so when an answer rests on one):
- [shared.log-correlation.zcc-in-zia:dns-no-ztunnel] Tier B: Rests on a search of the DNS field table capture (nss-feed-output-format-dns-logs.json) for both field names, which finds neither.

Not known (open gaps):
- The ztunnelversion values and what each implies [gap:shared.log-correlation.zcc-in-zia:ztunnel-values]: settled by tenant-data. Blocks: Reading the tunnel version mix of a fleet from the logs
- When the device fields are filled, and what deviceowner holds [gap:shared.log-correlation.zcc-in-zia:device-fields-population]: settled by tenant-data or lab-test. Blocks: Treating an empty deviceowner as traffic that did not come through Client Connector
- Whether trusted-network and configured bypasses produce ZIA records [gap:shared.log-correlation.zcc-in-zia:bypass-record-source]: settled by lab-test or tenant-data. Blocks: Counting a user's bypassed traffic from the logs
- What a gap in a user's web records says about the Client Connector tunnel [gap:shared.log-correlation.zcc-in-zia:traffic-gap-reading]: settled by lab-test or tenant-data. Blocks: Diagnosing tunnel outages from web log gaps

Area: shared.log-correlation, its subjects in references/_meta/spine/shared/shared.log-correlation.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.logs.flow-logging.md (Client Connector flow logging on Windows)
- links-to references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names)
- links-to references/_meta/text/shared/shared.log-correlation.streams.md (Where ZIA, ZPA and Client Connector logs can be read, and for how long)
- links-to references/_meta/text/shared/shared.log-correlation.zia-feeds.md (Correlating ZIA web, firewall and DNS records for one user or event)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.fail-open.md (Client Connector fail-open: captive portals, unreachable Service Edges and tunnel failures)
- links-to references/_meta/text/zcc/zcc.logging.collection.md (Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures)
- links-to references/_meta/text/zcc/zcc.z-tunnel.versions.md (Z-Tunnel 1.0 and 2.0: what each carries and how a profile selects one)
- links-to references/_meta/text/zia/zia.logs.web-field-semantics.md (Value encodings and caveats of ZIA web log fields)
- links-to references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.logs.client-log.md (What the Client Connector log on the device records)
