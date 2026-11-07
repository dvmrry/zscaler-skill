"""Capture automate.zscaler.com guide pages (Docusaurus) as JSON, without running the site's code.

The site is client-rendered: a page's text lives in a webpack chunk. A doc page's chunk holds its compiled
MDX, a function returning nested `(0,r.jsx)(i.p,{children:"..."})` calls over string, array and object
literals; a category page ("generated index") holds `JSON.parse('...')` props. This module resolves a URL
to its chunk through the site's own route tables (`main.js`) and chunk maps (`runtime~main.js`), then
reads the chunk as data: a small parser for exactly that literal-and-call subset of JavaScript turns the
MDX into the same blocks as a help article (scripts/help_capture.py), plus `code` blocks. Nothing
downloaded is executed.

The chunk's file name carries Docusaurus's content hash, which changes exactly when the page does; it is
recorded as the capture's revision, so drift is one comparison, as for help articles.
"""
from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "automate-capture"))
from extract_docusaurus_blobs import chunk_maps  # noqa: E402

BASE = "https://automate.zscaler.com"
AGENT = {"User-Agent": "zscaler-skill automate_pages.py"}


def _get(url: str) -> str:
    with urllib.request.urlopen(urllib.request.Request(url, headers=AGENT), timeout=60) as resp:
        return resp.read().decode("utf-8")


class Site:
    """The site's route tables, fetched once per run."""

    def __init__(self) -> None:
        index = _get(f"{BASE}/docs")
        scripts = re.findall(r'src="(/assets/js/(?:runtime~main|main)\.[0-9a-f]+\.js)"', index)
        runtime = _get(BASE + next(s for s in scripts if "runtime~main" in s))
        self.main = _get(BASE + next(s for s in scripts if "/main." in s))
        self.prefix, self.hash = chunk_maps(runtime)

    def route(self, path: str) -> dict:
        """{content|props key, chunk id, module id, source} for one docs path such as /docs/a/b/."""
        path = urllib.parse.urlparse(path).path
        candidates = [path, path.rstrip("/") + "/"] if not path.endswith("/") else [path, path.rstrip("/")]
        for p in candidates:
            m = re.search(r'path:"' + re.escape(p) + r'",component:\w+\("' + re.escape(p) + r'","([0-9a-f]+)"\)', self.main)
            if m:
                break
        else:
            raise SystemExit(f"no route for {path}")
        names = re.search(r'"' + re.escape(f"{p}-{m.group(1)}") + r'":\{([^}]*)\}', self.main)
        if not names:
            raise SystemExit(f"no route chunk names for {p}")
        fields = dict(re.findall(r'"(\w+)":"([0-9a-f]+)"', names.group(1)))
        kind, key = ("doc", fields["content"]) if "content" in fields else ("index", fields.get("__props"))
        if not key:
            raise SystemExit(f"route {p} has neither content nor props")
        # A loader is `()=>t.e(C)` or, with shared component chunks, `()=>Promise.all([t.e(A),t.e(C)])`.
        entry = re.search(
            r'(?:"' + key + '"|\\b' + key + r'):\[\(\)=>(.*?)\.then\(\w+(?:\.t)?\.bind\(\w+,(\d+)(?:,\d+)?\)\),"([^"]+)",\d+\]',
            self.main,
        )
        if not entry:
            raise SystemExit(f"no registry entry {key} for {p}")
        chunks = [int(c) for c in re.findall(r"\.e\((\d+)\)", entry.group(1))]
        return {"path": p, "kind": kind, "chunks": chunks, "module": entry.group(2), "source": entry.group(3)}

    def chunk_with(self, chunk_ids: list[int], module: str) -> tuple[str, str]:
        """(file name, text) of the chunk among `chunk_ids` that defines `module`."""
        for chunk_id in reversed(chunk_ids):
            name = f"{self.prefix.get(chunk_id, chunk_id)}.{self.hash[chunk_id]}.js"
            text = _get(f"{BASE}/assets/js/{name}")
            if re.search(r"[,{]" + module + r"\(", text):
                return name, text
        raise SystemExit(f"module {module} is in none of chunks {chunk_ids}")


# ---------------------------------------------------------------- a parser for compiled MDX, as data


class _Parser:
    """Parses the literal-and-call subset of JavaScript that compiled MDX uses. Never evaluates."""

    def __init__(self, src: str, pos: int, names: dict[str, str]) -> None:
        self.s, self.i, self.names = src, pos, names

    def ws(self) -> None:
        while self.i < len(self.s) and self.s[self.i] in " \t\r\n":
            self.i += 1

    def eat(self, text: str) -> bool:
        self.ws()
        if self.s.startswith(text, self.i):
            self.i += len(text)
            return True
        return False

    def need(self, text: str) -> None:
        if not self.eat(text):
            raise ValueError(f"expected {text!r} at {self.i}: {self.s[self.i:self.i + 60]!r}")

    def string(self) -> str:
        quote = self.s[self.i]
        self.i += 1
        out = []
        while self.s[self.i] != quote:
            c = self.s[self.i]
            if c == "\\":
                n = self.s[self.i + 1]
                if n == "u":
                    if self.s[self.i + 2] == "{":
                        end = self.s.index("}", self.i)
                        out.append(chr(int(self.s[self.i + 3:end], 16)))
                        self.i = end + 1
                        continue
                    out.append(chr(int(self.s[self.i + 2:self.i + 6], 16)))
                    self.i += 6
                    continue
                if n == "x":
                    out.append(chr(int(self.s[self.i + 2:self.i + 4], 16)))
                    self.i += 4
                    continue
                out.append({"n": "\n", "t": "\t", "r": "\r", "b": "\b", "f": "\f", "v": "\v", "0": "\0", "\n": ""}.get(n, n))
                self.i += 2
                continue
            if quote == "`" and self.s.startswith("${", self.i):
                raise ValueError(f"template expression at {self.i}")
            out.append(c)
            self.i += 1
        self.i += 1
        return "".join(out)

    def name(self) -> str:
        m = re.compile(r"[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*").match(self.s, self.i)
        if not m:
            raise ValueError(f"expected a name at {self.i}: {self.s[self.i:self.i + 60]!r}")
        self.i = m.end()
        return m.group(0)

    def value(self):
        """A value, then any `(args)`, `.member` or `+ value` after it (asset URLs: `t(740061).A+""`)."""
        v = self.primary()
        while True:
            self.ws()
            if self.s.startswith("(", self.i) and not isinstance(v, (str, list)):
                self.i += 1
                while not self.eat(")"):
                    self.value()
                    self.eat(",")
                v = {"expr": "call"}
            elif self.s.startswith(".", self.i) and not self.s.startswith("...", self.i):
                self.i += 1
                self.name()
                v = {"expr": "member"}
            elif self.s.startswith("+", self.i):
                self.i += 1
                w = self.primary()
                v = v + w if isinstance(v, str) and isinstance(w, str) else {"expr": "sum"}
            else:
                return v

    def primary(self):
        self.ws()
        c = self.s[self.i]
        if c in "\"'`":
            return self.string()
        if c == "[":
            self.i += 1
            items = []
            while not self.eat("]"):
                items.append(self.value())
                self.eat(",")
            return items
        if c == "{":
            return self.obj()
        if self.eat("(0,"):
            fn = self.name()
            self.need(")")
            self.need("(")
            args = []
            while not self.eat(")"):
                args.append(self.value())
                self.eat(",")
            if fn.endswith((".jsx", ".jsxs")):
                return {"tag": args[0], "props": args[1] if len(args) > 1 else {}}
            return {"call": fn}  # e.g. the MDX provider hook in a spread; carries no content
        if self.eat("!0"):
            return True
        if self.eat("!1"):
            return False
        if self.eat("void 0"):
            return None
        m = re.compile(r"-?\d+(?:\.\d+)?(?:e\d+)?").match(self.s, self.i)
        if m:
            self.i = m.end()
            return float(m.group(0)) if "." in m.group(0) else int(float(m.group(0)))
        name = self.name()
        if name in ("null", "undefined"):
            return None
        # `i.p` names an MDX element through the component map; anything else is a component.
        obj, _, attr = name.partition(".")
        if attr and obj in self.names:
            return self.names[obj].get(attr, attr)
        return {"component": name}

    def skip_declarators(self) -> None:
        """Skip the rest of a `const` statement (`,{Details:i}=n;`): it binds components, not content."""
        depth = 0
        while self.i < len(self.s):
            c = self.s[self.i]
            if c in "\"'`":
                self.string()
                continue
            if c in "([{":
                depth += 1
            elif c in ")]}":
                depth -= 1
            elif c == ";" and depth == 0:
                self.i += 1
                return
            self.i += 1
        raise ValueError("unterminated declaration")

    def returned(self):
        """The value of `return a, b, c`: the last top-level operand of a comma expression.

        A page that uses a site component first checks it is defined (`return i||function(){throw...}
        ("Details",!0),(0,s.jsxs)(...)`); the content is the last operand.
        """
        self.ws()
        start, depth, commas = self.i, 0, []
        i = self.i
        while i < len(self.s):
            c = self.s[i]
            if c in "\"'`":
                self.i = i
                self.string()
                i = self.i
                continue
            if c in "([{":
                depth += 1
            elif c in ")]}":
                if depth == 0:
                    break
                depth -= 1
            elif c == ";" and depth == 0:
                break
            elif c == "," and depth == 0:
                commas.append(i)
            i += 1
        self.i = commas[-1] + 1 if commas else start
        return self.value()

    def obj(self) -> dict:
        self.need("{")
        out: dict = {}
        while not self.eat("}"):
            if self.eat("..."):
                self.value()
            else:
                self.ws()
                key = self.string() if self.s[self.i] in "\"'" else self.name()
                self.need(":")
                out[key] = self.value()
            self.eat(",")
        return out


def parse_mdx(chunk: str, module: str) -> tuple[str, list]:
    """(title, tree) of the compiled MDX module `module` in a chunk."""
    start = re.search(r"[,{]" + module + r"\(\w+,\w+,\w+\)\{", chunk)
    if not start:
        raise ValueError(f"module {module} not in chunk")
    meta = re.search(r"JSON\.parse\('((?:[^'\\]|\\.)*)'\)", chunk[start.end():])
    title = ""
    if meta:
        title = json.loads(_Parser("'" + meta.group(1) + "'", 0, {}).string()).get("title", "")
    # The content function: `function c(e){const i={p:"p",...};return(0,r.jsxs)(...)}` for Markdown pages,
    # or `function u(e){return(0,t.jsxs)("div",...)}` for generated reference pages with no element map.
    fn = re.compile(r"function [\w$]+\([\w$]+\)\{(?:const ([\w$]+)=\{|return\(0,)").search(chunk, start.end())
    if not fn:
        raise ValueError("no MDX content function")
    if fn.group(1):
        p = _Parser(chunk, fn.end() - 1, {})
        mapping = p.obj()
        p.names = {fn.group(1): {k: v for k, v in mapping.items() if isinstance(v, str)}}
        p.skip_declarators()
        p.need("return")
        return title, p.returned()
    p = _Parser(chunk, fn.end() - len("(0,"), {})
    return title, p.value()


# ---------------------------------------------------------------- tree to capture blocks

INLINE = {"a", "strong", "b", "em", "i", "code", "span", "br", "sup", "sub", "del", "img", "kbd", "mark"}


def _children(node) -> list:
    if not isinstance(node, dict) or "props" not in node:
        return []
    kids = node["props"].get("children", [])
    return kids if isinstance(kids, list) else [kids]


def _tag(node) -> str | None:
    return node.get("tag") if isinstance(node, dict) and isinstance(node.get("tag"), str) else None


def _inline(nodes) -> tuple[str, list[list[int]]]:
    """Plain text of inline content and the character ranges of its bold runs."""
    out: list[str] = []
    spans: list[list[int]] = []

    def walk(n, bold: bool) -> None:
        if isinstance(n, str):
            start = sum(map(len, out))
            out.append(n)
            if bold and n.strip():
                spans.append([start, start + len(n)])
            return
        if isinstance(n, list):
            for x in n:
                walk(x, bold)
            return
        if _tag(n) == "br":
            out.append(" ")
            return
        for k in _children(n):
            walk(k, bold or _tag(n) in ("strong", "b"))

    walk(nodes, False)
    raw = "".join(out)
    # Collapse whitespace as help captures do, moving the bold ranges with the text.
    text, index, j = [], {}, 0
    for k, ch in enumerate(raw):
        if ch.isspace():
            if text and text[-1] != " ":
                text.append(" ")
                j += 1
            index[k] = j
            continue
        index[k] = j
        text.append(ch)
        j += 1
    index[len(raw)] = j
    plain = "".join(text)
    lead = len(plain) - len(plain.lstrip())
    plain = plain.strip()
    bold = []
    for a, b in spans:
        a2, b2 = max(index[a] - lead, 0), min(index[b] - lead, len(plain))
        while a2 < b2 and plain[a2] == " ":
            a2 += 1
        while b2 > a2 and plain[b2 - 1] == " ":
            b2 -= 1
        if a2 < b2:
            bold.append([a2, b2])
    return plain, bold


def _text_block(key: str, nodes, **extra) -> dict | None:
    plain, bold = _inline(nodes)
    if not plain:
        return None
    return {key: plain, **extra, **({"strong": bold} if bold else {})}


def blocks_of(tree) -> list[dict]:
    """The capture blocks of an MDX tree: headings, paragraphs, list items, tables and code."""
    out: list[dict] = []

    def table(node) -> None:
        rows = []

        def walk(n) -> None:
            if _tag(n) == "tr":
                rows.append([_inline(_children(c))[0] for c in _children(n) if _tag(c) in ("th", "td")])
            else:
                for k in _children(n):
                    walk(k)

        walk(node)
        if rows:
            width = max(len(r) for r in rows)
            out.append({"table": [r + [""] * (width - len(r)) for r in rows]})

    def listing(node, depth: int) -> None:
        ordered = _tag(node) == "ol"
        number = int(node["props"].get("start", 1)) - 1 if ordered else 0
        for item in _children(node):
            if _tag(item) != "li":
                continue
            number += 1
            inline, nested = [], []
            for k in _children(item):
                (nested if _tag(k) in ("ul", "ol", "table", "pre") else inline).append(k)
            extra = {"depth": depth, **({"number": number} if ordered else {})}
            text = [k for k in inline if _tag(k) != "p"]
            for para in [k for k in inline if _tag(k) == "p"] or [None]:
                block = _text_block("item", text + ([para] if para else []), **extra)
                if block:
                    out.append(block)
                    extra = {"depth": depth}
                text = []
            for k in nested:
                listing(k, depth + 1) if _tag(k) in ("ul", "ol") else walk(k)

    def walk(node) -> None:
        if isinstance(node, list):
            for n in node:
                walk(n)
            return
        if isinstance(node, str):
            block = _text_block("text", node)
            if block:
                out.append(block)
            return
        tag = _tag(node)
        if tag and re.fullmatch(r"h[1-6]", tag):
            block = _text_block("heading", _children(node), level=int(tag[1]))
            if block:
                block.pop("strong", None)
                out.append(block)
        elif tag in ("ul", "ol"):
            listing(node, 0)
        elif tag == "table":
            table(node)
        elif tag == "pre":
            code = "".join(_raw(node)).strip("\n")
            if code.strip():
                out.append({"code": code})
        elif tag == "p" or tag in INLINE:
            block = _text_block("text", _children(node) if tag == "p" else node)
            if block:
                out.append(block)
        else:
            # Containers and site components (admonitions, tabs, details): their content, in order.
            for k in _children(node):
                walk(k)

    walk(tree)
    return out


def _raw(node) -> list[str]:
    if isinstance(node, str):
        return [node]
    if isinstance(node, list):
        return [t for n in node for t in _raw(n)]
    return [t for k in _children(node) for t in _raw(k)]


_SITE: Site | None = None


def page(url: str, site: Site | None = None) -> dict:
    """One automate.zscaler.com docs page, in the form scripts/help_capture.py builds captures from."""
    global _SITE
    if urllib.parse.urlparse(url).netloc != "automate.zscaler.com":
        raise SystemExit(f"not an automate.zscaler.com page: {url}")
    site = site or _SITE or Site()
    _SITE = site
    r = site.route(urllib.parse.urlparse(url).path)
    name, chunk = site.chunk_with(r["chunks"], r["module"])
    current = BASE + r["path"]
    base = {"url": current, "moved": current.rstrip("/") != url.rstrip("/"), "rev": name}
    if r["kind"] == "index":
        m = re.search(r"JSON\.parse\('((?:[^'\\]|\\.)*)'\)", chunk)
        props = json.loads(_Parser("'" + m.group(1) + "'", 0, {}).string())["categoryGeneratedIndex"]
        blocks = [{"text": props["description"]}] if props.get("description") else []
        return {**base, "kind": "automate-doc", "title": props["title"], "blocks": blocks}
    title, tree = parse_mdx(chunk, r["module"])
    blocks = blocks_of(tree)
    # The page's own h1 is its title, as for help articles.
    if blocks and blocks[0].get("heading") == title and blocks[0].get("level") == 1:
        blocks = blocks[1:]
    return {**base, "kind": "automate-doc", "title": title, "blocks": blocks}


if __name__ == "__main__":
    pg = page(sys.argv[1])
    print(json.dumps({k: v for k, v in pg.items()}, indent=2, ensure_ascii=False))
