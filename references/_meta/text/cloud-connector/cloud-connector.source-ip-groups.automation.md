# Managing source IP groups with the ZTC Terraform provider and the Go SDK (cloud-connector.source-ip-groups.automation)
Also called: ztc_ip_source_groups import; zia_ip_source_groups in ztc rule; ipsourcegroups GetByName; ztc_ip_source_groups docs example wrong; source ip group terraform creator_context

**Lookups by name.** The Go SDK's name lookup for source IP groups lists every group and matches case-insensitively: [The other ZTW name lookups (gateways, locations, location templates, account groups, public cloud info, supported regions, DNS and log rules, IP and network service groups, provisioning URLs, workload groups) follow the same list-then-case-insensitive-match pattern; the admin role lookup reads one unpaged list instead, and the ZPA-resources lookup sends a `search` parameter and pages itself.](kb:cloud-connector.sdk-go.lookups:same-pattern-elsewhere). If two groups have names that differ only in case, a name lookup returns whichever the listing gives first, which may not be the intended one. [cloud-connector.source-ip-groups.automation:case-collision] `ztc_ip_source_groups` imports by numeric ID, or, when the import ID is not numeric, by name through `GetByName`. [cloud-connector.source-ip-groups.automation:import-by-id-or-name]

**What the resource keeps in state.** The `ztc_ip_source_groups` resource read copies only the ID, name, addresses and description into state; the data source also sets `creator_context` and `is_non_editable`. [cloud-connector.source-ip-groups.automation:resource-read-fields] Its `description` argument shares the provider multi-line handling: [Both helpers are attached to the `description` argument of nine resources as `StateFunc` and `DiffSuppressFunc`. On those resources a description cannot be cleared by removing it or setting it to an empty string, because the diff is suppressed and no update is sent. The `$$` form is computed for the plan and state; the plugin SDK keeps the configured text for apply, so the request carries `$` as written.](kb:cloud-connector.terraform.provider-behavior:multiline-helpers-on-nine-resources).

**Provider documentation.** The provider's documentation page for `ztc_ip_source_groups` shows its create example as `resource "zia_ip_source_groups"`, a type the provider does not register (it registers the resource as `ztc_ip_source_groups`). [cloud-connector.source-ip-groups.automation:doc-example-wrong-type] The same page's Argument Reference lists `name` as optional ('The name of the IP source group to be exported') and `id`, while the resource schema requires `name` and `ip_addresses`. [cloud-connector.source-ip-groups.automation:doc-arguments-wrong]

**Groups made in ZIA.** The provider's `basic_forward_method_zia.tf` example looks up a source IP group with a `zia_ip_source_groups` data source and passes its ID to `src_ip_groups` of a `ztc_traffic_forwarding_rule`. [cloud-connector.source-ip-groups.automation:zia-data-source-example] The example implies that the ID of a source IP group read through a `zia_ip_source_groups` data source, a name that points at ZIA, is a valid source IP group reference on a Cloud Connector forwarding rule. [cloud-connector.source-ip-groups.automation:zia-ids-accepted]

**Known defects.** The SDK update for source IP groups shares the unchecked-assertion pattern: [The same ignored-assertion-then-dereference update appears across the ZTW services: admin roles, DNS gateway, DNS forwarding gateway, ZIA forwarding gateway, location, location template, forwarding, DNS, and log rules, IP destination, IP, and IP source groups, network service groups and services, the provisioning URL, and workload groups. `UpdatePublicCloudInfo` and the activation functions check the assertion and return an error instead.](kb:cloud-connector.sdk-go.service-defects:ztw-update-deref-same-pattern). Deletes detach the group from forwarding rules only: [The IP source group and IP destination group deletes remove the group whenever the helper returns no error. Their closures cover only the forwarding rule's `SrcIpGroups` and `DestIpGroups` respectively.](kb:cloud-connector.terraform.delete-detach:ip-group-delete-follows-detach).

What to check:
1. Whether two groups share a name that differs only in case before importing or looking a group up by name.
2. Use the data source, not the resource, when origin or editability is needed in Terraform.
3. Write `ztc_ip_source_groups` with `name` and `ip_addresses`, not the provider page's example type or argument list.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.source-ip-groups.automation:case-collision] Tier B: Follows from the list-then-case-insensitive-match lookup, which also covers IP groups; whether the API allows such names was not checked.
- [cloud-connector.source-ip-groups.automation:zia-ids-accepted] Tier B: Inferred from the provider example and from the help placing the page under Internet Access resources. The example names no provider for the data source, and the ZIA provider registers its source IP group data source under another name (zia-data-source-example), so that the group is read through ZIA rests on the `zia_` name alone. No source states that ZIA and Cloud Connector share the group objects.

Area: cloud-connector.source-ip-groups, its subjects in references/_meta/spine/cloud-connector/cloud-connector.source-ip-groups.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.lookups.md (How the Go SDK's ZTW packages find objects by name and filter lists)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.service-defects.md (Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.delete-detach.md (How the ZTC Terraform provider detaches references before deleting objects)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.provider-behavior.md (ZTC Terraform provider: configuration, field handling and read behavior)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/ztw/ip-source-groups.md (config type)
- see-also references/_meta/text/cloud-connector/cloud-connector.source-ip-groups.md (Cloud Connector source IP groups: what they are and what is unknown about them)
