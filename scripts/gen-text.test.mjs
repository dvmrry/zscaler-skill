import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { sync, textFiles } from "./gen-text.mjs";
import { buildGraph, loadPublic } from "./kb-lib.mjs";
import { spines, textFile } from "./kb-resolve.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OVERLAY = path.join(ROOT, "scripts/fixtures/kb-overlay");
const g = buildGraph(loadPublic(ROOT));
const files = textFiles(g);
const read = (...a) => execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "read", ...a], { encoding: "utf8" });
const records = (out) => [...new Set(out.match(/^- \[company\.[a-z0-9.-]+\]/gm))].sort();

test("every subject, type, status code, policy reason and spine area has a text file, and every link points at one", () => {
  for (const n of g.nodes.values()) {
    if (n.kind === "subject") assert.ok(files[textFile.subject(n.id)], n.id);
    if (n.kind === "type") assert.ok(files[textFile.type(n.id)], n.id);
  }
  for (const code of g.statusCodes.keys()) assert.ok(files[textFile.code(code)], code);
  for (const key of g.policyReasons.keys()) assert.ok(files[textFile.reason(key)], key);
  // The prompts say an area's ID names a file: its hub's, or an index of its subjects when it has no hub.
  for (const spine of Object.values(spines(g))) for (const a of spine.areas) assert.ok(files[textFile.subject(a.id)], a.id);
  assert.match(files[textFile.subject("zia.url-categories")], /^# zia\.url-categories: an area with no hub subject\n\nIts subjects .*\n- references\/_meta\/text\/zia\/zia\.url-categories\.[a-z0-9.-]+\.md \(/s);
  for (const [f, text] of Object.entries(files)) {
    for (const [, to] of text.matchAll(/^- (?:[a-z-]+ )?(references\/_meta\/text\/\S+\.md) \(/gm)) assert.ok(files[to], `${f} links to ${to}`);
  }
});

test("a subject's file is what read prints for it, with its names, its area and the links read follows", () => {
  const id = "zia.url-filtering.rule-order";
  const text = files[textFile.subject(id)];
  const alone = read("--no-overlay", "--no-links", id).split("\n\n").slice(1).join("\n\n").trim();
  const [title, ...body] = alone.split("\n");
  assert.ok(text.startsWith(`${title}\nAlso called: ${g.nodes.get(id).data.aliases.join("; ")}\nFormer IDs: zia-05\n${body.join("\n")}`), "read's text, names under the title");
  assert.match(text, /^Area: zia\.url-filtering, its subjects in references\/_meta\/spine\/zia\/zia\.url-filtering\.json$/m);
  // The links are the subjects read's hop reaches, read whole or listed, as file paths with the claim behind each.
  const hop = read("--no-overlay", id).split("## Linked subjects (one hop from what was read)")[1];
  const reached = new Set([...hop.matchAll(/^# .* \(([a-z0-9./-]+)\)$/gm), ...hop.matchAll(/^- [a-z-]+ (\S+) \(/gm)].map((m) => m[1]));
  const followed = text.split("\n\nConfigured via and see also")[0];
  const linked = new Set([...followed.matchAll(/^- [a-z-]+ references\/_meta\/text\/(?:types\/)?(?:[a-z0-9-]+\/)?(\S+)\.md \(/gm)].map((m) => m[1]));
  assert.deepEqual([...linked].sort(), [...reached].sort());
  assert.match(text, /^- decided-by references\/_meta\/text\/zia\/zia\.url-categories\.membership\.md \(.+\): .+ \[zia\.url-categories\.membership:resolved-before-rules\]$/m);
  // A link in a prose table's first row is a link like any other.
  assert.match(files[textFile.subject("shared.admin-rbac")], /^- [a-z-]+ references\/_meta\/text\/shared\/shared\.admin-rbac\.zia\.md \(/m);
  // An old ledger ID someone cites finds the subject it became.
  const [old, to] = [...g.formerIds].find(([, t]) => g.nodes.get(t)?.kind === "subject");
  assert.match(files[textFile.subject(to)], new RegExp(`^Former IDs: (.+, )?${old}(,|$)`, "m"));
});

test("a subject's file lists every edge read does not follow, by title, so a change question reaches the config type", () => {
  for (const n of g.nodes.values()) {
    if (n.kind !== "subject") continue;
    const text = files[textFile.subject(n.id)];
    // Each file a subject links to is listed once, in Linked or in the block after it.
    const paths = [...text.matchAll(/^- [a-z-]+ (references\/_meta\/text\/\S+\.md) \(/gm)].map((m) => m[1]);
    assert.equal(new Set(paths).size, paths.length, `${n.id} lists a file twice`);
    for (const e of n.data.related || []) {
      if (!["configured-via", "see-also"].includes(e.rel)) continue;
      const to = g.nodes.get(e.to).kind === "type" ? textFile.type(e.to) : textFile.subject(e.to);
      assert.ok(paths.includes(to), `${n.id} does not list its ${e.rel} ${e.to}`);
    }
  }
  const listed = files[textFile.subject("zia.url-filtering")].split("\n\nConfigured via and see also (open one only if the answer needs it):\n")[1];
  assert.match(listed, /^- configured-via references\/_meta\/text\/types\/zia\/url-filtering-rules\.md \(config type\)$/m);
  assert.match(listed, /^- configured-via references\/_meta\/text\/zia\/zia\.terraform\.url-filtering-rules\.md \(.+\)$/m);
});

test("codes, reasons and types read as read prints them, naming files instead of commands", () => {
  assert.equal(files[textFile.code("BRK_MT_TERMINATED")], read("--no-overlay", "--no-links", "BRK_MT_TERMINATED").split("\n\n").slice(1).join("\n\n"));
  assert.match(files[textFile.reason("bypassed due to missing config")], /^# Bypassed due to missing config: a policy reason of /);
  assert.match(files[textFile.type("zia/web-log")], /^- ssldecrypted /m);
  assert.match(files[textFile.type("zpa/user-activity-log")], /^- Status codes: \d+ .*; each has its own file, `references\/_meta\/text\/codes\/<code>\.md`$/m);
  for (const f of Object.keys(files)) assert.doesNotMatch(files[f], /\(`read /, `${f} tells the reader to run read`);
});

test("read --company prints only the company records, the hop's too, and takes file paths", () => {
  const id = "zia.url-filtering.rule-order";
  const out = read("--overlay", OVERLAY, "--company", textFile.subject(id));
  assert.deepEqual(records(out), records(read("--overlay", OVERLAY, id)), "the same records read gives with the text");
  assert.ok(!out.includes(`[${id}:first-match]`), "no public text");
  assert.ok(!out.includes("## Linked subjects"), "no hop heading");
  assert.match(out, /^Live tier: zscalerctl is declared; each config type \(references\/_meta\/text\/types\/<type id>\.md\) names its read-only command$/m);
  // A subject stands for its area, as the areas agents used to read did: no leaf loses a record its area gave.
  const area = records(read("--overlay", OVERLAY, "zia.url-filtering"));
  for (const n of g.nodes.values()) {
    if (n.kind !== "subject" || !n.id.startsWith("zia.url-filtering.")) continue;
    const leaf = records(read("--overlay", OVERLAY, "--company", n.id));
    for (const r of area) assert.ok(leaf.includes(r), `${n.id} keeps ${r}`);
  }
  assert.ok(records(read("--overlay", OVERLAY, "--company", "shared.cloud-architecture.service-edges")).includes("- [company.zia.splunk-web-mapping]"));
  assert.deepEqual(records(read("--overlay", OVERLAY, "--company", textFile.subject("zia.url-categories"))), records(read("--overlay", OVERLAY, "--company", "zia.url-categories")), "an area index file's path is its area");
  assert.match(read("--overlay", OVERLAY, "--company", "zdx.score"), /^No company records are about zdx\.score, its area, what it binds or what it links to\.$/m);
  assert.match(read("--overlay", OVERLAY, "--company", "AST_MT_SETUP_ERR_NO_DNS_TO_SERVER"), /^No company records are about AST_MT_SETUP_ERR_NO_DNS_TO_SERVER,/m, "a code says it has none");
  const unknown = read("--overlay", OVERLAY, "--company", "references/_meta/text/zia/zia.nope.md");
  assert.match(unknown, /no subject, type, field or area has this ID/);
  assert.doesNotMatch(unknown, /No company records/, "an ID that names nothing is not reported as having no records");
  assert.equal(read("--no-overlay", "--company", id), "No company overlay is configured: there are no company records to read.\n");
});

test("sync writes, then --check finds missing, changed and no-longer-generated files", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gen-text-"));
  try {
    const want = { "references/_meta/text/zia/zia.a.md": "a\n", "references/_meta/text/types/zia/t.md": "t\n" };
    assert.deepEqual(sync(root, want, { check: true }).sort(), Object.keys(want).sort(), "nothing written yet");
    sync(root, want);
    assert.deepEqual(sync(root, want, { check: true }), []);
    fs.writeFileSync(path.join(root, "references/_meta/text/zia/zia.a.md"), "edited\n");
    fs.writeFileSync(path.join(root, "references/_meta/text/zia/zia.gone.md"), "old\n");
    fs.writeFileSync(path.join(root, "references/_meta/text/zia/.DS_Store"), "");
    assert.deepEqual(sync(root, want, { check: true }).sort(), ["references/_meta/text/zia/zia.a.md", "references/_meta/text/zia/zia.gone.md"]);
    sync(root, { "references/_meta/text/zia/zia.a.md": "a\n" });
    assert.ok(!fs.existsSync(path.join(root, "references/_meta/text/types")), "a removed type's empty directory goes too");
    assert.ok(!fs.existsSync(path.join(root, "references/_meta/text/zia/zia.gone.md")));
    assert.ok(fs.existsSync(path.join(root, "references/_meta/text/zia/.DS_Store")), "a file it did not write is left alone");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
