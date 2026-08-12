---
product: ai-security
topic: "ai-security-asset-management-api"
title: "AI Security Public API — assets, MCP servers, and issues"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
  - "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md"
  - "vendor/zscaler-api-specs/automate-zscaler/rosetta.md"
author-status: draft
---

# AI Security Public API — assets, MCP servers, and issues

The current Automate capture contains a distinct **AI Security Public API** asset/findings surface, separate from AI Guard's runtime and retained admin APIs. Its 11 read-only operations use the production base URL `https://api.zsapi.net/aisecurity/aispm`; they now share the `ai-security` publication and combined OpenAPI with 97 AI Red Teaming operations on the separate `/aisecurity/airt` service (`vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json:42816-42826`; combined operation count at `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:7-20`).

## Operation families

| Family | Operations | What the contract exposes |
|---|---:|---|
| Data stores | 2 | List and get data stores such as S3 buckets, blob storage, and databases; includes cloud account, environment, scan time, risk, sanction status, and source metadata (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:20833-21273`). |
| Identities | 2 | List and get identities discovered across AI assets. The get-operation prose still recommends an `id` query for slash-bearing IDs, but the list operation's current query schema no longer contains `id`; treat that instruction as unresolved publication drift (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:21274-21400`, `:21428-21483`; delta at `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:181-182`). |
| Issues | 2 | List and get security findings across asset types, filterable by environment, severity, source type, and status (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:22921-23511`). |
| MCP servers | 3 | List/get discovered MCP servers and list the tools exposed by one server. Records include source association, region, risk indicators/score/level, sanction status, and server type (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:21665-22479`). |
| Workloads | 2 | List and get compute/container workloads associated with AI assets, including scan time, risk, sanction status, and source metadata (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:22480-22920`). |

All list operations are cursor-paginated. The documented default page size is 25 and maximum is 200. Preserve filters, sort, and page size while following a cursor; the contract warns that changing them can skip or duplicate records. A malformed cursor restarts at the first page, so clients should detect replay/duplication rather than assuming an invalid cursor fails closed (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:21037-21065`). Continue until `next_cursor` is empty; do not drive pagination from `total_count`, which is approximate and may be zero after the first page (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:21218-21248`, `:23455-23483`).

## Current publication drift

The refresh renamed all 11 asset-operation route keys while preserving their HTTP methods and paths. Seven operations also have schema metadata drift: the identity-list `id` query disappeared; data-store and workload sanction-status metadata changed; and the MCP-server list/get contracts changed sanction/type metadata while removing the response `path` field (`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:40-58`; field-level evidence at `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:177-193`). Route-key movement is documentation organization, not an endpoint-path change. Schema deltas are published-contract changes and do not by themselves prove backend field removal.

## Important boundaries

- This is an **inventory and findings** surface. The captured 11 operations are all `GET`; they do not create, update, sanction, suppress, or remediate assets or issues.
- The current issue-status filter and response schema both use `open`, `ignored`, `snoozed`, `resolved`, or `closed`; the previously captured `open,suppressed` prose inconsistency is no longer present (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:23244-23255`, `:23443-23450`).
- A source-tree search at this review point did not find a dedicated wrapper for these `/aisecurity/aispm` operations in the pinned Python SDK, Go SDK, Terraform providers, Ansible collections, or Zscaler MCP server. That is an audit-scoped client coverage gap, not a claim about private or future clients.
- The contract documents resource shape and routing, not tenant entitlement, authentication scopes, or data availability. Confirm those against an entitled tenant before depending on the API operationally.

## Relationship to AI Guard

Do not merge this API with AI Guard's `/v1/detection/*` runtime enforcement or its separate admin-plane contract. This surface inventories AI infrastructure and findings, including discovered MCP servers; AI Guard evaluates prompts/responses and manages guardrail policy objects. They belong to the same AI Security family but answer different operational questions.
