FTP Control is one settings object, not a rule list. Start with what the console offers, then what the API holds.

The console has an FTP over HTTP switch and a native FTP switch. {{allow-fohttp}} {{native-ftp-scoping}} {{urls-need-proxy-retrieval}} {{allowed-urls-count-toward-custom-limit}}

Do not look for a rule list, an action column or user scoping: {{console-has-no-action-or-user-scope}} The ALLOW, CAUTION and BLOCK actions belong to File Type Control, not here: [[zia.file-type-control.actions]].

Over the API: {{api-get-put}} {{api-fields}} {{enable-fohttp-flag}} The shape of `urlCategories` differs between sources: see divergence `url-categories-element-type`.

Open points: the default of the native FTP switch (see gap `native-ftp-default`) and the representation of Allow Any URL Category (see gap `allow-any-category-representation`).

Defaults and passive-only behavior are held by [[zia.firewall]], not repeated here; who the policy applies to is in [[zia.ftp-control.scope]]. When a tenant's FTP settings look right but traffic fails, check URL Filtering precedence first, then the location the user is at.
