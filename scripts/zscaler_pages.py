#!/usr/bin/env python3
"""Read www.zscaler.com pages (product, solution and Zpedia pages) in the form scripts/help_capture.py builds
captures from.

The site is a Next.js front end over Drupal: each page is served as complete HTML, with the page's content
rendered inside its one `<main>` element (collapsed accordion answers and inactive tabs included) and the
Drupal node it renders, by `nid`, in `__NEXT_DATA__`. A capture is that `<main>` element as blocks, rendered by
the same renderer as help articles (help_capture.blocks_of_html), titled with the page's `<title>` less the
site suffix. The site exposes no revision ID, so the revision is a hash of the blocks' text: it changes exactly
when what a quote can anchor in does. Pages are fetched over plain HTTP, with no browser, so it runs in CI.
The site rate-limits bursts (HTTP 429), so requests are spaced and a 429 waits longer than other failures.
"""
from __future__ import annotations

import hashlib
import html
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

from help_capture import RETRY_PAUSES, Unavailable, blocks_of_html, text_of

HOST = "www.zscaler.com"
NEXT_DATA = re.compile(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', re.S)
MAIN = re.compile(r"<main\b.*?</main>", re.S)
TITLE = re.compile(r"<title[^>]*>(.*?)</title>", re.S)
# Seconds between requests, and the pauses before retrying a rate-limited one when it names no Retry-After.
SPACING = 3
LIMITED_PAUSES = (30, 120)
_last = 0.0


def _get(url: str) -> tuple[str, str]:
    """GET one page: (its final URL after redirects, its HTML), retrying transient failures."""
    global _last
    req = urllib.request.Request(url, headers={"User-Agent": "zscaler-skill help_capture.py"})
    for tries in range(len(LIMITED_PAUSES) + 1):
        time.sleep(max(0.0, _last + SPACING - time.monotonic()))
        _last = time.monotonic()
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return resp.geturl(), resp.read().decode("utf-8")
        except urllib.error.HTTPError as e:
            if e.code == 404:
                raise SystemExit(f"no page at {url} (404)") from None
            if e.code < 500 and e.code != 429:
                raise
            err: OSError = e
            after = e.headers.get("Retry-After", "") if e.code == 429 else ""
            pause = int(after) if after.isdigit() else (LIMITED_PAUSES if e.code == 429 else RETRY_PAUSES)[min(tries, 1)]
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            err, pause = e, RETRY_PAUSES[min(tries, 1)]
        if tries == len(LIMITED_PAUSES):
            break
        time.sleep(pause)
    raise Unavailable(f"unreachable after {len(LIMITED_PAUSES) + 1} tries ({err}): {url}")


def read_html(url: str, page_html: str) -> dict:
    """The page at `url` (its final address) from its served HTML."""
    data = NEXT_DATA.search(page_html)
    props = ((json.loads(data.group(1)) if data else {}).get("props") or {}).get("pageProps") or {}
    nid = props.get("nid") or (props.get("node") or {}).get("id")
    main, title = MAIN.search(page_html), TITLE.search(page_html)
    if not nid or not main or not title:
        raise SystemExit(f"not a www.zscaler.com content page (no node, <main> or <title>): {url}")
    name = re.sub(r"\s+", " ", html.unescape(title.group(1))).strip().removesuffix(" | Zscaler").strip()
    blocks = blocks_of_html(main.group(0))
    rev = hashlib.sha256(text_of(blocks).encode("utf-8")).hexdigest()[:16]
    return {"url": url, "kind": "zscaler-page", "title": name, "rev": rev, "blocks": blocks}


def page(url: str) -> dict:
    """One www.zscaler.com page, in the form scripts/help_capture.py builds captures from."""
    if urllib.parse.urlparse(url).netloc != HOST:
        raise SystemExit(f"not a {HOST} page: {url}")
    final, page_html = _get(url)
    return {**read_html(final, page_html), "moved": final.rstrip("/") != url.rstrip("/")}


if __name__ == "__main__":
    pg = page(sys.argv[1])
    print(json.dumps({k: v for k, v in pg.items()}, indent=2, ensure_ascii=False))
