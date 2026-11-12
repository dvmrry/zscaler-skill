# Managing ZPA log receivers through the API and SDKs (zpa.log-receivers.api)
Also called: lssConfig endpoint; lss api; lss create update delete; client types endpoint; lss status codes endpoint; update_lss_config; policy.invalid.mapping.input; lss config pagination

Receivers are managed through the lssConfig endpoints, with lookup endpoints for formats, status codes and client types.

**Endpoints.** The API article creates a receiver with POST, reads one with GET, updates it with PUT and deletes it with DELETE, on /mgmtconfig/v2/admin/customers/{customerId}/lssConfig and .../lssConfig/{lssId}, and the specification lists GET, PUT and DELETE on the item path. [zpa.log-receivers.api:endpoints] A successful create returns 201, and a successful update or delete returns 204; a receiver configured through Zscaler Deception cannot be updated or deleted. [zpa.log-receivers.api:create-update-delete-codes] Listing receivers supports pagination with a default page size of 20 and a maximum of 500. [zpa.log-receivers.api:list-pagination] Lookups are GET /mgmtconfig/v2/admin/lssConfig/statusCodes for status codes, /mgmtconfig/v2/admin/lssConfig/logType/formats for log formats, and /mgmtconfig/v2/admin/lssConfig/customers/{customerId}/clientTypes for client types. [zpa.log-receivers.api:status-formats-clienttypes]

**Client types path.** The specification marks the global /mgmtconfig/v2/admin/lssConfig/clientTypes endpoint as one that will be deprecated in a future release, and the customer-scoped clientTypes endpoint as the one for a specified customer. [zpa.log-receivers.api:clienttypes-deprecated-global] The Go SDK's GetClientTypes calls the global lssConfig/clientTypes path without the customer ID. [zpa.log-receivers.api:go-clienttypes-global] The Go and Python SDKs use different paths [divergence:zpa.log-receivers.api:client-types-path]; the older note is [The ZPA API from a client's side: paths, authentication, paging, limits and wire notes](kb:zpa.api).

**Specification and article.** The ZPA OpenAPI document gives the lssConfig collection path only a GET operation, with no POST for creating a receiver, although the API article documents POST. [zpa.log-receivers.api:oas-collection-get-only] The article's payload names the groups key differently from its sample [divergence:zpa.log-receivers.api:groups-key].

**SDK behavior.** The Python SDK's update_lss_config builds the PUT body from scratch with only the fields the caller supplies and does not fetch and merge the current state; config.id is always included and policyRuleResource carries the policySetId resolved from SIEM_POLICY when policy_rules is passed. [zpa.log-receivers.api:python-update-body] Python SDK 1.9.30 changed update_lss_config to build the PUT body from caller-supplied fields, and the changelog says it fixes the earlier policy.invalid.mapping.input failure by including config.id and resolving policyRuleResource.policySetId from SIEM_POLICY; 1.9.29 fetched the current configuration and merged into it. [zpa.log-receivers.api:python-update-history] The Python and Go services are cataloged in [The Zscaler Python SDK against ZPA: where its behavior is described](kb:zpa.sdk-python).

What to check:
1. Which client-types path the tool calls: the customer-scoped path is the documented one, the global path is announced for deprecation.
2. Whether an update failed with policy.invalid.mapping.input, and which Python SDK version made the call.
3. Whether the create endpoint is in the specification a client was generated from.
4. Whether a request body names the groups as connectorGroups, as the SDKs and sample responses do.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.log-receivers.api:oas-collection-get-only] Tier B: Absence claim: the path item in automate-zscaler/openapi/zpa.openapi.json lists the single method get. A client generated from the specification has no create call for receivers.

Sources disagree (name both sides):
- Which client-types endpoint to call: the Go SDK uses the global path that the specification announces for deprecation, while the Python SDK and the API article use the customer-scoped path. [divergence:zpa.log-receivers.api:client-types-path]
  - sdk-go: Go SDK: GET /mgmtconfig/v2/admin/lssConfig/clientTypes.
  - sdk-python: Python SDK: GET /mgmtconfig/v2/admin/lssConfig/customers/{customerId}/clientTypes.
  Impact: Go callers of GetClientTypes use the endpoint marked for deprecation, and the Go response type models only six client types.
- What the App Connector groups key is called in a request: the article's payload template and field table say appConnectorGroups, while its sample request and responses, and both SDKs, use connectorGroups. [divergence:zpa.log-receivers.api:groups-key]
  - zscaler-help: appConnectorGroups.
  - zscaler-help: connectorGroups.
  Impact: A request that follows the template's key name instead of the sample's may not attach the groups; the SDKs send connectorGroups.

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors), from zpa.log-receivers: App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]
- links-to references/_meta/text/zpa/zpa.api.md (The ZPA API from a client's side: paths, authentication, paging, limits and wire notes)
- links-to references/_meta/text/zpa/zpa.sdk-python.md (The Zscaler Python SDK against ZPA: where its behavior is described)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zpa/zpa.api.lss-wire.md (What the SDKs and provider send for a ZPA log receiver (LSS))
- configured-via references/_meta/text/zpa/zpa.terraform.data-source-fidelity.md (What ZPA Terraform data sources return, drop, or get wrong)
- configured-via references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- see-also references/_meta/text/zpa/zpa.log-receivers.configuration.md (What a ZPA log receiver holds and which fields are required)
- see-also references/_meta/text/zpa/zpa.log-receivers.formats.md (Log stream format and content templates for a ZPA log receiver)
