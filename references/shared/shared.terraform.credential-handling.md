Provider credentials for the SDK itself are covered in [[shared.sdk-go.auth-lifecycle]]; this subject is about secrets that pass through resources and data sources. Secrets can show up in three different places when a Terraform provider handles a credential: in the state file, in plan and CLI output, and in logs. The `Sensitive` flag on a schema attribute affects how Terraform displays the value in plan and CLI output, and whether it changes what is written to state or to a provider's own log lines is open {{gap:sensitive-flag-scope}}.

**ZIA data sources and state.** {{c2c-ir-secrets-not-sensitive}} {{c2c-ir-secrets-copied-to-state}} {{cloud-nss-and-admin-token-in-state}} Whether any of this reaches state in practice is open {{gap:api-returns-secrets}}.

**Other ZIA data sources.** {{zia-psk-handled-differently}} {{zia-data-source-secret-attributes-unmarked}}

**ZIA data source logging.** {{c2c-ir-entity-log-includes-secrets}} {{c2c-ir-response-log-prints-pointer-only}}

**PRA credential create.** {{pra-create-sanitizer-mutates-request}} {{sanitizer-misses-private-key}} {{pra-create-log-prints-private-key}} {{sanitizer-call-sites}} {{pra-read-never-sets-secrets}} What ZPA does with the sentinel is open {{gap:api-pra-sentinel}}.

**Updates and the PRA data source.** {{pra-update-omits-empty-secrets}} Whether the API clears a stored secret when the field is absent from a PUT, or keeps it, is open {{gap:api-pra-empty-secret}}. {{pra-data-source-password-declared-not-set}}

**SDK request and response logging.** {{sdk-logs-full-bodies-when-enabled}}

Related: [[shared.sdk-go.auth-lifecycle]] covers how the SDK gets its own API credentials, and [[zia.sdk-go.write-encoding]] covers the `omitempty` behavior behind the update trap.
