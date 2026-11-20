import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { editClass } from "./kb-reanchor-diff.mjs";
import { checkPrompt, checkStatement, diffable, entryItems, heldFor, holdDivergences, laterCommits, LEFT, lineSpans, plain, proposeAll, reportMarkdown, STAYS_BROKEN, summary } from "./kb-reanchor.mjs";

/** A page capture's text and line spans, from its captureText. */
const page = (shown) => ({ text: plain(shown), spans: lineSpans(shown, plain(shown)) });
/** One evidence entry's broken items, from its page before and after (and any later versions), as the worklist builds them. */
function brokenOf(ev, oldShown, newShown, later = []) {
  const o = page(oldShown);
  const n = page(newShown);
  return entryItems(ev, { norm: plain, oldText: o.text, newText: n.text, oldSpans: o.spans, newSpans: n.spans, olds: [o, ...later.map(page)], page: "p.json", ei: 0 }).broken;
}
const one = (ev, oldShown, newShown, later) => proposeAll(brokenOf(ev, oldShown, newShown, later))[0];

const OLD = [
  "# Configuring Rules",
  "## Before You Begin",
  "You must have the Administrator role to configure rules.",
  "## Configuring a Rule",
  "- 1. Go to Policy > Rules.",
  "- 2. Click Add Rule.",
  "- 3. Define the rule:",
  "  - Rule Order: Rules are evaluated in ascending order.",
  "  - Rule Name: Enter a unique name for the rule.",
  "## Limits",
  "You can add up to 256 rules per tenant.",
].join("\n");

test("a change of spacing, case or punctuation is a format repair, written without asking the model", async () => {
  const NEW = OLD.replace("Rules are evaluated in ascending order.", "Rules are evaluated in ascending order");
  const d = one({ quotes: ["Rules are evaluated in ascending order."] }, OLD, NEW);
  assert.deepEqual([d.action, d.verdict, d.edit, d.new_quote], ["replace", "valid", "format", "Rules are evaluated in ascending order"]);
  let asked = 0;
  assert.equal(await checkStatement("s", [], [d], async () => asked++), undefined);
  assert.equal(asked, 0);
});

test("a change of articles only is a function repair; any other word, number or sign is content", () => {
  assert.equal(editClass("Enter a unique name for the rule.", "Enter the unique name for the rule.").cls, "function");
  assert.equal(editClass("Windows-10 devices", "Windows 10 devices").cls, "format", "a hyphen joined to a word is not a minus");
  // The independent review's cases: each would change what a statement says, so none is written without the check.
  for (const [a, b] of [
    ["Requires ZCC 4.2+ on Windows.", "Requires ZCC 4.2 on Windows."],
    ["Set the timeout to -1 to disable it.", "Set the timeout to 1 to disable it."],
    ["at most < 100 rules", "at most > 100 rules"],
    ["up to 50% of traffic", "up to 50 of traffic"],
    ["version 1.5", "version 15"],
    ["version 1.10", "version 11.0"],
    ["Requires a SAML or SCIM token", "Requires a SAML and SCIM token"],
    ["forwarded from the PSE to the App Connector", "forwarded to the PSE from the App Connector"],
    ["Admins can delete rules", "Admins delete rules"],
    ["The service checks the rule", "The service checked the rule"],
    ["You can add up to 256 rules", "You can add up to 512 rules"],
    ["Rules are evaluated", "Rules are not evaluated"],
  ]) assert.equal(editClass(a, b).cls, "content", `${a} -> ${b}`);
  const NEW = OLD.replace("Enter a unique name for the rule.", "Enter the unique name for the rule.");
  const d = one({ quotes: ["Rule Name: Enter a unique name for the rule."] }, OLD, NEW);
  assert.deepEqual([d.action, d.verdict, d.edit, d.new_quote], ["replace", "valid", "function", "Rule Name: Enter the unique name for the rule."]);
});

test("a content change is written only when the model says the statement still holds as written", async () => {
  const NEW = OLD.replace("up to 256 rules per tenant", "up to 512 rules per tenant");
  const d = one({ quotes: ["You can add up to 256 rules per tenant."] }, OLD, NEW);
  assert.deepEqual([d.verdict, d.edit, d.new_quote], ["valid", "content", "You can add up to 512 rules per tenant."]);
  const statement = "A tenant can have at most 256 rules.";
  const prompts = [];
  const model = (holds) => async (messages, system) => {
    prompts.push({ messages, system });
    return { json: { holds, why: "the limit changed" } };
  };
  const no = await checkStatement(statement, [{ page: "x.json", quote: "Other quote." }], [d], model("no"));
  assert.deepEqual(no, { holds: "no", why: "the limit changed" });
  assert.equal(heldFor({ decisions: [d], check: no }, false), "statement");
  assert.equal(heldFor({ decisions: [d], check: no }, true), undefined, "a reviewed run is applied as it is");
  const yes = await checkStatement(statement, [], [d], model("yes"));
  assert.equal(heldFor({ decisions: [d], check: yes }, false), undefined);
  // The model is shown the statement, the old and new text of the quote, and the quotes that stay, never asked for a quote.
  const p = prompts[0].messages[0].content;
  assert.match(p, /Statement: A tenant can have at most 256 rules\./);
  assert.match(p, /1\. OLD: You can add up to 256 rules per tenant\.\n {3}NEW: You can add up to 512 rules per tenant\./);
  assert.match(p, /- Other quote\./);
  assert.match(prompts[0].system, /still holds/);
  // No model, an answer that is neither yes nor no, or a failed call: held, with the reason.
  assert.equal(heldFor({ decisions: [d], check: await checkStatement(statement, [], [d], null) }, false), "statement");
  assert.equal((await checkStatement(statement, [], [d], model("maybe"))).holds, null);
  const failed = await checkStatement(statement, [], [d], async () => {
    throw new Error("HTTP 503");
  });
  assert.deepEqual([failed.holds, /HTTP 503/.test(failed.why)], [null, true]);
});

test("the check asks about every quote repair of the statement, and only about repairs that will be written", async () => {
  const NEW = OLD.replace("ascending order.", "ascending order").replace("up to 256 rules", "up to 512 rules");
  const ds = proposeAll(brokenOf({ quotes: ["Rules are evaluated in ascending order.", "You can add up to 256 rules per tenant."] }, OLD, NEW));
  assert.deepEqual(ds.map((d) => [d.verdict, d.edit]), [["valid", "format"], ["valid", "content"]]);
  const p = checkPrompt("s", ds, []);
  assert.match(p, /1\. OLD: Rules are evaluated/);
  assert.match(p, /2\. OLD: You can add up to 256/);
  // A content repair that is not written (its entry stays broken) asks nothing.
  assert.equal(await checkStatement("s", [], [{ ...ds[1], verdict: STAYS_BROKEN }], async () => ({ json: { holds: "no" } })), undefined);
});

test("a quote whose sentence was rewritten past recognition, or removed, has no counterpart and is left for a person", () => {
  const NEW = OLD.replace("You must have the Administrator role to configure rules.", "Only users with full access may change policy.");
  const d = one({ quotes: ["You must have the Administrator role to configure rules."] }, OLD, NEW);
  assert.deepEqual([d.action, d.verdict], ["none", LEFT]);
  assert.match(d.reason, /nothing on the new page is like the old sentence/);
  const s = summary([{ id: "a", decisions: [d] }]);
  assert.deepEqual([s.left, s.rejected, s.unsupported], [1, 0, 0], "no counterpart is neither a rejection nor a claim the source no longer supports");
  assert.match(reportMarkdown([{ id: "a", statement: "x", decisions: [d] }]), /1 quote\(s\) with no counterpart on the new page/);
});

test("a no-counterpart quote is listed with the page's most similar sentences", () => {
  const NEW = OLD.replace("## Limits\nYou can add up to 256 rules per tenant.", "## Quotas\nPer tenant, 256 rules is the most you can add.");
  const d = one({ quotes: ["You can add up to 256 rules per tenant."] }, OLD, NEW);
  assert.equal(d.verdict, LEFT);
  assert.ok(d.similar?.some((s) => s.endsWith("Per tenant, 256 rules is the most you can add.")), JSON.stringify(d.similar));
  assert.match(reportMarkdown([{ id: "a", statement: "x", decisions: [d] }]), /- \*\*left for a person\*\* \(no counterpart\): nothing on the new page[^\n]*\n {2}- was: "You can add up to 256 rules per tenant\."\n {2}- similar: "## Quotas Per tenant, 256 rules/);
});

test("a quote that is unchanged but repeated now is anchored after its own heading, not the line above or the title", () => {
  const NEW = OLD.replace("## Limits", "## Rule Templates\n- Rule Order: Rules are evaluated in ascending order.\n## Limits");
  const ev = { quotes: ["Rule Order: Rules are evaluated in ascending order."] };
  const d = one(ev, OLD, NEW);
  assert.equal(d.action, "anchor");
  assert.equal(d.verdict, "valid");
  assert.equal(d.after, "- 3. Define the rule:", "the list item it is nested under, which occurs once");
  assert.equal(d.edit, "unchanged");
});

test("a reworded context anchor follows its line, and a content change to it goes to the check", async () => {
  const NEW = OLD.replace("- 3. Define the rule:", "- 3. Define the rule settings:");
  const d = one({ after: "- 3. Define the rule:", quotes: ["Rules are evaluated in ascending order."] }, OLD, NEW);
  assert.deepEqual([d.action, d.verdict, d.new_quote, d.edit], ["replace", "valid", "- 3. Define the rule settings:", "content"]);
  assert.ok(d.anchor);
  // The anchor scopes its entry (an OS's or a version's section): a change to it is the statement's to confirm.
  const ZCC = "## Setup\nFor ZCC 4.2 and later on Windows:\n- Enable the service.\n## Other\nFor macOS:\n- Enable the service.";
  const a = one({ after: "For ZCC 4.2 and later on Windows:", quotes: ["Enable the service."] }, ZCC, ZCC.replace("4.2", "4.6"));
  assert.deepEqual([a.verdict, a.edit, a.new_quote], ["valid", "content", "For ZCC 4.6 and later on Windows:"]);
  let prompt;
  const check = await checkStatement("On Windows, ZCC 4.2 and later enable the service.", [], [a], async (m) => {
    prompt = m[0].content;
    return { json: { holds: "no", why: "4.6" } };
  });
  assert.equal(heldFor({ decisions: [a], check }, false), "statement");
  assert.match(prompt, /1\. OLD \(the line its quotes are under\): For ZCC 4\.2 and later on Windows:\n {3}NEW: For ZCC 4\.6/);
});

test("a quote's line split into two sentences gives a quote over both", () => {
  const NEW = OLD.replace("Rule Order: Rules are evaluated in ascending order.", "Rule Order: Rules are evaluated in order. The order is ascending.");
  const d = one({ quotes: ["Rule Order: Rules are evaluated in ascending order."] }, OLD, NEW);
  assert.deepEqual([d.verdict, d.new_quote], ["valid", "Rule Order: Rules are evaluated in order. The order is ascending."]);
});

test("a repaired quote never takes in its neighbouring list item", () => {
  // The #354 job joined two items ("...for the rule. - Rule Order: ..."); the diff carves within the line it maps to.
  const NEW = OLD.replace("  - Rule Order: Rules are evaluated in ascending order.\n", "  - Rule Order: All rules are evaluated in ascending order.\n");
  const d = one({ quotes: ["Rule Order: Rules are evaluated in ascending order."] }, OLD, NEW);
  assert.deepEqual([d.verdict, d.new_quote], ["valid", "Rule Order: All rules are evaluated in ascending order."]);
});

test("a quote an earlier repair took from a later version of the page is found in that version", () => {
  const MID = OLD.replace("Click Add Rule.", "Click Add.");
  const NEW = MID.replace("Click Add.", "Click Add New.");
  const ev = { quotes: ["2. Click Add."] };
  assert.equal(one(ev, OLD, NEW).verdict, LEFT, "not in the base page");
  const d = one(ev, OLD, NEW, [MID]);
  assert.deepEqual([d.verdict, d.new_quote], ["valid", "2. Click Add New."]);
});

test("only a statement whose broken quotes are all on page captures is repaired from the diff", () => {
  const NEW = OLD.replace("ascending order.", "ascending order");
  const broken = brokenOf({ quotes: ["Rules are evaluated in ascending order."] }, OLD, NEW);
  assert.equal(diffable(broken), true);
  assert.equal(diffable([...broken, { ...broken[0], pinned: true }]), false, "a pinned file needs the model");
  assert.equal(diffable([{ ...broken[0], entry: { ...broken[0].entry, newSpans: null } }]), false, "a capture that is not a page has no lines to align");
});

test("when one position of a divergence is left for a person, its other positions are held with it", () => {
  const results = [
    { id: "d", position: 0, decisions: [{ verdict: "valid", edit: "format" }] },
    { id: "d", position: 1, decisions: [{ verdict: "valid", edit: "content" }], check: { holds: "no", why: "changed" } },
    { id: "c", decisions: [{ verdict: "valid", edit: "format" }] },
  ];
  holdDivergences(results);
  assert.deepEqual(results.map((r) => heldFor(r, false)), ["divergence", "statement", undefined]);
  assert.match(reportMarkdown(results), /Held because another position of this divergence is left for a person\./);
  assert.equal(heldFor(results[0], true), undefined, "a reviewed run is applied as it is");
  // A position that failed, or has a quote not repaired, holds its siblings too: the gate stays red on it either way.
  for (const other of [{ error: "needs a model", decisions: [] }, { decisions: [{ verdict: LEFT }] }, { decisions: [{ verdict: STAYS_BROKEN }] }]) {
    const rs = [{ id: "e", position: 0, decisions: [{ verdict: "valid", edit: "format" }] }, { id: "e", position: 1, ...other }];
    holdDivergences(rs);
    assert.equal(heldFor(rs[0], false), "divergence", JSON.stringify(other));
  }
});

test("a page's later versions are the commits since the base that changed it, newest first", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "reanchor-history-"));
  const git = (...args) => execFileSync("git", ["-C", dir, "-c", "user.name=t", "-c", "user.email=t@example.com", ...args], { encoding: "utf8" }).trim();
  git("init", "-q");
  const commit = (body, file = "p.json") => {
    fs.writeFileSync(path.join(dir, file), body);
    git("add", "-A");
    git("commit", "-q", "-m", body);
    return git("rev-parse", "HEAD");
  };
  const base = commit("v0");
  const v1 = commit("v1");
  commit("other", "q.json");
  const v2 = commit("v2");
  assert.deepEqual(laterCommits(dir, base, "p.json"), [v2, v1]);
  assert.deepEqual(laterCommits(dir, "no-such-ref", "p.json"), [], "a base git cannot find gives no later versions, not an error");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("a context anchor whose line is gone gets the heading above, and that stand-in goes to the check", async () => {
  const PAGE = "# Page\n## Windows\nFor ZCC 4.2 and later:\n- Enable the service.\n## macOS\nFor macOS:\n- Enable the service.";
  const d = one({ after: "For ZCC 4.2 and later:", quotes: ["Enable the service."] }, PAGE, PAGE.replace("For ZCC 4.2 and later:\n", ""));
  assert.deepEqual([d.verdict, d.edit, d.new_quote], ["valid", "structure", "## Windows"]);
  assert.match(d.reason, /its line is gone/);
  assert.equal(heldFor({ decisions: [d], check: await checkStatement("s", [], [d], null) }, false), "statement");
});
