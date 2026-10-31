import assert from "node:assert/strict";
import test from "node:test";
import { counts, prBody } from "./kb-refresh.mjs";

const page = (file, diffLines = 3) => ({
  file,
  status: "drift",
  from: "1",
  to: "2",
  diff: Array.from({ length: diffLines }, (_, i) => `+line ${i}`).join("\n"),
  evidence: [
    { subject: "zia.example", where: `zia.example:${file} evidence[0]`, state: "broken", errors: ["quote not found"] },
    { subject: "zia.example", where: `zia.example:${file} evidence[1]`, state: "untouched" },
  ],
});

test("counts evidence by state and changed files", () => {
  assert.deepEqual(counts([page("a.json"), { file: "b.json", status: "gone", evidence: [{ subject: "x", where: "x", state: "gone" }] }]), {
    files: 1, broken: 1, "in-change": 0, untouched: 1, gone: 1, unavailable: 0,
  });
});

test("a review that fits is shown whole, diffs included; an empty one says nothing changed", () => {
  const body = prBody([{ title: "Help capture drift", pages: [page("a.json")] }, { title: "GitHub issue drift", pages: [] }]);
  assert.match(body, /## Help capture drift/);
  assert.match(body, /## a\.json \(revision 1 -> 2\)/);
  assert.match(body, /```diff\n\+line 0/);
  assert.match(body, /## GitHub issue drift\n\nNothing changed\./);
  assert.doesNotMatch(body, /Not shown/);
});

test("a review over the limit drops diffs, then pages, and names what it cut", () => {
  const pages = Array.from({ length: 40 }, (_, i) => page(`p${i}.json`, 400));
  const body = prBody([{ title: "Help capture drift", pages }], 6000);
  assert.ok(body.length <= 6000, `body is ${body.length} characters`);
  assert.doesNotMatch(body, /```diff/);
  assert.match(body, /40 changed; evidence: 40 broken/);
  assert.match(body, /### p0\.json/);
  assert.match(body, /## Not shown\n\n- Help capture drift: \d+ file\(s\) not shown \(p\d+\.json/);
});

test("the queue note names the pages to capture and the tools to use, and is empty for an empty queue", async () => {
  const { queueNote } = await import("./kb-refresh.mjs");
  assert.equal(queueNote([]), "");
  const note = queueNote([{ url: "https://help.zscaler.com/zia/x", linking_files: 3, cited_linkers: 1 }]);
  assert.match(note, /^## Help pages linked but not captured$/m);
  assert.match(note, /^- https:\/\/help\.zscaler\.com\/zia\/x \(linked from 3 vendor file\(s\), 1 cited\)$/m);
  assert.match(note, /help_capture\.py alias/);
});
