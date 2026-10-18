**What counts as production.** {{production-needs-cluster}} {{standalone-for-evaluation-only}} {{max-16-instances}} {{subscription-per-instance}} Budget the subscriptions before the VMs: a cluster of N instances is N subscriptions, all of the Large type. Only some platforms can create one at all ([[zia.virtual-service-edge.platforms]]).

**The object.** {{cluster-fields}} {{cluster-ip-same-vlan}} {{ipsec-local-termination}} Field names and API behavior are in [[zia.virtual-service-edge.api-surface]]. The addresses behind these fields are in [[zia.virtual-service-edge.network-requirements]].

**Build order.** {{build-order}} {{bind-to-location}} The Location itself is [[zia.locations.model]]; unlike the hardware form factor, this binding is self-service and needs no Support ticket in the captured procedure (compare [[zia.private-service-edge.location-binding]]).

**Health.** {{health-probes-icmp-http}} {{unhealthy-member-removed}} Probes only work if the firewall lets them through, which is why the build order includes a Firewall Filtering rule: [[zia.virtual-service-edge.load-balancing]].

**What is not documented.** Which settings are cluster-level versus per-VM ([[zia.virtual-service-edge.clusters:cluster-vs-vm-settings]]), what removing a member or disabling the cluster does to live sessions ([[zia.virtual-service-edge.clusters:removal-and-disable-behavior]]), and what the cluster object means on public cloud ([[zia.virtual-service-edge.clusters:public-cloud-cluster-object]]). Do not call disabling a cluster a safe maintenance path; nothing captured says so. Upgrade sequencing, by contrast, is documented: [[zia.virtual-service-edge.upgrades]].
