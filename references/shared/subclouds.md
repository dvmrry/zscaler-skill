---
product: shared
topic: "subclouds"
title: "Subclouds — restricting which Service Edges handle tenant traffic"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-subclouds.md"
author-status: draft
---

# Subclouds — restricting which Service Edges handle tenant traffic

A **subcloud** is a named subset of Zscaler Service Edges that a tenant restricts their traffic to. Default Zscaler behavior uses geolocation to forward traffic to the nearest Public Service Edge (PSE) — subclouds override this to keep traffic inside a chosen footprint. Common reasons: GDPR / data-residency requirements, private-DC-only policies, surcharge regions that require explicit opt-in.

Subclouds sit between PAC files / ZCC forwarding / GRE-IPSec tunnels (how clients reach Zscaler) and the Central Authority / PSE mesh (how Zscaler routes to destinations). Understanding them matters when reasoning about "why is my traffic going to the wrong region" or "why isn't the Zscaler Hosted PAC resolving to my EU PSEs."

## What a subcloud is

A subcloud can be any of three shapes:

| Type | Example use case |
|---|---|
| **Subset of Public Service Edges only** | "Europe-only" tenants for GDPR — restricts to EU-region PSEs |
| **Subset of Private Service Edges only** | Tenants with on-prem Private Service Edges that should handle all traffic |
| **Mix of Public + Private Service Edges** | Preferred-set tenants — Private Edges first, Public as overflow |

**Constraint:** a subcloud cannot consist of PSEs in a single data center. At least two data centers (presumably for availability). This means "single-datacenter subcloud" is not a valid config even if you only operate from one building — you need a secondary for failover.

## Why subclouds exist

Default Zscaler PSE selection is geolocation-based: a client hitting a hosted PAC or resolving `gateway.zscaler.net` gets the nearest PSE in the tenant's assigned cloud (`zscaler.net`, `zscalertwo.net`, etc.). That's wrong for:

- **Regulatory / compliance** — data must stay in-region. An EU tenant can't accept its traffic being routed through a US PSE just because the client is US-based.
- **Private-DC enforcement** — tenants with on-prem Private Service Edges want traffic to stay on-prem. Public PSEs are a fallback, not a primary.
- **Surcharge data centers** — some special-region PSEs (restricted geographies) require explicit subcloud membership. Geolocation won't select them by default.

Subclouds are the authoritative way to override geolocation. There's no "set preferred region" toggle — the mechanism is always "create a subcloud, configure clients to resolve subcloud-qualified variables."

## Setup

Subclouds are **not self-service**. Tenants submit a ticket to Zscaler Support. Support only sets up subclouds for organizations with access to limited, restricted, or private data centers.

- **Subcloud name**: ≤32 characters; alphanumeric + hyphen; first/last char must be alphanumeric.
- Each subcloud gets an associated DNS name used in the qualified PAC variable form (see below).

## How clients route to a subcloud

The PSE selection mechanism depends on the subcloud-qualified form of the gateway variable. Unqualified `${GATEWAY}` returns the nearest PSE regardless of subcloud — use the qualified form to pin traffic to the subcloud.

### PAC variable forms

For tenants using a PAC file (Zscaler-hosted):

```javascript
${GATEWAY.<Subcloud>.<Zscaler cloud>}
${SECONDARY.GATEWAY.<Subcloud>.<Zscaler cloud>}
```

For non-PAC applications (e.g., client configs that lookup a specific DNS name):

```
gateway.<Subcloud>.<Zscaler cloud>
secondary.gateway.<Subcloud>.<Zscaler cloud>
```

For Kerberos (FQDN form required):

```javascript
${GATEWAY.<Subcloud>.<Zscaler cloud>_HOST}
${SECONDARY.GATEWAY.<Subcloud>.<Zscaler cloud>_HOST}
```

`<Zscaler cloud>` is the tenant's cloud name (`zscaler.net`, `zscalertwo.net`, `zscalerthree.net`, etc.). See `ZSCALER_CLOUD` values in `README.md § 4` for the full commercial list.

### Zscaler-managed `CONUS` subcloud

Zscaler maintains a `CONUS` subcloud for US-only traffic forwarding — this is pre-built and doesn't require a ticket. Example usage:

```javascript
${GATEWAY.CONUS.zscaler.net}
${SECONDARY.GATEWAY.CONUS.zscaler.net}
```

Useful for tenants that want US-only egress without the full subcloud setup process.

## Propagation timing — the stale-PAC trap

Subcloud edits (adding/removing data centers) don't take effect immediately. Propagation cascade:

| Layer | Refresh interval | Effect |
|---|---|---|
| **Zscaler Hosted PAC files** | **~5 minutes** | New subcloud definition reflects in PAC responses |
| **ZCC Application Profile PAC** | **15 minutes** | ZCC clients refresh their cached Application Profile PAC on this cadence |
| **Effective user redirect** | **10–20 minutes** | Users typically redirected to new subcloud PSE set |

**Operational gotcha:** if you force a client to refresh policy (`ZCC > More > Update Policy`) **before the Application Profile PAC has been updated (5-min mark)**, the client pulls a stale config. Wait for the 5-minute mark first, then trigger client update.

## Admin UI

**Administration > Resources > Subclouds**. Per-subcloud columns:

- **Name**
- **Number of Data Centers**
- **Number of Disabled Data Centers** — useful for tracking when a DC is temporarily out of rotation (e.g., maintenance)

Edits trigger the propagation delays above.

## Surprises worth flagging

1. **Unqualified `${GATEWAY}` can bypass the subcloud.** A PAC that uses `${GATEWAY}` instead of `${GATEWAY.<Subcloud>.<Cloud>}` will resolve to geolocation-default PSEs — which may not be in the subcloud. Tenants who thought they had EU-only traffic but find US PSEs in their logs usually have this misconfiguration.

2. **The "subcloud" variable is the DNS name, not a label.** Writing `${GATEWAY.EU-OnlySubcloud.zscaler.net}` only works if the subcloud's associated DNS name is literally `EU-OnlySubcloud`. Check the admin UI for the exact identifier.

3. **Propagation is cascade, not atomic.** A subcloud change triggers refresh at 5m, 15m, and 10-20m for different surfaces. During the staggered window, some clients are on new PSE set and others on old. Plan for uneven rollout during maintenance.

4. **Subclouds can't do single-DC restriction.** Minimum two DCs. Tenants with a single private DC can't use a Private-only subcloud unless they add a secondary (Private or Public as backup).

5. **Subclouds gate the PSE pool but not the Central Authority.** Policy evaluation still flows through the tenant's CA; only the data-plane PSEs are restricted. CA-level config propagation isn't subcloud-aware.

6. **Business Continuity Cloud bypasses subclouds.** When BC Cloud activates (PSE outage), traffic routes through Zscaler's BC infrastructure regardless of subcloud config. See [`./cloud-architecture.md § Business Continuity Cloud`](./cloud-architecture.md) — BC Cloud supports only Z-Tunnel 1.0 / PAC / GRE (not 2.0), which means a tenant relying on Z-Tunnel 2.0 + a restrictive subcloud loses both during BC activation.

## Cross-links

- PAC file architecture (variable substitution, Kerberos PAC): [`./pac-files.md`](./pac-files.md).
- Cloud architecture (PSE form factors, Central Authority): [`./cloud-architecture.md`](./cloud-architecture.md).
- ZCC Application Profile refresh semantics: [`../zcc/web-policy.md`](../zcc/web-policy.md).
- Dynamic Location Groups can scope by Country, useful as a complement when "this location should only use EU-subcloud PAC": [`../zia/locations.md`](../zia/locations.md).
