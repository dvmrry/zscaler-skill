"""Tests for reading www.zscaler.com pages as captures (scripts/zscaler_pages.py)."""
from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent))
import help_capture  # noqa: E402
from zscaler_pages import read_html  # noqa: E402

URL = "https://www.zscaler.com/products-and-solutions/example"
NODE = {"props": {"pageProps": {"nid": "1", "node": {"__typename": "NodeProduct", "id": "1", "title": "Example Product"}}}}
# The shape the site serves: chrome around one <main>, whose collapsed accordion answer and inactive tab are in
# the HTML; the node the page renders sits in __NEXT_DATA__.
PAGE = (
    '<html><head><title> Example &amp; Product | Zscaler</title></head><body><nav><a href="/">Products</a></nav><main>'
    '<div class="hero"><h1><span>Outpace AI-Driven Attacks</span></h1><p>Shrink your <strong>attack surface</strong>.</p>'
    '<button>Request a demo</button></div>'
    '<section><h2>Use Cases</h2><ul><li>Optimize SOC operations</li><li>Reduce exposure</li></ul></section>'
    '<div role="tabpanel" hidden><h5>Unified Threat Stories</h5><p>Correlates alerts.</p></div>'
    '<details><summary>What is it?</summary><p>An agentic platform.</p></details>'
    '</main><footer><p>Copyright</p></footer>'
    f'<script id="__NEXT_DATA__" type="application/json">{json.dumps(NODE)}</script></body></html>'
)


def test_a_page_is_its_main_element_as_blocks_titled_by_its_title_element():
    pg = read_html(URL, PAGE)
    assert pg["kind"] == "zscaler-page" and pg["title"] == "Example & Product" and pg["url"] == URL
    assert help_capture.text_of(pg["blocks"]) == (
        "# Outpace AI-Driven Attacks\nShrink your attack surface.\n## Use Cases\n- Optimize SOC operations\n"
        "- Reduce exposure\n##### Unified Threat Stories\nCorrelates alerts.\nWhat is it?\nAn agentic platform.\n")
    # Bold is kept as a range; navigation, the button and the footer are not page content.
    assert {"text": "Shrink your attack surface.", "strong": [[12, 26]]} in pg["blocks"]


def test_the_revision_changes_exactly_when_the_text_does():
    pg = read_html(URL, PAGE)
    assert read_html(URL, PAGE.replace('<nav><a href="/">Products</a></nav>', ""))["rev"] == pg["rev"]
    assert read_html(URL, PAGE.replace("Correlates alerts.", "Correlates every alert."))["rev"] != pg["rev"]


def test_a_capture_carries_the_revision_and_the_blocks():
    doc = help_capture.build(read_html(URL, PAGE), date="2026-11-03")
    assert doc["kind"] == "zscaler-page" and doc["source"]["url"] == URL and doc["source"]["revision"]
    assert doc["source"]["updated_basis"] == "first-seen" and help_capture.content(doc) == help_capture.text_of(doc["blocks"])


def test_a_page_with_no_content_node_or_main_element_is_refused():
    with pytest.raises(SystemExit):
        read_html(URL, "<html><head><title>x</title></head><body><main><p>x</p></main></body></html>")
    with pytest.raises(SystemExit):
        read_html(URL, PAGE.replace("<main>", "<div>").replace("</main>", "</div>"))
