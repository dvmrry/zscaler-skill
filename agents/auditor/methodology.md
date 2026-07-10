---
role: auditor
artifact: methodology
title: "Audit methodology — evidence-based finding discipline"
content-type: reference
last-verified: "2026-07-10"
confidence: high
source-tier: practice
sources:
  - "agents/investigator/methodology.md (parallel discipline)"
  - "scripts/check-hygiene.py (mechanical lint precedent)"
dependencies:
  - "../investigator/methodology.md"
author-status: draft
---

# Audit methodology — evidence-based finding discipline

A framework for systematic, citation-heavy audits of the skill (or, later, a Zscaler tenant). Parallel to [`investigator/methodology.md`](../investigator/methodology.md) — same anti-fabrication and citation discipline, different shape.

**Investigation** is hypothesis-driven (something's broken; find why). **Audit** is checklist-driven (review state against a standard; surface findings).

## Core discipline: the audit register

When auditing a scope (a directory, a tenant config, a policy set, a connector group), maintain an **audit register** that documents every finding with its source, severity, and status. This serves three purposes:

1. **Prevents fabrication** — every finding cites a file, a CI script output, an API response, or a specific line of evidence
2. **Prevents scope creep** — findings outside the audit scope are noted but not chased mid-audit
3. **Drives remediation** — each finding has a clear path to resolution or acceptance

## Audit register format

For each finding, document:

| Field | Content |
|---|---|
| **Finding ID** | Stable identifier such as `AUD-001` or `AUD-DIFF-001`; reuse it through remediation closure |
| **Finding** | One-sentence description (e.g., "`siem-log-mapping.md` claims `confidence: high` but cites only one source") |
| **Source** | Exact reference: file path + line, script output, API call + result. Same standard as a discovery journal claim. |
| **Severity** | `Critical` / `High` / `Medium` / `Low` / `Info` — see [Severity scale](#severity-scale) |
| **Status** | `Open` / `Acknowledged` / `Resolved` / `Acceptable` / `Wontfix` — see [Status lifecycle](#status-lifecycle) |
| **Remediation** | Specific action to resolve, OR "n/a — accepted" with reason |
| **Verification** | Reproduction, check, or counterexample that will prove/disprove closure |
| **Timestamp** | When the finding was identified |
| **Notes** | Caveats, scope-limited applicability, related findings |

## Severity scale

Severity captures **impact if not addressed**, not editorial priority. Use the lowest applicable severity — inflation drowns real issues.

| Severity | Definition | Examples |
|---|---|---|
| **Critical** | Breaks functionality, fails CI, or actively misleads readers | Frontmatter that fails `check-hygiene.py`; broken cross-link in a top-level reference; confidence claim with zero sources |
| **High** | Significant editorial defect; reader will be misled or confused | Content contradicts frontmatter (`confidence: high` with thin body); inflated confidence (claims `high`, single source); methodology violations (claim without citation) |
| **Medium** | Structural inconsistency that degrades usability | Missing cross-link reciprocity (A → B but not B → A where it matters); inconsistent terminology within scope; missing "Open questions" section in a confidence-medium file |
| **Low** | Minor style / polish issue | Heading capitalization variance; trailing whitespace; section ordering deviates from house style |
| **Info** | Notes for future review; not a defect | "Consider splitting this 600-line file"; "Schema X may be partially superseded by feed Y"; recommendations rather than findings |

When in doubt between two adjacent levels, pick the lower one. Reviewers can promote later.

For PR-style reporting, the optional priority labels map as follows: `P0` =
Critical, `P1` = High, `P2` = Medium, `P3` = Low. The durable register stores
the canonical severity; priority notation is only a presentation alias.

## Advisory calibration

Severity follows demonstrated impact, not the fact that a tool printed a line.

- A required check failure is normally blocking and should become a finding.
- A repository-configured advisory, warning, or `continue-on-error` result stays
  advisory unless evidence shows it breaks CI, misleads users, or causes wrong
  operational behavior.
- A known baseline warning should be reported once as backlog, not rediscovered
  as a fresh High finding on every audit.
- An unavailable required check is a residual risk or blocker depending on the
  requested decision; it is not proof that the change passes.

## Status lifecycle

| Status | Meaning | When to use |
|---|---|---|
| **Open** | Just identified; awaiting review or remediation | Default state for a new finding |
| **Acknowledged** | Reviewer agrees but defers fix | Tracked; not blocking the current cycle |
| **Resolved** | Fix applied; finding no longer holds | Verified by re-running the check or re-reading |
| **Acceptable** | False positive after review, OR intentional deviation | Document why — terminology variance might be deliberate (different audiences); confidence claim might be defensible with sources elsewhere |
| **Wontfix** | Known issue, out of scope, not worth fixing | Used sparingly; record reason |

Do not mark a finding `Resolved` until you've **verified** the fix landed (re-run the check, re-read the file). "I edited it" is not the same as "the finding no longer holds."

Use the same finding ID for closure. Durable audits append an updated snapshot
through `update-finding` / `update_finding`; inline audits revise the existing
register row. A Resolved update must cite a verification source strong enough
to prove the original failure no longer holds.

## Inline and durable registers

- **Durable register:** use MCP/CLI artifacts when the user requests a
  resumable audit or authorizes audit-state writes. The rendered report is the
  answer source of truth.
- **Inline register:** use when MCP is unavailable and the request is an
  ephemeral read-only review that does not authorize filesystem writes. Keep
  the same fields and stable IDs, and state that the register is not resumable
  from disk.

The evidence and closure bar is identical in both modes.

## Remediation closure protocol

For every prior finding:

1. Restate or reproduce the original failure scenario.
2. Read the changed implementation and focused regression test.
3. Attempt at least one neighboring bypass or counterexample.
4. Re-run the resolving check.
5. Update the original finding to `Resolved` only when the failure is falsified;
   otherwise retain `Open` and attach the new evidence.

Prefer an independent closure reviewer when available. Keep unexecuted live
integrations under residual test gaps rather than narrating them as success.

## Example workflow

**Bad (no evidence trail, no severity):**
```
Finding: web-log-schema.md is too long
Status: Open
```
(No citation. No severity. No remediation. The reviewer can't act on this.)

**Good (evidence-based, falsifiable):**
```
Finding: references/zia/logs/web-log-schema.md exceeds 300 lines (317) without
         a contents/index section, slowing reader navigation
Source: file is 317 lines; no Markdown anchor index near the top
Severity: Low
Status: Open
Remediation: Add a "## Contents" anchor index near line 19, mirroring the
             pattern in investigator/methodology.md
Timestamp: 2026-04-29 14:30 UTC
Notes: file already has an "in-content" section list at line 22; could
       repurpose. Other long-form references (siem-log-mapping.md at
       ~340 lines) follow the same pattern — consider as a sweep.
```

## Anti-patterns

### ❌ Severity inflation
```
Finding: heading uses "TLS Inspection" in one place and "SSL Inspection" elsewhere
Severity: Critical
```
Better:
```
Finding: same — terminology variance for SSL/TLS Inspection within
         references/zia/ssl-inspection.md and web-log-schema.md
Severity: Low
Notes: Zscaler docs use both; pick one and align — or document the
       distinction if intentional. Not blocking.
```

### ❌ Vague findings without citation
```
Finding: confidence calibration seems off in some files
```
Better:
```
Finding: confidence: high in references/shared/oneapi.md without sources
         field populated (sources: empty)
Source: references/shared/oneapi.md:6 (frontmatter)
Severity: High
Remediation: Either populate sources (Tier A vendor docs) or downgrade
             to medium
```

### ❌ Scope creep mid-audit
Audit was scoped to `references/zia/logs/`. Auditor starts editing files in `references/zpa/`.

Better: note the cross-scope finding in **Notes**, mark out of scope, return to in-scope work. If the cross-scope finding is significant, open a separate audit cycle.

### ❌ "Resolved" without verification
Finding marked `Resolved` because the reviewer "fixed it" — but they didn't re-run the check or re-read the file to confirm.

Better: verify, then mark resolved. Leave a verification note: "Re-ran `check-hygiene.py` 2026-04-29 14:45 UTC — finding cleared."

### ❌ Wontfix without reason
```
Finding: ...
Status: Wontfix
```
Better:
```
Status: Wontfix
Notes: Out of scope — this is vendor PDF content extraction, tracked
       separately in clarification log-04. Re-evaluate when PDF parser
       lands.
```

## Practical guidelines

### When to open a finding
- Every check that fails (mechanical or editorial)
- Every observation that may be a defect, even if uncertain — mark severity `Info` and let the reviewer escalate
- When a pattern repeats across multiple files, open one finding with file list, not many duplicates

### What counts as a source
Same standard as a discovery journal claim:
- **File reference**: `references/zia/logs/web-log-schema.md`:L317
- **Script output**: `./scripts/check-hygiene.py` exit code 1; quote relevant lines
- **Cross-file comparison**: "compared `splunk-queries.md` `Tier A` vs. `siem-log-mapping.md` `Tier-A`"
- **Frontmatter inspection**: "`siem-log-mapping.md` frontmatter `confidence: medium`, `sources` has 4 entries — appropriate"

### When to mark status
- **Open**: default
- **Acknowledged**: reviewer agrees, deferring — note why and when to revisit
- **Resolved**: verified fix, with verification note
- **Acceptable**: intentional deviation or false positive — note the rationale
- **Wontfix**: out of scope or not worth fixing — note the reason

### Scope discipline
Define scope in the register header:
```
SCOPE: references/zia/logs/
TIMESTAMP: 2026-04-29 14:30 UTC
AUDITOR: <agent / user / mixed>
```
Findings outside scope go in **Notes** of the relevant in-scope finding, or in a separate "Out of scope observations" section at the end.

## Escalation criteria

Stop and escalate when:

| Criterion | Action |
|---|---|
| Finding requires changes to the methodology / discipline doc itself | Surface explicitly; don't silently change methodology mid-audit |
| Finding implies a structural change (rename, refactor, file split) | Open as `Acknowledged` with proposed remediation; don't execute mid-audit |
| Audit has run >30 minutes and findings exceed 20 | Stop; produce interim register; let the reviewer triage before continuing |
| Mechanical check is failing for reasons unclear to the agent | Capture script output verbatim; mark `Open`; let the user diagnose CI |

## Handoff format

```
AUDIT: <scope>
STATUS: <In progress / Complete / Partial>
TIMESTAMP: <when>

FINDINGS BY SEVERITY:
- Critical: <count>
- High: <count>
- Medium: <count>
- Low: <count>
- Info: <count>

[full register table]

OUT-OF-SCOPE OBSERVATIONS:
- <if any>

NEXT STEPS:
- <triage / fix / re-verify>
```

## Cross-links

- [`investigator/methodology.md`](../investigator/methodology.md) — parallel discipline for hypothesis-driven investigations
- [`auditor/prompt.md`](./prompt.md) — `/z-auditor` slash command playbook (lint flavor)
- [`siem-emission-discipline.md`](../siem-emission-discipline.md) — applies when audits query SIEMs (future audit subtypes)
- Mechanical CI scripts: `scripts/check-hygiene.py`, `scripts/check-citations.sh`, `scripts/check-staleness.sh`, `scripts/check-doc-links.py`
