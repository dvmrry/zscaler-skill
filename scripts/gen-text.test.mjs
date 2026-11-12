import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { sync, textFiles } from "./gen-text.mjs";
import { buildGraph, loadPublic } from "./kb-lib.mjs";
import { bindsOf, loadOverlay, neighbours, readText, spines, textFile, usableOverlay } from "./kb-resolve.mjs";

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
    for (const t of bindsOf(g, n.id).map((b) => b.split("#")[0])) {
      if (g.nodes.get(t)?.data?.kind === "config") assert.ok(paths.includes(textFile.type(t)), `${n.id} does not list the config type it binds, ${t}`);
    }
  }
  assert.match(files[textFile.subject("zpa.app-segments")], /^- configured-via references\/_meta\/text\/types\/zpa\/application-segments\.md \(config type\)$/m);
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

test("read --company lists linked subjects' records past its budget, reads one by ID, and cuts long IaC values", () => {
  // ai-security.ai-guard reaches the SIEM mapping only through a linked subject.
  const ov = usableOverlay(g, loadOverlay(g, OVERLAY));
  const whole = readText(g, ["ai-security.ai-guard"], ov, { company: true });
  const listed = readText(g, ["ai-security.ai-guard"], ov, { company: true, linkedRecords: 0 });
  assert.match(whole, /^Company records about \S+:\n- \[company\.zia\.splunk-web-mapping\] mapping, maps zia\/web-log: .+\n {2}Stored in: /m);
  assert.match(listed, /^Company records about linked subjects, one line each \(read the ones the answer needs whole, all in one call: `node scripts\/kb\.mjs read --company <record id> \.\.\.`\):\n- \[company\.zia\.splunk-web-mapping\] mapping, maps zia\/web-log: Synthetic fixture: how our SIEM stores ZIA web log fields$/m);
  assert.doesNotMatch(listed, /Stored in:/);
  assert.deepEqual(records(listed), records(whole), "a listed record is still named");
  assert.match(read("--overlay", OVERLAY, "--company", "company.zia.splunk-web-mapping"), /^Company record company\.zia\.splunk-web-mapping:\n- \[company\.zia\.splunk-web-mapping\] mapping, maps zia\/web-log: .+\n {2}Stored in: Splunk index zscaler_web \(synthetic\)\n {2}- zia\/web-log#urlfilterrulelabel is zs_url_rule$/m);

  assert.match(read("--overlay", OVERLAY, "--company", "company.zia.nope"), /^# company\.zia\.nope: no active company record has this ID$/m);
  assert.match(read("--overlay", OVERLAY, "--company", "company.zia.splunk-web-mapping,"), /^Company record company\.zia\.splunk-web-mapping:$/m, "a trailing comma is dropped");

  // A record by ID that is not active says what it is instead.
  const states = fs.mkdtempSync(path.join(os.tmpdir(), "kb-overlay-"));
  try {
    fs.cpSync(OVERLAY, states, { recursive: true });
    const base = JSON.parse(fs.readFileSync(path.join(OVERLAY, "knowledge/zia/company.zia.splunk-web-mapping.json"), "utf8"));
    const put = (id, fields) => fs.writeFileSync(path.join(states, `knowledge/zia/${id}.json`), JSON.stringify({ ...base, id, ...fields }));
    put("company.zia.old-mapping", { status: "retired" });
    put("company.zia.public-now", { status: "promoted", promoted_to: "zia.url-filtering.rule-order:first-match" });
    put("company.zia.broken", { kind: "no-such-kind" });
    const out = execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "read", "--overlay", states, "--company", "company.zia.old-mapping", "company.zia.public-now", "company.zia.broken"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    assert.match(out, /^# company\.zia\.old-mapping: no active company record has this ID \(it is retired\)$/m);
    assert.match(out, /^# company\.zia\.public-now: this company record was promoted to the public claim zia\.url-filtering\.rule-order:first-match$/m);
    assert.match(out, /^# company\.zia\.broken: this company record was skipped as invalid \(the overlay check says why\)$/m);
  } finally {
    fs.rmSync(states, { recursive: true, force: true });
  }

  // A pointer that resolves to a whole export prints the whole items that fit, marks the rest, and says how long it
  // is; resolve keeps the whole value.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kb-overlay-"));
  try {
    fs.cpSync(OVERLAY, dir, { recursive: true });
    const rules = Array.from({ length: 40 }, (_, i) => ({ name: `rule-${i}`, action: "BLOCK", enabled: i % 2 === 0 }));
    const notes = {
      first: `Allow, ${"x".repeat(600)}`,
      big: [{ description: `${"long words, ".repeat(60)}end`, enabled: false }],
      lines: "\n".repeat(1000),
      key: { ["k".repeat(400)]: 12345 },
      num: { ["k".repeat(280)]: 1.2345678901234568e22 },
    };
    fs.writeFileSync(path.join(dir, "iac/rules.json"), JSON.stringify({ rules, notes }));
    const record = JSON.parse(fs.readFileSync(path.join(OVERLAY, "knowledge/zia/company.zia.url-filtering-iac.json"), "utf8"));
    record.id = "company.zia.url-filtering-export";
    record.pointers = ["rules", "notes/first", "notes/big", "notes/lines", "notes/key", "notes/num"].map((p) => ({ repo: "iac", file: "rules.json", pointer: `/${p}`, label: p }));
    fs.writeFileSync(path.join(dir, "knowledge/zia/company.zia.url-filtering-export.json"), JSON.stringify(record));
    const out = read("--overlay", dir, "--company", "zia/url-filtering-rules");
    const cut = (label) => out.match(new RegExp(`^ {2}- IaC ${label}: iac:rules\\.json#/${label} = (.+) \\(cut: (\\d+) characters in all; the source has the whole value\\)`, "m"));
    const r = cut("rules");
    assert.ok(r, out);
    assert.ok(r[1].length <= 300, `${r[1].length} characters printed`);
    assert.equal(Number(r[2]), JSON.stringify(rules).length);
    const kept = JSON.parse(r[1].replace(/, …\]$/, "]"));
    assert.deepEqual(kept, rules.slice(0, kept.length), "only whole rules, each with every field");
    assert.ok(kept.length > 3);
    assert.match(cut("notes/first")[1], /^"Allow, x+…"$/, "a string keeps more than its first comma");
    assert.match(cut("notes/big")[1], /^\[\{"description":"long words, .+…"(, …)?\}\]$/, "an item too long to fit is cut inside, and says so");
    assert.ok(cut("notes/lines")[1].length <= 300, "a string is cut at its length as JSON writes it");
    assert.match(cut("notes/key")[1], /^\{"k+…":…\}$/, "a key too long to fit is cut");
    assert.ok(cut("notes/key")[1].length <= 300);
    const num = out.match(/^ {2}- IaC notes\/num: iac:rules\.json#\/notes\/num = (\{.*\})$/m);
    assert.ok(num, "a value with nothing to cut prints whole, and is not called cut");
    assert.deepEqual(JSON.parse(num[1]), notes.num, "a number is never cut into a string");
    assert.match(out, /^ {2}- IaC checks we added: iac:coverage\.json#\/resources\/zia_url_filtering_rules\/checks = \["assert-clean after import for the imported addresses only"\]/m, "a short value prints whole");
    const bundle = JSON.parse(execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "resolve", "--overlay", dir, "zia/url-filtering-rules"], { encoding: "utf8" }));
    const facet = [bundle, ...(bundle.types || [])].flatMap((b) => b.company || []).find((f) => f.id === "company.zia.url-filtering-export");
    assert.deepEqual(facet.iac[0].value, rules, "resolve keeps the whole value");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("read --company prints the most strongly linked subjects' records up to its budget and names every other one", () => {
  // Four records on each subject linked from zia.ssl-inspection: far past the budget.
  const area = "zia.ssl-inspection";
  const inArea = [...g.nodes.values()].filter((n) => n.kind === "subject" && (n.id === area || n.id.startsWith(`${area}.`))).map((n) => n.id);
  const linked = neighbours(g, inArea, new Set(inArea)).map(([id]) => id).filter((id) => g.nodes.get(id).kind === "subject");
  assert.ok(linked.length > 10, `${linked.length} linked subjects`);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kb-overlay-"));
  const bin = fs.mkdtempSync(path.join(os.tmpdir(), "kb-git-"));
  try {
    fs.mkdirSync(path.join(dir, "knowledge/zia"), { recursive: true });
    fs.mkdirSync(path.join(dir, "iac"));
    fs.writeFileSync(path.join(dir, "overlay.json"), JSON.stringify({ schema_version: 1, iac: [{ id: "iac", path: "iac", kind: "json" }] }));
    fs.writeFileSync(path.join(dir, "iac/last.json"), JSON.stringify({ value: 1 }));
    const ids = [];
    linked.forEach((subject, i) => {
      for (let k = 0; k < 4; k++) {
        const id = `company.zia.linked-${i}-${k}`;
        ids.push(id);
        const last = i === linked.length - 1;
        const record = {
          schema_version: 1, id, kind: "claim", relation: "extends", about: [subject], title: `Synthetic linked record ${i}-${k}`, status: "active",
          // The most strongly linked subject's first record alone is past the budget.
          statement: "Synthetic fixture. ".repeat(i === 0 && k === 0 ? 1200 : 30), confidence: "medium", validated: "2026-01-01",
          // The least linked subject's records point at IaC: they are only listed, so their file is never dated.
          ...(last ? { pointers: [{ repo: "iac", file: "last.json", pointer: "/value", label: "value" }] } : {}),
        };
        fs.writeFileSync(path.join(dir, `knowledge/zia/${id}.json`), JSON.stringify(record));
      }
    });
    const log = path.join(bin, "calls");
    const git = execFileSync("sh", ["-c", "command -v git"], { encoding: "utf8" }).trim();
    fs.writeFileSync(path.join(bin, "git"), `#!/bin/sh\necho "$*" >> '${log}'\nexec '${git}' "$@"\n`, { mode: 0o755 });
    const env = { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` };
    const out = execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "read", "--overlay", dir, "--company", area], { encoding: "utf8", env });
    const blocks = out.split("\n\n").filter((b) => b.startsWith("Company records about ") && !b.startsWith("Company records about linked subjects,"));
    assert.equal(blocks[0].split(":")[0], `Company records about ${linked[0]}`, "the most strongly linked subject's records come first");
    assert.ok(blocks[0].includes("[company.zia.linked-0-1]") && !blocks[0].includes("[company.zia.linked-0-0]"), "a record past the budget lists only itself");
    const whole = blocks.reduce((n, b) => n + b.length + 2, 0) / 4;
    assert.ok(whole <= 4000 && blocks.length > 1, `${blocks.length} subjects' records whole, about ${whole} tokens`);
    const list = out.split("\n\n").find((b) => b.startsWith("Company records about linked subjects, one line each"));
    assert.match(list, /^Company records about linked subjects, one line each \(read the ones the answer needs whole, all in one call: `node scripts\/kb\.mjs read --company <record id> \.\.\.`\):$/m);
    assert.match(list, /^- \[company\.zia\.linked-0-0\] claim, extends /m, "the long record is listed");
    const more = [...list.matchAll(/^- \d+ more about (\S+) \(.+\), by ID: (.+)$/gm)];
    assert.ok(more.length, "past the list's room, records are named by ID under their linked subject");
    const byId = more.flatMap((m) => m[2].split(" "));
    for (const id of ids) assert.ok(out.includes(`[${id}]`) || byId.includes(id), `${id} is named`);
    const pasted = more[0][2].split(" ");
    const again = execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "read", "--overlay", dir, "--company", ...pasted], { encoding: "utf8", env });
    const heads = again.split("\n");
    for (const id of pasted) assert.ok(heads.includes(`Company record ${id}:`), `${id}: a by-ID line pastes as arguments`);
    assert.ok(!fs.existsSync(log) || !fs.readFileSync(log, "utf8").includes("last.json"), "a listed record's IaC file is not dated");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(bin, { recursive: true, force: true });
  }
});

test("read --company dates each IaC file once, however many subjects reach its record", () => {
  const bin = fs.mkdtempSync(path.join(os.tmpdir(), "kb-git-"));
  try {
    const log = path.join(bin, "calls");
    const git = execFileSync("sh", ["-c", "command -v git"], { encoding: "utf8" }).trim();
    fs.writeFileSync(path.join(bin, "git"), `#!/bin/sh\necho "$*" >> '${log}'\nexec '${git}' "$@"\n`, { mode: 0o755 });
    const env = { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` };
    const out = execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "read", "--overlay", OVERLAY, "--company", "zia.url-filtering"], { encoding: "utf8", env });
    assert.ok(records(out).includes("- [company.zia.url-filtering-iac]"));
    const calls = fs.readFileSync(log, "utf8").trim().split("\n");
    assert.deepEqual(calls, [...new Set(calls)], "no git call repeats");
  } finally {
    fs.rmSync(bin, { recursive: true, force: true });
  }
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
