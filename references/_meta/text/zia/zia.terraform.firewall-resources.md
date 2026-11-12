# Terraform firewall, DNS and IPS resources: EUN fields, DNS categories, custom signatures (zia.terraform.firewall-resources)
Also called: eun_template_id terraform; terraform-provider-zia issue 605; zia_ips_signature_rules; zia_ips_categories data source; firewall dns rule res_categories; predefined network service terraform import

These firewall-family resources have provider-specific behavior beyond the rule order. A `PREDEFINED` network service is built into ZIA and must be imported before Terraform runs; trying to update it directly returns `DUPLICATE_ITEM`. [zia.terraform.firewall-resources:predefined-service-import-first] The `ip_categories` attribute of `zia_firewall_filtering_destination_groups` accepts only custom URL categories. [zia.terraform.firewall-resources:destination-group-custom-categories-only]

**EUN fields.** Before v4.8.10 the firewall filtering rule schema declared `eun_template_id` as Optional, with no Computed flag. v4.8.10 adds Computed, with a comment that the API assigns its default EUN template to every rule when the template is not set, regardless of `is_eun_enabled` (#609). [zia.terraform.firewall-resources:eun-fields-optional-not-computed] The data-source page lists both EUN attributes, `is_eun_enabled` and `eun_template_id`. The resource page's argument reference lists them too from v4.8.10, whose changelog reads "Added missing eun template attributes to `zia_firewall_filtering_rule` resource" (#609). [zia.terraform.firewall-resources:eun-docs-asymmetry] Read copies the API's `eunTemplateId` into state, and the SDK model tags that field `omitempty`. [zia.terraform.firewall-resources:eun-read-and-expand] The contract disagrees with the SDK [divergence:zia.terraform.firewall-resources:eun-contract-vs-go-and-terraform]. The reported plan difference is unreproduced [gap:zia.terraform.firewall-resources:issue-605-plan-diff].

**DNS categories.** Provider v4.8.2 removed the local validation on `zia_firewall_dns_rule` that forced `dest_ip_categories` and `res_categories` to match because of an old API requirement. [zia.terraform.firewall-resources:dns-category-match-check-removed] The DNS rule source still carries commented-out text saying the API returns `INVALID_INPUT_ARGUMENT` with "Requested IP-Categories and Resolved Domain Categories aren't matching" when the two sets differ. [zia.terraform.firewall-resources:dns-category-historical-comment] Backend acceptance is open [gap:zia.terraform.firewall-resources:dns-categories-backend-acceptance].

**Custom IPS signatures.** `zia_ips_signature_rules` validates `rule_text` against the Zscaler validation endpoint on every create and update; a rejected rule aborts before any state is written and the API diagnostic is surfaced. [zia.terraform.firewall-resources:ips-signature-validated-first] The validation endpoint requires literal `any` or a CIDR rather than Suricata variables like `$HOME_NET`, a `sid` of at least 1000000, both `msg` and `sid`, the `->` direction only, and no leading whitespace before `alert`. [zia.terraform.firewall-resources:ips-signature-syntax-limits] The provider normalizes leading and trailing whitespace and trailing newlines in `rule_text` on both sides of the diff, but an indent-stripping heredoc whose rule line is indented more than the closing marker leaves spaces that the endpoint rejects with `Unexpected character(s) at rule header`. [zia.terraform.firewall-resources:ips-signature-whitespace-normalized]

**IPS categories data source.** How the data source resolves a category, and that its name is the value firewall rules take: [The `zia_ips_categories` data source resolves a category by `id`, else by case-insensitive `name`, and with neither returns every category; the returned name is the exact identifier the firewall rules' `res_categories` and `dest_ip_categories` expect.](kb:zia.terraform.data-source-lookups:ips-categories-lookup).

What to check:
1. Whether a rule's EUN template was set in the console before blaming the provider for a plan difference.
2. Whether custom IPS signature text starts at `alert` with literal networks and a `sid` of at least 1000000.
3. Whether a PREDEFINED network service was imported before it was referenced.

Sources disagree (name both sides):
- Whether the firewall filtering rule contract carries the EUN fields. [divergence:zia.terraform.firewall-resources:eun-contract-vs-go-and-terraform]
  - api-specs: The Automate contract lists `eunTemplateId` and `isEunEnabled` as absent from the rule family's contract fields.
  - sdk-go: The Go SDK model carries `isEunEnabled`.
  Impact: Do not use the published contract to say whether a firewall rule accepts an EUN template; the SDK and provider send it.

Not known (open gaps):
- Whether a rule whose HCL omits `eun_template_id` plans a change to null while the apply leaves the tenant value unchanged [gap:zia.terraform.firewall-resources:issue-605-plan-diff]: settled by lab-test. Blocks: saying that an omitted EUN template produces a permanent plan difference on a firewall rule
- Whether the backend accepts different `dest_ip_categories` and `res_categories` sets on a DNS rule [gap:zia.terraform.firewall-resources:dns-categories-backend-acceptance]: settled by lab-test. Blocks: saying that DNS rule category sets no longer have to match

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.terraform.data-source-lookups.md (How some ZIA Terraform data sources look things up)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.terraform.rule-resources.md (Constraints shared by ZIA Terraform rule resources: order and predefined rules)
- see-also references/_meta/text/zia/zia.terraform.field-fidelity.md (ZIA Terraform resource fields that are not sent, not read back, or sent wrongly)
- see-also references/_meta/text/zia/zia.firewall.ips.md (IPS Control)
