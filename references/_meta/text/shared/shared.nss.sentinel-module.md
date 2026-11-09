# Terraform module for Cloud NSS to Microsoft Sentinel (shared.nss.sentinel-module)
Also called: terraform sentinel cloud nss; zia sentinel cloud nss; sentinel data collection rule zscaler; sentinel dce; web_log_config; dns_log_config; firewall_log_config; sentinel custom table zscaler; monitoring metrics publisher zscaler

The module deploys the Azure side of a Zscaler Cloud NSS to Microsoft Sentinel integration: Sentinel and Log Analytics workspaces, Data Collection Endpoints, Data Collection Rules and custom tables, one table per supported log type: Web, DNS and Firewall. [shared.nss.sentinel-module:purpose] The Sentinel Cloud NSS Terraform module is community supported: Zscaler employees still support it, but Zscaler support does not, and issues go to its GitHub Issues. [shared.nss.sentinel-module:support] The module's changelog dates its 1.3.0 entry 2023-07-03. [shared.nss.sentinel-module:stale]

**Workspace and tables.** The workspace SKU defaults to PerGB2018 and retention to 90 days, with retention validated between 30 and 730 days; the module enables the SecurityInsights solution on the workspace. [shared.nss.sentinel-module:workspace] Each of the web, firewall and DNS log tables is disabled by default, needs a non-empty table_name when enabled, and has _CL appended to its name when the name does not already end in _CL. [shared.nss.sentinel-module:tables]

**Ingestion path.** The Data Collection Endpoint kind defaults to Windows (Linux is the only other value) and the endpoint has public network access enabled. [shared.nss.sentinel-module:dce] For each enabled table the Data Collection Rule declares a Custom stream and a data flow that applies a KQL transform and writes to the Microsoft-CommonSecurityLog output stream. [shared.nss.sentinel-module:dcr-flow]

**Credentials and outputs.** The module registers an Azure AD application with a service principal and a generated client secret, and grants it the Monitoring Metrics Publisher role scoped to the Data Collection Rule. [shared.nss.sentinel-module:aad-app] The module outputs the application ID, tenant ID, a sensitive client secret, the logs ingestion endpoint, the rule's immutable ID and an endpoint URL that uses api-version 2021-11-01-preview unless api_version is changed. [shared.nss.sentinel-module:outputs] The Cloud NSS feed's own Sentinel fields are in [Cloud NSS feed settings: HTTPS-only URLs and OAuth fields](kb:zia.api.cloud-nss-feeds).

**Providers.** The module pins azurerm to ~> 3.60.0, azuread to ~> 2.39.0 and azapi to ~> 1.7.0, and sets the azurerm provider so that resource groups are deleted even if they still contain resources. [shared.nss.sentinel-module:provider-pins]

What to check:
1. Which tables exist and what their names are, since a name without _CL gets it appended and disabled log types create nothing.
2. What the Cloud NSS feed needs from the module: the endpoint URL per table, the application ID, tenant ID and secret.

Area: shared.nss, its subjects in references/_meta/spine/shared/shared.nss.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs): Cloud NSS requires a separate concurrent subscription, and its geo-availability and qualifications are obtained from Zscaler Support. [shared.nss.delivery-modes:cloud-subscription]
- links-to references/_meta/text/zia/zia.api.cloud-nss-feeds.md (Cloud NSS feed settings: HTTPS-only URLs and OAuth fields)
