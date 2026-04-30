#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""check-doc-links.py — verify internal hrefs and asset paths in docs/.

Walks every HTML file under docs/, extracts each href and src value,
filters to relative paths (skipping http://, https://, mailto:, tel:,
data:, anchors, and ?p= source-viewer slugs), resolves each to a
filesystem path, and reports anything that doesn't exist.

Exit 1 on any broken link. Designed to be cheap to run before commit:

    python3 scripts/check-doc-links.py

Pair with the existing scripts/check-* hygiene scripts.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import urlparse, unquote

REPO_ROOT = Path(__file__).resolve().parent.parent
DOCS_ROOT = REPO_ROOT / "docs"

# Capture href="..." and src="..." values. Single-quote variants are
# rare in our HTML but supported for safety.
ATTR_RE = re.compile(r"""(?:href|src)\s*=\s*["']([^"']+)["']""", re.IGNORECASE)

SKIP_SCHEMES = ("http://", "https://", "mailto:", "tel:", "data:", "javascript:")


def is_skippable(target: str) -> bool:
    if not target:
        return True
    if target.startswith("#"):
        return True  # in-page anchor
    if target.lower().startswith(SKIP_SCHEMES):
        return True
    if "${" in target or "{{" in target:
        return True  # JS template literal or templating placeholder
    return False


def resolve(html_file: Path, target: str) -> tuple[Path, str]:
    """Return (resolved_path, fragment) for a relative link.

    Strips ?query and #fragment before resolving against the directory
    containing html_file. The fragment is returned alongside so the
    caller can decide whether to verify in-file anchors (we don't).
    """
    parsed = urlparse(target)
    path = unquote(parsed.path)
    if path == "":
        # e.g. "?p=zia" — no path component; resolves to the file itself.
        return html_file, parsed.fragment

    base = html_file.parent
    candidate = (base / path).resolve()
    return candidate, parsed.fragment


def find_html(root: Path) -> list[Path]:
    return sorted(p for p in root.rglob("*.html") if p.is_file())


SCRIPT_STYLE_RE = re.compile(
    r"<(script|style)\b[^>]*>.*?</\1>",
    re.IGNORECASE | re.DOTALL,
)


def check_file(html_file: Path, broken: list[tuple[Path, int, str, Path]]) -> None:
    text = html_file.read_text(encoding="utf-8")
    # Blank out <script>/<style> content (preserving line numbers) so we
    # don't try to resolve link patterns that appear inside JS strings.
    text = SCRIPT_STYLE_RE.sub(
        lambda m: re.sub(r"[^\n]", " ", m.group(0)),
        text,
    )
    for line_idx, line in enumerate(text.splitlines(), start=1):
        for m in ATTR_RE.finditer(line):
            target = m.group(1).strip()
            if is_skippable(target):
                continue

            resolved, _ = resolve(html_file, target)

            # If the resolved path is a directory, accept index.html inside.
            if resolved.is_dir():
                if (resolved / "index.html").exists():
                    continue
                broken.append((html_file, line_idx, target, resolved))
                continue

            if not resolved.exists():
                broken.append((html_file, line_idx, target, resolved))


def main() -> int:
    if not DOCS_ROOT.exists():
        print(f"error: docs/ not found at {DOCS_ROOT}", file=sys.stderr)
        return 2

    broken: list[tuple[Path, int, str, Path]] = []
    files = find_html(DOCS_ROOT)
    for f in files:
        check_file(f, broken)

    if not broken:
        print(f"OK: {len(files)} HTML files, no broken internal links.")
        return 0

    print(f"FAIL: {len(broken)} broken link(s):\n")
    for src, line, target, resolved in broken:
        rel_src = src.relative_to(REPO_ROOT)
        try:
            rel_resolved = resolved.relative_to(REPO_ROOT)
        except ValueError:
            rel_resolved = resolved
        print(f"  {rel_src}:{line}")
        print(f"      target:   {target}")
        print(f"      resolves: {rel_resolved}")
        print()
    return 1


if __name__ == "__main__":
    sys.exit(main())
