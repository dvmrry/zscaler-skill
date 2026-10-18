# About Private Access App Connectors in Deception

**Source:** https://help.zscaler.com/deception/about-zpa-app-connector-deception
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1542544, revision 3226060

---

Private Access (ZPA) App Connectors are hosted by Zscaler and are used to connect to your Zero Trust Exchange (ZTE) environment. In the Zscaler Deception Admin Portal, App Connectors are configured when creating Zero Trust Network decoys. To learn more, see About App Connectors.
App Connectors provide the following benefits and enable you to:
- Create a secure interface between the Decoy Connector and the Zero Trust Exchange (ZTE) via Private Access.
- Deploy Zero Trust Network decoys in the Zero Trust Exchange (ZTE) environment.
You can view the details of the App Connector on the ZPA App Connectors page (Settings > Topology > ZPA App Connectors). On this page, you can do the following:
- View a list of all deployed App Connectors. For each deployed App Connector, you can see:
  - Name: The name of the App Connector. The following icons indicate the connection status of the App Connector with the Deception Admin Portal:
    - : Active or connected to the Deception Admin Portal.
    - : Inactive or not connected to the Deception Admin Portal.
    - : Not connected to an aggregator.
    - : Update in progress or update failed.
  - Version: The version of the Decoy Connector.
  - ZPA Version: The version of the App Connector software.
  - ZPA Manager Version: The version of the current App Connector Manager software. To learn more, see Understanding the Manager Software.
  - Last Connected Time: The time when the Decoy Connector was last connected to the Deception Admin Portal.
  - ZPA App Connector Last Connected Time: The time when the App Connector was last connected to the Private Access cloud.
- Reboot an App Connector.
- View update logs and download the debug logs for an App Connector.
