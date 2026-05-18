import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  abandonTurn,
  beginTurn,
  completeTurn,
  initializeTurnLedger,
  openCase,
  verifyCaseFiles,
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
  return { root, caseSlug: result.caseSlug, journalPath: result.journalPath };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
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
    /journal\.md missing claim table header/,
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

test("completeTurn allows mark-resolved when completion gate is satisfied", () => {
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

  const completed = completeTurn({ root, caseSlug, turnJson: turnPath });
  assert.equal(completed.event.actionType, "mark-resolved");
});
