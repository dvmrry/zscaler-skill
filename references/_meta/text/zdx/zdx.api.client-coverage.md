# Which ZDX API operations the Python and Go SDKs cover, and the configuration API neither calls (zdx.api.client-coverage)
Also called: zdx config api; zdx /v1/config; zdx configuration endpoints; create zdx application api; zdx monitors api; zdx sdk coverage; zdx python only; zdx is read only; can i create a zdx probe via api

Each SDK's ZDX functions and the contract's operations are generated side by side by `node scripts/kb.mjs surface zdx`. This subject records the coverage differences that change what a caller can automate.

**Configuration.** The application management operations are in [The API contract has an Application Management area under /v1/config/applications: it lists configured applications, creates applications (the type decides the required fields), reads, updates and deletes one, activates and deactivates it, and lists and creates its monitors.](kb:zdx.applications:config-api). Besides application management, the contract's `/v1/config` family writes monitors, collections and tracing sessions (updating monitors, creating collections, creating and starting tracing sessions) and reads users, devices, departments, groups and locations as configuration. [zdx.api.client-coverage:config-family] No SDK calls any of them: [Neither SDK calls any /v1/config path: the configuration, monitor, collection and directory operations of the contract are reachable only by direct API calls.](kb:zdx.applications:config-no-sdk).

**Snapshots.** Only the Python SDK wraps a snapshot operation, the alert snapshot; no Go package covers snapshots, and neither SDK calls the contract's user snapshot. [zdx.api.client-coverage:snapshots-python-alert-only]

**Python-only reads.** The Go `deeptrace` package has four functions, `GetDeepTraces`, `GetDeepTraceSession`, `CreateDeepTraceSession` and `DeleteDeepTraceSession`; the deep trace's top processes are read by `GetDeviceTopProcesses` in the `reports/devices` package. [zdx.api.client-coverage:go-deeptrace-functions] So the deep trace's web-probe metrics, cloud-path metrics, cloud path, health metrics and events are readable through the Python SDK (`get_deeptrace_webprobe_metrics`, `get_deeptrace_cloudpath_metrics`, `get_deeptrace_cloudpath`, `get_deeptrace_health_metrics`, `get_deeptrace_events`) but have no Go function; the Go device report functions read the device's own paths, not a trace's. [zdx.api.client-coverage:python-deeptrace-readers] Listing an application's users and reading one user's experience with it (`list_app_users`, `get_app_user`) are Python-only; the Go `reports/applications` package has `GetAllApps`, `GetApp`, `GetAppScores` and `GetAppMetrics`. [zdx.api.client-coverage:app-users-python-only] The Go device list cannot filter by MAC address or private IPv4: its `GetDevicesFilters` carries user IDs, emails, location, department, geolocation, offset and limit beside the shared time filters, while the contract and the Python `list_devices` offer `mac_address` and `private_ipv4`. [zdx.api.client-coverage:go-device-filters]

**Postman examples.** The OneAPI Postman collection's ZDX requests cover the reports on applications, users and devices (with their web and cloud-path probes and call quality), deep traces, score analysis, alerts, software inventory, and the administration and active-geolocation reads. It has no request for the contract's configuration, snapshot or sign-in operations, nor for its application score, device events, device health metrics or deep-trace events reads. [zdx.api.client-coverage:postman-scope]

**Writes the SDKs do cover.** Starting and deleting deep traces: [Starting a deep trace through the API: the read chain, the request body, and where the clients disagree](kb:zdx.diagnostics.start-request) and [Reading and deleting a deep trace through the API: the session record and its keys](kb:zdx.diagnostics.session-records). Score analysis: [ZDX Score analysis jobs through the API: starting one, polling it, and what the clients return](kb:zdx.diagnostics.analysis). Alert snapshots: [Sharing a ZDX snapshot of an alert or a user: the contract, the Python client and the path question](kb:zdx.alerts.snapshot).

What to check:
1. Whether the task needs the `/v1/config` operations (applications, monitors, collections, tracing), which have to be called directly because no SDK wraps them.
2. Whether a Go integration needs deep-trace metrics, app users or snapshots, which only the Python SDK wraps.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.api.client-coverage:snapshots-python-alert-only] Tier B: Rests on the generated surface: the Go SDK's ZDX packages are administration, alerts, common, inventory, reports and troubleshooting, and no SDK endpoint matches `/snapshot/user`.
- [zdx.api.client-coverage:python-deeptrace-readers] Tier B: Rests on the generated surface: no Go endpoint matches a `/deeptraces/` metric path other than top processes.
- [zdx.api.client-coverage:app-users-python-only] Tier B: Rests on the generated surface: the Go package's functions map to no `/apps/{id}/users` path.
- [zdx.api.client-coverage:go-device-filters] Tier B: The quoted fields are the whole `GetDevicesFilters` struct, and the embedded `GetFromToFilters` has no MAC or IPv4 field at the pin. How Python sends these names is in zdx.sdk-python.request-shaping.
- [zdx.api.client-coverage:postman-scope] Tier B: Found by listing every collection request whose URL starts with {{ZDXBaseUrl}} (38 requests) and matching each against the contract's paths with the /v1 prefix removed (129 operations in the OpenAPI file): every collection request matches a contract path, and the contract operations named here match no collection request.

Area: zdx.api, its subjects in references/_meta/spine/zdx/zdx.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zdx/zdx.applications.md (ZDX applications: predefined, custom and network applications, and the application API)
- links-to references/_meta/text/zdx/zdx.alerts.snapshot.md (Sharing a ZDX snapshot of an alert or a user: the contract, the Python client and the path question)
- links-to references/_meta/text/zdx/zdx.diagnostics.analysis.md (ZDX Score analysis jobs through the API: starting one, polling it, and what the clients return)
- links-to references/_meta/text/zdx/zdx.diagnostics.session-records.md (Reading and deleting a deep trace through the API: the session record and its keys)
- links-to references/_meta/text/zdx/zdx.diagnostics.start-request.md (Starting a deep trace through the API: the read chain, the request body, and where the clients disagree)
