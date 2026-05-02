---
description: Expand a Zscaler skill kit reference doc with citation-backed content. Three-step procedure (parse → extract → write+verify) with halt-and-wait checkpoints. Spawns memory-isolated subagents for each phase to prevent conversation-context contamination of reference docs.
argument-hint: <target-file-path> [scope: whole-file|section <name>|add <topic>]
---

# /z-research

Expand a reference doc by mining vendor sources, writing citation-backed content, and verifying the output against the source-of-truth extraction. Designed to prevent the failure mode where in-flight troubleshooting hypotheses get promoted to documented behavior in reference docs.

The user's framing:

$ARGUMENTS

## Procedure model

Three sequential steps. Each step's input is the prior step's confirmed output. Halt-and-wait at each checkpoint — do not improvise past a checkpoint, do not run the next step without explicit user confirmation.

If the prior step's output is missing or incomplete, do not start the next step — output `Prior step not confirmed` and ask the user what to do.

## Critical constraint — the writer prompt rule

**The writer subagent's prompt must contain only:**

1. The extraction report from Step 2 (verbatim)
2. The target file path
3. The "Open Items routing list" from Step 1, if any

**Do NOT include in the writer's prompt:**

- Background context from this conversation
- Operator-reported scenarios beyond what's in the routing list
- "Based on what the user discussed earlier..."
- "The user is troubleshooting X..."
- Editorial framing like "this is operationally significant"

The writer is memory-isolated by Claude Code's design — preserve that isolation. If you find yourself reaching for conversation context to enrich the writer's prompt, that's the failure mode this command exists to prevent.

## Per-turn output format

Each turn opens with a step banner, contains data blocks + checkpoint menu, ends with the fixed end-marker. Banners and data blocks render as fenced code blocks; clarifications and summaries render as plain markdown.

---

## Step 1 — Parse framing

Parse the user's request from `$ARGUMENTS`:

- **Target file** — full path under `references/` (e.g., `references/zcc/web-policy.md`). If ambiguous, ask once.
- **Vendor sources to mine** — auto-suggest from the target file's existing `sources` frontmatter, plus any obvious adjacent files (Go SDK equivalent if Python is listed, help articles for the topic). Confirm with user.
- **Scope** — whole-file rewrite, specific section, or add new section/topic.
- **Open Items routing list** — any operator-reported scenario, hypothesis, or conversation-context item the user wants captured. These are EXPLICITLY flagged here so they route to Open questions in Step 3, never the body. If the user hasn't named any, the list is empty.

Output:

```
═══ STEP 1 — PARSE FRAMING ═══

PARSED:
  Target: references/<path>
  Sources to mine:
    - vendor/...
    - vendor/...
  Scope: <whole-file | section: NAME | add: TOPIC>
  Open Items routing list:
    - <item> — <one-line description>
    - (or: none)

═══ CHECKPOINT 1 — AWAITING USER ═══
  Reply: go | correct: <field=value> | add: <source-file or routing-item> | redirect: <new-scope>
═══════════════════════════════════════
```

Halt. Wait for user.

---

## Step 2 — Extract

Spawn an `Explore` subagent with `subagent_type: Explore`, thoroughness `medium` to `very thorough` depending on scope.

Prompt the Explore agent to:

- Read the target reference doc once for context (what's already there, what's claimed)
- Mine each vendor source confirmed in Step 1
- Extract field names with wire keys / types / line numbers (both Python and Go SDK where both exist)
- Extract API endpoint URLs, HTTP methods, and line numbers
- Extract specific quotes from help articles with line numbers
- Flag SDK divergences (fields in one SDK but not the other, type mismatches, different wire keys)
- Flag any extraction finding that contradicts an existing claim in the target doc
- End with a "Gaps" section listing what was asked for but not found in the sources

Constrain the Explore agent's prompt: "Do NOT interpret beyond what's in the file. Do NOT synthesize across sources. Do NOT add operator-reported scenarios or hypotheses. Report what the source says, with line numbers, in tables and structured findings."

Surface the report verbatim plus a summary block.

Output:

```
═══ STEP 2 — EXTRACTION REPORT ═══
```

Then plain markdown with the agent's full report.

Then:

```
SUMMARY:
  Files mined: <N>
  Citation-worthy findings: <count>
  SDK divergences flagged: <count>
  Contradictions vs target doc: <count>
  Gaps surfaced: <list — these will not be written into body>

═══ CHECKPOINT 2 — AWAITING USER ═══
  Reply: go | correct: <findings to fix> | add: <additional source to mine> | redirect: <re-scope>
═══════════════════════════════════════
```

Halt. Wait for user.

---

## Step 3 — Write + Verify

### 3a — Write

Spawn the `z-writer` subagent with `subagent_type: z-writer`. The prompt must contain ONLY:

1. The full extraction report from Step 2 (verbatim)
2. The target file path
3. The Open Items routing list from Step 1

Do not include anything else from this conversation in the writer's prompt. The writer is memory-isolated — preserve that. If you have notes from earlier turns, Step 2's report incorporates the verified parts; the rest stays out of the prompt.

The writer applies edits to the target file via Edit and returns a structured summary.

### 3b — Verify

Spawn an `Explore` subagent (read-only) with a verification prompt:

- Inputs: the modified target file path + the Step 2 extraction report
- Run `git diff` on the target file to see what changed
- For each new or modified fact-claim in the diff, verify it has a citation that matches the extraction report
- Flag findings by severity:
  - 🔴 **Wrong citation** — claim doesn't match what's at the cited line
  - 🟡 **Missing citation** — fact-claim with no source reference
  - ⚠️ **Inferred-as-fact** — plausible but the cited source only implies, doesn't state
  - 🟢 **Polish** — wording inconsistency, cross-link nit
- Do NOT edit; produce a punch list only

### 3c — Output

```
═══ STEP 3 — WRITE + VERIFY ═══
```

Then plain markdown:

**Writer summary**: [verbatim from z-writer]

**Verifier punch list**: [verbatim from Explore verifier]

Then:

```
═══ CHECKPOINT 3 — AWAITING USER ═══
  Reply: commit | fix: <verifier-finding-id> | redo: <writer-pass-with-changes> | abort
═══════════════════════════════════════
```

Halt. On `commit`, run `./scripts/check-hygiene.py` and surface any findings; if hygiene passes, generate a commit message summarizing the changes (sections changed, citations added, items routed to Open questions, contradictions resolved) and commit.

If the verifier produced any 🔴 finding, **do not auto-commit** — surface and wait for `fix:` or `redo:`.

---

## Failure handling

- **Extractor finds nothing relevant** at Checkpoint 2 — tell the user the source has no citation-worthy content for the requested scope; ask whether to expand scope, re-scope, or abort.
- **Verifier produces ≥ 1 🔴** finding — do not auto-commit. Surface and wait for `fix:` or `redo:`.
- **User reply ambiguous at any checkpoint** — ask for clarification, do not assume.
- **Hygiene check fails** at commit — surface the failures, do not commit, ask the user how to proceed.
