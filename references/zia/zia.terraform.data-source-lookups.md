Data sources look up one object by name or ID, but a few have lookup modes of their own. The ones below changed recently or return something other than a single match.

**Firewall filtering rules.** {{fw-rule-collection-mode}} Whether list-all reads are bounded on large tenants is open {{gap:fw-rule-list-all-limits}}.

**IPS categories.** {{ips-categories-lookup}}

**Cloud App Control actions.** {{cac-actions-split}} The action rules themselves are in [[zia.cloud-app-control.actions]]. Other lookup defects, such as selectors that are never read, are in [[zia.terraform.data-source-fidelity]].
