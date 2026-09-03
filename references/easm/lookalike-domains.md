---
product: easm
topic: easm-lookalike-domains
title: "ZEASM Lookalike Domains — model fields, the raw-domain key, and narrative-only signals"
content-type: reference
last-verified: "2026-09-03"
verified-against:
  vendor/zscaler-mcp-server: 809f68d6c921e0829fb2e07e9b797e7e70cf720b
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zeasm/lookalike_domains.py"
  - "vendor/zscaler-sdk-python/zscaler/zeasm/models/lookalike_domains.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/lookalike_domains.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py"
  - "vendor/zscaler-mcp-server/skills/easm/review-attack-surface/SKILL.md"
  - "vendor/zscaler-mcp-server/tests/test_provenance.py"
author-status: draft
---

# ZEASM Lookalike Domains — model fields, the raw-domain key, and narrative-only signals

> The SDK comparison is Python-only—the prior source-family audit found no Go EASM module—but MCP v0.15.4 wraps the Python client with read-only list/get tools (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/lookalike_domains.py:67-98`, `:101-133`). The list tool unwraps the SDK collection's `results`, and both tools return full SDK model records through the shared record-preserving shapers; these are SDK-model records, not raw HTTP responses (`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py:43-56`; `vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py:50-113`). The SDK model defines a fixed attribute set; signals that appear only in illustrative product narrative (similarity score, active-hosting, MX/DNS) are NOT source fields and are recorded under [Open questions](#open-questions).

## Endpoints

| Operation | Method | URL | Citation |
|---|---|---|---|
| List lookalike domains | GET | `/easm/easm-ui/v1/organizations/{org_id}/lookalike-domains` | `vendor/zscaler-sdk-python/zscaler/zeasm/lookalike_domains.py:72-76` |
| Get one lookalike domain | GET | `/easm/easm-ui/v1/organizations/{org_id}/lookalike-domains/{lookalike_raw}/details` | `vendor/zscaler-sdk-python/zscaler/zeasm/lookalike_domains.py:123-127` |

Both calls require `org_id` (the org's `id` from the organizations list) — see [`overview.md § Org scoping`](overview.md#org-scoping-the-central-access-pattern).

## Collection shape

`list_lookalike_domains` returns a `LookALikeDomains` object whose `results` is a list of `LookalikeDomainDetails`, plus `total_results` (`vendor/zscaler-sdk-python/zscaler/zeasm/lookalike_domains.py:92`; `vendor/zscaler-sdk-python/zscaler/zeasm/models/lookalike_domains.py:38-41`). No page cursors on this collection (see [`overview.md § Open questions`](overview.md#open-questions)).

## Keyed by the raw domain string, not an ID

`get_lookalike_domain(org_id, lookalike_raw)` is keyed by the **raw domain string**, not an opaque ID. The `lookalike_raw` argument is documented as the domain name, e.g. `assuredartners.com` (`vendor/zscaler-sdk-python/zscaler/zeasm/lookalike_domains.py:97,103`), and the URL is built as `/lookalike-domains/{lookalike_raw}/details` (`lookalike_domains.py:123-127`).

The same raw domain string is also the model's `lookalike_raw` field; the legitimate domain it imitates is held in `original_domain` (`vendor/zscaler-sdk-python/zscaler/zeasm/models/lookalike_domains.py:78-79`).

### MCP tool note — key naming

The registered MCP get-tool input schema uses `lookalike_raw` for the raw domain string, matching the SDK parameter name (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/lookalike_domains.py:39-54`, `:97-125`; SDK signature at `vendor/zscaler-sdk-python/zscaler/zeasm/lookalike_domains.py:97-103`). The product SKILL.md uses `domain_id`, which does not match the registered MCP input schema (`vendor/zscaler-mcp-server/skills/easm/review-attack-surface/SKILL.md:89`).

At v0.15.4, both the list and get tools carry the `untrusted_content` flag:
their lookalike hostname and registrant/registrar fields are authored by whoever
registered the lookalike domain (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/lookalike_domains.py:67-109`).
The two tools are EASM entries in the exact global eight-tool set
(`vendor/zscaler-mcp-server/tests/test_provenance.py:60-69`, `:150-153`). The v0.15.4
release resolves the prior list-tool metadata-coverage omission; the banner
remains text-only and does not alter structured content beyond the global
output sanitizer that applies independently of provenance metadata
(`vendor/zscaler-mcp-server/CHANGELOG.md:3-11`;
`vendor/zscaler-mcp-server/tests/test_provenance.py:114-128`). Treat this as
an MCP metadata boundary, not as EASM product behavior or evidence that any
particular list result is trusted.

## Lookalike-domain field set (`LookalikeDomainDetails`)

The complete attribute set is exactly the fourteen fields below — no others exist in source (`vendor/zscaler-sdk-python/zscaler/zeasm/models/lookalike_domains.py:71-86`). No Go column exists (Python-only surface).

| Python attr | Notes | Citation |
|---|---|---|
| `lookalike_raw` | The raw imitating domain string (also the get key) | `models/lookalike_domains.py:78` |
| `original_domain` | The legitimate domain being imitated | `models/lookalike_domains.py:79` |
| `risk_score` | Risk score | `models/lookalike_domains.py:84`; wire `:120` |
| `risk_category` | Risk category | `models/lookalike_domains.py:83`; wire `:119` |
| `deception_method` | **List of strings** — the only list-typed field (`ZscalerCollection.form_list(..., str)`) | `models/lookalike_domains.py:72-74` |
| `is_registered` | Registration flag | `models/lookalike_domains.py:77` |
| `registrar` | Registrar | `models/lookalike_domains.py:81` |
| `registered_by` | Registrant | `models/lookalike_domains.py:80` |
| `created_date` | Creation date | `models/lookalike_domains.py:71` |
| `expiration_date` | Expiration date | `models/lookalike_domains.py:76` |
| `updated_date` | Update date | `models/lookalike_domains.py:86` |
| `description` | Description | `models/lookalike_domains.py:75` |
| `remediation` | Remediation | `models/lookalike_domains.py:82` |
| `status` | Status | `models/lookalike_domains.py:85` |

`deception_method` is the only list-typed field — every other attribute is scalar (`vendor/zscaler-sdk-python/zscaler/zeasm/models/lookalike_domains.py:72-74`).

## What the model does NOT contain

The `LookalikeDomainDetails` model has **no similarity-score field, no active-hosting flag, and no MX/DNS field** (`vendor/zscaler-sdk-python/zscaler/zeasm/models/lookalike_domains.py:71-86`). The full attribute set is exactly the fourteen above. Anything outside that set is not a source field.

## Open questions

- **"Similarity / registration recency / active hosting / MX" risk signals.** None of these appear as named fields in the lookalike model; the model has `risk_score`, `risk_category`, `deception_method` (list), `is_registered`, `created_date`/`expiration_date`/`updated_date`, `registrar`, and `registered_by` (`vendor/zscaler-sdk-python/zscaler/zeasm/models/lookalike_domains.py:71-86`). The four signals appear only in the illustrative SKILL.md report table (`vendor/zscaler-mcp-server/skills/easm/review-attack-surface/SKILL.md:185-189`), which is example narrative, not a source field list. Treat similarity-score, active-hosting, and MX/DNS as unverified from SDK source.

## Cross-links

- Service overview, base path, org scoping: [`overview.md`](overview.md)
- Findings field table and drill-down: [`findings.md`](findings.md)
