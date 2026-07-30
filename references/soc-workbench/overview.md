---
product: soc-workbench
topic: overview
title: "SOC Workbench - threat prioritization and incident-response workspace"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: e68b53e17f61870f3bec2a68bff3e3d4f1c6db05
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/soc-what-zscaler-soc-workbench.md"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
author-status: draft
---

# SOC Workbench - threat prioritization and incident-response workspace

SOC Workbench is a SecOps product for consolidating alerts from Zscaler and third-party tools into prioritized, context-rich incidents (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:8-10`). The captured help emphasizes risk-based prioritization, automated correlation, context enrichment, actionable incidents, and proactive attack prediction (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:12-18`).

## Platform Placement

The help capture says SOC Workbench is powered by the Zscaler Data Fabric for Security and transforms isolated alerts into a prioritized, holistic view of threats (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:27`). It also places SOC Workbench in the broader SecOps portfolio, connecting exposure insights with threat prioritization so vulnerable assets and risky identities can factor into results (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:29`).

## Core Concepts

The source-backed operating model is thin but useful:

- SOC Workbench unifies alerts from Zscaler and third-party sources in a single console (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:33`).
- Its AI-driven threat analysis turns raw alerts into contextualized threats and highlights the first items to address (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:34`).
- It supports investigation workflows with threat details, log search, asset-impact context, and response support on a single screen (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:35`).
- Core day-to-day capabilities include ingestion, alert enrichment, alert correlation, prioritization, investigation, and resolution (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:37-44`).

## Connectors And Outegrations

The captured connector list includes CrowdStrike, CrowdStrike Identity Protection, Microsoft Defender for Cloud, Microsoft Defender for Endpoint, Microsoft Entra ID, SentinelOne, Snyk, Wiz, Azure Blob, Azure Cloud Assets, ZCC Devices, ZIA Devices and Users, and AnySource file ingestion through AWS S3, GCP, webhook, or upload-file API (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:46-48`).

The source uses "Outegrations" for outbound integrations and names Jira and ServiceNow with webhook support (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:50-52`). Keep that spelling when matching UI or help text.

## Source-Family Audit

| Family | Audit result |
|---|---|
| Go SDK | No product-specific SOC Workbench service found in this audit pass. |
| Python SDK | No product-specific SOC Workbench service found in this audit pass. |
| Terraform | No product-specific SOC Workbench resource or data source found in this audit pass. |
| Ansible | No product-specific SOC Workbench module found in this audit pass. |
| MCP | No product-specific SOC Workbench tool found in this audit pass. Z-Insights cyber-incident analytics are adjacent aggregate reporting, not SOC Workbench incident ingestion/triage or report-export coverage (`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:435-456`). |
| Postman | No SOC Workbench endpoint family found in the audited Postman collection. |
| Help captures | Product overview, connector list, outegration list, core concepts, and report-export capability are captured (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:10`, `:27-35`, `:46-62`). |

## API Surface

Do not claim a full SOC Workbench API from the current captures. The help capture says "Report Export via API" is a documented capability (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:62`), but this refresh did not find the endpoint path, schema, or SDK/provider implementation. Treat report export as source-backed at the capability level only.

## What SOC Workbench Is Not

- It is not evidenced here as a raw log store or SIEM replacement; the captured claim is about prioritizing and triaging threats, not retaining every raw event (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:10`, `:31-35`).
- It is not purely Zscaler-native; the captured connector list includes several third-party security products and generic AnySource ingestion (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:46-48`).
- It is not currently evidenced as programmable through the audited SDK, Terraform, Ansible, MCP, or Postman sources. The only API claim in the capture is report export.

## Open Questions

- The report-export API endpoint, schema, authentication scope, and response shape are not captured. See [clarification soc-workbench-01](../_meta/clarifications.md#soc-workbench-01-soc-workbench-report-export-api-details).

## Cross-Links

- Claims ledger for this refresh: [`./_claims-ledger.md`](./_claims-ledger.md)
- AEM, another SecOps portfolio product: [`../aem/overview.md`](../aem/overview.md)
- UVM, another SecOps portfolio product: [`../uvm/overview.md`](../uvm/overview.md)
- Identity Protection, another SecOps portfolio product: [`../identity-protection/overview.md`](../identity-protection/overview.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
