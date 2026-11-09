# ZCC forwarding profile calls: integer codes, read and write types, and where the contract and SDKs differ (zcc.api.forwarding-profile-wire)
Also called: forwarding profile edit POST; lbsZpaProbeInterval; latencyBasedZpaServerEnablement; isSameAsOnTrustedNetwork pointer; webForwardingProfile edit; enableLWFDriver contract type; forwarding profile wire format; networkType values; actionType values; conditionType values; primaryTransport values; forwarding profile enum; unified tunnel; enableUnifiedTunnel; actionTypeZIA; forwarding profile get vs post; trustedNetworkIdsSelected
Former IDs: zcc-01, zcc-02, zcc-03, zcc-04

The forwarding profile is one large object read from `listByCompany` and written whole with one `edit` call. Field names and the API paths are in the generated surface; this subject holds what the field list does not say.

## One call for create and update

Forwarding profiles are created and updated through the same `POST /webForwardingProfile/edit`: the contract has a POST on that path described as updating a profile, the Go SDK's create function posts there and reports a 'create/update' failure, and the Python `update_forwarding_profile` posts there too. [zcc.api.forwarding-profile-wire:edit-is-post] The `edit` endpoints do not share a method: the contract has POST for forwarding profiles but PUT for the fail-open policy, trusted networks and web policies. [zcc.api.forwarding-profile-wire:edit-methods-differ] The response carries `success` and `id`, which the provider does not check: [Forwarding-profile create does not check the `success` field the API returns. After a nil error the SDK logs the response object and returns it; the provider logs `success` and goes straight on to look the profile up by the returned ID and, if that fails, by name.](kb:zcc.terraform.field-fidelity:create-ignores-success-flag).

## Codes, not names

The Go SDK declares `conditionType` on its `ForwardingProfile` struct and, on the `ForwardingProfileAction` struct, `networkType`, `actionType`, `primaryTransport` and `tunnel2FallbackType` as `int` fields, and many on/off settings (for example `evaluateTrustedNetwork`, `enableSplitVpnTN`, `allowTLSFallback`, `pathMtuDiscovery`) as `int` rather than booleans. [zcc.api.forwarding-profile-wire:go-int-codes] The contract types several of the same fields as strings [divergence:zcc.api.forwarding-profile-wire:code-field-type].

The Terraform provider's resource documentation gives these codes: `condition_type` 0 for OR (ANY) and 1 for AND (ALL); `network_type` 0 off-trusted and 1 on-trusted; `action_type` 0 direct, 1 tunnel, 2 none; `primary_transport` 0 TLS and 1 DTLS; the `network_type`, `action_type` and `primary_transport` lists each end with "etc.". [zcc.api.forwarding-profile-wire:provider-doc-codes] None of these values is confirmed by the vendor's API documentation: the network type [gap:zcc.api.forwarding-profile-wire:network-type-values], the action [gap:zcc.api.forwarding-profile-wire:action-type-values], the transport [gap:zcc.api.forwarding-profile-wire:primary-transport-values] and the profile's condition match [gap:zcc.api.forwarding-profile-wire:condition-type-values] remain open. Which console setting each other action field carries is open too [gap:zcc.api.forwarding-profile-wire:action-field-mapping].

## Read and write types differ

The Go SDK reads with one set of types and writes with another, noting that the API uses different names and types for POST than for GET: `active` and `enableLWFDriver` are strings on read and integers on write; in ZIA actions `mtuForZadapter` and `blockUnreachableDomainsTraffic` are read as number-or-string and written as strings; the ZPA action's `mtuForZadapter` is an integer on read and a string on write; `isSameAsOnTrustedNetwork` is a plain boolean on read and an optional boolean on write. [zcc.api.forwarding-profile-wire:get-post-asymmetry] The contract types `enableLWFDriver` and `active` differently from the Go write type [divergence:zcc.api.forwarding-profile-wire:lwf-driver-write-type], and makes `mtuForZadapter` an integer [divergence:zcc.api.forwarding-profile-wire:mtu-write-type]. How the provider reads `active` and `enableLWFDriver` is in [The forwarding-profile resource reads `active` and `enableLWFDriver` through a helper that accepts both "1" and "true" (any case), while the data source tests only for "1". If the API returns "true", the resource reports true and the data source reports false for the same profile.](kb:zcc.terraform.field-fidelity:strict-versus-lenient-boolean-strings).

On read, the Go SDK accepts either a JSON number or a quoted integer for the ZIA action fields typed `IntOrString` (including `dropIpv6Traffic`, `redirectWebTraffic` and `latencyBasedZenEnablement`), and fails on any other value. [zcc.api.forwarding-profile-wire:intorstring-read] The SDK's shared type says some ZCC numeric fields come back as empty strings on policies that were never touched. If a forwarding-profile response does that for one of these fields, the Go list call fails to decode and returns an error for the whole list. [zcc.api.forwarding-profile-wire:empty-string-breaks-list]

`isSameAsOnTrustedNetwork` is a plain boolean on the Go read types, with `omitempty` on the ZIA action and without it on the ZPA action, but a pointer to a boolean with `omitempty` on the ZIA and ZPA action write types, so a write can send an explicit false and leaves the key out only when the pointer is nil. The provider's comment says the API omits the key from the GET response entirely. [zcc.api.forwarding-profile-wire:same-as-trusted-pointer] Zero values on the other fields are in [The ZCC forwarding profile request encodes some booleans as integers and tags `sendTrustedNetworkResultToZpa` and `sameAsOnTrusted` `omitempty`, so the provider's 0 for false sends no key. `isSameAsOnTrustedNetwork` is a pointer, which is the form that can carry an explicit false.](kb:shared.sdk-go.zero-value-writes:zcc-forwarding-profile-zero-ints).

## Fields a client cannot carry

The Go write type has no field for `trustedNetworks` or `trustedNetworkIdsSelected` on the profile, or for `systemProxy`, `sendAllDNSToTrustedServer`, `optimiseForUnstableConnections` or `dropIpv6TrafficInIpv6Network` on a ZIA action, although the read type carries them all. [zcc.api.forwarding-profile-wire:go-request-omissions] The Terraform consequences are in [The four ZIA action attributes are never sent. The action request type the SDK posts has no field for them, and the provider's expand function for actions does not set them, so a value written in configuration does not reach the request body.](kb:zcc.terraform.field-fidelity:action-fields-never-sent) and [Of the three trusted-network lists on a forwarding profile, only `trusted_network_ids` is ever sent. `trusted_networks` and `trusted_network_ids_selected` are declared Optional and Computed, but the request type has no field for them, the expand function builds only `TrustedNetworkIds`, and flatten overwrites both from the API response. An unset `trusted_network_ids` is sent as an empty list.](kb:zcc.terraform.field-fidelity:trusted-network-lists-read-only). What `trustedNetworkIdsSelected` means is open [gap:zcc.api.forwarding-profile-wire:ids-selected].

The Python SDK's `update_forwarding_profile` renames keys the model declares to their wire keys, keeps wire-form keys and the legacy snake_case set (`WebPolicy.SNAKE_CASE_KEYS`) unchanged, camel-cases any other key, and stores each value under its new key; a nested value is passed through the same key conversion. [zcc.api.forwarding-profile-wire:python-keys-only] The Python model has no attribute for `optimiseForUnstableConnections` or `sendAllDNSToTrustedServer` on an action or for `trustedNetworkIdsSelected` on the profile; such keys are dropped when a response is read into the model. A caller who passes them by wire name sends them unchanged, but a snake_case name is camel-cased word by word, so `send_all_dns_to_trusted_server` goes out as `sendAllDnsToTrustedServer`, not the wire key `sendAllDNSToTrustedServer`. [zcc.api.forwarding-profile-wire:python-model-coverage] How the Python serializer picks keys is in [How the Python SDK names ZCC keys on the wire: the model serializer and the parameter mapper](kb:zcc.sdk-python.wire-keys).

## Key names

The four ZPA latency settings have different names in the contract and in the Go SDK [divergence:zcc.api.forwarding-profile-wire:zpa-latency-key-names]. How the provider hides them from drift is [On every read, the four ZPA latency settings (`latency_based_server_enablement`, `lbs_probe_interval`, `lbs_probe_sample_size`, `lbs_threshold_limit`) are replaced with the value already in state whenever that is known, so out-of-band changes to them do not appear. The workaround exists because it assumes the SDK response type has differently named tags; in SDK v3.8.37 and v3.8.47, the releases the provider's go.mod pins, the tags are the plain names the API returns. The same overlay applies to `is_same_as_on_trusted_network` (see the next claim's places).](kb:zcc.terraform.field-fidelity:zpa-latency-overlay-masks-drift).

## Unified tunnel

Both SDKs model an `enableUnifiedTunnel` flag and a `unifiedTunnel` list whose entries each name a `networkType` and carry separate `actionTypeZIA` and `actionTypeZPA` codes alongside transport, MTU, fallback, IPv6 and system proxy settings and a `sameAsOnTrusted` flag; the Go entry also carries `sendAllDNSToTrustedServer`. [zcc.api.forwarding-profile-wire:unified-tunnel-shape] The contract's `edit` request body has no `unifiedTunnel` or `enableUnifiedTunnel` member, while the Go write type sends a `unifiedTunnel` list. [zcc.api.forwarding-profile-wire:contract-no-unified-tunnel] What unified tunnel mode changes for the device is open in [What unified tunnel mode changes for the device](kb:zcc.forwarding-profiles:unified-tunnel-semantics).

## Paging

The list call makes one request: [The ZCC forwarding-profile list call makes one GET to `listByCompany` with optional `page` and `pageSize` and returns that single response; it does not walk pages. The provider's Read, and its post-create and post-update lookups, call it with no page or page size.](kb:shared.sdk-go.list-pagination:zcc-forwarding-profile-single-request).

## Fail-open policy

`GET /webFailOpenPolicy/listByCompany` returns a list of fail-open policies for the company. [zcc.api.forwarding-profile-wire:failopen-list] Whether a tenant ever has more than one fail-open policy is open [gap:zcc.api.forwarding-profile-wire:failopen-cardinality]. What the fail-open settings do is in [Client Connector fail-open: captive portals, unreachable Service Edges and tunnel failures](kb:zcc.forwarding-profiles.fail-open).

What to check:
1. Before reading meaning into a `networkType`, `actionType`, `primaryTransport` or `conditionType` value, whether the value has been checked against the console for that tenant.
2. When hand-building an edit payload from a read: retype the fields whose read and write types differ, and send codes as JSON numbers unless the tenant is known to accept strings.
3. Which key names a raw response uses for the ZPA latency settings, before trusting either the contract or the SDK.
4. Whether a hand-built write followed the contract types for `enableLWFDriver` and `mtuForZadapter` or the SDK types.
5. Whether a Go forwarding-profile list failed to decode because a numeric field came back as an empty string or a float.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.api.forwarding-profile-wire:empty-string-breaks-list] Tier B: The empty-string behavior is the shared type's code comment ('a few fields come back as empty strings when the policy has never been touched'), not observed on a forwarding profile.
- [zcc.api.forwarding-profile-wire:python-model-coverage] Tier B: Rests on the absence of the three keys from the model file at the pin, and on the serializer keeping keys without an underscore and camel-casing other unknown keys (python-keys-only). The snake_case case is traced, not sent.

Sources disagree (name both sides):
- The type of `enableLWFDriver` and `active` in the forwarding-profile write body: the contract says string, the Go write type says integer. [divergence:zcc.api.forwarding-profile-wire:lwf-driver-write-type]
  - api-specs: The contract's `edit` request body types `enableLWFDriver` and `active` as strings.
  - sdk-go: The Go write type sends `enableLWFDriver` and `active` as integers.
  Impact: A hand-built body that follows the contract sends a quoted value where the SDK sends a number. Which form the endpoint accepts is not settled by either source; the shared Go type's comment says ZCC write endpoints want numbers.
- The type of `mtuForZadapter` on writes: the contract makes it an integer on the ZIA and ZPA actions, while the Go write types send it as a string. [divergence:zcc.api.forwarding-profile-wire:mtu-write-type]
  - api-specs: The contract's ZIA and ZPA action items type `mtuForZadapter` as an int32 integer.
  - sdk-go: The Go ZPA action write type sends `mtuForZadapter` as a string, as do the ZIA action and unified-tunnel write types.
  Impact: Code written to the contract sends a number where the SDK sends a quoted number. Check a raw read and a successful UI-made write before choosing.
- The key names of the four ZPA latency settings: the contract uses ZPA-prefixed names (`latencyBasedZpaServerEnablement`, `lbsZpaProbeInterval`, `lbsZpaProbeSampleSize`, `lbsZpaThresholdLimit`), the Go SDK uses unprefixed ones, and the provider's comment says the API returns the unprefixed forms, while a recorded response uses the prefixed ones. [divergence:zcc.api.forwarding-profile-wire:zpa-latency-key-names]
  - api-specs: The contract's ZPA action items carry `latencyBasedZpaServerEnablement` and `lbsZpaProbeInterval`, with `lbsZpaProbeSampleSize` and `lbsZpaThresholdLimit` alongside.
  - sdk-go: The Go ZPA action read and write types tag the fields `latencyBasedServerEnablement`, `lbsProbeInterval`, `lbsProbeSampleSize` and `lbsThresholdLimit`.
  - tf-zcc: The provider's comment says the API actually returns the unprefixed forms, and that an SDK with the prefixed tags leaves the fields at zero.
  - sdk-python: A recorded `listByCompany` response from one test tenant (recorded with SDK 1.9.13, Python SDK cassette) uses the contract's prefixed keys, for example `latencyBasedZpaServerEnablement` 0 and `lbsZpaProbeInterval` 30, and no unprefixed form.
  Impact: The recording supports the contract against the provider comment: against that tenant the Go read type at the pin, tagged `lbsProbeInterval` and the other unprefixed names, decodes the latency settings as zero, and the Go write sends keys the response does not use, so the settings are not managed through the SDK or the provider. Whether every tenant returns the prefixed names is not shown.
- Whether the action codes are JSON numbers or strings: the API contract types `networkType`, `actionType` and `primaryTransport` in forwarding profile actions as strings of format byte, while the Go SDK reads and writes them as integers. [divergence:zcc.api.forwarding-profile-wire:code-field-type]
  - api-specs: string (format byte); the same contract types the profile's `conditionType` as int32
  - sdk-go: int, on both read and write
  - sdk-python: A recorded `listByCompany` response from one test tenant (recorded with SDK 1.9.13, Python SDK cassette) returns the action codes as JSON numbers.
  Impact: A client generated from the contract would expect and send strings, while the recorded response carries numbers, which Go's int fields decode; which form the edit endpoint accepts for each field is not documented.

Not known (open gaps):
- Whether a tenant has one fail-open policy or several [gap:zcc.api.forwarding-profile-wire:failopen-cardinality]: settled by tenant-data. Blocks: choosing which fail-open policy an edit should target
- Which networkType code is which network type [gap:zcc.api.forwarding-profile-wire:network-type-values]: settled by tenant-data or lab-test. Blocks: reading a network type from raw profile data
- Which actionType code is which forwarding mode [gap:zcc.api.forwarding-profile-wire:action-type-values]: settled by tenant-data or lab-test. Blocks: saying from raw data whether a network type tunnels, proxies or sends traffic direct
- Which primaryTransport code is DTLS and which TLS [gap:zcc.api.forwarding-profile-wire:primary-transport-values]: settled by tenant-data or lab-test
- Which profile conditionType code is Any and which All [gap:zcc.api.forwarding-profile-wire:condition-type-values]: settled by tenant-data or lab-test. Blocks: saying whether a profile needs all of its conditions or any one
- What trustedNetworkIdsSelected means beside trustedNetworkIds [gap:zcc.api.forwarding-profile-wire:ids-selected]: settled by tenant-data
- Which console setting each forwarding profile action field carries [gap:zcc.api.forwarding-profile-wire:action-field-mapping]: settled by tenant-data or lab-test. Blocks: reading console behavior from raw forwarding profile data

Area: zcc.api, its subjects in references/_meta/spine/zcc/zcc.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.terraform.field-fidelity.md (ZCC Terraform provider fields that are not sent, not read back, or collapsed)
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.md (ZCC forwarding profiles)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.fail-open.md (Client Connector fail-open: captive portals, unreachable Service Edges and tunnel failures)
- links-to references/_meta/text/zcc/zcc.sdk-python.wire-keys.md (How the Python SDK names ZCC keys on the wire: the model serializer and the parameter mapper)
