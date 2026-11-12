# Registering a VPC with a GCP Zero Trust Gateway: NSI in-band endpoint group, security profile group and firewall policy (cloud-connector.gcp-ztg.vpc-registration)
Also called: register vpc gcp zero trust gateway; nsi in-band intercept endpoint group; intercept deployment group zscaler; security profile group zscaler gcp; gcp ztg firewall policy intercept

Traffic from a Google Cloud VPC is routed through the Zscaler GCP Zero Trust Gateway using Network Security Integration (NSI) in-band integration configured in the GCP console, for an existing VPC network, since NSI does not create a VPC network. [cloud-connector.gcp-ztg.vpc-registration:nsi-in-band] This is the GCP-console side of the setup; the Admin Console side is in [Creating a GCP Zero Trust Gateway: region, zones, location, IAM principals](kb:cloud-connector.gcp-ztg.creation).

**Before starting.** Prerequisites include the consumer project details (such as where the endpoint group is deployed), the ingress source and egress destination CIDR ranges to inspect, the Security Profile Admin role for security profiles and groups (organization-level roles when organization scope is used), the Compute Engine and Network Security APIs enabled, and, optionally, trusted source ranges that bypass inspection. [cloud-connector.gcp-ztg.vpc-registration:prerequisites] Zscaler provides the intercept deployment group, and any location guidance (NSI consumer resources use global) and recommended traffic match ranges. [cloud-connector.gcp-ztg.vpc-registration:zscaler-provides]

**Resources, in order.** Step 1 creates an intercept endpoint group with purpose NSI In-Band and type Intercept (the default); the deployment group can be entered manually as a project ID and name when it is in a different project, which the page describes as the most common case for a Zscaler producer project, and the VPC network to protect is selected. [cloud-connector.gcp-ztg.vpc-registration:endpoint-group] The security profile's traffic is directed to the deployment group selected in Step 1, and the firewall rules reference the security profile group, not the profile directly. [cloud-connector.gcp-ztg.vpc-registration:profile-and-group] The firewall policy has Global deployment scope and VPC policy type, an allow rule for trusted sources to bypass inspection at priority 90 (lower priority numbers are evaluated first), an ingress intercept rule at priority 100 and an egress intercept rule at priority 101, and is associated with the consumer VPC. [cloud-connector.gcp-ztg.vpc-registration:firewall-policy]

**Verifying.** Among the verification checks, on the Endpoint groups page the group's Status is Active and its Associations column lists the VPC association, and generated traffic matching the ranges appears in the Zscaler inspection logs. [cloud-connector.gcp-ztg.vpc-registration:verify]

**Troubleshooting table.** The troubleshooting table says that a deployment group that cannot be selected is in the wrong project or the Zscaler producer project (enter the Zscaler project ID and name manually), that Permission denied on the security profile means the Network Security IAM is missing at the chosen scope, that uninspected traffic means wrong match ranges or an allow rule shadowing the intercept rule, and that a rule not offering the profile group means the group is not created yet or has the wrong purpose. [cloud-connector.gcp-ztg.vpc-registration:troubleshooting]

What to check:
1. Whether the intercept endpoint group is Active with the VPC association listed, and matching traffic appears in the Zscaler inspection logs.
2. Whether the allow rule for trusted sources (priority 90) sits ahead of the ingress (100) and egress (101) intercept rules and shadows traffic meant to be inspected.
3. Whether the deployment group was entered manually from the Zscaler producer project and the Network Security IAM exists at the chosen scope.

Not known (open gaps):
- The traffic direction set on the egress intercept rule [gap:cloud-connector.gcp-ztg.vpc-registration:egress-direction-value]: settled by source-read. Blocks: reproducing the egress intercept rule from the page alone

Area: cloud-connector.gcp-ztg, its subjects in references/_meta/spine/cloud-connector/cloud-connector.gcp-ztg.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.gcp-ztg.creation.md (Creating a GCP Zero Trust Gateway: region, zones, location, IAM principals)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.gcp-ztg.md (GCP Zero Trust Gateway: managed service boundary and restrictions)
- see-also references/_meta/text/cloud-connector/cloud-connector.gcp-ztg.operations.md (Operating a GCP Zero Trust Gateway: health states, configuration rejection, traffic tests)
