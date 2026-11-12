# Client Connector performance runbook: ISP UDP throttling and moving a user to TLS or the hybrid profile (zcc.troubleshooting.performance-runbook.udp-throttling)
Also called: ISP throttling UDP; switch to Z-Tunnel 2.0 TLS; hybrid configuration

**Cause.** The runbook reports that certain ISPs deprioritize UDP traffic; DTLS, the primary transport for Z-Tunnel 2.0, uses UDP 443, and deprioritization can cause overall sluggishness. [zcc.troubleshooting.performance-runbook.udp-throttling:isp-deprioritizes-udp]

**Switching to TLS.** To switch a user to TLS from the local page, enable Allow end user to override Z-Tunnel 2.0 or ZPA protocol settings under User Privacy, browse to http://127.0.0.1:9000/zconfig?q=@<CustomerDomain>, select TLS as the Protocol, and click Restart Service in the More window. [zcc.troubleshooting.performance-runbook.udp-throttling:switch-to-tls-user-override] The profile route to TLS creates a new forwarding profile with Primary Transport Selection set to TLS, maps it to a new app profile and the affected user, and the user clicks Update Policy. [zcc.troubleshooting.performance-runbook.udp-throttling:switch-to-tls-profile] If performance improves on TLS, the runbook says the ISP is throttling UDP packets and to contact the ISP; Z-Tunnel 2.0 with TLS can still intercept all ports and protocols like DTLS. [zcc.troubleshooting.performance-runbook.udp-throttling:tls-improvement-meaning]

**Hybrid.** Client Connector 3.8 introduced a feature for tailoring a new app profile for users affected by slow performance, which turns on Redirect Web Traffic to Zscaler Client Connector Listening Proxy and turns off Use Z-Tunnel 2.0 for Proxied Web Traffic in the Advanced Z-Tunnel Configuration menu while configuring the forwarding profile; web traffic then uses Z-Tunnel 1.0, non-web uses Z-Tunnel 2.0 and the forwarding profile PAC is not used. [zcc.troubleshooting.performance-runbook.udp-throttling:hybrid-configuration] [divergence:zcc.troubleshooting.performance-runbook.udp-throttling:hybrid-vs-recommend-both]

Sources disagree (name both sides):
- The runbook offers turning off Use Z-Tunnel 2.0 for Proxied Web Traffic while Redirect Web Traffic to Zscaler Client Connector Listening Proxy is on as a workaround for UDP throttling; the forwarding profile page recommends enabling both options. The forwarding profile page still lists both options under the same names and describes the same Z-Tunnel 1.0 web result. [divergence:zcc.troubleshooting.performance-runbook.udp-throttling:hybrid-vs-recommend-both]
  - zscaler-help: As a workaround until the ISP resolves UDP throttling, the hybrid configuration turns Redirect Web Traffic to the listening proxy on and Use Z-Tunnel 2.0 for Proxied Web Traffic off.
  - zscaler-help: Zscaler recommends enabling both options.
  Impact: The hybrid configuration is a stated workaround for a UDP-throttling ISP, not the recommended setting; which applies to a given user depends on whether UDP throttling was confirmed.

Area: zcc.troubleshooting, its subjects in references/_meta/spine/zcc/zcc.troubleshooting.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.z-tunnel.bypasses.md (Bypasses for Z-Tunnel 2.0: VPN gateway bypasses, destination exclusions and inclusions, domain bypasses)
- see-also references/_meta/text/zcc/zcc.troubleshooting.performance-runbook.md (How the Client Connector performance troubleshooting runbook classifies slowness by pattern and routes it to its pages)
- see-also references/_meta/text/zcc/zcc.z-tunnel.transport.md (Z-Tunnel 2.0 transport: DTLS and TLS, fallback, MTU, and what happens when the tunnel cannot be set up)
