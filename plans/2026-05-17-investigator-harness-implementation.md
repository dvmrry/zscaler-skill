---
title: "Investigator Harness Implementation Plan"
date: "2026-05-17"
status: draft-implementation-plan
scope: "canonical investigator harness extraction and runtime preservation"
source-review: "PR #24 agent skill runtime migration review"
---

# Investigator Harness Implementation Plan

## Executive Summary

The review loop for PR #24 converged on one gate before any
`z-investigator-v2` work: lift or name the investigator workflow harness under
`agents/investigator/` so portable skills and runtime adapters can point at one
canonical checkpoint contract.

This plan prepares that implementation. It does not replace the current
Windsurf `/z-investigator` workflow. The first implementation PR should create
the canonical harness, wire references to it, and preserve the current Windsurf
adapter as the known-good baseline.

Implementation update: downstream Windsurf testing showed that prose-only
Step 1 instructions inside the monolithic adapter were still too soft. The
public-safe path is now:

- keep `/z-investigator` as the user-facing command;
- keep `.windsurf` runtime files as adapter surfaces, not source of truth;
- add a canonical Step 1 case intake under `agents/investigator/`;
- add a small Node stdlib helper that creates and verifies
  `case-intake.md`,
  `case-intake.json`, and `journal.md`;
- keep `/z-investigator-resume` as an optional resume path for an existing case,
  not as the normal new-investigation flow.

Recommended canonical file:

```text
agents/investigator/harness.md
```

`harness.md` is clearer than `checkpoint-contract.md` because the file owns more
than checkpoints: phase order, halt-and-wait behavior, output shape, early
journal creation, snapshot-load discipline, and subsequent-turn cadence.

## Accepted Constraints

From the PR #24 review round:

- `agents/investigator/prompt.md` is not the full runtime contract by itself.
- `.windsurf/workflows/z-investigator.md` currently carries load-bearing
  harness behavior.
- The Windsurf baseline must remain intact until a candidate has parity
  evidence.
- Portable skills are discovery/loader surfaces, not canonical workflow truth.
- Runtimes may interpret the same primitive differently; do not assume a skill,
  command, workflow, and adapter are equivalent.
- The next real migration step is not `z-investigator-v2`; it is canonicalizing
  the harness.

## Non-Goals

Do not do these in the harness implementation PR:

- Replace `.windsurf/workflows/z-investigator.md`.
- Add `.windsurf/workflows/z-investigator-v2-loads-skill.md`.
- Add `.windsurf/workflows/z-investigator-v2-loads-prompt.md`.
- Thin the Windsurf baseline adapter.
- Implement a full multi-phase JSON workflow schema beyond the narrow Step 1
  case intake gate.
- Add maintainer skill loaders whose canonical prompts do not exist.
- Touch private overlay or downstream generated adapter details.

## Target Shape

### 1. Canonical Harness

Add:

```text
agents/investigator/harness.md
```

Suggested frontmatter:

```yaml
---
role: investigator
artifact: harness
title: "Investigator harness — checkpoint and phase contract"
content-type: prompt
last-verified: "2026-05-17"
confidence: high
source-tier: practice
sources:
  - ".windsurf/workflows/z-investigator.md"
  - "agents/investigator/prompt.md"
  - "agents/_meta/runtime-adapters.md"
  - "agents/_meta/windsurf-runtime-notes.md"
author-status: draft
---
```

The harness should be runtime-neutral. It may say "use your file-read tool" or
"use your file-write tool", but it should not depend on Windsurf-only UI
behavior.

### 2. Harness Content

Extract and normalize these load-bearing sections from the current Windsurf
baseline:

- Procedure model: three sequential steps, prior-step confirmation required.
- Context budget: load tight, expand on demand.
- Critical constraints:
  - one clarification per turn
  - pre-Step-1 vs full-Step-1 split
  - blocking vs non-blocking unknowns
  - no file loads or hypotheses before the checkpoint allows them
- Per-turn output format:
  - clarification-only turn shape
  - Step 1 full turn shape
  - Step 2 turn shape
  - Step 3 turn shape
  - subsequent investigation turn shape
- Step 1:
  - parse framing
  - proposed docs-only loads
  - framing-to-file mapping
  - early journal stub creation before Checkpoint 1
  - Checkpoint 1 behavior
- Step 2:
  - docs first, then snapshot
  - snapshot enumeration
  - evidence directory enumeration
  - docs-informed snapshot selection
  - selected file loading
  - user-flagged specific searches
  - LOADED block shape
  - chain traversal on demand
  - Checkpoint 2 behavior
- Step 3:
  - generate discovery journal
  - save journal to disk without asking permission
  - working-directory precondition
  - same-file update discipline
  - Checkpoint 3 behavior
- Subsequent turns:
  - one investigation action per turn
  - update journal
  - save journal
  - halt with next-choice block

Keep `_data/snapshot/<cloud>/` as the canonical public path. Mention fork
fallbacks only where the existing baseline already does.

### 3. Prompt Wiring

Update `agents/investigator/prompt.md`:

- Add `harness.md` to `sources:` or `dependencies:` as appropriate.
- Replace vague "per the workflow harness" language with a direct link to
  `harness.md`.
- Keep the prompt focused on investigator role, reasoning discipline, grounding,
  and evidence handling.
- Do not copy the full harness into the prompt.

### 4. Portable Skill Wiring

Update `.agents/skills/zscaler-investigator/SKILL.md`:

- Required load list should include both:
  - `../../../agents/investigator/prompt.md`
  - `../../../agents/investigator/harness.md`
- State that `prompt.md` defines role/reasoning and `harness.md` defines
  checkpoint/phase behavior.
- Keep runtime policy scoped: dedicated `/z-investigator` adapters remain
  authoritative in runtimes that have them until parity testing replaces them.

### 5. Runtime Adapter Treatment

For the first harness implementation PR:

- Preserve `.windsurf/workflows/z-investigator.md` behavior.
- Do not thin it.
- If touching it, restrict changes to cross-linking or comments that identify
  `agents/investigator/harness.md` as the canonical harness it currently
  reinforces.
- Do not add v2 adapters yet.

During this transitional window, `agents/investigator/harness.md` and the
un-thinned Windsurf body are a deliberate dual-maintenance pair. Any behavior
change to one must either update the other in the same PR or explicitly document
why the two are allowed to diverge. This risk remains until A/B parity evidence
supports replacing the Windsurf body with a thin loader.

Downstream Windsurf testing supports a "thicker thin shim" target rather than a
minimal one-line loader. Even after the body is thinned, the Windsurf adapter
should retain runtime-local reinforcement for file-write/readback discipline,
plain monospace paths, literal file enumeration, mechanical checkpoint
preconditions, and the mapping-driven load list. Those are runtime-behavior
guards, not product knowledge.

Follow-up downstream testing also showed that prose-level "write and read back"
instructions are not deterministic enough. Step 1 artifact creation must be a
helper-backed transaction that creates and verifies the case intake JSON,
case intake markdown, and journal stub before the checkpoint is rendered.
Step 3 journal saves can later adopt the same write/readback/marker
verification pattern before `Journal saved`.

This creates a temporary duplicate-by-design state:

```text
agents/investigator/harness.md          canonical harness
.windsurf/workflows/z-investigator.md   known-good reinforced baseline
```

That duplication is acceptable only until candidate adapters are built and
tested.

### 6. Meta-Doc Cross-Links

Update:

- `agents/README.md`
  - Add `harness` to the investigator artifact list.
  - Mention that harness files are canonical phase/checkpoint contracts.
- `agents/_meta/windsurf-runtime-notes.md`
  - Cross-link to `agents/_meta/runtime-adapters.md`.
  - State that the "design for the weakest model" rule is formalized as
    canonical harnesses under `agents/**`.
- `agents/_meta/runtime-adapters.md`
  - If needed, replace generic `agents/investigator/` language with a direct
    link to `agents/investigator/harness.md` after the file exists.

### 7. Checker Updates

Update `scripts/check-agent-skills.py` only if useful and low-risk:

- Verify `zscaler-investigator` references `agents/investigator/harness.md`.
- Keep the large Windsurf adapter warning non-blocking.
- Keep stale adapter path warnings advisory unless `--strict-adapters` is used.

Do not overfit the checker to every future harness shape in this PR.

## Implementation Sequence

1. Start from a clean runtime-migration branch after PR #24 is merged or rebased.
2. Create `agents/investigator/harness.md` by extracting the Windsurf baseline
   harness into runtime-neutral language.
3. Update `agents/investigator/prompt.md` to depend on and link to the harness.
4. Update `.agents/skills/zscaler-investigator/SKILL.md` to load both prompt and
   harness.
5. Add meta-doc cross-links.
6. Optionally add the narrow checker assertion that `zscaler-investigator`
   references the harness.
7. Run local validation.
8. Open a PR that explicitly says it preserves the current Windsurf baseline and
   does not add v2 adapters.

## Validation

Run:

```text
./scripts/check-agent-skills.py
./scripts/check-hygiene.py
python3 scripts/check-doc-links.py
git diff --check
```

Manual validation checklist:

- `agents/investigator/harness.md` contains every baseline behavior category in
  "Harness Content" above.
- `agents/investigator/prompt.md` links to the harness instead of vaguely
  referencing an unnamed workflow harness.
- `.agents/skills/zscaler-investigator/SKILL.md` loads both prompt and harness.
- `.windsurf/workflows/z-investigator.md` is not behaviorally thinned.
- No `_data/snapshots/` plural path is introduced.
- No runtime-specific skill mirror is added.
- No `z-investigator-v2` file is added.

Expected checker state:

- `check-agent-skills.py` passes.
- One non-blocking large-adapter warning for `.windsurf/workflows/z-investigator.md`
  may remain until the v2 migration exists.

## Acceptance Criteria

The harness implementation PR is ready when:

- The canonical harness exists at `agents/investigator/harness.md`.
- Prompt, portable skill, and meta-docs all point at it.
- The current Windsurf baseline remains available and behaviorally intact.
- Static checks pass with only known advisory warnings.
- The PR body states that candidate adapters and artifact schemas are deferred.

## Deferred Work

After this plan is implemented:

1. Build two candidate adapters:
   - `.windsurf/workflows/z-investigator-v2-loads-skill.md`
   - `.windsurf/workflows/z-investigator-v2-loads-prompt.md`
2. Run the parity rubric from
   `plans/2026-05-17-agent-skill-runtime-migration.md`.
3. Choose one candidate path.
4. Only then consider replacing or thinning the current Windsurf baseline.
5. Later, add structured workflow artifacts under
   `_data/cases/<slug>/workflow/` and validators for those artifacts.

Current narrow artifact gate:

```text
_data/cases/<slug>/
  case-intake.md
  case-intake.json
  journal.md
```
