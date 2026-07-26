import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkDataContract } from "./check-data-contract.mjs";
import { DATA_REQUIRED_DIRS, RUNTIME_CONFIG_ENV, SETUP_CONFIG_ENV } from "./lib.mjs";

function tempRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-data-contract-"));
}

function runCheckCommand(args, options = {}) {
  const env = { ...process.env };
  delete env[RUNTIME_CONFIG_ENV];
  delete env[SETUP_CONFIG_ENV];
  return childProcess.execFileSync(
    process.execPath,
    [path.join(import.meta.dirname, "check-data-contract.mjs"), ...args],
    {
      encoding: "utf8",
      env: { ...env, ...options.env },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
}

function git(root, args) {
  return childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function makeDataSkeleton(root, mountPath = "_data") {
  const dataDir = path.join(root, mountPath);
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, "README.md"), `# ${mountPath}\n`, "utf8");
  for (const dir of DATA_REQUIRED_DIRS) {
    const target = path.join(dataDir, dir);
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, ".gitkeep"), "", "utf8");
  }
}

function makeKnowledgeFixture(root, mountPath = "_data") {
  makeDataSkeleton(root, mountPath);
  fs.mkdirSync(path.join(root, "references", "zpa"), { recursive: true });
  fs.mkdirSync(path.join(root, "references", "shared"), { recursive: true });
  fs.writeFileSync(path.join(root, "references", "zpa", "browser-access.md"), "# Browser Access\n", "utf8");
  fs.writeFileSync(path.join(root, "references", "shared", "operations.md"), "# Operations\n", "utf8");
  fs.mkdirSync(path.join(root, mountPath, "cases", "case-one"), { recursive: true });
  fs.writeFileSync(path.join(root, mountPath, "cases", "case-one", "journal.md"), "# Journal\n", "utf8");
  fs.mkdirSync(path.join(root, mountPath, "private"), { recursive: true });
  fs.writeFileSync(path.join(root, mountPath, "private", "vendor-ticket.txt"), "ticket\n", "utf8");
}

function knowledgeFrontmatter(options = {}) {
  const {
    title = "Operational observation",
    recordType = "claim",
    status = "active",
    confidence = "high",
    scope = "Observed in the production tenant",
    lastValidated = "2026-07-25",
    evidence = ["case:cases/case-one/journal.md"],
    conflictsWith,
    doNotInfer,
    supersededBy,
  } = options;
  const lines = [
    "---",
    `title: \"${title}\"`,
    `record-type: ${recordType}`,
    `status: ${status}`,
    `confidence: ${confidence}`,
    `scope: \"${scope}\"`,
    `last-validated: \"${lastValidated}\"`,
    "evidence:",
    ...evidence.map((item) => `  - ${item}`),
  ];
  if (conflictsWith !== undefined) {
    lines.push("conflicts-with:", ...conflictsWith.map((item) => `  - ${item}`));
  }
  if (doNotInfer !== undefined) lines.push(`do-not-infer: \"${doNotInfer}\"`);
  if (supersededBy !== undefined) lines.push(`superseded-by: ${supersededBy}`);
  lines.push("---", "", "Record body.", "");
  return lines.join("\n");
}

function writeKnowledgeRecord(root, relativePath, content = knowledgeFrontmatter(), mountPath = "_data") {
  const target = path.join(root, mountPath, "knowledge", relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
  return target;
}

function knowledgeErrors(root, mountPath = "_data") {
  return checkDataContract(root, mountPath).errors;
}

function assertKnowledgeError(root, pattern, mountPath = "_data") {
  assert.ok(
    knowledgeErrors(root, mountPath).some((error) => pattern.test(error)),
    `expected error matching ${pattern}`,
  );
}

test("checkDataContract accepts an empty runtime mount with warnings", () => {
  const root = tempRepo();
  makeDataSkeleton(root);

  const report = checkDataContract(root);
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.some((warning) => warning.includes("_data/snapshot/ contains only skeleton files")));
  assert.ok(report.warnings.some((warning) => warning.includes("snapshot-backed reasoning unavailable")));
  assert.ok(report.info.some((line) => line.includes("ordinary directory")));
});

test("checkDataContract accepts a configured runtime mount path", () => {
  const root = tempRepo();
  makeDataSkeleton(root, "tenant-data");

  const report = checkDataContract(root, "tenant-data");
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.some((warning) => warning.includes("tenant-data/snapshot/ contains only skeleton files")));
  assert.ok(report.warnings.some((warning) => warning.includes("no tenant-data/snapshot content")));
  assert.ok(report.info.some((line) => line.includes("tenant-data appears to be an ordinary directory")));
});

test("checkDataContract warns when a custom runtime mount is not ignored", () => {
  const root = tempRepo();
  git(root, ["init", "-b", "main"]);
  makeDataSkeleton(root, "tenant-data");

  const report = checkDataContract(root, "tenant-data");

  assert.ok(report.warnings.some((warning) => warning.includes("tenant-data/ is a custom runtime-data mount")));
  assert.ok(report.warnings.some((warning) => warning.includes(".git/info/exclude")));
});

test("checkDataContract accepts a custom runtime mount that is locally ignored", () => {
  const root = tempRepo();
  git(root, ["init", "-b", "main"]);
  makeDataSkeleton(root, "tenant-data");
  const excludePath = path.join(root, ".git", "info", "exclude");
  fs.appendFileSync(excludePath, "tenant-data/\n", "utf8");

  const report = checkDataContract(root, "tenant-data");

  assert.ok(!report.warnings.some((warning) => warning.includes("custom runtime-data mount")));
});

test("checkDataContract accepts a tracked work-mirror runtime mount", () => {
  const root = tempRepo();
  git(root, ["init", "-b", "main"]);
  makeDataSkeleton(root, "tenant-data");

  const report = checkDataContract(root, "tenant-data", { tracking: "tracked" });

  assert.ok(report.info.some((line) => line.includes("tenant-data is configured as tracked runtime data")));
  assert.ok(!report.warnings.some((warning) => warning.includes("not ignored by git")));
});

test("checkDataContract warns when tracked runtime data is ignored", () => {
  const root = tempRepo();
  git(root, ["init", "-b", "main"]);
  makeDataSkeleton(root, "tenant-data");
  fs.appendFileSync(path.join(root, ".git", "info", "exclude"), "tenant-data/\n", "utf8");

  const report = checkDataContract(root, "tenant-data", { tracking: "tracked" });

  assert.ok(report.warnings.some((warning) => warning.includes("configured as tracked runtime data but is ignored")));
});

test("check-data-contract CLI reads mountPath without expanding unrelated private source", () => {
  const root = tempRepo();
  makeDataSkeleton(root, "tenant-data");
  fs.writeFileSync(
    path.join(root, "zscaler-skill-setup.json"),
    `${JSON.stringify({
      runtimeData: {
        mountPath: "tenant-data",
        tracking: "tracked",
        source: "$ZSCALER_TEST_UNSET_PRIVATE_SOURCE",
      },
    }, null, 2)}\n`,
    "utf8",
  );

  const output = runCheckCommand(["--root", root]);
  assert.match(output, /tenant-data appears to be an ordinary directory/);
  assert.match(output, /tenant-data is configured as tracked runtime data/);
  assert.match(output, /Errors: 0/);
});

test("check-data-contract CLI reads committed runtime layout config", () => {
  const root = tempRepo();
  makeDataSkeleton(root, "tenant-data");
  fs.writeFileSync(
    path.join(root, "zscaler-skill-runtime.json"),
    `${JSON.stringify({
      runtimeData: {
        mountPath: "tenant-data",
        tracking: "tracked",
      },
    }, null, 2)}\n`,
    "utf8",
  );

  const output = runCheckCommand(["--root", root]);
  assert.match(output, /tenant-data appears to be an ordinary directory/);
  assert.match(output, /tenant-data is configured as tracked runtime data/);
  assert.match(output, /Errors: 0/);
});

test("check-data-contract CLI honors the downstream runtime config selector", () => {
  const root = tempRepo();
  makeDataSkeleton(root, "downstream-data");
  fs.writeFileSync(
    path.join(root, "root-runtime.json"),
    JSON.stringify({ runtimeData: { mountPath: "downstream-data", tracking: "tracked" } }),
    "utf8",
  );

  const output = runCheckCommand(["--root", root], {
    env: { ZSCALER_SKILL_RUNTIME_CONFIG: "root-runtime.json" },
  });

  assert.match(output, /downstream-data appears to be an ordinary directory/);
  assert.match(output, /downstream-data is configured as tracked runtime data/);
  assert.match(output, /Errors: 0/);
});

test("checkDataContract warns when runtime README is missing", () => {
  const root = tempRepo();
  const dataDir = path.join(root, "_data");
  fs.mkdirSync(dataDir, { recursive: true });
  for (const dir of DATA_REQUIRED_DIRS) {
    fs.mkdirSync(path.join(dataDir, dir), { recursive: true });
  }

  const report = checkDataContract(root);
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.includes("_data/README.md is missing"));
});

test("checkDataContract errors when required directories are missing", () => {
  const root = tempRepo();
  fs.mkdirSync(path.join(root, "_data"), { recursive: true });
  fs.writeFileSync(path.join(root, "_data", "README.md"), "# _data\n", "utf8");

  const report = checkDataContract(root);
  for (const dir of DATA_REQUIRED_DIRS) {
    assert.ok(report.errors.includes(`_data/${dir}/ directory is missing`));
  }
});

test("checkDataContract treats populated directories as available", () => {
  const root = tempRepo();
  makeDataSkeleton(root);
  fs.mkdirSync(path.join(root, "_data", "snapshot", "zs2"), { recursive: true });
  fs.writeFileSync(path.join(root, "_data", "schemas", "fields.json"), "{}\n", "utf8");

  const report = checkDataContract(root);
  assert.deepEqual(report.errors, []);
  assert.ok(!report.warnings.some((warning) => warning.includes("snapshot-backed reasoning unavailable")));
  assert.ok(!report.warnings.some((warning) => warning.includes("tenant schema hints unavailable")));
});

test("knowledge validation is silent when knowledge is absent or empty", () => {
  const root = tempRepo();
  makeDataSkeleton(root);
  const absent = checkDataContract(root);

  fs.mkdirSync(path.join(root, "_data", "knowledge"), { recursive: true });
  const empty = checkDataContract(root);

  assert.deepEqual(empty, absent);
});

test("knowledge validation ignores skeleton markers at the root and product levels", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root);
  fs.mkdirSync(path.join(root, "_data", "knowledge", "zpa"), { recursive: true });
  fs.writeFileSync(path.join(root, "_data", "knowledge", "README.md"), "# Local knowledge\n", "utf8");
  fs.writeFileSync(path.join(root, "_data", "knowledge", ".gitkeep"), "", "utf8");
  fs.writeFileSync(path.join(root, "_data", "knowledge", "zpa", "README.md"), "# ZPA records\n", "utf8");
  fs.writeFileSync(path.join(root, "_data", "knowledge", "zpa", ".gitkeep"), "", "utf8");

  assert.deepEqual(knowledgeErrors(root), []);
});

test("a missing runtime mount retains the existing mount error without knowledge diagnostics", () => {
  const root = tempRepo();
  assert.deepEqual(checkDataContract(root).errors, ["_data/ directory is missing"]);
});

test("knowledge validation accepts valid claims, procedures, promoted records, and retired records", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root);
  writeKnowledgeRecord(root, "zpa/claim.md", knowledgeFrontmatter({
    evidence: [
      "case:cases/case-one/journal.md",
      "vendor-call",
      "vendor-ticket:private/vendor-ticket.txt",
      "vendor-email",
      "public-doc:https://help.zscaler.com/zpa/browser-access",
    ],
    conflictsWith: ["references/zpa/browser-access.md"],
    doNotInfer: "Do not generalize across tenants.",
  }));
  writeKnowledgeRecord(root, "shared/procedure.md", knowledgeFrontmatter({
    recordType: "procedure",
    confidence: "medium",
    evidence: ["vendor-email:private/vendor-ticket.txt"],
  }));
  writeKnowledgeRecord(root, "zpa/promoted.md", knowledgeFrontmatter({
    status: "promoted",
    evidence: ["public-doc:https://help.zscaler.com/zpa/browser-access"],
    supersededBy: "references/zpa/browser-access.md",
  }));
  writeKnowledgeRecord(root, "zpa/retired-with-successor.md", knowledgeFrontmatter({
    status: "retired",
    supersededBy: "references/zpa/browser-access.md",
  }));
  writeKnowledgeRecord(root, "zpa/retired-without-successor.md", knowledgeFrontmatter({ status: "retired" }));

  assert.deepEqual(knowledgeErrors(root), []);
});

test("knowledge validation accepts CRLF flat frontmatter", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root);
  writeKnowledgeRecord(root, "zpa/crlf.md", knowledgeFrontmatter().replaceAll("\n", "\r\n"));
  assert.deepEqual(knowledgeErrors(root), []);
});

test("knowledge validation treats shared as valid without a references taxonomy", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root);
  fs.rmSync(path.join(root, "references"), { recursive: true, force: true });
  writeKnowledgeRecord(root, "shared/procedure.md", knowledgeFrontmatter({
    recordType: "procedure",
    evidence: ["vendor-call"],
  }));

  assert.deepEqual(knowledgeErrors(root), []);
});

test("knowledge evidence resolves relative to a configured custom mount", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root, "tenant-data");
  writeKnowledgeRecord(root, "zpa/claim.md", knowledgeFrontmatter(), "tenant-data");
  assert.deepEqual(knowledgeErrors(root, "tenant-data"), []);
});

test("knowledge validation rejects missing, unknown, duplicate, and non-flat fields", async (t) => {
  const variants = [
    ["missing required", knowledgeFrontmatter().replace('title: "Operational observation"\n', ""), /missing required frontmatter field: title/],
    ["unknown field", knowledgeFrontmatter().replace("---\n\nRecord body", "mystery: value\n---\n\nRecord body"), /unknown frontmatter field: mystery/],
    ["duplicate field", knowledgeFrontmatter().replace("record-type: claim\n", "record-type: claim\nrecord-type: claim\n"), /duplicate frontmatter field: record-type/],
    ["nested mapping", knowledgeFrontmatter().replace("  - case:cases/case-one/journal.md", "  - kind: case\n    ref: cases/case-one/journal.md"), /unsupported frontmatter line: ref:/],
    ["list item without field", knowledgeFrontmatter().replace('title: "Operational observation"', '  - orphan\ntitle: "Operational observation"'), /list item without a list field/],
    ["inline collection", knowledgeFrontmatter().replace("evidence:\n  - case:cases/case-one/journal.md", "evidence: [case:cases/case-one/journal.md]"), /inline collections are not supported/],
    ["malformed inline map", knowledgeFrontmatter().replace('title: "Operational observation"', "title: {broken"), /inline collections are not supported/],
    ["malformed inline list", knowledgeFrontmatter().replace('scope: "Observed in the production tenant"', "scope: [tenant"), /inline collections are not supported/],
    ["block scalar", knowledgeFrontmatter().replace('scope: "Observed in the production tenant"', "scope: |"), /block scalar values are not supported/],
    ["malformed double quote", knowledgeFrontmatter().replace('title: "Operational observation"', 'title: "Operational "observation"'), /malformed quoted scalar/],
    ["malformed single quote", knowledgeFrontmatter().replace('title: "Operational observation"', "title: 'Operational 'observation'"), /malformed quoted scalar/],
    ["prototype field", knowledgeFrontmatter().replace("---\n\nRecord body", "__proto__: smuggled\n---\n\nRecord body"), /unknown frontmatter field: __proto__/],
    ["duplicate prototype field", knowledgeFrontmatter().replace("---\n\nRecord body", "__proto__: one\n__proto__: two\n---\n\nRecord body"), /duplicate frontmatter field: __proto__/],
  ];

  for (const [name, content, pattern] of variants) {
    await t.test(name, () => {
      const root = tempRepo();
      makeKnowledgeFixture(root);
      writeKnowledgeRecord(root, "zpa/invalid.md", content);
      assertKnowledgeError(root, pattern);
    });
  }
});

test("knowledge validation rejects invalid field types and enum values", async (t) => {
  const variants = [
    ["numeric title", knowledgeFrontmatter().replace('title: "Operational observation"', "title: 42"), /title must be a string scalar/],
    ["empty title", knowledgeFrontmatter().replace('title: "Operational observation"', 'title: ""'), /title must be a non-empty string scalar/],
    ["list scope", knowledgeFrontmatter().replace('scope: "Observed in the production tenant"', "scope:\n  - tenant"), /scope must be a string scalar/],
    ["blank scope", knowledgeFrontmatter().replace('scope: "Observed in the production tenant"', 'scope: "   "'), /scope must be a non-empty string scalar/],
    ["numeric record type", knowledgeFrontmatter().replace("record-type: claim", "record-type: 42"), /record-type must be a string scalar/],
    ["numeric status", knowledgeFrontmatter().replace("status: active", "status: 42"), /status must be a string scalar/],
    ["numeric confidence", knowledgeFrontmatter().replace("confidence: high", "confidence: 42"), /confidence must be a string scalar/],
    ["numeric validation date", knowledgeFrontmatter().replace('last-validated: "2026-07-25"', "last-validated: 42"), /last-validated must be a string scalar/],
    ["numeric inference guard", knowledgeFrontmatter({ doNotInfer: "guard" }).replace('do-not-infer: "guard"', "do-not-infer: 42"), /do-not-infer must be a string scalar/],
    ["numeric successor", knowledgeFrontmatter({ status: "retired", supersededBy: "references/zpa/browser-access.md" }).replace("superseded-by: references/zpa/browser-access.md", "superseded-by: 42"), /superseded-by must be a string scalar/],
    ["scalar evidence", knowledgeFrontmatter().replace("evidence:\n  - case:cases/case-one/journal.md", "evidence: case:cases/case-one/journal.md"), /evidence must be a scalar list/],
    ["non-string evidence item", knowledgeFrontmatter().replace("  - case:cases/case-one/journal.md", "  - 42"), /every evidence item must be a string scalar/],
    ["non-string conflict item", knowledgeFrontmatter({ conflictsWith: ["42"] }), /every conflicts-with item must be a string scalar/],
    ["record type enum", knowledgeFrontmatter().replace("record-type: claim", "record-type: observation"), /record-type must be one of/],
    ["status enum", knowledgeFrontmatter().replace("status: active", "status: stale"), /status must be one of/],
    ["confidence enum", knowledgeFrontmatter().replace("confidence: high", "confidence: certain"), /confidence must be one of/],
    ["date format", knowledgeFrontmatter().replace('last-validated: "2026-07-25"', 'last-validated: "07/25/2026"'), /last-validated must match YYYY-MM-DD/],
  ];

  for (const [name, content, pattern] of variants) {
    await t.test(name, () => {
      const root = tempRepo();
      makeKnowledgeFixture(root);
      writeKnowledgeRecord(root, "zpa/invalid.md", content);
      assertKnowledgeError(root, pattern);
    });
  }
});

test("knowledge validation requires a known product directory", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root);
  writeKnowledgeRecord(root, "unknown-product/claim.md");
  assertKnowledgeError(root, /first knowledge path component must be a known references\/ product or shared/);
});

test("knowledge validation reports an unavailable product taxonomy separately from the record", async (t) => {
  for (const state of ["absent", "empty"]) {
    await t.test(state, () => {
      const root = tempRepo();
      makeKnowledgeFixture(root);
      fs.rmSync(path.join(root, "references"), { recursive: true, force: true });
      if (state === "empty") fs.mkdirSync(path.join(root, "references", "_meta"), { recursive: true });
      writeKnowledgeRecord(root, "zpa/claim.md");

      const errors = knowledgeErrors(root);
      assert.ok(
        errors.some((error) => /product taxonomy unavailable; references\/ has no product directories/.test(error)),
      );
      assert.ok(!errors.some((error) => /first knowledge path component/.test(error)));
    });
  }
});

test("knowledge validation requires exactly product and slug path components", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root);
  writeKnowledgeRecord(root, "zpa/nested/claim.md");
  assertKnowledgeError(root, /knowledge record path must be knowledge\/<product>\/<slug>\.md/);
});

test("knowledge validation accepts case-insensitive .md and rejects unsupported record extensions", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root);
  writeKnowledgeRecord(root, "zpa/claim.MD");
  const unsupported = path.join(root, "_data", "knowledge", "zpa", "claim.markdown");
  fs.writeFileSync(unsupported, knowledgeFrontmatter(), "utf8");

  assertKnowledgeError(root, /unsupported knowledge file extension; records must use \.md/);
  fs.rmSync(unsupported);
  assert.deepEqual(knowledgeErrors(root), []);
});

test("knowledge validation requires knowledge to be a directory when present", () => {
  const root = tempRepo();
  makeDataSkeleton(root);
  fs.writeFileSync(path.join(root, "_data", "knowledge"), "not a directory\n", "utf8");

  assertKnowledgeError(root, /knowledge\/ must be a directory when present/);
});

test("knowledge validation rejects invalid evidence kinds and ref cardinality", async (t) => {
  const variants = [
    ["empty evidence", knowledgeFrontmatter({ evidence: [] }), /evidence must be a non-empty scalar list/],
    ["unknown kind", knowledgeFrontmatter({ evidence: ["chat-message"] }), /unknown evidence kind: chat-message/],
    ["case ref required", knowledgeFrontmatter({ evidence: ["case"] }), /case evidence requires a ref/],
    ["public-doc ref required", knowledgeFrontmatter({ evidence: ["public-doc"] }), /public-doc evidence requires a ref/],
    ["empty optional ref", knowledgeFrontmatter({ evidence: ["vendor-call:"] }), /evidence ref must not be empty/],
  ];

  for (const [name, content, pattern] of variants) {
    await t.test(name, () => {
      const root = tempRepo();
      makeKnowledgeFixture(root);
      writeKnowledgeRecord(root, "zpa/invalid.md", content);
      assertKnowledgeError(root, pattern);
    });
  }
});

test("knowledge validation enforces local evidence path boundaries", async (t) => {
  const variants = [
    ["missing", "case:cases/missing/journal.md", /does not resolve under the runtime mount/],
    ["POSIX absolute", "case:/etc/passwd", /must be relative/],
    ["Windows absolute", "case:C:\\Windows\\system.ini", /must be relative/],
    ["traversal", "case:cases/../../outside.md", /must not contain '\.\.'/],
    ["NUL byte", "case:cases/\0journal.md", /contains a NUL byte/],
    ["directory", "case:cases/case-one", /must resolve to a file/],
  ];

  for (const [name, evidence, pattern] of variants) {
    await t.test(name, () => {
      const root = tempRepo();
      makeKnowledgeFixture(root);
      writeKnowledgeRecord(root, "zpa/invalid.md", knowledgeFrontmatter({ evidence: [evidence] }));
      assertKnowledgeError(root, pattern);
    });
  }
});

test("knowledge validation requires public-doc evidence to be a credential-free HTTPS URL", async (t) => {
  const invalidRefs = [
    "http://help.zscaler.com/zpa/browser-access",
    "references/zpa/browser-access.md",
    "https://",
    "https://user:secret@help.zscaler.com/zpa/browser-access",
    "https://localhost:8443/internal/notes",
    "https://localhost./internal/notes",
    "https://intranet/notes",
    "https://wiki.internal/zpa-notes",
    "https://10.1.2.3/doc",
    "https://[::1]/doc",
    "https://[::ffff:127.0.0.1]/doc",
    "https://[::ffff:10.1.2.3]/doc",
    "https://[fc00::1]/doc",
    "https://[fe80::1]/doc",
  ];

  for (const ref of invalidRefs) {
    await t.test(ref, () => {
      const root = tempRepo();
      makeKnowledgeFixture(root);
      writeKnowledgeRecord(root, "zpa/invalid.md", knowledgeFrontmatter({ evidence: [`public-doc:${ref}`] }));
      assertKnowledgeError(root, /public-doc evidence ref must be a public https:\/\/ URL/);
    });
  }
});

test("knowledge validation rejects record and evidence symlinks and evidence escapes", async (t) => {
  await t.test("record file symlink", () => {
    const root = tempRepo();
    makeKnowledgeFixture(root);
    const source = path.join(root, "record.md");
    fs.writeFileSync(source, knowledgeFrontmatter(), "utf8");
    const link = path.join(root, "_data", "knowledge", "zpa", "linked.md");
    fs.mkdirSync(path.dirname(link), { recursive: true });
    fs.symlinkSync(source, link);
    assertKnowledgeError(root, /knowledge records and directories must not be symlinks/);
  });

  await t.test("evidence file symlink inside mount", () => {
    const root = tempRepo();
    makeKnowledgeFixture(root);
    fs.symlinkSync("case-one/journal.md", path.join(root, "_data", "cases", "linked-journal.md"));
    writeKnowledgeRecord(root, "zpa/claim.md", knowledgeFrontmatter({ evidence: ["case:cases/linked-journal.md"] }));
    assertKnowledgeError(root, /evidence ref must not traverse a symlink/);
  });

  await t.test("nested directory symlink escape", () => {
    const root = tempRepo();
    makeKnowledgeFixture(root);
    const outside = path.join(root, "outside");
    fs.mkdirSync(outside);
    fs.writeFileSync(path.join(outside, "evidence.txt"), "private\n", "utf8");
    fs.symlinkSync(outside, path.join(root, "_data", "cases", "escape"));
    writeKnowledgeRecord(root, "zpa/claim.md", knowledgeFrontmatter({ evidence: ["case:cases/escape/evidence.txt"] }));
    const errors = knowledgeErrors(root);
    assert.ok(errors.some((error) => /evidence ref must not traverse a symlink/.test(error)));
    assert.ok(errors.some((error) => /evidence ref resolves outside the runtime mount/.test(error)));
  });
});

test("knowledge validation rejects a symlinked knowledge directory", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root);
  const outside = path.join(root, "outside-knowledge", "zpa");
  fs.mkdirSync(outside, { recursive: true });
  fs.writeFileSync(path.join(outside, "claim.md"), knowledgeFrontmatter(), "utf8");
  fs.symlinkSync(path.dirname(outside), path.join(root, "_data", "knowledge"));
  assertKnowledgeError(root, /knowledge\/.*must not be a symlink/);
});

test("knowledge validation rejects a broken symlink at the knowledge root", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root);
  fs.symlinkSync(path.join(root, "gone"), path.join(root, "_data", "knowledge"));
  assertKnowledgeError(root, /knowledge\/.*must not be a symlink/);
});

test("knowledge validation structurally validates conflicts-with", async (t) => {
  const variants = [
    ["missing", "references/zpa/missing.md", /conflicts-with does not resolve/],
    ["outside references", "_data/cases/case-one/journal.md", /conflicts-with must resolve under references\//],
    ["traversal", "references/zpa/../../outside.md", /conflicts-with must not contain '\.\.'/],
    ["directory", "references/zpa", /conflicts-with must resolve to a file/],
  ];

  for (const [name, target, pattern] of variants) {
    await t.test(name, () => {
      const root = tempRepo();
      makeKnowledgeFixture(root);
      writeKnowledgeRecord(root, "zpa/invalid.md", knowledgeFrontmatter({ conflictsWith: [target] }));
      assertKnowledgeError(root, pattern);
    });
  }
});

test("knowledge validation rejects reference targets whose realpath escapes references", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root);
  const outside = path.join(root, "outside-reference.md");
  fs.writeFileSync(outside, "# Outside\n", "utf8");
  const target = path.join(root, "references", "zpa", "browser-access.md");
  fs.rmSync(target);
  fs.symlinkSync(outside, target);
  writeKnowledgeRecord(root, "zpa/claim.md", knowledgeFrontmatter({
    conflictsWith: ["references/zpa/browser-access.md"],
  }));

  assertKnowledgeError(root, /conflicts-with resolves outside references\//);
});

test("knowledge validation enforces superseded-by status invariants", async (t) => {
  const variants = [
    ["promoted requires successor", { status: "promoted", evidence: ["public-doc:https://help.zscaler.com/zpa/browser-access"] }, /promoted records require superseded-by/],
    ["promoted requires public evidence", { status: "promoted", supersededBy: "references/zpa/browser-access.md" }, /promoted records require public-doc evidence/],
    ["active rejects successor", { supersededBy: "references/zpa/browser-access.md" }, /active records must not have superseded-by/],
    ["procedure cannot be promoted", { recordType: "procedure", status: "promoted", evidence: ["public-doc:https://help.zscaler.com/zpa/browser-access"], supersededBy: "references/zpa/browser-access.md" }, /procedure records may not be promoted/],
    ["successor must exist", { status: "retired", supersededBy: "references/zpa/missing.md" }, /superseded-by does not resolve/],
    ["successor stays in references", { status: "retired", supersededBy: "_data/cases/case-one/journal.md" }, /superseded-by must resolve under references\//],
    ["successor must be a file", { status: "retired", supersededBy: "references/zpa" }, /superseded-by must resolve to a file/],
  ];

  for (const [name, options, pattern] of variants) {
    await t.test(name, () => {
      const root = tempRepo();
      makeKnowledgeFixture(root);
      writeKnowledgeRecord(root, "zpa/invalid.md", knowledgeFrontmatter(options));
      assertKnowledgeError(root, pattern);
    });
  }
});

test("check-data-contract CLI exits nonzero for an invalid knowledge record", () => {
  const root = tempRepo();
  makeKnowledgeFixture(root);
  writeKnowledgeRecord(
    root,
    "zpa/invalid.md",
    knowledgeFrontmatter().replace("---\n\nRecord body", "unknown-field: value\n---\n\nRecord body"),
  );

  assert.throws(
    () => runCheckCommand(["--root", root]),
    (error) => error.status === 1 && String(error.stdout).includes("unknown frontmatter field"),
  );
});
