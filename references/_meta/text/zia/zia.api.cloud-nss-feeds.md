# Cloud NSS feed settings: HTTPS-only URLs and OAuth fields (zia.api.cloud-nss-feeds)
Also called: cloud nss feed oauth2; nss feed http rejected; connection_url https; authentication_url azure sentinel; oauth_authentication nss

Cloud NSS feeds carry their own endpoint and OAuth settings, validated by the provider. The Go SDK's request handling is in [How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes](kb:shared.sdk-go.request-handling).

**Endpoint.** In the console, a Cloud NSS feed's API URL is the HTTP/S URL of the SIEM log collection API endpoint. The HTTPS URL must be configured with a publicly trusted SSL certificate, since self-signed or internally issued certificates do not pass the SIEM connectivity test, and OAuth 2.0 Authentication is enabled by default if applicable to the SIEM type. [zia.api.cloud-nss-feeds:cloud-url-cert] The Terraform provider's Cloud NSS feed resource validates connection_url and authentication_url with validation.IsURLWithHTTPS. [zia.api.cloud-nss-feeds:https-only-urls] So a Cloud NSS feed whose connection_url or authentication_url is an http URL is rejected by the provider before the API is called. [zia.api.cloud-nss-feeds:http-url-rejected-before-api]

**Authentication.** A Cloud NSS feed has an oauth_authentication switch, and its authentication URL is described as applying when the SIEM type is Azure Sentinel. [zia.api.cloud-nss-feeds:oauth-fields]

What to check:
1. Whether a feed's destination and authentication URLs use HTTPS, which the provider validates before calling the API.
2. Whether OAuth is on and which SIEM types the authentication URL applies to.

Inferred, not quoted (say so when an answer rests on one):
- [zia.api.cloud-nss-feeds:http-url-rejected-before-api] Tier B: Follows from https-only-urls: both attributes take validation.IsURLWithHTTPS as their validator. That Terraform runs a schema attribute's validator while validating the configuration, before a create or update reaches the API, and that IsURLWithHTTPS rejects an http scheme, rest on terraform-plugin-sdk behavior, which no registered source states.

Area: zia.api, its subjects in references/_meta/spine/zia/zia.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs): Cloud NSS requires a separate concurrent subscription, and its geo-availability and qualifications are obtained from Zscaler Support. [shared.nss.delivery-modes:cloud-subscription]
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zia.api: OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- links-to references/_meta/text/shared/shared.sdk-go.request-handling.md (How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes)
