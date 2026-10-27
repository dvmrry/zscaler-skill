import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { anchorEvidence, buildGraph, captureText, idKind, loadPublic, materialDate, parseProse, validateGraph } from "./kb-lib.mjs";
import { loadOverlay, renderSubject, resolve, usableOverlay, validateOverlay } from "./kb-resolve.mjs";
import { loadSchemas, validate } from "./kb-schema.mjs";
import { snakeToCamel } from "./kb-types.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OVERLAY = path.join(ROOT, "scripts/fixtures/kb-overlay");
const GOLDEN = path.join(ROOT, "scripts/fixtures/kb-golden");

/** A throwaway repo: the real schemas and registries plus one fake capture source. */
function tmpRepo(files = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kb-"));
  fs.cpSync(path.join(ROOT, "references/_meta/schema"), path.join(root, "references/_meta/schema"), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "references/_meta/products.json"), path.join(root, "references/_meta/products.json"));
  fs.writeFileSync(path.join(root, "references/_meta/sources.json"), JSON.stringify({
    schema_version: 1,
    sources: { "fake-help": { kind: "submodule", root: "vendor/fake", rank: 5, title: "Fake source" } },
  }));
  fs.mkdirSync(path.join(root, "references/zia"), { recursive: true });
  fs.mkdirSync(path.join(root, "vendor/fake"), { recursive: true });
  for (const [rel, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), typeof body === "string" ? body : JSON.stringify(body, null, 2));
  }
  return root;
}

const subject = (over = {}) => ({
  schema_version: 1, id: "zia.example", title: "Example",
  claims: { "first-match": { statement: "Rules stop at the first match.", tier: "A", evidence: [{ source: "fake-help", path: "doc.txt", quotes: ["stops at the first match"] }] } },
  ...over,
});

const graphOf = (root) => buildGraph(loadPublic(root));
const messages = (root, opts) => validateGraph(graphOf(root), opts).errors.map((e) => e.message);

test("ID grammar classifies each separator", () => {
  assert.equal(idKind("zia.url-filtering.rule-order"), "subject");
  assert.equal(idKind("zia.url-filtering.rule-order:first-match"), "item");
  assert.equal(idKind("zia/url-filtering-rules"), "type");
  assert.equal(idKind("zia/url-filtering-rules#locations[].id"), "field");
  assert.equal(idKind("route-001"), null);
});

test("schema validator refuses keywords it does not implement", () => {
  const schemas = { "x.schema.json": { type: "object", if: {} } };
  assert.throws(() => validate(schemas, "x.schema.json", {}), /unsupported keyword "if"/);
});

test("a quote must occur exactly once unless an after-anchor sets context", () => {
  const root = tmpRepo({ "vendor/fake/doc.txt": "def a():\n  note: AND\n\ndef b():\n  note: AND\n" });
  const g = graphOf(root);
  const amb = anchorEvidence(g, { source: "fake-help", path: "doc.txt", quotes: ["note: AND"] });
  assert.match(amb.errors[0], /ambiguous/);
  const ok = anchorEvidence(g, { source: "fake-help", path: "doc.txt", after: "def b():", quotes: ["note: AND"] });
  assert.deepEqual(ok.errors, []);
  assert.equal(ok.anchors[0].line, 5);
  const missing = anchorEvidence(g, { source: "fake-help", path: "doc.txt", quotes: ["never written"] });
  assert.match(missing.errors[0], /not found/);
});

test("quotes anchor at each listed git ref; code removed at the pin fails there (a candidate fix)", () => {
  const root = tmpRepo();
  const repo = path.join(root, "vendor/fake");
  const git = (...a) => execFileSync("git", ["-C", repo, ...a], { stdio: "ignore" });
  git("init", "-q");
  git("config", "user.email", "t@example.com");
  git("config", "user.name", "t");
  fs.writeFileSync(path.join(repo, "sdk.go"), "func Update() {\n  r, _ := resp.(*Rule)\n  log(r.ID)\n}\n");
  git("add", ".");
  git("commit", "-q", "-m", "v1");
  git("tag", "v1.0.0");
  fs.writeFileSync(path.join(repo, "sdk.go"), "func Update() {\n  r, ok := resp.(*Rule)\n  if !ok { return }\n}\n");
  git("commit", "-q", "-am", "fix");
  const g = graphOf(root);
  const ev = { source: "fake-help", path: "sdk.go", quotes: ["r, _ := resp.(*Rule)"] };
  assert.deepEqual(anchorEvidence(g, { ...ev, at: ["v1.0.0"] }).errors, []);
  const both = anchorEvidence(g, { ...ev, at: ["v1.0.0", "HEAD"] });
  assert.equal(both.errors.length, 1);
  assert.match(both.errors[0], /quote not found/);
  assert.doesNotMatch(both.errors[0], /@v1\.0\.0/);
});

test("a pointer must resolve, and expect / expect_absent pin what the claim rests on", () => {
  const spec = { rules: [{ name: "action", type: "object", required: true }], keyed: { action: { type: "object", required: true } } };
  const g = graphOf(tmpRepo({ "vendor/fake/spec.json": spec }));
  const ev = { source: "fake-help", path: "spec.json", pointer: "/rules/0" };
  const keyed = { source: "fake-help", path: "spec.json", pointer: "/keyed/action" };
  assert.deepEqual(anchorEvidence(g, { ...keyed, expect: { type: "object", required: true } }).errors, []);
  assert.match(anchorEvidence(g, { ...keyed, expect: { required: false } }).errors[0], /member required is true, expected false/);
  assert.match(anchorEvidence(g, { ...ev, pointer: "/rules/9", expect: { name: "x" } }).errors.join(" "), /does not resolve/);
  assert.match(anchorEvidence(g, { ...ev, expect: { name: "action" } }).errors[0], /by index/);
  assert.deepEqual(anchorEvidence(g, { ...ev, pointer: "/rules/[name=action]", expect: { type: "object" } }).errors, []);
  assert.match(anchorEvidence(g, { ...ev, pointer: "/rules/[name=nope]", expect: { type: "object" } }).errors[0], /does not resolve/);
  // An absence is a claim too: expect_absent names members the object must not have.
  assert.deepEqual(anchorEvidence(g, { ...keyed, expect_absent: ["forwardingProfileId"] }).errors, []);
  assert.match(anchorEvidence(g, { ...keyed, expect_absent: ["required"] }).errors[0], /has member required, expected it to be absent/);
  const noExpect = tmpRepo({ "vendor/fake/spec.json": spec, "references/zia/zia.example.json": subject({ claims: { c: { statement: "s", tier: "A", evidence: [keyed] } } }) });
  assert.ok(messages(noExpect, { citations: false }).some((m) => /oneOf/.test(m)));
});

test("anchoring ignores PDF private-use glyphs and zero-width characters", () => {
  const root = tmpRepo({ "vendor/fake/doc.txt": "permitted without any\n   \nrestrictions if​ disabled" });
  const r = anchorEvidence(graphOf(root), { source: "fake-help", path: "doc.txt", quotes: ["permitted without any restrictions if disabled"] });
  assert.deepEqual(r.errors, []);
});

const para = (text, label) => (label ? { label, text } : { text });

test("prose may inline a claim once, refer back with |ref, and link only to real IDs", () => {
  assert.deepEqual([...parseProse([para("{{a}} and {{a|ref}}. [[zia.x]]")]).inlined], [["a", 1]]);
  const root = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject({ prose: [para("{{first-match}} again {{first-match}}. {{other|ref}} [[zia.missing]] [[doc:references/zia/gone.md]]")] }),
  });
  const errs = messages(root);
  assert.ok(errs.some((m) => /inlined 2 times/.test(m)));
  assert.ok(errs.some((m) => /\{\{other\|ref\}\} is not a claim/.test(m)));
  assert.ok(errs.some((m) => /\[\[zia\.missing\]\] does not resolve/.test(m)));
  assert.ok(errs.some((m) => /\[\[doc:references\/zia\/gone\.md\]\] does not exist/.test(m)));
  const silent = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject({ prose: [para("Rules are evaluated in order.")] }),
  });
  assert.ok(messages(silent).some((m) => /claim first-match is never inlined/.test(m)));
});

test("prose lives in the subject JSON as blocks, with no Markdown in it", () => {
  const root = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject({
      prose: [para("{{first-match}} See [the doc](../x.md)."), para("**Bold.** [[zia.example]]"), para("- a list [[zia.example]]"), para("[[zia.example]]", "1. A numbered label is fine")],
    }),
    "references/zia/zia.example.md": "{{first-match}}",
  });
  const errs = messages(root);
  assert.ok(errs.some((m) => /subject prose lives in the subject JSON/.test(m)));
  assert.ok(errs.some((m) => /prose\[0\]: a Markdown link/.test(m)));
  assert.ok(errs.some((m) => /prose\[1\]: Markdown emphasis/.test(m)));
  assert.ok(errs.some((m) => /prose\[2\]: Markdown block syntax/.test(m)));
  assert.ok(!errs.some((m) => /prose\[3\]/.test(m)));
});

test("every prose sentence rests on a marker, except a short lead, labels and headings", () => {
  const lead = para("Framing one. Framing two.");
  const loose = (blocks) => parseProse(blocks).unanchored.map((u) => u.text);
  assert.deepEqual(loose([lead, { heading: "A heading" }, para("{{a}} {{gap:g}} [[zia.x]]", "Label.")]), []);
  assert.deepEqual(loose([para("Framing one. Framing two. Framing three.")]), ["Framing three."]);
  // A doc that is not converted yet anchors too; migrate-links retargets it later.
  assert.deepEqual(loose([lead, para("Subclouds are covered in [[doc:references/shared/subclouds.md]].")]), []);
  // A claim renders as a whole sentence, so text after its marker is a sentence of its own.
  assert.deepEqual(loose([lead, para("{{a}} Then a loose remark.")]), ["Then a loose remark."]);
  assert.deepEqual(loose([lead, { items: [para("{{a}}"), para("A loose item.")] }]), ["A loose item."]);
  assert.deepEqual(loose([lead, { table: { columns: ["A", "B"], rows: [["x", "{{a}}"], ["y", "z loose"]] } }]), ["y | z loose"]);
  assert.equal(parseProse([lead, para("the rule order.", "What to check:")]).whatToCheck, 1);
});

test("checks and item markers name real claims, gaps or divergences", () => {
  const root = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject({
      gaps: { order: { kind: "semantic", title: "Order", status: "open", detail: "d", resolves_with: ["lab-test"] } },
      checks: [{ do: "Check the order.", uses: ["first-match", "order", "zia.example"] }, { do: "Check more.", uses: ["nothing"] }],
      prose: [{ text: "{{first-match}} {{gap:order}} {{divergence:none}}" }],
    }),
  });
  const errs = messages(root);
  assert.ok(errs.some((m) => /checks\[1\] uses nothing/.test(m)));
  assert.ok(!errs.some((m) => /checks\[0\]/.test(m)));
  assert.ok(errs.some((m) => /\{\{divergence:none\}\} is not a divergence/.test(m)));
  assert.ok(!errs.some((m) => /\{\{gap:order\}\}/.test(m)));
});

test("capture quotes ignore the vendor's emphasis; other sources keep **", () => {
  const sources = (kind) => JSON.stringify({ schema_version: 1, sources: { "fake-help": { kind, root: "vendor/fake", rank: 5, title: "Fake" } } });
  const body = "| NAT-T | **Enabled** Disabled |\ndef f(**kwargs): pass\n";
  const quotes = ["| NAT-T | Enabled Disabled |", "def f(kwargs)"];
  const capture = tmpRepo({ "references/_meta/sources.json": sources("capture"), "vendor/fake/doc.txt": body });
  assert.deepEqual(anchorEvidence(graphOf(capture), { source: "fake-help", path: "doc.txt", quotes }).errors, []);
  const code = tmpRepo({ "vendor/fake/doc.txt": body });
  assert.equal(anchorEvidence(graphOf(code), { source: "fake-help", path: "doc.txt", quotes }).errors.length, 2);
});

test("every capture's anchoring text is the same in JavaScript and in help_capture.py", () => {
  const dir = path.join(ROOT, "vendor/zscaler-help");
  const py = [
    "import hashlib, json, sys",
    `sys.path.insert(0, ${JSON.stringify(path.join(ROOT, "scripts"))})`,
    "from help_capture import read, text_of",
    "from pathlib import Path",
    `root = Path(${JSON.stringify(dir)})`,
    `out = {str(p.relative_to(root)): hashlib.sha256(text_of(d["blocks"]).encode()).hexdigest() for p in sorted(root.rglob("*.json")) if (d := read(p)) and d["kind"] in ("help-article", "automate-doc")}`,
    "print(json.dumps(out))",
  ].join("\n");
  const expected = JSON.parse(execFileSync("python3", ["-c", py], { encoding: "utf8", maxBuffer: 16 << 20 }));
  assert.ok(Object.keys(expected).length > 0);
  for (const [name, sha] of Object.entries(expected)) {
    const doc = JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
    const got = crypto.createHash("sha256").update(captureText(doc.blocks)).digest("hex");
    assert.equal(got, sha, name);
  }
});

test("every file under vendor/zscaler-help is a tool capture or listed as static, and notes are never evidence", () => {
  const sha = (t) => crypto.createHash("sha256").update(t).digest("hex");
  const article = (url) => ({ schema_version: 1, kind: "help-article", title: "T", source: { url, node: "1", revision: "2" }, captured_at: "2026-10-18", blocks: [{ text: "Rules stop at the first match." }] });
  const root = tmpRepo({
    "references/_meta/sources.json": { schema_version: 1, sources: { "zscaler-help": { kind: "capture", root: "vendor/zscaler-help", rank: 5, title: "Help" } } },
    "vendor/zscaler-help/a.json": article("https://help.zscaler.com/zia/a"),
    "vendor/zscaler-help/a-again.json": article("https://help.zscaler.com/zia/a"),
    "vendor/zscaler-help/stray.md": "hand-written",
    "vendor/zscaler-help/edited.pdf": "now different",
    "vendor/zscaler-help/notes.md": "our own notes",
    "references/_meta/static-captures.json": {
      schema_version: 1,
      files: {
        "edited.pdf": { class: "pdf", reason: "vendor PDF", sha256: sha("as listed") },
        "notes.md": { class: "note", reason: "authored", sha256: sha("our own notes") },
        "gone.pdf": { class: "pdf", reason: "vendor PDF", sha256: sha("x") },
      },
      retired: { "stray.md": { replaced_by: "nowhere.json", reason: "duplicate", on: "2026-10-18" } },
    },
    "references/zia/zia.example.json": subject({
      claims: { "from-note": { statement: "Notes say so.", tier: "A", evidence: [{ source: "zscaler-help", path: "notes.md", quotes: ["our own notes"] }] } },
      prose: [{ text: "{{from-note}}" }],
    }),
  });
  const errs = messages(root);
  assert.ok(errs.some((m) => /captures the same page as a(-again)?\.json/.test(m)));
  assert.ok(errs.some((m) => /not written by scripts\/help_capture\.py and not listed/.test(m)));
  assert.ok(errs.some((m) => /edited\.pdf changed since it was listed/.test(m)));
  assert.ok(errs.some((m) => /gone\.pdf is listed but does not exist/.test(m)));
  assert.ok(errs.some((m) => /notes\.md is an authored note/.test(m)));
  assert.ok(errs.some((m) => /stray\.md is listed as retired but still exists/.test(m)));
  assert.ok(errs.some((m) => /retired for nowhere\.json, which does not exist/.test(m)));
});

test("a citation's date is the material's own, never the day the file was captured", () => {
  const root = tmpRepo({
    "references/_meta/sources.json": { schema_version: 1, sources: { "zscaler-help": { kind: "capture", root: "vendor/zscaler-help", rank: 5, title: "Help" } } },
    "vendor/zscaler-help/a.json": {
      schema_version: 1, kind: "help-article", title: "A", captured_at: "2026-10-18", blocks: [{ text: "x" }],
      source: { url: "https://help.zscaler.com/zia/a", node: "1", revision: "2", updated: "2025-03-01", updated_basis: "pdf-last-modified" },
    },
    "vendor/zscaler-help/coll.json": "{}",
    "vendor/zscaler-help/plain.txt": "text",
    "references/_meta/capture-manifest.json": {
      schema_version: 1,
      files: {
        "vendor/zscaler-help/coll.json": { captured_from: "https://x/c_09_29_2026.json", captured_at: "2026-10-18", sha256: "0".repeat(64), updated: "2026-09-29", updated_basis: "release-filename" },
        "vendor/zscaler-help/plain.txt": { captured_from: null, captured_at: "2026-10-18", sha256: "0".repeat(64) },
      },
    },
  });
  const g = graphOf(root);
  assert.deepEqual(materialDate(g, { source: "zscaler-help", path: "a.json" }), { as_of: "2025-03-01", basis: "pdf-last-modified" });
  assert.deepEqual(materialDate(g, { source: "zscaler-help", path: "coll.json" }), { as_of: "2026-09-29", basis: "release-filename" });
  // Only a capture date is known: the material is undated, not "as of the capture".
  assert.equal(materialDate(g, { source: "zscaler-help", path: "plain.txt" }), null);
});

test("references must resolve to the right kind of node", () => {
  const root = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject({
      related: [{ rel: "see-also", to: "zia.nowhere" }],
      cases: { c: { kind: "rule-evaluation", claims: ["first-match"], config: {}, request: { url: "x" }, expect: { verdict: "ambiguous" } } },
    }),
  });
  const errs = messages(root);
  assert.ok(errs.some((m) => /unknown ID zia\.nowhere/.test(m)));
  assert.ok(errs.some((m) => /ambiguous expectation must name its gap/.test(m)));
});

test("only an observed (Tier B) claim can settle a divergence by observation", () => {
  const ev = { source: "fake-help", path: "doc.txt", quotes: ["stops at the first match"] };
  const root = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject({
      divergences: {
        d: {
          summary: "Docs and behavior disagree.", impact: "Wrong answers.",
          positions: [{ evidence: ev, says: "A" }, { evidence: ev, says: "B" }],
          resolution: { by: "first-match", rule: "observed-supersedes-documentation" },
        },
      },
    }),
  });
  assert.ok(messages(root).some((m) => /needs an observed \(Tier B\) claim/.test(m)));
});

test("a divergence fixed upstream must pin its outdated position to a release", () => {
  const ev = { source: "fake-help", path: "doc.txt", quotes: ["stops at the first match"] };
  const root = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject({
      divergences: {
        d: {
          summary: "Two sources disagree.", impact: "Wrong answers.",
          positions: [{ evidence: ev, says: "A" }, { evidence: ev, says: "B" }],
          resolution: { by: "first-match", rule: "fixed-upstream" },
        },
      },
    }),
  });
  // Every position still describes the current pin, so nothing says which release was outdated.
  assert.ok(messages(root).some((m) => /fixed-upstream needs the outdated position pinned/.test(m)));
});

test("a derived claim names real claims, and Tier A needs its own evidence", () => {
  const root = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject({
      claims: {
        "first-match": { statement: "Rules stop at the first match.", tier: "A", evidence: [{ source: "fake-help", path: "doc.txt", quotes: ["stops at the first match"] }] },
        chained: { statement: "So later rules are skipped.", tier: "A", derived_from: ["first-match", "missing"] },
        bare: { statement: "So it is slow.", tier: "B", derived_from: ["first-match"] },
        observed: { statement: "A tenant saw it.", tier: "B", derived_from: ["first-match"], conditions: "Observed once." },
        "on-observed": { statement: "Rules stop at the first match, as seen.", tier: "A", derived_from: ["observed"], evidence: [{ source: "fake-help", path: "doc.txt", quotes: ["stops at the first match"] }] },
      },
    }),
  });
  const errs = messages(root);
  assert.ok(errs.some((m) => /a Tier A claim needs its own evidence/.test(m)));
  assert.ok(errs.some((m) => /unknown ID zia\.example:missing/.test(m)));
  assert.ok(errs.some((m) => /on-observed: a Tier A claim cannot follow from Tier B zia\.example:observed/.test(m)));
  assert.ok(!errs.some((m) => /observed: a Tier B claim needs conditions/.test(m)));
  assert.ok(errs.some((m) => /bare: a Tier B claim needs conditions/.test(m)));
});

test("a subject's file name and directory must match its ID", () => {
  const root = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.other.json": subject(),
  });
  assert.ok(messages(root).some((m) => /file name must equal id/.test(m)));
});

test("the committed graph validates (structure and references)", () => {
  const { errors } = validateGraph(graphOf(ROOT), { citations: false });
  assert.deepEqual(errors, []);
});

test("every subject renders, including derived claims that carry no evidence of their own", () => {
  const g = graphOf(ROOT);
  const derivedOnly = [...g.nodes].filter(
    ([, n]) => n.kind === "subject" && Object.values(n.data.claims || {}).some((c) => !c.evidence && c.derived_from),
  );
  assert.ok(derivedOnly.length > 0);
  for (const [id] of derivedOnly.slice(0, 20)) assert.doesNotThrow(() => renderSubject(g, id), id);
});

test("a rendered gap or divergence marker says its state, not always 'open'", () => {
  const g = graphOf(ROOT);
  const text = renderSubject(g, "zia.cloud-app-control.api-surface");
  assert.match(text, /\(resolved gap `python-risk-profile-runtime`\)/);
  assert.match(text, /\(resolved divergence `risk-profile-shape`\)/);
  assert.doesNotMatch(text, /\(open gap `python-risk-profile-runtime`\)/);
});

test("the synthetic overlay validates, and the relation table is enforced", () => {
  const g = graphOf(ROOT);
  assert.deepEqual(validateOverlay(g, loadOverlay(g, OVERLAY)), []);
  const bad = fs.mkdtempSync(path.join(os.tmpdir(), "kb-ov-"));
  fs.cpSync(OVERLAY, bad, { recursive: true });
  const rec = path.join(bad, "knowledge/zia/company.zia.first-pass-user-context.json");
  const data = JSON.parse(fs.readFileSync(rec, "utf8"));
  data.about = ["zia.ssl-inspection.pipeline"];
  delete data.scope;
  fs.writeFileSync(rec, JSON.stringify(data));
  const iac = path.join(bad, "knowledge/zia/company.zia.url-filtering-iac.json");
  const cov = JSON.parse(fs.readFileSync(iac, "utf8"));
  cov.pointers[0].pointer = "/resources/missing";
  fs.writeFileSync(iac, JSON.stringify(cov));
  const errs = validateOverlay(g, loadOverlay(g, bad)).map((e) => e.message);
  assert.ok(errs.some((m) => /narrows must target public claims only/.test(m)));
  assert.ok(errs.some((m) => /narrows requires scope/.test(m)));
  assert.ok(errs.some((m) => /IaC pointer does not resolve/.test(m)));
});

test("overlay IaC is a list of repos: JSON pointers into infrawright repos, addresses into terraform repos", () => {
  const g = graphOf(ROOT);
  const bad = fs.mkdtempSync(path.join(os.tmpdir(), "kb-ov-"));
  fs.cpSync(OVERLAY, bad, { recursive: true });
  const iac = path.join(bad, "knowledge/zia/company.zia.url-filtering-iac.json");
  const cov = JSON.parse(fs.readFileSync(iac, "utf8"));
  cov.pointers.push(
    { repo: "zia-tf", file: "url_filtering.tf", pointer: "/resource", label: "a JSON pointer into HCL" },
    { repo: "nowhere", file: "x.json", pointer: "/a", label: "an undeclared repo" },
  );
  fs.writeFileSync(iac, JSON.stringify(cov));
  const claim = path.join(bad, "knowledge/zia/company.zia.first-pass-user-context.json");
  const c = JSON.parse(fs.readFileSync(claim, "utf8"));
  delete c.validated;
  fs.writeFileSync(claim, JSON.stringify(c));
  const errs = validateOverlay(g, loadOverlay(g, bad)).map((e) => e.message);
  assert.ok(errs.some((m) => /zia-tf is a terraform repo: name a resource address/.test(m)));
  assert.ok(errs.some((m) => /IaC repo "nowhere", which overlay.json iac does not declare/.test(m)));
  assert.ok(errs.some((m) => /a claim needs validated/.test(m)));
  // The committed fixture resolves: the terraform pointer is a location, the infrawright pointer a value.
  const bundle = resolve(g, "zia/url-filtering-rules", { overlay: loadOverlay(g, OVERLAY) });
  const facet = bundle.company.find((f) => f.id === "company.zia.url-filtering-iac") || bundle.types?.flatMap((t) => t.company || []).find((f) => f.id === "company.zia.url-filtering-iac");
  assert.ok(facet, "the IaC record reaches the type bundle");
  assert.ok(facet.iac.some((x) => x.location === "zia-tf:url_filtering.tf zia_url_filtering_rules.block_gambling"));
  assert.ok(facet.iac.some((x) => x.source?.startsWith("iac:coverage.json#") && x.value !== null));
});

test("resolve degrades on a bad overlay: an invalid record is dropped, an unresolved pointer reported, never a failure", () => {
  const g = graphOf(ROOT);
  const bad = fs.mkdtempSync(path.join(os.tmpdir(), "kb-ov-"));
  fs.cpSync(OVERLAY, bad, { recursive: true });
  fs.rmSync(path.join(bad, "iac"), { recursive: true }); // a repo that is not checked out
  const claim = path.join(bad, "knowledge/zia/company.zia.first-pass-user-context.json");
  const c = JSON.parse(fs.readFileSync(claim, "utf8"));
  delete c.validated;
  fs.writeFileSync(claim, JSON.stringify(c));
  const ov = usableOverlay(g, loadOverlay(g, bad));
  assert.ok(!ov.records.some((r) => r.data.id === "company.zia.first-pass-user-context"), "the invalid record is dropped");
  const b = resolve(g, "zia/url-filtering-rules", { overlay: ov });
  const repo = b.tiers.iac.repos.find((r) => r.id === "iac");
  assert.equal(repo.available, false);
  assert.ok(b.tiers.iac.repos.find((r) => r.id === "zia-tf").path.endsWith("zia-tf"), "a repo's path is in the bundle");
  const facet = b.company.find((f) => f.id === "company.zia.url-filtering-iac");
  assert.ok(facet.iac.some((x) => /IaC file not found/.test(x.error || "")), "the record stays, its pointer carries the error");
  const schemas = loadSchemas(path.join(ROOT, "references/_meta/schema"));
  assert.deepEqual(validate(schemas, "bundle.schema.json", b), []);
});

test("resolve --each returns one bundle per argument in one call", () => {
  const out = execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "resolve", "--no-overlay", "--each", "zia.url-filtering", "zpa.microtenants.lifecycle"], { encoding: "utf8" });
  const bundles = JSON.parse(out);
  assert.deepEqual(bundles.map((b) => b.resolved.id), ["zia.url-filtering", "zpa.microtenants.lifecycle"]);
});

test("resolve --company carries only the company facets, identical to the full bundle's", () => {
  const run = (...a) => execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "resolve", "--overlay", OVERLAY, "--each", ...a], { encoding: "utf8" });
  const ids = ["zia.url-filtering", "zia/url-filtering-rules", "zia.url-filtering.rule-order"];
  const full = JSON.parse(run(...ids));
  const out = run("--company", ...ids);
  const views = JSON.parse(out);
  const schemas = loadSchemas(path.join(ROOT, "references/_meta/schema"));
  views.forEach((v, i) => {
    assert.deepEqual(validate(schemas, "bundle.schema.json", v), []);
    assert.equal(v.view, "company");
    assert.deepEqual(v.company, full[i].company);
    assert.equal(v.subject, undefined);
  });
  assert.ok(views[0].company.length > 0, "the fixture overlay has a facet on zia.url-filtering");
  assert.ok(out.length * 4 < JSON.stringify(full).length, `company ${out.length} bytes`);
});

test("map lists every subject once under its area, and the types", () => {
  const g = buildGraph(loadPublic(ROOT));
  const out = execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "map", "--no-overlay"], { encoding: "utf8" });
  const subjects = [...g.nodes.values()].filter((n) => n.kind === "subject");
  let area = null;
  const listed = [];
  for (const line of out.split("\n")) {
    const head = line.match(/^## (\S+) \(\d+ subjects?, ~\d+k tokens\)$/);
    if (head) { area = head[1]; continue; }
    if (line.startsWith("## Types")) { area = null; continue; }
    if (area && line) listed.push(line.startsWith(".") ? area + line.split(" — ")[0] : line.split(" — ")[0]);
  }
  assert.deepEqual(listed.sort(), subjects.map((n) => n.id).sort());
  assert.match(out, /^zia\/web-log — /m, "types are listed by ID");
});

test("read gives an area's subjects as text with citable claim IDs and no evidence; company records with an overlay", () => {
  const run = (...a) => execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "read", ...a], { encoding: "utf8" });
  const g = buildGraph(loadPublic(ROOT));
  const out = run("--no-overlay", "--no-links", "zia.url-filtering");
  for (const n of g.nodes.values()) {
    if (n.kind === "subject" && n.id.startsWith("zia.url-filtering.")) assert.ok(out.includes(`(${n.id})\n`), `${n.id} is read`);
    if (n.kind === "claim" && n.subject.startsWith("zia.url-filtering.")) assert.ok(out.includes(`[${n.id}]`), `${n.id} is marked`);
  }
  const quote = g.nodes.get("zia.url-filtering.rule-order:first-match").data.evidence[0].quotes[0];
  assert.ok(!out.includes(quote.trim()), "evidence quotes stay out");
  assert.match(run("--no-overlay", "zia.nope"), /no subject, type or area has this ID/);
  const linked = run("--no-overlay", "zia.url-filtering.rule-order");
  assert.match(linked, /## Linked subjects \(one hop from what was read\)\n\n# .*\(zia\.url-categories\.membership\)/s, "a subject the prose links to is read next");
  assert.equal(spawnSync("node", [path.join(ROOT, "scripts/kb.mjs"), "read", "--bogus", "zia"], { encoding: "utf8" }).status, 2);
  const withOverlay = run("--overlay", OVERLAY, "zia/url-filtering-rules");
  assert.match(withOverlay, /^IaC repos: /m);
  assert.match(withOverlay, /Company records:\n- \[company\.zia\./);
});

test("resolve rejects an unknown flag instead of searching for it", () => {
  const r = spawnSync("node", [path.join(ROOT, "scripts/kb.mjs"), "resolve", "--no-overlay", "--help"], { encoding: "utf8" });
  assert.equal(r.status, 2);
  assert.equal(r.stdout, "");
  assert.match(r.stderr, /unknown option --help/);
});

test("resolve --compact gives labels and one-line claims that fit the bundle schema, much smaller than full", () => {
  const run = (...a) => execFileSync("node", [path.join(ROOT, "scripts/kb.mjs"), "resolve", "--overlay", OVERLAY, "--each", ...a], { encoding: "utf8" });
  const ids = ["zia.url-filtering.rule-order", "zia/url-filtering-rules", "zpa.microtenants.lifecycle", "wildcard"];
  const full = run(...ids);
  const out = run("--compact", ...ids);
  assert.ok(out.length * 3 < full.length, `compact ${out.length} bytes vs full ${full.length}`);
  const [subject, type, other, candidates] = JSON.parse(out);
  const schemas = loadSchemas(path.join(ROOT, "references/_meta/schema"));
  for (const b of [subject, type, other, candidates]) assert.deepEqual(validate(schemas, "bundle.schema.json", b), []);
  assert.equal(subject.view, "compact");
  assert.equal(subject.subject, undefined, "no prose body");
  // Claims inlined in prose carry no statement in the full bundle; the compact view states every claim.
  const firstMatch = subject.summary.claims.find((c) => c.id === "zia.url-filtering.rule-order:first-match");
  assert.match(firstMatch.statement, /first rule whose criteria all match/);
  assert.ok(subject.summary.claims.every((c) => c.statement.length <= 200));
  assert.ok(subject.summary.neighbors.length > 0);
  assert.equal(type.view, "compact");
  // Company facets are what an overlay answer needs from the resolver: the compact view keeps them whole.
  const fullType = JSON.parse(full)[1];
  assert.deepEqual(type.summary.company, fullType.company);
  assert.ok(type.summary.company.some((f) => f.id === "company.zia.url-filtering-iac"));
  assert.equal(candidates.view, undefined, "candidate lists pass through unchanged");
  assert.ok(candidates.candidates.length > 0);
});

test("resolve follows former IDs and returns candidates for ambiguous text", () => {
  const g = graphOf(ROOT);
  assert.equal(resolve(g, "zia-02").resolved.id, "zia.url-categories.membership:same-specificity-collision");
  const r = resolve(g, "wildcard");
  assert.equal(r.resolved, null);
  assert.ok(r.candidates.some((c) => c.id === "zia.url-categories.entry-matching"));
});

// Line numbers are computed at render time and move with every vendor bump; goldens ignore them.
// IaC commit dates move with every overlay commit, and a source's as-of date with every capture refresh, so
// goldens ignore them too; the bundle schema still checks their shape.
const VOLATILE = new Set(["line", "lines", "committed", "as_of"]);
const stripLines = (v) => JSON.parse(JSON.stringify(v, (k, x) => (VOLATILE.has(k) ? undefined : x)));

test("a question with no alias match returns ranked candidates, deterministically, never auto-resolved", () => {
  const g = graphOf(ROOT);
  const schemas = loadSchemas(path.join(ROOT, "references/_meta/schema"));
  const q = "Our Conditional Access rule in ZIA URL Filtering matches traffic but no MFA prompt ever appears. What should we check first?";
  const a = resolve(g, q);
  assert.deepEqual(validate(schemas, "bundle.schema.json", a), []);
  assert.equal(a.match, "ranked");
  assert.equal(a.resolved, null);
  assert.ok(a.candidates.length > 0 && a.candidates.filter((c) => c.kind === "subject").length <= 8);
  assert.ok(a.candidates.some((c) => c.id === "zidentity.step-up"), "the step-up subject ranks for an MFA-prompt question");
  assert.deepEqual(resolve(g, q).candidates, a.candidates, "same query, same order");
  assert.ok(a.candidates.filter((c) => c.kind === "subject").every((c) => typeof c.matched === "string"), "each ranked subject says which line matched");
  const kinds = a.candidates.map((c) => c.kind);
  assert.ok(kinds.lastIndexOf("subject") < (kinds.indexOf("type") === -1 ? Infinity : kinds.indexOf("type")), "types follow subjects");
  assert.ok(kinds.filter((k) => k === "type").length <= 2, "at most two types");
  assert.equal(resolve(g, "the of and").candidates.length, 0, "stop words alone rank nothing");
});

test("ranked resolve counts company records against the subject they are about", () => {
  const g = graphOf(ROOT);
  const ov = loadOverlay(g, OVERLAY);
  const q = "synthetic fixture first pass on our GRE locations";
  const without = resolve(g, q).candidates.map((c) => c.id);
  const withOv = resolve(g, q, { overlay: ov });
  const hit = withOv.candidates.find((c) => c.id === "zia.ssl-inspection.pipeline");
  assert.ok(hit, "the record's words lift the public subject it is about");
  const lines = [hit.matched, hit.matched_company].filter(Boolean);
  assert.ok(lines.some((l) => /^\[company\] /.test(l)), "its statement is a matched line");
  assert.ok(!hit.matched_company || !/^\[company\] /.test(hit.matched), "a public line leads when both fit");
  assert.ok(!without.includes("zia.ssl-inspection.pipeline") || without.indexOf("zia.ssl-inspection.pipeline") > withOv.candidates.indexOf(hit));
  assert.deepEqual(resolve(g, q).candidates.map((c) => c.id), without, "the public index is unchanged by an overlay query");
});

test("a matched line is scored on its visible words, not on the IDs inside its links", () => {
  const g = graphOf(ROOT);
  const b = resolve(g, "Does OAuth authentication work the same across PAC, GRE and Z-Tunnel forwarding paths?");
  for (const c of b.candidates.filter((x) => x.matched)) {
    const seen = c.matched.replace(/\[\[[^\]]*\]\]/g, " ");
    assert.ok(/[a-z]{3}/i.test(seen), `${c.id}: matched line has visible words`);
  }
});

test("a subject bundle lists its parent, children and siblings", () => {
  const g = graphOf(ROOT);
  const leaf = resolve(g, "zpa.microtenants.admin-permissions");
  assert.deepEqual(leaf.neighbors.find((n) => n.rel === "parent"), { id: "zpa.microtenants", title: g.nodes.get("zpa.microtenants").data.title, rel: "parent" });
  assert.ok(leaf.neighbors.some((n) => n.id === "zpa.microtenants.lifecycle" && n.rel === "sibling"));
  const hub = resolve(g, "zcc.z-tunnel");
  assert.ok(hub.neighbors.some((n) => n.rel === "child"), "a hub lists the children that hold its facts");
  assert.ok(!resolve(g, "zia.url-filtering").neighbors.some((n) => n.rel === "sibling"), "an area subject lists no siblings");
});

test("a product name resolves to its areas, generated from subject IDs", () => {
  const g = graphOf(ROOT);
  const schemas = loadSchemas(path.join(ROOT, "references/_meta/schema"));
  for (const q of ["zia", "ZIA", "Client Connector", "shared"]) {
    const bundle = resolve(g, q);
    assert.deepEqual(validate(schemas, "bundle.schema.json", bundle), [], q);
    assert.equal(bundle.resolved.kind, "product", q);
  }
  const zia = resolve(g, "zia");
  const urlFiltering = zia.areas.find((a) => a.id === "zia.url-filtering");
  assert.ok(urlFiltering.title, "an area with its own subject carries its title");
  assert.ok(urlFiltering.subjects.includes("zia.url-filtering.rule-order"));
  // A product alias that a subject also claims goes to the subject.
  assert.equal(resolve(g, "AI Guard").resolved?.id, "ai-security.ai-guard");
  const sdkPython = resolve(g, "shared").areas.find((a) => a.id === "shared.sdk-python");
  assert.equal(sdkPython.title, undefined, "an area without a subject of its own lists only its subjects");
  assert.ok(sdkPython.subjects.includes("shared.sdk-python.retries"));
});

test("bundles match the golden files and the bundle contract", () => {
  const g = graphOf(ROOT);
  const ov = loadOverlay(g, OVERLAY);
  const schemas = loadSchemas(path.join(ROOT, "references/_meta/schema"));
  for (const q of ["zia/url-filtering-rules", "zia.url-filtering.rule-order", "zia/web-log"]) {
    const bundle = resolve(g, q, { overlay: ov });
    assert.deepEqual(validate(schemas, "bundle.schema.json", bundle), [], q);
    const golden = JSON.parse(fs.readFileSync(path.join(GOLDEN, `${q.replace("/", "_")}.json`), "utf8"));
    assert.deepEqual(stripLines(bundle), golden, `golden mismatch for ${q}; regenerate after an intended change`);
  }
});

test("the surface layer links a Terraform resource through its SDK package to API operations", async () => {
  const { lookupSurface } = await import("./kb-surface.mjs");
  const [hit] = lookupSurface(ROOT, "resource:zia_firewall_filtering_rule");
  assert.deepEqual(hit.sdk_go, ["firewallpolicies/filteringrules"]);
  assert.ok(hit.api.includes("/firewallFilteringRules/{ruleId}"));
  const [byPath] = lookupSurface(ROOT, "/zia/api/v1/firewallFilteringRules");
  assert.ok(byPath.reached_by.terraform.includes("resource:zia_firewall_filtering_rule"));
  const [zdx] = lookupSurface(ROOT, "zdx");
  assert.equal(zdx.match, "product");
  assert.ok(zdx.api.includes("/v1/alerts/ongoing") && zdx.sdk_python.alerts.methods.length && !zdx.terraform.length);
});

test("Terraform field paths convert to API field paths", () => {
  assert.equal(snakeToCamel("url_categories2"), "urlCategories2");
  assert.equal(snakeToCamel("departments.name"), "departments.name");
  assert.equal(snakeToCamel("last_modified_by"), "lastModifiedBy");
});
