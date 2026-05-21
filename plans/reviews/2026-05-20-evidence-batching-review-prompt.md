# Review Prompt: Investigator Evidence Batching Plan

Review this plan:

- `plans/2026-05-20-investigator-evidence-batching-plan.md`

Context:

- This is a soft mechanical refactor of a working `/z-investigator` model.
- The current model is reliable but noisy and slow in long investigations.
- We want to reduce chat noise, manual artifact handling, repeated helper
  invocations, and repeated journal prose without weakening auditability.
- More real cases should raise retros and feed small operational/mechanical
  improvements back into the workflow.

Please write your review to:

- `plans/reviews/2026-05-20-<agent>-evidence-batching-review.md`

Focus questions:

1. Is the plan correctly scoped as a soft refactor rather than a new workflow?
2. Are the artifact visibility tiers correct? What should remain visible in
   chat, and what should be disk-only?
3. Is the performance budget realistic? What should block a helper change from
   landing?
4. Which integrity checks are load-bearing, and which could be cheaper local
   change detection?
5. Is Slice 0 (journal shape first) the right first step?
6. Is Shape A (evidence import + generated turn JSON) enough before considering
   `record-evidence-batch`?
7. What failure mode would make batching unsafe?
8. What minimal eval should block merging helper changes?

Preferred response shape:

```markdown
# <Agent> Review: Investigator Evidence Batching Plan

## Bottom Line

## Blockers

## Recommendations

## Answers To Focus Questions

## Minor Notes
```
