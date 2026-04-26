# Using Sublocation Scopes to Group Cloud Connector Workloads in Amazon Web Services

**Source:** https://help.zscaler.com/cloud-branch-connector/using-sublocation-scopes-group-cloud-connector-workloads-amazon-web
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Deployment Management for Virtual Devices 
Cloud Connector Deployment Management 
Cloud Connector Deployment Management for AWS 
Using Sublocation Scopes to Group Cloud Connector Workloads in Amazon Web Services
Cloud & Branch Connector
Using Sublocation Scopes to Group Cloud Connector Workloads in Amazon Web Services
Ask Zscaler

This feature is supported in Cloud Connector deployments for locations that are automatically created when Cloud Connectors are deployed with Amazon Web Services (AWS). These locations have the Workload traffic location type.

In a Cloud Connector deployment with Amazon Web Services (AWS), the location is associated with the Virtual Private Cloud (VPC) containing the Cloud Connectors. Sublocations are subsets of workloads within a location group, based on criteria such as scope. Sublocation scope types include VPC Endpoint, VPC, Account, and Namespace. You configure sublocations in the Zscaler Admin Console.

All scope types except VPC Endpoint require integration with workload discovery.

Sublocation scopes allow the following:

You can apply different Cloud Connector and Internet & SaaS policies to workload traffic based on VPC endpoint, VPC, account, or namespace.
Policy lookup can distinguish between multiple workloads with the same source IP address space, even without using namespace tags or workload discovery.
Logs can indicate the correct workload when there are overlapping IP address spaces.

Authentication is not supported for the sublocations described in this article. For more information, see the Gateway Options information in Configuring Sublocations.

Scope Types

All sublocations within a location must be configured with the same criteria: scope only, combination of scope and IP address range, or IP address range only. Combining a scope and IP address range allows you to create more granular sublocations. You can add a scope to existing sublocations that already have a defined IP address range.

VPC Endpoint
VPC
Account
Namespace
Sublocation Traffic Mapping
Deployment Models
Scope Topology Diagrams
Traffic Mapping Order
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Deploying Zscaler Cloud Connector with Amazon Web Services
Understanding Cloud Connector Deployments with Amazon Web Services Autoscaling Groups
Using Sublocation Scopes to Group Cloud Connector Workloads in Amazon Web Services
