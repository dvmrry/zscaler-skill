These are claims about the Go SDK's list helpers and the Terraform providers built on them, not about how ZPA, ZCC or ZTC behave. The helpers decide when a list is "finished" from the response they get.

**ZPA paging.** {{zpa-total-pages-parse-error-ignored}} {{zpa-loop-trusts-latest-total-pages}} {{zpa-post-search-same-parse}}

**ZPA SCIM paging.** {{zpa-scim-advances-by-requested-count}} {{zpa-scim-stops-on-total-results}}

**Silent truncation and callers.** {{zpa-silent-truncation}} {{zpa-helper-callers}} Whether ZPA endpoints send such paging metadata is open {{gap:zpa-paging-metadata-shape}}.

**ZCC v2 paging.** {{zcc-skip-advances-by-requested-size}} {{zcc-guards-need-envelope-metadata}} {{zcc-skip-records-or-loop}} {{zcc-v2-callers}} Whether ZCC v2 endpoints cap the page or fill the envelope is open {{gap:zcc-v2-envelope-behavior}}.

**ZTC paging.** {{ztw-stops-on-page-shorter-than-1000}} {{ztw-capped-page-truncates}} {{ztw-helper-callers}} Whether a ZTC endpoint caps its page is open {{gap:page-size-caps}}.

**ZIA paging.** The ZIA helper stops the same way, covered for URL Filtering in [[zia.url-filtering.list-pagination]]. {{zia-readallpages-extra-request}}

**ZCC forwarding profiles.** {{zcc-forwarding-profile-single-request}} {{zcc-forwarding-profile-read-drops-state}} {{zcc-forwarding-profile-outside-first-page}} Whether the endpoint pages its response by default is open {{gap:zcc-forwarding-profile-default-page}}.

**ZIA posture profiles.** {{zia-posture-import-by-name-uses-list-helper}} {{provider-documents-posture-list-truncated}} {{zia-posture-import-by-name-can-miss}} Whether the truncation is server paging or the SDK helper is open {{gap:zia-posture-truncation-cause}}. The same pattern of a truncated list feeding a decision appears in [[zia.terraform.rule-order]], where the "last rule" comes from a list that may be partial.
