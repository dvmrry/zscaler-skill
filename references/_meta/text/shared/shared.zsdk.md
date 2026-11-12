# Zscaler SDK for Mobile Apps (ZSDK): what it is and where it is described (shared.zsdk)
Also called: zsdk; zscaler sdk for mobile apps; zscaler mobile sdk; zsdk admin portal; admin.zsdkone.net; zsdkone.net; zsdk terraform; zsdk api automation

This places ZSDK among the Zscaler products and points to where each part of it is described. ZSDK is a Zero Trust Network Access (ZTNA) security solution designed for consumer mobile applications, managed from the ZSDK Admin Portal; it is designed for native (iOS or Android) and hybrid mobile applications. [shared.zsdk:what-it-is] ZSDK is embedded into the application's source code during development, and it prevents public exposure of the app's APIs and back-end services by rendering them invisible to unauthorized users. [shared.zsdk:embedded-in-app]

**Where it is administered.** An organization is provisioned on one ZSDK cloud and its traffic is processed by that cloud only; the cloud name is in the URL admins log in to, so an organization that logs in to admin.zsdkone.net is on the zsdkone.net cloud. [shared.zsdk:one-cloud] Neither the Go nor the Python Zscaler SDK has a ZSDK product package, and none of the vendored Zscaler Terraform providers (ZIA, ZPA, ZCC, ZTC) manages ZSDK, so ZSDK configuration is done in the ZSDK Admin Portal rather than through these tools. [shared.zsdk:no-automation-surface]

**How it is built.** Components, the tunnel path and App Connector placement are in [ZSDK architecture: Service Edges, App Connectors and the mobile client](kb:shared.zsdk.architecture); the connectors run ZPA's App Connector software ([The ZSDK maintenance guide checks a deployed App Connector through the `zpa-connector` systemd service, which reports itself as the Zscaler Private Access App Connector.](kb:shared.zsdk.architecture:connector-zpa-software); see also [ZPA App Connectors](kb:zpa.app-connectors)), and whether one enrolled connector can serve both products is open [gap:shared.zsdk:zsdk-connectors-vs-zpa].

**Setting it up.** Registered apps, app keys, segment groups and access policy are in [Configuring ZSDK: registered apps and app keys, segments and access policy](kb:shared.zsdk.configuration), and per-organization limits in [ZSDK ranges and limitations per organization](kb:shared.zsdk.limits). Application segments, servers, server groups and device profiles are in [ZSDK application segments, segment groups, servers, server groups, device profiles and configuration graphs](kb:shared.zsdk.applications); token validators and web server certificates in [ZSDK token validators, browser token validators and web server certificates](kb:shared.zsdk.authentication); Browser Access in [ZSDK Browser Access: availability, prerequisites, unsupported features and DNS](kb:shared.zsdk.browser-access); App Connector sizing, keys, groups and enrollment in [ZSDK App Connector sizing, provisioning keys, groups, settings, enrollment and deployment checklist](kb:shared.zsdk.app-connectors); Private Service Edges in [ZSDK Private Service Edges, groups, provisioning keys and enrollment](kb:shared.zsdk.private-service-edges); disaster recovery in [ZSDK disaster recovery: scope, prerequisites, settings and DNS records](kb:shared.zsdk.disaster-recovery); and the Client Monitoring and Global Insights dashboards in [ZSDK Client Monitoring and Global Insights dashboards](kb:shared.zsdk.dashboards).

**In the app.** Packages, platform minimums and sample apps are in [Adding the ZSDK to an app: Android, iOS, React Native and SwiftUI packages, prerequisites and sample apps](kb:shared.zsdk.sdk-integration). Classes, tunnel methods, lifecycle calls and notifications are in [The ZSDK developer API: classes, tunnels, lifecycle and notifications](kb:shared.zsdk.developer-api); error codes from the SDK and from the ZSDK API are in [ZSDK error codes: SDK errors 9001-9505 and ZSDK API errors 2001-2999](kb:shared.zsdk.error-codes).

What to check:
1. Whether the question is about ZSDK (an SDK embedded in a mobile app, administered in its own portal) rather than Client Connector or ZPA, from the admin portal host the organization uses.
2. For automation questions, that no Zscaler SDK or Terraform provider covers ZSDK configuration.

Inferred, not quoted (say so when an answer rests on one):
- [shared.zsdk:no-automation-surface] Tier B: Absence from a search: the Go SDK, Python SDK, MCP server and the ZIA, ZPA, ZCC and ZTC provider repositories were searched at their pins for "zsdk" (case-insensitive); the only hits were binary-looking SVG images and a recorded test cassette, not code or packages. The Go SDK README names the products it covers.

Not known (open gaps):
- Whether one enrolled App Connector can serve both ZSDK and ZPA [gap:shared.zsdk:zsdk-connectors-vs-zpa]: settled by support-ticket or source-read. Blocks: whether an existing ZPA App Connector deployment can be reused for a ZSDK app

Area: shared.zsdk, its subjects in references/_meta/spine/shared/shared.zsdk.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.zsdk.architecture.md (ZSDK architecture: Service Edges, App Connectors and the mobile client)
- links-to references/_meta/text/shared/shared.zsdk.app-connectors.md (ZSDK App Connector sizing, provisioning keys, groups, settings, enrollment and deployment checklist)
- links-to references/_meta/text/shared/shared.zsdk.applications.md (ZSDK application segments, segment groups, servers, server groups, device profiles and configuration graphs)
- links-to references/_meta/text/shared/shared.zsdk.authentication.md (ZSDK token validators, browser token validators and web server certificates)
- links-to references/_meta/text/shared/shared.zsdk.browser-access.md (ZSDK Browser Access: availability, prerequisites, unsupported features and DNS)
- links-to references/_meta/text/shared/shared.zsdk.configuration.md (Configuring ZSDK: registered apps and app keys, segments and access policy)
- links-to references/_meta/text/shared/shared.zsdk.dashboards.md (ZSDK Client Monitoring and Global Insights dashboards)
- links-to references/_meta/text/shared/shared.zsdk.developer-api.md (The ZSDK developer API: classes, tunnels, lifecycle and notifications)
- links-to references/_meta/text/shared/shared.zsdk.disaster-recovery.md (ZSDK disaster recovery: scope, prerequisites, settings and DNS records)
- links-to references/_meta/text/shared/shared.zsdk.error-codes.md (ZSDK error codes: SDK errors 9001-9505 and ZSDK API errors 2001-2999)
- links-to references/_meta/text/shared/shared.zsdk.limits.md (ZSDK ranges and limitations per organization)
- links-to references/_meta/text/shared/shared.zsdk.private-service-edges.md (ZSDK Private Service Edges, groups, provisioning keys and enrollment)
- links-to references/_meta/text/shared/shared.zsdk.sdk-integration.md (Adding the ZSDK to an app: Android, iOS, React Native and SwiftUI packages, prerequisites and sample apps)
- links-to references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors)
