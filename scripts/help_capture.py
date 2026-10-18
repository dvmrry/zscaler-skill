#!/usr/bin/env python3
"""Turn a rendered help.zscaler.com article into the canonical capture text.

The capture is what knowledge-graph claims quote, so it must be deterministic and
independent of the fetcher: the same article HTML always yields the same text.
Headings become `#` lines, list items `- ` (nested by two spaces), tables Markdown
tables (one row per line, so a row can be quoted), and everything else plain text.
Links keep their text, images and emphasis markers are dropped.

Articles are fetched from the help site's own content endpoint (`/zapi/fetch-data`) over plain
HTTP: no browser, no credentials, so it runs anywhere, CI included. The payload carries a node and
revision ID, recorded in the capture header, so `check` can tell an unchanged article in one request.

Usage:
  help_capture.py render <article.html>          print canonical text for saved HTML
  help_capture.py capture <url> [<name.md>]      fetch and write vendor/zscaler-help/<name.md>
  help_capture.py check [<name.md> ...]          refetch committed captures; exit 1 on drift
  help_capture.py check --replace <name.md> ...  rewrite drifted captures in place (then run
                                                 `node scripts/kb.mjs validate` to see broken quotes)
  help_capture.py recapture <name.md> ...        replace an older-format capture with the canonical
                                                 one, reading its Source URL from the old header
"""
from __future__ import annotations

import datetime
import difflib
import html
import json
import urllib.parse
import re
import sys
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOCK = {"p", "div", "section", "article", "header", "footer", "figure", "figcaption", "blockquote", "pre", "dl", "dt", "dd"}
SKIP = {"script", "style", "noscript", "svg", "button", "nav", "form"}
# Help-portal chrome that sits inside <article>.
CHROME = re.compile(r"^(Ask Zscaler|Ask ZscalerPreview|Close|Was this article helpful\?.*|Thank you for your feedback.*)$")
STOP = re.compile(r"^(Was this article helpful|Related Articles)")


class _Renderer(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.lines: list[str] = []
        self.buf: list[str] = []
        self.skip = 0
        self.lists: list[int] = []  # nesting depth markers
        self.table: list[list[str]] | None = None
        self.row: list[str] | None = None
        self.cell: list[str] | None = None
        self.heading = 0

    # -- text accumulation
    def _flush(self) -> None:
        text = re.sub(r"\s+", " ", "".join(self.buf)).strip()
        self.buf = []
        if not text:
            return
        if self.heading:
            self.lines.append("#" * self.heading + " " + text)
        elif self.lists:
            self.lines.append("  " * (len(self.lists) - 1) + "- " + text)
        else:
            self.lines.append(text)

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in SKIP:
            self.skip += 1
            return
        if self.skip:
            return
        if self.cell is not None:
            if tag == "br":
                self.cell.append(" ")
            return
        if tag == "table":
            self._flush()
            self.table = []
        elif tag == "tr" and self.table is not None:
            self.row = []
        elif tag in ("td", "th") and self.row is not None:
            self.cell = []
        elif tag in ("ul", "ol"):
            self._flush()
            self.lists.append(1)
        elif tag == "li":
            self._flush()
        elif re.fullmatch(r"h[1-6]", tag):
            self._flush()
            self.heading = int(tag[1])
        elif tag == "br":
            self._flush()
        elif tag in BLOCK:
            self._flush()

    def handle_endtag(self, tag: str) -> None:
        if tag in SKIP:
            self.skip = max(0, self.skip - 1)
            return
        if self.skip:
            return
        if tag in ("td", "th") and self.cell is not None and self.row is not None:
            self.row.append(re.sub(r"\s+", " ", "".join(self.cell)).strip().replace("|", "\\|"))
            self.cell = None
        elif tag == "tr" and self.row is not None and self.table is not None:
            if any(self.row):
                self.table.append(self.row)
            self.row = None
        elif tag == "table" and self.table is not None:
            self._emit_table(self.table)
            self.table = None
        elif self.cell is not None:
            return
        elif tag in ("ul", "ol"):
            self._flush()
            if self.lists:
                self.lists.pop()
        elif tag == "li":
            self._flush()
        elif re.fullmatch(r"h[1-6]", tag):
            self._flush()
            self.heading = 0
        elif tag in BLOCK:
            self._flush()

    def handle_data(self, data: str) -> None:
        if self.skip:
            return
        (self.cell if self.cell is not None else self.buf).append(data)

    def _emit_table(self, rows: list[list[str]]) -> None:
        width = max(len(r) for r in rows)
        rows = [r + [""] * (width - len(r)) for r in rows]
        self.lines.append("| " + " | ".join(rows[0]) + " |")
        self.lines.append("|" + "---|" * width)
        for r in rows[1:]:
            self.lines.append("| " + " | ".join(r) + " |")


def _blocks(html_text: str, cls: str) -> list[tuple[int, int]]:
    """Spans of top-level `<div class="{cls}">` blocks, matched by balanced div tags."""
    spans, start = [], 0
    opener = f'<div class="{cls}">'
    while (i := html_text.find(opener, start)) != -1:
        depth, j = 0, i
        for m in re.finditer(r"<div\b|</div>", html_text[i:]):
            depth += 1 if m.group(0) != "</div>" else -1
            if depth == 0:
                j = i + m.end()
                break
        spans.append((i, j))
        start = j
    return spans


def inline_toggles(html_text: str) -> str:
    """Put each expandable block back under the link that toggles it, as the help site's script does.

    The article payload keeps expandable content in `<div class="subc">` blocks after the main text;
    each starts with `<a class="ck-anchor" id="X">` and is opened by a link `href="#X"`.
    """
    blocks: dict[str, str] = {}
    keep: list[str] = []
    last = 0
    for i, j in _blocks(html_text, "subc"):
        block = html_text[i:j]
        m = re.search(r'<a class="ck-anchor" id="([^"]+)"', block)
        if m and re.search(r'href="#' + re.escape(m.group(1)) + r'"', html_text[:i] + html_text[j:]):
            blocks[m.group(1)] = block
            keep.append(html_text[last:i])
            last = j
    keep.append(html_text[last:])
    out = "".join(keep)
    for anchor, block in blocks.items():
        out = re.sub(r'(<a href="#' + re.escape(anchor) + r'"[^>]*>.*?</a>)', lambda m, block=block: m.group(1) + block, out, count=1, flags=re.S)
    return out


def render(article_html: str) -> tuple[str, str]:
    """Return (title, canonical body) for one article's HTML."""
    p = _Renderer()
    p.feed(inline_toggles(article_html))
    p._flush()
    out: list[str] = []
    for line in p.lines:
        bare = line.lstrip("#- ").strip()
        if STOP.match(bare):
            break
        if CHROME.match(bare):
            continue
        out.append(line)
    # The first heading that is not the product banner is the article title.
    title = next((l.lstrip("# ") for l in out if l.startswith("#") and "(ZIA)" not in l and "(ZPA)" not in l), "")
    if title:
        out = out[out.index(next(l for l in out if l.lstrip("# ") == title)) + 1:]
    body = html.unescape("\n".join(out)).strip()
    return title, body + "\n"


HELP = ROOT / "vendor" / "zscaler-help"
HEADER = re.compile(
    r"\A# (?P<title>.*)\n\n\*\*Source:\*\* (?P<url>\S+)\n\*\*Captured:\*\* (?P<date>\S+)[^\n]*\n"
    r"(?:\*\*Revision:\*\* node (?P<nid>\d+), revision (?P<rev>\d+)\n)?\n---\n\n")
API = "https://help.zscaler.com/zapi/fetch-data"


def fetch(url: str) -> dict:
    """The article payload for one help.zscaler.com URL: title, content HTML, node and revision IDs."""
    parsed = urllib.parse.urlparse(url)
    if parsed.netloc != "help.zscaler.com":
        raise SystemExit(f"not a help.zscaler.com article: {url}")
    query = urllib.parse.urlencode({"url_alias": parsed.path, "view_type": "full", "cloud": "false",
                                    "domain": "zscaler", "language": "en", "_format": "json"})
    req = urllib.request.Request(f"{API}?{query}", headers={"User-Agent": "zscaler-skill help_capture.py"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)["data"]
    body = data.get("body") or {}
    info = data.get("info") or {}
    if info.get("status") not in (200, 301) or not body.get("content"):
        raise SystemExit(f"no article at {url}")
    # A moved article answers 301 with its new alias and the current body.
    current = f"https://help.zscaler.com{info['url']}" if info.get("status") == 301 and info.get("url") else url
    return {"title": body["title"], "html": f"<article><h3>{html.escape(body['title'])}</h3>{body['content']}</article>",
            "nid": body["nid"], "rev": body["revision_id"], "url": current, "moved": current != url}


def document(title: str, url: str, body: str, nid: str, rev: str, date: str | None = None) -> str:
    date = date or datetime.date.today().isoformat()
    return (f"# {title}\n\n**Source:** {url}\n**Captured:** {date} via help_capture.py (article payload, canonical text)\n"
            f"**Revision:** node {nid}, revision {rev}\n\n---\n\n{body}")


def capture(url: str, name: str | None) -> Path:
    name = name or url.rstrip("/").rsplit("/", 1)[-1] + ".md"
    if not re.fullmatch(r"[\w.-]+\.md", name):
        raise SystemExit(f"capture name must be a plain file name ending in .md: {name}")
    out = HELP / name
    if out.exists():
        raise SystemExit(f"exists: {out}; use `check --replace {name}` to update it")
    art = fetch(url)
    title, body = render(art["html"])
    out.write_text(document(title, art["url"], body, art["nid"], art["rev"]))
    return out


def check(names: list[str], replace: bool) -> int:
    """Refetch each capture made by this tool; return how many drifted. Same revision means unchanged."""
    drifted = 0
    files = [HELP / n for n in names] or sorted(HELP.glob("*.md"))
    for path in files:
        text = path.read_text()
        m = HEADER.match(text)
        if not m or not m["rev"]:
            if names:
                print(f"skip {path.name}: not a help_capture.py capture (recapture it with `capture` first)")
            continue
        art = fetch(m["url"])
        if art["rev"] == m["rev"]:
            print(f"ok    {path.name} (revision {art['rev']})")
            continue
        title, body = render(art["html"])
        old_body = text[m.end():]
        if body == old_body:
            print(f"ok    {path.name} (revision {m['rev']} -> {art['rev']}, text unchanged)")
            if replace:
                path.write_text(document(title, art["url"], body, art["nid"], art["rev"], m["date"]))
            continue
        drifted += 1
        print(f"DRIFT {path.name} (revision {m['rev']} -> {art['rev']})")
        sys.stdout.writelines(difflib.unified_diff(old_body.splitlines(True), body.splitlines(True), "committed", "live", n=1))
        if replace:
            path.write_text(document(title, art["url"], body, art["nid"], art["rev"]))
            print(f"      replaced {path.name}")
    return drifted


def recapture(names: list[str]) -> int:
    """Rewrite older-format captures (other tools, hand-edited) as canonical captures, in place."""
    failed = 0
    for name in names:
        path = HELP / name
        m = re.search(r"https://help\.zscaler\.com/[^\s)*\"'<>]+", path.read_text()[:800])
        if not m:
            print(f"skip  {name}: no help.zscaler.com source in its header"); failed += 1; continue
        try:
            art = fetch(m.group(0))
        except SystemExit as e:
            print(f"skip  {name}: {e}"); failed += 1; continue
        title, body = render(art["html"])
        path.write_text(document(title, art["url"], body, art["nid"], art["rev"]))
        print(f"done  {name}" + (f" (moved to {art['url']})" if art.get("moved") else ""))
    return failed


if __name__ == "__main__":
    args = sys.argv[1:]
    if len(args) == 2 and args[0] == "render":
        t, b = render(Path(args[1]).read_text())
        sys.stdout.write(f"# {t}\n\n{b}")
    elif args[:1] == ["capture"] and len(args) in (2, 3):
        print(capture(args[1], args[2] if len(args) == 3 else None))
    elif args[:1] == ["recapture"] and len(args) > 1:
        sys.exit(1 if recapture(args[1:]) else 0)
    elif args[:1] == ["check"]:
        replace = "--replace" in args
        sys.exit(1 if check([a for a in args[1:] if a != "--replace"], replace) and not replace else 0)
    else:
        sys.exit(__doc__)
