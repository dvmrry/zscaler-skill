The ZIA provider does not write a rule's order directly. It moves the rule out of the way first and puts it back later, in the background. {{update-parks-every-update}} {{list-error-then-panic}} {{parking-spot-from-truncated-list}}

Putting it back is asynchronous and cannot fail loudly. {{background-worker}} {{worker-cannot-report-failure}} {{converges-on-registered-rules-only}} {{stale-positions-within-a-pass}} {{gives-up-silently}} {{wrong-order-reported-success}}

The consequence that matters most for policy is about the rules the apply did not touch. {{terminal-rule-can-be-displaced}} After any apply that edited ordered rules, re-read the whole policy's order (not only the edited rules) and confirm the terminal rules are still last. That is the check the provider itself does not make. Product-side rule order semantics are in [[zia.url-filtering.rule-order]].
