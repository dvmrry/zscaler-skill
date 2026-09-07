# Automate Docusaurus Snapshot

Captured at: `2026-09-07T13:58:58.314959+00:00`
Main JS: `https://automate.zscaler.com/assets/js/main.ee13ae7b.js`
Runtime JS: `https://automate.zscaler.com/assets/js/runtime~main.f2f463b9.js`

## Summary

- Routes discovered: **1322**
- API MDX route candidates matched: **1322 / 1322**
- API blobs decoded: **1322**
- Decode failures: **0**
- Existing committed contract ops: **1304**
- Live-only route keys: **53**
- Existing-only route keys: **35**
- Live-only loose method/path signatures: **38**
- Existing-only loose method/path signatures: **23**

## Retained Publication Absences

- None.

## Product Counts

| product | live blobs | existing scrape | route-key common ops | loose path common sigs | live-only route keys | existing-only route keys | request nested | response nested |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `ai-security` | 114 | 108 | 104 | 104 | 10 | 4 | 157 | 804 |
| `aiguard` | 47 | 47 | 47 | 39 | 0 | 0 | 24 | 132 |
| `bi` | 10 | 10 | 10 | 10 | 0 | 0 | 48 | 116 |
| `easm` | 11 | 11 | 11 | 11 | 0 | 0 | 0 | 79 |
| `event-monitoring` | 15 | 15 | 15 | 14 | 0 | 0 | 22 | 69 |
| `urbac` | 6 | 0 | 0 | 0 | 6 | 0 | 0 | 0 |
| `zcc` | 50 | 54 | 50 | 50 | 0 | 4 | 481 | 546 |
| `zcell` | 36 | 36 | 11 | 35 | 25 | 25 | 15 | 196 |
| `zcloudconnector` | 165 | 165 | 165 | 165 | 0 | 0 | 2358 | 5678 |
| `zdx` | 148 | 148 | 148 | 129 | 0 | 0 | 562 | 5947 |
| `zia` | 469 | 471 | 469 | 469 | 0 | 2 | 3249 | 9699 |
| `zid` | 31 | 31 | 31 | 28 | 0 | 0 | 24 | 265 |
| `zpa` | 220 | 208 | 208 | 208 | 12 | 0 | 5390 | 9104 |

## Contract Change Radar

Route-key renames are paired by method/path before additions and removals are counted. Schema changes compare flattened field names plus type, required, readonly, enum, and response status metadata, as well as discriminator mappings and titles from request and selected-success schemas. Schema or product metadata drift describes the current public documentation; by itself it does not establish a feature launch, endpoint availability, or tenant entitlement.

| product | matched | added ops | removed ops | route changes | route-key changes | schema-changed ops | schema annotation Δ | product metadata Δ | request +/−/Δ | response +/−/Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `ai-security` | 104 | 10 | 4 | 0 | 0 | 7 | 6 | 0 | 0/0/0 | 58/10/10 |
| `aiguard` | 47 | 0 | 0 | 8 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `bi` | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `easm` | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0/0/0 | 0/0/0 |
| `event-monitoring` | 15 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `urbac` | 0 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zcc` | 50 | 0 | 4 | 0 | 0 | 0 | 0 | 1 | 0/0/0 | 0/0/0 |
| `zcell` | 35 | 1 | 1 | 0 | 24 | 10 | 1 | 1 | 1/0/1 | 8/1/1 |
| `zcloudconnector` | 165 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0/0/0 | 0/0/0 |
| `zdx` | 148 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0/0/0 | 0/0/0 |
| `zia` | 469 | 0 | 2 | 0 | 0 | 0 | 0 | 1 | 0/0/0 | 0/0/0 |
| `zid` | 31 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zpa` | 208 | 12 | 0 | 0 | 0 | 8 | 0 | 1 | 0/0/0 | 0/0/0 |

### Product metadata changes

- `easm` `title`: `Zscaler External Attack Surface Management API` → `External Attack Surface Management API`.
- `zcc` `title`: `Zscaler Client Connector API` → `Client Connector API`.
- `zcell` `title`: `Zscaler Cellular API` → `Cellular API`.
- `zcloudconnector` `title`: `Zscaler Cloud & Branch Connector API` → `Cloud & Branch Connector API`.
- `zdx` `title` values: removed `Zscaler Digital Experience API`; retained `Digital Experience API`; current operation distribution `Digital Experience API`=148.
- `zia` `title`: `Zscaler Internet Access API` → `Internet Access API`.
- `zpa` `title`: `Zscaler Private Access API` → `Private Access API`.

### Added operations

- `ai-security` — `GET /v1/assets/agents/{id}` (`ai-security/aisecurity/v1-assets-agents/agents-get-agent`)
- `ai-security` — `GET /v1/assets/agents` (`ai-security/aisecurity/v1-assets-agents/agents-list-agents`)
- `ai-security` — `GET /v1/resources/coderepositories/{id}` (`ai-security/aisecurity/v1-resources-coderepositories/code-repositories-get-code-repository`)
- `ai-security` — `GET /v1/resources/coderepositories` (`ai-security/aisecurity/v1-resources-coderepositories/code-repositories-list-code-repositories`)
- `ai-security` — `GET /v1/resources/datastores/{id}` (`ai-security/aisecurity/v1-resources-datastores/datastores-get-datastore`)
- `ai-security` — `GET /v1/resources/datastores` (`ai-security/aisecurity/v1-resources-datastores/datastores-list-datastores`)
- `ai-security` — `GET /v1/resources/guardrails/{id}` (`ai-security/aisecurity/v1-resources-guardrails/guardrails-get-guardrail`)
- `ai-security` — `GET /v1/resources/guardrails` (`ai-security/aisecurity/v1-resources-guardrails/guardrails-list-guardrails`)
- `ai-security` — `GET /v1/resources/workloads/{id}` (`ai-security/aisecurity/v1-resources-workloads/workloads-get-workload`)
- `ai-security` — `GET /v1/resources/workloads` (`ai-security/aisecurity/v1-resources-workloads/workloads-list-workloads`)
- `urbac` — `POST /v1/auditlog/query` (`urbac/auditlogs/audit-log-resource-search-logs`)
- `urbac` — `POST /v1/roles` (`urbac/roles/urbac-resource-create-role`)
- `urbac` — `DELETE /v1/roles/{roleId}` (`urbac/roles/urbac-resource-delete-role`)
- `urbac` — `GET /v1/roles/{roleId}` (`urbac/roles/urbac-resource-get-role`)
- `urbac` — `POST /v1/roles/query` (`urbac/roles/urbac-resource-get-roles`)
- `urbac` — `PUT /v1/roles/{roleId}` (`urbac/roles/urbac-resource-update-role`)
- `zcell` — `GET /api/v1/customers/{id}/sims/{iccid}/tower-locations` (`zcell/sim-management/sim-resource-get-tower-location-history`)
- `zpa` — `PUT /mgmtconfig/v1/customers/{customerId}/application/federate` (`zpa/federate-applications/federate-application`)
- `zpa` — `GET /mgmtconfig/v1/customers/{customerId}/application/host/{host_id}` (`zpa/federate-applications/get-federated-applications-from-host`)
- `zpa` — `POST /mgmtconfig/v1/customers/{customerId}/tenant-federation/token` (`zpa/partner-federation-provisioning/create-federation-token`)
- `zpa` — `DELETE /mgmtconfig/v1/customers/{customerId}/tenant-federation/{federation_id}` (`zpa/partner-federation-provisioning/delete-provisioning`)
- `zpa` — `GET /mgmtconfig/v1/customers/{customerId}/tenant-federation/partners` (`zpa/partner-federation-provisioning/get-active-federation-partners`)
- `zpa` — `GET /mgmtconfig/v1/customers/{customerId}/tenant-federation` (`zpa/partner-federation-provisioning/get-provisionings`)
- `zpa` — `PUT /mgmtconfig/v1/customers/{customerId}/tenant-federation/approval` (`zpa/partner-federation-provisioning/request-approval`)
- `zpa` — `PUT /mgmtconfig/v1/customers/{customerId}/tenant-federation/{federation_id}/federation-state/{status}` (`zpa/partner-federation-provisioning/update-federation-state`)
- `zpa` — `PUT /mgmtconfig/v1/customers/{customerId}/tenant-federation/{federation_id}/notes` (`zpa/partner-federation-provisioning/update-notes`)
- `zpa` — `PUT /mgmtconfig/v1/customers/{customerId}/tenant-federation/{federation_id}/provisioning-state/{status}` (`zpa/partner-federation-provisioning/update-provisioning-state`)
- `zpa` — `POST /mgmtconfig/v1/customers/{customerId}/tenant-federation/token/verify` (`zpa/partner-federation-provisioning/verify-token`)
- `zpa` — `GET /mgmtconfig/v1/customers/{customerId}/policySet/rules/policyType/GLOBAL_POLICY/guest/{guest_id}` (`zpa/policies-for-b2b-federation/get-partner-policy-rules-on-federated-apps`)

### Per-operation removals

- `ai-security` — `GET /v1/assets/datastores/{id}` (`ai-security/aisecurity/v1-assets-datastores/datastores-get-datastore`)
- `ai-security` — `GET /v1/assets/datastores` (`ai-security/aisecurity/v1-assets-datastores/datastores-list-datastores`)
- `ai-security` — `GET /v1/assets/workloads/{id}` (`ai-security/aisecurity/v1-assets-workloads/workloads-get-workload`)
- `ai-security` — `GET /v1/assets/workloads` (`ai-security/aisecurity/v1-assets-workloads/workloads-list-workloads`)
- `zcc` — `DELETE /papi/cred/v1/delete` (`zcc/credential-controller/deletes-api-credentials-for-the-company`)
- `zcc` — `GET /papi/cred/v1/getList` (`zcc/credential-controller/gets-the-list-of-api-credentials`)
- `zcc` — `POST /papi/cred/v1/save` (`zcc/credential-controller/saves-api-credentials-for-the-company`)
- `zcc` — `PUT /papi/cred/v1/update` (`zcc/credential-controller/updates-api-credentials-for-the-company`)
- `zcell` — `GET /api/v1/audit/metadata` (`zcell/audit-data-handling/audit-resource-get-audit-metadata`)
- `zia` — `POST /zscsb/submit` (`zia/sandbox-submission-api/submit-file`)
- `zia` — `POST /zscsb/discan` (`zia/sandbox-submission-api/submit-file-for-scan`)

### Route corrections

- `aiguard` / `aiguard/detection-policies/detections-policy-resource-disable-detections-policy`: `POST /v1/detections/policies/{id}/disable` → `POST /v1/detections/policies/{id}:disable`
- `aiguard` / `aiguard/detection-policies/detections-policy-resource-enable-detections-policy`: `POST /v1/detections/policies/{id}/enable` → `POST /v1/detections/policies/{id}:enable`
- `aiguard` / `aiguard/detection-policies/detections-policy-resource-referential-check-detections-policy`: `GET /v1/detections/policies/{id}/referential-check` → `GET /v1/detections/policies/{id}:referential-check`
- `aiguard` / `aiguard/llm-application-credentials/llm-application-credentials-resource-referential-check-application-credentials`: `GET /v1/llm-application-credentials/{id}/referential-check` → `GET /v1/llm-application-credentials/{id}:referential-check`
- `aiguard` / `aiguard/llm-application-credentials/llm-application-credentials-resource-regenerate-llm-application-credentials`: `POST /v1/llm-application-credentials/{id}/regenerate` → `POST /v1/llm-application-credentials/{id}:regenerate`
- `aiguard` / `aiguard/llm-applications/llm-application-resource-referential-check-application`: `GET /v1/llm-applications/{id}/referential-check` → `GET /v1/llm-applications/{id}:referential-check`
- `aiguard` / `aiguard/llm-provider-credentials/llm-provider-credentials-resource-referential-check-provider-credentials`: `GET /v1/llm-provider-credentials/{id}/referential-check` → `GET /v1/llm-provider-credentials/{id}:referential-check`
- `aiguard` / `aiguard/llm-providers/llm-provider-resource-referential-check-provider`: `GET /v1/llm-providers/{id}/referential-check` → `GET /v1/llm-providers/{id}:referential-check`
- `event-monitoring` / `event-monitoring/event-monitoring-subscriptions/subscription-resource-verify-sns-topic-access`: `POST /subscriptions/channels/sns/verify` → `POST /subscriptions/channels/sns:verify`
- `zid` / `zid/users/users-ops-mfa`: `POST /users/{id}/setskipmfa` → `POST /users/{id}:setskipmfa`
- `zid` / `zid/users/users-ops-reset-password`: `POST /users/{id}/resetpassword` → `POST /users/{id}:resetpassword`
- `zid` / `zid/users/users-ops-update-password`: `PUT /users/{id}/updatepassword` → `PUT /users/{id}:updatepassword`

### Schema changes

- `ai-security` / `ai-security/aisecurity/v1-assets-identities/identities-get-identity` — `response_schema` +22 −1 Δ2; schema titles Δ11
  - `response_schema` added: `access_categories`, `access_level`, `account_id`, `asset_risk`, `asset_risk[].key`, `asset_risk[].value`, `cloud_discovered_at`, `cloud_event_at`, `cloud_org_id`, `has_metadata`, `sanction_rule_id`, `sanction_rule_name`, `sanction_status`, `service_principal_details`, `service_principal_details.oauth2_permission_grants`, `service_principal_details.owners`, `service_principal_details.owners[].owner_email`, `service_principal_details.owners[].owner_name`, `service_principal_details.owners[].owner_type`, `source_cloud_type`
  - `response_schema` removed: `access_category`
  - `response_schema` metadata changed: `environment`, `risk_level`
- `ai-security` / `ai-security/aisecurity/v1-assets-identities/identities-list-identities` — `query_params` +6 −0 Δ1; `response_schema` +8 −1 Δ2; schema titles Δ3
  - `query_params` added: `access_category`, `access_level`, `asset_risk`, `sanction_status`, `source_type`, `target_environment`
  - `query_params` metadata changed: `environment`
  - `response_schema` added: `data[].access_categories`, `data[].access_level`, `data[].asset_risk`, `data[].asset_risk[].key`, `data[].asset_risk[].value`, `data[].sanction_status`, `data[].target_account_ids`, `data[].target_environments`
  - `response_schema` removed: `data[].access_category`
  - `response_schema` metadata changed: `data[].environment`, `data[].risk_level`
- `ai-security` / `ai-security/aisecurity/v1-assets-mcpservers/mcp-servers-get-mcp-server` — `response_schema` +25 −3 Δ2; schema titles Δ14
  - `response_schema` added: `account_name`, `asset_risk`, `cloud_org_id`, `connections`, `connections[].connection_id`, `connections[].connection_name`, `connections[].connector_id`, `connections[].status_code`, `created_at`, `file_system_config`, `file_system_config.delete_operations`, `file_system_config.paths_accessed`, `file_system_config.read_operations`, `file_system_config.traverses_directories`, `file_system_config.uses_absolute_paths`, `file_system_config.write_operations`, `network_config`, `network_config.external_domains`, `network_config.http_requests`, `network_config.localhost_only`
  - `response_schema` removed: `associated_source`, `associated_source_type`, `risk_indicators`
  - `response_schema` metadata changed: `environment`, `risk_level`
- `ai-security` / `ai-security/aisecurity/v1-assets-mcpservers/mcp-servers-get-mcp-server-tools` — `query_params` +4 −0 Δ0
  - `query_params` added: `code_execution`, `file_access`, `network_access`, `process_access`
- `ai-security` / `ai-security/aisecurity/v1-assets-mcpservers/mcp-servers-list-mcp-servers` — `query_params` +2 −0 Δ2; `response_schema` +1 −3 Δ2; schema titles Δ1
  - `query_params` added: `asset_risk`, `source_type`
  - `query_params` metadata changed: `environment`, `risk_level`
  - `response_schema` added: `data[].asset_risk`
  - `response_schema` removed: `data[].associated_source`, `data[].associated_source_type`, `data[].risk_indicators`
  - `response_schema` metadata changed: `data[].environment`, `data[].risk_level`
- `ai-security` / `ai-security/aisecurity/v1-issues/issues-get-issue` — `response_schema` +1 −1 Δ1; schema titles Δ2
  - `response_schema` added: `risk_level`
  - `response_schema` removed: `severity`
  - `response_schema` metadata changed: `environment`
- `ai-security` / `ai-security/aisecurity/v1-issues/issues-list-issues` — `query_params` +4 −0 Δ2; `response_schema` +1 −1 Δ1; schema titles Δ3
  - `query_params` added: `policy_category`, `policy_id`, `region`, `risk_level`
  - `query_params` metadata changed: `environment`, `severity`
  - `response_schema` added: `data[].risk_level`
  - `response_schema` removed: `data[].severity`
  - `response_schema` metadata changed: `data[].environment`
- `zcell` / `zcell/network-events/network-event-resource-search-network-events` — `response_schema` +8 −0 Δ0
  - `response_schema` added: `content[].apnUsername`, `content[].imei`, `content[].location`, `content[].msisdn`, `content[].sessionTime`, `content[].status`, `content[].subStatus`, `content[].vplmnTadig`
- `zcell` / `zcell/sim-location-groups/sim-location-group-resource-get-all-sim-location-groups` — `query_params` +0 −0 Δ2
  - `query_params` metadata changed: `sortBy`, `sortDir`
- `zcell` / `zcell/customer-management/customer-resource-get-by-zs-tid` — `response_schema` +0 −0 Δ1; schema titles Δ12
  - `response_schema` metadata changed: `mvnoIds[].type`
- `zcell` / `zcell/anomaly-policies/anomaly-policy-resource-get-all-anomaly-policies` — `query_params` +0 −0 Δ2
  - `query_params` metadata changed: `sortBy`, `sortDir`
- `zcell` / `zcell/anomaly-policies/anomaly-policy-resource-get-violation-details-by-iccid` — `query_params` +0 −0 Δ2
  - `query_params` metadata changed: `sortBy`, `sortDir`
- `zcell` / `zcell/tag-management/tag-resource-get-all-tags` — `query_params` +0 −0 Δ2; `response_schema` +0 −1 Δ0
  - `query_params` metadata changed: `sortBy`, `sortDir`
  - `response_schema` removed: `content[].mvnoCustomerId`
- `zcell` / `zcell/sim-management/sim-resource-lock-sims` — `request_body` +1 −0 Δ1
  - `request_body` added: `simLockDetails[].locked`
  - `request_body` metadata changed: `dataAuthorize`
- `zcell` / `zcell/audit-logs/audit-resource-get-audit-log` — `query_params` +0 −0 Δ2
  - `query_params` metadata changed: `sortBy`, `sortDir`
- `zcell` / `zcell/sim-management/sim-resource-download-sims-csv` — `query_params` +0 −0 Δ2
  - `query_params` metadata changed: `sortBy`, `sortDir`
- `zcell` / `zcell/sim-management/sim-resource-get-all-sims` — `query_params` +0 −0 Δ2
  - `query_params` metadata changed: `sortBy`, `sortDir`
- `zpa` / `zpa/app-connector-group/gets-all-configured-app-connector-groups-for-the-specified-customer` — `query_params` +1 −0 Δ0
  - `query_params` added: `microtenantId`
- `zpa` / `zpa/nonce/adds-a-new-provisioning-key-for-the-specified-customer` — `query_params` +1 −0 Δ0
  - `query_params` added: `microtenantId`
- `zpa` / `zpa/nonce/deletes-the-provisioning-key-for-the-specified-id` — `query_params` +1 −0 Δ0
  - `query_params` added: `microtenantId`
- `zpa` / `zpa/nonce/gets-details-of-all-configured-provisioning-keys-for-the-specified-customer` — `query_params` +1 −0 Δ0
  - `query_params` added: `microtenantId`
- `zpa` / `zpa/nonce/gets-details-of-the-provisioning-key-for-the-specified-id` — `query_params` +1 −0 Δ0
  - `query_params` added: `microtenantId`
- `zpa` / `zpa/nonce/updates-the-provisioning-key-details-for-the-specified-id` — `query_params` +1 −0 Δ0
  - `query_params` added: `microtenantId`
- `zpa` / `zpa/service-edge-group/get-private-broker-groups` — `query_params` +1 −0 Δ0
  - `query_params` added: `microtenantId`
- `zpa` / `zpa/version-profile/get-all-version-profiles-visibile-by-customer-id` — `query_params` +3 −0 Δ0
  - `query_params` added: `page`, `pagesize`, `search`

## Field Totals

### `path_params`

- Existing top-level fields across common ops: 1012
- Blob top-level fields across common ops: 1012
- Blob flattened fields across common ops: 1012
- Blob nested fields across common ops: 0
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 0

### `query_params`

- Existing top-level fields across common ops: 1393
- Blob top-level fields across common ops: 1419
- Blob flattened fields across common ops: 1419
- Blob nested fields across common ops: 0
- Blob top-level fields new vs committed contract: 26
- Committed contract top-level fields missing from blob: 0

### `request_body`

- Existing top-level fields across common ops: 4853
- Blob top-level fields across common ops: 4853
- Blob flattened fields across common ops: 17145
- Blob nested fields across common ops: 12330
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 0

### `response_schema`

- Existing top-level fields across common ops: 11737
- Blob top-level fields across common ops: 11759
- Blob flattened fields across common ops: 41222
- Blob nested fields across common ops: 32635
- Blob top-level fields new vs committed contract: 27
- Committed contract top-level fields missing from blob: 5

## Live-Only Samples

### `ai-security`
- `ai-security/aisecurity/v1-assets-agents/agents-get-agent`
- `ai-security/aisecurity/v1-assets-agents/agents-list-agents`
- `ai-security/aisecurity/v1-resources-coderepositories/code-repositories-get-code-repository`
- `ai-security/aisecurity/v1-resources-coderepositories/code-repositories-list-code-repositories`
- `ai-security/aisecurity/v1-resources-datastores/datastores-get-datastore`
- `ai-security/aisecurity/v1-resources-datastores/datastores-list-datastores`
- `ai-security/aisecurity/v1-resources-guardrails/guardrails-get-guardrail`
- `ai-security/aisecurity/v1-resources-guardrails/guardrails-list-guardrails`
- `ai-security/aisecurity/v1-resources-workloads/workloads-get-workload`
- `ai-security/aisecurity/v1-resources-workloads/workloads-list-workloads`

### `urbac`
- `urbac/auditlogs/audit-log-resource-search-logs`
- `urbac/roles/urbac-resource-create-role`
- `urbac/roles/urbac-resource-delete-role`
- `urbac/roles/urbac-resource-get-role`
- `urbac/roles/urbac-resource-get-roles`
- `urbac/roles/urbac-resource-update-role`

### `zcell`
- `zcell/anomaly-policies/anomaly-policy-resource-create-policy`
- `zcell/anomaly-policies/anomaly-policy-resource-delete-policy`
- `zcell/anomaly-policies/anomaly-policy-resource-get-all-anomaly-policies`
- `zcell/anomaly-policies/anomaly-policy-resource-get-anomaly-policy-logs`
- `zcell/anomaly-policies/anomaly-policy-resource-get-violated-iccids`
- `zcell/anomaly-policies/anomaly-policy-resource-get-violation-details-by-iccid`
- `zcell/anomaly-policies/anomaly-policy-resource-update-policy`
- `zcell/anomaly-policies/anomaly-policy-resource-update-policy-status`
- `zcell/audit-logs/audit-resource-get-audit-log`
- `zcell/customer-management/customer-resource-activate-customer`
- `zcell/customer-management/customer-resource-get-by-zs-tid`
- `zcell/customer-regions/region-resource-deploy-regions`
- `zcell/customer-regions/region-resource-get-assigned-regions-by-zs-tid`
- `zcell/customer-regions/region-resource-get-region-operational-status-by-zs-tid`
- `zcell/sim-management/sim-resource-assign-esim`
- `zcell/sim-management/sim-resource-assign-tag`
- `zcell/sim-management/sim-resource-download-sims-csv`
- `zcell/sim-management/sim-resource-get-all-sims`
- `zcell/sim-management/sim-resource-get-sim-details-by-icc-id`
- `zcell/sim-management/sim-resource-get-tower-location-history`

### `zpa`
- `zpa/federate-applications/federate-application`
- `zpa/federate-applications/get-federated-applications-from-host`
- `zpa/partner-federation-provisioning/create-federation-token`
- `zpa/partner-federation-provisioning/delete-provisioning`
- `zpa/partner-federation-provisioning/get-active-federation-partners`
- `zpa/partner-federation-provisioning/get-provisionings`
- `zpa/partner-federation-provisioning/request-approval`
- `zpa/partner-federation-provisioning/update-federation-state`
- `zpa/partner-federation-provisioning/update-notes`
- `zpa/partner-federation-provisioning/update-provisioning-state`
- `zpa/partner-federation-provisioning/verify-token`
- `zpa/policies-for-b2b-federation/get-partner-policy-rules-on-federated-apps`

## Loose Method/Path-Only Samples

### `ai-security`
- Live-only loose signatures:
  - `GET /v1/assets/agents`
  - `GET /v1/assets/agents/{}`
  - `GET /v1/resources/coderepositories`
  - `GET /v1/resources/coderepositories/{}`
  - `GET /v1/resources/datastores`
  - `GET /v1/resources/datastores/{}`
  - `GET /v1/resources/guardrails`
  - `GET /v1/resources/guardrails/{}`
  - `GET /v1/resources/workloads`
  - `GET /v1/resources/workloads/{}`
- Existing-only loose signatures:
  - `GET /v1/assets/datastores`
  - `GET /v1/assets/datastores/{}`
  - `GET /v1/assets/workloads`
  - `GET /v1/assets/workloads/{}`

### `aiguard`
- Live-only loose signatures:
  - `GET /detections/policies/{}-check`
  - `GET /llm-application-credentials/{}-check`
  - `GET /llm-applications/{}-check`
  - `GET /llm-provider-credentials/{}-check`
  - `GET /llm-providers/{}-check`
  - `POST /detections/policies/{}`
  - `POST /llm-application-credentials/{}`
- Existing-only loose signatures:
  - `GET /detections/policies/{}/referential-check`
  - `GET /llm-application-credentials/{}/referential-check`
  - `GET /llm-applications/{}/referential-check`
  - `GET /llm-provider-credentials/{}/referential-check`
  - `GET /llm-providers/{}/referential-check`
  - `POST /detections/policies/{}/disable`
  - `POST /detections/policies/{}/enable`
  - `POST /llm-application-credentials/{}/regenerate`

### `event-monitoring`
- Live-only loose signatures:
  - `POST /subscriptions/channels/sns{}`
- Existing-only loose signatures:
  - `POST /subscriptions/channels/sns/verify`

### `urbac`
- Live-only loose signatures:
  - `DELETE /v1/roles/{}`
  - `GET /v1/roles/{}`
  - `POST /v1/auditlog/query`
  - `POST /v1/roles`
  - `POST /v1/roles/query`
  - `PUT /v1/roles/{}`

### `zcc`
- Existing-only loose signatures:
  - `DELETE /papi/cred/v1/delete`
  - `GET /papi/cred/v1/getList`
  - `POST /papi/cred/v1/save`
  - `PUT /papi/cred/v1/update`

### `zcell`
- Live-only loose signatures:
  - `GET /api/v1/customers/{}/sims/{}/tower-locations`
- Existing-only loose signatures:
  - `GET /api/v1/audit/metadata`

### `zia`
- Existing-only loose signatures:
  - `POST /zscsb/discan`
  - `POST /zscsb/submit`

### `zid`
- Live-only loose signatures:
  - `POST /users/{}`
- Existing-only loose signatures:
  - `POST /users/{}/resetpassword`
  - `POST /users/{}/setskipmfa`
  - `PUT /users/{}/updatepassword`

### `zpa`
- Live-only loose signatures:
  - `DELETE /mgmtconfig/v1/customers/{}/tenant-federation/{}`
  - `GET /mgmtconfig/v1/customers/{}/application/host/{}`
  - `GET /mgmtconfig/v1/customers/{}/policySet/rules/policyType/GLOBAL_POLICY/guest/{}`
  - `GET /mgmtconfig/v1/customers/{}/tenant-federation`
  - `GET /mgmtconfig/v1/customers/{}/tenant-federation/partners`
  - `POST /mgmtconfig/v1/customers/{}/tenant-federation/token`
  - `POST /mgmtconfig/v1/customers/{}/tenant-federation/token/verify`
  - `PUT /mgmtconfig/v1/customers/{}/application/federate`
  - `PUT /mgmtconfig/v1/customers/{}/tenant-federation/approval`
  - `PUT /mgmtconfig/v1/customers/{}/tenant-federation/{}/federation-state/{}`

## Nested Schema Examples

### `ai-security/airedteaming/aiapp/ai-app-resource-create-ai-app` / `request_body`
- Blob nested fields (29):
  - `connection.brokerId`
  - `connection.config`
  - `connection.type`
  - `settings.availability`
  - `settings.concurrentRequests`
  - `settings.description`
  - `settings.environment`
  - `settings.language`
  - `settings.maxInputLength`
  - `settings.multiStepAttacks`
  - `settings.name`
  - `settings.predefinedResponses`

### `ai-security/airedteaming/aiapp/ai-app-resource-create-ai-app` / `response_schema`
- Blob nested fields (12):
  - `lifecycleStages[].completed`
  - `lifecycleStages[].date`
  - `lifecycleStages[].params`
  - `lifecycleStages[].params.generatedPolicyId`
  - `lifecycleStages[].params.hardeningAppliedOn`
  - `lifecycleStages[].params.policyAppliedOn`
  - `lifecycleStages[].params.promptHardeningId`
  - `lifecycleStages[].params.testRunId`
  - `lifecycleStages[].type`
  - `ragProcessingStatus.error`
  - `ragProcessingStatus.id`
  - `ragProcessingStatus.progress`

### `ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app` / `response_schema`
- Blob nested fields (12):
  - `lifecycleStages[].completed`
  - `lifecycleStages[].date`
  - `lifecycleStages[].params`
  - `lifecycleStages[].params.generatedPolicyId`
  - `lifecycleStages[].params.hardeningAppliedOn`
  - `lifecycleStages[].params.policyAppliedOn`
  - `lifecycleStages[].params.promptHardeningId`
  - `lifecycleStages[].params.testRunId`
  - `lifecycleStages[].type`
  - `ragProcessingStatus.error`
  - `ragProcessingStatus.id`
  - `ragProcessingStatus.progress`

### `ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app-latest-probe-runs` / `response_schema`
- Blob nested fields (15):
  - `[].probeCategoryId`
  - `[].probeCategoryName`
  - `[].probes`
  - `[].probes[].errorCount`
  - `[].probes[].executionDate`
  - `[].probes[].failedCount`
  - `[].probes[].isAiAnalyzed`
  - `[].probes[].passedCount`
  - `[].probes[].probeId`
  - `[].probes[].probeName`
  - `[].probes[].scanProbeRunId`
  - `[].probes[].scanRunId`

### `ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app-risk-level-timeseries` / `response_schema`
- Blob nested fields (2):
  - `[].date`
  - `[].riskScore`

### `ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app-settings` / `response_schema`
- Blob nested fields (36):
  - `businessUnit.dspmBusinessUnitId`
  - `businessUnit.isActive`
  - `businessUnit.name`
  - `businessUnit.workspaceId`
  - `connection.brokerId`
  - `connection.config`
  - `connection.type`
  - `ragProcessingStatus.error`
  - `ragProcessingStatus.id`
  - `ragProcessingStatus.progress`
  - `settings.availability`
  - `settings.concurrentRequests`

### `ai-security/airedteaming/aiapp/ai-app-resource-list-ai-app-available-probes` / `response_schema`
- Blob nested fields (2):
  - `[].id`
  - `[].name`

### `ai-security/airedteaming/aiapp/ai-app-resource-list-ai-app-test-run-available-probes` / `response_schema`
- Blob nested fields (6):
  - `[].id`
  - `[].name`
  - `[].probeCount`
  - `[].probes`
  - `[].probes[].id`
  - `[].probes[].name`

### `ai-security/airedteaming/aiapp/ai-app-resource-list-ai-app-test-runs` / `request_body`
- Blob nested fields (6):
  - `filters[].column`
  - `filters[].operator`
  - `filters[].value`
  - `filters[].values`
  - `sorts[].column`
  - `sorts[].direction`

### `ai-security/airedteaming/aiapp/ai-app-resource-list-ai-app-test-runs` / `response_schema`
- Blob nested fields (14):
  - `items[].assetId`
  - `items[].assetName`
  - `items[].businessUnit`
  - `items[].id`
  - `items[].lastRunTimestamp`
  - `items[].launchedBy`
  - `items[].name`
  - `items[].probes`
  - `items[].progress`
  - `items[].resultsError`
  - `items[].resultsFailed`
  - `items[].resultsPassed`

### `ai-security/airedteaming/aiapp/ai-app-resource-list-ai-apps` / `request_body`
- Blob nested fields (6):
  - `filters[].column`
  - `filters[].operator`
  - `filters[].value`
  - `filters[].values`
  - `sorts[].column`
  - `sorts[].direction`

### `ai-security/airedteaming/aiapp/ai-app-resource-list-ai-apps` / `response_schema`
- Blob nested fields (16):
  - `items[].availability`
  - `items[].businessUnitName`
  - `items[].connectionType`
  - `items[].dateCreated`
  - `items[].environment`
  - `items[].hardenedPrompt`
  - `items[].healthScore`
  - `items[].id`
  - `items[].lastTestRunDate`
  - `items[].lastTestRunId`
  - `items[].lifecycle`
  - `items[].lifecycleUpdatedAt`

### `ai-security/airedteaming/aiapp/ai-app-resource-update-ai-app` / `request_body`
- Blob nested fields (29):
  - `connection.brokerId`
  - `connection.config`
  - `connection.type`
  - `settings.availability`
  - `settings.concurrentRequests`
  - `settings.description`
  - `settings.environment`
  - `settings.language`
  - `settings.maxInputLength`
  - `settings.multiStepAttacks`
  - `settings.name`
  - `settings.predefinedResponses`

### `ai-security/airedteaming/aiapp/ai-app-resource-update-ai-app` / `response_schema`
- Blob nested fields (12):
  - `lifecycleStages[].completed`
  - `lifecycleStages[].date`
  - `lifecycleStages[].params`
  - `lifecycleStages[].params.generatedPolicyId`
  - `lifecycleStages[].params.hardeningAppliedOn`
  - `lifecycleStages[].params.policyAppliedOn`
  - `lifecycleStages[].params.promptHardeningId`
  - `lifecycleStages[].params.testRunId`
  - `lifecycleStages[].type`
  - `ragProcessingStatus.error`
  - `ragProcessingStatus.id`
  - `ragProcessingStatus.progress`

### `ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-agentforce-integration` / `response_schema`
- Blob nested fields (3):
  - `errorDetails[].title`
  - `errorDetails[].type`
  - `errorDetails[].value`
