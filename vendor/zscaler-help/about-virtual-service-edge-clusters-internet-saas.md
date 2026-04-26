# About Virtual Service Edge Clusters for Internet & SaaS

**Source:** https://help.zscaler.com/zia/about-virtual-service-edge-clusters-internet-saas
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Watch a video about Virtual Service Edge Clusters for Internet & SaaS (ZIA) (shows legacy UI).

For production environments, Virtual Service Edge is deployed in a cluster. A cluster requires at least two Virtual Service Edges for active-active redundancy and load balancing. Each Virtual Service Edge cluster can contain a maximum of 16 Virtual Service Edge instances. Each Virtual Service Edge in a cluster requires a separate Virtual Service Edge subscription.

Each Virtual Service Edge has a load balancer (LB) bundled in. The load balancer is specifically designed to distribute user traffic evenly across the Virtual Service Edges.

Zscaler does not recommend using external load balancers. However, if your organization must use an external load balancer, see Using an External Load Balancer with Virtual Service Edges.

To ensure high availability, the Zscaler load balancers use the Common Address Redundancy Protocol (CARP) for active-passive fault tolerance. All Virtual Service Edge instances in the cluster are active, and one load balancer instance is active at a time. The active load balancer receives ingress traffic through the cluster IP address and directs the traffic to the appropriate Virtual Service Edge. If the active load balancer fails, then the passive load balancer automatically takes over, ensuring no disruption in service. Virtual Service Edges also run in Direct Server Return (DSR) mode. DSR allows the requests to go through the load balancer to the Virtual Service Edge, but the response flows from the Virtual Service Edge to the user, skipping the load balancer on the return.

For evaluation purposes with test traffic, you can configure a Virtual Service Edge in standalone mode, which does not support failover. Zscaler does not support standalone Virtual Service Edges for production environments with live user traffic.

## About the Virtual Service Edge Clusters Page

On the Virtual Service Edge Clusters page (Infrastructure > Internet & SaaS > Traffic Forwarding > Virtual Service Edges > Virtual Service Edge Clusters), you can:

- Add a Virtual Service Edge Cluster.
- Search for a Virtual Service Edge cluster.
- View a list of all Virtual Service Edge clusters that were configured for your organization. For each Virtual Service Edge cluster, you can see the following information:
  - Name: The name of the Virtual Service Edge cluster. You can sort this column.
  - Status: Displays whether the Virtual Service Edge cluster is enabled or disabled. You can sort this column.
  - Virtual Service Edges: The Virtual Service Edge instances that are included in the cluster. You can sort this column.
  - Cluster IP: The cluster IP address. You can sort this column.
  - IPSec Local Termination: The status of IPSec local termination for the Virtual Service Edge cluster. You can sort this column.
- Modify the table and its columns.
- Edit a Virtual Service Edge Cluster.
- Go to the Virtual Service Edges page to manage and configure Virtual Service Edges.
