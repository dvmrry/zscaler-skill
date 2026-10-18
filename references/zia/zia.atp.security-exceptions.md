Security Exceptions is ATP's allowlist, and it is broader than its name suggests.

{{purpose}} {{precedence-over-options}} {{exempt-from-all-scanning}}

**What it skips.** {{skips-mp-atp-sandbox}} Sandbox is in that list, so an exception also changes file-analysis outcomes: [[zia.sandbox.verdicts]]. Checks that run before it are not skipped, such as Cloud App Control and URL Filtering ([[zia.atp.enforcement-order]]).

**Against the denylist.** The help page and the enforcement-order document disagree; see the divergence `allowlist-vs-malicious-url-check`. Until tested, do not promise that an exception overrides a Blocked Malicious URLs entry ([[zia.atp.blocked-urls]]).

**One list, two pages.** {{shared-list}} {{allowlist-capacity}} {{url-filtering-separate}} The help page also says the allowlist applies to URL Filtering, which the enforcement order contradicts; see the divergence `allowlist-vs-url-filtering-order`. The Malware Protection side of the tab is in [[zia.malware-protection]]; URL Filtering order is in [[zia.url-filtering.rule-order]].

**In the API.** {{wire-allowlist}}

What to check: the narrowest entry that fixes the case (an exception hides every ATP and Malware Protection detection for that URL), whether the URL is also on the denylist, and the country case in [[zia.atp.blocked-countries]].
