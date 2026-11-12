# What a server group is and what selects it (zpa.server-groups.role)
Also called: what is a server group; server group purpose; server group vs connector group; which connector group serves this segment; app connector selection method

A server group is one of two grouping objects on an application segment, and it governs delivery rather than policy scoping.

**Where it attaches.** When an application segment is configured, the server group that contains the servers hosting its applications must be identified. [zpa.server-groups.role:segment-names-server-group] The Python SDK documents `server_group_ids` as required when creating an application segment. [zpa.server-groups.role:python-segment-requires-server-groups] A server group paired with servers maps applications to specific servers and to App Connector groups. [zpa.server-groups.role:server-group-pairs-servers-and-connectors]

**What selects the connector.** With Multimatch disabled, App Connector selection is primarily based on the application segment's server group configuration. [zpa.server-groups.role:selection-follows-segment-server-group] The selection that follows the segment's server group can be overridden in an access policy. [zpa.server-groups.role:selection-can-be-overridden-in-policy] An access policy rule can be set to specific App Connector groups, server groups, or a mixture of both, instead of all App Connector groups for the application. [zpa.server-groups.role:rule-can-name-connector-or-server-groups] On the global rules and policy groups configuration page an access rule's Connector Selection Method is All App Connector groups for the application or Specific App Connector or Server groups for the application, and Extranet Resources appears in these options if the organization has the Extranet Application Support feature enabled. [zpa.server-groups.role:global-rule-connector-selection] On the global rules and policy groups configuration page the maximum limit of selected App Connector groups is 48, and if All App Connector groups for the application is selected and more than 48 are configured for the organization only 48 are used; the limit applies to newly created or edited policy rules after March 4, 2024. [zpa.server-groups.role:connector-group-cap-48] On the global rules and policy groups configuration page there is a maximum of 10 location groups and 50 locations per policy for extranet. [zpa.server-groups.role:extranet-selection-limits] How the group's own connector list is defined is in [How a server group binds App Connector groups](kb:zpa.server-groups.connector-binding).

**Open points.** Whether a server group is consulted only at brokering and never during policy evaluation is unsourced [gap:zpa.server-groups.role:brokering-vs-policy-split]. What `ipAnchored` does on a server group is not documented [gap:zpa.server-groups.role:ip-anchored-effect].

**Limits.** A tenant can hold up to 1,000 server groups and up to 10,000 explicitly defined servers. [zpa.server-groups.role:limits]

What to check:
1. Which server groups the application segment names, since the segment is where a server group is attached.
2. Whether the access policy rule that matched sets its own App Connector or server groups, which can override the segment's.
3. Whether the claim that a server group is not consulted during policy evaluation is being relied on; it has no source.

Not known (open gaps):
- Whether a server group is consulted only at connection brokering and never during access policy evaluation [gap:zpa.server-groups.role:brokering-vs-policy-split]: settled by lab-test. Blocks: saying where in the request path a bad server group assignment is detected
- What ipAnchored does on a server group [gap:zpa.server-groups.role:ip-anchored-effect]: settled by lab-test or support-ticket

Area: zpa.server-groups, its subjects in references/_meta/spine/zpa/zpa.server-groups.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups): A server group paired with servers maps applications to specific servers and to App Connector groups. [zpa.server-groups.role:server-group-pairs-servers-and-connectors]
- scoped-by references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments): When an application segment is configured, the server group that contains the servers hosting its applications must be identified. [zpa.server-groups.role:segment-names-server-group]
- interacts-with references/_meta/text/zpa/zpa.app-connectors.selection.md (How a session is assigned to an App Connector): With Multimatch disabled, App Connector selection is primarily based on the application segment's server group configuration. [zpa.server-groups.role:selection-follows-segment-server-group]
- interacts-with references/_meta/text/zpa/zpa.policy.md (ZPA policy evaluation), from zpa.server-groups: An access policy rule can be set to specific App Connector groups, server groups, or a mixture of both, instead of all App Connector groups for the application. [zpa.server-groups.role:rule-can-name-connector-or-server-groups]
- interacts-with references/_meta/text/zpa/zpa.policy.criteria.md (Criteria available on ZPA access policy rules): The selection that follows the segment's server group can be overridden in an access policy. [zpa.server-groups.role:selection-can-be-overridden-in-policy]
- links-to references/_meta/text/zpa/zpa.server-groups.connector-binding.md (How a server group binds App Connector groups)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/server-groups.md (config type)
- configured-via references/_meta/text/types/zpa/application-segments.md (config type)
- see-also references/_meta/text/zpa/zpa.server-groups.discovery-mode.md (Dynamic discovery versus explicit servers on a server group)
- see-also references/_meta/text/zpa/zpa.server-groups.multiple-on-segment.md (Several server groups on one application segment)
