---
product: aem
topic: overview
title: "Asset Exposure Management (AEM) — asset inventory and attack surface tracking"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/aem-what-zscaler-security-operations.md"
author-status: draft
---

# Asset Exposure Management (AEM) — asset inventory and attack surface tracking

## What it is

Asset Exposure Management (AEM) is one of two applications in the Zscaler Security Operations (SecOps) platform (the other is UVM). AEM enables organizations to collect and manage asset data from various sources, track asset inventory, understand their attack surface, create security policies, and track and remediate policy violations to reduce overall risk (Tier A — vendor/zscaler-help/aem-what-zscaler-security-operations.md).

AEM is primarily an **asset-centric** product: it builds a unified, enriched view of your asset estate by ingesting data from many different security and IT tools, then applies machine learning and AI to normalize, deduplicate, correlate, and enrich that data into a coherent picture of organizational risk.

## Platform context — Zscaler SecOps

AEM is part of the Zscaler SecOps platform, which also includes:
- **UVM** (Unified Vulnerability Management) — vulnerability-centric view
- **Identity Protection** — identity risk detection
- **SOC Workbench** — alert/incident triage and investigation
- **EASM** (External Attack Surface Management) — internet-facing asset discovery (built into SecOps platform natively)

The SecOps platform runs on the **Zscaler Data Fabric for Security**, which harmonizes disparate data from Zscaler telemetry and third-party tools.

## Key concepts

### Data sources (connectors)

AEM ingests from external security tools via configurable connectors. Supported sources include:

- **Cloud assets**: Azure Cloud Assets, AWS (via AnySource), GCP (via AnySource)
- **EDR/Security platforms**: CrowdStrike, CrowdStrike Identity Protection, Microsoft Defender for Cloud Findings, Microsoft Defender for Endpoint
- **Identity**: Microsoft Entra ID
- **Vulnerability tools**: Snyk, Wiz, SentinelOne
- **File ingestion**: AnySource connector (upload file directly, AWS S3, GCP, webhook, Upload File API)
- **Zscaler native**: ZCC Devices, ZIA Devices and Users, ThreatLabz

### AnySource connector

A generic connector for situations where no dedicated vendor connector exists. Supports:
- Direct file upload
- AWS S3 pull
- GCP pull
- Webhook (push-based)
- Upload File API

Files are stored in original format and mapped to AEM's unified data model via configurable field mappings. This makes AEM extensible to essentially any security or IT tool that can export data.

### Data unification

The core data processing layer. Incoming data from all sources is:
1. Normalized (field types, formats standardized)
2. Deduplicated (same asset appearing in multiple sources merged into one record)
3. Enriched (additional context added from other sources)
4. Correlated (relationships between entities established)

### Asset inventory and coverage

AEM maintains a unified asset inventory. Admins can understand which assets are tracked, which sources cover each asset, and where gaps exist (assets known from one source but not others).

### Policies and policy violations

Admins create policies defining expected security state. AEM continuously evaluates assets against policies and surfaces violations. Violations drive remediation workflows.

### EASM integration

External Attack Surface Management capabilities are natively built into the SecOps platform. EASM automatically discovers internet-facing assets and their risk findings. This information is merged into AEM's asset and finding data.

### Outegrations (outbound integrations)

AEM connects to ticketing and workflow tools for remediation tracking:
- Jira (with webhook)
- ServiceNow (with webhook)
- Azure DevOps (with webhook)

### Suppression rules

Admins can configure rules to suppress false-positive or known-good findings from appearing in the AEM asset risk view.

## Admin surface

AEM is administered via the Zscaler SecOps portal. Authentication via SSO (Entra ID, Okta, PingOne, PingFederate, SecureAuth). Admin roles: system roles and custom roles; per-user role assignments and content permissions.

**Navigation path**: Configure > Sources (for data source management).

## API surface

The help portal documents "Triggering Report Export Through an API" as a capability (consistent with SOC Workbench, which shares the platform). An AnySource "Upload File API" exists for programmatic data ingestion. No comprehensive public REST API reference was found for AEM configuration/querying in available sources.

## Key operational notes

- AEM and UVM share the same SecOps platform infrastructure and admin portal — they are separate views/modules, not separate products.
- After creating a data source, field mapping configuration is required before AEM can correctly process and use the data.
- Data runs on a configurable schedule; a "Process Now" option is available for immediate ingestion.
- The SecOps platform (and therefore AEM) has its own SSO and SAML configuration — separate from ZIA/ZPA admin auth.

## What AEM is not

- Not a CMDB. AEM ingests from CMDBs (ServiceNow, etc.) but is not itself a configuration management database.
- Not a vulnerability scanner. AEM ingests vulnerability data from scanners (Tenable, Qualys, etc. via AnySource, or direct connectors). The scanning is done by external tools.
- Not an EDR. AEM ingests from EDR platforms (CrowdStrike, Defender, etc.) but does not perform endpoint detection itself.

## Cross-links

- UVM (vulnerability management, same SecOps platform): [`../uvm/overview.md`](../uvm/overview.md)
- SOC Workbench (alert/incident triage, same SecOps platform): [`../soc-workbench/overview.md`](../soc-workbench/overview.md)
- Identity Protection (identity risk, same SecOps platform): [`../identity-protection/overview.md`](../identity-protection/overview.md)
- Portfolio map: [`../_portfolio-map.md`](../_portfolio-map.md)
