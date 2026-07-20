# automate.zscaler.com capture pipeline

Captures the per-operation **API contract** from the automate.zscaler.com OneAPI
reference: documented method/path, request and response shape, field-level
`required`, `readOnly`, `enum`, and provenance. The current production path reads
the compiled Docusaurus operation blobs directly, not rendered browser text.

The snapshot is the highest-authority static source for documented Automate API
metadata, distinct from SDK wrapper behavior, Terraform/Ansible validators, MCP
tool coverage, and Postman examples. It does **not** prove live backend acceptance
for every value; tenant validation and vendor confirmation still own runtime
semantics.

## Production stages

1. **Extract** (`extract_docusaurus_blobs.py`, Python stdlib) — fetches the
   deployed Docusaurus route table and lazy MDX operation chunks, decodes each
   compressed `frontMatter.api` object, and writes a working snapshot under
   `/tmp/zscaler-automate-blob-proof/` by default:
   - reconstructed normalized contracts:
     `reconstructed/<product>-api-reference.json`
   - raw decoded blobs with source URL and blob hash:
     `raw-blobs/<product>-raw-api.json`
   - flattened sheets for downstream mapping/readiness work:
     `sheets/automate-fields.json` and `sheets/automate-operations.json`
   - old-vs-new comparison:
     `compare-summary.{json,md}`
     The comparison includes a **Contract Change Radar** that pairs route-key
     renames by method/path, identifies true operation additions/removals,
     separates route corrections, and reports per-operation field additions,
     removals, and material metadata changes for request/response schemas.
     Schema-class title and description churn is intentionally excluded.
2. **Publish OpenAPI** (`build_openapi_from_blobs.py`, Python stdlib) — converts
   the decoded blobs into product-scoped OpenAPI-compatible specs while preserving
   `x-zscaler-*` provenance extensions:
   - `vendor/zscaler-api-specs/automate-zscaler/openapi/<product>.openapi.json`
   - `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.{json,md}`
3. **Reconcile** (`reconcile_contract.py`, Python stdlib) — diffs the normalized
   contract against Go SDK, Python SDK, Terraform, Ansible, and MCP surfaces on the
   high-signal axes: presence, type drift, required-vs-optional,
   readonly-vs-computed, and enum constraints. Output:
   - `vendor/zscaler-api-specs/automate-zscaler/<product>-divergences.json`
   - `vendor/zscaler-api-specs/automate-zscaler/<product>-divergences.md`
4. **Synthesize** (`rosetta.py`, Python stdlib) — builds the cross-surface table
   and issue-routing worklist, and carries the latest contract-change radar into
   the Rosetta Stone so contract-only products are visible beyond an operation
   count:
   - `vendor/zscaler-api-specs/automate-zscaler/rosetta.{json,md}`
   - `vendor/zscaler-api-specs/automate-zscaler/issue-routing.{json,md}`

The extractor is the capture trust boundary. It is guarded by route-completeness
checks, loss-aware comparison against the committed snapshot, field-flattening
tests, and OpenAPI structural validation. The reconciler and rosetta layers have
their own fixture and real-data smoke tests.

## Run it

The production entry point is the refresh script:

```bash
git submodule update --init --recursive
./scripts/refresh-automate-zscaler.sh
```

The script captures all products from the live Docusaurus route table, publishes
the normalized contract JSON, writes durable OpenAPI specs, regenerates
divergence/rosetta artifacts when vendor submodules are present, and audits the
separate prose markdown captures. Optional product arguments limit which
normalized `<product>-api-reference.json` files are published from the live
snapshot; the Docusaurus route discovery itself is always global.

To keep the working snapshot for inspection:

```bash
AUTOMATE_SNAPSHOT_DIR=/tmp/zscaler-automate-blob-proof \
  ./scripts/refresh-automate-zscaler.sh
```

Or drive stages directly:

```bash
python3 scripts/automate-capture/extract_docusaurus_blobs.py \
  --out-dir /tmp/zscaler-automate-blob-proof \
  --existing-dir vendor/zscaler-api-specs/automate-zscaler

python3 scripts/automate-capture/build_openapi_from_blobs.py \
  --raw-dir /tmp/zscaler-automate-blob-proof/raw-blobs \
  --out-dir vendor/zscaler-api-specs/automate-zscaler/openapi

python3 scripts/automate-capture/reconcile_contract.py
python3 scripts/automate-capture/rosetta.py
```

## Scope

Captured products: **AI Guard**, **BI**, **EASM**, **Event Monitoring**, **ZCC**,
**ZCell**, **ZCloudConnector/ZTW**, **ZDX**, **ZIA**, **ZID**, and **ZPA**.

Reconciliation currently covers the mapped multi-surface resources for **ZIA**
(54), **ZPA** (16), **ZCC** (4), and **ZCloudConnector/ZTW** (16); the other
product contracts are captured and available as contract/OpenAPI evidence but
are not yet fully reconciled against client surfaces.

The normalized contract is exposed to L1 inventory as the `automate-contract`
family for configured products. Source precedence treats it as the preferred
source for API contract metadata (`required`, `readonly`, `enum`, method/path)
while SDK, Terraform, Ansible, and MCP sources remain authoritative for their
own wrapper/provider behavior.

## OpenAPI and flattened fields

The committed OpenAPI specs are intentionally product-scoped and mostly inline:
they are designed as a deterministic mapping substrate rather than a polished
vendor-published spec. The builder preserves unresolved `$ref` edges with stub
component entries instead of masking them, and keeps per-operation source URL and
blob hashes in `x-zscaler-*` extensions.

The flattened blob data includes nested paths such as
`connectors[].assistantVersion.platform`. Existing DAV-21/DAV-23 reconciliation is
top-level-resource-field oriented, so `reconcile_contract.py` projects blob fields
back to top-level names (`[].active` -> `active`) and drops nested child paths for
the six-surface rosetta comparison. Use the flattened sheets for nested-field
mapping/readiness work rather than treating every nested child as a top-level
client gap.

## Legacy rendered-text scraper

The earlier Playwright rendered-text scraper has been retired from the production
refresh path. The checked-in contract data now comes from the compiled Docusaurus
`frontMatter.api` blobs, which are faster to capture, carry nested schema detail,
and are less lossy than rendered prose. Historical references to rendered-text
recaptures in clarification notes describe past negative-control checks, not the
current refresh mechanism.
