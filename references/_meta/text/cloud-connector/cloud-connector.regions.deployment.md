# Where a customer-deployed Cloud Connector VM can be deployed (cloud-connector.regions.deployment)
Also called: cloud connector azure china; cloud connector govcloud; cloud connector azure government; cloud connector marketplace regions; cloud connector vm size; cloud connector gcp regions

Apart from the AWS AMI table, the captured help has no region list for the Cloud Connector VM; what it does say is cloud-specific. The Zero Trust Gateway tables are not a VM allowlist: [Regions where Zero Trust Gateways are supported (AWS and GCP)](kb:cloud-connector.regions.zero-trust-gateways).

**AWS.** The AWS AMI table lists the ZS42.1.0 image (March 10, 2026) in af-south-1, ap-east-1, ap-east-2, ap-northeast-1 to ap-northeast-3, ap-south-1, ap-south-2, ap-southeast-1 to ap-southeast-7, ca-central-1, ca-west-1, eu-central-1, eu-central-2, eu-north-1, eu-south-1, eu-south-2, eu-west-1 to eu-west-3, il-central-1, mx-central-1, sa-east-1, us-east-1, us-east-2, us-gov-east-1, us-gov-west-1, us-west-1 and us-west-2. [cloud-connector.regions.deployment:aws-ami-regions]

**Azure.** The Zscaler Cloud Connector Application in the Azure Marketplace is available in all regions except China; deploying from the China region requires Terraform. [cloud-connector.regions.deployment:azure-marketplace-regions] For Cloud Connector in China, Zscaler recommends a custom gateway with Zscaler China data centers and traffic forwarding policies that reference the China location and that custom gateway. [cloud-connector.regions.deployment:azure-china-gateway]

**GCP.** The GCP deployment guide deploys Cloud Connector as a VM using Terraform. [cloud-connector.regions.deployment:gcp-terraform]

**VM size.** In the cloud provisioning template, AWS offers Small, Medium or Large, with Small the default when autoscaling is enabled; for Azure and GCP the page says only that Small is set by default. [cloud-connector.regions.deployment:vm-size]

Per-region availability of the VM in AWS China and in AWS regions outside the ZS42.1.0 row, GCP, Azure Government and other sovereign clouds, and of each VM size, is not captured [gap:cloud-connector.regions.deployment:standard-cc-regions].

What to check:
1. For Azure China, whether the deployment used Terraform rather than the Marketplace application.
2. For any region outside commercial Azure, whether the cloud's marketplace lists the image, or Zscaler confirms support.

Not known (open gaps):
- Region availability of the customer-deployed Cloud Connector VM [gap:cloud-connector.regions.deployment:standard-cc-regions]: settled by source-read or support-ticket. Blocks: telling an operator whether a Cloud Connector VM can be deployed in a given region or sovereign cloud

Area: cloud-connector.regions, its subjects in references/_meta/spine/cloud-connector/cloud-connector.regions.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.regions.zero-trust-gateways.md (Regions where Zero Trust Gateways are supported (AWS and GCP))
