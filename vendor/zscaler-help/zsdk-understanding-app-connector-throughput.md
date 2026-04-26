# Understanding App Connector Throughput

**Source:** https://help.zscaler.com/zsdk/understanding-app-connector-throughput
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Applications 
App Connectors 
Understanding App Connector Throughput
Zscaler SDK for Mobile Apps
Understanding App Connector Throughput
Ask Zscaler

Throughput numbers are aggregated (i.e., total inbound and outbound). The following best practices apply regarding App Connector throughput sizing:

- App Connectors communicate over the provided (default) gateway, which is most likely your ISP WAN broadband connection.
- Using double encryption affects throughput. However, the effect varies based on the number of applications that are enabled for double encryption.

So, if you have a 1 Gbps connection (aggregate) in your data center, you can use the throughput guidelines in the table to make sure that you have enough App Connectors to support the connection and room for failover (N+1). For example, with a 1 Gbps connection, you would need to deploy 2 to 3 App Connectors if your applications are not using double encryption, but 4 to 6 App Connectors if they are.

The following throughput guidelines apply based upon the recommended App Connector specifications:

Per App Connector Throughput
500 Mbps
437.5 Mbps
375 Mbps
312.5 Mbps
250 Mbps

It is possible to increase App Connector throughput up to 1 Gbps per App Connector by running the App Connector on hardware with more memory and CPUs along with increased network link speed. If you have a 10 Gbps connection (aggregate) in your data center, and you want to increase the App Connector throughput up to 1 Gbps per App Connector, you can increase the underlying virtual machine (VM) spec as follows:

- 8 vCPU cores for VMs or 4 CPU cores for physical machines
- 8 GB RAM

The exact throughput can vary and depends on other network factors such as your internal network setup and latency. Make sure that you have enough App Connectors to support the connection and room for failover (N+1).

Zscaler recommends that you have more App Connectors with lower specifications rather than fewer App Connectors with higher specifications to horizontally scale your deployment. For example, if you have fewer App Connectors with higher specifications and one fails, it could adversely affect more user application traffic or sessions than a smaller App Connector that fails.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About App Connectors
Understanding App Connector Throughput
About App Connector Provisioning Keys
About App Connector Groups
