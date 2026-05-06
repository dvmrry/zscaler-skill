---
product: shared
topic: "pac-files"
title: "PAC files — the forwarding layer that touches every product"
content-type: reasoning
last-verified: "2026-05-06"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-pac-file.md"
  - "vendor/zscaler-help/about-hosted-pac-files.md"
  - "vendor/zscaler-help/writing-pac-file.md"
  - "vendor/zscaler-help/best-practices-writing-pac-files.md"
  - "vendor/zscaler-help/using-default-zscaler-kerberos-pac-file.md"
  - "vendor/zscaler-help/using-custom-pac-file-forward-traffic-zia.md"
  - "vendor/zscaler-help/url-format-guidelines.md"
  - "vendor/zscaler-help/understanding-subclouds.md"
  - "vendor/zscaler-help/Traffic_Forwarding_in_ZIA_Reference_Architecture.txt"
author-status: draft
---

# PAC files — the forwarding layer that touches every product

PAC (Proxy Auto-Config) files are JavaScript programs that tell a client where to send outbound web traffic. Every Zscaler forwarding path that doesn't originate from a tunnel (GRE, IPSec, ZCC Z-Tunnel) uses a PAC file — and even tunnel deployments often pair with a PAC for road-warrior coverage. The skill cites "PAC" across 8+ docs; this is the consolidated reference.

## PAC file fundamentals

A PAC file defines a single JavaScript function `FindProxyForURL(url, host)` that returns a string telling the browser how to handle each request. (Tier A — vendor/zscaler-help/understanding-pac-file.md.)

**Return values:**

| Return string | Effect |
|---|---|
| `"DIRECT"` | Connect directly to the destination, bypassing any proxy |
| `"PROXY host:port"` | Route through the specified proxy |
| `"PROXY host:port; DIRECT"` | Try proxy first; fall back to DIRECT if proxy unreachable |
| `"PROXY h1:p1; PROXY h2:p2; DIRECT"` | Try each in order; fall back to DIRECT |

**Key PAC functions:**

| Function | Purpose | Performance note |
|---|---|---|
| `shExpMatch(host, pattern)` | Shell-style wildcard match (uses `*` and `?`) | Fast — no DNS |
| `isInNet(host, net, mask)` | Check if host IP is in a subnet | May do DNS if `host` is not an IP |
| `dnsDomainIs(host, domain)` | Check if host ends in domain | Fast — no DNS |
| `localHostOrDomainIs(host, hostdom)` | Check if host is local or in domain | Fast |
| `dnsResolve(host)` | Resolve hostname to IP | Slow — DNS lookup per call |
| `isResolvable(host)` | Check if hostname resolves | Slow — DNS lookup per call |

PAC files execute **serially per request**. Every browser request triggers a `FindProxyForURL` call. DNS-resolving functions (`dnsResolve`, `isResolvable`, `isInNet` with hostname args) add round-trip latency to every page load that hits those branches.

**No regex in standard PAC.** The standard PAC specification does not include regex support. `shExpMatch` uses shell glob patterns, not POSIX regex. Browsers may expose a `regExpMatch` extension but it is not portable. Use `shExpMatch` for pattern matching.

## The four default Zscaler-hosted PACs

Zscaler generates and hosts four master PAC files. They are **non-editable** — to customize, clone and upload as a custom PAC. (Tier A — vendor/zscaler-help/about-hosted-pac-files.md.)

| PAC | Purpose | Default port |
|---|---|---|
| `recommended.pac` | General browser forwarding. Use this unless you have a reason not to. | 80 (or dedicated) |
| `proxy.pac` | Legacy/simpler variant. | 80 |
| `mobile_proxy.pac` | Mobile device forwarding. | 80 |
| `kerberos.pac` | For tenants using Kerberos authentication — forces FQDN addressing (`${GATEWAY_HOST}` rather than IP) so SPNs resolve. | 8800 (Kerberos challenge port) |

Any tenant that enables Kerberos must use `kerberos.pac` (or a clone), even if traffic is also forwarded via IPSec/VPN tunnel. See Kerberos PAC section below.

## How the PAC gets to a client — server-side variable substitution

The browser is configured with a **Hosted URL** pointing at the PAC. On each fetch: (Tier A — vendor/zscaler-help/understanding-pac-file.md.)

1. Client browser requests the PAC URL (HTTP or HTTPS; HTTPS recommended).
2. Zscaler's PAC server runs **geolocation** against the client's source IP to find the nearest Public Service Edge (PSE).
3. Before returning the PAC body, Zscaler performs **server-side variable substitution** — inserting the current PSE IPs / FQDNs into the file.
4. Client executes the returned JavaScript to decide routing per request.

**Variable substitution only works when the PAC is Zscaler-hosted.** If you copy a PAC to your own web server, `${GATEWAY}` becomes a literal string, not an IP. Self-hosting a PAC means losing the geolocation and failover benefits. **Self-hosted PAC over HTTPS** also requires the browser to trust the cert chain — self-signed certs cause silent PAC fetch failure and browsers fall back to no-proxy mode (Tier B — standard browser behavior, not Zscaler-specific).

### PAC fetch frequency, caching, and propagation

Browser PAC caching is governed by HTTP response headers (`Cache-Control`, `Expires`, `Last-Modified`, ETag). Most browsers re-evaluate their PAC every few minutes to a few hours — exact behavior is browser-specific and depends on the headers Zscaler's PAC server returns. **The specific cache headers Zscaler-hosted PAC URLs send are not captured in available vendor documentation** (Tier D). Operationally observed: PAC changes can take **minutes to ~1 hour** to fully propagate across a tenant's user base. (Tier C — operational lore consistent with browser PAC caching norms; see [`shared-24`](../_meta/clarifications.md#shared-24--zscaler-hosted-pac-cache-headers-and-client-refresh-behavior).)

**Forced refresh:** Restarting the browser or clearing the PAC cache (browser-specific) forces a fresh fetch. ZCC's PAC mode behavior on PAC change is also undocumented — whether ZCC respects HTTP cache headers or polls on its own schedule is in the same clarification.

### The Zscaler-specific variables

| Variable | Substituted with |
|---|---|
| `${GATEWAY}` | Primary PSE IP address |
| `${SECONDARY_GATEWAY}` | Secondary PSE IP address |
| `${GATEWAY_HOST}` | Primary PSE **FQDN** (required by Kerberos) |
| `${SECONDARY_GATEWAY_HOST}` | Secondary PSE FQDN |
| `${GATEWAY_FX}` | Primary PSE IP used in **manual-failover** templates |
| `${SECONDARY_GATEWAY_FX}` | Secondary PSE IP, manual-failover variant |
| `${GATEWAY.<subcloud>.<cloud>.net}` | Subcloud-scoped primary PSE |
| `${SECONDARY.GATEWAY.<subcloud>.<cloud>.net}` | Subcloud-scoped secondary PSE |

The `_FX` suffix variant is used when the PAC author wants to force a specific proxy order in the `PROXY` return list. Default `${GATEWAY}` and `${SECONDARY_GATEWAY}` are correct for normal automatic-failover usage.

### Manual-failover syntax

The standard automatic failover is: primary PSE → secondary PSE when primary is unreachable. To force failover for other reasons (ISP issues, latency): (Tier A — vendor/zscaler-help/writing-pac-file.md.)

```javascript
return "PROXY ${SECONDARY_GATEWAY_FX}:80; PROXY ${GATEWAY_FX}:80; DIRECT";
```

The order of the `PROXY` clauses determines try-order. Subcloud variant:

```javascript
return "PROXY ${SECONDARY.GATEWAY.<Subcloud>.<Zscaler Cloud>.net_FX}:80; PROXY ${GATEWAY.<Subcloud>.<Zscaler Cloud>.net_FX}:80; DIRECT";
```

## Hosted PAC file management

### Limits

| Limit | Default | Max (Zscaler Support ticket) |
|---|---|---|
| PAC files per organization | 256 | 1,024 |
| Size per PAC file | 256 KB | 2 MB |
| Versions per PAC | 10 | 10 (cap) |
| Non-ASCII characters | 12% of file size (binary) | n/a |

10-version history enables staged rollouts — author a new version, test via a small population, promote to current. There is no native canary or percentage-rollout primitive; staging is done by pointing selected users at a versioned URL.

**Rollback procedure:** the **Currently Deployed Version** field on the Hosted PAC Files page can be set to any of the 10 retained versions, making rollback a single-field change rather than a re-upload. (Tier A — `vendor/zscaler-help/about-hosted-pac-files.md`, *Currently Deployed Version*.) Combined with the immediate-propagation behavior, this is the fastest revert path when a deployed PAC breaks something.

**Operational telemetry:** the Hosted PAC Files page exposes a **Number of Hits** column showing how many times each PAC was hit in the last 30 days (Tier A — `vendor/zscaler-help/about-hosted-pac-files.md`). Useful for confirming a PAC URL is actually being fetched by clients, or for detecting orphaned PAC URLs no one fetches anymore.

The 12% non-ASCII cap is rarely-discussed but real: PAC files with verbose Unicode comments, non-English hostnames, or BOM markers can silently fail save validation.

### API surface for hosted PAC management

The ZIA Admin Portal hosts PAC management at Administration > Hosted PAC Files. Operations available (Tier A — vendor/zscaler-help/about-hosted-pac-files.md):
- Add a custom PAC file
- View, preview, export (text / `.pac` / `.js`)
- Manage up to 10 versions per PAC file
- Set currently deployed version
- Delete

PAC file status values:
- `Verified` — syntax valid
- `Error-Accepted` — has errors; admin accepted and saved with errors at verification time

**PAC changes are immediate.** The moment you save a new PAC version as "currently deployed," all browsers fetching that URL get the new content on their next refresh cycle. No staged-vs-live gate. Test on a local machine and in a canary group first. Zscaler highly recommends saving a copy of the current PAC before applying changes. (Tier A — vendor/zscaler-help/using-custom-pac-file-forward-traffic-zia.md.)

### Obfuscate URL — strongly recommended

The final piece of deploying a custom PAC file is obfuscating the URL of the PAC file. Because this file must be made public for your users' machines to access, anyone who has the URL can access the content. This can contain information you don't want to be public (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1557`).

The ZIA Admin Portal generates a URL for your use when you enable **Obfuscate URL** (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1559`).

**Zscaler strongly recommends enabling Obfuscate URL** (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1560`).

**Caveat**: when you enable obfuscation, you need to update your client machines to the new URL location. Until that occurs, your users use the default system PAC file. This can lead to issues with accessing resources until the client device is updated (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1563`).

## The Kerberos PAC file vs standard PAC

Key differences of the Kerberos PAC: (Tier A — vendor/zscaler-help/using-default-zscaler-kerberos-pac-file.md.)

- Uses `${GATEWAY_HOST}` and `${SECONDARY_GATEWAY_HOST}` (FQDN variables, not IP) — required because Kerberos SPNs are bound to FQDNs.
- Forwards traffic to **port 8800** — the Kerberos challenge port on ZIA Public Service Edges. ZIA PSEs challenge all traffic received on port 8800 for a Negotiate Authentication (Kerberos) ticket.
- **Must be used by all Kerberos-enabled users**, even if their location has an IPSec or VPN tunnel configured.

**KDC proxy bypass requirement:** If the organization has a KDC proxy (e.g., Microsoft DirectAccess) deployed for road-warrior access, KDC proxy traffic sent to the ZIA PSE will cause authentication failure. Add a PAC rule to bypass it:

```javascript
if (shExpMatch(host, "kdcproxy.domain.com")) return "DIRECT";
```

**Realm bypass requirement:** Do not forward traffic destined within the realm (AD/intranet hostnames) to the ZIA PSE — the PSE will challenge realm-internal traffic for a Zscaler Kerberos ticket and fail. Add a DIRECT bypass for realm hosts before any Kerberos forwarding logic.

## Best practices for bypass lists (what to always bypass)

Based on vendor/zscaler-help/best-practices-writing-pac-files.md and common deployment patterns:

**Always bypass via DIRECT:**
- Private IP ranges: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.1`, `localhost`
- Realm/internal domain traffic (Active Directory, intranet hostnames)
- KDC proxy hosts (Kerberos deployments)
- Zscaler service IPs themselves (avoid proxy loops)
- Any internal certificate authority or OCSP endpoints

**Pattern for private IP bypass:**

```javascript
function FindProxyForURL(url, host) {
  var lhost = host.toLowerCase();
  host = lhost;
  if (isInNet(host, "10.0.0.0", "255.0.0.0") ||
      isInNet(host, "172.16.0.0", "255.240.0.0") ||
      isInNet(host, "192.168.0.0", "255.255.0.0") ||
      isInNet(host, "127.0.0.0", "255.255.255.0"))
    return "DIRECT";
  // ... remaining logic
  return "PROXY ${GATEWAY}:80; PROXY ${SECONDARY_GATEWAY}:80; DIRECT";
}
```

## PAC file syntax gotchas

### Performance considerations

(Tier A — vendor/zscaler-help/best-practices-writing-pac-files.md.)

- **OR-heavy PACs are slow.** PACs execute serially. A naive "100 OR conditions" pattern parses every one on every request. Group by outer `if` (match `*.google.com` once, then 10 specific patterns inside) and put high-probability checks at the top.
- **Avoid `dnsResolve()` and `isResolvable()` except where necessary** — DNS inside a PAC is a hot-path dependency. These calls block the browser until DNS resolves.
- **Group similar exceptions into a bigger `if` loop** instead of using many OR statements. Example: instead of checking 10 `xyz.google.com` hosts in a big OR, use an outer `if` that tests `*.google.com` and then the 10 specific hosts inside.
- **Place high-probability checks at the beginning.** Put private IP checks and common internal domains at the top so they short-circuit before reaching the main forwarding logic.

### Case sensitivity

Some browsers may execute PAC files in a case-sensitive manner. Add this at the top to lowercase everything at execution: (Tier A — vendor/zscaler-help/best-practices-writing-pac-files.md.)

```javascript
var lhost = host.toLowerCase();
host = lhost;
```

### Authoring environment

- Use a simple text editor. Avoid Microsoft Office Word — smart quotes and special characters will break the PAC file.
- Every opening curly bracket needs a corresponding closing bracket. One of the most common mistakes in building PAC files is losing count of brackets.
- Comments must use `//` — the standard JavaScript single-line comment syntax.
- Avoid using external or global variables and functions.

### Fallback chain design

The `PROXY h1:p1; PROXY h2:p2; DIRECT` pattern is the correct fallback chain. The browser tries each proxy in order; if none respond, it falls back to `DIRECT`. Only include `DIRECT` as a final fallback if direct-to-internet access is acceptable for the traffic category — for corporate traffic that should always go through ZIA, omit `DIRECT` or the last entry will silently bypass inspection.

## Subclouds and PAC variables

A **subcloud** is a tenant-level restriction that limits which PSEs serve the tenant. When a tenant uses a subcloud, the PAC must reference the subcloud-qualified variable form to pin traffic to the subcloud: (Tier A — vendor/zscaler-help/understanding-subclouds.md.)

```
${GATEWAY.<Subcloud>.<Zscaler Cloud>.net}
```

The unqualified `${GATEWAY}` on a subcloud tenant may resolve to geolocation-default PSEs that are outside the subcloud. Tenants who believe they have EU-only traffic but find US PSEs in their logs usually have an unqualified `${GATEWAY}` in their PAC. See [`./subclouds.md`](./subclouds.md) for full subcloud mechanics.

## WPAD (Web Proxy Auto-Discovery)

WPAD is the standard mechanism for distributing a PAC URL to clients automatically — DNS-based (`http://wpad.<domain>/wpad.dat`) or DHCP-based (option 252). Many enterprises rely on WPAD instead of pushing the explicit PAC URL via GPO / MDM.

**Vendor coverage gap:** Zscaler's available help-portal captures **do not document WPAD support, the `wpad.dat` MIME type, or DHCP option 252 patterns for Zscaler-hosted PACs**. Filed as [`shared-23`](../_meta/clarifications.md#shared-23--wpad-web-proxy-auto-discovery-support-with-zscaler-hosted-pacs). Tenants relying on WPAD typically self-host (losing variable substitution) or have configured a customer-side `wpad` DNS record returning the Zscaler-hosted PAC URL via HTTP redirect — the latter is operational lore, not vendor-documented. (Tier D.)

If WPAD is required, the operationally common patterns are:

1. **GPO/MDM-pushed explicit PAC URL** pointing at the Zscaler-hosted PAC (preserves variable substitution; bypasses WPAD entirely)
2. **DNS-based redirect**: customer's `wpad.<domain>` DNS record points at an internal web server that issues an HTTP 302 to the Zscaler-hosted PAC URL (preserves variable substitution since the browser ultimately fetches from Zscaler)
3. **Self-hosted PAC at `wpad.<domain>`**: simplest but loses variable substitution and geolocation benefits

## PAC mode authentication flow

When a browser configured with a PAC URL forwards a request to the Zscaler PSE, the PSE applies the same authentication policy as any other forwarding method. The flow follows the model in [`../zia/authentication.md`](../zia/authentication.md): SAML SSO redirect (browser → IdP → ZIA cookie), Hosted DB (form challenge), or Kerberos (transparent ticket on port 8800 if `kerberos.pac` is in use). **Surrogate IP** (per-location TTL-bound IP-to-user binding) is the primary identity-attribution mechanism for non-browser HTTP clients on the same source IP. (Tier A — see [`../zia/authentication.md § Surrogate IP`](../zia/authentication.md).)

**Vendor coverage gap on PAC-mode-specific challenge mechanics:** the precise sequence of HTTP 302 redirects, cookie-set-cookie behavior, and 407 Proxy-Authentication challenge handling for PAC-forwarded traffic vs Z-Tunnel-forwarded traffic is **not consolidated in any captured vendor doc**. The common ticket — repeated authentication challenges in PAC mode that don't occur in Z-Tunnel mode for the same user — is filed as clarification [`shared-25`](../_meta/clarifications.md#shared-25--pac-mode-authentication-handshake-specifics). (Tier D for the PAC-specific behavior; Tier A for the authentication-method enum and Surrogate IP mechanic.)

## PAC behavior with non-browser HTTP clients

PAC files are a browser-era specification, but enterprise apps increasingly run as non-browser HTTP clients (CLI tools, language-runtime HTTP clients, containerized workloads). PAC support varies sharply by client:

| Client | Typical PAC handling |
|---|---|
| `curl` | No native PAC support — must explicitly set `--proxy` to the PAC's resolved proxy or use a wrapper |
| Python `urllib` / `requests` | No native PAC support — environment variables (`HTTP_PROXY`, `HTTPS_PROXY`) only; `pypac` library exists as third-party |
| Node.js (default agent) | No native PAC support — `proxy-agent` library implements it |
| Java `HttpURLConnection` | Native PAC support via `ProxySelector.getDefault()` reading system PAC URL on Windows/macOS |
| .NET `HttpClient` | Reads system PAC URL on Windows by default; Linux/macOS varies |
| `apt`, `yum`, `dnf` | Proxy URL only — no PAC |
| Docker daemon | Proxy URL only — no PAC |
| Kubernetes pods | Proxy URL only — no PAC |

(Tier C — synthesized from widely-documented client-library behavior; not Zscaler-specific. Behavior in fast-evolving runtimes may shift.)

**Operational implication:** if your environment routes browser traffic via PAC but workloads (CI/CD agents, scripts, containerized services) need to traverse the same Zscaler proxy, those workloads need either explicit proxy configuration or Cloud Connector deployment instead. PAC-only environments leak workload traffic around Zscaler. Filed as [`shared-26`](../_meta/clarifications.md#shared-26--non-browser-http-client-pac-support-matrix-zscaler-side-recommendations) for whether Zscaler has formal recommendations on this.

## PAC + IPv6

The standard PAC `isInNet` function is **IPv4-only**. The IPv6-aware extension `isInNetEx(host, "fe80::/10")` exists but support varies across browsers (Tier B — Mozilla PAC documentation). Modern Chrome and Firefox support `isInNetEx`; older / niche browsers may not.

**Vendor coverage gap on Zscaler PAC + IPv6:** captured Zscaler PAC docs do not specify whether Zscaler-hosted PAC variables (`${GATEWAY}`, etc.) ever resolve to IPv6 addresses, whether IPv6 traffic is forwarded via PAC at all, or what the recommended IPv6-bypass pattern is for private IPv6 ranges. Filed as [`shared-27`](../_meta/clarifications.md#shared-27--zscaler-pac--ipv6-handling). (Tier D.)

For dual-stack environments, the operationally-conservative pattern is to bypass IPv6 to DIRECT until Zscaler IPv6 PAC behavior is confirmed:

```javascript
// Naive IPv6 detection — host string contains a colon
if (host.indexOf(":") !== -1) return "DIRECT";
```

(Tier C — defensive operational pattern.)

## How ZCC uses PAC files vs GRE/IPsec locations

ZCC has three forwarding action modes on a per-platform or per-policy basis: Z-Tunnel, PAC, and NONE. (Tier A — `references/zcc/forwarding-profile.md`.)

- **Z-Tunnel mode:** ZCC establishes a tunnel directly to Zscaler. PAC is not used for tunnel-forwarded traffic.
- **PAC mode:** ZCC reads the PAC and forwards per its instructions. This is the right mode for environments where a tunnel is not desired or where specific apps need proxy-chaining.
- **GRE/IPSec locations:** Site-level forwarding via tunnel. ZCC on devices at those sites may use Z-Tunnel or PAC for its portion of the traffic. PAC files are also deployed for browser-only users (no ZCC) at those sites.

For Kerberos deployments: even if a location uses IPSec or GRE tunnels, users at that location who authenticate via Kerberos must use the Kerberos PAC file for their browser traffic. The tunnel and the PAC coexist for those users.

For road warriors (off-network users): PAC files (via ZCC PAC mode or browser direct PAC URL) are the standard forwarding mechanism when no tunnel is active.

## Cross-product PAC coordination

PACs interact with sibling Zscaler products in ways that are easy to misconfigure. Three coordination points worth getting right:

### PAC + ZPA application segments

When a tenant runs both ZIA and ZPA, the PAC must **not** route ZPA application segment FQDNs through ZIA (unless Source IP Anchoring is intentionally configured — see below). ZPA private-app traffic is handled by ZCC's tunnel to App Connectors, not by the ZIA proxy.

| ZCC mode | PAC handling for ZPA app segment FQDNs |
|---|---|
| Z-Tunnel mode | PAC is bypassed for traffic ZCC handles directly. ZCC intercepts ZPA app segment FQDNs at the OS network layer and routes through the ZPA tunnel. PAC routing for browser-only traffic still applies for non-ZPA destinations. |
| PAC mode | PAC must explicitly `DIRECT` ZPA app segment FQDNs (or otherwise not return a ZIA proxy). Otherwise the browser sends ZPA-bound traffic to ZIA, where it has no destination — likely a connection failure or unexpected ZIA policy match. |

**Source IP Anchoring (SIPA) — the intentional opposite case.** SIPA is the mechanism where ZIA *intentionally* forwards selected traffic through to ZPA App Connectors via a ZPA gateway, using the App Connector's IP as the egress source (`vendor/zscaler-help/configuring-source-ip-anchoring.md`, `vendor/zscaler-help/understanding-source-ip-anchoring-direct.md`). When SIPA is configured for a given application segment, the client forwarding policy explicitly routes that segment's traffic via ZIA (not via ZCC's direct ZPA tunnel) — the PAC can then send the relevant FQDNs to ZIA, and ZIA's forwarding-control rules complete the chain to ZPA. (Tier A.) The SIPA-supporting case requires `Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors` under Advanced Settings (Tier A — `vendor/zscaler-help/configuring-source-ip-anchoring.md`).

**Pattern.** For a tenant running ZPA without SIPA, add a DIRECT bypass for known ZPA app segment FQDNs in the PAC before any ZIA-proxy logic. Maintain that list in lockstep with the ZPA app segment configuration — drift between the PAC's bypass list and the actual ZPA segments leads to either policy escape (ZPA-app traffic accidentally proxied through ZIA) or broken access (a new ZPA segment that the PAC still routes through ZIA).

See [`../zpa/app-segments.md`](../zpa/app-segments.md) for the ZPA segment model and [`./source-ip-anchoring.md`](./source-ip-anchoring.md) for SIPA mechanics.

### PAC + ZPA Browser Access

ZPA Browser Access exposes internal apps to users on **public DNS** via either a customer-managed CNAME (e.g., `wiki.example.com`) or a Zscaler-managed CNAME (e.g., `wiki.example.bazscaler.net`). The browser hits a Zscaler ingress that terminates TLS using the Browser Access certificate, then mTLS-tunnels to the App Connector. (Tier A — `references/zpa/browser-access.md`.)

For PAC routing: **Browser Access destinations should be `DIRECT` in the PAC**, not proxied through ZIA. The Browser Access ingress IS the proxy for that traffic — sending it through ZIA would either fail (ZIA doesn't know how to forward to a BA endpoint) or double-inspect with unintended consequences.

**Pattern.** Add a DIRECT bypass for the BA FQDNs (or the Zscaler-managed CNAME pattern `*.b.zpacloud.com` if applicable to your tenant — check the actual CNAME pattern in your tenant's Browser Access page at *Policies > Access Control > Clientless > Access Methods > Browser Access*). The same lockstep maintenance concern as ZPA app segments applies — when a new BA app is configured, the PAC bypass needs to be updated.

### PAC + proxy chaining

When ZIA is reached through an existing on-prem proxy server (legacy proxy → ZIA), the configuration is called **proxy chaining**. Per the *Traffic Forwarding Reference Architecture* (p.39): "Proxy chaining occurs when one proxy server forwards traffic to another proxy server. In this case, your legacy on-premises server is configured to forward traffic to the ZIA Service Edge. **This is a transitional network design** until you can configure another forwarding method in your network." (Tier A.)

**Two distinct flavors operators conflate:**

| Flavor | Path | PAC role |
|---|---|---|
| **Customer's legacy proxy → ZIA** | Browser → on-prem proxy → ZIA Service Edge → destination | Browser PAC returns `PROXY <on-prem-proxy>:<port>`. The on-prem proxy is independently configured to forward upstream to ZIA. ZIA receives explicit-mode traffic via CONNECT from the on-prem proxy. (Tier B — `references/zia/proxy-mode.md` confirms ZIA receives proxy-chained traffic in explicit mode.) |
| **ZIA → customer's downstream proxy** (`PROXYCHAIN` forwarding-control action) | Browser/ZCC → ZIA Service Edge → ZIA's `PROXYCHAIN` rule sends to a configured `proxy_gateway` → destination | Browser PAC routes traffic to ZIA normally; ZIA's forwarding-control rule does the downstream chaining. PAC has no direct role in this flavor. (Tier A — `references/zia/forwarding-control.md` documents `PROXYCHAIN` action.) |

**Vendor recommendation.** Zscaler explicitly recommends proxy chaining only as a **short-term transitional solution** ("until a more robust forwarding solution can be implemented") because typical on-prem proxies only support manual failover. (Tier A — `vendor/zscaler-help/Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:p.39`.) Prefer GRE / IPsec / ZCC tunnel for steady-state. See `https://help.zscaler.com/zia/configuring-proxy-chaining` for ISA / Squid configuration specifics (article not vendored).

## Mobile-specific considerations

Zscaler's recommendation for mobile users is **ZCC over PAC**: ZCC is the preferred forwarding mechanism for mobile users; PAC is "a last resort if Zscaler Client Connector can't be installed" (Tier A — `vendor/zscaler-help/Traffic_Forwarding_in_ZIA_Reference_Architecture.txt`, *Mobile Users - Explicit Forwarding*). Per the same source: "Zscaler Client Connector...is included in your Zscaler subscription, and is required for other Zscaler services such as ZPA and ZDX" — running mobile users on PAC alone forfeits ZPA and ZDX coverage entirely.

**ZCC + captive-portal interaction.** When ZCC detects a captive portal (e.g., hotel / airport Wi-Fi), it temporarily disables itself to allow the user to authenticate to the captive portal. (Tier A — *Traffic Forwarding Reference Architecture*: "Captive portal detected – A captive portal is blocking access to the internet.") During this disabled window, PAC-mode browser traffic also bypasses Zscaler. After the captive portal authentication completes, ZCC re-establishes its tunnel.

**iOS-specific PAC handling** (Tier C/D — operational lore, not in captured vendor docs):

- iOS configures Wi-Fi proxy auto-config **per-network**, not system-wide. Each Wi-Fi profile carries its own PAC URL setting under *Settings > Wi-Fi > [network] > Configure Proxy > Auto*.
- Many iOS apps (especially first-party Apple apps and apps using `URLSession` with default config) **do not honor the per-network PAC URL** — only the system Safari and apps that explicitly opt into proxy-aware HTTP libraries.
- For tenant-wide iOS PAC distribution, MDM (Jamf, Intune, etc.) is required — push the Wi-Fi profile with the PAC URL embedded.
- Cellular (LTE/5G) connections do NOT inherit the Wi-Fi PAC. iOS provides no system-wide PAC URL setting for cellular.

**Android-specific PAC handling** (Tier C/D — operational lore, not in captured vendor docs):

- Android also configures proxy **per-Wi-Fi-network**, with the same per-app honoring caveats as iOS.
- Android's "always-on VPN" mode (relevant for ZCC-via-Android-Enterprise) intercepts traffic at the OS network layer regardless of app PAC awareness — making ZCC-on-Android-Enterprise functionally superior to PAC-only deployment for non-PAC-aware apps. (Tier B — `vendor/zscaler-help/deploying-zscaler-client-connector-google-workspace-android.md` mentions "Use as the always-on VPN app: ON".)
- Cellular connections similarly do not inherit Wi-Fi PAC settings.

For mobile populations split across managed and BYOD: managed devices via ZCC + always-on VPN profile; BYOD via PAC if MDM isn't an option, with explicit acknowledgement that non-browser apps will leak.

## Verification

The ZIA Admin Portal has a **Verify PAC File** option that runs syntax validation before save. External tools like Google's `pactester` work for local verification. A PAC that fails verification can still be saved with **Error-Accepted** status — don't rely on status being `Verified` without testing. (Tier A — vendor/zscaler-help/best-practices-writing-pac-files.md.)

## Operational gotchas

- **PAC changes are immediate.** No activation gate. Test on a local machine and canary group first.
- **Browser PAC caching.** Most browsers cache the PAC for minutes to hours depending on cache headers. A PAC change can take up to an hour to fully roll out — plan maintenance windows accordingly.
- **Self-hosted PACs lose variable substitution.** Only PACs served from the Zscaler cloud get `${GATEWAY}` etc. substituted. If policy requires self-hosting (e.g., internal-only URL), use `isInNet` logic against known PSE subnets — but this is fragile across PSE IP changes.
- **Self-hosted HTTPS PAC must have a browser-trusted cert.** Browsers silently reject self-signed-cert PAC fetches and fall back to no-proxy mode — clients then bypass Zscaler entirely with no log signal. (Tier B — standard browser behavior.)
- **PAC parse / runtime error → silent DIRECT fallback.** A PAC with a syntax error caught at save shows `Error-Accepted` status but still serves. Worse, a PAC that *parses* but throws a JavaScript runtime error mid-evaluation (e.g., calling `dnsResolve` on a malformed input) causes most browsers to silently bail to DIRECT for that request — the user's traffic bypasses Zscaler with no log signal at the PAC layer. (Tier B — standard PAC engine behavior, not Zscaler-specific.) **Test PACs with malformed inputs**, not just well-formed ones.
- **VPN-masked client IP causes wrong-PSE geolocation.** When a remote user fetches the PAC URL through a corporate VPN, Zscaler's PAC server geolocates based on the VPN egress IP, not the user's actual IP. The PAC body returned references PSEs near the VPN egress, not the user. For traveling users on corporate VPN this can mean traffic round-trips an extra continent. (Tier C — operational consequence of `${GATEWAY}` server-side substitution being source-IP-driven.)
- **Kerberos KDC proxies create auth loops.** Add explicit DIRECT bypass for KDC proxy hosts before Kerberos forwarding logic.
- **Realm traffic must bypass Zscaler.** Don't forward traffic to AD or intranet hostnames to the PSE.
- **Size limit is bytes, not chars.** The 256 KB limit is encoded bytes; multi-byte characters (uncommon in a PAC, but possible in comments) consume more than one byte per glyph.
- **The 12% non-ASCII cap.** Standard ASCII-only PAC files don't hit it; PAC files mirroring documentation in non-Latin scripts can silently fail save validation.
- **PAC isn't consulted for QUIC traffic.** Browsers bypass proxy decisions for UDP destinations, so QUIC / HTTP/3 destinations skip the PAC entirely — same effective bypass behavior as `Z-Tunnel 1.0 + QUIC`. Block QUIC at the firewall to force browsers back to TCP/TLS where PAC + SSL inspection actually fire. See [`../zia/saas-app-quirks.md § 6`](../zia/saas-app-quirks.md) for the canonical QUIC handling.

## Cross-links

- Subcloud-variable substitution and PAC routing mechanics: [`./subclouds.md`](./subclouds.md)
- ZCC forwarding profile PAC action: [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)
- ZCC web-policy PAC URL: [`../zcc/web-policy.md`](../zcc/web-policy.md)
- Cloud architecture — what a PSE is and how geolocation chooses one: [`./cloud-architecture.md`](./cloud-architecture.md)
- Kerberos authentication deployment: see ZIA authentication docs in `references/zia/`
