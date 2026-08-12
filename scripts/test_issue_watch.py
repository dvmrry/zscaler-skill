"""Regression tests for declarative upstream issue-watch repository coverage."""

from __future__ import annotations

import configparser
import importlib.util
import json
import sys
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

import httpx
import pytest

from scripts.issue_watch_config import (
    ISSUES_DISABLED_REPOS,
    WATCHED_REPOS,
    load_issue_watch_config,
)

REPO_ROOT = Path(__file__).resolve().parents[1]


def _load_issue_watch_module():
    scripts_dir = REPO_ROOT / "scripts"
    sys.path.insert(0, str(scripts_dir))
    spec = importlib.util.spec_from_file_location(
        "issue_watch_under_test", scripts_dir / "issue-watch.py"
    )
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


ISSUE_WATCH = _load_issue_watch_module()

SUCCESS_REPO = "zscaler/success"
FAILURE_REPO = "zscaler/failure"
LAST_CHECK = "2026-08-01T00:00:00+00:00"


def _issue(number: int = 1) -> dict:
    return {
        "number": number,
        "state": "open",
        "html_url": f"https://github.com/{SUCCESS_REPO}/issues/{number}",
        "title": "Synthetic upstream issue",
        "updated_at": "2026-08-11T00:00:00Z",
        "labels": [],
        "comments": 0,
    }


def _vendored_zscaler_repos() -> set[str]:
    parser = configparser.ConfigParser(interpolation=None)
    parser.read(REPO_ROOT / ".gitmodules", encoding="utf-8")

    repos: set[str] = set()
    for section in parser.sections():
        parsed = urlparse(parser.get(section, "url"))
        if parsed.hostname != "github.com":
            continue
        repo = parsed.path.removeprefix("/").removesuffix(".git")
        if repo.startswith("zscaler/"):
            repos.add(repo)
    return repos


def test_every_vendored_zscaler_repo_has_an_explicit_issue_watch_disposition() -> None:
    watched = set(WATCHED_REPOS)
    disabled = set(ISSUES_DISABLED_REPOS)

    assert watched.isdisjoint(disabled)
    assert watched | disabled == _vendored_zscaler_repos()


def test_intentionally_issue_disabled_repos_are_classified_not_watched() -> None:
    assert set(ISSUES_DISABLED_REPOS) == {
        "zscaler/terraform-aws-cloud-connector-modules",
        "zscaler/terraform-azurerm-cloud-connector-modules",
    }
    for metadata in ISSUES_DISABLED_REPOS.values():
        assert metadata["reason"]
        date.fromisoformat(metadata["verified"])


def test_config_rejects_overlap_between_watched_and_disabled(
    tmp_path: Path,
) -> None:
    config = {
        "watched": ["zscaler/example"],
        "issues_disabled": [
            {
                "repo": "zscaler/example",
                "reason": "Issues disabled for test",
                "verified": "2026-08-12",
            }
        ],
    }
    config_path = tmp_path / "issue-watch-repos.json"
    config_path.write_text(json.dumps(config), encoding="utf-8")

    with pytest.raises(ValueError, match="both watched and issues-disabled"):
        load_issue_watch_config(config_path)


def test_fetch_for_repos_surfaces_503_and_advances_only_successful_state(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(ISSUE_WATCH, "REPOS", (SUCCESS_REPO, FAILURE_REPO))

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == f"/repos/{SUCCESS_REPO}/issues":
            return httpx.Response(200, json=[_issue()])
        if request.url.path == f"/repos/{FAILURE_REPO}/issues":
            return httpx.Response(
                503,
                text="temporary upstream outage",
                headers={"Retry-After": "60"},
            )
        raise AssertionError(f"unexpected request: {request.method} {request.url}")

    with httpx.Client(transport=httpx.MockTransport(handler)) as client:
        result = ISSUE_WATCH.fetch_for_repos(
            client,
            {
                SUCCESS_REPO: LAST_CHECK,
                FAILURE_REPO: LAST_CHECK,
                "__default__": LAST_CHECK,
            },
        )

    assert result.checked_repos == (SUCCESS_REPO,)
    assert set(result.failed_repos) == {FAILURE_REPO}
    assert "HTTP 503" in result.failed_repos[FAILURE_REPO]
    assert "retry-after=60" in result.failed_repos[FAILURE_REPO]
    assert result.new_state[FAILURE_REPO] == LAST_CHECK
    assert result.new_state[SUCCESS_REPO] != LAST_CHECK
    assert [issue["_repo"] for issue in result.new_issues] == [SUCCESS_REPO]


def test_sticky_mode_503_does_not_patch_or_advance_global_marker(
    monkeypatch: pytest.MonkeyPatch,
    capsys: pytest.CaptureFixture[str],
) -> None:
    monkeypatch.setattr(ISSUE_WATCH, "REPOS", (SUCCESS_REPO, FAILURE_REPO))
    monkeypatch.setenv("GITHUB_TOKEN", "test-token")
    requests: list[httpx.Request] = []
    sticky_body = f"<!-- last_check: {LAST_CHECK} -->\n\nExisting digest"

    def handler(request: httpx.Request) -> httpx.Response:
        requests.append(request)
        if request.url.path == "/repos/example/skill/issues/99":
            return httpx.Response(200, json={"number": 99, "body": sticky_body})
        if request.url.path == f"/repos/{SUCCESS_REPO}/issues":
            return httpx.Response(200, json=[_issue()])
        if request.url.path == f"/repos/{FAILURE_REPO}/issues":
            return httpx.Response(503, text="temporary upstream outage")
        if request.method == "PATCH":
            return httpx.Response(200, json={})
        raise AssertionError(f"unexpected request: {request.method} {request.url}")

    transport = httpx.MockTransport(handler)
    monkeypatch.setattr(
        ISSUE_WATCH,
        "make_client",
        lambda: httpx.Client(transport=transport),
    )

    exit_code = ISSUE_WATCH.main(
        ["--sticky-issue", "99", "--target-repo", "example/skill"]
    )

    assert exit_code != 0
    assert not any(request.method == "PATCH" for request in requests)
    assert ISSUE_WATCH.parse_last_check(sticky_body) == LAST_CHECK
    stderr = capsys.readouterr().err
    assert "Checked 1 of 2 repos" in stderr
    assert f"failed: {FAILURE_REPO}" in stderr
    assert f"last_check remains {LAST_CHECK}" in stderr
