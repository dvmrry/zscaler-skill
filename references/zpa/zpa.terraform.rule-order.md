The ZPA provider orders policy rules differently from the ZIA provider described in [[zia.terraform.rule-order]]. The reorder resource computes one complete ordered list of rule IDs and replaces the policy set's order with a single request. {{sends-id-list-only}} {{synchronous-and-reports-failure}} {{delete-is-a-noop}}

**Sort order of the list.** {{comparator-managed-first}} {{default-rule-pinned-last-by-name}} {{map-holds-configured-rules}} {{unmanaged-rules-sent-below-managed}} {{terminal-rule-can-be-displaced}} {{configured-deception-rule-treated-as-unmanaged}}

**Configured numbers.** {{validates-positive-and-unique-numbers}} {{numbers-are-relative-only}} {{gapped-numbers-drift}} {{deception-offset-drift}}

**Configured IDs.** {{sdk-sends-only-listed-ids}} {{provider-does-not-check-ids-exist}} {{read-keeps-configured-value-when-id-missing}} {{nonexistent-id-persists}} How the reorder endpoint applies a submitted list, including nonexistent IDs and gapped numbers, is open {{gap:api-bulk-reorder-semantics}}.

**Duplicate IDs.** {{duplicate-ids-collapse-into-map}} {{duplicate-ids-pass-validation}}

**Context and unparseable orders.** {{first-two-reads-ignore-caller-context}} {{read-skips-unparseable-order}}

**Concurrency.** {{reorder-not-under-rule-mutex}} {{concurrent-bulk-reorder-last-writer-wins}} What the API does with overlapping rule writes is open {{gap:api-concurrent-writes}}.
