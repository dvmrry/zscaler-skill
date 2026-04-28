# What Is Identity Protection?

**Source:** https://help.zscaler.com/identity-protection/what-identity-protection
**Captured:** 2026-04-28 via Playwright MCP

---

Identity Protection helps organizations move from fragmented visibility to actionable identity security. It detects anomalous activities such as compromised credentials, suspicious logins, sensitive data theft, etc., and provides continuous and unified visibility into identity risks.

Identity Protection is part of the Zscaler Security Operations (SecOps) platform and works alongside Unified Vulnerability Management (UVM), Asset Exposure Management (AEM), and Security Operations Center (SOC) Workbench to deliver a cohesive security operations experience.

## Key Features and Benefits

- **Detect Risks Associated with Identities**: Detect compromised accounts, suspicious sign-ins, leaked credentials, and anomalies in authentication activities.
- **Mitigate Identity Attacks**: Detect and contain identity-based attacks before they can cause harm.
- **Strengthen Identity Posture**: Find and fix weak passwords, exposed credentials, and excessive privileges.
- **Single Identity View**: Unify identity data from disparate sources into one view. Correlates signals from sign-ins, credentials, permissions, and behavior.
- **Drive Broader SecOps Outcomes**: Prioritize threats and exposures associated with risky identities to accelerate response and reduce future risk.
- **Reports and Dashboards**: Custom dashboards and reports to view specific results as required.

## Core Capabilities

- **Identity Risk Detection**: Detect anomalies in authentication activity, suspicious sign-ins, and compromised credentials.
- **Data Ingestion via Connectors**: Uses connectors to ingest data from posture scans, change detections, alerts, and identity records. Integrates with identity providers like Okta and Microsoft Entra.
- **Data Fabric as the Backbone**: Ensures all incoming identity signals are normalized, correlated, and enriched.
- **Custom Configuration**: Manage and fine-tune identity protection through the SecOps platform.

# Understanding Identity Protection Architecture

**Source:** https://help.zscaler.com/identity-protection/understanding-identity-protection-architecture
**Captured:** 2026-04-28 via Playwright MCP

---

Identity Protection is an effective identity threat detection and response solution (ITDR) integrated with the Zscaler Security Operations (SecOps) platform.

## Key Architectural Components

- **Identities App**: Built into the SecOps platform; central point of management and analysis.
- **ITDR Connector**: Data connector serving as the source stream from the ITDR solution to the data fabric.
- **Data Fabric Cluster**: Processes raw data from various sources.
- **Zscaler Zero Trust Exchange (ZTE)**: Identity Protection leverages ZTE to mitigate risk with access policy controls that block compromised users when an identity attack is detected. Integration with ZIA and ZPA provides visibility, enrichment, and containment.

## Detection Capabilities

- **Identity Posture Scan**: Assesses AD, Entra ID, Okta — finds misconfigurations and vulnerabilities. MITRE ATT&CK mapping.
- **AD Posture Scan**: Requires ZCC on a domain-joined Windows machine. Runs LDAP queries to build a map of schema, users, computers, OUs, etc.
- **Entra ID Posture Scan**: Connects your Entra ID tenants. Uses a deployment script to set up resources (resource group, app, storage account, service principal). Diagnostic settings enabled for change detection via logs.
- **Okta Integration**: Enriches identity metadata, identifies real-time changes, and performs actions (activate user, suspend user, clear user sessions, etc.).
- **Identity Change Detection**: Real-time monitoring of critical changes in AD domains and Entra ID tenants. Includes remediation guidance (video tutorials, commands, scripts).
- **Credential Exposure Scan**: Scans endpoints for risky identity material (usernames, passwords, API keys, SSH keys, certificate files). Requires ZCC.
- **Identity Threat Detection**: Alerting on malicious activities. Detectors include: DCSync, DCShadow, Kerberoasting. Enabled as endpoint policy on designated machines with ZCC installed.

## Legacy ITDR Note

The help portal nav includes an "ITDR" entry under "Zscaler Legacy". Identity Protection in the new SecOps platform UI is the current generation. For advanced tasks, certain links may redirect to the legacy ITDR experience.
