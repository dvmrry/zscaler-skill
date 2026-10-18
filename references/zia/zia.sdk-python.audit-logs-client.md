The audit log report calls in the Python SDK follow their own return convention and carry defects in `create` and `cancel`. The report itself is described in [[zia.audit-logs.report-api]].

**Return values.** {{raw-return-values}} {{errors-return-none}}

**Stray quote in the path.** {{create-cancel-url-stray-quote}} Whether the service accepts the quoted path is open {{gap:quoted-path-accepted}}.

**Cancel.** {{response-status-accessor}} {{cancel-attribute-error}}
