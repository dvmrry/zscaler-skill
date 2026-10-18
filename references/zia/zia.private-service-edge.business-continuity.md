{{limited-availability}} {{uses-pse-data-plane}}

**When it applies.** {{trigger-is-critical-failure}} The legacy phrasing that a "PSE or ZIA service outage" activates it is not what the sources say ([[zia.private-service-edge.business-continuity:bc-trigger-pse-outage]]).

**What to check.** {{prerequisites}} {{z-tunnel-2-unsupported}} Which tunnel modes a forwarding profile can fall back to is a Client Connector question. The two vendor pages also disagree about IPSec ([[zia.private-service-edge.business-continuity:supported-connectivity-methods]]).

**What it will not do.** {{last-known-good-policy}} So a policy change made shortly before or during the event may not be in force on the Business Continuity Cloud.

How Z-Tunnel 2.0 interacts with a restrictive subcloud is subcloud behavior and is documented in `references/shared/subclouds.md`, not here.
