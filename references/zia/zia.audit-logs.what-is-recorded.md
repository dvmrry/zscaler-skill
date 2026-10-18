The admin audit log answers "who changed what, when, from where, and with what result". {{scope}} {{purposes}} Failed sign-in attempts that lead to a lockout are recorded: {{lockout-recorded}}

**Retention.** {{retention}} Whether that window can be extended is open {{gap:retention-window}}, and so is how it compares with traffic log retention {{gap:retention-scope}}.

Reading it in the console: {{console-page}} {{search-prefix-only}} {{csv-timezone}}

What each entry carries: {{columns}} {{resource-meaning}} {{oauth-admin-id}} {{trace-id-oneapi}}

**Filters.** {{action-values}} {{category-values}} The category list is also how to find the change history of an area such as restore points, which are covered in [[zia.backup-restore]].

**Incidental changes.** {{incidental-rule-changes}} {{config-diff}}

To pull the same data programmatically see [[zia.audit-logs.report-api]]; to stream it to a SIEM see [[zia.audit-logs.streaming]].
