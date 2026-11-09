# Reading and setting app profile passwords through the API (zcc.passwords-and-otp.password-api)
Also called: getPasswords; managePass; manage_pass; UpdateManagePass; get_passwords; zadDisablePass; zdpDisablePass; set zcc uninstall password api

Two calls touch app profile passwords outside the full app profile edit: one reads the passwords that apply to a user on an OS, one sets passwords on a named profile rule. Paths and SDK coverage are generated.

**Reading.** What `getPasswords` returns, and that a caller who can read it gets the passwords in plain text: [`GET /getPasswords` returns the app profile passwords assigned to a device, found by its user name and OS type: uninstall, logout, exit, disabling ZIA, ZPA and ZDX, and `zdSettingsAccessPass`.](kb:zcc.api.devices-wire:passwords), [A caller allowed to read `/getOtp` or `/getPasswords` can obtain, in plain text, the values that uninstall, log out of or disable services in Client Connector on a device.](kb:zcc.api.devices-wire:secrets-on-get).

**Setting.** The `managePass` body: [The contract defines `POST /managePass` with a body naming a company, a device type, a policy name and the exit, logout, uninstall and per-service disable passwords, and a 200 response with an `errorMessage` property.](kb:zcc.api.company-wire:manage-pass-contract). `managePass` requires `policyName` and `deviceType`, and the token must belong to a user with full access to Client Connector App Profiles, with an API key created with write access. [zcc.passwords-and-otp.password-api:manage-pass-call] The `managePass` `deviceType` codes are 1 iOS, 2 Android, 3 Windows, 4 macOS, 5 Linux and 6 Other. [zcc.passwords-and-otp.password-api:device-type-codes] The `managePass` contract describes `zadDisablePass` as the password to disable Zscaler Active Defense (ZAD) and `zdpDisablePass` as the password to disable Zscaler Deception. [zcc.passwords-and-otp.password-api:zad-zdp-names] The Python SDK has no method that sends it: [The Python SDK ships a `ManagePass` model but no service method that sends it.](kb:zcc.api.company-wire:manage-pass-python-model-only).

**Go SDK.** The Go `UpdateManagePass` sends an empty JSON object instead of its payload: [`NewZccRequestDo` JSON-marshals its `body` argument unconditionally on the OneAPI (non-legacy) path, and four SDK methods (admin-user update, both entitlement updates, manage-pass update) pass it a `bytes.NewBuffer` of bytes they have already marshaled. A `*bytes.Buffer` has no exported fields, so it marshals as `{}`, and the request carries an empty object instead of the payload.](kb:shared.sdk-go.request-handling:zcc-request-do-double-marshals).

**Two surfaces.** The app profile object also carries per-service disable passwords, and which of the two wins when both are set is open [gap:zcc.passwords-and-otp.password-api:surface-authority].

What to check:
1. For a password change made through `managePass` from Go that had no effect, whether the request body was empty.
2. Whether the API key behind a `managePass` call has full App Profiles access with write permission.
3. Whether a password was also set on the app profile itself, before deciding which value the device enforces.

Not known (open gaps):
- Which password surface wins: the app profile's own fields or `managePass` [gap:zcc.passwords-and-otp.password-api:surface-authority]: settled by lab-test or support-ticket. Blocks: predicting which password a device enforces after changes through both surfaces

Area: zcc.passwords-and-otp, its subjects in references/_meta/spine/zcc/zcc.passwords-and-otp.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.api.company-wire.md (ZCC company info and password management calls: who may read, and which clients can write)
- links-to references/_meta/text/zcc/zcc.api.devices-wire.md (ZCC device endpoints on the wire: removal, CSV downloads, OTPs and app profile passwords)
- links-to references/_meta/text/shared/shared.sdk-go.request-handling.md (How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes)
