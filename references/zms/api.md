---
product: zms
topic: "zms-api"
title: "ZMS API — GraphQL surface (read-only)"
content-type: reference
last-verified: "2026-06-14"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zms/__init__.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/zms_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/agents.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/agent_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/nonces.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/resources.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/resource_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/policy_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/app_zones.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/app_catalog.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/tags.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/models/enums.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/models/inputs.py"
  - "vendor/zscaler-sdk-python/zscaler/zms/models/common.py"
  - "vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc"
  - "vendor/zscaler-mcp-server/CLAUDE.md"
author-status: draft
---

# ZMS API — GraphQL surface (read-only)

> The conceptual / product framing for ZMS lives in [`./overview.md`](./overview.md). This file documents the **API surface** as recovered from vendor SDK source. Note that `overview.md` predates the SDK landing and states "no SDK module"; this doc supersedes that claim for the API question — the Python SDK now ships a full ZMS service. See [`./index.md`](./index.md).

## Summary

All ZMS operations are **GraphQL over a single endpoint, `POST /zms/graphql`** — every ZMS API class hardcodes `_zms_base_endpoint = '/zms/graphql'` and `http_method = 'POST'` (`vendor/zscaler-sdk-python/zscaler/zms/agents.py:34`, `vendor/zscaler-sdk-python/zscaler/zms/agents.py:133`; identical in `agent_groups.py:33`, `nonces.py:33`, `resources.py:35`, `resource_groups.py:36`, `policy_rules.py:34`, `app_zones.py:33`, `app_catalog.py:33`, `tags.py:42`; also `vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc:8`, `vendor/zscaler-mcp-server/CLAUDE.md:174`). ZMS is **read-only — queries only, no mutations** (`vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc:8`, `vendor/zscaler-mcp-server/CLAUDE.md:170`). Per vendor docs the surface is **9 domains / 20 read tools** (`vendor/zscaler-mcp-server/CLAUDE.md:179-191`, matched by the SDK property set in `vendor/zscaler-sdk-python/zscaler/zms/zms_service.py:36-105`).

**Python-only.** ZMS exists **only in the Python SDK**; the Go SDK has no ZMS service at all (`vendor/zscaler-sdk-go/zscaler/` contains zcc, zdx, zia, zid, zpa, ztw, zwa but no `zms` directory). Every ZMS finding below is therefore **single-source** (Python SDK + MCP rules/CLAUDE.md); the Python-vs-Go field/endpoint cross-check this repo's discipline prefers is not possible for ZMS. See [Open questions](#open-questions).

## Mechanics

### Single endpoint, customer scoping

Every ZMS query is **customer-scoped**: `customerId` is a required GraphQL argument typed `ID!` (passed as the Python `customer_id` positional arg) on all list/get operations (`vendor/zscaler-sdk-python/zscaler/zms/agents.py:78`; same `ID!` typing in `agent_groups.py:75`, `nonces.py:75`, `resources.py:79`, `resource_groups.py:74`, `policy_rules.py:74`, `app_zones.py:73`, `app_catalog.py:73`, `tags.py:82`).

One query breaks the `ID!` pattern: `get_metadata` types its `customerId` as `String!`, not `ID!` (`vendor/zscaler-sdk-python/zscaler/zms/resources.py:257`).

### Pagination — two patterns

ZMS uses two distinct pagination argument names depending on the domain:

| Pattern | GraphQL args | Python params (defaults) | Domains | Citation |
|---|---|---|---|---|
| A | `page:Int`, `pageSize:Int` | `page=1`, `page_size=20` | agents, agent_groups, nonces | `vendor/zscaler-sdk-python/zscaler/zms/agents.py:78-87` & `agents.py:43-44`; `agent_groups.py:75-84` & `agent_groups.py:42-43`; `nonces.py:75-84` & `nonces.py:42-43`; `vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc:11` |
| B | `pageNum:Int`, `pageSize:Int` | `page_num=1`, `page_size=20` | resources, resource_groups, policy_rules, app_zones, app_catalog, tags | `vendor/zscaler-sdk-python/zscaler/zms/resources.py:79` & `resources.py:44-45`; `resource_groups.py:74` & `resource_groups.py:45-46`; `policy_rules.py:74` & `policy_rules.py:43-44`; `app_zones.py:73` & `app_zones.py:42-43`; `app_catalog.py:73` & `app_catalog.py:42-43`; `tags.py:82` & `tags.py:51-52`; `vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc:11` |

Every paginated connection returns the same `pageInfo` selection set — `pageNumber, pageSize, totalCount, totalPages` (`vendor/zscaler-sdk-python/zscaler/zms/agents.py:105-110`; identical block in `agent_groups.py:104-109`, `nonces.py:99-104`, `resources.py:110-115`, `resource_groups.py:105-110`, `policy_rules.py:105-110`, `app_zones.py:91-96`, `app_catalog.py:100-105`, `tags.py:98-103`; the typed `PageInfo` model maps wire keys `pageNumber/pageSize/totalCount/totalPages` in `vendor/zscaler-sdk-python/zscaler/zms/models/common.py:36-39`).

`fetchAll:Boolean` (Python `fetch_all`, default `False`) is implemented **only on `policyRules`** — it bypasses pagination and returns every rule, documented as use-sparingly on large tenants (`vendor/zscaler-sdk-python/zscaler/zms/policy_rules.py:45`, `policy_rules.py:55`, `policy_rules.py:75`, `policy_rules.py:81`; `vendor/zscaler-mcp-server/CLAUDE.md:200`). No other ZMS list method (resources, resource_groups, app_zones, app_catalog, tags, agents, agent_groups, nonces) carries a `fetch_all` argument; no source states `fetchAll` exists elsewhere — see [Open questions](#open-questions).

### Non-numeric identifiers

`eyezId` is the non-numeric identifier for **agents, agent groups, and nonces**. The single-item get queries take `eyezId` typed `String!` (not `ID!`) (`vendor/zscaler-sdk-python/zscaler/zms/agent_groups.py:176`, `vendor/zscaler-sdk-python/zscaler/zms/nonces.py:171`; `vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc:12`; `vendor/zscaler-mcp-server/CLAUDE.md:198`).

## Domains and operations

Per-domain read operations (9 domains, 20 read tools per `vendor/zscaler-mcp-server/CLAUDE.md:179-191`):

| Domain | Read operations | Citation |
|---|---|---|
| Agents | `agents` (paginated list), `agentConnectionStatusStatistics` (aggregate, no pagination — customerId + optional search only), `agentVersionStatistics` (aggregate, no pagination) | `vendor/zscaler-sdk-python/zscaler/zms/agents.py:81`, `agents.py:177`, `agents.py:248`; statistics queries take no page args `agents.py:176`, `agents.py:247` |
| Agent Groups | `agentGroups` (paginated list), `agentGroupTotpSecrets` (single, keyed by eyezId) | `vendor/zscaler-sdk-python/zscaler/zms/agent_groups.py:78`, `agent_groups.py:177-182` |
| Nonces | `nonces` (paginated list), `nonce` (single, keyed by eyezId; payload wrapped as `data.nonce.nonce`) | `vendor/zscaler-sdk-python/zscaler/zms/nonces.py:78`, `nonces.py:172-173`, `nonces.py:213` |
| Resources | `resources` (paginated, filterable + `includeDeleted`), `resourceProtectionStatus` (paginated aggregate), `metadata` (scalar JSON, single customerId arg) | `vendor/zscaler-sdk-python/zscaler/zms/resources.py:78-82`, `resources.py:181-183`, `resources.py:256-259` |
| Resource Groups | `resourceGroups` (paginated, filter), `resourceGroupMembers` (paginated, keyed by id), `resourceGroupProtectionStatus` (paginated aggregate) | `vendor/zscaler-sdk-python/zscaler/zms/resource_groups.py:77`, `resource_groups.py:181`, `resource_groups.py:267` |
| Policy Rules | `policyRules` (paginated, filter, `fetchAll`), `defaultPolicyRules` (paginated, no filter/fetchAll) | `vendor/zscaler-sdk-python/zscaler/zms/policy_rules.py:77`, `policy_rules.py:179` |
| App Zones | `appZones` (paginated, filter + orderBy) | `vendor/zscaler-sdk-python/zscaler/zms/app_zones.py:76` |
| App Catalog | `appCatalog` (paginated, filter + orderBy) | `vendor/zscaler-sdk-python/zscaler/zms/app_catalog.py:76` |
| Tags | `tagNamespaces` (paginated), `tagKeys` (paginated, keyed by namespaceId), `tagValues` (paginated, keyed by tagId + namespaceOrigin) | `vendor/zscaler-sdk-python/zscaler/zms/tags.py:85`, `tags.py:182`, `tags.py:283` |

### Agents

`ListAgents` node selection (agent fields returned): `name, eyezId, connectionStatus, agentType, hostOs, currentSoftwareVersion, upgradeStatus, description, cloudProvider, publicIp, privateIps, adminStatus, agentGroupName, agentGroupType` (`vendor/zscaler-sdk-python/zscaler/zms/agents.py:89-104`).

`agentConnectionStatusStatistics` returns `totalCount, totalPercentage`, and `agentStatuses[]` each with `agentType, connectionStatus, count, percentage` (`vendor/zscaler-sdk-python/zscaler/zms/agents.py:181-189`).

### Agent Groups

`ListAgentGroups` node selection: `name, eyezId, agentGroupType, cloudProvider, adminStatus, agentCount, description, policyStatus, upgradeStatus, tamperProtectionStatus, agentAutoUpgrade, agentDeletionTimeoutSeconds, timezone, upgradeDay, upgradeTime, versionProfileName` (`vendor/zscaler-sdk-python/zscaler/zms/agent_groups.py:87-102`).

`agentGroupTotpSecrets` returns `eyezId, totpSecret, totpQrCode, totpGenerationTimestamp` (`vendor/zscaler-sdk-python/zscaler/zms/agent_groups.py:177-182`).

### Nonces (provisioning keys)

`Nonce` node selection: `eyezId, name, key, maxUsage, usageCount, agentGroupEyezId, agentGroupName, agentGroupType, product, creationTime, modifiedTime` (`vendor/zscaler-sdk-python/zscaler/zms/nonces.py:87-97`). The single-get `nonce` query wraps the payload in an extra `nonce` object — `data.nonce.nonce` (`vendor/zscaler-sdk-python/zscaler/zms/nonces.py:172-173`, `nonces.py:213`).

### Resources

`ListResources` node selection: `id, name, resourceType, status, cloudProvider, cloudRegion, resourceHostname, platformOs, platformOsDistro, platformOsVersion, localIps, deleted, modifiedTime, agentId, appZoneIds, appZoneNames, appZoneMappingState` (`vendor/zscaler-sdk-python/zscaler/zms/resources.py:92-108`). The `resources` query supports `includeDeleted:Boolean` (Python `include_deleted`, default `False`) to control whether deleted resources are returned (`vendor/zscaler-sdk-python/zscaler/zms/resources.py:46`, `resources.py:80`, `resources.py:124`).

`resourceProtectionStatus` node selection: `protectedPercentage, protectedResourcesCount, unprotectedResourcesCount, totalResources` (`vendor/zscaler-sdk-python/zscaler/zms/resources.py:189-193`).

### Resource Groups

`resourceGroupMembers` keys on `id:String!` (`vendor/zscaler-sdk-python/zscaler/zms/resource_groups.py:179`). `resourceGroups` uses GraphQL **inline fragments** to distinguish two concrete types. `ManagedResourceGroup` fields: `id, name, description, type, origin, resourceMemberCount, modifiedTime`; `UnmanagedResourceGroup` adds `cidrs` and `fqdns` to that same set (`vendor/zscaler-sdk-python/zscaler/zms/resource_groups.py:84-103`). Managed groups are **tag-based membership**; unmanaged groups are **CIDR/FQDN-based membership** (`vendor/zscaler-mcp-server/CLAUDE.md:197`).

`resourceGroupProtectionStatus` node selection: `protectedPercentage, protectedResourceGroupsCount, unprotectedResourceGroupsCount, totalResourceGroups` (`vendor/zscaler-sdk-python/zscaler/zms/resource_groups.py:272-276`).

### Policy Rules

`fetchAll:Boolean` (Python `fetch_all`, default `False`) on `policyRules` bypasses pagination and returns every rule (`vendor/zscaler-sdk-python/zscaler/zms/policy_rules.py:45`, `policy_rules.py:55`; `vendor/zscaler-mcp-server/CLAUDE.md:200`).

`ListPolicyRules` node selection: `id, name, action, priority, description, deleted, sourceTargetType, destinationTargetType, appZoneScopeTargetType, creationTime, modifiedTime, lastHit`, plus `portAndProtocols[]{ protocol, portRanges[]{ startPort, endPort } }` (`vendor/zscaler-sdk-python/zscaler/zms/policy_rules.py:85-103`).

`defaultPolicyRules` node selection: `id, name, action, direction, description, scopeType, modifiedTime` (`vendor/zscaler-sdk-python/zscaler/zms/policy_rules.py:184-191`).

### App Zones

`appZones` (paginated, `filter:AppZoneFilter`, `orderBy:AppZoneQueryOrderBy`) node selection: `id, appZoneName, description, memberCount, includeAllVpcs, includeAllSubnets` (`vendor/zscaler-sdk-python/zscaler/zms/app_zones.py:76`, `app_zones.py:83-90`).

### App Catalog

`appCatalog` (paginated, `filter:AppCatalogQueryFilter`, `orderBy:AppCatalogQueryOrderBy`) node selection: `id, name, category, creationTime, modifiedTime, details{ portAndProtocol{ protocol, portRanges{startPort,endPort} }, processes }` (`vendor/zscaler-sdk-python/zscaler/zms/app_catalog.py:76`, `app_catalog.py:83-98`).

### Tags (namespace → key → value hierarchy)

The Tags domain implements the three-level namespace → key → value hierarchy via 3 read operations: `tagNamespaces` (paginated), `tagKeys` (paginated, keyed by `namespaceId:String!`), `tagValues` (paginated, keyed by `tagId:String!` AND `namespaceOrigin:NamespaceOrigin!`) (`vendor/zscaler-sdk-python/zscaler/zms/tags.py:85`, `tags.py:178`, `tags.py:182`, `tags.py:279`, `tags.py:283`; hierarchy described in `vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc:13` and `vendor/zscaler-mcp-server/CLAUDE.md:196`).

`tagValues` uniquely requires `namespaceOrigin:NamespaceOrigin!` as a mandatory argument (Python `namespace_origin`) in addition to `tagId` — listing tag values requires both the tag key ID and the namespace origin (`vendor/zscaler-sdk-python/zscaler/zms/tags.py:243`, `tags.py:279`, `tags.py:309`; `vendor/zscaler-mcp-server/CLAUDE.md:196`).

Node selections: `tagNamespaces` → `id, name, description, origin`; `tagKeys` → `id, name, description`; `tagValues` → `id, name` (minimal) (`vendor/zscaler-sdk-python/zscaler/zms/tags.py:92-97`, `tags.py:190-194`, `tags.py:292-295`).

## Enums

GraphQL/SDK enum value sets recovered from `vendor/zscaler-sdk-python/zscaler/zms/models/enums.py`:

| Enum | Values | Citation (enums.py) |
|---|---|---|
| `AgentConnectionStatus` | CONNECTED, DISCONNECTED, ERROR, UNKNOWN | `models/enums.py:37-43` |
| `AgentType` | CLUSTER, HOST, KUBE_CONNECTOR, UNKNOWN | `models/enums.py:82-88` |
| `AgentGroupType` | K8S, UNKNOWN, VM | `models/enums.py:53-58` |
| `NonceProduct` | EYEZ, EYEZ_LEGACY | `models/enums.py:168-172` |
| `ResourceType` | K8S_NODE, K8S_SERVICE, K8S_WORKLOAD, NODE, POD, UNKNOWN, VM | `models/enums.py:248-257` |
| `ResourceStatus` | ACTIVE, DELETED, INACTIVE | `models/enums.py:240-245` |
| `AppZoneMappingState` (resource `appZoneMappingState`) | CONFLICTING, MAPPED, UNMAPPED | `models/enums.py:91-96` |
| `ResourceGroupType` | MANAGED, UNMANAGED | `models/enums.py:233-237` |
| `ResourceGroupOrigin` | ML_RECOMMENDED, USER_DEFINED | `models/enums.py:226-230` |
| `PolicyAction` (custom rule action) | ALLOW, BLOCK, SIM_BLOCK | `models/enums.py:185-190` |
| `DefaultPolicyRuleAction` | ALLOW, BLOCK (no SIM_BLOCK) | `models/enums.py:132-136` |
| `DefaultPolicyRuleDirection` | INBOUND, OUTBOUND | `models/enums.py:139-143` |
| `DefaultPolicyRuleScopeType` | CUSTOMER (single value) | `models/enums.py:146-149` |
| `PolicyRuleTargetType` (source/destination target) | ANY, RESOURCE_GROUP | `models/enums.py:200-204` |
| `PolicyRuleAppZoneScopeType` (appZoneScopeTargetType) | ANY, APP_ZONE | `models/enums.py:193-197` |
| `NetworkProtocol` (portAndProtocols.protocol) | TCP, UDP | `models/enums.py:161-165` |
| `NamespaceOrigin` | CUSTOM, EXTERNAL, ML, UNKNOWN | `models/enums.py:152-158` (corroborated `tags.py:255`, `vendor/zscaler-mcp-server/CLAUDE.md:199`) |
| `SortDirection` | ASC, DESC | `models/enums.py:260-264` |
| `TamperProtectionStatus` | DISABLED, DISABLED_INHERITED, ENABLED, ENABLED_INHERITED, INHERITED | `models/enums.py:284-291` |
| `AgentAdminStatus` | DISABLED, DISABLED_INHERITED, ENABLED, ENABLED_INHERITED, INHERITED | `models/enums.py:20-27` |

`TamperProtectionStatus` / `AgentAdminStatus` carry an INHERITED-aware value set, reflecting agent-group inheritance of these settings (`vendor/zscaler-sdk-python/zscaler/zms/models/enums.py:284-291`, `models/enums.py:20-27`).

## Filter inputs

ZMS filter inputs use shared expression objects (`vendor/zscaler-sdk-python/zscaler/zms/models/inputs.py`):

- `StringExpression` supports `contains, ends, equals, in` (from `in_list`), `starts` (`vendor/zscaler-sdk-python/zscaler/zms/models/inputs.py:46-59`).
- `IntegerExpression` supports `eq, gt, gte, lt, lte, in, between` (`vendor/zscaler-sdk-python/zscaler/zms/models/inputs.py:85-102`).
- `StringArrayExpression` supports `containsAny` (`vendor/zscaler-sdk-python/zscaler/zms/models/inputs.py:116-120`).

Per-domain filter/orderBy wire keys:

| Input | Wire keys | Citation (inputs.py) |
|---|---|---|
| `ResourceQueryFilter` | id, name, status, resourceType, cloudProvider, cloudRegion, platformOs (each `StringExpression`) | `models/inputs.py:154-162` |
| `ResourceQueryOrderBy` | name only (`SortDirection`) | `models/inputs.py:180-186` |
| `ResourceGroupsFilter` | id, name, resourceHostname, resourceId (`StringExpression` each) | `models/inputs.py:214-219` |
| `PolicyRuleFilter` | id, name, action | `models/inputs.py:251-255` |
| `AppZoneFilter` | id, appZoneName, description | `models/inputs.py:287-291` |
| `AppCatalogQueryFilter` | id, name, category | `models/inputs.py:341-346` |
| `NamespaceFilter` | name, origin | `models/inputs.py:406-413` |
| `TagKeyFilter` | keyName, valueName | `models/inputs.py:451-458` |
| `TagValueFilter` | name | `models/inputs.py:491-496` |

## Edge cases

- **`get_metadata` is the one ZMS query whose `customerId` is `String!`, not `ID!`** — divergent from every other ZMS query (`vendor/zscaler-sdk-python/zscaler/zms/resources.py:257`).
- **Two pagination dialects exist side by side** (`page`/`pageSize` vs `pageNum`/`pageSize`) — the choice is per-domain, so a generic paginator must dispatch on domain (`vendor/zscaler-sdk-python/zscaler/zms/agents.py:78-87`, `vendor/zscaler-sdk-python/zscaler/zms/resources.py:79`; `vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc:11`).
- **`fetchAll` is `policyRules`-only** — applying it elsewhere is unsupported in the SDK (`vendor/zscaler-sdk-python/zscaler/zms/policy_rules.py:75`, `policy_rules.py:81`).
- **`tagValues` needs two keys, not one** — both `tagId` and `namespaceOrigin` are mandatory; you cannot list tag values from the tag key ID alone (`vendor/zscaler-sdk-python/zscaler/zms/tags.py:279`, `vendor/zscaler-mcp-server/CLAUDE.md:196`).
- **`PolicyAction` vs `DefaultPolicyRuleAction` differ**: custom rules allow `SIM_BLOCK`; default rules do not (`vendor/zscaler-sdk-python/zscaler/zms/models/enums.py:185-190`, `models/enums.py:132-136`).
- **`ResourceGroupOrigin` (`ML_RECOMMENDED`/`USER_DEFINED`) is a separate enum from `NamespaceOrigin` (`CUSTOM`/`EXTERNAL`/`ML`/`UNKNOWN`)** — do not conflate them (`vendor/zscaler-sdk-python/zscaler/zms/models/enums.py:226-230`, `models/enums.py:152-158`).
- **The query selection set, not `common.py`, is the authoritative list of returned fields.** `ListAgents` selects `publicIp, privateIps, adminStatus, agentGroupName, agentGroupType, upgradeStatus` (`vendor/zscaler-sdk-python/zscaler/zms/agents.py:99-103`), but the typed `AgentEntry` model stops at `privateIps` and omits `adminStatus/agentGroupName/agentGroupType` (`vendor/zscaler-sdk-python/zscaler/zms/models/common.py:84`) — the typed model is a partial view (`vendor/zscaler-sdk-python/zscaler/zms/agents.py:99-103`).

## Open questions

The following could not be cleanly backed from in-scope vendor source and are flagged **unverified**:

- **No Go parity / no cross-check.** The Go SDK has no ZMS service (`vendor/zscaler-sdk-go/zscaler/` contains zcc, zdx, zia, zid, zpa, ztw, zwa but no `zms` directory), so every ZMS field/endpoint claim here is single-source (Python SDK + MCP docs). Any downstream claim implying Go parity is unverified.
- **No authoritative GraphQL schema (SDL).** No `.graphql`/SDL file for ZMS exists in vendor source — argument types (`ID!`, `String!`, `Int`, `Boolean`, the `*Filter`/`*OrderBy` inputs, `SortDirection`, `NamespaceOrigin`) are recoverable only from inline query strings and dataclasses in the Python SDK. Server-side types could differ from these client-asserted ones; unverified beyond the SDK.
- **Write mutations are unverified.** Rules and CLAUDE.md state ZMS is read-only with no mutations (`vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc:8`, `vendor/zscaler-mcp-server/CLAUDE.md:170`), yet a skill describes ZMS write mutations (managedResourceGroupCreate/Update, unmanagedResourceGroupCreate/Update, managedRecommendedResourceGroupUpdate) plus a `recommendedResourceGroups` query (`vendor/zscaler-mcp-server/skills/zms/audit-microsegmentation-posture/SKILL.md:136-138`). These names appear only in skill prose; none is implemented in the Python SDK. Within the read-only scope they are unverified server-side capability claims, not promoted.
- **Recommended-resource-groups / ML-run surfaces unverified.** Enums exist (`RecommendedResourceGroupUserActionType`, `RecommendedTagUserActionType`, `MLRunStatus`, `MLRunType` — `vendor/zscaler-sdk-python/zscaler/zms/models/enums.py:207-223`, `models/enums.py:294-307`) implying such queries exist server-side, but no query method consumes them in the Python SDK ZMS layer. Their query names/shapes are unverified from source. (The `ResourceGroupsAPI` docstring also lists "Get recommended resource groups (ML-based)" — `vendor/zscaler-sdk-python/zscaler/zms/resource_groups.py:33` — but no such method is defined in the file, which implements only `list_resource_groups`, `get_resource_group_members`, `get_resource_group_protection_status` at `resource_groups.py:42`, `resource_groups.py:146`, `resource_groups.py:237`.)
- **Unreferenced enums.** `agentManagerStatus`/`PodPhase`/`TagScope`/`TagAssignmentUserAction` enums are defined (`vendor/zscaler-sdk-python/zscaler/zms/models/enums.py:61-72`, `models/enums.py:175-182`, `models/enums.py:267-281`) but are not referenced by any read query selection set examined; whether they appear in deeper sub-selections (e.g., k8s resource detail) is unverified.

## Cross-links

- ZMS conceptual overview: [`./overview.md`](./overview.md)
- ZMS reference hub: [`./index.md`](./index.md)
- Portfolio map (where ZMS sits): [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
