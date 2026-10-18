There are two layers of exemption, and they are managed in different places.

**The URL-level list.** {{exempt-list-endpoint}} The spec text for the list's own field disagrees with the endpoint (divergence below); it is an authentication exemption. {{global-exempt-categories}}

**Through Terraform.** {{tf-list-resource}} Updating it reads the current list, then adds and removes the differences in separate calls, so a failure between them leaves the list half-changed: [[zia.terraform.multi-step-writes]].

**Capacity.** {{shared-url-pool}} The schema's 25,000 therefore overstates what this list alone can use when other custom URL lists are populated.

**Per-method exemptions in advanced settings.** {{bypass-by-method}} Because each method has its own list, a destination exempt from cookie authentication still gets a Kerberos or Digest challenge unless it is also on that method's list. Category-based exemptions rely on category membership, which is covered in [[zia.url-filtering]] and the category subjects it links.

What to check: which method challenged the request, which list covers that method, and whether the destination matches by URL, app or category. Traffic that skips the challenge is attributed to the location: [[zia.authentication.unauthenticated-traffic]].
