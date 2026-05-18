---
topic: "loading-discipline"
title: "Loading discipline — stage announcements for I/O-driven pauses"
content-type: reference
last-verified: "2026-05-06"
confidence: medium
source-tier: practice
sources:
  - "Internal UX practice — Cascade silent-think anti-pattern; long answer pauses without surfaced action read as stuck"
  - "agents/siem-emission-discipline.md (parallel cross-cutting discipline pattern)"
author-status: draft
---

# Loading discipline

Long pauses without surfaced action read as stuck. Especially in Cascade and other runtimes where the model thinks silently between user-visible turns. A short stage line — *what's about to happen*, not *progress* — gives the user a "things are alive" signal without claiming false precision.

This file is the contract for those announcements. The intent is consistency over speed: if every role uses the same phrasing for the same kind of action, the user's mental model stays steady across surfaces. Roles that opt into this discipline declare it as a dependency in their prompt frontmatter.

## Contract

A stage line:

1. Is **not** a progress bar. No percentages. No spinners. No bytes-loaded counters.
2. Fires **only before real I/O or verification work** — a file load, a directory grep, a SIEM query, an API call, a checkpoint wait. Not before pure-reasoning steps.
3. Is **one line, declarative, present-tense**. No leading filler ("Just one moment…"), no trailing hedges ("…hopefully I'll find it").
4. Does **not heartbeat**. If a stage takes longer than expected, say so once. Don't issue periodic updates to fake liveness.
5. Is **suppressed for trivial / in-context answers**. If the answer is already in the conversation context and no I/O is needed, say nothing — go straight to the answer.
6. Uses the **fixed stage vocabulary** below. Models that pick fresh wording each turn destroy the consistency-over-speed value.
7. Never claims a source was checked until it was actually read, searched, or queried. The line precedes the action and reflects what is truly about to happen.

## Stage vocabulary

Pick the most specific stage that fits. Capitalize only the first word. Backtick concrete paths and identifiers.

| Stage              | Use when                                                  | Example                                                          |
|--------------------|-----------------------------------------------------------|------------------------------------------------------------------|
| `locating source`  | Deciding which file/dir to read; pre-load orientation     | `Locating source for ZIA URL filtering precedence.`              |
| `reading <path>`   | About to load a specific file                              | `Reading references/zia/url-filtering.md.`                       |
| `searching <dir>`  | About to grep / rglob a directory tree                     | `Searching _data/snapshot/zs2/policies/ for matching rules.`     |
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
- ✓ `Reading references/zia/url-filtering.md.`
- ✓ `Searching _data/snapshot/zs2/policies/ for SSL bypasses.`
- ✓ `Querying Splunk for connector_id="abc-123" last 24h.`
- ✓ `Composing answer from 3 loaded sources.`
- ✓ `Waiting for user — Checkpoint 2.` (procedural only)

## Failure modes this discipline does not solve

- **Genuinely slow I/O.** A 30-second SIEM query is still 30 seconds; the line tells the user *what's happening*, not when it ends.
- **Quiet runtimes that buffer model output.** If the runtime delays display until the turn is fully composed, the stage line arrives along with the answer — the announcement still has value as a transparency signal but loses its real-time UX value.
- **Drift between announcement and action.** Static eval can't verify that a model that said "Reading X" actually read X. The honesty rule is honor-system; runtime evals (deferred) would be needed to enforce it.
