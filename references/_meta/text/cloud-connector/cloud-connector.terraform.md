# The ZTC Terraform provider: where its behavior is described (cloud-connector.terraform)
Also called: ztc terraform; terraform-provider-ztc; zscaler/ztc provider; cloud connector terraform provider

This walks the subjects that describe what the ZTC provider (Zscaler's name for the Cloud and Branch Connector provider, built on the Go SDK) sends, reads and reports. Which API paths and SDK packages each resource uses, and its arguments, validators and nested blocks, are generated from the provider code: run `node scripts/kb.mjs surface <resource name>`; `provider:ztw` gives the provider's own settings.

**Configuring the provider.** Credentials, environment variables, defaults and government clouds are in [ZTC Terraform provider configuration: OneAPI or legacy credentials, environment variables, defaults and government clouds](kb:cloud-connector.terraform.provider-config); client construction, ignored settings and text normalization in [ZTC Terraform provider: configuration, field handling and read behavior](kb:cloud-connector.terraform.provider-behavior); secrets in [How the Zscaler Terraform providers store, log, and send secrets](kb:shared.terraform.credential-handling).

**Activating.** The activation resource and the ztcActivator CLI are in [Activating ZTC changes from Terraform: the activation resource and the ztcActivator CLI](kb:cloud-connector.terraform.activation).

**Rules.** Forward methods, ZPA segment IDs, workload groups and DNS rule constraints are in [ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels](kb:cloud-connector.terraform.forwarding-rules); rule order in [How the ZTC (Cloud Connector) Terraform provider applies rule order](kb:cloud-connector.terraform.rule-order); predefined rules in [Whether the ZTC Terraform provider protects predefined traffic rules](kb:cloud-connector.terraform.rule-protection); reference cleanup on delete in [How the ZTC Terraform provider detaches references before deleting objects](kb:cloud-connector.terraform.delete-detach).

**Gateways.** Forwarding and DNS gateways are in [ZTC forwarding and DNS gateways in Terraform and the Go SDK: subclouds, manual proxies, and the two DNS gateway resources](kb:cloud-connector.terraform.gateways).

**Coverage and documentation.** What has no resource and how to import is in [What the ZTC Terraform provider covers, and how existing objects are imported](kb:cloud-connector.terraform.coverage); documentation errors and the location template checks in [Where the ZTC provider documentation is wrong or incomplete, and the location template checks it does not mention](kb:cloud-connector.terraform.doc-errata).

**Through the SDK.** Paging limits that drop records from state are in [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination), zero values that cannot be sent in [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes), and ZTW service defects in [Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects](kb:cloud-connector.sdk-go.service-defects).

Area: cloud-connector.terraform, its subjects in references/_meta/spine/cloud-connector/cloud-connector.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.service-defects.md (Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.activation.md (Activating ZTC changes from Terraform: the activation resource and the ztcActivator CLI)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.coverage.md (What the ZTC Terraform provider covers, and how existing objects are imported)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.delete-detach.md (How the ZTC Terraform provider detaches references before deleting objects)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.doc-errata.md (Where the ZTC provider documentation is wrong or incomplete, and the location template checks it does not mention)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.forwarding-rules.md (ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.gateways.md (ZTC forwarding and DNS gateways in Terraform and the Go SDK: subclouds, manual proxies, and the two DNS gateway resources)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.provider-behavior.md (ZTC Terraform provider: configuration, field handling and read behavior)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.provider-config.md (ZTC Terraform provider configuration: OneAPI or legacy credentials, environment variables, defaults and government clouds)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.rule-order.md (How the ZTC (Cloud Connector) Terraform provider applies rule order)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.rule-protection.md (Whether the ZTC Terraform provider protects predefined traffic rules)
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
- links-to references/_meta/text/shared/shared.terraform.credential-handling.md (How the Zscaler Terraform providers store, log, and send secrets)
