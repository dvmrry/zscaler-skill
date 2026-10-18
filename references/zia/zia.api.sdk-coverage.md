SDK presence is a statement about code, not about whether a tenant can use the endpoint. The Go and Python SDKs do not wrap the same ZIA endpoints, and the difference moves with each release.

**Only in Go.** {{go-scim-service}} {{go-has-python-catalog-services}} {{go-casb-and-custom-file-type-packages}} {{go-dlp-resource-packages}}

**Dedicated IP gateways.** {{go-dedicated-ip-lite-only}}

**Only in Python.** {{python-config-audit-no-go-counterpart}}

**In both.** {{email-profiles-both}} {{atp-naming}} {{ips-categories-in-code}} The Go event-log report calls are in [[zia.audit-logs.event-log-report]] and the ATP surface in [[zia.atp.api-surface]].

**Device groups.** {{go-devicegroups-read-only}} {{python-devicegroups-read-only}} Whether either SDK is missing a device-group write at the API level is open {{gap:device-groups-write}}.

**Which Python client.** {{july-services-unified-only}} Whether a tenant is entitled to those services is a separate question, open in [[zia.dlp.endpoint-dlp]].

**Python list calls.** {{july-lists-single-page}} The generic paging behavior is in [[zia.sdk-python.request-conventions]]. {{url-rule-header-profile-ids}}

**Where Python calls live.** {{vip-calls-on-gre-api}} {{idm-profile-path}} The misspelled names are in [[zia.sdk-python.client-errors-and-accessors]].

**Shadow IT export.** {{shadow-it-entity-literal}}

**Government clouds.** {{go-gov-cloud-routing}} The Python routing and the other client settings are in [[zia.sdk-python.authentication]].

**Release notes are not an inventory.** {{go-changelog-lists-only-actions}} {{python-changelog-lists-only-actions}}

**Drift.** What each SDK covers today is open and must be re-diffed on each vendor refresh {{gap:parity-drift}}.
