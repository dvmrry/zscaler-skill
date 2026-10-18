URL Filtering is a first-match policy. {{ascending-order}} {{first-match}} So "which rule wins" is always the *first* matching rule, never the most specific rule and never the strictest one.

That is only half of a precedence answer. A rule "matches" a URL through its URL Categories criterion, and which category a URL belongs to is decided *before* any rule is walked, by most-specific-entry-wins across custom categories. A rule higher in the order can therefore silently never fire, because the URL resolved to a different category. Check category membership first, then walk the rules: see [[zia.url-categories.membership]].

Two order mechanics trip up "why didn't the higher rule fire?" questions. {{disabled-holds-slot}} Re-enabling a rule restores it to the same slot, so a disabled rule is invisible to evaluation while still occupying a position. {{admin-rank-precedes}} When a tenant uses admin ranks, the order an admin sees in the console is bounded by rank, which explains rules that seem impossible to move above another.

Order only applies among rules that are evaluated at all. If Cloud App Control explicitly allows the transaction, URL Filtering does not run unless cascading is enabled ([[zia.cloud-app-control.precedence]]). On inspected HTTPS, URL Filtering runs twice, once on the domain and once on the full URL ([[zia.ssl-inspection.pipeline]]).
