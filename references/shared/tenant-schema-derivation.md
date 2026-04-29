---
product: shared
topic: "tenant-schema-derivation"
title: "Canonical vs. tenant schemas — derivation recipes per SIEM"
content-type: reference
last-verified: "2026-04-29"
confidence: medium
source-tier: practice
sources:
  - "Splunk Search Reference (fieldsummary command)"
  - "Microsoft Sentinel KQL reference (getschema, summarize)"
  - "Elastic field_caps API"
  - "Zscaler NSS / LSS published schemas (referenced as canonical)"
author-status: draft
---

# Canonical vs. tenant schemas

Two complementary log-schema artifacts that serve different purposes. The agent driving an investigation benefits from cross-referencing both when available.

## The two artifacts

|  | Canonical schema | Tenant schema |
|---|---|---|
| **What it is** | Zscaler's published log format | Empirical view of what's in *your* SIEM after parsing / TA / aliases / customer pipeline |
| **Source** | NSS / LSS docs, Zscaler-published CSVs | `fieldsummary` (Splunk), `getschema` (Sentinel KQL), `_field_caps` (Elastic), parser-produced UDM (Chronicle), Field Schema tool (Sumo) |
| **Where it lives** | Public repo: `references/{zia,zpa,zcc}/logs/` | Private: user's fork, CLAUDE.md, auto-memory |
| **Authoritative on** | What fields *could* exist + their semantic meaning, types, enum values | What fields are *actually* queryable in this index / sourcetype / table right now |
| **Best use** | Picking the right field for a hypothesis; understanding meaning of values | Confirming the field is extracted, has non-zero data, has expected value distribution |

These are not redundant. They're complementary. The canonical answers "what *should* be in this log type per Zscaler"; the tenant answers "what *is* in your SIEM after processing." Cross-referencing catches TA misconfiguration, missing extractions, custom enrichments, and Zscaler Support-gated fields that aren't enabled.

## When to consult which

- **Canonical only** — no tenant schema available. "What fields might tell me about X" → pick from canonical.
- **Tenant only** — rare; usually means you're looking at an unfamiliar index without a Zscaler reference. Resolve by identifying which canonical log type it maps to.
- **Both** (preferred) — cross-validate. Canonical says field exists; tenant confirms it's extracted with non-zero data and the values match the canonical examples. Mismatch is a finding:
  - Field in canonical, missing in tenant → TA not installed, sourcetype misconfigured, or Zscaler Support-enablement required (e.g., `%d{clt_sport}`, `%d{srv_dport}`, `%s{dlprulename}`)
  - Field in tenant, not in canonical → custom enrichment, local extraction, or possibly a CIM alias added by the TA (check the TA mapping table in [`splunk-queries.md`](./splunk-queries.md))
  - Values in tenant don't match canonical enums → tenant has stale TA version or out-of-band data transformation

## Recipes — derive a tenant schema per SIEM

These produce the empirical view. Run against a single index / sourcetype / table at a time.

### Splunk

Field summary across a sourcetype:

```spl
index=<your_index> sourcetype=<your_sourcetype> earliest=-7d
| fieldsummary maxvals=5
| table field count distinct_count numeric_count mean values
```

For per-field value distribution on a specific field of interest:

```spl
index=<your_index> sourcetype=<your_sourcetype> earliest=-1d
| stats count by <field>
| sort -count
```

To discover all sourcetypes in an index (useful when mapping tenant naming to canonical log types):

```spl
| metadata type=sourcetypes index=<your_index>
| sort -totalCount
```

### Microsoft Sentinel (KQL)

Schema of a table (column names + types):

```kql
<YourTable>
| getschema
```

Field value distribution and counts (Sentinel doesn't have a direct fieldsummary equivalent; build it):

```kql
<YourTable>
| where TimeGenerated > ago(7d)
| summarize count(), dcount(<field>), make_set(<field>, 5) by <field>
```

To discover tables in the workspace:

```kql
union withsource=TableName *
| where TimeGenerated > ago(1d)
| summarize count() by TableName
| order by count_ desc
```

### Google SecOps / Chronicle (UDM / YARA-L)

Chronicle uses UDM (Unified Data Model) — strongly typed, schema is published at `udm.json`. The tenant view is what your parser actually populates:

- Open the data ingestion / parser configuration in the Chronicle UI to see UDM fields produced by your active Zscaler parser
- For runtime sampling, query a small set and inspect populated fields:

```yara-l
events:
  $e.metadata.log_type = "ZSCALER_WEBPROXY"

match:
  $e.metadata.event_timestamp.seconds

condition:
  $e
```

Treat the parser output as the tenant schema. Mismatches against the canonical Zscaler schema usually indicate parser version skew.

### Elastic

Field caps for an index pattern:

```
GET logs-zscaler-*/_field_caps?fields=*
```

Field summary and value sampling via ES|QL:

```esql
FROM logs-zscaler-web-*
| WHERE @timestamp > NOW() - 7 days
| STATS count = COUNT(*) BY <field>
| LIMIT 20
```

Or use Kibana's Discover field list against the index pattern.

### Sumo Logic

The Field Schema tool in the Sumo UI lists extracted fields per source category. For runtime sampling:

```
_sourceCategory=<your_category>
| limit 1000
| fields <field>
| count by <field>
| sort count
```

To discover source categories:

```
* | count by _sourceCategory | sort count
```

## Tenant schema template

Once generated, store the tenant schema in your private fork or CLAUDE.md using this template. The columns adapt per SIEM, but the **Canonical match** column is the invariant — it ties the empirical view back to the published reference.

```markdown
# Tenant schema — <Zscaler log type> (<SIEM> <index/table/etc.>: <name>)

Generated: <YYYY-MM-DD> from <window, e.g., 7d>
TA / parser / module version: <version if known>

| Field (tenant name) | Type | Count | Distinct | Sample values | Canonical match | Notes |
|---|---|---|---|---|---|---|
| url | string | 1.4M | 47k | mail.google.com, … | `%s{url}` ✅ | direct |
| urlfilterrulelabel | string | 920k | 23 | URL_Filtering_1, … | `%s{urlfilterrulelabel}` ✅ | direct |
| dest_host | string | 1.4M | 47k | mail.google.com, … | `%s{host}` ⚠️ | TA CIM alias |
| <local_enrichment> | string | 1.4M | 12 | … | — ❌ | local enrichment, not in canonical |

## Coverage notes

- Canonical fields **missing** in tenant: <list> — possible causes: TA not installed, sourcetype misconfigured, Zscaler-Support-enablement-required (`clt_sport`, `srv_dport`, `dlprulename`)
- Tenant fields **not in canonical**: <list> — local enrichments, custom extractions, TA CIM aliases not yet documented in this skill kit's TA mapping table
- TA CIM aliases observed: <list> — cross-reference [`splunk-queries.md`](./splunk-queries.md) Zscaler Technology Add-on table
```

## Privacy and where to keep generated tenant schemas

Tenant schemas are **private artifacts**. The empirical output reveals:

- Tenant-specific index / sourcetype / table / source-category names
- Sample field values — potentially user identifiers, hostnames, internal IPs, URLs visited
- Custom enrichments and field extractions (may reflect internal pipeline IP)
- Operational data (event counts implying traffic volume, user count, geographic spread)

| Generated tenant schemas… | …go here | …never go here |
|---|---|---|
| ✅ Private fork of this skill | ✅ CLAUDE.md (project or user) | ❌ This public repo |
| ✅ Auto-memory | ✅ Internal docs / wikis | ❌ Public PRs, gists, pastebins |
| ✅ Local config / env files | | ❌ External presentations or screenshots |

The recipes and template above are public; the data they produce is not. When pasting tenant schema content into a chat with the agent, treat it the same way you'd treat any other tenant data — fine for the local conversation, do not commit upstream.

## Cross-links

- [`siem-log-mapping.md`](./siem-log-mapping.md) — canonical log type catalog (the reference side of the canonical/tenant pair)
- [`siem-emission-discipline.md`](./siem-emission-discipline.md) — public/private boundary, where user plumbing lives
- [`splunk-queries.md`](./splunk-queries.md) — Splunk SPL pattern catalog; includes Zscaler TA CIM mapping table
- [`investigate-prompt.md`](./investigate-prompt.md) — `/investigate` slash command playbook
- ZIA log schemas (canonical) — [`../zia/logs/`](../zia/logs/)
- ZPA log schemas (canonical) — [`../zpa/logs/`](../zpa/logs/)
