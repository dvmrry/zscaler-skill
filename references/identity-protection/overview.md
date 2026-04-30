---
product: identity-protection
topic: overview
title: "Identity Protection (ITDR) — identity threat detection and response"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/itdr-what-identity-protection.md"
author-status: draft
---

# Identity Protection (ITDR) — identity threat detection and response

## What it is

Identity Protection is Zscaler's Identity Threat Detection and Response (ITDR) solution. It detects anomalous identity activities (compromised credentials, suspicious logins, sensitive data theft), scans identity infrastructure for misconfigurations, monitors for real-time changes in identity stores, and provides continuous unified visibility into identity risks (Tier A — vendor/zscaler-help/itdr-what-identity-protection.md).

It is part of the Zscaler Security Operations (SecOps) platform, alongside AEM, UVM, and SOC Workbench. Identity Protection uses ZTE (ZIA/ZPA) for response actions — when an identity attack is detected, it can automatically block the compromised user via ZIA/ZPA access policies.

## Two generations / naming

The help portal nav includes both "Identity Protection" (under the main SecOps platform entry) and "ITDR" (under "Zscaler Legacy"). The current generation is the SecOps platform Identity Protection experience. For advanced configuration tasks, some links redirect to the legacy ITDR UI. Both refer to the same underlying capability set; the UX is in transition.

## Core capabilities

### 1. Identity posture scan

Assesses identity infrastructure (AD, Entra ID, Okta) for misconfigurations and vulnerabilities. Results include MITRE ATT&CK mapping to identify blind spots and prioritize remediation.

**AD Posture Scan:**
- Requires ZCC installed on a domain-joined Windows machine
- Runs LDAP queries to build a map of schema, users, computers, OUs, and other objects
- Checks objects for misconfigurations and vulnerabilities in AD domains

**Entra ID Posture Scan:**
- Connects Entra ID tenants to Identity Protection
- Uses a deployment script to set up: resource group, app, storage account, service principal, etc.
- Enables diagnostic settings for change detection via logs
- Checks misconfigurations across Entra ID users, service principals, and roles

### 2. Identity change detection

Real-time monitoring of critical changes in AD domains and Entra ID tenants. Detects changes that introduce new risks or open pathways for privilege escalation and lateral movement. Provides:
- Real-time alerting
- Remediation guidance: video tutorials, commands, scripts

### 3. Credential exposure scan

Scans endpoints for risky identity material stored locally:
- Usernames and passwords
- API keys and SSH keys
- Certificate files and other credentials

Requires ZCC installed on endpoints. Credential exposure is a major post-compromise risk vector — attackers finding local credentials can escalate privileges without triggering traditional detection.

### 4. Identity threat detection

Endpoint-based detection of active identity attacks. ZCC deployed as sensor on designated machines. Detection via configurable detectors:

| Detector | Attack it detects |
|---|---|
| DCSync | Mimics Domain Controller replication to steal credentials |
| DCShadow | Rogue Domain Controller injection |
| Kerberoasting | Service account credential extraction via Kerberos |
| (others) | Additional detectors configurable via policies |

When a pattern is detected, ZCC sends signals to Identity Protection, which enriches the signal with investigation context and can trigger automated response actions via orchestration.

### 5. Okta integration

Direct integration for real-time Okta identity data enrichment and response actions:
- Enrich identity metadata
- Detect real-time changes on Okta identities
- Perform actions: activate user, suspend user, clear user sessions

## Architecture components

| Component | Role |
|---|---|
| **Identities App** | Built into SecOps platform; central management and analysis surface |
| **ITDR Connector** | Data connector streaming ITDR solution data to the data fabric |
| **Data Fabric Cluster** | Processes raw data from all sources; normalizes, correlates, enriches |
| **ZTE (ZIA/ZPA)** | Response enforcement; blocks compromised users via access policies |

## MITRE ATT&CK mapping

Identity Protection maps findings to MITRE ATT&CK techniques. This enables:
- Locating blind spots (which techniques are you not detecting?)
- Prioritizing remediation by adversary technique prevalence
- Communicating findings in a standard security language

## Data sources / connectors

Ingests from:
- Active Directory (via LDAP, via ZCC on domain-joined Windows)
- Microsoft Entra ID (via deployment script + diagnostic settings)
- Okta (direct integration)
- Endpoint signals (via ZCC installed on designated detection machines)
- Generic sources (AnySource via AWS S3)

## ZTE response integration

Identity Protection's enforcement hook is ZTE:
- Compromised user detected → ZIA policy updated to block internet access
- Compromised user detected → ZPA access denied to private apps

This is a real-time enforcement path, not just alerting. The integration requires ZIA and/or ZPA to be deployed.

## API surface

The help portal documents "Triggering Report Export Through an API" as a SecOps platform capability. An AnySource ingestion path (AWS S3, webhook, Upload File API) exists. No standalone Identity Protection REST API reference was found in available sources.

## Key operational notes

- ZCC is required for AD posture scanning, credential exposure scanning, and identity threat detection. Identity Protection without ZCC deployed is limited to IdP-based posture assessment.
- The legacy ITDR portal is still accessible for advanced tasks. Current portal does not replicate all legacy capabilities yet.
- MITRE ATT&CK mapping is built-in for all identity posture findings — no manual tagging required.

## What Identity Protection is not

- Not an IdP. It integrates with your IdP (AD, Entra ID, Okta) but does not replace it.
- Not an endpoint security product. ZCC is used as a sensor/agent, but the EDR/endpoint protection function remains with dedicated EDR tools.
- Not a SIEM. Use your SIEM for raw event retention; Identity Protection provides enriched, correlated identity risk views.

## Cross-links

- AEM (asset exposure management, same SecOps platform): [`../aem/overview.md`](../aem/overview.md)
- SOC Workbench (alert/incident response, integrates identity signals): [`../soc-workbench/overview.md`](../soc-workbench/overview.md)
- ZCC (required sensor for detection capabilities): [`../zcc/index.md`](../zcc/index.md)
- ZPA (enforcement target for identity-based access blocking): [`../zpa/index.md`](../zpa/index.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
