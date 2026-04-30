---
product: zia | zpa | shared
topic: "canonical-slug-stable-across-renames"
title: "Human-readable title"
content-type: reasoning | reference
last-verified: ""
confidence: high | medium | low
sources: []
author-status: stub | draft | reviewed
---

# Title

## Field conventions

- **product** — `zia`, `zpa`, or `shared` (cross-product material).
- **topic** — a stable machine-readable slug. Keep it the same if you rename the file's title; this is the join key for any future index.
- **content-type** — `reasoning` for hand-authored behavior-of-Zscaler content (the core value of this repo); `reference` for reproduced/paraphrased API surfaces, Terraform schemas, or KB restatements. The distinction lets future tooling weight them differently.
- **last-verified** — ISO date (`YYYY-MM-DD`) the content was checked against live behavior or official docs. Leave empty (`""`) while `author-status: stub`. Fill when you move to `draft` or `reviewed`.
- **confidence** — `high` = confirmed in a lab or ironclad docs; `medium` = inferred from docs or one operator's experience; `low` = unverified or stub. Answers using this file should inherit the confidence.
- **sources** — URLs and/or local paths backing the content. Pair public URLs with local `vendor/` paths where possible (e.g. `vendor/terraform-provider-zia/docs/resources/url_filtering_rules.md`) — the vendored copy is pinned and reproducible, the URL is browsable. Empty list is fine for `stub`; required to move to `draft`.
- **author-status** — `stub` = headings only; `draft` = prose written, not independently verified; `reviewed` = confirmed accurate.

## Section skeleton

```markdown
## Summary
One-paragraph answer to the core question this file addresses.

## Mechanics
How it actually works. Ordered, specific, and citation-linked.

## Edge cases
The places intuition fails. This is the high-value section.

## Worked example
Concrete scenario with inputs → outputs. Ideally paired with an eval prompt.

## Open questions
Things that need verification; link them to `evals/` entries if you add them.
```

Not every file needs every section. **Edge cases** is the one that justifies this skill existing — don't skip it.

## Handling open questions

When you can't answer something from the sources, don't fabricate a guess. Record it in two places:

1. **This file's Open questions section** — one-line summary, linked to the canonical ID below.
2. **[`clarifications.md`](clarifications.md)** — the full entry with a stable ID (`zia-XX`, `zpa-XX`, `log-XX`, `shared-XX`), what kind of evidence resolves it, and its status.

Cross-link both ways. In your doc:

```markdown
## Open questions

- Does `*.example.com` match `example.com` itself? See [clarification zia-03](.clarifications.md#zia-03).
```

When `clarifications.md` later gets an answer, the `Status:` line there changes to `resolved` with the answer inline — at which point you can fold the answer back into the relevant section of your reference doc and remove the Open question bullet (but leave the clarification entry for history).
