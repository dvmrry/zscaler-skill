// scripts/capability-registry.mjs
//
// Loads the capability registry (routing-only data) and resolves each internal
// entry's command/path/required-reads from the role's workflow.md — never copies
// that metadata into the registry. Zero-dependency (JSON + the shared frontmatter
// parser). Drives @zscaler routing + the generated AGENTS.md block.
import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "./check-workflow-metadata.mjs";

export const REGISTRY_PATH = "agents/_meta/capability-registry.json";

export function loadRegistry(root) {
  const file = path.join(root, REGISTRY_PATH);
  const reg = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!reg || !Array.isArray(reg.entries)) throw new Error("capability-registry: missing entries[]");
  return reg;
}

/**
 * Resolve an internal role's workflow by its frontmatter `id` (self-discovers
 * agents/<role>/workflow.md). Returns { workflowPath, primaryCommand, requiredReads }
 * or null. Derives everything from the workflow file — single source of truth.
 */
export function resolveWorkflow(root, workflowId) {
  const agentsDir = path.join(root, "agents");
  if (!fs.existsSync(agentsDir)) return null;
  for (const ent of fs.readdirSync(agentsDir, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const wf = path.join(agentsDir, ent.name, "workflow.md");
    if (!fs.existsSync(wf)) continue;
    const parsed = parseFrontmatter(wf, []);
    if (!parsed || parsed.data.id !== workflowId) continue;
    return {
      workflowPath: path.relative(root, wf).split(path.sep).join("/"),
      primaryCommand: parsed.data["primary-command"] || null,
      requiredReads: parsed.data["required-reads"] || [],
    };
  }
  return null;
}
