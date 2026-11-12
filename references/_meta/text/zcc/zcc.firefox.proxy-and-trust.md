# Firefox traffic and certificate trust with and without the integration (zcc.firefox.proxy-and-trust)
Also called: firefox certificate error zscaler; firefox ssl inspection; firefox sec_error_unknown_issuer zscaler; firefox z-tunnel 2.0; firefox z-tunnel 1.0; security.enterprise_roots.enabled
Former IDs: zcc-40

Two things decide whether Firefox is covered: whether its traffic reaches Zscaler at all, and whether it trusts the certificate Zscaler presents when it inspects that traffic.

**Reaching Zscaler on Z-Tunnel 1.0.** Z-Tunnel 1.0 sends either all proxy-aware traffic or all port 80/443 traffic, depending on the forwarding profile. A Firefox that does not use the system proxy is not proxy-aware towards Client Connector, so it reaches Zscaler through Z-Tunnel 1.0 only when the profile sends port 80/443 traffic; the integration makes Firefox use the system proxy, and so proxy-aware. [zcc.firefox.proxy-and-trust:z-tunnel-1]

**Reaching Zscaler on Z-Tunnel 2.0.** Z-Tunnel 2.0 carries all ports and protocols, so Firefox traffic reaches Zscaler whether or not Firefox uses the system proxy; certificate trust still depends on Firefox's own store. [zcc.firefox.proxy-and-trust:z-tunnel-2] Domain bypasses in the app profile PAC apply only to web traffic from the system proxy: [Domain-based bypasses, for applications that do not resolve to a single IP, use PAC files and need the Z-Tunnel 1.0 listener, which can bypass only web (HTTP and HTTPS) traffic coming from the system proxy: system proxy traffic is routed to the listener and the domains are bypassed in the app profile PAC.](kb:zcc.z-tunnel.bypasses:domain-needs-listener). On Windows, Redirect Web Traffic sends TCP 80 and 443 to the listening proxy so those bypasses apply anyway: [On Windows 3.8 and later, Redirect Web Traffic to Zscaler Client Connector Listening Proxy sends TCP 80 and 443 to the listening proxy and the rest through Z-Tunnel 2.0, so app profile PAC bypasses apply to web traffic without a forwarding profile PAC.](kb:zcc.z-tunnel.bypasses:redirect-web). Whether proxy-dependent authentication and AUP flows behave the same for a Firefox that ignores the system proxy is open [gap:zcc.firefox.proxy-and-trust:z-tunnel-2-proxy-behavior].

**Trusting the inspection certificate.** Firefox keeps its own trust store, so a root in the operating system store is not enough: [Some applications keep their own certificate trust store, so installing the Zscaler root in the operating system is not enough: Firefox, Python and developer tooling are the named examples, and for non-browser applications that show SSL errors the check is whether the Zscaler root is installed in the proper repository for them.](kb:zia.ssl-inspection.certificates:own-trust-stores). Without Firefox integration, the appropriate signing certificates have to be installed manually from Firefox. [zcc.firefox.proxy-and-trust:manual-certs] Whether the integration also makes Firefox trust the operating system store is open [gap:zcc.firefox.proxy-and-trust:enterprise-roots].

**Where the operating system root comes from.** The app profile's Install Zscaler SSL Certificate puts it in the operating system store on Windows, Linux and macOS before Big Sur: [Who installs the SSL inspection certificate on Client Connector devices, per platform](kb:zcc.ssl-inspection.certificate-install).

PAC file mechanics, including what a self-hosted copy loses, are in [PAC files across Zscaler: where each question is answered](kb:shared.pac-files).

What to check:
1. For certificate errors in Firefox only, whether the integration is disabled; if so, whether the signing certificate was installed in Firefox by hand.
2. For Firefox traffic missing from ZIA logs, which Z-Tunnel version and forwarding mode the device uses.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.firefox.proxy-and-trust:z-tunnel-1] Tier B: Combines the vendor's two Z-Tunnel 1.0 modes with the integration's stated effect; no source describes Firefox under Z-Tunnel 1.0 directly.
- [zcc.firefox.proxy-and-trust:z-tunnel-2] Tier B: Follows from Z-Tunnel 2.0 carrying all ports and protocols and Firefox keeping its own trust store; no source describes Firefox under Z-Tunnel 2.0 directly.

Not known (open gaps):
- Whether the integration makes Firefox trust the operating system's certificate store [gap:zcc.firefox.proxy-and-trust:enterprise-roots]: settled by lab-test or operator-experience. Blocks: whether an integrated Firefox needs its own certificate deployment
- What Firefox loses under Z-Tunnel 2.0 when it ignores the system proxy [gap:zcc.firefox.proxy-and-trust:z-tunnel-2-proxy-behavior]: settled by lab-test. Blocks: explaining Firefox-only policy differences on Z-Tunnel 2.0

Area: zcc.firefox, its subjects in references/_meta/spine/zcc/zcc.firefox.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ssl-inspection.certificates.md (SSL/TLS inspection certificates: who signs, and where the root must be trusted): Some applications keep their own certificate trust store, so installing the Zscaler root in the operating system is not enough: Firefox, Python and developer tooling are the named examples, and for non-browser applications that show SSL errors the check is whether the Zscaler root is installed in the proper repository for them. [zia.ssl-inspection.certificates:own-trust-stores]
- links-to references/_meta/text/zcc/zcc.z-tunnel.bypasses.md (Bypasses for Z-Tunnel 2.0: VPN gateway bypasses, destination exclusions and inclusions, domain bypasses)
- depends-on references/_meta/text/zcc/zcc.firefox.integration.md (Client Connector's Firefox integration setting): When Firefox integration is enabled, Client Connector attempts to configure Firefox on macOS and Windows devices to follow Zscaler settings, by enabling Firefox's "Use system proxy settings" feature. [zcc.firefox.integration:what-it-does]
- reached-via references/_meta/text/zcc/zcc.z-tunnel.versions.md (Z-Tunnel 1.0 and 2.0: what each carries and how a profile selects one): Z-Tunnel 2.0 carries all ports and protocols, so Firefox traffic reaches Zscaler whether or not Firefox uses the system proxy; certificate trust still depends on Firefox's own store. [zcc.firefox.proxy-and-trust:z-tunnel-2]
- links-to references/_meta/text/shared/shared.pac-files.md (PAC files across Zscaler: where each question is answered)
- links-to references/_meta/text/zcc/zcc.ssl-inspection.certificate-install.md (Who installs the SSL inspection certificate on Client Connector devices, per platform)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.traffic-forwarding.zcc.md (Client Connector as a forwarding method: benefits, limits and Z-Tunnel modes)
