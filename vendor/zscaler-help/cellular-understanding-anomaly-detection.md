# Understanding Anomaly Detection

**Source:** https://help.zscaler.com/zscaler-cellular/understanding-anomaly-detection
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1532771, revision 3188749

---

The anomaly detection leverages metadata, geolocation insights, and network usage patterns to continuously monitor tracked devices and detect when they move beyond a defined geofence area. This detection framework plays a critical role in identifying potential theft, unauthorized movements, or breaches of safety protocols. Administrators configure SIM Location Groups to define geofences within each group. After being linked to a policy and enabled, Zscaler Cellular tracks the device's activity in real time and flags any movement outside the permitted boundary as a violation. This strengthens security, improves operational reliability, and ensures compliance across the connected environment.
You can help detect anomalies using the following features:
- SIM Location Groups
- Administrators set up SIM Location Groups by defining a specific geofence area for each group and assigning the number of SIM-enabled devices to be monitored within that boundary. These groups form the basis for network anomaly detection policies, enabling the system to track device activity and flag any unauthorized movements or violations. You can view groups on the SIM Location Groups page.
- See image
- To learn more, see About the SIM Location Groups.
- Anomaly Dashboard
- The Anomaly Dashboard provides detailed visibility into policy configurations. It detects anomalies when devices operate beyond the designated geofence area, signaling breaches of active policies. These policies are based on predefined SIM Location Groups, enabling efficient threat detection and streamlined operational control.
- See image.
- To learn more, see Viewing the Anomaly Dashboard.
