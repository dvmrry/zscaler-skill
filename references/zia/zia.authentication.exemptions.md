There are two layers of exemption, and they are managed in different places.

**The URL-level list.** {{exempt-list-endpoint}} The Python SDK posts the change, sleeps 2 seconds and returns a re-read of the list {{python-exempt-list-refetch}}. The spec text for the list's own field disagrees with the endpoint {{divergence:exempt-list-description}}. {{global-exempt-categories}}

**Through Terraform.** {{tf-list-resource}} Updating it reads the current list, then adds and removes the differences in separate calls, so a failure between them leaves the list half-changed: [[zia.terraform.multi-step-writes]].

**Capacity.** {{shared-url-pool}} {{schema-cap-exceeds-pool-share}}

**Per-method exemptions in advanced settings.** {{bypass-by-method}} Category-based exemptions rely on category membership, which is covered in [[zia.url-filtering]] and the category subjects it links.

Traffic that skips the challenge is attributed to the location: [[zia.authentication.unauthenticated-traffic]].
