# How DSPM scans: onboarding scope, the in-account orchestrator, data stores, authentication, classification and data residency (dspm.scanning)
Also called: dspm onboarding; dspm orchestrator; dspm scanner; dspm supported data stores; dspm scan types; dspm in-region scanning; dspm ocr; dspm authentication; dspm posture labels

DSPM scans AWS, Azure and GCP data stores (storage services, virtual machines with their disks, and databases) and on-premises databases for sensitive data, vulnerabilities and misconfigurations. [dspm.scanning:scope] The models that can be onboarded are an AWS Organization or Standalone Account, an Azure Tenant or Management Group, and a GCP Organization. [dspm.scanning:onboarding-types]

**Where scanning runs.** DSPM works with minimal access to resources and scans agentlessly and continuously across cloud storage, databases, virtual machines and on-premises data centers. [dspm.scanning:agentless] Scans are performed by a local scan orchestrator deployed in the customer's AWS, Azure, GCP or on-premises data center account during onboarding; resources are scanned against a set of standard security policies and a scan schedule, and scan rules select the resources, the scan type and the scan frequency. [dspm.scanning:orchestrator] For listed regions, DSPM supports in-region scanning to meet data residency requirements such as GDPR: data is processed within the region and only metadata is sent to the Zscaler Admin Console. [dspm.scanning:in-region]

**What it scans.** The Supported Data Stores section of the page is divided into managed data stores, managed AI services, unmanaged databases, Snowflake and Databricks, and on-premises data stores, followed by a Microsoft Information Protection (MIP) Labels table. [dspm.scanning:store-categories] DSPM scans its supported file types in storage services and virtual machines, but not in databases. [dspm.scanning:file-types-not-databases] DSPM uses OCR to find sensitive data in image files and in images embedded in PDF or Microsoft Office documents. [dspm.scanning:ocr]

**Access.** Scans authenticate either cloud-natively (cross-account IAM roles in AWS, service principals or managed identities in Azure, service accounts in GCP) or by bring-your-own identity: credentials (username or password or access keys stored in the vault, mostly for unmanaged databases) or certificate-based mutual TLS. [dspm.scanning:authentication]

**Posture checks.** Posture labels describe the checks run on a store: Public Exposure, Encryption (customer-managed or platform-managed key), Logging, Backup Recovery, Access Control (IAM policies and ACLs), Guardrails (for AI services), Has AI/ML Package and Has AI/ML Model (on compute instances). [dspm.scanning:posture-labels]

**Classification.** Data is classified with Zscaler's DLP engines and dictionaries, through full, incremental, historical or sampling scans. [dspm.scanning:classification] The About Scan Settings page says that when scanning relational databases such as PostgreSQL, Oracle, SQL Server and MySQL, DSPM scans a sample of the data instead of the whole database, to avoid affecting database operations. [dspm.scanning:database-sampling] Whether the managed database rule pages' Full Scan conflicts with that is in dispute [divergence:dspm.scanning:sampling-vs-full-scan]. Overlapping scan rules are allowed but can cause duplicate scans and higher compute costs; DSPM warns during rule creation. [dspm.scanning:overlapping-rules]

**Rules and operations.** Per-resource scan rule fields, scan statuses, running and stopping scans, and scan scopes are in [How DSPM scan rules are configured per resource type, how scans are run and stopped, and how scan scopes select DLP engines](kb:dspm.scan-rules). Vulnerability scanning support is in [What DSPM vulnerability scanning supports: virtual machine platforms, operating systems, file systems, libraries, encryption and regions](kb:dspm.vulnerability-scanning).

What to check:
1. Whether the data store's region is one that supports in-region scanning, for questions about data leaving a region.
2. Whether a relational database was scanned in full or sampled, before concluding sensitive data is absent.
3. Whether two scan rules cover the same resources when scans or compute costs double.

Sources disagree (name both sides):
- The About Scan Settings sentence says that when scanning relational databases such as PostgreSQL, Oracle, SQL Server and MySQL DSPM samples instead of scanning the entire database, without scoping it to unmanaged or on-premises databases. The same page's Scan Types table, the supported-data-stores matrix and the AWS-managed and GCP-managed rule pages offer a Full Scan for managed databases next to Data Sampling Scan; the four engines the sentence names are the rows the matrix lists as Supported by Sampling scan only (unmanaged and on-premises). [divergence:dspm.scanning:sampling-vs-full-scan]
  - zscaler-help: When scanning relational databases such as PostgreSQL, Oracle, SQL Server and MySQL, DSPM uses data sampling to scan a subset of data instead of the entire database.
  - zscaler-help: The same page's Scan Types table gives Managed Database both a Full Scan and a Data Sampling Scan.
  - zscaler-help: The matrix lists RDS Instance and Cluster, and Azure SQL Servers, with Full Scan and Sampling Scan.
  - zscaler-help: The AWS-managed database rule page (databases such as MySQL, Aurora MySQL and Aurora PostgreSQL) offers a Full Scan: a complete scan of all databases across all onboarded accounts.
  Impact: Read with its scope, the sentence holds for unmanaged and on-premises databases; applied to managed databases it conflicts with the Full Scan the table, matrix and rule pages offer. Check the Scan Type chosen in the rule before concluding sensitive data is absent. The rule pages are in dspm.scan-rules.

Area: dspm.scanning, its subjects in references/_meta/spine/dspm/dspm.scanning.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.dlp.engines.md (DLP engines: the unit a rule references): Data is classified with Zscaler's DLP engines and dictionaries, through full, incremental, historical or sampling scans. [dspm.scanning:classification]
- links-to references/_meta/text/dspm/dspm.scan-rules.md (How DSPM scan rules are configured per resource type, how scans are run and stopped, and how scan scopes select DLP engines)
- links-to references/_meta/text/dspm/dspm.vulnerability-scanning.md (What DSPM vulnerability scanning supports: virtual machine platforms, operating systems, file systems, libraries, encryption and regions)
