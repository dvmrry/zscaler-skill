---
product: dspm
topic: "dspm-claims-ledger"
title: "DSPM claims ledger - Tier 3 thin-stub refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: e68b53e17f61870f3bec2a68bff3e3d4f1c6db05
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 70e67db347441caa31f94da8f904389064db0664
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/dspm-what-data-security-posture-management.md"
  - "vendor/zscaler-help/dspm-marketing.md"
  - "vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md"
author-status: draft
---

# DSPM claims ledger

This ledger covers the Tier 3 thin-stub refresh for Data Security Posture Management. Rows either cite exact source lines, identify an open question, or mark an audit-scoped absence from the checked source families.

| Claim | Reference surface | Source line(s) |
|---|---|---|
| DSPM is an AI-powered solution for stored cloud/on-premises data, continuously scanning for misconfigurations, vulnerabilities, and permissions issues. | `overview.md` | `vendor/zscaler-help/dspm-what-data-security-posture-management.md:8` |
| DSPM identifies sensitive data location, classifies data, detects duplicates/misconfigurations, contextualizes posture, prioritizes risk, provides remediation guidance, and supports near-real-time alerts. | `overview.md` | `vendor/zscaler-help/dspm-what-data-security-posture-management.md:8-18` |
| DSPM works with minimal access to AWS, Azure, GCP, and on-premises resources and uses agentless deep scanning. | `overview.md` | `vendor/zscaler-help/dspm-what-data-security-posture-management.md:20-25` |
| Supported onboarding scopes include AWS Organization/Standalone Account, Azure Tenant/Management Group, GCP Organization, and on-premises databases. | `overview.md` | `vendor/zscaler-help/dspm-what-data-security-posture-management.md:34-40` |
| Supported datastore categories include managed cloud data stores, managed AI services, unmanaged databases/Snowflake/Databricks, on-premises data stores, and MIP labels. | `overview.md` | `vendor/zscaler-help/dspm-what-data-security-posture-management.md:64-70` |
| Authentication mechanisms include cloud-native roles/principals/service accounts, credential-based access, and certificate-based mTLS. | `overview.md` | `vendor/zscaler-help/dspm-what-data-security-posture-management.md:57-62` |
| DSPM classifies data with Zscaler DLP engines/dictionaries using full, incremental, historical, or sampling scans. | `overview.md` | `vendor/zscaler-help/dspm-what-data-security-posture-management.md:53-55` |
| DSPM supports OCR for image files and images embedded in PDF or Microsoft Office documents. | `overview.md` | `vendor/zscaler-help/dspm-what-data-security-posture-management.md:72-74` |
| DSPM supports in-region scanning for certain regions, with metadata sent to the Zscaler Admin Console. | `overview.md` | `vendor/zscaler-help/dspm-what-data-security-posture-management.md:76-78` |
| Marketing frames DSPM as data-at-rest posture that complements in-flight DLP across cloud, SaaS, on-premises, endpoints, AI/GenAI, and hybrid environments. | `overview.md` | `vendor/zscaler-help/dspm-marketing.md:46-63` |
| A ZIA DLP content-inspection help capture contains an admin-portal SSO navigation reference for DSPM. | `overview.md` | `vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md:224` |
| Go SDK has no product-specific DSPM service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no DSPM service found in `vendor/zscaler-sdk-go` during the 2026-06-16 surface sweep. |
| Python SDK has no product-specific DSPM service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no DSPM service found in `vendor/zscaler-sdk-python` during the 2026-06-16 surface sweep. |
| Terraform has no product-specific DSPM resource or data source in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no DSPM resource/data-source surface found in `vendor/terraform-provider-zia` or `vendor/terraform-provider-zpa` during the 2026-06-16 surface sweep. |
| Ansible has no product-specific DSPM module in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no DSPM module found in `vendor/ziacloud-ansible` or `vendor/zpacloud-ansible` during the 2026-06-16 surface sweep. |
| MCP has no product-specific DSPM tool in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no DSPM tool found in `vendor/zscaler-mcp-server` during the 2026-07-16 MCP re-check. |
| Postman has no DSPM endpoint family in the audited collection. | `overview.md` | AUDIT-SCOPED ABSENCE: no DSPM endpoint family found in `vendor/zscaler-api-specs/oneapi-postman-collection.json` during the 2026-06-16 surface sweep. |
| DSPM programmable/admin API details and scanner/orchestrator setup contract remain unresolved. | `overview.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#dspm-01-dspm-programmableadmin-api-and-scanner-contract` |
