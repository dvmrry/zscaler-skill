# Early Access Terraform resources: extranet, data center exclusions, subclouds (zia.terraform.early-access)
Also called: zia_extranet; zia_dc_exclusions; zia_sub_cloud; zia_url_categories_predefined; early access terraform zia; datacenter_id vs cloud_id; dc exclusion time window
Former IDs: zia-68

Several newer ZIA resources are labelled Early Access in the provider documentation. They cover extranet configuration and the exclusion of data centers or subclouds from serving traffic.

**Which are Early Access.** The provider documentation marks `zia_url_categories_predefined`, `zia_sandbox_behavioral_analysis_v2`, `zia_extranet`, `zia_dc_exclusions` and `zia_sub_cloud` as Early Access features. [zia.terraform.early-access:early-access-resources] Who can use them is open [gap:zia.terraform.early-access:early-access-eligibility].

**Data center exclusions.** `zia_dc_exclusions` takes `datacenter_id` from the `zia_datacenters` data source (the documentation prefers `data.zia_datacenters.this.datacenter_id` when filtering by name returns one result); the argument is required on create, can be omitted when importing by numeric ID, and forces a new resource if changed. [zia.terraform.early-access:dc-id-from-datacenters] For `zia_dc_exclusions`, `start_time_utc` and `end_time_utc` (format `MM/DD/YYYY HH:MM am/pm`) override the Unix-timestamp `start_time` and `end_time` when set, and one form of each of start and end must be given. [zia.terraform.early-access:utc-overrides-unix] The data source's behavior with an invalid ID is in [What ZIA Terraform data sources return, drop, or get wrong](kb:zia.terraform.data-source-fidelity).

**Subclouds.** `zia_sub_cloud` takes `cloud_id` from the `zia_sub_cloud` data source read by name (the example passes `data.zia_sub_cloud.lookup.id`), while the excluded data center is `exclusions.datacenter.id`, a data center ID chosen with the `zia_datacenters` data source, not the subcloud `cloud_id`. [zia.terraform.early-access:sub-cloud-id-from-own-data-source] The subcloud `name` is read-only: if it is provided the provider ignores it and uses the name from the API response. [zia.terraform.early-access:sub-cloud-name-read-only]

What to check:
1. Whether the resource is one of the Early Access ones before blaming a failure on provider behavior; eligibility is not documented.
2. Whether `datacenter_id` and `cloud_id` came from the right data source, since they identify different entities.
3. Whether an exclusion window was set through the UTC string, which overrides the Unix timestamp.

Not known (open gaps):
- Which tenants can use the Early Access Terraform resources [gap:zia.terraform.early-access:early-access-eligibility]: settled by support-ticket or tenant-data. Blocks: saying whether an Early Access resource will work on a given tenant or cloud

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.terraform.data-source-fidelity.md (What ZIA Terraform data sources return, drop, or get wrong)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.sandbox.md5-blocklist.md (Sandbox custom MD5 hash list)
