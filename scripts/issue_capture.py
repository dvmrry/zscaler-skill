#!/usr/bin/env python3
"""Capture GitHub issues and pull requests on vendor repos as citable JSON, like help_capture.py does for help pages.

An issue is evidence of what someone reported, and of whether the vendor has acted on it: a claim cites what
the issue says ("issue #696 asks for tag support in zpa_policy_access_rule_v2") and, with a pointer to
`/source` and `expect`, the state it relies on (open, closed, merged). Only issues a person triaged as
relevant are captured (the weekly issue-watch digest lists the candidates); nothing is captured wholesale.

A capture is `kind: "github-issue"`: provenance in `source` (url, repo, number, state, dates, labels, and for
a pull request whether it merged), then the issue as blocks: its title, its body, and each comment under a
heading naming the commenter's association with the repo (MEMBER, CONTRIBUTOR, NONE...) and the date, never
their account name. Bodies are GitHub Markdown, parsed into the help captures' block shapes, so quotes
anchor in the same `text_of` serialization.

`check` refetches every capture: a changed body, comment or state is drift. A state change marks every line
as changed, because a claim citing the issue may rest on its being open. `check --replace --json` prints the
report scripts/kb-drift.mjs reads (`"source": "github-issues"`).

Requests go to the public GitHub REST API; GITHUB_TOKEN, when set, is sent for the higher rate limit.

Usage:
  issue_capture.py capture <issue or pull request URL> [<name.json>]   write vendor/github-issues/<name.json>
  issue_capture.py check [--json] [--replace] [<name.json> ...]       refetch captures; exit 1 on drift
  issue_capture.py text <name.json>                                    print a capture's anchoring text
"""

from __future__ import annotations

import datetime
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from help_capture import changes, text_of  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "vendor" / "github-issues"
# An @mention names a person's account; captures keep the text, not the handle (code blocks are left alone).
MENTION = re.compile(r"(?<![\w@.])@[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})\b")
URL = re.compile(r"https://github\.com/([\w.-]+)/([\w.-]+)/(issues|pull)/(\d+)/?$")


def _get(path: str) -> list | dict:
    """One API resource; a list resource is followed through its `next` pages."""
    url = f"https://api.github.com{path}"
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "zscaler-skill issue_capture.py"}
    if token := os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {token}"
    out: list = []
    while url:
        with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=60) as resp:
            data = json.load(resp)
            nxt = re.search(r'<([^>]+)>;\s*rel="next"', resp.headers.get("Link") or "")
        if not isinstance(data, list):
            return data
        out.extend(data)
        url = nxt[1] if nxt else None
    return out


def md_blocks(body: str | None) -> list[dict]:
    """GitHub Markdown as blocks: fenced code, headings, list items, and paragraphs joined onto one line."""
    blocks: list[dict] = []
    para: list[str] = []
    code: list[str] | None = None

    def flush():
        if para:
            blocks.append({"text": " ".join(para)})
            para.clear()

    # Issue templates leave HTML comments (`<!--- Please keep this note --->`); they are not the reporter's text.
    text = re.sub(r"<!--.*?-->", "", (body or "").replace("\r\n", "\n"), flags=re.S)
    for raw in text.split("\n"):
        line = raw.rstrip()
        if code is not None:
            if line.lstrip().startswith("```"):
                blocks.append({"code": "\n".join(code)})
                code = None
            else:
                code.append(line)
            continue
        if line.lstrip().startswith("```"):
            flush()
            code = []
        elif not line.strip():
            flush()
        elif m := re.match(r"(#{1,6})\s+(.*)", line):
            flush()
            blocks.append({"heading": MENTION.sub("@(user)", m[2].strip()), "level": len(m[1])})
        elif m := re.match(r"(\s*)(?:[-*+]|(\d+)[.)])\s+(.*)", line):
            flush()
            item = {"item": MENTION.sub("@(user)", m[3].strip()), "depth": len(m[1].replace("\t", "  ")) // 2}
            if m[2]:
                item["number"] = int(m[2])
            blocks.append(item)
        else:
            para.append(MENTION.sub("@(user)", line.strip()))
    if code is not None:
        blocks.append({"code": "\n".join(code)})
    flush()
    return blocks


def fetch(url: str) -> dict:
    """The capture document for one issue or pull request URL."""
    m = URL.match(url)
    if not m:
        raise SystemExit(f"not a GitHub issue or pull request URL: {url}")
    owner, repo, _, number = m.groups()
    issue = _get(f"/repos/{owner}/{repo}/issues/{number}")
    comments = _get(f"/repos/{owner}/{repo}/issues/{number}/comments?per_page=100")
    source = {
        "url": issue["html_url"], "repo": f"{owner}/{repo}", "number": int(number), "state": issue["state"],
        "created_at": issue["created_at"][:10], "updated_at": issue["updated_at"][:10],
        "labels": sorted(label["name"] for label in issue.get("labels") or []),
    }
    if issue.get("state_reason"):
        source["state_reason"] = issue["state_reason"]
    if issue.get("closed_at"):
        source["closed_at"] = issue["closed_at"][:10]
    if issue.get("pull_request"):
        source["pull_request"] = {"merged_at": (issue["pull_request"].get("merged_at") or "")[:10] or None}
    # The vendor's own material date: when the issue last changed.
    source.update({"updated": source["updated_at"], "updated_basis": "issue-updated-at"})
    blocks = [{"heading": issue["title"], "level": 1}, *md_blocks(issue.get("body"))]
    for c in comments:
        blocks.append({"heading": f"Comment ({c.get('author_association', 'NONE')}, {c['created_at'][:10]})", "level": 2})
        blocks.extend(md_blocks(c.get("body")))
    return {"schema_version": 1, "kind": "github-issue", "title": issue["title"], "source": source,
            "captured_at": datetime.date.today().isoformat(), "blocks": blocks}


def default_name(doc: dict) -> str:
    return f"{doc['source']['repo'].split('/')[1]}-{doc['source']['number']}.json"


def write(path: Path, doc: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def check(names: list[str], replace: bool, as_json: bool) -> int:
    files = [OUT / n for n in names] if names else sorted(OUT.glob("*.json"))
    pages, drifted = [], 0
    for f in files:
        old = json.loads(f.read_text(encoding="utf-8"))
        new = fetch(old["source"]["url"])
        new["captured_at"] = old["captured_at"]
        state = lambda d: (d["source"]["state"], (d["source"].get("pull_request") or {}).get("merged_at"))  # noqa: E731
        old_text, new_text = text_of(old["blocks"]), text_of(new["blocks"])
        if state(old) == state(new) and old_text == new_text:
            pages.append({"file": f.name, "status": "unchanged"})
            continue
        drifted += 1
        page = {"file": f.name, "status": "drift", "from": old["source"]["updated_at"], "to": new["source"]["updated_at"],
                **changes(old_text, new_text)}
        if state(old) != state(new):
            # A claim citing the issue may rest on its state, wherever its quote sits.
            page["changed_lines"] = list(range(1, len(new_text.splitlines()) + 1))
            page["message"] = f"state {old['source']['state']} -> {new['source']['state']}"
        pages.append(page)
        if replace:
            new["captured_at"] = datetime.date.today().isoformat()
            write(f, new)
        if not as_json:
            print(f"DRIFT {f.name}: {page.get('message', 'content changed')}")
    if as_json:
        print(json.dumps({"source": "github-issues", "pages": pages}, indent=2))
    return drifted


def main(args: list[str]) -> int:
    if len(args) in (2, 3) and args[0] == "capture":
        doc = fetch(args[1])
        path = OUT / (args[2] if len(args) == 3 else default_name(doc))
        write(path, doc)
        print(path)
        return 0
    if len(args) == 2 and args[0] == "text":
        sys.stdout.write(text_of(json.loads((OUT / args[1]).read_text(encoding="utf-8"))["blocks"]))
        return 0
    if args and args[0] == "check":
        rest = [a for a in args[1:] if not a.startswith("--")]
        return 1 if check(rest, "--replace" in args, "--json" in args) else 0
    print(__doc__, file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
