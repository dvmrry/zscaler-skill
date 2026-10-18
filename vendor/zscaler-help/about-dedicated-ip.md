# About Dedicated IP Gateways

**Source:** https://help.zscaler.com/zia/about-dedicated-ip-gateways
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1499506, revision 3243116

---

To enable the Dedicated IP feature for your Internet & SaaS (ZIA) tenant, contact your Zscaler Account team.
You can create gateway objects to forward traffic through a dedicated IP address provisioned to the organization. These gateways are used in Zscaler Forwarding policies to forward traffic that matches the criteria in the Forwarding rule.
When dedicated IP addresses are allocated to your organization, the Zscaler service creates a default gateway that can neither be edited nor deleted. When selected in Forwarding policies, this gateway ensures that the optimal data center is selected when forwarding traffic through the dedicated IP addresses. For example, when a tenant selects the default gateway in their dedicated IP Forwarding policy, the Zscaler service directs the traffic to the geographically nearest data center that has a dedicated IP address assigned.
The following examples explain traffic routing for different geographic locations with the default gateway selected in the Forwarding policy:
- Example 1
- Consider an organization with a tenant in San Francisco forwarding traffic to the San Jose Zscaler data center. In this case:
  - The egress source IP address for the tenant's traffic is the dedicated IP address assigned to the tenant at the San Jose data center.
  - If the San Jose data center does not have a dedicated IP address assigned to the tenant, the default gateway forwards the traffic to the geographically nearest data center with a dedicated IP address, such as the Los Angeles data center.
- Example 2
- Consider an organization with a tenant in Los Angeles. The tenant does not have a dedicated IP address provisioned for them in the Los Angeles Zscaler data center, but only in the San Jose Zscaler data center. In this case:
  - The traffic is serviced at the Los Angeles data center, but it egresses from the San Jose data center, the geographically nearest data center, for which the dedicated IP addresses are assigned for the organization.
  - The user does not need to explicitly forward the traffic to the San Jose data center. The data center is automatically selected based on the default gateway configuration in the Forwarding rules.
- Example 3
- Consider an organization with a dedicated IP address assigned to both the London Zscaler data center and the Manchester Zscaler data center. In this case:
  - If a user is located in London, traffic egresses from the London data center based on the default gateway configuration in the Forwarding rules.
  - If the same user moves to Manchester and their traffic is serviced by the Manchester data center, the default gateway configuration automatically selects the Manchester data center to forward traffic to the destination, as it is now the closest data center with a dedicated IP address.
When a Public Service Edge for Internet & SaaS (ZIA) instance servicing the traffic cannot reach the NAT instance in the primary data center, failover from the primary to the secondary data center occurs automatically. Manual failover to a backup data center is not supported.
Excluding a subcloud does not affect data center selection for dedicated IP addresses, as subclouds are used to manage the data centers that service ingress traffic for the Zscaler service and the dedicated IPs are used on the egress path from the Zscaler service.
The Gateways page provides the following benefits and enables you to:
- Create gateway objects using the data centers that have been provisioned with IP addresses dedicated to your organization.
- Configure two data centers, primary and secondary, for a gateway object to support failover to the secondary data center when the dedicated IP addresses in the primary data center are unreachable.
# About Gateways
On the Gateways page (Infrastructure > Internet & SaaS > Dedicated IP > Gateways), you can do the following:
- Search for a gateway.
- Add a dedicated IP gateway.
- Modify the table and its columns.
- View the list of all configured gateways. For each gateway, you can view:
  - **Name**: The name of the gateway.
  - **Primary DC**: The location of the primary data center for the gateway.
  - **Secondary DC**: The location of the secondary data center for the gateway. If you have selected **Auto**, the Zscaler service automatically selects a data center based on geographical proximity to the Public Service Edge servicing the traffic.
  - The secondary data center location is used when the dedicated IP addresses at the primary data center are unreachable.
  - **Description**: Additional notes or information about the gateway.
- Edit or delete a configured gateway.
- View the default gateway data center details.
- Go to the Dedicated IP Addresses page.
