# Configuring SSL Inspection for Zscaler Client Connector

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-ssl-inspection-zscaler-client-connector
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1328936, revision 3240863

---

When you enable SSL inspection for your Zscaler Client Connector devices, this allows the Zscaler service to decrypt and inspect HTTPS traffic to and from the browser to a device, and to and from the destination server. You can also exempt URLs from SSL inspection.
Depending on the platform, Zscaler Client Connector or your Mobile Device Management (MDM) solution installs the Zscaler SSL certificate required for SSL inspection.
Select from the following options for a description of each task:
- Configuring SSL Inspection for Zscaler Client Connector
- You must enable the service to perform SSL inspection for Zscaler Client Connector users on each relevant platform. To learn more, see Configuring SSL/TLS Inspection Policy.
- Location-specific SSL inspection settings are separate from Zscaler Client Connector SSL inspection settings. To learn more, see Configuring Locations.
- Exempting URLs from SSL Inspection
- To exempt URLs from SSL inspection, you must first create a custom category for the URLs and then add the custom category to URL Categories. If you already have a custom category for bypassed URLs, edit the category and add the URLs.
  - Apple recommends bypassing specific iOS URLs from SSL inspection. Refer to the Apple Support page.
  - Google recommends bypassing specific URLs from SSL inspection. Refer to Chrome Enterprise and Education Help.
# Creating a Custom URL Category
- To create a custom URL category in the Zscaler Admin Console:
  - From the navigation menu, go to Policies > Internet Access > Resources > URL Categories.
  - Click Add URL Category.
  - Enter a name for the category.
  - Add the URLs to the Custom URLs field.
  - Click Save and activate the change.
- To learn more about creating a custom URL category, see Configuring Custom URL Categories.
# Adding the Custom Category to URL Categories
- To add the custom category in the Zscaler Admin Console:
  - From the navigation menu, go to Internet Access > Policy > SSL/TLS Inspection.
  - Select the SSL inspection policy you created.
  - Under Criteria, select the URL categories you want to exempt from decryption from the URL Categories drop-down menu.
  - Under Action, click Do Not Inspect.
  - Click Save and activate the change.
- To learn more about adding the custom category to a URL category, see Configuring SSL/TLS Inspection Policy.
- The SSL certificate allows the Zscaler service to perform SSL inspection on user traffic forwarded by the app. Any SSL exemptions you configure in the Zscaler Admin Console also apply.
- (Optional) If you upload your organization’s custom SSL certificate, you can install the custom certificate instead.
# Installing the Zscaler SSL Certificate on Device Platforms
- Install Zscaler SSL Certificate is not supported on devices running macOS Big Sur (11) and later.
- To install the Zscaler SSL certificate by device:
  - Windows, Linux, and macOS
  - Android
  - iOS
- In the Zscaler Admin Console, enable Zscaler Client Connector to automatically install the Zscaler SSL certificate on your users’ devices for Windows, Linux, and macOS.
  - From the navigation menu, go to Infrastructure > Client Connector > <OS Version>.
  - On the App Profiles tab, click Add <OS Version> Policy or select an existing policy to edit.
  - Enable Install Zscaler SSL Certificate.
  - Click Save.
- For Android, Zscaler Client Connector does not automatically install the certificate. Zscaler recommends installing the root certificate using your MDM.
- Zscaler Client Connector only installs certificates for Samsung devices that have administrator privileges. To install the certificate, go to the More window in Zscaler Client Connector and click Install Certificates.
- For Android version 7.0 and later, Google prevents non-default certificate authorities from being trusted. Unless the third-party application developer explicitly allows it, the Zscaler certificate or any third-party certificate is not trusted.
- For iOS, Zscaler Client Connector does not automatically install the certificate because Apple requires application-installed certificates to be untrusted by default. Zscaler recommends installing the root certificate using your MDM.
## Events That Prompt Zscaler Client Connector to Install the Certificate
- If a certificate is already deployed and you upload a new certificate, Zscaler Client Connector uses a native Windows method to install the certificate. The app automatically replaces the certificate if it’s new or different, but won’t change it if the same certificate already exists.
- The Internet & SaaS service imports the certificate in the following situations:
  - Upon enrollment
  - If the admin modifies the app profile and the device checks in to download the new profile
  - When Zscaler Client Connector updates
  - When the user clicks Update Policy for Zscaler Client Connector
- When these events occur, Zscaler Client Connector receives the certificate link from the Zscaler Admin Console and attempts to install the certificate.
- To learn more about deploying SSL Inspection, see Deploying SSL/TLS Inspection.
- Configuring Zscaler Client Connector to Install the Zscaler SSL Certificate
