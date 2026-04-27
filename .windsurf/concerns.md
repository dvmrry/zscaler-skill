# Workflow Concerns

Notes and concerns about the Zscaler workflow implementation from a Windsurf Cascade agent perspective.

## Identified Issues

### 1. Step 1 vs Step 5 redundancy
- Step 1 checks if `snapshot/` has data
- Step 5 says "Consult snapshot if available"
- This is circular - why check twice? The logic should be: check once, then either consult or skip.

### 2. No pattern matching algorithm
- Step 2 has 60+ question shapes but doesn't specify HOW to match
- Is it keyword matching? Semantic matching? Exact phrase matching?
- Example: "Question mentions Cloud App Control rule (CAC)" - what if user says "cloud app control" without the acronym? What if they say "CAC" without "rule"?

### 3. Ambiguous "question shape" terminology
- What exactly constitutes a "question shape"?
- The examples are quoted strings but not formal patterns
- No guidance on partial matches or fuzzy matching

### 4. Step 2 vs Step 3 precedence unclear
- Step 3 has "special routing cases" that could overlap with Step 2
- Which takes priority? Should I check Step 3 first, or Step 2 first?
- Example: "what is Risk360?" could match both Step 2 (breadth) and Step 3 (special case)

### 5. No definition of "genuinely spans domains"
- Step 2 says "don't read multiple unless the question genuinely spans domains"
- What does "genuinely spans domains" mean? No criteria provided.
- When is 2 files appropriate vs 3 files?

### 6. Step 4 timing ambiguous
- "Before quoting any reference summary" - does this mean check AFTER reading the file?
- Or check BEFORE reading the file to know if there are clarifications?
- The wording suggests post-read, but that's inefficient

### 7. No fallback for unmatched questions
- What if the user's question matches nothing in Step 2 or Step 3?
- No default behavior specified
- Should I ask for clarification? Default to a specific file?

### 8. Sequential vs conditional flow unclear
- The workflow is numbered 1-6 suggesting sequential execution
- But some steps are conditional (Step 5: "if snapshot is populated")
- The flow diagram isn't clear - should I skip Step 5 if Step 1 found no data?

### 9. Answer format doesn't handle multi-source answers
- What if I need to cite 3 different reference files?
- The Sources example shows 2 files but no guidance on more
- How to structure Reasoning when spanning multiple domains?

### 10. No guidance on tool invocation
- The workflow says "Read the appropriate reference file" but doesn't specify which tool
- Should I use `read_file`? `grep`? Search within files?
- Windsurf agents need explicit tool instructions

## Windsurf-Specific Considerations

Reference documentation for Windsurf workflows and skills is available locally in `.windsurf/docs/`:
- `.windsurf/docs/workflows.md` - Workflow specification and usage
- `.windsurf/docs/skills.md` - Skills specification and progressive disclosure

### Skill vs Workflow Decision

Based on Windsurf documentation (see `.windsurf/docs/workflows.md` and `.windsurf/docs/skills.md`):

**Workflows:**
- Structured sequences of steps
- Saved as markdown in `.windsurf/workflows/`
- Invoked via `/[workflow-name]`
- Sequential step execution
- Can call other workflows

**Skills:**
- Bundle supporting files (scripts, templates, checklists)
- Use **progressive disclosure** - only name/description shown by default
- Full content loaded only when invoked or @mentioned
- Keeps context window lean
- Better for complex multi-step tasks with supporting resources

**Recommendation:** The Zscaler skill might work better as a **Skill** rather than a Workflow because:
- It has 100+ reference files in `references/`
- It needs progressive disclosure (only load relevant files based on question)
- It's meant to be invoked when Zscaler topics come up
- The current SKILL.md already follows the agentskills.io specification

The workflow shim we created is essentially trying to replicate what Skills do natively with progressive disclosure.
