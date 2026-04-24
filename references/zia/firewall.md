---
product: zia
topic: "firewall"
title: "ZIA Firewall Control — Filtering, NAT, DNS, IPS"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "vendor/zscaler-help/about-ips-control.md"
  - "vendor/zscaler-help/configuring-firewall-policies.md"
  - "vendor/terraform-provider-zia/zia/resource_firewall_filtering_rule.go"
  - "vendor/zscaler-sdk-python/zscaler/zia/firewall.py"
author-status: draft
---

# ZIA Firewall Control — Filtering, NAT, DNS, IPS

ZIA's Firewall Control module handles L3/L4 flows and signature-based intrusion prevention — distinct from URL Filtering, CAC, SSL Inspection, and DLP, which operate on decoded web content. When a user reports "my traffic was blocked and it's not a URL Filter rule," Firewall Control is the other common answer (Malware Protection / ATP being the third — see [`./malware-and-atp.md`](./malware-and-atp.md)).

## Firewall is four policies in a trenchcoat

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

From the Terraform provider schema (`resource_firewall_filtering_rule.go`) and SDK:

| Criterion | Limit | Scope |
|---|---|---|
| Users | Up to 4 | Advanced only |
| Groups | Up to 8 | Advanced only |
| Departments | Unlimited | Advanced only |
| Locations | Up to 8 | Both tiers |
| Location Groups | Up to 32 | Both tiers |
| Devices (with trust level LOW / MEDIUM / HIGH) | — | Advanced only |
| Time Windows | Up to 2 | Both tiers |
| Network Services + Service Groups | 1,024 custom services | Both tiers |
| Network Applications + App Groups | — | Advanced only |
| Source IPs / subnets / ranges / groups | — | Both tiers |
| Destination IPs / subnets / ranges / groups | — | Both tiers |
| Source Countries (ISO 3166 Alpha-2) | — | Both tiers |
| Destination Countries (ISO 3166 Alpha-2) | — | Both tiers |
| Destination IP Categories | — | Both tiers |

## Firewall Filtering actions

| Action | Effect |
|---|---|
| `ALLOW` | Let the flow through. |
| `BLOCK_DROP` | Silent drop — no RST, no ICMP. Sender sees a timeout. |
| `BLOCK_RESET` | TCP RST sent. Sender sees immediate failure. Unhelpful attacker-visible signal that the port is firewalled. |
| `BLOCK_ICMP` | ICMP unreachable (for non-TCP flows). |
| `EVAL_NWAPP` | **Evaluate Network Application** — hand off to the network-app evaluator. A rule with this action doesn't terminate evaluation; it triggers a deeper L7 inspection for app-id and then applies a subsequent rule's action. Useful for "if this is Skype traffic, apply rule X" patterns where the L4 tuple alone can't tell.

Rule evaluation is **first-match-wins in ascending Rule Order**, with Admin Rank as a structural gate (higher-rank admin can override lower-rank admin's rule positioning). Same model as URL Filtering — see [`./url-filtering.md § Rule order and first-match semantics`](./url-filtering.md).

## IPS Control specifics

- **Signature source**: Zscaler's research team + industry-vendor feeds. Updated continuously by Zscaler; no operator action needed.
- **Custom signatures**: Snort-like syntax. Uploaded as part of custom threat categories; referenced in IPS Control rules.
- **Protocol coverage**: HTTP, HTTPS, FTP, DNS, TCP, UDP, IP-based ports and protocols. IPS sees non-web traffic, unlike URL Filter / CAC / DLP.
- **Default rule: BLOCK ALL**. The shipped default blocks all traffic that matches any signature — customer rules allow-list specific traffic patterns or user populations.
- **ATP-first evaluation**: If both ATP (`references/zia/malware-and-atp.md`) and IPS Control are licensed, ATP rules evaluate **before** IPS rules. An ATP block pre-empts IPS.
- **Z-Tunnel 1.0 / PAC gating**: Tenants using Z-Tunnel 1.0 or PAC forwarding must enable firewall for this traffic class in Advanced Settings — otherwise firewall/IPS never runs against it. Z-Tunnel 2.0 forwarding engages firewall automatically.

### Logging for IPS

- Firewall Insights > Logs — full IPS detection log.
- Security Dashboard — web-traffic threat detections (subset of the full log).

## NAT Control

NAT Control rules remap addresses at the PSE level. Common uses:

- **Masquerading** — internal source IPs rewritten to a tenant-controlled public egress IP (adjacent to but distinct from SIPA, which does this for ZPA-anchored destinations — see [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md)).
- **Source-NAT for overlapping address spaces** — two sites with the same RFC1918 range can both forward to ZIA if NAT Control rewrites one before policy lookup.
- **Destination-NAT / publishing** — less common in cloud-forwarded deployments.

NAT Control rules evaluate before Firewall Filtering — the rewritten addresses are what Firewall sees.

## DNS Control

DNS Control rules gate DNS resolution at the PSE's DNS service:

- Rule match → allow, redirect, or block.
- Redirect action can point to a sinkhole / local resolver — useful for gating specific external DNS queries.
- DNS Control rules apply **only to DNS traffic that flows through Zscaler's DNS service** (port 53 or a configured custom DNS port). DNS-over-HTTPS (DoH) and DNS-over-TLS (DoT) bypass this unless decrypted upstream (SSL Inspection on the DoH flow).

DNS Control is distinct from **URL Filtering** — URL Filtering applies to HTTP(S) URL requests; DNS Control applies to the DNS lookup phase. A URL-Filtering block for `badsite.com` still lets DNS resolution succeed (the DNS Control rule would gate the resolution itself).

## FTP Control

Documented separately (*About FTP Control*, not captured in this pass). In outline:

- Governs FTP (port 21) and passive-FTP flows.
- Actions: allow / block / alert.
- Per-user / per-location scoping as with Firewall Filtering.
- Relevant in tenants that haven't deprecated FTP yet; many modern tenants block all FTP at Firewall Filtering level.

## Rule-level tuning

- **Admin Rank** — visible only when Admin Ranking is enabled in Advanced Settings. Higher-rank admins can insert rules that supersede lower-rank admins' rule positioning. Same semantics as URL Filtering.
- **Rule Labels** — grouping construct for organization. The IPS Control page offers View-by-Label in addition to View-by-Order.
- **Rule Order** — numeric; first match wins in ascending order.

## Common questions this unlocks

- **"Why was this TCP connection silently dropped with no RST?"** — Firewall Filtering rule with `BLOCK_DROP` action. Check `firewall-log-schema.md` fields `rulelabel` + `action`.
- **"Why is Skype/Teams traffic being classified differently than the port suggests?"** — A rule with `EVAL_NWAPP` action triggered L7 app-id; subsequent app-identity-based rule fired.
- **"Why does Z-Tunnel 1.0 traffic skip our firewall?"** — Advanced Settings toggle to enable firewall on Z-Tunnel 1.0 / PAC traffic isn't on. Z-Tunnel 2.0 engages firewall automatically.
- **"How do we allow only our IT Security group to access threat sites for investigation, and block everyone else?"** — IPS Control default rule blocks all; insert a higher-precedence rule with User/Group criterion = IT Security + Action = Allow.
- **"ATP and IPS both licensed — which fires first?"** — ATP rules evaluate first. An ATP block pre-empts IPS.

## Surprises worth flagging

1. **IPS default is BLOCK ALL.** Turning on IPS Control without first authoring allow-rules for normal business traffic can cause wide-scale denial. Verify recommended-policy guardrails before flipping license.

2. **Advanced Firewall is a real gate on identity-aware rules.** A Basic-tier tenant can't scope firewall rules by user or group. Without the license, "allow finance team to reach ERP" becomes IP-range-based, which drifts as DHCP pools change.

3. **Custom IPS signatures use Snort-like syntax but aren't Snort.** Zscaler's parser is a Snort-subset. Operators copy-pasting arbitrary Snort rules from public repos should test signature validity in the admin portal first.

4. **DNS Control ≠ URL Filtering.** Both feel "domain-based" but fire at different layers. A user reporting "my URL filter should have blocked this" may actually need a DNS Control rule if the traffic bypasses HTTP (pure DNS exfiltration, IoT-device C2 over DNS).

5. **NAT Control rewrites happen before Firewall Filtering.** If a NAT rule changes the source IP, Firewall Filtering rules scoped on the pre-NAT source will not match. Check NAT rules when Firewall rules look correct but don't fire.

6. **ATP-before-IPS evaluation is silent.** An ATP block pre-empting an IPS rule won't show up in IPS logs at all. Debug both layers when a block looks unexpected — check `malware-and-atp.md § Blocked Policy Type` log field for the discriminator.

## Cross-links

- Rule scoping by Location / Location Group: [`./locations.md`](./locations.md).
- Pipeline ordering (Firewall → Web module two-pass): [`./url-filtering.md`](./url-filtering.md).
- Log schema for firewall events: [`./logs/firewall-log-schema.md`](./logs/firewall-log-schema.md).
- SPL pattern for firewall-vs-web-module block discrimination: [`../shared/splunk-queries.md § firewall-vs-web-module-block`](../shared/splunk-queries.md).
- ATP evaluation order: [`./malware-and-atp.md`](./malware-and-atp.md).
- Z-Tunnel 1.0 / PAC forwarding gating: [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md).
- Terraform firewall resources: [`../terraform.md`](../terraform.md).
