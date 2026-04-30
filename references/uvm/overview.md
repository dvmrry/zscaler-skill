---
product: uvm
topic: overview
title: "Unified Vulnerability Management (UVM) — consolidated vulnerability tracking and remediation"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/uvm-anysource-connector.md"
author-status: draft
---

# Unified Vulnerability Management (UVM) — consolidated vulnerability tracking and remediation

## What it is

Unified Vulnerability Management (UVM) is one of two applications in the Zscaler Security Operations (SecOps) platform (the other is AEM). UVM provides a single platform for managing vulnerabilities — ingesting vulnerability findings from many different security scanners and tools, normalizing them, enriching them with asset context, prioritizing them, and tracking remediation (Tier A — vendor/zscaler-help/uvm-anysource-connector.md).

UVM does not perform its own scanning. It is an aggregation, normalization, and prioritization layer on top of existing vulnerability management tools. The value is consolidating findings from tools like Tenable, Qualys, CrowdStrike, Wiz, Prisma Cloud, etc. into a single, enriched, correlated view.

## Platform context

UVM shares the Zscaler SecOps platform with AEM. The underlying data layer is the **Zscaler Data Fabric for Security**, which harmonizes, deduplicates, correlates, and enriches data from Zscaler telemetry and third-party tools.

UVM is closely related to AEM:
- **AEM** is asset-centric: build asset inventory, track coverage, create policies against asset posture
- **UVM** is finding-centric: ingest vulnerability findings, prioritize, track remediation

In practice, both are modules in the same SecOps portal.

## Data ingestion — connectors

UVM supports a wide range of dedicated vendor connectors plus a generic AnySource connector.

### Dedicated vendor connectors (partial list)

- Veracode
- Apiiro
- Aqua Security
- Armis
- AWS
- Azure Blob
- Azure Cloud Assets
- CrowdStrike
- CrowdStrike CSPM
- CrowdStrike Identity Protection
- Dragos
- Endor Labs
- GitHub Advanced Security
- GitHub Repositories
- HCL BigFix
- Ionix
- Mandiant ASM
- Microsoft Defender for Cloud Findings
- Microsoft Defender for Endpoint
- Microsoft Entra ID
- Microsoft Intune Assets / Audit Events
- Prisma Cloud
- Prisma Cloud CSPM
- SentinelOne
- Snyk
- Tenable
- Wiz

This list covers a wide range of scanner types: traditional vulnerability scanners, cloud security posture management (CSPM), application security testing, container security, OT/ICS security, and identity.

### AnySource connector

For sources without a dedicated connector. Supported ingestion methods:
- Upload File (direct manual upload)
- AWS S3 (pull-based)
- GCP (pull-based)
- Webhook (push-based from source system)
- Upload File API (programmatic upload)

AnySource files must include specific fields for effective data unification. Recommended fields:

**For assets:**
- Asset Name/Hostname, Asset Type, IP Addresses, OS, Owner, Location, Status, Tags, Software Installed, Asset Criticality

**For findings (vulnerabilities):**
- Vulnerability Name/ID, Severity/CVSS score, Description, Affected Asset, CVE, Threat Intel, Tags, First Seen/Last Seen timestamps, Remediation guidance, Affected Component

### ThreatLabz source

A built-in source that streams ThreatLabz threat intelligence into UVM. Enriches vulnerability findings with current threat actor activity and exploitation data.

## Key concepts

### Data unification

Incoming data is normalized, deduplicated, correlated, and enriched. An asset appearing in CrowdStrike, Tenable, and Intune is resolved into a single unified asset record with merged attributes.

### Field unification and data model

Fields from different sources are mapped to UVM's unified data model. Admins configure field mappings after creating a data source. Attribute reconciliation determines which value "wins" when sources disagree on a field value.

### Policies and violations

Admins configure security policies (e.g., "critical CVE must be remediated within 7 days"). UVM evaluates findings against policies and surfaces violations.

### Suppression rules

Admins configure rules to suppress known-acceptable findings from cluttering the UVM view.

### Custom dashboards

Widget-based dashboards with templates. Data can be visualized across the consolidated finding set.

### Report export

Reports can be scheduled or manually exported. An API exists for triggering report export ("Triggering Report Export Through an API" is documented in the help portal).

### AI capabilities

"Managing AI Capabilities in the SecOps Platform" is a documented help page, suggesting AI-driven features for prioritization or analysis. Details not fully captured in available sources.

## Outegrations (outbound integrations)

Ticketing integrations for remediation tracking:
- Jira (with webhook)
- ServiceNow (with webhook)
- Azure DevOps (with webhook)

## EASM integration

External Attack Surface Management (EASM) is natively integrated into the SecOps platform. Internet-facing asset discoveries and risk findings from EASM flow automatically into UVM.

## Admin surface

Administered via the Zscaler SecOps portal. SSO support: Entra ID, Okta, PingOne, PingFederate, SecureAuth. RBAC with system roles and custom roles.

## API surface

- AnySource Upload File API: programmatic data ingestion
- Report export API: trigger report generation/export
- No comprehensive UVM REST API reference found in available sources

## Key operational notes

- UVM is not a scanner. It aggregates from scanners. Organizations without an existing vulnerability scanner will need to add one; UVM does not replace Tenable, Qualys, etc.
- Field mapping configuration is required after adding a data source before data is usable in UVM.
- The "AnySource" connector is highly flexible — any tool that can export CSV or structured data can feed into UVM.

## What UVM is not

- Not a vulnerability scanner. Use Tenable, Qualys, Wiz, etc. for actual scanning.
- Not a patch management tool. UVM identifies and prioritizes vulnerabilities; patching is done through separate tools.
- Not a SIEM. Raw event logs should go to your SIEM; UVM handles enriched vulnerability findings.

## Cross-links

- AEM (asset exposure management, same SecOps platform, asset-centric view): [`../aem/overview.md`](../aem/overview.md)
- SOC Workbench (alert/incident triage, same SecOps platform): [`../soc-workbench/overview.md`](../soc-workbench/overview.md)
- Risk360 (financial risk quantification using vulnerability context): [`../risk360/overview.md`](../risk360/overview.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
