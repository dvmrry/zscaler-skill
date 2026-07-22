---
product: zero-trust-branch
topic: overview
title: "Zero Trust Branch - branch SD-WAN, segmentation, and ZTB API surface"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: cd24ac6b1f409d6752b5de8092e50dcab7b8c5c0
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: 41cac5f54065b1a2264d0ab057eba8d0b35fca25
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 47fe874551023bf8d138c24612aa4ea0f16aaa56
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/ztb-what-zero-trust-branch.md"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/ztb/ztb_service.py"
  - "vendor/zscaler-sdk-python/zscaler/ztb/legacy.py"
  - "vendor/zscaler-sdk-python/README.md"
  - "vendor/zscaler-sdk-python/zscaler/ztb/site.py"
  - "vendor/zscaler-sdk-python/zscaler/ztb/api_key.py"
  - "vendor/zscaler-sdk-python/zscaler/ztb/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/ztb/groups_router.py"
  - "vendor/zscaler-sdk-python/zscaler/ztb/template_router.py"
  - "vendor/zscaler-sdk-python/zscaler/ztb/app_connector_config.py"
  - "vendor/zscaler-sdk-python/zscaler/ztb/site2site_vpn.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/branch_connector/branch_connector.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/branch_connector_group/branch_connector_group.go"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
  - "vendor/zscaler-mcp-server/docsrc/tools/ztw/index.rst"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/ztw/network_services.py"
author-status: draft
---

# Zero Trust Branch - branch SD-WAN, segmentation, and ZTB API surface

Zero Trust Branch is the one misc-cluster product with a real SDK surface in this refresh. Python exposes `client.ztb` resources for the ZTB API; Go, Terraform, Ansible, MCP, and Postman did not show an equivalent ZTB product surface in the audited trees.

## Source-family sweep

| Family | Audit result |
|---|---|
| Go SDK | No ZTB product service surface found. The Go SDK has ZPA Branch Connector and Branch Connector Group services under `/zpa/mgmtconfig/.../branchConnector` and `/branchConnectorGroup`, which are adjacent ZPA surfaces rather than the ZTB `/ztb/...` API (`vendor/zscaler-sdk-go/zscaler/zpa/services/branch_connector/branch_connector.go:13-16`, `vendor/zscaler-sdk-go/zscaler/zpa/services/branch_connector_group/branch_connector_group.go:11-18`). |
| Python SDK | ZTB product surface found. `oneapi_client.py` exposes `client.ztb`, and `ztb_service.py` exposes alarms, API keys, app connector config, devices, groups, logs, policy comments, ransomware kill, sites, site-to-site VPN, and templates (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:279-285`; `vendor/zscaler-sdk-python/zscaler/ztb/ztb_service.py:37-44`, `:49-135`). |
| Terraform | No ZTB product resources or data sources found in the audited ZIA or ZPA providers. |
| Ansible | No ZTB product modules found in the audited ZIA or ZPA collections. |
| MCP | No ZTB product tools found in the audited MCP server. MCP's `ztw` tools call `client.ztw`; the module/docsrc describe network-resource tooling under the Cloud & Branch Connector name, while the generated catalog labels the same family "Workload Segmentation." Neither is a `client.ztb` or `/ztb/...` product surface (`vendor/zscaler-mcp-server/docsrc/tools/ztw/index.rst:1-5`; `vendor/zscaler-mcp-server/docs/guides/supported-tools.md:372-396`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/ztw/network_services.py:69-83`). |
| Postman | No ZTB product endpoint family found in the audited OneAPI collection. |
| Help | ZTB is covered by the Zero Trust Branch Help capture, including product positioning, ZTE forwarding, device segmentation, key features, and deployment form factors (`vendor/zscaler-help/ztb-what-zero-trust-branch.md:8-24`, `:33-47`). |

## Product shape

The Help capture says Zero Trust Branch combines SD-WAN capabilities with device segmentation for branches, factories, and data centers (`vendor/zscaler-help/ztb-what-zero-trust-branch.md:8`). It says ZTB appliances terminate ISP connections, forward branch and cloud traffic to the Zero Trust Exchange, and apply ZIA or ZPA policies based on traffic destination and user identity (`vendor/zscaler-help/ztb-what-zero-trust-branch.md:10`).

The "network-of-one" model automatically discovers, classifies, and isolates devices including IoT, OT, IoMT, headless devices, and legacy systems (`vendor/zscaler-help/ztb-what-zero-trust-branch.md:12`). The feature list includes automatic device classification, clientless browser-based SSH/RDP/VNC access to OT assets, ZIA/ZPA forwarding policies, Zero Touch Provisioning, and a gateway mode that auto-provisions each endpoint with a `/32` subnet mask (`vendor/zscaler-help/ztb-what-zero-trust-branch.md:16-24`).

Deployment uses Zero Trust Branch appliances plus the Zscaler Admin Console; captured options include Zero Touch Provisioning, VMware ESXi, and ZT800 hardware (`vendor/zscaler-help/ztb-what-zero-trust-branch.md:33-47`).

## Python SDK surface

The Python SDK exposes ZTB as `client.ztb`, but the auth story is internally divergent. `oneapi_client.py` creates a `ZTBService` for `client.ztb` when not using a legacy client (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:297-303`), and `ztb_service.py` says the service is used via the OneAPI authentication path while standalone access should use `LegacyZTBClient` or `LegacyZTBClientHelper` (`vendor/zscaler-sdk-python/zscaler/ztb/ztb_service.py:37-44`). The README instead says ZTB authenticates via API key, uses `POST /api/v3/api-key-auth/login`, and is available only through `LegacyZTBClient` because OneAPI/OAuth2 is not supported for ZTB (`vendor/zscaler-sdk-python/README.md:1810-1842`). Keep that as an open clarification, not a resolved claim.

| Resource | Source-backed operations |
|---|---|
| Sites | Site API provides CRUD and utility operations under `/ztb/api/v2`; inspected methods include list/get/create/update/delete sites, app-segment list/update, and cloud-site create (`vendor/zscaler-sdk-python/zscaler/ztb/site.py:34-42`, `:48-99`, `:157-241`, `:268-354`). |
| API keys | API key auth resource exposes list, create, and revoke under `/ztb/api/v3` (`vendor/zscaler-sdk-python/zscaler/ztb/api_key.py:26-36`, `:42-108`, `:110-189`). |
| Devices | Devices API lists active devices, category/type views, tags, grouping values, and OS rows across `/ztb/api/v2` and `/ztb/api/v3` (`vendor/zscaler-sdk-python/zscaler/ztb/devices.py:32-42`, `:48-181`, `:215-260`). |
| Groups and templates | Groups Router and Template Router both expose list/get/create/update/delete-style methods (`vendor/zscaler-sdk-python/zscaler/ztb/groups_router.py:26-34`, `:40-115`, `:160-346`; `vendor/zscaler-sdk-python/zscaler/ztb/template_router.py:27-35`, `:41-108`, `:153-293`). |
| App connector config | App Connector Config exposes get/create/delete methods under `/ztb/api/v3/appconnector/config` (`vendor/zscaler-sdk-python/zscaler/ztb/app_connector_config.py:24-35`, `:41-76`, `:78-148`). |
| Site-to-site VPN / Cloud Gateway | Site2Site VPN exposes hub list and S2S get/create/update operations under `/ztb/api/v3/CloudGateway/...` (`vendor/zscaler-sdk-python/zscaler/ztb/site2site_vpn.py:32-40`, `:46-192`). |

## Programmability posture

Use Python SDK source for capability-level claims. Do not infer Go/Terraform/Ansible/MCP/Postman parity from Python. Also do not treat Go ZPA Branch Connector files or MCP's `ztw` family as the ZTB product API: those surfaces use ZPA/`client.ztw` paths rather than `/ztb/...` (`vendor/zscaler-sdk-go/zscaler/zpa/services/branch_connector/branch_connector.go:1-16`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/ztw/network_services.py:69-83`).

## Open questions

- `zero-trust-branch-01`: The Python SDK contains a `client.ztb` OneAPI path and a legacy API-key path, while its README says OneAPI/OAuth2 is not supported for ZTB. Confirm the supported auth mode and any source-of-truth drift. See [clarification `zero-trust-branch-01`](../_meta/clarifications.md#zero-trust-branch-01-ztb-python-sdk-auth-mode-divergence-and-non-python-coverage).
- `zero-trust-branch-02`: MCP v0.13.3 labels the `ztw` generated catalog as "Workload Segmentation" while its module and docsrc call the same service "Zscaler Cloud & Branch Connector". Confirm the canonical product label and boundary; neither spelling establishes ZTB coverage. See [clarification `zero-trust-branch-02`](../_meta/clarifications.md#zero-trust-branch-02-mcp-ztw-product-label-and-ztb-boundary).

## Cross-links

- ZIA: [`../zia/index.md`](../zia/index.md)
- ZPA: [`../zpa/index.md`](../zpa/index.md)
- Cloud Connector: [`../cloud-connector/index.md`](../cloud-connector/index.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
