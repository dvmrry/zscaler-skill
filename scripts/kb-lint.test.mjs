import assert from "node:assert/strict";
import test from "node:test";
import { lintClaim, lintHistory } from "./kb-lint.mjs";

const claim = (statement, evidence, extra = {}) => ({ tier: "A", statement, evidence, ...extra });
const checks = (c) => lintClaim(c).map((f) => [f.check, f.missing]);

test("a version must appear in the evidence: a changelog quote needs its heading", () => {
  const bare = claim("Provider v4.8.0 added the `zia_x` resource.", [{ source: "tf-zia", path: "CHANGELOG.md", quotes: ["Added the resource `zia_x`"] }]);
  assert.deepEqual(checks(bare), [["version", ["v4.8.0"]]]);
  const anchored = claim(bare.statement, [{ ...bare.evidence[0], after: "## 4.8.0 (May 1, 2026)" }]);
  assert.deepEqual(checks(anchored), []);
});

test("an identifier may come from a quote, the path, the pointer, expect or binds, with any spacing", () => {
  const ev = [{ source: "sdk-go", path: "zscaler/zia/services/rules/rules.go", quotes: ["Order int `json:\"order\"`", "pageSize = 1000"] }];
  assert.deepEqual(checks(claim("`order` is an int; `rules.go` sets `pageSize=1000`.", ev)), []);
  assert.deepEqual(checks(claim("`rank` is an int.", ev)), [["identifier", ["rank"]]]);
  assert.deepEqual(checks(claim("`rank` is an int.", ev, { binds: ["zia/rules#rank"] })), []);
  const ptr = [{ source: "api-specs", path: "x.json", pointer: "/paths/~1rules/get", expect: { operationId: "listRules" } }];
  assert.deepEqual(checks(claim("`listRules` lists rules.", ptr)), []);
  assert.deepEqual(checks(claim("`example.com` does not match `www.example.com`; `page_size=0` is sent.", ev)), []);
});

test("a number missing from the evidence is a warning, and thousands separators are ignored", () => {
  const ev = [{ source: "zscaler-help", path: "limits.json", quotes: ["| Rules | 1024 rules |"] }];
  assert.deepEqual(checks(claim("A tenant can hold 1,024 rules.", ev)), []);
  const f = lintClaim(claim("A tenant can hold 2,048 rules.", ev));
  assert.deepEqual(f.map((x) => [x.check, x.level, x.missing]), [["number", "warning", ["2,048"]]]);
});

test("Tier B claims and numbers inside backticks are not checked", () => {
  assert.deepEqual(checks({ tier: "B", statement: "Since v9.9 it does `x`.", derived_from: ["a:b"] }), []);
  const ev = [{ source: "sdk-go", path: "a.go", quotes: ["x := 500"] }];
  assert.deepEqual(checks(claim("The helper sets `x := 500`.", ev)), []);
});

test("a name the statement marks as absent needs no evidence; a present one still does", () => {
  const ev = [{ source: "sdk-go", path: "models.go", quotes: ["Name string `json:\"name\"`"] }];
  const checks = (st) => lintClaim({ tier: "A", statement: st, evidence: ev }).map((f) => [f.check, f.missing]);
  assert.deepEqual(checks("The model has `name` without `description`."), []);
  assert.deepEqual(checks("The model carries `name` and has no `id` or `rank`."), []);
  assert.deepEqual(checks("The model lacks the `rank` field."), []);
  assert.deepEqual(checks("The model has `name` and `rank`."), [["identifier", ["rank"]]]);
  assert.deepEqual(checks("Without retries the model sends `rank`."), [["identifier", ["rank"]]]);
});

test("a statement placed relative to the pin is an error; one naming the release is not", () => {
  const ev = [{ source: "tf-zia", path: "zia/x.go", quotes: ["func x() {}"] }];
  assert.deepEqual(checks(claim("At the pinned release the provider calls x.", ev)), [["pin", ["At the pinned release"]]]);
  assert.deepEqual(checks(claim("Not fixed at the pin.", ev)), [["pin", ["at the pin"]]]);
  assert.deepEqual(checks(claim("The provider calls x.", ev)), []);
});

test("review history in authored text is an error; vendor text and quotes are not", () => {
  const found = (data) => lintHistory(data).flatMap((f) => f.missing);
  assert.deepEqual(found({ statement: "x", conditions: "Narrowed per verifier: the page names one cloud." }), ["per verifier"]);
  assert.deepEqual(found({ detail: "Quote added for the location clause (verifier w2 E8)." }), ["Quote added for", "(verifier"]);
  assert.deepEqual(found({ conditions: "Added from the verifier's finding that the help documents it." }), ["from the verifier's"]);
  assert.deepEqual(found({ positions: [{ says: "Narrowed per review: one page." }] }), ["per review"]);
  // Vendor names and evidence are the source's words.
  assert.deepEqual(found({ statement: "ZSAUpdater and the checksum verifier; the PKCE code_verifier." }), []);
  assert.deepEqual(found({ statement: "x", evidence: [{ quotes: ["added per verifier"] }], upstream: [{ status: "unfiled", note: "per review" }] }), []);
});

test("a changelog quote's release heading counts as evidence; a heading in other files does not", async () => {
  const { buildGraph, loadPublic } = await import("./kb-lib.mjs");
  const { lintGraph } = await import("./kb-lint.mjs");
  const { execFileSync } = await import("node:child_process");
  const fs = await import("node:fs");
  const os = await import("node:os");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kb-lint-"));
  const write = (rel, body) => {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), typeof body === "string" ? body : JSON.stringify(body, null, 2));
  };
  fs.cpSync(path.join(ROOT, "references/_meta/schema"), path.join(root, "references/_meta/schema"), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "references/_meta/products.json"), path.join(root, "references/_meta/products.json"));
  write("references/_meta/sources.json", { schema_version: 1, sources: { fake: { kind: "submodule", root: "vendor/fake", rank: 1, title: "Fake" } } });
  write("vendor/fake/CHANGELOG.md", "# Changelog\n\n## 4.8.17 (October 30, 2026)\n\n- Kept the other entries of a category.\n\n## 4.8.16 (October 29, 2026)\n\n- Removed the page size.\n");
  write("vendor/fake/README.md", "## 4.8.16 notes\n\nThe page size is gone.\n");
  execFileSync("git", ["-C", path.join(root, "vendor/fake"), "init", "-q"]);
  const cite = (file, quote, statement) => ({ statement, tier: "A", evidence: [{ source: "fake", path: file, quotes: [quote] }] });
  write("references/zia/zia.example.json", {
    schema_version: 1, id: "zia.example", title: "Example",
    claims: {
      sectioned: cite("CHANGELOG.md", "Removed the page size.", "Provider v4.8.16 removed the page size."),
      wrong: cite("CHANGELOG.md", "Removed the page size.", "Provider v4.8.17 removed the page size."),
      readme: cite("README.md", "The page size is gone.", "From v4.8.16 the page size is gone."),
    },
  });
  write("references/zia/zia.other.json", {
    schema_version: 1, id: "zia.other", title: "Other",
    claims: { elsewhere: cite("CHANGELOG.md", "Removed the page size.", "Provider v9.9.9 removed it.") },
  });
  const g = buildGraph(loadPublic(root));
  const byId = Object.fromEntries(lintGraph(g, { only: new Set(["zia.example"]) }).map((f) => [f.id.split(":")[1], f.missing]));
  assert.deepEqual(byId, { wrong: ["v4.8.17"], readme: ["v4.8.16"] });
});
