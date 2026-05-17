import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { openCase, verifyCaseFiles } from "./investigator-artifacts.mjs";

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
