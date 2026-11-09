# Intermittent ZPA access failures (zpa.troubleshooting.intermittent)
Also called: zpa intermittent; zpa flapping connector; zpa fails sometimes; zpa failures during upgrade window; zpa failures retry works

Intermittent failures are compared against connector state, update windows, selection and posture timing.

**Connectors.** Connection health is in [The App Connectors page shows each connector's Connection Health as Connected or Disconnected, separately from its Status (enabled or disabled).](kb:zpa.app-connectors.health:connection-health-column). Update windows are in [When a new version is available, one component in the group is chosen at random and updated; it restarts and is temporarily unavailable, and new application access goes to the other components.](kb:zpa.app-connectors.upgrades:random-one-at-a-time) and [The update runs in a 4-hour window that starts at the scheduled time; after one component succeeds another eligible one is chosen, until the window expires or every component in the group has updated.](kb:zpa.app-connectors.upgrades:four-hour-window). Selection and affinity are in [Private Access selects the closest App Connector given the location of the user and the App Connector-to-application latency.](kb:zpa.app-connectors.selection:closest-by-location-and-latency) and [Private Access keeps an active user on the same App Connector for 15 minutes after the user's last request to the application; the timer starts at selection and refreshes on each request.](kb:zpa.app-connectors.selection:affinity-15-minutes).

**The log.** Each User Activity record names the connector and the Public Service Edge that handled the session, so sessions can be grouped by connector and edge. [zpa.troubleshooting.intermittent:connector-zen-per-session]

**Posture timing.** The re-evaluation cadence is in [Zscaler Client Connector evaluates device posture for each posture type at a configured frequency, in one-minute intervals, with a maximum default of 15 minutes and a minimum of 2 minutes (Windows 4.4 and later, macOS 4.5 and later), and for some checks it evaluates immediately when the posture changes, whatever the frequency.](kb:zpa.troubleshooting.signals:posture-frequency); that an expired result blocks a session periodically is not sourced [gap:zpa.troubleshooting.intermittent:posture-intermittency].

**Stickiness.** Why a failure follows one connector is open [Effect of selectConnectorCloseToApp = false](kb:zpa.app-connectors.selection:round-robin-setting). That a single connector going absent explains the correlation is not sourced [gap:zpa.troubleshooting.intermittent:connector-absence-correlation].

What to check:
1. Whether Close sessions are interleaved with Open or Active sessions for the same Host in the User Activity stream.
2. Whether a connector's connection health changed during the failure window.
3. Whether the failure window overlaps the group's scheduled update window, in which one component at a time restarts and new access goes to the others.
4. Which connector and Public Service Edge each failing session used, from the Connector and ConnectorZEN fields.
5. Whether the application segment sets the nearest-connector preference and what the false value does.
6. Whether a device posture condition is in the policy and the cadence at which the client re-evaluates it.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.troubleshooting.intermittent:connector-zen-per-session] Tier B: Derived from the field definitions: Connector, ConnectorZEN and ClientZEN are recorded per record. That variation in them explains an intermittent failure is not sourced.

Not known (open gaps):
- A connector cycling between connected and disconnected [gap:zpa.troubleshooting.intermittent:connector-absence-correlation]: settled by lab-test or operator-experience
- Posture re-evaluation as a cause of intermittency [gap:zpa.troubleshooting.intermittent:posture-intermittency]: settled by lab-test

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.app-connectors.selection.md (How a session is assigned to an App Connector)
- links-to references/_meta/text/zpa/zpa.app-connectors.upgrades.md (App Connector software and host OS updates)
- logged-in references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say): Each User Activity record names the connector and the Public Service Edge that handled the session, so sessions can be grouped by connector and edge. [zpa.troubleshooting.intermittent:connector-zen-per-session]
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)
- links-to references/_meta/text/zpa/zpa.troubleshooting.signals.md (Where ZPA access evidence lives: console, client, connector, log streaming)
