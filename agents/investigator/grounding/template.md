---
role: investigator
artifact: grounding-template
title: "Investigation grounding card template"
content-type: reference
last-verified: "2026-05-14"
confidence: medium
source-tier: practice
sources:
  - "agents/investigator/prompt.md"
  - "agents/investigator/methodology.md"
author-status: draft
---

# Investigation Grounding Card Template

Grounding cards are lightweight symptom-to-context profiles. They are not
diagnostics and they are not runbooks. Use a grounding card when a symptom needs
a non-obvious cluster of reference docs, snapshot files, or evidence sources
before the investigator can form good hypotheses.

Do not create a grounding card for every topic. If normal product references and
index pages already lead to the right context, no card is needed.

## Template

```markdown
---
role: investigator
artifact: grounding
title: "<symptom shape> — investigation grounding card"
content-type: reference
last-verified: "YYYY-MM-DD"
confidence: medium
source-tier: practice
sources:
  - "references/<product>/<source>.md"
author-status: draft
---

# <Symptom Shape>

## Use when

- <symptom wording or condition>

## Expected behavior anchors

- `references/<product>/<source>.md` section `<heading>` — <why this anchor matters before reasoning>

## Load docs

- `references/<product>/<source>.md`

## Inspect snapshot

- `_data/snapshot/<cloud>/<product>/<file>.json`

## Use runtime logs only when

- <condition where snapshot/reference evidence is insufficient>
```

## When To Add One

Add a grounding card when all of these are true:

1. The symptom has appeared in a real or likely investigation.
2. The correct first context spans multiple files or data sources.
3. A simple keyword match would likely load an incomplete context set.

## When Not To Add One

Do not add a grounding card when:

- A single product reference already answers the load path.
- The card would only duplicate an index page.
- The content is an ordered proof/disproof sequence. Use
  [`../diagnostics/template.md`](../diagnostics/template.md) for that shape.
