#!/usr/bin/env python3
"""Capture the OneAPI Postman collection that automate.zscaler.com publishes, with its provenance.

The "Adding OneAPI Postman Collection" page links the current collection as a dated download
(`/downloads/OneAPI_postman_collection_<MM_DD_YYYY>.json`). This tool reads that link from the page
(through scripts/automate_pages.py, which resolves the site's route tables; nothing is executed),
downloads the file, stores it byte for byte at vendor/zscaler-api-specs/oneapi-postman-collection.json,
and records the download URL, date and sha256 in references/_meta/capture-manifest.json. A new release
shows up as a new link; a silent re-upload as a new hash.

Usage:
  postman_capture.py capture   download the current collection and record it
  postman_capture.py check     exit 1 if the published collection differs from the vendored one
"""
from __future__ import annotations

import datetime
import hashlib
import json
import re
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from automate_pages import BASE, Site  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
PAGE = "/docs/tools/postman/adding-oneapi-postman-collection"
TARGET = "vendor/zscaler-api-specs/oneapi-postman-collection.json"
MANIFEST = ROOT / "references" / "_meta" / "capture-manifest.json"
LINK = re.compile(r'href:"(/downloads/[^"]*postman_collection[^"]*\.json)"', re.I)


def current_link(site: Site | None = None) -> str:
    """The download URL the Postman page links right now."""
    site = site or Site()
    route = site.route(PAGE)
    _, chunk = site.chunk_with(route["chunks"], route["module"])
    links = sorted(set(LINK.findall(chunk)))
    if len(links) != 1:
        raise SystemExit(f"expected one collection link on {PAGE}, found {links}")
    return BASE + links[0]


def download(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "zscaler-skill postman_capture.py"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = resp.read()
    json.loads(data)  # refuse anything that is not the JSON collection
    return data


def capture() -> None:
    url = current_link()
    data = download(url)
    (ROOT / TARGET).write_bytes(data)
    manifest = json.loads(MANIFEST.read_text())
    release = re.search(r"_(\d\d)_(\d\d)_(\d{4})\.json$", url)
    manifest["files"][TARGET] = {
        "captured_from": url,
        "captured_at": datetime.date.today().isoformat(),
        "sha256": hashlib.sha256(data).hexdigest(),
        # The file name carries the release date (MM_DD_YYYY): the age of the material itself.
        **({"updated": f"{release[3]}-{release[1]}-{release[2]}", "updated_basis": "release-filename"} if release else {}),
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    print(f"captured {url} -> {TARGET} ({len(data)} bytes)")


def check() -> int:
    entry = json.loads(MANIFEST.read_text())["files"].get(TARGET) or {}
    url = current_link()
    if entry.get("captured_from") != url:
        print(f"DRIFT new release: {url} (vendored: {entry.get('captured_from')})")
        return 1
    if hashlib.sha256(download(url)).hexdigest() != entry.get("sha256"):
        print(f"DRIFT re-uploaded: {url} no longer matches the vendored file")
        return 1
    print(f"ok    {url}")
    return 0


if __name__ == "__main__":
    if sys.argv[1:] == ["capture"]:
        capture()
    elif sys.argv[1:] == ["check"]:
        sys.exit(check())
    else:
        sys.exit(__doc__)
