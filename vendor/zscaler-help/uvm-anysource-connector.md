# Connecting AnySource (UVM)

**Source:** https://help.zscaler.com/uvm/connecting-anysource
**Captured:** 2026-04-28 via Playwright MCP

---

When creating a data source to ingest data into the platform, you can either use a dedicated vendor connector, or you can use the AnySource connector. The AnySource connector allows you to upload files directly to the platform.

## AnySource File Upload Methods

- Upload File (direct)
- AWS S3
- GCP
- Webhook
- Upload File API

## Vendor Connectors Available in UVM

(partial list from related articles)
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
- Microsoft Intune Assets
- Microsoft Intune Audit Events
- Prisma Cloud
- Prisma Cloud CSPM
- Tenable (partial)

## Recommended Fields for AnySource

**Assets:**
- Asset Name/Hostname
- Asset Type
- External or Internal IP Address
- Operating System
- Asset Owner
- Location
- Asset Status
- Asset Tags
- Software Installed
- Asset Criticality

**Findings (Vulnerabilities):**
- Vulnerability Name/ID
- Severity Score/CVSS/Scanner Score
- Description
- Affected Asset
- CVE
- Threat Intel Information
- Tags
- Timestamps (First Seen / Last Seen)
- Recommendations/Fix
- Affected Component

## What Is Zscaler Security Operations? (UVM context)

**Source:** https://help.zscaler.com/uvm/what-zscaler-security-operations
**Captured:** 2026-04-28 via Playwright MCP

Same content as AEM context: Two SecOps applications (AEM and UVM) powered by data fabric. UVM = "single platform for managing vulnerabilities, simplifying the process of identifying and remediating security risks."
