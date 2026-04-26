# Configuring the Port for Zscaler Client Connector to Listen On

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-port-zscaler-app-listen
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Zscaler Client Connector Support Settings 
Endpoint Integration 
Configuring the Port for Zscaler Client Connector to Listen On
Client Connector
Configuring the Port for Zscaler Client Connector to Listen On
Ask Zscaler

By default, Zscaler Client Connector listens on port 9000 for ZIA and port 9010 for ZPA via a TCP protocol. Zscaler Client Connector automatically listens to the next port if another application is listening to the port. However, if Zscaler Client Connector starts before the other application and begins listening on port 9000 for ZIA or port 9010 for ZPA, the other application can fail.

In order to avoid port conflicts with other applications, you can configure the port for Zscaler Client Connector to listen on.

You must configure any local proxy PAC file to point to the configured port.

To configure the port:

In the Zscaler Client Connector Portal, go to Administration.
From the menu on the left, go to Client Connector Support.
Click on the Endpoint Integration tab.
In the Zscaler Client Connector Listen Port field, enter the number for any port ranging from 1024 to 65534.

Click Save.

When a device enrolls and downloads the policy, the listening port is downloaded. Zscaler Client Connector listens to this port the next time Zscaler Client Connector, the Zscaler service, or the device itself restarts. Zscaler Client Connector does not switch ports while it is running.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About the Endpoint Integration Page
Configuring Firefox Integration for Zscaler Client Connector
Configuring the Port for Zscaler Client Connector to Listen On
Adding a VPN-Trusted Network Adapter Name
Adding a VPN Service Name
Configuring the Zscaler Client Connector Synthetic IP Range
