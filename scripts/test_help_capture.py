"""Tests for the canonical help-capture rendering (scripts/help_capture.py)."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from help_capture import render  # noqa: E402

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
    <li>Allow</li>
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


def test_text_drops_chrome_emphasis_links_and_images():
    _, body = render(ARTICLE)
    assert "Ask Zscaler" not in body
    assert "The Default rule : applies last." in body
    assert "**" not in body and "](" not in body and "png" not in body


def test_lists_nest_and_tables_keep_one_row_per_line():
    _, body = render(ARTICLE)
    assert "- Block: Silently drops the request." in body
    assert "  - Nested detail" in body
    assert "| Code | Name |" in body
    assert "| 3 | NXDomain \\| not found |" in body


def test_rendering_stops_at_the_feedback_footer_and_is_deterministic():
    _, body = render(ARTICLE)
    assert "Related text" not in body
    assert render(ARTICLE) == render(ARTICLE)
