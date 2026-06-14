# @zscaler intent router — Increment 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `@zscaler`'s prose routing into a structured, lintable capability registry that drives intent-aware, state-carrying hand-offs, with the AGENTS.md routing block auto-generated from it.

**Architecture:** A JSON registry (`agents/_meta/capability-registry.json`) holds routing-only data per internal role (`workflowId` + structured intent signals + a hand-off capsule schema); command/path/required-reads are *derived* from each role's `agents/<role>/workflow.md` (reusing `check-workflow-metadata.mjs`'s frontmatter parser — no copied metadata). A validator gates the registry; a generator emits a marked routing block into AGENTS.md. `@zscaler` stays prompt-scaffolding — its workflow gains a registry-consult + capsule hand-off discipline. The actual intent classification is the LLM applying the registry's structured signals (no classifier built).

**Tech Stack:** Node.js ESM `.mjs`, `node:test`, **zero dependencies** (registry is JSON via stdlib `JSON.parse` — deliberately NOT YAML: the repo has no `package.json`/YAML dep, and we will not hand-roll a YAML parser; the human-readable view is the generated AGENTS.md block).

**Spec:** [docs/superpowers/specs/2026-06-14-zscaler-intent-router-design.md](../specs/2026-06-14-zscaler-intent-router-design.md). This plan refines the v2 spec on four points: (1) internal entries use `workflowId`, not copied `where`/`review`/`owner`; (2) JSON, not YAML; (3) AGENTS.md marked-block generation; (4) per-entry capsule schema.

**Scope:** Internal roles only, all `engageHow: "suggest"`. External-owner overlay = Increment 2 (out of scope). No `load`/`invoke` (Increments 3/4).

---

### Task 1: Reuse the frontmatter parser + registry load/resolve

**Files:**
- Modify: `scripts/check-workflow-metadata.mjs` (export `parseFrontmatter`, `workflowFiles`)
- Create: `scripts/capability-registry.mjs`
- Test: `scripts/capability-registry.test.mjs`

- [ ] **Step 1: Export the existing parser** — in `scripts/check-workflow-metadata.mjs`, change `function parseFrontmatter(` to `export function parseFrontmatter(`. (No behavior change; it's already defined there. We reuse the proven parser rather than re-implement it. We do NOT depend on `workflowFiles()` — the resolver self-discovers, below, to stay robust to that helper's signature.)

- [ ] **Step 2: Write the failing test** (`scripts/capability-registry.test.mjs`):

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { loadRegistry, resolveWorkflow } from "./capability-registry.mjs";

function tmpRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cap-reg-"));
  fs.mkdirSync(path.join(root, "agents", "auditor"), { recursive: true });
  fs.mkdirSync(path.join(root, "agents", "_meta"), { recursive: true });
  fs.writeFileSync(path.join(root, "agents", "auditor", "workflow.md"),
    "---\nid: z-auditor\nprimary-command: /z-auditor\nrequired-reads:\n  - agents/auditor/prompt.md\n---\n# body\n");
  fs.writeFileSync(path.join(root, "agents", "_meta", "capability-registry.json"),
    JSON.stringify({ entries: [{ id: "auditor", kind: "internal-role", workflowId: "z-auditor",
      intent: { requiredSignals: [], cueSignals: ["audit", "hygiene"], negativeSignals: [], examples: ["audit the zpa refs"], threshold: "any-cue" },
      capsule: { fields: ["scope"], wording: "Auditing {scope}" }, engageHow: "suggest", lastVerified: "2026-06-14", authorStatus: "reviewed" }] }));
  return root;
}

test("loadRegistry parses entries", () => {
  const reg = loadRegistry(tmpRepo());
  assert.equal(reg.entries.length, 1);
  assert.equal(reg.entries[0].workflowId, "z-auditor");
});

test("resolveWorkflow derives command + required-reads from the role workflow (no copied metadata)", () => {
  const root = tmpRepo();
  const r = resolveWorkflow(root, "z-auditor");
  assert.equal(r.primaryCommand, "/z-auditor");
  assert.equal(r.workflowPath, "agents/auditor/workflow.md");
  assert.deepEqual(r.requiredReads, ["agents/auditor/prompt.md"]);
});

test("resolveWorkflow returns null for an unknown workflowId", () => {
  assert.equal(resolveWorkflow(tmpRepo(), "z-nonexistent"), null);
});
```

- [ ] **Step 3: Run test to verify it fails** — `node --test scripts/capability-registry.test.mjs` → FAIL (`Cannot find module ./capability-registry.mjs`).

- [ ] **Step 4: Implement** (`scripts/capability-registry.mjs`):

```js
// scripts/capability-registry.mjs
//
// Loads the capability registry (routing-only data) and resolves each internal
// entry's command/path/required-reads from the role's workflow.md — never copies
// that metadata into the registry. Zero-dependency (JSON + the shared frontmatter
// parser). The registry drives @zscaler routing + the generated AGENTS.md block.
import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "./check-workflow-metadata.mjs";

export const REGISTRY_PATH = "agents/_meta/capability-registry.json";

export function loadRegistry(root) {
  const file = path.join(root, REGISTRY_PATH);
  const reg = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!reg || !Array.isArray(reg.entries)) throw new Error("capability-registry: missing entries[]");
  return reg;
}

/**
 * Resolve an internal role's workflow by its frontmatter `id` (self-discovers
 * agents/<role>/workflow.md — does not depend on workflowFiles()). Returns
 * { workflowPath, primaryCommand, requiredReads } or null. Derives everything
 * from the workflow file — single source of truth, no copied metadata.
 */
export function resolveWorkflow(root, workflowId) {
  const agentsDir = path.join(root, "agents");
  if (!fs.existsSync(agentsDir)) return null;
  for (const ent of fs.readdirSync(agentsDir, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const wf = path.join(agentsDir, ent.name, "workflow.md");
    if (!fs.existsSync(wf)) continue;
    const parsed = parseFrontmatter(wf, []);
    if (!parsed || parsed.data.id !== workflowId) continue;
    return {
      workflowPath: path.relative(root, wf).split(path.sep).join("/"),
      primaryCommand: parsed.data["primary-command"] || null,
      requiredReads: parsed.data["required-reads"] || [],
    };
  }
  return null;
}
```

> NOTE: `parseFrontmatter(filePath, findingsArray)` returns `{ data, body }` (or null on malformed frontmatter), where `data` holds the frontmatter keys verbatim — `data["primary-command"]` (string), `data["required-reads"]` (list). We pass a throwaway `[]` for findings.

- [ ] **Step 5: Run test to verify it passes** — `node --test scripts/capability-registry.test.mjs` → PASS (3 tests). If `workflowFiles`/`parseFrontmatter` signatures differ, fix the adapter in Step 4 until green.

- [ ] **Step 6: Commit**

```bash
git add scripts/check-workflow-metadata.mjs scripts/capability-registry.mjs scripts/capability-registry.test.mjs
git commit -m "feat(router): capability registry load + workflow resolution (derive, don't copy)"
```

---

### Task 2: Registry validator (gate)

**Files:**
- Create: `scripts/check-capability-registry.mjs`
- Modify: `scripts/check-capability-registry.mjs` is added to `scripts/check-fast.mjs` CHECKS
- Test: `scripts/check-capability-registry.test.mjs`

- [ ] **Step 1: Write the failing test** (`scripts/check-capability-registry.test.mjs`):

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateRegistry } from "./check-capability-registry.mjs";

function repo(entry) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cap-val-"));
  fs.mkdirSync(path.join(root, "agents", "auditor"), { recursive: true });
  fs.mkdirSync(path.join(root, "agents", "_meta"), { recursive: true });
  fs.writeFileSync(path.join(root, "agents", "auditor", "workflow.md"),
    "---\nid: z-auditor\nprimary-command: /z-auditor\nrequired-reads:\n  - agents/auditor/prompt.md\n---\n#\n");
  fs.writeFileSync(path.join(root, "agents", "_meta", "capability-registry.json"), JSON.stringify({ entries: [entry] }));
  return root;
}
const ok = {
  id: "auditor", kind: "internal-role", workflowId: "z-auditor",
  intent: { requiredSignals: [], cueSignals: ["audit"], negativeSignals: [], examples: ["audit refs"], threshold: "any-cue" },
  capsule: { fields: ["scope"], wording: "Auditing {scope}" }, engageHow: "suggest", lastVerified: "2026-06-14", authorStatus: "reviewed",
};

test("valid internal entry passes", () => {
  assert.deepEqual(validateRegistry(repo(ok)), []);
});
test("workflowId that does not resolve is an error", () => {
  const errs = validateRegistry(repo({ ...ok, workflowId: "z-ghost" }));
  assert.ok(errs.some((e) => /workflowId.*z-ghost.*resolve/i.test(e)));
});
test("missing intent cues and required signals is an error", () => {
  const errs = validateRegistry(repo({ ...ok, intent: { requiredSignals: [], cueSignals: [], negativeSignals: [], examples: [], threshold: "any-cue" } }));
  assert.ok(errs.some((e) => /intent/i.test(e)));
});
test("missing capsule fields or lastVerified is an error", () => {
  assert.ok(validateRegistry(repo({ ...ok, capsule: { fields: [], wording: "" } })).some((e) => /capsule/i.test(e)));
  assert.ok(validateRegistry(repo({ ...ok, lastVerified: undefined })).some((e) => /lastVerified/i.test(e)));
});
```

- [ ] **Step 2: Run test to verify it fails** — `node --test scripts/check-capability-registry.test.mjs` → FAIL (module missing).

- [ ] **Step 3: Implement** (`scripts/check-capability-registry.mjs`):

```js
#!/usr/bin/env node
// Validates agents/_meta/capability-registry.json: schema, workflowId resolves,
// intent is routable, capsule + provenance present. Run by check-fast.
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { loadRegistry, resolveWorkflow } from "./capability-registry.mjs";

export function validateRegistry(root) {
  const errors = [];
  let reg;
  try { reg = loadRegistry(root); } catch (e) { return [e.message]; }
  for (const e of reg.entries) {
    const id = e.id || "(no id)";
    if (e.kind !== "internal-role") continue; // external entries are Increment 2
    if (!e.workflowId || !resolveWorkflow(root, e.workflowId)) {
      errors.push(`entry ${id}: workflowId "${e.workflowId}" does not resolve to a workflow.md with that id`);
    }
    const intent = e.intent || {};
    const hasSignals = (intent.requiredSignals || []).length > 0 || (intent.cueSignals || []).length > 0;
    if (!hasSignals) errors.push(`entry ${id}: intent must have requiredSignals or cueSignals`);
    if (!(intent.examples || []).length) errors.push(`entry ${id}: intent.examples must be non-empty`);
    if (!["all-required", "any-cue", "n-of"].includes(intent.threshold)) errors.push(`entry ${id}: intent.threshold invalid`);
    const capsule = e.capsule || {};
    if (!(capsule.fields || []).length) errors.push(`entry ${id}: capsule.fields must be non-empty`);
    if (!capsule.wording) errors.push(`entry ${id}: capsule.wording required`);
    if (!e.lastVerified) errors.push(`entry ${id}: lastVerified required`);
    if (e.engageHow !== "suggest") errors.push(`entry ${id}: engageHow must be "suggest" in Increment 1`);
  }
  return errors;
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const errors = validateRegistry(root);
  if (errors.length) { console.error("capability-registry errors:"); for (const e of errors) console.error(`  - ${e}`); process.exit(1); }
  console.log("capability-registry: valid");
}
```

- [ ] **Step 4: Run test to verify it passes** — `node --test scripts/check-capability-registry.test.mjs` → PASS (4 tests).

- [ ] **Step 5: Wire into check-fast** — in `scripts/check-fast.mjs` CHECKS array, add:

```js
  { name: "capability registry", command: "node", args: ["scripts/check-capability-registry.mjs"] },
```

- [ ] **Step 6: Commit**

```bash
git add scripts/check-capability-registry.mjs scripts/check-capability-registry.test.mjs scripts/check-fast.mjs
git commit -m "feat(router): capability-registry validator wired into check-fast"
```

---

### Task 3: AGENTS.md routing-block generator (marked block + in-sync check)

**Files:**
- Modify: `scripts/capability-registry.mjs` (add `renderRoutingBlock`)
- Create: `scripts/gen-capability-routing.mjs` (writes the block; `--check` verifies in-sync)
- Test: `scripts/capability-registry.test.mjs` (append)

- [ ] **Step 1: Write the failing test** (append to `scripts/capability-registry.test.mjs`):

```js
import { renderRoutingBlock } from "./capability-registry.mjs";

test("renderRoutingBlock emits a marked block with derived command", () => {
  const block = renderRoutingBlock(tmpRepo());
  assert.match(block, /<!-- capability-routing:start -->/);
  assert.match(block, /<!-- capability-routing:end -->/);
  assert.match(block, /\/z-auditor/);          // derived primary-command
  assert.match(block, /audit/);                // a cue signal
});
```

- [ ] **Step 2: Run** — `node --test scripts/capability-registry.test.mjs` → FAIL (`renderRoutingBlock` undefined).

- [ ] **Step 3: Implement `renderRoutingBlock`** (append to `scripts/capability-registry.mjs`):

```js
export const ROUTING_START = "<!-- capability-routing:start -->";
export const ROUTING_END = "<!-- capability-routing:end -->";

/** Render the AGENTS.md routing block from the registry (derives command from workflow.md). */
export function renderRoutingBlock(root) {
  const reg = loadRegistry(root);
  const lines = [ROUTING_START, "", "<!-- GENERATED from agents/_meta/capability-registry.json — do not edit by hand. -->", ""];
  for (const e of reg.entries) {
    if (e.kind !== "internal-role") continue;
    const wf = resolveWorkflow(root, e.workflowId);
    const cmd = wf ? wf.primaryCommand : `(unresolved: ${e.workflowId})`;
    const cues = [...(e.intent.requiredSignals || []), ...(e.intent.cueSignals || [])].join(", ");
    lines.push(`- ${cmd} — ${cues}`);
  }
  lines.push("", ROUTING_END);
  return lines.join("\n");
}
```

- [ ] **Step 4: Run** — PASS.

- [ ] **Step 5: Implement the writer/checker** (`scripts/gen-capability-routing.mjs`):

```js
#!/usr/bin/env node
// Writes (or --check verifies) the capability-routing marked block in AGENTS.md.
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { renderRoutingBlock, ROUTING_START, ROUTING_END } from "./capability-registry.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const agentsPath = path.join(root, "AGENTS.md");
const check = process.argv.includes("--check");

const block = renderRoutingBlock(root);
const text = fs.readFileSync(agentsPath, "utf8");
const re = new RegExp(`${ROUTING_START}[\\s\\S]*?${ROUTING_END}`);
if (!re.test(text)) {
  console.error(`AGENTS.md is missing the ${ROUTING_START} / ${ROUTING_END} markers. Add them once, then re-run.`);
  process.exit(1);
}
const updated = text.replace(re, block);
if (check) {
  if (updated !== text) { console.error("AGENTS.md routing block is out of sync — run: node scripts/gen-capability-routing.mjs"); process.exit(1); }
  console.log("AGENTS.md routing block in sync");
} else {
  fs.writeFileSync(agentsPath, updated);
  console.log("AGENTS.md routing block regenerated");
}
```

- [ ] **Step 6: Commit**

```bash
git add scripts/capability-registry.mjs scripts/gen-capability-routing.mjs scripts/capability-registry.test.mjs
git commit -m "feat(router): generate AGENTS.md routing block from the registry (marked, --check)"
```

---

### Task 4: Author the registry data + wire AGENTS.md

**Files:**
- Create: `agents/_meta/capability-registry.json`
- Modify: `AGENTS.md` (insert the marker pair where the prose route list is, then generate)
- Modify: `scripts/check-fast.mjs` (add the `--check` for the AGENTS block)

- [ ] **Step 1: Author `agents/_meta/capability-registry.json`** — one `internal-role` entry per role, intent migrated from `agents/zscaler/prompt.md`'s escalation grammar. Two full worked examples (encode the rest the same way using each role's `prompt.md`/`workflow.md` summary):

```json
{
  "entries": [
    {
      "id": "investigator",
      "kind": "internal-role",
      "workflowId": "z-investigator",
      "intent": {
        "requiredSignals": ["symptom", "affected-scope", "timeframe"],
        "cueSignals": ["why is", "broken", "failing", "intermittent", "regression"],
        "negativeSignals": ["how do I set up", "audit", "review posture"],
        "examples": ["zpa app X intermittently fails for site Y since tuesday"],
        "threshold": "all-required"
      },
      "capsule": { "fields": ["symptom", "scope", "timeframe", "known_context", "missing_info"],
        "wording": "Investigating: symptom={symptom}; scope={scope}; since={timeframe}. Known: {known_context}. Still needed: {missing_info}." },
      "engageHow": "suggest", "lastVerified": "2026-06-14", "authorStatus": "reviewed"
    },
    {
      "id": "auditor",
      "kind": "internal-role",
      "workflowId": "z-auditor",
      "intent": {
        "requiredSignals": [],
        "cueSignals": ["audit", "hygiene", "lint the refs", "structural review", "reference quality"],
        "negativeSignals": ["why is", "broken", "posture", "threat"],
        "examples": ["audit the zpa reference docs for drift"],
        "threshold": "any-cue"
      },
      "capsule": { "fields": ["scope", "known_context"],
        "wording": "Auditing scope={scope}. Context: {known_context}." },
      "engageHow": "suggest", "lastVerified": "2026-06-14", "authorStatus": "reviewed"
    }
  ]
}
```

Then add entries for `soc` (cues: posture, threat, exposure, least-privilege; negative: broken/why-is), `architect` (cues: capacity, scaling, sizing, design, recommend), `retro` (cues: postmortem, retro, after the incident; requiredSignals: existing journal), and `researcher` (cues: expand the reference, citation-backed, document behavior) — each with `workflowId` (`z-soc`/`z-architect`/`z-retro`/`z-researcher`), an `examples` entry, a `threshold`, a `capsule`, `engageHow: "suggest"`, `lastVerified`, `authorStatus`. Do NOT add a `zscaler` entry (it's the router itself). Source the cues from each role's `prompt.md` "when to use" / escalation language — do not invent.

- [ ] **Step 2: Validate** — `node scripts/check-capability-registry.mjs` → "capability-registry: valid". Fix any entry the validator rejects.

- [ ] **Step 3: Insert markers + generate** — in `AGENTS.md`, replace the hand-maintained route list (the `- For ... use /z-*` bullets, ~lines 22-29) with the marker pair:

```
<!-- capability-routing:start -->
<!-- capability-routing:end -->
```

Then run `node scripts/gen-capability-routing.mjs` to fill the block. Confirm `node scripts/gen-capability-routing.mjs --check` prints "in sync".

- [ ] **Step 4: Wire the in-sync check into check-fast** — add to `scripts/check-fast.mjs` CHECKS:

```js
  { name: "AGENTS routing block", command: "node", args: ["scripts/gen-capability-routing.mjs", "--check"] },
```

- [ ] **Step 5: Commit**

```bash
git add agents/_meta/capability-registry.json AGENTS.md scripts/check-fast.mjs
git commit -m "feat(router): author capability registry + generate AGENTS.md routing block"
```

---

### Task 5: Teach `@zscaler` to route + hand off with a capsule

**Files:**
- Modify: `agents/zscaler/workflow.md` and/or `agents/zscaler/prompt.md`

- [ ] **Step 1: Add the routing discipline** to `agents/zscaler/workflow.md` (after the existing hand-off line). Exact text to add:

```markdown
## Capability routing

Before answering, check whether the request is a Q&A or a job for another role.
Consult `agents/_meta/capability-registry.json`:

- Apply each entry's `intent`: route to it only when its `threshold` is met
  (`all-required` → every `requiredSignals` item is present; `any-cue` → at least
  one `cueSignals` item, and no `negativeSignals`). The investigator test
  (symptom + affected-scope + timeframe) is `all-required` — do not route on a
  single keyword.
- **High-confidence single match** → suggest that role's `primary-command`
  (from its `workflow.md`) and emit the **hand-off capsule**: fill the entry's
  `capsule.fields` from the conversation and render `capsule.wording`, so the
  user does not have to repeat themselves. Example:
  "This is an investigation — run `/z-investigator`. Carry this context: <capsule>."
- **Multiple matches / ambiguous** → list the candidate routes and ask one
  clarifying question. Do not silently pick.
- **No match** → answer as ad-hoc Q&A (the default).
- Never auto-invoke another role, and never bypass a role's own gates — you hand
  off TO the discipline, you don't perform it.
```

- [ ] **Step 2: Verify the registry is referenced** — `grep -q "capability-registry.json" agents/zscaler/workflow.md && echo OK`. Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add agents/zscaler/workflow.md
git commit -m "feat(router): @zscaler consults the registry and hands off with a context capsule"
```

---

### Task 6: Docs + full gate

**Files:**
- Modify: `agents/README.md` (note the registry as the routing source of truth)

- [ ] **Step 1: Document** — in `agents/README.md`, add under the routing/`_meta` notes: "Role routing is driven by `agents/_meta/capability-registry.json` (routing-only data; command/required-reads derive from each role's `workflow.md`). The AGENTS.md routing block is generated from it (`scripts/gen-capability-routing.mjs`); `check-fast` lints both. Adding a role: add a registry entry (the validator enforces fields), then regenerate."

- [ ] **Step 2: Full gate** — `node scripts/check-fast.mjs` → all checks PASS (new registry validator + AGENTS-in-sync check included; `capability-registry.test.mjs` auto-discovered).

- [ ] **Step 3: Lint** — `npx --yes @biomejs/biome@1.9.4 lint scripts` → no errors.

- [ ] **Step 4: Commit**

```bash
git add agents/README.md
git commit -m "docs(router): document the capability registry as the routing source of truth"
```

---

## Verification (whole increment)

- `node scripts/check-fast.mjs` green — registry validator + AGENTS-in-sync check pass; `capability-registry.test.mjs` + `check-capability-registry.test.mjs` green.
- `node scripts/gen-capability-routing.mjs --check` → in sync.
- Biome clean.
- AGENTS.md routing block is generated, bounded by markers, and lists each role's *derived* primary-command — no metadata copied into the registry.
