---
product: zero-trust-branch
topic: "zero-trust-branch-claims-ledger"
title: "Zero Trust Branch claims ledger - Tier 3 misc refresh"
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
author-status: draft
---

# Zero Trust Branch claims ledger

| Claim | Reference surface | Source line(s) |
|---|---|---|
| ZTB combines SD-WAN capabilities with device segmentation for branches, factories, and data centers. | `overview.md` | `vendor/zscaler-help/ztb-what-zero-trust-branch.md:8` |
| ZTB appliances terminate ISP connections, forward branch/cloud traffic to ZTE, and apply ZIA/ZPA policies based on destination and user identity. | `overview.md` | `vendor/zscaler-help/ztb-what-zero-trust-branch.md:10` |
| ZTB network-of-one automatically discovers, classifies, and isolates IoT, OT, IoMT, headless, and legacy devices. | `overview.md` | `vendor/zscaler-help/ztb-what-zero-trust-branch.md:12` |
| ZTB feature list includes automatic device classification, clientless SSH/RDP/VNC access, ZIA/ZPA forwarding policies, ZTP, and `/32` endpoint subnet-mask provisioning. | `overview.md` | `vendor/zscaler-help/ztb-what-zero-trust-branch.md:16-24` |
| Deployment capture lists ZTB appliances, Zscaler Admin Console, ZTP, VMware ESXi, and ZT800 form factors. | `overview.md` | `vendor/zscaler-help/ztb-what-zero-trust-branch.md:33-47` |
| Python `client.ztb` is exposed by `oneapi_client.py`. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:279-285` |
| Python `ZTBService` says it exposes Zero Trust Branch API resources and is used via OneAPI, with legacy client helpers for standalone token-based access. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/ztb/ztb_service.py:37-44`; accessor at `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:297-303` |
| Python `ZTBService` exposes alarms, API keys, app connector config, devices, groups, logs, policy comments, ransomware kill, sites, site-to-site VPN, and templates. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/ztb/ztb_service.py:49-135`; `vendor/zscaler-sdk-python/README.md:1757-1769` |
| Python README says ZTB authenticates by API key, uses `POST /api/v3/api-key-auth/login`, and receives a `delegate_token`. | `overview.md` | `vendor/zscaler-sdk-python/README.md:1722-1728`; `vendor/zscaler-sdk-python/zscaler/ztb/legacy.py:68-75` |
| Python README says ZTB is available only via `LegacyZTBClient` and OneAPI/OAuth2 is not supported for ZTB. | `overview.md`, `clarifications.md` | `vendor/zscaler-sdk-python/README.md:1838-1842` |
| ZTB legacy helper requires `ZTB_API_KEY` and `ZTB_CLOUD`/override URL inputs. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/ztb/legacy.py:114-132` |
| Python Site API provides CRUD and utility operations including list/get/create/update/delete sites, app-segment operations, and cloud-site create. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/ztb/site.py:34-42`, `:48-99`, `:157-241`, `:268-354` |
| Python API key resource exposes list, create, and revoke operations under `/ztb/api/v3`. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/ztb/api_key.py:26-36`, `:42-108`, `:110-189` |
| Python Devices API lists active devices, category/type views, tags, grouping values, and OS rows. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/ztb/devices.py:32-42`, `:48-181`, `:215-260` |
| Python Groups Router exposes list/get/create/update/delete operations. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/ztb/groups_router.py:26-34`, `:40-115`, `:160-346` |
| Python Template Router exposes list/get/create/update/delete operations. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/ztb/template_router.py:27-35`, `:41-108`, `:153-293` |
| Python App Connector Config exposes get/create/delete methods under `/ztb/api/v3/appconnector/config`. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/ztb/app_connector_config.py:24-35`, `:41-76`, `:78-148` |
| Python Site2Site VPN exposes hub list and S2S get/create/update operations under `/ztb/api/v3/CloudGateway`. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/ztb/site2site_vpn.py:32-40`, `:46-192` |
| Go SDK Branch Connector files are adjacent ZPA services, not ZTB product service layers. | `overview.md` | `vendor/zscaler-sdk-go/zscaler/zpa/services/branch_connector/branch_connector.go:1-16`; `vendor/zscaler-sdk-go/zscaler/zpa/services/branch_connector_group/branch_connector_group.go:11-18` |
| No ZTB product Terraform, Ansible, MCP, or Postman surface was found in the audited vendor trees, and no Go ZTB product service was found. | `overview.md` | AUDIT-SCOPED ABSENCE -> 2026-06-16 search across the Go SDK, Terraform, Ansible, and Postman families; MCP portion rechecked 2026-07-22 against v0.13.3 for Zero Trust Branch / ZTB product surface. |
| ZTB Python SDK auth-mode divergence and non-Python coverage remain unresolved. | `overview.md`, `clarifications.md` | OPEN QUESTION -> `references/_meta/clarifications.md#zero-trust-branch-01-ztb-python-sdk-auth-mode-divergence-and-non-python-coverage` |
