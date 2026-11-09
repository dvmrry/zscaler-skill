# ZDX API conventions: time ranges, paging, reporting delay and how API numbers differ from the console (zdx.api.conventions)
Also called: zdx time range; zdx from to; zdx 2 hour window; zdx next_offset; zdx pagination; zdx score -1; zdx api data delay; zdx api does not match ui; zdx look-back

Most ZDX report and alert endpoints take a time window as `from` and `to` in epoch seconds and page with an opaque offset. The per-endpoint parameters are in the contract (`vendor/zscaler-api-specs/automate-zscaler/openapi/zdx.openapi.json`); this subject gathers the rules that apply across them.

**Time ranges.** The 2-hour default is [The contract's reads of the device list, the device applications, the health metrics, the user list and the active geolocations say in their descriptions that they default to the last 2 hours when no time range is given.](kb:zdx.reports:default-window), and most report reads take at most 2 hours per request while a few need no range, [Most Report API endpoints and some Alert API endpoints require a 2-hour time range, so a longer period takes one request per 2-hour window; /devices/{deviceid}/events, /alerts/{alert_id} and /alerts/{alert_id}/affected_devices need no time range.](kb:shared.log-export.zdx:two-hour-window). The alert endpoints' limits are in [ZDX alerts: how rules trigger, what an alert's status means, and reading alerts through the API](kb:zdx.alerts). How far back a request may reach, and whether probe IDs age out, is open [gap:zdx.api.conventions:look-back-limit]. The Python `since` shorthand is [A `since` value is a number of hours: the decorator sets `to` to the current Unix time and `from` to that time minus the hours times 3,600, unless the caller already set `from` or `to`.](kb:zdx.sdk-python.request-shaping:since-to-epoch) and the Go filter struct [Go ZDX report and alert functions such as `GetAllApps` and `GetOngoingAlerts` take the time range as `From` and `To` in Unix epoch seconds inside a `GetFromToFilters` struct, documented as returning the last 2 hours when not entered.](kb:zdx.sdk-go:epoch-filters).

**Paging.** Paged lists return a `next_offset` to send back as `offset`, [The device list, user list and application-user list take an `offset` and a `limit` that defaults to 1000, and return a `next_offset` that must be entered in the next request to get the next batch.](kb:zdx.reports:paging). The Python response object's own paging does not return ZDX records: [No paged ZDX list response in the contract has an `items` key (they hold `alerts`, `devices`, `users` or `software` beside `next_offset`), so `next()` on a ZDX response returns no records and callers have to pass `next_offset` back as `offset` themselves.](kb:zdx.sdk-python.response-models:paging-reads-items).

**Reading the numbers.** The reporting delay is [Client Connector collects and reports the telemetry, and the delay from collection to reporting is estimated at 20 minutes, so a full hour of data needs the timestamp adjusted for it.](kb:shared.log-export.zdx:reporting-delay); how API values relate to the console, and what a score of -1 means, is [ZDX API data can differ from the ZDX UI by a marginal 2% because aggregated metrics use approximate functions, and a ZDX Score of -1 from the API means no data is available.](kb:shared.log-export.zdx:api-vs-ui).

What to check:
1. Whether a report request's window is 2 hours or less, or was split into 2-hour requests.
2. Whether the most recent 20 minutes are missing because of the reporting delay rather than a fault.
3. Whether a paged list was followed to a null `next_offset` by hand rather than with the Python response object's `next()`.

Not known (open gaps):
- How far back a ZDX report request may reach, and whether probe IDs expire [gap:zdx.api.conventions:look-back-limit]: settled by lab-test or source-read. Blocks: planning historical report pulls and reusing probe IDs

Area: zdx.api, its subjects in references/_meta/spine/zdx/zdx.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.log-export.zdx.md (Getting ZDX data out: the ZDX API, its windows and delays)
- links-to references/_meta/text/zdx/zdx.reports.md (Reading ZDX report data: time ranges, paging, users and what the reads return)
- links-to references/_meta/text/zdx/zdx.alerts.md (ZDX alerts: how rules trigger, what an alert's status means, and reading alerts through the API)
- links-to references/_meta/text/zdx/zdx.sdk-go.md (The Go SDK for ZDX: how it reaches the API and where its ZDX behavior is covered)
- links-to references/_meta/text/zdx/zdx.sdk-python.request-shaping.md (How the Python SDK turns ZDX arguments into query parameters and bodies)
- links-to references/_meta/text/zdx/zdx.sdk-python.response-models.md (What the Python SDK's ZDX results contain: envelopes, missing fields and paging)
