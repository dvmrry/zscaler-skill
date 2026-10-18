Security Exceptions is ATP's allowlist.

{{purpose}} {{precedence-over-options}} {{exempt-from-all-scanning}}

**What it skips.** {{skips-mp-atp-sandbox}} Sandbox is in that list, so an exception also changes file-analysis outcomes: [[zia.sandbox.verdicts]]. Checks that run before it are not skipped, such as Cloud App Control and URL Filtering ([[zia.atp.enforcement-order]]).

**Against the denylist.** The help page and the enforcement-order document disagree {{divergence:allowlist-vs-malicious-url-check}}. The denylist is [[zia.atp.blocked-urls]], and no source shows what a tenant does with a URL on both lists {{gap:order-vs-allowlist-live}}.

**One list, two pages.** {{shared-list}} {{allowlist-capacity}} {{url-filtering-separate}} The help page also says the allowlist applies to URL Filtering, which the enforcement order contradicts {{divergence:allowlist-vs-url-filtering-order}}. The Malware Protection side of the tab is in [[zia.malware-protection]]; URL Filtering order is in [[zia.url-filtering.rule-order]].

**In the API.** {{wire-allowlist}} The country case is in [[zia.atp.blocked-countries]].
