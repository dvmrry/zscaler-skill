# Understanding PAC Files

**Source:** https://help.zscaler.com/zia/understanding-pac-file
**Captured:** 2026-04-24 via Playwright MCP.

---

A proxy auto-configuration (PAC) file is a text file that instructs a browser to forward traffic to a proxy server instead of directly to the destination server. It contains JavaScript that specifies the proxy server and, optionally, additional parameters that specify when and under what circumstances a browser forwards traffic to the proxy server. For example, a PAC file can specify on what days of the week or what hours of the day traffic is sent to a proxy, or for which domains and URLs traffic is not sent to a proxy.

All major browsers support PAC files. Browsers simply require the address of the PAC file so they can fetch the file from the specified address and execute the JavaScript in the file. PAC files can be hosted on a workstation, on an internal web server, or on a server outside the corporate network. The Zscaler service hosts a default PAC file that uses geolocation technology to forward traffic to the nearest ZIA Public Service Edge. You can also upload custom PAC files to the Zscaler service.

In the following diagram, the URL of the Zscaler default PAC file is configured on the user's browser. When the user opens the browser:

1. The browser sends a request for the default PAC file.
2. The Zscaler service uses geolocation technology to find the Service Edges that are closest to the user.
3. The service inserts the Service Edge IP addresses in the PAC file that is returned to the browser.
4. The browser follows the instructions in the PAC file and forwards its web traffic to the primary Service Edge.

Because it is the browser itself that is configured to retrieve the PAC file and forward traffic accordingly, traffic is forwarded to the Zscaler service, regardless of the user's network.

Zscaler recommends that organizations use a combination of tunneling, PAC files, Surrogate IP, and Zscaler Client Connector to forward traffic to the Zscaler service. If your organization has an internal router, switch on the firewall that supports GRE and its egress port has a static address, Zscaler recommends that you configure a GRE tunnel to forward all outbound traffic from your location to the Zscaler service. If your router or firewall does not support GRE or if you use dynamic IP addresses, you can use an IPSec VPN tunnel instead.

IPSec tunnels have additional processing overhead on your equipment, compared to GRE tunnels. Zscaler also recommends that organizations deploy mechanisms such as IP SLA to monitor tunnel health and enable fast failover. In addition to the GRE or IPSec VPN tunnel, Zscaler recommends that you install a PAC file for each user to ensure coverage outside the corporate network.
