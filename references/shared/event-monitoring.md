---
product: shared
topic: "event-monitoring-api"
title: "OneAPI Event Monitoring subscriptions and notification channels"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-api-specs/automate-zscaler/event-monitoring-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
author-status: draft
---

# OneAPI Event Monitoring subscriptions and notification channels

Event Monitoring is a shared OneAPI surface for discovering event catalogs and delivering selected events to notification channels. The current Automate contract contains 15 operations: five catalog reads, five subscription CRUD/list operations, four channel-discovery reads, and one SNS verification action (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:13`; channel operations at `vendor/zscaler-api-specs/automate-zscaler/event-monitoring-api-reference.json:995-1209`, `:1780-1984`, `:2431-2543`).

## Newly surfaced channel operations

| Method | Path | Contract purpose |
|---|---|---|
| `GET` | `/subscriptions/channels` | List available notification channel types and their required fields/setup state. |
| `GET` | `/subscriptions/channels/email` | Retrieve email-channel requirements. |
| `GET` | `/subscriptions/channels/webhook` | Retrieve webhook-channel requirements. |
| `GET` | `/subscriptions/channels/sns` | Retrieve the Zscaler role ARN, required IAM permissions, and SNS topic-policy template. |
| `POST` | `/subscriptions/channels/sns/verify` | Verify access to a customer SNS topic. |

The generic channel list returns `channels[]` records with `type`, `description`, `required_fields`, and `setup_required` (`vendor/zscaler-api-specs/automate-zscaler/event-monitoring-api-reference.json:1877-1972`). The SNS detail response additionally returns `zscaler_role_arn`, `required_permissions`, and `sns_topic_policy_template` (`vendor/zscaler-api-specs/automate-zscaler/event-monitoring-api-reference.json:1092-1198`).

SNS verification accepts required `topic_arn` plus optional `region`; when region is omitted the contract says it is inferred from the ARN. Its response includes required `verified` and `topic_arn`, with optional `message_sent` or `error` (`vendor/zscaler-api-specs/automate-zscaler/event-monitoring-api-reference.json:2431-2529`). The operation summary calls this a read-only check even though the HTTP method is `POST` (`vendor/zscaler-api-specs/automate-zscaler/event-monitoring-api-reference.json:2431-2443`).

## Coverage boundary

This page documents the captured Automate contract. This pass did not establish SDK, Terraform, Ansible, MCP, Automation Hub, or tenant-runtime parity for Event Monitoring. Do not infer that every notification channel is enabled for every tenant, or that a successful static schema capture proves AWS permissions or live delivery.

## Cross-links

- OneAPI gateway and authentication: [`./oneapi.md`](./oneapi.md)
- Shared reference index: [`./index.md`](./index.md)
- Automate Rosetta Stone: [`../../vendor/zscaler-api-specs/automate-zscaler/rosetta.md`](../../vendor/zscaler-api-specs/automate-zscaler/rosetta.md)
