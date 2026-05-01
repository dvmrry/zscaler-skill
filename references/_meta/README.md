---
product: shared
topic: "meta-index"
title: "references/_meta/ — kit-internal documentation"
content-type: reference
last-verified: "2026-04-30"
confidence: high
sources: []
author-status: draft
---

# `references/_meta/` — kit-internal documentation

Single home for everything that documents *the kit itself* — methodology, conventions, registers, archives — distinct from the kit's *content* (Zscaler product references) which lives in sibling product directories.

## Single rule

Anything under `references/_meta/` is kit-internal. Anything else under `references/` is product content.

## What's here

| Path | Purpose |
|---|---|
| [`agent-patterns.md`](./agent-patterns.md) | Reusable patterns agents apply across the kit (read this, then a question, etc.) |
| [`archive/`](./archive/) | Superseded / historical content kept for reference. Exempt from orphan checks; intentional dead-ends. |
| [`clarifications.md`](./clarifications.md) | The canonical register of open + resolved questions across the kit. Each gets a stable ID (`zia-03`, `shared-02`, etc.) referenced from topical docs. |
| [`evals/evals.json`](./evals/evals.json) | 19 hand-written behavioral evals — prompt + expected output + assertions + must-cite + must-not-say. See [`evals/README.md`](./evals/README.md) and `scripts/run-evals.py`. |
| [`layering-model.md`](./layering-model.md) | The skill kit's mental layering model — what's vendor truth vs. derived vs. opinionated. |
| [`policy-simulation.md`](./policy-simulation.md) | Notes on the policy-simulation reasoning approach used by the simulate scripts. |
| [`portfolio-map.md`](./portfolio-map.md) | Top-level catalog of every Zscaler product with depth tier (deep-dive / awareness / out-of-scope). Entry point for "does Zscaler have a product for X?" questions. |
| [`primer/`](./primer/) | Foundational educational material — networking basics, identity, zero-trust philosophy, Zscaler platform shape. Synthesis docs, not vendor-sourced; cite-light by design. |
| [`runbooks.md`](./runbooks.md) | Cross-product operational runbooks. |
| [`template.md`](./template.md) | Frontmatter template for new reference files. Copy this when authoring. |
| [`verification-protocol.md`](./verification-protocol.md) | The discipline for resolving open questions / verifying claims; how a clarification moves from open to resolved. |

## Conventions

- Files here can have empty `sources:` even at `confidence: high` — the `check-hygiene.py` aggregator-exemption applies because these are synthesis / index / register / archive docs, not source-derived content. (Specifically: any reference file whose path includes a `_`-prefixed ancestor dir is exempted.)
- Primer files (`_meta/primer/*`) are intentionally cite-light because they're educational synthesis of common knowledge.
- The `archive/` subdir is exempt from `check-orphans.py` — its contents are intentional dead-ends preserved for historical context.
- New meta files go here, never at `references/` root. New product content goes in a product directory, never here.

## Cross-links

- [`../../docs/_meta/style-guide.md`](../../docs/_meta/style-guide.md) — parallel meta dir for the docs/ side; covers visual design / page archetypes / file-naming semantics
- [`../../IMPROVEMENTS.md`](../../IMPROVEMENTS.md) — kit-level backlog and proposed work
- [`../shared/`](../shared/) — cross-product reference content (NOT meta; these are real product references that span products)
