# Running the Zscaler MCP server over HTTP: TLS, Host validation, client authentication, logging and cloud secrets (shared.mcp-server.http-deployment)
Also called: ZSCALER_MCP_TLS_CERTFILE; ZSCALER_MCP_TLS_CA_CERTS; ZSCALER_MCP_ALLOW_HTTP; ZSCALER_MCP_ALLOWED_HOSTS; ZSCALER_MCP_DISABLE_HOST_VALIDATION; ZSCALER_MCP_TRUST_PLATFORM_AUTH; ZSCALER_MCP_LOG_TOOL_CALLS; ZSCALER_SECRET_NAME; X-Api-Key; mcp oidc; oidcproxy; mcp api key auth; mcp health check; ZSCALER_CUSTOMER_ID missing; mcp aws secrets manager; logging/setLevel

## TLS and plaintext

The streamable-http and SSE transports terminate TLS in process when both `ZSCALER_MCP_TLS_CERTFILE` and `ZSCALER_MCP_TLS_KEYFILE` are set; `ZSCALER_MCP_TLS_KEYFILE_PASSWORD` unlocks an encrypted key and `ZSCALER_MCP_TLS_CA_CERTS` supplies a CA bundle passed to Uvicorn as `ssl_ca_certs`. With TLS configured the server uses the https scheme. [shared.mcp-server.http-deployment:tls-env] Setting only one of the certificate and key, a missing certificate or key file, or a missing configured CA file raises `SystemExit` when the HTTP runner builds its TLS settings, before Uvicorn is started. [shared.mcp-server.http-deployment:tls-validation] Without TLS the server refuses to bind a non-localhost address unless `ZSCALER_MCP_ALLOW_HTTP` is true (meant for TLS terminated by a proxy in front); with TLS configured the guard is satisfied. [shared.mcp-server.http-deployment:plaintext-guard] The README describes `ZSCALER_MCP_TLS_CA_CERTS` as the path to a CA certificate bundle for mutual TLS or custom CA chains, and the 0.13.2 release notes as mutual-TLS client validation. [shared.mcp-server.http-deployment:ca-bundle-documented-mtls] The server sets no client-certificate requirement of its own: with a CA bundle it only passes `ssl_ca_certs` to Uvicorn. [shared.mcp-server.http-deployment:no-client-cert-requirement] Whether Uvicorn then requires client certificates with only a CA bundle set is open [gap:shared.mcp-server.http-deployment:client-cert-enforcement].

## Host validation and health checks

`ZSCALER_MCP_ALLOWED_HOSTS` is a comma-separated Host allowlist (exact host:port, host:*, bare host or *); when it is set and `ZSCALER_MCP_DISABLE_HOST_VALIDATION` is not true, requests whose Host header does not match are rejected with HTTP 421. [shared.mcp-server.http-deployment:host-allowlist] Binding to 0.0.0.0 exits at startup unless `ZSCALER_MCP_ALLOWED_HOSTS` is set or `ZSCALER_MCP_DISABLE_HOST_VALIDATION=true` opts out. [shared.mcp-server.http-deployment:wildcard-bind] Host validation skips `/health`, `/healthz` and `/ready`, and the health-check middleware is the outermost layer, answering GET or HEAD on the health path with 200 before authentication, source-IP checks or MCP handling. [shared.mcp-server.http-deployment:health-bypass]

## Who may connect

In OIDC mode the server is an OAuth 2.0 protected resource: it publishes RFC 9728 metadata naming the external IdP and verifies the IdP's bearer tokens, hosts no authorization server and needs no client secret. The mode is `oidc`, with `oidcproxy` and `oauth-proxy` still accepted; clients can no longer self-register and need a client ID issued by the IdP. [shared.mcp-server.http-deployment:oidc-resource-server] API-key mode accepts the key as `Authorization: Bearer <key>` or as `X-Api-Key`, compares it in constant time, and identifies the caller by a fingerprint of the key rather than the key itself. [shared.mcp-server.http-deployment:api-key-headers] `ZSCALER_MCP_TRUST_PLATFORM_AUTH=true` lets the `api-key` and `zscaler` modes accept a request carrying no credential on the strength of a platform that already authenticated the caller, using the container's own credentials; the code says never to set it on an internet-reachable deployment. [shared.mcp-server.http-deployment:trust-platform-auth]

## Credentials and tenant IDs

The client checks the client ID and vanity domain first, then the tenant-scope ID, which it requires only for `zpa` (`ZSCALER_CUSTOMER_ID`) and `zcell` (`ZCELL_CUSTOMER_ID`); a missing scope ID gets its own error saying it is a tenant/customer ID, that authentication is unaffected, and that it may not exist on a tenant not entitled to the product. [shared.mcp-server.http-deployment:scope-id-errors] Setting `ZSCALER_SECRET_NAME` makes the server load credentials from AWS Secrets Manager at startup, using the optional `aws` extra (`boto3`); the region comes from `AWS_REGION`, then `AWS_DEFAULT_REGION`, then boto3's own chain, and a secret that cannot be fetched or decoded stops startup. [shared.mcp-server.http-deployment:aws-secrets-optin] Only keys on the loader's list (OneAPI credentials, MCP client-auth settings, the request-state key ring and the write settings) are published to the environment, overriding existing values; unrecognized keys are named in a warning and ignored, and startup stops unless a client ID and a client secret or private key are present. [shared.mcp-server.http-deployment:aws-secrets-allowlist] The cloud loaders (AWS and GCP) run before the command line is parsed, so a secret can supply variables the CLI reads for its defaults, such as `ZSCALER_MCP_WRITE_ENABLED`. [shared.mcp-server.http-deployment:secrets-before-cli]

## Logging and server identity

Tool-call audit logging is opt-in with `ZSCALER_MCP_LOG_TOOL_CALLS=true`; the `[TOOL CALL]` line lists the fields the caller set (unpacked from the input model), with names containing secret, password, token or key redacted, and a non-empty JMESPath query is logged on its own `[QUERY]` line with row counts before and after filtering. [shared.mcp-server.http-deployment:tool-call-audit] MCP `logging/setLevel` is served to `2025-06-18` and `2025-11-25` clients but is absent on `2026-07-28`, whose clients are expected to use OpenTelemetry; it changes only the `zscaler_mcp` logger tree, because dependency logging at debug prints credential-bearing headers. [shared.mcp-server.http-deployment:set-level-scope] The server passes its package version to MCP initialization, so clients see the release number in `serverInfo`; 0.15.0 fixed an empty value there. [shared.mcp-server.http-deployment:server-version]

What to check:
1. For a non-localhost bind, whether TLS certificate and key files are configured or TLS is terminated in front of the server with ZSCALER_MCP_ALLOW_HTTP set.
2. For a 0.0.0.0 bind, whether ZSCALER_MCP_ALLOWED_HOSTS lists the hostnames clients use.
3. Whether ZSCALER_MCP_TRUST_PLATFORM_AUTH is set on a deployment that is reachable without going through a platform that authenticates every caller.
4. When a ZPA tool fails for a missing ZSCALER_CUSTOMER_ID, that it is a tenant ID and not a credential problem.

Inferred, not quoted (say so when an answer rests on one):
- [shared.mcp-server.http-deployment:no-client-cert-requirement] Tier B: Absence from a search: the MCP server tree was searched at the pin for ssl_cert_reqs and CERT_REQUIRED and neither occurs; the only client-certificate setting passed is ssl_ca_certs.

Not known (open gaps):
- Whether ZSCALER_MCP_TLS_CA_CERTS makes the server require client certificates [gap:shared.mcp-server.http-deployment:client-cert-enforcement]: settled by lab-test or code-read. Blocks: relying on the CA bundle as client authentication

Area: shared.mcp-server, its subjects in references/_meta/spine/shared/shared.mcp-server.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.mcp-server.md (The Zscaler MCP server: release, protocol and where its behavior is described)
- see-also references/_meta/text/shared/shared.mcp-server.delete-confirmation.md (How the Zscaler MCP server confirms deletes: elicitation, HMAC tokens and request state)
