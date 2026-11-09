# ZDX probes: Web and Cloud Path probes, what they measure and how they run (zdx.probes)
Also called: zdx probe; zdx probes; web probe; cloud path probe; cloudpath probe; cloud path; page fetch time; server response time; ttfb; dns time; zdx availability metric; zdx probe ssl inspection; zdx probe frequency; zdx monitor; hop count; zdx packet loss; zscaler managed probe; zscaler hosted probes; hosted probe; zscaler hosted monitoring; adaptive mode; adaptive probing

Probes are the measurements behind most ZDX data. The probe types ZDX supports are Web probes and Cloud Path probes; Web probes collect Page Fetch Time, DNS Time, Server Response Time and Availability, and Cloud Path probes give a summarized visualization between hop points of traffic. [zdx.probes:probe-types] Which probes an application needs is in [A custom application must have a Web probe created to be enabled; most applications have at least one Web probe and one Cloud Path probe, while network applications need only a single Cloud Path probe. Predefined applications have probes preconfigured by default, while custom applications need probes created manually.](kb:zdx.applications:probe-requirements), and which users a probe runs for is in [Who a ZDX probe runs for: probing and exclusion criteria](kb:zdx.probes.criteria).

The word also names unrelated mechanisms in other products, such as the router health checks that decide GRE tunnel failover ([GRE tunnel health checks and failover](kb:zia.traffic-forwarding.gre-failover)) and App Connector health reporting ([App Connector health, status values and telemetry](kb:zpa.app-connectors.health)).

## Web probes

Web probes always pull objects from the server and do no local caching. [zdx.probes:web-no-cache] A Web probe's Page Fetch Time is the network fetch time of the page at the probe's URL, requesting only the top-level page document and not its embedded links; DNS Time is the time to resolve the URL's hostname; Server Response Time is Time to First Byte; Availability is based on the HTTP response code: if a success code is returned it is either 1 or 0, and if the probe times out it defaults to 0. [zdx.probes:web-metrics]

**On the user page.** On the user page a Web probe's Page Fetch Time is the time for the selected application to transfer or load a page for a user, and its components include PAC Parsing Time, DNS Time, TCP Connection Time, SSL Handshake Time and Server Processing Time. [zdx.probes:pft-components] Zscaler Time to First Byte is the time from when a user's browser sends a request to an application until it receives the first byte of data from the server, and includes Redirect Time, TCP Connection Time, SSL Handshake Time, Server Processing Time and Response Transmission Time. [zdx.probes:ttfb-components] Users with an Advanced Plus subscription can view a tooltip with DNS, SSL, TCP, Server Processing Time and Time to Last Byte metrics that comprise the total Page Fetch Time, with additional graphs for PAC parsing time, DNS time, TCP connect time, HTTP connect time and SSL time, where applicable with individual server redirects per graph (Client to Public Service Edge, Public Service Edge to the application, or Client to the application), the last redirect indicating the time to the final destination; the subscription table supports Page Fetch Time Server Redirects only on Advanced Plus. [zdx.probes:pft-redirects] On the user page Web probe metrics are not provided for Network applications; traffic steered through Source IP Anchoring shows via SIPA and is highlighted in the timeline graphs, and icons can indicate warnings, errors or Private Access rate limiting. [zdx.probes:user-page-web-notes]

**In the console.** The Web Probe Errors help says only the GET method can currently be configured for a Web probe from the UI, and that a request times out when no response is received from the server in the configured timeout (60 seconds by default). [zdx.probes:console-get-only] The success codes differ between the contract and the help [divergence:zdx.probes:web-success-codes]. The error messages a Web probe shows are in [Web probe error messages in ZDX: what each reports and what the help suggests](kb:zdx.probes.web-probe-errors).

**Policy.** The organization's SSL policies do not apply to ZDX synthetic Web probes, while all other policies applicable to regular traffic do; the exception enables caching of responses, without which destination servers would see an excessive surge of probe requests. [zdx.probes:ssl-exempt] SSL Inspection itself is in [ZIA SSL/TLS inspection](kb:zia.ssl-inspection). How probe traffic shows in ZIA logs and what a blocking policy does to a probe's metrics is unverified [gap:zdx.probes:probe-policy-outcomes].

**In the configuration API.** In the API contract a WEB monitor defaults to the GET request method, response codes 200-299 and 304, redirect following off with a maximum of 5 redirects, 1 retry and a 60-second request timeout. [zdx.probes:web-monitor-defaults]

## Cloud Path probes

A Cloud Path gives a summarized path visualization between the hop points of traffic, either for a direct path (Client Connector to egress to destination) or for tunneling through a Public Service Edge for Internet & SaaS (Client Connector to egress to Public Service Edge to destination). [zdx.probes:cloud-path-shapes] An unreachable hop is considered unknown and shows in the path as a dotted arrow. [zdx.probes:unreachable-hop] Cloud Path probes collect Hop Count (hops between each hop point on the path), Packet Loss (percentage at each hop point) and Latency (average, minimum, maximum and standard deviation of the round-trip time, in milliseconds). [zdx.probes:cloud-path-metrics] The console's Hop View and Command Line View, tunnels and the Cloud Path error messages are in [Reading the Cloud Path: the Hop View and Command Line View, tunnels, protocols, edges, and the error messages](kb:zdx.probes.cloud-path).

**Per device.** The API's Cloud Path read for an application on a device returns summary data for the whole path (total hops, packet loss, latency and tunnel type, if available) and a similar summary for each hop, defaulting to the last 2 hours. [zdx.probes:cloudpath-hop-data] The latency segments the application metric trend offers are in [The application metric read returns a metric trend: for Web probes Page Fetch Time, Server Response Time, DNS Time or Availability, defaulting to Page Fetch Time; for Cloud Path probes the latency for End to End, Client - Egress, Egress - Application, ZIA Service Edge - Egress and ZIA Service Edge - Application, defaulting to End to End; and the last 2 hours if no time range is given.](kb:zdx.applications:app-metrics).

**Through a Service Edge or not.** When the path goes through a Public Service Edge, and whether that follows the device's forwarding or the probe's configuration, is not documented [gap:zdx.probes:cloud-path-service-edge].

**Trusted networks.** Whether probes keep running when the forwarding profile's action on a trusted network is None is unverified [gap:zdx.probes:trusted-network-none]; the forwarding actions themselves are in [ZCC forwarding profiles](kb:zcc.forwarding-profiles).

**Cellular networks.** Whether Cloud Path results on cellular networks are noisier is unverified [gap:zdx.probes:cellular-noise].

## How often probes run

The score article's 5-minute cadence is in [Client Connector sends a probe to an application every 5 minutes; each 5-minute period's measurements are given a value from 0 to 100, and the lowest value within an hour becomes that hour's value. This is done for every defined application across all users, their devices and their locations.](kb:zdx.score.calculation:hourly-lowest). The Probes page lists each probe's type, name, status, protocol or methods, and frequency, the frequency of when the probe runs. [zdx.probes:page-frequency] In the API contract WEB and TRACERT monitors take a `frequencyInSeconds` that defaults to 300, while a TRACERT_V2 monitor's is read-only with a default of 900. [zdx.probes:monitor-frequency] The score article's 5 minutes and the subscription table's probing interval differ by tier, see [How the ZDX Score is calculated: 5-minute values, hourly lows and rollups per scope](kb:zdx.score.calculation).

**Adaptive.** Per Using Adaptive Mode, Adaptive mode tries the TCP, UDP and ICMP protocols for each run and picks the best available protocol for the probe, selecting the best protocol for each leg in the Cloud Path by auto-discovery, so the Cloud Path can combine more than one protocol; the factors are least latency and least loss to the destination (egress/server), and if Adaptive detection fails ICMP is used for the leg to the egress router and TCP for the path to the destination server. Minimum versions of Client Connector and ZDX Module are required, Adaptive can be selected when configuring a Cloud Path probe for a predefined or custom application, and the protocol used is visible in the Cloud Path section on the user details page. [zdx.probes:adaptive-behavior] Whether scores stay comparable across cadences or modes is not documented [gap:zdx.probes:adaptive-mode]. Adaptive for Private Access applications is described two ways, see [zdx.probes.configuration:adaptive-private-access](kb:zdx.probes.configuration:adaptive-private-access).

## Probe kinds and views

The Probes page has an End User view (the default) of configured applications and their probes, a Managed view of applications with Zscaler Managed probes, and a Top Private Apps view; depending on the ZDX role and subscription level, some views might not show. [zdx.probes:page-views] The API contract's monitor create request takes a `type` of TRACERT_V2, WEB, TRACERT or HIFI_MTR and a `class` of PREDEFINED, NETWORK or CUSTOM; TRACERT and HIFI_MTR monitors take a protocol of TCP, UDP, ICMP, ADAPTIVE or AUTO, defaulting to ICMP for TRACERT and TCP for HIFI_MTR. [zdx.probes:monitor-types] How the contract's monitor types and the Zscaler Managed probes map to the two probe types in the help is not stated [gap:zdx.probes:managed-and-monitor-types]; Managed Monitoring itself is in [Managed Monitoring and Zscaler Managed Probes: where they run, what they chart and their subscription limits](kb:zdx.probes.managed).

**Configuring and grouping.** How an end-user probe is configured in the console is in [Configuring end-user Web and Cloud Path probes in the console: fields, defaults, limits and protocols](kb:zdx.probes.configuration), and the collections that hold applications and their probes are in [ZDX collections: default collections, membership, ranking, criteria, deletion and limits](kb:zdx.probes.collections).

**Limits.** The subscription table's row named Active Probes (per tenant) limits active probes to 3 on Standard, 7 on Microsoft 365, 30 on Advanced and 100 on Advanced Plus, its row Active Probes (per user) to 3, 7, 30 and 30 in the same order, and the total number of Cloud Path and Web monitoring probes to 512 on all four. [zdx.probes:probe-limits] The table has a second, unqualified active-probes row [divergence:zdx.probes:active-probes-rows].

**Retention.** How long probe results are kept, and at what granularity, is not documented [gap:zdx.probes:result-retention].

**Diagnostics Sessions.** How often information is collected during a Diagnostics Session is in [During a Diagnostics session information is collected every minute for the Web probe and the Cloud Path probe, as well as device statistics.](kb:zdx.diagnostics:session-collection-interval), while how often the probes themselves run is open [How often probes run during a Diagnostics Session](kb:zdx.diagnostics.session-status:probe-cadence-during-session); the sessions themselves are in [ZDX Diagnostics Sessions (deep traces): what they are and where each part is covered](kb:zdx.diagnostics).

What to check:
1. Whether the SSL Inspection policy explains a Web probe that succeeds while user traffic to the same URL fails, since SSL policies do not apply to Web probes.
2. Which hop or segment of the Cloud Path carries the loss or latency, before attributing a slow application to the network or to the application.
3. Whether the probe's configured frequency differs from the 300-second default before comparing its data with other probes.

Sources disagree (name both sides):
- The HTTP success codes of a Web probe: the API contract defaults a WEB monitor to 200-299 and 304; the Web Probe Errors help says the Web probe is configured to consider 100-199, 200-299 and 300-399 successful. [divergence:zdx.probes:web-success-codes]
  - api-specs: A WEB monitor's `responseCodes` defaults to 200-299 and 304.
  - zscaler-help: The Web probe considers HTTP connections in the ranges 100-199, 200-299 and 300-399 successful.
  - zscaler-help: Configuring a Probe applies a default list of 1xx, 2xx and 3xx codes, which it then names code by code (see zdx.probes.configuration).
  Impact: A 1xx or other 3xx response (a 302, say) is a failure under the contract's default list and a success under the help's; the sources do not say which list a console-created probe uses, and the Configuring a Probe default list names some 3xx codes and not others.
- The Applications and Probes table has two rows for active probes: one named Active Probes (per tenant) with 3, 7, 30 and 100, and one named Active Probes with 6, 13, 30 and 1,000 (Standard, Microsoft 365, Advanced, Advanced Plus). [divergence:zdx.probes:active-probes-rows]
  - zscaler-help: The row Active Probes (per tenant) gives 3, 7, 30 and 100.
  - zscaler-help: The row Active Probes gives 6, 13, 30 and 1,000.
  Impact: The two rows give different figures for active probes on every tier but Advanced; the table does not say what the unqualified row counts or which one governs.

Not known (open gaps):
- How probe traffic appears in ZIA logs and how a blocking policy shows in probe metrics [gap:zdx.probes:probe-policy-outcomes]: settled by lab-test. Blocks: reading a probe's availability drop as a policy block or an application outage
- When a Cloud Path goes through a Public Service Edge [gap:zdx.probes:cloud-path-service-edge]: settled by lab-test or source-read. Blocks: attributing latency to the Zscaler tunnel or the local network
- Whether Cloud Path results on cellular networks are less stable [gap:zdx.probes:cellular-noise]: settled by operator-experience or lab-test. Blocks: interpreting Cloud Path data from devices on cellular links
- Whether scores stay comparable across probing cadences or modes [gap:zdx.probes:adaptive-mode]: settled by source-read or support-ticket. Blocks: comparing scores of probes with different cadences or modes
- How Zscaler Managed probes and the contract's monitor types map to Web and Cloud Path probes [gap:zdx.probes:managed-and-monitor-types]: settled by source-read. Blocks: answers about where a managed probe runs and which metrics it yields
- How long probe results are kept and at what granularity [gap:zdx.probes:result-retention]: settled by support-ticket or lab-test. Blocks: answers about how far back probe data can be read
- Whether probes run while the forwarding profile's action is None [gap:zdx.probes:trusted-network-none]: settled by lab-test or source-read. Blocks: explaining ZDX data, or its absence, for devices on trusted networks

Area: zdx.probes, its subjects in references/_meta/spine/zdx/zdx.probes.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zdx/zdx.probes.criteria.md (Who a ZDX probe runs for: probing and exclusion criteria): Probing (inclusion) criteria use AND logic across fields: a probe for user John Doe, user group Group B and department Finance has the expression John Doe AND Group B AND Finance. [zdx.probes.criteria:inclusion-and]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.md (ZIA SSL/TLS inspection): The organization's SSL policies do not apply to ZDX synthetic Web probes, while all other policies applicable to regular traffic do; the exception enables caching of responses, without which destination servers would see an excessive surge of probe requests. [zdx.probes:ssl-exempt]
- links-to references/_meta/text/zdx/zdx.applications.md (ZDX applications: predefined, custom and network applications, and the application API)
- links-to references/_meta/text/zdx/zdx.diagnostics.md (ZDX Diagnostics Sessions (deep traces): what they are and where each part is covered)
- links-to references/_meta/text/zdx/zdx.probes.configuration.md (Configuring end-user Web and Cloud Path probes in the console: fields, defaults, limits and protocols)
- links-to references/_meta/text/zdx/zdx.score.calculation.md (How the ZDX Score is calculated: 5-minute values, hourly lows and rollups per scope)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.md (ZCC forwarding profiles)
- links-to references/_meta/text/zdx/zdx.diagnostics.session-status.md (What a Diagnostics Session's status means, in the console and in the API)
- links-to references/_meta/text/zdx/zdx.probes.cloud-path.md (Reading the Cloud Path: the Hop View and Command Line View, tunnels, protocols, edges, and the error messages)
- links-to references/_meta/text/zdx/zdx.probes.collections.md (ZDX collections: default collections, membership, ranking, criteria, deletion and limits)
- links-to references/_meta/text/zdx/zdx.probes.managed.md (Managed Monitoring and Zscaler Managed Probes: where they run, what they chart and their subscription limits)
- links-to references/_meta/text/zdx/zdx.probes.web-probe-errors.md (Web probe error messages in ZDX: what each reports and what the help suggests)
- links-to references/_meta/text/zia/zia.traffic-forwarding.gre-failover.md (GRE tunnel health checks and failover)
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)
