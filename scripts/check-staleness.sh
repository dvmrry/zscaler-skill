#!/usr/bin/env bash
# check-staleness.sh — find reference docs whose `last-verified` date is older
# than a threshold. Surfaces docs that haven't been re-validated recently.
#
# Status: functional.
#
# Usage:
#   ./scripts/check-staleness.sh                # default 90 days
#   ./scripts/check-staleness.sh 30             # 30 days
#   ./scripts/check-staleness.sh 60 --detailed  # with file paths and dates
#
# Output: a list of stale reference docs (or a "all current" message).
#
# Manual run when:
#   - Before a fine-tune training cut — stale docs may be misleading
#   - Quarterly review pass — proactive freshness audit
#   - Before a major release / commit — sanity check
#
# Scheduled (when infra exists): weekly check, report to Slack/email if
#   docs cross a 90-day threshold.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
THRESHOLD_DAYS="${1:-90}"
DETAILED="${2:-}"

if ! [[ "${THRESHOLD_DAYS}" =~ ^[0-9]+$ ]]; then
    echo "Usage: $0 [threshold-days] [--detailed]" >&2
    echo "  threshold-days: integer (default 90)" >&2
    exit 2
fi

# Compute cutoff date in YYYY-MM-DD form.
# macOS uses BSD date; Linux uses GNU date. Handle both.
if date -v-1d +%Y-%m-%d &>/dev/null; then
    # BSD date (macOS)
    CUTOFF="$(date -v-${THRESHOLD_DAYS}d +%Y-%m-%d)"
else
    # GNU date (Linux)
    CUTOFF="$(date -d "${THRESHOLD_DAYS} days ago" +%Y-%m-%d)"
fi

echo "Checking reference docs for last-verified older than ${CUTOFF} (${THRESHOLD_DAYS} days)"
echo ""

# Find all reference docs with last-verified frontmatter.
# Output format: filename:date

STALE_COUNT=0
TOTAL_COUNT=0
STALE_FILES=()

while IFS= read -r file; do
    # Extract last-verified date from YAML frontmatter
    DATE="$(awk '/^last-verified:/ {gsub(/[" ]/, "", $2); print $2; exit}' "${file}" 2>/dev/null || true)"

    if [[ -z "${DATE}" ]]; then
        # No last-verified — skip (could be index or template)
        continue
    fi

    TOTAL_COUNT=$((TOTAL_COUNT + 1))

    # Compare dates lexically — works for YYYY-MM-DD format
    if [[ "${DATE}" < "${CUTOFF}" ]]; then
        STALE_COUNT=$((STALE_COUNT + 1))
        STALE_FILES+=("${file}|${DATE}")
    fi
done < <(find "${REPO_ROOT}/references" -name '*.md' -type f 2>/dev/null)

echo "Reference docs scanned: ${TOTAL_COUNT}"
echo "Stale docs (last-verified older than ${CUTOFF}): ${STALE_COUNT}"
echo ""

if [[ ${STALE_COUNT} -eq 0 ]]; then
    echo "✓ All reference docs are current."
    exit 0
fi

if [[ "${DETAILED}" == "--detailed" ]]; then
    echo "Stale docs:"
    for entry in "${STALE_FILES[@]}"; do
        FILE="${entry%|*}"
        DATE="${entry#*|}"
        REL_PATH="${FILE#${REPO_ROOT}/}"
        echo "  ${DATE}  ${REL_PATH}"
    done | sort
else
    echo "Stale docs (re-run with --detailed for paths):"
    for entry in "${STALE_FILES[@]}"; do
        FILE="${entry%|*}"
        REL_PATH="${FILE#${REPO_ROOT}/}"
        echo "  - ${REL_PATH}"
    done | sort
fi

echo ""
echo "To refresh a doc:"
echo "  1. Re-read the source captures and current Zscaler help articles."
echo "  2. Update content where Zscaler has changed behavior or added features."
echo "  3. Bump the last-verified date to today."
echo "  4. Commit with a message describing what changed (or 'refresh — no content changes' if just the date bump)."
