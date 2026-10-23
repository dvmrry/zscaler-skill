import assert from "node:assert/strict";
import test from "node:test";
import { lintClaim } from "./kb-lint.mjs";

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
