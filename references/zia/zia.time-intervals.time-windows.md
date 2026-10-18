ZIA has two schedule objects with nearly the same shape. Time intervals are the ones an admin creates, in [[zia.time-intervals.schema]]. The time window catalog is a second, separate list. {{catalog-endpoints}} {{read-only}}

{{day-key-singular}}

**Terraform.** {{tf-data-source}} {{no-managed-resource}} Whether that is intentional is open {{gap:terraform-resource-intent}}. Whether the catalog's predefined names also exist among intervals is open {{gap:predefined-intervals}}. Which of the two objects a given rule's `timeWindows` entry accepts is open {{gap:rule-field-references}}; see [[zia.time-intervals.rule-usage]].
