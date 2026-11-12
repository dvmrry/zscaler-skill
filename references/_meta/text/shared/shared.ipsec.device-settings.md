# IPSec device settings Zscaler recommends: ciphers, PFS, NAT-T and DPD (shared.ipsec.device-settings)
Also called: ipsec cipher; ipsec ciphers; ike phase 1 phase 2 settings; ipsec null encryption; perfect forward secrecy; pfs; nat-t; nat traversal; dead peer detection; dpd; pre-shared key length

Two vendor documents describe the device side of an IPSec tunnel: the help article on IPSec VPNs and the traffic forwarding reference architecture. They agree on most recommendations and disagree on two mechanics.

**IKE version and keys.** The reference architecture recommends IKEv2 wherever possible, because it performs better and fixes vulnerabilities found in IKEv1. [shared.ipsec.device-settings:ikev2] IKE sets up an IPSec connection in two phases: Phase 1 authenticates the peers and sets up a secure channel for the Phase 2 messages, and Phase 2 negotiates parameters and sets up the security associations. [shared.ipsec.device-settings:ike-phases] The help article's IKEv1 restriction for new tenants is [Zscaler recommends IKEv2. New tenants cannot establish IKEv1 IPSec tunnels from a vendor product to forward traffic to Internet & SaaS unless Zscaler Support enables IKEv1 for them.](kb:zia.traffic-forwarding.ipsec:ike-versions). Authentication is not negotiated between the peers; Zscaler recommends pre-shared keys with long keys, configured in the Admin Portal and manageable through an uploaded CSV. [shared.ipsec.device-settings:long-psk]

**Ciphers.** The reference architecture's integrity recommendation: IKEv2 Phase 1 SHA-256 or SHA-1 and Phase 2 MD5; IKEv1 Phase 1 SHA-1 and Phase 2 MD5. [shared.ipsec.device-settings:integrity] The reference architecture's confidentiality recommendation: IKEv2 Phase 1 AES-256 and Phase 2 NULL; IKEv1 Phase 1 AES-128 and Phase 2 NULL. [shared.ipsec.device-settings:confidentiality] The stated reason for NULL in Phase 2 is that IPSec is used as a forwarding tunnel rather than for data security: the traffic leaves for the internet the same way it entered the tunnel, and almost all of it is already TLS-encrypted. [shared.ipsec.device-settings:null-rationale] The IPSec help article recommends AES-GCM-based Phase 2 ciphers for organizations that have purchased the separate subscription, and NULL encryption for those that have not. [shared.ipsec.device-settings:help-phase2-cipher] The full supported parameter table is [For IKEv2 the supported Phase 1 values are AES-256/192/128 or 3DES, SHA-512/384/256/1, Diffie-Hellman groups 2, 5, 14, 19, 20 and 21, with a pre-shared key and 24-hour SA lifetime; Phase 2 supports ESP or AH in tunnel mode with AES-GCM, NULL or AES, 8 child SAs and an 8-hour lifetime. The table lists NAT-T and DPD as options (DPD timeout 20 seconds, 5 retries).](kb:zia.traffic-forwarding.ipsec:ikev2-parameters).

**Perfect Forward Secrecy.** PFS renews the Phase 2 SA keys after an amount of traffic or time; both documents recommend disabling it for Phase 2, the reference architecture because with NULL encryption there is no reason to refresh the key. [shared.ipsec.device-settings:pfs-disable]

**NAT-T.** Zscaler supports IPSec from an endpoint behind a NAT device (NAT-T): when enabled, the peers detect a NAT during Phase 1, verify both support NAT-T, and wrap the packet in a new IP header with protocol UDP, a UDP header and a NAT-T header. The reference architecture recommends enabling NAT-T. [shared.ipsec.device-settings:nat-t] The UDP source port the encapsulation uses differs between the two documents [divergence:shared.ipsec.device-settings:nat-t-source-port]; the help article's account is [Zscaler supports NAT-Traversal when the initiating device is behind a NAT device; the packets are then encapsulated in UDP with source port 4500. NAT-T is built into IKEv2 and an optional extension to IKEv1.](kb:zia.traffic-forwarding.ipsec:nat-traversal).

**Dead Peer Detection.** Dead Peer Detection checks periodically for peer responses with a HELLO message instead of waiting for the SA to expire, and Zscaler recommends enabling it so downtime from a lost connection is minimal. [shared.ipsec.device-settings:dpd] Whether traffic in the tunnel counts as proof that the peer is alive differs between the two documents [divergence:shared.ipsec.device-settings:dpd-traffic-liveness]; the help article's intervals and retries are [Zscaler expects peers to run explicit periodic liveness checks (DPD) where the devices support them, and recommends 10 to 20 second intervals with at least 3 retries; if only on-demand checks are supported the Zscaler IP must be allowlisted so Zscaler's DPD gets a response, and with no response Zscaler cleans up the connection. Ongoing traffic is not treated as proof the peer is alive.](kb:zia.traffic-forwarding.ipsec:dpd).

What to check:
1. Whether the device runs IKEv2 with the recommended Phase 1 integrity and confidentiality, NULL (or AES-GCM with the subscription) in Phase 2, and PFS disabled.
2. Whether DPD is enabled with periodic checks, since the help article does not treat tunnel traffic as liveness.

Sources disagree (name both sides):
- The UDP source port of NAT-T encapsulated IPSec packets. [divergence:shared.ipsec.device-settings:nat-t-source-port]
  - zscaler-help: The reference architecture says the UDP header's source port is 500.
  - zscaler-help: The IPSec help article says the source port is 4500.
  Impact: A firewall in front of the device opened for the wrong UDP port blocks NAT-T encapsulated traffic, so a tunnel can negotiate and then pass nothing.
- Whether ongoing tunnel traffic stands in for DPD liveness checks: the reference architecture describes DPD in general terms as on-demand, the help article states Zscaler's own requirement. [divergence:shared.ipsec.device-settings:dpd-traffic-liveness]
  - zscaler-help: The reference architecture, describing how DPD reduces overhead for VPN concentrators in general, says DPD is used only after the tunnel has been idle and that bidirectional traffic is enough to prove the peer is available; it does not tell admins to configure on-demand DPD.
  - zscaler-help: The IPSec help article says Zscaler does not treat ongoing traffic as proof of liveness and expects explicit periodic checks.
  Impact: Read as a description of Zscaler's behavior, the reference architecture suggests tunnel traffic keeps a connection alive; the help article says Zscaler does not treat traffic as liveness, expects periodic checks, and cleans up a connection whose DPD gets no response.

Area: shared.ipsec, its subjects in references/_meta/spine/shared/shared.ipsec.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings)
- depends-on references/_meta/text/zia/zia.traffic-forwarding.vpn-credentials.md (VPN credentials for IPSec: types, immutability and keys), from shared.ipsec: In the reference architecture the FQDN credential has a user ID field while the IP credential simply uses the peer's public IP address, and both take a pre-shared key of up to 255 characters. [shared.ipsec:credential-types]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.ipsec.md (IPSec tunnels to Zscaler: where each question is answered)
