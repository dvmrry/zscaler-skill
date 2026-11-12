# IP pools for Private Access DNS resolution in Cloud & Branch Connector: default pool, per-location pools and entries (cloud-connector.shared-objects.ip-pools)
Also called: ip pool; private access ip pool; synthetic ip pool; default private access ip pool

The Cloud & Branch Connector IP pool is the address set behind Private Access DNS answers. The IP pool is only used in DNS control policies to forward traffic to Private Access when the network traffic action under the DNS filtering rule is Resolved by Private Access, and it can be customized to provide the synthetic IP address while resolving DNS requests from workloads to Private Access applications. [cloud-connector.shared-objects.ip-pools:purpose] IP pools let users control the IP address space cloud workloads interact with, as a customizable space where IP addresses do not overlap. [cloud-connector.shared-objects.ip-pools:non-overlapping]

**Default and per-scope pools.** A default Private Access IP pool is created automatically, and the default IP pool cannot be edited or deleted. [cloud-connector.shared-objects.ip-pools:default-pool] Different IP pools can be configured for each location, and separate pools can give different synthetic addresses based on source location, Location Group, Cloud Connector Group and Branch Connector Group. [cloud-connector.shared-objects.ip-pools:per-scope-pools] How a pool is bound to a location or group, and which wins when both match, is open [gap:cloud-connector.shared-objects.ip-pools:pool-binding].

**Console page and entries.** The IP Pool page is under Internet Access > Resources > IP & FQDN Groups (IP Pool tab) and lists, among its columns, the range of IP addresses assigned to each pool. [cloud-connector.shared-objects.ip-pools:page] Adding a Cloud & Branch Connector IP pool takes any number of IP addresses, each as an address, a range or an address with a netmask, and multiple entries can be entered. [cloud-connector.shared-objects.ip-pools:entry-formats] An IP pool name allows only alphanumeric characters, underscores, hyphens and periods; the description cannot exceed 10,240 characters; adding a pool ends with saving and activating the changes. [cloud-connector.shared-objects.ip-pools:name-description] No size limit is stated [gap:cloud-connector.shared-objects.ip-pools:pool-limits].

**Range and overlap.** The networking-flows page gives the default Private Access IP pool in Zscaler connector tenants as 10.254.0.0/19, and says administrators can either change the IP pool to a desired CIDR range or provide different IP pools based on Cloud or Branch Connector locations. [cloud-connector.shared-objects.ip-pools:default-range] Whether changing the pool means editing the default pool is not stated [gap:cloud-connector.shared-objects.ip-pools:change-vs-edit]. The synthetic IP pool must not overlap with any IP addresses used by IP-based Private Access applications; if there is an overlap, the ephemeral IP pool range is to be changed to a non-overlapping space. [cloud-connector.shared-objects.ip-pools:no-overlap] If applications are defined using DNS hostnames or domains in Private Access, the true private IP addresses of the servers are hidden from the requesting workloads through Cloud and Branch Connectors; Zscaler saves the true IP address for troubleshooting and logging purposes. [cloud-connector.shared-objects.ip-pools:true-ip-hidden]

**ZIA pools.** ZIA has IP pools for other features, with their own entry rule: [IP pools for Source IP Anchoring and Extranet](kb:zia.dns-control.ip-pools). Whether the two describe one object is open [gap:cloud-connector.shared-objects.ip-pools:zia-pool-scope]. Where DNS rules use the pool is in [Cloud & Branch Connector DNS policies: scope, criteria, actions, predefined rules](kb:cloud-connector.dns.policies) and [Cloud & Branch Connector DNS handling: DNS policies and DNS gateways](kb:cloud-connector.dns).

Not known (open gaps):
- How a pool is bound to a location or group, and which wins when both match [gap:cloud-connector.shared-objects.ip-pools:pool-binding]: settled by lab-test or source-read
- Whether "change the IP pool" means editing the default pool or choosing another pool [gap:cloud-connector.shared-objects.ip-pools:change-vs-edit]: settled by lab-test or support-ticket
- IP pool size limit [gap:cloud-connector.shared-objects.ip-pools:pool-limits]: settled by lab-test or support-ticket
- Whether the Cloud & Branch Connector IP pool and ZIA's IP pools are the same object [gap:cloud-connector.shared-objects.ip-pools:zia-pool-scope]: settled by lab-test or support-ticket

Area: cloud-connector.shared-objects, its subjects in references/_meta/spine/cloud-connector/cloud-connector.shared-objects.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.dns.md (Cloud & Branch Connector DNS handling: DNS policies and DNS gateways)
- links-to references/_meta/text/cloud-connector/cloud-connector.dns.policies.md (Cloud & Branch Connector DNS policies: scope, criteria, actions, predefined rules)
- links-to references/_meta/text/zia/zia.dns-control.ip-pools.md (IP pools for Source IP Anchoring and Extranet)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.shared-objects.md (Objects ZIA and Cloud & Branch Connector share: IP groups and network services)
