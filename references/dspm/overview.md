---
product: dspm
topic: overview
title: "Data Security Posture Management (DSPM) — cloud data risk and classification"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/dspm-what-data-security-posture-management.md"
author-status: draft
---

# Data Security Posture Management (DSPM) — cloud data risk and classification

## What it is

Zscaler DSPM is an AI-powered solution that continuously scans cloud and on-premises data stores for sensitive data, misconfigurations, vulnerabilities, and permissions issues. It identifies where sensitive data lives, classifies it, detects duplicate data, and contextualizes data exposure and security posture — providing enriched dashboards, risk-prioritized findings, and step-by-step remediation guidance (Tier A — vendor/zscaler-help/dspm-what-data-security-posture-management.md).

DSPM is data-at-rest focused. It complements ZIA (which handles data-in-motion via DLP) and ZPA (which controls access to private data stores). DSPM specifically addresses the question: "What sensitive data do we have, where is it, who can access it, and is it properly protected?"

## Supported cloud environments

| Cloud | Onboarding model |
|---|---|
| AWS | Organization or Standalone Account |
| Azure | Tenant or Management Group |
| GCP | Organization |
| On-premises | Data centers (databases) |

## Supported data store categories

- Managed cloud data stores (cloud storage services, managed databases)
- Managed AI services
- Unmanaged databases, Snowflake, and Databricks
- On-premises databases
- Microsoft Information Protection (MIP) labeled data

## How scanning works

DSPM uses an **agentless** approach:
- No agent installation required on scanned resources
- Minimal access required (cloud-native IAM roles)
- Scanning is continuous and automated

### Authentication mechanisms

| Method | When used |
|---|---|
| Cross-account IAM roles (AWS) | Managed cloud resources |
| Service principals / managed identities (Azure) | Managed cloud resources |
| Service accounts (GCP) | Managed cloud resources |
| Credential-Based (username/password or access keys in vault) | Unmanaged databases |
| Certificate-Based (mTLS) | Unmanaged databases requiring cert auth |

### Scan types

- Full scan
- Incremental scan
- Historical scan
- Sampling scan

### OCR support

DSPM uses Optical Character Recognition to identify sensitive data in image files and in images embedded within PDF or Microsoft Office documents.

## Data classification

Classification is performed using Zscaler's DLP engines and dictionaries — the same underlying classification technology used by ZIA DLP. This consistency means findings map to the same data categories an organization may already use in ZIA DLP policy.

### AI/ML model detection

DSPM has dedicated posture labels for AI/ML:
- "Has AI/ML Package" — checks if AI or ML packages are installed on a compute instance
- "Has AI/ML Model" — checks if AI or ML models are present on a compute instance
- "Guardrails" — indicates that guardrails are enabled for an AI service

This makes DSPM relevant for organizations deploying ML workloads in cloud environments.

## Posture labels (security checks)

| Label | What it checks |
|---|---|
| Public Exposure | Resource accessible from the public internet |
| Encryption | Customer-managed key vs. platform-managed key |
| Logging | Access logs and audit trails enabled |
| Backup Recovery | Backup and retention policy configuration |
| Access Control | IAM policies and ACL configuration |
| Guardrails | AI service guardrails enabled |
| Has AI/ML Package | Compute instance has AI/ML packages |
| Has AI/ML Model | Compute instance has AI/ML models |

## Key capabilities

- **Continuous monitoring**: Not a one-time scan; DSPM runs continuously to detect drift
- **Risk prioritization**: Aggregates security data and prioritizes by severity
- **Duplicate data detection**: Identifies the same sensitive data at multiple locations (redundancy risk and attack surface)
- **Compliance mapping**: Security policies mapped to compliance frameworks (GDPR, NIST, and others)
- **Remediation guidance**: Step-by-step remediation per finding
- **Near-real-time alerts**: Configurable notifications for new findings
- **Dashboards, graphs, reports**: Interactive visualization for security teams and compliance reporting

## Data residency

For regions with data residency requirements (e.g., GDPR), DSPM supports **in-region scanning**: data is processed within the region; only metadata is sent to the Zscaler Admin Console. Raw sensitive data is not exfiltrated to Zscaler infrastructure.

## API surface

No explicit DSPM REST API reference was found in available help portal sources. The product is administered via the Zscaler Admin Console (same as ZIA/ZPA). Treat as primarily portal-managed. A step-by-step configuration guide exists in the help portal.

## Relationship to ZIA DLP

DSPM and ZIA DLP are complementary, not overlapping:
- **ZIA DLP**: Inspects data in motion — traffic passing through Zscaler proxies. Prevents data exfiltration via web, email, cloud apps in real time.
- **DSPM**: Inspects data at rest — data stored in cloud/on-premises data stores. Identifies misconfigurations and exposures that could lead to breach.

Both use the same Zscaler DLP classification engines/dictionaries, so findings are expressed in the same data category language.

## Key operational notes

- DSPM deployment requires cloud account onboarding (AWS/Azure/GCP) — admins must configure IAM roles/service principals to grant DSPM scanning access.
- An "Orchestrator" is deployed in the customer's cloud environment (AWS, Azure, GCP) to coordinate scanning within the cloud account. Scanner instances run within the customer's cloud, ensuring data does not leave the customer's environment (only metadata returns to Zscaler).
- The onboarding process involves deploying CloudFormation templates (AWS) or equivalent in Azure/GCP.

## What DSPM is not

- Not a data lake or data catalog. DSPM discovers and classifies data; it does not store it.
- Not an inline proxy. Unlike ZIA, DSPM does not intercept live traffic.
- Not a backup solution. Backup Recovery posture checks verify that backups exist; DSPM does not create them.

## Cross-links

- ZIA DLP (data-in-motion control; uses same DLP engines): [`../zia/dlp.md`](../zia/dlp.md)
- AEM (asset exposure, SecOps platform): [`../aem/overview.md`](../aem/overview.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
