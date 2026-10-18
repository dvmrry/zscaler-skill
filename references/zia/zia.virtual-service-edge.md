A Virtual Service Edge (VSE) is the software form factor of an on-premises Service Edge. Questions about it split cleanly, and the answers differ by platform, so establish the platform first.

1. **Where can it run, and what version?** The platform list, which platforms can cluster, and the image requirements: [[zia.virtual-service-edge.platforms]].
2. **How much can one VM do?** Throughput, SSL connections per second, memory and the SSL card: [[zia.virtual-service-edge.sizing]].
3. **What is a cluster, and what does one need?** Size limits, licensing, the cluster object, binding to a Location: [[zia.virtual-service-edge.clusters]]. How traffic is spread and how the cluster fails over: [[zia.virtual-service-edge.load-balancing]].
4. **What does the network have to provide?** [[zia.virtual-service-edge.network-requirements]].
5. **Who runs it day to day?** Upgrades, who can see it, logging and hardening: [[zia.virtual-service-edge.upgrades]], [[zia.virtual-service-edge.operations]].
6. **What does it not do, and how is it automated?** [[zia.virtual-service-edge.limits]], [[zia.virtual-service-edge.api-surface]].

The hardware form factor is a different operating model with different limits: [[zia.private-service-edge]]. Do not reuse its sizing or its Zscaler-managed assumptions here.
