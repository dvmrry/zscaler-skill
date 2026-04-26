# Configuring User Access to Logging Controls for Zscaler Client Connector

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-user-access-logging-controls-zscaler-client-connector
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Zscaler Client Connector Support Settings 
App Supportability 
Configuring User Access to Logging Controls for Zscaler Client Connector
Client Connector
Configuring User Access to Logging Controls for Zscaler Client Connector
Ask Zscaler

From the App Supportability page, you can configure your users' access to the logging controls for Zscaler Client Connector. Your users can access these features from the More window of the app and the Zscaler Client Connector icon's shortcut menu from the system tray.

For Zscaler Client Connector 2.1.2 or later for Windows and macOS, exported logs aren't encrypted, but logs included in the Report an Issue form are encrypted. If you're using a Zscaler Client Connector version earlier than 2.1.2 for Windows or macOS, exported logs are always encrypted and users can't view them.

About Logging Controls for Users

You can choose to show or hide logging controls for users. If you keep logging controls visible on Zscaler Client Connector, your users can:

See where encrypted logs are stored on their devices by clicking Show/Hide Logs in the Report an Issue form.

Export logs from the Zscaler Client Connector system tray icon shortcut menu. Upon export, the logs are saved as a ZIP file on the user's device.

Send encrypted logs to support by email and send a copy of the email to themselves and others. When users request support from the app, an email with encrypted logs is automatically sent to your organization's support admin. If the option is enabled, it's also forwarded to Zscaler Support. An email is also sent to any recipient the user adds to the CC field of the Report an Issue form. Users cannot view the encrypted logs.

Change the log mode in the More window of Zscaler Client Connector. Using App Profiles, you can determine how the app generates logs. The following log modes are available to users depending on the app profile configuration:

Error: Logs only when the app encounters an error and functionality is affected.
Warn: Logs when the app is functioning but is encountering potential issues, or when conditions for the Error log mode are met.
Info: Logs general app activity, or when conditions for the Warn log mode are met.
Debug: Logs all app activity that could assist Zscaler Support in debugging issues, or when conditions for the Info log mode are met.
Verbose: Logs when invoked by some external events (e.g., Firebase Push Notification or Mobile Manager flags). This log mode is only available for Zscaler Client Connector version 1.5 and later for Android.

Clear logs from the More window of Zscaler Client Connector.

Configuring User Access to Logging Controls

To configure users' access to logging controls:

In the Zscaler Client Connector Portal, go to Administration.
In the left-side navigation, go to Client Connector Support.
On the App Supportability tab, enable Hide Logging Controls on Zscaler Client Connector to block users from using logging controls for Zscaler Client Connector. Disable Hide Logging Controls on Zscaler Client Connector to allow users to use logging controls.

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
