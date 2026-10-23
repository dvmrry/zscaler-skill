import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const config = JSON.parse(
  fs.readFileSync(new URL("../renovate.json", import.meta.url), "utf8"),
);

test("the ZIA provider requires individual dashboard approval", () => {
  const baseRuleIndex = config.packageRules.findIndex(
    (rule) =>
      rule.matchManagers?.includes("git-submodules") &&
      rule.groupName === "Zscaler upstream submodules",
  );
  const approvalRuleIndex = config.packageRules.findIndex(
    (rule) =>
      rule.matchManagers?.includes("git-submodules") &&
      rule.dependencyDashboardApproval === true,
  );

  assert.notEqual(baseRuleIndex, -1, "missing the default grouped-submodule rule");
  assert.notEqual(approvalRuleIndex, -1, "missing the dashboard-approval rule");
  assert.ok(
    approvalRuleIndex > baseRuleIndex,
    "the approval rule must follow and override the grouped-submodule rule",
  );

  const approvalRule = config.packageRules[approvalRuleIndex];
  assert.equal(approvalRule.groupName, null);
  assert.equal(approvalRule.commitMessageTopic, "{{{depName}}}");
  // Only the ZIA provider waits for approval, so it is pinned at a released tag; the vendored modules are read,
  // never run, so they follow the grouped bump like every other source.
  assert.deepEqual(new Set(approvalRule.matchDepNames), new Set(["vendor/terraform-provider-zia"]));
});
