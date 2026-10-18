**What it controls.** {{meaning}} {{set-once}}

**Values.** {{frequency-values}} The older legacy API page lists a different set, which is the divergence below. The names do not say how long each lasts, and the neat "ALWAYS, daily, weekly, monthly" table in the old reference is not backed by any source, so treat durations as unknown until the gap is resolved.

**Custom.** {{custom-range}}

**Per location.** {{location-profile}} Where the effective frequency differs from the organization default, look at the location before the settings object.

**Where it does not apply.** {{browser-scope}} For clients that cannot hold a cookie at all see [[zia.authentication.unauthenticated-traffic]] and [[zia.authentication.surrogate-ip]].

What to check: the live value of authFrequency against the spec's value list, and whether the failing client carries a cookie.
