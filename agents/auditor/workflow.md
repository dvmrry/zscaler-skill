---
id: z-auditor
title: Zscaler Auditor
role: auditor
artifact: workflow
content-type: reference
last-verified: "2026-07-26"
confidence: medium
sources:
  - agents/auditor/prompt.md
  - agents/auditor/harness.md
  - agents/auditor/grounding/index.md
  - agents/auditor/methodology.md
  - agents/auditor/diff-readiness.md
  - agents/declared-records.md
  - scripts/auditor-artifacts.mjs
author-status: reviewed
summary: Evidence-based reference, diff, and release-readiness audit
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
  - agents/auditor/diff-readiness.md
  - agents/declared-records.md
supporting-scripts:
  - scripts/check-hygiene.py
  - scripts/check-fast.mjs
  - scripts/check-release-state.mjs
  - scripts/check-verified-against.py
  - scripts/check-reference-freshness.mjs
  - scripts/auditor-artifacts.mjs
  - scripts/auditor-mcp-server.mjs
---

# Zscaler Auditor Workflow

Load and follow the files listed in `required-reads`.

Use this workflow for read-only editorial, structural, hygiene, diff, and
release-readiness review. Parse the requested scope, choose a mode, run the
applicable mechanical checks, then output an evidence-backed audit register.

## Mode selection

- **Reference mode:** files, directories, topics, corpus hygiene, drift, source
  quality, or supplied tenant configuration. Follow `prompt.md`.
- **Diff mode:** pull requests, branches, commits, patches, working-tree
  changes, recent changes, or merge/release readiness. Apply the
  `diff-readiness.md` required read in addition to the shared discipline.

Do not apply the full reference editorial checklist to a code-only diff, and do
not use a generic green test suite as a substitute for diff-specific failure
analysis.

Do not edit files during an audit unless the user explicitly changes the task
from review to implementation.

Supporting scripts: `scripts/check-hygiene.py`, `scripts/check-fast.mjs`,
`scripts/check-release-state.mjs`, `scripts/check-verified-against.py`,
`scripts/check-reference-freshness.mjs`, `scripts/auditor-artifacts.mjs`, and
`scripts/auditor-mcp-server.mjs`.

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
`record_finding`, `update_finding`, `render_audit_report`, etc. — use the MCP
path. Retrieve the server's `audit` prompt (`prompts/get audit`) and follow it:
it carries the gated order, premise-challenge, status-first, and
answer-from-artifact rules.
Drive every gate as its MCP tool. The final answer to the user is the output of
`render_audit_report` (or the `auditor://audit/{slug}/report` resource) — never
model narration. The same discipline files (`prompt.md`, `methodology.md`) still
govern reasoning; the MCP entrypoint at `agents/auditor/mcp-entrypoint.md` is
what the server returns for the `audit` prompt.

**Inline read-only path.** When MCP is unavailable and the user requested an
ephemeral read-only review that does not authorize artifact writes, keep the
register in the response. Preserve the same stable IDs, evidence, severity,
status, remediation, and verification fields. State that the audit is inline
and cannot be resumed from disk.

**CLI durable path (shell-only runtimes).** Use the CLI when the user requests a
durable/resumable audit or explicitly authorizes audit artifacts. When resuming
or after any failure, run `audit-status` first and follow its `nextCommands` and
`nextActions`.

```bash
node scripts/auditor-artifacts.mjs audit-status --root <repo> --audit-slug <slug>
node scripts/auditor-artifacts.mjs open-audit --root <repo> --audit-slug <slug> --scope-json <file>
node scripts/auditor-artifacts.mjs record-finding --root <repo> --audit-slug <slug> --finding-json <file>
node scripts/auditor-artifacts.mjs update-finding --root <repo> --audit-slug <slug> --finding-json <file>
node scripts/auditor-artifacts.mjs render-audit-report --root <repo> --audit-slug <slug>
```

All transports use the same reasoning and finding gates. MCP and CLI produce
durable artifacts; inline mode is deliberately ephemeral.
