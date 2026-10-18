# Connecting AnySource

**Source:** https://help.zscaler.com/uvm/connecting-anysource
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1528226, revision 3225369

---

When creating a data source to ingest data into the platform, you can either use a dedicated vendor connector, or you can use the AnySource connector. The AnySource connector allows you to upload files directly to the platform. Uploaded files are stored in their original format and can be mapped to the platform's data model. Each source maintains a consistent field mapping, so all files uploaded to a given source should match the structure of the original file (e.g., headers, file type).
To set up the AnySource connector:
- Go to Configure > Sources.
- Click Create.
- Search for and select AnySource from the tiles.
- On the Create AnySource Source page, in the Retrieval section, select a file upload method:
- Upload File
- AWS S3
- GCP
- Webhook
- Upload File API
To complete the AnySource connector setup, including Remediation Detection Settings and Suppression Rules, see Creating Data Sources.
# Fields to Include in the AnySource File
When ingesting data through the AnySource connector, it's important to include specific fields to enable effective data unification (i.e., entity resolution and data normalization) within the platform's unified data model. To learn more, see What Is Data Unification?
Unlike vendor-specific API connectors (e.g., CrowdStrike Managed Hosts, ServiceNow Assets), which automatically extract the necessary fields based on predefined integration logic, the AnySource connector requires you to explicitly determine which fields to include. For example, when uploading a data file manually, you can choose to include the appropriate fields directly in the file. In other cases, such as using the Upload File API, field selection is typically handled through the parsing logic you define.
## Best Practices for Field Selection
To ensure ingested data is usable in downstream processes (e.g., normalization, enrichment, correlation, and analytics), follow these best practices when selecting fields:
- Include core identifiers: Always export key attributes for each entity to support correlation across data sources (e.g., ID or unique key, name or title, and timestamps like first seen and last seen).
- Add contextual data: Supplement core fields with additional attributes that provide business, operational, or technical context (e.g., asset type, operating system, business unit, owner, location, or tags).
When possible, export a detailed version of the data to facilitate more accurate mapping and merging across different sources.
The ingestion layer is designed to support a wide variety of file formats and structural variations, so preprocessing (e.g., data cleaning, reformatting) is generally not required, as the system can interpret and normalize diverse input structures during parsing.
## Recommended Fields (by Entity Type)
Each entity type (e.g., assets, vulnerabilities) has its own set of core recommended fields. The following examples are the key fields typically associated with assets and vulnerabilities.
### Assets
| Attribute | Description |
|---|---|
| Asset Name/Hostname | The name or hostname of the asset |
| Asset Type | The type of asset (e.g., server, workstation) |
| External or Internal IP Address | The IP addresses associated with the asset |
| Operating System | The operating system running on the asset |
| Asset Owner | The individual or department responsible for the asset |
| Location | The physical or logical location of the asset |
| Asset Status | The status of the asset (e.g., active, decommissioned) |
| Asset Tags | The asset tags, if available. Tags can contain valuable business information. |
| Software Installed | A list of installed software and software versions |
| Asset Criticality | The importance of the asset to the organization (e.g., critical, non-critical) |
### Findings
| Attribute | Description |
|---|---|
| Vulnerability Name/ID | The name or unique identifier for the vulnerability |
| Severity Score/CVSS/Scanner Score | The severity score assigned to the vulnerability, including the numerical score (8.1) and the category (High) |
| Description | A detailed description of the vulnerability and impact |
| Affected Asset | Information about the asset or system with the vulnerability |
| CVE | The CVE identifier, if available |
| Threat Intel Information | Threat intel parameters provided by the vendor |
| Tags | Vulnerability tags, if available. Tags can contain valuable business information. |
| Timestamps | The First Seen and Last Seen fields that state when the vulnerability was first and last discovered or reported |
| Recommendations/Fix | Recommended actions for vulnerability remediation |
| Affected Component | Information about the affected component (i.e. Java, Windows), if available |
