#!/usr/bin/env python3
"""Capture help.zscaler.com pages as JSON: articles as blocks, API reference pages as their Swagger spec,
product indexes as their article lists.

The capture is what knowledge-graph claims cite, so it must be deterministic and independent of the
fetcher: the same page always yields the same file. An article becomes `blocks` (heading with level,
paragraph, list item with depth and, in an ordered list, its number, table rows) of plain text, with
bold kept as character ranges; quotes match `text_of(blocks)`, one fixed serialization. Links keep their
text and images are dropped. An API reference page keeps its Swagger document, cited by JSON pointer.
automate.zscaler.com guide pages go through the same commands (scripts/automate_pages.py reads them).

Pages are fetched from the help site's own content endpoint (`/zapi/fetch-data`) over plain HTTP: no
browser, no credentials, so it runs anywhere, CI included. Articles and API pages carry the site's node
and revision IDs, so `check` tells an unchanged page in one request, and a changed rendering of an
unchanged revision can only come from this tool (`rerender`), never from the vendor.

Usage:
  help_capture.py render <article.html>          print the blocks for saved HTML
  help_capture.py text <name.json>               print a capture's anchoring text (what quotes match)
  help_capture.py capture <url> [<name.json>]    fetch and write vendor/zscaler-help/<name.json>
  help_capture.py check [<name.json> ...]        refetch committed captures; exit 1 on drift
  help_capture.py check [--json] [--replace] ..   --json prints a report for scripts/kb-drift.mjs;
  help_capture.py check --replace <name.json> .. rewrite drifted captures in place (then run
                                                 `node scripts/kb.mjs validate` to see broken quotes)
  help_capture.py rerender [<name.json> ...]     apply a renderer change to captures still at their captured
                                                 revision; a moved revision is reported, not touched
  With HELP_CAPTURE_HTML_CACHE=<dir> (outside the repo) every fetch keeps the article HTML by node and
  revision, and rerender uses a cached captured revision without fetching.
  help_capture.py recapture <name.md> ...        replace an older-format capture with the canonical
                                                 one, reading its Source URL from the old header
"""
from __future__ import annotations

import datetime
import os
import difflib
import email.utils
import html
import json
import urllib.parse
import re
import sys
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BOLD = {"strong", "b"}
BLOCK = {"p", "div", "section", "article", "header", "footer", "figure", "figcaption", "blockquote", "pre", "dl", "dt", "dd"}
SKIP = {"script", "style", "noscript", "svg", "button", "nav", "form"}
# Help-portal chrome that sits inside <article>.
CHROME = re.compile(r"^(Ask Zscaler|Ask ZscalerPreview|Close|Was this article helpful\?.*|Thank you for your feedback.*)$")
STOP = re.compile(r"^(Was this article helpful|Related Articles)")


class _Renderer(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.blocks: list[dict] = []
        self.buf: list[str] = []
        self.skip = 0
        self.lists: list[list] = []  # one [ordered, last number] per open list
        self.ordinal: int | None = None  # the number of the <ol> item whose text comes next
        self.table: list[list[str]] | None = None
        self.row: list[str] | None = None
        self.cell: list[str] | None = None
        self.heading = 0

    # -- text accumulation
    def _flush(self) -> None:
        text = _tidy("".join(self.buf))
        self.buf = []
        if not text:
            return
        if self.heading:
            self.blocks.append({"heading": text.replace("**", ""), "level": self.heading})
        elif self.lists:
            item = {"item": text, "depth": len(self.lists) - 1}
            # An ordered list keeps its numbers: they are often the fact (an evaluation order).
            if self.ordinal is not None:
                item["number"] = self.ordinal
                self.ordinal = None
            self.blocks.append(item)
        else:
            self.blocks.append({"text": text})

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in SKIP:
            self.skip += 1
            return
        if self.skip:
            return
        if tag in BOLD:
            (self.cell if self.cell is not None else self.buf).append("**")
            return
        if self.cell is not None:
            # A line break or a block inside a cell (`<p>MSI: X</p><p>EXE: y</p>`, a list of values) separates
            # its text; without the space the two runs fuse ("MSI: XEXE: y").
            if tag == "br" or _cell_break(tag):
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
            start = dict(attrs).get("start") if tag == "ol" else None
            self.lists.append([tag == "ol", int(start) - 1 if start and start.isdigit() else 0])
        elif tag == "li":
            self._flush()
            if self.lists and self.lists[-1][0]:
                self.lists[-1][1] += 1
                self.ordinal = self.lists[-1][1]
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
        if tag in BOLD:
            (self.cell if self.cell is not None else self.buf).append("**")
            return
        if tag in ("td", "th") and self.cell is not None and self.row is not None:
            self.row.append(_tidy("".join(self.cell)))
            self.cell = None
        elif tag == "tr" and self.row is not None and self.table is not None:
            if any(self.row):
                self.table.append(self.row)
            self.row = None
        elif tag == "table" and self.table is not None:
            self._emit_table(self.table)
            self.table = None
        elif self.cell is not None:
            if _cell_break(tag):
                self.cell.append(" ")
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
        self.blocks.append({"table": [r + [""] * (width - len(r)) for r in rows]})


def _cell_break(tag: str) -> bool:
    """A tag whose start or end separates text inside a table cell."""
    return tag in BLOCK or tag in ("li", "ul", "ol") or bool(re.fullmatch(r"h[1-6]", tag))


def _tidy(text: str) -> str:
    """Collapse whitespace; keep each bold run tight to its words and drop empty or touching runs."""
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\*\*(\s*)(.*?)(\s*)\*\*", lambda m: f"{m[1]}**{m[2]}**{m[3]}" if m[2].strip() else m[1] + m[3], text)
    return re.sub(r" {2,}", " ", text.replace("****", "")).strip()


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


def _strong(text: str) -> tuple[str, list[list[int]]]:
    """Split `**bold**` runs out of rendered text: (plain text, [[start, end], ...] of the bold runs)."""
    plain, spans, pos = [], [], 0
    for i, part in enumerate(text.split("**")):
        if i % 2 and part:
            spans.append([pos, pos + len(part)])
        plain.append(part)
        pos += len(part)
    return "".join(plain), spans


def _structure(block: dict) -> dict:
    """A rendered block in capture form: plain text, with bold kept as character ranges in `strong`."""
    if "table" in block:
        rows, strong = [], []
        for r, row in enumerate(block["table"]):
            cells = []
            for c, cell in enumerate(row):
                plain, spans = _strong(html.unescape(cell))
                cells.append(plain)
                strong += [[r, c, *span] for span in spans]
            rows.append(cells)
        return {"table": rows, **({"strong": strong} if strong else {})}
    key = "heading" if "heading" in block else "item" if "item" in block else "text"
    plain, spans = _strong(html.unescape(block[key]))
    out = {key: plain, **{k: v for k, v in block.items() if k not in (key,)}}
    return {**out, **({"strong": spans} if spans else {})}


def _bare(block: dict) -> str:
    return " ".join(" ".join(r) for r in block["table"]) if "table" in block else next(iter(block.values())).replace("**", "").strip()


def render(article_html: str) -> tuple[str, list[dict]]:
    """Return (title, blocks) for one article's HTML: one block per heading, paragraph, list item or table."""
    p = _Renderer()
    p.feed(inline_toggles(article_html))
    p._flush()
    out: list[dict] = []
    for block in p.blocks:
        if "table" not in block and STOP.match(_bare(block)):
            break
        if "table" not in block and CHROME.match(_bare(block)):
            continue
        out.append(block)
    # The first heading that is not the product banner is the article title.
    heading = next((b for b in out if "heading" in b and "(ZIA)" not in b["heading"] and "(ZPA)" not in b["heading"]), None)
    title = heading["heading"] if heading else ""
    if heading:
        out = out[out.index(heading) + 1:]
    return html.unescape(title), [_structure(b) for b in out]


def text_of(blocks: list[dict]) -> str:
    """The capture's anchoring text: the one fixed serialization of its blocks that quotes match against.

    A heading is `#` x level, a list item is indented two spaces per depth and starts `- ` (or `3. `
    for the third item of an ordered list), a table is
    one `| a | b |` row per line with a `|---|` rule after its first row, and a code block is its text as
    is; bold is not marked. The
    validator rebuilds the same text in JavaScript (`captureText` in kb-lib.mjs); a test pins the two.
    """
    lines: list[str] = []
    for b in blocks:
        if "heading" in b:
            lines.append("#" * b["level"] + " " + b["heading"])
        elif "item" in b:
            marker = f'{b["number"]}. ' if "number" in b else "- "
            lines.append("  " * b["depth"] + marker + b["item"])
        elif "code" in b:
            lines.append(b["code"])
        elif "table" in b:
            row = lambda cells: "| " + " | ".join(c.replace("|", "\\|") for c in cells) + " |"  # noqa: E731
            lines.append(row(b["table"][0]))
            lines.append("|" + "---|" * len(b["table"][0]))
            lines.extend(row(r) for r in b["table"][1:])
        else:
            lines.append(b["text"])
    return "\n".join(lines).strip() + "\n"


HELP = ROOT / "vendor" / "zscaler-help"
API = "https://help.zscaler.com/zapi/fetch-data"
# The older Markdown capture header, read only by `migrate`.
MD_HEADER = re.compile(
    r"\A# (?P<title>.*)\n\n\*\*Source:\*\* (?P<url>\S+)\n\*\*Captured:\*\* (?P<date>\S+)[^\n]*\n"
    r"(?:\*\*Revision:\*\* node (?P<nid>\d+), revision (?P<rev>\d+)\n)?\n---\n\n")


class Unavailable(SystemExit):
    """The page exists but cannot be read now (the site answers 403 while an article is under maintenance)."""


def _payload(url: str) -> dict:
    parsed = urllib.parse.urlparse(url)
    if parsed.netloc != "help.zscaler.com":
        raise SystemExit(f"not a help.zscaler.com page: {url}")
    query = urllib.parse.urlencode({"url_alias": parsed.path, "view_type": "full", "cloud": "false",
                                    "domain": "zscaler", "language": "en", "_format": "json"})
    req = urllib.request.Request(f"{API}?{query}", headers={"User-Agent": "zscaler-skill help_capture.py"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)["data"]


def _get_json(url: str) -> object:
    req = urllib.request.Request(url, headers={"User-Agent": "zscaler-skill help_capture.py"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def _last_modified(url: str | None) -> str | None:
    """The date a vendor file was last published, from its HTTP Last-Modified header (one HEAD request)."""
    if not url:
        return None
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "zscaler-skill help_capture.py"})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            stamp = resp.headers.get("Last-Modified")
    except OSError:
        return None
    return email.utils.parsedate_to_datetime(stamp).date().isoformat() if stamp else None


def _articles(items: list[dict] | None) -> list[dict]:
    return [{k: a[k] for k in ("nid", "title", "url", "view_type") if k in a} for a in items or []]


def page(url: str) -> dict:
    """One help page, classified by what the site serves for it.

    `help-article`: an article (title, content HTML, node and revision IDs). `help-api-spec`: a legacy API
    reference page, whose content is a Swagger file (`file_url`). `help-index`: a product's documentation
    index (categories and their articles). Raises Unavailable for a page under maintenance (403) and
    SystemExit for anything else that is not there.
    """
    if urllib.parse.urlparse(url).netloc == "automate.zscaler.com":
        from automate_pages import page as automate_page

        return automate_page(url)
    data = _payload(url)
    info, body = data.get("info") or {}, data.get("body") or {}
    current = f"https://help.zscaler.com{info['url']}" if info.get("url") else url
    if info.get("status") == 403:
        raise Unavailable(f"unavailable (403, under maintenance): {current}")
    if info.get("status") not in (200, 301):
        raise SystemExit(f"no page at {url} ({info.get('status')})")
    base = {"url": current, "moved": current != url, "title": html.unescape(body.get("title", ""))}
    view = info.get("view_type")
    if view == "swagger_article" and body.get("file_url"):
        return {**base, "kind": "help-api-spec", "nid": str(body["nid"]), "rev": str(body["revision_id"]),
                "file_url": body["file_url"], "spec": _get_json(body["file_url"]),
                "updated": _last_modified(body["file_url"]), "updated_basis": "file-last-modified"}
    if view == "documentation":
        cats = [{"title": c["title"], "articles": _articles(c.get("articles"))} for c in body.get("categories") or []]
        return {**base, "kind": "help-index", "categories": cats, "articles": _articles(body.get("articles"))}
    if not body.get("content"):
        raise SystemExit(f"no article at {url}")
    notes = _release_notes_html(body.get("release_notes")) if view == "release_notes" else ""
    # The site renders a PDF of each article when it is published; its Last-Modified is the article's date.
    return {**base, "kind": "help-article", "nid": str(body["nid"]), "rev": str(body["revision_id"]),
            "html": f"<article><h3>{html.escape(body['title'])}</h3>{body['content']}{notes}</article>",
            "updated": _last_modified(body.get("pdf_url")), "updated_basis": "pdf-last-modified"}


def _release_notes_html(notes: dict | None) -> str:
    """A release-notes page's entries, which the site sends beside the article rather than in its content.

    The payload carries the entries for its default cloud (`selected_category`): for each deployment date,
    groups such as Feature Available and Limited Availability, each a list of titled entries with HTML
    descriptions. They render as a date heading, a group heading (with its version when it has one), and each
    entry's title and description, in the payload's order (newest date first).
    """
    out = []
    for day in (notes or {}).get("entries", {}).values():
        out.append(f"<h4>{html.escape(day['title'])}</h4>")
        for groups in (day.get("feature") or {}).values():
            for g in groups:
                label = " ".join(x for x in (g.get("title", ""), g.get("version", "")) if x)
                out.append(f"<h5>{html.escape(label)}</h5>")
                for e in g.get("entries") or []:
                    out.append(f"<h6>{html.escape(e['title'])}</h6>{e.get('description') or ''}")
    return "".join(out)


def _cache_file(nid: str, rev: str) -> Path | None:
    """Where an article revision's HTML is kept when HELP_CAPTURE_HTML_CACHE names a directory (outside the repo)."""
    root = os.environ.get("HELP_CAPTURE_HTML_CACHE")
    return Path(root) / f"{nid}-{rev}.html" if root else None


def fetch(url: str) -> dict:
    """An article page (see page); anything else is an error here."""
    pg = page(url)
    cached = pg.get("kind") == "help-article" and _cache_file(pg["nid"], pg["rev"])
    if cached:
        cached.parent.mkdir(parents=True, exist_ok=True)
        cached.write_text(pg["html"], encoding="utf-8")
    if pg["kind"] != "help-article":
        raise SystemExit(f"not an article ({pg['kind']}): {url}")
    return pg


def document(title: str, url: str, blocks: list[dict], nid: str, rev: str, date: str | None = None) -> dict:
    """An article capture: provenance, then the article as blocks (see text_of for how quotes anchor)."""
    return {
        "schema_version": 1,
        "kind": "help-article",
        "title": title,
        "source": {"url": url, "node": str(nid), "revision": str(rev)},
        "captured_at": date or datetime.date.today().isoformat(),
        "blocks": blocks,
    }


def material(pg: dict, date: str | None = None) -> dict:
    """When the vendor last changed the material: their own date where the site gives one, else the day this
    content was first seen (`first-seen`), which is as precise as how often captures are checked."""
    if pg.get("updated"):
        return {"updated": pg["updated"], "updated_basis": pg["updated_basis"]}
    return {"updated": date or datetime.date.today().isoformat(), "updated_basis": "first-seen"}


def build(pg: dict, date: str | None = None) -> dict:
    """The capture file for a page of any kind."""
    doc = _build(pg, date)
    doc["source"] = {**doc["source"], **material(pg, date)}
    return doc


def _build(pg: dict, date: str | None = None) -> dict:
    if pg["kind"] == "help-article":
        title, blocks = render(pg["html"])
        return document(title, pg["url"], blocks, pg["nid"], pg["rev"], date)
    if pg["kind"] == "automate-doc":
        # The revision is the page chunk's content-hashed file name: it changes exactly when the page does.
        return {"schema_version": 1, "kind": "automate-doc", "title": pg["title"],
                "source": {"url": pg["url"], "revision": pg["rev"]},
                "captured_at": date or datetime.date.today().isoformat(), "blocks": pg["blocks"]}
    head = {"schema_version": 1, "kind": pg["kind"], "title": pg["title"]}
    when = {"captured_at": date or datetime.date.today().isoformat()}
    if pg["kind"] == "help-api-spec":
        # Cite a spec by keyed JSON pointer into `spec`, as API facts are cited elsewhere.
        src = {"url": pg["url"], "node": pg["nid"], "revision": pg["rev"], "file_url": pg["file_url"]}
        return {**head, "source": src, **when, "spec": pg["spec"]}
    return {**head, "source": {"url": pg["url"]}, **when, "categories": pg["categories"], "articles": pg["articles"]}


def content(doc: dict) -> str:
    """What a capture says, for comparing two captures of the same page and for diffs."""
    if doc["kind"] in ("help-article", "automate-doc"):
        return text_of(doc["blocks"])
    body = doc["spec"] if doc["kind"] == "help-api-spec" else {"categories": doc["categories"], "articles": doc["articles"]}
    return json.dumps(body, indent=1, sort_keys=True, ensure_ascii=False) + "\n"


KINDS = ("help-article", "help-api-spec", "help-index", "automate-doc")


def write(path: Path, doc: dict) -> None:
    path.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n")


def read(path: Path) -> dict | None:
    """A capture made by this tool, or None for any other file."""
    try:
        doc = json.loads(path.read_text())
    except (OSError, ValueError):
        return None
    return doc if isinstance(doc, dict) and doc.get("kind") in KINDS else None


def capture(url: str, name: str | None) -> Path:
    name = name or url.rstrip("/").rsplit("/", 1)[-1] + ".json"
    if not re.fullmatch(r"[\w.-]+\.json", name):
        raise SystemExit(f"capture name must be a plain file name ending in .json: {name}")
    out = HELP / name
    if out.exists():
        raise SystemExit(f"exists: {out}; use `check --replace {name}` to update it")
    write(out, build(page(url)))
    return out


def changes(old: str, new: str) -> dict:
    """Which lines of the new anchoring text changed (1-based), what was removed, and a unified diff.

    A deletion marks the lines on either side of where it was, so a quote next to removed text is found.
    """
    a, b = old.splitlines(), new.splitlines()
    changed: set[int] = set()
    removed: list[str] = []
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag in ("replace", "insert"):
            changed.update(range(j1 + 1, j2 + 1))
        if tag in ("replace", "delete"):
            removed.extend(a[i1:i2])
        if tag == "delete":
            changed.update(k for k in (j1, j1 + 1) if 1 <= k <= len(b))
    diff = "".join(difflib.unified_diff(old.splitlines(True), new.splitlines(True), "committed", "live", n=1))
    return {"changed_lines": sorted(changed), "removed": removed, "diff": diff}


def check(names: list[str], replace: bool, as_json: bool = False) -> int:
    """Refetch each capture; return how many drifted.

    An article or API page whose revision ID is unchanged is unchanged, so one request decides; an index
    has no revision, so its article list is compared. A page under maintenance is reported as unavailable
    and a missing page as gone; neither is drift. With `as_json`, print one JSON report instead of text:
    {"pages": [{file, status, from?, to?, changed_lines?, removed?, diff?, message?}]}, the input of
    scripts/kb-drift.mjs.
    """
    drifted = 0
    report: list[dict] = []
    say = (lambda *_: None) if as_json else print
    files = [HELP / n for n in names] or sorted(HELP.glob("*.json"))
    for path in files:
        doc = read(path)
        if not doc:
            if names:
                say(f"skip {path.name}: not a help_capture.py capture")
            continue
        src = doc["source"]
        try:
            pg = page(src["url"])
        except Unavailable as e:
            say(f"UNAVAILABLE {path.name}: {e}")
            report.append({"file": path.name, "status": "unavailable", "message": str(e)})
            continue
        except SystemExit as e:
            say(f"GONE  {path.name}: {e}")
            report.append({"file": path.name, "status": "gone", "message": str(e)})
            continue
        same_rev = "revision" in src and pg.get("rev") == src["revision"] and pg.get("file_url", src.get("file_url")) == src.get("file_url")
        if same_rev:
            say(f"ok    {path.name} (revision {src['revision']})")
            continue
        fresh = build(pg, doc["captured_at"])
        revs = {"from": src.get("revision"), "to": pg.get("rev")} if "revision" in src else {}
        if content(fresh) == content(doc):
            # Same content: the material did not change, whatever the vendor's file dates say now.
            fresh["source"] = {**fresh["source"], **{k: src[k] for k in ("updated", "updated_basis") if k in src}}
            say(f"ok    {path.name}" + (f" (revision {revs['from']} -> {revs['to']}, content unchanged)" if revs else ""))
            if replace and fresh != doc:
                write(path, fresh)
            continue
        drifted += 1
        delta = changes(content(doc), content(fresh))
        report.append({"file": path.name, "status": "drift", **revs, **delta})
        say(f"DRIFT {path.name}" + (f" (revision {revs['from']} -> {revs['to']})" if revs else ""))
        if not as_json:
            sys.stdout.write(delta["diff"])
        if replace:
            write(path, build(pg))
            say(f"      replaced {path.name}")
    if as_json:
        print(json.dumps({"pages": report}, indent=2, ensure_ascii=False))
    return drifted


def rerender(names: list[str]) -> int:
    """Apply a renderer change: re-render captures whose article is still at the captured revision.

    The revision ID is the vendor's: an unchanged revision is unchanged content, so any difference here
    comes from this tool. A capture whose revision moved is vendor drift and is left for `check`, so the
    two kinds of change never land together. Returns how many captures were left for `check`.
    """
    moved = 0
    files = [HELP / n for n in names] or sorted(HELP.glob("*.json"))
    for path in files:
        doc = read(path)
        if not doc or doc["kind"] != "help-article":
            continue
        src = doc["source"]
        # A revision's HTML never changes, so a cached copy of the captured revision re-renders offline.
        cached = _cache_file(src["node"], src["revision"]) if "node" in src else None
        if cached and cached.exists():
            art = {"rev": src["revision"], "html": cached.read_text(encoding="utf-8")}
        else:
            art = fetch(src["url"])
        if art["rev"] != src["revision"]:
            moved += 1
            print(f"DRIFT {path.name} (revision {src['revision']} -> {art['rev']}): vendor change, run `check`")
            continue
        _, blocks = render(art["html"])
        if blocks == doc["blocks"]:
            continue
        old, new = text_of(doc["blocks"]), text_of(blocks)
        print(f"RENDER {path.name}" + ("" if old != new else " (structure only, same text)"))
        sys.stdout.writelines(difflib.unified_diff(old.splitlines(True), new.splitlines(True), "before", "after", n=0))
        write(path, {**doc, "blocks": blocks})
    return moved


def recapture(names: list[str]) -> int:
    """Replace older-format captures (other tools, hand-edited) with canonical JSON captures."""
    failed = 0
    for name in names:
        path = HELP / name
        m = re.search(r"https://(?:help|automate)\.zscaler\.com/[^\s)*\"'<>]+", path.read_text()[:800])
        if not m:
            print(f"skip  {name}: no help.zscaler.com or automate.zscaler.com source in its header"); failed += 1; continue
        try:
            pg = page(m.group(0))
        except SystemExit as e:
            print(f"skip  {name}: {e}"); failed += 1; continue
        out = path.with_suffix(".json")
        write(out, build(pg))
        if out != path:
            path.unlink()
        print(f"done  {name} -> {out.name} ({pg['kind']})" + (f" (moved to {pg['url']})" if pg.get("moved") else ""))
    return failed


def _parse_md_body(body: str) -> list[dict]:
    """Blocks from an older Markdown capture body (the inverse of the old line rendering)."""
    raw: list[dict] = []
    rows: list[list[str]] = []
    for line in body.rstrip("\n").split("\n"):
        if line.startswith("|"):
            if not re.fullmatch(r"\|(?:---\|)+", line):
                cells = re.split(r"(?<!\\)\|", line.strip()[1:-1])
                rows.append([c.strip().replace("\\|", "|") for c in cells])
            continue
        if rows:
            raw.append({"table": rows}); rows = []
        if m := re.match(r"(#{1,6}) (.*)", line):
            raw.append({"heading": m[2], "level": len(m[1])})
        elif m := re.match(r"((?:  )*)- (.*)", line):
            raw.append({"item": m[2], "depth": len(m[1]) // 2})
        else:
            raw.append({"text": line})
    if rows:
        raw.append({"table": rows})
    # Markdown bodies are already unescaped; _structure unescapes again, so escape `&` back first.
    return [_structure(_escape(b)) for b in raw]


def _escape(block: dict) -> dict:
    esc = lambda t: t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")  # noqa: E731
    if "table" in block:
        return {"table": [[esc(c) for c in r] for r in block["table"]]}
    return {k: esc(v) if isinstance(v, str) else v for k, v in block.items()}


def migrate(names: list[str]) -> int:
    """Convert Markdown captures made by this tool to JSON captures, proving each loses nothing.

    The live article is used when it is still at the captured revision (exact block structure); else the
    Markdown body is parsed. Either way the JSON's anchoring text must equal the Markdown body with bold
    unmarked, or the file is left alone and reported.
    """
    failed = 0
    files = [HELP / n for n in names] or sorted(HELP.glob("*.md"))
    for path in files:
        text = path.read_text()
        m = MD_HEADER.match(text)
        if not m or not m["rev"]:
            if names:
                print(f"skip  {path.name}: not a help_capture.py Markdown capture")
            continue
        expected = text[m.end():].replace("**", "").strip() + "\n"
        blocks, how = None, "parsed"
        try:
            art = fetch(m["url"])
            if art["rev"] == m["rev"]:
                _, live = render(art["html"])
                if text_of(live) == expected:
                    blocks, how = live, "live"
        except (SystemExit, OSError) as e:  # offline or moved: fall back to parsing
            how = f"parsed ({e})"
        if blocks is None:
            blocks = _parse_md_body(text[m.end():])
        if text_of(blocks) != expected:
            print(f"FAIL  {path.name}: anchoring text differs from the Markdown body"); failed += 1; continue
        write(path.with_suffix(".json"), document(m["title"], m["url"], blocks, m["nid"], m["rev"], m["date"]))
        path.unlink()
        print(f"done  {path.name} ({how})")
    return failed


if __name__ == "__main__":
    args = sys.argv[1:]
    if len(args) == 2 and args[0] == "render":
        t, b = render(Path(args[1]).read_text())
        print(json.dumps({"title": t, "blocks": b}, indent=2, ensure_ascii=False))
    elif len(args) == 2 and args[0] == "text":
        sys.stdout.write(text_of(json.loads(Path(args[1]).read_text())["blocks"]))
    elif args[:1] == ["capture"] and len(args) in (2, 3):
        print(capture(args[1], args[2] if len(args) == 3 else None))
    elif args[:1] == ["recapture"] and len(args) > 1:
        sys.exit(1 if recapture(args[1:]) else 0)
    elif args[:1] == ["rerender"]:
        sys.exit(1 if rerender(args[1:]) else 0)
    elif args[:1] == ["migrate"]:
        sys.exit(1 if migrate(args[1:]) else 0)
    elif args[:1] == ["check"]:
        replace, as_json = "--replace" in args, "--json" in args
        names = [a for a in args[1:] if a not in ("--replace", "--json")]
        sys.exit(1 if check(names, replace, as_json) and not replace else 0)
    else:
        sys.exit(__doc__)
