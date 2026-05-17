import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createReport, verifyReportFiles } from "./investigator-artifacts.mjs";

function tempRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-skill-test-"));
}

function writeJson(root, name, value) {
  const target = path.join(root, name);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return target;
}

test("createReport creates passing report, JSON, and journal artifacts", () => {
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

  const result = createReport({
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

  const verified = verifyReportFiles(root, "2026-05-17-zpa-wiki");
  assert.ok(fs.existsSync(verified.reportPath));
  assert.ok(fs.existsSync(verified.reportJsonPath));
  assert.ok(fs.existsSync(verified.journalPath));

  const reportMd = fs.readFileSync(verified.reportPath, "utf8");
  assert.match(reportMd, /^Status: pass$/m);
  assert.match(reportMd, /^Blocking Issues: none$/m);
});

test("createReport blocks speculative log-schema loads without log framing", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZIA block page appears for payroll site",
    tenantCloud: "zs1",
    products: ["zia"],
    scope: "one user",
  });

  const result = createReport({
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

  const reportMd = fs.readFileSync(
    path.join(root, "_data/cases/2026-05-17-zia-payroll/workflow-zscaler-investigator-report.md"),
    "utf8",
  );
  assert.match(reportMd, /^Status: blocked$/m);
});

test("createReport allows log-schema loads when evidence is in framing", () => {
  const root = tempRepo();
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "LSS logs show empty connector field",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
    evidencePaths: ["_data/cases/example/evidence/lss.csv"],
  });

  const result = createReport({
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
