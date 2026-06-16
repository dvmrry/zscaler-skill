---
product: zcc
topic: "zcc-forwarding-profile"
title: "ZCC forwarding profile — how ZCC decides where to send traffic"
content-type: reasoning
last-verified: "2026-06-15"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/forwarding_profile.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/_serialize.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/application_profiles.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/failopenpolicy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/fail_open_policy.py"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile_request.go"
  - "vendor/zscaler-help/about-forwarding-profiles.md"
  - "vendor/zscaler-help/configuring-forwarding-profiles-zscaler-client-connector.md"
  - "vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md"
  - "vendor/zscaler-help/what-is-zscaler-client-connector.md"
  - "vendor/zscaler-help/choosing-traffic-forwarding-methods.md"
  - "vendor/zscaler-help/Traffic_Forwarding_in_ZIA_Reference_Architecture.txt"
author-status: draft
---

# ZCC forwarding profile — how ZCC decides where to send traffic

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py`; `vendor/zscaler-sdk-python/zscaler/zcc/forwarding_profile.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go`; `vendor/zscaler-help/about-forwarding-profiles.md`.

The forwarding profile is **the policy object that runs on the endpoint** and decides, per packet, where to send it — into a Z-Tunnel toward a Public Service Edge (ZIA), into the ZPA Microtunnel (ZPA), into a local PAC, or direct. Misunderstanding the forwarding profile is the #1 source of "traffic bypassed Zscaler" mysteries.

## Summary

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go`; `vendor/zscaler-help/about-forwarding-profiles.md`; `vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md`.

A forwarding profile describes **how ZCC should behave on different classes of network** — typically "trusted" (corporate LAN / VPN) and "untrusted" (home Wi-Fi, coffee shop) and sometimes more granular tiers. The profile object contains:

1. **Trusted-network evaluation inputs** — a set of TrustedNetwork references (see [`./trusted-networks.md`](./trusted-networks.md)) plus inline criteria (DNS servers, hostnames, SSIDs, etc.). ZCC evaluates these continuously on the endpoint to decide *which branch of the profile is active*.
2. **ZIA actions per network type** (`forwardingProfileActions`) — for each network classification (Trusted, Untrusted, etc.), what to do with Internet-bound traffic: send to Z-Tunnel, use a PAC, send direct (`NONE`), etc.
3. **ZPA actions per network type** (`forwardingProfileZpaActions`) — same shape, but independently configurable for ZPA traffic. A profile can be, say, "ZIA via Z-Tunnel 2.0, ZPA always on" or "on trusted network, skip ZIA but keep ZPA."
4. **Fail-open policy** — a separate policy object (`FailOpenPolicy`, one per company) that decides what happens when the tunnel or proxy is unreachable, or a captive portal is blocking auth.

A ZCC install has **one active forwarding profile per device at any given moment**, selected by the user/device's active WebPolicy (called "App Profile" in the admin UI) via its `forwarding_profile_id` field. The active App Profile is itself selected by precedence rules across user/group/device-group scopes (see [`./web-policy.md`](./web-policy.md) for the assignment link and `about-zscaler-client-connector-app-profiles.md:15` for App Profile precedence). The "exactly one at a time" framing is a downstream consequence of the App Profile precedence rules, not a directly-cited claim.

## Wire-type correction — enum fields are integer-coded, not strings

**Cross-SDK validation against `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go` shows that all the enum-like fields on ForwardingProfile and its action blocks are `int` on the wire, not string enums.** The Python SDK no longer passes kwargs raw — as of the v1.9.31 model rewrite, `update_forwarding_profile` runs the request body through `zcc_to_wire(body, ForwardingProfile)` (`forwarding_profile.py:126`), which introspects the `ForwardingProfile` model's `request_format` to translate snake_case input into the exact wire casing (`_serialize.py:104`). The model is now the wire source of truth (snake_case in; camelCase / UPPER-acronym out, e.g. `UDPTimeout`, `pacURL`, `actionTypeZIA` — `forwardingprofile.py:20-25`). The model does *not* coerce value types, though — it preserves whatever value the caller passes — so the int-vs-string distinction below still matters for anyone hand-building payloads or feeding through values typed as strings. Fields affected (line references from `forwarding_profile.go`):

- `conditionType` — typed `int` on `ForwardingProfile` (line 22)
- `networkType` — typed `int` on each `forwardingProfileActions[]` and `forwardingProfileZpaActions[]` entry (line 48)
- `actionType` — typed `int` on same (line 49)
- `primaryTransport` — typed `int` on same (line 54)
- `tunnel2FallbackType` — typed `int` on same (line 61)

Plus these flags that look boolean-ish but are `int` (0/1) on the wire: `enableLWFDriver` (**type-divergent**: GET response is `string` at `forwarding_profile.go:25`; POST request is `int` at `forwarding_profile_request.go:19` — tools constructing payloads from the GET struct will send the wrong type), `enableSplitVpnTN` (line 39), `enableUnifiedTunnel` (line 36), `enableAllDefaultAdaptersTN` (line 38), `evaluateTrustedNetwork` (line 40), `skipTrustedCriteriaMatch` (line 41), `systemProxy`, `enablePacketTunnel`, `allowTLSFallback`, `pathMtuDiscovery`, `optimiseForUnstableConnections`, `useTunnel2ForProxiedWebTraffic`, `useTunnel2ForUnencryptedWebTraffic` (line 67), `sendAllDNSToTrustedServer`.

**The specific integer-to-meaning mapping is still undocumented** — clarifications `zcc-01` through `zcc-04` and `zcc-06` remain open on the semantic half. But the *datatype* is now confirmed: integer, not string. Tools writing payloads directly must send ints, not strings.

### POST shape differs from GET shape

`vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile_request.go` documents a separate request struct for the POST `/edit` endpoint. Key differences vs the GET response struct (lines 39–69 of the request file):

- `BlockUnreachableDomainsTraffic` — GET returns `IntOrString`; POST requires `string`
- `MtuForZadapter` — GET returns `IntOrString`; POST requires `string`
- `IsSameAsOnTrustedNetwork` — GET is `bool` with `omitempty`; POST is `*bool` (pointer) with `omitempty`

Within `UnifiedTunnelRequest` (lines 107–124): `BlockUnreachableDomainsTraffic` and `MtuForZadapter` are also `string` on POST. `SameAsOnTrusted` is `int` with `omitempty`. This GET-vs-POST asymmetry is not surfaced in the Python SDK: `zcc_to_wire` (`_serialize.py:104`) only fixes wire-key *casing* from the model, it does not re-type values per direction, so the Python client still relies on the API accepting the same value shape in both directions — unverified for these fields.

## Mechanics

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go`; `vendor/zscaler-help/about-forwarding-profiles.md`; `vendor/zscaler-help/Traffic_Forwarding_in_ZIA_Reference_Architecture.txt`.

### Network type branches

The help article `vendor/zscaler-help/about-forwarding-profiles.md` defines the four network classifications ZCC distinguishes (lines 28–44):

| networkType name | Description | Qualifier |
|---|---|---|
| **On-Trusted Network** | User is connected to a private network belonging to your organization | Matches when trusted-network criteria evaluate true |
| **VPN-Trusted Network** | User is connected to a trusted network through a VPN in full-tunnel mode | Windows: interface description must contain Cisco, Juniper, Fortinet, PanGP, or VPN (line 36); macOS: checks for `utun`, `PPP`, or `GPD` interface type (line 38) |
| **Off-Trusted Network** | User is connected to an untrusted network | Default branch when no other criteria match |
| **Split VPN-Trusted Network** | User is connected to a trusted network through a VPN in split-tunnel mode | Does **not** qualify if VPN runs as a default adapter (line 43) or if interface description lacks the keyword set (line 44) |

**VPN-Trusted Network detection on Windows (lines 36–37):** The adapter's interface description string is scanned for the words `Cisco`, `Juniper`, `Fortinet`, `PanGP`, or `VPN`. If none of these words appear, ZCC does not classify the adapter as a VPN and the user falls to Off-Trusted Network instead of VPN-Trusted Network even while on a VPN. This is a common misconfiguration root cause when a non-standard VPN client (e.g., a custom enterprise client) doesn't include these keywords in its interface description.

**VPN-Trusted Network detection on macOS (line 38):** macOS does not scan interface description text. Instead, ZCC checks whether the VPN created a `utun`, `PPP`, or `GPD` interface. Most standard VPN clients on macOS create one of these; unusual VPN implementations that don't create these interface types will not be recognized as VPN-Trusted.

The integer values of `networkType` that map to these four classifications are not documented in the SDK — they are raw `int` on the wire (`forwarding_profile.go:48`). See [clarification `zcc-02`](../_meta/clarifications.md#zcc-02-forwardingprofile-actions-network_type-enum).

### The profile object

From `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py` (lines 37–72) and `forwarding_profile.go` (lines 18–45), the top-level fields on a `ForwardingProfile`:

| Field | Wire key | Meaning |
|---|---|---|
| `name` | `name` | Profile name. |
| `active` | `active` | Whether the profile is active in the tenant. |
| `hostname` | `hostname` | Hostname-based trusted-network criterion at the profile level (separate from per-TrustedNetwork `hostnames`). |
| `resolved_ips_for_hostname` | `resolvedIpsForHostname` | Expected resolved IPs for `hostname`, used to assert DNS resolution. |
| `dns_servers` | `dnsServers` | Inline trusted-network DNS-server criterion. |
| `dns_search_domains` | `dnsSearchDomains` | Inline trusted-network DNS search domain criterion. |
| `trusted_dhcp_servers` | `trustedDhcpServers` | Inline trusted DHCP server list. |
| `trusted_gateways` | `trustedGateways` | Inline trusted default-gateway IP list. |
| `trusted_subnets` | `trustedSubnets` | Inline trusted subnet list (CIDR). |
| `trusted_egress_ips` | `trustedEgressIps` | Trusted egress IP list (public IP the network NATs to). |
| `trusted_network_ids` | `trustedNetworkIds` | References to separate TrustedNetwork entities by ID. |
| `trusted_networks` | `trustedNetworks` | (String list; likely the resolved names of the referenced TrustedNetworks for display — redundant with IDs at the API level.) |
| `predefined_tn_all` | `predefinedTnAll` | Boolean; shortcut that treats any of a pre-defined set of trusted networks as a match. (`forwardingprofile.py:401`) |
| `predefined_trusted_networks` | `predefinedTrustedNetworks` | The resolved set behind the above shortcut. |
| `condition_type` | `conditionType` | How trusted-criteria combine (AND vs OR) at the **profile level** — across the inline fields + referenced TrustedNetworks. Typed `int` (`forwarding_profile.go:22`); enum values not documented in SDK — see [`clarification zcc-01`](../_meta/clarifications.md#zcc-01-forwardingprofile-condition_type-enum). **Distinct from the per-TrustedNetwork `conditionType`** which controls combination within a single TrustedNetwork's criteria — see [`./trusted-networks.md § condition_type`](./trusted-networks.md). The two `conditionType` fields are evaluated at different levels of the criteria tree. |
| `evaluate_trusted_network` | `evaluateTrustedNetwork` | Master toggle — if false, trusted-network evaluation is skipped entirely and only the Untrusted action branch applies. Typed `int` (`forwarding_profile.go:40`). |
| `skip_trusted_criteria_match` | `skipTrustedCriteriaMatch` | Bypass criteria evaluation (forces a specific branch). Mutually-exclusive relationship with `evaluate_trusted_network` not confirmed; see `zcc-01`. Typed `int` (`forwarding_profile.go:41`). |
| `enable_lwf_driver` | `enableLWFDriver` | Windows Lightweight Filter driver mode — affects how ZCC intercepts traffic on Windows. Uniquely typed `string` in Go SDK despite being conceptually 0/1. |
| `enable_split_vpn_t_n` | `enableSplitVpnTN` | Split VPN Trusted Network mode — when ZCC is running alongside a full VPN, consult the VPN's network as the trusted criterion. Typed `int` (`forwarding_profile.go:39`). |
| `enable_unified_tunnel` | `enableUnifiedTunnel` | Master toggle for Unified Tunnel mode. Now modeled in the Python SDK (`forwardingprofile.py:388`). Typed `int` (`forwarding_profile.go:36`). See [§ Unified Tunnel](#unified-tunnel). |
| `enable_all_default_adapters_t_n` | `enableAllDefaultAdaptersTN` | Whether all OS default network adapters participate in trusted-network evaluation. Typed `int` (`forwarding_profile.go:38`). |
| `forwarding_profile_actions` | `forwardingProfileActions` | **List** of per-network-type ZIA actions. One item per network classification. See [§ ForwardingProfileActions](#forwardingprofileactions-zia-actions-per-network-type). |
| `forwarding_profile_zpa_actions` | `forwardingProfileZpaActions` | **List** of per-network-type ZPA actions. Parallel structure; independently configurable. |
| `unified_tunnel` | `unifiedTunnel` | List of UnifiedTunnel sub-objects. Now modeled in the Python SDK (`forwardingprofile.py:419`, `UnifiedTunnel` class at `forwardingprofile.py:299-364`). See [§ Unified Tunnel](#unified-tunnel). |

### ForwardingProfileActions — ZIA actions per network type

Each item in `forwardingProfileActions` is keyed by `networkType` — the classification this action block applies to. The four prose-named types (On-Trusted Network, VPN-Trusted Network, Off-Trusted Network, Split VPN-Trusted Network — see [§ Network types](#network-type-branches)) correspond to integer values on the wire (`forwarding_profile.go:48`) whose exact mapping is not documented in the SDK; see [`clarification zcc-02`](../_meta/clarifications.md#zcc-02-forwardingprofile-actions-network_type-enum).

The `actionType` field within the block decides what happens to Internet traffic on that network. Known values from field names and typical ZCC semantics: `NONE` (send direct, skip ZIA), `PAC` (honor a PAC file), `ENFORCE_POLICIES` / `TUNNEL` (send through Z-Tunnel for ZIA inspection). The exact enum list is not documented in the SDK code; see [`clarification zcc-03`](../_meta/clarifications.md#zcc-03-forwardingprofile-action_type-enum). Typed `int` (`forwarding_profile.go:49`).

**If `actionType: NONE` is configured on the Trusted branch, ZCC bypasses ZIA entirely on trusted networks.** This is the single most common "why didn't ZIA see this traffic?" finding. A tenant that adds a TrustedNetwork for a user's home Wi-Fi (accidentally or deliberately) effectively exempts that user from ZIA inspection while at home.

Per-action sub-fields that shape the tunnel/probe behavior (field names from the `ForwardingProfileActions` class, `forwardingprofile.py:106–230`; type annotations from `forwarding_profile.go:47–81`):

| Field | Wire key | Role |
|---|---|---|
| `primary_transport` | `primaryTransport` | Z-Tunnel transport preference. Typed `int` (`forwarding_profile.go:54`); exact enum unconfirmed — see [`clarification zcc-04`](../_meta/clarifications.md#zcc-04-forwardingprofile-primary_transport-enum). |
| `allow_tls_fallback` | `allowTLSFallback` | If DTLS fails, fall back to TLS. (`forwardingprofile.py:126`) |
| `tunnel2_fallback_type` | `tunnel2FallbackType` | Specific fallback behavior when Z-Tunnel 2.0 fails. Typed `int` (`forwarding_profile.go:61`). In the v1.9.31 model rewrite this is now a normal `int` field with a working Python round-trip: read from `config["tunnel2FallbackType"]` (`forwardingprofile.py:128`), defaulted to `None` in the no-config branch (`forwardingprofile.py:174`), serialized as `"tunnel2FallbackType": self.tunnel2_fallback_type` (`forwardingprofile.py:209`). The earlier attribute-naming inconsistency (an orphaned `tunnel2_fallback` / `tunnel2Fallback` that was never serialized) is gone — there is no `tunnel2_fallback` attribute anywhere in the current model. |
| `use_tunnel2_for_proxied_web_traffic` | `useTunnel2ForProxiedWebTraffic` | Explicit Z-Tunnel 2.0 toggle for proxied web traffic. (`forwardingprofile.py:129`) |
| `use_tunnel2_for_unencrypted_web_traffic` | `useTunnel2ForUnencryptedWebTraffic` | Z-Tunnel 2.0 toggle for unencrypted web traffic separately. Now modeled in the Python SDK (`forwardingprofile.py:132`); typed `int` in Go (`forwarding_profile.go:67`). |
| `enable_packet_tunnel` | `enablePacketTunnel` | Packet-level tunnel vs L4/L7 proxy. (`forwardingprofile.py:113`) |
| `optimise_for_unstable_connections` | `optimiseForUnstableConnections` | Performance tuning for flaky networks. Go SDK only (`forwarding_profile.go:74`); absent from the Python `ForwardingProfileActions` model. |
| `latency_based_zen_enablement` | `latencyBasedZenEnablement` | Pick best Service Edge based on latency probes. Returns as `IntOrString` (`forwarding_profile.go:69`). |
| `zen_probe_interval` / `zen_probe_sample_size` / `zen_threshold_limit` | — | Latency probe tuning. (`forwardingprofile.py:144–146`) |
| `redirect_web_traffic` | `redirectWebTraffic` | Whether to redirect web traffic into the tunnel at all. Returns as `IntOrString`. |
| `system_proxy` / `system_proxy_data` | `systemProxy` / `systemProxyData` | OS-level proxy integration (PAC URL, proxy server, bypass rules). `systemProxyData` is now its own `SystemProxyData` model class (`forwardingprofile.py:33–78`) with sub-fields: `bypassProxyForPrivateIP`, `enableAutoDetect`, `enablePAC`, `enableProxyServer`, `pacURL`, `pacDataPath`, `performGPUpdate`, `proxyAction`, `proxyServerAddress`, `proxyServerPort` (`forwardingprofile.py:39–50`). |
| `custom_pac` | `customPac` | Custom PAC content or URL. For PAC semantics (variable substitution, Kerberos, 10-version history, self-hosted-loses-variables rule) see [`../shared/pac-files.md`](../shared/pac-files.md). |
| `drop_ipv6_traffic` / `drop_ipv6_traffic_in_ipv6_network` / `drop_ipv6_include_traffic_in_t2` | — | IPv6 handling. Return as `IntOrString` or `IntOrString` variant (`forwarding_profile.go:63–73`). |
| `path_mtu_discovery` / `mtu_for_zadapter` | — | Path MTU and ZCC virtual-adapter MTU. `mtu_for_zadapter` returns as `IntOrString`; POST sends as `string` (`forwarding_profile_request.go:48`). |
| `dtls_timeout` / `tls_timeout` / `udp_timeout` | `DTLSTimeout` / `TLSTimeout` / `UDPTimeout` | Per-transport timeouts. (`forwardingprofile.py:122–124`) |
| `block_unreachable_domains_traffic` | `blockUnreachableDomainsTraffic` | If a domain fails to resolve, whether to allow the attempt to fall through or block. Returns as `IntOrString`; POST sends as `string` (`forwarding_profile_request.go:42`). |
| `is_same_as_on_trusted_network` | `isSameAsOnTrustedNetwork` | Inherits settings from the On-Trusted branch. Typed `bool` with `omitempty` in Go GET response (`forwarding_profile.go:80`); `*bool` pointer with `omitempty` on POST (`forwarding_profile_request.go:68`). Unique — uses `bool` not `int`, unlike other toggles. |
| `send_all_dns_to_trusted_server` | `sendAllDNSToTrustedServer` | Forwards all DNS queries to the trusted DNS server rather than resolving normally. Go SDK only (`forwarding_profile.go:62`); absent from the Python `ForwardingProfileActions` model. |
| `network_type` | `networkType` | The branch this action block applies to. See [§ Network types](#network-type-branches). |

### ForwardingProfileZpaActions — ZPA actions per network type

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go`.

Parallel structure; independent of ZIA actions. One action block per network type, keyed the same way. Notable fields (from the `ForwardingProfileZpaActions` class, `forwardingprofile.py:233–296`, and `forwarding_profile.go`):

| Field | Wire key | Role |
|---|---|---|
| `action_type` | `actionType` | NONE / tunnel / etc., as above but for ZPA. Typed `int`. (`forwardingprofile.py:239`) |
| `latency_based_server_enablement` | `latencyBasedServerEnablement` | Pick best ZPA Service Edge based on latency. (`forwardingprofile.py:245`) |
| `latency_based_server_mt_enablement` | `latencyBasedServerMTEnablement` | Latency-based Source MT (microtenant-aware) ZPA server selection. (`forwardingprofile.py:251`) |
| `lbs_probe_interval` / `lbs_probe_sample_size` / `lbs_threshold_limit` | — | ZPA-side latency probe tuning. (`forwardingprofile.py:248–250`) |
| `send_trusted_network_result_to_zpa` | `sendTrustedNetworkResultToZpa` | Whether ZCC tells ZPA the current trusted-network state. Affects ZPA policy rules that use the TRUSTED_NETWORK condition. (`forwardingprofile.py:258`) |
| `partner_info` | `partnerInfo` | Partner-integration sub-object (`PartnerInfo` class, `forwardingprofile.py:81–103`). Sub-fields: `primaryTransport`, `mtuForZadapter`, `allowTlsFallback` (`forwardingprofile.py:87–89`). |
| `primary_transport` | `primaryTransport` | Transport preference for ZPA tunnel. (`forwardingprofile.py:240`) |

**Key cross-product hook: `sendTrustedNetworkResultToZpa`** (`forwardingprofile.py:258`). ZPA access-policy rules can reference a TRUSTED_NETWORK condition. The behavioral claim — that this toggle controls whether ZPA's TRUSTED_NETWORK condition fires — is **inferred from the field name**: vendor help articles do not document this hook explicitly. **Confidence: medium**. If a tenant reports "ZPA TRUSTED_NETWORK condition isn't firing," check this toggle, but verify with a tenant-side test before promising it as the cause.

### The two action lists are independent

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go`; `vendor/zscaler-help/about-forwarding-profiles.md`.

A profile can set:

- `forwardingProfileActions[TRUSTED].actionType = NONE` (ZIA off on trusted network — e.g. corporate LAN with separate perimeter controls)
- `forwardingProfileZpaActions[TRUSTED].actionType = TUNNEL` (ZPA on everywhere)

This means a device on a trusted corporate LAN may send Internet traffic direct while still tunneling ZPA internal apps through the ZPA cloud. Common pattern for offices with an on-prem internet gateway but no on-prem ZPA.

### Trusted-network evaluation

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go`; `vendor/zscaler-help/Traffic_Forwarding_in_ZIA_Reference_Architecture.txt`.

Per the model, ZCC uses three kinds of trusted-criteria input:

1. **Inline criteria on the profile** — `dns_servers`, `dns_search_domains`, `hostname`+`resolved_ips_for_hostname`, `trusted_dhcp_servers`, `trusted_gateways`, `trusted_subnets`, `trusted_egress_ips`.
2. **Referenced TrustedNetwork entities** — `trusted_network_ids` points to standalone TrustedNetwork objects defined separately (see [`./trusted-networks.md`](./trusted-networks.md)).
3. **Predefined set** — `predefined_tn_all` / `predefined_trusted_networks` act as a shortcut for "any of a pre-declared set of networks." (`forwardingprofile.py:401`)

How these combine: `condition_type` controls AND vs OR across the pieces (`forwarding_profile.go:22`). The enum isn't documented in the SDK — see `zcc-01`. Likely values: AND (all criteria must match), OR (any matches), or possibly `TRUSTED_CRITERIA_AND` / `TRUSTED_CRITERIA_OR` style strings. Lab-test at first tenant onboarding.

**`evaluate_trusted_network` is the master switch** (`forwarding_profile.go:40`). If false, the TRUSTED branch of both action lists never fires; ZCC behaves as if always on an untrusted network. A tenant that sees "all my users are treated as untrusted even on corporate LAN" should check this flag first.

### Vendor recommendation framing for the four detection options

The Traffic Forwarding RefArch surfaces user-facing labels and a recommendation for the four detection options ZCC exposes (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1370`):

| Option | Vendor label | Behavior |
|---|---|---|
| DNS Server | **(recommended)** | IPs of internal corporate DNS servers; ZCC verifies at least one is reachable. |
| DNS Search Domains | **(recommended)** | Search domain compared to the active adapter's. |
| Hostname and IP | — | Hostname plus expected resolved IPs on the corporate network. |
| Pre-Defined Trusted Networks | — | Mutually exclusive with the other three; sole criterion when used. |

For options 1–3, match logic is configurable as ANY or ALL. Pre-Defined Trusted Networks is a single-criterion mode and cannot be combined with the other three (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1370`).

Zscaler recommends using DNS Server and/or DNS Search Domains for detecting trusted networks. These are the most static checks possible. Combining them gives you the most assurance of being on a trusted network (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1390`).

The RefArch framing also describes the master behavior: ZCC contains a feature called trusted network detection. You configure the software to understand when it is on one of your organization's network segments and disable itself (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1358`). When the software detects that it is not connected to a trusted network segment, it automatically tries to connect to the nearest ZIA Service Edge (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1360`).

### Fail-open policy — what happens when the cloud is unreachable

A separate `FailOpenPolicy` object lives at the company level (one per tenant), distinct from the forwarding profile. API endpoint: `GET /zcc/papi/public/v1/webFailOpenPolicy/listByCompany` (`fail_open_policy.py:66`), `PUT /zcc/papi/public/v1/webFailOpenPolicy/edit` (`fail_open_policy.py:126`). Fields (from `models/failopenpolicy.py:38–65`):

| Field | Wire key | Behavior |
|---|---|---|
| `enable_fail_open` | `enableFailOpen` | Master toggle. If true, when the tunnel/proxy is unreachable, ZCC allows traffic out direct. If false, traffic is blocked. (`failopenpolicy.py:47`) |
| `enable_captive_portal_detection` | `enableCaptivePortalDetection` | Whether ZCC detects a captive portal (hotel Wi-Fi, airport) that intercepts HTTP requests. (`failopenpolicy.py:44`) |
| `captive_portal_web_sec_disable_minutes` | `captivePortalWebSecDisableMinutes` | Grace period during which ZCC disables web security so the user can complete captive-portal auth. Example value in SDK: `'10'` (`fail_open_policy.py:108`). After expiry, ZCC re-enforces. (`failopenpolicy.py:38`) |
| `enable_strict_enforcement_prompt` | `enableStrictEnforcementPrompt` | When enabled, prompts the user before letting fail-open happen, instead of silently allowing. |
| `strict_enforcement_prompt_delay_minutes` | `strictEnforcementPromptDelayMinutes` | Delay before the prompt appears. Example value in SDK: `'2'` (`fail_open_policy.py:114`). |
| `strict_enforcement_prompt_message` | `strictEnforcementPromptMessage` | Custom text. |
| `tunnel_failure_retry_count` | `tunnelFailureRetryCount` | How many times ZCC retries the tunnel before declaring "unreachable" and applying fail-open. Example value in SDK: `'25'` (`fail_open_policy.py:116`). (`failopenpolicy.py:65`) |
| `enable_web_sec_on_proxy_unreachable` | `enableWebSecOnProxyUnreachable` | When PAC-proxy mode is active and the proxy is unreachable, whether web security still runs. |
| `enable_web_sec_on_tunnel_failure` | `enableWebSecOnTunnelFailure` | When Z-Tunnel fails, whether web security still attempts to run (e.g. via a fallback path). |

**Captive portal grace period is a common "user got blocked at the airport" story.** If a user logs into the portal slowly, they hit the re-enforcement window and are blocked until they disconnect/reconnect. Not a ZIA URL filter issue — a ZCC fail-open issue.

**Captive portal and fail-close settings also exist at App Profile scope, alongside the tenant-global FailOpenPolicy described above.** This is now SDK-confirmed, not just operator-reported: the `ApplicationProfile` model carries `reactivateWebSecurityMinutes` (`application_profiles.py:49`) — the time before web security is reactivated after a user-initiated disable (not captive-portal grace; the captive-portal grace field is `captivePortalWebSecDisableMinutes` on `FailOpenPolicy`, `failopen_policy.go:18`) — and its `PolicyExtension` block carries the App-Profile fail-close surface — `zccAppFailOpenPolicy` (`application_profiles.py:474`), `zccTunnelFailPolicy` (`application_profiles.py:475`), and the `zccFailCloseSettings*` family: `zccFailCloseSettingsLockdownOnTunnelProcessExit` (`application_profiles.py:456`), `...LockdownOnFirewallError` (`application_profiles.py:461`), `...LockdownOnDriverError` (`application_profiles.py:466`), `...ExitUninstallPassword` (`application_profiles.py:451`), `...ThumbPrint` (`application_profiles.py:471`), `...IpBypasses` (`application_profiles.py:448`). When answering "why did this user get captive-portal-blocked and that user didn't on the same network", check the tenant-global `FailOpenPolicy` `captivePortalWebSecDisableMinutes` (the actual captive-portal grace field) *and* the App Profile's `PolicyExtension` fail-close fields (see [`./web-policy.md`](./web-policy.md)). Note: `reactivateWebSecurityMinutes` on the App Profile controls how long before web security reactivates after a user-initiated disable — it is not the captive-portal grace timer. **Confidence: medium** — the SDK confirms these fields exist and are App-Profile-scoped; the exact precedence between a per-profile setting and the tenant-global FailOpenPolicy is not documented in the captured sources.

### Failure taxonomy and version-specific overrides

The *About Forwarding Profiles* capture (`vendor/zscaler-help/about-forwarding-profiles.md`) and SDK example values document the failure taxonomy ZCC actually distinguishes:

| Failure condition | What ZCC does | Configurable via |
|---|---|---|
| **Captive portal detected** | Disables web security for `captivePortalWebSecDisableMinutes` (tenant-global `FailOpenPolicy`, `failopen_policy.go:18`); user completes portal auth; re-enforces | Tenant-global `FailOpenPolicy` (`captivePortalWebSecDisableMinutes`) — note: `reactivateWebSecurityMinutes` on `ApplicationProfile` is user-disable reactivation, not captive-portal grace |
| **Tunnel establishment timeout** | Retries `tunnelFailureRetryCount` times, then applies fail-open | FailOpenPolicy (`tunnelFailureRetryCount`, `enableFailOpen`) |
| **Z-Tunnel mid-session failure** | Falls back per `tunnel2FallbackType` (Z-Tunnel 2.0 → 1.0 / direct / drop) — see [`./z-tunnel.md`](./z-tunnel.md) | Forwarding profile per-network-type action |
| **PAC proxy unreachable** | If `enableWebSecOnProxyUnreachable=true`, web security still attempts via fallback; otherwise falls open or blocks per master toggle | FailOpenPolicy |
| **ZIA Service Edge unreachable** | Failover to secondary edge automatic; if all edges unreachable, fail-open path engages | Tunnel-level + FailOpenPolicy |
| **Trusted-network detection mismatch** | Switches active branch (trusted ↔ untrusted ↔ VPN-trusted) | `trustedNetworks` config; see [`./trusted-networks.md`](./trusted-networks.md) |

**Version-specific behavior** — version floors below are operator-reported / community-confirmed (Tier C). Specific line citations from vendor help articles are pending; verify against your tenant's deployed ZCC version before citing to a customer:

- **Windows 4.5+** — additional fail-close enforcement options exposed for STRICTENFORCEMENT mode (see [`./install-parameters.md`](./install-parameters.md))
- **macOS 4.6+** — captive portal detection improvements; per-app-profile overrides
- **macOS 4.8+** — additional unified-tunnel handling; updated Z-Tunnel 2.0 fallback semantics
- **Windows 4.4+** — device posture cadence configurable from default 15 minutes

## Fields Python SDK doesn't expose (Go-SDK-only)

The v1.9.31 Python SDK rewrite (`models/forwardingprofile.py`, now a fully-modeled `ForwardingProfile` class at `forwardingprofile.py:367–486` with sub-action classes at `forwardingprofile.py:106–364`) closed most of the old Python/Go delta. Fields that were previously Go-SDK-only are **now modeled in Python**: `enableUnifiedTunnel` (`forwardingprofile.py:388`), `unifiedTunnel` (`forwardingprofile.py:419`), `enableAllDefaultAdaptersTN` (`forwardingprofile.py:391`), `tunnel2FallbackType` (`forwardingprofile.py:128`), `useTunnel2ForUnencryptedWebTraffic` (`forwardingprofile.py:132`), `dropIpv6IncludeTrafficInT2` (`forwardingprofile.py:136`), the ZIA-side latency-server family `latencyBasedServerEnablement` / `lbsProbeInterval` / `lbsProbeSampleSize` / `lbsThresholdLimit` / `latencyBasedServerMTEnablement` (`forwardingprofile.py:147–155`), and `isSameAsOnTrustedNetwork` (`forwardingprofile.py:157`).

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go`; `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile_request.go`.

**What remains Go-SDK-only** (present on the wire / Go struct, still absent from the Python model — settable via direct API call or Go SDK):

**On `ForwardingProfile`:**

- `trustedNetworkIdsSelected` (list of int, `forwarding_profile.go:44`) — distinct from `trustedNetworkIds`. Relationship unclear; may be UI-selection state vs authoritative reference list. Needs tenant confirmation.

**On `forwardingProfileActions[]` items:**

- `optimiseForUnstableConnections` (int, 0/1, `forwarding_profile.go:74`) — performance tuning for flaky networks.
- `sendAllDNSToTrustedServer` (int, 0/1, `forwarding_profile.go:62`) — forwards all DNS queries to the trusted DNS server rather than resolving normally.

**Note on `isSameAsOnTrustedNetwork`:** still the **exception to the int-not-bool rule** — `bool` (not `int`) in the Go GET struct (`forwarding_profile.go:80`), `*bool` pointer on POST (`forwarding_profile_request.go:68`). It is now modeled in the Python `ForwardingProfileActions` (`forwardingprofile.py:157`).

## Unified Tunnel

Both SDKs now expose a `UnifiedTunnel` sub-structure distinct from both ForwardingProfileActions and ForwardingProfileZpaActions: Go struct at `forwarding_profile.go:119–139`, Python `UnifiedTunnel` model class at `forwardingprofile.py:299–364` (the `actionTypeZIA` / `actionTypeZPA` split is at `forwardingprofile.py:323–324`). Shape (type info from the Go struct):

| Field | Role |
|---|---|
| `networkType` (int, line 120) | Which network-type branch this unified-tunnel entry applies to. |
| `actionTypeZIA` (int, line 121) | What to do with ZIA traffic on this branch. |
| `actionTypeZPA` (int, line 122) | What to do with ZPA traffic on this branch. |
| `primaryTransport` (int) | Transport preference for the unified tunnel. |
| `tunnel2FallbackType` / `allowTLSFallback` / timeout fields | Standard tunnel-tuning knobs. (`forwarding_profile.go:130`) |
| `pathMtuDiscovery` / `mtuForZadapter` | MTU tuning. POST sends `mtuForZadapter` as `string` (`forwarding_profile_request.go:113`). |
| `optimiseForUnstableConnections` | Performance tuning. |
| `redirectWebTraffic` | Whether to redirect web traffic through the listening proxy. |
| `dropIpv6Traffic` / `dropIpv6TrafficInIpv6Network` | IPv6 handling. |
| `blockUnreachableDomainsTraffic` | POST sends as `string` (`forwarding_profile_request.go:108`). |
| `sendAllDNSToTrustedServer` | DNS forwarding behavior. |
| `systemProxyData` | OS-proxy integration. |
| `sameAsOnTrusted` (int, 0/1, line 138) | "Inherit settings from On-Trusted branch." POST sends with `omitempty` (`forwarding_profile_request.go:121`). |

**What Unified Tunnel is (inferred from structure)**: a forwarding mode where ZIA and ZPA traffic share a single transport connection to the Zscaler cloud, rather than maintaining two separate Z-Tunnels (one for ZIA → PSE, one for ZPA → Service Edge). `actionTypeZIA` and `actionTypeZPA` are separate within the same sub-object because unified transport doesn't mean unified policy — individual traffic kinds can still be routed differently. **Confidence: low** — no help article found; behavioral description is inferred from struct shape alone.

**Follow-up to resolve**: capture a help article specifically about Unified Tunnel if one exists. The SDK side is now known; the customer-side operational semantics need doc backing.

## Edge cases

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py`; `vendor/zscaler-sdk-python/zscaler/zcc/models/failopenpolicy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go`; `vendor/zscaler-help/about-forwarding-profiles.md`; `vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md`.

- **Profile has no TRUSTED branch at all.** If `forwardingProfileActions` doesn't include an item with `networkType = TRUSTED`, ZCC has no defined behavior for the trusted branch. **Inferred** from struct shape: this likely behaves the same as `evaluate_trusted_network = false` (`forwarding_profile.go:40`), but the equivalence is not stated in any captured help article — vendor source only confirms the field exists. Lab-test before relying on the equivalence; ZCC's actual default behavior for absent action blocks could differ from the master-toggle-off path. **Confidence: low**.
- **Trusted-network criteria match at home by accident.** If `trusted_subnets` are broad enough to match a common home-network config (e.g., `192.168.1.0/24`, the default for many consumer routers), users on home Wi-Fi can be classified TRUSTED and skip ZIA inspection. Audit trusted criteria for specificity.
- **ZPA TRUSTED_NETWORK policy rules silently don't fire** when `sendTrustedNetworkResultToZpa` is off on the active forwarding profile's ZPA actions (`forwardingprofile.py:258`), or when `evaluateTrustedNetwork` is false at the profile level (`forwarding_profile.go:40`). Check both before chasing ZPA-side rule logic.
- **VPN-Trusted misdetection on non-standard VPN clients.** If the VPN adapter's interface description doesn't contain Cisco, Juniper, Fortinet, PanGP, or VPN on Windows (`about-forwarding-profiles.md:36`), ZCC won't recognize it as a VPN-Trusted network. Users will be treated as Off-Trusted even while VPN is active. Fix: contact the VPN vendor to rename the adapter, or use trusted-subnet/egress-IP criteria instead.
- **QUIC / HTTP3 considerations (operator-reported, unverified).** ZCC intercepts at the OS network layer; ZIA's forward proxy operates on HTTP/TCP. QUIC runs over UDP 443. Whether QUIC traffic from WebKit-class browsers consistently bypasses ZIA proxy inspection in tenant configurations that don't drop UDP 443 is an open question — the architectural gap is real, but the operational behavior in production tenants has not been verified in this skill. Candidate levers if it does manifest: `dropQuicTraffic` (`webpolicy.py:416`; also on the App Profile `PolicyExtension` at `application_profiles.py:408`), or a Cloud Firewall rule blocking UDP 443. The CAC reference (`../zia/cloud-app-control.md`) cites the QUIC concern at the ZIA-deployment level. Treat as a hypothesis to verify against the tenant, not a documented diagnostic conclusion.
- **App profile updates are event-driven, not polled.** ZCC downloads profile changes "whenever users log out and back into the app or restart their computers" (`about-zscaler-client-connector-app-profiles.md:17`). There is no continuous polling interval. An operator pushing a critical policy change expecting immediate propagation to connected devices will be surprised — connected devices keep the cached profile until next ZCC logout/restart.
- **Z-Tunnel 2.0 + Bandwidth Control.** Per `references/zia/ssl-inspection.md`, HTTP/2 inspection falls back to HTTP/1.1 at locations where Bandwidth Control is enabled. This is a Service-Edge-side effect but it can look like a ZCC transport issue — rule out Bandwidth Control before suspecting ZCC.
- **System proxy integration overrides.** When `systemProxy` is enabled (`forwardingprofile.py:160`) with `enablePAC`/`enableProxyServer` in `systemProxyData` (`forwardingprofile.py:43–44`), ZCC honors the OS-level proxy settings in addition to (or instead of) its own forwarding actions. Order of precedence is not clearly documented; treat as operator-configured-to-taste. See [`clarification zcc-05`](../_meta/clarifications.md#zcc-05-systemproxydata-vs-native-forwarding-action-precedence).
- **IPv6 drop flags can break IPv6-only apps.** `dropIpv6Traffic`, `dropIpv6TrafficInIpv6Network`, and `dropIpv6IncludeTrafficInT2` all return as `IntOrString` (`forwarding_profile.go:63–73`); real-tenant defaults may silently drop IPv6. A user reporting "IPv6-only application fails on ZCC" should have these inspected.

## Open questions

- `condition_type` enum values and AND/OR semantics on the profile — [clarification `zcc-01`](../_meta/clarifications.md#zcc-01-forwardingprofile-condition_type-enum).
- `network_type` enum integer values (On-Trusted / Off-Trusted / VPN-Trusted / Split VPN-Trusted → int mapping) — [clarification `zcc-02`](../_meta/clarifications.md#zcc-02-forwardingprofile-actions-network_type-enum).
- `action_type` enum values (NONE / TUNNEL / PAC / ENFORCE_POLICIES / ?) — [clarification `zcc-03`](../_meta/clarifications.md#zcc-03-forwardingprofile-action_type-enum).
- `primary_transport` enum values (ZTUNNEL / DTLS / TLS / ?) — [clarification `zcc-04`](../_meta/clarifications.md#zcc-04-forwardingprofile-primary_transport-enum).
- Precedence when `systemProxyData` and native forwarding actions both specify a path — [clarification `zcc-05`](../_meta/clarifications.md#zcc-05-systemproxydata-vs-native-forwarding-action-precedence).
- Behavioral description of Unified Tunnel — the model is now confirmed in both SDKs (Go `UnifiedTunnel` struct `forwarding_profile.go:119–139`; Python `UnifiedTunnel` class `forwardingprofile.py:299–364`), but the customer-side operational semantics (what shared-transport actually changes vs two separate Z-Tunnels) still have no help-article backing — follow-up item. See [clarification `zcc-84`](../_meta/clarifications.md#zcc-84-unified-tunnel-operational-semantics).
- Precedence between a per-App-Profile fail-close setting and the tenant-global `FailOpenPolicy`. The App-Profile fail-close fields are now SDK-confirmed (`application_profiles.py` `reactivateWebSecurityMinutes:49`, `PolicyExtension` `zccAppFailOpenPolicy:474` / `zccTunnelFailPolicy:475` / `zccFailCloseSettings*:449–472`), but which one wins when both are set is not documented in the captured sources — lab-test or capture a vendor source before promising a precedence order to a customer. See [clarification `zcc-85`](../_meta/clarifications.md#zcc-85-app-profile-fail-close-vs-tenant-failopenpolicy-precedence).

## Cross-links

- Trusted-network detection criteria (the input side) — [`./trusted-networks.md`](./trusted-networks.md)
- Z-Tunnel 1.0 vs 2.0 details + bypass architecture — [`./z-tunnel.md`](./z-tunnel.md)
- Web Policy / App Profile (where scope + Forwarding Profile selection lives) — [`./web-policy.md`](./web-policy.md)
- ZCC API surface / wire format — [`./api.md`](./api.md)
- Where ZIA picks up after ZCC has decided to forward — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- ZPA client-side segment matching (runs on ZCC) — [`../zpa/app-segments.md`](../zpa/app-segments.md)
- Cross-product policy evaluation — [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md)
- Wire-format schema for `_data/snapshot/<cloud>/zcc/forwarding-profiles.json` (jq queries, profile-ID join to web-policy) — [`./snapshot-schema.md`](./snapshot-schema.md)
- QUIC bypass and Cloud App Control interaction — [`../zia/cloud-app-control.md`](../zia/cloud-app-control.md)
