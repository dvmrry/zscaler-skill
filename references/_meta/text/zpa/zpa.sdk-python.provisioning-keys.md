# How the Python SDK builds provisioning key calls (zpa.sdk-python.provisioning-keys)
Also called: provisioning key python sdk; key_type connector service_edge; CONNECTOR_GRP SERVICE_EDGE_GRP; get_provisioning_key_by_zcomponent; zcomponent route; provisioning key argument order; assistant_group site_controller_group; update provisioning key microtenant header

The Python provisioning key wrappers take a friendly key type and rebuild it into an association type in the URL. The Go list handling is in [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects), the API's association types are in [Provisioning key API: association types and update responses](kb:zpa.api.provisioning-keys-wire), and the product side is [App Connector provisioning keys](kb:zpa.app-connectors.provisioning-keys).

**Key types.** `simplify_key_type` maps `connector` to `CONNECTOR_GRP` and `service_edge` to `SERVICE_EDGE_GRP`, and every provisioning key URL is built from that value. [zpa.sdk-python.provisioning-keys:key-types] The OAuth user-code module has its own `simplify_key_type` that also maps `assistant_group` to `NP_ASSISTANT_GRP` and `site_controller_group` to `SITE_CONTROLLER_GRP`. [zpa.sdk-python.provisioning-keys:oauth-key-types] A key type outside the mapped values raises `ValueError`, and `add_provisioning_key` and `update_provisioning_key` also raise `ValueError` when `key_type` is empty. [zpa.sdk-python.provisioning-keys:key-type-raises]

**Argument order.** `list_provisioning_keys` and `add_provisioning_key` take `key_type` first; `get_provisioning_key`, `update_provisioning_key` and `delete_provisioning_key` take `key_id` first and `key_type` second. [zpa.sdk-python.provisioning-keys:argument-order]

**Requests.** add_provisioning_key adds name, maxUsage, enrollmentCertId and zcomponentId to the request body, taking the last two from the enrollment_cert_id and component_id arguments, and treats enrollment_cert_id as a plain optional argument for both key types. [zpa.sdk-python.provisioning-keys:python-create-body] The Python add_provisioning_key reads component_id and enrollment_cert_id with body.get rather than pop, so those snake_case keys stay in the body next to the camelCase keys it adds. The executor then camel-cases the body: enrollment_cert_id becomes the same enrollmentCertId key with the same value, and component_id becomes an extra componentId member next to zcomponentId. [zpa.sdk-python.provisioning-keys:python-add-key-leaks-snake-case] The Python update_provisioning_key sends its keyword arguments as the body without remapping any key, and the executor camel-cases them: max_usage and enrollment_cert_id arrive as maxUsage and enrollmentCertId, but component_id arrives as componentId, not the zcomponentId that add_provisioning_key sends and the update docstring says it is mapped to. [zpa.sdk-python.provisioning-keys:python-update-key-needs-wire-keys] `update_provisioning_key` calls `create_request(http_method, api_url, body, params, {})`, and `create_request` takes `headers` before `params`, so the microtenant dictionary is passed as headers and the params are empty. [zpa.sdk-python.provisioning-keys:update-params-in-headers] `create_request` prepares the query parameters with `_prepare_params`, which calls `_get_microtenant_id` and sets any result as `microtenantId`, before it prepares the body with `_prepare_body`. `_get_microtenant_id` returns a non-empty `microtenantId` from the body, else from the params, else `self.microtenant_id`. The update's body holds the call's value under the snake_case key `microtenant_id`. [zpa.sdk-python.provisioning-keys:update-query-microtenant] So on a provisioning key update the `microtenantId` query parameter is the client's configured microtenant, or absent, never the call's `microtenant_id`: the params are empty and the body has no `microtenantId` key when the lookup runs. [zpa.sdk-python.provisioning-keys:update-query-microtenant-config-only] Whether the service honors the header or the body field is open [gap:zpa.sdk-python.provisioning-keys:update-header-microtenant]. What an update returns is [The OpenAPI document lists only a 204 response for a provisioning key PUT; the Go Update decodes nothing, and the Python update_provisioning_key returns a stub holding only the key ID when the body is empty.](kb:zpa.api.provisioning-keys-wire:update-returns-no-body).

**By component.** `get_provisioning_key_by_zcomponent` builds `/associationType/{simplify_key_type(key_type)}zcomponent/{zcomponent_id}/provisioningKey`, with no slash between the association type and `zcomponent`. [zpa.sdk-python.provisioning-keys:zcomponent-route] They differ from Go: [divergence:zpa.sdk-python.provisioning-keys:zcomponent-route-slash]

What to check:
1. Whether key_id and key_type were passed in the right order, since get, update and delete take key_id first while list and add take key_type first.
2. Whether the key type is one of the two this module maps, or one of the four the OAuth user-code module maps.
3. Whether a provisioning key update inside a microtenant actually carried the microtenant ID as a query parameter.
4. Whether a by-component lookup returned 404 because of the missing path slash.
5. Whether a Python update that changes the component passed it as zcomponent_id or zcomponentId, since component_id is sent as componentId.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.sdk-python.provisioning-keys:update-query-microtenant-config-only] Tier B: Rests on create_request not converting the body between its start and _prepare_params (read at the pin) and on self.microtenant_id being the configured client microtenant; read from the code for a caller who passes the snake_case microtenant_id keyword, not run against a tenant.

Sources disagree (name both sides):
- The Python and Go by-component provisioning key routes differ by a slash. [divergence:zpa.sdk-python.provisioning-keys:zcomponent-route-slash]
  - sdk-python: Python joins the association type and `zcomponent` with no slash.
  - sdk-go: Go separates them with a slash.
  Impact: The Python by-component method requests a path that the Go package does not use; which one the service accepts is not shown.

Not known (open gaps):
- Whether a microtenant ID sent as a header and in the body is honored on provisioning key update [gap:zpa.sdk-python.provisioning-keys:update-header-microtenant]: settled by lab-test or tenant-data. Blocks: trusting that a Python provisioning key update inside a microtenant reaches that microtenant

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.api.provisioning-keys-wire.md (Provisioning key API: association types and update responses)
- links-to references/_meta/text/zpa/zpa.app-connectors.provisioning-keys.md (App Connector provisioning keys)
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
