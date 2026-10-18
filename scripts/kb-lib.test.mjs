import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { anchorEvidence, buildGraph, idKind, loadPublic, parseProse, validateGraph } from "./kb-lib.mjs";
import { loadOverlay, resolve, validateOverlay } from "./kb-resolve.mjs";
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

test("a pointer must resolve, and expect pins the members the claim rests on", () => {
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
  const noExpect = tmpRepo({ "vendor/fake/spec.json": spec, "references/zia/zia.example.json": subject({ claims: { c: { statement: "s", tier: "A", evidence: [keyed] } } }) });
  assert.ok(messages(noExpect, { citations: false }).some((m) => /oneOf/.test(m)));
});

test("anchoring ignores PDF private-use glyphs and zero-width characters", () => {
  const root = tmpRepo({ "vendor/fake/doc.txt": "permitted without any\n   \nrestrictions if​ disabled" });
  const r = anchorEvidence(graphOf(root), { source: "fake-help", path: "doc.txt", quotes: ["permitted without any restrictions if disabled"] });
  assert.deepEqual(r.errors, []);
});

test("prose may inline a claim once, refer back with |ref, and link only to real IDs", () => {
  assert.deepEqual([...parseProse("{{a}} and {{a|ref}}. [[zia.x]]").inlined], [["a", 1]]);
  const root = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject(),
    "references/zia/zia.example.md": "{{first-match}} again {{first-match}}. {{other|ref}} [[zia.missing]]",
  });
  const errs = messages(root);
  assert.ok(errs.some((m) => /inlined 2 times/.test(m)));
  assert.ok(errs.some((m) => /\{\{other\|ref\}\} is not a claim/.test(m)));
  assert.ok(errs.some((m) => /\[\[zia\.missing\]\] does not resolve/.test(m)));
  const silent = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject(),
    "references/zia/zia.example.md": "Rules are evaluated in order.",
  });
  assert.ok(messages(silent).some((m) => /claim first-match is never inlined/.test(m)));
});

test("every prose sentence rests on a marker, except a short lead, labels and headings", () => {
  const lead = "Framing one. Framing two.";
  assert.deepEqual(parseProse(`${lead}\n\n**Label.** {{a}} {{gap:g}} [[zia.x]]`).unanchored, []);
  assert.deepEqual(parseProse(`${lead} Framing three.`).unanchored, ["Framing three."]);
  // A link to a doc that is not converted yet anchors too; migrate-links retargets it later.
  assert.deepEqual(parseProse(`${lead}\n\nSubclouds are covered in [subclouds](../shared/subclouds.md).`).unanchored, []);
  // A claim renders as a whole sentence, so text after its marker is a sentence of its own.
  assert.deepEqual(parseProse(`${lead}\n\n{{a}} Then a loose remark.`).unanchored, ["Then a loose remark."]);
  assert.deepEqual(parseProse(`${lead}\n\n- {{a}}\n- A loose item.`).unanchored, ["A loose item."]);
  assert.equal(parseProse(`${lead}\n\nWhat to check: the rule order.`).whatToCheck, 1);
});

test("checks and item markers name real claims, gaps or divergences", () => {
  const root = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject({
      gaps: { order: { kind: "semantic", title: "Order", status: "open", detail: "d", resolves_with: ["lab-test"] } },
      checks: [{ do: "Check the order.", uses: ["first-match", "order", "zia.example"] }, { do: "Check more.", uses: ["nothing"] }],
    }),
    "references/zia/zia.example.md": "{{first-match}} {{gap:order}} {{divergence:none}}",
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

test("a derived claim names real claims, and Tier A needs its own evidence", () => {
  const root = tmpRepo({
    "vendor/fake/doc.txt": "evaluation stops at the first match.",
    "references/zia/zia.example.json": subject({
      claims: {
        "first-match": { statement: "Rules stop at the first match.", tier: "A", evidence: [{ source: "fake-help", path: "doc.txt", quotes: ["stops at the first match"] }] },
        chained: { statement: "So later rules are skipped.", tier: "A", derived_from: ["first-match", "missing"] },
      },
    }),
  });
  const errs = messages(root);
  assert.ok(errs.some((m) => /a Tier A claim needs its own evidence/.test(m)));
  assert.ok(errs.some((m) => /unknown ID zia\.example:missing/.test(m)));
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

test("resolve follows former IDs and returns candidates for ambiguous text", () => {
  const g = graphOf(ROOT);
  assert.equal(resolve(g, "zia-02").resolved.id, "zia.url-categories.membership:same-specificity-collision");
  const r = resolve(g, "wildcard");
  assert.equal(r.resolved, null);
  assert.ok(r.candidates.some((c) => c.id === "zia.url-categories.entry-matching"));
});

// Line numbers are computed at render time and move with every vendor bump; goldens ignore them.
const stripLines = (v) => JSON.parse(JSON.stringify(v, (k, x) => (k === "line" || k === "lines" ? undefined : x)));

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

test("Terraform field paths convert to API field paths", () => {
  assert.equal(snakeToCamel("url_categories2"), "urlCategories2");
  assert.equal(snakeToCamel("departments.name"), "departments.name");
  assert.equal(snakeToCamel("last_modified_by"), "lastModifiedBy");
});
