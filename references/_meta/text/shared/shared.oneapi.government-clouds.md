# Reaching OneAPI on government (FedRAMP) and non-production clouds (shared.oneapi.government-clouds)
Also called: oneapi fedramp; cloud=gov; cloud=govus; zidentitygov.net; api.zscalergov.net; gov cloud legacy only; zsloginbeta; api.beta.zsapi.net cloud value

Government tenants reach OneAPI through separate identity and gateway hosts, and whether a given client can do so depends on its version. The OneAPI guide gives api.zsapi.net as the host for commercial customers and, for federal agencies, api.zscaler.us at FedRAMP Moderate and api.zscaler.net at FedRAMP High. [shared.oneapi.government-clouds:help-fedramp-hosts]

**Which host.** The Go SDK maps the cloud values `gov` and `govus` (case-insensitive) to the token hosts zidentitygov.net and zidentitygov.us and to the API gateways `https://api.zscalergov.net` and `https://api.zscalergov.us`, instead of the commercial zslogin and zsapi hosts. [shared.oneapi.government-clouds:go-gov-routing] The Python SDK routes the same values the same way: [With cloud set to `gov` or `govus` the Python SDK sends OAuth to a zidentitygov.net or zidentitygov.us identity provider and API calls to api.zscalergov.net or api.zscalergov.us, instead of the commercial gateway.](kb:zia.sdk-python.authentication:gov-cloud-routing). The help page and the SDKs name different gateway hosts [divergence:shared.oneapi.government-clouds:fedramp-gateway-host].

**Other cloud values.** For an empty or PRODUCTION cloud the Go SDK uses `https://<vanity>.zslogin.net/oauth2/v1/token` and `https://api.zsapi.net`; for any other non-government cloud value it builds the token host as zslogin followed by the lowercased cloud name (`https://%s.zslogin%s.net/oauth2/v1/token`) and the gateway as `https://api.%s.zsapi.net`. [shared.oneapi.government-clouds:go-other-cloud-hosts] So with the cloud set to beta the Go SDK calls api.beta.zsapi.net, the beta gateway the OneAPI guide documents, and requests tokens from the zsloginbeta.net domain that the Analytics guide's example token URL uses. [shared.oneapi.government-clouds:go-beta-host-b]

**Which clients support it.** The ZIA Terraform provider supports gov and govus from v4.7.25: [OneAPI reaches the government (FedRAMP) clouds through the `gov` and `govus` cloud values, and the provider documents this as supported only from v4.7.25; earlier versions are not supported.](kb:zia.terraform.provider-modes:fedramp-gov-values). The ZPA provider supports them from v4.4.6: [OneAPI reaches the government (FedRAMP) clouds through zscaler_cloud (or ZSCALER_CLOUD) set to gov or govus, and the provider documents this as supported only from v4.4.6; earlier versions are not supported.](kb:zpa.terraform.provider-config:fedramp-oneapi-4-4-6). The ZCC provider documents no OneAPI support for the zscalergov and zscalerten clouds: [The documentation says OneAPI and Zidentity are not currently supported for the `zscalergov` and `zscalerten` clouds.](kb:zcc.terraform.provider-config:gov-clouds-unsupported). Early Python SDK releases sent government customers to the legacy framework: [The 1.0.0, 1.0.2 and 1.0.3 release notes of the Python SDK warn that OneAPI and Zidentity are not supported for the zscalergov and zscalerten ZIA clouds or the ZPA GOV and GOVUS clouds, and point government customers to the legacy framework.](kb:zia.sdk-python.authentication:older-sdk-gov-unsupported).

**Legacy cloud values.** The uppercase ZPA legacy clouds GOV and GOVUS select legacy config hosts, not OneAPI: [The Python SDK's legacy host table maps cloud names to config hosts: PRODUCTION to config.private.zscaler.com, ZPATWO to config.zpatwo.net, BETA to config.zpabeta.net, GOV to config.zpagov.net, GOVUS to config.zpagov.us and PREVIEW to config.zpapreview.net.](kb:zpa.api.base-paths:legacy-hosts). Whether a client's routing support means a given government tenant is entitled to OneAPI is open [gap:shared.oneapi.government-clouds:tenant-entitlement].

What to check:
1. For a government tenant, which client and version is in use, and whether it routes cloud=gov or cloud=govus through OneAPI or only offers the legacy path.
2. Which gateway host a hand-built client should call for a FedRAMP tenant, given that the help page and the SDKs disagree.
3. Whether the government tenant has Authentication Service API clients at all before choosing OneAPI over its product's legacy API.

Inferred, not quoted (say so when an answer rests on one):
- [shared.oneapi.government-clouds:go-beta-host-b] Tier B: Follows from the Go host pattern applied to the value beta; the Analytics guide shows https://acme.zsloginbeta.net/oauth2/v1/token as an example access token URL.

Sources disagree (name both sides):
- Which gateway host serves OneAPI for FedRAMP tenants: the help page names api.zscaler.us (Moderate) and api.zscaler.net (High), while the Go and Python SDKs send gov and govus traffic to api.zscalergov.net and api.zscalergov.us. [divergence:shared.oneapi.government-clouds:fedramp-gateway-host]
  - zscaler-help: FedRAMP Moderate uses api.zscaler.us and FedRAMP High uses api.zscaler.net.
  - sdk-go: The gov cloud uses https://api.zscalergov.net and the govus cloud https://api.zscalergov.us.
  - sdk-python: The Python SDK uses the same two zscalergov hosts.
  Impact: A hand-built client that follows the help page and one built on the SDKs call different hosts for the same tenant; which host a FedRAMP tenant's API clients are served on, and how Moderate and High map to gov and govus, needs confirming before relying on either.

Not known (open gaps):
- Whether a government tenant can use OneAPI [gap:shared.oneapi.government-clouds:tenant-entitlement] (data gap): filled by operator; settled by tenant-data or support-ticket. Blocks: choosing OneAPI over the legacy API for a specific government tenant

Area: shared.oneapi, its subjects in references/_meta/spine/shared/shared.oneapi.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.sdk-python.authentication.md (How the Python SDK authenticates to ZIA: OneAPI, government clouds and legacy)
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token): The client sends a POST to Authentication Service's token endpoint `https://<vanity-domain>.zslogin.net/oauth2/v1/token`, where the vanity domain is the one assigned to the organization (for example acme.zslogin.net). [shared.oneapi.authentication:token-endpoint]
- links-to references/_meta/text/zcc/zcc.terraform.provider-config.md (Configuring the ZCC Terraform provider: OneAPI credentials, environment variables and defaults)
- links-to references/_meta/text/zia/zia.terraform.provider-modes.md (ZIA Terraform provider authentication, client modes and rate limiting)
- links-to references/_meta/text/zpa/zpa.api.base-paths.md (ZPA API base paths: hosts, the /zpa prefix, v1 and v2 versions, userconfig and cbiconfig)
- links-to references/_meta/text/zpa/zpa.terraform.provider-config.md (ZPA Terraform provider configuration: no-credential mode, authentication framework, clouds and rate limits)
