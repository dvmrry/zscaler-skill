import assert from "node:assert/strict";
import test from "node:test";
import { normalizeWs } from "./kb-lib.mjs";
import { applyDecisions, buildPrompt, checkAll, checkDecision, counterpart, overlap, plain, replay, reportMarkdown, similarLines } from "./kb-reanchor.mjs";

const OLD = "## Details\nIntro text here.\nDetails: Clicking the Details icon opens a window with Overview and Prompt Details.\nClosing line.";
const NEW = "## Details\nIntro text here.\nDetails: Clicking the Details icon opens a window with Overview and Prompt/File Details.\nClosing line.";

test("a reworded quote's counterpart is the same part of the new page, and the old passage marks the quote", () => {
  const quote = "Details: Clicking the Details icon opens a window with Overview and Prompt Details.";
  const c = counterpart(OLD, NEW, quote);
  assert.match(c.old, /⟦Details: Clicking[^⟧]*Prompt Details\.⟧/);
  assert.match(c.near, /Prompt\/File Details\./);
  assert.equal(counterpart(OLD, NEW, "not in the old page"), null);
});

test("a passage that moved is found by its most similar lines", () => {
  const moved = "Unrelated first line.\nAnother.\nThe service views email addresses from the added domains as trusted, internal users for Exchange.";
  const lines = similarLines(moved, "The service views any email addresses from the added domains as trusted, internal users for Gmail.");
  assert.deepEqual(lines, ["The service views email addresses from the added domains as trusted, internal users for Exchange."]);
  assert.ok(overlap("a b c d", "a b") === 0.5);
});

test("a decision is valid only with a new quote that occurs exactly once in the new page", () => {
  const broken = [{ quote: "old quote text", newText: "alpha beta gamma delta. alpha beta gamma delta. one unique sentence here.", norm: plain, evidence: { quotes: ["old quote text"] } }];
  assert.equal(checkDecision({ quote: 1, action: "replace", new_quote: "one unique sentence here." }, broken).verdict, "valid");
  assert.equal(checkDecision({ quote: 1, action: "replace", new_quote: "alpha beta gamma delta." }, broken).verdict, "occurs twice");
  assert.equal(checkDecision({ quote: 1, action: "replace", new_quote: "invented by the model" }, broken).verdict, "not in the source");
  assert.equal(checkDecision({ quote: 1, action: "replace", new_quote: "short" }, broken).verdict, "bad length");
  assert.equal(checkDecision({ quote: 2, action: "replace", new_quote: "one unique sentence here." }, broken).verdict, "no such quote");
  assert.equal(checkDecision({ quote: 1, action: "unsupported" }, broken).verdict, "unsupported");
  assert.equal(checkDecision({ quote: 1, action: "delete it" }, broken).verdict, "unknown action");
});

test("the prompt carries the claim's other quotes, so a restatement keeps what they support", () => {
  const p = buildPrompt(
    { id: "zia.dlp.index-tool:login", statement: "The EDM and IDM articles say ..." },
    [{ page: "idm.json", quote: "In the Indexed Document Match Templates dashboard" }],
    [{ page: "edm.json", quote: "In the Exact Data Match Templates dashboard", old: "⟦In the Exact Data Match Templates dashboard⟧", near: "go to the Exact Data Match Templates dashboard", similar: [] }],
  );
  assert.match(p, /\(idm\.json\) "In the Indexed Document Match Templates dashboard"/);
  assert.match(p, /keep every part of it that the other quotes support/);
  assert.match(p, /Broken quote 1 \(page edm\.json\)/);
  assert.match(p, /"replace_and_restate"/);
});

test("the report lists each decision and a restated statement before and after", () => {
  const md = reportMarkdown([{ id: "a.b:c", statement: "Old.", restated: "New.", decisions: [{ action: "replace_and_restate", verdict: "valid", old: "x", new_quote: "y", reason: "renamed" }] }]);
  assert.match(md, /1 claim\(s\): 1 quote\(s\) re-anchored, 0 no longer supported/);
  assert.match(md, /Statement was: Old\.[\s\S]*Statement now: New\./);
});

test("in a pinned file, quotes under a context anchor need only follow it, and a moved anchor is re-anchored first", () => {
  const code = normalizeWs("func A() {\n  retry := 1\n}\nfunc B() {\n  retry := 1\n  return nil\n}");
  const ev = { after: "func Bold() {", quotes: ["retry := 1"] };
  const broken = [
    { anchor: true, quote: ev.after, newText: code, norm: normalizeWs, evidence: ev, pinned: true },
    { quote: "retry := 1", newText: code, norm: normalizeWs, evidence: ev, pinned: true, from: 0 },
  ];
  const checked = checkAll([{ quote: 2, action: "replace", new_quote: "retry := 1 return nil" }, { quote: 1, action: "replace", new_quote: "func B() {" }], broken);
  assert.deepEqual(checked.map((d) => d.verdict), ["valid", "valid"], "the quote is checked after the new anchor, where it occurs once");
  applyDecisions(checked);
  assert.deepEqual(ev, { after: "func B() {", quotes: ["retry := 1 return nil"] });
});

test("old_version pins a pinned file's evidence to the release it was quoted from, and wins over its other edits", () => {
  const ev = { quotes: ["github.com/zscaler/zscaler-sdk-go/v3 v3.8.56", "go 1.24"] };
  const broken = [
    { quote: ev.quotes[0], newText: "require github.com/zscaler/zscaler-sdk-go/v3 v3.8.58 go 1.25", norm: normalizeWs, evidence: ev, pinned: true, oldRef: "v4.4.14" },
    { quote: ev.quotes[1], newText: "require github.com/zscaler/zscaler-sdk-go/v3 v3.8.58 go 1.25", norm: normalizeWs, evidence: ev, pinned: true, oldRef: "v4.4.14" },
  ];
  const checked = checkAll([{ quote: 1, action: "old_version" }, { quote: 2, action: "replace", new_quote: "go 1.25" }], broken);
  assert.deepEqual(checked.map((d) => d.verdict), ["valid", "bad length"]);
  applyDecisions([checked[0], { ...checked[1], verdict: "valid", new_quote: "go 1.25 here" }]);
  assert.deepEqual(ev, { quotes: ["github.com/zscaler/zscaler-sdk-go/v3 v3.8.56", "go 1.24"], at: ["v4.4.14"] });
  assert.equal(checkDecision({ quote: 1, action: "old_version" }, [{ ...broken[0], pinned: false }]).verdict, "not a pinned file");
});

test("an entry checked at a release and HEAD keeps the release on old_version, and drops it on replace", () => {
  const kept = { at: ["v4.4.10", "HEAD"], quotes: ["old line of code"] };
  applyDecisions([{ verdict: "valid", action: "old_version", evidence: kept, pin: "v4.4.16" }]);
  assert.deepEqual(kept.at, ["v4.4.10"]);
  const moved = { at: ["v4.4.10", "HEAD"], quotes: ["old line of code"] };
  applyDecisions([{ verdict: "valid", action: "replace", evidence: moved, old: "old line of code", new_quote: "new line of code" }]);
  assert.deepEqual(moved, { quotes: ["new line of code"] });
});

test("a reviewed run replays onto its claims, and a decision whose old quote is gone is marked stale", () => {
  const ev = { quotes: ["old wording here", "kept wording"] };
  const g = { nodes: new Map([["a.b:c", { data: { statement: "S.", evidence: [{ quotes: ["other"] }, ev] } }]]) };
  const [r] = replay(g, [{ id: "a.b:c", decisions: [
    { action: "replace", verdict: "valid", ei: 1, old: "old wording here", new_quote: "new wording here" },
    { action: "replace", verdict: "valid", ei: 1, old: "already changed", new_quote: "x y z w v" },
  ] }]);
  assert.deepEqual(r.decisions.map((d) => d.verdict), ["valid", "stale"]);
  applyDecisions(r.decisions);
  assert.deepEqual(ev.quotes, ["new wording here", "kept wording"]);
  assert.equal(replay(g, [{ id: "no.such:claim", decisions: [] }])[0].error, "no such claim");
});
