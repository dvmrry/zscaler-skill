# What Is Zscaler Cloud Connector?

**Source:** https://help.zscaler.com/cloud-branch-connector/what-zscaler-cloud-connector
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1420636, revision 3224251

---

Enabled by the Zero Trust Exchange (ZTE), Zscaler Cloud Connector is a virtual machine (VM) that simplifies traffic forwarding to Zscaler services. It extends the capabilities of Internet & SaaS (ZIA) and Private Access (ZPA) to cloud-native workloads, which allows enterprises to secure cloud workload communications over any network.
The ZTE enables workloads to communicate with each other and have a granular security policy applied. The communication might be from private workloads (e.g., Infrastructure as a Service (IaaS), physical data center) to public workloads (e.g., SaaS/internet), or between private workloads (e.g., IaaS to IaaS, IaaS to physical data center).
Internet & SaaS is used when a private workload is communicating to a public workload through the ZTE. Private Access is used when two private workloads are communicating with each other through the ZTE. To learn more, see the Step-by-Step Configuration Guide for Zscaler Cloud Connector.
# Key Features and Benefits
The following are some key Cloud Connector features and benefits:
- Security: Secures all inbound and outbound traffic to the internet. The security capabilities that are available through the Internet & SaaS platform for server internet access are Secure Sockets Layer (SSL), Intrusion Prevention System (IPS), Firewall, Data Loss Prevention (DLP), etc.
- Connectivity: Provides seamless connectivity from private or public cloud applications to the internet.
- Performance: Ensures better end-user experience and application performance by peering into relationships with SaaS providers (e.g., Microsoft Office 365, Amazon Web Services (AWS), and Microsoft Azure).
- Reduces Cost: Consolidates multiple products (e.g., Squid proxies, firewalls, third-party NAT appliances, URL filtering, etc.) into a single solution. Additionally, the same policy applied to user traffic can be applied across the cloud infrastructure.
- Highly Scalable: Eases implementation across 1,000 service accounts in public clouds and a single solution scales to connect 10K+ server environments in public clouds (AWS, Azure, etc.).
- Ease of Deployment: Fully orchestrated deployment for AWS and Azure using Terraform, CloudFormation, and Azure Resource Manager.
- Real-Time Visibility: Dashboards and Insights provide unparalleled visibility into your users and applications, and the health of your organization’s applications and servers.
- Mergers and Acquisitions: Securely integrates public cloud accounts/networks with the same consistent security controls and enables connectivity between merged/acquired organizations' cloud networks without having to directly connect them or worry about overlapping IP space.
- Layer 4 Security Controls: Cloud Connector provides Layer 4 security controls for east-west traffic, including subnet-to-subnet and virtual private cloud (VPC)-to-VPC communication across cloud providers such as AWS, Azure, and Google Cloud Platform (GCP). Layer 4 controls are also used to secure ingress traffic for public applications hosted in AWS, Azure, and GCP. This arrangement offers a unified view for flow-level visibility and control and the added flexibility of leveraging tag-based policies for Layer 4 controls.
In the realm of networking, organizations ask how to secure traffic entering the cloud, but not traffic that is within, exiting, or transitioning between clouds. As users operate between multiple service providers, this attack surface grows. Cloud Connector enables the following use cases:
- Workloads to Internet Communication: Applications might need to access an internet or SaaS destination (third-party APIs, software updates, etc.) with a scalable, reliable security solution that inspects all transactions, applying advanced threat prevention and DLP controls.
- Workload to Workload Communication: Public clouds and corporate data centers for multi-cloud or hybrid cloud connectivity deliver better security and a simplified operational model compared to traditional solutions like proxies, virtual firewalls, Intrusion Detection System (IDS), and IPS.
