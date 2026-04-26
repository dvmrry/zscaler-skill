#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "markdown>=3.5",
#     "pymdown-extensions>=10",
# ]
# ///
"""render-skill-pdf.py — stitch the skill corpus into one packet.

Pure-Python: dependencies install via uv with no system libraries required.

Outputs **HTML** by default. To get a PDF, open the HTML in a browser and
print-to-PDF (Cmd+P → Save as PDF). Browsers handle CSS rendering reliably
without us having to drag in cairo / pango / pandoc / LaTeX as system deps.

Why HTML and not PDF directly: every Python markdown→PDF library worth using
(weasyprint, xhtml2pdf via svglib) pulls native libraries (cairo, pango,
gobject) that aren't pip-installable on a clean machine. HTML keeps this
script working anywhere uv works.

Usage:
    ./scripts/render-skill-pdf.py             # full corpus → dist/zscaler-skill-<date>.html
    ./scripts/render-skill-pdf.py --quick     # SKILL.md + meta only

Output is gitignored.
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

T1_PRODUCTS = ["zia", "zpa", "zcc", "zdx", "zbi", "zidentity", "cloud-connector", "zwa", "shared"]
T2A_PRODUCTS = ["deception", "risk360", "ai-security", "zms"]
META_DOCS = [
    "references/_clarifications.md",
    "references/_runbooks.md",
    "references/_agent-patterns.md",
    "references/_policy-simulation.md",
]
QUICK_FILES = [
    "SKILL.md",
    "README.md",
    "PLAN.md",
    "references/_portfolio-map.md",
    "references/_layering-model.md",
    "references/_verification-protocol.md",
]

FRONTMATTER_RE = re.compile(r"\A---\s*\n.*?\n---\s*\n", re.DOTALL)


def collect_files(quick: bool) -> list[Path]:
    files: list[Path] = []

    for relpath in QUICK_FILES:
        p = REPO_ROOT / relpath
        if p.exists():
            files.append(p)

    if quick:
        return files

    primer_dir = REPO_ROOT / "references" / "_primer"
    if primer_dir.exists():
        index = primer_dir / "index.md"
        if index.exists():
            files.append(index)
        for p in sorted(primer_dir.glob("*.md")):
            if p.name != "index.md":
                files.append(p)

    for product in T1_PRODUCTS:
        product_dir = REPO_ROOT / "references" / product
        if not product_dir.exists():
            continue
        index = product_dir / "index.md"
        if index.exists():
            files.append(index)
        for p in sorted(product_dir.glob("*.md")):
            if p.name != "index.md":
                files.append(p)
        logs_dir = product_dir / "logs"
        if logs_dir.exists():
            for p in sorted(logs_dir.glob("*.md")):
                files.append(p)

    for product in T2A_PRODUCTS:
        product_dir = REPO_ROOT / "references" / product
        if not product_dir.exists():
            continue
        for p in sorted(product_dir.glob("*.md")):
            files.append(p)

    for relpath in META_DOCS:
        p = REPO_ROOT / relpath
        if p.exists():
            files.append(p)

    seen: set[Path] = set()
    deduped: list[Path] = []
    for f in files:
        if f not in seen:
            seen.add(f)
            deduped.append(f)
    return deduped


def strip_frontmatter(md: str) -> str:
    return FRONTMATTER_RE.sub("", md)


def stitch(files: list[Path]) -> tuple[str, list[tuple[str, str]]]:
    """Return (combined_md, [(anchor_id, display_path) for nav])."""
    parts: list[str] = []
    nav: list[tuple[str, str]] = []
    for f in files:
        rel = str(f.relative_to(REPO_ROOT))
        anchor = "doc-" + re.sub(r"[^a-z0-9]+", "-", rel.lower()).strip("-")
        nav.append((anchor, rel))
        body = strip_frontmatter(f.read_text())
        parts.append(f'\n\n<div class="doc-section" id="{anchor}">\n')
        parts.append(f'<p class="doc-source"><code>{rel}</code></p>\n\n')
        parts.append(body)
        parts.append("\n\n</div>\n\n")
    return "".join(parts), nav


CSS = """
:root { color-scheme: light dark; }
body {
    font-family: -apple-system, "Segoe UI", "Helvetica Neue", "Liberation Sans", system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #1a1a1a;
    max-width: 900px;
    margin: 0 auto;
    padding: 2em 1.5em 4em;
    background: #fafafa;
}
h1.title { font-size: 1.8em; border-bottom: 2px solid #444; padding-bottom: 0.3em; }
.meta { color: #666; font-size: 0.9em; margin-bottom: 2em; }
nav.toc { background: #fff; border: 1px solid #ddd; padding: 1em 1.5em; border-radius: 4px; margin-bottom: 2em; }
nav.toc h2 { margin-top: 0; font-size: 1.1em; }
nav.toc ol { padding-left: 1.5em; margin: 0; }
nav.toc li { font-size: 0.92em; line-height: 1.7; }
nav.toc code { font-size: 0.95em; background: transparent; padding: 0; }
.doc-section { background: #fff; border: 1px solid #e0e0e0; border-radius: 4px; padding: 1em 1.5em; margin: 1em 0; }
.doc-source { color: #888; font-size: 0.85em; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 0.4em; }
.doc-source code { font-size: 0.95em; background: transparent; padding: 0; }
h1 { font-size: 1.4em; margin-top: 1em; }
h2 { font-size: 1.2em; }
h3 { font-size: 1.05em; }
h4 { font-size: 1em; }
code { font-family: "SF Mono", Menlo, Consolas, monospace; font-size: 0.9em; background: #f4f4f4; padding: 1px 5px; border-radius: 3px; }
pre { background: #f4f4f4; padding: 0.8em 1em; border-radius: 4px; overflow-x: auto; font-size: 0.85em; }
pre code { background: transparent; padding: 0; }
table { border-collapse: collapse; margin: 0.6em 0; font-size: 0.9em; }
th, td { border: 1px solid #ccc; padding: 5px 9px; text-align: left; vertical-align: top; }
th { background: #f0f0f0; }
a { color: #0a58ca; text-decoration: none; }
a:hover { text-decoration: underline; }
blockquote { border-left: 3px solid #999; padding-left: 1em; color: #555; margin: 0.6em 0; }
@media print {
    body { background: #fff; padding: 0; max-width: none; font-size: 10pt; }
    .doc-section { border: none; background: transparent; padding: 0; page-break-inside: avoid; }
    nav.toc { page-break-after: always; }
    h1, h2, h3 { page-break-after: avoid; }
    pre, table { page-break-inside: avoid; }
}
"""


def render_html(stitched_md: str, nav: list[tuple[str, str]], title: str) -> str:
    import markdown

    md = markdown.Markdown(
        extensions=[
            "extra",
            "tables",
            "fenced_code",
            "sane_lists",
            "pymdownx.superfences",
            "pymdownx.tilde",
        ],
    )
    body_html = md.convert(stitched_md)

    nav_items = "\n".join(f'  <li><a href="#{aid}"><code>{path}</code></a></li>' for aid, path in nav)
    nav_html = (
        '<nav class="toc">\n'
        f"<h2>Contents ({len(nav)} files)</h2>\n"
        f"<ol>\n{nav_items}\n</ol>\n"
        "</nav>\n"
    )

    return (
        "<!doctype html>\n<html lang='en'>\n<head>\n"
        "  <meta charset='utf-8'>\n"
        f"  <title>{title}</title>\n"
        f"  <style>{CSS}</style>\n"
        "</head>\n<body>\n"
        f"  <h1 class='title'>{title}</h1>\n"
        f"  <p class='meta'>Generated {date.today()} — print to PDF from your browser (Cmd/Ctrl+P) for an offline packet.</p>\n"
        f"{nav_html}"
        f"{body_html}\n"
        "</body>\n</html>\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Render the skill corpus to one HTML packet.")
    parser.add_argument("--quick", action="store_true", help="SKILL.md + meta docs only.")
    parser.add_argument("--out", help="Output path. Defaults to dist/zscaler-skill-<YYYY-MM-DD>.html")
    args = parser.parse_args()

    files = collect_files(args.quick)
    if not files:
        print("No files matched.", file=sys.stderr)
        return 1

    suffix = "-quick" if args.quick else ""
    default_out = REPO_ROOT / "dist" / f"zscaler-skill-{date.today()}{suffix}.html"
    out_path = Path(args.out) if args.out else default_out

    print(f"Stitching {len(files)} files...", file=sys.stderr)
    stitched, nav = stitch(files)

    title = "Zscaler Skill — Reference Packet"
    if args.quick:
        title += " (Quick)"

    html = render_html(stitched, nav, title)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(html)

    size_kb = out_path.stat().st_size // 1024
    print(f"Done: {out_path} ({size_kb} KB)", file=sys.stderr)
    print("To get a PDF: open the file in a browser and print to PDF.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
