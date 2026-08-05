---
product: business-insights
topic: overview
title: "Business Insights - SaaS usage analytics, workplace utilization, and ZBI API scope"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: 0d789caf9b79966cd1973cc227d6d2862e46e05d
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/bi-what-zscaler-business-insights.md"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/request_executor.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/custom_apps.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/report_configs.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/reports.py"
  - "vendor/zscaler-mcp-server/integrations/kiro/steering/zins.md"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zins/_common.py"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# Business Insights - SaaS usage analytics, workplace utilization, and ZBI API scope

Business Insights provides visibility into SaaS application usage, application spend, and workplace metrics (`vendor/zscaler-help/bi-what-zscaler-business-insights.md:8`). The help capture splits the product into SaaS Application Management and Office Workplace & Workforce Management: SaaS features include discovery, engagement data, Shadow IT, overlap visibility, and cost control, while workplace features include office-utilization trends, cost-saving models, and workforce metrics (`vendor/zscaler-help/bi-what-zscaler-business-insights.md:10-20`, `:22-31`).

## Dependencies And Data Sources

Business Insights receives data from four source classes: ZIA, IdPs such as Okta and Entra ID, SaaS application connector integrations, and custom application signatures (`vendor/zscaler-help/bi-what-zscaler-business-insights.md:40-45`). The captured prerequisites are also explicit: SaaS app insights require ZIA, while workplace insights require both ZIA and Zscaler Client Connector on relevant endpoints (`vendor/zscaler-help/bi-what-zscaler-business-insights.md:47-50`).

The capture says Zscaler can discover usage of more than 30K apps and then show a business-relevant subset in the portal (`vendor/zscaler-help/bi-what-zscaler-business-insights.md:52-54`). Treat that as a discovery/analytics claim, not as proof that every discovered app has a programmable Business Insights object.

## Programmable Surface

| Family | Audit result |
|---|---|
| Go SDK | No product-specific Business Insights / `zbi` REST service found in this audit pass. |
| Python SDK | `client.zbi` is a Business Insights REST service. It exposes `custom_apps`, `report_configs`, and `reports` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:237`, `:331-335`, `vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py:23-51`). |
| Terraform | No product-specific Business Insights resource or data source found in this audit pass. |
| Ansible | No product-specific Business Insights module found in this audit pass. |
| MCP | MCP exposes read-only Z-Insights analytics tools that refer to Z-Insights / Business Insights licensing; this is separate from the `client.zbi` REST custom-app/report-config surface (`vendor/zscaler-mcp-server/integrations/kiro/steering/zins.md:1`, `:18`, `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zins/_common.py:277-282`). |
| Postman | The OneAPI Postman collection has a "Zscaler Business Insights" folder with custom-app and report-configuration endpoints under `{{ZBIBaseUrl}}/api/v1/...` (`vendor/zscaler-api-specs/oneapi-postman-collection.json:134314-134343`, `:134506-134535`, `:134807-134837`, `:134999-135015`, `:135164-135176`, `:136039-136056`). |
| Help captures | Product overview, architecture/data-source, prerequisites, and discovery-scale claims are captured in `bi-what-zscaler-business-insights.md` (`vendor/zscaler-help/bi-what-zscaler-business-insights.md:8`, `:40-58`). |

## Python `client.zbi` REST Scope

`client.zbi.custom_apps` provides create/read/update/delete operations for custom applications used to track Business Insights web traffic, all under `/bi/api/v1/customapps` (`vendor/zscaler-sdk-python/zscaler/zbi/custom_apps.py:26-34`, `:40-92`, `:94-137`, `:139-194`, `:196-244`, `:246-281`). Postman adds an important constraint: public API custom applications support HOST-based signatures; URL-based custom applications are not supported in that endpoint family (`vendor/zscaler-api-specs/oneapi-postman-collection.json:134506-134535`).

`client.zbi.report_configs` provides create/read/update/delete operations for report configurations associated with custom apps under `/bi/api/v1/reports/{report_type}`, with `customapps` as the documented/default report type in the SDK (`vendor/zscaler-sdk-python/zscaler/zbi/report_configs.py:26-34`, `:40-91`, `:93-144`, `:146-215`, `:217-284`, `:286-328`). `client.zbi.reports` can list report files and download a report through `/bi/api/v1/report/all` and `/bi/api/v1/report/download` (`vendor/zscaler-sdk-python/zscaler/zbi/reports.py:28-36`, `:42-115`, `:117-204`).

The SDK request executor routes `/bi` through its shared OneAPI resolver: production uses the default gateway, non-production commercial clouds use `https://api.<cloud>.zsapi.net`, and `gov` / `govus` select the dedicated FedRAMP gateways (`vendor/zscaler-sdk-python/zscaler/request_executor.py:167-190`). Do not confuse this `client.zbi` REST service with Zero Trust Browser, and do not confuse it with the separate `client.zins` / Z-Insights GraphQL analytics accessor.

## Z-Insights Nuance

The Python SDK also exposes `client.zins` / `client.zinsights` as a separate Z-Insights Analytics GraphQL service (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:387-423`). MCP's Z-Insights skills are read-only and include Shadow IT, SaaS Security, web traffic, cyber security, firewall, and IoT analytics workflows (`vendor/zscaler-mcp-server/integrations/kiro/steering/zins.md:5`, `:18`, `:22-27`, `:54-67`, `:69-80`). This refresh treats that as adjacent analytics surface, not as evidence that MCP can manage Business Insights custom apps or report configurations.

## What Business Insights Is Not

- It is not ZIA reporting by another name; the captured Business Insights product description adds application-spend and workplace-utilization context on top of Zscaler telemetry (`vendor/zscaler-help/bi-what-zscaler-business-insights.md:8`, `:16-31`).
- It is not Zero Trust Browser; the same abbreviation `ZBI` appears in Python SDK code for Business Insights (`vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py:23-24`).
- It is not fully proven to be portal-only. The audited sources show REST APIs for custom apps, report configs, report listing, and report download; additional API coverage remains unresolved.

## Open Questions

- Whether Business Insights has public APIs beyond custom applications, report configurations, report listing, report download, and the adjacent Z-Insights GraphQL analytics surface is unresolved. See [clarification business-insights-01](../_meta/clarifications.md#business-insights-01-business-insights-api-coverage-beyond-custom-apps-and-reports).

## Cross-Links

- Claims ledger for this refresh: [`./_claims-ledger.md`](./_claims-ledger.md)
- ZIA, the required source for SaaS app insights: [`../zia/index.md`](../zia/index.md)
- ZCC, required for workplace utilization features: [`../zcc/index.md`](../zcc/index.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
