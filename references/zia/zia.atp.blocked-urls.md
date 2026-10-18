The Blocked Malicious URLs list is the tenant's own denylist inside ATP. It is not the same list as Security Exceptions ([[zia.atp.security-exceptions]]).

{{list-capacity}} {{entry-format}} How entries are written and matched is in [[zia.url-categories.entry-format]] and [[zia.url-categories.entry-matching]].

**Specificity wins.** {{specificity-wins}} The membership logic is in [[zia.url-categories.membership]].

**Allowlist or denylist?** The help page and the API disagree {{divergence:help-says-allowlist-or-denylist}}. In the API: {{wire-denylist}}

**Writing it.** {{add-remove-action}} {{python-add-delete}} The Go updater and the provider read the current list, then send an add and a remove: [[zia.terraform.multi-step-writes]]. {{capture-flag}}

**The Go comment.** The Go field comment calls the list an allowlist {{divergence:go-comment-says-allowlist}}.

{{first-request-check}} The full order is in [[zia.atp.enforcement-order]].
