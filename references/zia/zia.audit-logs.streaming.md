There are two ways to get the admin audit trail out of ZIA: pull it with the report API ([[zia.audit-logs.report-api]]) or push it with a feed.

Which NSS can push it: {{vm-nss-subscriptions}} {{vm-nss-no-admin-audit}}

Cloud NSS can: {{cloud-nss-admin-audit}} {{audit-log-type-filter}} {{multifeed-admin-audit}} What an ADMIN_AUDIT feed's records look like is not captured (gap `feed-contents`). Traffic log schemas (web, firewall, DNS, CASB) are still in the legacy `references/zia/logs/*.md` files and only `zia.logs.web-rule-attribution` is a subject so far; none describe this feed.

As code: {{no-terraform-for-report}} Provider field behavior for the feed resource is in [[zia.terraform.field-fidelity]].

Check the tenant's feeds with `zscalerctl zia nss-feeds list` for any feed whose nss_log_type is ADMIN_AUDIT before concluding the trail is, or is not, already reaching the SIEM.
