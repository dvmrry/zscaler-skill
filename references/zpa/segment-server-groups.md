---
product: zpa
topic: "segment-server-groups"
title: "Segment Groups and Server Groups — ZPA's two grouping primitives"
content-type: reasoning
last-verified: "2026-04-28"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/about-segment-groups.md"
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

**Segment Group** — a policy-scoping container for App Segments. It does not affect traffic routing. Its role is to give policy rules a stable, named handle to target a set of applications — "apply this access rule to the HR apps." (Tier A — vendor/zscaler-help/about-segment-groups.md: "This allows you to configure user access policies based on segment groups.") A Segment Group holds a list of App Segments (`applications` array in the API/model). Policy rules reference Segment Groups via the `APP_GROUP` object type in their condition operands.

**Server Group** — a traffic-delivery container for backend servers. It binds a list of App Connector Groups (`appConnectorGroups`) to a set of backend endpoints (either an explicit server list or dynamically discovered servers). When ZPA brokers a connection, it selects a connector from one of the Connector Groups associated with the segment's Server Group and routes traffic to the backend servers in that group. (Tier A — vendor/zscaler-sdk-python: `server_groups.py` `add_group` docstring; `resource_zpa_server_group.go` `expandServerGroup`.)

## The object hierarchy

The full five-tier relationship:

```
Access Policy Rule
    └─ condition: APP_GROUP → Segment Group         (policy scoping)
                                   └─ App Segment  ──────────────────┐
                                        ├─ segment_group_id (one)    │ policy binding
                                        └─ serverGroups[] (one+)     │
                                                │                     │
                                                ▼                     │
                                         Server Group                 │
                                              ├─ appConnectorGroups[] │
                                              │       └─ App Connector Group
                                              │               └─ App Connectors
                                              └─ servers[] (if !dynamicDiscovery)
```

In table form:

| Object | Holds reference to | Role |
|---|---|---|
| App Segment | one `segment_group_id` + one-or-more `serverGroups[]` | the junction object; carries both axes |
| Segment Group | `applications[]` (App Segments) | policy scoping — groups apps for rule targeting |
| Server Group | `appConnectorGroups[]` + optionally `servers[]` | traffic delivery — which connectors and backends |
| App Connector Group | individual App Connectors | connector selection pool |
| App Connector | (leaf) | the VM/process that proxies traffic to the backend |

The App Segment is the junction point: it carries both the Segment Group reference (controls policy targeting) and the Server Group reference (controls which connectors and backends handle the traffic). These are independent axes — you can change which Connector Group handles traffic by swapping Server Groups without touching any policy rules, and vice versa.

## Why the distinction between Segment Groups and Server Groups matters for policy scoping

When an access policy rule is evaluated, ZPA checks whether the user's requested application belongs to a Segment Group referenced in the rule's conditions (objectType `APP_GROUP`). The Server Group is not consulted during access policy evaluation — it is only consulted during connection brokering (connector selection, backend IP determination).

This separation means:
- A poorly assigned Server Group can allow policy evaluation to succeed (access rule matches, ZPA says "allow") but then fail traffic delivery (no connector path to backend).
- A Segment Group with no App Segments, or App Segments not referenced in any policy rule, is effectively invisible to users — the applications exist in ZPA but no policy allows access to them.

The "all apps in group" vs individual segment targeting question: access policy rules target Segment Groups, not individual App Segments. A policy rule with condition `APP_GROUP = "HR Apps Group"` matches all App Segments in that group. There is no standard policy condition that targets a single App Segment directly — the `APP` objectType in policy conditions refers to individual application objects (clientless apps for Browser Access), not standard App Segments. For standard ZPA access, the correct granularity is Segment Group → all App Segments in the group inherit the rule.

## Segment Group mechanics

A Segment Group is a lightweight wrapper: `id`, `name`, `description`, `enabled`, and an `applications` list. The `applications` list is bidirectionally maintained — App Segments carry `segment_group_id` and the Segment Group carries `applications[]` listing those same App Segments. (Tier A — vendor/zscaler-help/about-segment-groups.md: "you cannot assign an application segment to multiple segment groups.")

**One segment per group constraint.** Each App Segment belongs to exactly one Segment Group. (Tier A — vendor/zscaler-help/about-segment-groups.md: "if you place Salesforce in the 'Sales Applications Group,' you cannot add Salesforce to another group.") This is a hard API constraint. TF enforces it at plan time; attempts to assign the same App Segment to two Segment Groups will fail.

**DNS search domains.** The Segment Group admin page (Resource Management > Application Management > Segment Groups) exposes a DNS search domains field. (Tier A — vendor/zscaler-help/about-segment-groups.md.) This affects how ZCC resolves short hostnames for apps in the group — adding a search domain here appends it when short names are used.

**How policy rules use it:** ZPA access rules (ACCESS_POLICY, TIMEOUT_POLICY, CLIENT_FORWARDING_POLICY, INSPECTION_POLICY) scope application targeting through conditions with `objectType = APP_GROUP`. The condition's operand value is the Segment Group ID. Source (Tier A): `resource_zpa_segment_group.go` `detachSegmentGroupFromAllPolicyRules` — it scans all five policy types for `APP_GROUP` conditions referencing the group's ID before deletion.

**The `enabled` toggle.** Disabling a Segment Group prevents policy rules scoped to it from matching, making all its App Segments effectively unreachable via those rules. (Tier D inference — not confirmed from source code alone, but consistent with the enabled/disabled semantics of all other ZPA objects.)

**Deception integration.** If a Segment Group is configured using Zscaler Deception, the edit and delete options are unavailable in the Admin Console. (Tier A — vendor/zscaler-help/about-segment-groups.md.)

## SDK fields — Segment Group

From `vendor/zscaler-sdk-python/zscaler/zpa/models/segment_group.py` and `segment_groups.py`:

| Python field | Wire key | Notes |
|---|---|---|
| `id` | `id` | Opaque string. Read-only after create. |
| `name` | `name` | Required on create. |
| `description` | `description` | Optional free text. |
| `enabled` | `enabled` | Boolean. Default `true`. |
| `applications` | `applications` | List of `{id, name}` dicts. Managed bidirectionally with App Segment's `segment_group_id`. |
| `policy_migrated` | `policyMigrated` | Internal migration flag. Read-only. |

**SDK service** (`client.zpa.segment_groups`): `list_groups`, `get_group`, `add_group`, `update_group`, `delete_group`. Uses both v1 and v2 endpoints. Delete does not automatically clean up App Segment references unless the TF provider's pre-delete hook runs.

## Server Group mechanics

A Server Group carries:
- `appConnectorGroups[]` — which Connector Groups can broker connections for this group's apps. At least one is required. (Tier A: `server_groups.py` `add_group` docstring: `app_connector_group_ids` is listed as a required arg.)
- `dynamicDiscovery` (bool, default `True`) — controls how backend servers are discovered.
- `servers[]` — explicit Application Server objects. Only used when `dynamicDiscovery=False`.
- `ipAnchored` — enables IP anchoring; source IPs visible to the backend are the connector's IP.
- `weight` — used for weighted load balancing across Server Groups (see `application_segment.py` `update_weighted_lb_config`).

**Dynamic discovery mode (`dynamicDiscovery=True`):** ZPA discovers backend servers from DNS resolution of the App Segment's `domain_names` at connection time. No pre-registered server objects are required. The `servers[]` array must be empty in this mode. (Tier A — `resource_zpa_server_group.go` lines 208–215: TF enforces that `len(req.Servers) > 0 && req.DynamicDiscovery` is a validation error, and `!req.DynamicDiscovery && len(req.Servers) == 0` is also a validation error.)

**Explicit server mode (`dynamicDiscovery=False`):** Backend servers must be pre-registered as Application Server objects (`/server` endpoint, `servers.py`) and assigned to the Server Group via `server_ids`. In this mode the `servers[]` array must be non-empty.

**Connector Group → Connector Group assignment.** The Server Group is the only place in the ZPA object model where the App Connector Group is bound to application traffic. This is the critical link: the Server Group determines which physical or virtual connectors proxy traffic for the App Segments that reference it.

## SDK fields — Server Group

From `vendor/zscaler-sdk-python/zscaler/zpa/models/server_group.py` and `server_groups.py`:

| Python field | Wire key | Notes |
|---|---|---|
| `id` | `id` | Opaque string. Read-only after create. |
| `name` | `name` | Required. |
| `description` | `description` | Optional. |
| `enabled` | `enabled` | Boolean. Default `true`. |
| `dynamic_discovery` | `dynamicDiscovery` | Boolean. Default `true`. Controls server discovery mode. |
| `ip_anchored` | `ipAnchored` | Boolean. Enables IP anchoring for source NAT behavior. |
| `app_connector_group_ids` | reformatted to `appConnectorGroups: [{id}]` | Required; list of Connector Group IDs. The `add_id_groups` utility handles the reformatting. |
| `server_ids` | reformatted to `servers: [{id}]` | Only used when `dynamicDiscovery=False`. |
| `applications` | `applications` | Read-only list of App Segments referencing this Server Group. |

**Note on `servers[]` field in Python SDK model.** The `server_group.py` model does not include a `servers` field. Explicit-server mode requires constructing the `servers` list manually — `request_format()` won't serialize it because the model doesn't know about it. The TF provider Go schema does model `servers`, so TF-managed deployments work fine. Python SDK callers using explicit-server mode must bypass `request_format()` and assemble the JSON body directly. Operationally: prefer dynamic discovery when using the Python SDK; use TF for explicit-server requirements. (Tier A — `vendor/zscaler-sdk-python/zscaler/zpa/models/server_group.py`.)

**SDK service** (`client.zpa.server_groups`): `list_groups`, `get_group`, `add_group`, `update_group`, `delete_group`. `server_ids` and `app_connector_group_ids` are reformatted to nested `{"id": "..."}` structures by `add_id_groups`.

## What breaks when these are misconfigured

### Wrong Server Group → Connector Group assignment

The most common production issue: an App Segment references a Server Group whose `appConnectorGroups[]` contains no connectors capable of reaching the backend. Symptoms:

- ZPA access policy evaluates correctly (rule matches, user appears authorized)
- Connection times out or fails immediately
- App Connector logs show no matching sessions for the expected destination
- LSS User Activity log shows `ConnectionStatus = Close` with no connector-side byte counters

Diagnosis: check `client.zpa.server_groups.get_group(id)` to verify `appConnectorGroups` is populated. Then verify each Connector Group contains at least one `CONNECTED` connector (`client.zpa.app_connectors.list_connectors()` and check `connectionStatus`).

### App Segment without a Segment Group

TF schema marks `segment_group_id` as `Optional + Computed` (`resource_zpa_application_segment.go` line 63–67), meaning TF won't error on a missing value. However, if no Segment Group is assigned, no policy rule using `APP_GROUP` conditions can match the segment — it is inaccessible. This is the "orphan App Segment" condition: the segment exists, the API accepts it, but end users cannot reach the application because no access rule matches it. Always verify `segment_group_id` is set and that the referenced Segment Group is attached to at least one enabled access policy rule.

### Server Group with no Connector Group

Source (Tier A): `server_groups.py` `add_group` lists `app_connector_group_ids` as a required parameter. The TF resource does not declare `app_connector_groups` as `Required` in its schema (it is `Optional`), but the ZPA API itself will reject a Server Group with an empty `appConnectorGroups` array. A Server Group with no Connector Group is a traffic dead-end: ZPA has no connector to proxy through.

### Dynamic discovery and explicit servers are mutually exclusive

You cannot have both `dynamicDiscovery=True` and a non-empty `servers[]`. The TF provider enforces this at plan time (source: `resource_zpa_server_group.go` lines 208–215). The Python SDK `update_group` method defaults `dynamicDiscovery` to `True` if the key is absent from the body (`server_groups.py` line 276–277: `if "dynamicDiscovery" not in body: body["dynamicDiscovery"] = True`). This default can silently clear explicit server lists on an update if `dynamicDiscovery` is not explicitly passed as `False`.

### Removing a Connector Group from a Server Group

Removing the last Connector Group from a Server Group leaves no valid connector path; new connections will fail. (Tier D inference — consistent with architecture.) Pre-existing sessions may persist until timeout depending on session state. Validate Connector Group membership before any Server Group update in production.

### Deleting a Server Group silently detaches from App Segments

Source (Tier A): `resource_zpa_server_group.go` `resourceServerGroupDelete` calls `detachServerGroupFromAllAppSegments` before deletion (lines 317–318). This modifies every App Segment that references the deleted Server Group — potentially leaving those App Segments with an empty `serverGroups[]`. The TF provider handles this automatically during TF-managed deletion, but a manual API deletion (via SDK or direct API call) does not guarantee equivalent cleanup.

### Deleting a Segment Group silently removes it from policy rules

Source (Tier A): `resource_zpa_segment_group.go` `resourceSegmentGroupDelete` calls `detachSegmentGroupFromAllPolicyRules` before deletion (line 212). This walks all five policy types (ACCESS, TIMEOUT, SIEM, CLIENT_FORWARDING, INSPECTION) across both v1 and v2 API endpoints. TF handles this; SDK/direct API deletion does not.

### Multiple Server Groups on one App Segment

Source (Tier A): `application_segment.py` `add_segment` accepts `server_group_ids` as a list, transformed to `serverGroups: [{id: ...}, ...]`. Multiple Server Groups on one App Segment enables weighted load balancing — each group can carry a `weight` and `passive` flag via `update_weighted_lb_config`. Without explicit weighted LB config, behavior across multiple Server Groups is unspecified in source code (Tier D: likely round-robin or first-match, but unconfirmed).

## Verifying the segment → server group → connector chain (snapshot recipe)

A common investigation hypothesis: *"The App Segment exists and is correctly configured, but the Server Group → App Connector Group association is broken or empty."* Use this recipe to verify against snapshot JSON dumps without needing live API access.

### What to check, in order

The chain has four hops, each verifiable against snapshot data. Walk them in order — a break at any hop ends traffic delivery for the segment, so finding one explains the symptom and rules out hops further down.

| # | Check | Snapshot file (typical) | JSON path to inspect |
|---|---|---|---|
| 1 | App Segment exists and matches the destination | `_data/snapshot/<cloud>/zpa/application-segments.json` | `[*]` where `domainNames[]` includes `<destination>` AND `tcpPortRanges[]` covers `<port>` |
| 2 | App Segment references at least one Server Group | same file as 1 | `[*].serverGroups[].id` is non-empty |
| 3 | Each referenced Server Group has at least one App Connector Group | `_data/snapshot/<cloud>/zpa/server-groups.json` | for each id from hop 2: `appConnectorGroups[]` is non-empty |
| 4 | Each referenced App Connector Group has at least one CONNECTED connector | `_data/snapshot/<cloud>/zpa/app-connectors.json` (or per-connector status feed) | filter `appConnectorGroupId == <id from hop 3>` AND `connectionStatus == "CONNECTED"`, count > 0 |

### Mapping findings to hypothesis status

- **Hop 1 fails** (segment doesn't match destination/port) → hypothesis "segment doesn't exist or is misconfigured" is `Confirmed (high)` if snapshot is current.
- **Hop 2 fails** (segment has empty `serverGroups[]`) → "segment has no server group assigned" is `Confirmed (high)`. Usually a config error during creation.
- **Hop 3 fails** (server group has empty `appConnectorGroups[]`) → "server group has no connector group" is `Confirmed (high)`. The ZPA API rejects this on creation, but it can occur after a connector group is deleted out from under the server group (see "Removing a Connector Group from a Server Group" above).
- **Hop 4 fails** (connector group has zero `CONNECTED` connectors) → "all connectors disconnected for serving group" is `Confirmed (medium)` from snapshot alone. Snapshots may be stale; cross-reference live connector health (LSS App Connector Status, or live API) before promoting to `Confirmed (high)`.
- **All four hops pass** → the chain is correctly configured. Move to runtime hypotheses (target reachability per [`./logs/app-connector-metrics.md`](./logs/app-connector-metrics.md) `AliveTargetCount`, policy evaluation per [`./policy-precedence.md`](./policy-precedence.md), ZPA Service Edge selection).

### Worked example

Hypothesis: *"SIPA app segment exists but Server Group → App Connector Group association is missing or incorrect."*

Snapshot files referenced: `_data/snapshot/zs3/zpa/application-segments.json` and `_data/snapshot/zs3/zpa/server-groups.json`.

```bash
# Hop 1+2: find the segment for ssh.dev.azure.com:22 and list its server groups
jq '.[] | select(.domainNames | index("ssh.dev.azure.com")) |
       {name, serverGroups: [.serverGroups[].id]}' \
  _data/snapshot/zs3/zpa/application-segments.json

# Hop 3: for each server group ID returned above, list appConnectorGroups
jq --arg id "<server-group-id>" '.[] | select(.id == $id) |
       {name, appConnectorGroups: [.appConnectorGroups[].id]}' \
  _data/snapshot/zs3/zpa/server-groups.json

# Hop 4: for each connector group ID, count CONNECTED connectors
jq --arg gid "<connector-group-id>" '
  [.[] | select(.appConnectorGroupId == $gid and .connectionStatus == "CONNECTED")]
   | length' \
  _data/snapshot/zs3/zpa/app-connectors.json
```

If any hop returns an empty list or zero, that's the broken hop and the corresponding hypothesis is `Confirmed`.

### Edge cases for the chain

- **Multiple Server Groups on one segment.** A segment can carry multiple `serverGroups[]`. Each is independent — at least one must satisfy hops 3 and 4 for the segment to deliver traffic. If one is healthy and another is broken, weighted load balancing decides which connectors are tried first. See [Multiple Server Groups on one App Segment](#multiple-server-groups-on-one-app-segment) above.
- **Connector group fronting an unreachable target.** Hops 3 and 4 can pass while traffic still fails. That's a runtime hypothesis (target reachability), not a chain hypothesis — see [`./logs/app-connector-metrics.md`](./logs/app-connector-metrics.md) for `AliveTargetCount` semantics and [`./app-connector.md § How sessions are assigned to App Connectors`](./app-connector.md#how-sessions-are-assigned-to-app-connectors) for the eligibility-then-selection model.
- **Snapshot freshness.** The chain's hop 4 reflects connector state at snapshot time. A connector that was `CONNECTED` then may have flipped `DISCONNECTED` since. Always note the snapshot timestamp in the journal when citing this evidence; cross-reference live status if available.
- **Microtenant scoping.** If the tenant uses microtenants, the snapshot may be scoped per microtenant. A segment in microtenant A with a server group in microtenant B is a config error worth flagging.

## Cross-links

- App Segments — domain names, port ranges, Multimatch INCLUSIVE/EXCLUSIVE, specificity matching: [`./app-segments.md`](./app-segments.md)
- App Connectors and Connector Groups — VM model, provisioning keys, groups: [`./app-connector.md`](./app-connector.md)
- App Connector Metrics — `AliveTargetCount`, runtime reachability: [`./logs/app-connector-metrics.md`](./logs/app-connector-metrics.md)
- Policy rules that consume Segment Groups: [`./policy-precedence.md`](./policy-precedence.md)
- SDK service catalog (SegmentGroupsAPI §2.34, ServerGroupsAPI §2.35): [`./sdk.md`](./sdk.md)
