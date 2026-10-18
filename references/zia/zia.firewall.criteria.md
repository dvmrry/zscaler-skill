{{unset-unrestricted}} {{source-countries-ignored}} {{device-trust-scope}} {{criteria-tier-gated}}

Licensing for each criterion is in [[zia.firewall.licensing]]. How many of each a rule can hold is in [[zia.firewall.limits]], and the destination and port building blocks are in [[zia.firewall.destination-groups]] and [[zia.firewall.network-services]]. For the URL Filtering counterpart see [[zia.url-filtering.criteria]].

**Terraform-only attributes.** {{context-shield-exclusion}} {{context-shield-not-in-capture}} {{eun-attributes}} The upstream report of a plan diff on `eun_template_id` is open {{gap:eun-template-plan-diff}}. {{endpoint-app-blocks}} {{endpoint-app-condition-unmeetable}} Whether these criteria match anything is open {{gap:endpoint-app-semantics}}.

How the provider flattens and reads these rules, including the collection data source that drops fields, is in [[zia.terraform.data-source-fidelity]].
