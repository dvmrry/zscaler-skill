#!/usr/bin/env python3
"""Turn a rendered help.zscaler.com article into the canonical capture text.

The capture is what knowledge-graph claims quote, so it must be deterministic and
independent of the fetcher: the same article HTML always yields the same text.
Headings become `#` lines, list items `- ` (nested by two spaces), tables Markdown
tables (one row per line, so a row can be quoted), and everything else plain text.
Links keep their text and images are dropped. Bold stays as `**text**`: the vendor marks the
recommended value in some tables only by bold, and quote matching ignores the markers.

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
        self.lists: list[int] = []  # nesting depth markers
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
            self.blocks.append({"item": text, "depth": len(self.lists) - 1})
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

    A heading is `#` x level, a list item is indented two spaces per depth and starts `- `, a table is
    one `| a | b |` row per line with a `|---|` rule after its first row; bold is not marked. The
    validator rebuilds the same text in JavaScript (`captureText` in kb-lib.mjs); a test pins the two.
    """
    lines: list[str] = []
    for b in blocks:
        if "heading" in b:
            lines.append("#" * b["level"] + " " + b["heading"])
        elif "item" in b:
            lines.append("  " * b["depth"] + "- " + b["item"])
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
            "nid": str(body["nid"]), "rev": str(body["revision_id"]), "url": current, "moved": current != url}


def document(title: str, url: str, blocks: list[dict], nid: str, rev: str, date: str | None = None) -> dict:
    """A capture file: provenance, then the article as blocks (see text_of for how quotes anchor)."""
    return {
        "schema_version": 1,
        "kind": "help-article",
        "title": title,
        "source": {"url": url, "node": str(nid), "revision": str(rev)},
        "captured_at": date or datetime.date.today().isoformat(),
        "blocks": blocks,
    }


def write(path: Path, doc: dict) -> None:
    path.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n")


def read(path: Path) -> dict | None:
    """A capture made by this tool, or None for any other file."""
    try:
        doc = json.loads(path.read_text())
    except (OSError, ValueError):
        return None
    return doc if isinstance(doc, dict) and doc.get("kind") == "help-article" else None


def capture(url: str, name: str | None) -> Path:
    name = name or url.rstrip("/").rsplit("/", 1)[-1] + ".json"
    if not re.fullmatch(r"[\w.-]+\.json", name):
        raise SystemExit(f"capture name must be a plain file name ending in .json: {name}")
    out = HELP / name
    if out.exists():
        raise SystemExit(f"exists: {out}; use `check --replace {name}` to update it")
    art = fetch(url)
    title, blocks = render(art["html"])
    write(out, document(title, art["url"], blocks, art["nid"], art["rev"]))
    return out


def check(names: list[str], replace: bool) -> int:
    """Refetch each capture; return how many drifted. The same revision means unchanged, so one request decides."""
    drifted = 0
    files = [HELP / n for n in names] or sorted(HELP.glob("*.json"))
    for path in files:
        doc = read(path)
        if not doc:
            if names:
                print(f"skip {path.name}: not a help_capture.py capture")
            continue
        src = doc["source"]
        art = fetch(src["url"])
        if art["rev"] == src["revision"]:
            print(f"ok    {path.name} (revision {art['rev']})")
            continue
        title, blocks = render(art["html"])
        if text_of(blocks) == text_of(doc["blocks"]):
            print(f"ok    {path.name} (revision {src['revision']} -> {art['rev']}, text unchanged)")
            if replace:
                write(path, document(title, art["url"], blocks, art["nid"], art["rev"], doc["captured_at"]))
            continue
        drifted += 1
        print(f"DRIFT {path.name} (revision {src['revision']} -> {art['rev']})")
        old, new = text_of(doc["blocks"]), text_of(blocks)
        sys.stdout.writelines(difflib.unified_diff(old.splitlines(True), new.splitlines(True), "committed", "live", n=1))
        if replace:
            write(path, document(title, art["url"], blocks, art["nid"], art["rev"]))
            print(f"      replaced {path.name}")
    return drifted


def recapture(names: list[str]) -> int:
    """Replace older-format captures (other tools, hand-edited) with canonical JSON captures."""
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
        title, blocks = render(art["html"])
        out = path.with_suffix(".json")
        write(out, document(title, art["url"], blocks, art["nid"], art["rev"]))
        if out != path:
            path.unlink()
        print(f"done  {name} -> {out.name}" + (f" (moved to {art['url']})" if art.get("moved") else ""))
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
    elif args[:1] == ["migrate"]:
        sys.exit(1 if migrate(args[1:]) else 0)
    elif args[:1] == ["check"]:
        replace = "--replace" in args
        sys.exit(1 if check([a for a in args[1:] if a != "--replace"], replace) and not replace else 0)
    else:
        sys.exit(__doc__)
