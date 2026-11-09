import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { approvals, ENTRIES, harness, loadQuestions, MODEL, mismatch, PROMPT, parseRun, promptFor, reached, setFile, setFiles, shellCalls, verdictOf } from "./kb-eval.mjs";

const line = (o) => JSON.stringify(o);
const TRANSCRIPT = [
  line({ type: "system", subtype: "init" }),
  line({ type: "assistant", message: { content: [{ type: "tool_use", name: "Read", input: { file_path: "SKILL.md" } }] } }),
  line({ type: "user", message: { content: [{ type: "tool_result", content: "the spine" }] } }),
  line({ type: "assistant", message: { content: [{ type: "tool_use", name: "Bash", input: { command: "node scripts/kb.mjs read zia.url-filtering" } }] } }),
  line({ type: "user", message: { content: [{ type: "tool_result", content: [{ type: "text", text: "Rules stop at the first match. [zia.url-filtering.rule-order:first-match]" }] }] } }),
  "not json",
  line({ type: "result", result: "The first matching rule wins." }),
].join("\n");

test("a run transcript gives the tool text, the answer and the calls", () => {
  const r = parseRun(TRANSCRIPT);
  assert.equal(r.answer, "The first matching rule wins.");
  assert.deepEqual(r.calls.map((c) => c.name), ["Read", "Bash"]);
  assert.match(r.ctx, /^the spine\nRules stop/);
});

test("approvals count shell calls with any segment that is not read-only search", () => {
  const bash = (command) => ({ name: "Bash", input: { command } });
  assert.equal(approvals([bash("grep -rn x references | head -3"), bash("ls references/_meta/spine"), { name: "Read", input: {} }]), 0);
  assert.equal(approvals([bash("node scripts/kb.mjs read zia"), bash("cat a.json && node -e 'x'"), bash("F=x; grep y $F")]), 3);
});

test("shell calls count every Bash call, read-only or not", () => {
  const bash = (command) => ({ name: "Bash", input: { command } });
  assert.equal(shellCalls([bash("ls references"), bash("cat a.md"), bash("node scripts/kb.mjs read zia"), { name: "Read", input: {} }, { name: "Grep", input: {} }]), 3);
});

test("a verdict reads from a result object or from a list of events, and is null when there is none", () => {
  const result = { type: "result", result: 'Here it is: {"1": true, "2": false}' };
  assert.deepEqual(verdictOf(JSON.stringify(result)), { 1: true, 2: false });
  assert.deepEqual(verdictOf(JSON.stringify([{ type: "system", subtype: "init" }, { type: "assistant" }, result])), { 1: true, 2: false });
  assert.equal(verdictOf(JSON.stringify([{ type: "system" }])), null, "a list with no result");
  assert.equal(verdictOf(JSON.stringify({ type: "result", result: "no JSON here" })), null);
  assert.equal(verdictOf(""), null, "no output at all");
});

test("a holder is reached by its printed ID, or by its key inside its subject file", () => {
  const { ctx } = parseRun(TRANSCRIPT);
  assert.ok(reached(ctx, "zia.url-filtering.rule-order:first-match"));
  assert.ok(!reached(ctx, "zia.url-filtering.rule-order:ascending-order"));
  assert.ok(reached('{ "id": "zia.x", "claims": { "y-z": { "statement": "S" } } }', "zia.x:y-z"), "a subject file read whole");
});

test("runs compare only under the same harness, whatever the ref", () => {
  const a = { ref: "main", commit: "1", ...harness([{ id: "q" }], "2.1.308 (Claude Code)") };
  const b = { ref: "HEAD", commit: "2", ...harness([{ id: "q" }], "2.1.308 (Claude Code)") };
  assert.deepEqual(mismatch(a, b), []);
  assert.deepEqual(mismatch(a, { ...b, claude_version: "2.1.314 (Claude Code)" }), ["claude_version"]);
  assert.deepEqual(mismatch(a, harness([{ id: "other" }], "2.1.308 (Claude Code)")), ["facts_sha"]);
  assert.equal(harness([], "").model, MODEL);
  assert.deepEqual(mismatch(a, { ...b, ...harness([{ id: "q" }], "2.1.308 (Claude Code)", "us.anthropic.claude-haiku-5-5") }), ["model"]);
});

test("an entry changes only the file the prompt names, and every entry file exists", () => {
  assert.equal(promptFor(), PROMPT);
  assert.equal(promptFor("devin").replaceAll(ENTRIES.devin, "SKILL.md"), PROMPT);
  assert.throws(() => promptFor("codex"), /bad entry/);
  for (const f of Object.values(ENTRIES)) assert.ok(fs.existsSync(path.join(import.meta.dirname, "..", f)), f);
});

test("every gold fact names a claim, and every question has one, in every set; ids are unique across sets", () => {
  const ids = new Set();
  for (const file of setFiles()) {
    for (const q of loadQuestions(file)) {
      assert.ok(q.id && q.turn && q.facts.length, q.id);
      assert.ok(!ids.has(q.id), `${q.id} is in two sets`);
      ids.add(q.id);
      for (const f of q.facts) assert.match(f.claim, /^[a-z0-9.-]+:[a-z0-9-]+$/, `${q.id}/${f.id}`);
    }
  }
  assert.match(setFile(), /facts\.json$/);
  assert.match(setFile("users"), /facts-users\.json$/);
  assert.throws(() => setFile("../x"), /bad question set name/);
});
