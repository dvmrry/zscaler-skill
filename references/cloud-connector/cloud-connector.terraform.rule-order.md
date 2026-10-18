The ZTC provider does not write a rule's order directly. For updates it moves the rule to the end first and puts it back later, in the background; for creates it stages the rule at one cached order. {{update-parks-every-update}} {{list-error-then-panic}} {{list-reads-all-pages}} {{create-list-error-seeds-order-1}} {{staging-order-cached-per-process}}

**Putting it back.** {{background-worker}} {{registry-keyed-by-type-only}} {{worker-reads-only-a-count}} {{worker-cannot-report-failure}} {{count-error-ignored}} {{write-error-logged-only}} {{completes-on-quiet-ticks}} {{same-size-reregistration-ignored}} {{writes-registered-rules-only}} {{wrong-order-reported-success}}

**The shared registry.** {{deleted-ids-stay-registered}} {{new-cycle-rewrites-whole-registry}} {{two-configurations-share-registry}} {{worker-lock-held-across-network-calls}}

**Rules the apply did not touch.** {{terminal-rule-can-be-displaced}}

**Differences from the ZIA provider.** The ZIA provider ([[zia.terraform.rule-order]]) follows the same park-then-reorder design. The ZTC worker never reads positions back {{worker-reads-only-a-count|ref}}, and its write pass is gated on the registry size {{completes-on-quiet-ticks|ref}}.
