import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { openCase, verifyCaseFiles } from "./investigator-artifacts.mjs";

function tempRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-skill-test-"));
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

test("openCase blocks speculative log-schema loads without log framing", () => {
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
      "references/zia/logs/web-insights-schema.md",
    ],
  });

  assert.equal(result.status, "blocked");
  assert.match(result.blockingIssues.join(" "), /log-schema proposed loads require/);

  const caseIntakeMd = fs.readFileSync(
    path.join(root, "_data/cases/2026-05-17-zia-payroll/case-intake.md"),
    "utf8",
  );
  assert.match(caseIntakeMd, /^Status: blocked$/m);
});

test("openCase allows log-schema loads when evidence is in framing", () => {
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
      "references/zpa/logs/app-connector-status-schema.md",
    ],
  });

  assert.equal(result.status, "pass");
});
