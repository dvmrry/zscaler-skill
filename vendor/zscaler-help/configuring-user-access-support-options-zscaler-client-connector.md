# Configuring User Access to Support Options for Zscaler Client Connector

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-user-access-support-options-zscaler-client-connector
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Zscaler Client Connector Support Settings 
App Supportability 
Configuring User Access to Support Options for Zscaler Client Connector
Client Connector
Configuring User Access to Support Options for Zscaler Client Connector
Ask Zscaler

From the App Supportability page, you can configure your users' access to support options for Zscaler Client Connector. Your users can access these support options by clicking Report an Issue from the More window of Zscaler Client Connector or the Zscaler Client Connector system tray icon.

About Support Options for Users

When you allow users to send support requests, you can also choose who receives the user's request for support. You can configure support requests to go only to your organization's support admin or go to both the support admin and Zscaler Support.

When users send a Report an Issue form from Zscaler Client Connector, an email containing the form data and an attachment of encrypted logs is sent to your organization's support admin and anyone else in the CC field. You can also have the support ticket containing the form data and attached encrypted logs automatically sent to Zscaler Support. Only Zscaler can decrypt logs.

Configuring User Access to Support Options

To configure users' access to support options:

In the Zscaler Client Connector Portal, go to Administration > Client Connector Support.

On the App Supportability tab, you can select from the following options:

Hide Logging Control on Zscaler Client Connector: Prevents users from exporting or clearing logs and changing the Log Mode set by the Zscaler admin using App Profiles.

Disable Hide Logging Control on Zscaler Client Connector to allow users to send an email copy of the data entered on the Report an Issue form along with encrypted logs. To learn more, see Configuring User Access to Logging Controls for Zscaler Client Connector.

Client Connector App Logs: Allows users to collect Client Connector logs per enrolled device. To fetch logs, go to Enrolled Devices. On the Device Details tab, click Fetch Logs. To learn more, see Viewing Device Fingerprint for an Enrolled Device.
Enable Support Access in Zscaler Client Connector: Allows users to access the Report an Issue form. The user's request is sent as an email to the support admin you specify for your organization in the email address field. Encrypted logs are automatically attached to the email.
Admin Email Address to Send Logs: If you enabled support access, enter the email address of your organization's designated support admin or team. You can enter multiple email addresses separated by commas.
Enable End User Ticket Submission to Zscaler: If you enabled support access, select this option if you also want a ticket to be automatically sent to Zscaler Support when the user chooses Report an Issue. Encrypted logs are automatically attached to the Zscaler Support ticket.

Click Save.

To learn more about other Zscaler Client Connector Support features, see About Zscaler Client Connector Support.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About App Supportability
Configuring User Access to Logging Controls for Zscaler Client Connector
Configuring User Access to Support Options for Zscaler Client Connector
Configuring User Access to the Restart and Repair Options for Zscaler Client Connector
Enabling Zscaler Client Connector Telemetry
Configuring Automatic Username Population for IdP Authentication
Configuring Automatic ZPA Reauthentication
Registering Devices with ZPA IdP Username
