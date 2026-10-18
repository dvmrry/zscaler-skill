Every ZIA rule resource that supports ordering hands its declared order to one shared, in-process registry and then blocks until a background worker says the order is applied. How the registry is keyed, who starts the worker, and when entries are marked done or removed decides whether an apply finishes, hangs, or finishes with a rule in the wrong place. This subject covers that shared machinery; how a single update is parked and put back, and why the worker cannot report failure, is in [[zia.terraform.rule-order]] and is not repeated here.

**Shared keys.** {{registry-key-is-a-string}}

**Traffic capture keys.** {{traffic-capture-create-uses-firewall-key}} {{traffic-capture-joins-firewall-cycle}}

**Rule types under one key.** {{cloud-app-control-one-key-for-all-types}} {{cloud-app-control-key-fixed-per-type-at-pin}} {{casb-rules-one-key-for-all-types}} {{mixed-subtype-cycle-skips-rules}}

**Races.** {{done-channel-read-after-unlock}} {{done-channel-capture-fixed-in-v4-8-7}} {{join-after-final-snapshot}}

**Starting-order state.** {{starting-order-state-read-outside-lock}}

**Entries that never settle.** {{worker-waits-forever-on-undone-entry}} {{create-registers-before-read-then-marks}} {{create-registers-before-read-sites}} {{undone-entry-hangs-later-waiters}}

**Entries that are never removed.** {{registry-entries-are-never-removed}} {{registered-rule-missing-from-list-is-skipped}} {{deleted-rules-skew-later-cycles}}

**Create-time order allocation.** {{staging-order-is-occupied-maximum}} {{staging-order-never-reserved}} {{staging-order-collision-effect}} {{create-retry-loses-declared-order}} {{create-retry-loses-declared-order-sites}} The failed-read retry that triggers it is described in [[zia.terraform.error-handling]], as is create order taken from an ignored list error.

**Rank mismatch.** {{rank-comparison-without-rank-write}} {{rank-mismatch-never-repaired}}

**The bounded exit.** {{oscillation-breaker-guard}} {{mixed-skip-write-path-is-unbounded}}
