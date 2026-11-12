# What Microsegmentation resources, Kubernetes cluster resources and resource groups are, including ML recommendations (zms.resources)
Also called: zms resource groups; microsegmentation resources; managed unmanaged resource group; system resource groups; ml recommendations for resource groups; zms dynamic membership

Resource groups anchor Microsegmentation policies and can be built from added resources combined with dynamic criteria on hosts, environments and cloud tag data. [zms.resources:rg-purpose]

**Resources.** The Resources VM page lists each resource's Name, AppZone, Type, Cloud, Status, Platform (operating system) and Last Seen (last time the resource connected). [zms.resources:resources-columns] Kubernetes Clusters are an alternative to virtual machines for agent groups and support GKE, AKS and Amazon EKS. [zms.resources:k8s-platforms] The Cluster Resources page filters by Name, AppZone, Status and Resource ID and lists Type (Workload, Node or Service) and Status (Active or Inactive). [zms.resources:k8s-columns]

**Resource groups.** Managed resource groups hold resources with agents that are actively protected; unmanaged groups are not actively protected, are defined as CIDR blocks or IP ranges, and only managed groups get static and dynamic membership. [zms.resources:rg-managed-unmanaged] System Resource Groups are unmanaged, system-level, view-only resource groups that can be used to define policies. [zms.resources:system-rgs] Dynamic membership criteria use the tag scopes Host (Host Name, Platform, Platform Distro, Platform Version, CPU Architecture), Environment (AMI ID, account/subscription, cloud provider and region, VPC/VNET, subnet, security group, CIDR, IP range), ZMS (agent groups), Cloud and ML. [zms.resources:dynamic-scopes] Creating a resource group requires policy enforcement to be enabled for the organization, and the option to create a perimeter policy is selected by default; that policy then appears at the bottom of the Perimeter Policies page. [zms.resources:rg-prereq-perimeter] Deleting a resource group requires entering CONFIRM in the Delete Resource Group window, and the page says resource groups can be configured, edited and deleted at any time. [zms.resources:rg-delete-confirm]

**ML recommendations.** ML recommendations for resource groups are generated from user-defined cloud tags, cloud environment metadata and host data; approving one configures it automatically as a resource group. [zms.resources:ml-rg-basis] An ML resource group recommendation can be accepted, edited and approved, or ignored; ignoring one means its specific data will not be regenerated in a future recommendation. [zms.resources:ml-rg-ignore] Admins must first accept the terms agreement on the ML Recommendations for Resource Groups page before recommendations appear, and disabling ML recommendations requires contacting Zscaler Support; the page also offers instructions to have Zscaler Support enable or disable ML recommendations for the organization. [zms.resources:ml-rg-terms] Each ML resource group recommendation has a Confidence Score from 1 (lowest) to 100 (highest) and a name generated from its Dynamic Membership criteria. [zms.resources:ml-rg-confidence] For ML recommendations, resource groups by default can include up to 10 dynamic criteria tags; when more than 10 are available for a recommendation the top 10 by priority are chosen: custom tags highest, then cloud tags, ML tags, network identifiers and environment fields, with agent group IDs lowest. [zms.resources:ml-rg-top10]

**Related.** Tags used as criteria are in [How Microsegmentation namespaces, tags and resource tags are configured and which are locked](kb:zms.tags), policies built on groups in [How Microsegmentation resource policies, perimeter policies and policy settings work](kb:zms.policies) and AppZones in [The Microsegmentation portal: Application Catalog, ML tag recommendations, tags and AppZones](kb:zms.portal).

What to check:
1. Whether the resource group is managed or unmanaged before expecting static or dynamic membership.
2. Whether the ML recommendations terms agreement has been accepted, and whether Zscaler Support has enabled ML recommendations for the organization, before expecting recommendations.

Area: zms.resources, its subjects in references/_meta/spine/zms/zms.resources.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zms/zms.policies.md (How Microsegmentation resource policies, perimeter policies and policy settings work)
- links-to references/_meta/text/zms/zms.portal.md (The Microsegmentation portal: Application Catalog, ML tag recommendations, tags and AppZones)
- links-to references/_meta/text/zms/zms.tags.md (How Microsegmentation namespaces, tags and resource tags are configured and which are locked)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zms/zms.overview.md (Zscaler Microsegmentation (ZMS): agents, local enforcement, region and provisioning)
- see-also references/_meta/text/zms/zms.agent-groups.md (How Microsegmentation agent groups are configured, aged out, upgraded and managed)
