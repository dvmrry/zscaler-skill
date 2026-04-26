# Understanding Cloud Connector Deployments with Azure Virtual Machine Scale Sets

**Source:** https://help.zscaler.com/cloud-branch-connector/understanding-cloud-connector-deployments-azure-virtual-machine-scale-sets
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help
Deployment Management for Virtual Devices
Cloud Connector Deployment Management
Cloud Connector Deployment Management for Azure
Understanding Cloud Connector Deployments with Azure Virtual Machine Scale Sets

An Azure Virtual Machine Scale Sets (VMSS) deployment dynamically adds Cloud Connector virtual machines (VMs) to a scale set to meet the current load when it increases, and it removes Cloud Connector VMs from the scale set when the load decreases. For example, consider an Azure Virtual Desktop deployment, where users log in to their own virtual workstations at the beginning of the work day and log out at the end of the day. This causes fluctuations in the number of users and the amount of traffic flow during these periods.

VMSS also constantly monitors the health of each VM in the scale set. It removes unhealthy VMs from the scale set and replaces them with healthy ones. If someone manually terminates a VM that is part of a scale set from the Azure portal, the VMSS likewise replaces the VM.

Stopping or rebooting a VM that is part of a scale set from the Azure portal could cause the VM to be terminated.

VMSS provides the following benefits:

- Dynamically scales the number of VMs in the scale set to match demand.
- Automatically removes unhealthy VMs and replaces them with healthy ones.
- Deploys VMs across availability zones for high availability. The Internal Load Balancer (ILB) distributes traffic among the VMs.

This article describes VMSS and how it works in a Cloud Connector deployment. The deployment template prompts you to configure certain VMSS settings mentioned in this article. For information about the deployment template and the deployment steps, see Deployment Templates for Zscaler Cloud Connector and Deploying Zscaler Cloud Connector with Microsoft Azure. For comprehensive VMSS information, refer to the Azure product documentation.

## Topology

The following sections provide a diagram depicting the topology of a VMSS deployment and a description of its components and flow.

- Topology diagram
- Topology details

## Scale-Out and Scale-In

Each Cloud Connector independently reports custom CPU utilization metrics to the Azure Monitor Service at one-minute intervals to advertise the load it is handling. VMSS uses the aggregate CPU utilization of all VMs in the scale set to determine when to trigger scale-out and scale-in events and how aggressively to do so.

Custom CPU metrics provide more detailed information about CPU usage, so Cloud Connector publishes them instead of VM-level metrics.

- Scaling Rules
- Scheduled Scaling

## Cloud Connector Health Monitoring

Health monitoring includes the following entities:

- **Custom Metric Publishing:** Each Cloud Connector publishes a VM-level custom health metric at one-minute intervals. This metric value is 0 for an unhealthy VM or 100 for a healthy VM.
- **Health Monitoring:** The Health Monitoring function consumes the health metric at one-minute intervals and initiates the termination of a VM that it determines is unhealthy.

In logs and reports, the health metric is displayed as `cloud_connector_aggr_health`.

- Grace Period
- Terminating Unhealthy VMs

## Viewing Metrics and Logs

You can view the following metrics and logs in the Azure portal:

- Metrics
- Functions App Logs

## Access to Azure Resources

Managed identities provide granular access control for Azure resources, which eliminates the need to explicitly store secret credentials within the Azure environment.

Azure Key Vault securely manages credentials for external services such as the Zscaler Admin Console.

Two user-assigned managed identities are required to perform Azure operations:

- Cloud Connector
- Functions App

User-assigned managed identities allow access to different entities in a VMSS deployment. Ensure that Cloud Connector is not assigned an Azure System-Assigned Managed Identity, because that identity overrides the deployment requirements.

For information about creating managed identities and assigning roles, see Deploying Zscaler Cloud Connector with Microsoft Azure.

## Related Articles

- Deploying Zscaler Cloud Connector with Microsoft Azure
- Understanding Cloud Connector Deployments with Azure Virtual Machine Scale Sets
