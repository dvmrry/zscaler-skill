#!/usr/bin/env bash
# check-citations.sh — verify citations in references/**/*.md resolve.
#
# Status: functional.
#
# Walks every reference doc, extracts markdown-formatted links, and verifies:
#   - Relative paths (./foo.md, ../bar/baz.md) resolve to existing files
#   - URLs (http/https) return successful responses (HEAD request)
#
# Usage:
#   ./scripts/check-citations.sh                  # paths only (fast, offline)
#   ./scripts/check-citations.sh --check-urls     # also HEAD URLs (slow, online)
#
# Exit code: 0 if all citations resolve, 1 if any broken.
#
# Limitations:
#   - Only handles markdown link syntax [text](target). Reference-style
#     [text][ref] + [ref]: target is not handled.
#   - Skips citations inside code-fenced blocks (best-effort).
#   - URL HEAD requests with 5-second timeout. Slow / paywalled sites
#     may false-positive.

set -uo pipefail  # NOT -e: we want to continue on errors

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REFS_DIR="${REPO_ROOT}/references"
CHECK_URLS=""
[[ "${1:-}" == "--check-urls" ]] && CHECK_URLS="yes"

BROKEN_PATHS=()
BROKEN_URLS=()
TOTAL_PATHS=0
TOTAL_URLS=0

# Strip code-fenced blocks (```...```) and inline-code spans (`...`)
# from a file's content. Outputs cleaned content.
strip_code() {
    awk 'BEGIN{f=0} /^```/{f=!f; print ""; next} {if(!f) print; else print ""}' "$1" \
        | sed -E 's/`[^`]*`//g'
}

# Resolve a relative path to absolute, given the citing file's directory.
resolve_path() {
    local file_dir="$1"
    local rel_path="$2"

    # Strip anchor fragment
    rel_path="${rel_path%%#*}"
    # Strip query string
    rel_path="${rel_path%%\?*}"

    [[ -z "${rel_path}" ]] && { echo ""; return; }

    # Use python for portable path resolution (handles ., .., etc.)
    python3 -c "
import os, sys
file_dir = sys.argv[1]
rel = sys.argv[2]
abs_path = os.path.normpath(os.path.join(file_dir, rel))
print(abs_path)
" "${file_dir}" "${rel_path}" 2>/dev/null
}

echo "Checking citations in references/**/*.md"
[[ -z "${CHECK_URLS}" ]] && echo "(URL checks disabled — re-run with --check-urls to enable)"
echo ""

while IFS= read -r file; do
    rel_file="${file#${REPO_ROOT}/}"
    file_dir="$(dirname "${file}")"

    # Extract all markdown link targets from non-fenced content
    while IFS= read -r target; do
        # Strip surrounding "title" if present: target "title"
        target="${target%% \"*}"
        target="${target%%	\"*}"

        # Skip empty
        [[ -z "${target}" ]] && continue

        # Classify
        if [[ "${target}" == http://* || "${target}" == https://* ]]; then
            # URL
            [[ -z "${CHECK_URLS}" ]] && continue

            TOTAL_URLS=$((TOTAL_URLS + 1))
            # HEAD with timeout. Some servers reject HEAD; fall back to GET if HEAD fails.
            if ! curl -sL --head --fail --max-time 5 "${target}" >/dev/null 2>&1; then
                if ! curl -sL --fail --max-time 5 -o /dev/null --range 0-1023 "${target}" >/dev/null 2>&1; then
                    BROKEN_URLS+=("${rel_file} → ${target}")
                fi
            fi
        elif [[ "${target}" == mailto:* ]]; then
            # Skip mailto
            continue
        elif [[ "${target}" == \#* ]]; then
            # Same-page anchor — skip
            continue
        else
            # Relative path
            TOTAL_PATHS=$((TOTAL_PATHS + 1))
            resolved="$(resolve_path "${file_dir}" "${target}")"
            if [[ -z "${resolved}" || ! -e "${resolved}" ]]; then
                BROKEN_PATHS+=("${rel_file} → ${target}")
            fi
        fi
    done < <(strip_code "${file}" | grep -oE '\[[^]]*\]\([^)]+\)' | sed -E 's/^\[[^]]*\]\(([^)]+)\)$/\1/')
done < <(find "${REFS_DIR}" -name '*.md' -type f)

echo "Paths checked: ${TOTAL_PATHS}"
[[ -n "${CHECK_URLS}" ]] && echo "URLs checked:  ${TOTAL_URLS}"
echo ""

if [[ ${#BROKEN_PATHS[@]} -gt 0 ]]; then
    echo "✗ Broken paths (${#BROKEN_PATHS[@]}):"
    printf '  %s\n' "${BROKEN_PATHS[@]}"
    echo ""
fi

if [[ ${#BROKEN_URLS[@]} -gt 0 ]]; then
    echo "✗ Broken URLs (${#BROKEN_URLS[@]}):"
    printf '  %s\n' "${BROKEN_URLS[@]}"
    echo ""
fi

if [[ ${#BROKEN_PATHS[@]} -eq 0 && ${#BROKEN_URLS[@]} -eq 0 ]]; then
    echo "✓ All citations resolve."
    exit 0
fi

exit 1
