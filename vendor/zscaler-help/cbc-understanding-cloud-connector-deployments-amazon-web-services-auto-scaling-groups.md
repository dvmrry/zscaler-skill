# Understanding Cloud Connector Deployments with Amazon Web Services Autoscaling Groups

**Source:** https://help.zscaler.com/cloud-branch-connector/understanding-cloud-connector-deployments-amazon-web-services-auto-scaling-groups
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Deployment Management for Virtual Devices 
Cloud Connector Deployment Management 
Cloud Connector Deployment Management for AWS 
Understanding Cloud Connector Deployments with Amazon Web Services Autoscaling Groups
Cloud & Branch Connector
Understanding Cloud Connector Deployments with Amazon Web Services Autoscaling Groups
Ask Zscaler

An AWS Elastic Compute Cloud (EC2) Autoscaling deployment dynamically adds Cloud Connector virtual machines (VMs), which are EC2 instances, to an Autoscaling group to meet the current load, and removes Cloud Connector VMs from the group when the load decreases. You define the desired capacity and the minimum and maximum number of VMs in the group.

Autoscaling also constantly monitors the health of each VM in the group. It removes unhealthy VMs from the group and replaces them with healthy ones. If someone manually terminates a VM that is part of an autoscaling group from the Amazon EC2 Console, the VM is likewise replaced.

When deploying a Cloud Connector, only deploy an autoscaling group (ASG) with an ASG template or a non-ASG with a non-ASG template. Additionally, stopping or rebooting a VM that is part of an ASG from the Amazon E2 Console could cause the VM to be terminated.

AWS autoscaling provides the following benefits:

Dynamically scales the number of VMs in the autoscaling group to match demand.
Automatically removes unhealthy VMs and replaces them with healthy ones.
Deploys VMs across availability zones for high availability. A Gateway Load Balancer (GWLB) distributes traffic among the VMs.

This article describes AWS autoscaling and how it works in a Cloud Connector deployment. The deployment template prompts you to configure certain autoscaling settings mentioned in this article. After deployment, you can modify the settings in the Amazon EC2 Console. For information about the deployment template and the deployment steps, see Deployment Templates for Zscaler Cloud Connector and Deploying Zscaler Cloud Connector with Amazon Web Services. For comprehensive autoscaling information, refer to the AWS product documentation.

Topology

The following sections provide a diagram depicting the topology of an autoscale deployment and a description of its components and flow.

Topology diagram
Topology details
Scale-Out and Scale-In

Each Cloud Connector independently reports custom CPU utilization metrics to Amazon CloudWatch at one-minute intervals to advertise the load it is handling. AWS autoscaling uses the aggregate CPU utilization of all VMs in the autoscaling group to determine when to trigger scale-out and scale-in events and how aggressively to do so.

Autoscaling uses custom CPU metrics instead of VM-level metrics because custom metrics provide more detailed and precise information about CPU usage.

Scaling Policy
Cooldown Period and Tolerance
Capacity and Sizing
Examples
Health Monitoring

Autoscaling uses health checks to determine the status of a VM in the InService state.

Health Checks
Grace Period
Lifecycle Management
Warm Pool
Lifecycle Hooks
Viewing Metrics and Logs
Autoscaling group details
Activity History
CloudWatch Metrics
CloudWatch Logs
Zscaler Admin Console
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Deploying Zscaler Cloud Connector with Amazon Web Services
Understanding Cloud Connector Deployments with Amazon Web Services Autoscaling Groups
Using Sublocation Scopes to Group Cloud Connector Workloads in Amazon Web Services
