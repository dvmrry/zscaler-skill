#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["httpx>=0.27"]
# ///
"""issue-watch.py — track new GitHub issues across vendored upstream Zscaler repos.

Status: functional. Two output modes:

  Local mode (default)
    Walks the seven vendored upstream repos via the public GitHub REST API.
    Compares against last-seen timestamps per repo (saved to
    logs/issue-watch-state.json). Outputs new and updated issues to
    logs/issues-new.md for human triage. Both files live in logs/
    (gitignored upstream — populated per-fork).

  Sticky-issue mode (CI-friendly)
    Activated by --sticky-label LABEL (or --sticky-issue NUMBER). Finds a
    designated GitHub issue in the target repo and edits its body with the
    latest digest each run. Last-check timestamp is embedded in the body as
    an HTML comment (decouples from arbitrary comment activity that would
    otherwise bump the issue's updated_at). With --bootstrap-if-missing,
    creates the sticky issue on first run if no existing issue carries the
    label. Designed for unattended GH Actions runs.

Run (local mode):
    ./scripts/issue-watch.py

Run (sticky mode, CI):
    ./scripts/issue-watch.py --sticky-label issue-watch-digest --bootstrap-if-missing
    ./scripts/issue-watch.py --sticky-issue 42 --target-repo owner/repo

First-run lookback: FIRST_RUN_LOOKBACK_DAYS (default 30 days). Subsequent
runs use the persisted timestamp.

Authentication:
    Public repos work unauthenticated at 60 requests/hr per IP — sufficient
    for the seven repos checked weekly. For higher rate limits and for
    sticky-mode write access, set GITHUB_TOKEN. In GitHub Actions,
    secrets.GITHUB_TOKEN provides 1000 req/hr and the issues:write
    permission needed for sticky mode.

Manual review workflow:
    1. Run script (or let CI run it).
    2. Open logs/issues-new.md (local) or the sticky issue (CI).
    3. For each surfaced issue: source-check + thread per
       references/_verification-protocol.md, or skip if not behavioral.
    4. Comment on the sticky issue (if used) to record the triage decision.
"""

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import httpx

REPO_ROOT = Path(__file__).resolve().parent.parent
STATE_FILE = REPO_ROOT / "logs" / "issue-watch-state.json"
OUTPUT = REPO_ROOT / "logs" / "issues-new.md"

REPOS = [
    "zscaler/zscaler-sdk-python",
    "zscaler/zscaler-sdk-go",
    "zscaler/terraform-provider-zia",
    "zscaler/terraform-provider-zpa",
    "zscaler/terraform-provider-ztc",
    "zscaler/zscaler-mcp-server",
    "zscaler/zscaler-api-specs",
]

GITHUB_API = "https://api.github.com"
FIRST_RUN_LOOKBACK_DAYS = 30
STICKY_TITLE = "Upstream Issue Watch — running digest"
LAST_CHECK_MARKER_RE = re.compile(r"<!--\s*last_check:\s*([^\s]+)\s*-->")


# ----- CLI -----


def parse_args(argv: list[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Watch upstream Zscaler GitHub issues.")
    p.add_argument(
        "--sticky-label",
        help="Find sticky issue by this label (mutually exclusive with --sticky-issue).",
    )
    p.add_argument(
        "--sticky-issue",
        type=int,
        help="Find sticky issue by this number (mutually exclusive with --sticky-label).",
    )
    p.add_argument(
        "--target-repo",
        help="OWNER/NAME of the repo to write the sticky issue. "
        "Defaults to GITHUB_REPOSITORY env var, falls back to parsing 'origin' remote.",
    )
    p.add_argument(
        "--bootstrap-if-missing",
        action="store_true",
        help="In sticky-label mode, create the sticky issue if no issue with that label exists.",
    )
    return p.parse_args(argv)


# ----- target repo detection -----


def detect_target_repo() -> str | None:
    if env := os.environ.get("GITHUB_REPOSITORY"):
        return env
    try:
        r = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            capture_output=True,
            text=True,
            check=True,
            cwd=REPO_ROOT,
        )
        url = r.stdout.strip()
        m = re.search(r"github\.com[:/]([^/]+/[^/.]+?)(?:\.git)?$", url)
        if m:
            return m.group(1)
    except Exception:
        pass
    return None


# ----- local-mode state -----


def load_local_state() -> dict:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except json.JSONDecodeError:
            print(f"WARN: {STATE_FILE} unparseable; treating as empty state", file=sys.stderr)
    return {}


def save_local_state(state: dict):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2, sort_keys=True))


# ----- sticky-mode state -----


def find_sticky_issue(
    client: httpx.Client,
    target_repo: str,
    label: str | None,
    issue_num: int | None,
) -> dict | None:
    """Find the sticky issue by label or by number. Returns None if not found."""
    if issue_num is not None:
        r = client.get(f"{GITHUB_API}/repos/{target_repo}/issues/{issue_num}")
        if r.status_code == 404:
            return None
        r.raise_for_status()
        return r.json()
    if label:
        # state=open means closing the sticky issue acts as a kill switch:
        # next run won't find it, and (with --bootstrap-if-missing) creates a
        # fresh one. Without state=open, closing wouldn't actually disable —
        # PATCH works on closed issues, so we'd silently keep editing a
        # closed issue's body forever. UX-driven choice.
        r = client.get(
            f"{GITHUB_API}/repos/{target_repo}/issues",
            params={"labels": label, "state": "open", "per_page": "10"},
        )
        r.raise_for_status()
        # Filter out PRs (the issues endpoint returns both)
        issues = [i for i in r.json() if "pull_request" not in i]
        if len(issues) > 1:
            raise ValueError(
                f"Multiple open issues found with label '{label}'; "
                f"specify --sticky-issue NUMBER or close the duplicates"
            )
        return issues[0] if issues else None
    return None


def bootstrap_sticky_issue(
    client: httpx.Client, target_repo: str, label: str
) -> dict:
    """Create the sticky issue with the given label."""
    body = (
        f"<!-- last_check: {(datetime.now(timezone.utc) - timedelta(days=FIRST_RUN_LOOKBACK_DAYS)).isoformat()} -->\n\n"
        "*Sticky issue created by `scripts/issue-watch.py`. The body is rewritten on each "
        "run with the latest digest of upstream Zscaler GitHub issue activity. Comment "
        "on this issue to record triage decisions for individual surfaced items. The "
        "running digest itself replaces in place — past digests live in this issue's "
        "edit history (accessible via the GitHub UI).*"
    )
    r = client.post(
        f"{GITHUB_API}/repos/{target_repo}/issues",
        json={"title": STICKY_TITLE, "body": body, "labels": [label]},
    )
    r.raise_for_status()
    print(f"Bootstrapped sticky issue #{r.json()['number']}", file=sys.stderr)
    return r.json()


def patch_sticky_issue(
    client: httpx.Client, target_repo: str, issue_num: int, body: str
):
    r = client.patch(
        f"{GITHUB_API}/repos/{target_repo}/issues/{issue_num}",
        json={"body": body},
    )
    r.raise_for_status()


def parse_last_check(body: str) -> str | None:
    """Extract the embedded `last_check` ISO timestamp from a sticky issue's body."""
    m = LAST_CHECK_MARKER_RE.search(body)
    return m.group(1) if m else None


# ----- fetch -----


def fetch_issues(client: httpx.Client, repo: str, since: str) -> list[dict]:
    """Fetch issues updated since the given ISO timestamp (PRs filtered out)."""
    issues = []
    page = 1
    while True:
        params = {
            "state": "all",
            "per_page": "100",
            "page": str(page),
            "since": since,
            "sort": "updated",
            "direction": "desc",
        }
        r = client.get(f"{GITHUB_API}/repos/{repo}/issues", params=params)
        r.raise_for_status()
        batch = r.json()
        if not batch:
            break
        issues.extend(i for i in batch if "pull_request" not in i)
        if len(batch) < 100:
            break
        page += 1
        if page > 10:
            print(f"WARN: hit page cap on {repo}; truncating", file=sys.stderr)
            break
    return issues


def fetch_for_repos(
    client: httpx.Client, since_per_repo: dict[str, str]
) -> tuple[list[dict], dict[str, str]]:
    """Fetch new issues across all repos. Returns (new_issues, new_state).

    new_state maps each repo to the run timestamp on success, or to the previous
    state value on failure (so failures don't lose the last-seen marker)."""
    new_issues = []
    new_state = {}
    current_run_at = datetime.now(timezone.utc).isoformat()
    for repo in REPOS:
        since = since_per_repo.get(repo, since_per_repo.get("__default__"))
        print(f"Checking {repo} (since {since[:19]})...", file=sys.stderr)
        try:
            issues = fetch_issues(client, repo, since)
        except httpx.HTTPStatusError as e:
            code = e.response.status_code if e.response else "?"
            msg = e.response.text[:200] if e.response else str(e)
            print(f"  ERROR {code}: {msg}", file=sys.stderr)
            # Preserve previous since on failure (so we retry next run) — fall
            # back to the run's `since` if the per-repo value was missing.
            new_state[repo] = since_per_repo.get(repo) or since
            continue
        except httpx.HTTPError as e:
            print(f"  HTTP ERROR: {e}", file=sys.stderr)
            new_state[repo] = since_per_repo.get(repo) or since
            continue
        for i in issues:
            i["_repo"] = repo
        new_issues.extend(issues)
        print(f"  Found {len(issues)} issues", file=sys.stderr)
        new_state[repo] = current_run_at
    return new_issues, new_state


# ----- render -----


def render_digest(
    new_issues: list[dict],
    last_check: str | None,
    current_run_at: str,
    sticky_marker: bool = False,
) -> str:
    """Build the markdown digest. If sticky_marker is True, prepend an HTML
    comment with the current_run_at timestamp for the next run to read."""
    lines = []
    if sticky_marker:
        lines.append(f"<!-- last_check: {current_run_at} -->")
        lines.append("")
    lines += [
        "# New / updated GitHub issues across vendored upstream repos",
        "",
        f"Generated by `scripts/issue-watch.py` at {current_run_at}.",
    ]
    if last_check:
        lines.append(f"Looking at activity since {last_check[:19]}.")
    lines += [
        "",
        f"- Repos checked: {len(REPOS)}",
        f"- New / updated issues: {len(new_issues)}",
        "",
        "Triage workflow:",
        "",
        "1. Each issue below is a candidate. Read the title; click through if it looks behavioral.",
        "2. Issues that touch documented skill behavior → source-check + thread per "
        "[`references/_verification-protocol.md`](../references/_verification-protocol.md).",
        "3. Issues that look like TF schema drift or SDK enum changes → re-run "
        "`scripts/find-asymmetries.py`.",
        "4. Issues that don't bear on the skill → skip.",
        "",
        "---",
        "",
    ]

    if not new_issues:
        lines.append("**No new or updated issues since last run.**")
        if sticky_marker:
            lines.append("")
            lines.append("*The last_check marker has been advanced to keep next-run scope tight.*")
        return "\n".join(lines)

    by_repo: dict[str, list[dict]] = {}
    for issue in new_issues:
        by_repo.setdefault(issue["_repo"], []).append(issue)

    for repo in REPOS:
        issues = by_repo.get(repo, [])
        if not issues:
            continue
        lines.append(f"## {repo} ({len(issues)})")
        lines.append("")
        for issue in sorted(issues, key=lambda i: -int(i["number"])):
            state_icon = "🟢 open" if issue["state"] == "open" else "🔴 closed"
            labels = ", ".join(lbl["name"] for lbl in issue.get("labels", []))
            label_str = f" [{labels}]" if labels else ""
            comment_count = issue.get("comments", 0)
            comment_str = f" ({comment_count} comments)" if comment_count else ""
            lines.append(
                f"- {state_icon} [#{issue['number']}]({issue['html_url']}) — "
                f"{issue['title']}{label_str}{comment_str}  "
                f"*(updated {issue['updated_at'][:10]})*"
            )
        lines.append("")

    return "\n".join(lines)


# ----- main -----


def make_client() -> httpx.Client:
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token := os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {token}"
        print("Using GITHUB_TOKEN for authentication", file=sys.stderr)
    else:
        print("Running unauthenticated (60 req/hr per IP)", file=sys.stderr)
    return httpx.Client(headers=headers, timeout=30.0)


def run_local_mode():
    state = load_local_state()
    default_since = (
        datetime.now(timezone.utc) - timedelta(days=FIRST_RUN_LOOKBACK_DAYS)
    ).isoformat()
    # Replace None / falsy values with the default — earlier runs may have
    # persisted nulls for repos that errored mid-fetch.
    since_per_repo = {repo: (state.get(repo) or default_since) for repo in REPOS}
    since_per_repo["__default__"] = default_since
    current_run_at = datetime.now(timezone.utc).isoformat()

    with make_client() as client:
        new_issues, new_state = fetch_for_repos(client, since_per_repo)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(render_digest(new_issues, default_since, current_run_at, sticky_marker=False))
    save_local_state(new_state)
    print(f"Wrote {OUTPUT}")
    print(f"  {len(new_issues)} new / updated issues across {len(REPOS)} repos")


def run_sticky_mode(args: argparse.Namespace):
    target_repo = args.target_repo or detect_target_repo()
    if not target_repo:
        print(
            "ERROR: --target-repo not specified and could not be auto-detected. "
            "Set GITHUB_REPOSITORY or specify --target-repo OWNER/NAME.",
            file=sys.stderr,
        )
        sys.exit(2)

    if not os.environ.get("GITHUB_TOKEN"):
        print(
            "ERROR: sticky mode requires GITHUB_TOKEN with issues:write permission.",
            file=sys.stderr,
        )
        sys.exit(2)

    with make_client() as client:
        sticky = find_sticky_issue(client, target_repo, args.sticky_label, args.sticky_issue)
        if sticky is None:
            if args.bootstrap_if_missing and args.sticky_label:
                sticky = bootstrap_sticky_issue(client, target_repo, args.sticky_label)
            else:
                print(
                    f"ERROR: no sticky issue found in {target_repo} "
                    f"(label={args.sticky_label}, number={args.sticky_issue}). "
                    "Pass --bootstrap-if-missing with --sticky-label to create one.",
                    file=sys.stderr,
                )
                sys.exit(2)

        last_check = parse_last_check(sticky.get("body") or "")
        if last_check is None:
            last_check = (
                datetime.now(timezone.utc) - timedelta(days=FIRST_RUN_LOOKBACK_DAYS)
            ).isoformat()
            print(
                f"WARN: no last_check marker found in sticky issue body; "
                f"defaulting to {last_check[:19]}",
                file=sys.stderr,
            )

        # All repos use the same `since` in sticky mode (the embedded marker)
        since_per_repo = {"__default__": last_check}
        current_run_at = datetime.now(timezone.utc).isoformat()
        new_issues, _ = fetch_for_repos(client, since_per_repo)

        new_body = render_digest(new_issues, last_check, current_run_at, sticky_marker=True)
        patch_sticky_issue(client, target_repo, sticky["number"], new_body)
        print(f"Updated sticky issue #{sticky['number']} in {target_repo}")
        print(f"  {len(new_issues)} new / updated issues across {len(REPOS)} repos")


def main(argv: list[str] | None = None):
    args = parse_args(argv if argv is not None else sys.argv[1:])
    if args.sticky_label or args.sticky_issue:
        run_sticky_mode(args)
    else:
        run_local_mode()


if __name__ == "__main__":
    main()
