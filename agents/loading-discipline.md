---
topic: "loading-discipline"
title: "Loading discipline — stage announcements and context budgets"
content-type: reference
last-verified: "2026-07-26"
confidence: medium
source-tier: practice
sources:
  - "Internal UX practice — Cascade silent-think anti-pattern; long answer pauses without surfaced action read as stuck"
  - "Skill Creator progressive-disclosure guidance — keep core instructions lean, load detailed references only when needed"
  - "agents/siem-emission-discipline.md (parallel cross-cutting discipline pattern)"
  - "docs/data-contract/knowledge.md (operational-knowledge loading and disclosure contract)"
author-status: draft
---

# Loading discipline

Long pauses without surfaced action read as stuck. Especially in Cascade and other runtimes where the model thinks silently between user-visible turns. A short stage line — *what's about to happen*, not *progress* — gives the user a "things are alive" signal without claiming false precision.

This file is the contract for those announcements and for bounded context
loading. The intent is consistency over speed: if every role uses the same
phrasing for the same kind of action, and the same rules for what *not* to load,
the user's mental model stays steady across surfaces. Roles that opt into this
discipline declare it as a dependency in their prompt frontmatter.

## Contract

A stage line:

1. Is **not** a progress bar. No percentages. No spinners. No bytes-loaded counters.
2. Fires **only before real I/O or verification work** — a file load, a directory grep, a SIEM query, an API call, a checkpoint wait. Not before pure-reasoning steps.
3. Is **one line, declarative, present-tense**. No leading filler ("Just one moment…"), no trailing hedges ("…hopefully I'll find it").
4. Does **not heartbeat**. If a stage takes longer than expected, say so once. Don't issue periodic updates to fake liveness.
5. Is **suppressed for trivial / in-context answers**. If the answer is already in the conversation context and no I/O is needed, say nothing — go straight to the answer.
6. Uses the **fixed stage vocabulary** below. Models that pick fresh wording each turn destroy the consistency-over-speed value.
7. Never claims a source was checked until it was actually read, searched, or queried. The line precedes the action and reflects what is truly about to happen.

## Context budget

Treat the context window as a shared runtime resource. Load the smallest
artifact that can answer the current question, then stop.

1. **Route, then read.** For Zscaler knowledge, resolve
   (`node scripts/kb.mjs resolve <id | product | words>`); for anything else,
   use workflow metadata, the capability registry, or a short `rg` search to
   choose a source. Do not open product folders, runbooks, or vendor trees
   before a concrete question points there.
2. **Prefer indexes before bodies.** A product resolve lists its areas; load
   `agents/**/grounding/index.md` or a source viewer index before child cards.
   Read a child only when the index names it as relevant.
3. **Resolve, don't page in.** A subject bundle carries its claims, gaps and
   neighbors; old clarification IDs (`zia-02`) resolve to their gaps. Do not
   read or grep the graph's JSON files to answer.
4. **Default search exclusions.** Broad searches should exclude local runtime
   copies and generated/stale workspaces: `--glob '!.claude/worktrees/**'`.
   Exclude raw vendor source under `vendor/**` unless the current workflow
   explicitly asks for source verification, SDK/TF/API surface checks, or
   citation repair. **Exception:** `vendor/zscaler-api-specs/automate-zscaler/`
   (the captured API contract, divergences, rosetta, and the `issue-routing`
   worklist) is reference-grade reconciliation data, not raw vendor source —
   search it like `references/**`, not like a vendor tree.
5. **Treat `_data/` as scoped evidence, not reference background.** Search
   the overlay's IaC (`_data/overlay/`, `_data/iac/`), `_data/cases/`, or run a read-only `zscalerctl` command only when the question is
   tenant-specific, case-specific, or deployment-specific. Operational knowledge
   follows the narrower v1 rule below.
6. **One-pass answer budget.** For ad-hoc Q&A, aim for one primary reference
   plus one clarification check. Add more only when the user asks for a
   comparison, conflict, or cross-product behavior.
7. **Record what mattered.** Procedural roles with artifacts should record the
   files actually used, not every file considered. Rejected broad searches do
   not belong in evidence ledgers.

### Operational knowledge (v1)

Company knowledge arrives through the resolver: with an overlay configured,
`node scripts/kb.mjs resolve` merges its active records into each bundle as
`layer: company` facets, so no workflow reads the overlay's files to find them.
Follow [`docs/data-contract/knowledge.md`](../docs/data-contract/knowledge.md)
for the answer-time disclosures. A missing overlay, or no facets, is silent; an
invalid overlay is reported by `scripts/check-data-contract.mjs`, not at answer
time.

Researcher and auditor have a hard exclusion: their output is upstream-bound, so
they resolve with `--no-overlay` and never load the overlay or the retired
`<mount>/knowledge/`, including when a broad search or user-supplied scope would
otherwise include them.

**Safety boundaries are not budgeted.** A doc that prevents a harmful action —
`agents/siem-emission-discipline.md` (tenant-data / SIEM emission rules) — is a
required read for any emit-capable role, loaded eagerly, never deferred to an
on-demand trigger. A leak rule loaded only when the model remembers it is not a
control. Context-budget trimming applies to reference material, not safety
boundaries.

If a task genuinely needs broad source mining, switch to the researcher or
auditor workflow instead of turning the ad-hoc surface into an unbounded crawl.

## Stage vocabulary

Pick the most specific stage that fits. Capitalize only the first word. Backtick concrete paths and identifiers.

| Stage              | Use when                                                  | Example                                                          |
|--------------------|-----------------------------------------------------------|------------------------------------------------------------------|
| `locating source`  | Deciding which file/dir to read; pre-load orientation     | `Locating source for ZIA URL filtering precedence.`              |
| `reading <path>`   | About to load a specific file                              | `Reading kb:zia.url-filtering.`                       |
| `searching <dir>`  | About to grep / rglob a directory tree                     | `Searching _data/iac/zia/ for matching rules.`        |
| `querying <name>`  | Dispatched a SIEM / API call                              | `Querying Splunk for connector availability metrics.`            |
| `checking citations` | Verifying claim-to-source pairing after reads complete   | `Checking citations against 3 loaded references.`                |
| `composing answer` | Synthesis stage after all reads complete                   | `Composing answer from 3 loaded sources.`                        |
| `waiting for user` | At a checkpoint or handoff. **Procedural roles only.** `@zscaler` does not use this — the ad-hoc surface is conversational, not turn-gated. | `Waiting for user — Checkpoint 1.` |

If none of these fit cleanly, prefer silence over inventing a new label. Out-of-vocabulary stage lines should be rare; they weaken the stable mental model this discipline exists to build.

## Tool preference

Stage announcements describe actions performed via the host runtime's built-in tools, not shell exec. Use the runtime's built-in read tool to load files, its grep/search tool to scan text, and its glob/find tool when discovering paths by pattern. Built-in tools render in the IDE's tool view, fit the runtime's permission model, and avoid unnecessary shell prompts. Reach for shell exec only when the operation is genuinely shell-shaped: chained pipes, sub-shell behavior, script invocation, or a command that cannot be expressed through the built-in API.

## When to announce

Announce before:

- Loading a file the user can't see being loaded
- Grepping a directory the user didn't name
- Dispatching a SIEM query or API call
- Composing the final answer when synthesis is non-trivial (multiple sources, cross-referencing)
- Halting at a procedural-role checkpoint (procedural roles only)

Do not announce before:

- Answering from content already in conversation context
- A sub-second pause that the user won't perceive
- Pure reasoning steps with no I/O behind them
- A second invocation of a stage that was already announced (no heartbeats)

## Honesty rules

- Announce only what you're actually about to do. Don't insert announcements for tone — silence is preferable to filler.
- If a planned read fails (file missing, grep returns nothing), say so explicitly on the next line. Don't pretend the read succeeded.
- If you find yourself wanting to announce "I'm thinking…" — that's the signal that the next stage shouldn't be announced at all.

## Anti-patterns

- ✗ `Loading 30%…` — no actual progress signal exists; this is fake.
- ✗ `Thinking deeply about your question…` — filler, no I/O behind it.
- ✗ `I'm going to consult my knowledge…` — vague; "knowledge" is not a source class.
- ✗ `Let me explore this…` — vague; what is being explored, where?
- ✗ `Reading the URL filtering file…` — too vague; cite the path.
- ✗ `Just a moment please…` — content-free; no signal about what's happening.
- ✗ `Reading…<long pause>…done` — heartbeat-style; one line, no continuation.
- ✓ `Reading kb:zia.url-filtering.`
- ✓ `Searching _data/iac/zia/ for SSL bypasses.`
- ✓ `Querying Splunk for connector_id="abc-123" last 24h.`
- ✓ `Composing answer from 3 loaded sources.`
- ✓ `Waiting for user — Checkpoint 2.` (procedural only)

## Failure modes this discipline does not solve

- **Genuinely slow I/O.** A 30-second SIEM query is still 30 seconds; the line tells the user *what's happening*, not when it ends.
- **Quiet runtimes that buffer model output.** If the runtime delays display until the turn is fully composed, the stage line arrives along with the answer — the announcement still has value as a transparency signal but loses its real-time UX value.
- **Drift between announcement and action.** Static eval can't verify that a model that said "Reading X" actually read X. The honesty rule is honor-system; runtime evals (deferred) would be needed to enforce it.
