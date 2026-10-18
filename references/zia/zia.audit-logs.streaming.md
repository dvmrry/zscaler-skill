There are two ways to get the admin audit trail out of ZIA: pull it with the report API ([[zia.audit-logs.report-api]]) or push it with a feed.

**Which NSS can push it.** {{vm-nss-subscriptions}} {{vm-nss-no-admin-audit}}

**Cloud NSS.** {{cloud-nss-admin-audit}} {{audit-log-type-filter}} {{multifeed-admin-audit}} What an ADMIN_AUDIT feed's records look like is open {{gap:feed-contents}}. Traffic log schemas (web, firewall, DNS, CASB) are still in the legacy [log files](logs/) and only [[zia.logs.web-rule-attribution]] is a subject so far; none describe this feed.

**As code.** {{no-terraform-for-report}} Provider field behavior for the feed resource is in [[zia.terraform.field-fidelity]].
