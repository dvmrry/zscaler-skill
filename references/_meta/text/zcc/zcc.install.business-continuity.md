# Business Continuity in Client Connector: availability, the Business Continuity page, the app profile switch, install parameters and enrolling during an outage (zcc.install.business-continuity)
Also called: bcpConfigFilePath; BCPCONFIGFILEPATH; bcpMAPublicKeyHash; BCPMAPUBKEYHASH; business continuity install parameter; enroll during zpa outage

Two parameters let a fresh installation enroll new users while the Private Access cloud or the ISP is down, from a Business Continuity configuration downloaded in advance.

On Windows from Client Connector 4.6, bcpConfigFilePath (MSI `BCPCONFIGFILEPATH`) passes a predownloaded configuration file with Business Continuity settings, and bcpMAPublicKeyHash (MSI `BCPMAPUBKEYHASH`) passes the public key provided by Private Access for it, so Client Connector can enroll new users during a Private Access-related cloud outage or an ISP outage. Each requires the other. [zcc.install.business-continuity:windows] macOS takes the same pair of keys, bcpConfigFilePath and bcpMAPublicKeyHash, each requiring the other, from Client Connector 4.7.0.64. [zcc.install.business-continuity:macos]

**What it is and where it is available.** Business Continuity in Private Access allows users to continue to access applications during Private Access-related cloud outages or ISP outages; Client Connector connects users to a Private Cloud without manual intervention, for enrolled users and for new users enrolling while the Admin Console and the cloud are unavailable. [zcc.install.business-continuity:purpose] Business Continuity is available only for Client Connector 4.6 and later for Windows and 4.7 and later for macOS; the About Business Continuity and Configuring Business Continuity pages both say so. [zcc.install.business-continuity:availability] The Private Access side is in [Business Continuity for Private Access: prerequisites, domain names, settings, entering and exiting, limitations](kb:zpa.private-service-edges.business-continuity).

**The Business Continuity page.** The Business Continuity page (Infrastructure > Connectors > Client > Business Continuity) shows Private Cloud Controller DNS (the initial DNS request for the controller addresses, e.g. any2bcp.<business_continuity_domain>), Private Cloud Controller SNI (c2.<business_continuity_domain> for enrolled users or c2site.<business_continuity_domain> for new users), the Business Continuity SP URL and the SP CA Certificate. Sync retrieves the latest settings, Download Config downloads a configuration file with them for installing Client Connector, Download SP CA Certificate downloads the service provider certificate for the Business Continuity Domain, and Copy Thumbprint copies the public key for installing for a new user. [zcc.install.business-continuity:page]

**The app profile switch.** Configuring Business Continuity means ensuring the Business Continuity settings are configured, enabling Configure ZPA Business Continuity in the app profile, and downloading the config file and copying the thumbprint from the Business Continuity page. [zcc.install.business-continuity:configuring] What Configure ZPA Business Continuity contains is open [gap:zcc.install.business-continuity:configure-contents].

**What users see.** If Business Continuity is enabled, enrolled users automatically access the Private Cloud during an outage and keep access to their applications based on their app profile; during the outage the Update App and Update Policy options are not available in the About section of the More window. [zcc.install.business-continuity:enrolled-users] The app can authenticate with the Private Cloud and apply a stored app profile; the stored app profile from the configuration file is used until the Zscaler back-end servers can retrieve the config profile. [zcc.install.business-continuity:stored-profile]

**Enrolling new users during an outage.** New users can also be enrolled during the outage even though the Admin Console and the cloud are unavailable, including when they hit authentication issues or upstream communication failures (such as DNS exceptions, connection timeouts or socket unreachable) during enrollment. Before an outage a configuration file with Business Continuity settings and a public key must be downloaded; they are passed in an installer option, installing through an MDM or GPO. [zcc.install.business-continuity:new-users] For Client Connector 5.0 and later for Windows, another installer option can be passed that enables Business Continuity if users experience network or authentication issues during enrollment. [zcc.install.business-continuity:windows-5-option] The name of that Windows 5.0 option is open [gap:zcc.install.business-continuity:windows-5-option-name].

**Upgrades.** If a Windows device on a Client Connector version earlier than 5.0 is in Business Continuity mode when the upgrade starts and is still in it after upgrading to 5.0 or later, the user must reauthenticate to Private Access after the upgrade. [zcc.install.business-continuity:upgrade-reauth]

What to check:
1. Whether both the file path and the public key hash are passed, and whether the Client Connector version is new enough for the platform.

Not known (open gaps):
- The name of the Windows 5.0 installer option that enables Business Continuity [gap:zcc.install.business-continuity:windows-5-option-name]: settled by source-read
- What Configure ZPA Business Continuity contains [gap:zcc.install.business-continuity:configure-contents]: settled by source-read or lab-test

Area: zcc.install, its subjects in references/_meta/spine/zcc/zcc.install.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.private-service-edges.business-continuity.md (Business Continuity for Private Access: prerequisites, domain names, settings, entering and exiting, limitations)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.install.md (Client Connector install parameters and deployment)
