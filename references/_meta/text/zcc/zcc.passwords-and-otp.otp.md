# One-time passwords for an enrolled device (zcc.passwords-and-otp.otp)
Also called: getOtp; get_otp; GetOtp; zcc otp; uninstall otp; logout otp; anti-tampering otp; antiTemperingDisableOtp; zcc_get_device_otp; one-time password zcc

Each enrolled device has a set of one-time passwords an admin can hand a user in place of the app profile's passwords. One API call returns the whole set for one device.

**What they are for.** On Client Connector 4.0 and later for Windows, 4.1 and later for macOS and 4.2.1 and later for Linux, the device details page shows OTPs that can be used in place of app profile passwords: Logout, Revert, Uninstall, Exit (exit from the tray without disabling Internet & SaaS), Disable ZIA, Disable ZPA, Disable ZDX, Deception Settings (disables Deception; Windows 4.0 and later), Disable Anti-Tampering (Windows 4.1 and later) and Disable Endpoint DLP (Windows 4.3 and later, macOS 4.2 and later). [zcc.passwords-and-otp.otp:otp-meanings] The same page also shows a One-Time Password described as a temporary password for login. [zcc.passwords-and-otp.otp:console-one-time-password] The passwords on the device details page refresh automatically every 60 minutes while the window is open, and Refresh Status refreshes them on demand. [zcc.passwords-and-otp.otp:console-refresh]

**The call.** What the call returns, and that each OTP is single-use: [`GET /getOtp` returns the one-time passwords for a device identified by UDID; each is 10 random alphanumeric characters and can be used once. The response carries separate OTPs for actions including uninstall, logout, exit, revert, anti-tampering disable, and disabling ZIA, ZPA, ZDX and ZDP.](kb:zcc.api.devices-wire:otp). By name, the response's `logoutOtp`, `revertOtp`, `uninstallOtp`, `exitOtp`, `ziaDisableOtp`, `zpaDisableOtp`, `zdxDisableOtp`, `deceptionSettingsOtp` and `antiTemperingDisableOtp` are the portal's Logout, Revert, Uninstall, Exit, Disable ZIA, Disable ZPA, Disable ZDX, Deception Settings and Disable Anti-Tampering OTPs. [zcc.passwords-and-otp.otp:otp-field-mapping] What `zdpDisableOtp` unlocks is open [gap:zcc.passwords-and-otp.otp:zdp-otp-meaning], and so is how the generic `otp` relates to the rest [gap:zcc.passwords-and-otp.otp:generic-otp-relationship]. The anti-tampering OTP's key is spelled `antiTemperingDisableOtp` ("Tempering") in the contract and in both SDKs. [zcc.passwords-and-otp.otp:anti-tempering-spelling]

**Not every field is filled.** The vendor's legacy-API getting-started example, which calls `getOtp` on `mobile.<cloudName>.net` with an `auth-token` header, shows a response that carries only an `otp` member. [zcc.passwords-and-otp.otp:doc-example-otp-only] A recorded `getOtp` response returns eight of the contract's eleven keys, without `otp`, `deceptionSettingsOtp` and `antiTemperingDisableOtp`; the same device's recorded details carry a `deviceOtpArray` of ten values that includes all eight. [zcc.passwords-and-otp.otp:recorded-otp-subset] The Go SDK's own test of `GetOtp` accepts a response in which most OTP fields are empty, requiring only one of nine named fields to be non-empty. [zcc.passwords-and-otp.otp:go-test-tolerates-empty] The Go `OtpResponse` holds every OTP as a plain string, so an absent OTP reads as an empty string; the Python model reads an absent OTP as None. [zcc.passwords-and-otp.otp:go-empty-strings]

**Clients.** The Python `get_otp` accepts `device_id` as an alias and sends it as `udid` only when no `udid` is given; the Go `GetOtp` takes the UDID alone. [zcc.passwords-and-otp.otp:python-device-id-alias] The MCP server's OTP tool requires a `udid` or `device_id`, prefers `udid` when both are given, and returns the SDK record without reshaping it. [zcc.passwords-and-otp.otp:mcp-udid-wins] The Python call adds no cache-busting argument: [The Python SDK's `get_otp` sends the caller's query parameters, renaming `device_id` to `udid`, and adds no cache-busting argument of its own.](kb:zcc.api.conventions:python-otp-no-cache-buster).

**Expiry.** An enrolled device's one-time password, usable in place of the passwords defined in app profiles, consists of 10 random alphanumeric characters, remains in effect until it is used and can only be used once; after it is used, a new password is auto-generated during the next policy update. It is unique to the device and only the user of the device can use it. [zcc.passwords-and-otp.otp:otp-lifetime] Whether an unused OTP also expires on a timer is open [gap:zcc.passwords-and-otp.otp:otp-expiry].

What to check:
1. Which OTP the user's action needs (logout, exit, uninstall, revert, a service disable, anti-tampering), and whether the device's platform and Client Connector version show OTPs at all.
2. Whether the OTP was already used, since each one works once.
3. For a Go caller, whether an empty string means the field was absent rather than an empty password.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.passwords-and-otp.otp:otp-field-mapping] Tier B: Matched by name between the API contract's eleven response keys and the portal's OTP list; neither source states the mapping.

Not known (open gaps):
- Whether an unused one-time password expires on a timer [gap:zcc.passwords-and-otp.otp:otp-expiry]: settled by support-ticket or lab-test. Blocks: telling a user whether an OTP fetched earlier still works
- What `zdpDisableOtp` disables [gap:zcc.passwords-and-otp.otp:zdp-otp-meaning]: settled by tenant-data or support-ticket. Blocks: handing a user the right OTP to disable Endpoint DLP or Deception
- How the generic `otp` relates to the operation OTPs [gap:zcc.passwords-and-otp.otp:generic-otp-relationship]: settled by tenant-data. Blocks: knowing whether one OTP can stand in for the others

Area: zcc.passwords-and-otp, its subjects in references/_meta/spine/zcc/zcc.passwords-and-otp.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zcc/zcc.devices.lifecycle.md (Enrolled device states and what moves a device between them): Client Connector generates a UDID for every new installation; the same UDID continues through uninstall, reinstall and reboot, is unique to each user and device, and differs from user to user on the same device. [zcc.devices.lifecycle:udid]
- links-to references/_meta/text/zcc/zcc.api.conventions.md (Conventions of the ZCC v1 API: casing, query parameters, caching, status codes)
- links-to references/_meta/text/zcc/zcc.api.devices-wire.md (ZCC device endpoints on the wire: removal, CSV downloads, OTPs and app profile passwords)
