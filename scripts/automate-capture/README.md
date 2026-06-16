# automate.zscaler.com capture pipeline (DAV-21)

Captures the per-operation **API contract** from the automate.zscaler.com OneAPI
reference — field-level `required` / `readonly` / `enum` that exists nowhere else
in machine-readable form (no `openapi.json` is published; the schema is baked into
the Docusaurus JS bundles, so it must be rendered and read).

This is the highest-authority source for *what the API actually accepts and
returns*, distinct from the SDK's client view and Postman's examples. Reconciling
it against the Go/Python SDKs and the Terraform provider surfaces real divergences
(see the proof report: `plans/2026-06-16-dav-21-automate-contract-proof.md`).

## Two stages, clean boundary

1. **Capture** (`capture.cjs`, Node + Playwright) — renders each op page headlessly
   and dumps the raw `<article>` text plus first-class provenance. No parsing, no
   LLM. Output:
   - raw text → `vendor/zscaler-help/automate-zscaler/api-reference/<product>/<group>/<op>.txt`
   - provenance → `.../api-reference/provenance.json` (`source_url`, `sha256`,
     `captured_at`, `method`, `path`, `length` per op)
2. **Parse** (`parse_contract.py`, Python stdlib) — deterministically turns the raw
   text into normalized contract JSON. No browser. Output:
   - `vendor/zscaler-api-specs/automate-zscaler/<product>-api-reference.json`
     (contract data, alongside the Postman collection — the same family).

Raw-text-on-disk is the boundary: the browser never touches the deterministic,
testable core. `parse_contract.py` is the trust boundary and is pinned by
`test_parse_contract.py` against the committed fixtures.

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
python3 scripts/automate-capture/parse_contract.py   # raw tree -> normalized JSON
python3 scripts/automate-capture/test_parse_contract.py
```

Escape hatch: `PLAYWRIGHT_EXECUTABLE=/path/to/chrome-headless-shell` reuses an
existing browser instead of an in-tree install. `CAPTURE_DELAY_MS` (default 250)
throttles between pages.

## Scope (PR1)

This PR ships the harness + parser + tests + a **15-operation ZPA proof subset**
(5 resources × create/update/get, chosen for maximum cross-family overlap). It is
deliberately **not** the full sweep: no 1167-page crawl, no L1 integration, no
reconciler tool, no refresh-script rewiring. Those follow once the proof is
accepted. `subset-urls.txt` records exactly which operations were captured.
