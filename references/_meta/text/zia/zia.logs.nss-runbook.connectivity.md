# NSS runbook: connectivity failures between NSS and the Central Authority, Nanolog server and SIEM (zia.logs.nss-runbook.connectivity)
Also called: Connectivity Between NSS and Zscaler Cloud or SIEM

**The three connections.** The runbook treats NSS connectivity as three basic connections (Zscaler Central Authority server, Zscaler Nanolog server, SIEM), checked with sudo nss troubleshoot connection or netstat, and expects the connections on the NSS cloud config page to be allowed on the network. [zia.logs.nss-runbook.connectivity:three-connections] [divergence:zia.logs.nss-runbook.connectivity:third-connection] If both the Zscaler Nanolog server and SIEM connections fail, troubleshoot the SIEM connection first because the Nanolog server connection depends on the SIEM connection being established. [zia.logs.nss-runbook.connectivity:siem-before-nanolog]

**Central Authority.** For a failing CA connection the runbook checks from sudo nss test-firewall output whether smcacluster.<cloud>.net resolves, and compares the DNS server in /etc/resolv.conf via nslookup with public DNS 8.8.8.8. [zia.logs.nss-runbook.connectivity:ca-dns] The runbook says a CA round trip time above 200ms is expected because the CA connection could be overseas, but a time as high as above 400ms needs investigation from the NSS network perspective. [zia.logs.nss-runbook.connectivity:ca-rtt] A successful connect=tcp to the CA does not rule out an SSL problem, so the runbook tests connect=ssl too; an intermediate device performing SSL inspection might intercept and drop the connections. [zia.logs.nss-runbook.connectivity:ca-ssl-inspection] On a management-interface capture for CA communication, SYN packets with no SYN-ACK are silent drops, and reset packets with a TTL differing from the other packets from the CA IP indicate a block by an intermediate device. [zia.logs.nss-runbook.connectivity:ca-packet-capture] [divergence:zia.logs.nss-runbook.connectivity:ca-capture-interface] If a capture shows no requests to the CA and only unanswered ARP requests, the runbook says it is likely an interface IP configuration issue and lists checks on gateway reachability, unique service and management IPs in one subnet, unique MAC addresses and, as a last resort, redeploying the OVA. [zia.logs.nss-runbook.connectivity:arp-only-interface-config]

**Nanolog server.** A high Recv-Q in sudo /sc/bin/smmgr -ys smnet=netstat reflects the queue between the Nanolog server and NSS; if it is overutilized the runbook checks bandwidth requirements against the NSS deployment guide and gives 11 Mbps for 10K users as an example average value. [zia.logs.nss-runbook.connectivity:nanolog-recv-q] For Nanolog connectivity the runbook takes a capture on the service interface to analyze communication with the Nanolog server. [zia.logs.nss-runbook.connectivity:nanolog-packet-capture]

**SIEM.** For a failing SIEM connection the runbook checks the SIEM IP, port and feed filters with sudo /sc/bin/smmgr -ys getsminfo=nss_feed_info_all, tests reachability on the configured port with connect=tcp, and says to allowlist the NSS IP on filtering devices in between. [zia.logs.nss-runbook.connectivity:siem-checks]

Sources disagree (name both sides):
- The runbook's connectivity checks name SIEM as the third of three connections, while its connection-test step names NSS as the third. [divergence:zia.logs.nss-runbook.connectivity:third-connection]
  - zscaler-help: The three basic connections are the Central Authority server, the Nanolog server and the SIEM.
  - zscaler-help: sudo nss troubleshoot connection checks three connections towards CA, the Nanolog server and NSS.
  Impact: The page does not say whether the third connection is SIEM or NSS. Do not tell an admin which third connection the command checks without saying the page names both.
- The runbook's CA steps take the capture on the management interface, while its capture guidance puts connectivity checks toward the CA on the service interface. [divergence:zia.logs.nss-runbook.connectivity:ca-capture-interface]
  - zscaler-help: For CA communication, capture on the management interface.
  - zscaler-help: For connectivity issues with CA, the Nanolog server or SIEM, capture on the service interface.
  Impact: The page does not say which interface to capture for a CA connection problem. Do not name one interface as the answer; the CA steps and the capture guidance differ.

Area: zia.logs, its subjects in references/_meta/spine/zia/zia.logs.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.logs.nss-runbook.md (How the Internet & SaaS NSS support troubleshooting runbook triages a case and routes it to its pages)
- see-also references/_meta/text/zia/zia.logs.nss-runbook.diagnostics.md (NSS runbook data collection: health and network commands, packet capture and NSS log files)
- see-also references/_meta/text/zia/zia.logs.nss-runbook.vm-health.md (NSS runbook: VM-based NSS Unhealthy server, alerts and build upgrade checks)
- see-also references/_meta/text/zia/zia.logs.nss-runbook.log-loss.md (NSS runbook: missing and delayed logs on VM-based NSS, smstat counters and where the loss occurs)
- see-also references/_meta/text/shared/shared.nss.vm-operations.md (Operating and troubleshooting a deployed NSS VM: the nss command set, error codes and connection checks)
- see-also references/_meta/text/shared/shared.nss.vm-network.md (NSS VM interfaces and firewall requirements: management and service roles, outbound-only, no SSL inspection)
