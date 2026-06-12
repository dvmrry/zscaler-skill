import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
  runTurn,
  saveJournal,
  verifyCaseFiles,
  verifyLoads,
  REQUIRED_JOURNAL_MARKERS,
  validateJournalContentForSave,
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

test("capabilities().version matches the trimmed contents of the repo VERSION file", () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const versionFile = path.join(repoRoot, "VERSION");
  const expected = fs.readFileSync(versionFile, "utf8").trim();
  const result = capabilities();
  assert.equal(result.version, expected, `capabilities().version should be "${expected}"`);
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

test("openCase allows telemetry loads when telemetry phrase is in userFlaggedSpecifics", () => {
  // Regression: live Cascade round 2026-06-10 — "LSS shows the connector status
  // log gap" was faithfully parsed into userFlaggedSpecifics and the guardrail
  // false-blocked the telemetry loads.
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "App Connector showing unhealthy",
    tenantCloud: "zs3",
    products: ["zpa"],
    scope: "one connector offline in connector-group-us-east-1",
    userFlaggedSpecifics: [
      "connector-group-us-east-1",
      "LSS shows connector status log gap",
    ],
  });

  const result = openCase({
    root,
    caseSlug: "2026-06-10-lss-phrase-specific",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zpa/logs/app-connector-metrics.md",
    ],
  });

  assert.equal(result.status, "pass");
});

test("openCase allows telemetry loads when a bare telemetry keyword is flagged", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "App Connector showing unhealthy",
    tenantCloud: "zs3",
    products: ["zpa"],
    scope: "one connector",
    userFlaggedSpecifics: ["LSS"],
  });

  const result = openCase({
    root,
    caseSlug: "2026-06-10-bare-lss-specific",
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
      "references/zpa/logs/app-connector-metrics.md",
    ],
  });

  assert.equal(result.status, "pass");
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
    /actionType is not allowed: record-evidence.*Valid actionType values: .*load-file.*not the begin-turn --user-action value/,
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

  // Turn 1: record the evidence ref into the ledger WITHOUT transitioning the claim status.
  // This establishes the ref in priorEvidenceRefs(events) so the subsequent turn can
  // verify it (Change 3 evidence-gated transition predicate).
  const t1 = beginTurn({ root, caseSlug, userAction: "record-user-evidence" }).pendingTurn;
  const journalWithNote1 = fs.readFileSync(journalPath, "utf8") +
    "\nTurn update: rollback evidence collected, status still uncertain.\n";
  fs.writeFileSync(journalPath, journalWithNote1, "utf8");
  const t1Path = writeJson(root, "turn-evidence-t1.json", {
    sequence: t1.sequence,
    previousHash: t1.priorLatestTurnHash,
    turnToken: t1.turnToken,
    userAction: t1.userAction,
    actionType: "record-user-evidence",
    actionSummary: "Collected rollback evidence; claim still under evaluation.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["_data/cases/example/evidence/rollback-confirmation.md"],
    journalHashBefore: t1.journalHashBefore,
    allowedNext: ["record-user-evidence", "mark-resolved", "pause"],
  });
  completeTurn({ root, caseSlug, turnJson: t1Path });

  // Turn 2: evidence ref is now in priorEvidenceRefs(events) — transition is verifiable.
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

  // Turn 1: record evidence ref into the ledger WITHOUT transitioning the claim status.
  // This establishes the ref in priorEvidenceRefs(events) so the subsequent transition
  // turn can verify it (Change 3 evidence-gated transition predicate).
  const t1 = beginTurn({ root, caseSlug, userAction: "record-user-evidence" }).pendingTurn;
  const journalWithNote1 = fs.readFileSync(journalPath, "utf8") +
    "\nTurn update: rollback evidence collected, status still uncertain.\n";
  fs.writeFileSync(journalPath, journalWithNote1, "utf8");
  const t1Path = writeJson(root, "t0-pre-evidence.json", {
    sequence: t1.sequence,
    previousHash: t1.priorLatestTurnHash,
    turnToken: t1.turnToken,
    userAction: t1.userAction,
    actionType: "record-user-evidence",
    actionSummary: "Collected rollback evidence; claim still under evaluation.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["_data/cases/example/evidence/rollback-confirmation.md"],
    journalHashBefore: t1.journalHashBefore,
    allowedNext: ["record-user-evidence", "mark-resolved", "pause"],
  });
  completeTurn({ root, caseSlug, turnJson: t1Path });

  // Turn 2: evidence ref is now in priorEvidenceRefs(events) — transition is verifiable.
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

// ── save-journal tests ────────────────────────────────────────────────────────

/**
 * Renders a minimal but fully valid discovery journal to a temp file and
 * returns the temp file path. Content passes all three marker checks.
 */
function writeTempJournal(content) {
  const tmpPath = path.join(os.tmpdir(), `test-journal-${Date.now()}-${Math.random().toString(36).slice(2)}.md`);
  fs.writeFileSync(tmpPath, content, "utf8");
  return tmpPath;
}

const VALID_JOURNAL_CONTENT = `# Discovery Journal

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
| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |

## Resolution

Open.
`;

test("save-journal happy path: writes journal, returns pass with sha256, file matches content", () => {
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
    caseSlug: "2026-06-10-save-journal-happy",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  const tmpPath = writeTempJournal(VALID_JOURNAL_CONTENT);
  const result = saveJournal({
    root,
    caseSlug: "2026-06-10-save-journal-happy",
    contentFile: tmpPath,
  });

  assert.equal(result.status, "pass");
  assert.equal(result.operation, "save-journal");
  assert.equal(result.caseSlug, "2026-06-10-save-journal-happy");
  assert.ok(result.journalPath.endsWith("journal.md"));
  assert.ok(typeof result.bytesWritten === "number" && result.bytesWritten > 0);
  assert.match(result.journalHash, /^sha256:[0-9a-f]{64}$/);

  // File on disk matches content.
  const onDisk = fs.readFileSync(result.journalPath, "utf8");
  assert.equal(onDisk, VALID_JOURNAL_CONTENT);

  // Hash matches what we'd compute independently.
  const expectedHash = `sha256:${createHash("sha256").update(VALID_JOURNAL_CONTENT).digest("hex")}`;
  assert.equal(result.journalHash, expectedHash);
});

test("save-journal overwrite: second save with updated Open-status content succeeds without --force", () => {
  // Second saves are allowed when they contain only Open claim statuses.
  // Terminal-status transitions (Confirmed, Ruled out, Resolved) are blocked on all
  // save-journal calls outside an active turn; those transitions must go through run-turn
  // or begin/complete-turn.
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
    caseSlug: "2026-06-10-save-journal-overwrite",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  const tmpPath1 = writeTempJournal(VALID_JOURNAL_CONTENT);
  const result1 = saveJournal({
    root,
    caseSlug: "2026-06-10-save-journal-overwrite",
    contentFile: tmpPath1,
  });
  assert.equal(result1.status, "pass");

  // Second save: update the claim's Next evidence column only — status stays Open (uncertain).
  const updatedContent = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Verify segment config | 2026-06-10T01:00:00Z | updated |",
  );
  const tmpPath2 = writeTempJournal(updatedContent);
  const result2 = saveJournal({
    root,
    caseSlug: "2026-06-10-save-journal-overwrite",
    contentFile: tmpPath2,
  });
  assert.equal(result2.status, "pass");
  assert.notEqual(result1.journalHash, result2.journalHash);

  const onDisk = fs.readFileSync(result2.journalPath, "utf8");
  assert.equal(onDisk, updatedContent);
});

test("save-journal: content missing claim-table header throws actionable error and does not modify journal", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const openResult = openCase({
    root,
    caseSlug: "2026-06-10-save-journal-no-table",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  // Capture the stub content before attempting save.
  const stubContent = fs.readFileSync(openResult.journalPath, "utf8");

  const noTableContent = `# Discovery Journal

## Framing

no table here

## Resolution

Open.
`;
  const tmpPath = writeTempJournal(noTableContent);
  assert.throws(
    () => saveJournal({ root, caseSlug: "2026-06-10-save-journal-no-table", contentFile: tmpPath }),
    /claim table header/,
  );
  // Actionable message names the canonical header string.
  assert.throws(
    () => saveJournal({ root, caseSlug: "2026-06-10-save-journal-no-table", contentFile: tmpPath }),
    /Claim \| Source \| Status \| Next evidence needed/,
  );
  // Journal on disk must be unchanged (still the stub).
  const afterContent = fs.readFileSync(openResult.journalPath, "utf8");
  assert.equal(afterContent, stubContent);
});

test("save-journal: content missing ## Resolution throws", () => {
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
    caseSlug: "2026-06-10-save-journal-no-resolution",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  const noResolutionContent = `# Discovery Journal

## Claims

| Claim | Source | Status | Next evidence needed | Timestamp | Notes |
|---|---|---|---|---|---|
| H1: Segment missing | ref | Open (uncertain) | check | 2026-06-10T00:00:00Z | ref |
`;
  const tmpPath = writeTempJournal(noResolutionContent);
  assert.throws(
    () => saveJournal({ root, caseSlug: "2026-06-10-save-journal-no-resolution", contentFile: tmpPath }),
    /## Resolution/,
  );
});

test("save-journal: missing case dir throws", () => {
  const root = tempRepo();
  const tmpPath = writeTempJournal(VALID_JOURNAL_CONTENT);
  assert.throws(
    () => saveJournal({ root, caseSlug: "nonexistent-case", contentFile: tmpPath }),
    /missing intake artifacts/,
  );
});

test("save-journal: bad slug throws", () => {
  const root = tempRepo();
  const tmpPath = writeTempJournal(VALID_JOURNAL_CONTENT);
  assert.throws(
    () => saveJournal({ root, caseSlug: "../escape", contentFile: tmpPath }),
    /case slug/,
  );
});

test("save-journal integration: stub journal case → save-journal full journal → initializeTurnLedger passes", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const openResult = openCase({
    root,
    caseSlug: "2026-06-10-save-journal-integration",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  recordLoads({
    root,
    caseSlug: openResult.caseSlug,
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  // Before save-journal, initializeTurnLedger should fail (stub journal).
  assert.throws(
    () => initializeTurnLedger({ root, caseSlug: openResult.caseSlug }),
    /Step 1 stub/,
  );

  // Save a full journal via save-journal (no hand-editing).
  const tmpPath = writeTempJournal(VALID_JOURNAL_CONTENT);
  const saveResult = saveJournal({
    root,
    caseSlug: openResult.caseSlug,
    contentFile: tmpPath,
  });
  assert.equal(saveResult.status, "pass");

  // Now initializeTurnLedger must succeed.
  const ledgerResult = initializeTurnLedger({ root, caseSlug: openResult.caseSlug });
  assert.equal(ledgerResult.status, "pass");
});

// ── run-turn tests ────────────────────────────────────────────────────────────

/**
 * Returns a valid turn-input object for run-turn / complete-turn that works with
 * the standard VALID_JOURNAL_CONTENT that has "H1: Segment missing".
 * The journal must be mutated (claim status changed) so the hash differs.
 */
function makeValidRunTurnInput(root) {
  const inputPath = writeJson(root, `turn-input-${Date.now()}.json`, {
    actionType: "load-file",
    actionSummary: "Checked one evidence source.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: ["E1"],
    allowedNext: ["continue-top-open", "pause"],
  });
  return inputPath;
}

/**
 * Updated journal content: same as VALID_JOURNAL_CONTENT but with a mutated claim.
 */
// Change 3: updated journal content must not transition to a terminal status without
// prior recorded evidence.  Use Open (uncertain) with updated notes to satisfy the
// hash-change requirement without triggering the evidence-gated transition predicate.
const UPDATED_JOURNAL_CONTENT = VALID_JOURNAL_CONTENT.replace(
  "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
  "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check connector group | 2026-06-10T01:00:00Z | snapshot-checked |",
);

function createCaseWithLedger() {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const openResult = openCase({
    root,
    caseSlug: `2026-06-10-run-turn-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  const tmpPath = writeTempJournal(VALID_JOURNAL_CONTENT);
  saveJournal({ root, caseSlug: openResult.caseSlug, contentFile: tmpPath });
  recordLoads({
    root,
    caseSlug: openResult.caseSlug,
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });
  initializeTurnLedger({ root, caseSlug: openResult.caseSlug });
  return { root, caseSlug: openResult.caseSlug };
}

test("run-turn happy path: ledger advances identically to manual begin/save/complete", () => {
  // Set up two twin fixtures and run each path to compare key fields.
  function makeFixture() {
    const root = tempRepo();
    const framingPath = writeJson(root, "framing.json", {
      workingDirectory: root,
      symptom: "ZPA users cannot reach wiki.internal",
      tenantCloud: "zs2",
      products: ["zpa"],
      scope: "many users",
    });
    const caseSlug = "2026-06-10-twin-fixture";
    openCase({
      root,
      caseSlug,
      framingJson: framingPath,
      proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    });
    const tmpPath = writeTempJournal(VALID_JOURNAL_CONTENT);
    saveJournal({ root, caseSlug, contentFile: tmpPath });
    recordLoads({
      root,
      caseSlug,
      loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
      deferred: [],
      allowAdditional: false,
      force: false,
    });
    initializeTurnLedger({ root, caseSlug });
    return { root, caseSlug };
  }

  // Twin A: manual begin → save → complete.
  const { root: rootA, caseSlug: slugA } = makeFixture();
  const journalPath = path.join(rootA, "_data/cases", slugA, "journal.md");
  const pendingA = beginTurn({ root: rootA, caseSlug: slugA, userAction: "continue-top-open" }).pendingTurn;
  const tmpA = writeTempJournal(UPDATED_JOURNAL_CONTENT);
  saveJournal({ root: rootA, caseSlug: slugA, contentFile: tmpA });
  const inputPathA = makeValidRunTurnInput(rootA);
  const resultA = completeTurn({ root: rootA, caseSlug: slugA, turnInputJson: inputPathA });

  // Twin B: single run-turn.
  const { root: rootB, caseSlug: slugB } = makeFixture();
  const tmpB = writeTempJournal(UPDATED_JOURNAL_CONTENT);
  const inputPathB = makeValidRunTurnInput(rootB);
  const resultB = runTurn({
    root: rootB,
    caseSlug: slugB,
    userAction: "continue-top-open",
    journalFile: tmpB,
    turnInputJson: inputPathB,
  });

  // Both should advance to sequence 1.
  assert.equal(resultA.event.sequence, 1);
  assert.equal(resultB.event.sequence, 1);

  // userAction, actionType, touchedClaims must match.
  assert.equal(resultA.event.userAction, resultB.event.userAction);
  assert.equal(resultA.event.actionType, resultB.event.actionType);
  assert.deepEqual(resultA.event.touchedClaims, resultB.event.touchedClaims);

  // journalHashBefore must equal the pre-existing on-disk journal hash in both.
  // Since twin fixtures are identically constructed, both journalHashBefore values should match.
  assert.equal(resultA.event.journalHashBefore, resultB.event.journalHashBefore);

  // journalHashAfter must match (same new content applied).
  assert.equal(resultA.event.journalHashAfter, resultB.event.journalHashAfter);

  // State must agree: no pendingTurn, sequence 1.
  assert.equal(resultA.state.currentSequence, 1);
  assert.equal(resultB.state.currentSequence, 1);
  assert.equal(resultA.state.pendingTurn, null);
  assert.equal(resultB.state.pendingTurn, null);

  // run-turn result includes journalPath and journalHash fields.
  assert.ok(resultB.journalPath.endsWith("journal.md"));
  assert.ok(resultB.journalHash.startsWith("sha256:"));
});

test("run-turn atomicity: bad actionType leaves no pendingTurn, journal unchanged, sequence unchanged", () => {
  const { root, caseSlug } = createCaseWithLedger();
  const paths = { journalPath: path.join(root, "_data/cases", caseSlug, "journal.md") };
  const journalBefore = fs.readFileSync(paths.journalPath, "utf8");
  const turnStatePath = path.join(root, "_data/cases", caseSlug, "workflow/02-turn-state.json");
  const stateBefore = readJson(turnStatePath);

  const tmpJournal = writeTempJournal(UPDATED_JOURNAL_CONTENT);
  const badInputPath = writeJson(root, "bad-action-type.json", {
    actionType: "record-evidence", // invalid
    actionSummary: "Should not persist.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: [],
    allowedNext: ["pause"],
  });

  assert.throws(
    () => runTurn({ root, caseSlug, userAction: "continue-top-open", journalFile: tmpJournal, turnInputJson: badInputPath }),
    /actionType is not allowed: record-evidence/,
  );

  // State untouched: no pendingTurn, same sequence.
  const stateAfter = readJson(turnStatePath);
  assert.equal(stateAfter.pendingTurn, null);
  assert.equal(stateAfter.currentSequence, stateBefore.currentSequence);

  // Journal on disk unchanged.
  assert.equal(fs.readFileSync(paths.journalPath, "utf8"), journalBefore);
});

test("run-turn atomicity: invalid journal content (missing claim table) leaves nothing persisted", () => {
  const { root, caseSlug } = createCaseWithLedger();
  const journalPath = path.join(root, "_data/cases", caseSlug, "journal.md");
  const journalBefore = fs.readFileSync(journalPath, "utf8");
  const turnStatePath = path.join(root, "_data/cases", caseSlug, "workflow/02-turn-state.json");
  const stateBefore = readJson(turnStatePath);
  const logPath = path.join(root, "_data/cases", caseSlug, "workflow/02-turns.jsonl");
  const logBefore = fs.readFileSync(logPath, "utf8");

  const noTableContent = `# Discovery Journal\n\n## Framing\n\nno table\n\n## Resolution\n\nOpen.\n`;
  const tmpJournal = writeTempJournal(noTableContent);
  const inputPath = makeValidRunTurnInput(root);

  assert.throws(
    () => runTurn({ root, caseSlug, userAction: "continue-top-open", journalFile: tmpJournal, turnInputJson: inputPath }),
    /claim table header/,
  );

  assert.equal(fs.readFileSync(journalPath, "utf8"), journalBefore);
  assert.equal(readJson(turnStatePath).pendingTurn, null);
  assert.equal(readJson(turnStatePath).currentSequence, stateBefore.currentSequence);
  assert.equal(fs.readFileSync(logPath, "utf8"), logBefore);
});

test("run-turn atomicity: touchedClaims naming absent-from-new-journal claim leaves nothing persisted", () => {
  const { root, caseSlug } = createCaseWithLedger();
  const journalPath = path.join(root, "_data/cases", caseSlug, "journal.md");
  const journalBefore = fs.readFileSync(journalPath, "utf8");
  const turnStatePath = path.join(root, "_data/cases", caseSlug, "workflow/02-turn-state.json");
  const stateBefore = readJson(turnStatePath);

  // Updated journal where H1 claim name has changed (doesn't exist as "H1: Segment missing").
  const differentClaimContent = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing |",
    "| H2: Different claim |",
  );
  const tmpJournal = writeTempJournal(differentClaimContent);
  const inputPath = writeJson(root, "bad-touched-claims.json", {
    actionType: "load-file",
    actionSummary: "Checked evidence.",
    touchedClaims: ["H1: Segment missing"], // not in new journal
    evidenceRefs: [],
    allowedNext: ["pause"],
  });

  assert.throws(
    () => runTurn({ root, caseSlug, userAction: "continue-top-open", journalFile: tmpJournal, turnInputJson: inputPath }),
    /touched claim is not present in journal\.md/,
  );

  assert.equal(fs.readFileSync(journalPath, "utf8"), journalBefore);
  assert.equal(readJson(turnStatePath).pendingTurn, null);
  assert.equal(readJson(turnStatePath).currentSequence, stateBefore.currentSequence);
});

test("run-turn: touchedClaims present in new journal but absent from old on-disk journal passes", () => {
  // Start with old journal that has H1: Segment missing.
  // New journal content introduces H2: New claim instead.
  // The turn references H2 which is only in the new journal — should PASS.
  const { root, caseSlug } = createCaseWithLedger();

  // New journal has only H2 — Open (uncertain) so no terminal transition fires.
  const newClaimContent = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H2: New claim | references/zpa/app-segments.md | Open (uncertain) | Check connector | 2026-06-10T01:00:00Z | reference-grounded |",
  );
  const tmpJournal = writeTempJournal(newClaimContent);
  const inputPath = writeJson(root, "new-claim-input.json", {
    actionType: "load-file",
    actionSummary: "Added H2 from reference.",
    touchedClaims: ["H2: New claim"], // only in new journal, not in old
    evidenceRefs: [],
    allowedNext: ["pause"],
  });

  // Should succeed: validation is against the NEW journal content.
  const result = runTurn({
    root,
    caseSlug,
    userAction: "continue-top-open",
    journalFile: tmpJournal,
    turnInputJson: inputPath,
  });
  assert.equal(result.status, "pass");
  assert.deepEqual(result.event.touchedClaims, ["H2: New claim"]);
});

test("run-turn: open pendingTurn refuses with status-pointing message; state untouched", () => {
  const { root, caseSlug } = createCaseWithLedger();
  // Open a pending turn with begin-turn.
  const begun = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  const turnStatePath = path.join(root, "_data/cases", caseSlug, "workflow/02-turn-state.json");
  const stateBefore = readJson(turnStatePath);

  const tmpJournal = writeTempJournal(UPDATED_JOURNAL_CONTENT);
  const inputPath = makeValidRunTurnInput(root);

  assert.throws(
    () => runTurn({ root, caseSlug, userAction: "continue-top-open", journalFile: tmpJournal, turnInputJson: inputPath }),
    /a pending turn is already open.*run status/,
  );

  // State must be untouched.
  const stateAfter = readJson(turnStatePath);
  assert.deepEqual(stateAfter, stateBefore);
});

test("run-turn: request-user-evidence with evidenceRequest passes and halts as single completed turn", () => {
  const { root, caseSlug } = createCaseWithLedger();

  // New journal content with the claim still open (required for evidence handoff).
  const tmpJournal = writeTempJournal(
    VALID_JOURNAL_CONTENT + "\nTurn update: asked user for evidence.\n",
  );
  const inputPath = writeJson(root, "evidence-request-input.json", {
    actionType: "request-user-evidence",
    actionSummary: "Asked user for the segment configuration.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: ["user-request:segment-config"],
    evidenceRequest: "Please provide the segment configuration export from the ZPA portal.",
    allowedNext: ["record-user-evidence", "pause"],
  });

  const result = runTurn({
    root,
    caseSlug,
    userAction: "request-user-evidence",
    journalFile: tmpJournal,
    turnInputJson: inputPath,
  });

  assert.equal(result.status, "pass");
  assert.equal(result.event.actionType, "request-user-evidence");
  assert.equal(result.event.evidenceRequest, "Please provide the segment configuration export from the ZPA portal.");
  assert.equal(result.state.pendingTurn, null);
});

test("run-turn: mark-resolved enforces completionGate (failing case)", () => {
  const { root, caseSlug } = createCaseWithLedger();

  // New journal still has an open claim — should fail.
  const tmpJournal = writeTempJournal(VALID_JOURNAL_CONTENT + "\nTurn update: tried to resolve.\n");
  const inputPath = writeJson(root, "bad-resolve-input.json", {
    actionType: "mark-resolved",
    actionSummary: "Premature resolution.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: [],
    completionGate: {
      rootCauseClaim: "H1: Segment missing",
      userConfirmedResolution: true,
      supportingEvidenceRefs: ["E1"],
    },
    allowedNext: ["pause"],
  });

  assert.throws(
    () => runTurn({ root, caseSlug, userAction: "mark-resolved", journalFile: tmpJournal, turnInputJson: inputPath }),
    /requires no open claims/,
  );
});

test("run-turn: mark-resolved enforces completionGate (passing case)", () => {
  const { root, caseSlug } = createCaseWithLedger();

  // First: record a prior evidence turn that keeps the claim Open (uncertain) but
  // records the evidence ref.  This avoids triggering the evidence-gated transition
  // predicate (Change 3) while establishing the ref in priorEvidenceRefs(events).
  const evidenceTmpJournal = writeTempJournal(
    VALID_JOURNAL_CONTENT.replace(
      "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
      "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check policy | 2026-06-10T01:00:00Z | evidence-recorded |",
    ) + "\nTurn update: evidence recorded.\n",
  );
  const evidenceInputPath = writeJson(root, "evidence-rec-input.json", {
    actionType: "record-user-evidence",
    actionSummary: "Recorded supporting evidence.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: ["_data/cases/example/evidence/confirm.md"],
    allowedNext: ["mark-resolved", "pause"],
  });
  const e1Result = runTurn({
    root,
    caseSlug,
    userAction: "record-user-evidence",
    journalFile: evidenceTmpJournal,
    turnInputJson: evidenceInputPath,
  });
  assert.equal(e1Result.status, "pass");

  // Now mark-resolved turn: transitions Open (uncertain) -> Confirmed (high).
  // The ref is now in priorEvidenceRefs(events) from the first turn — verifiable.
  const resolvedJournalContent =
    VALID_JOURNAL_CONTENT
      .replace("Open (uncertain)", "Confirmed (high)")
      .replace("Open.", "Resolved.") +
    "\nTurn update: user confirmed resolution.\n";
  const resolveTmpJournal = writeTempJournal(resolvedJournalContent);
  const resolveInputPath = writeJson(root, "resolve-input.json", {
    actionType: "mark-resolved",
    actionSummary: "User confirmed the fix holds.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: ["_data/cases/example/evidence/confirm.md"],
    completionGate: {
      rootCauseClaim: "H1: Segment missing",
      userConfirmedResolution: true,
      supportingEvidenceRefs: ["_data/cases/example/evidence/confirm.md"],
    },
    allowedNext: ["pause"],
  });

  const result = runTurn({
    root,
    caseSlug,
    userAction: "mark-resolved",
    journalFile: resolveTmpJournal,
    turnInputJson: resolveInputPath,
  });
  assert.equal(result.status, "pass");
  assert.equal(result.event.actionType, "mark-resolved");
  assert.ok(result.event.completionGate);
  assert.equal(result.state.pendingTurn, null);
});

// ── initialize-turn-ledger --journal-file tests ───────────────────────────────

test("initialize-turn-ledger --journal-file: stub journal on disk + valid content file saves journal AND initializes ledger", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const openResult = openCase({
    root,
    caseSlug: "2026-06-10-ledger-with-journal-file",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  recordLoads({
    root,
    caseSlug: openResult.caseSlug,
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  // Journal is still stub (no claim table) — initializeTurnLedger without --journal-file would fail.
  assert.throws(
    () => initializeTurnLedger({ root, caseSlug: openResult.caseSlug }),
    /Step 1 stub/,
  );

  // Now run with --journal-file.
  const tmpPath = writeTempJournal(VALID_JOURNAL_CONTENT);
  const result = initializeTurnLedger({ root, caseSlug: openResult.caseSlug, journalFile: tmpPath });

  assert.equal(result.status, "pass");
  assert.ok(fs.existsSync(result.turnLogPath));
  assert.ok(fs.existsSync(result.turnStatePath));

  // Journal must be saved.
  const journalPath = path.join(root, "_data/cases", openResult.caseSlug, "journal.md");
  const onDisk = fs.readFileSync(journalPath, "utf8");
  assert.equal(onDisk, VALID_JOURNAL_CONTENT);

  // Ledger must be initialized.
  const state = readJson(result.turnStatePath);
  assert.equal(state.currentSequence, 0);
  assert.equal(state.pendingTurn, null);
  assert.ok(state.nextTurnToken);
});

test("initialize-turn-ledger --journal-file: invalid content refuses before any write", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const openResult = openCase({
    root,
    caseSlug: "2026-06-10-ledger-invalid-journal-file",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  recordLoads({
    root,
    caseSlug: openResult.caseSlug,
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  const stubContent = fs.readFileSync(openResult.journalPath, "utf8");
  const badContent = `# Discovery Journal\n\n## Framing\n\nno table\n\n## Resolution\n\nOpen.\n`;
  const tmpPath = writeTempJournal(badContent);

  assert.throws(
    () => initializeTurnLedger({ root, caseSlug: openResult.caseSlug, journalFile: tmpPath }),
    /claim table header/,
  );

  // Journal on disk must be unchanged (still the stub).
  assert.equal(fs.readFileSync(openResult.journalPath, "utf8"), stubContent);

  // Ledger must not exist.
  const turnStatePath = path.join(root, "_data/cases", openResult.caseSlug, "workflow/02-turn-state.json");
  assert.equal(fs.existsSync(turnStatePath), false);
});

test("initialize-turn-ledger --journal-file: missing loads artifact refuses before writing journal", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const openResult = openCase({
    root,
    caseSlug: "2026-06-10-ledger-no-loads-journal-file",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  // No record-loads call — loads artifact is missing.

  const stubContent = fs.readFileSync(openResult.journalPath, "utf8");
  const tmpPath = writeTempJournal(VALID_JOURNAL_CONTENT);

  assert.throws(
    () => initializeTurnLedger({ root, caseSlug: openResult.caseSlug, journalFile: tmpPath }),
    /Step 2 loads not recorded/,
  );

  // Journal must be unchanged (the loads gate fired before the write).
  assert.equal(fs.readFileSync(openResult.journalPath, "utf8"), stubContent);
});

// ── status: turn-ready nextCommands contains run-turn ────────────────────────

test("status turn-ready: nextCommands contains run-turn as the first suggestion", () => {
  const { root, caseSlug } = createCaseWithLedger();
  const result = caseStatus({ root, caseSlug });
  assert.equal(result.phase, "turn-ready");

  const runTurnCmd = result.nextCommands.find((c) => c.includes("run-turn"));
  assert.ok(runTurnCmd, "expected a run-turn command in nextCommands");
  assert.ok(runTurnCmd.includes("--user-action"), "run-turn command should include --user-action");
  assert.ok(runTurnCmd.includes("--journal-file"), "run-turn command should include --journal-file");
  assert.ok(runTurnCmd.includes("--turn-input-json"), "run-turn command should include --turn-input-json");

  // begin-turn is still present as the second suggestion (for evidence-import turns).
  const beginTurnCmd = result.nextCommands.find((c) => c.includes("begin-turn"));
  assert.ok(beginTurnCmd, "expected a begin-turn command in nextCommands");

  // run-turn should appear before begin-turn.
  const runTurnIdx = result.nextCommands.findIndex((c) => c.includes("run-turn"));
  const beginTurnIdx = result.nextCommands.findIndex((c) => c.includes("begin-turn"));
  assert.ok(runTurnIdx < beginTurnIdx, "run-turn should appear before begin-turn");
});

// ── capabilities includes run-turn ───────────────────────────────────────────

test("capabilities: run-turn is listed in supported operations and options", () => {
  const result = capabilities();
  assert.ok(result.supported.includes("run-turn"), "run-turn must be in supported");
  const opts = result.supportedOptions["run-turn"];
  assert.ok(opts, "run-turn must have supportedOptions entry");
  assert.ok(opts.includes("--user-action"));
  assert.ok(opts.includes("--journal-file"));
  assert.ok(opts.includes("--turn-input-json"));
  // initialize-turn-ledger must also list --journal-file.
  const ledgerOpts = result.supportedOptions["initialize-turn-ledger"];
  assert.ok(ledgerOpts, "initialize-turn-ledger must have supportedOptions entry");
  assert.ok(ledgerOpts.includes("--journal-file"));
});

// ── Finding 1: pre-write ledger guard ────────────────────────────────────────

test("initialize-turn-ledger --journal-file: existing ledger + new journal content + no --force throws without mutating journal", () => {
  // Create a fully initialized case (with ledger already present).
  const { root, caseSlug } = createCaseWithLedger();
  const journalPath = path.join(root, "_data/cases", caseSlug, "journal.md");
  const journalBefore = fs.readFileSync(journalPath, "utf8");

  // New journal content that would change the journal if written — Open status only so the
  // terminal-status gate doesn't fire before the ledger guard (which is what we're testing here).
  const newContent = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Verify segment config | 2026-06-10T01:00:00Z | updated |",
  );
  const tmpPath = writeTempJournal(newContent);

  // Should throw because ledger already exists and --force is not set.
  assert.throws(
    () => initializeTurnLedger({ root, caseSlug, journalFile: tmpPath }),
    /turn ledger already exists/,
  );

  // Journal on disk must be unchanged — the guard must have fired before any write.
  assert.equal(fs.readFileSync(journalPath, "utf8"), journalBefore);
});

// ── Finding 2: openCase nextStep artifact content ─────────────────────────────

test("openCase generates nextStep without verify-case instruction for a passing intake", () => {
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
    caseSlug: "2026-06-10-nextstep-check",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  assert.equal(result.status, "pass");

  // The nextStep returned by openCase must not instruct verify-case.
  assert.ok(
    !result.nextStep.includes("verify-case"),
    `nextStep must not mention verify-case: ${result.nextStep}`,
  );
  assert.match(result.nextStep, /open-case already verified/);

  // The written case-intake.md must also carry the updated nextStep.
  const intakeMd = fs.readFileSync(
    path.join(root, "_data/cases/2026-06-10-nextstep-check/case-intake.md"),
    "utf8",
  );
  assert.match(intakeMd, /Next Step: Load only the proposed files \(open-case already verified this intake\)\./);
});

// ── Finding 3: H-tag touchedClaims matching ──────────────────────────────────

test("completeTurn: short H-tag touchedClaim resolves to matching full claim cell", () => {
  // createPassingCaseWithJournal puts "H1: Application segment may not include the app" in the journal.
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  const pending = begun.pendingTurn;

  fs.appendFileSync(journalPath, "\nTurn update: checked segment evidence.\n", "utf8");
  const turnPath = writeJson(root, "turn-h-tag.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "load-file",
    actionSummary: "Checked segment evidence.",
    touchedClaims: ["H1"], // short tag — must resolve to the full cell
    evidenceRefs: ["E1"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["pause"],
  });

  const completed = completeTurn({ root, caseSlug, turnJson: turnPath });
  assert.equal(completed.status, "pass");
  // The persisted event must store the resolved full claim text.
  assert.deepEqual(completed.event.touchedClaims, ["H1: Application segment may not include the app"]);
});

test("completeTurn: exact full claim text still matches (no regression)", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  const pending = begun.pendingTurn;

  fs.appendFileSync(journalPath, "\nTurn update: checked segment evidence.\n", "utf8");
  const turnPath = writeJson(root, "turn-full-claim.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "load-file",
    actionSummary: "Checked segment evidence.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs: ["E1"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["pause"],
  });

  const completed = completeTurn({ root, caseSlug, turnJson: turnPath });
  assert.equal(completed.status, "pass");
  assert.deepEqual(completed.event.touchedClaims, ["H1: Application segment may not include the app"]);
});

test("completeTurn: unknown H-tag fails with claim list in error message", () => {
  const { root, caseSlug, journalPath } = createPassingCaseWithJournal();
  initializeTurnLedger({ root, caseSlug });
  const begun = beginTurn({ root, caseSlug, userAction: "continue-top-open" });
  const pending = begun.pendingTurn;

  fs.appendFileSync(journalPath, "\nTurn update: checked segment evidence.\n", "utf8");
  const turnPath = writeJson(root, "turn-unknown-tag.json", {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "load-file",
    actionSummary: "Checked segment evidence.",
    touchedClaims: ["H9"], // H9 does not exist
    evidenceRefs: ["E1"],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["pause"],
  });

  assert.throws(
    () => completeTurn({ root, caseSlug, turnJson: turnPath }),
    /touched claim is not present in journal\.md: H9\. Journal claims: H1:/,
  );
});

test("run-turn: short H-tag touchedClaim resolves against new-journal content", () => {
  // The new journal has "H1: Segment missing" — pass short tag "H1"; must succeed and store full text.
  const { root, caseSlug } = createCaseWithLedger();
  const tmpJournal = writeTempJournal(UPDATED_JOURNAL_CONTENT);
  const inputPath = writeJson(root, `run-turn-htag-${Date.now()}.json`, {
    actionType: "load-file",
    actionSummary: "Checked one evidence source.",
    touchedClaims: ["H1"], // short tag
    evidenceRefs: ["E1"],
    allowedNext: ["continue-top-open", "pause"],
  });

  const result = runTurn({
    root,
    caseSlug,
    userAction: "continue-top-open",
    journalFile: tmpJournal,
    turnInputJson: inputPath,
  });

  assert.equal(result.status, "pass");
  // Resolved to the full claim text from the new journal.
  assert.deepEqual(result.event.touchedClaims, ["H1: Segment missing"]);
});

// ── Validator alignment: save-journal / run-turn / ledger-init ────────────────

test("save-journal: chat-shape-only content (heading + claim table + Resolution, no Framing/Proposed Loads/Claims sections) throws ONE error listing ALL missing sections; journal on disk untouched", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const openResult = openCase({
    root,
    caseSlug: "2026-06-10-chat-shape-save",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  const stubContent = fs.readFileSync(openResult.journalPath, "utf8");

  // Chat-shape content: has the heading, the canonical claim table, and ## Resolution,
  // but is missing ## Framing and ## Proposed Loads (the sections that verifyCaseFiles
  // and the ledger gate require that validateJournalContentForSave previously did not check).
  const chatShapeContent = `# Discovery Journal

ISSUE: ZPA users cannot reach wiki.internal
STATUS: Investigating

## Claims

| Claim | Source | Status | Next evidence needed | Timestamp | Notes |
|---|---|---|---|---|---|
| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |

## Resolution

Open.
`;
  const tmpPath = writeTempJournal(chatShapeContent);

  // Must throw exactly once with all missing markers in the message.
  let errorMessage;
  try {
    saveJournal({ root, caseSlug: "2026-06-10-chat-shape-save", contentFile: tmpPath });
    assert.fail("expected saveJournal to throw");
  } catch (err) {
    errorMessage = err.message;
  }

  // Error must name BOTH missing section markers.
  assert.match(errorMessage, /## Framing/);
  assert.match(errorMessage, /## Proposed Loads/);

  // Journal on disk must be unchanged.
  assert.equal(fs.readFileSync(openResult.journalPath, "utf8"), stubContent);
});

test("drift guard: validateJournalContentForSave's marker set is a superset of REQUIRED_JOURNAL_MARKERS", () => {
  // For every marker in REQUIRED_JOURNAL_MARKERS, a content string that includes
  // every OTHER marker (plus the claim table and the marker under test removed)
  // must be rejected by validateJournalContentForSave.
  // This directly asserts that save can never accept content the ledger gate would reject.

  const claimTableHeader = "| Claim | Source | Status | Next evidence needed | Timestamp | Notes |";
  const baseContent = [
    "# Discovery Journal",
    "",
    "## Framing",
    "",
    "| Field | Value |",
    "|---|---|",
    "| Symptom | test |",
    "",
    "## Proposed Loads",
    "",
    "- agents/investigator/prompt.md",
    "",
    "## Claims",
    "",
    claimTableHeader,
    "|---|---|---|---|---|---|",
    "| H1: Test claim | ref | Open (uncertain) | check | 2026-06-10T00:00:00Z | note |",
    "",
    "## Resolution",
    "",
    "Open.",
    "",
  ].join("\n");

  // Verify the base passes.
  assert.doesNotThrow(() => validateJournalContentForSave(baseContent));

  // Remove each REQUIRED_JOURNAL_MARKERS entry in turn — each must be rejected.
  for (const marker of REQUIRED_JOURNAL_MARKERS) {
    const withoutMarker = baseContent.replace(marker, "");
    assert.throws(
      () => validateJournalContentForSave(withoutMarker),
      new RegExp(marker.replace(/[[\](){}*+?.,\\^$|#\s]/g, "\\$&")),
      `validateJournalContentForSave should reject content missing: ${marker}`,
    );
  }
});

test("drift guard integration: content accepted by validateJournalContentForSave always passes the ledger-init journal check (end-to-end)", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const openResult = openCase({
    root,
    caseSlug: "2026-06-10-drift-guard-integration",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  recordLoads({
    root,
    caseSlug: openResult.caseSlug,
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });

  // VALID_JOURNAL_CONTENT is the minimal fixture that passes validateJournalContentForSave.
  // Saving it via save-journal and then running initialize-turn-ledger must both succeed —
  // no gap between the two predicate checks.
  const tmpPath = writeTempJournal(VALID_JOURNAL_CONTENT);

  const saveResult = saveJournal({ root, caseSlug: openResult.caseSlug, contentFile: tmpPath });
  assert.equal(saveResult.status, "pass");

  const ledgerResult = initializeTurnLedger({ root, caseSlug: openResult.caseSlug });
  assert.equal(ledgerResult.status, "pass");
});

test("run-turn: chat-shape-only journal content throws ONE error listing all missing sections; nothing persisted", () => {
  const { root, caseSlug } = createCaseWithLedger();
  const journalPath = path.join(root, "_data/cases", caseSlug, "journal.md");
  const journalBefore = fs.readFileSync(journalPath, "utf8");
  const turnStatePath = path.join(root, "_data/cases", caseSlug, "workflow/02-turn-state.json");
  const stateBefore = readJson(turnStatePath);
  const logPath = path.join(root, "_data/cases", caseSlug, "workflow/02-turns.jsonl");
  const logBefore = fs.readFileSync(logPath, "utf8");

  // Chat-shape content: has heading, claim table, Resolution but no Framing/Proposed Loads.
  const chatShapeContent = `# Discovery Journal

ISSUE: ZPA users cannot reach wiki.internal
STATUS: Investigating

## Claims

| Claim | Source | Status | Next evidence needed | Timestamp | Notes |
|---|---|---|---|---|---|
| H1: Segment missing | references/zpa/app-segments.md | Confirmed (high) | n/a | 2026-06-10T01:00:00Z | confirmed |

## Resolution

Open.
`;
  const tmpJournal = writeTempJournal(chatShapeContent);
  const inputPath = makeValidRunTurnInput(root);

  let errorMessage;
  try {
    runTurn({ root, caseSlug, userAction: "continue-top-open", journalFile: tmpJournal, turnInputJson: inputPath });
    assert.fail("expected run-turn to throw");
  } catch (err) {
    errorMessage = err.message;
  }

  // Error must name both missing sections.
  assert.match(errorMessage, /## Framing/);
  assert.match(errorMessage, /## Proposed Loads/);

  // Nothing persisted.
  assert.equal(fs.readFileSync(journalPath, "utf8"), journalBefore);
  assert.equal(readJson(turnStatePath).pendingTurn, null);
  assert.equal(readJson(turnStatePath).currentSequence, stateBefore.currentSequence);
  assert.equal(fs.readFileSync(logPath, "utf8"), logBefore);
});

// ── Change 2: archive-on-force ledger re-init ─────────────────────────────────

test("initializeTurnLedger with force archives existing ledger files to ledger-archive/<ts>/", () => {
  const { root, caseSlug } = createCaseWithLedger();

  // Run a turn so the ledger has non-genesis content.
  const t1 = beginTurn({ root, caseSlug, userAction: "continue-top-open" }).pendingTurn;
  const journalPath = path.join(root, "_data/cases", caseSlug, "journal.md");
  fs.appendFileSync(journalPath, "\nTurn update: initial evidence sweep.\n", "utf8");
  const t1Path = writeJson(root, "t1-init.json", {
    sequence: t1.sequence,
    previousHash: t1.priorLatestTurnHash,
    turnToken: t1.turnToken,
    userAction: t1.userAction,
    actionType: "load-file",
    actionSummary: "Checked initial reference.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: [],
    journalHashBefore: t1.journalHashBefore,
    allowedNext: ["continue-top-open", "pause"],
  });
  completeTurn({ root, caseSlug, turnJson: t1Path });

  // Capture file content before force re-init.
  const workflowDir = path.join(root, "_data/cases", caseSlug, "workflow");
  const logPath = path.join(workflowDir, "02-turns.jsonl");
  const statePath = path.join(workflowDir, "02-turn-state.json");
  const logBefore = fs.readFileSync(logPath, "utf8");
  const stateBefore = fs.readFileSync(statePath, "utf8");

  // Re-init with force — must archive, not overwrite.
  const result = initializeTurnLedger({ root, caseSlug, force: true });
  assert.equal(result.status, "pass");

  // New ledger files must be fresh (genesis only).
  const newLog = fs.readFileSync(logPath, "utf8");
  const newState = readJson(statePath);
  assert.notEqual(newLog, logBefore, "log should be reset to genesis");
  assert.equal(newState.currentSequence, 0, "sequence should restart at 0");

  // Archive dir must exist with at least one timestamped subdirectory.
  const archiveDir = path.join(workflowDir, "ledger-archive");
  assert.ok(fs.existsSync(archiveDir), "ledger-archive/ must exist");
  const entries = fs.readdirSync(archiveDir, { withFileTypes: true });
  const subdirs = entries.filter((e) => e.isDirectory());
  assert.equal(subdirs.length, 1, "exactly one archive subdirectory expected");

  // The archived files must contain the prior content.
  const archivePath = path.join(archiveDir, subdirs[0].name);
  assert.equal(
    fs.readFileSync(path.join(archivePath, "02-turns.jsonl"), "utf8"),
    logBefore,
  );
  assert.equal(
    fs.readFileSync(path.join(archivePath, "02-turn-state.json"), "utf8"),
    stateBefore,
  );
});

test("caseStatus reports archivedGenerations 0 when no archive dir exists", () => {
  const { root, caseSlug } = createCaseWithLedger();
  const result = caseStatus({ root, caseSlug });
  assert.equal(result.ledger.archivedGenerations, 0, "archivedGenerations should be 0");
  const hasWarning = (result.nextActions || []).some((a) =>
    a.includes("archived ledger"),
  );
  assert.ok(!hasWarning, "should have no archived-ledger nextActions warning");
});

test("caseStatus reports archivedGenerations > 0 and nextActions warning after force re-init", () => {
  const { root, caseSlug } = createCaseWithLedger();

  // Force re-init to create one archive generation.
  initializeTurnLedger({ root, caseSlug, force: true });

  const result = caseStatus({ root, caseSlug });
  assert.equal(result.ledger.archivedGenerations, 1, "archivedGenerations should be 1");
  const hasWarning = (result.nextActions || []).some((a) =>
    a.includes("archived ledger"),
  );
  assert.ok(hasWarning, "nextActions must contain an archived-ledger warning");
});

// ── Change 3: evidence-gated claim-status transition gate ─────────────────────

test("run-turn: replay attack — Confirmed (high) flip with empty evidenceRefs is rejected", () => {
  const { root, caseSlug } = createCaseWithLedger();

  const journalContent = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H1: Segment missing | references/zpa/app-segments.md | Confirmed (high) | n/a | 2026-06-10T01:00:00Z | invented |",
  ) + "\nTurn update: fabricated confirmation.\n";

  const tmpJournal = writeTempJournal(journalContent);
  const inputPath = writeJson(root, "attack-input.json", {
    actionType: "load-file",
    actionSummary: "Invented confirmation.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: [],
    allowedNext: ["pause"],
  });

  assert.throws(
    () => runTurn({ root, caseSlug, userAction: "continue-top-open", journalFile: tmpJournal, turnInputJson: inputPath }),
    /require recorded evidence/,
  );
});

test("run-turn: Confirmed (high) flip WITH verifiable prior evidenceRef passes", () => {
  const { root, caseSlug } = createCaseWithLedger();

  // First turn: record the ref WITHOUT transitioning the status.
  const e1Journal = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check connector group | 2026-06-10T01:00:00Z | evidence-recorded |",
  ) + "\nTurn update: evidence file loaded.\n";
  const tmpE1 = writeTempJournal(e1Journal);
  const inputE1 = writeJson(root, "e1-input.json", {
    actionType: "record-user-evidence",
    actionSummary: "Loaded supporting evidence.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: ["_data/cases/example/evidence/confirm.md"],
    allowedNext: ["record-user-evidence", "continue-top-open", "pause"],
  });
  const e1Result = runTurn({ root, caseSlug, userAction: "record-user-evidence", journalFile: tmpE1, turnInputJson: inputE1 });
  assert.equal(e1Result.status, "pass");

  // Second turn: transition is now verifiable because ref is in priorEvidenceRefs(events).
  const confirmedJournal = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H1: Segment missing | references/zpa/app-segments.md | Confirmed (high) | n/a | 2026-06-10T02:00:00Z | confirmed |",
  ).replace("Open.", "Resolved.") + "\nTurn update: confirmed by evidence.\n";
  const tmpConfirmed = writeTempJournal(confirmedJournal);
  const inputConfirmed = writeJson(root, "confirmed-input.json", {
    actionType: "record-user-evidence",
    actionSummary: "Confirmed based on loaded evidence.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: ["_data/cases/example/evidence/confirm.md"],
    allowedNext: ["mark-resolved", "pause"],
  });
  const confirmedResult = runTurn({ root, caseSlug, userAction: "record-user-evidence", journalFile: tmpConfirmed, turnInputJson: inputConfirmed });
  assert.equal(confirmedResult.status, "pass");
});

test("run-turn: Ruled out flip with empty evidenceRefs is rejected", () => {
  const { root, caseSlug } = createCaseWithLedger();

  const journalContent = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H1: Segment missing | references/zpa/app-segments.md | Ruled out | n/a | 2026-06-10T01:00:00Z | invented |",
  ) + "\nTurn update: fabricated ruled-out.\n";
  const tmpJournal = writeTempJournal(journalContent);
  const inputPath = writeJson(root, "ruled-out-input.json", {
    actionType: "load-file",
    actionSummary: "Invented ruled-out.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: [],
    allowedNext: ["pause"],
  });

  assert.throws(
    () => runTurn({ root, caseSlug, userAction: "continue-top-open", journalFile: tmpJournal, turnInputJson: inputPath }),
    /require recorded evidence/,
  );
});

test("run-turn: Open (uncertain) to Open (likely) without evidenceRefs is rejected", () => {
  // Need a case with Open (likely) as the new status — use a custom journal.
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const openResult = openCase({
    root,
    caseSlug: `2026-06-12-likely-gate-${Date.now()}`,
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  const caseSlug = openResult.caseSlug;

  // Build a journal with Open (likely) status.
  const initialContent = `# Discovery Journal

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
| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |

## Resolution

Open.
`;
  const initTmpPath = writeTempJournal(initialContent);
  saveJournal({ root, caseSlug, contentFile: initTmpPath });
  recordLoads({
    root,
    caseSlug,
    loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
    deferred: [],
    allowAdditional: false,
    force: false,
  });
  initializeTurnLedger({ root, caseSlug });

  const likelyJournal = initialContent.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H1: Segment missing | references/zpa/app-segments.md | Open (likely) | Confirm next | 2026-06-10T01:00:00Z | upgraded |",
  ) + "\nTurn update: upgraded without evidence.\n";
  const tmpJournal = writeTempJournal(likelyJournal);
  const inputPath = writeJson(root, "likely-input.json", {
    actionType: "load-file",
    actionSummary: "Upgraded to likely without evidence.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: [],
    allowedNext: ["pause"],
  });

  assert.throws(
    () => runTurn({ root, caseSlug, userAction: "continue-top-open", journalFile: tmpJournal, turnInputJson: inputPath }),
    /upgrading a hypothesis to likely requires recorded evidence/,
  );
});

test("run-turn: downgrade to Stale passes without evidenceRefs (exempt status)", () => {
  const { root, caseSlug } = createCaseWithLedger();

  const staleJournal = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H1: Segment missing | references/zpa/app-segments.md | Stale | Needs refresh | 2026-06-10T01:00:00Z | deprioritized |",
  ) + "\nTurn update: deprioritized stale claim.\n";
  const tmpJournal = writeTempJournal(staleJournal);
  const inputPath = writeJson(root, "stale-input.json", {
    actionType: "load-file",
    actionSummary: "Marked claim stale.",
    touchedClaims: ["H1: Segment missing"],
    evidenceRefs: [],
    allowedNext: ["continue-top-open", "pause"],
  });

  const result = runTurn({ root, caseSlug, userAction: "continue-top-open", journalFile: tmpJournal, turnInputJson: inputPath });
  assert.equal(result.status, "pass");
});

// ── Change 3: initial journal gate (save-journal / initialize-turn-ledger) ────

test("save-journal: first save with Confirmed (high) claim is rejected (initial journal gate)", () => {
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
    caseSlug: "2026-06-12-initial-journal-gate",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  const preResolvedContent = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H1: Segment missing | references/zpa/app-segments.md | Confirmed (high) | n/a | 2026-06-10T00:00:00Z | invented |",
  );
  const tmpPath = writeTempJournal(preResolvedContent);

  assert.throws(
    () => saveJournal({ root, caseSlug: "2026-06-12-initial-journal-gate", contentFile: tmpPath }),
    /initial journal cannot contain resolved\/confirmed\/ruled-out claims/,
  );
});

test("save-journal: second save (overwrite) with Confirmed (high) claim is rejected outside a turn", () => {
  // save-journal blocks terminal claim statuses on ALL calls outside an active pendingTurn,
  // not only the initial journal.  Evidence-gated transitions must go through run-turn or
  // begin/complete-turn.
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
    caseSlug: "2026-06-12-overwrite-gate",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });

  const tmpPath1 = writeTempJournal(VALID_JOURNAL_CONTENT);
  saveJournal({ root, caseSlug: "2026-06-12-overwrite-gate", contentFile: tmpPath1 });

  const confirmedContent = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H1: Segment missing | references/zpa/app-segments.md | Confirmed (high) | n/a | 2026-06-10T01:00:00Z | confirmed |",
  );
  const tmpPath2 = writeTempJournal(confirmedContent);

  // Second save must ALSO throw — the gate applies to all save-journal calls outside a turn.
  assert.throws(
    () => saveJournal({ root, caseSlug: "2026-06-12-overwrite-gate", contentFile: tmpPath2 }),
    /save-journal outside an active turn cannot introduce terminal claim statuses/,
  );
});

test("initialize-turn-ledger: journal with Confirmed (high) claim is rejected by initial-journal gate", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const openResult = openCase({
    root,
    caseSlug: "2026-06-12-ledger-init-gate",
    framingJson: framingPath,
    proposedLoads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
  });
  const caseSlug = openResult.caseSlug;

  recordMinimalLoads(root, caseSlug);

  const preResolvedContent = VALID_JOURNAL_CONTENT.replace(
    "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
    "| H1: Segment missing | references/zpa/app-segments.md | Confirmed (high) | n/a | 2026-06-10T00:00:00Z | invented |",
  );
  const tmpPath = writeTempJournal(preResolvedContent);

  assert.throws(
    () => initializeTurnLedger({ root, caseSlug, journalFile: tmpPath }),
    /initial journal cannot contain resolved\/confirmed\/ruled-out claims/,
  );
});
