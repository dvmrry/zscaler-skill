# Source IP Anchoring across ZIA and Private Access: path, pieces and interactions (shared.source-ip-anchoring)
Also called: source ip anchoring; sipa; sipa not working; wrong egress ip with sipa; app connector egress ip; sipa troubleshooting; zia service edge client type

Source IP Anchoring is configured in both ZIA and Private Access, and the two sides have to agree. An anchored request goes from the client to a ZIA Public Service Edge, through the ZIA threat and data protection engines, and then, by a forwarding rule with the ZPA method, through the Private Access gateway to an App Connector; the destination sees the App Connector's address. [shared.source-ip-anchoring:traffic-path] The technology behind Source IP Anchoring is also used for data protection and threat scanning of Private Access traffic. [shared.source-ip-anchoring:also-for-pa-traffic]

## The pieces

- **Both sides, step by step.** Segment settings, client forwarding and access rules, the ZIA forwarding rule and the Z-Tunnel 1.0 option are in [Source IP Anchoring: what it needs on each side](kb:zia.forwarding-control.sipa).
- **Gateway.** The Private Access gateway object the ZIA rule forwards to: [The Private Access gateway object in ZIA](kb:zia.forwarding-control.zpa-gateway).
- **DNS.** The ZPA resolver rules, their order, and why client DNS must reach Zscaler: [Predefined DNS Control rules and the ZPA resolvers](kb:zia.dns-control.predefined-rules).
- **Rule scope.** User conditions on the forwarding rule need an Advanced Firewall subscription [Any Forwarding Control policy, including Source IP Anchoring, that uses user conditions (users, groups, departments or device groups) requires an Advanced Firewall subscription.](kb:zia.forwarding-control.rules:subscription).
- **Subscriptions.** The help says no Private Access license is needed [Source IP Anchoring does not need a Private Access license, but a Source IP Anchoring subscription is required.](kb:zia.forwarding-control.sipa:licensing), while the reference architecture says this model needs both ZIA and ZPA subscriptions [divergence:shared.source-ip-anchoring:subscriptions].

Why domain-based and IP-based segments take different rule shapes is open [gap:shared.source-ip-anchoring:rule-shape-rationale]; the raw-IP part follows from Client Connector's DNS interception: [A connection made to a raw IP address sends no DNS request, so Client Connector's DNS interception never hands it a synthetic address: a segment defined only by FQDN does not capture it, and Private Access carries it only if an IP-based segment covers that address.](kb:zpa.app-segments.matching:raw-ip-no-dns-interception). Zscaler says not to add SAML or SCIM user criteria to the access rule when the ZIA side scopes users [If Source IP Anchoring traffic is restricted to certain users in the Zscaler Admin Console, do not add user-based SAML/SCIM criteria to the access policy for the Source IP Anchoring application segment.](kb:zia.forwarding-control.sipa:no-user-criteria); what goes wrong if you do is open [gap:shared.source-ip-anchoring:user-criteria-mechanism].

**Microsoft 365.** The Conditional Access use case and its login-only scope are in [Conditional Access blocks users behind ZIA: Source IP Anchoring](kb:zia.saas-apps.conditional-access), and its setup in [Configuring Source IP Anchoring for Microsoft 365 sign-in](kb:shared.m365.sipa-setup). That setup page and the general page give different client forwarding actions for the same kind of segment [shared.m365.sipa-setup:client-forwarding-rules](kb:shared.m365.sipa-setup:client-forwarding-rules).

**ZIA disaster recovery.** The Private Access rules change for the duration of the event: [Source IP Anchoring Direct during ZIA disaster recovery](kb:zia.forwarding-control.sipa-direct).

## What changes on an anchored segment

- **Country criteria.** Private Access takes the country of anchored traffic from the ZIA Public Service Edge's address [For Cloud Connectors, Source IP Anchoring traffic and Private Access multi-hop, the country criterion uses the last NATed layer 3 public IP address, so SIPA traffic takes its country from the Internet & SaaS Public Service Edge's public IP.](kb:zpa.policy.criteria:country-last-nat-ip).
- **SSL Inspection.** The ZPA Application Segment criterion lists only anchored segments [The ZPA Application Segment criterion lists only segments that have Source IP Anchor enabled (up to 255 selectable); in the API it is the `zpaAppSegments` list, documented as Source IP Anchoring-enabled segments.](kb:zia.ssl-inspection.criteria:zpa-segments-sipa-only).
- **DNS Control.** Resolve by ZPA applies only to anchored segments [Resolve by ZPA applies only to Private Access application segments that have Source IP Anchoring enabled, and takes an IP pool configured for location or remote-user traffic.](kb:zia.dns-control.actions:resolve-by-zpa-scope).
- **Multimatch.** Not supported for anchored applications [Multimatch is not supported for applications that have Source IP Anchoring enabled, and with Multimatch enabled the Health Reporting of an application segment can only be On Access or None.](kb:zpa.app-segments.multimatch-requirements:sipa-health-reporting) [Multimatch must be disabled if the configuration contains applications using Double Encryption and Source IP Anchor.](kb:zpa.app-segments.multimatch-requirements:double-encryption-sipa-disable).
- **Double Encryption and ZIA inspection.** Neither can be combined with the Source IP Anchor option [Double Encryption cannot be enabled when Browser Access or Source IP Anchoring is selected for any application, and should be disabled for extranet application segments.](kb:zpa.app-segments.settings:double-encryption-exclusions) [Source IP Anchor and Inspect Traffic with ZIA cannot both be enabled on a segment; Source IP Anchor must be disabled first.](kb:zpa.app-segments.settings:sipa-inspect-zia-exclusive); Browser Access is open [Whether Source IP Anchor and Browser Access can be combined on a segment](kb:zpa.app-segments.settings:sipa-browser-access).
- **Virtual Service Edges.** Source IP Anchoring is not supported there [The Source IP Anchoring feature is not supported with Virtual Service Edges.](kb:zia.virtual-service-edge.limits:no-sipa).

**Protocols.** RTSP and most ICMP are out [Source IP Anchoring does not support RTSP. It supports ICMP only on ICMP-enabled Private Access application segments, only echo requests or responses, not traceroute, with a maximum ICMP payload of 990 bytes.](kb:zia.forwarding-control.sipa:protocol-limits). Because Source IP Anchoring does not support ICMP traceroute, the help says to use Digital Experience (ZDX) to trace the path of the traffic. [shared.source-ip-anchoring:traceroute-zdx]

**Related but different.** A fixed egress address without App Connectors comes from Dedicated IP: [A fixed egress address: Source IP Anchoring, Dedicated IP or BYOIP](kb:shared.source-ip-anchoring.egress-options). Surrogate IP maps a private address to a user and does not change the egress address: [Surrogate IP: mapping a private IP to an authenticated user](kb:zia.authentication.surrogate-ip).

**Open.** What happens when every connector behind the gateway is down is open [Behavior when the gateway's server group has no healthy connectors](kb:zia.forwarding-control.sipa:unhealthy-connectors). Whether anchoring can loop when the destination is itself an anchored segment is open [gap:shared.source-ip-anchoring:forwarding-loop], and so is whether the usual connector selection [How a session is assigned to an App Connector](kb:zpa.app-connectors.selection) applies to anchored flows [gap:shared.source-ip-anchoring:connector-selection].

What to check:
1. On the Private Access segment: Source IP Anchor on, and Use Client Forwarding Policy under Bypass.
2. Client forwarding rules match the segment kind: Only Forward Allowed Applications for IP-based; Bypass ZPA for other client types and Forward to ZPA for ZIA Service Edge for domain-based.
3. The access policy allows the ZIA Service Edge client type, with no SAML or SCIM user criteria when ZIA scopes users.
4. The ZIA forwarding rule uses the ZPA method, names the anchored segments and a gateway they share.
5. Both ZPA resolver DNS rules are enabled, Road Warrior above Locations, and client DNS reaches Zscaler.
6. For Z-Tunnel 1.0 users, Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors is on.
7. If ZIA is in disaster recovery, the Source IP Anchoring Direct rules are in place, and reverted afterwards.
8. For a path or reachability test, use ICMP echo only and ZDX for the path, not traceroute.

Inferred, not quoted (say so when an answer rests on one):
- [shared.source-ip-anchoring:traffic-path] Tier B: Assembled from three pages; no single vendor page draws the whole path. Which other ZIA modules act before forwarding is open in zia.forwarding-control:pipeline-position.

Sources disagree (name both sides):
- Whether Source IP Anchoring needs a Private Access (ZPA) subscription. [divergence:shared.source-ip-anchoring:subscriptions]
  - zscaler-help: No Private Access license is needed; a Source IP Anchoring subscription is.
  - zscaler-help: The Source IP Anchoring model requires both ZIA and ZPA subscriptions.
  Impact: A licensing answer taken from the reference architecture adds a ZPA subscription the help says is not required; the help article is the more specific and is backed by the setup steps for using Private Access solely for anchoring. Confirm with the account team.

Not known (open gaps):
- Why domain-based and IP-based segments take different rule shapes [gap:shared.source-ip-anchoring:rule-shape-rationale]: settled by support-ticket or lab-test. Blocks: explaining what Client Connector users see for an anchored segment and handling a segment with both domains and addresses
- Why user criteria on the anchored segment's access rule break anchoring [gap:shared.source-ip-anchoring:user-criteria-mechanism]: settled by lab-test or support-ticket. Blocks: diagnosing anchored traffic denied on the Private Access side
- Whether anchored forwarding can loop [gap:shared.source-ip-anchoring:forwarding-loop]: settled by lab-test or support-ticket. Blocks: predicting the result of overlapping anchored segments
- How an App Connector is chosen for an anchored flow [gap:shared.source-ip-anchoring:connector-selection]: settled by lab-test or support-ticket. Blocks: predicting which egress address a destination sees when the server group has several connectors

Area: shared.source-ip-anchoring, its subjects in references/_meta/spine/shared/shared.source-ip-anchoring.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.forwarding-control.sipa.md (Source IP Anchoring: what it needs on each side): With Source IP Anchoring the destination sees the IP address of the Private Access App Connector deployed for it as the source. Traffic goes through the intranet to internal destination servers and through the internet to external ones. [zia.forwarding-control.sipa:purpose]
- links-to references/_meta/text/zpa/zpa.app-segments.settings.md (Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring)
- interacts-with references/_meta/text/zia/zia.saas-apps.conditional-access.md (Conditional Access blocks users behind ZIA: Source IP Anchoring): Source IP Anchoring addresses Microsoft 365 Conditional Access that lets users in only from a trusted location such as a corporate network (with multifactor authentication) and blocks other locations; anchoring associates the traffic with the trusted location. [zia.saas-apps.conditional-access:ca-use-case]
- interacts-with references/_meta/text/zpa/zpa.app-connectors.selection.md (How a session is assigned to an App Connector): An anchored request goes from the client to a ZIA Public Service Edge, through the ZIA threat and data protection engines, and then, by a forwarding rule with the ZPA method, through the Private Access gateway to an App Connector; the destination sees the App Connector's address. [shared.source-ip-anchoring:traffic-path]
- links-to references/_meta/text/shared/shared.m365.sipa-setup.md (Configuring Source IP Anchoring for Microsoft 365 sign-in)
- links-to references/_meta/text/zpa/zpa.app-segments.multimatch-requirements.md (Multimatch prerequisites, restrictions and App Connector selection)
- links-to references/_meta/text/shared/shared.source-ip-anchoring.egress-options.md (A fixed egress address: Source IP Anchoring, Dedicated IP or BYOIP)
- links-to references/_meta/text/zia/zia.authentication.surrogate-ip.md (Surrogate IP: mapping a private IP to an authenticated user)
- links-to references/_meta/text/zia/zia.dns-control.actions.md (DNS Control actions and what each API action requires)
- links-to references/_meta/text/zia/zia.dns-control.predefined-rules.md (Predefined DNS Control rules and the ZPA resolvers)
- links-to references/_meta/text/zia/zia.forwarding-control.rules.md (Forwarding Control rule criteria, limits and ordering)
- links-to references/_meta/text/zia/zia.forwarding-control.sipa-direct.md (Source IP Anchoring Direct during ZIA disaster recovery)
- links-to references/_meta/text/zia/zia.forwarding-control.zpa-gateway.md (The Private Access gateway object in ZIA)
- links-to references/_meta/text/zia/zia.ssl-inspection.criteria.md (SSL/TLS inspection rule criteria and the ones that silently don't match)
- links-to references/_meta/text/zia/zia.virtual-service-edge.limits.md (What a Virtual Service Edge does not support)
- links-to references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap)
- links-to references/_meta/text/zpa/zpa.policy.criteria.md (Criteria available on ZPA access policy rules)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/forwarding-rules.md (config type)
- configured-via references/_meta/text/types/zia/zpa-gateways.md (config type)
