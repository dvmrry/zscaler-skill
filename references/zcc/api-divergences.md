---
product: zcc
topic: "api-divergences"
title: "ZCC API source divergences"
content-type: reference
confidence: medium
source-tier: code
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: e7f5f7efb56b6e24667f183e5dff3da03e039cc9
  vendor/terraform-provider-zcc: 37aaa1f69786ee5263b358c5248a5b4ce014ebb8
sources:
  - "vendor/zscaler-api-specs/automate-zscaler/zcc-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/**"
  - "vendor/zscaler-sdk-python/zscaler/zcc/**"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_response.py"
  - "vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend.go"
  - "vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend_test.go"
author-status: draft
---

# ZCC API source divergences

The captured Automate operation contract, Go SDK, Python SDK, Terraform provider, and MCP tools are independent views of the same ZCC management API (`/zcc/papi/public/...`), produced separately and updated at different cadences. Where they agree, confidence is high. Where they diverge, an engineer needs to know which source to trust before writing code — and the answer changes by field, endpoint, and resource type.

ZCC is the most divergence-rich of the Zscaler SDK pairs. Two pressures drive it: (1) the ZCC web API returns numeric fields inconsistently — sometimes as JSON numbers, sometimes as quoted strings, sometimes camelCase, sometimes snake_case, and the casing of the *same* logical field can differ per platform and per SDK; (2) the Go SDK was refactored more recently than the Python SDK baseline, splitting some services into new packages and adding three `/v2` services (`notification_template`, `zia_posture`, `trusted_network_v2`) the current Python SDK does not yet expose on the v2 path.

**Quick trust hierarchy (applies unless an entry below overrides it):**

- Go SDK service layer > Python SDK > help captures (per the SDK-as-ground-truth rule). The Go ZCC service files carry inline comments documenting wire behavior captured from real UI-generated request bodies; those are the strongest signal short of a live tenant.
- For **reads** (decoding a GET/listByCompany response), trust whichever SDK models the richer / more permissively-typed shape — frequently this is the one using a string-or-number tolerant type.
- For **writes**, trust the Go SDK or direct HTTP: several Python ZCC write methods send hardcoded empty bodies (see Entitlements below) and are effectively no-ops.
- When the GET and POST/PUT shapes of the *same* resource disagree on a field's type, that is the API's own contract — not an SDK bug. Build write bodies from the request struct, never by echoing back the GET struct.

## Python SDK flat-array pagination (v1.9.42+, reverified at v1.9.44)

The Python SDK's former flat-list handling is no longer a reason to treat a ZCC list response as complete. In v1.9.42, retained in the v1.9.44 source pinned in front matter, `ZscalerAPIResponse` stopped marking ZCC JSON arrays as non-paginated (`vendor/zscaler-sdk-python/CHANGELOG.md:23-31`; `vendor/zscaler-sdk-python/zscaler/oneapi_response.py:173-192`). `has_next()`/`next()` can therefore traverse a ZCC flat-array list such as `list_devices`; a caller-provided `page` initializes the internal one-based counter so continuation starts at the following page (`oneapi_response.py:90-96,364-447`).

The SDK-side page metadata is default 50, minimum 1, and maximum 5000 (`oneapi_response.py:21-26`). A supplied `page_size` is normalized to the outbound `pageSize` key, but its value is not rewritten or rejected (`vendor/zscaler-sdk-python/zscaler/request_executor.py:504-509`). The response wrapper separately clamps only its local continuation limit to [1, 5000]; because selection is truthiness-based, explicit zero remains `pageSize=0` on the wire while the local limit is treated as unset (`oneapi_response.py:98-106`, `:126-142`). If no page size is supplied, the wrapper leaves it unset and lets the API choose its default (`oneapi_response.py:126-134`). With no response total, `has_next()` uses page fullness: any non-empty first page is a candidate for continuation even when short, a subsequent explicitly sized page continues only when it meets the local limit, and an omitted size can result in one extra empty-page probe (`oneapi_response.py:449-503`). An empty speculative fetch returns `(None, response, None)` rather than raising `StopIteration`; `StopIteration` applies only when `next()` starts with no candidate page (`oneapi_response.py:364-389`).

This corrects any older claim that a ZCC flat array is inherently non-paginated or that the Python SDK cannot walk it. It does **not** certify a backend guarantee for every ZCC list endpoint. The retained Automate contract documents `page`/`pageSize`, default 50, and max 5000 for `GET /papi/public/v1/getDevices`, but does not document a minimum, total-page metadata, or a universal rule for every ZCC list response (`vendor/zscaler-api-specs/automate-zscaler/zcc-api-reference.json:7761-7790`). The wrapper has no total, duplicate-page detection, or maximum-page guard, so a backend that ignores `page` and repeats a non-empty response can sustain an unbounded naïve loop (`oneapi_response.py:391-503`). Use bounded, duplicate-aware collection and verify endpoint/tenant response semantics separately.

**Contract reconciliation now feeds this doc.** For documented method/path and field metadata (`required`, `readonly`, `enum`), the verification protocol prefers the captured Automate contract when it exists; Terraform validators remain authoritative only for what the provider accepts, and SDKs remain authoritative for wrapper behavior (`references/_meta/verification-protocol.md:114-118`). The generated ZCC reconciliation diffs `vendor/zscaler-api-specs/automate-zscaler/zcc-api-reference.json` against Go, Python, Terraform, Ansible, and MCP surfaces (`vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md:7-11`). It currently covers 4 mapped resources, with 6 contract-vs-Go primitive type drifts, 1 contract-vs-Terraform required-flag drift, 3 one-sided enum constraints, no enum value conflicts, no Ansible surface, Python present for all 4 resources, and MCP present for 1 (`vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md:13-28`).

The generated report also records the ZCC boundary conditions that the prose below should not paper over: `zcc_trusted_network` is not reconciled because Automate currently exposes only older v1 `webTrustedNetwork` operations. The refreshed Terraform provider probes its v2 path and falls back to a v1 adapter for statuses it classifies as endpoint-unavailable, including generic 400/403 responses; this is a provider classification, not a resolution of v1/v2 authority or backend state (`vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md:32-35`; `vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend.go:155-199`; `vendor/terraform-provider-zcc/internal/framework/tnbackend/tnbackend_test.go:258-292`). `zcc_notification_template` and `zcc_zia_posture` still have Terraform resources but no matching captured Automate operations.

---

## Forwarding Profile (`/webForwardingProfile`)

The Go SDK splits forwarding profiles into a **GET/response** struct (`forwarding_profile.go`) and a separate **POST/request** struct (`forwarding_profile_request.go`) precisely because the API uses different field names and types for reads vs writes. The file header says so explicitly. (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile_request.go:3-4`)

### `enableLWFDriver` — string on GET, int on POST

**What each source says:**

- **Go SDK (GET):** `EnableLWFDriver string` — the read response carries it as a string. (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go:25`)
- **Go SDK (POST):** `EnableLWFDriver int` — the write body carries it as an integer. (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile_request.go:19`)

**Significance / which to trust:** A tool that builds a POST body by copying the GET struct will send the wrong type. Use the request struct for writes; the field is int on the wire when writing.

---

### `blockUnreachableDomainsTraffic` and `mtuForZadapter` — string-or-number on GET, plain string on POST

**What each source says:**

- **Go SDK (GET, `ForwardingProfileAction`):** both fields are typed `IntOrString` — the read response may return either an int or a quoted string. (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go:58-59`)
- **Go SDK (POST, `ForwardingProfileActionRequest`):** both are plain `string`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile_request.go:42,48`)
- The same string-on-POST pattern repeats in the unified-tunnel write struct: `blockUnreachableDomainsTraffic` and `mtuForZadapter` are `string`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile_request.go:108,113`)

**Significance / which to trust:** The GET-vs-POST type asymmetry is the API's contract. Send these as strings on writes; tolerate either form on reads.

---

### `IntOrString` custom unmarshaller — why it exists

**What each source says:**

- **Go SDK:** defines `type IntOrString int` with a custom `UnmarshalJSON` that accepts a JSON number *or* a quoted numeric string. (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go:141-160`)
- Several GET-response enum/numeric fields (`dropIpv6Traffic`, `redirectWebTraffic`, `latencyBasedZenEnablement`, `dropIpv6TrafficInIpv6Network`, etc.) are typed `IntOrString` for the same reason. (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go:63-73`)

**Significance / which to trust:** This type exists because the ZCC API returns these fields inconsistently as int *or* quoted-string on reads. A strict-typed Python decode of the same field can fail on the form it does not expect. Treat these as "numeric, possibly quoted."

---

### `isSameAsOnTrustedNetwork` — bool on GET, `*bool` pointer (omitempty) on POST

**What each source says:**

- **Go SDK (GET):** `IsSameAsOnTrustedNetwork bool` with `omitempty` — the lone boolean among the otherwise all-integer action toggles. (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go:80`)
- **Go SDK (POST):** `IsSameAsOnTrustedNetwork *bool` with `omitempty` — a nullable pointer, so an explicit `false` is distinguishable from "unset." (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile_request.go:68`)

**Significance / which to trust:** On writes use the pointer form so a deliberate `false` is sent rather than omitted. On reads the value is a plain bool.

---

### Python-vs-Go field coverage — three Go-only action fields

**What each source says:**

- **Go SDK:** `optimiseForUnstableConnections` and `sendAllDNSToTrustedServer` appear on the action structs, and `trustedNetworkIdsSelected` on the profile. (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go:62,74,44`)
- **Python SDK (v1.9.33):** the field-coverage gap that earlier docs described is now mostly closed; these specific fields remain Go-only at this pin.

**Significance / which to trust:** For these three fields, trust the Go SDK. Most of the rest of the forwarding-profile surface is now mirrored in both SDKs at v1.9.33.

---

## Web Policy (`/web/policy`, `/webPolicy`)

The Go `web_policy.go` was rewritten to match the wire shape captured from working UI-generated request bodies, and carries the richest set of inline contract notes in the ZCC SDK. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:385-396`)

### `install_ssl_certs` / `installCerts` — wire-key casing differs per platform AND per SDK

This is the single most error-prone ZCC field. The same logical "install SSL certs" toggle is serialized snake_case in some platform sub-policies and camelCase in others — and the two SDKs disagree on *which* platform uses *which* casing.

**What each source says:**

- **Go SDK — macOS (`MacPolicy`):** snake_case `install_ssl_certs`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:408`)
- **Python SDK — macOS (`MacOSPolicy`):** camelCase `installCerts`. (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:1106`)
- **Go SDK — Windows sub-policy:** camelCase `installCerts`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:465`)
- **Python SDK — Windows (`WindowsPolicy`):** snake_case `install_ssl_certs`. (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:837`)
- **Python SDK — Linux / Android / iOS:** camelCase `installCerts` (Linux `:930`, Android `:1025`). (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:930,1025`)

So the casing is **inverted between the two SDKs for both macOS and Windows.**

**Significance / which to trust:** Trust the platform sub-policy struct you are actually serializing, not a single global rule. See the next entry for why getting this wrong fails silently.

---

### The `/web/policy/edit` endpoint silently ignores wrong-cased keys

**What each source says:**

- **Go SDK:** the inline contract note states the `/web/policy/edit` (OneAPI) endpoint accepts password/cert fields **only** in the exact casing the API expects; an earlier version of the struct used camelCase tags which the API "silently ignored, leading to `{\"success\":\"false\",\"id\":0}` on `/edit`." (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:385-396`)

**Significance / which to trust:** A wrong-cased password or cert field is not rejected with an error — the write returns a false-success body (`success:"false"`, `id:0`) and the change is dropped. This is the practical reason the per-platform casing above matters: the failure is invisible unless you read the response body. Trust the captured-from-UI casing in the Go struct for `/edit` writes.

---

### `install_ssl_certs` is a JSON number, not a bool/string

**What each source says:**

- **Go SDK:** `InstallSslCerts common.IntOrString` (and `InstallSslCertsTop`) — modeled as the int-or-string tolerant type because the wire value is a JSON number. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:186,408`)

**Significance / which to trust:** Do not model this as a boolean. It is numeric on the wire (and may arrive quoted).

---

### `WebPolicy.id` — unquoted int on `/edit`, string on `listByCompany`

**What each source says:**

- **Go SDK:** a custom `WebPolicy.UnmarshalJSON` decodes `id` from either a JSON string (`"123"`) or a JSON number (`123`), because `/edit` returns the id unquoted (`{\"success\":\"true\",\"id\":205241}`) while `listByCompany` typically returns it as a string. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:653-668`) The bare `/edit` response is modeled separately as `EditResponse` with `ID json.Number`. (`web_policy.go:669-677`)

**Significance / which to trust:** Normalize `id` to a string after decode regardless of source endpoint. A strict string-typed decode of the `/edit` response will fail on the unquoted integer.

---

### `listByCompany` returns JSON numbers where the struct expects strings

**What each source says:**

- **Go SDK:** `GetWebPolicyByID` does a two-phase lookup because `listByCompany` returns untyped maps where many fields come back as JSON numbers even though the strict `WebPolicy` struct types them as strings (e.g. `"active":1.0`). When strict decode fails it returns a minimally-hydrated struct alongside `ErrWebPolicyPartialDecode`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:691-710`) The `ErrWebPolicyPartialDecode` sentinel and its partial-hydration contract are declared just above. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:677-689`)

**Significance / which to trust:** On a partial-decode, the recommended pattern is to fall back to the request body just written (the PUT body is authoritative once the API confirms success). Do not assume a fully-hydrated read-back from `listByCompany`.

---

### Disaster-recovery field is `ziaDRMethod`, not `ziaDRRecoveryMethod`

**What each source says:**

- **Go SDK:** the DR method field on the real `listByCompany` response is `ziaDRMethod` (modeled as a `LabelValuePair`, `ZiaDRMethodTop`), and the boolean toggle is `enableZiaDR`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:235,480,490`)

**Significance / which to trust:** Earlier docs/structs that named this `ziaDRRecoveryMethod` were wrong. Trust `ziaDRMethod`.

---

### DR flags (`enableZiaDR`, `allowZiaTest`, `ziaDRMethod`, …) — concretely typed in Go, untyped in Python

**What each source says:**

- **Go SDK:** the `DisasterRecovery` struct types the flags concretely — `AllowZiaTest`, `AllowZpaTest`, `EnableZiaDR`, `EnableZpaDR` as `bool`, and `ZiaDRMethod` as `int`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:487-494`)
- **Python SDK:** the `DisasterRecovery` model stores the same fields as plain untyped `config[...]` reads defaulting to `None` — no bool/int coercion (`enable_zia_dr`, `zia_dr_method`, `allow_zia_test`, …). (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:612,627-640`)

**Significance / which to trust:** A hand-built payload that quotes these booleans (`"enableZiaDR":"true"`) round-trips through Python's loose model but fails Go's `bool`/`int` typing. Send `enableZiaDR`/`enableZpaDR`/`allowZiaTest`/`allowZpaTest` as JSON booleans and `ziaDRMethod` as a JSON number; trust the Go struct for the wire types.

---

### `device_type` — JSON number; the string companion is unmodelled; `deviceType` is a second int

**What each source says:**

- **Go SDK:** `device_type` is a JSON number (`DeviceType int`) following the enum `1=iOS, 2=Android, 3=Windows, 4=macOS, 5=Linux`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:65-66,99`)
- The header comment states the API *also* returns a companion `deviceType` **string** on reads (e.g. `"DEVICE_TYPE_MAC"`) that is **intentionally not modelled**, because callers already know which device type they are working with. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:66-69`)
- A separate `DeviceTypeAlt int` field carries the `deviceType` JSON key — but it is a second *integer*, not the string enum the header comment describes. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:323`)
- The numeric enum constants are defined in the shared common package. (`vendor/zscaler-sdk-go/zscaler/zcc/services/common/common.go:87-91`)

**Significance / which to trust:** Filter writes by the numeric `device_type`. The human-readable `"DEVICE_TYPE_*"` string companion is not exposed by the Go struct at all (deliberately dropped); the `deviceType`-tagged Go field that *does* exist (`DeviceTypeAlt`) is itself an int, so do not expect the string enum from it.

---

### `/web/policy/edit` echo-back contract — `LabelValuePair` UI form-state objects

**What each source says:**

- **Go SDK:** `LabelValuePair` models the `{label, value}` UI form-state objects (e.g. `logModeSelected`, `ruleOrderSelectedOption`, `billingDaySelectedOption`, `browserAuthType`, `ziaDRMethod`) that the `/web/policy/edit` endpoint expects echoed back in the PUT body. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:20-32`)

**Significance / which to trust:** A write to `/web/policy/edit` must carry these `{label,value}` selection objects, not just the scalar values. This echo-back requirement is not represented in the Python model. Trust the Go struct for `/edit` PUT body shape.

---

### `onNetPolicy` — Python-only model block

**What each source says:**

- **Python SDK:** defines an `OnNetPolicy` model class. (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:685`)
- **Go SDK:** the `WebPolicy` struct has no `onNetPolicy` field.

**Significance / which to trust:** Only the Python model exposes `onNetPolicy`. Verify against a live tenant before relying on it via the Go SDK.

---

### Python `SNAKE_CASE_KEYS` set vs camelCase emission

**What each source says:**

- **Python SDK:** `WebPolicy.SNAKE_CASE_KEYS` lists keys including `enable_zia_dr`, `truncate_large_udpdns_response`, and `purge_kerberos_preferred_dc_cache`, but `request_format()` emits them camelCase (`enableZiaDR`, `truncateLargeUDPDNSResponse`, `purgeKerberosPreferredDCCache`). (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:29-80,588-590,665`)
- **Go SDK:** confirms camelCase on the wire — `enableZiaDR` is a camelCase JSON tag. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:490`)

**Significance / which to trust:** For these specific keys the wire form is camelCase; the snake_case set is an input-acceptance convenience, not the emitted shape.

---

## Web Policy — Python per-class wire-key serializer

**What each source says:**

- **Python SDK:** ships a ZCC-only serialization layer (`_serialize.py`, `_field_introspect.py`) that maps a model's snake_case attributes into the exact wire-key casing each model class declares — explicitly because "the same snake_case attribute can map to different wire keys depending on which model class it belongs to (e.g. `WindowsPolicy.disable_password` -> `disable_password` (snake) vs `LinuxPolicy.disable_password` -> `disablePassword`)." (`vendor/zscaler-sdk-python/zscaler/zcc/_serialize.py:5-16`)
- **Python SDK — MacOSPolicy read/write asymmetry:** reads `disablePassword` (camel) but its `request_format()` emits `disable_password` (snake). (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:1095` read vs `request_format` emitting `disable_password`)

**Significance / which to trust:** The Python SDK had to introduce per-class wire-key machinery for the same reason the Go SDK uses platform-specific structs: there is no single snake↔camel rule for ZCC. Trust the per-class declared wire key, never a global converter.

---

## Web Privacy (`/getWebPrivacyInfo`)

### All booleans are `'1'`/`'0'` strings, not JSON booleans

**What each source says:**

- **Go SDK:** every `WebPrivacyInfo` field is typed `string`, including the toggles. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_privacy/web_privacy.go:18-31`)
- **Python SDK:** the corresponding model fields are untyped (`Any`).

**Significance / which to trust:** These are string-encoded booleans on the wire (`"1"`/`"0"`), not JSON `true`/`false`. Compare against the string forms.

---

### Three Go-only Web Privacy fields

**What each source says:**

- **Go SDK:** `enableAutoLogSnippet`, `enforceSecurePacUrls`, and `enableFQDNMatchForVpnBypasses` exist on the struct (and on the wire). (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_privacy/web_privacy.go:29-31`)
- **Python SDK:** the model does not declare these three fields.

**Significance / which to trust:** Python can pass these via kwargs on a write but will not read them back into a typed attribute. Trust the Go SDK for reading these three.

---

## Entitlements (`/zpaGroupEntitlements`, `/zdxGroupEntitlements`)

### Group lists — `List[str]` in Python vs structured items in Go

**What each source says:**

- **Python SDK:** `ZpaGroupEntitlements` coerces `group_list` and `device_group_list` to `List[str]` via `ZscalerCollection.form_list(..., str)`, discarding the per-entry `active`/`authType`/`groupId`/`groupName`/`zpaEnabled` detail. (`vendor/zscaler-sdk-python/zscaler/zcc/models/zpagroupentitlements.py:43-46`)
- **Go SDK:** models them as `[]DeviceGroupItem` and `[]GroupListItem` structs carrying `active`/`authType`/`groupId`/`groupName`/`zpaEnabled` (and `DeviceGroup` with `upmEnabled`). (`vendor/zscaler-sdk-go/zscaler/zcc/services/entitlements/entitlements.go:32-63`)

**Significance / which to trust:** Trust Go for structured per-group state. The Python model flattens each entry to a string and loses the enable/auth flags.

---

### Python entitlement update methods send an empty body — writes are no-ops

**What each source says:**

- **Python SDK:** both `update_zdx_group_entitlement` (PUT `/updateZdxGroupEntitlement`) and `update_zpa_group_entitlement` (PUT `/updateZpaGroupEntitlement`) build `body = {}` with no payload parameter. (`vendor/zscaler-sdk-python/zscaler/zcc/entitlements.py:97,176`)
- **Go SDK:** `UpdateZpaGroupEntitlements` / `UpdateZdxGroupEntitlements` send the full populated struct. (`vendor/zscaler-sdk-go/zscaler/zcc/services/entitlements/entitlements.go:72,112`)

**Significance / which to trust:** For writes, trust Go or direct HTTP. The Python update methods send an empty body and do not mutate the entitlement state.

---

## Devices (`/getDevices`, `/getDeviceDetails`, `/downloadDevices`, `/removeDevices`)

### `state` / `type` wire-type inconsistency *within* the Go SDK

**What each source says:**

- **Go SDK (`GetDevices`):** `State int`, `Type int`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/devices/devices.go:40,42`)
- **Go SDK (`DeviceDetails`):** `State string`, `Type string`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/devices/devices.go:80,82`)

**Significance / which to trust:** The same logical wire fields (`state`, `type`) are typed int on the list endpoint and string on the detail endpoint — within a single SDK. This reflects the two endpoints returning different encodings; decode per-endpoint, not per-field-name.

---

### `DeviceDetails` field count — Python ~57 vs Go 26

**What each source says:**

- **Python SDK:** the `DeviceDetails` model carries ~57 fields including the full `zia/zpa/zdx/zd/zdp` enabled/health/lastSeen family, `antiTamperingStatus`, `vdi`, `zccUpgradeStatus`, `strictEnforcement`, and a `logFetchInfo` sub-object. (`vendor/zscaler-sdk-python/zscaler/zcc/models/devices.py:284-500`)
- **Go SDK:** `DeviceDetails` carries 26 fields. (`vendor/zscaler-sdk-go/zscaler/zcc/services/devices/devices.go:61-88`)

**Significance / which to trust:** Trust Python for service-health / posture / anti-tamper audits — it models the per-service health and ZDP fields the Go struct omits.

---

### `/downloadDisableReasons` is Python-only

**What each source says:**

- **Python SDK:** `download_disable_reasons` calls GET `/downloadDisableReasons`. (`vendor/zscaler-sdk-python/zscaler/zcc/devices.py:198,263`)
- **Go SDK:** the `download_devices` package exposes only `DownloadDevices` (`/downloadDevices`) and `DownloadServiceStatus` (`/downloadServiceStatus`) — no `downloadDisableReasons` equivalent exists anywhere in the Go ZCC services. (`vendor/zscaler-sdk-go/zscaler/zcc/services/download_devices/download_devices.go:13-14`)

**Significance / which to trust:** `/downloadDisableReasons` is reachable only via Python (or direct HTTP). Note the client-side rate-limit tracking in the Python legacy client covers `/downloadDevices` but not `/downloadDisableReasons`, so client-side enforcement of the documented "3/day per download endpoint" server contract is incomplete for this endpoint.

---

### Go SDK package split — `devices/`, `download_devices/`, `remove_devices/`

**What each source says:**

- **Go SDK:** device download and removal were split into their own packages. Removal functions were renamed: `SoftRemoveDevices` (POST), `ForceRemoveDevices`, `RemoveMachineTunnel`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/remove_devices/zcc_remove_devices.go:31,44,57`)
- **Python SDK:** keeps `remove_devices`, `force_remove_devices`, `remove_machine_tunnel` on the single `devices` service. (`vendor/zscaler-sdk-python/zscaler/zcc/devices.py:508,572,635`)

**Significance / which to trust:** Coverage is equivalent; only the Go package layout and the `SoftRemoveDevices` naming differ. Translating method names across SDKs requires the mapping above.

---

## Trusted Networks (`/webTrustedNetwork` v1 and `/v2/trusted-networks`)

### Two parallel surfaces in the Go SDK — v1 verb-suffixed and v2 RESTful

**What each source says:**

- **Go SDK (v1):** `trusted_network` package targets `/zcc/papi/public/v1/webTrustedNetwork` with verb-suffixed paths (`/create`, `/edit`, `/listByCompany`, `/{id}/delete`). (`vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/trusted_network.go:15,143,183,210`)
- **Go SDK (v2):** `trusted_network_v2` package targets `/zcc/papi/public/v2/trusted-networks` with RESTful verbs (`POST`, `GET /{id}`, `PUT /{id}`, `PATCH /{id}`). (`vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network_v2/trusted_network_v2.go:15,66,102,111,127`)
- **Python SDK (v1.9.33):** has the v1 `trusted_networks` service; no `/v2/trusted-networks` equivalent.

**Significance / which to trust:** Callers must consciously pick a surface. The two coexist in the Go SDK simultaneously; the v2 surface is Go-only at this pin.

---

### `conditionType` — int (Go) vs `str` (Python docstring) vs untyped (Python model)

**What each source says:**

- **Go SDK:** `ConditionType int`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/trusted_network.go:22`)
- **Python SDK (service docstring):** documents `condition_type (str)`. (`vendor/zscaler-sdk-python/zscaler/zcc/trusted_networks.py:103`)
- **Python SDK (model):** `condition_type` is stored untyped (whatever the config map holds). (`vendor/zscaler-sdk-python/zscaler/zcc/models/trustednetworks.py:39`)

**Significance / which to trust:** It is numeric on the wire (Go). The Python docstring's `str` is misleading. The int→AND/OR semantic mapping is not enumerated in either SDK (open question below).

---

### `errorCode` mutation semantics — `"0"` means success

**What each source says:**

- **Go SDK:** `validateTrustedNetworkMutationResponse` treats `errorCode == "0"` (and empty) as success; any other value is an error. POST `/create` and PUT `/edit` return e.g. `{\"success\":\"true\",\"errorCode\":\"0\"}`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/trusted_network.go:44,49-54`)

**Significance / which to trust:** `errorCode` is a string and `"0"` is the success sentinel. In Python the string `"0"` is truthy, so a naive `if resp.get("errorCode")` would misread success as failure. Compare against the literal string.

---

### Create does not return the object — Go re-fetches with retry

**What each source says:**

- **Go SDK:** POST `/webTrustedNetwork/create` returns only `{success, errorCode}`, so `CreateTrustedNetwork` re-fetches by name with a retry loop (sleeping 2s between attempts) to obtain the created object. `UpdateTrustedNetwork` similarly re-fetches by id because PUT returns only success/errorCode. (`vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/trusted_network.go:146,164-165,194`)
- **Python SDK:** does not implement the same re-fetch-with-retry workaround.

**Significance / which to trust:** Expect create/edit mutation responses to omit the resource body. The Go SDK works around it; a direct-HTTP or Python caller must re-fetch to get the persisted object (and may hit eventual-consistency lag, hence the retry).

---

### `/edit` HTTP method is non-uniform across ZCC resources

**What each source says:**

- **Go SDK:** the verb-suffixed `/edit` endpoint uses different HTTP methods per resource:
  - `webForwardingProfile/edit` — **POST**. (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go:197`)
  - `webFailOpenPolicy/edit` — **PUT**. (`vendor/zscaler-sdk-go/zscaler/zcc/services/failopen_policy/failopen_policy.go:68`)
  - `webTrustedNetwork/edit` — **PUT**. (`vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/trusted_network.go:186`)
  - `web/policy/edit` — **PUT**. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:864-867`)

**Significance / which to trust:** A direct-HTTP caller cannot assume `/edit` is uniformly PUT or POST. Forwarding-profile edit is POST; the others are PUT. Use the per-resource method above.

---

## Company / Support / Manage-Pass — write-path asymmetry

### `setCompanyInfo` — Go has the write path, Python is read-only

**What each source says:**

- **Go SDK:** `SetCompanyInfo` does PUT `/setCompanyInfo`; `CompanyInfo` carries the support/logging int toggles `supportEnabled`, `fetchLogsForAdminsEnabled`, `supportTicketEnabled`, `disableLoggingControls`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/company/company.go:14,41-45,355`)
- **Python SDK:** `company.py` exposes only `get_company_info` (read). (`vendor/zscaler-sdk-python/zscaler/zcc/company.py:31`)

**Significance / which to trust:** To *write* company/support/logging config, use the Go SDK or direct HTTP. Python can only read it. These int toggles are an SDK-readable config surface that is otherwise thinly documented.

---

### `manage_pass` — Go has a service, Python has only a model

**What each source says:**

- **Go SDK:** `UpdateManagePass` is a real service function. (`vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go:35`)
- **Python SDK:** ships `models/manage_pass.py` but no `manage_pass.py` service — the model has no method to call.

**Significance / which to trust:** Same Python-vs-Go gap as `setCompanyInfo`: the Python model exists but cannot be invoked. Use Go / direct HTTP for manage-pass writes.

---

## Admin Users (`/getAdminUsers`, `/editAdminUser`)

### `AdminUser.serviceType` — Go migrated string → int

**What each source says:**

- **Go SDK:** `ServiceType int`, with an inline comment that it was changed from string to int to fix a `json: cannot unmarshal number into Go struct field` decode error — i.e. the API returns it as a JSON number. (`vendor/zscaler-sdk-go/zscaler/zcc/services/admin_users/admin_users.go:30-36`)
- **Python SDK / older Go / docs:** disagree (string).

**Significance / which to trust:** `serviceType` is numeric on the wire. Trust the current Go `int` typing; a string-typed decode fails.

---

## v1 vs v2 pagination

**What each source says:**

- **v1 services** use page-based pagination: `QueryParams{Page, PageSize}` with `DefaultPageSize = 50`, `MaxPageSize = 5000`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/common/common.go:82-83,145-147`)
- **The three v2 services** (`notification_template`, `zia_posture`, `trusted_network_v2`) use offset-based pagination: `QueryParamsV2{Skip, PerPage}` returned in a `PaginatedResponseV2[T]` envelope. (`vendor/zscaler-sdk-go/zscaler/zcc/services/common/common.go:167-169,268`)

**Significance / which to trust:** Paginate v2 endpoints with `skip`/`perPage`, not `page`/`pageSize`. The two families share no pagination shape.

For the Python v1 flat-array traversal and its client-side heuristics, see [Python SDK flat-array pagination](#python-sdk-flat-array-pagination-v1942-reverified-at-v1944).

---

## Go-only `/v2` services with no Python equivalent

**What each source says:**

- **Go SDK:** `notification_template` (`/zcc/papi/public/v2/notification-templates`), `zia_posture` (`/zcc/papi/public/v2/zia-posture-profiles`), and `trusted_network_v2` (`/zcc/papi/public/v2/trusted-networks`) each provide full CRUD on the `/v2` path prefix the rest of ZCC does not use. `NotificationTemplate` carries `ziaNotificationTemplate` (with granular `enableZiaFirewall`/`enableZiaDNS`/`enableZiaIPS` toggles and their popup variants) and `zpaNotificationTemplate` sub-templates; `ZIAPosture` carries `highTrustCriteria`/`mediumTrustCriteria`/`lowTrustCriteria` each holding a `cs []TrustCriteriaSet`; `TrustedNetworkV2` is the RESTful replacement for the v1 verb-suffixed surface and is documented separately above. (`vendor/zscaler-sdk-go/zscaler/zcc/services/notification_template/notification_template.go:15,39-49`, `vendor/zscaler-sdk-go/zscaler/zcc/services/zia_posture/zia_posture.go:15,34-48`, `vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network_v2/trusted_network_v2.go:15`)
- **Python SDK (v1.9.33):** has no equivalents for any of the three services.

**Significance / which to trust:** These three surfaces are reachable only via the Go SDK (or direct HTTP) at this pin. They each warrant their own reference (see index.md topic gaps).

---

## Two parallel App-Profile APIs — legacy `/webPolicy` vs modern `/application-profiles`

**What each source says:**

- **Legacy:** the `WebPolicy` surface (`/web/policy`, `/webPolicy`) documented in `web-policy.md`. (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`)
- **Modern (Python):** `client.zcc.application_profiles` — REST GET `/application-profiles`, GET `/application-profiles/{id}`, PATCH `/application-profiles/{id}`. The `ApplicationProfile` model overlaps `WebPolicy` on `logMode`/`logLevel`/`logFileSize` and `forwardingProfileId`, and adds `reactivateWebSecurityMinutes` (minutes before web security is reactivated after a user-initiated disable; `web_policy.py:183` docstring: "Minutes after which Web Security is reactivated when disabled by the user" — not captive-portal grace; the captive-portal grace field is `captivePortalWebSecDisableMinutes` on `FailOpenPolicy`), a `PolicyExtension` block (fail-close family `zccFailCloseSettings*`, `dropQuicTraffic`, `enableAntiTampering`, `locationRulesetPolicies`, `generateCliPasswordContract`), and a `DisasterRecovery` block. (`vendor/zscaler-sdk-python/zscaler/zcc/application_profiles.py:80,126,221`, `vendor/zscaler-sdk-python/zscaler/zcc/models/application_profiles.py:23,45-47,49,69,78,88`, `vendor/zscaler-sdk-python/zscaler/zcc/models/application_profiles.py:402,408,427,437,448`)
- The service is wired at `vendor/zscaler-sdk-python/zscaler/zcc/zcc_service.py:129-134`.

**Significance / which to trust:** Two APIs target overlapping on-device-policy state. Consumers reconciling `logMode`/`forwardingProfileId` from both must decide which is authoritative for their tenant. The modern `/application-profiles` surface exists in **both** SDKs at this pin (Go: `vendor/zscaler-sdk-go/zscaler/zcc/services/application_profiles/application_profiles.go`; Python: `vendor/zscaler-sdk-python/zscaler/zcc/application_profiles.py`); it carries the profile-scoped user-disable reactivation field (`reactivateWebSecurityMinutes`) and fail-close fields that the legacy `WebPolicy` exposes only at company scope. Note: the captive-portal grace field is `captivePortalWebSecDisableMinutes` on the `FailOpenPolicy` (tenant-global), not `reactivateWebSecurityMinutes`.

---

## Open Questions

The following are unresolved after cross-referencing both SDKs. Each requires live-tenant verification.

1. **`conditionType` int → AND/OR mapping (trusted networks).** Go types it `int`; neither SDK enumerates which integer maps to AND vs OR (or other) detection logic. (Tracked as clarification `zcc-06`.)

2. **`device_type` complete enum vs companion `deviceType` strings.** The numeric enum `1=iOS..5=Linux` is defined (`common.go:87-91`), but the exact set of companion `deviceType` strings (`"DEVICE_TYPE_MAC"`, etc.) the API returns on reads is not exhaustively listed in either SDK — and the Go struct deliberately does not model the string companion at all (`web_policy.go:66-69`), so the SDK is not even a partial source for the value set. (Relates to clarification `zcc-04`.)

3. **`onNetPolicy` (web policy).** Present only in the Python model; whether the Go `WebPolicy` omission is a lag or a deliberate scoping is unverified against a live `listByCompany` response.

4. **`/application-profiles` Go vs Python field parity.** Both SDKs implement this surface at this pin (Go `application_profiles.go`, Python `models/application_profiles.py`); whether the Go struct and Python model diverge field-by-field — and which is authoritative when `WebPolicy` and `ApplicationProfile` disagree — is open.

5. **`/downloadDisableReasons` server-side rate-limit accounting.** Whether the documented "3/day per download endpoint" quota counts `/downloadDisableReasons` separately, shares a bucket with `/downloadDevices`, or is enforced server-side at all is not determinable from the SDK sources (Python tracks only `/downloadDevices` client-side).

6. **`/v2/trusted-networks` vs `/v1/webTrustedNetwork` authority.** Both surfaces coexist in the Go SDK. Whether a tenant should standardize on v2, and whether v1 writes and v2 writes target the same backing store, is unverified.
