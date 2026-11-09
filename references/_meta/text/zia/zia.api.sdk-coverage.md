# Which ZIA services the Go and Python SDKs cover, and where (zia.api.sdk-coverage)
Also called: go sdk only zia; python sdk missing zia; scim_api go; device groups write python; email_profiles; advancedthreatsettings vs atp_policy; cross sdk parity; go sdk parity; python only service; go sdk missing zia service; sdk changelog incomplete; does go sdk support risk profiles; go sdk sandbox rules; go sdk casb dlp rules; go sdk dns gateways; go sdk custom file types; go sdk dedicated ip gateways; go sdk gov cloud; zscaler-sdk-go zidentitygov; legacy client missing accessor; ZIAService vs legacy client; attribute error client.zia endpoint_dlp_rules; outbound email dlp python list; http header profile ids url rule; python unified ziaservice; legacy client accessor; web_dlp_global_options; shadow it exportCsv entity; legacy endpoints notes; list_vips where; idmprofile path; list_vips_by_datacenter; where are the VIP calls; list_dlp_idm_profiles

SDK presence is a statement about code, not about whether a tenant can use the endpoint. The Go and Python SDKs do not wrap the same ZIA endpoints, and the difference moves with each release.

**Only in Go.** The Go SDK's ZIA SCIM calls take a distinct ScimZIAService client rather than the generic service. [zia.api.sdk-coverage:go-scim-service] The Go SDK has packages for these ZIA services: risk profiles, sandbox rules, sub-clouds, extranet, ZPA gateways, proxies and dedicated IP gateways, proxy gateways, IPv6 configuration and NSS servers. [zia.api.sdk-coverage:go-has-python-catalog-services] The Go SDK has packages for the SaaS Security CASB DLP rules (`/casbDlpRules`), CASB malware rules (`/casbMalwareRules`), custom file types (`/customFileTypes`) and DNS gateways (`/dnsGateways`). [zia.api.sdk-coverage:go-casb-and-custom-file-type-packages] The Go DLP services include separate packages for ICAP servers (`/icapServers`), Incident Receiver servers (`/incidentReceiverServers`) and IDM profiles (`/idmprofile`, plus a `/lite` variant). [zia.api.sdk-coverage:go-dlp-resource-packages]

**Dedicated IP gateways.** Go reads dedicated IP gateways through `GetDedicatedIPGWLite` in the forwarding-control `proxies` package, at `/dedicatedIPGateways/lite`. [zia.api.sdk-coverage:go-dedicated-ip-lite-only] No other Go ZIA package reads dedicated IP gateways; there is no standalone Go package for them. [zia.api.sdk-coverage:go-dedicated-ip-no-other-package]

**Only in Python.** The Python SDK reads the System Audit Report at `/configAudit`. [zia.api.sdk-coverage:python-config-audit-no-go-counterpart] The Go SDK has no service for `configAudit` or the System Audit Report. [zia.api.sdk-coverage:go-no-config-audit]

**In both.** Email profiles are covered by both SDKs: Python has an EmailProfilesAPI client with list_email_profiles, and Go has an email_profiles package. [zia.api.sdk-coverage:email-profiles-both] Advanced threat protection is the Go package advancedthreatsettings, with GetAdvancedThreatSettings, GetMaliciousURLs and GetSecurityExceptions, and the Python module atp_policy with ATPPolicyAPI. [zia.api.sdk-coverage:atp-naming] Both SDKs implement a read of `/ipsCategories`. [zia.api.sdk-coverage:ips-categories-in-code] The Go event-log report calls are in [The ZIA event log report and how it differs from the admin audit report](kb:zia.audit-logs.event-log-report) and the ATP surface in [ATP API: one settings object, two URL lists, and the field-name traps](kb:zia.atp.api-surface).

**Device groups.** Every function in the Go devicegroups package is a read: lookups of device groups and devices by name, model, owner, OS type or version, and list-all calls; the package defines no create, update or delete. [zia.api.sdk-coverage:go-devicegroups-read-only] The Python SDK reads device groups through list_device_groups on device_management and on a separate device_groups client, plus device listings, and has no group create, update or delete. [zia.api.sdk-coverage:python-devicegroups-read-only] Whether either SDK is missing a device-group write at the API level is open [gap:zia.api.sdk-coverage:device-groups-write].

**Which Python client.** The unified `ZIAService` registers DNS application groups, endpoint applications, Endpoint DLP rules, Outbound Email DLP rules, IPS categories and NSS collectors. The legacy ZIA client registers `web_dlp_global_options`. [zia.api.sdk-coverage:july-services-unified-only] The legacy ZIA client has no accessor for DNS application groups, endpoint applications, Endpoint DLP rules, Outbound Email DLP rules, IPS categories or NSS collectors. [zia.api.sdk-coverage:july-services-not-in-legacy] Whether a tenant is entitled to those services is a separate question, open in [Endpoint DLP API families in the SDKs and Terraform provider](kb:zia.dlp.endpoint-dlp).

**Python list calls.** The DNS application group, endpoint application and Outbound Email DLP rule list methods each send one request and build their results from `get_results()`, without a loop over further pages. [zia.api.sdk-coverage:july-lists-single-page] The generic paging behavior is in [How the Python SDK builds, pages and retries ZIA requests](kb:zia.sdk-python.request-conventions). The Python URL filtering rule create and update calls document `http_header_action_profile_ids` and `http_header_profile_ids` as the HTTP header action profiles and header profiles a rule applies to. [zia.api.sdk-coverage:url-rule-header-profile-ids]

**Where Python calls live.** The VIP listing calls `list_vips`, `list_vip_group_by_dc` and `list_vips_recommended` are on `TrafficForwardingGRETunnelAPI`; `TrafficDatacentersAPI` has `list_datacenters`, which reads `/datacenters`. [zia.api.sdk-coverage:vip-calls-on-gre-api] The IDM profile calls use the `/idmprofile` path: Python `list_dlp_idm_profiles` and `get_dlp_idm_profiles`, the Go DLP IDM profile package, and the Automate capture all agree. [zia.api.sdk-coverage:idm-profile-path] The misspelled names are in [Python SDK errors, accessors and misspelled names on the ZIA client](kb:zia.sdk-python.client-errors-and-accessors).

**Shadow IT export.** The Go Shadow IT CSV export by entity accepts only the literal USER or LOCATION as the entity path segment and rejects any other value before sending. [zia.api.sdk-coverage:shadow-it-entity-literal]

**Government clouds.** With cloud set to `gov` or `govus` (case-insensitive) the Go OneAPI client sends OAuth to the `zidentitygov.net` or `zidentitygov.us` domain under the vanity domain, and API calls to `https://api.zscalergov.net` or `https://api.zscalergov.us`. [zia.api.sdk-coverage:go-gov-cloud-routing] The Python routing and the other client settings are in [How the Python SDK authenticates to ZIA: OneAPI, government clouds and legacy](kb:zia.sdk-python.authentication).

**Release notes are not an inventory.** The Go v3.8.41 release notes list only `GET /emailDlpRules/actions` for Outbound Email DLP, while the Go package also implements get, lite, create, update, delete and list for `/emailDlpRules`. [zia.api.sdk-coverage:go-changelog-lists-only-actions] The Python v1.9.39 release notes add one Outbound Email DLP endpoint, `GET /emailDlpRules/actions`, while the module implements `/emailDlpRules` and its lite and per-rule paths. [zia.api.sdk-coverage:python-changelog-lists-only-actions]

**Drift.** What each SDK covers today is open and must be re-diffed on each vendor refresh [gap:zia.api.sdk-coverage:parity-drift].

What to check:
1. Which SDK carries the surface before choosing a client, by listing the module trees at the pinned versions rather than trusting an old list.
2. Whether a device-group write is needed; neither SDK wraps one, so it would be a direct API call.
3. Whether the Go SDK has a package for a service before concluding it is Python-only, because several services once listed as Python-only exist in Go.
4. That a coverage claim rests on the SDK code and not on a release note, since both changelogs omit endpoints the code implements.
5. Which client class the script built before expecting a July 2026 accessor to exist on it.
6. Whether a list result from one of the newer services could be a partial page.
7. Whether a Shadow IT export by entity passes the literal USER or LOCATION.
8. That VIP lookups go through the GRE tunnel accessor and datacenter lookups through the datacenters accessor.

Inferred, not quoted (say so when an answer rests on one):
- [zia.api.sdk-coverage:go-dedicated-ip-no-other-package] Tier B: A search of zscaler/zia in the Go SDK at the pin for `dedicatedIPGateways` finds only the proxies package; a search result, not a statement any source makes.
- [zia.api.sdk-coverage:july-services-not-in-legacy] Tier B: A search of zscaler/zia/legacy.py at the pin for these accessor names finds none; a search result, not a statement any source makes. Release 1.9.39 (July 2026) added several of these services; IPS categories and NSS collectors are not in its notes.
- [zia.api.sdk-coverage:go-no-config-audit] Tier B: A search of zscaler/zia in the Go SDK at the pin for `configAudit` and `SystemAudit` finds nothing; a search result, not a statement any source makes.

Not known (open gaps):
- Which ZIA modules exist in one SDK and not the other today [gap:zia.api.sdk-coverage:parity-drift]: settled by code-read. Blocks: Choosing between the Go and Python SDKs for a ZIA surface.
- Whether the ZIA device-groups API accepts group-level writes [gap:zia.api.sdk-coverage:device-groups-write]: settled by lab-test or code-read. Blocks: Whether a device group can be created or changed through the API at all.

Area: zia.api, its subjects in references/_meta/spine/zia/zia.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zia.api: OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- links-to references/_meta/text/zia/zia.atp.api-surface.md (ATP API: one settings object, two URL lists, and the field-name traps)
- links-to references/_meta/text/zia/zia.audit-logs.event-log-report.md (The ZIA event log report and how it differs from the admin audit report)
- links-to references/_meta/text/zia/zia.dlp.endpoint-dlp.md (Endpoint DLP API families in the SDKs and Terraform provider)
- links-to references/_meta/text/zia/zia.sdk-python.authentication.md (How the Python SDK authenticates to ZIA: OneAPI, government clouds and legacy)
- links-to references/_meta/text/zia/zia.sdk-python.client-errors-and-accessors.md (Python SDK errors, accessors and misspelled names on the ZIA client)
- links-to references/_meta/text/zia/zia.sdk-python.request-conventions.md (How the Python SDK builds, pages and retries ZIA requests)
