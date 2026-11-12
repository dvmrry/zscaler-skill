# Who can manage a custom URL or TLD category: roles and operational scope (zia.url-categories.admin-scope)
Also called: Administrator Operational Scope; custom category operational scope; Custom URL Management role

Managing a custom category is limited by the admin's role and, for User-Defined categories, by the category's operational scope. Custom categories can be managed only by super admins, admins with the Custom URL Management role, or admins with the Custom URL Management and Override Existing URLs role. [zia.url-categories.admin-scope:who-can-manage]

**Operational scope.** The operational scope option is available for a category only when its URL Super Category is User-Defined. Several scopes can be selected, and with more than one scope OR logic is used to find a match. [zia.url-categories.admin-scope:scope-availability] Any lets any admin manage, and admin roles then control which admins can manage custom categories. Organization lets admins whose scope is Organization manage. Location Group, Location and Department let admins with one or more of the selected items in their scope manage. [zia.url-categories.admin-scope:scope-kinds] Admins with an operational scope over location groups that include one or more of the selected locations can also manage the category but cannot change its operational scope. A User-Defined category can be deleted only if the admin's scope matches the category's scope exactly. Operational scopes an admin does not see are not part of that admin's operational scope. [zia.url-categories.admin-scope:scope-limits] Whether the API carries the scope is open [gap:zia.url-categories.admin-scope:api-scopes-field].

**Examples.** The page's examples: an admin whose Location scope includes only San Jose and Bangalore can edit Example Category, and an admin whose department scope is only over Sales can also edit it. An admin with the Location Group scope England (London and Manchester) can edit all of Test Category except its operational scope. [zia.url-categories.admin-scope:scope-examples]

**TLD categories.** TLD categories take multiple operational scopes with OR logic when there is more than one, and a User-Defined custom category can be deleted only if the admin's scope exactly matches the category's scope. [zia.url-categories.admin-scope:tld-scope]

Not known (open gaps):
- How the API represents a custom category's operational scope [gap:zia.url-categories.admin-scope:api-scopes-field]: settled by source-read

Area: zia.url-categories, its subjects in references/_meta/spine/zia/zia.url-categories.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to)
- see-also references/_meta/text/zia/zia.url-categories.entry-format.md (What a URL category entry may contain, and category limits)
- see-also references/_meta/text/shared/shared.admin-rbac.zia-permissions.md (ZIA admin role permissions: logs limit, dashboard, reporting, insights and alerts access, and the feature categories)
