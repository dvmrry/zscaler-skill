# The ZCC Terraform provider: where its behavior is described (zcc.terraform)
Also called: zcc terraform; terraform-provider-zcc; zcc terraform provider

This walks the subjects that describe what the ZCC Terraform provider, a Plugin Framework provider, sends, reads and reports. Which API paths and SDK packages each resource uses, and its arguments (type, required or optional, computed, defaults, enum values and validators, nested blocks), are generated from the provider code: run `node scripts/kb.mjs surface <resource name>`; `provider:zcc` gives the provider's own settings.

**Configuring the provider.** Credentials, environment variables and retry defaults are in [Configuring the ZCC Terraform provider: OneAPI credentials, environment variables and defaults](kb:zcc.terraform.provider-config); what has no resource is in [What the ZCC Terraform provider covers, and what it leaves to the console](kb:zcc.terraform.coverage).

**What reaches the API.** Fields not sent, not read back or collapsed, mostly on forwarding profiles, are in [ZCC Terraform provider fields that are not sent, not read back, or collapsed](kb:zcc.terraform.field-fidelity). How trusted networks pick the v1 or v2 API is in [How the ZCC provider picks the v1 or v2 trusted-network API and converts between them](kb:zcc.terraform.trusted-network-backend).

**Through the SDK.** Paging limits that drop records from state are in [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination), zero values that cannot be sent in [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes), and legacy-mode routing in [ZCC SDK calls in legacy-client mode routed to the ZIA client](kb:zcc.sdk-go.legacy-routing).

Area: zcc.terraform, its subjects in references/_meta/spine/zcc/zcc.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
- links-to references/_meta/text/zcc/zcc.sdk-go.legacy-routing.md (ZCC SDK calls in legacy-client mode routed to the ZIA client)
- links-to references/_meta/text/zcc/zcc.terraform.coverage.md (What the ZCC Terraform provider covers, and what it leaves to the console)
- links-to references/_meta/text/zcc/zcc.terraform.field-fidelity.md (ZCC Terraform provider fields that are not sent, not read back, or collapsed)
- links-to references/_meta/text/zcc/zcc.terraform.provider-config.md (Configuring the ZCC Terraform provider: OneAPI credentials, environment variables and defaults)
- links-to references/_meta/text/zcc/zcc.terraform.trusted-network-backend.md (How the ZCC provider picks the v1 or v2 trusted-network API and converts between them)
