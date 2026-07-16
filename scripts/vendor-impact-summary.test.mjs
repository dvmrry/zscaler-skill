import assert from "node:assert/strict";
import test from "node:test";
import {
  changedSubmodules,
  classifyMcpFiles,
  driftReport,
  mcpSemanticSection,
  mcpSemanticReport,
  parseArgs,
  parseRawSubmoduleDiff,
} from "./vendor-impact-summary.mjs";

const OLD_SHA = "a".repeat(40);
const NEW_SHA = "b".repeat(40);
const ZERO_SHA = "0".repeat(40);

test("parses only gitlink entries from raw git diff output", () => {
  const raw = [
    `:160000 160000 ${OLD_SHA} ${NEW_SHA} M\tvendor/zscaler-mcp-server`,
    `:100644 100644 ${OLD_SHA} ${NEW_SHA} M\tvendor/ordinary.txt`,
  ].join("\n");

  assert.deepEqual(parseRawSubmoduleDiff(raw), [{
    path: "vendor/zscaler-mcp-server",
    oldSha: OLD_SHA,
    newSha: NEW_SHA,
    status: "M",
  }]);
});

test("worktree mode resolves the zero gitlink SHA from the submodule checkout", () => {
  const calls = [];
  const runner = (command, args) => {
    calls.push([command, args]);
    if (args[0] === "diff") {
      return {
        status: 0,
        stdout: `:160000 160000 ${OLD_SHA} ${ZERO_SHA} M\tvendor/zscaler-mcp-server\n`,
        stderr: "",
      };
    }
    if (args.includes("status")) return { status: 0, stdout: "", stderr: "" };
    return { status: 0, stdout: `${NEW_SHA}\n`, stderr: "" };
  };

  const changes = changedSubmodules({
    base: "origin/main",
    root: "/tmp/example",
    runner,
    worktree: true,
  });

  assert.equal(changes[0].newSha, NEW_SHA);
  assert.deepEqual(calls[1], [
    "git",
    ["-C", "vendor/zscaler-mcp-server", "rev-parse", "HEAD"],
  ]);
});

test("worktree mode fails closed on uncommitted vendor content", () => {
  const runner = (command, args) => {
    if (args[0] === "diff") {
      return {
        status: 0,
        stdout: `:160000 160000 ${OLD_SHA} ${ZERO_SHA} M\tvendor/zscaler-mcp-server\n`,
        stderr: "",
      };
    }
    if (args.includes("status")) {
      return { status: 0, stdout: " M src/zscaler_mcp/server.py\n", stderr: "" };
    }
    return { status: 0, stdout: `${NEW_SHA}\n`, stderr: "" };
  };

  assert.throws(
    () => changedSubmodules({ base: "origin/main", runner, worktree: true }),
    /uncommitted content.*cannot classify/,
  );
});

test("worktree mode fails closed when a changed submodule is not initialized", () => {
  const runner = (command, args) => {
    if (args[0] === "diff") {
      return {
        status: 0,
        stdout: `:160000 160000 ${OLD_SHA} ${ZERO_SHA} M\tvendor/zscaler-mcp-server\n`,
        stderr: "",
      };
    }
    return { status: 128, stdout: "", stderr: "not a git repository" };
  };

  assert.throws(
    () => changedSubmodules({ base: "origin/main", runner, worktree: true }),
    /not initialized/,
  );
});

test("classifies MCP changes into review lenses and preserves unknown paths", () => {
  const report = classifyMcpFiles([
    "src/zscaler_mcp/tools/zcell/anomaly_policy.py",
    "zscaler_mcp/tools/zia/url_categories.py",
    "src/zscaler_mcp/prompts/registry.py",
    "src/zscaler_mcp/security/auth.py",
    "src/zscaler_mcp/shaping/views.py",
    "src/zscaler_mcp/server.py",
    "README.md",
    "tests/test_server.py",
    "novel/surface.bin",
  ]);

  const populated = new Map(report.lenses.map((lens) => [lens.name, lens.files]));
  assert.deepEqual(populated.get("Tool capability surface"), [
    "src/zscaler_mcp/tools/zcell/anomaly_policy.py",
    "zscaler_mcp/tools/zia/url_categories.py",
  ]);
  assert.deepEqual(populated.get("Prompt surface"), ["src/zscaler_mcp/prompts/registry.py"]);
  assert.deepEqual(populated.get("Registration, discovery, and lifecycle"), [
    "src/zscaler_mcp/server.py",
  ]);
  assert.deepEqual(report.unclassified, ["novel/surface.bin"]);
});

test("MCP semantic section emits a review queue rather than a safety claim", () => {
  const runner = () => ({
    status: 0,
    stdout: "src/zscaler_mcp/tools/zdx/list_alerts.py\nsrc/zscaler_mcp/security/auth.py\n",
    stderr: "",
  });
  const lines = mcpSemanticSection([{
    path: "vendor/zscaler-mcp-server",
    oldSha: OLD_SHA,
    newSha: NEW_SHA,
    status: "M",
  }], { runner, root: "/tmp/example" });

  assert.match(lines.join("\n"), /review queue, not evidence/);
  assert.match(lines.join("\n"), /Tool capability surface/);
  assert.match(lines.join("\n"), /Authentication, authorization, and safety/);
});

test("strict MCP analysis blocks on paths outside the review classifier", () => {
  const report = mcpSemanticReport([{
    path: "vendor/zscaler-mcp-server",
    oldSha: OLD_SHA,
    newSha: NEW_SHA,
    status: "M",
  }], {
    root: "/tmp/example",
    runner: () => ({ status: 0, stdout: "novel/surface.bin\n", stderr: "" }),
  });

  assert.deepEqual(report.blockingReasons, ["1 MCP path(s) remain unclassified"]);
  assert.match(report.lines.join("\n"), /Unclassified paths/);
});

test("strict drift analysis blocks high-priority findings but not unverified-only coverage", () => {
  const changes = [{
    path: "vendor/zscaler-mcp-server",
    oldSha: OLD_SHA,
    newSha: NEW_SHA,
    status: "M",
  }];
  const runner = () => ({
    status: 1,
    stderr: "",
    stdout: JSON.stringify({
      drifted_high_priority: [{
        ref: "references/shared/mcp-server.md",
        submodule: "vendor/zscaler-mcp-server",
        touched_files: ["src/zscaler_mcp/server.py"],
      }],
      drifted_low_priority: [],
      unverified: [{
        ref: "references/zia/example.md",
        submodule: "vendor/zscaler-mcp-server",
      }],
    }),
  });

  const report = driftReport(changes, { root: "/tmp/example", runner });
  assert.deepEqual(report.blockingReasons, [
    "1 high-priority cited-file drift finding(s) remain",
  ]);
  assert.match(report.lines.join("\n"), /Unverified.*\*\*1\*\*/);
});

test("argument parser keeps committed and worktree modes mutually exclusive", () => {
  assert.deepEqual(
    parseArgs(["--base", "origin/main", "--worktree", "--output", "summary.md"]),
    {
      base: "origin/main",
      head: "HEAD",
      maxCommits: 8,
      output: "summary.md",
      strict: false,
      worktree: true,
    },
  );
  assert.throws(
    () => parseArgs([
      "--base", "origin/main", "--head", "HEAD", "--worktree", "--output", "summary.md",
    ]),
    /mutually exclusive/,
  );
  assert.throws(
    () => parseArgs(["--base", "origin/main", "--output", "summary.md", "--max-commits", "0"]),
    /positive integer/,
  );
  assert.equal(
    parseArgs(["--base", "origin/main", "--output", "summary.md", "--strict"]).strict,
    true,
  );
});
