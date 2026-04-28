# Zscaler Workflow Test Questions

Five test questions to evaluate workflow compliance and Rule effectiveness:

## Test 1: Product-specific routing
**Question:** How do ZIA URL filtering rules handle precedence when multiple rules match the same URL?

**Expected path:**
- SKILL.md routing → references/zia/url-filtering.md
- Should include Sources, Reasoning, Confidence
- Tests core product-specific knowledge

## Test 2: Compound question (breadth + product-specific)
**Question:** What is ZPA and how does its app segmentation work with SCIM integration?

**Expected path:**
- Pre-routing breadth check → references/_portfolio-map.md
- Continue to SKILL.md for product-specific details
- Tests compound question handling

## Test 3: SDK/Terraform terminology
**Question:** How do I configure source_ip_anchor in a ZIA Terraform resource for SIPA?

**Expected path:**
- SKILL.md routing → references/zia/terraform.md
- Should also load references/shared/terminology.md
- Tests terminology lookup requirement

## Test 4: Tenant-specific with snapshot
**Question:** Is reddit.com in any URL filtering category in our tenant?

**Expected path:**
- Snapshot check → snapshot/zia/url-categories.json
- Tests conditional Step 5 execution
- Should cite specific rule IDs if found

## Test 5: Trivial lookup (Sources only)
**Question:** What is a URL category?

**Expected path:**
- Pre-routing primer check → references/_primer/index.md
- Should include Sources only (no Reasoning/Confidence)
- Tests trivial question exception

## Success Criteria

For each question, check:
1. **Routing compliance** - Did it load the correct reference files?
2. **Format compliance** - Did it follow the template structure?
3. **Section completeness** - Which sections were included?
4. **Source formatting** - Are file paths in backticks with § sections?
5. **Special cases** - Were exceptions handled correctly (trivial questions, compound questions)?

## Expected Results Based on Model Tier

**Strong models (Claude, GPT-4):** Should pass all 5 tests with full format compliance
**Free-tier Windsurf:** May pass routing but struggle with format sections
**Rule effectiveness:** Sources section should be most reliable due to `trigger: always_on`
