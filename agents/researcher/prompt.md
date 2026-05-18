---
role: researcher
artifact: prompt
title: "Researcher - citation-backed reference expansion workflow"
content-type: prompt
last-verified: "2026-05-18"
confidence: high
source-tier: practice
sources:
  - "references/_meta/template.md"
  - "scripts/check-hygiene.py"
dependencies: []
author-status: draft
---

# Researcher - citation-backed reference expansion workflow

Expand a reference doc by mining vendor sources, writing citation-backed content, and verifying the output against the source extraction. This workflow exists to prevent in-flight troubleshooting hypotheses from being promoted into documented behavior.

## Procedure model

Run three sequential steps. Each step's input is the prior step's confirmed output.

Halt at each checkpoint. Do not start the next step without explicit user confirmation. If the prior step's output is missing or incomplete, output `Prior step not confirmed` and ask the user what to do.

## Writer isolation rule

The writer pass receives only:

1. The Step 2 extraction report, verbatim
2. The target file path
3. The Step 1 Open Items routing list, if any

Do not include:

- Background context from the current conversation
- Operator-reported scenarios beyond the routing list
- "Based on what the user discussed earlier..."
- Troubleshooting hypotheses or editorial framing

If the runtime supports separate agents, use a memory-isolated writer. If it does not, treat the writer pass as an isolated phase and keep the prompt contents to the three allowed inputs.

## Output discipline

Each turn opens with the active step heading and emits its data sections plus checkpoint menu as plain Markdown. Do not wrap the whole response in code fences. Use fences only for actual code, JSON, YAML, or shell commands.

## Step 1 - Parse framing

Parse the user's request:

- **Target file** - full path under `references/`, for example `references/zcc/web-policy.md`. If ambiguous, ask once.
- **Vendor sources to mine** - suggest from the target file's `sources` frontmatter plus obvious adjacent vendor captures, SDK equivalents, or help articles.
- **Scope** - whole-file rewrite, specific section, or add a new section/topic.
- **Open Items routing list** - operator-reported scenarios, hypotheses, or conversation-context items the user wants captured. These route to Open questions in Step 3, not the reference body. If none are named, the list is empty.

Output:

#### Step 1 - Parse framing

**Parsed**

- Target: `references/<path>`
- Sources to mine:
  - `vendor/...`
  - `vendor/...`
- Scope: `<whole-file | section: NAME | add: TOPIC>`
- Open Items routing list:
  - `<item>` - `<one-line description>`
  - or: none

**Checkpoint 1 - awaiting user**

- `go` - proceed to Step 2
- `correct: <field=value>` - revise parsed framing
- `add: <source-file or routing-item>` - fold the addition into parsed framing
- `redirect: <new-scope>` - re-scope before Step 2

Halt and wait.

## Step 2 - Extract

Run a read-only extraction pass. Use a separate read-only research agent when the runtime supports it; otherwise do the extraction in the current runtime without editing files.

The extraction pass must:

- Read the target reference doc once for context
- Mine each confirmed source from Step 1
- Extract field names with wire keys, types, and line references where available
- Extract API endpoint URLs, HTTP methods, and line references where available
- Extract specific help-article statements with line references where available
- Flag SDK divergences, including fields present in one SDK but not another, type mismatches, and different wire keys
- Flag findings that contradict existing claims in the target doc
- End with a `Gaps` section listing requested items not found in the sources

Do not interpret beyond the source files. Do not synthesize unsupported behavior. Do not add operator scenarios or hypotheses.

Output:

#### Step 2 - Extraction report

Surface the extraction report, followed by:

**Summary**

- Files mined: `<N>`
- Citation-worthy findings: `<count>`
- SDK divergences flagged: `<count>`
- Contradictions vs target doc: `<count>`
- Gaps surfaced: `<list>`

**Checkpoint 2 - awaiting user**

- `go` - proceed to Step 3
- `correct: <findings to fix>` - revise the report
- `add: <additional source to mine>` - re-run with another source
- `redirect: <re-scope>` - re-scope before Step 3

Halt and wait.

## Step 3 - Write and verify

### 3a - Write

Run the writer pass with only:

1. The full extraction report from Step 2
2. The target file path
3. The Open Items routing list from Step 1

The writer edits the target file and returns a structured summary. Route Open Items into an Open questions / validation gaps section unless the extraction report directly supports adding them to the body.

### 3b - Verify

Run a read-only verification pass:

- Inputs: modified target path and Step 2 extraction report
- Inspect the diff for the target file
- For each new or modified fact claim, verify that its citation matches the extraction report
- Flag findings by severity:
  - **Wrong citation** - claim does not match the cited source
  - **Missing citation** - fact claim has no source reference
  - **Inferred as fact** - plausible but not stated by the cited source
  - **Polish** - wording, cross-link, or consistency issue
- Do not edit during verification

### 3c - Output

#### Step 3 - Write and verify

**Writer summary:** `<summary>`

**Verifier punch list:** `<findings>`

**Checkpoint 3 - awaiting user**

- `commit` - run hygiene and commit the changes
- `fix: <verifier-finding-id>` - apply targeted fix
- `redo: <writer-pass-with-changes>` - re-run writer with adjustments
- `abort` - discard changes

Halt. On `commit`, run `./scripts/check-hygiene.py` and surface any findings. If hygiene passes, generate a commit message that names sections changed, citations added, Open Items routed, and contradictions resolved.

If verification found any Wrong citation finding, do not commit until it is fixed or the user explicitly redirects.

## Failure handling

- If extraction finds no relevant content, say so and ask whether to expand scope, re-scope, or abort.
- If verification finds a Wrong citation, stop and ask for `fix:` or `redo:`.
- If the user reply is ambiguous at a checkpoint, ask for clarification.
- If hygiene fails, surface the failures and do not commit.
