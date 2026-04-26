# Supported Parameters for Zscaler Client Connector for macOS

**Source:** https://help.zscaler.com/zscaler-client-connector/supported-parameters-zscaler-client-connector-macos
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Downloading & Deployment 
Zscaler Configuration Parameters for Deployment Guides 
Supported Parameters for Zscaler Client Connector for macOS
Client Connector
Supported Parameters for Zscaler Client Connector for macOS
Ask Zscaler

This table lists the available parameters for devices running Zscaler Client Connector for macOS. You can preconfigure these parameters when deploying Zscaler Client Connector using a pkg installation process with property list (PLIST) configuration settings deployed from a mobile device management (MDM) solution.

To learn more, see Deploying Zscaler Client Connector with Microsoft Intune for macOS and Deploying Zscaler Client Connector with Jamf Pro for macOS.

Parameter	Description	Value	Notes

userDomain
Your organization's domain name. If your instance has multiple domains associated with it, enter the primary domain for your instance. The primary domain is only valid if you are using a single IdP with multiple domains. The primary domain won't work if you have multiple domains across multiple IdPs.
Example: safemarch.com. Specify the exact domain that is present in the SAML NameID field.
This install option allows users to skip the app enrollment page. If single sign-on (SSO) is enabled for your organization, users are taken directly to your organization's SSO login page. If you've integrated SSO with the app (i.e., using a mechanism like Microsoft Enterprise SSO Plug-In), users can also skip the SSO login page and are automatically enrolled with the Zscaler service and logged in.

cloudName
The name of the cloud on which your organization is provisioned. To learn more, see What Is My Cloud Name for ZIA? If your organization is provisioned on more than one cloud, your users are asked to select the cloud where their traffic is sent during the enrollment process. With this install option, you can specify the cloud where the app sends user traffic, so your users don't have to make the selection during enrollment.
If your cloud name is zscalertwo.net, enter zscalertwo or zscalertwo.net.
Do not use this option if your organization is provisioned on one cloud. The app automatically sends traffic to the proper cloud and your users don't need to make a selection during enrollment. This option is required if you use the strictEnforcement option.

deviceToken
The appropriate device token from the Zscaler Client Connector Portal if you want to use the Zscaler Client Connector Portal as an IdP. The Zscaler service silently provisions and authenticates users even if you don't have an authentication mechanism in place.
Example: 123456677754
This option applies only to Zscaler Internet Access (ZIA). It is not supported by Zscaler Private Access (ZPA) unless you also use ZIdentity. Before adding this option, you must generate a device token in the Zscaler Client Connector Portal and complete the full configuration in Using Zscaler Client Connector Portal as an IdP.

userName
The username of the user. You can also use an MDM macro to auto-populate this value. Refer to your MDM's documentation.
A maximum of 255 alphanumeric and special characters. For example, if the username is j.doe@zscaler.com, enter j.doe.
If you use this option, the userDomain option must not be empty.

enableFips
Indicates whether Zscaler Client Connector uses FIPS-compliant libraries for communication with the Zscaler infrastructure.
1 = Enable; 0 = Disable (default)
Enable this option only if you require FIPS-level security within your organization.

externalDeviceId
The identifier that associates devices in an MDM solution with devices in the Zscaler Client Connector Portal. You can use an MDM macro to auto-populate this value.
0 = Disable (default); Enter a custom value to identify the device (e.g., 123456677754).
Not supported on Zscaler Client Connector version 4.1 and earlier for macOS.

hideAppUIOnLaunch
Forces the app window to stay hidden before users enroll. Users can always open the window by clicking the app icon in the system tray.
1 = Enable; 0 = Disable (default)

policyToken
Allows you to specify which app profile policy you want to enforce for the app before the user enrolls. All relevant settings associated with the policy apply, including the bypass of the IdP login page. After the user enrolls, this policy is replaced with an app profile policy that matches the user based on group affiliation.
Example: 123456677754
Applies only, and is required, in the following situations: You use the strictEnforcement option. You configure the machine tunnel and want the users to access ZPA applications before logging in to the device. In the Zscaler Client Connector Portal, you must configure the app profile policy that you want to enforce and ensure that the custom PAC file associated with that policy includes a bypass for your IdP login page.

strictEnforcement
Allows you to require users to enroll with the app before accessing the internet and blocks traffic in the following situations: The user has not yet logged in after a new install. A user logs in and logs out. An administrator removes a device.
1 = Enable; 0 = Disable (default)
If you enable this option, the following options are required: cloudName; policyToken. This option only works when the forwarding profile action for Zscaler Client Connector is Tunnel or Tunnel with Local Proxy. This option does not affect users who remain logged in and disable the ZIA service.

launchTray
By default, Zscaler Client Connector starts its services and user interface after installation. To change this, you can disable this install option to prevent Zscaler Client Connector from automatically starting after installation. If you disable the option, users must open Zscaler Client Connector manually to start the app, or Zscaler Client Connector automatically runs after the next reboot.
1 = Enable; 0 = Disable (default)

externalRedirect
Redirects authentication to your organization's SAML IdP through the default browser and Safari. When redirected to the browser for the first time, your users must select Remember Me on their IdP log-in screen. For any subsequent authentications, the browser remembers the user and automatically logs them in.
1 = Enable; 0 = Disable (default)

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Supported Parameters for Zscaler Client Connector for iOS
Supported Parameters for Zscaler Client Connector for Windows
Supported Parameters for Zscaler Client Connector for macOS
Supported Parameters for Zscaler Client Connector for Android and Android on ChromeOS
