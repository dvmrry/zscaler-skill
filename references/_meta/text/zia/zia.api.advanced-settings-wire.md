# Advanced settings: SNI handling lists and a misdocumented global SSL bypass setting (zia.api.advanced-settings-wire)
Also called: prefer_sni_over_conn_host_apps; block_domain_fronting_apps; enable_evaluate_policy_on_global_ssl_bypass description wrong; terraform doc dns optimization ipv6

The advanced settings have per-application lists and one setting whose provider documentation is wrong. The tenant-wide behavior is in [Advanced URL Filtering settings that change outcomes](kb:zia.url-filtering.advanced-settings).

**SNI and domain fronting.** prefer_sni_over_conn_host_apps lists applications exempted from the preferSniOverConnHost setting, which otherwise uses the TLS client-hello SNI for DNS resolution instead of the CONNECT host for forward proxy connections. [zia.api.advanced-settings-wire:sni-apps-exempted] block_domain_fronting_apps lists applications subjected to domain fronting handling, alongside the block_domain_fronting_on_host_header advanced setting, which blocks or allows HTTP/S transactions whose request URL FQDN differs from the FQDN of the host header. [zia.api.advanced-settings-wire:domain-fronting-apps]

**Global SSL bypass.** The Go SDK describes enableEvaluatePolicyOnGlobalSSLBypass as whether policy evaluation for global SSL bypass traffic is enabled. [zia.api.advanced-settings-wire:go-global-ssl-bypass-description] The Terraform documentation describes enable_evaluate_policy_on_global_ssl_bypass as enabling or disabling DNS optimization for all IPv6 transparent proxy traffic. [zia.api.advanced-settings-wire:tf-global-ssl-bypass-description] The two descriptions conflict [divergence:zia.api.advanced-settings-wire:global-ssl-bypass-description].

What to check:
1. What an SNI override list means before editing it: prefer_sni_over_conn_host_apps lists applications exempted from the setting, not applications it is applied to.
2. Which description of enable_evaluate_policy_on_global_ssl_bypass to trust.

Sources disagree (name both sides):
- The Terraform documentation and the Go SDK describe enableEvaluatePolicyOnGlobalSSLBypass as two different settings. [divergence:zia.api.advanced-settings-wire:global-ssl-bypass-description]
  - tf-zia: It enables or disables DNS optimization for all IPv6 transparent proxy traffic.
  - sdk-go: It says whether policy evaluation for global SSL bypass traffic is enabled.
  Impact: An operator reading only the provider documentation would not learn that this switch decides whether URL policy is evaluated on globally SSL-bypassed traffic; see the URL filtering advanced-settings subject for the effect.

Area: zia.api, its subjects in references/_meta/spine/zia/zia.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zia.api: OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- links-to references/_meta/text/zia/zia.url-filtering.advanced-settings.md (Advanced URL Filtering settings that change outcomes)
