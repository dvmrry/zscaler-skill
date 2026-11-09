# Device CSV exports: inventory, service status and disable reasons (zcc.devices.exports)
Also called: downloadDevices; downloadServiceStatus; downloadDisableReasons; download_devices; download_disable_reasons; registrationTypes; disable reasons report; why did users disable zcc; device csv export

The portal and the API both export device data as CSV. The three API exports are limited to 3 calls a day, so a filter that silently fails costs a call: [For an organization, all endpoints called from a given IP address are limited to 100 calls per hour, except `/downloadDevices`, `/downloadServiceStatus` and `/downloadDisableReasons`, which are limited to 3 calls per day.](kb:zcc.api.rate-limits:hourly-and-daily-limits). Whether that allowance is per endpoint or shared is open: [Whether the 3-a-day download allowance is per endpoint and separate from the hourly budget](kb:zcc.api.rate-limits:download-cap-scope).

**What the portal exports.** The Device Management page exports device details (all fields or custom fields), disable reasons (up to the five most recent times each service was disabled), service status (Internet & SaaS, Private Access and ZDX as On, Off or Error) and partner login details. [zcc.devices.exports:console-exports]

**API filters.** The device and service-status downloads filter by `osTypes` and `registrationTypes`, each a comma-separated list of codes; a null `osTypes` means all OS types. [zcc.devices.exports:download-filters] Registration-type codes are 0 for all states except Removed, 1 Registered, 3 Removal pending, 4 Unregistered, 5 Removed and 6 Quarantined. [zcc.devices.exports:registration-type-codes] The OS codes the contract gives for `osType` on the remove endpoints are in [The contract gives numeric platform codes for `osType` on the soft- and force-remove endpoints (`removeDevices`, `forceRemoveDevices`): 1 iOS, 2 Android, 3 Windows, 4 macOS, 5 Linux, where null means all OS types; the Go SDK defines the same device-type constants.](kb:zcc.api.conventions:os-type-codes).

**Allowance.** The three download endpoints are limited to 3 calls a day: [For an organization, all endpoints called from a given IP address are limited to 100 calls per hour, except `/downloadDevices`, `/downloadServiceStatus` and `/downloadDisableReasons`, which are limited to 3 calls per day.](kb:zcc.api.rate-limits:hourly-and-daily-limits).

**Disable reasons.** Users give reasons only when the app profile asks for them: [Send Disable Service Reason, off by default, lets users describe why they disabled a service; the reason shows in device details, and the API exports disable reasons as a CSV report.](kb:zcc.app-profiles.advanced-settings:send-disable-reason). The disable-reasons download requires `startDate`, takes an optional `endDate` and `osTypes`, and takes the time zone as a `Time-Zone` request header rather than a query parameter. [zcc.devices.exports:disable-reasons-call] The Python `download_disable_reasons` moves a `time_zone` argument into the `Time-Zone` header and sends the reformatted `startDate` and `endDate` as query parameters. [zcc.devices.exports:python-disable-reasons-header]

**Python filter defects.** Called with `query_params=` as a keyword, the Python `download_devices` and `download_service_status` send no OS or registration filter: the decorator replaces `os_types` and `registration_types` in that dict with `osTypes` and `registrationTypes`, and the method then builds its request parameters only from `os_types` and `registration_types`. Passed positionally, the dict skips the decorator's mapping and the method translates it itself. [zcc.devices.exports:python-keyword-filters-dropped] The Python SDK maps registration type `all` to 0 and then keeps only truthy codes, so `all` is dropped: alone it raises an invalid registration type error, and alongside other types it is silently left out. [zcc.devices.exports:python-all-rejected]

What to check:
1. Whether a Python export call passed `query_params=` as a keyword, which sends no filter, before trusting that the CSV is filtered.
2. Whether the registration filter meant to include Removed devices, since code 0 excludes them and the Python SDK cannot send it.
3. Whether Send Disable Service Reason is on in the relevant app profile before expecting reasons in the export.
4. How many of the day's 3 download calls are left before retrying an export, counting calls to all three download endpoints until it is known whether the allowance is per endpoint.

Area: zcc.devices, its subjects in references/_meta/spine/zcc/zcc.devices.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.api.rate-limits.md (ZCC API rate limits: 100 calls an hour, 3 a day for downloads, and how the SDKs back off): For an organization, all endpoints called from a given IP address are limited to 100 calls per hour, except `/downloadDevices`, `/downloadServiceStatus` and `/downloadDisableReasons`, which are limited to 3 calls per day. [zcc.api.rate-limits:hourly-and-daily-limits]
- links-to references/_meta/text/zcc/zcc.api.conventions.md (Conventions of the ZCC v1 API: casing, query parameters, caching, status codes)
- links-to references/_meta/text/zcc/zcc.app-profiles.advanced-settings.md (What the less common app profile settings do)
