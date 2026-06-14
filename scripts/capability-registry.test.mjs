import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { loadRegistry, resolveWorkflow } from "./capability-registry.mjs";

function tmpRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cap-reg-"));
  fs.mkdirSync(path.join(root, "agents", "auditor"), { recursive: true });
  fs.mkdirSync(path.join(root, "agents", "_meta"), { recursive: true });
  fs.writeFileSync(path.join(root, "agents", "auditor", "workflow.md"),
    "---\nid: z-auditor\nprimary-command: /z-auditor\nrequired-reads:\n  - agents/auditor/prompt.md\n---\n# body\n");
  fs.writeFileSync(path.join(root, "agents", "_meta", "capability-registry.json"),
    JSON.stringify({ entries: [{ id: "auditor", kind: "internal-role", workflowId: "z-auditor",
      intent: { requiredSignals: [], cueSignals: ["audit", "hygiene"], negativeSignals: [], examples: ["audit the zpa refs"], threshold: "any-cue" },
      capsule: { fields: ["scope"], wording: "Auditing {scope}" }, engageHow: "suggest", lastVerified: "2026-06-14", authorStatus: "reviewed" }] }));
  return root;
}

test("loadRegistry parses entries", () => {
  const reg = loadRegistry(tmpRepo());
  assert.equal(reg.entries.length, 1);
  assert.equal(reg.entries[0].workflowId, "z-auditor");
});

test("resolveWorkflow derives command + required-reads from the role workflow (no copied metadata)", () => {
  const root = tmpRepo();
  const r = resolveWorkflow(root, "z-auditor");
  assert.equal(r.primaryCommand, "/z-auditor");
  assert.equal(r.workflowPath, "agents/auditor/workflow.md");
  assert.deepEqual(r.requiredReads, ["agents/auditor/prompt.md"]);
});

test("resolveWorkflow returns null for an unknown workflowId", () => {
  assert.equal(resolveWorkflow(tmpRepo(), "z-nonexistent"), null);
});

import { renderRoutingBlock } from "./capability-registry.mjs";

test("renderRoutingBlock emits a marked block with derived command", () => {
  const block = renderRoutingBlock(tmpRepo());
  assert.match(block, /<!-- capability-routing:start -->/);
  assert.match(block, /<!-- capability-routing:end -->/);
  assert.match(block, /\/z-auditor/);          // derived primary-command
  assert.match(block, /audit/);                // a cue signal
});
