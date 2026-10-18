ZIA stages configuration until it is activated, and the Terraform provider decides when to activate. {{activation-env-gate}} {{activation-call-selects-nothing}} {{activation-is-tenant-wide}}

One resource breaks the gate. {{auth-settings-update-unconditional}} {{only-unguarded-call}} {{update-publishes-unrelated-changes}} When changes go live that nobody activated, check whether a plan updated `zia_auth_settings_urls` before suspecting the platform.
