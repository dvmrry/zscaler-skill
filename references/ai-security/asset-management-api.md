---
product: ai-security
topic: "ai-security-asset-management-api"
title: "AI Security Public API — assets, MCP servers, and issues"
content-type: reference
last-verified: "2026-07-20"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
  - "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md"
author-status: draft
---

# AI Security Public API — assets, MCP servers, and issues

The current Automate capture introduces a distinct **AI Security Public API** contract, separate from AI Guard's runtime and admin APIs. It is titled `AI Infrastructure`, uses the production base URL `https://api.zsapi.net/aisecurity/aispm`, and exposes 11 read-only operations for AI-related asset inventory and governance findings (`vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json`; operation count at `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:9`).

## Operation families

| Family | Operations | What the contract exposes |
|---|---:|---|
| Data stores | 2 | List and get data stores such as S3 buckets, blob storage, and databases; includes cloud account, environment, scan time, risk, sanction status, and source metadata (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:2-183`). |
| Identities | 2 | List and get identities discovered across AI assets. IDs containing slashes, including GCP resource names, must use the list endpoint's `id` query rather than the path form (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:443-609`). |
| Issues | 2 | List and get security findings across asset types, filterable by environment, severity, source type, and status (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:841-1090`). |
| MCP servers | 3 | List/get discovered MCP servers and list the tools exposed by one server. Records include source association, region, risk indicators/score/level, sanction status, and server type (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:1432-1903`). |
| Workloads | 2 | List and get compute/container workloads associated with AI assets, including scan time, risk, sanction status, and source metadata (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:2260-2441`). |

All list operations are cursor-paginated. The documented default page size is 25 and maximum is 200. Preserve filters, sort, and page size while following a cursor; the contract warns that changing them can skip or duplicate records. A malformed cursor restarts at the first page, so clients should detect replay/duplication rather than assuming an invalid cursor fails closed (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:211-229`). Continue until `next_cursor` is empty; do not drive pagination from `total_count`, which is approximate and may be zero after the first page (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:393-415`, `:1082`).

## Important boundaries

- This is an **inventory and findings** surface. The captured 11 operations are all `GET`; they do not create, update, sanction, suppress, or remediate assets or issues.
- The published issue-status enum is `open`, `ignored`, `snoozed`, `resolved`, or `closed`, but its prose example says `open,suppressed`. `suppressed` is not in the captured enum, so treat it as documentation drift until a live authenticated call or vendor correction resolves it (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:1176`).
- A source-tree search at this review point did not find a dedicated wrapper for these `/aisecurity/aispm` operations in the pinned Python SDK, Go SDK, Terraform providers, Ansible collections, or Zscaler MCP server. That is an audit-scoped client coverage gap, not a claim about private or future clients.
- The contract documents resource shape and routing, not tenant entitlement, authentication scopes, or data availability. Confirm those against an entitled tenant before depending on the API operationally.

## Relationship to AI Guard

Do not merge this API with AI Guard's `/v1/detection/*` runtime enforcement or its separate admin-plane contract. This surface inventories AI infrastructure and findings, including discovered MCP servers; AI Guard evaluates prompts/responses and manages guardrail policy objects. They belong to the same AI Security family but answer different operational questions.
