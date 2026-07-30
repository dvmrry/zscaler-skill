---
product: zcc
topic: "zcc-otp"
title: "ZCC getOtp — one-time-passcode bundle per device"
content-type: reference
last-verified: "2026-07-16"
verified-against:
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/secrets.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_passwords.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/utils.py"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp_test.go"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py"
author-status: draft
---

# ZCC getOtp — one-time-passcode bundle per device

Source: `vendor/zscaler-sdk-python/zscaler/zcc/secrets.py`; `vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go`.

## Summary

A single `getOtp` call returns a **bundle** of one-time passcodes for one enrolled device, keyed by the device UDID — not a single passcode. One request deserializes into one `OtpResponse` object carrying 11 distinct OTP fields (`vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:53-57`, `:72`, `:77`; Go: `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:12`, `:46`, `:15-27`). The field set is identical across the Python and Go SDKs (`vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:33-45`; `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:15-27`).

## HTTP contract

| Property | Value | Citation |
| --- | --- | --- |
| Method | `GET` | `vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:53-57`; Go: `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:46` |
| Base segment | `/zcc/papi/public/v1` | `vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:31` |
| Operation path | `/getOtp` | `vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:53-57` |
| Full path | `/zcc/papi/public/v1/getOtp` | `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:12` |
| Query key | `udid` | `vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:67`; Go: `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:30`, `:34-37` |
| Request body | none (empty) | `vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:64`, `:67`; Go: `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:46` |

`getOtp` is a read-only `GET` with no request body. Python sets `body = {}` and passes the UDID as a query param (`vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:64`, `:67`); Go calls `NewZccRequestDo(ctx, "GET", fullURL, nil, nil, &otpResponse)` with a `nil` body and url-encodes the UDID onto the path (`vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:34-37`, `:46`).

## Keying by device UDID

The call is keyed by the device UDID, passed as the `udid` query parameter. In Go the query struct field is `Udid` tagged `url:"udid,omitempty"`, and the value is set via `queryParams.Set("udid", udid)` (`vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:30`, `:34-37`).

The UDID is the canonical enrolled-device identifier. The upstream lookup is `list_devices` / `getDevices` (`vendor/zscaler-sdk-python/zscaler/zcc/devices.py:291`, `:332-336`), whose Device records expose `udid` (`vendor/zscaler-sdk-python/zscaler/zcc/models/devices.py:54`). The Go test demonstrates the chain: it lists devices, takes `deviceList[0].Udid`, then calls `GetOtp(ctx, service, udid)` (`vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp_test.go:18`, `:29`, `:41`).

## The OTP bundle — 11 fields

Both SDKs define exactly these 11 fields with the same wire keys. Types: Python attributes are `str | None`; Go fields are non-pointer `string`.

| Python attr | Go field | Wire key | Citation (Python / Go) |
| --- | --- | --- | --- |
| `anti_tempering_disable_otp` | `AntiTemperingDisableOtp` | `antiTemperingDisableOtp` | `secrets_otp.py:34` / `get_otp.go:16` |
| `deception_settings_otp` | `DeceptionSettingsOtp` | `deceptionSettingsOtp` | `secrets_otp.py:36` / `get_otp.go:17` |
| `exit_otp` | `ExitOtp` | `exitOtp` | `secrets_otp.py:33-45` / `get_otp.go:15-27` |
| `logout_otp` | `LogoutOtp` | `logoutOtp` | `secrets_otp.py:33-45` / `get_otp.go:15-27` |
| `otp` | `Otp` | `otp` | `secrets_otp.py:39` / `get_otp.go:20` |
| `revert_otp` | `RevertOtp` | `revertOtp` | `secrets_otp.py:33-45` / `get_otp.go:15-27` |
| `uninstall_otp` | `UninstallOtp` | `uninstallOtp` | `secrets_otp.py:33-45` / `get_otp.go:15-27` |
| `zdp_disable_otp` | `ZdpDisableOtp` | `zdpDisableOtp` | `secrets_otp.py:33-45` / `get_otp.go:15-27` |
| `zdx_disable_otp` | `ZdxDisableOtp` | `zdxDisableOtp` | `secrets_otp.py:33-45` / `get_otp.go:15-27` |
| `zia_disable_otp` | `ZiaDisableOtp` | `ziaDisableOtp` | `secrets_otp.py:33-45` / `get_otp.go:15-27` |
| `zpa_disable_otp` | `ZpaDisableOtp` | `zpaDisableOtp` | `secrets_otp.py:33-45` / `get_otp.go:15-27` |

(All Python citations above resolve under `vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py`; the Python constructor reads camelCase keys into snake_case attrs at `:33-45` and `request_format` confirms the camelCase wire keys at `:63-73`. All Go citations resolve under `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:15-27`.)

### `antiTemperingDisableOtp` is a literal vendor spelling

The anti-tampering OTP wire key is spelled `antiTemperingDisableOtp` — "Temper", not "Tamper" — in **both** SDKs. This is the actual on-wire key, not a transcription artifact: `vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:34` (`config["antiTemperingDisableOtp"]`) and `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:16` (`json:"antiTemperingDisableOtp"`).

### `deceptionSettingsOtp` is named for settings, not disable

Of the bundle, `deception_settings_otp` / `deceptionSettingsOtp` is the only field whose name does not carry `disable` — it is distinct in naming from the `*_disable_otp` service fields (`vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:36`; Go: `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:17`). It is not a `*_disable_otp` field in source.

### Generic `otp` field

A generic `otp` field exists in the bundle alongside the operation-scoped OTPs (wire key `otp`): `vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:39`; Go: `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:20`.

MCP v0.14.0 returns `otp.as_dict()` through the generic full-record shaper rather than declaring a curated OTP output model (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py:46-67`; `vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py:50-113`). This preserves the attributes present in the SDK-modeled record; it is not raw-HTTP fidelity and does not add field meanings beyond the SDK model.

## Python vs Go divergences

- **`device_id` alias is Python-only.** Python `get_otp` accepts either `udid` or `device_id` and remaps `device_id` → `udid` inline before the request; if `udid` is absent the `device_id` value is moved under the `udid` key (`vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:61-62`). The Go `GetOtp` takes only a positional `udid string` and sets exactly `udid` on the query (`vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:33-37`) — there is no `device_id` alias in Go.

- **Empty/absent OTP representation differs by SDK.** Python stores absent fields as `None` (each guarded by `if "key" in config else None`, `vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:33-45`). Go uses non-pointer `string` fields (`vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:16-26`), so an absent OTP deserializes to empty string `""` rather than null — visible in the Go test, which checks for `== ""` across all fields (`vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp_test.go:56-60`).

- **No `@zcc_param_mapper` on Python `get_otp`.** Unlike `get_passwords` and most `devices` methods, Python `get_otp` carries no decorator (`vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:33` vs `:82` where `@zcc_param_mapper` decorates `get_passwords`). The `device_id` → `udid` remap is therefore done inline in the method body. The `zcc_param_mapper` decorator only ever maps `os_type` / `device_type` / `registration_type`, never `device_id` / `udid` (`vendor/zscaler-sdk-python/zscaler/utils.py:809-868`).

## `getOtp` vs `getPasswords`

`getOtp` (OTP bundle) is a separate operation from `getPasswords` (password bundle). `get_passwords` is a `GET /getPasswords` keyed by `username` + `os_type` and returns a different `Passwords` model (`vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:82-130`). The `Passwords` model defines 7 `*Pass` fields — `exitPass`, `logoutPass`, `uninstallPass`, `zdSettingsAccessPass`, `zdxDisablePass`, `ziaDisablePass`, `zpaDisablePass` (`vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_passwords.py:33-39`) — narrower than the OTP bundle and not device-UDID keyed.

## Edge cases

- **Not every device returns all 11 OTPs.** The Go test asserts that a successful `getOtp` may legitimately leave individual OTP fields empty, requiring only that at least one be populated: it checks `Otp` / `ExitOtp` / `LogoutOtp` / `RevertOtp` / `UninstallOtp` / `ZdpDisableOtp` / `ZdxDisableOtp` / `ZiaDisableOtp` / `ZpaDisableOtp` all `== ""` and raises `'Expected at least one non-empty OTP'` (`vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp_test.go:56-61`).

- **`device_id` semantics, Python only.** Passing both `udid` and `device_id` to the Python SDK keeps `udid`: the remap only fires `if "device_id" in query_params and "udid" not in query_params` (`vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:61-62`). The MCP input description explicitly says `udid` wins when both are present, and the implementation sends `args.udid or args.device_id`, producing the same precedence (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py:21-43`, `:60-67`).

## Open questions

The following appeared in surrounding tooling prose but could not be verified against SDK/API source. They are flagged unverified.

- **Short-lived label, but no expiry / TTL field.** The current MCP module and tool docstring describe the OTPs as short-lived sensitive credentials (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py:1-7`, `:53-58`). Neither SDK `OtpResponse` model carries a TTL, expiry timestamp, or validity-window field, so the precise duration and server-side expiry behavior remain unverified (`vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:33-45`; `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:15-27`). (Tracked as `zcc-76` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zcc-76-otp-expiry-ttl-server-behavior).)

- **No length/format/numeric-vs-alphanumeric constraint in source.** SDK model fields are plain `string` / `None` with no validation (`vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:33-45`; `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:16-26`), and MCP v0.14.0 passes the SDK-modeled record through without a field-level output schema (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py:46-67`).

- **OTP-to-endpoint mapping not in source.** The SDK and MCP tool return the bundle; neither wires `logout_otp` to a logout endpoint, `uninstall_otp` to an uninstall endpoint, and so on (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py:53-67`).

- **Generic `otp` relationship remains unspecified.** Neither SDK model says the generic field mirrors any operation-scoped field (`vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:39`; Go: `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:20`), and the MCP v0.14.0 tool implementation adds no field-level interpretation (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py:46-67`).
