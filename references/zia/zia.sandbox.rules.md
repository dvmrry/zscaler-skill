Sandbox rules decide what happens to a file the engine has not seen before, which is what makes them the lever for quarantine problems ([[zia.sandbox.quarantine]]). {{ba-rule-action}} {{first-time-operation}} {{allow-and-scan-is-allow-scan}}

**Detection options.** {{ml-action}} {{threat-score-range}}

**Scope.** {{scope-fields}} {{zpa-uploads}} Which file types exist for the tenant's tier is in [[zia.sandbox.coverage]].

**Order.** {{rule-ordering}}

**Default rule.** {{default-rule-marker}} {{default-rule-last}} The provider hard-codes 127 for it, and whether the API reserves that slot is open {{gap:default-order-semantics}}. Reorder handling in the provider is in [[zia.terraform.rule-order]], and the update path that indexes an empty rule list is in [[zia.terraform.error-handling]].

**Through the API.** {{python-crud}}
