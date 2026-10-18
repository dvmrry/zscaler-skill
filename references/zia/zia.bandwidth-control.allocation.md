Minimum and maximum behave differently, and conflating them is the usual source of wrong answers. {{min-max-meaning}}

**Maximum is a standing cap.** {{max-always}} A class capped at 10% is held to 10% of the location's bandwidth even on a quiet link, which is the intended way to suppress, but not block, non-business traffic. The older assumption that restrictions are inert outside contention is wrong for the maximum.

**Minimum is a contention guarantee.** {{min-only-in-contention}} {{total-min-below-100}}

**How it is divided.** {{two-pass}} {{one-second-rebalance}} {{idle-reallocated}}

**When contention happens.** {{contention}} {{observe-then-time-window}} What contention is measured against is open; see the gap.

**What is shaped.** {{tcp-protocols-only}} Traffic from remote users and unconfigured locations is outside this: [[zia.bandwidth-control.location-scope]]. Where it sits in the policy order: [[zia.bandwidth-control.pipeline-position]].

**Seeing it.** {{dashboard-reports}}

What to check when limits look ignored: whether the class is capped by a maximum or only guaranteed a minimum, whether the link was saturated at the time (dashboard), and which rule or the default rule holds the class ([[zia.bandwidth-control.default-rule]]).
