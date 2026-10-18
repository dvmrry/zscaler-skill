Sandbox rules decide what happens to a file the engine has not seen before, which is what makes them the lever for quarantine problems ([[zia.sandbox.quarantine]]). {{ba-rule-action}} {{first-time-operation}} {{allow-and-scan-is-allow-scan}}

Detection options sit alongside that. {{ml-action}} {{threat-score-range}} Which files and traffic a rule touches is set by the scope fields. {{scope-fields}} {{zpa-uploads}} Which file types exist for the tenant's tier is in [[zia.sandbox.coverage]].

Ordering follows the usual first-match model. {{rule-ordering}} Sandbox has one special case: the default rule. {{default-rule-marker}} The help page says the default rule is checked last ({{default-rule-last}}); the provider hard-codes 127 for it, and whether the API reserves that slot is open (see the gap). Reorder handling in the provider is in [[zia.terraform.rule-order]], and the update path that indexes an empty rule list is in [[zia.terraform.error-handling]].

The API is not console-only. {{python-crud}}

What to check: the rule's `firstTimeOperation`, whether `mlActionEnabled` is paired with a supported first-time action, and the live rule list for the default rule's actual `order`.
