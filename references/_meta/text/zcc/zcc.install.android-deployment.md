# Deploying Client Connector on Android through an MDM: Android Enterprise, the APK, minimum OS and Always-on VPN (zcc.install.android-deployment)
Also called: zcc android mdm; zcc intune android; zcc workspace one android; zcc mobileiron android; zcc maas360 android; zcc apk; zcc android always-on vpn

The Android install-options page lists guides for MaaS360, Microsoft Intune, MobileIron and Workspace ONE UEM; the Intune guide covers Android and Android on ChromeOS devices. [zcc.install.android-deployment:guides] The Android guides are written against Microsoft Intune service release 2006, MobileIron Core 10.1, Workspace ONE UEM 25.6.111.0 (2506) and MaaS360 10.72. [zcc.install.android-deployment:guide-versions]

**Preconfiguring the app.** The Intune guide says Client Connector can be preconfigured with parameters when deployed from Google Play with Android Enterprise enabled, and cannot be preconfigured when deployed from Google Play without Android Enterprise or as an APK file; the Workspace ONE and MaaS360 guides say the same. The MobileIron guide says Android Enterprise must first be enabled for MobileIron UEM before deploying. [zcc.install.android-deployment:preconfigure-needs-ae] The Android-specific keys are in [iOS and Android-only install keys](kb:zcc.install.mobile-options) and the delivery summary in [Client Connector install parameters and deployment](kb:zcc.install). The Workspace ONE guide says Omnissa variables can be used for some Client Connector parameters, for example userName, and that selecting Keep approved when app requests new permissions automatically approves all future updates to the app. The MaaS360 guide says MaaS360 variables can populate the fields. [zcc.install.android-deployment:variables-and-approval]

**The APK.** The Workspace ONE guide says to download the Client Connector APK file from the Registered Devices > Android tab and to contact Zscaler Support to enable the APK file link. In the Intune guide an APK file is uploaded, Zscaler Support is contacted for a private APK file, and the app can take up to 10 minutes to publish and appear in private apps. [zcc.install.android-deployment:apk] The App Store's own description of that download differs [divergence:zcc.install.android-deployment:android-download-file].

**Minimum operating system.** The Workspace ONE guide has the admin select Android 8.0 as the Minimum OS. The Workspace ONE and Intune guides say the minimum operating system for Android on ChromeOS is Android 6.0. [zcc.install.android-deployment:min-os]

**Always-on VPN.** The Intune guide says Client Connector can restrict the traffic and secure the device before enrollment if Always ON VPN is enabled on the organization's MDM for the Zscaler app; after enrollment it intercepts the traffic and forwards it according to the Admin Console policies. In Intune this is a Device Restriction profile (Fully Managed, Dedicated, and Corporate-Owned Work Profile, or Personally-Owned Work Profiles) with Always-on VPN enabled, VPN client Custom and the package ID, for example zscaler.com.zscaler. [zcc.install.android-deployment:always-on-vpn] What restricting the traffic before enrollment means is open [gap:zcc.install.android-deployment:always-on-restrict].

**Enrollment on the device.** In the MobileIron guide a device with a work profile or in Device Owner mode that is registered with the Android Enterprise configuration applied gets Client Connector installed and configured automatically, and users must open it once for the configuration to be applied the first time. The MaaS360 guide says users must launch the app and log in to enroll. [zcc.install.android-deployment:mobileiron-enrollment]

**Open points.** What the App Store's Android SDK file is, is open [gap:zcc.install.android-deployment:sdk-file].

Sources disagree (name both sides):
- The App Store downloads article calls the Android download on the Registered Devices tab an SDK file only, while the Workspace ONE guide downloads a Client Connector APK file from the Registered Devices > Android tab and says to contact Zscaler Support to enable the APK file link. [divergence:zcc.install.android-deployment:android-download-file]
  - zscaler-help: The Registered Devices tab shows released versions for Windows, macOS, Linux and Android (SDK file only).
  - zscaler-help: The APK file is downloaded from the Registered Devices > Android tab, and Zscaler Support is contacted to enable the APK file link.
  Impact: An admin who reads the downloads article may expect no APK on the Registered Devices tab, while the MDM guide downloads one there; the pages may describe different states, but neither says so.

Not known (open gaps):
- What restricting the traffic before enrollment means under Always-on VPN [gap:zcc.install.android-deployment:always-on-restrict]: settled by lab-test or support-ticket
- What the Android SDK file on the Registered Devices tab is [gap:zcc.install.android-deployment:sdk-file]: settled by source-read or support-ticket

Area: zcc.install, its subjects in references/_meta/spine/zcc/zcc.install.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.install.md (Client Connector install parameters and deployment)
- links-to references/_meta/text/zcc/zcc.install.mobile-options.md (iOS and Android-only install keys)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.install.enrollment.md (Install parameters that identify the tenant and user at enrollment)
- see-also references/_meta/text/zcc/zcc.install.chromeos-deployment.md (Deploying Client Connector on ChromeOS and ChromeOS Flex through the Google Admin console)
- see-also references/_meta/text/zcc/zcc.install.rollout.md (Rolling out Client Connector: App Store downloads, deployment phases, pilot tests and update test groups)
