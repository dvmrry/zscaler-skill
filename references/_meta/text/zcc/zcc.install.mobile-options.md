# iOS and Android-only install keys (zcc.install.mobile-options)
Also called: newBindFlow; PAVConnectionSynced; SkipInterfaceInstallation; DropNonRoutingTraffic; MatchDomainsNoSearch; disableCaptivePortalNotification; SystemDNSEnabled; customDNS; allowRunningOnRootedDevice; allowZccOnRootedDevice; allowRunningOnEmulator; allowZccOnEmulator; httpAuthAllowedHosts

Besides the shared enrollment keys, the iOS and Android parameter tables carry keys for their own tunnel, DNS and device checks.

## iOS

- **Per-app VPN.** For per-app VPN deployments on iOS, newBindFlow enables a multithreaded binding of Client Connector's microservices to its virtual interface (on by default), and PAVConnectionSynced delays the per-app VPN connection until Client Connector is connected (off by default). [zcc.install.mobile-options:ios-per-app-vpn]
- **Tunnel and notification switches.** Other iOS keys, all off by default: SkipInterfaceInstallation shows the VPN icon only while the user is logged in to Client Connector (Tunnel SDK 3.7 or later); DropNonRoutingTraffic drops traffic without routes; MatchDomainsNoSearch stops Private Access match domains being appended as search domains; disableCaptivePortalNotification suppresses notifications when a captive portal is detected. [zcc.install.mobile-options:ios-switches]
- **DNS.** On iOS, SystemDNSEnabled makes Client Connector resolve DNS queries that are not forwarded to the Zscaler cloud with the system DNS, falling back to Google DNS if that fails; 1 enables it and 2, the default, disables it. [zcc.install.mobile-options:ios-system-dns]

## Android and Android on ChromeOS

- **DNS.** On Android, Client Connector uses the device's DNS server by default; customDNS sets another DNS server by IP address. [zcc.install.mobile-options:android-custom-dns]
- **Rooted devices and emulators.** Client Connector does not run on rooted Android devices or emulators unless allowRunningOnRootedDevice (from 3.7, formerly allowZccOnRootedDevice) or allowRunningOnEmulator (formerly allowZccOnEmulator) is set to 1. [zcc.install.mobile-options:android-rooted-emulator]
- **SAML authentication hosts.** On Android from 4.2, httpAuthAllowedHosts lists the hosts allowed for HTTP Basic authentication in the SAML WebView and for client certificate requests during SAML authentication; requests from other hosts are cancelled. It is mandatory for those requests, takes FQDNs without scheme or path, rejects wildcards, and a listed domain also matches its subdomains. [zcc.install.mobile-options:android-http-auth-hosts]

Area: zcc.install, its subjects in references/_meta/spine/zcc/zcc.install.json
