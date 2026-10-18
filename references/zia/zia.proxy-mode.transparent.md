In transparent mode the client does not know a proxy exists. {{how-it-works}}

**Finding the host.** {{host-identification}} {{sni-example}} {{certificate-comes-later}} The old reference added statements about spoofing and an extra round trip (gaps `sni-spoofing`, `first-decision-latency`).

**What changes for policy.** Domain-based policy runs on the SNI before decryption: [[zia.ssl-inspection.pipeline]]. Because destination IP is also evaluated in this mode, a Do Not Inspect rule on the Miscellaneous or Unknown category can exempt almost all traffic: the claim and its explicit-mode counterpart are `zia.ssl-inspection.pipeline:transparent-matches-destination-ip`, and the IP-group criterion in [[zia.ssl-inspection.criteria]].

**Identity and protocols.** The client cannot answer a proxy 407, so user identity comes from Surrogate IP or Client Connector and otherwise from the location: [[zia.authentication.surrogate-ip]], [[zia.authentication.unauthenticated-traffic]]. Tunnels carry all ports and protocols ([[zia.traffic-forwarding.methods]]); IPv6 over IPSec needs explicit configuration ([[zia.traffic-forwarding.ipsec]]). What the router needs for GRE and IPSec is in [[zia.traffic-forwarding.gre]] and [[zia.traffic-forwarding.vpn-credentials]].

What to check: whether the client sends SNI (a capture of the Client Hello), and whether any rule's outcome depends on the destination IP.
