# The subclouds API: reading subclouds and editing their data center exclusions (shared.subclouds.api)
Also called: subclouds api; /subclouds; zia_sub_cloud; sub_clouds; subcloud data center exclusions; is there a subcloud api

Subclouds are created by Zscaler, but a tenant can read them and edit their data center exclusions through the ZIA API. The endpoints themselves are in the generated surface (`node scripts/kb.mjs surface /subclouds`).

**Reading.** GET /subclouds retrieves all of the organization's subclouds with the excluded data centers associated with each; each entry carries an ID, a name, its list of data centers and its exclusions. [shared.subclouds.api:list-with-exclusions] Each exclusion names its data center and country, carries start, end, creation and last-modified times and the last modifying user, and two flags: `disabledByOps`, set when Zscaler CloudOps has disabled the exclusion, and `expired`, described as the exclusion being disabled. [shared.subclouds.api:exclusion-state]

**Writing.** PUT /subclouds/{id} updates the subcloud and its excluded data centers; the request body is the organization's subcloud with its list of excluded data centers. [shared.subclouds.api:put-exclusions] Go's `Update` formats its `cloudID` argument into the `/zia/api/v1/subclouds` path, and Python's `update_sub_clouds` takes `cloud_id`, documented as the unique ID for the Sub Clouds. [shared.subclouds.api:put-id-is-subcloud] The OpenAPI document describes that path ID differently [divergence:shared.subclouds.api:put-path-id].

**Creating and deleting.** The OpenAPI contract has no POST, PUT or DELETE on /subclouds and no GET, POST or DELETE on /subclouds/{id}. [shared.subclouds.api:no-create-in-contract] So creating a subcloud is not an API operation: it stays a Support request, and the API covers reading subclouds and editing their exclusions. [shared.subclouds.api:creation-stays-with-support] Whether a subcloud can be deleted through the API is disputed [divergence:shared.subclouds.api:delete-route].

**Terraform.** [The provider documentation marks `zia_url_categories_predefined`, `zia_sandbox_behavioral_analysis_v2`, `zia_extranet`, `zia_dc_exclusions` and `zia_sub_cloud` as Early Access features.](kb:zia.terraform.early-access:early-access-resources) [`zia_sub_cloud` takes `cloud_id` from the `zia_sub_cloud` data source read by name (the example passes `data.zia_sub_cloud.lookup.id`), while the excluded data center is `exclusions.datacenter.id`, a data center ID chosen with the `zia_datacenters` data source, not the subcloud `cloud_id`.](kb:zia.terraform.early-access:sub-cloud-id-from-own-data-source) [The subcloud `name` is read-only: if it is provided the provider ignores it and uses the name from the API response.](kb:zia.terraform.early-access:sub-cloud-name-read-only)

What to check:
1. To find a subcloud's name and its excluded data centers, read the subcloud list rather than asking Support.
2. When updating exclusions, put the subcloud's ID in the path, as both SDKs do.

Inferred, not quoted (say so when an answer rests on one):
- [shared.subclouds.api:creation-stays-with-support] Tier B: Rests on the absence of a create operation in the published contract; an undocumented route would change it.

Sources disagree (name both sides):
- What the ID in PUT /subclouds/{id} identifies. [divergence:shared.subclouds.api:put-path-id]
  - api-specs: The OpenAPI document describes the path ID as the unique identifier for the excluded data center.
  - sdk-python: The Python SDK (and the Go SDK's cloudID argument) treat it as the subcloud's ID.
  Impact: A caller following the OpenAPI wording would put a data center ID in the path and update the wrong subcloud or none.
- Whether a subcloud can be deleted through the API. [divergence:shared.subclouds.api:delete-route]
  - api-specs: The OpenAPI contract lists no DELETE operation for a subcloud.
  - sdk-go: The Go SDK has a Delete function that sends DELETE to the subcloud path.
  Impact: Tooling built on the Go SDK may offer a delete the published contract does not document; whether the backend accepts it is unknown.

Area: shared.subclouds, its subjects in references/_meta/spine/shared/shared.subclouds.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.terraform.early-access.md (Early Access Terraform resources: extranet, data center exclusions, subclouds)
- depends-on references/_meta/text/shared/shared.pac-files.variables.md (Zscaler PAC file variables: gateways, hosts, load-balancing tokens, subclouds and Client Connector), from shared.subclouds: A PAC file for a subcloud must not use ${GATEWAY} or gateway.<Zscaler cloud> in its return statement, or traffic goes to the nearest Public Service Edge, which may be outside the subcloud; it uses ${GATEWAY.<Subcloud>.<Zscaler cloud>} and ${SECONDARY.GATEWAY.<Subcloud>.<Zscaler cloud>}, with _HOST forms for Kerberos and plain host names for applications that do not support PAC files. [shared.pac-files.variables:subcloud-vars]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.subclouds.md (Subclouds: restricting which Service Edges handle a tenant's traffic)
