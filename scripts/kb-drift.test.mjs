import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { bySubject, driftReview, pinReview, renameSweep, renames } from "./kb-drift.mjs";
import { buildGraph, loadPublic } from "./kb-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function repo(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kb-drift-"));
  fs.cpSync(path.join(ROOT, "references/_meta/schema"), path.join(root, "references/_meta/schema"), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "references/_meta/products.json"), path.join(root, "references/_meta/products.json"));
  for (const [rel, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), JSON.stringify(body, null, 2));
  }
  return root;
}

test("a drifted page sorts the evidence citing it into broken, in-change and untouched", () => {
  const cite = (quote) => ({ statement: "S.", tier: "A", evidence: [{ source: "zscaler-help", path: "page.json", quotes: [quote] }] });
  const root = repo({
    "references/_meta/sources.json": { schema_version: 1, sources: { "zscaler-help": { kind: "capture", root: "vendor/zscaler-help", rank: 5, title: "Help" } } },
    // The page as rewritten by `check --replace`: line 2 is the one that changed.
    "vendor/zscaler-help/page.json": {
      schema_version: 1, kind: "help-article", title: "Page", source: { url: "https://help.zscaler.com/zia/page", node: "1", revision: "3" },
      captured_at: "2026-10-18",
      blocks: [{ text: "Intro line." }, { text: "Rules stop at the last match." }, { text: "A middle line." }, { text: "Far from the change." }],
    },
    "references/zia/zia.example.json": {
      schema_version: 1, id: "zia.example", title: "Example",
      claims: { gone: cite("Rules stop at the first match."), near: cite("Rules stop at the last match."), far: cite("Far from the change.") },
    },
  });
  const report = { pages: [{ file: "page.json", status: "drift", from: "2", to: "3", changed_lines: [2], removed: ["Rules stop at the first match."] }, { file: "other.json", status: "unchanged" }] };
  const pages = driftReview(buildGraph(loadPublic(root)), report);
  // An unchanged page (issue_capture.py lists every issue it checked) has nothing to review.
  assert.deepEqual(pages.map((p) => p.file), ["page.json"]);
  const [page] = pages;
  const byClaim = Object.fromEntries(page.evidence.map((e) => [e.where.match(/(gone|near|far)/)[1], e.state]));
  assert.deepEqual(byClaim, { gone: "broken", near: "in-change", far: "untouched" });
});

test("a page that moved keeps its quotes; evidence pointing at its old address is broken", () => {
  const root = repo({
    "references/_meta/sources.json": { schema_version: 1, sources: { "zscaler-help": { kind: "capture", root: "vendor/zscaler-help", rank: 5, title: "Help" } } },
    "vendor/zscaler-help/page.json": {
      schema_version: 1, kind: "help-article", title: "Page", captured_at: "2026-10-18",
      source: { url: "https://help.zscaler.com/zia/new-page", node: "1", revision: "3", aliases: ["https://help.zscaler.com/zia/page"] },
      blocks: [{ text: "Rules stop at the first match." }],
    },
    "references/zia/zia.example.json": {
      schema_version: 1, id: "zia.example", title: "Example",
      claims: {
        quoted: { statement: "S.", tier: "A", evidence: [{ source: "zscaler-help", path: "page.json", quotes: ["Rules stop at the first match."] }] },
        address: { statement: "S.", tier: "A", evidence: [{ source: "zscaler-help", path: "page.json", pointer: "/source", expect: { url: "https://help.zscaler.com/zia/page" } }] },
      },
    },
  });
  const report = { pages: [{ file: "page.json", status: "moved", changed_lines: [], message: "moved: https://help.zscaler.com/zia/page -> https://help.zscaler.com/zia/new-page" }] };
  const [page] = driftReview(buildGraph(loadPublic(root)), report);
  const byClaim = Object.fromEntries(page.evidence.map((e) => [e.where.match(/(quoted|address)/)[1], e.state]));
  assert.deepEqual(byClaim, { quoted: "untouched", address: "broken" });
});

test("a moved submodule pin sorts the evidence citing changed files into broken, in-change and untouched", () => {
  const cite = (file, quote) => ({ statement: "S.", tier: "A", evidence: [{ source: "fake", path: file, quotes: [quote] }] });
  const root = repo({
    "references/_meta/sources.json": { schema_version: 1, sources: { fake: { kind: "submodule", root: "vendor/fake", rank: 1, title: "Fake" } } },
    "references/zia/zia.example.json": {
      schema_version: 1, id: "zia.example", title: "Example",
      claims: {
        gone: cite("a.js", "send only content and direction"),
        near: cite("a.js", "var payload = { content: prompt };"),
        far: cite("a.js", "function unrelatedHelper() {}"),
        other: cite("b.js", "this file did not change"),
      },
    },
  });
  const sub = path.join(root, "vendor/fake");
  fs.mkdirSync(sub, { recursive: true });
  const run = (...a) => execFileSync("git", ["-C", sub, "-c", "user.email=t@example.com", "-c", "user.name=t", ...a], { encoding: "utf8" }).trim();
  run("init", "-q");
  const write = (body) => fs.writeFileSync(path.join(sub, "a.js"), body.join("\n") + "\n");
  fs.writeFileSync(path.join(sub, "b.js"), "this file did not change\n");
  write(["// send only content and direction", "var payload = { content: prompt };", "", "", "", "function unrelatedHelper() {}"]);
  run("add", "-A"); run("commit", "-q", "-m", "one");
  const from = run("rev-parse", "HEAD");
  // The bump: the comment is reworded and a user field is added right after the payload, so the payload quote
  // still anchors but sits next to the change, which is the case a broken-quote check misses.
  write(["// the fields sent include user", "var payload = { content: prompt };", "payload.user = user;", "", "", "function unrelatedHelper() {}"]);
  run("add", "-A"); run("commit", "-q", "-m", "two");
  const to = run("rev-parse", "HEAD");
  // Evidence pinned to fixed refs does not move with the pin; evidence whose `at` names HEAD as well does.
  const subject = path.join(root, "references/zia/zia.example.json");
  const doc = JSON.parse(fs.readFileSync(subject, "utf8"));
  doc.claims.released = { ...cite("a.js", "send only content and direction"), evidence: [{ source: "fake", path: "a.js", at: [from], quotes: ["send only content and direction"] }] };
  doc.claims.current = { ...cite("a.js", "send only content and direction"), evidence: [{ source: "fake", path: "a.js", at: [from, "HEAD"], quotes: ["send only content and direction"] }] };
  fs.writeFileSync(subject, JSON.stringify(doc, null, 2));
  const pages = pinReview(buildGraph(loadPublic(root)), { fake: { from, to } });
  assert.deepEqual(pages.map((p) => p.file), ["vendor/fake/a.js"], "only changed files are reviewed");
  const byClaim = Object.fromEntries(pages[0].evidence.map((e) => [e.where.match(/:(\w+) /)[1], e.state]));
  assert.deepEqual(byClaim, { gone: "broken", near: "in-change", far: "untouched", current: "broken" });
});

test("the command line reads the report named as its first argument", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kb-drift-cli-"));
  const report = path.join(dir, "report.json");
  fs.writeFileSync(report, JSON.stringify({ pages: [{ file: "nothing.json", status: "unchanged" }] }));
  for (const args of [[report], [report, "--json"], ["--json", report]]) {
    const out = execFileSync(process.execPath, [path.join(ROOT, "scripts/kb-drift.mjs"), ...args], { encoding: "utf8" });
    assert.match(out, args.includes("--json") ? /^\[\]\n$/ : /^# Help capture drift\n/);
  }
  fs.rmSync(dir, { recursive: true, force: true });
});

test("entries to read are grouped by subject across reviews; untouched ones are left out", () => {
  const pages = [
    { file: "page.json", evidence: [
      { subject: "zia.a:one", where: "zia.a:one evidence[0]", state: "broken", errors: ["quote not found"] },
      { subject: "zia.b:two", where: "zia.b:two evidence[0]", state: "untouched" },
      { subject: "zia/web-log#urlcat", where: "zia/web-log#urlcat evidence[0]", state: "in-change" },
    ] },
    { file: "vendor/fake/a.go", evidence: [{ subject: "zia.a:three", where: "zia.a:three evidence[1]", state: "in-change" }] },
  ];
  assert.deepEqual(bySubject(pages), [
    { subject: "zia.a", entries: [
      { file: "page.json", state: "broken", where: "zia.a:one evidence[0]", errors: ["quote not found"] },
      { file: "vendor/fake/a.go", state: "in-change", where: "zia.a:three evidence[1]" },
    ] },
    { subject: "zia/web-log", entries: [{ file: "page.json", state: "in-change", where: "zia/web-log#urlcat evidence[0]" }] },
  ]);
});

test("a name a changed page replaced is found, with the subjects whose own wording still uses it", () => {
  const diff = (old, now) => `--- old\n+++ new\n@@ -1 +1 @@\n-${old}\n+${now}\n`;
  const report = { pages: [
    { file: "a.json", status: "drift", diff: diff("Public Service Edges for Internet & SaaS (ZIA) forward it.", "Public Service Edges for Internet Access (ZIA) forward it.") },
    { file: "b.json", status: "drift", diff: diff("Go to the Rules tab.", "Select the Rules tab.") },
    { file: "c.json", status: "drift", diff: diff("There is one golden restore point.", "There is one Golden Restore Point.") },
  ] };
  assert.deepEqual(renames(report).map((r) => [r.from, r.to, r.files]), [["Internet & SaaS", "Internet Access", ["a.json"]]], "instruction edits and case changes are not renames");
  const root = repo({
    "references/_meta/sources.json": { schema_version: 1, sources: {} },
    "references/zia/zia.example.json": { schema_version: 1, id: "zia.example", title: "Internet & SaaS forwarding", claims: {} },
    "references/zia/zia.other.json": { schema_version: 1, id: "zia.other", title: "Internet Access forwarding", claims: {} },
  });
  const [r] = renameSweep(buildGraph(loadPublic(root)), renames(report));
  assert.deepEqual(r.subjects, ["zia.example"]);
});
