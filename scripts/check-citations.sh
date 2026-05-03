#!/usr/bin/env bash
# check-citations.sh — verify citations in references/**/*.md resolve,
# and flag inference-shaped paragraphs that lack a citation.
#
# Status: functional.
#
# Two checks:
#   1. Path/URL resolution — every markdown link target resolves to a file
#      or returns a successful HTTP response.
#   2. Inference-without-citation — paragraphs containing editorial /
#      inferential phrases (e.g., "the most common cause", "in roughly
#      all cases", "operationally significant") must have a citation
#      somewhere in the same paragraph. Hits without a citation get
#      flagged.
#
# Usage:
#   ./scripts/check-citations.sh                  # paths only (fast, offline)
#   ./scripts/check-citations.sh --check-urls     # also HEAD URLs (slow, online)
#
# Exit code: 0 if all checks pass, 1 if any broken.
#
# Limitations:
#   - Only handles markdown link syntax [text](target). Reference-style
#     [text][ref] + [ref]: target is not handled.
#   - Skips citations inside code-fenced blocks (best-effort).
#   - URL HEAD requests with 5-second timeout. Slow / paywalled sites
#     may false-positive.
#   - Paragraphs inside "Open questions" / "Open items" sections are
#     exempted from the inference check — those sections are explicitly
#     for unverified content.

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
else
    EXIT_CODE=1
fi

# ---------------------------------------------------------------------------
# Check 2: inference-without-citation
# ---------------------------------------------------------------------------
#
# For each .md file under references/, walk paragraphs (blank-line-separated)
# and flag any paragraph that:
#   (a) contains an inference-shaped phrase, AND
#   (b) does NOT contain a citation marker in the same paragraph.
#
# Skips:
#   - Code blocks (handled by awk state machine)
#   - Frontmatter (between --- markers at top of file)
#   - Paragraphs inside "## Open questions" or "## Open items" sections
#     (those are explicitly for unverified content)

echo ""
echo "Checking for inference-without-citation in references/**/*.md"

INFERENCE_HITS=()

while IFS= read -r file; do
    rel_file="${file#${REPO_ROOT}/}"

    # Skip navigation files, primer (foundational-explanation) docs, and
    # the audit playbook itself (which enumerates the inference patterns
    # as examples — it's a meta-doc about the check, not a content claim).
    case "${rel_file}" in
        */index.md|references/_meta/primer/*) continue ;;
        references/shared/audit-prompt.md|references/shared/audit-methodology.md) continue ;;
    esac

    # awk script: paragraph-level scan with section/frontmatter/code-block awareness.
    # Output format: <line_number>:<snippet>
    output=$(awk '
        BEGIN {
            paragraph = ""; paragraph_start = 0
            in_frontmatter = 0; in_code = 0; in_open_section = 0
            frontmatter_seen = 0
        }
        # Frontmatter detection: --- at line 1 opens; next --- closes.
        /^---$/ {
            if (NR == 1) { in_frontmatter = 1; next }
            if (in_frontmatter) { in_frontmatter = 0; next }
        }
        in_frontmatter { next }
        # Code block detection
        /^```/ { in_code = !in_code; next }
        in_code { next }
        # Section header detection — entering Open questions/items toggles on,
        # any other ## heading toggles off.
        /^## / {
            if (tolower($0) ~ /open questions|open items/) {
                in_open_section = 1
            } else {
                in_open_section = 0
            }
            paragraph = ""; next
        }
        in_open_section { next }
        # Blank line — flush paragraph
        /^[[:space:]]*$/ {
            check_paragraph()
            paragraph = ""; paragraph_start = 0
            next
        }
        # Accumulate non-blank lines into the current paragraph
        {
            if (paragraph_start == 0) paragraph_start = NR
            paragraph = paragraph " " $0
        }
        END { check_paragraph() }

        function check_paragraph(    p) {
            if (paragraph == "") return
            p = tolower(paragraph)
            # Inference patterns — editorial / unsourced framing.
            # Tightened 2026-05-03 to drop operational-routing false positives:
            # "the answer is X", "the answer when ...", "almost always" (often
            # meta-doc navigation), "increasingly the cause/answer" (same family).
            # Operators-report tightened to non-"-ing" forms only — "operators reporting
            # X should Y" is diagnostic preamble, not an unsourced claim.
            if (p !~ /operationally significant|most common cause|most common (root )?cause|in roughly all|in nearly all|in nearly every|almost never|we observed|we have observed|operators (consistently )?(report|see)[[:space:]]|the lever for|by far the/) return
            # Citation markers — vendor path, file:line, "Tier X", clarification ID, "line N"
            if (paragraph ~ /vendor\/[a-zA-Z0-9_.-]+\/|[a-zA-Z0-9_-]+\.(py|go|sh|md):[0-9]+|Tier [A-D]\b|clarification [a-zA-Z]+-[0-9]+|\(line[s]? [0-9]+|see (also )?[`\[]/) return
            # Snippet — first 140 chars
            snippet = paragraph
            gsub(/^[[:space:]]+/, "", snippet)
            if (length(snippet) > 140) snippet = substr(snippet, 1, 140) "…"
            print paragraph_start ":" snippet
        }
    ' "${file}")

    if [[ -n "${output}" ]]; then
        while IFS= read -r line; do
            INFERENCE_HITS+=("${rel_file}:${line}")
        done <<< "${output}"
    fi
done < <(find "${REFS_DIR}" -name '*.md' -type f)

if [[ ${#INFERENCE_HITS[@]} -gt 0 ]]; then
    echo "✗ Inference-without-citation (${#INFERENCE_HITS[@]}):"
    printf '  %s\n' "${INFERENCE_HITS[@]}"
    echo ""
    EXIT_CODE=1
else
    echo "✓ No inference-without-citation paragraphs."
fi

exit "${EXIT_CODE:-0}"
