# The Zscaler Terraform providers: where their behavior is described (shared.terraform)
Also called: zscaler terraform; zscaler terraform providers; terraform provider zscaler; zscaler/zia; zscaler/zpa; zscaler/zcc; zscaler/ztc; terraform resource map

Zscaler publishes separate Terraform providers for ZIA, ZPA, ZCC and Cloud Connector (ZTC), and this walks the subjects that describe them. Which resources and data sources each provider has, the API paths and SDK packages each uses, and every argument (type, required or optional, computed, ForceNew, defaults, enum validators, conflicts, nested blocks) are generated from the provider code: run `node scripts/kb.mjs surface <resource name>`, or `provider:<product>` for a provider's own settings.

**Per provider.** ZIA: [The ZIA Terraform provider: where its behavior is described](kb:zia.terraform). ZPA: [The ZPA Terraform provider: where its behavior is described](kb:zpa.terraform). ZCC: [The ZCC Terraform provider: where its behavior is described](kb:zcc.terraform). Cloud Connector: [ZTC Terraform provider: configuration, field handling and read behavior](kb:cloud-connector.terraform.provider-behavior), [How the ZTC (Cloud Connector) Terraform provider applies rule order](kb:cloud-connector.terraform.rule-order), [How the ZTC Terraform provider detaches references before deleting objects](kb:cloud-connector.terraform.delete-detach) and [Whether the ZTC Terraform provider protects predefined traffic rules](kb:cloud-connector.terraform.rule-protection).

**Across providers.** Signing the providers in is in [Signing the Zscaler Terraform providers in: OneAPI, legacy credentials and clouds](kb:shared.terraform.authentication); secrets in state, plans and logs in [How the Zscaler Terraform providers store, log, and send secrets](kb:shared.terraform.credential-handling); plans that show no diff, or a replacement, in [Why a Zscaler Terraform plan shows no diff, or a replacement: diff suppression, ForceNew and code-only checks](kb:shared.terraform.plan-diffs).

**Through the Go SDK.** Paging that drops records is in [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination), zero values that cannot be sent in [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes), retries in [How the Go SDK retries requests (and replays writes)](kb:shared.sdk-go.retries), and token handling in [How the Go SDK obtains and renews OneAPI tokens](kb:shared.sdk-go.auth-lifecycle).

**Bringing existing configuration in.** The ZIA provider documentation says Zscaler offers a dedicated tool, Zscaler-Terraformer, for the automated import of ZIA configurations into Terraform HCL. [shared.terraform:terraformer-offered] What is known about its output is in [Zscaler-Terraformer: importing existing configuration into HCL](kb:shared.terraform.terraformer).

**Not yet placed.** What the Cloud App Control instance resource models as instance levels is open [gap:shared.terraform:cloud-app-instance-levels]. Features a Microtenant cannot use, such as extranet application support, are in [These features are supported only for a Default Microtenant and not for a standard Microtenant: AI-Powered Recommendations for Application Segments, Application Segments Usage, AppProtection for Private Application Traffic, Authentication Service, Browser Access with CORS, Client Hostname Validation, Disaster Recovery, Extranet Application Support, Inspect Traffic with ZIA, Log Streaming Service, Source IP-Anchor enabled applications, VPN (for Legacy Apps), Zscaler Branch Connector and Zscaler Cloud Connector.](kb:zpa.microtenants.limits:default-only-features).

What to check:
1. Whether a setting has a resource at all, in the generated surface, before assuming the provider manages it; the providers track the public API only.

Not known (open gaps):
- What instance hierarchy zia_cloud_application_instance models [gap:shared.terraform:cloud-app-instance-levels]: settled by source-read. Blocks: mapping a cloud application instance resource to the log fields that report it

Area: shared.terraform, its subjects in references/_meta/spine/shared/shared.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.delete-detach.md (How the ZTC Terraform provider detaches references before deleting objects)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.provider-behavior.md (ZTC Terraform provider: configuration, field handling and read behavior)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.rule-order.md (How the ZTC (Cloud Connector) Terraform provider applies rule order)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.rule-protection.md (Whether the ZTC Terraform provider protects predefined traffic rules)
- links-to references/_meta/text/shared/shared.sdk-go.auth-lifecycle.md (How the Go SDK obtains and renews OneAPI tokens)
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
- links-to references/_meta/text/shared/shared.terraform.authentication.md (Signing the Zscaler Terraform providers in: OneAPI, legacy credentials and clouds)
- links-to references/_meta/text/shared/shared.terraform.credential-handling.md (How the Zscaler Terraform providers store, log, and send secrets)
- links-to references/_meta/text/shared/shared.terraform.plan-diffs.md (Why a Zscaler Terraform plan shows no diff, or a replacement: diff suppression, ForceNew and code-only checks)
- links-to references/_meta/text/shared/shared.terraform.terraformer.md (Zscaler-Terraformer: importing existing configuration into HCL)
- links-to references/_meta/text/zcc/zcc.terraform.md (The ZCC Terraform provider: where its behavior is described)
- links-to references/_meta/text/zia/zia.terraform.md (The ZIA Terraform provider: where its behavior is described)
- links-to references/_meta/text/zpa/zpa.microtenants.limits.md (Microtenant limits and unsupported features)
- links-to references/_meta/text/zpa/zpa.terraform.md (The ZPA Terraform provider: where its behavior is described)
