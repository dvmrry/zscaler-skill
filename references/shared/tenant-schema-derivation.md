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

Once generated, store the tenant schema in your private fork or CLAUDE.md using this template. The columns adapt per SIEM, but the **Canonical match** column is the invariant — it ties the empirical view back to the published reference, with a verifiable file-and-line reference.

### Required metadata header

```markdown
# Tenant schema — <Zscaler log type> (<SIEM> <index/table/etc.>: <name>)

- **Generated**: <YYYY-MM-DD HH:MM TZ>
- **Time window**: <start> — <end> (<duration, e.g., 7d>)
- **Sample size**: <approximate event count, e.g., ~1.4M>
- **TA / parser / module / agent version**: <e.g., Zscaler ZIA Splunk TA 4.0.5 (Splunkbase 3865)>
- **Generated by**: <agent / user>
- **Re-derive when**:
  - TA / parser / agent version changes
  - Sourcetype / table / index naming changes
  - LSS or NSS feed configuration changes
  - More than ~30 days have elapsed (drift in field coverage / value distributions)
```

The metadata is non-negotiable. Without time window + version, comparison and re-derivation become guesswork.

### Type vocabulary

Every row's **Type** column uses one of these values. Stay in this vocabulary for portability across SIEMs.

| Type | Meaning | Examples |
|---|---|---|
| `string` | Free-text or short identifier | `url`, `host`, `login` |
| `int` | Integer (counts, ports, sizes when not distinguished as `bytes`) | `respcode`, `clt_sport` |
| `bool` | Boolean / yes-no flag | `ssldecrypted` (`Yes`/`No`), `srvwildcardcert` |
| `ipv4` / `ipv6` | IP address | `cip`, `sip` |
| `timestamp:epoch` / `timestamp:iso8601` | Time, with format suffix | `epochtime`, `time` |
| `enum:closed` | Small finite set; list all values in **Sample values** | `action` (`Allowed`/`Blocked`), `urlcatmethod` |
| `enum:open` | Large but bounded set; sample-only in **Sample values** | `urlcat`, `appname` |
| `multivalue:<delim>` | Delimited list field | `dlpdict` (pipe-delimited), `other_dlprulenames` (comma) |
| `hash:md5` / `hash:sha256` | Cryptographic hash | `bamd5`, `sha256` |
| `bytes` | Numeric byte count | `respsize`, `totalsize` |
| `structured` | Object / nested JSON; describe inline | `dlpdicthitcount` paired with `dlpdict` |

Mark uncertainty: `enum:closed?` if you suspect a closed set but haven't fully observed it; reviewers can verify.

### Sample value formatting rules

The **Sample values** column is comma-separated and follows these rules:

- **Maximum 5 values** per cell. If more distinct values exist, append `… (+N more)`.
- **Truncate each value to 80 characters**. Use `<truncated>` suffix if a value exceeds.
- **Apply redaction** (see [Privacy and sensitive data handling](#privacy-and-sensitive-data-handling)) before placing values in the column.
- **Preserve enum casing exactly** — `Allowed` is not the same as `allowed` for canonical match purposes.
- **For empty / null fields** (0% coverage): write `<empty>` and flag in coverage notes.
- **For multivalue fields**: show each delimiter-separated element as a separate sample, not the joined raw value.

### Canonical match column — verification

The **Canonical match** column is structured: `<status> <canonical specifier> at <file>:L<line>`. Status uses these markers:

| Marker | Meaning |
|---|---|
| ✅ | Direct match — tenant field name and semantics align with canonical |
| ⚠️ | TA / parser alias — tenant field is a CIM alias or alternate name; semantics align |
| 🔗 | Multi-source — the canonical maps to this tenant field from more than one log type (1:N) |
| ❌ | No canonical match — local enrichment, custom extraction, or unknown |
| ❓ | Unverified — claimed match not yet confirmed against the canonical schema file |

Always include the **file path + line number** for verifiable matches. `❓` rows are findings — schedule verification before relying on them.

### Field table

```markdown
| Field (tenant) | Type | Coverage | Sample values | Canonical match | Notes |
|---|---|---|---|---|---|
| url | string | 1.4M / 1.4M (100%) | mail.google.com, www.example.com, … | ✅ `%s{url}` at `references/zia/logs/web-log-schema.md`:L125 | direct |
| urlfilterrulelabel | string | 920k / 1.4M (66%) | URL_Filtering_1, URL_Filtering_2 | ✅ `%s{urlfilterrulelabel}` at `references/zia/logs/web-log-schema.md`:L70 | Block-only field, 34% empty is expected |
| dest_host | string | 1.4M / 1.4M (100%) | mail.google.com, … | ⚠️ `%s{host}` at `references/zia/logs/web-log-schema.md`:L124 | TA CIM alias for `host` |
| user | string | 1.4M / 1.4M (100%) | <redacted-user>, … | 🔗 `%s{login}` (web) at `references/zia/logs/web-log-schema.md`:L57 OR `Username` (ZPA) at `references/zpa/logs/access-log-schema.md` | TA-aliased; multi-source via CIM |
| clt_sport | int | 0 / 1.4M (0%) | <empty> | ✅ `%d{clt_sport}` at `references/zia/logs/web-log-schema.md`:L137 | requires Zscaler Support enablement |
| local_enrichment | string | 1.4M / 1.4M (100%) | <redacted> | ❌ — | local enrichment, not in canonical |
| custom_severity | enum:closed? | 1.4M / 1.4M (100%) | LOW, MEDIUM, HIGH | ❓ — | unverified; possible local mapping of `threatseverity` |
```

### Coverage notes (formalized)

After the field table, include three explicit lists:

```markdown
## Coverage notes

### Canonical fields missing from tenant
List canonical fields with no tenant counterpart and the likely cause:
- `%d{clt_sport}` — requires Zscaler Support enablement (per canonical schema)
- `%d{srv_dport}` — requires Zscaler Support enablement
- `%s{dlprulename}` — requires Zscaler Support enablement
- `%s{df_hostname}` — requires TLS Inspection enabled
- `%s{<other>}` — TA not installed / sourcetype misconfigured / extraction failed

### Tenant fields not in canonical
List tenant fields with no canonical counterpart and the suspected cause:
- `local_enrichment` — local pipeline enrichment
- `dest_host`, `src_ip` — TA CIM aliases (cross-reference `splunk-queries.md` TA mapping table)
- `<other>` — unknown; flag for investigation

### Empty / 0% coverage fields
List fields present in the tenant schema but populated in 0% of events:
- `<field>` — flagged as ❌ Empty in field table; investigate before relying on
```

### Duplicate / aliased fields

When the same canonical field is exposed under multiple tenant names (e.g., the TA aliases `host` to `dest_host`, but the original `host` is also extracted), include both rows. Mark the alias with ⚠️ and reference the same canonical specifier — the multi-row 1:N relationship is information, not noise.

## Cross-SIEM validation

For tenants running more than one SIEM (e.g., Splunk for ZIA Web + Sentinel for ZPA, or migration in progress), the same Zscaler log type ingested by two SIEMs should produce *semantically equivalent* fields after each SIEM's parsing layer. Cross-validating catches parser drift, TA / connector / module version skew, and per-SIEM extraction divergence.

### Process

1. **Generate a tenant schema for each SIEM** using the recipes above. Each gets its own metadata header (TA / parser / agent version).
2. **Map each tenant field to canonical** — every row's `Canonical match` column points back to the same canonical schema file across both SIEMs.
3. **Diff the canonical-coverage** — for each canonical field, compare ✅ / ⚠️ / ❌ / ❓ status across SIEMs.
4. **Flag asymmetries**:
   - Canonical field ✅ in SIEM A, ❌ in SIEM B → parser / TA divergence; check version skew or extraction config
   - Canonical field present in both but with different ⚠️ alias names → expected (different CIMs); document
   - Canonical field with different `enum:closed` value sets across SIEMs → one SIEM has a stale parser version; surface for investigation
   - Coverage % differs >20% → ingestion-side filtering or sampling difference; verify feed config

### Comparison template

```markdown
# Cross-SIEM validation — <Zscaler log type>

| Canonical field | SIEM A (<name>) | SIEM B (<name>) | Asymmetry |
|---|---|---|---|
| `%s{url}` | ✅ `url` 100% | ✅ `url` 100% | none |
| `%s{host}` | ⚠️ `dest_host` 100% (TA CIM) | ✅ `host` 100% | naming only; semantics align |
| `%s{urlfilterrulelabel}` | ✅ 66% | ❌ — | SIEM B parser missing rule label extraction |
| `%d{respcode}` | enum: `200`, `403`, `500`… | enum: `200`, `403` only | SIEM B parser stale; missing `500` |
```

Cross-SIEM validation results are **private artifacts** — same privacy rules as the underlying tenant schemas.

## Privacy and sensitive data handling

Tenant schemas are **private artifacts**. The empirical output reveals:

- Tenant-specific index / sourcetype / table / source-category names
- Sample field values — potentially user identifiers, hostnames, internal IPs, URLs visited, file names, user agents
- Custom enrichments and field extractions (may reflect internal pipeline IP)
- Operational data — event counts implying traffic volume, user count, geographic spread

### Storage rules

| Generated tenant schemas… | …go here | …never go here |
|---|---|---|
| ✅ Private fork of this skill | ✅ CLAUDE.md (project or user) | ❌ This public repo |
| ✅ Auto-memory | ✅ Internal docs / wikis | ❌ Public PRs, gists, pastebins |
| ✅ Local config / env files | | ❌ External presentations or screenshots |

The recipes and template above are public; the data they produce is not. When pasting tenant schema content into a chat with the agent, treat it the same way you'd treat any other tenant data — fine for the local conversation, do not commit upstream.

### Redaction patterns for sample values

Apply these patterns *before* the values land in the **Sample values** column. Default to over-redact; reviewers can request specific values be unredacted if needed.

| Field type | Redaction marker | Example before → after |
|---|---|---|
| IPv4 (internal) | `<redacted-ipv4-internal>` | `192.168.2.200` → `<redacted-ipv4-internal>` |
| IPv4 (public) | `<redacted-ipv4-public>` | `203.0.113.5` → `<redacted-ipv4-public>` |
| IPv6 | `<redacted-ipv6>` | `2001:db8::2:1` → `<redacted-ipv6>` |
| Email / login | `<redacted-user>` or domain-only | `jdoe@example.com` → `<redacted-user>` or `***@example.com` |
| URL (full) | host-keep, path-redact | `www.example.com/private/page?id=42` → `www.example.com/<redacted-path>` |
| Hostname (internal) | `<redacted-hostname>` | `THINKPADSMITH` → `<redacted-hostname>` |
| User agent | class-only | `Mozilla/5.0 (Windows NT 6.1…)` → `Firefox <redacted-ua-detail>` |
| File name | `<redacted-filename>` | `Q4_FY26_pipeline.xlsx` → `<redacted-filename>` |
| Hash (MD5 / SHA-256) | prefix-only | `81ec78bc…ab15c` → `81ec78***` |
| Custom enrichment | `<redacted>` | (whole-value redact unless safe) |
| Public domains / well-known IPs | as-is | `1.1.1.1`, `mail.google.com` keep |

### What's safe to leave un-redacted

- Public DNS providers and well-known anycast IPs (1.1.1.1, 8.8.8.8) — operationally informative, not tenant-revealing
- Public SaaS hostnames (`mail.google.com`, `dropbox.com`) — same
- Zscaler-published enum values (`Allowed`, `Blocked`, `Sandbox Adware`) — these are canonical, not tenant data
- Field names themselves — unless the field name is itself a custom local-only identifier

### When in doubt

Redact. The tenant schema is for confirming "what's queryable in this environment"; the *meaning* of fields and *types* of values are the important signals, not the specific user / URL / IP examples. A schema with all sample values redacted is still useful for query generation; a schema with leaked PII is a problem.

## Cross-links

- [`siem-log-mapping.md`](./siem-log-mapping.md) — canonical log type catalog (the reference side of the canonical/tenant pair)
- [`siem-emission-discipline.md`](./siem-emission-discipline.md) — public/private boundary, where user plumbing lives
- [`splunk-queries.md`](./splunk-queries.md) — Splunk SPL pattern catalog; includes Zscaler TA CIM mapping table
- [`investigate-prompt.md`](./investigate-prompt.md) — `/investigate` slash command playbook
- ZIA log schemas (canonical) — [`../zia/logs/`](../zia/logs/)
- ZPA log schemas (canonical) — [`../zpa/logs/`](../zpa/logs/)
