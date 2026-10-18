The ZIA Terraform provider supports OneAPI and the legacy framework, and has a no-credential mode and its own rate-limit handling. {{legacy-compat-since-4-0}}

**Government clouds.** {{fedramp-gov-values}}

**Configuration-only mode.** {{skip-credentials-builds-no-client}} {{skip-credentials-intended-use}} {{skip-credentials-calls-fail}} {{skip-credentials-since-4-8-7}}

**Sandbox credentials.** {{sandbox-auth-variables}} The legacy variables are no longer supported, and a resource page still names them: [[zia.terraform.sandbox-resources:sandbox-token-variable-names]].

**Rate limiting.** {{retry-after-transparent}} {{keep-default-parallelism}} {{parallelism-ignored}} {{static-ip-post-1-per-second}} {{static-ip-legacy-rate-row}} Whether the OneAPI endpoint has the same limit is open {{gap:static-ip-oneapi-limit}}. {{provider-default-retries-100}}

**Coverage.** {{provider-tracks-public-api}} {{object-presence-not-entitlement}}

**Write lock.** {{write-lock-is-not-rate-limit}} How applies compete for that lock: [[zia.terraform.activation-methods]].
