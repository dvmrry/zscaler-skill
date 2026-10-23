from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import issue_capture  # noqa: E402
from help_capture import text_of  # noqa: E402


def test_markdown_becomes_the_help_capture_block_shapes():
    body = "<!--- template note --->\n## Description\nThe rule\nlacks tags.\n\n- zpa_application_segment\n  - nested\n1. first\n```hcl\nname = \"x\"\n```\n"
    assert issue_capture.md_blocks(body) == [
        {"heading": "Description", "level": 2},
        {"text": "The rule lacks tags."},
        {"item": "zpa_application_segment", "depth": 0},
        {"item": "nested", "depth": 1},
        {"item": "first", "depth": 0, "number": 1},
        {"code": 'name = "x"'},
    ]
    assert issue_capture.md_blocks("Thanks @some-user, see a@b.c\n```\n@app.post\n```") == [
        {"text": "Thanks @(user), see a@b.c"}, {"code": "@app.post"}]
    assert issue_capture.md_blocks("Segment 123456789012345678 fails\n```\nid = [\"123456789012345678\"]\n```") == [
        {"text": "Segment <id> fails"}, {"code": 'id = ["<id>"]'}]


def test_a_state_change_is_drift_on_every_line(tmp_path, monkeypatch, capsys):
    def doc(state, body):
        return {"schema_version": 1, "kind": "github-issue", "title": "T",
                "source": {"url": "https://github.com/zscaler/x/issues/1", "repo": "zscaler/x", "number": 1, "state": state,
                           "created_at": "2026-10-01", "updated_at": "2026-10-02", "labels": []},
                "captured_at": "2026-10-03", "blocks": [{"heading": "T", "level": 1}, *issue_capture.md_blocks(body)]}

    monkeypatch.setattr(issue_capture, "OUT", tmp_path)
    (tmp_path / "x-1.json").write_text(json.dumps(doc("open", "One.\n\nTwo.")))
    monkeypatch.setattr(issue_capture, "fetch", lambda url: doc("closed", "One.\n\nTwo."))
    assert issue_capture.check([], replace=True, as_json=True) == 1
    report = json.loads(capsys.readouterr().out)
    assert report["source"] == "github-issues"
    page = report["pages"][0]
    assert page["message"] == "state open -> closed"
    assert page["changed_lines"] == [1, 2, 3]
    assert json.loads((tmp_path / "x-1.json").read_text())["source"]["state"] == "closed"
    assert text_of(doc("open", "One.")["blocks"]) == "# T\nOne.\n"
