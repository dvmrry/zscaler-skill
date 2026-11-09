# How Microsegmentation flow-based policy recommendations are generated, organized and accepted (zms.policy-recommendations)
Also called: zms policy recommendations; review policy recommendations resource groups; port conflict policy conflict; zms accept recommendation

Policy recommendations for resource groups are based on historical network flows, specifically flows observed within the past 14 days. [zms.policy-recommendations:basis-14d]

**Reviewing.** Recommendations are organized by managed and unmanaged flows, filterable by inbound or outbound direction. [zms.policy-recommendations:organization] A recommendation can have a port conflict (port not mapped to an Application Catalog application) and a policy conflict (source and destination resource groups already used in an existing policy); both must be resolved before it can be accepted. [zms.policy-recommendations:conflict-types] A port conflict is resolved by choosing an Application Catalog application or adding the port as a manual port; a policy conflict is resolved by creating a new policy or merging into the existing one. [zms.policy-recommendations:conflict-resolution] The Accept toggle is enabled when a recommendation has no conflicts, and such a recommendation can be accepted as is. [zms.policy-recommendations:accept-toggle]

**Where they are listed.** Both articles give the same route to a resource group's recommendations: from Zero Trust Cloud > Dashboard > Microsegmentation Application Map, select a resource group and click Review Recommended Policies in its drawer, which opens the policy recommendations page for the resource group. [zms.policy-recommendations:listing-path]

**Related.** Policies are in [How Microsegmentation resource policies, perimeter policies and policy settings work](kb:zms.policies) and the Application Map entry point in [What the Microsegmentation Flow, Agent and Overview dashboards and the Application Map show](kb:zms.dashboards). What monthly or quarterly flows do to a recommendation is open in [Zscaler Microsegmentation (ZMS): agents, local enforcement, region and provisioning](kb:zms.overview).

What to check:
1. Whether the recommendation shows a port conflict or a policy conflict before expecting to accept it.
2. The route from the Application Map resource group drawer to the recommendations page.

Area: zms.policy-recommendations, its subjects in references/_meta/spine/zms/zms.policy-recommendations.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zms/zms.dashboards.md (What the Microsegmentation Flow, Agent and Overview dashboards and the Application Map show)
- links-to references/_meta/text/zms/zms.overview.md (Zscaler Microsegmentation (ZMS): agents, local enforcement, region and provisioning)
- links-to references/_meta/text/zms/zms.policies.md (How Microsegmentation resource policies, perimeter policies and policy settings work)
