The ZIA provider (writes it makes are activated separately, see [[zia.terraform.activation]]) in some places reports success when an API call failed, and in a few places it crashes instead of returning an error. Both are bad for policy work: the operator sees a clean apply or refresh, or a dead provider, and the tenant is in a state nobody confirmed.

**Refresh and Read.** {{read-error-returns-nil}} {{read-error-returns-nil-sites}}

**Writes after a failed check.** {{update-preflight-ignores-errors}} {{update-preflight-sites}}

**Destroy on not-found.** {{not-found-destroy-keeps-id}} {{not-found-destroy-keeps-id-sites}}

**Create retries and starting order.** {{create-reposts-after-read-error}} {{create-reposts-after-read-error-sites}} {{duplicate-post-result}} {{create-order-from-ignored-list-error}} {{create-order-from-ignored-list-error-sites}} Where a rule ends up afterwards is decided by the reorder worker; see [[zia.terraform.rule-order]].

**Crashes on update.** {{sandbox-update-index-after-logged-error}} {{update-index-panic-sites}} {{update-parks-at-last-rule-order}} URL Filtering is covered in [[zia.terraform.rule-order]].

**Empty update replies.** {{rule-labels-update-same-assertion}} {{empty-body-panic-sites}} {{empty-reply-panic-follows-server-answer}} The mechanism and the URL Filtering instance are in [[zia.sdk-go.write-encoding]].

**DLP web rule create.** {{dlp-web-subrule-create-nil-deref-under-lock}} {{dlp-web-lock-not-released-on-error}}

For the settings and omitted-value side of these update paths, see [[shared.sdk-go.zero-value-writes]]; for the delete-side detach helper, [[zia.terraform.delete-detach]]. Activation after each change is in [[zia.terraform.activation]].
