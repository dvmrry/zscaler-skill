# automate.zscaler.com capture pipeline (DAV-21)

Captures the per-operation **API contract** from the automate.zscaler.com OneAPI
reference — field-level `required` / `readonly` / `enum` that exists nowhere else
in machine-readable form (no `openapi.json` is published; the schema is baked into
the Docusaurus JS bundles, so it must be rendered and read).

This is the highest-authority source for *what the API actually accepts and
returns*, distinct from the SDK's client view and Postman's examples. Reconciling
it against the Go/Python SDKs and the Terraform provider surfaces real divergences
(see the proof report: `plans/2026-06-16-dav-21-automate-contract-proof.md`).

## Three stages, clean boundary

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
     (contract data, alongside the Postman collection — the same family).
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

```bash
cd scripts/automate-capture
npm install                        # installs the pinned Playwright (1.61.0)
npx playwright install chromium    # fetches the matching browser build
node capture.cjs subset-urls.txt ../../vendor/zscaler-help/automate-zscaler/api-reference
cd ../..
python3 scripts/automate-capture/parse_contract.py       # raw tree -> normalized JSON
python3 scripts/automate-capture/reconcile_contract.py   # contract vs Go SDK / TF -> divergences
python3 scripts/automate-capture/test_parse_contract.py
python3 scripts/automate-capture/test_reconcile_contract.py
```

Escape hatch: `PLAYWRIGHT_EXECUTABLE=/path/to/chrome-headless-shell` reuses an
existing browser instead of an in-tree install. `CAPTURE_DELAY_MS` (default 250)
throttles between pages. `reconcile_contract.py` reads the vendored Go SDK and
Terraform submodules, so initialize them first (`git submodule update --init`).

## Scope

Captures, parses, and reconciles a **15-operation ZPA proof subset** (5 resources ×
create/update/get, chosen for maximum cross-family overlap). `subset-urls.txt` records
exactly which operations were captured.

Still deferred to the productionization PR: the full 1167-page sweep wired into
`scripts/refresh-automate-zscaler.sh`; the 7th source family `automate-contract` in
`scripts/l1_inventory.py`; source-precedence wiring; and Python-SDK / Postman
cross-checks in the reconciler (currently Go SDK + Terraform, which carry the type /
required / readonly / enum signal).
