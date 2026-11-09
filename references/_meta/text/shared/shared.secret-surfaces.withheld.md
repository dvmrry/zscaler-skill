# Zscaler API reads that withhold or mask a secret (shared.secret-surfaces.withheld)
Also called: zia admin password get; sandbox token read; obfuscateApiKey; zidentity api client secret masked; api-clients secrets; browser access certificate private key; ZSCALER_SANDBOX_TOKEN api_token

Withholding takes three forms here: the field is absent from the read, the value is masked, or there is no read operation at all.

## ZIA admin password

The Go SDK's ZIA admin user model says the password is mandatory for POST requests when admin single sign-on is disabled and is not provided in a GET response. [shared.secret-surfaces.withheld:zia-admin-password] The Terraform resource follows the same contract: [The `zia_admin_users` password is sensitive, is mandatory for creation when admin single sign-on is disabled, and the schema says the API does not provide it in a GET response.](kb:zia.terraform.admin-identity:admin-password-not-returned).

## ZIA Sandbox submission token

The Go SDK takes the Sandbox submission token from the client configuration, falling back to `ZSCALER_SANDBOX_TOKEN`, and sends it as the `api_token` query parameter on the `/zscsb/submit` and `/zscsb/discan` requests. [shared.secret-surfaces.withheld:sandbox-token-send-only] No API operation returns the Sandbox submission token; it flows only from the client to the request. [shared.secret-surfaces.withheld:sandbox-token-no-read] The Python SDK does the same: [For any endpoint containing `/zscsb` the Python executor requires `sandboxToken` in the client config, raising ValueError if it is missing, and adds it as the `api_token` query parameter.](kb:zia.sdk-python.sandbox-client:zscsb-token-query-param); the token model is in [The Sandbox Submission API uses API tokens rather than the API key, at the host and base path `csbapi.<Zscaler Cloud Name>/zscsb`; an organization can have up to 5 Sandbox API tokens.](kb:shared.legacy-api.zia-session:sandbox-token).

## ZIA cloud service API key

The ZIA contract's session read response carries `obfuscateApiKey`, a read-only boolean (default false) described as whether the API key was obfuscated, and no `apiKey` member. [shared.secret-surfaces.withheld:obfuscate-flag] No ZIA API operation returns the cloud service API key value; the key is a client-supplied credential. [shared.secret-surfaces.withheld:cloud-api-key-no-read] The key is managed in the console: [After the API subscription is enabled, Zscaler provisions the organization's cloud service API key; an organization can have only one, and the existing key must be deleted before a new one is added. Accessing and managing the key needs a valid API subscription, and the base URL and key are required to authenticate via the API and create a session.](kb:shared.legacy-api.zia-session:one-key).

## ZIdentity API client secrets

The Python SDK's ZIdentity API client record reads name, description, status, accessTokenLifeTime, clientAuthentication, clientResources and id from the response. [shared.secret-surfaces.withheld:zid-client-record] GET /api-clients/{id}/secrets lists an API client's secrets with the secret values masked, and applies only when the client's authentication type is SECRET. [shared.secret-surfaces.withheld:zid-secrets-masked] POST /api-clients/{id}/secrets creates a new secret for the client, with no masking note in its description, and its 201 response requires `id`, `createdAt` and `value`, described as the secret value. [shared.secret-surfaces.withheld:zid-secret-create] So the full secret value is available only in the response to creating it; a read of the client or its secrets does not return it. [shared.secret-surfaces.withheld:zid-full-only-on-create]

## ZPA Browser Access certificates

The ZPA contract's GET certificate/{certificateId} response for Browser Access certificates has `certificate`, `certChain` and `publicKey` but neither `privateKey` nor the `certBlob` used to upload one. [shared.secret-surfaces.withheld:ba-cert-no-private-key] The upload blob that carries the key is held by Terraform instead: [zpa_ba_certificate's cert_blob carries the certificate's private key, but the schema does not mark it Sensitive, so Terraform shows it in plan output and stores it in state as plain text.](kb:zpa.terraform.resource-constraints:ba-certificate-blob-not-sensitive).

What to check:
1. Whether a masked read (ZIdentity secrets) is being treated as a source of the secret; only the create response can carry it.

Inferred, not quoted (say so when an answer rests on one):
- [shared.secret-surfaces.withheld:sandbox-token-no-read] Tier B: Absence from a search: the ZIA OpenAPI paths and the Go and Python SDK sandbox services were searched at their pins for an operation returning a sandbox token; none was found.
- [shared.secret-surfaces.withheld:cloud-api-key-no-read] Tier B: Absence from a search: automate-zscaler/openapi/zia.openapi.json was searched at the pin for a path or response property carrying an API key value; only the obfuscateApiKey flag matched.
- [shared.secret-surfaces.withheld:zid-full-only-on-create] Tier B: Rests on the GET secrets description saying values are masked and on the client record carrying no secret field among those the Python model reads; that the create response value is unmasked is inferred from its description lacking the masking note, not shown by a captured response.

Area: shared.secret-surfaces, its subjects in references/_meta/spine/shared/shared.secret-surfaces.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.legacy-api.zia-session.md (ZIA legacy API sessions: API key obfuscation, JSESSIONID and the cloud service API key)
- links-to references/_meta/text/zia/zia.sdk-python.sandbox-client.md (How the Python SDK reaches the sandbox submission host)
- links-to references/_meta/text/zia/zia.terraform.admin-identity.md (Terraform admin roles, admin users and local users in ZIA)
- links-to references/_meta/text/zpa/zpa.terraform.resource-constraints.md (Constraints the ZPA Terraform docs and provider code place on individual resources)
