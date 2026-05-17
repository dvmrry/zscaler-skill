#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""vendor-impact-summary.py — summarize submodule bump impact for PRs."""

from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def run(cmd: list[str], cwd: Path = REPO_ROOT) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=cwd, text=True, capture_output=True)


def changed_submodules(base_ref: str, head_ref: str) -> list[tuple[str, str, str]]:
    diff = run(["git", "diff", "--raw", base_ref, head_ref, "--", "vendor"])
    out: list[tuple[str, str, str]] = []
    for line in diff.stdout.splitlines():
        parts = line.split()
        if len(parts) < 6:
            continue
        old_mode, new_mode, old_sha, new_sha, status, path = parts[:6]
        if old_mode.lstrip(":") == "160000" or new_mode.lstrip(":") == "160000":
            out.append((path, old_sha, new_sha))
    return out


def submodule_logs(changes: list[tuple[str, str, str]], max_commits: int) -> list[str]:
    lines: list[str] = []
    if not changes:
        return ["No vendor submodule pointer changes detected.", ""]
    for path, old_sha, new_sha in changes:
        lines.append(f"### `{path}`")
        lines.append("")
        lines.append(f"`{old_sha[:7]}` -> `{new_sha[:7]}`")
        lines.append("")
        log = run(["git", "-C", path, "log", "--oneline", "--decorate", "--no-merges", f"{old_sha}..{new_sha}"])
        commits = log.stdout.strip().splitlines()
        if commits:
            for commit in commits[:max_commits]:
                lines.append(f"- {commit}")
            if len(commits) > max_commits:
                lines.append(f"- ... and {len(commits) - max_commits} more")
        else:
            lines.append("- No commit log available locally.")
        lines.append("")
    return lines


def drift_section(changes: list[tuple[str, str, str]]) -> list[str]:
    changed_submodule_paths = {path for path, _, _ in changes}
    if not changed_submodule_paths:
        return [
            "No vendor submodule pointer changes detected in this PR, so vendor drift impact was skipped.",
            "",
        ]

    result = run(["./scripts/check-vendor-drift.py", "--json"])
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError:
        return ["Could not parse `check-vendor-drift.py --json` output.", ""]

    high = [
        item for item in data.get("drifted_high_priority", [])
        if item.get("submodule") in changed_submodule_paths
    ]
    low = [
        item for item in data.get("drifted_low_priority", [])
        if item.get("submodule") in changed_submodule_paths
    ]
    unverified = [
        item for item in data.get("unverified", [])
        if item.get("submodule") in changed_submodule_paths
    ]
    lines = [
        f"- High-priority cited-file drift: **{len(high)}**",
        f"- Low-priority unchanged cited-file bumps: **{len(low)}**",
        f"- Unverified vendor-citing ref/submodule pairs on changed submodules: **{len(unverified)}**",
        "",
    ]
    if high:
        lines.append("High-priority items:")
        for item in high[:20]:
            files = ", ".join(item.get("touched_files", [])[:3])
            lines.append(f"- `{item['ref']}` — `{item['submodule']}`; changed: {files}")
        if len(high) > 20:
            lines.append(f"- ... and {len(high) - 20} more")
        lines.append("")
    return lines


def main() -> int:
    parser = argparse.ArgumentParser(description="Summarize vendor submodule bump impact.")
    parser.add_argument("--base", required=True)
    parser.add_argument("--head", default="HEAD")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--max-commits", type=int, default=8)
    args = parser.parse_args()

    changes = changed_submodules(args.base, args.head)
    lines = [
        "## Vendor Impact Summary",
        "",
        "Generated automatically for a PR touching `vendor/**`.",
        "",
        "## Submodule Commit Logs",
        "",
        *submodule_logs(changes, args.max_commits),
        "## Reference Drift",
        "",
        *drift_section(changes),
        "## Asymmetry Candidates",
        "",
        "`scripts/find-asymmetries.py` runs in this workflow and uploads `_data/logs/asymmetry-candidates.md` as an artifact when present.",
        "",
    ]
    output = args.output if args.output.is_absolute() else REPO_ROOT / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(lines), encoding="utf-8")
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
