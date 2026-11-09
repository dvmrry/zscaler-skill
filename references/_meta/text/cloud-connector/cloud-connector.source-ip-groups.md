# Cloud Connector source IP groups: what they are and what is unknown about them (cloud-connector.source-ip-groups)
Also called: ip source groups cloud connector; ipSourceGroups; ztc_ip_source_groups; creatorContext; isNonEditable source group; source ip group limit
Former IDs: cloud-connector-03, cloud-connector-04, cloud-connector-06

Source IP groups are named sets of addresses that Cloud Connector rules reference by ID. Grouping source IP addresses makes them usable in policies: one security or forwarding policy can cover a group of workloads by their source addresses, and workloads can be added to or removed from the group without a new security policy. [cloud-connector.source-ip-groups:purpose] The Cloud & Branch Connector help places the Source IP Groups page under Internet Access > Resources > IP & FQDN Groups, on the Source IPv4 Groups tab. [cloud-connector.source-ip-groups:help-page-ipv4-tab]

**Where they are used.** Which rule types take them, and how, is in [Which Cloud Connector rules take source IP groups, and how the source criterion behaves](kb:cloud-connector.source-ip-groups.rule-use); managing them with Terraform and the Go SDK is in [Managing source IP groups with the ZTC Terraform provider and the Go SDK](kb:cloud-connector.source-ip-groups.automation).

**Origin and editability.** A group's `creatorContext` says whether the IP group or IP pool was created in Cloud & Branch Connector (EC) or in ZIA; the API contract allows the values ZIA and EC. [cloud-connector.source-ip-groups:creator-context-values] The provider's data source describes EC as the only value [divergence:cloud-connector.source-ip-groups:creator-context-description]. `isNonEditable` marks a view-only group; the Go SDK comment says it applies only to predefined groups, which cannot be modified (the comment calls them destination IP address groups, although it sits on the source group struct). [cloud-connector.source-ip-groups:non-editable-predefined] Whether the API refuses writes to such groups, and whether ZIA-origin groups can be changed through this API, is not shown [gap:cloud-connector.source-ip-groups:zia-origin-editability].

**Lite listing.** The lite listing returns basic information such as name and ID; the contract types its items as entity references (`EntityReference`), with no `creatorContext` and no `ipAddresses`. [cloud-connector.source-ip-groups:lite-schema]

**Entries and limits.** The help for adding a source IP group takes any number of IP addresses, each as a single address, a range, or an address with a netmask (for example 198.51.100.100, 192.0.2.1-192.0.2.10, 203.0.113.0/24). [cloud-connector.source-ip-groups:entry-formats] A group name may contain only alphanumeric characters, underscores, hyphens and periods, and the description cannot exceed 10,240 characters. [cloud-connector.source-ip-groups:name-characters] How overlapping entries are treated is not stated [gap:cloud-connector.source-ip-groups:overlapping-entries]. No source gives a per-group or per-tenant platform limit [gap:cloud-connector.source-ip-groups:size-and-count-limits]. Whether a group may hold IPv6 entries is open [gap:cloud-connector.source-ip-groups:ipv6-entries].

**Changes.** Adding a source IP group in the console ends with saving and activating the change. [cloud-connector.source-ip-groups:save-and-activate-group] A change takes effect only after activation: [The Activation API resources activate configuration changes by pushing them to the Central Authority (CA); for any configuration change to take effect, the service requires it to be activated.](kb:cloud-connector.api.activation-wire:activation-pushes-to-ca).

What to check:
1. Whether the group was created in ZIA or Cloud & Branch Connector (`creatorContext`) and whether it is predefined (`isNonEditable`) before planning to change it through this API.
2. Read the full listing rather than the lite one when origin or addresses are needed.

Sources disagree (name both sides):
- The provider's data source describes EC as the only applicable `creator_context` value; the API contract allows ZIA and EC. [divergence:cloud-connector.source-ip-groups:creator-context-description]
  - tf-ztc: EC is the only applicable value.
  - api-specs: The value is ZIA or EC.
  Impact: A group read through the Terraform data source can carry ZIA despite the attribute's description; filters that assume EC miss ZIA-origin groups.

Not known (open gaps):
- Writes to ZIA-origin and non-editable source groups through the Cloud Connector API [gap:cloud-connector.source-ip-groups:zia-origin-editability]: settled by lab-test. Blocks: Planning a change to a source group that ZIA created or Zscaler predefined.
- Per-group entry limit and per-tenant source IP group count [gap:cloud-connector.source-ip-groups:size-and-count-limits] (data gap): filled by none; settled by support-ticket or lab-test. Blocks: Capacity planning and explaining a rejected create.
- IPv6 entries in a source IP group, and what srcIpv6Groups refers to [gap:cloud-connector.source-ip-groups:ipv6-entries]: settled by lab-test or code-read. Blocks: Applying source-address policy to IPv6 workloads.
- How overlapping or redundant entries in one group are treated [gap:cloud-connector.source-ip-groups:overlapping-entries]: settled by lab-test. Blocks: Predicting whether a create or update with overlapping entries is accepted.

Area: cloud-connector.source-ip-groups, its subjects in references/_meta/spine/cloud-connector/cloud-connector.source-ip-groups.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.api.activation-wire.md (Cloud Connector activation on the wire: activate, forced activate, and what the clients send)
- links-to references/_meta/text/cloud-connector/cloud-connector.source-ip-groups.automation.md (Managing source IP groups with the ZTC Terraform provider and the Go SDK)
- links-to references/_meta/text/cloud-connector/cloud-connector.source-ip-groups.rule-use.md (Which Cloud Connector rules take source IP groups, and how the source criterion behaves)
