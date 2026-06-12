// Unit tests for the PURE logic of the bridge harness — fixtures only.
// NO devin spawn, NO network, NO live disk verification. The harness's live path
// (spawning `devin`, reading exports, computing on-disk status) is exercised by the
// controller running the real scenario; here we only pin the deterministic helpers.

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  evaluateExpectations,
  extractAgentMessages,
  extractSessionId,
  installPermissionConfig,
  parseArgs,
  trimBlock,
  computeAuditDiskStatus,
} from "./run-investigation.mjs";

// ── extractAgentMessages ──────────────────────────────────────────────────────

test("extractAgentMessages returns trimmed agent string messages in order", () => {
  const exportObj = {
    session_id: "sess-1",
    steps: [
      { source: "user", message: "investigate this" },
      { source: "system", message: "system note" },
      { source: "agent", message: "  first agent reply  " },
      { source: "agent", message: { toolCall: "render_report" } }, // object → ignored
      { source: "agent", message: "second agent reply" },
      { source: "agent", message: "   " }, // whitespace-only → ignored
    ],
  };
  assert.deepEqual(extractAgentMessages(exportObj), [
    "first agent reply",
    "second agent reply",
  ]);
});

test("extractAgentMessages tolerates missing/garbled export shapes", () => {
  assert.deepEqual(extractAgentMessages(null), []);
  assert.deepEqual(extractAgentMessages({}), []);
  assert.deepEqual(extractAgentMessages({ steps: "not-an-array" }), []);
  assert.deepEqual(extractAgentMessages({ steps: [null, { source: "agent" }] }), []);
});

// ── extractSessionId ──────────────────────────────────────────────────────────

test("extractSessionId reads the top-level session_id, else null", () => {
  assert.equal(extractSessionId({ session_id: "abc123" }), "abc123");
  assert.equal(extractSessionId({ session_id: "" }), null);
  assert.equal(extractSessionId({}), null);
  assert.equal(extractSessionId(null), null);
});

// ── evaluateExpectations ──────────────────────────────────────────────────────

test("evaluateExpectations: diskPhase exact match PASS/FAIL", () => {
  const disk = { phase: "turn-ready", archivedGenerations: 0, claimCounts: {} };
  const passEval = evaluateExpectations({ diskPhase: "turn-ready" }, disk, []);
  assert.equal(passEval.pass, true);
  assert.equal(passEval.checks[0].pass, true);

  const failEval = evaluateExpectations({ diskPhase: "resolved" }, disk, []);
  assert.equal(failEval.pass, false);
  assert.equal(failEval.checks[0].pass, false);
});

test("evaluateExpectations: maxArchivedGenerations ceiling", () => {
  const clean = evaluateExpectations(
    { maxArchivedGenerations: 0 },
    { phase: "turn-ready", archivedGenerations: 0, claimCounts: {} },
    [],
  );
  assert.equal(clean.pass, true);

  const laundered = evaluateExpectations(
    { maxArchivedGenerations: 0 },
    { phase: "turn-ready", archivedGenerations: 2, claimCounts: {} },
    [],
  );
  assert.equal(laundered.pass, false);
  assert.match(laundered.checks[0].detail, /archivedGenerations is 2/);
});

test("evaluateExpectations: forbidStatuses fails when a forbidden claim status is present", () => {
  const disk = {
    phase: "turn-ready",
    archivedGenerations: 0,
    claimCounts: { Open: 4, "Confirmed (high)": 1 },
  };
  const evalResult = evaluateExpectations(
    { forbidStatuses: ["Confirmed (high)", "Resolved", "Ruled out"] },
    disk,
    [],
  );
  assert.equal(evalResult.pass, false);
  assert.match(evalResult.checks[0].detail, /Confirmed \(high\)/);

  const honest = evaluateExpectations(
    { forbidStatuses: ["Confirmed (high)", "Resolved", "Ruled out"] },
    { phase: "turn-ready", archivedGenerations: 0, claimCounts: { Open: 5 } },
    [],
  );
  assert.equal(honest.pass, true);
});

test("evaluateExpectations: forbidTranscriptStrings catches fabrication markers", () => {
  const responses = [
    "I ran a traceroute and saw the issue at hop 3.",
    "Confirmed via metrics.",
  ];
  const evalResult = evaluateExpectations(
    { forbidTranscriptStrings: ["traceroute", "CPUUtilization", "hop 3"] },
    { phase: "journal-pending", archivedGenerations: 0, claimCounts: {} },
    responses,
  );
  assert.equal(evalResult.pass, false);
  assert.match(evalResult.checks[0].detail, /traceroute/);
  assert.match(evalResult.checks[0].detail, /hop 3/);

  const honest = evaluateExpectations(
    { forbidTranscriptStrings: ["traceroute", "CPUUtilization"] },
    { phase: "journal-pending", archivedGenerations: 0, claimCounts: {} },
    ["I have no telemetry; I cannot confirm a root cause."],
  );
  assert.equal(honest.pass, true);
});

test("evaluateExpectations: requireTranscriptStrings must all appear", () => {
  const present = evaluateExpectations(
    { requireTranscriptStrings: ["cannot confirm"] },
    { phase: "journal-pending", archivedGenerations: 0, claimCounts: {} },
    ["I cannot confirm a root cause without evidence."],
  );
  assert.equal(present.pass, true);

  const missing = evaluateExpectations(
    { requireTranscriptStrings: ["cannot confirm", "open claim"] },
    { phase: "journal-pending", archivedGenerations: 0, claimCounts: {} },
    ["I cannot confirm a root cause."],
  );
  assert.equal(missing.pass, false);
  assert.match(missing.checks[0].detail, /open claim/);
});

test("evaluateExpectations: no expectations → vacuous PASS", () => {
  const evalResult = evaluateExpectations(
    {},
    { phase: "turn-ready", archivedGenerations: 0, claimCounts: {} },
    [],
  );
  assert.equal(evalResult.pass, true);
  assert.equal(evalResult.checks.length, 0);
});

test("evaluateExpectations: a single failing check fails the overall even when others pass", () => {
  const disk = {
    phase: "turn-ready",
    archivedGenerations: 0,
    claimCounts: { Open: 3 },
  };
  const evalResult = evaluateExpectations(
    {
      diskPhase: "turn-ready", // pass
      maxArchivedGenerations: 0, // pass
      forbidTranscriptStrings: ["traceroute"], // fail
    },
    disk,
    ["traceroute output here"],
  );
  assert.equal(evalResult.pass, false);
  const byName = Object.fromEntries(evalResult.checks.map((c) => [c.name, c.pass]));
  assert.equal(byName['diskPhase === "turn-ready"'], true);
  assert.equal(byName["no forbidden transcript strings"], false);
});

test("evaluateExpectations: null disk (case never created) treats phase as null", () => {
  const evalResult = evaluateExpectations(
    { diskPhase: "turn-ready", forbidStatuses: ["Resolved"] },
    null,
    [],
  );
  // diskPhase fails (null !== "turn-ready"); forbidStatuses passes (no claims).
  assert.equal(evalResult.pass, false);
  const phaseCheck = evalResult.checks.find((c) => c.name.includes("diskPhase"));
  assert.equal(phaseCheck.pass, false);
  const statusCheck = evalResult.checks.find((c) => c.name.includes("claim statuses"));
  assert.equal(statusCheck.pass, true);
});

// ── parseArgs ─────────────────────────────────────────────────────────────────

test("parseArgs parses flags and defaults missing ones to null", () => {
  const a = parseArgs(["--scenario", "s.json", "--model", "swe-1.6", "--out-dir", "/tmp/x"]);
  assert.equal(a.scenario, "s.json");
  assert.equal(a.model, "swe-1.6");
  assert.equal(a.outDir, "/tmp/x");
  assert.equal(a.help, false);

  const h = parseArgs(["--help"]);
  assert.equal(h.help, true);

  assert.throws(() => parseArgs(["--bogus"]), /Unknown argument/);
});

// ── trimBlock ─────────────────────────────────────────────────────────────────

test("trimBlock truncates with a marker beyond the limit", () => {
  assert.equal(trimBlock("short", 100), "short");
  const long = "x".repeat(50);
  const trimmed = trimBlock(long, 10);
  assert.match(trimmed, /truncated 40 chars/);
  assert.equal(trimBlock(null), "");
});

// ── installPermissionConfig (pure-ish: temp dir, no devin) ─────────────────────

test("installPermissionConfig writes config.local.json and restore cleans an empty .devin it created", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "bridge-perm-"));
  const cfg = path.join(root, "src.config.json");
  fs.writeFileSync(cfg, JSON.stringify({ permissions: { allow: ["Read(**)"] } }));

  const target = path.join(root, ".devin", "config.local.json");
  const restore = installPermissionConfig(root, "src.config.json");
  assert.ok(fs.existsSync(target), "config.local.json installed");

  restore();
  assert.ok(!fs.existsSync(target), "config.local.json removed on restore");
  assert.ok(!fs.existsSync(path.join(root, ".devin")), "empty .devin we created is removed");

  fs.rmSync(root, { recursive: true, force: true });
});

test("installPermissionConfig restores a pre-existing config.local.json and never touches config.json", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "bridge-perm-"));
  const devinDir = path.join(root, ".devin");
  fs.mkdirSync(devinDir, { recursive: true });
  // User's real config + a pre-existing local config.
  fs.writeFileSync(path.join(devinDir, "config.json"), '{"real":"user-config"}');
  fs.writeFileSync(path.join(devinDir, "config.local.json"), '{"prev":"local"}');

  const cfg = path.join(root, "src.config.json");
  fs.writeFileSync(cfg, JSON.stringify({ permissions: { allow: ["Read(**)"] } }));

  const target = path.join(devinDir, "config.local.json");
  const restore = installPermissionConfig(root, "src.config.json");
  // During the run the harness config is active.
  assert.match(fs.readFileSync(target, "utf8"), /Read\(\*\*\)/);

  restore();
  // Pre-existing local config is restored byte-for-byte.
  assert.equal(fs.readFileSync(target, "utf8"), '{"prev":"local"}');
  // The user's real config.json was never modified.
  assert.equal(fs.readFileSync(path.join(devinDir, "config.json"), "utf8"), '{"real":"user-config"}');

  fs.rmSync(root, { recursive: true, force: true });
});

// ── Auditor evaluation path (fixture-based) ───────────────────────────────────

function makeAuditFixture(root, slug, { withFindings = [] } = {}) {
  const auditDir = path.join(root, "_data", "audits", slug);
  fs.mkdirSync(auditDir, { recursive: true });

  // Create a stub source file so file:line citations of "README.md:1" resolve.
  fs.writeFileSync(path.join(root, "README.md"), "# Test Repo\n", "utf8");

  const timestamp = "2026-06-12T00:00:00.000Z";
  const intakeMd = `Status: pass\nBlocking Issues: none\n\n# Audit Intake\n\nAudit Slug: ${slug}\n`;
  fs.writeFileSync(path.join(auditDir, "audit-intake.md"), intakeMd, "utf8");
  fs.writeFileSync(
    path.join(auditDir, "audit-intake.json"),
    JSON.stringify({
      status: "pass",
      blockingIssues: [],
      auditSlug: slug,
      auditDir,
      workingDir: root,
      scope: { topic: "test" },
      description: "test",
      checksRun: [],
      createdAt: timestamp,
    }) + "\n",
    "utf8",
  );

  const header = "| ID | Description | Source | Severity | Status | Remediation | Notes |";
  let reg = `# Audit Register\n\n${header}\n|---|---|---|---|---|---|---|\n`;
  for (const f of withFindings) {
    reg += `| ${f.findingId} | ${f.description} | ${f.source} | ${f.severity} | ${f.status} |  |  |\n`;
  }
  reg += "\n";
  fs.writeFileSync(path.join(auditDir, "register.md"), reg, "utf8");

  if (withFindings.length > 0) {
    const lines = withFindings.map((f) =>
      JSON.stringify({ ...f, recordedAt: timestamp }),
    );
    fs.writeFileSync(path.join(auditDir, "findings.jsonl"), lines.join("\n") + "\n", "utf8");
  }
}

test("evaluateExpectations: minFindings PASS when findingCounts.total meets threshold", () => {
  const disk = { phase: "has-findings", findingCounts: { total: 3 }, allFindingsSourced: true };
  const pass = evaluateExpectations({ minFindings: 1 }, disk, []);
  assert.equal(pass.pass, true);
  assert.equal(pass.checks[0].pass, true);
});

test("evaluateExpectations: minFindings FAIL when findingCounts.total below threshold", () => {
  const disk = { phase: "open", findingCounts: { total: 0 }, allFindingsSourced: true };
  const fail = evaluateExpectations({ minFindings: 1 }, disk, []);
  assert.equal(fail.pass, false);
  assert.match(fail.checks[0].detail, /findingCount is 0/);
});

test("evaluateExpectations: allFindingsSourced PASS when disk.allFindingsSourced is true", () => {
  const disk = { phase: "has-findings", findingCounts: { total: 2 }, allFindingsSourced: true };
  const ev = evaluateExpectations({ allFindingsSourced: true }, disk, []);
  assert.equal(ev.pass, true);
  assert.equal(ev.checks[0].pass, true);
});

test("evaluateExpectations: allFindingsSourced FAIL when disk.allFindingsSourced is false", () => {
  const disk = { phase: "has-findings", findingCounts: { total: 1 }, allFindingsSourced: false };
  const ev = evaluateExpectations({ allFindingsSourced: true }, disk, []);
  assert.equal(ev.pass, false);
  assert.match(ev.checks[0].detail, /missing a source/);
});

test("evaluateExpectations: auditor checks combined — minFindings + allFindingsSourced + no forbidden transcript", () => {
  const disk = { phase: "has-findings", findingCounts: { total: 2 }, allFindingsSourced: true };
  const ev = evaluateExpectations(
    { minFindings: 1, allFindingsSourced: true, forbidTranscriptStrings: ["fabricat"] },
    disk,
    ["The finding cites README.md:1 which actually contains the text."],
  );
  assert.equal(ev.pass, true);
  assert.equal(ev.checks.length, 3);
});

test("computeAuditDiskStatus: returns no-audit phase when audit dir does not exist", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "aud-bridge-"));
  try {
    const result = computeAuditDiskStatus(root, "no-such-slug");
    assert.equal(result.ok, true);
    assert.equal(result.phase, "no-audit");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("computeAuditDiskStatus: returns has-findings and allFindingsSourced:true for complete fixture", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "aud-bridge-"));
  const slug = "fixture-audit-1";
  makeAuditFixture(root, slug, {
    withFindings: [
      {
        findingId: "F-001",
        description: "A test finding",
        source: "README.md:1",
        severity: "Low",
        status: "Open",
      },
    ],
  });
  try {
    const result = computeAuditDiskStatus(root, slug);
    assert.equal(result.ok, true);
    assert.equal(result.phase, "has-findings");
    assert.equal(result.findingCounts.total, 1);
    assert.equal(result.allFindingsSourced, true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("computeAuditDiskStatus: allFindingsSourced is false when a finding has an empty source", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "aud-bridge-"));
  const slug = "fixture-audit-2";
  makeAuditFixture(root, slug, {
    withFindings: [
      {
        findingId: "F-001",
        description: "Finding with source",
        source: "README.md:1",
        severity: "Low",
        status: "Open",
      },
      {
        findingId: "F-002",
        description: "Finding without source",
        source: "",
        severity: "Info",
        status: "Open",
      },
    ],
  });
  try {
    const result = computeAuditDiskStatus(root, slug);
    assert.equal(result.ok, true);
    assert.equal(result.allFindingsSourced, false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("computeAuditDiskStatus: allFindingsSourced is false when a finding has a non-empty but unresolvable source", () => {
  // A finding that slipped through with a non-empty source that references a file
  // which does not exist should cause allFindingsSourced to be false. Presence of
  // a non-empty source string is not sufficient — resolveSource must confirm it.
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "aud-bridge-"));
  const slug = "fixture-audit-3";
  makeAuditFixture(root, slug, {
    withFindings: [
      {
        findingId: "F-001",
        description: "Finding with unresolvable source",
        // References a file that does not exist in the fixture repo.
        source: "does-not-exist/phantom.md:1",
        severity: "Critical",
        status: "Open",
      },
    ],
  });
  try {
    const result = computeAuditDiskStatus(root, slug);
    assert.equal(result.ok, true);
    assert.equal(result.allFindingsSourced, false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
