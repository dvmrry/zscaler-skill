URL Filtering is a first-match policy. {{ascending-order}} {{first-match}}

**Category first.** Which category a URL is in is decided before any rule is walked: [[zia.url-categories.membership:resolved-before-rules]].

**Disabled rules and admin ranks.** {{disabled-holds-slot}} {{admin-rank-precedes}}

**Rules that never run.** If Cloud App Control explicitly allows the transaction, URL Filtering does not run unless cascading is enabled ([[zia.cloud-app-control.precedence]]). On inspected HTTPS, URL Filtering runs twice, once on the domain and once on the full URL ([[zia.ssl-inspection.pipeline]]).
