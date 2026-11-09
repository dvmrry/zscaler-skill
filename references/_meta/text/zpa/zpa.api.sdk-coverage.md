# Which ZPA services the Go and Python SDKs cover differently, and the Go packages behind Python-only module names (zpa.api.sdk-coverage)
Also called: go only zpa; python only zpa; scim user crud zpa go; tag_key tag_namespace go; policy_group python legacy; pra cbi go packages; go parity zia_customer_config; go parity user_portal_aup; go parity workload_tag_group; custom_config_controller go; admin_sso_controller go post

The Go and Python SDKs split ZPA differently, and the split is by package layout more often than by API coverage. The module and package inventory itself is generated.

**SCIM users.** The Go SDK has SCIM user get, create, update, delete and list calls on a separate SCIM client addressed by IdP ID, while the Python ZPA service exposes SCIM groups and SCIM attributes properties. [zpa.api.sdk-coverage:scim-users-go]

**Tags, PRA and CBI.** Tag keys and tag namespaces are in both SDKs: the Go SDK has tag_key and tag_namespace packages under tag_controller with /tagKey and /namespace routes, and the Python ZPA service has tag_key and tag_namespace properties. [zpa.api.sdk-coverage:tags-in-both] The Go SDK nests PRA and CBI services in privilegedremoteaccess and cloudbrowserisolation package trees; the PRA portal and CBI region services use the same routes as the Python pra_portal and cbi_region modules. [zpa.api.sdk-coverage:pra-cbi-layout]

**Policy groups.** Python's policy_group controller adds, lists (group/all), searches, gets, updates, deletes and reorders groups under /policyGroupSet/{group_set_id}/group, policy_group_rule lists, adds, gets, deletes and reorders rules under a group, and policy_group_set lists sets and reads them by ID or policy type, with summaries. [zpa.api.sdk-coverage:policy-group-python-ops] [The unified `ZPAService` defines `policy_group`, `policy_group_rule` and `policy_group_set` properties, while the same properties in the legacy ZPA client are commented out.](kb:zpa.sdk-python.policy-groups:unified-only) The route differences from Go are in [zpa.b2b-federation.sdk-contract:policy-group-routes](kb:zpa.b2b-federation.sdk-contract:policy-group-routes).

**Python modules with renamed Go packages.** The Go package `custom_config_controller` covers the Python ZIA customer config routes: GET `/config/isZiaCloudConfigAvailable`, GET and POST `/config/ziaCloudConfig`, and GET and PUT `/config/sessionTerminationOnReauth`. [zpa.api.sdk-coverage:go-custom-config] The Go package `userportal/aup` defines `Get`, `GetByName`, `Create`, `Update`, `Delete` and `GetAll` on `/userportal/aup`. [zpa.api.sdk-coverage:go-aup] The Go package `workload_tag_group` uses `/workloadTagGroup/summary`. [zpa.api.sdk-coverage:go-workload-tag-group] The Go package `admin_sso_controller` updates the login options with POST on `/v2/ssoLoginOptions`. [zpa.api.sdk-coverage:go-admin-sso]

**Move and share.** Both SDKs expose them: [The Python SDK's `app_segment_move` posts to `/application/{id}/move` with `targetSegmentGroupId`, `targetMicrotenantId` and `targetServerGroupId` in the body and the source scope as the `microtenantId` query parameter.](kb:zpa.microtenants.share-and-move:python-move) and [The Go SDK exposes `AppSegmentMicrotenantMove` (POST `/application/{id}/move`) and `AppSegmentMicrotenantShare` (PUT `/application/{id}/share`), each taking the scope from the request struct or else the service's Microtenant and sending it as the `microtenantId` query filter.](kb:zpa.microtenants.share-and-move:go-move-and-share).

**Federation and Browser Access Groups.** The new Go packages and their Python counterparts are held in [The Go SDK has `federated_application` (list by host and federate) and `b2b_policy_controller` (guest policy rules), and no package for the `tenant-federation` routes.](kb:zpa.b2b-federation.sdk-contract:go-covers-two-routes), [The Python SDK has `application_federation` (list applications for a host, update an application), `tenant_federation_provisioning` (list provisionings, list partners, add, update, delete) and `b2b_policy` (get global policy rules), and no methods for token create, token verify, approval, federation state, notes or provisioning state.](kb:zpa.b2b-federation.sdk-contract:python-covers-partial) and [The Go SDK declares a separate admin-customer /browserAccessGroups resource with a typed BrowserAccessGroups model and read-only GetAll and Get functions.](kb:zpa.browser-access.tooling:go-browser-access-groups).

What to check:
1. Before calling a service Go-only or Python-only, the other SDK's package list, since the tag services exist in both.
2. For SCIM user provisioning, that only the Go SDK has the calls, and they go to a separate SCIM client addressed by IdP ID.
3. For policy groups from Python, that the controllers exist only on the unified client.
4. Whether a Go-parity question for the ZIA customer config, user portal AUP or workload tag group used the Go package names, not the Python module names.

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.b2b-federation.sdk-contract.md (B2B Federation SDK coverage and contract differences)
- links-to references/_meta/text/zpa/zpa.microtenants.share-and-move.md (Sharing and moving between Microtenants)
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.browser-access.tooling.md (Writing Browser Access segments: Python SDK, MCP server, Go SDK and Terraform)
- links-to references/_meta/text/zpa/zpa.sdk-python.policy-groups.md (Python SDK policy group, rule and set controllers)
