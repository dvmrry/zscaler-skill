# Reading ZDX report data: time ranges, paging, users and what the reads return (zdx.reports)
Also called: zdx reports; zdx reports api; zdx report endpoints; zdx time range; zdx last 2 hours; zdx 2 hour limit; next_offset; zdx pagination; zdx page size; zdx users api; zdx user score; list_users; zdx api delay; zdx aggregation

The report reads cover applications, devices and users; this subject holds the rules they share and the user reads. The help's summary of the area is in [The ZDX API gives programmatic access to administration (active locations and departments), alerts, software inventory, reports (ZDX Scores for applications and device health metrics and events) and troubleshooting (deep tracing on a user's device).](kb:shared.log-export.zdx:api-scope).

## Time ranges

The contract's reads of the device list, the device applications, the health metrics, the user list and the active geolocations say in their descriptions that they default to the last 2 hours when no time range is given. [zdx.reports:default-window] Most report reads also take at most 2 hours per request, while the device events read needs no range, [Most Report API endpoints and some Alert API endpoints require a 2-hour time range, so a longer period takes one request per 2-hour window; /devices/{deviceid}/events, /alerts/{alert_id} and /alerts/{alert_id}/affected_devices need no time range.](kb:shared.log-export.zdx:two-hour-window). Data lags collection by an estimated 20 minutes, [Client Connector collects and reports the telemetry, and the delay from collection to reporting is estimated at 20 minutes, so a full hour of data needs the timestamp adjusted for it.](kb:shared.log-export.zdx:reporting-delay), and API values can differ slightly from the UI, with -1 meaning no data, [ZDX API data can differ from the ZDX UI by a marginal 2% because aggregated metrics use approximate functions, and a ZDX Score of -1 from the API means no data is available.](kb:shared.log-export.zdx:api-vs-ui).

## Paging

The device list, user list and application-user list take an `offset` and a `limit` that defaults to 1000, and return a `next_offset` that must be entered in the next request to get the next batch. [zdx.reports:paging]

## Users

The user list returns all active users with their devices, active geolocations and Zscaler locations, for the last 2 hours if no time range is given. [zdx.reports:users-list] Each user in the user list carries a `score`. [zdx.reports:user-score] The single-user read returns the user's details with device information, active geolocations and Zscaler locations, for the last 2 hours if no time range is given. [zdx.reports:user-detail] The users of one application are in [The application-users read lists the users, and the devices they used, that accessed an application, filterable by score category (Poor, Okay or Good), location, department or geolocation, for the last 2 hours if no time range is given.](kb:zdx.applications:app-users).

## What the reads return

Per-application scores, most impacted locations, impacted-user counts and per-category user counts come from the application reads, [The API's application list returns all active applications configured for the tenant, with each one's ZDX score (by default for the last 2 hours), its most impacted location and the total number of users impacted.](kb:zdx.applications:apps-list) and [An application's stats count active users, active devices, and users with poor, okay and good scores.](kb:zdx.applications:app-stats). Apart from each application's most impacted location, no report read in the contract returns a ranked or top-N list across applications, users or locations. [zdx.reports:no-ranked-reports] The configuration area of the contract has count and summary reads: a device count, an application's configured-monitor counts, and lighter summary lists of applications and of departments. [zdx.reports:config-counts]

**Other report reads.** Devices, their health, events, geolocations and call quality are in [ZDX devices: the device list, device detail and per-device application scores](kb:zdx.devices); the Diagnostics Session reads, including top processes, are in [ZDX Diagnostics Sessions (deep traces): what they are and where each part is covered](kb:zdx.diagnostics). The console's predefined reports, which include ranked lists such as Top Users with Poor ZDX Scores, its Data Explorer views and its Quarterly Business Review reports are in [Console reports: predefined reports, Data Explorer views and Quarterly Business Review reports](kb:zdx.reports.console), and its dashboards and overviews are in [ZDX console dashboards and overviews: time ranges, filters, VIP tagging, Private Service Edge Health and Self Service](kb:zdx.dashboards).

What to check:
1. Whether the request's range is within 2 hours, or is split into 2-hour windows, before reading a longer period.
2. Whether the read followed `next_offset` until it was empty before treating a list as complete.
3. Whether the most recent 20 minutes are excluded or allowed for before concluding data is missing.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.reports:no-ranked-reports] Tier B: Rests on a reading of the 21 operations tagged Reports in the captured contract at the pin: they are lists, single-object reads and trends; the only ranked output is the most impacted location of an application. The Diagnostics Session top-processes read is outside the Reports tag.

Area: zdx.reports, its subjects in references/_meta/spine/zdx/zdx.reports.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.log-export.zdx.md (Getting ZDX data out: the ZDX API, its windows and delays)
- links-to references/_meta/text/zdx/zdx.applications.md (ZDX applications: predefined, custom and network applications, and the application API)
- links-to references/_meta/text/zdx/zdx.dashboards.md (ZDX console dashboards and overviews: time ranges, filters, VIP tagging, Private Service Edge Health and Self Service)
- links-to references/_meta/text/zdx/zdx.devices.md (ZDX devices: the device list, device detail and per-device application scores)
- links-to references/_meta/text/zdx/zdx.diagnostics.md (ZDX Diagnostics Sessions (deep traces): what they are and where each part is covered)
- links-to references/_meta/text/zdx/zdx.reports.console.md (Console reports: predefined reports, Data Explorer views and Quarterly Business Review reports)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zdx/zdx.administration.md (ZDX administration API: department and location lookups)
