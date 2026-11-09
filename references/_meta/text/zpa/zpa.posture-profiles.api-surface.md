# The posture profile API, SDK and Terraform data source (zpa.posture-profiles.api-surface)
Also called: posture endpoint; posture-profile-controller; zpa_posture_profile data source; list_posture_profiles; GetByPostureUDID; posture profile api read only

The posture profile API is read-only in every source.

**Calls.** The documented posture profile calls are GETs in the posture-profile-controller: all profiles by page on the v2 path, with search, and one profile by id on the v1 path. [zpa.posture-profiles.api-surface:endpoints] The captured API specification defines only get operations on its two posture paths, and no operation that creates, changes or deletes a posture profile. [zpa.posture-profiles.api-surface:spec-get-only] The list call pages with page and pagesize, default page size 20 and maximum 500, and accepts a search string. [zpa.posture-profiles.api-surface:paging] The help article's search example uses a v1 path [divergence:zpa.posture-profiles.api-surface:search-path].

**SDKs.** The Go SDK's postureprofile package has Get (v1 by id), and GetByPostureUDID, GetByName and GetAll on the v2 list; GetByPostureUDID reads the whole list and compares postureUdid. [zpa.posture-profiles.api-surface:go-functions] The Python SDK's PostureProfilesAPI has list_posture_profiles(query_params) on the v2 path and get_profile(profile_id), with no query_params argument, on the v1 path. [zpa.posture-profiles.api-surface:python-methods] The Python SDK's PostureProfilesAPI has no lookup by name or UDID. [zpa.posture-profiles.api-surface:python-no-lookup] Neither SDK has a create, update or delete function for posture profiles. [zpa.posture-profiles.api-surface:no-sdk-writes]

**Terraform.** The Terraform provider registers zpa_posture_profile as a data source only; it has no posture profile resource. [zpa.posture-profiles.api-surface:no-tf-resource] The zpa_posture_profile data source finds a profile by id when one is given and otherwise by name; posture_udid is exported, and the read ignores it as input. [zpa.posture-profiles.api-surface:tf-lookup] The zpa_posture_profile data source has no postureType, platform, rootCert or boolean-flag attributes: its schema and its d.Set calls cover only id, name, posture_udid, domain, master_customer_id, zscaler_cloud, zscaler_customer_id and the time and modified-by fields. [zpa.posture-profiles.api-surface:tf-omits-fields] Id-over-name selection in data sources is in [Which object a ZPA Terraform data source actually returns](kb:zpa.terraform.data-source-selection), and fields data sources leave unset are in [What ZPA Terraform data sources return, drop, or get wrong](kb:zpa.terraform.data-source-fidelity).

What to check:
1. Which call reads the object: the v2 list for search and paging, the v1 call for one profile by id.
2. Whether the task is a read, which all sources support, rather than a write, which none document or implement.
3. How a profile is found by UDID or by name in the tool being used.
4. Whether a field the Terraform data source does not export is needed from the SDK instead.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.posture-profiles.api-surface:spec-get-only] Tier B: Absence claim from a search of zpa.openapi.json: the two posture paths each define only a get member.
- [zpa.posture-profiles.api-surface:python-no-lookup] Tier B: Absence read of posture_profiles.py at the pinned SDK: besides the constructor, list_posture_profiles and get_profile are its only methods; a quote cannot pin the absence of further methods in code.
- [zpa.posture-profiles.api-surface:no-sdk-writes] Tier B: Absence claim from a read of the Go postureprofile package and the Python posture_profiles.py: the functions in claims go-functions and python-methods are all of them.
- [zpa.posture-profiles.api-surface:no-tf-resource] Tier B: Absence claim from a read of the provider's ResourcesMap in provider.go: no entry names a posture profile resource.
- [zpa.posture-profiles.api-surface:tf-omits-fields] Tier B: Absence claim from a read of data_source_zpa_posture_profile.go: neither its schema nor its flatten calls name posture_type, platform, root_cert or the three flags, which the SDK object holds.

Sources disagree (name both sides):
- Which path the posture-profile search goes to. [divergence:zpa.posture-profiles.api-surface:search-path]
  - zscaler-help: The help article's search steps, under its Getting Details for All Posture Profiles V2 heading, call the v1 path /mgmtconfig/v1/admin/customers/{id}/posture with search appended as &search=, while its paging steps on the same page use the v2 path.
  - api-specs: The OpenAPI contract defines search as a query parameter of the v2 list.
  - zscaler-help: Help's own Posture Profiles API reference also defines search as a query parameter of the v2 list.
  Impact: A search sent as the article shows goes to a v1 list path that neither API reference defines, with `&` where a query string starts with `?`. Both SDKs list on the v2 path (zpa.posture-profiles.api-surface:go-functions, zpa.posture-profiles.api-surface:python-methods).

Area: zpa.posture-profiles, its subjects in references/_meta/spine/zpa/zpa.posture-profiles.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zcc/zcc.device-posture.md (ZCC device posture profiles), from zpa.posture-profiles: Posture profiles for both Internet & SaaS and Private Access are created in the Device Posture section of the Zscaler Client Connector configuration, and they are used for Private Access access policies and for Internet & SaaS posture trust levels. [zpa.posture-profiles.object-model:zcc-defined]
- links-to references/_meta/text/zpa/zpa.terraform.data-source-fidelity.md (What ZPA Terraform data sources return, drop, or get wrong)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-selection.md (Which object a ZPA Terraform data source actually returns)
