# Where ZIA reads and writes disagree: an index of round-trip hazards (zia.api.read-write-asymmetries)
Also called: zia api round trip; get put mismatch; read write asymmetry; tz country prefix; sandbox order 127; auth_methods digest terraform

Some ZIA fields read back differently from how they were written, and the detail for each lives in its own subject. This page only points to them.

**Sandbox default rule order.** The default Sandbox rule reads as order 127 and what the API does with that value is open: [Sandbox rules: first-time file behavior and the default rule](kb:zia.sandbox.rules).

**Location time zone and country.** The API recently changed how the Netherlands time zone is spelled and which form a write accepts is open: [Location country and time zone values, THE_ prefix and Terraform validation](kb:zia.locations.country-timezone).

**Rule description whitespace.** The provider suppresses description diffs and whether the server rewrites whitespace is open: [URL Filtering rule fields where the Python SDK, Terraform provider and help disagree](kb:zia.api.url-filtering-wire).

**User authentication methods.** The Terraform user resource accepts a narrower set than the API: [ZIA Terraform operations that take several API writes with no rollback](kb:zia.terraform.multi-step-writes).

What to check:
1. Whether a drift or rejection on a rule, location or user is one of these known round-trip cases before treating it as a tenant change.
2. Whether a read-back write fails on server-assigned fields such as id, creationTime or modifiedTime. The legacy note that they are ignored is unverified.
3. For a DUPLICATE_ITEM on a default rule, do not create or manage the default rule through Terraform or the API, and do not import default rules.
4. For a rejection on an SSL Inspection default rule, check its read-only fields before writing; which fields the API rejects is open.

Not known (open gaps):
- Whether server-assigned fields can be sent back on write [gap:zia.api.read-write-asymmetries:server-fields-ignored]: settled by source-read
- Which read-only fields the API rejects on write [gap:zia.api.read-write-asymmetries:read-only-fields-on-write]: settled by source-read

Area: zia.api, its subjects in references/_meta/spine/zia/zia.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zia.api: OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- links-to references/_meta/text/zia/zia.api.url-filtering-wire.md (URL Filtering rule fields where the Python SDK, Terraform provider and help disagree)
- links-to references/_meta/text/zia/zia.locations.country-timezone.md (Location country and time zone values, THE_ prefix and Terraform validation)
- links-to references/_meta/text/zia/zia.sandbox.rules.md (Sandbox rules: first-time file behavior and the default rule)
- links-to references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)
