"Is this URL blocked, and by which rule?" needs four questions answered in order. Skipping one is how precedence answers go wrong.

1. **Does URL Filtering run at all?** A Cloud App Control allow skips it unless cascading is on, and Bypass Other Policies skips it entirely: [[zia.cloud-app-control.precedence]], [[zia.ssl-inspection.pipeline]].
2. **Which category is the URL in?** Resolved before rules, by most-specific entry across custom categories and by Retain Parent for predefined ones: [[zia.url-categories.membership]], with entry syntax in [[zia.url-categories.entry-matching]].
3. **Which rules' criteria match?** The criteria expression, including the AND between two URL Categories fields and what is visible before decryption: [[zia.url-filtering.criteria]].
4. **Which matching rule is first?** First match by ascending order, with disabled rules holding their slot: [[zia.url-filtering.rule-order]].

The answer is then that rule's action and its prerequisites: [[zia.url-filtering.actions]]. Tenant-wide settings can change the outcome without any rule changing: [[zia.url-filtering.advanced-settings]].

Before reasoning over a tenant's rules, make sure the list is complete: [[zia.url-filtering.list-pagination]].
