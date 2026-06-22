# automate.zscaler.com capture pipeline (DAV-21)

Captures the per-operation **API contract** from the automate.zscaler.com OneAPI
reference — field-level `required` / `readonly` / `enum` that is not published as
a single static `openapi.json` download.

The committed DAV-21 pipeline captures and parses the rendered API pages. This
branch also carries a Docusaurus-blob proof path (`extract_docusaurus_blobs.py` +
`build_openapi_from_blobs.py`) that extracts the compiled per-operation
`frontMatter.api` objects directly from the deployed JS bundles, writes
OpenAPI-compatible specs, and emits flattened field sheets for nested-schema work.

This is the highest-authority static source for documented method/path and field
metadata (`required`, `readonly`, `enum`, request/response shape), distinct from
the SDK's client view and Postman's examples. It does not prove live backend
acceptance for every value. Reconciling it against the Go/Python SDKs and the
Terraform provider surfaces real divergences (see the proof report:
`plans/2026-06-16-dav-21-automate-contract-proof.md`).

## Three production stages, clean boundary

1. **Capture** (`capture.cjs`, Node + Playwright) — renders each op page headlessly
   and dumps the raw `<article>` text plus first-class provenance. No parsing, no
   LLM. A page is persisted only once it has fully rendered (method + path +
   `Responses` + the `curl` example) and its text is stable across two reads; a
   partial render is retried once, then fails hard rather than being written as a
   success. Only the contract region (everything before the multi-language code
   samples) is stored — lean, and lossless for what the parser reads. Output:
   - raw text → `vendor/zscaler-help/automate-zscaler/api-reference/<product>/<group>/<op>.txt`
   - provenance → `.../api-reference/provenance.json` (`source_url`, `sha256`,
     `captured_at`, `method`, `path`, `length` per op)
2. **Parse** (`parse_contract.py`, Python stdlib) — deterministically turns the raw
   text into normalized contract JSON. No browser. Output:
   - `vendor/zscaler-api-specs/automate-zscaler/<product>-api-reference.json`
     (contract data, separate from the Postman examples).
3. **Reconcile** (`reconcile_contract.py`, Python stdlib) — diffs the normalized
   contract against the Go SDK struct and the Terraform provider schema, on the
   high-signal axes (presence, type drift, required-vs-optional, readonly-vs-computed,
   enum). Conservative matching only (exact JSON tags / TF keys; TF snake→camel from
   the key; nothing fuzzy). Output (a generated pair, regenerate after re-capture or a
   submodule bump):
   - `vendor/zscaler-api-specs/automate-zscaler/<product>-divergences.json`
   - `vendor/zscaler-api-specs/automate-zscaler/<product>-divergences.md`

Raw-text-on-disk is the boundary: the browser never touches the deterministic,
testable core. `parse_contract.py` and the `reconcile_contract.py` extractors are the
trust boundary, pinned by `test_parse_contract.py` (committed fixtures) and
`test_reconcile_contract.py` (inline source fixtures + a real-data smoke test). Both
test files run in CI (the hygiene workflow).

## Why Playwright is isolated here

The repo has no root `package.json`; its Node fast checks are stdlib-only. The
capturer is a **manual maintenance tool**, not a CI check, so its Playwright
dependency is pinned in *this directory's* `package.json` and installed on demand —
never folded into the repo's normal checks. `node_modules/` is gitignored.

## Run it

The production entry point is the refresh script — it runs the whole pipeline for
every product list in `urls/`, then audits the prose markdowns and Postman:

```bash
cd scripts/automate-capture
npm install                        # installs the pinned Playwright (1.61.0)
npx playwright install chromium    # fetches the matching browser build
cd ../..
git submodule update --init vendor/zscaler-sdk-go vendor/terraform-provider-zpa
./scripts/refresh-automate-zscaler.sh            # all products in urls/
./scripts/refresh-automate-zscaler.sh zpa        # or selected products
```

Or drive a stage directly:

```bash
node scripts/automate-capture/capture.cjs scripts/automate-capture/urls/zpa.txt \
  vendor/zscaler-help/automate-zscaler/api-reference
python3 scripts/automate-capture/parse_contract.py       # raw tree -> normalized JSON
python3 scripts/automate-capture/reconcile_contract.py   # contract vs Go SDK / TF -> divergences
python3 scripts/automate-capture/test_parse_contract.py
python3 scripts/automate-capture/test_reconcile_contract.py
```

Escape hatch: `PLAYWRIGHT_EXECUTABLE=/path/to/chrome-headless-shell` reuses an
existing browser instead of an in-tree install. `CAPTURE_DELAY_MS` (default 250)
throttles between pages.

Provenance accumulates: re-running merges into `provenance.json` (a re-captured op
replaces its entry; a fresh error never clobbers a good capture), so you can recover
a transient failure by re-capturing just those ops. The refresh script passes
`--prune` to drop ops no longer in the URL list (removed/renamed upstream) — only
safe with a **complete** list, so never pass `--prune` to a partial/retry capture.

## Scope

Per-product operation lists live in `urls/<product>.txt` (sitemap-derived canonical
URLs). `parse_contract.py` writes one `<product>-api-reference.json` per product into
`vendor/zscaler-api-specs/automate-zscaler/`. Captured and parsed so far: **AI
Guard**, **BI**, **EASM**, **ZCC**, **ZCell**, **ZCloudConnector**, **ZDX**, **ZIA**,
**ZID**, and **ZPA** — all operation pages from the sitemap for each product.

Reconciliation currently covers the mapped multi-surface resources for **ZIA** (54),
**ZPA** (16), **ZCC** (4), and **ZCloudConnector/ZTW** (16); the other product
contracts are captured but not yet reconciled (their registries — SDK structs,
Terraform resources, Ansible modules, and MCP tools where present — are follow-ons).

The normalized contract is exposed to L1 inventory as the `automate-contract`
family for configured products. Source precedence treats it as the preferred source
for rendered API contract metadata (`required`, `readonly`, `enum`, method/path)
while SDK and Terraform sources remain authoritative for wrapper/provider behavior.

## Docusaurus blob / OpenAPI proof

The blob proof is a faster, richer capture path for analysis and candidate future
replacement of the rendered-text parser. It reads the deployed Docusaurus route
table, fetches the lazy MDX operation chunks, decodes the compressed
`frontMatter.api` blob for each operation, and writes scratch output under
`/tmp/zscaler-automate-blob-proof/`:

```bash
python3 scripts/automate-capture/extract_docusaurus_blobs.py
python3 scripts/automate-capture/build_openapi_from_blobs.py
```

Primary scratch artifacts:

- reconstructed normalized contracts:
  `/tmp/zscaler-automate-blob-proof/reconstructed/<product>-api-reference.json`
- OpenAPI-compatible specs:
  `/tmp/zscaler-automate-blob-proof/openapi/<product>.openapi.json`
- flattened field and operation sheets:
  `/tmp/zscaler-automate-blob-proof/sheets/automate-fields.json` and
  `automate-operations.json`

The flattened blob data includes nested paths such as
`connectors[].assistantVersion.platform`. Existing DAV-21/DAV-23 reconciliation is
top-level-resource-field oriented, so `reconcile_contract.py` projects blob fields
back to top-level names (`[].active` -> `active`) and drops nested child paths for
the six-surface rosetta comparison. Use the flattened sheets for nested-field
mapping/readiness work rather than treating every nested child as a top-level
client gap.

Still deferred: promoting the blob/OpenAPI path as the production source, further
reconciler registry expansion for non-reconciled captured products, broader
per-product L1 configs beyond the first configured products, and Postman
cross-checks in the reconciler.
