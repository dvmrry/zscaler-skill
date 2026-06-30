#!/usr/bin/env node
/**
 * auditor-artifacts.test.mjs
 *
 * Unit tests for the auditor helper. Fixture-based, no network.
 * Tests the three load-bearing properties:
 * 1. Evidence-gated records (record-finding gate)
 * 2. Answer-from-artifact (render-audit-report derives from findings.jsonl only)
 * 3. Fabrication-resistant errors (rejection messages name the repair)
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  openAudit,
  recordFinding,
  recordCheckOutput,
  renderAuditReport,
  auditStatus,
  capabilities,
  REQUIRED_INTAKE_MARKERS,
  REGISTER_TABLE_HEADER,
} from "./auditor-artifacts.mjs";

const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPTS_DIR, "..");

// ── Fixture helpers ───────────────────────────────────────────────────────────

function tempRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "aud-test-"));
  // Create a small real file for file:line citations.
  fs.mkdirSync(path.join(root, "references", "zpa"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "references", "zpa", "index.md"),
    `# ZPA Index\n\nLine 2 content.\nLine 3 content.\nLine 4 content.\n`,
    "utf8",
  );
  fs.mkdirSync(path.join(root, "agents", "auditor"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "agents", "auditor", "prompt.md"),
    `# Auditor prompt\n`,
    "utf8",
  );
  return root;
}

function makeScope({ topic, paths: scopePaths, description } = {}) {
  const scope = {};
  if (scopePaths !== undefined) scope.paths = scopePaths;
  if (topic !== undefined) scope.topic = topic;
  return {
    description: description || "Test audit scope",
    scope,
    checksRun: [],
  };
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeScopeFile(root, scope) {
  const p = path.join(root, "scope.json");
  writeJson(p, scope);
  return p;
}

function writeFindingFile(root, finding) {
  const p = path.join(root, "finding.json");
  writeJson(p, finding);
  return p;
}

function dispatchedCommands(scriptName) {
  const source = fs.readFileSync(path.join(SCRIPTS_DIR, scriptName), "utf8");
  return new Set([...source.matchAll(/if \(args\.command === "([^"]+)"\)/g)].map((m) => m[1]));
}

function assertNextCommandsDispatched(commands, scriptName) {
  assert.ok(Array.isArray(commands), "nextCommands should be an array");
  const validCommands = dispatchedCommands(scriptName);
  for (const command of commands) {
    const match = command.match(new RegExp(`^node scripts/${scriptName.replace(".", "\\.")} ([^\\s]+)`));
    assert.ok(match, `command should be a node helper invocation: ${command}`);
    assert.ok(
      validCommands.has(match[1]),
      `subcommand ${match[1]} should exist in ${scriptName} CLI dispatch`,
    );
  }
}

// ── open-audit happy path ─────────────────────────────────────────────────────

test("open-audit: creates all three artifacts with correct markers", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));

  const result = openAudit({ root, auditSlug: "test-audit-1", scopeJson: scopeFile });

  assert.equal(result.status, "pass");
  assert.equal(result.operation, "open-audit");
  assert.equal(result.auditSlug, "test-audit-1");

  // audit-intake.md must have required markers.
  const intakeMd = fs.readFileSync(result.auditIntakePath, "utf8");
  for (const marker of REQUIRED_INTAKE_MARKERS) {
    assert.ok(intakeMd.includes(marker), `intake.md missing marker: ${marker}`);
  }
  assert.match(intakeMd, /^Status: pass$/m, "intake.md status should be pass");
  assert.match(intakeMd, /^Blocking Issues: none$/m, "intake.md blocking issues should be none");

  // audit-intake.json must be valid.
  const intakeJson = JSON.parse(fs.readFileSync(result.auditIntakeJsonPath, "utf8"));
  assert.equal(intakeJson.auditSlug, "test-audit-1");

  // register.md must contain the canonical table header.
  const registerMd = fs.readFileSync(result.registerPath, "utf8");
  assert.ok(registerMd.includes(REGISTER_TABLE_HEADER), "register.md missing table header");

  fs.rmSync(root, { recursive: true, force: true });
});

test("open-audit: uses configured runtime data mount", () => {
  const root = tempRepo();
  fs.writeFileSync(
    path.join(root, "zscaler-skill-setup.json"),
    `${JSON.stringify({ runtimeData: { mountPath: "tenant-data" } }, null, 2)}\n`,
    "utf8",
  );
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));

  const result = openAudit({ root, auditSlug: "custom-mount-audit", scopeJson: scopeFile });

  assert.equal(result.status, "pass");
  assert.ok(result.auditDir.includes(`${path.sep}tenant-data${path.sep}audits${path.sep}`));
  assert.equal(fs.existsSync(path.join(root, "tenant-data", "audits", "custom-mount-audit", "register.md")), true);
  assert.equal(fs.existsSync(path.join(root, "_data")), false);
});

test("open-audit: rejects missing scope.paths AND scope.topic", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, { description: "No scope", scope: {}, checksRun: [] });

  assert.throws(
    () => openAudit({ root, auditSlug: "no-scope-audit", scopeJson: scopeFile }),
    /scope\.paths.*scope\.topic/,
    "should require scope.paths or scope.topic",
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("open-audit: rejects missing description", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, { scope: { paths: ["references/zpa/index.md"] } });

  assert.throws(
    () => openAudit({ root, auditSlug: "no-desc-audit", scopeJson: scopeFile }),
    /description/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("open-audit: overwrite refusal without --force", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));

  openAudit({ root, auditSlug: "overwrite-test", scopeJson: scopeFile });

  // Second call without force should throw.
  assert.throws(
    () => openAudit({ root, auditSlug: "overwrite-test", scopeJson: scopeFile }),
    /already exist/,
    "should refuse to overwrite without --force",
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("open-audit: --force overwrites existing artifacts", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));

  openAudit({ root, auditSlug: "force-test", scopeJson: scopeFile });
  const result2 = openAudit({ root, auditSlug: "force-test", scopeJson: scopeFile, force: true });

  assert.equal(result2.status, "pass");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── record-finding evidence gate ──────────────────────────────────────────────

test("record-finding: REJECT finding with nonexistent file:line source", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "gate-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "Test finding",
    source: "references/zpa/nonexistent.md:1",
    severity: "Medium",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, auditSlug: "gate-test", findingJson: findingFile }),
    /source does not resolve|does not exist/,
    "should reject finding with nonexistent file",
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: REJECT finding citing line 0 (lines are 1-indexed)", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "line-zero-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "Line zero citation",
    source: "references/zpa/index.md:0",
    severity: "Critical",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, auditSlug: "line-zero-test", findingJson: findingFile }),
    /line number must be >= 1|source does not resolve/,
    "should reject finding citing line 0",
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: REJECT finding with line beyond EOF", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "eof-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "Test finding",
    source: "references/zpa/index.md:999",
    severity: "Medium",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, auditSlug: "eof-test", findingJson: findingFile }),
    /beyond EOF|source does not resolve/,
    "should reject finding with line beyond EOF",
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: REJECT finding citing the phantom trailing-newline line (off-by-one boundary)", () => {
  // The fixture file has 5 visible lines and a trailing newline.
  // content.split(/\r?\n/).length gives 6 (phantom empty element).
  // Without the off-by-one fix, citing line 6 would pass the gate.
  // With the fix, line 6 is correctly identified as beyond EOF.
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "off-by-one-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "Phantom line citation",
    source: "references/zpa/index.md:6", // visibleLineCount (5) + 1 = 6
    severity: "Critical",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, auditSlug: "off-by-one-test", findingJson: findingFile }),
    /beyond EOF|source does not resolve/,
    "should reject finding citing one past the last visible line",
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: REJECT High severity with only cross-file source", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "high-crossfile-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "High severity cross-file only",
    source: "references/zpa/index.md + agents/auditor/prompt.md",
    severity: "High",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, auditSlug: "high-crossfile-test", findingJson: findingFile }),
    /cross-file.*too weak|High.*Resolved.*file:line|cross-file reference alone/,
    "should reject High severity with only cross-file source",
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: ACCEPT real file:line source", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "accept-fileline", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "Real file:line citation",
    source: "references/zpa/index.md:2",
    severity: "High",
    status: "Open",
    remediation: "Fix it",
  });

  const result = recordFinding({ root, auditSlug: "accept-fileline", findingJson: findingFile });
  assert.equal(result.status, "ok");
  assert.equal(result.findingId, "F1");

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: ACCEPT finding citing a recorded check", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "accept-check", scopeJson: scopeFile });

  // Record a check output first.
  const checkOutputFile = path.join(root, "check-output.txt");
  fs.writeFileSync(checkOutputFile, "Error: found 3 issues\n", "utf8");
  recordCheckOutput({
    root,
    auditSlug: "accept-check",
    checkName: "lint-check",
    outputFile: checkOutputFile,
  });

  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "Finding backed by a recorded check",
    source: "check:lint-check",
    severity: "High",
    status: "Open",
    remediation: "Fix lint issues",
  });

  const result = recordFinding({ root, auditSlug: "accept-check", findingJson: findingFile });
  assert.equal(result.status, "ok");

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: ACCEPT Low severity with cross-file source", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "low-crossfile", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "Low severity cross-file comparison",
    source: "references/zpa/index.md + agents/auditor/prompt.md",
    severity: "Low",
    status: "Open",
    remediation: "Align terminology",
  });

  const result = recordFinding({ root, auditSlug: "low-crossfile", findingJson: findingFile });
  assert.equal(result.status, "ok");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── register.md is always re-derived ─────────────────────────────────────────

test("register.md is re-derived from findings.jsonl on each record (hand-edits overwritten)", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  const result = openAudit({ root, auditSlug: "rederive-test", scopeJson: scopeFile });

  const registerPath = result.registerPath;

  // Hand-edit the register.md to add a fake row.
  fs.appendFileSync(registerPath, "| HAND-EDITED | Fabricated | nowhere | Critical | Open | n/a | |\n", "utf8");
  assert.match(fs.readFileSync(registerPath, "utf8"), /HAND-EDITED/, "hand edit should be present");

  // Record a real finding — should overwrite register.md from findings.jsonl.
  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "Real finding",
    source: "references/zpa/index.md:1",
    severity: "Low",
    status: "Open",
    remediation: "Fix it",
  });
  recordFinding({ root, auditSlug: "rederive-test", findingJson: findingFile });

  const registerAfter = fs.readFileSync(registerPath, "utf8");
  assert.doesNotMatch(registerAfter, /HAND-EDITED/, "hand-edited row should be overwritten");
  assert.ok(registerAfter.includes("F1"), "real finding F1 should be present");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── render-audit-report: artifact derivation guard ───────────────────────────

test("render-audit-report: contains only recorded findings (status absent from ledger cannot appear)", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "report-guard", scopeJson: scopeFile });

  // Record one Open finding.
  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "Open finding",
    source: "references/zpa/index.md:1",
    severity: "Medium",
    status: "Open",
    remediation: "Fix it",
  });
  recordFinding({ root, auditSlug: "report-guard", findingJson: findingFile });

  const report = renderAuditReport({ root, auditSlug: "report-guard" });

  // Must contain F1 with Open status.
  assert.match(report, /F1/, "report must contain F1");
  assert.match(report, /Open/, "report must reflect Open status");

  // Must NOT contain Resolved (not in the ledger).
  assert.doesNotMatch(report, /\bResolved\b/, "report must not claim Resolved when ledger has only Open");

  // Must NOT contain any fabricated high-severity finding that was never recorded.
  assert.doesNotMatch(report, /FABRICATED/, "report must not contain fabricated content");

  fs.rmSync(root, { recursive: true, force: true });
});

test("render-audit-report: throws actionable error when audit does not exist", () => {
  const root = tempRepo();

  assert.throws(
    () => renderAuditReport({ root, auditSlug: "nonexistent-audit-xyz" }),
    /Audit not found|nonexistent-audit-xyz/,
    "should throw with audit slug in message",
  );

  fs.rmSync(root, { recursive: true, force: true });
});

// ── audit-status phase transitions ────────────────────────────────────────────

test("audit-status: phase no-audit when audit does not exist", () => {
  const root = tempRepo();

  const result = auditStatus({ root, auditSlug: "nonexistent-xyz" });
  assert.equal(result.operation, "audit-status");
  assert.equal(result.phase, "no-audit");
  assert.equal(result.intake.present, false);
  assert.ok(result.nextCommands.length > 0, "no-audit should offer an open-audit CLI repair");
  assertNextCommandsDispatched(result.nextCommands, "auditor-artifacts.mjs");

  fs.rmSync(root, { recursive: true, force: true });
});

test("audit-status: phase open after open-audit with no findings", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "phase-open-test", scopeJson: scopeFile });

  const result = auditStatus({ root, auditSlug: "phase-open-test" });
  assert.equal(result.phase, "open");
  assert.equal(result.findingCounts.total, 0);
  assert.ok(result.nextCommands.length > 0, "open phase should offer a legal CLI next command");
  assert.ok(
    result.nextCommands.some((c) => c.includes(" record-finding ")),
    "open phase should offer record-finding",
  );
  assertNextCommandsDispatched(result.nextCommands, "auditor-artifacts.mjs");

  fs.rmSync(root, { recursive: true, force: true });
});

test("audit-status: phase has-findings after recording a finding", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "phase-findings-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "A finding",
    source: "references/zpa/index.md:1",
    severity: "Low",
    status: "Open",
    remediation: "Fix it",
  });
  recordFinding({ root, auditSlug: "phase-findings-test", findingJson: findingFile });

  const result = auditStatus({ root, auditSlug: "phase-findings-test" });
  assert.equal(result.phase, "has-findings");
  assert.equal(result.findingCounts.total, 1);
  assert.equal(result.findingCounts.byStatus["Open"], 1);
  assert.equal(result.findingCounts.bySeverity["Low"], 1);
  assert.ok(
    result.nextCommands.some((c) => c.includes(" render-audit-report ")),
    "has-findings should offer render-audit-report",
  );
  assertNextCommandsDispatched(result.nextCommands, "auditor-artifacts.mjs");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── duplicate findingId rejected ─────────────────────────────────────────────

test("record-finding: duplicate findingId is rejected", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "dup-test", scopeJson: scopeFile });

  const f1 = writeFindingFile(root, {
    findingId: "F1",
    description: "First",
    source: "references/zpa/index.md:1",
    severity: "Low",
    status: "Open",
    remediation: "Fix",
  });
  recordFinding({ root, auditSlug: "dup-test", findingJson: f1 });

  // Second call with same findingId.
  const f1Dup = path.join(root, "finding-dup.json");
  writeJson(f1Dup, {
    findingId: "F1",
    description: "Duplicate",
    source: "references/zpa/index.md:2",
    severity: "Low",
    status: "Open",
    remediation: "Fix",
  });

  assert.throws(
    () => recordFinding({ root, auditSlug: "dup-test", findingJson: f1Dup }),
    /duplicate findingId/i,
    "should reject duplicate findingId",
  );

  fs.rmSync(root, { recursive: true, force: true });
});

// ── record-check-output ───────────────────────────────────────────────────────

test("record-check-output: stores output and registers check name", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "check-record-test", scopeJson: scopeFile });

  const outputFile = path.join(root, "check-out.txt");
  fs.writeFileSync(outputFile, "lint: 2 errors found\n", "utf8");

  const result = recordCheckOutput({
    root,
    auditSlug: "check-record-test",
    checkName: "lint-check",
    outputFile,
    exitCode: 1,
  });

  assert.equal(result.status, "ok");
  assert.equal(result.checkName, "lint-check");
  assert.ok(result.checksRun.includes("lint-check"), "checksRun should include the check name");

  // Stored output should exist.
  const storedPath = result.destPath;
  assert.ok(fs.existsSync(storedPath), "stored check output file should exist");
  assert.equal(fs.readFileSync(storedPath, "utf8"), "lint: 2 errors found\n");

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-check-output: rejects unsafe check names", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "unsafe-name-test", scopeJson: scopeFile });

  const outputFile = path.join(root, "check-out.txt");
  fs.writeFileSync(outputFile, "output\n", "utf8");

  assert.throws(
    () => recordCheckOutput({ root, auditSlug: "unsafe-name-test", checkName: "../../evil", outputFile }),
    /check name must use only/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

// ── Resolved status requires strong source ────────────────────────────────────

test("record-finding: REJECT Resolved status with only cross-file source", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "resolved-crossfile-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "Resolved without strong source",
    source: "references/zpa/index.md + agents/auditor/prompt.md",
    severity: "Low",
    status: "Resolved",
    remediation: "Already fixed",
  });

  assert.throws(
    () => recordFinding({ root, auditSlug: "resolved-crossfile-test", findingJson: findingFile }),
    /cross-file.*too weak|cross-file reference alone/,
    "should reject Resolved status with only cross-file source",
  );

  fs.rmSync(root, { recursive: true, force: true });
});

// ── audit-status: checksRecorded in output ────────────────────────────────────

test("audit-status: checksRecorded reflects recorded checks", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "checks-status-test", scopeJson: scopeFile });

  const outputFile = path.join(root, "out.txt");
  fs.writeFileSync(outputFile, "output\n", "utf8");
  recordCheckOutput({ root, auditSlug: "checks-status-test", checkName: "my-check", outputFile });

  const result = auditStatus({ root, auditSlug: "checks-status-test" });
  assert.ok(result.checksRecorded.includes("my-check"), "status should list recorded check");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── render-audit-report: groups by severity, includes all recorded fields ─────

test("render-audit-report: groups findings by severity, includes source/status/remediation", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"], topic: "ZPA index" }));
  openAudit({ root, auditSlug: "full-report-test", scopeJson: scopeFile });

  const highFinding = path.join(root, "high.json");
  writeJson(highFinding, {
    findingId: "F1",
    description: "High finding",
    source: "references/zpa/index.md:2",
    severity: "High",
    status: "Open",
    remediation: "Remediate high",
  });
  recordFinding({ root, auditSlug: "full-report-test", findingJson: highFinding });

  const lowFinding = path.join(root, "low.json");
  writeJson(lowFinding, {
    findingId: "F2",
    description: "Low finding",
    source: "references/zpa/index.md:3",
    severity: "Low",
    status: "Acknowledged",
    remediation: "Remediate low",
  });
  recordFinding({ root, auditSlug: "full-report-test", findingJson: lowFinding });

  const report = renderAuditReport({ root, auditSlug: "full-report-test" });

  assert.match(report, /## Findings/, "report should have Findings section");
  assert.match(report, /### High/, "report should have High severity group");
  assert.match(report, /### Low/, "report should have Low severity group");
  assert.match(report, /F1/, "report should contain F1");
  assert.match(report, /F2/, "report should contain F2");
  assert.match(report, /Remediate high/, "report should contain High remediation");
  assert.match(report, /Remediate low/, "report should contain Low remediation");

  // High group must appear BEFORE Low group.
  const highIdx = report.indexOf("### High");
  const lowIdx = report.indexOf("### Low");
  assert.ok(highIdx < lowIdx, "High group must appear before Low group");

  // Scope fields must appear.
  assert.match(report, /ZPA index/, "report should contain scope topic");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── capabilities ──────────────────────────────────────────────────────────────

test("capabilities: returns all supported operations including audit-status", () => {
  const cap = capabilities();
  assert.equal(cap.status, "ok");
  assert.ok(Array.isArray(cap.supported), "supported should be an array");
  assert.ok(cap.supported.includes("open-audit"), "should support open-audit");
  assert.ok(cap.supported.includes("record-finding"), "should support record-finding");
  assert.ok(cap.supported.includes("record-check-output"), "should support record-check-output");
  assert.ok(cap.supported.includes("render-audit-report"), "should support render-audit-report");
  assert.ok(cap.supported.includes("audit-status"), "should support audit-status");
  assert.ok(cap.supported.includes("capabilities"), "should support capabilities");
});

// ── REQUIRED_INTAKE_MARKERS and REGISTER_TABLE_HEADER exports ─────────────────

test("REQUIRED_INTAKE_MARKERS and REGISTER_TABLE_HEADER are exported and non-empty", () => {
  assert.ok(Array.isArray(REQUIRED_INTAKE_MARKERS), "REQUIRED_INTAKE_MARKERS should be array");
  assert.ok(REQUIRED_INTAKE_MARKERS.length > 0, "REQUIRED_INTAKE_MARKERS should be non-empty");
  assert.ok(typeof REGISTER_TABLE_HEADER === "string", "REGISTER_TABLE_HEADER should be string");
  assert.ok(REGISTER_TABLE_HEADER.includes("ID"), "REGISTER_TABLE_HEADER should include ID column");
  assert.ok(REGISTER_TABLE_HEADER.includes("Severity"), "REGISTER_TABLE_HEADER should include Severity column");
  assert.ok(REGISTER_TABLE_HEADER.includes("Status"), "REGISTER_TABLE_HEADER should include Status column");
});

// ── Error messages are repair-naming (fabrication-resistant) ─────────────────

test("record-finding rejection names the exact repair action", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zpa/index.md"] }));
  openAudit({ root, auditSlug: "repair-msg-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "F1",
    description: "Test",
    source: "completely-fake-path/nonexistent.md:1",
    severity: "Medium",
    status: "Open",
    remediation: "Fix",
  });

  let errorMessage = "";
  try {
    recordFinding({ root, auditSlug: "repair-msg-test", findingJson: findingFile });
    assert.fail("should have thrown");
  } catch (err) {
    errorMessage = err.message;
  }

  // The error must name the repair — not just say "invalid".
  assert.match(errorMessage, /record-check-output|file:line|cross-file reference/, "error should name repair action");
  assert.match(errorMessage, /Findings cannot be asserted without resolving evidence/, "error should state evidence requirement");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── report tests against real REPO_ROOT ─────────────────────────────────────

test("render-audit-report with real repo root and a real file:line citation", () => {
  const auditSlug = `real-repo-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const auditDir = path.join(REPO_ROOT, "_data", "audits", auditSlug);

  try {
    const scopeFile = path.join(os.tmpdir(), `scope-${auditSlug}.json`);
    writeJson(scopeFile, {
      description: "Test audit against real repo",
      scope: { paths: ["references/zpa"] },
      checksRun: [],
    });

    openAudit({ root: REPO_ROOT, auditSlug, scopeJson: scopeFile });

    // Use a real file from the repo.
    const findingFile = path.join(os.tmpdir(), `finding-${auditSlug}.json`);
    // references/zpa/index.md exists in the real repo.
    writeJson(findingFile, {
      findingId: "F1",
      description: "Test finding using real file",
      source: "agents/auditor/methodology.md:1",
      severity: "Low",
      status: "Open",
      remediation: "n/a — test finding",
    });
    recordFinding({ root: REPO_ROOT, auditSlug, findingJson: findingFile });

    const report = renderAuditReport({ root: REPO_ROOT, auditSlug });
    assert.match(report, /F1/, "report should contain F1 finding");
    assert.match(report, /Open/, "report should reflect Open status");
    assert.doesNotMatch(report, /Resolved/, "report must not contain status not in ledger");
  } finally {
    try { fs.rmSync(auditDir, { recursive: true, force: true }); } catch { /* best-effort */ }
  }
});
