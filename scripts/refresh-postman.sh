#!/usr/bin/env bash
# refresh-postman.sh — re-fetch Zscaler's OneAPI Postman collection and
# detect changes since last commit.
#
# Status: functional.
#
# What it does:
#   1. Downloads the current Postman collection from Zscaler's automation hub.
#   2. Compares against the committed copy at vendor/zscaler-api-specs/.
#   3. If different, replaces the committed copy and reports the change.
#   4. If unchanged, exits cleanly.
#
# Manual run:  ./scripts/refresh-postman.sh
# Scheduled:   add to cron / GitHub Actions when infra exists. The collection
#              is updated by Zscaler periodically — quarterly check is a
#              reasonable cadence.
#
# Note: Zscaler's collection filename includes a date stamp
# (e.g., OneAPI_postman_collection_03_05_2026.json). The download URL in
# this script may need updating if Zscaler changes the publishing pattern.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SPEC_DIR="${REPO_ROOT}/vendor/zscaler-api-specs"
OUTPUT_FILE="${SPEC_DIR}/oneapi-postman-collection.json"

# Zscaler's automation hub publishes the collection at this URL.
# Filename embeds a date — check periodically for an updated filename.
COLLECTION_URL="https://automate.zscaler.com/downloads/OneAPI_postman_collection_03_05_2026.json"

mkdir -p "${SPEC_DIR}"

# Download to a temp file, then compare.
TMP_FILE="$(mktemp)"
trap 'rm -f "${TMP_FILE}"' EXIT

echo "→ Downloading Postman collection from ${COLLECTION_URL}"
if ! curl -sL --fail -o "${TMP_FILE}" "${COLLECTION_URL}"; then
    echo "✗ Download failed. Check the URL — Zscaler may have updated the filename." >&2
    echo "  Visit https://automate.zscaler.com/docs/tools/postman/ for the current URL." >&2
    exit 1
fi

NEW_SIZE="$(wc -c < "${TMP_FILE}")"
NEW_HASH="$(shasum -a 256 "${TMP_FILE}" | awk '{print $1}')"

if [[ ! -f "${OUTPUT_FILE}" ]]; then
    mv "${TMP_FILE}" "${OUTPUT_FILE}"
    trap - EXIT
    echo "✓ New file: ${OUTPUT_FILE} (${NEW_SIZE} bytes, sha256: ${NEW_HASH})"
    echo ""
    echo "Next steps:"
    echo "  1. Verify file integrity: jq '.info.name' ${OUTPUT_FILE}"
    echo "  2. Review for sensitive content (auth tokens, customer hostnames)"
    echo "  3. Commit: git add ${OUTPUT_FILE} && git commit -m 'Refresh Postman collection'"
    exit 0
fi

OLD_SIZE="$(wc -c < "${OUTPUT_FILE}")"
OLD_HASH="$(shasum -a 256 "${OUTPUT_FILE}" | awk '{print $1}')"

if [[ "${NEW_HASH}" == "${OLD_HASH}" ]]; then
    echo "✓ No change — committed copy is current."
    echo "  ${OLD_SIZE} bytes, sha256: ${OLD_HASH}"
    exit 0
fi

# Different. Replace and report.
mv "${TMP_FILE}" "${OUTPUT_FILE}"
trap - EXIT

echo "✓ Updated: ${OUTPUT_FILE}"
echo "  Old: ${OLD_SIZE} bytes, sha256: ${OLD_HASH:0:16}..."
echo "  New: ${NEW_SIZE} bytes, sha256: ${NEW_HASH:0:16}..."

# Quick structural comparison if jq is available.
if command -v jq &>/dev/null; then
    echo ""
    echo "Top-level folder count: $(jq '.item | length' "${OUTPUT_FILE}")"
    echo "Folders:"
    jq -r '.item[] | "  - \(.name) (\(.item | length // 0) sub-items)"' "${OUTPUT_FILE}"
fi

echo ""
echo "Next steps:"
echo "  1. Sanity check: jq '.info' ${OUTPUT_FILE}"
echo "  2. Review for new product folders or significant structural changes"
echo "  3. If structural changes affect references/shared/oneapi.md, update the doc"
echo "  4. Commit: git add ${OUTPUT_FILE} && git commit -m 'Refresh Postman collection'"
