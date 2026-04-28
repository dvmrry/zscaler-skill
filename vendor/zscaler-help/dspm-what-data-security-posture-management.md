# What is Data Security Posture Management?

**Source:** https://help.zscaler.com/dspm/what-data-security-posture-management
**Captured:** 2026-04-28 via Playwright MCP

---

Zscaler Data Security Posture Management (DSPM) is an AI-powered solution to protect your organization's data stored on-premises and in the cloud against data theft, misuse, or loss by continuously scanning the data for numerous potential misconfigurations, vulnerabilities, and permissions that might contribute to attack vectors. DSPM provides detailed insights into where this sensitive data resides in your cloud environment, identifies and classifies sensitive data, detects duplicate data and misconfigurations in data stores containing sensitive data, and contextualizes data exposure and security posture.

DSPM aggregates security data and prioritizes risk based on severity, coupled with step-by-step remediation guidance and configurable, near-real-time alerts and notifications.

## Key Features and Benefits

- **Monitor data**: Continuous data monitoring for any potential risks or vulnerabilities.
- **Secure sensitive data**: Discover sensitive data and its access level in your cloud environments, perform AI-powered data classification based on severity, threat category, and identify areas of exposure.
- **Policy and compliance**: Implement security policies to comply with stringent security and privacy regulations (e.g., GDPR, NIST).
- **Incident response**: Expedite identification, investigation, containment, and recovery in the event of a security incident.
- **Data duplication**: Detect duplicate files at multiple locations to manage redundant data, reduce attack surface.

## How DSPM Works

- **Scan and monitor cloud and on-premises resources**: Works with minimal access to resources in cloud environments (AWS, Azure, and GCP), on-premises data centers.
- **Agentless deep scanning**: Uses an agentless approach to continuously scan resources (cloud storage, databases, virtual machines, on-premises data centers).
- **Detect data misconfigurations**: Scans for data exposure, publicly exposed sensitive data, over-privileged access, sensitive data exposed to unmanaged services.
- **Apply security policies**: Identifies security policy violations. Complete mapping of security policies within various compliance frameworks.

# Supported Data Stores, File Types, and Regions

**Source:** https://help.zscaler.com/dspm/supported-data-stores-file-types-and-regions
**Captured:** 2026-04-28 via Playwright MCP

---

## Supported Cloud Providers

- **AWS**: Organization or Standalone Account onboarding
- **Azure**: Tenant or Management Group onboarding
- **GCP**: Organization onboarding

DSPM also supports on-premises databases.

## Posture Labels

- Public Exposure
- Encryption (customer-managed key or platform-managed key)
- Logging (access logs and audit trails)
- Backup Recovery
- Access Control (IAM policies and ACL configurations)
- Guardrails (AI service guardrails)
- Has AI/ML Package
- Has AI/ML Model

## Data Classification

Data is classified with Zscaler's DLP engines and dictionaries. Classification is performed via full, incremental, historical, or sampling scans.

## Authentication Mechanisms

- **Cloud Native**: Cross-account IAM roles (AWS), service principals or managed identities (Azure), service accounts (GCP)
- **Bring Your Own Identity**:
  - Credential-Based: Username/password or access keys stored in vault (mostly for unmanaged databases)
  - Certificate-Based: Mutual TLS (mTLS)

## Supported Data Stores Categories

- Managed Data Stores (cloud storage services, databases)
- Managed AI Services
- Unmanaged Databases, Snowflake, and Databricks
- On-Premises Data Stores
- Microsoft Information Protection (MIP) Labels

## OCR Support

DSPM uses Optical Character Recognition (OCR) to identify sensitive data in image files and in images embedded within PDF or Microsoft Office documents.

## Data Residency

For certain regions (GDPR etc.), DSPM supports in-region scanning. Data is processed within the region; only metadata is sent to the Zscaler Admin Console.
