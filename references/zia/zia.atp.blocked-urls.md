The Blocked Malicious URLs list is the tenant's own denylist inside ATP. It is not the same list as Security Exceptions ([[zia.atp.security-exceptions]]).

{{list-capacity}} {{entry-format}} How entries are written and matched is in [[zia.url-categories.entry-format]] and [[zia.url-categories.entry-matching]].

Matching follows URL Filtering's specificity rule. {{specificity-wins}} The membership logic is in [[zia.url-categories.membership]].

**Allowlist or denylist?** The help page's wording and the API disagree; see the divergence `help-says-allowlist-or-denylist`. In the API: {{wire-denylist}}

**Writing it.** {{add-remove-action}} {{python-add-delete}} The Go updater and the provider read the current list, then send an add and a remove: [[zia.terraform.multi-step-writes]]. {{capture-flag}}

**The Go comment.** See the divergence `go-comment-says-allowlist`; treat maliciousUrls as a denylist.

Where the check falls: it is the first check of an HTTP request ([[zia.atp.enforcement-order]]).

What to check: whether the URL or a more specific entry is already in the list, whether the list was read in full, and whether the entry matches the form the guidelines require.
