---
product: easm
topic: overview
title: "External Attack Surface Management (ZEASM) — SDK surface, org scoping, and resources"
content-type: reference
last-verified: "2026-09-03"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-mcp-server: 809f68d6c921e0829fb2e07e9b797e7e70cf720b
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zeasm/findings.py"
  - "vendor/zscaler-sdk-python/zscaler/zeasm/lookalike_domains.py"
  - "vendor/zscaler-sdk-python/zscaler/zeasm/organizations.py"
  - "vendor/zscaler-sdk-python/zscaler/zeasm/zeasm_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zeasm/models/organizations.py"
  - "vendor/zscaler-sdk-python/zscaler/zeasm/models/common.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/organizations.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/findings.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/lookalike_domains.py"
  - "vendor/zscaler-mcp-server/docsrc/tools/easm/index.rst"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
  - "vendor/zscaler-mcp-server/skills/easm/review-attack-surface/SKILL.md"
  - "vendor/zscaler-mcp-server/tests/test_provenance.py"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# External Attack Surface Management (ZEASM) — SDK surface, org scoping, and resources

> Sourced from the Zscaler Python SDK `zeasm` package, the MCP-server EASM tool
> layer, and the vendor OneAPI Postman collection. Every claim carries an inline
> `vendor/...:NN` citation. Postman examples are identified as examples rather
> than promoted to a complete SDK model or a promise of server behavior.

## What it is

The Python SDK `zeasm` service tracks findings "identified and tracked for an organization's internet-facing assets scanned by EASM" (`vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:28-31`, `:41-42`). The MCP-server EASM tooling expands the product name as **External Attack Surface Management** (`vendor/zscaler-mcp-server/docsrc/tools/easm/index.rst:1`); the SDK itself uses the code name **ZEASM** throughout and does not spell out the acronym.

The service exposes exactly three sub-resources — `organizations`, `findings`, and `lookalike_domains` — wired via the `ZEASMService` property accessors (`vendor/zscaler-sdk-python/zscaler/zeasm/zeasm_service.py:29-51`).

That statement is scoped to the Python SDK. The newer OneAPI Postman collection
also documents four GET-only asset inventory and asset-detail operations that
are not present as a fourth `ZEASMService` accessor
(`vendor/zscaler-api-specs/oneapi-postman-collection.json:136239-136270`,
`:136412-136443`, `:136585-136616`, `:136757-136775`;
`vendor/zscaler-sdk-python/zscaler/zeasm/zeasm_service.py:29-51`).

### Python SDK and MCP surface

The product is implemented in the Python SDK and exposed through seven read-only MCP tools (`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:419-431`). The Go SDK ships no EASM/ZEASM module: the prior source-family audit found no `zeasm` directory or `easm` service files under `vendor/zscaler-sdk-go/`. There is therefore no Python-vs-Go field-table divergence to flag; the field facts below come from the Python SDK and current MCP SDK-record passthroughs rather than a Go implementation.

## Base path

All three ZEASM resources share the base endpoint `/easm/easm-ui/v1`, defined identically as the class constant `_zeasm_base_endpoint` in each resource client (`vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:33`; `vendor/zscaler-sdk-python/zscaler/zeasm/lookalike_domains.py:33`; `vendor/zscaler-sdk-python/zscaler/zeasm/organizations.py:32`).

## Org scoping — the central access pattern

The defining shape of the ZEASM SDK is that **almost everything is scoped to an organization**, and you must list organizations first to get the `org_id` needed for the other calls.

- **Listing organizations requires no scope.** `list_organizations()` takes no parameters and hits `GET /easm/easm-ui/v1/organizations` (`vendor/zscaler-sdk-python/zscaler/zeasm/organizations.py:38`, `:78-81`).
- **`org_id` is required for every findings and lookalike call.** Every findings method (`list_findings`, `get_finding_details`, `get_finding_evidence`, `get_finding_scan_output`) takes `org_id` as the first positional arg (`vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:39,99,149,203`), and the URL is built as `/organizations/{org_id}/...` in each (`findings.py:77,128,182,233`). Every lookalike method (`list_lookalike_domains`, `get_lookalike_domain`) likewise takes `org_id` (`vendor/zscaler-sdk-python/zscaler/zeasm/lookalike_domains.py:39,97`), with `/organizations/{org_id}/...` URLs (`lookalike_domains.py:75,126`).
- **`org_id` is the `id` field from the organizations list.** The SDK docstring example takes `orgs.results[0].id` and uses it as `org_id` for the other ZEASM APIs (`vendor/zscaler-sdk-python/zscaler/zeasm/organizations.py:59-67`).
- **Examples use a UUID-shaped `org_id` value.** SDK and bundled MCP documentation examples use a UUID-shaped `org_id` value (`vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:53-58`; `vendor/zscaler-mcp-server/docsrc/tools/easm/index.rst:90-92`). The current MCP input schema declares `org_id` only as `str`, so those examples do not establish UUID-shape enforcement (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/findings.py:32-38`).

### Where orgs come from

Both the SDK and current MCP tool call it the EASM Admin Portal (`vendor/zscaler-sdk-python/zscaler/zeasm/organizations.py:38-40`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/organizations.py:45-52`).

## Resource models

### Organizations collection

The SDK organizations collection carries `next_page`, `prev_page`, `results`, and `total_results` (`vendor/zscaler-sdk-python/zscaler/zeasm/models/organizations.py:39-42`) — it is the only ZEASM collection in source that models page cursors (see [Open questions](#open-questions)). The `results` list holds `CommonIDName` items, which currently carry **only `id` and `name`** (`vendor/zscaler-sdk-python/zscaler/zeasm/models/organizations.py:41`; `vendor/zscaler-sdk-python/zscaler/zeasm/models/common.py:37-38`). MCP v0.15.4 unwraps the collection's `results` wrapper and returns one full SDK-modeled item dictionary per organization (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/organizations.py:38-60`). The passthrough contract preserves every field carried by the SDK item, but it is not raw HTTP and does not promise fields beyond the current SDK model (`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py:43-56`; `vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py:50-113`). The current organization rows may therefore still contain only `id` and `name`. Bundled MCP documentation still describes the old `results` / `total_results` wrapper, which contradicts the current implementation (`vendor/zscaler-mcp-server/docsrc/tools/easm/index.rst:49-63`). No scan-date or asset-count fields exist on the current SDK organization item model.

### Asset inventory in the OneAPI Postman collection

The current Postman collection adds four organization-scoped asset read
operations that are newly in scope for this reference:

| Operation | Method | Canonical path | Citation |
|---|---|---|---|
| List assets | GET | `/organizations/{orgId}/assets` | `vendor/zscaler-api-specs/oneapi-postman-collection.json:136757-136775` |
| List certificates for an asset | GET | `/organizations/{orgId}/assets/{assetId}/certificates` | `vendor/zscaler-api-specs/oneapi-postman-collection.json:136239-136270` |
| List services for an asset | GET | `/organizations/{orgId}/assets/{assetId}/services` | `vendor/zscaler-api-specs/oneapi-postman-collection.json:136412-136443` |
| List technologies for an asset | GET | `/organizations/{orgId}/assets/{assetId}/technologies` | `vendor/zscaler-api-specs/oneapi-postman-collection.json:136585-136616` |

The list-assets request documents a default page size of 100 and a maximum of
1,000. It exposes `offset`, `sort`, `search`, `riskLevel`, `status`, `country`,
`state`, `type`, `lastSeen`, `firstSeen`, and `certificateExpiration` query
parameters (`vendor/zscaler-api-specs/oneapi-postman-collection.json:136776-136835`).

### Current Postman raw-URL defects

Three EASM GET requests in the current official Postman snapshot have malformed
raw URL templates. Do not copy these strings verbatim:

- **List assets** appends an extra `}}` to `{{EASMBaseUrl}}` in both `raw` and
  `host`; its structured path array still records `organizations`, `:orgId`,
  and `assets` (`vendor/zscaler-api-specs/oneapi-postman-collection.json:136765-136775`).
- **Get lookalike-domain details** appends an extra `}` to the base variable in
  both `raw` and `host`; its structured path array records the canonical
  organization-scoped detail path
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:138630-138650`).
- **List lookalike domains** omits the slash after `{{EASMBaseUrl}}` and folds
  `organizations` into `host`, leaving it out of the structured path array
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:138885-138904`).

The Python SDK independently constructs the canonical lookalike paths as
`/organizations/{org_id}/lookalike-domains` and
`/organizations/{org_id}/lookalike-domains/{lookalike_raw}/details`
(`vendor/zscaler-sdk-python/zscaler/zeasm/lookalike_domains.py:73-76`,
`:123-127`). For list assets, use the canonical path in the table above, which
follows the request's structured path array; the current Python SDK has no
asset client that independently corroborates it.

The collection's HTTP 200 examples show, but do not define an exhaustive
contract for, these child-record fields:

- Certificates: expiry, first/last-seen and issued timestamps, stale status,
  subject common name, and subject key identifier
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:136312-136322`).
- Services: creation/update timestamps, IP, port, and protocol
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:136485-136495`).
- Technologies: creation/update timestamps, IP, name, version, and CVE strings
  (`vendor/zscaler-api-specs/oneapi-postman-collection.json:136658-136668`).

These four paths are Postman-documented raw REST coverage. The current Python
SDK and MCP EASM resource inventories still expose organizations, findings, and
lookalike domains rather than an asset client/toolset
(`vendor/zscaler-sdk-python/zscaler/zeasm/zeasm_service.py:29-51`;
`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:419-431`). Absence of
an SDK or MCP wrapper is a client-coverage gap, not evidence that the REST paths
are unavailable.

### Findings and lookalike domains

The MCP list tools keep the SDK collection unwrapping but no longer reduce each
item to a curated triage subset: each finding or lookalike-domain result is
passed through as its full SDK `as_dict()` record
(`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/findings.py:68-93`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/lookalike_domains.py:67-98`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py:101-113`). As with
organizations, the available fields are SDK-owned rather than a promise of raw
HTTP response fields.

The Findings and LookalikeDomains resources are documented in detail in their own files:

- [`findings.md`](findings.md) — finding field table, the three-level drill-down (details / evidence / scan-output), and what the SDK does and does not say about the risk/scoring fields.
- [`lookalike-domains.md`](lookalike-domains.md) — the lookalike model field set, the raw-domain key, and the signals that exist only in illustrative narrative (not as source fields).

### MCP provenance metadata boundary

At v0.15.4, the MCP metadata marks these four EASM tools as carrying content
from outside the customer's trust boundary: `zeasm_get_finding_evidence`,
`zeasm_get_finding_scan_output`, `zeasm_get_lookalike_domain`, and
`zeasm_list_lookalike_domains`
(`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/findings.py:125-170`;
`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/lookalike_domains.py:67-109`).
They are the EASM subset of the exact global eight-tool set fixed by the
provenance test (`vendor/zscaler-mcp-server/tests/test_provenance.py:20-69`,
`:150-153`). The test suite also confirms that the banner is text-only, leaving
structured records unchanged by provenance tagging; the global output
sanitizer remains a separate transformation
(`vendor/zscaler-mcp-server/tests/test_provenance.py:114-147`).
The v0.15.4 addition of `zeasm_list_lookalike_domains` resolves the prior
list-tool metadata-coverage omission; it does not change EASM product trust
semantics, the SDK/API model, or the provenance of every returned field
(`vendor/zscaler-mcp-server/CHANGELOG.md:3-11`).

The finding list and details tools remain outside that flagged set even though
their full records include a free-form `description` whose captured contract
allows open-source-intelligence content such as NVD alongside Zscaler research
(`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/findings.py:68-122`;
`vendor/zscaler-api-specs/automate-zscaler/easm-api-reference.json:705-713`,
`:1135-1143`). This is a residual MCP trust-classification gap: treat the
description as untrusted evidence rather than inferring that every field from
an unflagged tool is trusted.

## Client-side filtering

The SDK response objects support client-side filtering and projection via `resp.search(expression)`, with JMESPath expression syntax (`vendor/zscaler-sdk-python/zscaler/zeasm/findings.py:66-71`).

## Open questions

- **Normal multi-org tenancy remains unestablished.** The SDK wrapper exposes `results` and `total_results`; MCP v0.15.4 unwraps `results` and returns a list of full SDK-modeled organization items. Both are list-shaped evidence, but neither explicitly establishes normal multi-org tenancy (`vendor/zscaler-sdk-python/zscaler/zeasm/models/organizations.py:39-42`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/easm/organizations.py:38-60`).
- **Org `last scan date` / `monitored domains/assets`.** The SKILL.md narrative says to note these (`vendor/zscaler-mcp-server/skills/easm/review-attack-surface/SKILL.md:31-34`), but the org result item model (`CommonIDName`) carries only `id` and `name` (`vendor/zscaler-sdk-python/zscaler/zeasm/models/common.py:37-38`; `vendor/zscaler-sdk-python/zscaler/zeasm/models/organizations.py:41`). No such fields exist on the org object in source. Unverified.
- **Pagination on findings/lookalike collections.** Page cursors are modeled only on Organizations (`vendor/zscaler-sdk-python/zscaler/zeasm/models/organizations.py:39-40`). The Findings collection (`models/findings.py:38-39`) and LookalikeDomains collection (`models/lookalike_domains.py:38-41`) expose only `results` + `total_results` with no page cursors. This is a model-shape observation, not proof of server behavior.

## Cross-links

- Findings field table and drill-down: [`findings.md`](findings.md)
- Lookalike-domain model and raw-domain key: [`lookalike-domains.md`](lookalike-domains.md)
- Postman-documented asset inventory and child detail endpoints: [Asset inventory in the OneAPI Postman collection](#asset-inventory-in-the-oneapi-postman-collection)
- AEM (asset exposure, SecOps platform): [`../aem/overview.md`](../aem/overview.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
