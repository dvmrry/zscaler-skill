# Correlating ZIA web, firewall and DNS records for one user or event (shared.log-correlation.zia-feeds)
Also called: zia shared log fields; join web and firewall logs; correlate dns and web logs; zia correlation keys; cip vs csip; epochtime join key; dns block then web block

This subject covers matching records for one user or event across the three ZIA NSS feeds: web, firewall and DNS.

**Fields the three feeds share.** The web, firewall and DNS NSS field tables each list time, epochtime, login, dept, location, datacenter, datacentercity, devicehostname, deviceowner, deviceostype, recordid and eedone; login is the user's login name in email address format in each. [shared.log-correlation.zia-feeds:common-fields] The client address is cip in the web and DNS feeds: the user's IP address, internal when it is visible (for example through a GRE tunnel or XFF); otherwise the web feed describes it as the same as cintip and the DNS feed as the client's internet (NATed public) address. The firewall feed has csip, the client source IP address, and tsip, the client's tunnel IP address, each holding the last session's value for an aggregate, plus cdfqdn, the client destination FQDN such as the HTTP host header. [shared.log-correlation.zia-feeds:client-ip-names] The per-feed field lists are in [ZIA web log (NSS web feed)](kb:zia/web-log), [ZIA firewall log (NSS firewall feed)](kb:zia/firewall-log) and [ZIA DNS log (NSS DNS feed)](kb:zia/dns-log).

**Which time field to join on.** Because time carries no time zone and tz is whatever zone each feed was configured with, time strings from feeds set to different zones do not line up; epochtime, the epoch time of the transaction, does not depend on the feed's zone setting and is the field to join feeds on. [shared.log-correlation.zia-feeds:epochtime-join] How the time zone behaves across several feeds or regions is open: [Time zone with several feeds or regions](kb:zia.logs.nss-feed-format:multi-feed-timezone).

**Record identity.** Each feed's recordid identifies one log record and has no Insights column: [Web log fields describe a transaction: time is the time and date of the transaction, epochtime its epoch time, and recordid a unique record identifier for each log.](kb:zia.logs.web-records:per-transaction), [The DNS field table marks recordid, eedone, company and cloudname as specific to NSS in its Insights Logs column.](kb:zia.logs.dns-record-fields:nss-only-fields). Whether the same identifier is unique across data centers is open: [Correlating one session across several Service Edges or data centers](kb:shared.log-correlation.zia-zpa-join:cross-dc-sessions).

**Firewall aggregates.** A firewall record can stand for several sessions and carries the addresses of the last one: [On an aggregated session, csip, csport, cdip, cdport, tsip, sdport, sdip, ssip and ssport each hold the value of the last session in the aggregate.](kb:zia.logs.firewall-records:last-session), [An aggregated record carries one set of addresses and ports for several sessions, so counting distinct addresses from aggregate records undercounts the addresses seen.](kb:zia.logs.firewall-records:undercount).

**One request, two feeds.** Web traffic is evaluated by the firewall module before the web module: [All web traffic is evaluated in the firewall module first, and only traffic that does not violate a firewall policy is forwarded to the web module.](kb:zia.firewall.traffic-path:firewall-first). So a firewall block shows as blocked in both feeds and a web-policy block shows as allowed in the firewall feed: [When web traffic violates a firewall policy, both the Firewall Insights and Web Insights logs show it blocked.](kb:zia.firewall.traffic-path:firewall-block-both-logs), [When traffic passes the firewall policy but violates a web policy, Firewall Insights shows it allowed and Web Insights shows it blocked.](kb:zia.firewall.traffic-path:web-block-firewall-allowed). The same guide later says the firewall logs show a web-blocked transaction as blocked: [Does the firewall log show a web-module block as allowed or blocked](kb:zia.firewall.traffic-path:web-block-firewall-log-conflict).

**DNS then web.** A DNS request and a later web request for the same name are separate records with no link field; what the DNS feed records for a blocked request is in [What happened to a DNS query: rules, actions, response values and errors](kb:zia.logs.dns-outcome), and the timing and category relationship between the two records is open [gap:shared.log-correlation.zia-feeds:dns-then-web].

What to check:
1. Match records across the web, firewall and DNS feeds on login and epochtime, not on the time string, and use cip for web and DNS but csip for firewall.
2. For a reported denial, search web and firewall records for the host and user in the window and see which feed records Blocked; a firewall-module block shows in both feeds, a web-module block only in the web feed.
3. For a suspected DNS-driven block, find DNS records whose req is the domain and whose reqaction or resaction blocked, then web records for the same login and host shortly after, and compare urlcat with the DNS categories.
4. Before counting distinct client addresses from firewall records, check whether the records are aggregated.

Inferred, not quoted (say so when an answer rests on one):
- [shared.log-correlation.zia-feeds:epochtime-join] Tier B: Takes epoch time as zone-independent by definition; the field tables do not state its unit or zone, and how time zones behave across several feeds is open (zia.logs.nss-feed-format:multi-feed-timezone).

Not known (open gaps):
- How a DNS block relates in time and category to a later web block [gap:shared.log-correlation.zia-feeds:dns-then-web]: settled by lab-test or tenant-data. Blocks: Attributing a web block to an earlier DNS block for the same user and name

Area: shared.log-correlation, its subjects in references/_meta/spine/shared/shared.log-correlation.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.firewall.traffic-path.md (Where the firewall sits in the traffic path): When web traffic violates a firewall policy, both the Firewall Insights and Web Insights logs show it blocked. [zia.firewall.traffic-path:firewall-block-both-logs]
- depends-on references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names): The web, firewall and DNS NSS field tables each list time, epochtime, login, dept, location, datacenter, datacentercity, devicehostname, deviceowner, deviceostype, recordid and eedone; login is the user's login name in email address format in each. [shared.log-correlation.zia-feeds:common-fields]
- depends-on references/_meta/text/zia/zia.logs.dns-record-fields.md (Reading a ZIA DNS log record: naming, encodings and field caveats): The web, firewall and DNS NSS field tables each list time, epochtime, login, dept, location, datacenter, datacentercity, devicehostname, deviceowner, deviceostype, recordid and eedone; login is the user's login name in email address format in each. [shared.log-correlation.zia-feeds:common-fields]
- depends-on references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named): The web, firewall and DNS NSS field tables each list time, epochtime, login, dept, location, datacenter, datacentercity, devicehostname, deviceowner, deviceostype, recordid and eedone; login is the user's login name in email address format in each. [shared.log-correlation.zia-feeds:common-fields]
- links-to references/_meta/text/shared/shared.log-correlation.zia-zpa-join.md (Joining ZIA logs to ZPA User Activity logs)
- links-to references/_meta/text/zia/zia.logs.dns-outcome.md (What happened to a DNS query: rules, actions, response values and errors)
- links-to references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.log-correlation.zcc-in-zia.md (Client Connector traffic, devices and bypasses as seen in ZIA logs)
