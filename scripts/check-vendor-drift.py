#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6"]
# ///
"""check-vendor-drift.py — detect references whose cited vendor sources may be stale.

Each reference doc may include an optional `verified-against` frontmatter field
pinning submodule SHAs at last-verified time:

    verified-against:
      vendor/zscaler-sdk-go: a1b2c3d
      vendor/zscaler-sdk-python: e4f5a6b

The script compares those SHAs against the current ones (from `git submodule
status`) and classifies each ref:

  - **Drifted (file touched)**: cited vendor file changed in the submodule
    between the captured and current SHAs. HIGH priority — re-verify the ref.
  - **Drifted (submodule bumped, cited files unchanged)**: submodule moved
    but the specific files this ref cites didn't change. LOW priority.
  - **Current**: captured SHA == current SHA. Silent OK.
  - **Unverified**: ref cites vendor/ paths but has no `verified-against`
    field. Advisory — encourage backfill at next verification.

Exit code:
  - 0 if no HIGH-priority drift findings
  - 1 if any HIGH-priority drift findings (cited vendor file actually changed)

Run:
    ./scripts/check-vendor-drift.py
    ./scripts/check-vendor-drift.py --strict   # also exit 1 on Unverified
    ./scripts/check-vendor-drift.py --json
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---", re.DOTALL)


def parse_frontmatter(path: Path) -> dict | None:
    try:
        text = path.read_text(errors="ignore")
    except Exception:
        return None
    m = FRONTMATTER_RE.search(text)
    if not m:
        return None
    try:
        return yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError:
        return None


def get_current_submodule_shas() -> dict[str, str]:
    """Return {submodule_path: current_pinned_sha}."""
    result = subprocess.run(
        ["git", "submodule", "status"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
    )
    out = {}
    for line in result.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        # Format: "[ +-]<sha> <path>[ (<branch>)]"
        parts = line.split()
        if len(parts) < 2:
            continue
        sha = parts[0].lstrip("+-").lstrip()
        out[parts[1]] = sha
    return out


def submodule_for_path(source_path: str, submodule_paths: list[str]) -> str | None:
    """Return the submodule containing source_path, or None."""
    for sm in submodule_paths:
        if source_path == sm or source_path.startswith(sm + "/"):
            return sm
    return None


def changed_files(submodule_path: str, old_sha: str, new_sha: str) -> set[str]:
    """Files changed in submodule between old_sha and new_sha."""
    result = subprocess.run(
        ["git", "diff", "--name-only", f"{old_sha}..{new_sha}"],
        cwd=REPO_ROOT / submodule_path,
        capture_output=True,
        text=True,
    )
    return {line.strip() for line in result.stdout.splitlines() if line.strip()}


def main() -> int:
    parser = argparse.ArgumentParser(description="Detect vendor-source drift in refs.")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit 1 also on Unverified refs (cite vendor/ but no verified-against).",
    )
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    current_shas = get_current_submodule_shas()
    submodule_paths = list(current_shas.keys())

    if not submodule_paths:
        print("✗ No submodules detected via `git submodule status`.")
        return 1

    refs = sorted((REPO_ROOT / "references").rglob("*.md"))

    drifted_high: list[dict] = []
    drifted_low: list[dict] = []
    unverified: list[dict] = []
    current_count = 0

    diff_cache: dict[tuple[str, str, str], set[str]] = {}

    for ref_path in refs:
        fm = parse_frontmatter(ref_path)
        if not fm:
            continue

        sources = fm.get("sources") or []
        if not isinstance(sources, list):
            continue

        vendor_sources = [s for s in sources if isinstance(s, str) and s.startswith("vendor/")]
        if not vendor_sources:
            continue

        verified_against = fm.get("verified-against") or {}
        if not isinstance(verified_against, dict):
            verified_against = {}

        # Group cited paths by submodule
        srcs_by_sm: dict[str, list[str]] = {}
        for src in vendor_sources:
            sm = submodule_for_path(src, submodule_paths)
            if sm:
                srcs_by_sm.setdefault(sm, []).append(src)

        rel_ref = str(ref_path.relative_to(REPO_ROOT))

        for sm, srcs in srcs_by_sm.items():
            current_sha = current_shas.get(sm)
            if not current_sha:
                continue
            captured_sha = verified_against.get(sm)

            if not captured_sha:
                unverified.append({
                    "ref": rel_ref,
                    "submodule": sm,
                    "sources": srcs,
                    "current_sha": current_sha,
                })
                continue

            if captured_sha == current_sha:
                current_count += 1
                continue

            # SHAs differ — get the file list that changed
            cache_key = (sm, captured_sha, current_sha)
            if cache_key not in diff_cache:
                diff_cache[cache_key] = changed_files(sm, captured_sha, current_sha)
            changed = diff_cache[cache_key]

            # Strip submodule prefix to compare with the diff output
            relative_srcs = [
                s[len(sm) + 1:] if s.startswith(sm + "/") else s for s in srcs
            ]
            touched = [r for r in relative_srcs if r in changed]

            if touched:
                drifted_high.append({
                    "ref": rel_ref,
                    "submodule": sm,
                    "captured_sha": captured_sha,
                    "current_sha": current_sha,
                    "touched_files": touched,
                })
            else:
                drifted_low.append({
                    "ref": rel_ref,
                    "submodule": sm,
                    "captured_sha": captured_sha,
                    "current_sha": current_sha,
                    "sources": srcs,
                })

    if args.json:
        print(json.dumps({
            "drifted_high_priority": drifted_high,
            "drifted_low_priority": drifted_low,
            "unverified": unverified,
            "current_count": current_count,
        }, indent=2))
    else:
        if drifted_high:
            print(f"✗ {len(drifted_high)} ref+submodule pair(s) cite files that CHANGED since last verification:")
            for f in drifted_high:
                files = ", ".join(f["touched_files"][:3])
                more = "" if len(f["touched_files"]) <= 3 else f" (+{len(f['touched_files']) - 3} more)"
                print(f"  {f['ref']}")
                print(f"    {f['submodule']} ({f['captured_sha'][:7]}..{f['current_sha'][:7]}) — {files}{more}")
            print()

        if drifted_low:
            print(f"⚠ {len(drifted_low)} ref+submodule pair(s) have submodule bumps but cited files unchanged:")
            for f in drifted_low[:10]:
                print(f"  {f['ref']}: {f['submodule']} ({f['captured_sha'][:7]}..{f['current_sha'][:7]})")
            if len(drifted_low) > 10:
                print(f"  ... and {len(drifted_low) - 10} more")
            print()

        if unverified:
            print(f"ℹ {len(unverified)} ref+submodule pair(s) lack a `verified-against` field:")
            for f in unverified[:10]:
                print(f"  {f['ref']}: cites {f['submodule']}")
            if len(unverified) > 10:
                print(f"  ... and {len(unverified) - 10} more")
            print(f"  (Add `verified-against:` to ref frontmatter at next verification cycle to enable drift tracking.)")
            print()

        if not (drifted_high or drifted_low or unverified):
            print(f"✓ All refs with vendor sources are current and verified ({current_count} pair(s) checked).")
        elif current_count:
            print(f"({current_count} ref+submodule pair(s) verified and current.)")

    if drifted_high:
        return 1
    if args.strict and unverified:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
