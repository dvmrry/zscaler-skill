#!/usr/bin/env bash
# refresh-automate-zscaler.sh — refresh captures from automate.zscaler.com.
#
# Status: scaffold + manual-action wrapper.
#
# This script does NOT run a full Playwright capture sweep itself —
# Playwright-based scraping requires a Claude Code agent harness or a Node.js
# Playwright installation that's tenant-specific. Instead, this script:
#
#   1. Audits the existing automate.zscaler.com captures for staleness markers.
#   2. Provides a checklist for running a manual capture refresh via a Claude
#      Code agent.
#   3. Diffs the Postman collection (delegates to refresh-postman.sh).
#
# Manual run:  ./scripts/refresh-automate-zscaler.sh
# Scheduled:   monthly cadence is reasonable. The Docusaurus site updates
#              when Zscaler ships new OneAPI capabilities.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CAPTURE_DIR="${REPO_ROOT}/vendor/zscaler-help/automate-zscaler"

echo "=== automate.zscaler.com refresh check ==="
echo ""

if [[ ! -d "${CAPTURE_DIR}" ]]; then
    echo "✗ Capture directory missing: ${CAPTURE_DIR}" >&2
    exit 1
fi

# Audit existing captures.
CAPTURE_COUNT="$(find "${CAPTURE_DIR}" -name '*.md' -type f | wc -l | tr -d ' ')"
echo "Existing captures: ${CAPTURE_COUNT} files in ${CAPTURE_DIR#${REPO_ROOT}/}/"
echo ""

# Show capture timestamps from frontmatter / file content.
echo "Capture timestamps (newest → oldest):"
for f in "${CAPTURE_DIR}"/*.md; do
    if [[ -f "${f}" ]]; then
        DATE="$(grep -oE 'Captured: [0-9]{4}-[0-9]{2}-[0-9]{2}' "${f}" | head -1 | awk '{print $2}')"
        SLUG="$(basename "${f}" .md)"
        if [[ -n "${DATE}" ]]; then
            echo "  ${DATE}  ${SLUG}"
        fi
    fi
done | sort -r | head -10

echo ""
echo "=== Refresh checklist ==="
echo ""
echo "If captures are >60 days old, a refresh pass is reasonable. Steps:"
echo ""
echo "  1. Run an Explore agent in Claude Code with Playwright MCP enabled:"
echo ""
echo "     - Tools: browser_navigate, browser_evaluate (NOT browser_run_code)"
echo "     - Target: https://automate.zscaler.com/docs/{getting-started,api-reference-and-guides,tools}/"
echo "     - Save to: vendor/zscaler-help/automate-zscaler/<slug>.md"
echo "     - Capture pattern: () => { document.querySelectorAll('button[aria-expanded=\"false\"]')"
echo "       .forEach(b => b.click()); return document.querySelector('article')?.innerText; }"
echo ""
echo "  2. Diff captures against committed state:"
echo "     git diff -- vendor/zscaler-help/automate-zscaler/"
echo ""
echo "  3. Update synthesis docs (references/shared/oneapi.md primarily) if new"
echo "     content materially changes the cross-product behavior."
echo ""
echo "  4. Update last-verified dates on touched docs."
echo ""
echo "=== Postman collection check ==="
echo ""

# Delegate to refresh-postman.sh
if [[ -x "${REPO_ROOT}/scripts/refresh-postman.sh" ]]; then
    "${REPO_ROOT}/scripts/refresh-postman.sh"
else
    echo "(refresh-postman.sh not executable — skipping)"
fi
