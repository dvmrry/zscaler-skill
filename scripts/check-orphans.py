#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""check-orphans.py — find reference docs that no other file links to.

Walks every .md file under `references/` and computes whether any other file
in the kit (other references, docs/, SKILL.md, README.md, PLAN.md) links to
it via a markdown link, a backticked path, or a directory reference.

Files with no inbound link are orphans — readers have no path to discover
them, even if their content is substantive.

Exit code: 0 if no orphans (or only exempt orphans); 1 if any non-exempt
orphans found.

Run:
    ./scripts/check-orphans.py             # console output, exit code drives CI
    ./scripts/check-orphans.py --json      # machine-readable JSON output
    ./scripts/check-orphans.py --strict    # exit 1 even on exempt orphans

Exemptions (default): files under `_archive/**` and the `_template.md` file.

Detection heuristics:

  1. Markdown link to .md file:        `](path/to/file.md)` or `](#anchor)`
  2. Backticked path:                  `` `references/foo/bar.md` ``
  3. Directory reference (whole dir):  `references/_primer/` → marks every
                                        .md file in that directory as linked
  4. Frontmatter `sources:` paths:     handled the same as backticked paths

The check is intentionally permissive — it errs toward marking a file
linked rather than orphan. False negatives (real orphans missed) are
preferable to false positives (legitimate hub files flagged).
"""

import argparse
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
REFS = REPO_ROOT / "references"

# Files / patterns excluded from the "candidate orphan" set
EXEMPT_PATTERNS = [
    "_archive/**",      # archived content; intentional dead-end
    "_template.md",     # frontmatter template; not real content
]

# Markdown link to a .md target (with optional anchor): `](path.md)` or `](path.md#anchor)`
LINK_MD_RE = re.compile(r"\]\(([^)]+\.md)(?:#[^)]+)?\)")

# Path to a references/ .md file (backticks optional; matches frontmatter
# sources: lists, table cells, raw mentions, and backticked inline cites)
BACKTICK_PATH_RE = re.compile(r"`?(references/[A-Za-z0-9_./\-]+\.md)`?")

# Directory reference inside a markdown link: `](path/)`
DIR_REF_LINK_RE = re.compile(r"\]\(([^)]+/)\)")

# Backticked directory reference: `` `references/foo/` ``
DIR_REF_BACKTICK_RE = re.compile(r"`(references/[A-Za-z0-9_./\-]+/)`")


def is_exempt(path: Path, repo_root: Path) -> bool:
    """True if path matches any EXEMPT_PATTERNS (relative to references/)."""
    rel = path.relative_to(repo_root / "references")
    rel_str = str(rel)
    for pattern in EXEMPT_PATTERNS:
        if rel.match(pattern) or rel_str.startswith(pattern.replace("/**", "/")):
            return True
    return False


def collect_source_files(repo_root: Path) -> list[Path]:
    """All files whose links count as 'inbound' references."""
    sources: list[Path] = []
    for d in ("references", "docs"):
        sub = repo_root / d
        if sub.exists():
            sources.extend(sub.rglob("*.md"))
            sources.extend(sub.rglob("*.html"))
    for f in ("SKILL.md", "README.md", "PLAN.md"):
        p = repo_root / f
        if p.exists():
            sources.append(p)
    return sources


def collect_linked_targets(sources: list[Path], repo_root: Path) -> set[Path]:
    """Resolve every link / path / dir reference in source files to absolute paths."""
    targets: set[Path] = set()
    refs = repo_root / "references"

    for src in sources:
        try:
            text = src.read_text(errors="ignore")
        except Exception:
            continue

        # 1. Markdown links to .md files (resolved relative to source)
        for match in LINK_MD_RE.findall(text):
            try:
                resolved = (src.parent / match).resolve()
                targets.add(resolved)
            except Exception:
                pass

        # 2. Backticked / raw paths starting with `references/`
        for match in BACKTICK_PATH_RE.findall(text):
            resolved = (repo_root / match).resolve()
            targets.add(resolved)

        # 3. Directory references — mark ONLY the directory's index.md (or
        #    overview.md as fallback) as linked. The reader navigates to the
        #    directory's entry point; from there they follow specific links.
        #    Auto-linking every child .md would be too lenient — a directory
        #    reference is a weak guarantee, not a transitive "everything is
        #    discoverable" claim.

        for match in DIR_REF_LINK_RE.findall(text):
            try:
                dir_path = (src.parent / match).resolve()
            except Exception:
                continue
            if dir_path.is_dir():
                for entry_name in ("index.md", "overview.md"):
                    entry = dir_path / entry_name
                    if entry.exists():
                        targets.add(entry.resolve())
                        break

        for match in DIR_REF_BACKTICK_RE.findall(text):
            dir_path = (repo_root / match).resolve()
            if dir_path.is_dir():
                for entry_name in ("index.md", "overview.md"):
                    entry = dir_path / entry_name
                    if entry.exists():
                        targets.add(entry.resolve())
                        break

    return targets


def find_orphans(repo_root: Path) -> tuple[list[Path], list[Path]]:
    """Return (non-exempt orphans, exempt orphans)."""
    ref_files = sorted((repo_root / "references").rglob("*.md"))
    sources = collect_source_files(repo_root)
    linked_targets = collect_linked_targets(sources, repo_root)

    non_exempt: list[Path] = []
    exempt: list[Path] = []

    for f in ref_files:
        if f.resolve() in linked_targets:
            continue
        if is_exempt(f, repo_root):
            exempt.append(f)
        else:
            non_exempt.append(f)

    return non_exempt, exempt


def main() -> int:
    parser = argparse.ArgumentParser(description="Detect orphan reference files.")
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit machine-readable JSON instead of human output.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit 1 even when only exempt orphans are present.",
    )
    args = parser.parse_args()

    non_exempt, exempt = find_orphans(REPO_ROOT)
    total_refs = len(list((REPO_ROOT / "references").rglob("*.md")))

    if args.json:
        out = {
            "total_reference_files": total_refs,
            "orphans": [str(p.relative_to(REPO_ROOT)) for p in non_exempt],
            "exempt_orphans": [str(p.relative_to(REPO_ROOT)) for p in exempt],
        }
        print(json.dumps(out, indent=2))
    else:
        if not non_exempt and not exempt:
            print(f"✓ No orphan reference files. ({total_refs} files checked.)")
            return 0

        if non_exempt:
            print(f"✗ {len(non_exempt)} orphan reference file(s) — no inbound links:")
            for p in non_exempt:
                print(f"  {p.relative_to(REPO_ROOT)}")

        if exempt:
            label = "Exempt orphans (intentionally not linked):"
            print(f"\nℹ {label}")
            for p in exempt:
                print(f"  {p.relative_to(REPO_ROOT)}")

        print(f"\n{total_refs} reference files checked.")

    if args.strict:
        return 1 if (non_exempt or exempt) else 0
    return 1 if non_exempt else 0


if __name__ == "__main__":
    sys.exit(main())
