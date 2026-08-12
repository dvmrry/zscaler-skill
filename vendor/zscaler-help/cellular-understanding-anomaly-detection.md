# Understanding Anomaly Detection

**Source:** https://help.zscaler.com/zscaler-cellular/understanding-anomaly-detection
**Captured:** 2026-08-12 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

Zscaler Cellular anomaly detection uses metadata, geolocation insight, and
network-usage patterns to monitor tracked devices and detect movement outside a
defined geofence.

Administrators define a geofence and tracked SIM-enabled devices in a **SIM
Location Group**, link the group to a policy, and enable the policy. The
service then tracks device activity and flags movement outside the permitted
boundary as a violation.

The **Anomaly Dashboard** exposes policy configuration and violations. SIM
Location Groups are the basis for geofence anomaly policies; the article does
not describe non-geofence anomaly types.
