# Where ZPA access evidence lives: console, client, connector, log streaming (zpa.troubleshooting.signals)
Also called: zpa signal sources; zpa troubleshooting logs; z-tunnel 1.0 vs 2.0 ports; posture evaluation frequency; zpa connector logs; remote troubleshooting journalctl

Evidence comes from the Admin Console, the client, the connector hosts and streamed logs, and each has its own limits.

**Console and retention.** The retention of the logs the console shows is in [Retention and delivery guarantees for ZPA logs](kb:zpa.log-receivers.delivery). Connector state and update status are in [App Connector health, status values and telemetry](kb:zpa.app-connectors.health) and [App Connector software and host OS updates](kb:zpa.app-connectors.upgrades).

**Client.** Z-Tunnel 2.0 uses DTLS or TLS to send packets to the Zscaler service and can send all ports and protocols, while Z-Tunnel 1.0 forwards via CONNECT requests and sends all proxy-aware traffic or port 80/443 traffic, depending on the forwarding profile. [zpa.troubleshooting.signals:ztunnel-versions] Zscaler Client Connector evaluates device posture for each posture type at a configured frequency, in one-minute intervals, with a maximum default of 15 minutes and a minimum of 2 minutes (Windows 4.4 and later, macOS 4.5 and later), and for some checks it evaluates immediately when the posture changes, whatever the frequency. [zpa.troubleshooting.signals:posture-frequency] The default cadence is also in [Zscaler Client Connector evaluates device posture profiles every 15 minutes, new connections are established on the updated posture, and existing connections are not affected by updates to security postures.](kb:zpa.posture-profiles.evaluation:cadence). The state indicator and local error codes of the client are not sourced [gap:zpa.troubleshooting.signals:client-local-signals].

**Connector hosts.** The help calls many TCP failures from an App Connector to the application server normal, mostly the result of the connector's health monitoring of the server, and says a capture facing the server shows many TCP handshakes and RST packets. [zpa.troubleshooting.signals:health-monitoring-tcp-failures] An enrollment failure from a copied key is described in [App Connector provisioning keys](kb:zpa.app-connectors.provisioning-keys). What the connector logs for reachability and certificate failures is not sourced [gap:zpa.troubleshooting.signals:connector-log-signals] Remote troubleshooting can collect logs and interfaces: The July 14, 2026 release summary lists support for the journalctl command for App Connectors, Private Service Edges, Private Cloud Controllers, and Network Connectors to collect service logs or full system logs for remote troubleshooting. [zpa.troubleshooting.signals:journalctl-july14] For App Connectors, see [The July 13, 2026 release summary lists support for a Get Network Interfaces command that collects a list of the network interfaces an App Connector uses, to help with remote troubleshooting.](kb:zpa.app-connectors.deployment:get-network-interfaces-july13). The VPN Support Information commands are in [VPN Support Information: diagnostic sessions and commands on VPN Service Edges and Network Connectors](kb:zpa.vpn.support-information).

**Streamed logs.** The fields are in [What the ZPA User Activity log fields say when diagnosing access: outcome and status codes, timing phases, bytes](kb:zpa.troubleshooting.log-fields), and the connector-side loss behavior in [App Connector health, status values and telemetry](kb:zpa.app-connectors.health).

What to check:
1. How old the event is against the retention of the console and of any stream before looking for it.
2. Which tunnel type the client uses, since only Z-Tunnel 2.0 carries all ports and protocols.
3. How often the client evaluates posture for the profile in the policy, and that some checks evaluate immediately.
4. Whether a connector shows Disconnected while its VM runs, and what the connector reports locally.
5. That TCP failures and resets toward the application server are expected from health monitoring before treating them as the fault.
6. Whether a connector shows a copied-key enrollment failure in its console.
7. Whether streamed logs cover the period, noting the loss behavior.

Not known (open gaps):
- Client tunnel state and local error codes [gap:zpa.troubleshooting.signals:client-local-signals]: settled by operator-experience or source-read
- What the connector logs for reachability and certificate failures [gap:zpa.troubleshooting.signals:connector-log-signals]: settled by lab-test or operator-experience

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.posture-profiles.evaluation.md (When and how often posture is evaluated): Zscaler Client Connector evaluates device posture for each posture type at a configured frequency, in one-minute intervals, with a maximum default of 15 minutes and a minimum of 2 minutes (Windows 4.4 and later, macOS 4.5 and later), and for some checks it evaluates immediately when the posture changes, whatever the frequency. [zpa.troubleshooting.signals:posture-frequency]
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)
- links-to references/_meta/text/zpa/zpa.app-connectors.deployment.md (App Connector deployment, redundancy and limits)
- links-to references/_meta/text/zpa/zpa.app-connectors.provisioning-keys.md (App Connector provisioning keys)
- links-to references/_meta/text/zpa/zpa.app-connectors.upgrades.md (App Connector software and host OS updates)
- links-to references/_meta/text/zpa/zpa.log-receivers.delivery.md (Retention and delivery guarantees for ZPA logs)
- links-to references/_meta/text/zpa/zpa.troubleshooting.log-fields.md (What the ZPA User Activity log fields say when diagnosing access: outcome and status codes, timing phases, bytes)
- links-to references/_meta/text/zpa/zpa.vpn.support-information.md (VPN Support Information: diagnostic sessions and commands on VPN Service Edges and Network Connectors)
