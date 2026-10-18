# Understanding Nanolog Streaming Service (NSS)

**Source:** https://help.zscaler.com/zia/understanding-nanolog-streaming-service
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399061, revision 3240585

---

Watch a video about Nanolog Streaming Service (NSS) (shows legacy UI).
Zscaler's Nanolog Streaming Service (NSS) is a family of products that enable Zscaler cloud communication with third-party security solution devices for exchanging event logs.
# Log Streaming
This provision allows streaming of all logs from the Zscaler Nanolog to your security information and event management (SIEM) system with the following offerings:
- Virtual machine (VM)-based NSS: Uses a VM set within your network to stream logs to your SIEM over a raw TCP connection or HTTP connection.
- Cloud NSS: Uses an HTTPS API feed to push logs to an HTTPS API-based log collector on your SIEM.
Through SIEM integration, you can leverage VM-based NSS or Cloud NSS to enable real-time alerting on security events of your choice, correlate Zscaler's logs with the logs from your other devices, and locally set up long-term log archival.
To learn more, see:
- About VM-based NSS
- The NSS uses a deployed virtual machine (VM) to stream logs to your SIEM system. Zscaler offers the following NSS subscriptions:
  - NSS for Web: Streams web and mobile traffic logs.
  - NSS for Firewall: Streams logs from the Zscaler Firewall.
- As shown in the following diagram, the web and Firewall logs are stored in the Nanolog in the Zscaler cloud. When you deploy one NSS for web and another for Firewall logs, each NSS opens a secure tunnel to the Nanolog in the Zscaler cloud. The Nanolog then streams copies of the logs to each NSS in a highly compressed format to reduce bandwidth footprint. The original logs are retained in the Nanolog.
- When an NSS receives the logs from the Nanolog, it decompresses and detokenizes them, applies the configured filters to exclude unwanted logs, and converts the filtered logs to the configured output format so that they can be consumed and parsed by your SIEM. There are two types of NSS feeds:
  - TCP Feed: Uses a TCP connection to stream the logs between NSS and your SIEM.
  - HTTPS Feed: Uses the TLS protocol to load-balance and encrypt syslog feeds between NSS and your SIEM.
- As part of VM-based deployment, you add NSS servers and configure NSS feeds in the Zscaler Admin Console to specify the data that the NSS sends to your SIEM. To learn more, see About NSS Servers and About NSS Feeds.
- After deployment, the NSS requires minimal administration and automatically polls the Zscaler service for updates and installs them. For monitoring purposes, you can configure a separate feed for NSS alerts. The service sends the alerts in an RFC-compliant Syslog format to the specified IP address and port.
- The NSS has the following reliability mechanisms:
  - NSS to SIEM: The NSS buffers the logs in the VM memory to increase its resiliency to transient network issues between the SIEM and NSS. If the connection drops, the NSS replays logs from the buffer, according to the Duplicate Logs setting.
  - Nanolog to SIEM: If the connectivity between the Zscaler cloud and NSS is interrupted, the NSS misses logs that arrived at the Nanolog cluster during the interruption, and they are not delivered to the SIEM. When the connection is restored, the NSS one-hour recovery allows the Nanolog to replay logs up to one hour back.
  - To enable the NSS one-hour recovery for your organization, contact Zscaler Support.
- Additionally, if you have Advanced Sandbox, you can open a Sandbox Detail Report based on the MD5 parameter that you retrieve from your logs in the SIEM.
## About NSS Deployment Guides
- The following guides detail the requirements and steps to deploy NSS via the appropriate platform:
  - NSS Deployment Guide for Amazon Web Services
  - NSS Deployment Guide for Google Cloud Platform
  - NSS Deployment Guide for Hyper-V
  - NSS Deployment Guide for Microsoft Azure
  - NSS Deployment Guide for Nutanix
  - NSS Deployment Guide for VMware vSphere
- The architecture remains the same regardless of the deployment method selected.
## About SIEM Integration for NSS
- You can integrate NSS with any SIEM system. For a list of SIEMs verified for compatibility, see Integrating VM-Based NSS with SIEMs.
- About Cloud NSS
- You can optionally subscribe to Cloud NSS, enabling direct cloud-to-cloud log streaming for all Internet & SaaS (ZIA) log types into a compatible cloud-based SIEM without any on-premises connectors. Zscaler offers Cloud NSS for Web and Cloud NSS for Firewall subscriptions.
- Instead of deploying, managing, and monitoring NSS VMs, you can configure an HTTPS API feed to push logs from the Zscaler cloud into an HTTPS API-based log collector on your SIEM. As a result, you can focus on meaningful log analysis activities (e.g., detection, hunting, investigation, alerting), rather than the administration of logging infrastructure.
- Cloud NSS supports a customizable HTTPS outbound connector, allowing interoperability with most private and public cloud-based SIEMs that support a stateless log ingestion API. Zscaler can POST batches of logs if the SIEM exposes a publicly routable HTTPS log collection API (e.g., Splunk HTTP Event Collector). HTTPS is the more reliable and preferred approach for log delivery over the internet.
- If the connection between the Nanolog cluster and the SIEM is interrupted, logs are not delivered to the SIEM. When the connection is restored, the Cloud NSS one-hour recovery, provided by a separate Zscaler capability, allows the Nanolog to replay logs up to one hour back.
- You can create one Cloud NSS feed per Internet & SaaS log type per Cloud NSS instance. When configuring a Cloud NSS feed, you can customize the feed format; Zscaler recommends using JSON. To learn more, see About Cloud NSS Feeds.
- After deployment, you have access to continuous monitoring and alerting with Zscaler CloudOps.
- To learn more about the geo-availability and qualifications for Cloud NSS, contact Zscaler Support.
## About SIEM Integration for Cloud NSS
- You can integrate Cloud NSS with any SIEM system that exposes a publicly routable HTTPS log collection API. To see a list of SIEMs verified for compatibility, see Integrating Cloud NSS with Cloud-Based SIEMs.
- Comparison between VM-based NSS and Cloud NSS
- The following table summarizes the benefits, limitations, and requirements of the offerings:
|  | Benefits | Limitations | Requirements |
|---|---|---|---|
| VM-based NSS | Operates with minimal administration after deployment.Automatically polls the Zscaler service for updates and installs them.Supports a customizable feed format.Supports a separate alert feed for monitoring purposes.Buffers logs in the VM memory for increased resiliency.Supports TCP and HTTP(S) connection, allowing interoperability with most SIEMs. | Supports up to 16 NSS feeds per NSS server. To ensure optimal performance, Web and Firewall log types are each limited to 8 feeds per server and the HTTP logs are restricted to 2 feeds within the total. | Requires a virtual appliance for deployment. To learn more, see Deploying NSS Virtual Appliances. |
| Cloud NSS | Operates without an additional VM within your network.Supports a customizable HTTPS outbound connector, allowing interoperability with most SIEMs.Supports a customizable feed format (JSON recommended).Includes CloudOps 24/7 monitoring and alerting. | Supports one Cloud NSS feed per Internet & SaaS log type per Cloud NSS instance. | Requires a separate concurrent subscription. To learn more, contact Zscaler Support. |
# Log Collection
This provision allows for near real-time log collection from third-party vendors' firewall and web proxy devices inside your network perimeter and streaming of the logs to the Zscaler cloud by using the NSS Collector. The log data collected from third-party security solutions is integrated with Zscaler Admin Console to provide a comprehensive SaaS Security Report for a broad range of cloud application discovery and analysis.
The NSS Collector functionality and the data collected using this functionality are exclusive to the SaaS Security Report. To enable this feature for your organization, contact Zscaler Support.
To learn more, see:
- About NSS Collector
- The NSS Collector collects traffic logs from third-party syslog feeds, processes the log data, and securely pushes the logs to the Zscaler cloud over HTTPS. The NSS Collector requires a subscription to the NSS VM or Cloud NSS. The NSS Collector must be deployed on VMware within your organization’s network perimeter. The deployment involves installing the NSS Collector server using the packaged software (VM image) obtained from the Zscaler Admin Console and configuring the client certificate issued by Zscaler for the NSS Collector server.
- The following diagram shows the NSS Collector’s deployment and workflow used in the third-party log integration with Zscaler:
- When the NSS Collector service is started, it listens on a fixed port configured on your firewall to forward the logs. The firewall must also be configured to use a syslog feed format for forwarding logs to the NSS Collector’s IP address and predesignated port. The NSS Collector can collect the syslog feeds from one or many firewall devices in the CEF format over a TCP connection. Upon receiving the logs, the NSS Collector performs the following actions to process the log data:
  - Resolves user information based on integration with IdP. Unmanaged Zscaler users are categorized as Unidentified Users.
  - Resolves the URL information to facilitate cloud application discovery and analysis by Zscaler.
  - Securely transmits processed log data to the Zscaler cloud over HTTPS.
- The third-party device logs are processed by Zscaler and retained for 6 months. This data is integrated with Zscaler and is made available for cloud application discovery and analytics through the SaaS Security Report.
- The NSS Collector maintains a one-hour buffer to ensure no data loss due to communication issues with the Zscaler cloud or during maintenance procedures. If the connection between the NSS Collector and the Zscaler cloud is disrupted, the NSS Collector buffers the third-party firewall or web proxy logs and sends them when the connection is re-established. To learn about the amount of memory required to buffer the logs, see the prerequisites in NSS Collector Deployment Guide for VMware vSphere. The buffer size increases proportionally to the amount of RAM allocated to the NSS Collector.
  - An organization can have up to 4 NSS Collector servers.
  - The NSS Collector does not support historical load from the source. Records older than one hour are dropped from the stream.
- The NSS Collector restricts the log events streaming to the Zscaler cloud to 10K events per second. Events that exceed the rate limit are dropped.
## About NSS Collector Deployment Guides
- To learn more about the requirements and steps to deploy the NSS Collector via the VMware vSphere platform, see NSS Collector Deployment Guide for VMware vSphere.
