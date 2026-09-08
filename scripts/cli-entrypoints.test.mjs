import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const helpScripts = [
  "check-data-contract.mjs", "setup-data-mount.mjs", "runtime-data-path.mjs",
  "doctor.mjs", "check-helper-command-refs.mjs", "prepare-overlay-submission.mjs",
  "soc-artifacts.mjs", "auditor-artifacts.mjs", "investigator-artifacts.mjs",
  "check-reference-freshness.mjs", "check-vendor-refresh.mjs",
  "vendor-impact-summary.mjs", "refresh-discovery.mjs", "bridge/run-investigation.mjs",
];
const cases = [
  ...helpScripts.map((script) => ({ script, args: ["--help"], code: 0, output: /Usage:/i })),
  { script: "check-citations.mjs", args: ["--invalid-option"], code: 2, output: /unknown argument/ },
  { script: "check-full.mjs", args: [], code: 1, output: /\[FAIL\] vendor submodules/ },
  { script: "check-capability-registry.mjs", args: [], code: 1, output: /capability-registry errors/ },
  { script: "check-workflow-metadata.mjs", args: [], code: 1, output: /Workflow metadata report/ },
  { script: "check-release-state.mjs", args: [], code: 1, output: /Release state check failed/ },
  { script: "check-worktree-whitespace.mjs", args: [], code: 1, output: /check-worktree-whitespace:/ },
];

test("every native entrypoint guard has a subprocess regression case", () => {
  const guarded = fs.readdirSync(scriptsDir, { recursive: true })
    .filter((name) => name.endsWith(".mjs") && !name.endsWith(".test.mjs"))
    .filter((name) => fs.readFileSync(path.join(scriptsDir, name), "utf8").includes("import.meta.main"))
    .map((name) => name.split(path.sep).join("/"))
    .sort();
  assert.deepEqual(guarded, cases.map(({ script }) => script).sort());
});

test("real CLI entrypoints execute through encoded and symlinked paths; imports stay inert", async (t) => {
  // Real copies, not symlinks, are required to expose URL encoding independently.
  const scratch = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-cli-entrypoints-")));
  t.after(() => fs.rmSync(scratch, { recursive: true, force: true }));
  const plain = path.join(scratch, "plain");
  const encoded = path.join(scratch, "space café # percent%");
  for (const root of [plain, encoded]) {
    fs.cpSync(scriptsDir, path.join(root, "scripts"), { recursive: true });
    fs.mkdirSync(path.join(root, "agents"));
    for (const name of ["VERSION", ".release-please-manifest.json", "pyproject.toml", "uv.lock", "CHANGELOG.md"]) {
      fs.copyFileSync(path.join(scriptsDir, "..", name), path.join(root, name));
    }
  }
  const linked = path.join(scratch, "linked");
  fs.symlinkSync(plain, linked, "dir");
  const variants = [
    { name: "ordinary", root: plain },
    { name: "relative", root: plain, relative: true },
    { name: "encoded", root: encoded },
    { name: "directory symlink", root: linked },
    { name: "preserved directory symlink", root: linked, flags: ["--preserve-symlinks-main"] },
    { name: "file symlink", root: plain, fileLink: true },
  ];
  // Deliberately outside a git repository: full/whitespace gates must actually
  // reach their failing preflight, never start expensive checks or inspect WIP.
  const env = { ...process.env, GIT_CEILING_DIRECTORIES: scratch };
  delete env.NODE_OPTIONS;
  delete env.ZSCALER_SKILL_RUNTIME_CONFIG;
  delete env.ZSCALER_SKILL_SETUP_CONFIG;
  for (const key of ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[key];
  const run = (args, cwd) => spawnSync(process.execPath, args, {
    cwd, env, encoding: "utf8", timeout: 15000,
  });
  for (const variant of variants) {
    await t.test(variant.name, () => {
      for (const item of cases) {
        let entry = path.join(variant.root, "scripts", item.script);
        if (variant.fileLink) {
          const alias = path.join(scratch, `alias-${path.basename(item.script)}`);
          fs.symlinkSync(entry, alias, "file");
          entry = alias;
        }
        const invocation = variant.relative ? path.relative(variant.root, entry) : entry;
        const result = run([...(variant.flags || []), invocation, ...item.args], variant.root);
        const label = `${variant.name}: ${item.script}`;
        assert.ifError(result.error);
        assert.equal(result.status, item.code, `${label}\n${result.stdout}${result.stderr}`);
        assert.match(result.stdout + result.stderr, item.output, label);
        // Even when argv[1] impersonates this module, importing it must not run
        // main(). A sentinel catches process.exit(0) as well as unexpected output.
        const imported = run(["--input-type=module", "-e",
          `process.argv[1] = ${JSON.stringify(entry)}; await import(${JSON.stringify(pathToFileURL(entry).href)}); console.log("import-only");`,
        ], variant.root);
        assert.ifError(imported.error);
        assert.equal(imported.status, 0, `${label}\n${imported.stderr}`);
        assert.equal(imported.stdout, "import-only\n", label);
        assert.equal(imported.stderr, "", label);
        if (item.script === "check-data-contract.mjs") {
          const invalid = run([...(variant.flags || []), invocation, "--invalid-option"], variant.root);
          assert.ifError(invalid.error);
          assert.equal(invalid.status, 1);
          assert.match(invalid.stderr, /Unknown argument: --invalid-option/);
          const contract = run([...(variant.flags || []), invocation], variant.root);
          assert.ifError(contract.error);
          assert.equal(contract.status, 1, contract.stdout + contract.stderr);
          assert.match(contract.stdout, /Data contract report/);
          assert.match(contract.stdout, /Errors: [1-9]/);
        }
      }
    });
  }
});
