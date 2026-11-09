# Terraform UEBA alert definitions: accepted names and lookups (zia.terraform.ueba-alerts)
Also called: zia_ueba_alert_definitions; UEBA alert terraform; alert_name validation; Security UEBA alert definitions

The provider documents `zia_ueba_alert_definitions` under the "Security & UEBA Alerts" subcategory, as a resource that creates and manages a ZIA Security & UEBA alert definition. [zia.terraform.ueba-alerts:docs-security-ueba-category] Both the resource and the data source are strict about how an alert is named. The accepted names are fixed in the provider.

**Accepted names.** The `alert_name` of `zia_ueba_alert_definitions` is validated with `validation.StringInSlice(supportedUEBAAlertNames, false)` against a fixed list of alert names compiled into the provider; a name outside that list fails the schema validation. [zia.terraform.ueba-alerts:alert-name-closed-list] The match against that list is case-sensitive: a name that differs from a listed one only in case fails validation. [zia.terraform.ueba-alerts:alert-name-match-case-sensitive] So the closed list is what Terraform accepts, not evidence that the backend's alert catalog is the same set or that every listed alert is enabled for every tenant. [zia.terraform.ueba-alerts:list-is-provider-boundary]

**Lookups.** The UEBA alert definitions data source needs an `id` or an `alert_name`, matches the name by exact case-sensitive equality over the full list, and fails with "either 'id' or 'alert_name' must be provided" when neither is given. [zia.terraform.ueba-alerts:data-source-selectors] The resource imports by a numeric definition ID or, when the import ID is not numeric, by alert name through a by-name lookup. [zia.terraform.ueba-alerts:import-by-id-or-name]

What to check:
1. Whether a rejected `alert_name` is outside the provider's fixed list, which is not proof the backend lacks that alert.
2. Whether a data source lookup by alert name matched exactly, including case.

Inferred, not quoted (say so when an answer rests on one):
- [zia.terraform.ueba-alerts:alert-name-match-case-sensitive] Tier B: Rests on the second StringInSlice argument being the Terraform plugin SDK's ignoreCase flag, set to false here; the plugin SDK is not a registered source and the provider does not state it.
- [zia.terraform.ueba-alerts:list-is-provider-boundary] Tier B: Inferred from the list being a constant in the provider; no source ties it to the backend's catalog.

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json
