There are two ways to get the admin audit trail out of ZIA: pull it with the report API ([[zia.audit-logs.report-api]]) or push it with a feed.

**Which NSS can push it.** {{vm-nss-subscriptions}} {{vm-nss-no-admin-audit}}

**Cloud NSS.** {{cloud-nss-admin-audit}} {{audit-log-type-filter}} {{multifeed-admin-audit}} What an ADMIN_AUDIT feed's records look like is open {{gap:feed-contents}}. Traffic log fields are the generated types [[zia/web-log]], [[zia/firewall-log]] and [[zia/dns-log]], with behavior in [[zia.logs.web-records]] and [[zia.logs.firewall-records]]; none describe this feed.

**As code.** {{no-terraform-for-report}} Provider field behavior for the feed resource is in [[zia.terraform.field-fidelity]].
