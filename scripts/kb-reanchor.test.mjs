import assert from "node:assert/strict";
import test from "node:test";
import { anchorIn, normalizeWs } from "./kb-lib.mjs";
import {
  applyDecisions, applyResult, buildPrompt, checkAll, checkDecision, counterpart, decide, entryItems, mismatch, overlap, plain, replay,
  reportMarkdown, resolveEntry, restatement, resultsJson, retryPrompt, similarLines,
} from "./kb-reanchor.mjs";

const OLD = "## Details\nIntro text here.\nDetails: Clicking the Details icon opens a window with Overview and Prompt Details.\nClosing line.";
const NEW = "## Details\nIntro text here.\nDetails: Clicking the Details icon opens a window with Overview and Prompt/File Details.\nClosing line.";

/** One evidence entry's broken items, from its page before and after, as the worklist builds them. */
const items = (ev, oldText, newText, t = {}) => entryItems(ev, { norm: plain, oldText: oldText === null ? null : plain(oldText), newText: plain(newText), page: "p.json", ei: 0, ...t });

test("a reworded quote's counterpart is the same part of the new page, and the old passage marks the quote", () => {
  const quote = "Details: Clicking the Details icon opens a window with Overview and Prompt Details.";
  const c = counterpart(OLD, NEW, quote);
  assert.match(c.old, /⟦Details: Clicking[^⟧]*Prompt Details\.⟧/);
  assert.match(c.near, /Prompt\/File Details\./);
  assert.equal(counterpart(OLD, NEW, "not in the old page"), null);
});

test("a passage that moved is found by its most similar sentences, though the page text is one line", () => {
  const moved = plain("Unrelated first line.\nAnother.\nThe service views email addresses from the added domains as trusted, internal users for Exchange.");
  const lines = similarLines(moved, "The service views any email addresses from the added domains as trusted, internal users for Gmail.");
  assert.deepEqual(lines, ["The service views email addresses from the added domains as trusted, internal users for Exchange."]);
  assert.ok(overlap("a b c d", "a b") === 0.5);
});

test("a new quote must be an exact copy that occurs once, and each quote gets one decision", () => {
  const ev = { quotes: ["old quote text here."] };
  const { broken } = items(ev, "alpha. old quote text here.", "alpha beta gamma delta. alpha beta gamma delta. one unique sentence here.");
  const verdict = (d) => checkAll([d], broken)[0].verdict;
  assert.equal(verdict({ quote: 1, action: "replace", new_quote: "one unique sentence here." }), "valid");
  assert.equal(verdict({ quote: "1", action: "replace", new_quote: "one unique sentence here." }), "valid", "a quote number may come as a string");
  assert.equal(verdict({ quote: 1, action: "replace", new_quote: "alpha beta gamma delta." }), "occurs twice");
  assert.equal(verdict({ quote: 1, action: "replace", new_quote: "invented by the model" }), "not in the source");
  assert.equal(verdict({ quote: 1, action: "replace", new_quote: "short" }), "bad length");
  assert.equal(verdict({ quote: 2, action: "replace", new_quote: "one unique sentence here." }), "no such quote");
  assert.equal(verdict({ quote: 1, action: "unsupported" }), "unsupported");
  assert.equal(verdict({ quote: 1, action: "delete it" }), "unknown action");
  const twice = checkAll([{ quote: 1, action: "replace", new_quote: "one unique sentence here." }, { quote: "1", action: "unsupported" }], broken);
  assert.deepEqual(twice.map((c) => c.verdict), ["valid", "two decisions for one quote"]);
  assert.match(checkDecision({ quote: 1, action: "replace", new_quote: "one unique sentence there." }, broken).detail, /has "one unique sentence " but not what follows it, "there\."/);
});

test("the prompt carries the claim's other quotes, so a restatement keeps what they support", () => {
  const p = buildPrompt(
    { id: "zia.dlp.index-tool:login", statement: "The EDM and IDM articles say ..." },
    [{ page: "idm.json", quote: "In the Indexed Document Match Templates dashboard" }],
    [{ page: "edm.json", quote: "In the Exact Data Match Templates dashboard", old: "⟦In the Exact Data Match Templates dashboard⟧", near: "go to the Exact Data Match Templates dashboard", similar: [], places: [] }],
  );
  assert.match(p, /\(idm\.json\) "In the Indexed Document Match Templates dashboard"/);
  assert.match(p, /keep every part of it that the other quotes support/);
  assert.match(p, /Broken quote 1 \(page edm\.json\)/);
  assert.match(p, /It no longer appears\. NEW text at the same place: go to the Exact/);
  assert.match(p, /"replace_and_restate"/);
  assert.doesNotMatch(p, /"anchor"/, "the anchor action is offered only for a repeated quote");
});

test("the report lists each decision and a restated statement before and after", () => {
  const md = reportMarkdown([{ id: "a.b:c", statement: "Old.", restated: "New.", decisions: [{ action: "replace_and_restate", verdict: "valid", old: "x", new_quote: "y", reason: "renamed" }] }]);
  assert.match(md, /1 statement\(s\): 1 quote\(s\) re-anchored, 0 of them to check, 0 no longer supported/);
  assert.match(md, /Statement was: Old\.[\s\S]*Statement now: New\./);
});

test("in a pinned file, a moved context anchor is re-anchored, and the quotes under it need only follow it", () => {
  const oldCode = "func A() {\n  retry := 1\n}\nfunc Bold() {\n  retry := 1\n}";
  const newCode = "func A() {\n  retry := 1\n}\nfunc B() {\n  retry := 1\n  return nil\n}";
  const ev = { after: "func Bold() {", quotes: ["retry := 1"] };
  const { broken } = entryItems(ev, { norm: normalizeWs, oldText: normalizeWs(oldCode), newText: normalizeWs(newCode), pinned: true, page: "x.go", ei: 0 });
  assert.deepEqual(broken.map((b) => [b.anchor, b.why]), [[true, "missing"]], "the quote is found once the anchor is not");
  const checked = checkAll([{ quote: 1, action: "replace", new_quote: "func B() {" }], broken);
  assert.deepEqual(checked.map((d) => d.verdict), ["valid"]);
  applyDecisions(checked);
  assert.deepEqual(ev, { after: "func B() {", quotes: ["retry := 1"] });
});

test("old_version pins a pinned file's evidence to the release it was quoted from, and wins over its other edits", () => {
  const ev = { quotes: ["github.com/zscaler/zscaler-sdk-go/v3 v3.8.56", "go 1.24"] };
  const { broken } = entryItems(ev, {
    norm: normalizeWs, oldText: "require github.com/zscaler/zscaler-sdk-go/v3 v3.8.56 go 1.24", newText: "require github.com/zscaler/zscaler-sdk-go/v3 v3.8.58 go 1.25",
    pinned: true, oldRef: "v4.4.14", page: "go.mod", ei: 0,
  });
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

test("the entry check resolves quotes as the gate does", () => {
  const text = plain("Intro. ## Windows A quote. Shared line. ## macOS Shared line. Last.");
  for (const entry of [
    { quotes: ["A quote."] },
    { quotes: ["Shared line."] },
    { quotes: ["Shared line.", "A quote."], after: "## macOS" },
    { quotes: ["A quote."], after: "## macOS" },
    { quotes: ["A quote."], after: "## Linux" },
    { quotes: ["Shared line."], after: "Shared line." },
    { quotes: ["**A quote.**"] },
  ]) {
    const mine = resolveEntry(text, plain, entry);
    const gate = anchorIn(text, entry, "t", { emphasis: true });
    assert.equal(!mine.anchorError && mine.quotes.every((q) => !q.code), gate.errors.length === 0, JSON.stringify(entry));
  }
});

// A page that now repeats its items for a second OS, as the Client Connector troubleshooting pages did.
const WIN_OLD = "This article lists the page's features on different OSs: - Windows - The page includes the following features on Windows devices: - Restart Service: Click Restart to restart the app. - Repair App: Click Repair to reinstall the drivers. - Clear Logs: Click Clear.";
const REPEATED = `${WIN_OLD} - macOS - The page includes the following features on macOS devices: - Restart Service: Click Restart to restart the app. - Clear Logs: Click Clear.`;
const RESTART = "Restart Service: Click Restart to restart the app.";

test("a quote that now occurs twice is shown with every place it occurs, and the anchor action is offered", () => {
  const { broken } = items({ quotes: [RESTART] }, WIN_OLD, REPEATED);
  assert.deepEqual(broken.map((b) => [b.why, b.count]), [["repeated", 2]]);
  const p = buildPrompt({ id: "zcc.x:restart", statement: "On Windows, Restart Service restarts the app." }, [], broken);
  assert.match(p, /It still appears in the NEW text, but 2 times/);
  assert.match(p, /\[1\] .*Windows devices: - ⟦Restart Service/);
  assert.match(p, /\[2\] .*macOS devices: - ⟦Restart Service/);
  assert.match(p, /"anchor": the quote is unchanged/);
  assert.match(buildPrompt({ id: "d.x:y positions[1]", statement: "Says.", context: "The pages disagree." }, [], broken), /Divergence position: d\.x:y positions\[1\]\nWhat the sources disagree on: The pages disagree\./);
});

test("an anchor picks a repeated quote's place, and only when every quote of its entry that anchors still follows it", () => {
  const ev = { quotes: [RESTART, "Repair App: Click Repair to reinstall the drivers."] };
  const { broken } = items(ev, WIN_OLD, REPEATED);
  assert.equal(broken.length, 1, "Repair App is only in the Windows section, so it still anchors");
  const [ok] = checkAll([{ quote: 1, action: "anchor", after: "features on Windows devices:" }], broken);
  assert.equal(ok.verdict, "valid");
  assert.equal(ok.review, undefined, "its surroundings, the Windows heading and Repair App, are on the page once: safe");
  const [late] = checkAll([{ quote: 1, action: "anchor", after: "features on macOS devices:" }], broken);
  assert.equal(late.verdict, "another part of the page", "the macOS copy is not where the old Windows-only page had it");
  assert.match(late.detail, /it is not where the old quote was, between "The page includes the following features on Windows devices:" and "- Repair App/);
  assert.equal(checkDecision({ quote: 1, action: "anchor", after: "The page includes the following features" }, broken).verdict, "anchor occurs twice");
  const missing = checkDecision({ quote: 1, action: "anchor", after: "features on Linux devices:" }, broken);
  assert.equal(missing.verdict, "anchor not in the source");
  assert.match(missing.detail, /the NEW text has "features on " but not what follows it, "Linux/);
  assert.equal(checkDecision({ quote: 1, action: "anchor" }, broken).verdict, "no anchor");
  applyDecisions([ok]);
  assert.deepEqual(ev, { quotes: [RESTART, "Repair App: Click Repair to reinstall the drivers."], after: "features on Windows devices:" });
});

test("when a whole section is repeated, an anchor on the other OS's copy is left for a person", () => {
  const ev = { quotes: [RESTART, "Clear Logs: Click Clear."] };
  const { broken } = items(ev, WIN_OLD, REPEATED);
  assert.deepEqual(broken.map((b) => b.why), ["repeated", "repeated"], "no quote of the entry anchors, so no neighbour can vouch for a place");
  const pick = (after) => checkAll([{ quote: 1, action: "anchor", after }, { quote: 2, action: "anchor", after }], broken).map((c) => c.verdict);
  assert.deepEqual(pick("features on macOS devices:"), ["another part of the page", "another part of the page"]);
  assert.deepEqual(pick("features on Windows devices:"), ["valid", "valid"]);
  const [, clear] = checkAll([{ quote: 1, action: "anchor", after: "features on Windows devices:" }, { quote: 2, action: "anchor", after: "features on Windows devices:" }], broken);
  assert.match(clear.review, /only one side of the text that was around the old quote is still there/, "Clear Logs was last on the old page, and a page's end can move: a person checks it");
});

test("a copy inserted before the old section does not take its quotes", () => {
  // The old page had macOS only; the new one puts a Windows copy ahead of it.
  const MAC_OLD = "This article lists the page's features on different OSs: - macOS - The page includes the following features on macOS devices: - Restart Service: Click Restart to restart the app. - Clear Logs: Click Clear.";
  const ev = { quotes: [RESTART, "Clear Logs: Click Clear."] };
  const { broken } = items(ev, MAC_OLD, `${WIN_OLD} - macOS - The page includes the following features on macOS devices: - Restart Service: Click Restart to restart the app. - Clear Logs: Click Clear.`);
  const pick = (after) => checkAll([{ quote: 1, action: "anchor", after }, { quote: 2, action: "anchor", after }], broken).map((c) => c.verdict);
  assert.deepEqual(pick("features on macOS devices:"), ["valid", "valid"]);
  assert.deepEqual(pick("features on Windows devices:"), ["another part of the page", "another part of the page"]);
  const [restart] = checkAll([{ quote: 1, action: "anchor", after: "features on macOS devices:" }], broken);
  assert.equal(restart.review, undefined);
});

test("a single-quote repair from another OS's copy of a section is left for a person", () => {
  const old = "Intro for all. - Windows - On Windows devices: - Advanced Settings: Shows details. - Revert App: If your admin enabled revert, click to revert. - Disable Tamper Protection: Click it.";
  const now = "Intro for all. - Windows - On Windows devices: - Advanced Settings: Shows details. - Revert App: If your organization's admin enabled the revert option, click this option. - Disable Tamper Protection: Click it. - macOS - On macOS devices: - Revert App: If your organization's admin enabled revert, click Revert to go back.";
  const { broken } = items({ quotes: ["Revert App: If your admin enabled revert, click to revert."] }, old, now);
  const verdict = (q) => checkAll([{ quote: 1, action: "replace", new_quote: q }], broken)[0].verdict;
  assert.equal(verdict("Revert App: If your organization's admin enabled revert, click Revert to go back."), "another part of the page");
  assert.equal(verdict("Revert App: If your organization's admin enabled the revert option, click this option."), "valid");
  assert.equal(checkAll([{ quote: 1, action: "replace", new_quote: "Revert App: If your organization's admin enabled the revert option, click this option." }], broken)[0].review, undefined);
  // A repair that also quotes the unchanged sentence before it is still in its place.
  const longer = checkAll([{ quote: 1, action: "replace", new_quote: "Advanced Settings: Shows details. - Revert App: If your organization's admin enabled the revert option, click this option." }], broken)[0];
  assert.deepEqual([longer.verdict, longer.review], ["valid", undefined]);
});

test("a passage the vendor moved to another section may be quoted there, when nothing took its old place", () => {
  const old = "Templates page. - Legacy settings: - Show pop-ups by default. - Custom Timer: Enter a time between 5 and 60 seconds. - Persistent: Keep critical ones.";
  const moved = "Templates page. - Common settings: - Popup Duration: Enter the value from 5 to 60 to set the seconds pop-ups display. - Legacy settings: - Show pop-ups by default. - Persistent: Keep critical ones.";
  const { broken } = items({ quotes: ["Custom Timer: Enter a time between 5 and 60 seconds."] }, old, moved);
  const repaired = checkAll([{ quote: 1, action: "replace", new_quote: "Popup Duration: Enter the value from 5 to 60 to set the seconds pop-ups display." }], broken)[0];
  assert.equal(repaired.verdict, "valid");
  assert.match(repaired.review, /nothing is left where it was/, "a moved passage is applied, for a person to check");
  // Had new text taken the timer's place in the kept list, the repair would have to come from there.
  const replaced = moved.replace("- Persistent:", "- Sound: Choose a chime. - Persistent:");
  const { broken: b2 } = items({ quotes: ["Custom Timer: Enter a time between 5 and 60 seconds."] }, old, replaced);
  assert.equal(checkAll([{ quote: 1, action: "replace", new_quote: "Popup Duration: Enter the value from 5 to 60 to set the seconds pop-ups display." }], b2)[0].verdict, "another part of the page");
});

test("an anchor is not blamed for quotes it did not move, and a wrong anchor gives way to a right repair", () => {
  const androidOnly = "Android only: tap Restart to restart the app.";
  const old = `${WIN_OLD} - Android - ${androidOnly}`;
  const now = `${REPEATED} ${"Filler sentence for the macOS section. ".repeat(60)} - Android - ${androidOnly}`;
  const ev = { quotes: [RESTART, "Repair App: Click Repair to reinstall the drivers.", androidOnly] };
  const { broken } = items(ev, old, now);
  assert.deepEqual(broken.map((b) => b.why), ["repeated"], "Repair App and the Android sentence still anchor, far apart now");
  assert.equal(checkAll([{ quote: 1, action: "anchor", after: "features on Windows devices:" }], broken)[0].verdict, "valid");
  const two = { quotes: ["Repair App: Click Repair to reinstall all drivers.", RESTART] };
  const { broken: both } = items(two, WIN_OLD.replace("reinstall the drivers", "reinstall all drivers"), REPEATED);
  const checked = checkAll([
    { quote: 1, action: "replace", new_quote: "Repair App: Click Repair to reinstall the drivers." },
    { quote: 2, action: "anchor", after: "features on macOS devices:" },
  ], both);
  assert.deepEqual(checked.map((c) => c.verdict), ["valid", "another part of the page"]);
});

test("old_version supersedes the other edits of its evidence entry", () => {
  const ev = { quotes: ["v3.8.56 is pinned here", "go 1.24 is the toolchain"] };
  const { broken } = entryItems(ev, {
    norm: normalizeWs, oldText: "x v3.8.56 is pinned here y go 1.24 is the toolchain", newText: "x v3.8.58 is pinned here y go 1.25 is the toolchain",
    pinned: true, oldRef: "v4.4.14", page: "go.mod", ei: 0,
  });
  const checked = checkAll([{ quote: 1, action: "old_version" }, { quote: 2, action: "replace", new_quote: "go 1.25 is the toolchain" }], broken);
  assert.deepEqual(checked.map((c) => c.verdict), ["valid", "superseded"]);
});

test("a section at the old page's end does not give its place to a copy appended after it", () => {
  const old = "Intro. - Android - The page includes these features on Android devices: - Debug: Logs all activity. - Verbose: Logs when invoked by external events.";
  const now = `${old.replace("Logs when invoked by external events.", "Logs when external events invoke it.")} - ChromeOS - The page includes these features on ChromeOS devices: - Debug: Logs all activity. - Verbose: Logs when invoked by some external events.`;
  const { broken } = items({ quotes: ["Verbose: Logs when invoked by external events."] }, old, now);
  for (const q of ["Verbose: Logs when external events invoke it.", "Verbose: Logs when invoked by some external events."]) {
    const [c] = checkAll([{ quote: 1, action: "replace", new_quote: q }], broken);
    assert.equal(c.verdict, "valid");
    assert.match(c.review, /is on the page in 2 places/, "the Debug item before it is now on the page twice, and the page's end moved: never safe");
  }
});

test("a re-anchored context anchor that strands a quote which anchors now is rejected", () => {
  const ev = { after: "## Windows", quotes: ["Quote A is here.", "Quote B is here."] };
  const { broken } = items(ev, "## Windows Quote A is here. Quote B is here.", "## Windows devices section. Quote A is here. ## Windows devices section two. Quote B is here.");
  assert.deepEqual(broken.map((b) => [b.anchor, b.why]), [[true, "repeated"]]);
  const [c] = checkAll([{ quote: 1, action: "replace", new_quote: "## Windows devices section two." }], broken);
  assert.equal(c.verdict, "other quotes not after it");
  assert.match(c.detail, /Quote A/);
  assert.equal(checkAll([{ quote: 1, action: "replace", new_quote: "## Windows devices section." }], broken)[0].verdict, "valid");
});

test("two decisions of one entry must agree on its anchor, and a new quote that occurs twice needs one", () => {
  const ev = { quotes: ["Restart Service: Click to restart the app.", "Clear Logs: Click Clear the logs."] };
  const { broken } = items(ev, WIN_OLD.replace(RESTART, ev.quotes[0]).replace("Clear Logs: Click Clear.", ev.quotes[1]), REPEATED);
  const bare = checkAll([{ quote: 1, action: "replace", new_quote: RESTART }], broken)[0];
  assert.equal(bare.verdict, "occurs twice");
  assert.match(bare.detail, /occurs 2 times in the NEW text; give "after"/);
  const checked = checkAll([
    { quote: 1, action: "replace", new_quote: RESTART, after: "features on Windows devices:" },
    { quote: 2, action: "replace", new_quote: "Clear Logs: Click Clear.", after: "features on macOS devices:" },
  ], broken);
  assert.deepEqual(checked.map((c) => c.verdict), ["conflicting anchors", "conflicting anchors"]);
  const agreed = checkAll([
    { quote: 1, action: "replace", new_quote: RESTART, after: "features on Windows devices:" },
    { quote: 2, action: "replace", new_quote: "Clear Logs: Click Clear.", after: "features on Windows devices:" },
  ], broken);
  assert.deepEqual(agreed.map((c) => c.verdict), ["valid", "valid"]);
  applyDecisions(agreed);
  assert.deepEqual(ev, { quotes: [RESTART, "Clear Logs: Click Clear."], after: "features on Windows devices:" });
  assert.match(mismatch("abc xyz", "xx abc yy"), /has "abc " but not what follows it, "xyz"/);
});

test("a new quote from another part of the page than the entry's other quotes is left for a person", () => {
  const quote = "The 8010 appliances are 1U, 19-inch rack-mountable.";
  const kept = "The 8010 weighs 18 lbs.";
  // The manual gained a second model's section before the old one.
  const { broken } = items({ quotes: [quote, kept] }, `Intro. ZS-8010 manual. ${quote} ${kept}`,
    `Intro. ZS-800 manual. The 800 appliances are rack-mountable. ${"Spec row. ".repeat(250)} ZS-8010 manual. The 8010 appliances are 1U, 19-inch rack-mountable form factors. ${kept}`);
  const [wrong] = checkAll([{ quote: 1, action: "replace", new_quote: "The 800 appliances are rack-mountable." }], broken);
  assert.equal(wrong.verdict, "another part of the page");
  const [right] = checkAll([{ quote: 1, action: "replace", new_quote: "The 8010 appliances are 1U, 19-inch rack-mountable form factors." }], broken);
  assert.equal(right.verdict, "valid");
});

test("rejected decisions go back to the model once, with the reason, and the usable ones stand", async () => {
  const ev = { quotes: [RESTART, "Repair App: Click Repair to reinstall the drivers.", "Gone sentence here."] };
  const { broken } = items(ev, `${WIN_OLD} Gone sentence here.`, REPEATED);
  assert.deepEqual(broken.map((b) => b.why), ["repeated", "missing"]);
  const asked = [];
  const replies = [
    { decisions: [{ quote: 1, action: "replace", new_quote: RESTART }, { quote: 2, action: "unsupported" }] },
    { decisions: [{ quote: "1", action: "anchor", after: "features on Windows devices:" }, { quote: 2, action: "replace", new_quote: "Clear Logs: Click Clear." }] },
  ];
  const fake = async (messages) => {
    asked.push(messages);
    const json = replies[asked.length - 1];
    return { json, text: JSON.stringify(json) };
  };
  const d = await decide({ id: "zcc.x:restart", statement: "S." }, [], broken, fake);
  assert.equal(asked.length, 2);
  assert.match(asked[1].at(-1).content, /Item 1 \(replace\): occurs twice: it occurs 2 times/);
  assert.equal(asked[1][1].role, "assistant");
  assert.equal(d.retried, true);
  assert.deepEqual(d.decisions.map((x) => `${x.quote}:${x.action}/${x.verdict}`), ["2:unsupported/unsupported", "1:anchor/valid"], "the second reply's decision for a standing quote is not taken");
  assert.equal(retryPrompt(d.decisions, broken), null);
  assert.match(retryPrompt([], broken), /Item 1: no decision was given\.[\s\S]*Item 2: no decision was given\./);
  const once = await decide({ id: "a", statement: "S." }, [], [broken[1]], async () => ({ json: { decisions: [{ quote: 1, action: "unsupported" }] }, text: "{}" }));
  assert.equal(once.retried, false);
});

test("a restated statement is taken only from a reply whose every restate was accepted", () => {
  const r = (round, verdict) => ({ action: "replace_and_restate", round, verdict });
  const statements = { 1: "First.", 2: "Second." };
  const ok2 = [r(1, "valid"), r(2, "valid")];
  assert.equal(restatement(ok2, statements, "Orig."), "Second.");
  const bad2 = [r(1, "valid"), r(2, "not in the source")];
  assert.equal(restatement(bad2, statements, "Orig."), "First.", "the second reply's statement carries a rejected change");
  const mixed1 = [r(1, "valid"), r(1, "occurs twice")];
  assert.equal(restatement(mixed1, { 1: "First." }, "Orig."), undefined);
  assert.equal(mixed1[0].verdict, "no usable statement", "a restate's new quote needs its statement");
  const late = [r(1, "valid"), { ...r(2, "valid") }];
  assert.equal(restatement(late, { 1: "First.", 2: undefined }, "Orig."), "First.");
  assert.equal(late[1].verdict, "no usable statement");
  assert.equal(restatement([{ action: "replace", verdict: "valid" }], { 1: "Changed anyway." }, "Orig."), undefined);
});

test("a divergence position's decisions and statement survive --json and apply to the position", () => {
  const ev = { quotes: ["old wording of a position"] };
  const node = { data: { summary: "S.", positions: [{ says: "x", evidence: { quotes: ["other"] } }, { says: "y", evidence: ev }] } };
  const g = { nodes: new Map([["a.b:d", node]]) };
  const run = [{ id: "a.b:d", position: 1, statement: "y", restated: "y, reworded", decisions: [{ quote: 1, action: "replace_and_restate", verdict: "valid", slot: "positions", ei: 1, old: "old wording of a position", new_quote: "new wording of a position", evidence: ev }] }];
  const [r] = replay(g, JSON.parse(JSON.stringify(resultsJson(run))));
  assert.equal(r.decisions[0].verdict, "valid");
  applyResult(r.node, r);
  assert.deepEqual(ev.quotes, ["new wording of a position"]);
  assert.equal(node.data.positions[1].says, "y, reworded");
  assert.equal(node.data.positions[0].says, "x");
  assert.match(reportMarkdown([{ ...r, decisions: [] }]), /### `a\.b:d positions\[1\]`/);
});
