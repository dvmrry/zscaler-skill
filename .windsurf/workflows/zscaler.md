---
description: Zscaler knowledge routing - dynamically load relevant reference docs based on question shape
---

# Zscaler Knowledge Workflow

This workflow routes Zscaler questions to the appropriate reference documentation, loading only what's needed rather than the entire skill.

**Note:** This workflow targets routing compliance — loading the correct reference files via SKILL.md. Free-tier Windsurf agents may produce free-form answers without structured Sources/Reasoning/Confidence sections. That's acceptable. Correct content from the right source beats formatted content from memory.

## Step 1: Snapshot check

Before answering tenant-specific questions, check whether `snapshot/` has data:

```bash
ls -A snapshot/ | grep -v '^\.gitkeep$'
```

Store the result as a mental flag: `snapshot_available: yes/no`. If empty, note this explicitly - you can answer general behavior questions but not tenant-specific lookups.

Also check if `iac/` has production IaC (different from reference IaC under `vendor/`):

```bash
ls -A iac/ | grep -v '^\.gitkeep$'
```

Store: `iac_available: yes/no`.

## Step 2: Pre-routing (check these FIRST — early exit if purely conceptual)

If the question is a **breadth question** ("does Zscaler have a product for X?", "what is Risk360?", "is AppProtection part of ZPA?"):
- Use `read_file` to load `references/_portfolio-map.md`
- If the question is purely conceptual (no product-specific mechanics needed), answer and stop here
- If the question also asks for product-specific behavior (e.g., "what is Risk360 and how does it integrate with ZPA?"), read the pre-routing file then continue to Step 3

If the question is a **prerequisite-knowledge question** ("what's a proxy?", "how does SAML work?", "what is zero trust?"):
- Use `read_file` to load `references/_primer/index.md`
- If the question is purely conceptual, answer and stop here
- If the question also asks for product-specific behavior, read the pre-routing file then continue to Step 3

If the question is a **meta-question about the skill**:
- Use `read_file` to load `references/_layering-model.md`
- Answer and stop here

**Test for purely conceptual:** Does the question need product-specific mechanics (rule precedence, API behavior, config fields)? If yes, continue to Step 3. If no, stop here.

## Step 3: Load SKILL.md for product-specific routing

Use `read_file` to read `SKILL.md`. Follow its Question Routing table to identify the correct reference file(s). Use `read_file` to load those files.

**If the question is about SDK or Terraform configuration:** Also use `read_file` to load `references/shared/terminology.md` to get field name mappings (e.g., `source_ip_anchor` for SIPA, `app_segment_group` for ASG). This ensures accurate field name references in configuration answers.

**If SKILL.md fails to load:** Surface the error to the user ("unable to load skill routing — check that references/ is accessible") and stop. Do not guess from a cached subset.

**If no match in SKILL.md:** Use `read_file` to load `references/_portfolio-map.md` and ask one clarifying question to narrow down the product domain.

## Step 4: Check clarifications

Use `grep` to find relevant clarification entries:

```bash
grep -n "^### zia-\|^### zpa-\|^### zcc-\|^### shared-" references/_clarifications.md
```

This gives entry headings with line numbers. If a specific entry looks relevant, use `read_file` with `offset` and `limit` to read just that section. For most answers, the grep output alone is enough to know whether a clarification applies and what its status is.

Cite any relevant clarification IDs in your answer.

## Step 5: Consult snapshot (conditional)

**IF** `snapshot_available: yes` (from Step 1) AND the question is tenant-specific (e.g., "is reddit.com in a URL category in OUR tenant?"):
- Use `read_file` on the relevant snapshot JSON (e.g., `snapshot/zia/url-categories.json`, `snapshot/zia/url-filtering-rules.json`, `snapshot/zpa/app-segments.json`)
- Cite the specific rule IDs you used

**ELSE:** Skip this step.
