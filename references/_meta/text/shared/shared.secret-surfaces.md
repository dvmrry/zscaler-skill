# Which Zscaler API reads return secrets: scoping a read-only API client (shared.secret-surfaces)
Also called: read-only api client secrets; secret-bearing api; least privilege api client; api read returns secret; read-only is not secret-free; api scope exclusion list; cleartext secret on get; secret-bearing api surfaces

A role that can only read can still be given credential material, because some read operations return it. This walks the read surfaces by what they return: the secret itself, a masked value, or nothing.

**Reads that return a secret.** Provisioning keys, ZTW API keys and provisioning URLs, ZCC device passwords and OTPs, and the ZPA objects whose read schemas list private keys or passwords are in [Zscaler API reads that return secret material](kb:shared.secret-surfaces.revealed).

**Reads that withhold it.** The ZIA admin password, the Sandbox submission token, the ZIA cloud service API key, ZIdentity API client secrets and Browser Access certificate keys are in [Zscaler API reads that withhold or mask a secret](kb:shared.secret-surfaces.withheld).

**Terraform state.** A secret read back by a Terraform provider is written to state whether or not the attribute is marked sensitive: [The Terraform provider marks provisioning_key Sensitive but documents that the value is stored in the state file and can be retrieved with terraform output or by referencing the attribute.](kb:zpa.app-connectors.provisioning-key-tooling:provider-stores-key-in-state); the wider picture is [How the Zscaler Terraform providers store, log, and send secrets](kb:shared.terraform.credential-handling).

What to check:
1. Whether a read-only API client or role can reach ZPA provisioning keys, which return the enrollment key in the read.
2. Whether it can reach ZTW API keys or provisioning URLs.
3. Whether it can reach the ZCC OTP and password reads, which return the values that uninstall or disable Client Connector.
4. Whether it can reach ZPA PRA credentials, enrollment certificates, API keys or ZIA VPN credentials, whose live read behavior is unverified, and treat them as secret-bearing until a read shows otherwise.
5. Whether Terraform state for these resources is stored as a secret.

Area: shared.secret-surfaces, its subjects in references/_meta/spine/shared/shared.secret-surfaces.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.secret-surfaces.revealed.md (Zscaler API reads that return secret material)
- links-to references/_meta/text/shared/shared.secret-surfaces.withheld.md (Zscaler API reads that withhold or mask a secret)
- links-to references/_meta/text/shared/shared.terraform.credential-handling.md (How the Zscaler Terraform providers store, log, and send secrets)
- links-to references/_meta/text/zpa/zpa.app-connectors.provisioning-key-tooling.md (Provisioning key fields and tool behavior across SDKs, provider and MCP)
