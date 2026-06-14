# @zscaler intent router + capability registry

**Status:** design (v2, after cross-model review) · **Date:** 2026-06-14 · **Origin:** "grounding + routing layer" / agent-hub front-door discussion

**Review provenance:** v1 reviewed by Claude (Sonnet), Codex (GPT), and Gemini — all ground-truthed against the actual `@zscaler` workflow/prompt + data contract. All returned "revise, then ship Increment 1," converging on: structured intent matching, migrate from `prompt.md` (not just AGENTS.md), registry lint/`last-verified`, YAML-not-JSON, keep registry ≠ linkage. v2 also folds in the higher-value catches: state-carrying hand-off, the "invisible refactor" fix, the load/invoke gate-integrity boundary, and the discovery-vs-creation correction on the generator.

## Problem

`@zscaler` is today ad-hoc grounded Q&A. Two forces push it toward being a **front door**:

1. **The skill is becoming a grounding + routing layer** — shedding the *doing* (creds/SDK → `zscalerctl` + external repos own execution). Its job is to ground answers and point to the right capability.
2. **Capabilities are federating** — internal roles (investigator/auditor/soc/architect/retro/researcher) and external repos that own their own skills/mcps (e.g. `zscaler-as-code`).

Users shouldn't need the incantation (`/z-auditor`…) or to know which repo owns a thing. `@zscaler` should **load knowledge and route by intent** — internal or external — without forcing explicit invocation.

This exists in embryo, and is **further along than v1 implied**: the real routing logic is in `agents/zscaler/prompt.md` (a crisp escalation grammar — e.g. `/z-investigator` fires only on **symptom + affected scope + timeframe**), not just the flat `AGENTS.md:15-29` list. This design turns that *prompt-level escalation grammar* into a data-driven, lintable registry and makes `@zscaler` an active, honest router over it.

## Core principle: honest hand-off = no-fabrication applied to *capability*

- Route on **structured, high-confidence intent**; when ambiguous, **surface candidates and ask** — never silently pick the wrong door.
- When the registry can't prove an owner, **say unknown** — don't guess. (Absent fork overlay ≠ "no external owners" — say "I don't know who owns this in your environment.")
- Be **transparent**: *suggest* vs *load* vs *point-to-external* — never silent magic.
- **Gate integrity (hard boundary):** routing or `load` must never let `@zscaler` bypass a role's MCP gates or answer-from-artifact rules. A routed/loaded role still runs its own gates; the router hands off *to* the discipline, it doesn't *replace* it.

## Architecture

### Capability registry (the seam — structured data)

YAML (humans and LLMs reason over it better than JSON), at `agents/_meta/capability-registry.yaml`, with a committed JSON Schema + validator. Each entry:

```yaml
- id: investigator
  kind: internal-role            # internal-role | external-owner
  intent:
    requiredSignals: [symptom, affected-scope, timeframe]   # ALL must be present
    cueSignals: ["why is", "broken", "failing", "regression"]
    negativeSignals: ["how do I set up", "audit"]            # suppress on these
    examples: ["zpa app X intermittently fails for site Y since tuesday"]
    threshold: all-required        # all-required | any-cue | n-of
  where: agents/investigator/workflow.md   # internal: workflow; external: repo+path / _data mount
  review: "symptom + scope + timeframe; see prompt.md escalation test"
  owner: zscaler-investigator              # skill/mcp that owns it
  engageHow: suggest                       # suggest | load | point | invoke
  lastVerified: "2026-06-14"
  authorStatus: reviewed
```

- **Internal-role entries** = public-safe, committed. Carry `lastVerified`/`authorStatus` like `workflow.md`.
- **External-owner entries** = fork/tenant-specific → **fork overlay under the `_data` mount** (gitignored), the `_data/iac` model. Committed registry holds a public *stub* (`kind: external-owner`, `engageHow: point`); the fork overlay supplies real `where`/`owner`.
- **The investigator three-field test is encoded, not flattened** — `requiredSignals + threshold: all-required` preserves `prompt.md`'s precision; that specificity per entry is what stops single-keyword misrouting.

### `@zscaler` router

Loads grounding + registry; classifies intent against the structured signals; acts per `engageHow`:
- **internal / suggest** → recommend the role **with a state-carrying hand-off** (below).
- **external / point** → honest hand-off: where/what/who-owns/how-to-engage. No hot-load.
- **ambiguous** → present candidate routes + one clarifying question.
- **unknown** → admit it.

### State-carrying hand-off (the Increment-1 payoff)

A hand-off must not make the user repeat themselves (the "amnesiac hand-off" — switching roles drops context). So a suggestion ships a **context capsule**: the distilled problem statement the next role needs, e.g. `/z-investigator` *with* "symptom=…, scope=…, since=…". This is the user-visible value that makes Increment 1 more than a refactor.

### `engageHow` maturity ladder

Same architecture at different settings; flipping a value is additive:

```
suggest (+ state capsule)  →  load (internal: @zscaler loads the role's workflow, gates intact)
                           →  point (external: provenance hand-off, no execution)
                           →  invoke (future: a hub drives the external skill/mcp)
```

## Incremental delivery

- **Increment 1 (MVP):** structured registry for the **internal roles** (YAML + schema + lint) migrated from `prompt.md`'s escalation grammar; `@zscaler` routes against it and produces **state-carrying suggestions/hand-offs**; the AGENTS.md routing block is **auto-generated from the registry**. Visible value: better routing + no-repeat hand-offs. `@zscaler` stays prompt-scaffolding (no MCP server).
- **Increment 2:** external-owner entries via the `_data` fork overlay (added to the data contract as *optional*, not breaking existing mounts) + honest external hand-off (`point`).
- **Increment 3:** internal `load` — `@zscaler` loads a routed role's workflow directly, **gates intact** (must not bypass role MCP/answer-from-artifact).
- **Increment 4 (future):** `invoke` — a hub drives external skills/mcps (intent-not-power boundary).

Each increment is independently useful and earns the next.

## AGENTS.md, drift, and lint

The registry is the single source of truth. The `AGENTS.md` routing block is **auto-generated from it** (precedent: the vendored `zscaler-mcp-server` auto-generates docs from its tool inventory) — humans still read AGENTS.md, but it can't drift from the registry. A lint (extend `check-workflow-metadata.mjs` or a sibling) validates: required fields, `where` paths resolve, `intent.requiredSignals`/`cueSignals` non-empty, `lastVerified` present, and the AGENTS.md block is in sync.

## On the scaffold generator (DAV-11 PR5) — corrected

The registry solves **discovery** (which role do I need?), not **creation** (how do I build a new role?). These are different problems, so the registry doesn't *replace* the generator — but PR5 stays low-value on its own merits (only one register-shaped role left; PR1/PR2 libs already cut creation cost). **Recommendation: don't build PR5.** If role-*creation* toil bites later (there are still manual "add a role" steps in `agents/README.md`), address it with a lightweight **validator/checklist** that the registry lint already half-covers — not a code-stamping generator.

## Non-goals

- Hot-loading / hub invocation (Increment 4).
- Owning/editing/executing external repos' tooling.
- Cross-role linkage (separate deferred thread; the registry may *feed* it but doesn't share its per-case data model).
- Turning `@zscaler` into a register-shaped role (it's a router).

## Data / privacy

Internal registry = public-safe, committed. External overlay = fork-private under `_data` (gitignored), same scrub discipline as the rest of `_data` (cf. `scrub-iac-attribution` — reading private infra location/ownership must not leak into public artifacts).

## Resolved decisions

1. **Format/location** → YAML at `agents/_meta/capability-registry.yaml` + JSON Schema + validator; fork overlay under `_data` (optional, added to the contract).
2. **Intent classification** → lightweight but *structured* (required/negative/cue signals + threshold + examples); keep the investigator three-field test first-class; "ambiguous → ask." No classifier infra.
3. **AGENTS.md** → auto-generated from the registry (supersedes hand-maintained prose; humans still see it; lint prevents drift).
4. **Registry vs linkage** → distinct data models; registry may be referenced by linkage but doesn't carry per-case state.
