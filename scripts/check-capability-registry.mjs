#!/usr/bin/env node
// Validates agents/_meta/capability-registry.json: schema, workflowId resolves,
// intent is routable, capsule + provenance present. Run by check-fast.
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { loadRegistry, resolveWorkflow } from "./capability-registry.mjs";

export function validateRegistry(root) {
  const errors = [];
  let reg;
  try { reg = loadRegistry(root); } catch (e) { return [e.message]; }
  for (const e of reg.entries) {
    const id = e.id || "(no id)";
    if (e.kind !== "internal-role") continue; // external entries are Increment 2
    if (!e.workflowId || !resolveWorkflow(root, e.workflowId)) {
      errors.push(`entry ${id}: workflowId "${e.workflowId}" does not resolve to a workflow.md with that id`);
    }
    const intent = e.intent || {};
    const hasSignals = (intent.requiredSignals || []).length > 0 || (intent.cueSignals || []).length > 0;
    if (!hasSignals) errors.push(`entry ${id}: intent must have requiredSignals or cueSignals`);
    if (!(intent.examples || []).length) errors.push(`entry ${id}: intent.examples must be non-empty`);
    if (!["all-required", "any-cue", "n-of"].includes(intent.threshold)) errors.push(`entry ${id}: intent.threshold invalid`);
    const capsule = e.capsule || {};
    if (!(capsule.fields || []).length) errors.push(`entry ${id}: capsule.fields must be non-empty`);
    if (!capsule.wording) errors.push(`entry ${id}: capsule.wording required`);
    if (!e.lastVerified) errors.push(`entry ${id}: lastVerified required`);
    if (e.engageHow !== "suggest") errors.push(`entry ${id}: engageHow must be "suggest" in Increment 1`);
  }
  return errors;
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const errors = validateRegistry(root);
  if (errors.length) { console.error("capability-registry errors:"); for (const e of errors) console.error(`  - ${e}`); process.exit(1); }
  console.log("capability-registry: valid");
}
