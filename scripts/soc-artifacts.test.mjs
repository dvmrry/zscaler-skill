#!/usr/bin/env node
/**
 * soc-artifacts.test.mjs
 *
 * Unit tests for the SOC posture-review helper. Fixture-based, no network.
 * Tests the three load-bearing properties:
 * 1. Evidence-gated records (record-finding gate, framework-not-evidence guard)
 * 2. Answer-from-artifact (render-soc-report derives from findings.jsonl only)
 * 3. Fabrication-resistant errors (rejection messages name the repair)
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  openReview,
  recordEvidence,
  recordFinding,
  renderSocReport,
  socStatus,
  capabilities,
  REQUIRED_INTAKE_MARKERS,
  REGISTER_TABLE_HEADER,
} from "./soc-artifacts.mjs";

const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPTS_DIR, "..");

// ── Fixture helpers ───────────────────────────────────────────────────────────

function tempRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "soc-test-"));
  // Create small real files for file:line citations.
  fs.mkdirSync(path.join(root, "references", "zidentity"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "references", "zidentity", "admin-rbac.md"),
    `# Admin RBAC\n\nLine 2 content.\nLine 3 content.\nLine 4 content.\n`,
    "utf8",
  );
  fs.mkdirSync(path.join(root, "references", "shared"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "references", "shared", "admin-rbac.md"),
    `# Shared Admin RBAC\n\nLine 2.\nLine 3.\nLine 4.\n`,
    "utf8",
  );
  fs.mkdirSync(path.join(root, "agents", "soc"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "agents", "soc", "prompt.md"),
    `# SOC prompt\n`,
    "utf8",
  );
  return root;
}

function makeScope({ topic, paths: scopePaths, description, threatModel, subtype } = {}) {
  const scopeObj = {};
  if (scopePaths !== undefined) scopeObj.paths = scopePaths;
  if (topic !== undefined) scopeObj.topic = topic;
  return {
    description: description || "Test SOC posture review scope",
    scope: scopeObj,
    ...(threatModel ? { threatModel } : {}),
    ...(subtype ? { subtype } : {}),
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

function writeFindingFile(root, finding, filename = "finding.json") {
  const p = path.join(root, filename);
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

// ── open-review happy path ─────────────────────────────────────────────────────

test("open-review: creates all three artifacts with correct markers", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));

  const result = openReview({ root, reviewSlug: "test-review-1", scopeJson: scopeFile });

  assert.equal(result.status, "pass");
  assert.equal(result.operation, "open-review");
  assert.equal(result.reviewSlug, "test-review-1");

  // review-intake.md must have required markers.
  const intakeMd = fs.readFileSync(result.reviewIntakePath, "utf8");
  for (const marker of REQUIRED_INTAKE_MARKERS) {
    assert.ok(intakeMd.includes(marker), `intake.md missing marker: ${marker}`);
  }
  assert.match(intakeMd, /^Status: pass$/m, "intake.md status should be pass");
  assert.match(intakeMd, /^Blocking Issues: none$/m, "intake.md blocking issues should be none");

  // review-intake.json must be valid.
  const intakeJson = JSON.parse(fs.readFileSync(result.reviewIntakeJsonPath, "utf8"));
  assert.equal(intakeJson.reviewSlug, "test-review-1");

  // register.md must contain the canonical table header.
  const registerMd = fs.readFileSync(result.registerPath, "utf8");
  assert.ok(registerMd.includes(REGISTER_TABLE_HEADER), "register.md missing table header");

  fs.rmSync(root, { recursive: true, force: true });
});

test("open-review: writes threatModel and subtype to intake", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({
    paths: ["references/zidentity/admin-rbac.md"],
    threatModel: "compromised admin account",
    subtype: "access",
  }));

  const result = openReview({ root, reviewSlug: "test-review-subtype", scopeJson: scopeFile });
  const intakeJson = JSON.parse(fs.readFileSync(result.reviewIntakeJsonPath, "utf8"));
  assert.equal(intakeJson.threatModel, "compromised admin account");
  assert.equal(intakeJson.subtype, "access");

  fs.rmSync(root, { recursive: true, force: true });
});

test("open-review: rejects missing scope.paths AND scope.topic", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, { description: "No scope", scope: {} });

  assert.throws(
    () => openReview({ root, reviewSlug: "no-scope-review", scopeJson: scopeFile }),
    /scope\.paths.*scope\.topic/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("open-review: rejects missing description", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, { scope: { paths: ["references/zidentity/admin-rbac.md"] } });

  assert.throws(
    () => openReview({ root, reviewSlug: "no-desc-review", scopeJson: scopeFile }),
    /description/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("open-review: rejects invalid subtype", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({
    paths: ["references/zidentity/admin-rbac.md"],
    subtype: "invalidtype",
  }));

  assert.throws(
    () => openReview({ root, reviewSlug: "bad-subtype-review", scopeJson: scopeFile }),
    /subtype must be one of/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("open-review: overwrite refusal without --force", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));

  openReview({ root, reviewSlug: "overwrite-test", scopeJson: scopeFile });

  assert.throws(
    () => openReview({ root, reviewSlug: "overwrite-test", scopeJson: scopeFile }),
    /already exist/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("open-review: --force overwrites existing artifacts", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));

  openReview({ root, reviewSlug: "force-test", scopeJson: scopeFile });
  const result2 = openReview({ root, reviewSlug: "force-test", scopeJson: scopeFile, force: true });
  assert.equal(result2.status, "pass");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── record-finding evidence gate — REJECT tests ──────────────────────────────

test("record-finding: REJECT finding with nonexistent file:line source", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "gate-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Test finding",
    source: "references/zidentity/nonexistent.md:1",
    severity: "Medium",
    confidence: "medium",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, reviewSlug: "gate-test", findingJson: findingFile }),
    /source does not resolve|does not exist/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: REJECT finding whose source is ONLY a CWE framework tag", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "cwe-reject-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "CWE-only finding",
    source: "CWE-269",
    severity: "High",
    confidence: "medium",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, reviewSlug: "cwe-reject-test", findingJson: findingFile }),
    /framework tag classifies a finding; it does not prove it/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: REJECT finding whose source is ONLY a MITRE framework tag", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "mitre-reject-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "MITRE-only finding",
    source: "MITRE:T1078",
    severity: "High",
    confidence: "medium",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, reviewSlug: "mitre-reject-test", findingJson: findingFile }),
    /framework tag classifies a finding; it does not prove it/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: multi-word framework sources get the specific framework-not-evidence message", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "multiword-fw-test", scopeJson: scopeFile });

  // Multi-word framework references have no file shape; they must be rejected
  // with the taxonomy-naming message, not the generic format error.
  for (const source of ["MITRE ATT&CK T1078", "NIST SP 800-53", "OWASP A01:2021"]) {
    const findingFile = writeFindingFile(root, {
      findingId: "SOC-001",
      title: "framework-sourced finding",
      source,
      severity: "Medium",
      confidence: "medium",
      status: "Open",
      remediation: "Fix it",
    });
    assert.throws(
      () => recordFinding({ root, reviewSlug: "multiword-fw-test", findingJson: findingFile }),
      /framework tag classifies a finding; it does not prove it/,
      `multi-word framework source not given the specific message: ${source}`,
    );
  }

  // A real file whose name starts with a framework word must still resolve.
  const goodFile = writeFindingFile(root, {
    findingId: "SOC-002",
    title: "real file cite",
    source: "references/zidentity/admin-rbac.md:1",
    severity: "Low",
    confidence: "medium",
    status: "Open",
    remediation: "Fix it",
  });
  const result = recordFinding({ root, reviewSlug: "multiword-fw-test", findingJson: goodFile });
  assert.equal(result.status, "ok");

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: REJECT finding whose source is ONLY a NIST framework tag", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "nist-reject-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "NIST-only finding",
    source: "NIST AC-6",
    severity: "Medium",
    confidence: "low",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, reviewSlug: "nist-reject-test", findingJson: findingFile }),
    /framework tag classifies a finding; it does not prove it/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: REJECT High severity with cross-file-only source", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "high-crossfile-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "High severity cross-file only",
    source: "references/zidentity/admin-rbac.md + references/shared/admin-rbac.md",
    severity: "High",
    confidence: "medium",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, reviewSlug: "high-crossfile-test", findingJson: findingFile }),
    /cross-file reference alone is too weak|file:line or recorded-evidence source/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: REJECT finding with line beyond EOF", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "eof-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Test finding",
    source: "references/zidentity/admin-rbac.md:999",
    severity: "Medium",
    confidence: "medium",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, reviewSlug: "eof-test", findingJson: findingFile }),
    /beyond EOF|source does not resolve/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: REJECT finding citing the phantom trailing-newline line (off-by-one)", () => {
  // The fixture file has 5 visible lines and a trailing newline.
  // The correct lineCount is 5; line 6 must be rejected.
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "off-by-one-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Phantom line citation",
    source: "references/zidentity/admin-rbac.md:6",
    severity: "Critical",
    confidence: "low",
    status: "Open",
    remediation: "Fix it",
  });

  assert.throws(
    () => recordFinding({ root, reviewSlug: "off-by-one-test", findingJson: findingFile }),
    /beyond EOF|source does not resolve/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

// ── record-finding — ACCEPT tests ────────────────────────────────────────────

test("record-finding: ACCEPT real file:line source", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "accept-fileline", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Real file:line citation",
    source: "references/zidentity/admin-rbac.md:2",
    severity: "High",
    confidence: "high",
    status: "Open",
    remediation: "Fix it",
  });

  const result = recordFinding({ root, reviewSlug: "accept-fileline", findingJson: findingFile });
  assert.equal(result.status, "ok");
  assert.equal(result.findingId, "SOC-001");

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: ACCEPT finding citing recorded evidence", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "accept-evidence", scopeJson: scopeFile });

  // Record evidence first.
  const evidenceFile = path.join(root, "siem-output.txt");
  fs.writeFileSync(evidenceFile, "Admin role: Super Admin granted to user@example.com\n", "utf8");
  recordEvidence({
    root,
    reviewSlug: "accept-evidence",
    name: "admin-roles-siem",
    sourceFile: evidenceFile,
    evidenceType: "siem",
  });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Finding backed by recorded evidence",
    source: "evidence:admin-roles-siem",
    severity: "High",
    confidence: "high",
    status: "Open",
    remediation: "Revoke super admin",
  });

  const result = recordFinding({ root, reviewSlug: "accept-evidence", findingJson: findingFile });
  assert.equal(result.status, "ok");

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: ACCEPT Low severity with cross-file source", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "low-crossfile", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Low severity cross-file comparison",
    source: "references/zidentity/admin-rbac.md + references/shared/admin-rbac.md",
    severity: "Low",
    confidence: "low",
    status: "Open",
    remediation: "Align RBAC definitions",
  });

  const result = recordFinding({ root, reviewSlug: "low-crossfile", findingJson: findingFile });
  assert.equal(result.status, "ok");

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-finding: taxonomy field with framework tags is ALLOWED (metadata, not source)", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "taxonomy-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Finding with taxonomy metadata",
    // source is a real file:line — evidence. taxonomy is metadata.
    source: "references/zidentity/admin-rbac.md:2",
    taxonomy: ["CWE-269", "MITRE:T1078", "NIST:AC-6"],
    severity: "High",
    confidence: "high",
    status: "Open",
    remediation: "Restrict admin roles",
  });

  const result = recordFinding({ root, reviewSlug: "taxonomy-test", findingJson: findingFile });
  assert.equal(result.status, "ok");

  // Verify taxonomy is preserved in findings.jsonl.
  const paths = { findingsPath: path.join(root, "_data", "soc-reviews", "taxonomy-test", "findings.jsonl") };
  const lines = fs.readFileSync(paths.findingsPath, "utf8").trim().split("\n");
  const recorded = JSON.parse(lines[0]);
  assert.deepEqual(recorded.taxonomy, ["CWE-269", "MITRE:T1078", "NIST:AC-6"]);

  fs.rmSync(root, { recursive: true, force: true });
});

// ── register.md is always re-derived ─────────────────────────────────────────

test("register.md is re-derived from findings.jsonl on each record (hand-edits overwritten)", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  const result = openReview({ root, reviewSlug: "rederive-test", scopeJson: scopeFile });

  const registerPath = result.registerPath;

  // Hand-edit the register.md to add a fake row.
  fs.appendFileSync(registerPath, "| HAND-EDITED | Fabricated | nowhere | nowhere | Critical | high | Open | n/a | |\n", "utf8");
  assert.match(fs.readFileSync(registerPath, "utf8"), /HAND-EDITED/, "hand edit should be present");

  // Record a real finding — should overwrite register.md from findings.jsonl.
  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Real finding",
    source: "references/zidentity/admin-rbac.md:1",
    severity: "Low",
    confidence: "medium",
    status: "Open",
    remediation: "Fix it",
  });
  recordFinding({ root, reviewSlug: "rederive-test", findingJson: findingFile });

  const registerAfter = fs.readFileSync(registerPath, "utf8");
  assert.doesNotMatch(registerAfter, /HAND-EDITED/, "hand-edited row should be overwritten");
  assert.ok(registerAfter.includes("SOC-001"), "real finding SOC-001 should be present");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── render-soc-report: artifact derivation guard ─────────────────────────────

test("render-soc-report: contains only recorded findings (status absent from ledger cannot appear)", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "report-guard", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Open finding",
    source: "references/zidentity/admin-rbac.md:1",
    severity: "Medium",
    confidence: "medium",
    status: "Open",
    remediation: "Fix it",
  });
  recordFinding({ root, reviewSlug: "report-guard", findingJson: findingFile });

  const report = renderSocReport({ root, reviewSlug: "report-guard" });

  assert.match(report, /SOC-001/, "report must contain SOC-001");
  assert.match(report, /Open/, "report must reflect Open status");
  assert.doesNotMatch(report, /\bResolved\b/, "report must not claim Resolved when ledger has only Open");
  assert.doesNotMatch(report, /FABRICATED/, "report must not contain fabricated content");

  fs.rmSync(root, { recursive: true, force: true });
});

test("render-soc-report: throws actionable error when review does not exist", () => {
  const root = tempRepo();

  assert.throws(
    () => renderSocReport({ root, reviewSlug: "nonexistent-review-xyz" }),
    /SOC review not found|nonexistent-review-xyz/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("render-soc-report: includes scope, threat model, subtype, taxonomy, evidence recorded", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({
    paths: ["references/zidentity/admin-rbac.md"],
    threatModel: "compromised admin account",
    subtype: "access",
  }));
  openReview({ root, reviewSlug: "full-report-test", scopeJson: scopeFile });

  // Record evidence.
  const evidenceFile = path.join(root, "api-output.json");
  fs.writeFileSync(evidenceFile, '{"admins":[{"role":"SuperAdmin"}]}\n', "utf8");
  recordEvidence({
    root,
    reviewSlug: "full-report-test",
    name: "admin-api-response",
    sourceFile: evidenceFile,
    evidenceType: "api",
  });

  // Record a High finding.
  const highFinding = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Super Admin over-provisioning",
    category: "access",
    taxonomy: ["CWE-269", "NIST:AC-6"],
    source: "evidence:admin-api-response",
    severity: "High",
    confidence: "high",
    status: "Open",
    remediation: "Restrict to role-scoped admin",
  }, "high.json");
  recordFinding({ root, reviewSlug: "full-report-test", findingJson: highFinding });

  // Record a Low finding.
  const lowFinding = writeFindingFile(root, {
    findingId: "SOC-002",
    title: "Inconsistent RBAC definitions",
    source: "references/zidentity/admin-rbac.md + references/shared/admin-rbac.md",
    severity: "Low",
    confidence: "low",
    status: "Open",
    remediation: "Align definitions",
  }, "low.json");
  recordFinding({ root, reviewSlug: "full-report-test", findingJson: lowFinding });

  const report = renderSocReport({ root, reviewSlug: "full-report-test" });

  assert.match(report, /SOC Posture Report/, "report should have header");
  assert.match(report, /compromised admin account/, "report should include threat model");
  assert.match(report, /access/, "report should include subtype");
  assert.match(report, /### High/, "report should have High severity group");
  assert.match(report, /### Low/, "report should have Low severity group");
  assert.match(report, /SOC-001/, "report should contain SOC-001");
  assert.match(report, /SOC-002/, "report should contain SOC-002");
  assert.match(report, /CWE-269/, "report should contain taxonomy tags");
  assert.match(report, /admin-api-response/, "report should show recorded evidence");

  // High must appear before Low.
  const highIdx = report.indexOf("### High");
  const lowIdx = report.indexOf("### Low");
  assert.ok(highIdx < lowIdx, "High group must appear before Low group");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── soc-status phase transitions ──────────────────────────────────────────────

test("soc-status: phase no-review when review does not exist", () => {
  const root = tempRepo();

  const result = socStatus({ root, reviewSlug: "nonexistent-xyz" });
  assert.equal(result.operation, "soc-status");
  assert.equal(result.phase, "no-review");
  assert.equal(result.intake.present, false);
  assert.ok(result.nextCommands.length > 0, "no-review should offer an open-review CLI repair");
  assertNextCommandsDispatched(result.nextCommands, "soc-artifacts.mjs");

  fs.rmSync(root, { recursive: true, force: true });
});

test("soc-status: phase open after open-review with no findings", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "phase-open-test", scopeJson: scopeFile });

  const result = socStatus({ root, reviewSlug: "phase-open-test" });
  assert.equal(result.phase, "open");
  assert.equal(result.findingCounts.total, 0);
  assert.ok(result.nextCommands.length > 0, "open phase should offer legal CLI next commands");
  assert.ok(
    result.nextCommands.some((c) => c.includes(" record-evidence ")),
    "open phase should offer record-evidence",
  );
  assert.ok(
    result.nextCommands.some((c) => c.includes(" record-finding ")),
    "open phase should offer record-finding",
  );
  assertNextCommandsDispatched(result.nextCommands, "soc-artifacts.mjs");

  fs.rmSync(root, { recursive: true, force: true });
});

test("soc-status: phase has-findings after recording a finding", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "phase-findings-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "A finding",
    source: "references/zidentity/admin-rbac.md:1",
    severity: "Low",
    confidence: "medium",
    status: "Open",
    remediation: "Fix it",
  });
  recordFinding({ root, reviewSlug: "phase-findings-test", findingJson: findingFile });

  const result = socStatus({ root, reviewSlug: "phase-findings-test" });
  assert.equal(result.phase, "has-findings");
  assert.equal(result.findingCounts.total, 1);
  assert.equal(result.findingCounts.byStatus["Open"], 1);
  assert.equal(result.findingCounts.bySeverity["Low"], 1);
  assert.ok(
    result.nextCommands.some((c) => c.includes(" render-soc-report ")),
    "has-findings should offer render-soc-report",
  );
  assertNextCommandsDispatched(result.nextCommands, "soc-artifacts.mjs");

  fs.rmSync(root, { recursive: true, force: true });
});

test("soc-status: evidenceRecorded reflects recorded evidence", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "evidence-status-test", scopeJson: scopeFile });

  const evidenceFile = path.join(root, "out.txt");
  fs.writeFileSync(evidenceFile, "evidence\n", "utf8");
  recordEvidence({ root, reviewSlug: "evidence-status-test", name: "my-evidence", sourceFile: evidenceFile });

  const result = socStatus({ root, reviewSlug: "evidence-status-test" });
  assert.ok(result.evidenceRecorded.includes("my-evidence"), "status should list recorded evidence");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── duplicate findingId rejected ──────────────────────────────────────────────

test("record-finding: duplicate findingId is rejected", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "dup-test", scopeJson: scopeFile });

  const f1 = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "First",
    source: "references/zidentity/admin-rbac.md:1",
    severity: "Low",
    confidence: "medium",
    status: "Open",
    remediation: "Fix",
  });
  recordFinding({ root, reviewSlug: "dup-test", findingJson: f1 });

  const f1Dup = path.join(root, "finding-dup.json");
  writeJson(f1Dup, {
    findingId: "SOC-001",
    title: "Duplicate",
    source: "references/zidentity/admin-rbac.md:2",
    severity: "Low",
    confidence: "medium",
    status: "Open",
    remediation: "Fix",
  });

  assert.throws(
    () => recordFinding({ root, reviewSlug: "dup-test", findingJson: f1Dup }),
    /duplicate findingId/i,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

// ── Resolved status requires strong source ────────────────────────────────────

test("record-finding: REJECT Resolved status with only cross-file source", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "resolved-crossfile-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Resolved without strong source",
    source: "references/zidentity/admin-rbac.md + references/shared/admin-rbac.md",
    severity: "Low",
    confidence: "medium",
    status: "Resolved",
    remediation: "Already fixed",
  });

  assert.throws(
    () => recordFinding({ root, reviewSlug: "resolved-crossfile-test", findingJson: findingFile }),
    /cross-file reference alone is too weak/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

// ── record-evidence ───────────────────────────────────────────────────────────

test("record-evidence: stores evidence and registers name in intake", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "evidence-record-test", scopeJson: scopeFile });

  const evidenceFile = path.join(root, "siem-out.txt");
  fs.writeFileSync(evidenceFile, "Admin: SuperAdmin granted\n", "utf8");

  const result = recordEvidence({
    root,
    reviewSlug: "evidence-record-test",
    name: "admin-siem",
    sourceFile: evidenceFile,
    evidenceType: "siem",
  });

  assert.equal(result.status, "ok");
  assert.equal(result.evidenceName, "admin-siem");
  assert.ok(result.evidenceRecorded.includes("admin-siem"));
  assert.ok(fs.existsSync(result.destPath), "stored evidence file should exist");

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-evidence: rejects unsafe evidence names", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "unsafe-evidence-test", scopeJson: scopeFile });

  const evidenceFile = path.join(root, "out.txt");
  fs.writeFileSync(evidenceFile, "data\n", "utf8");

  assert.throws(
    () => recordEvidence({ root, reviewSlug: "unsafe-evidence-test", name: "../../evil", sourceFile: evidenceFile }),
    /evidence name must use only/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("record-evidence: rejects invalid evidence type", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "bad-evtype-test", scopeJson: scopeFile });

  const evidenceFile = path.join(root, "out.txt");
  fs.writeFileSync(evidenceFile, "data\n", "utf8");

  assert.throws(
    () => recordEvidence({
      root,
      reviewSlug: "bad-evtype-test",
      name: "my-evidence",
      sourceFile: evidenceFile,
      evidenceType: "invalidtype",
    }),
    /evidence-type must be one of/,
  );

  fs.rmSync(root, { recursive: true, force: true });
});

// ── capabilities ──────────────────────────────────────────────────────────────

test("capabilities: returns all supported operations", () => {
  const cap = capabilities();
  assert.equal(cap.status, "ok");
  assert.ok(Array.isArray(cap.supported));
  assert.ok(cap.supported.includes("open-review"));
  assert.ok(cap.supported.includes("record-evidence"));
  assert.ok(cap.supported.includes("record-finding"));
  assert.ok(cap.supported.includes("render-soc-report"));
  assert.ok(cap.supported.includes("soc-status"));
  assert.ok(cap.supported.includes("capabilities"));
});

// ── REQUIRED_INTAKE_MARKERS and REGISTER_TABLE_HEADER exports ─────────────────

test("REQUIRED_INTAKE_MARKERS and REGISTER_TABLE_HEADER are exported and correct", () => {
  assert.ok(Array.isArray(REQUIRED_INTAKE_MARKERS));
  assert.ok(REQUIRED_INTAKE_MARKERS.length > 0);
  assert.ok(typeof REGISTER_TABLE_HEADER === "string");
  assert.ok(REGISTER_TABLE_HEADER.includes("ID"));
  assert.ok(REGISTER_TABLE_HEADER.includes("Severity"));
  assert.ok(REGISTER_TABLE_HEADER.includes("Status"));
  assert.ok(REGISTER_TABLE_HEADER.includes("Taxonomy"));
  assert.ok(REGISTER_TABLE_HEADER.includes("Confidence"));
});

// ── Error messages are repair-naming (fabrication-resistant) ─────────────────

test("record-finding rejection names the exact repair action", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "repair-msg-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Test",
    source: "completely-fake-path/nonexistent.md:1",
    severity: "Medium",
    confidence: "medium",
    status: "Open",
    remediation: "Fix",
  });

  let errorMessage = "";
  try {
    recordFinding({ root, reviewSlug: "repair-msg-test", findingJson: findingFile });
    assert.fail("should have thrown");
  } catch (err) {
    errorMessage = err.message;
  }

  assert.match(errorMessage, /record-evidence|file:line|cross-file reference/, "error should name repair action");
  assert.match(errorMessage, /Findings cannot be asserted without resolving evidence/, "error should state evidence requirement");

  fs.rmSync(root, { recursive: true, force: true });
});

test("framework-not-evidence rejection names the taxonomy field as the correct home", () => {
  const root = tempRepo();
  const scopeFile = writeScopeFile(root, makeScope({ paths: ["references/zidentity/admin-rbac.md"] }));
  openReview({ root, reviewSlug: "framework-msg-test", scopeJson: scopeFile });

  const findingFile = writeFindingFile(root, {
    findingId: "SOC-001",
    title: "Framework-only source",
    source: "CWE-269",
    severity: "Medium",
    confidence: "medium",
    status: "Open",
    remediation: "Fix",
  });

  let errorMessage = "";
  try {
    recordFinding({ root, reviewSlug: "framework-msg-test", findingJson: findingFile });
    assert.fail("should have thrown");
  } catch (err) {
    errorMessage = err.message;
  }

  assert.match(errorMessage, /taxonomy field/, "error should name taxonomy field as correct location");
  assert.match(errorMessage, /does not prove it/, "error should explain frameworks don't prove findings");

  fs.rmSync(root, { recursive: true, force: true });
});

// ── Tests against real REPO_ROOT ─────────────────────────────────────────────

test("render-soc-report with real repo root and a real file:line citation", () => {
  const reviewSlug = `real-repo-soc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const reviewDir = path.join(REPO_ROOT, "_data", "soc-reviews", reviewSlug);

  try {
    const scopeFile = path.join(os.tmpdir(), `scope-${reviewSlug}.json`);
    writeJson(scopeFile, {
      description: "Test SOC review against real repo",
      scope: { paths: ["references/zidentity/admin-rbac.md", "references/shared/admin-rbac.md"] },
      threatModel: "compromised admin account",
      subtype: "access",
    });

    openReview({ root: REPO_ROOT, reviewSlug, scopeJson: scopeFile });

    const findingFile = path.join(os.tmpdir(), `finding-${reviewSlug}.json`);
    writeJson(findingFile, {
      findingId: "SOC-001",
      title: "Test finding using real file",
      source: "references/zidentity/admin-rbac.md:1",
      severity: "Low",
      confidence: "medium",
      status: "Open",
      remediation: "n/a — test finding",
    });
    recordFinding({ root: REPO_ROOT, reviewSlug, findingJson: findingFile });

    const report = renderSocReport({ root: REPO_ROOT, reviewSlug });
    assert.match(report, /SOC-001/, "report should contain SOC-001 finding");
    assert.match(report, /Open/, "report should reflect Open status");
    assert.doesNotMatch(report, /Resolved/, "report must not contain status not in ledger");
    assert.match(report, /compromised admin account/, "report should include threat model");
  } finally {
    try { fs.rmSync(reviewDir, { recursive: true, force: true }); } catch { /* best-effort */ }
  }
});
