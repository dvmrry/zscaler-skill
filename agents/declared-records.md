---
topic: "declared-records"
title: "Declared records - lightweight metadata for durable agent outputs"
content-type: reference
last-verified: "2026-05-23"
confidence: high
source-tier: practice
sources:
  - "agents/investigator/methodology.md (claim and evidence discipline precedent)"
  - "agents/soc/grounding/security-taxonomy.md (finding response-header precedent)"
  - "agents/auditor/methodology.md (audit register precedent)"
author-status: draft
---

# Declared records

Use declared records when an agent output crosses from reasoning into a durable
claim, finding, recommendation, decision, warning, or action item. The point is
not to impose one schema across all roles. The point is to make durable outputs
legible: what kind of record is this, what supports it, how confident is it, and
what state is it in?

Ordinary reasoning does not need a record header. Do not add ceremony to every
paragraph, turn, or intermediate thought.

## Core fields

Each role may rename or omit fields to fit its register, but durable records
should usually expose:

- **Record type** - finding, recommendation, warning, decision, claim, gap,
  action item, or note.
- **Evidence / source** - file path, line, journal entry, query result, API
  response, user-provided artifact, or explicit source class checked.
- **Confidence** - high, medium, low, or open/unknown, calibrated to evidence
  quality.
- **Status** - the role's lifecycle state, such as Open, Proposed,
  Acknowledged, Resolved, Accepted, Rejected, Wontfix, or Deferred.
- **Disproof / validation** - what would falsify, downgrade, verify, or close
  the record.

Use the role's existing vocabulary where it already exists. Do not force SOC
finding fields onto researcher, architect, retro, or auditor outputs.

## Role expression

| Role | Declared records usually are | Natural metadata |
|---|---|---|
| Investigator | Root-cause claims, hypothesis pivots, final resolution claims | Claim status, evidence, confidence, next evidence or disproof |
| Auditor | Audit findings | Severity, source, status, remediation, verification |
| Researcher | Source-boundary decisions, extraction gaps, verifier findings | Source class, coverage, confidence, known gap, do-not-infer boundary |
| Architect | Recommendations and architectural decisions | Risk, evidence layer, tradeoff, confidence, validation or rollback |
| SOC | Posture findings | Severity, category, taxonomy, source, confidence, status, disproof |
| Retro | Warnings, lessons, action items, final gates | Evidence, disposition, lesson, required change, owner if supplied, gate impact |

## Anti-patterns

- Turning every answer into a rigid form.
- Copying scanner metadata such as run IDs, branch names, owners, or commits
  unless the role actually has that context and the user asked for it.
- Using frameworks, patterns, or best practices as proof. They classify or
  guide the record; evidence proves the record.
- Marking a record resolved or complete without re-reading, re-running, or
  otherwise verifying the closing condition.
