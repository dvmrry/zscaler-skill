---
topic: "runtime-adapters"
title: "Runtime adapters and portable skills"
content-type: reference
last-verified: "2026-06-12"
confidence: high
source-tier: practice
sources:
  - "AGENTS.md"
  - "SKILL.md"
  - "agents/README.md"
author-status: reviewed
---

# Runtime adapters and portable skills

This repo separates canonical workflow logic from runtime-specific adapter
files.

## Canonical layer

These files are source of truth:

- `AGENTS.md` — repository operating contract for coding agents.
- `SKILL.md` — high-level Zscaler skill entrypoint and routing surface.
- `agents/**` — canonical workflow metadata, playbooks, methodologies,
  grounding cards, diagnostics templates, and role conventions.
- `references/**` — Zscaler product and behavior references.
- `scripts/**` — deterministic checks and utility tooling.

## Portable skill layer

Portable Agent Skills live under `.agents/skills/`.

Each skill should be a thin loader that:

1. Declares trigger metadata in its `SKILL.md` frontmatter.
2. Points to the canonical `agents/<role>/workflow.md`.
3. Avoids re-stating the workflow, required reads, or helper gates.

The skill should not copy long command bodies from `.claude/`, `.devin/`, or
other runtime folders.

Portable skills assume this repository layout:

```text
.agents/skills/<skill-name>/SKILL.md
agents/<role>/prompt.md
agents/<role>/workflow.md
```

Relative links from a portable skill are validated against that layout. If a
downstream fork moves `.agents/skills/` or `agents/`, it must update the loader
paths as part of that fork.

## Harness layer

Some workflows need an explicit runtime-neutral harness: checkpoint sequencing,
halt-and-wait rules, phase output shapes, journal creation order, snapshot load
caps, or other state-machine behavior that is more procedural than the role
prompt itself.

When that behavior is required for correctness, it belongs under `agents/**`
next to the role prompt, not only inside one runtime adapter. Runtime adapters
may reinforce the harness where a weaker runtime needs explicit wording, but
the canonical contract should name the harness file that both portable skills
and runtime adapters load.

`/z-investigator` is the known hard case. Its checkpoint discipline lives in
[`investigator/harness.md`](../investigator/harness.md) and the helper-backed
intake contract lives in [`investigator/case-intake.md`](../investigator/case-intake.md).
Runtime adapters should load those canonical files and reinforce the helper
commands, not carry their own copy of the full procedure.

## Artifact-gated phases

For unreliable runtimes, adapter prose is not a strong enough boundary by
itself. Use helper-backed artifacts for any phase transition where skipping the
gate would create false confidence.

The adapter pattern is:

1. Load the canonical workflow metadata and required reads.
2. Call the canonical helper command for the current phase.
3. Verify the artifact the helper produced.
4. Read back the verified artifact.
5. Continue only when the artifact says `Status: pass` and
   `Blocking Issues: none`.

Adapters should keep exact helper commands load-bearing. Do not say only "run
the deterministic helper" or "create the phase artifact." Weak runtimes may
understand that text after the fact while still failing to execute the gate.
Put the literal command shape near the instruction that requires it. If a
runtime invents an adjacent command, skips verification, or prints the next
checkpoint before the helper passes, the adapter should treat the phase as
blocked rather than continuing from chat memory.

The investigator case-intake gate is the current concrete example:

```bash
node scripts/investigator-artifacts.mjs open-case ...
```

A passing `open-case` response IS the verification; `verify-case` is for
resuming an existing case or re-checking after repair, not as a required
second step after a passing `open-case`.

New investigations still start with `/z-investigator`. Resume-oriented
adapters such as `/z-investigator-resume` may exist, but they must verify the
case-intake artifact before continuing.

## Adapter layer

Runtime adapters may live under directories such as:

- `.claude/`
- `.devin/`
- future runtime-specific directories

Adapters may add runtime conveniences, such as slash-command arguments,
clickable-question support, UI-specific wording, local save-path details, or
model-specific reinforcement of a canonical harness. They must not invent a
separate workflow contract that is absent from `agents/**`.

Downstream installations may generate, replace, or omit adapter files. Generated
adapter files should not be treated as canonical source.

Runtime-specific skill mirrors must not reuse names from `.agents/skills/`.
Some runtimes register both portable and runtime-local skills when names collide,
which makes selection ambiguous. If a downstream installation needs to generate
runtime-local skill wrappers, use a distinct runtime/local prefix until that
runtime can consume the portable skill directly.

Some runtimes surface portable skills as slash-style commands. Do not assume
that a `/name` entry in one runtime is equivalent to a hand-authored
`.devin/workflows/name.md` or `.claude/commands/name.md` adapter. If both a
portable skill and a runtime adapter are visible, prefer the known-good runtime
adapter until parity has been tested.

## MCP transport

The canonical helper (`scripts/investigator-artifacts.mjs`) now has two fronts:

- **CLI** — `node scripts/investigator-artifacts.mjs <command> ...` — for
  click-gated shells such as work Windsurf today, where the runtime executes
  shell commands on button press.
- **MCP stdio server** — `node scripts/investigator-mcp-server.mjs` — for
  tool-capable runtimes (Claude Code, Codex, Goose; and Windsurf once MCP
  lands there) that drive the same gates through named tools instead of shell
  commands.

Both fronts call the same exported functions and enforce the same gates.
Adapters policy is unchanged: load the canonical workflow and harness files,
call the gate, verify the artifact, continue only when it passes.

The server is registered project-scope in `.mcp.json`:

```json
{
  "mcpServers": {
    "zscaler-investigator": {
      "command": "node",
      "args": ["scripts/investigator-mcp-server.mjs"]
    }
  }
}
```

Tool-capable runtimes that pick up `.mcp.json` will offer these tools:
`status`, `open_case`, `verify_case`, `record_loads`, `verify_loads`,
`save_journal`, `initialize_turn_ledger`, `begin_turn`, `run_turn`,
`complete_turn`, `abandon_turn`, `import_evidence`, `helper_capabilities`.

Tool descriptions and tool results are the instruction channel — actionable
gate errors pass through verbatim so runtimes can self-correct without a
separate explanation layer.

The MCP surface enforces two additional hardening constraints that do not
apply to the CLI:

- **No force over MCP.** Any tool call that includes a `force` parameter is
  rejected at dispatch with an explicit repair message listing the correct
  repair flow. Force re-initialization of the turn ledger is a human decision;
  use the CLI with explicit user approval. The `force` property does not appear
  in any tool's input schema.

- **Evidence-gated claim-status transitions.** The helper enforces that
  transitions to `Confirmed (high)`, `Confirmed (medium)`, `Ruled out`, or
  `Resolved` require prior recorded evidence refs that are verifiable (present
  in a prior completed turn's `evidenceRefs` or in `evidence/MANIFEST.md`).
  Upgrading `Open (uncertain)` to `Open (likely)` is subject to the same check.
  The initial journal save (before any turn ledger exists) must contain only
  `Open` claim statuses. Runtimes that attempt to bypass these gates by
  hand-editing artifacts or by asserting evidence refs that were never recorded
  will see actionable gate errors from `run_turn` and `complete_turn`.

## Migration rule

When adding or revising a workflow:

1. Update the canonical workflow under `agents/**`, starting with
   `agents/<role>/workflow.md`.
2. Add or update a portable skill under `.agents/skills/` if the workflow should
   be natively discoverable by open-standard agent runtimes.
3. Keep Claude, Devin, and other runtime wrappers thin.
4. Remove copied workflow text from adapters whenever the same behavior is
   already expressed canonically.
5. Avoid same-name skill wrappers across `.agents/skills/` and runtime-specific
   skill directories.
