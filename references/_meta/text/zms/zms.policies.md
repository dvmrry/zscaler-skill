# How Microsegmentation resource policies, perimeter policies and policy settings work (zms.policies)
Also called: zms policy rules; microsegmentation perimeter policy; default resource policy rule; zms sim block; microsegmentation policy priority

The Configuring Microsegmentation Policies article says enforcement policies are Layer 3 and Layer 4, protect east-west traffic in cloud and data center environments, and are applied between resource groups or between a resource group and any other resource. [zms.policies:policy-layers] What a policy can be applied between is stated differently by the resource group article [divergence:zms.policies:policy-endpoints].

**Policy settings.** The Policy Settings page controls policy enforcement globally; its Default Resource Policy Rule (Allow) is the catch-all for the whole organization's traffic when other policies do not apply, and settings must be confirmed before taking effect. [zms.policies:settings-global]

**Resource policies.** The Resource Policies page lists each rule's Order (which is applied first), Source, Destination, Applications, Protocol, Scope, Rule Action and Last Hit. [zms.policies:list-columns] Policies are evaluated from highest priority (lowest integer) to lowest priority (highest integer), no two policies can share a priority, and the maximum rule order depends on how many rules exist. [zms.policies:priority-order] A policy rule Action is Allow, Sim Block or Block. [zms.policies:rule-actions] A rule's Scope is the AppZones it affects; Include all AppZones is selected by default. [zms.policies:rule-scope] A rule takes up to 10 sources, up to 10 destinations, and up to 10 TCP and 10 UDP additional port ranges, or an Include-all toggle for TCP or UDP ports. [zms.policies:rule-limits] A rule's destination can use an application port template drawn from the Application Catalog, which then shows the ports associated with the application. [zms.policies:rule-app-ports] Configurations, edits and deletions of policy rules take effect immediately. [zms.policies:changes-immediate]

**Perimeter policies.** Perimeter policies define how Microsegmentation handles inbound, outbound and internal traffic for managed resource groups. [zms.policies:perimeter-purpose] A perimeter policy sets Inbound and Outbound Traffic Enforcement to Sim Block, Block or Disable and Internal Traffic Enforcement to Allow or Disable; it is ordered last by default. [zms.policies:perimeter-fields] When editing a perimeter policy the Resource Group field cannot be changed. [zms.policies:perimeter-edit-rg] Deleting a perimeter policy at Zero Trust Cloud > Microsegmentation > Perimeter Policies requires entering CONFIRM in the Delete Perimeter Policy Rule window. [zms.policies:perimeter-delete-confirm]

**Open questions.** What Sim Block does is not defined [gap:zms.policies:sim-block-meaning], and the UDP Include-all wording is unclear [gap:zms.policies:udp-include-all-wording].

**Related.** Recommendations that create policies are in [How Microsegmentation flow-based policy recommendations are generated, organized and accepted](kb:zms.policy-recommendations) and the groups they connect in [What Microsegmentation resources, Kubernetes cluster resources and resource groups are, including ML recommendations](kb:zms.resources).

What to check:
1. Whether a rule with a lower priority integer already matches the traffic.
2. Whether the Default Resource Policy Rule setting is Allow for traffic no other policy covers.

Sources disagree (name both sides):
- The resource group article says policies apply to traffic between two resource groups; the policy configuration article says they apply between resource groups or between a resource group and any other resource. [divergence:zms.policies:policy-endpoints]
  - zscaler-help: Policies are applied to traffic between two resource groups.
  - zscaler-help: Policies are applied between resource groups or between a resource group and any other resource.
  Impact: Whether a rule's source or destination can be something other than a resource group depends on which article is followed; the captures do not reconcile them.

Not known (open gaps):
- What Sim Block does as a policy action [gap:zms.policies:sim-block-meaning]: settled by source-read
- What the Include all UDP ports toggle covers [gap:zms.policies:udp-include-all-wording]: settled by source-read

Area: zms.policies, its subjects in references/_meta/spine/zms/zms.policies.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zms/zms.policy-recommendations.md (How Microsegmentation flow-based policy recommendations are generated, organized and accepted)
- links-to references/_meta/text/zms/zms.resources.md (What Microsegmentation resources, Kubernetes cluster resources and resource groups are, including ML recommendations)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zms/zms.overview.md (Zscaler Microsegmentation (ZMS): agents, local enforcement, region and provisioning)
- see-also references/_meta/text/zms/zms.portal.md (The Microsegmentation portal: Application Catalog, ML tag recommendations, tags and AppZones)
