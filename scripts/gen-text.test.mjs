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

test("read --company lists linked subjects' records past its budget, reads one by ID, and gives long IaC values' shapes", () => {
  // ai-security.ai-guard reaches the SIEM mapping only through a linked subject.
  const ov = usableOverlay(g, loadOverlay(g, OVERLAY));
  const whole = readText(g, ["ai-security.ai-guard"], ov, { company: true });
  const listed = readText(g, ["ai-security.ai-guard"], ov, { company: true, linkedRecords: 0 });
  assert.match(whole, /^Company records about \S+ \(linked subject\):\n- \[company\.zia\.splunk-web-mapping\] mapping, maps zia\/web-log: .+\n {2}Stored in: /m);
  assert.match(whole, /^Company records: \d+ printed whole\.$/m, "the read says up front what it holds");
  assert.match(listed, /^Company records: 1 listed at the end, 1 one line each\.$/m, "with none printed whole, the count says only what is listed");
  assert.match(listed, /^Company records about linked subjects, one line each \(read the ones the answer needs whole, all in one call: `node scripts\/kb\.mjs read --company <record id> \.\.\.`\):\n- \[company\.zia\.splunk-web-mapping\] mapping, maps zia\/web-log: Synthetic fixture: how our SIEM stores ZIA web log fields$/m);
  assert.doesNotMatch(listed, /Stored in:/);
  assert.deepEqual(records(listed), records(whole), "a listed record is still named");
  assert.match(read("--overlay", OVERLAY, "--company", "company.zia.splunk-web-mapping"), /^Company record company\.zia\.splunk-web-mapping:\n- \[company\.zia\.splunk-web-mapping\] mapping, maps zia\/web-log: .+\n {2}Stored in: Splunk index zscaler_web \(synthetic\)\n {2}- zia\/web-log#urlfilterrulelabel is zs_url_rule$/m);

  assert.match(read("--overlay", OVERLAY, "--company", "company.zia.nope"), /^# company\.zia\.nope: no company record has this ID$/m);
  // An ID reads however it was copied: with a comma, two joined by one, in brackets or backticks, or as its file.
  for (const [arg, ids] of [
    ["company.zia.splunk-web-mapping,", ["company.zia.splunk-web-mapping"]],
    ["company.zia.splunk-web-mapping,company.zia.url-filtering-iac", ["company.zia.splunk-web-mapping", "company.zia.url-filtering-iac"]],
    ["[company.zia.splunk-web-mapping]", ["company.zia.splunk-web-mapping"]],
    ["`company.zia.splunk-web-mapping`", ["company.zia.splunk-web-mapping"]],
    ["knowledge/zia/company.zia.splunk-web-mapping.json", ["company.zia.splunk-web-mapping"]],
  ]) {
    const heads = read("--overlay", OVERLAY, "--company", arg).split("\n");
    for (const id of ids) assert.ok(heads.includes(`Company record ${id}:`), `${arg} reads ${id}`);
  }
  // A mapping printed under a subject keeps the fields that subject binds, and the fields the call names, and says
  // how many more it maps.
  const mapped = read("--overlay", OVERLAY, "--company", "zia.logs.web-rule-attribution", "zia/web-log#action");
  assert.match(mapped, /^ {2}- zia\/web-log#action is zs_action$/m, "a field the call names is kept");
  assert.match(read("--overlay", OVERLAY, "--company", "zia.logs.web-rule-attribution"), /^ {2}- zia\/web-log#urlcat is zs_category\n {2}- 1 more field mapped \(read the record by ID for all of them\)$/m, "a narrowed map says what it leaves out");
  // Duplicate arguments read once.
  const twice = read("--overlay", OVERLAY, "--company", "company.zia.splunk-web-mapping", "company.zia.splunk-web-mapping");
  assert.equal(twice.match(/^Company record company\.zia\.splunk-web-mapping:$/gm).length, 1);
  assert.doesNotMatch(twice, /printed above/);
  // A path's directories that look like IDs do not count when the path names a record.
  assert.doesNotMatch(read("--overlay", OVERLAY, "--company", "/x/company.data/knowledge/zia/company.zia.splunk-web-mapping.json"), /company\.data/);
  // A record named with its subject prints once, and its ID says so.
  const both = read("--overlay", OVERLAY, "--company", "zia.url-filtering", "company.zia.url-filtering-iac");
  assert.equal(both.match(/^- \[company\.zia\.url-filtering-iac\]/gm).length, 1);
  assert.match(both, /^# company\.zia\.url-filtering-iac: printed above$/m);
  // A named subject's own records print first, before the rest of its area, and outside the linked budget.
  assert.match(read("--overlay", OVERLAY, "--company", "zia.url-filtering.rule-order"), /^Company records: .+\n\nCompany records about zia\.url-filtering\.rule-order:\n/m);
  assert.match(readText(g, ["zia.url-filtering"], ov, { company: true, linkedRecords: 0 }), /^- \[company\.zia\.url-filtering-iac\][^\n]*\n(?: {2}.*\n)* {2}- IaC checks we added: /m, "the area's own records print whole with no budget");

  // A record by ID that is not active says what it is instead.
  const states = fs.mkdtempSync(path.join(os.tmpdir(), "kb-overlay-"));
  try {
    fs.cpSync(OVERLAY, states, { recursive: true });
    const base = JSON.parse(fs.readFileSync(path.join(OVERLAY, "knowledge/zia/company.zia.splunk-web-mapping.json"), "utf8"));
    const put = (id, fields) => fs.writeFileSync(path.join(states, `knowledge/zia/${id}.json`), JSON.stringify({ ...base, id, ...fields }));
    put("company.zia.old-mapping", { status: "retired" });
    put("company.zia.public-now", { status: "promoted", promoted_to: "zia.url-filtering.rule-order:first-match" });
    put("company.zia.broken", { kind: "no-such-kind" });
    const claim = (id, about, statement) => fs.writeFileSync(path.join(states, `knowledge/zia/${id}.json`), JSON.stringify({
      schema_version: 1, id, kind: "claim", relation: "extends", about: [about], title: `Synthetic ${id}`, status: "active", statement, confidence: "medium", validated: "2026-01-01",
    }));
    // A record printed whole cites others in its text; the read lists the ones it named nowhere.
    claim("company.zia.citer", "zia.url-filtering", "Synthetic fixture. See company.zia.cited-elsewhere and company.zia.old-mapping, and knowledge/zia/company.zia.by-path.json; company.zia.url-filtering-iac covers the rest. Ask admin@company.com or https://company.example.com/.");
    claim("company.zia.cited-elsewhere", "zdx.score", "Synthetic fixture, about a subject no read of URL Filtering reaches.");
    claim("company.zia.by-path", "zdx.score", "Synthetic fixture, cited by its file.");
    // An ID may end in a json segment or hold one: only a file's .json suffix goes.
    claim("company.zia.json-mapping", "zdx.score", "Synthetic fixture.");
    // An IaC file that is not JSON fails its pointer, not the overlay.
    fs.writeFileSync(path.join(states, "iac/broken.json"), "{ not json");
    const iacRecord = JSON.parse(fs.readFileSync(path.join(OVERLAY, "knowledge/zia/company.zia.url-filtering-iac.json"), "utf8"));
    fs.writeFileSync(path.join(states, "knowledge/zia/company.zia.bad-json.json"), JSON.stringify({ ...iacRecord, id: "company.zia.bad-json", pointers: [{ repo: "iac", file: "broken.json", pointer: "/x", label: "x" }] }));
    const quiet = (...a) => execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "read", "--overlay", states, "--company", ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    fs.writeFileSync(path.join(states, "knowledge/zia/company.zia.badfile.json"), "{ not json");
    for (const arg of ["company.zia.badfile", "knowledge/zia/company.zia.badfile.json"]) {
      assert.match(quiet(arg), /^# company\.zia\.badfile: this company record was skipped as invalid \(the overlay check says why\)$/m, `${arg}: a record file that is not JSON is skipped, not unknown`);
    }
    const out = quiet("company.zia.old-mapping", "company.zia.public-now", "company.zia.broken", "company.zia.bad-json");
    assert.match(out, /^# company\.zia\.old-mapping: this company record is retired, not active$/m);
    assert.match(out, /^# company\.zia\.public-now: this company record was promoted to the public claim zia\.url-filtering\.rule-order:first-match$/m);
    assert.match(out, /^# company\.zia\.broken: this company record was skipped as invalid \(the overlay check says why\)$/m);
    assert.match(out, /^ {2}- IaC x: iac:broken\.json#\/x \(unresolved: IaC file is not valid JSON: iac:broken\.json \(.+\)\)$/m);
    for (const arg of ["company.zia.json-mapping", "knowledge/zia/company.zia.json-mapping.json"]) {
      assert.match(quiet(arg), /^Company record company\.zia\.json-mapping:$/m, arg);
    }
    const area = quiet("zia.url-filtering");
    const cited = area.split("\n\n").find((b) => b.startsWith("Company records cited by the records above"));
    assert.ok(cited, area);
    assert.match(cited, /^- \[company\.zia\.cited-elsewhere\] claim, extends zdx\.score: Synthetic company\.zia\.cited-elsewhere \(cited by company\.zia\.citer\)$/m);
    assert.match(cited, /^- company\.zia\.old-mapping: this company record is retired, not active \(cited by company\.zia\.citer\)$/m);
    assert.match(cited, /^- \[company\.zia\.by-path\] claim, extends zdx\.score: .+ \(cited by company\.zia\.citer\)$/m, "a record cited by its file is that record");
    assert.doesNotMatch(cited, /url-filtering-iac/, "a record the read printed is not listed again");
    assert.doesNotMatch(cited, /company\.com|company\.example/, "an email's or a URL's host is not a record");
    assert.match(area, /^Company records: \d+ printed whole; 3 cited by them, listed at the end\.$/m);
    assert.doesNotMatch(quiet("company.zia.citer"), /Company records cited/, "a second call lists no more");
    assert.match(quiet("company.zia.citer", "zia.url-filtering.rule-order"), /^- \[company\.zia\.cited-elsewhere\] /m, "a first call lists what a record it reads by ID cites, whatever the order");
  } finally {
    fs.rmSync(states, { recursive: true, force: true });
  }

  // A pointer that resolves to a whole export prints its shape: what it holds and how long it is, never a part that
  // reads as the whole; resolve keeps the whole value.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kb-overlay-"));
  try {
    fs.cpSync(OVERLAY, dir, { recursive: true });
    const rules = Array.from({ length: 40 }, (_, i) => ({ name: `rule-${i}`, action: "BLOCK", enabled: i % 2 === 0 }));
    const domains = Array.from({ length: 42 }, (_, i) => `site-${i}.example.com`);
    const notes = {
      first: `Allow, ${"x".repeat(600)}`,
      big: [{ description: `${"long words, ".repeat(60)}end`, enabled: false }],
      lines: "\n".repeat(1000),
      key: { ["k".repeat(400)]: 12345 },
      ids: Array.from({ length: 15 }, (_, i) => `id-${String(i).padStart(16, "0")}`),
      server: { app_connector_groups: [{ id: Array.from({ length: 20 }, (_, i) => `group-${String(i).padStart(12, "0")}`) }], name: "x" },
      flags: {
        ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`flag_${i}`, false])),
        ...Object.fromEntries(Array.from({ length: 22 }, (_, i) => [`filler_${i}`, `v${i}`])),
        list: domains.slice(0, 30),
      },
      lists: { ...Object.fromEntries(Array.from({ length: 60 }, (_, i) => [`list_${String(i).padStart(2, "0")}`, Array.from({ length: 20 }, (_, j) => j)])), zz_enabled: false },
      // An exported URL Filtering rule: keys alphabetical, many empty or false, the deciding lists late.
      urlrule: {
        action: "BLOCK", block_override: false, cbi_profile: {}, ciparule: false, departments: [], description: "d".repeat(62),
        device_trust_levels: ["A", "B", "C", "D"].map((x) => `TRUST_LEVEL_${x}`), devices: [], dlp_engines: [], end_user_notification_url: "",
        enforce_time_validity: false, groups: [{ id: [8061234, 8061235] }], labels: [], location_groups: [], locations: [{ id: [9000001, 9000002, 9000003, 9000004] }],
        name: "Block NRD for contractors", order: 14, override_groups: [], override_users: [], protocols: ["HTTP", "HTTPS", "FTP", "RTSP", "SSL", "TUNNEL", "DOHTTPS", "WEBSOCKET"].map((x) => `${x}_RULE`),
        rank: 7, request_methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH", "CONNECT", "TRACE"], size_quota: 0, source_countries: [],
        source_ip_groups: [{ id: [5550101, 5550102, 5550103] }], state: "ENABLED", time_quota: 0, time_windows: [], url_categories: ["NEWLY_REG_DOMAINS", "GAMBLING", "ADULT_THEMES", "SPYWARE"],
        user_agent_types: [], user_risk_score_levels: [], users: [], validity_end_time: 0, workload_groups: [],
      },
      // As a tfvars export writes a rule: its keys in order, metadata first, the lists a record is about later.
      rule: { action: "BLOCK", api_protection_enabled: false, block_override: false, description: "d".repeat(100), domain_names: domains, order: 3, source_groups: [1, 2, 3] },
      emoji: { list: domains, note: "\u{1F600}".repeat(20) },
      deep: JSON.parse(`${"[".repeat(10)}"${"x".repeat(1000)}"${"]".repeat(10)}`),
      wide: Object.fromEntries(Array.from({ length: 60 }, (_, i) => [`field_${String(i).padStart(2, "0")}`, `value-${i}`])),
    };
    fs.writeFileSync(path.join(dir, "iac/rules.json"), JSON.stringify({ rules, notes }));
    const record = JSON.parse(fs.readFileSync(path.join(OVERLAY, "knowledge/zia/company.zia.url-filtering-iac.json"), "utf8"));
    record.id = "company.zia.url-filtering-export";
    record.pointers = ["rules", "notes/first", "notes/big", "notes/lines", "notes/key", "notes/ids", "notes/server", "notes/flags", "notes/lists", "notes/urlrule", "notes/rule", "notes/emoji", "notes/deep", "notes/wide"].map((p) => ({ repo: "iac", file: "rules.json", pointer: `/${p}`, label: p }));
    fs.writeFileSync(path.join(dir, "knowledge/zia/company.zia.url-filtering-export.json"), JSON.stringify(record));
    const out = read("--overlay", dir, "--company", "zia/url-filtering-rules");
    const value = (label) => out.match(new RegExp(`^ {2}- IaC ${label}: iac:rules\\.json#/${label} = (.+)$`, "m"))?.[1];
    const long = (json) => `(${JSON.stringify(json).length} characters of JSON; the source has the whole value)`;
    const r = value("rules").match(/^an array of 40 items (\(.+?\)), the first (\d+): (.+)$/);
    assert.ok(r, out);
    assert.equal(r[1], long(rules));
    assert.ok(r[3].length <= 300, `${r[3].length} characters of items`);
    assert.deepEqual(JSON.parse(`[${r[3]}]`), rules.slice(0, Number(r[2])), "only whole rules, each with every field");
    assert.ok(Number(r[2]) > 3);
    assert.match(value("notes/first"), /^a string of 607 characters \(the source has the whole value\): "Allow, x+…"$/, "a string gives its length in characters and its opening");
    assert.equal(value("notes/big"), `an array of 1 item ${long(notes.big)}; the first is an object of 2 keys: description (a string of 723 characters), enabled false`, "an item too long to print is described");
    const lines = value("notes/lines").match(/^a string of 1000 characters \(the source has the whole value\): (.+)$/);
    assert.ok(lines && lines[1].length <= 300, "a string is cut at its length as JSON writes it");
    assert.equal(value("notes/key"), JSON.stringify(notes.key), "a shape that saves little prints the value");
    assert.equal(value("notes/ids"), JSON.stringify(notes.ids), "so does a list a little over the room");
    assert.equal(value("notes/server"), `an object of 2 keys ${long(notes.server)}: app_connector_groups[0 of 1].id [20 items], name "x"`, "a wrapped list is named by its path, not as one item");
    assert.match(value("notes/flags"), /filler_21 "v21", list \[30 items\]; false or 0: flag_0, flag_1, flag_2, flag_3, flag_4, flag_5$/, "past the room, false members give way to their names first");
    const urlrule = value("notes/urlrule");
    assert.ok(urlrule.length <= 600, `${urlrule.length} characters`);
    for (const part of ['action "BLOCK"', "url_categories [4 items]", "order 14", "values not shown: locations, source_ip_groups", "15 keys are empty or null"]) {
      assert.ok(urlrule.includes(part), `${part} in: ${urlrule}`);
    }
    assert.ok(urlrule.includes("false or 0: block_override, ciparule, enforce_time_validity, size_quota, time_quota, validity_end_time"), "false members are set values: they keep their names while values give way");
    assert.match(value("notes/lists"), /^an object of 61 keys \(\d+ characters of JSON; the source has the whole value\): list_00 \[20 items\], list_01 \[20 items\], .+; \d+ other keys not named; false or 0: zz_enabled$/, "sizes give way before a false member's name, and the count is not read as more false keys");
    assert.doesNotMatch(urlrule, /\[0 items\]|cbi_profile/, "empty members are only counted");
    assert.equal(value("notes/emoji"), `an object of 2 keys ${long(notes.emoji)}: list [42 items], note (a string of 20 characters)`, "a string's length counts characters, not UTF-16 units");
    assert.equal(value("notes/deep"), `an array of 1 item ${long(notes.deep)}; the first is an array of 1 item; the first is an array of 1 item`, "nesting cannot grow a shape");
    assert.equal(value("notes/rule"), `an object of 7 keys ${long(notes.rule)}: action "BLOCK", api_protection_enabled false, block_override false, description (a string of 100 characters), domain_names [42 items], order 3, source_groups [1,2,3]`, "an object names every key, its short values, whole, and its lists' lengths");
    assert.match(value("notes/wide"), /^an object of 60 keys \(\d+ characters of JSON; the source has the whole value\): values not shown: field_00, field_01, .+; \d+ other keys not named$/, "too many keys for their values: the keys that fit, the rest counted");
    assert.doesNotMatch(value("notes/wide"), /value-/);
    assert.match(out, /^ {2}- IaC checks we added: iac:coverage\.json#\/resources\/zia_url_filtering_rules\/checks = \["assert-clean after import for the imported addresses only"\]/m, "a short value prints whole");
    const bundle = JSON.parse(execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "resolve", "--overlay", dir, "zia/url-filtering-rules"], { encoding: "utf8" }));
    const facet = [bundle, ...(bundle.types || [])].flatMap((b) => b.company || []).find((f) => f.id === "company.zia.url-filtering-export");
    assert.deepEqual(facet.iac[0].value, rules, "resolve keeps the whole value");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("read --company prints the most strongly linked subjects' records up to its budget and names every other one", () => {
  // Six records on each subject linked from zia.ssl-inspection: far past the budget and the list's room.
  const area = "zia.ssl-inspection";
  const inArea = [...g.nodes.values()].filter((n) => n.kind === "subject" && (n.id === area || n.id.startsWith(`${area}.`))).map((n) => n.id);
  const linked = neighbours(g, inArea, new Set(inArea)).map(([id]) => id).filter((id) => g.nodes.get(id).kind === "subject");
  assert.ok(linked.length > 20, `${linked.length} linked subjects, enough records to pass the list's room`);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kb-overlay-"));
  const bin = fs.mkdtempSync(path.join(os.tmpdir(), "kb-git-"));
  try {
    fs.mkdirSync(path.join(dir, "knowledge/zia"), { recursive: true });
    fs.mkdirSync(path.join(dir, "iac"));
    fs.writeFileSync(path.join(dir, "overlay.json"), JSON.stringify({ schema_version: 1, iac: [{ id: "iac", path: "iac", kind: "json" }] }));
    fs.writeFileSync(path.join(dir, "iac/last.json"), JSON.stringify({ value: 1 }));
    fs.writeFileSync(path.join(dir, "iac/other.json"), JSON.stringify({ a: 1, b: 2, c: 3 }));
    const ids = [];
    linked.forEach((subject, i) => {
      for (let k = 0; k < 6; k++) {
        const id = `company.zia.linked-${i}-${k}`;
        ids.push(id);
        const last = i === linked.length - 1;
        const record = {
          schema_version: 1, id, kind: "claim", relation: "extends", about: [subject], title: `Synthetic linked record ${i}-${k}`, status: "active",
          // The most strongly linked subject's first record alone is past the budget, and so is each of the least
          // linked subject's, whatever budget is left when they come.
          statement: "Synthetic fixture. ".repeat((i === 0 && k === 0) || last ? 1200 : 30), confidence: "medium", validated: "2026-01-01",
          // Every record points at IaC, so the ones printed whole carry dates. The least linked subject's are only
          // listed, so their file is never dated.
          pointers: last ? [{ repo: "iac", file: "last.json", pointer: "/value", label: "value" }]
            : ["a", "b", "c"].map((k) => ({ repo: "iac", file: "other.json", pointer: `/${k}`, label: k })),
        };
        fs.writeFileSync(path.join(dir, `knowledge/zia/${id}.json`), JSON.stringify(record));
      }
    });
    const log = path.join(bin, "calls");
    const git = execFileSync("sh", ["-c", "command -v git"], { encoding: "utf8" }).trim();
    // Every log answers with a date, so each IaC line printed whole is dated, as in a checked-out repo.
    fs.writeFileSync(path.join(bin, "git"), `#!/bin/sh\necho "$*" >> '${log}'\ncase " $* " in *" log "*) echo 2026-01-01 ;; *) exec '${git}' "$@" ;; esac\n`, { mode: 0o755 });
    const env = { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` };
    const out = execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "read", "--overlay", dir, "--company", area], { encoding: "utf8", env });
    const blocks = out.split("\n\n").filter((b) => b.startsWith("Company records about ") && !b.startsWith("Company records about linked subjects,"));
    assert.equal(blocks[0].split(":")[0], `Company records about ${linked[0]} (linked subject)`, "the most strongly linked subject's records come first");
    assert.match(out, /^Company records: \d+ printed whole; \d+ more listed at the end, \d+ one line each and \d+ by ID only\.$/m);
    assert.ok(blocks[0].includes("[company.zia.linked-0-1]") && !blocks[0].includes("[company.zia.linked-0-0]"), "a record past the budget lists only itself");
    const whole = blocks.reduce((n, b) => n + b.length + 2, 0) / 4;
    assert.ok(whole <= 4000 && blocks.length > 1, `${blocks.length} subjects' records whole, about ${whole} tokens`);
    assert.match(blocks[0], /^ {2}- IaC a: iac:other\.json#\/a = 1 \(committed 2026-01-01\)$/m, "records printed whole are dated, within the budget");
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

test("read --company lists the records the printed ones cite, one line each while they fit, then by ID", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kb-overlay-"));
  try {
    fs.mkdirSync(path.join(dir, "knowledge/zia"), { recursive: true });
    fs.mkdirSync(path.join(dir, "iac"));
    fs.writeFileSync(path.join(dir, "overlay.json"), JSON.stringify({ schema_version: 1, iac: [{ id: "iac", path: "iac", kind: "json" }] }));
    const claim = (id, about, statement) => fs.writeFileSync(path.join(dir, `knowledge/zia/${id}.json`), JSON.stringify({
      schema_version: 1, id, kind: "claim", relation: "extends", about: [about], title: `Synthetic ${id}, ${"with a long title ".repeat(5)}`, status: "active", statement, confidence: "medium", validated: "2026-01-01",
    }));
    // One record printed whole cites 120 that the read reaches no other way.
    const ids = Array.from({ length: 120 }, (_, i) => `company.zia.cited-${i}`);
    for (const id of ids) claim(id, "zdx.score", "Synthetic fixture.");
    claim("company.zia.citer", "zia.url-filtering", `Synthetic fixture citing ${ids.join(", ")}.`);
    const out = read("--overlay", dir, "--company", "zia.url-filtering");
    const cited = out.split("\n\n").find((b) => b.startsWith("Company records cited by the records above"));
    const more = cited.match(/^- (\d+) more cited, by ID: (.+)$/m);
    assert.ok(more, "past the list's room, cited records are named by ID");
    const lines = [...cited.matchAll(/^- \[(company\.zia\.cited-\d+)\] /gm)].map((m) => m[1]);
    assert.ok(cited.length - more[0].length <= 8000, `${cited.length - more[0].length} characters of lines`);
    assert.deepEqual([...lines, ...more[2].split(" ")], ids, "every cited record is named once, in order");
    assert.match(out, /^Company records: 1 printed whole; 120 cited by them, listed at the end\.$/m);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
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
    assert.match(out, /^ {2}- IaC .+ \(committed \d{4}-\d{2}-\d{2}\)$/m, "IaC files are dated");
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
