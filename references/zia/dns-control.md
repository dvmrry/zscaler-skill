---
product: zia
topic: "dns-control"
title: "ZIA DNS Control policy — predefined rules, DoH, tunnel detection"
content-type: reasoning
last-verified: "2026-07-16"
verified-against:
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/about-dns-control.md"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go"
  - "vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_dns.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_dns_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/utils.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py"
author-status: draft
---

# ZIA DNS Control policy

Source: `vendor/zscaler-help/about-dns-control.md`.

DNS Control is a **separate policy module** inside ZIA's Firewall Control umbrella, distinct from URL Filtering, Cloud App Control, and Firewall Filtering. It evaluates **DNS queries and responses** — not HTTP(S) flows. A URL Filtering block for `badsite.com` does nothing to the DNS lookup itself; a DNS Control block prevents resolution from completing at all.

Navigation path: `Policies > Access Control > Firewall > DNS Control`.

## What DNS Control is not

Source: `vendor/zscaler-help/about-dns-control.md`.

**Cloud Connector DNS Gateways** (CBC product, `Administration > Gateways`) are a different thing entirely — they redirect DNS requests received by a Cloud or Branch Connector to operator-specified DNS servers. They live in a separate product (Cloud & Branch Connector), have no rule engine, and carry no ZIA policy context. Don't conflate the two when an operator describes "DNS gateway."

## When DNS Control fires

Source: `vendor/zscaler-help/about-dns-control.md`.

```
DNS query arrives at ZIA Public Service Edge
      ↓
DNS Control rules evaluate (ascending rule order, first-match)
      ↓
Action: Allow / Block / Redirect Request / Redirect Response
      ↓ (if allowed)
ZIA resolves the query → response returned to client
```

DNS Control applies to **recursive and iterative** DNS requests and covers UDP, TCP, and DNS over HTTPS (DoH) — with the DoH caveat below.

## Prerequisite — firewall-configured locations

Source: `vendor/zscaler-help/about-dns-control.md`.

DNS Control requires **firewall to be configured for the location**. From the source doc:

> To enable DNS Control, you need to configure the firewall for locations. In addition, ensure a Firewall Filtering rule is configured to allow DNS traffic (Network Services condition matches DNS), per the Recommended Firewall Control policy.

The reason is architectural: DNS Control sits inside the Firewall Control pipeline. Traffic from locations that haven't been onboarded to firewall forwarding never reaches the DNS Control engine. A tenant reporting "DNS Control rules aren't firing" for users at a specific site should check location configuration before chasing rule logic. See [`./firewall.md`](./firewall.md) for the firewall pipeline and [`./locations.md`](./locations.md) for location setup.

## The three predefined rules

Source: `vendor/zscaler-help/about-dns-control.md`; `vendor/zscaler-help/understanding-source-ip-anchoring.md`; `vendor/zscaler-help/configuring-forwarding-policies-source-ip-anchoring-using-zpa.md`.

Zscaler ships three predefined DNS Control rules that are present in every tenant. They can be disabled or modified, but Zscaler recommends keeping them **at high rule order (Rule 1 and Rule 2)**.

### UCaaS One Click

Allows DNS traffic from the firewall when a UCaaS application is enabled in Advanced Settings. This rule exists so that enabling a UCaaS application (Teams, Zoom, Webex, etc.) via the one-click toggle automatically gets DNS resolution working without requiring the operator to author a custom DNS rule. It's a convenience rule — operators who manage UCaaS DNS resolution manually can disable it.

### ZPA Resolver for Locations

For users on **corporate locations** (forwarding through firewall-enabled ZIA locations), this rule resolves ZPA application domains to **ZPA Synthetic IPs / SIPA-routable IPs** rather than the real public IP. Without it, DNS returns the public IP of the SIPA destination, traffic egresses from the ZIA PSE (skipping the ZPA App Connector entirely), and the destination sees the PSE's IP — not the customer-controlled App Connector IP. SIPA breaks silently.

See [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md) for the full SIPA flow and configuration chain.

### ZPA Resolver for Road Warrior

Same function as the Locations rule, but scoped to **remote users** (road warriors — users not at a corporate location, typically using Zscaler Client Connector in Z-Tunnel mode). Road warriors don't forward through a location's IP; they forward directly via ZCC.

**Rule order is critical.** The Road Warrior rule **must be higher in order than the Locations rule**. From `shared/source-ip-anchoring.md`:

> `ZPA Resolver for Road Warrior` must be higher in rule order than `ZPA Resolver for Locations`. If reversed, road-warrior traffic falls into the Locations pool and egresses through the wrong IP range.

Zscaler explicitly warns against disabling the Road Warrior rule. If disabled, road-warrior SIPA traffic routes via the Locations IP pools, defeating SIPA silently.

**If Extranet Application Support is enabled** (requires contacting the Zscaler account team), a fourth predefined rule appears: `ZPA Resolver for Extranet Locations`, which handles extranet location users' source-IP-anchored traffic. A default IP pool is created for extranet traffic; custom pools can be added.

## Default rules

Source: `vendor/zscaler-help/about-dns-control.md`.

Below all custom and predefined rules sit **default rules that allow all DNS traffic**. These maintain the lowest precedence, cannot be deleted, but their actions can be modified. They function as the catch-all — traffic that matches no custom rule is allowed through.

## Custom rule structure

Source: `vendor/zscaler-help/about-dns-control.md`.

Custom DNS Control rules support:

**Criteria** — DNS-specific dimensions plus standard identity/location scoping:
- Users, groups, departments (Advanced Firewall)
- Locations and location groups
- Domain or FQDN (the DNS query name)
- DNS record types (A, AAAA, MX, TXT, etc.)
- IP-based categorization of resolved addresses
- Destination IP location (geo-resolved IP)

**Actions:**
- `Allow` — resolve and return response
- `Block` — return NXDOMAIN or drop query
- `Redirect Request` — forward the query to a specific DNS server (useful for split-DNS or sinkhole patterns)
- `Redirect Response` — overwrite the DNS response (rewrite the resolved IP — useful for steering clients to internal servers)

Rule evaluation is ascending rule order, first-match-wins, same model as Firewall Filtering and URL Filtering.

## DoH (DNS over HTTPS)

Source: `vendor/zscaler-help/about-dns-control.md`.

ZIA evaluates DoH traffic, but with a structural constraint. DoH queries are HTTP(S) requests — the DNS payload is encrypted inside HTTPS. For ZIA to inspect the DNS payload and apply DNS Control rules to it, **SSL Inspection must be enabled for the DoH provider's domain** (e.g., `cloudflare-dns.com`, `dns.google`). Without decryption, ZIA sees an HTTPS flow to a DoH endpoint; DNS Control doesn't engage on the inner DNS query.

What the operator can do:
- **SSL Inspection + DNS Control** — decrypt the DoH flow, apply DNS Control rules to the inner query.
- **Block DoH at URL Filtering / Firewall Filtering** — block access to known DoH provider domains/IPs, forcing clients to use standard DNS that DNS Control can inspect.

What the operator cannot do without decryption: match on the DNS query name, record type, or response inside a DoH flow.

The source doc states DNS Control covers "UDP, TCP, and DNS over HTTPS (DoH) — irrespective of the protocol and the encryption used" — this is the product capability statement, contingent on having SSL Inspection covering the DoH transport. It is not saying DoH queries are inspected without decryption.

## DNS tunnel detection

Source: `vendor/zscaler-help/about-dns-control.md`.

DNS tunneling embeds data in DNS query names or TXT/NULL record payloads to exfiltrate data or establish covert C2 channels. DNS Control includes detection for this pattern.

What triggers detection:
- Anomalously long subdomain labels or query strings
- High-entropy subdomain names (random-looking strings consistent with base64/hex encoding)
- Unusually high query rates for a single domain (tunneling tools generate many queries to pass data)
- DNS record types atypical for normal client usage (TXT, NULL, CNAME patterns used as data channels)

When a query matches tunnel-detection heuristics:
- The configured action (typically Block) fires
- The event is logged with a tunnel-detection indicator
- No separate "allow tunnel" action exists — detection and blocking are the same policy layer

Operators who need to allow DNS tunneling patterns for legitimate tooling (e.g., internal DNS-based service discovery that happens to use high-entropy names) should scope an Allow rule with explicit domain criteria above the tunnel-detection rule in order. The source doc points to "Detecting and Controlling DNS Tunnels" for full detection mechanics — that page was not captured in this pass.

## NROD categorization latency

Source: `vendor/zscaler-help/about-dns-control.md`.

DNS Control rules can reference **Newly Registered and Observed Domains (NROD)** as a criterion. Zscaler categorizes domains newly registered within the last 30 days, newly observed for the first time, or newly revived (dormant ~10 days then reactivated) as NROD until a proper classification is available.

From the source doc:

> A latency of about 2 to 36 hours is expected for domains to be classified as NROD depending on whether the domain is newly registered, observed, or newly revived. Moreover, the URL classification might not be available for the first-ever DNS request for such domains due to propagation delays.

**Why this matters:** a DNS Control rule that blocks NROD will not catch a brand-new malicious domain during the classification window. There's a gap of up to 36 hours between domain registration and NROD classification. Operators relying solely on NROD-block for C2 detection should layer it with behavioral detection (tunnel detection, query-rate anomalies) rather than treating NROD as real-time coverage.

The same NROD latency applies to URL Filtering — see [`./url-filtering.md § Edge cases`](./url-filtering.md) for the URL Filtering perspective.

## Surprises and gotchas

Source: `vendor/zscaler-help/about-dns-control.md`; `vendor/zscaler-help/ranges-limitations-zia.md`; `vendor/zscaler-help/understanding-source-ip-anchoring.md`.

1. **DNS Control ≠ URL Filtering.** Both feel domain-based. URL Filtering fires on the HTTP(S) request URL; DNS Control fires on the DNS query. A URL Filtering block does not prevent resolution. An operator who needs to block both resolution and access needs rules in both modules — or just a DNS Control block (which prevents access by making the domain unresolvable).

2. **The firewall-location prerequisite is a silent miss.** DNS Control rules can be authored correctly and still never fire if the relevant location isn't firewall-configured. The rule list looks fine; traffic just bypasses the engine.

3. **Road Warrior rule order is a silent SIPA failure mode.** If `ZPA Resolver for Locations` ends up above `ZPA Resolver for Road Warrior`, road-warrior SIPA traffic silently uses the wrong IP pool. The traffic flows (DNS resolves, forwarding works), but the destination sees an unexpected source IP — breaking Conditional Access or IP allowlist checks.

4. **DoH requires SSL Inspection to be useful.** Operators who enable DoH-blocking via DNS Control but haven't ensured SSL Inspection covers DoH endpoints get false confidence — DoH flows to uninspected providers are opaque.

Source: `vendor/zscaler-help/ranges-limitations-zia.md`.

5. **DNS Control rule limits by tier.** Essential: 64 rules. Advanced: 1,000 rules.

## API/SDK surface — the DNS rule resource

Source: `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py`; `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_dns.py`; `vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_dns_rules.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go`.

For read, create, and update operations, MCP v0.14.0 passes each SDK model's `as_dict()` record through `shape_many` or `shape_one` without a resource-specific output view (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py:86-170`). The shared shapers preserve every SDK-model attribute; this is a full SDK model record, not a raw HTTP response (`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py:43-56`; `vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py:50-113`).

This section documents how the DNS Control rule resource behaves over the API (action enum, per-action field dependencies, wire shapes). The four UI-level actions above (`Allow` / `Block` / `Redirect Request` / `Redirect Response`) are the doc-tier names; the API exposes a wider 10-value enum.

### Endpoint

DNS rules use a dedicated endpoint, **`/zia/api/v1/firewallDnsRules`** (distinct from the firewall filtering rules endpoint):

| Operation | Method + path |
|---|---|
| List | `GET /zia/api/v1/firewallDnsRules` |
| Get one | `GET /zia/api/v1/firewallDnsRules/{id}` |
| Create | `POST /zia/api/v1/firewallDnsRules` |
| Update (full replacement) | `PUT /zia/api/v1/firewallDnsRules/{id}` |
| Delete | `DELETE /zia/api/v1/firewallDnsRules/{id}` |

Citations: Python `cloud_firewall_dns.py:73-76` (list), `:130-133` (get), `:225-228` (add), `:328-332` (update), `:377-381` (delete) — `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_dns.py`; Go endpoint const `vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:15` and `UpdateWithPut` at `:194`.

Update is a **PUT full replacement**, not a patch (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:194`). MCP v0.14.0 does not fetch or backfill the existing rule: it builds a payload only from the supplied update fields and passes that payload directly to the SDK (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py:153-170`). Callers must not treat that tool as partial-update protection.

### The action enum (10 values)

The DNS rule `action` enum has exactly 10 values in the Go and Python SDK sources:

`ALLOW`, `BLOCK`, `REDIR_REQ`, `REDIR_RES`, `REDIR_ZPA`, `REDIR_REQ_DOH`, `REDIR_REQ_KEEP_SENDER`, `REDIR_REQ_TCP`, `REDIR_REQ_UDP`, `BLOCK_WITH_RESPONSE`.

Citations: Go action comment lists all 10 (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:35`); Python SDK (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_dns.py:175-176` and `:277-278`). MCP v0.14.0 only gives short examples such as `ALLOW`, `BLOCK`, and `REDIR_REQ`; it does not enumerate the ten-value set (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py:38`, `:51-54`).

The action travels on the wire under the JSON key **`action`**. MCP v0.14.0 exposes `action` directly and forwards it into the SDK payload; the former `rule_action` alias is gone (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py:51-54`, `:67-70`, `:126-140`, `:153-167`). Go marshals `Action string` as `json:"action,omitempty"` (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:36`); Python model at `vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_dns_rules.py:49,221`.

### Per-action field dependencies

These dependency rules are encoded in vendor source **only as a commented-out (inactive) Go validator** (`validateFirewallDNSRules`, wrapped in `/* */` at `vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:264-294`). No client enforces them at runtime — the live Go `Create`/`Update` (`:178-191`, `:193-201`) call no validator, and neither the Python SDK nor the MCP tool does conditional validation. Treat the contract below as inferable-from-source, not API-enforced.

| Action | Required field(s) per Go validator | Citation |
|---|---|---|
| `REDIR_RES` | `redirect_ip` (`redirectIp`) must be non-empty | `firewalldnscontrolpolicies.go:286-290` |
| `REDIR_ZPA` | `zpa_ip_group` (`zpaIpGroup`) with a valid ID | `firewalldnscontrolpolicies.go:281-285` |
| `REDIR_REQ_KEEP_SENDER` | `dns_gateway` (valid ID/Name) **and** non-empty `protocols` | `firewalldnscontrolpolicies.go:267-275` |
| `REDIR_REQ_DOH` / `REDIR_REQ_TCP` / `REDIR_REQ_UDP` | `dns_gateway` (valid ID/Name) | `firewalldnscontrolpolicies.go:276-280` |

Notes on the dependency contract:

- The `protocols` requirement is **unique to `REDIR_REQ_KEEP_SENDER`** among the redirect actions in the validator (`firewalldnscontrolpolicies.go:272-275`).
- The validator does **not** bind `dns_gateway` to plain `REDIR_REQ` — only to the four redirect-to-gateway variants above. Whether `REDIR_REQ` needs a `dns_gateway` is not stated in source.
- The validator binds `redirect_ip` **only to `REDIR_RES`**. MCP v0.14.0 lists `redirect_ip` only as a generic advanced DNS field and does not document any action binding (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py:31-35`). Whether the live API enforces the validator's `REDIR_RES`-only rule remains open.

### Action-bound fields — wire shapes and SDK divergences

| Field | Wire key | Go type | Python parse type |
|---|---|---|---|
| `redirect_ip` | `redirectIp` | `string` (`firewalldnscontrolpolicies.go:45`) | string (`cloud_firewall_dns_rules.py:106,247`) |
| `block_response_code` | `blockResponseCode` | `string` (`firewalldnscontrolpolicies.go:48`) | string (`cloud_firewall_dns_rules.py:127,259`) |
| `dns_gateway` | `dnsGateway` | `*common.IDName` (`firewalldnscontrolpolicies.go:104`) | `common.CommonBlocks` (`cloud_firewall_dns_rules.py:141-149,250`) |
| `zpa_ip_group` | `zpaIpGroup` | `*common.IDName` **no `omitempty`** (`firewalldnscontrolpolicies.go:107`) | `common.CommonIDName` (`cloud_firewall_dns_rules.py:131-139,252`) |
| `edns_ecs_object` | `ednsEcsObject` | `*common.IDName` (`firewalldnscontrolpolicies.go:109-110`) | `common.CommonBlocks` (`cloud_firewall_dns_rules.py:151-159`) |

Behavioral notes drawn from source:

- **`block_response_code` semantics.** The Go field comment phrases this as "block and send response code" (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:47-48`). MCP v0.14.0 does not document or name this field. The accepted response-code values (e.g. NXDOMAIN, REFUSED) are **not enumerated in the cited sources** — see Open questions.

- **`zpa_ip_group` serializes even when empty.** Its Go struct tag is `json:"zpaIpGroup"` with **no `omitempty`** (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:107`), unlike most fields on the struct — so it is written to the wire even when nil/empty. The Go field comment describes it as the ZPA IP pool used to resolve ZPA application domains to ephemeral IPs (`:106-107`).

- **`edns_ecs_object` is a general resolution field, not action-bound.** It is the EDNS ECS object used for DNS resolution (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:109-110`). The Go validator binds it to **no** action — including not to `REDIR_ZPA` (no `edns` clause in the validator at `firewalldnscontrolpolicies.go:264-294`). The Python model assigns it twice: first as `common.ResourceReference` (`cloud_firewall_dns_rules.py:115`), then overwritten with `common.CommonBlocks` (`:151-159`) — so the effective parse type is `CommonBlocks`. MCP v0.14.0 does not document this field.

- **Request-build vs response-parse wire-shape divergence (Python).** On the request side both SDKs model `dns_gateway` / `zpa_ip_group` / `edns_ecs_object` as ID-bearing objects (Go marshals them as `*common.IDName`, `firewalldnscontrolpolicies.go:104,107,110`). But Python's `reformat_params` remap table does **not** include these three keys (`vendor/zscaler-sdk-python/zscaler/utils.py:42-101`), and `add_rule`/`update_rule` only run kwargs through `transform_common_id_fields` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_dns.py:236,340`), which remaps only listed keys. A scalar id passed directly to the Python SDK is therefore sent as-is, not wrapped in `{id: ...}`. On the response side the Python model still parses the fields back as objects (`CommonBlocks` / `CommonIDName`, per the table above).

- **`BLOCK` vs `BLOCK_WITH_RESPONSE` doc imprecision.** The Python SDK docstrings describe `block_response_code` as the response code sent "when the rule action is BLOCK" (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_dns.py:190`, `:292`), while the response-returning enum value is `BLOCK_WITH_RESPONSE`. The Go comment is the neutral "block and send response code" (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:47`). MCP v0.14.0 no longer arbitrates this wording because it does not document the field.

### Other rule fields

- **`enabled` → `state`.** The Python SDK translates the `enabled` boolean to the API `state` field as `ENABLED`/`DISABLED` before sending; the wire field is `state` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_dns.py:233-234` add, `:337-338` update; model at `cloud_firewall_dns_rules.py:74,235`; Go `State json:"state,omitempty"` at `firewalldnscontrolpolicies.go:39`).

- **`protocols` enum (Go only).** Supported values are `ANY_RULE`, `SMRULEF_CASCADING_ALLOWED`, `TCP_RULE`, `UDP_RULE`, `DOHTTPS_RULE`, documented only in the Go struct comment (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:82`). The Python SDK docstring gives only "TCP, UDP, DOHTTPS" examples (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_dns.py:189,291`). MCP v0.14.0 merely names `protocols` as an advanced field and provides no values (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py:31-35`).

- **`applications`.** Holds DNS tunnels and network applications (canonical ZIA cloud-app names), sent under wire key **`applications`** (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:75-76`; Python model `cloud_firewall_dns_rules.py:108,248`). MCP v0.14.0 names `applications` directly in the advanced DNS fields (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py:31-35`).

- **`isWebEunEnabled` / `defaultDnsRuleNameUsed`.** Both flags are present in both SDK models (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:95,98`; Python model `cloud_firewall_dns_rules.py:57-58,262-263`). MCP v0.14.0 does not name either field in its advanced examples, although the passthrough allows other SDK-supported fields (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py:31-35`).

## Cross-links

- DNS as a sub-policy inside Firewall Control — [`./firewall.md § DNS Control`](./firewall.md)
- URL Filtering (parallel domain-based policy, different layer) — [`./url-filtering.md`](./url-filtering.md)
- ZPA Resolver predefined rules and full SIPA configuration chain — [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md)
- Z-Tunnel + DNS interaction (Z-Tunnel 1.0 PAC toggle required for firewall/DNS Control) — [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md)
- Forwarding Control (ZPA forwarding method — the other side of the SIPA DNS resolver setup) — [`./forwarding-control.md`](./forwarding-control.md)
- Location configuration prerequisite — [`./locations.md`](./locations.md)

## Open questions

These came up while scraping the SDK/API surface and could not be cleanly resolved from vendor source. Flagged unverified.

- **Valid values for `block_response_code`.** No cited source enumerates the accepted DNS response codes (e.g. NXDOMAIN, REFUSED, specific rcodes). The SDK sources describe it only as a DNS response-code string (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_dns.py:190`; `vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:47-48`), while MCP v0.14.0 does not document the field. The value set is unverified. (Tracked as `zia-47` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zia-47-dns-control-block_response_code-accepted-values).)

- **Does `redirect_ip` apply only to `REDIR_RES`?** The commented Go validator binds `redirect_ip` **only to `REDIR_RES`** (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:286-290`). MCP v0.14.0 lists the field generically and provides no binding (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py:31-35`). Live server enforcement is unverified. (Tracked as `zia-48` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zia-48-dns-control-redirect_ip-action-binding).)

- **Does plain `REDIR_REQ` require a `dns_gateway`?** The Go validator binds `dns_gateway` to `REDIR_REQ_KEEP_SENDER`, `REDIR_REQ_DOH`, `REDIR_REQ_TCP`, `REDIR_REQ_UDP` but **not** to `REDIR_REQ` (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:267-280`). Whether `REDIR_REQ` needs one is not stated in source. (Tracked as `zia-59` in [`../_meta/clarifications.md`](../_meta/clarifications.md#zia-59-plain-redir_req-dns_gateway-requirement-and-edns_ecs_objectzpa-pairing).)

- **Is `edns_ecs_object` tied to the ZPA action?** No cited source binds `edns_ecs_object` to `REDIR_ZPA` (or any action); the Go SDK presents it as a general resolution field (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:109-110`), and MCP v0.14.0 does not document it. The `zpa_ip_group` + `edns_ecs_object` pairing for `REDIR_ZPA` is not verifiable from vendor source. (Tracked as `zia-59` in [`../_meta/clarifications.md`](../_meta/clarifications.md#zia-59-plain-redir_req-dns_gateway-requirement-and-edns_ecs_objectzpa-pairing).)
