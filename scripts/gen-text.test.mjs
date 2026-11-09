import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { codeFile, reasonFile, subjectFile, textFiles, typeFile } from "./gen-text.mjs";
import { buildGraph, loadPublic } from "./kb-lib.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OVERLAY = path.join(ROOT, "scripts/fixtures/kb-overlay");
const g = buildGraph(loadPublic(ROOT));
const files = textFiles(g);
const read = (...a) => execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "read", ...a], { encoding: "utf8" });

test("every subject, type, status code and policy reason has a text file, and every link points at one", () => {
  for (const n of g.nodes.values()) {
    if (n.kind === "subject") assert.ok(files[subjectFile(n.id)], n.id);
    if (n.kind === "type") assert.ok(files[typeFile(n.id)], n.id);
  }
  for (const code of g.statusCodes.keys()) assert.ok(files[codeFile(code)], code);
  for (const key of g.policyReasons.keys()) assert.ok(files[reasonFile(key)], key);
  for (const [f, text] of Object.entries(files)) {
    for (const [, to] of text.matchAll(/^- [a-z-]+ (references\/_meta\/text\/\S+\.md) \(/gm)) assert.ok(files[to], `${f} links to ${to}`);
  }
});

test("a subject's file is what read prints for it, with its aliases, its area and the links read follows", () => {
  const id = "zia.url-filtering.rule-order";
  const text = files[subjectFile(id)];
  const alone = read("--no-overlay", "--no-links", id).split("\n\n").slice(1).join("\n\n").trim();
  const [title, ...body] = alone.split("\n");
  assert.ok(text.startsWith(`${title}\nAlso called: ${g.nodes.get(id).data.aliases.join("; ")}\n${body.join("\n")}`), "read's text, aliases under the title");
  assert.match(text, /^Area: zia\.url-filtering, its subjects in references\/_meta\/spine\/zia\/zia\.url-filtering\.json$/m);
  // The links are the subjects read's hop reaches, read whole or listed, as file paths with the claim behind each.
  const hop = read("--no-overlay", id).split("## Linked subjects (one hop from what was read)")[1];
  const reached = new Set([...hop.matchAll(/^# .* \(([a-z0-9./-]+)\)$/gm), ...hop.matchAll(/^- [a-z-]+ (\S+) \(/gm)].map((m) => m[1]));
  const linked = new Set([...text.matchAll(/^- [a-z-]+ references\/_meta\/text\/(?:types\/)?(?:[a-z0-9-]+\/)?(\S+)\.md \(/gm)].map((m) => m[1]));
  assert.deepEqual([...linked].sort(), [...reached].sort());
  assert.match(text, /^- decided-by references\/_meta\/text\/zia\/zia\.url-categories\.membership\.md \(.+\): .+ \[zia\.url-categories\.membership:resolved-before-rules\]$/m);
});

test("codes, reasons and types read as read prints them, and a type points at its codes' files", () => {
  assert.equal(files[codeFile("BRK_MT_TERMINATED")], read("--no-overlay", "--no-links", "BRK_MT_TERMINATED").split("\n\n").slice(1).join("\n\n"));
  assert.match(files[reasonFile("bypassed due to missing config")], /^# Bypassed due to missing config: a policy reason of /);
  assert.match(files[typeFile("zia/web-log")], /^- ssldecrypted /m);
  assert.match(files[typeFile("zpa/user-activity-log")], /own file under references\/_meta\/text\/codes\//);
});

test("read --company prints only the company records, or says there is no overlay", () => {
  const out = read("--overlay", OVERLAY, "--company", "zia.url-filtering");
  assert.match(out, /^Company records about zia\.url-filtering(\.[a-z0-9.-]+)?:\n- \[company\.zia\./m);
  assert.match(out, /^Live tier: zscalerctl is declared; each config type \(references\/_meta\/text\/types\/<type id>\.md\) names its read-only command$/m);
  assert.ok(!out.includes("[zia.url-filtering.rule-order:first-match]"), "no public text");
  assert.ok(!out.includes("## Linked subjects"), "no hop");
  assert.match(read("--overlay", OVERLAY, "--company", "zdx.overview"), /^No company records are about zdx\.overview or what it binds\.$/m);
  assert.equal(read("--no-overlay", "--company", "zia.url-filtering"), "No company overlay is configured: there are no company records to read.\n");
});
