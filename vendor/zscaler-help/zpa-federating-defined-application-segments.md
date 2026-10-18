# Federating Defined Application Segments

**Source:** https://help.zscaler.com/zpa/federating-defined-application-segments
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540798, revision 3238025

---

To federate an application segment and add partners for Business-to-Business (B2B) Federation:
- From the navigation menu, go to **Private Access** > **Private Applications** > **Defined Application Segments**.
- Locate the application segment you want to federate in the table, and then click the **Federate Application** icon ().
The **Federate Applications** window appears.
- In the **Federate Applications** window:
  - **Partners**: Select one or more partners to share applications with. If you do not want to share an application segment with a partner, then deselect the partner from the drop-down menu.
  - After deselecting the partner and saving, the end users from the guest partner side will immediately lose access to all applications.
  - **Add Partner**: Go to the Federated Partners page to add partners or manage federated partners that have established a trusted relationship with each other.
- Click **Save**.
Applications using IP addresses (e.g., 192.168.1.10) cannot be federated due to potential IP address overlap and routing conflicts in the guest partner's network. Additionally, the following application segment configurations must be disabled to federate an application segment:
- Source IP Anchor
- Double Encryption
- Bypass
- Bypass during Reauthentication
- ZIA Inspection
- AppProtection
To learn more, see Configuring Defined Application Segments.
