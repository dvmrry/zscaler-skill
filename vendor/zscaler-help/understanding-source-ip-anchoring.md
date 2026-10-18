# Understanding Source IP Anchoring

**Source:** https://help.zscaler.com/zia/understanding-source-ip-anchoring
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401401, revision 3209413

---

Forwarding policies for Source IP Anchoring allow organizations to steer selective traffic processed by Internet & SaaS (ZIA) to the internal or external destination servers of their choice. This ensures that Zscaler secures the traffic and that the source IP address is the organization's choice.
The source IP address of the traffic reaching the destination is the IP address of the Private Access (ZPA) App Connector deployed as part of Source IP Anchoring.
The application traffic is forwarded through the intranet to the internal destination servers and through the internet to the external destination servers.
Source IP Anchoring does not support the Real Time Streaming Protocol (RTSP).
Source IP Anchoring uses forwarding policies and Private Access App Connectors to selectively forward the application traffic to the appropriate destination servers. You can configure granular policies in the Zscaler Admin Console and forward the selected traffic to Private Access through Internet & SaaS threat and data protection engines. To learn more, see Configuring Source IP Anchoring.
You don't need a Private Access license to access the Source IP Anchoring feature. However, a Source IP Anchoring subscription is required. For more information, contact Zscaler Support.
Source IP Anchoring supports ICMP requests for ICMP-enabled Private Access application segments. The following limitations apply:
- Only ICMP echo requests or responses are supported.
- The ICMP protocol traceroute functionality is not supported. Therefore, you must use Digital Experience (ZDX) to trace the path of your traffic flow.
- The maximum payload size for the ICMP traffic is restricted to 990 bytes.
To learn how to enable ICMP access for Private Access application segments, see Configuring Defined Application Segments.
The technology used for Source IP Anchoring is also leveraged for the following additional use cases for Private Access traffic:
- Data protection
- Threat scanning
