# Supported Parameters for Zscaler Client Connector for iOS

**Source:** https://help.zscaler.com/zscaler-client-connector/supported-parameters-zscaler-client-connector-ios
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Downloading & Deployment 
Zscaler Configuration Parameters for Deployment Guides 
Supported Parameters for Zscaler Client Connector for iOS
Client Connector
Supported Parameters for Zscaler Client Connector for iOS
Ask Zscaler

This table lists the available parameters for devices running Zscaler Client Connector for iOS. You can preconfigure these parameters when deploying Zscaler Client Connector from a mobile device management (MDM) system.

To learn more, see:

Deploying Zscaler Client Connector with Microsoft Intune for iOS
Deploying Zscaler Client Connector with Jamf Pro for iOS
Deploying Zscaler Client Connector with Workspace ONE UEM for iOS
Deploying Zscaler Client Connector with MobileIron for iOS
Deploying Zscaler Client Connector with MaaS360 for iOS

Parameter	Description	Value	Notes

userDomain
Your organization's domain name. If your instance has multiple domains associated with it, enter the primary domain for your instance. The primary domain is only valid if you are using a single identity provider (IdP) with multiple domains.
Example: safemarch.com. Specify the exact domain that is present in the SAML NameID field.
This install option allows users to skip the app enrollment page. If SSO is enabled for your organization, users are taken directly to your organization's SSO login page.

cloudname
The name of the cloud on which your organization is provisioned. If your organization is provisioned on more than one cloud, your users are asked to select the cloud where their traffic is sent during the enrollment process.
If your cloud name is zscalertwo.net, enter zscalertwo.
Do not use this option if your organization is provisioned on one cloud. This option is required if you use the strictEnforcement option.

strictEnforcement
Allows you to require users to enroll with the app before accessing the internet and blocks traffic in the following situations: The user has not yet logged in after a new installation. A user logs in and logs out. An administrator removes a device from the Zscaler Admin Console.
1 = Enable; 0 = Disable (default)
If you enable Strict Enforcement, you must use the policyToken configuration key. Excluded URLs must also be defined in a device configuration policy or excludeList in an app configuration policy.

excludeList
Allows you to exclude domains and IP addresses that should never be tunneled by Zscaler Client Connector with or without strictEnforcement. If you are using strictEnforcement, enter your MDM server or anything else the user should have access to before enrollment.
Enter a value, for example, apple.com, airwatch.com.
If you use the Private Access service, you must enter authsp.prod.zpath.net. For a list of additional requirements, refer to your MDM's requirements for this parameter.

newBindFlow
Enables multithreaded implementation of Zscaler Client Connector microservices binding with Zscaler Client Connector virtual interface.
1 = Enable (default); 0 = Disable
Applicable to per-app VPN deployments only.

deviceToken
The appropriate device token from the Zscaler Admin Console if you want to use the Zscaler Admin Console as an IdP. The Zscaler service silently provisions and authenticates users even if you don't have an authentication mechanism in place.
Example: 123456677754
This option applies only to Internet & SaaS. It is not supported by Private Access unless you also use ZIdentity. Before adding this option, you must generate a device token in the Zscaler Admin Console.

policyToken
Allows you to specify which app profile policy you want to enforce for the app before the user enrolls. After the user enrolls, this policy is replaced with an app profile policy that matches the user based on group affiliation.
Example: 393837313A313A64666131313635652D376536372D343032312D393232362D363264393931666135762960
Applies only, and is required if you use the strictEnforcement option. In the Zscaler Admin Console, you must configure the app profile policy that you want to enforce.

username
The username of the user. You can also use an MDM macro to auto-populate this value.
A maximum of 255 alphanumeric and special characters. For example, if the username is j.doe@zscaler.com, enter j.doe.
If you use this option, the userDomain option must not be empty.

authByTunnel
The auto-enrollment settings for users if you want to use the Zscaler Admin Console as an IdP for authentication.
1 = Users will always auto-enroll even if they are logged out manually or forcefully removed from the Zscaler Admin Console; 2 = One-time auto-enrollment; 0 = Disable auto-enrollment.
This option applies only to Internet & SaaS. If Private Access is enabled, users would log in manually with their user credentials.

ownership
If you use the Ownership Variable device posture type, add the key ownership. You can enter up to 32 alphanumeric characters in the Configuration value field.
Example: acmecorp
The ownership variable must be configured and pushed exclusively through the managed app configuration using your MDM solution and should not be included in the VPN profile.

SkipInterfaceInstallation
When enabled, only shows VPN icon in iOS when user is logged into Zscaler Client Connector.
1 = Enable; 0 = Disable (default)
Requires Tunnel SDK version 3.7 and later.

DropNonRoutingTraffic
Drops traffic without routes.
1 = Enable; 0 = Disable (default)

PAVConnectionSynced
Delays Per-app VPN connection until Zscaler Client Connector is connected.
1 = Enable; 0 = Disable (default)
Applicable to per-app VPN deployments only.

externalDeviceId
The identifier that associates devices in an MDM solution with devices in the Zscaler Admin Console. You can use an MDM macro to auto-populate this value.
0 = Disable (default); Enter a custom value to identify the device (e.g., 123456677754).

enableFips
Indicates whether Zscaler Client Connector uses FIPS-compliant libraries for communication with the Zscaler infrastructure.
1 = Enable; 0 = Disable (default)
Enable this option only if you require FIPS-level security within your organization.

MatchDomainsNoSearch
When enabled, Private Access match domains are not appended as search domains on the device.
1 = Enable; 0 = Disable (default)

disableCaptivePortalNotification
When enabled, Zscaler Client Connector suppresses notifications when it detects a captive portal.
1 = Enable; 0 = Disable (default)

SystemDNSEnabled
Zscaler Client Connector uses this parameter to resolve DNS queries which aren't forwarded to the Zscaler cloud. If Zscaler Client Connector fails to resolve the DNS using the system DNS domain, it falls back to Google DNS.
1 = Enable; 2 = Disable (default)

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Supported Parameters for Zscaler Client Connector for iOS
Supported Parameters for Zscaler Client Connector for Windows
Supported Parameters for Zscaler Client Connector for macOS
Supported Parameters for Zscaler Client Connector for Android and Android on ChromeOS
