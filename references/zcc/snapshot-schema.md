---
product: zcc
topic: "snapshot-schema"
title: "ZCC _data/snapshot/ schema — what's in the JSON, how to read it"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/"
  - "vendor/zscaler-sdk-python/zscaler/zcc/"
author-status: draft
---

# ZCC _data/snapshot/ schema

Operational reference for the ZCC config JSON under `_data/snapshot/<cloud>/zcc/`. Pre-written from SDK model classes (`vendor/zscaler-sdk-python/zscaler/zcc/models/`); Postman collection has no ZCC response samples (the ZCC folder in Postman is the smallest at 9 leaf items, no schemas). Validate against actual JSON when fork populates and bump confidence to `high`.

## Files written by `--zcc-only`

```
_data/snapshot/<cloud>/zcc/forwarding-profiles.json
_data/snapshot/<cloud>/zcc/trusted-networks.json
_data/snapshot/<cloud>/zcc/fail-open-policy.json
_data/snapshot/<cloud>/zcc/web-policy.json
```

## Wire-format conventions for ZCC

ZCC's wire format is unusually inconsistent compared to ZIA / ZPA. Several conventions to watch:

- **camelCase JSON keys, MOSTLY.** With one big exception: `WebPolicy` keeps certain keys as snake_case on the wire. The SDK's `SNAKE_CASE_KEYS` set in `zscaler/zcc/models/webpolicy.py` is the authoritative list. When writing payloads by hand, do NOT camelCase those fields.
- **Several fields that "look like enums" are integer-coded.** Per the cross-SDK sweep (2026-04-24): `conditionType`, `networkType`, `actionType`, `primaryTransport`, `tunnel2FallbackType` are all `int` on the wire, not strings. Several boolean-looking flags are also `int` (0/1). Clarifications `zcc-01` through `zcc-04` and `zcc-06` track this — datatype confirmed as int, integer-to-meaning mapping pending.
- **CSV strings for multi-value fields.** `dnsServers`, `trustedSubnets` etc. on TrustedNetwork are comma-separated strings, NOT JSON arrays. Tooling splits on `,` and trims whitespace.
- **List endpoints sometimes wrap, sometimes don't.** TrustedNetwork's list response wraps under `trustedNetworkContracts`. Forwarding profile's list returns a bare array.
- **ZCC endpoint paths are verb-suffixed.** `.../listByCompany`, `.../create`, `.../edit`, `.../{id}/delete` — not RESTful. The SDK abstracts this; jq queries against the JSON don't care about the path style.

See [`./api.md § Wire format quirks`](./api.md) for the full catalog.

## `forwarding-profiles.json`

API: `GET /zcc/papi/public/v1/webForwardingProfile/listByCompany` (paginated; SDK fetches all pages by default)

**Shape:** array of forwarding profile objects.

```json
[
  {
    "id": 12345,
    "name": "Engineering",
    "active": true,
    "hostname": "internal-detect.example.com",
    "resolvedIpsForHostname": "10.0.0.5,10.0.0.6",  // CSV string
    "dnsServers": "10.0.0.1,10.0.0.2",              // CSV
    "dnsSearchDomains": "internal.example.com",
    "trustedDhcpServers": "10.0.0.10",              // CSV
    "trustedGateways": "10.0.0.1",
    "trustedSubnets": "10.0.0.0/16",                // CSV of CIDRs
    "trustedEgressIps": "203.0.113.42",
    "trustedNetworkIds": "100,200,300",             // CSV of IDs
    "trustedNetworks": "office-net,vpn-net",        // resolved names (display)
    "predefinedTnAll": false,

    "conditionType": 0,                              // int — see zcc-01
    "evaluateTrustedNetwork": true,
    "skipTrustedCriteriaMatch": false,
    "enableLWFDriver": "0",                          // quoted string on the GET read shape (Go GET struct declares `EnableLWFDriver string`, forwarding_profile.go:25)
    "enableSplitVpnTN": false,

    // Per-network ZIA actions
    "forwardingProfileActions": [
      {
        "networkType": 0,                            // int — TRUSTED, UNTRUSTED, etc. — zcc-02
        "actionType": 1,                             // int — TUNNEL, PAC, NONE, etc. — zcc-03
        "primaryTransport": 0,                       // int — TLS, DTLS — zcc-04
        "tunnel2FallbackType": 0,                    // zcc-06
        "enablePacketTunnel": true,
        "allowTLSFallback": true,
        "useTunnel2ForProxiedWebTraffic": false,
        "useTunnel2ForUnencryptedWebTraffic": false,
        "redirectWebTraffic": true,
        "systemProxy": false,
        "systemProxyData": null,
        "customPac": null,
        "zenProbeInterval": 60,
        "zenProbeSampleSize": 5,
        "zenThresholdLimit": 100,
        "dropIpv6Traffic": false,
        "dropIpv6TrafficInIpv6Network": false,
        "pathMtuDiscovery": true,
        "mtuForZadapter": 1500,
        "dtlsTimeout": 30,
        "tlsTimeout": 30,
        "udpTimeout": 30,
        "blockUnreachableDomainsTraffic": false,
        "sendAllDNSToTrustedServer": false
      }
    ],

    // Per-network ZPA actions (same shape, applied to ZPA)
    "forwardingProfileZpaActions": [
      {
        "networkType": 0,
        "actionType": 1,
        // ... same field set, parallel to ZIA actions
      }
    ]
  }
]
```

Full SDK model: `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py`. Reasoning: [`./forwarding-profile.md`](./forwarding-profile.md).

> **POST/edit shape diverges from the GET read shape.** The Go `ForwardingProfileRequest` (the body sent to `.../edit`) is flatter and integer-typed: fields like `active`, `evaluateTrustedNetwork`, `enableSplitVpnTN`, `enableLWFDriver` are all `int` (`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile_request.go:13-30`). The per-network action structs in the POST body still carry a single `actionType int` each (`ForwardingProfileActionRequest` `forwarding_profile_request.go:40`, `ForwardingProfileZpaActionRequest` `forwarding_profile_request.go:85`) — matching the single `actionType` seen in the read shape above. The **split** `actionTypeZIA` / `actionTypeZPA` int fields appear only in the unified-tunnel mode struct `UnifiedTunnelRequest` (`forwarding_profile_request.go:122-123`), a distinct code path used when `enableUnifiedTunnel` is set — not in the standard per-network actions. A snapshot captures the GET read shape; don't assume the two are interchangeable when hand-writing payloads.

### Common jq queries

```bash
# List forwarding profiles by name + active state
jq '.[] | {name, active, has_zia: ((.forwardingProfileActions | length) > 0), has_zpa: ((.forwardingProfileZpaActions | length) > 0)}' _data/snapshot/<cloud>/zcc/forwarding-profiles.json

# Profiles with ZPA actions configured (have ZPA forwarding logic)
jq '.[] | select((.forwardingProfileZpaActions | length) > 0) | .name' _data/snapshot/<cloud>/zcc/forwarding-profiles.json

# Count profiles per (conditionType, evaluateTrustedNetwork) combination
jq 'group_by([.conditionType, .evaluateTrustedNetwork]) | map({condition: .[0].conditionType, evaluate: .[0].evaluateTrustedNetwork, count: length})' _data/snapshot/<cloud>/zcc/forwarding-profiles.json

# Profiles using a specific Z-Tunnel 2.0 fallback mode
jq '.[] | select(.forwardingProfileActions[]?.tunnel2FallbackType != 0) | {name, fallback: .forwardingProfileActions[0].tunnel2FallbackType}' _data/snapshot/<cloud>/zcc/forwarding-profiles.json
```

## `trusted-networks.json`

API: `GET /zcc/papi/public/v1/webTrustedNetwork/listByCompany`

**Shape:** wrapped response with `trustedNetworkContracts` array (NOT a bare array — common surprise).

```json
{
  "trustedNetworkContracts": [
    {
      "id": 100,
      "name": "Office Network",
      "active": true,
      "conditionType": 0,                  // int
      "dnsServers": "10.0.0.1,10.0.0.2",   // CSV
      "dnsSearchDomains": "internal.example.com",
      "trustedDhcpServers": "10.0.0.10",
      "trustedGateways": "10.0.0.1",
      "trustedSubnets": "10.0.0.0/16",
      "trustedEgressIps": "203.0.113.42",
      "ssids": "Corporate-WiFi,Corp-Guest",   // CSV of SSID names
      "hostnames": "internal-detect.example.com",
      "resolvedIpsForHostname": "10.0.0.5"
    }
  ]
}
```

Full SDK model: `vendor/zscaler-sdk-python/zscaler/zcc/models/trustednetworks.py`. Reasoning: [`./trusted-networks.md`](./trusted-networks.md).

### Common jq queries

```bash
# All trusted networks with their criteria
jq '.trustedNetworkContracts[] | {name, dns: .dnsServers, ssids, subnets: .trustedSubnets}' _data/snapshot/<cloud>/zcc/trusted-networks.json

# Networks with SSID-based detection
jq '.trustedNetworkContracts[] | select(.ssids | length > 0) | {name, ssids}' _data/snapshot/<cloud>/zcc/trusted-networks.json

# Find networks an IP could match (subnet check)
jq --arg ip "10.0.0.5" '.trustedNetworkContracts[] | select(.trustedSubnets | split(",") | map(. as $cidr | $ip) | length > 0) | .name' _data/snapshot/<cloud>/zcc/trusted-networks.json
# (CIDR matching is awkward in jq; use a Python script for real subnet checks)
```

## `fail-open-policy.json`

API: `GET /zcc/papi/public/v1/webFailOpenPolicy/listByCompany`

**Shape:** wrapped response with **single** policy object inside the list (one per company). The "list" is a historical-API artifact.

The full field set is exactly what the SDK `FailOpenPolicy` model declares (`vendor/zscaler-sdk-python/zscaler/zcc/models/failopenpolicy.py:37-65`) — there are no extra captive-portal / tunnel-refresh knobs beyond these:

```json
[
  {
    "id": 1,
    "active": true,
    "companyId": 12345,
    "createdBy": 67890,
    "editedBy": 67890,
    "enableFailOpen": true,
    "enableCaptivePortalDetection": true,
    "captivePortalWebSecDisableMinutes": 60,   // int — minutes web sec stays disabled behind a captive portal
    "enableWebSecOnTunnelFailure": true,
    "enableWebSecOnProxyUnreachable": true,
    "tunnelFailureRetryCount": 3,
    "enableStrictEnforcementPrompt": false,
    "strictEnforcementPromptDelayMinutes": 0,
    "strictEnforcementPromptMessage": "..."
  }
]
```

Full SDK model: `vendor/zscaler-sdk-python/zscaler/zcc/models/failopenpolicy.py:37-65`. Reasoning: [`./forwarding-profile.md § Fail-open policy`](./forwarding-profile.md).

### Common jq queries

```bash
# Show fail-open settings
jq '.[0]' _data/snapshot/<cloud>/zcc/fail-open-policy.json

# Is fail-open enabled, and how long does web sec stay disabled at a captive portal?
jq '.[0] | {enableFailOpen, captivePortalWebSecDisableMinutes, enableCaptivePortalDetection}' _data/snapshot/<cloud>/zcc/fail-open-policy.json
```

## `web-policy.json`

API: `GET /zcc/papi/public/v1/web/policy/listByCompany` (slash-separated `web/policy`, not `webPolicy` — confirmed `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py:76` and Go `baseWebPolicyEndpoint` `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:17`)

**Shape:** array of WebPolicy objects (also called "App Profiles" in the admin UI).

```json
[
  {
    "id": 1,
    "name": "Engineering Profile",
    "active": true,

    // The forwarding-profile binding — the link from web-policy → forwarding-profile
    "forwardingProfileId": 12345,               // camelCase (NOT in SNAKE_CASE_KEYS; webpolicy.py:98,291)

    // Group / device targeting
    "deviceType": 1,                            // int — 1=iOS 2=Android 3=Windows 4=macOS 5=Linux (common.go:87-91)
    // The Go SDK comment states reads ALSO return a companion deviceType STRING like "DEVICE_TYPE_MAC",
    // but that field is intentionally not modelled (web_policy.go:65-69); wire presence not snapshot-confirmed
    "groups": [...],
    "deviceGroups": [...],
    "users": [...],

    // Per-platform sub-policies — many fields, varies by platform
    "windowsPolicy": { ... },
    "macosPolicy": { ... },
    "linuxPolicy": { ... },
    "iosPolicy": { ... },
    "androidPolicy": { ... },

    // Some keys are snake_case on the wire (the SNAKE_CASE_KEYS exception, webpolicy.py:29-81)
    "device_type": "Windows",                   // wire is snake_case
    "pac_url": "https://...",
    "reauth_period": 86400,
    "install_ssl_certs": true,                   // itself snake_case (top-level and per-platform)
    "bypass_mms_apps": [...],
    "quota_in_roaming": null,
    "wifi_ssid": null,
    "limit": null,
    "billing_day": null,
    "allowed_apps": [...],
    "custom_text": "...",
    "bypass_android_apps": [...],
    // per-platform password fields — also snake_case
    "uninstall_password": "...",
    "logout_password": "...",
    "disable_password": "...",
    // easy-to-miss snake_case members elsewhere in the model:
    "enforced": true,                            // androidPolicy
    "truncate_large_udpdns_response": false,     // policyExtension
    "purge_kerberos_preferred_dc_cache": false,  // policyExtension
    "enable_zia_dr": false                       // disasterRecovery
  }
]
```

Full SDK model: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py` — defines the `SNAKE_CASE_KEYS` set authoritatively. Reasoning: [`./web-policy.md`](./web-policy.md).

### Common jq queries

```bash
# Web policies + which forwarding profile each binds to
# (forwardingProfileId is camelCase; device_type is the snake_case string form)
jq '.[] | {name, forwardingProfileId, device_type, active}' _data/snapshot/<cloud>/zcc/web-policy.json

# Find web policy assigned to a specific forwarding profile
jq --argjson fp_id 12345 '.[] | select(.forwardingProfileId == $fp_id) | .name' _data/snapshot/<cloud>/zcc/web-policy.json

# Per-platform policy presence
jq '.[] | {name, has_win: (.windowsPolicy != null), has_mac: (.macosPolicy != null), has_ios: (.iosPolicy != null)}' _data/snapshot/<cloud>/zcc/web-policy.json
```

**Critical**: `forwardingProfileId` is the answer to clarification `zcc-07` ("how does a user get assigned to a forwarding profile?") — see [`./web-policy.md`](./web-policy.md).

## What's NOT in the snapshot

ZCC has additional resources not covered by the snapshot layout:

| Resource | Why useful |
|---|---|
| Devices (`/devices`, `/devices/details`) | Device inventory; force-remove debugging |
| App profiles (`/appProfiles`) | Distinct from web policies — the App Profile catalog |
| Web Privacy (`/webPrivacy`) | Telemetry collection settings |
| Entitlements (`/entitlements/zpa`, `/entitlements/zdx`) | Cross-product user→service assignment |
| Admin users (`/admins`, `/adminRoles`) | ZCC portal admin RBAC |
| Org info (`/orgInfo`) | Tenant-level metadata |
| IP Apps / Process Apps (`/ipApps`, `/processApps`) | Custom application definitions |
| Bypass apps (`/bypassApps`) | Apps configured to bypass Zscaler |

SDK methods for these are documented in `vendor/zscaler-sdk-python/zscaler/zcc/`.

## Wire-format gotchas (ZCC-specific)

1. **WebPolicy fields are mixed-case on the wire.** The SDK's `SNAKE_CASE_KEYS` set (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:29-81`) is the authoritative list. Top-level: `device_type`, `pac_url`, `reauth_period`, `install_ssl_certs`, `bypass_mms_apps`, `quota_in_roaming`, `wifi_ssid`, `limit`, `billing_day`, `allowed_apps`, `custom_text`, `bypass_android_apps`. Per-platform password fields: `disable_password`, `logout_password`, `uninstall_password`. Plus members easy to miss: `enforced` (Android), `truncate_large_udpdns_response` and `purge_kerberos_preferred_dc_cache` (PolicyExtension), and `enable_zia_dr` (DisasterRecovery). Note `install_ssl_certs` is itself in the snake set. All other fields are camelCase.

2. **Enum-like fields are integers.** `conditionType`, `networkType`, `actionType`, `primaryTransport`, `tunnel2FallbackType` are `int`, not string, on the GET read shape (Go `ForwardingProfile` / `ForwardingProfileAction`: `conditionType` `forwarding_profile.go:22`; `networkType`/`actionType`/`primaryTransport`/`tunnel2FallbackType` `forwarding_profile.go:48,49,54,61`). Watch `enableLWFDriver`: the GET read struct declares it `string` (`forwarding_profile.go:25`) — quoted on the wire — while the POST/edit `ForwardingProfileRequest` declares the same field `int` (`forwarding_profile_request.go:19`). The snapshot captures the GET shape, so expect the quoted-string form there.

3. **CSV strings for multi-value fields.** Don't expect arrays for `dnsServers`, `trustedSubnets`, etc. Split on comma, trim whitespace.

4. **TrustedNetwork list response is wrapped.** `.trustedNetworkContracts[]`, not `.[]`.

5. **FailOpenPolicy "list" has one item.** It's tenant-wide; the list-shape is API-historic.

6. **`forwardingProfileId` on WebPolicy is the assignment mechanism.** This was a long-open clarification (`zcc-07`) — confirmed via SDK model (`webpolicy.py:98`; camelCase, not in `SNAKE_CASE_KEYS`).

7. **WebPolicy `deviceType` int-to-name is resolved in source.** `1=iOS, 2=Android, 3=Windows, 4=macOS, 5=Linux` (`vendor/zscaler-sdk-go/zscaler/zcc/services/common/common.go:87-91`); the int is authoritative for writes. (This closes the former `zcc-09` deviceType hedge.) The Go SDK comment additionally states the API returns a companion `deviceType` string like `"DEVICE_TYPE_MAC"` on reads, but it is *intentionally not modelled* in the struct (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:65-69`) — so its wire presence is believed but not confirmed from a snapshot. See Open questions.

8. **The forwarding/trusted-network enums are still int-only-confirmed.** `conditionType`, `networkType`, `actionType`, `primaryTransport`, `tunnel2FallbackType` are confirmed `int` but their integer-to-name mappings are not pinned in current source. Track values in real snapshot output and update clarifications `zcc-01` through `zcc-04` and `zcc-06` accordingly.

## Open questions

These are example-shape details in the `web-policy.json` block above that are NOT yet pinned to source and should be confirmed against a real snapshot before relying on them:

- **macOS sub-policy key name on the read shape.** The SDK request/response serializer uses `macPolicy` (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:190,302`), but the example block above shows `macosPolicy` and the `has_mac` jq query reads `.macosPolicy`. Unconfirmed whether the list-read JSON returns `macPolicy`, `macosPolicy`, or both. Verify against captured JSON. See [clarification `zcc-88`](../_meta/clarifications.md#zcc-88-webpolicy-read-shape-macpolicy-vs-macospolicy-key).
- **`groups` / `users` / `deviceGroups` element shape.** The example shows these as bare arrays. The Python model splits them into `groupIds`/`groupNames`, `userIds`/`userNames`, `deviceGroupIds`/`deviceGroupNames`, and parses `groups`/`users` into `{id, loginName, ...}` objects (`webpolicy.py:118-148`). The exact wire shape returned by `listByCompany` (which of these keys appear, and whether `groups`/`users` are id-only or full objects) is not confirmed from a snapshot. See [clarification `zcc-89`](../_meta/clarifications.md#zcc-89-webpolicy-groups-users-devicegroups-wire-shape).
- **`forwardingProfileActions` integer enum meanings** (`conditionType`, `networkType`, `actionType`, `primaryTransport`, `tunnel2FallbackType`) — datatype is `int` per source, but the integer→name mapping is not in current source (clarifications `zcc-01`..`zcc-04`, `zcc-06`).
- **Companion `deviceType` string on WebPolicy reads.** The Go SDK comment (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:65-69`) asserts the API returns a companion `deviceType` string like `"DEVICE_TYPE_MAC"` alongside the int, but the field is intentionally not modelled, so its wire presence is inferred from a comment rather than confirmed from a captured snapshot or response schema. Confirm against real `web/policy/listByCompany` JSON before relying on the string form. See [clarification `zcc-90`](../_meta/clarifications.md#zcc-90-webpolicy-companion-devicetype-string-presence-on-reads).

## Cross-links

- [`./api.md`](./api.md) — endpoint catalog + auth (OneAPI vs ZCC legacy)
- [`./forwarding-profile.md`](./forwarding-profile.md) — forwarding-profile reasoning
- [`./trusted-networks.md`](./trusted-networks.md) — trusted-network reasoning
- [`./web-policy.md`](./web-policy.md) — WebPolicy reasoning + forwarding-profile-id link
- [`../_meta/clarifications.md`](../_meta/clarifications.md) — ZCC enum clarifications (zcc-01 through zcc-07)
- [`../_meta/layering-model.md`](../_meta/layering-model.md) — how snapshot data layers onto general docs
