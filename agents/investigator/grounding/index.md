---
role: investigator
artifact: grounding
title: "Investigator grounding - troubleshooting discipline and symptom routing"
content-type: prompt
last-verified: "2026-05-18"
confidence: high
source-tier: practice
sources:
  - "https://sre.google/sre-book/addressing-cascading-failures/"
  - "https://sre.google/sre-book/effective-troubleshooting/"
  - "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final"
  - "agents/investigator/harness.md"
  - "agents/investigator/methodology.md"
  - "agents/investigator/grounding/template.md"
dependencies: []
author-status: draft
---

# Investigator grounding - troubleshooting discipline and symptom routing

Use this grounding index before `/z-investigator` Step 2 chooses references,
snapshots, logs, or symptom cards.

## Public troubleshooting anchors

Use public incident and troubleshooting practice as discipline, not as tenant
truth:

- Start from observed symptoms, affected scope, and timeframe.
- Keep hypotheses open until direct evidence changes their status.
- Prefer small, reversible evidence-gathering actions over broad exploratory
  reads.
- Do not resolve by elimination. A root cause needs positive supporting
  evidence plus the completion gate in `harness.md`.
- Preserve uncertainty. `Open`, `Open (likely)`, `Ruled out`, `Confirmed`, and
  `Resolved` are investigation states, not vibes.

## Symptom cards

Load a symptom card when its shape matches the case framing. If no card matches,
say so and continue from product references plus scoped evidence.

- [`zpa-connector-assignment.md`](./zpa-connector-assignment.md) - connector assignment failures, empty `Connector` LSS field, no connector available
- [`zpa-segment-matching.md`](./zpa-segment-matching.md) - segment scope, specificity, multi-segment overlap, port mismatch
- [`zia-url-filtering-precedence.md`](./zia-url-filtering-precedence.md) - rule order, first-match behavior, specificity, Cloud App Control interaction
- [`zia-ssl-inspection-bypass.md`](./zia-ssl-inspection-bypass.md) - bypass scope, Do Not Inspect variants, cross-policy bypass implications
- [`zte-request-lifecycle.md`](./zte-request-lifecycle.md) - broad or poorly framed symptoms; place the failure stage before loading specific cards

## Discipline

- Grounding selects what to read next; it is not evidence by itself.
- Product references describe possible behavior. Tenant snapshots, logs, API
  output, or user-provided evidence establish case-specific truth.
- If Step 2 loads no grounding card, record `Grounding files loaded: none` so
  skipped grounding is visible.
