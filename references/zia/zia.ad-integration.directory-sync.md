"I added the user to the AD group, why does the rule not match yet?" {{sync-actions}} {{periodic-or-on-demand}} {{change-lag}} The last run is visible in the settings object: {{last-sync-fields}} The Lite variant of that object omits these fields, see [[zia.authentication.settings:org-object]].

**Authentication of synced users.** {{ldap-bind-auth}} Directory sync pairs only with LDAP BIND and the one-time methods, see [[zia.ad-integration.provisioning-methods]].

**Users removed from the directory.** {{deactivate-not-delete}} The two captured articles word this differently, which is recorded as an open question.

**Scope.** {{scope-fields}}

**Nested groups** are not documented either way; the open question below says what to test before relying on them for policy.

If immediate propagation matters, the documented alternative is SCIM, where the client pushes changes: [[zia.scim.propagation]]. To move a tenant off directory sync, see [[zia.scim.setup]] and the migration flag in [[zia.authentication.settings]].

What to check: the last sync timestamps on the org settings object, whether the user is in the synced domain with a user or email attribute, and whether a sync has run since the directory change.
