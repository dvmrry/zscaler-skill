# Review session — 2026-05-04 — whole-repo strategic review

## Frame

- **Target:** the project itself (zscaler-skill), not a specific subsystem. User asked to revisit the project at strategic level after recent vendoring + agent-pipeline work.
- **Method:** structured interview prompt, one question at a time, with recommended answer included; walk the decision tree branch by branch.
- **Trigger:** user wanted to test the structured review pattern but had no specific target — preferred "whole repo" so the review itself could surface what's worth targeting.
- **Length:** ~10 substantive question rounds. Review produced concrete recalibrations and action items rather than just confirming priors.

## Constraint map

The review mapped these as the binding constraints under which the project actually operates:

| Axis | What's true |
|---|---|
| **Time budget** | 4–6 hrs/day after work + weekends + CC-remote during work hours for procedural tasks. Heavy methodology IS in scope; the project is closer to a part-time second job than a hobby. |
| **Sustainability** | Burnout risk acknowledged. Mitigation = automate more chore tasks so personal time goes to usage improvements, not drudgery. |
| **Feedback loop** | DLP-locked. No file transfer, no airdrop, no cloud sync between work and personal contexts. Best honest play is photos + OCR from a personal phone. Re-derivation tax on every observation (lessons must be re-stated stripped of specifics). |
| **Deployment surface** | Windsurf is the primary *work* deployment (necessity, not preference). Claude Code is the first-party build target. Windsurf-wrapped models behave as Windsurf, not as their native counterparts — Opus-in-Windsurf ≠ Opus-in-CC. |
| **Model floor (work)** | WS-SWE-1.5 practical floor. WS-SWE-1.6 informally gated out (too unreliable, fast-skips steps). Active tuning targets: WS-Haiku and WS-Codex (1× cost). Sonnet 4.6 was the lost honeymoon. |
| **Repo posture** | Personal repo, personal CC subscription, Apache-licensed, sanitized of employer-specific context. The user owns the IP. If management adopts, great; if not, the user keeps using it. |
| **Org context** | No defined charter from management. Generic political pressure to "show team is using AI." User has leverage as the agentic-tooling-curious person. |

## Primary user (layered)

Audience expertise decays across waves:

- **W0 (now):** the user themselves — primary author + sole tester
- **W1:** original team (Zscaler-familiar) — "experiential knowledge" contribution begins, runbooks form
- **W2:** new hires onto a related team (NOT Zscaler-familiar but should learn fundamentals) — fuzzy, untested
- **W3+:** broader internal teams (network/sysadmin/ops/devs) — fuzzier
- **W4 (endgame):** purpose-trained model. Concrete plan: HuggingFace base model + fine-tune on this repo + tenant data + the same primary sources we extract from.

The review confirmed the primer content (`_meta/primer/`) is load-bearing for W2 even though it hasn't been stress-tested yet. W2+ success criteria are intentionally fuzzy until there's a real W2 hire to break things on.

## W0 success criterion (corrected mid-review)

**Initial misread:** I assumed the W0 killer feature was re-play / log analysis / config dump analysis.

**Correction:** those are *use cases the tool supports*. The actual W0 work is **tuning the commands/workflows/subagents** to do those tasks reliably. The artifacts (re-play, log analysis, Q&A) are what the tools enable; the engineering target is the tools themselves.

Real-world validation is happening at work against actual Zscaler cases, but the artifacts can't come into this repo (work-proprietary). Lessons flow personal → work via the Apache-licensed repo, never work → personal automatically.

## North Star (corrected mid-review)

**Initial framing:** I tried to force a pick between "tool I trust enough to use" vs "durable KB that outlives the project."

**User correction:** **Both. Inseparable.**
- "Tool I trust enough to use is the absolute floor to build on top of, but that requires the KB to be valid. One doesn't work without the other."
- KB validity is a precondition for tool reliability
- Tool usage is what generates the corpus the KB durably captures
- Endgame folds both into the W4 trained model

This rules out my "tool first, KB byproduct" framing as a strategic stance. KB-shape investment is load-bearing now, not deferred.

## Distillation as the unifying frame

User pattern-matched what I'd been advocating piecemeal:

- **Workflow distillation** (slim the playbooks, drop SWE-1.6-shaped compensation)
- **Methodology distillation** (cut what doesn't survive compression into model weights)
- **Content distillation** (per-claim citation density, decision-table-first structures)
- **Eventual literal model distillation** (HF base + fine-tune)

These aren't separate concerns — they're the same operation at different layers. Phase 1 (now → W2): tool-first operationally, KB-shape investments accumulate as future training data. Phase 2 (W2 → W3): the corpus matures. Phase 3 (W3+): trained model carries the discipline that the heavy current workflow teaches in-context, freeing the workflow to be thin again.

**Practical implication:** discipline invested now should be the kind that survives compression into model weights — behavioral patterns and grounded reasoning, not stylistic preferences or process ceremony.

## Hydration model (recalibrated mid-review)

**Initial misread:** I framed the validity gap as "labeled validity" diverging from "actual validity" because of soft author-confidence labeling.

**User pushback:** *"I didn't write any of this — this was all derived from source documentation, help docs, API/SDK/Terraform/MCP docs."*

**Corrected understanding:**

The skill content is *derived from primary sources*, not authored from personal experience. The labeling discipline is binding via the four-tier verification protocol in `references/_meta/verification-protocol.md`:

| Tier | Evidence | Allowed confidence |
|---|---|---|
| A — source-verified | `vendor/<repo>/file:line` citation | `high` |
| B — behavior-verified or chain-of-evidence | Repro steps OR multiple Tier-A sources combined logically | `medium`, can rise to `high` after reproduction |
| C — operator-reported single-source | Operator account with conditions | `medium` ceiling, typically `low` |
| D — inferred / extrapolation | Flagged explicitly | `low` with explicit "extrapolation" note |

`confidence: high` is a citation-backed assertion, not an author-vibe label. The labeling at write time IS the validity.

**The real concerns (properly framed):**

| Gap | What it is | Status |
|---|---|---|
| `verified-against` SHA pin coverage | **Drift over time.** Initial extraction was Tier A; vendor source moved since | 19 of 87 confidence:high refs pinned. Renovate + check-vendor-drift handle the detection layer; coverage is improvable |
| Eval coverage | **User-question handling**, not source validity | 13 of 87 confidence:high refs covered. Mostly aspirational so far |
| Per-claim citation density | **Within-doc traceability.** A ref can be Tier-A overall without every paragraph having an inline cite | Acknowledged gap, IMPROVEMENTS-tracked. The QUIC failure mode is the canonical example |

## `/z-auditor` split (sharpened mid-review)

The recurring "audit the repo vs audit the tenant config" tension that's been in IMPROVEMENTS.md as a deferred item. User clarified the distinction:

| Audit shape | Inputs | Findings | Audience |
|---|---|---|---|
| **Repo audit** (current `/z-auditor`) | `references/`, `_meta/` | Lint, structural checks, hygiene | Maintainer (user + CC helpers) — Claude-only situation |
| **Tenant-config audit** (proposed subtype) | `_data/snapshot/<cloud>/`, possibly `_data/iac/`, log evidence | Camel-case mismatches, wildcards-against-recommendations, disabled rules, tmp-labeled rules, dead URL categories, 6-month-unused logs | End users / team |

These are the same *shape* (lint, surface findings, severity-tag) with different *inputs*, *findings*, and *audiences*. Subtype-parameterize rather than N+1 commands — flat cognitive surface preferred.

## Action items emerging from this review

1. **Chore automation as sustainability lever.** Inventory which manual chores currently consume personal time that could be machine-handled. The more rote work scripts catch, the less personal time burns. Concrete candidates: `verified-against` backfill, eval coverage backfill, per-claim citation density check (proposed IMPROVEMENTS), submodule update triage.

2. **`/z-auditor tenant-config` subtype.** Distinct shape from current repo-audit (input is tenant API dumps; findings are config-quality patterns; audience is end-user teams; same lint *shape* with different *substance*). Existing IMPROVEMENTS item should be promoted with the sharpened framing — it's not just "the original intent" deferred, it's a concrete subtype with a clear scope.

3. **Portfolio-map + tier schema cleanup** (full detail in IMPROVEMENTS.md). Audit produced specific findings:

   ### Audit findings

   - **Tier-1 depth variance is 14×** between top (zia, 41 files) and bottom (zbi, 3 files). Tier-1 label was based on "has SDK/TF" criterion but read as "deep coverage" by users — implying ZBI has ZIA-shaped depth, which it doesn't.
   - **Two duplicate dirs** about the same product, both `confidence: high` (citation-discipline failure):
     - `references/zwa/` and `references/workflow-automation/` cover the same Workflow Automation product
     - `references/zbi/` and `references/zero-trust-browser/` cover the same Cloud Browser Isolation product (Zero Trust Browser is the marketing name for ZBI)
   - **4 substantive products have dirs but aren't in portfolio-map at all**: `breach-predictor`, `business-insights`, `soc-workbench`, `zero-trust-branch`. Each has a 100+ line overview.md with proper Tier-A citations. Genuine map drift (map last-verified 2026-04-25, products added since).
   - **Schema mixed two axes**: structural (has-API) and coverage-depth (file count). Tier label moved when we wrote more docs, not when product changed — unstable as a tier criterion.

   ### Final tier schema

   Flat numeric T1-T5, no a/b sub-suffixes (sub-suffixes were historical drift from earlier sessions; user pushed back on "arbitrary asterisks"):

   | Tier | Criterion | Members |
   |---|---|---|
   | **T1** | Core product. Deep multi-component coverage. Where the skill earns its depth claim. | ZIA, ZPA, ZCC, ZIdentity, Cloud Connector, ZDX |
   | **T2** | Programmable but shallow — may not match a single T1 sub-component's depth | ZBI, ZWA |
   | **T3** | No API/IaC. Reasoning content (architecture, behavior, gotchas) exists | Deception, Risk360, AI Security, ZMS, AEM, DSPM, ITDR, UVM, Zscaler Cellular, Experience Center, Breach Predictor, Business Insights, SOC Workbench, Zero Trust Branch |
   | **T4** | Paragraph in portfolio-map only — low awareness | Resilience, BCC, CTEM, Cloud Protection, Posture Control, M365 Copilot, Red Canary MDR, MTH, B2B |
   | **T5** | Deprecated / historical / unreleased — watched for promotion | empty — reserved |

   ### Schema notes

   - **ZDX is T1 borderline.** It's the observability layer on top of the core access path, not in the path itself. Defensible as T1 by structural criteria (standalone SDK + multi-component); could move to T2 if the criterion were sharpened to "in the data path." Stay T1, flag as borderline.
   - **ZIdentity and ZDX are T1 with coverage gaps.** Both at 7 files. Core by importance; under-documented in the skill. Schema accepts under-coverage at T1 — file-count is a coverage signal, not a tier criterion.
   - **AppProtection should NOT have its own T1 row.** Sub-component of ZPA. Move portfolio-map to enumerate AppProtection inside ZPA's section.
   - **CASB stays as a disambiguation entry**, outside the tier system. CASB isn't a Zscaler SKU — it's a federation of ZIA features + DSPM. Keep the existing "disambiguation, not a separate product" treatment.
   - **Architectural pillars** (Zero Trust Exchange, Data Fabric for Security, Agentic SecOps) are not products — they're marketing umbrellas / capability layers across products. Stay outside the tier system entirely.

   ### Three concrete cleanup actions (in IMPROVEMENTS.md)

   - **A.** Consolidate the two duplicate dirs (delete marketing-named, keep SDK-named, add aliases in portfolio-map)
   - **B.** Fold the 4 orphans into portfolio-map's T3 enumeration
   - **C.** Apply the tier reshuffle in portfolio-map.md and SKILL.md (T1/T2a/T2b/T3 → T1/T2/T3/T4/T5; ZBI/ZWA T1 → T2; AppProtection out of T1 row)

## Branches not reviewed (open hooks for future reviews)

- **Multi-product scope** — addressed quickly in synthesis. The tier system IS the answer to "spread too thin" (Tier 1 depth, Tier 2 awareness, Tier 3 out of scope). Defensible. Not worth re-reviewing unless the tier system itself needs interrogation.
- **Vendoring strategy specifics** — 14+ submodules; the lazy-cite pattern. Question I meant to ask: do all currently back active claims, or is "might be useful later" accumulating? Lower-priority.
- **HF fine-tune timeline / corpus needs** — conceptual-only for now; surface when the W2 → W3 transition gets closer.
- **Workflow slim-down strategy** — top-down vs bottom-up, queued for a future sprint per user signal.
- **Token budgets / decision-table-first authoring** (from zscaler-terraform-skills observations last session) — IMPROVEMENTS-tracked; not actionable until a Windsurf-workflow experiment is run.

## Meta — about the review itself

Structured review as a tool: **keep installed, useful.** Worked as advertised — interview style produced real recalibrations rather than just nodding. The user absorbed pushback and produced corrections (time budget, North Star, hydration model). The review produced both *durable shared understanding* (this artifact) and *concrete action items* (above) — value above and beyond the per-question surface.

The skill itself doesn't prescribe writing this artifact. That's a gap in the skill design — high-value sessions need explicit capture or value evaporates with the session. Future review sessions should default to writing to `plans/<date>-<topic>.md` per the directory convention now established.
