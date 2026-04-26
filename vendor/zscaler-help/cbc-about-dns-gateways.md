# About DNS Gateways

**Source:** https://help.zscaler.com/cloud-branch-connector/about-dns-gateways
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Administration 
Forwarding Methods 
About DNS Gateways
Cloud & Branch Connector
About DNS Gateways
Ask Zscaler

DNS gateways provide the ability to redirect the DNS request received by the Cloud or Branch Connector to specific DNS servers.

DNS Gateways provide the following benefits and enable you to:

Ensure the high availability of the DNS service used by your organization by configuring primary and secondary DNS services.
Ensure compliance with regulatory and contractual requirements like employing Protective DNS service.

To use DNS gateway and policy functionalities, design your network where workloads, servers, and endpoints are deployed to route DNS queries through the Cloud or Branch Connector.

About the DNS Gateway Page

On the DNS Gateway page (Administration > Gateways), you can do the following:

Add a DNS gateway.
View a list of all gateways. For each gateway, you can view:
Gateway Name: The name of the gateway. You can sort this column.
Primary Proxy: The primary proxy for the gateway.
Secondary Proxy: The secondary proxy for the gateway.
Failure Behavior: The failure behavior for the gateway (i.e., Return error response or Forward to Original DNS Server).

View a list of predefined gateways created by Zscaler. They are disabled by default, but you can enable them:

LAN CTR: The LAN Customer Trusted Resolver (CTR) has DNS servers configured in the LAN section of the branch configuration template.
WAN CTR: The WAN CTR has DNS servers, which are either manually configured or received by DHCP protocol, configured in the WAN section of the branch configuration template.

Predefined gateways are only applicable to hardware devices deployed in gateway mode.

Edit a DNS gateway. You cannot edit predefined DNS gateways.

Delete a DNS gateway.

You cannot delete the default DNS gateway.

View a DNS gateway and its details.
Modify the table and its columns.
Search for a gateway.
Go to the ZIA Gateway page.
Go to the Log and Control Gateway page.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About DNS Gateways
Configuring a DNS Gateway
About Zscaler Internet Access Gateways
Configuring a ZIA Gateway
About Log and Control Gateways
Configuring a Log and Control Gateway
