# What each ZMS GraphQL query takes and returns: agents, resources, groups, rules, zones, catalog, tags (zms.api.queries)
Also called: zms agents query; zms resourcegroups inline fragment; managedresourcegroup unmanagedresourcegroup; zms tagvalues namespaceorigin; zms totp secret; zms default policy rules; zms includedeleted; zms protection status

Each ZMS domain has one or more queries; the selection set written in the SDK module is what comes back, since the methods return the raw GraphQL result ([The SDK's ZMS methods return the raw dictionary under the query's name in the GraphQL response's `data` member, rather than a typed model.](kb:zms.api:raw-dicts)).

**Agents and agent groups.** The agents list selects name, eyezId, connectionStatus, agentType, hostOs, currentSoftwareVersion, upgradeStatus, description, cloudProvider, publicIp, privateIps, adminStatus, agentGroupName and agentGroupType, and accepts search, sort and sortDir. [zms.api.queries:agents-selection] The agent connection-status and version statistics queries take only `customerId` and an optional `search`, with no pagination, and return totals with per-type rows. [zms.api.queries:stats-unpaged] The agent groups list selects name, eyezId, agentGroupType, cloudProvider, adminStatus, agentCount, description, policyStatus, upgradeStatus, tamperProtectionStatus, agentAutoUpgrade, agentDeletionTimeoutSeconds, timezone, upgradeDay, upgradeTime and versionProfileName. [zms.api.queries:agent-groups-selection] `agentGroupTotpSecrets`, keyed by an agent group's eyezId, returns `totpSecret`, `totpQrCode` and `totpGenerationTimestamp`. [zms.api.queries:totp-secrets] Nonces are in [Microsegmentation agent provisioning keys (nonces): portal, fields and API](kb:zms.provisioning-keys).

**Resources.** The resources list selects id, name, resourceType, status, cloudProvider, cloudRegion, resourceHostname, platformOs, platformOsDistro, platformOsVersion, localIps, deleted, modifiedTime, agentId, appZoneIds, appZoneNames and appZoneMappingState. [zms.api.queries:resources-selection] The resources query takes `includeDeleted` (`include_deleted`, default False), so deleted resources are left out unless asked for. [zms.api.queries:include-deleted] Resource and resource-group protection status queries take `pageNum` and `pageSize` and return `nodes` of protected percentage and protected, unprotected and total counts, with a `pageInfo` block. [zms.api.queries:protection-status] `metadata` takes only the customer ID and the query selects no subfields; the SDK documents `get_metadata` as getting event metadata for a customer, returned as metadata JSON. [zms.api.queries:metadata-scalar] `metadata` returns a scalar value rather than an object type. [zms.api.queries:metadata-returns-scalar]

**Resource groups.** `resourceGroups` returns two concrete types through inline fragments: `ManagedResourceGroup` with id, name, description, type, origin, resourceMemberCount and modifiedTime, and `UnmanagedResourceGroup` with the same plus `cidrs` and `fqdns`. [zms.api.queries:group-fragments] Managed groups have tag-based membership and unmanaged groups CIDR- or FQDN-based membership. [zms.api.queries:group-membership] `resourceGroupMembers` is keyed by the group's `id` (`String!`) and pages with `pageNum` and `pageSize`. [zms.api.queries:group-members]

**Policy rules.** Policy rules select id, name, action, priority, description, deleted, source, destination and AppZone-scope target types, creationTime, modifiedTime, lastHit and port ranges per protocol. [zms.api.queries:policy-rules-selection] Default policy rules are a separate query, paginated with no filter or fetchAll, selecting id, name, action, direction, description, scopeType and modifiedTime. [zms.api.queries:default-rules-selection] The fetchAll flag is in [`policyRules` takes a `fetchAll` flag (`fetch_all`, default False) that bypasses pagination; the MCP notes say to use it sparingly on large tenants.](kb:zms.api:fetch-all).

**App zones and catalog.** App zones take a filter and orderBy and select id, appZoneName, description, memberCount, includeAllVpcs and includeAllSubnets. [zms.api.queries:app-zones-selection] App catalog entries select id, name, category, creationTime, modifiedTime and details of port ranges per protocol and processes. [zms.api.queries:app-catalog-selection]

**Tags.** Tags are walked top-down: `tagNamespaces` lists namespaces (id, name, description, origin), `tagKeys` needs a `namespaceId`, and `tagValues` needs both a `tagId` and a `namespaceOrigin` of type `NamespaceOrigin!`. [zms.api.queries:tag-hierarchy]

**Values.** Enum values and filter inputs are in [ZMS enum values and GraphQL filter inputs from the Python SDK](kb:zms.api.enums-and-filters).

What to check:
1. For tag values, whether both the tag key ID and the namespace origin are being passed.
2. Whether deleted resources were excluded by the includeDeleted default.
3. Whether a resource group is managed (tags) or unmanaged (CIDRs and FQDNs) before reasoning about its membership.

Inferred, not quoted (say so when an answer rests on one):
- [zms.api.queries:metadata-returns-scalar] Tier B: Rests on the GraphQL rule that a field queried without a selection set must be a leaf (scalar or enum) type; the ZMS schema itself is not captured, so the scalar's name and shape are unknown.

Area: zms.api, its subjects in references/_meta/spine/zms/zms.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zms/zms.api.md (The ZMS GraphQL API: one endpoint, read-only clients, customer scoping and pagination)
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zms.api: The service is reached as `client.zms` or `client.zmicroseg` and uses OneAPI authentication only. [zms.api:oneapi-only]
- links-to references/_meta/text/zms/zms.api.enums-and-filters.md (ZMS enum values and GraphQL filter inputs from the Python SDK)
- links-to references/_meta/text/zms/zms.provisioning-keys.md (Microsegmentation agent provisioning keys (nonces): portal, fields and API)
