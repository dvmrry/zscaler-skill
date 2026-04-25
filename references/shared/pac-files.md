---
product: shared
topic: "pac-files"
title: "PAC files — the forwarding layer that touches every product"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-pac-file.md"
  - "vendor/zscaler-help/about-hosted-pac-files.md"
  - "vendor/zscaler-help/writing-pac-file.md"
  - "vendor/zscaler-help/best-practices-writing-pac-files.md"
  - "vendor/zscaler-help/using-default-zscaler-kerberos-pac-file.md"
  - "vendor/zscaler-help/using-custom-pac-file-forward-traffic-zia.md"
  - "vendor/zscaler-help/understanding-subclouds.md"
author-status: draft
---

# PAC files — the forwarding layer that touches every product

PAC (Proxy Auto-Config) files are JavaScript programs that tell a client where to send outbound web traffic. Every Zscaler forwarding path that doesn't originate from a tunnel (GRE, IPSec, ZCC Z-Tunnel) uses a PAC file — and even tunnel deployments often pair with a PAC for road-warrior coverage. The skill cites "PAC" across 8+ docs; this is the consolidated reference.

## The four default Zscaler-hosted PACs

Zscaler generates and hosts four master PAC files. They are **non-editable** — to customize, clone and upload as a custom PAC.

| PAC | Purpose | Default port |
|---|---|---|
| `recommended.pac` | General browser forwarding. Use this unless you have a reason not to. | 80 (or dedicated) |
| `proxy.pac` | Legacy/simpler variant. | 80 |
| `mobile_proxy.pac` | Mobile device forwarding. | 80 |
| `kerberos.pac` | For tenants using Kerberos authentication — forces FQDN addressing (`${GATEWAY_HOST}` rather than IP) so SPNs resolve. | 8800 (Kerberos challenge port) |

Any tenant that enables Kerberos must use `kerberos.pac` (or a clone), even if traffic is also forwarded via IPSec/VPN tunnel. See `vendor/zscaler-help/using-default-zscaler-kerberos-pac-file.md` for the KDC-proxy bypass requirement.

## How the PAC gets to a client — and what the Zscaler service substitutes

The browser is configured with a **Hosted URL** pointing at the PAC. On each fetch:

1. Client browser requests the PAC URL (HTTP or HTTPS; HTTPS recommended).
2. Zscaler's PAC server runs **geolocation** against the client's source IP to find the nearest Public Service Edge (PSE).
3. Before returning the PAC body, Zscaler performs **server-side variable substitution** — inserting the current PSE IPs / FQDNs into the file. This is the key mechanic: PACs stored on the Zscaler cloud are rendered per-request with tenant-specific and location-specific values.
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
| `${GATEWAY.<subcloud>.<cloud>.net}` | Subcloud-scoped primary PSE — see Subclouds below |
| `${SECONDARY.GATEWAY.<subcloud>.<cloud>.net}` | Subcloud-scoped secondary PSE |

The `_FX` suffix variant is used when the PAC author wants to force a specific proxy order in the `PROXY` return list (e.g., for manual failover from primary to secondary on conditions other than primary-down). Default `${GATEWAY}` and `${SECONDARY_GATEWAY}` are what you want for normal automatic-failover usage.

### Manual-failover syntax

The standard automatic failover is: primary PSE → secondary PSE when primary is unreachable. To force failover for other reasons (ISP issues, latency):

```javascript
return "PROXY ${SECONDARY_GATEWAY_FX}:80; PROXY ${GATEWAY_FX}:80; DIRECT";
```

The order of the `PROXY` clauses determines try-order. Subcloud variant:

```javascript
return "PROXY ${SECONDARY.GATEWAY.<Subcloud>.<Zscaler Cloud>.net_FX}:80; PROXY ${GATEWAY.<Subcloud>.<Zscaler Cloud>.net_FX}:80; DIRECT";
```

## Subclouds change which PSEs the variables resolve to

A **subcloud** is a tenant-level restriction that limits which PSEs serve the tenant (e.g., only Frankfurt + Munich to keep traffic in-EU). When a tenant uses a subcloud, the default `${GATEWAY}` variable expansion changes — it will only return PSEs that belong to the subcloud. For this to work, the PAC must reference the subcloud-qualified variable form:

```
${GATEWAY.<Subcloud>.<Zscaler Cloud>.net}
```

The unqualified `${GATEWAY}` on a subcloud tenant may resolve to the subcloud PSE pool implicitly (Zscaler tracks the subcloud on the tenant side) — but explicit subcloud-qualified variables are safer. See `vendor/zscaler-help/understanding-subclouds.md`.

## Limits

| Limit | Default | Max (Zscaler Support ticket) |
|---|---|---|
| PAC files per organization | 256 | 1,024 |
| Size per PAC file | 256 KB | 2 MB |
| **Versions per PAC** | 10 | 10 (cap) |

10-version history enables staged rollouts — author a new version, test via a small population, promote to current. There is no native canary or percentage-rollout primitive; staging is done by pointing selected users at a versioned URL.

## How each Zscaler product consumes PAC files

- **ZIA direct forwarding** — the original and primary consumer. Browsers are configured with a PAC URL via GPO / DHCP WPAD / manual settings, and forward web traffic to the PSE per the PAC's returned `PROXY` statements.
- **ZCC** — `web-policy.md` per-platform sub-policies carry a PAC URL. When ZCC's forwarding profile selects a `PAC` action (as opposed to `Z-Tunnel`), ZCC reads the PAC and forwards per its instructions. PAC files are one of three action modes (Z-Tunnel / PAC / NONE) on `references/zcc/forwarding-profile.md`.
- **ZPA Browser Access** — clientless web-app access publishes a browser-facing PAC so a browser without ZCC can route the relevant FQDNs through ZPA's PSE-adjacent ingress.
- **Kerberos deployments** — must use the Kerberos PAC (port 8800, FQDN variables).

## Operational gotchas

- **PAC changes are immediate.** There is no activation gate analogous to ZIA's staged-vs-live policy model. The moment you save a new PAC version as "currently deployed," all browsers fetching that URL get the new content on their next refresh cycle. Test on a local machine and in a canary group first.
- **Browser PAC caching.** Most browsers cache the PAC for minutes to hours depending on cache headers and version. A PAC change can take up to an hour to fully roll out — plan maintenance windows accordingly.
- **Self-hosted PACs lose variable substitution.** Only PACs served from the Zscaler cloud get `${GATEWAY}` etc. substituted. If policy requires self-hosting (e.g., internal-only URL), use `isInNet` logic against known PSE subnets instead — but this is fragile across PSE IP changes.
- **Kerberos KDC proxies create auth loops.** If your org runs a Microsoft DirectAccess KDC proxy, it sits behind Zscaler and gets its traffic re-challenged on port 8800. Add `if (shExpMatch(host, "kdcproxy.<yourdomain>.com")) return "DIRECT";` before any Kerberos forwarding logic.
- **Realm traffic must bypass Zscaler.** Don't forward traffic to hostnames inside your Kerberos realm (AD / intranet) to the PSE — the PSE will challenge it for a Zscaler ticket and fail. Bypass realm hosts with `return "DIRECT"` at the top of the PAC.
- **Performance: OR-heavy PACs are slow.** PACs execute serially. A naive "100 OR conditions" pattern parses every one on every request. Group by outer `if` (match `*.google.com` once, then 10 specific patterns) and put high-probability checks at the top. Avoid `dnsResolve()` and `isResolvable()` except where necessary — DNS inside a PAC is a hot-path dependency.
- **Size limit is bytes, not chars.** The 256 KB limit is encoded bytes; multi-byte characters (unusual in a PAC, but possible in comments) consume more than one byte per glyph.

## Verification

The ZIA Admin Portal has a **Verify PAC File** option that runs syntax validation before save. External tools like Google's `pactester` work for local verification. A PAC that fails verification can still be saved with **Error-Accepted** status — don't rely on status being `Verified` without testing.

## Cross-links

- Subcloud-variable substitution: [`vendor/zscaler-help/understanding-subclouds.md`](../../vendor/zscaler-help/understanding-subclouds.md).
- ZCC forwarding profile PAC action: [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md).
- ZCC web-policy PAC URL: [`../zcc/web-policy.md`](../zcc/web-policy.md).
- Cloud architecture — what a PSE is and how geolocation chooses one: [`./cloud-architecture.md`](./cloud-architecture.md).
- Kerberos authentication deployment: not yet covered (see `references/zia/` for authentication docs as they land).
