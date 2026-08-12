"""Validated repository coverage for the upstream GitHub issue watch."""

from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path
from typing import TypedDict

CONFIG_PATH = Path(__file__).with_name("fixtures") / "issue-watch-repos.json"
REPO_RE = re.compile(r"^[^/\s]+/[^/\s]+$")


class IssuesDisabled(TypedDict):
    """Metadata for a vendored repository whose GitHub Issues are disabled."""

    reason: str
    verified: str


def _validate_repo(value: object, *, field: str) -> str:
    if not isinstance(value, str) or not REPO_RE.fullmatch(value):
        raise ValueError(f"{field} must be an owner/repository string")
    return value


def load_issue_watch_config(
    path: str | Path = CONFIG_PATH,
) -> tuple[tuple[str, ...], dict[str, IssuesDisabled]]:
    """Load and validate watched and intentionally issue-disabled repositories."""

    config_path = Path(path)
    try:
        payload = json.loads(config_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load issue-watch config {config_path}: {exc}") from exc

    if not isinstance(payload, dict):
        raise ValueError("issue-watch config must be a JSON object")

    raw_watched = payload.get("watched")
    if not isinstance(raw_watched, list) or not raw_watched:
        raise ValueError("issue-watch config watched must be a non-empty list")
    watched = tuple(
        _validate_repo(repo, field=f"watched[{index}]")
        for index, repo in enumerate(raw_watched)
    )
    if len(watched) != len(set(watched)):
        raise ValueError("issue-watch config watched contains duplicates")
    if watched != tuple(sorted(watched)):
        raise ValueError("issue-watch config watched must be sorted")

    raw_disabled = payload.get("issues_disabled")
    if not isinstance(raw_disabled, list):
        raise ValueError("issue-watch config issues_disabled must be a list")

    issues_disabled: dict[str, IssuesDisabled] = {}
    for index, record in enumerate(raw_disabled):
        if not isinstance(record, dict):
            raise ValueError(f"issues_disabled[{index}] must be an object")
        repo = _validate_repo(record.get("repo"), field=f"issues_disabled[{index}].repo")
        reason = record.get("reason")
        verified = record.get("verified")
        if not isinstance(reason, str) or not reason.strip():
            raise ValueError(f"issues_disabled[{index}].reason must be non-empty")
        if not isinstance(verified, str):
            raise ValueError(f"issues_disabled[{index}].verified must be an ISO date")
        try:
            date.fromisoformat(verified)
        except ValueError as exc:
            raise ValueError(
                f"issues_disabled[{index}].verified must be an ISO date"
            ) from exc
        if repo in issues_disabled:
            raise ValueError("issue-watch config issues_disabled contains duplicates")
        issues_disabled[repo] = {"reason": reason, "verified": verified}

    if tuple(issues_disabled) != tuple(sorted(issues_disabled)):
        raise ValueError("issue-watch config issues_disabled must be sorted")

    overlap = set(watched) & set(issues_disabled)
    if overlap:
        raise ValueError(
            "repositories cannot be both watched and issues-disabled: "
            + ", ".join(sorted(overlap))
        )

    return watched, issues_disabled


WATCHED_REPOS, ISSUES_DISABLED_REPOS = load_issue_watch_config()
