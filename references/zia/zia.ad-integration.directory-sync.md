"I added the user to the AD group, why does the rule not match yet?" {{sync-actions}} {{periodic-or-on-demand}} {{change-lag}} The last run is visible in the settings object: {{last-sync-fields}} The Lite variant of that object omits these fields, see [[zia.authentication.settings:org-object]].

**Authentication of synced users.** {{ldap-bind-auth}} Directory sync pairs only with LDAP BIND and the one-time methods, see [[zia.ad-integration.provisioning-methods]].

**Users removed from the directory.** {{deactivate-not-delete}} The two captured articles word this differently {{gap:delete-vs-deactivate-wording}}.

**Scope.** {{scope-fields}}

**Nested groups.** Whether nested directory groups are expanded during sync is open {{gap:nested-groups}}.

If immediate propagation matters, the documented alternative is SCIM, where the client pushes changes: [[zia.scim.propagation]]. To move a tenant off directory sync, see [[zia.scim.setup]] and the migration flag in [[zia.authentication.settings]].
