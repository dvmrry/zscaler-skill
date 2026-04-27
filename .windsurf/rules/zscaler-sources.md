---
trigger: always_on
description: Enhanced Sources formatting for Zscaler answers
---

# Zscaler Sources Format

When answering Zscaler questions after invoking `/zscaler`, always end your response with a Sources section using this format:

```
## Sources
- `references/zia/url-filtering.md` (§ Rule Precedence)
- `references/shared/policy-evaluation.md` (§ Evaluation Order)
- `snapshot/zia/url-filtering-rules.json` (rule IDs 42, 47)
```

### Formatting guidelines:
- Use `## Sources` header (level 2)
- List each source on a separate line with `- ` bullet
- Wrap file paths in backticks for code formatting
- Include section references in parentheses with `§` symbol
- For snapshot files, include specific rule IDs consulted

### Examples:

**Simple answer:**
```
## Sources
- `references/zia/url-filtering.md` (§ Overview)
```

**Multi-source answer:**
```
## Sources
- `references/zia/url-filtering.md` (§ Rule Precedence)
- `references/zpa/app-segments.md` (§ Matching Logic)
- `references/shared/policy-evaluation.md` (§ Cross-Product)
```

**With snapshot data:**
```
## Sources
- `references/zia/url-filtering.md` (§ Rule Precedence)
- `snapshot/zia/url-filtering-rules.json` (rule IDs 15, 23, 42)
```
