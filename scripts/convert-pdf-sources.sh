#!/usr/bin/env bash
# convert-pdf-sources.sh — generate .txt copies of vendor PDFs for line-based citation.
#
# Status: functional.
#
# Vendor PDFs (e.g., vendor/zscaler-help/*.pdf) are the source of truth — read
# the PDF when you need the authoritative content (figures, layout, formatting).
# The .txt copy this script generates is a scripted utility artifact for
# grepping and citing with line numbers (e.g., `Foo.txt:142`).
#
# - Uses `pdftotext -layout` from poppler-utils. Layout-preserving so tables
#   and column structure stay roughly intact.
# - Idempotent: skips when the .txt is newer than its .pdf.
# - Walks all of vendor/ for any .pdf file.
#
# Requires: pdftotext (macOS: `brew install poppler`; Debian/Ubuntu:
#   `apt install poppler-utils`).
#
# Usage:
#   ./scripts/convert-pdf-sources.sh           # convert all vendor/ PDFs (skip up-to-date)
#   ./scripts/convert-pdf-sources.sh --force   # re-convert everything
#
# Exit code: 0 on success (or nothing to do); 1 if pdftotext missing or any
# conversion failed.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR_DIR="${REPO_ROOT}/vendor"
FORCE=""
[[ "${1:-}" == "--force" ]] && FORCE="yes"

if ! command -v pdftotext >/dev/null 2>&1; then
    echo "✗ pdftotext not found on PATH." >&2
    echo "  Install with: brew install poppler  (macOS) or apt install poppler-utils  (Debian/Ubuntu)" >&2
    exit 1
fi

echo "Converting vendor PDFs to .txt (pdftotext -layout)"
[[ -n "${FORCE}" ]] && echo "(--force: re-converting all)"
echo ""

CONVERTED=0
SKIPPED=0
FAILED=()

while IFS= read -r pdf; do
    txt="${pdf%.pdf}.txt"
    rel="${pdf#${REPO_ROOT}/}"

    if [[ -z "${FORCE}" && -f "${txt}" && "${txt}" -nt "${pdf}" ]]; then
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    if pdftotext -layout "${pdf}" "${txt}" 2>/dev/null; then
        CONVERTED=$((CONVERTED + 1))
        printf '  ✓ %s\n' "${rel}"
    else
        FAILED+=("${rel}")
        printf '  ✗ %s\n' "${rel}"
    fi
done < <(find "${VENDOR_DIR}" -type f -name '*.pdf')

echo ""
echo "Converted: ${CONVERTED}"
echo "Skipped (up to date): ${SKIPPED}"

if [[ ${#FAILED[@]} -gt 0 ]]; then
    echo ""
    echo "✗ Conversion failures (${#FAILED[@]}):"
    printf '  %s\n' "${FAILED[@]}"
    exit 1
fi

exit 0
