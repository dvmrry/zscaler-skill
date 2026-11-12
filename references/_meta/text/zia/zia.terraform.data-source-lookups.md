# How some ZIA Terraform data sources look things up (zia.terraform.data-source-lookups)
Also called: zia_firewall_filtering_rule data source; rule_id data source; data source search jmespath; zia_ips_categories; available_actions_without_isolate; list all rules terraform

Data sources look up one object by name or ID, but a few have lookup modes of their own. The ones below changed recently or return something other than a single match.

**Firewall filtering rules.** Since provider v4.7.21 the `zia_firewall_filtering_rule` data source returns a list of rules in a `rules` block when no single-rule lookup is supplied; the numeric lookup argument is `rule_id` (previously `id`), the name lookup is `name`, and the optional `search` is a client-side JMESPath filter applied after the server-side filters. [zia.terraform.data-source-lookups:fw-rule-collection-mode] Whether list-all reads are bounded on large tenants is open [gap:zia.terraform.data-source-lookups:fw-rule-list-all-limits].

**IPS categories.** The `zia_ips_categories` data source resolves a category by `id`, else by case-insensitive `name`, and with neither returns every category; the returned name is the exact identifier the firewall rules' `res_categories` and `dest_ip_categories` expect. [zia.terraform.data-source-lookups:ips-categories-lookup]

**Cloud App Control actions.** The Cloud App Control actions data source returns the available actions both together and split into `available_actions_without_isolate` and `isolate_actions`; the provider documents that ISOLATE actions need a Cloud Browser Isolation subscription and must be used alone in a rule. [zia.terraform.data-source-lookups:cac-actions-split] The action rules themselves are in [Cloud App Control actions and action discovery](kb:zia.cloud-app-control.actions). Other lookup defects, such as selectors that are never read, are in [What ZIA Terraform data sources return, drop, or get wrong](kb:zia.terraform.data-source-fidelity).

What to check:
1. Whether a firewall rule data source call used `rule_id` rather than the old `id` argument, and whether it was meant to list all rules.
2. Whether a Cloud App Control rule took its actions from the without-isolate list and used ISOLATE alone.
3. Whether a list-all read on a large tenant returned every rule.

Not known (open gaps):
- Whether list-all retrieval on rule data sources is limited by endpoint pagination [gap:zia.terraform.data-source-lookups:fw-rule-list-all-limits]: settled by code-read or tenant-data. Blocks: saying whether a list-all read of a rule data source returns every rule on a large tenant

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.cloud-app-control.actions.md (Cloud App Control actions and action discovery)
- links-to references/_meta/text/zia/zia.terraform.data-source-fidelity.md (What ZIA Terraform data sources return, drop, or get wrong)
