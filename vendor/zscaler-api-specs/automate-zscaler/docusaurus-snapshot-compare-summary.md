# Automate Docusaurus Snapshot

Captured at: `2026-06-25T12:17:44.746191+00:00`
Main JS: `https://automate.zscaler.com/assets/js/main.ef5ac224.js`
Runtime JS: `https://automate.zscaler.com/assets/js/runtime~main.44cf9eb6.js`

## Summary

- Routes discovered: **1169**
- API MDX route candidates matched: **1169 / 1169**
- API blobs decoded: **1169**
- Decode failures: **0**
- Existing committed contract ops: **1169**
- Live-only route keys: **0**
- Existing-only route keys: **0**
- Live-only loose method/path signatures: **0**
- Existing-only loose method/path signatures: **0**

## Product Counts

| product | live blobs | existing scrape | route-key common ops | loose path common sigs | live-only route keys | existing-only route keys | request nested | response nested |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `aiguard` | 45 | 45 | 45 | 44 | 0 | 0 | 30 | 138 |
| `bi` | 10 | 10 | 10 | 10 | 0 | 0 | 48 | 116 |
| `easm` | 11 | 11 | 11 | 11 | 0 | 0 | 0 | 79 |
| `event-monitoring` | 10 | 10 | 10 | 10 | 0 | 0 | 18 | 55 |
| `zcc` | 54 | 54 | 54 | 54 | 0 | 0 | 481 | 568 |
| `zcell` | 36 | 36 | 36 | 36 | 0 | 0 | 14 | 189 |
| `zcloudconnector` | 165 | 165 | 165 | 165 | 0 | 0 | 2358 | 5678 |
| `zdx` | 148 | 148 | 148 | 129 | 0 | 0 | 562 | 5947 |
| `zia` | 471 | 471 | 471 | 471 | 0 | 0 | 3249 | 9699 |
| `zid` | 31 | 31 | 31 | 29 | 0 | 0 | 24 | 265 |
| `zpa` | 188 | 188 | 188 | 188 | 0 | 0 | 6455 | 11328 |

## Field Totals

### `path_params`

- Existing top-level fields across common ops: 909
- Blob top-level fields across common ops: 909
- Blob flattened fields across common ops: 909
- Blob nested fields across common ops: 0
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 0

### `query_params`

- Existing top-level fields across common ops: 1331
- Blob top-level fields across common ops: 1331
- Blob flattened fields across common ops: 1331
- Blob nested fields across common ops: 0
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 0

### `request_body`

- Existing top-level fields across common ops: 4732
- Blob top-level fields across common ops: 4732
- Blob flattened fields across common ops: 17933
- Blob nested fields across common ops: 13239
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 0

### `response_schema`

- Existing top-level fields across common ops: 11298
- Blob top-level fields across common ops: 11298
- Blob flattened fields across common ops: 42297
- Blob nested fields across common ops: 34062
- Blob top-level fields new vs committed contract: 0
- Committed contract top-level fields missing from blob: 0

## Live-Only Samples

## Loose Method/Path-Only Samples

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
- Blob nested fields (8):
  - `inputDetectorPolicies[].configuration`
  - `inputDetectorPolicies[].detector`
  - `inputDetectorPolicies[].enabled`
  - `inputDetectorPolicies[].severity`
  - `outputDetectorPolicies[].configuration`
  - `outputDetectorPolicies[].detector`
  - `outputDetectorPolicies[].enabled`
  - `outputDetectorPolicies[].severity`

### `aiguard/detection-policies/detections-policy-resource-enable-detections-policy` / `response_schema`
- Blob nested fields (8):
  - `inputDetectorPolicies[].configuration`
  - `inputDetectorPolicies[].detector`
  - `inputDetectorPolicies[].enabled`
  - `inputDetectorPolicies[].severity`
  - `outputDetectorPolicies[].configuration`
  - `outputDetectorPolicies[].detector`
  - `outputDetectorPolicies[].enabled`
  - `outputDetectorPolicies[].severity`

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
