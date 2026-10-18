A Firewall Filtering rule matches on the criteria it sets and ignores the ones it leaves empty. {{unset-unrestricted}} {{source-countries-ignored}} {{device-trust-scope}}

Which criteria exist is not the same as which are available to the tenant. Identity and network-application criteria need Advanced Firewall: [[zia.firewall.licensing]]. How many of each a rule can hold is in [[zia.firewall.limits]], and the destination and port building blocks are in [[zia.firewall.destination-groups]] and [[zia.firewall.network-services]]. For the URL Filtering counterpart, including the AND between category fields, see [[zia.url-filtering.criteria]].

**Terraform-only attributes.** The provider exposes several attributes that deserve a closer look. {{context-shield-exclusion}} {{context-shield-not-in-capture}} {{eun-attributes}} An upstream report of a plan diff on `eun_template_id` is in the gap below. {{endpoint-app-blocks}} {{endpoint-app-condition-unmeetable}}

How the provider flattens and reads these rules, including the collection data source that drops fields, is in [[zia.terraform.data-source-fidelity]].

What to check: which criteria are actually set (an empty one means "any"), whether the tenant is licensed for it, and for the endpoint-application blocks, that the attribute does what you expect before relying on it.
