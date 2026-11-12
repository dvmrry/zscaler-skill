# Several server groups on one application segment (zpa.server-groups.multiple-on-segment)
Also called: multiple server groups; weighted load balancing; weightedLbConfig; server group weight; passive server group; which server group handles traffic; two server groups on a segment

Whether a segment may carry several server groups is disputed [divergence:zpa.server-groups.multiple-on-segment:several-server-groups-on-edit], and what decides between them depends on weighted load balancing and on Multimatch.

**Weighted load balancing.** Weighted load balancing on an application segment is configured through a mapping of server groups to a weight and a passive flag. [zpa.server-groups.multiple-on-segment:weighted-lb-mapping] How traffic is spread without it is open [gap:zpa.server-groups.multiple-on-segment:behavior-without-weighted-lb]. What happens when one group is healthy and another broken is open [gap:zpa.server-groups.multiple-on-segment:healthy-and-broken-group].

**Application load balancing.** Ranking server groups by weight with load balancing is a way to ensure application access requests are sent to the App Connectors with server groups that can support their traffic. One use the page gives is validating a new application environment at reduced scale and capacity, then gradually redirecting traffic to it. [zpa.server-groups.multiple-on-segment:lb-purpose] Application load balancing is available only for Public Service Edges for Private Access, and its configuration is not honored for transactions originating from Private Service Edges. [zpa.server-groups.multiple-on-segment:lb-public-service-edges-only] With load balancing, application access requests are routed to App Connectors based on the weights defined for the segment's server groups. All other geo-IP and health-based path selection modes, including Closer to User and Closer to App, are ignored for that segment, and the weight runs from 0, the lightest, to 1,000, the heaviest. [zpa.server-groups.multiple-on-segment:lb-weights-override-path-selection] After the route selection for a load balancing transaction, the same App Connector serves the user for the next 15 minutes, and the expiration is reset each time the same user accesses the same application again. The stickiness ends early when load balancing is disabled, the server group holding the sticky connector is removed from the segment, that group's weight is set to zero, that group is disabled, or the sticky connector is inactive (disconnected, disabled, or in a disabled App Connector group). [zpa.server-groups.multiple-on-segment:lb-stickiness] Transactions routed by load balancing do not consider application health. For applications with on-access health monitoring routed this way, application health is not generated and the applications are not shown in the Health dashboard. [zpa.server-groups.multiple-on-segment:lb-ignores-app-health]

**Passive groups.** Traffic requests are routed to the App Connectors in a passive server group when the active group has failed the health monitoring threshold of 50% unhealthy connectors. Failover to the passive group needs less than 50% of the active group's connectors healthy and more than 50% of the passive group's healthy; switching back needs less than 50% of the passive group's healthy and more than 50% of the active group's. [zpa.server-groups.multiple-on-segment:lb-passive-failover] App Connector groups should not overlap within the server groups; if they do, the same App Connector can be selected as active and passive groups per the weights and mode of selection. [zpa.server-groups.multiple-on-segment:lb-no-overlapping-connector-groups] A server group moved to a new Microtenant needs its load balancing weight reassigned. [zpa.server-groups.multiple-on-segment:lb-microtenant-move] The split between weighted non-passive groups and the meaning of a healthy connector are open [gap:zpa.server-groups.multiple-on-segment:weighted-split-and-healthy].

**Multimatch.** When both a wildcard and a specific FQDN application segment have Multimatch enabled, the specific FQDN segment's server group is used for App Connector selection even if the traffic matches the wildcard rule. [zpa.server-groups.multiple-on-segment:multimatch-specific-fqdn-server-group] Multimatch application segments for the same FQDN with different ports must all use the same server group; with different server groups any of them can be chosen at random to proxy the traffic. [zpa.server-groups.multiple-on-segment:multimatch-same-fqdn-same-server-group]

How the segment itself is chosen when several segments match is in [Segment matching and policy search with and without Multimatch](kb:zpa.policy.multimatch).

What to check:
1. Whether weighted load balancing is enabled on the segment and which weight and passive flag each server group carries.
2. Whether the segment is a Multimatch segment, in which case the specific FQDN segment's server group is used and sibling segments for the same FQDN must share one server group.
3. Whether load balancing is on, whether the transaction came from a Private Service Edge, and whether a sticky connector or a passive group explains which App Connector served the user.
4. Whether a statement that a segment keeps several server groups rests on the editing page's advice to save only one.
5. Whether the behavior without weighted load balancing is being relied on; no source states it.

Sources disagree (name both sides):
- Whether an application segment may keep several server groups [divergence:zpa.server-groups.multiple-on-segment:several-server-groups-on-edit]
  - zscaler-help: When editing, only one server group should be saved, because several server groups mapped to one segment can cause the console to disconnect.
  - zscaler-help: Load balancing selects several server groups for a segment and ranks them by weight.
  - sdk-go: The Go SDK segment model carries a list of server group mappings with weights and passive flags.
  Impact: The editing page advises saving one server group, while the load balancing page and the SDK model treat a list of server groups on one segment as a configuration. Neither page says the editing advice is limited to segments without load balancing, so a statement that a segment holds several server groups, or that it should hold one, rests on one side of this.

Not known (open gaps):
- How traffic splits between weighted non-passive server groups, what a healthy connector is, and how load balancing fits the Multimatch same-server-group rule [gap:zpa.server-groups.multiple-on-segment:weighted-split-and-healthy]: settled by lab-test or support-ticket
- How traffic is spread across several server groups when weighted load balancing is not configured [gap:zpa.server-groups.multiple-on-segment:behavior-without-weighted-lb]: settled by lab-test or support-ticket
- What happens when one of several server groups is healthy and another is broken [gap:zpa.server-groups.multiple-on-segment:healthy-and-broken-group]: settled by lab-test

Area: zpa.server-groups, its subjects in references/_meta/spine/zpa/zpa.server-groups.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups), from zpa.server-groups: A server group's App Connector groups are the groups that have access to the data center or VPC containing the servers in that server group. [zpa.server-groups.connector-binding:connector-groups-reach-servers]
- scoped-by references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments), from zpa.server-groups: When an application segment is configured, the server group that contains the servers hosting its applications must be identified. [zpa.server-groups.role:segment-names-server-group]
- interacts-with references/_meta/text/zpa/zpa.app-segments.multimatch.md (Multimatch: one request matching several application segments): When both a wildcard and a specific FQDN application segment have Multimatch enabled, the specific FQDN segment's server group is used for App Connector selection even if the traffic matches the wildcard rule. [zpa.server-groups.multiple-on-segment:multimatch-specific-fqdn-server-group]
- interacts-with references/_meta/text/zpa/zpa.policy.md (ZPA policy evaluation), from zpa.server-groups: An access policy rule can be set to specific App Connector groups, server groups, or a mixture of both, instead of all App Connector groups for the application. [zpa.server-groups.role:rule-can-name-connector-or-server-groups]
- links-to references/_meta/text/zpa/zpa.policy.multimatch.md (Segment matching and policy search with and without Multimatch)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/application-segments.md (config type)
- see-also references/_meta/text/zpa/zpa.server-groups.role.md (What a server group is and what selects it)
- see-also references/_meta/text/zpa/zpa.server-groups.chain-check.md (Checking the segment to server group to connector chain)
