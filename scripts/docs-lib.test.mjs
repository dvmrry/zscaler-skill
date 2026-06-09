// Node-side unit tests for the pure helpers in docs/docs-lib.js.
// The DOM/fetch/localStorage parts of that module are browser-only and are
// smoke-checked separately; here we cover the security-critical pure logic.
import assert from "node:assert/strict";
import test from "node:test";

import lib from "../docs/docs-lib.js";

const { safeHref, escapeHtml, prettify, encodePath, isFreshCacheEntry } = lib;

test("safeHref passes ordinary safe links through unchanged", () => {
  for (const href of [
    "https://example.com/x",
    "http://example.com",
    "mailto:a@b.com",
    "tel:+15551234",
    "#anchor",
    "relative/path",
    "../up/one.png",
  ]) {
    assert.equal(safeHref(href), href);
  }
});

test("safeHref neutralizes dangerous schemes to '#'", () => {
  for (const href of [
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "  javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
  ]) {
    assert.equal(safeHref(href), "#");
  }
});

test("escapeHtml escapes the five HTML-significant characters", () => {
  assert.equal(escapeHtml(`<a href="x">&'`), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
});

test("prettify turns a slug into a title", () => {
  assert.equal(prettify("url-filtering"), "Url Filtering");
  assert.equal(prettify("cloud_app_control"), "Cloud App Control");
});

test("encodePath encodes each segment but preserves slashes", () => {
  assert.equal(encodePath("zia/url filtering"), "zia/url%20filtering");
  assert.equal(encodePath("a/b/c"), "a/b/c");
});

test("isFreshCacheEntry respects the TTL window", () => {
  const ttl = 1000 * 60 * 30;
  assert.equal(isFreshCacheEntry(1000, 1000 + ttl - 1, ttl), true);
  assert.equal(isFreshCacheEntry(1000, 1000 + ttl + 1, ttl), false);
});
