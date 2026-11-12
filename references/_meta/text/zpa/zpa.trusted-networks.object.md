# The ZPA trusted network object and how to fetch it (zpa.trusted-networks.object)
Also called: trusted network object; network_id vs id; trusted network api; zpa_trusted_network data source; trusted network read only; trusted network cloud suffix

This subject covers the ZPA trusted network object.

**Fields.** A ZPA trusted network has `id`, `name`, `domain`, `networkId`, `zscalerCloud`, `masterCustomerId` and creation and modification fields. The API describes `id` as the unique identifier of the trusted network and `networkId` as the unique identifier of the network. [zpa.trusted-networks.object:fields] A trusted network's `id` and `networkId` are different values: the documented example response has a numeric-style `id` and a GUID-style `networkId`. [zpa.trusted-networks.object:two-identifiers]

**Fetching.** The OpenAPI document's trusted network operations are a v2 GET of all trusted networks and a v1 GET of one trusted network by `id`; the help page documents the same single fetch. [zpa.trusted-networks.object:api-operations] The single-fetch path is `/network/{id}`, documented as the trusted network's ID; the Python SDK's get_network sends its argument there under the name `network_id`. [zpa.trusted-networks.object:single-fetch-takes-id] The Go SDK finds a trusted network by `networkId` (`GetByNetID`) by paging the v2 list and comparing each entry's NetworkID. [zpa.trusted-networks.object:lookup-by-network-id] The trusted network list takes `page` and `pagesize`, with a default page size of 20 and a maximum of 500. [zpa.trusted-networks.object:paging]

**Clients.** The Go and Python SDKs only read trusted networks, and the Terraform provider has a `zpa_trusted_network` data source and no resource. [zpa.trusted-networks.object:no-client-writes] The provider documents that the trusted network data source can be referenced within an access, forwarding, inspection or isolation policy and a service edge group. [zpa.trusted-networks.object:data-source-targets] The Go SDK name lookup removes a trailing parenthesised cloud name, such as `(zscalerthree.net)`, from both the requested name and each listed name before comparing case-insensitively. The Python SDK's list call passes its search string through unchanged. [zpa.trusted-networks.object:go-strips-cloud-suffix] The data source document says otherwise [divergence:zpa.trusted-networks.object:cloud-suffix-in-name-lookup]. Data source selection defects: [Which object a ZPA Terraform data source actually returns](kb:zpa.terraform.data-source-selection).

**Ownership.** What `masterCustomerId` signals is open [gap:zpa.trusted-networks.object:master-customer-id-meaning]. Where the networks come from: [Trusted networks in ZPA and in Client Connector](kb:zpa.trusted-networks.zcc-relationship).

What to check:
1. Which identifier a call needs: `id` for a single fetch, `networkId` for a rule operand.
2. Whether the task needs to create or edit a trusted network, which no documented client does.
3. Whether a name lookup failed on a cloud suffix.
4. Whether a list call is complete; page size is capped at 500.
5. What masterCustomerId says about ownership, which no source settles.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.trusted-networks.object:no-client-writes] Tier B: Rests on absence: both SDK files were read in full and define no create, update or delete; the provider's docs/resources and zpa/ directories were searched (2026-10-18) and hold data_source_zpa_trusted_network.go but no resource.
- [zpa.trusted-networks.object:go-strips-cloud-suffix] Tier B: The Python half rests on absence: trusted_networks.py was read in full and does not strip a suffix.

Sources disagree (name both sides):
- The Terraform data source document says the cloud name must be appended to query a trusted network tied to a specific cloud; the Go SDK strips that suffix before comparing names, and the provider's release notes say name search works without it. [divergence:zpa.trusted-networks.object:cloud-suffix-in-name-lookup]
  - tf-zpa: The cloud name must be appended to the name.
  - sdk-go: The SDK removes a cloud suffix from the requested name before searching.
  - tf-zpa: Name search without the cloud name is supported.
  Impact: A name with or without the cloud suffix is accepted by the Go-based data source, so the document's instruction is stricter than the code. Because the SDK strips the suffix from both the requested name and each listed name, two networks with the same base name in different clouds match on the first one returned.
  Resolved (source-rank) by zpa.trusted-networks.object:go-strips-cloud-suffix: The SDK code and the release note agree; the data source document predates the change.

Not known (open gaps):
- What masterCustomerId means for a trusted network [gap:zpa.trusted-networks.object:master-customer-id-meaning]: settled by tenant-data or lab-test. Blocks: saying a trusted network is inherited

Area: zpa.trusted-networks, its subjects in references/_meta/spine/zpa/zpa.trusted-networks.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zcc/zcc.trusted-networks.detection.md (How Client Connector decides it is on a trusted network), from zpa.trusted-networks: Zscaler Client Connector identifies a trusted network by criteria defined for it on the Trusted Networks page, and a forwarding profile can select several predefined trusted networks. [zpa.trusted-networks.zcc-relationship:zcc-defines-criteria]
- depends-on references/_meta/text/zcc/zcc.trusted-networks.object.md (The Client Connector trusted network object and its v1 API): The read-only trusted network records ZPA returns are the trusted networks configured on the Client Connector side. [zpa.trusted-networks.zcc-relationship:zpa-objects-are-zcc-networks]
- links-to references/_meta/text/zpa/zpa.terraform.data-source-selection.md (Which object a ZPA Terraform data source actually returns)
- links-to references/_meta/text/zpa/zpa.trusted-networks.zcc-relationship.md (Trusted networks in ZPA and in Client Connector)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/trusted-networks.md (config type)
- see-also references/_meta/text/zpa/zpa.trusted-networks.policy-operand.md (The TRUSTED_NETWORK operand in ZPA policy rules)
- see-also references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
