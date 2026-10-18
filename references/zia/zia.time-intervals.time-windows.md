ZIA has two schedule objects with nearly the same shape. Time intervals are the ones an admin creates, in [[zia.time-intervals.schema]]. The time window catalog is a second, separate list. {{catalog-endpoints}} {{read-only}}

The shapes differ by one key. {{day-key-singular}}

In Terraform only the catalog is reachable. {{tf-data-source}} {{no-managed-resource}} Whether that is intentional is gap `terraform-resource-intent`; whether the catalog's predefined names also exist among intervals is gap `predefined-intervals`, which a live list of intervals settles. Which of the two objects a given rule's `timeWindows` entry accepts is gap `rule-field-references`; see [[zia.time-intervals.rule-usage]].
