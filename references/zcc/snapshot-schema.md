---
product: zcc
topic: "snapshot-schema"
title: "ZCC snapshot/ schema — what's in the JSON, how to read it"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/"
  - "vendor/zscaler-sdk-python/zscaler/zcc/"
  - "scripts/snapshot-refresh.py"
author-status: draft
---

# ZCC snapshot/ schema

Operational reference for the JSON files `scripts/snapshot-refresh.py` writes under `snapshot/zcc/`. Pre-written from SDK model classes (`vendor/zscaler-sdk-python/zscaler/zcc/models/`); Postman collection has no ZCC response samples (the ZCC folder in Postman is the smallest at 9 leaf items, no schemas). Validate against actual JSON when fork populates and bump confidence to `high`.

## Files written by `--zcc-only`

```
snapshot/zcc/forwarding-profiles.json
snapshot/zcc/trusted-networks.json
snapshot/zcc/fail-open-policy.json
snapshot/zcc/web-policy.json
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
    "enableLWFDriver": "0",                          // string-as-int (Go SDK quirk)
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

### Common jq queries

```bash
# List forwarding profiles by name + active state
jq '.[] | {name, active, has_zia: ((.forwardingProfileActions | length) > 0), has_zpa: ((.forwardingProfileZpaActions | length) > 0)}' snapshot/zcc/forwarding-profiles.json

# Profiles with ZPA actions configured (have ZPA forwarding logic)
jq '.[] | select((.forwardingProfileZpaActions | length) > 0) | .name' snapshot/zcc/forwarding-profiles.json

# Count profiles per (conditionType, evaluateTrustedNetwork) combination
jq 'group_by([.conditionType, .evaluateTrustedNetwork]) | map({condition: .[0].conditionType, evaluate: .[0].evaluateTrustedNetwork, count: length})' snapshot/zcc/forwarding-profiles.json

# Profiles using a specific Z-Tunnel 2.0 fallback mode
jq '.[] | select(.forwardingProfileActions[]?.tunnel2FallbackType != 0) | {name, fallback: .forwardingProfileActions[0].tunnel2FallbackType}' snapshot/zcc/forwarding-profiles.json
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
jq '.trustedNetworkContracts[] | {name, dns: .dnsServers, ssids, subnets: .trustedSubnets}' snapshot/zcc/trusted-networks.json

# Networks with SSID-based detection
jq '.trustedNetworkContracts[] | select(.ssids | length > 0) | {name, ssids}' snapshot/zcc/trusted-networks.json

# Find networks an IP could match (subnet check)
jq --arg ip "10.0.0.5" '.trustedNetworkContracts[] | select(.trustedSubnets | split(",") | map(. as $cidr | $ip) | length > 0) | .name' snapshot/zcc/trusted-networks.json
# (CIDR matching is awkward in jq; use a Python script for real subnet checks)
```

## `fail-open-policy.json`

API: `GET /zcc/papi/public/v1/webFailOpenPolicy/listByCompany`

**Shape:** wrapped response with **single** policy object inside the list (one per company). The "list" is a historical-API artifact.

```json
[
  {
    "id": 1,
    "active": true,
    "captivePortalEnabled": true,
    "captivePortalGracePeriod": 60,           // seconds
    "tunnelRefreshInterval": 30,
    "tunnelHealthcheckThreshold": 3,
    "enableUiZpa": true,
    "enableUiCaptivePortal": true,
    "enableStrictEnforcement": false,
    "strictEnforcementBlockDevices": false,
    "captivePortalDetection": true,
    "captivePortalDetectionUrl": "...",
    // ... policy-shape fields
  }
]
```

Full SDK model: `vendor/zscaler-sdk-python/zscaler/zcc/models/failopenpolicy.py`. Reasoning: [`./forwarding-profile.md § Fail-open policy`](./forwarding-profile.md).

### Common jq queries

```bash
# Show fail-open settings
jq '.[0]' snapshot/zcc/fail-open-policy.json

# Just the captive portal grace period
jq '.[0].captivePortalGracePeriod' snapshot/zcc/fail-open-policy.json
```

## `web-policy.json`

API: `GET /zcc/papi/public/v1/webPolicy/listByCompany`

**Shape:** array of WebPolicy objects (also called "App Profiles" in the admin UI).

```json
[
  {
    "id": 1,
    "name": "Engineering Profile",
    "active": true,

    // The forwarding-profile binding — the link from web-policy → forwarding-profile
    "forwarding_profile_id": 12345,             // SNAKE_CASE on the wire (uniquely!)

    // Group / device targeting
    "deviceType": 1,                            // int — Windows/macOS/Linux/iOS/Android (zcc-09 territory)
    "groups": [...],
    "deviceGroups": [...],
    "users": [...],

    // Per-platform sub-policies — many fields, varies by platform
    "windowsPolicy": { ... },
    "macosPolicy": { ... },
    "linuxPolicy": { ... },
    "iosPolicy": { ... },
    "androidPolicy": { ... },

    // Some keys are snake_case on the wire (the SNAKE_CASE_KEYS exception)
    "device_type": "Windows",                   // wire is snake_case
    "pac_url": "https://...",
    "reauth_period": 86400,
    "install_ssl_certs": true,
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
    "disable_password": "..."
  }
]
```

Full SDK model: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py` — defines the `SNAKE_CASE_KEYS` set authoritatively. Reasoning: [`./web-policy.md`](./web-policy.md).

### Common jq queries

```bash
# Web policies + which forwarding profile each binds to
jq '.[] | {name, forwarding_profile_id, device_type, active}' snapshot/zcc/web-policy.json

# Find web policy assigned to a specific forwarding profile
jq --argjson fp_id 12345 '.[] | select(.forwarding_profile_id == $fp_id) | .name' snapshot/zcc/web-policy.json

# Per-platform policy presence
jq '.[] | {name, has_win: (.windowsPolicy != null), has_mac: (.macosPolicy != null), has_ios: (.iosPolicy != null)}' snapshot/zcc/web-policy.json
```

**Critical**: `forwarding_profile_id` is the answer to clarification `zcc-07` ("how does a user get assigned to a forwarding profile?") — see [`./web-policy.md`](./web-policy.md).

## What's NOT in the snapshot

ZCC has additional resources `snapshot-refresh.py` doesn't currently dump:

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

Adding them requires extending `scripts/snapshot-refresh.py`'s ZCC resource list. SDK methods are documented in `vendor/zscaler-sdk-python/zscaler/zcc/`.

## Wire-format gotchas (ZCC-specific)

1. **WebPolicy fields are mixed-case on the wire.** Per the SDK's `SNAKE_CASE_KEYS` set: `device_type`, `pac_url`, `reauth_period`, `install_ssl_certs`, `bypass_mms_apps`, `quota_in_roaming`, `wifi_ssid`, `limit`, `billing_day`, `allowed_apps`, `custom_text`, `bypass_android_apps`, plus per-platform password fields. All other fields are camelCase.

2. **Enum-like fields are integers.** `conditionType`, `networkType`, `actionType`, `primaryTransport`, `tunnel2FallbackType` are `int`, not string. Several boolean-looking flags are also `int` (`enableLWFDriver` is even a string-of-int per Go SDK).

3. **CSV strings for multi-value fields.** Don't expect arrays for `dnsServers`, `trustedSubnets`, etc. Split on comma, trim whitespace.

4. **TrustedNetwork list response is wrapped.** `.trustedNetworkContracts[]`, not `.[]`.

5. **FailOpenPolicy "list" has one item.** It's tenant-wide; the list-shape is API-historic.

6. **`forwarding_profile_id` on WebPolicy is the assignment mechanism.** This was a long-open clarification (`zcc-07`) — confirmed via SDK model.

7. **Enum integer-to-meaning is undocumented.** First fork-admin run will reveal which integer corresponds to which name. Track values in the snapshot output and update clarifications `zcc-01` through `zcc-04` and `zcc-06` accordingly.

## Cross-links

- [`./api.md`](./api.md) — endpoint catalog + auth (OneAPI vs ZCC legacy)
- [`./forwarding-profile.md`](./forwarding-profile.md) — forwarding-profile reasoning
- [`./trusted-networks.md`](./trusted-networks.md) — trusted-network reasoning
- [`./web-policy.md`](./web-policy.md) — WebPolicy reasoning + forwarding-profile-id link
- [`../_clarifications.md`](../_clarifications.md) — ZCC enum clarifications (zcc-01 through zcc-07)
- [`../_layering-model.md`](../_layering-model.md) — how snapshot data layers onto general docs
