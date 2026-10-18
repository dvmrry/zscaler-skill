The ZIA provider (writes it makes are activated separately, see [[zia.terraform.activation]]) in some places reports success when an API call failed, and in a few places it crashes instead of returning an error. Both are bad for policy work: the operator sees a clean apply or refresh, or a dead provider, and the tenant is in a state nobody confirmed.

Refresh and Read. A failed read can look like a successful one. {{read-error-returns-nil}} {{read-error-returns-nil-sites}} After an apply or refresh that touched these settings, do not take a clean result as proof the tenant was read; the failure may not be logged at all, so re-read the settings from the API.

Writes after a failed check. Update handlers look the object up first, but only an object-not-found answer stops them. {{update-preflight-ignores-errors}} {{update-preflight-sites}}

Destroy has a benign variant, noted for completeness. {{not-found-destroy-keeps-id}} {{not-found-destroy-keeps-id-sites}}

Create. Create loops retry after errors, and the retry can repeat work that already happened. {{create-reposts-after-read-error}} {{create-reposts-after-read-error-sites}} {{duplicate-post-result}} After a create that took unusually long or errored, list the rules by name and look for a second copy or an unmanaged first one. The starting order for a new rule has its own error-handling gap. {{create-order-from-ignored-list-error}} {{create-order-from-ignored-list-error-sites}} Where a rule ends up afterwards is decided by the reorder worker; see [[zia.terraform.rule-order]].

Crashes. Rule updates park the rule at the end of the policy using the highest existing order, and several of them index that list without checking it. URL Filtering is covered in [[zia.terraform.rule-order]]; the same code exists elsewhere. {{sandbox-update-index-after-logged-error}} {{update-index-panic-sites}}

An update can also crash after ZIA has already accepted it, because the SDK cannot handle an empty reply. The mechanism and the URL Filtering instance are in [[zia.sdk-go.write-encoding]]. {{rule-labels-update-same-assertion}} {{empty-body-panic-sites}}

The DLP web rule create path combines a crash with a lock. {{dlp-web-subrule-create-nil-deref-under-lock}} {{dlp-web-lock-not-released-on-error}} If DLP web rule creates hang, or a subrule create crashes the provider, look for a failed parent or subrule read earlier in the run.

For the settings and omitted-value side of these update paths, see [[shared.sdk-go.zero-value-writes]]; for the delete-side detach helper, [[zia.terraform.delete-detach]]. Activation after each change is in [[zia.terraform.activation]].
