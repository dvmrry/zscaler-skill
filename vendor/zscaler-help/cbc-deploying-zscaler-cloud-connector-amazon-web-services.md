# Deploying Zscaler Cloud Connector with Amazon Web Services

**Source:** https://help.zscaler.com/cloud-branch-connector/deploying-zscaler-cloud-connector-amazon-web-services
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Deployment Management for Virtual Devices 
Cloud Connector Deployment Management 
Cloud Connector Deployment Management for AWS 
Deploying Zscaler Cloud Connector with Amazon Web Services
Cloud & Branch Connector
Deploying Zscaler Cloud Connector with Amazon Web Services
Ask Zscaler

This deployment guide provides information on prerequisites, how to deploy Zscaler Cloud Connector as an Amazon Machine Image (AMI) on Amazon Web Services (AWS), and post-deployment configurations.

When deploying a Cloud Connector, only deploy an autoscaling group (ASG) with an ASG template or a non-ASG with a non-ASG template. Additionally, do not run both ASG and non-ASG deployments within the same Virtual Private Cloud (VPC).

Prerequisites

Make sure the following prerequisites are met.

If you have already created a dedicated admin role and role-based administrator for Cloud Connector deployment, you can skip the first two steps.

1. Configure a new admin role.
2. Configure a new role-based administrator.
3. Retrieve the API key.
4. (Optional) Add a location template.
5. Configure a cloud provisioning template.
6. Review the specifications and sizing requirements.
7. Review the firewall requirements.
8. Download the deployment templates.
9. Create an EC2 instance access key pair.
10. Store your credentials in AWS Secrets Manager.
11. Configure your VPC.
12. Create an Amazon S3 bucket for autoscaling (advanced deployment).
Deploying the Cloud Connector

This procedure describes the steps for deploying Zscaler Cloud Connector using a CloudFormation template. To learn more about deploying Zscaler Cloud Connector using a Terraform script, see Deployment Templates for Zscaler Cloud Connector.

After you have met all the prerequisites, create a stack in the AWS CloudFormation console and deploy your Cloud Connector. Then, modify your route table and associated subnet to send workload traffic to the Cloud Connector.

The AWS CloudFormation console allows you to create stacks by uploading or creating a template file. A stack is a compilation of resources grouped into one collective unit. The template file describes the stack, which contains AWS and Zscaler Cloud Connector resources, and deploys all resources together as a group. To learn more, refer to the AWS product documentation.

Perform one of the following procedures to create a stack and deploy the Cloud Connector:
Create a stack in the AWS CloudFormation console.
Create a stack in the AWS CloudFormation console with Autoscaling (Advanced Deployment).

Route workload traffic to the Cloud Connector.

After you finish deploying the Cloud Connector from the AWS CloudFormation console, modify your route table and associated subnet to ensure that traffic is sent from the private workload subnet to Cloud Connector. By default, traffic is going out of the workload subnet.

Log in to the Amazon VPC console.
From the navigation pane, select Route Tables.
Locate and click your workload route table.
Click Edit routes.
Click Add route.
For the Destination, enter 0.0.0.0/0.
For the Target, do one of the following:
For non-GWLB-based deployments, select Network Interface and choose the ENI associated with your Cloud Connector service interface instance.
For GWLB-based deployments, select Gateway Load Balancer Endpoint and choose the GWLB Endpoint ID associated with your Gateway Load Balancer.
Click Save Changes.

Managing the Cloud Connector

You can manage the Cloud Connector from the Zscaler Admin Console. A deployed Cloud Connector is displayed on the dashboard. The Cloud & Branch Connector Monitoring page provides information on the name, group, location, geolocation (shown below), and status of the Cloud Connector AMIs deployed in your cloud account.

See image.

After verifying deployment, you can configure the following policies:

Traffic Forwarding
Log and Control Forwarding
DNS Control

If you face any issues with your Cloud Connector deployment, see Troubleshooting Cloud Connector with Amazon Web Services.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Deploying Zscaler Cloud Connector with Amazon Web Services
Understanding Cloud Connector Deployments with Amazon Web Services Autoscaling Groups
Using Sublocation Scopes to Group Cloud Connector Workloads in Amazon Web Services
