# Tenant profile API, SDK and Terraform behavior (zia.tenant-profiles.api-surface)
Also called: tenancyRestrictionProfile api; list_restriction_profile; zia_tenant_restriction_profile; app-item-count; tenancy_profile_ids terraform limit; tenant profile sdk

Use this when automating tenant profiles or reading them through a tool.

**API and clients.** Tenant profiles are read and written at `/zia/api/v1/tenancyRestrictionProfile` (list, create) and `/tenancyRestrictionProfile/{id}` (get, update by PUT, delete). The Go SDK updates with PUT. [zia.tenant-profiles.api-surface:endpoint] The Python service `client.zia.tenancy_restriction_profile` names its methods `list_restriction_profile`, `get_restriction_profile`, `add_restriction_profile`, `update_restriction_profile`, `delete_restriction_profile` and `list_app_item_count`. [zia.tenant-profiles.api-surface:python-method-names] The bare names such as `list_profiles` or `get_profile` do not exist on the Python tenant profile service; calls must use the `*_restriction_profile` names. [zia.tenant-profiles.api-surface:no-bare-profile-names] The Go SDK package `tenancy_restriction` exposes `Get`, `GetByName` (a case-insensitive name match across all pages), `Create`, `Update`, `Delete`, `GetAll` and `GetAppItemCount`. [zia.tenant-profiles.api-surface:go-functions]

**Fields.** The application list is in [Which applications support tenant profiles, and what each profile identifies](kb:zia.tenant-profiles.applications). The API accepts eighteen `itemTypePrimary` and `itemTypeSecondary` tokens, a single flat list with no per-application grouping. [zia.tenant-profiles.api-surface:item-type-enum] The Terraform resource does not validate `app_type`, `item_type_primary`, `item_type_secondary` or `item_value`: the first three are free strings and `item_value` is a set of free strings, and each description points to the API reference. [zia.tenant-profiles.api-surface:tf-tokens-unvalidated]

**Capacity helper.** A separate call returns the item count of an item type for an application, with an optional `excludeProfile` profile ID to leave out of the count. The Go SDK sends the optional ID; the Python method does not accept it, although its docstring lists `exclude_profile`. [zia.tenant-profiles.api-surface:app-item-count]

**Booleans.** The Go SDK tags all five boolean flags (`restrictPersonalO365Domains`, `allowGoogleConsumers`, `msLoginServicesTrV2`, `allowGoogleVisitors`, `allowGcpCloudStorageRead`) with `omitempty`, and the Terraform resource builds the struct directly from state. [zia.tenant-profiles.api-surface:go-omits-false-flags] So an update leaves a flag set to false out of the request body, and Terraform or Go cannot write false explicitly. [zia.tenant-profiles.api-surface:go-false-not-sent] The general mechanism is in [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes). What the server does with an omitted false is open [gap:zia.tenant-profiles.api-surface:omitted-false-server-reaction].

**Audit fields.** The Go struct carries `lastModifiedTime` and `lastModifiedUserId`, which the Python model lacks; in Terraform the tenant profile data source exposes them as computed attributes. [zia.tenant-profiles.api-surface:last-modified-fields]

**Rule references.** At v4.7.22 the Terraform provider capped `tenancy_profile_ids` on `zia_cloud_app_control_rule` at eight, below the 16 profiles per rule the limits page documents. 4.7.23 removed the local cap, leaving the limit to the API. [zia.tenant-profiles.api-surface:tf-profile-ids-cap-8] The rule field and its limits: [Tenant Profiles: SaaS tenant restriction](kb:zia.tenant-profiles) and [Tenant profile limits: per rule,, per organization](kb:zia.tenant-profiles.limits). Other provider fidelity traps: [ZIA Terraform resource fields that are not sent, not read back, or sent wrongly](kb:zia.terraform.field-fidelity).

What to check:
1. Whether the provider version predates 4.7.23 when a plan rejects more than eight profiles on one rule, before blaming policy.

Inferred, not quoted (say so when an answer rests on one):
- [zia.tenant-profiles.api-surface:go-false-not-sent] Tier B: Follows from the tags (go-omits-false-flags), from ZIA updates marshalling the caller's struct with `json.Marshal` (zia.sdk-go.write-encoding:marshals-caller-struct), and from Go's encoding/json dropping a false field tagged omitempty (the general mechanism claim, which holds where the field's type has no MarshalJSON of its own; the five flags are plain `bool`). How the create path encodes the struct is not quoted here. Not observed on the wire for this resource.
- [zia.tenant-profiles.api-surface:no-bare-profile-names] Tier B: The client file at the pinned SDK defines only the six methods named in python-method-names besides the constructor; a quote cannot pin the absence of other method names in code.

Not known (open gaps):
- What the service does when a false flag is omitted from a PUT [gap:zia.tenant-profiles.api-surface:omitted-false-server-reaction]: settled by lab-test. Blocks: whether Terraform can turn a tenant-profile flag off

Area: zia.tenant-profiles, its subjects in references/_meta/spine/zia/zia.tenant-profiles.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control), from zia.tenant-profiles: Tenancy restriction lets you restrict access to personal accounts, business accounts, or both for certain cloud applications. It has two parts: creating tenant profiles, and associating them with Cloud App Control policy rules. [zia.tenant-profiles:what-it-is]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.ai-ml-rules.md (AI & ML Applications rules: granular actions, prompt capture, tenant profiles), from zia.tenant-profiles: In the AI/ML rule UI, Tenant Profiles appears only when ChatGPT is the selected cloud application, and the applications selected under the tenant profiles must not be exempted from SSL/TLS Inspection. [zia.cloud-app-control.ai-ml-rules:tenant-profiles-visibility]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies), from zia.tenant-profiles: Allowing a specific tenant automatically blocks other tenants for most cloud applications, and subsequent policies are not evaluated. [zia.tenant-profiles:allow-blocks-others]
- depends-on references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)), from zia.tenant-profiles: Header insertion into HTTPS needs the request decrypted, so a tenant restriction can work only where the SSL/TLS inspection rule covers the login service. [zia.tenant-profiles.wire-mechanic:needs-decrypted-traffic]
- depends-on references/_meta/text/zia/zia.tenant-profiles.ssl-prerequisite.md (SSL/TLS inspection rules a tenant profile depends on), from zia.tenant-profiles: When a tenant profile is associated with a cloud application rule, the application must be selected as a criterion in an SSL/TLS Inspection rule. [zia.tenant-profiles.ssl-prerequisite:ssl-rule-required]
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
- links-to references/_meta/text/zia/zia.tenant-profiles.md (Tenant Profiles: SaaS tenant restriction)
- links-to references/_meta/text/zia/zia.tenant-profiles.applications.md (Which applications support tenant profiles, and what each profile identifies)
- links-to references/_meta/text/zia/zia.tenant-profiles.limits.md (Tenant profile limits: per rule,, per organization)
- links-to references/_meta/text/zia/zia.terraform.field-fidelity.md (ZIA Terraform resource fields that are not sent, not read back, or sent wrongly)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/tenancy-restriction-profiles.md (config type)
- see-also references/_meta/text/zia/zia.tenant-profiles.microsoft.md (Microsoft Login Services tenant profiles: v1, v2, personal accounts)
