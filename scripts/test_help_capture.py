"""Tests for the canonical help capture (scripts/help_capture.py): blocks, bold ranges, anchoring text."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from help_capture import _parse_md_body, changes, document, render, text_of  # noqa: E402

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
