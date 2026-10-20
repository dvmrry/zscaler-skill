import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildGraph, loadPublic, validateGraph } from "./kb-lib.mjs";
import { moveClaim } from "./kb-move.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

/** A throwaway git repo with the real schemas and registries, one fake source, and the given files. */
function tmpRepo(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kb-move-"));
  fs.cpSync(path.join(ROOT, "references/_meta/schema"), path.join(root, "references/_meta/schema"), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "references/_meta/products.json"), path.join(root, "references/_meta/products.json"));
  fs.writeFileSync(path.join(root, "references/_meta/sources.json"), JSON.stringify({
    schema_version: 1,
    sources: { "fake-help": { kind: "submodule", root: "vendor/fake", rank: 5, title: "Fake source" } },
  }));
  fs.mkdirSync(path.join(root, "vendor/fake"), { recursive: true });
  fs.writeFileSync(path.join(root, "vendor/fake/doc.txt"), "keys are camel-cased\nevery service\n");
  for (const [rel, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), typeof body === "string" ? body : `${JSON.stringify(body, null, 2)}\n`);
  }
  execFileSync("git", ["init", "-q", root]);
  return root;
}

const read = (root, rel) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
const ev = (quote) => [{ source: "fake-help", path: "doc.txt", quotes: [quote] }];

test("move-claim moves the claim, relinks its old subject and rewrites qualified mentions elsewhere", () => {
  const root = tmpRepo({
    "references/zia/zia.sdk.json": {
      schema_version: 1, id: "zia.sdk", title: "ZIA SDK",
      prose: [{ text: "{{camel}} For ZIA, {{zia-scope}}" }],
      checks: [{ do: "Check the key casing.", uses: ["camel"] }],
      claims: {
        camel: { statement: "Request keys are camel-cased.", tier: "A", evidence: ev("keys are camel-cased") },
        "zia-scope": { statement: "This applies to ZIA too.", tier: "B", derived_from: ["camel"], conditions: "Follows from the rule." },
      },
    },
    "references/zia/zia.other.json": {
      schema_version: 1, id: "zia.other", title: "Other",
      prose: [{ text: "See [[zia.sdk:camel]]. {{camel-extra}}" }],
      claims: { "camel-extra": { statement: "Every service.", tier: "A", evidence: ev("every service") } },
    },
    "references/shared/shared.sdk-python.request-handling.json": {
      schema_version: 1, id: "shared.sdk-python.request-handling", title: "Request handling",
      prose: [{ text: "How requests are built." }],
    },
    // A mention of a longer ID that starts with the moved one must survive.
    "SKILL.md": "Cite `zia.sdk:camel` here, not `zia.sdk:camel-case-legacy`.\n",
  });

  const { rewritten } = moveClaim(root, "zia.sdk:camel", "shared.sdk-python.request-handling:body-camel-case");
  const to = "shared.sdk-python.request-handling:body-camel-case";

  const source = read(root, "references/zia/zia.sdk.json");
  assert.equal(source.claims.camel, undefined);
  assert.equal(source.prose[0].text, `[[${to}]] For ZIA, {{zia-scope}}`);
  assert.deepEqual(source.checks[0].uses, [to]);
  assert.deepEqual(source.claims["zia-scope"].derived_from, [to]);

  const target = read(root, "references/shared/shared.sdk-python.request-handling.json");
  assert.equal(target.claims["body-camel-case"].statement, "Request keys are camel-cased.");
  assert.equal(target.prose.at(-1).text, "{{body-camel-case}}");

  assert.equal(read(root, "references/zia/zia.other.json").prose[0].text, `See [[${to}]]. {{camel-extra}}`);
  assert.equal(fs.readFileSync(path.join(root, "SKILL.md"), "utf8"), `Cite \`${to}\` here, not \`zia.sdk:camel-case-legacy\`.\n`);
  assert.ok(rewritten.includes("SKILL.md"));

  const errors = validateGraph(buildGraph(loadPublic(root))).errors.map((e) => e.message);
  assert.deepEqual(errors, []);
});

test("move-claim qualifies the moved claim's own local references and refuses a taken name", () => {
  const root = tmpRepo({
    "references/zia/zia.sdk.json": {
      schema_version: 1, id: "zia.sdk", title: "ZIA SDK",
      prose: [{ text: "{{base}} {{derived}}" }],
      claims: {
        base: { statement: "Request keys are camel-cased.", tier: "A", evidence: ev("keys are camel-cased") },
        derived: { statement: "So a key arrives camel-cased.", tier: "B", derived_from: ["base"], conditions: "Follows from the rule." },
      },
    },
    "references/shared/shared.sdk-python.request-handling.json": {
      schema_version: 1, id: "shared.sdk-python.request-handling", title: "Request handling",
      prose: [{ text: "{{taken}}" }],
      claims: { taken: { statement: "Every service.", tier: "A", evidence: ev("every service") } },
    },
  });
  assert.throws(() => moveClaim(root, "zia.sdk:derived", "shared.sdk-python.request-handling:taken"), /is taken/);
  moveClaim(root, "zia.sdk:derived", "shared.sdk-python.request-handling:derived");
  const target = read(root, "references/shared/shared.sdk-python.request-handling.json");
  assert.deepEqual(target.claims.derived.derived_from, ["zia.sdk:base"]);
});

test("move-claim --merge drops a duplicate in favour of an existing claim and repoints its references", () => {
  const root = tmpRepo({
    "references/zia/zia.rate-limits.json": {
      schema_version: 1, id: "zia.rate-limits", title: "Rate limits",
      prose: [{ text: "{{retries}} {{why}}" }],
      claims: {
        retries: { statement: "Request keys are camel-cased.", tier: "A", evidence: ev("keys are camel-cased") },
        why: { statement: "So keys arrive camel-cased.", tier: "B", derived_from: ["retries"], conditions: "Follows." },
      },
    },
    "references/shared/shared.sdk-python.request-handling.json": {
      schema_version: 1, id: "shared.sdk-python.request-handling", title: "Request handling",
      prose: [{ text: "{{body-camel-case}}" }],
      claims: { "body-camel-case": { statement: "Request keys are camel-cased.", tier: "A", evidence: ev("keys are camel-cased") } },
    },
  });
  assert.throws(() => moveClaim(root, "zia.rate-limits:retries", "shared.sdk-python.request-handling:missing", { merge: true }), /needs an existing claim/);
  moveClaim(root, "zia.rate-limits:retries", "shared.sdk-python.request-handling:body-camel-case", { merge: true });
  const to = "shared.sdk-python.request-handling:body-camel-case";
  const source = read(root, "references/zia/zia.rate-limits.json");
  assert.equal(source.claims.retries, undefined);
  assert.equal(source.prose[0].text, `[[${to}]] {{why}}`);
  assert.deepEqual(source.claims.why.derived_from, [to]);
  assert.equal(Object.keys(read(root, "references/shared/shared.sdk-python.request-handling.json").claims).length, 1);
  assert.deepEqual(validateGraph(buildGraph(loadPublic(root))).errors.map((e) => e.message), []);
});
