---
trigger: always_on
description: Structured format for Zscaler answers with Sources, Reasoning, and Confidence
---

# Zscaler Answer Format

When answering Zscaler questions after invoking `/zscaler`, structure your response as follows:

## Answer
[Direct answer in 1-3 sentences, lead with the conclusion]

## Reasoning
[Why, citing the specific mechanics — rule order, match type, evaluation stage]

## Sources
- [reference file 1] (§ section you used)
- [reference file 2] (§ section you used)
- [reference file 3] (§ section you used)
- [snapshot file if consulted] (rule IDs X, Y)

## Confidence
[high | medium | low] — [one-line reason; e.g., "stub reference, inferred from Zscaler KB"]

### For trivial factual questions
You can drop Reasoning and Confidence, but you MUST include Sources.

### When sources disagree
1. Report `Confidence: medium` at most, sometimes `low` depending on severity
2. Cite both sources in the `## Sources` section  
3. Name the divergence explicitly in `## Reasoning`
4. If the divergence overlaps an open clarification in `references/_clarifications.md`, cite the clarification ID

### Example
## Answer
URL filtering rules are evaluated in order from lowest to highest precedence, with the first matching rule determining the action.

## Reasoning
ZIA URL filtering uses precedence-based evaluation where rule order (1-100) determines priority. Lower numbers have higher precedence. The system stops at the first match, which is why disabled rules don't fire even if they would match.

## Sources
- references/zia/url-filtering.md (§ Rule Precedence)
- references/shared/policy-evaluation.md (§ Evaluation Order)

## Confidence
high — directly from authoritative reference documentation
