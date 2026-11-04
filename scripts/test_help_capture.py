"""Tests for the canonical help capture (scripts/help_capture.py): blocks, bold ranges, anchoring text."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from help_capture import _parse_md_body, _release_notes_html, changes, document, render, text_of  # noqa: E402

ARTICLE = """
<article>
  <div class="breadcrumb"><h1>Internet &amp; SaaS (ZIA)</h1></div>
  <h3>About Example</h3>
  <p>Ask Zscaler</p>
  <p>The <strong>Default rule</strong> : applies <a href="https://help.zscaler.com/x">last</a>.<img src="a.png"></p>
  <ul>
    <li><strong>Block</strong>: Silently drops the request.
      <ul><li>Nested detail</li></ul>
    </li>
    <li>Allow &amp; log</li>
  </ul>
  <table>
    <tr><th>Code</th><th>Name</th></tr>
    <tr><td>3</td><td>NXDomain | not found</td></tr>
  </table>
  <h4>Was this article helpful? Click an icon below to submit feedback.</h4>
  <p>Related text that must not appear</p>
</article>
"""


def test_release_notes_entries_render_after_the_introduction():
    notes = {"entries": {"2026-10-21": {"title": "October 21, 2026", "feature": {
        "available": [{"version": "", "title": "Feature Available", "entries": [
            {"id": "1", "title": "Isolation Viewer Upgrade", "description": "<p>The viewer was upgraded.</p>"}]}],
        "limited": [{"version": "6.2", "title": "Limited Availability", "entries": [
            {"id": "2", "title": "New Toggle", "description": "<p>A toggle.</p>"}]}]}}}}
    html = f"<article><h3>Release Upgrade Summary (2026)</h3><p>Intro.</p>{_release_notes_html(notes)}</article>"
    _title, blocks = render(html)
    assert text_of(blocks) == (
        "Intro.\n#### October 21, 2026\n##### Feature Available\n###### Isolation Viewer Upgrade\n"
        "The viewer was upgraded.\n##### Limited Availability 6.2\n###### New Toggle\nA toggle.\n"
    )
    assert _release_notes_html(None) == ""


def test_title_is_the_article_heading_not_the_product_banner():
    title, _ = render(ARTICLE)
    assert title == "About Example"


def test_blocks_are_plain_text_with_bold_as_ranges():
    _, blocks = render(ARTICLE)
    assert blocks[0] == {"text": "The Default rule : applies last.", "strong": [[4, 16]]}
    assert "Ask Zscaler" not in text_of(blocks)
    assert "](" not in text_of(blocks) and "png" not in text_of(blocks)
    assert "**" not in str(blocks)


def test_bold_marks_a_recommended_table_value_by_cell():
    _, blocks = render("<h3>T</h3><table><tr><th>DPD</th><td><strong> Enabled </strong> Disabled</td></tr></table>")
    assert blocks == [{"table": [["DPD", "Enabled Disabled"]], "strong": [[0, 1, 0, 7]]}]


def test_blocks_inside_a_table_cell_stay_separate():
    _, blocks = render(
        "<h3>T</h3><table><tr><td><p>MSI: HIDEAPPUIONLAUNCH</p><p>EXE: hideAppUIOnLaunch</p></td>"
        "<td><ul><li>1 = Enable</li><li>0 = Disable</li></ul></td><td>a<br>b</td></tr></table>"
    )
    assert blocks == [{"table": [["MSI: HIDEAPPUIONLAUNCH EXE: hideAppUIOnLaunch", "1 = Enable 0 = Disable", "a b"]]}]


def test_lists_nest_and_the_anchoring_text_keeps_one_row_per_line():
    _, blocks = render(ARTICLE)
    assert {"item": "Nested detail", "depth": 1} in blocks
    assert {"item": "Allow & log", "depth": 0} in blocks
    text = text_of(blocks)
    assert "- Block: Silently drops the request.\n  - Nested detail\n" in text
    assert "| Code | Name |\n|---|---|\n| 3 | NXDomain \\| not found |\n" in text


def test_rendering_stops_at_the_feedback_footer_and_is_deterministic():
    _, blocks = render(ARTICLE)
    assert "Related text" not in text_of(blocks)
    assert render(ARTICLE) == render(ARTICLE)


def test_a_capture_records_its_provenance():
    title, blocks = render(ARTICLE)
    doc = document(title, "https://help.zscaler.com/zia/x", blocks, "12", "34", "2026-10-18")
    assert doc["kind"] == "help-article"
    assert doc["source"] == {"url": "https://help.zscaler.com/zia/x", "node": "12", "revision": "34"}


def test_an_older_markdown_body_parses_back_to_the_same_blocks():
    _, blocks = render(ARTICLE)
    markdown = (
        "The **Default rule** : applies last.\n- **Block**: Silently drops the request.\n  - Nested detail\n"
        "- Allow & log\n| Code | Name |\n|---|---|\n| 3 | NXDomain \\| not found |\n"
    )
    assert _parse_md_body(markdown) == blocks


def test_ordered_lists_keep_their_numbers():
    _, blocks = render('<h3>T</h3><ol><li>First</li><li>Second<ul><li>sub</li></ul></li></ol><ol start="5"><li>Five</li></ol>')
    assert text_of(blocks) == "1. First\n2. Second\n  - sub\n5. Five\n"


def test_a_drift_report_names_the_changed_lines_of_the_new_text():
    delta = changes("a\nb\nc\nd\n", "a\nB\nc\nd\ne\n")
    assert delta["changed_lines"] == [2, 5] and delta["removed"] == ["b"]
    # A deletion marks the lines on either side of where it was.
    assert changes("a\nb\nc\n", "a\nc\n")["changed_lines"] == [1, 2]


def test_a_link_to_an_old_address_of_a_captured_page_becomes_its_alias(tmp_path, monkeypatch):
    import help_capture

    title, blocks = render(ARTICLE)
    old = document(title, "https://help.zscaler.com/unified/x-admin-console", blocks, "12", "34", "2026-10-18")
    help_capture.write(tmp_path / "x-admin-console.json", old)
    monkeypatch.setattr(help_capture, "HELP", tmp_path)
    monkeypatch.setattr(help_capture, "_index", None)
    moved = {"kind": "help-article", "url": "https://help.zscaler.com/unified/x-admin-console", "nid": "12", "rev": "34", "html": ARTICLE}
    monkeypatch.setattr(help_capture, "page", lambda url: moved)
    path = help_capture.capture("https://help.zscaler.com/zia/x-zia-admin-portal", None)
    assert path.name == "x-admin-console.json"
    assert not (tmp_path / "x-zia-admin-portal.json").exists(), "no second capture of the same page"
    src = help_capture.read(path)["source"]
    assert src["url"] == "https://help.zscaler.com/unified/x-admin-console"
    assert src["aliases"] == ["https://help.zscaler.com/zia/x-zia-admin-portal"]
    assert help_capture.with_aliases(dict(old), old["source"]["url"])["source"].get("aliases") is None, "a page is never its own alias"


def test_a_server_error_is_retried_and_one_that_persists_makes_the_page_unavailable(monkeypatch):
    import io
    import urllib.error

    import help_capture

    monkeypatch.setattr(help_capture.time, "sleep", lambda s: None)
    calls = []

    def flaky(req, timeout):
        calls.append(req.full_url)
        if len(calls) < 3:
            raise urllib.error.HTTPError(req.full_url, 502, "Bad Gateway", {}, None)
        return io.BytesIO(b'{"data": {"ok": true}}')

    monkeypatch.setattr(help_capture.urllib.request, "urlopen", flaky)
    assert help_capture._payload("https://help.zscaler.com/zia/x") == {"ok": True}
    assert len(calls) == 3

    def down(req, timeout):
        raise urllib.error.HTTPError(req.full_url, 502, "Bad Gateway", {}, None)

    monkeypatch.setattr(help_capture.urllib.request, "urlopen", down)
    try:
        help_capture._payload("https://help.zscaler.com/zia/x")
        raise AssertionError("a persistent 502 must raise")
    except help_capture.Unavailable as e:
        assert "unreachable after 3 tries" in str(e)

    def missing(req, timeout):
        raise urllib.error.HTTPError(req.full_url, 404, "Not Found", {}, None)

    monkeypatch.setattr(help_capture.urllib.request, "urlopen", missing)
    try:
        help_capture._payload("https://help.zscaler.com/zia/x")
        raise AssertionError("a 404 is not retried into Unavailable")
    except urllib.error.HTTPError as e:
        assert e.code == 404


def test_a_check_that_fails_part_way_rewrites_no_capture(tmp_path, monkeypatch):
    import help_capture

    title, blocks = render(ARTICLE)
    for name in ("a-page.json", "b-page.json"):
        help_capture.write(tmp_path / name, document(title, f"https://help.zscaler.com/zia/{name[:-5]}", blocks, "12", "34", "2026-10-18"))
    before = {p.name: p.read_text() for p in tmp_path.iterdir()}
    monkeypatch.setattr(help_capture, "HELP", tmp_path)
    changed = ARTICLE.replace("Silently drops the request.", "Drops the request.")

    def page(url):
        if url.endswith("b-page"):
            raise RuntimeError("the site went away")
        return {"kind": "help-article", "url": url, "nid": "12", "rev": "35", "html": changed}

    monkeypatch.setattr(help_capture, "page", page)
    try:
        help_capture.check([], replace=True, as_json=True)
        raise AssertionError("the failure must surface")
    except RuntimeError:
        pass
    assert {p.name: p.read_text() for p in tmp_path.iterdir()} == before, "a-page drifted but must not be rewritten"
    monkeypatch.setattr(help_capture, "page", lambda url: {"kind": "help-article", "url": url, "nid": "12", "rev": "35", "html": changed})
    assert help_capture.check([], replace=True, as_json=True) == 2
    assert "Drops the request." in (tmp_path / "a-page.json").read_text()


def test_a_page_that_moved_without_changing_is_reported_as_moved(tmp_path, monkeypatch, capsys):
    import json as _json

    import help_capture

    title, blocks = render(ARTICLE)
    help_capture.write(tmp_path / "x.json", document(title, "https://help.zscaler.com/zia/x", blocks, "12", "34", "2026-10-18"))
    monkeypatch.setattr(help_capture, "HELP", tmp_path)
    moved = {"kind": "help-article", "url": "https://help.zscaler.com/zia/y", "moved": True, "nid": "12", "rev": "35", "html": ARTICLE}
    monkeypatch.setattr(help_capture, "page", lambda url: moved)
    assert help_capture.check([], replace=True, as_json=True) == 1
    page = _json.loads(capsys.readouterr().out)["pages"][0]
    assert page["status"] == "moved" and page["changed_lines"] == []
    src = help_capture.read(tmp_path / "x.json")["source"]
    assert src["url"] == "https://help.zscaler.com/zia/y" and src["aliases"] == ["https://help.zscaler.com/zia/x"]


def test_a_full_check_reports_a_registered_unavailable_page_that_serves_again(tmp_path, monkeypatch, capsys):
    import json as _json

    import help_capture

    help_dir = tmp_path / "vendor" / "zscaler-help"
    (tmp_path / "references" / "_meta").mkdir(parents=True)
    help_dir.mkdir(parents=True)
    (tmp_path / "references" / "_meta" / "static-captures.json").write_text(_json.dumps({"files": {
        "back.md": {"class": "unavailable", "url": "https://help.zscaler.com/x/back"},
        "down.md": {"class": "unavailable", "url": "https://help.zscaler.com/x/down"},
        "notes.md": {"class": "notes", "url": "https://help.zscaler.com/x/notes"}}}))
    monkeypatch.setattr(help_capture, "HELP", help_dir)

    def page(url):
        if url.endswith("down"):
            raise help_capture.Unavailable("unavailable (403, under maintenance)")
        if url.endswith("notes"):
            raise AssertionError("only unavailable entries are tried")
        return {"kind": "help-article", "url": url, "nid": "1", "rev": "2", "html": ARTICLE}

    monkeypatch.setattr(help_capture, "page", page)
    assert help_capture.check([], replace=False, as_json=True) == 1
    pages = _json.loads(capsys.readouterr().out)["pages"]
    assert pages == [{"file": "back.md", "status": "returned", "message": "serves again: help_capture.py recapture back.md"}]
    # Checking named captures leaves the register alone.
    assert help_capture.check(["missing.json"], replace=False) == 0
