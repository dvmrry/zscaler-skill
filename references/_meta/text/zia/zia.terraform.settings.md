# Terraform global settings resources: URL lists, end user notification and browser control (zia.terraform.settings)
Also called: zia_security_settings; zia_end_user_notification; zia_browser_control_policy; smart_isolation_profile; NOT_SUBSCRIBED browser control; whitelist_urls 255; blacklist_urls 275000; browser control ANY drift

A few global settings resources have rules that the schema does not show: caps on the URL lists, a rejected content type in notifications, and special handling of empty or equivalent values in browser control. Each is a place where a plan can differ from what the API holds.

**URL lists.** The `zia_security_settings` schema caps the allowlist (`whitelist_urls`) at 255 entries and the denylist (`blacklist_urls`) at 275000 entries. [zia.terraform.settings:url-lists-capped] The two lists are written with two separate calls: [ZIA Terraform operations that take several API writes with no rollback](kb:zia.terraform.multi-step-writes).

**End user notifications.** The provider documents that the ZIA API does not accept JavaScript tags in end user notification text attributes and answers them with an HTTP 406 Rejected error. [zia.terraform.settings:eun-no-javascript] Provider issue #472, still open, reports that `zia_end_user_notification` `custom_text` holding JavaScript was rejected, which a repository member put down to the API not supporting JavaScript tags in the payload and escalated as an internal bug, and that on provider 4.4.9/10 heredoc formatting was not respected and a heredoc using the Terraform escape `$${` led to a change swapping back to escape from the native `${` result. On the heredoc indentation, the member answered that the provider sets the HCL as returned by the API and pointed the reporter to Zscaler support. [zia.terraform.settings:issue-472-javascript-and-escape-drift] Whether the escape drift remains is open [gap:zia.terraform.settings:issue-472-escape-drift-current].

**Browser control.** The browser control resource treats a `smart_isolation_profile` as configured only when its `id`, `name` or `url` is non-empty, because the service reports an all-zero profile object on tenants that have none and a bare block in HCL flattens to empty strings. [zia.terraform.settings:profile-needs-real-value] When the service reports no profile, Read records that absence and so clears an all-empty block left by an earlier release, except that state holding a real profile the service did not echo back is left alone to avoid false drift. [zia.terraform.settings:absent-profile-recorded-as-none] A smart isolation profile change is sent only when one side holds a real profile; the code comments that an all-empty block left in state by earlier releases is not worth sending because tenants without a Cloud Browser Isolation subscription are answered with 403 NOT_SUBSCRIBED. [zia.terraform.settings:profile-change-skipped-when-empty] The Browser Control API accepts the value ANY in a request but normalizes it server-side to an empty list or ["NONE"], treating ANY, NONE and no entries as equivalent; the provider keeps a declared ["ANY"] in state when the API returns that no-entries form so later plans converge. [zia.terraform.settings:any-normalised-by-api] The data-source side of the empty profile is in [What ZIA Terraform data sources return, drop, or get wrong](kb:zia.terraform.data-source-fidelity).

What to check:
1. Whether a browser control plan fails with NOT_SUBSCRIBED on a tenant without Cloud Browser Isolation, and whether the profile block holds a real value.
2. Whether a browser control list drift is the ANY, NONE and empty-list equivalence rather than a real change.
3. Whether a notification text containing a script tag is the cause of an HTTP 406 on the end user notification resource.
4. Whether the allowlist or denylist length is within the schema caps.

Not known (open gaps):
- Whether the current provider still rewrites `$${` in end user notification text [gap:zia.terraform.settings:issue-472-escape-drift-current]: settled by lab-test. Blocks: saying that escaped template syntax in notification text plans cleanly

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.terraform.data-source-fidelity.md (What ZIA Terraform data sources return, drop, or get wrong)
- links-to references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)
