---
product: zpa
topic: "zpa-baseline-audit"
title: "ZPA Baseline Audit — MCP read-only compliance workflow"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: code
verified-against:
  vendor/zscaler-mcp-server: a2162c384e1ffb68b3bf14783ea9a1a762c85ff5
sources:
  - "vendor/zscaler-mcp-server/CHANGELOG.md"
  - "vendor/zscaler-mcp-server/skills/zpa/audit-baseline-compliance/SKILL.md"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zpa/lss.py"
author-status: draft
---

# ZPA Baseline Audit

The vendor MCP server includes a ZPA baseline compliance skill that inventories ZPA configuration through read-only MCP tools and emits a local report. Treat it as an automation pattern for configuration posture review, not as tenant telemetry or an enforcement mechanism.

## Workflow boundary

Source: `vendor/zscaler-mcp-server/skills/zpa/audit-baseline-compliance/SKILL.md`.

Hard limits from the workflow:

- Read-only only. The workflow must not mutate ZPA state.
- Configuration inventory only. It does not prove live user connectivity, connector runtime health, SIEM receipt, or traffic freshness.
- No external network calls from the generated report except optional CDN script loads used by the local HTML view.
- Findings must distinguish pass, warning, fail, and cannot-audit states so unavailable telemetry is not presented as clean posture.

This makes the workflow useful for "are the expected objects and policy shapes present?" and weak for "is the environment currently healthy?"

## Inventory inputs

The workflow's inventory sweep uses ZPA MCP tools across:

| Area | Tool families |
|---|---|
| App Connectors | `zpa_list_app_connectors`, `zpa_list_app_connector_groups` |
| Server Groups | `zpa_list_server_groups` |
| Application Segments | `zpa_list_application_segments`, `zpa_list_segment_groups` |
| Access Policy | `zpa_list_access_rules` |
| Forwarding Policy | `zpa_list_forwarding_rules` |
| Timeout Policy | `zpa_list_timeout_rules` |
| Log Receivers | `zpa_list_lss_configs`, `zpa_list_lss_log_types`, `zpa_list_lss_status_codes`, `zpa_list_lss_client_types` |

The skill requires pagination-aware reads and records per-call errors instead of silently dropping object families. That matters for posture reporting: a failed inventory call should become an explicit finding or collection error, not a missing-object pass.

## Finding model

Each finding is expected to carry:

- Stable `id`.
- `category`.
- `severity`: `pass`, `warn`, `fail`, or `cannot_audit`.
- Human-readable title and description.
- Evidence object with the observed configuration.
- Documentation reference.
- Remediation text.
- `heuristic` flag when the check is inferred rather than directly proven.
- Framework tags where relevant.

Use this shape when we turn the workflow into native skill output or an overlay report. It gives us enough structure to preserve uncertainty instead of flattening everything into prose.

## Baseline categories

The workflow groups checks around core ZPA control surfaces:

- **Connectors** — connector and connector-group inventory, group membership, and high-level availability shape.
- **Server Groups** — delivery-group coverage and orphan risks.
- **Segments** — application segment inventory, segment-group membership, and segmentation hygiene.
- **Access Policy** — default posture, overly broad allow rules, and identity/condition scoping.
- **Forwarding Policy** — forwarding rule presence and catch-all behavior.
- **Timeout Policy** — idle/session timeout coverage.
- **LSS** — configuration presence, stream type coverage, and catalog availability.
- **Cannot Audit** — runtime or downstream telemetry assertions that the config-only workflow cannot prove.

Do not present the skill as a complete ZPA health check. It is a baseline posture inventory with explicit blind spots.

## LSS checks

Source: `vendor/zscaler-mcp-server/skills/zpa/audit-baseline-compliance/SKILL.md`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zpa/lss.py`.

The LSS portion checks whether LSS configs exist and whether common feed/catalog information can be enumerated. It can inspect LSS configuration objects and supported log metadata, but it cannot verify that:

- The LSS Connector is currently delivering logs to a SIEM.
- The SIEM is receiving and parsing events.
- TLS handshake, certificate trust, or downstream network path is healthy.
- Log volume is adequate for detection requirements.
- Feeds are fresh in the last N minutes.

Those assertions need connector telemetry, SIEM-side evidence, or tenant snapshots outside the MCP configuration inventory.

## Output artifacts

The vendor workflow emits two local artifacts:

- A single-file HTML report for review.
- A React JSX component representation for reuse in UI contexts.

If the HTML form is used in an offline or restricted environment, verify whether CDN-loaded scripts are acceptable. The workflow calls out that the local report may depend on external CDN assets unless adapted.

## When not to use

Do not use this baseline audit workflow when the task is to:

- Prove live user access or live connector forwarding.
- Query or validate historical ZPA traffic logs.
- Remediate policy automatically.
- Conduct a full security assessment that requires runtime telemetry, SIEM evidence, vulnerability data, or business context.

Use it as the first configuration-pass in a broader review, then layer tenant snapshots and operational telemetry where the findings say `cannot_audit`.

## Cross-links

- ZPA reference hub — [`./index.md`](./index.md)
- App Connectors — [`./app-connector.md`](./app-connector.md)
- Segment and Server Groups — [`./segment-server-groups.md`](./segment-server-groups.md)
- Policy precedence — [`./policy-precedence.md`](./policy-precedence.md)
- Log Receivers — [`./log-receivers.md`](./log-receivers.md)
- MCP runtime boundary — [`../shared/mcp-runtime.md`](../shared/mcp-runtime.md)
