# The ZIA API from a client's side: activation, limits, SDK coverage and wire notes (zia.api)
Also called: zia api; zia api overview; zia api surface; how to call the zia api

Endpoint lists, field tables and Terraform resource maps are generated from the OpenAPI specification, the provider schemas and the SDKs; this subject family holds only the behavior around them.

Making a change live is in [How ZIA API changes become live: saving versus activating](kb:zia.api.activation), and limits and retries are in [ZIA API rate limits and how the Python SDK retries](kb:zia.api.rate-limits). Where reads and writes disagree is in [Where ZIA reads and writes disagree: an index of round-trip hazards](kb:zia.api.read-write-asymmetries), and which services each SDK covers is in [Which ZIA services the Go and Python SDKs cover, and where](kb:zia.api.sdk-coverage).

How the Python SDK signs in is in [How the Python SDK authenticates to ZIA: OneAPI, government clouds and legacy](kb:zia.sdk-python.authentication), what it returns in [What the Python SDK returns: result, response and error, and why try/except misses API errors](kb:zia.sdk-python.response-shape), how it pages in [Paging through ZIA lists with the Python SDK](kb:zia.sdk-python.pagination), and how it reports errors and names its accessors in [Python SDK errors, accessors and misspelled names on the ZIA client](kb:zia.sdk-python.client-errors-and-accessors).

Field-level notes are in [URL category API behavior beyond the field list: delete, lookup and the keyword quota figure](kb:zia.api.url-categories-wire), [URL Filtering rule fields where the Python SDK, Terraform provider and help disagree](kb:zia.api.url-filtering-wire), [SSL Inspection rule wire notes: Kerberos road warriors, ZPA segments and predefined rules](kb:zia.api.ssl-inspection-wire), [Advanced settings: SNI handling lists and a misdocumented global SSL bypass setting](kb:zia.api.advanced-settings-wire), [Custom IPS signature rules: export, validate and import wire behavior in the legacy API](kb:zia.api.legacy-ips-signature-wire) and [Cloud NSS feed settings: HTTPS-only URLs and OAuth fields](kb:zia.api.cloud-nss-feeds). The Cloud App Control rule type and identity in the provider are in [The Cloud App Control rule resource: prompt capture, isolation, import and delete](kb:zia.terraform.cloud-app-control-rule).

Area: zia.api, its subjects in references/_meta/spine/zia/zia.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token): OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- links-to references/_meta/text/zia/zia.api.activation.md (How ZIA API changes become live: saving versus activating)
- links-to references/_meta/text/zia/zia.api.advanced-settings-wire.md (Advanced settings: SNI handling lists and a misdocumented global SSL bypass setting)
- links-to references/_meta/text/zia/zia.api.cloud-nss-feeds.md (Cloud NSS feed settings: HTTPS-only URLs and OAuth fields)
- links-to references/_meta/text/zia/zia.api.legacy-ips-signature-wire.md (Custom IPS signature rules: export, validate and import wire behavior in the legacy API)
- links-to references/_meta/text/zia/zia.api.rate-limits.md (ZIA API rate limits and how the Python SDK retries)
- links-to references/_meta/text/zia/zia.api.read-write-asymmetries.md (Where ZIA reads and writes disagree: an index of round-trip hazards)
- links-to references/_meta/text/zia/zia.api.sdk-coverage.md (Which ZIA services the Go and Python SDKs cover, and where)
- links-to references/_meta/text/zia/zia.api.ssl-inspection-wire.md (SSL Inspection rule wire notes: Kerberos road warriors, ZPA segments and predefined rules)
- links-to references/_meta/text/zia/zia.api.url-categories-wire.md (URL category API behavior beyond the field list: delete, lookup and the keyword quota figure)
- links-to references/_meta/text/zia/zia.api.url-filtering-wire.md (URL Filtering rule fields where the Python SDK, Terraform provider and help disagree)
- links-to references/_meta/text/zia/zia.sdk-python.authentication.md (How the Python SDK authenticates to ZIA: OneAPI, government clouds and legacy)
- links-to references/_meta/text/zia/zia.sdk-python.client-errors-and-accessors.md (Python SDK errors, accessors and misspelled names on the ZIA client)
- links-to references/_meta/text/zia/zia.sdk-python.pagination.md (Paging through ZIA lists with the Python SDK)
- links-to references/_meta/text/zia/zia.sdk-python.response-shape.md (What the Python SDK returns: result, response and error, and why try/except misses API errors)
- links-to references/_meta/text/zia/zia.terraform.cloud-app-control-rule.md (The Cloud App Control rule resource: prompt capture, isolation, import and delete)
