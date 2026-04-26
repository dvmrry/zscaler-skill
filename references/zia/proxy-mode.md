---
product: zia
topic: "proxy-mode"
title: "ZIA proxy modes — Explicit vs Transparent destination resolution"
content-type: reasoning
last-verified: "2026-04-25"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-proxy-mode.md"
  - "vendor/zscaler-help/choosing-traffic-forwarding-methods.md"
  - "references/zia/ssl-inspection.md"
  - "references/zia/traffic-forwarding-methods.md"
author-status: draft
---

# ZIA proxy modes — Explicit vs Transparent destination resolution

This doc complements [`./ssl-inspection.md`](./ssl-inspection.md), which covers Explicit vs Transparent from the **TLS inspection policy angle** (what an SSL rule matches on — SNI vs SNI+IP). This doc is upstream of that: it covers how the **ZIA Public Service Edge identifies the destination host** in each mode once traffic has arrived. It does not cover how traffic gets to the Service Edge in the first place — that's [`./traffic-forwarding-methods.md`](./traffic-forwarding-methods.md).

## Two modes at a glance

| Mode | Client configured? | IP header destination | How Service Edge identifies host |
|---|---|---|---|
| **Explicit** | Yes — browser targets the Service Edge directly | Service Edge's IP | CONNECT host header, before SSL handshake |
| **Transparent** | No — traffic redirected at the router/tunnel | Origin server's IP | SNI extension in TLS Client Hello; falls back to server certificate |

---

## Explicit mode

The browser (or OS proxy) is configured to use the ZIA Public Service Edge as its proxy — either by manual proxy settings or via a PAC file. When the browser initiates an HTTPS connection:

1. The browser puts the **Service Edge's IP** as the destination in the IP header.
2. Before the SSL handshake, the browser sends an HTTP CONNECT request to the Service Edge naming the target host and port:

   ```
   HTTP      270 CONNECT mail.google.com:443 HTTP/1.1
   ```
   *(Exact capture from `vendor/zscaler-help/understanding-proxy-mode.md`.)*

3. The Service Edge reads the hostname from the CONNECT request. Identity is unambiguous at this point — the full domain name is in plaintext before TLS begins.
4. The SSL handshake between the client and origin server happens only after the Service Edge has acted on the CONNECT.

**Why this matters for policy:** the Service Edge has a reliable, attacker-visible hostname before any TLS negotiation. SSL Inspection policy, URL Filtering, and Cloud App Control all evaluate against this CONNECT host at the pre-decrypt pass. (Source: `ssl-inspection.md §Transparent vs explicit traffic forwarding`.)

---

## Transparent mode

The browser has no proxy configured. Internet-bound traffic is routed to the Service Edge by an upstream device — typically a GRE or IPsec tunnel configured at the organization's egress router. The **destination IP in the IP header is the origin server's IP**, not the Service Edge's. The Service Edge is intercepting traffic it did not explicitly receive as a proxy target.

Because there is no CONNECT request, the Service Edge must infer the destination hostname from the TLS handshake itself. It does so in order:

### 1. SNI extension (primary path)

Most TLS clients include a **Server Name Indication** extension in the TLS Client Hello. The SNI carries the requested hostname in plaintext, before any encryption. The Service Edge reads it directly.

Example use case: a single CDN may serve `drive.google.com`, `mail.google.com`, and `google.com` from the same IP using a shared `*.google.com` certificate. SNI lets the Service Edge distinguish which subdomain is being requested and apply per-subdomain policy accordingly — it cannot do this from the IP header alone.

### 2. Server certificate fallback (when SNI is absent)

If the Client Hello does not include an SNI extension, the Service Edge lets the TLS handshake proceed far enough to receive the **server's certificate**, then reads the destination hostname from the certificate's Subject/SAN fields.

This fallback is slower — it requires waiting for the server to respond before the Service Edge knows the destination. It also trusts the server's self-reported identity rather than the client's stated intent.

---

## Implications

| Consideration | Explicit mode | Transparent mode |
|---|---|---|
| **Hostname confidence** | High — CONNECT host is client-stated, pre-TLS | Medium — SNI is client-stated but optional; certificate is server-stated |
| **Missing hostname** | Not possible — CONNECT is mandatory | Possible if client sends no SNI (rare; uncommon in modern browsers) |
| **Spoofing risk** | Low — CONNECT host is what the browser intends to connect to | Low for SNI (client controls it); server cert is harder to spoof but not under client control |
| **Latency to first policy decision** | Immediate on CONNECT receipt | Immediate if SNI present; one round-trip delay if cert fallback required |
| **IP-based policy criteria** | SSL rules evaluate on SNI only — IP destination groups ignored when SNI is present | SSL rules evaluate on **both SNI and destination IP** — IP categories (e.g., Miscellaneous or Unknown) can match even when SNI is clean |

The IP-based evaluation difference is the main operational gotcha. See `ssl-inspection.md §Transparent vs explicit traffic forwarding` for the full implication: a Do Not Inspect rule scoped to "Miscellaneous or Unknown" will silently exempt nearly all traffic under transparent forwarding because most public IPs have no URL-category classification, while the same rule under explicit forwarding only exempts actual unknown-SNI destinations.

---

## Which mode applies — forwarding method mapping

Proxy mode is a **consequence** of how traffic arrives at the Service Edge. You don't configure it directly; it follows from your forwarding method choice.

| Forwarding method | Proxy mode at Service Edge | Notes |
|---|---|---|
| **PAC file** | Explicit | Browser is configured to target the Service Edge via PAC; CONNECT is sent |
| **ZCC (Z-Tunnel 1.0)** | Explicit | ZCC forwards via CONNECT requests (proxy-aware, ports 80/443 only) |
| **ZCC (Z-Tunnel 2.0)** | Transparent | ZCC tunnels all traffic via DTLS/TLS; no CONNECT; SNI-based identification |
| **GRE tunnel** | Transparent | Router redirects traffic; destination IP is origin server; no CONNECT |
| **IPsec tunnel** | Transparent | Same as GRE — tunnel at the router; no CONNECT |
| **Proxy chaining** | Explicit | Upstream proxy sends CONNECT onward to Service Edge |

> **Source note:** The PAC, GRE, IPsec, and ZCC Z-Tunnel 1.0 rows are Tier A (sourced directly from `understanding-proxy-mode.md` and `choosing-traffic-forwarding-methods.md`). The ZCC Z-Tunnel 2.0 transparent-mode mapping is Tier B (corroborated by `traffic-forwarding-methods.md §ZCC §Tunnel modes` which describes Z-Tunnel 2.0 as DTLS/TLS all-protocol tunneling without CONNECT semantics — consistent with transparent behavior). Proxy chaining is Tier B (the upstream proxy issues the CONNECT; the Service Edge receives an explicit-mode request regardless of what was upstream of the chaining proxy).

---

## Cross-links

- **SSL inspection policy matching behavior** — how transparent vs explicit mode affects what an SSL rule can match on (SNI only vs SNI+IP) and the Miscellaneous Or Unknown over-exemption risk — [`./ssl-inspection.md §Transparent vs explicit traffic forwarding`](./ssl-inspection.md)
- **Do Not Inspect rule matching depends on proxy mode** — in transparent mode, rules can match on destination IP category; in explicit mode, only SNI/CONNECT host is used — consequence: the same Do Not Inspect rule can exempt dramatically different traffic volumes depending on which mode is in effect. See `ssl-inspection.md §The two "Do Not Inspect" variants`.
- **Forwarding method choice** (upstream of proxy mode — covers GRE vs IPsec vs PAC vs ZCC trade-offs) — [`./traffic-forwarding-methods.md`](./traffic-forwarding-methods.md)
- **CONNECT User-Agent criterion in SSL rules** only fires in explicit proxy mode — transparent-proxy traffic never carries a CONNECT User-Agent. Source: `ssl-inspection.md §Rule criteria`.
