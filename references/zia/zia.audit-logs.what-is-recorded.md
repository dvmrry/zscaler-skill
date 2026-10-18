The admin audit log answers "who changed what, when, from where, and with what result". {{scope}} {{purposes}} Failed sign-in attempts that lead to a lockout are recorded: {{lockout-recorded}}

How far back it goes is bounded. {{retention}} Whether that window can be extended is open (gap `retention-window`), and so is how it compares with traffic log retention (gap `retention-scope`).

Reading it in the console: {{console-page}} {{search-prefix-only}} {{csv-timezone}}

What each entry carries: {{columns}} {{resource-meaning}} {{oauth-admin-id}} {{trace-id-oneapi}}

The Action and Category filters take fixed values. {{action-values}} {{category-values}} The category list is also how to find the change history of an area such as restore points, which are covered in [[zia.backup-restore]].

Two limits on what the trail shows. {{incidental-rule-changes}} So an audit entry for a rule-order change is evidence of the rule that was created, not of every rule that shifted; to see the full effect, read the rule list. {{config-diff}}

To pull the same data programmatically see [[zia.audit-logs.report-api]]; to stream it to a SIEM see [[zia.audit-logs.streaming]].

Check before relying on it: the time window versus the 6-month limit, whether the CSV timezone (PDT) matches the timezone of the incident timeline, and whether the change of interest was a direct action or an incidental rule-order shift.
