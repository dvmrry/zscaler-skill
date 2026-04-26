# Configuring Firefox Integration for Zscaler Client Connector

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-firefox-integration-zscaler-client-connector
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Zscaler Client Connector Support Settings 
Endpoint Integration 
Configuring Firefox Integration for Zscaler Client Connector
Client Connector
Configuring Firefox Integration for Zscaler Client Connector
Ask Zscaler

You can enable or disable Firefox integration for Zscaler Client Connector. If enabled, Zscaler Client Connector attempts to configure Firefox automatically to follow Zscaler settings for macOS and Windows devices by enabling the "Use system proxy settings" feature in Firefox. If disabled, Zscaler Client Connector ignores Firefox and does not overwrite or create any configurations.

When enabled, Zscaler Client Connector overrides the Firefox proxy settings and prevents the user from changing them. Firefox integration does not support Mozilla Developer Preview or Firefox downloaded from the Microsoft Store.

To configure Firefox integration:

In the Zscaler Client Connector Portal, go to Administration.
In the left-side navigation, go to Client Connector Support.
On the Endpoint Integration tab, select Enable Firefox Integration.

If you disable Enable Firefox Integration, ensure to add Zscaler proxy settings to your Firefox configuration.

Click Save.

If you choose not to use Firefox integration for Zscaler Client Connector, then you must manually install the appropriate signing certificates from Firefox.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About the Endpoint Integration Page
Configuring Firefox Integration for Zscaler Client Connector
Configuring the Port for Zscaler Client Connector to Listen On
Adding a VPN-Trusted Network Adapter Name
Adding a VPN Service Name
Configuring the Zscaler Client Connector Synthetic IP Range
