# Floating todos consolidation — 2026-05-04

Single-source consolidation of work-items scattered across multiple sources, prepared as input for the `superpowers:writing-plans` skill (or similar planning workflow).

## Sources consolidated

1. `IMPROVEMENTS.md` — 17 active "Proposed" items
2. `plans/2026-05-04-whole-repo-review.md` — 3 action items + audit findings
3. `/tmp/plan-architecture-rework.md` — open items section
4. This structured review conversation (2026-05-04 evening) — ZDX caveat

Items already-resolved are excluded. Cross-references use IMPROVEMENTS.md item names where applicable.

---

## Tier 1 — Concrete cleanup actions, ready to execute

These have clear scopes, defined outcomes, and don't depend on other decisions.

### 1.1 Portfolio-map + tier schema cleanup (3 sub-actions)

Source: IMPROVEMENTS.md (top item) + review synthesis. Audit findings established the new flat T1-T5 schema. Three sub-actions:

- **A. Consolidate duplicate dirs.** Delete `references/workflow-automation/` (canonical = `zwa`). Delete `references/zero-trust-browser/` (canonical = `zbi`). Add marketing-name → canonical-name aliases in `portfolio-map.md`.
- **B. Fold 4 orphan dirs into portfolio-map T3.** Add enumeration entries for `breach-predictor`, `business-insights`, `soc-workbench`, `zero-trust-branch`.
- **C. Apply tier reshuffle in portfolio-map.md and SKILL.md.** Rename T1/T2a/T2b/T3 → T1/T2/T3/T4/T5. Move ZBI / ZWA T1 → T2. Remove AppProtection from its own T1 row in portfolio-map (it's a ZPA sub-component). Note CASB stays as disambiguation entry. Note architectural pillars (ZTE / Data Fabric / Agentic SecOps) stay outside the tier system.

**Verification gate before C** (added from this review): **ZDX operational-influence review.** ZDX is currently classified T1-borderline as observability layer. User flagged uncertainty about whether ZDX has operational influence (probes affecting routing, alerts triggering downstream actions, scores gating access). If verified operational influence exists, ZDX stays T1 unconditionally; if not, it stays T1-borderline with the gap documented; if neither, may move to T2. Run before C to avoid later re-shuffle. Could also be the catalyst for "fleshing out" ZDX from 7 files to multi-component depth.

### 1.2 Lazy citation pass on newly-vendored deployment modules

Source: tmp plan + structured review. Last session vendored 6 deployment-module repos (`terraform-aws-cloud-connector-modules`, `-azurerm-cloud-connector-modules`, `terraform-aws-zpa-app-connector-modules`, `-azurerm-zpa-app-connector-modules`, `terraform-aws-zpa-private-service-edge-modules`, `-azurerm-zpa-private-service-edge-modules`). One ref already updated (`aws-deployment.md`, commit `9f41126`). Remaining refs to back: `azure-deployment.md`, `app-connector.md`, `private-service-edges.md`. Use the same agent-pipeline pattern as `9f41126`.

### 1.3 SDK quirk note: cloud_firewall_nw_service isNameL10nTag

Source: IMPROVEMENTS #13. One-line addition to `references/zia/sdk.md` or `api.md` per upstream `zscaler-sdk-python#492`. Cheap, do when a related ref is next touched.

### 1.4 simulate-policy.py snapshot path convention

Source: IMPROVEMENTS #16. Script hardcodes `_data/snapshot/zia/url-filtering-rules.json` (per-product top-level), but documented convention is `_data/snapshot/<cloud>/<product>/...`. Low cost. **Caveat from earlier session: defer until first real tenant snapshot exists.** Otherwise fixing now risks fixing wrong (we don't know what the actual `<cloud>` slug should be until a real `snapshot-refresh.py` run).

---

## Tier 2 — Decisions to make (small, blocking nothing, but recurring)

### 2.1 Decide `/curator` fate

Source: tmp plan. Currently subsumed by `/researcher` cleanup-mode. Recommended action: **kill the placeholder concept** — formally retire `/curator` as a planned command, document `/researcher` cleanup-mode as the canonical path. ~5 minutes of doc-only work.

### 2.2 Pre-push hygiene gating decision

Source: tmp plan. `check-citations.sh` exits 1 on inference hits (strict default). 0 hits today. Decision: keep strict-default OR add `--strict` flag with warn-only default. Recommended: **defer** — not biting at 0 hits; revisit if it becomes a friction point.

---

## Tier 3 — Real work, sized in days

### 3.1 Per-claim citation discipline — script + audit pass

Source: IMPROVEMENTS #6 + tmp plan. The script is small (~50-100 LOC); the audit pass to bring all flagged refs to standard is days of work. **The script alone is a half-day project that closes a real methodology gap** — even without the audit. The audit pass becomes a per-product sweep over time.

### 3.2 Subtype-parameterize `/z-auditor` (tenant-config subtype)

Source: IMPROVEMENTS #11 + review action item. Sharpened distinction from the review:

| Audit shape | Inputs | Findings | Audience |
|---|---|---|---|
| **Repo audit** (current `/z-auditor`) | `references/`, `_meta/` | Lint, structural checks, hygiene | Maintainer |
| **Tenant-config audit** (proposed subtype) | `_data/snapshot/<cloud>/`, possibly `_data/iac/`, log evidence | Camel-case mismatches, wildcards-against-recommendations, disabled rules, tmp-labeled rules, dead URL categories, 6-month-unused logs | End users / team |

Same lint *shape* with different *substance*. Subtype, not new command.

### 3.3 ZDX fleshing out (if 1.1 verification gate motivates)

Source: this review (ZDX caveat). If ZDX operational-influence review surfaces real depth, the 7-file ZDX coverage is a "core but under-documented" gap to close. Multi-day work but well-scoped.

### 3.4 Chore automation as sustainability lever

Source: review action item #1. Inventory which manual chores currently consume personal time that could be machine-handled. Concrete candidates: `verified-against` backfill on confidence:medium refs (123 ref-submodule pairs), eval coverage backfill (74 evals), submodule update triage. Sustainability concern — the more rote work scripts catch, the less personal time burns.

---

## Tier 4 — Wait-for-trigger (defer until concrete signal)

These have clear shapes but are blocked on something that hasn't happened yet.

- **Internal-fork override pattern for `_data/cases/`** (IMPROVEMENTS #4) — wait for first real production case in the internal fork
- **Auto-fix agent for hygiene failures** (IMPROVEMENTS #5) — wait for manual loop to bottleneck
- **Verified bundle library** (IMPROVEMENTS #12) + **First verified bundle from production** (IMPROVEMENTS #15) — wait for real production investigation/audit cycle
- **Tenant-side bundle storage convention** (IMPROVEMENTS #17) — wait for first user adopting bundle pattern
- **SSL inspection cloud-app enum mapping** (IMPROVEMENTS #14) — wait for SSL inspection content cycle

---

## Tier 5 — Bigger projects, parked

### 5.1 Token-budget hygiene check

Source: IMPROVEMENTS #2. Observed in `vendor/zscaler-terraform-skills`. Could pair with hygiene-script if doc size becomes a problem. Not actionable now.

### 5.2 Test decision-table-first authoring on a Windsurf workflow

Source: IMPROVEMENTS #3. Speculative refactor experiment. Pick one Windsurf workflow, rewrite structurally, observe if behavior differs. Not blocking anything.

### 5.3 URL content drift detection

Source: IMPROVEMENTS #8. Catch when a cited URL's content changes (not just 404s). Medium cost. Alt approach: enforce pairing every URL citation with a `vendor/zscaler-help/` capture.

### 5.4 Per-source last-verified granularity

Source: IMPROVEMENTS #9. Track which of a ref's sources got re-verified vs inherited the date. Defer until evidence of partial-staleness on a ref.

### 5.5 Postman/API-spec drift detection

Source: IMPROVEMENTS #10. JSON-aware diff for endpoint-level changes. Medium-high cost. Defer until api-specs submodule changes more frequently.

### 5.6 Determinism beyond scripts — soft-to-hard pairings

Source: IMPROVEMENTS #7. Framing exercise — names the pattern; individual investments need their own justification. Not actionable as a single item.

---

## Tier 6 — Surprise findings from prior research, not yet actioned

Source: tmp plan, "First-party project inventory." Triaged but not acted on:

- **Diff against `zscaler-terraform-skills`** ✅ DONE this session (commits `1a2eec1`, `a435c2f`)
- **Priority 2 vendoring** ✅ DONE this session (commit `278b411`)
- **Priority 3 vendoring** ✅ TRIAGED — all skipped (no consumer refs to back; revisit per-item if a ref needs the backing)
- **Docker Hub `zscaler/` images** — note as gap; not vendoring (it's images, not source). ZMS images suggest a Kubernetes management surface we don't document.
- **`zscaler-script-samples`** — 172 commits practitioner automation. Could vendor when a "how do operators actually use this" gap surfaces.

---

## Items intentionally excluded from this consolidation

- IMPROVEMENTS items marked ✅ Resolved (Submodule drift detection, Help-article scrape freshness, source.html?p= validation gap, External-doc anchor drift, Eval coverage signal, Primer files high+empty-sources)
- tmp plan items already executed (architecture migration, citation cleanup, Priority 1 vendoring, the four hygiene-script quick wins, etc.)
- The review itself (synthesis lives in `2026-05-04-whole-repo-review.md`)

---

## How this maps to a `writing-plans` invocation

`writing-plans` produces a plan with bite-sized 2-5 minute tasks against a single spec. Recommended consumption pattern:

1. **One plan per Tier-1 cleanup action.** Each is small, scoped, and produces working output independently. Best fit for tracer-bullet vertical slices.
2. **Tier-3 items each warrant their own plan.** Per-claim citation script, `/z-auditor` subtype, and ZDX fleshing-out are each multi-day projects with internal decomposition.
3. **Tier 2 (decisions) probably don't need plans** — they're 5-minute commits or "defer" calls.
4. **Tiers 4/5/6 are intentionally not yet ready to plan.** Surface them in the plan-set as "parked, awaiting trigger."

A reasonable "first plan" candidate from this list: **Plan 1.1 (Portfolio-map + tier schema cleanup)** — concrete, scoped, deterministic, three sub-actions, has a clear verification gate. Proves the writing-plans → executing-plans loop on this skill before tackling bigger items.
