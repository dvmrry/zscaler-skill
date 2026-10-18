Activation from Terraform is tenant-wide, and the platform can also activate on its own. {{tenant-wide-call}}

**Methods.** {{three-methods}} {{activator-one-call}} {{status-resource-needs-depends-on}} {{env-method-discouraged}} {{activation-endpoint-budget}} What the provider itself sends when it activates: [[zia.terraform.activation]].

**Session end.** {{session-end-autoactivation}} {{session-timeout-range}} {{mid-run-activation}} {{autoactivation-cannot-be-disabled}} {{activator-does-not-suppress}} {{raise-timeout-to-20}}

**Several configurations, one tenant.** {{one-apply-per-tenant}} {{lock-errors-retried}} {{do-not-lower-parallelism}} {{activation-queues}} {{queue-publishes-partial-runs}} {{separate-tenant-boundary}}
