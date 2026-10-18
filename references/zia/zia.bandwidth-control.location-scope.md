Rules are only half of Bandwidth Control; the location decides whether a flow is shaped and against what total. {{limits-per-location}} {{known-locations-only}}

**The switch.** {{enforce-toggle}} {{toggle-gates-rules}} When a bandwidth rule seems not to fire, check the location first.

**Sublocations.** Whether a sublocation shares its location's limits, holds its own, or is exempt, and how the parent and child limits must relate, is in [[zia.locations.bandwidth]]; the Bandwidth Control consequence is that a sublocation in the default shared mode shares its location's limits ([[zia.locations.bandwidth]], claim shared-by-default). {{guest-wifi}}

**Sizing the limits.** {{sizing}} The vendor states the overhead figure inconsistently (see the overhead-percentage divergence).

What to check: the toggle and limits on the location, each sublocation's mode, and whether the traffic comes from a configured location rather than a remote user. Class and rule mechanics: [[zia.bandwidth-control.allocation]].
