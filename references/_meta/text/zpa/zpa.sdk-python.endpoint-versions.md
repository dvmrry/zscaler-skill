# Which ZPA base path each Python SDK method uses (zpa.sdk-python.endpoint-versions)
Also called: saml attribute v2 list; trusted network v2; update_group_v2; customers/{id}/v2 suffix; userconfig base path scim; ip ranges write methods; associationtype lowercase customer domain

Several ZPA modules mix a v1 and a v2 base path or a non-admin base path inside one class. The methods themselves are in the generated surface.

**v1 and v2 in one class.** In the SAML attribute module the two list methods use the v2 management base and `get_saml_attribute` uses the v1 base. [zpa.sdk-python.endpoint-versions:saml-bases] The SAML attribute module defines `add_saml_attribute`, `update_saml_attribute` and `delete_saml_attribute`, so it is not read-only. [zpa.sdk-python.endpoint-versions:saml-writes] `list_trusted_networks` calls `/network` on the v2 base and `get_network` calls `/network/{network_id}` on the v1 base; the single-item method is named `get_network`. [zpa.sdk-python.endpoint-versions:trusted-network-bases] `update_group_v2` sends PUT to `/segmentGroup/{group_id}` on the v2 management base, and `update_group` sends PUT to the same path on the v1 base. [zpa.sdk-python.endpoint-versions:segment-group-v2]

**A /v2 suffix on the v1 base.** The C2C IP range, customer domain and admin SSO modules append a literal `/v2` to the v1 admin customer base. [zpa.sdk-python.endpoint-versions:v2-suffix] The customer domain methods use a lowercase `associationtype` path segment, where the provisioning key and OAuth modules use `associationType`. [zpa.sdk-python.endpoint-versions:customer-domain-lowercase] Whether those are the documented routes is open [gap:zpa.sdk-python.endpoint-versions:v2-suffix-routes].

**SCIM.** SCIM attribute list and get use the mgmtconfig admin base under `/idp/{idp_id}/scimattribute`, while `get_scim_values` and the SCIM group methods use the userconfig base. [zpa.sdk-python.endpoint-versions:scim-bases] `get_scim_group` takes a group ID and optional query parameters, with no IdP ID, and calls `/scimgroup/{group_id}`. [zpa.sdk-python.endpoint-versions:scim-group-get]

**C2C IP ranges.** The C2C IP range module defines add, update and delete methods and a POST search at `/ipRanges/search`, so it is not read-only. [zpa.sdk-python.endpoint-versions:c2c-writes]

What to check:
1. Which base path the method uses before comparing a Python response with a v1 or v2 console or API result.
2. Whether a SCIM call went to the mgmtconfig admin base or the userconfig base.

Not known (open gaps):
- Whether the /v1/admin/customers/{id}/v2 routes are documented API routes [gap:zpa.sdk-python.endpoint-versions:v2-suffix-routes]: settled by support-ticket or lab-test. Blocks: treating those three Python modules as calling published routes

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.saml-attributes.api-surface.md (The SAML attribute API, SDK and Terraform surface)
- see-also references/_meta/text/zpa/zpa.scim.api-surface.md (The SCIM API, SDK and Terraform read surface in ZPA)
- see-also references/_meta/text/zpa/zpa.trusted-networks.object.md (The ZPA trusted network object and how to fetch it)
- see-also references/_meta/text/zpa/zpa.segment-groups.api-surface.md (The segment group API, model fields and Terraform resource)
- see-also references/_meta/text/zpa/zpa.b2b-federation.sdk-contract.md (B2B Federation SDK coverage and contract differences)
