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

### Transport selection

Tool-capable runtimes with the `zscaler-investigator` MCP server mounted use
the MCP path: retrieve the `investigate` prompt, drive every gate as a named
MCP tool, and return `render_report` output as the final answer. Shell-only
runtimes use the CLI path (`node scripts/investigator-artifacts.mjs ...`).
`agents/investigator/workflow.md` owns the selection contract; adapters stay
thin pointers to that file.

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
`complete_turn`, `abandon_turn`, `import_evidence`, `helper_capabilities`,
`render_report`.

Tool descriptions and tool results are the instruction channel — actionable
gate errors pass through verbatim so runtimes can self-correct without a
separate explanation layer.

### MCP resources (answer-from-artifact)

The server exposes three per-case resource templates via `resources/templates/list`:

| URI template | MIME type | Content |
|---|---|---|
| `investigator://case/{slug}/report` | `text/markdown` | Artifact-derived investigation report (journal claims + turn history) |
| `investigator://case/{slug}/journal` | `text/markdown` | Raw `journal.md` content |
| `investigator://case/{slug}/status` | `application/json` | JSON output of `caseStatus()` |

**Answer-from-artifact rule**: the final answer to the user is produced by
`render_report` (tool) or by reading `investigator://case/{slug}/report`
(resource) — not by model narration. Every claim status and every stated fact
in the report is derived from on-disk artifacts. The model must not paraphrase
or summarize findings from memory.

`resources/list` enumerates existing cases when `_data/cases` is present; it
returns an empty list gracefully when the directory is absent.

Unknown or unparseable URIs return JSON-RPC error `-32002 Resource not found`.

### MCP prompts (server-shipped role entrypoint)

The server exposes two prompts via `prompts/list` and `prompts/get`:

- **`investigate`** — returns the investigator role entrypoint from
  `agents/investigator/mcp-entrypoint.md`, with optional `framing` argument
  appended. This replaces per-runtime adapter prose as the role entry surface.
- **`resume-case`** — requires `case_slug`; returns a status-first recovery
  instruction for the named case.

Unknown prompt names and missing required arguments return `-32602`.

### Conformance gate

Protocol conformance is verified by `scripts/check-mcp-conformance.mjs`. It
runs in-process JSON-RPC assertions covering: initialize handshake, capabilities
echo, tools/list annotations, unknown-tool error code, resources/templates/list,
prompts/list, and prompts/get edge cases. If the official MCP Inspector CLI is
available via npx, it is detected; full headless inspector integration is noted
as pending. The gate is wired into `check-fast.mjs` and degrades gracefully if
the inspector binary is unavailable.

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

---

## Auditor MCP server (`zscaler-auditor`)

The auditor role has a parallel MCP server at `scripts/auditor-mcp-server.mjs`.
It exposes the lighter audit lifecycle (open -> record findings -> report) as
named MCP tools, with the same three load-bearing properties as the investigator:
evidence-gated records, answer-from-artifact, and fabrication-resistant errors.

### Auditor tools

| Tool | Read-only | Description |
|---|---|---|
| `audit_status` | yes | Read-only doctor: phase, finding counts, checks recorded, nextActions |
| `open_audit` | no | Create audit intake (scope + description) |
| `record_finding` | no | Record an evidence-gated finding into findings.jsonl, re-derive register.md |
| `record_check_output` | no | Store a CI/check script's output as evidence under `checks/<name>.txt` |
| `render_audit_report` | yes | Render artifact-derived report — the final answer surface |
| `helper_capabilities` | yes | Version and supported operations |

### Auditor resources

Three per-audit resource templates via `resources/templates/list`:

| URI template | MIME type | Content |
|---|---|---|
| `auditor://audit/{slug}/report` | `text/markdown` | Artifact-derived audit report (scope + findings by severity) |
| `auditor://audit/{slug}/register` | `text/markdown` | Raw `register.md` (derived from findings.jsonl) |
| `auditor://audit/{slug}/status` | `application/json` | JSON output of `auditStatus()` |

**Answer-from-artifact rule**: the final answer is produced by `render_audit_report`
(tool) or by reading `auditor://audit/{slug}/report` (resource) — not by model
narration. Every finding and its source comes from on-disk `findings.jsonl`.
Missing-audit resource reads return `-32002` for all three kinds.

### Auditor prompt

The server exposes one prompt via `prompts/list` and `prompts/get`:

- **`audit`** — returns the auditor role entrypoint from
  `agents/auditor/mcp-entrypoint.md`, with optional `scope` argument appended.
  Carries the gated order, premise-challenge, status-first, evidence-source, and
  answer-from-artifact rules.

Unknown prompt names return `-32602`.

### Registration

```json
{
  "mcpServers": {
    "zscaler-auditor": {
      "command": "node",
      "args": ["scripts/auditor-mcp-server.mjs"]
    }
  }
}
```

### Evidence gate (auditor)

Every finding must carry a resolving source. Source types:

- `path:line` — file:line reference; file must exist under repo root and have
  at least `line` lines.
- `path/a.md + path/b.md` — cross-file reference; all listed files must exist.
- `check:<name>` — recorded check output; must have been stored by
  `record_check_output` before the finding is recorded.

**Critical/High severity or Resolved status** requires a `path:line` or
`check:<name>` source — cross-file existence alone is too weak for
high-severity assertions. Violations produce isError responses naming the
exact repair.

**No force over MCP.** `force` is rejected at dispatch with an actionable
repair message pointing to the CLI path.

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
