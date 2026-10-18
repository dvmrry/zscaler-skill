Source IP Anchoring sends selected ZIA traffic out through a Private Access App Connector. {{purpose}} {{inspected-first}} {{licensing}} {{pa-solely}} {{protocol-limits}}

When anchored traffic leaves from the wrong address or fails, check the three layers in order (this subject, [[zia.forwarding-control.zpa-gateway]] and DNS).

1. **ZIA.** A forwarding rule with the ZPA method and a gateway: [[zia.forwarding-control.methods]], [[zia.forwarding-control.zpa-gateway]]. {{ztunnel1-option}} Rule scope for remote users: [[zia.forwarding-control.rules]].
2. **Private Access.** {{segment-settings}} {{client-forwarding-policy}} {{access-policy}} {{no-user-criteria}}
3. **DNS.** The ZPA resolver rules for Road Warrior and Locations, their order and enablement: [[zia.dns-control.predefined-rules]].

If the ZIA tenant is in disaster recovery, the Private Access side changes: [[zia.forwarding-control.sipa-direct]]. What happens when the gateway's server group has no healthy connectors is not established (gap `unhealthy-connectors`). Why anchoring is wanted and where the connector may sit (gap `anchor-rationale`), and what a segment without the Source IP Anchor option does (gap `missing-anchor-flag`), are not sourced. Customer-owned addresses are a different feature: [[zia.forwarding-control.byoip]].
