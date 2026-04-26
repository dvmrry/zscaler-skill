# Deploying Zscaler Cloud Connector with Microsoft Azure

**Source:** https://help.zscaler.com/cloud-branch-connector/deploying-zscaler-cloud-connector-microsoft-azure
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help
Deployment Management for Virtual Devices
Cloud Connector Deployment Management
Cloud Connector Deployment Management for Azure
Deploying Zscaler Cloud Connector with Microsoft Azure

When deploying a Cloud Connector, only deploy an autoscaling group (ASG) with an ASG template or a non-ASG with a non-ASG template. Additionally, do not run both Virtual Machine Scale Sets (VMSS) and non-VMSS deployments within the same virtual network (VNet).

This deployment guide provides information on prerequisites, how to deploy Zscaler Cloud Connector as a virtual machine (VM) in Microsoft Azure, and post-deployment configurations.

The Azure Routing Intent and Routing Policies feature for secured virtual Wide Area Network (WAN) hubs is incompatible with Cloud Connector.

This procedure describes two methods for deploying Cloud Connector:

**Zscaler Cloud Connector Application in the Azure Marketplace:** This method is available for static deployment of Cloud Connector.

The Zscaler Cloud Connector Application in the Azure Marketplace is available in all regions except China. If you are deploying Cloud Connector from the China region, you must use Terraform.

**Terraform:** This method provides support for a richer set of functions, including the option to deploy using VMSS. To learn more about the resources created when deploying Cloud Connector using a Terraform script, see Deployment Templates for Zscaler Cloud Connector. To learn more about VMSS, see Understanding Cloud Connector Deployments with Azure Virtual Machine Sets.

VMSS is the name of the feature in the Azure Marketplace and the Terraform templates. Auto Scaling is the name of the same feature in the Cloud Provisioning template.

## Prerequisites

Make sure the following prerequisites are met.

If you have already created a dedicated admin role and role-based administrator for Cloud Connector deployment, you can skip the first two steps.

1. Configure a new admin role.
2. Configure a new role-based administrator.
3. Retrieve the API key.
4. Add a location template.
5. Configure a cloud provisioning template.
6. Review the specifications and sizing requirements.
7. Review the firewall requirements.
8. Create user-assigned managed identities.
9. Create an Azure key vault.
10. Create secrets.
11. Create an SSH key pair.

## Deploying the Cloud Connector

If you want to configure your own virtual network and subnets, you must do so before launching the Zscaler Cloud Connector Application. When you deploy Cloud Connector in the Azure Marketplace, accelerated networking is enabled by default. To learn more about accelerated networking, refer to the Azure documentation.

After you have met all the prerequisites, perform the following procedures to deploy your Cloud Connector:

1. Deploy the Zscaler Cloud Connector Application.
2. Send traffic to your load balancer.
3. Disable disk network access.

## Managing the Cloud Connector

After your VM is fully deployed, you can manage the Cloud Connector from the Zscaler Admin Console. A deployed Cloud Connector is displayed on the dashboard. The Cloud & Branch Connector Monitoring page provides information on the name, group, location, geolocation, and status of your Cloud Connector VMs deployed in your cloud account.

After verifying deployment, you can configure the following policies:

- Internet & SaaS Gateways
- Traffic Forwarding
- Log and Control Forwarding
- DNS Control

If you are deploying Cloud Connector in China, Zscaler recommends creating a custom gateway with Zscaler China data centers and traffic forwarding policies referencing your China location and custom gateway. To learn more, see China Premium Internet Access and Deploying Zscaler Internet Access in China.

## Related Articles

- Deploying Zscaler Cloud Connector with Microsoft Azure
- Understanding Cloud Connector Deployments with Azure Virtual Machine Scale Sets
