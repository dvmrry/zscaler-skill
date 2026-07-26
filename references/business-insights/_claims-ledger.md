---
product: business-insights
topic: "business-insights-claims-ledger"
title: "Business Insights claims ledger - Tier 3 thin-stub refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: e68b53e17f61870f3bec2a68bff3e3d4f1c6db05
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 70e67db347441caa31f94da8f904389064db0664
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

# Business Insights claims ledger

This ledger covers the Tier 3 thin-stub refresh for Business Insights. Rows either cite exact source lines, identify an open question, or mark an audit-scoped absence from the checked source families.

| Claim | Reference surface | Source line(s) |
|---|---|---|
| Business Insights provides visibility into SaaS application usage, spending insights, and workplace metrics. | `overview.md` | `vendor/zscaler-help/bi-what-zscaler-business-insights.md:8` |
| SaaS Application Management includes discovery, engagement data, Shadow IT, overlap visibility, and cost-control themes. | `overview.md` | `vendor/zscaler-help/bi-what-zscaler-business-insights.md:10-20` |
| Office Workplace & Workforce Management includes workplace insights, predictive cost-saving models, back-to-office strategy, and workforce metrics. | `overview.md` | `vendor/zscaler-help/bi-what-zscaler-business-insights.md:22-31` |
| Business Insights receives data from ZIA, IdPs, SaaS application connector integrations, and custom application signatures. | `overview.md` | `vendor/zscaler-help/bi-what-zscaler-business-insights.md:40-45` |
| SaaS app insights require ZIA, and workplace insights require ZIA plus Zscaler Client Connector on relevant endpoints. | `overview.md` | `vendor/zscaler-help/bi-what-zscaler-business-insights.md:47-50` |
| Zscaler can discover usage of more than 30K apps, but the portal shows a business-relevant subset by default. | `overview.md` | `vendor/zscaler-help/bi-what-zscaler-business-insights.md:52-54` |
| Business Insights can distinguish subscribed apps from used apps with metadata fields such as cost, license plans, and contract dates. | `overview.md` | `vendor/zscaler-help/bi-what-zscaler-business-insights.md:56-58` |
| Python `client.zbi` is Zscaler Business Insights REST API surface, not Zero Trust Browser. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:230`, `:316-319`; `vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py:23-24` |
| Python `client.zbi` exposes `custom_apps`, `report_configs`, and `reports`. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py:29-51` |
| `client.zbi.custom_apps` supports list, get, create, update, and delete operations under `/bi/api/v1/customapps`. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/zbi/custom_apps.py:26-34`, `:40-92`, `:94-137`, `:139-194`, `:196-244`, `:246-281` |
| The public custom-app API supports HOST-based signatures; URL-based custom applications are not supported in that Postman-described endpoint family. | `overview.md` | `vendor/zscaler-api-specs/oneapi-postman-collection.json:134506-134535` |
| `client.zbi.report_configs` supports list, get, create, update, and delete operations under `/bi/api/v1/reports/{report_type}`; the SDK comments document `customapps` as the current/default type. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/zbi/report_configs.py:26-34`, `:40-91`, `:93-144`, `:146-215`, `:217-284`, `:286-328` |
| `client.zbi.reports` lists available report files and downloads reports via `/bi/api/v1/report/all` and `/bi/api/v1/report/download`. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/zbi/reports.py:28-36`, `:42-115`, `:117-204` |
| The Python request executor routes `/bi` through the shared OneAPI resolver: production uses the default gateway, non-production commercial clouds use `api.<cloud>.zsapi.net`, and `gov` / `govus` use dedicated FedRAMP gateways. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/request_executor.py:166-189` |
| The OneAPI Postman collection contains a "Zscaler Business Insights" folder with custom-app and report-configuration endpoints. | `overview.md` | `vendor/zscaler-api-specs/oneapi-postman-collection.json:134314-134343`, `:134506-134535`, `:134807-134837`, `:134999-135015`, `:135164-135176`, `:136039-136056` |
| Python `client.zins` / `client.zinsights` is a separate Z-Insights Analytics GraphQL service. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:336-371` |
| MCP Z-Insights is read-only and covers web traffic, cyber security incidents, Shadow IT, SaaS security, firewall analytics, and IoT workflows. | `overview.md` | `vendor/zscaler-mcp-server/integrations/kiro/steering/zins.md:1`, `:5`, `:18`, `:22-27`, `:54-80` |
| MCP error handling treats Z-Insights and Business Insights licensing together, but that does not prove MCP can manage Business Insights custom apps or report configs. | `overview.md` | `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zins/_common.py:277-282` |
| Go SDK has no product-specific Business Insights / `zbi` REST service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Business Insights or ZBI REST service found in `vendor/zscaler-sdk-go` during the 2026-06-16 surface sweep. |
| Terraform has no product-specific Business Insights resource or data source in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Business Insights resource/data-source surface found in `vendor/terraform-provider-zia` or `vendor/terraform-provider-zpa` during the 2026-06-16 surface sweep. |
| Ansible has no product-specific Business Insights module in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Business Insights module found in `vendor/ziacloud-ansible` or `vendor/zpacloud-ansible` during the 2026-06-16 surface sweep. |
| Additional Business Insights APIs beyond custom apps, report configs, report listing/download, and adjacent Z-Insights analytics remain unresolved. | `overview.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#business-insights-01-business-insights-api-coverage-beyond-custom-apps-and-reports` |
