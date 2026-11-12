# Provisioning key API: association types and update responses (zpa.api.provisioning-keys-wire)
Also called: provisioning key association type enum; NP_ASSISTANT_GRP; zcomponent provisioning key url; provisioning key update wire keys; add_provisioning_key snake_case

Provisioning key behavior that sits between the API and its clients. What a key is and how enrollment uses it is in [App Connector provisioning keys](kb:zpa.app-connectors.provisioning-keys); the model-field differences between the SDKs are in [Provisioning key fields and tool behavior across SDKs, provider and MCP](kb:zpa.app-connectors.provisioning-key-tooling).

## Association types

The OpenAPI associationType parameter documents the supported values as CONNECTOR_GRP, NP_ASSISTANT_GRP and SERVICE_EDGE_GRP in its description, while its enum lists ASSISTANT_GRP, NP_ASSISTANT_GRP, BROKER_GRP, SITE_CONTROLLER_GRP and EXPORTER_GRP. [zpa.api.provisioning-keys-wire:api-association-type-description-and-enum] The Go ProvisioningKey struct tags associationType without omitempty, so it is sent in create and update bodies even though the type is also a URL path segment, and Get, GetByName and the list helpers write the type back into the returned struct. [zpa.api.provisioning-keys-wire:go-association-type-emitted] The SDK's fixed three-type list, the swallowed errors in GetAll and the missing list-all endpoint are in [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects). GetByNameAllAssociations tries CONNECTOR_GRP, SERVICE_EDGE_GRP and NP_ASSISTANT_GRP in that order and stops at the first lookup that returns no error, so a name held by keys of two association types resolves to the earlier type. [zpa.api.provisioning-keys-wire:get-by-name-all-first-match]

## Writes

Setting `enabled` to false is dropped by the Go request tag: [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes). The OpenAPI document lists only a 204 response for a provisioning key PUT; the Go Update decodes nothing, and the Python update_provisioning_key returns a stub holding only the key ID when the body is empty. [zpa.api.provisioning-keys-wire:update-returns-no-body] The usage fields differ in type and name between the contract and Go [divergence:zpa.api.provisioning-keys-wire:usage-count-type].

## Python SDK

The Python wrappers' body, key-casing and path quirks are [The Python add_provisioning_key reads component_id and enrollment_cert_id with body.get rather than pop, so those snake_case keys stay in the body next to the camelCase keys it adds. The executor then camel-cases the body: enrollment_cert_id becomes the same enrollmentCertId key with the same value, and component_id becomes an extra componentId member next to zcomponentId.](kb:zpa.sdk-python.provisioning-keys:python-add-key-leaks-snake-case), [The Python update_provisioning_key sends its keyword arguments as the body without remapping any key, and the executor camel-cases them: max_usage and enrollment_cert_id arrive as maxUsage and enrollmentCertId, but component_id arrives as componentId, not the zcomponentId that add_provisioning_key sends and the update docstring says it is mapped to.](kb:zpa.sdk-python.provisioning-keys:python-update-key-needs-wire-keys) and [`get_provisioning_key_by_zcomponent` builds `/associationType/{simplify_key_type(key_type)}zcomponent/{zcomponent_id}/provisioningKey`, with no slash between the association type and `zcomponent`.](kb:zpa.sdk-python.provisioning-keys:zcomponent-route).

## Open

The ZPA provider documents zcomponent_id on the provisioning key resource as the ID of the existing App Connector or Service Edge Group and on the data source as the ID of the associated App Connector or Service Edge Group. [zpa.api.provisioning-keys-wire:zcomponent-id-is-group] The Python by-component lookup describes its argument differently [divergence:zpa.api.provisioning-keys-wire:zcomponent-id-group-or-component]. Which ID that route expects is open [gap:zpa.api.provisioning-keys-wire:zcomponent-id-meaning].

What to check:
1. Which association type a key was created under, since lookups probe a fixed order and the first hit wins.
2. Whether a Python call to the by-component lookup failed on the path before blaming the server.
3. Whether a Python update that changes the component passed it as zcomponent_id, since component_id is sent as componentId.
4. Which association type values the API documents, noting that the description and the enum disagree.

Sources disagree (name both sides):
- The ZPA provider and the Python by-component lookup describe the component ID differently. [divergence:zpa.api.provisioning-keys-wire:zcomponent-id-group-or-component]
  - tf-zpa: The ZPA provider documents zcomponent_id as the ID of the App Connector or Service Edge Group.
  - sdk-python: The Python get_provisioning_key_by_zcomponent docstring calls its argument the ID of the App Connector or Service Edge.
  Impact: A caller of the by-component lookup cannot tell from the sources whether to pass a group ID or an individual connector or service edge ID.
- The type and name of a provisioning key's usage fields: the OpenAPI document types usageCount and its cap maxUsageCount as integers, while the Go SDK types usageCount and a cap named maxUsage as strings. [divergence:zpa.api.provisioning-keys-wire:usage-count-type]
  - api-specs: The contract's provisioning key GET response types usageCount as an integer.
  - api-specs: The same contract schema (titled Nonce) names the usage cap maxUsageCount and types it as an integer; it has no maxUsage.
  - sdk-go: The Go ProvisioningKey types usageCount and maxUsage as strings.
  Impact: The contract's provisioning key object (cloudName, id, maxUsageCount, name, nonceAssociationType, nonceValue, scopeId, usageCount) is a different shape from the SDK object, so it does not settle what the API sends for maxUsage. A Go decode of a bare integer usageCount into the string field fails; the live response is not captured. The SDK and MCP types of maxUsage are in [[zpa.app-connectors.provisioning-key-tooling:max-usage-types]].

Not known (open gaps):
- Which ID the list-by-component provisioning key route expects [gap:zpa.api.provisioning-keys-wire:zcomponent-id-meaning]: settled by lab-test or code-read. Blocks: telling which ID to pass when listing keys by component

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.sdk-python.provisioning-keys.md (How the Python SDK builds provisioning key calls)
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
- links-to references/_meta/text/zpa/zpa.app-connectors.provisioning-key-tooling.md (Provisioning key fields and tool behavior across SDKs, provider and MCP)
- links-to references/_meta/text/zpa/zpa.app-connectors.provisioning-keys.md (App Connector provisioning keys)
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
