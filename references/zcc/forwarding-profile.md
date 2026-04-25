---
product: zcc
topic: "zcc-forwarding-profile"
title: "ZCC forwarding profile — how ZCC decides where to send traffic"
content-type: reasoning
last-verified: "2026-04-24"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/forwarding_profile.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/failopenpolicy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/fail_open_policy.py"
  - "vendor/zscaler-help/what-is-zscaler-client-connector.md"
  - "vendor/zscaler-help/choosing-traffic-forwarding-methods.md"
author-status: draft
---

# ZCC forwarding profile — how ZCC decides where to send traffic

The forwarding profile is **the policy object that runs on the endpoint** and decides, per packet, where to send it — into a Z-Tunnel toward a Public Service Edge (ZIA), into the ZPA Microtunnel (ZPA), into a local PAC, or direct. Misunderstanding the forwarding profile is the #1 source of "traffic bypassed Zscaler" mysteries.

## Summary

A forwarding profile describes **how ZCC should behave on different classes of network** — typically "trusted" (corporate LAN / VPN) and "untrusted" (home Wi-Fi, coffee shop) and sometimes more granular tiers. The profile object contains:

1. **Trusted-network evaluation inputs** — a set of TrustedNetwork references (see [`./trusted-networks.md`](./trusted-networks.md)) plus inline criteria (DNS servers, hostnames, SSIDs, etc.). ZCC evaluates these continuously on the endpoint to decide *which branch of the profile is active*.
2. **ZIA actions per network type** (`forwardingProfileActions`) — for each network classification (Trusted, Untrusted, etc.), what to do with Internet-bound traffic: send to Z-Tunnel, use a PAC, send direct (`NONE`), etc.
3. **ZPA actions per network type** (`forwardingProfileZpaActions`) — same shape, but independently configurable for ZPA traffic. A profile can be, say, "ZIA via Z-Tunnel 2.0, ZPA always on" or "on trusted network, skip ZIA but keep ZPA."
4. **Fail-open policy** — a separate policy object (`FailOpenPolicy`, one per company) that decides what happens when the tunnel or proxy is unreachable, or a captive portal is blocking auth.

A ZCC install has **exactly one active forwarding profile at a time per device**, selected by the user/device's active WebPolicy (called "App Profile" in the admin UI) via its `forwarding_profile_id` field. See [`./web-policy.md`](./web-policy.md) for the assignment link.

## Wire-type correction — enum fields are integer-coded, not strings

**Cross-SDK validation (2026-04-24) against `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go` revealed that all the enum-like fields on ForwardingProfile and its action blocks are `int` on the wire, not string enums.** The Python SDK passes kwargs through without type enforcement, which made it look like operators could send strings like `"TRUSTED_CRITERIA_AND"` or `"ZTUNNEL"` — but the API actually expects small integers. Fields affected:

- `conditionType` (both on ForwardingProfile and on TrustedNetwork)
- `networkType` (on each `forwardingProfileActions[]` and `forwardingProfileZpaActions[]` entry)
- `actionType` (same)
- `primaryTransport` (same)
- `tunnel2FallbackType` (same)

Plus these flags that look boolean-ish but are `int` (0/1) on the wire: `enableLWFDriver` (string in Go!), `enableSplitVpnTN`, `enableUnifiedTunnel`, `enableAllDefaultAdaptersTN`, `evaluateTrustedNetwork`, `skipTrustedCriteriaMatch`, `systemProxy`, `enablePacketTunnel`, `allowTLSFallback`, `pathMtuDiscovery`, `optimiseForUnstableConnections`, `useTunnel2ForProxiedWebTraffic`, `useTunnel2ForUnencryptedWebTraffic`, `sendAllDNSToTrustedServer`.

**The specific integer-to-meaning mapping is still undocumented** — clarifications `zcc-01` through `zcc-04` and `zcc-06` remain open on the semantic half. But the *datatype* is now confirmed: integer, not string. Tools writing payloads directly must send ints, not strings.

## Mechanics

### The profile object

From `zscaler/zcc/models/forwardingprofile.py`, the top-level fields on a `ForwardingProfile`:

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
| `predefined_tn_all` | `predefinedTnAll` | Boolean; shortcut that treats any of a pre-defined set of trusted networks as a match. |
| `predefined_trusted_networks` | `predefinedTrustedNetworks` | The resolved set behind the above shortcut. |
| `condition_type` | `conditionType` | How trusted-criteria combine (AND vs OR across the inline fields + referenced TrustedNetworks). Enum values not documented in SDK; see [`clarification zcc-01`](../_clarifications.md#zcc-01-forwarding-profile-condition_type-enum). |
| `evaluate_trusted_network` | `evaluateTrustedNetwork` | Master toggle — if false, trusted-network evaluation is skipped entirely and only the Untrusted action branch applies. |
| `skip_trusted_criteria_match` | `skipTrustedCriteriaMatch` | Bypass criteria evaluation (forces a specific branch). Mutually-exclusive relationship with `evaluate_trusted_network` not confirmed; see `zcc-01`. |
| `enable_lwf_driver` | `enableLWFDriver` | Windows Lightweight Filter driver mode — affects how ZCC intercepts traffic on Windows. |
| `enable_split_vpn_t_n` | `enableSplitVpnTN` | Split VPN Trusted Network mode — when ZCC is running alongside a full VPN, consult the VPN's network as the trusted criterion. |
| `forwarding_profile_actions` | `forwardingProfileActions` | **List** of per-network-type ZIA actions. One item per network classification. See [§ ForwardingProfileActions](#forwardingprofileactions-zia-actions-per-network-type). |
| `forwarding_profile_zpa_actions` | `forwardingProfileZpaActions` | **List** of per-network-type ZPA actions. Parallel structure; independently configurable. |

### ForwardingProfileActions — ZIA actions per network type

Each item in `forwardingProfileActions` is keyed by `networkType` — the classification this action block applies to. Typical values include `TRUSTED`, `UNTRUSTED` (and likely `CAPTIVE_PORTAL` / `VPN_TRUSTED_NETWORK` / similar — the enum isn't documented in the SDK; see [`clarification zcc-02`](../_clarifications.md#zcc-02-forwarding-profile-network_type-enum)).

The `actionType` field within the block decides what happens to Internet traffic on that network. Known values from field names and typical ZCC semantics: `NONE` (send direct, skip ZIA), `PAC` (honor a PAC file), `ENFORCE_POLICIES` / `TUNNEL` (send through Z-Tunnel for ZIA inspection). The exact enum list is not documented in the SDK code; see [`clarification zcc-03`](../_clarifications.md#zcc-03-forwarding-profile-action_type-enum).

**If `actionType: NONE` is configured on the Trusted branch, ZCC bypasses ZIA entirely on trusted networks.** This is the single most common "why didn't ZIA see this traffic?" finding. A tenant that adds a TrustedNetwork for a user's home Wi-Fi (accidentally or deliberately) effectively exempts that user from ZIA inspection while at home.

Per-action sub-fields that shape the tunnel/probe behavior:

| Field | Wire key | Role |
|---|---|---|
| `primary_transport` | `primaryTransport` | Z-Tunnel transport preference. Seen values likely include `ZTUNNEL` (v2), `DTLS`, `TLS` — exact enum unconfirmed. |
| `allow_tls_fallback` | `allowTLSFallback` | If DTLS fails, fall back to TLS. |
| `tunnel2_fallback` | `tunnel2Fallback` | Fallback behavior when Z-Tunnel 2.0 fails — typically drops to Z-Tunnel 1.0. |
| `use_tunnel2_for_proxied_web_traffic` | `useTunnel2ForProxiedWebTraffic` | Explicit Z-Tunnel 2.0 toggle for web traffic. |
| `enable_packet_tunnel` | `enablePacketTunnel` | Packet-level tunnel vs L4/L7 proxy. |
| `latency_based_zen_enablement` | `latencyBasedZenEnablement` | Pick best Service Edge based on latency probes. |
| `zen_probe_interval` / `zen_probe_sample_size` / `zen_threshold_limit` | — | Latency probe tuning. |
| `redirect_web_traffic` | `redirectWebTraffic` | Whether to redirect web traffic into the tunnel at all. |
| `system_proxy` / `system_proxy_data` | `systemProxy` / `systemProxyData` | OS-level proxy integration (PAC URL, proxy server, bypass rules). Relevant when ZCC is configured to honor an existing enterprise proxy. |
| `custom_pac` | `customPac` | Custom PAC content or URL. For PAC semantics (variable substitution, Kerberos, 10-version history, self-hosted-loses-variables rule) see [`../shared/pac-files.md`](../shared/pac-files.md). |
| `drop_ipv6_traffic` / `drop_ipv6_traffic_in_ipv6_network` / `drop_ipv6_include_traffic_in_t2` | — | IPv6 handling. ZCC's IPv6 support is limited historically; these flags control the drop behavior. |
| `path_mtu_discovery` / `mtu_for_zadapter` | — | Path MTU and ZCC virtual-adapter MTU. |
| `dtls_timeout` / `tls_timeout` / `udp_timeout` | — | Per-transport timeouts. |
| `block_unreachable_domains_traffic` | `blockUnreachableDomainsTraffic` | If a domain fails to resolve, whether to allow the attempt to fall through or block. Defensive setting; rarely the primary cause of an issue. |
| `network_type` | `networkType` | The branch this action block applies to (see above). |

### ForwardingProfileZpaActions — ZPA actions per network type

Parallel structure; independent of ZIA actions. One action block per network type, keyed the same way. Notable fields:

| Field | Wire key | Role |
|---|---|---|
| `action_type` | `actionType` | NONE / tunnel / etc., as above but for ZPA. |
| `latency_based_zpa_server_enablement` | `latencyBasedZpaServerEnablement` | Pick best ZPA Service Edge based on latency. |
| `latency_based_server_mt_enablement` | `latencyBasedServerMTEnablement` | Latency-based Source MT (microtenant-aware) ZPA server selection. |
| `lbs_zpa_probe_interval` / `lbs_zpa_probe_sample_size` / `lbs_zpa_threshold_limit` | — | ZPA-side latency probe tuning. |
| `send_trusted_network_result_to_zpa` | `sendTrustedNetworkResultToZpa` | Whether ZCC tells ZPA the current trusted-network state. Affects ZPA policy rules that use the TRUSTED_NETWORK condition. |
| `partner_info` | `partnerInfo` | Partner-integration sub-object. |
| `primary_transport` | `primaryTransport` | Transport preference for ZPA tunnel. |

**Key cross-product hook: `sendTrustedNetworkResultToZpa`**. ZPA access-policy rules can reference a TRUSTED_NETWORK condition. That condition is sourced from ZCC's live evaluation of the active forwarding profile's trusted-network criteria — not from ZPA's own knowledge of the client network. If this toggle is off, ZPA rules relying on TRUSTED_NETWORK will never match regardless of whether the user actually is on a trusted network.

### The two action lists are independent

A profile can set:

- `forwardingProfileActions[TRUSTED].actionType = NONE` (ZIA off on trusted network — e.g. corporate LAN with separate perimeter controls)
- `forwardingProfileZpaActions[TRUSTED].actionType = TUNNEL` (ZPA on everywhere)

This means a device on a trusted corporate LAN may send Internet traffic direct while still tunneling ZPA internal apps through the ZPA cloud. Common pattern for offices with an on-prem internet gateway but no on-prem ZPA.

### Trusted-network evaluation

Per the model, ZCC uses three kinds of trusted-criteria input:

1. **Inline criteria on the profile** — `dns_servers`, `dns_search_domains`, `hostname`+`resolved_ips_for_hostname`, `trusted_dhcp_servers`, `trusted_gateways`, `trusted_subnets`, `trusted_egress_ips`.
2. **Referenced TrustedNetwork entities** — `trusted_network_ids` points to standalone TrustedNetwork objects defined separately (see [`./trusted-networks.md`](./trusted-networks.md)).
3. **Predefined set** — `predefined_tn_all` / `predefined_trusted_networks` act as a shortcut for "any of a pre-declared set of networks."

How these combine: `condition_type` controls AND vs OR across the pieces. The enum isn't documented in the SDK — see `zcc-01`. Likely values: `AND` (all criteria must match), `OR` (any matches), or possibly `TRUSTED_CRITERIA_AND` / `TRUSTED_CRITERIA_OR` style strings. Lab-test at first tenant onboarding.

**`evaluate_trusted_network` is the master switch.** If false, the TRUSTED branch of both action lists never fires; ZCC behaves as if always on an untrusted network. A tenant that sees "all my users are treated as untrusted even on corporate LAN" should check this flag first.

### Fail-open policy — what happens when the cloud is unreachable

A separate `FailOpenPolicy` object lives at the company level (one per tenant), distinct from the forwarding profile. Fields:

| Field | Wire key | Behavior |
|---|---|---|
| `enable_fail_open` | `enableFailOpen` | Master toggle. If true, when the tunnel/proxy is unreachable, ZCC allows traffic out direct. If false, traffic is blocked. |
| `enable_captive_portal_detection` | `enableCaptivePortalDetection` | Whether ZCC detects a captive portal (hotel Wi-Fi, airport) that intercepts HTTP requests. |
| `captive_portal_web_sec_disable_minutes` | `captivePortalWebSecDisableMinutes` | Grace period during which ZCC disables web security so the user can complete captive-portal auth. After the grace period expires, ZCC re-enforces and may block the user if they're still not authenticated through the portal. |
| `enable_strict_enforcement_prompt` | `enableStrictEnforcementPrompt` | When enabled, prompts the user before letting fail-open happen, instead of silently allowing. |
| `strict_enforcement_prompt_delay_minutes` | `strictEnforcementPromptDelayMinutes` | Delay before the prompt appears. |
| `strict_enforcement_prompt_message` | `strictEnforcementPromptMessage` | Custom text. |
| `tunnel_failure_retry_count` | `tunnelFailureRetryCount` | How many times ZCC retries the tunnel before declaring "unreachable" and applying fail-open. |
| `enable_web_sec_on_proxy_unreachable` | `enableWebSecOnProxyUnreachable` | When PAC-proxy mode is active and the proxy is unreachable, whether web security still runs. |
| `enable_web_sec_on_tunnel_failure` | `enableWebSecOnTunnelFailure` | When Z-Tunnel fails, whether web security still attempts to run (e.g. via a fallback path). |

**Captive portal grace period is a common "user got blocked at the airport" story.** `captivePortalWebSecDisableMinutes` is set by admins between 1 and 60 minutes (Zscaler's guidance: set as low as reasonable for users to complete portal auth). If a user logs into the portal slowly, they hit the re-enforcement window and are blocked until they disconnect/reconnect. Not a ZIA URL filter issue — a ZCC fail-open issue. Point the operator here, not at URL filtering rules.

**Captive portal settings were migrated from tenant-global to App Profile scope** per the ZCC release notes and the *About Zscaler Client Connector App Profiles* help article. Older tenants may still have the setting at the Client Connector Support page (global); newer tenants configure it per App Profile (== per Web Policy). The FailOpenPolicy object this doc describes is the cross-tenant/global shape; per-profile captive-portal overrides live on the Web Policy's platform sub-policies (see [`./web-policy.md`](./web-policy.md)). When answering "why did this user get captive-portal-blocked and that user didn't on the same network", the answer is likely per-profile configuration, not the tenant-global FailOpenPolicy.

## Fields Python SDK doesn't expose (Go-SDK-only)

Cross-SDK audit (2026-04-24) against `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go:36-135` surfaced fields the Python SDK doesn't model. These fields exist on the wire and are settable via direct API call or Go SDK:

**On `ForwardingProfile`:**

- `enableUnifiedTunnel` (int, 0/1) — master toggle for the Unified Tunnel feature (see next section).
- `unifiedTunnel` (list of `UnifiedTunnel` sub-objects) — per-network-type unified-tunnel configuration.
- `enableAllDefaultAdaptersTN` (int, 0/1) — whether all OS default network adapters participate in trusted-network evaluation.
- `trustedNetworkIdsSelected` (list of int) — distinct from `trustedNetworkIds`. Relationship unclear; may be UI-selection state vs authoritative reference list. Needs tenant confirmation.

**On `forwardingProfileActions[]` items:**

- `tunnel2FallbackType` (int enum) — specific kind of Z-Tunnel 2.0 fallback to perform. Python SDK had only a generic `tunnel2_fallback` bool.
- `useTunnel2ForUnencryptedWebTraffic` (int, 0/1) — sibling of `useTunnel2ForProxiedWebTraffic`. Controls Z-Tunnel 2.0 behavior for unencrypted web traffic separately from proxied.
- `optimiseForUnstableConnections` (int, 0/1) — performance tuning for flaky networks.
- `sendAllDNSToTrustedServer` (int, 0/1) — forwards all DNS queries to the trusted DNS server rather than resolving normally.
- `dropIpv6IncludeTrafficInT2` (IntOrString) — IPv6 drop behavior specific to Z-Tunnel 2.0.
- `latencyBasedServerEnablement` / `lbsProbeInterval` / `lbsProbeSampleSize` / `lbsThresholdLimit` / `latencyBasedServerMTEnablement` — latency-based server selection on the ZIA-actions side. Python SDK had these only on ZPA actions.
- `isSameAsOnTrustedNetwork` (bool) — matches the "Same as On-Trusted Network" UI checkbox per [`./z-tunnel.md § 5-Phase deployment`](./z-tunnel.md). Explicit cross-reference to the trusted branch rather than requiring field duplication.

## Unified Tunnel — a third tunnel mode not documented in Python SDK

The Go SDK exposes a `UnifiedTunnel` sub-structure (`forwarding_profile.go:119-135`) distinct from both ForwardingProfileActions and ForwardingProfileZpaActions. Shape:

| Field | Role |
|---|---|
| `networkType` (int) | Which network-type branch this unified-tunnel entry applies to. |
| `actionTypeZIA` (int) | What to do with ZIA traffic on this branch. |
| `actionTypeZPA` (int) | What to do with ZPA traffic on this branch. Separate from ZIA because a unified tunnel can still differentiate which traffic-kind takes which action. |
| `primaryTransport` (int) | Transport preference for the unified tunnel. |
| `tunnel2FallbackType` / `allowTLSFallback` / timeout fields | Standard tunnel-tuning knobs. |
| `pathMtuDiscovery` / `mtuForZadapter` | MTU tuning. |
| `optimiseForUnstableConnections` | Performance tuning. |
| `redirectWebTraffic` | Whether to redirect web traffic through the listening proxy (see [`./z-tunnel.md § 3.8+ Windows options`](./z-tunnel.md)). |
| `dropIpv6Traffic` / `dropIpv6TrafficInIpv6Network` | IPv6 handling. |
| `blockUnreachableDomainsTraffic` | Defensive fallback behavior. |
| `dropIpv6IncludeTrafficInT2` | IPv6 + Z-Tunnel 2.0 interaction. |
| `sendAllDNSToTrustedServer` | DNS forwarding behavior. |
| `systemProxyData` | OS-proxy integration (same sub-object as ForwardingProfileAction uses). |
| `sameAsOnTrusted` (int, 0/1) | "Inherit settings from On-Trusted branch." |

**What Unified Tunnel is (inferred from structure)**: a forwarding mode where ZIA and ZPA traffic share a single transport connection to the Zscaler cloud, rather than maintaining two separate Z-Tunnels (one for ZIA → PSE, one for ZPA → Service Edge). `actionTypeZIA` and `actionTypeZPA` are separate within the same sub-object because unified transport doesn't mean unified policy — individual traffic kinds can still be routed differently.

This is a **third tunnel configuration mode** alongside the traditional two-tunnel model. Not documented in the Python SDK at all. Customer-facing help articles don't surface it in the `what-is-zscaler-client-connector.md` or the `about-z-tunnel-1.0-z-tunnel-2.0.md` we captured — it appears to be a newer feature. Worth flagging as a potential question shape the skill should recognize: "what is Unified Tunnel?" → this section.

**Follow-up to resolve**: capture a help article specifically about Unified Tunnel if one exists. The SDK side is now known; the customer-side operational semantics need doc backing.

## Edge cases

- **Profile has no TRUSTED branch at all.** If `forwardingProfileActions` doesn't include an item with `networkType = TRUSTED`, ZCC treats all networks as untrusted regardless of criteria match. Valid configuration; be aware that the absence of a TRUSTED action block is functionally the same as `evaluate_trusted_network = false`.
- **Trusted-network criteria match at home by accident.** If `trusted_dhcp_servers` or `trusted_subnets` are broad enough to match a common home-network config (e.g., `192.168.1.0/24`, which is the default for many consumer routers), users on home Wi-Fi can be classified TRUSTED and skip ZIA inspection. Audit trusted criteria for specificity.
- **ZPA TRUSTED_NETWORK policy rules silently don't fire** when `sendTrustedNetworkResultToZpa` is off on the active forwarding profile's ZPA actions, or when `evaluateTrustedNetwork` is false at the profile level. Check both before chasing ZPA-side rule logic.
- **Z-Tunnel 2.0 + Bandwidth Control.** Per `references/zia/ssl-inspection.md`, HTTP/2 inspection falls back to HTTP/1.1 at locations where Bandwidth Control is enabled. This is a Service-Edge-side effect but it can look like a ZCC transport issue — rule out Bandwidth Control before suspecting ZCC.
- **System proxy integration overrides.** When `systemProxy` is enabled with `enablePAC`/`enableProxyServer` in `systemProxyData`, ZCC honors the OS-level proxy settings in addition to (or instead of) its own forwarding actions. Order of precedence is not clearly documented in the SDK; treat as operator-configured-to-taste and inspect the specific `systemProxyData` on the active profile.
- **IPv6 drop flags can break IPv6-only apps.** `dropIpv6Traffic`, `dropIpv6TrafficInIpv6Network`, and `dropIpv6IncludeTrafficInT2` all default to unspecified in the SDK; real-tenant defaults may silently drop IPv6. A user reporting "IPv6-only application fails on ZCC" should have these inspected.
- **App profile updates only propagate on logout/restart.** ZCC checks for app profile changes (forwarding profile, web policy, web privacy, etc.) and downloads them **only when the user logs out and logs back in, or restarts the computer**. There is no continuous polling. An operator pushing a critical policy change expecting it to take effect immediately on currently-connected devices will be surprised — connected devices keep using the cached profile until next ZCC restart/login event. This is distinct from subcloud propagation (15-min ZCC PAC poll for hosted-PAC content). Source: *About Zscaler Client Connector App Profiles* line 17.

## Open questions

- `condition_type` enum values and AND/OR semantics on the profile — [clarification `zcc-01`](../_clarifications.md#zcc-01-forwarding-profile-condition_type-enum).
- `network_type` enum values on action blocks (TRUSTED / UNTRUSTED / ?) — [clarification `zcc-02`](../_clarifications.md#zcc-02-forwarding-profile-network_type-enum).
- `action_type` enum values (NONE / TUNNEL / PAC / ENFORCE_POLICIES / ?) — [clarification `zcc-03`](../_clarifications.md#zcc-03-forwarding-profile-action_type-enum).
- `primary_transport` enum values (ZTUNNEL / DTLS / TLS / ?) — [clarification `zcc-04`](../_clarifications.md#zcc-04-forwarding-profile-primary_transport-enum).
- Precedence when `systemProxyData` and native forwarding actions both specify a path — [clarification `zcc-05`](../_clarifications.md#zcc-05-forwarding-profile-system-proxy-precedence).

## Cross-links

- Trusted-network detection criteria (the input side) — [`./trusted-networks.md`](./trusted-networks.md)
- Z-Tunnel 1.0 vs 2.0 details + bypass architecture — [`./z-tunnel.md`](./z-tunnel.md)
- Web Policy / App Profile (where scope + Forwarding Profile selection lives) — [`./web-policy.md`](./web-policy.md)
- ZCC API surface / wire format — [`./api.md`](./api.md)
- Where ZIA picks up after ZCC has decided to forward — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- ZPA client-side segment matching (runs on ZCC) — [`../zpa/app-segments.md`](../zpa/app-segments.md)
- Cross-product policy evaluation — [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md)
