import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  abandonTurn,
  beginTurn,
  capabilities,
  caseStatus,
  completeTurn,
  initializeTurnLedger,
  importEvidence,
  loadsStatus,
  openCase,
  recordLoads,
  verifyCaseFiles,
  verifyLoads,
} from "./investigator-artifacts.mjs";

function tempRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-skill-test-"));
  makeRepoFiles(root, [
    "agents/investigator/prompt.md",
    "agents/investigator/harness.md",
    "agents/investigator/grounding/zpa-segment-matching.md",
    "references/zia/logs/web-log-schema.md",
    "references/zpa/logs/access-log-schema.md",
    "references/zpa/logs/app-connector-metrics.md",
    "references/zpa/logs/app-connector-status.md",
  ]);
  return root;
}

test("capabilities reports helper-assisted complete-turn input support", () => {
  const result = capabilities();

  assert.equal(result.status, "ok");
  assert.ok(result.supported.includes("complete-turn"));
  assert.ok(result.supportedOptions["complete-turn"].includes("--turn-input-json"));
});

function makeRepoFiles(root, relativePaths) {
  for (const relativePath of relativePaths) {
    const target = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `# ${path.basename(relativePath)}\n`, "utf8");
  }
}

function writeJson(root, name, value) {
  const target = path.join(root, name);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return target;
}

function writeDiscoveryJournal(journalPath) {
  fs.writeFileSync(journalPath, `# Discovery Journal

ISSUE: ZPA users cannot reach wiki.internal
STATUS: Investigating

## Framing

| Field | Value |
|---|---|
| Symptom | ZPA users cannot reach wiki.internal |

## Proposed Loads

- agents/investigator/prompt.md
- agents/investigator/harness.md

## Claims

| Claim | Source | Status | Next evidence needed | Timestamp | Notes |
|---|---|---|---|---|---|
| H1: Application segment may not include the app | references/zpa/app-segments.md | Open (uncertain) | Check application segment snapshot | 2026-05-17T00:00:00.000Z | reference-grounded |

## Resolution

Open.
`, "utf8");
}

/**
 * Records the two mandatory loads for a case that was created with only
 * agents/investigator/prompt.md and agents/investigator/harness.md as
 * proposedLoads. Tests that need the ledger to be initializable call this
 * after openCase.
 */
function recordMinimalLoads(root, caseSlug) {
  return recordLoads({
    root,
    caseSlug,
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });
}

function createPassingCaseWithJournal() {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const result = openCase({
    root,
    caseSlug: "2026-05-17-turn-ledger",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
    ],
  });
  writeDiscoveryJournal(result.journalPath);
  recordMinimalLoads(root, result.caseSlug);
  return { root, caseSlug: result.caseSlug, journalPath: result.journalPath };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readManifest(root, caseSlug) {
  return fs.readFileSync(path.join(root, "_data/cases", caseSlug, "evidence", "MANIFEST.md"), "utf8");
}

test("openCase creates passing case intake, JSON, and journal artifacts", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
    recency: "today",
    userFlaggedSpecifics: ["wiki.internal"],
  });

  const result = openCase({
    root,
    caseSlug: "2026-05-17-zpa-wiki",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "agents/investigator/grounding/zpa-segment-matching.md",
    ],
  });

  assert.equal(result.status, "pass");
  assert.deepEqual(result.blockingIssues, []);

  const verified = verifyCaseFiles(root, "2026-05-17-zpa-wiki");
  assert.ok(fs.existsSync(verified.caseIntakePath));
  assert.ok(fs.existsSync(verified.caseIntakeJsonPath));
  assert.ok(fs.existsSync(verified.journalPath));

  const caseIntakeMd = fs.readFileSync(verified.caseIntakePath, "utf8");
  assert.match(caseIntakeMd, /^Status: pass$/m);
  assert.match(caseIntakeMd, /^Blocking Issues: none$/m);
});

test("openCase blocks speculative telemetry loads without telemetry framing", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZIA block page appears for payroll site",
    tenantCloud: "zs1",
    products: ["zia"],
    scope: "one user",
  });

  const result = openCase({
    root,
    caseSlug: "2026-05-17-zia-payroll",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zia/logs/web-log-schema.md",
    ],
  });

  assert.equal(result.status, "blocked");
  assert.match(result.blockingIssues.join(" "), /telemetry proposed loads require/);

  const caseIntakeMd = fs.readFileSync(
    path.join(root, "_data/cases/2026-05-17-zia-payroll/case-intake.md"),
    "utf8",
  );
  assert.match(caseIntakeMd, /^Status: blocked$/m);
});

test("openCase does not treat hyphenated hostname log token as telemetry context", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "node-helper-log-reject.example.invalid is unreachable",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });

  const result = openCase({
    root,
    caseSlug: "2026-05-17-hostname-log-token",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zpa/logs/access-log-schema.md",
    ],
  });

  assert.equal(result.status, "blocked");
  assert.match(result.blockingIssues.join(" "), /telemetry proposed loads require/);
});

test("openCase blocks metrics references without telemetry framing", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA app segment is unreachable",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });

  const result = openCase({
    root,
    caseSlug: "2026-05-17-zpa-reachability",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zpa/logs/app-connector-metrics.md",
    ],
  });

  assert.equal(result.status, "blocked");
  assert.match(result.blockingIssues.join(" "), /telemetry proposed loads require/);
});

test("openCase does not treat flagged host tokens as telemetry context", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA app segment is unreachable",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
    userFlaggedSpecifics: [
      "log.example.invalid",
      "metric-service.example.invalid",
    ],
  });

  const result = openCase({
    root,
    caseSlug: "2026-05-17-flagged-hosts",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zpa/logs/access-log-schema.md",
      "references/zpa/logs/app-connector-metrics.md",
    ],
  });

  assert.equal(result.status, "blocked");
  assert.match(result.blockingIssues.join(" "), /telemetry proposed loads require/);
});

test("openCase allows telemetry loads when evidence is in framing", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "LSS logs show empty connector field",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
    evidencePaths: ["_data/cases/example/evidence/lss.csv"],
  });

  const result = openCase({
    root,
    caseSlug: "2026-05-17-zpa-lss",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zpa/logs/app-connector-status.md",
    ],
  });

  assert.equal(result.status, "pass");
});

test("openCase allows compact telemetry terms in framing", () => {
  for (const [term, referencePath] of [
    ["syslog shows connector resets", "references/zpa/logs/access-log-schema.md"],
    ["weblog has blocked transaction entries", "references/zia/logs/web-log-schema.md"],
    ["log4j events appear in SIEM", "references/zia/logs/web-log-schema.md"],
  ]) {
    const root = tempRepo();
    const framingPath = writeJson(root, "framing.json", {
      workingDirectory: root,
      symptom: term,
      tenantCloud: "zs2",
      products: ["zpa"],
      scope: "many users",
    });

    const result = openCase({
      root,
      caseSlug: `2026-05-17-${term.split(" ")[0]}`,
      framingJson: framingPath,
      proposedLoads: [
        "agents/investigator/prompt.md",
        "agents/investigator/harness.md",
        referencePath,
      ],
    });

    assert.equal(result.status, "pass");
  }
});

test("openCase blocks missing proposed loads", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });

  const result = openCase({
    root,
    caseSlug: "2026-05-17-missing-load",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "agents/investigator/grounding/does-not-exist.md",
    ],
  });

  assert.equal(result.status, "blocked");
  assert.match(result.blockingIssues.join(" "), /proposed load does not exist/);
});

test("openCase refuses to clobber existing case artifacts without force", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const args = {
    root,
    caseSlug: "2026-05-17-no-clobber",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
    ],
  };

  openCase(args);

  assert.throws(
    () => openCase(args),
    /case artifacts already exist/,
  );

  const forced = openCase({ ...args, force: true });
  assert.equal(forced.status, "pass");
});

test("verifyCaseFiles fails for blocked case intake", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZIA block page appears for payroll site",
    tenantCloud: "zs1",
    products: ["zia"],
    scope: "one user",
  });

  openCase({
    root,
    caseSlug: "2026-05-17-blocked",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zia/logs/web-log-schema.md",
    ],
  });

  assert.throws(
    () => verifyCaseFiles(root, "2026-05-17-blocked"),
    /case-intake\.md status is not pass/,
  );
});

test("verifyCaseFiles fails for missing and mutated case intake artifacts", () => {
  const root = tempRepo();
  assert.throws(
    () => verifyCaseFiles(root, "2026-05-17-missing"),
    /no such file or directory/,
  );

  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "LSS logs show empty connector field",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
    evidencePaths: ["_data/cases/example/evidence/lss.csv"],
  });

  const result = openCase({
    root,
    caseSlug: "2026-05-17-mutated",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zpa/logs/access-log-schema.md",
    ],
  });

  fs.writeFileSync(result.journalPath, "# Discovery Journal\n\n## Framing\n", "utf8");

  assert.throws(
    () => verifyCaseFiles(root, "2026-05-17-mutated"),
    /journal\.md missing marker/,
  );
});

test("verifyCaseFiles recomputes status and rejects forged passing artifacts", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZIA block page appears for payroll site",
    tenantCloud: "zs1",
    products: ["zia"],
    scope: "one user",
  });

  const result = openCase({
    root,
    caseSlug: "2026-05-17-forged-pass",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zia/logs/web-log-schema.md",
    ],
  });

  const caseIntakeJson = JSON.parse(fs.readFileSync(result.caseIntakeJsonPath, "utf8"));
  caseIntakeJson.status = "pass";
  caseIntakeJson.blockingIssues = [];
  fs.writeFileSync(result.caseIntakeJsonPath, `${JSON.stringify(caseIntakeJson, null, 2)}\n`, "utf8");

  const forgedMarkdown = fs.readFileSync(result.caseIntakePath, "utf8")
    .replace(/^Status: blocked$/m, "Status: pass")
    .replace(/^Blocking Issues: .+$/m, "Blocking Issues: none");
  fs.writeFileSync(result.caseIntakePath, forgedMarkdown, "utf8");

  assert.throws(
    () => verifyCaseFiles(root, "2026-05-17-forged-pass"),
    /case-intake\.json recomputes to blocked/,
  );
});

test("initializeTurnLedger creates genesis ledger and current turn state", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();

  const result = initializeTurnLedger({ root, caseSlug });

  assert.equal(result.status, "pass");
  assert.ok(fs.existsSync(result.turnLogPath));
  assert.ok(fs.existsSync(result.turnStatePath));

  const events = fs.readFileSync(result.turnLogPath, "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(events.length, 1);
  assert.equal(events[0].sequence, 0);
  assert.equal(events[0].type, "genesis");

  const state = readJson(result.turnStatePath);
  assert.equal(state.currentSequence, 0);
  assert.equal(state.pendingTurn, null);
  assert.ok(state.nextTurnToken);
  assert.deepEqual(state.allowedNext, [
    "continue-top-open",
    "investigate-different-claim",
    "request-user-evidence",
    "record-user-evidence",
    "add-evidence",
    "mark-resolved",
    "pause",
  ]);
});

test("initializeTurnLedger requires a real claim table", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const result = openCase({
    root,
    caseSlug: "2026-05-17-no-claim-table",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
    ],
  });

  assert.throws(
    () => initializeTurnLedger({ root, caseSlug: result.caseSlug }),
    /Step 1 stub.*Do not hand-edit/,
  );
});

test("initializeTurnLedger rejects non-canonical claim statuses", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  const journal = fs.readFileSync(journalPath, "utf8")
    .replace("Open (uncertain)", "Open (supported)");
  fs.writeFileSync(journalPath, journal, "utf8");

  assert.throws(
    () => initializeTurnLedger({ root, caseSlug }),
    /claim status is not allowed: Open \(supported\)/,
  );
});

test("beginTurn validates allowed actions and blocks duplicate pending turns", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  const initialized = initializeTurnLedger({ root, caseSlug });

  assert.throws(
    () => beginTurn({ root, caseSlug, userAction: "invent-new-state" }),
    /user action is not allowed/,
  );

  const begun = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  assert.equal(begun.status, "pass");
  assert.ok(begun.pendingTurn.turnToken);
  assert.equal(begun.pendingTurn.turnToken, initialized.state.nextTurnToken);

  assert.throws(
    () => beginTurn({ root, caseSlug, userAction: "continue-top-open" }),
    /pendingTurn already exists/,
  );

  const state = readJson(initialized.turnStatePath);
  state.pendingTurn = null;
  state.nextTurnToken = null;
  fs.writeFileSync(initialized.turnStatePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  assert.throws(
    () => beginTurn({ root, caseSlug, userAction: "continue-top-open" }),
    /missing nextTurnToken/,
  );
});

test("importEvidence copies one evidence file, appends manifest, and leaves turn state unchanged", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  const initialized = initializeTurnLedger({ root, caseSlug });
  const pending = beginTurn({ root, caseSlug, userAction: "record-user-evidence" }).pendingTurn;
  const journalPath = path.join(root, "_data/cases", caseSlug, "journal.md");
  const turnStatePath = path.join(root, "_data/cases", caseSlug, "workflow", "02-turn-state.json");
  const journalBefore = fs.readFileSync(journalPath, "utf8");
  const turnLogBefore = fs.readFileSync(initialized.turnLogPath, "utf8");
  const turnStateBefore = fs.readFileSync(turnStatePath, "utf8");
  const sourceFile = path.join(root, "splunk-export.json");
  fs.writeFileSync(sourceFile, "{\"rows\":1}\n", "utf8");
  const queryFile = path.join(root, "query.spl");
  fs.writeFileSync(queryFile, "index=zscaler_proxy\n", "utf8");

  const result = importEvidence({
    root,
    caseSlug,
    sourceFile,
    name: "Managed Proxy Path",
    source: "Splunk",
    queryFile,
    summary: "Managed proxy path shows allowed CONNECT/SSL.",
    capturedAt: "2026-05-20T14:10:00Z",
    touchedClaims: ["H1: Application segment may not include the app"],
  });

  assert.equal(result.status, "ok");
  assert.deepEqual(result.pendingTurn, {
    sequence: pending.sequence,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
  });
  assert.deepEqual(result.evidenceRefs, [
    "_data/cases/2026-05-17-turn-ledger/evidence/splunk-managed-proxy-path-20260520T141000Z.json",
  ]);
  const copied = path.join(root, result.evidenceRefs[0]);
  assert.equal(fs.readFileSync(copied, "utf8"), "{\"rows\":1}\n");
  const manifest = readManifest(root, caseSlug);
  assert.match(manifest, /Evidence Ref \| Source \| Captured At \| Source File Hash/);
  assert.match(manifest, /splunk-managed-proxy-path-20260520T141000Z\.json/);
  assert.match(manifest, /Managed proxy path shows allowed CONNECT\/SSL\./);
  assert.match(manifest, /H1: Application segment may not include the app/);
  const state = readJson(turnStatePath);
  assert.deepEqual(state.pendingTurn, pending);
  assert.equal(fs.readFileSync(journalPath, "utf8"), journalBefore);
  assert.equal(fs.readFileSync(initialized.turnLogPath, "utf8"), turnLogBefore);
  assert.equal(fs.readFileSync(turnStatePath, "utf8"), turnStateBefore);
});

test("importEvidence supports a small multi-item evidence wave from input JSON", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  const journal = fs.readFileSync(journalPath, "utf8").replace(
    "| H1: Application segment may not include the app | references/zpa/app-segments.md | Open (uncertain) | Check application segment snapshot | 2026-05-17T00:00:00.000Z | reference-grounded |",
    `| H2: Managed proxy path is healthy | references/zia/logs/web-log-schema.md | Open (uncertain) | Check proxy logs | 2026-05-17T00:00:00.000Z | telemetry |
| H3: Unmanaged direct egress path is failing | references/zia/logs/web-log-schema.md | Open (uncertain) | Check direct egress | 2026-05-17T00:00:00.000Z | telemetry |`,
  );
  fs.writeFileSync(journalPath, journal, "utf8");
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "record-user-evidence" });
  fs.writeFileSync(path.join(root, "proxy-path.json"), "{\"path\":\"proxy\"}\n", "utf8");
  fs.writeFileSync(path.join(root, "direct-egress.json"), "{\"path\":\"direct\"}\n", "utf8");
  fs.writeFileSync(path.join(root, "proxy.spl"), "proxy query\n", "utf8");
  fs.writeFileSync(path.join(root, "direct.spl"), "direct query\n", "utf8");
  const inputJson = writeJson(root, "evidence-input.json", {
    activeHypothesis: "H2/H3",
    items: [
      {
        sourceFile: "proxy-path.json",
        name: "managed-proxy-path",
        source: "Splunk",
        queryFile: "proxy.spl",
        summary: "Managed proxy path is healthy.",
        capturedAt: "2026-05-20T14:10:00Z",
        touchedClaims: ["H2: Managed proxy path is healthy"],
      },
      {
        sourceFile: "direct-egress.json",
        name: "unmanaged-direct-egress-deny",
        source: "Splunk",
        queryFile: "direct.spl",
        summary: "Unmanaged direct egress to the same SaaS is denied.",
        capturedAt: "2026-05-20T14:12:00Z",
        touchedClaims: ["H3: Unmanaged direct egress path is failing"],
      },
    ],
  });

  const result = importEvidence({ root, caseSlug, inputJson });

  assert.equal(result.status, "ok");
  assert.equal(result.evidenceRefs.length, 2);
  assert.ok(fs.existsSync(path.join(root, result.evidenceRefs[0])));
  assert.ok(fs.existsSync(path.join(root, result.evidenceRefs[1])));
  const manifestRows = readManifest(root, caseSlug).split(/\r?\n/).filter((line) => line.startsWith("| _data/cases/"));
  assert.equal(manifestRows.length, 2);
  assert.match(manifestRows[0], /H2: Managed proxy path is healthy/);
  assert.match(manifestRows[1], /H3: Unmanaged direct egress path is failing/);
});

test("importEvidence handles special-character metadata without breaking manifest rows", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "record-user-evidence" });
  const sourceFile = path.join(root, "result with spaces.json");
  fs.writeFileSync(sourceFile, "{\"rows\":1}\n", "utf8");

  const result = importEvidence({
    root,
    caseSlug,
    sourceFile,
    name: "Managed Proxy/Path: Salesforce?",
    source: "Splunk | ZIA",
    query: "index=zscaler_proxy | stats count",
    summary: "Allowed CONNECT/SSL | response bytes present.\nSecond line is folded.",
    capturedAt: "2026-05-20T14:10:00Z",
    touchedClaims: ["H1: Application segment may not include the app"],
  });

  assert.deepEqual(result.evidenceRefs, [
    "_data/cases/2026-05-17-turn-ledger/evidence/splunk-zia-managed-proxy-path-salesforce-20260520T141000Z.json",
  ]);
  const manifest = readManifest(root, caseSlug);
  assert.match(manifest, /Splunk \\| ZIA/);
  assert.match(manifest, /index=zscaler_proxy \\| stats count/);
  assert.match(manifest, /Allowed CONNECT\/SSL \\| response bytes present\. Second line is folded\./);
});

test("importEvidence rejects missing metadata, non-UTC timestamps, unknown claims, and collisions", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "record-user-evidence" });
  const sourceFile = path.join(root, "result.json");
  fs.writeFileSync(sourceFile, "{}\n", "utf8");

  assert.throws(
    () => importEvidence({
      root,
      caseSlug,
      sourceFile,
      name: "result",
      source: "Splunk",
      summary: "Missing query.",
      capturedAt: "2026-05-20T14:10:00Z",
      touchedClaims: ["H1: Application segment may not include the app"],
    }),
    /must include queryFile, query, requestText, or queryRef/,
  );

  assert.throws(
    () => importEvidence({
      root,
      caseSlug,
      sourceFile,
      name: "result",
      source: "Splunk",
      query: "index=zscaler",
      summary: "Bad timestamp.",
      capturedAt: "2026-05-20T14:10:00-04:00",
      touchedClaims: ["H1: Application segment may not include the app"],
    }),
    /capturedAt must be an ISO 8601 UTC timestamp ending in Z/,
  );

  assert.throws(
    () => importEvidence({
      root,
      caseSlug,
      sourceFile,
      name: "result",
      source: "Splunk",
      query: "index=zscaler",
      summary: "Unknown claim.",
      capturedAt: "2026-05-20T14:10:00Z",
      touchedClaims: ["H9: Not in journal"],
    }),
    /touched claim is not present in journal\.md/,
  );

  assert.throws(
    () => importEvidence({
      root,
      caseSlug,
      sourceFile,
      name: "x".repeat(81),
      source: "Splunk",
      query: "index=zscaler",
      summary: "Long name.",
      capturedAt: "2026-05-20T14:10:00Z",
      touchedClaims: ["H1: Application segment may not include the app"],
    }),
    /name slug is too long/,
  );

  importEvidence({
    root,
    caseSlug,
    sourceFile,
    name: "result",
    source: "Splunk",
    query: "index=zscaler",
    summary: "First import.",
    capturedAt: "2026-05-20T14:10:00Z",
    touchedClaims: ["H1: Application segment may not include the app"],
  });
  assert.throws(
    () => importEvidence({
      root,
      caseSlug,
      sourceFile,
      name: "result",
      source: "Splunk",
      query: "index=zscaler",
      summary: "Duplicate import.",
      capturedAt: "2026-05-20T14:10:00Z",
      touchedClaims: ["H1: Application segment may not include the app"],
    }),
    /evidence destination already exists/,
  );
});

test("importEvidence rejects unresolved SIEM placeholders unless explicitly allowed", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "record-user-evidence" });
  const sourceFile = path.join(root, "result.json");
  fs.writeFileSync(sourceFile, "{}\n", "utf8");
  const queryFile = path.join(root, "placeholder.spl");
  fs.writeFileSync(queryFile, "index=$INDEX_ZPA sourcetype=<your_sourcetype>\n", "utf8");

  assert.throws(
    () => importEvidence({
      root,
      caseSlug,
      sourceFile,
      name: "placeholder",
      source: "Splunk",
      queryFile,
      summary: "Placeholder query should not become evidence.",
      capturedAt: "2026-05-20T14:10:00Z",
      touchedClaims: ["H1: Application segment may not include the app"],
    }),
    /unresolved SIEM placeholder/,
  );

  const result = importEvidence({
    root,
    caseSlug,
    sourceFile,
    name: "invalidated-placeholder",
    source: "Splunk",
    query: "index=$INDEX_ZPA sourcetype=<your_sourcetype>",
    allowPlaceholderQuery: true,
    summary: "Invalidated placeholder query recorded as corrective evidence.",
    capturedAt: "2026-05-20T14:11:00Z",
    touchedClaims: ["H1: Application segment may not include the app"],
  });
  assert.equal(result.status, "ok");
});

test("importEvidence hashes binary evidence bytes", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "record-user-evidence" });
  const sourceFile = path.join(root, "screenshot.bin");
  const bytes = Buffer.from([0x00, 0xff, 0x80, 0x41, 0x0a]);
  fs.writeFileSync(sourceFile, bytes);

  const result = importEvidence({
    root,
    caseSlug,
    sourceFile,
    name: "binary-fixture",
    source: "Screenshot",
    requestText: "User-provided screenshot bytes.",
    summary: "Binary screenshot fixture.",
    capturedAt: "2026-05-20T14:10:00Z",
    touchedClaims: ["H1: Application segment may not include the app"],
  });

  assert.equal(result.items[0].sourceFileHash, `sha256:${createHash("sha256").update(bytes).digest("hex")}`);
});

test("importEvidence rejects external absolute query files to avoid manifest path leaks", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "record-user-evidence" });
  const sourceFile = path.join(root, "result.json");
  fs.writeFileSync(sourceFile, "{}\n", "utf8");
  const externalQueryFile = path.join(os.tmpdir(), `external-query-${Date.now()}.spl`);
  fs.writeFileSync(externalQueryFile, "index=zscaler\n", "utf8");

  assert.throws(
    () => importEvidence({
      root,
      caseSlug,
      sourceFile,
      name: "result",
      source: "Splunk",
      queryFile: externalQueryFile,
      summary: "External query file.",
      capturedAt: "2026-05-20T14:10:00Z",
      touchedClaims: ["H1: Application segment may not include the app"],
    }),
    /queryFile must be inside the repository/,
  );
});

test("importEvidence requires initialized turn ledger", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  const sourceFile = path.join(root, "result.json");
  fs.writeFileSync(sourceFile, "{}\n", "utf8");

  assert.throws(
    () => importEvidence({
      root,
      caseSlug,
      sourceFile,
      name: "result",
      source: "Splunk",
      query: "index=zscaler",
      summary: "Ledger is missing.",
      capturedAt: "2026-05-20T14:10:00Z",
      touchedClaims: ["H1: Application segment may not include the app"],
    }),
    /missing 02-turn-state\.json/,
  );
});

test("importEvidence requires an open pending turn", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const sourceFile = path.join(root, "result.json");
  fs.writeFileSync(sourceFile, "{}\n", "utf8");

  assert.throws(
    () => importEvidence({
      root,
      caseSlug,
      sourceFile,
      name: "result",
      source: "Splunk",
      query: "index=zscaler",
      summary: "Pending turn is missing.",
      capturedAt: "2026-05-20T14:10:00Z",
      touchedClaims: ["H1: Application segment may not include the app"],
    }),
    /requires an open pendingTurn/,
  );
});

test("importEvidence rejects empty input JSON and malformed manifests", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "record-user-evidence" });
  const emptyInputJson = writeJson(root, "empty-evidence-input.json", { items: [] });

  assert.throws(
    () => importEvidence({ root, caseSlug, inputJson: emptyInputJson }),
    /input JSON must include a non-empty items array/,
  );

  const evidenceDir = path.join(root, "_data/cases", caseSlug, "evidence");
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(path.join(evidenceDir, "MANIFEST.md"), "| Old | Schema |\n|---|---|\n", "utf8");
  const sourceFile = path.join(root, "result.json");
  fs.writeFileSync(sourceFile, "{}\n", "utf8");

  assert.throws(
    () => importEvidence({
      root,
      caseSlug,
      sourceFile,
      name: "result",
      source: "Splunk",
      query: "index=zscaler",
      summary: "Malformed manifest.",
      capturedAt: "2026-05-20T14:10:00Z",
      touchedClaims: ["H1: Application segment may not include the app"],
    }),
    /MANIFEST\.md does not use the expected evidence manifest schema/,
  );
});

test("importEvidence removes copied files if manifest append fails", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "record-user-evidence" });
  const evidenceDir = path.join(root, "_data/cases", caseSlug, "evidence");
  fs.mkdirSync(path.join(evidenceDir, "MANIFEST.md"), { recursive: true });
  const sourceFile = path.join(root, "result.json");
  fs.writeFileSync(sourceFile, "{}\n", "utf8");

  assert.throws(
    () => importEvidence({
      root,
      caseSlug,
      sourceFile,
      name: "result",
      source: "Splunk",
      query: "index=zscaler",
      summary: "Manifest append should fail.",
      capturedAt: "2026-05-20T14:10:00Z",
      touchedClaims: ["H1: Application segment may not include the app"],
    }),
    /EISDIR|illegal operation on a directory/,
  );
  assert.equal(
    fs.existsSync(path.join(evidenceDir, "splunk-result-20260520T141000Z.json")),
    false,
  );
});

test("importEvidence removes copied files if a later copy fails", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "record-user-evidence" });
  const firstSource = path.join(root, "first.json");
  const secondSource = path.join(root, "second.json");
  fs.writeFileSync(firstSource, "{\"rows\":1}\n", "utf8");
  fs.writeFileSync(secondSource, "{\"rows\":2}\n", "utf8");
  const inputJson = writeJson(root, "copy-failure-input.json", {
    items: [
      {
        sourceFile: firstSource,
        name: "first",
        source: "Splunk",
        query: "index=zscaler first",
        summary: "First file should be rolled back.",
        capturedAt: "2026-05-20T14:10:00Z",
        touchedClaims: ["H1: Application segment may not include the app"],
      },
      {
        sourceFile: secondSource,
        name: "second",
        source: "Splunk",
        query: "index=zscaler second",
        summary: "Second file copy fails.",
        capturedAt: "2026-05-20T14:11:00Z",
        touchedClaims: ["H1: Application segment may not include the app"],
      },
    ],
  });
  const originalCopyFileSync = fs.copyFileSync;
  let copyCount = 0;
  fs.copyFileSync = (...args) => {
    copyCount += 1;
    if (copyCount === 2) throw new Error("forced second copy failure");
    return originalCopyFileSync(...args);
  };

  try {
    assert.throws(
      () => importEvidence({ root, caseSlug, inputJson }),
      /forced second copy failure/,
    );
  } finally {
    fs.copyFileSync = originalCopyFileSync;
  }

  const evidenceDir = path.join(root, "_data/cases", caseSlug, "evidence");
  assert.equal(fs.existsSync(path.join(evidenceDir, "splunk-first-20260520T141000Z.json")), false);
  assert.equal(fs.existsSync(path.join(evidenceDir, "splunk-second-20260520T141100Z.json")), false);
});

test("abandonTurn clears an unchanged pending turn and restores the token", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  const pending = begun.pendingTurn;

  const abandoned = abandonTurn({
    root,
    caseSlug,
    reason: "blocked before journal mutation",
  });

  assert.equal(abandoned.status, "pass");
  assert.equal(abandoned.state.pendingTurn, null);
  assert.equal(abandoned.state.nextTurnToken, pending.turnToken);
  assert.equal(abandoned.abandonedTurn.sequence, pending.sequence);

  const retry = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  assert.equal(retry.pendingTurn.turnToken, pending.turnToken);
});

test("abandonTurn refuses to clear a pending turn after journal mutation", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  fs.appendFileSync(journalPath, "\nTurn update: partial mutation before block.\n", "utf8");

  assert.throws(
    () => abandonTurn({ root, caseSlug, reason: "blocked after partial mutation" }),
    /cannot abandon pendingTurn after journal\.md changed/,
  );
});

test("completeTurn rejects non-canonical claim status updates", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  const pending = begun.pendingTurn;

  const journal = fs.readFileSync(journalPath, "utf8")
    .replace("Open (uncertain)", "Less likely (unsupported)");
  fs.writeFileSync(journalPath, `${journal}\nTurn update: checked one evidence source.\n`, "utf8");
  const turnPath = writeJson(root, "turn-bad-status.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "load-file",
    actionSummary: "Checked one evidence source.",
    touchedClaims: ["H1"],
    evidenceRefs: ["E1"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: turnPath }),
    /claim status is not allowed: Less likely \(unsupported\)/,
  );
});

test("completeTurn rejects non-canonical action types", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "record-user-evidence" });
  const pending = begun.pendingTurn;

  fs.appendFileSync(journalPath, "\nTurn update: recorded one evidence result.\n", "utf8");
  const turnPath = writeJson(root, "turn-bad-action-type.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "record-evidence",
    actionSummary: "Recorded one evidence result.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["E1"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: turnPath }),
    /actionType is not allowed: record-evidence/,
  );
});

test("completeTurn rejects stale tokens, forged previous hashes, and unchanged journals", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  const pending = begun.pendingTurn;

  const baseTurn = {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "load-file",
    actionSummary: "Checked one evidence source.",
    touchedClaims: ["H1"],
    evidenceRefs: ["E1"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["pause"],
  };

  const wrongTokenPath = writeJson(root, "wrong-token.json", {
    ...baseTurn,
    turnToken: "not-the-helper-token",
  });
  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: wrongTokenPath }),
    /turnToken does not match pendingTurn/,
  );

  const wrongPreviousPath = writeJson(root, "wrong-previous.json", {
    ...baseTurn,
    previousHash: "sha256:wrong",
  });
  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: wrongPreviousPath }),
    /previousHash does not match pendingTurn/,
  );

  const unchangedPath = writeJson(root, "unchanged.json", baseTurn);
  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: unchangedPath }),
    /journal\.md hash did not change/,
  );
});

test("completeTurn appends one event, clears pending state, and enforces state/log agreement", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  const initialized = initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  const pending = begun.pendingTurn;

  fs.appendFileSync(journalPath, "\nTurn update: checked one evidence source.\n", "utf8");
  const turnPath = writeJson(root, "turn.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "load-file",
    actionSummary: "Checked one evidence source.",
    touchedClaims: ["H1"],
    evidenceRefs: ["E1"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["pause"],
  });

  const completed = completeTurn({ root, caseSlug, turnJson: turnPath });

  assert.equal(completed.status, "pass");
  assert.equal(completed.event.sequence, 1);
  assert.equal(completed.state.pendingTurn, null);
  assert.ok(completed.state.nextTurnToken);

  const events = fs.readFileSync(completed.turnLogPath, "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(events.length, 2);
  assert.equal(events[1].sequence, 1);

  const state = readJson(completed.turnStatePath);
  assert.equal(state.currentSequence, 1);
  assert.equal(state.latestTurnHash, completed.state.latestTurnHash);

  state.latestTurnHash = initialized.state.latestTurnHash;
  fs.writeFileSync(completed.turnStatePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  assert.throws(
    () => beginTurn({ root, caseSlug, userAction: "pause" }),
    /does not agree with last 02-turns\.jsonl event/,
  );
});

test("completeTurn accepts helper-assisted turn input JSON", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "record-user-evidence" });

  fs.appendFileSync(journalPath, "\nTurn update: recorded one evidence result.\n", "utf8");
  const inputPath = writeJson(root, "turn-input.json", {
    actionType: "record-user-evidence",
    actionSummary: "Recorded one evidence result.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["_data/cases/2026-05-17-turn-ledger/evidence/result.json"],
    allowedNext: ["pause"],
  });

  const completed = completeTurn({ root, caseSlug, turnInputJson: inputPath });

  assert.equal(completed.status, "pass");
  assert.equal(completed.event.sequence, 1);
  assert.equal(completed.event.userAction, "record-user-evidence");
  assert.equal(completed.event.actionType, "record-user-evidence");
  assert.ok(completed.event.journalHashAfter);
});

test("completeTurn rejects caller-supplied helper-owned fields in turn input JSON", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  fs.appendFileSync(journalPath, "\nTurn update: checked one evidence source.\n", "utf8");
  const inputPath = writeJson(root, "turn-forged-helper-owned.json", {
    sequence: 99,
    journalHashAfter: "sha256:forged",
    actionType: "load-file",
    actionSummary: "Checked one evidence source.",
    touchedClaims: ["H1"],
    allowedNext: ["pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnInputJson: inputPath }),
    /must not include helper-owned fields: sequence, journalHashAfter/,
  );
});

test("completeTurn with turn input rejects unchanged journal for investigative action", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  const inputPath = writeJson(root, "turn-unchanged-journal.json", {
    actionType: "load-file",
    actionSummary: "Checked one evidence source.",
    touchedClaims: ["H1"],
    allowedNext: ["pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnInputJson: inputPath }),
    /journal\.md hash did not change/,
  );
});

test("completeTurn requires exactly one turn completion input", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  fs.appendFileSync(journalPath, "\nTurn update: checked one evidence source.\n", "utf8");
  const inputPath = writeJson(root, "turn-input-overwrite.json", {
    actionType: "load-file",
    actionSummary: "Checked one evidence source.",
    touchedClaims: ["H1: Application segment may not include the app"],
    allowedNext: ["pause"],
  });

  const pending = readJson(path.join(root, "_data/cases", caseSlug, "workflow/02-turn-state.json")).pendingTurn;
  const fullTurnPath = writeJson(root, "turn-full.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "load-file",
    actionSummary: "Checked one evidence source.",
    touchedClaims: ["H1: Application segment may not include the app"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: fullTurnPath, turnInputJson: inputPath }),
    /provide only one of --turn-json or --turn-input-json/,
  );
});

test("completeTurn requires touched claims for investigative journal changes", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  const pending = begun.pendingTurn;

  fs.appendFileSync(journalPath, "\nTurn update: checked one evidence source.\n", "utf8");
  const turnPath = writeJson(root, "turn-no-claims.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "load-file",
    actionSummary: "Checked one evidence source.",
    evidenceRefs: ["E1"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: turnPath }),
    /touchedClaims is required/,
  );
});

test("completeTurn validates query-request patterns against the Splunk catalog", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  const catalogPath = path.join(root, "references", "shared", "splunk-queries.md");
  fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
  fs.writeFileSync(catalogPath, `# SPL patterns

### \`segment-match-observed\`

\`\`\`spl
index=$INDEX_ZPA Application=$APP
\`\`\`
`, "utf8");

  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  const pending = begun.pendingTurn;

  fs.appendFileSync(journalPath, "\nTurn update: prepared the next SIEM query request.\n", "utf8");
  const baseTurn = {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "query-request",
    actionSummary: "Prepared the next SIEM query request.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["references/shared/splunk-queries.md#segment-match-observed"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["pause"],
  };

  const unknownPath = writeJson(root, "turn-unknown-query.json", {
    ...baseTurn,
    queryPatterns: ["SIEM_ZPA_AUTHZ_DENY_BY_APP"],
  });
  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: unknownPath }),
    /query pattern is not in references\/shared\/splunk-queries\.md/,
  );

  const validPath = writeJson(root, "turn-valid-query.json", {
    ...baseTurn,
    queryPatterns: ["segment-match-observed"],
  });
  const completed = completeTurn({ root, caseSlug, turnJson: validPath });
  assert.deepEqual(completed.event.queryPatterns, ["segment-match-observed"]);
});

test("completeTurn allows non-Splunk request-user-evidence with an explicit request", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "request-user-evidence" });
  const pending = begun.pendingTurn;

  fs.appendFileSync(journalPath, "\nTurn update: asked user for the Azure rollback change record.\n", "utf8");
  const turnPath = writeJson(root, "turn-manual-evidence-request.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "request-user-evidence",
    actionSummary: "Asked user for the Azure rollback change record.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRequest: "Provide the Azure change record or deployment rollback ID for 2026-05-17 15:05 UTC.",
    evidenceRefs: ["user-request:azure-rollback-change-record"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["record-user-evidence", "pause"],
  });

  const completed = completeTurn({ root, caseSlug, turnJson: turnPath });
  assert.equal(completed.event.evidenceRequest, "Provide the Azure change record or deployment rollback ID for 2026-05-17 15:05 UTC.");
  assert.deepEqual(completed.event.queryPatterns, []);
});

test("completeTurn requires evidenceRequest for request-user-evidence", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "request-user-evidence" });
  const pending = begun.pendingTurn;

  fs.appendFileSync(journalPath, "\nTurn update: asked user for missing evidence.\n", "utf8");
  const turnPath = writeJson(root, "turn-missing-evidence-request.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "request-user-evidence",
    actionSummary: "Asked user for missing evidence.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["user-request:missing-evidence"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["record-user-evidence", "pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: turnPath }),
    /request-user-evidence turns must include evidenceRequest/,
  );
});

test("completeTurn keeps user evidence requests separate from returned evidence", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  const catalogPath = path.join(root, "references", "shared", "splunk-queries.md");
  fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
  fs.writeFileSync(catalogPath, `# SPL patterns

### \`segment-match-observed\`

\`\`\`spl
index=$INDEX_ZPA Application=$APP
\`\`\`
`, "utf8");

  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "request-user-evidence" });
  const pending = begun.pendingTurn;

  const closedJournal = fs.readFileSync(journalPath, "utf8")
    .replace("Open (uncertain)", "Confirmed (medium)");
  fs.writeFileSync(journalPath, `${closedJournal}\nTurn update: user returned query rows.\n`, "utf8");

  const smuggledResultPath = writeJson(root, "turn-smuggled-query-result.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "query-request",
    actionSummary: "Asked user to run the next SIEM query.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["references/shared/splunk-queries.md#segment-match-observed"],
    queryPatterns: ["segment-match-observed"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["record-user-evidence", "pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: smuggledResultPath }),
    /must not record returned evidence or close claims/,
  );
});

test("completeTurn blocks mark-resolved while any claim is still open", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "mark-resolved" });
  const pending = begun.pendingTurn;

  fs.writeFileSync(journalPath, `# Discovery Journal

ISSUE: ZPA users cannot reach wiki.internal
STATUS: Investigating

## Framing

| Field | Value |
|---|---|
| Symptom | ZPA users cannot reach wiki.internal |

## Proposed Loads

- agents/investigator/prompt.md
- agents/investigator/harness.md

## Claims

| Claim | Source | Status | Next evidence needed | Timestamp | Notes |
|---|---|---|---|---|---|
| H1: Application segment may not include the app | references/zpa/app-segments.md | Ruled out | - | 2026-05-17T00:00:00.000Z | segment match observed |
| H2: Connector/backend health issue | references/zpa/logs/app-connector-metrics.md | Ruled out | - | 2026-05-17T00:05:00.000Z | no connector errors observed |
| H3: Policy or posture issue | references/zpa/policy-precedence.md | Open (uncertain) | Check policy inspection failures | 2026-05-17T00:10:00.000Z | not directly tested |

## Resolution

Attempted resolution by elimination.
`, "utf8");

  const turnPath = writeJson(root, "turn-premature-resolved.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "mark-resolved",
    actionSummary: "Tried to resolve by eliminating H1 and H2.",
    touchedClaims: ["H3: Policy or posture issue"],
    evidenceRefs: ["references/zpa/policy-precedence.md"],
    journalHashBefore: pending.journalHashBefore,
    completionGate: {
      rootCauseClaim: "H3: Policy or posture issue",
      userConfirmedResolution: true,
      supportingEvidenceRefs: ["references/zpa/policy-precedence.md"],
    },
    allowedNext: ["pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: turnPath }),
    /requires no open claims/,
  );
});

test("completeTurn blocks mark-resolved without user-confirmed supporting evidence", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "mark-resolved" });
  const pending = begun.pendingTurn;

  const resolvedJournal = fs.readFileSync(journalPath, "utf8")
    .replace("Open (uncertain)", "Confirmed (high)")
    .replace("Open.", "Resolved.");
  fs.writeFileSync(journalPath, `${resolvedJournal}\nTurn update: marked the case resolved.\n`, "utf8");

  const turnPath = writeJson(root, "turn-resolved-no-confirmation.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "mark-resolved",
    actionSummary: "Marked the case resolved.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["references/zpa/app-segments.md"],
    journalHashBefore: pending.journalHashBefore,
    completionGate: {
      rootCauseClaim: "H1: Application segment may not include the app",
      supportingEvidenceRefs: ["references/zpa/app-segments.md"],
    },
    allowedNext: ["pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: turnPath }),
    /userConfirmedResolution: true/,
  );
});

test("completeTurn blocks mark-resolved when supporting evidence was not recorded earlier", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "mark-resolved" });
  const pending = begun.pendingTurn;

  const resolvedJournal = fs.readFileSync(journalPath, "utf8")
    .replace("Open (uncertain)", "Confirmed (high)")
    .replace("Open.", "Resolved.");
  fs.writeFileSync(journalPath, `${resolvedJournal}\nTurn update: user confirmed the rollback resolved the issue.\n`, "utf8");

  const turnPath = writeJson(root, "turn-resolved-valid.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "mark-resolved",
    actionSummary: "User confirmed the rollback resolved the issue.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["references/zpa/app-segments.md", "_data/cases/example/evidence/rollback-confirmation.md"],
    journalHashBefore: pending.journalHashBefore,
    completionGate: {
      rootCauseClaim: "H1: Application segment may not include the app",
      userConfirmedResolution: true,
      supportingEvidenceRefs: ["references/zpa/app-segments.md", "_data/cases/example/evidence/rollback-confirmation.md"],
    },
    allowedNext: ["pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: turnPath }),
    /supporting evidence must be recorded in a prior turn/,
  );
});

test("completeTurn allows mark-resolved when completion gate is satisfied", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const evidenceTurn = beginTurn({ root, caseSlug, userAction: "record-user-evidence" }).pendingTurn;

  const evidenceJournal = fs.readFileSync(journalPath, "utf8")
    .replace("Open (uncertain)", "Confirmed (high)");
  fs.writeFileSync(journalPath, `${evidenceJournal}\nTurn update: recorded direct rollback evidence.\n`, "utf8");

  const evidenceTurnPath = writeJson(root, "turn-record-evidence.json", {
    sequence: evidenceTurn.sequence,
    previousHash: evidenceTurn.priorLatestTurnHash,
    turnToken: evidenceTurn.turnToken,
    userAction: evidenceTurn.userAction,
    actionType: "record-user-evidence",
    actionSummary: "Recorded direct rollback evidence.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["_data/cases/example/evidence/rollback-confirmation.md"],
    journalHashBefore: evidenceTurn.journalHashBefore,
    allowedNext: ["mark-resolved", "pause"],
  });
  completeTurn({ root, caseSlug, turnJson: evidenceTurnPath });

  const resolveTurn = beginTurn({ root, caseSlug, userAction: "mark-resolved" }).pendingTurn;
  const resolvedJournal = fs.readFileSync(journalPath, "utf8")
    .replace("Open.", "Resolved.");
  fs.writeFileSync(journalPath, `${resolvedJournal}\nTurn update: user confirmed the rollback resolved the issue.\n`, "utf8");

  const turnPath = writeJson(root, "turn-resolved-valid.json", {
    sequence: resolveTurn.sequence,
    previousHash: resolveTurn.priorLatestTurnHash,
    turnToken: resolveTurn.turnToken,
    userAction: resolveTurn.userAction,
    actionType: "mark-resolved",
    actionSummary: "User confirmed the rollback resolved the issue.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["_data/cases/example/evidence/rollback-confirmation.md"],
    journalHashBefore: resolveTurn.journalHashBefore,
    completionGate: {
      rootCauseClaim: "H1: Application segment may not include the app",
      userConfirmedResolution: true,
      supportingEvidenceRefs: ["_data/cases/example/evidence/rollback-confirmation.md"],
    },
    allowedNext: ["pause"],
  });

  const completed = completeTurn({ root, caseSlug, turnJson: turnPath });
  assert.equal(completed.event.actionType, "mark-resolved");
  assert.deepEqual(completed.event.completionGate, {
    rootCauseClaim: "H1: Application segment may not include the app",
    userConfirmedResolution: true,
    supportingEvidenceRefs: ["_data/cases/example/evidence/rollback-confirmation.md"],
  });
});

// ── record-loads / verify-loads / loadsStatus tests ───────────────────────────

test("loadsStatus passes when all proposedLoads are loaded and mandatory docs present", () => {
  const root = tempRepo();
  const proposedLoads = ["agents/investigator/prompt.md", "agents/investigator/harness.md"];
  const loaded = ["agents/investigator/prompt.md", "agents/investigator/harness.md"];
  const result = loadsStatus(root, proposedLoads, loaded, [], false);
  assert.equal(result.status, "pass");
  assert.deepEqual(result.blockingIssues, []);
  assert.deepEqual(result.additionalLoads, []);
});

test("loadsStatus blocks when mandatory doc is missing from loaded", () => {
  const root = tempRepo();
  const proposedLoads = ["agents/investigator/prompt.md", "agents/investigator/harness.md"];
  const loaded = ["agents/investigator/prompt.md"]; // missing harness.md
  const result = loadsStatus(root, proposedLoads, loaded, [], false);
  assert.equal(result.status, "blocked");
  assert.ok(result.blockingIssues.some((i) => i.includes("agents/investigator/harness.md")));
});

test("loadsStatus blocks when mandatory doc is deferred", () => {
  const root = tempRepo();
  const proposedLoads = ["agents/investigator/prompt.md", "agents/investigator/harness.md"];
  const loaded = ["agents/investigator/prompt.md"];
  const deferred = [{ path: "agents/investigator/harness.md", reason: "skip for now" }];
  const result = loadsStatus(root, proposedLoads, loaded, deferred, false);
  assert.equal(result.status, "blocked");
  assert.ok(result.blockingIssues.some((i) => i.includes("mandatory") && i.includes("harness.md")));
});

test("loadsStatus blocks when proposed load is neither loaded nor deferred", () => {
  const root = tempRepo();
  const proposedLoads = [
    "agents/investigator/prompt.md",
    "agents/investigator/harness.md",
    "agents/investigator/grounding/zpa-segment-matching.md",
  ];
  const loaded = ["agents/investigator/prompt.md", "agents/investigator/harness.md"];
  // grounding file not deferred either
  const result = loadsStatus(root, proposedLoads, loaded, [], false);
  assert.equal(result.status, "blocked");
  assert.ok(result.blockingIssues.some((i) => i.includes("zpa-segment-matching")));
});

test("loadsStatus blocks when loaded path does not exist on disk", () => {
  const root = tempRepo();
  const proposedLoads = [
    "agents/investigator/prompt.md",
    "agents/investigator/harness.md",
    "agents/investigator/grounding/does-not-exist.md",
  ];
  const loaded = [
    "agents/investigator/prompt.md",
    "agents/investigator/harness.md",
    "agents/investigator/grounding/does-not-exist.md",
  ];
  const result = loadsStatus(root, proposedLoads, loaded, [], false);
  assert.equal(result.status, "blocked");
  assert.ok(result.blockingIssues.some((i) => i.includes("does not exist")));
});

test("loadsStatus blocks deferred entry missing reason", () => {
  const root = tempRepo();
  const proposedLoads = [
    "agents/investigator/prompt.md",
    "agents/investigator/harness.md",
    "agents/investigator/grounding/zpa-segment-matching.md",
  ];
  const loaded = ["agents/investigator/prompt.md", "agents/investigator/harness.md"];
  const deferred = [{ path: "agents/investigator/grounding/zpa-segment-matching.md", reason: "" }];
  const result = loadsStatus(root, proposedLoads, loaded, deferred, false);
  assert.equal(result.status, "blocked");
  assert.ok(result.blockingIssues.some((i) => i.includes("missing reason")));
});

test("loadsStatus blocks additional loads without allow-additional flag", () => {
  const root = tempRepo();
  const proposedLoads = ["agents/investigator/prompt.md", "agents/investigator/harness.md"];
  const loaded = [
    "agents/investigator/prompt.md",
    "agents/investigator/harness.md",
    "agents/investigator/grounding/zpa-segment-matching.md",
  ];
  const result = loadsStatus(root, proposedLoads, loaded, [], false);
  assert.equal(result.status, "blocked");
  assert.ok(result.blockingIssues.some((i) => i.includes("--allow-additional")));
});

test("loadsStatus passes with additional loads when allow-additional is true", () => {
  const root = tempRepo();
  const proposedLoads = ["agents/investigator/prompt.md", "agents/investigator/harness.md"];
  const loaded = [
    "agents/investigator/prompt.md",
    "agents/investigator/harness.md",
    "agents/investigator/grounding/zpa-segment-matching.md",
  ];
  const result = loadsStatus(root, proposedLoads, loaded, [], true);
  assert.equal(result.status, "pass");
  assert.deepEqual(result.additionalLoads, ["agents/investigator/grounding/zpa-segment-matching.md"]);
});

test("recordLoads happy path writes artifact and returns pass", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-loads-happy",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  const result = recordLoads({
    root,
    caseSlug: "2026-05-17-loads-happy",
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  assert.equal(result.status, "pass");
  assert.equal(result.operation, "record-loads");
  assert.deepEqual(result.blockingIssues, []);
  assert.ok(fs.existsSync(result.loadsPath));

  const artifact = JSON.parse(fs.readFileSync(result.loadsPath, "utf8"));
  assert.equal(artifact.status, "pass");
  assert.deepEqual(artifact.loaded, ["agents/investigator/prompt.md", "agents/investigator/harness.md"]);
  assert.deepEqual(artifact.blockingIssues, []);
  assert.ok(artifact.recordedAt);
});

test("recordLoads exit semantics: returns status blocked (exit 2) for blocking artifact", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-loads-blocked",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  const result = recordLoads({
    root,
    caseSlug: "2026-05-17-loads-blocked",
    loaded: ["agents/investigator/prompt.md"], // missing harness.md
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  assert.equal(result.status, "blocked");
  assert.ok(result.blockingIssues.length > 0);

  // Artifact must still be written even when blocked (like open-case).
  const artifact = JSON.parse(fs.readFileSync(result.loadsPath, "utf8"));
  assert.equal(artifact.status, "blocked");
});

test("recordLoads refuses to overwrite without --force", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const args = {
    root,
    caseSlug: "2026-05-17-loads-no-clobber",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  };
  openCase(args);

  const loadArgs = {
    root,
    caseSlug: args.caseSlug,
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  };
  recordLoads(loadArgs);

  assert.throws(
    () => recordLoads(loadArgs),
    /already exists/,
  );

  const forced = recordLoads({ ...loadArgs, force: true });
  assert.equal(forced.status, "pass");
});

test("recordLoads records additional loads and additionalApproved flag", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-loads-additional",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  const result = recordLoads({
    root,
    caseSlug: "2026-05-17-loads-additional",
    loaded: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "agents/investigator/grounding/zpa-segment-matching.md",
    ],
    deferred: [],
    allowAdditional: true,
    force: false,
  });

  assert.equal(result.status, "pass");
  assert.deepEqual(result.additionalLoads, ["agents/investigator/grounding/zpa-segment-matching.md"]);

  const artifact = JSON.parse(fs.readFileSync(result.loadsPath, "utf8"));
  assert.equal(artifact.additionalApproved, true);
  assert.deepEqual(artifact.additionalLoads, ["agents/investigator/grounding/zpa-segment-matching.md"]);
});

test("verifyLoads passes for a valid artifact", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-verify-loads-pass",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  recordLoads({
    root,
    caseSlug: "2026-05-17-verify-loads-pass",
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  const result = verifyLoads(root, "2026-05-17-verify-loads-pass");
  assert.equal(result.status, "pass");
  assert.equal(result.operation, "verify-loads");
});

test("verifyLoads recomputes and catches tampering: stored pass but loaded file deleted", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-verify-tamper",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  recordLoads({
    root,
    caseSlug: "2026-05-17-verify-tamper",
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  // Delete a loaded file from disk — recompute should catch it.
  fs.rmSync(path.join(root, "agents/investigator/harness.md"));

  assert.throws(
    () => verifyLoads(root, "2026-05-17-verify-tamper"),
    /stored status is "pass" but recomputes to "blocked"/,
  );
});

test("verifyLoads recomputes and catches tampering: loaded entry removed from artifact while proposedLoads still requires it", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-verify-tamper-remove",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  recordLoads({
    root,
    caseSlug: "2026-05-17-verify-tamper-remove",
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  // Tamper: remove harness.md from the stored loaded list but keep status "pass".
  const loadsPath = path.join(root, "_data/cases/2026-05-17-verify-tamper-remove/workflow/01-loads.json");
  const artifact = JSON.parse(fs.readFileSync(loadsPath, "utf8"));
  artifact.loaded = ["agents/investigator/prompt.md"];
  fs.writeFileSync(loadsPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");

  assert.throws(
    () => verifyLoads(root, "2026-05-17-verify-tamper-remove"),
    /stored status is "pass" but recomputes to "blocked"/,
  );
});

test("verifyLoads throws when 01-loads.json is missing", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-no-loads",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  assert.throws(
    () => verifyLoads(root, "2026-05-17-no-loads"),
    /01-loads\.json not found/,
  );
});

test("initializeTurnLedger throws without loads artifact", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const result = openCase({
    root,
    caseSlug: "2026-05-17-no-loads-gate",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  writeDiscoveryJournal(result.journalPath);

  assert.throws(
    () => initializeTurnLedger({ root, caseSlug: result.caseSlug }),
    /Step 2 loads not recorded/,
  );
});

test("initializeTurnLedger throws on tampered (blocked) loads artifact", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const result = openCase({
    root,
    caseSlug: "2026-05-17-tampered-loads-gate",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  writeDiscoveryJournal(result.journalPath);

  // Record a blocked loads artifact (missing harness.md).
  recordLoads({
    root,
    caseSlug: result.caseSlug,
    loaded: ["agents/investigator/prompt.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  assert.throws(
    () => initializeTurnLedger({ root, caseSlug: result.caseSlug }),
    /recomputes to blocked/,
  );
});

test("initializeTurnLedger passes after valid record-loads", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const result = openCase({
    root,
    caseSlug: "2026-05-17-loads-then-ledger",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  writeDiscoveryJournal(result.journalPath);
  recordLoads({
    root,
    caseSlug: result.caseSlug,
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  const ledger = initializeTurnLedger({ root, caseSlug: result.caseSlug });
  assert.equal(ledger.status, "pass");
  assert.ok(fs.existsSync(ledger.turnLogPath));
});

// ── status (doctor) tests ─────────────────────────────────────────────────────

test("status reports no-case phase before any case files", () => {
  const root = tempRepo();
  const result = caseStatus({ root, caseSlug: "2026-05-17-never-opened" });
  assert.equal(result.operation, "status");
  assert.equal(result.phase, "no-case");
  assert.equal(result.intake.present, false);
  assert.ok(result.nextCommands.some((c) => c.includes("open-case")));
});

test("status reports intake phase after blocked open-case", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZIA block page appears for payroll site",
    tenantCloud: "zs1",
    products: ["zia"],
    scope: "one user",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-status-blocked-intake",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zia/logs/web-log-schema.md",
    ],
  });

  const result = caseStatus({ root, caseSlug: "2026-05-17-status-blocked-intake" });
  assert.equal(result.phase, "intake");
  assert.equal(result.intake.present, true);
  assert.equal(result.intake.pass, false);
  assert.ok(result.nextCommands.some((c) => c.includes("open-case")));
  // Caveat about --force in blockingIssues.
  assert.ok(result.blockingIssues.some((i) => i.includes("--force")));
});

test("status reports loads phase after passing intake but no loads artifact", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-status-loads-phase",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  const result = caseStatus({ root, caseSlug: "2026-05-17-status-loads-phase" });
  assert.equal(result.phase, "loads");
  assert.equal(result.loads.present, false);
  assert.ok(result.nextCommands.some((c) => c.includes("record-loads")));
});

test("status reports ledger-pending phase after loads pass but no ledger", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const opened = openCase({
    root,
    caseSlug: "2026-05-17-status-ledger-phase",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  // Write the real discovery journal (with claim table) so the phase is ledger-pending
  // rather than journal-pending.
  writeDiscoveryJournal(opened.journalPath);
  recordLoads({
    root,
    caseSlug: "2026-05-17-status-ledger-phase",
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  const result = caseStatus({ root, caseSlug: "2026-05-17-status-ledger-phase" });
  assert.equal(result.phase, "ledger-pending");
  assert.equal(result.loads.pass, true);
  assert.equal(result.ledger.present, false);
  assert.ok(result.nextCommands.some((c) => c.includes("initialize-turn-ledger")));
});

test("status reports turn-ready phase after ledger initialized", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();

  initializeTurnLedger({ root, caseSlug });

  const result = caseStatus({ root, caseSlug });
  assert.equal(result.phase, "turn-ready");
  assert.equal(result.ledger.present, true);
  assert.equal(result.ledger.consistent, true);
  assert.equal(result.ledger.pendingTurn, null);
  assert.ok(result.nextCommands.some((c) => c.includes("begin-turn")));
});

test("status reports turn-open phase with dangling pendingTurn (journal unchanged)", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "continue-top-open" });

  const result = caseStatus({ root, caseSlug });
  assert.equal(result.phase, "turn-open");
  assert.ok(result.ledger.pendingTurn);
  assert.equal(result.ledger.pendingTurn.journalChangedSinceBegin, false);
  // Both complete and abandon should appear.
  assert.ok(result.nextCommands.some((c) => c.includes("complete-turn")));
  assert.ok(result.nextCommands.some((c) => c.includes("abandon-turn")));
});

test("status reports turn-open phase with dangling pendingTurn (journal changed)", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  fs.appendFileSync(journalPath, "\nTurn update: partial mutation.\n", "utf8");

  const result = caseStatus({ root, caseSlug });
  assert.equal(result.phase, "turn-open");
  assert.equal(result.ledger.pendingTurn.journalChangedSinceBegin, true);
  // Only complete-turn, not abandon-turn.
  assert.ok(result.nextCommands.some((c) => c.includes("complete-turn")));
  assert.ok(!result.nextCommands.some((c) => c.includes("abandon-turn")));
  // Repair issue must be surfaced.
  assert.ok(result.blockingIssues.some((i) => i.includes("Pending turn requires repair")));
});

test("status reports consistent: false without throwing for corrupted turn-state", () => {
  const { root, caseSlug } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const turnStatePath = path.join(root, "_data/cases", caseSlug, "workflow/02-turn-state.json");
  const state = JSON.parse(fs.readFileSync(turnStatePath, "utf8"));
  state.latestTurnHash = "sha256:corrupted";
  fs.writeFileSync(turnStatePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");

  const result = caseStatus({ root, caseSlug });
  assert.equal(result.ledger.consistent, false);
  assert.ok(result.ledger.issues.length > 0);
  // Must not throw — just report.
});

test("status reports resolved phase after mark-resolved with all claims closed", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });

  // Record evidence.
  const evidenceTurn = beginTurn({ root, caseSlug, userAction: "record-user-evidence" }).pendingTurn;
  const evidenceJournal = fs.readFileSync(journalPath, "utf8")
    .replace("Open (uncertain)", "Confirmed (high)");
  fs.writeFileSync(journalPath, `${evidenceJournal}\nTurn update: recorded evidence.\n`, "utf8");
  const evidenceTurnPath = writeJson(root, "t1-evidence.json", {
    sequence: evidenceTurn.sequence,
    previousHash: evidenceTurn.priorLatestTurnHash,
    turnToken: evidenceTurn.turnToken,
    userAction: evidenceTurn.userAction,
    actionType: "record-user-evidence",
    actionSummary: "Recorded direct rollback evidence.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["_data/cases/example/evidence/rollback-confirmation.md"],
    journalHashBefore: evidenceTurn.journalHashBefore,
    allowedNext: ["mark-resolved", "pause"],
  });
  completeTurn({ root, caseSlug, turnJson: evidenceTurnPath });

  // Mark resolved.
  const resolveTurn = beginTurn({ root, caseSlug, userAction: "mark-resolved" }).pendingTurn;
  const resolvedJournal = fs.readFileSync(journalPath, "utf8").replace("Open.", "Resolved.");
  fs.writeFileSync(journalPath, `${resolvedJournal}\nTurn update: confirmed resolution.\n`, "utf8");
  const resolveTurnPath = writeJson(root, "t2-resolve.json", {
    sequence: resolveTurn.sequence,
    previousHash: resolveTurn.priorLatestTurnHash,
    turnToken: resolveTurn.turnToken,
    userAction: resolveTurn.userAction,
    actionType: "mark-resolved",
    actionSummary: "User confirmed the rollback resolved the issue.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["_data/cases/example/evidence/rollback-confirmation.md"],
    journalHashBefore: resolveTurn.journalHashBefore,
    completionGate: {
      rootCauseClaim: "H1: Application segment may not include the app",
      userConfirmedResolution: true,
      supportingEvidenceRefs: ["_data/cases/example/evidence/rollback-confirmation.md"],
    },
    allowedNext: ["pause"],
  });
  completeTurn({ root, caseSlug, turnJson: resolveTurnPath });

  const result = caseStatus({ root, caseSlug });
  assert.equal(result.phase, "resolved");
  assert.deepEqual(result.nextCommands, []);
});

// ── Finding 1: --force ledger gate bypass ────────────────────────────────────

test("initializeTurnLedger with --force throws when loads artifact is missing", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const result = openCase({
    root,
    caseSlug: "2026-05-17-force-gate-bypass",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  writeDiscoveryJournal(result.journalPath);
  // Record loads and initialize once so the ledger exists.
  recordLoads({
    root,
    caseSlug: result.caseSlug,
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });
  initializeTurnLedger({ root, caseSlug: result.caseSlug });

  // Now delete the loads artifact so the gate should fire on --force re-init.
  const loadsPath = path.join(root, "_data/cases", result.caseSlug, "workflow/01-loads.json");
  fs.rmSync(loadsPath);

  assert.throws(
    () => initializeTurnLedger({ root, caseSlug: result.caseSlug, force: true }),
    /Step 2 loads not recorded/,
  );
});

// ── Finding 2: status loads-phase --force flag ───────────────────────────────

test("status loads phase: nextCommands record-loads omits --force when artifact absent", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-status-loads-no-force",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  const result = caseStatus({ root, caseSlug: "2026-05-17-status-loads-no-force" });
  assert.equal(result.phase, "loads");
  assert.equal(result.loads.present, false);
  const cmd = result.nextCommands.find((c) => c.includes("record-loads"));
  assert.ok(cmd, "expected a record-loads command");
  assert.ok(!cmd.includes("--force"), "should NOT contain --force when artifact absent");
});

test("status loads phase: nextCommands record-loads includes --force when artifact present-but-blocked", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-status-loads-with-force",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  // Record a blocked artifact (missing harness.md).
  recordLoads({
    root,
    caseSlug: "2026-05-17-status-loads-with-force",
    loaded: ["agents/investigator/prompt.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  const result = caseStatus({ root, caseSlug: "2026-05-17-status-loads-with-force" });
  assert.equal(result.phase, "loads");
  assert.equal(result.loads.present, true);
  assert.equal(result.loads.pass, false);
  const cmd = result.nextCommands.find((c) => c.includes("record-loads"));
  assert.ok(cmd, "expected a record-loads command");
  assert.ok(cmd.includes("--force"), "should contain --force when artifact is present-but-blocked");
});

// ── Finding 3: loaded/deferred disjointness ──────────────────────────────────

test("loadsStatus blocks when a path appears in both loaded and deferred", () => {
  const root = tempRepo();
  const proposedLoads = ["agents/investigator/prompt.md", "agents/investigator/harness.md"];
  const loaded = ["agents/investigator/prompt.md", "agents/investigator/harness.md"];
  const deferred = [{ path: "agents/investigator/harness.md", reason: "already loaded" }];
  const result = loadsStatus(root, proposedLoads, loaded, deferred, false);
  assert.equal(result.status, "blocked");
  assert.ok(
    result.blockingIssues.some((i) => i.includes("both loaded and deferred") && i.includes("harness.md")),
    `expected disjointness issue, got: ${JSON.stringify(result.blockingIssues)}`,
  );
});

// ── Finding 4: status intake nextCommand --force ─────────────────────────────

test("status intake phase: nextCommands open-case includes --force and blockingIssues states approval required", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZIA block page appears for payroll site",
    tenantCloud: "zs1",
    products: ["zia"],
    scope: "one user",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-status-intake-force",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zia/logs/web-log-schema.md",
    ],
  });

  const result = caseStatus({ root, caseSlug: "2026-05-17-status-intake-force" });
  assert.equal(result.phase, "intake");
  const cmd = result.nextCommands.find((c) => c.includes("open-case"));
  assert.ok(cmd, "expected an open-case command");
  assert.ok(cmd.includes("--force"), "open-case command must include --force");
  assert.ok(
    result.blockingIssues.some((i) => i.includes("explicit user approval")),
    `expected approval-required issue, got: ${JSON.stringify(result.blockingIssues)}`,
  );
});

// ── Finding 5: verify-loads exit 2 on blocked ────────────────────────────────
// Exit semantics are tested at the CLI boundary in integration; here we confirm
// verifyLoads itself returns status "blocked" (not "pass") so the CLI handler
// will call process.exit(2).
test("verifyLoads returns blocked status when artifact recomputes to blocked (stored blocked)", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-verify-loads-blocked-exit",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  // Record a blocked artifact.
  recordLoads({
    root,
    caseSlug: "2026-05-17-verify-loads-blocked-exit",
    loaded: ["agents/investigator/prompt.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  const result = verifyLoads(root, "2026-05-17-verify-loads-blocked-exit");
  assert.equal(result.status, "blocked");
  assert.ok(result.blockingIssues.length > 0);
});

test("capabilities includes new operations and options", () => {
  const result = capabilities();
  assert.ok(result.supported.includes("record-loads"));
  assert.ok(result.supported.includes("verify-loads"));
  assert.ok(result.supported.includes("status"));
  assert.ok(result.supportedOptions["record-loads"].includes("--loaded"));
  assert.ok(result.supportedOptions["record-loads"].includes("--deferred"));
  assert.ok(result.supportedOptions["record-loads"].includes("--allow-additional"));
  assert.ok(result.supportedOptions["record-loads"].includes("--force"));
});

// ── Fix 1: open-case blocked-intake overwrite ────────────────────────────────

test("openCase overwrites a blocked intake WITHOUT --force (repair path)", () => {
  const root = tempRepo();
  // First open-case: blocked (telemetry load without telemetry framing).
  const blockedFramingPath = writeJson(root, "framing-blocked.json", {
    workingDirectory: root,
    symptom: "ZIA block page appears for payroll site",
    tenantCloud: "zs1",
    products: ["zia"],
    scope: "one user",
  });
  const blocked = openCase({
    root,
    caseSlug: "2026-05-17-repair-blocked",
    framingJson: blockedFramingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zia/logs/web-log-schema.md",
    ],
  });
  assert.equal(blocked.status, "blocked");

  // Re-run with a corrected framing (no telemetry load) — must succeed WITHOUT --force.
  const fixedFramingPath = writeJson(root, "framing-fixed.json", {
    workingDirectory: root,
    symptom: "ZIA block page appears for payroll site",
    tenantCloud: "zs1",
    products: ["zia"],
    scope: "one user",
  });
  const repaired = openCase({
    root,
    caseSlug: "2026-05-17-repair-blocked",
    framingJson: fixedFramingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
    ],
  });
  assert.equal(repaired.status, "pass");
  assert.deepEqual(repaired.blockingIssues, []);
});

test("openCase refuses to overwrite a passing intake without --force", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const args = {
    root,
    caseSlug: "2026-05-17-pass-no-clobber",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  };
  openCase(args);
  // Second call without --force must throw with passing-intake message.
  assert.throws(
    () => openCase(args),
    /case artifacts already exist with a passing intake/,
  );
  // With --force it must succeed.
  const forced = openCase({ ...args, force: true });
  assert.equal(forced.status, "pass");
});

test("openCase refuses to overwrite a corrupt/garbage case-intake.md without --force", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const args = {
    root,
    caseSlug: "2026-05-17-corrupt-intake",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  };
  openCase(args);
  // Corrupt the case-intake.md so it cannot be read as valid.
  const caseIntakePath = path.join(root, "_data/cases/2026-05-17-corrupt-intake/case-intake.md");
  fs.writeFileSync(caseIntakePath, "GARBAGE\x00\x01\x02", "utf8");
  // Must still refuse without --force (can't confirm it's blocked, treat as unknown).
  assert.throws(
    () => openCase(args),
    /case artifacts already exist/,
  );
});

// ── Fix 2: status journal-pending phase ──────────────────────────────────────

test("status reports journal-pending phase when loads pass but journal is still the Step 1 stub", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  openCase({
    root,
    caseSlug: "2026-05-17-journal-pending",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  recordLoads({
    root,
    caseSlug: "2026-05-17-journal-pending",
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });
  // Journal is still the Step 1 stub (no claim table) at this point.

  const result = caseStatus({ root, caseSlug: "2026-05-17-journal-pending" });
  assert.equal(result.phase, "journal-pending");
  assert.deepEqual(result.nextCommands, []);
  assert.ok(Array.isArray(result.nextActions));
  assert.ok(result.nextActions.length > 0, "nextActions must be populated for journal-pending");
  assert.ok(
    result.nextActions.some((a) => a.includes("journal.md") || a.includes("journal")),
    `expected nextActions to mention the journal path, got: ${JSON.stringify(result.nextActions)}`,
  );
  assert.ok(
    result.nextActions.some((a) => a.includes("Do not hand-edit")),
    `expected nextActions to warn against hand-editing, got: ${JSON.stringify(result.nextActions)}`,
  );
});

test("status reports ledger-pending (not journal-pending) when journal has claim table", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const opened = openCase({
    root,
    caseSlug: "2026-05-17-ledger-pending-ct",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  // Write the real discovery journal (with claim table).
  writeDiscoveryJournal(opened.journalPath);
  recordLoads({
    root,
    caseSlug: "2026-05-17-ledger-pending-ct",
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  const result = caseStatus({ root, caseSlug: "2026-05-17-ledger-pending-ct" });
  assert.equal(result.phase, "ledger-pending");
  assert.ok(result.nextCommands.some((c) => c.includes("initialize-turn-ledger")));
});

test("status always includes nextActions field (present and empty in non-journal-pending phases)", () => {
  const root = tempRepo();
  const result = caseStatus({ root, caseSlug: "2026-05-17-no-case-next-actions" });
  assert.equal(result.phase, "no-case");
  assert.ok(Object.prototype.hasOwnProperty.call(result, "nextActions"), "nextActions must be present");
  assert.deepEqual(result.nextActions, []);
});

// ── Fix 3: initializeTurnLedger actionable error on stub journal ─────────────

test("initializeTurnLedger throws with Step-1-stub message and hand-edit warning on stub journal", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const result = openCase({
    root,
    caseSlug: "2026-05-17-stub-journal-gate",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  // Record passing loads so requirePassingLoads does not fire first.
  recordLoads({
    root,
    caseSlug: result.caseSlug,
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });
  // Journal is still the Step 1 stub.

  assert.throws(
    () => initializeTurnLedger({ root, caseSlug: result.caseSlug }),
    /Step 1 stub/,
  );
  assert.throws(
    () => initializeTurnLedger({ root, caseSlug: result.caseSlug }),
    /Do not hand-edit/,
  );
});
