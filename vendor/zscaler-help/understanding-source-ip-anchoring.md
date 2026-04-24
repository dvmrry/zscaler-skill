# Understanding Source IP Anchoring

**Source:** https://help.zscaler.com/zia/understanding-source-ip-anchoring
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help 
Policies 
Forwarding Control 
Dedicated IP 
Customer-Managed Dedicated IP (Source IP Anchoring) 
Understanding Source IP Anchoring
Internet & SaaS (ZIA)
Understanding Source IP Anchoring
Ask Zscaler

Forwarding policies for Source IP Anchoring allow organizations to steer selective traffic processed by ZIA to the internal or external destination servers of their choice. This ensures that Zscaler secures the traffic and that the source IP address is the organization's choice.

The source IP address of the traffic reaching the destination is the IP address of the Zscaler Private Access (ZPA) App Connector deployed as part of Source IP Anchoring.

The application traffic is forwarded through the intranet to the internal destination servers and through the internet to the external destination servers.

Source IP Anchoring does not support the Real Time Streaming Protocol (RTSP).

Source IP Anchoring uses forwarding policies and Zscaler Private Access (ZPA) App Connectors to selectively forward the application traffic to the appropriate destination servers. You can configure granular policies in the ZIA Admin Portal and forward the selected traffic to ZPA through ZIA threat and data protection engines. To learn more, see Configuring Source IP Anchoring.

You don't need a ZPA license to access the Source IP Anchoring feature. However, a Source IP Anchoring subscription is required. For more information, contact Zscaler Support.

Source IP Anchoring supports ICMP requests for ICMP-enabled ZPA application segments. The following limitations apply:

Only ICMP echo requests or responses are supported.
The ICMP protocol traceroute functionality is not supported. Therefore, you must use Zscaler Digital Experience (ZDX) to trace the path of your traffic flow.
The maximum payload size for the ICMP traffic is restricted to 990 bytes.

To learn how to enable ICMP access for ZPA application segments, see Configuring Defined Application Segments.

The technology used for Source IP Anchoring is also leveraged for the following additional use cases for ZPA traffic:

Data protection
Threat scanning
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Understanding Source IP Anchoring
Configuring Source IP Anchoring
About Zscaler Private Access Gateway
Configuring ZPA Gateway
Source IP Anchoring Configuration Guide for Microsoft 365 Conditional Access
