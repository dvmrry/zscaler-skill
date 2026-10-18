# Troubleshooting Cloud Connector with Amazon Web Services

**Source:** https://help.zscaler.com/cloud-branch-connector/troubleshooting-cloud-connector-amazon-web-services
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1420646, revision 3222984

---

This article provides troubleshooting information and guidelines for Cloud Connector deployment in Amazon Web Services (AWS). You can review issues and corresponding solutions for Zscaler Cloud Connector.
- Deployed Cloud Connector is not displayed in the Zscaler Admin Console
- The deployed Cloud Connector might not be visible in the Zscaler Admin Console for various reasons. The following tables list provisioning and deployment issues and their corresponding troubleshooting actions.
# Provisioning Issues
| Potential Causes | Troubleshooting Action |
|---|---|
| The Cloud Connector instance state is not running after 20 minutes, or the status check is not 2/2 checks passed after 10 minutes. | In the AWS Management Console:Select the Cloud Connector instance and click Actions.Navigate to the Monitor and troubleshoot submenu and select Get system log.Copy the Get system log information into your desired text editor.From the Monitor and troubleshoot submenu, select Get instance screenshot.Download the selected get instance screenshot.Reboot the instance by clicking Instance state, followed by Reboot instance.If the appliance does not proceed after rebooting and indicate two of two checks have passed, delete and re-create the appliance. |
| Cloud Connector does not appear in the Zscaler Admin Console after provisioning. | Confirm the following:The cloud provisioning template in the Zscaler Admin Console is for AWS.The CloudFormation or Terraform cloud automation script process used the correct provisioning URL. If it used an incorrect provisioning URL, remove the instance and create a new instance.AWS Secrets Manager has the correct secret credentials (api_key, Zscaler Admin Console username, and Zscaler Admin Console password).The role assigned to the Cloud & Branch Connector username has the Cloud Connector Provisioning and Location Management permissions assigned.Network connectivity is configured correctly. Verify route tables, NAT gateway, and the internet gateway. To test, from the Cloud Connector appliance console, attempt to ping or cURL a destination on the internet.Security configuration within AWS is accurate. Inbound and outbound access is verified by security groups and network access control lists (ACLs).The workload traffic that transits the Cloud Connector is included in the security group and network ACL rule sets.The bootstrap file (userdata.cfg) was properly imported into the Cloud Connector. You can verify this by logging into the appliance via SSH and issuing the following command: cat /etc/cloud/cloud.cfg.d/userdata.cfg. Confirm that Terraform and CloudFormation variables are present in this file. If the variables are not present, re-create the appliance.The Identity Access Management (IAM) role attached to the Cloud Connector Amazon Machine Image (AMI) instance in AWS has the SecretsManagerRead policy attached to it. If it does not, attach the correct IAM role and re-create a new Cloud Connector instance in the AWS Management Console. To avoid access issues with the Cloud Connector instance, make sure to replicate the AWS Secrets Manager from a working region to new regions.The instance types are supported in the AWS Marketplace. Zscaler recommends deploying with m6i.large or m6i.4xlarge instance types. |
| Cloud Connector does not automatically update and cannot reach the package repository. | Perform the following reachability checks from the Cloud Connector console:Verify that pkg-repo.zscaler.com is reachable on TCP port 443 by running either telnet pkg-repo.zscaler.com 443 or curl pkg-repo.zscaler.com 443.Check whether Cloud Connector received a 500 response from the server indicating that connectivity has succeeded. If the request times out, verify the AWS network configuration (NAT gateway, route table, and internet gateway).Run the pkg info \| grep certificates command to verify that the certificate bundle is present.Run the sudo pkg update command to verify the software update. |
| CloudFormation built-in rules and constraints are not satisfied due to user input error. | Verify the following:There is no mismatch with the CloudFormation stack parameters: virtual private cloud (VPC), subnet, and availability zone.The provisioning URL field is not empty and is in the correct format. |
| Security admin IAM user permissions are not set correctly for Cloud Connector deployment. | Verify that the security admin IAM user has the following access:Full access to the AWS Management Console.Full access to the AWS Secrets Manager.Full access to Amazon CloudWatch Events.Full access to AWS CloudFormation.Full access to AWS Lamda Service.Create the following policies and roles:{ “Version”: “2012-10-17", “Statement”: [ { “Sid”: “VisualEditor0”, “Effect”: “Allow”, “Action”: [ “cloudformation:CreateUploadBucket”, “aws-marketplace:ViewSubscriptions”, “cloudformation:ListStacks”, “aws-marketplace:ListBuilds”, “sns:ListTopics”, “s3:CreateBucket”, “aws-marketplace:Subscribe”, “s3:PutObject”, “aws-marketplace:StartBuild”, “ssm:DescribeParameters”, “route53:ListTrafficPolicies”, “route53:GetHostedZoneCount”, “secretsmanager:ListSecrets” ], “Resource”: “*” }, { “Sid”: “VisualEditor1”, “Effect”: “Allow”, “Action”: [ “logs:ListTagsLogGroup”, “iam:CreateInstanceProfile”, “route53resolver:GetResolverRuleAssociation”, “secretsmanager:DescribeSecret”, “secretsmanager:PutSecretValue”, “route53resolver:ListTagsForResource”, “secretsmanager:CreateSecret”, “iam:RemoveRoleFromInstanceProfile”, “iam:DeletePolicy”, “iam:CreateRole”, “iam:AttachRolePolicy”, “iam:PutRolePolicy”, “ssm:GetParameter”, “iam:AddRoleToInstanceProfile”, “route53resolver:DisassociateResolverRule”, “route53resolver:CreateResolverEndpoint”, “iam:ListInstanceProfilesForRole”, “ssm:DeleteParameter”, “iam:PassRole”, “iam:DetachRolePolicy”, “secretsmanager:GetSecretValue”, “iam:ListAttachedRolePolicies”, “iam:DeleteRolePolicy”, “route53resolver:GetResolverRule”, “route53resolver:DeleteResolverEndpoint”, “iam:DeleteInstanceProfile”, “iam:GetRole”, “iam:GetInstanceProfile”, “logs:DeleteLogGroup”, “route53resolver:DeleteResolverRule”, “route53resolver:AssociateResolverRule”, “iam:DeleteRole”, “ssm:GetParameters”, “route53resolver:GetResolverEndpoint”, “logs:CreateLogGroup”, “ssm:DeleteParameters”, “ssm:PutParameter”, “iam:CreatePolicy”, “route53resolver:ListResolverEndpointIpAddresses”, “iam:ListPolicyVersions”, “ssm:ListTagsForResource”, “iam:GetRolePolicy”, “route53resolver:CreateResolverRule” ], “Resource”: [ “arn:aws:ssm:*:awsaccountnumber:parameter/*“, “arn:aws:logs:*:awsaccountnumber:log-group:*“, “arn:aws:iam::awsaccountnumber:instance-profile/*“, “arn:aws:iam::awsaccountnumber:policy/*“, “arn:aws:iam::awsaccountnumber:role/*“, “arn:aws:route53resolver:*:awsaccountnumber:resolver-endpoint/*“, “arn:aws:route53resolver:*:awsaccountnumber:resolver-rule/*“, “arn:aws:secretsmanager:*:awsaccountnumber:secret:*” ] } ] } |
| CloudFormation stack fails to deploy. Resources and the stack are deleted. | Investigate the event log for errors.Confirm that the user has the correct permissions.Verify that Supported Images in the AWS Marketplace terms and conditions were accepted before deploying to the AWS account for the first time. Navigate to the Cloud Connector offering in the AWS Marketplace and accept the terms and conditions. |
| Terraform script fails to deploy resources. | Verify Terraform credentials (i.e., Access Key/Secret Key).Verify that the user has permissions to create VPC, NAT Gateway, GWLB, IAM, EC2, Elastic IP, Route Tables, Subnets, Security Groups, etc. |
# Deployment Issues
| Error | Troubleshooting Action |
|---|---|
| AWS Cloud Connector is in the wrong geolocation in the Zscaler Admin Console. | Ensure that the Cloud Connector Service Interface is associated with the correct NAT gateway and that the NAT gateway has the correct elastic IP address assigned. If you are not using a NAT gateway, ensure that the public or elastic IP associated with the elastic network interface (ENI) of Cloud Connector is correct. |
| AWS Cloud Connector is in an inactive state. | Verify the following:The registration and policy fetch are correct. To check, contact Zscaler Support.The Cloud Connector instance is up and running within the AWS Management Console.The Zscaler Admin Console can be reached from your VPC/Subnet.AWS Secrets Manager has the correct secret credentials in case of a secrets rotation.The network is connected. Verify by checking the route tables, NAT gateway, and internet gateway configurations.The security group or network ACL is not blocking the Cloud Connector TCP/UDP 443. |
| The Internet & SaaS gateway IP address in the Zscaler Admin Console is not populated, and the tunnel is not established. | Verify the following:The service security group is not blocking access to the management interface (TCP/UDP 443) and the network ACL. You can find a list of Zscaler IP addresses here: https://config.zscaler.comIn the Zscaler Admin Console, check the Internet & SaaS gateway configuration. Ensure that Gateway configuration is set to Auto or Manual (with the proper Data Center set), or in the case of Override, the proper IP Address is input.The PAC file for pac.<cloudname>.net is reachable from the customer's VPC or subnet. |
| Cloud Connector could not enroll in Private Access. | If the user deploys more than 100 Cloud Connectors within a group and within the same VPC or availability zone, then the Private Access enrollment fails. Contact Zscaler Support. |
| AWS Cloud Connector does not have an assigned Private Access Private Service Edge or Private Access Public Service Edge IP address, resulting in a DNS or reachability issue. | Verify the following:The DNS to ec2br.prod.zpath.net is resolvable from the Cloud Connector.The connection to TCP/UDP port 443 is allowed in the network ACL. You can find a list of Zscaler IP addresses here: https://config.zscaler.com |
- Unable to log in to the Zscaler Admin Console
| Potential Causes | Troubleshooting Action |
|---|---|
| Account not created. | Contact Zscaler Support. |
| Cloud Connector SKUs not enabled. | Contact Zscaler Support. |
| Authentication failed. | Verify that the username and all credentials are valid. In the Zscaler Admin Console, confirm the admin. |
| User could not access single sign-on (SSO) from the Zscaler Admin Console. | Contact Zscaler Support. |
- Workloads unable to access internet applications
- The traffic from the Cloud Connector instance might not be able to reach internet applications.
- Check the following areas to determine what is preventing the traffic connection:
| Potential Causes | Troubleshooting Action |
|---|---|
| The firewall policy to the Cloud Connector. | Verify the following:The firewall policy (network security group, security group, and network ACL) to the Cloud Connector does not prevent connection.The Internet & SaaS firewall policy allows traffic through the Cloud Connector. |
| The connectivity from Cloud Connector to Internet & SaaS. | Verify the following:In the Zscaler Admin Console, the Internet Access Gateway is populated.Session logs display the Cloud Connector self-traffic.Your tunnel insights are displayed from the Internet & SaaS tunnel insights.You can view your assigned Internet & SaaS cloud. If not, verify network connectivity.The security group is not blocking outbound TCP/UDP 443 access to Internet & SaaS cloud.The network ACL does not block outbound TCP/UDP 443 access to the Internet & SaaS cloud. |
| The ingress routing to the Cloud Connector. | Verify the following:The routing of the workload subnet does not interfere with the connection. Configure a default route and associate the route to the ENI of the Cloud Connector Service Interface.The network ACL on the Cloud Connector subnet does not restrict access from the workload subnet.The security group on the Cloud Connector service ENI does not restrict access from the workload. |
| The egress path from the Cloud Connector. | Verify the following:The gateway configuration does not interfere with the connection.In the Zscaler Admin Console, the forwarding policy is set up correctly.The network ACL and other services on egress are functional. |
| The status of the Cloud Connector. | Verify the following:The Amazon Machine Image (AMI) status of the Cloud Connector in AWS and the Zscaler Admin Console.The service status of the Cloud Connector in AWS. |
| Incorrect or incompatible AMI and deployment templates. | Verify the following:You are deploying the latest templates and AMI.For non-auto scaling deployments that were deployed before AWS AMI version ZS6.1.25.0, the service interface is device index 1. Cloud Connector AMIs released after October 19, 2023 have the service interface as device index 0. |
| Gateway load balancer target group is showing target Cloud Connector instance as unhealthy. | Verify the following:The target IP is correct. For non-auto scaling deployments, this is the service interface device index 0. For auto scaling deployments, this is the EC2 instance ID.The status of the instance is healthy. From the Zscaler Admin Console dashboard, check the health status reported and any error codes or messages. |
| Connectivity issues between Cloud Connectors within a group or cluster. | Verify the following:All Cloud Connectors communicate with each other within a given connector group or cluster via their service interface(s) to share information such as fully qualified domain name (FQDN)/wildcard FQDN synchronization.No firewall or security groups are blocking network communications between Cloud Connectors within a given VPC/VNet and their availability zones. |
- To enable Auto Scaling, contact Zscaler Support.
- Workloads unable to access private applications
- If your workloads are unable to access private applications, verify the following:
  - The parameters in the CloudFormation template that pertain to the Private Access endpoints are accurate.
  - The application name matches the route53 configuration.
  - The application is available from the Zscaler Admin Console.
- Traffic is not restored after a Cloud Connector failure
- If your traffic is not restored after Cloud Connector's connection failure, verify the following:
  - The Cloud Connector backup instance is in good health with the high-availability model.
  - The Cloud Connector instance is healthy in the Gateway Load Balancer console of AWS.
- Cloud Connector experiencing connectivity disruptions
- To avoid connectivity disruptions and/or unreachable destinations, source/destination checks must be disabled in the AWS Management Console.
- To verify that the source/destination check setting is disabled:
  - Log in to the AWS Management Console.
  - In the Search field, enter EC2. Select EC2. The EC2 Dashboard appears.
  - On the EC2 Dashboard, from the left-side navigation, under Instances, select Instances.
  - On the Instances page, select your NAT instance.
  - On the Instance summary page, select Actions.
  - See image.
  - From the Actions drop-down menu, select Networking > Change source/destination check. The Change Source / destination check window appears.
  - See image.
  - In the Change source/destination check window, select the Stop checkbox.
  - See image.
  - Click Save.
Occasionally, you might need to access the Cloud Connector appliance’s CLI for troubleshooting or monitoring purposes. To access the CLI:
- Bastion Host
- A Bastion host is a lightweight EC2 instance installed within the same subnet as the Cloud Connector Service Interface or Management Interface. This option leverages SSH as the connection protocol. Therefore, you must have access to the SSH key pair used when instantiating the appliances.
- When using Terraform to configure new appliances, a Bastion host is automatically created for management and troubleshooting purposes.
- To access the appliance management interface remotely via Bastion host:
  - Log in to the AWS Management Console.
  - In the Search field, enter EC2. Select EC2. The EC2 Dashboard appears.
  - See image.
  - On the EC2 Dashboard page, under Resources, select Elastic IPs. The Elastic IPs page appears.
  - See image.
  - On the Elastic IPs page, click Allocate Elastic IP address.
  - See image.
  - In the Allocate Elastic IP address window, configure the Elastic IP address settings based on your preferences, and then click Allocate.
  - See image.
  - In the Elastic IP address allocated successfully window, click Associate this Elastic IP address. Alternatively, select the checkbox of the Elastic IP address you created. Then, click Actions and from the drop-down menu, select Associate Elastic IP address. The Associate Elastic IP address page appears.
  - See image.
  - On the Associate Elastic IP address page, configure the following settings:
    - Resource type: Select Network interface.
    - Network interface: Choose the Elastic Network Interface (ENI) of the Bastion host.
    - Private IP address: Choose a private IP address to associate with the Elastic IP address.
    - Reassociation: To enable the Elastic IP address to be reassociated with a different resource when it is already associated with a resource, select the checkbox.
    - When complete, click Associate.
    - See image.
  - In the Search field, enter VPC. Select VPC. The VPC Dashboard appears.
  - See image.
  - On the VPC Dashboard page, in the left-side navigation, select Route tables. The Route tables page appears.
  - See image.
  - Before creating or configuring your route table, identify your public IP Address. This is the address that your SSH management traffic comes from.
  - On the Route tables page, select the checkbox of the route table. Then, from the Actions drop-down menu, select Edit routes. The Edit routes page appears.
  - See image.
  - On the Edit routes page:
    - In the Destination field, enter your public IP address.
    - In the Target field, enter the internet gateway (IGW) of your Amazon VPC.
    - Click Save changes.
  - See image.
  - In the Search field, enter EC2. Select EC2. The EC2 Dashboard appears.
  - See image.
  - On the EC2 Dashboard, under Resources, select Security groups.
  - See image.
  - On the Security Groups page, select the checkbox of the security group. Then, click Actions and from the drop-down menu, select Edit inbound rules.
  - See image.
  - On the Edit inbound rules page, update the Network ACL and/or Security Group ACLs to allow inbound SSH traffic from your public IP address to the Bastion host.
  - Zscaler highly recommends that your inbound rules are restricted to your known management IP address sources.
  - From your management host, use your preferred SSH client to Secure Socket Shell (SSH) to the Cloud Connector. The administrative login for the appliance is zsroot. For Linux terminal SSH clients, enter the command ssh -i mySshKey.pem zsroot@100.64.0.1.
- Management Interface Elastic IP Address
- Cloud Connector appliances have a dedicated management interface installed, by default, in the same subnet as the Service Interface. This option leverages SSH as the connection protocol. Hence, you must have access to the SSH key pair used when instantiating the appliances.
- To access the appliance management interface remotely:
  - Log in to the AWS Management Console.
  - In the Search field, enter EC2. Select EC2. The EC2 Dashboard appears.
  - See image.
  - On the EC2 Dashboard, under Resources, select Elastic IPs. The Elastic IPs page appears.
  - See image.
  - On the Elastic IPs page, select Allocate Elastic IP address.
  - See image.
  - In the Allocate Elastic IP address window, configure the Elastic IP address settings based on your preferences, and then click Allocate.
  - See image.
  - In the Elastic IP address allocated successfully window, click Associate this Elastic IP address. Alternatively, select the checkbox of the Elastic IP address you created. Then, click Actions and from the drop-down menu, select Associate Elastic IP address. The Associate Elastic IP address page appears.
  - See image.
  - On the Associate Elastic IP address page, configure the following settings:
    - Resource type: Select Network interface.
    - Network interface: Choose the Elastic Network Interface (ENI) of the Management and Service Interface Subnet.
    - Private IP address: Choose a private IP address to associate with the Elastic IP address.
    - Reassociation: To enable the Elastic IP address to be reassociated with a different resource when it is already associated with a resource, select the checkbox.
    - When complete, click Associate.
    - See image.
  - In the Search field, enter VPC. Select VPC. The VPC Dashboard appears.
  - See image.
  - On the VPC Dashboard page, in the left-side navigation, select Route tables. The Route tables page appears.
  - See image.
  - Before creating or configuring your route table, identify your public IP Address. This is the address that your SSH management traffic is sourced from.
  - On the Route tables page, select the checkbox of the route table. Then, from the Actions drop-down menu, select Edit routes. The Edit routes page appears.
  - See image.
  - On the Edit routes page:
    - In the Destination field, enter your public IP address.
    - In the Target field, enter the internet gateway (IGW) of your Amazon VPC.
    - Click Save changes.
    - See image.
  - In the Search field, enter EC2. Select EC2. The EC2 Dashboard appears.
  - See image.
  - On the EC2 Dashboard, under Resources, select Security groups.
  - See image.
  - On the Security Groups page, select the checkbox of the security group. Then, click Actions and from the drop-down menu, click Edit inbound rules.
  - See image.
  - On the Edit inbound rules page, update the Network ACL and/or Security Group ACLs to allow inbound SSH traffic from your public IP address to the Bastion host.
  - Zscaler highly recommends that your inbound rules are restricted to your known management IP address sources.
  - From your management host, use your preferred SSH client to SSH to the Cloud Connector. The administrative login for the appliance is zsroot. For Linux terminal SSH clients, the command is ssh -i mySshKey.pem zsroot@100.64.0.1.
- Cloud Connector appliances have the AWS SSM Agent installed by default. To access the appliance via AWS Session Manager:
  - Log in to the AWS Management Console.
  - In the Search field, enter Systems Manager. Select Systems Manager. The AWS Systems Manager page appears
  - See image.
  - On the AWS Systems Manager page, in the left-side navigation under Node Management, select Session Manager. The Session Manager page appears.
  - See image.
  - On the Session Manager page, click Start session. The Start a session page appears.
  - See image.
  - On the Start a session page, under Specify target, configure the following settings:
    - (Optional) In the Reason field, enter the reason for connecting to the instance.
    - In the Target instances field, select the instances you want to connect to.
    - When complete, click Next.
    - See image.
  - Under Specify session document, under Session document - optional, enter any documents required. Then, click Next.
  - See image.
  - Under Review and launch, verify the session details. Then, click Start session.
  - See image.
  - The AWS SSM console logs in to the appliance. However, this user does not have the sudo command within its PATH variable. To execute any administrative tasks, such as starting a support tunnel, on the appliance via SSM, enter the sudo $ /usr/local/bin/sudo zssupport start command.
- AWS Session Manager
