import assert from "node:assert/strict";
import test from "node:test";
import { buildPrompt, checkDecision, counterpart, overlap, reportMarkdown, similarLines } from "./kb-reanchor.mjs";

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
  const broken = [{ quote: "old quote text", newText: "alpha beta gamma delta. alpha beta gamma delta. one unique sentence here.", evidence: {} }];
  assert.equal(checkDecision({ quote: 1, action: "replace", new_quote: "one unique sentence here." }, broken).verdict, "valid");
  assert.equal(checkDecision({ quote: 1, action: "replace", new_quote: "alpha beta gamma delta." }, broken).verdict, "occurs twice");
  assert.equal(checkDecision({ quote: 1, action: "replace", new_quote: "invented by the model" }, broken).verdict, "not in the page");
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
