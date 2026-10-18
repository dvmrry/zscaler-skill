# Adding Virtual Service Edge Clusters for Internet & SaaS

**Source:** https://help.zscaler.com/zia/adding-virtual-service-edge-clusters-internet-saas
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398936, revision 3242180

---

Adding a Virtual Service Edge cluster for Internet & SaaS (ZIA) is one of the tasks you must complete when deploying Virtual Service Edge clusters. To learn more, see Configuring Virtual Service Edge Clusters.
To add a Virtual Service Edge cluster:
- From the navigation menu, go to Infrastructure > Internet & SaaS > Virtual Service Edges.
- Click the Virtual Service Edge Clusters tab.
- Click Add Virtual Service Edge Cluster.
- The Add Virtual Service Edge Cluster window appears.
- In the Add Virtual Service Edge Cluster window:
  - Name: Enter a name for the Virtual Service Edge cluster.
  - Status: Choose to enable or disable the Virtual Service Edge cluster. The default status is Enabled.
  - Virtual Service Edges: Select the Virtual Service Edge instances you want to include in the cluster. A Virtual Service Edge cluster must contain at least two Virtual Service Edge instances.
  - IPSec Local Termination: Enable this option to terminate IPSec traffic from the client at selected Virtual Service Edge instances for the Virtual Service Edge cluster. By default, this option is disabled.
  - Cluster IP Address: Enter the Virtual Service Edge cluster IP address. In a Virtual Service Edge cluster, it provides fault tolerance and is used to listen for user traffic. This interface doesn't explicitly get an IP address. The cluster IP address must be in the same VLAN as the proxy and load balancer IP addresses.
  - Subnet Mask: Enter the corresponding subnet mask.
  - Default Gateway: Enter the IP address of the default gateway to the internet.
- See image.
- Ensure that the Virtual Service Edge cluster, proxy, load balancer, and gateway IP addresses are in the same subnet. To learn more, see Adding Virtual Service Edge Instances for Internet & SaaS.
- Click Save and activate the change.
