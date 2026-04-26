---
product: zia
topic: "traffic-forwarding-methods"
title: "Traffic forwarding methods — GRE / IPsec / PAC / ZCC choice and mechanics"
content-type: reasoning
last-verified: "2026-04-25"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/understanding-generic-routing-encapsulation-gre.md"
  - "vendor/zscaler-help/best-practices-deploying-gre-tunnels.md"
  - "vendor/zscaler-help/gre-deployment-scenarios.md"
  - "vendor/zscaler-help/choosing-traffic-forwarding-methods.md"
  - "vendor/zscaler-help/using-custom-pac-file-forward-traffic-zia.md"
  - "vendor/zscaler-help/about-z-tunnel-1.0-z-tunnel-2.0.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/gre_tunnel.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/traffic_vpn_credentials.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/traffic_static_ip.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/pac_files.py"
  - "vendor/terraform-provider-zia/zia/resource_zia_traffic_forwarding_gre_tunnels.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_traffic_forwarding_vpn_credentials.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_traffic_forwarding_static_ips.go"
author-status: draft
---

# Traffic forwarding methods — GRE / IPsec / PAC / ZCC choice and mechanics

This doc covers how traffic gets **into** ZIA from a customer location or endpoint — the ingestion layer. It does not cover Forwarding Control policy, which governs where ZIA sends traffic after inspecting it (ZPA via SIPA, DIRECT, DROP, etc.) — see [`./forwarding-control.md`](./forwarding-control.md).

## The four methods at a glance

| Method | Termination point | Identity anchor | Typical use |
|---|---|---|---|
| **GRE tunnel** | Router/SD-WAN → ZIA Public Service Edge VIP | Source public IP (static required) | High-throughput branch, ≥500 Mbps, no per-packet encryption needed |
| **IPsec tunnel** | Router/SD-WAN/firewall → ZIA Public Service Edge | IP-type credential (static IP) or UFQDN-type credential (FQDN, dynamic-IP-friendly) | Encrypted branch tunnel; smaller branches; dynamic-IP sites |
| **PAC file** | Browser/OS explicit proxy → ZIA Public Service Edge | User (via auth) or IP (via Surrogate IP); no location binding required | BYOD, web-only scenarios, no-tunnel environments, off-LAN managed devices |
| **ZCC** | Per-app ZCC agent → ZIA Public Service Edge | User + device identity; forwarding profile drives per-app rules | Mobile/remote users, off-network endpoints, full protocol forwarding |

Every method ultimately surfaces inside ZIA as a **Location** (or is associated with one). The Location is the forwarding-grouping primitive that all ZIA policy rules scope by. See [`./locations.md`](./locations.md) for the full Location/Sublocation/Location Group model.

---

## GRE tunnel

### When to use

GRE is a tunneling protocol for encapsulating packets inside IP with a 4-byte header overhead. It functions like a VPN but **without encryption** — a router encapsulates internet-bound packets and sends them to Zscaler's Public Service Edge VIP. This is acceptable when the path from the branch to Zscaler already traverses a private network (MPLS, SD-WAN overlay) or when the compliance model does not require in-flight encryption of internet-bound traffic.

Best fit: corporate branch offices with routers that support GRE, ≥500 Mbps throughput needs, and a static public egress IP.

### Static IP requirement

The source IP of the GRE tunnel is the Location identifier. Zscaler matches inbound GRE traffic to a location by the tunnel's source IP. A static IP is required — a dynamic IP would cause the location binding to fail when the IP changes. The static IP is registered as a `TrafficStaticIP` object and then referenced by the tunnel and its parent Location.

SDK: `client.zia.traffic_static_ip.list_static_ips(query_params={"available_for_gre_tunnel": True})` — filters to IPs not yet assigned to a tunnel.

### Bandwidth limits (Tier A — sourced from help captures)

| Condition | Max per tunnel |
|---|---|
| Internal endpoint IPs **not NATed** | **1 Gbps** |
| Internal endpoint IPs **NATed** | **250 Mbps** |

The limit exists because Zscaler load-balances GRE traffic by the encapsulated inner source IP. When the inner IP is NATed, all traffic appears to come from the same source → load balancer cannot spread it across nodes → bottleneck at 250 Mbps. For sites needing >1 Gbps, use multiple tunnels with different public source IPs (2 Gbps = 2 primary + 2 backup tunnels, each from a distinct public IP).

When running multiple source IPs for throughput scaling, maintain **client persistence** at the load-balancer or ECMP layer — a server that tracks session state will reject connections that arrive from a different egress IP mid-session.

### MTU / fragmentation (Tier A — Zscaler-authored)

GRE adds a 4-byte header. Mismatched MTU causes fragmentation and degrades performance. Correct calculation for a 1,500-byte WAN interface:

```
WAN MTU  = 1500
GRE MTU  = 1500 - IP(20) - GRE(4) = 1476
GRE MSS  = 1476 - IP(20) - TCP(20) = 1436
```

Set MSS clamping on the GRE tunnel interface to 1436. Failing to clamp MSS is a common cause of "browsing works but large file transfers hang" complaints under GRE.

### Primary / secondary tunnel and DC selection

Each GRE tunnel has a `primary_dest_vip` and `secondary_dest_vip` — references to Zscaler VIP objects that identify the destination data center. The SDK auto-selects the closest diverse VIPs by city if none are specified at tunnel-create time (`get_closest_diverse_vip_ids`). The `within_country` flag restricts VIP selection to DCs in the same country as the source IP. The `ip_unnumbered` flag supports SD-WAN automated provisioning where internal IP addressing is not assigned.

Premium/surcharge data centers are excluded from the VIP picker UI — they require a Support ticket.

### HA model

Zscaler's recommended model:

1. Two GRE tunnels per location — primary to DC-A, secondary to DC-B (different city).
2. GRE keepalives on the tunnel interface to detect tunnel-level failure.
3. Layer 7 health checks (Cisco IP SLA, Juniper RPM) against `http://gateway.<cloud>.net/vpntest` to detect service failure beyond the tunnel. **Do not use `www.google.com` as the health-check target** — this causes Google to rate-limit or CAPTCHA ZIA egress IPs.
4. Failover timing tradeoffs: fast failover (30–42 s worst case, higher false-positive risk) vs conservative (120–185 s worst case, lower false-positive risk, L7 test). See `best-practices-deploying-gre-tunnels.md` for full Cisco IPSLA config examples.

### Scenario variants

- **Internal router (preferred):** GRE from a router behind the firewall. Firewall allows GRE outbound. This preserves inner IP visibility for sublocation matching and per-user logging.
- **Border router:** GRE from the border router. Must disable NAT on the firewall to preserve inner IPs; may conflict with other firewall requirements.
- **Explicit proxy via GRE (no-default-route):** use Global PSE IPs (documented in `gre-deployment-scenarios.md`) for sites that have no default internet route and must proxy through Zscaler explicitly.

### API objects

- `GET/POST/PUT /zia/api/v1/greTunnels` — tunnel CRUD.
- `GET /zia/api/v1/vips/recommendedList` — VIP recommendation.
- `GET /zia/api/v1/vips/groupByDatacenter` — VIPs grouped by DC.
- `GET /zia/api/v1/orgProvisioning/ipGreTunnelInfo` — IP-to-tunnel mapping.
- Terraform: `resource_zia_traffic_forwarding_gre_tunnels.go`, `data_source_zia_traffic_forwarding_gre_tunnels.go`.

---

## IPsec tunnel

### When to use vs GRE

IPsec adds encryption overhead vs GRE. Use IPsec when:
- The path to Zscaler traverses the public internet and traffic must be encrypted in flight.
- The branch has a dynamic IP (UFQDN credential type supports dynamic IPs without requiring a static registration).
- The branch is smaller and throughput requirements don't justify managing multiple GRE tunnels.
- The router/firewall supports IKE/IPsec natively but not GRE.

### The VPN credential object — separate from the Location

IPsec in ZIA uses a **VPN credentials object** (`TrafficVPNCredentials`) that is provisioned independently of the Location and then attached to it. The `type` enum (per `traffic_vpn_credentials.py:46`) accepts four values:

| Type | Identifier | IP requirement | Notes |
|---|---|---|---|
| `IP` | Source IP address | Static IP required; IP is the IKE peer identifier | Standard IPsec branch tunnel |
| `UFQDN` | FQDN string (e.g., `branch@corp.example.com`) | No static IP required; FQDN is the IKE identifier | Dynamic-IP branch tunnel |
| `CN` | X.509 Common Name | Cert-based identifier | Less common; legacy / cert-based deployments |
| `XAUTH` | XAUTH challenge identifier | — | Legacy; appears in pre-modern-IKEv2 deployments |

`IP` and `UFQDN` are the standard production types. `CN` and `XAUTH` exist at the API level — operators may see them in snapshot JSON for legacy tenants but they're not the recommended path for new deployments. The Zscaler-authored deployment guides focus on `IP` and `UFQDN`.

The credential carries the `pre_shared_key` (PSK) for IKEv1/IKEv2 PSK-based authentication. Certificate-based auth via the `CN` type is implied but specifics are not confirmed by any vendored capture; Zscaler-authored IPsec configuration guides would supplement this.

Key SDK constraints (sourced from `traffic_vpn_credentials.py` and TF resource):
- `type` and `fqdn`/`ip_address` are **immutable after creation** — changing either requires deleting and recreating the credential.
- Bulk-delete endpoint caps at 100 credential IDs per call.
- `pre_shared_key` is write-only (sensitive); not returned on read.

### IKE / phase details (Tier D — no Zscaler-authored IPsec capture in repo)

No dedicated IPsec configuration capture is vendored. The following is inferred from general IKEv2 behavior and Zscaler's published compatibility notes elsewhere in the ecosystem:

- ZIA Public Service Edges accept IKEv1 and IKEv2. IKEv2 is preferred.
- Phase 1 and Phase 2 cipher requirements are documented in Zscaler's IPsec Configuration Guide (not captured here). **Treat specific cipher suite lists as unverified until cross-checked against the live help portal.**
- IPsec adds overhead (ESP header ~50–80 bytes depending on cipher + NAT-T). MTU implications are similar to GRE but higher: plan for effective payload MTU of ~1380–1420 bytes depending on AES mode and whether NAT-T (UDP 4500) is in use.

**Source gap:** no `vendor/zscaler-help/` capture covers IPsec tunnel provisioning specifics. Zscaler-authored capture would supplement IKE phase parameters, supported cipher suites, and NAT-T behavior.

### API objects

- `GET/POST/PUT /zia/api/v1/vpnCredentials` — credential CRUD.
- `POST /zia/api/v1/vpnCredentials/bulkDelete` — bulk delete (≤100 IDs).
- Terraform: `resource_zia_traffic_forwarding_vpn_credentials.go`.

---

## PAC file

### When PAC is the right choice

PAC (Proxy Auto-Config) is a JavaScript function (`FindProxyForURL`) distributed to browsers or OS proxy settings. The browser calls the PAC URL to determine per-request whether to use a proxy (Zscaler's explicit proxy gateway) or go direct. Use PAC when:
- Tunnel provisioning is not possible (cloud-hosted, SaaS-only, no VPN-capable router).
- BYOD or guest devices cannot install a VPN client.
- Only web/browser traffic (HTTP/HTTPS) needs to be inspected — PAC is browser-aware only.
- ZCC is not deployed and GRE/IPsec tunnels are not available.

### PAC vs explicit proxy

A bare PAC file delivers traffic as HTTP CONNECT or plain HTTP to Zscaler's explicit proxy port. This is "explicit proxy mode" in ZIA's forwarding context, which has two important policy implications:
1. SSL inspection rules match on SNI only (not destination IP) — the Miscellaneous Or Unknown over-exemption footgun that exists under transparent/tunnel forwarding does not apply. See [`./ssl-inspection.md §Transparent vs explicit`](./ssl-inspection.md).
2. Z-Tunnel 1.0 / Z-Tunnel 2.0 CONNECT User-Agent criteria in SSL Inspection rules only work under explicit proxy mode — not under transparent/tunnel forwarding.

### Hosted PAC files

ZIA provides a hosted PAC file service at `gateway.<cloud>.net/proxy.pac` (the default PAC). Operators can also upload and manage **custom PAC files** in the ZIA Admin Portal. Key limits:

| Limit | Default | Maximum (via Support ticket) |
|---|---|---|
| PAC files per org | 256 | 1,024 |
| Size per PAC file | 256 KB | 2 MB |
| Versions per PAC file | 10 | 10 (fixed) |

Custom PAC files support staging (version states: `DEPLOYED`, `STAGE`, `LKG` — Last Known Good). The SDK's `add_pac_file()` call validates syntax before upload; validation is also available standalone via `validate_pac_file()`.

**Operational warning:** PAC file changes take effect immediately for all users — there is no staged rollout at the Zscaler side (staging is pre-deployment, not a canary mechanism). Apply changes in a maintenance window; keep a backup copy of the prior version.

SDK: `client.zia.pac_files` — list, get, add, clone, validate, update (action: DEPLOY / STAGE / LKG / UNSTAGE / REMOVE_LKG), delete.

Terraform: no `resource_zia_traffic_forwarding_pac_files` resource found in the vendored provider — PAC file management via TF may not be supported; use SDK/API or the Admin Portal.

### Limitations

- **Browser-aware only.** PAC only intercepts traffic that the browser/OS proxy stack handles. Non-browser apps (thick clients, system services, ICMP, UDP) bypass PAC entirely.
- **No UDP.** Explicit proxy is TCP-only. Real-time protocols (RTP, QUIC, DNS-over-UDP) are invisible to PAC-forwarded sessions.
- **No non-HTTP protocols.** FTP, SSH, SMTP, etc. are not redirected by PAC.
- **Auth challenges.** When `Enforce Authentication` is on for the location, browsers receive a 407 Proxy Authentication Required challenge. Browser behavior varies — modern browsers handle NTLM/Kerberos proxy auth natively, but some app-embedded browsers and non-browser HTTP clients fail silently or show repeated prompts. Pre-authenticating via ZCC eliminates this.
- **Location binding not required.** PAC-forwarded traffic can reach ZIA without a pre-configured Location if it arrives from a known-authenticated user. However, without a Location, location-scoped policy doesn't apply and reporting granularity is reduced.

---

## ZCC (Zscaler Client Connector)

### When ZCC is the right choice

ZCC is the per-endpoint agent for mobile, remote, and off-network users. Use ZCC when:
- Users roam off the corporate network and GRE/IPsec tunnels don't follow them.
- Full protocol coverage is needed (not just browser traffic) — ZCC with Z-Tunnel 2.0 forwards all ports and protocols via DTLS or TLS.
- Per-app forwarding rules are needed (route app X to ZIA, app Y to ZPA, app Z direct).
- Device trust posture needs to gate access decisions.
- On-network users are covered by GRE/IPsec but ZCC provides a second-layer fallback.

### Tunnel modes

Z-Tunnel 1.0 forwards traffic via CONNECT requests (explicit proxy semantics; proxy-aware apps only; ports 80/443). Z-Tunnel 2.0 uses DTLS/TLS to tunnel all ports and protocols; requires a single-IP NAT device to avoid control/data connection splitting across Service Edges. See [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md) for mechanism depth and bypasses configuration.

Forwarding profiles control per-app routing, tunnel mode selection, trusted network detection (on-network → ZCC may defer to GRE), and ZPA app segment forwarding. See [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md).

---

## Choosing among the four — decision tree

The `choosing-traffic-forwarding-methods.md` capture enumerates the methods but does not include a structured decision tree. The following is synthesized from the GRE/PAC/ZCC captures plus general product behavior. **Treat as Tier B (corroborated by multiple sources) for the first two branches; Tier C (single-source inference) for finer points.**

```
Is this a fixed-location site with a router/SD-WAN that supports GRE or IPsec?
│
├─ YES → Is throughput ≥500 Mbps or encryption in flight not required?
│          ├─ High throughput / no encryption needed → GRE tunnel
│          │    (static IP required; scale with multiple source IPs above 1 Gbps)
│          └─ Encrypted tunnel needed or dynamic IP → IPsec tunnel
│               (UFQDN credential for dynamic IP; IP credential for static)
│
└─ NO → Is this an endpoint (laptop, mobile) or a location that can't host a tunnel?
         ├─ Managed endpoint, full protocol coverage needed → ZCC
         │    (Z-Tunnel 2.0 for all-protocol; Z-Tunnel 1.0 for proxy-aware only)
         ├─ Managed endpoint, web-only acceptable → ZCC or PAC
         │    (ZCC preferred for user identity + device trust; PAC if ZCC not deployable)
         └─ BYOD / guest / unmanaged endpoint → PAC file
              (no agent install possible; browser-proxy only; authentication via 407)
```

**Common combined patterns:**

- Corporate branch = GRE (or IPsec) + ZCC for users who take laptops off-site.
- Small/remote office with dynamic IP = IPsec (UFQDN credential) + ZCC fallback.
- Cloud workloads = Cloud Connector (separate product — not covered here).
- Pure SaaS / no-infrastructure tenant = PAC + ZCC; no tunnel provisioning required.

Zscaler explicitly recommends combining GRE + PAC + Surrogate IP + ZCC as the full-coverage model for enterprise deployments (sourced from `understanding-generic-routing-encapsulation-gre.md`).

---

## Common interactions and failure modes

### GRE + Z-Tunnel 2.0 incompatibility

Z-Tunnel 2.0 requires a NAT device that uses a **single IP for all connections from a single device**. When a site uses GRE tunnels with ECMP or multiple egress IPs, Z-Tunnel 2.0 control and data connections can land on different Service Edges — this causes Z-Tunnel 2.0 to fail and fall back to Z-Tunnel 1.0 silently. If an on-network user's ZCC is unexpectedly operating in Z-Tunnel 1.0 mode, check the NAT/ECMP configuration on the GRE egress path. Source: `about-z-tunnel-1.0-z-tunnel-2.0.md`; cross-listed in [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md).

### IPsec MTU vs GRE

IPsec ESP adds ~50–80 bytes of overhead (more than GRE's 4 bytes). On a 1500-byte WAN MTU, effective IPsec payload MTU is typically ~1380–1420 bytes depending on cipher and NAT-T presence. MSS clamping on the IPsec tunnel interface is equally critical as on GRE. Failing to set MSS under IPsec more commonly causes large-transfer failures than under GRE because the overhead is higher. **Exact overhead values are Tier D (inferred from ESP + IKEv2 protocol knowledge; Zscaler-authored IPsec guide would confirm).**

### PAC + authentication challenges

When `Enforce Authentication` is enabled on the location/sublocation that PAC-forwarded traffic hits, browsers receive a 407 Proxy Authentication Required. Kerberos and NTLM proxy auth work transparently in IE/Edge on domain-joined Windows machines. Chrome and Firefox on non-domain-joined machines prompt interactively. Non-browser applications using the system proxy often fail silently or loop on 407. Mitigation: deploy ZCC for managed devices (ZCC handles auth internally) and reserve PAC for scenarios where ZCC is not deployable.

### PAC CONNECT User-Agent criterion in SSL rules

SSL Inspection rules with `CONNECT User-Agent` criteria only match explicit-proxy (PAC) traffic — not transparent-proxy (GRE/IPsec tunnel) traffic. A rule scoped to `CONNECT User-Agent = ZCC` will silently not fire for traffic arriving via GRE tunnels. Source: [`./ssl-inspection.md`](./ssl-inspection.md).

### Mixed deployments

Large enterprises often run GRE at main offices, IPsec at smaller branches (dynamic IPs), PAC for SaaS-only remote sites, and ZCC on mobile users — all within the same tenant. Each method creates a separate Location (or shares one via Surrogate IP for PAC users). Policy rules that scope by Location Group work correctly across mixed deployments as long as Location Group membership is curated. Watch for:
- **Dynamic Location Groups that accidentally pull in the wrong methods** — e.g., a group requiring "SSL Inspection = on" may match both GRE locations and ZCC-equivalent implicit locations; ensure the group's attribute conditions are specific.
- **Sublocation `other` catching mixed method traffic** — if a GRE location and its sublocations are defined but PAC-forwarded traffic from the same IP block arrives (e.g., a user on a guest network using PAC), it may hit the `other` sublocation and receive default policy. Audit `other` sublocation policy for GRE locations that co-exist with PAC-forwarded users.

---

## Cross-links

- Location / Sublocation / Location Group model (prerequisite) — [`./locations.md`](./locations.md)
- Post-inspection forwarding decisions (ZPA / DIRECT / DROP) — [`./forwarding-control.md`](./forwarding-control.md)
- SSL inspection — transparent vs explicit forwarding, SNI-only vs IP+SNI matching — [`./ssl-inspection.md`](./ssl-inspection.md)
- ZCC Z-Tunnel 1.0 vs 2.0 mechanics — [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md)
- ZCC Forwarding Profile — per-app routing, trusted networks, ZPA segment forwarding — [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)
- Cloud architecture — Public Service Edges, VIPs, data center topology — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
- Shared PAC file reasoning — [`../shared/pac-files.md`](../shared/pac-files.md)
