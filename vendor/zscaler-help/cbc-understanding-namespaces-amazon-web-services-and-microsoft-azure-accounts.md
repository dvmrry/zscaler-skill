# Understanding Namespaces for Amazon Web Services and Microsoft Azure Accounts

**Source:** https://help.zscaler.com/cloud-branch-connector/understanding-namespaces-amazon-web-services-and-microsoft-azure-accounts
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Administration 
Cloud Connector Partner Integrations 
Understanding Namespaces for Amazon Web Services and Microsoft Azure Accounts
Cloud & Branch Connector
Understanding Namespaces for Amazon Web Services and Microsoft Azure Accounts
Ask Zscaler

User-defined tags and cloud-provider-defined attributes in security policies enable you to apply policies based on workload identities in a dynamic and granular fashion. The Zscaler service creates a mapping between the user-defined tags or cloud-provider-generated attributes and the workload IP address. This mapping is decentralized at the Zscaler Cloud Connector level. With no overlapping Classless Inter-Domain Routing (CIDR) blocks, Cloud Connector maps the IP address to a set of tags. When there are overlapping CIDR blocks, divide the set of maps into a subset. In a subset, every CIDR block is unique to the namespace. Mapping is simple in a deployment that has no overlapping IP addresses and with all of the virtual private clouds (VPCs) in the same account. It is challenging when VPCs are spread across multiple accounts and have overlapping IP addresses.

A namespace is a set of VPC endpoints in Amazon Web Services (AWS) or a set of virtual networks (VNets) in Microsoft Azure. The VPCs or VNets in a namespace should not have overlapping IP addresses. A namespace is used as an additional data point to differentiate between identical source IP addresses when the egress traffic reaches Cloud Connector.

Namespaces in AWS Accounts

Namespaces allow you to:

Provide deterministic mapping between tags and source IP addresses when there are overlapping IP addresses.
Enable the decentralized deployment and inspection in overlapping IP address environments.
Help apply policies based on user-defined tags in an environment with overlapping IP addresses.

In decentralized deployments, you can have overlapping CIDR blocks that all route to the same Cloud Connector where you assign the IP addresses to the Cloud Connector. Namespaces provide a way to associate the tag with the IP address using a VPC endpoint.

By default, if the user-defined namespace is not detected, all workloads are part of the default namespace. If you want to group VPCs and/or accounts in a namespace, you must assign the same namespace VPC tag for each VPC. The namespace tag key is named zs:namespace and has a value of <namespace_value>, where <namespace_value> is a string you choose.

Namespaces influence AWS accounts by:

Grouping accounts and/or VPCs that do not have overlapping IP addresses and can communicate to the same set of Cloud Connectors.
Creating mapping between workload tags and IP addresses even when duplicate IP addresses are detected between accounts and/or VPCs.
Applying security policies based on tags even when the tags are associated with overlapping IP addresses.

See image.

In the diagram, there are three AWS accounts (Acct_1, Acct_2, and Acct_3). The VPC in Acct_1 has an overlapping IP address range with the VPC in Acct_2. The VPC in Acct_3 is the security VPC that has the Cloud Connectors deployed. You want to use the user-defined tags on workloads in Acct_1 and Acct_2 in Zscaler policies. They tag the Acct_1 VPC with zs:namespace=project-green. The AWS admin tags the Acct_2 VPC with zs:namespace=project-blue. The Zscaler discovery service reads the accounts and VPC tags to create the following mapping:

Endpoint ID	Namespace
vpce-111	project-blue
vpce-222	project-blue
vpce-333	project-green
vpce-444	project-green

The Zscaler discovery service also fetches the IP addresses and the associated tags to create the following mapping for the same IP address present in both VPCs:

IP Address	VPC Endpoint	Tag Index	Tag List
172.31.0.1	vpce-111	172.31.0.1+project-green	Tag-A, Tag-B
172.31.0.1	vpce-444	172.31.0.1+project-blue	Tag-C, Tag-D
Namespaces in Azure Accounts

In Azure, the discovery service does not know which VNet peers to which Cloud Connector. For example, you have an IP address that sends a list of tags to Cloud Connector. If the discovery service discovers overlapping CIDR blocks within the IP addresses, a namespace must be created. The Cloud Connector requests that specific namespace to receive tags. The Zscaler service needs to maintain separate namespaces for the same subscription, so Cloud Connectors in the same subscription have different namespaces.

Although the location of the Cloud Connector is not an issue for the policy and logs, it is a problem for assigning tags. You can use the namespace assigned to each VNet to route the message from the publish-subscribe mechanism to the correct Cloud Connector. In the diagram below, you can assign zs:namespace to Yellow, which applies to the three VNets on the left, and assign zs:namespace to Green, which applies to the three VNets on the right. If the VNets are overlapping in different subscriptions, you can create a subscription group. Each subscription group must have a different credential (app registration).

See image.

When deploying applications in Azure, you can reuse the same CIDR block in a deployment. When using VPC peering, you cannot use endpoints to separate traffic. You must duplicate the Cloud Connector group stack.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Amazon Web Services Accounts
Adding an Amazon Web Services Account
Analyzing Amazon Web Services Account Details
About Amazon Web Services Account Groups
Adding an Amazon Web Services Account Group
Analyzing Amazon Web Services Account Group Details
Configuring Workload Discovery for Workloads in Amazon Web Services
About Microsoft Azure Accounts
Configuring the Workload Discovery Service for Microsoft Azure Accounts
Analyzing Microsoft Azure Account Details
Configuring IAM Roles and Permissions for Microsoft Azure
Understanding Namespaces for Amazon Web Services and Microsoft Azure Accounts
About Google Cloud Platform Accounts
Adding a Google Cloud Platform Account
Analyzing Google Cloud Platform Account Details
Configuring Workload Discovery for Workloads in Google Cloud Platform
