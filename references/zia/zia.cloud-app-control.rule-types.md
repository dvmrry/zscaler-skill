Cloud App Control is organised by category, and the category is a rule's type. {{nineteen-categories}} {{category-names}}

**Granular controls.** {{granular-categories}} The AI & ML category has its own rule flow and its own granular action list: [[zia.cloud-app-control.ai-ml-rules]]. How granular actions appear in the API: [[zia.cloud-app-control.actions]].

**Limits.** {{rule-cap-per-category}} An organisation with many department-specific rules for one category, for example Instant Messaging, therefore reaches the ceiling long before any tenant-wide count suggests it. Order is also kept per rule type: the provider scopes lists by rule type and registers reorders per type from v4.8.7, see [[zia.terraform.rule-order.registry]].

**Predefined rules.** {{iot-predefined-rules}} If an operator asks why traffic from IoT devices is allowed or blocked unexpectedly, check whether these rules are enabled and where they sit in the order, because the rest of their behavior cannot be edited. Rule order and disabled-rule semantics are in [[zia.cloud-app-control.precedence]].
