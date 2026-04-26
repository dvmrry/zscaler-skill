# Supported Parameters for Zscaler Client Connector for Windows

**Source:** https://help.zscaler.com/zscaler-client-connector/supported-parameters-zscaler-client-connector-windows
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Downloading & Deployment 
Zscaler Configuration Parameters for Deployment Guides 
Supported Parameters for Zscaler Client Connector for Windows
Client Connector
Supported Parameters for Zscaler Client Connector for Windows
Ask Zscaler

This table lists the available parameters for devices running Zscaler Client Connector for Windows. You can preconfigure these parameters when manually installing Zscaler Client Connector on a Windows device or deploying Zscaler Client Connector using GPO, SCCM, or other device management methods. The parameter names are different based on whether you are using an MSI file or an EXE file.

To learn more, see Customizing Zscaler Client Connector with Install Options for MSI and Customizing Zscaler Client Connector with Install Options for EXE.

Parameter	Description	Value	Notes

MSI: USERDOMAIN / EXE: userDomain
Your organization's domain name. If your instance has multiple domains associated with it, enter the primary domain for your instance. The primary domain is only valid if you are using a single IdP with multiple domains. The primary domain won't work if you have multiple domains across multiple IdPs.
Example: safemarch.com. Specify the exact domain that is present in the SAML NameID field. For example, if your user's NameID is john.doe@corp.company.com, then enter corp.company.com.
This install option allows users to skip the app enrollment page. If single sign-on (SSO) is enabled for your organization, users are taken directly to your organization's SSO login page. If you've integrated SSO with the app (i.e., using a mechanism like Integrated Windows Authentication [IWA]), users can also skip the SSO login page and are automatically enrolled with Zscaler service and logged in. To use this install option when deploying Zscaler Client Connector with non-persistent Citrix VDIs, you must use IWA. An alternative to using this install option is to change the name of the installer file. To learn more, see Allow Users to Log into Zscaler Client Connector Without Entering Domains.

MSI: CLOUDNAME / EXE: cloudName
The name of the cloud on which your organization is provisioned. To learn more, see What Is My Cloud Name for ZIA? If your organization is provisioned on more than one cloud, your users are asked to select the cloud where their traffic is sent during the enrollment process. With this install option, you can specify the cloud where the app sends user traffic, so your users don't have to make the selection during enrollment.
If your cloud name is zscalertwo.net, enter zscalertwo or zscalertwo.net.
Do not use this option if your organization is provisioned on one cloud. The app automatically sends traffic to the proper cloud and your users don't need to make a selection during enrollment. This option is required if you use the STRICTENFORCEMENT or strictEnforcement option.

MSI: DEVICETOKEN / EXE: deviceToken
The appropriate device token from the Zscaler Client Connector Portal if you want to use the Zscaler Client Connector Portal as an IdP. The Zscaler service silently provisions and authenticates users even if you don't have an authentication mechanism in place.
Example: 123456677754
This option applies only to Zscaler Internet Access (ZIA). It is not supported by Zscaler Private Access (ZPA) unless you also use ZIdentity. Before adding this option, you must generate a device token in the Zscaler Client Connector Portal and complete the full configuration in Using Zscaler Client Connector Portal as an IdP.

MSI: UNAME / EXE: userName
The username of the user. You can also use a Mobile Device Management (MDM) macro to auto-populate this value. Refer to your MDM's documentation.
A maximum of 255 alphanumeric and special characters. For example, if the username is j.doe@zscaler.com, enter j.doe.
If you use this option, the USERDOMAIN or userDomain option must not be empty.

MSI: ENABLEFIPS / EXE: enableFips
Indicates whether Zscaler Client Connector uses FIPS-compliant libraries for communication with the Zscaler infrastructure.
1 = Enable; 0 = Disable (default)
Enable this option only if you require FIPS-level security within your organization.

MSI: EXTERNALDEVICEID / EXE: externalDeviceId
The identifier that associates devices in an MDM solution with devices in the Zscaler Client Connector Portal. You can use an MDM macro to auto-populate this value.
0 = Disable (default); Enter a custom value to identify the device.
Not supported on Zscaler Client Connector version 4.0 and earlier for Windows.

MSI: HIDEAPPUIONLAUNCH / EXE: hideAppUIOnLaunch
Forces the app window to stay hidden before users enroll. Users can always open the window by clicking the app icon in the system tray.
1 = Enable; 0 = Disable (default)
If Zscaler Client Connector is installed with the cloudName and userDomain options, Zscaler Client Connector attempts to automatically perform SSO.

MSI: POLICYTOKEN / EXE: policyToken
Allows you to specify which app profile policy you want to enforce for the app before the user enrolls. All relevant settings associated with the policy apply, including the bypass of the IdP login page. After the user enrolls, this policy is replaced with an app profile policy that matches the user based on group affiliation.
Example: 123456677754
Applies only, and is required, in the following situations: You use the STRICTENFORCEMENT or strictEnforcement option. You configure the machine tunnel and want the users to access ZPA applications before logging in to the device. In the Zscaler Client Connector Portal, you must configure the app profile policy that you want to enforce and ensure that the custom PAC file associated with that policy includes a bypass for your IdP login page.

MSI: REINSTALLDRIVER / EXE: reinstallDriver
Forces a reinstallation of the driver, even if you already have a driver installed. Use this option if you're having issues with your current driver.
1 = Enable; 0 = Disable (default)

MSI: STRICTENFORCEMENT / EXE: strictEnforcement
Allows you to require users to enroll with the app before accessing the internet and blocks traffic in the following situations: The user has not yet logged in after a new install. A user logs in and logs out. An administrator removes a device.
1 = Enable; 0 = Disable (default)
If you enable this option, the following options are required: CLOUDNAME or cloudName; POLICYTOKEN or policyToken. To use this install option when deploying Zscaler Client Connector with non-persistent Citrix VDIs, you must set the HIDEAPPUIONLAUNCH option to 0 (disabled). This option only works when the forwarding profile action for Zscaler Client Connector is Tunnel or Tunnel with Local Proxy. This option does not affect users who remain logged in and disable the ZIA service.

MSI: Not supported / EXE: mode
Allows you to install the app in silent mode.
unattended = Enable; win32 = Disable (default)

MSI: Not supported / EXE: unattendedmodeui
Allows you to control what's displayed to users if you are performing an unattended installation of the app.
none = Nothing is displayed (default); minimal = Small progress bar; minimalWithDialogs = More information displayed with some dialogs.
If you enable this option, mode=unattended is required.

MSI: UNINSTALLPASSWORDCMDLINE / EXE: uninstallPasswordCmdLine
Allows you to silently uninstall the app from users' devices using device management methods like GPO.
The password you add for this option must match the Uninstall Password configured for access in unattended mode.
This option is available only in Zscaler Client Connector version 4.2.1 and later for Windows.

MSI: ENABLEANTITAMPERING / EXE: enableAntiTampering
Prevents end users from stopping, modifying, and deleting Zscaler products and services.
1 = Enable; 0 = Disable (default)
This option can be overridden by the Override Anti Tampering Install Parameter option in app profiles.

MSI: ENABLEIMPRIVATAINTEGRATION / EXE: enableImprivataIntegration
Enables integration with Imprivata OneSign. If enabled, Zscaler Client Connector silently logs in an Imprivata OneSign user to Zscaler Client Connector.
1 = Enable; 0 = Disable (default)
This option is available only in Zscaler Client Connector version 4.4 and later for Windows.

MSI: BCPCONFIGFILEPATH / EXE: bcpConfigFilePath
Allows you to install Zscaler Client Connector to enroll new users during a ZPA-related cloud outage or ISP outage. You can pass a predownloaded configuration file with Business Continuity settings from the ZPA Admin Portal.
<path to downloaded bcp config file>
If you pass this install option, you must also pass the BCPMAPUBKEYHASH or bcpMAPublicKeyHash option. Available only in Zscaler Client Connector version 4.6 and later for Windows.

MSI: BCPMAPUBKEYHASH / EXE: bcpMAPublicKeyHash
Allows you to install Zscaler Client Connector to enroll new users during a ZPA-related cloud outage or ISP outage. You can pass a public key provided by ZPA.
<bcp thumbprint>. Example: sYxSOjkj9DP1Ksw3LQ/FrPsBPfcsURrM5vNuH7Kmf1A=
If you pass this install option, you must also pass BCPCONFIGFILEPATH or bcpConfigFilePath. Available only in Zscaler Client Connector version 4.6 and later for Windows.

MSI: IMPORTSEFAILCLOSECONFIG / EXE: importSEFailCloseConfig
Allows you to pass a predownloaded configuration file with fail-close settings to use when Zscaler Client Connector is in strict enforcement mode.
<path to downloaded fail close config file>
Must also pass STRICTENFORCEMENT and SEFAILCLOSECONFIGTHUMBPRINT. Available only in Zscaler Client Connector version 4.6 and later for Windows.

MSI: SEFAILCLOSECONFIGTHUMBPRINT / EXE: failCloseConfigThumbprint
Allows you to pass the public key for a predownloaded configuration file with fail-close settings.
<fail close thumbprint>. Example: GjqjzPQ3Vk35+o3Yo2EsPOSV3rOJaeYTpcBmotISts=
Must also pass STRICTENFORCEMENT and IMPORTSEFAILCLOSECONFIG. Available only in Zscaler Client Connector version 4.6 and later for Windows.

MSI: Not supported / EXE: revertzcc
Allows you to silently revert Zscaler Client Connector to the previous version.
1 = Enable; 0 = Disable (default)
If you pass this install option, you must use the installer path of the version before the upgrade.

MSI: REVERTPASSWORDCMDLINE / EXE: revertPasswordCmdLine
Allows you to silently revert Zscaler Client Connector to the previous version.
The password must match the Revert Password configured for access in unattended mode.
Available only in Zscaler Client Connector version 4.2.1 and later for Windows.

MSI: Not supported / EXE: installer-language
Sets the language used by the installer.
en = English (default); fr = French
This option does not change the language used in the Zscaler Client Connector app. Available only in Zscaler Client Connector version 4.5 and later for Windows.

MSI: INSTALLWEBVIEW2 / EXE: installWebView2
Enables installation of the WebView2 framework.
1 = Enable; 0 = Disable (default)
This option is used for testing WebView2-based functionality on a single device and should be used for testing only. Must also pass ENABLESSO or enableSSO to test SSO with WebView2.

MSI: ENABLESSO / EXE: enableSSO
Enables SSO using the Windows Primary account in an Azure Active Directory environment.
2 = Based on policy (default); 1 = Enable; 0 = Disable
To use this option, you must pass the INSTALLWEBVIEW2 or installWebView2 option if you want to test SSO with WebView2.

MSI: LWFBOOTSTART / EXE: LWFBootStart
Sets the Zscaler Lightweight Filter (LWF) Driver start type to Boot.
1 = Enable; 0 = Disable (default)

MSI: USELWFDRIVER / EXE: useLWFDriver
Enables the packet filter-based filter driver.
1 = Enable; 0 = Disable (default)
This install option overrides the Tunnel Driver Type selection in forwarding profiles.

MSI: INSTALLLWFDRIVER / EXE: installLWFDriver
Installs a high-performance Network Driver Interface Specification (NDIS) 6-based LWF driver.
1 = Enable; 0 = Disable (default)

MSI: VDI / EXE: vdi
Indicates that Zscaler Client Connector is being installed on a virtual desktop infrastructure (VDI).
1 = Enable; 0 = Disable (default)

MSI: EXTERNALREDIRECT / EXE: externalRedirect
Enables browser-based authentication for Zscaler Client Connector.
1 = Enable; 0 = Disable (default)

MSI: CONFIGTIMEOUT / EXE: configTimeout
Sets the number of seconds Zscaler Client Connector waits for the configuration file (if not already present).
0 = 0 seconds (default)

MSI: MTAUTHREQUIRED / EXE: mtAuthRequired
Requires users to authenticate against your IdP before the machine tunnel starts if you use the machine tunnel feature in ZPA.
1 = Enable; 0 = Disable (default)

MSI: UPGRADEPASSWORDCMDLINE / EXE: upgradePasswordCmdLine
Allows you to silently upgrade Zscaler Client Connector.
The password must match the Upgrade Password configured for access in unattended mode.

MSI: ENABLECUSTOMPROXYDETECTION / EXE: enableCustomProxyDetection
Indicates how Zscaler Client Connector identifies the system proxy before the initial policy download.
1 = Enable; 0 = Disable (default)
If enabled, Zscaler Client Connector downloads the PAC and parses the proxy instead of using the default Microsoft APIs. After the initial policy download, Zscaler Client Connector uses the Detect External Proxy Using Custom Method from the app profile and returns to this setting after a user logs out.

MSI: LAUNCHTRAY / EXE: launchTray
By default, Zscaler Client Connector starts its services and user interface after installation. To change this, you can disable this install option to prevent Zscaler Client Connector from automatically starting after installation. If you disable the option, users must open Zscaler Client Connector manually to start the app, or Zscaler Client Connector automatically runs after the next reboot.
1 = Enable (default); 0 = Disable

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Supported Parameters for Zscaler Client Connector for iOS
Supported Parameters for Zscaler Client Connector for Windows
Supported Parameters for Zscaler Client Connector for macOS
Supported Parameters for Zscaler Client Connector for Android and Android on ChromeOS
