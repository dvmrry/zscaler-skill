# Zscaler API reads that return secret material (shared.secret-surfaces.revealed)
Also called: provisioning key cleartext; keyValue; provUrlData; ztw api key read; zpa enrollment certificate private key; privateKeyPresent; zpa apiKeys clientSecret; getOtp getPasswords secrets; nonceValue
Former IDs: shared-39

## ZPA provisioning keys

The enrollment key is in the object a read returns ([Both SDK models carry the provisioningKey value in the key object, so the secret is returned by a read, not only at creation.](kb:zpa.app-connectors.provisioning-key-tooling:key-readable-on-get)), and the Terraform provider keeps it in state ([The provisioning_key value is stored in Terraform state even though the attribute is marked sensitive; the doc says the ZPA API returns it in clear text and advises an encrypted remote backend, max_usage limits and ip_acl.](kb:zpa.terraform.resource-constraints:provisioning-key-in-state)). The contract's read schema has no `provisioningKey` member at all, only an undescribed `nonceValue` [divergence:shared.secret-surfaces.revealed:provisioning-key-field-name].

## Cloud Connector (ZTW) provisioning

The Cloud Connector contract's GET /apiKeys response lists each key's `keyValue`, a string described as the API key value of 12 alphanumeric characters, not marked read-only; the Go SDK models it as `KeyValue` on the `/ztw/api/v1/apiKeys` endpoint, and the contract rotates a key with POST /apiKeys/{keyId}/regenerate. [shared.secret-surfaces.revealed:ztw-api-key-value] Both the list (GET /provUrl) and the single read (GET /provUrl/{id}) of Cloud Connector provisioning URLs return `provUrl` and the expanded `provUrlData`, which includes the config, registration, API and PAC servers. [shared.secret-surfaces.revealed:ztw-prov-url]

## ZCC device secrets

The OTP and password reads return the values in plain text: [`GET /getOtp` returns the one-time passwords for a device identified by UDID; each is 10 random alphanumeric characters and can be used once. The response carries separate OTPs for actions including uninstall, logout, exit, revert, anti-tampering disable, and disabling ZIA, ZPA, ZDX and ZDP.](kb:zcc.api.devices-wire:otp), [`GET /getPasswords` returns the app profile passwords assigned to a device, found by its user name and OS type: uninstall, logout, exit, disabling ZIA, ZPA and ZDX, and `zdSettingsAccessPass`.](kb:zcc.api.devices-wire:passwords) and [A caller allowed to read `/getOtp` or `/getPasswords` can obtain, in plain text, the values that uninstall, log out of or disable services in Client Connector on a device.](kb:zcc.api.devices-wire:secrets-on-get).

## ZPA objects whose read schema lists a secret

The ZPA contract's GET enrollmentCert/{id} response lists `privateKey`, `zrsaencryptedprivatekey` and `zrsaencryptedsessionkey` as strings, alongside `privateKeyPresent`, a read-only boolean applicable only to GET calls. [shared.secret-surfaces.revealed:zpa-enrollment-cert-schema] The Go SDK's ZPA `APIKeys` struct, used for the `/apiKeys` endpoint, carries a `ClientSecret` field tagged `clientSecret`. [shared.secret-surfaces.revealed:zpa-api-keys-model] The captured ZPA contract has no apiKeys operation, so no published response schema says whether a read returns `clientSecret`. [shared.secret-surfaces.revealed:zpa-api-keys-no-contract] The PRA credential read schema lists password, private key and passphrase ([Whether the API returns password, privateKey and passphrase when a privileged credential is read](kb:zpa.api.pra-wire:credential-secrets-on-read)). Whether live reads of these return populated, masked or empty values is open [gap:shared.secret-surfaces.revealed:zpa-shared-model-secrets].

## ZIA VPN credentials

The contract lists the pre-shared key on read while the provider does not read it back: [Whether a live tenant returns preSharedKey on GET /vpnCredentials](kb:zia.traffic-forwarding.vpn-credentials:psk-live-read), [The `pre_shared_key` is omitted from the output for security reasons.](kb:zia.terraform.traffic-forwarding-resources:vpn-credential-psk-omitted).

## Microsegmentation (ZMS)

Two Microsegmentation (ZMS) GraphQL reads return credential material to any client that can query them: the nonces list selects each agent provisioning key's `key`, and `agentGroupTotpSecrets` returns an agent group's `totpSecret` and `totpQrCode`. [shared.secret-surfaces.revealed:zms-reads-return-secrets] The queries are in [Microsegmentation agent provisioning keys (nonces): portal, fields and API](kb:zms.provisioning-keys) and [What each ZMS GraphQL query takes and returns: agents, resources, groups, rules, zones, catalog, tags](kb:zms.api.queries).

What to check:
1. For an enrollment certificate, whether privateKeyPresent is true before treating the private key as readable.

Inferred, not quoted (say so when an answer rests on one):
- [shared.secret-surfaces.revealed:zpa-api-keys-no-contract] Tier B: Absence from a search: the paths of automate-zscaler/openapi/zpa.openapi.json were searched at the pin for "apiKeys" and "api-keys"; none matched.
- [shared.secret-surfaces.revealed:zms-reads-return-secrets] Tier B: Rests on the SDK's query selection sets; whether the server redacts these fields for read-only API roles is not shown by any source.

Sources disagree (name both sides):
- The contract's schema for reading a ZPA provisioning key has no `provisioningKey` member, while the Go SDK and the Terraform provider read the key from `provisioningKey`; the contract's only candidate is an undescribed `nonceValue`, and no source says the two are the same field. [divergence:shared.secret-surfaces.revealed:provisioning-key-field-name]
  - api-specs: The contract's GET provisioningKey/{id} response has a `nonceValue` string and no `provisioningKey` member.
  - sdk-go: The Go SDK reads the key from `provisioningKey`, which the Terraform provider stores in state.
  Impact: A client built from the contract alone finds no provisioning key member in the read response; the SDK naming is what consumers read today, and whether nonceValue carries the same value is unknown.

Not known (open gaps):
- Whether ZPA reads return populated secrets for API keys, PRA credentials and enrollment certificates [gap:shared.secret-surfaces.revealed:zpa-shared-model-secrets]: settled by tenant-data or lab-test. Blocks: deciding whether a read-only client that can reach these objects can obtain credentials

Area: shared.secret-surfaces, its subjects in references/_meta/spine/shared/shared.secret-surfaces.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.api.devices-wire.md (ZCC device endpoints on the wire: removal, CSV downloads, OTPs and app profile passwords)
- links-to references/_meta/text/zia/zia.terraform.traffic-forwarding-resources.md (Terraform GRE tunnel, static IP, VPN credential and location resources)
- links-to references/_meta/text/zia/zia.traffic-forwarding.vpn-credentials.md (VPN credentials for IPSec: types, immutability and keys)
- links-to references/_meta/text/zms/zms.api.queries.md (What each ZMS GraphQL query takes and returns: agents, resources, groups, rules, zones, catalog, tags)
- links-to references/_meta/text/zms/zms.provisioning-keys.md (Microsegmentation agent provisioning keys (nonces): portal, fields and API)
- links-to references/_meta/text/zpa/zpa.api.pra-wire.md (What the SDKs send and receive for ZPA Privileged Remote Access objects)
- links-to references/_meta/text/zpa/zpa.app-connectors.provisioning-key-tooling.md (Provisioning key fields and tool behavior across SDKs, provider and MCP)
- links-to references/_meta/text/zpa/zpa.terraform.resource-constraints.md (Constraints the ZPA Terraform docs and provider code place on individual resources)
