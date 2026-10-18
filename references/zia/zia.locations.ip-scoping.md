**What a sublocation matches.** {{matches-inner-ips}} {{formats}} {{ranges-per-sublocation}}

**Overlap.** {{no-overlap-within-location}} Scoped Workload sublocations are the exception that allows overlapping ranges: [[zia.locations.workload-scopes]].

**Forwarding.** {{forwarding-fields-parent-only}} Whether a sublocation can have a forwarding method of its own, or a static-IP-only parent can have sublocations, is open (see the gaps).

**XFF.** {{xff-opt-in}} For a sublocation the XFF setting is read-only and inherited: [[zia.locations.inheritance]].

Traffic that matches no sublocation range goes to `other`: [[zia.locations.sublocations]].
