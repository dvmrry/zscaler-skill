---
id: z-soc
title: Zscaler SOC
role: soc
artifact: workflow
content-type: reference
last-verified: "2026-06-12"
confidence: medium
sources:
  - agents/soc/prompt.md
  - agents/soc/harness.md
  - agents/soc/grounding/index.md
  - agents/soc/grounding/security-taxonomy.md
  - agents/auditor/methodology.md
  - agents/investigator/methodology.md
  - agents/siem-emission-discipline.md
  - agents/clarification-pattern.md
author-status: reviewed
summary: Security posture review workflow
primary-command: /z-soc
known-runtimes:
  - codex
  - devin
  - claude
required-reads:
  - agents/soc/prompt.md
  - agents/soc/harness.md
  - agents/soc/grounding/index.md
optional-reads:
  - agents/soc/grounding/security-taxonomy.md
  - agents/auditor/methodology.md
  - agents/investigator/methodology.md
  - agents/siem-emission-discipline.md
  - agents/clarification-pattern.md
supporting-scripts:
  - scripts/soc-artifacts.mjs
  - scripts/soc-mcp-server.mjs
---

# Zscaler SOC Workflow

Load and follow the files listed in `required-reads`. Load files listed in
`optional-reads` only when the subtype or evidence source needs them.

Use this workflow for security posture review of tenant configuration,
telemetry, and access state. Parse scope, subtype, and threat model. Ground
before reasoning, apply the relevant subtype check-set, and output a posture
register grouped by severity.

Do not change tenant state. If scope is ambiguous, ask one targeted clarifying
question.

Supporting scripts: `scripts/soc-artifacts.mjs`, `scripts/soc-mcp-server.mjs`.

Optional reads:

- `agents/soc/grounding/security-taxonomy.md` — load when assigning posture
  domains, control families, or threat-model labels.
- `agents/auditor/methodology.md` — load when writing audit-style findings or
  judging evidence sufficiency.
- `agents/investigator/methodology.md` — load when a posture finding depends on
  live troubleshooting claim status.
- `agents/siem-emission-discipline.md` — load before emitting or running SIEM
  queries.
- `agents/clarification-pattern.md` — load when the scope needs a closed-set
  clarification.

On MCP runtimes, the role entrypoint is server-provided (prompt `soc-review`),
and the final review answer is produced by the `render_soc_report` tool — not
by model narration. Finding statuses in the answer come from the on-disk
findings.jsonl ledger. See
[`agents/_meta/runtime-adapters.md`](../_meta/runtime-adapters.md) for the
answer-from-artifact rule and available resource URIs.

## Transport selection

Both transports enforce the identical gates (same helper core) and share the
identical reasoning discipline (`prompt.md`, `harness.md`). The only difference
is whether gate calls go through MCP tools or shell commands. Choose once per
review — never mix transports mid-review.

**MCP path (preferred when available).** If the `zscaler-soc` MCP server is
mounted — that is, the runtime offers tools named `soc_status`, `open_review`,
`record_evidence`, `record_finding`, `render_soc_report`, etc. — use the MCP
path. Retrieve the server's `soc-review` prompt (`prompts/get soc-review`) and
follow it: it carries the gated order, premise-challenge, status-first,
framework-not-evidence, evidence-source, and answer-from-artifact rules.
Drive every gate as its MCP tool. The final answer to the user is the output of
`render_soc_report` (or the `soc://review/{slug}/report` resource) — never
model narration. The same discipline files (`prompt.md`, `harness.md`) still
govern reasoning; the MCP entrypoint at `agents/soc/mcp-entrypoint.md` is what
the server returns for the `soc-review` prompt.

**CLI path (shell-only runtimes).** When the MCP server is not available, follow
the CLI command sequence:

```bash
node scripts/soc-artifacts.mjs open-review --root <repo> --review-slug <slug> --scope-json <file>
node scripts/soc-artifacts.mjs record-evidence --root <repo> --review-slug <slug> --name <name> --source-file <path>
node scripts/soc-artifacts.mjs record-finding --root <repo> --review-slug <slug> --finding-json <file>
node scripts/soc-artifacts.mjs render-soc-report --root <repo> --review-slug <slug>
```

Both transports hit the same gates and produce the same artifacts. The selection
is purely about HOW gates are called, not WHAT the review does.
