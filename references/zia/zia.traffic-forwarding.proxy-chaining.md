Proxy chaining is a way to send an existing proxy's traffic to the service without other network changes, which Zscaler does not recommend as a long-term production solution. {{what-it-is}} {{limitations}}

**Setup.** {{registration}} {{primary-secondary}} {{government-clouds}}

**Client identity.** {{xff-handling}} How the service uses the client address from XFF to find a sublocation, and the per-location switch that enables it, is in [[zia.locations.ip-scoping]]; user mapping from that address is [[zia.authentication.surrogate-ip]].

The proxy mode of chained traffic is in [[zia.proxy-mode.forwarding-map]].
