Some ZIA fields read back differently from how they were written, and the detail for each lives in its own subject. This page only points to them.

**Sandbox default rule order.** The default Sandbox rule reads as order 127 and what the API does with that value is open: [[zia.sandbox.rules]].

**Location time zone and country.** The API recently changed how the Netherlands time zone is spelled and which form a write accepts is open: [[zia.locations.country-timezone]].

**Rule description whitespace.** The provider suppresses description diffs and whether the server rewrites whitespace is open: [[zia.api.url-filtering-wire]].

**User authentication methods.** The Terraform user resource accepts a narrower set than the API: [[zia.terraform.multi-step-writes]].
