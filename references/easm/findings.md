---
product: easm
topic: easm-findings
title: "ZEASM Findings — field table, drill-down levels, and scoring-field caveats"
content-type: reference
last-verified: "2026-07-16"
verified-against:
  vendor/zscaler-mcp-server: 47fe874551023bf8d138c24612aa4ea0f16aaa56
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zeasm/findings.py"
  - "vendor/zscaler-sdk-python/zscaler/zeasm/models/findings.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/findings.py"
  - "vendor/zscaler-mcp-server/skills/easm/review-attack-surface/SKILL.md"
author-status: draft
---

# ZEASM Findings — field table, drill-down levels, and scoring-field caveats

> The SDK comparison is Python-only—the prior source-family audit found no Go EASM module—but MCP v0.13.3 now wraps the Python client with four read-only finding tools (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/findings.py:183-209`, `:212-283`). There is no Go field column to compare. Several finding fields are declared by attribute name only, with no value enumeration or docstring in source; those allowed-value sets are recorded as unverified under [Open questions](#open-questions), not guessed.

## Endpoint

| Operation | Method | URL | Citation |
|---|---|---|---|
| List findings | GET | `/easm/easm-ui/v1/organizations/{org_id}/findings` | `vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:74`, `:75-78` |
| Finding details (drill-down L1) | GET | `/easm/easm-ui/v1/organizations/{org_id}/findings/{finding_id}/details` | `vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:99`, `:126-129` |
| Finding evidence (drill-down L2) | GET | `/easm/easm-ui/v1/organizations/{org_id}/findings/{finding_id}/evidence` | `vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:149`, `:180-183` |
| Finding scan output (drill-down L3) | GET | `/easm/easm-ui/v1/organizations/{org_id}/findings/{finding_id}/scan-output` | `vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:203`, `:231-234` |

All findings calls require `org_id` (the org's `id` from the organizations list) — see [`overview.md § Org scoping`](overview.md#org-scoping-the-central-access-pattern).

## Collection shape

`list_findings` returns a `Findings` object containing `results` (a list of `FindingDetails`) and `total_results` (`vendor/zscaler-sdk-python/zscaler/zeasm/models/findings.py:38-39`; docstring at `vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:48-49`). There are no page cursors on this collection (contrast Organizations — see [`overview.md § Open questions`](overview.md#open-questions)).

## Finding field table (`FindingDetails`)

Each row gives the Python attribute, the wire key in `request_format`, and line citations. No Go column exists (Python-only surface).

| Python attr | Wire key | Citation (attr / wire key) |
|---|---|---|
| `id` | `id` | `models/findings.py:75` / `:121` |
| `name` | `name` | `models/findings.py:80` / `:126` |
| `description` | `description` | `models/findings.py:72` / `:118` |
| `category` | `category` | `models/findings.py:69` / `:115` |
| `type` | `type` | `models/findings.py:87` / `:133` |
| `risk_level` | `risk_level` | `models/findings.py:82` / `:128` |
| `risk_score` | `risk_score` | `models/findings.py:83` / `:129` |
| `severity_score` | `severity_score` | `models/findings.py:85` / `:131` |
| `scan_type` | `scan_type` | `models/findings.py:84` / `:130` |
| `status` | `status` | `models/findings.py:86` / `:132` |
| `cisa_likelihood` | `cisa_likelihood` | `models/findings.py:70` / `:116` |
| `epss_likelihood` | `epss_likelihood` | `models/findings.py:73` / `:119` |
| `country` | `country` | `models/findings.py:71` / `:117` |
| `is_stale` | `is_stale` | `models/findings.py:78` / `:124` |
| `first_seen` | `first_seen` | `models/findings.py:74` / `:120` |
| `last_seen` | `last_seen` | `models/findings.py:79` / `:125` |
| `impacted_asset_id` | `impacted_asset_id` | `models/findings.py:76` / `:122` |
| `impacted_asset_name` | `impacted_asset_name` | `models/findings.py:77` / `:123` |
| `profile_id` | `profile_id` | `models/findings.py:81` / `:127` |

## Drill-down — three levels of detail per finding

A single finding can be inspected at three increasing depths:

1. **Details** — `get_finding_details` returns a `FindingDetails` object, the full structured field set in the table above (`vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:99,126-129,144`).
2. **Evidence** — `get_finding_evidence` returns "a SUBSET of the scan output obtained for the associated asset that can be attributed to the finding" (`vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:149-154`). Returns `CommonFindings` (`findings.py:198`).
3. **Scan output** — `get_finding_scan_output` retrieves the "complete scan output" — the full output, not a subset (`vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:203-205`). Returns `CommonFindings` (`findings.py:249`).

### Evidence and scan-output share one shape

Both evidence and scan-output return the **same** model — `CommonFindings` — with exactly two fields: `content` and `source_type` (`vendor/zscaler-sdk-python/zscaler/zeasm/models/findings.py:139,154-155`; evidence at `vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:198`, scan-output at `:249`). The difference between L2 and L3 is the scope of the data (subset vs. complete), not the response schema.

## MCP tool note — argument naming

The registered MCP finding tools expose `org_id` in their Pydantic input schemas, matching the SDK parameter name (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/findings.py:32-38`, `:41-51`, `:183-191`, `:212-220`, `:242-251`, `:274-283`; SDK signatures at `vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:39`, `:99`, `:149`, `:203`). The product SKILL.md examples use `organization_id`, which does not match the registered MCP input schema (`vendor/zscaler-mcp-server/skills/easm/review-attack-surface/SKILL.md:57-69`, `:89`, `:256`).

## Open questions

- **`scan_type` allowed values.** Present as an attribute (`vendor/zscaler-sdk-python/zscaler/zeasm/models/findings.py:84`) but the source gives no enumeration, validator, or docstring describing its possible values. Allowed values unverified from source. (Tracked as `easm-01` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#easm-01-finding-scan_type-allowed-values).)
- **`risk_level` / `severity_score` / `status` allowed values.** None of these finding fields carry value enumerations, validators, or docstrings in the SDK model (`vendor/zscaler-sdk-python/zscaler/zeasm/models/findings.py:82-86`). The model declares the attribute names and passes through whatever the API returns. Concrete value sets unverified. (The `risk_level` / `cisa_likelihood` / `epss_likelihood` value semantics are tracked as `easm-02` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#easm-02-finding-risk-field-value-semantics).)
- **`cisa_likelihood` — CISA-KEV interpretation.** The SDK declares only the attribute name `cisa_likelihood` (`vendor/zscaler-sdk-python/zscaler/zeasm/models/findings.py:70`) with no docstring or comment tying it to CISA-KEV and no value/format description. The CISA-KEV reading is not stated in source. Unverified.
- **`epss_likelihood` — EPSS interpretation / format.** The SDK declares only the attribute name `epss_likelihood` (`vendor/zscaler-sdk-python/zscaler/zeasm/models/findings.py:73`) with no docstring tying it to EPSS and no note on whether it is a 0-1 probability. Unverified.
- **`country` format.** Present as an attribute (`vendor/zscaler-sdk-python/zscaler/zeasm/models/findings.py:71`) with no docstring saying whether it is an ISO code, a country name, or asset geolocation. Format unverified.

## Cross-links

- Service overview, base path, org scoping: [`overview.md`](overview.md)
- Lookalike-domain findings: [`lookalike-domains.md`](lookalike-domains.md)
