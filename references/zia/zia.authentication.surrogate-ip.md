Surrogate IP is the answer to "this user is logged in, so why was this request treated as the location?" It is a per-location opt-in. {{definition}} {{browser-benefit}}

**How the mapping behaves.** {{one-user-at-a-time}} {{churn-disables}}

**What it cannot work with.** {{no-nat}} {{dedicated-port}} {{no-vdi}} {{not-inherited}}

**Configuring it.** {{location-fields}} {{known-browsers}} {{refresh-vs-lease}}

**What Terraform rejects.** {{provider-checks}} {{provider-checks-apply-time}} Other provider behavior for locations is in [[zia.terraform.field-fidelity]].

**Client Connector.** {{windows-app-flag}}
