# The Agentic SecOps Platform under AEM, UVM, Agentic SOC and Identity Protection: data fabric, data sources and the Reporting API (portfolio.secops-platform)
Also called: agentic secops platform; security operations platform; secops platform; data fabric for security; secops data sources; secops reporting api; secops report export; report export via api; secops graphql
Former IDs: aem-01, aem.secops-platform, soc-workbench-01

Asset Exposure Management, Unified Vulnerability Management, Agentic SOC and Identity Protection are applications on one platform that shares ingestion, data model and reporting. The Agentic SecOps Platform has four applications: Asset Exposure Management (AEM), Unified Vulnerability Management (UVM), Agentic SOC and Identity Protection. [portfolio.secops-platform:four-apps]

**Neighbouring products.** The platform natively integrates External Attack Surface Management, whose scanned assets and findings are merged into AEM and UVM, and integrates with Zscaler Deception and Breach Predictor for Preemptive Detection and Response. [portfolio.secops-platform:easm-and-predr] Each application: [Asset Exposure Management (AEM): the asset inventory, coverage gaps and policies, and what can be automated](kb:aem.overview), [Unified Vulnerability Management (UVM): what it does with findings, and what can be automated](kb:uvm.overview), [SOC Workbench (Agentic SOC): alert unification, correlation and prioritization, and what can be automated](kb:soc-workbench.overview), [Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated](kb:identity-protection.overview); Breach Predictor and Deception: [Breach Predictor: what it predicts, which data it reads, how it maps attacks, and what it integrates with](kb:breach-predictor.overview), [Zscaler Deception: decoys and lures, the Private Access integration, roles, and what can be automated](kb:deception.overview).

## Data in

The platform runs on a data fabric for security that centralizes, harmonizes, deduplicates, correlates and enriches data from Zscaler telemetry and third-party tools. [portfolio.secops-platform:data-fabric] Data from external tools (vulnerability scanners, asset inventories, cloud providers) is ingested by creating a data source from a tile on the Sources page; its setup has Details, Retrieval, Scheduling, Remediation Detection Settings and Suppression Rules sections and an optional connectivity Test, and data is retrieved on the next data run unless Process Now is used. [portfolio.secops-platform:data-sources] A generic AnySource connector can upload or extract files from data storage platforms such as GCP and AWS S3. [portfolio.secops-platform:anysource] Field mappings must be configured (Map Data on the source) for ingested data to be processed and used across the platform. [portfolio.secops-platform:field-mapping] The per-source catalog of connectors is not captured [gap:portfolio.secops-platform:connector-catalog].

## Data out

After a report is created, it can be exported in CSV, JSONL or Excel format from the appropriate Reports page, manually for small (up to 100K rows) or large (more than 100K rows) datasets. [portfolio.secops-platform:report-export] A saved report can be scheduled for delivery by email, to an AWS S3 bucket or to Slack, daily, weekly, monthly or on a custom schedule; reports are reachable from Explore > Reports and from My Reports under Vulnerabilities, Assets, Identities and SOC Workbench, and each scheduled run is listed on the report's Runs page. [portfolio.secops-platform:report-schedule] A saved report can be exported programmatically through the Reporting API, a GraphQL-based interface that exports the data to an AWS S3 bucket or returns a downloadable link; the client authenticates for an access token, submits a request to start the report and polls for its status. [portfolio.secops-platform:reporting-api] Before using the Reporting API, the data must be defined as a new or existing report, and the API credentials (client ID and client secret) are obtained from Zscaler Support or the Zscaler account team. [portfolio.secops-platform:reporting-api-credentials] The API's endpoint, schema and token request are not in the capture [gap:portfolio.secops-platform:reporting-api-contract].

What to check:
1. For a request to pull SecOps data programmatically (vulnerabilities, assets, identities, SOC incidents), point to a saved report exported through the GraphQL Reporting API or a scheduled export, and say that the endpoint details are not captured.
2. Whether the Reporting API credentials were obtained from Zscaler Support or the account team; they are not OneAPI or ZIdentity API clients according to any captured source.
3. When newly ingested data is missing, whether the source's fields were mapped and whether the next data run has happened (or Process Now was used).

Not known (open gaps):
- The SecOps Reporting API's endpoint, token request, GraphQL schema and response shape [gap:portfolio.secops-platform:reporting-api-contract]: settled by source-read or support-ticket. Blocks: writing a client for SecOps report export, or telling an operator whether AEM, UVM, SOC or identity data can be queried other than through saved reports
- Which source connectors and outbound integrations the SecOps platform offers [gap:portfolio.secops-platform:connector-catalog] (data gap): filled by operator; settled by source-read. Blocks: telling an operator whether a given tool can feed, or receive tickets from, the SecOps applications

Area: portfolio.secops-platform, its subjects in references/_meta/spine/portfolio/portfolio.secops-platform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/aem/aem.overview.md (Asset Exposure Management (AEM): the asset inventory, coverage gaps and policies, and what can be automated)
- links-to references/_meta/text/breach-predictor/breach-predictor.overview.md (Breach Predictor: what it predicts, which data it reads, how it maps attacks, and what it integrates with)
- links-to references/_meta/text/deception/deception.overview.md (Zscaler Deception: decoys and lures, the Private Access integration, roles, and what can be automated)
- links-to references/_meta/text/identity-protection/identity-protection.overview.md (Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated)
- links-to references/_meta/text/soc-workbench/soc-workbench.overview.md (SOC Workbench (Agentic SOC): alert unification, correlation and prioritization, and what can be automated)
- links-to references/_meta/text/uvm/uvm.overview.md (Unified Vulnerability Management (UVM): what it does with findings, and what can be automated)
