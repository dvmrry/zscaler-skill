#!/usr/bin/env node
/** Static regression guards for high-risk product routing and API boundaries. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPTS_DIR, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

function markdownSection(content, startHeading, endHeading) {
  const start = content.indexOf(startHeading);
  assert.notEqual(start, -1, `missing section ${startHeading}`);
  const end = content.indexOf(endHeading, start + startHeading.length);
  assert.notEqual(end, -1, `missing section boundary ${endHeading}`);
  return content.slice(start, end);
}

test("root and runtime routers retain current SDK accessors", () => {
  const skill = read("SKILL.md");
  const prompt = read("agents/zscaler/prompt.md");
  const runbooks = read("references/_meta/runbooks.md");
  const terminology = read("references/shared/terminology.md");

  for (const accessor of [
    "client.ztw",
    "client.zid.api_client",
    "client.aiguard",
    "client.zms",
    "client.zeasm",
    "client.zcell",
    "client.zbi",
  ]) {
    assert.ok(skill.includes(accessor), `SKILL.md missing ${accessor}`);
  }

  assert.doesNotMatch(skill, /client\.zid\.api_clients/);
  assert.doesNotMatch(skill, /Python SDK has NO coverage/);
  assert.doesNotMatch(skill, /Go has full CRUD/);
  assert.doesNotMatch(skill, /API Client creation is NOT exposed via API/);
  assert.match(skill, /first\*\* client is a portal bootstrap/);
  assert.match(skill, /Resource Servers are read-only in \*\*both\*\* Python and Go/);
  assert.match(skill, /2\.0\.0bN.*does \*\*not\*\* include ZTW/);
  assert.doesNotMatch(runbooks, /client\.zaiguard/);
  assert.match(runbooks, /Python `client\.aiguard` exposes configuration reads and writes/);
  assert.doesNotMatch(terminology, /SDK module is `zbi`/);
  assert.doesNotMatch(terminology, /Business Insights.*No API surface/);
  assert.match(terminology, /Business Insights.*Python `client\.zbi`/);
  assert.match(terminology, /Zscaler Cellular.*read-only MCP layer/);

  for (const directory of [
    "ai-security/",
    "zms/",
    "easm/",
    "zscaler-cellular/",
    "business-insights/",
  ]) {
    assert.ok(prompt.includes(`\`${directory}\``), `runtime prompt missing ${directory}`);
  }
});

test("portfolio keeps all seven programmable-shallow products in Tier 2", () => {
  const portfolio = read("references/_meta/portfolio-map.md");
  const tier2 = markdownSection(portfolio, "## Tier 2", "## Tier 3");
  const tier3 = markdownSection(portfolio, "## Tier 3", "## Tier 4");

  assert.match(tier2, /Programmable but shallow \(7 products\)/);
  for (const product of ["ZBI", "ZWA", "AI Guard", "ZMS", "EASM", "ZCell", "Business Insights"]) {
    assert.ok(tier2.includes(`**${product}`), `Tier 2 missing ${product}`);
  }
  assert.doesNotMatch(tier3, /#### Business Insights/);
  assert.doesNotMatch(tier3, /#### Zscaler Cellular/);
  assert.match(portfolio, /singular `client\.zid\.api_client`/);
  assert.match(portfolio, /v1\.x GA `client\.ztw\.\*`/);
  assert.doesNotMatch(portfolio, /SDK module is `zbi`/);
  assert.match(portfolio, /Python `client\.zbi` is not this product/);
});

test("malware and ATP docs preserve the settings-versus-transaction boundary", () => {
  const activeSurfaces = [
    "SKILL.md",
    "README.md",
    "docs/maintenance.md",
    "references/zia/sandbox.md",
  ].map(read);

  for (const surface of activeSurfaces) {
    assert.doesNotMatch(surface, /Malware Protection and ATP (?:blocks )?have no API coverage/i);
  }

  const sandbox = read("references/zia/sandbox.md");
  assert.match(sandbox, /client\.zia\.atp_policy/);
  assert.match(sandbox, /client\.zia\.malware_protection_policy/);
  assert.match(sandbox, /No transaction-verdict endpoint/);
  assert.match(sandbox, /Web Insights/);
});

test("Cloud Connector guide exposes exactly the four captured DNS-rule actions", () => {
  const guide = read("docs/cloud-connector/guide.html");
  const actions = guide.slice(
    guide.indexOf("<h4>DNS Policy actions</h4>"),
    guide.indexOf("<h4>DoH and DNS tunnel detection</h4>"),
  );

  assert.equal([...actions.matchAll(/<tr><td>/g)].length, 4);
  for (const label of ["Allow", "Block", "Resolved by ZPA", "Redirect"]) {
    assert.ok(actions.includes(`<tr><td>${label}</td>`), `DNS guide missing ${label}`);
  }
  assert.doesNotMatch(actions, /<tr><td>Overwrite DNS response<\/td>/);
  for (const action of ["ALLOW", "BLOCK", "REDIR_ZPA", "REDIR_REQ"]) {
    assert.ok(actions.includes(`<code>${action}</code>`), `DNS guide missing enum ${action}`);
  }
});

test("snapshot and ZPA enum prose reflect the current source-derived guides", () => {
  assert.doesNotMatch(read("README.md"), /Snapshot schema docs are deferred/);
  assert.doesNotMatch(read("docs/maintenance.md"), /Snapshot schema docs are deferred/);

  const precedence = read("references/zpa/policy-precedence.md");
  assert.doesNotMatch(precedence, /19-value/);
  assert.match(precedence, /including `CHROME_POSTURE_PROFILE`/);
});

test("behavioral eval suite pins the five semantic-consistency answer shapes", () => {
  const contract = JSON.parse(read("references/_meta/evals/evals.json"));
  const ids = contract.evals.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length, "eval IDs must be unique");
  for (const id of [27, 28, 29, 30, 31]) {
    const entry = contract.evals.find((candidate) => candidate.id === id);
    assert.ok(entry, `missing semantic-consistency eval ${id}`);
    assert.equal(entry.tenant_data_required, false);
    assert.equal(entry.expected_confidence, "high");
    assert.ok(entry.assertions.length >= 6, `eval ${id} needs falsifiable assertions`);
    assert.ok(entry.must_not_say.length >= 3, `eval ${id} needs adversarial traps`);
  }
});
