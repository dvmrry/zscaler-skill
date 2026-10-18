# Configuring Firefox Integration for Zscaler Client Connector

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-firefox-integration-zscaler-client-connector
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1333331, revision 3240857

---

You can enable or disable Firefox integration for Zscaler Client Connector. If enabled, Zscaler Client Connector attempts to configure Firefox automatically to follow Zscaler settings for macOS and Windows devices by enabling the "Use system proxy settings" feature in Firefox. If disabled, Zscaler Client Connector ignores Firefox and does not overwrite or create any configurations.
When enabled, Zscaler Client Connector overrides the Firefox proxy settings and prevents the user from changing them. Firefox integration does not support Mozilla Developer Preview or Firefox downloaded from the Microsoft Store.
To configure Firefox integration:
- From the navigation menu, go to Infrastructure > Advanced Settings > Endpoint Configuration.
- On the Endpoint Integration tab, select Enable Firefox Integration.
- If you disable Enable Firefox Integration, ensure to add Zscaler proxy settings to your Firefox configuration.
- Click Save.
If you choose not to use Firefox integration for Zscaler Client Connector, then you must manually install the appropriate signing certificates from Firefox.
