#!/usr/bin/env node
// Writes (or --check verifies) the capability-routing marked block in AGENTS.md.
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { renderRoutingBlock, ROUTING_START, ROUTING_END } from "./capability-registry.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const agentsPath = path.join(root, "AGENTS.md");
const check = process.argv.includes("--check");

const block = renderRoutingBlock(root);
const text = fs.readFileSync(agentsPath, "utf8");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const re = new RegExp(`${esc(ROUTING_START)}[\\s\\S]*?${esc(ROUTING_END)}`);
if (!re.test(text)) {
  console.error(`AGENTS.md is missing the ${ROUTING_START} / ${ROUTING_END} markers. Add them once, then re-run.`);
  process.exit(1);
}
const updated = text.replace(re, block);
if (check) {
  if (updated !== text) { console.error("AGENTS.md routing block is out of sync — run: node scripts/gen-capability-routing.mjs"); process.exit(1); }
  console.log("AGENTS.md routing block in sync");
} else {
  fs.writeFileSync(agentsPath, updated);
  console.log("AGENTS.md routing block regenerated");
}
