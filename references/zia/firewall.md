---
product: zia
topic: "firewall"
title: "ZIA Firewall Control — Filtering, NAT, DNS, IPS"
content-type: reasoning
last-verified: "2026-07-09"
verified-against:
  vendor/terraform-provider-zia: 717926eb564bb21dea1f8e0c3222e6593b29f849
  vendor/zscaler-sdk-python: 6ff5bc97d02e1e1b4c564e2f0a8986edc730e03f
  vendor/zscaler-sdk-go: fe52adcee3dc10bbad12ea8e9f8e17a4583c655a
  vendor/zscaler-mcp-server: a2162c384e1ffb68b3bf14783ea9a1a762c85ff5
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/about-ips-control.md"
  - "vendor/zscaler-help/configuring-firewall-policies.md"
  - "vendor/terraform-provider-zia/zia/resource_zia_firewall_filtering_rules.go"
  - "vendor/terraform-provider-zia/docs/resources/zia_ips_signature_rules.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/ips_signature_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_ips.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/zia_service.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/nat_control_policies/nat_control_policies.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/ips_control_policies/ips_policies/ips_policies.go"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_destination_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipdestinationgroups/ipdestinationgroups.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices_test.go"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/ip_destination_groups.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/network_services.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/ips_signature_rules.py"
  - "vendor/zscaler-help/ranges-limitations-zia.md"
author-status: draft
---

# ZIA Firewall Control — Filtering, NAT, DNS, IPS

ZIA's Firewall Control module handles L3/L4 flows and signature-based intrusion prevention — distinct from URL Filtering, CAC, SSL Inspection, and DLP, which operate on decoded web content. When a user reports "my traffic was blocked and it's not a URL Filter rule," Firewall Control is the other common answer (Malware Protection / ATP being the third — see [`./malware-and-atp.md`](./malware-and-atp.md)).

## Firewall is four policies in a trenchcoat

Source: `vendor/zscaler-help/configuring-firewall-policies.md`; `vendor/zscaler-help/about-ips-control.md`.

"Firewall Control" is the umbrella for four sub-policies, each with its own rule list:

| Sub-policy | What it governs | Layer |
|---|---|---|
| **Firewall Filtering** | TCP / UDP / ICMP flows. Source/dest IP, network service (port), user/group scoping. Allow or block at the flow level. | L3/L4 |
| **NAT Control** | Address remapping for internal networks / overlapping address spaces / specific server publishing. | L3 |
| **DNS Control** | DNS query policy — block or allow DNS resolution of specific domains. Separate from URL Filtering; applies even when URL Filtering wouldn't (non-HTTP DNS). | L7 (DNS) |
| **IPS Control** | Signature-based threat detection. Snort-style signatures + Zscaler-managed feeds. Allow, block, or bypass IPS inspection. | L7 (signature match) |

**FTP Control** is a fifth surface inside the Firewall section but documented separately.

Each sub-policy has its own rule list, evaluated separately. A single flow traverses all four — a block from any of them drops the flow.

## Basic vs Advanced Firewall

Source: `vendor/zscaler-help/configuring-firewall-policies.md`; `vendor/zscaler-help/about-ips-control.md`.

Two licensing tiers. The difference is **criterion expressiveness**, not fundamental feature presence.

| Feature | Basic Firewall | Advanced Firewall |
|---|---|---|
| Network Services (port-based) criteria | ✓ | ✓ |
| Source/Destination IP criteria | ✓ | ✓ |
| Location / Location Group criteria | ✓ | ✓ |
| **User, Group, Department criteria** | ✗ | ✓ |
| **Network Application criteria** | ✗ | ✓ |
| **IPS Control** | ✗ | ✓ |

A tenant on Basic can still run a firewall, just scoped to IP/port/location — no identity-aware rules and no signature-based IPS. Almost all serious deployments need Advanced.

## Where Firewall sits in the traffic path

Source: `vendor/zscaler-help/configuring-firewall-policies.md`; `vendor/zscaler-help/about-ips-control.md`.

Firewall runs **before** web-module policies (URL Filtering, CAC, SSL Inspection, DLP). The split is documented in *Understanding Policy Enforcement* and threaded in [`./url-filtering.md`](./url-filtering.md):

```
traffic hits PSE
      ↓
Firewall Control (Filtering → NAT → DNS → IPS → FTP)
      ↓ (if allowed)
SSL Inspection (decrypt / bypass decision)
      ↓
URL Filtering / CAC / DLP / Sandbox / File Type / Malware / ATP
```

**Implication for "why was this blocked" debugging:**
- Firewall block → only firewall log shows the event with `action=Blocked`. Web log shows nothing because the flow never reached the web module.
- Web-module block → firewall log shows `action=Allow` (flow passed firewall), web log shows the block.

The `firewall-vs-web-module-block` SPL pattern in [`../shared/splunk-queries.md`](../shared/splunk-queries.md) encodes this asymmetry.

## Ports Zscaler inspects by default

Source: `vendor/zscaler-help/configuring-firewall-policies.md`; `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py`.

| Port | Traffic |
|---|---|
| 80 | HTTP |
| 443 | HTTPS |
| 53 | DNS |
| 21 | FTP |
| 554 | RTSP |
| 1723 | PPTP |

Tenants using non-default ports for these protocols must configure custom network services — otherwise traffic on, say, HTTP port 8080 is treated as a generic TCP flow, not HTTP, and the web-module layer never engages.

## Firewall Filtering rule criteria

Source: `vendor/terraform-provider-zia/zia/resource_zia_firewall_filtering_rules.go`; `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py`; `vendor/zscaler-help/ranges-limitations-zia.md`.

Per-rule counts for the identity/scope criteria come from the product limits table, which applies "to users, groups, departments, locations, etc. criteria on any rule" (`vendor/zscaler-help/ranges-limitations-zia.md:193`). The Terraform provider schema does **not** enforce these counts — `users`, `groups`, `departments`, `locations`, and `location_groups` are all declared with no `MaxItems` (`nil`) (`vendor/terraform-provider-zia/zia/resource_zia_firewall_filtering_rules.go:158-162`); only `time_windows` (`intPtr(2)`, `:163`) and `nw_services` (`intPtr(1024)`, `:174`) carry a provider-side cap.

| Criterion | Per-rule limit | Source |
|---|---|---|
| Users | 32 | `ranges-limitations-zia.md:197` (provider: no cap, `resource_zia_firewall_filtering_rules.go:160`) |
| Groups | 32 | `ranges-limitations-zia.md:198` (provider: no cap, `resource_zia_firewall_filtering_rules.go:161`) |
| Departments | 32 | `ranges-limitations-zia.md:199` (provider: no cap, `resource_zia_firewall_filtering_rules.go:162`) |
| Locations | 32 | `ranges-limitations-zia.md:200` (provider: no cap, `resource_zia_firewall_filtering_rules.go:158`) |
| Location Groups | 32 | `ranges-limitations-zia.md:201` (provider: no cap, `resource_zia_firewall_filtering_rules.go:159`) |
| Times (Time Windows) | 8 | `ranges-limitations-zia.md:203` (provider caps the resource block at 2, `resource_zia_firewall_filtering_rules.go:163`) |
| Devices | 64 | `ranges-limitations-zia.md:204` |
| Device Groups | 8 | `ranges-limitations-zia.md:205` |
| Workload Groups | 8 | `ranges-limitations-zia.md:206` (provider: 255, `resource_zia_firewall_filtering_rules.go:173`) |
| Network Services | 1,024 | provider `nw_services` cap, `resource_zia_firewall_filtering_rules.go:174` |
| Network Services Groups / Network Applications / App Groups | 1,000 (Service/App Groups) | `ranges-limitations-zia.md:180` (Service Groups/Application Groups per Rule); no separate published cap for Network Applications (provider: no cap, `resource_zia_firewall_filtering_rules.go:171-172`) |
| Source / Destination IPs, subnets, ranges, groups | 1,000 groups / 8,000 IP entries | `ranges-limitations-zia.md:179` (Source IP/Destination Groups per Rule: 1,000); `:177-178` (IP entries per Rule: 8,000) (provider: no cap, `resource_zia_firewall_filtering_rules.go:167-168`) |
| Source / Destination Countries (ISO 3166 Alpha-2) | — | no documented per-rule cap |
| Destination IP Categories | — | no documented per-rule cap |

## Firewall Filtering actions

Source: `vendor/terraform-provider-zia/zia/resource_zia_firewall_filtering_rules.go`; `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py`.

| Action | Effect |
|---|---|
| `ALLOW` | Let the flow through. |
| `BLOCK_DROP` | Silent drop — no RST, no ICMP. Sender sees a timeout. |
| `BLOCK_RESET` | TCP RST sent. Sender sees immediate failure. Unhelpful attacker-visible signal that the port is firewalled. |
| `BLOCK_ICMP` | ICMP unreachable (for non-TCP flows). |
| `EVAL_NWAPP` | **Evaluate Network Application** — hand off to the network-app evaluator. A rule with this action doesn't terminate evaluation; it triggers a deeper L7 inspection for app-id and then applies a subsequent rule's action. Useful for "if this is Skype traffic, apply rule X" patterns where the L4 tuple alone can't tell.

Rule evaluation is **first-match-wins in ascending Rule Order**, with Admin Rank as a structural gate (higher-rank admin can override lower-rank admin's rule positioning). Same model as URL Filtering — see [`./url-filtering.md § Rule order and first-match semantics`](./url-filtering.md).

## IPS Control specifics

Source: `vendor/zscaler-help/about-ips-control.md`; `vendor/terraform-provider-zia/docs/resources/zia_ips_signature_rules.md`; `vendor/zscaler-sdk-python/zscaler/zia/ips_signature_rules.py`; `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_ips.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/ips_control_policies/ips_policies/ips_policies.go`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/ips_signature_rules.py`; `vendor/zscaler-help/ranges-limitations-zia.md`.

- **Signature source**: Zscaler's research team + industry-vendor feeds. Updated continuously by Zscaler; no operator action needed.
- **Custom signatures**: Snort-like syntax. Uploaded as part of custom threat categories; referenced in IPS Control rules.
- **Custom-signature automation surfaces**: Terraform `zia_ips_signature_rules`, Python SDK `client.zia.ips_signature_rules`, and MCP `zia_*_ips_signature_rule*` tools manage custom IPS signature definitions separately from `zia_firewall_ips_rule`. The signature automation surfaces validate `rule_text`, assign signatures to threat categories, and expose dynamic-validation status fields. IPS policy rules then reference the relevant threat category.
- **Two distinct SDK surfaces — signature definitions vs the rule engine**: The signature-definition resource above (`client.zia.ips_signature_rules`) is separate from the IPS **policy-rule** engine `client.zia.cloud_firewall_ips` (`vendor/zscaler-sdk-python/zscaler/zia/zia_service.py:236`, class `FirewallIPSRulesAPI`), which drives the **`/firewallIpsRules`** endpoint (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_ips.py:75,131,223,323,372`; same path in Go as `firewallIpsRulesEndpoint = "/zia/api/v1/firewallIpsRules"`, `vendor/zscaler-sdk-go/zscaler/zia/services/ips_control_policies/ips_policies/ips_policies.go:15`). The policy rule carries an `action` enum — `ALLOW`, `BLOCK_DROP`, `BLOCK_RESET`, `BYPASS_IPS` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_ips.py:172-173`; Go `Action` field at `vendor/zscaler-sdk-go/zscaler/zia/services/ips_control_policies/ips_policies/ips_policies.go:38`) — which is what decides allow/block/bypass-inspection per flow. The `BYPASS_IPS` value is the wire-level form of the "bypass IPS inspection" action mentioned in the sub-policy table above; the signature-definition resource has no such action field.
- **Protocol coverage**: HTTP, HTTPS, FTP, DNS, TCP, UDP, IP-based ports and protocols. IPS sees non-web traffic, unlike URL Filter / CAC / DLP.
- **Default rule: BLOCK ALL**. The shipped default blocks all traffic that matches any signature — customer rules allow-list specific traffic patterns or user populations.
- **ATP-first evaluation**: If both ATP (`references/zia/malware-and-atp.md`) and IPS Control are licensed, ATP rules evaluate **before** IPS rules. An ATP block pre-empts IPS.
- **Z-Tunnel 1.0 / PAC gating**: Tenants using Z-Tunnel 1.0 or PAC forwarding must enable firewall for this traffic class in Advanced Settings — otherwise firewall/IPS never runs against it. Z-Tunnel 2.0 forwarding engages firewall automatically.

### Logging for IPS

- Firewall Insights > Logs — full IPS detection log.
- Security Dashboard — web-traffic threat detections (subset of the full log).

## NAT Control

Source: `vendor/zscaler-help/configuring-firewall-policies.md`; `vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/nat_control_policies/nat_control_policies.go`.

NAT Control rules remap addresses at the PSE level. Common uses:

- **Masquerading** — internal source IPs rewritten to a tenant-controlled public egress IP (adjacent to but distinct from SIPA, which does this for ZPA-anchored destinations — see [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md)).
- **Source-NAT for overlapping address spaces** — two sites with the same RFC1918 range can both forward to ZIA if NAT Control rewrites one before policy lookup.
- **Destination-NAT / publishing** — less common in cloud-forwarded deployments.

NAT Control rules evaluate before Firewall Filtering — the rewritten addresses are what Firewall sees.

### NAT Control as a rule surface (DNAT)

NAT Control has its own dedicated SDK surface, separate from the Firewall Filtering rule resource: `client.zia.nat_control_policy` (`vendor/zscaler-sdk-python/zscaler/zia/zia_service.py:670`, class `NatControlPolicyAPI` at `vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py:26`), which drives the **`/dnatRules`** endpoint. The Go SDK exposes the same path as the `dnatRulesEndpoint = "/zia/api/v1/dnatRules"` constant (`vendor/zscaler-sdk-go/zscaler/zia/services/nat_control_policies/nat_control_policies.go:15`).

| Operation | Method | Path | Citation |
|---|---|---|---|
| List | GET | `/zia/api/v1/dnatRules` | `vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py:75` |
| Get | GET | `/zia/api/v1/dnatRules/{id}` | `vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py:131` |
| Create | POST | `/zia/api/v1/dnatRules` | `vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py:215` |
| Update | PUT | `/zia/api/v1/dnatRules/{id}` | `vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py:305` |
| Delete | DELETE | `/zia/api/v1/dnatRules/{id}` | `vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py:351` |

(Python base prefix `_zia_base_endpoint = "/zia/api/v1"` at `vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py:28` concatenates with the `/dnatRules` segment.)

The DNAT-specific fields — the redirect target — have no counterpart on a plain Firewall Filtering rule:

| Field (Python kwarg) | Go JSON tag | Meaning | Citation |
|---|---|---|---|
| `redirect_ip` | `redirectIp` | IP the traffic is redirected to when the DNAT rule triggers | py `nat_control_policy.py:168`; go `nat_control_policies.go:27` |
| `redirect_fqdn` | `redirectFqdn` | FQDN the traffic is redirected to | py `nat_control_policy.py:169`; go `nat_control_policies.go:26` |
| `redirect_port` | `redirectPort` | Port the traffic is redirected to | py `nat_control_policy.py:170`; go `nat_control_policies.go:28` |
| `res_categories` | `resCategories` | Resolved destination categories the DNAT rule applies to | py `nat_control_policy.py:182`; go `nat_control_policies.go:38` |

The remaining matching criteria (source/dest IP groups, dest countries, dest IP categories, users, groups, locations) mirror the Firewall Filtering rule criteria above (`vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py:172-185`). The redirect fields are what make this a destination-NAT surface rather than a filtering one.

## DNS Control

Source: `vendor/zscaler-help/configuring-firewall-policies.md`; `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py`; `vendor/zscaler-help/ranges-limitations-zia.md`.

DNS Control rules gate DNS resolution at the PSE's DNS service:

- Rule match → allow, redirect, or block.
- Redirect action can point to a sinkhole / local resolver — useful for gating specific external DNS queries.
- DNS Control rules apply **only to DNS traffic that flows through Zscaler's DNS service** (port 53 or a configured custom DNS port). DNS-over-HTTPS (DoH) and DNS-over-TLS (DoT) bypass this unless decrypted upstream (SSL Inspection on the DoH flow).

DNS Control is distinct from **URL Filtering** — URL Filtering applies to HTTP(S) URL requests; DNS Control applies to the DNS lookup phase. A URL-Filtering block for `badsite.com` still lets DNS resolution succeed (the DNS Control rule would gate the resolution itself).

## FTP Control

Source: `vendor/zscaler-help/configuring-firewall-policies.md`.

Documented separately (*About FTP Control*, not captured in this pass). In outline:

- Governs FTP (port 21) and passive-FTP flows.
- Actions: allow / block / alert.
- Per-user / per-location scoping as with Firewall Filtering.
- Relevant in tenants that haven't deprecated FTP yet; many modern tenants block all FTP at Firewall Filtering level.

## Rule-level tuning

Source: `vendor/zscaler-help/configuring-firewall-policies.md`; `vendor/zscaler-help/about-ips-control.md`; `vendor/terraform-provider-zia/zia/resource_zia_firewall_filtering_rules.go`.

- **Admin Rank** — visible only when Admin Ranking is enabled in Advanced Settings. Higher-rank admins can insert rules that supersede lower-rank admins' rule positioning. Same semantics as URL Filtering.
- **Rule Labels** — grouping construct for organization. The IPS Control page offers View-by-Label in addition to View-by-Order.
- **Rule Order** — numeric; first match wins in ascending order.

## Common questions this unlocks

Source: `vendor/zscaler-help/configuring-firewall-policies.md`; `vendor/zscaler-help/about-ips-control.md`; `vendor/terraform-provider-zia/zia/resource_zia_firewall_filtering_rules.go`.

- **"Why was this TCP connection silently dropped with no RST?"** — Firewall Filtering rule with `BLOCK_DROP` action. Check `firewall-log-schema.md` fields `rulelabel` + `action`.
- **"Why is Skype/Teams traffic being classified differently than the port suggests?"** — A rule with `EVAL_NWAPP` action triggered L7 app-id; subsequent app-identity-based rule fired.
- **"Why does Z-Tunnel 1.0 traffic skip our firewall?"** — Advanced Settings toggle to enable firewall on Z-Tunnel 1.0 / PAC traffic isn't on. Z-Tunnel 2.0 engages firewall automatically.
- **"How do we allow only our IT Security group to access threat sites for investigation, and block everyone else?"** — IPS Control default rule blocks all; insert a higher-precedence rule with User/Group criterion = IT Security + Action = Allow.
- **"ATP and IPS both licensed — which fires first?"** — ATP rules evaluate first. An ATP block pre-empts IPS.

## Surprises worth flagging

Source: `vendor/zscaler-help/configuring-firewall-policies.md`; `vendor/zscaler-help/about-ips-control.md`; `vendor/terraform-provider-zia/zia/resource_zia_firewall_filtering_rules.go`; `vendor/zscaler-help/ranges-limitations-zia.md`.

1. **IPS default is BLOCK ALL.** Turning on IPS Control without first authoring allow-rules for normal business traffic can cause wide-scale denial. Verify recommended-policy guardrails before flipping license.

2. **Advanced Firewall is a real gate on identity-aware rules.** A Basic-tier tenant can't scope firewall rules by user or group. Without the license, "allow finance team to reach ERP" becomes IP-range-based, which drifts as DHCP pools change.

3. **Custom IPS signatures use Snort-like syntax but aren't Snort.** Zscaler's parser is a Snort-subset. Operators copy-pasting arbitrary Snort rules from public repos should test signature validity in the admin portal first.

4. **DNS Control ≠ URL Filtering.** Both feel "domain-based" but fire at different layers. A user reporting "my URL filter should have blocked this" may actually need a DNS Control rule if the traffic bypasses HTTP (pure DNS exfiltration, IoT-device C2 over DNS).

5. **NAT Control rewrites happen before Firewall Filtering.** If a NAT rule changes the source IP, Firewall Filtering rules scoped on the pre-NAT source will not match. Check NAT rules when Firewall rules look correct but don't fire.

6. **ATP-before-IPS evaluation is silent.** An ATP block pre-empting an IPS rule won't show up in IPS logs at all. Debug both layers when a block looks unexpected — check `malware-and-atp.md § Blocked Policy Type` log field for the discriminator.

## Rule count limits

Source: `vendor/zscaler-help/ranges-limitations-zia.md`.

| Policy | Limit | Notes |
|---|---|---|
| Firewall Filtering — Standard tier | **10 rules** | Hard cap; surprising for orgs migrating from on-prem firewalls expecting unlimited rules |
| Firewall Filtering — Advanced tier | **1,021 rules** | |
| SSL Inspection | 255 rules total (245 custom + 10 predefined) | `ranges-limitations-zia.md:190` |
| DNS Control — Essential | 64 rules | |
| DNS Control — Advanced | 1,000 rules | |
| Destination Groups — FQDNs per group | **100 default → 8,000 with Advanced Firewall** | `ranges-limitations-zia.md:183`. The 100-FQDN-per-group default is a silent policy gap for FQDN-heavy rules without Advanced |
| URL Filtering | 1,000 rules | Raisable via support (`ranges-limitations-zia.md:184`) |
| All Other Policy Rules (DLP, IPS, etc.) | 1,024 (→ 2,048 via support) | `ranges-limitations-zia.md:191` — single shared bucket; no separate DLP-only cap in source |

The Standard-tier 10-rule Firewall Filtering cap is the most operationally consequential — almost any non-trivial deployment outgrows it immediately.

## IP Destination Groups (rule building block)

Source: `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py`; `vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_destination_groups.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipdestinationgroups/ipdestinationgroups.go`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/ip_destination_groups.py`.

Firewall Filtering rules reference Destination Groups for their destination criterion. A group has a **type** drawn from exactly four allowed values — `DSTN_IP`, `DSTN_FQDN`, `DSTN_DOMAIN`, `DSTN_OTHER`. The SDK hard-codes this set as `valid_exclude_types = {"DSTN_IP", "DSTN_FQDN", "DSTN_DOMAIN", "DSTN_OTHER"}` and raises `ValueError` on any other value (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:82-86`, restated at `:164` and `:250`; the same four-value enum is documented on the `add_ip_destination_group` `type` keyword at `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:428` and on the MCP tool `type` param at `vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/ip_destination_groups.py:68`). The same four values are the Go `excludeType` valid set (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipdestinationgroups/ipdestinationgroups.go:112-113`).

### Type → field pairing

The group's payload fields differ by type. The MCP tool field descriptions state the conditional and the SDK examples demonstrate it:

| Type | `addresses` | `countries` | `ip_categories` |
|---|---|---|---|
| `DSTN_IP` | IP list (required) | — | — |
| `DSTN_FQDN` | FQDN/domain list (required) | — | — |
| `DSTN_OTHER` | (none) | country codes | custom URL categories |

- `addresses` is "Required for DSTN_IP or DSTN_FQDN types" (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/ip_destination_groups.py:73`); `countries` and `ip_categories` are "Optional for DSTN_OTHER" (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/ip_destination_groups.py:77`, `:81`).
- The SDK worked examples confirm the pairing: `DSTN_IP` uses `addresses=` an IP list (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:442-443`), `DSTN_FQDN` uses `addresses=` an FQDN/domain list (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:455-456`), and `DSTN_OTHER` uses `countries=['COUNTRY_US']` + `ip_categories=['CUSTOM_01']` with no `addresses` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:468-470`).
- `ip_categories` accepts "Only Custom categories allowed" (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:430`).

**This conditional is documented, not code-enforced.** Neither the SDK nor the MCP tool runs per-type field validation — only `type` membership in the four-value set is checked, and only on the list `excludeType` param (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:82-86`). A request with, say, `DSTN_IP` and no `addresses` is not rejected client-side by any mined source.

### Wire schema

Python model attributes → JSON request keys (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_destination_groups.py:31-39` attrs, `:55-63` wire keys):

| Python attr | Wire key | Go field | Go JSON tag | Type |
|---|---|---|---|---|
| `id` | `id` | `ID` | `json:"id"` | int |
| `name` | `name` | `Name` | `json:"name,omitempty"` | str |
| `description` | `description` | `Description` | `json:"description,omitempty"` | str |
| `type` | `type` | `Type` | `json:"type,omitempty"` | str |
| `is_non_editable` | `isNonEditable` | `IsNonEditable` | `json:"isNonEditable,omitempty"` | bool |
| `addresses` | `addresses` | `Addresses` | `json:"addresses,omitempty"` | list[str] |
| `countries` | `countries` | `Countries` | `json:"countries,omitempty"` | list[str] |
| `ip_categories` | `ipCategories` | `IPCategories` | `json:"ipCategories,omitempty"` | list[str] |

Go field comments add detail: `Addresses` may hold "Destination IP addresses, FQDNs, or wildcard FQDNs" (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipdestinationgroups/ipdestinationgroups.go:31`); `IsNonEditable` "is applicable only to predefined IP address groups, which cannot be modified" (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipdestinationgroups/ipdestinationgroups.go:40`). The full struct is at `vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipdestinationgroups/ipdestinationgroups.go:18-42`.

### Endpoints

The Python base prefix `_zia_base_endpoint = "/zia/api/v1"` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:34`) concatenates with the `/ipDestinationGroups` segment; the Go constant hard-codes the same full path (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipdestinationgroups/ipdestinationgroups.go:15`).

| Operation | Method | Path | Citation |
|---|---|---|---|
| List | GET | `/zia/api/v1/ipDestinationGroups` | `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:91` |
| Create | POST | `/zia/api/v1/ipDestinationGroups` | `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:479` |
| Update | PUT | `/zia/api/v1/ipDestinationGroups/{id}` | `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:576` |
| Delete | DELETE | `/zia/api/v1/ipDestinationGroups/{id}` | `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:619` |

### excludeType is exclusion, not inclusion

The LIST filter `excludeType` removes all groups matching the named type — it is not an include filter. Python sends the query key `excludeType` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:96-97`, documented at `:50-52`); Go adds the same `excludeType` query key (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipdestinationgroups/ipdestinationgroups.go:120-122`). Valid values are the same four `DSTN_*` enum members.

### Update `override` controls IP merge behavior

The UPDATE call takes an `override` query param. When `override=false` the supplied IPs are appended to the existing set; otherwise the existing IPs are overridden; the default is `true` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:512-514`). The Go `Update()` appends `?override=%t` to the URL only when the `override` pointer is non-nil (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipdestinationgroups/ipdestinationgroups.go:84-89`).

## Network Services (rule building block)

Source: `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py`; `vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices.go`; `vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices_test.go`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/network_services.py`.

A Network Service is the port-based criterion (the "Network Services + Service Groups" row in [Firewall Filtering rule criteria](#firewall-filtering-rule-criteria)). It carries a service `type`, a set of port arrays, and metadata.

### `type` enum is documented, not validated

The service `type` enum `STANDARD` / `PREDEFINED` / `CUSTOM` appears only in the MCP tool docstring (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/network_services.py:136`, `:221`). Neither SDK validates it: the Python model stores `type` as a free-form string (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service.py:35`) and the Go struct stores `Type` as a free-form string (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices.go:27`). The only concrete value of this enum in any mined source is `CUSTOM`, used in the Go integration test (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices_test.go:23`).

### protocol enum is a list-query filter

The protocol enum has six values — `ICMP`, `TCP`, `UDP`, `GRE`, `ESP`, `OTHER` — used as a LIST-query filter (`query_params.protocol`). It is validated only in the MCP tool, as `valid_protocols={"ICMP","TCP","UDP","GRE","ESP","OTHER"}` (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/network_services.py:174-179`), and documented in the SDK list docstring as "Supported Values: ICMP, TCP, UDP, GRE, ESP, OTHER" (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:1810-1811`). The Python SDK service layer itself performs no protocol validation; the Go struct exposes a `Protocol` string field with no enum check (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices.go:29`).

### Port input tuples and the wire-key transform

The SDK accepts ports as a list of `[direction, protocol, start, end?]` tuples, where `direction` is `src`/`dest` and `protocol` is `tcp`/`udp`; `end` is omitted for a single port (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:2006-2007`; MCP format doc `vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/network_services.py:252-258`, direction/protocol validation `:371-375`). The SDK derives the wire key dynamically as `f"{items[0]}{items[1].title()}Ports"` and appends `{start: int(items[2]), end?: int(items[3])}` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:2050-2055` on add, `:2132-2137` on update). The `.title()` call is what uppercases `tcp`/`udp` to `Tcp`/`Udp`:

| Input tuple | Wire key |
|---|---|
| `('src','tcp',…)` | `srcTcpPorts` |
| `('dest','tcp',…)` | `destTcpPorts` |
| `('src','udp',…)` | `srcUdpPorts` |
| `('dest','udp',…)` | `destUdpPorts` |

Each port array is a list of `{start, end}` objects (Python `PortRange` / Go `NetworkPorts`). The Python `PortRange.request_format()` always emits both `start` and `end` keys (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service.py:90-91`, attrs `:84-85`). The Go `NetworkPorts` struct is `{Start, End}` (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices.go:33-36`); the Go integration test builds single ports as bare `{Start: 5000}` and ranges as `{Start: 5002, End: 5005}` (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices_test.go:24-47`).

### Wire schema

Python model attributes → JSON request keys (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service.py:31-43` attrs, `:59-70` wire keys):

| Python attr | Wire key | Type |
|---|---|---|
| `id` | `id` | int |
| `name` | `name` | str |
| `description` | `description` | str |
| `tag` | `tag` | str |
| `type` | `type` | str |
| `creator_context` | `creatorContext` | str |
| `is_name_l10n_tag` | `isNameL10nTag` | bool |
| `src_tcp_ports` | `srcTcpPorts` | list[PortRange] |
| `dest_tcp_ports` | `destTcpPorts` | list[PortRange] |
| `src_udp_ports` | `srcUdpPorts` | list[PortRange] |
| `dest_udp_ports` | `destUdpPorts` | list[PortRange] |

### Python-vs-Go field divergence

The two SDKs model the Network Service object differently:

- The Python model carries `creator_context` / `creatorContext` (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service.py:36`, `:65`), which the Go struct lacks (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices.go:19-31`).
- The Go struct carries a top-level `Protocol` field, `json:"protocol,omitempty"` (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices.go:29`), that the Python model does not store as an object attribute — in Python, protocol exists only as a list-query param (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service.py:31-43`).
- Both sides share `id`, `name`, `type`, `description`, `tag`, `isNameL10nTag`, and the four port arrays `srcTcpPorts` / `destTcpPorts` / `srcUdpPorts` / `destUdpPorts` (Python `vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service.py:31-43`; Go `vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices.go:19-31`).

### Endpoints

Python base prefix `/zia/api/v1` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:34`) + `/networkServices`; the Go constant hard-codes the same full path (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices.go:16`).

| Operation | Method | Path | Citation |
|---|---|---|---|
| List | GET | `/zia/api/v1/networkServices` | `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:1854` |
| Lite | GET | `/zia/api/v1/networkServices/lite` | `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:1925` |
| Create | POST | `/zia/api/v1/networkServices` | `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:2045` |
| Update | PUT | `/zia/api/v1/networkServices/{id}` | `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:2125` |
| Delete | DELETE | `/zia/api/v1/networkServices/{id}` | `vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:2176` |

### Canonical service names are case-sensitive UPPERCASE

Canonical Network Service names are case-sensitive uppercase enums (e.g. `HTTP`, `FTP`, `DNS`) (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/network_services.py:115-117`). The server-side `search` filter is effectively case-sensitive against these names, so `search='http'` will not match the predefined `HTTP` service (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/network_services.py:81-84`). The MCP tool's `name` param is the case-insensitive client-side alternative — a substring match lowercased on both sides (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/network_services.py:191-195`). This case-sensitivity is documented only in the MCP tool, not in the SDK.

### Update replaces ports wholesale

On UPDATE: if `ports` are not provided, the existing ports are left unchanged; if `ports` are provided, they overwrite the existing ports entirely (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:2081-2082`; MCP tool `vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/network_services.py:401-403`, `:414-416`).

## Open questions

These came up while mining SDK/API source and could not be backed from any vendor file in this pass:

- **`STANDARD` vs `PREDEFINED` Network Service type behavior** — no `STANDARD` or `PREDEFINED` literal value appears anywhere in the SDK service/model source; only the MCP docstring lists all three (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/network_services.py:136`) and only `CUSTOM` appears as a concrete value (`vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices_test.go:23`). The wire-level distinction between `STANDARD` and `PREDEFINED` is unverified.
- **Valid country-code format** — only example values `COUNTRY_CA` / `COUNTRY_US` appear (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:431`, `:469`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/ip_destination_groups.py:77`); the full `COUNTRY_*` enum is not enumerated in any mined file.
- **Allowed custom URL-category identifiers** — `ip_categories` is documented as "Only Custom categories allowed" with example `CUSTOM_01` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:430`), but no source enumerates or validates the allowed identifiers.
- **`DSTN_DOMAIN` field requirement** — `DSTN_DOMAIN` appears only in the four-value enum lists; no example or per-type field rule for it (vs `DSTN_FQDN` using `addresses`) exists in any mined source.
- **`tag` and `creatorContext` semantics** — both fields exist on the Python Network Service model (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service.py:34`, `:36`) but carry no description or allowed-values documentation in any mined source.
- **Caps and ordering** — no mined source states a hard cap on addresses per destination group or ports per network service, nor a precedence/ordering rule among the four port arrays.

These open firewall items are tracked together as `zia-60` in [`../_meta/clarifications.md`](../_meta/clarifications.md#zia-60-network-service-type-behavior-countrycategory-enums-and-caps).

## Cross-links

- Rule scoping by Location / Location Group: [`./locations.md`](./locations.md).
- Pipeline ordering (Firewall → Web module two-pass): [`./url-filtering.md`](./url-filtering.md).
- Log schema for firewall events: [`./logs/firewall-log-schema.md`](./logs/firewall-log-schema.md).
- SPL pattern for firewall-vs-web-module block discrimination: [`../shared/splunk-queries.md § firewall-vs-web-module-block`](../shared/splunk-queries.md).
- ATP evaluation order: [`./malware-and-atp.md`](./malware-and-atp.md).
- Z-Tunnel 1.0 / PAC forwarding gating: [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md).
- Terraform firewall resources: [`../shared/terraform.md`](../shared/terraform.md).
