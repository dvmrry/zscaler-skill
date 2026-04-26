# Troubleshooting Cloud Connector with Microsoft Azure

**Source:** https://help.zscaler.com/cloud-branch-connector/troubleshooting-cloud-connector-microsoft-azure
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help
Troubleshooting
Troubleshooting Cloud Connector with Microsoft Azure

This article provides troubleshooting information and guidelines about Cloud Connector deployment in Microsoft Azure. You can learn about different issues, potential causes, and corresponding solutions for the deployed Cloud Connector.

## Issue Index

- Deployed Cloud Connector is not displayed in the Zscaler Cloud & Branch Connector Admin Portal
- Unable to log in to the Cloud & Branch Connector Admin Portal
- Workloads unable to access internet applications
- Workloads unable to access private applications
- Unable to monitor the traffic in the ZIA Admin Portal
- Unable to monitor the traffic in the ZPA Admin Portal
- Traffic not restored after Cloud Connector failure
- Cloud Connector experiencing connectivity disruptions

## Deployed Cloud Connector is not displayed in the Zscaler Cloud & Branch Connector Admin Portal

The following tables list provisioning and deployment issues and their corresponding troubleshooting actions.

- Check whether user data is missing or is provided in an incorrect format. You can verify this by reviewing the Azure KeyVault entries, or by reviewing the User Data file located on the appliance here: /etc/cloud/cloud.cfg.d/userdata.cfg
- Verify the API Key (api-key).
- Verify login credentials (username, password).
- Verify that the provisioning URL is in the correct format and there are no spaces.
- From the Zscaler Cloud & Branch Connector Admin Portal, verify that the Provisioning Template type is correct.
- Check whether Cloud Connector has sufficient privileges to the Azure KeyVault. Ensure that the Get and List roles are assigned to the User Managed Identity that the Cloud Connector is using.
- Check whether Cloud Connector has sufficient privileges to enumerate Network Interfaces. Ensure that the Network Contributor role or Microsoft.Network/networkInterfaces/read permission is assigned to the User Managed Identity that the Cloud Connector is using. Also ensure that the Managed Identity has a sufficient scope that includes the Cloud Connector appliance.
- Verify network security groups to ensure that Cloud Connectors can reach the Zscaler cloud.
- Check whether the Cloud Connector could reach the package repository when using certificate authority. Verify that you can do a package update to confirm that the package repository is reachable and certificates are valid. Run the `sudo pkg update` command.
- Verify DNS resolution.
- Verify that the outbound NAT and routing take the appropriate egress path. In the Cloud & Branch Connector Admin Portal, confirm the Public IP address.
- If the Public IP address is correct, contact Zscaler Support.
- Verify the following:
  - The registration and policy fetch are correct. To check, contact Zscaler Support.
  - Cloud Connector instance is up and running within the Azure Management Console.
  - The Cloud & Branch Connector Admin Portal can be reached from your VNet/subnet.
  - Azure KeyVault has the correct secret credentials in case of a secrets rotation.
  - The network is connected. Verify the route tables, NAT gateway, and DNS.
  - The network security group is not blocking the Cloud Connector TCP/UDP 443 traffic.
  - You cannot validate these conditions from the Command Line Interface (CLI) because the CLI uses the management interface for the deployment operation.

## Unable to log in to the Cloud & Branch Connector Admin Portal

(See portal troubleshooting guidance above.)

## Workloads unable to access internet applications

The traffic from the deployed Cloud Connector might not be able to reach internet applications.

Check the following areas to isolate and identify what is preventing the traffic connection:

- Verify the following:
  - In the Cloud & Branch Connector Admin Portal, the ZIA Gateway is populated.
  - Session logs display the Cloud Connector self-traffic.
  - The Cloud & Branch Connector Admin Portal displays your tunnel insights.
- Verify the following:
  - The routing of the workload subnet.
  - The network security group on the workload subnet.
  - The security group for workloads.
- Verify the following:
  - The gateway configuration.
  - The forwarding policy in the Cloud & Branch Connector Admin Portal.
  - The network security group and other services on egress.
- Verify the following:
  - The virtual machine (VM) status of the Cloud Connector.
  - The service status of the Cloud Connector.
- Verify the following:
  - Within a given connector group or cluster, all Cloud Connectors communicate with each other via their service interface(s) to share information such as FQDN/wildcard FQDN synchronization.
  - No firewall or security groups are blocking network communications between Cloud Connectors within a given VPC/VNet and their availability zones.

## Workloads unable to access private applications

If your workloads are unable to access private applications, verify the following:

- The destination can be reached via Zscaler Client Connector.
- Cloud Connector can resolve Zscaler Private Access (ZPA) destinations by sending a DNS request for a ZPA destination from a workload directly to the IP address of a Cloud Connector service interface. The response should be an IP address from the IP pool defined in the Cloud Connector DNS policy. If that fails, check ZPA access and forwarding policies.
- The workload can resolve ZPA destinations by sending a regular DNS request for a ZPA destination. If that fails, check the Azure or workload DNS settings.
- The IP addresses/ranges that ZPA uses are routed through the Cloud Connector service interfaces.
- The Cloud Connector DNS and forwarding logs are operational.
- The ZPA events are operational.
- If FQDN-based ZPA App Segments are in use, Cloud Connector is able to resolve ZPA destinations by sending a DNS request for a ZPA destination from a workload directly to the IP address of a Cloud Connector service interface.

## Unable to monitor the traffic in the ZIA Admin Portal

If you are unable to monitor traffic in the ZIA Admin Portal, verify the following:

- The Cloud Connector location created in the ZIA Admin Portal is registered in the ZIA Admin Portal.
- In the ZIA Admin Portal, the tunnel logs are showing traffic to ZIA.
- When you filter traffic in the Cloud & Branch Connector Admin Portal, you use the ZIA filter.
- On the Cloud & Branch Connector Admin Portal's Traffic Forwarding Rules page, the traffic forwarding method is ZIA.

## Unable to monitor the traffic in the ZPA Admin Portal

If you are unable to monitor traffic in the ZPA Admin Portal, verify the following:

- Cloud Connector is registered in the ZPA Admin Portal.
- In the Cloud & Branch Connector Admin Portal, the forwarding filter is ZPA.
- In the ZPA Admin Portal, policy configuration is correct. Ensure that access policies and client forwarding policies are working.

## Traffic not restored after Cloud Connector failure

If your traffic is not restored after Cloud Connector's connection failure, verify the following:

- The Cloud Connector backup instance is in good health with the high-availability model.
- In the Azure Load Balancer, the Cloud Connector instance is healthy.

## Cloud Connector experiencing connectivity disruptions

To avoid connectivity disruptions and/or unreachable destinations, IP forwarding must be enabled on the Cloud Connector service interface. This setting is enabled by default, but it could be inadvertently disabled manually or via automation.

To verify the IP forwarding setting:

1. Log in to the Azure Portal.
2. Click Network interfaces.
3. Select the interface and then select Settings > IP configurations.
4. In the IP Settings section, select Enable IP forwarding.

## Accessing the CLI

Occasionally, you might need to access the Cloud Connector appliance's command-line interface (CLI) for troubleshooting or monitoring purposes.

Network operations, such as ping, use the management interface. The CLI only provides limited insights to the service interface and no options to directly test its connectivity.

You can access the CLI via the following methods:

### Bastion Host

A Bastion host is a lightweight VM instance installed within the same subnet as the Cloud Connector service interface. This option leverages Secure Socket Shell (SSH) as the connection protocol. Hence, you must have access to the SSH keypair used when instantiating the appliances.

To access the appliance management interface remotely via Bastion Host:

1. Log in to the Microsoft Azure portal.
2. Navigate to Public IP addresses and click Create.
3. On the Create public IP address page, configure: Subscription, Resource group, region, Name, IP Version (IPv4), SKU (Standard or Basic), Availability zone, Tier (Regional or Global), IP address assignment (Static), Routing preference, Idle timeout (default 4 minutes), DNS name label (optional).
4. Click Review + create, then Create.
5. Associate the new public IP with the Bastion host's network interface.
6. Create a route table entry with: Destination = your public IP, Next hop type = Internet.
7. Add an inbound NSG rule allowing SSH (TCP/22) from your source IP range.
8. SSH from the management host to the Cloud Connector: `ssh -i mySshKey.pem zsroot@10.0.50.106 -o "proxycommand ssh -W %h:%p -i mySshKey.pem ubuntu@100.64.0.1"`

### Management Interface Public IP Address

Cloud Connector appliances have a dedicated management interface installed, by default, in the same subnet as the Service Interface. This option leverages SSH as the connection protocol.

Steps are similar to Bastion Host approach but associate the public IP with the management interface instead. SSH command: `ssh -i mySshKey.pem zsroot@100.64.0.1`

### Bastion Subnet

Microsoft Azure offers a Bastion subnet feature that allocates a small percentage of available IP addresses in a subnet to the Bastion service for management access.

To access the CLI via the Bastion subnet:

1. Log in to the Microsoft Azure Portal.
2. Navigate to Virtual machines and select your Cloud Connector appliance.
3. On the Overview page, click Connect > Bastion > Use Bastion.
4. Ensure the Bastion service is created within the VNet and Management subnet of your appliance.
5. Click Deploy Bastion.
6. After deployment, go back to the appliance Overview page, under Operations select Bastion.
7. Configure: Username = zsroot, Authentication Type = SSH Private Key from Local File, select your SSH Key.
8. Click Connect.

## Related Articles

- Enabling Remote Assistance
- Configuring Remote Access
- Troubleshooting Cloud Connector with Amazon Web Services
- Troubleshooting Cloud Connector with Microsoft Azure
- Troubleshooting Cloud Connector with Google Cloud Platform
- Troubleshooting Cloud Connector with HashiCorp Vault for Google Cloud Platform
