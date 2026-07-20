---
product: zscaler-cellular
topic: api
title: "Zscaler Cellular / ZCell API, SDK, and MCP surface"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 4371c9bab44d852526721b4b5999e2471dda5198
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: 6e6509f001ca71adcedfd4884250d09227395bf0
  vendor/terraform-provider-zpa: 02c88e27da98ec75f7a7a85f43486b4f0552dfa9
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 23912913f8588c650b104d3bd30c0c755d6962cd
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/openapi-validation-report.md"
  - "vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json"
  - "vendor/zscaler-api-specs/automate-zscaler/rosetta.md"
  - "vendor/zscaler-help/cellular-what-zscaler-cellular.md"
  - "vendor/zscaler-sdk-python/README.md"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_response.py"
  - "vendor/zscaler-sdk-python/zscaler/config/config_setter.py"
  - "vendor/zscaler-sdk-python/zscaler/utils.py"
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
  - "vendor/zscaler-mcp-server/CHANGELOG.md"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
  - "vendor/zscaler-mcp-server/docs/guides/toolsets.md"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/client.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/security/entitlements.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/_common.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/anomaly_policy.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/audit_data_handling.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/sim_handling.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/investigate_sim.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/audit_data_usage.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/review_anomaly_policies.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/server.py"
  - "vendor/zscaler-mcp-server/docsrc/tools/zcell/index.rst"
  - "vendor/zscaler-mcp-server/tests/test_zcell_shaping.py"
  - "vendor/zscaler-mcp-server/tests/test_docgen.py"
  - "vendor/zscaler-mcp-server/tests/test_prompts.py"
author-status: draft
---

# Zscaler Cellular / ZCell API, SDK, and MCP surface

The captured Automate contract contains **36 ZCell operations** grouped under anomaly policy, audit data handling, customer data handling, customer region handling, network events, SIM analytics, SIM handling, SIM location groups, and tag handling (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:29`; `vendor/zscaler-api-specs/automate-zscaler/openapi/openapi-validation-report.md:15`). The rosetta synthesis records ZCell as "Contract captured" but notes that DAV-21 did not establish a multi-surface reconciliation footprint (`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:173`); that is the capture boundary of that pass, not the current repository state, which now includes both Python SDK and MCP implementations.

## Authentication and customer scoping

The Python SDK exposes `client.zcell` as a OneAPI-only service and constructs it lazily from the shared `RequestExecutor` plus config (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:281-287`). The default client config now includes a `zcellCustomerId` slot (`vendor/zscaler-sdk-python/zscaler/config/config_setter.py:23-28`), and the SDK resolves that value from config or `ZCELL_CUSTOMER_ID` before injecting it into `config["client"]["zcellCustomerId"]` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:159-172`). The README states that ZCell uses the same ZIdentity OAuth2 credentials as other OneAPI products, while `zcellCustomerId` is independently scoped into `/customers/{id}` paths and is separate from ZPA `customerId` (`vendor/zscaler-sdk-python/README.md:385-402`). MCP applies the same boundary: it requires the shared OneAPI client ID, vanity domain, and secret/private key plus `ZCELL_CUSTOMER_ID`, injects that value as `zcellCustomerId`, and does not expose customer ID as a per-call tool parameter (`vendor/zscaler-mcp-server/src/zscaler_mcp/client.py:24-40`, `:48-98`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/_common.py:17-19`).

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

## MCP v0.13.1 surface

The ZCell surface landed in MCP v0.13.0 and remains present in the pinned v0.13.1 tree: **20 read-only tools across nine toolsets** plus guided prompts (`vendor/zscaler-mcp-server/CHANGELOG.md:3-26`; `vendor/zscaler-mcp-server/docs/guides/supported-tools.md:489-514`; `vendor/zscaler-mcp-server/docs/guides/toolsets.md:137-149`). The inventory/search tools are classified by semantic effect rather than HTTP verb—`zcell_list_sims`, for example, uses the SDK's POST search path but is registered as a read (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/sim_handling.py:1-10`, `:226-264`).

| Family | MCP read tools | Captured contract/SDK operations not exposed by MCP |
|---|---:|---|
| Anomaly policy | 4 | Create, update, delete, and enable/disable status (`vendor/zscaler-sdk-python/zscaler/zcell/anomaly_policy.py:117-241`, `:311-347`) |
| Audit data | 2 | No operation-count gap; MCP narrows request fields and output shape (see divergences below) |
| Customer data | 1 | Customer activation/update (`vendor/zscaler-sdk-python/zscaler/zcell/customer_data_handling.py:74-108`) |
| Customer regions | 2 | Update configured regions (`vendor/zscaler-sdk-python/zscaler/zcell/customer_region_handling.py:85-116`) |
| Network events | 1 | No operation-count gap |
| SIM analytics | 5 | No operation-count gap |
| SIM handling | 2 | CSV download, tag assignment, IMEI lock, status update, eSIM assignment, and eSIM-state refresh (`vendor/zscaler-sdk-python/zscaler/zcell/sim_handling.py:96-177`, `:179-284`, `:328-470`) |
| SIM location groups | 2 | Create, update, and delete (`vendor/zscaler-sdk-python/zscaler/zcell/sim_location_groups.py:131-268`) |
| Tags | 1 | Create tag (`vendor/zscaler-sdk-python/zscaler/zcell/tag_handling.py:91-121`) |

That is a **20-operation read/search subset of the 36-operation captured contract**, leaving 16 mutation/export operations at the SDK/API layer (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:21-30`; `vendor/zscaler-mcp-server/docs/guides/supported-tools.md:489-514`). The Help portal's management scope—status changes, IMEI association, tags, eSIM assignment/activation, anomaly policies, and location groups—is therefore broader than the current MCP surface (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:65-67`).

### Input and output contract

Time-bounded MCP tools expose a `days` integer that defaults to 7 and is constrained to 1–365; they do not expose raw start/end timestamps (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/_common.py:35-56`). The epoch bounds are calculated locally by the Python SDK decorator and inserted into the query, body, or path expected by each endpoint—not calculated "on the server" (`vendor/zscaler-sdk-python/zscaler/utils.py:485-558`).

MCP outputs are curated agent views rather than lossless SDK/API payloads. Audit search intentionally removes `old_data` and `new_data` (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/audit_data_handling.py:1-12`, `:70-85`), and the SIM detail view keeps the formatted `usage` field but omits the contract's precision-preserving `usageVal` (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/sim_handling.py:91-120`; `vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json:11720-11726`). Use SDK/API calls when full-fidelity payloads or mutations are required.

### Guided prompts

The release also registers three service-scoped prompts: `zcell_investigate_sim(iccid, since_days="7")`, `zcell_audit_data_usage(since_days="30", country="")`, and `zcell_review_anomaly_policies(since_days="30", policy_type="")` (`vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/investigate_sim.py:22-85`; `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/audit_data_usage.py:21-93`; `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/review_anomaly_policies.py:22-95`). These are orchestration instructions over the read tools, not additional API operations. Prompt visibility is gated only by whether any selected tool leaves the `zcell` service visible, so a partial toolset configuration can advertise a prompt whose required tools are unavailable (`vendor/zscaler-mcp-server/src/zscaler_mcp/server.py:133-141`).

## MCP v0.13.1 divergences and test boundary

- **Violation response shape:** the Automate contract defines `/violations` response `content` as an array of strings, while the SDK response cleaner drops non-dictionary page items and the MCP tool shapes results as policy summaries. The prompt's promise to enumerate offending ICCIDs is therefore not source-consistent and needs a live/upstream fix (`vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json:4080-4200`; `vendor/zscaler-sdk-python/zscaler/oneapi_response.py:244-274`; `vendor/zscaler-sdk-python/zscaler/zcell/anomaly_policy.py:363-430`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/anomaly_policy.py:240-269`; `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/review_anomaly_policies.py:76-89`).
- **SIM pagination routing:** the contract places `page`, `size`, `sortBy`, and `sortDir` in query parameters, while MCP puts page/size in the POST body and exposes no sorting; live backend acceptance of that routing is not established (`vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json:11421-11470`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/sim_handling.py:244-261`; `vendor/zscaler-sdk-python/zscaler/zcell/sim_handling.py:286-315`).
- **Audit narrowing:** MCP types `object_id` as a string, while the contract declares `objectId` as `int64`; the contract also exposes entry ID, root-customer, and sorting filters that MCP omits (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/audit_data_handling.py:31-58`; `vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json:25-135`).
- **Documentation mismatch:** the upstream ZCell guide says anomaly-policy logs accept `days`, but the registered log input and call expose only policy ID plus page/size (`vendor/zscaler-mcp-server/docsrc/tools/zcell/index.rst:111-116`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/anomaly_policy.py:46-55`, `:221-237`).
- **Entitlement uncertainty:** MCP maps three guessed Cellular `prd` claim spellings and carries a TODO to confirm the canonical live-token value (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/entitlements.py:72-79`).
- **Test boundary:** the dedicated ZCell test module identifies itself as pure shaping coverage with no SDK calls or credentials (`vendor/zscaler-mcp-server/tests/test_zcell_shaping.py:1-5`). Separate suites assert the 20-tool read-only inventory and ZCell prompt discovery/rendering (`vendor/zscaler-mcp-server/tests/test_docgen.py:119-123`; `vendor/zscaler-mcp-server/tests/test_prompts.py:169-244`). **Audit-scoped absence (2026-07-16):** no test that mocks or invokes a ZCell SDK method through any of the 20 tool functions was found under `vendor/zscaler-mcp-server/tests`.

## Other client coverage

No Go SDK, Terraform, or Ansible ZCell surface was found in the prior audited trees; those absence claims were not re-audited in this MCP refresh. The captured contract, Python SDK, and read-only MCP layer establish a multi-surface API story, but not Terraform/IaC parity. Keep ZCell out of Terraform-divergence conclusions unless a provider adds a ZCell resource/data-source family.

## Open questions

- `zscaler-cellular-01`: The contract, Python SDK, and MCP read layer resolve the broad surface question, but they do not prove live entitlement/backend acceptance or how IP/IMEI/IMSI identifiers map into ZIA/ZPA policy objects. See [clarification `zscaler-cellular-01`](../_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface).
- `zscaler-cellular-02`: Confirm and fix the anomaly-violation response path so offending ICCIDs survive SDK cleaning and MCP shaping. See [clarification `zscaler-cellular-02`](../_meta/clarifications.md#zscaler-cellular-02-mcp-violation-response-shape).
- `zscaler-cellular-03`: Confirm whether SIM search accepts pagination in the request body or requires the documented query parameters. See [clarification `zscaler-cellular-03`](../_meta/clarifications.md#zscaler-cellular-03-mcp-sim-pagination-routing).
- `zscaler-cellular-04`: Resolve audit `objectId` typing and decide whether entry/root-customer/sort filters should be exposed by MCP. See [clarification `zscaler-cellular-04`](../_meta/clarifications.md#zscaler-cellular-04-mcp-audit-request-contract).
