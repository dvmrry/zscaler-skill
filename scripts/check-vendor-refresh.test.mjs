import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { gateSteps, parseArgs, runVendorRefreshGate } from "./check-vendor-refresh.mjs";

test("vendor refresh CLI requires an explicit base and has a non-repo default output", () => {
  assert.throws(() => parseArgs([]), /--base is required/);
  const args = parseArgs(["--base", "origin/main"], {
    defaultOutput: "/tmp/vendor-impact.md",
  });
  assert.deepEqual(args, {
    base: "origin/main",
    maxCommits: 8,
    output: "/tmp/vendor-impact.md",
  });
  assert.equal(path.isAbsolute(args.output), true);
});

test("vendor refresh gate composes preflight, worktree impact, and fast checks", () => {
  const args = {
    base: "origin/main",
    maxCommits: 5,
    output: "/tmp/vendor-impact.md",
  };
  const steps = gateSteps(args);

  assert.deepEqual(steps.map((step) => step.name), [
    "reference preflight",
    "vendor impact summary",
    "fast repository gate",
  ]);
  assert.ok(steps[1].args.includes("--worktree"));
  assert.ok(steps[1].args.includes("--strict"));
  assert.ok(steps[1].args.includes("origin/main"));
});

test("vendor refresh gate stops at the first failing step", () => {
  const seen = [];
  const report = runVendorRefreshGate(
    { base: "origin/main", maxCommits: 8, output: "/tmp/vendor-impact.md" },
    {
      root: "/tmp/example",
      runner: (step) => {
        seen.push(step.name);
        return { status: step.name === "vendor impact summary" ? 1 : 0 };
      },
    },
  );

  assert.deepEqual(seen, ["reference preflight", "vendor impact summary"]);
  assert.deepEqual(report, {
    ok: false,
    failedStep: "vendor impact summary",
    output: "/tmp/vendor-impact.md",
  });
});
