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
  - **Indeterminate**: the submodule checkout or one of the pinned commit
    objects is unavailable, so the cited source cannot be classified.

Exit code:
  - 0 if all comparisons are available and no HIGH-priority drift findings
  - 1 if any HIGH-priority drift findings or indeterminate comparisons exist

Run:
    ./scripts/check-vendor-drift.py
    ./scripts/check-vendor-drift.py --strict   # also exit 1 on Unverified
    ./scripts/check-vendor-drift.py --json
"""

import argparse
from fnmatch import fnmatchcase
import json
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---", re.DOTALL)


@dataclass(frozen=True)
class SubmoduleStatus:
    """The checkout state reported for one configured submodule."""

    path: str
    sha: str
    initialized: bool
    marker: str


@dataclass(frozen=True)
class SubmoduleStatusResult:
    """A parsed ``git submodule status`` result and any command error."""

    statuses: dict[str, SubmoduleStatus]
    error: str | None = None


class VendorDiffError(RuntimeError):
    """A submodule commit range could not be enumerated."""

    def __init__(self, submodule_path: str, old_sha: str, new_sha: str, reason: str):
        self.submodule_path = submodule_path
        self.old_sha = old_sha
        self.new_sha = new_sha
        self.reason = reason
        super().__init__(reason)


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


def _command_detail(result: subprocess.CompletedProcess[str], label: str) -> str:
    detail = (result.stderr or result.stdout or "").strip()
    return detail or f"{label} exited with status {result.returncode}"


def get_current_submodule_status() -> SubmoduleStatusResult:
    """Return parsed submodule SHAs, preserving initialization state/errors.

    ``git submodule status`` prefixes uninitialized entries with ``-`` and
    conflicted entries with ``U``.  Those prefixes are meaningful evidence:
    the SHA in the line is the superproject's gitlink, not proof that the
    corresponding commit or source tree is available locally.
    """
    try:
        result = subprocess.run(
            ["git", "submodule", "status"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
        )
    except OSError as error:
        return SubmoduleStatusResult({}, f"git submodule status failed: {error}")

    statuses: dict[str, SubmoduleStatus] = {}
    for raw_line in result.stdout.splitlines():
        line = raw_line.rstrip()
        if not line:
            continue

        # Format: "[ +-U]<sha> <path>[ (<branch>)]". Keep the marker before
        # stripping whitespace so an initialized line beginning with a space
        # is distinguishable from an uninitialized line beginning with '-'.
        marker = line[0] if line[0] in " +-U" else ""
        payload = line[1:] if marker else line
        parts = payload.strip().split()
        if len(parts) < 2:
            continue
        sha, path = parts[0], parts[1]
        statuses[path] = SubmoduleStatus(
            path=path,
            sha=sha,
            initialized=marker not in {"-", "U"},
            marker=marker,
        )

    if result.returncode != 0:
        return SubmoduleStatusResult(
            statuses,
            f"git submodule status failed (exit {result.returncode}): {_command_detail(result, 'git submodule status')}",
        )
    return SubmoduleStatusResult(statuses)


def get_current_submodule_shas() -> dict[str, str]:
    """Return ``{submodule_path: current_sha}`` for compatibility.

    Callers that classify source comparisons should use
    :func:`get_current_submodule_status` so an equal gitlink is not treated as
    current when its checkout is unavailable.
    """
    return {
        path: status.sha
        for path, status in get_current_submodule_status().statuses.items()
    }


def submodule_for_path(source_path: str, submodule_paths: list[str]) -> str | None:
    """Return the submodule containing source_path, or None."""
    for sm in submodule_paths:
        if source_path == sm or source_path.startswith(sm + "/"):
            return sm
    return None


def changed_files(submodule_path: str, old_sha: str, new_sha: str) -> set[str]:
    """Files changed in a submodule commit range.

    An empty file set is a valid result only when Git successfully evaluated
    the range.  Raising on command failure prevents an unavailable range from
    being mistaken for a clean, unchanged citation.
    """
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only", f"{old_sha}..{new_sha}"],
            cwd=REPO_ROOT / submodule_path,
            capture_output=True,
            text=True,
        )
    except OSError as error:
        raise VendorDiffError(
            submodule_path,
            old_sha,
            new_sha,
            f"git diff could not run for {submodule_path}: {error}",
        ) from error

    if result.returncode != 0:
        module_root = REPO_ROOT / submodule_path
        if not (module_root / ".git").exists():
            reason = (
                f"{submodule_path} is not initialized; "
                f"git diff failed (exit {result.returncode}): "
                f"{_command_detail(result, 'git diff')}"
            )
        else:
            reason = (
                f"git diff failed for {submodule_path} "
                f"(exit {result.returncode}): {_command_detail(result, 'git diff')}"
            )
        raise VendorDiffError(submodule_path, old_sha, new_sha, reason)

    return {line.strip() for line in result.stdout.splitlines() if line.strip()}


def source_matches_changed_path(source: str, changed_path: str) -> bool:
    """Return whether one submodule-relative source covers a changed path.

    Sources may name one file, a directory prefix, or a glob such as
    ``zscaler/zia/services/**``. The drift report must treat wildcard and
    directory declarations as coverage roots; comparing them as literal file
    names silently understates behavior-bearing drift.
    """
    # A source equal to ``vendor/<submodule>/`` becomes the empty string after
    # its submodule prefix is removed. Preserve that as an explicit whole-root
    # declaration rather than misclassifying every change as low priority.
    if source == "":
        return True
    if source.endswith("/"):
        return changed_path.startswith(source)
    if any(char in source for char in "*?["):
        source_parts = source.split("/")
        changed_parts = changed_path.split("/")

        def matches(source_index: int, changed_index: int) -> bool:
            if source_index == len(source_parts):
                return changed_index == len(changed_parts)
            source_part = source_parts[source_index]
            if source_part == "**":
                return matches(source_index + 1, changed_index) or (
                    changed_index < len(changed_parts)
                    and matches(source_index, changed_index + 1)
                )
            return (
                changed_index < len(changed_parts)
                and fnmatchcase(changed_parts[changed_index], source_part)
                and matches(source_index + 1, changed_index + 1)
            )

        return matches(0, 0)
    return source == changed_path


def main() -> int:
    parser = argparse.ArgumentParser(description="Detect vendor-source drift in refs.")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit 1 also on Unverified refs (cite vendor/ but no verified-against).",
    )
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    status_result = get_current_submodule_status()
    current_statuses = status_result.statuses
    current_shas = {
        path: status.sha for path, status in current_statuses.items()
    }
    submodule_paths = list(current_shas.keys())

    refs = sorted((REPO_ROOT / "references").rglob("*.md"))

    drifted_high: list[dict] = []
    drifted_low: list[dict] = []
    unverified: list[dict] = []
    indeterminate: list[dict] = []
    current_count = 0

    diff_cache: dict[tuple[str, str, str], set[str] | VendorDiffError] = {}

    if status_result.error:
        # A failed inventory command cannot establish any current SHA. Keep a
        # concrete error row in the machine-readable report rather than
        # allowing a missing/empty map to look like a clean scan.
        indeterminate.append({
            "ref": None,
            "submodule": "(git submodule status)",
            "captured_sha": None,
            "current_sha": None,
            "reason": status_result.error,
        })

    if not submodule_paths:
        if not status_result.error:
            indeterminate.append({
                "ref": None,
                "submodule": "(git submodule status)",
                "captured_sha": None,
                "current_sha": None,
                "reason": "no submodules detected via `git submodule status`",
            })

    # A nonzero inventory command means even parsed lines are not a reliable
    # complete snapshot. The global row above is the only safe result; do not
    # let any partial output turn an unavailable comparison into ``current``.
    if status_result.error:
        refs = []

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
            status = current_statuses.get(sm)
            current_sha = status.sha if status else current_shas.get(sm)
            if not current_sha:
                indeterminate.append({
                    "ref": rel_ref,
                    "submodule": sm,
                    "captured_sha": verified_against.get(sm),
                    "current_sha": None,
                    "reason": "current submodule SHA is unavailable from `git submodule status`",
                })
                continue
            captured_sha = verified_against.get(sm)

            # Match the source-pin validator's optional human-readable label.
            # The label describes verification scope; it is not part of a Git ref.
            if isinstance(captured_sha, str):
                pin = re.fullmatch(
                    r"([0-9a-f]{40})(?:\s+\([^()\r\n]+\))?", captured_sha, re.IGNORECASE
                )
                if pin:
                    captured_sha = pin.group(1).lower()

            if not captured_sha:
                unverified.append({
                    "ref": rel_ref,
                    "submodule": sm,
                    "sources": srcs,
                    "current_sha": current_sha,
                })
                continue

            if status is None or not status.initialized:
                state_reason = (
                    f"{sm} is not initialized"
                    if status is None or status.marker == "-"
                    else f"{sm} has unresolved submodule state ({status.marker})"
                )
                indeterminate.append({
                    "ref": rel_ref,
                    "submodule": sm,
                    "captured_sha": captured_sha,
                    "current_sha": current_sha,
                    "reason": f"{state_reason}; source comparison is unavailable",
                })
                continue

            if captured_sha == current_sha:
                current_count += 1
                continue

            # SHAs differ — get the file list that changed
            cache_key = (sm, captured_sha, current_sha)
            if cache_key not in diff_cache:
                try:
                    diff_cache[cache_key] = changed_files(sm, captured_sha, current_sha)
                except VendorDiffError as error:
                    diff_cache[cache_key] = error
                except Exception as error:
                    diff_cache[cache_key] = VendorDiffError(
                        sm,
                        captured_sha,
                        current_sha,
                        f"unexpected source comparison error: {error}",
                    )
            comparison = diff_cache[cache_key]
            if isinstance(comparison, VendorDiffError):
                indeterminate.append({
                    "ref": rel_ref,
                    "submodule": sm,
                    "captured_sha": captured_sha,
                    "current_sha": current_sha,
                    "reason": comparison.reason,
                })
                continue
            changed = comparison

            # Strip submodule prefix to compare with the diff output
            relative_srcs = [
                s[len(sm) + 1:] if s.startswith(sm + "/") else s for s in srcs
            ]
            touched = sorted(
                changed_path
                for changed_path in changed
                if any(
                    source_matches_changed_path(source, changed_path)
                    for source in relative_srcs
                )
            )

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
            "indeterminate": indeterminate,
            "indeterminate_count": len(indeterminate),
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
            print("  (Add `verified-against:` to ref frontmatter at next verification cycle to enable drift tracking.)")
            print()

        if indeterminate:
            print(f"? {len(indeterminate)} ref+submodule pair(s) could not be compared:")
            for f in indeterminate[:10]:
                ref = f.get("ref") or "(repository submodule inventory)"
                old_sha = f.get("captured_sha") or "(unknown)"
                new_sha = f.get("current_sha") or "(unknown)"
                if (
                    isinstance(old_sha, str)
                    and len(old_sha) >= 7
                    and re.fullmatch(r"[0-9a-fA-F]+", old_sha)
                ):
                    old_sha = old_sha[:7]
                if (
                    isinstance(new_sha, str)
                    and len(new_sha) >= 7
                    and re.fullmatch(r"[0-9a-fA-F]+", new_sha)
                ):
                    new_sha = new_sha[:7]
                print(
                    f"  {ref}: {f['submodule']} "
                    f"({old_sha}..{new_sha}) — {f['reason']}"
                )
            if len(indeterminate) > 10:
                print(f"  ... and {len(indeterminate) - 10} more")
            print()

        if not (drifted_high or drifted_low or unverified or indeterminate):
            print(f"✓ All refs with vendor sources are current and verified ({current_count} pair(s) checked).")
        elif current_count:
            print(f"({current_count} ref+submodule pair(s) verified and current.)")

    if drifted_high:
        return 1
    if indeterminate:
        return 1
    if args.strict and unverified:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
