# Configuring Proxy Chaining

**Source:** https://help.zscaler.com/zia/configuring-proxy-chaining
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398851, revision 3243774

---

Proxy chaining involves forwarding traffic from one proxy server to another. This method leverages your existing proxy servers, with no additional changes to the network. It's a quick and easy way to forward your traffic to the Zscaler service from an existing on-premises proxy. Though Zscaler supports proxy chaining, it is not recommended as a long-term solution in production environments. Multiple proxies add latency and proxy servers that support failover support only manual failover.
To configure proxy chaining:
- Ensure that your organization has been provisioned and send the IP address of your endpoint to Zscaler Support (or to your Zscaler representative if you are evaluating the service).
- Log in to the Zscaler Admin Console and add your gateway location.
- You need to provide Zscaler with the public IP addresses of your internet egress points. This “registration” process enforces the uniqueness of IP addresses, so that an organization does not inadvertently use another organization’s IP addresses. You can send the IP addresses to Zscaler Support (or to your Zscaler representative if you are evaluating the service). After your IP addresses have been provisioned on the service, log in to the Zscaler Admin Console and define your organization’s gateway location as follows:
  - Go to **Infrastructure** > **Locations** > **Legacy Locations**.
  - Click **Add Location**.
  - Enter general information about the location:
    - Enter its **Name.**
    - Choose the **Country**.
    - Enter a **City**/**State/Province**, if applicable.
    - Choose the **Time Zone** of the location.
    - When you specify the location in a policy, the service applies the policy according to the location's time zone. For example, if a Cloud App Control policy blocks posting to Facebook between 8 AM and 5 PM, and the rule is applied to locations in Spain and California, users at each location are blocked during their respective daytime hours.
  - Choose the IP addresses for the location:
    - The **Static IP Addresses and GRE Tunnels** drop-down menu displays the IP addresses that you sent to Zscaler when it was provisioned for your organization. Choose IP addresses for the location.
  - Optionally, enable the other features on this page.
  - Click **Save** and activate the change.
- Some proxy servers can insert an X-Forwarded-For (XFF) header into outbound HTTP requests. An XFF header identifies the IP address of the original client that sent the HTTP request through the proxy server, which can then be leveraged by the Zscaler service to identify the client’s sublocation. So, using the XFF headers, the service can apply the appropriate sublocation policy to the transaction. Also, if Surrogate IP is enabled on the location or sublocation, the service can apply the appropriate user policy to the transaction.
- When the service forwards the traffic to its destination, it removes this original XFF header and replaces it with an XFF header that contains the IP address of the client gateway (the organization’s public IP address), ensuring that an organization's internal IP addresses are never exposed to the external world.
- Furthermore, when the Zscaler service logs a transaction, it includes the source IP address, which is always the public IP address of the firewall or edge router that sent the traffic to the service. However, if you want the Zscaler service to log the source IP address that is in the XFF header, you can go to the Advanced Settings page of the Zscaler Admin Console and enable **Internal IP Logging.**
- Configure your proxy server traffic to the Zscaler service.
Refer to your server’s documentation for instructions on configuring your proxy server to forward traffic to the Zscaler service. You can also refer to the following configuration examples:
- Configuration Example: Microsoft ISA Server
- The following example illustrates how to configure a Microsoft ISA server to redirect web traffic upstream to a Public Service Edge for Internet & SaaS (ZIA). It is based on the deployment of a simple single network adapter. Client workstations on the internal network have their browsers configured to proxy to the ISA server.
- This example assumes you have configured the rule to permit web access from the internal network to the internet. This rule (number 1) allows both the HTTP and HTTPS traffic from the internal network to the external network for all users.
- See image.
- To configure web chaining on the Microsoft ISA Server:
  - Go to the **Configuration** > **Networks** menu.
  - Edit **Default Rule** or create a new rule higher up in the Web chaining policy.
  - On the rule’s **Action** tab, under the **Process requests by** section, select **Redirecting them to a specified upstream server**.
  - Click **Settings**, and specify the **Server** field as gateway.<cloud_name>.net and enter **80** in the **Port** and **SSL Port** fields.
  - Replace <cloud_name> with the name of the cloud on which your organization is provisioned. In this example, the server is .gateway.zscaler.net. To learn your cloud name, see Understanding Zscaler Cloud Names.
  - On the rule’s **Action** tab, select the **Backup route** as **Upstream proxy server**.
  - Click **Settings**, and specify the **Server** as secondary.gateway.<cloud_name>.net and enter **80** in the **Port** and **SSL Port** fields.
  - Replace <cloud_name> with the name of the cloud on which your organization is provisioned. In this example, the server is secondary.gateway.zscaler.net. To learn your cloud name, see Understanding Zscaler Cloud Names.
- All proxy connections to the Microsoft ISA Server are forwarded to a resilient pair of nodes within the Zscaler service.
- You must specify gateway.<cloud_name>.net and secondary.gateway.<cloud_name>.net as the primary and secondary proxy servers, respectively, to ensure fault tolerance. Zscaler does not support configurations with just one proxy server.
- Configuration Example: Squid Proxy Server
- The following is a sample configuration for proxy chaining using a SQUID proxy server. The example specifies gateway.zscaler.net and secondary.gateway.zscaler.net so the Zscaler service uses its Geolocation technology to forward the traffic to the nearest Public Service Edge.
- # ACL that defines the source IPs to match and redirect on acl zscaler src 205.155.242.43/32 acl zscaler src 205.155.242.44/30 acl zscaler src 205.155.243.76/32 # define the caches, user GeoIP cache_peer gateway.zscaler.net parent 80 0 no-query weight=2 cache_peer secondary.gateway.zscaler.net parent 80 0 no-query weight=1 # chain traffic matching the zscaler ACL, all other goes direct cache_peer_access gateway.zscaler.net allow zscaler cache_peer_access gateway.zscaler.net deny all cache_peer_access secondary.gateway.zscaler.net allow zscaler cache_peer_access secondary.gateway.zscaler.net deny all
- The following is an example that explicitly forwards traffic to one of three different gateways in a failover scenario. The ACL is defined by the incoming port on the SQUID server.
- # listen on normal HTTP/HTTPS ports http_port 80 http_port 443 # ACL that defines the source IPs to match and redirect on # For this example, match on all inbound traffic acl zscaler 0.0.0.0/0.0.0.0 # define the caches cache_peer fmt1.sme.zscaler.net parent 80 0 no-query weight=3 cache_peer ord1.sme.zscaler.net parent 80 0 no-query weight=2 cache_peer atl1.sme.zscaler.net parent 80 0 no-query weight=1 # chain traffic matching the zscaler ACL, all other goes direct cache_peer_access fmt1.sme.zscaler.net allow zscaler cache_peer_access fmt1.sme.zscaler.net deny all cache_peer_access ord1.sme.zscaler.net allow zscaler cache_peer_access ord1.sme.zscaler.net deny all cache_peer_access atl1.sme.zscaler.net allow zscaler cache_peer_access atl1.sme.zscaler.net deny all
