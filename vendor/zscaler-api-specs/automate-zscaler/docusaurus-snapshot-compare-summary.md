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
| `event-monitoring` | 15 | 10 | 5 | 10 | 10 | 5 | 0 | 11 |
| `zcc` | 54 | 54 | 54 | 54 | 0 | 0 | 481 | 568 |
| `zcell` | 36 | 36 | 36 | 36 | 0 | 0 | 14 | 189 |
| `zcloudconnector` | 165 | 165 | 165 | 165 | 0 | 0 | 2358 | 5678 |
| `zdx` | 148 | 148 | 148 | 129 | 0 | 0 | 562 | 5947 |
| `zia` | 471 | 471 | 471 | 471 | 0 | 0 | 3249 | 9699 |
| `zid` | 31 | 31 | 31 | 28 | 0 | 0 | 24 | 265 |
| `zpa` | 208 | 188 | 175 | 185 | 33 | 13 | 5386 | 9033 |

## Field Totals

### `path_params`

- Existing top-level fields across common ops: 885
- Blob top-level fields across common ops: 874
- Blob flattened fields across common ops: 874
- Blob nested fields across common ops: 0
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 11

### `query_params`

- Existing top-level fields across common ops: 1302
- Blob top-level fields across common ops: 1308
- Blob flattened fields across common ops: 1308
- Blob nested fields across common ops: 0
- Blob top-level fields new vs committed contract: 6
- Committed contract top-level fields missing from blob: 0

### `request_body`

- Existing top-level fields across common ops: 4606
- Blob top-level fields across common ops: 4604
- Blob flattened fields across common ops: 16712
- Blob nested fields across common ops: 12146
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 2

### `response_schema`

- Existing top-level fields across common ops: 11133
- Blob top-level fields across common ops: 11121
- Blob flattened fields across common ops: 39755
- Blob nested fields across common ops: 31697
- Blob top-level fields new vs committed contract: 8
- Committed contract top-level fields missing from blob: 20

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
