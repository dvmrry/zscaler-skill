---
product: breach-predictor
topic: overview
title: "Breach Predictor - predictive threat context and audit-scoped API surface"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: 0d789caf9b79966cd1973cc227d6d2862e46e05d
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/bp-what-zscaler-breach-predictor.md"
author-status: draft
---

# Breach Predictor - predictive threat context and audit-scoped API surface

Breach Predictor is positioned as a proactive SecOps product that anticipates threats, provides context, and helps prevent threat actors from accessing sensitive data (`vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:8`). The captured benefits are Enhanced Attack Visibility, Proactive Breach Risk Reduction, and Improved Security Posture (`vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:10-16`).

## Operating Model

The captured help says Breach Predictor shifts from reactive alerts to predictability of attacks and is designed to supplement, not replace, reactive security tools (`vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:25`). It uses predictive intelligence to identify policy problems before threats move to the next stage, and it provides context about the policies that enabled observed activity (`vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:27-29`).

The documented high-level workflow is intentionally broad: track substantial data from multiple sources, use generative AI to analyze it, then draw conclusions that provide visibility and guidance (`vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:31-37`). Do not expand that into a specific connector list from this source alone.

## UI Concepts

The help capture names several product concepts: Overall Breach Probability score, Sankey charts, MITRE ATT&CK findings tables, AI Assist Dashboard, Dashboard, Findings, Events, Threat Landscape, Tickets, Profiles, and Alerts & Remediation (`vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:39-48`).

## Source-Family Audit

| Family | Audit result |
|---|---|
| Go SDK | No product-specific Breach Predictor service found in this audit pass. |
| Python SDK | No product-specific Breach Predictor service found in this audit pass. |
| Terraform | No product-specific Breach Predictor resource or data source found in this audit pass. |
| Ansible | No product-specific Breach Predictor module found in this audit pass. |
| MCP | No product-specific Breach Predictor tool found in this audit pass. |
| Postman | No Breach Predictor endpoint family found in the audited Postman collection. |
| Help captures | Product overview, operating model, workflow, and UI concepts are captured (`vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:8-48`). |

## API Surface

Do not claim a Breach Predictor public API from the current captures. The help source establishes product behavior and UI concepts, but this refresh did not find SDK, Terraform, Ansible, MCP, or Postman surface. The specific data sources, integration details, and endpoint-level API surface remain unresolved. See [clarification breach-predictor-01](../_meta/clarifications.md#breach-predictor-01-breach-predictor-api-integration-and-data-source-details).

## What Breach Predictor Is Not

- It is not evidenced as a SIEM replacement; the help explicitly says it supplements reactive security tools (`vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:25`).
- It is not evidenced as a vulnerability scanner or policy-enforcement engine in this capture.
- It is not safe to enumerate exact ingestion sources from the current help capture; the source only says "multiple sources" (`vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:31`).

## Open Questions

- Breach Predictor data-source enumeration, API/integration surface, and endpoint/schema details remain unresolved. See [clarification breach-predictor-01](../_meta/clarifications.md#breach-predictor-01-breach-predictor-api-integration-and-data-source-details).

## Cross-Links

- Claims ledger for this refresh: [`./_claims-ledger.md`](./_claims-ledger.md)
- SOC Workbench: [`../soc-workbench/overview.md`](../soc-workbench/overview.md)
- Risk360: [`../risk360/overview.md`](../risk360/overview.md)
- UVM: [`../uvm/overview.md`](../uvm/overview.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
