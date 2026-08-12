# Automate Docusaurus Snapshot

Captured at: `2026-08-12T19:30:27.295671+00:00`
Main JS: `https://automate.zscaler.com/assets/js/main.a6c60d52.js`
Runtime JS: `https://automate.zscaler.com/assets/js/runtime~main.2327c68a.js`

## Summary

- Routes discovered: **1257**
- API MDX route candidates matched: **1257 / 1257**
- API blobs decoded: **1257**
- Decode failures: **0**
- Existing committed contract ops: **1207**
- Live-only route keys: **108**
- Existing-only route keys: **58**
- Live-only loose method/path signatures: **97**
- Existing-only loose method/path signatures: **47**

## Retained Publication Absences

These products have no operations in the current public route table. Their last-known committed snapshots are retained; publication absence does not establish endpoint retirement or backend unavailability.

- `aiguard` — **47** last-known operations across **29** paths retained (`absent-from-current-public-route-table`).

## Product Counts

| product | live blobs | existing scrape | route-key common ops | loose path common sigs | live-only route keys | existing-only route keys | request nested | response nested |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `ai-security` | 108 | 11 | 0 | 11 | 108 | 11 | 0 | 65 |
| `aiguard` | 0 | 47 | 0 | 0 | 0 | 47 | 0 | 0 |
| `bi` | 10 | 10 | 10 | 10 | 0 | 0 | 48 | 116 |
| `easm` | 11 | 11 | 11 | 11 | 0 | 0 | 0 | 79 |
| `event-monitoring` | 15 | 15 | 15 | 15 | 0 | 0 | 22 | 69 |
| `zcc` | 54 | 54 | 54 | 54 | 0 | 0 | 481 | 568 |
| `zcell` | 36 | 36 | 36 | 36 | 0 | 0 | 14 | 189 |
| `zcloudconnector` | 165 | 165 | 165 | 165 | 0 | 0 | 2358 | 5678 |
| `zdx` | 148 | 148 | 148 | 129 | 0 | 0 | 562 | 5947 |
| `zia` | 471 | 471 | 471 | 471 | 0 | 0 | 3249 | 9699 |
| `zid` | 31 | 31 | 31 | 31 | 0 | 0 | 24 | 265 |
| `zpa` | 208 | 208 | 208 | 208 | 0 | 0 | 5390 | 9104 |

## Contract Change Radar

Route-key renames are paired by method/path before additions and removals are counted. Schema changes compare flattened field names plus type, required, readonly, enum, and response status metadata, as well as discriminator mappings and titles from request and selected-success schemas. Schema or product metadata drift describes the current public documentation; by itself it does not establish a feature launch, endpoint availability, or tenant entitlement.
For products listed as retained publication absences, the `removed ops` count is only the current-route-table versus retained-snapshot set difference; it is not an endpoint-retirement conclusion.

| product | matched | added ops | removed ops | route changes | route-key changes | schema-changed ops | schema annotation Δ | product metadata Δ | request +/−/Δ | response +/−/Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `ai-security` | 11 | 97 | 0 | 0 | 11 | 7 | 2 | 1 | 0/0/0 | 0/2/8 |
| `aiguard` | 0 | 0 | 47 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `bi` | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `easm` | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `event-monitoring` | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zcc` | 54 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zcell` | 36 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zcloudconnector` | 165 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zdx` | 148 | 0 | 0 | 0 | 0 | 20 | 20 | 1 | 0/0/0 | 0/0/0 |
| `zia` | 471 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zid` | 31 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |
| `zpa` | 208 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/0/0 | 0/0/0 |

### Product metadata changes

- `ai-security` `title` values: added `AI Red Teaming`; retained `AI Infrastructure`; current operation distribution `AI Infrastructure`=11, `AI Red Teaming`=97.
- `zdx` `title` values: added `Digital Experience API`; retained `Zscaler Digital Experience API`; current operation distribution `Digital Experience API`=146, `Zscaler Digital Experience API`=2.

### Added operations

- `ai-security` — `POST /api/v2/ai-apps/create` (`ai-security/airedteaming/aiapp/ai-app-resource-create-ai-app`)
- `ai-security` — `DELETE /api/v2/ai-apps/{aiAppId}` (`ai-security/airedteaming/aiapp/ai-app-resource-delete-ai-app`)
- `ai-security` — `POST /api/v2/ai-apps/{aiAppId}/duplicate` (`ai-security/airedteaming/aiapp/ai-app-resource-duplicate-ai-app`)
- `ai-security` — `GET /api/v2/ai-apps/{aiAppId}` (`ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app`)
- `ai-security` — `GET /api/v2/ai-apps/{aiAppId}/latest-probe-runs` (`ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app-latest-probe-runs`)
- `ai-security` — `POST /api/v2/ai-apps/{aiAppId}/risk-level-timeseries` (`ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app-risk-level-timeseries`)
- `ai-security` — `GET /api/v2/ai-apps/{aiAppId}/settings` (`ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app-settings`)
- `ai-security` — `GET /api/v2/ai-apps/{aiAppId}/test-run-metrics` (`ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app-test-run-metrics`)
- `ai-security` — `GET /api/v2/ai-apps/{aiAppId}/available-probes` (`ai-security/airedteaming/aiapp/ai-app-resource-list-ai-app-available-probes`)
- `ai-security` — `GET /api/v2/ai-apps/{aiAppId}/test-run-available-probes` (`ai-security/airedteaming/aiapp/ai-app-resource-list-ai-app-test-run-available-probes`)
- `ai-security` — `POST /api/v2/ai-apps/{aiAppId}/test-runs` (`ai-security/airedteaming/aiapp/ai-app-resource-list-ai-app-test-runs`)
- `ai-security` — `POST /api/v2/ai-apps` (`ai-security/airedteaming/aiapp/ai-app-resource-list-ai-apps`)
- `ai-security` — `PUT /api/v2/ai-apps/{aiAppId}` (`ai-security/airedteaming/aiapp/ai-app-resource-update-ai-app`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/agentforce` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-agentforce-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/anthropic` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-anthropic-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/azure-bot` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-azure-bot-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/azure-ml` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-azure-ml-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/azure-openai` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-azure-open-ai-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/bedrock` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-bedrock-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/copilot-studio` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-copilot-studio-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/databricks` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-databricks-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/gemini` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-gemini-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/glean` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-glean-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/hugging-face` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-hugging-face-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/mistral` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-mistral-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/openai-assistant` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-open-ai-assistant-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/openai` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-open-ai-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/openai-rest-api` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-open-ai-rest-api-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/proxy-sdk` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-proxy-sdk-integration`)
- `ai-security` — `POST /api/v2/ai-app/test-integration/rest-api` (`ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-rest-api-integration`)
- `ai-security` — `GET /api/v2/business-units` (`ai-security/airedteaming/businessunit/business-unit-resource-list-business-units`)
- `ai-security` — `POST /api/v2/files/business-unit/{businessUnitId}/upload-custom-dataset` (`ai-security/airedteaming/file/file-resource-upload-custom-dataset`)
- `ai-security` — `POST /api/v2/files/upload` (`ai-security/airedteaming/file/file-resource-upload-file`)
- `ai-security` — `POST /api/v2/files/business-unit/{businessUnitId}/upload-qa-file` (`ai-security/airedteaming/file/file-resource-upload-qa-file`)
- `ai-security` — `GET /api/v2/model-benchmarks/compare/{id1}/{id2}` (`ai-security/airedteaming/modelbenchmark/model-benchmark-resource-compare-benchmark-models`)
- `ai-security` — `POST /api/v2/model-benchmarks/request` (`ai-security/airedteaming/modelbenchmark/model-benchmark-resource-create-benchmark-request`)
- `ai-security` — `GET /api/v2/model-benchmarks/{id}` (`ai-security/airedteaming/modelbenchmark/model-benchmark-resource-get-benchmark-model`)
- `ai-security` — `GET /api/v2/model-benchmarks/{id}/runs/{probeId}/{benchmarkTypeId}` (`ai-security/airedteaming/modelbenchmark/model-benchmark-resource-get-benchmark-probe-run`)
- `ai-security` — `GET /api/v2/model-benchmarks/runs/{probeRunId}/test-case-filter-options` (`ai-security/airedteaming/modelbenchmark/model-benchmark-resource-get-benchmark-probe-run-filter-options`)
- `ai-security` — `GET /api/v2/model-benchmarks/results/{id}` (`ai-security/airedteaming/modelbenchmark/model-benchmark-resource-get-benchmark-probe-run-result`)
- `ai-security` — `GET /api/v2/model-benchmarks/categories` (`ai-security/airedteaming/modelbenchmark/model-benchmark-resource-list-benchmark-categories`)
- `ai-security` — `GET /api/v2/model-benchmarks/{id}/runs` (`ai-security/airedteaming/modelbenchmark/model-benchmark-resource-list-benchmark-model-runs`)
- `ai-security` — `POST /api/v2/model-benchmarks/{id}/runs/{probeId}/{benchmarkTypeId}/test-cases` (`ai-security/airedteaming/modelbenchmark/model-benchmark-resource-list-benchmark-probe-run-test-cases`)
- `ai-security` — `GET /api/v2/model-benchmarks/types` (`ai-security/airedteaming/modelbenchmark/model-benchmark-resource-list-benchmark-types`)
- `ai-security` — `POST /api/v2/model-benchmarks` (`ai-security/airedteaming/modelbenchmark/model-benchmark-resource-list-model-benchmarks`)
- `ai-security` — `GET /api/v2/probes/{probeId}` (`ai-security/airedteaming/probe/probe-resource-get-probe-definition`)
- `ai-security` — `GET /api/v2/probes/all-available-probes` (`ai-security/airedteaming/probe/probe-resource-list-all-available-probes`)
- `ai-security` — `POST /api/v2/ai-apps/{aiAppId}/probe-settings` (`ai-security/airedteaming/probeconfiguration/probe-configuration-resource-create-probe-settings`)
- `ai-security` — `GET /api/v2/ai-apps/{aiAppId}/probe-settings/{probeConfigurationId}` (`ai-security/airedteaming/probeconfiguration/probe-configuration-resource-get-probe-settings`)
- `ai-security` — `GET /api/v2/ai-apps/{aiAppId}/probe-settings` (`ai-security/airedteaming/probeconfiguration/probe-configuration-resource-list-probe-settings`)
- `ai-security` — `PATCH /api/v2/ai-apps/{aiAppId}/probe-settings/{probeConfigurationId}` (`ai-security/airedteaming/probeconfiguration/probe-configuration-resource-update-probe-settings`)
- `ai-security` — `GET /api/v2/probe-runs/{probeRunId}/ai-analysis-results` (`ai-security/airedteaming/proberun/probe-run-resource-get-probe-run-ai-analysis-results`)
- `ai-security` — `GET /api/v2/probe-runs/{probeRunId}` (`ai-security/airedteaming/proberun/probe-run-resource-get-probe-run-details`)
- `ai-security` — `GET /api/v2/probe-runs/{probeRunId}/test-case-filter-options` (`ai-security/airedteaming/proberun/probe-run-resource-get-probe-run-test-case-filter-options`)
- `ai-security` — `POST /api/v2/probe-runs/{probeRunId}/test-cases` (`ai-security/airedteaming/proberun/probe-run-resource-list-probe-run-test-cases`)
- `ai-security` — `GET /api/v2/remediation/ai-apps/{aiAppId}/policy-generator/{policyId}/export-json-policy` (`ai-security/airedteaming/remediation/remediation-resource-export-policy-as-json`)
- `ai-security` — `GET /api/v2/remediation/ai-apps/{aiAppId}/prompt-hardening/{promptHardeningId}` (`ai-security/airedteaming/remediation/remediation-resource-get-ai-app-prompt-hardening-by-id`)
- `ai-security` — `GET /api/v2/remediation/ai-apps/{aiAppId}/policy-generator/latest` (`ai-security/airedteaming/remediation/remediation-resource-get-latest-policy-generator`)
- `ai-security` — `GET /api/v2/remediation/ai-apps/{aiAppId}/prompt-hardening/latest` (`ai-security/airedteaming/remediation/remediation-resource-get-latest-prompt-hardening`)
- `ai-security` — `GET /api/v2/remediation/ai-apps/{aiAppId}/policy-generator/{policyId}` (`ai-security/airedteaming/remediation/remediation-resource-get-policy-generator-by-id`)
- `ai-security` — `POST /api/v2/remediation/policy-generator/metrics` (`ai-security/airedteaming/remediation/remediation-resource-get-policy-generator-dashboard-metrics`)
- `ai-security` — `GET /api/v2/remediation/ai-apps/{aiAppId}/policy-generator/{policyId}/detector` (`ai-security/airedteaming/remediation/remediation-resource-get-policy-generator-detector`)
- `ai-security` — `GET /api/v2/remediation/prompt-hardening/{promptHardeningId}` (`ai-security/airedteaming/remediation/remediation-resource-get-prompt-hardening-by-id`)
- `ai-security` — `POST /api/v2/remediation/ai-apps/{aiAppId}/policy-generator/{policyId}/import` (`ai-security/airedteaming/remediation/remediation-resource-import-policy-to-guardrail`)
- `ai-security` — `POST /api/v2/remediation/ai-apps/{aiAppId}/policy-generator/history` (`ai-security/airedteaming/remediation/remediation-resource-list-ai-app-policy-generator-history`)
- `ai-security` — `GET /api/v2/remediation/ai-apps/{aiAppId}/policy-generator/available-probes` (`ai-security/airedteaming/remediation/remediation-resource-list-policy-generator-available-probes`)
- `ai-security` — `POST /api/v2/remediation/policy-generator/history` (`ai-security/airedteaming/remediation/remediation-resource-list-policy-generator-history`)
- `ai-security` — `POST /api/v2/remediation/ai-apps/{aiAppId}/prompt-hardening/history` (`ai-security/airedteaming/remediation/remediation-resource-list-prompt-hardening-history`)
- `ai-security` — `PUT /api/v2/remediation/ai-apps/{aiAppId}/policy-generator/{policyId}/mark-as-applied` (`ai-security/airedteaming/remediation/remediation-resource-mark-policy-as-applied`)
- `ai-security` — `POST /api/v2/remediation/ai-apps/{aiAppId}/policy-generator/trigger` (`ai-security/airedteaming/remediation/remediation-resource-trigger-policy-generation`)
- `ai-security` — `POST /api/v2/remediation/ai-apps/{aiAppId}/prompt-hardening/{promptHardeningId}/state` (`ai-security/airedteaming/remediation/remediation-resource-update-ai-app-prompt-hardening-state`)
- `ai-security` — `PUT /api/v2/remediation/prompt-hardening/{promptHardeningId}` (`ai-security/airedteaming/remediation/remediation-resource-update-prompt-hardening-state`)
- `ai-security` — `GET /api/v2/reports/ai-app-overview/{aiAppId}` (`ai-security/airedteaming/report/report-resource-generate-ai-app-overview-report`)
- `ai-security` — `GET /api/v2/reports/benchmark-overview/{modelId}` (`ai-security/airedteaming/report/report-resource-generate-benchmark-overview-report`)
- `ai-security` — `GET /api/v2/reports/test-run-overview/{testRunId}` (`ai-security/airedteaming/report/report-resource-generate-test-run-overview-report`)
- `ai-security` — `POST /api/v2/scheduled-test-runs/schedule-new` (`ai-security/airedteaming/scheduledtestrun/scheduled-test-run-resource-create-scheduled-test-run`)
- `ai-security` — `DELETE /api/v2/scheduled-test-runs/{scheduledTestRunId}` (`ai-security/airedteaming/scheduledtestrun/scheduled-test-run-resource-delete-scheduled-test-run`)
- `ai-security` — `GET /api/v2/scheduled-test-runs/{scheduledTestRunId}` (`ai-security/airedteaming/scheduledtestrun/scheduled-test-run-resource-get-scheduled-test-run`)
- `ai-security` — `POST /api/v2/scheduled-test-runs` (`ai-security/airedteaming/scheduledtestrun/scheduled-test-run-resource-list-scheduled-test-runs`)
- `ai-security` — `PUT /api/v2/scheduled-test-runs/{scheduledTestRunId}` (`ai-security/airedteaming/scheduledtestrun/scheduled-test-run-resource-update-scheduled-test-run`)
- `ai-security` — `PUT /api/v2/scheduled-test-runs/{scheduledTestRunId}/status` (`ai-security/airedteaming/scheduledtestrun/scheduled-test-run-resource-update-scheduled-test-run-status`)
- `ai-security` — `GET /api/v2/test-cases/{testCaseResultId}` (`ai-security/airedteaming/testcaseresult/test-case-result-resource-get-test-case-result`)
- `ai-security` — `PUT /api/v2/test-cases/{testCaseResultId}/include-in-report` (`ai-security/airedteaming/testcaseresult/test-case-result-resource-set-test-case-include-in-report`)
- `ai-security` — `POST /api/v2/test-runs/{testRunId}/cancel-test-run` (`ai-security/airedteaming/testrun/test-run-resource-cancel-test-run`)
- `ai-security` — `POST /api/v2/test-runs/{testRunId}/continue` (`ai-security/airedteaming/testrun/test-run-resource-continue-test-run`)
- `ai-security` — `DELETE /api/v2/test-runs/{testRunId}` (`ai-security/airedteaming/testrun/test-run-resource-delete-test-run`)
- `ai-security` — `GET /api/v2/test-runs/{testRunId}` (`ai-security/airedteaming/testrun/test-run-resource-get-test-run`)
- `ai-security` — `GET /api/v2/test-runs/{testRunId}/probe-categories` (`ai-security/airedteaming/testrun/test-run-resource-list-test-run-probe-categories`)
- `ai-security` — `POST /api/v2/test-runs/{testRunId}/probe-run-details` (`ai-security/airedteaming/testrun/test-run-resource-list-test-run-probe-run-details`)
- `ai-security` — `POST /api/v2/test-runs/{testRunId}/probe-runs` (`ai-security/airedteaming/testrun/test-run-resource-list-test-run-probe-runs`)
- `ai-security` — `POST /api/v2/test-runs/history` (`ai-security/airedteaming/testrun/test-run-resource-list-test-runs`)
- `ai-security` — `PUT /api/v2/test-runs/{testRunId}` (`ai-security/airedteaming/testrun/test-run-resource-update-test-run`)
- `ai-security` — `POST /api/v2/remediation/assets/prompt-hardening/start-new` (`ai-security/airedteaming/trigger/trigger-resource-start-new-asset-prompt-hardening`)
- `ai-security` — `POST /api/v2/remediation/ai-apps/{aiAppId}/prompt-hardening/trigger` (`ai-security/airedteaming/trigger/trigger-resource-trigger-ai-app-prompt-hardening`)
- `ai-security` — `POST /api/v2/test-runs/trigger-new-run` (`ai-security/airedteaming/trigger/trigger-resource-trigger-new-test-run`)
- `ai-security` — `POST /api/v2/probe-run/{probeRunId}/ai-analysis/trigger` (`ai-security/airedteaming/trigger/trigger-resource-trigger-probe-run-ai-analysis`)
- `ai-security` — `POST /api/v2/remediation/prompt-hardening/trigger` (`ai-security/airedteaming/trigger/trigger-resource-trigger-prompt-hardening`)

### Per-operation removals

- None.

### Route corrections

- None.

### Schema changes

- `ai-security` / `ai-security/aisecurity/v1-assets-datastores/datastores-list-datastores` — `response_schema` +0 −0 Δ1
  - `response_schema` metadata changed: `data[].sanction_status`
- `ai-security` / `ai-security/aisecurity/v1-assets-datastores/datastores-get-datastore` — `response_schema` +0 −0 Δ1
  - `response_schema` metadata changed: `sanction_status`
- `ai-security` / `ai-security/aisecurity/v1-assets-identities/identities-list-identities` — `query_params` +0 −1 Δ0
  - `query_params` removed: `id`
- `ai-security` / `ai-security/aisecurity/v1-assets-mcpservers/mcp-servers-list-mcp-servers` — `query_params` +0 −0 Δ2; `response_schema` +0 −1 Δ2; schema titles Δ1
  - `query_params` metadata changed: `sanction_status`, `type`
  - `response_schema` removed: `data[].path`
  - `response_schema` metadata changed: `data[].sanction_status`, `data[].type`
- `ai-security` / `ai-security/aisecurity/v1-assets-mcpservers/mcp-servers-get-mcp-server` — `response_schema` +0 −1 Δ2; schema titles Δ1
  - `response_schema` removed: `path`
  - `response_schema` metadata changed: `sanction_status`, `type`
- `ai-security` / `ai-security/aisecurity/v1-assets-workloads/workloads-list-workloads` — `response_schema` +0 −0 Δ1
  - `response_schema` metadata changed: `data[].sanction_status`
- `ai-security` / `ai-security/aisecurity/v1-assets-workloads/workloads-get-workload` — `response_schema` +0 −0 Δ1
  - `response_schema` metadata changed: `sanction_status`
- `zdx` / `zdx/application-management/application-resource-create-application-monitor` — discriminator mappings +WEB across 9 schema location(s); schema titles Δ28
  - Discriminator `type` at `request_body`: added `WEB`
  - Discriminator `type` at `response_schema[201].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[201].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[201].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[201].properties.probe.anyOf[3].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[202].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[202].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[202].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[202].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-create-predefined-app-monitor` — discriminator mappings +WEB across 9 schema location(s); schema titles Δ28
  - Discriminator `type` at `request_body`: added `WEB`
  - Discriminator `type` at `response_schema[201].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[201].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[201].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[201].properties.probe.anyOf[3].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[202].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[202].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[202].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[202].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-delete-application-monitor` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-delete-predefined-app-monitor` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-get-application-monitor` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-get-application-monitor-summary` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-get-predefined-app-monitor` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-get-predefined-app-monitor-summary` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-list-application-monitor-summaries` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-list-application-monitors` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-list-predefined-app-monitor-summaries` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-list-predefined-app-monitors` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-update-application-monitor` — discriminator mappings +WEB across 5 schema location(s); schema titles Δ16
  - Discriminator `type` at `request_body`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/application-resource-update-predefined-app-monitor` — discriminator mappings +WEB across 5 schema location(s); schema titles Δ16
  - Discriminator `type` at `request_body`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/monitor-resource-delete-monitor` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/monitor-resource-get-monitor` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/monitor-resource-get-monitor-summary` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/monitor-resource-list-monitor-summaries` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/monitor-resource-list-monitors` — discriminator mappings +WEB across 4 schema location(s); schema titles Δ12
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].items.properties.probe.anyOf[3].allOf[0]`: added `WEB`
- `zdx` / `zdx/application-management/monitor-resource-update-monitor` — discriminator mappings +WEB across 5 schema location(s); schema titles Δ16
  - Discriminator `type` at `request_body`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[0].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[1].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[2].allOf[0]`: added `WEB`
  - Discriminator `type` at `response_schema[200].properties.probe.anyOf[3].allOf[0]`: added `WEB`

## Field Totals

### `path_params`

- Existing top-level fields across common ops: 904
- Blob top-level fields across common ops: 904
- Blob flattened fields across common ops: 904
- Blob nested fields across common ops: 0
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 0

### `query_params`

- Existing top-level fields across common ops: 1394
- Blob top-level fields across common ops: 1393
- Blob flattened fields across common ops: 1393
- Blob nested fields across common ops: 0
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 1

### `request_body`

- Existing top-level fields across common ops: 4586
- Blob top-level fields across common ops: 4586
- Blob flattened fields across common ops: 16696
- Blob nested fields across common ops: 12148
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 0

### `response_schema`

- Existing top-level fields across common ops: 11142
- Blob top-level fields across common ops: 11141
- Blob flattened fields across common ops: 39852
- Blob nested fields across common ops: 31779
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 1

## Live-Only Samples

### `ai-security`
- `ai-security/airedteaming/aiapp/ai-app-resource-create-ai-app`
- `ai-security/airedteaming/aiapp/ai-app-resource-delete-ai-app`
- `ai-security/airedteaming/aiapp/ai-app-resource-duplicate-ai-app`
- `ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app`
- `ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app-latest-probe-runs`
- `ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app-risk-level-timeseries`
- `ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app-settings`
- `ai-security/airedteaming/aiapp/ai-app-resource-get-ai-app-test-run-metrics`
- `ai-security/airedteaming/aiapp/ai-app-resource-list-ai-app-available-probes`
- `ai-security/airedteaming/aiapp/ai-app-resource-list-ai-app-test-run-available-probes`
- `ai-security/airedteaming/aiapp/ai-app-resource-list-ai-app-test-runs`
- `ai-security/airedteaming/aiapp/ai-app-resource-list-ai-apps`
- `ai-security/airedteaming/aiapp/ai-app-resource-update-ai-app`
- `ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-agentforce-integration`
- `ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-anthropic-integration`
- `ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-azure-bot-integration`
- `ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-azure-ml-integration`
- `ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-azure-open-ai-integration`
- `ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-bedrock-integration`
- `ai-security/airedteaming/aiapptestintegration/ai-app-test-integration-resource-test-copilot-studio-integration`

## Loose Method/Path-Only Samples

### `ai-security`
- Live-only loose signatures:
  - `DELETE /api/v2/ai-apps/{}`
  - `DELETE /api/v2/scheduled-test-runs/{}`
  - `DELETE /api/v2/test-runs/{}`
  - `GET /api/v2/ai-apps/{}`
  - `GET /api/v2/ai-apps/{}/available-probes`
  - `GET /api/v2/ai-apps/{}/latest-probe-runs`
  - `GET /api/v2/ai-apps/{}/probe-settings`
  - `GET /api/v2/ai-apps/{}/probe-settings/{}`
  - `GET /api/v2/ai-apps/{}/settings`
  - `GET /api/v2/ai-apps/{}/test-run-available-probes`

### `aiguard`
- Existing-only loose signatures:
  - `DELETE /detections/policies/{}`
  - `DELETE /detections/policy-match-rules/{}`
  - `DELETE /llm-application-credentials/{}`
  - `DELETE /llm-applications/{}`
  - `DELETE /llm-provider-credentials/{}`
  - `DELETE /llm-providers/{}`
  - `GET /detections/policies`
  - `GET /detections/policies/name/{}`
  - `GET /detections/policies/{}`
  - `GET /detections/policies/{}/referential-check`

## Nested Schema Examples

### `ai-security/aisecurity/v1-assets-datastores/datastores-list-datastores` / `response_schema`
- Blob nested fields (9):
  - `data[].cloud_account_id`
  - `data[].environment`
  - `data[].id`
  - `data[].last_scanned_at`
  - `data[].name`
  - `data[].risk_level`
  - `data[].sanction_status`
  - `data[].source`
  - `data[].source_type`

### `ai-security/aisecurity/v1-assets-identities/identities-list-identities` / `response_schema`
- Blob nested fields (8):
  - `data[].access_category`
  - `data[].cloud_account_id`
  - `data[].environment`
  - `data[].id`
  - `data[].last_discovered_at`
  - `data[].name`
  - `data[].risk_level`
  - `data[].type`

### `ai-security/aisecurity/v1-assets-mcpservers/mcp-servers-list-mcp-servers` / `response_schema`
- Blob nested fields (15):
  - `data[].associated_source`
  - `data[].associated_source_type`
  - `data[].cloud_account_id`
  - `data[].environment`
  - `data[].id`
  - `data[].last_discovered_at`
  - `data[].name`
  - `data[].region`
  - `data[].risk_indicators`
  - `data[].risk_level`
  - `data[].risk_score`
  - `data[].sanction_status`

### `ai-security/aisecurity/v1-assets-mcpservers/mcp-servers-get-mcp-server-tools` / `response_schema`
- Blob nested fields (9):
  - `data[].code_execution`
  - `data[].description`
  - `data[].file_access`
  - `data[].file_path`
  - `data[].line_number`
  - `data[].name`
  - `data[].network_access`
  - `data[].parameters`
  - `data[].process_access`

### `ai-security/aisecurity/v1-assets-workloads/workloads-list-workloads` / `response_schema`
- Blob nested fields (9):
  - `data[].cloud_account_id`
  - `data[].environment`
  - `data[].id`
  - `data[].last_scanned_at`
  - `data[].name`
  - `data[].risk_level`
  - `data[].sanction_status`
  - `data[].source`
  - `data[].source_type`

### `ai-security/aisecurity/v1-issues/issues-list-issues` / `response_schema`
- Blob nested fields (15):
  - `data[].action_type`
  - `data[].age`
  - `data[].cloud_account_id`
  - `data[].detected_at`
  - `data[].environment`
  - `data[].id`
  - `data[].last_updated_at`
  - `data[].policy_categories`
  - `data[].policy_id`
  - `data[].policy_name`
  - `data[].severity`
  - `data[].source`

### `bi/custom-applications/create-custom-app` / `request_body`
- Blob nested fields (3):
  - `signatures[].matchLevel`
  - `signatures[].type`
  - `signatures[].value`

### `bi/custom-applications/create-custom-app` / `response_schema`
- Blob nested fields (9):
  - `[].associatedAppCategory`
  - `[].associatedAppName`
  - `[].description`
  - `[].id`
  - `[].name`
  - `[].signatures`
  - `[].signatures[].matchLevel`
  - `[].signatures[].type`
  - `[].signatures[].value`

### `bi/custom-applications/get-custom-apps` / `response_schema`
- Blob nested fields (9):
  - `[].associatedAppCategory`
  - `[].associatedAppName`
  - `[].description`
  - `[].id`
  - `[].name`
  - `[].signatures`
  - `[].signatures[].matchLevel`
  - `[].signatures[].type`
  - `[].signatures[].value`

### `bi/custom-applications/update-custom-app` / `request_body`
- Blob nested fields (3):
  - `signatures[].matchLevel`
  - `signatures[].type`
  - `signatures[].value`

### `bi/custom-applications/update-custom-app` / `response_schema`
- Blob nested fields (3):
  - `signatures[].matchLevel`
  - `signatures[].type`
  - `signatures[].value`

### `bi/report-configurations/create-report-configuration-custom-apps` / `request_body`
- Blob nested fields (21):
  - `backfill_params.etime`
  - `backfill_params.granularity`
  - `backfill_params.stime`
  - `backfill_params.timezone`
  - `custom_apps[].associatedAppCategory`
  - `custom_apps[].associatedAppName`
  - `custom_apps[].description`
  - `custom_apps[].id`
  - `custom_apps[].name`
  - `custom_apps[].signatures`
  - `custom_apps[].signatures[].matchLevel`
  - `custom_apps[].signatures[].type`

### `bi/report-configurations/create-report-configuration-custom-apps` / `response_schema`
- Blob nested fields (33):
  - `[].backfill_params`
  - `[].backfill_params.etime`
  - `[].backfill_params.granularity`
  - `[].backfill_params.stime`
  - `[].backfill_params.timezone`
  - `[].custom_apps`
  - `[].custom_apps[].associatedAppCategory`
  - `[].custom_apps[].associatedAppName`
  - `[].custom_apps[].description`
  - `[].custom_apps[].id`
  - `[].custom_apps[].name`
  - `[].custom_apps[].signatures`

### `bi/report-configurations/get-report-configurations-custom-apps` / `response_schema`
- Blob nested fields (33):
  - `[].backfill_params`
  - `[].backfill_params.etime`
  - `[].backfill_params.granularity`
  - `[].backfill_params.stime`
  - `[].backfill_params.timezone`
  - `[].custom_apps`
  - `[].custom_apps[].associatedAppCategory`
  - `[].custom_apps[].associatedAppName`
  - `[].custom_apps[].description`
  - `[].custom_apps[].id`
  - `[].custom_apps[].name`
  - `[].custom_apps[].signatures`

### `bi/report-configurations/update-report-configuration-custom-apps` / `request_body`
- Blob nested fields (21):
  - `backfill_params.etime`
  - `backfill_params.granularity`
  - `backfill_params.stime`
  - `backfill_params.timezone`
  - `custom_apps[].associatedAppCategory`
  - `custom_apps[].associatedAppName`
  - `custom_apps[].description`
  - `custom_apps[].id`
  - `custom_apps[].name`
  - `custom_apps[].signatures`
  - `custom_apps[].signatures[].matchLevel`
  - `custom_apps[].signatures[].type`
