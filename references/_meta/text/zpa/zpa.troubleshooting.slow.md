# A ZPA application is slow (zpa.troubleshooting.slow)
Also called: zpa slow; zpa latency; zpa app slow to load; ConnectionSetupTime high; AppLearnTime high

Slowness is located by phase using the timing fields, then by what the phase involves.

**What each phase involves.** The field definitions are in [The User Activity log's timing fields include AppLearnTime (App Connectors learning about the application and reporting to the central authority), CAProcessingTime (processing in the central authority), ConnectorZENSetupTime (setting up the connection between the App Connector and Public Service Edge), ConnectionSetupTime (the App Connector processing a notification from the App Connector selection microservice and setting up the connection to the application server) and ServerSetupTime (setting up the connection at the server).](kb:zpa.troubleshooting.log-fields:timing-fields); the readings of high values are open [Reading a high value in each timing phase](kb:zpa.troubleshooting.log-fields:timing-readings) [High AppLearnTime and Health Reporting](kb:zpa.troubleshooting.log-fields:app-learn-health-reporting).

**Health reporting.** The values are in [An application segment's health_reporting accepts NONE, ON_ACCESS or CONTINUOUS.](kb:zpa.app-connectors.health:health-reporting-values) and the cadence per value is open [How often health_reporting probes run](kb:zpa.app-connectors.health:health-reporting-cadence).

**Connector choice.** Selection is in [Private Access selects the closest App Connector given the location of the user and the App Connector-to-application latency.](kb:zpa.app-connectors.selection:closest-by-location-and-latency).

What to check:
1. Which timing field is anomalously high on User Activity records for the affected user and host.
2. What the high phase measures, before assigning a cause: the readings are not published.
3. The segment's Health Reporting and connector selection method, which the settings subject holds.
4. Which connector and Public Service Edge served the session, and whether it is the expected nearest one.
5. Whether byte counters per interval are low while setup is high, noting the reading is not sourced.

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.troubleshooting.log-fields.md (What the ZPA User Activity log fields say when diagnosing access: outcome and status codes, timing phases, bytes)
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)
- logged-in references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say): The User Activity log's timing fields include AppLearnTime (App Connectors learning about the application and reporting to the central authority), CAProcessingTime (processing in the central authority), ConnectorZENSetupTime (setting up the connection between the App Connector and Public Service Edge), ConnectionSetupTime (the App Connector processing a notification from the App Connector selection microservice and setting up the connection to the application server) and ServerSetupTime (setting up the connection at the server). [zpa.troubleshooting.log-fields:timing-fields]
- links-to references/_meta/text/zpa/zpa.app-connectors.selection.md (How a session is assigned to an App Connector)
