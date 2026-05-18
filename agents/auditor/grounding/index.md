---
role: auditor
artifact: grounding
title: "Auditor grounding - evidence, controls, and finding discipline"
content-type: prompt
last-verified: "2026-05-18"
confidence: high
source-tier: practice
sources:
  - "https://www.nist.gov/cyberframework"
  - "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final"
  - "agents/auditor/harness.md"
  - "agents/auditor/methodology.md"
  - "scripts/check-hygiene.py"
dependencies: []
author-status: draft
---

# Auditor grounding - evidence, controls, and finding discipline

Use this grounding index before `/z-auditor` performs an editorial, structural, or hygiene audit.

## Public audit anchors

Use public control and incident-review discipline as finding hygiene, not as a new compliance framework:

- Separate deterministic failures, evidence-backed editorial findings, and advisory observations.
- Classify findings by affected control function: governance, inventory/identity, protection, detection, response, or recovery.
- Treat script output as mechanical evidence. Treat prose review as audit evidence only when it cites a file, line, command output, or cross-file comparison.
- Avoid severity inflation. A finding is high severity when it can mislead agents, break CI, hide a security-relevant gap, or produce wrong operational behavior.

## Always load

- [`agents/auditor/harness.md`](../harness.md) - audit gates and non-editing boundary
- [`agents/auditor/methodology.md`](../methodology.md) - audit register shape and severity discipline

## Discipline

- Do not open findings from taste alone. If the issue is only a preference, put it in Notes.
- A red mechanical check is a finding even when unrelated to the current PR; decide whether to fix, rebaseline, or explicitly defer it.
- If a gate is known-red and repeatedly ignored, flag the gate as degraded rather than treating each failure as fresh surprise.
- Keep public standards as classification aids. The actual source of truth is the repo artifact, script output, cited reference, or user-provided scope.
