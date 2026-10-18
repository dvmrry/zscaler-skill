**Units.** {{units}}

**How sublocations share.** {{shared-by-default}} {{three-modes}} {{unused-returns-to-parent}}

**Ordering rules.** {{parent-disable-cascades}} {{parent-must-cover-children}}

**Isolation.** {{override-is-isolation}} Guidance that sublocation bandwidth can never be isolated, or that the parent's toggle must be on for a sublocation limit to work, conflicts with the help articles above.

What to check on a tenant: the parent's mode, each sublocation's mode (Use Location Bandwidth, Override or Disable), and whether the parent's limit still covers the sum. Bandwidth Control rules themselves scope by location and group: [[zia.locations.rule-scoping]]. Rule-side allocation is in [[zia.bandwidth-control.allocation]].
