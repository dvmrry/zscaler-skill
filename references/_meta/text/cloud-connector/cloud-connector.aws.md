# Cloud Connector on AWS: what is deployed and where each question is answered (cloud-connector.aws)
Also called: cloud connector aws; cloud connector ec2; deploy cloud connector on aws; cloud connector ami; cloud connector aws marketplace; asg and non-asg in same vpc; cloud connector cloudformation or terraform

Cloud Connector makes cloud workloads follow organizational security policy for public and private destinations by forwarding their traffic to ZIA and ZPA, and is available as a virtual appliance in AWS and Azure. [cloud-connector.aws:purpose] On AWS, Cloud Connector is deployed as an Amazon Machine Image and requires a subscription to Zscaler Cloud Connector in the commercial or China AWS Marketplace. [cloud-connector.aws:ami-marketplace] Zscaler's Terraform module defaults describe a reference implementation, not product requirements, unless a Help claim says the same.

**Two IaC paths.** AWS deployment templates are available as CloudFormation and as Terraform, and Azure and GCP deployment templates as Terraform; the AWS Terraform templates deploy into a new or existing VPC. [cloud-connector.aws:iac-paths] Each deployment type needs its own template family, [Deploy an autoscaling group only with an autoscaling (ASG) template, and a non-autoscaling deployment only with a non-ASG template.](kb:cloud-connector.overview.groups:template-match). On AWS, autoscaling and non-autoscaling Cloud Connector deployments must not run in the same VPC. [cloud-connector.aws:template-family-rule] CloudFormation is covered in [Cloud Connector on AWS: CloudFormation templates, order, and parameter defaults](kb:cloud-connector.aws.cloudformation) and the Terraform modules in [Zscaler's Terraform modules for Cloud Connector on AWS: examples, defaults, FIPS, Transit Gateway](kb:cloud-connector.aws.reference-modules).

**Where each question is answered.**
- **Size and instance type.** [Cloud Connector on AWS: VM size, EC2 instance type, and matching the provisioning template](kb:cloud-connector.aws.instance-sizing)
- **Network interfaces.** [Cloud Connector on AWS: network interfaces, device indexes, source/destination check](kb:cloud-connector.aws.interfaces)
- **Registration and user data.** [Cloud Connector on AWS: provisioning template, URL, Secrets Manager credentials, user data](kb:cloud-connector.aws.provisioning)
- **Getting workload traffic to it.** [Cloud Connector on AWS: steering workload traffic by route table, ENI or GWLB endpoint](kb:cloud-connector.aws.traffic-steering), with GWLB settings in [Cloud Connector behind AWS Gateway Load Balancer: target group, health probe, stickiness, cross-zone](kb:cloud-connector.aws.gwlb)
- **Autoscaling.** [Cloud Connector Auto Scaling groups on AWS: scaling metric, policy, capacity limits](kb:cloud-connector.aws.autoscaling), [Cloud Connector autoscaling health: custom health metric, the Zscaler Lambda, grace period](kb:cloud-connector.aws.autoscaling.health), [Cloud Connector autoscaling lifecycle: launch and terminate hooks, warm pools](kb:cloud-connector.aws.autoscaling.lifecycle)
- **Firewall and IAM.** [Cloud Connector on AWS: firewall requirements and the reference security groups](kb:cloud-connector.aws.security-groups), [Cloud Connector on AWS: IAM for the instance, the autoscaling Lambda, and the deployer](kb:cloud-connector.aws.iam)
- **Failures.** [Troubleshooting Cloud Connector on AWS: not registering, inactive, no tunnel, no Private Access](kb:cloud-connector.aws.troubleshooting)

**Elsewhere.** Workload discovery and sublocation scopes are in [AWS workload discovery for Cloud Connector: what it is and how the pieces fit](kb:cloud-connector.workload-discovery); group-level HA, tunnel failover and upgrade windows in [Cloud & Branch Connector: what Cloud Connector is and where each area is described](kb:cloud-connector.overview); the Zscaler-managed AWS and GCP gateways are a different product path, see [GCP Zero Trust Gateway: managed service boundary and restrictions](kb:cloud-connector.gcp-ztg).

What to check:
1. Whether the VPC mixes an autoscaling deployment with a non-autoscaling one, which the guide forbids.
2. Whether the account is subscribed to Zscaler Cloud Connector in the AWS Marketplace.

Area: cloud-connector.aws, its subjects in references/_meta/spine/cloud-connector/cloud-connector.aws.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/cloud-connector/cloud-connector.aws.traffic-steering.md (Cloud Connector on AWS: steering workload traffic by route table, ENI or GWLB endpoint): The workload route is a 0.0.0.0/0 destination whose target is, for non-GWLB deployments, the network interface of the Cloud Connector service interface and, for GWLB deployments, the Gateway Load Balancer endpoint. [cloud-connector.aws.traffic-steering:route-targets]
- depends-on references/_meta/text/cloud-connector/cloud-connector.api.provisioning-wire.md (Cloud Connector provisioning URLs on the wire: what the template sets, VM size and cloud provider fields): The cloud provisioning URL is a prerequisite for deploying Cloud Connector as a VM in AWS, Azure and GCP, and is obtained by configuring a provisioning template; the same URL can be used multiple times. [cloud-connector.api.provisioning-wire:url-prerequisite]
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.autoscaling.md (Cloud Connector Auto Scaling groups on AWS: scaling metric, policy, capacity limits)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.autoscaling.health.md (Cloud Connector autoscaling health: custom health metric, the Zscaler Lambda, grace period)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.autoscaling.lifecycle.md (Cloud Connector autoscaling lifecycle: launch and terminate hooks, warm pools)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.cloudformation.md (Cloud Connector on AWS: CloudFormation templates, order, and parameter defaults)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.gwlb.md (Cloud Connector behind AWS Gateway Load Balancer: target group, health probe, stickiness, cross-zone)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.iam.md (Cloud Connector on AWS: IAM for the instance, the autoscaling Lambda, and the deployer)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.instance-sizing.md (Cloud Connector on AWS: VM size, EC2 instance type, and matching the provisioning template)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.interfaces.md (Cloud Connector on AWS: network interfaces, device indexes, source/destination check)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.provisioning.md (Cloud Connector on AWS: provisioning template, URL, Secrets Manager credentials, user data)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.reference-modules.md (Zscaler's Terraform modules for Cloud Connector on AWS: examples, defaults, FIPS, Transit Gateway)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.security-groups.md (Cloud Connector on AWS: firewall requirements and the reference security groups)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.troubleshooting.md (Troubleshooting Cloud Connector on AWS: not registering, inactive, no tunnel, no Private Access)
- links-to references/_meta/text/cloud-connector/cloud-connector.gcp-ztg.md (GCP Zero Trust Gateway: managed service boundary and restrictions)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.md (Cloud & Branch Connector: what Cloud Connector is and where each area is described)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.groups.md (Cloud Connector groups: what they are for, autoscaling names, status and disabling)
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.md (AWS workload discovery for Cloud Connector: what it is and how the pieces fit)
