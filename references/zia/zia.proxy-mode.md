"How does ZIA know where this connection is going?" depends on how the traffic arrived.

1. **Did the client send it to the service as a proxy?** Then the CONNECT request names the host before TLS: [[zia.proxy-mode.explicit]].
2. **Was it redirected without the client knowing?** Then the host comes from SNI, or the server certificate when SNI is absent: [[zia.proxy-mode.transparent]].
3. **Which one is this flow?** The forwarding method does not settle it (a tunnel can carry PAC traffic): [[zia.proxy-mode.forwarding-map]].

What the mode changes in policy is held by the SSL Inspection subjects, not here: first-pass evaluation on the CONNECT host or SNI ([[zia.ssl-inspection.pipeline]]) and the criteria that exist in one mode only ([[zia.ssl-inspection.criteria]]). How traffic gets to the service in the first place is [[zia.traffic-forwarding]].
