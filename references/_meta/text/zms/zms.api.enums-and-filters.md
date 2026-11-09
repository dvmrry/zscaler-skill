# ZMS enum values and GraphQL filter inputs from the Python SDK (zms.api.enums-and-filters)
Also called: zms enums; zms policyaction sim_block; zms namespaceorigin values; zms filter inputs; zms stringexpression; appcatalogqueryfilter; zms resourcetype values

The SDK defines the enum values and filter inputs the ZMS queries use; no GraphQL schema is published to confirm them ([No authoritative GraphQL schema for ZMS](kb:zms.api:schema)).

| Enum | Values |
| --- | --- |
| `AgentConnectionStatus` | `AgentConnectionStatus` has the values CONNECTED, DISCONNECTED, ERROR and UNKNOWN. [zms.api.enums-and-filters:enum-agent-connection-status] |
| `AgentType` | `AgentType` has the values CLUSTER, HOST, KUBE_CONNECTOR and UNKNOWN. [zms.api.enums-and-filters:enum-agent-type] |
| `AgentGroupType` | `AgentGroupType` has the values K8S, UNKNOWN and VM. [zms.api.enums-and-filters:enum-agent-group-type] |
| `ResourceType` | `ResourceType` has the values K8S_NODE, K8S_SERVICE, K8S_WORKLOAD, NODE, POD, UNKNOWN and VM. [zms.api.enums-and-filters:enum-resource-type] |
| `ResourceStatus` | `ResourceStatus` has the values ACTIVE, DELETED and INACTIVE. [zms.api.enums-and-filters:enum-resource-status] |
| `AppZoneMappingState` | `AppZoneMappingState` has the values CONFLICTING, MAPPED and UNMAPPED. [zms.api.enums-and-filters:enum-app-zone-mapping-state] |
| `ResourceGroupType` | `ResourceGroupType` has the values MANAGED and UNMANAGED. [zms.api.enums-and-filters:enum-resource-group-type] |
| `ResourceGroupOrigin` | `ResourceGroupOrigin` has the values ML_RECOMMENDED and USER_DEFINED. [zms.api.enums-and-filters:enum-resource-group-origin] |
| `PolicyAction` | `PolicyAction` has the values ALLOW, BLOCK and SIM_BLOCK. [zms.api.enums-and-filters:enum-policy-action] |
| `DefaultPolicyRuleAction` | `DefaultPolicyRuleAction` has the values ALLOW and BLOCK. [zms.api.enums-and-filters:enum-default-policy-rule-action] |
| `DefaultPolicyRuleDirection` | `DefaultPolicyRuleDirection` has the values INBOUND and OUTBOUND. [zms.api.enums-and-filters:enum-default-policy-rule-direction] |
| `DefaultPolicyRuleScopeType` | `DefaultPolicyRuleScopeType` has the values CUSTOMER. [zms.api.enums-and-filters:enum-default-policy-rule-scope-type] |
| `PolicyRuleTargetType` | `PolicyRuleTargetType` has the values ANY and RESOURCE_GROUP. [zms.api.enums-and-filters:enum-policy-rule-target-type] |
| `PolicyRuleAppZoneScopeType` | `PolicyRuleAppZoneScopeType` has the values ANY and APP_ZONE. [zms.api.enums-and-filters:enum-policy-rule-app-zone-scope-type] |
| `NetworkProtocol` | `NetworkProtocol` has the values TCP and UDP. [zms.api.enums-and-filters:enum-network-protocol] |
| `NamespaceOrigin` | `NamespaceOrigin` has the values CUSTOM, EXTERNAL, ML and UNKNOWN. [zms.api.enums-and-filters:enum-namespace-origin] |
| `SortDirection` | `SortDirection` has the values ASC and DESC. [zms.api.enums-and-filters:enum-sort-direction] |
| `TamperProtectionStatus` | `TamperProtectionStatus` has the values DISABLED, DISABLED_INHERITED, ENABLED, ENABLED_INHERITED and INHERITED. [zms.api.enums-and-filters:enum-tamper-protection-status] |
| `AgentAdminStatus` | `AgentAdminStatus` has the values DISABLED, DISABLED_INHERITED, ENABLED, ENABLED_INHERITED and INHERITED. [zms.api.enums-and-filters:enum-agent-admin-status] |
| `CloudProvider` | `CloudProvider` has the values AWS, AZURE, GCP and ON_PREMISES. [zms.api.enums-and-filters:enum-cloud-provider] |

**Easy to confuse.** Custom policy rules can carry SIM_BLOCK, which default policy rules cannot: `PolicyAction` has it and `DefaultPolicyRuleAction` does not. [zms.api.enums-and-filters:policy-vs-default-action] Resource-group origin (`ResourceGroupOrigin`: ML_RECOMMENDED, USER_DEFINED) and tag-namespace origin (`NamespaceOrigin`: CUSTOM, EXTERNAL, ML, UNKNOWN) are separate value sets, and `tagValues` needs the namespace one. [zms.api.enums-and-filters:origin-enums-differ]

**Expressions.** String filters are `StringExpression` objects with `contains`, `ends`, `equals`, `in` (from `in_list`) and `starts`. [zms.api.enums-and-filters:string-expression] Integer filters are `IntegerExpression` objects with `eq`, `gt`, `gte`, `lt`, `lte`, `in` and `between`. [zms.api.enums-and-filters:integer-expression] `StringArrayExpression` has one operator, `containsAny`. [zms.api.enums-and-filters:string-array-expression]

**Filters and ordering.** `ResourceQueryFilter` filters on id, name, status, resourceType, cloudProvider, cloudRegion and platformOs. [zms.api.enums-and-filters:resource-filter] `ResourceGroupsFilter` filters on id, name, resourceHostname and resourceId. [zms.api.enums-and-filters:resource-groups-filter] `PolicyRuleFilter` filters on id, name and action. [zms.api.enums-and-filters:policy-rule-filter] `AppZoneFilter` filters on id, appZoneName and description. [zms.api.enums-and-filters:app-zone-filter] `AppCatalogQueryFilter` filters only on id, name and category; the portal's Application Catalog page also filters by Process, Protocol and Port, which it lacks. [zms.api.enums-and-filters:app-catalog-filter] Tag filters are `NamespaceFilter` (name, origin), `TagKeyFilter` (keyName, valueName) and `TagValueFilter` (name). [zms.api.enums-and-filters:tag-filters] In the SDK's ordering inputs, resources, namespaces, tag keys and tag values order by name with a `SortDirection` value, app zones by appZoneName with a plain string, and app catalog by name, category, creationTime or modifiedTime. [zms.api.enums-and-filters:order-by]

Inferred, not quoted (say so when an answer rests on one):
- [zms.api.enums-and-filters:policy-vs-default-action] Tier B: Comparison of the two enum classes at the pin; what SIM_BLOCK does is not stated by any source.
- [zms.api.enums-and-filters:origin-enums-differ] Tier B: Comparison of the two enum classes; the tagValues argument type is in zms.api.queries:tag-hierarchy.

Area: zms.api, its subjects in references/_meta/spine/zms/zms.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zms.api: The service is reached as `client.zms` or `client.zmicroseg` and uses OneAPI authentication only. [zms.api:oneapi-only]
- links-to references/_meta/text/zms/zms.api.md (The ZMS GraphQL API: one endpoint, read-only clients, customer scoping and pagination)
