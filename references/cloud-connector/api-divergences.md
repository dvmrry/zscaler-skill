---
product: cloud-connector
topic: "api-divergences"
title: "Cloud Connector (ZTW/ZTC) API source divergences"
content-type: reference
confidence: medium
source-tier: code
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/terraform-provider-ztc: 6516b4a032ef4a5ece183a0f42a5026b11ac94ca
  vendor/zscaler-terraform-skills: d8226c37f7fc7c544cbf60a9faf59eaa49051980
sources:
  - "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-divergences.md"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_dns_rules/traffic_dns_rules.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_log_rules/traffic_log_rules.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/dns_gateway/dns_gateway.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/dns_forwarding_gateway/dns_forwarding_gateway.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/zia_forwarding_gateway/zia_forwarding_gateway.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/workload_groups/workload_groups.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/provisioning_url/provisioning_url.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/v2_config.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/v2_client.go"
  - "vendor/zscaler-sdk-go/zscaler/errorx/errors.go"
  - "vendor/zscaler-sdk-go/zscaler/oneapiclient.go"
  - "vendor/zscaler-sdk-python/zscaler/ztw/forwarding_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/models/forwarding_rules.py"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_rule.go"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_dns_rule.go"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_forwarding_gateway.go"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_location_management.go"
  - "vendor/terraform-provider-ztc/ztc/provider.go"
  - "vendor/terraform-provider-ztc/ztc/config.go"
  - "vendor/terraform-provider-ztc/docs/index.md"
  - "vendor/terraform-provider-ztc/docs/resources/ztc_traffic_forwarding_rule.md"
  - "vendor/terraform-provider-ztc/docs/resources/ztc_traffic_forwarding_log_rule.md"
  - "vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md"
  - "vendor/zscaler-terraform-skills/skills/ztc-skill/references/auth-and-providers.md"
author-status: draft
---

# Cloud Connector (ZTW/ZTC) API source divergences

The captured Automate operation contract, Go SDK (`zscaler/ztw`), Python SDK (`zscaler.ztw`), Zscaler Terraform provider (`ztc_*`), and MCP tools are independently maintained views of the same Cloud & Branch Connector management API. Each was produced separately and updated at a different cadence. Where they agree, confidence is high. Where they diverge, an engineer needs to know which source to trust before writing code — and the answer changes by field, endpoint, and resource type.

A fourth signal is the help-site / Admin Console capture (`vendor/zscaler-help/cbc-*`). The console exposes operator-facing names ("forwarding method", "VM Size", "Local") that do not map one-to-one onto the API enums. Those console↔API gaps are real and trip up operators reading both surfaces, so they are documented here alongside the source-vs-source disagreements.

This product carries an extra wrinkle the ZIA/ZPA divergence docs do not: the same API is reached through **two auth paths** (legacy ZTC portal credentials and OneAPI/ZIdentity) and, in the Go SDK, through **two method families** (`*Resource`-suffixed client methods and the older ZIA-style bare `Create`/`Update`/`Delete`). Several entries below are about which family a given service uses.

**Quick trust hierarchy (applies unless an entry below overrides it):**

- For wire shape, trust the SDK source you are actually calling. The Go structs carry `,omitempty` on almost every field, so a zero-valued field is dropped from the serialized body — meaning a field one source omits is usually optional on the wire.
- The Go SDK treats enum-typed fields (`forwardMethod`, `type`, `action`) as **free strings** — the "Supported Values" lists in the Go doc comments are documentation, not validation. The Terraform provider, by contrast, enforces its enum with `validation.StringInSlice`. When the two enums disagree, neither is authoritative for what the *backend* accepts; the field is a free string on the wire and the real answer needs a live tenant.
- Console (help-capture) names are operator labels, not API values. Always translate to the API enum before writing code.
- Several of these divergences are also documented inline in the per-topic docs (`api.md`, `forwarding.md`, `dns-subsystem.md`, `sdk.md`, `terraform.md`). This file is the centralized, source-vs-source view; the per-topic docs carry the operator-facing treatment. Cross-references are noted per entry.

**Contract reconciliation now feeds this doc.** For documented method/path and field metadata (`required`, `readonly`, `enum`), the verification protocol prefers the captured Automate contract when it exists; Terraform validators remain authoritative only for what the provider accepts, and SDKs remain authoritative for wrapper behavior (`references/_meta/verification-protocol.md:114-118`). The generated ZTW reconciliation diffs `vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json` against Go, Python, Terraform, Ansible, and MCP surfaces (`vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-divergences.md:7-11`). It currently covers 16 mapped resources, with 17 contract-vs-Terraform required-flag drifts, 11 enum value conflicts, 4 one-sided enum constraints, no contract-vs-Go primitive type drift, no Ansible surface, Python present for 12 resources, and MCP present for 6 (`vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-divergences.md:13-28`).

The generated report also marks contract groups outside Terraform's managed-resource scope (`admin-and-role-management`, `authentication`, `cloud-branch-connector-groups`, `public`, and `workload-groups`) and notes that `ztc_location_management` is registered only as a data source in the captured provider map, not a managed resource (`vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-divergences.md:30-42`).

One structural caveat remains on the reconstructed OpenAPI snapshot: the validation report flags 124 ZCloudConnector operations where the exporter used a schema-bearing `default` response as the success schema because no explicit `2xx` schema was present (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:16`, `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:24`, `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:29-152`). The method/path/field contract is still useful for reconciliation, but HTTP-status semantics for those operations should be treated as an extraction caveat until a vendor spec or live response confirms the intended success status. See [clarification `cloud-connector-25`](../_meta/clarifications.md#cloud-connector-25-zcloudconnector-default-response-success-schema-semantics).

---

## Forwarding rules (`/ztw/api/v1/ecRules/ecRdr`)

### `forwardMethod` enum — three layers, three different value sets

**What each source says:**

- **Go SDK:** the `ForwardMethod` doc comment lists ten values: `INVALID`, `DIRECT`, `PROXYCHAIN`, `ZIA`, `ZPA`, `ECZPA`, `ECSELF`, `DROP`, `ENATDEDIP`, `GEOIP`. (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:44`) The field itself is a plain `string` with no validation — the list is a comment only.
- **Terraform provider:** the `forward_method` schema enforces only five values via `validation.StringInSlice`: `DIRECT`, `LOCAL_SWITCH`, `ZIA`, `ECZPA`, `DROP`. (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_rule.go:167-173`) Note this set **invents** `LOCAL_SWITCH` (absent from the Go enum) and **omits** `ZPA`, `ECSELF`, `PROXYCHAIN`, `ENATDEDIP`, `GEOIP`, and `INVALID`. The provider serializes the string straight to the API `forwardMethod` field with no remapping (`:569` expand, `:388` read-back), so TF callers send `LOCAL_SWITCH` on the wire.
- **Console (help capture):** the forwarding-method drop-down exposes five operator-facing names — **ZIA, ZPA, Direct, Drop, Local**. (`vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md:18,38,154,234,343,450`) "Local" is described as Cloud-Connector/ZTG-only.

**Significance / which to trust:** There is no single authoritative enum. The Go doc-comment list and the TF validator are *different supersets of each other*, and both are over a free-string wire field. Concretely:

- Console **ZPA** → API `ECZPA` (the ZPA-via-Cloud-Connector method; the Go enum's plain `ZPA` is a distinct value). The TF docs use `ECZPA` for the ZPA example (`vendor/terraform-provider-ztc/docs/resources/ztc_traffic_forwarding_rule.md:206`).
- Console **Local** → TF `LOCAL_SWITCH` on the `ecRdr` traffic rule (`resource_ztc_traffic_forwarding_rule.go:169`), but → API `ECSELF` on the separate **log** rule (`vendor/terraform-provider-ztc/docs/resources/ztc_traffic_forwarding_log_rule.md:46`). One console label ("Local") therefore lands on two different API tokens depending on which rule surface you are on.

Do not assume `LOCAL_SWITCH` works through the Go SDK path or that `ZPA`/`ECSELF`/`ENATDEDIP`/`GEOIP` work through the TF path without a live test. (Cross-ref: `forwarding.md § Forwarding methods`, `terraform.md:184`, `sdk.md:365`.)

---

### `Type` (rule type) vs `forwardMethod` — two independent API fields the console fuses into one picker

**What each source says:**

- **Go SDK:** `Type` is a separate field from `ForwardMethod`, with its own enum: `FIREWALL`, `DNS`, `DNAT`, `SNAT`, `FORWARDING`, `INTRUSION_PREVENTION`, `EC_DNS`, `EC_RDR`, `EC_SELF`, `DNS_RESPONSE`. (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:34`)
- **Terraform provider:** the `type` enum matches the Go list exactly. (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_rule.go:150-161`)
- **Console:** presents a single "forwarding method" picker; `Type` is not surfaced as an independent operator control.

**Significance / which to trust:** `Type` and `forwardMethod` are orthogonal API fields. The console's single-picker UX hides `Type`, which can mislead an engineer into thinking the forwarding method *is* the rule type. They are set independently on the wire.

---

### `srcWorkloadGroups` vs `destWorkloadGroups` — Go has source only; Python has both

**What each source says:**

- **Go SDK:** the `ForwardingRules` struct carries `SrcWorkloadGroups` (`json:"srcWorkloadGroups"`) and **no** `DestWorkloadGroups` counterpart. (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:152`)
- **Python SDK:** the model holds both `src_workload_groups` and `dest_workload_groups`, and serializes **both** `srcWorkloadGroups` and `destWorkloadGroups` in `request_format`. (`vendor/zscaler-sdk-python/zscaler/ztw/models/forwarding_rules.py:129-135,266-267`) The accessor docstring adds `dest_workload_groups_ids` and notes it is "Valid for LOCAL_SWITCH forward method." (`vendor/zscaler-sdk-python/zscaler/ztw/forwarding_rules.py:144,278`) This attribute was added in Python SDK PR #450. (`vendor/zscaler-sdk-python/CHANGELOG.md` — PR #450 "Added new attribute `dest_workload_groups_ids` to ZTW `forwarding_rules`")
- **Terraform provider:** exposes `src_workload_groups` only; no `dest_workload_groups` field. (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_rule.go:247,588`)
- **Console (help capture):** exposes **both** Source Workload Groups and Destination Workload Groups; Destination Workload Groups are "only applicable to the Local traffic forwarding method." (`vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md:422,530`)

**Significance / which to trust:** Destination Workload Groups are a real API/console field (Python proves it serializes as `destWorkloadGroups`), but the **Go SDK and TF provider cannot set them** — they would silently drop the criterion. Engineers needing destination-workload-group matching on a Local rule must use the Python SDK or the raw API, not the Go SDK or Terraform. The Python "valid for LOCAL_SWITCH" note also corroborates the `LOCAL_SWITCH` token as the wire value behind the console "Local" method on `ecRdr` rules. (Cross-ref: `forwarding.md:78-80`, `sdk.md:369`.)

---

### `SourceIpGroupExclusion` — Go SDK comment says "not applicable"; Terraform exposes it as configurable

**What each source says:**

- **Go SDK:** `SourceIpGroupExclusion bool` is annotated `// Not applicable to Cloud & Branch Connector.` (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:85-86`)
- **Terraform provider:** exposes `source_ip_group_exclusion` as a configurable `TypeBool` with description "Source IP groups that must be excluded from the rule application." (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_rule.go:200-204`)
- **Python SDK:** the model carries `source_ip_group_exclusion` and serializes `sourceIpGroupExclusion`. (`vendor/zscaler-sdk-python/zscaler/ztw/models/forwarding_rules.py:188,238`)

**Significance / which to trust:** The SDK comment and the TF surface conflict. The field exists on the wire in all three sources; the disagreement is only about *applicability* to Cloud & Branch Connector. Whether the backend honors it for CC traffic rules (vs ignoring a set value) is not resolvable from source — see Open questions.

---

### IPv6 destination groups — Go SDK has `destIpv6Groups`; Python serializes it; TF does not expose it

**What each source says:**

- **Go SDK:** carries both `SrcIpv6Groups` (`:124`) and `DestIpv6Groups` (`:132`). (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:124,132`)
- **Python SDK:** serializes both `srcIpv6Groups` and `destIpv6Groups`. (`vendor/zscaler-sdk-python/zscaler/ztw/models/forwarding_rules.py:256,258`)
- **Terraform provider:** the `ecRdr` resource exposes `src_ip_groups` / `dest_ip_groups` but not the IPv6 group variants. (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_rule.go:238-239`)

**Significance / which to trust:** IPv6 source/destination group matching is settable via both SDKs but not via Terraform. IPv6-aware rules must be authored through the SDK or raw API.

---

## DNS gateways (`/ztw/api/v1/dnsGateways`)

### Two Go packages, one endpoint — `dns_gateway` vs `forwarding_gateways/dns_forwarding_gateway`

**What each source says:**

- **Go SDK `dns_gateway`:** struct has no `type` field; uses `DNSGatewayType`, `ECDnsGatewayOptionsPrimary/Secondary`, `failureBehavior`, `primaryIp`/`secondaryIp`. `Create` returns `(*DNSGateway, error)` and `Get` returns `(*DNSGateway, error)` — no `*http.Response`. (`vendor/zscaler-sdk-go/zscaler/ztw/services/dns_gateway/dns_gateway.go:14-30,32,56`)
- **Go SDK `forwarding_gateways/dns_forwarding_gateway`:** struct **adds** a `Type string json:"type,omitempty"` field ("Supported types are ZIA and ECSELF (Log and Control gateway)"), keeps `DNSGatewayType` as well, and its `Get` returns `(*DNSGateway, *http.Response, error)` — different signature. (`vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/dns_forwarding_gateway/dns_forwarding_gateway.go:15-52,54`)
- **Terraform provider:** registers **both** `ztc_dns_gateway` and `ztc_dns_forwarding_gateway` as resources *and* data sources, against the same endpoint. (`vendor/terraform-provider-ztc/ztc/provider.go:116,124,137,147`)

**Significance / which to trust:** Two Go packages and two TF resources model the same `/ztw/api/v1/dnsGateways` endpoint with different struct shapes (the `type` field is present in one, absent in the other) and different method signatures. There is no single canonical Go type for a DNS gateway. Pick the package whose fields you need: `dns_forwarding_gateway` if you need the `type` discriminator and an HTTP-response handle; `dns_gateway` for the simpler read/CRUD shape. Whether `type` is required by the backend, or only meaningful for the Log-and-Control ("ECSELF") gateway variant, is unresolved — see Open questions.

---

## DNS policy rules (`/ztw/api/v1/ecRules/ecDns`)

### `action` enum — Terraform/SDK has four values; help text names a fifth ("Overwrite DNS response")

**What each source says:**

- **Terraform provider:** the DNS rule `action` enum is exactly four values: `ALLOW`, `BLOCK`, `REDIR_ZPA`, `REDIR_REQ`. (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_dns_rule.go:105-110`)
- **Go SDK:** the `ECDNSRules` struct exposes `Action` as a free string and binds `DNSGateway` (for `REDIR_REQ`) and `ZPAIPGroup` (for `REDIR_ZPA`) reference objects. (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_dns_rules/traffic_dns_rules.go:34,75,78`)
- **Help / Admin Console capture:** DNS Policy capability text describes an "Overwrite DNS response" action, implying a fifth action.

**Significance / which to trust:** There is **no** `OVERWRITE` (or equivalent) value anywhere in the ZTW SDK or ZTC Terraform provider — only `ALLOW`/`BLOCK`/`REDIR_REQ`/`REDIR_ZPA`. The help-text "Overwrite DNS response" is not a `traffic_dns_rules` action in the captured source surface. Either it is a separate feature with its own object/endpoint, a different rule type, or marketing wording for the `REDIR_*` redirect behaviors. Trust the SDK/TF enum for what the DNS-rule API accepts. (Cross-ref: `dns-subsystem.md § Actions` and its Open questions, where this is treated at length.)

---

## DNS-rule field surface — modeled in the SDK, only partly in Terraform

**What each source says:**

- **Go SDK:** the `ECDNSRules` struct models rule-level fields `Action` (`:34`), `DNSGateway` (`:75`), `ZPAIPGroup` (`:78`), plus `SrcIps`, `DestAddresses`, `Locations`, `LocationsGroups`, `ECGroups`, `SrcIpGroups`, `DestIpGroups`. (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_dns_rules/traffic_dns_rules.go:20-85`)
- **Terraform provider:** the `ztc_traffic_forwarding_dns_rule` resource exposes the `action` and criteria fields and binds `zpa_ip_group` for `REDIR_ZPA`. (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_dns_rule.go:101-130`)

**Significance / which to trust:** The `zpaIpGroup` (Go `ZPAIPGroup`) reference is a DNS-rule-specific binding for `REDIR_ZPA` that has no analog on the `ecRdr` traffic rule (which binds `zpaApplicationSegments` instead). When wiring DNS-based ZPA handoff, use `zpaIpGroup`, not the traffic-rule's segment fields. (Cross-ref: `dns-subsystem.md` now documents the DNS rule field surface.)

---

## Location management — `profile` tag value set differs from ZIA

**What each source says:**

- **Terraform provider (ZTC):** the location `profile` enum accepts `NONE`, `CORPORATE`, `SERVER`, `GUESTWIFI`, `IOT`. (`vendor/terraform-provider-ztc/ztc/resource_ztc_location_management.go:277-281`)
- **Terraform provider (ZIA):** the ZIA location `profile` enum additionally accepts `WORKLOAD` and `EXTRANET`. (`vendor/terraform-provider-zia/zia/resource_zia_location_management.go` — noted in `api.md:72`)

**Significance / which to trust:** A Cloud Connector deployment location **cannot** be tagged `WORKLOAD` or `EXTRANET` — those two profile types are ZIA-only. Same field name, same "defaults to `Unassigned`" semantics, narrower value set on the ZTW side. (Cross-ref: `api.md:72`, which formalizes this with both validators.)

---

## SDK method families and auth

### `provisioning_url` uses ZIA-style bare client methods; the rest of ZTW uses `*Resource` methods

**What each source says:**

- **Go SDK (`provisioning_url`):** `Create` calls `service.Client.Create`, `Update` calls `service.Client.UpdateWithPut`, `Delete` calls `service.Client.Delete` — the bare (non-`Resource`) client method family, and `Create`/`Update` return a `*http.Response` triple. (`vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/provisioning_url/provisioning_url.go:143-144,158-159,169-170`)
- **Go SDK (`forwarding_rules`, typical ZTW service):** uses the `*Resource`-suffixed family — `CreateResource`, `UpdateWithPutResource`, `DeleteResource`, `ReadResource`. (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:227,252,267,277`)

**Significance / which to trust:** The two method families are not interchangeable in their return shapes (bare `Create` returns `(result, *http.Response, error)`-style triples in some packages; `CreateResource` returns `(interface{}, error)`). When writing generic wrappers over ZTW services, do not assume a uniform signature — `provisioning_url` (and a few other provisioning/gateway packages) follow the older bare pattern. (Cross-ref: `sdk.md` SDK-method-family notes.)

### `workload_groups.Get` uses `Read`, not `ReadResource`

**What each source says:**

- **Go SDK:** `workload_groups.Get` calls `service.Client.Read` (not `ReadResource`). (`vendor/zscaler-sdk-go/zscaler/ztw/services/workload_groups/workload_groups.go:74`)
- Most other ZTW read paths use `ReadResource` (e.g. `forwarding_rules.Get` at `forwarding_rules.go:227`).

**Significance / which to trust:** Minor but real method-family inconsistency. It does not change the wire call, but it matters for anyone reasoning about the SDK's internal response-decoding path uniformly. Also note: `workload_groups` Create/Update/Delete are **commented out** in the Go source (`workload_groups.go:97-132`) — the Go SDK is **read-only** for workload groups; the Python SDK is also read-only (`workload_groups.py` exposes only `list_groups`) — mutation must go through the raw API or be authored ZIA-side. (Cross-ref: `sdk.md § Workload Groups`, `terraform.md:529`.)

### Auth: legacy `ZTC_*` credentials vs OneAPI/ZIdentity

**What each source says:**

- **Go SDK legacy config:** `ztw/v2_config.go` exposes only username/password/API-key/cloud setters, keyed on the `ZTC_USERNAME`/`ZTC_PASSWORD`/`ZTC_API_KEY`/`ZTC_CLOUD` env vars, and builds a base URL of `https://connector.{cloud}.net/api/v1`. (`vendor/zscaler-sdk-go/zscaler/ztw/v2_config.go:39-43,113-116,172-178`)
- **Go SDK OneAPI:** the unified client routes ZTW to a dedicated OAuth2 HTTP client (`getServiceHTTPClient` → `ZTWHTTPClient` for the `ztw` service) and classifies any `ztw`-prefixed path as the ZTW service. (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:370-373,385-391`)
- **Python SDK:** the unified `Client` imports `ZTWService` and returns it over the shared OneAPI request executor unless `use_legacy_client` + a `LegacyZTWClientHelper` are both supplied. (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:30-31,112-118,303-310`)
- **Go SDK FedRAMP routing:** the shared OneAPI client maps `gov` and `govus` to dedicated government ZIdentity domains and API gateways; these mappings are service-generic and therefore also feed the ZTW HTTP client (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:404-438`).
- **ZTC provider:** `zscaler_cloud` is an unrestricted string and is passed to the shared Go client for both secret and private-key auth (`vendor/terraform-provider-ztc/ztc/provider.go:44-49`; `vendor/terraform-provider-ztc/ztc/config.go:350-372`). Its generated docs nevertheless claim FedRAMP support requires provider `>=v4.7.25`, even though the current ZTC release is v0.2.0 (`vendor/terraform-provider-ztc/docs/index.md:143-152`; `vendor/terraform-provider-ztc/CHANGELOG.md:3-12`).
- **Terraform Skills v0.3.1:** says no released ZTC version supports OneAPI FedRAMP and directs government tenants to the legacy path (`vendor/zscaler-terraform-skills/skills/ztc-skill/references/auth-and-providers.md:5-16`).

**Significance / which to trust:** ZTW (Cloud Connector) is a **first-class OneAPI service** in both SDKs — not OneAPI-absent. The legacy `ZTC_*` path is the alternative, retained for backwards compatibility, not the only surface. But FedRAMP is not resolved: route-building code proves what URL the client will call, not whether a released/live ZTW service accepts that client and scope. The provider-doc version floor is internally impossible and the official skill contradicts it. For a production government tenant, retain legacy auth unless a current ZTC release note, vendor confirmation, or tenant test establishes OneAPI acceptance. Track that evidence gap in [clarification `cloud-connector-19`](../_meta/clarifications.md#cloud-connector-19-ztw-sdk-method-convention-anomalies-and-oneapi-fedramp-behavior). (Cross-ref: `sdk.md` § Authentication.)

---

## Rate limiting — two-bucket SDK model vs ZIA-style three-tier framing

**What each source says:**

- **Go SDK (legacy + OneAPI):** the ZTW rate limiter is a **two-bucket** model — GET in one bucket (20 per 10s), POST/PUT/DELETE grouped together in the other (10 per 10s). The legacy client wires `rl.NewRateLimiter(20, 10, 10, 10)` with the comment "GET: 20 per 10s (2/sec), POST/PUT/DELETE: 10 per 10s (1/sec)" (`vendor/zscaler-sdk-go/zscaler/ztw/v2_config.go:397-399`), and the OneAPI client wires the same buckets plus hourly caps (950/950/380) with the comment "ZTW uses same limits as ZIA" (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:207-212`). The SDK test confirms the two buckets: 21st GET waits, 11th POST waits, DELETE shares the POST/PUT bucket. (`vendor/zscaler-sdk-go/zscaler/ztw/v2_client_ratelimit_test.go:111-140`)
- **Help-derived framing:** describing ZTW limits as the ZIA "three-tier Heavy/Medium/Light weight model."

**Significance / which to trust:** Trust the SDK's two-bucket model. DELETE is bucketed **with** POST/PUT, not in a separate "Heavy" tier as it is for ZIA's documented weight model. The Go comments say "same as ZIA," but the *enforced* shape in the SDK is two buckets (read vs write), not three weighted tiers. (Cross-ref: `api.md:173-180`, which documents the two-bucket model with the 429 body shape.)

---

## Go v3.8.43 retry and error-path divergence

The Go ZTW retry callback applies the shared SDK 5xx heuristic after its
separate 401/409/412 transient-marker checks
(`vendor/zscaler-sdk-go/zscaler/ztw/v2_client.go:492-525`). Under that helper,
501 is not retryable, 502/503/504 are always retryable, and another 5xx stops
only when no exact transient marker appears and the body contains a top-level
nonempty string JSON `code`; empty, malformed, HTML, code-less, numeric-code,
empty-code, nested-code, and array payloads remain retryable
(`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:279-364`). This is a Go SDK
heuristic, not a Cloud Connector backend error taxonomy.

On ordinary retry exhaustion with a response and no transport error, the ZTW
HTTP handler returns the last response so the request layer can construct an
`ErrorResponse` (`vendor/zscaler-sdk-go/zscaler/ztw/v2_client.go:363-385`). That
error type retains HTTP status and parsed code/message/ID/reason/exception plus
the raw body text, while `CheckErrorInResponse` consumes and closes the body
(`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:13-28,57-110`).

There is one critical ZTW exception. The legacy request loop closes every
non-success response body before its status branch; after a 401 survives all
five attempts, the final guard calls `CheckErrorInResponse` only after that
close (`vendor/zscaler-sdk-go/zscaler/ztw/v2_client.go:709-730`). The resulting
error still carries the HTTP response/status and the wrapper error, but the
API's original code and message cannot be parsed from the already-closed body.
Do not describe persistent ZTW 401s as preserving the structured API payload.

---

## Service-coverage asymmetry across SDKs/provider

**What each source says:**

- **`ip_pool_groups`:** the Terraform resource `ztc_ip_pool_groups` (+ data source) is **backed by the Go SDK** — `resource_ztc_ip_pool_groups.go:13` imports `ztw/services/policyresources/ipgroups` and calls its full CRUD (`ipgroups.Create`/`Get`/`Update`/`Delete`, `ipgroups.go`). So the functionality IS in the Go SDK; there is simply no package *named* `ip_pool_groups` — it maps onto the differently-named `policyresources/ipgroups`. The Python `ztw` package has no accessor *named* `ip_pool_groups`, but `ip_groups.py` hits the same `/ztw/api/v1/ipGroups` endpoint — though **only partially**: it exposes `list_ip_groups`, `list_ip_groups_lite`, `add_ip_group`, and `delete_ip_group`, with **no get-by-id and no update method** (`vendor/zscaler-sdk-python/zscaler/ztw/ip_groups.py`), unlike the Go `policyresources/ipgroups` package's full CRUD. So Python covers list/create/delete only, not the full lifecycle.
- **`subcloud_primary`/`subcloud_secondary`:** the Go SDK comment marks both "Not applicable to Cloud & Branch Connector" (`vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/zia_forwarding_gateway/zia_forwarding_gateway.go:38-42`), yet the TF forwarding-gateway resource actively wires them for DC-type proxies with functional set/expand. (`vendor/terraform-provider-ztc/ztc/resource_ztc_forwarding_gateway.go:127-128,187-190,250-251`)

**Significance / which to trust:** Coverage is not symmetric. A Go SDK caller reaches `ip_pool_groups` functionality through the `policyresources/ipgroups` package (the TF resource is a thin wrapper over it) with **full CRUD**; Terraform likewise covers full CRUD. The Python SDK (`client.ztw.ip_groups`) hits the same `/ipGroups` endpoint but covers **list/create/delete only** — no get-by-id or update. So Go and Terraform manage the full IP-pool-group lifecycle; Python is read+create+delete. For `subcloud_primary`/`secondary`, the TF provider treats them as functional for DC proxies while the SDK comment calls them inapplicable to CC — whether the *backend* honors subclouds for Cloud & Branch Connector DC proxies (vs the TF schema merely exposing them) is not verifiable from source. (Cross-ref: `terraform.md:107-114,574`.)

---

## VM Size — console-only field with no SDK representation

**What each source says:**

- **Console (help / deployment UI):** Cloud Connector group creation exposes a **VM Size** field (AWS: Small / Medium / Large; Azure: Small; GCP: Small). (`api.md:120`, derived from the provisioning-template help capture)
- **SDK / provisioning surface:** there is no `vmSize` field in the ZTW provisioning structs; the instance shape is governed by the cloud-side template (instance type) and any `formFactor`-style string on the EC group, not by a VM-Size enum in the API.

**Significance / which to trust:** "VM Size" is an Admin-Console / Marketplace-deployment label, not an API enum. Do not look for a `vmSize` field in the SDK — the VM shape is set in the cloud provisioning template, and the API surfaces the resulting form factor as an opaque string. (Cross-ref: `api.md:120`, `overview.md` VM architecture.)

---

## Open questions

The following are unresolved after cross-referencing the available sources. Each requires live-tenant verification.

1. **`forwardMethod` true backend enum.** The Go doc-comment (10 values) and the TF validator (5 values incl. `LOCAL_SWITCH`) disagree, and the wire field is a free string. The full set of values the `ecRdr` endpoint actually accepts — and whether `LOCAL_SWITCH`, `ENATDEDIP`, `GEOIP`, `PROXYCHAIN`, and bare `ZPA` are all live — is unknown without a tenant. See [clarification `cloud-connector-09`](../_meta/clarifications.md#cloud-connector-09-forwarding-method-semantics-and-the-true-backend-forwardmethod-enum) (and [`cloud-connector-17`](../_meta/clarifications.md#cloud-connector-17-local-local_switch-forwarding-method-real-behavior-or-doc-artifact) for the `LOCAL_SWITCH`/"Local" sub-question).

2. **`SourceIpGroupExclusion` applicability to CC.** The Go SDK comment says "Not applicable to Cloud & Branch Connector"; the TF provider exposes it as configurable. Whether the backend honors a set value on a CC `ecRdr` rule or silently ignores it is unresolved. See [clarification `cloud-connector-05`](../_meta/clarifications.md#cloud-connector-05-source_ip_group_exclusion-applicability-to-cloud-branch-connector).

3. **DNS gateway `type` field semantics.** The `dns_forwarding_gateway` package adds `type` (ZIA / ECSELF) while the `dns_gateway` package omits it, both against `/ztw/api/v1/dnsGateways`. Whether `type` is required by the backend, optional, or meaningful only for the Log-and-Control ("ECSELF") variant is unknown. See [clarification `cloud-connector-14`](../_meta/clarifications.md#cloud-connector-14-duplicate-dns-gateway-packages-and-the-type-field-semantics).

4. **"Overwrite DNS response" — does a response-rewrite action exist at all?** Named in help capability text but absent from the DNS-rule `action` enum (`ALLOW`/`BLOCK`/`REDIR_REQ`/`REDIR_ZPA`) and from every `*ztw*` SDK/TF source. Open: separate feature with its own object/endpoint, a different rule type, or just marketing wording for `REDIR_*`. See [clarification `cloud-connector-11`](../_meta/clarifications.md#cloud-connector-11-overwrite-dns-response-does-a-response-rewrite-action-exist-at-all).

5. **`subcloud_primary`/`secondary` backend behavior for CC DC proxies.** The TF resource wires them; the SDK comment calls them inapplicable to CC. Whether the backend actually applies subclouds for Cloud & Branch Connector DC proxies (vs the TF schema merely exposing fields) needs a live test. See [clarification `cloud-connector-15`](../_meta/clarifications.md#cloud-connector-15-subcloud_primarysecondary-backend-behavior-for-cc-dc-proxies).

6. **`dest_workload_groups_ids` "Valid for LOCAL_SWITCH" claim.** The Python docstring ties destination workload groups to the `LOCAL_SWITCH` forward method; the help text ties them to the console "Local" method. Confirming that the backend accepts `destWorkloadGroups` only on `LOCAL_SWITCH`/Local rules (and rejects or ignores them elsewhere) requires a tenant. See [clarification `cloud-connector-23`](../_meta/clarifications.md#cloud-connector-23-dest_workload_groups_ids-binding-to-local_switch-local).

7. **Postman / oneapi-specs not cross-checked in this pass.** The ZPA divergences doc uses the Postman collection as a third independent source; this ZTW pass relied on Go SDK + Python SDK + Terraform provider + help captures. A Postman cross-check would raise confidence on the `forwardMethod` enum, the DNS gateway `type` field, and the rate-limit caps in particular.
