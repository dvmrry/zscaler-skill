# The hops of a ZPA access request and where each can fail (zpa.troubleshooting.access-path)
Also called: zpa access path; zpa request flow; microtunnel path; connector eligibility vs selection; where can zpa fail

A request crosses the client, a Service Edge, the connector and the server, and connector choice is made before any connector-to-server hop.

**The channel.** A Microtunnel is an end-to-end channel that is created on demand between Zscaler Client Connector and an internal application, through a Public or Private Service Edge and an App Connector. [zpa.troubleshooting.access-path:mtunnel-path] Public Service Edges and Private Service Edges enforce user policies and provide secure transport to App Connectors. [zpa.troubleshooting.access-path:edges-enforce-policy] The Central Authority provides a central location for software and database updates and for policy and configuration settings, and policy is distributed across all of its components. [zpa.troubleshooting.access-path:ca-distributes]

**Choosing the connector.** [Private Access selects the closest App Connector given the location of the user and the App Connector-to-application latency.](kb:zpa.app-connectors.selection:closest-by-location-and-latency) Whether eligibility filtering comes before latency selection is not sourced [How a session is assigned to an App Connector](kb:zpa.app-connectors.selection).

**Reading a record by connector.** What an empty connector means is in [How a session is assigned to an App Connector](kb:zpa.app-connectors.selection), and reading a closed session by connector assignment is open [How a session is assigned to an App Connector](kb:zpa.app-connectors.selection).

What to check:
1. Which hop the evidence points at: client, Service Edge, selection, connector to server.
2. Whether the record has a connector before suspecting the connector-to-server hop, remembering a zero connector ID also occurs for APP_NOT_REACHABLE and INVALID_DOMAIN.
3. What the metrics log says about alive targets for the connectors that serve the application.
4. Which connector the request was routed to and the 15-minute affinity of an active user.

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.app-connectors.selection.md (How a session is assigned to an App Connector)
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types): Public Service Edges and Private Service Edges enforce user policies and provide secure transport to App Connectors. [zpa.troubleshooting.access-path:edges-enforce-policy]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.troubleshooting.log-fields.md (What the ZPA User Activity log fields say when diagnosing access: outcome and status codes, timing phases, bytes)
- see-also references/_meta/text/zpa/zpa.troubleshooting.segment-checks.md (Checking segments, segment groups and connector groups for a failing application)
