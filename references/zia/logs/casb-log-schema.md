---
product: zia
topic: "zia-casb-log-schema"
title: "ZIA SaaS Security / CASB log schema (Cloud NSS Feed: SaaS Security)"
content-type: reference
last-verified: "2026-04-29"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/about-saas-security-insights-logs.md"
  - "vendor/zscaler-help/about-cloud-nss-feeds.md"
  - "vendor/zscaler-help/about-saas-security-report.md"
  - "vendor/zscaler-help/about-saas-security-scan-configuration.md"
  - "vendor/zscaler-help/shadow-it-saas-security-report-zia.md"
  - "https://help.zscaler.com/zia/about-saas-security-insights-logs"
author-status: draft
---

# ZIA SaaS Security / CASB log schema (Cloud NSS Feed: SaaS Security)

The CASB log feed for ZIA is a **Cloud NSS** feed type (not a traditional VM-based NSS feed). It carries SaaS Security events — file scanning, sharing, DLP triggers, and Shadow IT discovery for SaaS applications integrated via the Zscaler SaaS Connector / API CASB layer.

**Confidence is medium**, not high: structural facts (Cloud NSS feed, per-app-category column sets, Insights UI organization) are confirmed from Zscaler help articles. **Per-category field-level detail is partial** in this skill kit — the full per-category column lists live behind sub-pages of the Zscaler help portal that aren't yet captured under `vendor/zscaler-help/`. See [Open questions](#open-questions) for the gap and how to close it.

## What a record is

The SaaS Security / CASB feed differs structurally from the Web / Firewall / DNS NSS feeds:

| Aspect | Web NSS | SaaS Security NSS |
|---|---|---|
| Feed type | Traditional VM-based NSS or Cloud NSS | **Cloud NSS only** |
| Record granularity | One HTTP/S transaction | One SaaS event (file scan, share, DLP trigger, app discovery) |
| Schema shape | Single flat schema across all records | **Per-application-category schemas** — different fields populated depending on the app type involved |
| Field set | ~150 fields, all defined in one CSV | Variable; each app category has its own column set |

A record represents **one SaaS event**: a file scanned by the Zscaler SaaS Connector, a sharing action observed via API CASB, a DLP rule triggered against SaaS data at rest, or a Shadow IT discovery (an unsanctioned SaaS app observed in user traffic).

## Three CASB-adjacent log paths to disambiguate

When investigating CASB / SaaS Security events, three different log paths can surface relevant data. **This schema doc is path #2.**

| # | Log path | Where it lives | When to query |
|---|---|---|---|
| 1 | **Inline CASB / Cloud App Control in Web traffic** | ZIA Web NSS feed (`web-log-schema.md`) — `appname`, `appclass`, `app_risk_score`, `app_status`, `activity`, `apprulelabel`, etc. | Real-time SaaS app traffic flowing through the ZIA proxy |
| 2 | **SaaS Security / API CASB events** (this doc) | Cloud NSS SaaS Security feed | Data-at-rest scans, sharing events, file inventory from API-integrated SaaS tenants |
| 3 | **Shadow IT discovery report** | SaaS Security Report (UI / CSV export) | Aggregate Shadow IT view — not a real-time log feed |

Cross-reference: a single SaaS event may produce records in path #1 (the user's HTTP traffic to the SaaS app) and path #2 (the SaaS Connector's scan of the resulting file), with shared identifiers (user, app, file). Investigations often need both.

## Application categories (per-category schemas)

Per the SaaS Security Insights Logs UI (Tier A — `vendor/zscaler-help/about-saas-security-insights-logs.md`), records are organized into eight application categories, each with its own column set:

| Category | Examples | Notes |
|---|---|---|
| **Collaboration** | Slack, Microsoft Teams, Webex | Messages, file shares, channel events |
| **CRM** | Salesforce, HubSpot | Customer record events |
| **Email** | Microsoft 365 Exchange, Gmail | Inbound/outbound mail with attachments |
| **File** | Box, Dropbox, OneDrive, Google Drive | File scan, share, upload, download |
| **Gen AI** | ChatGPT, Bard, Copilot | Generative AI prompts and responses (added in newer ZIA versions) |
| **ITSM** | ServiceNow, Jira | Ticket and configuration item events |
| **Public Cloud Storage** | AWS S3, Azure Blob, GCS | Object-store scans |
| **Repository** | GitHub, GitLab, Bitbucket | Source code and asset scans |

Each category has both a **column set** (fields visible in the Insights UI / NSS feed output) and a **filter set** (queryable attributes in the Insights UI). The lists are linked from the SaaS Security Insights Logs UI ("Collaboration Columns", "Collaboration Log Filters", etc.) — these sub-pages are the authoritative per-category schema sources and are listed in [Open questions](#open-questions) as the gap to close.

## Common fields likely present across categories

Based on Zscaler's consistent NSS feed design (cross-referenced with `web-log-schema.md`'s Cloud Application section and `about-saas-security-report.md` field references), the following fields are **likely present in most or all category schemas**. Mark each as `❓ unverified — needs per-category CSV` until confirmed against the specific category's documentation.

### Time / identity (likely all categories)

| Field | Type | Description |
|---|---|---|
| `time` / `epochtime` | timestamp | Event time |
| `user` / `login` | string | User identity (email format) |
| `dept` | string | User department |
| `location` | string | Source location |

### SaaS application identity (likely all categories)

| Field | Type | Description |
|---|---|---|
| `appname` | string | SaaS application name (`Salesforce`, `Box`, `Slack`, …) — same vocabulary as Web NSS `%s{appname}` |
| `appclass` | string | App category — likely matches the eight category names above |
| `app_risk_score` | enum:closed | Risk index (`1`–`5`, `None`) — same as Web NSS `%s{app_risk_score}` |
| `app_status` | enum:closed | `Sanctioned` / `Unsanctioned` / `N/A` — same as Web NSS `%s{app_status}` |
| `inst_level1_*` / `inst_level2_*` / `inst_level3_*` | structured | App instance hierarchy (e.g., GCP Organization → Project → Resource Type) — same as Web NSS |

### Action / event (likely all categories)

| Field | Type | Description |
|---|---|---|
| `action` / `activity` | string | The action performed (`Download`, `Share`, `Scan`, …). Category-specific. |
| `severity` | enum:closed | Event severity if applicable |

### File-related (File / Email / Public Cloud Storage / Repository categories)

| Field | Type | Description |
|---|---|---|
| `filename` | string | File name (likely with `<redacted-filename>` recommended for stored tenant schemas) |
| `filetype` / `filesubtype` | string | File class / extension |
| `filesize` | bytes | File size |
| `bamd5` / `sha256` | hash | File hashes |

### DLP-related (any category with DLP rules)

| Field | Type | Description |
|---|---|---|
| `dlpdict` | multivalue:`\|` | DLP dictionaries matched — same as Web NSS `%s{dlpdict}` |
| `dlpeng` | string | DLP engine matched |
| `dlprulename` / `trig_dlprulename` | string | DLP rule that triggered |
| `dlpidentifier` | int | Unique DLP incident identifier |

### Threat / risk (likely all categories)

| Field | Type | Description |
|---|---|---|
| `threatname` / `threatseverity` | string / enum:closed | Threat detection (matches Web NSS conventions) |
| `malwarecat` / `malwareclass` | string | Malware classification |

### Sharing / access (Collaboration / File / Repository / CRM categories)

| Field | Type | Description |
|---|---|---|
| `share_type` | string | `Internal`, `External`, `Public`, `Anyone with link`, etc. (likely category-specific) |
| `recipient` / `external_collaborator` | string | Who the resource was shared with |

**Treat all rows in this section as `❓ unverified` until cross-checked against the per-category column documentation.** They are extrapolated from Web NSS conventions and SaaS Security Report references, not from a captured CASB-specific NSS CSV.

## Fields shared with Web NSS

Several CASB-adjacent fields are already documented in `references/zia/logs/web-log-schema.md` because they appear in the **Web NSS feed** (path #1) for inline CASB / Cloud App Control events:

- `appname`, `appclass`, `app_risk_score`, `app_status`, `activity`, `prompt_req`
- `inst_level1_*`, `inst_level2_*`, `inst_level3_*`
- All DLP-related fields (`dlpdict`, `dlpeng`, `dlprulename`, etc.)
- All threat fields (`threatname`, `threatseverity`, `malwarecat`)

When investigating a SaaS event, **query both feeds** if both are configured. The Web NSS feed shows the user's HTTP path to the SaaS; the SaaS Security NSS feed shows the SaaS Connector's API-side observation.

## Cloud NSS feed configuration

Per `vendor/zscaler-help/about-cloud-nss-feeds.md`:

- **Feed type**: Cloud NSS (not VM-based). The SaaS Security log type is one of several Cloud NSS feed types alongside Web, Tunnel, etc.
- **Configuration location**: ZIA admin → Logs > Log Streaming > Internet Log Streaming - Nanolog Streaming Service
- **Output formats**: JSON is supported; the feed format is configurable per-feed
- **One feed per log type per Cloud NSS instance** — meaning a single tenant has one SaaS Security feed instance, not per-category feeds
- **HTTP behavior**: 200/204 = success; 400 = batch dropped (parsing error); other codes = retry up to 1 hour
- **Per-category records arrive on the same feed**; the discriminator is a category field within the record (likely `appclass` or a dedicated category field — needs verification)

## Open questions

The per-category column sets and filter sets are referenced in `vendor/zscaler-help/about-saas-security-insights-logs.md` as separate sub-pages but are not yet captured in `vendor/zscaler-help/`. To complete this schema:

1. Capture the eight per-category column sub-pages from the Zscaler help portal:
   - Collaboration Columns / Filters
   - CRM Columns / Filters
   - Email Columns / Filters
   - File Columns / Filters
   - Gen AI Columns / Filters
   - ITSM Columns / Filters
   - Public Cloud Storage Columns / Filters
   - Repository Columns / Filters
2. Confirm whether the NSS feed format follows the same `%s{...}` / `%d{...}` specifier convention as Web/Firewall/DNS, or uses JSON-native field names (Cloud NSS supports JSON output).
3. Identify the per-record category discriminator field (likely `appclass`).
4. Cross-check against the Cloud NSS feed schema in `General_Guidelines_for_NSS_Feeds_and_Feed_Formats.txt` (vendor PDF — extraction needed).

This is tracked as a coverage gap; see also [`../../shared/siem-log-mapping.md`](../../shared/siem-log-mapping.md) under "ZIA Inline CASB / SaaS Security (NSS)".

## Cross-links

- ZIA web log schema (inline CASB / Cloud App Control fields) — [`./web-log-schema.md`](./web-log-schema.md)
- DLP dictionaries (referenced by `dlpdict` field) — [`../dlp.md`](../dlp.md) if exists, otherwise [`../../../vendor/zscaler-help/about-dlp-dictionaries.md`](../../../vendor/zscaler-help/about-dlp-dictionaries.md)
- DLP engines — [`../../../vendor/zscaler-help/about-dlp-engines.md`](../../../vendor/zscaler-help/about-dlp-engines.md)
- SIEM log mapping (CASB row) — [`../../shared/siem-log-mapping.md`](../../shared/siem-log-mapping.md)
- Cloud NSS feed configuration — [`../../../vendor/zscaler-help/about-cloud-nss-feeds.md`](../../../vendor/zscaler-help/about-cloud-nss-feeds.md)
- SaaS Security Insights UI — [`../../../vendor/zscaler-help/about-saas-security-insights-logs.md`](../../../vendor/zscaler-help/about-saas-security-insights-logs.md)
- SaaS Security Report (Shadow IT path) — [`../../../vendor/zscaler-help/about-saas-security-report.md`](../../../vendor/zscaler-help/about-saas-security-report.md)
