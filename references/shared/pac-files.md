---
product: shared
topic: "pac-files"
title: "PAC files — the forwarding layer that touches every product"
content-type: reasoning
last-verified: "2026-04-28"
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

**Variable substitution only works when the PAC is Zscaler-hosted.** If you copy a PAC to your own web server, `${GATEWAY}` becomes a literal string, not an IP. Self-hosting a PAC means losing the geolocation and failover benefits.

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

## How ZCC uses PAC files vs GRE/IPsec locations

ZCC has three forwarding action modes on a per-platform or per-policy basis: Z-Tunnel, PAC, and NONE. (Tier A — `references/zcc/forwarding-profile.md`.)

- **Z-Tunnel mode:** ZCC establishes a tunnel directly to Zscaler. PAC is not used for tunnel-forwarded traffic.
- **PAC mode:** ZCC reads the PAC and forwards per its instructions. This is the right mode for environments where a tunnel is not desired or where specific apps need proxy-chaining.
- **GRE/IPSec locations:** Site-level forwarding via tunnel. ZCC on devices at those sites may use Z-Tunnel or PAC for its portion of the traffic. PAC files are also deployed for browser-only users (no ZCC) at those sites.

For Kerberos deployments: even if a location uses IPSec or GRE tunnels, users at that location who authenticate via Kerberos must use the Kerberos PAC file for their browser traffic. The tunnel and the PAC coexist for those users.

For road warriors (off-network users): PAC files (via ZCC PAC mode or browser direct PAC URL) are the standard forwarding mechanism when no tunnel is active.

## Verification

The ZIA Admin Portal has a **Verify PAC File** option that runs syntax validation before save. External tools like Google's `pactester` work for local verification. A PAC that fails verification can still be saved with **Error-Accepted** status — don't rely on status being `Verified` without testing. (Tier A — vendor/zscaler-help/best-practices-writing-pac-files.md.)

## Operational gotchas

- **PAC changes are immediate.** No activation gate. Test on a local machine and canary group first.
- **Browser PAC caching.** Most browsers cache the PAC for minutes to hours depending on cache headers. A PAC change can take up to an hour to fully roll out — plan maintenance windows accordingly.
- **Self-hosted PACs lose variable substitution.** Only PACs served from the Zscaler cloud get `${GATEWAY}` etc. substituted. If policy requires self-hosting (e.g., internal-only URL), use `isInNet` logic against known PSE subnets — but this is fragile across PSE IP changes.
- **Kerberos KDC proxies create auth loops.** Add explicit DIRECT bypass for KDC proxy hosts before Kerberos forwarding logic.
- **Realm traffic must bypass Zscaler.** Don't forward traffic to AD or intranet hostnames to the PSE.
- **Size limit is bytes, not chars.** The 256 KB limit is encoded bytes; multi-byte characters (uncommon in a PAC, but possible in comments) consume more than one byte per glyph.
- **The 12% non-ASCII cap.** Standard ASCII-only PAC files don't hit it; PAC files mirroring documentation in non-Latin scripts can silently fail save validation.

## Cross-links

- Subcloud-variable substitution and PAC routing mechanics: [`./subclouds.md`](./subclouds.md)
- ZCC forwarding profile PAC action: [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)
- ZCC web-policy PAC URL: [`../zcc/web-policy.md`](../zcc/web-policy.md)
- Cloud architecture — what a PSE is and how geolocation chooses one: [`./cloud-architecture.md`](./cloud-architecture.md)
- Kerberos authentication deployment: see ZIA authentication docs in `references/zia/`
