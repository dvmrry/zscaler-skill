A Private Service Edge (PSE) question is usually one of seven, and the answers are independent enough that skipping one is how a deployment plan goes wrong.

1. **What is it, and is it the ZIA product I think it is?** Hardware in the customer's data center, run by Zscaler, and not the same thing as the ZPA Private Service Edge: [[zia.private-service-edge.what-it-is]].
2. **Do we need one at all?** The documented triggers, and the throughput thresholds that go with them: [[zia.private-service-edge.when-to-deploy]].
3. **How does a cluster behave?** Load balancer pair, active-active Service Edges, Direct Server Return, minimum node counts: [[zia.private-service-edge.cluster-architecture]].
4. **Which design and how many nodes?** [[zia.private-service-edge.sizing]].
5. **What do we have to provide?** Public addresses per node, NAT, IPv6, switch ports: [[zia.private-service-edge.ip-requirements]]. Placement, switch settings and tunnels: [[zia.private-service-edge.deployment]].
6. **How does traffic reach policy?** A cluster is brought under policy through a Location, and getting that wrong makes it an open proxy: [[zia.private-service-edge.location-binding]].
7. **Add-ons and failure modes.** EDM and IDM hosting: [[zia.private-service-edge.advanced-dlp]]. The Business Continuity Cloud: [[zia.private-service-edge.business-continuity]].

The software form factor and its clusters are a separate walk: [[zia.virtual-service-edge]]. The Location object itself is [[zia.locations.model]].
