# ZDX cloud architecture: components, the telemetry path and what is undocumented (zdx.cloud-architecture)
Also called: zdx architecture; zdx central authority; zdx ca; telemetry and policy gateway; tpg; zdx analytics; azure data explorer; adx; zdx admin portal; call quality monitoring; zdx data residency; zdx data retention; zdx telemetry path
Former IDs: zdx-15, zdx-17, zdx-18, zdx-19, zdx-21, zdx-22

This subject lists the ZDX cloud's components as the vendor's architecture page describes them, and what is still open about each.

**Central Authority.** The ZDX Central Authority monitors the cloud and provides a central location for software and database updates as well as policy and configuration settings; the vendor says its design is similar to that of the Internet & SaaS CA. [zdx.cloud-architecture:central-authority] The page does not say whether the ZDX CA runs active and passive servers like the Internet & SaaS CA, [The ZIA CA consists of one active server and two servers in passive standby. The active CA replicates data to both standbys in real time, so any of them can become active at any time, and each server is hosted in a separate location for fault tolerance.](kb:shared.cloud-architecture.central-authority:zia-ca-active-passive), or some other way [gap:zdx.cloud-architecture:ca-topology].

**Client Connector.** Client Connector provides the device metrics at negligible additional CPU consumption, exchanges information with the Telemetry and Policy Gateway to receive ZDX configuration and report metrics, and provides latitude and longitude for geolocation if the operating system's location services are enabled. [zdx.cloud-architecture:client-connector] Whether it buffers metrics while it cannot reach the gateway, and for how long, is not documented [gap:zdx.cloud-architecture:zcc-buffering]. Which users run ZDX at all is the entitlement in [Digital Experience (ZDX) entitlement](kb:zcc.entitlements.zdx).

**Users, departments and locations.** The ZDX cloud connects and authenticates to the Internet & SaaS and Private Access clouds to retrieve users, departments and locations, connects to the Client Connector Portal for integrated management of Client Connector and ZIA definitions, and includes user-definition infrastructure for standalone ZDX deployments without ZIA or ZPA. [zdx.cloud-architecture:zte-integration]

**Telemetry and Policy Gateway.** The Telemetry and Policy Gateway is a multi-tenant RESTful application that acts as a gateway for monitoring metrics, policies and the data lake: Client Connector metrics are sent to Microsoft Azure Data Explorer (ADX) and policies are sent to Client Connector, with a stateless design for scalability. [zdx.cloud-architecture:tpg] On the architecture page the metric path runs from Client Connector through the Telemetry and Policy Gateway to Microsoft Azure Data Explorer; the Internet & SaaS and Private Access clouds appear only as the source of users, departments and locations. [zdx.cloud-architecture:telemetry-path] How the gateway is deployed across regions and fails over is not documented [gap:zdx.cloud-architecture:tpg-failover].

**Analytics.** The ZDX cloud uses the Microsoft Azure Data Explorer (ADX) analytics service. [zdx.cloud-architecture:analytics-adx] Tenant isolation inside the analytics service is not documented [gap:zdx.cloud-architecture:adx-isolation], and neither are retention periods or data-residency options [gap:zdx.cloud-architecture:data-retention-residency].

**Admin portal.** The ZDX Admin Portal gives administrators configuration, reporting, alerting and analysis, integrates with ZIA and ZPA management for centralized configuration, and provides granular role-based access control with single sign-on in the Client Connector Portal. [zdx.cloud-architecture:admin-portal] Which sign-in protocol that single sign-on uses is not stated [gap:zdx.cloud-architecture:admin-sso-protocol].

**Call quality.** The ZDX cloud integrates with the Microsoft Graph API or Zoom to read meeting and call quality data, and customer-specific onboarding is needed before ZDX can read it. [zdx.cloud-architecture:call-quality] Unified communication applications need a tenant onboarded before their probes can be configured, [For unified communication applications a tenant must be onboarded before their probes can be configured; the onboarding articles cover Microsoft Teams, Webex and Zoom call quality.](kb:zdx.applications:uc-tenant-onboarding), and the per-meeting data is read per device, [ZDX call-quality metrics per device and meeting](kb:zdx.devices.call-quality). How often the integration reads and how it fails is not documented [gap:zdx.cloud-architecture:call-quality-data-flow].

**Firewall allowlist.** Certain destination domains are required to be on the allowlist on the corporate firewall or non-Zscaler proxy, including for probes initiated by Zscaler Client Connector and for the monitored information it sends to the Zscaler cloud; if probe traffic is tunneled through a GRE/IPSec tunnel at a corporate location this action might be optional, and the domains are tied to IP addresses so access is allowed per Zscaler cloud. [zdx.cloud-architecture:allowlist-scope] The domains the page lists are gateway., login., mobile. and mtr.<Zscaler Cloud Name>.net and config.zscaler.com/<Zscaler Cloud Name>.net, login.zdxcloud.net, pac.zdxcloud.net, smres.zdxcloud.net, https://d3l44rcogcb7iv.cloudfront.net and https://d32a6ru7mhaq0c.cloudfront.net. [zdx.cloud-architecture:allowlist-domains] The page gives no IP ranges and does not say whether the ZDX domains differ by cloud [gap:zdx.cloud-architecture:allowlist-ip-ranges].

**Reading the data.** The API's estimated collection-to-reporting delay and its small difference from the UI are in [Client Connector collects and reports the telemetry, and the delay from collection to reporting is estimated at 20 minutes, so a full hour of data needs the timestamp adjusted for it.](kb:shared.log-export.zdx:reporting-delay) and [ZDX API data can differ from the ZDX UI by a marginal 2% because aggregated metrics use approximate functions, and a ZDX Score of -1 from the API means no data is available.](kb:shared.log-export.zdx:api-vs-ui). API sign-in is in [The legacy ZDX API needs an API key (key ID and key secret) and the ZDX Advanced Plan; a bearer token lasts 3,600 seconds.](kb:shared.legacy-api.auth-models:zdx-prereqs) and [ZDX API hosts and sign-in: the OneAPI gateway, the direct ZDX host, and which paths go where](kb:zdx.api.hosts-and-auth).

**Module upgrades.** The ZDX Module that Client Connector runs is released and rolled out as described in [ZDX Module upgrades: automatic, delayed, frozen and manual rollout](kb:zdx.cloud-architecture.module-upgrades).

What to check:
1. Whether the device is entitled to ZDX and its Client Connector is reporting, before suspecting the ZDX cloud.
2. Whether the period asked about is older than the estimated collection-to-reporting delay before concluding that data is missing.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.cloud-architecture:telemetry-path] Tier B: Rests on the architecture page naming no ZIA or ZPA component between Client Connector and the analytics store; an absence in one article, not a vendor statement that ZDX telemetry never crosses those clouds.

Not known (open gaps):
- The IP addresses the allowlisted ZDX domains resolve to, and whether they differ by cloud [gap:zdx.cloud-architecture:allowlist-ip-ranges]: settled by support-ticket or source-read. Blocks: writing firewall rules by address rather than by name
- Whether the ZDX Central Authority is active-passive or active-active [gap:zdx.cloud-architecture:ca-topology]: settled by support-ticket or source-read. Blocks: answers about ZDX control-plane availability and failover
- Whether Client Connector buffers ZDX metrics while the gateway is unreachable [gap:zdx.cloud-architecture:zcc-buffering]: settled by lab-test or support-ticket. Blocks: whether a gap in a device's ZDX data after an outage is lost data or delayed data
- How the Telemetry and Policy Gateway is deployed and fails over [gap:zdx.cloud-architecture:tpg-failover]: settled by support-ticket. Blocks: answers about ZDX data loss or delay during a gateway outage
- How tenants are isolated in the ZDX analytics store [gap:zdx.cloud-architecture:adx-isolation]: settled by support-ticket or source-read. Blocks: data-protection and tenancy answers for ZDX telemetry
- ZDX data retention, purge and data residency [gap:zdx.cloud-architecture:data-retention-residency]: settled by support-ticket or source-read. Blocks: retention, GDPR and data-residency answers for ZDX
- Which protocol the ZDX admin single sign-on uses [gap:zdx.cloud-architecture:admin-sso-protocol]: settled by source-read. Blocks: answers about how ZDX administrators sign in
- How the call-quality integrations read data [gap:zdx.cloud-architecture:call-quality-data-flow]: settled by support-ticket or source-read. Blocks: answers about missing or late call-quality data

Area: zdx.cloud-architecture, its subjects in references/_meta/spine/zdx/zdx.cloud-architecture.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.log-export.zdx.md (Getting ZDX data out: the ZDX API, its windows and delays)
- links-to references/_meta/text/shared/shared.cloud-architecture.central-authority.md (The Central Authority: what it holds, and how ZIA and ZPA cluster it differently)
- links-to references/_meta/text/shared/shared.legacy-api.auth-models.md (Legacy (pre-OneAPI) authentication by product)
- links-to references/_meta/text/zcc/zcc.entitlements.zdx.md (Digital Experience (ZDX) entitlement)
- links-to references/_meta/text/zdx/zdx.api.hosts-and-auth.md (ZDX API hosts and sign-in: the OneAPI gateway, the direct ZDX host, and which paths go where)
- links-to references/_meta/text/zdx/zdx.applications.md (ZDX applications: predefined, custom and network applications, and the application API)
- links-to references/_meta/text/zdx/zdx.cloud-architecture.module-upgrades.md (ZDX Module upgrades: automatic, delayed, frozen and manual rollout)
- links-to references/_meta/text/zdx/zdx.devices.call-quality.md (ZDX call-quality metrics per device and meeting)
