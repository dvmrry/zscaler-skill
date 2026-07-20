# Automate Docusaurus Snapshot

Captured at: `2026-07-20T13:02:24.539188+00:00`
Main JS: `https://automate.zscaler.com/assets/js/main.f11f43c6.js`
Runtime JS: `https://automate.zscaler.com/assets/js/runtime~main.a3290751.js`

## Summary

- Routes discovered: **1207**
- API MDX route candidates matched: **1207 / 1207**
- API blobs decoded: **1207**
- Decode failures: **0**
- Existing committed contract ops: **1169**
- Live-only route keys: **56**
- Existing-only route keys: **18**
- Live-only loose method/path signatures: **52**
- Existing-only loose method/path signatures: **11**

## Product Counts

| product | live blobs | existing scrape | route-key common ops | loose path common sigs | live-only route keys | existing-only route keys | request nested | response nested |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `ai-security` | 11 | 0 | 0 | 0 | 11 | 0 | 0 | 0 |
| `aiguard` | 47 | 45 | 45 | 37 | 2 | 0 | 24 | 112 |
| `bi` | 10 | 10 | 10 | 10 | 0 | 0 | 48 | 116 |
| `easm` | 11 | 11 | 11 | 11 | 0 | 0 | 0 | 79 |
| `event-monitoring` | 15 | 10 | 5 | 10 | 10 | 5 | 22 | 64 |
| `zcc` | 54 | 54 | 54 | 54 | 0 | 0 | 481 | 568 |
| `zcell` | 36 | 36 | 36 | 36 | 0 | 0 | 14 | 189 |
| `zcloudconnector` | 165 | 165 | 165 | 165 | 0 | 0 | 2358 | 5678 |
| `zdx` | 148 | 148 | 148 | 129 | 0 | 0 | 562 | 5947 |
| `zia` | 471 | 471 | 471 | 471 | 0 | 0 | 3249 | 9699 |
| `zid` | 31 | 31 | 31 | 28 | 0 | 0 | 24 | 265 |
| `zpa` | 208 | 188 | 175 | 185 | 33 | 13 | 5386 | 9068 |

## Contract Change Radar

Route-key renames are paired by method/path before additions and removals are counted. Schema changes compare flattened field names plus type, required, readonly, enum, and response status metadata.

| product | matched | added ops | removed ops | route changes | route-key changes | schema-changed ops | request +/−/Δ | response +/−/Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `ai-security` | 0 | 11 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `aiguard` | 45 | 2 | 0 | 8 | 0 | 18 | 0/8/2 | 14/52/5 |
| `bi` | 10 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `easm` | 11 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `event-monitoring` | 10 | 5 | 0 | 0 | 5 | 4 | 4/0/2 | 12/0/4 |
| `zcc` | 54 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zcell` | 36 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zcloudconnector` | 165 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zdx` | 148 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zia` | 471 | 0 | 0 | 0 | 0 | 6 | 0/0/0 | 0/0/0 |
| `zid` | 31 | 0 | 0 | 3 | 0 | 3 | 0/0/0 | 0/0/0 |
| `zpa` | 185 | 23 | 3 | 0 | 10 | 10 | 10/32/6 | 30/1250/29 |

### Added operations

- `ai-security` — `GET /v1/assets/datastores/{id}` (`ai-security/aisecurity/datastores/datastores-get-datastore`)
- `ai-security` — `GET /v1/assets/datastores` (`ai-security/aisecurity/datastores/datastores-list-datastores`)
- `ai-security` — `GET /v1/assets/identities/{id}` (`ai-security/aisecurity/identities/identities-get-identity`)
- `ai-security` — `GET /v1/assets/identities` (`ai-security/aisecurity/identities/identities-list-identities`)
- `ai-security` — `GET /v1/issues/{id}` (`ai-security/aisecurity/issues/issues-get-issue`)
- `ai-security` — `GET /v1/issues` (`ai-security/aisecurity/issues/issues-list-issues`)
- `ai-security` — `GET /v1/assets/mcpservers/{id}` (`ai-security/aisecurity/mcp-servers/mcp-servers-get-mcp-server`)
- `ai-security` — `GET /v1/assets/mcpservers/{id}/tools` (`ai-security/aisecurity/mcp-servers/mcp-servers-get-mcp-server-tools`)
- `ai-security` — `GET /v1/assets/mcpservers` (`ai-security/aisecurity/mcp-servers/mcp-servers-list-mcp-servers`)
- `ai-security` — `GET /v1/assets/workloads/{id}` (`ai-security/aisecurity/workloads/workloads-get-workload`)
- `ai-security` — `GET /v1/assets/workloads` (`ai-security/aisecurity/workloads/workloads-list-workloads`)
- `aiguard` — `GET /v1/llm-provider-types/{type}` (`aiguard/llm-providers/llm-provider-type-resource-get-llm-provider-type`)
- `aiguard` — `GET /v1/llm-provider-types` (`aiguard/llm-providers/llm-provider-type-resource-list-llm-provider-types`)
- `event-monitoring` — `GET /subscriptions/channels/email` (`event-monitoring/event-monitoring-subscriptions/subscription-resource-get-email-channel`)
- `event-monitoring` — `GET /subscriptions/channels/sns` (`event-monitoring/event-monitoring-subscriptions/subscription-resource-get-sns-channel`)
- `event-monitoring` — `GET /subscriptions/channels/webhook` (`event-monitoring/event-monitoring-subscriptions/subscription-resource-get-webhook-channel`)
- `event-monitoring` — `GET /subscriptions/channels` (`event-monitoring/event-monitoring-subscriptions/subscription-resource-list-channels`)
- `event-monitoring` — `POST /subscriptions/channels/sns/verify` (`event-monitoring/event-monitoring-subscriptions/subscription-resource-verify-sns-topic-access`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/browserAccessGroup` (`zpa/browser-access-group/get-browser-access-groups`)
- `zpa` — `POST /mgmtconfig/v1/admin/customers/{customerId}/businessContinuitySettings` (`zpa/business-continuity-settings/create-business-continuity-settings`)
- `zpa` — `DELETE /mgmtconfig/v1/admin/customers/{customerId}/businessContinuitySettings/{id}` (`zpa/business-continuity-settings/delete-business-continuity-settings`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/businessContinuitySettings/certificate` (`zpa/business-continuity-settings/download-sp-certificate`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/businessContinuitySettings/metadata` (`zpa/business-continuity-settings/download-sp-metadata`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/businessContinuitySettings` (`zpa/business-continuity-settings/get-business-continuity-settings`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/businessContinuitySettings/{id}` (`zpa/business-continuity-settings/get-business-continuity-settings-by-id`)
- `zpa` — `PUT /mgmtconfig/v1/admin/customers/{customerId}/businessContinuitySettings/{id}` (`zpa/business-continuity-settings/update-business-continuity-settings`)
- `zpa` — `POST /mgmtconfig/v1/admin/customers/{customerId}/privateCloudControllerGroup` (`zpa/private-cloud-controller-group/create-private-cloud-controller-group`)
- `zpa` — `DELETE /mgmtconfig/v1/admin/customers/{customerId}/privateCloudControllerGroup/{privateCloudControllerGroupId}` (`zpa/private-cloud-controller-group/delete-private-cloud-controller-group`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/privateCloudControllerGroup` (`zpa/private-cloud-controller-group/get-all-private-cloud-controller-groups`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/privateCloudControllerGroup/{privateCloudControllerGroupId}` (`zpa/private-cloud-controller-group/get-private-cloud-controller-group-by-id`)
- `zpa` — `PUT /mgmtconfig/v1/admin/customers/{customerId}/privateCloudControllerGroup/{privateCloudControllerGroupId}` (`zpa/private-cloud-controller-group/update-private-cloud-controller-group`)
- `zpa` — `DELETE /mgmtconfig/v1/admin/customers/{customerId}/privateCloudController/{privateCloudControllerId}` (`zpa/private-cloud-controller/delete-private-cloud-controller`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/privateCloudController` (`zpa/private-cloud-controller/get-all-private-cloud-controllers`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/privateCloudController/{privateCloudControllerId}` (`zpa/private-cloud-controller/get-private-cloud-controller-by-id`)
- `zpa` — `PUT /mgmtconfig/v1/admin/customers/{customerId}/privateCloudController/{privateCloudControllerId}` (`zpa/private-cloud-controller/update-private-cloud-controller`)
- `zpa` — `POST /mgmtconfig/v1/admin/customers/{customerId}/privateCloud` (`zpa/site/create-site`)
- `zpa` — `DELETE /mgmtconfig/v1/admin/customers/{customerId}/privateCloud/{privateCloudId}` (`zpa/site/delete-site`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/privateCloud` (`zpa/site/get-all-sites`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/privateCloud/{privateCloudId}` (`zpa/site/get-site-by-id`)
- `zpa` — `PUT /mgmtconfig/v1/admin/customers/{customerId}/privateCloud/{privateCloudId}` (`zpa/site/update-site`)
- `zpa` — `GET /mgmtconfig/v1/admin/customers/{customerId}/versionProfile` (`zpa/version-profile/get-version-profiles`)

### Removed operations

- `zpa` — `POST /mgmtconfig/v1/admin/customers/{customerId}/appConnectorGroup` (`zpa/app-connector-group-management/adds-a-new-app-connector-group-for-the-specified-customer`)
- `zpa` — `POST /mgmtconfig/v2/admin/customers/{customerId}/lssConfig` (`zpa/log-streaming-service-lss-configuration/add-a-new-lss-configuration-for-the-specified-customer`)
- `zpa` — `POST /mgmtconfig/v1/admin/customers/{customerId}/serviceEdgeGroup` (`zpa/private-service-edge-group-management/add-private-broker-group`)

### Route corrections

- `aiguard` / `aiguard/detection-policies/detections-policy-resource-disable-detections-policy`: `POST /v1/detections/policies/{id}{disable}` → `POST /v1/detections/policies/{id}/disable`
- `aiguard` / `aiguard/detection-policies/detections-policy-resource-enable-detections-policy`: `POST /v1/detections/policies/{id}{enable}` → `POST /v1/detections/policies/{id}/enable`
- `aiguard` / `aiguard/detection-policies/detections-policy-resource-referential-check-detections-policy`: `GET /v1/detections/policies/{id}{referential}-check` → `GET /v1/detections/policies/{id}/referential-check`
- `aiguard` / `aiguard/llm-application-credentials/llm-application-credentials-resource-referential-check-application-credentials`: `GET /v1/llm-application-credentials/{id}{referential}-check` → `GET /v1/llm-application-credentials/{id}/referential-check`
- `aiguard` / `aiguard/llm-application-credentials/llm-application-credentials-resource-regenerate-llm-application-credentials`: `POST /v1/llm-application-credentials/{id}{regenerate}` → `POST /v1/llm-application-credentials/{id}/regenerate`
- `aiguard` / `aiguard/llm-applications/llm-application-resource-referential-check-application`: `GET /v1/llm-applications/{id}{referential}-check` → `GET /v1/llm-applications/{id}/referential-check`
- `aiguard` / `aiguard/llm-provider-credentials/llm-provider-credentials-resource-referential-check-provider-credentials`: `GET /v1/llm-provider-credentials/{id}{referential}-check` → `GET /v1/llm-provider-credentials/{id}/referential-check`
- `aiguard` / `aiguard/llm-providers/llm-provider-resource-referential-check-provider`: `GET /v1/llm-providers/{id}{referential}-check` → `GET /v1/llm-providers/{id}/referential-check`
- `zid` / `zid/users/users-ops-mfa`: `POST /users/{id}{setskipmfa}` → `POST /users/{id}/setskipmfa`
- `zid` / `zid/users/users-ops-reset-password`: `POST /users/{id}{resetpassword}` → `POST /users/{id}/resetpassword`
- `zid` / `zid/users/users-ops-update-password`: `PUT /users/{id}{updatepassword}` → `PUT /users/{id}/updatepassword`

### Schema changes

- `aiguard` / `aiguard/detection-policies/detections-policy-resource-disable-detections-policy` — `path_params` +0 −1 Δ0; `response_schema` +7 −16 Δ0
  - `path_params` removed: `disable`
  - `response_schema` added: `enabled`, `matchRules`, `matchRules[].enabled`, `matchRules[].id`, `matchRules[].name`, `policyId`, `updatedCount`
  - `response_schema` removed: `createTimeMillis`, `description`, `id`, `inputDetectorPolicies`, `inputDetectorPolicies[].configuration`, `inputDetectorPolicies[].detector`, `inputDetectorPolicies[].enabled`, `inputDetectorPolicies[].severity`, `name`, `outputDetectorPolicies`, `outputDetectorPolicies[].configuration`, `outputDetectorPolicies[].detector`, `outputDetectorPolicies[].enabled`, `outputDetectorPolicies[].severity`, `updateTimeMillis`, `version`
- `aiguard` / `aiguard/detection-policies/detections-policy-resource-enable-detections-policy` — `path_params` +0 −1 Δ0; `response_schema` +7 −16 Δ0
  - `path_params` removed: `enable`
  - `response_schema` added: `enabled`, `matchRules`, `matchRules[].enabled`, `matchRules[].id`, `matchRules[].name`, `policyId`, `updatedCount`
  - `response_schema` removed: `createTimeMillis`, `description`, `id`, `inputDetectorPolicies`, `inputDetectorPolicies[].configuration`, `inputDetectorPolicies[].detector`, `inputDetectorPolicies[].enabled`, `inputDetectorPolicies[].severity`, `name`, `outputDetectorPolicies`, `outputDetectorPolicies[].configuration`, `outputDetectorPolicies[].detector`, `outputDetectorPolicies[].enabled`, `outputDetectorPolicies[].severity`, `updateTimeMillis`, `version`
- `aiguard` / `aiguard/detection-policies/detections-policy-resource-referential-check-detections-policy` — `path_params` +0 −1 Δ0
  - `path_params` removed: `referential`
- `aiguard` / `aiguard/llm-application-credentials/llm-application-credentials-resource-referential-check-application-credentials` — `path_params` +0 −1 Δ0
  - `path_params` removed: `referential`
- `aiguard` / `aiguard/llm-application-credentials/llm-application-credentials-resource-regenerate-llm-application-credentials` — `path_params` +0 −1 Δ0
  - `path_params` removed: `regenerate`
- `aiguard` / `aiguard/llm-applications/llm-application-resource-create-llm-application` — `request_body` +0 −4 Δ0; `response_schema` +0 −4 Δ0
  - `request_body` removed: `applicationSettings.customerManagedKey`, `applicationSettings.customerManagedKey.kmsKeyId`, `applicationSettings.customerManagedKey.kmsProviderType`, `defaultPolicyId`
  - `response_schema` removed: `applicationSettings.customerManagedKey`, `applicationSettings.customerManagedKey.kmsKeyId`, `applicationSettings.customerManagedKey.kmsProviderType`, `defaultPolicyId`
- `aiguard` / `aiguard/llm-applications/llm-application-resource-get-llm-application-by-id` — `response_schema` +0 −4 Δ0
  - `response_schema` removed: `applicationSettings.customerManagedKey`, `applicationSettings.customerManagedKey.kmsKeyId`, `applicationSettings.customerManagedKey.kmsProviderType`, `defaultPolicyId`
- `aiguard` / `aiguard/llm-applications/llm-application-resource-get-llm-application-by-name` — `response_schema` +0 −4 Δ0
  - `response_schema` removed: `applicationSettings.customerManagedKey`, `applicationSettings.customerManagedKey.kmsKeyId`, `applicationSettings.customerManagedKey.kmsProviderType`, `defaultPolicyId`
- `aiguard` / `aiguard/llm-applications/llm-application-resource-list-llm-applications` — `response_schema` +0 −4 Δ0
  - `response_schema` removed: `items[].applicationSettings.customerManagedKey`, `items[].applicationSettings.customerManagedKey.kmsKeyId`, `items[].applicationSettings.customerManagedKey.kmsProviderType`, `items[].defaultPolicyId`
- `aiguard` / `aiguard/llm-applications/llm-application-resource-referential-check-application` — `path_params` +0 −1 Δ0
  - `path_params` removed: `referential`
- `aiguard` / `aiguard/llm-applications/llm-application-resource-update-llm-application` — `request_body` +0 −4 Δ0; `response_schema` +0 −4 Δ0
  - `request_body` removed: `applicationSettings.customerManagedKey`, `applicationSettings.customerManagedKey.kmsKeyId`, `applicationSettings.customerManagedKey.kmsProviderType`, `defaultPolicyId`
  - `response_schema` removed: `applicationSettings.customerManagedKey`, `applicationSettings.customerManagedKey.kmsKeyId`, `applicationSettings.customerManagedKey.kmsProviderType`, `defaultPolicyId`
- `aiguard` / `aiguard/llm-provider-credentials/llm-provider-credentials-resource-referential-check-provider-credentials` — `path_params` +0 −1 Δ0
  - `path_params` removed: `referential`
- `aiguard` / `aiguard/llm-providers/llm-provider-resource-create-llm-provider` — `request_body` +0 −0 Δ1; `response_schema` +0 −0 Δ1
  - `request_body` metadata changed: `type`
  - `response_schema` metadata changed: `type`
- `aiguard` / `aiguard/llm-providers/llm-provider-resource-get-llm-provider-by-id` — `response_schema` +0 −0 Δ1
  - `response_schema` metadata changed: `type`
- `aiguard` / `aiguard/llm-providers/llm-provider-resource-get-llm-provider-by-name` — `response_schema` +0 −0 Δ1
  - `response_schema` metadata changed: `type`
- `aiguard` / `aiguard/llm-providers/llm-provider-resource-list-llm-providers` — `response_schema` +0 −0 Δ1
  - `response_schema` metadata changed: `items[].type`
- `aiguard` / `aiguard/llm-providers/llm-provider-resource-referential-check-provider` — `path_params` +0 −1 Δ0
  - `path_params` removed: `referential`
- `aiguard` / `aiguard/llm-providers/llm-provider-resource-update-llm-provider` — `request_body` +0 −0 Δ1; `response_schema` +0 −0 Δ1
  - `request_body` metadata changed: `type`
  - `response_schema` metadata changed: `type`
- `event-monitoring` / `event-monitoring/event-monitoring-subscriptions/subscription-resource-get-subscriptions` — `response_schema` +3 −0 Δ1
  - `response_schema` added: `subscriptions[]._links`, `subscriptions[].channels[].region`, `subscriptions[].channels[].topic_arn`
  - `response_schema` metadata changed: `subscriptions[].channels[].type`
- `event-monitoring` / `event-monitoring/event-monitoring-subscriptions/subscription-resource-get-subscription` — `response_schema` +3 −0 Δ1
  - `response_schema` added: `_links`, `channels[].region`, `channels[].topic_arn`
  - `response_schema` metadata changed: `channels[].type`
- `event-monitoring` / `event-monitoring/event-monitoring-subscriptions/subscription-resource-create-subscription` — `request_body` +2 −0 Δ1; `response_schema` +3 −0 Δ1
  - `request_body` added: `channels[].region`, `channels[].topic_arn`
  - `request_body` metadata changed: `channels[].type`
  - `response_schema` added: `_links`, `channels[].region`, `channels[].topic_arn`
  - `response_schema` metadata changed: `channels[].type`
- `event-monitoring` / `event-monitoring/event-monitoring-subscriptions/subscription-resource-update-subscription` — `request_body` +2 −0 Δ1; `response_schema` +3 −0 Δ1
  - `request_body` added: `channels[].region`, `channels[].topic_arn`
  - `request_body` metadata changed: `channels[].type`
  - `response_schema` added: `_links`, `channels[].region`, `channels[].topic_arn`
  - `response_schema` metadata changed: `channels[].type`
- `zia` / `zia/admin-audit-logs/cancel-audit-report-entry-csv-export` — `query_params` +1 −0 Δ0
  - `query_params` added: `statusId`
- `zia` / `zia/admin-audit-logs/get-audit-report-entry-csv-data` — `query_params` +1 −0 Δ0
  - `query_params` added: `statusId`
- `zia` / `zia/admin-audit-logs/get-audit-report-entry-csv-export-status` — `query_params` +1 −0 Δ0
  - `query_params` added: `statusId`
- `zia` / `zia/event-logs/event-log-entry-report-resource-cancel-event-report-entry-csv-export` — `query_params` +1 −0 Δ0
  - `query_params` added: `statusId`
- `zia` / `zia/event-logs/event-log-entry-report-resource-get-event-report-entry-csv-data` — `query_params` +1 −0 Δ0
  - `query_params` added: `statusId`
- `zia` / `zia/event-logs/event-log-entry-report-resource-get-event-report-entry-csv-export-status` — `query_params` +1 −0 Δ0
  - `query_params` added: `statusId`
- `zid` / `zid/users/users-ops-mfa` — `path_params` +0 −1 Δ0
  - `path_params` removed: `setskipmfa`
- `zid` / `zid/users/users-ops-reset-password` — `path_params` +0 −1 Δ0
  - `path_params` removed: `resetpassword`
- `zid` / `zid/users/users-ops-update-password` — `path_params` +0 −1 Δ0
  - `path_params` removed: `updatepassword`
- `zpa` / `zpa/nonce/deletes-the-provisioning-key-for-the-specified-id` — `path_params` +0 −0 Δ3; `query_params` +1 −1 Δ0
  - `path_params` metadata changed: `associationType`, `customerId`, `provisioningKeyId`
  - `query_params` added: `scopeId`
  - `query_params` removed: `microtenantId`
- `zpa` / `zpa/app-connector-group/gets-all-configured-app-connector-groups-for-the-specified-customer` — `path_params` +0 −0 Δ1; `query_params` +1 −1 Δ2; `response_schema` +1 −178 Δ5
  - `path_params` metadata changed: `customerId`
  - `query_params` added: `scopeId`
  - `query_params` removed: `microtenantId`
  - `query_params` metadata changed: `page`, `pagesize`
  - `response_schema` added: `list[].scopeId`
  - `response_schema` removed: `currentCount`, `list[].city`, `list[].cityCountry`, `list[].connectorGroupType`, `list[].connectors`, `list[].connectors[].appConnectorGroupId`, `list[].connectors[].appConnectorGroupName`, `list[].connectors[].applicationStartTime`, `list[].connectors[].assistantVersion`, `list[].connectors[].assistantVersion.appConnectorGroupId`, `list[].connectors[].assistantVersion.applicationStartTime`, `list[].connectors[].assistantVersion.brokerId`, `list[].connectors[].assistantVersion.creationTime`, `list[].connectors[].assistantVersion.ctrlChannelStatus`, `list[].connectors[].assistantVersion.currentVersion`, `list[].connectors[].assistantVersion.disableAutoUpdate`, `list[].connectors[].assistantVersion.expectedVersion`, `list[].connectors[].assistantVersion.id`, `list[].connectors[].assistantVersion.lastBrokerConnectTime`, `list[].connectors[].assistantVersion.lastBrokerDisconnectTime`
  - `response_schema` metadata changed: `list[].id`, `list[].name`, `list[].versionProfileId`, `totalCount`, `totalPages`
- `zpa` / `zpa/nonce/gets-details-of-all-configured-provisioning-keys-for-the-specified-customer` — `path_params` +0 −0 Δ2; `query_params` +1 −1 Δ2; `response_schema` +5 −17 Δ5
  - `path_params` metadata changed: `associationType`, `customerId`
  - `query_params` added: `scopeId`
  - `query_params` removed: `microtenantId`
  - `query_params` metadata changed: `page`, `pagesize`
  - `response_schema` added: `list[].cloudName`, `list[].maxUsageCount`, `list[].nonceAssociationType`, `list[].nonceValue`, `list[].scopeId`
  - `response_schema` removed: `currentCount`, `list[].creationTime`, `list[].enabled`, `list[].enrollmentCertId`, `list[].enrollmentCertName`, `list[].expirationInEpochSec`, `list[].exportable`, `list[].ipAcl`, `list[].maxUsage`, `list[].microtenantId`, `list[].microtenantName`, `list[].modifiedBy`, `list[].modifiedTime`, `list[].provisioningKey`, `list[].uiConfig`, `list[].zcomponentId`, `list[].zcomponentName`
  - `response_schema` metadata changed: `list[].id`, `list[].name`, `list[].usageCount`, `totalCount`, `totalPages`
- `zpa` / `zpa/nonce/gets-details-of-the-provisioning-key-for-the-specified-id` — `path_params` +0 −0 Δ3; `query_params` +1 −1 Δ0; `response_schema` +5 −16 Δ3
  - `path_params` metadata changed: `associationType`, `customerId`, `provisioningKeyId`
  - `query_params` added: `scopeId`
  - `query_params` removed: `microtenantId`
  - `response_schema` added: `cloudName`, `maxUsageCount`, `nonceAssociationType`, `nonceValue`, `scopeId`
  - `response_schema` removed: `creationTime`, `enabled`, `enrollmentCertId`, `enrollmentCertName`, `expirationInEpochSec`, `exportable`, `ipAcl`, `maxUsage`, `microtenantId`, `microtenantName`, `modifiedBy`, `modifiedTime`, `provisioningKey`, `uiConfig`, `zcomponentId`, `zcomponentName`
  - `response_schema` metadata changed: `id`, `name`, `usageCount`
- `zpa` / `zpa/service-edge-group/get-private-broker-groups` — `path_params` +0 −0 Δ1; `query_params` +1 −1 Δ2; `response_schema` +1 −138 Δ4
  - `path_params` metadata changed: `customerId`
  - `query_params` added: `scopeId`
  - `query_params` removed: `microtenantId`
  - `query_params` metadata changed: `page`, `pagesize`
  - `response_schema` added: `list[].scopeId`
  - `response_schema` removed: `currentCount`, `list[].altCloud`, `list[].city`, `list[].cityCountry`, `list[].countryCode`, `list[].creationTime`, `list[].geoLocationId`, `list[].graceDistanceEnabled`, `list[].graceDistanceValue`, `list[].graceDistanceValueUnit`, `list[].isPublic`, `list[].latitude`, `list[].location`, `list[].longitude`, `list[].microtenantId`, `list[].microtenantName`, `list[].modifiedBy`, `list[].modifiedTime`, `list[].overrideVersionProfile`, `list[].serviceEdges`
  - `response_schema` metadata changed: `list[].id`, `list[].name`, `totalCount`, `totalPages`
- `zpa` / `zpa/version-profile/get-all-version-profiles-visibile-by-customer-id` — `path_params` +0 −0 Δ1; `query_params` +0 −3 Δ0; `response_schema` +7 −41 Δ0
  - `path_params` metadata changed: `customerId`
  - `query_params` removed: `page`, `pagesize`, `search`
  - `response_schema` added: `platformTypes`, `versions`, `versions[].id`, `versions[].name`, `versions[].platformType`, `versions[].releaseDate`, `versions[].version`
  - `response_schema` removed: `currentCount`, `list`, `list[].creationTime`, `list[].customScopeCustomerIds`, `list[].customScopeCustomerIds[].customerId`, `list[].customScopeCustomerIds[].excludeConstellation`, `list[].customScopeCustomerIds[].isPartner`, `list[].customScopeCustomerIds[].name`, `list[].customScopeRequestCustomerIds`, `list[].customScopeRequestCustomerIds.addCustomerIds`, `list[].customScopeRequestCustomerIds.deleteCustomerIds`, `list[].customerId`, `list[].description`, `list[].id`, `list[].modifiedBy`, `list[].modifiedTime`, `list[].name`, `list[].numberOfAssistants`, `list[].numberOfCustomers`, `list[].numberOfPrivateBrokers`
- `zpa` / `zpa/signing-certificate/get-all-signing-cert` — `path_params` +0 −0 Δ1; `query_params` +0 −0 Δ2; `response_schema` +3 −21 Δ5
  - `path_params` metadata changed: `customerId`
  - `query_params` metadata changed: `page`, `pagesize`
  - `response_schema` added: `list[].issuer`, `list[].validFrom`, `list[].validTo`
  - `response_schema` removed: `currentCount`, `list[].allowSigning`, `list[].clientCertType`, `list[].creationTime`, `list[].csr`, `list[].description`, `list[].getcName`, `list[].issuedBy`, `list[].issuedTo`, `list[].microtenantId`, `list[].modifiedBy`, `list[].modifiedTime`, `list[].parentCertId`, `list[].parentCertName`, `list[].privateKey`, `list[].privateKeyPresent`, `list[].serialNo`, `list[].validFromInEpochSec`, `list[].validToInEpochSec`, `list[].zrsaencryptedprivatekey`
  - `response_schema` metadata changed: `list[].certificate`, `list[].id`, `list[].name`, `totalCount`, `totalPages`
- `zpa` / `zpa/siem-config/gets-all-lss-configurations-for-the-specified-customer` — `path_params` +0 −0 Δ1; `query_params` +1 −0 Δ2; `response_schema` +3 −823 Δ4
  - `path_params` metadata changed: `customerId`
  - `query_params` added: `scopeId`
  - `query_params` metadata changed: `page`, `pagesize`
  - `response_schema` added: `list[].enabled`, `list[].name`, `list[].scopeId`
  - `response_schema` removed: `currentCount`, `list[].config.auditMessage`, `list[].config.creationTime`, `list[].config.description`, `list[].config.enabled`, `list[].config.filter`, `list[].config.format`, `list[].config.id`, `list[].config.lssHost`, `list[].config.lssPort`, `list[].config.microtenantId`, `list[].config.microtenantName`, `list[].config.modifiedBy`, `list[].config.modifiedTime`, `list[].config.name`, `list[].config.sourceLogType`, `list[].config.useTls`, `list[].connectorGroups`, `list[].connectorGroups[].city`, `list[].connectorGroups[].cityCountry`
  - `response_schema` metadata changed: `list[].config`, `list[].id`, `totalCount`, `totalPages`
- `zpa` / `zpa/nonce/adds-a-new-provisioning-key-for-the-specified-customer` — `path_params` +0 −0 Δ2; `query_params` +1 −1 Δ0; `request_body` +5 −16 Δ3; `response_schema` +5 −16 Δ3
  - `path_params` metadata changed: `associationType`, `customerId`
  - `query_params` added: `scopeId`
  - `query_params` removed: `microtenantId`
  - `request_body` added: `cloudName`, `maxUsageCount`, `nonceAssociationType`, `nonceValue`, `scopeId`
  - `request_body` removed: `creationTime`, `enabled`, `enrollmentCertId`, `enrollmentCertName`, `expirationInEpochSec`, `exportable`, `ipAcl`, `maxUsage`, `microtenantId`, `microtenantName`, `modifiedBy`, `modifiedTime`, `provisioningKey`, `uiConfig`, `zcomponentId`, `zcomponentName`
  - `request_body` metadata changed: `id`, `name`, `usageCount`
  - `response_schema` added: `cloudName`, `maxUsageCount`, `nonceAssociationType`, `nonceValue`, `scopeId`
  - `response_schema` removed: `creationTime`, `enabled`, `enrollmentCertId`, `enrollmentCertName`, `expirationInEpochSec`, `exportable`, `ipAcl`, `maxUsage`, `microtenantId`, `microtenantName`, `modifiedBy`, `modifiedTime`, `provisioningKey`, `uiConfig`, `zcomponentId`, `zcomponentName`
  - `response_schema` metadata changed: `id`, `name`, `usageCount`
- `zpa` / `zpa/nonce/updates-the-provisioning-key-details-for-the-specified-id` — `path_params` +0 −0 Δ3; `query_params` +1 −1 Δ0; `request_body` +5 −16 Δ3
  - `path_params` metadata changed: `associationType`, `customerId`, `provisioningKeyId`
  - `query_params` added: `scopeId`
  - `query_params` removed: `microtenantId`
  - `request_body` added: `cloudName`, `maxUsageCount`, `nonceAssociationType`, `nonceValue`, `scopeId`
  - `request_body` removed: `creationTime`, `enabled`, `enrollmentCertId`, `enrollmentCertName`, `expirationInEpochSec`, `exportable`, `ipAcl`, `maxUsage`, `microtenantId`, `microtenantName`, `modifiedBy`, `modifiedTime`, `provisioningKey`, `uiConfig`, `zcomponentId`, `zcomponentName`
  - `request_body` metadata changed: `id`, `name`, `usageCount`

## Field Totals

### `path_params`

- Existing top-level fields across common ops: 906
- Blob top-level fields across common ops: 895
- Blob flattened fields across common ops: 895
- Blob nested fields across common ops: 0
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 11

### `query_params`

- Existing top-level fields across common ops: 1329
- Blob top-level fields across common ops: 1333
- Blob flattened fields across common ops: 1333
- Blob nested fields across common ops: 0
- Blob top-level fields new vs committed contract: 14
- Committed contract top-level fields missing from blob: 10

### `request_body`

- Existing top-level fields across common ops: 4654
- Blob top-level fields across common ops: 4630
- Blob flattened fields across common ops: 16760
- Blob nested fields across common ops: 12168
- Blob top-level fields new vs committed contract: 10
- Committed contract top-level fields missing from blob: 34

### `response_schema`

- Existing top-level fields across common ops: 11220
- Blob top-level fields across common ops: 11182
- Blob flattened fields across common ops: 39904
- Blob nested fields across common ops: 31785
- Blob top-level fields new vs committed contract: 23
- Committed contract top-level fields missing from blob: 61

## Live-Only Samples

### `ai-security`
- `ai-security/aisecurity/datastores/datastores-get-datastore`
- `ai-security/aisecurity/datastores/datastores-list-datastores`
- `ai-security/aisecurity/identities/identities-get-identity`
- `ai-security/aisecurity/identities/identities-list-identities`
- `ai-security/aisecurity/issues/issues-get-issue`
- `ai-security/aisecurity/issues/issues-list-issues`
- `ai-security/aisecurity/mcp-servers/mcp-servers-get-mcp-server`
- `ai-security/aisecurity/mcp-servers/mcp-servers-get-mcp-server-tools`
- `ai-security/aisecurity/mcp-servers/mcp-servers-list-mcp-servers`
- `ai-security/aisecurity/workloads/workloads-get-workload`
- `ai-security/aisecurity/workloads/workloads-list-workloads`

### `aiguard`
- `aiguard/llm-providers/llm-provider-type-resource-get-llm-provider-type`
- `aiguard/llm-providers/llm-provider-type-resource-list-llm-provider-types`

### `event-monitoring`
- `event-monitoring/event-monitoring-subscriptions/subscription-resource-create-subscription`
- `event-monitoring/event-monitoring-subscriptions/subscription-resource-delete-subscription`
- `event-monitoring/event-monitoring-subscriptions/subscription-resource-get-email-channel`
- `event-monitoring/event-monitoring-subscriptions/subscription-resource-get-sns-channel`
- `event-monitoring/event-monitoring-subscriptions/subscription-resource-get-subscription`
- `event-monitoring/event-monitoring-subscriptions/subscription-resource-get-subscriptions`
- `event-monitoring/event-monitoring-subscriptions/subscription-resource-get-webhook-channel`
- `event-monitoring/event-monitoring-subscriptions/subscription-resource-list-channels`
- `event-monitoring/event-monitoring-subscriptions/subscription-resource-update-subscription`
- `event-monitoring/event-monitoring-subscriptions/subscription-resource-verify-sns-topic-access`

### `zpa`
- `zpa/app-connector-group/gets-all-configured-app-connector-groups-for-the-specified-customer`
- `zpa/browser-access-group/get-browser-access-groups`
- `zpa/business-continuity-settings/create-business-continuity-settings`
- `zpa/business-continuity-settings/delete-business-continuity-settings`
- `zpa/business-continuity-settings/download-sp-certificate`
- `zpa/business-continuity-settings/download-sp-metadata`
- `zpa/business-continuity-settings/get-business-continuity-settings`
- `zpa/business-continuity-settings/get-business-continuity-settings-by-id`
- `zpa/business-continuity-settings/update-business-continuity-settings`
- `zpa/nonce/adds-a-new-provisioning-key-for-the-specified-customer`
- `zpa/nonce/deletes-the-provisioning-key-for-the-specified-id`
- `zpa/nonce/gets-details-of-all-configured-provisioning-keys-for-the-specified-customer`
- `zpa/nonce/gets-details-of-the-provisioning-key-for-the-specified-id`
- `zpa/nonce/updates-the-provisioning-key-details-for-the-specified-id`
- `zpa/private-cloud-controller-group/create-private-cloud-controller-group`
- `zpa/private-cloud-controller-group/delete-private-cloud-controller-group`
- `zpa/private-cloud-controller-group/get-all-private-cloud-controller-groups`
- `zpa/private-cloud-controller-group/get-private-cloud-controller-group-by-id`
- `zpa/private-cloud-controller-group/update-private-cloud-controller-group`
- `zpa/private-cloud-controller/delete-private-cloud-controller`

## Loose Method/Path-Only Samples

### `ai-security`
- Live-only loose signatures:
  - `GET /v1/assets/datastores`
  - `GET /v1/assets/datastores/{}`
  - `GET /v1/assets/identities`
  - `GET /v1/assets/identities/{}`
  - `GET /v1/assets/mcpservers`
  - `GET /v1/assets/mcpservers/{}`
  - `GET /v1/assets/mcpservers/{}/tools`
  - `GET /v1/assets/workloads`
  - `GET /v1/assets/workloads/{}`
  - `GET /v1/issues`

### `aiguard`
- Live-only loose signatures:
  - `GET /detections/policies/{}/referential-check`
  - `GET /llm-application-credentials/{}/referential-check`
  - `GET /llm-applications/{}/referential-check`
  - `GET /llm-provider-credentials/{}/referential-check`
  - `GET /llm-provider-types`
  - `GET /llm-provider-types/{}`
  - `GET /llm-providers/{}/referential-check`
  - `POST /detections/policies/{}/disable`
  - `POST /detections/policies/{}/enable`
  - `POST /llm-application-credentials/{}/regenerate`
- Existing-only loose signatures:
  - `GET /detections/policies/{}-check`
  - `GET /llm-application-credentials/{}-check`
  - `GET /llm-applications/{}-check`
  - `GET /llm-provider-credentials/{}-check`
  - `GET /llm-providers/{}-check`
  - `POST /detections/policies/{}`
  - `POST /llm-application-credentials/{}`

### `event-monitoring`
- Live-only loose signatures:
  - `GET /subscriptions/channels`
  - `GET /subscriptions/channels/email`
  - `GET /subscriptions/channels/sns`
  - `GET /subscriptions/channels/webhook`
  - `POST /subscriptions/channels/sns/verify`

### `zid`
- Live-only loose signatures:
  - `POST /users/{}/resetpassword`
  - `POST /users/{}/setskipmfa`
  - `PUT /users/{}/updatepassword`
- Existing-only loose signatures:
  - `POST /users/{}`

### `zpa`
- Live-only loose signatures:
  - `DELETE /mgmtconfig/v1/admin/customers/{}/businessContinuitySettings/{}`
  - `DELETE /mgmtconfig/v1/admin/customers/{}/privateCloud/{}`
  - `DELETE /mgmtconfig/v1/admin/customers/{}/privateCloudController/{}`
  - `DELETE /mgmtconfig/v1/admin/customers/{}/privateCloudControllerGroup/{}`
  - `GET /mgmtconfig/v1/admin/customers/{}/browserAccessGroup`
  - `GET /mgmtconfig/v1/admin/customers/{}/businessContinuitySettings`
  - `GET /mgmtconfig/v1/admin/customers/{}/businessContinuitySettings/certificate`
  - `GET /mgmtconfig/v1/admin/customers/{}/businessContinuitySettings/metadata`
  - `GET /mgmtconfig/v1/admin/customers/{}/businessContinuitySettings/{}`
  - `GET /mgmtconfig/v1/admin/customers/{}/privateCloud`
- Existing-only loose signatures:
  - `POST /mgmtconfig/v1/admin/customers/{}/appConnectorGroup`
  - `POST /mgmtconfig/v1/admin/customers/{}/serviceEdgeGroup`
  - `POST /mgmtconfig/v2/admin/customers/{}/lssConfig`

## Nested Schema Examples

### `aiguard/detection-policies/detections-policy-resource-create-detections-policy` / `request_body`
- Blob nested fields (8):
  - `inputDetectorPolicies[].configuration`
  - `inputDetectorPolicies[].detector`
  - `inputDetectorPolicies[].enabled`
  - `inputDetectorPolicies[].severity`
  - `outputDetectorPolicies[].configuration`
  - `outputDetectorPolicies[].detector`
  - `outputDetectorPolicies[].enabled`
  - `outputDetectorPolicies[].severity`

### `aiguard/detection-policies/detections-policy-resource-create-detections-policy` / `response_schema`
- Blob nested fields (8):
  - `inputDetectorPolicies[].configuration`
  - `inputDetectorPolicies[].detector`
  - `inputDetectorPolicies[].enabled`
  - `inputDetectorPolicies[].severity`
  - `outputDetectorPolicies[].configuration`
  - `outputDetectorPolicies[].detector`
  - `outputDetectorPolicies[].enabled`
  - `outputDetectorPolicies[].severity`

### `aiguard/detection-policies/detections-policy-resource-disable-detections-policy` / `response_schema`
- Blob nested fields (3):
  - `matchRules[].enabled`
  - `matchRules[].id`
  - `matchRules[].name`

### `aiguard/detection-policies/detections-policy-resource-enable-detections-policy` / `response_schema`
- Blob nested fields (3):
  - `matchRules[].enabled`
  - `matchRules[].id`
  - `matchRules[].name`

### `aiguard/detection-policies/detections-policy-resource-get-detections-policy-by-id` / `response_schema`
- Blob nested fields (8):
  - `inputDetectorPolicies[].configuration`
  - `inputDetectorPolicies[].detector`
  - `inputDetectorPolicies[].enabled`
  - `inputDetectorPolicies[].severity`
  - `outputDetectorPolicies[].configuration`
  - `outputDetectorPolicies[].detector`
  - `outputDetectorPolicies[].enabled`
  - `outputDetectorPolicies[].severity`

### `aiguard/detection-policies/detections-policy-resource-get-detections-policy-by-name` / `response_schema`
- Blob nested fields (8):
  - `inputDetectorPolicies[].configuration`
  - `inputDetectorPolicies[].detector`
  - `inputDetectorPolicies[].enabled`
  - `inputDetectorPolicies[].severity`
  - `outputDetectorPolicies[].configuration`
  - `outputDetectorPolicies[].detector`
  - `outputDetectorPolicies[].enabled`
  - `outputDetectorPolicies[].severity`

### `aiguard/detection-policies/detections-policy-resource-list-detections-policies` / `response_schema`
- Blob nested fields (16):
  - `items[].createTimeMillis`
  - `items[].description`
  - `items[].id`
  - `items[].inputDetectorPolicies`
  - `items[].inputDetectorPolicies[].configuration`
  - `items[].inputDetectorPolicies[].detector`
  - `items[].inputDetectorPolicies[].enabled`
  - `items[].inputDetectorPolicies[].severity`
  - `items[].name`
  - `items[].outputDetectorPolicies`
  - `items[].outputDetectorPolicies[].configuration`
  - `items[].outputDetectorPolicies[].detector`

### `aiguard/detection-policies/detections-policy-resource-update-detections-policy` / `request_body`
- Blob nested fields (8):
  - `inputDetectorPolicies[].configuration`
  - `inputDetectorPolicies[].detector`
  - `inputDetectorPolicies[].enabled`
  - `inputDetectorPolicies[].severity`
  - `outputDetectorPolicies[].configuration`
  - `outputDetectorPolicies[].detector`
  - `outputDetectorPolicies[].enabled`
  - `outputDetectorPolicies[].severity`

### `aiguard/detection-policies/detections-policy-resource-update-detections-policy` / `response_schema`
- Blob nested fields (8):
  - `inputDetectorPolicies[].configuration`
  - `inputDetectorPolicies[].detector`
  - `inputDetectorPolicies[].enabled`
  - `inputDetectorPolicies[].severity`
  - `outputDetectorPolicies[].configuration`
  - `outputDetectorPolicies[].detector`
  - `outputDetectorPolicies[].enabled`
  - `outputDetectorPolicies[].severity`

### `aiguard/detection-policies/detections-policy-summary-resource-list-detections-policy-summaries` / `response_schema`
- Blob nested fields (5):
  - `items[].createTimeMillis`
  - `items[].id`
  - `items[].name`
  - `items[].updateTimeMillis`
  - `items[].version`

### `aiguard/detection-policy-match-rules/detections-policy-match-rule-resource-create-detections-policy-match-rule` / `request_body`
- Blob nested fields (1):
  - `matchCriteria.type`

### `aiguard/detection-policy-match-rules/detections-policy-match-rule-resource-create-detections-policy-match-rule` / `response_schema`
- Blob nested fields (1):
  - `matchCriteria.type`

### `aiguard/detection-policy-match-rules/detections-policy-match-rule-resource-get-detections-policy-match-rule-by-id` / `response_schema`
- Blob nested fields (1):
  - `matchCriteria.type`

### `aiguard/detection-policy-match-rules/detections-policy-match-rule-resource-get-detections-policy-match-rule-by-name` / `response_schema`
- Blob nested fields (1):
  - `matchCriteria.type`

### `aiguard/detection-policy-match-rules/detections-policy-match-rule-resource-list-detections-policy-match-rules` / `response_schema`
- Blob nested fields (9):
  - `items[].enabled`
  - `items[].id`
  - `items[].matchCriteria`
  - `items[].matchCriteria.type`
  - `items[].name`
  - `items[].policyId`
  - `items[].policyName`
  - `items[].ruleOrder`
  - `items[].version`
