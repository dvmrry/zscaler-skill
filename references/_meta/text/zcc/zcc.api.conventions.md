# Conventions of the ZCC v1 API: casing, query parameters, caching, status codes (zcc.api.conventions)
Also called: zcc api camelcase; zcc page pageSize; zcc api caching dummy parameter; zcc getOtp stale; zcc api error codes; zcc 415 unsupported media type; zcc osType values; zcc get before put
Former IDs: zcc-73

This subject holds the rules that apply across the ZCC v1 endpoints rather than to one area. Path names and HTTP methods per endpoint are generated: run `node scripts/kb.mjs surface zcc`.

**Key casing.** The contract names list query parameters in camelCase, for example `page`, `pageSize`, `search` and `searchType` on `/webTrustedNetwork/listByCompany`, and the Python SDK camel-cases every ZCC query parameter key before sending, so `page_size` goes on the wire as `pageSize`. [zcc.api.conventions:query-params-camel] On the OneAPI client, the Python SDK camel-cases ZCC request body keys except those in `WebPolicy.SNAKE_CASE_KEYS`, and sends a body already serialized by the ZCC model serializer unchanged. On the legacy client a ZCC body goes through the general `convert_keys_to_camel_case`, which converts all keys recursively; a key the converter maps to itself, such as `exit_password`, keeps its form. [zcc.api.conventions:python-body-casing] Web policy bodies are the exception to camelCase: [What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate](kb:zcc.api.web-policy-wire).

**Platform codes.** The contract gives numeric platform codes for `osType` on the soft- and force-remove endpoints (`removeDevices`, `forceRemoveDevices`): 1 iOS, 2 Android, 3 Windows, 4 macOS, 5 Linux, where null means all OS types; the Go SDK defines the same device-type constants. [zcc.api.conventions:os-type-codes]

**Caching.** Zscaler's guidance is to prevent API call caching by adding a dummy argument with a randomly generated number to every request URL, for example `GET /getOtp?_=123456`. [zcc.api.conventions:dummy-argument] The Python SDK's `get_otp` sends the caller's query parameters, renaming `device_id` to `udid`, and adds no cache-busting argument of its own. [zcc.api.conventions:python-otp-no-cache-buster]

**Writes.** Zscaler recommends sending a GET before every PUT or POST that updates a resource, because the update replaces the entire resource with the values sent. [zcc.api.conventions:get-before-put] Zscaler recommends a dedicated user for each script and not using the same keys in several scripts that run concurrently. [zcc.api.conventions:dedicated-key-per-script] Requests to every endpoint should be UTF-8 encoded. [zcc.api.conventions:utf8]

**Status codes.** The ZCC API's documented status codes are 200, 400, 401, 403, 404, 415 (Unsupported Media Type), 429 and 500. 429 means too many requests: the rate limit or a device threshold was exceeded. The table labels 500 "Not Implemented". [zcc.api.conventions:status-codes] Rate limits are in [ZCC API rate limits: 100 calls an hour, 3 a day for downloads, and how the SDKs back off](kb:zcc.api.rate-limits). Whether that 500 label reflects intended behavior or a documentation error is open [gap:zcc.api.conventions:status-500-label].

What to check:
1. Whether a repeated GET such as `/getOtp` carried a random dummy query argument, when it returned a value that looks stale.
2. Whether a hand-built request used the camelCase names, such as `pageSize` in a list query, and gave the platform as its numeric code where the contract asks for one: `deviceType` in the web policy list query, `osType` on the soft- and force-remove endpoints.
3. Whether a 429 came from the hourly limit or from a device threshold, which the error-code table names as a second cause.

Not known (open gaps):
- HTTP 500 labeled "Not Implemented" in the ZCC API reference [gap:zcc.api.conventions:status-500-label]: settled by support-ticket or operator-experience

Area: zcc.api, its subjects in references/_meta/spine/zcc/zcc.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.api.rate-limits.md (ZCC API rate limits: 100 calls an hour, 3 a day for downloads, and how the SDKs back off)
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)
