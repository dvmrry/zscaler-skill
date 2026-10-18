# Adding Virtual Service Edge Instances for Internet & SaaS

**Source:** https://help.zscaler.com/zia/adding-virtual-service-edge-instances-internet-saas
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398916, revision 3242174

---

Adding a Virtual Service Edge instance for Internet & SaaS (ZIA) is one of the tasks you must complete when deploying Virtual Service Edge clusters. To learn more, see Configuring Virtual Service Edge Clusters.
To add a Virtual Service Edge instance:
- From the navigation menu, go to **Infrastructure** > **Internet & SaaS** > **Virtual Service Edges**.
- Click **Add Virtual Service Edge**.
- The **Add Virtual Service Edge** window appears.
- In the **Add Virtual Service Edge** window:
  - **Name**: Enter a name for the Virtual Service Edge.
  - **Status**: Choose to enable or disable the Virtual Service Edge. The default status is **Enabled**.
  - **Deployment Status**: Choose either **In Production** or **Trial**. The default deployment status is **In Production**.
  - **In Production** represents Virtual Service Edge instances deployed for production purposes, and **Trial** represents Virtual Service Edge instances deployed for internal uses or testing purposes.
  - The trial Virtual Service Edge instances are upgraded first during a maintenance window, followed by production Virtual Service Edge instances. This setting does not affect the behavior, functionality, or performance of the Virtual Service Edge instance, and it helps Zscaler prioritize production Virtual Service Edge instances over trial if an issue or a bug affects Virtual Service Edge instances.
  - **Your Used Virtual Service Edges**: You can see the total number of Virtual Service Edges, as well as the available number of subscriptions. You can't modify this field.
  - **Proxy IP Address**: Enter the IP address to which you’ll forward the traffic. All user and server workload traffic is forwarded to the proxy IP address of the Virtual Service Edge. If the Virtual Service Edge has to receive and service traffic from users or workloads over the internet, ensure that this IP address has access to the internet as well as users.
  - **Subnet Mask**: Enter the corresponding subnet mask.
  - **Default Gateway**: Enter the IP address of the default gateway to the internet.
  - **Load Balancer IP Address**: Appears only when **Cluster** is selected as the deployment mode. Enter the IP address of the load balancer.
  - **Deployment Mode**: Select either **Cluster** or **Standalone** if you have the VMware ESXi platform. Otherwise, select only **Standalone**.
  - If clustering fault tolerance is required, ensure to have an external load balancer for **Standalone** deployment.
  - **IPSec Local Termination**: Enable this option to terminate IPSec traffic from the client at the Virtual Service Edge node. By default, this option is disabled.
  - If you select the deployment mode as **Cluster**, this option becomes read-only and displays the actual status of IPSec Local Termination of the Virtual Service Edge in the cluster. If you want to change the IPSec Local Termination status of the Virtual Service Edge in a cluster, you can do it from the **Infrastructure** > **Internet & SaaS** > **Virtual Service Edges** > **Virtual Service Edge** **Clusters** page. To learn more, see Adding Virtual Service Edge Clusters.
  - See image.
  - **Zscaler Initiated On-Demand Support Tunnel**: Enable this option to allow Zscaler to establish a support tunnel whenever required. This option is disabled by default.
  - If this option is enabled, you cannot establish a support tunnel from the Zscaler Admin Console. Also, the **Establish Support Tunnel** option is greyed out.
  - **Establish Support Tunnel**: Enable this option to allow the service to establish a support tunnel for Zscaler Support to access the Virtual Service Edge. This option is disabled by default.
  - This option is available only when the **Zscaler Initiated On-Demand Support Tunnel** is disabled.
  - **Virtual Service Edge ID**: You can see the Virtual Service Edge ID used by Zscaler to identify and access the Virtual Service Edge using the established support tunnel.
  - See image.
- Click **Save**.
- Activate the change.
