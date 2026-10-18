Terraform manages custom categories with `zia_url_categories` and edits predefined ones with `zia_url_categories_predefined`. {{import-custom-only}} {{predefined-import-only}}

**Custom categories.** {{url-order-diff-suppressed}} {{val-for-dlp-reference}} {{delete-detaches-v4-7-26}} How that detach is written: [[zia.terraform.multi-step-writes]]. The cap is documented as 48 {{tf-limit-48-custom}}, which disagrees with the help page {{divergence:custom-category-cap-48-vs-64}}. Plan time for very large categories is unmeasured {{gap:large-category-plan-time}}.

**Predefined categories.** It is one of the Early Access resources listed in [[zia.terraform.early-access:early-access-resources]]. {{predefined-incremental}} {{predefined-description-drift}} {{predefined-import-captures-existing}}
