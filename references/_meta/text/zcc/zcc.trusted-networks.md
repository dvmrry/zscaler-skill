# ZCC trusted networks (zcc.trusted-networks)
Also called: zcc trusted network; client connector trusted networks; am i on a trusted network; trusted network detection zcc; zcc trusted networks

Client Connector's trusted networks answer one question for the forwarding profile: is this device on one of the organization's networks right now? Three parts of the KB cover them.

- **How the app decides.** The criteria, Any or All, predefined networks, VPN adapter options and when the app re-evaluates: [How Client Connector decides it is on a trusted network](kb:zcc.trusted-networks.detection).
- **What the answer changes.** The device becomes On-Trusted and gets that network type's actions: [The four network types Client Connector detects: On-Trusted, VPN-Trusted, Split VPN-Trusted, Off-Trusted](kb:zcc.forwarding-profiles.network-types), [Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None](kb:zcc.forwarding-profiles.internet-actions), [Forwarding profile actions for Private Access (ZPA): Tunnel or None per network type](kb:zcc.forwarding-profiles.private-access-actions).
- **The reusable object and its API.** [The Client Connector trusted network object and its v1 API](kb:zcc.trusted-networks.object), and how Terraform bridges its two API generations: [How the ZCC provider picks the v1 or v2 trusted-network API and converts between them](kb:zcc.terraform.trusted-network-backend).

ZPA has its own read-only trusted network records and a TRUSTED_NETWORK policy condition, fed from these: [ZPA trusted networks](kb:zpa.trusted-networks), [Trusted networks in ZPA and in Client Connector](kb:zpa.trusted-networks.zcc-relationship).

Area: zcc.trusted-networks, its subjects in references/_meta/spine/zcc/zcc.trusted-networks.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.trusted-networks.zcc-relationship.md (Trusted networks in ZPA and in Client Connector): Zscaler Client Connector identifies a trusted network by criteria defined for it on the Trusted Networks page, and a forwarding profile can select several predefined trusted networks. [zpa.trusted-networks.zcc-relationship:zcc-defines-criteria]
- interacts-with references/_meta/text/zcc/zcc.forwarding-profiles.md (ZCC forwarding profiles): So the profile's Any/All applies across its own inline conditions; a profile that selects predefined trusted networks does not also combine them with DNS Server, DNS Search Domains or Hostname conditions. [zcc.trusted-networks.detection:profile-match-scope]
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.internet-actions.md (Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.network-types.md (The four network types Client Connector detects: On-Trusted, VPN-Trusted, Split VPN-Trusted, Off-Trusted)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.private-access-actions.md (Forwarding profile actions for Private Access (ZPA): Tunnel or None per network type)
- links-to references/_meta/text/zcc/zcc.terraform.trusted-network-backend.md (How the ZCC provider picks the v1 or v2 trusted-network API and converts between them)
- links-to references/_meta/text/zcc/zcc.trusted-networks.detection.md (How Client Connector decides it is on a trusted network)
- links-to references/_meta/text/zcc/zcc.trusted-networks.object.md (The Client Connector trusted network object and its v1 API)
- links-to references/_meta/text/zpa/zpa.trusted-networks.md (ZPA trusted networks)
