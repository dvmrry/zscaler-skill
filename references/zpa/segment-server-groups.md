---
product: zpa
topic: "segment-server-groups"
title: "Segment Groups and Server Groups — ZPA's two grouping primitives"
content-type: reasoning
last-verified: "2026-04-25"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zpa/segment_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/server_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/servers.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/segment_group.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/server_group.py"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_segment_group.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_server_group.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment.go"
author-status: draft
---

# Segment Groups and Server Groups — ZPA's two grouping primitives

ZPA has two different grouping objects with similar-sounding names that serve completely different purposes. Confusing them is one of the most common sources of misconfiguration.

**Segment Group** — a policy-scoping container for App Segments. It does not affect traffic routing. Its role is to give policy rules a stable, named handle to target a set of applications — "apply this access rule to the HR apps." A Segment Group holds a list of App Segments (`applications` array in the API/model). Policy rules reference Segment Groups via the `APP_GROUP` object type in their condition operands. Source: `resource_zpa_segment_group.go` — the detach helper explicitly searches for `objectType == "APP_GROUP"` operands when a Segment Group is deleted.

**Server Group** — a traffic-delivery container for backend servers. It binds a list of App Connector Groups (`appConnectorGroups`) to a set of backend endpoints (either an explicit server list or dynamically discovered servers). When ZPA brokers a connection, it selects a connector from one of the Connector Groups associated with the segment's Server Group and routes traffic to the backend servers in that group. Source: `server_groups.py` `add_group` docstring; `resource_zpa_server_group.go` `expandServerGroup`.

## The four-way relationship

```
Access Policy Rule
    └─ condition: APP_GROUP → Segment Group
                                   └─ App Segment  ──────────────────┐
                                        ├─ segment_group_id (one)    │ policy binding
                                        └─ serverGroups[] (one+)     │
                                                │                     │
                                                ▼                     │
                                         Server Group                 │
                                              ├─ appConnectorGroups[] │
                                              │       └─ Connector Group
                                              └─ servers[] (if !dynamicDiscovery)
```

In table form:

| Object | Holds reference to | Role |
|---|---|---|
| App Segment | one `segment_group_id` + one-or-more `serverGroups[]` | the bridging object |
| Segment Group | `applications[]` (App Segments) | policy scoping |
| Server Group | `appConnectorGroups[]` + optionally `servers[]` | traffic delivery |
| Connector Group | (referenced by Server Group) | connector selection |

The App Segment is the junction point: it carries both the Segment Group reference (controls policy targeting) and the Server Group reference (controls which connectors and backends handle the traffic). These are independent axes — you can change which Connector Group handles traffic by swapping Server Groups without touching any policy rules, and vice versa.

## Segment Group mechanics

A Segment Group is a lightweight wrapper: `id`, `name`, `description`, `enabled`, and an `applications` list. The `applications` list is bidirectionally maintained — App Segments carry `segment_group_id` and the Segment Group carries `applications[]` listing those same App Segments.

**How policy rules use it:** ZPA access rules (ACCESS_POLICY, TIMEOUT_POLICY, CLIENT_FORWARDING_POLICY, INSPECTION_POLICY) scope application targeting through conditions with `objectType = APP_GROUP`. The condition's operand value is the Segment Group ID. Source: `resource_zpa_segment_group.go` `detachSegmentGroupFromAllPolicyRules` — it scans all five policy types for `APP_GROUP` conditions referencing the group's ID before deletion.

**The `enabled` toggle:** Tier-D inference — disabling a Segment Group likely prevents policy rules scoped to it from matching, making all its App Segments effectively unreachable via those rules. This is not confirmed from source code alone.

## Server Group mechanics

A Server Group carries:
- `appConnectorGroups[]` — which Connector Groups can broker connections for this group's apps. At least one is required. Source: `server_groups.py` `add_group` docstring: `app_connector_group_ids` is listed as a required arg.
- `dynamicDiscovery` (bool, default `True`) — controls how backend servers are discovered.
- `servers[]` — explicit Application Server objects. Only used when `dynamicDiscovery=False`.
- `ipAnchored` — enables IP anchoring; source IPs visible to the backend are the connector's IP.
- `weight` — used for weighted load balancing across Server Groups (see `application_segment.py` `update_weighted_lb_config`).

**Dynamic discovery mode (`dynamicDiscovery=True`):** ZPA discovers backend servers from DNS resolution of the App Segment's `domain_names` at connection time. No pre-registered server objects are required. The `servers[]` array must be empty in this mode. Source: `resource_zpa_server_group.go` lines 208–215: TF enforces that `len(req.Servers) > 0 && req.DynamicDiscovery` is a validation error, and `!req.DynamicDiscovery && len(req.Servers) == 0` is also a validation error.

**Explicit server mode (`dynamicDiscovery=False`):** Backend servers must be pre-registered as Application Server objects (`/server` endpoint, `servers.py`) and assigned to the Server Group via `server_ids`. In this mode the `servers[]` array must be non-empty.

## Gotchas

**1. An App Segment without a Segment Group is not policy-targetable.**
The TF schema marks `segment_group_id` as `Optional + Computed` (`resource_zpa_application_segment.go` line 63–67), meaning TF won't error on a missing value. However, if no Segment Group is assigned, no policy rule using `APP_GROUP` conditions can match the segment — it will be inaccessible. This is the "orphan App Segment" condition: the segment exists, the API accepts it, but end users cannot reach the application because no access rule matches it. Always verify `segment_group_id` is set and that the referenced Segment Group is attached to at least one enabled access policy rule.

**2. Server Group requires at least one Connector Group.**
Source (Tier A): `server_groups.py` `add_group` lists `app_connector_group_ids` as a required parameter. The TF resource does not declare `app_connector_groups` as `Required` in its schema (it is `Optional`), but the ZPA API itself will reject a Server Group with an empty `appConnectorGroups` array. A Server Group with no Connector Group is a traffic dead-end: ZPA has no connector to proxy through.

**3. Dynamic discovery and explicit servers are mutually exclusive.**
You cannot have both `dynamicDiscovery=True` and a non-empty `servers[]`. The TF provider enforces this at plan time (source: `resource_zpa_server_group.go` lines 208–215). The Python SDK `update_group` method defaults `dynamicDiscovery` to `True` if the key is absent from the body (`server_groups.py` line 276–277: `if "dynamicDiscovery" not in body: body["dynamicDiscovery"] = True`). This default can silently clear explicit server lists on an update if `dynamicDiscovery` is not explicitly passed as `False`.

**4. Removing a Connector Group from a Server Group immediately affects all in-flight and new connections.**
Tier-D inference — not verifiable from source code, but follows from the architecture: the Server Group → Connector Group binding is the only path ZPA uses to select a connector for traffic destined to that group's apps. Removing the last Connector Group from a Server Group leaves no valid connector path; new connections will fail. Pre-existing sessions may persist until timeout depending on session state. Validate Connector Group membership before any Server Group update in production.

**5. Deleting a Server Group silently detaches it from App Segments.**
Source (Tier A): `resource_zpa_server_group.go` `resourceServerGroupDelete` calls `detachServerGroupFromAllAppSegments` before deletion (lines 317–318). This modifies every App Segment that references the deleted Server Group — potentially leaving those App Segments with an empty `serverGroups[]`, which is the same traffic dead-end described above for missing Connector Groups. The TF provider handles this automatically during TF-managed deletion, but a manual API deletion (via SDK or direct API call) does not guarantee equivalent cleanup.

**6. Deleting a Segment Group silently removes it from policy rules.**
Source (Tier A): `resource_zpa_server_group.go`... correction — `resource_zpa_segment_group.go` `resourceSegmentGroupDelete` calls `detachSegmentGroupFromAllPolicyRules` before deletion (line 212). This walks all five policy types (ACCESS, TIMEOUT, SIEM, CLIENT_FORWARDING, INSPECTION) across both v1 and v2 API endpoints. Same caveat as above: TF handles this; SDK/direct API deletion does not.

**7. An App Segment can reference multiple Server Groups.**
Source (Tier A): `application_segment.py` `add_segment` accepts `server_group_ids` as a list, transformed to `serverGroups: [{id: ...}, ...]`. The TF resource reflects this as a list type. Multiple Server Groups on one App Segment enables weighted load balancing — each group can carry a `weight` and `passive` flag via `update_weighted_lb_config`. Without explicit weighted LB config, behavior across multiple Server Groups is unspecified in source code (Tier D: likely round-robin or first-match, but unconfirmed).

**8. Python SDK Server Group model omits `servers[]`.**
Source (Tier A): `vendor/zscaler-sdk-python/zscaler/zpa/models/server_group.py` does not include a `servers` field. The model carries `applications`, `appConnectorGroups`, and the dynamicDiscovery flag, but explicit-server mode requires constructing the `servers` list manually — `request_format()` won't serialize it because the model doesn't know about it. The TF provider Go schema *does* model `servers`, so TF-managed deployments work fine. Python SDK callers using explicit-server mode must bypass `request_format()` and assemble the JSON body directly. Operationally: prefer dynamic discovery when using the Python SDK; use TF for explicit-server requirements.

## Cross-links

- App Segments — domain names, port ranges, Multimatch INCLUSIVE/EXCLUSIVE, specificity matching: [`./app-segments.md`](./app-segments.md)
- App Connectors and Connector Groups — VM model, provisioning keys, groups: [`./app-connector.md`](./app-connector.md)
- Policy rules that consume Segment Groups: [`./policy-precedence.md`](./policy-precedence.md)
