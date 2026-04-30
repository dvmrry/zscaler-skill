---
type: audit-template
title: "Coverage audit template"
---

# Coverage audit — YYYY-MM-DD

Each audit follows this fixed structure so consecutive audits are diff-able. Copy this file to `archive/audits/YYYY-MM-DD.md` and fill in.

## 1. Header

- **Date**: YYYY-MM-DD
- **Scope**: which products / directories were audited (e.g. "all of `vendor/zscaler-help/`", or "ZPA + Cloud Connector only")
- **Method**: how files were classified (e.g. "frontmatter `sources` grep + keyword search + spot-read")
- **Vendor doc count**: total files in scope
- **Reference file count**: total files in `references/` at audit time

## 2. Headline numbers

| Metric | Count |
|---|---|
| Total files in scope | |
| Covered | |
| Partial | |
| Uncovered | |
| Skip (marketing, release notes, trivial) | |

Definitions:
- **Covered**: a reference file demonstrably treats the topic as primary or major secondary subject.
- **Partial**: topic appears as an aside or brief mention; would benefit from extension.
- **Uncovered**: no reference file addresses the topic.
- **Skip**: marketing / duplicate / out-of-scope; will not be pursued.

## 3. Per-product breakdown

| Product | In scope | Covered | Partial | Uncovered | Skip |
|---|---|---|---|---|---|
| ZIA | | | | | |
| ZPA | | | | | |
| ZCC | | | | | |
| Cloud Connector | | | | | |
| ZDX | | | | | |
| ZIdentity | | | | | |
| ZWA | | | | | |
| Tier-2 products (Risk360, Deception, ZMS, ZBI, AI Security) | | | | | |
| Shared / cross-product | | | | | |
| Marketing / skip | | | | | |

## 4. High-priority uncovered

| Vendor file | Topic | Why it matters | Suggested reference target |
|---|---|---|---|
| | | | |

## 5. Resolved since last audit

What was uncovered or partial in the previous audit and is now covered.

| Vendor file | Last audit status | Now | Where covered |
|---|---|---|---|
| | | | |

## 6. Newly uncovered since last audit

Vendor files added or surfaced since the previous audit that don't yet have reference coverage.

| Vendor file | Topic | Why it matters | Suggested reference target |
|---|---|---|---|
| | | | |

## 7. Skip pile

| Vendor file | Reason to skip |
|---|---|
| | |

## 8. Recommended next-doc list

Prioritized by operational value.

| Priority | Vendor doc(s) | Proposed reference file | Rationale |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

*Audit conducted YYYY-MM-DD. Based on static analysis of vendor materials and reference files. Methodology, classification confidence, and any caveats noted here.*
