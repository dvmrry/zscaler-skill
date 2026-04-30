---
product: shared
topic: "kit-charter"
title: "The kit charter — standing principles for engineers and agents"
content-type: reference
last-verified: "2026-04-30"
confidence: high
sources: []
author-status: draft
---

# The kit charter

A standing constitution for how this skill kit operates. Read once and internalize; it doesn't need to be re-read every session. Invoke via `/z-charter` in Claude Code when starting maintenance work to reload the principles into the active session.

**Not auto-loaded** in any agent surface (CC, Windsurf, etc.) — every session's context budget belongs to content, not meta. The charter is opt-in.

## Why this exists

The kit is consumed by **both** engineers (curated knowledge base) and AI agents (operator-grade scaffolding). Both audiences benefit from explicit standing principles — a short read that establishes "how we operate here" without requiring archaeology through commits or sub-docs.

These aren't "AI rules." They're design principles the kit embodies. They apply to anyone (human or agent) editing the kit, authoring content, running playbooks, or proposing changes.

---

## 1. Public / private boundary

The public skill kit holds **only**:

- Zscaler-published schemas, conventions, and field names
- Vendor-source bibliography (SDKs, Terraform providers, Postman, help-doc captures) as pinned references
- Methodology docs, playbooks, query templates with **placeholder plumbing**
- Generic behavioral patterns that any tenant could adopt

The **private** side (your fork, `CLAUDE.md`, `_data/`, local memory entries) holds:

- Tenant identifiers (cloud names, customer IDs, indices, sourcetypes)
- Snapshot data (per-cloud config dumps, `_data/snapshot/<cloud>/`)
- Custom enrichments and field aliases
- Internally-generated test data

Concrete enforcement: Splunk catalogs use `$INDEX_*` env-var placeholders, never literal values. Tenant schemas are captured locally only. The verification rule applies to bundles too — verified bundles can ship publicly with placeholder plumbing; speculative bundles stay private.

See [`siem-emission-discipline.md`](../shared/siem-emission-discipline.md) for the full framework.

## 2. Verification discipline

Anti-fabrication is the north star.

- **Every claim has a source.** File path + line number, vendor doc citation, tool call output, or direct test result. "An experienced operator would know" is not a source.
- **Citation discipline is checkable.** Hygiene scripts validate that frontmatter `sources:` paths resolve and that cited files exist. Future direction: tool-call-anchored claims (every assertion in a register traces to a specific tool invocation).
- **Confidence calibration is honest.** `high` requires multi-source evidence. `medium` requires at least one cited source plus an honest acknowledgment of gaps. `low` is for exploratory or speculative content.
- **Defer when speculative; ship when verifiable.** Bundle templates ship empty by design — speculative bundles defeat the verification-gating principle the templates are built around.

## 3. Soft + hard pairings

Every soft guideline pairs with a hard check.

- Status enum (soft) ↔ enum-validation in `check-hygiene.py` (hard)
- "Citations required" (soft) ↔ `check-citations.sh` and frontmatter validation (hard)
- "Verified bundles only" (soft) ↔ verification-field gating in bundle templates (hard)
- Vendor sources stay pinned (soft) ↔ `check-vendor-drift.py` flagging drift (hard)
- "Tenant data stays private" (soft) ↔ placeholder plumbing convention plus `_data/` gitignore (hard)

We don't accept ungated rules. When a new soft guideline lands, it gets paired with a check, OR it gets logged in `IMPROVEMENTS.md` as a determinism gap to close. See the "Determinism beyond scripts" framing entry there for the full pattern.

## 4. Calibration norms

- **Severity / risk / status are enums, not free-text.** Audit findings: `Critical / High / Medium / Low / Info`. Architect risk: same. Status: per-archetype lifecycle (`Open → Confirmed → Resolved`, etc.). Never invent a new status mid-investigation.
- **Don't inflate.** Pick the lowest applicable level. Inflated severity drowns real urgency; inflated confidence misleads readers and downstream agents.
- **Don't declare `Resolved` without verification.** "I edited it" is not the same as "the finding no longer holds." Re-run the check, re-read the file.
- **Don't pivot between hypotheses without explaining why the previous one was ruled out.** Discovery journals track the reasoning trail; pivots without rationale are silent assumption shifts.

## 5. Design for the weakest model in routine rotation

Workflows are designed for the weakest model someone routinely runs them under. Currently that's SWE-1.6 in Windsurf for some users; CC's Sonnet/Opus for others. Tightening for the weak model doesn't penalize strong-model sessions — they extract the same procedural value plus headroom. Failing to tighten penalizes weak-model sessions immediately.

Specific implications:

- Numbered procedural steps in playbooks (forces step-by-step execution)
- Status enums rather than free-form qualifiers (constrains output space)
- "Will NOT do" sections (gives explicit permission to refuse fuzzy expansion)
- Verification gating fields (turns judgment into checkable structure)

See [`windsurf-runtime-notes.md`](../shared/windsurf-runtime-notes.md) for the runtime conventions that make this concrete.

## 6. Workflow discipline

Maintaining the kit follows the same rigor it asks operators to follow.

- **Pre-push hook** at `.githooks/pre-push` runs the full hygiene suite locally before any push proceeds. Activate per-clone with `git config core.hooksPath .githooks`.
- **Branch protection on `main`** requires the `hygiene` status check to pass. Direct pushes by admins are allowed (so a fire can be put out), but failed CI is visible immediately.
- **Feature branches for non-trivial changes.** Trivial changes (typos, README tweaks, one-line fixes) can go direct-to-main. Anything more — new playbook, structural sweep, schema change — uses a feature branch and a PR. The PR is a self-review checkpoint, not bureaucracy.
- **Nothing red ever sits as HEAD of `main`.** If hygiene breaks, the next commit fixes it before further work proceeds. The `Doc hygiene` badge in the README is the public health indicator.
- **The kit dogfoods its own discipline.** When the kit's own state is in question — broken citations, orphan files, schema drift — `/z-investigate`, `/z-audit`, and `/z-architect` apply to the kit itself, not just to Zscaler tenants.
- **Incidents become artifacts.** Production breaks, regressions, hygiene failures, or other reactive triages with consequences worth remembering get saved at `_data/incidents/<YYYY-MM-DD>-<slug>/` per the convention in [`../../_data/incidents/README.md`](../../_data/incidents/README.md). Journal / timeline / postmortem are the analytical layer; raw artifacts go in `evidence/` (gitignored by default). The whole incident tree is private-by-default; engineers explicitly opt-in to publish.

## 7. When to refuse

Explicit non-decisions, kept here so they don't get re-proposed by accident:

- **Speculative bundles** — bundle templates require a `verification:` field with a real ticket / lab repro / vendor-doc citation. "Plausible content an experienced analyst would write" is not acceptable.
- **Tenant-specific values in public docs** — placeholder plumbing only. The user's actual index names, sourcetypes, customer IDs, ticket numbers, and sample values stay in their fork or local config, never in `references/`.
- **Inflated confidence** — `confidence: high` without ≥2 cited sources gets caught by hygiene (with a small set of exemptions for index / curator / primer files documented in [`README.md`](./README.md) § Conventions).
- **Memory-as-constraint** — Claude Code auto-memory and Windsurf memory are useful continuity signals (carrying user preferences across sessions), but NOT determinism mechanisms. Compaction, cross-session reads, and the absence of an introspectable hard check make memory unsuitable as a load-bearing constraint. See `IMPROVEMENTS.md` "Determinism beyond scripts" § "Not a determinism pattern."
- **Subagent-as-determinism for cross-agent work** — Claude's Agent tool is CC-specific; Windsurf workflows can't invoke other workflows. Subagent / multi-agent rubric review is genuinely deterministic when used (bounded producer-reviewer pair, shared rubric), but only a CC-mode-only enhancement. Don't treat as a portable pattern.

## How to use this charter as an agent

If you're a Claude Code session that just loaded this via `/z-charter`:

1. Read the seven principles above.
2. Apply them to whatever maintenance task triggered the load.
3. When in doubt about whether a proposed change fits — re-read principles 2 (verification) and 7 (refusal patterns).
4. If you're proposing a change that doesn't fit, surface it explicitly rather than rationalizing — the charter is opt-in, but a session that ignores it after loading it has gone off-scope.

## How to use this charter as an engineer

1. Read it once at the start of any maintenance cycle.
2. Use it as a kit-wide style guide when authoring new content.
3. When a colleague (human or agent) proposes a change that contradicts a principle, name the principle being violated rather than relitigating from first principles.
4. Update this doc when a principle changes — every change leaves a dated note in commits, the same way `IMPROVEMENTS.md` items move between status sections.

## Cross-links

- [`README.md`](./README.md) — what's in `_meta/` and why
- [`troubleshooting-methodology.md`](../shared/troubleshooting-methodology.md) — discovery journal, claim status, anti-patterns
- [`audit-methodology.md`](../shared/audit-methodology.md) — audit register, severity, status lifecycle
- [`architect-methodology.md`](../shared/architect-methodology.md) — recommendation register, risk, confidence
- [`siem-emission-discipline.md`](../shared/siem-emission-discipline.md) — public/private boundary in concrete form
- [`windsurf-runtime-notes.md`](../shared/windsurf-runtime-notes.md) — runtime conventions that shape weak-model design
- [`../../IMPROVEMENTS.md`](../../IMPROVEMENTS.md) — kit-level backlog, including the "Determinism beyond scripts" framing
