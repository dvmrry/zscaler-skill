---
product: shared
topic: "primer-networking-basics"
title: "Primer — networking basics for Zscaler reasoning"
content-type: primer
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: draft
audience: "non-networking professional who needs to reason about Zscaler"
---

# Primer — networking basics for Zscaler reasoning

This is a **prerequisite knowledge layer**, not Zscaler-specific content. It covers the generic-networking concepts the rest of the skill assumes you understand. If you already know IP/TCP/DNS/NAT cold, skip this.

Goal: by the end, you should be able to read sentences like "ZIA's Public Service Edge proxies the user's HTTPS connection after MITM-decrypting it" and know what each word means.

## Layer 1: bytes between machines

Every interaction across a network boils down to **a stream of bytes between two machines, identified by addresses**. The internet protocol stack adds layers of meaning on top of this base.

### IP addresses

An IP address identifies a network interface. Two flavors:

- **IPv4** — 32 bits, written as four decimal numbers separated by dots: `203.0.113.42`. Roughly 4.3 billion possible addresses; we ran out long ago.
- **IPv6** — 128 bits, written as eight hex groups separated by colons: `2001:db8::1`. Effectively unlimited.

**Public vs private IPs:**
- **Public**: globally unique, routable on the internet. Your office's egress IP is public.
- **Private** (RFC 1918): reusable inside any organization. `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`. Multiple organizations can use `10.0.0.5` simultaneously because they're not exposed to each other.

Private IPs need translation (NAT — see below) to reach the public internet.

### Subnets and CIDR

You'll see addresses like `10.0.0.0/24`. The `/24` means "the first 24 bits identify the network; the remaining 8 bits identify hosts within that network." So `10.0.0.0/24` is `10.0.0.0` through `10.0.0.255` — a 256-address range.

Common ones:
- `/8` = 16M addresses (huge)
- `/16` = 65K addresses (medium-large)
- `/24` = 256 addresses (typical office subnet)
- `/32` = single address

### Ports

A port number narrows down which **process** on a machine handles the bytes. IP address + port = "socket" — the unique endpoint of a connection.

Standard ports you'll see in Zscaler context:
- **80** — HTTP (unencrypted web)
- **443** — HTTPS (encrypted web)
- **53** — DNS
- **22** — SSH
- **21** — FTP control
- **3389** — RDP (Windows remote desktop)
- **5900** — VNC
- **88** — Kerberos authentication
- **445** — SMB (Windows file sharing)

## Layer 2: TCP vs UDP

Both ride on top of IP. Two ways to organize the byte stream:

### TCP — Transmission Control Protocol

- **Connection-oriented**: handshake first (SYN, SYN-ACK, ACK), then exchange data, then teardown.
- **Reliable**: retransmits lost packets, reorders out-of-order packets, detects corrupted packets.
- **Stream-based**: data flows as an ordered stream, not discrete packets.
- Used by: HTTP, HTTPS, SSH, FTP, SMB — anywhere you need "the bytes I send arrive in order, exactly once."

### UDP — User Datagram Protocol

- **Connectionless**: just send packets; no handshake.
- **Unreliable**: no retransmission, no ordering, no delivery guarantee.
- **Packet-based**: each packet is independent.
- Used by: DNS, video calls, gaming, DTLS-based VPNs (including Z-Tunnel 2.0).

Zscaler's Z-Tunnel 1.0 uses TCP (HTTP CONNECT under the hood); Z-Tunnel 2.0 uses DTLS (UDP). The difference matters when networks block UDP — 2.0 falls back to 1.0.

## Layer 3: NAT — Network Address Translation

When a private-IP machine talks to the internet, something has to translate `10.0.0.5` → a public IP the internet can route to. That something is **NAT**.

Three flavors:

- **Source NAT (SNAT)** — outbound: rewrite the source IP from private to a public address before sending. Most home routers and corporate firewalls do this.
- **Destination NAT (DNAT)** — inbound: rewrite the destination IP from a public address to a specific internal machine. How a public service "behind a firewall" works.
- **Port NAT (PAT) / NAPT** — many private machines share one public IP; the firewall multiplexes by also rewriting source ports. Standard for SOHO routers.

**Why this matters for Zscaler:**
- Public Service Edges (PSEs) see traffic with rewritten source IPs — they only know the egress IP, not the original device.
- Zscaler's **Source IP Anchoring (SIPA)** is a way to make a destination see a customer-controlled IP rather than Zscaler's PSE IP — relevant for Office 365 conditional access and IP-allowlisted apps.

## DNS — translating names to addresses

When you type `www.example.com` into a browser, it doesn't know what IP to connect to. **DNS** is the lookup layer.

The lookup chain:
1. Browser asks the OS resolver
2. OS resolver asks the configured DNS server (your home router, your corp DNS, or `8.8.8.8`, etc.)
3. That server may answer from cache, or recursively ask authoritative servers
4. Eventually returns an IP address (or set of addresses)

### Records you'll see

- **A** — IPv4 address for a name. `www.example.com → 203.0.113.42`.
- **AAAA** — IPv6 address for a name.
- **CNAME** — alias. `www.example.com → app.example.com → 203.0.113.42` (two-step lookup).
- **MX** — mail server for a domain.
- **TXT** — arbitrary text; used for SPF, DKIM, domain ownership verification.

### Zscaler-relevant DNS behaviors

- **DNS over HTTPS (DoH)** and **DNS over TLS (DoT)** encrypt the DNS query itself. Hides what you're looking up from network observers.
- **DNS Control** in ZIA is a policy module that gates DNS lookups (block bad domains at the resolution stage).
- **ZPA Synthetic IP** — when ZCC is connected, ZPA-protected app FQDNs resolve to fake IPs. The ZCC routes those connections to the ZPA cloud rather than directly. Operators see "weird IPs" in their host file or DNS responses.

## TLS / SSL — the encryption layer

**SSL** and **TLS** are the same thing in casual usage; SSL is the older protocol family (1.0/2.0/3.0), TLS is the newer (1.0/1.1/1.2/1.3). Industry should use TLS 1.2 or 1.3.

What it does:
1. **Authenticates the server** (and optionally the client) via X.509 certificates signed by a Certificate Authority (CA) the client trusts.
2. **Negotiates encryption keys** so the rest of the conversation is encrypted.
3. **Encrypts** subsequent application-layer data (HTTP, FTP, etc.) so observers can't read or modify it.

### Certificates

A certificate proves "the server presenting this is genuinely who it claims to be." Components:
- **Subject** — what name(s) the cert is valid for (Common Name / Subject Alternative Names)
- **Issuer** — which CA signed it
- **Public key** — for encryption negotiation
- **Validity period** — start and end dates
- **Signature** — cryptographic proof from the CA

Browsers ship with a list of trusted CAs (root certs). A cert signed by one of those, or by an intermediate CA whose chain leads to one, is trusted.

### Where Zscaler intersects

- **MITM ("Man in the Middle") inspection** — Zscaler's SSL Inspection feature decrypts HTTPS traffic to inspect contents, then re-encrypts. The user's device must trust a Zscaler-signed CA to see this as legitimate. ZCC installs the cert; non-ZCC devices need it manually.
- **Z-Tunnel 1.0** uses TLS over TCP.
- **Z-Tunnel 2.0** uses DTLS over UDP — same crypto family, different transport.
- **Browser Access** and **AppProtection** require a specific TLS 1.2 cipher (`ECDHE-RSA-AES128-GCM-SHA256`) for the browser-to-Zscaler hop.

## HTTP / HTTPS

**HTTP** is the protocol web traffic uses. Request-response: client sends a request (method + path + headers + optional body), server sends a response (status code + headers + optional body).

Methods:
- `GET` — retrieve. Default. Side-effect-free in spirit.
- `POST` — create / submit data.
- `PUT` — update / replace.
- `PATCH` — partial update.
- `DELETE` — remove.
- `HEAD` — like GET but only headers, no body.
- `OPTIONS` — what's allowed; used in CORS preflight.
- `CONNECT` — open a tunnel through a proxy.

**HTTPS** = HTTP over TLS. Same protocol on top, encrypted underneath.

### Headers worth knowing

- `Host:` — which domain this request is for (necessary because one IP often serves many domains).
- `User-Agent:` — what client software is making the request.
- `Authorization:` — credentials (usually `Bearer <token>` for API calls).
- `Content-Type:` — what kind of body (`application/json`, `text/html`, etc.).
- `Cookie:` / `Set-Cookie:` — session state.
- `X-Forwarded-For:` — when an upstream proxy / CDN inserted the original client IP.
- `Via:` — proxies that handled the request en route.

### Status codes

- **2xx** — success (`200 OK`, `201 Created`, `204 No Content`).
- **3xx** — redirect (`301 Moved Permanently`, `302 Found`).
- **4xx** — client error (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `429 Too Many Requests`).
- **5xx** — server error (`500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout`).

## Routing — how packets find their way

The internet is a mesh of **routers** that forward packets based on destination IP.

- Each router has a **routing table** mapping destination prefixes to next-hop interfaces.
- Most internal routing protocols use BGP, OSPF, RIP, etc. — internally, just "where to send packets headed for prefix X."
- A **default route** is the catch-all for "anything not matching a more specific entry, send here."

For a user sending traffic from `10.0.0.5` to `203.0.113.42`:
1. Local router sees `203.0.113.42` is not local; forwards to its default route (the firewall).
2. Firewall NATs source from private to public; forwards to its ISP.
3. ISP routers carry the packet across the internet to AS 12345 (a different ISP).
4. AS 12345 routes to the destination network.
5. Final router delivers to `203.0.113.42`.

Zscaler inserts itself into this path — from the user's network, traffic destined for the open internet is **forwarded into Zscaler's cloud first** (via tunnel, PAC file, or ZCC), then Zscaler's PSE forwards to the actual destination.

## Forwarding paradigms (preview — see proxy-vs-gateway-vs-tunnel.md for depth)

Three ways to get traffic from a user to Zscaler:

1. **Tunnel** — the user's machine encapsulates traffic in a tunneling protocol (GRE, IPSec, Z-Tunnel) to Zscaler. Zscaler unwraps and forwards.
2. **Proxy** — the user's browser or OS is configured to send web traffic to Zscaler explicitly (via PAC file URL or proxy server settings).
3. **Direct route** — the user's network routes traffic to Zscaler at the IP layer; user's client doesn't know.

Zscaler operators mix these depending on user / device / location. The choice is operator-decision-driven; the user usually doesn't know.

## What this primer is NOT

- Not a Zscaler-specific reference. For that, see `references/_meta/portfolio-map.md` and the per-product directories.
- Not exhaustive networking knowledge — it covers the slice of networking the skill assumes. Real networking involves routing protocols, congestion control, queueing theory, etc.
- Not a security primer — security concepts (zero-trust, identity, threat models) are covered in companion primers.

## Cross-links

- Proxy / gateway / tunnel forwarding paradigms in depth: [`./proxy-vs-gateway-vs-tunnel.md`](./proxy-vs-gateway-vs-tunnel.md)
- Zero-trust mental model: [`./zero-trust.md`](./zero-trust.md)
- Identity / SAML / OIDC: [`./identity-saml-oidc.md`](./identity-saml-oidc.md)
- The Zscaler product platform: [`./zscaler-platform-shape.md`](./zscaler-platform-shape.md)
- For depth on a specific product, start at [`../portfolio-map.md`](../portfolio-map.md).
