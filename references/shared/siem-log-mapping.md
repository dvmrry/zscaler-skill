---
product: shared
topic: "siem-log-mapping"
title: "Zscaler log type catalog — SIEM-agnostic mapping reference"
content-type: reference
last-verified: "2026-04-29"
confidence: medium
source-tier: doc
sources:
  - "Zscaler NSS / LSS published schema docs (cited per log type)"
  - "Splunk Technology Add-on for Zscaler Internet Security (Splunkbase 3865)"
  - "references/{zia,zpa,zcc}/logs/*.md"
author-status: draft
---

# Zscaler log type catalog — SIEM-agnostic mapping reference

The bridge between Zscaler log streams (universal, defined by Zscaler) and where they land in your SIEM (per-tenant, defined by your config). Use this catalog to answer:

- Which Zscaler log type carries the data the investigation needs
- Which schema file documents its fields and value types
- What naming conventions are common across SIEMs

## Canonical vs. tenant — the catalog covers one half

This catalog is **canonical** — the Zscaler-published view of each log type and its schema. The complementary artifact is the **tenant schema**: an empirical dump of what's actually in your SIEM after parsing / TA / aliases (e.g., a Splunk `fieldsummary` against your sourcetype). Tenant schemas are private and live in your fork / CLAUDE.md / memory.

A good investigation cross-references both: canonical for "what fields could exist + what they mean," tenant for "what's actually queryable in this environment right now." See [`tenant-schema-derivation.md`](./tenant-schema-derivation.md) for the canonical-vs-tenant distinction, derivation recipes per SIEM (Splunk fieldsummary, Sentinel getschema, Elastic field_caps, etc.), and a storage template.

## How this is structured

Each Zscaler log type has one entry with:

- **Name** — Zscaler's published log type name
- **Carries** — one-line summary of what's in the stream
- **Schema** — pointer to the field schema reference under `references/{zia,zpa,zcc}/logs/`
- **Catalog placeholder** — the generic name used in this catalog and in SIEM-specific query catalogs (e.g., `$INDEX_ZIA_WEB` in `splunk-queries.md`)
- **Common SIEM landing spots** — typical naming patterns per SIEM. These are *patterns*, not your tenant's actual config.

The user maps their tenant's real names to the catalog placeholders in CLAUDE.md, memory, or a private fork's config — see [`siem-emission-discipline.md`](./siem-emission-discipline.md). The public catalog never holds tenant-specific values.

### Confidence note on per-SIEM landing spots

Splunk landing spots are documented from the Zscaler TA (Splunkbase ID 3865) and common operator conventions. Other SIEM landing spots (Sentinel, Chronicle, Elastic, Sumo) are described conservatively — pattern-level only. Specific table names, log types, or index patterns vary by data connector / parser / agent module version, and tenants frequently customize. Treat these rows as *starting points*; the user's actual config is authoritative. Where a specific value is unverified, the row says "consult tenant data-connector / parser / agent config."

## ZIA — NSS feeds

ZIA Nanolog Streaming Service (NSS) feeds carry transaction-level events from the ZIA cloud to a SIEM via syslog or HEC.

### ZIA Web (NSS)

- **Carries**: HTTP/S transaction events — URL filtering decisions, action, category, threat detection, SSL inspection outcome, ZCC device context
- **Schema**: [`../zia/logs/web-log-schema.md`](../zia/logs/web-log-schema.md)
- **Catalog placeholder**: `$INDEX_ZIA_WEB` (Splunk); generic `zia-web` elsewhere
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | TA default sourcetype: `zscalernss-web`. Common short forms: `nss-web`, `zscaler-web`, `zia-web` |
| Sentinel | Custom log table from the Zscaler ZIA data connector — typical pattern `ZScalerEvent` or per-customer `ZscalerWeb_CL`; consult tenant connector config |
| Chronicle | Log type `ZSCALER_WEBPROXY` (parser bundled by Google) |
| Elastic | Filebeat / Elastic Agent Zscaler module — typical index pattern `logs-zscaler.web-*` or `zscaler-nss-web-*`; consult agent config |
| Sumo Logic | Source category pattern `zscaler/web` or `zscaler/nss/web`; consult collector config |

### ZIA Firewall (NSS)

- **Carries**: Firewall transaction events — non-web TCP/UDP/ICMP traffic, source/destination IPs and ports, action, network app, rule label
- **Schema**: [`../zia/logs/firewall-log-schema.md`](../zia/logs/firewall-log-schema.md)
- **Catalog placeholder**: `$INDEX_ZIA_FW`; generic `zia-fw`
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | TA default sourcetype: `zscalernss-fw`. Common short forms: `nss-fw`, `zscaler-fw`, `zia-fw` |
| Sentinel | Same connector as Web typically; row discriminator may be record type or sourcetype-equivalent field |
| Chronicle | Log type pattern `ZSCALER_FIREWALL` or co-mapped under generic `ZSCALER`; consult parser |
| Elastic | Index pattern `logs-zscaler.firewall-*` or `zscaler-nss-fw-*` |
| Sumo Logic | Source category `zscaler/firewall` or `zscaler/nss/fw` |

### ZIA DNS (NSS)

- **Carries**: DNS query events — query name, query type, response, action, threat category if applicable
- **Schema**: [`../zia/logs/dns-log-schema.md`](../zia/logs/dns-log-schema.md)
- **Catalog placeholder**: `$INDEX_ZIA_DNS`; generic `zia-dns`
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | TA default sourcetype: `zscalernss-dns`. Common short forms: `nss-dns`, `zscaler-dns`, `zia-dns` |
| Sentinel | Same connector typically; discriminator field |
| Chronicle | Log type `ZSCALER_DNS` or co-mapped |
| Elastic | Index pattern `logs-zscaler.dns-*` or `zscaler-nss-dns-*` |
| Sumo Logic | Source category `zscaler/dns` or `zscaler/nss/dns` |

### ZIA Tunnel (NSS)

- **Carries**: Z-Tunnel / GRE / IPsec session events — tunnel up/down, peer info, traffic forwarding state
- **Schema**: ❌ **not yet documented** in this repo. Tracked as a coverage gap.
- **Catalog placeholder**: `$INDEX_ZIA_TUNNEL`; generic `zia-tunnel`
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | Common patterns: `nss-tunnel`, `zscaler-tunnel`, `zia-tunnel`. Not part of the TA default sourcetypes |
| Sentinel/Chronicle/Elastic/Sumo | Typically not pre-defined in vendor data connectors; most tenants treat as a custom feed |

### ZIA SaaS Security / CASB (Cloud NSS)

- **Carries**: SaaS Security events — file scans (data at rest), share events, DLP triggers, Shadow IT discovery for API-integrated SaaS apps. Organized by application category (Collaboration / CRM / Email / File / Gen AI / ITSM / Public Cloud Storage / Repository) with per-category column sets.
- **Schema**: [`../zia/logs/casb-log-schema.md`](../zia/logs/casb-log-schema.md) (⚠️ partial — structural facts confirmed; per-category field-level detail open as a coverage gap)
- **Catalog placeholder**: `$INDEX_ZIA_CASB`; generic `zia-casb`
- **Note**: Distinct from inline CASB (which lands in the **Web NSS** feed via the Cloud Application section — see `web-log-schema.md`). Investigations may need both feeds.
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | Common patterns: `nss-casb`, `zscaler-casb`. Not part of the TA default sourcetypes |
| Sentinel/Chronicle/Elastic/Sumo | Custom feed; consult tenant config |

### ZIA Alerts (NSS)

- **Carries**: NSS alert feed — operational alerts about NSS health, feed status
- **Schema**: not in this repo (operational telemetry, not transaction data)
- **Catalog placeholder**: `$INDEX_ZIA_ALERTS`; generic `zia-alerts`
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | TA default sourcetype: `zscalernss-alerts` |
| Other | Custom routing |

## ZPA — LSS feeds

ZPA Log Streaming Service (LSS) feeds carry session and connector telemetry from the ZPA cloud to a SIEM. Each LSS log type is a separate feed configured in the ZPA admin UI; tenants may co-index multiple LSS log types in a single SIEM destination or split them.

### ZPA User Activity (LSS)

- **Carries**: Per-session traffic events — application accessed, connector used, policy matched, session status, internal reason codes for failures
- **Schema**: [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md)
- **Catalog placeholder**: `$INDEX_ZPA`; generic `zpa-user-activity`
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | No TA default; tenant-configured. Common patterns: `lss-zpa-activity`, `zpa-user-activity`, `zscalerlss-zpa`, `zpa-access` |
| Sentinel | Custom log table; common pattern `ZPAEvent` or `ZscalerZPA_CL` |
| Chronicle | Log type pattern `ZSCALER_ZPA` or `ZPA_USER_ACTIVITY`; consult parser |
| Elastic | Index pattern `logs-zscaler.zpa-*` or `zscaler-lss-zpa-*` |
| Sumo Logic | Source category `zscaler/zpa/activity` or `zscaler/lss/zpa` |

### ZPA User Status (LSS)

- **Carries**: Session enrollment / disconnection events — user posture, ZCC platform/version, hostname, session ID, posture profile hits/misses
- **Schema**: [`../zpa/logs/user-status-log-schema.md`](../zpa/logs/user-status-log-schema.md)
- **Catalog placeholder**: `$INDEX_ZPA_STATUS`; generic `zpa-user-status`
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | Common: `lss-zpa-status`, `zpa-user-status`. Often co-indexed with User Activity |
| Other | Tenant-configured; consult LSS receiver config |

### ZPA App Connector Status (LSS)

- **Carries**: Connector enrollment / health-state events — connector ID, group, version, status changes
- **Schema**: [`../zpa/logs/app-connector-status.md`](../zpa/logs/app-connector-status.md)
- **Catalog placeholder**: `$INDEX_ZPA_CONNECTOR_STATUS`; generic `zpa-app-connector-status`
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | Common: `zpa-app-connector-status`, `lss-zpa-connector-status`, `lss-zpa-connector` (when status + metrics co-feed) |
| Other | Tenant-configured |

### ZPA App Connector Metrics (LSS)

- **Carries**: Connector throughput / CPU / memory / port-pool metrics, per measurement interval
- **Schema**: [`../zpa/logs/app-connector-metrics.md`](../zpa/logs/app-connector-metrics.md)
- **Catalog placeholder**: `$INDEX_ZPA_METRICS`; generic `zpa-app-connector-metrics`
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | Common: `zpa-app-connector-metrics`, `lss-zpa-metrics`, `lss-zpa-connector` (when status + metrics co-feed). Many tenants co-index with Status |
| Other | Tenant-configured |

### ZPA Browser Access (LSS)

- **Carries**: Browser Access (BA) session events — clientless ZTNA access via browser, BA-specific session attributes
- **Schema**: [`../zpa/logs/browser-access-log-schema.md`](../zpa/logs/browser-access-log-schema.md)
- **Catalog placeholder**: `$INDEX_ZPA_BROWSER`; generic `zpa-browser-access`
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | Common: `zpa-browser-status`, `zpa-browser-access`, `lss-zpa-browser`. Note: tenants may use `*-status` or `*-access` interchangeably; check whether your feed carries access events, status events, or both |
| Other | Tenant-configured |

### ZPA Microsegmentation Flow (LSS)

- **Carries**: East-west microsegmentation flow events for ZPA-protected workloads
- **Schema**: [`../zpa/logs/microsegmentation-flow-log-schema.md`](../zpa/logs/microsegmentation-flow-log-schema.md)
- **Catalog placeholder**: `$INDEX_ZPA_MICROSEG`; generic `zpa-microsegmentation`
- **Common SIEM landing spots**: tenant-configured; not part of common preset feeds

### ZPA Audit (LSS)

- **Carries**: Admin actions / configuration change events — who changed what, when, in the ZPA admin console; SAML / authentication audit events
- **Schema**: ❌ **not yet documented** in this repo. Tracked as a coverage gap.
- **Catalog placeholder**: `$INDEX_ZPA_AUDIT`; generic `zpa-audit`
- **Common SIEM landing spots**:

| SIEM | Pattern |
|---|---|
| Splunk | Common: `lss-zpa-audit`, `lss-zpa-auth`, `zpa-audit`. The `*-auth` form is sometimes used when the audit feed prominently carries authentication events |
| Other | Tenant-configured |

### ZPA Private Service Edge — Status / Metrics (LSS)

- **Carries**: Private Service Edge enrollment, health, and throughput telemetry
- **Schema**:
  - Status: [`../zpa/logs/private-service-edge-status.md`](../zpa/logs/private-service-edge-status.md)
  - Metrics: [`../zpa/logs/private-service-edge-metrics.md`](../zpa/logs/private-service-edge-metrics.md)
- **Catalog placeholder**: `$INDEX_ZPA_PSE_STATUS` / `$INDEX_ZPA_PSE_METRICS`
- **Common SIEM landing spots**: tenant-configured; not commonly preset

### ZPA Private Cloud Controller — Status / Metrics (LSS)

- **Carries**: Private Cloud Controller (PCC) enrollment, health, and throughput telemetry (for ZPA private deployments)
- **Schema**:
  - Status: [`../zpa/logs/private-cloud-controller-status.md`](../zpa/logs/private-cloud-controller-status.md)
  - Metrics: [`../zpa/logs/private-cloud-controller-metrics.md`](../zpa/logs/private-cloud-controller-metrics.md)
- **Catalog placeholder**: `$INDEX_ZPA_PCC_STATUS` / `$INDEX_ZPA_PCC_METRICS`
- **Common SIEM landing spots**: tenant-configured; not commonly preset

## ZCC — client-side logs

### ZCC client diagnostic logs

- **Carries**: Client tunnel state, posture, ZCC version, network change events
- **Schema**: [`../zcc/logs/zcc-log-schema.md`](../zcc/logs/zcc-log-schema.md)
- **Catalog placeholder**: n/a — ZCC logs are local endpoint files, not SIEM-streamable directly
- **SIEM landing spots**: ZCC logs are not natively shipped to any SIEM. Cloud-side visibility into ZCC behavior comes via ZIA Web logs (`deviceowner` / `ztunnelversion` fields) and ZPA User Status logs (`Version` / `Platform` fields). See `splunk-queries.md` § `zcc-device-correlate` and § `zcc-tunnel-down-web-gap` for the pattern.

## ZDX — pull-API only

### ZDX metrics / scores

- **Carries**: Application performance scores, probe results, device telemetry
- **Schema**: see [`../zdx/api.md`](../zdx/api.md) for endpoint shapes; field schema is API response, not log feed
- **Catalog placeholder**: `$INDEX_ZDX` (only relevant if a custom pipeline ships ZDX API results into the SIEM)
- **SIEM landing spots**: ZDX does not stream natively via NSS or LSS. Getting ZDX into a SIEM requires either:
  - The Zscaler ZDX Add-on / data connector (where available, separate from the ZIA/ZPA TA / connector)
  - A custom pipeline that calls the ZDX REST API and ships results to the SIEM via HEC / Logs Ingestion / equivalent

## Coverage gaps

Schemas not yet documented in this repo, surfaced by the catalog:

| Gap | Likely shape |
|---|---|
| ZIA Tunnel NSS schema | Z-Tunnel / GRE / IPsec session events |
| ZIA CASB / SaaS Security NSS schema (per-category column detail) | Eight per-category sub-schemas referenced in [`../zia/logs/casb-log-schema.md`](../zia/logs/casb-log-schema.md); structural model documented, per-category fields pending vendor capture |
| ZPA Audit LSS schema | Admin actions, configuration changes, SAML / auth audit events |

These are tracked as next deliverables after this catalog is validated.

## Cross-links

- [`tenant-schema-derivation.md`](./tenant-schema-derivation.md) — canonical-vs-tenant distinction, derivation recipes per SIEM, storage template
- [`siem-emission-discipline.md`](./siem-emission-discipline.md) — agent execution modes, public/private boundary, where user plumbing lives
- [`splunk-queries.md`](./splunk-queries.md) — Splunk-specific SPL pattern catalog
- [`investigate-prompt.md`](./investigate-prompt.md) — `/investigate` slash command playbook
- [`troubleshooting-methodology.md`](./troubleshooting-methodology.md) — discovery journal, claim status
- ZIA log schemas — [`../zia/logs/`](../zia/logs/)
- ZPA log schemas — [`../zpa/logs/`](../zpa/logs/)
- ZCC log schema — [`../zcc/logs/zcc-log-schema.md`](../zcc/logs/zcc-log-schema.md)
- ZDX API — [`../zdx/api.md`](../zdx/api.md)
