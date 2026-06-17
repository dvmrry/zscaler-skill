#!/usr/bin/env bash
# refresh-automate-zscaler.sh — re-capture and reconcile the automate.zscaler.com
# OneAPI reference.
#
# Two layers live under vendor/zscaler-help/automate-zscaler/:
#   1. Structured API-reference sweep (THIS script runs it): headless Playwright
#      renders each operation page listed in scripts/automate-capture/urls/<product>.txt,
#      parse_contract.py normalizes the raw text to contract JSON, and
#      reconcile_contract.py diffs the contract against the Go SDK + Terraform.
#   2. Prose overview markdowns (the *.md files): still refreshed manually via a
#      browser agent — this script only audits their staleness.
#
# Playwright is the capturer's isolated, pinned dependency (scripts/automate-capture/
# package.json) and is NOT installed by default. Install once:
#   cd scripts/automate-capture && npm install && npx playwright install chromium
# To reuse an existing browser instead, export PLAYWRIGHT_EXECUTABLE=/path/to/shell.
#
# Manual run:  ./scripts/refresh-automate-zscaler.sh [product ...]   # default: all url lists
# Scheduled:   monthly is reasonable; the Docusaurus site updates with new OneAPI
#              capabilities. Capture once, reconcile locally; clean-room (public docs only).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"
CAP="scripts/automate-capture"
URL_DIR="${CAP}/urls"
RAW_DIR="vendor/zscaler-help/automate-zscaler/api-reference"
SPEC_DIR="vendor/zscaler-api-specs/automate-zscaler"

echo "=== automate.zscaler.com API-reference sweep ==="
echo ""

# Preflight: the capturer needs Playwright (its isolated, pinned dependency). Resolve
# it from ${CAP} — that's where `npm install` puts node_modules, and where capture.cjs
# itself resolves it from; the repo root does not see that directory.
if ! ( cd "${CAP}" && node -e "require('playwright')" ) >/dev/null 2>&1; then
    cat >&2 <<'MSG'
✗ Playwright not found — the capturer needs it (isolated, pinned dependency).
  Install once:
    cd scripts/automate-capture && npm install && npx playwright install chromium
  Then re-run. To reuse an existing browser, export PLAYWRIGHT_EXECUTABLE.
MSG
    exit 2
fi

# Products to sweep: command-line args, or every urls/<product>.txt.
products=("$@")
if [[ ${#products[@]} -eq 0 ]]; then
    for f in "${URL_DIR}"/*.txt; do products+=("$(basename "${f}" .txt)"); done
fi

# Capture all selected products in ONE pass over a combined URL list: the capturer
# writes provenance.json for exactly the URLs it processes, so a single call keeps
# one complete provenance (a per-product loop would overwrite it each iteration).
combined="$(mktemp)"
trap 'rm -f "${combined}"' EXIT
for p in "${products[@]}"; do
    url_file="${URL_DIR}/${p}.txt"
    if [[ ! -f "${url_file}" ]]; then
        echo "✗ no URL list: ${url_file}" >&2
        exit 1
    fi
    cat "${url_file}" >> "${combined}"
done
n="$(grep -cvE '^[[:space:]]*(#|$)' "${combined}" || true)"
echo "--- capturing ${products[*]} (${n} ops) ---"
capture_failures=0
# --prune is safe here: the combined list is the COMPLETE expected op set for the
# selected products, so ops missing from it were removed/renamed upstream and their
# stale raw/provenance should go. (Never prune on a partial/retry capture.)
# A partial capture is recorded in provenance.json (per-op error) and returns
# non-zero; warn but still parse what succeeded so the diff is visible.
if ! node "${CAP}/capture.cjs" --prune "${combined}" "${RAW_DIR}"; then
    echo "⚠ some pages failed to render — see provenance.json errors; re-run to retry." >&2
    capture_failures=1
fi

echo ""
echo "--- parsing raw -> normalized contract JSON (per product) ---"
# parse_contract.py walks the whole raw tree and writes one
# <product>-api-reference.json per product into SPEC_DIR.
python3 "${CAP}/parse_contract.py" "${RAW_DIR}" "${SPEC_DIR}"

if [[ -d "vendor/zscaler-sdk-go/zscaler" && -d "vendor/terraform-provider-zpa/zpa" ]]; then
    echo "--- reconciling contract vs Go SDK / Terraform ---"
    python3 "${CAP}/reconcile_contract.py"
    echo "--- synthesizing rosetta + issue-routing artifacts ---" && python3 "${CAP}/rosetta.py"
else
    echo "(vendor SDK/TF submodules not initialized — skipping reconcile; run:"
    echo "  git submodule update --init vendor/zscaler-sdk-go vendor/terraform-provider-zpa)"
fi

echo ""
echo "=== changes vs committed ==="
git diff --stat -- "${RAW_DIR}" "${SPEC_DIR}" | tail -20 || true

# --- Layer 2: prose overview markdown staleness (manual refresh) ---
echo ""
echo "=== prose overview markdowns (manual refresh layer) ==="
PROSE_DIR="vendor/zscaler-help/automate-zscaler"
md_count="$(find "${PROSE_DIR}" -maxdepth 1 -name '*.md' -type f | wc -l | tr -d ' ')"
echo "${md_count} prose markdown(s) in ${PROSE_DIR}/ (newest capture dates):"
for f in "${PROSE_DIR}"/*.md; do
    [[ -f "${f}" ]] || continue
    d="$(grep -oE 'Captured: [0-9]{4}-[0-9]{2}-[0-9]{2}' "${f}" | head -1 | awk '{print $2}')"
    [[ -n "${d}" ]] && echo "  ${d}  $(basename "${f}" .md)"
done | sort -r | head -5
echo "  (these are refreshed manually via a browser agent; the sweep above does not touch them.)"

echo ""
echo "=== Postman collection check ==="
if [[ -x "scripts/refresh-postman.sh" ]]; then
    ./scripts/refresh-postman.sh
else
    echo "(refresh-postman.sh not executable — skipping)"
fi

exit "${capture_failures}"
