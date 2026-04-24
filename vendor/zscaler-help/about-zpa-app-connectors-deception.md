# About ZPA App Connectors in Deception

**Source:** https://help.zscaler.com/deception/about-zpa-app-connector-deception
**Captured:** 2026-04-24 via Playwright MCP.

---

ZPA App Connectors are hosted by Zscaler and are used to connect to your Zero Trust Exchange (ZTE) environment. In the Zscaler Deception Admin Portal, App Connectors are configured when creating **Zero Trust Network decoys**.

## Benefits

- Create a secure interface between the **Decoy Connector** and the Zero Trust Exchange (ZTE) via Zscaler Private Access (ZPA).
- Deploy Zero Trust Network decoys in the Zero Trust Exchange (ZTE) environment.

## ZPA App Connectors Page (Settings > Topology > ZPA App Connectors)

View a list of all deployed App Connectors. For each deployed App Connector:

- **Name** of the App Connector. Connection-status icons:
  - Active or connected to the Deception Admin Portal.
  - Inactive or not connected to the Deception Admin Portal.
  - Not connected to an aggregator.
  - Update in progress or update failed.
- **Version:** the version of the Decoy Connector.
- **ZPA Manager Version:** the version of the current App Connector Manager software.
- **Last Connected Time:** when the Decoy Connector was last connected to the Deception Admin Portal.
- **ZPA App Connector Last Connected Time:** when the App Connector was last connected to the ZPA cloud.

Available actions:

- Reboot an App Connector.
- View update logs and download the debug logs for an App Connector.
