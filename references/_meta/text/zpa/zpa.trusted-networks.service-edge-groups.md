# Trusted networks on ZPA Private Service Edge groups (zpa.trusted-networks.service-edge-groups)
Also called: private service edge group trusted networks; publicly accessible private service edge; is_public service edge group; prefer on-prem private service edge; service edge group trusted_networks block
Former IDs: zpa-81

This subject covers trusted networks on Private Service Edge groups.

**What the mapping does.** Trusted networks mapped to a Private Service Edge group are used to prioritize Private Service Edges that match a given trusted network when users connect from those networks. [zpa.trusted-networks.service-edge-groups:prioritize-matching] [Trusted networks are available for Zscaler Client Connectors only and are not supported with Cloud & Branch Connectors.](kb:zpa.private-service-edges.client-selection:trusted-networks-zcc-only)

**Public access.** [The Publicly Accessible setting makes a Private Service Edge group that has trusted-network mapping also available to all users outside those networks; the Private Service Edge must be reachable over a public IP address for remote users to connect.](kb:zpa.private-service-edges.client-selection:publicly-accessible) The console's Publicly Accessible setting is the `isPublic` field of the service edge group, `is_public` in Terraform. [zpa.trusted-networks.service-edge-groups:is-public-field] The Go SDK carries `isPublic` as a string. The Terraform provider writes it as the upper-cased `strconv.FormatBool` of `is_public` and parses it back with ParseBool, ignoring a parse error. [zpa.trusted-networks.service-edge-groups:is-public-wire] So the provider sends `isPublic` as `"TRUE"` or `"FALSE"`. [zpa.trusted-networks.service-edge-groups:is-public-wire-values] Off-network routing with the setting off is open [gap:zpa.trusted-networks.service-edge-groups:off-network-fallback].

**In Terraform.** The Terraform `trusted_networks` block on a service edge group takes trusted network `id` values, and the provider sends each as the SDK trusted network's `ID`; this is the object `id`, not the `network_id` that policy conditions use. [zpa.trusted-networks.service-edge-groups:tf-sends-object-id] Only the first `trusted_networks` block is read: [The same first-block-only read is in the other association expanders in `common.go` (app connector groups, app server groups, service edge groups), which feed the v1 and v2 access policy rules, the redirection rule and the server group resource, and in the server group, service edge group (`trusted_networks`) and user portal link expanders, where the schema allows several blocks (the private cloud and `service_edges` expanders are single-block by schema).](kb:zpa.terraform.app-segment-lifecycle:association-block-first-only-places). The data source discards errors on this list: [The service edge group data source discards the errors of `d.Set` for `service_edges` and `trusted_networks`, the two nested lists built by flatteners. The `zpa_policy_type` and app connector controller data sources check the equivalent nested sets, so the handling differs between data sources of the same family.](kb:zpa.terraform.data-source-fidelity:service-edge-group-nested-sets-ignored). The ZPA-side identifiers: [The ZPA trusted network object and how to fetch it](kb:zpa.trusted-networks.object).

What to check:
1. Whether the client is Zscaler Client Connector; Cloud and Branch Connectors cannot use trusted network mapping.
2. Which identifier the service edge group block expects: the trusted network `id`.
3. Whether the group is publicly accessible, and the wire form of the setting.
4. Where off-network users go when the group is not publicly accessible, which no source settles.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.trusted-networks.service-edge-groups:is-public-field] Tier B: Inference: the help names the console setting and the code names the field; no source links the two by name.
- [zpa.trusted-networks.service-edge-groups:is-public-wire-values] Tier B: Follows from Go's `strconv.FormatBool` returning "true" or "false" and `strings.ToUpper`; no captured source spells out the provider's two wire values.

Not known (open gaps):
- Where off-network users connect when a mapped Private Service Edge group is not publicly accessible [gap:zpa.trusted-networks.service-edge-groups:off-network-fallback]: settled by lab-test. Blocks: predicting off-network routing

Area: zpa.trusted-networks, its subjects in references/_meta/spine/zpa/zpa.trusted-networks.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.client-selection.md (How clients are steered to a Private Service Edge and which country policy applies): Trusted networks mapped to a Private Service Edge group are used to prioritize Private Service Edges that match a given trusted network when users connect from those networks. [zpa.trusted-networks.service-edge-groups:prioritize-matching]
- decided-by references/_meta/text/zcc/zcc.trusted-networks.detection.md (How Client Connector decides it is on a trusted network), from zpa.trusted-networks: Zscaler Client Connector identifies a trusted network by criteria defined for it on the Trusted Networks page, and a forwarding profile can select several predefined trusted networks. [zpa.trusted-networks.zcc-relationship:zcc-defines-criteria]
- links-to references/_meta/text/zpa/zpa.terraform.app-segment-lifecycle.md (What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-fidelity.md (What ZPA Terraform data sources return, drop, or get wrong)
- links-to references/_meta/text/zpa/zpa.trusted-networks.object.md (The ZPA trusted network object and how to fetch it)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/service-edge-groups.md (config type)
- configured-via references/_meta/text/types/zpa/trusted-networks.md (config type)
