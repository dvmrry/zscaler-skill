# Checking segments, segment groups and connector groups for a failing application (zpa.troubleshooting.segment-checks)
Also called: zpa segment verification; segment not in segment group; wildcard segment shadowing; carved out specific segment; zpa connector group reachability; incomplete configuration icon

The segment layer is checked from the destination inward: the segment, its group, its server groups and the connectors behind them.

**Segment.** The match rules are in [Granularity is judged on the domain or address: an exact host is more specific than a wildcard that contains it, and for IPs a /32 host is more specific than the /24 that contains it.](kb:zpa.app-segments.matching:granularity-ranking), Bypass in [If the same FQDN is defined in multiple application segments and one of them has Bypass set to Always, that application segment takes precedence.](kb:zpa.app-segments.bypass:same-fqdn-always), Multimatch in [Multimatch: one request matching several application segments](kb:zpa.app-segments.multimatch).

**Segment group.** Membership is in [Which application segments belong to a segment group](kb:zpa.segment-groups.membership) and policy use in [A rule's application criterion is satisfied when the requested application segment, or the segment group that holds it, is one the rule names.](kb:zpa.segment-groups.policy-use:criterion-checks-segment-or-group). On the segment group page, if required fields are missing an Incomplete Configuration icon appears next to the indicated item. [zpa.troubleshooting.segment-checks:incomplete-icon] A segment created without a group is open [What the service does with a segment created without a segment group](kb:zpa.segment-groups.membership:omitted-segment-group-id).

**Server group and connector group.** The chain is in [Application segments reference server groups, and server groups reference App Connector groups.](kb:zpa.app-connectors.connector-groups:segment-server-group-chain). That a group with no key or server group serves nothing and is not flagged is not sourced [gap:zpa.troubleshooting.segment-checks:group-without-key-or-server-group].

**Configuration graph.** A configuration graph shows how configuration objects are connected: a segment group, application segment, server group, App Connector group and App Connector. Where one of them shows an Incomplete Configuration icon, the Configuration Graph icon opens the graph, where each connected object can be edited. The graph is reachable from the pages the article lists, which include Defined Application Segments. [zpa.troubleshooting.segment-checks:configuration-graph]

**Connectors.** Health is in [The App Connectors page shows each connector's Connection Health as Connected or Disconnected, separately from its Status (enabled or disabled).](kb:zpa.app-connectors.health:connection-health-column).

What to check:
1. The exact FQDN and port the user requested against the segments that contain the FQDN, and which one is the most granular.
2. Whether the destination port is in the winning segment, since a port miss is bypassed or dropped at the client.
3. Whether a specific-FQDN segment was added for a host the wildcard segment used to cover, which removes the host from the wildcard segment for the ports the specific segment does not list.
4. Whether any segment for the same FQDN has Bypass set to Always.
5. That the segment is in a segment group, that it is in only one, and that the group is complete.
6. That the rule meant to allow the user names the segment or the segment group that holds it.
7. Which connector groups serve the segment through its server groups, and whether at least one connector in each is connected.
8. Whether a connector that can reach the cloud reports the targets of the application as alive.

Not known (open gaps):
- A connector group with no server group or provisioning key [gap:zpa.troubleshooting.segment-checks:group-without-key-or-server-group]: settled by lab-test or operator-experience

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.segment-groups.membership.md (Which application segments belong to a segment group): Every application segment you configure must be placed in a segment group, which is what allows access policies to be configured on segment groups. [zpa.segment-groups.membership:required-for-every-segment]
- interacts-with references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap): Granularity is judged on the domain or address: an exact host is more specific than a wildcard that contains it, and for IPs a /32 host is more specific than the /24 that contains it. [zpa.app-segments.matching:granularity-ranking]
- links-to references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups)
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)
- links-to references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks)
- links-to references/_meta/text/zpa/zpa.app-segments.multimatch.md (Multimatch: one request matching several application segments)
- links-to references/_meta/text/zpa/zpa.segment-groups.policy-use.md (How access policy rules use segment groups)
