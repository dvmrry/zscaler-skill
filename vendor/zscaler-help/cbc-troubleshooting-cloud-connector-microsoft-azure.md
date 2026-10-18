# Troubleshooting Cloud Connector with Microsoft Azure

**Source:** https://help.zscaler.com/cloud-branch-connector/troubleshooting-cloud-connector-microsoft-azure
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1420786, revision 3218385

---

This article provides troubleshooting information and guidelines about Cloud Connector deployment in Microsoft Azure. You can learn about different issues, potential causes, and corresponding solutions for the deployed Cloud Connector.
- Deployed Cloud Connector is not displayed in the Zscaler Admin Console
- The following tables list provisioning and deployment issues and their corresponding troubleshooting actions.
# Provisioning Issues
| Potential Causes | Troubleshooting Actions |
|---|---|
| Deployed Cloud Connector is not displayed in the Zscaler Admin Console | Check whether user data is missing or is provided in an incorrect format. You can verify this by reviewing the Azure Key Vault entries, or by reviewing the User Data file located on the appliance here: /etc/cloud/cloud.cfg.d/userdata.cfgVerify the API Key (api-key).Verify login credentials (username, password).Verify that the provisioning URL is in the correct format and there are no spaces.From the Zscaler Admin Console, verify that the Provisioning Template type is correct.Check whether Cloud Connector has sufficient privileges to the Azure Key Vault. Ensure that the Get and List roles are assigned to that the User Managed Identity that the Cloud Connector is using.Check whether Cloud Connector has sufficient privileges to enumerate network interfaces. Ensure that the Network Contributor role or Microsoft.Network/networkInterfaces/read permission is assigned to the User Managed Identity that the Cloud Connector is using. Also ensure that the Managed Identity has a sufficient scope that includes the Cloud Connector appliance.Verify network security groups to ensure that Cloud Connectors can reach the Zscaler cloud.Check whether the Cloud Connector could reach the package repository when using certificate authority. Verify that you can do a package update to confirm that the package repository is reachable and certificates are valid. Run the sudo pkg update command.Verify DNS resolution. |
| Terraform script fails to create a VNet in a greenfield deployment. | Check whether the user has surpassed the VNet creation limit for that region. |
# Deployment Issues
| Potential Causes | Troubleshooting Actions |
|---|---|
| Cloud Connector is in the wrong geolocation in the Zscaler Admin Console. | Verify that the outbound NAT and routing take the appropriate egress path. In the Zscaler Admin Console, confirm the Public IP address.If the Public IP address is correct, contact Zscaler Support. |
| Cloud Connector is in an inactive state. | Verify the following:The registration and policy fetch are correct. To check, contact Zscaler Support.Cloud Connector instance is up and running within the Azure Management Console.The Zscaler Admin Console can be reached from your VNet/subnet.Azure Key Vault has the correct secret credentials in case of a secrets rotation.The network is connected. Verify the route tables, NAT gateway, and DNS.The network security group is not blocking the Cloud Connector TCP/UDP 443 traffic.You cannot validate these conditions from the Command Line Interface (CLI) because the CLI uses the management interface for the deployment operation. |
| In the Zscaler Admin Console, the Internet & SaaS (ZIA) gateway IP address is not populated. | From the Zscaler Admin Console, check the Internet & SaaS gateway configuration. If the gateway configuration is not set correctly, contact Zscaler Support. |
- Unable to log in to the Zscaler Admin Console
| Potential Causes | Troubleshooting Action |
|---|---|
| Account not created. | Contact Zscaler Support. |
| Cloud Connector SKUs not enabled. | Contact Zscaler Support. |
| Authentication failed. | Verify that the username and all credentials are valid. Confirm that the admin exists in the Zscaler Admin Console. |
| User could not access single sign-on (SSO) from the Zscaler Admin Console. | Contact Zscaler Support. |
- Workloads unable to access internet applications
- The traffic from the deployed Cloud Connector might not be able to reach internet applications.
- Check the following areas to isolate and identify what is preventing the traffic connection:
| Potential Causes | Troubleshooting Action |
|---|---|
| The firewall policy attached to the Cloud Connector. | Verify that the Internet & SaaS firewall policy is not blocking any outbound traffic. |
| The connectivity from the Cloud Connector to Internet & SaaS. | Verify the following:In the Zscaler Admin Console, the Internet Access Gateway is populated.Session logs display the Cloud Connector self-traffic.The Zscaler Admin Console displays your tunnel insights. |
| The ingress routing to the Cloud Connector. | Verify the following:The routing of the workload subnet.The network security group on the workload subnet.The security group for workloads. |
| The egress path from the Cloud Connector. | Verify the following:The gateway configuration.The forwarding policy in the Zscaler Admin Console.The network security group and other services on egress. |
| The status of the Cloud Connector. | Verify the following:The virtual machine (VM) status of the Cloud Connector.The service status of the Cloud Connector. |
| Connectivity issues between Cloud Connectors within a group or cluster. | Verify the following:Within a given connector group or cluster, all Cloud Connectors communicate with each other via their service interface(s) to share information such as FQDN or wildcard FQDN synchronization.No firewall or security groups are blocking network communications between Cloud Connectors within a given VPC/VNet and their availability zones. |
- Workloads unable to access private applications
- If your workloads are unable to access private applications, verify the following:
  - The destination can be reached via Zscaler Client Connector.
  - Cloud Connector can resolve Private Access (ZPA) destinations by sending a DNS request for a Private Access destination from a workload directly to the IP address of a Cloud Connector service interface. The response should be an IP address from the IP pool defined in the Cloud Connector DNS policy. If that fails, check Private Access access and forwarding policies.
  - The workload can resolve Private Access destinations by sending a regular DNS request for a Private Access destination. If that fails, check the Azure or workload DNS settings.
  - The IP addresses and ranges that Private Access uses are routed through the Cloud Connector service interfaces.
  - The Cloud Connector DNS and forwarding logs are operational.
  - The Private Access events are operational.
  - If FQDN-based Private Access App Segments are in use, Cloud Connector is able to resolve Private Access destinations by sending a DNS request for a Private Access destination from a workload directly to the IP address of a Cloud Connector service interface.
- Unable to monitor the traffic in the Zscaler Admin Console
- If you are unable to monitor traffic in the Zscaler Admin Console, verify the following:
  - The Cloud Connector location created in the Zscaler Admin Console is registered in the Zscaler Admin Console.
  - In the Zscaler Admin Console, the tunnel logs are showing traffic to Internet & SaaS.
  - When you filter traffic in the Zscaler Admin Console, you use the Internet & SaaS filter.
  - On the Zscaler Admin Console's Traffic Forwarding Rules page, the traffic forwarding method is Internet & SaaS.
- Unable to monitor the traffic in the Zscaler Admin Console
- If you are unable to monitor traffic in the Zscaler Admin Console, verify the following:
  - Cloud Connector is registered in the Zscaler Admin Console.
  - In the Zscaler Admin Console, the forwarding filter is Private Access.
  - In the Zscaler Admin Console, policy configuration is correct. Ensure that access policies and client forwarding policies are working.
- Traffic not restored after Cloud Connector failure
- If your traffic is not restored after Cloud Connector connection failure, verify the following:
  - The Cloud Connector backup instance is in good health with the high-availability model.
  - In the Azure Load Balancer, the Cloud Connector instance is healthy.
- Cloud Connector experiencing connectivity disruptions
- To avoid connectivity disruptions and/or unreachable destinations, IP forwarding must be enabled on the Cloud Connector service interface. This setting is enabled by default, but it could be inadvertently disabled manually or via automation.
- To verify the IP forwarding setting:
  - Log in to the Azure Portal.
  - Click Network interfaces.
  - Select the interface and then select Settings > IP configurations.
  - In the IP Settings section, select Enable IP forwarding.
  - See image.
Occasionally, you might need to access the Cloud Connector appliance’s command line interface (CLI) for troubleshooting or monitoring purposes.
Network operations, such as ping, use the management interface. The CLI only provides limited insights to the service interface and no options to directly test its connectivity.
You can access the CLI via the following methods:
- Bastion Host
- A bastion host is a lightweight VM instance installed within the same subnet as the Cloud Connector service interface. This option leverages Secure Socket Shell (SSH) as the connection protocol. Hence, you must have access to the SSH key pair used when instantiating the appliances.
- To access the appliance management interface remotely:
  - Log in to the Microsoft Azure portal.
  - On the Azure dashboard, navigate to the Search resources, service, and docs (G+/) field.
  - See image.
  - In the Search resources, service, and docs (G+/) field, enter Public IP addresses. Then, under Services, select Public IP addresses. The Public IP addresses page appears.
  - See image.
  - On the Public IP addresses page, click Create. The Create public IP address page appears.
  - See image.
  - On the Create public IP address page, on the Basics tab, under Project details, configure the following settings:
    - Subscription: Select your desired subscription.
    - Resource group: Select your desired resource group to apply policies to the public IP address.
  - Under Instance details, select a region for the public IP address.
  - Under Configuration details, configure the following settings:
    - Name: Enter a name for the public IP address.
    - IP Version: Select IPv4.
    - SKU: Select Standard or Basic.
    - Availability zone: Select your desired availability zone.
    - Tier: Select Regional or Global.
    - IP address assignment: Select Static.
    - Routing preference: Select Microsoft network or Internet, depending on your preference.
    - Idle timeout (minutes): The default idle timeout is set to 4 minutes.
    - DNS name label: (Optional) Choose a DNS name label.
  - See image.
  - Click Next : Tags >.
  - On the Tags tab, assign your desired name/value pairs, and then click Review + create.
  - On the Review + create tab, click Create.
  - See image.
  - On the Public IP addresses page, navigate to the public IP address you created, and then click the name.
  - On your public IP address's Overview page, click Associate. The Associate public IP address window appears.
  - See image.
  - In the Associate public IP address window, configure the following settings:
    - Resource type: Select Network interface.
    - Network interface: Select the network interface of your Bastion host.
  - Click OK to confirm the association.
  - See image.
  - In the Search resources, service, and docs (G+/) field, enter Route tables. Then, under Services, select Route tables. The Route tables page appears.
  - See image.
  - Before creating or configuring your route table, identify your public IP Address. This is the address that your SSH management traffic comes from.
  - On the Route tables page, select the name of the route table associated with your Bastion host.
  - On your route table's Overview page, in the left-side navigation, under Settings, select Routes.
  - See image.
  - On the Routes page, click Add.
  - In the Add route window, configure the following settings:
    - Route name: Enter a name for your route.
    - Destination type: Select IP Addresses.
    - Destination IP addresses/CIDR ranges: Enter your public IP address.
    - Next hop type: Select Internet.
    - Next hop address: Leave as default.
  - Click Add to confirm the route.
  - See image.
  - In the Search resources, service, and docs (G+/) field, enter Network security groups. Then, under Services, select Network security groups. The Network security groups page appears.
  - See image.
  - On the Network security groups page, select the name of the network security group associated with your Bastion host.
  - On your network security group's Overview page, in the left-side navigation, under Settings, select Inbound security rules.
  - On the Inbound security rules page, click Add.
  - In the Add inbound security rule window, configure the following settings:
    - Source: Select IP Addresses.
    - Source IP addresses/CIDR ranges: Enter your source IP addresses/CIDR ranges.
    - Source port ranges: Enter your source port ranges.
    - Destination: Select IP Addresses.
    - Service: Select SSH.
    - Destination port ranges: This field is automatically set to 22.
    - Protocol: This field is automatically set to TCP.
    - Action: Select Allow.
    - Priority: Enter a number to designate the priority of this rule.
    - Name: Enter a name for this rule.
    - Description: (Optional) Enter a description of the rule.
  - Click Add to confirm the inbound security rule configuration.
  - See image.
  - Using your preferred SSH client, SSH from the management host to the Cloud Connector. The administrative login for the appliance is zsroot. The administrative login for the Bastion host varies depending on the operating system (OS) selected. For Linux terminal SSH clients using a Linux (Ubuntu) Bastion host, the command is ssh -i mySshKey.pem zsroot@10.0.50.106 -o "proxycommand ssh -W %h:%p -i mySshKey.pem ubuntu@100.64.0.1.
- Management Interface Public IP Address
- Cloud Connector appliances have a dedicated management interface installed, by default, in the same subnet as the Service Interface. This option leverages SSH as the connection protocol. Hence, you must have access to the SSH key pair used when instantiating the appliances.
- To access the appliance management interface remotely:
  - Log in to the Microsoft Azure portal.
  - On the Azure dashboard, navigate to the Search resources, service, and docs (G+/) field.
  - See image.
  - In the Search resources, service, and docs (G+/) field, enter Public IP addresses. Then, under Services, select Public IP addresses. The Public IP addresses page appears.
  - See image.
  - On the Public IP addresses page, click Create. The Create public IP address page appears.
  - See image.
  - On the Create public IP address page, on the Basics tab, under Project details, configure the following settings:
    - Subscription: Select your desired subscription.
    - Resource group: Select your desired resource group to apply policies to the public IP address.
  - Under Instance details, select a region for the public IP address.
  - Under Configuration details, configure the following settings:
    - Name: Enter a name for the public IP address.
    - IP Version: Select IPv4.
    - SKU: Select Standard or Basic.
    - Availability zone: Select your desired availability zone.
    - Tier: Select Regional or Global.
    - IP address assignment: Select Static.
    - Routing preference: Select Microsoft network or Internet, depending on your preference.
    - Idle timeout (minutes): The default idle timeout is set to 4 minutes.
    - DNS name label: Choose a DNS name label.
  - See image.
  - Click Next : Tags >.
  - On the Tags tab, assign your desired name/value pairs, and then click Review + create.
  - On the Review + create tab, click Create.
  - See image.
  - On the Public IP addresses page, navigate to the public IP address you created, and then click the name.
  - On your public IP address's Overview page, click Associate. The Associate public IP address window appears.
  - See image.
  - In the Associate public IP address window, configure the following settings:
    - Resource type: Select Network interface.
    - Network interface: Select the network interface of your management interface.
  - Click OK to confirm the association.
  - See image.
  - In the Search resources, service, and docs (G+/) field, enter Route tables. Then, under Services, select Route tables. The Route tables page appears.
  - See image.
  - Before creating or configuring your route table, identify your public IP address. This is the address that your SSH management traffic comes from.
  - On the Route tables page, select the name of the route table associated with your management interface.
  - On your route table's Overview page, in the left-side navigation, under Settings, select Routes.
  - See image.
  - On the Routes page, click Add.
  - In the Add route window, configure the following settings:
    - Route name: Enter a name for your route.
    - Destination type: Select IP Addresses.
    - Destination IP addresses/CIDR ranges: Enter your public IP address.
    - Next hop type: Select Internet.
    - Next hop address: Leave as default.
  - Click Add to confirm the route.
  - See image.
  - In the Search resources, service, and docs (G+/) field, enter Network security groups. Then, under Services, select Network security groups (classic). The Network security groups page appears.
  - See image.
  - On the Network security groups page, select the name of the network security group associated with your management interface.
  - On your network security group's Overview page, in the left-side navigation, under Settings, select Inbound security rules.
  - On the Inbound security rules page, click Add.
  - In the Add inbound security rule window, configure the following settings:
    - Source: Select IP Addresses.
    - Source IP addresses/CIDR ranges: Enter your source IP addresses/CIDR ranges.
    - Source port ranges: Enter your source port ranges.
    - Destination: Select IP Addresses.
    - Service: Select SSH.
    - Destination port ranges: This field is automatically set to 22.
    - Protocol: This field is automatically set to TCP.
    - Action: Select Allow.
    - Priority: Enter a number to designate the priority of this rule.
    - Name: Enter a name for this rule.
    - Description: (Optional) Enter a description of the rule.
  - Click Add to confirm the inbound security rule configuration.
  - See image.
  - Using your preferred SSH client, SSH from the management host to the Cloud Connector. The administrative login for the appliance is zsroot. For Linux terminal SSH clients, the command is ssh -i mySshKey.pem zsroot@100.64.0.1.
- Bastion Subnet
- Microsoft Azure offers a feature known as a Bastion subnet. This feature allocates a small percentage of available IP addresses in a subnet to the Bastion service and provides an entry point into your cloud network for management purposes.
- To access the CLI via the Bastion subnet:
  - Log in to the Microsoft Azure Portal.
  - On the Azure dashboard, navigate to the Search resources, service, and docs (G+/) field.
  - See image.
  - In the Search resources, service, and docs (G+/) field, enter Virtual machines. Then, under Services, select Virtual machines. The Virtual machines page appears.
  - See image.
  - On the Virtual machines page, select your desired Cloud Connector appliance.
  - On the Cloud Connector appliance Overview page, click Connect.
  - See image.
  - Select Bastion, then click Use Bastion.
  - See image.
  - Ensure that the service is created within the VNet and Management subnet of your appliance so the appropriate connectivity exists.
  - Under Create Bastion, click Deploy Bastion.
  - See image.
  - After your Bastion has deployed, return to your Cloud Connector appliance Overview page.
  - On the Overview page, under Operations, select Bastion.
  - See image.
  - In the Bastion window, configure the following settings:
    - Username: Enter zsroot.
    - Authentication Type: Select SSH Private Key from Local File.
    - Local File: Navigate to and select your SSH Key.
  - Click Connect.
  - See image.
