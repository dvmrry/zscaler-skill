Placement is a choice between three firewall relationships. {{placement-options}} Zscaler recommends the DMZ, see [[zia.private-service-edge.ip-requirements]].

**Inside the DMZ.** {{dmz-firewall-load}}

**Outside the corporate firewall.** {{outside-firewall-tunnels}}

**Behind the network firewall.** {{behind-firewall-nat}}

**Redundancy and firewall lists.** {{backup-tunnel}} {{firewall-rules-published}} Which of the published lists applies is open {{gap:firewall-list-source}}.

**Switch settings.** {{dsr-needs-garp}} {{access-mode-no-vlan-tags}} {{lldp-and-flow-control-off}} The reason GARP matters is the return path described in [[zia.private-service-edge.cluster-architecture]].

**Who does what.** {{zscaler-provisions}}

**Forwarding to the cluster.** {{gre-self-provisioning-public-ip-only}} {{pac-subcloud}} Forwarding methods in general are [[zia.forwarding-control.methods]].

**Verify.** {{acceptance-test}} Then bind the cluster to a Location, and do that part with Zscaler Support: [[zia.private-service-edge.location-binding]].
