# Client Connector performance runbook: MTU, Path MTU Discovery and the temporary Z-Tunnel 1.0 fallback (zcc.troubleshooting.performance-runbook.path-mtu)
Also called: MTU mismatch; Path MTU Discovery; MTU for Zscaler Adapter

**MTU and MSS.** Path MTU Discovery applies only to DTLS mode; in TLS mode TCP negotiates the MSS for the outer connection automatically, and the runbook says to skip its MTU section if Path MTU Discovery is enabled in the forwarding profile for DTLS. [zcc.troubleshooting.performance-runbook.path-mtu:mtu-discovery-dtls-only] In DTLS Z-Tunnel 2.0 mode the default MTU is 1400 and the MSS is MTU - 40 = 1360; in TLS, Client Connector is not involved in MSS. [zcc.troubleshooting.performance-runbook.path-mtu:dtls-default-mtu-mss] [divergence:zcc.troubleshooting.performance-runbook.path-mtu:default-mtu-behind-tunnels]

**Changing MTU.** To change MTU from the local page, enable Allow end user to override Z-Tunnel 2.0 or ZPA protocol settings, browse to http://127.0.0.1:9000/zconfig?q=@<CustomerDomain>, select a value under MTU, and click Restart Service in the More window. [zcc.troubleshooting.performance-runbook.path-mtu:mtu-local-page] The profile route to MTU testing sets MTU for Zscaler Adapter to less than 1400, preferably in increments of 50, in a new forwarding profile; the user then clicks Update Policy. [zcc.troubleshooting.performance-runbook.path-mtu:mtu-profile] If performance improves after an MTU below 1400 is set for the Zscaler Adapter, the runbook says a hop in the path has a smaller MTU, fragmenting Client Connector packets; the options are to report to the ISP or keep the value, or enable Path MTU Discovery in the forwarding profile. [zcc.troubleshooting.performance-runbook.path-mtu:mtu-improvement-meaning] [divergence:zcc.troubleshooting.performance-runbook.path-mtu:keep-mtu-vs-testing-only] [gap:zcc.troubleshooting.performance-runbook.path-mtu:mtu-test-value]

**Z-Tunnel 1.0 fallback.** If MTU changes do not help, the runbook says to switch to Z-Tunnel 1.0 for testing and data gathering; this is not a permanent solution, MTU modification is for testing only, and Z-Tunnel 1.0 cannot intercept non-web traffic. [zcc.troubleshooting.performance-runbook.path-mtu:ztunnel1-fallback] To switch temporarily to Z-Tunnel 1.0, select the Z-Tunnel 1.0 option under Forwarding Profile Action for Internet & SaaS in the new forwarding profile; the user then clicks Update Policy. [zcc.troubleshooting.performance-runbook.path-mtu:switch-to-ztunnel1-steps]

Sources disagree (name both sides):
- The runbook gives 1400 as the default MTU in DTLS Z-Tunnel 2.0 mode without qualification; the forwarding profile page gives 1400 for a direct connection and 1360 or 1300 behind GRE or IPSec tunnels. [divergence:zcc.troubleshooting.performance-runbook.path-mtu:default-mtu-behind-tunnels]
  - zscaler-help: The default MTU in DTLS Z-Tunnel 2.0 mode is 1400, and the MSS is 1360.
  - zscaler-help: The default MTU is 1400 for a direct connection and 1360 or 1300 for GRE or IPSec tunnels.
  Impact: Behind a GRE or IPSec tunnel the default to test against, and the MSS the runbook derives from it, differ by which page is read; see zcc.z-tunnel.transport:mtu.
- On the same runbook page, a smaller MTU that improves performance can be kept as the optimal value, while the later fallback text says modifying the MTU size is only for testing purposes and not a permanent solution. [divergence:zcc.troubleshooting.performance-runbook.path-mtu:keep-mtu-vs-testing-only]
  - zscaler-help: If a smaller MTU improves performance, the user can continue using that value.
  - zscaler-help: Modifying the MTU size is only for testing and the workaround is not recommended as a permanent solution.
  Impact: Whether a working reduced MTU can stay in a production forwarding profile depends on which sentence is read; the page also offers Path MTU Discovery as the alternative.

Not known (open gaps):
- Which MTU values the runbook expects to try below 1400 [gap:zcc.troubleshooting.performance-runbook.path-mtu:mtu-test-value]: settled by source-read or lab-test

Area: zcc.troubleshooting, its subjects in references/_meta/spine/zcc/zcc.troubleshooting.json
