# Runbook: Network Error (Network Connection Failed. -8.), its log strings and DNS checks (zcc.troubleshooting.forwarding-runbook.network-error)
Also called: Network Error; Network Connection Failed. -8.

**Symptoms.** Listed symptoms of Network Error, which appears when Client Connector is unable to connect to the Zscaler cloud due to connectivity issues: the Internet Security window shows Network Connection Failed. -8., and logs indicate DNS resolution failures, connection resets, SSL interception, or unreachable hosts. [zcc.troubleshooting.forwarding-runbook.network-error:symptoms] [divergence:zcc.troubleshooting.forwarding-runbook.network-error:network-error-meaning] Error -8 is defined in [Client Connector error codes: cloud authentication, cloud, Admin Console and Report an Issue](kb:zcc.troubleshooting.error-codes); whether that table covers other ZSTray error numbers is open [gap:zcc.troubleshooting.forwarding-runbook.network-error:error-minus-8]. In the runbook's log examples of critical URLs (e.g., mobile.zscaler.net, login.<cloud_name>.net, mobile.<cloud_name>.net), Client Connector uses those hostnames for control communication and needs uninterrupted access to them; failed responses include Host not found, Connection reset by peer, No route to host or Timeout. [zcc.troubleshooting.forwarding-runbook.network-error:critical-urls]

**Log strings.** The runbook's ZSTray log samples show error -8 with errorMessage Host not found (DNS failure), Connection reset by peer (connection interrupted), Net Exception. No route to host (missing route) and Net Exception. Network is unreachable (network unreachable). [zcc.troubleshooting.forwarding-runbook.network-error:zstray-errors] The runbook's samples for an intercepted SSL connection show error -8 with Certificate validation error. Unacceptable certificate from mobile.zscloud.net: application verification failure and SSL Exception. error:14090086:SSL routines:ssl3_get_server_certificate:certificate verify failed. [zcc.troubleshooting.forwarding-runbook.network-error:ssl-intercepted-errors]

**Checks.** The runbook says to test the three Zscaler URLs with ping, nslookup or traceroute, allow outbound ports 80 and 443, and test DNS with nslookup or dig, including an alternate DNS server such as Google DNS 8.8.8.8. [zcc.troubleshooting.forwarding-runbook.network-error:connectivity-and-dns] If DNS resolution shows an IPv6 address, the runbook says to test with IPv6 disabled on the network adapter; if the result is not in the Zscaler hub IP range (https://config.zscaler.com/<cloud_name>/hubs), it says to verify custom entries in the Windows hosts file and add a prefix # to comment out the custom entries if required. [zcc.troubleshooting.forwarding-runbook.network-error:dns-result-checks] The runbook says the active network adapter should be configured correctly with tethering and virtual adapters avoided, and that VPN clients or endpoint security tools can be disabled temporarily to rule out conflicts. [zcc.troubleshooting.forwarding-runbook.network-error:adapter-and-conflicts]

Sources disagree (name both sides):
- The forwarding runbook says Network Error appears when Client Connector cannot connect to the Zscaler cloud due to connectivity issues, while the connection status errors article says Network Error means no network interface is detected. [divergence:zcc.troubleshooting.forwarding-runbook.network-error:network-error-meaning]
  - zscaler-help: Network Error appears when Client Connector is unable to connect to the Zscaler cloud due to connectivity issues, with logs showing DNS failures, connection resets, SSL interception or unreachable hosts.
  - zscaler-help: Network Error means no network interface is detected; the action is Retry, then More > Restart Service.
  Impact: The two pages give different meanings for the same Service Status label, so a Network Error does not by itself tell an admin whether the device has no interface or cannot reach the cloud. Check the Client Connector logs for the -8 errorMessage before choosing between interface and cloud-reachability checks.

Not known (open gaps):
- Whether the error-code table that defines -8 covers other ZSTray error numbers [gap:zcc.troubleshooting.forwarding-runbook.network-error:error-minus-8]: settled by source-read or support-ticket

Area: zcc.troubleshooting, its subjects in references/_meta/spine/zcc/zcc.troubleshooting.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.troubleshooting.error-codes.md (Client Connector error codes: cloud authentication, cloud, Admin Console and Report an Issue)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.troubleshooting.forwarding-runbook.md (Client Connector forwarding runbook: the five errors and where each is worked (captive portal and driver error held here))
- see-also references/_meta/text/zcc/zcc.troubleshooting.service-status-errors.md (Error messages in Client Connector's Service Status field and the action for each)
- see-also references/_meta/text/zcc/zcc.troubleshooting.forwarding-runbook.connection-error.md (Runbook: Connection Error and Server Down Error, getSmeProxyState values and Tunnel 2.0 logs)
