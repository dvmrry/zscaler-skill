# Configuring User Access to the Restart and Repair Options for Zscaler Client Connector

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-user-access-restart-and-repair-options-zscaler-client-connector
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1340876, revision 3240830

---

Users can troubleshoot the app by clicking Restart Service or Repair App from the More window of Zscaler Client Connector.
The Repair App feature is only available for Windows.
Restarting Zscaler Client Connector doesn't impact security enforcement. However, you can click Restart Service only once within a 30-second period for Zscaler Client Connector version 3.8 and later for Android and Zscaler Client Connector version 3.8 and later for Android on ChromeOS. When users select Repair App, the app attempts to repair itself by reinstalling app drives and services.
Using Restart Service or Repair App causes Zscaler Client Connector to fail-open briefly. Disable access if this is not ideal.
To configure user access to these options:
- From the navigation menu, go to Infrastructure > Advanced Settings > App Supportability.
- Click Enable End User to Restart Services and Repair App.
- Click Save.
