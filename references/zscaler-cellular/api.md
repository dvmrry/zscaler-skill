---
product: zscaler-cellular
topic: api
title: "Zscaler Cellular / ZCell API and SDK surface"
content-type: reference
last-verified: "2026-07-08"
verified-against:
  vendor/zscaler-sdk-go: 4371c9bab44d852526721b4b5999e2471dda5198
  vendor/zscaler-sdk-python: 1a994d0447a4aa5da19471111954cfca2cda3acb
  vendor/terraform-provider-zia: 6e6509f001ca71adcedfd4884250d09227395bf0
  vendor/terraform-provider-zpa: dcf12469a9a8f648be0691c74e9816fc94ec7ddc
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 82d3ff7de6e5939c258e4019db43f138e36c2a7c
  vendor/zscaler-mcp-server: a2162c384e1ffb68b3bf14783ea9a1a762c85ff5
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json"
  - "vendor/zscaler-api-specs/automate-zscaler/rosetta.md"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/config/config_setter.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/anomaly_policy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/audit_data_handling.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/customer_data_handling.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/customer_region_handling.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/network_events.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/sim_analytics.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/sim_handling.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/sim_location_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/tag_handling.py"
author-status: draft
---

# Zscaler Cellular / ZCell API and SDK surface

The captured Automate contract contains **36 ZCell operations** grouped under anomaly policy, audit data handling, customer data handling, customer region handling, network events, SIM analytics, SIM handling, SIM location groups, and tag handling (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:28`; `vendor/zscaler-api-specs/automate-zscaler/openapi/openapi-validation-report.md:14`). The rosetta synthesis records ZCell as "Contract captured" but notes that DAV-21 did not establish a multi-surface reconciliation footprint (`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:29`).

## Authentication and customer scoping

The Python SDK exposes `client.zcell` as a OneAPI-only service and constructs it lazily from the shared `RequestExecutor` plus config (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:281-287`). The default client config now includes a `zcellCustomerId` slot (`vendor/zscaler-sdk-python/zscaler/config/config_setter.py:23-28`), and the SDK resolves that value from config or `ZCELL_CUSTOMER_ID` before injecting it into `config["client"]["zcellCustomerId"]` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:159-172`). The README states that ZCell uses the same ZIdentity OAuth2 credentials as other OneAPI products, while `zcellCustomerId` is independently scoped into `/customers/{id}` paths and is separate from ZPA `customerId` (`vendor/zscaler-sdk-python/README.md:385-402`).

## Contract families

| Contract family | Operations | Representative documented path |
|---|---:|---|
| Anomaly policy | 8 | `POST /api/v1/customers/{id}/anomaly-policy`; `GET /api/v1/customers/{id}/anomaly-policy`; `PATCH /api/v1/customers/{id}/anomaly-policy/{policyId}/status` (`vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:2-14`, `:175-187`, `:1437-1449`) |
| Audit data handling | 2 | `POST /api/v1/audit/customers/{id}/search`; `GET /api/v1/audit/metadata` (`vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:1506-1518`, `:1890-1902`) |
| Customer data handling | 2 | `GET /api/v1/customers/{id}`; `PUT /api/v1/customers/{id}` (`vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:1956-1968`, `:2067-2079`) |
| Customer region handling | 3 | `GET /api/v1/customers/{id}/regions`; `PUT /api/v1/customers/{id}/regions`; `GET /api/v1/customers/{id}/regions/operational-status` (`vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:2430-2442`, `:2487-2499`, `:2571-2583`) |
| Network events | 1 | `POST /api/v1/network-events/{id}/search/startTime/{startTime}/endTime/{endTime}` (`vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:2812-2824`) |
| SIM analytics | 5 | `POST /api/v1/customers/{id}/sim/analytics/map`; `GET /api/v1/customers/{id}/sim/analytics/summary`; usage-by-country/day/SIM endpoints (`vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:3280-3292`, `:3504-3516`, `:3601-3713`) |
| SIM handling | 8 | SIM search/details/download, tag assignment, lock, status update, eSIM assignment, and eSIM state refresh (`vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:3801-3813`, `:3911-3923`, `:4188-4200`, `:4910-4922`, `:5412-5594`) |
| SIM location groups | 5 | CRUD over `/api/v1/customers/{id}/sim-location-groups` (`vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:5673-5685`, `:5814-5826`, `:5874-5886`, `:6045-6057`, `:6262-6274`) |
| Tag handling | 2 | `GET /api/v1/customers/{id}/tag`; `POST /api/v1/customers/{id}/tag` (`vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:6378-6390`, `:6446-6458`) |

## Python SDK surface

The SDK service object exposes nine ZCell subclients: `anomaly_policy`, `audit_data_handling`, `customer_data_handling`, `network_events`, `sim_analytics`, `sim_handling`, `sim_location_groups`, `tag_handling`, and `customer_region_handling` (`vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py:37-103`).

| SDK subclient | Representative methods and paths |
|---|---|
| `client.zcell.anomaly_policy` | List/create/update/delete anomaly policies; list logs; update status; list violations and fetch violation detail by ICCID. The service builds `/zcell/config/api/v1/customers/{id}/anomaly-policy` and child paths (`vendor/zscaler-sdk-python/zscaler/zcell/anomaly_policy.py:40-91`, `:117-195`, `:217-241`, `:254-289`, `:311-347`, `:364-477`). |
| `client.zcell.audit_data_handling` | Search audit entries at `/zcell/config/api/v1/audit/customers/{id}/search` and read audit metadata at `/zcell/config/api/v1/audit/metadata` (`vendor/zscaler-sdk-python/zscaler/zcell/audit_data_handling.py:36-95`, `:117-138`). |
| `client.zcell.customer_data_handling` | Get customer data and activate/update an end customer at `/zcell/config/api/v1/customers/{id}` (`vendor/zscaler-sdk-python/zscaler/zcell/customer_data_handling.py:34-57`, `:74-108`). |
| `client.zcell.customer_region_handling` | List regions, update configured regions, and list operational status under `/customers/{id}/regions` (`vendor/zscaler-sdk-python/zscaler/zcell/customer_region_handling.py:38-63`, `:85-116`, `:133-160`). |
| `client.zcell.network_events` | Search network events over a start/end epoch path (`vendor/zscaler-sdk-python/zscaler/zcell/network_events.py:36-100`). |
| `client.zcell.sim_analytics` | Map, summary, and usage rollup methods under `/customers/{id}/sim/analytics/*` (`vendor/zscaler-sdk-python/zscaler/zcell/sim_analytics.py:35-60`, `:82-106`, `:129-287`). |
| `client.zcell.sim_handling` | SIM details, CSV download, tag assignment, lock, search, status update, eSIM assign, and eSIM state refresh (`vendor/zscaler-sdk-python/zscaler/zcell/sim_handling.py:43-74`, `:96-149`, `:179-213`, `:239-260`, `:286-307`, `:328-351`, `:377-454`). |
| `client.zcell.sim_location_groups` | List/get/create/update/delete SIM location groups (`vendor/zscaler-sdk-python/zscaler/zcell/sim_location_groups.py:40-69`, `:91-114`, `:131-163`, `:187-213`, `:236-257`). |
| `client.zcell.tag_handling` | List/create tags at `/customers/{id}/tag` (`vendor/zscaler-sdk-python/zscaler/zcell/tag_handling.py:35-69`, `:91-121`). |

## Non-Python coverage

No Go SDK, Terraform, Ansible, or MCP ZCell surface is currently present in the audited trees. The captured contract and Python SDK are sufficient to establish a documented API surface, but not a Terraform/IaC surface or multi-client parity map. Keep ZCell out of Terraform-divergence conclusions unless a provider adds a ZCell resource/data-source family.

## Open questions

- `zscaler-cellular-01`: The contract and Python SDK now resolve the broad "is there a public API/SDK surface?" part of the old question, but they do not prove tenant entitlement, live backend acceptance, or how IP/IMEI/IMSI policy identifiers map into ZIA/ZPA policy objects. See [clarification `zscaler-cellular-01`](../_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface).
