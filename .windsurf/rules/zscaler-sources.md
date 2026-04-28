---
trigger: always_on
description: Complete structured format for Zscaler answers
---

# Zscaler Answer Format

When answering Zscaler questions after invoking `/zscaler`, structure your response as follows:

## Answer
[Direct answer in 1-3 sentences, lead with the conclusion]

## Reasoning
[Why, citing the specific mechanics — rule order, match type, evaluation stage]

## Sources
- `references/zia/url-filtering.md` (§ Rule Precedence)
- `references/shared/policy-evaluation.md` (§ Evaluation Order)
- `snapshot/zia/url-filtering-rules.json` (rule IDs 42, 47)

## Confidence
[high | medium | low] — [one-line reason; e.g., "stub reference, inferred from Zscaler KB"]

### Formatting guidelines:

**Answer section:**
- Use `## Answer` header (level 2)
- Provide direct answer in 1-3 sentences
- Lead with the conclusion

**Reasoning section:**
- Use `## Reasoning` header (level 2)
- Explain why, citing specific mechanics
- Reference rule order, match types, evaluation stages

**Sources section:**
- Use `## Sources` header (level 2)
- List each source on separate line with `- ` bullet
- Wrap file paths in backticks for code formatting
- Include section references in parentheses with `§` symbol
- For snapshot files, include specific rule IDs consulted

**Confidence section:**
- Use `## Confidence` header (level 2)
- Choose one: high, medium, or low
- Provide one-line reason for confidence level

### Special cases:

**For trivial factual questions:**
You can drop Reasoning and Confidence, but you MUST include Sources.

**When sources disagree:**
1. Report `Confidence: medium` at most, sometimes `low` depending on severity
2. Cite both sources in the `## Sources` section
3. Name the divergence explicitly in `## Reasoning`
4. If the divergence overlaps an open clarification in `references/_clarifications.md`, cite the clarification ID

### Example:

## Answer
URL filtering rules are evaluated in order from lowest to highest precedence, with the first matching rule determining the action.

## Reasoning
ZIA URL filtering uses precedence-based evaluation where rule order (1-100) determines priority. Lower numbers have higher precedence. The system stops at the first match, which is why disabled rules don't fire even if they would match.

## Sources
- `references/zia/url-filtering.md` (§ Rule Precedence)
- `references/shared/policy-evaluation.md` (§ Evaluation Order)

## Confidence
high — directly from authoritative reference documentation
