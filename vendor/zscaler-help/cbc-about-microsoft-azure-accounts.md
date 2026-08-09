# About Microsoft Azure Accounts

**Source:** https://help.zscaler.com/cloud-branch-connector/about-microsoft-azure-accounts
**Captured:** 2026-08-04 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

Microsoft Azure partner integration allows user-defined tags and Azure
resource attributes to be used in Zscaler security policy. Zscaler fetches the
information from Azure tenants and subscriptions through a service principal.

Within Zscaler, an **Azure account** is the service-account object that maps to
service-principal credentials with access to subscriptions in one Azure
tenant. Azure tag discovery is in Limited Availability and requires Zscaler
Support.

The integration is documented to:

- discover workloads and metadata across a set of Azure subscriptions;
- display the discovered workloads and metadata; and
- associate Cloud Connectors with workload information for policy
  enforcement.

The portal path is **Infrastructure > Connectors > Cloud > Management > Partner
Integrations > Azure**. The Azure account table exposes application ID, name,
last modifier and modification time, and counts of regions, subscriptions,
Cloud Connectors, and Event Grid resources. The UI supports add, search, edit,
delete, and detail navigation for those counts.
