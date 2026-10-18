# Using Sublocation Scopes to Group Cloud Connector Workloads in Amazon Web Services

**Source:** https://help.zscaler.com/cloud-branch-connector/using-sublocation-scopes-group-cloud-connector-workloads-amazon-web
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1532858, revision 3226381

---

This feature is supported in Cloud Connector deployments for locations that are automatically created when Cloud Connectors are deployed with Amazon Web Services (AWS). These locations have the Workload traffic location type.
In a Cloud Connector deployment with Amazon Web Services (AWS), the location is associated with the Virtual Private Cloud (VPC) containing the Cloud Connectors. Sublocations are subsets of workloads within a location group, based on criteria such as scope. Sublocation scope types include VPC Endpoint, VPC, Account, and Namespace. You configure sublocations in the Zscaler Admin Console.
All scope types except VPC Endpoint require integration with workload discovery.
Sublocation scopes allow the following:
- You can apply different Cloud Connector and Internet & SaaS (ZIA) policies to workload traffic based on VPC endpoint, VPC, account, or namespace.
- Policy lookup can distinguish between multiple workloads with the same source IP address space, even without using namespace tags or workload discovery.
- Logs can indicate the correct workload when there are overlapping IP address spaces.
Authentication is not supported for the sublocations described in this article. For more information, see the Gateway Options information in Configuring Sublocations.
# Scope Types
All sublocations within a location must be configured with the same criteria: scope only, combination of scope and IP address range, or IP address range only. Combining a scope and IP address range allows you to create more granular sublocations. You can add a scope to existing sublocations that already have a defined IP address range.
- VPC Endpoint
- VPC
- Account
- Namespace
# Sublocation Traffic Mapping
- Deployment Models
- There are three VPC endpoint deployment models:
  - Distributed
  - Centralized
  - Combined
- In a distributed VPC endpoint deployment, there is one VPC endpoint or a set of VPC endpoints for each subnet or VPC. In this model, workload traffic from each VPC or subnet is routed to Cloud Connectors through a unique VPC endpoint. Duplicate or overlapping IP address ranges within the same namespace are supported if the subnets are in separate sublocations. For examples of the distributed model, see the VPC Endpoint Scope, VPC Scope, Account Scope, and Namespace Scope topology diagrams in the next section.
- In a centralized VPC endpoint deployment, all workload traffic from subnets in spoke VPCs is routed to Cloud Connectors through a shared set of VPC endpoints in a hub VPC. You can create a sublocation based on the hub VPC, but not the spoke VPCs. However, you can use both the hub VPC and a unique IP address range to create more granular sublocations. For an example of the centralized model, see the Scope and IP Address Range topology diagram in the next section.
- In a combined VPC endpoint deployment, there are sets of distributed VPCs and sets of centralized VPCs. Duplicate or overlapping IP address ranges are supported across centralized and distributed VPCs and within distributed VPCs. The combined model is the most common model, especially in large deployments.
- Scope Topology Diagrams
- The following topology diagrams illustrate how scope criteria can group workload traffic.
  - VPC Endpoint Scope
  - VPC Scope
  - Account Scope
  - Namespace Scope
  - Scope and IP Address Range
- In this example, workload traffic in VPC-A is grouped into two sublocations at the VPC endpoint level. You can apply different policies to workload traffic behind VPCE 1 and VPCE 2.
- The workload traffic originating from Private Subnet-1 is routed to VPCE 1. The workload traffic originating from Private Subnet-2 is routed to VPCE 2. VCPE 1 and VCPE 2 are connected via AWS Private Link to the Gateway Load Balancer (GWLB), which passes traffic to and from the Cloud Connectors in the security VPC.
- In this example, workload traffic is grouped into two sublocations at the VPC level. This allows duplicate IP address spaces (172.16.1.0/24 and 172.16.2.0/24) across VPCs because the VPCs are in different sublocations. You can apply different policies to workload traffic behind VPC-A and VPC-B.
- The workload traffic originating from Private Subnet-1 and Private Subnet-2 in Availability Zone A is routed to VPCE 1. The workload traffic originating from Private Subnet-1 and Private Subnet-3 in Availability Zone B is routed to VPCE 2. VCPE 1 and VCPE 2 are connected via AWS Private Link to the GWLB, which passes traffic to and from the Cloud Connectors in the security VPC.
- In this example, workload traffic is grouped into two sublocations at the AWS account level. This allows duplicate IP address spaces (172.16.1.0/24, 172.16.2.0/24, 172.16.3.0/24, and 172.16.4.0/24) across accounts because the accounts are in different sublocations. You can apply different policies to workload traffic behind VPC-A and VPC-B (Account 1) and workload traffic behind VPC-C and VPC-D (Account 2).
- The workload traffic originating from Private Subnet-1 and Private Subnet-2 in Availability Zone A is routed to VPCE 1. The workload traffic originating from Private Subnet-1 and Private Subnet-3 in Availability Zone B is routed to VPCE 2. VCPE 1 and VCPE 2 are connected via AWS Private Link to the GWLB, which passes traffic to and from the Cloud Connectors in the security VPC.
- You can apply a namespace tag to one or more VPCs. The workload discovery service discovers the namespace tag and assigns all the workloads in those VPCs to the namespace. Use the Namespace scope to map all workload traffic behind the VPC endpoints in one or more namespaces to a sublocation.
  - Namespace Scope Localized to Account Boundaries
  - Namespace Scope Across Account Boundaries
- In this example, workload traffic is grouped into two sublocations at the namespace level, where two namespaces are under a single account. This allows a duplicate IP address space (172.16.1.0/24) across Account 1 and Account 2, but not within an account. You can apply different policies to the workload traffic behind VPC-A, VPC-B, and VPC-C (Namespace Blue and Namespace Red) and the workload traffic behind VPC-D and VPC-E (Namespace Green).
- The workload traffic originating from each private subnet is routed to a unique VPC endpoint. The VPC endpoints are connected via AWS Private Link to the GWLB, which passes traffic to and from the Cloud Connectors in the security VPC.
- In this example, workload traffic is grouped into two sublocations at the namespace level, where one namespace spans two accounts. This allows duplicate IP address spaces (172.16.2.0/24) within an account, because VPC-B and VPC-C are in different namespaces. You can apply different policies to the workload traffic behind VPC-A and VPC-B, and the workload traffic behind VPC-C, VPC-D, and VPC-E. The same namespace tag is assigned to the VPCs in each namespace.
- The workload traffic originating from each private subnet is routed to a unique VPC endpoint. The VPC endpoints are connected via AWS Private Link to the GWLB, which passes traffic to and from the Cloud Connectors in the security VPC.
- You can create a sublocation using both a scope and IP address range for greater granularity. This is particularly useful in a centralized deployment model, where you cannot create a sublocation based on spoke VPCs because they do not have VPC IDs or endpoints.
- In this example, Sublocation 1a has the hub VPC and 172.16.1.0/16 as criteria. Sublocation 1b has the hub VPC and 172.16.2.0/16 as criteria. Sublocation 1c has the hub VPC and 172.16.3.0/16 as criteria. You can apply different policies to workload traffic originating from each of these sublocations.
- The workload traffic originating from each spoke VPC is routed to the AWS Transit Gateway, which passes traffic to and from the endpoint subnet in the hub VPC. The VPC endpoint is connected via AWS Private Link to the GWLB, which passes traffic to and from the Cloud Connectors in the security VPC.
- Use the VPC Endpoint scope to map workloads from one or more VPC endpoints to a sublocation. This is the only scope that does not use the workload discovery service, so the VPC Endpoint field is not dynamically populated. You must copy and paste each VPC endpoint ID into the field. In this example from the Zscaler Admin Console, one VPC endpoint is mapped to the sublocation. Logs show the workload traffic originating from this VPC endpoint.
- Use the VPC scope to map workloads in one or more VPCs to a sublocation. This scope uses the workload discovery service, which discovers the workloads in the selected accounts and dynamically populates the VPC drop-down menu. In this example from the Zscaler Admin Console, two VPCs are mapped to the sublocation. Logs show the workload traffic originating from these VPCs.
- The Account drop-down menu is a filter for the VPC list, not a scope.
- Use the Account scope to map workloads in one or more AWS accounts to a sublocation. The Account drop-down menu lists the accounts you can select. This scope uses the workload discovery service, which discovers the workloads in the selected account or accounts. In this example from the Zscaler Admin Console, all VPC endpoints in this account are mapped to the sublocation. Logs shows the workload traffic originating from this account.
- Use the Namespace scope to map workloads in one or more namespaces to a sublocation. This scope uses the workload discovery service, which discovers the workloads in the selected accounts and dynamically populates the Namespace drop-down menu. In this example from the Zscaler Admin Console, all VPC endpoints in the selected namespace are mapped to the sublocation. Logs show the workload traffic originating from this namespace.
- The Account drop-down menu is a filter for the Namespace list, not a scope.
- In the Amazon VPC console, you must assign the same namespace tag to each VPC in a namespace.
- Traffic Mapping Order
- The Zscaler service first attempts to map workload traffic to a sublocation that has a defined scope. If there is no match, the Zscaler service attempts to map workload traffic to a sublocation that has only a defined IP address range. If there is still no match, workload traffic is sent to the default other sublocation, which the Zscaler service automatically creates when a location is added. For information about the other sublocation, see Understanding Sublocations.
