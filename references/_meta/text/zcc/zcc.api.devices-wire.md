# ZCC device endpoints on the wire: removal, CSV downloads, OTPs and app profile passwords (zcc.api.devices-wire)
Also called: zcc removeDevices; zcc forceRemoveDevices; zcc soft remove device; removal pending; zcc getOtp; zcc getPasswords; zcc uninstall password api; zcc downloadDevices csv
Former IDs: zcc-11

The device endpoints list and remove enrolled devices, export CSV reports, and hand out the one-time and profile passwords that unlock Client Connector on a device. Their parameters are generated from the contract; this subject holds what the operations do.

## Listing devices

The device list takes `page` (default 1) and `pageSize`, which defaults to 50 with a maximum of 5000, and filters by `username` and `osType`. [zcc.api.devices-wire:api-page-size] How each SDK pages it is in [Listing enrolled devices: page size and how each SDK pages](kb:zcc.devices.listing).

The contract, the Go SDK and recorded responses type a device's `state` and `type` differently [divergence:zcc.api.devices-wire:state-type-encoding]. The Go SDK reads the details response as a list, where the contract and a recorded response have one object [divergence:zcc.api.devices-wire:details-response-shape].

## Removing devices

`POST /removeDevices` soft-removes enrolled devices from the portal, marking their state as device removal pending. [zcc.api.devices-wire:soft-remove] `POST /forceRemoveDevices` force-removes enrolled devices from the portal, but only devices in the registered or device-removal-pending state. [zcc.api.devices-wire:force-remove] Both removal calls select devices by criteria in one request, at least one of which must be given: a user name, a list of Client Connector versions, an OS type, or a list of UDIDs. The response reports the number of devices removed. [zcc.api.devices-wire:remove-by-criteria]

How many UDIDs one call accepts is open [gap:zcc.api.devices-wire:udid-batch-cap].

The Go SDK sends machine-tunnel hostnames under a different key and shape from the contract [divergence:zcc.api.devices-wire:machine-tunnel-hostnames].

## Downloads

`/downloadDevices`, `/downloadServiceStatus` and `/downloadDisableReasons` return CSV files (device information, service status of all devices, and the reasons devices were disabled) as `application/octet-stream`. [zcc.api.devices-wire:csv-downloads] They have their own daily limit: [For an organization, all endpoints called from a given IP address are limited to 100 calls per hour, except `/downloadDevices`, `/downloadServiceStatus` and `/downloadDisableReasons`, which are limited to 3 calls per day.](kb:zcc.api.rate-limits:hourly-and-daily-limits).

## Secrets

`GET /getOtp` returns the one-time passwords for a device identified by UDID; each is 10 random alphanumeric characters and can be used once. The response carries separate OTPs for actions including uninstall, logout, exit, revert, anti-tampering disable, and disabling ZIA, ZPA, ZDX and ZDP. [zcc.api.devices-wire:otp] `GET /getPasswords` returns the app profile passwords assigned to a device, found by its user name and OS type: uninstall, logout, exit, disabling ZIA, ZPA and ZDX, and `zdSettingsAccessPass`. [zcc.api.devices-wire:passwords] A caller allowed to read `/getOtp` or `/getPasswords` can obtain, in plain text, the values that uninstall, log out of or disable services in Client Connector on a device. [zcc.api.devices-wire:secrets-on-get]

Repeated OTP reads should carry a cache-busting argument: [Zscaler's guidance is to prevent API call caching by adding a dummy argument with a randomly generated number to every request URL, for example `GET /getOtp?_=123456`.](kb:zcc.api.conventions:dummy-argument).

What to check:
1. Whether a device that still shows after removal is in the removal-pending state a soft remove leaves, and needs a force remove.
2. Which API clients and roles can call `/getOtp` and `/getPasswords`, since either is enough to disable or uninstall Client Connector on a device.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.api.devices-wire:secrets-on-get] Tier B: Follows from the response fields of the two GET operations; which roles or scopes may call them is not stated in these sources.

Sources disagree (name both sides):
- How the device `state` (and `type`) values are typed on the list and details calls. [divergence:zcc.api.devices-wire:state-type-encoding]
  - api-specs: The list contract types `state`, `type` and `vpnState` as strings of format byte, and the details contract does the same for `state` and `type`.
  - sdk-go: The Go list struct decodes `state`, `type` and `vpnState` as int.
  - sdk-go: The Go details struct decodes `state` and `type` as string.
  - sdk-python: Recorded responses from one test tenant (recorded with SDK 1.9.13, Python SDK cassette) carry `state` and `type` as JSON numbers on both the list and the details call, and `vpnState` as a number on the list call.
  Impact: Within one SDK the same field is a number on one call and a string on the other. On the recorded tenant the wire sends numbers, which the Go list struct matches and the contract's string type does not; the Go details struct's string fields cannot decode those numbers, so the Go details call fails on that response. Code comparing state across the two calls compares unlike types.
- Whether the device details call returns one object or a list. [divergence:zcc.api.devices-wire:details-response-shape]
  - api-specs: The contract's response is a single object.
  - sdk-python: The Python SDK reads a single object.
  - sdk-go: The Go SDK decodes the response into a slice of `DeviceDetails`.
  - sdk-python: A recorded `getDeviceDetails` response from one test tenant (recorded with SDK 1.9.13, Python SDK cassette) is a single JSON object.
  Impact: The recorded API answers with one object, as the contract and the Python SDK say, so the Go `GetDeviceDetails` call fails to decode it into a slice and returns an error for a successful request; a Go caller would conclude the device has no details. A non-slice Go type would still fail on that response, because it sends `state` and `type` as numbers where the Go details struct declares strings (divergence state-type-encoding).
- Where and under which key a machine-tunnel removal sends hostnames. [divergence:zcc.api.devices-wire:machine-tunnel-hostnames]
  - api-specs: Hostnames go in the `hostName` query parameter, comma-separated, or in the body as a `hostNames` array; only one of hostname and machine token may be given.
  - sdk-go: The Go `RemoveMachineTunnel` puts the hostnames in the body as a single comma-joined string under `hostName`, a key the contract's body does not define, and sends `machineToken` alongside it when both are given.
  Impact: A Go removal by hostname depends on the server reading a body key outside the contract; if it does not, the call can report success with nothing removed, and passing both hostnames and a token sends a combination the contract forbids.

Not known (open gaps):
- How many UDIDs one device-removal call accepts [gap:zcc.api.devices-wire:udid-batch-cap]: settled by lab-test or support-ticket. Blocks: sizing bulk removals under the 100-calls-an-hour limit

Area: zcc.api, its subjects in references/_meta/spine/zcc/zcc.api.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.api.rate-limits.md (ZCC API rate limits: 100 calls an hour, 3 a day for downloads, and how the SDKs back off): For an organization, all endpoints called from a given IP address are limited to 100 calls per hour, except `/downloadDevices`, `/downloadServiceStatus` and `/downloadDisableReasons`, which are limited to 3 calls per day. [zcc.api.rate-limits:hourly-and-daily-limits]
- links-to references/_meta/text/zcc/zcc.api.conventions.md (Conventions of the ZCC v1 API: casing, query parameters, caching, status codes)
- links-to references/_meta/text/zcc/zcc.devices.listing.md (Listing enrolled devices: page size and how each SDK pages)
