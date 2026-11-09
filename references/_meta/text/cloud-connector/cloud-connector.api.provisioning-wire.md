# Cloud Connector provisioning URLs on the wire: what the template sets, VM size and cloud provider fields (cloud-connector.api.provisioning-wire)
Also called: ztw provUrl; provisioning url api; cloud provisioning template api; ztc_provisioning_url; cloud connector vm size api; formFactor; cloud provisioning template; cloud connector provisioning template

A cloud provisioning URL carries what a new Cloud Connector VM needs to enroll: the cloud provider, location and group settings, and the VM size. The provisioning URL paths and SDK methods are generated; this subject maps the console template to the API fields.

## What the template is

The cloud provisioning URL is a prerequisite for deploying Cloud Connector as a VM in AWS, Azure and GCP, and is obtained by configuring a provisioning template; the same URL can be used multiple times. [cloud-connector.api.provisioning-wire:url-prerequisite] Cloud Connector VMs deployed in a single VPC must use the same provisioning URL. [cloud-connector.api.provisioning-wire:same-url-per-vpc] The autoscaling and non-autoscaling templates must match the deployment, [Deploy an autoscaling group only with an autoscaling (ASG) template, and a non-autoscaling deployment only with a non-ASG template.](kb:cloud-connector.overview.groups:template-match), and autoscaling is enabled only through Zscaler Support, [The provisioning template's Auto Scaling setting covers AWS Auto Scaling, Azure VMSS and GCP MIG autoscaling, and enabling any of them requires contacting Zscaler Support.](kb:cloud-connector.azure.vmss:support-gated).

## VM size

In the template's group settings the VM size depends on the cloud: AWS offers Small, Medium or Large, with Small set by default when autoscaling is enabled; Azure and GCP are set to Small by default. [cloud-connector.api.provisioning-wire:template-vm-size] The contract's provisioning URL content (`provUrlData`) has a `formFactor` field with the values `SMALL`, `MEDIUM` and `LARGE`. [cloud-connector.api.provisioning-wire:contract-form-factor] The Go SDK's provisioning URL data model (`ProvUrlData`) carries `FormFactor` as a string, and the ZTC provider's `form_factor` accepts `SMALL`, `MEDIUM` or `LARGE`. [cloud-connector.api.provisioning-wire:clients-form-factor] So the console's VM Size is carried in the API as the provisioning URL's `formFactor`, not in a field named for VM size. [cloud-connector.api.provisioning-wire:vm-size-is-form-factor] How the size pairs with an EC2 instance type is in [Cloud Connector on AWS: VM size, EC2 instance type, and matching the provisioning template](kb:cloud-connector.aws.instance-sizing).

## Cloud provider

The contract's cloud provider list omits GCP, which the console template and the Terraform provider offer [divergence:cloud-connector.api.provisioning-wire:cloud-provider-type].

## Clients

The Python SDK added create, read, update and delete functions for the ZTW provisioning URL in release 1.9.13 (PR #450). [cloud-connector.api.provisioning-wire:python-crud-1-9-13] The Go provisioning URL functions use the generic (ZIA-routed) client methods, which fail in the provider's legacy mode: [The ZTC provider's legacy mode builds only a ZTW legacy client, so the generic ZIA-routed calls above find no ZIA legacy client and return the SDK's "legacy client not set" error. In that mode the activation status read (resource and data source) and the provisioning URL create, update, and delete fail while the other ZTC resources, which use the `...Resource` methods, work (except ZPA-resource lookups, which also go through the generic path).](kb:cloud-connector.sdk-go.service-defects:legacy-ztw-only-client-fails-generic-calls).

What to check:
1. Whether the provisioning URL a deployment uses carries the VM size (form factor) the deployment expects, since the size is set in the template, not in the cloud template alone.
2. For a GCP provisioning URL written through the raw API, whether the API accepts a cloud provider value the contract does not list.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.api.provisioning-wire:vm-size-is-form-factor] Tier B: The legacy API reference describes a VM's formFactor as its size; that the console's VM Size label is this field rests on the matching names and that description, not on a source naming the console label.

Sources disagree (name both sides):
- Whether a provisioning URL's cloud provider can be GCP. [divergence:cloud-connector.api.provisioning-wire:cloud-provider-type]
  - api-specs: The contract's `cloudProviderType` lists only `AWS` and `AZURE`.
  - tf-ztc: The ZTC provider's `cloud_provider_type` accepts `AWS`, `AZURE` and `GCP`.
  - zscaler-help: The console template offers Amazon Web Services, Azure or Google Cloud as the cloud provider.
  Impact: The contract's enum looks out of date for GCP; GCP provisioning URLs exist in the console and the provider. Code that validates against the contract enum would reject a GCP template.

Area: cloud-connector.api, its subjects in references/_meta/spine/cloud-connector/cloud-connector.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.instance-sizing.md (Cloud Connector on AWS: VM size, EC2 instance type, and matching the provisioning template)
- links-to references/_meta/text/cloud-connector/cloud-connector.azure.vmss.md (Cloud Connector on Azure: VMSS autoscaling, health monitoring and resource sync)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.groups.md (Cloud Connector groups: what they are for, autoscaling names, status and disabling)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.service-defects.md (Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects)
