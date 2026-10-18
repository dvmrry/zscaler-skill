# Configuring User Access to Support Options for Zscaler Client Connector

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-user-access-support-options-zscaler-client-connector
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1353981, revision 3240827

---

From the App Supportability page, you can configure your users’ access to support options for Zscaler Client Connector. Your users can access these support options by clicking **Report an Issue** from the **More** window of Zscaler Client Connector or the Zscaler Client Connector system tray icon.
See image.
# About Support Options for Users
When you allow users to send support requests, you can also choose who receives the user’s request for support. You can configure support requests to go only to your organization’s support admin or go to both the support admin and Zscaler Support.
When users send a Report an Issue form from Zscaler Client Connector, an email containing the form data and an attachment of encrypted logs is sent to your organization's support admin and anyone else in the **CC** field. You can also have the support ticket containing the form data and attached encrypted logs automatically sent to Zscaler Support. Only Zscaler can decrypt logs.
See image.
# Configuring User Access to Support Options
To configure users’ access to support options:
- From the navigation menu, go to **Infrastructure > Advanced Settings > App Supportability**.
- On the **App Supportability** tab, you can select from the following options:
  - **Hide Logging Control on Zscaler Client Connector**: Prevents users from exporting or clearing logs and changing the **Log** **Mode** set by the Zscaler admin using App Profiles.
- Disable **Hide Logging Control** **on Zscaler Client Connector** to allow users to send an email copy of the data entered on the Report an Issue form along with encrypted logs. To learn more, see Configuring User Access to Logging Controls for Zscaler Client Connector.
  - **Client Connector App Logs**: Allows users to collect Client Connector logs per enrolled device. To fetch logs, go to **Enrolled Devices**. On the **Device Details** tab, click **Fetch Logs**. To learn more, see Viewing Device Fingerprint for an Enrolled Device.
  - **Enable Support Access in Zscaler Client Connector**: Allows users to access the Report an Issue form. The user's request is sent as an email to the support admin you specify for your organization in the email address field. Encrypted logs are automatically attached to the email.
  - **Admin Email Address to Send Logs**: If you enabled support access, enter the email address of your organization's designated support admin or team. You can enter multiple email addresses separated by commas.
  - **Enable End User Ticket Submission to Zscaler**: If you enabled support access, select this option if you also want a ticket to be automatically sent to Zscaler Support when the user chooses **Report an Issue**. Encrypted logs are automatically attached to the Zscaler Support ticket.
See image.
- Click **Save**.
To learn more about other Zscaler Client Connector Support features, see About Zscaler Client Connector Support.
