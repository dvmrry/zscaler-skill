# ZIA Advanced Settings page: its sections, three settings explained here, and where other sections are routed (zia.advanced-settings)
Also called: Advanced Settings; advanced settings page; Admin Ranking; Admin Portal Session Timeout; Real Time Risk Score Updates

On the Advanced Settings page in the Zscaler Admin Console, an admin can configure settings for a variety of Zscaler service features. The page's sections include Admin Ranking, Advanced Web App Control Options, Kerberos Authentication Exemptions, Digest Authentication Exemptions, Policy for Unauthenticated Traffic, HTTP Tunnel Control, Domain Fronting, Office 365 One Click Configuration, Admin Portal Session Timeout, Internal IP Logging, Windows App Traffic Authentication, Partial Configuration Handling Mechanism (SWG & Firewall), Traffic Forwarded to ZPA to ZIA, Settings for DNS Optimization for IPv6, Firewall Settings for Z-Tunnel 1.0 and PAC (Road Warriors), Enable EDNS Client Subnet (ECS) Option and Real Time Risk Score Updates. [zia.advanced-settings:page-scope]

**Settings explained on this page.** Enable Admin Ranking is for an organization that wants to rank administrators and use the ranks when managing policies. [zia.advanced-settings:admin-ranking] The UI Session Timeout Duration sets how long admins can be inactive in the Zscaler Admin Console before they must log in again, and the API Session Timeout Duration sets how long an API-initiated Admin Console session can be inactive before it must be reauthenticated. All active sessions are forced to reauthenticate after a continuous login period of 720 minutes (12 hours) that is not configurable. [zia.advanced-settings:session-timeouts] Real Time Risk Score Updates, when enabled, allows Public Service Edges for Internet & SaaS to track activities that might increase user risk in real time. [zia.advanced-settings:real-time-risk]

**Settings routed to their own subjects.**
- **Partial Configuration Handling Mechanism.** [Behavior When Partial Configuration Available: Fail Open, Fail Closed and Best Effort Policies](kb:zia.advanced-settings.partial-configuration).
- **HTTP Tunnel Control and Domain Fronting.** [HTTP CONNECT tunnel control and the domain fronting blocks in Advanced Settings](kb:zia.advanced-settings.http-tunnel-control).
- **DNS optimization.** [DNS optimization: proxy-side DNS lookup that overrides the client-resolved IP](kb:zia.advanced-settings.dns-optimization).
- **Authentication exemptions, Policy for Unauthenticated Traffic and Windows App Traffic Authentication.** [Destinations that skip authentication](kb:zia.authentication.exemptions), [What happens to traffic with no user identity](kb:zia.authentication.unauthenticated-traffic) and [Surrogate IP: mapping a private IP to an authenticated user](kb:zia.authentication.surrogate-ip).
- **Firewall settings and custom ports.** [ZIA Firewall Control](kb:zia.firewall) and [Where the firewall sits in the traffic path](kb:zia.firewall.traffic-path).
- **EDNS Client Subnet.** [EDNS Client Subnet (ECS) injection and ECS prefix objects](kb:zia.dns-control.ecs).
- **Internal IP Logging and cascading to URL filtering.** [Proxy chaining to ZIA: setup, XFF handling and limits](kb:zia.traffic-forwarding.proxy-chaining) and [Cloud App Control versus URL Filtering: which applies](kb:zia.cloud-app-control.precedence).
- **Office 365 One Click Configuration.** [Microsoft 365 One Click configurations: the two options, where each is set, and the DNS Control rule](kb:zia.advanced-settings.m365-one-click).
- **Advanced Web App Control Options and Traffic Forwarded to ZPA to ZIA.** No subject explains these sections yet, and the Insert XFF Header for ZPA Traffic setting is not explained in [The Private Access gateway object in ZIA](kb:zia.forwarding-control.zpa-gateway) [gap:zia.advanced-settings:unrouted-sections].
- **The API fields and the URL filtering page.** [Advanced settings: SNI handling lists and a misdocumented global SSL bypass setting](kb:zia.api.advanced-settings-wire) and [Advanced URL Filtering settings that change outcomes](kb:zia.url-filtering.advanced-settings).

Not known (open gaps):
- Which subjects explain Advanced Web App Control Options, Traffic Forwarded to ZPA to ZIA and Insert XFF Header for ZPA Traffic [gap:zia.advanced-settings:unrouted-sections]: settled by source-read

Area: zia.advanced-settings, its subjects in references/_meta/spine/zia/zia.advanced-settings.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.advanced-settings.dns-optimization.md (DNS optimization: proxy-side DNS lookup that overrides the client-resolved IP)
- links-to references/_meta/text/zia/zia.advanced-settings.http-tunnel-control.md (HTTP CONNECT tunnel control and the domain fronting blocks in Advanced Settings)
- links-to references/_meta/text/zia/zia.advanced-settings.m365-one-click.md (Microsoft 365 One Click configurations: the two options, where each is set, and the DNS Control rule)
- links-to references/_meta/text/zia/zia.advanced-settings.partial-configuration.md (Behavior When Partial Configuration Available: Fail Open, Fail Closed and Best Effort Policies)
- links-to references/_meta/text/zia/zia.api.advanced-settings-wire.md (Advanced settings: SNI handling lists and a misdocumented global SSL bypass setting)
- links-to references/_meta/text/zia/zia.authentication.exemptions.md (Destinations that skip authentication)
- links-to references/_meta/text/zia/zia.authentication.surrogate-ip.md (Surrogate IP: mapping a private IP to an authenticated user)
- links-to references/_meta/text/zia/zia.authentication.unauthenticated-traffic.md (What happens to traffic with no user identity)
- links-to references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies)
- links-to references/_meta/text/zia/zia.dns-control.ecs.md (EDNS Client Subnet (ECS) injection and ECS prefix objects)
- links-to references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control)
- links-to references/_meta/text/zia/zia.firewall.traffic-path.md (Where the firewall sits in the traffic path)
- links-to references/_meta/text/zia/zia.forwarding-control.zpa-gateway.md (The Private Access gateway object in ZIA)
- links-to references/_meta/text/zia/zia.traffic-forwarding.proxy-chaining.md (Proxy chaining to ZIA: setup, XFF handling and limits)
- links-to references/_meta/text/zia/zia.url-filtering.advanced-settings.md (Advanced URL Filtering settings that change outcomes)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/advanced-settings.md (config type)
