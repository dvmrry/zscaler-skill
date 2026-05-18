---
role: soc
artifact: harness
title: "SOC - posture review gate contract"
content-type: prompt
last-verified: "2026-05-18"
confidence: high
source-tier: practice
sources:
  - "agents/auditor/methodology.md"
  - "agents/investigator/methodology.md"
  - "agents/siem-emission-discipline.md"
dependencies:
  - "../auditor/methodology.md"
  - "../investigator/methodology.md"
  - "../siem-emission-discipline.md"
  - "../clarification-pattern.md"
author-status: draft
---

# SOC - posture review gate contract

This harness defines the stops for `/z-soc`. SOC reviews security posture. It does not investigate an active symptom unless the user explicitly redirects to `/z-investigator`.

## Gate 1 - Scope and subtype gate

Before reviewing, identify:

- Scope
- Subtype: `policy`, `access`, `coverage`, `config`, `activity`, or a stated combination
- Threat model, or `general posture review`
- Tenant cloud if snapshot data is expected

If scope is missing or subtype cannot be inferred, ask one multiple-choice clarification and stop.

## Gate 2 - Grounding gate

Before findings, load the relevant product reference, schema, or snapshot/index path needed for the subtype.

Evidence preference:

1. `_data/snapshot/<cloud>/`
2. `_data/cases/<slug>/evidence/`
3. `_data/schemas/`
4. SIEM output or user-provided query result
5. Vendor reference

Do not browse sibling case contents. Directory names are allowed only for disambiguation.

## Gate 3 - Posture finding gate

Every finding must include:

- Subtype
- Threat model or posture concern
- Source
- Severity
- Status
- Remediation

High and Critical findings also need control family, blast radius, detection coverage, and compensating controls when evidence supports them.

## Gate 4 - Save gate

Save the posture register to `_data/cases/<slug>/posture.md` unless the user opts out or the repository is not writable.

If no case directory exists, create a routine SOC review slug with the pattern `<YYYY-MM-DD>-soc-<scope-descriptor>`.

## Prohibitions

- Do not change tenant state.
- Do not mark findings `Resolved` without verification.
- Do not convert a posture exposure into an active-exploitation claim. Hand off exploitability questions to `/z-investigator`.
