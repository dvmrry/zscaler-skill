# The segment group API, model fields and Terraform resource (zpa.segment-groups.api-surface)
Also called: segmentGroup endpoint; update_group_v2; UpdateV2 segment group; policyMigrated; tcpKeepAliveEnabled; zpa_segment_group resource; terraform import zpa_segment_group; segment group data source
Former IDs: sg-03, zpa-69, zpa-70, zpa-71, zpa-72

This subject covers the segment group endpoints, model fields and the Terraform resource and data source.

**Endpoints.** The segment group API lists and creates at `/mgmtconfig/v1/admin/customers/{customerId}/segmentGroup`, gets, updates and deletes at `.../segmentGroup/{segmentGroupId}`, and has a separate v2 update at `/mgmtconfig/v2/.../segmentGroup/{segmentGroupId}`. [zpa.segment-groups.api-surface:endpoints] The v1 segment group body has `policyMigrated`, `applicationNames` and `sharedMicrotenantIds`, while the v2 update body has `addedApps` and `deletedApps` instead. [zpa.segment-groups.api-surface:v2-body-differs] The Go SDK exposes `Update` (v1 path) and `UpdateV2` (v2 path), and the Python SDK exposes `update_group` and `update_group_v2` against the v1 and v2 base endpoints. [zpa.segment-groups.api-surface:sdks-expose-both-updates] Before v4.4.14 the Terraform `zpa_segment_group` resource updated through `segmentgroup.UpdateV2` with the full group, applications included; v4.4.14 updates through `segmentgroup.UpdateV2Changes`, the same v2 PUT, with a `SegmentGroupV2Update` carrying only name, description, enabled and microtenant ID, so the group's applications are never sent on update (#695). [zpa.segment-groups.api-surface:tf-update-uses-v2] Their behavioral difference is open [gap:zpa.segment-groups.api-surface:v2-update-differences].

**Model fields.** The Go segment group model tags `enabled` and `policyMigrated` without omitempty, so false is always sent. [zpa.segment-groups.api-surface:go-model-flags] The API field `configSpace` on a segment group takes `DEFAULT` or `SIEM`. [zpa.segment-groups.api-surface:config-space-values] What configSpace means is open [gap:zpa.segment-groups.api-surface:config-space-meaning]. What the keepalive field does is open [gap:zpa.segment-groups.api-surface:tcp-keep-alive-enabled-effect], and its type differs between the spec and the Go model [divergence:zpa.segment-groups.api-surface:tcp-keep-alive-enabled-type-differs]. What skipDetailedAppInfo does is open [gap:zpa.segment-groups.api-surface:skip-detailed-app-info-effect].

**Terraform.** The Terraform resource takes a required `name` and optional `description`, `enabled`, `microtenant_id` and an `applications` list of objects with a single `id` attribute; an `enabled` left out is sent as false. Before v4.4.14 every write, create and update, built each application from its `id` alone; v4.4.14 deprecates `applications`, sends the application IDs only on create, never sends them on update, and rejects adding or removing applications on an existing group at plan time (#695). [zpa.segment-groups.api-surface:tf-resource-schema] A segment group can be imported into Terraform by ID or by name. [zpa.segment-groups.api-surface:tf-import] The Terraform data source schema looks a group up by `id` or `name`, both optional, and exports `config_space`, the microtenant fields and a computed `applications` block. [zpa.segment-groups.api-surface:tf-data-source-outputs] The data source docs list two attributes the schema lacks [divergence:zpa.segment-groups.api-surface:tf-data-source-docs-vs-schema]. Provider defects around these objects are in [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects) and [Which object a ZPA Terraform data source actually returns](kb:zpa.terraform.data-source-selection).

What to check:
1. Which update version the tool in use calls, since the v1 and v2 bodies differ.
2. Whether enabled and policyMigrated are written explicitly, since the Go model never omits them.
3. Whether Terraform state for applications reflects the group's real membership, which the resource reads back but writes as IDs only.

Sources disagree (name both sides):
- The API spec types a segment group's `tcpKeepAliveEnabled` as an integer while the Go model types it as a string. [divergence:zpa.segment-groups.api-surface:tcp-keep-alive-enabled-type-differs]
  - api-specs: The API spec types tcpKeepAliveEnabled as a 32-bit integer.
  - sdk-go: The Go model types tcpKeepAliveEnabled as a string.
  Impact: A body written from the spec may send an integer where the SDK sends a string; the literal the service accepts is not shown by these sources.
- The zpa_segment_group data source docs list name as required and export policy_migrated and tcp_keep_alive_enabled, but the schema makes name optional and has neither attribute. [divergence:zpa.segment-groups.api-surface:tf-data-source-docs-vs-schema]
  - tf-zpa: The data source docs list name under Required and policy_migrated and tcp_keep_alive_enabled under Read-Only.
  - tf-zpa: The data source schema declares name optional, and its top level ends at the microtenant fields with no policy_migrated or tcp_keep_alive_enabled attribute; Read sets neither.
  Impact: Referencing data.zpa_segment_group.<name>.policy_migrated or .tcp_keep_alive_enabled fails as an unsupported attribute; read those fields from the API or the SDK instead. Omitting name passes validation, and a lookup then needs id.

Not known (open gaps):
- What the v2 segment group update changes behaviorally, and whether it is the preferred form [gap:zpa.segment-groups.api-surface:v2-update-differences]: settled by lab-test or support-ticket. Blocks: choosing between update and update_v2
- What tcpKeepAliveEnabled on a segment group changes and how it relates to the segment-level setting [gap:zpa.segment-groups.api-surface:tcp-keep-alive-enabled-effect]: settled by lab-test or support-ticket. Blocks: saying whether the group setting overrides segment keepalive
- When a segment group's configSpace is anything other than DEFAULT [gap:zpa.segment-groups.api-surface:config-space-meaning]: settled by lab-test or tenant-data. Blocks: setting or interpreting configSpace
- Whether skipDetailedAppInfo is a request-side toggle or a stored attribute of a segment group [gap:zpa.segment-groups.api-surface:skip-detailed-app-info-effect]: settled by lab-test or source-read

Area: zpa.segment-groups, its subjects in references/_meta/spine/zpa/zpa.segment-groups.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.policy.access-rule-order.md (Access policy rule order), from zpa.segment-groups: An allow rule for all applications for Marketing, listed above a rule denying Marketing the Operations Apps segment group, leaves Marketing with access to that group, because Private Access stops at the first matching rule. [zpa.policy.access-rule-order:segment-group-allow-shadows-deny]
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-selection.md (Which object a ZPA Terraform data source actually returns)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zpa/zpa.terraform.data-source-fidelity.md (What ZPA Terraform data sources return, drop, or get wrong)
- configured-via references/_meta/text/types/zpa/segment-groups.md (config type)
