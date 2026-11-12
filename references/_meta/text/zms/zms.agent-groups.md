# How Microsegmentation agent groups are configured, aged out, upgraded and managed (zms.agent-groups)
Also called: zms agent group; microsegmentation version profile; agent age out; agent group upgrade now; agent group upgrade failure; zms kubernetes cluster agent group

In the VM agent group instructions, agents must be grouped by upgrade plan and location; agents in a group inherit its version profile, schedule, serial or parallel order and halt or skip failure behavior, and on-premises agents need an admin-supplied region, VPC and Subnet IDs. [zms.agent-groups:grouping-basis]

**Agent Groups page.** The Agent Groups page lists Name, Admin Status, Policy Status (when enabled the group can be used in policy configuration), Type (VM or Kubernetes Cluster), agent Count, Platform (cloud or on-premises) and Upgrade Status. [zms.agent-groups:list-columns] Depending on an agent group's Upgrade Status, the admin can halt an upgrade in progress, start an on-demand upgrade or view details of a failed upgrade. [zms.agent-groups:upgrade-status-actions]

**General settings.** A VM agent group's Cloud is AWS, Azure, GCP or On Premises; Azure requires the VNET ID and Subnet ID, and On Premises requires the VPC ID, Subnet ID and Region. [zms.agent-groups:vm-cloud-fields] A VM or Kubernetes Cluster agent group description is optional and limited to 2,500 characters. [zms.agent-groups:description-limit] In the VM agent group wizard, the Policy Status and Tamper Protection settings are enabled for an organization by contacting Zscaler Support. [zms.agent-groups:org-enablement] The Kubernetes platform of a Kubernetes Cluster agent group is optional (EKS, GKE or AKS), and AKS requires the VNET ID and Subnet ID. [zms.agent-groups:k8s-platform-field]

**Status.** If an agent group's Admin Status is disabled, its agents receive configuration updates from the backend but send no logs, and policies are not enforced. [zms.agent-groups:admin-status-disabled] Changing an agent group's Admin Status prompts whether to change the Admin Status of all agents in that group too. [zms.agent-groups:admin-status-propagation]

**Deleting a group.** Deleting an agent group requires entering CONFIRM in the Agent Group window; the Delete icon is used for Kubernetes Cluster type groups and the More icon menu for VM type groups. [zms.agent-groups:delete-confirm]

**Age out.** For a VM agent group, Agent Age Out removes inactive agents after a time set in days, hours or minutes; Zscaler recommends at least 30 days and prompts for confirmation below that. [zms.agent-groups:vm-age-out] For a Kubernetes Cluster agent group, Zscaler recommends an age out time of at least 7 days and prompts for confirmation below that. [zms.agent-groups:k8s-age-out]

**Upgrades.** Agent group version profiles are Default (one or two versions older than the Latest release), Latest (the most recent release) and Custom (chosen from the historical list, which includes Latest); Default is preselected when creating a VM group. [zms.agent-groups:version-profiles] In the VM agent group wizard, the upgrade schedule takes a day of the week, time zone, start time and upgrade window; with an 8:00 AM start and a 12-hour window the last required agent upgrade starts no later than 8:00 PM. [zms.agent-groups:upgrade-window] In the VM agent group wizard, Serial upgrades agents one at a time; Parallel upgrades them in batches whose size is calculated automatically from the group's agent count, so a small group's first batch may include all agents. [zms.agent-groups:update-sequence] In the VM agent group wizard, on upgrade failure, Halt next agent upgrade with Serial pauses immediately and marks the group Failed; with Parallel the current batch finishes, the next batch is not started and the group is marked Failed; Skip to next agent continues and marks the group Incomplete. [zms.agent-groups:failure-behavior] Upgrade Now manually upgrades the whole group, lets the admin change update sequence and failure strategy, and leaves the schedule running afterwards; Upgrade Now and Reset Upgrade Status are available for VM agent groups, not Kubernetes Cluster agent groups. [zms.agent-groups:upgrade-now]

**Open questions.** The parallel batch size is not given [gap:zms.agent-groups:parallel-batch-size].

**Related.** Agents are in [How Microsegmentation agents are installed, edited, deleted and protected against tampering](kb:zms.agents) and the keys created with a group in [Microsegmentation agent provisioning keys (nonces): portal, fields and API](kb:zms.provisioning-keys).

What to check:
1. Whether the group's Admin Status is disabled before looking for missing logs or unenforced policy.
2. Whether the group is a VM or Kubernetes Cluster group before relying on Upgrade Now or Reset Upgrade Status.

Not known (open gaps):
- How the parallel upgrade batch size is calculated [gap:zms.agent-groups:parallel-batch-size]: settled by source-read

Area: zms.agent-groups, its subjects in references/_meta/spine/zms/zms.agent-groups.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zms/zms.agents.md (How Microsegmentation agents are installed, edited, deleted and protected against tampering)
- links-to references/_meta/text/zms/zms.provisioning-keys.md (Microsegmentation agent provisioning keys (nonces): portal, fields and API)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zms/zms.overview.md (Zscaler Microsegmentation (ZMS): agents, local enforcement, region and provisioning)
- see-also references/_meta/text/zms/zms.resources.md (What Microsegmentation resources, Kubernetes cluster resources and resource groups are, including ML recommendations)
