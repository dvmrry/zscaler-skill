import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateRegistry } from "./check-capability-registry.mjs";

function repo(entry) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cap-val-"));
  fs.mkdirSync(path.join(root, "agents", "auditor"), { recursive: true });
  fs.mkdirSync(path.join(root, "agents", "_meta"), { recursive: true });
  fs.writeFileSync(path.join(root, "agents", "auditor", "workflow.md"),
    "---\nid: z-auditor\nprimary-command: /z-auditor\nrequired-reads:\n  - agents/auditor/prompt.md\n---\n#\n");
  fs.writeFileSync(path.join(root, "agents", "_meta", "capability-registry.json"), JSON.stringify({ entries: [entry] }));
  return root;
}
const ok = {
  id: "auditor", kind: "internal-role", workflowId: "z-auditor",
  intent: { requiredSignals: [], cueSignals: ["audit"], negativeSignals: [], examples: ["audit refs"], threshold: "any-cue" },
  capsule: { fields: ["scope"], wording: "Auditing {scope}" }, engageHow: "suggest", lastVerified: "2026-06-14", authorStatus: "reviewed",
};

test("valid internal entry passes", () => {
  assert.deepEqual(validateRegistry(repo(ok)), []);
});
test("workflowId that does not resolve is an error", () => {
  const errs = validateRegistry(repo({ ...ok, workflowId: "z-ghost" }));
  assert.ok(errs.some((e) => /workflowId.*z-ghost.*resolve/i.test(e)));
});
test("missing intent cues and required signals is an error", () => {
  const errs = validateRegistry(repo({ ...ok, intent: { requiredSignals: [], cueSignals: [], negativeSignals: [], examples: [], threshold: "any-cue" } }));
  assert.ok(errs.some((e) => /intent/i.test(e)));
});
test("missing capsule fields or lastVerified is an error", () => {
  assert.ok(validateRegistry(repo({ ...ok, capsule: { fields: [], wording: "" } })).some((e) => /capsule/i.test(e)));
  assert.ok(validateRegistry(repo({ ...ok, lastVerified: undefined })).some((e) => /lastVerified/i.test(e)));
});

test("duplicate registry workflowId is an error", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cap-val-"));
  fs.mkdirSync(path.join(root, "agents", "auditor"), { recursive: true });
  fs.mkdirSync(path.join(root, "agents", "_meta"), { recursive: true });
  fs.writeFileSync(path.join(root, "agents", "auditor", "workflow.md"),
    "---\nid: z-auditor\nprimary-command: /z-auditor\nrequired-reads:\n  - agents/auditor/prompt.md\n---\n#\n");
  const entry2 = { ...ok, id: "auditor2" };
  fs.writeFileSync(path.join(root, "agents", "_meta", "capability-registry.json"),
    JSON.stringify({ entries: [ok, entry2] }));
  const errs = validateRegistry(root);
  assert.ok(errs.some((e) => /duplicate.*workflowId/i.test(e)));
});

test("ambiguous workflow id across two workflow.md files is an error", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cap-val-"));
  fs.mkdirSync(path.join(root, "agents", "auditor"), { recursive: true });
  fs.mkdirSync(path.join(root, "agents", "auditor2"), { recursive: true });
  fs.mkdirSync(path.join(root, "agents", "_meta"), { recursive: true });
  fs.writeFileSync(path.join(root, "agents", "auditor", "workflow.md"),
    "---\nid: z-auditor\nprimary-command: /z-auditor\nrequired-reads:\n  - agents/auditor/prompt.md\n---\n#\n");
  fs.writeFileSync(path.join(root, "agents", "auditor2", "workflow.md"),
    "---\nid: z-auditor\nprimary-command: /z-auditor\nrequired-reads:\n  - agents/auditor2/prompt.md\n---\n#\n");
  fs.writeFileSync(path.join(root, "agents", "_meta", "capability-registry.json"),
    JSON.stringify({ entries: [ok] }));
  const errs = validateRegistry(root);
  assert.ok(errs.some((e) => /ambiguous/i.test(e)));
});
