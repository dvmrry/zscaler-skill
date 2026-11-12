# Zscaler EASM: what it is, how it is set up, and where each part is documented (easm.overview)

EASM is the continuous discovery, inventory, classification and monitoring of an organization's internet-exposed digital assets, which include domains, IP addresses, subdomains and SSL/TLS certificates. [easm.overview:definition] EASM uses both passive and active scanning methods to continuously discover and inventory internet-facing assets. [easm.overview:scan-methods] EASM prioritizes remediation with a risk-based approach that considers exploit likelihood, derived from sources like the CISA KEV catalog. [easm.overview:risk-based-priority]

**Use cases.** The use cases the page lists for EASM are security posture management, M&A diligence and continuous compliance monitoring. [easm.overview:use-cases]

## Setting up

After Zscaler provisions an EASM tenant, an email with instructions to complete account registration is sent to the customer. [easm.overview:onboarding-email] Following account setup, users can be provisioned on Authentication Service, which the page describes as Zscaler's centralized identity management platform (and which must be enabled for the organization), to access EASM, and after provisioning roles can be assigned to manage access to specific organizations. [easm.overview:user-provisioning] The EASM configuration guide's steps are: set up your account, create your organization, configure a discovery profile, get your asset inventory information, and monitor your attack surface using dashboards. [easm.overview:setup-order] The asset inventory is continuously updated through periodic scans, which can detect new assets connected to existing assets and removal of previously discovered assets. [easm.overview:inventory-refresh]

## Where each part is

- **Organizations, seeds and discovery profiles.** [EASM organizations, seeds and discovery profiles: defaults, permissions, disable and delete, and scan cadence](kb:easm.discovery).
- **Asset inventory.** [EASM asset inventory: types, risk levels, Approved, Candidate and Archived status, detail fields and the Assets page](kb:easm.assets).
- **Findings.** [EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages](kb:easm.findings).
- **Lookalike domains.** [EASM lookalike domains: the raw-domain key, deception methods, risk categories and missing signals](kb:easm.lookalike-domains).
- **Dashboards.** [EASM Insights Overview and Assets Overview dashboards: widgets, time frames and bucket definitions](kb:easm.dashboards).
- **Portal access, roles and reports.** [EASM Admin Portal access: sign-in and MFA, session limits, roles, navigation and PPTX reports](kb:easm.admin-portal).
- **Jira.** [EASM Jira integration: personal access token, connection, ticket fields and synchronization limits](kb:easm.jira-integration).
- **API and MCP.** [The EASM (ZEASM) API: organization scoping, clients, paging and the Postman collection](kb:easm.api) and [The Zscaler MCP server's EASM tools: inventory, full records and documentation mismatches](kb:easm.mcp); the asset endpoints are in [The asset endpoints (list assets, and an asset's certificates, services and technologies) are in the API contract but no SDK resource or MCP tool calls them.](kb:easm.api:assets-api-only).

What to check:
1. Which step of the five-step setup the question is at before reading the subject for that step.

Area: easm.overview, its subjects in references/_meta/spine/easm/easm.overview.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/easm/easm.api.md (The EASM (ZEASM) API: organization scoping, clients, paging and the Postman collection)
- links-to references/_meta/text/easm/easm.admin-portal.md (EASM Admin Portal access: sign-in and MFA, session limits, roles, navigation and PPTX reports)
- links-to references/_meta/text/easm/easm.assets.md (EASM asset inventory: types, risk levels, Approved, Candidate and Archived status, detail fields and the Assets page)
- links-to references/_meta/text/easm/easm.dashboards.md (EASM Insights Overview and Assets Overview dashboards: widgets, time frames and bucket definitions)
- links-to references/_meta/text/easm/easm.discovery.md (EASM organizations, seeds and discovery profiles: defaults, permissions, disable and delete, and scan cadence)
- links-to references/_meta/text/easm/easm.findings.md (EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages)
- links-to references/_meta/text/easm/easm.jira-integration.md (EASM Jira integration: personal access token, connection, ticket fields and synchronization limits)
- links-to references/_meta/text/easm/easm.lookalike-domains.md (EASM lookalike domains: the raw-domain key, deception methods, risk categories and missing signals)
- links-to references/_meta/text/easm/easm.mcp.md (The Zscaler MCP server's EASM tools: inventory, full records and documentation mismatches)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zidentity/zidentity.overview.md (What ZIdentity (Authentication Service) is, and where each part of it is covered)
