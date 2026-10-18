# About Google Cloud Platform Zero Trust Gateways

**Source:** https://help.zscaler.com/cloud-branch-connector/about-google-cloud-platform-zero-trust-gateways
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540272, revision 3242885

---

Google Cloud Platform (GCP) Zero Trust Gateways are a Zscaler cloud native service offering in public clouds that is supported in GCP.
GCP gateways are in Limited Availability (LA). To enable this feature, contact Zscaler Support. Additionally, note the following:
- DNS interception is not supported.
- Packet interception for Network Security Integration (NSI) cancels the high-bandwidth networking benefits of third generation or higher machine series. If a virtual machine (VM) requires more than 7 Gbps of throughput, do not configure NSI for the VM.
- Regional network firewall policies are not supported for packet intercept.
- In-band integration is not supported in Google Cloud VMware Engine, Google Distributed Cloud-Hosted (GDC-H), Google Distributed Cloud-Edge (GDC-E), Google Private Cloud, Google Cloud Run, and GKE Enterprise.
- To override classic firewall evaluation at the virtual private cloud (VPC) level so that the network firewall policy is evaluated before VPC firewall rules, run the gcloud compute networks update vpc-name--network-firewall-policy-enforcement-order=BEFORE_CLASSIC_FIREWALL command.
GCP gateways provide the following benefits and enable you to:
- Secure workloads communicating with the internet and private destinations using the Zscaler Zero Trust Cloud as a SaaS offering, without needing to manage any security infrastructure.
- Maintain consistent security policies in your multicloud environment.
- Simplify operations by removing the need to deploy NAT gateways, security infrastructure, load balancers, and VMs.
- Apply security features such as advanced firewall protection, Secure Sockets Layer (SSL) inspection, data loss prevention (DLP), and intrusion prevention system (IPS) as a cloud-native service.
- Support Private Access (ZPA) for web traffic only.
- Use Internet & SaaS (ZIA) functionalities.
# About the GCP Page
On the GCP page (Zero Trust Cloud > Zero Trust Gateway > GCP), you can do the following:
- Search for a GCP gateway.
- Refresh the list of GCP gateways.
- Add a GCP gateway.
- Modify the table and its columns.
- Show or hide the Service Status, Availability Zone, and ID filters from view.
- Filter the list of GCP gateways by their Service Status, Availability Zone, and ID.
- View a list of all GCP gateways. For each GCP gateway, you can view:
  - Name: The name of the GCP gateway.
  - ID: The ID of the GCP gateway.
  - Region: The region associated with the GCP gateway.
  - Availability Zone ID: The ID of the GCP availability zone associated with the GCP gateway.
  - Intercept Deployment Group: A GCP-provided resource that allows the Zscaler service to intercept and inspect workload traffic from your VPCs. To learn more, refer to the GCP documentation.
  - Intercept Endpoint Groups Count: The number of a project-wide resource that allows you to access a Zscaler-managed security service in GCP. To learn more, refer to the GCP documentation.
  - Location: The location associated with the GCP gateway.
  - Created Date: The date and time when the GCP gateway was created.
  - Last Modified On: The date and time when the GCP gateway was last modified.
  - Service Status: The service status of the GCP gateway (i.e., Healthy, Unhealthy, or Not Available).
- Edit a GCP gateway.
- Delete a GCP gateway.
- Analyze a specific GCP gateway and its details.
