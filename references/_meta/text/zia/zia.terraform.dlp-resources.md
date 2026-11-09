# Terraform DLP web rule and email profile resources (zia.terraform.dlp-resources)
Also called: zia_dlp_web_rules sub_rules; dlp web rule url category val; zia_email_profile early access; destroy parent dlp rule

DLP web rules relate to URL categories and to each other in provider-specific ways. The DLP web rule documentation examples reference URL categories through the category's numeric `val` attribute. [zia.terraform.dlp-resources:category-by-val] How the category side is defined: [Terraform custom and predefined URL category resources](kb:zia.terraform.url-categories).

**Parent and sub-rules.** Exception (sub-) rules are separate `zia_dlp_web_rules` resources that set `parent_rule` to the parent's numeric rule ID; the parent's `sub_rules` attribute is computed after apply. [zia.terraform.dlp-resources:subrules-separate-resources] Destroying a parent DLP web rule also destroys all its sub-rules. [zia.terraform.dlp-resources:parent-destroy-removes-subrules]

**Email profiles.** `zia_email_profile` is documented as an Early Access feature. [zia.terraform.dlp-resources:email-profile-early-access]

What to check:
1. Whether a DLP rule's URL category is referenced by `val`, not by name.
2. Whether a destroy plan removes a parent DLP rule, which takes its sub-rules with it.

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.terraform.url-categories.md (Terraform custom and predefined URL category resources)
