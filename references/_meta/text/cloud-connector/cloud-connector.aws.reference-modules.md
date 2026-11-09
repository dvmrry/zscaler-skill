# Zscaler's Terraform modules for Cloud Connector on AWS: examples, defaults, FIPS, Transit Gateway (cloud-connector.aws.reference-modules)
Also called: terraform-aws-cloud-connector-modules; cloud connector terraform examples aws; base_cc_gwlb; cc_gwlb_asg; zsec cloud connector; cloud connector fips aws terraform; cloud connector transit gateway terraform; tgw_enabled

The repository is Zscaler's reference IaC for AWS: submodules per resource group and complete examples that call them. It does not configure the Zscaler side; the provider is covered by [ZTC Terraform provider: configuration, field handling and read behavior](kb:cloud-connector.terraform.provider-behavior).

**Scope.** The AWS Terraform repository creates the resources to deploy and operate Cloud Connector in a new or existing VPC, and its examples directory holds complete automation for greenfield/POV and brownfield/production use. [cloud-connector.aws.reference-modules:repo-scope] The greenfield templates include a bastion host and test workloads and are designed for greenfield/POV testing. [cloud-connector.aws.reference-modules:greenfield] The brownfield templates are the ones most applicable to production, have more customization options, and deploy no bastion or workload hosts. [cloud-connector.aws.reference-modules:brownfield] Help and the README disagree on whether Terraform deployments include a bastion [divergence:cloud-connector.aws.reference-modules:bastion-scope].

**Examples.**
- The base example creates the network infrastructure (a VPC, public and workload subnets, an internet gateway and a NAT gateway), one workload server and a bastion host, but no Cloud Connector appliances. [cloud-connector.aws.reference-modules:ex-base]
- base_1cc adds one Cloud Connector private subnet and one Cloud Connector VM routing to the NAT gateway, and repoints the workload subnet route to the Cloud Connector's service ENI. [cloud-connector.aws.reference-modules:ex-1cc]
- The _zpa examples (base_1cc_zpa, base_2cc_zpa, base_cc_gwlb_zpa, base_cc_gwlb_asg_zpa) add two Route 53 subnets routing to the Cloud Connector service ENI, a Route 53 outbound resolver endpoint and resolver rules for ZPA DNS redirection. [cloud-connector.aws.reference-modules:ex-zpa]
- base_cc_gwlb creates 4 Cloud Connectors (2 per subnet and AZ), a GWLB that auto-registers their service IPs with health checks, a VPC endpoint service, one GWLB endpoint per Cloud Connector subnet, and workload routes to the GWLB endpoint in the same AZ. [cloud-connector.aws.reference-modules:ex-gwlb]
- base_cc_gwlb_asg deploys the Cloud Connectors as an Auto Scaling group with a launch template spanning all Cloud Connector subnets, behind a GWLB with an instance-based target group. [cloud-connector.aws.reference-modules:ex-gwlb-asg]
- cc_gwlb (4 Cloud Connector VMs by default, 2 per subnet and AZ) and cc_gwlb_asg (an Auto Scaling group) are the brownfield/production examples, able to reuse an existing VPC, subnets, IGW and NAT gateways and to toggle ZPA/Route 53 resources. [cloud-connector.aws.reference-modules:ex-brownfield]
- base_2cc, base_2cc_zpa and cc_ha are marked deprecated; each README says it is only available as reference for legacy users and that Zscaler's recommended deployment method is GWLB. base_2cc and base_2cc_zpa add a second Cloud Connector with a Lambda that fails workload route tables over between the two, and cc_ha can toggle Lambda HA failover. [cloud-connector.aws.reference-modules:ex-deprecated]

**Network defaults.** The network module defaults `vpc_cidr` to 10.1.0.0/16 and derives all subnets from it, and defaults `az_count` to 2 with validation limiting it to 1 through 3. [cloud-connector.aws.reference-modules:network-defaults]

**Transit Gateway.** Release 1.5.0 added Transit Gateway hub-and-spoke inspection to base_cc_gwlb and cc_gwlb: `tgw_enabled` (default false) deploys a hub VPC with the Cloud Connectors and GWLB and two spoke VPCs whose traffic the Transit Gateway forwards to the hub. [cloud-connector.aws.reference-modules:tgw-mode] The Transit Gateway module enables appliance mode on the hub attachment because, per its README, without it TGW may return traffic through a different AZ, breaking GWLB flow stickiness and letting traffic bypass Cloud Connector inspection. [cloud-connector.aws.reference-modules:tgw-appliance-mode]

**FIPS.** Release 1.5.1 added a `fips_enabled` variable to the Cloud Connector examples that enables FIPS mode through user data; it takes the strings "False" (default) or "True" and is written as FIPS_ENABLED. [cloud-connector.aws.reference-modules:fips-variable] The zsec helper asks whether to enable FIPS mode and exports `TF_VAR_fips_enabled` as 'True' or 'False'. [cloud-connector.aws.reference-modules:fips-zsec] FIPS is an example-level input: every Cloud Connector example declares `fips_enabled` while the base example (no Cloud Connector) and the CCVM and ASG modules do not, so a caller of the modules directly must put FIPS_ENABLED in its own user data. [cloud-connector.aws.reference-modules:fips-examples-only]

**The zsec helper.** zsec accepts 1 to 20 for the static Cloud Connector count and 1 to 10 for the Auto Scaling group minimum and maximum. [cloud-connector.aws.reference-modules:zsec-counts] Autoscaling size limits differ between the module, the examples and zsec: [Cloud Connector Auto Scaling groups on AWS: scaling metric, policy, capacity limits](kb:cloud-connector.aws.autoscaling).

What to check:
1. Which example the deployment came from, since greenfield examples add a bastion and test workloads and the deprecated ones use Lambda route failover instead of GWLB.
2. For a Transit Gateway hub-and-spoke deployment, whether the hub attachment has appliance mode enabled.
3. For FIPS, whether the user data carries FIPS_ENABLED=True, since a direct module caller must set it in its own user data.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.aws.reference-modules:fips-examples-only] Tier B: Rests on a search of every examples/*/variables.tf and modules/*/variables.tf at the pin for variable "fips_enabled": present in base_1cc, base_1cc_zpa, base_2cc, base_2cc_zpa, base_cc_gwlb, base_cc_gwlb_asg, base_cc_gwlb_asg_zpa, base_cc_gwlb_zpa, cc_gwlb, cc_gwlb_asg and cc_ha; absent from base and from every module.

Sources disagree (name both sides):
- Whether a Terraform deployment of Cloud Connector includes a bastion host. [divergence:cloud-connector.aws.reference-modules:bastion-scope]
  - zscaler-help: When Terraform configures new appliances, a bastion host is created automatically for management and troubleshooting.
  - tfmod-aws-cloud-connector: Only the greenfield templates include a bastion; the brownfield templates do not deploy a bastion or workload hosts.
  Impact: Troubleshooting guidance that assumes a Terraform bastion for CLI access fails for brownfield deployments; use SSM or a management-interface elastic IP instead.

Area: cloud-connector.aws, its subjects in references/_meta/spine/cloud-connector/cloud-connector.aws.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/cloud-connector/cloud-connector.api.provisioning-wire.md (Cloud Connector provisioning URLs on the wire: what the template sets, VM size and cloud provider fields), from cloud-connector.aws: The cloud provisioning URL is a prerequisite for deploying Cloud Connector as a VM in AWS, Azure and GCP, and is obtained by configuring a provisioning template; the same URL can be used multiple times. [cloud-connector.api.provisioning-wire:url-prerequisite]
- reached-via references/_meta/text/cloud-connector/cloud-connector.aws.traffic-steering.md (Cloud Connector on AWS: steering workload traffic by route table, ENI or GWLB endpoint), from cloud-connector.aws: The workload route is a 0.0.0.0/0 destination whose target is, for non-GWLB deployments, the network interface of the Cloud Connector service interface and, for GWLB deployments, the Gateway Load Balancer endpoint. [cloud-connector.aws.traffic-steering:route-targets]
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.autoscaling.md (Cloud Connector Auto Scaling groups on AWS: scaling metric, policy, capacity limits)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.provider-behavior.md (ZTC Terraform provider: configuration, field handling and read behavior)
