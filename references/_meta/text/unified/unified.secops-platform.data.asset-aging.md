# Asset aging rules in the Agentic SecOps Platform: inactive assets, aging by time or value, affected entities and rule order (unified.secops-platform.data.asset-aging)
Also called: aging assets; asset aging

Asset aging automatically transitions outdated assets to an inactive state; inactive assets remain available for historical reporting, can be excluded from primary dashboard views, and are not deleted. [unified.secops-platform.data.asset-aging:age-purpose]

**Rules.** Aging rules have two categories: aging by time (days since the asset was last detected, using the Asset Last Seen field) and aging by value (source-system updates indicating status changes or other field data). [unified.secops-platform.data.asset-aging:age-categories] Asset aging includes a fallback rule with a default value and no conditional logic; it can be edited but not removed or deleted. [unified.secops-platform.data.asset-aging:age-fallback] Asset aging rule order does not affect application order; each data point is evaluated against all rules even after one is satisfied. [unified.secops-platform.data.asset-aging:age-rule-order]

**Findings.** Affected Entities selects the related entities to age when the asset becomes inactive, and the page says the platform currently supports the aging of findings through asset aging rules; findings are set to Undetected, and resurfacing an asset resurfaces its previously aged findings. [unified.secops-platform.data.asset-aging:age-affected-entities] Findings are aged by asset aging and by the remediation detection settings independently, and satisfying either is sufficient to age the findings. [unified.secops-platform.data.asset-aging:age-findings-independent]

**Access.** Asset aging requires a role with Read, Create and Edit permissions under the Platform - Model Management resource. [unified.secops-platform.data.asset-aging:age-role]

Area: unified.secops-platform, its subjects in references/_meta/spine/unified/unified.secops-platform.json
