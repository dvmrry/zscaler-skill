---
product: dspm
topic: overview
title: "Data Security Posture Management - data-at-rest posture and audit-scoped API surface"
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
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/dspm-what-data-security-posture-management.md"
  - "vendor/zscaler-help/dspm-marketing.md"
  - "vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md"
author-status: draft
---

# Data Security Posture Management - data-at-rest posture and audit-scoped API surface

Zscaler Data Security Posture Management (DSPM) is captured as an AI-powered solution for protecting data stored on-premises and in the cloud by continuously scanning for misconfigurations, vulnerabilities, and permissions that can contribute to attack vectors (`vendor/zscaler-help/dspm-what-data-security-posture-management.md:8`). It identifies where sensitive data resides, classifies sensitive data, detects duplicate data and misconfigurations, contextualizes exposure/posture, prioritizes risk, provides remediation guidance, and supports near-real-time alerts (`vendor/zscaler-help/dspm-what-data-security-posture-management.md:8-18`).

## Scope And Scanning Model

The help capture says DSPM works with minimal access to AWS, Azure, GCP, and on-premises resources, and uses agentless deep scanning for cloud storage, databases, virtual machines, and on-premises data centers (`vendor/zscaler-help/dspm-what-data-security-posture-management.md:20-25`). Supported onboarding scopes include AWS Organization or Standalone Account, Azure Tenant or Management Group, GCP Organization, plus on-premises databases (`vendor/zscaler-help/dspm-what-data-security-posture-management.md:34-40`).

Supported datastore categories include managed cloud data stores, managed AI services, unmanaged databases/Snowflake/Databricks, on-premises data stores, and Microsoft Information Protection labels (`vendor/zscaler-help/dspm-what-data-security-posture-management.md:64-70`). Authentication mechanisms include cloud-native roles/principals/service accounts, credential-based access for unmanaged databases, and certificate-based mTLS (`vendor/zscaler-help/dspm-what-data-security-posture-management.md:57-62`).

## Classification, AI, And Data Residency

DSPM classifies data with Zscaler DLP engines and dictionaries using full, incremental, historical, or sampling scans (`vendor/zscaler-help/dspm-what-data-security-posture-management.md:53-55`). It supports OCR for image files and images embedded in PDF or Microsoft Office documents (`vendor/zscaler-help/dspm-what-data-security-posture-management.md:72-74`). For certain regions, the capture says DSPM supports in-region scanning where data is processed in-region and only metadata is sent to the Zscaler Admin Console (`vendor/zscaler-help/dspm-what-data-security-posture-management.md:76-78`).

The marketing capture frames DSPM as data-at-rest posture management that complements in-flight DLP. It says DSPM covers public cloud, SaaS applications, on-premises, endpoints, AI/GenAI services, and hybrid environments, while in-flight DLP monitors data movement across network channels (`vendor/zscaler-help/dspm-marketing.md:46-63`).

## Source-Family Audit

| Family | Audit result |
|---|---|
| Go SDK | No product-specific DSPM service found in this audit pass. |
| Python SDK | No product-specific DSPM service found in this audit pass. |
| Terraform | No product-specific DSPM resource or data source found in this audit pass. |
| Ansible | No product-specific DSPM module found in this audit pass. |
| MCP | No product-specific DSPM tool found in this audit pass. |
| Postman | No DSPM endpoint family found in the audited Postman collection. |
| Help captures | Product behavior, supported scopes, posture labels, classification, authentication mechanisms, datastore categories, OCR, data residency, marketing positioning, and an admin-portal SSO nav reference are captured (`vendor/zscaler-help/dspm-what-data-security-posture-management.md:8-78`, `vendor/zscaler-help/dspm-marketing.md:46-63`, `vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md:224`). |

## API Surface

This refresh did not find a DSPM SDK, Terraform, Ansible, MCP, or Postman surface. The help captures establish product capabilities and admin-console framing but do not provide endpoint-level API details or a complete scanner/orchestrator deployment contract. See [clarification dspm-01](../_meta/clarifications.md#dspm-01-dspm-programmableadmin-api-and-scanner-contract).

## What DSPM Is Not

- It is not evidenced as an inline proxy; the source-backed scope is stored data posture across cloud/on-premises resources, while in-flight DLP covers data movement across network channels (`vendor/zscaler-help/dspm-marketing.md:56-63`).
- It is not evidenced as a backup product or data catalog in the captured sources.
- It is not evidenced as a broad public REST API product in the audited source families.

## Open Questions

- DSPM programmable/admin API details and scanner/orchestrator setup contract remain unresolved. See [clarification dspm-01](../_meta/clarifications.md#dspm-01-dspm-programmableadmin-api-and-scanner-contract).

## Cross-Links

- Claims ledger for this refresh: [`./_claims-ledger.md`](./_claims-ledger.md)
- ZIA DLP: [`../zia/dlp.md`](../zia/dlp.md)
- AEM: [`../aem/overview.md`](../aem/overview.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
