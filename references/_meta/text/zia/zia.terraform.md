# The ZIA Terraform provider: where its behavior is described (zia.terraform)
Also called: zia terraform provider; terraform-provider-zia; zia terraform

This walks the subjects that describe what the ZIA Terraform provider sends, reads and reports. Which API paths and SDK packages each resource uses, and its arguments (type, required or optional, computed, ForceNew, defaults, enum values and validators, nested blocks), are generated from the provider code: run `node scripts/kb.mjs surface <resource name>`; `provider:zia` gives the provider's own settings.

**Connecting and activating.** Authentication, client modes and rate limiting are in [ZIA Terraform provider authentication, client modes and rate limiting](kb:zia.terraform.provider-modes). When changes become live is in [When the ZIA Terraform provider activates configuration](kb:zia.terraform.activation), [Activating ZIA changes from Terraform: methods, session end and concurrent applies](kb:zia.terraform.activation-methods) and [The zia_activation_status resource: when it activates and what it cannot do](kb:zia.terraform.activation-resource).

**Rule order.** How the provider applies `order` is in [How the ZIA Terraform provider applies rule order](kb:zia.terraform.rule-order), its shared reorder registry in [The ZIA provider's reorder registry: keys, locks and lifecycle across rule resources](kb:zia.terraform.rule-order.registry), and the constraints common to rule resources in [Constraints shared by ZIA Terraform rule resources: order and predefined rules](kb:zia.terraform.rule-resources).

**What reaches the API.** Fields not sent, not read back or sent wrongly are in [ZIA Terraform resource fields that are not sent, not read back, or sent wrongly](kb:zia.terraform.field-fidelity). Operations that take several writes with no rollback are in [ZIA Terraform operations that take several API writes with no rollback](kb:zia.terraform.multi-step-writes), detach-before-delete in [How the ZIA Terraform provider detaches references before deleting objects](kb:zia.terraform.delete-detach), and success reported after an error in [When the ZIA Terraform provider reports success after an error, or crashes](kb:zia.terraform.error-handling). Data sources are in [What ZIA Terraform data sources return, drop, or get wrong](kb:zia.terraform.data-source-fidelity) and [How some ZIA Terraform data sources look things up](kb:zia.terraform.data-source-lookups).

**Resource families.** Policy resources: [Terraform user agent validation and isolation on URL Filtering rules](kb:zia.terraform.url-filtering-rules), [The URL Filtering and Cloud App advanced settings resource: import, field names and what an update sends](kb:zia.terraform.url-filtering-settings), [Terraform custom and predefined URL category resources](kb:zia.terraform.url-categories), [The Cloud App Control rule resource: prompt capture, isolation, import and delete](kb:zia.terraform.cloud-app-control-rule), [Terraform firewall, DNS and IPS resources: EUN fields, DNS categories, custom signatures](kb:zia.terraform.firewall-resources), [Terraform DLP web rule and email profile resources](kb:zia.terraform.dlp-resources) and [Terraform sandbox resources: file submission and the MD5 blocklist](kb:zia.terraform.sandbox-resources). Forwarding: [Terraform GRE tunnel, static IP, VPN credential and location resources](kb:zia.terraform.traffic-forwarding-resources) and [The zia_pac_files resource: versions, pinning and status transitions](kb:zia.terraform.pac-files). Administration and settings: [Terraform admin roles, admin users and local users in ZIA](kb:zia.terraform.admin-identity), [Terraform global settings resources: URL lists, end user notification and browser control](kb:zia.terraform.settings), [Terraform UEBA alert definitions: accepted names and lookups](kb:zia.terraform.ueba-alerts) and [Early Access Terraform resources: extranet, data center exclusions, subclouds](kb:zia.terraform.early-access).

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.terraform.activation.md (When the ZIA Terraform provider activates configuration)
- links-to references/_meta/text/zia/zia.terraform.activation-methods.md (Activating ZIA changes from Terraform: methods, session end and concurrent applies)
- links-to references/_meta/text/zia/zia.terraform.activation-resource.md (The zia_activation_status resource: when it activates and what it cannot do)
- links-to references/_meta/text/zia/zia.terraform.admin-identity.md (Terraform admin roles, admin users and local users in ZIA)
- links-to references/_meta/text/zia/zia.terraform.cloud-app-control-rule.md (The Cloud App Control rule resource: prompt capture, isolation, import and delete)
- links-to references/_meta/text/zia/zia.terraform.data-source-fidelity.md (What ZIA Terraform data sources return, drop, or get wrong)
- links-to references/_meta/text/zia/zia.terraform.data-source-lookups.md (How some ZIA Terraform data sources look things up)
- links-to references/_meta/text/zia/zia.terraform.delete-detach.md (How the ZIA Terraform provider detaches references before deleting objects)
- links-to references/_meta/text/zia/zia.terraform.dlp-resources.md (Terraform DLP web rule and email profile resources)
- links-to references/_meta/text/zia/zia.terraform.early-access.md (Early Access Terraform resources: extranet, data center exclusions, subclouds)
- links-to references/_meta/text/zia/zia.terraform.error-handling.md (When the ZIA Terraform provider reports success after an error, or crashes)
- links-to references/_meta/text/zia/zia.terraform.field-fidelity.md (ZIA Terraform resource fields that are not sent, not read back, or sent wrongly)
- links-to references/_meta/text/zia/zia.terraform.firewall-resources.md (Terraform firewall, DNS and IPS resources: EUN fields, DNS categories, custom signatures)
- links-to references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)
- links-to references/_meta/text/zia/zia.terraform.pac-files.md (The zia_pac_files resource: versions, pinning and status transitions)
- links-to references/_meta/text/zia/zia.terraform.provider-modes.md (ZIA Terraform provider authentication, client modes and rate limiting)
- links-to references/_meta/text/zia/zia.terraform.rule-order.md (How the ZIA Terraform provider applies rule order)
- links-to references/_meta/text/zia/zia.terraform.rule-order.registry.md (The ZIA provider's reorder registry: keys, locks and lifecycle across rule resources)
- links-to references/_meta/text/zia/zia.terraform.rule-resources.md (Constraints shared by ZIA Terraform rule resources: order and predefined rules)
- links-to references/_meta/text/zia/zia.terraform.sandbox-resources.md (Terraform sandbox resources: file submission and the MD5 blocklist)
- links-to references/_meta/text/zia/zia.terraform.settings.md (Terraform global settings resources: URL lists, end user notification and browser control)
- links-to references/_meta/text/zia/zia.terraform.traffic-forwarding-resources.md (Terraform GRE tunnel, static IP, VPN credential and location resources)
- links-to references/_meta/text/zia/zia.terraform.ueba-alerts.md (Terraform UEBA alert definitions: accepted names and lookups)
- links-to references/_meta/text/zia/zia.terraform.url-categories.md (Terraform custom and predefined URL category resources)
- links-to references/_meta/text/zia/zia.terraform.url-filtering-rules.md (Terraform user agent validation and isolation on URL Filtering rules)
- links-to references/_meta/text/zia/zia.terraform.url-filtering-settings.md (The URL Filtering and Cloud App advanced settings resource: import, field names and what an update sends)
