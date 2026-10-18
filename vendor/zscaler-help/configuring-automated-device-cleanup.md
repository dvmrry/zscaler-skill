# Configuring Automated Device Cleanup

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-automated-device-cleanup
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1296741, revision 3243240

---

Zscaler Client Connector allows you to configure automatic device cleanup of old, inactive, and removed devices.
After modifying settings, it can take up to a week for Enrolled Devices to reflect changes.
To configure automatic device cleanup:
- From the navigation menu, go to Infrastructure > Advanced Settings > Device Clean Up.
- Configure the following:
  - Force Remove Oldest Device After User Enrolls: Select the threshold number of devices. If a user attempts to enroll a device after reaching the threshold number, Zscaler Client Connector force removes the oldest device. The default setting is Restrict, which means no devices are removed. An error is displayed when a user tries to enroll more than 16 devices.
  - Contact Zscaler Client Connector to change the minimum threshold to 1 device.
  - Automatically Force Remove Inactive Devices After: Select the period after which Zscaler Client Connector automatically removes a device if it doesn't connect to Internet & SaaS in the defined period and becomes inactive. Select from the following intervals: 30, 60, 90, 120, 150, 180 days, or Never. The default setting is Never. A device becomes inactive when the most recent KeepAlive Timestamp is older than the defined period.
  - Permanently Delete Removed Devices After: Select the period after which a device is permanently removed from the Zscaler Admin Console after being in the Removed or Unregistered state. Select from the following intervals: 60, 90, 120, 150, or 180 days. Zscaler Client Connector uses the device’s Last Deregistration Timestamp to determine how long the device was in the Removed or Unregistered state since the time it was deregistered.
  - Removing the registration from the Zscaler Admin Console doesn’t remove Zscaler Client Connector from the device.
- Click Save.
