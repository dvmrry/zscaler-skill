The ZTC provider does not write a rule's order directly. For updates it moves the rule to the end first and puts it back later, in the background; for creates it stages the rule at one cached order. {{update-parks-every-update}} {{list-error-then-panic}} {{list-reads-all-pages}} {{create-list-error-seeds-order-1}} {{staging-order-cached-per-process}}

Putting it back is asynchronous and cannot fail loudly. {{background-worker}} {{registry-keyed-by-type-only}} {{worker-reads-only-a-count}} {{worker-cannot-report-failure}} {{count-error-ignored}} {{write-error-logged-only}} {{completes-on-quiet-ticks}} {{same-size-reregistration-ignored}} {{writes-registered-rules-only}} {{wrong-order-reported-success}}

The registry also outlives the rules it describes, and every resource served by one provider process shares it. {{deleted-ids-stay-registered}} {{new-cycle-rewrites-whole-registry}} {{two-configurations-share-registry}} {{worker-lock-held-across-network-calls}}

The consequence that matters most for policy is about the rules the apply did not touch. {{terminal-rule-can-be-displaced}} After any apply that edited ZTC forwarding, DNS forwarding or log forwarding rules, re-read the whole policy's order and rank (not only the edited rules) and confirm the terminal default rule is still last. That is the check the provider itself does not make.

Differences from the ZIA provider ([[zia.terraform.rule-order]]), which follows the same park-then-reorder design:

- The ZTC worker never reads positions back (compare the ZIA worker in [[zia.terraform.rule-order]]). It is handed a rule count and a write callback only, so it has no equivalent of the ZIA worker's per-pass comparison against current positions, and no give-up paths: its only exit is three quiet ticks, whatever the writes did.
- Its write pass is gated on the registry size changing, which is why a count error or write errors end in apparent success rather than a retry.
- The ZTC list reads page through the endpoint, so the truncated-list parking hazard described for ZIA URL Filtering does not apply to these GetAll calls; the failure mode here is the unchecked error, not a short list.
- The ZTC worker holds the global registry lock across its network calls; the ZIA worker releases it before it reads positions.
