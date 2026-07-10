#!/usr/bin/env node
/** Static contract checks for the auditor's PR #214-derived diff fixtures. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPTS_DIR, "..");
const CONTRACT_PATH = path.join(
  REPO_ROOT,
  "references",
  "_meta",
  "evals",
  "auditor-diff-readiness.json",
);
const BRIDGE_SCENARIO_PATH = path.join(
  REPO_ROOT,
  "scripts",
  "bridge",
  "scenarios",
  "auditor-diff-readiness.json",
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function repoFile(relativePath) {
  assert.equal(path.isAbsolute(relativePath), false, `${relativePath} must be repository-relative`);
  assert.equal(relativePath.includes(".."), false, `${relativePath} must not traverse the repository`);
  const resolved = path.resolve(REPO_ROOT, relativePath);
  assert.ok(resolved.startsWith(`${REPO_ROOT}${path.sep}`), `${relativePath} escaped the repository`);
  return resolved;
}

test("auditor diff eval contract pins PR #214 and unique failure modes", () => {
  const contract = readJson(CONTRACT_PATH);
  assert.equal(contract.$schema, "auditor-diff-readiness-evals/v1");
  assert.equal(contract.sourceChange.pullRequest, 214);
  assert.equal(contract.sourceChange.mergeCommit, "e93b7cc");
  assert.ok(contract.fixtures.length >= 2);

  const findingIds = contract.fixtures.flatMap((fixture) =>
    fixture.expectedFindings.map((finding) => finding.id),
  );
  assert.equal(new Set(findingIds).size, findingIds.length, "expected finding IDs must be unique");
  for (const fixture of contract.fixtures) {
    assert.ok(fixture.expectedFindings.length >= 2, `${fixture.id} needs multiple adversarial cases`);
    for (const finding of fixture.expectedFindings) {
      assert.ok(finding.failureMode, `${finding.id} missing failureMode`);
      assert.ok(finding.minimumSeverity, `${finding.id} missing minimumSeverity`);
      assert.ok(finding.expectedSignals.length >= 2, `${finding.id} needs falsifiable signals`);
    }
  }
});

test("auditor diff fixtures preserve unsafe triggers and candidate repairs", () => {
  const contract = readJson(CONTRACT_PATH);
  const markers = {
    "release-readiness": {
      candidate: ["workflow_dispatch:", "GITHUB_SHA", "exit 0"],
      remediated: ["ref: main", "release_commit", "gh release view"],
    },
    "provenance-readiness": {
      candidate: ["re.compile", "return dict", ' / ".git").exists()'],
      remediated: ["yaml.compose", "duplicate top-level", "TRACKED_PROVENANCE_ROOTS", "configparser"],
    },
  };

  for (const fixture of contract.fixtures) {
    const candidatePath = repoFile(fixture.candidatePath);
    const remediatedPath = repoFile(fixture.remediatedPath);
    assert.ok(fs.existsSync(candidatePath), `${fixture.candidatePath} missing`);
    assert.ok(fs.existsSync(remediatedPath), `${fixture.remediatedPath} missing`);
    assert.ok(fixture.candidatePath.endsWith(".txt"), "candidate fixtures must remain inert");
    assert.ok(fixture.remediatedPath.endsWith(".txt"), "remediation fixtures must remain inert");

    const candidate = fs.readFileSync(candidatePath, "utf8");
    const remediated = fs.readFileSync(remediatedPath, "utf8");
    for (const marker of markers[fixture.id].candidate) {
      assert.ok(candidate.includes(marker), `${fixture.id} candidate missing ${marker}`);
    }
    for (const marker of markers[fixture.id].remediated) {
      assert.ok(remediated.includes(marker), `${fixture.id} remediation missing ${marker}`);
    }
  }
});

test("canonical auditor surfaces retain the diff-readiness contract", () => {
  const contract = readJson(CONTRACT_PATH);
  const playbook = fs.readFileSync(repoFile(contract.playbookPath), "utf8");
  for (const dimension of [
    "Identity",
    "Lifecycle",
    "Input shape",
    "Repository state",
    "Boundary paths",
    "CI reachability",
    "Permissions",
    "Closure",
  ]) {
    assert.ok(playbook.includes(`| ${dimension} |`), `playbook missing ${dimension} dimension`);
  }
  assert.match(playbook, /PR\/214|pull\/214/, "playbook should preserve the originating change");

  for (const relativePath of ["agents/auditor/prompt.md", "agents/auditor/workflow.md"] ) {
    const content = fs.readFileSync(repoFile(relativePath), "utf8");
    assert.ok(content.includes("diff-readiness.md"), `${relativePath} must load the playbook`);
  }
});

test("live bridge scenario audits candidates without exposing expected answers", () => {
  const contract = readJson(CONTRACT_PATH);
  const scenario = readJson(BRIDGE_SCENARIO_PATH);
  assert.equal(scenario.role, "auditor");
  assert.ok(scenario.expect.minFindings >= 2);
  assert.deepEqual(
    scenario.expect.expectedToolSequence,
    ["open_audit", "record_finding", "render_audit_report"],
  );
  const prompt = scenario.turns.map((turn) => turn.prompt).join("\n");
  for (const fixture of contract.fixtures) {
    assert.ok(prompt.includes(fixture.candidatePath), `scenario missing ${fixture.candidatePath}`);
    assert.equal(prompt.includes(fixture.remediatedPath), false, "scenario must hide remediation fixtures");
    for (const finding of fixture.expectedFindings) {
      for (const signal of finding.expectedSignals) {
        assert.equal(prompt.includes(signal), false, "scenario must not leak expected signals");
      }
    }
  }
});
