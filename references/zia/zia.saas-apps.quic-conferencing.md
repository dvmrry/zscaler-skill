QUIC (HTTP/3 over UDP, see [[zia.saas-apps]] for the other causes) is the reason an app can seem to ignore SSL inspection: SSL/TLS Inspection needs TCP session information, and QUIC does not use TCP. The headline fact, that Zscaler recommends blocking QUIC so the browser falls back to TCP, is in [[zia.ssl-inspection.uninspectable]]. {{cert-errors}}

How to block it depends on how the traffic reaches Zscaler ([[zia.firewall.traffic-path]] covers the firewall path).

- **GRE, IPSec or Client Connector with Z-Tunnel 2.0:** {{tunnel2-firewall-rule}} {{default-rule-blocks}} {{udp-80}} Rule placement follows the usual firewall order: [[zia.firewall.rule-order]].
- **Z-Tunnel 1.0:** {{tunnel1-device-firewall}} {{tunnel1-udp-leaves}}
- **TCP 80 and 443 only:** {{tcp-only-branch}}
- **Without a firewall change:** {{dns-https-records}} The DNS Control mechanics are in [[zia.dns-control]].

Conferencing is the case the old catalog singled out, naming Webex media and Teams call quality and process-based bypass; none of that is in the captured Help, so it is carried as gap `conferencing-media`. For a conferencing complaint, first establish whether the media is UDP and which tunnel mode carries it, using the facts above.
