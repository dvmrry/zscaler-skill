#!/usr/bin/env bash
# render-skill-pdf.sh — stitch the skill corpus into a single PDF packet.
#
# First-attempt implementation. Uses pandoc + a LaTeX engine.
# Output: dist/zscaler-skill-<date>.pdf
#
# Requires:
#   - pandoc (brew install pandoc)
#   - basictex / mactex / texlive (brew install --cask basictex)
#     OR set PANDOC_PDF_ENGINE=weasyprint and brew install weasyprint
#
# Usage:
#   ./scripts/render-skill-pdf.sh           # default: TOC + skill + references
#   ./scripts/render-skill-pdf.sh --quick   # SKILL.md + portfolio-map only (smaller, ~30 pages)
#
# Output is gitignored; this is for human review, not skill artifacts.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

DATE="$(date +%Y-%m-%d)"
OUT_DIR="dist"
OUT_FILE="$OUT_DIR/zscaler-skill-$DATE.pdf"
ENGINE="${PANDOC_PDF_ENGINE:-xelatex}"

mkdir -p "$OUT_DIR"

QUICK=0
if [[ "${1:-}" == "--quick" ]]; then
    QUICK=1
fi

# Order: SKILL.md → README → portfolio-map → primer → product T1 docs → shared → T2a docs → meta
# Per-product: index.md first, then alphabetical within the directory
collect_files() {
    local files=()

    files+=("SKILL.md")
    files+=("README.md")
    files+=("PLAN.md")
    files+=("references/_portfolio-map.md")
    files+=("references/_layering-model.md")
    files+=("references/_verification-protocol.md")

    if [[ $QUICK -eq 1 ]]; then
        printf '%s\n' "${files[@]}"
        return
    fi

    # Primer
    if [[ -d references/_primer ]]; then
        for f in references/_primer/index.md references/_primer/*.md; do
            [[ -f "$f" && "$f" != "references/_primer/index.md" || "$f" == "references/_primer/index.md" ]] && files+=("$f")
        done
    fi

    # Tier 1 products in routing order (matches SKILL.md priority)
    for dir in zia zpa zcc zdx zbi zidentity cloud-connector zwa shared; do
        if [[ -d "references/$dir" ]]; then
            [[ -f "references/$dir/index.md" ]] && files+=("references/$dir/index.md")
            for f in references/"$dir"/*.md; do
                [[ -f "$f" && "$(basename "$f")" != "index.md" ]] && files+=("$f")
            done
            # logs subdirectory if present
            for f in references/"$dir"/logs/*.md; do
                [[ -f "$f" ]] && files+=("$f")
            done
        fi
    done

    # Tier 2a products
    for dir in deception risk360 ai-security zms; do
        if [[ -d "references/$dir" ]]; then
            for f in references/"$dir"/*.md; do
                [[ -f "$f" ]] && files+=("$f")
            done
        fi
    done

    # Cross-cutting meta docs
    for f in references/_clarifications.md references/_runbooks.md references/_agent-patterns.md references/_policy-simulation.md; do
        [[ -f "$f" ]] && files+=("$f")
    done

    # Dedupe
    printf '%s\n' "${files[@]}" | awk '!seen[$0]++'
}

mapfile -t FILES < <(collect_files)
echo "Stitching ${#FILES[@]} files into $OUT_FILE (engine: $ENGINE)..."

# Build pandoc args
PANDOC_ARGS=(
    -o "$OUT_FILE"
    --pdf-engine="$ENGINE"
    --toc
    --toc-depth=2
    --metadata title="Zscaler Skill — Reference Packet"
    --metadata date="$DATE"
    -V geometry:margin=0.75in
    -V fontsize=10pt
    -V colorlinks=true
    -V linkcolor=blue
    -V urlcolor=blue
)

# Cap title-block weirdness: each file's frontmatter becomes inline metadata in pandoc.
# Strip frontmatter at concatenation time to keep the rendered PDF clean.
TMP_INPUT="$(mktemp -t zscaler-skill-stitch.XXXXXX.md)"
trap 'rm -f "$TMP_INPUT"' EXIT

{
    for f in "${FILES[@]}"; do
        echo
        echo "<!-- BEGIN $f -->"
        echo
        # Strip YAML frontmatter (lines between leading `---` markers)
        awk '
            BEGIN { in_fm = 0; fm_done = 0 }
            NR == 1 && /^---$/ { in_fm = 1; next }
            in_fm && /^---$/ { in_fm = 0; fm_done = 1; next }
            in_fm { next }
            { print }
        ' "$f"
        echo
    done
} > "$TMP_INPUT"

pandoc "${PANDOC_ARGS[@]}" "$TMP_INPUT"

echo
echo "Done: $OUT_FILE"
ls -lh "$OUT_FILE"
