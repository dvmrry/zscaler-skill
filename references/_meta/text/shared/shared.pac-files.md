# PAC files across Zscaler: where each question is answered (shared.pac-files)
Also called: pac file; pac files; proxy auto-config; proxy auto configuration; findproxyforurl; hosted pac file

A PAC file is JavaScript that tells a browser, or Client Connector, where to send each request. It appears in ZIA forwarding, in Client Connector profiles and in Z-Tunnel 2.0 bypasses, and each use has its own subject.

1. **What PAC forwarding is, and its limits.** Benefits, limitations, the default files and versioning: [PAC file forwarding: limits, versions and what it cannot cover](kb:zia.traffic-forwarding.pac).
2. **How a file is written.** The function, return statements, Public Service Edge ports and the vendor's performance and authoring rules: [Writing a PAC file for Zscaler: function, return statements, ports and performance rules](kb:shared.pac-files.syntax).
3. **What the service substitutes.** Gateway, host, load-balancing, country, subcloud and Client Connector variables, which work only in Zscaler-hosted files: [Zscaler PAC file variables: gateways, hosts, load-balancing tokens, subclouds and Client Connector](kb:shared.pac-files.variables).
4. **Kerberos users.** The Kerberos PAC file, port 8800 and the KDC proxy and realm bypasses: [The Kerberos PAC file: host-name variables, port 8800 and required bypasses](kb:shared.pac-files.kerberos).
5. **Hosting and rollout.** The Hosted PAC Files page, Obfuscate URL, character and size limits, and how fast changes reach clients: [Hosted PAC files: the console page, Obfuscate URL, limits and how changes reach clients](kb:shared.pac-files.hosting).
6. **Getting the URL onto clients.** GPO distribution and enforcement, captive portals, firewall backstops and finding the file a device uses: [Getting a PAC URL onto clients and keeping it there: GPO, browsers, enforcement, firewall](kb:shared.pac-files.client-delivery).
7. **What it leaves uncovered.** Non-web and non-browser applications, mobile users, and private-application destinations: [What PAC forwarding leaves uncovered: non-web applications, mobile users and private-application destinations](kb:shared.pac-files.coverage).

**PAC files in Client Connector.** A forwarding profile takes a PAC URL in its system proxy settings: [A PAC file reaches the profile through the system proxy settings, as PAC URL Location: a PAC URL (at most 512 characters, https:// when Enforce Secure PAC URLs is on) that the app downloads directly, or a registry key on the device that holds the URL.](kb:zcc.forwarding-profiles.internet-actions:pac-url-location); Tunnel with Local Proxy mode installs a PAC file that points at the local host: [In Tunnel with Local Proxy mode the app sets proxy settings on the device so that all proxy-aware traffic is tunneled to Zscaler, by installing a PAC file that sends all traffic to the local host.](kb:zcc.forwarding-profiles.internet-actions:local-proxy-mode). Z-Tunnel 2.0 domain bypasses use a forwarding profile PAC and an app profile PAC: [On Windows 3.7 and earlier, a domain bypass needs two PAC files: the forwarding profile PAC returns `PROXY ${ZAPP_TUNNEL2_BYPASS}` for the domain (the vendor's example then falls through to DIRECT for all other traffic, which its comment says tunnels using Tunnel2), and the app profile PAC returns DIRECT for the same domain.](kb:zcc.z-tunnel.bypasses:dual-pac).

**Automation.** The Terraform resource's version and status handling is [The zia_pac_files resource: versions, pinning and status transitions](kb:zia.terraform.pac-files); how the SDKs call the clone, validate and version endpoints is [How the SDKs call the PAC file endpoints: clone, validate and version actions](kb:zia.sdk-python.pac-files).

Area: shared.pac-files, its subjects in references/_meta/spine/shared/shared.pac-files.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.z-tunnel.bypasses.md (Bypasses for Z-Tunnel 2.0: VPN gateway bypasses, destination exclusions and inclusions, domain bypasses): For Z-Tunnel 1.0, network bypasses can go in the app profile PAC file; for Z-Tunnel 2.0 the vendor says not to put them there and to add them as VPN gateway bypasses or destination exclusions. [zcc.z-tunnel.bypasses:pac-not-for-2]
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.internet-actions.md (Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None)
- links-to references/_meta/text/shared/shared.pac-files.client-delivery.md (Getting a PAC URL onto clients and keeping it there: GPO, browsers, enforcement, firewall)
- links-to references/_meta/text/shared/shared.pac-files.coverage.md (What PAC forwarding leaves uncovered: non-web applications, mobile users and private-application destinations)
- links-to references/_meta/text/shared/shared.pac-files.hosting.md (Hosted PAC files: the console page, Obfuscate URL, limits and how changes reach clients)
- links-to references/_meta/text/shared/shared.pac-files.kerberos.md (The Kerberos PAC file: host-name variables, port 8800 and required bypasses)
- links-to references/_meta/text/shared/shared.pac-files.syntax.md (Writing a PAC file for Zscaler: function, return statements, ports and performance rules)
- links-to references/_meta/text/shared/shared.pac-files.variables.md (Zscaler PAC file variables: gateways, hosts, load-balancing tokens, subclouds and Client Connector)
- links-to references/_meta/text/zia/zia.sdk-python.pac-files.md (How the SDKs call the PAC file endpoints: clone, validate and version actions)
- links-to references/_meta/text/zia/zia.terraform.pac-files.md (The zia_pac_files resource: versions, pinning and status transitions)
- links-to references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover)
