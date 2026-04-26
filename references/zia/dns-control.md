---
product: zia
topic: "dns-control"
title: "ZIA DNS Control policy — predefined rules, DoH, tunnel detection"
content-type: reasoning
last-verified: "2026-04-26"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/about-dns-control.md"
author-status: draft
---

# ZIA DNS Control policy

DNS Control is a **separate policy module** inside ZIA's Firewall Control umbrella, distinct from URL Filtering, Cloud App Control, and Firewall Filtering. It evaluates **DNS queries and responses** — not HTTP(S) flows. A URL Filtering block for `badsite.com` does nothing to the DNS lookup itself; a DNS Control block prevents resolution from completing at all.

Navigation path: `Policies > Access Control > Firewall > DNS Control`.

## What DNS Control is not

**Cloud Connector DNS Gateways** (CBC product, `Administration > Gateways`) are a different thing entirely — they redirect DNS requests received by a Cloud or Branch Connector to operator-specified DNS servers. They live in a separate product (Cloud & Branch Connector), have no rule engine, and carry no ZIA policy context. Don't conflate the two when an operator describes "DNS gateway."

## When DNS Control fires

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

DNS Control requires **firewall to be configured for the location**. From the source doc:

> To enable DNS Control, you need to configure the firewall for locations. In addition, ensure a Firewall Filtering rule is configured to allow DNS traffic (Network Services condition matches DNS), per the Recommended Firewall Control policy.

The reason is architectural: DNS Control sits inside the Firewall Control pipeline. Traffic from locations that haven't been onboarded to firewall forwarding never reaches the DNS Control engine. A tenant reporting "DNS Control rules aren't firing" for users at a specific site should check location configuration before chasing rule logic. See [`./firewall.md`](./firewall.md) for the firewall pipeline and [`./locations.md`](./locations.md) for location setup.

## The three predefined rules

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

Below all custom and predefined rules sit **default rules that allow all DNS traffic**. These maintain the lowest precedence, cannot be deleted, but their actions can be modified. They function as the catch-all — traffic that matches no custom rule is allowed through.

## Custom rule structure

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

ZIA evaluates DoH traffic, but with a structural constraint. DoH queries are HTTP(S) requests — the DNS payload is encrypted inside HTTPS. For ZIA to inspect the DNS payload and apply DNS Control rules to it, **SSL Inspection must be enabled for the DoH provider's domain** (e.g., `cloudflare-dns.com`, `dns.google`). Without decryption, ZIA sees an HTTPS flow to a DoH endpoint; DNS Control doesn't engage on the inner DNS query.

What the operator can do:
- **SSL Inspection + DNS Control** — decrypt the DoH flow, apply DNS Control rules to the inner query.
- **Block DoH at URL Filtering / Firewall Filtering** — block access to known DoH provider domains/IPs, forcing clients to use standard DNS that DNS Control can inspect.

What the operator cannot do without decryption: match on the DNS query name, record type, or response inside a DoH flow.

The source doc states DNS Control covers "UDP, TCP, and DNS over HTTPS (DoH) — irrespective of the protocol and the encryption used" — this is the product capability statement, contingent on having SSL Inspection covering the DoH transport. It is not saying DoH queries are inspected without decryption.

## DNS tunnel detection

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

DNS Control rules can reference **Newly Registered and Observed Domains (NROD)** as a criterion. Zscaler categorizes domains newly registered within the last 30 days, newly observed for the first time, or newly revived (dormant ~10 days then reactivated) as NROD until a proper classification is available.

From the source doc:

> A latency of about 2 to 36 hours is expected for domains to be classified as NROD depending on whether the domain is newly registered, observed, or newly revived. Moreover, the URL classification might not be available for the first-ever DNS request for such domains due to propagation delays.

**Why this matters:** a DNS Control rule that blocks NROD will not catch a brand-new malicious domain during the classification window. There's a gap of up to 36 hours between domain registration and NROD classification. Operators relying solely on NROD-block for C2 detection should layer it with behavioral detection (tunnel detection, query-rate anomalies) rather than treating NROD as real-time coverage.

The same NROD latency applies to URL Filtering — see [`./url-filtering.md § Edge cases`](./url-filtering.md) for the URL Filtering perspective.

## Surprises and gotchas

1. **DNS Control ≠ URL Filtering.** Both feel domain-based. URL Filtering fires on the HTTP(S) request URL; DNS Control fires on the DNS query. A URL Filtering block does not prevent resolution. An operator who needs to block both resolution and access needs rules in both modules — or just a DNS Control block (which prevents access by making the domain unresolvable).

2. **The firewall-location prerequisite is a silent miss.** DNS Control rules can be authored correctly and still never fire if the relevant location isn't firewall-configured. The rule list looks fine; traffic just bypasses the engine.

3. **Road Warrior rule order is a silent SIPA failure mode.** If `ZPA Resolver for Locations` ends up above `ZPA Resolver for Road Warrior`, road-warrior SIPA traffic silently uses the wrong IP pool. The traffic flows (DNS resolves, forwarding works), but the destination sees an unexpected source IP — breaking Conditional Access or IP allowlist checks.

4. **DoH requires SSL Inspection to be useful.** Operators who enable DoH-blocking via DNS Control but haven't ensured SSL Inspection covers DoH endpoints get false confidence — DoH flows to uninspected providers are opaque.

5. **DNS Control rule limits by tier.** Essential: 64 rules. Advanced: 1,000 rules. Source: `references/zia/firewall.md § Rule count limits`.

## Cross-links

- DNS as a sub-policy inside Firewall Control — [`./firewall.md § DNS Control`](./firewall.md)
- URL Filtering (parallel domain-based policy, different layer) — [`./url-filtering.md`](./url-filtering.md)
- ZPA Resolver predefined rules and full SIPA configuration chain — [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md)
- Z-Tunnel + DNS interaction (Z-Tunnel 1.0 PAC toggle required for firewall/DNS Control) — [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md)
- Forwarding Control (ZPA forwarding method — the other side of the SIPA DNS resolver setup) — [`./forwarding-control.md`](./forwarding-control.md)
- Location configuration prerequisite — [`./locations.md`](./locations.md)
