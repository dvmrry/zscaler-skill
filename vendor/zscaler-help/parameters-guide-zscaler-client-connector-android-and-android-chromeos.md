# Supported Parameters for Zscaler Client Connector for Android and Android on ChromeOS

**Source:** https://help.zscaler.com/zscaler-client-connector/parameters-guide-zscaler-client-connector-android-and-android-chromeos
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Downloading & Deployment 
Zscaler Configuration Parameters for Deployment Guides 
Supported Parameters for Zscaler Client Connector for Android and Android on ChromeOS
Client Connector
Supported Parameters for Zscaler Client Connector for Android and Android on ChromeOS
Ask Zscaler

This table lists the available parameters for devices running Zscaler Client Connector for Android and Android on ChromeOS, and for Google Workspace. You can preconfigure these parameters when deploying Zscaler Client Connector from a mobile device management (MDM) system with Android Enterprise enabled.

To learn more, see Customizing Zscaler Client Connector with Install Options for Android and Deploying Zscaler Client Connector with Google Workspace.

Parameter	Description	Value	Notes

userDomain
Your organization's domain name. If your instance has multiple domains associated with it, enter the primary domain for your instance. The primary domain is only valid if you are using a single IdP with multiple domains.
Example: safemarch.com. Specify the exact domain that is present in the SAML NameID field.
This install option allows users to skip the app enrollment page. If single sign-on is enabled for your organization, users are taken directly to your organization's SSO login page.

cloudName
The name of the cloud on which your organization is provisioned. To learn more, see What Is My Cloud Name for ZIA? If your organization is provisioned on more than one cloud, your users are asked to select the cloud where their traffic is sent during the enrollment process.
If your cloud name is zscalertwo.net, enter zscalertwo.
Do not use this option if your organization is provisioned on one cloud. The app automatically sends traffic to the proper cloud and your users don't need to make a selection during enrollment.

deviceToken
The appropriate device token from the Zscaler Client Connector Portal if you want to use the Zscaler Client Connector Portal as an IdP. The Zscaler service silently provisions and authenticates users even if you don't have an authentication mechanism in place.
Example: 123456677754
This option applies only to Zscaler Internet Access (ZIA). It is not supported by Zscaler Private Access (ZPA). Before adding this option, you must generate a device token in the Zscaler Client Connector Portal.

userName
The username of the user. You can also use an MDM macro to auto-populate this value.
A maximum of 255 alphanumeric and special characters. For example, if the username is j.doe@zscaler.com, enter j.doe.
If you use this option, the userDomain option must not be empty. For Microsoft Intune only: To use the same username used for enrolling in Intune, you can use the {{partialupn}} token.

enableFips
Indicates whether Zscaler Client Connector uses FIPS-compliant libraries for communication with Zscaler infrastructure.
1 = Enable; 0 = Disable (default)
Enable this option only if you require FIPS-level security within your organization.

Ownership
If you use the Ownership Variable device posture type, add the key Ownership. You can enter up to 32 alphanumeric characters in the Configuration value field.
Example: acmecorp

autoEnrollWithMDM
Use this parameter to configure auto-enrollment without user interaction when using Client Connector IdP.
0 = Disable auto-enrollment; 1 = Always auto-enroll, even after log out; 2 = One-time auto-enrollment.
When this parameter is set to either 1 or 2, you must specify the parameters deviceToken, cloudName, and userDomain before enabling the autoEnrollWithMDM option. If you don't specify the userName parameter or you don't explicitly allow the contacts permission from the MDM admin console, users are prompted to allow Zscaler to access their contacts when enrolling.

customDNS
By default, Zscaler Client Connector uses the device's DNS server. You can change the value to another DNS server using this setting.
Enter the DNS IP address. Example: 4.2.2.2

allowRunningOnRootedDevice
Restricts users from running Zscaler Client Connector on a rooted device. Enter 1 to allow users to run Zscaler Client Connector on a rooted device.
1 = Enable; 0 = Disable (default)
Applies to Zscaler Client Connector version 3.7 and later for Android and Android on ChromeOS. This parameter was formerly allowZccOnRootedDevice.

allowRunningOnEmulator
Restricts users from running Zscaler Client Connector on an emulator. Enter 1 to allow users to run Zscaler Client Connector on an emulator.
1 = Enable; 0 = Disable (default)
This parameter was formerly allowZccOnEmulator.

externalDeviceId
The identifier that associates devices in a mobile device management (MDM) solution with devices in the Zscaler Client Connector Portal. You can use an MDM macro to auto-populate this value.
0 = Disable (default); Enter a custom value to identify the device (e.g., 123456677754).
Applies to Zscaler Client Connector version 3.7 and later for Android and Android on ChromeOS.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Supported Parameters for Zscaler Client Connector for iOS
Supported Parameters for Zscaler Client Connector for Windows
Supported Parameters for Zscaler Client Connector for macOS
Supported Parameters for Zscaler Client Connector for Android and Android on ChromeOS
