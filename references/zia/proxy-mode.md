---
product: zia
topic: "proxy-mode"
title: "ZIA proxy modes — Explicit vs Transparent destination resolution"
content-type: reference
last-verified: "2026-04-28"
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

This document covers how the **ZIA Public Service Edge identifies the destination host** once traffic arrives. It is upstream of SSL inspection policy (which governs what an SSL rule can match on) and downstream of traffic forwarding choice (which governs how traffic gets to the Service Edge in the first place).

- For SSL inspection policy matching behavior — see [`./ssl-inspection.md`](./ssl-inspection.md).
- For forwarding method choice (GRE/IPsec/PAC/ZCC) — see [`./traffic-forwarding-methods.md`](./traffic-forwarding-methods.md).

---

## 1. Two modes at a glance

| Mode | Client configured? | IP header destination | How Service Edge identifies host |
|---|---|---|---|
| **Explicit** | Yes — browser targets the Service Edge directly | Service Edge's IP | CONNECT host header, before SSL handshake |
| **Transparent** | No — traffic redirected at the router/tunnel | Origin server's IP | SNI extension in TLS Client Hello; falls back to server certificate |

Proxy mode is a **consequence** of the forwarding method — not a directly configurable setting. You don't enable Explicit or Transparent mode; it follows from how traffic arrives.

---

## 2. Explicit proxy mode

### 2.1 How it works

The browser (or OS proxy) is configured to use the ZIA Public Service Edge as its proxy — either by manual proxy settings or via a PAC file. When the browser initiates an HTTPS connection (Tier A — vendor doc, `understanding-proxy-mode.md`):

1. The browser puts the **Service Edge's IP** as the destination in the IP header.
2. Before the SSL handshake, the browser sends an HTTP CONNECT request to the Service Edge naming the target host and port:

   ```
   HTTP      270 CONNECT mail.google.com:443 HTTP/1.1
   ```

3. The Service Edge reads the hostname from the CONNECT request. Identity is unambiguous at this point — the full domain name is in plaintext before TLS begins.
4. The SSL handshake between the client and origin server happens only after the Service Edge has acted on the CONNECT.

### 2.2 PAC file role in explicit proxy mode

A **PAC (Proxy Auto-Configuration) file** is the standard mechanism for pointing browsers at the ZIA Service Edge in explicit mode. The PAC file:
- Is hosted at a URL served by Zscaler or the organization's internal web server.
- Contains JavaScript logic (`FindProxyForURL`) that evaluates the destination URL and returns either a proxy address or `DIRECT`.
- Is referenced in browser/OS settings or pushed via GPO/MDM.
- Allows selective proxying — internal destinations can bypass the proxy while internet-bound traffic is forwarded.

ZIA manages PAC files via the API (`client.zia.pac_files`). Key behaviors:
- PAC file changes take effect on the client's next PAC fetch cycle (browsers cache PAC files; cache TTL varies by OS and browser).
- ZCC Z-Tunnel 1.0 also uses a CONNECT-based (explicit) forwarding mode — ZCC acts as the proxy agent, not the browser directly.

### 2.3 HTTP CONNECT tunnel handling

The HTTP CONNECT method establishes a raw TCP tunnel through the proxy. The Service Edge:
1. Receives the CONNECT request with the target `host:port`.
2. Evaluates applicable policies against the declared hostname.
3. If permitted: responds `200 Connection established`, then proxies raw TCP between the browser and the origin.
4. If blocked: responds `403 Forbidden` or a Zscaler block page response.

All subsequent TLS bytes flow through this tunnel. The Service Edge sees only the CONNECT hostname, not the URL path or query string — those are encrypted inside the TLS handshake that follows.

### 2.4 Authentication in explicit mode

In explicit mode, the browser can be prompted for proxy authentication (HTTP `407 Proxy Authentication Required`). This enables per-user identification at the proxy level, before any TLS handshake. Supported auth methods:
- **Kerberos** — transparent if the device is domain-joined and the browser is Kerberos-aware.
- **NTLM** — Windows browser fallback.
- **Basic auth** — credential prompt (not recommended; transmits password in Base64).
- **Cookie-based auth (Surrogate IP)** — ZIA redirects to an IdP, issues a session cookie, uses that cookie for subsequent proxy auth. No per-request credential challenge.

Authentication is per-session; the browser caches the proxy auth credential for the session.

---

## 3. Transparent proxy mode

### 3.1 How it works

The browser has no proxy configured. Internet-bound traffic is routed to the Service Edge by an upstream device — typically a GRE or IPsec tunnel configured at the organization's egress router. The destination IP in the IP header is the origin server's IP, not the Service Edge's. The Service Edge is intercepting traffic it did not receive as an explicit proxy target.

Because there is no CONNECT request, the Service Edge must infer the destination hostname from the TLS handshake itself. It does so in order:

**Step 1 — SNI extension (primary path):**

Most TLS clients include a **Server Name Indication** extension in the TLS Client Hello. The SNI carries the requested hostname in plaintext before any encryption. The Service Edge reads it directly. (Tier A — vendor doc, `understanding-proxy-mode.md`.)

Example: a single CDN serves `drive.google.com`, `mail.google.com`, and `google.com` from the same IP using a shared `*.google.com` certificate. SNI lets the Service Edge distinguish which subdomain is being requested and apply per-subdomain policy — it cannot do this from the IP header alone.

**Step 2 — Server certificate fallback (when SNI is absent):**

If the Client Hello does not include an SNI extension, the Service Edge lets the TLS handshake proceed far enough to receive the server's certificate, then reads the destination hostname from the certificate's Subject/SAN fields.

This fallback is slower — it requires waiting for the server to respond before the Service Edge knows the destination. It also trusts the server's self-reported identity rather than the client's stated intent.

### 3.2 Authentication in transparent mode

In transparent mode, the client has no knowledge of the proxy and cannot be prompted for proxy credentials. Authentication options:
- **Surrogate IP** — the source IP is associated with a user identity. User logs into an auth portal (redirect on first access); subsequent traffic from that IP is associated with the authenticated user.
- **ZCC device identity** — ZCC (Z-Tunnel 2.0) carries device/user identity metadata in the tunnel header, enabling per-user policy in transparent mode.
- **No auth** — location-based policy only (source IP → location → policy); no per-user identification.

---

## 4. Comparison table

| Consideration | Explicit mode | Transparent mode |
|---|---|---|
| **Hostname confidence** | High — CONNECT host is client-stated, pre-TLS | Medium — SNI is client-stated but optional; certificate is server-stated |
| **Missing hostname** | Not possible — CONNECT is mandatory | Possible if client sends no SNI (rare in modern browsers) |
| **Spoofing risk** | Low | Low for SNI; server cert is harder to spoof |
| **Latency to first policy decision** | Immediate on CONNECT receipt | Immediate if SNI present; one round-trip delay if cert fallback |
| **IP-based policy criteria** | SSL rules evaluate on SNI only — IP destination groups ignored when SNI is present | SSL rules evaluate on **both SNI and destination IP** |
| **Authentication mechanism** | Proxy auth (Kerberos, NTLM, cookie-based) | Surrogate IP, ZCC identity, or location-only |
| **Protocol support** | HTTP/HTTPS (CONNECT-tunnel capable) | All TCP protocols (transparent interception) |
| **IPv6 support** | Varies by client and PAC logic | Varies by GRE/IPsec configuration |
| **Browser configuration required** | Yes — manual proxy or PAC | No — transparent to the browser |

---

## 5. Limitations per mode

### 5.1 Explicit mode limitations

- **Browser/proxy-aware clients only.** Applications that make direct socket connections (bypassing the OS proxy settings) are not captured in explicit mode. ZCC is needed to cover non-proxy-aware apps.
- **CONNECT User-Agent criterion in SSL rules** only fires in explicit proxy mode — transparent-proxy traffic never carries a CONNECT User-Agent.
- **No coverage for non-web protocols** over PAC-based explicit proxying. Only HTTP/HTTPS tunneled via CONNECT is captured.

### 5.2 Transparent mode limitations

- **The "Miscellaneous or Unknown" IP category over-exemption risk.** A "Do Not Inspect" SSL rule scoped to "Miscellaneous or Unknown" IP category will silently exempt nearly all traffic under transparent mode, because most public IPs have no URL-category classification — only the IP is known at that evaluation stage. The same rule under explicit mode only exempts actual unknown-SNI destinations. See [`./ssl-inspection.md §Transparent vs explicit traffic forwarding`](./ssl-inspection.md) for the full implication.
- **SNI spoofing is theoretically possible** — a client could declare a different SNI than the site it is actually connecting to, allowing policy bypass. This is a known transparent-proxy limitation; SSL inspection mitigates it by decrypting and re-evaluating the actual TLS handshake.
- **No proxy auth challenge.** The client doesn't know there's a proxy; it cannot respond to a `407` challenge. Authentication must use Surrogate IP or device identity.
- **IPv6 gaps.** GRE and IPsec tunnel configuration may not cover IPv6 traffic. Check router/firewall capability explicitly.

---

## 6. Forwarding method → proxy mode mapping

Proxy mode is determined by the forwarding method. The operator configures the forwarding method; proxy mode is a consequence.

| Forwarding method | Proxy mode at Service Edge | Notes |
|---|---|---|
| **PAC file** | Explicit | Browser targets Service Edge via PAC; CONNECT sent |
| **ZCC (Z-Tunnel 1.0)** | Explicit | ZCC forwards via CONNECT requests; ports 80/443 only |
| **ZCC (Z-Tunnel 2.0)** | Transparent | ZCC tunnels all traffic via DTLS/TLS; no CONNECT; SNI-based identification |
| **GRE tunnel** | Transparent | Router redirects traffic; destination IP is origin server; no CONNECT |
| **IPsec tunnel** | Transparent | Same as GRE — tunnel at the router; no CONNECT |
| **Proxy chaining** | Explicit | Upstream proxy sends CONNECT onward to Service Edge |

> Source note: PAC, GRE, IPsec, ZCC Z-Tunnel 1.0 — Tier A (`understanding-proxy-mode.md`, `choosing-traffic-forwarding-methods.md`). ZCC Z-Tunnel 2.0 transparent — Tier B (from `traffic-forwarding-methods.md §ZCC §Tunnel modes` describing Z-Tunnel 2.0 as DTLS/TLS all-protocol tunneling without CONNECT semantics). Proxy chaining — Tier B (upstream proxy issues CONNECT; Service Edge receives explicit-mode request).

---

## 7. Browser / client configuration requirements

### 7.1 Explicit mode — PAC file delivery

The PAC file must be reachable by client devices. Common delivery methods:
- **WPAD (Web Proxy Auto-Discovery):** DNS `WPAD` record points to the PAC URL. Browser auto-discovers on network join. Requires DNS configuration; security risk if WPAD is not tightly controlled.
- **GPO (Group Policy Object):** Browser proxy settings pushed via Windows Group Policy. Requires domain-joined devices; covers IE/Edge; Chrome honors IE settings on Windows.
- **MDM (Mobile Device Management):** PAC URL pushed via MDM profile. Covers managed devices (mobile, BYOD enrolled in MDM).
- **Manual configuration:** user-set proxy settings. Unreliable for enforcement; appropriate for testing.

### 7.2 Transparent mode — router/firewall configuration

No browser configuration needed. The router or SD-WAN appliance must:
- Have a GRE or IPsec tunnel provisioned to the ZIA Service Edge VIP.
- Route internet-bound traffic into the tunnel.
- Register a static public IP (for GRE) or FQDN credential (for IPsec dynamic IP) with ZIA to associate the tunnel with a Location.

---

## Cross-links

- **SSL inspection policy matching behavior** — how transparent vs explicit mode affects SSL rule evaluation, SNI-only vs SNI+IP, and the Miscellaneous-or-Unknown over-exemption risk — [`./ssl-inspection.md §Transparent vs explicit traffic forwarding`](./ssl-inspection.md)
- **Forwarding method choice** — GRE vs IPsec vs PAC vs ZCC trade-offs, upstream of proxy mode — [`./traffic-forwarding-methods.md`](./traffic-forwarding-methods.md)
- **PAC files API** — managing PAC files via SDK — [`../zia/api.md`](../zia/api.md) (PAC file service)
- **CONNECT User-Agent criterion in SSL rules** — only fires in explicit mode — [`./ssl-inspection.md §Rule criteria`](./ssl-inspection.md)
- **Do Not Inspect rule behavior difference** — same rule exempts dramatically different traffic volumes depending on proxy mode — [`./ssl-inspection.md §The two Do Not Inspect variants`](./ssl-inspection.md)
