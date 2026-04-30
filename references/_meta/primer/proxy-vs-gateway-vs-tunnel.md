---
product: shared
topic: "primer-forwarding-paradigms"
title: "Primer — proxy vs gateway vs tunnel"
content-type: primer
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: draft
audience: "non-networking professional who needs to reason about Zscaler"
---

# Primer — proxy vs gateway vs tunnel

These three terms describe **fundamentally different ways traffic gets from a user to a security service**. They're often used interchangeably in casual conversation but mean specific things in network architecture. Understanding the difference is prerequisite to reasoning about Zscaler's deployment options.

## At a glance

| | What gets forwarded | Who decides | Visibility to user |
|---|---|---|---|
| **Proxy** | Application-layer requests (typically HTTP/S) | The application or OS proxy config | Usually visible (user knows traffic is proxied) |
| **Tunnel** | All packets encapsulated within an encrypted wrapper | Tunnel client | Sometimes invisible (kernel-level) |
| **Gateway / Direct route** | All packets at the IP layer | Network routing | Invisible (just normal routing) |

## Proxy — application-layer forwarding

A proxy is a server that sits between a client and a destination, **understanding the application protocol** (almost always HTTP/HTTPS).

### How it works

1. Client opens a TCP connection to the proxy (not to the actual destination).
2. Client sends an HTTP request, but with the full URL: `GET http://example.com/page HTTP/1.1` (instead of just `/page`).
3. Proxy parses the request, decides what to do (allow / block / cache / inspect), and either:
   - Forwards the request to the actual destination, OR
   - Returns its own response (e.g., a block page).
4. The destination's response flows back through the proxy to the client.

For HTTPS, the client uses the `CONNECT` method to ask the proxy to open a TCP tunnel; then TLS is negotiated end-to-end. The proxy can see *that* you're talking to `example.com:443` but not *what* you're saying — unless the proxy also does TLS interception (MITM SSL inspection — see "TLS interception" in `networking-basics.md`).

### Configuration

Browsers and OSes can be told "use proxy X for HTTP/HTTPS traffic." Three common ways:

- **Manual** — paste a hostname and port into network settings.
- **PAC file** — a JavaScript program at a URL (`http://something.example.com/proxy.pac`). The browser fetches the PAC, evaluates it, and the JS returns "use this proxy" or "go direct" based on URL / time-of-day / etc.
- **WPAD** — Web Proxy Auto-Discovery. The browser auto-discovers the PAC URL from DHCP / DNS.

### Pros / cons

**Pros:**
- Granular control at the URL / domain / category level.
- Can be tenant-specific without affecting other traffic.
- Doesn't require network reconfiguration or admin rights on the user's machine to change.

**Cons:**
- Only handles application-layer traffic that knows about proxies (HTTP/HTTPS). Doesn't help with arbitrary TCP/UDP traffic (e.g., a desktop app that ignores proxy settings).
- Needs configuration; users on networks not under your control can bypass.

### Where Zscaler uses it

- **PAC files** are a major Zscaler forwarding option for browser traffic. Default Zscaler PACs (`recommended.pac`, `proxy.pac`, `mobile_proxy.pac`, `kerberos.pac`) are hosted by Zscaler with auto-substituted Service Edge IPs. See [`../../shared/pac-files.md`](../../shared/pac-files.md).
- **ZIA Public Service Edges (PSEs)** function as proxies for traffic forwarded to them — they parse HTTP, do URL filtering, do SSL inspection, etc.

## Tunnel — packet-level encapsulation

A tunnel takes packets at some layer (IP, TCP, etc.) and wraps them in another protocol to transport them somewhere. The wrapped packets are typically encrypted.

### How it works

1. Tunnel client (software on the user's machine, or a router/firewall) creates a virtual interface.
2. Anything routed to that interface gets **encapsulated** — wrapped in a tunnel protocol (e.g., GRE, IPSec, OpenVPN, WireGuard, DTLS-as-Z-Tunnel-2.0).
3. The wrapped packet travels to the tunnel server, which **decapsulates** — strips the wrapper.
4. The original packet is then routed normally from the tunnel server's network position.

The user's traffic appears to originate from the tunnel server's location.

### Tunnel protocols

- **GRE** (Generic Routing Encapsulation) — simple, stateless, no encryption built-in. Common for site-to-site tunnels in corporate networks.
- **IPSec** — encrypted, more complex, supports many crypto modes. Two main modes: tunnel mode (whole packet encapsulated) and transport mode (just payload).
- **TLS / SSL VPNs** — TLS over TCP. Includes OpenVPN, AnyConnect (TLS variant), and **Z-Tunnel 1.0**.
- **DTLS** — Datagram TLS, the UDP-friendly cousin of TLS. **Z-Tunnel 2.0** uses this.
- **WireGuard** — newer, simpler, faster cryptographic VPN protocol.

### Pros / cons

**Pros:**
- Forwards **all** traffic on the user's machine, not just HTTP/HTTPS — desktop apps, IoT protocols, custom TCP/UDP stuff.
- Transparent to applications — they see normal network access.
- End-to-end encryption from user to tunnel termination.

**Cons:**
- Requires tunnel client software (typically with elevated privileges).
- More complex to deploy and maintain than a proxy.
- Tunnel itself can fail (crypto handshake issues, MTU mismatches, network blocks).
- Bandwidth overhead from encapsulation (extra headers per packet).

### Where Zscaler uses it

- **Z-Tunnel 1.0** — TLS over TCP. The original ZCC tunnel. Reliable on restrictive networks.
- **Z-Tunnel 2.0** — DTLS over UDP. Newer, faster, but blocked by some networks (falls back to 1.0).
- **GRE / IPSec tunnels** — site-to-site forwarding from customer routers / firewalls into Zscaler. No client software on user devices; whole branch network's traffic goes via the tunnel.
- **ZPA Microtunnel / M-Tunnel** — ZPA-specific tunnel for Private Access traffic.

See `references/zcc/z-tunnel.md` for Z-Tunnel-specific depth.

## Gateway / Direct route — IP-layer forwarding

A "gateway" in network terms is just a router that connects one network to another. Direct-routed forwarding means: the user's local network is configured so that traffic to certain destinations gets routed to the gateway, which then handles it.

### How it works

1. User's machine sends a packet (no special configuration on the machine itself).
2. Router on the user's network has a routing rule: "anything destined for prefix X goes to gateway Y instead of the default."
3. Gateway Y receives the packet, processes it (security inspection, redirection, NATting, etc.), and forwards.
4. Reply traffic returns via the same path (or a similarly-configured return path).

This is **transparent to the user's machine** — nothing on the device is configured for proxying or tunneling. It's pure routing.

### Variants you'll see

- **Transparent proxy** — a proxy that catches traffic without the client knowing. Implemented via WCCP, policy routing, or inline interception. The "transparent" name is confusing because it's a proxy, but the user doesn't see it.
- **Inline gateway** — security device sits in the network path. Every packet passes through it.
- **Cloud gateway** — same idea but the inline device is in the cloud, reached via tunnel or routing.

### Pros / cons

**Pros:**
- Completely transparent to user devices.
- Forwards everything (all protocols, not just HTTP).
- No client software, no PAC file, no manual config.

**Cons:**
- Requires control over the user's network — only works for devices on networks you operate.
- Doesn't help road-warriors / off-network devices.
- Asymmetric routing (traffic out one path, return another) can be tricky.

### Where Zscaler uses it

- **Cloud Connector / Branch Connector** — in-cloud or in-branch VMs that act as inline gateways for cloud workloads or branch traffic.
- **Locations with GRE / IPSec tunnels** — at the branch level, traffic is routed into the tunnel; from the user's perspective it's transparent.

## How Zscaler combines all three

A typical large enterprise deployment uses **all three paradigms simultaneously**, layered:

| Scenario | Forwarding |
|---|---|
| Office users on corporate network | GRE/IPSec tunnel from edge router → Zscaler PSE |
| Office users with ZCC | ZCC's Z-Tunnel forwards before tunnel reaches edge (more granular policy) |
| Road warriors on personal Wi-Fi | ZCC's Z-Tunnel from laptop → Zscaler PSE |
| Branch offices without ZCC | GRE/IPSec from branch router → Zscaler PSE (gateway model) |
| Cloud workloads (AWS / Azure / GCP) | Cloud Connector VM as inline gateway → Zscaler |
| Browser-only access for contractors | PAC file → Zscaler PSE (or Browser Access for ZPA-protected apps) |
| Specific apps requiring direct internet | Direct-route / bypass list in ZCC config |

ZCC's **forwarding profile** is what decides which paradigm applies in which situation — Trusted Networks (skip tunnel, use PAC), Untrusted Networks (Z-Tunnel), captive portal (grace period), etc. See [`../../zcc/forwarding-profile.md`](../../zcc/forwarding-profile.md).

## Mental model — the layer-of-abstraction view

```
HTTP/HTTPS request   ←─ Proxy operates here (application layer)
─────────────────────────
TCP / UDP            ←─ Tunnel CAN operate here (transport-layer tunnel)
─────────────────────────
IP packet            ←─ Tunnel typically operates here (IP-layer tunnel)
─────────────────────────
Ethernet frame       ←─ Gateway / direct route operates here
```

A proxy understands the most about your traffic (knows the URL, the headers, the body). A tunnel understands less but can carry more (any IP packet). A gateway understands the least (just routing) but is most transparent.

## Surprises / common confusions

1. **"VPN" is ambiguous.** Could mean a TLS-VPN like Z-Tunnel 1.0, an IPSec VPN, a SSL-VPN appliance, even SD-WAN tunnels. When someone says "we're using a VPN," ask "which kind."

2. **"Proxy" is ambiguous.** Could mean an explicit proxy (browser configured to use it), a transparent proxy (intercepting at the network), or a reverse proxy (server-side, hides backend servers). Context disambiguates.

3. **"Tunnel" implies encryption to most people.** Strictly, GRE has no encryption. IPSec adds it. Z-Tunnel does. But "tunnel" alone doesn't guarantee encryption — verify the protocol.

4. **TLS is both an encryption protocol and a tunneling protocol.** TLS encrypts HTTP into HTTPS (encryption). TLS-VPNs (like Z-Tunnel 1.0) carry arbitrary IP packets inside TLS connections (tunneling). Same protocol, two roles.

5. **An HTTPS connection through a proxy isn't tunneled in the gateway sense.** The browser uses HTTP `CONNECT` to ask the proxy to relay raw TCP bytes. The proxy doesn't decrypt TLS unless explicitly doing SSL inspection.

6. **ZCC traffic isn't always tunneled.** Depending on forwarding profile + network state, ZCC may use Z-Tunnel, may use a PAC file, may go direct, or may drop traffic. ZCC's job is *deciding which paradigm applies right now*, not always tunneling.

7. **Cloud Connector is a gateway, not a proxy.** It sits inline at the network layer for cloud workloads; doesn't terminate HTTP. Workloads talk to it transparently.

## Cross-links

- Networking basics (TCP/IP/ports/DNS): [`./networking-basics.md`](./networking-basics.md)
- ZCC forwarding profile decisions: [`../../zcc/forwarding-profile.md`](../../zcc/forwarding-profile.md)
- Z-Tunnel 1.0 vs 2.0 details: [`../../zcc/z-tunnel.md`](../../zcc/z-tunnel.md)
- PAC files: [`../../shared/pac-files.md`](../../shared/pac-files.md)
- Cloud Connector as inline gateway for workloads: [`../../cloud-connector/overview.md`](../../cloud-connector/overview.md)
- Zero-trust mental model (different lens, same architecture): [`./zero-trust.md`](./zero-trust.md)
