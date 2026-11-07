#!/usr/bin/env node
// kb-check-only.mjs — PreToolUse hook for the z-writer subagent: its one shell command is the knowledge-graph check
// of the subjects it edits (`node scripts/kb.mjs check <subject-id> ...`). Anything else is refused with exit 2,
// whose stderr the subagent reads, so the writer keeps its edit-only contract while it fixes its own errors.
import fs from "node:fs";

const ALLOWED = /^node scripts\/kb\.mjs check( [a-z0-9][a-z0-9.-]*)+$/;

/** Whether a Bash command is a check of named subjects and nothing else. */
export function allowed(command) {
  return ALLOWED.test(String(command ?? "").trim());
}

if (import.meta.main) {
  let input = {};
  try {
    input = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch {
    // An unreadable call is refused below like any other.
  }
  if (!allowed(input.tool_input?.command)) {
    process.stderr.write("z-writer may run only `node scripts/kb.mjs check <subject-id> ...` (agents/researcher/writer.md).\n");
    process.exitCode = 2;
  }
}
