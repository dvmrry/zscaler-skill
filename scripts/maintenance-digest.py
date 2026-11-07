#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["httpx>=0.27"]
# ///
"""maintenance-digest.py — aggregate low-friction repo maintenance signals.

Status: functional.

Produces a Markdown digest suitable for a scheduled GitHub sticky issue. This
is intentionally shallow: it turns existing hygiene signals into a backlog
without trying to perform reference distillation or agent review. Vendor drift
against the knowledge graph is reported by the weekly refresh pull request
(`scripts/kb-refresh.mjs`), not here.

Usage:
    ./scripts/maintenance-digest.py
    ./scripts/maintenance-digest.py --output <runtime-data-mount>/schemas/maintenance-digest.md
    ./scripts/maintenance-digest.py --sticky-label maintenance-digest --bootstrap-if-missing
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import httpx

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_LABEL = "maintenance-digest"
DEFAULT_TITLE = "Skill maintenance digest"
STATUS_RE = re.compile(r"Status:\s*(.+)")
TODO_RE = re.compile(r"\bTODO\b")
MARKER_RE = re.compile(r"<!-- maintenance-digest:last_check=(.*?) -->")


@dataclass
class CommandResult:
    code: int
    stdout: str
    stderr: str


def run(cmd: list[str]) -> CommandResult:
    proc = subprocess.run(cmd, cwd=REPO_ROOT, text=True, capture_output=True)
    return CommandResult(proc.returncode, proc.stdout, proc.stderr)


def rel(path: Path) -> str:
    return str(path.relative_to(REPO_ROOT))


def display_path(path: Path) -> str:
    """Return a repo-relative path when possible, otherwise an absolute path."""
    try:
        return rel(path)
    except ValueError:
        return str(path)


def scaffold_inventory() -> tuple[list[tuple[str, str]], list[str]]:
    scaffolds: list[tuple[str, str]] = []
    todos: list[str] = []

    for path in sorted((REPO_ROOT / "scripts").iterdir()):
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        status_match = STATUS_RE.search(text[:1500])
        if status_match and "scaffold" in status_match.group(1).lower():
            scaffolds.append((rel(path), status_match.group(1).strip()))
        if any(TODO_RE.search(line) for line in text.splitlines() if line.lstrip().startswith(("#", "//"))):
            todos.append(rel(path))

    return scaffolds, todos


def json_from_command(cmd: list[str]) -> dict[str, Any]:
    result = run(cmd)
    if not result.stdout.strip():
        return {"_error": result.stderr.strip() or f"exit {result.code}"}
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return {"_error": result.stdout.strip()[:1000], "_exit": result.code}


def hygiene_eval_warning() -> str:
    result = run(["./scripts/check-hygiene.py"])
    combined = (result.stdout + "\n" + result.stderr).strip()
    lines = combined.splitlines()
    capture: list[str] = []
    active = False
    for line in lines:
        if "## eval-coverage" in line:
            active = True
        if active:
            capture.append(line)
    return "\n".join(capture).strip()


def render(args: argparse.Namespace) -> str:
    now = datetime.now(timezone.utc).replace(microsecond=0)
    scaffolds, todo_files = scaffold_inventory()
    freshness = json_from_command(["./scripts/check-scrape-freshness.py", str(args.scrape_days), "--json"])
    eval_warning = hygiene_eval_warning()

    stale_scrapes = freshness.get("stale", []) if isinstance(freshness, dict) else []
    # Output that does not parse is an unknown count, never a reassuring zero.
    stale_count = "unknown" if freshness.get("_error") else str(len(stale_scrapes))

    out: list[str] = [
        f"<!-- maintenance-digest:last_check={now.isoformat()} -->",
        f"# {DEFAULT_TITLE}",
        "",
        f"Generated: `{now.isoformat()}`",
        "",
        "## Summary",
        "",
        f"- Stale help scrapes: **{stale_count}** older than {args.scrape_days} days.",
        f"- Script scaffolds: **{len(scaffolds)}**.",
        f"- TODO-bearing scripts: **{len(todo_files)}**.",
        "",
    ]

    out += [f"## Stale Help Scrapes > {args.scrape_days} Days", ""]
    if freshness.get("_error"):
        out += [f"`check-scrape-freshness.py --json` failed or produced unreadable output: `{freshness['_error']}`", ""]
    elif stale_scrapes:
        for item in sorted(stale_scrapes, key=lambda x: x.get("age_days", 0), reverse=True)[:30]:
            out.append(f"- `{item.get('age_days')}` days — `{item.get('path')}`")
        if len(stale_scrapes) > 30:
            out.append(f"- ... and {len(stale_scrapes) - 30} more")
        out.append("")
    else:
        out += ["No stale help scrapes.", ""]

    out += ["## Eval Coverage", ""]
    if eval_warning:
        out += ["```text", eval_warning, "```", ""]
    else:
        out += ["No eval coverage warning surfaced by `check-hygiene.py`.", ""]

    out += ["## Scaffold And TODO Inventory", ""]
    if scaffolds:
        out.append("Script scaffolds:")
        for path, status in scaffolds:
            out.append(f"- `{path}` — {status}")
        out.append("")
    if todo_files:
        out.append("Scripts with TODO markers:")
        for path in todo_files[:50]:
            out.append(f"- `{path}`")
        if len(todo_files) > 50:
            out.append(f"- ... and {len(todo_files) - 50} more")
        out.append("")
    if not scaffolds and not todo_files:
        out += ["No scaffold or TODO inventory findings.", ""]

    out += [
        "## Suggested Triage",
        "",
        "1. Merge or review the open weekly knowledge-graph refresh pull request first.",
        "2. Recapture stale help scrapes the weekly refresh does not cover (static captures).",
        "3. Promote scaffolds only after live-tenant response shapes are confirmed.",
        "4. Add eval coverage for docs that keep changing or drive real investigations.",
        "",
    ]
    return "\n".join(out)


def github_headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def upsert_sticky_issue(body: str, label: str, bootstrap: bool) -> None:
    token = os.environ.get("GITHUB_TOKEN")
    repo = os.environ.get("GITHUB_REPOSITORY")
    if not token or not repo:
        raise SystemExit("GITHUB_TOKEN and GITHUB_REPOSITORY are required for sticky issue mode")
    base = f"https://api.github.com/repos/{repo}"
    headers = github_headers(token)
    with httpx.Client(timeout=30, headers=headers) as client:
        label_resp = client.get(f"{base}/labels/{label}")
        if label_resp.status_code == 404:
            create_label = client.post(
                f"{base}/labels",
                json={"name": label, "color": "6f42c1", "description": "Automated maintenance digest"},
            )
            create_label.raise_for_status()
        else:
            label_resp.raise_for_status()

        response = client.get(f"{base}/issues", params={"labels": label, "state": "open", "per_page": 20})
        response.raise_for_status()
        issues = [i for i in response.json() if "pull_request" not in i]
        issue = next((i for i in issues if MARKER_RE.search(i.get("body") or "")), None)
        if not issue and issues:
            issue = issues[0]
        if issue:
            update = client.patch(f"{base}/issues/{issue['number']}", json={"body": body})
            update.raise_for_status()
            print(f"Updated sticky issue #{issue['number']}", file=sys.stderr)
            return
        if not bootstrap:
            raise SystemExit(f"No open sticky issue found with label {label!r}; pass --bootstrap-if-missing")
        create = client.post(f"{base}/issues", json={"title": DEFAULT_TITLE, "body": body, "labels": [label]})
        create.raise_for_status()
        print(f"Bootstrapped sticky issue #{create.json()['number']}", file=sys.stderr)


def main() -> int:
    parser = argparse.ArgumentParser(description="Render repo maintenance digest.")
    parser.add_argument("--scrape-days", type=int, default=90)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--sticky-label", default=None)
    parser.add_argument("--bootstrap-if-missing", action="store_true")
    args = parser.parse_args()

    body = render(args)
    if args.output:
        path = args.output if args.output.is_absolute() else REPO_ROOT / args.output
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(body, encoding="utf-8")
        print(f"Wrote {display_path(path)}", file=sys.stderr)
    if args.sticky_label:
        upsert_sticky_issue(body, args.sticky_label, args.bootstrap_if_missing)
    if not args.output and not args.sticky_label:
        print(body)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
