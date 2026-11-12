# Signing the Zscaler Terraform providers in: OneAPI, legacy credentials and clouds (shared.terraform.authentication)
Also called: terraform zscaler credentials; terraform oneapi; ZSCALER_CLIENT_ID terraform; ZSCALER_VANITY_DOMAIN; zscaler_cloud; terraform private_key client_secret; terraform hard-coded credentials; terraform fedramp gov govus

The provider arguments themselves (including that `client_secret` conflicts with `private_key`) are generated: `node scripts/kb.mjs surface provider:zia` and the same for zpa, zcc and ztc. The ZIA, ZPA, ZCC and ZTC provider documentation each warn that hard-coding credentials into a Terraform configuration is not recommended and risks secret leakage if the file is committed to public version control. [shared.terraform.authentication:hardcoding-warning]

**ZIA.** From v4.0.0 the ZIA provider supports authentication through OneAPI, which uses the OAuth 2.0 Client Credentials flow: the client exchanges its credentials for an access token, with no user authentication involved. [shared.terraform.authentication:zia-oneapi] The ZIA provider documentation maps `client_id`, `client_secret`, the private key, `vanity_domain` and `zscaler_cloud` to `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET`, `ZSCALER_PRIVATE_KEY`, `ZSCALER_VANITY_DOMAIN` and `ZSCALER_CLOUD`, and says a setting supplied by environment variable need not be set in the provider block. [shared.terraform.authentication:zia-env-vars] For the ZIA provider, `zscaler_cloud` is optional for production commercial clouds and only required for other environments: `beta` for the test commercial cloud, and `gov` or `govus` for FedRAMP. [shared.terraform.authentication:zia-cloud-values] Legacy mode, government clouds and sandbox credentials are in [ZIA Terraform provider authentication, client modes and rate limiting](kb:zia.terraform.provider-modes).

**ZPA, ZCC and Cloud Connector.** ZPA credentials, environment variables and cloud values are in [ZPA Terraform provider configuration: no-credential mode, authentication framework, clouds and rate limits](kb:zpa.terraform.provider-config); ZCC in [Configuring the ZCC Terraform provider: OneAPI credentials, environment variables and defaults](kb:zcc.terraform.provider-config); ZTC in [ZTC Terraform provider: configuration, field handling and read behavior](kb:cloud-connector.terraform.provider-behavior).

**Underneath.** How the SDK obtains and renews the OneAPI token is in [How the Go SDK obtains and renews OneAPI tokens](kb:shared.sdk-go.auth-lifecycle), and what happens to secrets once Terraform holds them in [How the Zscaler Terraform providers store, log, and send secrets](kb:shared.terraform.credential-handling).

What to check:
1. Whether credentials come from environment variables rather than the configuration, since every provider's documentation warns against hard-coding them.
2. Whether zscaler_cloud is set only for a non-production environment (beta, gov, govus).

Area: shared.terraform, its subjects in references/_meta/spine/shared/shared.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.provider-behavior.md (ZTC Terraform provider: configuration, field handling and read behavior)
- links-to references/_meta/text/shared/shared.sdk-go.auth-lifecycle.md (How the Go SDK obtains and renews OneAPI tokens)
- links-to references/_meta/text/shared/shared.terraform.credential-handling.md (How the Zscaler Terraform providers store, log, and send secrets)
- links-to references/_meta/text/zcc/zcc.terraform.provider-config.md (Configuring the ZCC Terraform provider: OneAPI credentials, environment variables and defaults)
- links-to references/_meta/text/zia/zia.terraform.provider-modes.md (ZIA Terraform provider authentication, client modes and rate limiting)
- links-to references/_meta/text/zpa/zpa.terraform.provider-config.md (ZPA Terraform provider configuration: no-credential mode, authentication framework, clouds and rate limits)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.terraform.md (The Zscaler Terraform providers: where their behavior is described)
