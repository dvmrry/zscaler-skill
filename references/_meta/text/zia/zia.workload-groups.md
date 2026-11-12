# ZIA Workload Groups: scoping rules to cloud workloads (zia.workload-groups)
Also called: workload groups; workloadGroups; workload group; policy scoping by cloud tag; zia_workload_groups; cloud workload scoping; workload traffic policy

A workload group selects cloud workloads by building an expression from tag types and key-value pairs, and is then used as a criterion in Internet & SaaS (ZIA) policies so that security policy applies to the workload traffic. [zia.workload-groups:what-it-is] Membership comes from cloud-native metadata: workloads with user-defined tags and provider-defined attributes that match the group's expression belong to the group, and their traffic is forwarded by Cloud Connectors to the Zero Trust Exchange where the selected policies apply. [zia.workload-groups:cloud-metadata-source]

Location groups are covered elsewhere: the predefined Workload Traffic location group and how a location lands in it are in [Location groups: manual and dynamic, conditions, limits, predefined groups](kb:zia.locations.groups) and [How locations land in groups: location type, defaults, exclusion flags and Terraform support](kb:zia.locations.group-assignment), and the sublocations Cloud Connector creates for workloads are in [AWS workload sublocation scopes (VPC endpoint, VPC, account, namespace)](kb:zia.locations.workload-scopes). The Terraform URL Filtering rule and SSL inspection rule resources carry both `workload_groups` and `location_groups`, so a rule can scope by both. [zia.workload-groups:both-fields]

**Before expecting any of this to exist.** The feature needs a subscription to a Workload SKU and a Cloud & Branch Connector account; after subscribing, Zscaler Support must enable the Workload Discovery Service Endpoint before Workload Groups can be used. [zia.workload-groups:discovery-prerequisite] The deployed workloads and their discovered tags can be viewed on the Cloud & Branch Connector Partner Integrations page in the Admin Console. [zia.workload-groups:discovered-in-cloud-connector]

**Who can change them.** Only admins with full policy access can add or edit workload groups. [zia.workload-groups:edit-permission] The console lists each group with its name, description, last modifier and last-modified time, and offers search, add, edit and delete. [zia.workload-groups:console-page]

**Reading order.**
1. What an expression can say, and what it cannot be shown to do: [What a workload group expression can contain](kb:zia.workload-groups.expressions).
2. Which rules accept a workload group, and how many per rule: [Which ZIA rules accept workload groups, and how many](kb:zia.workload-groups.rule-scoping).
3. Reading and writing them through the API, Terraform and MCP: [Reading and writing workload groups: API, SDKs, Terraform, MCP](kb:zia.workload-groups.api-surface).

How ZIA evaluates an expression against live traffic is open [How ZIA evaluates an expression against live workload traffic](kb:zia.workload-groups.expressions:runtime-evaluation).

What to check:
1. Whether the question asks how an expression matches live traffic, which no source establishes, or what the console help and examples state.

Area: zia.workload-groups, its subjects in references/_meta/spine/zia/zia.workload-groups.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.workload-groups.expressions.md (What a workload group expression can contain): Membership comes from cloud-native metadata: workloads with user-defined tags and provider-defined attributes that match the group's expression belong to the group, and their traffic is forwarded by Cloud Connectors to the Zero Trust Exchange where the selected policies apply. [zia.workload-groups:cloud-metadata-source]
- depends-on references/_meta/text/cloud-connector/cloud-connector.workload-discovery.md (AWS workload discovery for Cloud Connector: what it is and how the pieces fit): The deployed workloads and their discovered tags can be viewed on the Cloud & Branch Connector Partner Integrations page in the Admin Console. [zia.workload-groups:discovered-in-cloud-connector]
- links-to references/_meta/text/zia/zia.locations.group-assignment.md (How locations land in groups: location type, defaults, exclusion flags and Terraform support)
- links-to references/_meta/text/zia/zia.locations.groups.md (Location groups: manual and dynamic, conditions, limits, predefined groups)
- links-to references/_meta/text/zia/zia.locations.workload-scopes.md (AWS workload sublocation scopes (VPC endpoint, VPC, account, namespace))
- links-to references/_meta/text/zia/zia.workload-groups.api-surface.md (Reading and writing workload groups: API, SDKs, Terraform, MCP)
- links-to references/_meta/text/zia/zia.workload-groups.rule-scoping.md (Which ZIA rules accept workload groups, and how many)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/workload-groups.md (config type)
