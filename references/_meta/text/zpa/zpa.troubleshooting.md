# Troubleshooting ZPA access: from symptom to layer (zpa.troubleshooting)
Also called: user cannot reach app; zpa access troubleshooting; zpa app not reachable; zpa intermittent failures; zpa slow application; zpa step-up loop; why is zpa blocking; zpa verification workflow

A report that a user cannot reach a private application is worked from the symptom to the layer that holds the evidence.

1. **The user cannot reach the application at all.** [A user cannot reach a private application at all](kb:zpa.troubleshooting.no-access).
2. **Failures come and go.** [Intermittent ZPA access failures](kb:zpa.troubleshooting.intermittent).
3. **The application is slow.** [A ZPA application is slow](kb:zpa.troubleshooting.slow).
4. **Authentication fails or a step-up prompt loops.** [Authentication failures and step-up prompt loops in ZPA](kb:zpa.troubleshooting.authentication).

**Layers**
- **The path a request takes.** [The hops of a ZPA access request and where each can fail](kb:zpa.troubleshooting.access-path).
- **Segment, group and connector reachability.** [Checking segments, segment groups and connector groups for a failing application](kb:zpa.troubleshooting.segment-checks).
- **Policy match, forwarding, posture and timeouts.** [Checking policy match, forwarding, posture and timeout for a blocked user](kb:zpa.troubleshooting.policy-checks).
- **Certificates and encryption.** [Certificate and encryption failures: Browser Access, double encryption, pinned clients](kb:zpa.troubleshooting.certificates).

**Evidence**
- **Where to look.** [Where ZPA access evidence lives: console, client, connector, log streaming](kb:zpa.troubleshooting.signals).
- **What the User Activity log fields say.** [What the ZPA User Activity log fields say when diagnosing access: outcome and status codes, timing phases, bytes](kb:zpa.troubleshooting.log-fields).
- **Read-only SDK calls.** [Read-only SDK calls for ZPA triage](kb:zpa.troubleshooting.read-side-calls).
- **Live Logs and Diagnostics: views, ranges, retention and export.** [ZPA Live Logs and Private Diagnostics: views, time ranges, retention, filters and export](kb:zpa.troubleshooting.diagnostics).
- **What a User Activity entry shows in the console.** [What a ZPA User Activity entry shows in Diagnostics and Live Logs](kb:zpa.troubleshooting.user-activity-diagnostics).
- **Session status codes: classes and component prefixes.** [Private Access session status codes: where they appear, the component prefixes and the three classes](kb:zpa.troubleshooting.session-status-codes).
- **Remote commands on connectors and Service Edges.** [ZPA Support Information sessions: remote commands on App Connectors, Private Service Edges and Private Cloud Controllers](kb:zpa.troubleshooting.support-information).
- **Event notifications and their thresholds.** [ZPA event notifications: the catalog, thresholds, throttling and recipients](kb:zpa.troubleshooting.events).
- **Applications, Users, Health, Extranet and Source IP Anchoring dashboards.** [Applications, Users, Health, Extranet and Source IP Anchoring dashboards](kb:zpa.troubleshooting.dashboards).
- **App Connector, Private Service Edge and Private Cloud Controller dashboards.** [App Connector, Private Service Edge and Private Cloud Controller dashboards](kb:zpa.troubleshooting.component-dashboards).
- **VPN (for Legacy Apps) dashboards, diagnostics and support sessions.** [VPN Service Edges, Network Connectors and BGP Peers dashboards](kb:zpa.vpn.dashboards), [VPN Connected Users and the VPN Diagnostics pages: user logs, traffic flow logs and access policy data](kb:zpa.vpn.diagnostics) and [VPN Support Information: diagnostic sessions and commands on VPN Service Edges and Network Connectors](kb:zpa.vpn.support-information).

Fields of the other log types are in the legacy references: [What a ZPA User Status log record says and does not say](kb:zpa.logs.user-status), [ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers](kb:zpa.logs.control-session-status) and [What the ZPA App Connector Metrics log reports and what it leaves open](kb:zpa.logs.app-connector-metrics).

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.logs.app-connector-metrics.md (What the ZPA App Connector Metrics log reports and what it leaves open)
- links-to references/_meta/text/zpa/zpa.logs.control-session-status.md (ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers)
- links-to references/_meta/text/zpa/zpa.logs.user-status.md (What a ZPA User Status log record says and does not say)
- links-to references/_meta/text/zpa/zpa.troubleshooting.access-path.md (The hops of a ZPA access request and where each can fail)
- links-to references/_meta/text/zpa/zpa.troubleshooting.authentication.md (Authentication failures and step-up prompt loops in ZPA)
- links-to references/_meta/text/zpa/zpa.troubleshooting.certificates.md (Certificate and encryption failures: Browser Access, double encryption, pinned clients)
- links-to references/_meta/text/zpa/zpa.troubleshooting.component-dashboards.md (App Connector, Private Service Edge and Private Cloud Controller dashboards)
- links-to references/_meta/text/zpa/zpa.troubleshooting.dashboards.md (Applications, Users, Health, Extranet and Source IP Anchoring dashboards)
- links-to references/_meta/text/zpa/zpa.troubleshooting.diagnostics.md (ZPA Live Logs and Private Diagnostics: views, time ranges, retention, filters and export)
- links-to references/_meta/text/zpa/zpa.troubleshooting.events.md (ZPA event notifications: the catalog, thresholds, throttling and recipients)
- links-to references/_meta/text/zpa/zpa.troubleshooting.intermittent.md (Intermittent ZPA access failures)
- links-to references/_meta/text/zpa/zpa.troubleshooting.log-fields.md (What the ZPA User Activity log fields say when diagnosing access: outcome and status codes, timing phases, bytes)
- links-to references/_meta/text/zpa/zpa.troubleshooting.no-access.md (A user cannot reach a private application at all)
- links-to references/_meta/text/zpa/zpa.troubleshooting.policy-checks.md (Checking policy match, forwarding, posture and timeout for a blocked user)
- links-to references/_meta/text/zpa/zpa.troubleshooting.read-side-calls.md (Read-only SDK calls for ZPA triage)
- links-to references/_meta/text/zpa/zpa.troubleshooting.segment-checks.md (Checking segments, segment groups and connector groups for a failing application)
- links-to references/_meta/text/zpa/zpa.troubleshooting.session-status-codes.md (Private Access session status codes: where they appear, the component prefixes and the three classes)
- links-to references/_meta/text/zpa/zpa.troubleshooting.signals.md (Where ZPA access evidence lives: console, client, connector, log streaming)
- links-to references/_meta/text/zpa/zpa.troubleshooting.slow.md (A ZPA application is slow)
- links-to references/_meta/text/zpa/zpa.troubleshooting.support-information.md (ZPA Support Information sessions: remote commands on App Connectors, Private Service Edges and Private Cloud Controllers)
- links-to references/_meta/text/zpa/zpa.troubleshooting.user-activity-diagnostics.md (What a ZPA User Activity entry shows in Diagnostics and Live Logs)
- links-to references/_meta/text/zpa/zpa.vpn.dashboards.md (VPN Service Edges, Network Connectors and BGP Peers dashboards)
- links-to references/_meta/text/zpa/zpa.vpn.diagnostics.md (VPN Connected Users and the VPN Diagnostics pages: user logs, traffic flow logs and access policy data)
- links-to references/_meta/text/zpa/zpa.vpn.support-information.md (VPN Support Information: diagnostic sessions and commands on VPN Service Edges and Network Connectors)
