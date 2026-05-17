# Portfolio-map + Tier Schema Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the new flat T1-T5 tier schema to `portfolio-map.md` and `SKILL.md`, consolidate two pairs of duplicate product directories, fold four orphan dirs into the portfolio enumeration, and demote ZBI/ZWA from T1 → T2.

**Architecture:** Documentation-only changes. Reorganize `references/_meta/portfolio-map.md` headings + product enumeration. Sync the tier-enumeration sections in `SKILL.md`. Merge content from two duplicate dirs into their canonical counterparts, then delete the duplicates. No code changes; no script changes.

**Tech Stack:** Markdown editing (Edit tool); Bash for `git rm -r` deletions; existing hygiene scripts for verification (`check-hygiene.py`, `check-citations.sh`, `check-doc-links.py`, `check-orphans.py`, `check-vendor-drift.py`).

**Source spec:** `plans/2026-05-04-floating-todos.md` § 1.1.
**Audit findings:** `plans/2026-05-04-whole-repo-review.md` § "Audit findings", § "Final tier schema".

---

### Task 1: ZDX operational-influence verification gate

**Why this is task 1:** The review flagged that ZDX may have operational influence beyond pure observability (probes affecting routing, alerts triggering downstream actions, scores gating access). If true, ZDX stays T1 unconditionally. If false, ZDX stays T1-borderline with the gap noted. Either way, this finding informs Task 6 (tier reshuffle) and prevents a later reshuffle if classification changes after the fact.

**ZDX classification (decided 2026-05-04):** **T1 borderline** — observability layer with no verified operational coupling to ZIA/ZPA/ZCC policy. Stay T1 with the gap explicitly noted; do not promote to T1-unconditional, do not demote to T2.

**Rationale (one sentence):** Every captured ZDX surface — probes, scores, alerts, deeptraces — is read-only telemetry that exits ZDX via dashboards, JMESPath-filtered API responses, email, and webhook notifications; no captured surface shows ZDX feeding a policy condition, gating access, or triggering automated control-plane action.

**Citations supporting the finding:**

- **ZDX is read-only / no write surface for control:** `references/zdx/api.md:18-20` ("ZDX is primarily a **read-only** API … the configuration surface (probes, alerts, applications) is console-driven; the API mostly exposes **metric and status retrieval**"); `references/zdx/sdk.md:286-292` (the only SDK write operations are deeptrace start/delete, analysis start/delete, and snapshot share — all investigative or sharing actions, none policy-mutating). Cross-confirmed in `references/shared/activation.md:36` (ZDX has no activation step because there is no config-write surface).
- **ZIA / ZPA SDKs do not import or reference ZDX:** `grep -rin "zdx" vendor/zscaler-sdk-python/zscaler/zia/ vendor/zscaler-sdk-python/zscaler/zpa/` → empty. Go SDK only matches in commented-out PAC-file test fixtures (`vendor/zscaler-sdk-go/zscaler/zia/services/pacfiles/pacfiles_test.go:253-260`) referring to ZDX-named bypass domains for probe traffic — that is ZIA-side bypass *of* ZDX, not ZDX *input to* ZIA policy.
- **ZDX score has no consumer outside the ZDX SDK:** `grep -rin "zdx_score\|zdx-score\|zdxscore" vendor/zscaler-sdk-{python,go}/ vendor/zscaler-terraform-skills/ | grep -v "/zdx/"` → empty. The ZDX Score is a dashboard / API output, not a policy input.
- **Alert outputs are notification-only:** `references/zdx/diagnostics-and-alerts.md:96-108` (alert lifecycle is Started → Ongoing → Completed, with admin-rule-modification statuses; no automated downstream action in the lifecycle). The `understanding-alert-status.md` Related Articles list webhooks (`vendor/zscaler-help/understanding-alert-status.md:33-34`) and webhooks per the in-skill grep are notification mechanisms (Jira / ServiceNow / Slack patterns elsewhere in the help corpus) — fits the "alert posts to Slack → observability" rule, not the "alert disables a ZPA segment → operational" rule.
- **ZDX probes do not affect routing:** `references/zdx/probes.md:48-57` ("URL Filtering, CAC, Firewall rules, and other non-SSL policies **do** apply to probes" — i.e., ZIA policy filters ZDX probes, not the other way around) and `references/zdx/diagnostics-and-alerts.md:127` (deeptrace probes run on a path independent of ZIA tunnel forwarding — confirming probes are passive measurement, not control-plane participants).
- **Cross-product flow is one-way INTO ZDX:** `references/shared/cross-product-integrations.md:262-268` — ZDX pulls users/departments/locations *from* ZIA and ZPA and depends on ZCC entitlement to receive metrics. No reverse path documented where ZIA / ZPA / ZCC consumes ZDX state.

**Why "T1 borderline" not "T2":** ZDX has SDK / OneAPI surface (`client.zdx.*`, deeptrace orchestration is a write operation, multi-component reasoning coverage spanning architecture / scoring / probes / alerts / API / SDK / schemas), so it clears the T1 bar on programmability and depth. The gap is solely the operational-influence question — and the answer is "observability, not control." This is exactly the "T1 borderline" shape: full T1 depth, but the product's role in the platform is observation rather than enforcement, and that should be stated explicitly in Task 7's portfolio-map T1 section so readers don't infer ZDX participates in policy decisions.

**Why not T2 ("programmable but shallow"):** T2 is for products with thin reference coverage (current T2 candidates: ZBI, ZWA per the schema reshuffle). ZDX has 7 substantive references covering architecture, scoring, probes, alerts/deeptraces, API, SDK, and resource schemas — same depth shape as ZIA/ZPA/ZCC. Demoting on coverage grounds would be wrong.

**Files:**
- Read: `references/zdx/overview.md`, `references/zdx/index.md`, any policy/api files under `references/zdx/`
- Read: `vendor/zscaler-help/` for any ZDX help docs that mention policy/access integration
- Modify: this plan file (`plans/2026-05-04-portfolio-map-tier-cleanup.md`) to record the finding

- [ ] **Step 1: Enumerate the ZDX reference content**

```bash
ls /Users/dm/src/gh/dvmrry/zscaler-skill/references/zdx/
find /Users/dm/src/gh/dvmrry/zscaler-skill/vendor/zscaler-help -iname "*zdx*" -o -iname "*deeptrace*" 2>/dev/null | head -10
```

Expected: list of ZDX refs + any vendor captures.

- [ ] **Step 2: Read every ZDX ref for operational-influence signals**

Use Read tool on each file. Search specifically for:
- ZDX scores feeding into policy decisions
- Alerts triggering automation / blocking actions
- Probes that affect routing / app-segment selection
- Any reference to ZDX as input to ZIA / ZPA policy

- [ ] **Step 3: Search vendor sources for ZDX → policy linkage**

```bash
grep -rin -E "(zdx.*polic|polic.*zdx|zdx.*gat|alert.*trigger|score.*polic)" /Users/dm/src/gh/dvmrry/zscaler-skill/vendor/zscaler-help/ 2>/dev/null | head -20
```

Expected: matches if linkage exists; nothing if pure observability.

- [ ] **Step 4: Record finding**

Edit this plan to add a `**ZDX classification (decided 2026-05-04):**` block under this task heading with one of:
- "T1 unconditional — operational influence verified at <citation>"
- "T1 borderline — operational influence not verified; observability layer; gap documented"
- "T2 — observability-only, programmable but not in data path"

This finding determines what Task 6 writes to portfolio-map's T1 section regarding ZDX.

- [ ] **Step 5: Commit the plan update**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
git add plans/2026-05-04-portfolio-map-tier-cleanup.md
git commit -m "plan: record ZDX classification decision after operational-influence review"
```

Note: this plan was originally captured as a local-only artifact before `plans/` became a tracked directory. Current convention is to commit durable planning notes under `plans/` when they explain active or completed work.

---

### Task 2: Diff workflow-automation against zwa

**Files:**
- Read: `references/workflow-automation/overview.md` (1 file, 134 lines)
- Read: `references/zwa/overview.md`, `references/zwa/api.md`, `references/zwa/audit-logs.md`, `references/zwa/index.md` (4 files)

- [ ] **Step 1: Compare the two overview files**

```bash
diff -u /Users/dm/src/gh/dvmrry/zscaler-skill/references/zwa/overview.md /Users/dm/src/gh/dvmrry/zscaler-skill/references/workflow-automation/overview.md
```

Expected: substantial diff (different framings of the same product). Note unique content per side.

- [ ] **Step 2: Identify content unique to workflow-automation/overview.md**

Read both files in full. List facts/citations present in `workflow-automation/overview.md` but absent from any file under `zwa/`. These are merge candidates.

- [ ] **Step 3: Decide merge target**

Most likely target: `zwa/overview.md` (matching topic). If unique content is shaped differently (e.g., automation-pipeline-focused vs incident-lifecycle-focused), it may merit its own file under `zwa/` (e.g., `zwa/automation.md`). Decision is per-content; default to merging into `zwa/overview.md` unless clearly distinct topic.

---

### Task 3: Merge unique content from workflow-automation into zwa, then delete the duplicate dir

**Files:**
- Modify: `references/zwa/overview.md` (or new file under `references/zwa/` if Task 2 surfaced distinct topic shape)
- Delete: `references/workflow-automation/overview.md` and its dir
- Modify: `references/_meta/portfolio-map.md` (add marketing-name alias)

- [ ] **Step 1: Merge unique content into zwa/overview.md**

Use Edit tool to add the unique sections identified in Task 2 step 2 to `references/zwa/overview.md`. Preserve citations exactly as they appeared in the source. If frontmatter dates conflict, take the more recent.

- [ ] **Step 2: Delete the workflow-automation/ directory**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
git rm -rf references/workflow-automation/
```

Expected: `rm 'references/workflow-automation/overview.md'`. Directory is removed from git index.

- [ ] **Step 3: Add marketing-name alias to portfolio-map.md**

Edit `references/_meta/portfolio-map.md`. Add to the relevant section (likely near the architectural-pillars table or in a new "Product name aliases" subsection):

```markdown
**"Workflow Automation"** is the marketing name for **ZWA**. Both refer to the same product; canonical reference is `references/zwa/`.
```

- [ ] **Step 4: Run hygiene checks**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
./scripts/check-hygiene.py 2>&1 | head -10
./scripts/check-citations.sh 2>&1 | tail -5
./scripts/check-orphans.py 2>&1 | tail -10
```

Expected: no new errors. Possible new orphan warning if any ref linked to `references/workflow-automation/` (verify with `grep -rln workflow-automation /Users/dm/src/gh/dvmrry/zscaler-skill/references/` before deletion in Step 2 to surface and fix any stale links).

- [ ] **Step 5: Commit**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
git add references/zwa/ references/_meta/portfolio-map.md
git commit -m "Consolidate workflow-automation/ into zwa/

Two confidence:high docs about the same product (ZWA / Workflow Automation)
violated citation discipline. Merged unique content from
workflow-automation/overview.md into zwa/overview.md, deleted the duplicate
dir, added marketing-name alias to portfolio-map.md so 'Workflow Automation'
queries resolve to the canonical zwa/ namespace.

Per 2026-05-04 review audit (plans/2026-05-04-whole-repo-review.md)."
```

---

### Task 4: Diff zero-trust-browser against zbi

**Files:**
- Read: `references/zero-trust-browser/overview.md` (1 file, 138 lines)
- Read: `references/zbi/overview.md`, `references/zbi/index.md`, `references/zbi/policy-integration.md` (3 files)

- [ ] **Step 1: Compare the two overview files**

```bash
diff -u /Users/dm/src/gh/dvmrry/zscaler-skill/references/zbi/overview.md /Users/dm/src/gh/dvmrry/zscaler-skill/references/zero-trust-browser/overview.md
```

- [ ] **Step 2: Identify content unique to zero-trust-browser/overview.md**

List unique facts/citations. The marketing-named version may have more recent terminology ("Zero Trust Browser" rebrand from "Zscaler Isolation"); the SDK-named version (zbi/) may have more architectural detail.

- [ ] **Step 3: Decide merge target**

Default: merge into `zbi/overview.md`. If naming-history content (Zscaler Isolation → Cloud Browser Isolation → Zero Trust Browser) is substantial and structural, consider whether it deserves a `zbi/naming-history.md` standalone — otherwise inline as a "Product naming" section.

---

### Task 5: Merge zero-trust-browser into zbi, delete the duplicate dir

**Files:**
- Modify: `references/zbi/overview.md` (or new file under `references/zbi/`)
- Delete: `references/zero-trust-browser/overview.md` and its dir
- Modify: `references/_meta/portfolio-map.md` (add marketing-name alias)

- [ ] **Step 1: Merge unique content into zbi/overview.md**

Use Edit tool. Preserve citations.

- [ ] **Step 2: Find any references that link to `zero-trust-browser/`**

```bash
grep -rln "zero-trust-browser" /Users/dm/src/gh/dvmrry/zscaler-skill/references/ /Users/dm/src/gh/dvmrry/zscaler-skill/SKILL.md /Users/dm/src/gh/dvmrry/zscaler-skill/README.md 2>/dev/null
```

Expected: list of files referencing the doomed dir. Update each link to point to `zbi/` instead.

- [ ] **Step 3: Delete the zero-trust-browser/ directory**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
git rm -rf references/zero-trust-browser/
```

- [ ] **Step 4: Add marketing-name alias to portfolio-map.md**

```markdown
**"Zero Trust Browser"** (formerly "Zscaler Isolation", also "Cloud Browser Isolation") is the marketing name for **ZBI**. Canonical reference is `references/zbi/`.
```

- [ ] **Step 5: Run hygiene checks**

Same commands as Task 3 step 4.

- [ ] **Step 6: Commit**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
git add references/zbi/ references/_meta/portfolio-map.md
git commit -m "Consolidate zero-trust-browser/ into zbi/

Two confidence:high docs about the same product (ZBI / Zero Trust Browser /
formerly Zscaler Isolation). Merged unique content from
zero-trust-browser/overview.md into zbi/overview.md, deleted the duplicate
dir, added marketing-name alias to portfolio-map.md.

Per 2026-05-04 review audit."
```

---

### Task 6: Fold 4 orphan dirs into portfolio-map.md T3 enumeration

**Files:**
- Modify: `references/_meta/portfolio-map.md` (add T3 entries — note the section is currently labeled "Tier 2b" pre-renaming; renaming happens in Task 7. For now, add to the existing Tier 2b section.)

The 4 orphan dirs (each has a substantive `overview.md` not currently in portfolio-map):

| Dir | Title (per overview.md) | Source for paragraph |
|---|---|---|
| `breach-predictor` | Breach Predictor — predictive threat intelligence | `references/breach-predictor/overview.md` |
| `business-insights` | Business Insights — SaaS usage analytics | `references/business-insights/overview.md` |
| `soc-workbench` | SOC Workbench — unified threat detection / incident response | `references/soc-workbench/overview.md` |
| `zero-trust-branch` | Zero Trust Branch — SD-WAN with zero-trust device segmentation | `references/zero-trust-branch/overview.md` |

- [ ] **Step 1: Read each orphan overview.md to extract a 1-paragraph treatment**

For each dir, read `overview.md`, write a 1-paragraph summary capturing: what the product is, what it does, key distinguishing detail, citation to vendor source if used in the overview, no-SDK note if applicable.

- [ ] **Step 2: Add Breach Predictor entry to portfolio-map.md Tier-2b section**

Insert the 1-paragraph entry near related products (security-operations cluster).

- [ ] **Step 3: Add Business Insights entry**

Insert near analytics/insights cluster (likely near Risk360 or similar).

- [ ] **Step 4: Add SOC Workbench entry**

Insert near security-operations cluster.

- [ ] **Step 5: Add Zero Trust Branch entry**

Insert near branch/SD-WAN cluster (likely near Cloud Connector adjacency).

- [ ] **Step 6: Run hygiene checks**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
./scripts/check-hygiene.py 2>&1 | head -10
./scripts/check-orphans.py 2>&1 | tail -10
```

Expected: orphan-dir warnings for the 4 products should disappear (they're now linked from portfolio-map).

- [ ] **Step 7: Commit**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
git add references/_meta/portfolio-map.md
git commit -m "portfolio-map: enumerate 4 orphaned product dirs

breach-predictor, business-insights, soc-workbench, zero-trust-branch
each have substantive overview.md files (100+ lines, Tier-A citations)
but were never folded into portfolio-map's Tier-2b enumeration. Added
1-paragraph treatments for each near related product clusters.

Per 2026-05-04 review audit (Finding 3 — map drift)."
```

---

### Task 7: Apply tier schema reshuffle in portfolio-map.md

**Files:**
- Modify: `references/_meta/portfolio-map.md` (heading rename, product moves, schema-definition rewrite)

The schema change:

| Old label | New label | Members affected |
|---|---|---|
| "Tier 1 — Deep-dive coverage (9 products)" | "Tier 1 — Core products" | Remove ZBI, ZWA (move to T2). Remove AppProtection (fold into ZPA section). |
| "Tier 2a — Extended awareness" | "Tier 3 — Reasoning content, no API" | Add: ZBI/ZWA stay distinct from this tier (they're T2 — programmable); existing T2a members stay. |
| "Tier 2b — Awareness only" | "Tier 4 — Paragraph-only awareness" | No member change. |
| "Tier 3 — Truly out of scope" | "Tier 5 — Deprecated / historical / unreleased" | No member change (still empty). |
| (new tier) | "Tier 2 — Programmable but shallow" | ZBI, ZWA |

- [ ] **Step 1: Update the schema-definition prose at top of portfolio-map.md**

Rewrite lines 20-26 (Three coverage tiers section) to describe the new T1-T5 schema:

```markdown
Five coverage tiers, with API/IaC surface as the primary axis and content depth as the secondary axis:

- **Tier 1 — Core products.** Have SDK/TF/OneAPI surface AND substantive multi-component coverage in `references/<product>/`. Where the skill earns its depth claim. Answer with full operational depth.
- **Tier 2 — Programmable but shallow.** Have SDK/TF surface but reference coverage is thin — may not match a single Tier 1 sub-component's depth. Answer with full confidence on what's documented; explicitly note the coverage gap when relevant.
- **Tier 3 — Reasoning content, no API.** No SDK/TF surface (portal-only configuration). Reasoning docs exist under `references/<product>/`. Answer conceptual questions at confidence: medium with an explicit "no SDK / portal-only" caveat. Do NOT fabricate API specifics.
- **Tier 4 — Paragraph-only awareness.** No SDK, no dedicated reasoning content. One-paragraph treatment in this map. Skill recognizes + describes briefly; redirects to TAM / help.
- **Tier 5 — Out of scope.** Deprecated / historical / unreleased. Currently empty. Reserved for products not currently worth investment; watched for promotion-worthy changes.

**Architectural pillars** (Zero Trust Exchange, Data Fabric for Security, Agentic SecOps) are not products — they are marketing umbrellas / capability layers across products. They stay outside the tier system and are documented separately near the top of this map.

**CASB** is also outside the tier system — it is a federation of ZIA features + DSPM, not a standalone Zscaler SKU. Documented as a disambiguation entry.
```

- [ ] **Step 2: Rename the Tier 1 heading**

Change `## Tier 1 — Deep-dive coverage (9 products)` to `## Tier 1 — Core products`. Update the count (will be 6 after demotions).

- [ ] **Step 3: Remove ZBI from Tier 1 enumeration**

Find the ZBI row in the Tier 1 product table and delete it.

- [ ] **Step 4: Remove ZWA from Tier 1 enumeration**

Find the ZWA row in the Tier 1 product table and delete it.

- [ ] **Step 5: Remove AppProtection's standalone Tier 1 row**

Find the AppProtection row. Delete the standalone row. Move its content (one paragraph + the SDK pointer) into the ZPA Tier 1 row as a sub-component callout: "ZPA includes **AppProtection** — inline WAF/IPS for ZPA-protected applications. SDK lives inside ZPA SDKs (`zpa/app_protection.py` + `zpa/services/app_protection/`)."

- [ ] **Step 6: Add new Tier 2 section**

Below Tier 1, add a new heading + table:

```markdown
## Tier 2 — Programmable but shallow (2 products)

Have SDK/TF surface but reference coverage is thin compared to Tier 1. Answer with full confidence on what's documented; explicitly note coverage gap when relevant.

| Product | What it does | Deep-dive entry | API exposure |
|---|---|---|---|
| **ZBI — Cloud Browser Isolation** | [previous content from old Tier 1 ZBI row] | [`zbi/index.md`](../zbi/index.md) | [previous SDK pointer] |
| **ZWA — Workflow Automation** | [previous content from old Tier 1 ZWA row] | [`zwa/index.md`](../zwa/index.md) | [previous SDK pointer] |
```

Preserve the existing prose for each product; just relocate.

- [ ] **Step 7: Rename old Tier 2a → Tier 3**

Change `## Tier 2 — Awareness (no SDK / TF / API exposure)` and `### Tier 2a — Extended awareness (reasoning doc exists)` to `## Tier 3 — Reasoning content, no API`. Adjust the introductory prose to drop "Tier 2 splits into two shapes" wording — the new schema flattens this.

- [ ] **Step 8: Rename old Tier 2b → Tier 4**

Change `### Tier 2b — Awareness only (one-paragraph treatment)` to `## Tier 4 — Paragraph-only awareness`. Preserve all the existing entries plus the 4 orphan entries added in Task 6.

- [ ] **Step 9: Rename old Tier 3 → Tier 5**

Change `## Tier 3 — Truly out of scope` to `## Tier 5 — Deprecated / historical / unreleased`. Update the description to match the new schema's framing ("watched for promotion-worthy changes").

- [ ] **Step 10: Update the routing table at the bottom of portfolio-map.md**

Lines 171-176 reference the routing decision tree by tier. Update to use the new T1-T5 labels and add T2 routing (programmable-but-shallow gets full-confidence answers on what's documented + explicit coverage-gap note when relevant).

- [ ] **Step 11: Update the summary counts at the bottom**

Lines 182-185 enumerate per-tier counts. Update:
- Tier 1: 6 (ZIA, ZPA, ZCC, ZIdentity, Cloud Connector, ZDX) — was 9; lost ZBI, ZWA, AppProtection
- Tier 2: 2 (ZBI, ZWA) — new
- Tier 3: 5 + ZSDK (Deception, Risk360, AI Security, ZMS, ZSDK) — old Tier 2a unchanged
- Tier 4: ~19 + 4 orphans = ~23 — old Tier 2b plus the orphans from Task 6
- Tier 5: 0 — old Tier 3 unchanged

- [ ] **Step 12: Update last-verified frontmatter**

Change `last-verified: "2026-04-25"` to `last-verified: "2026-05-04"`.

- [ ] **Step 13: Run hygiene checks**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
./scripts/check-hygiene.py 2>&1 | head -10
./scripts/check-citations.sh 2>&1 | tail -5
./scripts/check-doc-links.py 2>&1 | tail -3
```

Expected: zero new errors. Anchor-link warnings if any cross-references in other docs use old `Tier 2a` / `Tier 2b` heading text — surface and fix before commit.

- [ ] **Step 14: Commit**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
git add references/_meta/portfolio-map.md
git commit -m "portfolio-map: apply T1-T5 flat tier schema

Old: Tier 1 / 2a / 2b / 3 (alpha-suffixed sub-tiers, drift from earlier
session). New: T1 / T2 / T3 / T4 / T5 (flat numeric).

Schema changes:
- T1 (Core): ZIA, ZPA, ZCC, ZIdentity, Cloud Connector, ZDX (was 9 products,
  now 6 — demoted ZBI/ZWA, removed AppProtection's standalone row)
- T2 (Programmable but shallow): ZBI, ZWA (new tier — was T1 in old schema)
- T3 (Reasoning content, no API): old Tier 2a unchanged (Deception, Risk360,
  AI Security, ZMS, ZSDK)
- T4 (Paragraph-only): old Tier 2b unchanged + 4 orphans folded in last
  commit
- T5 (Deprecated / out of scope): empty, was Tier 3

AppProtection moved from its own T1 row into the ZPA section as a
sub-component callout. CASB stays as disambiguation (federation of ZIA +
DSPM, not a standalone product). Architectural pillars (ZTE / Data Fabric /
Agentic SecOps) stay outside the tier system entirely.

ZDX classification per Task 1 verification gate: [insert finding here].

Per 2026-05-04 review audit (plans/2026-05-04-whole-repo-review.md
§ 'Final tier schema')."
```

---

### Task 8: Sync SKILL.md tier enumerations with new schema

**Files:**
- Modify: `SKILL.md` (lines 5, 12, 20 in description string; lines 231-235 in routing table)

- [ ] **Step 1: Update the description-string tier enumerations**

`SKILL.md` lines 5, 12, 20 contain the tier labels in the human-readable description. Find each:

- Line 5: `(Tier 1, with SDK / TF / OneAPI exposure)` — keep the wording but update product list (remove ZBI/ZWA, add their separation if listed)
- Line 12: `extended awareness with reasoning docs (Tier 2a, portal-only / no` — change `Tier 2a` to `Tier 3`
- Line 20: `awareness (Tier 2b) of ZINS` — change `Tier 2b` to `Tier 4`

Edit each to use the new labels.

- [ ] **Step 2: Update the routing-table block (SKILL.md lines 231-235)**

Replace the existing 5-item bulleted list with new entries reflecting the new schema:

- T1 — operational deep-dive (SDK/TF/API + multi-component coverage): ZIA, ZPA (including AppProtection sub-component and Browser Access), ZCC, ZIdentity, Cloud Connector, ZDX
- T2 — programmable but shallow: ZBI, ZWA
- T3 — extended awareness, no SDK: Deception, Risk360, AI Security, ZMS
- T4 — paragraph-only routing: ITDR, Resilience, DSPM, etc.
- T5 — out of scope: empty

- [ ] **Step 3: Update the "Partial scope within Tier 1" line (SKILL.md line 235)**

This line currently mentions ZCC, ZDX, ZBI, ZIdentity gaps. ZBI moved to T2 — update line to "Partial scope within Tier 1 / T2" or split into per-tier.

- [ ] **Step 4: Run hygiene checks**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
./scripts/check-hygiene.py 2>&1 | head -5
```

Expected: zero new errors. Frontmatter-validation warning if SKILL.md frontmatter is touched (it shouldn't be — only body).

- [ ] **Step 5: Commit**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
git add SKILL.md
git commit -m "SKILL.md: sync tier enumeration with new T1-T5 schema

Description-string and routing-table sections updated to match the
portfolio-map.md schema change (commit <Task 7 SHA>). Tier 2a → T3,
Tier 2b → T4, ZBI/ZWA moved from T1 to new T2. AppProtection now
referenced as a ZPA sub-component, not its own tier entry."
```

---

### Task 9: Update IMPROVEMENTS.md to mark item resolved

**Files:**
- Modify: `IMPROVEMENTS.md` (move "Portfolio-map + tier schema cleanup" from Proposed → Resolved)

- [ ] **Step 1: Find the IMPROVEMENTS entry**

It's currently the first item in the `## Proposed` section.

- [ ] **Step 2: Move the entry to `## Resolved` with status update**

Cut the entry from Proposed. Paste into Resolved with:
- `**Status**: Resolved 2026-05-04`
- A `**Resolution**:` paragraph naming the commits (Tasks 3, 5, 6, 7, 8) and summarizing what changed
- Preserve the original Origin / Impact / Cost / Notes for historical reference

- [ ] **Step 3: Commit**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
git add IMPROVEMENTS.md
git commit -m "IMPROVEMENTS.md: mark portfolio-map cleanup resolved

Moved 'Portfolio-map + tier schema cleanup' from Proposed → Resolved.
Cleanup completed across Tasks 3, 5, 6, 7, 8 of the writing-plans
implementation plan."
```

---

### Task 10: Final verification sweep

- [ ] **Step 1: Full hygiene suite**

```bash
cd /Users/dm/src/gh/dvmrry/zscaler-skill
./scripts/check-hygiene.py
./scripts/check-citations.sh
./scripts/check-doc-links.py
./scripts/check-orphans.py
./scripts/check-vendor-drift.py
./scripts/check-scrape-freshness.py
```

Expected: all green or unchanged from pre-cleanup baseline. Specifically:
- No new errors
- No new warnings (eval-coverage warning is pre-existing and out of scope)
- Orphan count decreased (the 2 deleted dirs no longer count; the 4 orphans now linked from portfolio-map)

- [ ] **Step 2: Verify product count claims match**

```bash
ls /Users/dm/src/gh/dvmrry/zscaler-skill/references/ | grep -v _meta | grep -v shared | wc -l
```

Expected: 22 (was 24; lost workflow-automation + zero-trust-browser).

- [ ] **Step 3: Verify Tier 1 product count in portfolio-map matches reality**

```bash
grep -c "^| \*\*ZIA\|^| \*\*ZPA\|^| \*\*ZCC\|^| \*\*ZIdentity\|^| \*\*Cloud\|^| \*\*ZDX" /Users/dm/src/gh/dvmrry/zscaler-skill/references/_meta/portfolio-map.md
```

Expected: 6 (the new T1 product set).

- [ ] **Step 4: Final commit if any cleanup edits surfaced**

If verification surfaced minor fixes (anchor links, count corrections, etc.), commit them as a single "tier schema cleanup followups" commit.

---

## Spec coverage check

Mapping each spec requirement (from `plans/2026-05-04-floating-todos.md` § 1.1) to a task:

| Spec requirement | Task |
|---|---|
| A. Consolidate `references/workflow-automation/` into `zwa/` (canonical) | Tasks 2 + 3 |
| A. Consolidate `references/zero-trust-browser/` into `zbi/` (canonical) | Tasks 4 + 5 |
| A. Add marketing-name aliases in portfolio-map | Task 3 step 3 + Task 5 step 4 |
| B. Fold breach-predictor into portfolio-map T3 | Task 6 step 2 |
| B. Fold business-insights into portfolio-map T3 | Task 6 step 3 |
| B. Fold soc-workbench into portfolio-map T3 | Task 6 step 4 |
| B. Fold zero-trust-branch into portfolio-map T3 | Task 6 step 5 |
| C. Rename T1/T2a/T2b/T3 → T1/T2/T3/T4/T5 | Task 7 steps 7-9 |
| C. Move ZBI/ZWA from T1 → T2 | Task 7 steps 3, 4, 6 |
| C. Remove AppProtection from T1 row | Task 7 step 5 |
| C. Note CASB stays outside tier system | Task 7 step 1 |
| C. Note architectural pillars stay outside tier system | Task 7 step 1 |
| Verification gate: ZDX operational-influence review | Task 1 |
| SKILL.md sync | Task 8 |
| IMPROVEMENTS.md update | Task 9 |
| Final hygiene verification | Task 10 |

All 16 spec items mapped. No gaps.

## Placeholder scan

No "TBD" / "implement later" / "fill in details" / "Add appropriate error handling" patterns. Each task has concrete file paths, concrete commands, concrete expected outputs.

The one intentional placeholder is in Task 7 step 14 commit message: "ZDX classification per Task 1 verification gate: [insert finding here]." — this is intentional because Task 1 produces the finding that fills it. Filling at template-write time would be premature.

## Type consistency

All tier labels used consistently throughout: T1, T2, T3, T4, T5. No drift to "Tier 2a" / "Tier 2b" in plan body. All file paths absolute or repo-relative — no mixing.

---

## Execution Handoff

Plan saved to `plans/2026-05-04-portfolio-map-tier-cleanup.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration. Each subagent gets the relevant task block + the source spec context (this file + audit findings).

2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints for review.

**Which approach?**
