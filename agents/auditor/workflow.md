---
id: z-auditor
title: Zscaler Auditor
role: auditor
artifact: workflow
content-type: reference
last-verified: "2026-06-12"
confidence: medium
sources:
  - agents/auditor/prompt.md
  - agents/auditor/harness.md
  - agents/auditor/grounding/index.md
  - agents/auditor/methodology.md
  - agents/declared-records.md
  - scripts/auditor-artifacts.mjs
author-status: reviewed
summary: Editorial and structural audit of skill references
primary-command: /z-auditor
known-runtimes:
  - codex
  - devin
  - claude
required-reads:
  - agents/auditor/prompt.md
  - agents/auditor/harness.md
  - agents/auditor/grounding/index.md
  - agents/auditor/methodology.md
  - agents/declared-records.md
supporting-scripts:
  - scripts/check-hygiene.py
  - scripts/auditor-artifacts.mjs
  - scripts/auditor-mcp-server.mjs
---

# Zscaler Auditor Workflow

Load and follow the files listed in `required-reads`.

Use this workflow for read-only editorial, structural, and hygiene review. Parse
the requested scope, run the applicable mechanical checks, then perform the
editorial pass and output an audit register grouped by severity.

Do not edit files during an audit unless the user explicitly changes the task
from review to implementation.

Supporting scripts: `scripts/check-hygiene.py`, `scripts/auditor-artifacts.mjs`, `scripts/auditor-mcp-server.mjs`.

On MCP runtimes, the role entrypoint is server-provided (prompt `audit`), and
the final audit answer is produced by the `render_audit_report` tool — not by
model narration. Finding statuses in the answer come from the on-disk
findings.jsonl ledger. See
[`agents/_meta/runtime-adapters.md`](../_meta/runtime-adapters.md) for the
answer-from-artifact rule and available resource URIs.

## Transport selection

Both transports enforce the identical gates (same helper core) and share the
identical reasoning discipline (`prompt.md`, `methodology.md`). The only
difference is whether gate calls go through MCP tools or shell commands. Choose
once per audit — never mix transports mid-audit.

**MCP path (preferred when available).** If the `zscaler-auditor` MCP server is
mounted — that is, the runtime offers tools named `audit_status`, `open_audit`,
`record_finding`, `render_audit_report`, etc. — use the MCP path. Retrieve the
server's `audit` prompt (`prompts/get audit`) and follow it: it carries the
gated order, premise-challenge, status-first, and answer-from-artifact rules.
Drive every gate as its MCP tool. The final answer to the user is the output of
`render_audit_report` (or the `auditor://audit/{slug}/report` resource) — never
model narration. The same discipline files (`prompt.md`, `methodology.md`) still
govern reasoning; the MCP entrypoint at `agents/auditor/mcp-entrypoint.md` is
what the server returns for the `audit` prompt.

**CLI path (shell-only runtimes).** When the MCP server is not available, follow
the existing CLI command sequence. When resuming or after any failure, run
`audit-status` first and follow its `nextCommands` and `nextActions`.

```bash
node scripts/auditor-artifacts.mjs audit-status --root <repo> --audit-slug <slug>
node scripts/auditor-artifacts.mjs open-audit --root <repo> --audit-slug <slug> --scope-json <file>
node scripts/auditor-artifacts.mjs record-finding --root <repo> --audit-slug <slug> --finding-json <file>
node scripts/auditor-artifacts.mjs render-audit-report --root <repo> --audit-slug <slug>
```

Both transports hit the same gates and produce the same artifacts. The selection
is purely about HOW gates are called, not WHAT the audit does.
