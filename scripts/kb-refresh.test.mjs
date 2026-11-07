import assert from "node:assert/strict";
import test from "node:test";
import { captureName, counts, discoveryNote, discoveryPlan, MAX_NEW_PAGES, prBody, reportOk, sectionOf } from "./kb-refresh.mjs";

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

test("a check counts as run only when it printed its report, since a crash exits 1 like drift", () => {
  assert.ok(reportOk('{"pages": []}'));
  assert.ok(reportOk('{"source": "github-issues", "pages": [{"file": "x.json", "status": "unchanged"}]}'));
  assert.ok(!reportOk(""));
  assert.ok(!reportOk("Traceback (most recent call last):"));
  assert.ok(!reportOk('{"error": "x"}'));
});

const H = "https://help.zscaler.com";
const captures = [
  { file: "zia-about-url-filtering.json", urls: [`${H}/zia/about-url-filtering`, `${H}/zia/url-filtering-old`] },
  { file: "zpa-about-connectors.json", urls: [`${H}/zpa/about-connectors`] },
];
const report = (help = {}, automate = "none", vendor = []) => ({
  sources: {
    help: { changes: { candidates: help.changes ?? [] }, removals: { candidates: help.removals ?? [] } },
    automate: { captureRecommendation: automate },
    vendor: { changes: { candidates: vendor } },
  },
});

test("a page's section is its host and first path segment", () => {
  assert.equal(sectionOf(`${H}/zia/about-url-filtering`), "help.zscaler.com/zia");
  assert.equal(sectionOf("not a url"), null);
});

test("discovery's changes become checks of the captures they touch, by page or by alias", () => {
  const plan = discoveryPlan(captures, report({
    changes: [
      { url: `${H}/zia/url-filtering-old`, kind: "changed", field: "lastmod" },
      { url: `${H}/zpa/about-connectors`, kind: "changed-since", field: "lastmod" },
      { url: `${H}/zia/not-captured`, kind: "changed", field: "lastmod" },
    ],
    removals: [{ url: `${H}/zpa/about-connectors` }, { url: `${H}/zia/never-captured` }],
  }));
  assert.deepEqual(plan.check, ["zia-about-url-filtering.json", "zpa-about-connectors.json"]);
  assert.deepEqual(plan.capture, [], "a changed date on an uncaptured page is not a new page");
  assert.deepEqual(plan.removed, [{ url: `${H}/zpa/about-connectors`, file: "zpa-about-connectors.json" }, { url: `${H}/zia/never-captured`, file: null }]);
});

test("new pages are captured only in sections already captured, at most a run's worth", () => {
  const fresh = Array.from({ length: MAX_NEW_PAGES + 2 }, (_, i) => ({ url: `${H}/zia/new-${String(i).padStart(3, "0")}`, kind: "new", field: "url" }));
  const plan = discoveryPlan(captures, report({ changes: [...fresh, { url: `${H}/dspm/new-page`, kind: "new", field: "url" }] }));
  assert.equal(plan.capture.length, MAX_NEW_PAGES);
  assert.deepEqual(plan.deferred, [MAX_NEW_PAGES, MAX_NEW_PAGES + 1].map((i) => `${H}/zia/new-${String(i).padStart(3, "0")}`));
  assert.deepEqual(plan.elsewhere, [`${H}/dspm/new-page`]);
  assert.equal(plan.automate, false);
});

test("an Automate asset change asks for the recapture, and vendor releases are listed for the pull request", () => {
  const plan = discoveryPlan(captures, report({}, "full-capture", [{ path: "vendor/zscaler-sdk-go", field: "latest-release", current: "v3.9.0" }]));
  assert.equal(plan.automate, true);
  assert.deepEqual(plan.vendor, [{ path: "vendor/zscaler-sdk-go", field: "latest-release", current: "v3.9.0" }]);
  const note = discoveryNote(plan);
  assert.match(note, /Automate API reference changed/);
  assert.match(note, /`vendor\/zscaler-sdk-go` latest-release: v3\.9\.0/);
});

test("the discovery note lists captured pages as authoring work, and says when nothing was found", () => {
  const plan = discoveryPlan(captures, report({ changes: [{ url: `${H}/zia/brand-new`, kind: "new", field: "url" }] }));
  assert.match(discoveryNote(plan, [{ url: `${H}/zia/brand-new`, result: "wrote zia-brand-new.json" }]), /Captured 1 new help page[\s\S]*brand-new -> `wrote zia-brand-new\.json`/);
  assert.match(discoveryNote(discoveryPlan(captures, report())), /Nothing new/);
});

test("a new page's capture file is named for its section, so one slug in two sections does not collide", () => {
  assert.equal(captureName(`${H}/secure-ai-users/managing-inbound-integrations`), "secure-ai-users-managing-inbound-integrations.json");
  assert.equal(captureName(`${H}/secure-ai-apps-infra/managing-inbound-integrations`), "secure-ai-apps-infra-managing-inbound-integrations.json");
  assert.equal(captureName(`${H}/zia/zia-release-notes`), "zia-release-notes.json");
});
