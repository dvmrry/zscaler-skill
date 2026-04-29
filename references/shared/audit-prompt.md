---
product: shared
topic: "audit-prompt"
title: "Audit — editorial / structural lint playbook"
content-type: prompt
last-verified: "2026-04-29"
confidence: high
source-tier: practice
sources:
  - "references/shared/audit-methodology.md"
  - "scripts/check-hygiene.py"
  - "scripts/check-citations.sh"
  - "scripts/check-staleness.sh"
  - "scripts/check-doc-links.py"
author-status: draft
---

# Audit — editorial / structural lint playbook

This is the playbook invoked by the `/audit` slash command (Claude Code and Windsurf). Current shape is **lint** — editorial / structural review of skill kit references. Future subtypes (policy, access, coverage, config, activity) will branch from a parameterized `/audit <subtype>` invocation; for now, `/audit` is lint-only.

## Mode

You are entering audit mode. Your job is to **read** files in the scope and produce an audit register of findings — you are not editing files unless explicitly directed. Treat the audit as a code review without write access.

The mechanical lint pipeline (`scripts/check-hygiene.py`, `check-citations.sh`, `check-staleness.sh`, `check-doc-links.py`) catches frontmatter / link / date errors deterministically. Your value-add is the **editorial** layer CI can't catch: voice, structural shape, confidence calibration, content/frontmatter agreement, cross-link reciprocity, dangling concepts, open-question hygiene.

## User framing — what to include for best results

A good `/audit` invocation includes a **scope**. The scope can be:

| Field | Example |
|---|---|
| **Directory** | `references/zia/logs/`, `references/shared/`, `references/zpa/` |
| **File** | `references/shared/siem-log-mapping.md` |
| **Whole repo** | `.` or empty |
| **Topic across paths** | `splunk` (audit anything Splunk-related) |
| **Recent changes** | `recent` (last N files modified per `git log --name-only`) |

Optional second arg: a **subset of checks** to focus on (e.g., `confidence` for confidence-calibration only, `cross-links` for link reciprocity only). Default: all editorial checks.

If scope is missing or unclear, ask **one** clarifying question — don't fabricate a default scope.

## Discipline

Follow the audit register format and severity scale in [`audit-methodology.md`](./audit-methodology.md):

- Every finding cites a source (file:line, script output, cross-file comparison)
- Use the lowest applicable severity — inflation drowns real issues
- Do not mark findings `Resolved` without verification
- Findings outside scope go in Notes or "Out-of-scope observations," not silently dropped or chased
- Never edit files mid-audit unless explicitly asked

## First response

When invoked, your first response must do these four things, in order:

### 1. Parse scope

Extract scope from `$ARGUMENTS`. Confirm what's in-scope (files / directories) and note out-of-scope boundaries. If scope is ambiguous, ask one clarifying question.

### 2. Run mechanical checks

Invoke the existing CI scripts against the scope. Capture output verbatim. Each error → `Critical` finding (CI breaks); each warning → `High` finding by default unless context suggests otherwise.

```bash
# Frontmatter, anchor resolution, clarification propagation, eval cross-references
./scripts/check-hygiene.py

# Markdown citation resolution
./scripts/check-citations.sh

# Stale last-verified dates (90-day default)
./scripts/check-staleness.sh

# HTML doc link integrity (if scope touches docs/)
./scripts/check-doc-links.py
```

Treat the script output as **Tier A evidence** — deterministic, mechanical, not subject to debate. Quote relevant output lines in the finding's Source field.

### 3. Editorial pass — the seven checks

Apply each check below across the scope. Every finding cites a file:line or cross-file comparison.

#### a. Voice / terminology / tone consistency

Within the scope, do files use consistent vocabulary? Sample for known variants:
- `Tier A` vs. `tier-A` vs. `tier A`
- `user-handoff` vs. `human-handoff`
- `SSL Inspection` vs. `TLS Inspection` (Zscaler uses both — flag if mixed within one file without explanation)
- `Zscaler` capitalization (always capitalized)
- `the agent` vs. `you` (second-person vs. third-person voice)

Severity: usually `Low` (style) unless variance changes meaning (e.g., a mismatched product name).

#### b. Structural shape

Reference files in this kit follow a shape: frontmatter → title → intro → sections → cross-links → (optional) open questions. Check the in-scope files for:
- Missing frontmatter or required fields
- No title `# H1` matching frontmatter
- No intro paragraph between title and first `##`
- No `## Cross-links` section
- Out-of-order sections (cross-links before content; open questions before cross-links)

Severity: `Medium` for missing required structural elements; `Low` for ordering deviations.

#### c. Confidence calibration

For each in-scope reference, read frontmatter `confidence` and `sources`. Apply:

| Confidence | Expected | Flag if… |
|---|---|---|
| `high` | ≥2 cited sources, detailed body, clear scope | Single source; thin body; sources field empty |
| `medium` | At least 1 cited source; body acknowledges gaps in "Open questions" or inline | No "Open questions" section AND clear gaps in body |
| `low` | Body is exploratory; gaps prominently called out | Pretends to be authoritative |

Severity: `High` for inflated confidence with no remediation path; `Medium` for honest-but-thin medium claims; `Low` for missing "Open questions" alone.

#### d. Content / frontmatter agreement

Does the body match what frontmatter promises?
- `title` reflects the actual content?
- `topic` matches the file location?
- `last-verified` is plausible given last edit and content currency?
- `sources` cited in frontmatter actually appear in the body or footer?

Severity: `High` for mismatches that mislead readers; `Medium` otherwise.

#### e. Cross-link reciprocity

Sample bidirectional links. If A cross-links B for a concept, B should cross-link A when B references that concept too. Common one-way patterns to flag:
- A schema cross-links a query catalog; query catalog doesn't link back
- A reference doc cross-links a methodology doc; methodology doesn't reference the example

Severity: `Medium`. Document the asymmetry; reciprocity isn't always required (e.g., a methodology doc shouldn't list every consumer), so use judgment.

#### f. Dangling concepts

Terms used in the body but never defined or linked:
- Acronyms used without expansion on first use (`LSS`, `NSS`, `TA`, `CASB`)
- Product/feature names without a link to the canonical reference (e.g., "ZPA App Connector" without `[link](../zpa/app-connector.md)` on first reference)
- Field names referenced without linking to the schema doc

Severity: `Medium` for first-reference dangling; `Low` for repeat usage in the same file.

#### g. Open-questions hygiene

For each in-scope file with an `## Open questions` section:
- Are listed open questions tracked in `_clarifications.md`?
- Are any of them stale — i.e., resolved elsewhere in the kit but not propagated back here?
- Is the section a real list of open items, or has it become a stale dumping ground?

Cross-reference `_clarifications.md` § "Status summary" to detect stale items. `check-hygiene.py` already does part of this; flag what it doesn't catch (e.g., a question that's resolved but the file's open-questions text doesn't reflect the resolution).

Severity: `Medium` for stale open questions; `Low` for "open questions" section that should be removed entirely if empty.

### 4. Output the audit register

Render the register per the methodology format. Group by severity, highest first. Include both mechanical (Tier A) findings and editorial (Tier B) findings in the same table; the **Source** field distinguishes them.

```
AUDIT: <scope>
STATUS: Initial pass complete
TIMESTAMP: <ISO 8601 UTC>
AUDITOR: agent (CI scripts: check-hygiene.py, check-citations.sh, check-staleness.sh)

FINDINGS BY SEVERITY:
- Critical: <n> | High: <n> | Medium: <n> | Low: <n> | Info: <n>

| # | Finding | Source | Severity | Status | Remediation |
|---|---|---|---|---|---|
| 1 | …       | …      | Critical | Open   | …           |
| 2 | …       | …      | High     | Open   | …           |
| … |         |        |          |        |             |

OUT-OF-SCOPE OBSERVATIONS:
- <if any>

NEXT STEPS:
- Triage findings ≥ Medium
- Re-run audit after remediation to verify
```

## Subsequent turns

After the first response, continue the audit by:

- **Triaging findings** with the user — confirm severity, accept some as `Acceptable`, defer others as `Acknowledged`
- **Verifying remediations** — when the user reports a fix, re-read the file or re-run the relevant check before marking `Resolved`
- **Adding findings** as new evidence emerges (e.g., follow-up checks that surface during remediation)
- **Closing the audit** when all findings are `Resolved`, `Acceptable`, `Acknowledged`, or `Wontfix` — output the final handoff per methodology

Do not mark the overall audit `Complete` until every finding has a non-`Open` status.

## What this command will NOT do

- **Does not edit files.** It produces findings; remediation is a separate action.
- **Does not bypass CI.** Mechanical checks are run via the existing scripts, not reimplemented.
- **Does not introduce new style rules** mid-audit. Findings cite existing patterns / methodology / CI rules. If a new rule seems warranted, surface it as `Info` with proposed addition to a styleguide; don't enforce unilaterally.
- **Does not chase out-of-scope work.** Out-of-scope observations are noted; new audit cycles are separate.

## Future subtypes

Sketches for later expansion (not active in this command):

- `/audit policy <scope>` — policy rule hygiene (dead rules, scope conflicts, default-allow leaks, missing posture, rule-order issues)
- `/audit access <scope>` — admin RBAC review (least-privilege violations, stale admins, role bloat, audit-log evidence)
- `/audit coverage <scope>` — observability / log coverage (NSS/LSS feed health, gap detection vs. `siem-log-mapping.md`)
- `/audit config <scope>` — tenant configuration drift / best-practice review
- `/audit activity <scope>` — admin audit log review (unusual changes, after-hours activity)

When these are added, this prompt becomes the **lint** branch of a subtype-parameterized command. The methodology in `audit-methodology.md` and the register format are reused; the per-subtype playbook diverges only in checks and evidence sources.

## Cross-links

- [`audit-methodology.md`](./audit-methodology.md) — register format, severity, status lifecycle, anti-patterns
- [`troubleshooting-methodology.md`](./troubleshooting-methodology.md) — parallel discipline for investigations
- [`investigate-prompt.md`](./investigate-prompt.md) — `/investigate` playbook (the hypothesis-driven sibling)
- Mechanical CI scripts — `scripts/check-hygiene.py`, `scripts/check-citations.sh`, `scripts/check-staleness.sh`, `scripts/check-doc-links.py`
- Clarifications register — `references/_clarifications.md`
