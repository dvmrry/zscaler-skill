# Configuring Zscaler Client Connector to Collect Hostnames

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-zscaler-client-connector-collect-hostnames
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1333351, revision 3240844

---

You can enable Zscaler Client Connector to collect the hostname information from supported devices and store it in the Zscaler Admin Console database. This information is included in the CSV file when you export device fingerprint for the enrolled devices. To learn more, see About Enrolled Devices.
Zscaler Client Connector no longer collects the full machine hostname on devices running iOS 16 and later.
To enable or disable the app from collecting information:
- From the navigation menu, go to Infrastructure > Advanced Settings > User Privacy.
- Select the Collect Machine Hostname Information option.
- Click Save.
To see the collected hostname information, go to the Enrolled Devices page. For any enrolled device, view the Machine Hostname field. To learn more, see Viewing Device Fingerprint for an Enrolled Device.
