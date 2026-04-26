# Deploying Zscaler Client Connector with Google Workspace for Android

**Source:** https://help.zscaler.com/zscaler-client-connector/deploying-zscaler-client-connector-google-workspace-android
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Downloading & Deployment 
Deploying Zscaler Client Connector with Google Workspace 
Deploying Zscaler Client Connector with Google Workspace for Android
Client Connector
Deploying Zscaler Client Connector with Google Workspace for Android
Ask Zscaler

This guide is for admins only. If you're an end user, contact your organization's administrator for deployment-related details.

With Google Workspace, you can distribute App Store apps, including apps purchased in volume, to mobile devices. After an app is distributed, you can use Google Workspace to manage future updates to Zscaler Client Connector. You must have the required license for managing Android devices before deployment.

This article contains terms specific to the Google Workspace. To learn more, refer to Google Workspace Admin documentation.

To deploy Zscaler Client Connector with Google Workspace, you must add and manage public apps with Google Workspace:

Log in to the Google Admin console.

In the left-side navigation, go to Apps > Web and mobile apps > Add App. Select Add private Android app.

In the left-side navigation, click Search Play Store and enter Zscaler Client Connector in the Search field.

Click Select.

You're automatically redirected to Apps > Web and mobile apps > Zscaler Client Connector, where you can configure app settings. Click View details in the User access section.

Select Make this app available to users in this organizational unit. Click Save and collapse the User access section.

In the Settings section, click Learn more and select the following values for each setting. When finished, collapse the Settings section.
Access method: Force install or Available
Prevent users from uninstalling the app: OFF
Allow users to add widgets to homescreen: ON or OFF
Use as the always-on VPN app: ON
Managed configuration: IdP

In the Runtime permissions section, select Allow for the Contacts feature if Zscaler Client Connector Portal as IdP is the preferred authentication type. Click Save and collapse the Runtime permissions section.

In the Managed configurations section, enter the following JSON format:
{
"userDomain":"<org's_domain>",
"cloudName":"zscalerone",
"autoEnrollWithMDM":"1",
"deviceToken":"<token_value>",
"externalDeviceId":"${DEVICE_SERIAL_NUMBER}"
}

You can add Zscaler parameters to the JSON format based on your organization's needs and click Save.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Deploying Zscaler Client Connector with Google Workspace for Android
Deploying Zscaler Client Connector with ChromeOS Flex
Deploying Zscaler Client Connector with Google Workspace for ChromeOS
