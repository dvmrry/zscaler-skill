# What Is Zscaler Security Operations? (AEM context)

**Source:** https://help.zscaler.com/aem/what-zscaler-security-operations
**Captured:** 2026-04-28 via Playwright MCP

---

Zscaler Security Operations (SecOps) is a unified approach to security that integrates proactive and reactive measures to enhance an organization's overall security posture. It focuses on bridging the gap between traditional exposure management and threat management, creating a cohesive strategy for identifying, prioritizing, and responding to cyber risks.

## Two Applications in the Zscaler SecOps Platform

1. **Asset Exposure Management (AEM)**: Enables organizations to collect and manage asset data from various sources to track asset inventory and coverage. Allows organizations to understand their attack surface, create policies, and track and remediate policy violations to reduce overall risk.
2. **Unified Vulnerability Management (UVM)**: Provides a single platform for managing vulnerabilities, simplifying the process of identifying and remediating security risks.

The Zscaler SecOps platform natively integrates External Attack Surface Management (EASM) capabilities to automatically discover, inventory, and monitor internet-facing assets and detect their associated risk findings.

## How SecOps Works

Zscaler SecOps operates on a robust data fabric for security that centralizes and transforms disparate security data. Supported by machine learning and AI, the fabric harmonizes, deduplicates, correlates, and enriches information from various sources, including Zscaler telemetry and third-party tools.

# Creating Data Sources in AEM

**Source:** https://help.zscaler.com/aem/creating-data-sources
**Captured:** 2026-04-28 via Playwright MCP

---

The Zscaler Security Operations (SecOps) platform collects and correlates security findings and business context from a wide range of external tools, such as vulnerability scanners, asset inventories, and cloud providers.

## Data Source Setup Sections

When creating a source, you configure:
- Details
- Retrieval
- Scheduling
- Remediation Detection Settings
- Suppression Rules

## AnySource Connector

A generic AnySource connector allows upload or extraction of files from data storage platforms such as Google Cloud Platform (GCP) and AWS S3.

## Connectors Available in AEM / SOC Workbench

- Azure Blob
- Azure Cloud Assets
- CrowdStrike
- CrowdStrike Identity Protection
- Microsoft Defender for Cloud Findings
- Microsoft Defender for Endpoint
- Microsoft Entra ID
- SentinelOne
- Snyk
- Wiz
- Zscaler Client Connector Devices
- ZIA Devices and Users
- AnySource (generic)

## Outegrations Available

- Jira (with webhook)
- ServiceNow (with webhook)
- Azure DevOps (with webhook)
