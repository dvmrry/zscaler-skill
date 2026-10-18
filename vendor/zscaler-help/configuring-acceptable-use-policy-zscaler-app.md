# Configuring an Acceptable Use Policy for Zscaler Client Connector

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-acceptable-use-policy-zscaler-app
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1285421, revision 3243862

---

You can create an Acceptable Use Policy (AUP) that your users must accept before they can connect to the internet or access your organization's internal resources from devices protected by Zscaler Client Connector.
To configure an AUP:
- From the navigation menu, go to Administration > End User Notification > Client Connector.
- On the Acceptable Use Policy (AUP) Settings tab:
  - Configure AUP Frequency: Choose how often Zscaler Client Connector displays the AUP.
    - Never
    - After User Enrollment
    - Daily
    - Weekly
    - Custom
  - Custom Days: This field only appears if you select Custom as the AUP frequency. Enter any value from 1 to 180 days.
  - Configure AUP Message: Enter or copy and paste your organization's AUP into the field. You can enter static HTML tags as well as images, as long as the image files are accessible from the internet.
  - Preview AUP Message: Click to view the AUP as your users will see it.
- Click Save.
To learn more about other Zscaler Client Connector Notifications features, see About Zscaler Client Connector Notifications.
