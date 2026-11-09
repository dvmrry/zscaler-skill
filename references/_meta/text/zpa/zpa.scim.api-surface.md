# The SCIM API, SDK and Terraform read surface in ZPA (zpa.scim.api-surface)
Also called: scimgroup endpoint; scimattribute endpoint; userconfig vs mgmtconfig; zpa_scim_groups; zpa_scim_attribute_header; list_scim_groups; SearchValues; idpGroupId

The SCIM read surface is split across two base paths.

**Calls.** The documented SCIM calls in ZPA are GETs: SCIM groups of an IdP and one group under /userconfig/v1/customers, an IdP's SCIM attribute headers and one header under /mgmtconfig/v1/admin/customers, and an attribute's values under /userconfig/v1/customers. [zpa.scim.api-surface:endpoints] The captured API specification has only get operations on its SCIM group, SCIM attribute and SCIM value paths, and no operation that creates, changes or deletes them. [zpa.scim.api-surface:spec-get-only] The SCIM group list by identity provider (`scimgroup/idpId/{idpId}`) pages with page and pagesize; the default page size is 20 and the maximum is 500. [zpa.scim.api-surface:paging] The SCIM group list can be filtered by startTime and endTime on modified_time, which must be set together, and sorted by id, name, creationTime or modifiedTime, defaulting to modifiedTime. [zpa.scim.api-surface:group-filters]

**Objects.** A SCIM group has id, name, idpId, idpGroupId, internalId, creationTime and modifiedTime, with name, idpId and idpGroupId required; the Zscaler id is an integer while idpGroupId is the IdP's own string identifier. [zpa.scim.api-surface:group-fields] What internalId means is partly open [gap:zpa.scim.api-surface:zpa-64-internal-id]. A SCIM attribute header has name, idpId, dataType, schemaURI, multivalued, required, caseSensitive, mutability, returned, uniqueness and canonicalValues, with dataType, mutability, name and returned required. [zpa.scim.api-surface:attribute-header-fields]

**SDKs.** The Python SDK exposes SCIMGroupsAPI with list_scim_groups(idp_id, query_params) and get_scim_group(group_id, query_params), and ScimAttributeHeaderAPI with list_scim_attributes, get_scim_attribute and get_scim_values, each taking the IdP ID. [zpa.scim.api-surface:python-methods] The Go SDK's scimgroup package has Get, GetByName and GetAllByIdpId, plus, from v3.8.50 (#465), GetByNameAndIamIdp, which resolves a group name within one ZIdentity (IAM) IdP; its scimattributeheader package has Get, GetByName, GetAllByIdpId, GetValues and SearchValues. [zpa.scim.api-surface:go-functions] The Go SDK's scimattributeheader.GetByName lists the IdP's SCIM attribute headers and matches the name case-insensitively with strings.EqualFold. [zpa.scim.api-surface:name-lookups] SearchValues keeps only the part of the search query before the first @, so an email-shaped query is searched without its domain. [zpa.scim.api-surface:search-values-drops-domain] In the management-API packages (Go scimgroup and scimattributeheader, Python scim_groups and scim_attributes), neither SDK has a create, update or delete function for SCIM groups or SCIM attribute headers. [zpa.scim.api-surface:no-sdk-writes]

**Terraform.** The zpa_scim_groups and zpa_scim_attribute_header data sources fail unless idp_id or idp_name is set, find the object by id when it is given and otherwise by name, and zpa_scim_attribute_header also reads the attribute's values into a values set. The zpa_scim_groups schema declares idp_id as an integer; up to v4.4.14 its read asserted the value as a string, so a lookup by idp_id found no IdP ID, and v4.4.15 converts the integer to the string the SDK takes. [zpa.scim.api-surface:tf-data-sources] Id-over-name selection in these data sources is in [Which object a ZPA Terraform data source actually returns](kb:zpa.terraform.data-source-selection), and the SDK's name search in [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects).

Separately from the management-API packages, the Go SDK's ZPA scim_api package calls the ZPA SCIM server and has write functions: CreateUser, UpdateUser, PatchUser and DeleteUser for users and CreateGroup, UpdateGroup, PatchGroup and DeleteGroup for groups, besides the reads GetUser, GetUserByName and GetAllUsers for users and GetGroup, GetGroupByName and GetAllGroups for groups. [zpa.scim.api-surface:go-scim-server-client]

What to check:
1. Which call and base path reads the object: groups and attribute values under userconfig, attribute headers under mgmtconfig.
2. Whether the task is a read, which all sources support, rather than a write, which none document or implement.
3. Which group identifier is in hand: the Zscaler integer id, the IdP's idpGroupId, or the internalId.
4. Whether paging, the time range or allEntries is being used to find the groups wanted.
5. Whether a Terraform lookup names the IdP, and how names are matched in the SDK it wraps.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.scim.api-surface:spec-get-only] Tier B: Absence claim from a search of zpa.openapi.json: the five scim paths each define only a get member.
- [zpa.scim.api-surface:no-sdk-writes] Tier B: Absence claim from a read of the Go scimgroup and scimattributeheader files, and of the Python scim_groups.py and scim_attributes.py: the functions listed in claims go-functions and python-methods are the only public ones (Go scimgroup re-read at v3.8.55: Get, GetByName, GetByNameAndIamIdp, GetAllByIdpId). The Go scim_api package, which calls the ZPA SCIM server rather than the management API, does have write functions (go-scim-server-client).

Not known (open gaps):
- What a SCIM group's internal ID is [gap:zpa.scim.api-surface:zpa-64-internal-id]: settled by support-ticket or tenant-data. Blocks: saying which group identifier a script should store

Area: zpa.scim, its subjects in references/_meta/spine/zpa/zpa.scim.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.scim.provisioning-timing.md (When SCIM data is ready for ZPA policy), from zpa.scim: It can take several days for the IdP to sync all user information to ZPA completely. [zpa.scim.provisioning-timing:several-days]
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-selection.md (Which object a ZPA Terraform data source actually returns)
