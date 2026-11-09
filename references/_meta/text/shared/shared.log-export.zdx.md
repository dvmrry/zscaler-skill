# Getting ZDX data out: the ZDX API, its windows and delays (shared.log-export.zdx)
Also called: zdx to siem; zdx export; zdx api time range; zdx data delay; zdx score -1; zdx webhooks

The ZDX API gives programmatic access to administration (active locations and departments), alerts, software inventory, reports (ZDX Scores for applications and device health metrics and events) and troubleshooting (deep tracing on a user's device). [shared.log-export.zdx:api-scope] The ZDX ranges list ZDX APIs as not supported on Standard, supported for Microsoft 365 events on Microsoft 365, and supported on Advanced and Advanced Plus. [shared.log-export.zdx:api-entitlement]

**Pulling it.** Most Report API endpoints and some Alert API endpoints require a 2-hour time range, so a longer period takes one request per 2-hour window; /devices/{deviceid}/events, /alerts/{alert_id} and /alerts/{alert_id}/affected_devices need no time range. [shared.log-export.zdx:two-hour-window] Client Connector collects and reports the telemetry, and the delay from collection to reporting is estimated at 20 minutes, so a full hour of data needs the timestamp adjusted for it. [shared.log-export.zdx:reporting-delay] ZDX API data can differ from the ZDX UI by a marginal 2% because aggregated metrics use approximate functions, and a ZDX Score of -1 from the API means no data is available. [shared.log-export.zdx:api-vs-ui]

**Pushing it.** The ZDX ranges list Webhooks as not supported on Standard, 10 on Microsoft 365 and Advanced, and 50 on Advanced Plus. [shared.log-export.zdx:webhooks] Whether ZDX data can reach a SIEM by any streaming path is open [gap:shared.log-export.zdx:streaming-path].

What to check:
1. Whether the ZDX license tier includes the API at all, before planning a pull.
2. Split pulls into 2-hour windows and lag the end of each by the reporting delay.

Not known (open gaps):
- Whether ZDX data can be streamed to a SIEM [gap:shared.log-export.zdx:streaming-path]: settled by source-read. Blocks: recommending how to get ZDX data into a SIEM

Area: shared.log-export, its subjects in references/_meta/spine/shared/shared.log-export.json
