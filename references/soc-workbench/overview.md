---
product: soc-workbench
topic: overview
title: "SOC Workbench — unified threat detection and incident response platform"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/soc-what-zscaler-soc-workbench.md"
author-status: draft
---

# SOC Workbench — unified threat detection and incident response platform

## What it is

SOC Workbench is a Zscaler Security Operations (SecOps) product that consolidates alerts from across a security stack — Zscaler and third-party — into a prioritized, context-enriched view of threats. It addresses alert fatigue by correlating multiple signals into actionable incidents, enriching them with business context (user roles, asset criticality, geographic data, vulnerability context), and providing an investigation workflow in a single console (Tier A — vendor/zscaler-help/soc-what-zscaler-soc-workbench.md).

Unlike SIEM tools that accumulate and store raw events, SOC Workbench focuses on **AI-driven threat prioritization** — transforming isolated alerts into contextualized incidents ranked by business impact.

## Platform placement

SOC Workbench is part of the Zscaler Security Operations (SecOps) platform, sharing infrastructure with AEM (Asset Exposure Management), UVM (Unified Vulnerability Management), and Identity Protection. The underlying data layer is the **Zscaler Data Fabric for Security**, which harmonizes, deduplicates, correlates, and enriches incoming security data.

## Core value propositions

1. **Unify all alerts**: Zscaler alerts plus third-party tool alerts in one console, with rich context. Eliminates the multi-system inefficiency of receiving alerts from many tools.
2. **Focus on threats, not alerts**: AI-driven analysis transforms raw alerts into contextualized, actionable threats. Surfaces the top 5 things to address first using historical attack patterns and business context.
3. **Stop the biggest threats**: Accelerates investigation by providing all threat details on a single page. Enables faster, proportional responses.

## Key concepts

### Alerts and Incidents

SOC Workbench draws a distinction between alerts (individual signals from data sources) and incidents (correlated sets of alerts representing a broader threat). Alerts are enriched; incidents are the primary operational unit for analyst workflow.

### Alert scoring

Configurable scoring system that ranks alerts by risk. Admins configure alert score rules via the admin portal.

### Incident rules

Rules that correlate multiple alerts into higher-level incidents. Configurable via Administration in the portal.

### Data sources (inbound connectors)

SOC Workbench ingests from:
- Zscaler telemetry: ZCC Devices, ZIA Devices and Users, ThreatLabz
- Third-party: CrowdStrike, CrowdStrike Identity Protection, Microsoft Defender for Cloud Findings, Microsoft Defender for Endpoint, Microsoft Entra ID, SentinelOne, Snyk, Wiz, Azure Blob, Azure Cloud Assets
- Generic: AnySource connector (file upload: AWS S3, GCP, webhook, Upload File API)

### Outegrations (Zscaler's term for outbound integrations)

SOC Workbench uses the term "outegration" (not "integration") for outbound connections:
- Jira (with webhook support)
- ServiceNow (with webhook support)

### Data unification

Entity resolution and field normalization across disparate sources. Key concepts:
- **Entity Unification**: Merges duplicate or related entities from different sources
- **Field Unification**: Normalizes field names/types across sources
- **Attribute Reconciliation**: Configurable default functions for how conflicting values are resolved
- **Historical Data**: Configurable retention and lookback for trend analysis

### Custom dashboards

Widget-based dashboards with templates. Dashboard templates available for common SOC use cases.

### Report export

Reports can be exported manually or scheduled. There is an API for triggering report export: the "Triggering Report Export Through an API" page is documented in the help portal (Tier A — vendor/zscaler-help/soc-what-zscaler-soc-workbench.md).

### Entity Explorer and Queries Library

Log search capability: analysts can build queries and search logs from a unified location. The Queries Library provides saved/shared queries.

### Saved Views and Formatting Rules

Analysts can configure personal saved views (filter presets) and formatting rules (conditional display logic in tables/lists).

## Connectivity and infrastructure

- **SSO support**: Microsoft Entra ID, Okta, PingOne, PingFederate, SecureAuth
- **SecOps Platform Gateway**: A gateway component that connects on-premises environments or data sources to the SecOps cloud platform
- **Public IP addresses**: Zscaler publishes SecOps public IP ranges (for firewall allow-listing)

## API surface

The "Triggering Report Export Through an API" page is explicitly documented, confirming at least one API endpoint. Additional API surface for data ingestion may exist via the AnySource webhook and Upload File API options. No comprehensive public API reference was found for SOC Workbench specifically in available sources.

## RBAC

Role-based access control with system roles and custom roles. User roles, content permissions assignable per user. Managed within the SecOps platform.

## Key operational notes

- SOC Workbench uses the **Zscaler Data Fabric for Security** as its data backbone — same infrastructure shared with AEM and UVM.
- Integration with ZTE provides automatic inline controls (ZIA/ZPA) to mitigate risk as threats are identified.
- The term "outegration" (not "integration") is Zscaler's intentional branding for outbound workflow connections. This term will appear in admin UI and docs — not a typo.

## What SOC Workbench is not

- Not a raw log store or SIEM replacement. Use NSS/LSS/your SIEM for raw event retention.
- Not a vulnerability scanner. Use UVM or AEM for that.
- Not purely Zscaler-native — designed explicitly to ingest third-party security tool data.

## Cross-links

- AEM (asset inventory, part of same SecOps platform): [`../aem/overview.md`](../aem/overview.md)
- UVM (vulnerability management, shares SecOps platform): [`../uvm/overview.md`](../uvm/overview.md)
- Identity Protection (identity threat detection, shares SecOps platform): [`../identity-protection/overview.md`](../identity-protection/overview.md)
- Breach Predictor (predictive threat intelligence): [`../breach-predictor/overview.md`](../breach-predictor/overview.md)
- Portfolio map: [`../_portfolio-map.md`](../_portfolio-map.md)
