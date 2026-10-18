In transparent mode the client does not know a proxy exists. {{how-it-works}}

**Finding the host.** {{host-identification}} {{sni-example}} {{certificate-comes-later}} Whether a client can declare a different SNI to bypass policy is open {{gap:sni-spoofing}}. Whether the certificate fallback adds a round trip before the first decision is open {{gap:first-decision-latency}}.

**What changes for policy.** Domain-based policy runs on the SNI before decryption: [[zia.ssl-inspection.pipeline]]. Destination IP is also matched in this mode, and its effect on exemptions is in [[zia.ssl-inspection.pipeline:transparent-matches-destination-ip]]; the IP-group criterion is in [[zia.ssl-inspection.criteria]].

**Identity and protocols.** The client cannot answer a proxy 407, so user identity comes from Surrogate IP or Client Connector and otherwise from the location: [[zia.authentication.surrogate-ip]], [[zia.authentication.unauthenticated-traffic]]. Tunnels carry all ports and protocols ([[zia.traffic-forwarding.methods]]); IPv6 over IPSec needs explicit configuration ([[zia.traffic-forwarding.ipsec]]). What the router needs for GRE and IPSec is in [[zia.traffic-forwarding.gre]] and [[zia.traffic-forwarding.vpn-credentials]].
