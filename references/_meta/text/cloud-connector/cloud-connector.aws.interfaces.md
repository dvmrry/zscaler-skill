# Cloud Connector on AWS: network interfaces, device indexes, source/destination check (cloud-connector.aws.interfaces)
Also called: cloud connector eni; cloud connector service interface device index; cloud connector management interface aws; source dest check cloud connector; cloud connector how many network interfaces; ZS6.1.25.0 device index; cc next hop forwarding interface

Each Cloud Connector instance has a management interface and one or more service interfaces; workload routes and load-balancer targets point at the service side.

**How many.** Small VMs deploy with two network interfaces, Medium VMs with 5, and Large VMs with 6. [cloud-connector.aws.interfaces:interface-count] The reference CCVM module creates interfaces at device indexes 0 and 1 for every Cloud Connector whatever `cc_instance_size` is, indexes 2, 3 and 4 when `cc_instance_size` is not small, and index 5 only when it is large; all of these counts are also gated by `local.valid_cc_create`. [cloud-connector.aws.interfaces:module-size-gating]

**Which index is which.** For non-autoscaling deployments made before AMI version ZS6.1.25.0 the service interface is device index 1; Cloud Connector AMIs released after October 19, 2023 have the service interface at device index 0. [cloud-connector.aws.interfaces:device-index-history] The version-identification page says that in version ZS6.1.24.6 device index 0 is the management interface and index 1 the service interface, and in version ZS6.1.26.0 index 0 is the service interface and index 1 the management interface. [cloud-connector.aws.interfaces:version-index-swap] The date the swap starts is given two ways [divergence:cloud-connector.aws.interfaces:index-swap-boundary]. In the CCVM module, device index 0 is the "cc next hop forwarding interface" in the service subnet with the service security group, and its primary IP is the address used for the GWLB target group. [cloud-connector.aws.interfaces:module-index-0] In the CCVM module, device index 1 is the "cc management interface" in the management subnet, carrying the management security group plus any additional management groups. [cloud-connector.aws.interfaces:module-index-1] The autoscaling module's launch template defines two interfaces, the forwarding interface at device index 0 and the management interface at index 1, both without a public IP. [cloud-connector.aws.interfaces:asg-launch-template] Which interface carries the load-balancer role on the deprecated medium and large sizes is ambiguous in the module [gap:cloud-connector.aws.interfaces:lb-interface-role].

**Forwarding requires the check off.** Help says source/destination checks must be disabled to avoid connectivity disruptions and unreachable destinations. [cloud-connector.aws.interfaces:source-dest-check] The CCVM module sets `source_dest_check` to false on every service interface (indexes 0, 2, 3, 4 and 5) and to true on the management interface. [cloud-connector.aws.interfaces:module-source-dest]

**Subnets.** Help says Cloud Connector appliances have a dedicated management interface installed, by default, in the same subnet as the service interface. [cloud-connector.aws.interfaces:mgmt-same-subnet] Routing workload traffic to the service interface is in [Cloud Connector on AWS: steering workload traffic by route table, ENI or GWLB endpoint](kb:cloud-connector.aws.traffic-steering).

**CloudFormation templates.** In the CloudFormation templates the service interface is device index 0 and the management interface is device index 1, and the changelog dates this swap to version 1.0.0 for Cloud Connector AMIs after ZS6.1.25.0. [cloud-connector.aws.interfaces:cfn-interface-order] The Starter template sets source/destination check false on the forwarding service interface and true on the management interface. [cloud-connector.aws.interfaces:cfn-source-dest] The template's CreateCCMediumServiceXfaces condition holds for the medium and large sizes and CreateCCLargeServiceXfaces gates the interface at device index 5; the interface descriptions name index 4 as the internal LB VIP interface on medium and index 5 on large. [cloud-connector.aws.interfaces:cfn-size-interfaces]

What to check:
1. Which device index is the service interface on this instance: index 0 on AMIs from the swap, index 1 on older non-autoscaling deployments, and which AMI version the instance runs, since the pages place the swap boundary differently around October 19, 2023.
2. Whether source/destination check is disabled on the service interfaces.
3. Whether the instance has the interface count its size requires.

Sources disagree (name both sides):
- The troubleshooting page says AMIs released after October 19, 2023 have the service interface at device index 0, while the version table dates ZS6.1.26.0, whose service interface is index 0, to October 19, 2023 itself. [divergence:cloud-connector.aws.interfaces:index-swap-boundary]
  - zscaler-help: AMIs released after October 19, 2023 have the service interface as device index 0, so an AMI released on that date falls before the boundary.
  - zscaler-help: ZS6.1.26.0, dated October 19, 2023 in the version table, has the service interface as device index 0.
  Impact: An instance launched from the October 19, 2023 AMI (ZS6.1.26.0) has the service interface at index 0 on the version page's reading but is not covered by the troubleshooting page's "after October 19, 2023" wording; identify the AMI version rather than relying on the date.

Not known (open gaps):
- Which interface is the load-balancer interface on medium and large Cloud Connectors [gap:cloud-connector.aws.interfaces:lb-interface-role]: settled by source-read or lab-test. Blocks: troubleshooting load-balancer reachability on a medium or large instance

Area: cloud-connector.aws, its subjects in references/_meta/spine/cloud-connector/cloud-connector.aws.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/cloud-connector/cloud-connector.aws.traffic-steering.md (Cloud Connector on AWS: steering workload traffic by route table, ENI or GWLB endpoint): An ENI route sends the subnet's traffic to one Cloud Connector instance, so without a failover mechanism such as the deprecated Lambda, losing that instance leaves the route pointing at nothing that forwards. [cloud-connector.aws.traffic-steering:eni-single-target]
- depends-on references/_meta/text/cloud-connector/cloud-connector.api.provisioning-wire.md (Cloud Connector provisioning URLs on the wire: what the template sets, VM size and cloud provider fields), from cloud-connector.aws: The cloud provisioning URL is a prerequisite for deploying Cloud Connector as a VM in AWS, Azure and GCP, and is obtained by configuring a provisioning template; the same URL can be used multiple times. [cloud-connector.api.provisioning-wire:url-prerequisite]
- depends-on references/_meta/text/cloud-connector/cloud-connector.aws.instance-sizing.md (Cloud Connector on AWS: VM size, EC2 instance type, and matching the provisioning template): The AWS deployment guide lists Small VMs on m5n.large, c5a.large, m6i.large (recommended), c6i.large, m7i.large or m7i-flex.large, and Medium and Large VMs, both deprecated, on m5n.4xlarge, m6i.4xlarge (recommended) or c6i.4xlarge. [cloud-connector.aws.instance-sizing:vm-sizes]

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/cloud-connector/cloud-connector.aws.cloudformation.md (Cloud Connector on AWS: CloudFormation templates, order, and parameter defaults)
- configured-via references/_meta/text/cloud-connector/cloud-connector.aws.reference-modules.md (Zscaler's Terraform modules for Cloud Connector on AWS: examples, defaults, FIPS, Transit Gateway)
- see-also references/_meta/text/cloud-connector/cloud-connector.aws.md (Cloud Connector on AWS: what is deployed and where each question is answered)
- see-also references/_meta/text/cloud-connector/cloud-connector.aws.gwlb.md (Cloud Connector behind AWS Gateway Load Balancer: target group, health probe, stickiness, cross-zone)
