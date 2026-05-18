---
role: researcher
artifact: grounding
title: "Researcher grounding - efficient source extraction discipline"
content-type: prompt
last-verified: "2026-05-18"
confidence: high
source-tier: practice
sources:
  - "references/_meta/template.md"
  - "scripts/check-hygiene.py"
dependencies: []
author-status: draft
---

# Researcher grounding - efficient source extraction discipline

Use this grounding index before `/z-researcher` starts Step 1.

## Source selection

Prefer sources in this order:

1. Existing `sources:` frontmatter on the target reference
2. Adjacent SDK or API references for the same product
3. Vendor help captures already present under `vendor/`
4. Nearby reference files only to identify cross-links or contradictions

Do not broaden the source set just because a topic is interesting. Ask before expanding beyond the confirmed scope.

## Extraction discipline

- Extract exact fields, wire keys, endpoint paths, enum names, and line references.
- Keep source quotes short and targeted.
- Capture contradictions separately from new content.
- Put missing or unsupported findings in `Gaps`, not the body.
- Do not use operator scenarios as documentation unless a source supports them.

## Efficiency tips

- Read the target once for current claims and structure.
- Use `rg` for field names, endpoint paths, enum names, and cited source filenames.
- Mine source files in batches by product/source family.
- Stop extraction when every requested scope item is either supported, contradicted, or listed as a gap.

## Verification discipline

The writer may only use the extraction report. The verifier checks the diff against that report and spot-checks citations. If verification finds a wrong citation, fix or redo before committing.
