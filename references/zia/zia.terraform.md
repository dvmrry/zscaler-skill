This walks the subjects that describe what the ZIA Terraform provider sends, reads and reports. Which API paths and SDK packages each resource uses is generated: run `node scripts/kb.mjs surface <resource name>`.

**Connecting and activating.** Authentication, client modes and rate limiting are in [[zia.terraform.provider-modes]]. When changes become live is in [[zia.terraform.activation]], [[zia.terraform.activation-methods]] and [[zia.terraform.activation-resource]].

**Rule order.** How the provider applies `order` is in [[zia.terraform.rule-order]], its shared reorder registry in [[zia.terraform.rule-order.registry]], and the constraints common to rule resources in [[zia.terraform.rule-resources]].

**What reaches the API.** Fields not sent, not read back or sent wrongly are in [[zia.terraform.field-fidelity]]. Operations that take several writes with no rollback are in [[zia.terraform.multi-step-writes]], detach-before-delete in [[zia.terraform.delete-detach]], and success reported after an error in [[zia.terraform.error-handling]]. Data sources are in [[zia.terraform.data-source-fidelity]] and [[zia.terraform.data-source-lookups]].

**Resource families.** Policy resources: [[zia.terraform.url-filtering-rules]], [[zia.terraform.url-filtering-settings]], [[zia.terraform.url-categories]], [[zia.terraform.cloud-app-control-rule]], [[zia.terraform.firewall-resources]], [[zia.terraform.dlp-resources]] and [[zia.terraform.sandbox-resources]]. Forwarding: [[zia.terraform.traffic-forwarding-resources]] and [[zia.terraform.pac-files]]. Administration and settings: [[zia.terraform.admin-identity]], [[zia.terraform.settings]], [[zia.terraform.ueba-alerts]] and [[zia.terraform.early-access]].
