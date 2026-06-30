import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { isSkeletonTree, setupDataMount } from "./setup-data-mount.mjs";
import { DATA_REQUIRED_DIRS } from "./lib.mjs";

function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
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

function makeOverlaySource() {
  const source = tempDir("zscaler-data-source-");
  fs.writeFileSync(path.join(source, "README.md"), "# overlay data\n", "utf8");
  for (const dir of DATA_REQUIRED_DIRS) {
    fs.mkdirSync(path.join(source, dir), { recursive: true });
  }
  fs.mkdirSync(path.join(source, "snapshot", "zs1"), { recursive: true });
  fs.writeFileSync(path.join(source, "schemas", "fields.json"), "{}\n", "utf8");
  fs.writeFileSync(path.join(source, "snapshot", "zs1", "_manifest.json"), "{}\n", "utf8");
  return source;
}

function git(root, args) {
  return childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function commitAll(root, message) {
  git(root, ["add", "."]);
  git(root, [
    "-c",
    "user.name=Zscaler Skill Test",
    "-c",
    "user.email=zscaler-skill-test@example.invalid",
    "commit",
    "-m",
    message,
  ]);
}

function makeGitOverlaySource() {
  const source = makeOverlaySource();
  git(source, ["init", "-b", "main"]);
  commitAll(source, "initial overlay data");
  return source;
}

function runSetupCommand(args) {
  return childProcess.execFileSync(
    process.execPath,
    [path.join(import.meta.dirname, "setup-data-mount.mjs"), ...args],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
}

test("isSkeletonTree accepts only README and .gitkeep files", () => {
  const root = tempDir("zscaler-data-skeleton-");
  makeDataSkeleton(root);
  assert.equal(isSkeletonTree(path.join(root, "_data")), true);

  fs.writeFileSync(path.join(root, "_data", "schemas", "fields.json"), "{}\n", "utf8");
  assert.equal(isSkeletonTree(path.join(root, "_data")), false);
});

test("setupDataMount copies a local data source and runs the contract check", () => {
  const root = tempDir("zscaler-data-mount-");
  makeDataSkeleton(root);
  const source = makeOverlaySource();

  const result = setupDataMount({
    root,
    dataUrl: source,
    dataRef: null,
    dryRun: false,
    force: false,
    mode: "auto",
  });

  assert.equal(result.plan.mode, "copy");
  assert.deepEqual(result.report.errors, []);
  assert.equal(fs.existsSync(path.join(root, "_data", "schemas", "fields.json")), true);
  assert.equal(fs.existsSync(path.join(root, "_data", "snapshot", "zs1", "_manifest.json")), true);
  assert.ok(!result.report.warnings.some((warning) => warning.includes("snapshot-backed reasoning unavailable")));
});

test("setupDataMount copies a local source into a configured runtime mount", () => {
  const root = tempDir("zscaler-data-mount-custom-");
  makeDataSkeleton(root, "tenant-data");
  const source = makeOverlaySource();

  const result = setupDataMount({
    root,
    dataUrl: source,
    dataRef: null,
    dryRun: false,
    force: false,
    mode: "auto",
    mountPath: "tenant-data",
  });

  assert.equal(result.plan.mountPath, "tenant-data");
  assert.equal(result.plan.mode, "copy");
  assert.deepEqual(result.report.errors, []);
  assert.equal(fs.existsSync(path.join(root, "tenant-data", "schemas", "fields.json")), true);
  assert.equal(fs.existsSync(path.join(root, "_data")), false);
  assert.ok(result.report.info.some((line) => line.includes("tenant-data appears")));
});

test("setupDataMount refuses to replace populated data without force", () => {
  const root = tempDir("zscaler-data-populated-");
  makeDataSkeleton(root);
  fs.writeFileSync(path.join(root, "_data", "schemas", "fields.json"), "{}\n", "utf8");
  const source = makeOverlaySource();

  assert.throws(
    () => setupDataMount({
      root,
      dataUrl: source,
      dataRef: null,
      dryRun: false,
      force: false,
      mode: "auto",
    }),
    /non-skeleton files/,
  );
});

test("setupDataMount dry-run reports the plan without replacing files", () => {
  const root = tempDir("zscaler-data-dry-run-");
  makeDataSkeleton(root);
  const source = makeOverlaySource();

  const result = setupDataMount({
    root,
    dataUrl: source,
    dataRef: "main",
    dryRun: true,
    force: false,
    mode: "auto",
  });

  assert.equal(result.plan.mode, "copy");
  assert.equal(result.plan.dataRef, "main");
  assert.equal(result.report, null);
  assert.equal(fs.existsSync(path.join(root, "_data", "snapshot", "zs1", "_manifest.json")), false);
});

test("setupDataMount can force a local source to submodule mode", () => {
  const root = tempDir("zscaler-data-local-submodule-");
  makeDataSkeleton(root);
  const source = makeOverlaySource();

  const result = setupDataMount({
    root,
    dataUrl: source,
    dataRef: "main",
    dryRun: true,
    force: false,
    mode: "submodule",
  });

  assert.equal(result.plan.requestedMode, "submodule");
  assert.equal(result.plan.mode, "submodule");
  assert.equal(result.plan.dataRef, "main");
  assert.equal(result.report, null);
});

test("setupDataMount can mount a local git source in checkout mode", () => {
  const root = tempDir("zscaler-data-local-checkout-");
  git(root, ["init", "-b", "main"]);
  fs.writeFileSync(path.join(root, ".gitignore"), "_data/\n", "utf8");
  commitAll(root, "initial public repo");
  const source = makeGitOverlaySource();

  const result = setupDataMount({
    root,
    dataUrl: source,
    dataRef: "main",
    dryRun: false,
    force: false,
    mode: "checkout",
  });

  assert.equal(result.plan.mode, "checkout");
  assert.equal(fs.existsSync(path.join(root, "_data", ".git")), true);
  assert.equal(fs.existsSync(path.join(root, ".gitmodules")), false);
  assert.deepEqual(result.report.errors, []);
  assert.equal(git(root, ["status", "--short"]), "");
});

test("setupDataMount auto mode checks out local git sources", () => {
  const root = tempDir("zscaler-data-auto-checkout-");
  const source = makeGitOverlaySource();

  const result = setupDataMount({
    root,
    dataUrl: source,
    dataRef: "main",
    dryRun: true,
    force: false,
    mode: "auto",
  });

  assert.equal(result.plan.requestedMode, "auto");
  assert.equal(result.plan.mode, "checkout");
});

test("setupDataMount rejects checkout mode for non-git local directories", () => {
  const root = tempDir("zscaler-data-checkout-nongit-");
  makeDataSkeleton(root);
  const source = makeOverlaySource();

  assert.throws(
    () => setupDataMount({
      root,
      dataUrl: source,
      dataRef: "main",
      dryRun: true,
      force: false,
      mode: "checkout",
    }),
    /requires --data-url to resolve to a git repository/,
  );
});

test("setupDataMount rejects copy mode for non-local URLs", () => {
  const root = tempDir("zscaler-data-copy-remote-");
  makeDataSkeleton(root);

  assert.throws(
    () => setupDataMount({
      root,
      dataUrl: "https://example.invalid/runtime-data.git",
      dataRef: null,
      dryRun: true,
      force: false,
      mode: "copy",
    }),
    /requires --data-url to resolve to a local directory/,
  );
});

test("setupDataMount removes tracked skeleton files before adding a submodule", () => {
  const root = tempDir("zscaler-data-git-submodule-");
  git(root, ["init", "-b", "main"]);
  makeDataSkeleton(root);
  commitAll(root, "initial public skeleton");
  const source = makeGitOverlaySource();

  const result = setupDataMount({
    root,
    dataUrl: source,
    dataRef: "main",
    dryRun: false,
    force: false,
    mode: "submodule",
  });

  const trackedData = git(root, ["ls-files", "--stage", "--", "_data"]);
  assert.match(trackedData, /^160000 /);
  assert.ok(!trackedData.includes("_data/README.md"));
  assert.equal(fs.existsSync(path.join(root, ".gitmodules")), true);
  assert.deepEqual(result.report.errors, []);
  assert.ok(result.report.info.some((line) => line.includes("submodule")));
});

test("setup-data-mount CLI installs a local data source in auto mode", () => {
  const root = tempDir("zscaler-data-cli-");
  makeDataSkeleton(root);
  const source = makeOverlaySource();

  const output = runSetupCommand([
    "--root",
    root,
    "--data-url",
    source,
    "--mode",
    "auto",
  ]);

  assert.match(output, /Mode: copy/);
  assert.match(output, /Errors: 0/);
  assert.equal(fs.existsSync(path.join(root, "_data", "schemas", "fields.json")), true);
  assert.equal(fs.existsSync(path.join(root, "_data", "snapshot", "zs1", "_manifest.json")), true);
});

test("setup-data-mount CLI can load defaults from root setup config", () => {
  const root = tempDir("zscaler-data-config-");
  makeDataSkeleton(root);
  const source = makeOverlaySource();
  fs.writeFileSync(
    path.join(root, "zscaler-skill-setup.json"),
    `${JSON.stringify({
      dataUrl: source,
      dataRef: "main",
      mode: "auto",
    }, null, 2)}\n`,
    "utf8",
  );

  const output = runSetupCommand(["--root", root]);

  assert.match(output, /Mode: copy/);
  assert.match(output, /Config: /);
  assert.match(output, /Ref: main/);
  assert.match(output, /Errors: 0/);
  assert.equal(fs.existsSync(path.join(root, "_data", "schemas", "fields.json")), true);
});

test("setup-data-mount CLI supports runtimeData config and env-expanded source", () => {
  const root = tempDir("zscaler-data-config-runtime-");
  makeDataSkeleton(root, "tenant-data");
  const source = makeOverlaySource();
  const previous = process.env.ZSCALER_TEST_OVERLAY_SOURCE;
  process.env.ZSCALER_TEST_OVERLAY_SOURCE = source;
  try {
    fs.writeFileSync(
      path.join(root, "zscaler-skill-setup.json"),
      `${JSON.stringify({
        runtimeData: {
          mountPath: "tenant-data",
          source: "$ZSCALER_TEST_OVERLAY_SOURCE",
          ref: "main",
          mode: "auto",
        },
      }, null, 2)}\n`,
      "utf8",
    );

    const output = runSetupCommand(["--root", root]);

    assert.match(output, /Mode: copy/);
    assert.match(output, /Config: /);
    assert.match(output, /Ref: main/);
    assert.match(output, /Errors: 0/);
    assert.equal(fs.existsSync(path.join(root, "tenant-data", "schemas", "fields.json")), true);
    assert.equal(fs.existsSync(path.join(root, "_data")), false);
  } finally {
    if (previous === undefined) {
      delete process.env.ZSCALER_TEST_OVERLAY_SOURCE;
    } else {
      process.env.ZSCALER_TEST_OVERLAY_SOURCE = previous;
    }
  }
});

test("setup-data-mount CLI flags override setup config values", () => {
  const root = tempDir("zscaler-data-config-override-");
  makeDataSkeleton(root);
  const source = makeOverlaySource();
  fs.writeFileSync(
    path.join(root, "zscaler-skill-setup.json"),
    `${JSON.stringify({
      dataUrl: "https://example.invalid/runtime-data.git",
      dataRef: "develop",
      mode: "submodule",
    }, null, 2)}\n`,
    "utf8",
  );

  const output = runSetupCommand([
    "--root",
    root,
    "--data-url",
    source,
    "--mode",
    "copy",
  ]);

  assert.match(output, /Mode: copy/);
  assert.match(output, /Ref: develop/);
  assert.match(output, /Errors: 0/);
  assert.equal(fs.existsSync(path.join(root, "_data", "schemas", "fields.json")), true);
});

test("setupDataMount copy mode rejects a symlinked source entry", () => {
  const root = tempDir("zscaler-data-symlink-src-");
  makeDataSkeleton(root);
  const source = makeOverlaySource();
  fs.symlinkSync("/etc/hosts", path.join(source, "cases", "link"));

  assert.throws(
    () => setupDataMount({
      root,
      dataUrl: source,
      dataRef: null,
      dryRun: false,
      force: false,
      mode: "copy",
    }),
    /symlink/,
  );
});

test("setupDataMount rejects an option-like data ref before touching git", () => {
  const root = tempDir("zscaler-data-bad-ref-");
  makeDataSkeleton(root);
  const source = makeOverlaySource();

  assert.throws(
    () => setupDataMount({
      root,
      dataUrl: source,
      dataRef: "--upload-pack=/evil",
      dryRun: true,
      force: false,
      mode: "copy",
    }),
    /ref/,
  );
});
