Cloud App Control rules are typed, and the provider scopes import, ordering and delete by that type. {{import-compound-key}} {{delete-is-type-scoped-call}}

**Rule type.** {{tf-rule-type-optional}} What changing it does is open {{gap:rule-type-recreate}}. The API surface of the rules is in [[zia.cloud-app-control.api-surface]], and the tenant-profile attachment in [[zia.tenant-profiles.api-surface]].

**Prompt capture.** {{prompt-capture-schema-wording}} {{prompt-capture-assigned-by-provider}} {{prompt-capture-false-omitted}} Whether it can be disabled is open {{gap:prompt-capture-disable-path}}.

**Isolation and limits.** {{isolate-alone}} {{max-items-removed}}

**Ordering and delete.** {{v4-8-4-per-type-ordering}} How the reorder engine keys these rules and gives up: [[zia.terraform.rule-order.registry]]. Whether several deletes in one apply are safe is open {{gap:issue-585-multi-delete}}.
