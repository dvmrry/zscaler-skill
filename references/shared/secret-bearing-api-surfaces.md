---
product: shared
topic: "secret-bearing-api-surfaces"
title: "Secret-bearing API read surfaces — which GETs reveal secrets vs protect them"
content-type: reasoning
last-verified: "2026-07-17"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
confidence: medium
source-tier: mixed
author-status: draft
sources:
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_provisioning_key.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/api_keys/provisioning.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/provisioning_url/provisioning_url.go"
  - "vendor/zscaler-sdk-python/zscaler/zcc/secrets.py"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getpasswords/getpasswords.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/adminuserrolemgmt/admins/adminusers.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_admin_users.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/sandbox/sandbox_submission/sandbox_submission.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/vpncredentials/vpncredentials.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_traffic_forwarding_vpn_credentials.go"
  - "vendor/zscaler-sdk-python/zscaler/zid/api_client.py"
  - "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/zcc-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/zid.openapi.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/zia.openapi.json"
  - "vendor/zscaler-help/legacy-managing-cloud-service-api-key.md"
---

# Secret-bearing API read surfaces — which GETs reveal secrets vs protect them

## Summary

**Read-only API access is not secret-free access.** Several Zscaler read (GET/list) surfaces return live secret material — provisioning keys, connector API keys, provisioning URLs, device uninstall passwords and OTPs — in cleartext by design. Others deliberately withhold the secret on read: the ZIA admin password, the sandbox submission token, and the ZIdentity OAuth client secret are all write-only or masked on GET. The distinction matters when you scope an API client or hand someone a read-only token: a role that can only *read* a tenant can still exfiltrate the credentials needed to enroll rogue connectors, uninstall the endpoint agent on a user's device, or authenticate as a privileged-remote-access account.

This doc catalogs, per surface, whether the documented read contract exposes the secret, with the citation chain to prove it. It is organized so that when someone asks "can a read-only API client see secrets?" the answer is a specific list of resource families to exclude, not a hand-wave.

The high-value takeaway is the **exclusion list** in [Operational guidance](#operational-guidance-scoping-a-read-only-api-client): the resource families whose GET responses carry secrets, which a least-privilege read scope must leave out.

## How to read the tier labels

Findings here lean on two source classes, per the [verification protocol](../_meta/verification-protocol.md):

- **Contract-documented (Tier A on field metadata).** The Automate contract capture lists the secret field in a GET operation's `response_schema`. This is Tier A for the claim *"the API reference documents this field as part of the 200 response"* — it is **not** proof that a live tenant returns a non-empty value for it. Where a field is contract-documented but live population is unproven, it is labeled as such and, where consequential, tracked as an open clarification.
- **Consumer-confirmed (Tier A/B, stronger).** A downstream consumer (Terraform provider Read, SDK service) actually reads the field back from the GET response and uses it. When the provider stores `resp.ProvisioningKey` into state, the API demonstrably returns a usable value — the chain rules out the field being a documented-but-empty placeholder.

Absence findings ("this GET has no secret field") are Tier A when the SDK model and the contract response schema agree, and are stated as absence, not as a masking guarantee, unless a spec note explicitly documents masking.

## Mechanics — surfaces that REVEAL secrets on read

| Product | Resource family | Secret returned on GET | Strength | Evidence |
|---|---|---|---|---|
| ZPA | Provisioning keys | `provisioningKey` (App Connector / Service Edge enrollment key), cleartext | Consumer-confirmed | SDK GET model + TF Read stores it into state |
| ZTW / Cloud&Branch Connector | Provisioning API keys | `keyValue` (12-char EC admin API key), cleartext | Contract-documented, non-readonly | contract `GET /apiKeys` + SDK GetAll |
| ZTW / Cloud&Branch Connector | Provisioning URLs | `provUrl` + full `provUrlData` (config/registration/API/PAC servers), cleartext | Contract-documented | contract `GET /provUrl/{id}` + SDK GetAll |
| ZCC | Device secrets (`client.zcc.secrets`) | Uninstall/logout/exit/disable **passwords** and **OTPs** per username/device | Contract-documented, by design | contract `GET /getPasswords` + `GET /getOtp`, both SDKs |
| ZPA | Privileged Remote Access credentials | `password`, `passphrase`, `privateKey` on the credential record | Contract-documented; live population unverified | contract `GET /credential/{id}` response schema |
| ZPA | Enrollment certificates | `privateKey` + `zrsaencryptedprivatekey`/`zrsaencryptedsessionkey` | Contract-documented; gated by `privateKeyPresent` — unverified | contract `GET /enrollmentCert/{id}` response schema |
| ZPA | API keys (`/apiKeys`) | `clientSecret` on the shared SDK model | Field present on model only; not in any contract capture — unprovable statically | SDK struct tag |
| ZIA | VPN (IPSec) credentials | `preSharedKey` — **contract lists it on GET; provider declines to read it back** — see [Edge cases](#edge-cases) | Contested across sources — unverified | contract response schema vs TF provider behavior |

## Mechanics — surfaces that PROTECT the secret on read

| Product | Resource family | Read-side behavior | Strength | Evidence |
|---|---|---|---|---|
| ZIA | Admin users | `password` is **"not provided in a GET response"** (SDK comment + TF schema); TF Read never sets it | Consumer-confirmed | SDK model comment + TF Read omission |
| ZIA | Sandbox submission | The submission **API token** has no GET surface at all; it is a client-supplied config/env credential, injected send-only into the request query | Tier A (absence) | no token in any capture; token flows from config → URL param |
| ZIA | Cloud Service API key (legacy) | No value-bearing GET; the only API-surfaced field is a read-only `obfuscateApiKey` boolean status flag. Key managed in the portal | Tier A | contract flag + legacy obfuscated-auth code |
| ZIdentity | OAuth API client secrets | Main api-client GET carries **no** secret; the dedicated `GET /secrets` returns a **masked** value; only `POST /secrets` (create) returns the full value | Tier A (spec-level masking note) | OpenAPI masking note + Python models |
| ZPA | Browser Access certificates | GET model exposes `certificate`/`certChain`/`publicKey` but **no `privateKey`** | Tier A (absence) | SDK model has no private-key field |

## Per-surface detail

### Reveals — ZPA provisioning keys (strongest case: consumer-confirmed)

The App Connector / Service Edge enrollment key is returned in cleartext on GET and single-GET, and the Terraform provider stores it into state. The GET model carries `ProvisioningKey string json:"provisioningKey,omitempty"` (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:36`), retrieved via `Get` at `mgmtconfig/.../associationType/{type}/provisioningKey/{id}` (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:51-61`). The reconstructed Automate contract publishes the same list and by-ID GET paths (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:103046-103058`; `vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:103268-103280`), but labels the corresponding non-readonly string fields `list[].nonceValue` and `nonceValue`, not `provisioningKey` (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:103195-103204`; `vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:103390-103399`). Treat that as a contract-versus-Go/Terraform field-name divergence, not as contract corroboration of the consumer's JSON spelling.

The clinching link is the Terraform provider: its Read fetches the key and writes it into state — `resp, _, err := provisioningkey.Get(...)` (`vendor/terraform-provider-zpa/zpa/resource_zpa_provisioning_key.go:196`) then `_ = d.Set("provisioning_key", resp.ProvisioningKey)` (`vendor/terraform-provider-zpa/zpa/resource_zpa_provisioning_key.go:219`). The schema marks the field `Sensitive: true` but its own description states the value is nonetheless persisted to the state file and retrievable via `terraform output` (`vendor/terraform-provider-zpa/zpa/resource_zpa_provisioning_key.go:119-124`). Because a real consumer reads the value back and relies on it, this is not a documented-but-empty placeholder — the GET returns a usable enrollment key. See also [`../zpa/app-connector.md`](../zpa/app-connector.md).

### Reveals — ZTW / Cloud & Branch Connector provisioning API keys and URLs

Both the EC admin API key and the provisioning URL are returned in cleartext on read.

- **API keys.** Endpoint `/ztw/api/v1/apiKeys` with a companion `/regenerate` (`vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/api_keys/provisioning.go:14-15`); the model field is `KeyValue string json:"keyValue,omitempty"` (`vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/api_keys/provisioning.go:23`). The Automate contract's `GET /apiKeys` documents `[].keyValue` as a non-readonly string described as "API key value (12 alphanumeric characters in length)" (`vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json` — op `provisioning/api-key-resource-get-api-keys`). Rotation is a `POST /apiKeys/{keyId}/regenerate`, so retrieving the current key value on GET is the intended flow.
- **Provisioning URLs.** Endpoint `/ztw/api/v1/provUrl` (`vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/provisioning_url/provisioning_url.go:16`); model field `ProvUrl string json:"provUrl,omitempty"` (`vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/provisioning_url/provisioning_url.go:23`). The contract's `GET /provUrl/{id}` returns `provUrl` plus a fully-expanded `provUrlData` block (config/registration/API/PAC servers, EC group topology) (`vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json` — op `provisioning/ec-prov-url-z-resource-get-prov-url-by-id`). The list op `GET /provUrl` returns only metadata (`desc`, `id`, `name`) — the URL body appears on the by-id read.

See [`../cloud-connector/api.md`](../cloud-connector/api.md) (the `provisioning` accessor row) and [`../cloud-connector/upgrade-and-credential-rotation.md`](../cloud-connector/upgrade-and-credential-rotation.md).

### Reveals — ZCC device secrets (by design)

The ZCC `secrets` service exists specifically to vend device secrets so an admin can block end-users from removing the client. Both endpoints are GETs that return plaintext:

- `GET /zcc/papi/public/v1/getOtp` returns per-device OTPs including `otp`, `uninstallOtp`, `logoutOtp`, `exitOtp`, `revertOtp`, and the per-product disable OTPs (`ziaDisableOtp`, `zpaDisableOtp`, `zdxDisableOtp`, …). Python: `get_otp` (`vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:33`, endpoint at `:53-56`); Go: `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:12`; contract op `zcc/public-api-controller/gets-the-one-time-password-otp-for-a-specific-device`.
- `GET /zcc/papi/public/v1/getPasswords` returns `uninstallPass`, `logoutPass`, `exitPass`, `zdSettingsAccessPass`, and the per-product disable passwords, filtered by `username` and `os_type`. Python: `get_passwords` (`vendor/zscaler-sdk-python/zscaler/zcc/secrets.py:83`, endpoint at `:107-110`); Go: `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getpasswords/getpasswords.go:12`; contract op `zcc/public-api-controller/gets-the-app-profile-password-for-a-specific-device`.

The model field lists confirm plaintext string fields with no masking (`vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:36-45`, `vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_passwords.py:33-39`). Note the `/getOtp` proxy-cache footgun documented in [`../zcc/api.md`](../zcc/api.md) — append a random query param to avoid stale OTPs.

### Reveals (contract-documented, live population unverified) — ZPA PRA credentials and enrollment certs

These two ZPA surfaces list secret fields in their GET response schema, but no downstream consumer proves the live API returns a populated value, so they are held below the ZPA-provisioning-key bar.

- **Privileged Remote Access credentials.** The credential record model carries `Passphrase`, `Password`, and `PrivateKey` (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredential/credential_controller.go:36,39,42`). The contract's `GET /credential/{id}` response schema lists `password`, `passphrase`, and `privateKey` alongside `lastCredentialResetTime` (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json` — op `privileged-credential-management/get-credential`). The same field set appears on the add (POST) request, i.e. it is a shared model — presence on the GET schema does not by itself prove the API echoes the secret back.
- **Enrollment certificates.** The model has `PrivateKey`, a companion `PrivateKeyPresent bool`, and encrypted blobs `ZrsaEncryptedPrivateKey` / `ZrsaEncryptedSessionKey` (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:35-41`). The contract's `GET /enrollmentCert/{id}` lists `privateKey`, `privateKeyPresent`, and both encrypted blobs (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json` — op `enrollment-certificates/gets-the-enrollment-certificate-details-for-the-specified-id`). The dedicated `privateKeyPresent` boolean strongly implies the GET may return the boolean **instead of** the raw key for certs whose private key Zscaler holds — but this is not provable from the schema alone.

Both are tracked as [clarification shared-39](../_meta/clarifications.md#shared-39-zpa-shared-model-secret-fields-live-get-population).

### Reveals (unprovable statically) — ZPA `/apiKeys` clientSecret

The ZPA API-keys model carries `ClientSecret string json:"clientSecret,omitempty"` on the struct shared by `Get`, `GetByName`, and `GetAll` (`vendor/zscaler-sdk-go/zscaler/zpa/services/api_keys/api_keys.go:20`, endpoint `/apiKeys` at `:14`). Unlike the other ZPA surfaces, **no Automate contract operation was found for this endpoint** — so there is no captured GET response schema to confirm or deny that `clientSecret` is returned on read. Field presence on a request/response shared model is not evidence the GET echoes it. Folded into [clarification shared-39](../_meta/clarifications.md#shared-39-zpa-shared-model-secret-fields-live-get-population).

### Protects — ZIA admin user password (write-only)

The SDK model states it outright: the `Password` field comment reads "…this field is mandatory for POST requests. This information is not provided in a GET response." (`vendor/zscaler-sdk-go/zscaler/zia/services/adminuserrolemgmt/admins/adminusers.go:37`), field at `:38`, GET at `/zia/api/v1/adminUsers/{id}` (`:14`, `:109`). The Terraform provider mirrors this: the schema description repeats the "not provided in a GET response" note (`vendor/terraform-provider-zia/zia/resource_zia_admin_users.go:110-112`), password is consumed only as input in the expand path (`:327`), and the Read function sets every other field but never `d.Set("password", …)`. Consumer behavior confirms the write-only contract.

### Protects — ZIA sandbox submission token (no read surface)

There is no GET endpoint that returns the sandbox submission token. It is a client-held credential sourced from config or the `ZSCALER_SANDBOX_TOKEN` env var (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:97`; `GetSandboxToken` at `vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:888-897`) and injected send-only as an `api_token` query param on the POST submission (`vendor/zscaler-sdk-go/zscaler/zia/services/sandbox/sandbox_submission/sandbox_submission.go:49-51`; endpoints `/zscsb/submit` and `/zscsb/discan` at `:17-18`). No capture surfaces a `sandboxSubmissionToken`/`sbApiToken` read field. The token flows one way, client → request. See [`../zia/sandbox.md`](../zia/sandbox.md) and the legacy auth matrix in [`legacy-api.md`](legacy-api.md).

### Protects — ZIA Cloud Service API key (portal-managed, no value GET)

The legacy ZIA Cloud Service API key has no value-bearing API read. The only API-visible field is a read-only boolean `obfuscateApiKey` ("Whether API key was obfuscated or not") on the auth/login schema (`vendor/zscaler-api-specs/automate-zscaler/openapi/zia.openapi.json` — `obfuscateApiKey`, `readOnly: true`), not a value-bearing key resource. In the SDK the key is a client-supplied legacy credential that is obfuscated against a timestamp for login, never fetched (`vendor/zscaler-sdk-go/zscaler/zia/v2_client.go:139` `obfuscateAPIKey`). Lifecycle (add/edit/regenerate/delete) is a portal action, not an API read (`vendor/zscaler-help/legacy-managing-cloud-service-api-key.md`). See [`legacy-api.md`](legacy-api.md).

### Protects — ZIdentity OAuth client secret (masked on GET, full only on create)

This is the cleanest "GET masked / create full" contrast in the set, and the only one with an explicit spec-level masking guarantee.

- The main API-client record returned by `GET /api-clients/{id}` carries no secret at all — its fields are `name, description, status, accessTokenLifeTime, clientAuthentication, clientResources, id` (`vendor/zscaler-sdk-python/zscaler/zid/models/api_client.py:72-131`).
- Secrets live behind a dedicated sub-resource. `GET /api-clients/{client_id}/secrets` (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:392`, endpoint at `:412-416`) returns a `value` that the OpenAPI spec documents as **masked**: "Secret values in the response are masked to prevent exposure of sensitive information." (`vendor/zscaler-api-specs/automate-zscaler/openapi/zid.openapi.json` — GET secrets description).
- The full value is returned only when minting a secret: `POST /api-clients/{client_id}/secrets` (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:436`) whose description carries no masking note (`vendor/zscaler-api-specs/automate-zscaler/openapi/zid.openapi.json` — POST secrets). There is no separate "regenerate" verb; a new secret is minted via POST. The shared secret model has a `value` field (`vendor/zscaler-sdk-python/zscaler/zid/models/api_client.py:305`), so field presence alone does not distinguish masked from full — the spec note does.

See the API-Clients-≠-admin-users framing in [`admin-rbac.md`](admin-rbac.md) and OneAPI auth in [`oneapi.md`](oneapi.md).

## Edge cases

- **ZIA VPN pre-shared key — the sources disagree.** The starting hypothesis was that `preSharedKey` is effectively write-only (that GET omits it). Static sources do **not** cleanly support that:
  - The Automate contract's `GET /vpnCredentials` and `GET /vpnCredentials/{vpnId}` both list `preSharedKey` in the 200 `response_schema` as an ordinary **non-readonly** string (`vendor/zscaler-api-specs/automate-zscaler/openapi/zia.openapi.json` — vpnCredentials GET response; also `vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json` ops `traffic-forwarding/get-vpn-credential[s]`). Unlike the ZIA admin password, the contract does **not** annotate the PSK as absent-on-GET.
  - The Go SDK struct carries `PreSharedKey string json:"preSharedKey,omitempty"` with **no** "not returned on GET" comment (`vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/vpncredentials/vpncredentials.go:37`) — contrast the admin-password struct, which has exactly that comment.
  - Yet the Terraform provider treats it as write-only: the resource schema marks it `Sensitive: true, ForceNew: true` (`vendor/terraform-provider-zia/zia/resource_zia_traffic_forwarding_vpn_credentials.go:95-100`), the resource Read sets `type/fqdn/ip_address/comments` but never `pre_shared_key` (`:192-198`), it is consumed only as input (`:272`), and the **data source explicitly comments out** the read-back: `// _ = d.Set("pre_shared_key", resp.PreSharedKey)` (`vendor/terraform-provider-zia/zia/data_source_zia_traffic_forwarding_vpn_credentials.go:135`).
  - **Honest grade:** the read *contract* advertises the PSK on GET (Tier A on the contract's field metadata), but whether a live tenant returns a populated value is unverified, and the provider's deliberate refusal to read it back is evidence its authors did not trust it to be present/usable. This is a genuine static-source disagreement, not a settled fact. Do not assert "the ZIA VPN PSK is retrievable" or "the ZIA VPN PSK is write-only" without a live read. Tracked as [clarification shared-38](../_meta/clarifications.md#shared-38-zia-vpn-presharedkey-live-get-population). See [`../zia/traffic-forwarding-methods.md`](../zia/traffic-forwarding-methods.md) and [`ipsec-tunnels.md`](ipsec-tunnels.md).
- **A secret field on a shared request/response model is not proof of read-back.** ZPA reuses one Go struct for Create requests and Get responses (provisioning keys, PRA credentials, enrollment certs, api_keys all do this). The `omitempty` tag guarantees nothing about GET population. Only a captured GET `response_schema` entry (contract) or a consumer that reads the field back (TF Read) upgrades "field exists" to "GET returns it."
- **Masked ≠ absent ≠ cleartext — three different read behaviors.** ZIdentity `GET /secrets` returns a *masked* value (field present, content redacted). ZIA admin password is *absent* on GET (field omitted entirely). ZPA provisioning key is *cleartext*. Treat them differently: a masked field can still leak length or format; an absent field cannot leak at all.
- **"Sensitive" in Terraform hides it from the console, not from state.** The ZPA provisioning-key schema is `Sensitive: true`, but the provider's own description says the value still lands in the state file and is recoverable via `terraform output` (`vendor/terraform-provider-zpa/zpa/resource_zpa_provisioning_key.go:119-124`). Sensitive-marking is log hygiene, not secret protection — the state file is a secret-bearing artifact wherever these resources are managed.
- **The list op and the by-id op can differ.** ZTW `GET /provUrl` (list) returns only metadata; the URL body appears on `GET /provUrl/{id}`. Do not assume a family's list endpoint carries the same secrets as its single-object read (or vice-versa) — grade each op.
- **Absence in one product is not absence everywhere.** ZPA Browser Access certificates expose no private key on GET (`vendor/zscaler-sdk-go/zscaler/zpa/services/bacertificate/zpa_ba_certificate.go` has `certificate`/`certChain`/`publicKey`, no `privateKey`), but ZPA *enrollment* certificates do list `privateKey` on their GET schema. "Certificates are safe to read" is false as a blanket rule.

## Operational guidance — scoping a read-only API client

**A read-only scope is not a secret-free scope.** When provisioning an API client, OAuth role, or admin whose intent is "observe the tenant," exclude the resource families below — their GET/list responses carry live credential material, and read access to them is functionally credential-issuance:

| Exclude from read-only scope | Why (what the GET yields) |
|---|---|
| ZPA provisioning keys | Cleartext enrollment key → attacker can enroll rogue App Connectors / Service Edges |
| ZTW provisioning API keys (`/apiKeys`) | Cleartext EC admin API key |
| ZTW provisioning URLs (`/provUrl/{id}`) | Full provisioning URL + topology → connector enrollment material |
| ZCC device secrets (`getOtp` / `getPasswords`) | Uninstall/disable passwords and OTPs → attacker can remove/disable the endpoint agent |
| ZPA PRA credentials (contract lists `password`/`privateKey`) | Privileged-account login material — treat as secret-bearing until a live read proves otherwise |
| ZPA enrollment certs (contract lists `privateKey`) | Certificate private key — treat as secret-bearing until a live read proves otherwise; `privateKeyPresent` may gate it |
| ZIA VPN credentials (`preSharedKey` — contested) | Contract lists the PSK on GET; unverified but not safe to assume withheld |

Conversely, these read surfaces are safe from a secret-exfiltration standpoint (they withhold or mask): **ZIA admin users** (password absent on GET), **ZIA sandbox submission** (no token read surface), **ZIA Cloud Service API key** (no value GET), **ZIdentity api-client `GET /secrets`** (masked), **ZPA Browser Access certs** (no private key).

Operationally: prefer separate credentials for "read config for audit" versus "manage enrollment/secrets," and remember that anything managed through Terraform writes these secrets to the **state file** regardless of the `Sensitive` flag — protect the state backend as a secret store. For OneAPI scoping mechanics see [`oneapi.md`](oneapi.md); for the admin/role model see [`admin-rbac.md`](admin-rbac.md).

## Worked example

**Scenario.** A platform team wants to give a monitoring vendor a "read-only" ZPA + ZTW OneAPI client to inventory connectors and locations. Someone reasons: "read-only can't leak anything sensitive."

**Why that's wrong.** A read-only client that can reach ZPA provisioning keys can call `GET /mgmtconfig/v1/admin/customers/{cid}/associationType/CONNECTOR_GRP/provisioningKey/{id}` and receive `provisioningKey` in cleartext (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:36,51-61`; TF Read proves live population, `vendor/terraform-provider-zpa/zpa/resource_zpa_provisioning_key.go:219`). With that key, the vendor — or anyone who compromises them — can enroll a rogue App Connector into the tenant. The same client hitting ZTW `GET /apiKeys` gets the EC admin API key `keyValue` in cleartext (`vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/api_keys/provisioning.go:23`).

**The fix.** Scope the client to the inventory/config families it actually needs and exclude the provisioning-key, `/apiKeys`, and `/provUrl` families per the [exclusion table](#operational-guidance-scoping-a-read-only-api-client). "Read-only" describes the HTTP verb, not the sensitivity of what comes back.

*Eval candidate:* prompt "We're giving a vendor a read-only ZPA API client — is any secret material exposed?" The correct answer names ZPA provisioning keys (and, if ZTW is in scope, `/apiKeys` and `/provUrl`) as cleartext-on-GET, not "read-only is safe."

## Open questions

- ZIA VPN `preSharedKey` on live GET — contract lists it, provider declines to read it back; live population unverified. See [clarification shared-38](../_meta/clarifications.md#shared-38-zia-vpn-presharedkey-live-get-population).
- ZPA shared-model secret fields (`/apiKeys` `clientSecret`, PRA credential `password`/`privateKey`, enrollment-cert `privateKey`) — documented on the GET schema / present on the model, but live population and any masking are unverified from static sources. See [clarification shared-39](../_meta/clarifications.md#shared-39-zpa-shared-model-secret-fields-live-get-population).

## Cross-links

- Verification tiers governing every grade above: [`../_meta/verification-protocol.md`](../_meta/verification-protocol.md)
- Legacy auth credential matrix (which product uses API key vs token vs session): [`legacy-api.md`](legacy-api.md)
- OneAPI scoping, auth flows, rate limits: [`oneapi.md`](oneapi.md)
- Admin/role model, API-clients-≠-admin-users: [`admin-rbac.md`](admin-rbac.md)
- ZPA connector provisioning keys in depth: [`../zpa/app-connector.md`](../zpa/app-connector.md)
- ZTW provisioning surface + credential rotation: [`../cloud-connector/api.md`](../cloud-connector/api.md), [`../cloud-connector/upgrade-and-credential-rotation.md`](../cloud-connector/upgrade-and-credential-rotation.md)
- ZCC device-secrets service (`getOtp` cache footgun): [`../zcc/api.md`](../zcc/api.md)
- ZIA IPSec PSK / traffic forwarding: [`../zia/traffic-forwarding-methods.md`](../zia/traffic-forwarding-methods.md), [`ipsec-tunnels.md`](ipsec-tunnels.md)
- ZIA sandbox submission token: [`../zia/sandbox.md`](../zia/sandbox.md)
