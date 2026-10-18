# Deploying Zscaler Client Connector with Google Workspace for Android

**Source:** https://help.zscaler.com/zscaler-client-connector/deploying-zscaler-client-connector-google-workspace-android
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1532018, revision 3137853

---

This guide is for admins only. If you're an end user, contact your organization’s administrator for deployment-related details.
With Google Workspace, you can distribute App Store apps, including apps purchased in volume, to mobile devices. After an app is distributed, you can use Google Workspace to manage future updates to Zscaler Client Connector. You must have the required license for managing Android devices before deployment.
This article contains terms specific to the Google Workspace. To learn more, refer to Google Workspace Admin documentation.
To deploy Zscaler Client Connector with Google Workspace, you must add and manage public apps with Google Workspace:
- Log in to the Google Admin console.
- In the left-side navigation, go to **Apps** > **Web and mobile apps** > **Add App**. Select **Add private Android app**.
- See image.
- In the left-side navigation, click **Search Play Store** and enter Zscaler Client Connector in the **Search** field.
- See image.
- Click **Select**.
- See image.
- You're automatically redirected to Apps > Web and mobile apps > Zscaler Client Connector, where you can configure app settings. Click **View details** in the **User access** section.
- See image.
- Select **Make this app available to users in this organizational unit**. Click **Save** and collapse the **User access** section.
- See image.
- In the **Settings** section, click **Learn more** and select the following values for each setting. When finished, collapse the **Settings** section.
  - **Access method: Force install** or **Available**
  - **Prevent users from uninstalling the app**: **OFF**
  - **Allow users to add widgets to homescreen**: **ON** or **OFF**
  - **Use as the** **always-on VPN** **app**: **ON**
  - **Managed configuration:** **IdP**
See image.
- In the **Runtime permissions** section, select **Allow** for the **Contacts** feature if **Zscaler Client Connector Portal as IdP** is the preferred authentication type**.** Click **Save** and collapse the **Runtime permission**s section.
See image.
- In the **Managed configurations** section, enter the following JSON format:
{ "userDomain":"<org’s_domain>", "cloudName":"zscalerone", "autoEnrollWithMDM":"1", "deviceToken":"<token_value>", "externalDeviceId":"${DEVICE_SERIAL_NUMBER}" }
See image.
- You can add Zscaler parameters to the JSON format based on your organization's needs and click **Save**.
