# DNS optimization: proxy-side DNS lookup that overrides the client-resolved IP (zia.advanced-settings.dns-optimization)
Also called: DNS optimization; Optimize DNS Resolution; Prefer SNI over CONNECT Host for DNS Resolution; Optimize All for IPv6; Do Not Optimize These FQDN

DNS optimization lets Zscaler perform a DNS lookup and override the externally resolved IP addresses in outbound HTTP or HTTPS connections, to establish a connection to a destination server geographically closer to the Service Edge (Public, Private or Virtual). The page says it ensures reduced latency and increased performance efficiency, is an effective technique to mitigate ECH-based domain fronting evasions, and prevents DNS spoofing. [zia.advanced-settings.dns-optimization:what] DNS optimization does not affect the DNS resolution process configured for the organization and does not operate on DNS packets, but on the HTTP header of unencrypted HTTP traffic or the SNI field in the TLS hello for HTTPS. After DNS resolution, when the client makes its initial HTTP or HTTPS request to the IP address in the DNS response, the Zscaler proxy intercepts the request and performs a DNS lookup, and overrides the externally resolved IP address if the lookup returns a different one. [zia.advanced-settings.dns-optimization:mechanism] DNS optimization applies only to Z-Tunnel 2.0 and transparent mode traffic (for example, traffic via GRE or IPSec tunnels without a PAC file). Using authentication bypass or SSL/TLS bypass does not affect it because the domain name is still visible in the SNI. [zia.advanced-settings.dns-optimization:scope]

**Lists.** DNS optimization is enabled with the Optimize DNS Resolution checkbox and configured individually for URL categories, cloud applications (Optimize These Cloud Applications requires Advanced Firewall) and FQDNs (Optimize These FQDN accepts IP addresses or FQDNs). The page also says you can add up to 25,000 custom URLs (across all categories). The Do Not Optimize These URL Categories and Do Not Optimize These FQDN fields exclude entries by overriding the include list, and the page says to add the internal domains prod.zpath.net, gateway.<cloud>.net, ecservice.<cloud>.net and ecgw.<cloud>.net to the Do Not Optimize These FQDN field. [zia.advanced-settings.dns-optimization:lists]

**SNI instead of the CONNECT host.** Prefer SNI over CONNECT Host for DNS Resolution uses the SSL/TLS client hello SNI for DNS resolution instead of the CONNECT host for forward proxy connections. It works only if the CONNECT host is not part of an SSL/TLS policy, and it handles exceptions such as a malformed but valid SNI server name that is not parsable to the actual resolvable domain. [zia.advanced-settings.dns-optimization:prefer-sni] The block that compares the two is in [HTTP CONNECT tunnel control and the domain fronting blocks in Advanced Settings](kb:zia.advanced-settings.http-tunnel-control).

**IPv6.** When IPv6 support is enabled for the organization, DNS optimization for IPv6 connections is automatically enabled for all URL categories and cloud applications; the service might override externally resolved IPv6 addresses to establish an IPv6 or IPv4 connection to a destination server geographically closer to the Service Edge. Optimize All for IPv6 applies it to all URL categories and cloud applications, and Optimize These Cloud Applications for IPv6 (requires Advanced Firewall) selects specific applications. [zia.advanced-settings.dns-optimization:ipv6]

This is not the DNS Control policy ([ZIA DNS Control](kb:zia.dns-control)); the settings page is routed in [ZIA Advanced Settings page: its sections, three settings explained here, and where other sections are routed](kb:zia.advanced-settings).

What to check:
1. Whether the traffic is Z-Tunnel 2.0 or transparent-mode traffic, since DNS optimization applies only to those.
2. Whether the internal domains are in the Do Not Optimize These FQDN list.

Area: zia.advanced-settings, its subjects in references/_meta/spine/zia/zia.advanced-settings.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.advanced-settings.md (ZIA Advanced Settings page: its sections, three settings explained here, and where other sections are routed)
- links-to references/_meta/text/zia/zia.advanced-settings.http-tunnel-control.md (HTTP CONNECT tunnel control and the domain fronting blocks in Advanced Settings)
- links-to references/_meta/text/zia/zia.dns-control.md (ZIA DNS Control)
