"""Tests for reading automate.zscaler.com compiled MDX as data (scripts/automate_pages.py)."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from automate_pages import blocks_of, parse_mdx  # noqa: E402
from help_capture import text_of  # noqa: E402
from postman_capture import LINK  # noqa: E402

# The shape Docusaurus emits for a doc page: metadata, then the MDX content function.
CHUNK = (
    '"use strict";(globalThis.webpackChunkx=globalThis.webpackChunkx||[]).push([[1],{4242(e,i,t){t.r(i);'
    "const n=JSON.parse('{\"id\":\"x\",\"title\":\"Rate Limits\"}');var r=t(1),s=t(2);"
    'function c(n){const o={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",'
    'strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.R)(),...n.components};'
    "return(0,r.jsxs)(r.Fragment,{children:["
    '(0,r.jsx)(o.header,{children:(0,r.jsx)(o.h1,{id:"rate-limits",children:"Rate Limits"})}),"\\n",'
    '(0,r.jsxs)(o.p,{children:["Every endpoint has a ",(0,r.jsx)(o.strong,{children:"weight"}),", see the ",'
    '(0,r.jsx)(o.a,{href:"https://x",children:"summary"}),"."]}),"\\n",'
    '(0,r.jsx)("img",{src:t(740061).A+"",title:"Diagram"}),'
    '(0,r.jsxs)(o.ol,{children:["\\n",(0,r.jsx)(o.li,{children:"First."}),"\\n",(0,r.jsx)(o.li,{children:"Second."})]}),'
    '(0,r.jsxs)(o.table,{children:[(0,r.jsx)(o.thead,{children:(0,r.jsxs)(o.tr,{children:[(0,r.jsx)(o.th,{children:"Weight"}),'
    '(0,r.jsx)(o.th,{children:"Requests/hour"})]})}),(0,r.jsx)(o.tbody,{children:(0,r.jsxs)(o.tr,{children:['
    '(0,r.jsx)(o.td,{children:"Heavy"}),(0,r.jsx)(o.td,{children:"4"})]})})]}),'
    '(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{children:"curl -X POST \\\\\\n  https://x"})}),'
    '(0,r.jsx)(o.h2,{id:"next",children:"Next \\u2014 steps"})]})}}}]);'
)


def test_compiled_mdx_is_read_as_data_into_capture_blocks():
    title, tree = parse_mdx(CHUNK, "4242")
    assert title == "Rate Limits"
    blocks = blocks_of(tree)
    assert blocks[0] == {"heading": "Rate Limits", "level": 1}
    assert blocks[1] == {"text": "Every endpoint has a weight, see the summary.", "strong": [[21, 27]]}
    assert {"item": "Second.", "depth": 0, "number": 2} in blocks
    assert {"table": [["Weight", "Requests/hour"], ["Heavy", "4"]]} in blocks
    assert {"code": "curl -X POST \\\n  https://x"} in blocks
    assert blocks[-1] == {"heading": "Next — steps", "level": 2}
    assert "| Heavy | 4 |" in text_of(blocks)


def test_the_postman_page_link_is_read_from_the_compiled_page():
    chunk = '(0,r.jsx)(o.a,{href:"/downloads/OneAPI_postman_collection_09_29_2026.json",children:"OneAPI Postman collection"})'
    assert LINK.findall(chunk) == ["/downloads/OneAPI_postman_collection_09_29_2026.json"]
