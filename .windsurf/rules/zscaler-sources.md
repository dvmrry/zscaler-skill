---
trigger: always_on
description: Structured answer format for Zscaler questions
---

# Zscaler Answer Format

When answering a Zscaler question after invoking `/zscaler`, complete this template:

## Answer
<direct answer in 1–3 sentences; lead with the conclusion>

## Reasoning
<why, citing the specific mechanics — rule order, match type, evaluation stage>

## Sources
- `path/to/reference.md` (§ Section name)
- `snapshot/path.json` (rule IDs N, M — only when snapshot consulted)

## Confidence
high | medium | low — <one-line reason; e.g. "stub reference, inferred from Zscaler KB">

---

## Two exceptions

**Trivial lookups** (e.g. "what is a URL category?") — drop Reasoning and Confidence. Keep Sources.

**Sources disagree** —
- Confidence is `medium` at most, `low` if the divergence is severe.
- List both sources.
- Name the divergence in Reasoning.
- If it matches an entry in `references/_clarifications.md`, cite the ID (e.g. `zia-15`).
