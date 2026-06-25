#!/usr/bin/env bash
# refresh-automate-zscaler.sh — re-capture and reconcile the automate.zscaler.com
# OneAPI reference from the deployed Docusaurus operation blobs.
#
# Two layers live under vendor/:
#   1. Structured API-reference sweep (THIS script runs it): Python fetches the
#      deployed Docusaurus route table and lazy MDX chunks, decodes each compiled
#      frontMatter.api blob, publishes normalized contract JSON plus OpenAPI
#      snapshots, and reconciles the contract against SDK/provider surfaces.
#   2. Prose overview markdowns under vendor/zscaler-help/automate-zscaler/*.md:
#      refreshed manually via a browser agent; this script only audits staleness.
#
# Manual run:  ./scripts/refresh-automate-zscaler.sh [product ...]
# Scheduled:   monthly is reasonable; the Docusaurus site updates with new OneAPI
#              capabilities. Capture once, reconcile locally; clean-room (public docs only).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"
CAP="scripts/automate-capture"
SPEC_DIR="vendor/zscaler-api-specs/automate-zscaler"
OPENAPI_DIR="${SPEC_DIR}/openapi"

echo "=== automate.zscaler.com Docusaurus snapshot sweep ==="
echo ""

snapshot_dir="${AUTOMATE_SNAPSHOT_DIR:-}"
cleanup_snapshot=0
if [[ -z "${snapshot_dir}" ]]; then
    snapshot_dir="$(mktemp -d)"
    cleanup_snapshot=1
fi
trap 'if [[ "${cleanup_snapshot}" -eq 1 ]]; then rm -rf "${snapshot_dir}"; fi' EXIT

products=("$@")

echo "--- extracting Docusaurus operation blobs ---"
python3 "${CAP}/extract_docusaurus_blobs.py" \
    --out-dir "${snapshot_dir}" \
    --existing-dir "${SPEC_DIR}"

echo ""
echo "--- publishing normalized contract JSON ---"
mkdir -p "${SPEC_DIR}"
if [[ ${#products[@]} -eq 0 ]]; then
    for f in "${snapshot_dir}/reconstructed/"*-api-reference.json; do
        cp "${f}" "${SPEC_DIR}/"
    done
else
    for p in "${products[@]}"; do
        src="${snapshot_dir}/reconstructed/${p}-api-reference.json"
        if [[ ! -f "${src}" ]]; then
            echo "✗ no reconstructed contract for product: ${p}" >&2
            exit 1
        fi
        cp "${src}" "${SPEC_DIR}/"
    done
fi

echo ""
echo "--- publishing OpenAPI-compatible snapshots ---"
mkdir -p "${OPENAPI_DIR}"
python3 "${CAP}/build_openapi_from_blobs.py" \
    --raw-dir "${snapshot_dir}/raw-blobs" \
    --out-dir "${OPENAPI_DIR}" \
    --version "docusaurus-blob-snapshot"
cp "${OPENAPI_DIR}/openapi-validation-report.json" "${SPEC_DIR}/openapi-validation-report.json"
cp "${OPENAPI_DIR}/openapi-validation-report.md" "${SPEC_DIR}/openapi-validation-report.md"

echo ""
echo "--- preserving snapshot comparison report ---"
cp "${snapshot_dir}/compare-summary.json" "${SPEC_DIR}/docusaurus-snapshot-compare-summary.json"
cp "${snapshot_dir}/compare-summary.md" "${SPEC_DIR}/docusaurus-snapshot-compare-summary.md"

if [[ -d "vendor/zscaler-sdk-go/zscaler" && -d "vendor/terraform-provider-zpa/zpa" ]]; then
    echo "--- reconciling contract vs SDK / Terraform / Ansible / MCP ---"
    python3 "${CAP}/reconcile_contract.py"
    echo "--- synthesizing rosetta + issue-routing artifacts ---"
    python3 "${CAP}/rosetta.py"
else
    echo "(vendor SDK/TF submodules not initialized — skipping reconcile; run:"
    echo "  git submodule update --init --recursive)"
fi

echo ""
echo "=== changes vs committed ==="
git diff --stat -- "${SPEC_DIR}" | tail -30 || true

# --- Layer 2: prose overview markdown staleness (manual refresh) ---
echo ""
echo "=== prose overview markdowns (manual refresh layer) ==="
PROSE_DIR="vendor/zscaler-help/automate-zscaler"
md_count="$(find "${PROSE_DIR}" -maxdepth 1 -name '*.md' -type f | wc -l | tr -d ' ')"
echo "${md_count} prose markdown(s) in ${PROSE_DIR}/ (newest capture dates):"
for f in "${PROSE_DIR}"/*.md; do
    [[ -f "${f}" ]] || continue
    d="$(grep -oE 'Captured: [0-9]{4}-[0-9]{2}-[0-9]{2}' "${f}" | head -1 | awk '{print $2}' || true)"
    if [[ -n "${d}" ]]; then
        echo "  ${d}  $(basename "${f}" .md)"
    fi
done | sort -r | head -5
echo "  (these are refreshed manually via a browser agent; the structured sweep above does not touch them.)"

echo ""
echo "=== Postman collection check ==="
if [[ "${REFRESH_POSTMAN:-0}" == "1" ]]; then
    if [[ -x "scripts/refresh-postman.sh" ]]; then
        ./scripts/refresh-postman.sh
    else
        echo "(refresh-postman.sh not executable — skipping)"
    fi
else
    echo "(skipping; set REFRESH_POSTMAN=1 to refresh the separate Postman reference)"
fi
