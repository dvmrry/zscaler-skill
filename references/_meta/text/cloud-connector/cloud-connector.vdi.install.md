# Installing Client Connector for VDI: download, MSI options, golden images, OnboardOnStart, Intune and processes to allowlist (cloud-connector.vdi.install)
Also called: zccvdiinstaller; zccvdiinstaller.msi; vdi golden image; onboard=0; onboardonstart; configreadtimeout; hideapponuilaunch; app store for vdi

On the App Store for VDI page (Infrastructure > Client Connector > App Store for VDI) Client Connector for VDI for Windows can be downloaded, in the latest version or one of the older versions still available. The General Availability tab shows the latest released versions, the Limited Availability tab versions not yet fully qualified, and the download icon is in the MSI URL (64 bit) column. [cloud-connector.vdi.install:download] When deploying Client Connector for VDI using Microsoft Azure, AWS, Citrix XenCenter or other device management methods that support MSI files, the downloaded MSI can be used as is; alternatively the MSI can manually install it on a device. [cloud-connector.vdi.install:msi-deployment-methods] Whether AWS is supported is recorded in [Client Connector for VDI: the multi-session Windows agent that tunnels users' traffic to Cloud and Branch Connector](kb:cloud-connector.vdi).

## MSI options

From a command prompt started as an administrator, the msiexec command for the MSI takes the options PROVURL, TOKEN, MODE, SERVERIP, ONBOARD, CONFIGREADTIMEOUT, HIDEAPPONUILAUNCH, USEEMBEDDEDBROWSER and SHOWREAUTHNOTIFICATION. [cloud-connector.vdi.install:msi-options] PROVURL takes the provisioning URL from the VDI Template and TOKEN the token value from the VDI Template. [cloud-connector.vdi.install:provurl-token] The template side is in [VDI devices, dynamic VDI groups and VDI templates (authentication type, system user, provisioning URL and token)](kb:cloud-connector.vdi.groups-and-templates).

- **MODE.** In the command-line section, MODE takes the tunneling mode as 1 or 0: Point-to-Point (P2P) is Mode 1 and Any-to-Any (A2A) is Mode 0. [cloud-connector.vdi.install:mode] The Intune section words it differently [divergence:cloud-connector.vdi.install:mode-values]. What MODE defaults to when omitted is open [gap:cloud-connector.vdi.install:mode-default].
- **SERVERIP.** SERVERIP takes the IP address of the load balancer hosting the Cloud Connector or Branch Connector, or the service interface IP address of either; alternatively a fully qualified domain name or the global VIP 185.46.212.80 can be used. The parameter is optional if the default route or 185.46.212.80 is routed to the Cloud Connector. [cloud-connector.vdi.install:serverip]
- **ONBOARD.** ONBOARD takes 0 or 1 and its default is 1: immediately after installation, Client Connector for VDI onboards itself to the Workload Communications (WLC) tenant. With the flag set to 0 it does not onboard until the VM or OS is restarted, and in a golden image clone process not until the child VMs are booted for the first time. [cloud-connector.vdi.install:onboard]
- **CONFIGREADTIMEOUT.** In the command-line section, CONFIGREADTIMEOUT takes a value between 0 and 300 seconds (default 0): the Zscaler service stores the user configuration file in the roaming folder and asks Client Connector for VDI to wait a minimum of 0 and a maximum of 300 seconds for profiles to restore, after which onboarding times out and requires intervention. It is only supported on Client Connector for VDI version 1.1.0.8 and later. [cloud-connector.vdi.install:configreadtimeout] The Intune section words it differently [divergence:cloud-connector.vdi.install:configreadtimeout-meaning].
- **HIDEAPPONUILAUNCH.** HIDEAPPONUILAUNCH takes 0 or 1 (default 0) for the application minimization behavior: 0 deactivates the minimization feature and 1 enables it, which minimizes the application when launching. [cloud-connector.vdi.install:hideapponuilaunch]
- **USEEMBEDDEDBROWSER.** USEEMBEDDEDBROWSER takes 0 or 1 (default 1) for the embedded browser behavior: 0 disables the embedded browser feature and 1 enables it, which avoids an external browser appearing during authentication. [cloud-connector.vdi.install:useembeddedbrowser]
- **SHOWREAUTHNOTIFICATION.** SHOWREAUTHNOTIFICATION takes 0 or 1 (default 1) for the reauthentication notification behavior: 0 disables it, which prevents it from appearing, and 1 allows it to appear. It is only supported on Client Connector for VDI version 1.7.0.4 and later. [cloud-connector.vdi.install:showreauthnotification]

The standard Client Connector's silent-install parameters are a different set with different names: [Silent install, upgrade, revert and uninstall parameters, and launch behavior](kb:zcc.install.windows-unattended). The command-line example image is not captured [gap:cloud-connector.vdi.install:command-line-image].

## Golden images

The Azure Virtual Desktop, AWS and Citrix XenDesktop golden-image sections of the MSI article each say the ONBOARD=0 flag must be used for golden image deployments. [cloud-connector.vdi.install:golden-image-onboard-0] In the Azure Virtual Desktop and AWS golden-image sections, the prepared VM or image is not booted until after it is cloned to the host pool instances, and Client Connector for VDI is not started or rebooted when creating a golden image. [cloud-connector.vdi.install:golden-image-no-boot] The Azure Virtual Desktop, AWS and Citrix XenDesktop sections each say that when updating a golden image VM installed with ONBOARD=0, if the VM must be rebooted for any reason, Client Connector for VDI is uninstalled and reinstalled with ONBOARD=0 prior to the Sysprep, shutdown and clone process. The Azure Virtual Desktop and AWS sections add that onboarding while rebooting can also be prevented. [cloud-connector.vdi.install:golden-image-reboot] Whether the steps the Citrix section omits apply to Citrix is open [gap:cloud-connector.vdi.install:golden-image-citrix].

If the hKey is manually created in the Windows registry path L"SOFTWARE\\Zscaler Inc.\\ZScaler VDI", the OnboardOnStart registry option overrides the ONBOARD installation parameter. With dwValue=0 Client Connector for VDI does not onboard, even on system reboot; with dwValue=1 it onboards for all conditions. When deploying a child image, Zscaler recommends removing the registry key so that the installation parameter can take precedence. [cloud-connector.vdi.install:onboardonstart] The hive and the screenshot are open [gap:cloud-connector.vdi.install:onboardonstart-details].

## Intune and Citrix

Deploying through Microsoft Intune, the MSI is added with App Type Line-of-business app, publisher set as Zscaler and Ignore app version set to Yes; the install options go in Command Line Arguments, and groups are added under the Required category on the Assignments tab. [cloud-connector.vdi.install:intune] The guide's best practices for Citrix say that to prevent bootup during MCS creation the Zscaler service and ZCCVDIService must not be running, that onboarding parameter 0 is used when installing on a Citrix image VM, and that with XenApp Zscaler recommends always using an embedded browser and SSO. [cloud-connector.vdi.install:citrix-practices]

## Processes to allowlist

Zscaler recommends allowlisting Client Connector for VDI processes, and the article says allowlisting is possible only in Windows: %ProgramFiles%\ZCCVDI\ZCCVDIHelper.exe, %ProgramFiles%\ZCCVDI\ZCCVDIService.exe, %ProgramFiles%\ZCCVDI\ZCCVDIUI\ZCCVDIUI.exe, %ProgramFiles%\ZCCVDI\ThirdParty\WebView2\MicrosoftEdgeWebview2Setup.exe and the %ProgramData%\ZCCVDI directory. [cloud-connector.vdi.install:allowlist-paths] ZCCVDIHelper is an internal process used by other Client Connector for VDI processes, ZCCVDIUI is the user interface, ZCCVDIService is the main service that manages all other internal services, and ProgramData\ZCCVDI is the directory that stores logs and configuration. [cloud-connector.vdi.install:process-roles] The allowlist article says that if there is a firewall managed by group policy object (GPO), firewall rules can be configured on the endpoint protection product for the ZCCVDI processes for all ports, protocols, network interfaces and network addresses, with ZCCVDIUI.exe and ZCCVDIService.exe both Outbound. [cloud-connector.vdi.install:gpo-firewall]

Sources disagree (name both sides):
- The command-line section gives MODE as 1 or 0; the Intune section of the same article gives the tunneling mode as A2A or P2P. [divergence:cloud-connector.vdi.install:mode-values]
  - zscaler-help: MODE takes 1 (P2P) or 0 (A2A).
  - zscaler-help: In the Intune Command Line Arguments, "CCC" is the tunneling mode (A2A or P2P).
  Impact: The article does not say whether Intune takes the strings A2A and P2P or the integers 1 and 0.
- The command-line section describes CONFIGREADTIMEOUT as how long Client Connector for VDI waits for profiles to restore; the Intune section describes it as how long the Zscaler service stores the user configuration file in the roaming folder. [divergence:cloud-connector.vdi.install:configreadtimeout-meaning]
  - zscaler-help: Client Connector for VDI waits 0 to 300 seconds for profiles to restore.
  - zscaler-help: In the Intune Command Line Arguments, "FFF" is how long the Zscaler service stores the user configuration file in the roaming folder.
  Impact: A wait for profile restore and a storage duration are different meanings for one parameter; the article does not say which governs.

Not known (open gaps):
- What MODE defaults to when omitted [gap:cloud-connector.vdi.install:mode-default]: settled by lab-test or support-ticket
- Whether the golden-image steps the Citrix section omits apply to Citrix [gap:cloud-connector.vdi.install:golden-image-citrix]: settled by support-ticket or lab-test
- Which registry hive holds OnboardOnStart [gap:cloud-connector.vdi.install:onboardonstart-details]: settled by lab-test or support-ticket
- The example command line using all the install options [gap:cloud-connector.vdi.install:command-line-image]: settled by source-read

Area: cloud-connector.vdi, its subjects in references/_meta/spine/cloud-connector/cloud-connector.vdi.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/cloud-connector/cloud-connector.vdi.groups-and-templates.md (VDI devices, dynamic VDI groups and VDI templates (authentication type, system user, provisioning URL and token)): PROVURL takes the provisioning URL from the VDI Template and TOKEN the token value from the VDI Template. [cloud-connector.vdi.install:provurl-token]
- links-to references/_meta/text/cloud-connector/cloud-connector.vdi.md (Client Connector for VDI: the multi-session Windows agent that tunnels users' traffic to Cloud and Branch Connector)
- links-to references/_meta/text/zcc/zcc.install.windows-unattended.md (Silent install, upgrade, revert and uninstall parameters, and launch behavior)
