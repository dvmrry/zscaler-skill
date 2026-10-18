# Registering an Endpoint in Amazon Web Services

**Source:** https://help.zscaler.com/cloud-branch-connector/registering-endpoint-amazon-web-services
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1519146, revision 3243131

---

Zero Trust Gateways allow you to register an endpoint in Amazon Web Services (AWS). Registering your endpoint with the Zscaler service allows you to route and secure your traffic to the Zero Trust Exchange (ZTE).
After you add an AWS Zero Trust Gateway, you can use the service address to register the endpoint.
- 1. Copy and save the endpoint service name.
- To copy the endpoint service name:
  - In the Zscaler Admin Console, from the navigation menu, go to **Zero Trust Cloud** > **Zero Trust Gateway** > **AWS**.
  - On the **AWS** Zero Trust Gateway page, select your gateway by clicking its name.
  - See image.
  - On the **Dashboard** tab, copy and save the **Endpoint Service Name**. You use it when creating an endpoint in AWS.
  - See image.
- 2. Register an endpoint.
- To register an endpoint:
  - Sign in to the AWS Management Console.
  - Click **VPC**. The **VPC dashboard** appears.
  - Endpoints are deployed in the virtual private cloud (VPC). If you want to use centralized deployment, use the transit gateway. To learn more, refer to the AWS documentation.
  - On the **VPC dashboard**, from the left-side navigation, under **PrivateLink and Lattice**, select **Endpoints**.
  - See image.
  - On the **Endpoints** page, click **Create endpoint**.
  - See image.
  - On the **Create endpoint** page, configure the following:
    - In the **Endpoint settings** section:
      - **Name tag**: Enter a name for your endpoint.
      - **Type**: Select **Endpoint services that use NLBs and GWLBs**.
      - See image.
    - In the **Services** section:
      - **Service name**: Paste the **Endpoint Service Name** from the Zscaler Admin Console and click **Verify service**.
      - **Service Region**: Leave this setting unchanged.
      - See image.
    - In the **Network settings** section, under **VPC**, from the **Select a VPC** drop-down menu, select the VPC where you want to deploy the endpoint.
    - See image.
    - In the **Subnets** section, select the **Availability Zone** where you want to deploy the endpoint by selecting the checkbox next to the name of the **Availability Zone**.
    - See image.
    - In the **Tags** section, leave the settings unchanged.
    - Click **Create endpoint**.
- The endpoint is deployed.
- 3. Configure the route table.
- After deploying the endpoint, you must route traffic through it. Traffic passes through the Zero Trust Gateway. To configure the route table, navigate to the **Route tables** page and click **Edit routes** to configure the following:
  - **Destination**: (Optional) Enter an IP address.
  - **Target**: From the drop-down menu, select **Gateway Load Balancer Endpoint**. Under the **Gateway Load Balancer Endpoint** field, in the drop-down menu, select your endpoint.
- Click **Save changes**.
- See image.
